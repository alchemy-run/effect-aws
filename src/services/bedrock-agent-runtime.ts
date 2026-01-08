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
  sdkId: "Bedrock Agent Runtime",
  serviceShapeName: "AmazonBedrockAgentRunTimeService",
});
const auth = T.AwsAuthSigv4({ name: "bedrock" });
const ver = T.ServiceVersion("2023-07-26");
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
              `https://bedrock-agent-runtime-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://bedrock-agent-runtime-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://bedrock-agent-runtime.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://bedrock-agent-runtime.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type FlowIdentifier = string;
export type FlowAliasIdentifier = string;
export type FlowExecutionIdentifier = string;
export type MaxResults = number;
export type NextToken = string;
export type FlowExecutionName = string;
export type FlowExecutionId = string;
export type AgentId = string;
export type AgentAliasId = string;
export type SessionId = string;
export type InputText = string | redacted.Redacted<string>;
export type MemoryId = string;
export type AWSResourceARN = string;
export type KmsKeyArn = string;
export type ModelIdentifier = string;
export type Instruction = string | redacted.Redacted<string>;
export type SessionTTL = number;
export type Name = string | redacted.Redacted<string>;
export type KnowledgeBaseId = string;
export type SessionIdentifier = string;
export type Uuid = string;
export type InvocationDescription = string;
export type InvocationIdentifier = string;
export type TaggableResourcesArn = string;
export type TagKey = string;
export type NodeName = string;
export type NodeOutputName = string;
export type NodeInputName = string;
export type ResourceName = string | redacted.Redacted<string>;
export type ResourceDescription = string | redacted.Redacted<string>;
export type GuardrailIdentifierWithArn = string;
export type GuardrailVersion = string;
export type LambdaResourceArn = string;
export type CollaborationInstruction = string | redacted.Redacted<string>;
export type AgentAliasArn = string;
export type SessionMetadataKey = string;
export type SessionMetadataValue = string;
export type TagValue = string;
export type Version = string;
export type FlowExecutionRoleArn = string;
export type NonBlankString = string;
export type SessionArn = string;
export type Payload = string | redacted.Redacted<string>;
export type BasePromptTemplate = string | redacted.Redacted<string>;
export type LambdaArn = string;
export type BedrockModelArn = string;
export type ByteContentBlob = Uint8Array | redacted.Redacted<Uint8Array>;
export type KnowledgeBaseArn = string;
export type ApiPath = string | redacted.Redacted<string>;
export type S3BucketName = string;
export type S3ObjectKey = string;
export type FunctionDescription = string;
export type Temperature = number;
export type TopP = number;
export type TopK = number;
export type MaximumLength = number;
export type SummaryText = string;
export type S3Uri = string;
export type MimeType = string;
export type ParameterName = string;
export type AdditionalModelRequestFieldsKey = string;
export type AdditionalModelRequestFieldsValue = unknown;
export type TextPromptTemplate = string | redacted.Redacted<string>;
export type Identifier = string | redacted.Redacted<string>;
export type ContentType = string;
export type FilterKey = string;
export type FilterValue = unknown;
export type ParameterDescription = string;
export type MaxTokens = number;
export type BedrockRerankingModelArn = string;
export type FlowNodeOutputName = string;
export type FlowNodeInputExpression = string | redacted.Redacted<string>;
export type FlowNodeInputName = string;
export type AgentVersion = string;
export type RetrievalResultMetadataKey = string;
export type RetrievalResultMetadataValue = unknown;
export type TraceId = string;
export type FailureReasonString = string | redacted.Redacted<string>;
export type PromptText = string | redacted.Redacted<string>;
export type RationaleString = string | redacted.Redacted<string>;
export type ActionGroupName = string | redacted.Redacted<string>;
export type Verb = string | redacted.Redacted<string>;
export type KnowledgeBaseLookupInputString = string | redacted.Redacted<string>;
export type TraceKnowledgeBaseId = string | redacted.Redacted<string>;
export type ActionGroupOutputString = string | redacted.Redacted<string>;
export type FinalResponseString = string | redacted.Redacted<string>;
export type OutputString = string | redacted.Redacted<string>;
export type AgentCollaboratorPayloadString = string | redacted.Redacted<string>;
export type PartBody = Uint8Array | redacted.Redacted<Uint8Array>;
export type FileBody = Uint8Array | redacted.Redacted<Uint8Array>;

//# Schemas
export type FlowExecutionEventType = "Node" | "Flow";
export const FlowExecutionEventType = S.Literal("Node", "Flow");
export type AgentCollaboration =
  | "SUPERVISOR"
  | "SUPERVISOR_ROUTER"
  | "DISABLED";
export const AgentCollaboration = S.Literal(
  "SUPERVISOR",
  "SUPERVISOR_ROUTER",
  "DISABLED",
);
export type OrchestrationType = "DEFAULT" | "CUSTOM_ORCHESTRATION";
export const OrchestrationType = S.Literal("DEFAULT", "CUSTOM_ORCHESTRATION");
export type MemoryType = "SESSION_SUMMARY";
export const MemoryType = S.Literal("SESSION_SUMMARY");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface GetExecutionFlowSnapshotRequest {
  flowIdentifier: string;
  flowAliasIdentifier: string;
  executionIdentifier: string;
}
export const GetExecutionFlowSnapshotRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    executionIdentifier: S.String.pipe(T.HttpLabel("executionIdentifier")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetExecutionFlowSnapshotRequest",
}) as any as S.Schema<GetExecutionFlowSnapshotRequest>;
export interface GetFlowExecutionRequest {
  flowIdentifier: string;
  flowAliasIdentifier: string;
  executionIdentifier: string;
}
export const GetFlowExecutionRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    executionIdentifier: S.String.pipe(T.HttpLabel("executionIdentifier")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetFlowExecutionRequest",
}) as any as S.Schema<GetFlowExecutionRequest>;
export interface ListFlowExecutionEventsRequest {
  flowIdentifier: string;
  flowAliasIdentifier: string;
  executionIdentifier: string;
  maxResults?: number;
  nextToken?: string;
  eventType: FlowExecutionEventType;
}
export const ListFlowExecutionEventsRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    executionIdentifier: S.String.pipe(T.HttpLabel("executionIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    eventType: FlowExecutionEventType.pipe(T.HttpQuery("eventType")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListFlowExecutionEventsRequest",
}) as any as S.Schema<ListFlowExecutionEventsRequest>;
export interface ListFlowExecutionsRequest {
  flowIdentifier: string;
  flowAliasIdentifier?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListFlowExecutionsRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("flowAliasIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/flows/{flowIdentifier}/executions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFlowExecutionsRequest",
}) as any as S.Schema<ListFlowExecutionsRequest>;
export interface StopFlowExecutionRequest {
  flowIdentifier: string;
  flowAliasIdentifier: string;
  executionIdentifier: string;
}
export const StopFlowExecutionRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    executionIdentifier: S.String.pipe(T.HttpLabel("executionIdentifier")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopFlowExecutionRequest",
}) as any as S.Schema<StopFlowExecutionRequest>;
export type FlowInputContent = { document: any };
export const FlowInputContent = S.Union(S.Struct({ document: S.Any }));
export interface FlowInput {
  nodeName: string;
  nodeOutputName?: string;
  content: FlowInputContent;
  nodeInputName?: string;
}
export const FlowInput = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    nodeOutputName: S.optional(S.String),
    content: FlowInputContent,
    nodeInputName: S.optional(S.String),
  }),
).annotations({ identifier: "FlowInput" }) as any as S.Schema<FlowInput>;
export type FlowInputs = FlowInput[];
export const FlowInputs = S.Array(FlowInput);
export type PerformanceConfigLatency = "standard" | "optimized";
export const PerformanceConfigLatency = S.Literal("standard", "optimized");
export interface PerformanceConfiguration {
  latency?: PerformanceConfigLatency;
}
export const PerformanceConfiguration = S.suspend(() =>
  S.Struct({ latency: S.optional(PerformanceConfigLatency) }),
).annotations({
  identifier: "PerformanceConfiguration",
}) as any as S.Schema<PerformanceConfiguration>;
export interface ModelPerformanceConfiguration {
  performanceConfig?: PerformanceConfiguration;
}
export const ModelPerformanceConfiguration = S.suspend(() =>
  S.Struct({ performanceConfig: S.optional(PerformanceConfiguration) }),
).annotations({
  identifier: "ModelPerformanceConfiguration",
}) as any as S.Schema<ModelPerformanceConfiguration>;
export interface InvokeFlowRequest {
  flowIdentifier: string;
  flowAliasIdentifier: string;
  inputs: FlowInput[];
  enableTrace?: boolean;
  modelPerformanceConfiguration?: ModelPerformanceConfiguration;
  executionId?: string;
}
export const InvokeFlowRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    inputs: FlowInputs,
    enableTrace: S.optional(S.Boolean),
    modelPerformanceConfiguration: S.optional(ModelPerformanceConfiguration),
    executionId: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "InvokeFlowRequest",
}) as any as S.Schema<InvokeFlowRequest>;
export interface DeleteAgentMemoryRequest {
  agentId: string;
  agentAliasId: string;
  memoryId?: string;
  sessionId?: string;
}
export const DeleteAgentMemoryRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
    memoryId: S.optional(S.String).pipe(T.HttpQuery("memoryId")),
    sessionId: S.optional(S.String).pipe(T.HttpQuery("sessionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteAgentMemoryRequest",
}) as any as S.Schema<DeleteAgentMemoryRequest>;
export interface DeleteAgentMemoryResponse {}
export const DeleteAgentMemoryResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAgentMemoryResponse",
}) as any as S.Schema<DeleteAgentMemoryResponse>;
export interface GetAgentMemoryRequest {
  nextToken?: string;
  maxItems?: number;
  agentId: string;
  agentAliasId: string;
  memoryType: MemoryType;
  memoryId: string;
}
export const GetAgentMemoryRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxItems: S.optional(S.Number).pipe(T.HttpQuery("maxItems")),
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
    memoryType: MemoryType.pipe(T.HttpQuery("memoryType")),
    memoryId: S.String.pipe(T.HttpQuery("memoryId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetAgentMemoryRequest",
}) as any as S.Schema<GetAgentMemoryRequest>;
export interface RetrieveAndGenerateInput {
  text: string;
}
export const RetrieveAndGenerateInput = S.suspend(() =>
  S.Struct({ text: S.String }),
).annotations({
  identifier: "RetrieveAndGenerateInput",
}) as any as S.Schema<RetrieveAndGenerateInput>;
export type RetrieveAndGenerateType = "KNOWLEDGE_BASE" | "EXTERNAL_SOURCES";
export const RetrieveAndGenerateType = S.Literal(
  "KNOWLEDGE_BASE",
  "EXTERNAL_SOURCES",
);
export type SearchType = "HYBRID" | "SEMANTIC";
export const SearchType = S.Literal("HYBRID", "SEMANTIC");
export interface FilterAttribute {
  key: string;
  value: any;
}
export const FilterAttribute = S.suspend(() =>
  S.Struct({ key: S.String, value: S.Any }),
).annotations({
  identifier: "FilterAttribute",
}) as any as S.Schema<FilterAttribute>;
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
  | { andAll: RetrievalFilter[] }
  | { orAll: RetrievalFilter[] };
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
  S.Struct({
    andAll: S.suspend(() => RetrievalFilterList).annotations({
      identifier: "RetrievalFilterList",
    }),
  }),
  S.Struct({
    orAll: S.suspend(() => RetrievalFilterList).annotations({
      identifier: "RetrievalFilterList",
    }),
  }),
) as any as S.Schema<RetrievalFilter>;
export type VectorSearchRerankingConfigurationType = "BEDROCK_RERANKING_MODEL";
export const VectorSearchRerankingConfigurationType = S.Literal(
  "BEDROCK_RERANKING_MODEL",
);
export type AdditionalModelRequestFields = { [key: string]: any };
export const AdditionalModelRequestFields = S.Record({
  key: S.String,
  value: S.Any,
});
export interface VectorSearchBedrockRerankingModelConfiguration {
  modelArn: string;
  additionalModelRequestFields?: { [key: string]: any };
}
export const VectorSearchBedrockRerankingModelConfiguration = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
  }),
).annotations({
  identifier: "VectorSearchBedrockRerankingModelConfiguration",
}) as any as S.Schema<VectorSearchBedrockRerankingModelConfiguration>;
export type RerankingMetadataSelectionMode = "SELECTIVE" | "ALL";
export const RerankingMetadataSelectionMode = S.Literal("SELECTIVE", "ALL");
export interface FieldForReranking {
  fieldName: string;
}
export const FieldForReranking = S.suspend(() =>
  S.Struct({ fieldName: S.String }),
).annotations({
  identifier: "FieldForReranking",
}) as any as S.Schema<FieldForReranking>;
export type FieldsForReranking = FieldForReranking[];
export const FieldsForReranking = S.Array(FieldForReranking);
export type RerankingMetadataSelectiveModeConfiguration =
  | { fieldsToInclude: FieldForReranking[] }
  | { fieldsToExclude: FieldForReranking[] };
export const RerankingMetadataSelectiveModeConfiguration = S.Union(
  S.Struct({ fieldsToInclude: FieldsForReranking }),
  S.Struct({ fieldsToExclude: FieldsForReranking }),
);
export interface MetadataConfigurationForReranking {
  selectionMode: RerankingMetadataSelectionMode;
  selectiveModeConfiguration?: RerankingMetadataSelectiveModeConfiguration;
}
export const MetadataConfigurationForReranking = S.suspend(() =>
  S.Struct({
    selectionMode: RerankingMetadataSelectionMode,
    selectiveModeConfiguration: S.optional(
      RerankingMetadataSelectiveModeConfiguration,
    ),
  }),
).annotations({
  identifier: "MetadataConfigurationForReranking",
}) as any as S.Schema<MetadataConfigurationForReranking>;
export interface VectorSearchBedrockRerankingConfiguration {
  modelConfiguration: VectorSearchBedrockRerankingModelConfiguration;
  numberOfRerankedResults?: number;
  metadataConfiguration?: MetadataConfigurationForReranking;
}
export const VectorSearchBedrockRerankingConfiguration = S.suspend(() =>
  S.Struct({
    modelConfiguration: VectorSearchBedrockRerankingModelConfiguration,
    numberOfRerankedResults: S.optional(S.Number),
    metadataConfiguration: S.optional(MetadataConfigurationForReranking),
  }),
).annotations({
  identifier: "VectorSearchBedrockRerankingConfiguration",
}) as any as S.Schema<VectorSearchBedrockRerankingConfiguration>;
export interface VectorSearchRerankingConfiguration {
  type: VectorSearchRerankingConfigurationType;
  bedrockRerankingConfiguration?: VectorSearchBedrockRerankingConfiguration;
}
export const VectorSearchRerankingConfiguration = S.suspend(() =>
  S.Struct({
    type: VectorSearchRerankingConfigurationType,
    bedrockRerankingConfiguration: S.optional(
      VectorSearchBedrockRerankingConfiguration,
    ),
  }),
).annotations({
  identifier: "VectorSearchRerankingConfiguration",
}) as any as S.Schema<VectorSearchRerankingConfiguration>;
export type AttributeType = "STRING" | "NUMBER" | "BOOLEAN" | "STRING_LIST";
export const AttributeType = S.Literal(
  "STRING",
  "NUMBER",
  "BOOLEAN",
  "STRING_LIST",
);
export interface MetadataAttributeSchema {
  key: string;
  type: AttributeType;
  description: string;
}
export const MetadataAttributeSchema = S.suspend(() =>
  S.Struct({ key: S.String, type: AttributeType, description: S.String }),
).annotations({
  identifier: "MetadataAttributeSchema",
}) as any as S.Schema<MetadataAttributeSchema>;
export type MetadataAttributeSchemaList = MetadataAttributeSchema[];
export const MetadataAttributeSchemaList = S.Array(MetadataAttributeSchema);
export interface ImplicitFilterConfiguration {
  metadataAttributes: MetadataAttributeSchema[];
  modelArn: string;
}
export const ImplicitFilterConfiguration = S.suspend(() =>
  S.Struct({
    metadataAttributes: MetadataAttributeSchemaList,
    modelArn: S.String,
  }),
).annotations({
  identifier: "ImplicitFilterConfiguration",
}) as any as S.Schema<ImplicitFilterConfiguration>;
export interface KnowledgeBaseVectorSearchConfiguration {
  numberOfResults?: number;
  overrideSearchType?: SearchType;
  filter?: RetrievalFilter;
  rerankingConfiguration?: VectorSearchRerankingConfiguration;
  implicitFilterConfiguration?: ImplicitFilterConfiguration;
}
export const KnowledgeBaseVectorSearchConfiguration = S.suspend(() =>
  S.Struct({
    numberOfResults: S.optional(S.Number),
    overrideSearchType: S.optional(SearchType),
    filter: S.optional(RetrievalFilter),
    rerankingConfiguration: S.optional(VectorSearchRerankingConfiguration),
    implicitFilterConfiguration: S.optional(ImplicitFilterConfiguration),
  }),
).annotations({
  identifier: "KnowledgeBaseVectorSearchConfiguration",
}) as any as S.Schema<KnowledgeBaseVectorSearchConfiguration>;
export interface KnowledgeBaseRetrievalConfiguration {
  vectorSearchConfiguration: KnowledgeBaseVectorSearchConfiguration;
}
export const KnowledgeBaseRetrievalConfiguration = S.suspend(() =>
  S.Struct({
    vectorSearchConfiguration: KnowledgeBaseVectorSearchConfiguration,
  }),
).annotations({
  identifier: "KnowledgeBaseRetrievalConfiguration",
}) as any as S.Schema<KnowledgeBaseRetrievalConfiguration>;
export interface PromptTemplate {
  textPromptTemplate?: string | redacted.Redacted<string>;
}
export const PromptTemplate = S.suspend(() =>
  S.Struct({ textPromptTemplate: S.optional(SensitiveString) }),
).annotations({
  identifier: "PromptTemplate",
}) as any as S.Schema<PromptTemplate>;
export interface GuardrailConfiguration {
  guardrailId: string;
  guardrailVersion: string;
}
export const GuardrailConfiguration = S.suspend(() =>
  S.Struct({ guardrailId: S.String, guardrailVersion: S.String }),
).annotations({
  identifier: "GuardrailConfiguration",
}) as any as S.Schema<GuardrailConfiguration>;
export type RAGStopSequences = string[];
export const RAGStopSequences = S.Array(S.String);
export interface TextInferenceConfig {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stopSequences?: string[];
}
export const TextInferenceConfig = S.suspend(() =>
  S.Struct({
    temperature: S.optional(S.Number),
    topP: S.optional(S.Number),
    maxTokens: S.optional(S.Number),
    stopSequences: S.optional(RAGStopSequences),
  }),
).annotations({
  identifier: "TextInferenceConfig",
}) as any as S.Schema<TextInferenceConfig>;
export interface InferenceConfig {
  textInferenceConfig?: TextInferenceConfig;
}
export const InferenceConfig = S.suspend(() =>
  S.Struct({ textInferenceConfig: S.optional(TextInferenceConfig) }),
).annotations({
  identifier: "InferenceConfig",
}) as any as S.Schema<InferenceConfig>;
export interface GenerationConfiguration {
  promptTemplate?: PromptTemplate;
  guardrailConfiguration?: GuardrailConfiguration;
  inferenceConfig?: InferenceConfig;
  additionalModelRequestFields?: { [key: string]: any };
  performanceConfig?: PerformanceConfiguration;
}
export const GenerationConfiguration = S.suspend(() =>
  S.Struct({
    promptTemplate: S.optional(PromptTemplate),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
    inferenceConfig: S.optional(InferenceConfig),
    additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
    performanceConfig: S.optional(PerformanceConfiguration),
  }),
).annotations({
  identifier: "GenerationConfiguration",
}) as any as S.Schema<GenerationConfiguration>;
export type QueryTransformationType = "QUERY_DECOMPOSITION";
export const QueryTransformationType = S.Literal("QUERY_DECOMPOSITION");
export interface QueryTransformationConfiguration {
  type: QueryTransformationType;
}
export const QueryTransformationConfiguration = S.suspend(() =>
  S.Struct({ type: QueryTransformationType }),
).annotations({
  identifier: "QueryTransformationConfiguration",
}) as any as S.Schema<QueryTransformationConfiguration>;
export interface OrchestrationConfiguration {
  promptTemplate?: PromptTemplate;
  inferenceConfig?: InferenceConfig;
  additionalModelRequestFields?: { [key: string]: any };
  queryTransformationConfiguration?: QueryTransformationConfiguration;
  performanceConfig?: PerformanceConfiguration;
}
export const OrchestrationConfiguration = S.suspend(() =>
  S.Struct({
    promptTemplate: S.optional(PromptTemplate),
    inferenceConfig: S.optional(InferenceConfig),
    additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
    queryTransformationConfiguration: S.optional(
      QueryTransformationConfiguration,
    ),
    performanceConfig: S.optional(PerformanceConfiguration),
  }),
).annotations({
  identifier: "OrchestrationConfiguration",
}) as any as S.Schema<OrchestrationConfiguration>;
export interface KnowledgeBaseRetrieveAndGenerateConfiguration {
  knowledgeBaseId: string;
  modelArn: string;
  retrievalConfiguration?: KnowledgeBaseRetrievalConfiguration;
  generationConfiguration?: GenerationConfiguration;
  orchestrationConfiguration?: OrchestrationConfiguration;
}
export const KnowledgeBaseRetrieveAndGenerateConfiguration = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    modelArn: S.String,
    retrievalConfiguration: S.optional(KnowledgeBaseRetrievalConfiguration),
    generationConfiguration: S.optional(GenerationConfiguration),
    orchestrationConfiguration: S.optional(OrchestrationConfiguration),
  }),
).annotations({
  identifier: "KnowledgeBaseRetrieveAndGenerateConfiguration",
}) as any as S.Schema<KnowledgeBaseRetrieveAndGenerateConfiguration>;
export type ExternalSourceType = "S3" | "BYTE_CONTENT";
export const ExternalSourceType = S.Literal("S3", "BYTE_CONTENT");
export interface S3ObjectDoc {
  uri: string;
}
export const S3ObjectDoc = S.suspend(() =>
  S.Struct({ uri: S.String }),
).annotations({ identifier: "S3ObjectDoc" }) as any as S.Schema<S3ObjectDoc>;
export interface ByteContentDoc {
  identifier: string | redacted.Redacted<string>;
  contentType: string;
  data: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const ByteContentDoc = S.suspend(() =>
  S.Struct({
    identifier: SensitiveString,
    contentType: S.String,
    data: SensitiveBlob,
  }),
).annotations({
  identifier: "ByteContentDoc",
}) as any as S.Schema<ByteContentDoc>;
export interface ExternalSource {
  sourceType: ExternalSourceType;
  s3Location?: S3ObjectDoc;
  byteContent?: ByteContentDoc;
}
export const ExternalSource = S.suspend(() =>
  S.Struct({
    sourceType: ExternalSourceType,
    s3Location: S.optional(S3ObjectDoc),
    byteContent: S.optional(ByteContentDoc),
  }),
).annotations({
  identifier: "ExternalSource",
}) as any as S.Schema<ExternalSource>;
export type ExternalSources = ExternalSource[];
export const ExternalSources = S.Array(ExternalSource);
export interface ExternalSourcesGenerationConfiguration {
  promptTemplate?: PromptTemplate;
  guardrailConfiguration?: GuardrailConfiguration;
  inferenceConfig?: InferenceConfig;
  additionalModelRequestFields?: { [key: string]: any };
  performanceConfig?: PerformanceConfiguration;
}
export const ExternalSourcesGenerationConfiguration = S.suspend(() =>
  S.Struct({
    promptTemplate: S.optional(PromptTemplate),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
    inferenceConfig: S.optional(InferenceConfig),
    additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
    performanceConfig: S.optional(PerformanceConfiguration),
  }),
).annotations({
  identifier: "ExternalSourcesGenerationConfiguration",
}) as any as S.Schema<ExternalSourcesGenerationConfiguration>;
export interface ExternalSourcesRetrieveAndGenerateConfiguration {
  modelArn: string;
  sources: ExternalSource[];
  generationConfiguration?: ExternalSourcesGenerationConfiguration;
}
export const ExternalSourcesRetrieveAndGenerateConfiguration = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    sources: ExternalSources,
    generationConfiguration: S.optional(ExternalSourcesGenerationConfiguration),
  }),
).annotations({
  identifier: "ExternalSourcesRetrieveAndGenerateConfiguration",
}) as any as S.Schema<ExternalSourcesRetrieveAndGenerateConfiguration>;
export interface RetrieveAndGenerateConfiguration {
  type: RetrieveAndGenerateType;
  knowledgeBaseConfiguration?: KnowledgeBaseRetrieveAndGenerateConfiguration;
  externalSourcesConfiguration?: ExternalSourcesRetrieveAndGenerateConfiguration;
}
export const RetrieveAndGenerateConfiguration = S.suspend(() =>
  S.Struct({
    type: RetrieveAndGenerateType,
    knowledgeBaseConfiguration: S.optional(
      KnowledgeBaseRetrieveAndGenerateConfiguration,
    ),
    externalSourcesConfiguration: S.optional(
      ExternalSourcesRetrieveAndGenerateConfiguration,
    ),
  }),
).annotations({
  identifier: "RetrieveAndGenerateConfiguration",
}) as any as S.Schema<RetrieveAndGenerateConfiguration>;
export interface RetrieveAndGenerateSessionConfiguration {
  kmsKeyArn: string;
}
export const RetrieveAndGenerateSessionConfiguration = S.suspend(() =>
  S.Struct({ kmsKeyArn: S.String }),
).annotations({
  identifier: "RetrieveAndGenerateSessionConfiguration",
}) as any as S.Schema<RetrieveAndGenerateSessionConfiguration>;
export interface RetrieveAndGenerateStreamRequest {
  sessionId?: string;
  input: RetrieveAndGenerateInput;
  retrieveAndGenerateConfiguration?: RetrieveAndGenerateConfiguration;
  sessionConfiguration?: RetrieveAndGenerateSessionConfiguration;
}
export const RetrieveAndGenerateStreamRequest = S.suspend(() =>
  S.Struct({
    sessionId: S.optional(S.String),
    input: RetrieveAndGenerateInput,
    retrieveAndGenerateConfiguration: S.optional(
      RetrieveAndGenerateConfiguration,
    ),
    sessionConfiguration: S.optional(RetrieveAndGenerateSessionConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/retrieveAndGenerateStream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RetrieveAndGenerateStreamRequest",
}) as any as S.Schema<RetrieveAndGenerateStreamRequest>;
export interface GetSessionRequest {
  sessionIdentifier: string;
}
export const GetSessionRequest = S.suspend(() =>
  S.Struct({
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sessions/{sessionIdentifier}/" }),
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
export type SessionMetadataMap = { [key: string]: string };
export const SessionMetadataMap = S.Record({ key: S.String, value: S.String });
export interface UpdateSessionRequest {
  sessionMetadata?: { [key: string]: string };
  sessionIdentifier: string;
}
export const UpdateSessionRequest = S.suspend(() =>
  S.Struct({
    sessionMetadata: S.optional(SessionMetadataMap),
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/sessions/{sessionIdentifier}/" }),
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
export interface DeleteSessionRequest {
  sessionIdentifier: string;
}
export const DeleteSessionRequest = S.suspend(() =>
  S.Struct({
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/sessions/{sessionIdentifier}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSessionRequest",
}) as any as S.Schema<DeleteSessionRequest>;
export interface DeleteSessionResponse {}
export const DeleteSessionResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteSessionResponse",
}) as any as S.Schema<DeleteSessionResponse>;
export interface ListSessionsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListSessionsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/sessions/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSessionsRequest",
}) as any as S.Schema<ListSessionsRequest>;
export interface EndSessionRequest {
  sessionIdentifier: string;
}
export const EndSessionRequest = S.suspend(() =>
  S.Struct({
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/sessions/{sessionIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EndSessionRequest",
}) as any as S.Schema<EndSessionRequest>;
export interface CreateInvocationRequest {
  invocationId?: string;
  description?: string;
  sessionIdentifier: string;
}
export const CreateInvocationRequest = S.suspend(() =>
  S.Struct({
    invocationId: S.optional(S.String),
    description: S.optional(S.String),
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateInvocationRequest",
}) as any as S.Schema<CreateInvocationRequest>;
export interface ListInvocationsRequest {
  nextToken?: string;
  maxResults?: number;
  sessionIdentifier: string;
}
export const ListInvocationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListInvocationsRequest",
}) as any as S.Schema<ListInvocationsRequest>;
export interface GetInvocationStepRequest {
  invocationIdentifier: string;
  invocationStepId: string;
  sessionIdentifier: string;
}
export const GetInvocationStepRequest = S.suspend(() =>
  S.Struct({
    invocationIdentifier: S.String,
    invocationStepId: S.String.pipe(T.HttpLabel("invocationStepId")),
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetInvocationStepRequest",
}) as any as S.Schema<GetInvocationStepRequest>;
export interface ListInvocationStepsRequest {
  invocationIdentifier?: string;
  nextToken?: string;
  maxResults?: number;
  sessionIdentifier: string;
}
export const ListInvocationStepsRequest = S.suspend(() =>
  S.Struct({
    invocationIdentifier: S.optional(S.String),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListInvocationStepsRequest",
}) as any as S.Schema<ListInvocationStepsRequest>;
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
export type TagsMap = { [key: string]: string };
export const TagsMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagsMap,
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
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
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
export type InputQueryType = "TEXT";
export const InputQueryType = S.Literal("TEXT");
export type QueryTransformationMode = "TEXT_TO_SQL";
export const QueryTransformationMode = S.Literal("TEXT_TO_SQL");
export type ActionGroupSignature =
  | "AMAZON.UserInput"
  | "AMAZON.CodeInterpreter"
  | "ANTHROPIC.Computer"
  | "ANTHROPIC.Bash"
  | "ANTHROPIC.TextEditor";
export const ActionGroupSignature = S.Literal(
  "AMAZON.UserInput",
  "AMAZON.CodeInterpreter",
  "ANTHROPIC.Computer",
  "ANTHROPIC.Bash",
  "ANTHROPIC.TextEditor",
);
export type RelayConversationHistory = "TO_COLLABORATOR" | "DISABLED";
export const RelayConversationHistory = S.Literal(
  "TO_COLLABORATOR",
  "DISABLED",
);
export type RerankQueryContentType = "TEXT";
export const RerankQueryContentType = S.Literal("TEXT");
export type RerankSourceType = "INLINE";
export const RerankSourceType = S.Literal("INLINE");
export type RerankingConfigurationType = "BEDROCK_RERANKING_MODEL";
export const RerankingConfigurationType = S.Literal("BEDROCK_RERANKING_MODEL");
export type KnowledgeBaseQueryType = "TEXT" | "IMAGE";
export const KnowledgeBaseQueryType = S.Literal("TEXT", "IMAGE");
export type FlowExecutionStatus =
  | "Running"
  | "Succeeded"
  | "Failed"
  | "TimedOut"
  | "Aborted";
export const FlowExecutionStatus = S.Literal(
  "Running",
  "Succeeded",
  "Failed",
  "TimedOut",
  "Aborted",
);
export interface QueryGenerationInput {
  type: InputQueryType;
  text: string;
}
export const QueryGenerationInput = S.suspend(() =>
  S.Struct({ type: InputQueryType, text: S.String }),
).annotations({
  identifier: "QueryGenerationInput",
}) as any as S.Schema<QueryGenerationInput>;
export interface BedrockModelConfigurations {
  performanceConfig?: PerformanceConfiguration;
}
export const BedrockModelConfigurations = S.suspend(() =>
  S.Struct({ performanceConfig: S.optional(PerformanceConfiguration) }),
).annotations({
  identifier: "BedrockModelConfigurations",
}) as any as S.Schema<BedrockModelConfigurations>;
export interface StreamingConfigurations {
  streamFinalResponse?: boolean;
  applyGuardrailInterval?: number;
}
export const StreamingConfigurations = S.suspend(() =>
  S.Struct({
    streamFinalResponse: S.optional(S.Boolean),
    applyGuardrailInterval: S.optional(S.Number),
  }),
).annotations({
  identifier: "StreamingConfigurations",
}) as any as S.Schema<StreamingConfigurations>;
export interface PromptCreationConfigurations {
  previousConversationTurnsToInclude?: number;
  excludePreviousThinkingSteps?: boolean;
}
export const PromptCreationConfigurations = S.suspend(() =>
  S.Struct({
    previousConversationTurnsToInclude: S.optional(S.Number),
    excludePreviousThinkingSteps: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PromptCreationConfigurations",
}) as any as S.Schema<PromptCreationConfigurations>;
export interface KnowledgeBase {
  knowledgeBaseId: string;
  description: string | redacted.Redacted<string>;
  retrievalConfiguration?: KnowledgeBaseRetrievalConfiguration;
}
export const KnowledgeBase = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    description: SensitiveString,
    retrievalConfiguration: S.optional(KnowledgeBaseRetrievalConfiguration),
  }),
).annotations({
  identifier: "KnowledgeBase",
}) as any as S.Schema<KnowledgeBase>;
export type KnowledgeBases = KnowledgeBase[];
export const KnowledgeBases = S.Array(KnowledgeBase);
export interface GuardrailConfigurationWithArn {
  guardrailIdentifier: string;
  guardrailVersion: string;
}
export const GuardrailConfigurationWithArn = S.suspend(() =>
  S.Struct({ guardrailIdentifier: S.String, guardrailVersion: S.String }),
).annotations({
  identifier: "GuardrailConfigurationWithArn",
}) as any as S.Schema<GuardrailConfigurationWithArn>;
export interface CollaboratorConfiguration {
  collaboratorName: string | redacted.Redacted<string>;
  collaboratorInstruction: string | redacted.Redacted<string>;
  agentAliasArn?: string;
  relayConversationHistory?: RelayConversationHistory;
}
export const CollaboratorConfiguration = S.suspend(() =>
  S.Struct({
    collaboratorName: SensitiveString,
    collaboratorInstruction: SensitiveString,
    agentAliasArn: S.optional(S.String),
    relayConversationHistory: S.optional(RelayConversationHistory),
  }),
).annotations({
  identifier: "CollaboratorConfiguration",
}) as any as S.Schema<CollaboratorConfiguration>;
export type CollaboratorConfigurations = CollaboratorConfiguration[];
export const CollaboratorConfigurations = S.Array(CollaboratorConfiguration);
export type SessionAttributesMap = { [key: string]: string };
export const SessionAttributesMap = S.Record({
  key: S.String,
  value: S.String,
});
export type PromptSessionAttributesMap = { [key: string]: string };
export const PromptSessionAttributesMap = S.Record({
  key: S.String,
  value: S.String,
});
export type ConfirmationState = "CONFIRM" | "DENY";
export const ConfirmationState = S.Literal("CONFIRM", "DENY");
export type ResponseState = "FAILURE" | "REPROMPT";
export const ResponseState = S.Literal("FAILURE", "REPROMPT");
export type ImageInputFormat = "png" | "jpeg" | "gif" | "webp";
export const ImageInputFormat = S.Literal("png", "jpeg", "gif", "webp");
export type ImageInputSource = { bytes: Uint8Array };
export const ImageInputSource = S.Union(S.Struct({ bytes: T.Blob }));
export interface ImageInput {
  format: ImageInputFormat;
  source: ImageInputSource;
}
export const ImageInput = S.suspend(() =>
  S.Struct({ format: ImageInputFormat, source: ImageInputSource }),
).annotations({ identifier: "ImageInput" }) as any as S.Schema<ImageInput>;
export type ImageInputs = ImageInput[];
export const ImageInputs = S.Array(ImageInput);
export interface ContentBody {
  body?: string;
  images?: ImageInput[];
}
export const ContentBody = S.suspend(() =>
  S.Struct({ body: S.optional(S.String), images: S.optional(ImageInputs) }),
).annotations({ identifier: "ContentBody" }) as any as S.Schema<ContentBody>;
export type ResponseBody = { [key: string]: ContentBody };
export const ResponseBody = S.Record({ key: S.String, value: ContentBody });
export interface ApiResult {
  actionGroup: string;
  httpMethod?: string;
  apiPath?: string | redacted.Redacted<string>;
  confirmationState?: ConfirmationState;
  responseState?: ResponseState;
  httpStatusCode?: number;
  responseBody?: { [key: string]: ContentBody };
  agentId?: string;
}
export const ApiResult = S.suspend(() =>
  S.Struct({
    actionGroup: S.String,
    httpMethod: S.optional(S.String),
    apiPath: S.optional(SensitiveString),
    confirmationState: S.optional(ConfirmationState),
    responseState: S.optional(ResponseState),
    httpStatusCode: S.optional(S.Number),
    responseBody: S.optional(ResponseBody),
    agentId: S.optional(S.String),
  }),
).annotations({ identifier: "ApiResult" }) as any as S.Schema<ApiResult>;
export interface FunctionResult {
  actionGroup: string;
  confirmationState?: ConfirmationState;
  function?: string;
  responseBody?: { [key: string]: ContentBody };
  responseState?: ResponseState;
  agentId?: string;
}
export const FunctionResult = S.suspend(() =>
  S.Struct({
    actionGroup: S.String,
    confirmationState: S.optional(ConfirmationState),
    function: S.optional(S.String),
    responseBody: S.optional(ResponseBody),
    responseState: S.optional(ResponseState),
    agentId: S.optional(S.String),
  }),
).annotations({
  identifier: "FunctionResult",
}) as any as S.Schema<FunctionResult>;
export type InvocationResultMember =
  | { apiResult: ApiResult }
  | { functionResult: FunctionResult };
export const InvocationResultMember = S.Union(
  S.Struct({ apiResult: ApiResult }),
  S.Struct({ functionResult: FunctionResult }),
);
export type ReturnControlInvocationResults = InvocationResultMember[];
export const ReturnControlInvocationResults = S.Array(InvocationResultMember);
export type FileSourceType = "S3" | "BYTE_CONTENT";
export const FileSourceType = S.Literal("S3", "BYTE_CONTENT");
export interface S3ObjectFile {
  uri: string;
}
export const S3ObjectFile = S.suspend(() =>
  S.Struct({ uri: S.String }),
).annotations({ identifier: "S3ObjectFile" }) as any as S.Schema<S3ObjectFile>;
export interface ByteContentFile {
  mediaType: string;
  data: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const ByteContentFile = S.suspend(() =>
  S.Struct({ mediaType: S.String, data: SensitiveBlob }),
).annotations({
  identifier: "ByteContentFile",
}) as any as S.Schema<ByteContentFile>;
export interface FileSource {
  sourceType: FileSourceType;
  s3Location?: S3ObjectFile;
  byteContent?: ByteContentFile;
}
export const FileSource = S.suspend(() =>
  S.Struct({
    sourceType: FileSourceType,
    s3Location: S.optional(S3ObjectFile),
    byteContent: S.optional(ByteContentFile),
  }),
).annotations({ identifier: "FileSource" }) as any as S.Schema<FileSource>;
export type FileUseCase = "CODE_INTERPRETER" | "CHAT";
export const FileUseCase = S.Literal("CODE_INTERPRETER", "CHAT");
export interface InputFile {
  name: string;
  source: FileSource;
  useCase: FileUseCase;
}
export const InputFile = S.suspend(() =>
  S.Struct({ name: S.String, source: FileSource, useCase: FileUseCase }),
).annotations({ identifier: "InputFile" }) as any as S.Schema<InputFile>;
export type InputFiles = InputFile[];
export const InputFiles = S.Array(InputFile);
export type ConversationRole = "user" | "assistant";
export const ConversationRole = S.Literal("user", "assistant");
export type ContentBlock = { text: string };
export const ContentBlock = S.Union(S.Struct({ text: S.String }));
export type ContentBlocks = ContentBlock[];
export const ContentBlocks = S.Array(ContentBlock);
export interface Message {
  role: ConversationRole;
  content: ContentBlock[];
}
export const Message = S.suspend(() =>
  S.Struct({ role: ConversationRole, content: ContentBlocks }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export type Messages = Message[];
export const Messages = S.Array(Message);
export interface ConversationHistory {
  messages?: Message[];
}
export const ConversationHistory = S.suspend(() =>
  S.Struct({ messages: S.optional(Messages) }),
).annotations({
  identifier: "ConversationHistory",
}) as any as S.Schema<ConversationHistory>;
export interface InlineSessionState {
  sessionAttributes?: { [key: string]: string };
  promptSessionAttributes?: { [key: string]: string };
  returnControlInvocationResults?: InvocationResultMember[];
  invocationId?: string;
  files?: InputFile[];
  conversationHistory?: ConversationHistory;
}
export const InlineSessionState = S.suspend(() =>
  S.Struct({
    sessionAttributes: S.optional(SessionAttributesMap),
    promptSessionAttributes: S.optional(PromptSessionAttributesMap),
    returnControlInvocationResults: S.optional(ReturnControlInvocationResults),
    invocationId: S.optional(S.String),
    files: S.optional(InputFiles),
    conversationHistory: S.optional(ConversationHistory),
  }),
).annotations({
  identifier: "InlineSessionState",
}) as any as S.Schema<InlineSessionState>;
export type CustomControlMethod = "RETURN_CONTROL";
export const CustomControlMethod = S.Literal("RETURN_CONTROL");
export type ActionGroupExecutor =
  | { lambda: string }
  | { customControl: CustomControlMethod };
export const ActionGroupExecutor = S.Union(
  S.Struct({ lambda: S.String }),
  S.Struct({ customControl: CustomControlMethod }),
);
export interface S3Identifier {
  s3BucketName?: string;
  s3ObjectKey?: string;
}
export const S3Identifier = S.suspend(() =>
  S.Struct({
    s3BucketName: S.optional(S.String),
    s3ObjectKey: S.optional(S.String),
  }),
).annotations({ identifier: "S3Identifier" }) as any as S.Schema<S3Identifier>;
export type APISchema =
  | { s3: S3Identifier }
  | { payload: string | redacted.Redacted<string> };
export const APISchema = S.Union(
  S.Struct({ s3: S3Identifier }),
  S.Struct({ payload: SensitiveString }),
);
export type ParameterType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "array";
export const ParameterType = S.Literal(
  "string",
  "number",
  "integer",
  "boolean",
  "array",
);
export interface ParameterDetail {
  description?: string;
  type: ParameterType;
  required?: boolean;
}
export const ParameterDetail = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    type: ParameterType,
    required: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ParameterDetail",
}) as any as S.Schema<ParameterDetail>;
export type ParameterMap = { [key: string]: ParameterDetail };
export const ParameterMap = S.Record({ key: S.String, value: ParameterDetail });
export type RequireConfirmation = "ENABLED" | "DISABLED";
export const RequireConfirmation = S.Literal("ENABLED", "DISABLED");
export interface FunctionDefinition {
  name: string | redacted.Redacted<string>;
  description?: string;
  parameters?: { [key: string]: ParameterDetail };
  requireConfirmation?: RequireConfirmation;
}
export const FunctionDefinition = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(S.String),
    parameters: S.optional(ParameterMap),
    requireConfirmation: S.optional(RequireConfirmation),
  }),
).annotations({
  identifier: "FunctionDefinition",
}) as any as S.Schema<FunctionDefinition>;
export type Functions = FunctionDefinition[];
export const Functions = S.Array(FunctionDefinition);
export type FunctionSchema = { functions: FunctionDefinition[] };
export const FunctionSchema = S.Union(S.Struct({ functions: Functions }));
export type ActionGroupSignatureParams = { [key: string]: string };
export const ActionGroupSignatureParams = S.Record({
  key: S.String,
  value: S.String,
});
export interface AgentActionGroup {
  actionGroupName: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  parentActionGroupSignature?: ActionGroupSignature;
  actionGroupExecutor?: ActionGroupExecutor;
  apiSchema?: APISchema;
  functionSchema?: FunctionSchema;
  parentActionGroupSignatureParams?: { [key: string]: string };
}
export const AgentActionGroup = S.suspend(() =>
  S.Struct({
    actionGroupName: SensitiveString,
    description: S.optional(SensitiveString),
    parentActionGroupSignature: S.optional(ActionGroupSignature),
    actionGroupExecutor: S.optional(ActionGroupExecutor),
    apiSchema: S.optional(APISchema),
    functionSchema: S.optional(FunctionSchema),
    parentActionGroupSignatureParams: S.optional(ActionGroupSignatureParams),
  }),
).annotations({
  identifier: "AgentActionGroup",
}) as any as S.Schema<AgentActionGroup>;
export type AgentActionGroups = AgentActionGroup[];
export const AgentActionGroups = S.Array(AgentActionGroup);
export type PromptType =
  | "PRE_PROCESSING"
  | "ORCHESTRATION"
  | "KNOWLEDGE_BASE_RESPONSE_GENERATION"
  | "POST_PROCESSING"
  | "ROUTING_CLASSIFIER";
export const PromptType = S.Literal(
  "PRE_PROCESSING",
  "ORCHESTRATION",
  "KNOWLEDGE_BASE_RESPONSE_GENERATION",
  "POST_PROCESSING",
  "ROUTING_CLASSIFIER",
);
export type CreationMode = "DEFAULT" | "OVERRIDDEN";
export const CreationMode = S.Literal("DEFAULT", "OVERRIDDEN");
export type PromptState = "ENABLED" | "DISABLED";
export const PromptState = S.Literal("ENABLED", "DISABLED");
export type StopSequences = string[];
export const StopSequences = S.Array(S.String);
export interface InferenceConfiguration {
  temperature?: number;
  topP?: number;
  topK?: number;
  maximumLength?: number;
  stopSequences?: string[];
}
export const InferenceConfiguration = S.suspend(() =>
  S.Struct({
    temperature: S.optional(S.Number),
    topP: S.optional(S.Number),
    topK: S.optional(S.Number),
    maximumLength: S.optional(S.Number),
    stopSequences: S.optional(StopSequences),
  }),
).annotations({
  identifier: "InferenceConfiguration",
}) as any as S.Schema<InferenceConfiguration>;
export interface PromptConfiguration {
  promptType?: PromptType;
  promptCreationMode?: CreationMode;
  promptState?: PromptState;
  basePromptTemplate?: string | redacted.Redacted<string>;
  inferenceConfiguration?: InferenceConfiguration;
  parserMode?: CreationMode;
  foundationModel?: string;
  additionalModelRequestFields?: any;
}
export const PromptConfiguration = S.suspend(() =>
  S.Struct({
    promptType: S.optional(PromptType),
    promptCreationMode: S.optional(CreationMode),
    promptState: S.optional(PromptState),
    basePromptTemplate: S.optional(SensitiveString),
    inferenceConfiguration: S.optional(InferenceConfiguration),
    parserMode: S.optional(CreationMode),
    foundationModel: S.optional(S.String),
    additionalModelRequestFields: S.optional(S.Any),
  }),
).annotations({
  identifier: "PromptConfiguration",
}) as any as S.Schema<PromptConfiguration>;
export type PromptConfigurations = PromptConfiguration[];
export const PromptConfigurations = S.Array(PromptConfiguration);
export interface PromptOverrideConfiguration {
  promptConfigurations: PromptConfiguration[];
  overrideLambda?: string;
}
export const PromptOverrideConfiguration = S.suspend(() =>
  S.Struct({
    promptConfigurations: PromptConfigurations,
    overrideLambda: S.optional(S.String),
  }),
).annotations({
  identifier: "PromptOverrideConfiguration",
}) as any as S.Schema<PromptOverrideConfiguration>;
export interface Collaborator {
  customerEncryptionKeyArn?: string;
  foundationModel: string;
  instruction: string | redacted.Redacted<string>;
  idleSessionTTLInSeconds?: number;
  actionGroups?: AgentActionGroup[];
  knowledgeBases?: KnowledgeBase[];
  guardrailConfiguration?: GuardrailConfigurationWithArn;
  promptOverrideConfiguration?: PromptOverrideConfiguration;
  agentCollaboration?: AgentCollaboration;
  collaboratorConfigurations?: CollaboratorConfiguration[];
  agentName?: string | redacted.Redacted<string>;
}
export const Collaborator = S.suspend(() =>
  S.Struct({
    customerEncryptionKeyArn: S.optional(S.String),
    foundationModel: S.String,
    instruction: SensitiveString,
    idleSessionTTLInSeconds: S.optional(S.Number),
    actionGroups: S.optional(AgentActionGroups),
    knowledgeBases: S.optional(KnowledgeBases),
    guardrailConfiguration: S.optional(GuardrailConfigurationWithArn),
    promptOverrideConfiguration: S.optional(PromptOverrideConfiguration),
    agentCollaboration: S.optional(AgentCollaboration),
    collaboratorConfigurations: S.optional(CollaboratorConfigurations),
    agentName: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Collaborator" }) as any as S.Schema<Collaborator>;
export type Collaborators = Collaborator[];
export const Collaborators = S.Array(Collaborator);
export interface InlineBedrockModelConfigurations {
  performanceConfig?: PerformanceConfiguration;
}
export const InlineBedrockModelConfigurations = S.suspend(() =>
  S.Struct({ performanceConfig: S.optional(PerformanceConfiguration) }),
).annotations({
  identifier: "InlineBedrockModelConfigurations",
}) as any as S.Schema<InlineBedrockModelConfigurations>;
export type SessionStatus = "ACTIVE" | "EXPIRED" | "ENDED";
export const SessionStatus = S.Literal("ACTIVE", "EXPIRED", "ENDED");
export type TextToSqlConfigurationType = "KNOWLEDGE_BASE";
export const TextToSqlConfigurationType = S.Literal("KNOWLEDGE_BASE");
export type RerankDocumentType = "TEXT" | "JSON";
export const RerankDocumentType = S.Literal("TEXT", "JSON");
export type InputImageFormat = "png" | "jpeg" | "gif" | "webp";
export const InputImageFormat = S.Literal("png", "jpeg", "gif", "webp");
export interface GetExecutionFlowSnapshotResponse {
  flowIdentifier: string;
  flowAliasIdentifier: string;
  flowVersion: string;
  executionRoleArn: string;
  definition: string;
  customerEncryptionKeyArn?: string;
}
export const GetExecutionFlowSnapshotResponse = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String,
    flowAliasIdentifier: S.String,
    flowVersion: S.String,
    executionRoleArn: S.String,
    definition: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetExecutionFlowSnapshotResponse",
}) as any as S.Schema<GetExecutionFlowSnapshotResponse>;
export interface StopFlowExecutionResponse {
  executionArn?: string;
  status: FlowExecutionStatus;
}
export const StopFlowExecutionResponse = S.suspend(() =>
  S.Struct({ executionArn: S.optional(S.String), status: FlowExecutionStatus }),
).annotations({
  identifier: "StopFlowExecutionResponse",
}) as any as S.Schema<StopFlowExecutionResponse>;
export interface CreateSessionRequest {
  sessionMetadata?: { [key: string]: string };
  encryptionKeyArn?: string;
  tags?: { [key: string]: string };
}
export const CreateSessionRequest = S.suspend(() =>
  S.Struct({
    sessionMetadata: S.optional(SessionMetadataMap),
    encryptionKeyArn: S.optional(S.String),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/sessions/" }),
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
export interface GetSessionResponse {
  sessionId: string;
  sessionArn: string;
  sessionStatus: SessionStatus;
  createdAt: Date;
  lastUpdatedAt: Date;
  sessionMetadata?: { [key: string]: string };
  encryptionKeyArn?: string;
}
export const GetSessionResponse = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    sessionArn: S.String,
    sessionStatus: SessionStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    sessionMetadata: S.optional(SessionMetadataMap),
    encryptionKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSessionResponse",
}) as any as S.Schema<GetSessionResponse>;
export interface UpdateSessionResponse {
  sessionId: string;
  sessionArn: string;
  sessionStatus: SessionStatus;
  createdAt: Date;
  lastUpdatedAt: Date;
}
export const UpdateSessionResponse = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    sessionArn: S.String,
    sessionStatus: SessionStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateSessionResponse",
}) as any as S.Schema<UpdateSessionResponse>;
export interface EndSessionResponse {
  sessionId: string;
  sessionArn: string;
  sessionStatus: SessionStatus;
}
export const EndSessionResponse = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    sessionArn: S.String,
    sessionStatus: SessionStatus,
  }),
).annotations({
  identifier: "EndSessionResponse",
}) as any as S.Schema<EndSessionResponse>;
export interface CreateInvocationResponse {
  sessionId: string;
  invocationId: string;
  createdAt: Date;
}
export const CreateInvocationResponse = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    invocationId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateInvocationResponse",
}) as any as S.Schema<CreateInvocationResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagsMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export type FlowExecutionErrorType = "ExecutionTimedOut";
export const FlowExecutionErrorType = S.Literal("ExecutionTimedOut");
export interface KnowledgeBaseConfiguration {
  knowledgeBaseId: string;
  retrievalConfiguration: KnowledgeBaseRetrievalConfiguration;
}
export const KnowledgeBaseConfiguration = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    retrievalConfiguration: KnowledgeBaseRetrievalConfiguration,
  }),
).annotations({
  identifier: "KnowledgeBaseConfiguration",
}) as any as S.Schema<KnowledgeBaseConfiguration>;
export type KnowledgeBaseConfigurations = KnowledgeBaseConfiguration[];
export const KnowledgeBaseConfigurations = S.Array(KnowledgeBaseConfiguration);
export type OrchestrationExecutor = { lambda: string };
export const OrchestrationExecutor = S.Union(S.Struct({ lambda: S.String }));
export interface TextPrompt {
  text: string;
}
export const TextPrompt = S.suspend(() =>
  S.Struct({ text: S.String }),
).annotations({ identifier: "TextPrompt" }) as any as S.Schema<TextPrompt>;
export interface RerankTextDocument {
  text?: string;
}
export const RerankTextDocument = S.suspend(() =>
  S.Struct({ text: S.optional(S.String) }),
).annotations({
  identifier: "RerankTextDocument",
}) as any as S.Schema<RerankTextDocument>;
export interface RerankDocument {
  type: RerankDocumentType;
  textDocument?: RerankTextDocument;
  jsonDocument?: any;
}
export const RerankDocument = S.suspend(() =>
  S.Struct({
    type: RerankDocumentType,
    textDocument: S.optional(RerankTextDocument),
    jsonDocument: S.optional(S.Any),
  }),
).annotations({
  identifier: "RerankDocument",
}) as any as S.Schema<RerankDocument>;
export interface InputImage {
  format: InputImageFormat;
  inlineContent: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const InputImage = S.suspend(() =>
  S.Struct({ format: InputImageFormat, inlineContent: SensitiveBlob }),
).annotations({ identifier: "InputImage" }) as any as S.Schema<InputImage>;
export type RetrievalFilterList = RetrievalFilter[];
export const RetrievalFilterList = S.Array(
  S.suspend(() => RetrievalFilter).annotations({
    identifier: "RetrievalFilter",
  }),
) as any as S.Schema<RetrievalFilterList>;
export type ImageFormat = "png" | "jpeg" | "gif" | "webp";
export const ImageFormat = S.Literal("png", "jpeg", "gif", "webp");
export interface FlowExecutionError {
  nodeName?: string;
  error?: FlowExecutionErrorType;
  message?: string;
}
export const FlowExecutionError = S.suspend(() =>
  S.Struct({
    nodeName: S.optional(S.String),
    error: S.optional(FlowExecutionErrorType),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "FlowExecutionError",
}) as any as S.Schema<FlowExecutionError>;
export type FlowExecutionErrors = FlowExecutionError[];
export const FlowExecutionErrors = S.Array(FlowExecutionError);
export interface FlowExecutionSummary {
  executionArn: string;
  flowAliasIdentifier: string;
  flowIdentifier: string;
  flowVersion: string;
  status: FlowExecutionStatus;
  createdAt: Date;
  endedAt?: Date;
}
export const FlowExecutionSummary = S.suspend(() =>
  S.Struct({
    executionArn: S.String,
    flowAliasIdentifier: S.String,
    flowIdentifier: S.String,
    flowVersion: S.String,
    status: FlowExecutionStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "FlowExecutionSummary",
}) as any as S.Schema<FlowExecutionSummary>;
export type FlowExecutionSummaries = FlowExecutionSummary[];
export const FlowExecutionSummaries = S.Array(FlowExecutionSummary);
export interface CustomOrchestration {
  executor?: OrchestrationExecutor;
}
export const CustomOrchestration = S.suspend(() =>
  S.Struct({ executor: S.optional(OrchestrationExecutor) }),
).annotations({
  identifier: "CustomOrchestration",
}) as any as S.Schema<CustomOrchestration>;
export type InputPrompt = { textPrompt: TextPrompt };
export const InputPrompt = S.Union(S.Struct({ textPrompt: TextPrompt }));
export interface RerankQuery {
  type: RerankQueryContentType;
  textQuery: RerankTextDocument;
}
export const RerankQuery = S.suspend(() =>
  S.Struct({ type: RerankQueryContentType, textQuery: RerankTextDocument }),
).annotations({ identifier: "RerankQuery" }) as any as S.Schema<RerankQuery>;
export type RerankQueriesList = RerankQuery[];
export const RerankQueriesList = S.Array(RerankQuery);
export interface RerankSource {
  type: RerankSourceType;
  inlineDocumentSource: RerankDocument;
}
export const RerankSource = S.suspend(() =>
  S.Struct({ type: RerankSourceType, inlineDocumentSource: RerankDocument }),
).annotations({ identifier: "RerankSource" }) as any as S.Schema<RerankSource>;
export type RerankSourcesList = RerankSource[];
export const RerankSourcesList = S.Array(RerankSource);
export interface KnowledgeBaseQuery {
  type?: KnowledgeBaseQueryType;
  text?: string;
  image?: InputImage;
}
export const KnowledgeBaseQuery = S.suspend(() =>
  S.Struct({
    type: S.optional(KnowledgeBaseQueryType),
    text: S.optional(S.String),
    image: S.optional(InputImage),
  }),
).annotations({
  identifier: "KnowledgeBaseQuery",
}) as any as S.Schema<KnowledgeBaseQuery>;
export interface SessionSummary {
  sessionId: string;
  sessionArn: string;
  sessionStatus: SessionStatus;
  createdAt: Date;
  lastUpdatedAt: Date;
}
export const SessionSummary = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    sessionArn: S.String,
    sessionStatus: SessionStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "SessionSummary",
}) as any as S.Schema<SessionSummary>;
export type SessionSummaries = SessionSummary[];
export const SessionSummaries = S.Array(SessionSummary);
export interface InvocationSummary {
  sessionId: string;
  invocationId: string;
  createdAt: Date;
}
export const InvocationSummary = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    invocationId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "InvocationSummary",
}) as any as S.Schema<InvocationSummary>;
export type InvocationSummaries = InvocationSummary[];
export const InvocationSummaries = S.Array(InvocationSummary);
export interface S3Location {
  uri: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ uri: S.String }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export type ImageSource = { bytes: Uint8Array } | { s3Location: S3Location };
export const ImageSource = S.Union(
  S.Struct({ bytes: T.Blob }),
  S.Struct({ s3Location: S3Location }),
);
export interface ImageBlock {
  format: ImageFormat;
  source: ImageSource;
}
export const ImageBlock = S.suspend(() =>
  S.Struct({ format: ImageFormat, source: ImageSource }),
).annotations({ identifier: "ImageBlock" }) as any as S.Schema<ImageBlock>;
export type BedrockSessionContentBlock =
  | { text: string }
  | { image: ImageBlock };
export const BedrockSessionContentBlock = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ image: ImageBlock }),
);
export type BedrockSessionContentBlocks = BedrockSessionContentBlock[];
export const BedrockSessionContentBlocks = S.Array(BedrockSessionContentBlock);
export type InvocationStepPayload = {
  contentBlocks: BedrockSessionContentBlock[];
};
export const InvocationStepPayload = S.Union(
  S.Struct({ contentBlocks: BedrockSessionContentBlocks }),
);
export interface InvocationStep {
  sessionId: string;
  invocationId: string;
  invocationStepId: string;
  invocationStepTime: Date;
  payload: InvocationStepPayload;
}
export const InvocationStep = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    invocationId: S.String,
    invocationStepId: S.String,
    invocationStepTime: S.Date.pipe(T.TimestampFormat("date-time")),
    payload: InvocationStepPayload,
  }),
).annotations({
  identifier: "InvocationStep",
}) as any as S.Schema<InvocationStep>;
export interface InvocationStepSummary {
  sessionId: string;
  invocationId: string;
  invocationStepId: string;
  invocationStepTime: Date;
}
export const InvocationStepSummary = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    invocationId: S.String,
    invocationStepId: S.String,
    invocationStepTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "InvocationStepSummary",
}) as any as S.Schema<InvocationStepSummary>;
export type InvocationStepSummaries = InvocationStepSummary[];
export const InvocationStepSummaries = S.Array(InvocationStepSummary);
export type NodeErrorCode =
  | "VALIDATION"
  | "DEPENDENCY_FAILED"
  | "BAD_GATEWAY"
  | "INTERNAL_SERVER";
export const NodeErrorCode = S.Literal(
  "VALIDATION",
  "DEPENDENCY_FAILED",
  "BAD_GATEWAY",
  "INTERNAL_SERVER",
);
export type FlowErrorCode =
  | "VALIDATION"
  | "INTERNAL_SERVER"
  | "NODE_EXECUTION_FAILED";
export const FlowErrorCode = S.Literal(
  "VALIDATION",
  "INTERNAL_SERVER",
  "NODE_EXECUTION_FAILED",
);
export type NodeType =
  | "FlowInputNode"
  | "FlowOutputNode"
  | "LambdaFunctionNode"
  | "KnowledgeBaseNode"
  | "PromptNode"
  | "ConditionNode"
  | "LexNode";
export const NodeType = S.Literal(
  "FlowInputNode",
  "FlowOutputNode",
  "LambdaFunctionNode",
  "KnowledgeBaseNode",
  "PromptNode",
  "ConditionNode",
  "LexNode",
);
export type FlowCompletionReason = "SUCCESS" | "INPUT_REQUIRED";
export const FlowCompletionReason = S.Literal("SUCCESS", "INPUT_REQUIRED");
export interface TextToSqlKnowledgeBaseConfiguration {
  knowledgeBaseArn: string;
}
export const TextToSqlKnowledgeBaseConfiguration = S.suspend(() =>
  S.Struct({ knowledgeBaseArn: S.String }),
).annotations({
  identifier: "TextToSqlKnowledgeBaseConfiguration",
}) as any as S.Schema<TextToSqlKnowledgeBaseConfiguration>;
export type GuadrailAction = "INTERVENED" | "NONE";
export const GuadrailAction = S.Literal("INTERVENED", "NONE");
export interface GetFlowExecutionResponse {
  executionArn: string;
  status: FlowExecutionStatus;
  startedAt: Date;
  endedAt?: Date;
  errors?: FlowExecutionError[];
  flowAliasIdentifier: string;
  flowIdentifier: string;
  flowVersion: string;
}
export const GetFlowExecutionResponse = S.suspend(() =>
  S.Struct({
    executionArn: S.String,
    status: FlowExecutionStatus,
    startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    errors: S.optional(FlowExecutionErrors),
    flowAliasIdentifier: S.String,
    flowIdentifier: S.String,
    flowVersion: S.String,
  }),
).annotations({
  identifier: "GetFlowExecutionResponse",
}) as any as S.Schema<GetFlowExecutionResponse>;
export interface ListFlowExecutionsResponse {
  flowExecutionSummaries: FlowExecutionSummary[];
  nextToken?: string;
}
export const ListFlowExecutionsResponse = S.suspend(() =>
  S.Struct({
    flowExecutionSummaries: FlowExecutionSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFlowExecutionsResponse",
}) as any as S.Schema<ListFlowExecutionsResponse>;
export interface StartFlowExecutionRequest {
  flowIdentifier: string;
  flowAliasIdentifier: string;
  flowExecutionName?: string;
  inputs: FlowInput[];
  modelPerformanceConfiguration?: ModelPerformanceConfiguration;
}
export const StartFlowExecutionRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowAliasIdentifier: S.String.pipe(T.HttpLabel("flowAliasIdentifier")),
    flowExecutionName: S.optional(S.String),
    inputs: FlowInputs,
    modelPerformanceConfiguration: S.optional(ModelPerformanceConfiguration),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartFlowExecutionRequest",
}) as any as S.Schema<StartFlowExecutionRequest>;
export interface OptimizePromptRequest {
  input: InputPrompt;
  targetModelId: string;
}
export const OptimizePromptRequest = S.suspend(() =>
  S.Struct({ input: InputPrompt, targetModelId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/optimize-prompt" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "OptimizePromptRequest",
}) as any as S.Schema<OptimizePromptRequest>;
export interface CreateSessionResponse {
  sessionId: string;
  sessionArn: string;
  sessionStatus: SessionStatus;
  createdAt: Date;
}
export const CreateSessionResponse = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    sessionArn: S.String,
    sessionStatus: SessionStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateSessionResponse",
}) as any as S.Schema<CreateSessionResponse>;
export interface ListSessionsResponse {
  sessionSummaries: SessionSummary[];
  nextToken?: string;
}
export const ListSessionsResponse = S.suspend(() =>
  S.Struct({
    sessionSummaries: SessionSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSessionsResponse",
}) as any as S.Schema<ListSessionsResponse>;
export interface ListInvocationsResponse {
  invocationSummaries: InvocationSummary[];
  nextToken?: string;
}
export const ListInvocationsResponse = S.suspend(() =>
  S.Struct({
    invocationSummaries: InvocationSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInvocationsResponse",
}) as any as S.Schema<ListInvocationsResponse>;
export interface GetInvocationStepResponse {
  invocationStep: InvocationStep;
}
export const GetInvocationStepResponse = S.suspend(() =>
  S.Struct({ invocationStep: InvocationStep }),
).annotations({
  identifier: "GetInvocationStepResponse",
}) as any as S.Schema<GetInvocationStepResponse>;
export interface ListInvocationStepsResponse {
  invocationStepSummaries: InvocationStepSummary[];
  nextToken?: string;
}
export const ListInvocationStepsResponse = S.suspend(() =>
  S.Struct({
    invocationStepSummaries: InvocationStepSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInvocationStepsResponse",
}) as any as S.Schema<ListInvocationStepsResponse>;
export interface NodeFailureEvent {
  nodeName: string;
  timestamp: Date;
  errorCode: NodeErrorCode;
  errorMessage: string;
}
export const NodeFailureEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    errorCode: NodeErrorCode,
    errorMessage: S.String,
  }),
).annotations({
  identifier: "NodeFailureEvent",
}) as any as S.Schema<NodeFailureEvent>;
export interface FlowFailureEvent {
  timestamp: Date;
  errorCode: FlowErrorCode;
  errorMessage: string;
}
export const FlowFailureEvent = S.suspend(() =>
  S.Struct({
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    errorCode: FlowErrorCode,
    errorMessage: S.String,
  }),
).annotations({
  identifier: "FlowFailureEvent",
}) as any as S.Schema<FlowFailureEvent>;
export interface NodeActionEvent {
  nodeName: string;
  timestamp: Date;
  requestId: string;
  serviceName: string;
  operationName: string;
  operationRequest?: any;
  operationResponse?: any;
}
export const NodeActionEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    requestId: S.String,
    serviceName: S.String,
    operationName: S.String,
    operationRequest: S.optional(S.Any),
    operationResponse: S.optional(S.Any),
  }),
).annotations({
  identifier: "NodeActionEvent",
}) as any as S.Schema<NodeActionEvent>;
export interface FlowCompletionEvent {
  completionReason: FlowCompletionReason;
}
export const FlowCompletionEvent = S.suspend(() =>
  S.Struct({ completionReason: FlowCompletionReason }),
).annotations({
  identifier: "FlowCompletionEvent",
}) as any as S.Schema<FlowCompletionEvent>;
export interface TextToSqlConfiguration {
  type: TextToSqlConfigurationType;
  knowledgeBaseConfiguration?: TextToSqlKnowledgeBaseConfiguration;
}
export const TextToSqlConfiguration = S.suspend(() =>
  S.Struct({
    type: TextToSqlConfigurationType,
    knowledgeBaseConfiguration: S.optional(TextToSqlKnowledgeBaseConfiguration),
  }),
).annotations({
  identifier: "TextToSqlConfiguration",
}) as any as S.Schema<TextToSqlConfiguration>;
export interface MemorySessionSummary {
  memoryId?: string;
  sessionId?: string;
  sessionStartTime?: Date;
  sessionExpiryTime?: Date;
  summaryText?: string;
}
export const MemorySessionSummary = S.suspend(() =>
  S.Struct({
    memoryId: S.optional(S.String),
    sessionId: S.optional(S.String),
    sessionStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    sessionExpiryTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    summaryText: S.optional(S.String),
  }),
).annotations({
  identifier: "MemorySessionSummary",
}) as any as S.Schema<MemorySessionSummary>;
export interface RetrieveAndGenerateOutputEvent {
  text: string;
}
export const RetrieveAndGenerateOutputEvent = S.suspend(() =>
  S.Struct({ text: S.String }),
).annotations({
  identifier: "RetrieveAndGenerateOutputEvent",
}) as any as S.Schema<RetrieveAndGenerateOutputEvent>;
export interface GuardrailEvent {
  action?: GuadrailAction;
}
export const GuardrailEvent = S.suspend(() =>
  S.Struct({ action: S.optional(GuadrailAction) }),
).annotations({
  identifier: "GuardrailEvent",
}) as any as S.Schema<GuardrailEvent>;
export type FlowNodeIODataType =
  | "String"
  | "Number"
  | "Boolean"
  | "Object"
  | "Array";
export const FlowNodeIODataType = S.Literal(
  "String",
  "Number",
  "Boolean",
  "Object",
  "Array",
);
export type FlowNodeInputCategory =
  | "LoopCondition"
  | "ReturnValueToLoopStart"
  | "ExitLoop";
export const FlowNodeInputCategory = S.Literal(
  "LoopCondition",
  "ReturnValueToLoopStart",
  "ExitLoop",
);
export interface TransformationConfiguration {
  mode: QueryTransformationMode;
  textToSqlConfiguration?: TextToSqlConfiguration;
}
export const TransformationConfiguration = S.suspend(() =>
  S.Struct({
    mode: QueryTransformationMode,
    textToSqlConfiguration: S.optional(TextToSqlConfiguration),
  }),
).annotations({
  identifier: "TransformationConfiguration",
}) as any as S.Schema<TransformationConfiguration>;
export type Memory = { sessionSummary: MemorySessionSummary };
export const Memory = S.Union(
  S.Struct({ sessionSummary: MemorySessionSummary }),
);
export type Memories = Memory[];
export const Memories = S.Array(Memory);
export type FlowExecutionContent = { document: any };
export const FlowExecutionContent = S.Union(S.Struct({ document: S.Any }));
export interface FlowOutputField {
  name: string;
  content: FlowExecutionContent;
}
export const FlowOutputField = S.suspend(() =>
  S.Struct({ name: S.String, content: FlowExecutionContent }),
).annotations({
  identifier: "FlowOutputField",
}) as any as S.Schema<FlowOutputField>;
export type FlowOutputFields = FlowOutputField[];
export const FlowOutputFields = S.Array(FlowOutputField);
export interface SatisfiedCondition {
  conditionName: string;
}
export const SatisfiedCondition = S.suspend(() =>
  S.Struct({ conditionName: S.String }),
).annotations({
  identifier: "SatisfiedCondition",
}) as any as S.Schema<SatisfiedCondition>;
export type SatisfiedConditions = SatisfiedCondition[];
export const SatisfiedConditions = S.Array(SatisfiedCondition);
export type FlowOutputContent = { document: any };
export const FlowOutputContent = S.Union(S.Struct({ document: S.Any }));
export type FlowMultiTurnInputContent = { document: any };
export const FlowMultiTurnInputContent = S.Union(S.Struct({ document: S.Any }));
export interface BedrockRerankingModelConfiguration {
  modelArn: string;
  additionalModelRequestFields?: { [key: string]: any };
}
export const BedrockRerankingModelConfiguration = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
  }),
).annotations({
  identifier: "BedrockRerankingModelConfiguration",
}) as any as S.Schema<BedrockRerankingModelConfiguration>;
export interface Span {
  start?: number;
  end?: number;
}
export const Span = S.suspend(() =>
  S.Struct({ start: S.optional(S.Number), end: S.optional(S.Number) }),
).annotations({ identifier: "Span" }) as any as S.Schema<Span>;
export interface TextResponsePart {
  text?: string;
  span?: Span;
}
export const TextResponsePart = S.suspend(() =>
  S.Struct({ text: S.optional(S.String), span: S.optional(Span) }),
).annotations({
  identifier: "TextResponsePart",
}) as any as S.Schema<TextResponsePart>;
export interface GeneratedResponsePart {
  textResponsePart?: TextResponsePart;
}
export const GeneratedResponsePart = S.suspend(() =>
  S.Struct({ textResponsePart: S.optional(TextResponsePart) }),
).annotations({
  identifier: "GeneratedResponsePart",
}) as any as S.Schema<GeneratedResponsePart>;
export type RetrievalResultContentType =
  | "TEXT"
  | "IMAGE"
  | "ROW"
  | "AUDIO"
  | "VIDEO";
export const RetrievalResultContentType = S.Literal(
  "TEXT",
  "IMAGE",
  "ROW",
  "AUDIO",
  "VIDEO",
);
export interface VideoSegment {
  s3Uri: string;
  summary?: string;
}
export const VideoSegment = S.suspend(() =>
  S.Struct({ s3Uri: S.String, summary: S.optional(S.String) }),
).annotations({ identifier: "VideoSegment" }) as any as S.Schema<VideoSegment>;
export interface AudioSegment {
  s3Uri: string;
  transcription?: string;
}
export const AudioSegment = S.suspend(() =>
  S.Struct({ s3Uri: S.String, transcription: S.optional(S.String) }),
).annotations({ identifier: "AudioSegment" }) as any as S.Schema<AudioSegment>;
export type RetrievalResultContentColumnType =
  | "BLOB"
  | "BOOLEAN"
  | "DOUBLE"
  | "NULL"
  | "LONG"
  | "STRING";
export const RetrievalResultContentColumnType = S.Literal(
  "BLOB",
  "BOOLEAN",
  "DOUBLE",
  "NULL",
  "LONG",
  "STRING",
);
export interface RetrievalResultContentColumn {
  columnName?: string;
  columnValue?: string;
  type?: RetrievalResultContentColumnType;
}
export const RetrievalResultContentColumn = S.suspend(() =>
  S.Struct({
    columnName: S.optional(S.String),
    columnValue: S.optional(S.String),
    type: S.optional(RetrievalResultContentColumnType),
  }),
).annotations({
  identifier: "RetrievalResultContentColumn",
}) as any as S.Schema<RetrievalResultContentColumn>;
export type RetrievalResultContentRow = RetrievalResultContentColumn[];
export const RetrievalResultContentRow = S.Array(RetrievalResultContentColumn);
export interface RetrievalResultContent {
  type?: RetrievalResultContentType;
  text?: string;
  byteContent?: string;
  video?: VideoSegment;
  audio?: AudioSegment;
  row?: RetrievalResultContentColumn[];
}
export const RetrievalResultContent = S.suspend(() =>
  S.Struct({
    type: S.optional(RetrievalResultContentType),
    text: S.optional(S.String),
    byteContent: S.optional(S.String),
    video: S.optional(VideoSegment),
    audio: S.optional(AudioSegment),
    row: S.optional(RetrievalResultContentRow),
  }),
).annotations({
  identifier: "RetrievalResultContent",
}) as any as S.Schema<RetrievalResultContent>;
export type RetrievalResultLocationType =
  | "S3"
  | "WEB"
  | "CONFLUENCE"
  | "SALESFORCE"
  | "SHAREPOINT"
  | "CUSTOM"
  | "KENDRA"
  | "SQL";
export const RetrievalResultLocationType = S.Literal(
  "S3",
  "WEB",
  "CONFLUENCE",
  "SALESFORCE",
  "SHAREPOINT",
  "CUSTOM",
  "KENDRA",
  "SQL",
);
export interface RetrievalResultS3Location {
  uri?: string;
}
export const RetrievalResultS3Location = S.suspend(() =>
  S.Struct({ uri: S.optional(S.String) }),
).annotations({
  identifier: "RetrievalResultS3Location",
}) as any as S.Schema<RetrievalResultS3Location>;
export interface RetrievalResultWebLocation {
  url?: string;
}
export const RetrievalResultWebLocation = S.suspend(() =>
  S.Struct({ url: S.optional(S.String) }),
).annotations({
  identifier: "RetrievalResultWebLocation",
}) as any as S.Schema<RetrievalResultWebLocation>;
export interface RetrievalResultConfluenceLocation {
  url?: string;
}
export const RetrievalResultConfluenceLocation = S.suspend(() =>
  S.Struct({ url: S.optional(S.String) }),
).annotations({
  identifier: "RetrievalResultConfluenceLocation",
}) as any as S.Schema<RetrievalResultConfluenceLocation>;
export interface RetrievalResultSalesforceLocation {
  url?: string;
}
export const RetrievalResultSalesforceLocation = S.suspend(() =>
  S.Struct({ url: S.optional(S.String) }),
).annotations({
  identifier: "RetrievalResultSalesforceLocation",
}) as any as S.Schema<RetrievalResultSalesforceLocation>;
export interface RetrievalResultSharePointLocation {
  url?: string;
}
export const RetrievalResultSharePointLocation = S.suspend(() =>
  S.Struct({ url: S.optional(S.String) }),
).annotations({
  identifier: "RetrievalResultSharePointLocation",
}) as any as S.Schema<RetrievalResultSharePointLocation>;
export interface RetrievalResultCustomDocumentLocation {
  id?: string;
}
export const RetrievalResultCustomDocumentLocation = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }),
).annotations({
  identifier: "RetrievalResultCustomDocumentLocation",
}) as any as S.Schema<RetrievalResultCustomDocumentLocation>;
export interface RetrievalResultKendraDocumentLocation {
  uri?: string;
}
export const RetrievalResultKendraDocumentLocation = S.suspend(() =>
  S.Struct({ uri: S.optional(S.String) }),
).annotations({
  identifier: "RetrievalResultKendraDocumentLocation",
}) as any as S.Schema<RetrievalResultKendraDocumentLocation>;
export interface RetrievalResultSqlLocation {
  query?: string;
}
export const RetrievalResultSqlLocation = S.suspend(() =>
  S.Struct({ query: S.optional(S.String) }),
).annotations({
  identifier: "RetrievalResultSqlLocation",
}) as any as S.Schema<RetrievalResultSqlLocation>;
export interface RetrievalResultLocation {
  type: RetrievalResultLocationType;
  s3Location?: RetrievalResultS3Location;
  webLocation?: RetrievalResultWebLocation;
  confluenceLocation?: RetrievalResultConfluenceLocation;
  salesforceLocation?: RetrievalResultSalesforceLocation;
  sharePointLocation?: RetrievalResultSharePointLocation;
  customDocumentLocation?: RetrievalResultCustomDocumentLocation;
  kendraDocumentLocation?: RetrievalResultKendraDocumentLocation;
  sqlLocation?: RetrievalResultSqlLocation;
}
export const RetrievalResultLocation = S.suspend(() =>
  S.Struct({
    type: RetrievalResultLocationType,
    s3Location: S.optional(RetrievalResultS3Location),
    webLocation: S.optional(RetrievalResultWebLocation),
    confluenceLocation: S.optional(RetrievalResultConfluenceLocation),
    salesforceLocation: S.optional(RetrievalResultSalesforceLocation),
    sharePointLocation: S.optional(RetrievalResultSharePointLocation),
    customDocumentLocation: S.optional(RetrievalResultCustomDocumentLocation),
    kendraDocumentLocation: S.optional(RetrievalResultKendraDocumentLocation),
    sqlLocation: S.optional(RetrievalResultSqlLocation),
  }),
).annotations({
  identifier: "RetrievalResultLocation",
}) as any as S.Schema<RetrievalResultLocation>;
export type RetrievalResultMetadata = { [key: string]: any };
export const RetrievalResultMetadata = S.Record({
  key: S.String,
  value: S.Any,
});
export interface RetrievedReference {
  content?: RetrievalResultContent;
  location?: RetrievalResultLocation;
  metadata?: { [key: string]: any };
}
export const RetrievedReference = S.suspend(() =>
  S.Struct({
    content: S.optional(RetrievalResultContent),
    location: S.optional(RetrievalResultLocation),
    metadata: S.optional(RetrievalResultMetadata),
  }),
).annotations({
  identifier: "RetrievedReference",
}) as any as S.Schema<RetrievedReference>;
export type RetrievedReferences = RetrievedReference[];
export const RetrievedReferences = S.Array(RetrievedReference);
export interface Citation {
  generatedResponsePart?: GeneratedResponsePart;
  retrievedReferences?: RetrievedReference[];
}
export const Citation = S.suspend(() =>
  S.Struct({
    generatedResponsePart: S.optional(GeneratedResponsePart),
    retrievedReferences: S.optional(RetrievedReferences),
  }),
).annotations({ identifier: "Citation" }) as any as S.Schema<Citation>;
export type FlowControlNodeType = "Iterator" | "Loop";
export const FlowControlNodeType = S.Literal("Iterator", "Loop");
export interface StartFlowExecutionResponse {
  executionArn?: string;
}
export const StartFlowExecutionResponse = S.suspend(() =>
  S.Struct({ executionArn: S.optional(S.String) }),
).annotations({
  identifier: "StartFlowExecutionResponse",
}) as any as S.Schema<StartFlowExecutionResponse>;
export interface GenerateQueryRequest {
  queryGenerationInput: QueryGenerationInput;
  transformationConfiguration: TransformationConfiguration;
}
export const GenerateQueryRequest = S.suspend(() =>
  S.Struct({
    queryGenerationInput: QueryGenerationInput,
    transformationConfiguration: TransformationConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/generateQuery" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateQueryRequest",
}) as any as S.Schema<GenerateQueryRequest>;
export interface GetAgentMemoryResponse {
  nextToken?: string;
  memoryContents?: Memory[];
}
export const GetAgentMemoryResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    memoryContents: S.optional(Memories),
  }),
).annotations({
  identifier: "GetAgentMemoryResponse",
}) as any as S.Schema<GetAgentMemoryResponse>;
export interface FlowExecutionOutputEvent {
  nodeName: string;
  timestamp: Date;
  fields: FlowOutputField[];
}
export const FlowExecutionOutputEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    fields: FlowOutputFields,
  }),
).annotations({
  identifier: "FlowExecutionOutputEvent",
}) as any as S.Schema<FlowExecutionOutputEvent>;
export interface ConditionResultEvent {
  nodeName: string;
  timestamp: Date;
  satisfiedConditions: SatisfiedCondition[];
}
export const ConditionResultEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    satisfiedConditions: SatisfiedConditions,
  }),
).annotations({
  identifier: "ConditionResultEvent",
}) as any as S.Schema<ConditionResultEvent>;
export interface FlowOutputEvent {
  nodeName: string;
  nodeType: NodeType;
  content: FlowOutputContent;
}
export const FlowOutputEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    nodeType: NodeType,
    content: FlowOutputContent,
  }),
).annotations({
  identifier: "FlowOutputEvent",
}) as any as S.Schema<FlowOutputEvent>;
export interface FlowMultiTurnInputRequestEvent {
  nodeName: string;
  nodeType: NodeType;
  content: FlowMultiTurnInputContent;
}
export const FlowMultiTurnInputRequestEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    nodeType: NodeType,
    content: FlowMultiTurnInputContent,
  }),
).annotations({
  identifier: "FlowMultiTurnInputRequestEvent",
}) as any as S.Schema<FlowMultiTurnInputRequestEvent>;
export interface BedrockRerankingConfiguration {
  numberOfResults?: number;
  modelConfiguration: BedrockRerankingModelConfiguration;
}
export const BedrockRerankingConfiguration = S.suspend(() =>
  S.Struct({
    numberOfResults: S.optional(S.Number),
    modelConfiguration: BedrockRerankingModelConfiguration,
  }),
).annotations({
  identifier: "BedrockRerankingConfiguration",
}) as any as S.Schema<BedrockRerankingConfiguration>;
export type NodeExecutionContent = { document: any };
export const NodeExecutionContent = S.Union(S.Struct({ document: S.Any }));
export interface NodeInputSource {
  nodeName: string;
  outputFieldName: string;
  expression: string | redacted.Redacted<string>;
}
export const NodeInputSource = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    outputFieldName: S.String,
    expression: SensitiveString,
  }),
).annotations({
  identifier: "NodeInputSource",
}) as any as S.Schema<NodeInputSource>;
export interface NodeInputExecutionChainItem {
  nodeName: string;
  index?: number;
  type: FlowControlNodeType;
}
export const NodeInputExecutionChainItem = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    index: S.optional(S.Number),
    type: FlowControlNodeType,
  }),
).annotations({
  identifier: "NodeInputExecutionChainItem",
}) as any as S.Schema<NodeInputExecutionChainItem>;
export type NodeInputExecutionChain = NodeInputExecutionChainItem[];
export const NodeInputExecutionChain = S.Array(NodeInputExecutionChainItem);
export interface NodeOutputNext {
  nodeName: string;
  inputFieldName: string;
}
export const NodeOutputNext = S.suspend(() =>
  S.Struct({ nodeName: S.String, inputFieldName: S.String }),
).annotations({
  identifier: "NodeOutputNext",
}) as any as S.Schema<NodeOutputNext>;
export type NodeOutputNextList = NodeOutputNext[];
export const NodeOutputNextList = S.Array(NodeOutputNext);
export interface FlowTraceNodeActionEvent {
  nodeName: string;
  timestamp: Date;
  requestId: string;
  serviceName: string;
  operationName: string;
  operationRequest?: any;
  operationResponse?: any;
}
export const FlowTraceNodeActionEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    requestId: S.String,
    serviceName: S.String,
    operationName: S.String,
    operationRequest: S.optional(S.Any),
    operationResponse: S.optional(S.Any),
  }),
).annotations({
  identifier: "FlowTraceNodeActionEvent",
}) as any as S.Schema<FlowTraceNodeActionEvent>;
export interface RerankingConfiguration {
  type: RerankingConfigurationType;
  bedrockRerankingConfiguration: BedrockRerankingConfiguration;
}
export const RerankingConfiguration = S.suspend(() =>
  S.Struct({
    type: RerankingConfigurationType,
    bedrockRerankingConfiguration: BedrockRerankingConfiguration,
  }),
).annotations({
  identifier: "RerankingConfiguration",
}) as any as S.Schema<RerankingConfiguration>;
export interface FlowInputField {
  name: string;
  content: FlowExecutionContent;
}
export const FlowInputField = S.suspend(() =>
  S.Struct({ name: S.String, content: FlowExecutionContent }),
).annotations({
  identifier: "FlowInputField",
}) as any as S.Schema<FlowInputField>;
export type FlowInputFields = FlowInputField[];
export const FlowInputFields = S.Array(FlowInputField);
export interface NodeInputField {
  name: string;
  content: NodeExecutionContent;
  source?: NodeInputSource;
  type?: FlowNodeIODataType;
  category?: FlowNodeInputCategory;
  executionChain?: NodeInputExecutionChainItem[];
}
export const NodeInputField = S.suspend(() =>
  S.Struct({
    name: S.String,
    content: NodeExecutionContent,
    source: S.optional(NodeInputSource),
    type: S.optional(FlowNodeIODataType),
    category: S.optional(FlowNodeInputCategory),
    executionChain: S.optional(NodeInputExecutionChain),
  }),
).annotations({
  identifier: "NodeInputField",
}) as any as S.Schema<NodeInputField>;
export type NodeInputFields = NodeInputField[];
export const NodeInputFields = S.Array(NodeInputField);
export interface NodeOutputField {
  name: string;
  content: NodeExecutionContent;
  next?: NodeOutputNext[];
  type?: FlowNodeIODataType;
}
export const NodeOutputField = S.suspend(() =>
  S.Struct({
    name: S.String,
    content: NodeExecutionContent,
    next: S.optional(NodeOutputNextList),
    type: S.optional(FlowNodeIODataType),
  }),
).annotations({
  identifier: "NodeOutputField",
}) as any as S.Schema<NodeOutputField>;
export type NodeOutputFields = NodeOutputField[];
export const NodeOutputFields = S.Array(NodeOutputField);
export type Caller = { agentAliasArn: string };
export const Caller = S.Union(S.Struct({ agentAliasArn: S.String }));
export type CallerChain = Caller[];
export const CallerChain = S.Array(Caller);
export interface FlowTraceCondition {
  conditionName: string;
}
export const FlowTraceCondition = S.suspend(() =>
  S.Struct({ conditionName: S.String }),
).annotations({
  identifier: "FlowTraceCondition",
}) as any as S.Schema<FlowTraceCondition>;
export type FlowTraceConditions = FlowTraceCondition[];
export const FlowTraceConditions = S.Array(FlowTraceCondition);
export type GuardrailAction = "INTERVENED" | "NONE";
export const GuardrailAction = S.Literal("INTERVENED", "NONE");
export type GuardrailTopicType = "DENY";
export const GuardrailTopicType = S.Literal("DENY");
export type GuardrailTopicPolicyAction = "BLOCKED";
export const GuardrailTopicPolicyAction = S.Literal("BLOCKED");
export interface GuardrailTopic {
  name?: string;
  type?: GuardrailTopicType;
  action?: GuardrailTopicPolicyAction;
}
export const GuardrailTopic = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(GuardrailTopicType),
    action: S.optional(GuardrailTopicPolicyAction),
  }),
).annotations({
  identifier: "GuardrailTopic",
}) as any as S.Schema<GuardrailTopic>;
export type GuardrailTopicList = GuardrailTopic[];
export const GuardrailTopicList = S.Array(GuardrailTopic);
export interface GuardrailTopicPolicyAssessment {
  topics?: GuardrailTopic[];
}
export const GuardrailTopicPolicyAssessment = S.suspend(() =>
  S.Struct({ topics: S.optional(GuardrailTopicList) }),
).annotations({
  identifier: "GuardrailTopicPolicyAssessment",
}) as any as S.Schema<GuardrailTopicPolicyAssessment>;
export type GuardrailContentFilterType =
  | "INSULTS"
  | "HATE"
  | "SEXUAL"
  | "VIOLENCE"
  | "MISCONDUCT"
  | "PROMPT_ATTACK";
export const GuardrailContentFilterType = S.Literal(
  "INSULTS",
  "HATE",
  "SEXUAL",
  "VIOLENCE",
  "MISCONDUCT",
  "PROMPT_ATTACK",
);
export type GuardrailContentFilterConfidence =
  | "NONE"
  | "LOW"
  | "MEDIUM"
  | "HIGH";
export const GuardrailContentFilterConfidence = S.Literal(
  "NONE",
  "LOW",
  "MEDIUM",
  "HIGH",
);
export type GuardrailContentPolicyAction = "BLOCKED";
export const GuardrailContentPolicyAction = S.Literal("BLOCKED");
export interface GuardrailContentFilter {
  type?: GuardrailContentFilterType;
  confidence?: GuardrailContentFilterConfidence;
  action?: GuardrailContentPolicyAction;
}
export const GuardrailContentFilter = S.suspend(() =>
  S.Struct({
    type: S.optional(GuardrailContentFilterType),
    confidence: S.optional(GuardrailContentFilterConfidence),
    action: S.optional(GuardrailContentPolicyAction),
  }),
).annotations({
  identifier: "GuardrailContentFilter",
}) as any as S.Schema<GuardrailContentFilter>;
export type GuardrailContentFilterList = GuardrailContentFilter[];
export const GuardrailContentFilterList = S.Array(GuardrailContentFilter);
export interface GuardrailContentPolicyAssessment {
  filters?: GuardrailContentFilter[];
}
export const GuardrailContentPolicyAssessment = S.suspend(() =>
  S.Struct({ filters: S.optional(GuardrailContentFilterList) }),
).annotations({
  identifier: "GuardrailContentPolicyAssessment",
}) as any as S.Schema<GuardrailContentPolicyAssessment>;
export type GuardrailWordPolicyAction = "BLOCKED";
export const GuardrailWordPolicyAction = S.Literal("BLOCKED");
export interface GuardrailCustomWord {
  match?: string;
  action?: GuardrailWordPolicyAction;
}
export const GuardrailCustomWord = S.suspend(() =>
  S.Struct({
    match: S.optional(S.String),
    action: S.optional(GuardrailWordPolicyAction),
  }),
).annotations({
  identifier: "GuardrailCustomWord",
}) as any as S.Schema<GuardrailCustomWord>;
export type GuardrailCustomWordList = GuardrailCustomWord[];
export const GuardrailCustomWordList = S.Array(GuardrailCustomWord);
export type GuardrailManagedWordType = "PROFANITY";
export const GuardrailManagedWordType = S.Literal("PROFANITY");
export interface GuardrailManagedWord {
  match?: string;
  type?: GuardrailManagedWordType;
  action?: GuardrailWordPolicyAction;
}
export const GuardrailManagedWord = S.suspend(() =>
  S.Struct({
    match: S.optional(S.String),
    type: S.optional(GuardrailManagedWordType),
    action: S.optional(GuardrailWordPolicyAction),
  }),
).annotations({
  identifier: "GuardrailManagedWord",
}) as any as S.Schema<GuardrailManagedWord>;
export type GuardrailManagedWordList = GuardrailManagedWord[];
export const GuardrailManagedWordList = S.Array(GuardrailManagedWord);
export interface GuardrailWordPolicyAssessment {
  customWords?: GuardrailCustomWord[];
  managedWordLists?: GuardrailManagedWord[];
}
export const GuardrailWordPolicyAssessment = S.suspend(() =>
  S.Struct({
    customWords: S.optional(GuardrailCustomWordList),
    managedWordLists: S.optional(GuardrailManagedWordList),
  }),
).annotations({
  identifier: "GuardrailWordPolicyAssessment",
}) as any as S.Schema<GuardrailWordPolicyAssessment>;
export type GuardrailPiiEntityType =
  | "ADDRESS"
  | "AGE"
  | "AWS_ACCESS_KEY"
  | "AWS_SECRET_KEY"
  | "CA_HEALTH_NUMBER"
  | "CA_SOCIAL_INSURANCE_NUMBER"
  | "CREDIT_DEBIT_CARD_CVV"
  | "CREDIT_DEBIT_CARD_EXPIRY"
  | "CREDIT_DEBIT_CARD_NUMBER"
  | "DRIVER_ID"
  | "EMAIL"
  | "INTERNATIONAL_BANK_ACCOUNT_NUMBER"
  | "IP_ADDRESS"
  | "LICENSE_PLATE"
  | "MAC_ADDRESS"
  | "NAME"
  | "PASSWORD"
  | "PHONE"
  | "PIN"
  | "SWIFT_CODE"
  | "UK_NATIONAL_HEALTH_SERVICE_NUMBER"
  | "UK_NATIONAL_INSURANCE_NUMBER"
  | "UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER"
  | "URL"
  | "USERNAME"
  | "US_BANK_ACCOUNT_NUMBER"
  | "US_BANK_ROUTING_NUMBER"
  | "US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER"
  | "US_PASSPORT_NUMBER"
  | "US_SOCIAL_SECURITY_NUMBER"
  | "VEHICLE_IDENTIFICATION_NUMBER";
export const GuardrailPiiEntityType = S.Literal(
  "ADDRESS",
  "AGE",
  "AWS_ACCESS_KEY",
  "AWS_SECRET_KEY",
  "CA_HEALTH_NUMBER",
  "CA_SOCIAL_INSURANCE_NUMBER",
  "CREDIT_DEBIT_CARD_CVV",
  "CREDIT_DEBIT_CARD_EXPIRY",
  "CREDIT_DEBIT_CARD_NUMBER",
  "DRIVER_ID",
  "EMAIL",
  "INTERNATIONAL_BANK_ACCOUNT_NUMBER",
  "IP_ADDRESS",
  "LICENSE_PLATE",
  "MAC_ADDRESS",
  "NAME",
  "PASSWORD",
  "PHONE",
  "PIN",
  "SWIFT_CODE",
  "UK_NATIONAL_HEALTH_SERVICE_NUMBER",
  "UK_NATIONAL_INSURANCE_NUMBER",
  "UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER",
  "URL",
  "USERNAME",
  "US_BANK_ACCOUNT_NUMBER",
  "US_BANK_ROUTING_NUMBER",
  "US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER",
  "US_PASSPORT_NUMBER",
  "US_SOCIAL_SECURITY_NUMBER",
  "VEHICLE_IDENTIFICATION_NUMBER",
);
export type GuardrailSensitiveInformationPolicyAction =
  | "BLOCKED"
  | "ANONYMIZED";
export const GuardrailSensitiveInformationPolicyAction = S.Literal(
  "BLOCKED",
  "ANONYMIZED",
);
export interface GuardrailPiiEntityFilter {
  type?: GuardrailPiiEntityType;
  match?: string;
  action?: GuardrailSensitiveInformationPolicyAction;
}
export const GuardrailPiiEntityFilter = S.suspend(() =>
  S.Struct({
    type: S.optional(GuardrailPiiEntityType),
    match: S.optional(S.String),
    action: S.optional(GuardrailSensitiveInformationPolicyAction),
  }),
).annotations({
  identifier: "GuardrailPiiEntityFilter",
}) as any as S.Schema<GuardrailPiiEntityFilter>;
export type GuardrailPiiEntityFilterList = GuardrailPiiEntityFilter[];
export const GuardrailPiiEntityFilterList = S.Array(GuardrailPiiEntityFilter);
export interface GuardrailRegexFilter {
  name?: string;
  regex?: string;
  match?: string;
  action?: GuardrailSensitiveInformationPolicyAction;
}
export const GuardrailRegexFilter = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    regex: S.optional(S.String),
    match: S.optional(S.String),
    action: S.optional(GuardrailSensitiveInformationPolicyAction),
  }),
).annotations({
  identifier: "GuardrailRegexFilter",
}) as any as S.Schema<GuardrailRegexFilter>;
export type GuardrailRegexFilterList = GuardrailRegexFilter[];
export const GuardrailRegexFilterList = S.Array(GuardrailRegexFilter);
export interface GuardrailSensitiveInformationPolicyAssessment {
  piiEntities?: GuardrailPiiEntityFilter[];
  regexes?: GuardrailRegexFilter[];
}
export const GuardrailSensitiveInformationPolicyAssessment = S.suspend(() =>
  S.Struct({
    piiEntities: S.optional(GuardrailPiiEntityFilterList),
    regexes: S.optional(GuardrailRegexFilterList),
  }),
).annotations({
  identifier: "GuardrailSensitiveInformationPolicyAssessment",
}) as any as S.Schema<GuardrailSensitiveInformationPolicyAssessment>;
export interface GuardrailAssessment {
  topicPolicy?: GuardrailTopicPolicyAssessment;
  contentPolicy?: GuardrailContentPolicyAssessment;
  wordPolicy?: GuardrailWordPolicyAssessment;
  sensitiveInformationPolicy?: GuardrailSensitiveInformationPolicyAssessment;
}
export const GuardrailAssessment = S.suspend(() =>
  S.Struct({
    topicPolicy: S.optional(GuardrailTopicPolicyAssessment),
    contentPolicy: S.optional(GuardrailContentPolicyAssessment),
    wordPolicy: S.optional(GuardrailWordPolicyAssessment),
    sensitiveInformationPolicy: S.optional(
      GuardrailSensitiveInformationPolicyAssessment,
    ),
  }),
).annotations({
  identifier: "GuardrailAssessment",
}) as any as S.Schema<GuardrailAssessment>;
export type GuardrailAssessmentList = GuardrailAssessment[];
export const GuardrailAssessmentList = S.Array(GuardrailAssessment);
export interface Usage {
  inputTokens?: number;
  outputTokens?: number;
}
export const Usage = S.suspend(() =>
  S.Struct({
    inputTokens: S.optional(S.Number),
    outputTokens: S.optional(S.Number),
  }),
).annotations({ identifier: "Usage" }) as any as S.Schema<Usage>;
export interface Metadata {
  startTime?: Date;
  endTime?: Date;
  totalTimeMs?: number;
  operationTotalTimeMs?: number;
  clientRequestId?: string;
  usage?: Usage;
}
export const Metadata = S.suspend(() =>
  S.Struct({
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    totalTimeMs: S.optional(S.Number),
    operationTotalTimeMs: S.optional(S.Number),
    clientRequestId: S.optional(S.String),
    usage: S.optional(Usage),
  }),
).annotations({ identifier: "Metadata" }) as any as S.Schema<Metadata>;
export interface GuardrailTrace {
  action?: GuardrailAction;
  traceId?: string;
  inputAssessments?: GuardrailAssessment[];
  outputAssessments?: GuardrailAssessment[];
  metadata?: Metadata;
}
export const GuardrailTrace = S.suspend(() =>
  S.Struct({
    action: S.optional(GuardrailAction),
    traceId: S.optional(S.String),
    inputAssessments: S.optional(GuardrailAssessmentList),
    outputAssessments: S.optional(GuardrailAssessmentList),
    metadata: S.optional(Metadata),
  }),
).annotations({
  identifier: "GuardrailTrace",
}) as any as S.Schema<GuardrailTrace>;
export interface ModelInvocationInput {
  traceId?: string;
  text?: string | redacted.Redacted<string>;
  type?: PromptType;
  overrideLambda?: string;
  promptCreationMode?: CreationMode;
  inferenceConfiguration?: InferenceConfiguration;
  parserMode?: CreationMode;
  foundationModel?: string;
}
export const ModelInvocationInput = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String),
    text: S.optional(SensitiveString),
    type: S.optional(PromptType),
    overrideLambda: S.optional(S.String),
    promptCreationMode: S.optional(CreationMode),
    inferenceConfiguration: S.optional(InferenceConfiguration),
    parserMode: S.optional(CreationMode),
    foundationModel: S.optional(S.String),
  }),
).annotations({
  identifier: "ModelInvocationInput",
}) as any as S.Schema<ModelInvocationInput>;
export interface PreProcessingParsedResponse {
  rationale?: string | redacted.Redacted<string>;
  isValid?: boolean;
}
export const PreProcessingParsedResponse = S.suspend(() =>
  S.Struct({
    rationale: S.optional(SensitiveString),
    isValid: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PreProcessingParsedResponse",
}) as any as S.Schema<PreProcessingParsedResponse>;
export interface RawResponse {
  content?: string;
}
export const RawResponse = S.suspend(() =>
  S.Struct({ content: S.optional(S.String) }),
).annotations({ identifier: "RawResponse" }) as any as S.Schema<RawResponse>;
export interface ReasoningTextBlock {
  text: string;
  signature?: string;
}
export const ReasoningTextBlock = S.suspend(() =>
  S.Struct({ text: S.String, signature: S.optional(S.String) }),
).annotations({
  identifier: "ReasoningTextBlock",
}) as any as S.Schema<ReasoningTextBlock>;
export type ReasoningContentBlock =
  | { reasoningText: ReasoningTextBlock }
  | { redactedContent: Uint8Array };
export const ReasoningContentBlock = S.Union(
  S.Struct({ reasoningText: ReasoningTextBlock }),
  S.Struct({ redactedContent: T.Blob }),
);
export interface PreProcessingModelInvocationOutput {
  traceId?: string;
  parsedResponse?: PreProcessingParsedResponse;
  rawResponse?: RawResponse;
  metadata?: Metadata;
  reasoningContent?: ReasoningContentBlock;
}
export const PreProcessingModelInvocationOutput = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String),
    parsedResponse: S.optional(PreProcessingParsedResponse),
    rawResponse: S.optional(RawResponse),
    metadata: S.optional(Metadata),
    reasoningContent: S.optional(ReasoningContentBlock),
  }),
).annotations({
  identifier: "PreProcessingModelInvocationOutput",
}) as any as S.Schema<PreProcessingModelInvocationOutput>;
export type PreProcessingTrace =
  | { modelInvocationInput: ModelInvocationInput }
  | { modelInvocationOutput: PreProcessingModelInvocationOutput };
export const PreProcessingTrace = S.Union(
  S.Struct({ modelInvocationInput: ModelInvocationInput }),
  S.Struct({ modelInvocationOutput: PreProcessingModelInvocationOutput }),
);
export interface Rationale {
  traceId?: string;
  text?: string | redacted.Redacted<string>;
}
export const Rationale = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String),
    text: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Rationale" }) as any as S.Schema<Rationale>;
export type InvocationType =
  | "ACTION_GROUP"
  | "KNOWLEDGE_BASE"
  | "FINISH"
  | "ACTION_GROUP_CODE_INTERPRETER"
  | "AGENT_COLLABORATOR";
export const InvocationType = S.Literal(
  "ACTION_GROUP",
  "KNOWLEDGE_BASE",
  "FINISH",
  "ACTION_GROUP_CODE_INTERPRETER",
  "AGENT_COLLABORATOR",
);
export interface Parameter {
  name?: string;
  type?: string;
  value?: string;
}
export const Parameter = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(S.String),
    value: S.optional(S.String),
  }),
).annotations({ identifier: "Parameter" }) as any as S.Schema<Parameter>;
export type Parameters = Parameter[];
export const Parameters = S.Array(Parameter);
export type ContentMap = { [key: string]: Parameter[] };
export const ContentMap = S.Record({ key: S.String, value: Parameters });
export interface RequestBody {
  content?: { [key: string]: Parameter[] };
}
export const RequestBody = S.suspend(() =>
  S.Struct({ content: S.optional(ContentMap) }),
).annotations({ identifier: "RequestBody" }) as any as S.Schema<RequestBody>;
export type ExecutionType = "LAMBDA" | "RETURN_CONTROL";
export const ExecutionType = S.Literal("LAMBDA", "RETURN_CONTROL");
export interface ActionGroupInvocationInput {
  actionGroupName?: string | redacted.Redacted<string>;
  verb?: string | redacted.Redacted<string>;
  apiPath?: string | redacted.Redacted<string>;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  function?: string | redacted.Redacted<string>;
  executionType?: ExecutionType;
  invocationId?: string;
}
export const ActionGroupInvocationInput = S.suspend(() =>
  S.Struct({
    actionGroupName: S.optional(SensitiveString),
    verb: S.optional(SensitiveString),
    apiPath: S.optional(SensitiveString),
    parameters: S.optional(Parameters),
    requestBody: S.optional(RequestBody),
    function: S.optional(SensitiveString),
    executionType: S.optional(ExecutionType),
    invocationId: S.optional(S.String),
  }),
).annotations({
  identifier: "ActionGroupInvocationInput",
}) as any as S.Schema<ActionGroupInvocationInput>;
export interface KnowledgeBaseLookupInput {
  text?: string | redacted.Redacted<string>;
  knowledgeBaseId?: string | redacted.Redacted<string>;
}
export const KnowledgeBaseLookupInput = S.suspend(() =>
  S.Struct({
    text: S.optional(SensitiveString),
    knowledgeBaseId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "KnowledgeBaseLookupInput",
}) as any as S.Schema<KnowledgeBaseLookupInput>;
export type Files = string[];
export const Files = S.Array(S.String);
export interface CodeInterpreterInvocationInput {
  code?: string;
  files?: string[];
}
export const CodeInterpreterInvocationInput = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), files: S.optional(Files) }),
).annotations({
  identifier: "CodeInterpreterInvocationInput",
}) as any as S.Schema<CodeInterpreterInvocationInput>;
export type PayloadType = "TEXT" | "RETURN_CONTROL";
export const PayloadType = S.Literal("TEXT", "RETURN_CONTROL");
export interface ReturnControlResults {
  invocationId?: string;
  returnControlInvocationResults?: InvocationResultMember[];
}
export const ReturnControlResults = S.suspend(() =>
  S.Struct({
    invocationId: S.optional(S.String),
    returnControlInvocationResults: S.optional(ReturnControlInvocationResults),
  }),
).annotations({
  identifier: "ReturnControlResults",
}) as any as S.Schema<ReturnControlResults>;
export interface AgentCollaboratorInputPayload {
  type?: PayloadType;
  text?: string | redacted.Redacted<string>;
  returnControlResults?: ReturnControlResults;
}
export const AgentCollaboratorInputPayload = S.suspend(() =>
  S.Struct({
    type: S.optional(PayloadType),
    text: S.optional(SensitiveString),
    returnControlResults: S.optional(ReturnControlResults),
  }),
).annotations({
  identifier: "AgentCollaboratorInputPayload",
}) as any as S.Schema<AgentCollaboratorInputPayload>;
export interface AgentCollaboratorInvocationInput {
  agentCollaboratorName?: string;
  agentCollaboratorAliasArn?: string;
  input?: AgentCollaboratorInputPayload;
}
export const AgentCollaboratorInvocationInput = S.suspend(() =>
  S.Struct({
    agentCollaboratorName: S.optional(S.String),
    agentCollaboratorAliasArn: S.optional(S.String),
    input: S.optional(AgentCollaboratorInputPayload),
  }),
).annotations({
  identifier: "AgentCollaboratorInvocationInput",
}) as any as S.Schema<AgentCollaboratorInvocationInput>;
export interface InvocationInput {
  traceId?: string;
  invocationType?: InvocationType;
  actionGroupInvocationInput?: ActionGroupInvocationInput;
  knowledgeBaseLookupInput?: KnowledgeBaseLookupInput;
  codeInterpreterInvocationInput?: CodeInterpreterInvocationInput;
  agentCollaboratorInvocationInput?: AgentCollaboratorInvocationInput;
}
export const InvocationInput = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String),
    invocationType: S.optional(InvocationType),
    actionGroupInvocationInput: S.optional(ActionGroupInvocationInput),
    knowledgeBaseLookupInput: S.optional(KnowledgeBaseLookupInput),
    codeInterpreterInvocationInput: S.optional(CodeInterpreterInvocationInput),
    agentCollaboratorInvocationInput: S.optional(
      AgentCollaboratorInvocationInput,
    ),
  }),
).annotations({
  identifier: "InvocationInput",
}) as any as S.Schema<InvocationInput>;
export type Type =
  | "ACTION_GROUP"
  | "AGENT_COLLABORATOR"
  | "KNOWLEDGE_BASE"
  | "FINISH"
  | "ASK_USER"
  | "REPROMPT";
export const Type = S.Literal(
  "ACTION_GROUP",
  "AGENT_COLLABORATOR",
  "KNOWLEDGE_BASE",
  "FINISH",
  "ASK_USER",
  "REPROMPT",
);
export interface ActionGroupInvocationOutput {
  text?: string | redacted.Redacted<string>;
  metadata?: Metadata;
}
export const ActionGroupInvocationOutput = S.suspend(() =>
  S.Struct({
    text: S.optional(SensitiveString),
    metadata: S.optional(Metadata),
  }),
).annotations({
  identifier: "ActionGroupInvocationOutput",
}) as any as S.Schema<ActionGroupInvocationOutput>;
export interface ApiParameter {
  name?: string;
  type?: string;
  value?: string;
}
export const ApiParameter = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(S.String),
    value: S.optional(S.String),
  }),
).annotations({ identifier: "ApiParameter" }) as any as S.Schema<ApiParameter>;
export type ApiParameters = ApiParameter[];
export const ApiParameters = S.Array(ApiParameter);
export type ParameterList = Parameter[];
export const ParameterList = S.Array(Parameter);
export interface PropertyParameters {
  properties?: Parameter[];
}
export const PropertyParameters = S.suspend(() =>
  S.Struct({ properties: S.optional(ParameterList) }),
).annotations({
  identifier: "PropertyParameters",
}) as any as S.Schema<PropertyParameters>;
export type ApiContentMap = { [key: string]: PropertyParameters };
export const ApiContentMap = S.Record({
  key: S.String,
  value: PropertyParameters,
});
export interface ApiRequestBody {
  content?: { [key: string]: PropertyParameters };
}
export const ApiRequestBody = S.suspend(() =>
  S.Struct({ content: S.optional(ApiContentMap) }),
).annotations({
  identifier: "ApiRequestBody",
}) as any as S.Schema<ApiRequestBody>;
export type ActionInvocationType =
  | "RESULT"
  | "USER_CONFIRMATION"
  | "USER_CONFIRMATION_AND_RESULT";
export const ActionInvocationType = S.Literal(
  "RESULT",
  "USER_CONFIRMATION",
  "USER_CONFIRMATION_AND_RESULT",
);
export interface ApiInvocationInput {
  actionGroup: string;
  httpMethod?: string;
  apiPath?: string | redacted.Redacted<string>;
  parameters?: ApiParameter[];
  requestBody?: ApiRequestBody;
  actionInvocationType?: ActionInvocationType;
  agentId?: string;
  collaboratorName?: string | redacted.Redacted<string>;
}
export const ApiInvocationInput = S.suspend(() =>
  S.Struct({
    actionGroup: S.String,
    httpMethod: S.optional(S.String),
    apiPath: S.optional(SensitiveString),
    parameters: S.optional(ApiParameters),
    requestBody: S.optional(ApiRequestBody),
    actionInvocationType: S.optional(ActionInvocationType),
    agentId: S.optional(S.String),
    collaboratorName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ApiInvocationInput",
}) as any as S.Schema<ApiInvocationInput>;
export interface FunctionParameter {
  name?: string;
  type?: string;
  value?: string;
}
export const FunctionParameter = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(S.String),
    value: S.optional(S.String),
  }),
).annotations({
  identifier: "FunctionParameter",
}) as any as S.Schema<FunctionParameter>;
export type FunctionParameters = FunctionParameter[];
export const FunctionParameters = S.Array(FunctionParameter);
export interface FunctionInvocationInput {
  actionGroup: string;
  parameters?: FunctionParameter[];
  function?: string;
  actionInvocationType?: ActionInvocationType;
  agentId?: string;
  collaboratorName?: string | redacted.Redacted<string>;
}
export const FunctionInvocationInput = S.suspend(() =>
  S.Struct({
    actionGroup: S.String,
    parameters: S.optional(FunctionParameters),
    function: S.optional(S.String),
    actionInvocationType: S.optional(ActionInvocationType),
    agentId: S.optional(S.String),
    collaboratorName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "FunctionInvocationInput",
}) as any as S.Schema<FunctionInvocationInput>;
export type InvocationInputMember =
  | { apiInvocationInput: ApiInvocationInput }
  | { functionInvocationInput: FunctionInvocationInput };
export const InvocationInputMember = S.Union(
  S.Struct({ apiInvocationInput: ApiInvocationInput }),
  S.Struct({ functionInvocationInput: FunctionInvocationInput }),
);
export type InvocationInputs = InvocationInputMember[];
export const InvocationInputs = S.Array(InvocationInputMember);
export interface ReturnControlPayload {
  invocationInputs?: InvocationInputMember[];
  invocationId?: string;
}
export const ReturnControlPayload = S.suspend(() =>
  S.Struct({
    invocationInputs: S.optional(InvocationInputs),
    invocationId: S.optional(S.String),
  }),
).annotations({
  identifier: "ReturnControlPayload",
}) as any as S.Schema<ReturnControlPayload>;
export interface AgentCollaboratorOutputPayload {
  type?: PayloadType;
  text?: string | redacted.Redacted<string>;
  returnControlPayload?: ReturnControlPayload;
}
export const AgentCollaboratorOutputPayload = S.suspend(() =>
  S.Struct({
    type: S.optional(PayloadType),
    text: S.optional(SensitiveString),
    returnControlPayload: S.optional(ReturnControlPayload),
  }),
).annotations({
  identifier: "AgentCollaboratorOutputPayload",
}) as any as S.Schema<AgentCollaboratorOutputPayload>;
export interface AgentCollaboratorInvocationOutput {
  agentCollaboratorName?: string;
  agentCollaboratorAliasArn?: string;
  output?: AgentCollaboratorOutputPayload;
  metadata?: Metadata;
}
export const AgentCollaboratorInvocationOutput = S.suspend(() =>
  S.Struct({
    agentCollaboratorName: S.optional(S.String),
    agentCollaboratorAliasArn: S.optional(S.String),
    output: S.optional(AgentCollaboratorOutputPayload),
    metadata: S.optional(Metadata),
  }),
).annotations({
  identifier: "AgentCollaboratorInvocationOutput",
}) as any as S.Schema<AgentCollaboratorInvocationOutput>;
export interface KnowledgeBaseLookupOutput {
  retrievedReferences?: RetrievedReference[];
  metadata?: Metadata;
}
export const KnowledgeBaseLookupOutput = S.suspend(() =>
  S.Struct({
    retrievedReferences: S.optional(RetrievedReferences),
    metadata: S.optional(Metadata),
  }),
).annotations({
  identifier: "KnowledgeBaseLookupOutput",
}) as any as S.Schema<KnowledgeBaseLookupOutput>;
export interface FinalResponse {
  text?: string | redacted.Redacted<string>;
  metadata?: Metadata;
}
export const FinalResponse = S.suspend(() =>
  S.Struct({
    text: S.optional(SensitiveString),
    metadata: S.optional(Metadata),
  }),
).annotations({
  identifier: "FinalResponse",
}) as any as S.Schema<FinalResponse>;
export type Source = "ACTION_GROUP" | "KNOWLEDGE_BASE" | "PARSER";
export const Source = S.Literal("ACTION_GROUP", "KNOWLEDGE_BASE", "PARSER");
export interface RepromptResponse {
  text?: string;
  source?: Source;
}
export const RepromptResponse = S.suspend(() =>
  S.Struct({ text: S.optional(S.String), source: S.optional(Source) }),
).annotations({
  identifier: "RepromptResponse",
}) as any as S.Schema<RepromptResponse>;
export interface CodeInterpreterInvocationOutput {
  executionOutput?: string;
  executionError?: string;
  files?: string[];
  executionTimeout?: boolean;
  metadata?: Metadata;
}
export const CodeInterpreterInvocationOutput = S.suspend(() =>
  S.Struct({
    executionOutput: S.optional(S.String),
    executionError: S.optional(S.String),
    files: S.optional(Files),
    executionTimeout: S.optional(S.Boolean),
    metadata: S.optional(Metadata),
  }),
).annotations({
  identifier: "CodeInterpreterInvocationOutput",
}) as any as S.Schema<CodeInterpreterInvocationOutput>;
export interface Observation {
  traceId?: string;
  type?: Type;
  actionGroupInvocationOutput?: ActionGroupInvocationOutput;
  agentCollaboratorInvocationOutput?: AgentCollaboratorInvocationOutput;
  knowledgeBaseLookupOutput?: KnowledgeBaseLookupOutput;
  finalResponse?: FinalResponse;
  repromptResponse?: RepromptResponse;
  codeInterpreterInvocationOutput?: CodeInterpreterInvocationOutput;
}
export const Observation = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String),
    type: S.optional(Type),
    actionGroupInvocationOutput: S.optional(ActionGroupInvocationOutput),
    agentCollaboratorInvocationOutput: S.optional(
      AgentCollaboratorInvocationOutput,
    ),
    knowledgeBaseLookupOutput: S.optional(KnowledgeBaseLookupOutput),
    finalResponse: S.optional(FinalResponse),
    repromptResponse: S.optional(RepromptResponse),
    codeInterpreterInvocationOutput: S.optional(
      CodeInterpreterInvocationOutput,
    ),
  }),
).annotations({ identifier: "Observation" }) as any as S.Schema<Observation>;
export interface OrchestrationModelInvocationOutput {
  traceId?: string;
  rawResponse?: RawResponse;
  metadata?: Metadata;
  reasoningContent?: ReasoningContentBlock;
}
export const OrchestrationModelInvocationOutput = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String),
    rawResponse: S.optional(RawResponse),
    metadata: S.optional(Metadata),
    reasoningContent: S.optional(ReasoningContentBlock),
  }),
).annotations({
  identifier: "OrchestrationModelInvocationOutput",
}) as any as S.Schema<OrchestrationModelInvocationOutput>;
export type OrchestrationTrace =
  | { rationale: Rationale }
  | { invocationInput: InvocationInput }
  | { observation: Observation }
  | { modelInvocationInput: ModelInvocationInput }
  | { modelInvocationOutput: OrchestrationModelInvocationOutput };
export const OrchestrationTrace = S.Union(
  S.Struct({ rationale: Rationale }),
  S.Struct({ invocationInput: InvocationInput }),
  S.Struct({ observation: Observation }),
  S.Struct({ modelInvocationInput: ModelInvocationInput }),
  S.Struct({ modelInvocationOutput: OrchestrationModelInvocationOutput }),
);
export interface PostProcessingParsedResponse {
  text?: string | redacted.Redacted<string>;
}
export const PostProcessingParsedResponse = S.suspend(() =>
  S.Struct({ text: S.optional(SensitiveString) }),
).annotations({
  identifier: "PostProcessingParsedResponse",
}) as any as S.Schema<PostProcessingParsedResponse>;
export interface PostProcessingModelInvocationOutput {
  traceId?: string;
  parsedResponse?: PostProcessingParsedResponse;
  rawResponse?: RawResponse;
  metadata?: Metadata;
  reasoningContent?: ReasoningContentBlock;
}
export const PostProcessingModelInvocationOutput = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String),
    parsedResponse: S.optional(PostProcessingParsedResponse),
    rawResponse: S.optional(RawResponse),
    metadata: S.optional(Metadata),
    reasoningContent: S.optional(ReasoningContentBlock),
  }),
).annotations({
  identifier: "PostProcessingModelInvocationOutput",
}) as any as S.Schema<PostProcessingModelInvocationOutput>;
export type PostProcessingTrace =
  | { modelInvocationInput: ModelInvocationInput }
  | { modelInvocationOutput: PostProcessingModelInvocationOutput };
export const PostProcessingTrace = S.Union(
  S.Struct({ modelInvocationInput: ModelInvocationInput }),
  S.Struct({ modelInvocationOutput: PostProcessingModelInvocationOutput }),
);
export interface RoutingClassifierModelInvocationOutput {
  traceId?: string;
  rawResponse?: RawResponse;
  metadata?: Metadata;
}
export const RoutingClassifierModelInvocationOutput = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String),
    rawResponse: S.optional(RawResponse),
    metadata: S.optional(Metadata),
  }),
).annotations({
  identifier: "RoutingClassifierModelInvocationOutput",
}) as any as S.Schema<RoutingClassifierModelInvocationOutput>;
export type RoutingClassifierTrace =
  | { invocationInput: InvocationInput }
  | { observation: Observation }
  | { modelInvocationInput: ModelInvocationInput }
  | { modelInvocationOutput: RoutingClassifierModelInvocationOutput };
export const RoutingClassifierTrace = S.Union(
  S.Struct({ invocationInput: InvocationInput }),
  S.Struct({ observation: Observation }),
  S.Struct({ modelInvocationInput: ModelInvocationInput }),
  S.Struct({ modelInvocationOutput: RoutingClassifierModelInvocationOutput }),
);
export interface FailureTrace {
  traceId?: string;
  failureReason?: string | redacted.Redacted<string>;
  failureCode?: number;
  metadata?: Metadata;
}
export const FailureTrace = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String),
    failureReason: S.optional(SensitiveString),
    failureCode: S.optional(S.Number),
    metadata: S.optional(Metadata),
  }),
).annotations({ identifier: "FailureTrace" }) as any as S.Schema<FailureTrace>;
export interface CustomOrchestrationTraceEvent {
  text?: string;
}
export const CustomOrchestrationTraceEvent = S.suspend(() =>
  S.Struct({ text: S.optional(S.String) }),
).annotations({
  identifier: "CustomOrchestrationTraceEvent",
}) as any as S.Schema<CustomOrchestrationTraceEvent>;
export interface CustomOrchestrationTrace {
  traceId?: string;
  event?: CustomOrchestrationTraceEvent;
}
export const CustomOrchestrationTrace = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String),
    event: S.optional(CustomOrchestrationTraceEvent),
  }),
).annotations({
  identifier: "CustomOrchestrationTrace",
}) as any as S.Schema<CustomOrchestrationTrace>;
export type Trace =
  | { guardrailTrace: GuardrailTrace }
  | { preProcessingTrace: PreProcessingTrace }
  | { orchestrationTrace: OrchestrationTrace }
  | { postProcessingTrace: PostProcessingTrace }
  | { routingClassifierTrace: RoutingClassifierTrace }
  | { failureTrace: FailureTrace }
  | { customOrchestrationTrace: CustomOrchestrationTrace };
export const Trace = S.Union(
  S.Struct({ guardrailTrace: GuardrailTrace }),
  S.Struct({ preProcessingTrace: PreProcessingTrace }),
  S.Struct({ orchestrationTrace: OrchestrationTrace }),
  S.Struct({ postProcessingTrace: PostProcessingTrace }),
  S.Struct({ routingClassifierTrace: RoutingClassifierTrace }),
  S.Struct({ failureTrace: FailureTrace }),
  S.Struct({ customOrchestrationTrace: CustomOrchestrationTrace }),
);
export interface TracePart {
  sessionId?: string;
  trace?: Trace;
  callerChain?: Caller[];
  eventTime?: Date;
  collaboratorName?: string | redacted.Redacted<string>;
  agentId?: string;
  agentAliasId?: string;
  agentVersion?: string;
}
export const TracePart = S.suspend(() =>
  S.Struct({
    sessionId: S.optional(S.String),
    trace: S.optional(Trace),
    callerChain: S.optional(CallerChain),
    eventTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    collaboratorName: S.optional(SensitiveString),
    agentId: S.optional(S.String),
    agentAliasId: S.optional(S.String),
    agentVersion: S.optional(S.String),
  }),
).annotations({ identifier: "TracePart" }) as any as S.Schema<TracePart>;
export type AgentTraces = TracePart[];
export const AgentTraces = S.Array(TracePart);
export type TraceElements = { agentTraces: TracePart[] };
export const TraceElements = S.Union(S.Struct({ agentTraces: AgentTraces }));
export interface RerankRequest {
  queries: RerankQuery[];
  sources: RerankSource[];
  rerankingConfiguration: RerankingConfiguration;
  nextToken?: string;
}
export const RerankRequest = S.suspend(() =>
  S.Struct({
    queries: RerankQueriesList,
    sources: RerankSourcesList,
    rerankingConfiguration: RerankingConfiguration,
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/rerank" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RerankRequest",
}) as any as S.Schema<RerankRequest>;
export interface FlowExecutionInputEvent {
  nodeName: string;
  timestamp: Date;
  fields: FlowInputField[];
}
export const FlowExecutionInputEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    fields: FlowInputFields,
  }),
).annotations({
  identifier: "FlowExecutionInputEvent",
}) as any as S.Schema<FlowExecutionInputEvent>;
export interface NodeInputEvent {
  nodeName: string;
  timestamp: Date;
  fields: NodeInputField[];
}
export const NodeInputEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    fields: NodeInputFields,
  }),
).annotations({
  identifier: "NodeInputEvent",
}) as any as S.Schema<NodeInputEvent>;
export interface NodeOutputEvent {
  nodeName: string;
  timestamp: Date;
  fields: NodeOutputField[];
}
export const NodeOutputEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    fields: NodeOutputFields,
  }),
).annotations({
  identifier: "NodeOutputEvent",
}) as any as S.Schema<NodeOutputEvent>;
export type GeneratedQueryType = "REDSHIFT_SQL";
export const GeneratedQueryType = S.Literal("REDSHIFT_SQL");
export interface AnalyzePromptEvent {
  message?: string;
}
export const AnalyzePromptEvent = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "AnalyzePromptEvent",
}) as any as S.Schema<AnalyzePromptEvent>;
export interface FlowTraceConditionNodeResultEvent {
  nodeName: string;
  timestamp: Date;
  satisfiedConditions: FlowTraceCondition[];
}
export const FlowTraceConditionNodeResultEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    satisfiedConditions: FlowTraceConditions,
  }),
).annotations({
  identifier: "FlowTraceConditionNodeResultEvent",
}) as any as S.Schema<FlowTraceConditionNodeResultEvent>;
export interface FlowTraceDependencyEvent {
  nodeName: string;
  timestamp: Date;
  traceElements: TraceElements;
}
export const FlowTraceDependencyEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    traceElements: TraceElements,
  }),
).annotations({
  identifier: "FlowTraceDependencyEvent",
}) as any as S.Schema<FlowTraceDependencyEvent>;
export type FlowTraceNodeInputContent = { document: any };
export const FlowTraceNodeInputContent = S.Union(S.Struct({ document: S.Any }));
export interface FlowTraceNodeInputSource {
  nodeName: string;
  outputFieldName: string;
  expression: string | redacted.Redacted<string>;
}
export const FlowTraceNodeInputSource = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    outputFieldName: S.String,
    expression: SensitiveString,
  }),
).annotations({
  identifier: "FlowTraceNodeInputSource",
}) as any as S.Schema<FlowTraceNodeInputSource>;
export interface FlowTraceNodeInputExecutionChainItem {
  nodeName: string;
  index?: number;
  type: FlowControlNodeType;
}
export const FlowTraceNodeInputExecutionChainItem = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    index: S.optional(S.Number),
    type: FlowControlNodeType,
  }),
).annotations({
  identifier: "FlowTraceNodeInputExecutionChainItem",
}) as any as S.Schema<FlowTraceNodeInputExecutionChainItem>;
export type FlowTraceNodeInputExecutionChain =
  FlowTraceNodeInputExecutionChainItem[];
export const FlowTraceNodeInputExecutionChain = S.Array(
  FlowTraceNodeInputExecutionChainItem,
);
export type FlowTraceNodeOutputContent = { document: any };
export const FlowTraceNodeOutputContent = S.Union(
  S.Struct({ document: S.Any }),
);
export interface FlowTraceNodeOutputNext {
  nodeName: string;
  inputFieldName: string;
}
export const FlowTraceNodeOutputNext = S.suspend(() =>
  S.Struct({ nodeName: S.String, inputFieldName: S.String }),
).annotations({
  identifier: "FlowTraceNodeOutputNext",
}) as any as S.Schema<FlowTraceNodeOutputNext>;
export type FlowTraceNodeOutputNextList = FlowTraceNodeOutputNext[];
export const FlowTraceNodeOutputNextList = S.Array(FlowTraceNodeOutputNext);
export interface GeneratedQuery {
  type?: GeneratedQueryType;
  sql?: string;
}
export const GeneratedQuery = S.suspend(() =>
  S.Struct({ type: S.optional(GeneratedQueryType), sql: S.optional(S.String) }),
).annotations({
  identifier: "GeneratedQuery",
}) as any as S.Schema<GeneratedQuery>;
export type GeneratedQueries = GeneratedQuery[];
export const GeneratedQueries = S.Array(GeneratedQuery);
export type OptimizedPrompt = { textPrompt: TextPrompt };
export const OptimizedPrompt = S.Union(S.Struct({ textPrompt: TextPrompt }));
export interface FlowTraceNodeInputField {
  nodeInputName: string;
  content: FlowTraceNodeInputContent;
  source?: FlowTraceNodeInputSource;
  type?: FlowNodeIODataType;
  category?: FlowNodeInputCategory;
  executionChain?: FlowTraceNodeInputExecutionChainItem[];
}
export const FlowTraceNodeInputField = S.suspend(() =>
  S.Struct({
    nodeInputName: S.String,
    content: FlowTraceNodeInputContent,
    source: S.optional(FlowTraceNodeInputSource),
    type: S.optional(FlowNodeIODataType),
    category: S.optional(FlowNodeInputCategory),
    executionChain: S.optional(FlowTraceNodeInputExecutionChain),
  }),
).annotations({
  identifier: "FlowTraceNodeInputField",
}) as any as S.Schema<FlowTraceNodeInputField>;
export type FlowTraceNodeInputFields = FlowTraceNodeInputField[];
export const FlowTraceNodeInputFields = S.Array(FlowTraceNodeInputField);
export interface FlowTraceNodeOutputField {
  nodeOutputName: string;
  content: FlowTraceNodeOutputContent;
  next?: FlowTraceNodeOutputNext[];
  type?: FlowNodeIODataType;
}
export const FlowTraceNodeOutputField = S.suspend(() =>
  S.Struct({
    nodeOutputName: S.String,
    content: FlowTraceNodeOutputContent,
    next: S.optional(FlowTraceNodeOutputNextList),
    type: S.optional(FlowNodeIODataType),
  }),
).annotations({
  identifier: "FlowTraceNodeOutputField",
}) as any as S.Schema<FlowTraceNodeOutputField>;
export type FlowTraceNodeOutputFields = FlowTraceNodeOutputField[];
export const FlowTraceNodeOutputFields = S.Array(FlowTraceNodeOutputField);
export interface GenerateQueryResponse {
  queries?: GeneratedQuery[];
}
export const GenerateQueryResponse = S.suspend(() =>
  S.Struct({ queries: S.optional(GeneratedQueries) }),
).annotations({
  identifier: "GenerateQueryResponse",
}) as any as S.Schema<GenerateQueryResponse>;
export interface InvokeInlineAgentRequest {
  customerEncryptionKeyArn?: string;
  foundationModel: string;
  instruction: string | redacted.Redacted<string>;
  idleSessionTTLInSeconds?: number;
  actionGroups?: AgentActionGroup[];
  knowledgeBases?: KnowledgeBase[];
  guardrailConfiguration?: GuardrailConfigurationWithArn;
  promptOverrideConfiguration?: PromptOverrideConfiguration;
  agentCollaboration?: AgentCollaboration;
  collaboratorConfigurations?: CollaboratorConfiguration[];
  agentName?: string | redacted.Redacted<string>;
  sessionId: string;
  endSession?: boolean;
  enableTrace?: boolean;
  inputText?: string | redacted.Redacted<string>;
  streamingConfigurations?: StreamingConfigurations;
  promptCreationConfigurations?: PromptCreationConfigurations;
  inlineSessionState?: InlineSessionState;
  collaborators?: Collaborator[];
  bedrockModelConfigurations?: InlineBedrockModelConfigurations;
  orchestrationType?: OrchestrationType;
  customOrchestration?: CustomOrchestration;
}
export const InvokeInlineAgentRequest = S.suspend(() =>
  S.Struct({
    customerEncryptionKeyArn: S.optional(S.String),
    foundationModel: S.String,
    instruction: SensitiveString,
    idleSessionTTLInSeconds: S.optional(S.Number),
    actionGroups: S.optional(AgentActionGroups),
    knowledgeBases: S.optional(KnowledgeBases),
    guardrailConfiguration: S.optional(GuardrailConfigurationWithArn),
    promptOverrideConfiguration: S.optional(PromptOverrideConfiguration),
    agentCollaboration: S.optional(AgentCollaboration),
    collaboratorConfigurations: S.optional(CollaboratorConfigurations),
    agentName: S.optional(SensitiveString),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    endSession: S.optional(S.Boolean),
    enableTrace: S.optional(S.Boolean),
    inputText: S.optional(SensitiveString),
    streamingConfigurations: S.optional(StreamingConfigurations),
    promptCreationConfigurations: S.optional(PromptCreationConfigurations),
    inlineSessionState: S.optional(InlineSessionState),
    collaborators: S.optional(Collaborators),
    bedrockModelConfigurations: S.optional(InlineBedrockModelConfigurations),
    orchestrationType: S.optional(OrchestrationType),
    customOrchestration: S.optional(CustomOrchestration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/agents/{sessionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvokeInlineAgentRequest",
}) as any as S.Schema<InvokeInlineAgentRequest>;
export interface RetrieveAndGenerateRequest {
  sessionId?: string;
  input: RetrieveAndGenerateInput;
  retrieveAndGenerateConfiguration?: RetrieveAndGenerateConfiguration;
  sessionConfiguration?: RetrieveAndGenerateSessionConfiguration;
}
export const RetrieveAndGenerateRequest = S.suspend(() =>
  S.Struct({
    sessionId: S.optional(S.String),
    input: RetrieveAndGenerateInput,
    retrieveAndGenerateConfiguration: S.optional(
      RetrieveAndGenerateConfiguration,
    ),
    sessionConfiguration: S.optional(RetrieveAndGenerateSessionConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/retrieveAndGenerate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RetrieveAndGenerateRequest",
}) as any as S.Schema<RetrieveAndGenerateRequest>;
export interface PutInvocationStepRequest {
  sessionIdentifier: string;
  invocationIdentifier: string;
  invocationStepTime: Date;
  payload: InvocationStepPayload;
  invocationStepId?: string;
}
export const PutInvocationStepRequest = S.suspend(() =>
  S.Struct({
    sessionIdentifier: S.String.pipe(T.HttpLabel("sessionIdentifier")),
    invocationIdentifier: S.String,
    invocationStepTime: S.Date.pipe(T.TimestampFormat("date-time")),
    payload: InvocationStepPayload,
    invocationStepId: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutInvocationStepRequest",
}) as any as S.Schema<PutInvocationStepRequest>;
export interface OptimizedPromptEvent {
  optimizedPrompt?: OptimizedPrompt;
}
export const OptimizedPromptEvent = S.suspend(() =>
  S.Struct({ optimizedPrompt: S.optional(OptimizedPrompt) }),
).annotations({
  identifier: "OptimizedPromptEvent",
}) as any as S.Schema<OptimizedPromptEvent>;
export interface CitationEvent {
  citation?: Citation;
  generatedResponsePart?: GeneratedResponsePart;
  retrievedReferences?: RetrievedReference[];
}
export const CitationEvent = S.suspend(() =>
  S.Struct({
    citation: S.optional(Citation),
    generatedResponsePart: S.optional(GeneratedResponsePart),
    retrievedReferences: S.optional(RetrievedReferences),
  }),
).annotations({
  identifier: "CitationEvent",
}) as any as S.Schema<CitationEvent>;
export interface FlowTraceNodeInputEvent {
  nodeName: string;
  timestamp: Date;
  fields: FlowTraceNodeInputField[];
}
export const FlowTraceNodeInputEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    fields: FlowTraceNodeInputFields,
  }),
).annotations({
  identifier: "FlowTraceNodeInputEvent",
}) as any as S.Schema<FlowTraceNodeInputEvent>;
export interface FlowTraceNodeOutputEvent {
  nodeName: string;
  timestamp: Date;
  fields: FlowTraceNodeOutputField[];
}
export const FlowTraceNodeOutputEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    fields: FlowTraceNodeOutputFields,
  }),
).annotations({
  identifier: "FlowTraceNodeOutputEvent",
}) as any as S.Schema<FlowTraceNodeOutputEvent>;
export type OptimizedPromptStream =
  | { optimizedPromptEvent: OptimizedPromptEvent }
  | { analyzePromptEvent: AnalyzePromptEvent }
  | { internalServerException: InternalServerException }
  | { throttlingException: ThrottlingException }
  | { validationException: ValidationException }
  | { dependencyFailedException: DependencyFailedException }
  | { accessDeniedException: AccessDeniedException }
  | { badGatewayException: BadGatewayException };
export const OptimizedPromptStream = T.EventStream(
  S.Union(
    S.Struct({ optimizedPromptEvent: OptimizedPromptEvent }),
    S.Struct({ analyzePromptEvent: AnalyzePromptEvent }),
    S.Struct({
      internalServerException: S.suspend(
        () => InternalServerException,
      ).annotations({ identifier: "InternalServerException" }),
    }),
    S.Struct({
      throttlingException: S.suspend(() => ThrottlingException).annotations({
        identifier: "ThrottlingException",
      }),
    }),
    S.Struct({
      validationException: S.suspend(() => ValidationException).annotations({
        identifier: "ValidationException",
      }),
    }),
    S.Struct({
      dependencyFailedException: S.suspend(
        () => DependencyFailedException,
      ).annotations({ identifier: "DependencyFailedException" }),
    }),
    S.Struct({
      accessDeniedException: S.suspend(() => AccessDeniedException).annotations(
        { identifier: "AccessDeniedException" },
      ),
    }),
    S.Struct({
      badGatewayException: S.suspend(() => BadGatewayException).annotations({
        identifier: "BadGatewayException",
      }),
    }),
  ),
) as any as S.Schema<stream.Stream<OptimizedPromptStream, Error, never>>;
export interface RerankResult {
  index: number;
  relevanceScore: number;
  document?: RerankDocument;
}
export const RerankResult = S.suspend(() =>
  S.Struct({
    index: S.Number,
    relevanceScore: S.Number,
    document: S.optional(RerankDocument),
  }),
).annotations({ identifier: "RerankResult" }) as any as S.Schema<RerankResult>;
export type RerankResultsList = RerankResult[];
export const RerankResultsList = S.Array(RerankResult);
export type Citations = Citation[];
export const Citations = S.Array(Citation);
export type RetrieveAndGenerateStreamResponseOutput =
  | { output: RetrieveAndGenerateOutputEvent }
  | { citation: CitationEvent }
  | { guardrail: GuardrailEvent }
  | { internalServerException: InternalServerException }
  | { validationException: ValidationException }
  | { resourceNotFoundException: ResourceNotFoundException }
  | { serviceQuotaExceededException: ServiceQuotaExceededException }
  | { throttlingException: ThrottlingException }
  | { accessDeniedException: AccessDeniedException }
  | { conflictException: ConflictException }
  | { dependencyFailedException: DependencyFailedException }
  | { badGatewayException: BadGatewayException };
export const RetrieveAndGenerateStreamResponseOutput = T.EventStream(
  S.Union(
    S.Struct({ output: RetrieveAndGenerateOutputEvent }),
    S.Struct({ citation: CitationEvent }),
    S.Struct({ guardrail: GuardrailEvent }),
    S.Struct({
      internalServerException: S.suspend(
        () => InternalServerException,
      ).annotations({ identifier: "InternalServerException" }),
    }),
    S.Struct({
      validationException: S.suspend(() => ValidationException).annotations({
        identifier: "ValidationException",
      }),
    }),
    S.Struct({
      resourceNotFoundException: S.suspend(
        () => ResourceNotFoundException,
      ).annotations({ identifier: "ResourceNotFoundException" }),
    }),
    S.Struct({
      serviceQuotaExceededException: S.suspend(
        () => ServiceQuotaExceededException,
      ).annotations({ identifier: "ServiceQuotaExceededException" }),
    }),
    S.Struct({
      throttlingException: S.suspend(() => ThrottlingException).annotations({
        identifier: "ThrottlingException",
      }),
    }),
    S.Struct({
      accessDeniedException: S.suspend(() => AccessDeniedException).annotations(
        { identifier: "AccessDeniedException" },
      ),
    }),
    S.Struct({
      conflictException: S.suspend(() => ConflictException).annotations({
        identifier: "ConflictException",
      }),
    }),
    S.Struct({
      dependencyFailedException: S.suspend(
        () => DependencyFailedException,
      ).annotations({ identifier: "DependencyFailedException" }),
    }),
    S.Struct({
      badGatewayException: S.suspend(() => BadGatewayException).annotations({
        identifier: "BadGatewayException",
      }),
    }),
  ),
) as any as S.Schema<
  stream.Stream<RetrieveAndGenerateStreamResponseOutput, Error, never>
>;
export type FlowTrace =
  | { nodeInputTrace: FlowTraceNodeInputEvent }
  | { nodeOutputTrace: FlowTraceNodeOutputEvent }
  | { conditionNodeResultTrace: FlowTraceConditionNodeResultEvent }
  | { nodeActionTrace: FlowTraceNodeActionEvent }
  | { nodeDependencyTrace: FlowTraceDependencyEvent };
export const FlowTrace = S.Union(
  S.Struct({ nodeInputTrace: FlowTraceNodeInputEvent }),
  S.Struct({ nodeOutputTrace: FlowTraceNodeOutputEvent }),
  S.Struct({ conditionNodeResultTrace: FlowTraceConditionNodeResultEvent }),
  S.Struct({ nodeActionTrace: FlowTraceNodeActionEvent }),
  S.Struct({ nodeDependencyTrace: FlowTraceDependencyEvent }),
);
export interface OptimizePromptResponse {
  optimizedPrompt: stream.Stream<OptimizedPromptStream, Error, never>;
}
export const OptimizePromptResponse = S.suspend(() =>
  S.Struct({ optimizedPrompt: OptimizedPromptStream.pipe(T.HttpPayload()) }),
).annotations({
  identifier: "OptimizePromptResponse",
}) as any as S.Schema<OptimizePromptResponse>;
export interface RerankResponse {
  results: RerankResult[];
  nextToken?: string;
}
export const RerankResponse = S.suspend(() =>
  S.Struct({ results: RerankResultsList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "RerankResponse",
}) as any as S.Schema<RerankResponse>;
export interface RetrieveAndGenerateStreamResponse {
  stream: stream.Stream<RetrieveAndGenerateStreamResponseOutput, Error, never>;
  sessionId: string;
}
export const RetrieveAndGenerateStreamResponse = S.suspend(() =>
  S.Struct({
    stream: RetrieveAndGenerateStreamResponseOutput.pipe(T.HttpPayload()),
    sessionId: S.String.pipe(
      T.HttpHeader("x-amzn-bedrock-knowledge-base-session-id"),
    ),
  }),
).annotations({
  identifier: "RetrieveAndGenerateStreamResponse",
}) as any as S.Schema<RetrieveAndGenerateStreamResponse>;
export interface PutInvocationStepResponse {
  invocationStepId: string;
}
export const PutInvocationStepResponse = S.suspend(() =>
  S.Struct({ invocationStepId: S.String }),
).annotations({
  identifier: "PutInvocationStepResponse",
}) as any as S.Schema<PutInvocationStepResponse>;
export interface FlowTraceEvent {
  trace: FlowTrace;
}
export const FlowTraceEvent = S.suspend(() =>
  S.Struct({ trace: FlowTrace }),
).annotations({
  identifier: "FlowTraceEvent",
}) as any as S.Schema<FlowTraceEvent>;
export type FlowResponseStream =
  | { flowOutputEvent: FlowOutputEvent }
  | { flowCompletionEvent: FlowCompletionEvent }
  | { flowTraceEvent: FlowTraceEvent }
  | { internalServerException: InternalServerException }
  | { validationException: ValidationException }
  | { resourceNotFoundException: ResourceNotFoundException }
  | { serviceQuotaExceededException: ServiceQuotaExceededException }
  | { throttlingException: ThrottlingException }
  | { accessDeniedException: AccessDeniedException }
  | { conflictException: ConflictException }
  | { dependencyFailedException: DependencyFailedException }
  | { badGatewayException: BadGatewayException }
  | { flowMultiTurnInputRequestEvent: FlowMultiTurnInputRequestEvent };
export const FlowResponseStream = T.EventStream(
  S.Union(
    S.Struct({ flowOutputEvent: FlowOutputEvent }),
    S.Struct({ flowCompletionEvent: FlowCompletionEvent }),
    S.Struct({ flowTraceEvent: FlowTraceEvent }),
    S.Struct({
      internalServerException: S.suspend(
        () => InternalServerException,
      ).annotations({ identifier: "InternalServerException" }),
    }),
    S.Struct({
      validationException: S.suspend(() => ValidationException).annotations({
        identifier: "ValidationException",
      }),
    }),
    S.Struct({
      resourceNotFoundException: S.suspend(
        () => ResourceNotFoundException,
      ).annotations({ identifier: "ResourceNotFoundException" }),
    }),
    S.Struct({
      serviceQuotaExceededException: S.suspend(
        () => ServiceQuotaExceededException,
      ).annotations({ identifier: "ServiceQuotaExceededException" }),
    }),
    S.Struct({
      throttlingException: S.suspend(() => ThrottlingException).annotations({
        identifier: "ThrottlingException",
      }),
    }),
    S.Struct({
      accessDeniedException: S.suspend(() => AccessDeniedException).annotations(
        { identifier: "AccessDeniedException" },
      ),
    }),
    S.Struct({
      conflictException: S.suspend(() => ConflictException).annotations({
        identifier: "ConflictException",
      }),
    }),
    S.Struct({
      dependencyFailedException: S.suspend(
        () => DependencyFailedException,
      ).annotations({ identifier: "DependencyFailedException" }),
    }),
    S.Struct({
      badGatewayException: S.suspend(() => BadGatewayException).annotations({
        identifier: "BadGatewayException",
      }),
    }),
    S.Struct({
      flowMultiTurnInputRequestEvent: FlowMultiTurnInputRequestEvent,
    }),
  ),
) as any as S.Schema<stream.Stream<FlowResponseStream, Error, never>>;
export interface SessionState {
  sessionAttributes?: { [key: string]: string };
  promptSessionAttributes?: { [key: string]: string };
  returnControlInvocationResults?: InvocationResultMember[];
  invocationId?: string;
  files?: InputFile[];
  knowledgeBaseConfigurations?: KnowledgeBaseConfiguration[];
  conversationHistory?: ConversationHistory;
}
export const SessionState = S.suspend(() =>
  S.Struct({
    sessionAttributes: S.optional(SessionAttributesMap),
    promptSessionAttributes: S.optional(PromptSessionAttributesMap),
    returnControlInvocationResults: S.optional(ReturnControlInvocationResults),
    invocationId: S.optional(S.String),
    files: S.optional(InputFiles),
    knowledgeBaseConfigurations: S.optional(KnowledgeBaseConfigurations),
    conversationHistory: S.optional(ConversationHistory),
  }),
).annotations({ identifier: "SessionState" }) as any as S.Schema<SessionState>;
export interface RetrieveAndGenerateOutput {
  text: string;
}
export const RetrieveAndGenerateOutput = S.suspend(() =>
  S.Struct({ text: S.String }),
).annotations({
  identifier: "RetrieveAndGenerateOutput",
}) as any as S.Schema<RetrieveAndGenerateOutput>;
export interface InvokeFlowResponse {
  responseStream: stream.Stream<FlowResponseStream, Error, never>;
  executionId?: string;
}
export const InvokeFlowResponse = S.suspend(() =>
  S.Struct({
    responseStream: FlowResponseStream.pipe(T.HttpPayload()),
    executionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-bedrock-flow-execution-id"),
    ),
  }),
).annotations({
  identifier: "InvokeFlowResponse",
}) as any as S.Schema<InvokeFlowResponse>;
export interface InvokeAgentRequest {
  sessionState?: SessionState;
  agentId: string;
  agentAliasId: string;
  sessionId: string;
  endSession?: boolean;
  enableTrace?: boolean;
  inputText?: string | redacted.Redacted<string>;
  memoryId?: string;
  bedrockModelConfigurations?: BedrockModelConfigurations;
  streamingConfigurations?: StreamingConfigurations;
  promptCreationConfigurations?: PromptCreationConfigurations;
  sourceArn?: string;
}
export const InvokeAgentRequest = S.suspend(() =>
  S.Struct({
    sessionState: S.optional(SessionState),
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    endSession: S.optional(S.Boolean),
    enableTrace: S.optional(S.Boolean),
    inputText: S.optional(SensitiveString),
    memoryId: S.optional(S.String),
    bedrockModelConfigurations: S.optional(BedrockModelConfigurations),
    streamingConfigurations: S.optional(StreamingConfigurations),
    promptCreationConfigurations: S.optional(PromptCreationConfigurations),
    sourceArn: S.optional(S.String).pipe(T.HttpHeader("x-amz-source-arn")),
  }).pipe(
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
  ),
).annotations({
  identifier: "InvokeAgentRequest",
}) as any as S.Schema<InvokeAgentRequest>;
export interface RetrieveAndGenerateResponse {
  sessionId: string;
  output: RetrieveAndGenerateOutput;
  citations?: Citation[];
  guardrailAction?: GuadrailAction;
}
export const RetrieveAndGenerateResponse = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    output: RetrieveAndGenerateOutput,
    citations: S.optional(Citations),
    guardrailAction: S.optional(GuadrailAction),
  }),
).annotations({
  identifier: "RetrieveAndGenerateResponse",
}) as any as S.Schema<RetrieveAndGenerateResponse>;
export interface RetrieveRequest {
  knowledgeBaseId: string;
  retrievalQuery: KnowledgeBaseQuery;
  retrievalConfiguration?: KnowledgeBaseRetrievalConfiguration;
  guardrailConfiguration?: GuardrailConfiguration;
  nextToken?: string;
}
export const RetrieveRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    retrievalQuery: KnowledgeBaseQuery,
    retrievalConfiguration: S.optional(KnowledgeBaseRetrievalConfiguration),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
    nextToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "RetrieveRequest",
}) as any as S.Schema<RetrieveRequest>;
export interface InlineAgentTracePart {
  sessionId?: string;
  trace?: Trace;
  callerChain?: Caller[];
  eventTime?: Date;
  collaboratorName?: string | redacted.Redacted<string>;
}
export const InlineAgentTracePart = S.suspend(() =>
  S.Struct({
    sessionId: S.optional(S.String),
    trace: S.optional(Trace),
    callerChain: S.optional(CallerChain),
    eventTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    collaboratorName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "InlineAgentTracePart",
}) as any as S.Schema<InlineAgentTracePart>;
export interface InlineAgentReturnControlPayload {
  invocationInputs?: InvocationInputMember[];
  invocationId?: string;
}
export const InlineAgentReturnControlPayload = S.suspend(() =>
  S.Struct({
    invocationInputs: S.optional(InvocationInputs),
    invocationId: S.optional(S.String),
  }),
).annotations({
  identifier: "InlineAgentReturnControlPayload",
}) as any as S.Schema<InlineAgentReturnControlPayload>;
export interface Attribution {
  citations?: Citation[];
}
export const Attribution = S.suspend(() =>
  S.Struct({ citations: S.optional(Citations) }),
).annotations({ identifier: "Attribution" }) as any as S.Schema<Attribution>;
export interface OutputFile {
  name?: string;
  type?: string;
  bytes?: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const OutputFile = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(S.String),
    bytes: S.optional(SensitiveBlob),
  }),
).annotations({ identifier: "OutputFile" }) as any as S.Schema<OutputFile>;
export type OutputFiles = OutputFile[];
export const OutputFiles = S.Array(OutputFile);
export interface InlineAgentPayloadPart {
  bytes?: Uint8Array | redacted.Redacted<Uint8Array>;
  attribution?: Attribution;
}
export const InlineAgentPayloadPart = S.suspend(() =>
  S.Struct({
    bytes: S.optional(SensitiveBlob),
    attribution: S.optional(Attribution),
  }),
).annotations({
  identifier: "InlineAgentPayloadPart",
}) as any as S.Schema<InlineAgentPayloadPart>;
export interface InlineAgentFilePart {
  files?: OutputFile[];
}
export const InlineAgentFilePart = S.suspend(() =>
  S.Struct({ files: S.optional(OutputFiles) }),
).annotations({
  identifier: "InlineAgentFilePart",
}) as any as S.Schema<InlineAgentFilePart>;
export type InlineAgentResponseStream =
  | { chunk: InlineAgentPayloadPart }
  | { trace: InlineAgentTracePart }
  | { returnControl: InlineAgentReturnControlPayload }
  | { internalServerException: InternalServerException }
  | { validationException: ValidationException }
  | { resourceNotFoundException: ResourceNotFoundException }
  | { serviceQuotaExceededException: ServiceQuotaExceededException }
  | { throttlingException: ThrottlingException }
  | { accessDeniedException: AccessDeniedException }
  | { conflictException: ConflictException }
  | { dependencyFailedException: DependencyFailedException }
  | { badGatewayException: BadGatewayException }
  | { files: InlineAgentFilePart };
export const InlineAgentResponseStream = T.EventStream(
  S.Union(
    S.Struct({ chunk: InlineAgentPayloadPart }),
    S.Struct({ trace: InlineAgentTracePart }),
    S.Struct({ returnControl: InlineAgentReturnControlPayload }),
    S.Struct({
      internalServerException: S.suspend(
        () => InternalServerException,
      ).annotations({ identifier: "InternalServerException" }),
    }),
    S.Struct({
      validationException: S.suspend(() => ValidationException).annotations({
        identifier: "ValidationException",
      }),
    }),
    S.Struct({
      resourceNotFoundException: S.suspend(
        () => ResourceNotFoundException,
      ).annotations({ identifier: "ResourceNotFoundException" }),
    }),
    S.Struct({
      serviceQuotaExceededException: S.suspend(
        () => ServiceQuotaExceededException,
      ).annotations({ identifier: "ServiceQuotaExceededException" }),
    }),
    S.Struct({
      throttlingException: S.suspend(() => ThrottlingException).annotations({
        identifier: "ThrottlingException",
      }),
    }),
    S.Struct({
      accessDeniedException: S.suspend(() => AccessDeniedException).annotations(
        { identifier: "AccessDeniedException" },
      ),
    }),
    S.Struct({
      conflictException: S.suspend(() => ConflictException).annotations({
        identifier: "ConflictException",
      }),
    }),
    S.Struct({
      dependencyFailedException: S.suspend(
        () => DependencyFailedException,
      ).annotations({ identifier: "DependencyFailedException" }),
    }),
    S.Struct({
      badGatewayException: S.suspend(() => BadGatewayException).annotations({
        identifier: "BadGatewayException",
      }),
    }),
    S.Struct({ files: InlineAgentFilePart }),
  ),
) as any as S.Schema<stream.Stream<InlineAgentResponseStream, Error, never>>;
export interface KnowledgeBaseRetrievalResult {
  content: RetrievalResultContent;
  location?: RetrievalResultLocation;
  score?: number;
  metadata?: { [key: string]: any };
}
export const KnowledgeBaseRetrievalResult = S.suspend(() =>
  S.Struct({
    content: RetrievalResultContent,
    location: S.optional(RetrievalResultLocation),
    score: S.optional(S.Number),
    metadata: S.optional(RetrievalResultMetadata),
  }),
).annotations({
  identifier: "KnowledgeBaseRetrievalResult",
}) as any as S.Schema<KnowledgeBaseRetrievalResult>;
export type KnowledgeBaseRetrievalResults = KnowledgeBaseRetrievalResult[];
export const KnowledgeBaseRetrievalResults = S.Array(
  KnowledgeBaseRetrievalResult,
);
export interface InvokeInlineAgentResponse {
  completion: stream.Stream<InlineAgentResponseStream, Error, never>;
  contentType: string;
  sessionId: string;
}
export const InvokeInlineAgentResponse = S.suspend(() =>
  S.Struct({
    completion: InlineAgentResponseStream.pipe(T.HttpPayload()),
    contentType: S.String.pipe(
      T.HttpHeader("x-amzn-bedrock-agent-content-type"),
    ),
    sessionId: S.String.pipe(T.HttpHeader("x-amz-bedrock-agent-session-id")),
  }),
).annotations({
  identifier: "InvokeInlineAgentResponse",
}) as any as S.Schema<InvokeInlineAgentResponse>;
export interface RetrieveResponse {
  retrievalResults: KnowledgeBaseRetrievalResult[];
  guardrailAction?: GuadrailAction;
  nextToken?: string;
}
export const RetrieveResponse = S.suspend(() =>
  S.Struct({
    retrievalResults: KnowledgeBaseRetrievalResults,
    guardrailAction: S.optional(GuadrailAction),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "RetrieveResponse",
}) as any as S.Schema<RetrieveResponse>;
export interface PayloadPart {
  bytes?: Uint8Array | redacted.Redacted<Uint8Array>;
  attribution?: Attribution;
}
export const PayloadPart = S.suspend(() =>
  S.Struct({
    bytes: S.optional(SensitiveBlob),
    attribution: S.optional(Attribution),
  }),
).annotations({ identifier: "PayloadPart" }) as any as S.Schema<PayloadPart>;
export interface FilePart {
  files?: OutputFile[];
}
export const FilePart = S.suspend(() =>
  S.Struct({ files: S.optional(OutputFiles) }),
).annotations({ identifier: "FilePart" }) as any as S.Schema<FilePart>;
export type ResponseStream =
  | { chunk: PayloadPart }
  | { trace: TracePart }
  | { returnControl: ReturnControlPayload }
  | { internalServerException: InternalServerException }
  | { validationException: ValidationException }
  | { resourceNotFoundException: ResourceNotFoundException }
  | { serviceQuotaExceededException: ServiceQuotaExceededException }
  | { throttlingException: ThrottlingException }
  | { accessDeniedException: AccessDeniedException }
  | { conflictException: ConflictException }
  | { dependencyFailedException: DependencyFailedException }
  | { badGatewayException: BadGatewayException }
  | { modelNotReadyException: ModelNotReadyException }
  | { files: FilePart };
export const ResponseStream = T.EventStream(
  S.Union(
    S.Struct({ chunk: PayloadPart }),
    S.Struct({ trace: TracePart }),
    S.Struct({ returnControl: ReturnControlPayload }),
    S.Struct({
      internalServerException: S.suspend(
        () => InternalServerException,
      ).annotations({ identifier: "InternalServerException" }),
    }),
    S.Struct({
      validationException: S.suspend(() => ValidationException).annotations({
        identifier: "ValidationException",
      }),
    }),
    S.Struct({
      resourceNotFoundException: S.suspend(
        () => ResourceNotFoundException,
      ).annotations({ identifier: "ResourceNotFoundException" }),
    }),
    S.Struct({
      serviceQuotaExceededException: S.suspend(
        () => ServiceQuotaExceededException,
      ).annotations({ identifier: "ServiceQuotaExceededException" }),
    }),
    S.Struct({
      throttlingException: S.suspend(() => ThrottlingException).annotations({
        identifier: "ThrottlingException",
      }),
    }),
    S.Struct({
      accessDeniedException: S.suspend(() => AccessDeniedException).annotations(
        { identifier: "AccessDeniedException" },
      ),
    }),
    S.Struct({
      conflictException: S.suspend(() => ConflictException).annotations({
        identifier: "ConflictException",
      }),
    }),
    S.Struct({
      dependencyFailedException: S.suspend(
        () => DependencyFailedException,
      ).annotations({ identifier: "DependencyFailedException" }),
    }),
    S.Struct({
      badGatewayException: S.suspend(() => BadGatewayException).annotations({
        identifier: "BadGatewayException",
      }),
    }),
    S.Struct({
      modelNotReadyException: S.suspend(
        () => ModelNotReadyException,
      ).annotations({ identifier: "ModelNotReadyException" }),
    }),
    S.Struct({ files: FilePart }),
  ),
) as any as S.Schema<stream.Stream<ResponseStream, Error, never>>;
export interface InvokeAgentResponse {
  completion: stream.Stream<ResponseStream, Error, never>;
  contentType: string;
  sessionId: string;
  memoryId?: string;
}
export const InvokeAgentResponse = S.suspend(() =>
  S.Struct({
    completion: ResponseStream.pipe(T.HttpPayload()),
    contentType: S.String.pipe(
      T.HttpHeader("x-amzn-bedrock-agent-content-type"),
    ),
    sessionId: S.String.pipe(T.HttpHeader("x-amz-bedrock-agent-session-id")),
    memoryId: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-bedrock-agent-memory-id"),
    ),
  }),
).annotations({
  identifier: "InvokeAgentResponse",
}) as any as S.Schema<InvokeAgentResponse>;
export type NodeTraceElements = { agentTraces: TracePart[] };
export const NodeTraceElements = S.Union(
  S.Struct({ agentTraces: AgentTraces }),
);
export interface NodeDependencyEvent {
  nodeName: string;
  timestamp: Date;
  traceElements: NodeTraceElements;
}
export const NodeDependencyEvent = S.suspend(() =>
  S.Struct({
    nodeName: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    traceElements: NodeTraceElements,
  }),
).annotations({
  identifier: "NodeDependencyEvent",
}) as any as S.Schema<NodeDependencyEvent>;
export type FlowExecutionEvent =
  | { flowInputEvent: FlowExecutionInputEvent }
  | { flowOutputEvent: FlowExecutionOutputEvent }
  | { nodeInputEvent: NodeInputEvent }
  | { nodeOutputEvent: NodeOutputEvent }
  | { conditionResultEvent: ConditionResultEvent }
  | { nodeFailureEvent: NodeFailureEvent }
  | { flowFailureEvent: FlowFailureEvent }
  | { nodeActionEvent: NodeActionEvent }
  | { nodeDependencyEvent: NodeDependencyEvent };
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
export type FlowExecutionEvents = FlowExecutionEvent[];
export const FlowExecutionEvents = S.Array(FlowExecutionEvent);
export interface ListFlowExecutionEventsResponse {
  flowExecutionEvents: FlowExecutionEvent[];
  nextToken?: string;
}
export const ListFlowExecutionEventsResponse = S.suspend(() =>
  S.Struct({
    flowExecutionEvents: FlowExecutionEvents,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFlowExecutionEventsResponse",
}) as any as S.Schema<ListFlowExecutionEventsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class BadGatewayException extends S.TaggedError<BadGatewayException>()(
  "BadGatewayException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String), reason: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class DependencyFailedException extends S.TaggedError<DependencyFailedException>()(
  "DependencyFailedException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ModelNotReadyException extends S.TaggedError<ModelNotReadyException>()(
  "ModelNotReadyException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Stops an Amazon Bedrock flow's execution. This operation prevents further processing of the flow and changes the execution status to `Aborted`.
 */
export const stopFlowExecution: (
  input: StopFlowExecutionRequest,
) => effect.Effect<
  StopFlowExecutionResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
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
export const getExecutionFlowSnapshot: (
  input: GetExecutionFlowSnapshotRequest,
) => effect.Effect<
  GetExecutionFlowSnapshotResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExecutionFlowSnapshotRequest,
  output: GetExecutionFlowSnapshotResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about a specific flow execution, including its status, start and end times, and any errors that occurred during execution.
 */
export const getFlowExecution: (
  input: GetFlowExecutionRequest,
) => effect.Effect<
  GetFlowExecutionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFlowExecutions: {
  (
    input: ListFlowExecutionsRequest,
  ): effect.Effect<
    ListFlowExecutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFlowExecutionsRequest,
  ) => stream.Stream<
    ListFlowExecutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFlowExecutionsRequest,
  ) => stream.Stream<
    FlowExecutionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Ends the session. After you end a session, you can still access its content but you can’t add to it. To delete the session and it's content, you use the DeleteSession API operation. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 */
export const endSession: (
  input: EndSessionRequest,
) => effect.Effect<
  EndSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createInvocation: (
  input: CreateInvocationRequest,
) => effect.Effect<
  CreateInvocationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSession: (
  input: DeleteSessionRequest,
) => effect.Effect<
  DeleteSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAgentMemory: (
  input: DeleteAgentMemoryRequest,
) => effect.Effect<
  DeleteAgentMemoryResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSession: (
  input: CreateSessionRequest,
) => effect.Effect<
  CreateSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSession: (
  input: GetSessionRequest,
) => effect.Effect<
  GetSessionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSession: (
  input: UpdateSessionRequest,
) => effect.Effect<
  UpdateSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listInvocations: {
  (
    input: ListInvocationsRequest,
  ): effect.Effect<
    ListInvocationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvocationsRequest,
  ) => stream.Stream<
    ListInvocationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvocationsRequest,
  ) => stream.Stream<
    InvocationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Retrieves the details of a specific invocation step within an invocation in a session. For more information about sessions, see Store and retrieve conversation history and context with Amazon Bedrock sessions.
 */
export const getInvocationStep: (
  input: GetInvocationStepRequest,
) => effect.Effect<
  GetInvocationStepResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listInvocationSteps: {
  (
    input: ListInvocationStepsRequest,
  ): effect.Effect<
    ListInvocationStepsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvocationStepsRequest,
  ) => stream.Stream<
    ListInvocationStepsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvocationStepsRequest,
  ) => stream.Stream<
    InvocationStepSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSessions: {
  (
    input: ListSessionsRequest,
  ): effect.Effect<
    ListSessionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionsRequest,
  ) => stream.Stream<
    ListSessionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionsRequest,
  ) => stream.Stream<
    SessionSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Starts an execution of an Amazon Bedrock flow. Unlike flows that run until completion or time out after five minutes, flow executions let you run flows asynchronously for longer durations. Flow executions also yield control so that your application can perform other tasks.
 *
 * This operation returns an Amazon Resource Name (ARN) that you can use to track and manage your flow execution.
 *
 * Flow executions is in preview release for Amazon Bedrock and is subject to change.
 */
export const startFlowExecution: (
  input: StartFlowExecutionRequest,
) => effect.Effect<
  StartFlowExecutionResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAgentMemory: {
  (
    input: GetAgentMemoryRequest,
  ): effect.Effect<
    GetAgentMemoryResponse,
    | AccessDeniedException
    | BadGatewayException
    | ConflictException
    | DependencyFailedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAgentMemoryRequest,
  ) => stream.Stream<
    GetAgentMemoryResponse,
    | AccessDeniedException
    | BadGatewayException
    | ConflictException
    | DependencyFailedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAgentMemoryRequest,
  ) => stream.Stream<
    Memory,
    | AccessDeniedException
    | BadGatewayException
    | ConflictException
    | DependencyFailedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Generates an SQL query from a natural language query. For more information, see Generate a query for structured data in the Amazon Bedrock User Guide.
 */
export const generateQuery: (
  input: GenerateQueryRequest,
) => effect.Effect<
  GenerateQueryResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const optimizePrompt: (
  input: OptimizePromptRequest,
) => effect.Effect<
  OptimizePromptResponse,
  | AccessDeniedException
  | BadGatewayException
  | DependencyFailedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const rerank: {
  (
    input: RerankRequest,
  ): effect.Effect<
    RerankResponse,
    | AccessDeniedException
    | BadGatewayException
    | ConflictException
    | DependencyFailedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: RerankRequest,
  ) => stream.Stream<
    RerankResponse,
    | AccessDeniedException
    | BadGatewayException
    | ConflictException
    | DependencyFailedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: RerankRequest,
  ) => stream.Stream<
    RerankResult,
    | AccessDeniedException
    | BadGatewayException
    | ConflictException
    | DependencyFailedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const retrieveAndGenerateStream: (
  input: RetrieveAndGenerateStreamRequest,
) => effect.Effect<
  RetrieveAndGenerateStreamResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const putInvocationStep: (
  input: PutInvocationStepRequest,
) => effect.Effect<
  PutInvocationStepResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const invokeFlow: (
  input: InvokeFlowRequest,
) => effect.Effect<
  InvokeFlowResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const retrieveAndGenerate: (
  input: RetrieveAndGenerateRequest,
) => effect.Effect<
  RetrieveAndGenerateResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const invokeInlineAgent: (
  input: InvokeInlineAgentRequest,
) => effect.Effect<
  InvokeInlineAgentResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const retrieve: {
  (
    input: RetrieveRequest,
  ): effect.Effect<
    RetrieveResponse,
    | AccessDeniedException
    | BadGatewayException
    | ConflictException
    | DependencyFailedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: RetrieveRequest,
  ) => stream.Stream<
    RetrieveResponse,
    | AccessDeniedException
    | BadGatewayException
    | ConflictException
    | DependencyFailedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: RetrieveRequest,
  ) => stream.Stream<
    KnowledgeBaseRetrievalResult,
    | AccessDeniedException
    | BadGatewayException
    | ConflictException
    | DependencyFailedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const invokeAgent: (
  input: InvokeAgentRequest,
) => effect.Effect<
  InvokeAgentResponse,
  | AccessDeniedException
  | BadGatewayException
  | ConflictException
  | DependencyFailedException
  | InternalServerException
  | ModelNotReadyException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFlowExecutionEvents: {
  (
    input: ListFlowExecutionEventsRequest,
  ): effect.Effect<
    ListFlowExecutionEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFlowExecutionEventsRequest,
  ) => stream.Stream<
    ListFlowExecutionEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFlowExecutionEventsRequest,
  ) => stream.Stream<
    FlowExecutionEvent,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
