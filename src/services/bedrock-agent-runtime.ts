import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Bedrock Agent Runtime",
  serviceShapeName: "AmazonBedrockAgentRunTimeService",
});
const auth = T.AwsAuthSigv4({ name: "bedrock" });
const ver = T.ServiceVersion("2023-07-26");
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
                                url: "https://bedrock-agent-runtime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://bedrock-agent-runtime-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://bedrock-agent-runtime.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://bedrock-agent-runtime.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetExecutionFlowSnapshotRequest extends S.Class<GetExecutionFlowSnapshotRequest>(
  "GetExecutionFlowSnapshotRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    executionIdentifier: S.String.pipe(T.HttpLabel("executionIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/flows/{flowIdentifier}/aliases/{flowAliasIdentifier}/executions/{executionIdentifier}/flowsnapshot",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFlowExecutionRequest extends S.Class<GetFlowExecutionRequest>(
  "GetFlowExecutionRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    executionIdentifier: S.String.pipe(T.HttpLabel("executionIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/flows/{flowIdentifier}/aliases/{flowAliasIdentifier}/executions/{executionIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFlowExecutionEventsRequest extends S.Class<ListFlowExecutionEventsRequest>(
  "ListFlowExecutionEventsRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    executionIdentifier: S.String.pipe(T.HttpLabel("executionIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    eventType: S.String.pipe(T.HttpQuery("eventType")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/flows/{flowIdentifier}/aliases/{flowAliasIdentifier}/executions/{executionIdentifier}/events",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFlowExecutionsRequest extends S.Class<ListFlowExecutionsRequest>(
  "ListFlowExecutionsRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("flowAliasIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/flows/{flowIdentifier}/executions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopFlowExecutionRequest extends S.Class<StopFlowExecutionRequest>(
  "StopFlowExecutionRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    executionIdentifier: S.String.pipe(T.HttpLabel("executionIdentifier")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/flows/{flowIdentifier}/aliases/{flowAliasIdentifier}/executions/{executionIdentifier}/stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FlowInputContent = S.Union(S.Struct({ document: S.Any }));
export class FlowInput extends S.Class<FlowInput>("FlowInput")({
  nodeName: S.String,
  nodeOutputName: S.optional(S.String),
  content: FlowInputContent,
  nodeInputName: S.optional(S.String),
}) {}
export const FlowInputs = S.Array(FlowInput);
export class PerformanceConfiguration extends S.Class<PerformanceConfiguration>(
  "PerformanceConfiguration",
)({ latency: S.optional(S.String) }) {}
export class ModelPerformanceConfiguration extends S.Class<ModelPerformanceConfiguration>(
  "ModelPerformanceConfiguration",
)({ performanceConfig: S.optional(PerformanceConfiguration) }) {}
export class InvokeFlowRequest extends S.Class<InvokeFlowRequest>(
  "InvokeFlowRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    inputs: FlowInputs,
    enableTrace: S.optional(S.Boolean),
    modelPerformanceConfiguration: S.optional(ModelPerformanceConfiguration),
    executionId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/flows/{flowIdentifier}/aliases/{flowAliasIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAgentMemoryRequest extends S.Class<DeleteAgentMemoryRequest>(
  "DeleteAgentMemoryRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
    memoryId: S.optional(S.String).pipe(T.HttpQuery("memoryId")),
    sessionId: S.optional(S.String).pipe(T.HttpQuery("sessionId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/agents/{agentId}/agentAliases/{agentAliasId}/memories",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAgentMemoryResponse extends S.Class<DeleteAgentMemoryResponse>(
  "DeleteAgentMemoryResponse",
)({}) {}
export class GetAgentMemoryRequest extends S.Class<GetAgentMemoryRequest>(
  "GetAgentMemoryRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
    memoryType: S.String.pipe(T.HttpQuery("memoryType")),
    memoryId: S.String.pipe(T.HttpQuery("memoryId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/agents/{agentId}/agentAliases/{agentAliasId}/memories",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RetrieveAndGenerateInput extends S.Class<RetrieveAndGenerateInput>(
  "RetrieveAndGenerateInput",
)({ text: S.String }) {}
export class FilterAttribute extends S.Class<FilterAttribute>(
  "FilterAttribute",
)({ key: S.String, value: S.Any }) {}
export type RetrievalFilter =
  | { equals: FilterAttribute }
  | { notEquals: FilterAttribute }
  | { greaterThan: FilterAttribute }
  | { greaterThanOrEquals: FilterAttribute }
  | { lessThan: FilterAttribute }
  | { lessThanOrEquals: FilterAttribute }
  | { in: FilterAttribute }
  | { notIn: FilterAttribute }
  | { startsWith: FilterAttribute }
  | { listContains: FilterAttribute }
  | { stringContains: FilterAttribute }
  | { andAll: RetrievalFilterList }
  | { orAll: RetrievalFilterList };
export const RetrievalFilter = S.Union(
  S.Struct({ equals: FilterAttribute }),
  S.Struct({ notEquals: FilterAttribute }),
  S.Struct({ greaterThan: FilterAttribute }),
  S.Struct({ greaterThanOrEquals: FilterAttribute }),
  S.Struct({ lessThan: FilterAttribute }),
  S.Struct({ lessThanOrEquals: FilterAttribute }),
  S.Struct({ in: FilterAttribute }),
  S.Struct({ notIn: FilterAttribute }),
  S.Struct({ startsWith: FilterAttribute }),
  S.Struct({ listContains: FilterAttribute }),
  S.Struct({ stringContains: FilterAttribute }),
  S.Struct({ andAll: S.suspend(() => RetrievalFilterList) }),
  S.Struct({ orAll: S.suspend(() => RetrievalFilterList) }),
) as any as S.Schema<RetrievalFilter>;
export const AdditionalModelRequestFields = S.Record({
  key: S.String,
  value: S.Any,
});
export class VectorSearchBedrockRerankingModelConfiguration extends S.Class<VectorSearchBedrockRerankingModelConfiguration>(
  "VectorSearchBedrockRerankingModelConfiguration",
)({
  modelArn: S.String,
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
}) {}
export class FieldForReranking extends S.Class<FieldForReranking>(
  "FieldForReranking",
)({ fieldName: S.String }) {}
export const FieldsForReranking = S.Array(FieldForReranking);
export const RerankingMetadataSelectiveModeConfiguration = S.Union(
  S.Struct({ fieldsToInclude: FieldsForReranking }),
  S.Struct({ fieldsToExclude: FieldsForReranking }),
);
export class MetadataConfigurationForReranking extends S.Class<MetadataConfigurationForReranking>(
  "MetadataConfigurationForReranking",
)({
  selectionMode: S.String,
  selectiveModeConfiguration: S.optional(
    RerankingMetadataSelectiveModeConfiguration,
  ),
}) {}
export class VectorSearchBedrockRerankingConfiguration extends S.Class<VectorSearchBedrockRerankingConfiguration>(
  "VectorSearchBedrockRerankingConfiguration",
)({
  modelConfiguration: VectorSearchBedrockRerankingModelConfiguration,
  numberOfRerankedResults: S.optional(S.Number),
  metadataConfiguration: S.optional(MetadataConfigurationForReranking),
}) {}
export class VectorSearchRerankingConfiguration extends S.Class<VectorSearchRerankingConfiguration>(
  "VectorSearchRerankingConfiguration",
)({
  type: S.String,
  bedrockRerankingConfiguration: S.optional(
    VectorSearchBedrockRerankingConfiguration,
  ),
}) {}
export class MetadataAttributeSchema extends S.Class<MetadataAttributeSchema>(
  "MetadataAttributeSchema",
)({ key: S.String, type: S.String, description: S.String }) {}
export const MetadataAttributeSchemaList = S.Array(MetadataAttributeSchema);
export class ImplicitFilterConfiguration extends S.Class<ImplicitFilterConfiguration>(
  "ImplicitFilterConfiguration",
)({ metadataAttributes: MetadataAttributeSchemaList, modelArn: S.String }) {}
export class KnowledgeBaseVectorSearchConfiguration extends S.Class<KnowledgeBaseVectorSearchConfiguration>(
  "KnowledgeBaseVectorSearchConfiguration",
)({
  numberOfResults: S.optional(S.Number),
  overrideSearchType: S.optional(S.String),
  filter: S.optional(RetrievalFilter),
  rerankingConfiguration: S.optional(VectorSearchRerankingConfiguration),
  implicitFilterConfiguration: S.optional(ImplicitFilterConfiguration),
}) {}
export class KnowledgeBaseRetrievalConfiguration extends S.Class<KnowledgeBaseRetrievalConfiguration>(
  "KnowledgeBaseRetrievalConfiguration",
)({ vectorSearchConfiguration: KnowledgeBaseVectorSearchConfiguration }) {}
export class PromptTemplate extends S.Class<PromptTemplate>("PromptTemplate")({
  textPromptTemplate: S.optional(S.String),
}) {}
export class GuardrailConfiguration extends S.Class<GuardrailConfiguration>(
  "GuardrailConfiguration",
)({ guardrailId: S.String, guardrailVersion: S.String }) {}
export const RAGStopSequences = S.Array(S.String);
export class TextInferenceConfig extends S.Class<TextInferenceConfig>(
  "TextInferenceConfig",
)({
  temperature: S.optional(S.Number),
  topP: S.optional(S.Number),
  maxTokens: S.optional(S.Number),
  stopSequences: S.optional(RAGStopSequences),
}) {}
export class InferenceConfig extends S.Class<InferenceConfig>(
  "InferenceConfig",
)({ textInferenceConfig: S.optional(TextInferenceConfig) }) {}
export class GenerationConfiguration extends S.Class<GenerationConfiguration>(
  "GenerationConfiguration",
)({
  promptTemplate: S.optional(PromptTemplate),
  guardrailConfiguration: S.optional(GuardrailConfiguration),
  inferenceConfig: S.optional(InferenceConfig),
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
  performanceConfig: S.optional(PerformanceConfiguration),
}) {}
export class QueryTransformationConfiguration extends S.Class<QueryTransformationConfiguration>(
  "QueryTransformationConfiguration",
)({ type: S.String }) {}
export class OrchestrationConfiguration extends S.Class<OrchestrationConfiguration>(
  "OrchestrationConfiguration",
)({
  promptTemplate: S.optional(PromptTemplate),
  inferenceConfig: S.optional(InferenceConfig),
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
  queryTransformationConfiguration: S.optional(
    QueryTransformationConfiguration,
  ),
  performanceConfig: S.optional(PerformanceConfiguration),
}) {}
export class KnowledgeBaseRetrieveAndGenerateConfiguration extends S.Class<KnowledgeBaseRetrieveAndGenerateConfiguration>(
  "KnowledgeBaseRetrieveAndGenerateConfiguration",
)({
  knowledgeBaseId: S.String,
  modelArn: S.String,
  retrievalConfiguration: S.optional(KnowledgeBaseRetrievalConfiguration),
  generationConfiguration: S.optional(GenerationConfiguration),
  orchestrationConfiguration: S.optional(OrchestrationConfiguration),
}) {}
export class S3ObjectDoc extends S.Class<S3ObjectDoc>("S3ObjectDoc")({
  uri: S.String,
}) {}
export class ByteContentDoc extends S.Class<ByteContentDoc>("ByteContentDoc")({
  identifier: S.String,
  contentType: S.String,
  data: T.Blob,
}) {}
export class ExternalSource extends S.Class<ExternalSource>("ExternalSource")({
  sourceType: S.String,
  s3Location: S.optional(S3ObjectDoc),
  byteContent: S.optional(ByteContentDoc),
}) {}
export const ExternalSources = S.Array(ExternalSource);
export class ExternalSourcesGenerationConfiguration extends S.Class<ExternalSourcesGenerationConfiguration>(
  "ExternalSourcesGenerationConfiguration",
)({
  promptTemplate: S.optional(PromptTemplate),
  guardrailConfiguration: S.optional(GuardrailConfiguration),
  inferenceConfig: S.optional(InferenceConfig),
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
  performanceConfig: S.optional(PerformanceConfiguration),
}) {}
export class ExternalSourcesRetrieveAndGenerateConfiguration extends S.Class<ExternalSourcesRetrieveAndGenerateConfiguration>(
  "ExternalSourcesRetrieveAndGenerateConfiguration",
)({
  modelArn: S.String,
  sources: ExternalSources,
  generationConfiguration: S.optional(ExternalSourcesGenerationConfiguration),
}) {}
export class RetrieveAndGenerateConfiguration extends S.Class<RetrieveAndGenerateConfiguration>(
  "RetrieveAndGenerateConfiguration",
)({
  type: S.String,
  knowledgeBaseConfiguration: S.optional(
    KnowledgeBaseRetrieveAndGenerateConfiguration,
  ),
  externalSourcesConfiguration: S.optional(
    ExternalSourcesRetrieveAndGenerateConfiguration,
  ),
}) {}
export class RetrieveAndGenerateSessionConfiguration extends S.Class<RetrieveAndGenerateSessionConfiguration>(
  "RetrieveAndGenerateSessionConfiguration",
)({ kmsKeyArn: S.String }) {}
export class RetrieveAndGenerateStreamRequest extends S.Class<RetrieveAndGenerateStreamRequest>(
  "RetrieveAndGenerateStreamRequest",
)(
  {
    sessionId: S.optional(S.String),
    input: RetrieveAndGenerateInput,
    retrieveAndGenerateConfiguration: S.optional(
      RetrieveAndGenerateConfiguration,
    ),
    sessionConfiguration: S.optional(RetrieveAndGenerateSessionConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/retrieveAndGenerateStream" }),
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
  { sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/sessions/{sessionIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SessionMetadataMap = S.Record({ key: S.String, value: S.String });
export class UpdateSessionRequest extends S.Class<UpdateSessionRequest>(
  "UpdateSessionRequest",
)(
  {
    sessionMetadata: S.optional(SessionMetadataMap),
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/sessions/{sessionIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSessionRequest extends S.Class<DeleteSessionRequest>(
  "DeleteSessionRequest",
)(
  { sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/sessions/{sessionIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSessionResponse extends S.Class<DeleteSessionResponse>(
  "DeleteSessionResponse",
)({}) {}
export class ListSessionsRequest extends S.Class<ListSessionsRequest>(
  "ListSessionsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/sessions/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EndSessionRequest extends S.Class<EndSessionRequest>(
  "EndSessionRequest",
)(
  { sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")) },
  T.all(
    T.Http({ method: "PATCH", uri: "/sessions/{sessionIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateInvocationRequest extends S.Class<CreateInvocationRequest>(
  "CreateInvocationRequest",
)(
  {
    invocationId: S.optional(S.String),
    description: S.optional(S.String),
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/sessions/{sessionIdentifier}/invocations/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInvocationsRequest extends S.Class<ListInvocationsRequest>(
  "ListInvocationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sessions/{sessionIdentifier}/invocations/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInvocationStepRequest extends S.Class<GetInvocationStepRequest>(
  "GetInvocationStepRequest",
)(
  {
    invocationIdentifier: S.String,
    invocationStepId: S.String.pipe(T.HttpLabel("invocationStepId")),
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sessions/{sessionIdentifier}/invocationSteps/{invocationStepId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInvocationStepsRequest extends S.Class<ListInvocationStepsRequest>(
  "ListInvocationStepsRequest",
)(
  {
    invocationIdentifier: S.optional(S.String),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/sessions/{sessionIdentifier}/invocationSteps/",
    }),
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
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagsMap },
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
export class QueryGenerationInput extends S.Class<QueryGenerationInput>(
  "QueryGenerationInput",
)({ type: S.String, text: S.String }) {}
export class BedrockModelConfigurations extends S.Class<BedrockModelConfigurations>(
  "BedrockModelConfigurations",
)({ performanceConfig: S.optional(PerformanceConfiguration) }) {}
export class StreamingConfigurations extends S.Class<StreamingConfigurations>(
  "StreamingConfigurations",
)({
  streamFinalResponse: S.optional(S.Boolean),
  applyGuardrailInterval: S.optional(S.Number),
}) {}
export class PromptCreationConfigurations extends S.Class<PromptCreationConfigurations>(
  "PromptCreationConfigurations",
)({
  previousConversationTurnsToInclude: S.optional(S.Number),
  excludePreviousThinkingSteps: S.optional(S.Boolean),
}) {}
export class KnowledgeBase extends S.Class<KnowledgeBase>("KnowledgeBase")({
  knowledgeBaseId: S.String,
  description: S.String,
  retrievalConfiguration: S.optional(KnowledgeBaseRetrievalConfiguration),
}) {}
export const KnowledgeBases = S.Array(KnowledgeBase);
export class GuardrailConfigurationWithArn extends S.Class<GuardrailConfigurationWithArn>(
  "GuardrailConfigurationWithArn",
)({ guardrailIdentifier: S.String, guardrailVersion: S.String }) {}
export class CollaboratorConfiguration extends S.Class<CollaboratorConfiguration>(
  "CollaboratorConfiguration",
)({
  collaboratorName: S.String,
  collaboratorInstruction: S.String,
  agentAliasArn: S.optional(S.String),
  relayConversationHistory: S.optional(S.String),
}) {}
export const CollaboratorConfigurations = S.Array(CollaboratorConfiguration);
export const SessionAttributesMap = S.Record({
  key: S.String,
  value: S.String,
});
export const PromptSessionAttributesMap = S.Record({
  key: S.String,
  value: S.String,
});
export const ImageInputSource = S.Union(S.Struct({ bytes: T.Blob }));
export class ImageInput extends S.Class<ImageInput>("ImageInput")({
  format: S.String,
  source: ImageInputSource,
}) {}
export const ImageInputs = S.Array(ImageInput);
export class ContentBody extends S.Class<ContentBody>("ContentBody")({
  body: S.optional(S.String),
  images: S.optional(ImageInputs),
}) {}
export const ResponseBody = S.Record({ key: S.String, value: ContentBody });
export class ApiResult extends S.Class<ApiResult>("ApiResult")({
  actionGroup: S.String,
  httpMethod: S.optional(S.String),
  apiPath: S.optional(S.String),
  confirmationState: S.optional(S.String),
  responseState: S.optional(S.String),
  httpStatusCode: S.optional(S.Number),
  responseBody: S.optional(ResponseBody),
  agentId: S.optional(S.String),
}) {}
export class FunctionResult extends S.Class<FunctionResult>("FunctionResult")({
  actionGroup: S.String,
  confirmationState: S.optional(S.String),
  function: S.optional(S.String),
  responseBody: S.optional(ResponseBody),
  responseState: S.optional(S.String),
  agentId: S.optional(S.String),
}) {}
export const InvocationResultMember = S.Union(
  S.Struct({ apiResult: ApiResult }),
  S.Struct({ functionResult: FunctionResult }),
);
export const ReturnControlInvocationResults = S.Array(InvocationResultMember);
export class S3ObjectFile extends S.Class<S3ObjectFile>("S3ObjectFile")({
  uri: S.String,
}) {}
export class ByteContentFile extends S.Class<ByteContentFile>(
  "ByteContentFile",
)({ mediaType: S.String, data: T.Blob }) {}
export class FileSource extends S.Class<FileSource>("FileSource")({
  sourceType: S.String,
  s3Location: S.optional(S3ObjectFile),
  byteContent: S.optional(ByteContentFile),
}) {}
export class InputFile extends S.Class<InputFile>("InputFile")({
  name: S.String,
  source: FileSource,
  useCase: S.String,
}) {}
export const InputFiles = S.Array(InputFile);
export const ContentBlock = S.Union(S.Struct({ text: S.String }));
export const ContentBlocks = S.Array(ContentBlock);
export class Message extends S.Class<Message>("Message")({
  role: S.String,
  content: ContentBlocks,
}) {}
export const Messages = S.Array(Message);
export class ConversationHistory extends S.Class<ConversationHistory>(
  "ConversationHistory",
)({ messages: S.optional(Messages) }) {}
export class InlineSessionState extends S.Class<InlineSessionState>(
  "InlineSessionState",
)({
  sessionAttributes: S.optional(SessionAttributesMap),
  promptSessionAttributes: S.optional(PromptSessionAttributesMap),
  returnControlInvocationResults: S.optional(ReturnControlInvocationResults),
  invocationId: S.optional(S.String),
  files: S.optional(InputFiles),
  conversationHistory: S.optional(ConversationHistory),
}) {}
export const ActionGroupExecutor = S.Union(
  S.Struct({ lambda: S.String }),
  S.Struct({ customControl: S.String }),
);
export class S3Identifier extends S.Class<S3Identifier>("S3Identifier")({
  s3BucketName: S.optional(S.String),
  s3ObjectKey: S.optional(S.String),
}) {}
export const APISchema = S.Union(
  S.Struct({ s3: S3Identifier }),
  S.Struct({ payload: S.String }),
);
export class ParameterDetail extends S.Class<ParameterDetail>(
  "ParameterDetail",
)({
  description: S.optional(S.String),
  type: S.String,
  required: S.optional(S.Boolean),
}) {}
export const ParameterMap = S.Record({ key: S.String, value: ParameterDetail });
export class FunctionDefinition extends S.Class<FunctionDefinition>(
  "FunctionDefinition",
)({
  name: S.String,
  description: S.optional(S.String),
  parameters: S.optional(ParameterMap),
  requireConfirmation: S.optional(S.String),
}) {}
export const Functions = S.Array(FunctionDefinition);
export const FunctionSchema = S.Union(S.Struct({ functions: Functions }));
export const ActionGroupSignatureParams = S.Record({
  key: S.String,
  value: S.String,
});
export class AgentActionGroup extends S.Class<AgentActionGroup>(
  "AgentActionGroup",
)({
  actionGroupName: S.String,
  description: S.optional(S.String),
  parentActionGroupSignature: S.optional(S.String),
  actionGroupExecutor: S.optional(ActionGroupExecutor),
  apiSchema: S.optional(APISchema),
  functionSchema: S.optional(FunctionSchema),
  parentActionGroupSignatureParams: S.optional(ActionGroupSignatureParams),
}) {}
export const AgentActionGroups = S.Array(AgentActionGroup);
export const StopSequences = S.Array(S.String);
export class InferenceConfiguration extends S.Class<InferenceConfiguration>(
  "InferenceConfiguration",
)({
  temperature: S.optional(S.Number),
  topP: S.optional(S.Number),
  topK: S.optional(S.Number),
  maximumLength: S.optional(S.Number),
  stopSequences: S.optional(StopSequences),
}) {}
export class PromptConfiguration extends S.Class<PromptConfiguration>(
  "PromptConfiguration",
)({
  promptType: S.optional(S.String),
  promptCreationMode: S.optional(S.String),
  promptState: S.optional(S.String),
  basePromptTemplate: S.optional(S.String),
  inferenceConfiguration: S.optional(InferenceConfiguration),
  parserMode: S.optional(S.String),
  foundationModel: S.optional(S.String),
  additionalModelRequestFields: S.optional(S.Any),
}) {}
export const PromptConfigurations = S.Array(PromptConfiguration);
export class PromptOverrideConfiguration extends S.Class<PromptOverrideConfiguration>(
  "PromptOverrideConfiguration",
)({
  promptConfigurations: PromptConfigurations,
  overrideLambda: S.optional(S.String),
}) {}
export class Collaborator extends S.Class<Collaborator>("Collaborator")({
  customerEncryptionKeyArn: S.optional(S.String),
  foundationModel: S.String,
  instruction: S.String,
  idleSessionTTLInSeconds: S.optional(S.Number),
  actionGroups: S.optional(AgentActionGroups),
  knowledgeBases: S.optional(KnowledgeBases),
  guardrailConfiguration: S.optional(GuardrailConfigurationWithArn),
  promptOverrideConfiguration: S.optional(PromptOverrideConfiguration),
  agentCollaboration: S.optional(S.String),
  collaboratorConfigurations: S.optional(CollaboratorConfigurations),
  agentName: S.optional(S.String),
}) {}
export const Collaborators = S.Array(Collaborator);
export class InlineBedrockModelConfigurations extends S.Class<InlineBedrockModelConfigurations>(
  "InlineBedrockModelConfigurations",
)({ performanceConfig: S.optional(PerformanceConfiguration) }) {}
export class GetExecutionFlowSnapshotResponse extends S.Class<GetExecutionFlowSnapshotResponse>(
  "GetExecutionFlowSnapshotResponse",
)({
  flowIdentifier: S.String,
  flowAliasIdentifier: S.String,
  flowVersion: S.String,
  executionRoleArn: S.String,
  definition: S.String,
  customerEncryptionKeyArn: S.optional(S.String),
}) {}
export class StopFlowExecutionResponse extends S.Class<StopFlowExecutionResponse>(
  "StopFlowExecutionResponse",
)({ executionArn: S.optional(S.String), status: S.String }) {}
export class CreateSessionRequest extends S.Class<CreateSessionRequest>(
  "CreateSessionRequest",
)(
  {
    sessionMetadata: S.optional(SessionMetadataMap),
    encryptionKeyArn: S.optional(S.String),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/sessions/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionResponse extends S.Class<GetSessionResponse>(
  "GetSessionResponse",
)({
  sessionId: S.String,
  sessionArn: S.String,
  sessionStatus: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  sessionMetadata: S.optional(SessionMetadataMap),
  encryptionKeyArn: S.optional(S.String),
}) {}
export class UpdateSessionResponse extends S.Class<UpdateSessionResponse>(
  "UpdateSessionResponse",
)({
  sessionId: S.String,
  sessionArn: S.String,
  sessionStatus: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class EndSessionResponse extends S.Class<EndSessionResponse>(
  "EndSessionResponse",
)({ sessionId: S.String, sessionArn: S.String, sessionStatus: S.String }) {}
export class CreateInvocationResponse extends S.Class<CreateInvocationResponse>(
  "CreateInvocationResponse",
)({
  sessionId: S.String,
  invocationId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class KnowledgeBaseConfiguration extends S.Class<KnowledgeBaseConfiguration>(
  "KnowledgeBaseConfiguration",
)({
  knowledgeBaseId: S.String,
  retrievalConfiguration: KnowledgeBaseRetrievalConfiguration,
}) {}
export const KnowledgeBaseConfigurations = S.Array(KnowledgeBaseConfiguration);
export const OrchestrationExecutor = S.Union(S.Struct({ lambda: S.String }));
export class TextPrompt extends S.Class<TextPrompt>("TextPrompt")({
  text: S.String,
}) {}
export class RerankTextDocument extends S.Class<RerankTextDocument>(
  "RerankTextDocument",
)({ text: S.optional(S.String) }) {}
export class RerankDocument extends S.Class<RerankDocument>("RerankDocument")({
  type: S.String,
  textDocument: S.optional(RerankTextDocument),
  jsonDocument: S.optional(S.Any),
}) {}
export class InputImage extends S.Class<InputImage>("InputImage")({
  format: S.String,
  inlineContent: T.Blob,
}) {}
export type RetrievalFilterList = RetrievalFilter[];
export const RetrievalFilterList = S.Array(
  S.suspend(() => RetrievalFilter),
) as any as S.Schema<RetrievalFilterList>;
export class FlowExecutionError extends S.Class<FlowExecutionError>(
  "FlowExecutionError",
)({
  nodeName: S.optional(S.String),
  error: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const FlowExecutionErrors = S.Array(FlowExecutionError);
export class FlowExecutionSummary extends S.Class<FlowExecutionSummary>(
  "FlowExecutionSummary",
)({
  executionArn: S.String,
  flowAliasIdentifier: S.String,
  flowIdentifier: S.String,
  flowVersion: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const FlowExecutionSummaries = S.Array(FlowExecutionSummary);
export class CustomOrchestration extends S.Class<CustomOrchestration>(
  "CustomOrchestration",
)({ executor: S.optional(OrchestrationExecutor) }) {}
export const InputPrompt = S.Union(S.Struct({ textPrompt: TextPrompt }));
export class RerankQuery extends S.Class<RerankQuery>("RerankQuery")({
  type: S.String,
  textQuery: RerankTextDocument,
}) {}
export const RerankQueriesList = S.Array(RerankQuery);
export class RerankSource extends S.Class<RerankSource>("RerankSource")({
  type: S.String,
  inlineDocumentSource: RerankDocument,
}) {}
export const RerankSourcesList = S.Array(RerankSource);
export class KnowledgeBaseQuery extends S.Class<KnowledgeBaseQuery>(
  "KnowledgeBaseQuery",
)({
  type: S.optional(S.String),
  text: S.optional(S.String),
  image: S.optional(InputImage),
}) {}
export class SessionSummary extends S.Class<SessionSummary>("SessionSummary")({
  sessionId: S.String,
  sessionArn: S.String,
  sessionStatus: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const SessionSummaries = S.Array(SessionSummary);
export class InvocationSummary extends S.Class<InvocationSummary>(
  "InvocationSummary",
)({
  sessionId: S.String,
  invocationId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const InvocationSummaries = S.Array(InvocationSummary);
export class S3Location extends S.Class<S3Location>("S3Location")({
  uri: S.String,
}) {}
export const ImageSource = S.Union(
  S.Struct({ bytes: T.Blob }),
  S.Struct({ s3Location: S3Location }),
);
export class ImageBlock extends S.Class<ImageBlock>("ImageBlock")({
  format: S.String,
  source: ImageSource,
}) {}
export const BedrockSessionContentBlock = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ image: ImageBlock }),
);
export const BedrockSessionContentBlocks = S.Array(BedrockSessionContentBlock);
export const InvocationStepPayload = S.Union(
  S.Struct({ contentBlocks: BedrockSessionContentBlocks }),
);
export class InvocationStep extends S.Class<InvocationStep>("InvocationStep")({
  sessionId: S.String,
  invocationId: S.String,
  invocationStepId: S.String,
  invocationStepTime: S.Date.pipe(T.TimestampFormat("date-time")),
  payload: InvocationStepPayload,
}) {}
export class InvocationStepSummary extends S.Class<InvocationStepSummary>(
  "InvocationStepSummary",
)({
  sessionId: S.String,
  invocationId: S.String,
  invocationStepId: S.String,
  invocationStepTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const InvocationStepSummaries = S.Array(InvocationStepSummary);
export class TextToSqlKnowledgeBaseConfiguration extends S.Class<TextToSqlKnowledgeBaseConfiguration>(
  "TextToSqlKnowledgeBaseConfiguration",
)({ knowledgeBaseArn: S.String }) {}
export class GetFlowExecutionResponse extends S.Class<GetFlowExecutionResponse>(
  "GetFlowExecutionResponse",
)({
  executionArn: S.String,
  status: S.String,
  startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  errors: S.optional(FlowExecutionErrors),
  flowAliasIdentifier: S.String,
  flowIdentifier: S.String,
  flowVersion: S.String,
}) {}
export class ListFlowExecutionsResponse extends S.Class<ListFlowExecutionsResponse>(
  "ListFlowExecutionsResponse",
)({
  flowExecutionSummaries: FlowExecutionSummaries,
  nextToken: S.optional(S.String),
}) {}
export class StartFlowExecutionRequest extends S.Class<StartFlowExecutionRequest>(
  "StartFlowExecutionRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    flowExecutionName: S.optional(S.String),
    inputs: FlowInputs,
    modelPerformanceConfiguration: S.optional(ModelPerformanceConfiguration),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/flows/{flowIdentifier}/aliases/{flowAliasIdentifier}/executions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class OptimizePromptRequest extends S.Class<OptimizePromptRequest>(
  "OptimizePromptRequest",
)(
  { input: InputPrompt, targetModelId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/optimize-prompt" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSessionResponse extends S.Class<CreateSessionResponse>(
  "CreateSessionResponse",
)({
  sessionId: S.String,
  sessionArn: S.String,
  sessionStatus: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListSessionsResponse extends S.Class<ListSessionsResponse>(
  "ListSessionsResponse",
)({ sessionSummaries: SessionSummaries, nextToken: S.optional(S.String) }) {}
export class ListInvocationsResponse extends S.Class<ListInvocationsResponse>(
  "ListInvocationsResponse",
)({
  invocationSummaries: InvocationSummaries,
  nextToken: S.optional(S.String),
}) {}
export class GetInvocationStepResponse extends S.Class<GetInvocationStepResponse>(
  "GetInvocationStepResponse",
)({ invocationStep: InvocationStep }) {}
export class ListInvocationStepsResponse extends S.Class<ListInvocationStepsResponse>(
  "ListInvocationStepsResponse",
)({
  invocationStepSummaries: InvocationStepSummaries,
  nextToken: S.optional(S.String),
}) {}
export class NodeFailureEvent extends S.Class<NodeFailureEvent>(
  "NodeFailureEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  errorCode: S.String,
  errorMessage: S.String,
}) {}
export class FlowFailureEvent extends S.Class<FlowFailureEvent>(
  "FlowFailureEvent",
)({
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  errorCode: S.String,
  errorMessage: S.String,
}) {}
export class NodeActionEvent extends S.Class<NodeActionEvent>(
  "NodeActionEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  requestId: S.String,
  serviceName: S.String,
  operationName: S.String,
  operationRequest: S.optional(S.Any),
  operationResponse: S.optional(S.Any),
}) {}
export class FlowCompletionEvent extends S.Class<FlowCompletionEvent>(
  "FlowCompletionEvent",
)({ completionReason: S.String }) {}
export class TextToSqlConfiguration extends S.Class<TextToSqlConfiguration>(
  "TextToSqlConfiguration",
)({
  type: S.String,
  knowledgeBaseConfiguration: S.optional(TextToSqlKnowledgeBaseConfiguration),
}) {}
export class MemorySessionSummary extends S.Class<MemorySessionSummary>(
  "MemorySessionSummary",
)({
  memoryId: S.optional(S.String),
  sessionId: S.optional(S.String),
  sessionStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  sessionExpiryTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  summaryText: S.optional(S.String),
}) {}
export class RetrieveAndGenerateOutputEvent extends S.Class<RetrieveAndGenerateOutputEvent>(
  "RetrieveAndGenerateOutputEvent",
)({ text: S.String }) {}
export class GuardrailEvent extends S.Class<GuardrailEvent>("GuardrailEvent")({
  action: S.optional(S.String),
}) {}
export class TransformationConfiguration extends S.Class<TransformationConfiguration>(
  "TransformationConfiguration",
)({
  mode: S.String,
  textToSqlConfiguration: S.optional(TextToSqlConfiguration),
}) {}
export const Memory = S.Union(
  S.Struct({ sessionSummary: MemorySessionSummary }),
);
export const Memories = S.Array(Memory);
export const FlowExecutionContent = S.Union(S.Struct({ document: S.Any }));
export class FlowOutputField extends S.Class<FlowOutputField>(
  "FlowOutputField",
)({ name: S.String, content: FlowExecutionContent }) {}
export const FlowOutputFields = S.Array(FlowOutputField);
export class SatisfiedCondition extends S.Class<SatisfiedCondition>(
  "SatisfiedCondition",
)({ conditionName: S.String }) {}
export const SatisfiedConditions = S.Array(SatisfiedCondition);
export const FlowOutputContent = S.Union(S.Struct({ document: S.Any }));
export const FlowMultiTurnInputContent = S.Union(S.Struct({ document: S.Any }));
export class BedrockRerankingModelConfiguration extends S.Class<BedrockRerankingModelConfiguration>(
  "BedrockRerankingModelConfiguration",
)({
  modelArn: S.String,
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
}) {}
export class Span extends S.Class<Span>("Span")({
  start: S.optional(S.Number),
  end: S.optional(S.Number),
}) {}
export class TextResponsePart extends S.Class<TextResponsePart>(
  "TextResponsePart",
)({ text: S.optional(S.String), span: S.optional(Span) }) {}
export class GeneratedResponsePart extends S.Class<GeneratedResponsePart>(
  "GeneratedResponsePart",
)({ textResponsePart: S.optional(TextResponsePart) }) {}
export class VideoSegment extends S.Class<VideoSegment>("VideoSegment")({
  s3Uri: S.String,
  summary: S.optional(S.String),
}) {}
export class AudioSegment extends S.Class<AudioSegment>("AudioSegment")({
  s3Uri: S.String,
  transcription: S.optional(S.String),
}) {}
export class RetrievalResultContentColumn extends S.Class<RetrievalResultContentColumn>(
  "RetrievalResultContentColumn",
)({
  columnName: S.optional(S.String),
  columnValue: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const RetrievalResultContentRow = S.Array(RetrievalResultContentColumn);
export class RetrievalResultContent extends S.Class<RetrievalResultContent>(
  "RetrievalResultContent",
)({
  type: S.optional(S.String),
  text: S.optional(S.String),
  byteContent: S.optional(S.String),
  video: S.optional(VideoSegment),
  audio: S.optional(AudioSegment),
  row: S.optional(RetrievalResultContentRow),
}) {}
export class RetrievalResultS3Location extends S.Class<RetrievalResultS3Location>(
  "RetrievalResultS3Location",
)({ uri: S.optional(S.String) }) {}
export class RetrievalResultWebLocation extends S.Class<RetrievalResultWebLocation>(
  "RetrievalResultWebLocation",
)({ url: S.optional(S.String) }) {}
export class RetrievalResultConfluenceLocation extends S.Class<RetrievalResultConfluenceLocation>(
  "RetrievalResultConfluenceLocation",
)({ url: S.optional(S.String) }) {}
export class RetrievalResultSalesforceLocation extends S.Class<RetrievalResultSalesforceLocation>(
  "RetrievalResultSalesforceLocation",
)({ url: S.optional(S.String) }) {}
export class RetrievalResultSharePointLocation extends S.Class<RetrievalResultSharePointLocation>(
  "RetrievalResultSharePointLocation",
)({ url: S.optional(S.String) }) {}
export class RetrievalResultCustomDocumentLocation extends S.Class<RetrievalResultCustomDocumentLocation>(
  "RetrievalResultCustomDocumentLocation",
)({ id: S.optional(S.String) }) {}
export class RetrievalResultKendraDocumentLocation extends S.Class<RetrievalResultKendraDocumentLocation>(
  "RetrievalResultKendraDocumentLocation",
)({ uri: S.optional(S.String) }) {}
export class RetrievalResultSqlLocation extends S.Class<RetrievalResultSqlLocation>(
  "RetrievalResultSqlLocation",
)({ query: S.optional(S.String) }) {}
export class RetrievalResultLocation extends S.Class<RetrievalResultLocation>(
  "RetrievalResultLocation",
)({
  type: S.String,
  s3Location: S.optional(RetrievalResultS3Location),
  webLocation: S.optional(RetrievalResultWebLocation),
  confluenceLocation: S.optional(RetrievalResultConfluenceLocation),
  salesforceLocation: S.optional(RetrievalResultSalesforceLocation),
  sharePointLocation: S.optional(RetrievalResultSharePointLocation),
  customDocumentLocation: S.optional(RetrievalResultCustomDocumentLocation),
  kendraDocumentLocation: S.optional(RetrievalResultKendraDocumentLocation),
  sqlLocation: S.optional(RetrievalResultSqlLocation),
}) {}
export const RetrievalResultMetadata = S.Record({
  key: S.String,
  value: S.Any,
});
export class RetrievedReference extends S.Class<RetrievedReference>(
  "RetrievedReference",
)({
  content: S.optional(RetrievalResultContent),
  location: S.optional(RetrievalResultLocation),
  metadata: S.optional(RetrievalResultMetadata),
}) {}
export const RetrievedReferences = S.Array(RetrievedReference);
export class Citation extends S.Class<Citation>("Citation")({
  generatedResponsePart: S.optional(GeneratedResponsePart),
  retrievedReferences: S.optional(RetrievedReferences),
}) {}
export class StartFlowExecutionResponse extends S.Class<StartFlowExecutionResponse>(
  "StartFlowExecutionResponse",
)({ executionArn: S.optional(S.String) }) {}
export class GenerateQueryRequest extends S.Class<GenerateQueryRequest>(
  "GenerateQueryRequest",
)(
  {
    queryGenerationInput: QueryGenerationInput,
    transformationConfiguration: TransformationConfiguration,
  },
  T.all(
    T.Http({ method: "POST", uri: "/generateQuery" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAgentMemoryResponse extends S.Class<GetAgentMemoryResponse>(
  "GetAgentMemoryResponse",
)({ nextToken: S.optional(S.String), memoryContents: S.optional(Memories) }) {}
export class FlowExecutionOutputEvent extends S.Class<FlowExecutionOutputEvent>(
  "FlowExecutionOutputEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  fields: FlowOutputFields,
}) {}
export class ConditionResultEvent extends S.Class<ConditionResultEvent>(
  "ConditionResultEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  satisfiedConditions: SatisfiedConditions,
}) {}
export class FlowOutputEvent extends S.Class<FlowOutputEvent>(
  "FlowOutputEvent",
)({ nodeName: S.String, nodeType: S.String, content: FlowOutputContent }) {}
export class FlowMultiTurnInputRequestEvent extends S.Class<FlowMultiTurnInputRequestEvent>(
  "FlowMultiTurnInputRequestEvent",
)({
  nodeName: S.String,
  nodeType: S.String,
  content: FlowMultiTurnInputContent,
}) {}
export class BedrockRerankingConfiguration extends S.Class<BedrockRerankingConfiguration>(
  "BedrockRerankingConfiguration",
)({
  numberOfResults: S.optional(S.Number),
  modelConfiguration: BedrockRerankingModelConfiguration,
}) {}
export const NodeExecutionContent = S.Union(S.Struct({ document: S.Any }));
export class NodeInputSource extends S.Class<NodeInputSource>(
  "NodeInputSource",
)({ nodeName: S.String, outputFieldName: S.String, expression: S.String }) {}
export class NodeInputExecutionChainItem extends S.Class<NodeInputExecutionChainItem>(
  "NodeInputExecutionChainItem",
)({ nodeName: S.String, index: S.optional(S.Number), type: S.String }) {}
export const NodeInputExecutionChain = S.Array(NodeInputExecutionChainItem);
export class NodeOutputNext extends S.Class<NodeOutputNext>("NodeOutputNext")({
  nodeName: S.String,
  inputFieldName: S.String,
}) {}
export const NodeOutputNextList = S.Array(NodeOutputNext);
export class FlowTraceNodeActionEvent extends S.Class<FlowTraceNodeActionEvent>(
  "FlowTraceNodeActionEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  requestId: S.String,
  serviceName: S.String,
  operationName: S.String,
  operationRequest: S.optional(S.Any),
  operationResponse: S.optional(S.Any),
}) {}
export class RerankingConfiguration extends S.Class<RerankingConfiguration>(
  "RerankingConfiguration",
)({
  type: S.String,
  bedrockRerankingConfiguration: BedrockRerankingConfiguration,
}) {}
export class FlowInputField extends S.Class<FlowInputField>("FlowInputField")({
  name: S.String,
  content: FlowExecutionContent,
}) {}
export const FlowInputFields = S.Array(FlowInputField);
export class NodeInputField extends S.Class<NodeInputField>("NodeInputField")({
  name: S.String,
  content: NodeExecutionContent,
  source: S.optional(NodeInputSource),
  type: S.optional(S.String),
  category: S.optional(S.String),
  executionChain: S.optional(NodeInputExecutionChain),
}) {}
export const NodeInputFields = S.Array(NodeInputField);
export class NodeOutputField extends S.Class<NodeOutputField>(
  "NodeOutputField",
)({
  name: S.String,
  content: NodeExecutionContent,
  next: S.optional(NodeOutputNextList),
  type: S.optional(S.String),
}) {}
export const NodeOutputFields = S.Array(NodeOutputField);
export const Caller = S.Union(S.Struct({ agentAliasArn: S.String }));
export const CallerChain = S.Array(Caller);
export class FlowTraceCondition extends S.Class<FlowTraceCondition>(
  "FlowTraceCondition",
)({ conditionName: S.String }) {}
export const FlowTraceConditions = S.Array(FlowTraceCondition);
export class GuardrailTopic extends S.Class<GuardrailTopic>("GuardrailTopic")({
  name: S.optional(S.String),
  type: S.optional(S.String),
  action: S.optional(S.String),
}) {}
export const GuardrailTopicList = S.Array(GuardrailTopic);
export class GuardrailTopicPolicyAssessment extends S.Class<GuardrailTopicPolicyAssessment>(
  "GuardrailTopicPolicyAssessment",
)({ topics: S.optional(GuardrailTopicList) }) {}
export class GuardrailContentFilter extends S.Class<GuardrailContentFilter>(
  "GuardrailContentFilter",
)({
  type: S.optional(S.String),
  confidence: S.optional(S.String),
  action: S.optional(S.String),
}) {}
export const GuardrailContentFilterList = S.Array(GuardrailContentFilter);
export class GuardrailContentPolicyAssessment extends S.Class<GuardrailContentPolicyAssessment>(
  "GuardrailContentPolicyAssessment",
)({ filters: S.optional(GuardrailContentFilterList) }) {}
export class GuardrailCustomWord extends S.Class<GuardrailCustomWord>(
  "GuardrailCustomWord",
)({ match: S.optional(S.String), action: S.optional(S.String) }) {}
export const GuardrailCustomWordList = S.Array(GuardrailCustomWord);
export class GuardrailManagedWord extends S.Class<GuardrailManagedWord>(
  "GuardrailManagedWord",
)({
  match: S.optional(S.String),
  type: S.optional(S.String),
  action: S.optional(S.String),
}) {}
export const GuardrailManagedWordList = S.Array(GuardrailManagedWord);
export class GuardrailWordPolicyAssessment extends S.Class<GuardrailWordPolicyAssessment>(
  "GuardrailWordPolicyAssessment",
)({
  customWords: S.optional(GuardrailCustomWordList),
  managedWordLists: S.optional(GuardrailManagedWordList),
}) {}
export class GuardrailPiiEntityFilter extends S.Class<GuardrailPiiEntityFilter>(
  "GuardrailPiiEntityFilter",
)({
  type: S.optional(S.String),
  match: S.optional(S.String),
  action: S.optional(S.String),
}) {}
export const GuardrailPiiEntityFilterList = S.Array(GuardrailPiiEntityFilter);
export class GuardrailRegexFilter extends S.Class<GuardrailRegexFilter>(
  "GuardrailRegexFilter",
)({
  name: S.optional(S.String),
  regex: S.optional(S.String),
  match: S.optional(S.String),
  action: S.optional(S.String),
}) {}
export const GuardrailRegexFilterList = S.Array(GuardrailRegexFilter);
export class GuardrailSensitiveInformationPolicyAssessment extends S.Class<GuardrailSensitiveInformationPolicyAssessment>(
  "GuardrailSensitiveInformationPolicyAssessment",
)({
  piiEntities: S.optional(GuardrailPiiEntityFilterList),
  regexes: S.optional(GuardrailRegexFilterList),
}) {}
export class GuardrailAssessment extends S.Class<GuardrailAssessment>(
  "GuardrailAssessment",
)({
  topicPolicy: S.optional(GuardrailTopicPolicyAssessment),
  contentPolicy: S.optional(GuardrailContentPolicyAssessment),
  wordPolicy: S.optional(GuardrailWordPolicyAssessment),
  sensitiveInformationPolicy: S.optional(
    GuardrailSensitiveInformationPolicyAssessment,
  ),
}) {}
export const GuardrailAssessmentList = S.Array(GuardrailAssessment);
export class Usage extends S.Class<Usage>("Usage")({
  inputTokens: S.optional(S.Number),
  outputTokens: S.optional(S.Number),
}) {}
export class Metadata extends S.Class<Metadata>("Metadata")({
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  totalTimeMs: S.optional(S.Number),
  operationTotalTimeMs: S.optional(S.Number),
  clientRequestId: S.optional(S.String),
  usage: S.optional(Usage),
}) {}
export class GuardrailTrace extends S.Class<GuardrailTrace>("GuardrailTrace")({
  action: S.optional(S.String),
  traceId: S.optional(S.String),
  inputAssessments: S.optional(GuardrailAssessmentList),
  outputAssessments: S.optional(GuardrailAssessmentList),
  metadata: S.optional(Metadata),
}) {}
export class ModelInvocationInput extends S.Class<ModelInvocationInput>(
  "ModelInvocationInput",
)({
  traceId: S.optional(S.String),
  text: S.optional(S.String),
  type: S.optional(S.String),
  overrideLambda: S.optional(S.String),
  promptCreationMode: S.optional(S.String),
  inferenceConfiguration: S.optional(InferenceConfiguration),
  parserMode: S.optional(S.String),
  foundationModel: S.optional(S.String),
}) {}
export class PreProcessingParsedResponse extends S.Class<PreProcessingParsedResponse>(
  "PreProcessingParsedResponse",
)({ rationale: S.optional(S.String), isValid: S.optional(S.Boolean) }) {}
export class RawResponse extends S.Class<RawResponse>("RawResponse")({
  content: S.optional(S.String),
}) {}
export class ReasoningTextBlock extends S.Class<ReasoningTextBlock>(
  "ReasoningTextBlock",
)({ text: S.String, signature: S.optional(S.String) }) {}
export const ReasoningContentBlock = S.Union(
  S.Struct({ reasoningText: ReasoningTextBlock }),
  S.Struct({ redactedContent: T.Blob }),
);
export class PreProcessingModelInvocationOutput extends S.Class<PreProcessingModelInvocationOutput>(
  "PreProcessingModelInvocationOutput",
)({
  traceId: S.optional(S.String),
  parsedResponse: S.optional(PreProcessingParsedResponse),
  rawResponse: S.optional(RawResponse),
  metadata: S.optional(Metadata),
  reasoningContent: S.optional(ReasoningContentBlock),
}) {}
export const PreProcessingTrace = S.Union(
  S.Struct({ modelInvocationInput: ModelInvocationInput }),
  S.Struct({ modelInvocationOutput: PreProcessingModelInvocationOutput }),
);
export class Rationale extends S.Class<Rationale>("Rationale")({
  traceId: S.optional(S.String),
  text: S.optional(S.String),
}) {}
export class Parameter extends S.Class<Parameter>("Parameter")({
  name: S.optional(S.String),
  type: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const Parameters = S.Array(Parameter);
export const ContentMap = S.Record({ key: S.String, value: Parameters });
export class RequestBody extends S.Class<RequestBody>("RequestBody")({
  content: S.optional(ContentMap),
}) {}
export class ActionGroupInvocationInput extends S.Class<ActionGroupInvocationInput>(
  "ActionGroupInvocationInput",
)({
  actionGroupName: S.optional(S.String),
  verb: S.optional(S.String),
  apiPath: S.optional(S.String),
  parameters: S.optional(Parameters),
  requestBody: S.optional(RequestBody),
  function: S.optional(S.String),
  executionType: S.optional(S.String),
  invocationId: S.optional(S.String),
}) {}
export class KnowledgeBaseLookupInput extends S.Class<KnowledgeBaseLookupInput>(
  "KnowledgeBaseLookupInput",
)({ text: S.optional(S.String), knowledgeBaseId: S.optional(S.String) }) {}
export const Files = S.Array(S.String);
export class CodeInterpreterInvocationInput extends S.Class<CodeInterpreterInvocationInput>(
  "CodeInterpreterInvocationInput",
)({ code: S.optional(S.String), files: S.optional(Files) }) {}
export class ReturnControlResults extends S.Class<ReturnControlResults>(
  "ReturnControlResults",
)({
  invocationId: S.optional(S.String),
  returnControlInvocationResults: S.optional(ReturnControlInvocationResults),
}) {}
export class AgentCollaboratorInputPayload extends S.Class<AgentCollaboratorInputPayload>(
  "AgentCollaboratorInputPayload",
)({
  type: S.optional(S.String),
  text: S.optional(S.String),
  returnControlResults: S.optional(ReturnControlResults),
}) {}
export class AgentCollaboratorInvocationInput extends S.Class<AgentCollaboratorInvocationInput>(
  "AgentCollaboratorInvocationInput",
)({
  agentCollaboratorName: S.optional(S.String),
  agentCollaboratorAliasArn: S.optional(S.String),
  input: S.optional(AgentCollaboratorInputPayload),
}) {}
export class InvocationInput extends S.Class<InvocationInput>(
  "InvocationInput",
)({
  traceId: S.optional(S.String),
  invocationType: S.optional(S.String),
  actionGroupInvocationInput: S.optional(ActionGroupInvocationInput),
  knowledgeBaseLookupInput: S.optional(KnowledgeBaseLookupInput),
  codeInterpreterInvocationInput: S.optional(CodeInterpreterInvocationInput),
  agentCollaboratorInvocationInput: S.optional(
    AgentCollaboratorInvocationInput,
  ),
}) {}
export class ActionGroupInvocationOutput extends S.Class<ActionGroupInvocationOutput>(
  "ActionGroupInvocationOutput",
)({ text: S.optional(S.String), metadata: S.optional(Metadata) }) {}
export class ApiParameter extends S.Class<ApiParameter>("ApiParameter")({
  name: S.optional(S.String),
  type: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const ApiParameters = S.Array(ApiParameter);
export const ParameterList = S.Array(Parameter);
export class PropertyParameters extends S.Class<PropertyParameters>(
  "PropertyParameters",
)({ properties: S.optional(ParameterList) }) {}
export const ApiContentMap = S.Record({
  key: S.String,
  value: PropertyParameters,
});
export class ApiRequestBody extends S.Class<ApiRequestBody>("ApiRequestBody")({
  content: S.optional(ApiContentMap),
}) {}
export class ApiInvocationInput extends S.Class<ApiInvocationInput>(
  "ApiInvocationInput",
)({
  actionGroup: S.String,
  httpMethod: S.optional(S.String),
  apiPath: S.optional(S.String),
  parameters: S.optional(ApiParameters),
  requestBody: S.optional(ApiRequestBody),
  actionInvocationType: S.optional(S.String),
  agentId: S.optional(S.String),
  collaboratorName: S.optional(S.String),
}) {}
export class FunctionParameter extends S.Class<FunctionParameter>(
  "FunctionParameter",
)({
  name: S.optional(S.String),
  type: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const FunctionParameters = S.Array(FunctionParameter);
export class FunctionInvocationInput extends S.Class<FunctionInvocationInput>(
  "FunctionInvocationInput",
)({
  actionGroup: S.String,
  parameters: S.optional(FunctionParameters),
  function: S.optional(S.String),
  actionInvocationType: S.optional(S.String),
  agentId: S.optional(S.String),
  collaboratorName: S.optional(S.String),
}) {}
export const InvocationInputMember = S.Union(
  S.Struct({ apiInvocationInput: ApiInvocationInput }),
  S.Struct({ functionInvocationInput: FunctionInvocationInput }),
);
export const InvocationInputs = S.Array(InvocationInputMember);
export class ReturnControlPayload extends S.Class<ReturnControlPayload>(
  "ReturnControlPayload",
)({
  invocationInputs: S.optional(InvocationInputs),
  invocationId: S.optional(S.String),
}) {}
export class AgentCollaboratorOutputPayload extends S.Class<AgentCollaboratorOutputPayload>(
  "AgentCollaboratorOutputPayload",
)({
  type: S.optional(S.String),
  text: S.optional(S.String),
  returnControlPayload: S.optional(ReturnControlPayload),
}) {}
export class AgentCollaboratorInvocationOutput extends S.Class<AgentCollaboratorInvocationOutput>(
  "AgentCollaboratorInvocationOutput",
)({
  agentCollaboratorName: S.optional(S.String),
  agentCollaboratorAliasArn: S.optional(S.String),
  output: S.optional(AgentCollaboratorOutputPayload),
  metadata: S.optional(Metadata),
}) {}
export class KnowledgeBaseLookupOutput extends S.Class<KnowledgeBaseLookupOutput>(
  "KnowledgeBaseLookupOutput",
)({
  retrievedReferences: S.optional(RetrievedReferences),
  metadata: S.optional(Metadata),
}) {}
export class FinalResponse extends S.Class<FinalResponse>("FinalResponse")({
  text: S.optional(S.String),
  metadata: S.optional(Metadata),
}) {}
export class RepromptResponse extends S.Class<RepromptResponse>(
  "RepromptResponse",
)({ text: S.optional(S.String), source: S.optional(S.String) }) {}
export class CodeInterpreterInvocationOutput extends S.Class<CodeInterpreterInvocationOutput>(
  "CodeInterpreterInvocationOutput",
)({
  executionOutput: S.optional(S.String),
  executionError: S.optional(S.String),
  files: S.optional(Files),
  executionTimeout: S.optional(S.Boolean),
  metadata: S.optional(Metadata),
}) {}
export class Observation extends S.Class<Observation>("Observation")({
  traceId: S.optional(S.String),
  type: S.optional(S.String),
  actionGroupInvocationOutput: S.optional(ActionGroupInvocationOutput),
  agentCollaboratorInvocationOutput: S.optional(
    AgentCollaboratorInvocationOutput,
  ),
  knowledgeBaseLookupOutput: S.optional(KnowledgeBaseLookupOutput),
  finalResponse: S.optional(FinalResponse),
  repromptResponse: S.optional(RepromptResponse),
  codeInterpreterInvocationOutput: S.optional(CodeInterpreterInvocationOutput),
}) {}
export class OrchestrationModelInvocationOutput extends S.Class<OrchestrationModelInvocationOutput>(
  "OrchestrationModelInvocationOutput",
)({
  traceId: S.optional(S.String),
  rawResponse: S.optional(RawResponse),
  metadata: S.optional(Metadata),
  reasoningContent: S.optional(ReasoningContentBlock),
}) {}
export const OrchestrationTrace = S.Union(
  S.Struct({ rationale: Rationale }),
  S.Struct({ invocationInput: InvocationInput }),
  S.Struct({ observation: Observation }),
  S.Struct({ modelInvocationInput: ModelInvocationInput }),
  S.Struct({ modelInvocationOutput: OrchestrationModelInvocationOutput }),
);
export class PostProcessingParsedResponse extends S.Class<PostProcessingParsedResponse>(
  "PostProcessingParsedResponse",
)({ text: S.optional(S.String) }) {}
export class PostProcessingModelInvocationOutput extends S.Class<PostProcessingModelInvocationOutput>(
  "PostProcessingModelInvocationOutput",
)({
  traceId: S.optional(S.String),
  parsedResponse: S.optional(PostProcessingParsedResponse),
  rawResponse: S.optional(RawResponse),
  metadata: S.optional(Metadata),
  reasoningContent: S.optional(ReasoningContentBlock),
}) {}
export const PostProcessingTrace = S.Union(
  S.Struct({ modelInvocationInput: ModelInvocationInput }),
  S.Struct({ modelInvocationOutput: PostProcessingModelInvocationOutput }),
);
export class RoutingClassifierModelInvocationOutput extends S.Class<RoutingClassifierModelInvocationOutput>(
  "RoutingClassifierModelInvocationOutput",
)({
  traceId: S.optional(S.String),
  rawResponse: S.optional(RawResponse),
  metadata: S.optional(Metadata),
}) {}
export const RoutingClassifierTrace = S.Union(
  S.Struct({ invocationInput: InvocationInput }),
  S.Struct({ observation: Observation }),
  S.Struct({ modelInvocationInput: ModelInvocationInput }),
  S.Struct({ modelInvocationOutput: RoutingClassifierModelInvocationOutput }),
);
export class FailureTrace extends S.Class<FailureTrace>("FailureTrace")({
  traceId: S.optional(S.String),
  failureReason: S.optional(S.String),
  failureCode: S.optional(S.Number),
  metadata: S.optional(Metadata),
}) {}
export class CustomOrchestrationTraceEvent extends S.Class<CustomOrchestrationTraceEvent>(
  "CustomOrchestrationTraceEvent",
)({ text: S.optional(S.String) }) {}
export class CustomOrchestrationTrace extends S.Class<CustomOrchestrationTrace>(
  "CustomOrchestrationTrace",
)({
  traceId: S.optional(S.String),
  event: S.optional(CustomOrchestrationTraceEvent),
}) {}
export const Trace = S.Union(
  S.Struct({ guardrailTrace: GuardrailTrace }),
  S.Struct({ preProcessingTrace: PreProcessingTrace }),
  S.Struct({ orchestrationTrace: OrchestrationTrace }),
  S.Struct({ postProcessingTrace: PostProcessingTrace }),
  S.Struct({ routingClassifierTrace: RoutingClassifierTrace }),
  S.Struct({ failureTrace: FailureTrace }),
  S.Struct({ customOrchestrationTrace: CustomOrchestrationTrace }),
);
export class TracePart extends S.Class<TracePart>("TracePart")({
  sessionId: S.optional(S.String),
  trace: S.optional(Trace),
  callerChain: S.optional(CallerChain),
  eventTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  collaboratorName: S.optional(S.String),
  agentId: S.optional(S.String),
  agentAliasId: S.optional(S.String),
  agentVersion: S.optional(S.String),
}) {}
export const AgentTraces = S.Array(TracePart);
export const TraceElements = S.Union(S.Struct({ agentTraces: AgentTraces }));
export class RerankRequest extends S.Class<RerankRequest>("RerankRequest")(
  {
    queries: RerankQueriesList,
    sources: RerankSourcesList,
    rerankingConfiguration: RerankingConfiguration,
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/rerank" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class FlowExecutionInputEvent extends S.Class<FlowExecutionInputEvent>(
  "FlowExecutionInputEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  fields: FlowInputFields,
}) {}
export class NodeInputEvent extends S.Class<NodeInputEvent>("NodeInputEvent")({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  fields: NodeInputFields,
}) {}
export class NodeOutputEvent extends S.Class<NodeOutputEvent>(
  "NodeOutputEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  fields: NodeOutputFields,
}) {}
export class AnalyzePromptEvent extends S.Class<AnalyzePromptEvent>(
  "AnalyzePromptEvent",
)({ message: S.optional(S.String) }) {}
export class FlowTraceConditionNodeResultEvent extends S.Class<FlowTraceConditionNodeResultEvent>(
  "FlowTraceConditionNodeResultEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  satisfiedConditions: FlowTraceConditions,
}) {}
export class FlowTraceDependencyEvent extends S.Class<FlowTraceDependencyEvent>(
  "FlowTraceDependencyEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  traceElements: TraceElements,
}) {}
export const FlowTraceNodeInputContent = S.Union(S.Struct({ document: S.Any }));
export class FlowTraceNodeInputSource extends S.Class<FlowTraceNodeInputSource>(
  "FlowTraceNodeInputSource",
)({ nodeName: S.String, outputFieldName: S.String, expression: S.String }) {}
export class FlowTraceNodeInputExecutionChainItem extends S.Class<FlowTraceNodeInputExecutionChainItem>(
  "FlowTraceNodeInputExecutionChainItem",
)({ nodeName: S.String, index: S.optional(S.Number), type: S.String }) {}
export const FlowTraceNodeInputExecutionChain = S.Array(
  FlowTraceNodeInputExecutionChainItem,
);
export const FlowTraceNodeOutputContent = S.Union(
  S.Struct({ document: S.Any }),
);
export class FlowTraceNodeOutputNext extends S.Class<FlowTraceNodeOutputNext>(
  "FlowTraceNodeOutputNext",
)({ nodeName: S.String, inputFieldName: S.String }) {}
export const FlowTraceNodeOutputNextList = S.Array(FlowTraceNodeOutputNext);
export class GeneratedQuery extends S.Class<GeneratedQuery>("GeneratedQuery")({
  type: S.optional(S.String),
  sql: S.optional(S.String),
}) {}
export const GeneratedQueries = S.Array(GeneratedQuery);
export const OptimizedPrompt = S.Union(S.Struct({ textPrompt: TextPrompt }));
export class FlowTraceNodeInputField extends S.Class<FlowTraceNodeInputField>(
  "FlowTraceNodeInputField",
)({
  nodeInputName: S.String,
  content: FlowTraceNodeInputContent,
  source: S.optional(FlowTraceNodeInputSource),
  type: S.optional(S.String),
  category: S.optional(S.String),
  executionChain: S.optional(FlowTraceNodeInputExecutionChain),
}) {}
export const FlowTraceNodeInputFields = S.Array(FlowTraceNodeInputField);
export class FlowTraceNodeOutputField extends S.Class<FlowTraceNodeOutputField>(
  "FlowTraceNodeOutputField",
)({
  nodeOutputName: S.String,
  content: FlowTraceNodeOutputContent,
  next: S.optional(FlowTraceNodeOutputNextList),
  type: S.optional(S.String),
}) {}
export const FlowTraceNodeOutputFields = S.Array(FlowTraceNodeOutputField);
export class GenerateQueryResponse extends S.Class<GenerateQueryResponse>(
  "GenerateQueryResponse",
)({ queries: S.optional(GeneratedQueries) }) {}
export class InvokeInlineAgentRequest extends S.Class<InvokeInlineAgentRequest>(
  "InvokeInlineAgentRequest",
)(
  {
    customerEncryptionKeyArn: S.optional(S.String),
    foundationModel: S.String,
    instruction: S.String,
    idleSessionTTLInSeconds: S.optional(S.Number),
    actionGroups: S.optional(AgentActionGroups),
    knowledgeBases: S.optional(KnowledgeBases),
    guardrailConfiguration: S.optional(GuardrailConfigurationWithArn),
    promptOverrideConfiguration: S.optional(PromptOverrideConfiguration),
    agentCollaboration: S.optional(S.String),
    collaboratorConfigurations: S.optional(CollaboratorConfigurations),
    agentName: S.optional(S.String),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    endSession: S.optional(S.Boolean),
    enableTrace: S.optional(S.Boolean),
    inputText: S.optional(S.String),
    streamingConfigurations: S.optional(StreamingConfigurations),
    promptCreationConfigurations: S.optional(PromptCreationConfigurations),
    inlineSessionState: S.optional(InlineSessionState),
    collaborators: S.optional(Collaborators),
    bedrockModelConfigurations: S.optional(InlineBedrockModelConfigurations),
    orchestrationType: S.optional(S.String),
    customOrchestration: S.optional(CustomOrchestration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/agents/{sessionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RetrieveAndGenerateRequest extends S.Class<RetrieveAndGenerateRequest>(
  "RetrieveAndGenerateRequest",
)(
  {
    sessionId: S.optional(S.String),
    input: RetrieveAndGenerateInput,
    retrieveAndGenerateConfiguration: S.optional(
      RetrieveAndGenerateConfiguration,
    ),
    sessionConfiguration: S.optional(RetrieveAndGenerateSessionConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/retrieveAndGenerate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutInvocationStepRequest extends S.Class<PutInvocationStepRequest>(
  "PutInvocationStepRequest",
)(
  {
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
    invocationIdentifier: S.String,
    invocationStepTime: S.Date.pipe(T.TimestampFormat("date-time")),
    payload: InvocationStepPayload,
    invocationStepId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/sessions/{sessionIdentifier}/invocationSteps/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class OptimizedPromptEvent extends S.Class<OptimizedPromptEvent>(
  "OptimizedPromptEvent",
)({ optimizedPrompt: S.optional(OptimizedPrompt) }) {}
export class CitationEvent extends S.Class<CitationEvent>("CitationEvent")({
  citation: S.optional(Citation),
  generatedResponsePart: S.optional(GeneratedResponsePart),
  retrievedReferences: S.optional(RetrievedReferences),
}) {}
export class FlowTraceNodeInputEvent extends S.Class<FlowTraceNodeInputEvent>(
  "FlowTraceNodeInputEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  fields: FlowTraceNodeInputFields,
}) {}
export class FlowTraceNodeOutputEvent extends S.Class<FlowTraceNodeOutputEvent>(
  "FlowTraceNodeOutputEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  fields: FlowTraceNodeOutputFields,
}) {}
export const OptimizedPromptStream = T.EventStream(
  S.Union(
    S.Struct({ optimizedPromptEvent: OptimizedPromptEvent }),
    S.Struct({ analyzePromptEvent: AnalyzePromptEvent }),
    S.Struct({
      internalServerException: S.suspend(() => InternalServerException),
    }),
    S.Struct({ throttlingException: S.suspend(() => ThrottlingException) }),
    S.Struct({ validationException: S.suspend(() => ValidationException) }),
    S.Struct({
      dependencyFailedException: S.suspend(() => DependencyFailedException),
    }),
    S.Struct({ accessDeniedException: S.suspend(() => AccessDeniedException) }),
    S.Struct({ badGatewayException: S.suspend(() => BadGatewayException) }),
  ),
);
export class RerankResult extends S.Class<RerankResult>("RerankResult")({
  index: S.Number,
  relevanceScore: S.Number,
  document: S.optional(RerankDocument),
}) {}
export const RerankResultsList = S.Array(RerankResult);
export const Citations = S.Array(Citation);
export const RetrieveAndGenerateStreamResponseOutput = T.EventStream(
  S.Union(
    S.Struct({ output: RetrieveAndGenerateOutputEvent }),
    S.Struct({ citation: CitationEvent }),
    S.Struct({ guardrail: GuardrailEvent }),
    S.Struct({
      internalServerException: S.suspend(() => InternalServerException),
    }),
    S.Struct({ validationException: S.suspend(() => ValidationException) }),
    S.Struct({
      resourceNotFoundException: S.suspend(() => ResourceNotFoundException),
    }),
    S.Struct({
      serviceQuotaExceededException: S.suspend(
        () => ServiceQuotaExceededException,
      ),
    }),
    S.Struct({ throttlingException: S.suspend(() => ThrottlingException) }),
    S.Struct({ accessDeniedException: S.suspend(() => AccessDeniedException) }),
    S.Struct({ conflictException: S.suspend(() => ConflictException) }),
    S.Struct({
      dependencyFailedException: S.suspend(() => DependencyFailedException),
    }),
    S.Struct({ badGatewayException: S.suspend(() => BadGatewayException) }),
  ),
);
export const FlowTrace = S.Union(
  S.Struct({ nodeInputTrace: FlowTraceNodeInputEvent }),
  S.Struct({ nodeOutputTrace: FlowTraceNodeOutputEvent }),
  S.Struct({ conditionNodeResultTrace: FlowTraceConditionNodeResultEvent }),
  S.Struct({ nodeActionTrace: FlowTraceNodeActionEvent }),
  S.Struct({ nodeDependencyTrace: FlowTraceDependencyEvent }),
);
export class OptimizePromptResponse extends S.Class<OptimizePromptResponse>(
  "OptimizePromptResponse",
)({ optimizedPrompt: OptimizedPromptStream.pipe(T.HttpPayload()) }) {}
export class RerankResponse extends S.Class<RerankResponse>("RerankResponse")({
  results: RerankResultsList,
  nextToken: S.optional(S.String),
}) {}
export class RetrieveAndGenerateStreamResponse extends S.Class<RetrieveAndGenerateStreamResponse>(
  "RetrieveAndGenerateStreamResponse",
)({
  stream: RetrieveAndGenerateStreamResponseOutput.pipe(T.HttpPayload()),
  sessionId: S.String.pipe(
    T.HttpHeader("x-amzn-bedrock-knowledge-base-session-id"),
  ),
}) {}
export class PutInvocationStepResponse extends S.Class<PutInvocationStepResponse>(
  "PutInvocationStepResponse",
)({ invocationStepId: S.String }) {}
export class FlowTraceEvent extends S.Class<FlowTraceEvent>("FlowTraceEvent")({
  trace: FlowTrace,
}) {}
export const FlowResponseStream = T.EventStream(
  S.Union(
    S.Struct({ flowOutputEvent: FlowOutputEvent }),
    S.Struct({ flowCompletionEvent: FlowCompletionEvent }),
    S.Struct({ flowTraceEvent: FlowTraceEvent }),
    S.Struct({
      internalServerException: S.suspend(() => InternalServerException),
    }),
    S.Struct({ validationException: S.suspend(() => ValidationException) }),
    S.Struct({
      resourceNotFoundException: S.suspend(() => ResourceNotFoundException),
    }),
    S.Struct({
      serviceQuotaExceededException: S.suspend(
        () => ServiceQuotaExceededException,
      ),
    }),
    S.Struct({ throttlingException: S.suspend(() => ThrottlingException) }),
    S.Struct({ accessDeniedException: S.suspend(() => AccessDeniedException) }),
    S.Struct({ conflictException: S.suspend(() => ConflictException) }),
    S.Struct({
      dependencyFailedException: S.suspend(() => DependencyFailedException),
    }),
    S.Struct({ badGatewayException: S.suspend(() => BadGatewayException) }),
    S.Struct({
      flowMultiTurnInputRequestEvent: FlowMultiTurnInputRequestEvent,
    }),
  ),
);
export class SessionState extends S.Class<SessionState>("SessionState")({
  sessionAttributes: S.optional(SessionAttributesMap),
  promptSessionAttributes: S.optional(PromptSessionAttributesMap),
  returnControlInvocationResults: S.optional(ReturnControlInvocationResults),
  invocationId: S.optional(S.String),
  files: S.optional(InputFiles),
  knowledgeBaseConfigurations: S.optional(KnowledgeBaseConfigurations),
  conversationHistory: S.optional(ConversationHistory),
}) {}
export class RetrieveAndGenerateOutput extends S.Class<RetrieveAndGenerateOutput>(
  "RetrieveAndGenerateOutput",
)({ text: S.String }) {}
export class InvokeFlowResponse extends S.Class<InvokeFlowResponse>(
  "InvokeFlowResponse",
)({
  responseStream: FlowResponseStream.pipe(T.HttpPayload()),
  executionId: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-bedrock-flow-execution-id"),
  ),
}) {}
export class InvokeAgentRequest extends S.Class<InvokeAgentRequest>(
  "InvokeAgentRequest",
)(
  {
    sessionState: S.optional(SessionState),
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    endSession: S.optional(S.Boolean),
    enableTrace: S.optional(S.Boolean),
    inputText: S.optional(S.String),
    memoryId: S.optional(S.String),
    bedrockModelConfigurations: S.optional(BedrockModelConfigurations),
    streamingConfigurations: S.optional(StreamingConfigurations),
    promptCreationConfigurations: S.optional(PromptCreationConfigurations),
    sourceArn: S.optional(S.String).pipe(T.HttpHeader("x-amz-source-arn")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/agents/{agentId}/agentAliases/{agentAliasId}/sessions/{sessionId}/text",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RetrieveAndGenerateResponse extends S.Class<RetrieveAndGenerateResponse>(
  "RetrieveAndGenerateResponse",
)({
  sessionId: S.String,
  output: RetrieveAndGenerateOutput,
  citations: S.optional(Citations),
  guardrailAction: S.optional(S.String),
}) {}
export class RetrieveRequest extends S.Class<RetrieveRequest>(
  "RetrieveRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    retrievalQuery: KnowledgeBaseQuery,
    retrievalConfiguration: S.optional(KnowledgeBaseRetrievalConfiguration),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/knowledgebases/{knowledgeBaseId}/retrieve",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InlineAgentTracePart extends S.Class<InlineAgentTracePart>(
  "InlineAgentTracePart",
)({
  sessionId: S.optional(S.String),
  trace: S.optional(Trace),
  callerChain: S.optional(CallerChain),
  eventTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  collaboratorName: S.optional(S.String),
}) {}
export class InlineAgentReturnControlPayload extends S.Class<InlineAgentReturnControlPayload>(
  "InlineAgentReturnControlPayload",
)({
  invocationInputs: S.optional(InvocationInputs),
  invocationId: S.optional(S.String),
}) {}
export class Attribution extends S.Class<Attribution>("Attribution")({
  citations: S.optional(Citations),
}) {}
export class OutputFile extends S.Class<OutputFile>("OutputFile")({
  name: S.optional(S.String),
  type: S.optional(S.String),
  bytes: S.optional(T.Blob),
}) {}
export const OutputFiles = S.Array(OutputFile);
export class InlineAgentPayloadPart extends S.Class<InlineAgentPayloadPart>(
  "InlineAgentPayloadPart",
)({ bytes: S.optional(T.Blob), attribution: S.optional(Attribution) }) {}
export class InlineAgentFilePart extends S.Class<InlineAgentFilePart>(
  "InlineAgentFilePart",
)({ files: S.optional(OutputFiles) }) {}
export const InlineAgentResponseStream = T.EventStream(
  S.Union(
    S.Struct({ chunk: InlineAgentPayloadPart }),
    S.Struct({ trace: InlineAgentTracePart }),
    S.Struct({ returnControl: InlineAgentReturnControlPayload }),
    S.Struct({
      internalServerException: S.suspend(() => InternalServerException),
    }),
    S.Struct({ validationException: S.suspend(() => ValidationException) }),
    S.Struct({
      resourceNotFoundException: S.suspend(() => ResourceNotFoundException),
    }),
    S.Struct({
      serviceQuotaExceededException: S.suspend(
        () => ServiceQuotaExceededException,
      ),
    }),
    S.Struct({ throttlingException: S.suspend(() => ThrottlingException) }),
    S.Struct({ accessDeniedException: S.suspend(() => AccessDeniedException) }),
    S.Struct({ conflictException: S.suspend(() => ConflictException) }),
    S.Struct({
      dependencyFailedException: S.suspend(() => DependencyFailedException),
    }),
    S.Struct({ badGatewayException: S.suspend(() => BadGatewayException) }),
    S.Struct({ files: InlineAgentFilePart }),
  ),
);
export class KnowledgeBaseRetrievalResult extends S.Class<KnowledgeBaseRetrievalResult>(
  "KnowledgeBaseRetrievalResult",
)({
  content: RetrievalResultContent,
  location: S.optional(RetrievalResultLocation),
  score: S.optional(S.Number),
  metadata: S.optional(RetrievalResultMetadata),
}) {}
export const KnowledgeBaseRetrievalResults = S.Array(
  KnowledgeBaseRetrievalResult,
);
export class InvokeInlineAgentResponse extends S.Class<InvokeInlineAgentResponse>(
  "InvokeInlineAgentResponse",
)({
  completion: InlineAgentResponseStream.pipe(T.HttpPayload()),
  contentType: S.String.pipe(T.HttpHeader("x-amzn-bedrock-agent-content-type")),
  sessionId: S.String.pipe(T.HttpHeader("x-amz-bedrock-agent-session-id")),
}) {}
export class RetrieveResponse extends S.Class<RetrieveResponse>(
  "RetrieveResponse",
)({
  retrievalResults: KnowledgeBaseRetrievalResults,
  guardrailAction: S.optional(S.String),
  nextToken: S.optional(S.String),
}) {}
export class PayloadPart extends S.Class<PayloadPart>("PayloadPart")({
  bytes: S.optional(T.Blob),
  attribution: S.optional(Attribution),
}) {}
export class FilePart extends S.Class<FilePart>("FilePart")({
  files: S.optional(OutputFiles),
}) {}
export const ResponseStream = T.EventStream(
  S.Union(
    S.Struct({ chunk: PayloadPart }),
    S.Struct({ trace: TracePart }),
    S.Struct({ returnControl: ReturnControlPayload }),
    S.Struct({
      internalServerException: S.suspend(() => InternalServerException),
    }),
    S.Struct({ validationException: S.suspend(() => ValidationException) }),
    S.Struct({
      resourceNotFoundException: S.suspend(() => ResourceNotFoundException),
    }),
    S.Struct({
      serviceQuotaExceededException: S.suspend(
        () => ServiceQuotaExceededException,
      ),
    }),
    S.Struct({ throttlingException: S.suspend(() => ThrottlingException) }),
    S.Struct({ accessDeniedException: S.suspend(() => AccessDeniedException) }),
    S.Struct({ conflictException: S.suspend(() => ConflictException) }),
    S.Struct({
      dependencyFailedException: S.suspend(() => DependencyFailedException),
    }),
    S.Struct({ badGatewayException: S.suspend(() => BadGatewayException) }),
    S.Struct({
      modelNotReadyException: S.suspend(() => ModelNotReadyException),
    }),
    S.Struct({ files: FilePart }),
  ),
);
export class InvokeAgentResponse extends S.Class<InvokeAgentResponse>(
  "InvokeAgentResponse",
)({
  completion: ResponseStream.pipe(T.HttpPayload()),
  contentType: S.String.pipe(T.HttpHeader("x-amzn-bedrock-agent-content-type")),
  sessionId: S.String.pipe(T.HttpHeader("x-amz-bedrock-agent-session-id")),
  memoryId: S.optional(S.String).pipe(
    T.HttpHeader("x-amz-bedrock-agent-memory-id"),
  ),
}) {}
export const NodeTraceElements = S.Union(
  S.Struct({ agentTraces: AgentTraces }),
);
export class NodeDependencyEvent extends S.Class<NodeDependencyEvent>(
  "NodeDependencyEvent",
)({
  nodeName: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  traceElements: NodeTraceElements,
}) {}
export const FlowExecutionEvent = S.Union(
  S.Struct({ flowInputEvent: FlowExecutionInputEvent }),
  S.Struct({ flowOutputEvent: FlowExecutionOutputEvent }),
  S.Struct({ nodeInputEvent: NodeInputEvent }),
  S.Struct({ nodeOutputEvent: NodeOutputEvent }),
  S.Struct({ conditionResultEvent: ConditionResultEvent }),
  S.Struct({ nodeFailureEvent: NodeFailureEvent }),
  S.Struct({ flowFailureEvent: FlowFailureEvent }),
  S.Struct({ nodeActionEvent: NodeActionEvent }),
  S.Struct({ nodeDependencyEvent: NodeDependencyEvent }),
);
export const FlowExecutionEvents = S.Array(FlowExecutionEvent);
export class ListFlowExecutionEventsResponse extends S.Class<ListFlowExecutionEventsResponse>(
  "ListFlowExecutionEventsResponse",
)({
  flowExecutionEvents: FlowExecutionEvents,
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class BadGatewayException extends S.TaggedError<BadGatewayException>()(
  "BadGatewayException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String), reason: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class DependencyFailedException extends S.TaggedError<DependencyFailedException>()(
  "DependencyFailedException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class ModelNotReadyException extends S.TaggedError<ModelNotReadyException>()(
  "ModelNotReadyException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Stops an Amazon Bedrock flow's execution. This operation prevents further processing of the flow and changes the execution status to `Aborted`.
 */
export const stopFlowExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopFlowExecutionRequest,
  output: StopFlowExecutionResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List all the tags for the resource you specify.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associate tags with a resource. For more information, see Tagging resources in the Amazon Bedrock User Guide.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Remove tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the flow definition snapshot used for a flow execution. The snapshot represents the flow metadata and definition as it existed at the time the execution was started. Note that even if the flow is edited after an execution starts, the snapshot connected to the execution remains unchanged.
 *
 * Flow executions is in preview release for Amazon Bedrock and is subject to change.
 */
export const getExecutionFlowSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetExecutionFlowSnapshotRequest,
    output: GetExecutionFlowSnapshotResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves details about a specific flow execution, including its status, start and end times, and any errors that occurred during execution.
 */
export const getFlowExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFlowExecutionRequest,
  output: GetFlowExecutionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all executions of a flow. Results can be paginated and include summary information about each execution, such as status, start and end times, and the execution's Amazon Resource Name (ARN).
 *
 * Flow executions is in preview release for Amazon Bedrock and is subject to change.
 */
export const listFlowExecutions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFlowExecutionsRequest,
    output: ListFlowExecutionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "flowExecutionSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Ends the session. After you end a session, you can still access its content but you can’t add to it. To delete the session and it's content, you use the DeleteSession API operation. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 */
export const endSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EndSessionRequest,
  output: EndSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new invocation within a session. An invocation groups the related invocation steps that store the content from a conversation. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 *
 * Related APIs
 *
 * - ListInvocations
 *
 * - ListSessions
 *
 * - GetSession
 */
export const createInvocation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInvocationRequest,
  output: CreateInvocationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a session that you ended. You can't delete a session with an `ACTIVE` status. To delete an active session, you must first end it with the EndSession API operation. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 */
export const deleteSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSessionRequest,
  output: DeleteSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes memory from the specified memory identifier.
 */
export const deleteAgentMemory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAgentMemoryRequest,
  output: DeleteAgentMemoryResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a session to temporarily store conversations for generative AI (GenAI) applications built with open-source frameworks such as LangGraph and LlamaIndex. Sessions enable you to save the state of conversations at checkpoints, with the added security and infrastructure of Amazon Web Services. For more information, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 *
 * By default, Amazon Bedrock uses Amazon Web Services-managed keys for session encryption, including session metadata, or you can use your own KMS key. For more information, see Amazon Bedrock session encryption.
 *
 * You use a session to store state and conversation history for generative AI applications built with open-source frameworks. For Amazon Bedrock Agents, the service automatically manages conversation context and associates them with the agent-specific sessionId you specify in the InvokeAgent API operation.
 *
 * Related APIs:
 *
 * - ListSessions
 *
 * - GetSession
 *
 * - EndSession
 *
 * - DeleteSession
 */
export const createSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSessionRequest,
  output: CreateSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about a specific session. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 */
export const getSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionRequest,
  output: GetSessionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the metadata or encryption settings of a session. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 */
export const updateSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSessionRequest,
  output: UpdateSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all invocations associated with a specific session. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 */
export const listInvocations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInvocationsRequest,
    output: ListInvocationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "invocationSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves the details of a specific invocation step within an invocation in a session. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 */
export const getInvocationStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvocationStepRequest,
  output: GetInvocationStepResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all invocation steps associated with a session and optionally, an invocation within the session. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 */
export const listInvocationSteps =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListInvocationStepsRequest,
    output: ListInvocationStepsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "invocationStepSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all sessions in your Amazon Web Services account. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 */
export const listSessions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSessionsRequest,
    output: ListSessionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
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
 * Starts an execution of an Amazon Bedrock flow. Unlike flows that run until completion or time out after five minutes, flow executions let you run flows asynchronously for longer durations. Flow executions also yield control so that your application can perform other tasks.
 *
 * This operation returns an Amazon Resource Name (ARN) that you can use to track and manage your flow execution.
 *
 * Flow executions is in preview release for Amazon Bedrock and is subject to change.
 */
export const startFlowExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFlowExecutionRequest,
  output: StartFlowExecutionResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the sessions stored in the memory of the agent.
 */
export const getAgentMemory = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetAgentMemoryRequest,
    output: GetAgentMemoryResponse,
    errors: [
      AccessDeniedException,
      BadGatewayException,
      ConflictException,
      DependencyFailedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "memoryContents",
      pageSize: "maxItems",
    } as const,
  }),
);
/**
 * Generates an SQL query from a natural language query. For more information, see Generate a query for structured data in the Amazon Bedrock User Guide.
 */
export const generateQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateQueryRequest,
  output: GenerateQueryResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Optimizes a prompt for the task that you specify. For more information, see Optimize a prompt in the Amazon Bedrock User Guide.
 */
export const optimizePrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: OptimizePromptRequest,
  output: OptimizePromptResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    DependencyFailedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Reranks the relevance of sources based on queries. For more information, see Improve the relevance of query responses with a reranker model.
 */
export const rerank = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: RerankRequest,
  output: RerankResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "results",
  } as const,
}));
/**
 * Queries a knowledge base and generates responses based on the retrieved results, with output in streaming format.
 *
 * The CLI doesn't support streaming operations in Amazon Bedrock, including `InvokeModelWithResponseStream`.
 *
 * This operation requires permission for the ` bedrock:RetrieveAndGenerate` action.
 */
export const retrieveAndGenerateStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RetrieveAndGenerateStreamRequest,
    output: RetrieveAndGenerateStreamResponse,
    errors: [
      AccessDeniedException,
      BadGatewayException,
      ConflictException,
      DependencyFailedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Add an invocation step to an invocation in a session. An invocation step stores fine-grained state checkpoints, including text and images, for each interaction. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 *
 * Related APIs:
 *
 * - GetInvocationStep
 *
 * - ListInvocationSteps
 *
 * - ListInvocations
 *
 * - ListSessions
 */
export const putInvocationStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutInvocationStepRequest,
  output: PutInvocationStepResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Invokes an alias of a flow to run the inputs that you specify and return the output of each node as a stream. If there's an error, the error is returned. For more information, see Test a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 *
 * The CLI doesn't support streaming operations in Amazon Bedrock, including `InvokeFlow`.
 */
export const invokeFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeFlowRequest,
  output: InvokeFlowResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Queries a knowledge base and generates responses based on the retrieved results and using the specified foundation model or inference profile. The response only cites sources that are relevant to the query.
 */
export const retrieveAndGenerate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetrieveAndGenerateRequest,
  output: RetrieveAndGenerateResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Invokes an inline Amazon Bedrock agent using the configurations you provide with the request.
 *
 * - Specify the following fields for security purposes.
 *
 * - (Optional) `customerEncryptionKeyArn` – The Amazon Resource Name (ARN) of a KMS key to encrypt the creation of the agent.
 *
 * - (Optional) `idleSessionTTLinSeconds` – Specify the number of seconds for which the agent should maintain session information. After this time expires, the subsequent `InvokeInlineAgent` request begins a new session.
 *
 * - To override the default prompt behavior for agent orchestration and to use advanced prompts, include a `promptOverrideConfiguration` object. For more information, see Advanced prompts.
 *
 * - The agent instructions will not be honored if your agent has only one knowledge base, uses default prompts, has no action group, and user input is disabled.
 */
export const invokeInlineAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeInlineAgentRequest,
  output: InvokeInlineAgentResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Queries a knowledge base and retrieves information from it.
 */
export const retrieve = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: RetrieveRequest,
  output: RetrieveResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "retrievalResults",
  } as const,
}));
/**
 * Sends a prompt for the agent to process and respond to. Note the following fields for the request:
 *
 * - To continue the same conversation with an agent, use the same `sessionId` value in the request.
 *
 * - To activate trace enablement, turn `enableTrace` to `true`. Trace enablement helps you follow the agent's reasoning process that led it to the information it processed, the actions it took, and the final result it yielded. For more information, see Trace enablement.
 *
 * - End a conversation by setting `endSession` to `true`.
 *
 * - In the `sessionState` object, you can include attributes for the session or prompt or, if you configured an action group to return control, results from invocation of the action group.
 *
 * The response contains both **chunk** and **trace** attributes.
 *
 * The final response is returned in the `bytes` field of the `chunk` object. The `InvokeAgent` returns one chunk for the entire interaction.
 *
 * - The `attribution` object contains citations for parts of the response.
 *
 * - If you set `enableTrace` to `true` in the request, you can trace the agent's steps and reasoning process that led it to the response.
 *
 * - If the action predicted was configured to return control, the response returns parameters for the action, elicited from the user, in the `returnControl` field.
 *
 * - Errors are also surfaced in the response.
 */
export const invokeAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeAgentRequest,
  output: InvokeAgentResponse,
  errors: [
    AccessDeniedException,
    BadGatewayException,
    ConflictException,
    DependencyFailedException,
    InternalServerException,
    ModelNotReadyException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists events that occurred during a flow execution. Events provide detailed information about the execution progress, including node inputs and outputs, flow inputs and outputs, condition results, and failure events.
 *
 * Flow executions is in preview release for Amazon Bedrock and is subject to change.
 */
export const listFlowExecutionEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListFlowExecutionEventsRequest,
    output: ListFlowExecutionEventsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "flowExecutionEvents",
      pageSize: "maxResults",
    } as const,
  }));
