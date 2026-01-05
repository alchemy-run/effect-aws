import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "QConnect",
  serviceShapeName: "WisdomService",
});
const auth = T.AwsAuthSigv4({ name: "wisdom" });
const ver = T.ServiceVersion("2020-10-19");
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
                                url: "https://wisdom-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://wisdom-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://wisdom.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://wisdom.{Region}.{PartitionResult#dnsSuffix}",
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
export const RecommendationIdList = S.Array(S.String);
export const Channels = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export class GetAssistantRequest extends S.Class<GetAssistantRequest>(
  "GetAssistantRequest",
)(
  { assistantId: S.String.pipe(T.HttpLabel("assistantId")) },
  T.all(
    T.Http({ method: "GET", uri: "/assistants/{assistantId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssistantRequest extends S.Class<DeleteAssistantRequest>(
  "DeleteAssistantRequest",
)(
  { assistantId: S.String.pipe(T.HttpLabel("assistantId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/assistants/{assistantId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssistantResponse extends S.Class<DeleteAssistantResponse>(
  "DeleteAssistantResponse",
)({}) {}
export class ListAssistantsRequest extends S.Class<ListAssistantsRequest>(
  "ListAssistantsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assistants" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecommendationsRequest extends S.Class<GetRecommendationsRequest>(
  "GetRecommendationsRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    waitTimeSeconds: S.optional(S.Number).pipe(T.HttpQuery("waitTimeSeconds")),
    nextChunkToken: S.optional(S.String).pipe(T.HttpQuery("nextChunkToken")),
    recommendationType: S.optional(S.String).pipe(
      T.HttpQuery("recommendationType"),
    ),
  },
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
) {}
export class NotifyRecommendationsReceivedRequest extends S.Class<NotifyRecommendationsReceivedRequest>(
  "NotifyRecommendationsReceivedRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    recommendationIds: RecommendationIdList,
  },
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
) {}
export class RemoveAssistantAIAgentRequest extends S.Class<RemoveAssistantAIAgentRequest>(
  "RemoveAssistantAIAgentRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentType: S.String.pipe(T.HttpQuery("aiAgentType")),
    orchestratorUseCase: S.optional(S.String).pipe(
      T.HttpQuery("orchestratorUseCase"),
    ),
  },
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
) {}
export class RemoveAssistantAIAgentResponse extends S.Class<RemoveAssistantAIAgentResponse>(
  "RemoveAssistantAIAgentResponse",
)({}) {}
export class GetAIAgentRequest extends S.Class<GetAIAgentRequest>(
  "GetAIAgentRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
  },
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
) {}
export class TagCondition extends S.Class<TagCondition>("TagCondition")({
  key: S.String,
  value: S.optional(S.String),
}) {}
export const AndConditions = S.Array(TagCondition);
export const OrCondition = S.Union(
  S.Struct({ andConditions: AndConditions }),
  S.Struct({ tagCondition: TagCondition }),
);
export const OrConditions = S.Array(OrCondition);
export const TagFilter = S.Union(
  S.Struct({ tagCondition: TagCondition }),
  S.Struct({ andConditions: AndConditions }),
  S.Struct({ orConditions: OrConditions }),
);
export class KnowledgeBaseAssociationConfigurationData extends S.Class<KnowledgeBaseAssociationConfigurationData>(
  "KnowledgeBaseAssociationConfigurationData",
)({
  contentTagFilter: S.optional(TagFilter),
  maxResults: S.optional(S.Number),
  overrideKnowledgeBaseSearchType: S.optional(S.String),
}) {}
export const AssociationConfigurationData = S.Union(
  S.Struct({
    knowledgeBaseAssociationConfigurationData:
      KnowledgeBaseAssociationConfigurationData,
  }),
);
export class AssociationConfiguration extends S.Class<AssociationConfiguration>(
  "AssociationConfiguration",
)({
  associationId: S.optional(S.String),
  associationType: S.optional(S.String),
  associationConfigurationData: S.optional(AssociationConfigurationData),
}) {}
export const AssociationConfigurationList = S.Array(AssociationConfiguration);
export class ManualSearchAIAgentConfiguration extends S.Class<ManualSearchAIAgentConfiguration>(
  "ManualSearchAIAgentConfiguration",
)({
  answerGenerationAIPromptId: S.optional(S.String),
  answerGenerationAIGuardrailId: S.optional(S.String),
  associationConfigurations: S.optional(AssociationConfigurationList),
  locale: S.optional(S.String),
}) {}
export const SuggestedMessagesList = S.Array(S.String);
export class AnswerRecommendationAIAgentConfiguration extends S.Class<AnswerRecommendationAIAgentConfiguration>(
  "AnswerRecommendationAIAgentConfiguration",
)({
  intentLabelingGenerationAIPromptId: S.optional(S.String),
  queryReformulationAIPromptId: S.optional(S.String),
  answerGenerationAIPromptId: S.optional(S.String),
  answerGenerationAIGuardrailId: S.optional(S.String),
  associationConfigurations: S.optional(AssociationConfigurationList),
  locale: S.optional(S.String),
  suggestedMessages: S.optional(SuggestedMessagesList),
}) {}
export class SelfServiceAIAgentConfiguration extends S.Class<SelfServiceAIAgentConfiguration>(
  "SelfServiceAIAgentConfiguration",
)({
  selfServicePreProcessingAIPromptId: S.optional(S.String),
  selfServiceAnswerGenerationAIPromptId: S.optional(S.String),
  selfServiceAIGuardrailId: S.optional(S.String),
  associationConfigurations: S.optional(AssociationConfigurationList),
}) {}
export class EmailResponseAIAgentConfiguration extends S.Class<EmailResponseAIAgentConfiguration>(
  "EmailResponseAIAgentConfiguration",
)({
  emailResponseAIPromptId: S.optional(S.String),
  emailQueryReformulationAIPromptId: S.optional(S.String),
  locale: S.optional(S.String),
  associationConfigurations: S.optional(AssociationConfigurationList),
}) {}
export class EmailOverviewAIAgentConfiguration extends S.Class<EmailOverviewAIAgentConfiguration>(
  "EmailOverviewAIAgentConfiguration",
)({
  emailOverviewAIPromptId: S.optional(S.String),
  locale: S.optional(S.String),
}) {}
export class EmailGenerativeAnswerAIAgentConfiguration extends S.Class<EmailGenerativeAnswerAIAgentConfiguration>(
  "EmailGenerativeAnswerAIAgentConfiguration",
)({
  emailGenerativeAnswerAIPromptId: S.optional(S.String),
  emailQueryReformulationAIPromptId: S.optional(S.String),
  locale: S.optional(S.String),
  associationConfigurations: S.optional(AssociationConfigurationList),
}) {}
export const ToolExampleList = S.Array(S.String);
export class ToolInstruction extends S.Class<ToolInstruction>(
  "ToolInstruction",
)({
  instruction: S.optional(S.String),
  examples: S.optional(ToolExampleList),
}) {}
export class ToolOverrideConstantInputValue extends S.Class<ToolOverrideConstantInputValue>(
  "ToolOverrideConstantInputValue",
)({ type: S.String, value: S.String }) {}
export const ToolOverrideInputValueConfiguration = S.Union(
  S.Struct({ constant: ToolOverrideConstantInputValue }),
);
export class ToolOverrideInputValue extends S.Class<ToolOverrideInputValue>(
  "ToolOverrideInputValue",
)({ jsonPath: S.String, value: ToolOverrideInputValueConfiguration }) {}
export const ToolOverrideInputValueList = S.Array(ToolOverrideInputValue);
export class ToolOutputConfiguration extends S.Class<ToolOutputConfiguration>(
  "ToolOutputConfiguration",
)({
  outputVariableNameOverride: S.optional(S.String),
  sessionDataNamespace: S.optional(S.String),
}) {}
export class ToolOutputFilter extends S.Class<ToolOutputFilter>(
  "ToolOutputFilter",
)({
  jsonPath: S.String,
  outputConfiguration: S.optional(ToolOutputConfiguration),
}) {}
export const ToolOutputFilterList = S.Array(ToolOutputFilter);
export class Annotation extends S.Class<Annotation>("Annotation")({
  title: S.optional(S.String),
  destructiveHint: S.optional(S.Boolean),
}) {}
export class UserInteractionConfiguration extends S.Class<UserInteractionConfiguration>(
  "UserInteractionConfiguration",
)({ isUserConfirmationRequired: S.optional(S.Boolean) }) {}
export class ToolConfiguration extends S.Class<ToolConfiguration>(
  "ToolConfiguration",
)({
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
}) {}
export const ToolConfigurationList = S.Array(ToolConfiguration);
export class OrchestrationAIAgentConfiguration extends S.Class<OrchestrationAIAgentConfiguration>(
  "OrchestrationAIAgentConfiguration",
)({
  orchestrationAIPromptId: S.String,
  orchestrationAIGuardrailId: S.optional(S.String),
  toolConfigurations: S.optional(ToolConfigurationList),
  connectInstanceArn: S.optional(S.String),
  locale: S.optional(S.String),
}) {}
export class NoteTakingAIAgentConfiguration extends S.Class<NoteTakingAIAgentConfiguration>(
  "NoteTakingAIAgentConfiguration",
)({
  noteTakingAIPromptId: S.optional(S.String),
  noteTakingAIGuardrailId: S.optional(S.String),
  locale: S.optional(S.String),
}) {}
export class CaseSummarizationAIAgentConfiguration extends S.Class<CaseSummarizationAIAgentConfiguration>(
  "CaseSummarizationAIAgentConfiguration",
)({
  caseSummarizationAIPromptId: S.optional(S.String),
  caseSummarizationAIGuardrailId: S.optional(S.String),
  locale: S.optional(S.String),
}) {}
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
export class UpdateAIAgentRequest extends S.Class<UpdateAIAgentRequest>(
  "UpdateAIAgentRequest",
)(
  {
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
    visibilityStatus: S.String,
    configuration: S.optional(AIAgentConfiguration),
    description: S.optional(S.String),
  },
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
) {}
export class DeleteAIAgentRequest extends S.Class<DeleteAIAgentRequest>(
  "DeleteAIAgentRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
  },
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
) {}
export class DeleteAIAgentResponse extends S.Class<DeleteAIAgentResponse>(
  "DeleteAIAgentResponse",
)({}) {}
export class ListAIAgentsRequest extends S.Class<ListAIAgentsRequest>(
  "ListAIAgentsRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    origin: S.optional(S.String).pipe(T.HttpQuery("origin")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assistants/{assistantId}/aiagents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAIAgentVersionRequest extends S.Class<CreateAIAgentVersionRequest>(
  "CreateAIAgentVersionRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.optional(S.String),
  },
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
) {}
export class DeleteAIAgentVersionRequest extends S.Class<DeleteAIAgentVersionRequest>(
  "DeleteAIAgentVersionRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
    versionNumber: S.Number.pipe(T.HttpLabel("versionNumber")),
  },
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
) {}
export class DeleteAIAgentVersionResponse extends S.Class<DeleteAIAgentVersionResponse>(
  "DeleteAIAgentVersionResponse",
)({}) {}
export class ListAIAgentVersionsRequest extends S.Class<ListAIAgentVersionsRequest>(
  "ListAIAgentVersionsRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentId: S.String.pipe(T.HttpLabel("aiAgentId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    origin: S.optional(S.String).pipe(T.HttpQuery("origin")),
  },
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
) {}
export class GetAIGuardrailRequest extends S.Class<GetAIGuardrailRequest>(
  "GetAIGuardrailRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
  },
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
) {}
export const GuardrailTopicExamples = S.Array(S.String);
export class GuardrailTopicConfig extends S.Class<GuardrailTopicConfig>(
  "GuardrailTopicConfig",
)({
  name: S.String,
  definition: S.String,
  examples: S.optional(GuardrailTopicExamples),
  type: S.String,
}) {}
export const GuardrailTopicsConfig = S.Array(GuardrailTopicConfig);
export class AIGuardrailTopicPolicyConfig extends S.Class<AIGuardrailTopicPolicyConfig>(
  "AIGuardrailTopicPolicyConfig",
)({ topicsConfig: GuardrailTopicsConfig }) {}
export class GuardrailContentFilterConfig extends S.Class<GuardrailContentFilterConfig>(
  "GuardrailContentFilterConfig",
)({ type: S.String, inputStrength: S.String, outputStrength: S.String }) {}
export const GuardrailContentFiltersConfig = S.Array(
  GuardrailContentFilterConfig,
);
export class AIGuardrailContentPolicyConfig extends S.Class<AIGuardrailContentPolicyConfig>(
  "AIGuardrailContentPolicyConfig",
)({ filtersConfig: GuardrailContentFiltersConfig }) {}
export class GuardrailWordConfig extends S.Class<GuardrailWordConfig>(
  "GuardrailWordConfig",
)({ text: S.String }) {}
export const GuardrailWordsConfig = S.Array(GuardrailWordConfig);
export class GuardrailManagedWordsConfig extends S.Class<GuardrailManagedWordsConfig>(
  "GuardrailManagedWordsConfig",
)({ type: S.String }) {}
export const GuardrailManagedWordListsConfig = S.Array(
  GuardrailManagedWordsConfig,
);
export class AIGuardrailWordPolicyConfig extends S.Class<AIGuardrailWordPolicyConfig>(
  "AIGuardrailWordPolicyConfig",
)({
  wordsConfig: S.optional(GuardrailWordsConfig),
  managedWordListsConfig: S.optional(GuardrailManagedWordListsConfig),
}) {}
export class GuardrailPiiEntityConfig extends S.Class<GuardrailPiiEntityConfig>(
  "GuardrailPiiEntityConfig",
)({ type: S.String, action: S.String }) {}
export const GuardrailPiiEntitiesConfig = S.Array(GuardrailPiiEntityConfig);
export class GuardrailRegexConfig extends S.Class<GuardrailRegexConfig>(
  "GuardrailRegexConfig",
)({
  name: S.String,
  description: S.optional(S.String),
  pattern: S.String,
  action: S.String,
}) {}
export const GuardrailRegexesConfig = S.Array(GuardrailRegexConfig);
export class AIGuardrailSensitiveInformationPolicyConfig extends S.Class<AIGuardrailSensitiveInformationPolicyConfig>(
  "AIGuardrailSensitiveInformationPolicyConfig",
)({
  piiEntitiesConfig: S.optional(GuardrailPiiEntitiesConfig),
  regexesConfig: S.optional(GuardrailRegexesConfig),
}) {}
export class GuardrailContextualGroundingFilterConfig extends S.Class<GuardrailContextualGroundingFilterConfig>(
  "GuardrailContextualGroundingFilterConfig",
)({ type: S.String, threshold: S.Number }) {}
export const GuardrailContextualGroundingFiltersConfig = S.Array(
  GuardrailContextualGroundingFilterConfig,
);
export class AIGuardrailContextualGroundingPolicyConfig extends S.Class<AIGuardrailContextualGroundingPolicyConfig>(
  "AIGuardrailContextualGroundingPolicyConfig",
)({ filtersConfig: GuardrailContextualGroundingFiltersConfig }) {}
export class UpdateAIGuardrailRequest extends S.Class<UpdateAIGuardrailRequest>(
  "UpdateAIGuardrailRequest",
)(
  {
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
    visibilityStatus: S.String,
    blockedInputMessaging: S.String,
    blockedOutputsMessaging: S.String,
    description: S.optional(S.String),
    topicPolicyConfig: S.optional(AIGuardrailTopicPolicyConfig),
    contentPolicyConfig: S.optional(AIGuardrailContentPolicyConfig),
    wordPolicyConfig: S.optional(AIGuardrailWordPolicyConfig),
    sensitiveInformationPolicyConfig: S.optional(
      AIGuardrailSensitiveInformationPolicyConfig,
    ),
    contextualGroundingPolicyConfig: S.optional(
      AIGuardrailContextualGroundingPolicyConfig,
    ),
  },
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
) {}
export class DeleteAIGuardrailRequest extends S.Class<DeleteAIGuardrailRequest>(
  "DeleteAIGuardrailRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
  },
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
) {}
export class DeleteAIGuardrailResponse extends S.Class<DeleteAIGuardrailResponse>(
  "DeleteAIGuardrailResponse",
)({}) {}
export class ListAIGuardrailsRequest extends S.Class<ListAIGuardrailsRequest>(
  "ListAIGuardrailsRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assistants/{assistantId}/aiguardrails" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAIGuardrailVersionRequest extends S.Class<CreateAIGuardrailVersionRequest>(
  "CreateAIGuardrailVersionRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.optional(S.String),
  },
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
) {}
export class DeleteAIGuardrailVersionRequest extends S.Class<DeleteAIGuardrailVersionRequest>(
  "DeleteAIGuardrailVersionRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
    versionNumber: S.Number.pipe(T.HttpLabel("versionNumber")),
  },
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
) {}
export class DeleteAIGuardrailVersionResponse extends S.Class<DeleteAIGuardrailVersionResponse>(
  "DeleteAIGuardrailVersionResponse",
)({}) {}
export class ListAIGuardrailVersionsRequest extends S.Class<ListAIGuardrailVersionsRequest>(
  "ListAIGuardrailVersionsRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiGuardrailId: S.String.pipe(T.HttpLabel("aiGuardrailId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class GetAIPromptRequest extends S.Class<GetAIPromptRequest>(
  "GetAIPromptRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
  },
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
) {}
export class TextFullAIPromptEditTemplateConfiguration extends S.Class<TextFullAIPromptEditTemplateConfiguration>(
  "TextFullAIPromptEditTemplateConfiguration",
)({ text: S.String }) {}
export const AIPromptTemplateConfiguration = S.Union(
  S.Struct({
    textFullAIPromptEditTemplateConfiguration:
      TextFullAIPromptEditTemplateConfiguration,
  }),
);
export class TextAIPromptInferenceConfiguration extends S.Class<TextAIPromptInferenceConfiguration>(
  "TextAIPromptInferenceConfiguration",
)({
  temperature: S.optional(S.Number),
  topP: S.optional(S.Number),
  topK: S.optional(S.Number),
  maxTokensToSample: S.optional(S.Number),
}) {}
export const AIPromptInferenceConfiguration = S.Union(
  S.Struct({
    textAIPromptInferenceConfiguration: TextAIPromptInferenceConfiguration,
  }),
);
export class UpdateAIPromptRequest extends S.Class<UpdateAIPromptRequest>(
  "UpdateAIPromptRequest",
)(
  {
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
    visibilityStatus: S.String,
    templateConfiguration: S.optional(AIPromptTemplateConfiguration),
    description: S.optional(S.String),
    modelId: S.optional(S.String),
    inferenceConfiguration: S.optional(AIPromptInferenceConfiguration),
  },
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
) {}
export class DeleteAIPromptRequest extends S.Class<DeleteAIPromptRequest>(
  "DeleteAIPromptRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
  },
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
) {}
export class DeleteAIPromptResponse extends S.Class<DeleteAIPromptResponse>(
  "DeleteAIPromptResponse",
)({}) {}
export class ListAIPromptsRequest extends S.Class<ListAIPromptsRequest>(
  "ListAIPromptsRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    origin: S.optional(S.String).pipe(T.HttpQuery("origin")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assistants/{assistantId}/aiprompts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAIPromptVersionRequest extends S.Class<CreateAIPromptVersionRequest>(
  "CreateAIPromptVersionRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
    modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.optional(S.String),
  },
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
) {}
export class DeleteAIPromptVersionRequest extends S.Class<DeleteAIPromptVersionRequest>(
  "DeleteAIPromptVersionRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
    versionNumber: S.Number.pipe(T.HttpLabel("versionNumber")),
  },
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
) {}
export class DeleteAIPromptVersionResponse extends S.Class<DeleteAIPromptVersionResponse>(
  "DeleteAIPromptVersionResponse",
)({}) {}
export class ListAIPromptVersionsRequest extends S.Class<ListAIPromptVersionsRequest>(
  "ListAIPromptVersionsRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiPromptId: S.String.pipe(T.HttpLabel("aiPromptId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    origin: S.optional(S.String).pipe(T.HttpQuery("origin")),
  },
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
) {}
export class GetAssistantAssociationRequest extends S.Class<GetAssistantAssociationRequest>(
  "GetAssistantAssociationRequest",
)(
  {
    assistantAssociationId: S.String.pipe(
      T.HttpLabel("assistantAssociationId"),
    ),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  },
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
) {}
export class DeleteAssistantAssociationRequest extends S.Class<DeleteAssistantAssociationRequest>(
  "DeleteAssistantAssociationRequest",
)(
  {
    assistantAssociationId: S.String.pipe(
      T.HttpLabel("assistantAssociationId"),
    ),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  },
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
) {}
export class DeleteAssistantAssociationResponse extends S.Class<DeleteAssistantAssociationResponse>(
  "DeleteAssistantAssociationResponse",
)({}) {}
export class ListAssistantAssociationsRequest extends S.Class<ListAssistantAssociationsRequest>(
  "ListAssistantAssociationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assistants/{assistantId}/associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionRequest extends S.Class<GetSessionRequest>(
  "GetSessionRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  },
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
) {}
export class AIAgentConfigurationData extends S.Class<AIAgentConfigurationData>(
  "AIAgentConfigurationData",
)({ aiAgentId: S.String }) {}
export const AIAgentConfigurationMap = S.Record({
  key: S.String,
  value: AIAgentConfigurationData,
});
export class OrchestratorConfigurationEntry extends S.Class<OrchestratorConfigurationEntry>(
  "OrchestratorConfigurationEntry",
)({ aiAgentId: S.optional(S.String), orchestratorUseCase: S.String }) {}
export const OrchestratorConfigurationList = S.Array(
  OrchestratorConfigurationEntry,
);
export class UpdateSessionRequest extends S.Class<UpdateSessionRequest>(
  "UpdateSessionRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    description: S.optional(S.String),
    tagFilter: S.optional(TagFilter),
    aiAgentConfiguration: S.optional(AIAgentConfigurationMap),
    orchestratorConfigurationList: S.optional(OrchestratorConfigurationList),
    removeOrchestratorConfigurationList: S.optional(S.Boolean),
  },
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
) {}
export class GetNextMessageRequest extends S.Class<GetNextMessageRequest>(
  "GetNextMessageRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    nextMessageToken: S.String.pipe(T.HttpQuery("nextMessageToken")),
  },
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
) {}
export class ListMessagesRequest extends S.Class<ListMessagesRequest>(
  "ListMessagesRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    filter: S.optional(S.String).pipe(T.HttpQuery("filter")),
  },
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
) {}
export class ListSpansRequest extends S.Class<ListSpansRequest>(
  "ListSpansRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class GetKnowledgeBaseRequest extends S.Class<GetKnowledgeBaseRequest>(
  "GetKnowledgeBaseRequest",
)(
  { knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")) },
  T.all(
    T.Http({ method: "GET", uri: "/knowledgeBases/{knowledgeBaseId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKnowledgeBaseRequest extends S.Class<DeleteKnowledgeBaseRequest>(
  "DeleteKnowledgeBaseRequest",
)(
  { knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/knowledgeBases/{knowledgeBaseId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKnowledgeBaseResponse extends S.Class<DeleteKnowledgeBaseResponse>(
  "DeleteKnowledgeBaseResponse",
)({}) {}
export class ListKnowledgeBasesRequest extends S.Class<ListKnowledgeBasesRequest>(
  "ListKnowledgeBasesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/knowledgeBases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteImportJobRequest extends S.Class<DeleteImportJobRequest>(
  "DeleteImportJobRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    importJobId: S.String.pipe(T.HttpLabel("importJobId")),
  },
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
) {}
export class DeleteImportJobResponse extends S.Class<DeleteImportJobResponse>(
  "DeleteImportJobResponse",
)({}) {}
export class GetImportJobRequest extends S.Class<GetImportJobRequest>(
  "GetImportJobRequest",
)(
  {
    importJobId: S.String.pipe(T.HttpLabel("importJobId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class ListImportJobsRequest extends S.Class<ListImportJobsRequest>(
  "ListImportJobsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class RemoveKnowledgeBaseTemplateUriRequest extends S.Class<RemoveKnowledgeBaseTemplateUriRequest>(
  "RemoveKnowledgeBaseTemplateUriRequest",
)(
  { knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")) },
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
) {}
export class RemoveKnowledgeBaseTemplateUriResponse extends S.Class<RemoveKnowledgeBaseTemplateUriResponse>(
  "RemoveKnowledgeBaseTemplateUriResponse",
)({}) {}
export class Filter extends S.Class<Filter>("Filter")({
  field: S.String,
  operator: S.String,
  value: S.String,
}) {}
export const FilterList = S.Array(Filter);
export class SearchExpression extends S.Class<SearchExpression>(
  "SearchExpression",
)({ filters: FilterList }) {}
export class SearchContentRequest extends S.Class<SearchContentRequest>(
  "SearchContentRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    searchExpression: SearchExpression,
  },
  T.all(
    T.Http({ method: "POST", uri: "/knowledgeBases/{knowledgeBaseId}/search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartContentUploadRequest extends S.Class<StartContentUploadRequest>(
  "StartContentUploadRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentType: S.String,
    presignedUrlTimeToLive: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/knowledgeBases/{knowledgeBaseId}/upload" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateKnowledgeBaseTemplateUriRequest extends S.Class<UpdateKnowledgeBaseTemplateUriRequest>(
  "UpdateKnowledgeBaseTemplateUriRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    templateUri: S.String,
  },
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
) {}
export const ContentMetadata = S.Record({ key: S.String, value: S.String });
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateContentRequest extends S.Class<CreateContentRequest>(
  "CreateContentRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    name: S.String,
    title: S.optional(S.String),
    overrideLinkOutUri: S.optional(S.String),
    metadata: S.optional(ContentMetadata),
    uploadId: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
  },
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
) {}
export class GetContentRequest extends S.Class<GetContentRequest>(
  "GetContentRequest",
)(
  {
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class UpdateContentRequest extends S.Class<UpdateContentRequest>(
  "UpdateContentRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    revisionId: S.optional(S.String),
    title: S.optional(S.String),
    overrideLinkOutUri: S.optional(S.String),
    removeOverrideLinkOutUri: S.optional(S.Boolean),
    metadata: S.optional(ContentMetadata),
    uploadId: S.optional(S.String),
  },
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
) {}
export class DeleteContentRequest extends S.Class<DeleteContentRequest>(
  "DeleteContentRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
  },
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
) {}
export class DeleteContentResponse extends S.Class<DeleteContentResponse>(
  "DeleteContentResponse",
)({}) {}
export class ListContentsRequest extends S.Class<ListContentsRequest>(
  "ListContentsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class GetContentSummaryRequest extends S.Class<GetContentSummaryRequest>(
  "GetContentSummaryRequest",
)(
  {
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class GetContentAssociationRequest extends S.Class<GetContentAssociationRequest>(
  "GetContentAssociationRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    contentAssociationId: S.String.pipe(T.HttpLabel("contentAssociationId")),
  },
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
) {}
export class DeleteContentAssociationRequest extends S.Class<DeleteContentAssociationRequest>(
  "DeleteContentAssociationRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    contentAssociationId: S.String.pipe(T.HttpLabel("contentAssociationId")),
  },
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
) {}
export class DeleteContentAssociationResponse extends S.Class<DeleteContentAssociationResponse>(
  "DeleteContentAssociationResponse",
)({}) {}
export class ListContentAssociationsRequest extends S.Class<ListContentAssociationsRequest>(
  "ListContentAssociationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
  },
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
) {}
export class GetMessageTemplateRequest extends S.Class<GetMessageTemplateRequest>(
  "GetMessageTemplateRequest",
)(
  {
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export const MessageTemplateBodyContentProvider = S.Union(
  S.Struct({ content: S.String }),
);
export class EmailMessageTemplateContentBody extends S.Class<EmailMessageTemplateContentBody>(
  "EmailMessageTemplateContentBody",
)({
  plainText: S.optional(MessageTemplateBodyContentProvider),
  html: S.optional(MessageTemplateBodyContentProvider),
}) {}
export class EmailHeader extends S.Class<EmailHeader>("EmailHeader")({
  name: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const EmailHeaders = S.Array(EmailHeader);
export class EmailMessageTemplateContent extends S.Class<EmailMessageTemplateContent>(
  "EmailMessageTemplateContent",
)({
  subject: S.optional(S.String),
  body: S.optional(EmailMessageTemplateContentBody),
  headers: S.optional(EmailHeaders),
}) {}
export class SMSMessageTemplateContentBody extends S.Class<SMSMessageTemplateContentBody>(
  "SMSMessageTemplateContentBody",
)({ plainText: S.optional(MessageTemplateBodyContentProvider) }) {}
export class SMSMessageTemplateContent extends S.Class<SMSMessageTemplateContent>(
  "SMSMessageTemplateContent",
)({ body: S.optional(SMSMessageTemplateContentBody) }) {}
export class WhatsAppMessageTemplateContent extends S.Class<WhatsAppMessageTemplateContent>(
  "WhatsAppMessageTemplateContent",
)({ data: S.optional(S.String) }) {}
export class PushADMMessageTemplateContent extends S.Class<PushADMMessageTemplateContent>(
  "PushADMMessageTemplateContent",
)({
  title: S.optional(S.String),
  body: S.optional(MessageTemplateBodyContentProvider),
  action: S.optional(S.String),
  sound: S.optional(S.String),
  url: S.optional(S.String),
  imageUrl: S.optional(S.String),
  imageIconUrl: S.optional(S.String),
  smallImageIconUrl: S.optional(S.String),
  rawContent: S.optional(MessageTemplateBodyContentProvider),
}) {}
export class PushAPNSMessageTemplateContent extends S.Class<PushAPNSMessageTemplateContent>(
  "PushAPNSMessageTemplateContent",
)({
  title: S.optional(S.String),
  body: S.optional(MessageTemplateBodyContentProvider),
  action: S.optional(S.String),
  sound: S.optional(S.String),
  url: S.optional(S.String),
  mediaUrl: S.optional(S.String),
  rawContent: S.optional(MessageTemplateBodyContentProvider),
}) {}
export class PushFCMMessageTemplateContent extends S.Class<PushFCMMessageTemplateContent>(
  "PushFCMMessageTemplateContent",
)({
  title: S.optional(S.String),
  body: S.optional(MessageTemplateBodyContentProvider),
  action: S.optional(S.String),
  sound: S.optional(S.String),
  url: S.optional(S.String),
  imageUrl: S.optional(S.String),
  imageIconUrl: S.optional(S.String),
  smallImageIconUrl: S.optional(S.String),
  rawContent: S.optional(MessageTemplateBodyContentProvider),
}) {}
export class PushBaiduMessageTemplateContent extends S.Class<PushBaiduMessageTemplateContent>(
  "PushBaiduMessageTemplateContent",
)({
  title: S.optional(S.String),
  body: S.optional(MessageTemplateBodyContentProvider),
  action: S.optional(S.String),
  sound: S.optional(S.String),
  url: S.optional(S.String),
  imageUrl: S.optional(S.String),
  imageIconUrl: S.optional(S.String),
  smallImageIconUrl: S.optional(S.String),
  rawContent: S.optional(MessageTemplateBodyContentProvider),
}) {}
export class PushMessageTemplateContent extends S.Class<PushMessageTemplateContent>(
  "PushMessageTemplateContent",
)({
  adm: S.optional(PushADMMessageTemplateContent),
  apns: S.optional(PushAPNSMessageTemplateContent),
  fcm: S.optional(PushFCMMessageTemplateContent),
  baidu: S.optional(PushBaiduMessageTemplateContent),
}) {}
export const MessageTemplateContentProvider = S.Union(
  S.Struct({ email: EmailMessageTemplateContent }),
  S.Struct({ sms: SMSMessageTemplateContent }),
  S.Struct({ whatsApp: WhatsAppMessageTemplateContent }),
  S.Struct({ push: PushMessageTemplateContent }),
);
export const WhatsAppMessageTemplateComponents = S.Array(S.String);
export class WhatsAppMessageTemplateSourceConfiguration extends S.Class<WhatsAppMessageTemplateSourceConfiguration>(
  "WhatsAppMessageTemplateSourceConfiguration",
)({
  businessAccountId: S.String,
  templateId: S.String,
  components: S.optional(WhatsAppMessageTemplateComponents),
}) {}
export const MessageTemplateSourceConfiguration = S.Union(
  S.Struct({ whatsApp: WhatsAppMessageTemplateSourceConfiguration }),
);
export class SystemEndpointAttributes extends S.Class<SystemEndpointAttributes>(
  "SystemEndpointAttributes",
)({ address: S.optional(S.String) }) {}
export class SystemAttributes extends S.Class<SystemAttributes>(
  "SystemAttributes",
)({
  name: S.optional(S.String),
  customerEndpoint: S.optional(SystemEndpointAttributes),
  systemEndpoint: S.optional(SystemEndpointAttributes),
}) {}
export class AgentAttributes extends S.Class<AgentAttributes>(
  "AgentAttributes",
)({ firstName: S.optional(S.String), lastName: S.optional(S.String) }) {}
export const CustomAttributes = S.Record({ key: S.String, value: S.String });
export class CustomerProfileAttributes extends S.Class<CustomerProfileAttributes>(
  "CustomerProfileAttributes",
)({
  profileId: S.optional(S.String),
  profileARN: S.optional(S.String),
  firstName: S.optional(S.String),
  middleName: S.optional(S.String),
  lastName: S.optional(S.String),
  accountNumber: S.optional(S.String),
  emailAddress: S.optional(S.String),
  phoneNumber: S.optional(S.String),
  additionalInformation: S.optional(S.String),
  partyType: S.optional(S.String),
  businessName: S.optional(S.String),
  birthDate: S.optional(S.String),
  gender: S.optional(S.String),
  mobilePhoneNumber: S.optional(S.String),
  homePhoneNumber: S.optional(S.String),
  businessPhoneNumber: S.optional(S.String),
  businessEmailAddress: S.optional(S.String),
  address1: S.optional(S.String),
  address2: S.optional(S.String),
  address3: S.optional(S.String),
  address4: S.optional(S.String),
  city: S.optional(S.String),
  county: S.optional(S.String),
  country: S.optional(S.String),
  postalCode: S.optional(S.String),
  province: S.optional(S.String),
  state: S.optional(S.String),
  shippingAddress1: S.optional(S.String),
  shippingAddress2: S.optional(S.String),
  shippingAddress3: S.optional(S.String),
  shippingAddress4: S.optional(S.String),
  shippingCity: S.optional(S.String),
  shippingCounty: S.optional(S.String),
  shippingCountry: S.optional(S.String),
  shippingPostalCode: S.optional(S.String),
  shippingProvince: S.optional(S.String),
  shippingState: S.optional(S.String),
  mailingAddress1: S.optional(S.String),
  mailingAddress2: S.optional(S.String),
  mailingAddress3: S.optional(S.String),
  mailingAddress4: S.optional(S.String),
  mailingCity: S.optional(S.String),
  mailingCounty: S.optional(S.String),
  mailingCountry: S.optional(S.String),
  mailingPostalCode: S.optional(S.String),
  mailingProvince: S.optional(S.String),
  mailingState: S.optional(S.String),
  billingAddress1: S.optional(S.String),
  billingAddress2: S.optional(S.String),
  billingAddress3: S.optional(S.String),
  billingAddress4: S.optional(S.String),
  billingCity: S.optional(S.String),
  billingCounty: S.optional(S.String),
  billingCountry: S.optional(S.String),
  billingPostalCode: S.optional(S.String),
  billingProvince: S.optional(S.String),
  billingState: S.optional(S.String),
  custom: S.optional(CustomAttributes),
}) {}
export class MessageTemplateAttributes extends S.Class<MessageTemplateAttributes>(
  "MessageTemplateAttributes",
)({
  systemAttributes: S.optional(SystemAttributes),
  agentAttributes: S.optional(AgentAttributes),
  customerProfileAttributes: S.optional(CustomerProfileAttributes),
  customAttributes: S.optional(CustomAttributes),
}) {}
export class UpdateMessageTemplateRequest extends S.Class<UpdateMessageTemplateRequest>(
  "UpdateMessageTemplateRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    content: S.optional(MessageTemplateContentProvider),
    language: S.optional(S.String),
    sourceConfiguration: S.optional(MessageTemplateSourceConfiguration),
    defaultAttributes: S.optional(MessageTemplateAttributes),
  },
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
) {}
export class DeleteMessageTemplateRequest extends S.Class<DeleteMessageTemplateRequest>(
  "DeleteMessageTemplateRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
  },
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
) {}
export class DeleteMessageTemplateResponse extends S.Class<DeleteMessageTemplateResponse>(
  "DeleteMessageTemplateResponse",
)({}) {}
export class ListMessageTemplatesRequest extends S.Class<ListMessageTemplatesRequest>(
  "ListMessageTemplatesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class ActivateMessageTemplateRequest extends S.Class<ActivateMessageTemplateRequest>(
  "ActivateMessageTemplateRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    versionNumber: S.Number,
  },
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
) {}
export class CreateMessageTemplateAttachmentRequest extends S.Class<CreateMessageTemplateAttachmentRequest>(
  "CreateMessageTemplateAttachmentRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    contentDisposition: S.String,
    name: S.String,
    body: S.String,
    clientToken: S.optional(S.String),
  },
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
) {}
export class CreateMessageTemplateVersionRequest extends S.Class<CreateMessageTemplateVersionRequest>(
  "CreateMessageTemplateVersionRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    messageTemplateContentSha256: S.optional(S.String),
  },
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
) {}
export class DeactivateMessageTemplateRequest extends S.Class<DeactivateMessageTemplateRequest>(
  "DeactivateMessageTemplateRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    versionNumber: S.Number,
  },
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
) {}
export class DeleteMessageTemplateAttachmentRequest extends S.Class<DeleteMessageTemplateAttachmentRequest>(
  "DeleteMessageTemplateAttachmentRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    attachmentId: S.String.pipe(T.HttpLabel("attachmentId")),
  },
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
) {}
export class DeleteMessageTemplateAttachmentResponse extends S.Class<DeleteMessageTemplateAttachmentResponse>(
  "DeleteMessageTemplateAttachmentResponse",
)({}) {}
export class ListMessageTemplateVersionsRequest extends S.Class<ListMessageTemplateVersionsRequest>(
  "ListMessageTemplateVersionsRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class RenderMessageTemplateRequest extends S.Class<RenderMessageTemplateRequest>(
  "RenderMessageTemplateRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    attributes: MessageTemplateAttributes,
  },
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
) {}
export const GroupingValues = S.Array(S.String);
export class GroupingConfiguration extends S.Class<GroupingConfiguration>(
  "GroupingConfiguration",
)({ criteria: S.optional(S.String), values: S.optional(GroupingValues) }) {}
export class UpdateMessageTemplateMetadataRequest extends S.Class<UpdateMessageTemplateMetadataRequest>(
  "UpdateMessageTemplateMetadataRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    messageTemplateId: S.String.pipe(T.HttpLabel("messageTemplateId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    groupingConfiguration: S.optional(GroupingConfiguration),
  },
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
) {}
export class GetQuickResponseRequest extends S.Class<GetQuickResponseRequest>(
  "GetQuickResponseRequest",
)(
  {
    quickResponseId: S.String.pipe(T.HttpLabel("quickResponseId")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export const QuickResponseDataProvider = S.Union(
  S.Struct({ content: S.String }),
);
export class UpdateQuickResponseRequest extends S.Class<UpdateQuickResponseRequest>(
  "UpdateQuickResponseRequest",
)(
  {
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
  },
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
) {}
export class DeleteQuickResponseRequest extends S.Class<DeleteQuickResponseRequest>(
  "DeleteQuickResponseRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    quickResponseId: S.String.pipe(T.HttpLabel("quickResponseId")),
  },
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
) {}
export class DeleteQuickResponseResponse extends S.Class<DeleteQuickResponseResponse>(
  "DeleteQuickResponseResponse",
)({}) {}
export class ListQuickResponsesRequest extends S.Class<ListQuickResponsesRequest>(
  "ListQuickResponsesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class ServerSideEncryptionConfiguration extends S.Class<ServerSideEncryptionConfiguration>(
  "ServerSideEncryptionConfiguration",
)({ kmsKeyId: S.optional(S.String) }) {}
export class CitationSpan extends S.Class<CitationSpan>("CitationSpan")({
  beginOffsetInclusive: S.optional(S.Number),
  endOffsetExclusive: S.optional(S.Number),
}) {}
export class Citation extends S.Class<Citation>("Citation")({
  contentId: S.optional(S.String),
  title: S.optional(S.String),
  knowledgeBaseId: S.optional(S.String),
  citationSpan: CitationSpan,
  sourceURL: S.optional(S.String),
  referenceType: S.String,
}) {}
export const Citations = S.Array(Citation);
export class AIGuardrailAssessment extends S.Class<AIGuardrailAssessment>(
  "AIGuardrailAssessment",
)({ blocked: S.Boolean }) {}
export class TextMessage extends S.Class<TextMessage>("TextMessage")({
  value: S.optional(S.String),
  citations: S.optional(Citations),
  aiGuardrailAssessment: S.optional(AIGuardrailAssessment),
}) {}
export class ToolUseResultData extends S.Class<ToolUseResultData>(
  "ToolUseResultData",
)({
  toolUseId: S.String,
  toolName: S.String,
  toolResult: S.Any,
  inputSchema: S.optional(S.Any),
}) {}
export const MessageData = S.Union(
  S.Struct({ text: TextMessage }),
  S.Struct({ toolUseResult: ToolUseResultData }),
);
export class MessageOutput extends S.Class<MessageOutput>("MessageOutput")({
  value: MessageData,
  messageId: S.String,
  participant: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const MessageList = S.Array(MessageOutput);
export class MessageConfiguration extends S.Class<MessageConfiguration>(
  "MessageConfiguration",
)({
  generateFillerMessage: S.optional(S.Boolean),
  generateChunkedMessage: S.optional(S.Boolean),
}) {}
export const MessageMetadata = S.Record({ key: S.String, value: S.String });
export class RenderingConfiguration extends S.Class<RenderingConfiguration>(
  "RenderingConfiguration",
)({ templateUri: S.optional(S.String) }) {}
export const ContactAttributes = S.Record({ key: S.String, value: S.String });
export const MessageTemplateAttributeKeyList = S.Array(S.String);
export class MessageTemplateAttachment extends S.Class<MessageTemplateAttachment>(
  "MessageTemplateAttachment",
)({
  contentDisposition: S.String,
  name: S.String,
  uploadedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  url: S.String,
  urlExpiry: S.Date.pipe(T.TimestampFormat("date-time")),
  attachmentId: S.String,
}) {}
export const MessageTemplateAttachmentList = S.Array(MessageTemplateAttachment);
export const AssistantAssociationIdList = S.Array(S.String);
export type RetrievalFilterList = RetrievalFilterConfiguration[];
export const RetrievalFilterList = S.Array(
  S.suspend(() => RetrievalFilterConfiguration),
) as any as S.Schema<RetrievalFilterList>;
export const ObjectFieldsList = S.Array(S.String);
export const MessageTemplateQueryValueList = S.Array(S.String);
export const MessageTemplateFilterValueList = S.Array(S.String);
export const QuickResponseQueryValueList = S.Array(S.String);
export const QuickResponseFilterValueList = S.Array(S.String);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export class CreateAssistantRequest extends S.Class<CreateAssistantRequest>(
  "CreateAssistantRequest",
)(
  {
    clientToken: S.optional(S.String),
    name: S.String,
    type: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAssistantAIAgentRequest extends S.Class<UpdateAssistantAIAgentRequest>(
  "UpdateAssistantAIAgentRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    aiAgentType: S.String,
    configuration: AIAgentConfigurationData,
    orchestratorConfigurationList: S.optional(OrchestratorConfigurationList),
  },
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
) {}
export class AIAgentData extends S.Class<AIAgentData>("AIAgentData")({
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
}) {}
export class UpdateAIAgentResponse extends S.Class<UpdateAIAgentResponse>(
  "UpdateAIAgentResponse",
)({ aiAgent: S.optional(AIAgentData) }) {}
export class CreateAIAgentVersionResponse extends S.Class<CreateAIAgentVersionResponse>(
  "CreateAIAgentVersionResponse",
)({ aiAgent: S.optional(AIAgentData), versionNumber: S.optional(S.Number) }) {}
export class AIGuardrailData extends S.Class<AIGuardrailData>(
  "AIGuardrailData",
)({
  assistantId: S.String,
  assistantArn: S.String,
  aiGuardrailArn: S.String,
  aiGuardrailId: S.String,
  name: S.String,
  visibilityStatus: S.String,
  blockedInputMessaging: S.String,
  blockedOutputsMessaging: S.String,
  description: S.optional(S.String),
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
}) {}
export class UpdateAIGuardrailResponse extends S.Class<UpdateAIGuardrailResponse>(
  "UpdateAIGuardrailResponse",
)({ aiGuardrail: S.optional(AIGuardrailData) }) {}
export class CreateAIGuardrailVersionResponse extends S.Class<CreateAIGuardrailVersionResponse>(
  "CreateAIGuardrailVersionResponse",
)({
  aiGuardrail: S.optional(AIGuardrailData),
  versionNumber: S.optional(S.Number),
}) {}
export class AIPromptData extends S.Class<AIPromptData>("AIPromptData")({
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
}) {}
export class UpdateAIPromptResponse extends S.Class<UpdateAIPromptResponse>(
  "UpdateAIPromptResponse",
)({ aiPrompt: S.optional(AIPromptData) }) {}
export class CreateAIPromptVersionResponse extends S.Class<CreateAIPromptVersionResponse>(
  "CreateAIPromptVersionResponse",
)({
  aiPrompt: S.optional(AIPromptData),
  versionNumber: S.optional(S.Number),
}) {}
export class SessionIntegrationConfiguration extends S.Class<SessionIntegrationConfiguration>(
  "SessionIntegrationConfiguration",
)({ topicIntegrationArn: S.optional(S.String) }) {}
export class SessionData extends S.Class<SessionData>("SessionData")({
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
}) {}
export class UpdateSessionResponse extends S.Class<UpdateSessionResponse>(
  "UpdateSessionResponse",
)({ session: S.optional(SessionData) }) {}
export class ListMessagesResponse extends S.Class<ListMessagesResponse>(
  "ListMessagesResponse",
)({ messages: MessageList, nextToken: S.optional(S.String) }) {}
export class FixedSizeChunkingConfiguration extends S.Class<FixedSizeChunkingConfiguration>(
  "FixedSizeChunkingConfiguration",
)({ maxTokens: S.Number, overlapPercentage: S.Number }) {}
export class HierarchicalChunkingLevelConfiguration extends S.Class<HierarchicalChunkingLevelConfiguration>(
  "HierarchicalChunkingLevelConfiguration",
)({ maxTokens: S.Number }) {}
export const HierarchicalChunkingLevelConfigurations = S.Array(
  HierarchicalChunkingLevelConfiguration,
);
export class HierarchicalChunkingConfiguration extends S.Class<HierarchicalChunkingConfiguration>(
  "HierarchicalChunkingConfiguration",
)({
  levelConfigurations: HierarchicalChunkingLevelConfigurations,
  overlapTokens: S.Number,
}) {}
export class SemanticChunkingConfiguration extends S.Class<SemanticChunkingConfiguration>(
  "SemanticChunkingConfiguration",
)({
  maxTokens: S.Number,
  bufferSize: S.Number,
  breakpointPercentileThreshold: S.Number,
}) {}
export class ChunkingConfiguration extends S.Class<ChunkingConfiguration>(
  "ChunkingConfiguration",
)({
  chunkingStrategy: S.String,
  fixedSizeChunkingConfiguration: S.optional(FixedSizeChunkingConfiguration),
  hierarchicalChunkingConfiguration: S.optional(
    HierarchicalChunkingConfiguration,
  ),
  semanticChunkingConfiguration: S.optional(SemanticChunkingConfiguration),
}) {}
export class ParsingPrompt extends S.Class<ParsingPrompt>("ParsingPrompt")({
  parsingPromptText: S.String,
}) {}
export class BedrockFoundationModelConfigurationForParsing extends S.Class<BedrockFoundationModelConfigurationForParsing>(
  "BedrockFoundationModelConfigurationForParsing",
)({ modelArn: S.String, parsingPrompt: S.optional(ParsingPrompt) }) {}
export class ParsingConfiguration extends S.Class<ParsingConfiguration>(
  "ParsingConfiguration",
)({
  parsingStrategy: S.String,
  bedrockFoundationModelConfiguration: S.optional(
    BedrockFoundationModelConfigurationForParsing,
  ),
}) {}
export class VectorIngestionConfiguration extends S.Class<VectorIngestionConfiguration>(
  "VectorIngestionConfiguration",
)({
  chunkingConfiguration: S.optional(ChunkingConfiguration),
  parsingConfiguration: S.optional(ParsingConfiguration),
}) {}
export class AppIntegrationsConfiguration extends S.Class<AppIntegrationsConfiguration>(
  "AppIntegrationsConfiguration",
)({
  appIntegrationArn: S.String,
  objectFields: S.optional(ObjectFieldsList),
}) {}
export class SeedUrl extends S.Class<SeedUrl>("SeedUrl")({
  url: S.optional(S.String),
}) {}
export const SeedUrls = S.Array(SeedUrl);
export class UrlConfiguration extends S.Class<UrlConfiguration>(
  "UrlConfiguration",
)({ seedUrls: S.optional(SeedUrls) }) {}
export class WebCrawlerLimits extends S.Class<WebCrawlerLimits>(
  "WebCrawlerLimits",
)({ rateLimit: S.optional(S.Number) }) {}
export const UrlFilterList = S.Array(S.String);
export class WebCrawlerConfiguration extends S.Class<WebCrawlerConfiguration>(
  "WebCrawlerConfiguration",
)({
  urlConfiguration: UrlConfiguration,
  crawlerLimits: S.optional(WebCrawlerLimits),
  inclusionFilters: S.optional(UrlFilterList),
  exclusionFilters: S.optional(UrlFilterList),
  scope: S.optional(S.String),
}) {}
export const ManagedSourceConfiguration = S.Union(
  S.Struct({ webCrawlerConfiguration: WebCrawlerConfiguration }),
);
export const SourceConfiguration = S.Union(
  S.Struct({ appIntegrations: AppIntegrationsConfiguration }),
  S.Struct({ managedSourceConfiguration: ManagedSourceConfiguration }),
);
export const FailureReason = S.Array(S.String);
export class KnowledgeBaseData extends S.Class<KnowledgeBaseData>(
  "KnowledgeBaseData",
)({
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
}) {}
export class UpdateKnowledgeBaseTemplateUriResponse extends S.Class<UpdateKnowledgeBaseTemplateUriResponse>(
  "UpdateKnowledgeBaseTemplateUriResponse",
)({ knowledgeBase: S.optional(KnowledgeBaseData) }) {}
export class ContentData extends S.Class<ContentData>("ContentData")({
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
  url: S.String,
  urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class GetContentResponse extends S.Class<GetContentResponse>(
  "GetContentResponse",
)({ content: S.optional(ContentData) }) {}
export class UpdateContentResponse extends S.Class<UpdateContentResponse>(
  "UpdateContentResponse",
)({ content: S.optional(ContentData) }) {}
export class ContentSummary extends S.Class<ContentSummary>("ContentSummary")({
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
}) {}
export const ContentSummaryList = S.Array(ContentSummary);
export class ListContentsResponse extends S.Class<ListContentsResponse>(
  "ListContentsResponse",
)({ contentSummaries: ContentSummaryList, nextToken: S.optional(S.String) }) {}
export class GetContentSummaryResponse extends S.Class<GetContentSummaryResponse>(
  "GetContentSummaryResponse",
)({ contentSummary: S.optional(ContentSummary) }) {}
export class ActivateMessageTemplateResponse extends S.Class<ActivateMessageTemplateResponse>(
  "ActivateMessageTemplateResponse",
)({
  messageTemplateArn: S.String,
  messageTemplateId: S.String,
  versionNumber: S.Number,
}) {}
export class WhatsAppMessageTemplateSourceConfigurationSummary extends S.Class<WhatsAppMessageTemplateSourceConfigurationSummary>(
  "WhatsAppMessageTemplateSourceConfigurationSummary",
)({
  businessAccountId: S.String,
  templateId: S.String,
  name: S.optional(S.String),
  language: S.optional(S.String),
  components: S.optional(WhatsAppMessageTemplateComponents),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
}) {}
export const MessageTemplateSourceConfigurationSummary = S.Union(
  S.Struct({ whatsApp: WhatsAppMessageTemplateSourceConfigurationSummary }),
);
export const MessageTemplateAttributeTypeList = S.Array(S.String);
export class ExtendedMessageTemplateData extends S.Class<ExtendedMessageTemplateData>(
  "ExtendedMessageTemplateData",
)({
  messageTemplateArn: S.String,
  messageTemplateId: S.String,
  knowledgeBaseArn: S.String,
  knowledgeBaseId: S.String,
  name: S.String,
  channel: S.optional(S.String),
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
}) {}
export class CreateMessageTemplateVersionResponse extends S.Class<CreateMessageTemplateVersionResponse>(
  "CreateMessageTemplateVersionResponse",
)({ messageTemplate: S.optional(ExtendedMessageTemplateData) }) {}
export class DeactivateMessageTemplateResponse extends S.Class<DeactivateMessageTemplateResponse>(
  "DeactivateMessageTemplateResponse",
)({
  messageTemplateArn: S.String,
  messageTemplateId: S.String,
  versionNumber: S.Number,
}) {}
export class MessageTemplateData extends S.Class<MessageTemplateData>(
  "MessageTemplateData",
)({
  messageTemplateArn: S.String,
  messageTemplateId: S.String,
  knowledgeBaseArn: S.String,
  knowledgeBaseId: S.String,
  name: S.String,
  channel: S.optional(S.String),
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
}) {}
export class UpdateMessageTemplateMetadataResponse extends S.Class<UpdateMessageTemplateMetadataResponse>(
  "UpdateMessageTemplateMetadataResponse",
)({ messageTemplate: S.optional(MessageTemplateData) }) {}
export class CreateQuickResponseRequest extends S.Class<CreateQuickResponseRequest>(
  "CreateQuickResponseRequest",
)(
  {
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
  },
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
) {}
export const QuickResponseContentProvider = S.Union(
  S.Struct({ content: S.String }),
);
export class QuickResponseContents extends S.Class<QuickResponseContents>(
  "QuickResponseContents",
)({
  plainText: S.optional(QuickResponseContentProvider),
  markdown: S.optional(QuickResponseContentProvider),
}) {}
export class QuickResponseData extends S.Class<QuickResponseData>(
  "QuickResponseData",
)({
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
}) {}
export class UpdateQuickResponseResponse extends S.Class<UpdateQuickResponseResponse>(
  "UpdateQuickResponseResponse",
)({ quickResponse: S.optional(QuickResponseData) }) {}
export class GenerativeContentFeedbackData extends S.Class<GenerativeContentFeedbackData>(
  "GenerativeContentFeedbackData",
)({ relevance: S.String }) {}
export class QueryConditionItem extends S.Class<QueryConditionItem>(
  "QueryConditionItem",
)({ field: S.String, comparator: S.String, value: S.String }) {}
export class QueryTextInputData extends S.Class<QueryTextInputData>(
  "QueryTextInputData",
)({ text: S.String }) {}
export class IntentInputData extends S.Class<IntentInputData>(
  "IntentInputData",
)({ intentId: S.String }) {}
export class CaseSummarizationInputData extends S.Class<CaseSummarizationInputData>(
  "CaseSummarizationInputData",
)({ caseArn: S.String }) {}
export const KnowledgeSource = S.Union(
  S.Struct({ assistantAssociationIds: AssistantAssociationIdList }),
);
export class ExternalBedrockKnowledgeBaseConfig extends S.Class<ExternalBedrockKnowledgeBaseConfig>(
  "ExternalBedrockKnowledgeBaseConfig",
)({ bedrockKnowledgeBaseArn: S.String, accessRoleArn: S.String }) {}
export class SelfServiceConversationHistory extends S.Class<SelfServiceConversationHistory>(
  "SelfServiceConversationHistory",
)({
  turnNumber: S.optional(S.Number),
  inputTranscript: S.optional(S.String),
  botResponse: S.optional(S.String),
  timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const SelfServiceConversationHistoryList = S.Array(
  SelfServiceConversationHistory,
);
export const RuntimeSessionDataValue = S.Union(
  S.Struct({ stringValue: S.String }),
);
export class MessageTemplateQueryField extends S.Class<MessageTemplateQueryField>(
  "MessageTemplateQueryField",
)({
  name: S.String,
  values: MessageTemplateQueryValueList,
  operator: S.String,
  allowFuzziness: S.optional(S.Boolean),
  priority: S.optional(S.String),
}) {}
export const MessageTemplateQueryFieldList = S.Array(MessageTemplateQueryField);
export class MessageTemplateFilterField extends S.Class<MessageTemplateFilterField>(
  "MessageTemplateFilterField",
)({
  name: S.String,
  values: S.optional(MessageTemplateFilterValueList),
  operator: S.String,
  includeNoExistence: S.optional(S.Boolean),
}) {}
export const MessageTemplateFilterFieldList = S.Array(
  MessageTemplateFilterField,
);
export class MessageTemplateOrderField extends S.Class<MessageTemplateOrderField>(
  "MessageTemplateOrderField",
)({ name: S.String, order: S.optional(S.String) }) {}
export class QuickResponseQueryField extends S.Class<QuickResponseQueryField>(
  "QuickResponseQueryField",
)({
  name: S.String,
  values: QuickResponseQueryValueList,
  operator: S.String,
  allowFuzziness: S.optional(S.Boolean),
  priority: S.optional(S.String),
}) {}
export const QuickResponseQueryFieldList = S.Array(QuickResponseQueryField);
export class QuickResponseFilterField extends S.Class<QuickResponseFilterField>(
  "QuickResponseFilterField",
)({
  name: S.String,
  values: S.optional(QuickResponseFilterValueList),
  operator: S.String,
  includeNoExistence: S.optional(S.Boolean),
}) {}
export const QuickResponseFilterFieldList = S.Array(QuickResponseFilterField);
export class QuickResponseOrderField extends S.Class<QuickResponseOrderField>(
  "QuickResponseOrderField",
)({ name: S.String, order: S.optional(S.String) }) {}
export class AmazonConnectGuideAssociationData extends S.Class<AmazonConnectGuideAssociationData>(
  "AmazonConnectGuideAssociationData",
)({ flowId: S.optional(S.String) }) {}
export class AssistantIntegrationConfiguration extends S.Class<AssistantIntegrationConfiguration>(
  "AssistantIntegrationConfiguration",
)({ topicIntegrationArn: S.optional(S.String) }) {}
export class AssistantCapabilityConfiguration extends S.Class<AssistantCapabilityConfiguration>(
  "AssistantCapabilityConfiguration",
)({ type: S.optional(S.String) }) {}
export class AssistantSummary extends S.Class<AssistantSummary>(
  "AssistantSummary",
)({
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
}) {}
export const AssistantList = S.Array(AssistantSummary);
export class NotifyRecommendationsReceivedError extends S.Class<NotifyRecommendationsReceivedError>(
  "NotifyRecommendationsReceivedError",
)({ recommendationId: S.optional(S.String), message: S.optional(S.String) }) {}
export const NotifyRecommendationsReceivedErrorList = S.Array(
  NotifyRecommendationsReceivedError,
);
export const ContentFeedbackData = S.Union(
  S.Struct({ generativeContentFeedbackData: GenerativeContentFeedbackData }),
);
export const QueryCondition = S.Union(S.Struct({ single: QueryConditionItem }));
export const QueryConditionExpression = S.Array(QueryCondition);
export const QueryInputData = S.Union(
  S.Struct({ queryTextInputData: QueryTextInputData }),
  S.Struct({ intentInputData: IntentInputData }),
  S.Struct({ caseSummarizationInputData: CaseSummarizationInputData }),
);
export class AIAgentSummary extends S.Class<AIAgentSummary>("AIAgentSummary")({
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
}) {}
export const AIAgentSummaryList = S.Array(AIAgentSummary);
export class AIAgentVersionSummary extends S.Class<AIAgentVersionSummary>(
  "AIAgentVersionSummary",
)({
  aiAgentSummary: S.optional(AIAgentSummary),
  versionNumber: S.optional(S.Number),
}) {}
export const AIAgentVersionSummariesList = S.Array(AIAgentVersionSummary);
export class AIGuardrailSummary extends S.Class<AIGuardrailSummary>(
  "AIGuardrailSummary",
)({
  name: S.String,
  assistantId: S.String,
  assistantArn: S.String,
  aiGuardrailId: S.String,
  aiGuardrailArn: S.String,
  modifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  visibilityStatus: S.String,
  description: S.optional(S.String),
  status: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export const AIGuardrailSummariesList = S.Array(AIGuardrailSummary);
export class AIGuardrailVersionSummary extends S.Class<AIGuardrailVersionSummary>(
  "AIGuardrailVersionSummary",
)({
  aiGuardrailSummary: S.optional(AIGuardrailSummary),
  versionNumber: S.optional(S.Number),
}) {}
export const AIGuardrailVersionSummariesList = S.Array(
  AIGuardrailVersionSummary,
);
export class AIPromptSummary extends S.Class<AIPromptSummary>(
  "AIPromptSummary",
)({
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
}) {}
export const AIPromptSummaryList = S.Array(AIPromptSummary);
export class AIPromptVersionSummary extends S.Class<AIPromptVersionSummary>(
  "AIPromptVersionSummary",
)({
  aiPromptSummary: S.optional(AIPromptSummary),
  versionNumber: S.optional(S.Number),
}) {}
export const AIPromptVersionSummariesList = S.Array(AIPromptVersionSummary);
export const AssistantAssociationInputData = S.Union(
  S.Struct({ knowledgeBaseId: S.String }),
  S.Struct({
    externalBedrockKnowledgeBaseConfig: ExternalBedrockKnowledgeBaseConfig,
  }),
);
export class KnowledgeBaseAssociationData extends S.Class<KnowledgeBaseAssociationData>(
  "KnowledgeBaseAssociationData",
)({
  knowledgeBaseId: S.optional(S.String),
  knowledgeBaseArn: S.optional(S.String),
}) {}
export const AssistantAssociationOutputData = S.Union(
  S.Struct({ knowledgeBaseAssociation: KnowledgeBaseAssociationData }),
  S.Struct({
    externalBedrockKnowledgeBaseConfig: ExternalBedrockKnowledgeBaseConfig,
  }),
);
export class AssistantAssociationSummary extends S.Class<AssistantAssociationSummary>(
  "AssistantAssociationSummary",
)({
  assistantAssociationId: S.String,
  assistantAssociationArn: S.String,
  assistantId: S.String,
  assistantArn: S.String,
  associationType: S.String,
  associationData: AssistantAssociationOutputData,
  tags: S.optional(Tags),
}) {}
export const AssistantAssociationSummaryList = S.Array(
  AssistantAssociationSummary,
);
export class ConversationState extends S.Class<ConversationState>(
  "ConversationState",
)({ status: S.String, reason: S.optional(S.String) }) {}
export class ConversationContext extends S.Class<ConversationContext>(
  "ConversationContext",
)({ selfServiceConversationHistory: SelfServiceConversationHistoryList }) {}
export class RuntimeSessionData extends S.Class<RuntimeSessionData>(
  "RuntimeSessionData",
)({ key: S.String, value: RuntimeSessionDataValue }) {}
export const RuntimeSessionDataList = S.Array(RuntimeSessionData);
export class KnowledgeBaseSummary extends S.Class<KnowledgeBaseSummary>(
  "KnowledgeBaseSummary",
)({
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
}) {}
export const KnowledgeBaseList = S.Array(KnowledgeBaseSummary);
export class ConnectConfiguration extends S.Class<ConnectConfiguration>(
  "ConnectConfiguration",
)({ instanceId: S.optional(S.String) }) {}
export const Configuration = S.Union(
  S.Struct({ connectConfiguration: ConnectConfiguration }),
);
export class ExternalSourceConfiguration extends S.Class<ExternalSourceConfiguration>(
  "ExternalSourceConfiguration",
)({ source: S.String, configuration: Configuration }) {}
export class ImportJobData extends S.Class<ImportJobData>("ImportJobData")({
  importJobId: S.String,
  knowledgeBaseId: S.String,
  uploadId: S.String,
  knowledgeBaseArn: S.String,
  importJobType: S.String,
  status: S.String,
  url: S.String,
  failedRecordReport: S.optional(S.String),
  urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  metadata: S.optional(ContentMetadata),
  externalSourceConfiguration: S.optional(ExternalSourceConfiguration),
}) {}
export class ImportJobSummary extends S.Class<ImportJobSummary>(
  "ImportJobSummary",
)({
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
}) {}
export const ImportJobList = S.Array(ImportJobSummary);
export class MessageTemplateSearchExpression extends S.Class<MessageTemplateSearchExpression>(
  "MessageTemplateSearchExpression",
)({
  queries: S.optional(MessageTemplateQueryFieldList),
  filters: S.optional(MessageTemplateFilterFieldList),
  orderOnField: S.optional(MessageTemplateOrderField),
}) {}
export class QuickResponseSearchExpression extends S.Class<QuickResponseSearchExpression>(
  "QuickResponseSearchExpression",
)({
  queries: S.optional(QuickResponseQueryFieldList),
  filters: S.optional(QuickResponseFilterFieldList),
  orderOnField: S.optional(QuickResponseOrderField),
}) {}
export const Headers = S.Record({ key: S.String, value: S.String });
export const ContentAssociationContents = S.Union(
  S.Struct({
    amazonConnectGuideAssociation: AmazonConnectGuideAssociationData,
  }),
);
export class ContentAssociationData extends S.Class<ContentAssociationData>(
  "ContentAssociationData",
)({
  knowledgeBaseId: S.String,
  knowledgeBaseArn: S.String,
  contentId: S.String,
  contentArn: S.String,
  contentAssociationId: S.String,
  contentAssociationArn: S.String,
  associationType: S.String,
  associationData: ContentAssociationContents,
  tags: S.optional(Tags),
}) {}
export class ContentAssociationSummary extends S.Class<ContentAssociationSummary>(
  "ContentAssociationSummary",
)({
  knowledgeBaseId: S.String,
  knowledgeBaseArn: S.String,
  contentId: S.String,
  contentArn: S.String,
  contentAssociationId: S.String,
  contentAssociationArn: S.String,
  associationType: S.String,
  associationData: ContentAssociationContents,
  tags: S.optional(Tags),
}) {}
export const ContentAssociationSummaryList = S.Array(ContentAssociationSummary);
export class MessageTemplateSummary extends S.Class<MessageTemplateSummary>(
  "MessageTemplateSummary",
)({
  messageTemplateArn: S.String,
  messageTemplateId: S.String,
  knowledgeBaseArn: S.String,
  knowledgeBaseId: S.String,
  name: S.String,
  channel: S.optional(S.String),
  channelSubtype: S.String,
  createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedBy: S.String,
  sourceConfiguration: S.optional(MessageTemplateSourceConfiguration),
  activeVersionNumber: S.optional(S.Number),
  description: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export const MessageTemplateSummaryList = S.Array(MessageTemplateSummary);
export class MessageTemplateVersionSummary extends S.Class<MessageTemplateVersionSummary>(
  "MessageTemplateVersionSummary",
)({
  messageTemplateArn: S.String,
  messageTemplateId: S.String,
  knowledgeBaseArn: S.String,
  knowledgeBaseId: S.String,
  name: S.String,
  channel: S.optional(S.String),
  channelSubtype: S.String,
  isActive: S.Boolean,
  versionNumber: S.Number,
}) {}
export const MessageTemplateVersionSummaryList = S.Array(
  MessageTemplateVersionSummary,
);
export class QuickResponseSummary extends S.Class<QuickResponseSummary>(
  "QuickResponseSummary",
)({
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
}) {}
export const QuickResponseSummaryList = S.Array(QuickResponseSummary);
export class FilterAttribute extends S.Class<FilterAttribute>(
  "FilterAttribute",
)({ key: S.String, value: S.Any }) {}
export const SpanFinishReasonList = S.Array(S.String);
export class AssistantData extends S.Class<AssistantData>("AssistantData")({
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
}) {}
export class CreateAssistantResponse extends S.Class<CreateAssistantResponse>(
  "CreateAssistantResponse",
)({ assistant: S.optional(AssistantData) }) {}
export class ListAssistantsResponse extends S.Class<ListAssistantsResponse>(
  "ListAssistantsResponse",
)({ assistantSummaries: AssistantList, nextToken: S.optional(S.String) }) {}
export class NotifyRecommendationsReceivedResponse extends S.Class<NotifyRecommendationsReceivedResponse>(
  "NotifyRecommendationsReceivedResponse",
)({
  recommendationIds: S.optional(RecommendationIdList),
  errors: S.optional(NotifyRecommendationsReceivedErrorList),
}) {}
export class PutFeedbackRequest extends S.Class<PutFeedbackRequest>(
  "PutFeedbackRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    targetId: S.String,
    targetType: S.String,
    contentFeedback: ContentFeedbackData,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/assistants/{assistantId}/feedback" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class QueryAssistantRequest extends S.Class<QueryAssistantRequest>(
  "QueryAssistantRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    queryText: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    sessionId: S.optional(S.String),
    queryCondition: S.optional(QueryConditionExpression),
    queryInputData: S.optional(QueryInputData),
    overrideKnowledgeBaseSearchType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/query" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchSessionsRequest extends S.Class<SearchSessionsRequest>(
  "SearchSessionsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    searchExpression: SearchExpression,
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/searchSessions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAssistantAIAgentResponse extends S.Class<UpdateAssistantAIAgentResponse>(
  "UpdateAssistantAIAgentResponse",
)({ assistant: S.optional(AssistantData) }) {}
export class GetAIAgentResponse extends S.Class<GetAIAgentResponse>(
  "GetAIAgentResponse",
)({ aiAgent: S.optional(AIAgentData), versionNumber: S.optional(S.Number) }) {}
export class ListAIAgentsResponse extends S.Class<ListAIAgentsResponse>(
  "ListAIAgentsResponse",
)({ aiAgentSummaries: AIAgentSummaryList, nextToken: S.optional(S.String) }) {}
export class ListAIAgentVersionsResponse extends S.Class<ListAIAgentVersionsResponse>(
  "ListAIAgentVersionsResponse",
)({
  aiAgentVersionSummaries: AIAgentVersionSummariesList,
  nextToken: S.optional(S.String),
}) {}
export class CreateAIGuardrailRequest extends S.Class<CreateAIGuardrailRequest>(
  "CreateAIGuardrailRequest",
)(
  {
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    name: S.String,
    blockedInputMessaging: S.String,
    blockedOutputsMessaging: S.String,
    visibilityStatus: S.String,
    description: S.optional(S.String),
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/aiguardrails" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAIGuardrailResponse extends S.Class<GetAIGuardrailResponse>(
  "GetAIGuardrailResponse",
)({
  aiGuardrail: S.optional(AIGuardrailData),
  versionNumber: S.optional(S.Number),
}) {}
export class ListAIGuardrailsResponse extends S.Class<ListAIGuardrailsResponse>(
  "ListAIGuardrailsResponse",
)({
  aiGuardrailSummaries: AIGuardrailSummariesList,
  nextToken: S.optional(S.String),
}) {}
export class ListAIGuardrailVersionsResponse extends S.Class<ListAIGuardrailVersionsResponse>(
  "ListAIGuardrailVersionsResponse",
)({
  aiGuardrailVersionSummaries: AIGuardrailVersionSummariesList,
  nextToken: S.optional(S.String),
}) {}
export class CreateAIPromptRequest extends S.Class<CreateAIPromptRequest>(
  "CreateAIPromptRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/aiprompts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAIPromptResponse extends S.Class<GetAIPromptResponse>(
  "GetAIPromptResponse",
)({
  aiPrompt: S.optional(AIPromptData),
  versionNumber: S.optional(S.Number),
}) {}
export class ListAIPromptsResponse extends S.Class<ListAIPromptsResponse>(
  "ListAIPromptsResponse",
)({
  aiPromptSummaries: AIPromptSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListAIPromptVersionsResponse extends S.Class<ListAIPromptVersionsResponse>(
  "ListAIPromptVersionsResponse",
)({
  aiPromptVersionSummaries: AIPromptVersionSummariesList,
  nextToken: S.optional(S.String),
}) {}
export class CreateAssistantAssociationRequest extends S.Class<CreateAssistantAssociationRequest>(
  "CreateAssistantAssociationRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    associationType: S.String,
    association: AssistantAssociationInputData,
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssistantAssociationsResponse extends S.Class<ListAssistantAssociationsResponse>(
  "ListAssistantAssociationsResponse",
)({
  assistantAssociationSummaries: AssistantAssociationSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateSessionRequest extends S.Class<CreateSessionRequest>(
  "CreateSessionRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/sessions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNextMessageResponse extends S.Class<GetNextMessageResponse>(
  "GetNextMessageResponse",
)({
  type: S.String,
  response: MessageOutput,
  requestMessageId: S.String,
  conversationState: ConversationState,
  nextMessageToken: S.optional(S.String),
  conversationSessionData: S.optional(RuntimeSessionDataList),
  chunkedResponseTerminated: S.optional(S.Boolean),
}) {}
export class UpdateSessionDataRequest extends S.Class<UpdateSessionDataRequest>(
  "UpdateSessionDataRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    namespace: S.optional(S.String),
    data: RuntimeSessionDataList,
  },
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
) {}
export class GetKnowledgeBaseResponse extends S.Class<GetKnowledgeBaseResponse>(
  "GetKnowledgeBaseResponse",
)({ knowledgeBase: S.optional(KnowledgeBaseData) }) {}
export class ListKnowledgeBasesResponse extends S.Class<ListKnowledgeBasesResponse>(
  "ListKnowledgeBasesResponse",
)({
  knowledgeBaseSummaries: KnowledgeBaseList,
  nextToken: S.optional(S.String),
}) {}
export class GetImportJobResponse extends S.Class<GetImportJobResponse>(
  "GetImportJobResponse",
)({ importJob: S.optional(ImportJobData) }) {}
export class ListImportJobsResponse extends S.Class<ListImportJobsResponse>(
  "ListImportJobsResponse",
)({ importJobSummaries: ImportJobList, nextToken: S.optional(S.String) }) {}
export class SearchContentResponse extends S.Class<SearchContentResponse>(
  "SearchContentResponse",
)({ contentSummaries: ContentSummaryList, nextToken: S.optional(S.String) }) {}
export class SearchMessageTemplatesRequest extends S.Class<SearchMessageTemplatesRequest>(
  "SearchMessageTemplatesRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    searchExpression: MessageTemplateSearchExpression,
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class SearchQuickResponsesRequest extends S.Class<SearchQuickResponsesRequest>(
  "SearchQuickResponsesRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    searchExpression: QuickResponseSearchExpression,
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    attributes: S.optional(ContactAttributes),
  },
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
) {}
export class StartContentUploadResponse extends S.Class<StartContentUploadResponse>(
  "StartContentUploadResponse",
)({
  uploadId: S.String,
  url: S.String,
  urlExpiry: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  headersToInclude: Headers,
}) {}
export class CreateContentResponse extends S.Class<CreateContentResponse>(
  "CreateContentResponse",
)({ content: S.optional(ContentData) }) {}
export class CreateContentAssociationRequest extends S.Class<CreateContentAssociationRequest>(
  "CreateContentAssociationRequest",
)(
  {
    clientToken: S.optional(S.String),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    contentId: S.String.pipe(T.HttpLabel("contentId")),
    associationType: S.String,
    association: ContentAssociationContents,
    tags: S.optional(Tags),
  },
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
) {}
export class GetContentAssociationResponse extends S.Class<GetContentAssociationResponse>(
  "GetContentAssociationResponse",
)({ contentAssociation: S.optional(ContentAssociationData) }) {}
export class ListContentAssociationsResponse extends S.Class<ListContentAssociationsResponse>(
  "ListContentAssociationsResponse",
)({
  contentAssociationSummaries: ContentAssociationSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class GetMessageTemplateResponse extends S.Class<GetMessageTemplateResponse>(
  "GetMessageTemplateResponse",
)({ messageTemplate: S.optional(ExtendedMessageTemplateData) }) {}
export class UpdateMessageTemplateResponse extends S.Class<UpdateMessageTemplateResponse>(
  "UpdateMessageTemplateResponse",
)({ messageTemplate: S.optional(MessageTemplateData) }) {}
export class ListMessageTemplatesResponse extends S.Class<ListMessageTemplatesResponse>(
  "ListMessageTemplatesResponse",
)({
  messageTemplateSummaries: MessageTemplateSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateMessageTemplateAttachmentResponse extends S.Class<CreateMessageTemplateAttachmentResponse>(
  "CreateMessageTemplateAttachmentResponse",
)({ attachment: S.optional(MessageTemplateAttachment) }) {}
export class ListMessageTemplateVersionsResponse extends S.Class<ListMessageTemplateVersionsResponse>(
  "ListMessageTemplateVersionsResponse",
)({
  messageTemplateVersionSummaries: MessageTemplateVersionSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateQuickResponseResponse extends S.Class<CreateQuickResponseResponse>(
  "CreateQuickResponseResponse",
)({ quickResponse: S.optional(QuickResponseData) }) {}
export class ListQuickResponsesResponse extends S.Class<ListQuickResponsesResponse>(
  "ListQuickResponsesResponse",
)({
  quickResponseSummaries: QuickResponseSummaryList,
  nextToken: S.optional(S.String),
}) {}
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
  S.Struct({ andAll: S.suspend(() => RetrievalFilterList) }),
  S.Struct({ equals: FilterAttribute }),
  S.Struct({ greaterThan: FilterAttribute }),
  S.Struct({ greaterThanOrEquals: FilterAttribute }),
  S.Struct({ in: FilterAttribute }),
  S.Struct({ lessThan: FilterAttribute }),
  S.Struct({ lessThanOrEquals: FilterAttribute }),
  S.Struct({ listContains: FilterAttribute }),
  S.Struct({ notEquals: FilterAttribute }),
  S.Struct({ notIn: FilterAttribute }),
  S.Struct({ orAll: S.suspend(() => RetrievalFilterList) }),
  S.Struct({ startsWith: FilterAttribute }),
  S.Struct({ stringContains: FilterAttribute }),
) as any as S.Schema<RetrievalFilterConfiguration>;
export class RetrievalConfiguration extends S.Class<RetrievalConfiguration>(
  "RetrievalConfiguration",
)({
  knowledgeSource: KnowledgeSource,
  filter: S.optional(RetrievalFilterConfiguration),
  numberOfResults: S.optional(S.Number),
  overrideKnowledgeBaseSearchType: S.optional(S.String),
}) {}
export class ContentReference extends S.Class<ContentReference>(
  "ContentReference",
)({
  knowledgeBaseArn: S.optional(S.String),
  knowledgeBaseId: S.optional(S.String),
  contentArn: S.optional(S.String),
  contentId: S.optional(S.String),
  sourceURL: S.optional(S.String),
  referenceType: S.optional(S.String),
}) {}
export class QueryRecommendationTriggerData extends S.Class<QueryRecommendationTriggerData>(
  "QueryRecommendationTriggerData",
)({ text: S.optional(S.String) }) {}
export type SpanMessageValueList = SpanMessageValue[];
export const SpanMessageValueList = S.Array(
  S.suspend(() => SpanMessageValue),
) as any as S.Schema<SpanMessageValueList>;
export class SpanMessage extends S.Class<SpanMessage>("SpanMessage")({
  messageId: S.String,
  participant: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  values: SpanMessageValueList,
}) {}
export const SpanMessageList = S.Array(SpanMessage);
export class GetAssistantResponse extends S.Class<GetAssistantResponse>(
  "GetAssistantResponse",
)({ assistant: S.optional(AssistantData) }) {}
export type DataSummaryList = DataSummary[];
export const DataSummaryList = S.Array(
  S.suspend((): S.Schema<DataSummary, any> => DataSummary),
) as any as S.Schema<DataSummaryList>;
export class PutFeedbackResponse extends S.Class<PutFeedbackResponse>(
  "PutFeedbackResponse",
)({
  assistantId: S.String,
  assistantArn: S.String,
  targetId: S.String,
  targetType: S.String,
  contentFeedback: ContentFeedbackData,
}) {}
export class RetrieveRequest extends S.Class<RetrieveRequest>(
  "RetrieveRequest",
)(
  {
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    retrievalConfiguration: RetrievalConfiguration,
    retrievalQuery: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/retrieve" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAIGuardrailResponse extends S.Class<CreateAIGuardrailResponse>(
  "CreateAIGuardrailResponse",
)({ aiGuardrail: S.optional(AIGuardrailData) }) {}
export class CreateAIPromptResponse extends S.Class<CreateAIPromptResponse>(
  "CreateAIPromptResponse",
)({ aiPrompt: S.optional(AIPromptData) }) {}
export class AssistantAssociationData extends S.Class<AssistantAssociationData>(
  "AssistantAssociationData",
)({
  assistantAssociationId: S.String,
  assistantAssociationArn: S.String,
  assistantId: S.String,
  assistantArn: S.String,
  associationType: S.String,
  associationData: AssistantAssociationOutputData,
  tags: S.optional(Tags),
}) {}
export class CreateAssistantAssociationResponse extends S.Class<CreateAssistantAssociationResponse>(
  "CreateAssistantAssociationResponse",
)({ assistantAssociation: S.optional(AssistantAssociationData) }) {}
export class CreateSessionResponse extends S.Class<CreateSessionResponse>(
  "CreateSessionResponse",
)({ session: S.optional(SessionData) }) {}
export class GetSessionResponse extends S.Class<GetSessionResponse>(
  "GetSessionResponse",
)({ session: S.optional(SessionData) }) {}
export class UpdateSessionDataResponse extends S.Class<UpdateSessionDataResponse>(
  "UpdateSessionDataResponse",
)({
  sessionArn: S.String,
  sessionId: S.String,
  namespace: S.String,
  data: RuntimeSessionDataList,
}) {}
export class StartImportJobRequest extends S.Class<StartImportJobRequest>(
  "StartImportJobRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    importJobType: S.String,
    uploadId: S.String,
    clientToken: S.optional(S.String),
    metadata: S.optional(ContentMetadata),
    externalSourceConfiguration: S.optional(ExternalSourceConfiguration),
  },
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
) {}
export class CreateContentAssociationResponse extends S.Class<CreateContentAssociationResponse>(
  "CreateContentAssociationResponse",
)({ contentAssociation: S.optional(ContentAssociationData) }) {}
export class RenderMessageTemplateResponse extends S.Class<RenderMessageTemplateResponse>(
  "RenderMessageTemplateResponse",
)({
  content: S.optional(MessageTemplateContentProvider),
  sourceConfigurationSummary: S.optional(
    MessageTemplateSourceConfigurationSummary,
  ),
  attributesNotInterpolated: S.optional(MessageTemplateAttributeKeyList),
  attachments: S.optional(MessageTemplateAttachmentList),
}) {}
export const RecommendationTriggerData = S.Union(
  S.Struct({ query: QueryRecommendationTriggerData }),
);
export const ContactAttributeKeys = S.Array(S.String);
export class Highlight extends S.Class<Highlight>("Highlight")({
  beginOffsetInclusive: S.optional(S.Number),
  endOffsetExclusive: S.optional(S.Number),
}) {}
export const Highlights = S.Array(Highlight);
export class GenerativeReference extends S.Class<GenerativeReference>(
  "GenerativeReference",
)({ modelId: S.optional(S.String), generationId: S.optional(S.String) }) {}
export class SuggestedMessageReference extends S.Class<SuggestedMessageReference>(
  "SuggestedMessageReference",
)({ aiAgentId: S.String, aiAgentArn: S.String }) {}
export class RankingData extends S.Class<RankingData>("RankingData")({
  relevanceScore: S.optional(S.Number),
  relevanceLevel: S.optional(S.String),
}) {}
export class GenerativeDataDetails extends S.Class<GenerativeDataDetails>(
  "GenerativeDataDetails",
)({
  completion: S.String,
  references: S.suspend(() => DataSummaryList),
  rankingData: RankingData,
}) {}
export class IntentDetectedDataDetails extends S.Class<IntentDetectedDataDetails>(
  "IntentDetectedDataDetails",
)({
  intent: S.String,
  intentId: S.String,
  relevanceLevel: S.optional(S.String),
}) {}
export class DocumentText extends S.Class<DocumentText>("DocumentText")({
  text: S.optional(S.String),
  highlights: S.optional(Highlights),
}) {}
export class TextData extends S.Class<TextData>("TextData")({
  title: S.optional(DocumentText),
  excerpt: S.optional(DocumentText),
}) {}
export class SourceContentDataDetails extends S.Class<SourceContentDataDetails>(
  "SourceContentDataDetails",
)({
  id: S.String,
  type: S.String,
  textData: TextData,
  rankingData: RankingData,
  citationSpan: S.optional(CitationSpan),
}) {}
export class GenerativeChunkDataDetails extends S.Class<GenerativeChunkDataDetails>(
  "GenerativeChunkDataDetails",
)({
  completion: S.optional(S.String),
  references: S.optional(S.suspend(() => DataSummaryList)),
  nextChunkToken: S.optional(S.String),
}) {}
export class EmailResponseChunkDataDetails extends S.Class<EmailResponseChunkDataDetails>(
  "EmailResponseChunkDataDetails",
)({ completion: S.optional(S.String), nextChunkToken: S.optional(S.String) }) {}
export class EmailOverviewChunkDataDetails extends S.Class<EmailOverviewChunkDataDetails>(
  "EmailOverviewChunkDataDetails",
)({ completion: S.optional(S.String), nextChunkToken: S.optional(S.String) }) {}
export class EmailGenerativeAnswerChunkDataDetails extends S.Class<EmailGenerativeAnswerChunkDataDetails>(
  "EmailGenerativeAnswerChunkDataDetails",
)({
  completion: S.optional(S.String),
  references: S.optional(S.suspend(() => DataSummaryList)),
  nextChunkToken: S.optional(S.String),
}) {}
export class CaseSummarizationChunkDataDetails extends S.Class<CaseSummarizationChunkDataDetails>(
  "CaseSummarizationChunkDataDetails",
)({ completion: S.optional(S.String), nextChunkToken: S.optional(S.String) }) {}
export class SuggestedMessageDataDetails extends S.Class<SuggestedMessageDataDetails>(
  "SuggestedMessageDataDetails",
)({ messageText: S.String }) {}
export class NotesDataDetails extends S.Class<NotesDataDetails>(
  "NotesDataDetails",
)({ completion: S.optional(S.String) }) {}
export class NotesChunkDataDetails extends S.Class<NotesChunkDataDetails>(
  "NotesChunkDataDetails",
)({ completion: S.optional(S.String), nextChunkToken: S.optional(S.String) }) {}
export class SpanToolUseValue extends S.Class<SpanToolUseValue>(
  "SpanToolUseValue",
)({ toolUseId: S.String, name: S.String, arguments: S.Any }) {}
export class SpanToolResultValue extends S.Class<SpanToolResultValue>(
  "SpanToolResultValue",
)({
  toolUseId: S.String,
  values: S.suspend(() => SpanMessageValueList),
  error: S.optional(S.String),
}) {}
export class RecommendationTrigger extends S.Class<RecommendationTrigger>(
  "RecommendationTrigger",
)({
  id: S.String,
  type: S.String,
  source: S.String,
  data: RecommendationTriggerData,
  recommendationIds: RecommendationIdList,
}) {}
export const RecommendationTriggerList = S.Array(RecommendationTrigger);
export class Document extends S.Class<Document>("Document")({
  contentReference: ContentReference,
  title: S.optional(DocumentText),
  excerpt: S.optional(DocumentText),
}) {}
export const DataReference = S.Union(
  S.Struct({ contentReference: ContentReference }),
  S.Struct({ generativeReference: GenerativeReference }),
  S.Struct({ suggestedMessageReference: SuggestedMessageReference }),
);
export class DataSummary extends S.Class<DataSummary>("DataSummary")({
  reference: DataReference,
  details: S.suspend(() => DataDetails),
}) {}
export class ResultData extends S.Class<ResultData>("ResultData")({
  resultId: S.String,
  document: S.optional(Document),
  relevanceScore: S.optional(S.Number),
  data: S.optional(DataSummary),
  type: S.optional(S.String),
}) {}
export const QueryResultsList = S.Array(ResultData);
export class SessionSummary extends S.Class<SessionSummary>("SessionSummary")({
  sessionId: S.String,
  sessionArn: S.String,
  assistantId: S.String,
  assistantArn: S.String,
}) {}
export const SessionSummaries = S.Array(SessionSummary);
export class MessageTemplateSearchResultData extends S.Class<MessageTemplateSearchResultData>(
  "MessageTemplateSearchResultData",
)({
  messageTemplateArn: S.String,
  messageTemplateId: S.String,
  knowledgeBaseArn: S.String,
  knowledgeBaseId: S.String,
  name: S.String,
  channel: S.optional(S.String),
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
}) {}
export const MessageTemplateSearchResultsList = S.Array(
  MessageTemplateSearchResultData,
);
export class QuickResponseSearchResultData extends S.Class<QuickResponseSearchResultData>(
  "QuickResponseSearchResultData",
)({
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
}) {}
export const QuickResponseSearchResultsList = S.Array(
  QuickResponseSearchResultData,
);
export class QueryAssistantResponse extends S.Class<QueryAssistantResponse>(
  "QueryAssistantResponse",
)({ results: QueryResultsList, nextToken: S.optional(S.String) }) {}
export class SearchSessionsResponse extends S.Class<SearchSessionsResponse>(
  "SearchSessionsResponse",
)({ sessionSummaries: SessionSummaries, nextToken: S.optional(S.String) }) {}
export class GetAssistantAssociationResponse extends S.Class<GetAssistantAssociationResponse>(
  "GetAssistantAssociationResponse",
)({ assistantAssociation: S.optional(AssistantAssociationData) }) {}
export class SpanCitation extends S.Class<SpanCitation>("SpanCitation")({
  contentId: S.optional(S.String),
  title: S.optional(S.String),
  knowledgeBaseId: S.optional(S.String),
  knowledgeBaseArn: S.optional(S.String),
}) {}
export const SpanCitationList = S.Array(SpanCitation);
export class SearchMessageTemplatesResponse extends S.Class<SearchMessageTemplatesResponse>(
  "SearchMessageTemplatesResponse",
)({
  results: MessageTemplateSearchResultsList,
  nextToken: S.optional(S.String),
}) {}
export class SearchQuickResponsesResponse extends S.Class<SearchQuickResponsesResponse>(
  "SearchQuickResponsesResponse",
)({
  results: QuickResponseSearchResultsList,
  nextToken: S.optional(S.String),
}) {}
export class StartImportJobResponse extends S.Class<StartImportJobResponse>(
  "StartImportJobResponse",
)({ importJob: S.optional(ImportJobData) }) {}
export class CreateMessageTemplateRequest extends S.Class<CreateMessageTemplateRequest>(
  "CreateMessageTemplateRequest",
)(
  {
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
  },
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
) {}
export class GetQuickResponseResponse extends S.Class<GetQuickResponseResponse>(
  "GetQuickResponseResponse",
)({ quickResponse: S.optional(QuickResponseData) }) {}
export class ContentDataDetails extends S.Class<ContentDataDetails>(
  "ContentDataDetails",
)({ textData: TextData, rankingData: RankingData }) {}
export class SpanTextValue extends S.Class<SpanTextValue>("SpanTextValue")({
  value: S.String,
  citations: S.optional(SpanCitationList),
  aiGuardrailAssessment: S.optional(AIGuardrailAssessment),
}) {}
export class RetrieveResult extends S.Class<RetrieveResult>("RetrieveResult")({
  associationId: S.String,
  sourceId: S.String,
  referenceType: S.String,
  contentText: S.String,
}) {}
export const RetrieveResultList = S.Array(RetrieveResult);
export class MessageInput extends S.Class<MessageInput>("MessageInput")({
  value: MessageData,
}) {}
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
    ),
  }),
  S.Struct({ intentDetectedData: IntentDetectedDataDetails }),
  S.Struct({ sourceContentData: SourceContentDataDetails }),
  S.Struct({
    generativeChunkData: S.suspend(
      (): S.Schema<GenerativeChunkDataDetails, any> =>
        GenerativeChunkDataDetails,
    ),
  }),
  S.Struct({ emailResponseChunkData: EmailResponseChunkDataDetails }),
  S.Struct({ emailOverviewChunkData: EmailOverviewChunkDataDetails }),
  S.Struct({
    emailGenerativeAnswerChunkData: S.suspend(
      (): S.Schema<EmailGenerativeAnswerChunkDataDetails, any> =>
        EmailGenerativeAnswerChunkDataDetails,
    ),
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
    ),
  }),
) as any as S.Schema<SpanMessageValue>;
export class RetrieveResponse extends S.Class<RetrieveResponse>(
  "RetrieveResponse",
)({ results: RetrieveResultList }) {}
export class SendMessageRequest extends S.Class<SendMessageRequest>(
  "SendMessageRequest",
)(
  {
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
  },
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
) {}
export class CreateKnowledgeBaseRequest extends S.Class<CreateKnowledgeBaseRequest>(
  "CreateKnowledgeBaseRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/knowledgeBases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMessageTemplateResponse extends S.Class<CreateMessageTemplateResponse>(
  "CreateMessageTemplateResponse",
)({ messageTemplate: S.optional(MessageTemplateData) }) {}
export class SpanAttributes extends S.Class<SpanAttributes>("SpanAttributes")({
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
}) {}
export class RecommendationData extends S.Class<RecommendationData>(
  "RecommendationData",
)({
  recommendationId: S.String,
  document: S.optional(Document),
  relevanceScore: S.optional(S.Number),
  relevanceLevel: S.optional(S.String),
  type: S.optional(S.String),
  data: S.optional(DataSummary),
}) {}
export const RecommendationList = S.Array(RecommendationData);
export class Span extends S.Class<Span>("Span")({
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
}) {}
export const SpanList = S.Array(Span);
export class GetRecommendationsResponse extends S.Class<GetRecommendationsResponse>(
  "GetRecommendationsResponse",
)({
  recommendations: RecommendationList,
  triggers: S.optional(RecommendationTriggerList),
}) {}
export class CreateAIAgentRequest extends S.Class<CreateAIAgentRequest>(
  "CreateAIAgentRequest",
)(
  {
    clientToken: S.optional(S.String),
    assistantId: S.String.pipe(T.HttpLabel("assistantId")),
    name: S.String,
    type: S.String,
    configuration: AIAgentConfiguration,
    visibilityStatus: S.String,
    tags: S.optional(Tags),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assistants/{assistantId}/aiagents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSpansResponse extends S.Class<ListSpansResponse>(
  "ListSpansResponse",
)({ spans: SpanList, nextToken: S.optional(S.String) }) {}
export class SendMessageResponse extends S.Class<SendMessageResponse>(
  "SendMessageResponse",
)({
  requestMessageId: S.String,
  configuration: S.optional(MessageConfiguration),
  nextMessageToken: S.String,
}) {}
export class CreateKnowledgeBaseResponse extends S.Class<CreateKnowledgeBaseResponse>(
  "CreateKnowledgeBaseResponse",
)({ knowledgeBase: S.optional(KnowledgeBaseData) }) {}
export class CreateAIAgentResponse extends S.Class<CreateAIAgentResponse>(
  "CreateAIAgentResponse",
)({ aiAgent: S.optional(AIAgentData) }) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.Retryable(),
) {}
export class UnprocessableContentException extends S.TaggedError<UnprocessableContentException>()(
  "UnprocessableContentException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class DependencyFailedException extends S.TaggedError<DependencyFailedException>()(
  "DependencyFailedException",
  { message: S.optional(S.String) },
) {}
export class RequestTimeoutException extends S.TaggedError<RequestTimeoutException>()(
  "RequestTimeoutException",
  { message: S.optional(S.String) },
  T.Retryable(),
) {}

//# Operations
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists messages on an Amazon Q in Connect session.
 */
export const listMessages = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Retrieves information about the knowledge base.
 */
export const getKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listKnowledgeBases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListKnowledgeBasesRequest,
    output: ListKnowledgeBasesResponse,
    errors: [AccessDeniedException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "knowledgeBaseSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves the started import job.
 */
export const getImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListImportJobsRequest,
    output: ListImportJobsResponse,
    errors: [AccessDeniedException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "importJobSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Searches for content in a specified knowledge base. Can be used to get a specific content resource by its name.
 */
export const searchContent = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Get a URL to upload content to a knowledge base. To upload content, first make a PUT request to the returned URL with your file, making sure to include the required headers. Then use CreateContent to finalize the content creation process or UpdateContent to modify an existing resource. You can only upload content to a knowledge base of type CUSTOM.
 */
export const startContentUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getContentAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetContentAssociationRequest,
    output: GetContentAssociationResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the content associations.
 *
 * For more information about content associations--what they are and when they are used--see Integrate Amazon Q in Connect with step-by-step guides in the *Amazon Connect Administrator Guide*.
 */
export const listContentAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listQuickResponses = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Adds the specified tags to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, TooManyTagsException],
}));
/**
 * Removes the AI Agent that is set for use by default on an Amazon Q in Connect Assistant.
 */
export const removeAssistantAIAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveAssistantAIAgentRequest,
    output: RemoveAssistantAIAgentResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a session. A session is a contextual container used for generating recommendations. Amazon Connect updates the existing Amazon Q in Connect session for each contact on which Amazon Q in Connect is enabled.
 */
export const updateSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getContentSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAssistantAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAssistantAssociationRequest,
    output: DeleteAssistantAssociationResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the content association.
 *
 * For more information about content associations--what they are and when they are used--see Integrate Amazon Q in Connect with step-by-step guides in the *Amazon Connect Administrator Guide*.
 */
export const deleteContentAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteContentAssociationRequest,
    output: DeleteContentAssociationResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a quick response.
 */
export const deleteQuickResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAIGuardrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAIPrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const activateMessageTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ActivateMessageTemplateRequest,
    output: ActivateMessageTemplateResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deactivates a specific version of the Amazon Q in Connect message template . After the version is deactivated, you can no longer use the `$ACTIVE_VERSION` qualifier to reference the version in active status.
 */
export const deactivateMessageTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeactivateMessageTemplateRequest,
    output: DeactivateMessageTemplateResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the Amazon Q in Connect message template metadata. Note that any modification to the message template’s name, description and grouping configuration will applied to the message template pointed by the `$LATEST` qualifier and all available versions. Partial update is supported. If any field is not supplied, it will remain unchanged for the message template.
 */
export const updateMessageTemplateMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateQuickResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAIAgentVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes an Amazon Q in Connect AI Guardrail.
 */
export const deleteAIGuardrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAIGuardrailVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Delete and Amazon Q in Connect AI Prompt version.
 */
export const deleteAIPromptVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes the knowledge base.
 *
 * When you use this API to delete an external knowledge base such as Salesforce or ServiceNow, you must also delete the Amazon AppIntegrations DataIntegration. This is because you can't reuse the DataIntegration after it's been associated with an external knowledge base. However, you can delete and recreate it. See DeleteDataIntegration and CreateDataIntegration in the *Amazon AppIntegrations API Reference*.
 */
export const deleteKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMessageTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMessageTemplateRequest,
    output: DeleteMessageTemplateResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the attachment file from the Amazon Q in Connect message template that is referenced by `$LATEST` qualifier. Attachments on available message template versions will remain unchanged.
 */
export const deleteMessageTemplateAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateKnowledgeBaseTemplateUri =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listContents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Removes a URI template from a knowledge base.
 */
export const removeKnowledgeBaseTemplateUri =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAssistant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAssistants = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAssistantsRequest,
    output: ListAssistantsResponse,
    errors: [AccessDeniedException, UnauthorizedException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "assistantSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Removes the specified recommendations from the specified assistant's queue of newly available recommendations. You can use this API in conjunction with GetRecommendations and a `waitTimeSeconds` input for long-polling behavior and avoiding duplicate recommendations.
 */
export const notifyRecommendationsReceived =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAssistantAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteAIAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAIPrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAssistantAIAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAssistantAIAgentRequest,
    output: UpdateAssistantAIAgentResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets an Amazon Q in Connect AI Agent.
 */
export const getAIAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAIAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAIAgents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * List AI Agent versions.
 */
export const listAIAgentVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getAIGuardrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAIGuardrails = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists AI Guardrail versions.
 */
export const listAIGuardrailVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getAIPrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAIPrompts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists AI Prompt versions.
 */
export const listAIPromptVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getMessageTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateMessageTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMessageTemplateRequest,
    output: UpdateMessageTemplateResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all the available Amazon Q in Connect message templates for the specified knowledge base.
 */
export const listMessageTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listMessageTemplateVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getAssistant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putFeedback = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getNextMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSessionData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createContentAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Renders the Amazon Q in Connect message template based on the attribute values provided and generates the message content. For any variable present in the message template, if the attribute value is neither provided in the attribute request parameter nor the default attribute of the message template, the rendered message content will keep the variable placeholder as it is and return the attribute keys that are missing.
 */
export const renderMessageTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RenderMessageTemplateRequest,
    output: RenderMessageTemplateResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Uploads an attachment file to the specified Amazon Q in Connect message template. The name of the message template attachment has to be unique for each message template referenced by the `$LATEST` qualifier. The body of the attachment file should be encoded using base64 encoding. After the file is uploaded, you can use the pre-signed Amazon S3 URL returned in response to download the uploaded file.
 */
export const createMessageTemplateAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createQuickResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAIAgentVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates an Amazon Q in Connect AI Guardrail version.
 */
export const createAIGuardrailVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates an Amazon Q in Connect AI Prompt version.
 */
export const createAIPromptVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a new Amazon Q in Connect message template version from the current content and configuration of a message template. Versions are immutable and monotonically increasing. Once a version is created, you can reference a specific version of the message template by passing in `<message-template-id>:<versionNumber>` as the message template identifier. An error is displayed if the supplied `messageTemplateContentSha256` is different from the `messageTemplateContentSha256` of the message template with `$LATEST` qualifier. If multiple `CreateMessageTemplateVersion` requests are made while the message template remains the same, only the first invocation creates a new version and the succeeding requests will return the same response as the first invocation.
 */
export const createMessageTemplateVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAssistant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAIGuardrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAIPrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAssistantAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAssistantAssociationRequest,
    output: CreateAssistantAssociationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Searches for sessions.
 */
export const searchSessions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Retrieves information about an assistant association.
 */
export const getAssistantAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAssistantAssociationRequest,
    output: GetAssistantAssociationResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a session. A session is a contextual container used for generating recommendations. Amazon Connect creates a new Amazon Q in Connect session for each contact on which Amazon Q in Connect is enabled.
 */
export const createSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchMessageTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQuickResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const queryAssistant = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Retrieves content from knowledge sources based on a query.
 */
export const retrieve = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createMessageTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Searches existing Amazon Q in Connect quick responses in an Amazon Q in Connect knowledge base.
 */
export const searchQuickResponses =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSpans = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const sendMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAIAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
