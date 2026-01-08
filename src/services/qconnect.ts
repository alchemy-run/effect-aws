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
  sdkId: "QConnect",
  serviceShapeName: "WisdomService",
});
const auth = T.AwsAuthSigv4({ name: "wisdom" });
const ver = T.ServiceVersion("2020-10-19");
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
              `https://wisdom-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://wisdom-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://wisdom.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://wisdom.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type TagKey = string;
export type ClientToken = string;
export type Name = string;
export type AssistantType = string;
export type Description = string;
export type UuidOrArn = string;
export type NextToken = string;
export type MaxResults = number;
export type WaitTimeSeconds = number;
export type RecommendationType = string;
export type RecommendationId = string;
export type Uuid = string;
export type TargetType = string;
export type QueryText = string | Redacted.Redacted<string>;
export type KnowledgeBaseSearchType = string;
export type AIAgentType = string;
export type NonEmptyString = string;
export type NonEmptySensitiveString = string | Redacted.Redacted<string>;
export type VisibilityStatus = string;
export type UuidOrArnOrEitherWithQualifier = string;
export type Origin = string;
export type Version = number;
export type AIGuardrailBlockedMessaging = string | Redacted.Redacted<string>;
export type AIGuardrailDescription = string | Redacted.Redacted<string>;
export type AIPromptType = string;
export type AIPromptTemplateType = string;
export type AIPromptModelIdentifier = string;
export type AIPromptAPIFormat = string;
export type AssociationType = string;
export type GenericArn = string;
export type MessageFilterType = string;
export type MessageType = string;
export type SessionDataNamespace = string;
export type KnowledgeBaseType = string;
export type ContentType = string;
export type TimeToLive = number;
export type ImportJobType = string;
export type UploadId = string;
export type Uri = string;
export type ContentTitle = string;
export type ContentAssociationType = string;
export type ChannelSubtype = string;
export type LanguageCode = string;
export type ContentDisposition = string;
export type AttachmentFileName = string | Redacted.Redacted<string>;
export type NonEmptyUnlimitedString = string | Redacted.Redacted<string>;
export type MessageTemplateContentSha256 = string;
export type QuickResponseName = string;
export type QuickResponseType = string;
export type QuickResponseDescription = string;
export type ShortCutKey = string;
export type Channel = string | Redacted.Redacted<string>;
export type TagValue = string;
export type UuidWithQualifier = string;
export type ContactAttributeKey = string;
export type ContactAttributeValue = string;
export type ExternalSource = string;
export type GroupingCriteria = string | Redacted.Redacted<string>;
export type GroupingValue = string | Redacted.Redacted<string>;
export type QuickResponseContent = string | Redacted.Redacted<string>;
export type Url = string | Redacted.Redacted<string>;
export type ArnWithQualifier = string;
export type MessageTemplateAttributeKey = string;
export type Relevance = string;
export type QueryConditionFieldName = string;
export type QueryConditionComparisonOperator = string;
export type CaseArn = string;
export type FilterField = string;
export type FilterOperator = string;
export type GuardrailTopicName = string | Redacted.Redacted<string>;
export type GuardrailTopicDefinition = string | Redacted.Redacted<string>;
export type GuardrailTopicExample = string | Redacted.Redacted<string>;
export type GuardrailTopicType = string | Redacted.Redacted<string>;
export type GuardrailContentFilterType = string | Redacted.Redacted<string>;
export type GuardrailFilterStrength = string | Redacted.Redacted<string>;
export type GuardrailWordText = string | Redacted.Redacted<string>;
export type GuardrailManagedWordsType = string | Redacted.Redacted<string>;
export type GuardrailPiiEntityType = string | Redacted.Redacted<string>;
export type GuardrailSensitiveInformationAction =
  | string
  | Redacted.Redacted<string>;
export type GuardrailRegexName = string | Redacted.Redacted<string>;
export type GuardrailRegexDescription = string | Redacted.Redacted<string>;
export type GuardrailRegexPattern = string | Redacted.Redacted<string>;
export type GuardrailContextualGroundingFilterType =
  | string
  | Redacted.Redacted<string>;
export type GuardrailContextualGroundingFilterThreshold = number;
export type TextAIPrompt = string | Redacted.Redacted<string>;
export type Probability = number;
export type TopK = number;
export type MaxTokensToSample = number;
export type BedrockKnowledgeBaseArn = string;
export type AccessRoleArn = string;
export type SensitiveString = string | Redacted.Redacted<string>;
export type ChunkingStrategy = string;
export type ParsingStrategy = string;
export type MessageTemplateQueryValue = string;
export type MessageTemplateQueryOperator = string;
export type Priority = string;
export type MessageTemplateFilterValue = string;
export type MessageTemplateFilterOperator = string;
export type Order = string;
export type QuickResponseQueryValue = string;
export type QuickResponseQueryOperator = string;
export type QuickResponseFilterValue = string;
export type QuickResponseFilterOperator = string;
export type WhatsAppMessageTemplateContentData = string;
export type WhatsAppBusinessAccountId = string;
export type WhatsAppMessageTemplateId = string;
export type WhatsAppMessageTemplateComponent = string;
export type MessageTemplateAttributeValue = string | Redacted.Redacted<string>;
export type AssistantStatus = string;
export type RelevanceScore = number;
export type RelevanceLevel = string;
export type RecommendationTriggerType = string;
export type RecommendationSourceType = string;
export type NotifyRecommendationsReceivedErrorMessage = string;
export type Status = string;
export type Participant = string;
export type ConversationStatus = string;
export type ConversationStatusReason = string;
export type SpanType = string;
export type SpanStatus = string;
export type KnowledgeBaseStatus = string;
export type SyncStatus = string;
export type ImportJobStatus = string;
export type ContentStatus = string;
export type MessageTemplateAttributeType = string;
export type QuickResponseStatus = string;
export type FilterAttributeKey = string;
export type AIAgentAssociationConfigurationType = string;
export type ToolType = string;
export type UrlFilterPattern = string | Redacted.Redacted<string>;
export type WebScopeType = string;
export type BedrockModelArnForParsing = string;
export type EmailHeaderKey = string;
export type EmailHeaderValue = string | Redacted.Redacted<string>;
export type PushMessageAction = string;
export type AssistantCapabilityType = string;
export type WhatsAppMessageTemplateName = string;
export type WhatsAppMessageTemplateLanguage = string;
export type WhatsAppSourceConfigurationStatus = string;
export type ReferenceType = string;
export type ParsingPromptText = string;
export type CitationSpanOffset = number;
export type WebUrl = string;
export type HighlightOffset = number;
export type LlmModelId = string;
export type SourceContentType = string;
export type QueryResultType = string;
export type ToolOverrideInputValueType = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type RecommendationIdList = string[];
export const RecommendationIdList = S.Array(S.String);
export type Channels = string | Redacted.Redacted<string>[];
export const Channels = S.Array(SensitiveString);
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface GetAssistantRequest {
  assistantId: string;
}
export const GetAssistantRequest = S.suspend(() =>
  S.Struct({ assistantId: S.String.pipe(T.HttpLabel("assistantId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assistants/{assistantId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssistantRequest",
}) as any as S.Schema<GetAssistantRequest>;
export interface DeleteAssistantRequest {
  assistantId: string;
}
export const DeleteAssistantRequest = S.suspend(() =>
  S.Struct({ assistantId: S.String.pipe(T.HttpLabel("assistantId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/assistants/{assistantId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssistantRequest",
}) as any as S.Schema<DeleteAssistantRequest>;
export interface DeleteAssistantResponse {}
export const DeleteAssistantResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssistantResponse",
}) as any as S.Schema<DeleteAssistantResponse>;
export interface ListAssistantsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListAssistantsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assistants" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssistantsRequest",
}) as any as S.Schema<ListAssistantsRequest>;
export interface GetRecommendationsRequest {
  assistantId: string;
  sessionId: string;
  maxResults?: number;
  waitTimeSeconds?: number;
  nextChunkToken?: string;
  recommendationType?: string;
}
export const GetRecommendationsRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    waitTimeSeconds: S.optional(S.Number).pipe(T.HttpQuery("waitTimeSeconds")),
    nextChunkToken: S.optional(S.String).pipe(T.HttpQuery("nextChunkToken")),
    recommendationType: S.optional(S.String).pipe(
      T.HttpQuery("recommendationType"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/sessions/{sessionId}/recommendations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecommendationsRequest",
}) as any as S.Schema<GetRecommendationsRequest>;
export interface NotifyRecommendationsReceivedRequest {
  assistantId: string;
  sessionId: string;
  recommendationIds: RecommendationIdList;
}
export const NotifyRecommendationsReceivedRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    recommendationIds: RecommendationIdList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/sessions/{sessionId}/recommendations/notify",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "NotifyRecommendationsReceivedRequest",
}) as any as S.Schema<NotifyRecommendationsReceivedRequest>;
export interface RemoveAssistantAIAgentRequest {
  assistantId: string;
  aiAgentType: string;
  orchestratorUseCase?: string;
}
export const RemoveAssistantAIAgentRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentType: S.String.pipe(T.HttpQuery("aiAgentType")),
    orchestratorUseCase: S.optional(S.String).pipe(
      T.HttpQuery("orchestratorUseCase"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/assistants/{assistantId}/aiagentConfiguration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveAssistantAIAgentRequest",
}) as any as S.Schema<RemoveAssistantAIAgentRequest>;
export interface RemoveAssistantAIAgentResponse {}
export const RemoveAssistantAIAgentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveAssistantAIAgentResponse",
}) as any as S.Schema<RemoveAssistantAIAgentResponse>;
export interface GetAIAgentRequest {
  assistantId: string;
  aiAgentId: string;
}
export const GetAIAgentRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/aiagents/{aiAgentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAIAgentRequest",
}) as any as S.Schema<GetAIAgentRequest>;
export interface TagCondition {
  key: string;
  value?: string;
}
export const TagCondition = S.suspend(() =>
  S.Struct({ key: S.String, value: S.optional(S.String) }),
).annotations({ identifier: "TagCondition" }) as any as S.Schema<TagCondition>;
export type AndConditions = TagCondition[];
export const AndConditions = S.Array(TagCondition);
export type OrCondition =
  | { andConditions: AndConditions }
  | { tagCondition: TagCondition };
export const OrCondition = S.Union(
  S.Struct({ andConditions: AndConditions }),
  S.Struct({ tagCondition: TagCondition }),
);
export type OrConditions = (typeof OrCondition)["Type"][];
export const OrConditions = S.Array(OrCondition);
export type TagFilter =
  | { tagCondition: TagCondition }
  | { andConditions: AndConditions }
  | { orConditions: OrConditions };
export const TagFilter = S.Union(
  S.Struct({ tagCondition: TagCondition }),
  S.Struct({ andConditions: AndConditions }),
  S.Struct({ orConditions: OrConditions }),
);
export interface KnowledgeBaseAssociationConfigurationData {
  contentTagFilter?: (typeof TagFilter)["Type"];
  maxResults?: number;
  overrideKnowledgeBaseSearchType?: string;
}
export const KnowledgeBaseAssociationConfigurationData = S.suspend(() =>
  S.Struct({
    contentTagFilter: S.optional(TagFilter),
    maxResults: S.optional(S.Number),
    overrideKnowledgeBaseSearchType: S.optional(S.String),
  }),
).annotations({
  identifier: "KnowledgeBaseAssociationConfigurationData",
}) as any as S.Schema<KnowledgeBaseAssociationConfigurationData>;
export type AssociationConfigurationData = {
  knowledgeBaseAssociationConfigurationData: KnowledgeBaseAssociationConfigurationData;
};
export const AssociationConfigurationData = S.Union(
  S.Struct({
    knowledgeBaseAssociationConfigurationData:
      KnowledgeBaseAssociationConfigurationData,
  }),
);
export interface AssociationConfiguration {
  associationId?: string;
  associationType?: string;
  associationConfigurationData?: (typeof AssociationConfigurationData)["Type"];
}
export const AssociationConfiguration = S.suspend(() =>
  S.Struct({
    associationId: S.optional(S.String),
    associationType: S.optional(S.String),
    associationConfigurationData: S.optional(AssociationConfigurationData),
  }),
).annotations({
  identifier: "AssociationConfiguration",
}) as any as S.Schema<AssociationConfiguration>;
export type AssociationConfigurationList = AssociationConfiguration[];
export const AssociationConfigurationList = S.Array(AssociationConfiguration);
export interface ManualSearchAIAgentConfiguration {
  answerGenerationAIPromptId?: string;
  answerGenerationAIGuardrailId?: string;
  associationConfigurations?: AssociationConfigurationList;
  locale?: string;
}
export const ManualSearchAIAgentConfiguration = S.suspend(() =>
  S.Struct({
    answerGenerationAIPromptId: S.optional(S.String),
    answerGenerationAIGuardrailId: S.optional(S.String),
    associationConfigurations: S.optional(AssociationConfigurationList),
    locale: S.optional(S.String),
  }),
).annotations({
  identifier: "ManualSearchAIAgentConfiguration",
}) as any as S.Schema<ManualSearchAIAgentConfiguration>;
export type SuggestedMessagesList = string | Redacted.Redacted<string>[];
export const SuggestedMessagesList = S.Array(SensitiveString);
export interface AnswerRecommendationAIAgentConfiguration {
  intentLabelingGenerationAIPromptId?: string;
  queryReformulationAIPromptId?: string;
  answerGenerationAIPromptId?: string;
  answerGenerationAIGuardrailId?: string;
  associationConfigurations?: AssociationConfigurationList;
  locale?: string;
  suggestedMessages?: SuggestedMessagesList;
}
export const AnswerRecommendationAIAgentConfiguration = S.suspend(() =>
  S.Struct({
    intentLabelingGenerationAIPromptId: S.optional(S.String),
    queryReformulationAIPromptId: S.optional(S.String),
    answerGenerationAIPromptId: S.optional(S.String),
    answerGenerationAIGuardrailId: S.optional(S.String),
    associationConfigurations: S.optional(AssociationConfigurationList),
    locale: S.optional(S.String),
    suggestedMessages: S.optional(SuggestedMessagesList),
  }),
).annotations({
  identifier: "AnswerRecommendationAIAgentConfiguration",
}) as any as S.Schema<AnswerRecommendationAIAgentConfiguration>;
export interface SelfServiceAIAgentConfiguration {
  selfServicePreProcessingAIPromptId?: string;
  selfServiceAnswerGenerationAIPromptId?: string;
  selfServiceAIGuardrailId?: string;
  associationConfigurations?: AssociationConfigurationList;
}
export const SelfServiceAIAgentConfiguration = S.suspend(() =>
  S.Struct({
    selfServicePreProcessingAIPromptId: S.optional(S.String),
    selfServiceAnswerGenerationAIPromptId: S.optional(S.String),
    selfServiceAIGuardrailId: S.optional(S.String),
    associationConfigurations: S.optional(AssociationConfigurationList),
  }),
).annotations({
  identifier: "SelfServiceAIAgentConfiguration",
}) as any as S.Schema<SelfServiceAIAgentConfiguration>;
export interface EmailResponseAIAgentConfiguration {
  emailResponseAIPromptId?: string;
  emailQueryReformulationAIPromptId?: string;
  locale?: string;
  associationConfigurations?: AssociationConfigurationList;
}
export const EmailResponseAIAgentConfiguration = S.suspend(() =>
  S.Struct({
    emailResponseAIPromptId: S.optional(S.String),
    emailQueryReformulationAIPromptId: S.optional(S.String),
    locale: S.optional(S.String),
    associationConfigurations: S.optional(AssociationConfigurationList),
  }),
).annotations({
  identifier: "EmailResponseAIAgentConfiguration",
}) as any as S.Schema<EmailResponseAIAgentConfiguration>;
export interface EmailOverviewAIAgentConfiguration {
  emailOverviewAIPromptId?: string;
  locale?: string;
}
export const EmailOverviewAIAgentConfiguration = S.suspend(() =>
  S.Struct({
    emailOverviewAIPromptId: S.optional(S.String),
    locale: S.optional(S.String),
  }),
).annotations({
  identifier: "EmailOverviewAIAgentConfiguration",
}) as any as S.Schema<EmailOverviewAIAgentConfiguration>;
export interface EmailGenerativeAnswerAIAgentConfiguration {
  emailGenerativeAnswerAIPromptId?: string;
  emailQueryReformulationAIPromptId?: string;
  locale?: string;
  associationConfigurations?: AssociationConfigurationList;
}
export const EmailGenerativeAnswerAIAgentConfiguration = S.suspend(() =>
  S.Struct({
    emailGenerativeAnswerAIPromptId: S.optional(S.String),
    emailQueryReformulationAIPromptId: S.optional(S.String),
    locale: S.optional(S.String),
    associationConfigurations: S.optional(AssociationConfigurationList),
  }),
).annotations({
  identifier: "EmailGenerativeAnswerAIAgentConfiguration",
}) as any as S.Schema<EmailGenerativeAnswerAIAgentConfiguration>;
export type ToolExampleList = string[];
export const ToolExampleList = S.Array(S.String);
export interface ToolInstruction {
  instruction?: string;
  examples?: ToolExampleList;
}
export const ToolInstruction = S.suspend(() =>
  S.Struct({
    instruction: S.optional(S.String),
    examples: S.optional(ToolExampleList),
  }),
).annotations({
  identifier: "ToolInstruction",
}) as any as S.Schema<ToolInstruction>;
export interface ToolOverrideConstantInputValue {
  type: string;
  value: string | Redacted.Redacted<string>;
}
export const ToolOverrideConstantInputValue = S.suspend(() =>
  S.Struct({ type: S.String, value: SensitiveString }),
).annotations({
  identifier: "ToolOverrideConstantInputValue",
}) as any as S.Schema<ToolOverrideConstantInputValue>;
export type ToolOverrideInputValueConfiguration = {
  constant: ToolOverrideConstantInputValue;
};
export const ToolOverrideInputValueConfiguration = S.Union(
  S.Struct({ constant: ToolOverrideConstantInputValue }),
);
export interface ToolOverrideInputValue {
  jsonPath: string;
  value: (typeof ToolOverrideInputValueConfiguration)["Type"];
}
export const ToolOverrideInputValue = S.suspend(() =>
  S.Struct({ jsonPath: S.String, value: ToolOverrideInputValueConfiguration }),
).annotations({
  identifier: "ToolOverrideInputValue",
}) as any as S.Schema<ToolOverrideInputValue>;
export type ToolOverrideInputValueList = ToolOverrideInputValue[];
export const ToolOverrideInputValueList = S.Array(ToolOverrideInputValue);
export interface ToolOutputConfiguration {
  outputVariableNameOverride?: string;
  sessionDataNamespace?: string;
}
export const ToolOutputConfiguration = S.suspend(() =>
  S.Struct({
    outputVariableNameOverride: S.optional(S.String),
    sessionDataNamespace: S.optional(S.String),
  }),
).annotations({
  identifier: "ToolOutputConfiguration",
}) as any as S.Schema<ToolOutputConfiguration>;
export interface ToolOutputFilter {
  jsonPath: string;
  outputConfiguration?: ToolOutputConfiguration;
}
export const ToolOutputFilter = S.suspend(() =>
  S.Struct({
    jsonPath: S.String,
    outputConfiguration: S.optional(ToolOutputConfiguration),
  }),
).annotations({
  identifier: "ToolOutputFilter",
}) as any as S.Schema<ToolOutputFilter>;
export type ToolOutputFilterList = ToolOutputFilter[];
export const ToolOutputFilterList = S.Array(ToolOutputFilter);
export interface Annotation {
  title?: string;
  destructiveHint?: boolean;
}
export const Annotation = S.suspend(() =>
  S.Struct({
    title: S.optional(S.String),
    destructiveHint: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Annotation" }) as any as S.Schema<Annotation>;
export interface UserInteractionConfiguration {
  isUserConfirmationRequired?: boolean;
}
export const UserInteractionConfiguration = S.suspend(() =>
  S.Struct({ isUserConfirmationRequired: S.optional(S.Boolean) }),
).annotations({
  identifier: "UserInteractionConfiguration",
}) as any as S.Schema<UserInteractionConfiguration>;
export interface ToolConfiguration {
  toolName: string;
  toolType: string;
  title?: string;
  toolId?: string;
  description?: string;
  instruction?: ToolInstruction;
  overrideInputValues?: ToolOverrideInputValueList;
  outputFilters?: ToolOutputFilterList;
  inputSchema?: any;
  outputSchema?: any;
  annotations?: Annotation;
  userInteractionConfiguration?: UserInteractionConfiguration;
}
export const ToolConfiguration = S.suspend(() =>
  S.Struct({
    toolName: S.String,
    toolType: S.String,
    title: S.optional(S.String),
    toolId: S.optional(S.String),
    description: S.optional(S.String),
    instruction: S.optional(ToolInstruction),
    overrideInputValues: S.optional(ToolOverrideInputValueList),
    outputFilters: S.optional(ToolOutputFilterList),
    inputSchema: S.optional(S.Any),
    outputSchema: S.optional(S.Any),
    annotations: S.optional(Annotation),
    userInteractionConfiguration: S.optional(UserInteractionConfiguration),
  }),
).annotations({
  identifier: "ToolConfiguration",
}) as any as S.Schema<ToolConfiguration>;
export type ToolConfigurationList = ToolConfiguration[];
export const ToolConfigurationList = S.Array(ToolConfiguration);
export interface OrchestrationAIAgentConfiguration {
  orchestrationAIPromptId: string;
  orchestrationAIGuardrailId?: string;
  toolConfigurations?: ToolConfigurationList;
  connectInstanceArn?: string;
  locale?: string;
}
export const OrchestrationAIAgentConfiguration = S.suspend(() =>
  S.Struct({
    orchestrationAIPromptId: S.String,
    orchestrationAIGuardrailId: S.optional(S.String),
    toolConfigurations: S.optional(ToolConfigurationList),
    connectInstanceArn: S.optional(S.String),
    locale: S.optional(S.String),
  }),
).annotations({
  identifier: "OrchestrationAIAgentConfiguration",
}) as any as S.Schema<OrchestrationAIAgentConfiguration>;
export interface NoteTakingAIAgentConfiguration {
  noteTakingAIPromptId?: string;
  noteTakingAIGuardrailId?: string;
  locale?: string;
}
export const NoteTakingAIAgentConfiguration = S.suspend(() =>
  S.Struct({
    noteTakingAIPromptId: S.optional(S.String),
    noteTakingAIGuardrailId: S.optional(S.String),
    locale: S.optional(S.String),
  }),
).annotations({
  identifier: "NoteTakingAIAgentConfiguration",
}) as any as S.Schema<NoteTakingAIAgentConfiguration>;
export interface CaseSummarizationAIAgentConfiguration {
  caseSummarizationAIPromptId?: string;
  caseSummarizationAIGuardrailId?: string;
  locale?: string;
}
export const CaseSummarizationAIAgentConfiguration = S.suspend(() =>
  S.Struct({
    caseSummarizationAIPromptId: S.optional(S.String),
    caseSummarizationAIGuardrailId: S.optional(S.String),
    locale: S.optional(S.String),
  }),
).annotations({
  identifier: "CaseSummarizationAIAgentConfiguration",
}) as any as S.Schema<CaseSummarizationAIAgentConfiguration>;
export type AIAgentConfiguration =
  | { manualSearchAIAgentConfiguration: ManualSearchAIAgentConfiguration }
  | {
      answerRecommendationAIAgentConfiguration: AnswerRecommendationAIAgentConfiguration;
    }
  | { selfServiceAIAgentConfiguration: SelfServiceAIAgentConfiguration }
  | { emailResponseAIAgentConfiguration: EmailResponseAIAgentConfiguration }
  | { emailOverviewAIAgentConfiguration: EmailOverviewAIAgentConfiguration }
  | {
      emailGenerativeAnswerAIAgentConfiguration: EmailGenerativeAnswerAIAgentConfiguration;
    }
  | { orchestrationAIAgentConfiguration: OrchestrationAIAgentConfiguration }
  | { noteTakingAIAgentConfiguration: NoteTakingAIAgentConfiguration }
  | {
      caseSummarizationAIAgentConfiguration: CaseSummarizationAIAgentConfiguration;
    };
export const AIAgentConfiguration = S.Union(
  S.Struct({
    manualSearchAIAgentConfiguration: ManualSearchAIAgentConfiguration,
  }),
  S.Struct({
    answerRecommendationAIAgentConfiguration:
      AnswerRecommendationAIAgentConfiguration,
  }),
  S.Struct({
    selfServiceAIAgentConfiguration: SelfServiceAIAgentConfiguration,
  }),
  S.Struct({
    emailResponseAIAgentConfiguration: EmailResponseAIAgentConfiguration,
  }),
  S.Struct({
    emailOverviewAIAgentConfiguration: EmailOverviewAIAgentConfiguration,
  }),
  S.Struct({
    emailGenerativeAnswerAIAgentConfiguration:
      EmailGenerativeAnswerAIAgentConfiguration,
  }),
  S.Struct({
    orchestrationAIAgentConfiguration: OrchestrationAIAgentConfiguration,
  }),
  S.Struct({ noteTakingAIAgentConfiguration: NoteTakingAIAgentConfiguration }),
  S.Struct({
    caseSummarizationAIAgentConfiguration:
      CaseSummarizationAIAgentConfiguration,
  }),
);
export interface UpdateAIAgentRequest {
  clientToken?: string;
  assistantId: string;
  aiAgentId: string;
  visibilityStatus: string;
  configuration?: (typeof AIAgentConfiguration)["Type"];
  description?: string;
}
export const UpdateAIAgentRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
    visibilityStatus: S.String,
    configuration: S.optional(AIAgentConfiguration),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/aiagents/{aiAgentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAIAgentRequest",
}) as any as S.Schema<UpdateAIAgentRequest>;
export interface DeleteAIAgentRequest {
  assistantId: string;
  aiAgentId: string;
}
export const DeleteAIAgentRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/assistants/{assistantId}/aiagents/{aiAgentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAIAgentRequest",
}) as any as S.Schema<DeleteAIAgentRequest>;
export interface DeleteAIAgentResponse {}
export const DeleteAIAgentResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAIAgentResponse",
}) as any as S.Schema<DeleteAIAgentResponse>;
export interface ListAIAgentsRequest {
  assistantId: string;
  nextToken?: string;
  maxResults?: number;
  origin?: string;
}
export const ListAIAgentsRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    origin: S.optional(S.String).pipe(T.HttpQuery("origin")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assistants/{assistantId}/aiagents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAIAgentsRequest",
}) as any as S.Schema<ListAIAgentsRequest>;
export interface CreateAIAgentVersionRequest {
  assistantId: string;
  aiAgentId: string;
  modifiedTime?: Date;
  clientToken?: string;
}
export const CreateAIAgentVersionRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/aiagents/{aiAgentId}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAIAgentVersionRequest",
}) as any as S.Schema<CreateAIAgentVersionRequest>;
export interface DeleteAIAgentVersionRequest {
  assistantId: string;
  aiAgentId: string;
  versionNumber: number;
}
export const DeleteAIAgentVersionRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
    versionNumber: S.Number.pipe(T.HttpLabel("versionNumber")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/assistants/{assistantId}/aiagents/{aiAgentId}/versions/{versionNumber}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAIAgentVersionRequest",
}) as any as S.Schema<DeleteAIAgentVersionRequest>;
export interface DeleteAIAgentVersionResponse {}
export const DeleteAIAgentVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAIAgentVersionResponse",
}) as any as S.Schema<DeleteAIAgentVersionResponse>;
export interface ListAIAgentVersionsRequest {
  assistantId: string;
  aiAgentId: string;
  nextToken?: string;
  maxResults?: number;
  origin?: string;
}
export const ListAIAgentVersionsRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    origin: S.optional(S.String).pipe(T.HttpQuery("origin")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/aiagents/{aiAgentId}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAIAgentVersionsRequest",
}) as any as S.Schema<ListAIAgentVersionsRequest>;
export interface GetAIGuardrailRequest {
  assistantId: string;
  aiGuardrailId: string;
}
export const GetAIGuardrailRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/aiguardrails/{aiGuardrailId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAIGuardrailRequest",
}) as any as S.Schema<GetAIGuardrailRequest>;
export type GuardrailTopicExamples = string | Redacted.Redacted<string>[];
export const GuardrailTopicExamples = S.Array(SensitiveString);
export interface GuardrailTopicConfig {
  name: string | Redacted.Redacted<string>;
  definition: string | Redacted.Redacted<string>;
  examples?: GuardrailTopicExamples;
  type: string | Redacted.Redacted<string>;
}
export const GuardrailTopicConfig = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    definition: SensitiveString,
    examples: S.optional(GuardrailTopicExamples),
    type: SensitiveString,
  }),
).annotations({
  identifier: "GuardrailTopicConfig",
}) as any as S.Schema<GuardrailTopicConfig>;
export type GuardrailTopicsConfig = GuardrailTopicConfig[];
export const GuardrailTopicsConfig = S.Array(GuardrailTopicConfig);
export interface AIGuardrailTopicPolicyConfig {
  topicsConfig: GuardrailTopicsConfig;
}
export const AIGuardrailTopicPolicyConfig = S.suspend(() =>
  S.Struct({ topicsConfig: GuardrailTopicsConfig }),
).annotations({
  identifier: "AIGuardrailTopicPolicyConfig",
}) as any as S.Schema<AIGuardrailTopicPolicyConfig>;
export interface GuardrailContentFilterConfig {
  type: string | Redacted.Redacted<string>;
  inputStrength: string | Redacted.Redacted<string>;
  outputStrength: string | Redacted.Redacted<string>;
}
export const GuardrailContentFilterConfig = S.suspend(() =>
  S.Struct({
    type: SensitiveString,
    inputStrength: SensitiveString,
    outputStrength: SensitiveString,
  }),
).annotations({
  identifier: "GuardrailContentFilterConfig",
}) as any as S.Schema<GuardrailContentFilterConfig>;
export type GuardrailContentFiltersConfig = GuardrailContentFilterConfig[];
export const GuardrailContentFiltersConfig = S.Array(
  GuardrailContentFilterConfig,
);
export interface AIGuardrailContentPolicyConfig {
  filtersConfig: GuardrailContentFiltersConfig;
}
export const AIGuardrailContentPolicyConfig = S.suspend(() =>
  S.Struct({ filtersConfig: GuardrailContentFiltersConfig }),
).annotations({
  identifier: "AIGuardrailContentPolicyConfig",
}) as any as S.Schema<AIGuardrailContentPolicyConfig>;
export interface GuardrailWordConfig {
  text: string | Redacted.Redacted<string>;
}
export const GuardrailWordConfig = S.suspend(() =>
  S.Struct({ text: SensitiveString }),
).annotations({
  identifier: "GuardrailWordConfig",
}) as any as S.Schema<GuardrailWordConfig>;
export type GuardrailWordsConfig = GuardrailWordConfig[];
export const GuardrailWordsConfig = S.Array(GuardrailWordConfig);
export interface GuardrailManagedWordsConfig {
  type: string | Redacted.Redacted<string>;
}
export const GuardrailManagedWordsConfig = S.suspend(() =>
  S.Struct({ type: SensitiveString }),
).annotations({
  identifier: "GuardrailManagedWordsConfig",
}) as any as S.Schema<GuardrailManagedWordsConfig>;
export type GuardrailManagedWordListsConfig = GuardrailManagedWordsConfig[];
export const GuardrailManagedWordListsConfig = S.Array(
  GuardrailManagedWordsConfig,
);
export interface AIGuardrailWordPolicyConfig {
  wordsConfig?: GuardrailWordsConfig;
  managedWordListsConfig?: GuardrailManagedWordListsConfig;
}
export const AIGuardrailWordPolicyConfig = S.suspend(() =>
  S.Struct({
    wordsConfig: S.optional(GuardrailWordsConfig),
    managedWordListsConfig: S.optional(GuardrailManagedWordListsConfig),
  }),
).annotations({
  identifier: "AIGuardrailWordPolicyConfig",
}) as any as S.Schema<AIGuardrailWordPolicyConfig>;
export interface GuardrailPiiEntityConfig {
  type: string | Redacted.Redacted<string>;
  action: string | Redacted.Redacted<string>;
}
export const GuardrailPiiEntityConfig = S.suspend(() =>
  S.Struct({ type: SensitiveString, action: SensitiveString }),
).annotations({
  identifier: "GuardrailPiiEntityConfig",
}) as any as S.Schema<GuardrailPiiEntityConfig>;
export type GuardrailPiiEntitiesConfig = GuardrailPiiEntityConfig[];
export const GuardrailPiiEntitiesConfig = S.Array(GuardrailPiiEntityConfig);
export interface GuardrailRegexConfig {
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  pattern: string | Redacted.Redacted<string>;
  action: string | Redacted.Redacted<string>;
}
export const GuardrailRegexConfig = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(SensitiveString),
    pattern: SensitiveString,
    action: SensitiveString,
  }),
).annotations({
  identifier: "GuardrailRegexConfig",
}) as any as S.Schema<GuardrailRegexConfig>;
export type GuardrailRegexesConfig = GuardrailRegexConfig[];
export const GuardrailRegexesConfig = S.Array(GuardrailRegexConfig);
export interface AIGuardrailSensitiveInformationPolicyConfig {
  piiEntitiesConfig?: GuardrailPiiEntitiesConfig;
  regexesConfig?: GuardrailRegexesConfig;
}
export const AIGuardrailSensitiveInformationPolicyConfig = S.suspend(() =>
  S.Struct({
    piiEntitiesConfig: S.optional(GuardrailPiiEntitiesConfig),
    regexesConfig: S.optional(GuardrailRegexesConfig),
  }),
).annotations({
  identifier: "AIGuardrailSensitiveInformationPolicyConfig",
}) as any as S.Schema<AIGuardrailSensitiveInformationPolicyConfig>;
export interface GuardrailContextualGroundingFilterConfig {
  type: string | Redacted.Redacted<string>;
  threshold: number;
}
export const GuardrailContextualGroundingFilterConfig = S.suspend(() =>
  S.Struct({ type: SensitiveString, threshold: S.Number }),
).annotations({
  identifier: "GuardrailContextualGroundingFilterConfig",
}) as any as S.Schema<GuardrailContextualGroundingFilterConfig>;
export type GuardrailContextualGroundingFiltersConfig =
  GuardrailContextualGroundingFilterConfig[];
export const GuardrailContextualGroundingFiltersConfig = S.Array(
  GuardrailContextualGroundingFilterConfig,
);
export interface AIGuardrailContextualGroundingPolicyConfig {
  filtersConfig: GuardrailContextualGroundingFiltersConfig;
}
export const AIGuardrailContextualGroundingPolicyConfig = S.suspend(() =>
  S.Struct({ filtersConfig: GuardrailContextualGroundingFiltersConfig }),
).annotations({
  identifier: "AIGuardrailContextualGroundingPolicyConfig",
}) as any as S.Schema<AIGuardrailContextualGroundingPolicyConfig>;
export interface UpdateAIGuardrailRequest {
  clientToken?: string;
  assistantId: string;
  aiGuardrailId: string;
  visibilityStatus: string;
  blockedInputMessaging: string | Redacted.Redacted<string>;
  blockedOutputsMessaging: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  topicPolicyConfig?: AIGuardrailTopicPolicyConfig;
  contentPolicyConfig?: AIGuardrailContentPolicyConfig;
  wordPolicyConfig?: AIGuardrailWordPolicyConfig;
  sensitiveInformationPolicyConfig?: AIGuardrailSensitiveInformationPolicyConfig;
  contextualGroundingPolicyConfig?: AIGuardrailContextualGroundingPolicyConfig;
}
export const UpdateAIGuardrailRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
    visibilityStatus: S.String,
    blockedInputMessaging: SensitiveString,
    blockedOutputsMessaging: SensitiveString,
    description: S.optional(SensitiveString),
    topicPolicyConfig: S.optional(AIGuardrailTopicPolicyConfig),
    contentPolicyConfig: S.optional(AIGuardrailContentPolicyConfig),
    wordPolicyConfig: S.optional(AIGuardrailWordPolicyConfig),
    sensitiveInformationPolicyConfig: S.optional(
      AIGuardrailSensitiveInformationPolicyConfig,
    ),
    contextualGroundingPolicyConfig: S.optional(
      AIGuardrailContextualGroundingPolicyConfig,
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/aiguardrails/{aiGuardrailId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAIGuardrailRequest",
}) as any as S.Schema<UpdateAIGuardrailRequest>;
export interface DeleteAIGuardrailRequest {
  assistantId: string;
  aiGuardrailId: string;
}
export const DeleteAIGuardrailRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/assistants/{assistantId}/aiguardrails/{aiGuardrailId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAIGuardrailRequest",
}) as any as S.Schema<DeleteAIGuardrailRequest>;
export interface DeleteAIGuardrailResponse {}
export const DeleteAIGuardrailResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAIGuardrailResponse",
}) as any as S.Schema<DeleteAIGuardrailResponse>;
export interface ListAIGuardrailsRequest {
  assistantId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAIGuardrailsRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assistants/{assistantId}/aiguardrails" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAIGuardrailsRequest",
}) as any as S.Schema<ListAIGuardrailsRequest>;
export interface CreateAIGuardrailVersionRequest {
  assistantId: string;
  aiGuardrailId: string;
  modifiedTime?: Date;
  clientToken?: string;
}
export const CreateAIGuardrailVersionRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/aiguardrails/{aiGuardrailId}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAIGuardrailVersionRequest",
}) as any as S.Schema<CreateAIGuardrailVersionRequest>;
export interface DeleteAIGuardrailVersionRequest {
  assistantId: string;
  aiGuardrailId: string;
  versionNumber: number;
}
export const DeleteAIGuardrailVersionRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
    versionNumber: S.Number.pipe(T.HttpLabel("versionNumber")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/assistants/{assistantId}/aiguardrails/{aiGuardrailId}/versions/{versionNumber}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAIGuardrailVersionRequest",
}) as any as S.Schema<DeleteAIGuardrailVersionRequest>;
export interface DeleteAIGuardrailVersionResponse {}
export const DeleteAIGuardrailVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAIGuardrailVersionResponse",
}) as any as S.Schema<DeleteAIGuardrailVersionResponse>;
export interface ListAIGuardrailVersionsRequest {
  assistantId: string;
  aiGuardrailId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAIGuardrailVersionsRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/aiguardrails/{aiGuardrailId}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAIGuardrailVersionsRequest",
}) as any as S.Schema<ListAIGuardrailVersionsRequest>;
export interface GetAIPromptRequest {
  assistantId: string;
  aiPromptId: string;
}
export const GetAIPromptRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/aiprompts/{aiPromptId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAIPromptRequest",
}) as any as S.Schema<GetAIPromptRequest>;
export interface TextFullAIPromptEditTemplateConfiguration {
  text: string | Redacted.Redacted<string>;
}
export const TextFullAIPromptEditTemplateConfiguration = S.suspend(() =>
  S.Struct({ text: SensitiveString }),
).annotations({
  identifier: "TextFullAIPromptEditTemplateConfiguration",
}) as any as S.Schema<TextFullAIPromptEditTemplateConfiguration>;
export type AIPromptTemplateConfiguration = {
  textFullAIPromptEditTemplateConfiguration: TextFullAIPromptEditTemplateConfiguration;
};
export const AIPromptTemplateConfiguration = S.Union(
  S.Struct({
    textFullAIPromptEditTemplateConfiguration:
      TextFullAIPromptEditTemplateConfiguration,
  }),
);
export interface TextAIPromptInferenceConfiguration {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokensToSample?: number;
}
export const TextAIPromptInferenceConfiguration = S.suspend(() =>
  S.Struct({
    temperature: S.optional(S.Number),
    topP: S.optional(S.Number),
    topK: S.optional(S.Number),
    maxTokensToSample: S.optional(S.Number),
  }),
).annotations({
  identifier: "TextAIPromptInferenceConfiguration",
}) as any as S.Schema<TextAIPromptInferenceConfiguration>;
export type AIPromptInferenceConfiguration = {
  textAIPromptInferenceConfiguration: TextAIPromptInferenceConfiguration;
};
export const AIPromptInferenceConfiguration = S.Union(
  S.Struct({
    textAIPromptInferenceConfiguration: TextAIPromptInferenceConfiguration,
  }),
);
export interface UpdateAIPromptRequest {
  clientToken?: string;
  assistantId: string;
  aiPromptId: string;
  visibilityStatus: string;
  templateConfiguration?: (typeof AIPromptTemplateConfiguration)["Type"];
  description?: string;
  modelId?: string;
  inferenceConfiguration?: (typeof AIPromptInferenceConfiguration)["Type"];
}
export const UpdateAIPromptRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
    visibilityStatus: S.String,
    templateConfiguration: S.optional(AIPromptTemplateConfiguration),
    description: S.optional(S.String),
    modelId: S.optional(S.String),
    inferenceConfiguration: S.optional(AIPromptInferenceConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/aiprompts/{aiPromptId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAIPromptRequest",
}) as any as S.Schema<UpdateAIPromptRequest>;
export interface DeleteAIPromptRequest {
  assistantId: string;
  aiPromptId: string;
}
export const DeleteAIPromptRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/assistants/{assistantId}/aiprompts/{aiPromptId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAIPromptRequest",
}) as any as S.Schema<DeleteAIPromptRequest>;
export interface DeleteAIPromptResponse {}
export const DeleteAIPromptResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteAIPromptResponse" },
) as any as S.Schema<DeleteAIPromptResponse>;
export interface ListAIPromptsRequest {
  assistantId: string;
  nextToken?: string;
  maxResults?: number;
  origin?: string;
}
export const ListAIPromptsRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    origin: S.optional(S.String).pipe(T.HttpQuery("origin")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assistants/{assistantId}/aiprompts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAIPromptsRequest",
}) as any as S.Schema<ListAIPromptsRequest>;
export interface CreateAIPromptVersionRequest {
  assistantId: string;
  aiPromptId: string;
  modifiedTime?: Date;
  clientToken?: string;
}
export const CreateAIPromptVersionRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/aiprompts/{aiPromptId}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAIPromptVersionRequest",
}) as any as S.Schema<CreateAIPromptVersionRequest>;
export interface DeleteAIPromptVersionRequest {
  assistantId: string;
  aiPromptId: string;
  versionNumber: number;
}
export const DeleteAIPromptVersionRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
    versionNumber: S.Number.pipe(T.HttpLabel("versionNumber")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/assistants/{assistantId}/aiprompts/{aiPromptId}/versions/{versionNumber}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAIPromptVersionRequest",
}) as any as S.Schema<DeleteAIPromptVersionRequest>;
export interface DeleteAIPromptVersionResponse {}
export const DeleteAIPromptVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAIPromptVersionResponse",
}) as any as S.Schema<DeleteAIPromptVersionResponse>;
export interface ListAIPromptVersionsRequest {
  assistantId: string;
  aiPromptId: string;
  nextToken?: string;
  maxResults?: number;
  origin?: string;
}
export const ListAIPromptVersionsRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    origin: S.optional(S.String).pipe(T.HttpQuery("origin")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/aiprompts/{aiPromptId}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAIPromptVersionsRequest",
}) as any as S.Schema<ListAIPromptVersionsRequest>;
export interface GetAssistantAssociationRequest {
  assistantAssociationId: string;
  assistantId: string;
}
export const GetAssistantAssociationRequest = S.suspend(() =>
  S.Struct({
    assistantAssociationId: S.String.pipe(
      T.HttpLabel("assistantAssociationId"),
    ),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/associations/{assistantAssociationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssistantAssociationRequest",
}) as any as S.Schema<GetAssistantAssociationRequest>;
export interface DeleteAssistantAssociationRequest {
  assistantAssociationId: string;
  assistantId: string;
}
export const DeleteAssistantAssociationRequest = S.suspend(() =>
  S.Struct({
    assistantAssociationId: S.String.pipe(
      T.HttpLabel("assistantAssociationId"),
    ),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/assistants/{assistantId}/associations/{assistantAssociationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssistantAssociationRequest",
}) as any as S.Schema<DeleteAssistantAssociationRequest>;
export interface DeleteAssistantAssociationResponse {}
export const DeleteAssistantAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssistantAssociationResponse",
}) as any as S.Schema<DeleteAssistantAssociationResponse>;
export interface ListAssistantAssociationsRequest {
  nextToken?: string;
  maxResults?: number;
  assistantId: string;
}
export const ListAssistantAssociationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assistants/{assistantId}/associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssistantAssociationsRequest",
}) as any as S.Schema<ListAssistantAssociationsRequest>;
export interface GetSessionRequest {
  assistantId: string;
  sessionId: string;
}
export const GetSessionRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/sessions/{sessionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSessionRequest",
}) as any as S.Schema<GetSessionRequest>;
export interface AIAgentConfigurationData {
  aiAgentId: string;
}
export const AIAgentConfigurationData = S.suspend(() =>
  S.Struct({ aiAgentId: S.String }),
).annotations({
  identifier: "AIAgentConfigurationData",
}) as any as S.Schema<AIAgentConfigurationData>;
export type AIAgentConfigurationMap = {
  [key: string]: AIAgentConfigurationData;
};
export const AIAgentConfigurationMap = S.Record({
  key: S.String,
  value: AIAgentConfigurationData,
});
export interface OrchestratorConfigurationEntry {
  aiAgentId?: string;
  orchestratorUseCase: string;
}
export const OrchestratorConfigurationEntry = S.suspend(() =>
  S.Struct({ aiAgentId: S.optional(S.String), orchestratorUseCase: S.String }),
).annotations({
  identifier: "OrchestratorConfigurationEntry",
}) as any as S.Schema<OrchestratorConfigurationEntry>;
export type OrchestratorConfigurationList = OrchestratorConfigurationEntry[];
export const OrchestratorConfigurationList = S.Array(
  OrchestratorConfigurationEntry,
);
export interface UpdateSessionRequest {
  assistantId: string;
  sessionId: string;
  description?: string;
  tagFilter?: (typeof TagFilter)["Type"];
  aiAgentConfiguration?: AIAgentConfigurationMap;
  orchestratorConfigurationList?: OrchestratorConfigurationList;
  removeOrchestratorConfigurationList?: boolean;
}
export const UpdateSessionRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    description: S.optional(S.String),
    tagFilter: S.optional(TagFilter),
    aiAgentConfiguration: S.optional(AIAgentConfigurationMap),
    orchestratorConfigurationList: S.optional(OrchestratorConfigurationList),
    removeOrchestratorConfigurationList: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/sessions/{sessionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSessionRequest",
}) as any as S.Schema<UpdateSessionRequest>;
export interface GetNextMessageRequest {
  assistantId: string;
  sessionId: string;
  nextMessageToken: string;
}
export const GetNextMessageRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    nextMessageToken: S.String.pipe(T.HttpQuery("nextMessageToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/sessions/{sessionId}/messages/next",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetNextMessageRequest",
}) as any as S.Schema<GetNextMessageRequest>;
export interface ListMessagesRequest {
  assistantId: string;
  sessionId: string;
  nextToken?: string;
  maxResults?: number;
  filter?: string;
}
export const ListMessagesRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    filter: S.optional(S.String).pipe(T.HttpQuery("filter")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/sessions/{sessionId}/messages",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMessagesRequest",
}) as any as S.Schema<ListMessagesRequest>;
export interface ListSpansRequest {
  assistantId: string;
  sessionId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSpansRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assistants/{assistantId}/sessions/{sessionId}/spans",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSpansRequest",
}) as any as S.Schema<ListSpansRequest>;
export interface GetKnowledgeBaseRequest {
  knowledgeBaseId: string;
}
export const GetKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/knowledgeBases/{knowledgeBaseId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKnowledgeBaseRequest",
}) as any as S.Schema<GetKnowledgeBaseRequest>;
export interface DeleteKnowledgeBaseRequest {
  knowledgeBaseId: string;
}
export const DeleteKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/knowledgeBases/{knowledgeBaseId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKnowledgeBaseRequest",
}) as any as S.Schema<DeleteKnowledgeBaseRequest>;
export interface DeleteKnowledgeBaseResponse {}
export const DeleteKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteKnowledgeBaseResponse",
}) as any as S.Schema<DeleteKnowledgeBaseResponse>;
export interface ListKnowledgeBasesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListKnowledgeBasesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/knowledgeBases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKnowledgeBasesRequest",
}) as any as S.Schema<ListKnowledgeBasesRequest>;
export interface DeleteImportJobRequest {
  knowledgeBaseId: string;
  importJobId: string;
}
export const DeleteImportJobRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    importJobId: S.String.pipe(T.HttpLabel("importJobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgeBases/{knowledgeBaseId}/importJobs/{importJobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteImportJobRequest",
}) as any as S.Schema<DeleteImportJobRequest>;
export interface DeleteImportJobResponse {}
export const DeleteImportJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteImportJobResponse",
}) as any as S.Schema<DeleteImportJobResponse>;
export interface GetImportJobRequest {
  importJobId: string;
  knowledgeBaseId: string;
}
export const GetImportJobRequest = S.suspend(() =>
  S.Struct({
    importJobId: S.String.pipe(T.HttpLabel("importJobId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/importJobs/{importJobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetImportJobRequest",
}) as any as S.Schema<GetImportJobRequest>;
export interface ListImportJobsRequest {
  nextToken?: string;
  maxResults?: number;
  knowledgeBaseId: string;
}
export const ListImportJobsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/importJobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListImportJobsRequest",
}) as any as S.Schema<ListImportJobsRequest>;
export interface RemoveKnowledgeBaseTemplateUriRequest {
  knowledgeBaseId: string;
}
export const RemoveKnowledgeBaseTemplateUriRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgeBases/{knowledgeBaseId}/templateUri",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveKnowledgeBaseTemplateUriRequest",
}) as any as S.Schema<RemoveKnowledgeBaseTemplateUriRequest>;
export interface RemoveKnowledgeBaseTemplateUriResponse {}
export const RemoveKnowledgeBaseTemplateUriResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveKnowledgeBaseTemplateUriResponse",
}) as any as S.Schema<RemoveKnowledgeBaseTemplateUriResponse>;
export interface Filter {
  field: string;
  operator: string;
  value: string;
}
export const Filter = S.suspend(() =>
  S.Struct({ field: S.String, operator: S.String, value: S.String }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface SearchExpression {
  filters: FilterList;
}
export const SearchExpression = S.suspend(() =>
  S.Struct({ filters: FilterList }),
).annotations({
  identifier: "SearchExpression",
}) as any as S.Schema<SearchExpression>;
export interface SearchContentRequest {
  nextToken?: string;
  maxResults?: number;
  knowledgeBaseId: string;
  searchExpression: SearchExpression;
}
export const SearchContentRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    searchExpression: SearchExpression,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/search",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchContentRequest",
}) as any as S.Schema<SearchContentRequest>;
export interface StartContentUploadRequest {
  knowledgeBaseId: string;
  contentType: string;
  presignedUrlTimeToLive?: number;
}
export const StartContentUploadRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentType: S.String,
    presignedUrlTimeToLive: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/upload",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartContentUploadRequest",
}) as any as S.Schema<StartContentUploadRequest>;
export interface UpdateKnowledgeBaseTemplateUriRequest {
  knowledgeBaseId: string;
  templateUri: string;
}
export const UpdateKnowledgeBaseTemplateUriRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    templateUri: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/templateUri",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKnowledgeBaseTemplateUriRequest",
}) as any as S.Schema<UpdateKnowledgeBaseTemplateUriRequest>;
export type ContentMetadata = { [key: string]: string };
export const ContentMetadata = S.Record({ key: S.String, value: S.String });
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateContentRequest {
  knowledgeBaseId: string;
  name: string;
  title?: string;
  overrideLinkOutUri?: string;
  metadata?: ContentMetadata;
  uploadId: string;
  clientToken?: string;
  tags?: Tags;
}
export const CreateContentRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    name: S.String,
    title: S.optional(S.String),
    overrideLinkOutUri: S.optional(S.String),
    metadata: S.optional(ContentMetadata),
    uploadId: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateContentRequest",
}) as any as S.Schema<CreateContentRequest>;
export interface GetContentRequest {
  contentId: string;
  knowledgeBaseId: string;
}
export const GetContentRequest = S.suspend(() =>
  S.Struct({
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContentRequest",
}) as any as S.Schema<GetContentRequest>;
export interface UpdateContentRequest {
  knowledgeBaseId: string;
  contentId: string;
  revisionId?: string;
  title?: string;
  overrideLinkOutUri?: string;
  removeOverrideLinkOutUri?: boolean;
  metadata?: ContentMetadata;
  uploadId?: string;
}
export const UpdateContentRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    revisionId: S.optional(S.String),
    title: S.optional(S.String),
    overrideLinkOutUri: S.optional(S.String),
    removeOverrideLinkOutUri: S.optional(S.Boolean),
    metadata: S.optional(ContentMetadata),
    uploadId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateContentRequest",
}) as any as S.Schema<UpdateContentRequest>;
export interface DeleteContentRequest {
  knowledgeBaseId: string;
  contentId: string;
}
export const DeleteContentRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteContentRequest",
}) as any as S.Schema<DeleteContentRequest>;
export interface DeleteContentResponse {}
export const DeleteContentResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteContentResponse",
}) as any as S.Schema<DeleteContentResponse>;
export interface ListContentsRequest {
  nextToken?: string;
  maxResults?: number;
  knowledgeBaseId: string;
}
export const ListContentsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListContentsRequest",
}) as any as S.Schema<ListContentsRequest>;
export interface GetContentSummaryRequest {
  contentId: string;
  knowledgeBaseId: string;
}
export const GetContentSummaryRequest = S.suspend(() =>
  S.Struct({
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}/summary",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContentSummaryRequest",
}) as any as S.Schema<GetContentSummaryRequest>;
export interface GetContentAssociationRequest {
  knowledgeBaseId: string;
  contentId: string;
  contentAssociationId: string;
}
export const GetContentAssociationRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    contentAssociationId: S.String.pipe(T.HttpLabel("contentAssociationId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}/associations/{contentAssociationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContentAssociationRequest",
}) as any as S.Schema<GetContentAssociationRequest>;
export interface DeleteContentAssociationRequest {
  knowledgeBaseId: string;
  contentId: string;
  contentAssociationId: string;
}
export const DeleteContentAssociationRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    contentAssociationId: S.String.pipe(T.HttpLabel("contentAssociationId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}/associations/{contentAssociationId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteContentAssociationRequest",
}) as any as S.Schema<DeleteContentAssociationRequest>;
export interface DeleteContentAssociationResponse {}
export const DeleteContentAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteContentAssociationResponse",
}) as any as S.Schema<DeleteContentAssociationResponse>;
export interface ListContentAssociationsRequest {
  nextToken?: string;
  maxResults?: number;
  knowledgeBaseId: string;
  contentId: string;
}
export const ListContentAssociationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}/associations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListContentAssociationsRequest",
}) as any as S.Schema<ListContentAssociationsRequest>;
export interface GetMessageTemplateRequest {
  messageTemplateId: string;
  knowledgeBaseId: string;
}
export const GetMessageTemplateRequest = S.suspend(() =>
  S.Struct({
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates/{messageTemplateId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMessageTemplateRequest",
}) as any as S.Schema<GetMessageTemplateRequest>;
export type MessageTemplateBodyContentProvider = {
  content: string | Redacted.Redacted<string>;
};
export const MessageTemplateBodyContentProvider = S.Union(
  S.Struct({ content: SensitiveString }),
);
export interface EmailMessageTemplateContentBody {
  plainText?: (typeof MessageTemplateBodyContentProvider)["Type"];
  html?: (typeof MessageTemplateBodyContentProvider)["Type"];
}
export const EmailMessageTemplateContentBody = S.suspend(() =>
  S.Struct({
    plainText: S.optional(MessageTemplateBodyContentProvider),
    html: S.optional(MessageTemplateBodyContentProvider),
  }),
).annotations({
  identifier: "EmailMessageTemplateContentBody",
}) as any as S.Schema<EmailMessageTemplateContentBody>;
export interface EmailHeader {
  name?: string;
  value?: string | Redacted.Redacted<string>;
}
export const EmailHeader = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(SensitiveString) }),
).annotations({ identifier: "EmailHeader" }) as any as S.Schema<EmailHeader>;
export type EmailHeaders = EmailHeader[];
export const EmailHeaders = S.Array(EmailHeader);
export interface EmailMessageTemplateContent {
  subject?: string | Redacted.Redacted<string>;
  body?: EmailMessageTemplateContentBody;
  headers?: EmailHeaders;
}
export const EmailMessageTemplateContent = S.suspend(() =>
  S.Struct({
    subject: S.optional(SensitiveString),
    body: S.optional(EmailMessageTemplateContentBody),
    headers: S.optional(EmailHeaders),
  }),
).annotations({
  identifier: "EmailMessageTemplateContent",
}) as any as S.Schema<EmailMessageTemplateContent>;
export interface SMSMessageTemplateContentBody {
  plainText?: (typeof MessageTemplateBodyContentProvider)["Type"];
}
export const SMSMessageTemplateContentBody = S.suspend(() =>
  S.Struct({ plainText: S.optional(MessageTemplateBodyContentProvider) }),
).annotations({
  identifier: "SMSMessageTemplateContentBody",
}) as any as S.Schema<SMSMessageTemplateContentBody>;
export interface SMSMessageTemplateContent {
  body?: SMSMessageTemplateContentBody;
}
export const SMSMessageTemplateContent = S.suspend(() =>
  S.Struct({ body: S.optional(SMSMessageTemplateContentBody) }),
).annotations({
  identifier: "SMSMessageTemplateContent",
}) as any as S.Schema<SMSMessageTemplateContent>;
export interface WhatsAppMessageTemplateContent {
  data?: string;
}
export const WhatsAppMessageTemplateContent = S.suspend(() =>
  S.Struct({ data: S.optional(S.String) }),
).annotations({
  identifier: "WhatsAppMessageTemplateContent",
}) as any as S.Schema<WhatsAppMessageTemplateContent>;
export interface PushADMMessageTemplateContent {
  title?: string | Redacted.Redacted<string>;
  body?: (typeof MessageTemplateBodyContentProvider)["Type"];
  action?: string;
  sound?: string | Redacted.Redacted<string>;
  url?: string | Redacted.Redacted<string>;
  imageUrl?: string | Redacted.Redacted<string>;
  imageIconUrl?: string | Redacted.Redacted<string>;
  smallImageIconUrl?: string | Redacted.Redacted<string>;
  rawContent?: (typeof MessageTemplateBodyContentProvider)["Type"];
}
export const PushADMMessageTemplateContent = S.suspend(() =>
  S.Struct({
    title: S.optional(SensitiveString),
    body: S.optional(MessageTemplateBodyContentProvider),
    action: S.optional(S.String),
    sound: S.optional(SensitiveString),
    url: S.optional(SensitiveString),
    imageUrl: S.optional(SensitiveString),
    imageIconUrl: S.optional(SensitiveString),
    smallImageIconUrl: S.optional(SensitiveString),
    rawContent: S.optional(MessageTemplateBodyContentProvider),
  }),
).annotations({
  identifier: "PushADMMessageTemplateContent",
}) as any as S.Schema<PushADMMessageTemplateContent>;
export interface PushAPNSMessageTemplateContent {
  title?: string | Redacted.Redacted<string>;
  body?: (typeof MessageTemplateBodyContentProvider)["Type"];
  action?: string;
  sound?: string | Redacted.Redacted<string>;
  url?: string | Redacted.Redacted<string>;
  mediaUrl?: string | Redacted.Redacted<string>;
  rawContent?: (typeof MessageTemplateBodyContentProvider)["Type"];
}
export const PushAPNSMessageTemplateContent = S.suspend(() =>
  S.Struct({
    title: S.optional(SensitiveString),
    body: S.optional(MessageTemplateBodyContentProvider),
    action: S.optional(S.String),
    sound: S.optional(SensitiveString),
    url: S.optional(SensitiveString),
    mediaUrl: S.optional(SensitiveString),
    rawContent: S.optional(MessageTemplateBodyContentProvider),
  }),
).annotations({
  identifier: "PushAPNSMessageTemplateContent",
}) as any as S.Schema<PushAPNSMessageTemplateContent>;
export interface PushFCMMessageTemplateContent {
  title?: string | Redacted.Redacted<string>;
  body?: (typeof MessageTemplateBodyContentProvider)["Type"];
  action?: string;
  sound?: string | Redacted.Redacted<string>;
  url?: string | Redacted.Redacted<string>;
  imageUrl?: string | Redacted.Redacted<string>;
  imageIconUrl?: string | Redacted.Redacted<string>;
  smallImageIconUrl?: string | Redacted.Redacted<string>;
  rawContent?: (typeof MessageTemplateBodyContentProvider)["Type"];
}
export const PushFCMMessageTemplateContent = S.suspend(() =>
  S.Struct({
    title: S.optional(SensitiveString),
    body: S.optional(MessageTemplateBodyContentProvider),
    action: S.optional(S.String),
    sound: S.optional(SensitiveString),
    url: S.optional(SensitiveString),
    imageUrl: S.optional(SensitiveString),
    imageIconUrl: S.optional(SensitiveString),
    smallImageIconUrl: S.optional(SensitiveString),
    rawContent: S.optional(MessageTemplateBodyContentProvider),
  }),
).annotations({
  identifier: "PushFCMMessageTemplateContent",
}) as any as S.Schema<PushFCMMessageTemplateContent>;
export interface PushBaiduMessageTemplateContent {
  title?: string | Redacted.Redacted<string>;
  body?: (typeof MessageTemplateBodyContentProvider)["Type"];
  action?: string;
  sound?: string | Redacted.Redacted<string>;
  url?: string | Redacted.Redacted<string>;
  imageUrl?: string | Redacted.Redacted<string>;
  imageIconUrl?: string | Redacted.Redacted<string>;
  smallImageIconUrl?: string | Redacted.Redacted<string>;
  rawContent?: (typeof MessageTemplateBodyContentProvider)["Type"];
}
export const PushBaiduMessageTemplateContent = S.suspend(() =>
  S.Struct({
    title: S.optional(SensitiveString),
    body: S.optional(MessageTemplateBodyContentProvider),
    action: S.optional(S.String),
    sound: S.optional(SensitiveString),
    url: S.optional(SensitiveString),
    imageUrl: S.optional(SensitiveString),
    imageIconUrl: S.optional(SensitiveString),
    smallImageIconUrl: S.optional(SensitiveString),
    rawContent: S.optional(MessageTemplateBodyContentProvider),
  }),
).annotations({
  identifier: "PushBaiduMessageTemplateContent",
}) as any as S.Schema<PushBaiduMessageTemplateContent>;
export interface PushMessageTemplateContent {
  adm?: PushADMMessageTemplateContent;
  apns?: PushAPNSMessageTemplateContent;
  fcm?: PushFCMMessageTemplateContent;
  baidu?: PushBaiduMessageTemplateContent;
}
export const PushMessageTemplateContent = S.suspend(() =>
  S.Struct({
    adm: S.optional(PushADMMessageTemplateContent),
    apns: S.optional(PushAPNSMessageTemplateContent),
    fcm: S.optional(PushFCMMessageTemplateContent),
    baidu: S.optional(PushBaiduMessageTemplateContent),
  }),
).annotations({
  identifier: "PushMessageTemplateContent",
}) as any as S.Schema<PushMessageTemplateContent>;
export type MessageTemplateContentProvider =
  | { email: EmailMessageTemplateContent }
  | { sms: SMSMessageTemplateContent }
  | { whatsApp: WhatsAppMessageTemplateContent }
  | { push: PushMessageTemplateContent };
export const MessageTemplateContentProvider = S.Union(
  S.Struct({ email: EmailMessageTemplateContent }),
  S.Struct({ sms: SMSMessageTemplateContent }),
  S.Struct({ whatsApp: WhatsAppMessageTemplateContent }),
  S.Struct({ push: PushMessageTemplateContent }),
);
export type WhatsAppMessageTemplateComponents = string[];
export const WhatsAppMessageTemplateComponents = S.Array(S.String);
export interface WhatsAppMessageTemplateSourceConfiguration {
  businessAccountId: string;
  templateId: string;
  components?: WhatsAppMessageTemplateComponents;
}
export const WhatsAppMessageTemplateSourceConfiguration = S.suspend(() =>
  S.Struct({
    businessAccountId: S.String,
    templateId: S.String,
    components: S.optional(WhatsAppMessageTemplateComponents),
  }),
).annotations({
  identifier: "WhatsAppMessageTemplateSourceConfiguration",
}) as any as S.Schema<WhatsAppMessageTemplateSourceConfiguration>;
export type MessageTemplateSourceConfiguration = {
  whatsApp: WhatsAppMessageTemplateSourceConfiguration;
};
export const MessageTemplateSourceConfiguration = S.Union(
  S.Struct({ whatsApp: WhatsAppMessageTemplateSourceConfiguration }),
);
export interface SystemEndpointAttributes {
  address?: string | Redacted.Redacted<string>;
}
export const SystemEndpointAttributes = S.suspend(() =>
  S.Struct({ address: S.optional(SensitiveString) }),
).annotations({
  identifier: "SystemEndpointAttributes",
}) as any as S.Schema<SystemEndpointAttributes>;
export interface SystemAttributes {
  name?: string | Redacted.Redacted<string>;
  customerEndpoint?: SystemEndpointAttributes;
  systemEndpoint?: SystemEndpointAttributes;
}
export const SystemAttributes = S.suspend(() =>
  S.Struct({
    name: S.optional(SensitiveString),
    customerEndpoint: S.optional(SystemEndpointAttributes),
    systemEndpoint: S.optional(SystemEndpointAttributes),
  }),
).annotations({
  identifier: "SystemAttributes",
}) as any as S.Schema<SystemAttributes>;
export interface AgentAttributes {
  firstName?: string | Redacted.Redacted<string>;
  lastName?: string | Redacted.Redacted<string>;
}
export const AgentAttributes = S.suspend(() =>
  S.Struct({
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AgentAttributes",
}) as any as S.Schema<AgentAttributes>;
export type CustomAttributes = {
  [key: string]: string | Redacted.Redacted<string>;
};
export const CustomAttributes = S.Record({
  key: S.String,
  value: SensitiveString,
});
export interface CustomerProfileAttributes {
  profileId?: string | Redacted.Redacted<string>;
  profileARN?: string | Redacted.Redacted<string>;
  firstName?: string | Redacted.Redacted<string>;
  middleName?: string | Redacted.Redacted<string>;
  lastName?: string | Redacted.Redacted<string>;
  accountNumber?: string | Redacted.Redacted<string>;
  emailAddress?: string | Redacted.Redacted<string>;
  phoneNumber?: string | Redacted.Redacted<string>;
  additionalInformation?: string | Redacted.Redacted<string>;
  partyType?: string | Redacted.Redacted<string>;
  businessName?: string | Redacted.Redacted<string>;
  birthDate?: string | Redacted.Redacted<string>;
  gender?: string | Redacted.Redacted<string>;
  mobilePhoneNumber?: string | Redacted.Redacted<string>;
  homePhoneNumber?: string | Redacted.Redacted<string>;
  businessPhoneNumber?: string | Redacted.Redacted<string>;
  businessEmailAddress?: string | Redacted.Redacted<string>;
  address1?: string | Redacted.Redacted<string>;
  address2?: string | Redacted.Redacted<string>;
  address3?: string | Redacted.Redacted<string>;
  address4?: string | Redacted.Redacted<string>;
  city?: string | Redacted.Redacted<string>;
  county?: string | Redacted.Redacted<string>;
  country?: string | Redacted.Redacted<string>;
  postalCode?: string | Redacted.Redacted<string>;
  province?: string | Redacted.Redacted<string>;
  state?: string | Redacted.Redacted<string>;
  shippingAddress1?: string | Redacted.Redacted<string>;
  shippingAddress2?: string | Redacted.Redacted<string>;
  shippingAddress3?: string | Redacted.Redacted<string>;
  shippingAddress4?: string | Redacted.Redacted<string>;
  shippingCity?: string | Redacted.Redacted<string>;
  shippingCounty?: string | Redacted.Redacted<string>;
  shippingCountry?: string | Redacted.Redacted<string>;
  shippingPostalCode?: string | Redacted.Redacted<string>;
  shippingProvince?: string | Redacted.Redacted<string>;
  shippingState?: string | Redacted.Redacted<string>;
  mailingAddress1?: string | Redacted.Redacted<string>;
  mailingAddress2?: string | Redacted.Redacted<string>;
  mailingAddress3?: string | Redacted.Redacted<string>;
  mailingAddress4?: string | Redacted.Redacted<string>;
  mailingCity?: string | Redacted.Redacted<string>;
  mailingCounty?: string | Redacted.Redacted<string>;
  mailingCountry?: string | Redacted.Redacted<string>;
  mailingPostalCode?: string | Redacted.Redacted<string>;
  mailingProvince?: string | Redacted.Redacted<string>;
  mailingState?: string | Redacted.Redacted<string>;
  billingAddress1?: string | Redacted.Redacted<string>;
  billingAddress2?: string | Redacted.Redacted<string>;
  billingAddress3?: string | Redacted.Redacted<string>;
  billingAddress4?: string | Redacted.Redacted<string>;
  billingCity?: string | Redacted.Redacted<string>;
  billingCounty?: string | Redacted.Redacted<string>;
  billingCountry?: string | Redacted.Redacted<string>;
  billingPostalCode?: string | Redacted.Redacted<string>;
  billingProvince?: string | Redacted.Redacted<string>;
  billingState?: string | Redacted.Redacted<string>;
  custom?: CustomAttributes;
}
export const CustomerProfileAttributes = S.suspend(() =>
  S.Struct({
    profileId: S.optional(SensitiveString),
    profileARN: S.optional(SensitiveString),
    firstName: S.optional(SensitiveString),
    middleName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
    accountNumber: S.optional(SensitiveString),
    emailAddress: S.optional(SensitiveString),
    phoneNumber: S.optional(SensitiveString),
    additionalInformation: S.optional(SensitiveString),
    partyType: S.optional(SensitiveString),
    businessName: S.optional(SensitiveString),
    birthDate: S.optional(SensitiveString),
    gender: S.optional(SensitiveString),
    mobilePhoneNumber: S.optional(SensitiveString),
    homePhoneNumber: S.optional(SensitiveString),
    businessPhoneNumber: S.optional(SensitiveString),
    businessEmailAddress: S.optional(SensitiveString),
    address1: S.optional(SensitiveString),
    address2: S.optional(SensitiveString),
    address3: S.optional(SensitiveString),
    address4: S.optional(SensitiveString),
    city: S.optional(SensitiveString),
    county: S.optional(SensitiveString),
    country: S.optional(SensitiveString),
    postalCode: S.optional(SensitiveString),
    province: S.optional(SensitiveString),
    state: S.optional(SensitiveString),
    shippingAddress1: S.optional(SensitiveString),
    shippingAddress2: S.optional(SensitiveString),
    shippingAddress3: S.optional(SensitiveString),
    shippingAddress4: S.optional(SensitiveString),
    shippingCity: S.optional(SensitiveString),
    shippingCounty: S.optional(SensitiveString),
    shippingCountry: S.optional(SensitiveString),
    shippingPostalCode: S.optional(SensitiveString),
    shippingProvince: S.optional(SensitiveString),
    shippingState: S.optional(SensitiveString),
    mailingAddress1: S.optional(SensitiveString),
    mailingAddress2: S.optional(SensitiveString),
    mailingAddress3: S.optional(SensitiveString),
    mailingAddress4: S.optional(SensitiveString),
    mailingCity: S.optional(SensitiveString),
    mailingCounty: S.optional(SensitiveString),
    mailingCountry: S.optional(SensitiveString),
    mailingPostalCode: S.optional(SensitiveString),
    mailingProvince: S.optional(SensitiveString),
    mailingState: S.optional(SensitiveString),
    billingAddress1: S.optional(SensitiveString),
    billingAddress2: S.optional(SensitiveString),
    billingAddress3: S.optional(SensitiveString),
    billingAddress4: S.optional(SensitiveString),
    billingCity: S.optional(SensitiveString),
    billingCounty: S.optional(SensitiveString),
    billingCountry: S.optional(SensitiveString),
    billingPostalCode: S.optional(SensitiveString),
    billingProvince: S.optional(SensitiveString),
    billingState: S.optional(SensitiveString),
    custom: S.optional(CustomAttributes),
  }),
).annotations({
  identifier: "CustomerProfileAttributes",
}) as any as S.Schema<CustomerProfileAttributes>;
export interface MessageTemplateAttributes {
  systemAttributes?: SystemAttributes;
  agentAttributes?: AgentAttributes;
  customerProfileAttributes?: CustomerProfileAttributes;
  customAttributes?: CustomAttributes;
}
export const MessageTemplateAttributes = S.suspend(() =>
  S.Struct({
    systemAttributes: S.optional(SystemAttributes),
    agentAttributes: S.optional(AgentAttributes),
    customerProfileAttributes: S.optional(CustomerProfileAttributes),
    customAttributes: S.optional(CustomAttributes),
  }),
).annotations({
  identifier: "MessageTemplateAttributes",
}) as any as S.Schema<MessageTemplateAttributes>;
export interface UpdateMessageTemplateRequest {
  knowledgeBaseId: string;
  messageTemplateId: string;
  content?: (typeof MessageTemplateContentProvider)["Type"];
  language?: string;
  sourceConfiguration?: (typeof MessageTemplateSourceConfiguration)["Type"];
  defaultAttributes?: MessageTemplateAttributes;
}
export const UpdateMessageTemplateRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    content: S.optional(MessageTemplateContentProvider),
    language: S.optional(S.String),
    sourceConfiguration: S.optional(MessageTemplateSourceConfiguration),
    defaultAttributes: S.optional(MessageTemplateAttributes),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates/{messageTemplateId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMessageTemplateRequest",
}) as any as S.Schema<UpdateMessageTemplateRequest>;
export interface DeleteMessageTemplateRequest {
  knowledgeBaseId: string;
  messageTemplateId: string;
}
export const DeleteMessageTemplateRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates/{messageTemplateId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMessageTemplateRequest",
}) as any as S.Schema<DeleteMessageTemplateRequest>;
export interface DeleteMessageTemplateResponse {}
export const DeleteMessageTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMessageTemplateResponse",
}) as any as S.Schema<DeleteMessageTemplateResponse>;
export interface ListMessageTemplatesRequest {
  nextToken?: string;
  maxResults?: number;
  knowledgeBaseId: string;
}
export const ListMessageTemplatesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMessageTemplatesRequest",
}) as any as S.Schema<ListMessageTemplatesRequest>;
export interface ActivateMessageTemplateRequest {
  knowledgeBaseId: string;
  messageTemplateId: string;
  versionNumber: number;
}
export const ActivateMessageTemplateRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    versionNumber: S.Number,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates/{messageTemplateId}/activate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ActivateMessageTemplateRequest",
}) as any as S.Schema<ActivateMessageTemplateRequest>;
export interface CreateMessageTemplateAttachmentRequest {
  knowledgeBaseId: string;
  messageTemplateId: string;
  contentDisposition: string;
  name: string | Redacted.Redacted<string>;
  body: string | Redacted.Redacted<string>;
  clientToken?: string;
}
export const CreateMessageTemplateAttachmentRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    contentDisposition: S.String,
    name: SensitiveString,
    body: SensitiveString,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates/{messageTemplateId}/attachments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMessageTemplateAttachmentRequest",
}) as any as S.Schema<CreateMessageTemplateAttachmentRequest>;
export interface CreateMessageTemplateVersionRequest {
  knowledgeBaseId: string;
  messageTemplateId: string;
  messageTemplateContentSha256?: string;
}
export const CreateMessageTemplateVersionRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    messageTemplateContentSha256: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates/{messageTemplateId}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMessageTemplateVersionRequest",
}) as any as S.Schema<CreateMessageTemplateVersionRequest>;
export interface DeactivateMessageTemplateRequest {
  knowledgeBaseId: string;
  messageTemplateId: string;
  versionNumber: number;
}
export const DeactivateMessageTemplateRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    versionNumber: S.Number,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates/{messageTemplateId}/deactivate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeactivateMessageTemplateRequest",
}) as any as S.Schema<DeactivateMessageTemplateRequest>;
export interface DeleteMessageTemplateAttachmentRequest {
  knowledgeBaseId: string;
  messageTemplateId: string;
  attachmentId: string;
}
export const DeleteMessageTemplateAttachmentRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    attachmentId: S.String.pipe(T.HttpLabel("attachmentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates/{messageTemplateId}/attachments/{attachmentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMessageTemplateAttachmentRequest",
}) as any as S.Schema<DeleteMessageTemplateAttachmentRequest>;
export interface DeleteMessageTemplateAttachmentResponse {}
export const DeleteMessageTemplateAttachmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMessageTemplateAttachmentResponse",
}) as any as S.Schema<DeleteMessageTemplateAttachmentResponse>;
export interface ListMessageTemplateVersionsRequest {
  knowledgeBaseId: string;
  messageTemplateId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListMessageTemplateVersionsRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates/{messageTemplateId}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMessageTemplateVersionsRequest",
}) as any as S.Schema<ListMessageTemplateVersionsRequest>;
export interface RenderMessageTemplateRequest {
  knowledgeBaseId: string;
  messageTemplateId: string;
  attributes: MessageTemplateAttributes;
}
export const RenderMessageTemplateRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    attributes: MessageTemplateAttributes,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates/{messageTemplateId}/render",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RenderMessageTemplateRequest",
}) as any as S.Schema<RenderMessageTemplateRequest>;
export type GroupingValues = string | Redacted.Redacted<string>[];
export const GroupingValues = S.Array(SensitiveString);
export interface GroupingConfiguration {
  criteria?: string | Redacted.Redacted<string>;
  values?: GroupingValues;
}
export const GroupingConfiguration = S.suspend(() =>
  S.Struct({
    criteria: S.optional(SensitiveString),
    values: S.optional(GroupingValues),
  }),
).annotations({
  identifier: "GroupingConfiguration",
}) as any as S.Schema<GroupingConfiguration>;
export interface UpdateMessageTemplateMetadataRequest {
  knowledgeBaseId: string;
  messageTemplateId: string;
  name?: string;
  description?: string;
  groupingConfiguration?: GroupingConfiguration;
}
export const UpdateMessageTemplateMetadataRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    groupingConfiguration: S.optional(GroupingConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates/{messageTemplateId}/metadata",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMessageTemplateMetadataRequest",
}) as any as S.Schema<UpdateMessageTemplateMetadataRequest>;
export interface GetQuickResponseRequest {
  quickResponseId: string;
  knowledgeBaseId: string;
}
export const GetQuickResponseRequest = S.suspend(() =>
  S.Struct({
    quickResponseId: S.String.pipe(T.HttpLabel("quickResponseId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/quickResponses/{quickResponseId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQuickResponseRequest",
}) as any as S.Schema<GetQuickResponseRequest>;
export type QuickResponseDataProvider = {
  content: string | Redacted.Redacted<string>;
};
export const QuickResponseDataProvider = S.Union(
  S.Struct({ content: SensitiveString }),
);
export interface UpdateQuickResponseRequest {
  knowledgeBaseId: string;
  quickResponseId: string;
  name?: string;
  content?: (typeof QuickResponseDataProvider)["Type"];
  contentType?: string;
  groupingConfiguration?: GroupingConfiguration;
  removeGroupingConfiguration?: boolean;
  description?: string;
  removeDescription?: boolean;
  shortcutKey?: string;
  removeShortcutKey?: boolean;
  isActive?: boolean;
  channels?: Channels;
  language?: string;
}
export const UpdateQuickResponseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    quickResponseId: S.String.pipe(T.HttpLabel("quickResponseId")),
    name: S.optional(S.String),
    content: S.optional(QuickResponseDataProvider),
    contentType: S.optional(S.String),
    groupingConfiguration: S.optional(GroupingConfiguration),
    removeGroupingConfiguration: S.optional(S.Boolean),
    description: S.optional(S.String),
    removeDescription: S.optional(S.Boolean),
    shortcutKey: S.optional(S.String),
    removeShortcutKey: S.optional(S.Boolean),
    isActive: S.optional(S.Boolean),
    channels: S.optional(Channels),
    language: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/quickResponses/{quickResponseId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateQuickResponseRequest",
}) as any as S.Schema<UpdateQuickResponseRequest>;
export interface DeleteQuickResponseRequest {
  knowledgeBaseId: string;
  quickResponseId: string;
}
export const DeleteQuickResponseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    quickResponseId: S.String.pipe(T.HttpLabel("quickResponseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgeBases/{knowledgeBaseId}/quickResponses/{quickResponseId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteQuickResponseRequest",
}) as any as S.Schema<DeleteQuickResponseRequest>;
export interface DeleteQuickResponseResponse {}
export const DeleteQuickResponseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteQuickResponseResponse",
}) as any as S.Schema<DeleteQuickResponseResponse>;
export interface ListQuickResponsesRequest {
  nextToken?: string;
  maxResults?: number;
  knowledgeBaseId: string;
}
export const ListQuickResponsesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgeBases/{knowledgeBaseId}/quickResponses",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListQuickResponsesRequest",
}) as any as S.Schema<ListQuickResponsesRequest>;
export interface ServerSideEncryptionConfiguration {
  kmsKeyId?: string;
}
export const ServerSideEncryptionConfiguration = S.suspend(() =>
  S.Struct({ kmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "ServerSideEncryptionConfiguration",
}) as any as S.Schema<ServerSideEncryptionConfiguration>;
export interface CitationSpan {
  beginOffsetInclusive?: number;
  endOffsetExclusive?: number;
}
export const CitationSpan = S.suspend(() =>
  S.Struct({
    beginOffsetInclusive: S.optional(S.Number),
    endOffsetExclusive: S.optional(S.Number),
  }),
).annotations({ identifier: "CitationSpan" }) as any as S.Schema<CitationSpan>;
export interface Citation {
  contentId?: string;
  title?: string | Redacted.Redacted<string>;
  knowledgeBaseId?: string;
  citationSpan: CitationSpan;
  sourceURL?: string | Redacted.Redacted<string>;
  referenceType: string;
}
export const Citation = S.suspend(() =>
  S.Struct({
    contentId: S.optional(S.String),
    title: S.optional(SensitiveString),
    knowledgeBaseId: S.optional(S.String),
    citationSpan: CitationSpan,
    sourceURL: S.optional(SensitiveString),
    referenceType: S.String,
  }),
).annotations({ identifier: "Citation" }) as any as S.Schema<Citation>;
export type Citations = Citation[];
export const Citations = S.Array(Citation);
export interface AIGuardrailAssessment {
  blocked: boolean;
}
export const AIGuardrailAssessment = S.suspend(() =>
  S.Struct({ blocked: S.Boolean }),
).annotations({
  identifier: "AIGuardrailAssessment",
}) as any as S.Schema<AIGuardrailAssessment>;
export interface TextMessage {
  value?: string | Redacted.Redacted<string>;
  citations?: Citations;
  aiGuardrailAssessment?: AIGuardrailAssessment;
}
export const TextMessage = S.suspend(() =>
  S.Struct({
    value: S.optional(SensitiveString),
    citations: S.optional(Citations),
    aiGuardrailAssessment: S.optional(AIGuardrailAssessment),
  }),
).annotations({ identifier: "TextMessage" }) as any as S.Schema<TextMessage>;
export interface ToolUseResultData {
  toolUseId: string;
  toolName: string;
  toolResult: any;
  inputSchema?: any;
}
export const ToolUseResultData = S.suspend(() =>
  S.Struct({
    toolUseId: S.String,
    toolName: S.String,
    toolResult: S.Any,
    inputSchema: S.optional(S.Any),
  }),
).annotations({
  identifier: "ToolUseResultData",
}) as any as S.Schema<ToolUseResultData>;
export type MessageData =
  | { text: TextMessage }
  | { toolUseResult: ToolUseResultData };
export const MessageData = S.Union(
  S.Struct({ text: TextMessage }),
  S.Struct({ toolUseResult: ToolUseResultData }),
);
export interface MessageOutput {
  value: (typeof MessageData)["Type"];
  messageId: string;
  participant: string;
  timestamp: Date;
}
export const MessageOutput = S.suspend(() =>
  S.Struct({
    value: MessageData,
    messageId: S.String,
    participant: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "MessageOutput",
}) as any as S.Schema<MessageOutput>;
export type MessageList = MessageOutput[];
export const MessageList = S.Array(MessageOutput);
export interface MessageConfiguration {
  generateFillerMessage?: boolean;
  generateChunkedMessage?: boolean;
}
export const MessageConfiguration = S.suspend(() =>
  S.Struct({
    generateFillerMessage: S.optional(S.Boolean),
    generateChunkedMessage: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "MessageConfiguration",
}) as any as S.Schema<MessageConfiguration>;
export type MessageMetadata = { [key: string]: string };
export const MessageMetadata = S.Record({ key: S.String, value: S.String });
export interface RenderingConfiguration {
  templateUri?: string;
}
export const RenderingConfiguration = S.suspend(() =>
  S.Struct({ templateUri: S.optional(S.String) }),
).annotations({
  identifier: "RenderingConfiguration",
}) as any as S.Schema<RenderingConfiguration>;
export type ContactAttributes = { [key: string]: string };
export const ContactAttributes = S.Record({ key: S.String, value: S.String });
export type MessageTemplateAttributeKeyList = string[];
export const MessageTemplateAttributeKeyList = S.Array(S.String);
export interface MessageTemplateAttachment {
  contentDisposition: string;
  name: string | Redacted.Redacted<string>;
  uploadedTime: Date;
  url: string | Redacted.Redacted<string>;
  urlExpiry: Date;
  attachmentId: string;
}
export const MessageTemplateAttachment = S.suspend(() =>
  S.Struct({
    contentDisposition: S.String,
    name: SensitiveString,
    uploadedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    url: SensitiveString,
    urlExpiry: S.Date.pipe(T.TimestampFormat("date-time")),
    attachmentId: S.String,
  }),
).annotations({
  identifier: "MessageTemplateAttachment",
}) as any as S.Schema<MessageTemplateAttachment>;
export type MessageTemplateAttachmentList = MessageTemplateAttachment[];
export const MessageTemplateAttachmentList = S.Array(MessageTemplateAttachment);
export type AssistantAssociationIdList = string[];
export const AssistantAssociationIdList = S.Array(S.String);
export type RetrievalFilterList = RetrievalFilterConfiguration[];
export const RetrievalFilterList = S.Array(
  S.suspend(() => RetrievalFilterConfiguration).annotations({
    identifier: "RetrievalFilterConfiguration",
  }),
) as any as S.Schema<RetrievalFilterList>;
export type ObjectFieldsList = string[];
export const ObjectFieldsList = S.Array(S.String);
export type MessageTemplateQueryValueList = string[];
export const MessageTemplateQueryValueList = S.Array(S.String);
export type MessageTemplateFilterValueList = string[];
export const MessageTemplateFilterValueList = S.Array(S.String);
export type QuickResponseQueryValueList = string[];
export const QuickResponseQueryValueList = S.Array(S.String);
export type QuickResponseFilterValueList = string[];
export const QuickResponseFilterValueList = S.Array(S.String);
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface CreateAssistantRequest {
  clientToken?: string;
  name: string;
  type: string;
  description?: string;
  tags?: Tags;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
}
export const CreateAssistantRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    name: S.String,
    type: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssistantRequest",
}) as any as S.Schema<CreateAssistantRequest>;
export interface UpdateAssistantAIAgentRequest {
  assistantId: string;
  aiAgentType: string;
  configuration: AIAgentConfigurationData;
  orchestratorConfigurationList?: OrchestratorConfigurationList;
}
export const UpdateAssistantAIAgentRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentType: S.String,
    configuration: AIAgentConfigurationData,
    orchestratorConfigurationList: S.optional(OrchestratorConfigurationList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/aiagentConfiguration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssistantAIAgentRequest",
}) as any as S.Schema<UpdateAssistantAIAgentRequest>;
export interface AIAgentData {
  assistantId: string;
  assistantArn: string;
  aiAgentId: string;
  aiAgentArn: string;
  name: string;
  type: string;
  configuration: (typeof AIAgentConfiguration)["Type"];
  modifiedTime?: Date;
  description?: string;
  visibilityStatus: string;
  tags?: Tags;
  origin?: string;
  status?: string;
}
export const AIAgentData = S.suspend(() =>
  S.Struct({
    assistantId: S.String,
    assistantArn: S.String,
    aiAgentId: S.String,
    aiAgentArn: S.String,
    name: S.String,
    type: S.String,
    configuration: AIAgentConfiguration,
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    description: S.optional(S.String),
    visibilityStatus: S.String,
    tags: S.optional(Tags),
    origin: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({ identifier: "AIAgentData" }) as any as S.Schema<AIAgentData>;
export interface UpdateAIAgentResponse {
  aiAgent?: AIAgentData;
}
export const UpdateAIAgentResponse = S.suspend(() =>
  S.Struct({ aiAgent: S.optional(AIAgentData) }),
).annotations({
  identifier: "UpdateAIAgentResponse",
}) as any as S.Schema<UpdateAIAgentResponse>;
export interface CreateAIAgentVersionResponse {
  aiAgent?: AIAgentData;
  versionNumber?: number;
}
export const CreateAIAgentVersionResponse = S.suspend(() =>
  S.Struct({
    aiAgent: S.optional(AIAgentData),
    versionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateAIAgentVersionResponse",
}) as any as S.Schema<CreateAIAgentVersionResponse>;
export interface AIGuardrailData {
  assistantId: string;
  assistantArn: string;
  aiGuardrailArn: string;
  aiGuardrailId: string;
  name: string;
  visibilityStatus: string;
  blockedInputMessaging: string | Redacted.Redacted<string>;
  blockedOutputsMessaging: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  topicPolicyConfig?: AIGuardrailTopicPolicyConfig;
  contentPolicyConfig?: AIGuardrailContentPolicyConfig;
  wordPolicyConfig?: AIGuardrailWordPolicyConfig;
  sensitiveInformationPolicyConfig?: AIGuardrailSensitiveInformationPolicyConfig;
  contextualGroundingPolicyConfig?: AIGuardrailContextualGroundingPolicyConfig;
  tags?: Tags;
  status?: string;
  modifiedTime?: Date;
}
export const AIGuardrailData = S.suspend(() =>
  S.Struct({
    assistantId: S.String,
    assistantArn: S.String,
    aiGuardrailArn: S.String,
    aiGuardrailId: S.String,
    name: S.String,
    visibilityStatus: S.String,
    blockedInputMessaging: SensitiveString,
    blockedOutputsMessaging: SensitiveString,
    description: S.optional(SensitiveString),
    topicPolicyConfig: S.optional(AIGuardrailTopicPolicyConfig),
    contentPolicyConfig: S.optional(AIGuardrailContentPolicyConfig),
    wordPolicyConfig: S.optional(AIGuardrailWordPolicyConfig),
    sensitiveInformationPolicyConfig: S.optional(
      AIGuardrailSensitiveInformationPolicyConfig,
    ),
    contextualGroundingPolicyConfig: S.optional(
      AIGuardrailContextualGroundingPolicyConfig,
    ),
    tags: S.optional(Tags),
    status: S.optional(S.String),
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AIGuardrailData",
}) as any as S.Schema<AIGuardrailData>;
export interface UpdateAIGuardrailResponse {
  aiGuardrail?: AIGuardrailData;
}
export const UpdateAIGuardrailResponse = S.suspend(() =>
  S.Struct({ aiGuardrail: S.optional(AIGuardrailData) }),
).annotations({
  identifier: "UpdateAIGuardrailResponse",
}) as any as S.Schema<UpdateAIGuardrailResponse>;
export interface CreateAIGuardrailVersionResponse {
  aiGuardrail?: AIGuardrailData;
  versionNumber?: number;
}
export const CreateAIGuardrailVersionResponse = S.suspend(() =>
  S.Struct({
    aiGuardrail: S.optional(AIGuardrailData),
    versionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateAIGuardrailVersionResponse",
}) as any as S.Schema<CreateAIGuardrailVersionResponse>;
export interface AIPromptData {
  assistantId: string;
  assistantArn: string;
  aiPromptId: string;
  aiPromptArn: string;
  name: string;
  type: string;
  templateType: string;
  modelId: string;
  apiFormat: string;
  templateConfiguration: (typeof AIPromptTemplateConfiguration)["Type"];
  inferenceConfiguration?: (typeof AIPromptInferenceConfiguration)["Type"];
  modifiedTime?: Date;
  description?: string;
  visibilityStatus: string;
  tags?: Tags;
  origin?: string;
  status?: string;
}
export const AIPromptData = S.suspend(() =>
  S.Struct({
    assistantId: S.String,
    assistantArn: S.String,
    aiPromptId: S.String,
    aiPromptArn: S.String,
    name: S.String,
    type: S.String,
    templateType: S.String,
    modelId: S.String,
    apiFormat: S.String,
    templateConfiguration: AIPromptTemplateConfiguration,
    inferenceConfiguration: S.optional(AIPromptInferenceConfiguration),
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    description: S.optional(S.String),
    visibilityStatus: S.String,
    tags: S.optional(Tags),
    origin: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({ identifier: "AIPromptData" }) as any as S.Schema<AIPromptData>;
export interface UpdateAIPromptResponse {
  aiPrompt?: AIPromptData;
}
export const UpdateAIPromptResponse = S.suspend(() =>
  S.Struct({ aiPrompt: S.optional(AIPromptData) }),
).annotations({
  identifier: "UpdateAIPromptResponse",
}) as any as S.Schema<UpdateAIPromptResponse>;
export interface CreateAIPromptVersionResponse {
  aiPrompt?: AIPromptData;
  versionNumber?: number;
}
export const CreateAIPromptVersionResponse = S.suspend(() =>
  S.Struct({
    aiPrompt: S.optional(AIPromptData),
    versionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateAIPromptVersionResponse",
}) as any as S.Schema<CreateAIPromptVersionResponse>;
export interface SessionIntegrationConfiguration {
  topicIntegrationArn?: string;
}
export const SessionIntegrationConfiguration = S.suspend(() =>
  S.Struct({ topicIntegrationArn: S.optional(S.String) }),
).annotations({
  identifier: "SessionIntegrationConfiguration",
}) as any as S.Schema<SessionIntegrationConfiguration>;
export interface SessionData {
  sessionArn: string;
  sessionId: string;
  name: string;
  description?: string;
  tags?: Tags;
  integrationConfiguration?: SessionIntegrationConfiguration;
  tagFilter?: (typeof TagFilter)["Type"];
  aiAgentConfiguration?: AIAgentConfigurationMap;
  origin?: string;
  orchestratorConfigurationList?: OrchestratorConfigurationList;
}
export const SessionData = S.suspend(() =>
  S.Struct({
    sessionArn: S.String,
    sessionId: S.String,
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    integrationConfiguration: S.optional(SessionIntegrationConfiguration),
    tagFilter: S.optional(TagFilter),
    aiAgentConfiguration: S.optional(AIAgentConfigurationMap),
    origin: S.optional(S.String),
    orchestratorConfigurationList: S.optional(OrchestratorConfigurationList),
  }),
).annotations({ identifier: "SessionData" }) as any as S.Schema<SessionData>;
export interface UpdateSessionResponse {
  session?: SessionData;
}
export const UpdateSessionResponse = S.suspend(() =>
  S.Struct({ session: S.optional(SessionData) }),
).annotations({
  identifier: "UpdateSessionResponse",
}) as any as S.Schema<UpdateSessionResponse>;
export interface ListMessagesResponse {
  messages: MessageList;
  nextToken?: string;
}
export const ListMessagesResponse = S.suspend(() =>
  S.Struct({ messages: MessageList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListMessagesResponse",
}) as any as S.Schema<ListMessagesResponse>;
export interface FixedSizeChunkingConfiguration {
  maxTokens: number;
  overlapPercentage: number;
}
export const FixedSizeChunkingConfiguration = S.suspend(() =>
  S.Struct({ maxTokens: S.Number, overlapPercentage: S.Number }),
).annotations({
  identifier: "FixedSizeChunkingConfiguration",
}) as any as S.Schema<FixedSizeChunkingConfiguration>;
export interface HierarchicalChunkingLevelConfiguration {
  maxTokens: number;
}
export const HierarchicalChunkingLevelConfiguration = S.suspend(() =>
  S.Struct({ maxTokens: S.Number }),
).annotations({
  identifier: "HierarchicalChunkingLevelConfiguration",
}) as any as S.Schema<HierarchicalChunkingLevelConfiguration>;
export type HierarchicalChunkingLevelConfigurations =
  HierarchicalChunkingLevelConfiguration[];
export const HierarchicalChunkingLevelConfigurations = S.Array(
  HierarchicalChunkingLevelConfiguration,
);
export interface HierarchicalChunkingConfiguration {
  levelConfigurations: HierarchicalChunkingLevelConfigurations;
  overlapTokens: number;
}
export const HierarchicalChunkingConfiguration = S.suspend(() =>
  S.Struct({
    levelConfigurations: HierarchicalChunkingLevelConfigurations,
    overlapTokens: S.Number,
  }),
).annotations({
  identifier: "HierarchicalChunkingConfiguration",
}) as any as S.Schema<HierarchicalChunkingConfiguration>;
export interface SemanticChunkingConfiguration {
  maxTokens: number;
  bufferSize: number;
  breakpointPercentileThreshold: number;
}
export const SemanticChunkingConfiguration = S.suspend(() =>
  S.Struct({
    maxTokens: S.Number,
    bufferSize: S.Number,
    breakpointPercentileThreshold: S.Number,
  }),
).annotations({
  identifier: "SemanticChunkingConfiguration",
}) as any as S.Schema<SemanticChunkingConfiguration>;
export interface ChunkingConfiguration {
  chunkingStrategy: string;
  fixedSizeChunkingConfiguration?: FixedSizeChunkingConfiguration;
  hierarchicalChunkingConfiguration?: HierarchicalChunkingConfiguration;
  semanticChunkingConfiguration?: SemanticChunkingConfiguration;
}
export const ChunkingConfiguration = S.suspend(() =>
  S.Struct({
    chunkingStrategy: S.String,
    fixedSizeChunkingConfiguration: S.optional(FixedSizeChunkingConfiguration),
    hierarchicalChunkingConfiguration: S.optional(
      HierarchicalChunkingConfiguration,
    ),
    semanticChunkingConfiguration: S.optional(SemanticChunkingConfiguration),
  }),
).annotations({
  identifier: "ChunkingConfiguration",
}) as any as S.Schema<ChunkingConfiguration>;
export interface ParsingPrompt {
  parsingPromptText: string;
}
export const ParsingPrompt = S.suspend(() =>
  S.Struct({ parsingPromptText: S.String }),
).annotations({
  identifier: "ParsingPrompt",
}) as any as S.Schema<ParsingPrompt>;
export interface BedrockFoundationModelConfigurationForParsing {
  modelArn: string;
  parsingPrompt?: ParsingPrompt;
}
export const BedrockFoundationModelConfigurationForParsing = S.suspend(() =>
  S.Struct({ modelArn: S.String, parsingPrompt: S.optional(ParsingPrompt) }),
).annotations({
  identifier: "BedrockFoundationModelConfigurationForParsing",
}) as any as S.Schema<BedrockFoundationModelConfigurationForParsing>;
export interface ParsingConfiguration {
  parsingStrategy: string;
  bedrockFoundationModelConfiguration?: BedrockFoundationModelConfigurationForParsing;
}
export const ParsingConfiguration = S.suspend(() =>
  S.Struct({
    parsingStrategy: S.String,
    bedrockFoundationModelConfiguration: S.optional(
      BedrockFoundationModelConfigurationForParsing,
    ),
  }),
).annotations({
  identifier: "ParsingConfiguration",
}) as any as S.Schema<ParsingConfiguration>;
export interface VectorIngestionConfiguration {
  chunkingConfiguration?: ChunkingConfiguration;
  parsingConfiguration?: ParsingConfiguration;
}
export const VectorIngestionConfiguration = S.suspend(() =>
  S.Struct({
    chunkingConfiguration: S.optional(ChunkingConfiguration),
    parsingConfiguration: S.optional(ParsingConfiguration),
  }),
).annotations({
  identifier: "VectorIngestionConfiguration",
}) as any as S.Schema<VectorIngestionConfiguration>;
export interface AppIntegrationsConfiguration {
  appIntegrationArn: string;
  objectFields?: ObjectFieldsList;
}
export const AppIntegrationsConfiguration = S.suspend(() =>
  S.Struct({
    appIntegrationArn: S.String,
    objectFields: S.optional(ObjectFieldsList),
  }),
).annotations({
  identifier: "AppIntegrationsConfiguration",
}) as any as S.Schema<AppIntegrationsConfiguration>;
export interface SeedUrl {
  url?: string;
}
export const SeedUrl = S.suspend(() =>
  S.Struct({ url: S.optional(S.String) }),
).annotations({ identifier: "SeedUrl" }) as any as S.Schema<SeedUrl>;
export type SeedUrls = SeedUrl[];
export const SeedUrls = S.Array(SeedUrl);
export interface UrlConfiguration {
  seedUrls?: SeedUrls;
}
export const UrlConfiguration = S.suspend(() =>
  S.Struct({ seedUrls: S.optional(SeedUrls) }),
).annotations({
  identifier: "UrlConfiguration",
}) as any as S.Schema<UrlConfiguration>;
export interface WebCrawlerLimits {
  rateLimit?: number;
}
export const WebCrawlerLimits = S.suspend(() =>
  S.Struct({ rateLimit: S.optional(S.Number) }),
).annotations({
  identifier: "WebCrawlerLimits",
}) as any as S.Schema<WebCrawlerLimits>;
export type UrlFilterList = string | Redacted.Redacted<string>[];
export const UrlFilterList = S.Array(SensitiveString);
export interface WebCrawlerConfiguration {
  urlConfiguration: UrlConfiguration;
  crawlerLimits?: WebCrawlerLimits;
  inclusionFilters?: UrlFilterList;
  exclusionFilters?: UrlFilterList;
  scope?: string;
}
export const WebCrawlerConfiguration = S.suspend(() =>
  S.Struct({
    urlConfiguration: UrlConfiguration,
    crawlerLimits: S.optional(WebCrawlerLimits),
    inclusionFilters: S.optional(UrlFilterList),
    exclusionFilters: S.optional(UrlFilterList),
    scope: S.optional(S.String),
  }),
).annotations({
  identifier: "WebCrawlerConfiguration",
}) as any as S.Schema<WebCrawlerConfiguration>;
export type ManagedSourceConfiguration = {
  webCrawlerConfiguration: WebCrawlerConfiguration;
};
export const ManagedSourceConfiguration = S.Union(
  S.Struct({ webCrawlerConfiguration: WebCrawlerConfiguration }),
);
export type SourceConfiguration =
  | { appIntegrations: AppIntegrationsConfiguration }
  | { managedSourceConfiguration: (typeof ManagedSourceConfiguration)["Type"] };
export const SourceConfiguration = S.Union(
  S.Struct({ appIntegrations: AppIntegrationsConfiguration }),
  S.Struct({ managedSourceConfiguration: ManagedSourceConfiguration }),
);
export type FailureReason = string[];
export const FailureReason = S.Array(S.String);
export interface KnowledgeBaseData {
  knowledgeBaseId: string;
  knowledgeBaseArn: string;
  name: string;
  knowledgeBaseType: string;
  status: string;
  lastContentModificationTime?: Date;
  vectorIngestionConfiguration?: VectorIngestionConfiguration;
  sourceConfiguration?: (typeof SourceConfiguration)["Type"];
  renderingConfiguration?: RenderingConfiguration;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  description?: string;
  tags?: Tags;
  ingestionStatus?: string;
  ingestionFailureReasons?: FailureReason;
}
export const KnowledgeBaseData = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    knowledgeBaseArn: S.String,
    name: S.String,
    knowledgeBaseType: S.String,
    status: S.String,
    lastContentModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    vectorIngestionConfiguration: S.optional(VectorIngestionConfiguration),
    sourceConfiguration: S.optional(SourceConfiguration),
    renderingConfiguration: S.optional(RenderingConfiguration),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    description: S.optional(S.String),
    tags: S.optional(Tags),
    ingestionStatus: S.optional(S.String),
    ingestionFailureReasons: S.optional(FailureReason),
  }),
).annotations({
  identifier: "KnowledgeBaseData",
}) as any as S.Schema<KnowledgeBaseData>;
export interface UpdateKnowledgeBaseTemplateUriResponse {
  knowledgeBase?: KnowledgeBaseData;
}
export const UpdateKnowledgeBaseTemplateUriResponse = S.suspend(() =>
  S.Struct({ knowledgeBase: S.optional(KnowledgeBaseData) }),
).annotations({
  identifier: "UpdateKnowledgeBaseTemplateUriResponse",
}) as any as S.Schema<UpdateKnowledgeBaseTemplateUriResponse>;
export interface ContentData {
  contentArn: string;
  contentId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  revisionId: string;
  title: string;
  contentType: string;
  status: string;
  metadata: ContentMetadata;
  tags?: Tags;
  linkOutUri?: string;
  url: string | Redacted.Redacted<string>;
  urlExpiry: Date;
}
export const ContentData = S.suspend(() =>
  S.Struct({
    contentArn: S.String,
    contentId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    revisionId: S.String,
    title: S.String,
    contentType: S.String,
    status: S.String,
    metadata: ContentMetadata,
    tags: S.optional(Tags),
    linkOutUri: S.optional(S.String),
    url: SensitiveString,
    urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "ContentData" }) as any as S.Schema<ContentData>;
export interface GetContentResponse {
  content?: ContentData;
}
export const GetContentResponse = S.suspend(() =>
  S.Struct({ content: S.optional(ContentData) }),
).annotations({
  identifier: "GetContentResponse",
}) as any as S.Schema<GetContentResponse>;
export interface UpdateContentResponse {
  content?: ContentData;
}
export const UpdateContentResponse = S.suspend(() =>
  S.Struct({ content: S.optional(ContentData) }),
).annotations({
  identifier: "UpdateContentResponse",
}) as any as S.Schema<UpdateContentResponse>;
export interface ContentSummary {
  contentArn: string;
  contentId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  revisionId: string;
  title: string;
  contentType: string;
  status: string;
  metadata: ContentMetadata;
  tags?: Tags;
}
export const ContentSummary = S.suspend(() =>
  S.Struct({
    contentArn: S.String,
    contentId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    revisionId: S.String,
    title: S.String,
    contentType: S.String,
    status: S.String,
    metadata: ContentMetadata,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "ContentSummary",
}) as any as S.Schema<ContentSummary>;
export type ContentSummaryList = ContentSummary[];
export const ContentSummaryList = S.Array(ContentSummary);
export interface ListContentsResponse {
  contentSummaries: ContentSummaryList;
  nextToken?: string;
}
export const ListContentsResponse = S.suspend(() =>
  S.Struct({
    contentSummaries: ContentSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListContentsResponse",
}) as any as S.Schema<ListContentsResponse>;
export interface GetContentSummaryResponse {
  contentSummary?: ContentSummary;
}
export const GetContentSummaryResponse = S.suspend(() =>
  S.Struct({ contentSummary: S.optional(ContentSummary) }),
).annotations({
  identifier: "GetContentSummaryResponse",
}) as any as S.Schema<GetContentSummaryResponse>;
export interface ActivateMessageTemplateResponse {
  messageTemplateArn: string;
  messageTemplateId: string;
  versionNumber: number;
}
export const ActivateMessageTemplateResponse = S.suspend(() =>
  S.Struct({
    messageTemplateArn: S.String,
    messageTemplateId: S.String,
    versionNumber: S.Number,
  }),
).annotations({
  identifier: "ActivateMessageTemplateResponse",
}) as any as S.Schema<ActivateMessageTemplateResponse>;
export interface WhatsAppMessageTemplateSourceConfigurationSummary {
  businessAccountId: string;
  templateId: string;
  name?: string;
  language?: string;
  components?: WhatsAppMessageTemplateComponents;
  status?: string;
  statusReason?: string | Redacted.Redacted<string>;
}
export const WhatsAppMessageTemplateSourceConfigurationSummary = S.suspend(() =>
  S.Struct({
    businessAccountId: S.String,
    templateId: S.String,
    name: S.optional(S.String),
    language: S.optional(S.String),
    components: S.optional(WhatsAppMessageTemplateComponents),
    status: S.optional(S.String),
    statusReason: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "WhatsAppMessageTemplateSourceConfigurationSummary",
}) as any as S.Schema<WhatsAppMessageTemplateSourceConfigurationSummary>;
export type MessageTemplateSourceConfigurationSummary = {
  whatsApp: WhatsAppMessageTemplateSourceConfigurationSummary;
};
export const MessageTemplateSourceConfigurationSummary = S.Union(
  S.Struct({ whatsApp: WhatsAppMessageTemplateSourceConfigurationSummary }),
);
export type MessageTemplateAttributeTypeList = string[];
export const MessageTemplateAttributeTypeList = S.Array(S.String);
export interface ExtendedMessageTemplateData {
  messageTemplateArn: string;
  messageTemplateId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  channel?: string | Redacted.Redacted<string>;
  channelSubtype: string;
  createdTime: Date;
  lastModifiedTime: Date;
  lastModifiedBy: string;
  content?: (typeof MessageTemplateContentProvider)["Type"];
  description?: string;
  language?: string;
  sourceConfigurationSummary?: (typeof MessageTemplateSourceConfigurationSummary)["Type"];
  groupingConfiguration?: GroupingConfiguration;
  defaultAttributes?: MessageTemplateAttributes;
  attributeTypes?: MessageTemplateAttributeTypeList;
  attachments?: MessageTemplateAttachmentList;
  isActive?: boolean;
  versionNumber?: number;
  messageTemplateContentSha256: string;
  tags?: Tags;
}
export const ExtendedMessageTemplateData = S.suspend(() =>
  S.Struct({
    messageTemplateArn: S.String,
    messageTemplateId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    channel: S.optional(SensitiveString),
    channelSubtype: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedBy: S.String,
    content: S.optional(MessageTemplateContentProvider),
    description: S.optional(S.String),
    language: S.optional(S.String),
    sourceConfigurationSummary: S.optional(
      MessageTemplateSourceConfigurationSummary,
    ),
    groupingConfiguration: S.optional(GroupingConfiguration),
    defaultAttributes: S.optional(MessageTemplateAttributes),
    attributeTypes: S.optional(MessageTemplateAttributeTypeList),
    attachments: S.optional(MessageTemplateAttachmentList),
    isActive: S.optional(S.Boolean),
    versionNumber: S.optional(S.Number),
    messageTemplateContentSha256: S.String,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "ExtendedMessageTemplateData",
}) as any as S.Schema<ExtendedMessageTemplateData>;
export interface CreateMessageTemplateVersionResponse {
  messageTemplate?: ExtendedMessageTemplateData;
}
export const CreateMessageTemplateVersionResponse = S.suspend(() =>
  S.Struct({ messageTemplate: S.optional(ExtendedMessageTemplateData) }),
).annotations({
  identifier: "CreateMessageTemplateVersionResponse",
}) as any as S.Schema<CreateMessageTemplateVersionResponse>;
export interface DeactivateMessageTemplateResponse {
  messageTemplateArn: string;
  messageTemplateId: string;
  versionNumber: number;
}
export const DeactivateMessageTemplateResponse = S.suspend(() =>
  S.Struct({
    messageTemplateArn: S.String,
    messageTemplateId: S.String,
    versionNumber: S.Number,
  }),
).annotations({
  identifier: "DeactivateMessageTemplateResponse",
}) as any as S.Schema<DeactivateMessageTemplateResponse>;
export interface MessageTemplateData {
  messageTemplateArn: string;
  messageTemplateId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  channel?: string | Redacted.Redacted<string>;
  channelSubtype: string;
  createdTime: Date;
  lastModifiedTime: Date;
  lastModifiedBy: string;
  content?: (typeof MessageTemplateContentProvider)["Type"];
  description?: string;
  language?: string;
  sourceConfigurationSummary?: (typeof MessageTemplateSourceConfigurationSummary)["Type"];
  groupingConfiguration?: GroupingConfiguration;
  defaultAttributes?: MessageTemplateAttributes;
  attributeTypes?: MessageTemplateAttributeTypeList;
  messageTemplateContentSha256: string;
  tags?: Tags;
}
export const MessageTemplateData = S.suspend(() =>
  S.Struct({
    messageTemplateArn: S.String,
    messageTemplateId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    channel: S.optional(SensitiveString),
    channelSubtype: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedBy: S.String,
    content: S.optional(MessageTemplateContentProvider),
    description: S.optional(S.String),
    language: S.optional(S.String),
    sourceConfigurationSummary: S.optional(
      MessageTemplateSourceConfigurationSummary,
    ),
    groupingConfiguration: S.optional(GroupingConfiguration),
    defaultAttributes: S.optional(MessageTemplateAttributes),
    attributeTypes: S.optional(MessageTemplateAttributeTypeList),
    messageTemplateContentSha256: S.String,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "MessageTemplateData",
}) as any as S.Schema<MessageTemplateData>;
export interface UpdateMessageTemplateMetadataResponse {
  messageTemplate?: MessageTemplateData;
}
export const UpdateMessageTemplateMetadataResponse = S.suspend(() =>
  S.Struct({ messageTemplate: S.optional(MessageTemplateData) }),
).annotations({
  identifier: "UpdateMessageTemplateMetadataResponse",
}) as any as S.Schema<UpdateMessageTemplateMetadataResponse>;
export interface CreateQuickResponseRequest {
  knowledgeBaseId: string;
  name: string;
  content: (typeof QuickResponseDataProvider)["Type"];
  contentType?: string;
  groupingConfiguration?: GroupingConfiguration;
  description?: string;
  shortcutKey?: string;
  isActive?: boolean;
  channels?: Channels;
  language?: string;
  clientToken?: string;
  tags?: Tags;
}
export const CreateQuickResponseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    name: S.String,
    content: QuickResponseDataProvider,
    contentType: S.optional(S.String),
    groupingConfiguration: S.optional(GroupingConfiguration),
    description: S.optional(S.String),
    shortcutKey: S.optional(S.String),
    isActive: S.optional(S.Boolean),
    channels: S.optional(Channels),
    language: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/quickResponses",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateQuickResponseRequest",
}) as any as S.Schema<CreateQuickResponseRequest>;
export type QuickResponseContentProvider = {
  content: string | Redacted.Redacted<string>;
};
export const QuickResponseContentProvider = S.Union(
  S.Struct({ content: SensitiveString }),
);
export interface QuickResponseContents {
  plainText?: (typeof QuickResponseContentProvider)["Type"];
  markdown?: (typeof QuickResponseContentProvider)["Type"];
}
export const QuickResponseContents = S.suspend(() =>
  S.Struct({
    plainText: S.optional(QuickResponseContentProvider),
    markdown: S.optional(QuickResponseContentProvider),
  }),
).annotations({
  identifier: "QuickResponseContents",
}) as any as S.Schema<QuickResponseContents>;
export interface QuickResponseData {
  quickResponseArn: string;
  quickResponseId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  contentType: string;
  status: string;
  createdTime: Date;
  lastModifiedTime: Date;
  contents?: QuickResponseContents;
  description?: string;
  groupingConfiguration?: GroupingConfiguration;
  shortcutKey?: string;
  lastModifiedBy?: string;
  isActive?: boolean;
  channels?: Channels;
  language?: string;
  tags?: Tags;
}
export const QuickResponseData = S.suspend(() =>
  S.Struct({
    quickResponseArn: S.String,
    quickResponseId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    contentType: S.String,
    status: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    contents: S.optional(QuickResponseContents),
    description: S.optional(S.String),
    groupingConfiguration: S.optional(GroupingConfiguration),
    shortcutKey: S.optional(S.String),
    lastModifiedBy: S.optional(S.String),
    isActive: S.optional(S.Boolean),
    channels: S.optional(Channels),
    language: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "QuickResponseData",
}) as any as S.Schema<QuickResponseData>;
export interface UpdateQuickResponseResponse {
  quickResponse?: QuickResponseData;
}
export const UpdateQuickResponseResponse = S.suspend(() =>
  S.Struct({ quickResponse: S.optional(QuickResponseData) }),
).annotations({
  identifier: "UpdateQuickResponseResponse",
}) as any as S.Schema<UpdateQuickResponseResponse>;
export interface GenerativeContentFeedbackData {
  relevance: string;
}
export const GenerativeContentFeedbackData = S.suspend(() =>
  S.Struct({ relevance: S.String }),
).annotations({
  identifier: "GenerativeContentFeedbackData",
}) as any as S.Schema<GenerativeContentFeedbackData>;
export interface QueryConditionItem {
  field: string;
  comparator: string;
  value: string;
}
export const QueryConditionItem = S.suspend(() =>
  S.Struct({ field: S.String, comparator: S.String, value: S.String }),
).annotations({
  identifier: "QueryConditionItem",
}) as any as S.Schema<QueryConditionItem>;
export interface QueryTextInputData {
  text: string | Redacted.Redacted<string>;
}
export const QueryTextInputData = S.suspend(() =>
  S.Struct({ text: SensitiveString }),
).annotations({
  identifier: "QueryTextInputData",
}) as any as S.Schema<QueryTextInputData>;
export interface IntentInputData {
  intentId: string;
}
export const IntentInputData = S.suspend(() =>
  S.Struct({ intentId: S.String }),
).annotations({
  identifier: "IntentInputData",
}) as any as S.Schema<IntentInputData>;
export interface CaseSummarizationInputData {
  caseArn: string;
}
export const CaseSummarizationInputData = S.suspend(() =>
  S.Struct({ caseArn: S.String }),
).annotations({
  identifier: "CaseSummarizationInputData",
}) as any as S.Schema<CaseSummarizationInputData>;
export type KnowledgeSource = {
  assistantAssociationIds: AssistantAssociationIdList;
};
export const KnowledgeSource = S.Union(
  S.Struct({ assistantAssociationIds: AssistantAssociationIdList }),
);
export interface ExternalBedrockKnowledgeBaseConfig {
  bedrockKnowledgeBaseArn: string;
  accessRoleArn: string;
}
export const ExternalBedrockKnowledgeBaseConfig = S.suspend(() =>
  S.Struct({ bedrockKnowledgeBaseArn: S.String, accessRoleArn: S.String }),
).annotations({
  identifier: "ExternalBedrockKnowledgeBaseConfig",
}) as any as S.Schema<ExternalBedrockKnowledgeBaseConfig>;
export interface SelfServiceConversationHistory {
  turnNumber?: number;
  inputTranscript?: string | Redacted.Redacted<string>;
  botResponse?: string | Redacted.Redacted<string>;
  timestamp?: Date;
}
export const SelfServiceConversationHistory = S.suspend(() =>
  S.Struct({
    turnNumber: S.optional(S.Number),
    inputTranscript: S.optional(SensitiveString),
    botResponse: S.optional(SensitiveString),
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SelfServiceConversationHistory",
}) as any as S.Schema<SelfServiceConversationHistory>;
export type SelfServiceConversationHistoryList =
  SelfServiceConversationHistory[];
export const SelfServiceConversationHistoryList = S.Array(
  SelfServiceConversationHistory,
);
export type RuntimeSessionDataValue = {
  stringValue: string | Redacted.Redacted<string>;
};
export const RuntimeSessionDataValue = S.Union(
  S.Struct({ stringValue: SensitiveString }),
);
export interface MessageTemplateQueryField {
  name: string;
  values: MessageTemplateQueryValueList;
  operator: string;
  allowFuzziness?: boolean;
  priority?: string;
}
export const MessageTemplateQueryField = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: MessageTemplateQueryValueList,
    operator: S.String,
    allowFuzziness: S.optional(S.Boolean),
    priority: S.optional(S.String),
  }),
).annotations({
  identifier: "MessageTemplateQueryField",
}) as any as S.Schema<MessageTemplateQueryField>;
export type MessageTemplateQueryFieldList = MessageTemplateQueryField[];
export const MessageTemplateQueryFieldList = S.Array(MessageTemplateQueryField);
export interface MessageTemplateFilterField {
  name: string;
  values?: MessageTemplateFilterValueList;
  operator: string;
  includeNoExistence?: boolean;
}
export const MessageTemplateFilterField = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: S.optional(MessageTemplateFilterValueList),
    operator: S.String,
    includeNoExistence: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "MessageTemplateFilterField",
}) as any as S.Schema<MessageTemplateFilterField>;
export type MessageTemplateFilterFieldList = MessageTemplateFilterField[];
export const MessageTemplateFilterFieldList = S.Array(
  MessageTemplateFilterField,
);
export interface MessageTemplateOrderField {
  name: string;
  order?: string;
}
export const MessageTemplateOrderField = S.suspend(() =>
  S.Struct({ name: S.String, order: S.optional(S.String) }),
).annotations({
  identifier: "MessageTemplateOrderField",
}) as any as S.Schema<MessageTemplateOrderField>;
export interface QuickResponseQueryField {
  name: string;
  values: QuickResponseQueryValueList;
  operator: string;
  allowFuzziness?: boolean;
  priority?: string;
}
export const QuickResponseQueryField = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: QuickResponseQueryValueList,
    operator: S.String,
    allowFuzziness: S.optional(S.Boolean),
    priority: S.optional(S.String),
  }),
).annotations({
  identifier: "QuickResponseQueryField",
}) as any as S.Schema<QuickResponseQueryField>;
export type QuickResponseQueryFieldList = QuickResponseQueryField[];
export const QuickResponseQueryFieldList = S.Array(QuickResponseQueryField);
export interface QuickResponseFilterField {
  name: string;
  values?: QuickResponseFilterValueList;
  operator: string;
  includeNoExistence?: boolean;
}
export const QuickResponseFilterField = S.suspend(() =>
  S.Struct({
    name: S.String,
    values: S.optional(QuickResponseFilterValueList),
    operator: S.String,
    includeNoExistence: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "QuickResponseFilterField",
}) as any as S.Schema<QuickResponseFilterField>;
export type QuickResponseFilterFieldList = QuickResponseFilterField[];
export const QuickResponseFilterFieldList = S.Array(QuickResponseFilterField);
export interface QuickResponseOrderField {
  name: string;
  order?: string;
}
export const QuickResponseOrderField = S.suspend(() =>
  S.Struct({ name: S.String, order: S.optional(S.String) }),
).annotations({
  identifier: "QuickResponseOrderField",
}) as any as S.Schema<QuickResponseOrderField>;
export interface AmazonConnectGuideAssociationData {
  flowId?: string;
}
export const AmazonConnectGuideAssociationData = S.suspend(() =>
  S.Struct({ flowId: S.optional(S.String) }),
).annotations({
  identifier: "AmazonConnectGuideAssociationData",
}) as any as S.Schema<AmazonConnectGuideAssociationData>;
export interface AssistantIntegrationConfiguration {
  topicIntegrationArn?: string;
}
export const AssistantIntegrationConfiguration = S.suspend(() =>
  S.Struct({ topicIntegrationArn: S.optional(S.String) }),
).annotations({
  identifier: "AssistantIntegrationConfiguration",
}) as any as S.Schema<AssistantIntegrationConfiguration>;
export interface AssistantCapabilityConfiguration {
  type?: string;
}
export const AssistantCapabilityConfiguration = S.suspend(() =>
  S.Struct({ type: S.optional(S.String) }),
).annotations({
  identifier: "AssistantCapabilityConfiguration",
}) as any as S.Schema<AssistantCapabilityConfiguration>;
export interface AssistantSummary {
  assistantId: string;
  assistantArn: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  tags?: Tags;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  integrationConfiguration?: AssistantIntegrationConfiguration;
  capabilityConfiguration?: AssistantCapabilityConfiguration;
  aiAgentConfiguration?: AIAgentConfigurationMap;
  orchestratorConfigurationList?: OrchestratorConfigurationList;
}
export const AssistantSummary = S.suspend(() =>
  S.Struct({
    assistantId: S.String,
    assistantArn: S.String,
    name: S.String,
    type: S.String,
    status: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    integrationConfiguration: S.optional(AssistantIntegrationConfiguration),
    capabilityConfiguration: S.optional(AssistantCapabilityConfiguration),
    aiAgentConfiguration: S.optional(AIAgentConfigurationMap),
    orchestratorConfigurationList: S.optional(OrchestratorConfigurationList),
  }),
).annotations({
  identifier: "AssistantSummary",
}) as any as S.Schema<AssistantSummary>;
export type AssistantList = AssistantSummary[];
export const AssistantList = S.Array(AssistantSummary);
export interface NotifyRecommendationsReceivedError {
  recommendationId?: string;
  message?: string;
}
export const NotifyRecommendationsReceivedError = S.suspend(() =>
  S.Struct({
    recommendationId: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "NotifyRecommendationsReceivedError",
}) as any as S.Schema<NotifyRecommendationsReceivedError>;
export type NotifyRecommendationsReceivedErrorList =
  NotifyRecommendationsReceivedError[];
export const NotifyRecommendationsReceivedErrorList = S.Array(
  NotifyRecommendationsReceivedError,
);
export type ContentFeedbackData = {
  generativeContentFeedbackData: GenerativeContentFeedbackData;
};
export const ContentFeedbackData = S.Union(
  S.Struct({ generativeContentFeedbackData: GenerativeContentFeedbackData }),
);
export type QueryCondition = { single: QueryConditionItem };
export const QueryCondition = S.Union(S.Struct({ single: QueryConditionItem }));
export type QueryConditionExpression = (typeof QueryCondition)["Type"][];
export const QueryConditionExpression = S.Array(QueryCondition);
export type QueryInputData =
  | { queryTextInputData: QueryTextInputData }
  | { intentInputData: IntentInputData }
  | { caseSummarizationInputData: CaseSummarizationInputData };
export const QueryInputData = S.Union(
  S.Struct({ queryTextInputData: QueryTextInputData }),
  S.Struct({ intentInputData: IntentInputData }),
  S.Struct({ caseSummarizationInputData: CaseSummarizationInputData }),
);
export interface AIAgentSummary {
  name: string;
  assistantId: string;
  assistantArn: string;
  aiAgentId: string;
  type: string;
  aiAgentArn: string;
  modifiedTime?: Date;
  visibilityStatus: string;
  configuration?: (typeof AIAgentConfiguration)["Type"];
  origin?: string;
  description?: string;
  status?: string;
  tags?: Tags;
}
export const AIAgentSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    assistantId: S.String,
    assistantArn: S.String,
    aiAgentId: S.String,
    type: S.String,
    aiAgentArn: S.String,
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    visibilityStatus: S.String,
    configuration: S.optional(AIAgentConfiguration),
    origin: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "AIAgentSummary",
}) as any as S.Schema<AIAgentSummary>;
export type AIAgentSummaryList = AIAgentSummary[];
export const AIAgentSummaryList = S.Array(AIAgentSummary);
export interface AIAgentVersionSummary {
  aiAgentSummary?: AIAgentSummary;
  versionNumber?: number;
}
export const AIAgentVersionSummary = S.suspend(() =>
  S.Struct({
    aiAgentSummary: S.optional(AIAgentSummary),
    versionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "AIAgentVersionSummary",
}) as any as S.Schema<AIAgentVersionSummary>;
export type AIAgentVersionSummariesList = AIAgentVersionSummary[];
export const AIAgentVersionSummariesList = S.Array(AIAgentVersionSummary);
export interface AIGuardrailSummary {
  name: string;
  assistantId: string;
  assistantArn: string;
  aiGuardrailId: string;
  aiGuardrailArn: string;
  modifiedTime?: Date;
  visibilityStatus: string;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  tags?: Tags;
}
export const AIGuardrailSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    assistantId: S.String,
    assistantArn: S.String,
    aiGuardrailId: S.String,
    aiGuardrailArn: S.String,
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    visibilityStatus: S.String,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "AIGuardrailSummary",
}) as any as S.Schema<AIGuardrailSummary>;
export type AIGuardrailSummariesList = AIGuardrailSummary[];
export const AIGuardrailSummariesList = S.Array(AIGuardrailSummary);
export interface AIGuardrailVersionSummary {
  aiGuardrailSummary?: AIGuardrailSummary;
  versionNumber?: number;
}
export const AIGuardrailVersionSummary = S.suspend(() =>
  S.Struct({
    aiGuardrailSummary: S.optional(AIGuardrailSummary),
    versionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "AIGuardrailVersionSummary",
}) as any as S.Schema<AIGuardrailVersionSummary>;
export type AIGuardrailVersionSummariesList = AIGuardrailVersionSummary[];
export const AIGuardrailVersionSummariesList = S.Array(
  AIGuardrailVersionSummary,
);
export interface AIPromptSummary {
  name: string;
  assistantId: string;
  assistantArn: string;
  aiPromptId: string;
  type: string;
  aiPromptArn: string;
  modifiedTime?: Date;
  templateType: string;
  modelId: string;
  apiFormat: string;
  visibilityStatus: string;
  origin?: string;
  description?: string;
  status?: string;
  tags?: Tags;
}
export const AIPromptSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    assistantId: S.String,
    assistantArn: S.String,
    aiPromptId: S.String,
    type: S.String,
    aiPromptArn: S.String,
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    templateType: S.String,
    modelId: S.String,
    apiFormat: S.String,
    visibilityStatus: S.String,
    origin: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "AIPromptSummary",
}) as any as S.Schema<AIPromptSummary>;
export type AIPromptSummaryList = AIPromptSummary[];
export const AIPromptSummaryList = S.Array(AIPromptSummary);
export interface AIPromptVersionSummary {
  aiPromptSummary?: AIPromptSummary;
  versionNumber?: number;
}
export const AIPromptVersionSummary = S.suspend(() =>
  S.Struct({
    aiPromptSummary: S.optional(AIPromptSummary),
    versionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "AIPromptVersionSummary",
}) as any as S.Schema<AIPromptVersionSummary>;
export type AIPromptVersionSummariesList = AIPromptVersionSummary[];
export const AIPromptVersionSummariesList = S.Array(AIPromptVersionSummary);
export type AssistantAssociationInputData =
  | { knowledgeBaseId: string }
  | { externalBedrockKnowledgeBaseConfig: ExternalBedrockKnowledgeBaseConfig };
export const AssistantAssociationInputData = S.Union(
  S.Struct({ knowledgeBaseId: S.String }),
  S.Struct({
    externalBedrockKnowledgeBaseConfig: ExternalBedrockKnowledgeBaseConfig,
  }),
);
export interface KnowledgeBaseAssociationData {
  knowledgeBaseId?: string;
  knowledgeBaseArn?: string;
}
export const KnowledgeBaseAssociationData = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.optional(S.String),
    knowledgeBaseArn: S.optional(S.String),
  }),
).annotations({
  identifier: "KnowledgeBaseAssociationData",
}) as any as S.Schema<KnowledgeBaseAssociationData>;
export type AssistantAssociationOutputData =
  | { knowledgeBaseAssociation: KnowledgeBaseAssociationData }
  | { externalBedrockKnowledgeBaseConfig: ExternalBedrockKnowledgeBaseConfig };
export const AssistantAssociationOutputData = S.Union(
  S.Struct({ knowledgeBaseAssociation: KnowledgeBaseAssociationData }),
  S.Struct({
    externalBedrockKnowledgeBaseConfig: ExternalBedrockKnowledgeBaseConfig,
  }),
);
export interface AssistantAssociationSummary {
  assistantAssociationId: string;
  assistantAssociationArn: string;
  assistantId: string;
  assistantArn: string;
  associationType: string;
  associationData: (typeof AssistantAssociationOutputData)["Type"];
  tags?: Tags;
}
export const AssistantAssociationSummary = S.suspend(() =>
  S.Struct({
    assistantAssociationId: S.String,
    assistantAssociationArn: S.String,
    assistantId: S.String,
    assistantArn: S.String,
    associationType: S.String,
    associationData: AssistantAssociationOutputData,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "AssistantAssociationSummary",
}) as any as S.Schema<AssistantAssociationSummary>;
export type AssistantAssociationSummaryList = AssistantAssociationSummary[];
export const AssistantAssociationSummaryList = S.Array(
  AssistantAssociationSummary,
);
export interface ConversationState {
  status: string;
  reason?: string;
}
export const ConversationState = S.suspend(() =>
  S.Struct({ status: S.String, reason: S.optional(S.String) }),
).annotations({
  identifier: "ConversationState",
}) as any as S.Schema<ConversationState>;
export interface ConversationContext {
  selfServiceConversationHistory: SelfServiceConversationHistoryList;
}
export const ConversationContext = S.suspend(() =>
  S.Struct({
    selfServiceConversationHistory: SelfServiceConversationHistoryList,
  }),
).annotations({
  identifier: "ConversationContext",
}) as any as S.Schema<ConversationContext>;
export interface RuntimeSessionData {
  key: string | Redacted.Redacted<string>;
  value: (typeof RuntimeSessionDataValue)["Type"];
}
export const RuntimeSessionData = S.suspend(() =>
  S.Struct({ key: SensitiveString, value: RuntimeSessionDataValue }),
).annotations({
  identifier: "RuntimeSessionData",
}) as any as S.Schema<RuntimeSessionData>;
export type RuntimeSessionDataList = RuntimeSessionData[];
export const RuntimeSessionDataList = S.Array(RuntimeSessionData);
export interface KnowledgeBaseSummary {
  knowledgeBaseId: string;
  knowledgeBaseArn: string;
  name: string;
  knowledgeBaseType: string;
  status: string;
  sourceConfiguration?: (typeof SourceConfiguration)["Type"];
  vectorIngestionConfiguration?: VectorIngestionConfiguration;
  renderingConfiguration?: RenderingConfiguration;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  description?: string;
  tags?: Tags;
}
export const KnowledgeBaseSummary = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    knowledgeBaseArn: S.String,
    name: S.String,
    knowledgeBaseType: S.String,
    status: S.String,
    sourceConfiguration: S.optional(SourceConfiguration),
    vectorIngestionConfiguration: S.optional(VectorIngestionConfiguration),
    renderingConfiguration: S.optional(RenderingConfiguration),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    description: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "KnowledgeBaseSummary",
}) as any as S.Schema<KnowledgeBaseSummary>;
export type KnowledgeBaseList = KnowledgeBaseSummary[];
export const KnowledgeBaseList = S.Array(KnowledgeBaseSummary);
export interface ConnectConfiguration {
  instanceId?: string;
}
export const ConnectConfiguration = S.suspend(() =>
  S.Struct({ instanceId: S.optional(S.String) }),
).annotations({
  identifier: "ConnectConfiguration",
}) as any as S.Schema<ConnectConfiguration>;
export type Configuration = { connectConfiguration: ConnectConfiguration };
export const Configuration = S.Union(
  S.Struct({ connectConfiguration: ConnectConfiguration }),
);
export interface ExternalSourceConfiguration {
  source: string;
  configuration: (typeof Configuration)["Type"];
}
export const ExternalSourceConfiguration = S.suspend(() =>
  S.Struct({ source: S.String, configuration: Configuration }),
).annotations({
  identifier: "ExternalSourceConfiguration",
}) as any as S.Schema<ExternalSourceConfiguration>;
export interface ImportJobData {
  importJobId: string;
  knowledgeBaseId: string;
  uploadId: string;
  knowledgeBaseArn: string;
  importJobType: string;
  status: string;
  url: string | Redacted.Redacted<string>;
  failedRecordReport?: string | Redacted.Redacted<string>;
  urlExpiry: Date;
  createdTime: Date;
  lastModifiedTime: Date;
  metadata?: ContentMetadata;
  externalSourceConfiguration?: ExternalSourceConfiguration;
}
export const ImportJobData = S.suspend(() =>
  S.Struct({
    importJobId: S.String,
    knowledgeBaseId: S.String,
    uploadId: S.String,
    knowledgeBaseArn: S.String,
    importJobType: S.String,
    status: S.String,
    url: SensitiveString,
    failedRecordReport: S.optional(SensitiveString),
    urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metadata: S.optional(ContentMetadata),
    externalSourceConfiguration: S.optional(ExternalSourceConfiguration),
  }),
).annotations({
  identifier: "ImportJobData",
}) as any as S.Schema<ImportJobData>;
export interface ImportJobSummary {
  importJobId: string;
  knowledgeBaseId: string;
  uploadId: string;
  knowledgeBaseArn: string;
  importJobType: string;
  status: string;
  createdTime: Date;
  lastModifiedTime: Date;
  metadata?: ContentMetadata;
  externalSourceConfiguration?: ExternalSourceConfiguration;
}
export const ImportJobSummary = S.suspend(() =>
  S.Struct({
    importJobId: S.String,
    knowledgeBaseId: S.String,
    uploadId: S.String,
    knowledgeBaseArn: S.String,
    importJobType: S.String,
    status: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metadata: S.optional(ContentMetadata),
    externalSourceConfiguration: S.optional(ExternalSourceConfiguration),
  }),
).annotations({
  identifier: "ImportJobSummary",
}) as any as S.Schema<ImportJobSummary>;
export type ImportJobList = ImportJobSummary[];
export const ImportJobList = S.Array(ImportJobSummary);
export interface MessageTemplateSearchExpression {
  queries?: MessageTemplateQueryFieldList;
  filters?: MessageTemplateFilterFieldList;
  orderOnField?: MessageTemplateOrderField;
}
export const MessageTemplateSearchExpression = S.suspend(() =>
  S.Struct({
    queries: S.optional(MessageTemplateQueryFieldList),
    filters: S.optional(MessageTemplateFilterFieldList),
    orderOnField: S.optional(MessageTemplateOrderField),
  }),
).annotations({
  identifier: "MessageTemplateSearchExpression",
}) as any as S.Schema<MessageTemplateSearchExpression>;
export interface QuickResponseSearchExpression {
  queries?: QuickResponseQueryFieldList;
  filters?: QuickResponseFilterFieldList;
  orderOnField?: QuickResponseOrderField;
}
export const QuickResponseSearchExpression = S.suspend(() =>
  S.Struct({
    queries: S.optional(QuickResponseQueryFieldList),
    filters: S.optional(QuickResponseFilterFieldList),
    orderOnField: S.optional(QuickResponseOrderField),
  }),
).annotations({
  identifier: "QuickResponseSearchExpression",
}) as any as S.Schema<QuickResponseSearchExpression>;
export type Headers = { [key: string]: string };
export const Headers = S.Record({ key: S.String, value: S.String });
export type ContentAssociationContents = {
  amazonConnectGuideAssociation: AmazonConnectGuideAssociationData;
};
export const ContentAssociationContents = S.Union(
  S.Struct({
    amazonConnectGuideAssociation: AmazonConnectGuideAssociationData,
  }),
);
export interface ContentAssociationData {
  knowledgeBaseId: string;
  knowledgeBaseArn: string;
  contentId: string;
  contentArn: string;
  contentAssociationId: string;
  contentAssociationArn: string;
  associationType: string;
  associationData: (typeof ContentAssociationContents)["Type"];
  tags?: Tags;
}
export const ContentAssociationData = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    knowledgeBaseArn: S.String,
    contentId: S.String,
    contentArn: S.String,
    contentAssociationId: S.String,
    contentAssociationArn: S.String,
    associationType: S.String,
    associationData: ContentAssociationContents,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "ContentAssociationData",
}) as any as S.Schema<ContentAssociationData>;
export interface ContentAssociationSummary {
  knowledgeBaseId: string;
  knowledgeBaseArn: string;
  contentId: string;
  contentArn: string;
  contentAssociationId: string;
  contentAssociationArn: string;
  associationType: string;
  associationData: (typeof ContentAssociationContents)["Type"];
  tags?: Tags;
}
export const ContentAssociationSummary = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    knowledgeBaseArn: S.String,
    contentId: S.String,
    contentArn: S.String,
    contentAssociationId: S.String,
    contentAssociationArn: S.String,
    associationType: S.String,
    associationData: ContentAssociationContents,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "ContentAssociationSummary",
}) as any as S.Schema<ContentAssociationSummary>;
export type ContentAssociationSummaryList = ContentAssociationSummary[];
export const ContentAssociationSummaryList = S.Array(ContentAssociationSummary);
export interface MessageTemplateSummary {
  messageTemplateArn: string;
  messageTemplateId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  channel?: string | Redacted.Redacted<string>;
  channelSubtype: string;
  createdTime: Date;
  lastModifiedTime: Date;
  lastModifiedBy: string;
  sourceConfiguration?: (typeof MessageTemplateSourceConfiguration)["Type"];
  activeVersionNumber?: number;
  description?: string;
  tags?: Tags;
}
export const MessageTemplateSummary = S.suspend(() =>
  S.Struct({
    messageTemplateArn: S.String,
    messageTemplateId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    channel: S.optional(SensitiveString),
    channelSubtype: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedBy: S.String,
    sourceConfiguration: S.optional(MessageTemplateSourceConfiguration),
    activeVersionNumber: S.optional(S.Number),
    description: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "MessageTemplateSummary",
}) as any as S.Schema<MessageTemplateSummary>;
export type MessageTemplateSummaryList = MessageTemplateSummary[];
export const MessageTemplateSummaryList = S.Array(MessageTemplateSummary);
export interface MessageTemplateVersionSummary {
  messageTemplateArn: string;
  messageTemplateId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  channel?: string | Redacted.Redacted<string>;
  channelSubtype: string;
  isActive: boolean;
  versionNumber: number;
}
export const MessageTemplateVersionSummary = S.suspend(() =>
  S.Struct({
    messageTemplateArn: S.String,
    messageTemplateId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    channel: S.optional(SensitiveString),
    channelSubtype: S.String,
    isActive: S.Boolean,
    versionNumber: S.Number,
  }),
).annotations({
  identifier: "MessageTemplateVersionSummary",
}) as any as S.Schema<MessageTemplateVersionSummary>;
export type MessageTemplateVersionSummaryList = MessageTemplateVersionSummary[];
export const MessageTemplateVersionSummaryList = S.Array(
  MessageTemplateVersionSummary,
);
export interface QuickResponseSummary {
  quickResponseArn: string;
  quickResponseId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  contentType: string;
  status: string;
  createdTime: Date;
  lastModifiedTime: Date;
  description?: string;
  lastModifiedBy?: string;
  isActive?: boolean;
  channels?: Channels;
  tags?: Tags;
}
export const QuickResponseSummary = S.suspend(() =>
  S.Struct({
    quickResponseArn: S.String,
    quickResponseId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    contentType: S.String,
    status: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    description: S.optional(S.String),
    lastModifiedBy: S.optional(S.String),
    isActive: S.optional(S.Boolean),
    channels: S.optional(Channels),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "QuickResponseSummary",
}) as any as S.Schema<QuickResponseSummary>;
export type QuickResponseSummaryList = QuickResponseSummary[];
export const QuickResponseSummaryList = S.Array(QuickResponseSummary);
export interface FilterAttribute {
  key: string;
  value: any;
}
export const FilterAttribute = S.suspend(() =>
  S.Struct({ key: S.String, value: S.Any }),
).annotations({
  identifier: "FilterAttribute",
}) as any as S.Schema<FilterAttribute>;
export type SpanFinishReasonList = string[];
export const SpanFinishReasonList = S.Array(S.String);
export interface AssistantData {
  assistantId: string;
  assistantArn: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  tags?: Tags;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  integrationConfiguration?: AssistantIntegrationConfiguration;
  capabilityConfiguration?: AssistantCapabilityConfiguration;
  aiAgentConfiguration?: AIAgentConfigurationMap;
  orchestratorConfigurationList?: OrchestratorConfigurationList;
}
export const AssistantData = S.suspend(() =>
  S.Struct({
    assistantId: S.String,
    assistantArn: S.String,
    name: S.String,
    type: S.String,
    status: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    integrationConfiguration: S.optional(AssistantIntegrationConfiguration),
    capabilityConfiguration: S.optional(AssistantCapabilityConfiguration),
    aiAgentConfiguration: S.optional(AIAgentConfigurationMap),
    orchestratorConfigurationList: S.optional(OrchestratorConfigurationList),
  }),
).annotations({
  identifier: "AssistantData",
}) as any as S.Schema<AssistantData>;
export interface CreateAssistantResponse {
  assistant?: AssistantData;
}
export const CreateAssistantResponse = S.suspend(() =>
  S.Struct({ assistant: S.optional(AssistantData) }),
).annotations({
  identifier: "CreateAssistantResponse",
}) as any as S.Schema<CreateAssistantResponse>;
export interface ListAssistantsResponse {
  assistantSummaries: AssistantList;
  nextToken?: string;
}
export const ListAssistantsResponse = S.suspend(() =>
  S.Struct({
    assistantSummaries: AssistantList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssistantsResponse",
}) as any as S.Schema<ListAssistantsResponse>;
export interface NotifyRecommendationsReceivedResponse {
  recommendationIds?: RecommendationIdList;
  errors?: NotifyRecommendationsReceivedErrorList;
}
export const NotifyRecommendationsReceivedResponse = S.suspend(() =>
  S.Struct({
    recommendationIds: S.optional(RecommendationIdList),
    errors: S.optional(NotifyRecommendationsReceivedErrorList),
  }),
).annotations({
  identifier: "NotifyRecommendationsReceivedResponse",
}) as any as S.Schema<NotifyRecommendationsReceivedResponse>;
export interface PutFeedbackRequest {
  assistantId: string;
  targetId: string;
  targetType: string;
  contentFeedback: (typeof ContentFeedbackData)["Type"];
}
export const PutFeedbackRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    targetId: S.String,
    targetType: S.String,
    contentFeedback: ContentFeedbackData,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/assistants/{assistantId}/feedback" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutFeedbackRequest",
}) as any as S.Schema<PutFeedbackRequest>;
export interface QueryAssistantRequest {
  assistantId: string;
  queryText?: string | Redacted.Redacted<string>;
  nextToken?: string;
  maxResults?: number;
  sessionId?: string;
  queryCondition?: QueryConditionExpression;
  queryInputData?: (typeof QueryInputData)["Type"];
  overrideKnowledgeBaseSearchType?: string;
}
export const QueryAssistantRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    queryText: S.optional(SensitiveString),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    sessionId: S.optional(S.String),
    queryCondition: S.optional(QueryConditionExpression),
    queryInputData: S.optional(QueryInputData),
    overrideKnowledgeBaseSearchType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants/{assistantId}/query" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "QueryAssistantRequest",
}) as any as S.Schema<QueryAssistantRequest>;
export interface SearchSessionsRequest {
  nextToken?: string;
  maxResults?: number;
  assistantId: string;
  searchExpression: SearchExpression;
}
export const SearchSessionsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    searchExpression: SearchExpression,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/searchSessions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchSessionsRequest",
}) as any as S.Schema<SearchSessionsRequest>;
export interface UpdateAssistantAIAgentResponse {
  assistant?: AssistantData;
}
export const UpdateAssistantAIAgentResponse = S.suspend(() =>
  S.Struct({ assistant: S.optional(AssistantData) }),
).annotations({
  identifier: "UpdateAssistantAIAgentResponse",
}) as any as S.Schema<UpdateAssistantAIAgentResponse>;
export interface GetAIAgentResponse {
  aiAgent?: AIAgentData;
  versionNumber?: number;
}
export const GetAIAgentResponse = S.suspend(() =>
  S.Struct({
    aiAgent: S.optional(AIAgentData),
    versionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetAIAgentResponse",
}) as any as S.Schema<GetAIAgentResponse>;
export interface ListAIAgentsResponse {
  aiAgentSummaries: AIAgentSummaryList;
  nextToken?: string;
}
export const ListAIAgentsResponse = S.suspend(() =>
  S.Struct({
    aiAgentSummaries: AIAgentSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAIAgentsResponse",
}) as any as S.Schema<ListAIAgentsResponse>;
export interface ListAIAgentVersionsResponse {
  aiAgentVersionSummaries: AIAgentVersionSummariesList;
  nextToken?: string;
}
export const ListAIAgentVersionsResponse = S.suspend(() =>
  S.Struct({
    aiAgentVersionSummaries: AIAgentVersionSummariesList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAIAgentVersionsResponse",
}) as any as S.Schema<ListAIAgentVersionsResponse>;
export interface CreateAIGuardrailRequest {
  clientToken?: string;
  assistantId: string;
  name: string;
  blockedInputMessaging: string | Redacted.Redacted<string>;
  blockedOutputsMessaging: string | Redacted.Redacted<string>;
  visibilityStatus: string;
  description?: string | Redacted.Redacted<string>;
  topicPolicyConfig?: AIGuardrailTopicPolicyConfig;
  contentPolicyConfig?: AIGuardrailContentPolicyConfig;
  wordPolicyConfig?: AIGuardrailWordPolicyConfig;
  sensitiveInformationPolicyConfig?: AIGuardrailSensitiveInformationPolicyConfig;
  contextualGroundingPolicyConfig?: AIGuardrailContextualGroundingPolicyConfig;
  tags?: Tags;
}
export const CreateAIGuardrailRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    name: S.String,
    blockedInputMessaging: SensitiveString,
    blockedOutputsMessaging: SensitiveString,
    visibilityStatus: S.String,
    description: S.optional(SensitiveString),
    topicPolicyConfig: S.optional(AIGuardrailTopicPolicyConfig),
    contentPolicyConfig: S.optional(AIGuardrailContentPolicyConfig),
    wordPolicyConfig: S.optional(AIGuardrailWordPolicyConfig),
    sensitiveInformationPolicyConfig: S.optional(
      AIGuardrailSensitiveInformationPolicyConfig,
    ),
    contextualGroundingPolicyConfig: S.optional(
      AIGuardrailContextualGroundingPolicyConfig,
    ),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants/{assistantId}/aiguardrails" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAIGuardrailRequest",
}) as any as S.Schema<CreateAIGuardrailRequest>;
export interface GetAIGuardrailResponse {
  aiGuardrail?: AIGuardrailData;
  versionNumber?: number;
}
export const GetAIGuardrailResponse = S.suspend(() =>
  S.Struct({
    aiGuardrail: S.optional(AIGuardrailData),
    versionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetAIGuardrailResponse",
}) as any as S.Schema<GetAIGuardrailResponse>;
export interface ListAIGuardrailsResponse {
  aiGuardrailSummaries: AIGuardrailSummariesList;
  nextToken?: string;
}
export const ListAIGuardrailsResponse = S.suspend(() =>
  S.Struct({
    aiGuardrailSummaries: AIGuardrailSummariesList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAIGuardrailsResponse",
}) as any as S.Schema<ListAIGuardrailsResponse>;
export interface ListAIGuardrailVersionsResponse {
  aiGuardrailVersionSummaries: AIGuardrailVersionSummariesList;
  nextToken?: string;
}
export const ListAIGuardrailVersionsResponse = S.suspend(() =>
  S.Struct({
    aiGuardrailVersionSummaries: AIGuardrailVersionSummariesList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAIGuardrailVersionsResponse",
}) as any as S.Schema<ListAIGuardrailVersionsResponse>;
export interface CreateAIPromptRequest {
  clientToken?: string;
  assistantId: string;
  name: string;
  type: string;
  templateConfiguration: (typeof AIPromptTemplateConfiguration)["Type"];
  visibilityStatus: string;
  templateType: string;
  modelId: string;
  apiFormat: string;
  tags?: Tags;
  description?: string;
  inferenceConfiguration?: (typeof AIPromptInferenceConfiguration)["Type"];
}
export const CreateAIPromptRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    name: S.String,
    type: S.String,
    templateConfiguration: AIPromptTemplateConfiguration,
    visibilityStatus: S.String,
    templateType: S.String,
    modelId: S.String,
    apiFormat: S.String,
    tags: S.optional(Tags),
    description: S.optional(S.String),
    inferenceConfiguration: S.optional(AIPromptInferenceConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants/{assistantId}/aiprompts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAIPromptRequest",
}) as any as S.Schema<CreateAIPromptRequest>;
export interface GetAIPromptResponse {
  aiPrompt?: AIPromptData;
  versionNumber?: number;
}
export const GetAIPromptResponse = S.suspend(() =>
  S.Struct({
    aiPrompt: S.optional(AIPromptData),
    versionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetAIPromptResponse",
}) as any as S.Schema<GetAIPromptResponse>;
export interface ListAIPromptsResponse {
  aiPromptSummaries: AIPromptSummaryList;
  nextToken?: string;
}
export const ListAIPromptsResponse = S.suspend(() =>
  S.Struct({
    aiPromptSummaries: AIPromptSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAIPromptsResponse",
}) as any as S.Schema<ListAIPromptsResponse>;
export interface ListAIPromptVersionsResponse {
  aiPromptVersionSummaries: AIPromptVersionSummariesList;
  nextToken?: string;
}
export const ListAIPromptVersionsResponse = S.suspend(() =>
  S.Struct({
    aiPromptVersionSummaries: AIPromptVersionSummariesList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAIPromptVersionsResponse",
}) as any as S.Schema<ListAIPromptVersionsResponse>;
export interface CreateAssistantAssociationRequest {
  assistantId: string;
  associationType: string;
  association: (typeof AssistantAssociationInputData)["Type"];
  clientToken?: string;
  tags?: Tags;
}
export const CreateAssistantAssociationRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    associationType: S.String,
    association: AssistantAssociationInputData,
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants/{assistantId}/associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssistantAssociationRequest",
}) as any as S.Schema<CreateAssistantAssociationRequest>;
export interface ListAssistantAssociationsResponse {
  assistantAssociationSummaries: AssistantAssociationSummaryList;
  nextToken?: string;
}
export const ListAssistantAssociationsResponse = S.suspend(() =>
  S.Struct({
    assistantAssociationSummaries: AssistantAssociationSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssistantAssociationsResponse",
}) as any as S.Schema<ListAssistantAssociationsResponse>;
export interface CreateSessionRequest {
  clientToken?: string;
  assistantId: string;
  name: string;
  description?: string;
  tags?: Tags;
  tagFilter?: (typeof TagFilter)["Type"];
  aiAgentConfiguration?: AIAgentConfigurationMap;
  contactArn?: string;
  orchestratorConfigurationList?: OrchestratorConfigurationList;
  removeOrchestratorConfigurationList?: boolean;
}
export const CreateSessionRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    tagFilter: S.optional(TagFilter),
    aiAgentConfiguration: S.optional(AIAgentConfigurationMap),
    contactArn: S.optional(S.String),
    orchestratorConfigurationList: S.optional(OrchestratorConfigurationList),
    removeOrchestratorConfigurationList: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants/{assistantId}/sessions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSessionRequest",
}) as any as S.Schema<CreateSessionRequest>;
export interface GetNextMessageResponse {
  type: string;
  response: MessageOutput;
  requestMessageId: string;
  conversationState: ConversationState;
  nextMessageToken?: string;
  conversationSessionData?: RuntimeSessionDataList;
  chunkedResponseTerminated?: boolean;
}
export const GetNextMessageResponse = S.suspend(() =>
  S.Struct({
    type: S.String,
    response: MessageOutput,
    requestMessageId: S.String,
    conversationState: ConversationState,
    nextMessageToken: S.optional(S.String),
    conversationSessionData: S.optional(RuntimeSessionDataList),
    chunkedResponseTerminated: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetNextMessageResponse",
}) as any as S.Schema<GetNextMessageResponse>;
export interface UpdateSessionDataRequest {
  assistantId: string;
  sessionId: string;
  namespace?: string;
  data: RuntimeSessionDataList;
}
export const UpdateSessionDataRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    namespace: S.optional(S.String),
    data: RuntimeSessionDataList,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/assistants/{assistantId}/sessions/{sessionId}/data",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSessionDataRequest",
}) as any as S.Schema<UpdateSessionDataRequest>;
export interface GetKnowledgeBaseResponse {
  knowledgeBase?: KnowledgeBaseData;
}
export const GetKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({ knowledgeBase: S.optional(KnowledgeBaseData) }),
).annotations({
  identifier: "GetKnowledgeBaseResponse",
}) as any as S.Schema<GetKnowledgeBaseResponse>;
export interface ListKnowledgeBasesResponse {
  knowledgeBaseSummaries: KnowledgeBaseList;
  nextToken?: string;
}
export const ListKnowledgeBasesResponse = S.suspend(() =>
  S.Struct({
    knowledgeBaseSummaries: KnowledgeBaseList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKnowledgeBasesResponse",
}) as any as S.Schema<ListKnowledgeBasesResponse>;
export interface GetImportJobResponse {
  importJob?: ImportJobData;
}
export const GetImportJobResponse = S.suspend(() =>
  S.Struct({ importJob: S.optional(ImportJobData) }),
).annotations({
  identifier: "GetImportJobResponse",
}) as any as S.Schema<GetImportJobResponse>;
export interface ListImportJobsResponse {
  importJobSummaries: ImportJobList;
  nextToken?: string;
}
export const ListImportJobsResponse = S.suspend(() =>
  S.Struct({
    importJobSummaries: ImportJobList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListImportJobsResponse",
}) as any as S.Schema<ListImportJobsResponse>;
export interface SearchContentResponse {
  contentSummaries: ContentSummaryList;
  nextToken?: string;
}
export const SearchContentResponse = S.suspend(() =>
  S.Struct({
    contentSummaries: ContentSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchContentResponse",
}) as any as S.Schema<SearchContentResponse>;
export interface SearchMessageTemplatesRequest {
  knowledgeBaseId: string;
  searchExpression: MessageTemplateSearchExpression;
  nextToken?: string;
  maxResults?: number;
}
export const SearchMessageTemplatesRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    searchExpression: MessageTemplateSearchExpression,
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/search/messageTemplates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchMessageTemplatesRequest",
}) as any as S.Schema<SearchMessageTemplatesRequest>;
export interface SearchQuickResponsesRequest {
  knowledgeBaseId: string;
  searchExpression: QuickResponseSearchExpression;
  nextToken?: string;
  maxResults?: number;
  attributes?: ContactAttributes;
}
export const SearchQuickResponsesRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    searchExpression: QuickResponseSearchExpression,
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    attributes: S.optional(ContactAttributes),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/search/quickResponses",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchQuickResponsesRequest",
}) as any as S.Schema<SearchQuickResponsesRequest>;
export interface StartContentUploadResponse {
  uploadId: string;
  url: string | Redacted.Redacted<string>;
  urlExpiry: Date;
  headersToInclude: Headers;
}
export const StartContentUploadResponse = S.suspend(() =>
  S.Struct({
    uploadId: S.String,
    url: SensitiveString,
    urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    headersToInclude: Headers,
  }),
).annotations({
  identifier: "StartContentUploadResponse",
}) as any as S.Schema<StartContentUploadResponse>;
export interface CreateContentResponse {
  content?: ContentData;
}
export const CreateContentResponse = S.suspend(() =>
  S.Struct({ content: S.optional(ContentData) }),
).annotations({
  identifier: "CreateContentResponse",
}) as any as S.Schema<CreateContentResponse>;
export interface CreateContentAssociationRequest {
  clientToken?: string;
  knowledgeBaseId: string;
  contentId: string;
  associationType: string;
  association: (typeof ContentAssociationContents)["Type"];
  tags?: Tags;
}
export const CreateContentAssociationRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    associationType: S.String,
    association: ContentAssociationContents,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/contents/{contentId}/associations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateContentAssociationRequest",
}) as any as S.Schema<CreateContentAssociationRequest>;
export interface GetContentAssociationResponse {
  contentAssociation?: ContentAssociationData;
}
export const GetContentAssociationResponse = S.suspend(() =>
  S.Struct({ contentAssociation: S.optional(ContentAssociationData) }),
).annotations({
  identifier: "GetContentAssociationResponse",
}) as any as S.Schema<GetContentAssociationResponse>;
export interface ListContentAssociationsResponse {
  contentAssociationSummaries: ContentAssociationSummaryList;
  nextToken?: string;
}
export const ListContentAssociationsResponse = S.suspend(() =>
  S.Struct({
    contentAssociationSummaries: ContentAssociationSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListContentAssociationsResponse",
}) as any as S.Schema<ListContentAssociationsResponse>;
export interface GetMessageTemplateResponse {
  messageTemplate?: ExtendedMessageTemplateData;
}
export const GetMessageTemplateResponse = S.suspend(() =>
  S.Struct({ messageTemplate: S.optional(ExtendedMessageTemplateData) }),
).annotations({
  identifier: "GetMessageTemplateResponse",
}) as any as S.Schema<GetMessageTemplateResponse>;
export interface UpdateMessageTemplateResponse {
  messageTemplate?: MessageTemplateData;
}
export const UpdateMessageTemplateResponse = S.suspend(() =>
  S.Struct({ messageTemplate: S.optional(MessageTemplateData) }),
).annotations({
  identifier: "UpdateMessageTemplateResponse",
}) as any as S.Schema<UpdateMessageTemplateResponse>;
export interface ListMessageTemplatesResponse {
  messageTemplateSummaries: MessageTemplateSummaryList;
  nextToken?: string;
}
export const ListMessageTemplatesResponse = S.suspend(() =>
  S.Struct({
    messageTemplateSummaries: MessageTemplateSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMessageTemplatesResponse",
}) as any as S.Schema<ListMessageTemplatesResponse>;
export interface CreateMessageTemplateAttachmentResponse {
  attachment?: MessageTemplateAttachment;
}
export const CreateMessageTemplateAttachmentResponse = S.suspend(() =>
  S.Struct({ attachment: S.optional(MessageTemplateAttachment) }),
).annotations({
  identifier: "CreateMessageTemplateAttachmentResponse",
}) as any as S.Schema<CreateMessageTemplateAttachmentResponse>;
export interface ListMessageTemplateVersionsResponse {
  messageTemplateVersionSummaries: MessageTemplateVersionSummaryList;
  nextToken?: string;
}
export const ListMessageTemplateVersionsResponse = S.suspend(() =>
  S.Struct({
    messageTemplateVersionSummaries: MessageTemplateVersionSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMessageTemplateVersionsResponse",
}) as any as S.Schema<ListMessageTemplateVersionsResponse>;
export interface CreateQuickResponseResponse {
  quickResponse?: QuickResponseData;
}
export const CreateQuickResponseResponse = S.suspend(() =>
  S.Struct({ quickResponse: S.optional(QuickResponseData) }),
).annotations({
  identifier: "CreateQuickResponseResponse",
}) as any as S.Schema<CreateQuickResponseResponse>;
export interface ListQuickResponsesResponse {
  quickResponseSummaries: QuickResponseSummaryList;
  nextToken?: string;
}
export const ListQuickResponsesResponse = S.suspend(() =>
  S.Struct({
    quickResponseSummaries: QuickResponseSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListQuickResponsesResponse",
}) as any as S.Schema<ListQuickResponsesResponse>;
export type RetrievalFilterConfiguration =
  | { andAll: RetrievalFilterList }
  | { equals: FilterAttribute }
  | { greaterThan: FilterAttribute }
  | { greaterThanOrEquals: FilterAttribute }
  | { in: FilterAttribute }
  | { lessThan: FilterAttribute }
  | { lessThanOrEquals: FilterAttribute }
  | { listContains: FilterAttribute }
  | { notEquals: FilterAttribute }
  | { notIn: FilterAttribute }
  | { orAll: RetrievalFilterList }
  | { startsWith: FilterAttribute }
  | { stringContains: FilterAttribute };
export const RetrievalFilterConfiguration = S.Union(
  S.Struct({
    andAll: S.suspend(() => RetrievalFilterList).annotations({
      identifier: "RetrievalFilterList",
    }),
  }),
  S.Struct({ equals: FilterAttribute }),
  S.Struct({ greaterThan: FilterAttribute }),
  S.Struct({ greaterThanOrEquals: FilterAttribute }),
  S.Struct({ in: FilterAttribute }),
  S.Struct({ lessThan: FilterAttribute }),
  S.Struct({ lessThanOrEquals: FilterAttribute }),
  S.Struct({ listContains: FilterAttribute }),
  S.Struct({ notEquals: FilterAttribute }),
  S.Struct({ notIn: FilterAttribute }),
  S.Struct({
    orAll: S.suspend(() => RetrievalFilterList).annotations({
      identifier: "RetrievalFilterList",
    }),
  }),
  S.Struct({ startsWith: FilterAttribute }),
  S.Struct({ stringContains: FilterAttribute }),
) as any as S.Schema<RetrievalFilterConfiguration>;
export interface RetrievalConfiguration {
  knowledgeSource: (typeof KnowledgeSource)["Type"];
  filter?: RetrievalFilterConfiguration;
  numberOfResults?: number;
  overrideKnowledgeBaseSearchType?: string;
}
export const RetrievalConfiguration = S.suspend(() =>
  S.Struct({
    knowledgeSource: KnowledgeSource,
    filter: S.optional(RetrievalFilterConfiguration),
    numberOfResults: S.optional(S.Number),
    overrideKnowledgeBaseSearchType: S.optional(S.String),
  }),
).annotations({
  identifier: "RetrievalConfiguration",
}) as any as S.Schema<RetrievalConfiguration>;
export interface ContentReference {
  knowledgeBaseArn?: string;
  knowledgeBaseId?: string;
  contentArn?: string;
  contentId?: string;
  sourceURL?: string;
  referenceType?: string;
}
export const ContentReference = S.suspend(() =>
  S.Struct({
    knowledgeBaseArn: S.optional(S.String),
    knowledgeBaseId: S.optional(S.String),
    contentArn: S.optional(S.String),
    contentId: S.optional(S.String),
    sourceURL: S.optional(S.String),
    referenceType: S.optional(S.String),
  }),
).annotations({
  identifier: "ContentReference",
}) as any as S.Schema<ContentReference>;
export interface QueryRecommendationTriggerData {
  text?: string | Redacted.Redacted<string>;
}
export const QueryRecommendationTriggerData = S.suspend(() =>
  S.Struct({ text: S.optional(SensitiveString) }),
).annotations({
  identifier: "QueryRecommendationTriggerData",
}) as any as S.Schema<QueryRecommendationTriggerData>;
export type SpanMessageValueList = SpanMessageValue[];
export const SpanMessageValueList = S.Array(
  S.suspend(() => SpanMessageValue).annotations({
    identifier: "SpanMessageValue",
  }),
) as any as S.Schema<SpanMessageValueList>;
export interface SpanMessage {
  messageId: string;
  participant: string;
  timestamp: Date;
  values: SpanMessageValueList;
}
export const SpanMessage = S.suspend(() =>
  S.Struct({
    messageId: S.String,
    participant: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    values: SpanMessageValueList,
  }),
).annotations({ identifier: "SpanMessage" }) as any as S.Schema<SpanMessage>;
export type SpanMessageList = SpanMessage[];
export const SpanMessageList = S.Array(SpanMessage);
export interface GetAssistantResponse {
  assistant?: AssistantData;
}
export const GetAssistantResponse = S.suspend(() =>
  S.Struct({ assistant: S.optional(AssistantData) }),
).annotations({
  identifier: "GetAssistantResponse",
}) as any as S.Schema<GetAssistantResponse>;
export type DataSummaryList = DataSummary[];
export const DataSummaryList = S.Array(
  S.suspend((): S.Schema<DataSummary, any> => DataSummary).annotations({
    identifier: "DataSummary",
  }),
) as any as S.Schema<DataSummaryList>;
export interface PutFeedbackResponse {
  assistantId: string;
  assistantArn: string;
  targetId: string;
  targetType: string;
  contentFeedback: (typeof ContentFeedbackData)["Type"];
}
export const PutFeedbackResponse = S.suspend(() =>
  S.Struct({
    assistantId: S.String,
    assistantArn: S.String,
    targetId: S.String,
    targetType: S.String,
    contentFeedback: ContentFeedbackData,
  }),
).annotations({
  identifier: "PutFeedbackResponse",
}) as any as S.Schema<PutFeedbackResponse>;
export interface RetrieveRequest {
  assistantId: string;
  retrievalConfiguration: RetrievalConfiguration;
  retrievalQuery: string | Redacted.Redacted<string>;
}
export const RetrieveRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    retrievalConfiguration: RetrievalConfiguration,
    retrievalQuery: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants/{assistantId}/retrieve" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RetrieveRequest",
}) as any as S.Schema<RetrieveRequest>;
export interface CreateAIGuardrailResponse {
  aiGuardrail?: AIGuardrailData;
}
export const CreateAIGuardrailResponse = S.suspend(() =>
  S.Struct({ aiGuardrail: S.optional(AIGuardrailData) }),
).annotations({
  identifier: "CreateAIGuardrailResponse",
}) as any as S.Schema<CreateAIGuardrailResponse>;
export interface CreateAIPromptResponse {
  aiPrompt?: AIPromptData;
}
export const CreateAIPromptResponse = S.suspend(() =>
  S.Struct({ aiPrompt: S.optional(AIPromptData) }),
).annotations({
  identifier: "CreateAIPromptResponse",
}) as any as S.Schema<CreateAIPromptResponse>;
export interface AssistantAssociationData {
  assistantAssociationId: string;
  assistantAssociationArn: string;
  assistantId: string;
  assistantArn: string;
  associationType: string;
  associationData: (typeof AssistantAssociationOutputData)["Type"];
  tags?: Tags;
}
export const AssistantAssociationData = S.suspend(() =>
  S.Struct({
    assistantAssociationId: S.String,
    assistantAssociationArn: S.String,
    assistantId: S.String,
    assistantArn: S.String,
    associationType: S.String,
    associationData: AssistantAssociationOutputData,
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "AssistantAssociationData",
}) as any as S.Schema<AssistantAssociationData>;
export interface CreateAssistantAssociationResponse {
  assistantAssociation?: AssistantAssociationData;
}
export const CreateAssistantAssociationResponse = S.suspend(() =>
  S.Struct({ assistantAssociation: S.optional(AssistantAssociationData) }),
).annotations({
  identifier: "CreateAssistantAssociationResponse",
}) as any as S.Schema<CreateAssistantAssociationResponse>;
export interface CreateSessionResponse {
  session?: SessionData;
}
export const CreateSessionResponse = S.suspend(() =>
  S.Struct({ session: S.optional(SessionData) }),
).annotations({
  identifier: "CreateSessionResponse",
}) as any as S.Schema<CreateSessionResponse>;
export interface GetSessionResponse {
  session?: SessionData;
}
export const GetSessionResponse = S.suspend(() =>
  S.Struct({ session: S.optional(SessionData) }),
).annotations({
  identifier: "GetSessionResponse",
}) as any as S.Schema<GetSessionResponse>;
export interface UpdateSessionDataResponse {
  sessionArn: string;
  sessionId: string;
  namespace: string;
  data: RuntimeSessionDataList;
}
export const UpdateSessionDataResponse = S.suspend(() =>
  S.Struct({
    sessionArn: S.String,
    sessionId: S.String,
    namespace: S.String,
    data: RuntimeSessionDataList,
  }),
).annotations({
  identifier: "UpdateSessionDataResponse",
}) as any as S.Schema<UpdateSessionDataResponse>;
export interface StartImportJobRequest {
  knowledgeBaseId: string;
  importJobType: string;
  uploadId: string;
  clientToken?: string;
  metadata?: ContentMetadata;
  externalSourceConfiguration?: ExternalSourceConfiguration;
}
export const StartImportJobRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    importJobType: S.String,
    uploadId: S.String,
    clientToken: S.optional(S.String),
    metadata: S.optional(ContentMetadata),
    externalSourceConfiguration: S.optional(ExternalSourceConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/importJobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartImportJobRequest",
}) as any as S.Schema<StartImportJobRequest>;
export interface CreateContentAssociationResponse {
  contentAssociation?: ContentAssociationData;
}
export const CreateContentAssociationResponse = S.suspend(() =>
  S.Struct({ contentAssociation: S.optional(ContentAssociationData) }),
).annotations({
  identifier: "CreateContentAssociationResponse",
}) as any as S.Schema<CreateContentAssociationResponse>;
export interface RenderMessageTemplateResponse {
  content?: (typeof MessageTemplateContentProvider)["Type"];
  sourceConfigurationSummary?: (typeof MessageTemplateSourceConfigurationSummary)["Type"];
  attributesNotInterpolated?: MessageTemplateAttributeKeyList;
  attachments?: MessageTemplateAttachmentList;
}
export const RenderMessageTemplateResponse = S.suspend(() =>
  S.Struct({
    content: S.optional(MessageTemplateContentProvider),
    sourceConfigurationSummary: S.optional(
      MessageTemplateSourceConfigurationSummary,
    ),
    attributesNotInterpolated: S.optional(MessageTemplateAttributeKeyList),
    attachments: S.optional(MessageTemplateAttachmentList),
  }),
).annotations({
  identifier: "RenderMessageTemplateResponse",
}) as any as S.Schema<RenderMessageTemplateResponse>;
export type RecommendationTriggerData = {
  query: QueryRecommendationTriggerData;
};
export const RecommendationTriggerData = S.Union(
  S.Struct({ query: QueryRecommendationTriggerData }),
);
export type ContactAttributeKeys = string[];
export const ContactAttributeKeys = S.Array(S.String);
export interface Highlight {
  beginOffsetInclusive?: number;
  endOffsetExclusive?: number;
}
export const Highlight = S.suspend(() =>
  S.Struct({
    beginOffsetInclusive: S.optional(S.Number),
    endOffsetExclusive: S.optional(S.Number),
  }),
).annotations({ identifier: "Highlight" }) as any as S.Schema<Highlight>;
export type Highlights = Highlight[];
export const Highlights = S.Array(Highlight);
export interface GenerativeReference {
  modelId?: string;
  generationId?: string;
}
export const GenerativeReference = S.suspend(() =>
  S.Struct({
    modelId: S.optional(S.String),
    generationId: S.optional(S.String),
  }),
).annotations({
  identifier: "GenerativeReference",
}) as any as S.Schema<GenerativeReference>;
export interface SuggestedMessageReference {
  aiAgentId: string;
  aiAgentArn: string;
}
export const SuggestedMessageReference = S.suspend(() =>
  S.Struct({ aiAgentId: S.String, aiAgentArn: S.String }),
).annotations({
  identifier: "SuggestedMessageReference",
}) as any as S.Schema<SuggestedMessageReference>;
export interface RankingData {
  relevanceScore?: number;
  relevanceLevel?: string;
}
export const RankingData = S.suspend(() =>
  S.Struct({
    relevanceScore: S.optional(S.Number),
    relevanceLevel: S.optional(S.String),
  }),
).annotations({ identifier: "RankingData" }) as any as S.Schema<RankingData>;
export interface GenerativeDataDetails {
  completion: string | Redacted.Redacted<string>;
  references: DataSummaryList;
  rankingData: RankingData;
}
export const GenerativeDataDetails = S.suspend(() =>
  S.Struct({
    completion: SensitiveString,
    references: S.suspend(() => DataSummaryList).annotations({
      identifier: "DataSummaryList",
    }),
    rankingData: RankingData,
  }),
).annotations({
  identifier: "GenerativeDataDetails",
}) as any as S.Schema<GenerativeDataDetails>;
export interface IntentDetectedDataDetails {
  intent: string | Redacted.Redacted<string>;
  intentId: string;
  relevanceLevel?: string;
}
export const IntentDetectedDataDetails = S.suspend(() =>
  S.Struct({
    intent: SensitiveString,
    intentId: S.String,
    relevanceLevel: S.optional(S.String),
  }),
).annotations({
  identifier: "IntentDetectedDataDetails",
}) as any as S.Schema<IntentDetectedDataDetails>;
export interface DocumentText {
  text?: string | Redacted.Redacted<string>;
  highlights?: Highlights;
}
export const DocumentText = S.suspend(() =>
  S.Struct({
    text: S.optional(SensitiveString),
    highlights: S.optional(Highlights),
  }),
).annotations({ identifier: "DocumentText" }) as any as S.Schema<DocumentText>;
export interface TextData {
  title?: DocumentText;
  excerpt?: DocumentText;
}
export const TextData = S.suspend(() =>
  S.Struct({
    title: S.optional(DocumentText),
    excerpt: S.optional(DocumentText),
  }),
).annotations({ identifier: "TextData" }) as any as S.Schema<TextData>;
export interface SourceContentDataDetails {
  id: string;
  type: string;
  textData: TextData;
  rankingData: RankingData;
  citationSpan?: CitationSpan;
}
export const SourceContentDataDetails = S.suspend(() =>
  S.Struct({
    id: S.String,
    type: S.String,
    textData: TextData,
    rankingData: RankingData,
    citationSpan: S.optional(CitationSpan),
  }),
).annotations({
  identifier: "SourceContentDataDetails",
}) as any as S.Schema<SourceContentDataDetails>;
export interface GenerativeChunkDataDetails {
  completion?: string | Redacted.Redacted<string>;
  references?: DataSummaryList;
  nextChunkToken?: string;
}
export const GenerativeChunkDataDetails = S.suspend(() =>
  S.Struct({
    completion: S.optional(SensitiveString),
    references: S.optional(
      S.suspend(() => DataSummaryList).annotations({
        identifier: "DataSummaryList",
      }),
    ),
    nextChunkToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GenerativeChunkDataDetails",
}) as any as S.Schema<GenerativeChunkDataDetails>;
export interface EmailResponseChunkDataDetails {
  completion?: string | Redacted.Redacted<string>;
  nextChunkToken?: string;
}
export const EmailResponseChunkDataDetails = S.suspend(() =>
  S.Struct({
    completion: S.optional(SensitiveString),
    nextChunkToken: S.optional(S.String),
  }),
).annotations({
  identifier: "EmailResponseChunkDataDetails",
}) as any as S.Schema<EmailResponseChunkDataDetails>;
export interface EmailOverviewChunkDataDetails {
  completion?: string | Redacted.Redacted<string>;
  nextChunkToken?: string;
}
export const EmailOverviewChunkDataDetails = S.suspend(() =>
  S.Struct({
    completion: S.optional(SensitiveString),
    nextChunkToken: S.optional(S.String),
  }),
).annotations({
  identifier: "EmailOverviewChunkDataDetails",
}) as any as S.Schema<EmailOverviewChunkDataDetails>;
export interface EmailGenerativeAnswerChunkDataDetails {
  completion?: string | Redacted.Redacted<string>;
  references?: DataSummaryList;
  nextChunkToken?: string;
}
export const EmailGenerativeAnswerChunkDataDetails = S.suspend(() =>
  S.Struct({
    completion: S.optional(SensitiveString),
    references: S.optional(
      S.suspend(() => DataSummaryList).annotations({
        identifier: "DataSummaryList",
      }),
    ),
    nextChunkToken: S.optional(S.String),
  }),
).annotations({
  identifier: "EmailGenerativeAnswerChunkDataDetails",
}) as any as S.Schema<EmailGenerativeAnswerChunkDataDetails>;
export interface CaseSummarizationChunkDataDetails {
  completion?: string;
  nextChunkToken?: string;
}
export const CaseSummarizationChunkDataDetails = S.suspend(() =>
  S.Struct({
    completion: S.optional(S.String),
    nextChunkToken: S.optional(S.String),
  }),
).annotations({
  identifier: "CaseSummarizationChunkDataDetails",
}) as any as S.Schema<CaseSummarizationChunkDataDetails>;
export interface SuggestedMessageDataDetails {
  messageText: string | Redacted.Redacted<string>;
}
export const SuggestedMessageDataDetails = S.suspend(() =>
  S.Struct({ messageText: SensitiveString }),
).annotations({
  identifier: "SuggestedMessageDataDetails",
}) as any as S.Schema<SuggestedMessageDataDetails>;
export interface NotesDataDetails {
  completion?: string | Redacted.Redacted<string>;
}
export const NotesDataDetails = S.suspend(() =>
  S.Struct({ completion: S.optional(SensitiveString) }),
).annotations({
  identifier: "NotesDataDetails",
}) as any as S.Schema<NotesDataDetails>;
export interface NotesChunkDataDetails {
  completion?: string | Redacted.Redacted<string>;
  nextChunkToken?: string;
}
export const NotesChunkDataDetails = S.suspend(() =>
  S.Struct({
    completion: S.optional(SensitiveString),
    nextChunkToken: S.optional(S.String),
  }),
).annotations({
  identifier: "NotesChunkDataDetails",
}) as any as S.Schema<NotesChunkDataDetails>;
export interface SpanToolUseValue {
  toolUseId: string;
  name: string;
  arguments: any;
}
export const SpanToolUseValue = S.suspend(() =>
  S.Struct({ toolUseId: S.String, name: S.String, arguments: S.Any }),
).annotations({
  identifier: "SpanToolUseValue",
}) as any as S.Schema<SpanToolUseValue>;
export interface SpanToolResultValue {
  toolUseId: string;
  values: SpanMessageValueList;
  error?: string;
}
export const SpanToolResultValue = S.suspend(() =>
  S.Struct({
    toolUseId: S.String,
    values: S.suspend(() => SpanMessageValueList).annotations({
      identifier: "SpanMessageValueList",
    }),
    error: S.optional(S.String),
  }),
).annotations({
  identifier: "SpanToolResultValue",
}) as any as S.Schema<SpanToolResultValue>;
export interface RecommendationTrigger {
  id: string;
  type: string;
  source: string;
  data: (typeof RecommendationTriggerData)["Type"];
  recommendationIds: RecommendationIdList;
}
export const RecommendationTrigger = S.suspend(() =>
  S.Struct({
    id: S.String,
    type: S.String,
    source: S.String,
    data: RecommendationTriggerData,
    recommendationIds: RecommendationIdList,
  }),
).annotations({
  identifier: "RecommendationTrigger",
}) as any as S.Schema<RecommendationTrigger>;
export type RecommendationTriggerList = RecommendationTrigger[];
export const RecommendationTriggerList = S.Array(RecommendationTrigger);
export interface Document {
  contentReference: ContentReference;
  title?: DocumentText;
  excerpt?: DocumentText;
}
export const Document = S.suspend(() =>
  S.Struct({
    contentReference: ContentReference,
    title: S.optional(DocumentText),
    excerpt: S.optional(DocumentText),
  }),
).annotations({ identifier: "Document" }) as any as S.Schema<Document>;
export type DataReference =
  | { contentReference: ContentReference }
  | { generativeReference: GenerativeReference }
  | { suggestedMessageReference: SuggestedMessageReference };
export const DataReference = S.Union(
  S.Struct({ contentReference: ContentReference }),
  S.Struct({ generativeReference: GenerativeReference }),
  S.Struct({ suggestedMessageReference: SuggestedMessageReference }),
);
export interface DataSummary {
  reference: (typeof DataReference)["Type"];
  details: DataDetails;
}
export const DataSummary = S.suspend(() =>
  S.Struct({
    reference: DataReference,
    details: S.suspend(() => DataDetails).annotations({
      identifier: "DataDetails",
    }),
  }),
).annotations({ identifier: "DataSummary" }) as any as S.Schema<DataSummary>;
export interface ResultData {
  resultId: string;
  document?: Document;
  relevanceScore?: number;
  data?: DataSummary;
  type?: string;
}
export const ResultData = S.suspend(() =>
  S.Struct({
    resultId: S.String,
    document: S.optional(Document),
    relevanceScore: S.optional(S.Number),
    data: S.optional(DataSummary),
    type: S.optional(S.String),
  }),
).annotations({ identifier: "ResultData" }) as any as S.Schema<ResultData>;
export type QueryResultsList = ResultData[];
export const QueryResultsList = S.Array(ResultData);
export interface SessionSummary {
  sessionId: string;
  sessionArn: string;
  assistantId: string;
  assistantArn: string;
}
export const SessionSummary = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    sessionArn: S.String,
    assistantId: S.String,
    assistantArn: S.String,
  }),
).annotations({
  identifier: "SessionSummary",
}) as any as S.Schema<SessionSummary>;
export type SessionSummaries = SessionSummary[];
export const SessionSummaries = S.Array(SessionSummary);
export interface MessageTemplateSearchResultData {
  messageTemplateArn: string;
  messageTemplateId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  channel?: string | Redacted.Redacted<string>;
  channelSubtype: string;
  createdTime: Date;
  lastModifiedTime: Date;
  lastModifiedBy: string;
  isActive?: boolean;
  versionNumber?: number;
  description?: string;
  sourceConfigurationSummary?: (typeof MessageTemplateSourceConfigurationSummary)["Type"];
  groupingConfiguration?: GroupingConfiguration;
  language?: string;
  tags?: Tags;
}
export const MessageTemplateSearchResultData = S.suspend(() =>
  S.Struct({
    messageTemplateArn: S.String,
    messageTemplateId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    channel: S.optional(SensitiveString),
    channelSubtype: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedBy: S.String,
    isActive: S.optional(S.Boolean),
    versionNumber: S.optional(S.Number),
    description: S.optional(S.String),
    sourceConfigurationSummary: S.optional(
      MessageTemplateSourceConfigurationSummary,
    ),
    groupingConfiguration: S.optional(GroupingConfiguration),
    language: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "MessageTemplateSearchResultData",
}) as any as S.Schema<MessageTemplateSearchResultData>;
export type MessageTemplateSearchResultsList =
  MessageTemplateSearchResultData[];
export const MessageTemplateSearchResultsList = S.Array(
  MessageTemplateSearchResultData,
);
export interface QuickResponseSearchResultData {
  quickResponseArn: string;
  quickResponseId: string;
  knowledgeBaseArn: string;
  knowledgeBaseId: string;
  name: string;
  contentType: string;
  status: string;
  contents: QuickResponseContents;
  createdTime: Date;
  lastModifiedTime: Date;
  isActive: boolean;
  description?: string;
  groupingConfiguration?: GroupingConfiguration;
  shortcutKey?: string;
  lastModifiedBy?: string;
  channels?: Channels;
  language?: string;
  attributesNotInterpolated?: ContactAttributeKeys;
  attributesInterpolated?: ContactAttributeKeys;
  tags?: Tags;
}
export const QuickResponseSearchResultData = S.suspend(() =>
  S.Struct({
    quickResponseArn: S.String,
    quickResponseId: S.String,
    knowledgeBaseArn: S.String,
    knowledgeBaseId: S.String,
    name: S.String,
    contentType: S.String,
    status: S.String,
    contents: QuickResponseContents,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    isActive: S.Boolean,
    description: S.optional(S.String),
    groupingConfiguration: S.optional(GroupingConfiguration),
    shortcutKey: S.optional(S.String),
    lastModifiedBy: S.optional(S.String),
    channels: S.optional(Channels),
    language: S.optional(S.String),
    attributesNotInterpolated: S.optional(ContactAttributeKeys),
    attributesInterpolated: S.optional(ContactAttributeKeys),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "QuickResponseSearchResultData",
}) as any as S.Schema<QuickResponseSearchResultData>;
export type QuickResponseSearchResultsList = QuickResponseSearchResultData[];
export const QuickResponseSearchResultsList = S.Array(
  QuickResponseSearchResultData,
);
export interface QueryAssistantResponse {
  results: QueryResultsList;
  nextToken?: string;
}
export const QueryAssistantResponse = S.suspend(() =>
  S.Struct({ results: QueryResultsList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "QueryAssistantResponse",
}) as any as S.Schema<QueryAssistantResponse>;
export interface SearchSessionsResponse {
  sessionSummaries: SessionSummaries;
  nextToken?: string;
}
export const SearchSessionsResponse = S.suspend(() =>
  S.Struct({
    sessionSummaries: SessionSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchSessionsResponse",
}) as any as S.Schema<SearchSessionsResponse>;
export interface GetAssistantAssociationResponse {
  assistantAssociation?: AssistantAssociationData;
}
export const GetAssistantAssociationResponse = S.suspend(() =>
  S.Struct({ assistantAssociation: S.optional(AssistantAssociationData) }),
).annotations({
  identifier: "GetAssistantAssociationResponse",
}) as any as S.Schema<GetAssistantAssociationResponse>;
export interface SpanCitation {
  contentId?: string;
  title?: string | Redacted.Redacted<string>;
  knowledgeBaseId?: string;
  knowledgeBaseArn?: string;
}
export const SpanCitation = S.suspend(() =>
  S.Struct({
    contentId: S.optional(S.String),
    title: S.optional(SensitiveString),
    knowledgeBaseId: S.optional(S.String),
    knowledgeBaseArn: S.optional(S.String),
  }),
).annotations({ identifier: "SpanCitation" }) as any as S.Schema<SpanCitation>;
export type SpanCitationList = SpanCitation[];
export const SpanCitationList = S.Array(SpanCitation);
export interface SearchMessageTemplatesResponse {
  results: MessageTemplateSearchResultsList;
  nextToken?: string;
}
export const SearchMessageTemplatesResponse = S.suspend(() =>
  S.Struct({
    results: MessageTemplateSearchResultsList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchMessageTemplatesResponse",
}) as any as S.Schema<SearchMessageTemplatesResponse>;
export interface SearchQuickResponsesResponse {
  results: QuickResponseSearchResultsList;
  nextToken?: string;
}
export const SearchQuickResponsesResponse = S.suspend(() =>
  S.Struct({
    results: QuickResponseSearchResultsList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchQuickResponsesResponse",
}) as any as S.Schema<SearchQuickResponsesResponse>;
export interface StartImportJobResponse {
  importJob?: ImportJobData;
}
export const StartImportJobResponse = S.suspend(() =>
  S.Struct({ importJob: S.optional(ImportJobData) }),
).annotations({
  identifier: "StartImportJobResponse",
}) as any as S.Schema<StartImportJobResponse>;
export interface CreateMessageTemplateRequest {
  knowledgeBaseId: string;
  name?: string;
  content?: (typeof MessageTemplateContentProvider)["Type"];
  description?: string;
  channelSubtype: string;
  language?: string;
  sourceConfiguration?: (typeof MessageTemplateSourceConfiguration)["Type"];
  defaultAttributes?: MessageTemplateAttributes;
  groupingConfiguration?: GroupingConfiguration;
  clientToken?: string;
  tags?: Tags;
}
export const CreateMessageTemplateRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    name: S.optional(S.String),
    content: S.optional(MessageTemplateContentProvider),
    description: S.optional(S.String),
    channelSubtype: S.String,
    language: S.optional(S.String),
    sourceConfiguration: S.optional(MessageTemplateSourceConfiguration),
    defaultAttributes: S.optional(MessageTemplateAttributes),
    groupingConfiguration: S.optional(GroupingConfiguration),
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgeBases/{knowledgeBaseId}/messageTemplates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMessageTemplateRequest",
}) as any as S.Schema<CreateMessageTemplateRequest>;
export interface GetQuickResponseResponse {
  quickResponse?: QuickResponseData;
}
export const GetQuickResponseResponse = S.suspend(() =>
  S.Struct({ quickResponse: S.optional(QuickResponseData) }),
).annotations({
  identifier: "GetQuickResponseResponse",
}) as any as S.Schema<GetQuickResponseResponse>;
export interface ContentDataDetails {
  textData: TextData;
  rankingData: RankingData;
}
export const ContentDataDetails = S.suspend(() =>
  S.Struct({ textData: TextData, rankingData: RankingData }),
).annotations({
  identifier: "ContentDataDetails",
}) as any as S.Schema<ContentDataDetails>;
export interface SpanTextValue {
  value: string | Redacted.Redacted<string>;
  citations?: SpanCitationList;
  aiGuardrailAssessment?: AIGuardrailAssessment;
}
export const SpanTextValue = S.suspend(() =>
  S.Struct({
    value: SensitiveString,
    citations: S.optional(SpanCitationList),
    aiGuardrailAssessment: S.optional(AIGuardrailAssessment),
  }),
).annotations({
  identifier: "SpanTextValue",
}) as any as S.Schema<SpanTextValue>;
export interface RetrieveResult {
  associationId: string;
  sourceId: string | Redacted.Redacted<string>;
  referenceType: string;
  contentText: string | Redacted.Redacted<string>;
}
export const RetrieveResult = S.suspend(() =>
  S.Struct({
    associationId: S.String,
    sourceId: SensitiveString,
    referenceType: S.String,
    contentText: SensitiveString,
  }),
).annotations({
  identifier: "RetrieveResult",
}) as any as S.Schema<RetrieveResult>;
export type RetrieveResultList = RetrieveResult[];
export const RetrieveResultList = S.Array(RetrieveResult);
export interface MessageInput {
  value: (typeof MessageData)["Type"];
}
export const MessageInput = S.suspend(() =>
  S.Struct({ value: MessageData }),
).annotations({ identifier: "MessageInput" }) as any as S.Schema<MessageInput>;
export type DataDetails =
  | { contentData: ContentDataDetails }
  | { generativeData: GenerativeDataDetails }
  | { intentDetectedData: IntentDetectedDataDetails }
  | { sourceContentData: SourceContentDataDetails }
  | { generativeChunkData: GenerativeChunkDataDetails }
  | { emailResponseChunkData: EmailResponseChunkDataDetails }
  | { emailOverviewChunkData: EmailOverviewChunkDataDetails }
  | { emailGenerativeAnswerChunkData: EmailGenerativeAnswerChunkDataDetails }
  | { caseSummarizationChunkData: CaseSummarizationChunkDataDetails }
  | { suggestedMessageData: SuggestedMessageDataDetails }
  | { notesData: NotesDataDetails }
  | { notesChunkData: NotesChunkDataDetails };
export const DataDetails = S.Union(
  S.Struct({ contentData: ContentDataDetails }),
  S.Struct({
    generativeData: S.suspend(
      (): S.Schema<GenerativeDataDetails, any> => GenerativeDataDetails,
    ).annotations({ identifier: "GenerativeDataDetails" }),
  }),
  S.Struct({ intentDetectedData: IntentDetectedDataDetails }),
  S.Struct({ sourceContentData: SourceContentDataDetails }),
  S.Struct({
    generativeChunkData: S.suspend(
      (): S.Schema<GenerativeChunkDataDetails, any> =>
        GenerativeChunkDataDetails,
    ).annotations({ identifier: "GenerativeChunkDataDetails" }),
  }),
  S.Struct({ emailResponseChunkData: EmailResponseChunkDataDetails }),
  S.Struct({ emailOverviewChunkData: EmailOverviewChunkDataDetails }),
  S.Struct({
    emailGenerativeAnswerChunkData: S.suspend(
      (): S.Schema<EmailGenerativeAnswerChunkDataDetails, any> =>
        EmailGenerativeAnswerChunkDataDetails,
    ).annotations({ identifier: "EmailGenerativeAnswerChunkDataDetails" }),
  }),
  S.Struct({ caseSummarizationChunkData: CaseSummarizationChunkDataDetails }),
  S.Struct({ suggestedMessageData: SuggestedMessageDataDetails }),
  S.Struct({ notesData: NotesDataDetails }),
  S.Struct({ notesChunkData: NotesChunkDataDetails }),
) as any as S.Schema<DataDetails>;
export type SpanMessageValue =
  | { text: SpanTextValue }
  | { toolUse: SpanToolUseValue }
  | { toolResult: SpanToolResultValue };
export const SpanMessageValue = S.Union(
  S.Struct({ text: SpanTextValue }),
  S.Struct({ toolUse: SpanToolUseValue }),
  S.Struct({
    toolResult: S.suspend(
      (): S.Schema<SpanToolResultValue, any> => SpanToolResultValue,
    ).annotations({ identifier: "SpanToolResultValue" }),
  }),
) as any as S.Schema<SpanMessageValue>;
export interface RetrieveResponse {
  results: RetrieveResultList;
}
export const RetrieveResponse = S.suspend(() =>
  S.Struct({ results: RetrieveResultList }),
).annotations({
  identifier: "RetrieveResponse",
}) as any as S.Schema<RetrieveResponse>;
export interface SendMessageRequest {
  assistantId: string;
  sessionId: string;
  type: string;
  message: MessageInput;
  aiAgentId?: string;
  conversationContext?: ConversationContext;
  configuration?: MessageConfiguration;
  clientToken?: string;
  orchestratorUseCase?: string;
  metadata?: MessageMetadata;
}
export const SendMessageRequest = S.suspend(() =>
  S.Struct({
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    type: S.String,
    message: MessageInput,
    aiAgentId: S.optional(S.String),
    conversationContext: S.optional(ConversationContext),
    configuration: S.optional(MessageConfiguration),
    clientToken: S.optional(S.String),
    orchestratorUseCase: S.optional(S.String),
    metadata: S.optional(MessageMetadata),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assistants/{assistantId}/sessions/{sessionId}/message",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendMessageRequest",
}) as any as S.Schema<SendMessageRequest>;
export interface CreateKnowledgeBaseRequest {
  clientToken?: string;
  name: string;
  knowledgeBaseType: string;
  sourceConfiguration?: (typeof SourceConfiguration)["Type"];
  renderingConfiguration?: RenderingConfiguration;
  vectorIngestionConfiguration?: VectorIngestionConfiguration;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  description?: string;
  tags?: Tags;
}
export const CreateKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    name: S.String,
    knowledgeBaseType: S.String,
    sourceConfiguration: S.optional(SourceConfiguration),
    renderingConfiguration: S.optional(RenderingConfiguration),
    vectorIngestionConfiguration: S.optional(VectorIngestionConfiguration),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    description: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/knowledgeBases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKnowledgeBaseRequest",
}) as any as S.Schema<CreateKnowledgeBaseRequest>;
export interface CreateMessageTemplateResponse {
  messageTemplate?: MessageTemplateData;
}
export const CreateMessageTemplateResponse = S.suspend(() =>
  S.Struct({ messageTemplate: S.optional(MessageTemplateData) }),
).annotations({
  identifier: "CreateMessageTemplateResponse",
}) as any as S.Schema<CreateMessageTemplateResponse>;
export interface SpanAttributes {
  operationName?: string;
  providerName?: string;
  errorType?: string;
  agentId?: string;
  instanceArn?: string;
  contactId?: string;
  initialContactId?: string;
  sessionName?: string;
  aiAgentArn?: string;
  aiAgentType?: string;
  aiAgentName?: string;
  aiAgentId?: string;
  aiAgentVersion?: number;
  aiAgentInvoker?: string;
  aiAgentOrchestratorUseCase?: string;
  requestModel?: string;
  requestMaxTokens?: number;
  temperature?: number;
  topP?: number;
  responseModel?: string;
  responseFinishReasons?: SpanFinishReasonList;
  usageInputTokens?: number;
  usageOutputTokens?: number;
  usageTotalTokens?: number;
  cacheReadInputTokens?: number;
  cacheWriteInputTokens?: number;
  inputMessages?: SpanMessageList;
  outputMessages?: SpanMessageList;
  systemInstructions?: SpanMessageValueList;
  promptArn?: string;
  promptId?: string;
  promptType?: string;
  promptName?: string;
  promptVersion?: number;
}
export const SpanAttributes = S.suspend(() =>
  S.Struct({
    operationName: S.optional(S.String),
    providerName: S.optional(S.String),
    errorType: S.optional(S.String),
    agentId: S.optional(S.String),
    instanceArn: S.optional(S.String),
    contactId: S.optional(S.String),
    initialContactId: S.optional(S.String),
    sessionName: S.optional(S.String),
    aiAgentArn: S.optional(S.String),
    aiAgentType: S.optional(S.String),
    aiAgentName: S.optional(S.String),
    aiAgentId: S.optional(S.String),
    aiAgentVersion: S.optional(S.Number),
    aiAgentInvoker: S.optional(S.String),
    aiAgentOrchestratorUseCase: S.optional(S.String),
    requestModel: S.optional(S.String),
    requestMaxTokens: S.optional(S.Number),
    temperature: S.optional(S.Number),
    topP: S.optional(S.Number),
    responseModel: S.optional(S.String),
    responseFinishReasons: S.optional(SpanFinishReasonList),
    usageInputTokens: S.optional(S.Number),
    usageOutputTokens: S.optional(S.Number),
    usageTotalTokens: S.optional(S.Number),
    cacheReadInputTokens: S.optional(S.Number),
    cacheWriteInputTokens: S.optional(S.Number),
    inputMessages: S.optional(SpanMessageList),
    outputMessages: S.optional(SpanMessageList),
    systemInstructions: S.optional(SpanMessageValueList),
    promptArn: S.optional(S.String),
    promptId: S.optional(S.String),
    promptType: S.optional(S.String),
    promptName: S.optional(S.String),
    promptVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "SpanAttributes",
}) as any as S.Schema<SpanAttributes>;
export interface RecommendationData {
  recommendationId: string;
  document?: Document;
  relevanceScore?: number;
  relevanceLevel?: string;
  type?: string;
  data?: DataSummary;
}
export const RecommendationData = S.suspend(() =>
  S.Struct({
    recommendationId: S.String,
    document: S.optional(Document),
    relevanceScore: S.optional(S.Number),
    relevanceLevel: S.optional(S.String),
    type: S.optional(S.String),
    data: S.optional(DataSummary),
  }),
).annotations({
  identifier: "RecommendationData",
}) as any as S.Schema<RecommendationData>;
export type RecommendationList = RecommendationData[];
export const RecommendationList = S.Array(RecommendationData);
export interface Span {
  spanId: string;
  assistantId: string;
  sessionId: string;
  parentSpanId?: string;
  spanName: string;
  spanType: string;
  startTimestamp: Date;
  endTimestamp: Date;
  status: string;
  requestId: string;
  attributes: SpanAttributes;
}
export const Span = S.suspend(() =>
  S.Struct({
    spanId: S.String,
    assistantId: S.String,
    sessionId: S.String,
    parentSpanId: S.optional(S.String),
    spanName: S.String,
    spanType: S.String,
    startTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    requestId: S.String,
    attributes: SpanAttributes,
  }),
).annotations({ identifier: "Span" }) as any as S.Schema<Span>;
export type SpanList = Span[];
export const SpanList = S.Array(Span);
export interface GetRecommendationsResponse {
  recommendations: RecommendationList;
  triggers?: RecommendationTriggerList;
}
export const GetRecommendationsResponse = S.suspend(() =>
  S.Struct({
    recommendations: RecommendationList,
    triggers: S.optional(RecommendationTriggerList),
  }),
).annotations({
  identifier: "GetRecommendationsResponse",
}) as any as S.Schema<GetRecommendationsResponse>;
export interface CreateAIAgentRequest {
  clientToken?: string;
  assistantId: string;
  name: string;
  type: string;
  configuration: (typeof AIAgentConfiguration)["Type"];
  visibilityStatus: string;
  tags?: Tags;
  description?: string;
}
export const CreateAIAgentRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    name: S.String,
    type: S.String,
    configuration: AIAgentConfiguration,
    visibilityStatus: S.String,
    tags: S.optional(Tags),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistants/{assistantId}/aiagents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAIAgentRequest",
}) as any as S.Schema<CreateAIAgentRequest>;
export interface ListSpansResponse {
  spans: SpanList;
  nextToken?: string;
}
export const ListSpansResponse = S.suspend(() =>
  S.Struct({ spans: SpanList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSpansResponse",
}) as any as S.Schema<ListSpansResponse>;
export interface SendMessageResponse {
  requestMessageId: string;
  configuration?: MessageConfiguration;
  nextMessageToken: string;
}
export const SendMessageResponse = S.suspend(() =>
  S.Struct({
    requestMessageId: S.String,
    configuration: S.optional(MessageConfiguration),
    nextMessageToken: S.String,
  }),
).annotations({
  identifier: "SendMessageResponse",
}) as any as S.Schema<SendMessageResponse>;
export interface CreateKnowledgeBaseResponse {
  knowledgeBase?: KnowledgeBaseData;
}
export const CreateKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({ knowledgeBase: S.optional(KnowledgeBaseData) }),
).annotations({
  identifier: "CreateKnowledgeBaseResponse",
}) as any as S.Schema<CreateKnowledgeBaseResponse>;
export interface CreateAIAgentResponse {
  aiAgent?: AIAgentData;
}
export const CreateAIAgentResponse = S.suspend(() =>
  S.Struct({ aiAgent: S.optional(AIAgentData) }),
).annotations({
  identifier: "CreateAIAgentResponse",
}) as any as S.Schema<CreateAIAgentResponse>;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withBadRequestError, C.withRetryableError) {}
export class UnprocessableContentException extends S.TaggedError<UnprocessableContentException>()(
  "UnprocessableContentException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class DependencyFailedException extends S.TaggedError<DependencyFailedException>()(
  "DependencyFailedException",
  { message: S.optional(S.String) },
) {}
export class RequestTimeoutException extends S.TaggedError<RequestTimeoutException>()(
  "RequestTimeoutException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withTimeoutError, C.withRetryableError) {}

//# Operations
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists messages on an Amazon Q in Connect session.
 */
export const listMessages: {
  (
    input: ListMessagesRequest,
  ): Effect.Effect<
    ListMessagesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMessagesRequest,
  ) => Stream.Stream<
    ListMessagesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMessagesRequest,
  ) => Stream.Stream<
    MessageOutput,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMessagesRequest,
  output: ListMessagesResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "messages",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about the knowledge base.
 */
export const getKnowledgeBase: (
  input: GetKnowledgeBaseRequest,
) => Effect.Effect<
  GetKnowledgeBaseResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKnowledgeBaseRequest,
  output: GetKnowledgeBaseResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists the knowledge bases.
 */
export const listKnowledgeBases: {
  (
    input: ListKnowledgeBasesRequest,
  ): Effect.Effect<
    ListKnowledgeBasesResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKnowledgeBasesRequest,
  ) => Stream.Stream<
    ListKnowledgeBasesResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKnowledgeBasesRequest,
  ) => Stream.Stream<
    KnowledgeBaseSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKnowledgeBasesRequest,
  output: ListKnowledgeBasesResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "knowledgeBaseSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the started import job.
 */
export const getImportJob: (
  input: GetImportJobRequest,
) => Effect.Effect<
  GetImportJobResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportJobRequest,
  output: GetImportJobResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists information about import jobs.
 */
export const listImportJobs: {
  (
    input: ListImportJobsRequest,
  ): Effect.Effect<
    ListImportJobsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportJobsRequest,
  ) => Stream.Stream<
    ListImportJobsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListImportJobsRequest,
  ) => Stream.Stream<
    ImportJobSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImportJobsRequest,
  output: ListImportJobsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "importJobSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches for content in a specified knowledge base. Can be used to get a specific content resource by its name.
 */
export const searchContent: {
  (
    input: SearchContentRequest,
  ): Effect.Effect<
    SearchContentResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchContentRequest,
  ) => Stream.Stream<
    SearchContentResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchContentRequest,
  ) => Stream.Stream<
    ContentSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchContentRequest,
  output: SearchContentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "contentSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get a URL to upload content to a knowledge base. To upload content, first make a PUT request to the returned URL with your file, making sure to include the required headers. Then use CreateContent to finalize the content creation process or UpdateContent to modify an existing resource. You can only upload content to a knowledge base of type CUSTOM.
 */
export const startContentUpload: (
  input: StartContentUploadRequest,
) => Effect.Effect<
  StartContentUploadResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartContentUploadRequest,
  output: StartContentUploadResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates information about the content.
 */
export const updateContent: (
  input: UpdateContentRequest,
) => Effect.Effect<
  UpdateContentResponse,
  | AccessDeniedException
  | PreconditionFailedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContentRequest,
  output: UpdateContentResponse,
  errors: [
    AccessDeniedException,
    PreconditionFailedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Returns the content association.
 *
 * For more information about content associations--what they are and when they are used--see Integrate Amazon Q in Connect with step-by-step guides in the *Amazon Connect Administrator Guide*.
 */
export const getContentAssociation: (
  input: GetContentAssociationRequest,
) => Effect.Effect<
  GetContentAssociationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContentAssociationRequest,
  output: GetContentAssociationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists the content associations.
 *
 * For more information about content associations--what they are and when they are used--see Integrate Amazon Q in Connect with step-by-step guides in the *Amazon Connect Administrator Guide*.
 */
export const listContentAssociations: {
  (
    input: ListContentAssociationsRequest,
  ): Effect.Effect<
    ListContentAssociationsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListContentAssociationsRequest,
  ) => Stream.Stream<
    ListContentAssociationsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListContentAssociationsRequest,
  ) => Stream.Stream<
    ContentAssociationSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListContentAssociationsRequest,
  output: ListContentAssociationsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "contentAssociationSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists information about quick response.
 */
export const listQuickResponses: {
  (
    input: ListQuickResponsesRequest,
  ): Effect.Effect<
    ListQuickResponsesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQuickResponsesRequest,
  ) => Stream.Stream<
    ListQuickResponsesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQuickResponsesRequest,
  ) => Stream.Stream<
    QuickResponseSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQuickResponsesRequest,
  output: ListQuickResponsesResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "quickResponseSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds the specified tags to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  ResourceNotFoundException | TooManyTagsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, TooManyTagsException],
}));
/**
 * Removes the AI Agent that is set for use by default on an Amazon Q in Connect Assistant.
 */
export const removeAssistantAIAgent: (
  input: RemoveAssistantAIAgentRequest,
) => Effect.Effect<
  RemoveAssistantAIAgentResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveAssistantAIAgentRequest,
  output: RemoveAssistantAIAgentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a session. A session is a contextual container used for generating recommendations. Amazon Connect updates the existing Amazon Q in Connect session for each contact on which Amazon Q in Connect is enabled.
 */
export const updateSession: (
  input: UpdateSessionRequest,
) => Effect.Effect<
  UpdateSessionResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSessionRequest,
  output: UpdateSessionResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves content, including a pre-signed URL to download the content.
 */
export const getContent: (
  input: GetContentRequest,
) => Effect.Effect<
  GetContentResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContentRequest,
  output: GetContentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves summary information about the content.
 */
export const getContentSummary: (
  input: GetContentSummaryRequest,
) => Effect.Effect<
  GetContentSummaryResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContentSummaryRequest,
  output: GetContentSummaryResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes an assistant association.
 */
export const deleteAssistantAssociation: (
  input: DeleteAssistantAssociationRequest,
) => Effect.Effect<
  DeleteAssistantAssociationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssistantAssociationRequest,
  output: DeleteAssistantAssociationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes the content association.
 *
 * For more information about content associations--what they are and when they are used--see Integrate Amazon Q in Connect with step-by-step guides in the *Amazon Connect Administrator Guide*.
 */
export const deleteContentAssociation: (
  input: DeleteContentAssociationRequest,
) => Effect.Effect<
  DeleteContentAssociationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContentAssociationRequest,
  output: DeleteContentAssociationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes a quick response.
 */
export const deleteQuickResponse: (
  input: DeleteQuickResponseRequest,
) => Effect.Effect<
  DeleteQuickResponseResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQuickResponseRequest,
  output: DeleteQuickResponseResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates an AI Guardrail.
 */
export const updateAIGuardrail: (
  input: UpdateAIGuardrailRequest,
) => Effect.Effect<
  UpdateAIGuardrailResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAIGuardrailRequest,
  output: UpdateAIGuardrailResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates an AI Prompt.
 */
export const updateAIPrompt: (
  input: UpdateAIPromptRequest,
) => Effect.Effect<
  UpdateAIPromptResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAIPromptRequest,
  output: UpdateAIPromptResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Activates a specific version of the Amazon Q in Connect message template. After the version is activated, the previous active version will be deactivated automatically. You can use the `$ACTIVE_VERSION` qualifier later to reference the version that is in active status.
 */
export const activateMessageTemplate: (
  input: ActivateMessageTemplateRequest,
) => Effect.Effect<
  ActivateMessageTemplateResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivateMessageTemplateRequest,
  output: ActivateMessageTemplateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deactivates a specific version of the Amazon Q in Connect message template . After the version is deactivated, you can no longer use the `$ACTIVE_VERSION` qualifier to reference the version in active status.
 */
export const deactivateMessageTemplate: (
  input: DeactivateMessageTemplateRequest,
) => Effect.Effect<
  DeactivateMessageTemplateResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeactivateMessageTemplateRequest,
  output: DeactivateMessageTemplateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the Amazon Q in Connect message template metadata. Note that any modification to the message template’s name, description and grouping configuration will applied to the message template pointed by the `$LATEST` qualifier and all available versions. Partial update is supported. If any field is not supplied, it will remain unchanged for the message template.
 */
export const updateMessageTemplateMetadata: (
  input: UpdateMessageTemplateMetadataRequest,
) => Effect.Effect<
  UpdateMessageTemplateMetadataResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMessageTemplateMetadataRequest,
  output: UpdateMessageTemplateMetadataResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing Amazon Q in Connect quick response.
 */
export const updateQuickResponse: (
  input: UpdateQuickResponseRequest,
) => Effect.Effect<
  UpdateQuickResponseResponse,
  | AccessDeniedException
  | ConflictException
  | PreconditionFailedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQuickResponseRequest,
  output: UpdateQuickResponseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PreconditionFailedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon Q in Connect AI Agent Version.
 */
export const deleteAIAgentVersion: (
  input: DeleteAIAgentVersionRequest,
) => Effect.Effect<
  DeleteAIAgentVersionResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAIAgentVersionRequest,
  output: DeleteAIAgentVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon Q in Connect AI Guardrail.
 */
export const deleteAIGuardrail: (
  input: DeleteAIGuardrailRequest,
) => Effect.Effect<
  DeleteAIGuardrailResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAIGuardrailRequest,
  output: DeleteAIGuardrailResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Delete and Amazon Q in Connect AI Guardrail version.
 */
export const deleteAIGuardrailVersion: (
  input: DeleteAIGuardrailVersionRequest,
) => Effect.Effect<
  DeleteAIGuardrailVersionResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAIGuardrailVersionRequest,
  output: DeleteAIGuardrailVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Delete and Amazon Q in Connect AI Prompt version.
 */
export const deleteAIPromptVersion: (
  input: DeleteAIPromptVersionRequest,
) => Effect.Effect<
  DeleteAIPromptVersionResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAIPromptVersionRequest,
  output: DeleteAIPromptVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes the knowledge base.
 *
 * When you use this API to delete an external knowledge base such as Salesforce or ServiceNow, you must also delete the Amazon AppIntegrations DataIntegration. This is because you can't reuse the DataIntegration after it's been associated with an external knowledge base. However, you can delete and recreate it. See DeleteDataIntegration and CreateDataIntegration in the *Amazon AppIntegrations API Reference*.
 */
export const deleteKnowledgeBase: (
  input: DeleteKnowledgeBaseRequest,
) => Effect.Effect<
  DeleteKnowledgeBaseResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKnowledgeBaseRequest,
  output: DeleteKnowledgeBaseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes the quick response import job.
 */
export const deleteImportJob: (
  input: DeleteImportJobRequest,
) => Effect.Effect<
  DeleteImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImportJobRequest,
  output: DeleteImportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes the content.
 */
export const deleteContent: (
  input: DeleteContentRequest,
) => Effect.Effect<
  DeleteContentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContentRequest,
  output: DeleteContentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon Q in Connect message template entirely or a specific version of the message template if version is supplied in the request. You can provide the message template identifier as `<message-template-id>:<versionNumber>` to delete a specific version of the message template. If it is not supplied, the message template and all available versions will be deleted.
 */
export const deleteMessageTemplate: (
  input: DeleteMessageTemplateRequest,
) => Effect.Effect<
  DeleteMessageTemplateResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMessageTemplateRequest,
  output: DeleteMessageTemplateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the attachment file from the Amazon Q in Connect message template that is referenced by `$LATEST` qualifier. Attachments on available message template versions will remain unchanged.
 */
export const deleteMessageTemplateAttachment: (
  input: DeleteMessageTemplateAttachmentRequest,
) => Effect.Effect<
  DeleteMessageTemplateAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMessageTemplateAttachmentRequest,
  output: DeleteMessageTemplateAttachmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the template URI of a knowledge base. This is only supported for knowledge bases of type EXTERNAL. Include a single variable in `${variable}` format; this interpolated by Amazon Q in Connect using ingested content. For example, if you ingest a Salesforce article, it has an `Id` value, and you can set the template URI to `https://myInstanceName.lightning.force.com/lightning/r/Knowledge__kav/*${Id}*\/view`.
 */
export const updateKnowledgeBaseTemplateUri: (
  input: UpdateKnowledgeBaseTemplateUriRequest,
) => Effect.Effect<
  UpdateKnowledgeBaseTemplateUriResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKnowledgeBaseTemplateUriRequest,
  output: UpdateKnowledgeBaseTemplateUriResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the content.
 */
export const listContents: {
  (
    input: ListContentsRequest,
  ): Effect.Effect<
    ListContentsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListContentsRequest,
  ) => Stream.Stream<
    ListContentsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListContentsRequest,
  ) => Stream.Stream<
    ContentSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListContentsRequest,
  output: ListContentsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "contentSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes a URI template from a knowledge base.
 */
export const removeKnowledgeBaseTemplateUri: (
  input: RemoveKnowledgeBaseTemplateUriRequest,
) => Effect.Effect<
  RemoveKnowledgeBaseTemplateUriResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveKnowledgeBaseTemplateUriRequest,
  output: RemoveKnowledgeBaseTemplateUriResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an assistant.
 */
export const deleteAssistant: (
  input: DeleteAssistantRequest,
) => Effect.Effect<
  DeleteAssistantResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssistantRequest,
  output: DeleteAssistantResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists information about assistants.
 */
export const listAssistants: {
  (
    input: ListAssistantsRequest,
  ): Effect.Effect<
    ListAssistantsResponse,
    | AccessDeniedException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssistantsRequest,
  ) => Stream.Stream<
    ListAssistantsResponse,
    | AccessDeniedException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssistantsRequest,
  ) => Stream.Stream<
    AssistantSummary,
    | AccessDeniedException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssistantsRequest,
  output: ListAssistantsResponse,
  errors: [AccessDeniedException, UnauthorizedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assistantSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes the specified recommendations from the specified assistant's queue of newly available recommendations. You can use this API in conjunction with GetRecommendations and a `waitTimeSeconds` input for long-polling behavior and avoiding duplicate recommendations.
 */
export const notifyRecommendationsReceived: (
  input: NotifyRecommendationsReceivedRequest,
) => Effect.Effect<
  NotifyRecommendationsReceivedResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: NotifyRecommendationsReceivedRequest,
  output: NotifyRecommendationsReceivedResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists information about assistant associations.
 */
export const listAssistantAssociations: {
  (
    input: ListAssistantAssociationsRequest,
  ): Effect.Effect<
    ListAssistantAssociationsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssistantAssociationsRequest,
  ) => Stream.Stream<
    ListAssistantAssociationsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssistantAssociationsRequest,
  ) => Stream.Stream<
    AssistantAssociationSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssistantAssociationsRequest,
  output: ListAssistantAssociationsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assistantAssociationSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes an Amazon Q in Connect AI Agent.
 */
export const deleteAIAgent: (
  input: DeleteAIAgentRequest,
) => Effect.Effect<
  DeleteAIAgentResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAIAgentRequest,
  output: DeleteAIAgentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon Q in Connect AI Prompt.
 */
export const deleteAIPrompt: (
  input: DeleteAIPromptRequest,
) => Effect.Effect<
  DeleteAIPromptResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAIPromptRequest,
  output: DeleteAIPromptResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates the AI Agent that is set for use by default on an Amazon Q in Connect Assistant.
 */
export const updateAssistantAIAgent: (
  input: UpdateAssistantAIAgentRequest,
) => Effect.Effect<
  UpdateAssistantAIAgentResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssistantAIAgentRequest,
  output: UpdateAssistantAIAgentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets an Amazon Q in Connect AI Agent.
 */
export const getAIAgent: (
  input: GetAIAgentRequest,
) => Effect.Effect<
  GetAIAgentResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAIAgentRequest,
  output: GetAIAgentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates an AI Agent.
 */
export const updateAIAgent: (
  input: UpdateAIAgentRequest,
) => Effect.Effect<
  UpdateAIAgentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAIAgentRequest,
  output: UpdateAIAgentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists AI Agents.
 */
export const listAIAgents: {
  (
    input: ListAIAgentsRequest,
  ): Effect.Effect<
    ListAIAgentsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAIAgentsRequest,
  ) => Stream.Stream<
    ListAIAgentsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAIAgentsRequest,
  ) => Stream.Stream<
    AIAgentSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAIAgentsRequest,
  output: ListAIAgentsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "aiAgentSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List AI Agent versions.
 */
export const listAIAgentVersions: {
  (
    input: ListAIAgentVersionsRequest,
  ): Effect.Effect<
    ListAIAgentVersionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAIAgentVersionsRequest,
  ) => Stream.Stream<
    ListAIAgentVersionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAIAgentVersionsRequest,
  ) => Stream.Stream<
    AIAgentVersionSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAIAgentVersionsRequest,
  output: ListAIAgentVersionsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "aiAgentVersionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets the Amazon Q in Connect AI Guardrail.
 */
export const getAIGuardrail: (
  input: GetAIGuardrailRequest,
) => Effect.Effect<
  GetAIGuardrailResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAIGuardrailRequest,
  output: GetAIGuardrailResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists the AI Guardrails available on the Amazon Q in Connect assistant.
 */
export const listAIGuardrails: {
  (
    input: ListAIGuardrailsRequest,
  ): Effect.Effect<
    ListAIGuardrailsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAIGuardrailsRequest,
  ) => Stream.Stream<
    ListAIGuardrailsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAIGuardrailsRequest,
  ) => Stream.Stream<
    AIGuardrailSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAIGuardrailsRequest,
  output: ListAIGuardrailsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "aiGuardrailSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists AI Guardrail versions.
 */
export const listAIGuardrailVersions: {
  (
    input: ListAIGuardrailVersionsRequest,
  ): Effect.Effect<
    ListAIGuardrailVersionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAIGuardrailVersionsRequest,
  ) => Stream.Stream<
    ListAIGuardrailVersionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAIGuardrailVersionsRequest,
  ) => Stream.Stream<
    AIGuardrailVersionSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAIGuardrailVersionsRequest,
  output: ListAIGuardrailVersionsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "aiGuardrailVersionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets and Amazon Q in Connect AI Prompt.
 */
export const getAIPrompt: (
  input: GetAIPromptRequest,
) => Effect.Effect<
  GetAIPromptResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAIPromptRequest,
  output: GetAIPromptResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists the AI Prompts available on the Amazon Q in Connect assistant.
 */
export const listAIPrompts: {
  (
    input: ListAIPromptsRequest,
  ): Effect.Effect<
    ListAIPromptsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAIPromptsRequest,
  ) => Stream.Stream<
    ListAIPromptsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAIPromptsRequest,
  ) => Stream.Stream<
    AIPromptSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAIPromptsRequest,
  output: ListAIPromptsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "aiPromptSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists AI Prompt versions.
 */
export const listAIPromptVersions: {
  (
    input: ListAIPromptVersionsRequest,
  ): Effect.Effect<
    ListAIPromptVersionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAIPromptVersionsRequest,
  ) => Stream.Stream<
    ListAIPromptVersionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAIPromptVersionsRequest,
  ) => Stream.Stream<
    AIPromptVersionSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAIPromptVersionsRequest,
  output: ListAIPromptVersionsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "aiPromptVersionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the Amazon Q in Connect message template. The message template identifier can contain an optional qualifier, for example, `<message-template-id>:<qualifier>`, which is either an actual version number or an Amazon Q Connect managed qualifier `$ACTIVE_VERSION` | `$LATEST`. If it is not supplied, then `$LATEST` is assumed implicitly.
 */
export const getMessageTemplate: (
  input: GetMessageTemplateRequest,
) => Effect.Effect<
  GetMessageTemplateResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMessageTemplateRequest,
  output: GetMessageTemplateResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates the Amazon Q in Connect message template. Partial update is supported. If any field is not supplied, it will remain unchanged for the message template that is referenced by the `$LATEST` qualifier. Any modification will only apply to the message template that is referenced by the `$LATEST` qualifier. The fields for all available versions will remain unchanged.
 */
export const updateMessageTemplate: (
  input: UpdateMessageTemplateRequest,
) => Effect.Effect<
  UpdateMessageTemplateResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMessageTemplateRequest,
  output: UpdateMessageTemplateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the available Amazon Q in Connect message templates for the specified knowledge base.
 */
export const listMessageTemplates: {
  (
    input: ListMessageTemplatesRequest,
  ): Effect.Effect<
    ListMessageTemplatesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMessageTemplatesRequest,
  ) => Stream.Stream<
    ListMessageTemplatesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMessageTemplatesRequest,
  ) => Stream.Stream<
    MessageTemplateSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMessageTemplatesRequest,
  output: ListMessageTemplatesResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "messageTemplateSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all the available versions for the specified Amazon Q in Connect message template.
 */
export const listMessageTemplateVersions: {
  (
    input: ListMessageTemplateVersionsRequest,
  ): Effect.Effect<
    ListMessageTemplateVersionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMessageTemplateVersionsRequest,
  ) => Stream.Stream<
    ListMessageTemplateVersionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMessageTemplateVersionsRequest,
  ) => Stream.Stream<
    MessageTemplateVersionSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMessageTemplateVersionsRequest,
  output: ListMessageTemplateVersionsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "messageTemplateVersionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about an assistant.
 */
export const getAssistant: (
  input: GetAssistantRequest,
) => Effect.Effect<
  GetAssistantResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssistantRequest,
  output: GetAssistantResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Provides feedback against the specified assistant for the specified target. This API only supports generative targets.
 */
export const putFeedback: (
  input: PutFeedbackRequest,
) => Effect.Effect<
  PutFeedbackResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFeedbackRequest,
  output: PutFeedbackResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves information for a specified session.
 */
export const getSession: (
  input: GetSessionRequest,
) => Effect.Effect<
  GetSessionResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionRequest,
  output: GetSessionResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves next message on an Amazon Q in Connect session.
 */
export const getNextMessage: (
  input: GetNextMessageRequest,
) => Effect.Effect<
  GetNextMessageResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnprocessableContentException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNextMessageRequest,
  output: GetNextMessageResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnprocessableContentException,
    ValidationException,
  ],
}));
/**
 * Updates the data stored on an Amazon Q in Connect Session.
 */
export const updateSessionData: (
  input: UpdateSessionDataRequest,
) => Effect.Effect<
  UpdateSessionDataResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSessionDataRequest,
  output: UpdateSessionDataResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates Amazon Q in Connect content. Before to calling this API, use StartContentUpload to upload an asset.
 */
export const createContent: (
  input: CreateContentRequest,
) => Effect.Effect<
  CreateContentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContentRequest,
  output: CreateContentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates an association between a content resource in a knowledge base and step-by-step guides. Step-by-step guides offer instructions to agents for resolving common customer issues. You create a content association to integrate Amazon Q in Connect and step-by-step guides.
 *
 * After you integrate Amazon Q and step-by-step guides, when Amazon Q provides a recommendation to an agent based on the intent that it's detected, it also provides them with the option to start the step-by-step guide that you have associated with the content.
 *
 * Note the following limitations:
 *
 * - You can create only one content association for each content resource in a knowledge base.
 *
 * - You can associate a step-by-step guide with multiple content resources.
 *
 * For more information, see Integrate Amazon Q in Connect with step-by-step guides in the *Amazon Connect Administrator Guide*.
 */
export const createContentAssociation: (
  input: CreateContentAssociationRequest,
) => Effect.Effect<
  CreateContentAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContentAssociationRequest,
  output: CreateContentAssociationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Renders the Amazon Q in Connect message template based on the attribute values provided and generates the message content. For any variable present in the message template, if the attribute value is neither provided in the attribute request parameter nor the default attribute of the message template, the rendered message content will keep the variable placeholder as it is and return the attribute keys that are missing.
 */
export const renderMessageTemplate: (
  input: RenderMessageTemplateRequest,
) => Effect.Effect<
  RenderMessageTemplateResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RenderMessageTemplateRequest,
  output: RenderMessageTemplateResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Uploads an attachment file to the specified Amazon Q in Connect message template. The name of the message template attachment has to be unique for each message template referenced by the `$LATEST` qualifier. The body of the attachment file should be encoded using base64 encoding. After the file is uploaded, you can use the pre-signed Amazon S3 URL returned in response to download the uploaded file.
 */
export const createMessageTemplateAttachment: (
  input: CreateMessageTemplateAttachmentRequest,
) => Effect.Effect<
  CreateMessageTemplateAttachmentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMessageTemplateAttachmentRequest,
  output: CreateMessageTemplateAttachmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Q in Connect quick response.
 */
export const createQuickResponse: (
  input: CreateQuickResponseRequest,
) => Effect.Effect<
  CreateQuickResponseResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQuickResponseRequest,
  output: CreateQuickResponseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates and Amazon Q in Connect AI Agent version.
 */
export const createAIAgentVersion: (
  input: CreateAIAgentVersionRequest,
) => Effect.Effect<
  CreateAIAgentVersionResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAIAgentVersionRequest,
  output: CreateAIAgentVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Q in Connect AI Guardrail version.
 */
export const createAIGuardrailVersion: (
  input: CreateAIGuardrailVersionRequest,
) => Effect.Effect<
  CreateAIGuardrailVersionResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAIGuardrailVersionRequest,
  output: CreateAIGuardrailVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Q in Connect AI Prompt version.
 */
export const createAIPromptVersion: (
  input: CreateAIPromptVersionRequest,
) => Effect.Effect<
  CreateAIPromptVersionResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAIPromptVersionRequest,
  output: CreateAIPromptVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates a new Amazon Q in Connect message template version from the current content and configuration of a message template. Versions are immutable and monotonically increasing. Once a version is created, you can reference a specific version of the message template by passing in `<message-template-id>:<versionNumber>` as the message template identifier. An error is displayed if the supplied `messageTemplateContentSha256` is different from the `messageTemplateContentSha256` of the message template with `$LATEST` qualifier. If multiple `CreateMessageTemplateVersion` requests are made while the message template remains the same, only the first invocation creates a new version and the succeeding requests will return the same response as the first invocation.
 */
export const createMessageTemplateVersion: (
  input: CreateMessageTemplateVersionRequest,
) => Effect.Effect<
  CreateMessageTemplateVersionResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMessageTemplateVersionRequest,
  output: CreateMessageTemplateVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Q in Connect assistant.
 */
export const createAssistant: (
  input: CreateAssistantRequest,
) => Effect.Effect<
  CreateAssistantResponse,
  | AccessDeniedException
  | ConflictException
  | ServiceQuotaExceededException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssistantRequest,
  output: CreateAssistantResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Q in Connect AI Guardrail.
 */
export const createAIGuardrail: (
  input: CreateAIGuardrailRequest,
) => Effect.Effect<
  CreateAIGuardrailResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAIGuardrailRequest,
  output: CreateAIGuardrailResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Q in Connect AI Prompt.
 */
export const createAIPrompt: (
  input: CreateAIPromptRequest,
) => Effect.Effect<
  CreateAIPromptResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAIPromptRequest,
  output: CreateAIPromptResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates an association between an Amazon Q in Connect assistant and another resource. Currently, the only supported association is with a knowledge base. An assistant can have only a single association.
 */
export const createAssistantAssociation: (
  input: CreateAssistantAssociationRequest,
) => Effect.Effect<
  CreateAssistantAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssistantAssociationRequest,
  output: CreateAssistantAssociationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Searches for sessions.
 */
export const searchSessions: {
  (
    input: SearchSessionsRequest,
  ): Effect.Effect<
    SearchSessionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchSessionsRequest,
  ) => Stream.Stream<
    SearchSessionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchSessionsRequest,
  ) => Stream.Stream<
    SessionSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchSessionsRequest,
  output: SearchSessionsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "sessionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about an assistant association.
 */
export const getAssistantAssociation: (
  input: GetAssistantAssociationRequest,
) => Effect.Effect<
  GetAssistantAssociationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssistantAssociationRequest,
  output: GetAssistantAssociationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates a session. A session is a contextual container used for generating recommendations. Amazon Connect creates a new Amazon Q in Connect session for each contact on which Amazon Q in Connect is enabled.
 */
export const createSession: (
  input: CreateSessionRequest,
) => Effect.Effect<
  CreateSessionResponse,
  | AccessDeniedException
  | ConflictException
  | DependencyFailedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSessionRequest,
  output: CreateSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DependencyFailedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Searches for Amazon Q in Connect message templates in the specified knowledge base.
 */
export const searchMessageTemplates: {
  (
    input: SearchMessageTemplatesRequest,
  ): Effect.Effect<
    SearchMessageTemplatesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchMessageTemplatesRequest,
  ) => Stream.Stream<
    SearchMessageTemplatesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchMessageTemplatesRequest,
  ) => Stream.Stream<
    MessageTemplateSearchResultData,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchMessageTemplatesRequest,
  output: SearchMessageTemplatesResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "results",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Start an asynchronous job to import Amazon Q in Connect resources from an uploaded source file. Before calling this API, use StartContentUpload to upload an asset that contains the resource data.
 *
 * - For importing Amazon Q in Connect quick responses, you need to upload a csv file including the quick responses. For information about how to format the csv file for importing quick responses, see Import quick responses.
 */
export const startImportJob: (
  input: StartImportJobRequest,
) => Effect.Effect<
  StartImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportJobRequest,
  output: StartImportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves the quick response.
 */
export const getQuickResponse: (
  input: GetQuickResponseRequest,
) => Effect.Effect<
  GetQuickResponseResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQuickResponseRequest,
  output: GetQuickResponseResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * This API will be discontinued starting June 1, 2024. To receive generative responses after March 1, 2024, you will need to create a new Assistant in the Amazon Connect console and integrate the Amazon Q in Connect JavaScript library (amazon-q-connectjs) into your applications.
 *
 * Performs a manual search against the specified assistant. To retrieve recommendations for an assistant, use GetRecommendations.
 */
export const queryAssistant: {
  (
    input: QueryAssistantRequest,
  ): Effect.Effect<
    QueryAssistantResponse,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: QueryAssistantRequest,
  ) => Stream.Stream<
    QueryAssistantResponse,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: QueryAssistantRequest,
  ) => Stream.Stream<
    ResultData,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: QueryAssistantRequest,
  output: QueryAssistantResponse,
  errors: [
    AccessDeniedException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "results",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves content from knowledge sources based on a query.
 */
export const retrieve: (
  input: RetrieveRequest,
) => Effect.Effect<
  RetrieveResponse,
  | AccessDeniedException
  | ConflictException
  | DependencyFailedException
  | RequestTimeoutException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetrieveRequest,
  output: RetrieveResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DependencyFailedException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Q in Connect message template. The name of the message template has to be unique for each knowledge base. The channel subtype of the message template is immutable and cannot be modified after creation. After the message template is created, you can use the `$LATEST` qualifier to reference the created message template.
 */
export const createMessageTemplate: (
  input: CreateMessageTemplateRequest,
) => Effect.Effect<
  CreateMessageTemplateResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMessageTemplateRequest,
  output: CreateMessageTemplateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Searches existing Amazon Q in Connect quick responses in an Amazon Q in Connect knowledge base.
 */
export const searchQuickResponses: {
  (
    input: SearchQuickResponsesRequest,
  ): Effect.Effect<
    SearchQuickResponsesResponse,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchQuickResponsesRequest,
  ) => Stream.Stream<
    SearchQuickResponsesResponse,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchQuickResponsesRequest,
  ) => Stream.Stream<
    QuickResponseSearchResultData,
    | AccessDeniedException
    | RequestTimeoutException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchQuickResponsesRequest,
  output: SearchQuickResponsesResponse,
  errors: [
    AccessDeniedException,
    RequestTimeoutException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "results",
    pageSize: "maxResults",
  } as const,
}));
/**
 * This API will be discontinued starting June 1, 2024. To receive generative responses after March 1, 2024, you will need to create a new Assistant in the Amazon Connect console and integrate the Amazon Q in Connect JavaScript library (amazon-q-connectjs) into your applications.
 *
 * Retrieves recommendations for the specified session. To avoid retrieving the same recommendations in subsequent calls, use NotifyRecommendationsReceived. This API supports long-polling behavior with the `waitTimeSeconds` parameter. Short poll is the default behavior and only returns recommendations already available. To perform a manual query against an assistant, use QueryAssistant.
 */
export const getRecommendations: (
  input: GetRecommendationsRequest,
) => Effect.Effect<
  GetRecommendationsResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecommendationsRequest,
  output: GetRecommendationsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves AI agent execution traces for a session, providing granular visibility into agent orchestration flows, LLM interactions, and tool invocations.
 */
export const listSpans: {
  (
    input: ListSpansRequest,
  ): Effect.Effect<
    ListSpansResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSpansRequest,
  ) => Stream.Stream<
    ListSpansResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSpansRequest,
  ) => Stream.Stream<
    Span,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSpansRequest,
  output: ListSpansResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "spans",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Submits a message to the Amazon Q in Connect session.
 */
export const sendMessage: (
  input: SendMessageRequest,
) => Effect.Effect<
  SendMessageResponse,
  | AccessDeniedException
  | ConflictException
  | DependencyFailedException
  | RequestTimeoutException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendMessageRequest,
  output: SendMessageResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DependencyFailedException,
    RequestTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a knowledge base.
 *
 * When using this API, you cannot reuse Amazon AppIntegrations DataIntegrations with external knowledge bases such as Salesforce and ServiceNow. If you do, you'll get an `InvalidRequestException` error.
 *
 * For example, you're programmatically managing your external knowledge base, and you want to add or remove one of the fields that is being ingested from Salesforce. Do the following:
 *
 * - Call DeleteKnowledgeBase.
 *
 * - Call DeleteDataIntegration.
 *
 * - Call CreateDataIntegration to recreate the DataIntegration or a create different one.
 *
 * - Call CreateKnowledgeBase.
 */
export const createKnowledgeBase: (
  input: CreateKnowledgeBaseRequest,
) => Effect.Effect<
  CreateKnowledgeBaseResponse,
  | AccessDeniedException
  | ConflictException
  | ServiceQuotaExceededException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKnowledgeBaseRequest,
  output: CreateKnowledgeBaseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Q in Connect AI Agent.
 */
export const createAIAgent: (
  input: CreateAIAgentRequest,
) => Effect.Effect<
  CreateAIAgentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAIAgentRequest,
  output: CreateAIAgentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
