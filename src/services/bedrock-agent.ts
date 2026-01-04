import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Bedrock Agent",
  serviceShapeName: "AmazonBedrockAgentBuildTimeLambda",
});
const auth = T.AwsAuthSigv4({ name: "bedrock" });
const ver = T.ServiceVersion("2023-06-05");
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
                                url: "https://bedrock-agent-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://bedrock-agent-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://bedrock-agent.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://bedrock-agent.{Region}.{PartitionResult#dnsSuffix}",
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
export class InputFlowNodeConfiguration extends S.Class<InputFlowNodeConfiguration>(
  "InputFlowNodeConfiguration",
)({}) {}
export class OutputFlowNodeConfiguration extends S.Class<OutputFlowNodeConfiguration>(
  "OutputFlowNodeConfiguration",
)({}) {}
export class IteratorFlowNodeConfiguration extends S.Class<IteratorFlowNodeConfiguration>(
  "IteratorFlowNodeConfiguration",
)({}) {}
export class CollectorFlowNodeConfiguration extends S.Class<CollectorFlowNodeConfiguration>(
  "CollectorFlowNodeConfiguration",
)({}) {}
export class LoopInputFlowNodeConfiguration extends S.Class<LoopInputFlowNodeConfiguration>(
  "LoopInputFlowNodeConfiguration",
)({}) {}
export class FlowNodeInput extends S.Class<FlowNodeInput>("FlowNodeInput")({
  name: S.String,
  type: S.String,
  expression: S.String,
  category: S.optional(S.String),
}) {}
export const FlowNodeInputs = S.Array(FlowNodeInput);
export class FlowNodeOutput extends S.Class<FlowNodeOutput>("FlowNodeOutput")({
  name: S.String,
  type: S.String,
}) {}
export const FlowNodeOutputs = S.Array(FlowNodeOutput);
export class LexFlowNodeConfiguration extends S.Class<LexFlowNodeConfiguration>(
  "LexFlowNodeConfiguration",
)({ botAliasArn: S.String, localeId: S.String }) {}
export class LambdaFunctionFlowNodeConfiguration extends S.Class<LambdaFunctionFlowNodeConfiguration>(
  "LambdaFunctionFlowNodeConfiguration",
)({ lambdaArn: S.String }) {}
export class AgentFlowNodeConfiguration extends S.Class<AgentFlowNodeConfiguration>(
  "AgentFlowNodeConfiguration",
)({ agentAliasArn: S.String }) {}
export class InlineCodeFlowNodeConfiguration extends S.Class<InlineCodeFlowNodeConfiguration>(
  "InlineCodeFlowNodeConfiguration",
)({ code: S.String, language: S.String }) {}
export class LoopFlowNodeConfiguration extends S.Class<LoopFlowNodeConfiguration>(
  "LoopFlowNodeConfiguration",
)({
  definition: S.suspend((): S.Schema<FlowDefinition, any> => FlowDefinition),
}) {}
export class FlowCondition extends S.Class<FlowCondition>("FlowCondition")({
  name: S.String,
  expression: S.optional(S.String),
}) {}
export class LoopControllerFlowNodeConfiguration extends S.Class<LoopControllerFlowNodeConfiguration>(
  "LoopControllerFlowNodeConfiguration",
)({ continueCondition: FlowCondition, maxIterations: S.optional(S.Number) }) {}
export class FlowDataConnectionConfiguration extends S.Class<FlowDataConnectionConfiguration>(
  "FlowDataConnectionConfiguration",
)({ sourceOutput: S.String, targetInput: S.String }) {}
export class FlowConditionalConnectionConfiguration extends S.Class<FlowConditionalConnectionConfiguration>(
  "FlowConditionalConnectionConfiguration",
)({ condition: S.String }) {}
export const FlowConnectionConfiguration = S.Union(
  S.Struct({ data: FlowDataConnectionConfiguration }),
  S.Struct({ conditional: FlowConditionalConnectionConfiguration }),
);
export class GuardrailConfiguration extends S.Class<GuardrailConfiguration>(
  "GuardrailConfiguration",
)({
  guardrailIdentifier: S.optional(S.String),
  guardrailVersion: S.optional(S.String),
}) {}
export class KnowledgeBasePromptTemplate extends S.Class<KnowledgeBasePromptTemplate>(
  "KnowledgeBasePromptTemplate",
)({ textPromptTemplate: S.optional(S.String) }) {}
export const FlowConditions = S.Array(FlowCondition);
export const StopSequences = S.Array(S.String);
export class FlowConnection extends S.Class<FlowConnection>("FlowConnection")({
  type: S.String,
  name: S.String,
  source: S.String,
  target: S.String,
  configuration: S.optional(FlowConnectionConfiguration),
}) {}
export const FlowConnections = S.Array(FlowConnection);
export class ConditionFlowNodeConfiguration extends S.Class<ConditionFlowNodeConfiguration>(
  "ConditionFlowNodeConfiguration",
)({ conditions: FlowConditions }) {}
export class PromptModelInferenceConfiguration extends S.Class<PromptModelInferenceConfiguration>(
  "PromptModelInferenceConfiguration",
)({
  temperature: S.optional(S.Number),
  topP: S.optional(S.Number),
  maxTokens: S.optional(S.Number),
  stopSequences: S.optional(StopSequences),
}) {}
export const AdditionalModelRequestFields = S.Record({
  key: S.String,
  value: S.Any,
});
export class PerformanceConfiguration extends S.Class<PerformanceConfiguration>(
  "PerformanceConfiguration",
)({ latency: S.optional(S.String) }) {}
export class PromptFlowNodeResourceConfiguration extends S.Class<PromptFlowNodeResourceConfiguration>(
  "PromptFlowNodeResourceConfiguration",
)({ promptArn: S.String }) {}
export class StorageFlowNodeS3Configuration extends S.Class<StorageFlowNodeS3Configuration>(
  "StorageFlowNodeS3Configuration",
)({ bucketName: S.String }) {}
export class RetrievalFlowNodeS3Configuration extends S.Class<RetrievalFlowNodeS3Configuration>(
  "RetrievalFlowNodeS3Configuration",
)({ bucketName: S.String }) {}
export const PromptInferenceConfiguration = S.Union(
  S.Struct({ text: PromptModelInferenceConfiguration }),
);
export class KnowledgeBaseOrchestrationConfiguration extends S.Class<KnowledgeBaseOrchestrationConfiguration>(
  "KnowledgeBaseOrchestrationConfiguration",
)({
  promptTemplate: S.optional(KnowledgeBasePromptTemplate),
  inferenceConfig: S.optional(PromptInferenceConfiguration),
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
  performanceConfig: S.optional(PerformanceConfiguration),
}) {}
export const StorageFlowNodeServiceConfiguration = S.Union(
  S.Struct({ s3: StorageFlowNodeS3Configuration }),
);
export const RetrievalFlowNodeServiceConfiguration = S.Union(
  S.Struct({ s3: RetrievalFlowNodeS3Configuration }),
);
export class VectorSearchBedrockRerankingModelConfiguration extends S.Class<VectorSearchBedrockRerankingModelConfiguration>(
  "VectorSearchBedrockRerankingModelConfiguration",
)({
  modelArn: S.String,
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
}) {}
export class StorageFlowNodeConfiguration extends S.Class<StorageFlowNodeConfiguration>(
  "StorageFlowNodeConfiguration",
)({ serviceConfiguration: StorageFlowNodeServiceConfiguration }) {}
export class RetrievalFlowNodeConfiguration extends S.Class<RetrievalFlowNodeConfiguration>(
  "RetrievalFlowNodeConfiguration",
)({ serviceConfiguration: RetrievalFlowNodeServiceConfiguration }) {}
export class FieldForReranking extends S.Class<FieldForReranking>(
  "FieldForReranking",
)({ fieldName: S.String }) {}
export const FieldsForReranking = S.Array(FieldForReranking);
export class CachePointBlock extends S.Class<CachePointBlock>(
  "CachePointBlock",
)({ type: S.String }) {}
export class PromptInputVariable extends S.Class<PromptInputVariable>(
  "PromptInputVariable",
)({ name: S.optional(S.String) }) {}
export const PromptInputVariablesList = S.Array(PromptInputVariable);
export const SystemContentBlock = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ cachePoint: CachePointBlock }),
);
export const SystemContentBlocks = S.Array(SystemContentBlock);
export class AutoToolChoice extends S.Class<AutoToolChoice>("AutoToolChoice")(
  {},
) {}
export class AnyToolChoice extends S.Class<AnyToolChoice>("AnyToolChoice")(
  {},
) {}
export const RerankingMetadataSelectiveModeConfiguration = S.Union(
  S.Struct({ fieldsToInclude: FieldsForReranking }),
  S.Struct({ fieldsToExclude: FieldsForReranking }),
);
export class TextPromptTemplateConfiguration extends S.Class<TextPromptTemplateConfiguration>(
  "TextPromptTemplateConfiguration",
)({
  text: S.String,
  cachePoint: S.optional(CachePointBlock),
  inputVariables: S.optional(PromptInputVariablesList),
}) {}
export const ContentBlock = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ cachePoint: CachePointBlock }),
);
export const ContentBlocks = S.Array(ContentBlock);
export class MetadataConfigurationForReranking extends S.Class<MetadataConfigurationForReranking>(
  "MetadataConfigurationForReranking",
)({
  selectionMode: S.String,
  selectiveModeConfiguration: S.optional(
    RerankingMetadataSelectiveModeConfiguration,
  ),
}) {}
export class Message extends S.Class<Message>("Message")({
  role: S.String,
  content: ContentBlocks,
}) {}
export const Messages = S.Array(Message);
export class VectorSearchBedrockRerankingConfiguration extends S.Class<VectorSearchBedrockRerankingConfiguration>(
  "VectorSearchBedrockRerankingConfiguration",
)({
  modelConfiguration: VectorSearchBedrockRerankingModelConfiguration,
  numberOfRerankedResults: S.optional(S.Number),
  metadataConfiguration: S.optional(MetadataConfigurationForReranking),
}) {}
export class SpecificToolChoice extends S.Class<SpecificToolChoice>(
  "SpecificToolChoice",
)({ name: S.String }) {}
export class VectorSearchRerankingConfiguration extends S.Class<VectorSearchRerankingConfiguration>(
  "VectorSearchRerankingConfiguration",
)({
  type: S.String,
  bedrockRerankingConfiguration: S.optional(
    VectorSearchBedrockRerankingConfiguration,
  ),
}) {}
export const ToolChoice = S.Union(
  S.Struct({ auto: AutoToolChoice }),
  S.Struct({ any: AnyToolChoice }),
  S.Struct({ tool: SpecificToolChoice }),
);
export const ToolInputSchema = S.Union(S.Struct({ json: S.Any }));
export class KnowledgeBaseFlowNodeConfiguration extends S.Class<KnowledgeBaseFlowNodeConfiguration>(
  "KnowledgeBaseFlowNodeConfiguration",
)({
  knowledgeBaseId: S.String,
  modelId: S.optional(S.String),
  guardrailConfiguration: S.optional(GuardrailConfiguration),
  numberOfResults: S.optional(S.Number),
  promptTemplate: S.optional(KnowledgeBasePromptTemplate),
  inferenceConfiguration: S.optional(PromptInferenceConfiguration),
  rerankingConfiguration: S.optional(VectorSearchRerankingConfiguration),
  orchestrationConfiguration: S.optional(
    KnowledgeBaseOrchestrationConfiguration,
  ),
}) {}
export class ToolSpecification extends S.Class<ToolSpecification>(
  "ToolSpecification",
)({
  name: S.String,
  description: S.optional(S.String),
  inputSchema: ToolInputSchema,
}) {}
export const Tool = S.Union(
  S.Struct({ toolSpec: ToolSpecification }),
  S.Struct({ cachePoint: CachePointBlock }),
);
export const Tools = S.Array(Tool);
export class ToolConfiguration extends S.Class<ToolConfiguration>(
  "ToolConfiguration",
)({ tools: Tools, toolChoice: S.optional(ToolChoice) }) {}
export class ChatPromptTemplateConfiguration extends S.Class<ChatPromptTemplateConfiguration>(
  "ChatPromptTemplateConfiguration",
)({
  messages: Messages,
  system: S.optional(SystemContentBlocks),
  inputVariables: S.optional(PromptInputVariablesList),
  toolConfiguration: S.optional(ToolConfiguration),
}) {}
export const PromptTemplateConfiguration = S.Union(
  S.Struct({ text: TextPromptTemplateConfiguration }),
  S.Struct({ chat: ChatPromptTemplateConfiguration }),
);
export class PromptFlowNodeInlineConfiguration extends S.Class<PromptFlowNodeInlineConfiguration>(
  "PromptFlowNodeInlineConfiguration",
)({
  templateType: S.String,
  templateConfiguration: PromptTemplateConfiguration,
  modelId: S.String,
  inferenceConfiguration: S.optional(PromptInferenceConfiguration),
  additionalModelRequestFields: S.optional(S.Any),
}) {}
export const PromptFlowNodeSourceConfiguration = S.Union(
  S.Struct({ resource: PromptFlowNodeResourceConfiguration }),
  S.Struct({ inline: PromptFlowNodeInlineConfiguration }),
);
export class PromptFlowNodeConfiguration extends S.Class<PromptFlowNodeConfiguration>(
  "PromptFlowNodeConfiguration",
)({
  sourceConfiguration: PromptFlowNodeSourceConfiguration,
  guardrailConfiguration: S.optional(GuardrailConfiguration),
}) {}
export type FlowNodeConfiguration =
  | { input: InputFlowNodeConfiguration }
  | { output: OutputFlowNodeConfiguration }
  | { knowledgeBase: KnowledgeBaseFlowNodeConfiguration }
  | { condition: ConditionFlowNodeConfiguration }
  | { lex: LexFlowNodeConfiguration }
  | { prompt: PromptFlowNodeConfiguration }
  | { lambdaFunction: LambdaFunctionFlowNodeConfiguration }
  | { storage: StorageFlowNodeConfiguration }
  | { agent: AgentFlowNodeConfiguration }
  | { retrieval: RetrievalFlowNodeConfiguration }
  | { iterator: IteratorFlowNodeConfiguration }
  | { collector: CollectorFlowNodeConfiguration }
  | { inlineCode: InlineCodeFlowNodeConfiguration }
  | { loop: LoopFlowNodeConfiguration }
  | { loopInput: LoopInputFlowNodeConfiguration }
  | { loopController: LoopControllerFlowNodeConfiguration };
export const FlowNodeConfiguration = S.Union(
  S.Struct({ input: InputFlowNodeConfiguration }),
  S.Struct({ output: OutputFlowNodeConfiguration }),
  S.Struct({ knowledgeBase: KnowledgeBaseFlowNodeConfiguration }),
  S.Struct({ condition: ConditionFlowNodeConfiguration }),
  S.Struct({ lex: LexFlowNodeConfiguration }),
  S.Struct({ prompt: PromptFlowNodeConfiguration }),
  S.Struct({ lambdaFunction: LambdaFunctionFlowNodeConfiguration }),
  S.Struct({ storage: StorageFlowNodeConfiguration }),
  S.Struct({ agent: AgentFlowNodeConfiguration }),
  S.Struct({ retrieval: RetrievalFlowNodeConfiguration }),
  S.Struct({ iterator: IteratorFlowNodeConfiguration }),
  S.Struct({ collector: CollectorFlowNodeConfiguration }),
  S.Struct({ inlineCode: InlineCodeFlowNodeConfiguration }),
  S.Struct({
    loop: S.suspend(
      (): S.Schema<LoopFlowNodeConfiguration, any> => LoopFlowNodeConfiguration,
    ),
  }),
  S.Struct({ loopInput: LoopInputFlowNodeConfiguration }),
  S.Struct({ loopController: LoopControllerFlowNodeConfiguration }),
) as any as S.Schema<FlowNodeConfiguration>;
export class FlowNode extends S.Class<FlowNode>("FlowNode")({
  name: S.String,
  type: S.String,
  configuration: S.optional(S.suspend(() => FlowNodeConfiguration)),
  inputs: S.optional(FlowNodeInputs),
  outputs: S.optional(FlowNodeOutputs),
}) {}
export type FlowNodes = FlowNode[];
export const FlowNodes = S.Array(
  S.suspend((): S.Schema<FlowNode, any> => FlowNode),
) as any as S.Schema<FlowNodes>;
export class FlowDefinition extends S.Class<FlowDefinition>("FlowDefinition")({
  nodes: S.optional(S.suspend(() => FlowNodes)),
  connections: S.optional(FlowConnections),
}) {}
export class ValidateFlowDefinitionRequest extends S.Class<ValidateFlowDefinitionRequest>(
  "ValidateFlowDefinitionRequest",
)(
  { definition: FlowDefinition },
  T.all(
    T.Http({ method: "POST", uri: "/flows/validate-definition" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MissingEndingNodesFlowValidationDetails extends S.Class<MissingEndingNodesFlowValidationDetails>(
  "MissingEndingNodesFlowValidationDetails",
)({}) {}
export class MissingStartingNodesFlowValidationDetails extends S.Class<MissingStartingNodesFlowValidationDetails>(
  "MissingStartingNodesFlowValidationDetails",
)({}) {}
export class UnspecifiedFlowValidationDetails extends S.Class<UnspecifiedFlowValidationDetails>(
  "UnspecifiedFlowValidationDetails",
)({}) {}
export class CyclicConnectionFlowValidationDetails extends S.Class<CyclicConnectionFlowValidationDetails>(
  "CyclicConnectionFlowValidationDetails",
)({ connection: S.String }) {}
export class DuplicateConnectionsFlowValidationDetails extends S.Class<DuplicateConnectionsFlowValidationDetails>(
  "DuplicateConnectionsFlowValidationDetails",
)({ source: S.String, target: S.String }) {}
export class DuplicateConditionExpressionFlowValidationDetails extends S.Class<DuplicateConditionExpressionFlowValidationDetails>(
  "DuplicateConditionExpressionFlowValidationDetails",
)({ node: S.String, expression: S.String }) {}
export class UnreachableNodeFlowValidationDetails extends S.Class<UnreachableNodeFlowValidationDetails>(
  "UnreachableNodeFlowValidationDetails",
)({ node: S.String }) {}
export class UnknownConnectionSourceFlowValidationDetails extends S.Class<UnknownConnectionSourceFlowValidationDetails>(
  "UnknownConnectionSourceFlowValidationDetails",
)({ connection: S.String }) {}
export class UnknownConnectionSourceOutputFlowValidationDetails extends S.Class<UnknownConnectionSourceOutputFlowValidationDetails>(
  "UnknownConnectionSourceOutputFlowValidationDetails",
)({ connection: S.String }) {}
export class UnknownConnectionTargetFlowValidationDetails extends S.Class<UnknownConnectionTargetFlowValidationDetails>(
  "UnknownConnectionTargetFlowValidationDetails",
)({ connection: S.String }) {}
export class UnknownConnectionTargetInputFlowValidationDetails extends S.Class<UnknownConnectionTargetInputFlowValidationDetails>(
  "UnknownConnectionTargetInputFlowValidationDetails",
)({ connection: S.String }) {}
export class UnknownConnectionConditionFlowValidationDetails extends S.Class<UnknownConnectionConditionFlowValidationDetails>(
  "UnknownConnectionConditionFlowValidationDetails",
)({ connection: S.String }) {}
export class MalformedConditionExpressionFlowValidationDetails extends S.Class<MalformedConditionExpressionFlowValidationDetails>(
  "MalformedConditionExpressionFlowValidationDetails",
)({ node: S.String, condition: S.String, cause: S.String }) {}
export class MalformedNodeInputExpressionFlowValidationDetails extends S.Class<MalformedNodeInputExpressionFlowValidationDetails>(
  "MalformedNodeInputExpressionFlowValidationDetails",
)({ node: S.String, input: S.String, cause: S.String }) {}
export class MismatchedNodeInputTypeFlowValidationDetails extends S.Class<MismatchedNodeInputTypeFlowValidationDetails>(
  "MismatchedNodeInputTypeFlowValidationDetails",
)({ node: S.String, input: S.String, expectedType: S.String }) {}
export class MismatchedNodeOutputTypeFlowValidationDetails extends S.Class<MismatchedNodeOutputTypeFlowValidationDetails>(
  "MismatchedNodeOutputTypeFlowValidationDetails",
)({ node: S.String, output: S.String, expectedType: S.String }) {}
export class IncompatibleConnectionDataTypeFlowValidationDetails extends S.Class<IncompatibleConnectionDataTypeFlowValidationDetails>(
  "IncompatibleConnectionDataTypeFlowValidationDetails",
)({ connection: S.String }) {}
export class MissingConnectionConfigurationFlowValidationDetails extends S.Class<MissingConnectionConfigurationFlowValidationDetails>(
  "MissingConnectionConfigurationFlowValidationDetails",
)({ connection: S.String }) {}
export class MissingDefaultConditionFlowValidationDetails extends S.Class<MissingDefaultConditionFlowValidationDetails>(
  "MissingDefaultConditionFlowValidationDetails",
)({ node: S.String }) {}
export class MissingNodeConfigurationFlowValidationDetails extends S.Class<MissingNodeConfigurationFlowValidationDetails>(
  "MissingNodeConfigurationFlowValidationDetails",
)({ node: S.String }) {}
export class MissingNodeInputFlowValidationDetails extends S.Class<MissingNodeInputFlowValidationDetails>(
  "MissingNodeInputFlowValidationDetails",
)({ node: S.String, input: S.String }) {}
export class MissingNodeOutputFlowValidationDetails extends S.Class<MissingNodeOutputFlowValidationDetails>(
  "MissingNodeOutputFlowValidationDetails",
)({ node: S.String, output: S.String }) {}
export class MultipleNodeInputConnectionsFlowValidationDetails extends S.Class<MultipleNodeInputConnectionsFlowValidationDetails>(
  "MultipleNodeInputConnectionsFlowValidationDetails",
)({ node: S.String, input: S.String }) {}
export class UnfulfilledNodeInputFlowValidationDetails extends S.Class<UnfulfilledNodeInputFlowValidationDetails>(
  "UnfulfilledNodeInputFlowValidationDetails",
)({ node: S.String, input: S.String }) {}
export class UnsatisfiedConnectionConditionsFlowValidationDetails extends S.Class<UnsatisfiedConnectionConditionsFlowValidationDetails>(
  "UnsatisfiedConnectionConditionsFlowValidationDetails",
)({ connection: S.String }) {}
export class UnknownNodeInputFlowValidationDetails extends S.Class<UnknownNodeInputFlowValidationDetails>(
  "UnknownNodeInputFlowValidationDetails",
)({ node: S.String, input: S.String }) {}
export class UnknownNodeOutputFlowValidationDetails extends S.Class<UnknownNodeOutputFlowValidationDetails>(
  "UnknownNodeOutputFlowValidationDetails",
)({ node: S.String, output: S.String }) {}
export class MissingLoopInputNodeFlowValidationDetails extends S.Class<MissingLoopInputNodeFlowValidationDetails>(
  "MissingLoopInputNodeFlowValidationDetails",
)({ loopNode: S.String }) {}
export class MissingLoopControllerNodeFlowValidationDetails extends S.Class<MissingLoopControllerNodeFlowValidationDetails>(
  "MissingLoopControllerNodeFlowValidationDetails",
)({ loopNode: S.String }) {}
export class MultipleLoopInputNodesFlowValidationDetails extends S.Class<MultipleLoopInputNodesFlowValidationDetails>(
  "MultipleLoopInputNodesFlowValidationDetails",
)({ loopNode: S.String }) {}
export class MultipleLoopControllerNodesFlowValidationDetails extends S.Class<MultipleLoopControllerNodesFlowValidationDetails>(
  "MultipleLoopControllerNodesFlowValidationDetails",
)({ loopNode: S.String }) {}
export class LoopIncompatibleNodeTypeFlowValidationDetails extends S.Class<LoopIncompatibleNodeTypeFlowValidationDetails>(
  "LoopIncompatibleNodeTypeFlowValidationDetails",
)({
  node: S.String,
  incompatibleNodeType: S.String,
  incompatibleNodeName: S.String,
}) {}
export class InvalidLoopBoundaryFlowValidationDetails extends S.Class<InvalidLoopBoundaryFlowValidationDetails>(
  "InvalidLoopBoundaryFlowValidationDetails",
)({ connection: S.String, source: S.String, target: S.String }) {}
export const FlowValidationDetails = S.Union(
  S.Struct({ cyclicConnection: CyclicConnectionFlowValidationDetails }),
  S.Struct({ duplicateConnections: DuplicateConnectionsFlowValidationDetails }),
  S.Struct({
    duplicateConditionExpression:
      DuplicateConditionExpressionFlowValidationDetails,
  }),
  S.Struct({ unreachableNode: UnreachableNodeFlowValidationDetails }),
  S.Struct({
    unknownConnectionSource: UnknownConnectionSourceFlowValidationDetails,
  }),
  S.Struct({
    unknownConnectionSourceOutput:
      UnknownConnectionSourceOutputFlowValidationDetails,
  }),
  S.Struct({
    unknownConnectionTarget: UnknownConnectionTargetFlowValidationDetails,
  }),
  S.Struct({
    unknownConnectionTargetInput:
      UnknownConnectionTargetInputFlowValidationDetails,
  }),
  S.Struct({
    unknownConnectionCondition: UnknownConnectionConditionFlowValidationDetails,
  }),
  S.Struct({
    malformedConditionExpression:
      MalformedConditionExpressionFlowValidationDetails,
  }),
  S.Struct({
    malformedNodeInputExpression:
      MalformedNodeInputExpressionFlowValidationDetails,
  }),
  S.Struct({
    mismatchedNodeInputType: MismatchedNodeInputTypeFlowValidationDetails,
  }),
  S.Struct({
    mismatchedNodeOutputType: MismatchedNodeOutputTypeFlowValidationDetails,
  }),
  S.Struct({
    incompatibleConnectionDataType:
      IncompatibleConnectionDataTypeFlowValidationDetails,
  }),
  S.Struct({
    missingConnectionConfiguration:
      MissingConnectionConfigurationFlowValidationDetails,
  }),
  S.Struct({
    missingDefaultCondition: MissingDefaultConditionFlowValidationDetails,
  }),
  S.Struct({ missingEndingNodes: MissingEndingNodesFlowValidationDetails }),
  S.Struct({
    missingNodeConfiguration: MissingNodeConfigurationFlowValidationDetails,
  }),
  S.Struct({ missingNodeInput: MissingNodeInputFlowValidationDetails }),
  S.Struct({ missingNodeOutput: MissingNodeOutputFlowValidationDetails }),
  S.Struct({ missingStartingNodes: MissingStartingNodesFlowValidationDetails }),
  S.Struct({
    multipleNodeInputConnections:
      MultipleNodeInputConnectionsFlowValidationDetails,
  }),
  S.Struct({ unfulfilledNodeInput: UnfulfilledNodeInputFlowValidationDetails }),
  S.Struct({
    unsatisfiedConnectionConditions:
      UnsatisfiedConnectionConditionsFlowValidationDetails,
  }),
  S.Struct({ unspecified: UnspecifiedFlowValidationDetails }),
  S.Struct({ unknownNodeInput: UnknownNodeInputFlowValidationDetails }),
  S.Struct({ unknownNodeOutput: UnknownNodeOutputFlowValidationDetails }),
  S.Struct({ missingLoopInputNode: MissingLoopInputNodeFlowValidationDetails }),
  S.Struct({
    missingLoopControllerNode: MissingLoopControllerNodeFlowValidationDetails,
  }),
  S.Struct({
    multipleLoopInputNodes: MultipleLoopInputNodesFlowValidationDetails,
  }),
  S.Struct({
    multipleLoopControllerNodes:
      MultipleLoopControllerNodesFlowValidationDetails,
  }),
  S.Struct({
    loopIncompatibleNodeType: LoopIncompatibleNodeTypeFlowValidationDetails,
  }),
  S.Struct({ invalidLoopBoundary: InvalidLoopBoundaryFlowValidationDetails }),
);
export class FlowValidation extends S.Class<FlowValidation>("FlowValidation")({
  message: S.String,
  severity: S.String,
  details: S.optional(FlowValidationDetails),
  type: S.optional(S.String),
}) {}
export const FlowValidations = S.Array(FlowValidation);
export class ValidateFlowDefinitionResponse extends S.Class<ValidateFlowDefinitionResponse>(
  "ValidateFlowDefinitionResponse",
)({ validations: FlowValidations }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Validates the definition of a flow.
 */
export const validateFlowDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ValidateFlowDefinitionRequest,
    output: ValidateFlowDefinitionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
