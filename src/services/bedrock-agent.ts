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

//# Newtypes
export type Id = string;
export type DraftVersion = string;
export type Name = string;
export type ClientToken = string;
export type Description = string;
export type Version = string;
export type MaxResults = number;
export type NextToken = string;
export type CollaborationInstruction = string | Redacted.Redacted<string>;
export type Instruction = string | Redacted.Redacted<string>;
export type ModelIdentifier = string;
export type SessionTTL = number;
export type AgentRoleArn = string;
export type KmsKeyArn = string;
export type AgentAliasId = string;
export type FlowName = string;
export type FlowDescription = string;
export type FlowExecutionRoleArn = string;
export type FlowIdentifier = string;
export type FlowAliasIdentifier = string;
export type NumericalVersion = string;
export type KnowledgeBaseRoleArn = string;
export type PromptName = string;
export type PromptDescription = string;
export type PromptVariantName = string;
export type PromptIdentifier = string;
export type TaggableResourcesArn = string;
export type TagKey = string;
export type LambdaArn = string;
export type Payload = string | Redacted.Redacted<string>;
export type AgentAliasArn = string;
export type TagValue = string;
export type GuardrailIdentifier = string;
export type GuardrailVersion = string;
export type StorageDays = number;
export type ProvisionedModelIdentifier = string;
export type IngestionJobFilterValue = string;
export type PromptModelIdentifier = string;
export type NonBlankString = string;
export type FlowId = string;
export type FlowArn = string;
export type FlowAliasId = string;
export type FlowAliasArn = string;
export type PromptId = string;
export type PromptArn = string;
export type FlowNodeName = string;
export type FlowConnectionName = string;
export type S3BucketName = string;
export type S3ObjectKey = string;
export type FunctionDescription = string;
export type BasePromptTemplate = string | Redacted.Redacted<string>;
export type MaxRecentSessions = number;
export type S3BucketArn = string;
export type S3Prefix = string | Redacted.Redacted<string>;
export type BucketOwnerAccountId = string;
export type S3BucketUri = string;
export type BedrockEmbeddingModelArn = string;
export type KendraIndexArn = string;
export type OpenSearchServerlessCollectionArn = string;
export type OpenSearchServerlessIndexName = string;
export type OpenSearchManagedClusterDomainEndpoint = string;
export type OpenSearchManagedClusterDomainArn = string;
export type OpenSearchManagedClusterIndexName =
  | string
  | Redacted.Redacted<string>;
export type PineconeConnectionString = string;
export type SecretArn = string;
export type PineconeNamespace = string;
export type RedisEnterpriseCloudEndpoint = string;
export type RedisEnterpriseCloudIndexName = string;
export type RdsArn = string;
export type RdsDatabaseName = string;
export type RdsTableName = string;
export type MongoDbAtlasEndpoint = string;
export type MongoDbAtlasDatabaseName = string;
export type MongoDbAtlasCollectionName = string;
export type MongoDbAtlasIndexName = string;
export type MongoDbAtlasEndpointServiceName = string;
export type GraphArn = string | Redacted.Redacted<string>;
export type VectorBucketArn = string | Redacted.Redacted<string>;
export type IndexArn = string | Redacted.Redacted<string>;
export type IndexName = string | Redacted.Redacted<string>;
export type PromptMetadataKey = string | Redacted.Redacted<string>;
export type PromptMetadataValue = string | Redacted.Redacted<string>;
export type AgentArn = string;
export type FailureReason = string;
export type RecommendedAction = string;
export type KnowledgeBaseArn = string;
export type FlowNodeInputName = string;
export type FlowNodeInputExpression = string | Redacted.Redacted<string>;
export type FlowNodeOutputName = string;
export type Temperature = number;
export type TopP = number;
export type TopK = number;
export type MaximumLength = number;
export type FilterPattern = string | Redacted.Redacted<string>;
export type UserAgent = string | Redacted.Redacted<string>;
export type UserAgentHeader = string | Redacted.Redacted<string>;
export type HttpsUrl = string;
export type Microsoft365TenantId = string;
export type SharePointDomain = string;
export type BedrockModelArn = string;
export type Key = string | Redacted.Redacted<string>;
export type S3ObjectUri = string;
export type FieldName = string;
export type ColumnName = string;
export type TextPrompt = string | Redacted.Redacted<string>;
export type FlowKnowledgeBaseId = string;
export type KnowledgeBaseModelIdentifier = string;
export type FlowLexBotAliasArn = string;
export type FlowLexBotLocaleId = string;
export type FlowLambdaArn = string;
export type FlowAgentAliasArn = string;
export type InlineCode = string | Redacted.Redacted<string>;
export type FlowConditionName = string;
export type ParameterDescription = string;
export type ParsingPromptText = string;
export type NumberValue = number;
export type StringValue = string | Redacted.Redacted<string>;
export type Dimensions = number;
export type QueryExecutionTimeoutSeconds = number;
export type PromptInputVariableName = string;
export type NonEmptyString = string;
export type FlowConditionExpression = string | Redacted.Redacted<string>;
export type ErrorMessage = string;
export type KnowledgeBaseTextPrompt = string | Redacted.Redacted<string>;
export type Url = string;
export type Data = string | Redacted.Redacted<string>;
export type AwsDataCatalogTableName = string;
export type RedshiftDatabase = string;
export type WorkgroupArn = string;
export type RedshiftClusterIdentifier = string;
export type AdditionalModelRequestFieldsKey = string;
export type FlowPromptArn = string;
export type FlowPromptModelIdentifier = string;
export type FlowS3BucketName = string;
export type FilteredObjectType = string | Redacted.Redacted<string>;
export type QueryGenerationTableName = string;
export type DescriptionString = string;
export type NaturalLanguageString = string;
export type SqlString = string;
export type ToolName = string;
export type BedrockRerankingModelArn = string;
export type QueryGenerationColumnName = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteAgentActionGroupRequest {
  agentId: string;
  agentVersion: string;
  actionGroupId: string;
  skipResourceInUseCheck?: boolean;
}
export const DeleteAgentActionGroupRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    actionGroupId: S.String.pipe(T.HttpLabel("actionGroupId")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/actiongroups/{actionGroupId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAgentActionGroupRequest",
}) as any as S.Schema<DeleteAgentActionGroupRequest>;
export interface DeleteAgentActionGroupResponse {}
export const DeleteAgentActionGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAgentActionGroupResponse",
}) as any as S.Schema<DeleteAgentActionGroupResponse>;
export interface GetAgentActionGroupRequest {
  agentId: string;
  agentVersion: string;
  actionGroupId: string;
}
export const GetAgentActionGroupRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    actionGroupId: S.String.pipe(T.HttpLabel("actionGroupId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/actiongroups/{actionGroupId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAgentActionGroupRequest",
}) as any as S.Schema<GetAgentActionGroupRequest>;
export interface ListAgentActionGroupsRequest {
  agentId: string;
  agentVersion: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAgentActionGroupsRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/actiongroups/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAgentActionGroupsRequest",
}) as any as S.Schema<ListAgentActionGroupsRequest>;
export type ActionGroupSignatureParams = { [key: string]: string };
export const ActionGroupSignatureParams = S.Record({
  key: S.String,
  value: S.String,
});
export type ActionGroupExecutor =
  | { lambda: string }
  | { customControl: string };
export const ActionGroupExecutor = S.Union(
  S.Struct({ lambda: S.String }),
  S.Struct({ customControl: S.String }),
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
  | { payload: string | Redacted.Redacted<string> };
export const APISchema = S.Union(
  S.Struct({ s3: S3Identifier }),
  S.Struct({ payload: SensitiveString }),
);
export interface ParameterDetail {
  description?: string;
  type: string;
  required?: boolean;
}
export const ParameterDetail = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    type: S.String,
    required: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ParameterDetail",
}) as any as S.Schema<ParameterDetail>;
export type ParameterMap = { [key: string]: ParameterDetail };
export const ParameterMap = S.Record({ key: S.String, value: ParameterDetail });
export interface Function {
  name: string;
  description?: string;
  parameters?: ParameterMap;
  requireConfirmation?: string;
}
export const Function = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    parameters: S.optional(ParameterMap),
    requireConfirmation: S.optional(S.String),
  }),
).annotations({ identifier: "Function" }) as any as S.Schema<Function>;
export type Functions = Function[];
export const Functions = S.Array(Function);
export type FunctionSchema = { functions: Functions };
export const FunctionSchema = S.Union(S.Struct({ functions: Functions }));
export interface UpdateAgentActionGroupRequest {
  agentId: string;
  agentVersion: string;
  actionGroupId: string;
  actionGroupName: string;
  description?: string;
  parentActionGroupSignature?: string;
  parentActionGroupSignatureParams?: ActionGroupSignatureParams;
  actionGroupExecutor?: (typeof ActionGroupExecutor)["Type"];
  actionGroupState?: string;
  apiSchema?: (typeof APISchema)["Type"];
  functionSchema?: (typeof FunctionSchema)["Type"];
}
export const UpdateAgentActionGroupRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    actionGroupId: S.String.pipe(T.HttpLabel("actionGroupId")),
    actionGroupName: S.String,
    description: S.optional(S.String),
    parentActionGroupSignature: S.optional(S.String),
    parentActionGroupSignatureParams: S.optional(ActionGroupSignatureParams),
    actionGroupExecutor: S.optional(ActionGroupExecutor),
    actionGroupState: S.optional(S.String),
    apiSchema: S.optional(APISchema),
    functionSchema: S.optional(FunctionSchema),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/actiongroups/{actionGroupId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAgentActionGroupRequest",
}) as any as S.Schema<UpdateAgentActionGroupRequest>;
export interface DisassociateAgentCollaboratorRequest {
  agentId: string;
  agentVersion: string;
  collaboratorId: string;
}
export const DisassociateAgentCollaboratorRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    collaboratorId: S.String.pipe(T.HttpLabel("collaboratorId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/agentcollaborators/{collaboratorId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateAgentCollaboratorRequest",
}) as any as S.Schema<DisassociateAgentCollaboratorRequest>;
export interface DisassociateAgentCollaboratorResponse {}
export const DisassociateAgentCollaboratorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateAgentCollaboratorResponse",
}) as any as S.Schema<DisassociateAgentCollaboratorResponse>;
export interface GetAgentCollaboratorRequest {
  agentId: string;
  agentVersion: string;
  collaboratorId: string;
}
export const GetAgentCollaboratorRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    collaboratorId: S.String.pipe(T.HttpLabel("collaboratorId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/agentcollaborators/{collaboratorId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAgentCollaboratorRequest",
}) as any as S.Schema<GetAgentCollaboratorRequest>;
export interface ListAgentCollaboratorsRequest {
  agentId: string;
  agentVersion: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAgentCollaboratorsRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/agentcollaborators/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAgentCollaboratorsRequest",
}) as any as S.Schema<ListAgentCollaboratorsRequest>;
export interface AgentDescriptor {
  aliasArn?: string;
}
export const AgentDescriptor = S.suspend(() =>
  S.Struct({ aliasArn: S.optional(S.String) }),
).annotations({
  identifier: "AgentDescriptor",
}) as any as S.Schema<AgentDescriptor>;
export interface UpdateAgentCollaboratorRequest {
  agentId: string;
  agentVersion: string;
  collaboratorId: string;
  agentDescriptor: AgentDescriptor;
  collaboratorName: string;
  collaborationInstruction: string | Redacted.Redacted<string>;
  relayConversationHistory?: string;
}
export const UpdateAgentCollaboratorRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    collaboratorId: S.String.pipe(T.HttpLabel("collaboratorId")),
    agentDescriptor: AgentDescriptor,
    collaboratorName: S.String,
    collaborationInstruction: SensitiveString,
    relayConversationHistory: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/agentcollaborators/{collaboratorId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAgentCollaboratorRequest",
}) as any as S.Schema<UpdateAgentCollaboratorRequest>;
export interface DeleteAgentRequest {
  agentId: string;
  skipResourceInUseCheck?: boolean;
}
export const DeleteAgentRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/agents/{agentId}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAgentRequest",
}) as any as S.Schema<DeleteAgentRequest>;
export interface GetAgentRequest {
  agentId: string;
}
export const GetAgentRequest = S.suspend(() =>
  S.Struct({ agentId: S.String.pipe(T.HttpLabel("agentId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/agents/{agentId}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAgentRequest",
}) as any as S.Schema<GetAgentRequest>;
export interface ListAgentsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListAgentsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/agents/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAgentsRequest",
}) as any as S.Schema<ListAgentsRequest>;
export interface PrepareAgentRequest {
  agentId: string;
}
export const PrepareAgentRequest = S.suspend(() =>
  S.Struct({ agentId: S.String.pipe(T.HttpLabel("agentId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/agents/{agentId}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PrepareAgentRequest",
}) as any as S.Schema<PrepareAgentRequest>;
export type OrchestrationExecutor = { lambda: string };
export const OrchestrationExecutor = S.Union(S.Struct({ lambda: S.String }));
export interface CustomOrchestration {
  executor?: (typeof OrchestrationExecutor)["Type"];
}
export const CustomOrchestration = S.suspend(() =>
  S.Struct({ executor: S.optional(OrchestrationExecutor) }),
).annotations({
  identifier: "CustomOrchestration",
}) as any as S.Schema<CustomOrchestration>;
export type StopSequences = string[];
export const StopSequences = S.Array(S.String);
export interface InferenceConfiguration {
  temperature?: number;
  topP?: number;
  topK?: number;
  maximumLength?: number;
  stopSequences?: StopSequences;
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
  promptType?: string;
  promptCreationMode?: string;
  promptState?: string;
  basePromptTemplate?: string | Redacted.Redacted<string>;
  inferenceConfiguration?: InferenceConfiguration;
  parserMode?: string;
  foundationModel?: string;
  additionalModelRequestFields?: any;
}
export const PromptConfiguration = S.suspend(() =>
  S.Struct({
    promptType: S.optional(S.String),
    promptCreationMode: S.optional(S.String),
    promptState: S.optional(S.String),
    basePromptTemplate: S.optional(SensitiveString),
    inferenceConfiguration: S.optional(InferenceConfiguration),
    parserMode: S.optional(S.String),
    foundationModel: S.optional(S.String),
    additionalModelRequestFields: S.optional(S.Any),
  }),
).annotations({
  identifier: "PromptConfiguration",
}) as any as S.Schema<PromptConfiguration>;
export type PromptConfigurations = PromptConfiguration[];
export const PromptConfigurations = S.Array(PromptConfiguration);
export interface PromptOverrideConfiguration {
  promptConfigurations: PromptConfigurations;
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
export interface GuardrailConfiguration {
  guardrailIdentifier?: string;
  guardrailVersion?: string;
}
export const GuardrailConfiguration = S.suspend(() =>
  S.Struct({
    guardrailIdentifier: S.optional(S.String),
    guardrailVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "GuardrailConfiguration",
}) as any as S.Schema<GuardrailConfiguration>;
export type EnabledMemoryTypes = string[];
export const EnabledMemoryTypes = S.Array(S.String);
export interface SessionSummaryConfiguration {
  maxRecentSessions?: number;
}
export const SessionSummaryConfiguration = S.suspend(() =>
  S.Struct({ maxRecentSessions: S.optional(S.Number) }),
).annotations({
  identifier: "SessionSummaryConfiguration",
}) as any as S.Schema<SessionSummaryConfiguration>;
export interface MemoryConfiguration {
  enabledMemoryTypes: EnabledMemoryTypes;
  storageDays?: number;
  sessionSummaryConfiguration?: SessionSummaryConfiguration;
}
export const MemoryConfiguration = S.suspend(() =>
  S.Struct({
    enabledMemoryTypes: EnabledMemoryTypes,
    storageDays: S.optional(S.Number),
    sessionSummaryConfiguration: S.optional(SessionSummaryConfiguration),
  }),
).annotations({
  identifier: "MemoryConfiguration",
}) as any as S.Schema<MemoryConfiguration>;
export interface UpdateAgentRequest {
  agentId: string;
  agentName: string;
  instruction?: string | Redacted.Redacted<string>;
  foundationModel: string;
  description?: string;
  orchestrationType?: string;
  customOrchestration?: CustomOrchestration;
  idleSessionTTLInSeconds?: number;
  agentResourceRoleArn: string;
  customerEncryptionKeyArn?: string;
  promptOverrideConfiguration?: PromptOverrideConfiguration;
  guardrailConfiguration?: GuardrailConfiguration;
  memoryConfiguration?: MemoryConfiguration;
  agentCollaboration?: string;
}
export const UpdateAgentRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentName: S.String,
    instruction: S.optional(SensitiveString),
    foundationModel: S.String,
    description: S.optional(S.String),
    orchestrationType: S.optional(S.String),
    customOrchestration: S.optional(CustomOrchestration),
    idleSessionTTLInSeconds: S.optional(S.Number),
    agentResourceRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    promptOverrideConfiguration: S.optional(PromptOverrideConfiguration),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
    memoryConfiguration: S.optional(MemoryConfiguration),
    agentCollaboration: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/agents/{agentId}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAgentRequest",
}) as any as S.Schema<UpdateAgentRequest>;
export interface DeleteAgentAliasRequest {
  agentId: string;
  agentAliasId: string;
}
export const DeleteAgentAliasRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/agents/{agentId}/agentaliases/{agentAliasId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAgentAliasRequest",
}) as any as S.Schema<DeleteAgentAliasRequest>;
export interface GetAgentAliasRequest {
  agentId: string;
  agentAliasId: string;
}
export const GetAgentAliasRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/agents/{agentId}/agentaliases/{agentAliasId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAgentAliasRequest",
}) as any as S.Schema<GetAgentAliasRequest>;
export interface ListAgentAliasesRequest {
  agentId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAgentAliasesRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/agents/{agentId}/agentaliases/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAgentAliasesRequest",
}) as any as S.Schema<ListAgentAliasesRequest>;
export interface AgentAliasRoutingConfigurationListItem {
  agentVersion?: string;
  provisionedThroughput?: string;
}
export const AgentAliasRoutingConfigurationListItem = S.suspend(() =>
  S.Struct({
    agentVersion: S.optional(S.String),
    provisionedThroughput: S.optional(S.String),
  }),
).annotations({
  identifier: "AgentAliasRoutingConfigurationListItem",
}) as any as S.Schema<AgentAliasRoutingConfigurationListItem>;
export type AgentAliasRoutingConfiguration =
  AgentAliasRoutingConfigurationListItem[];
export const AgentAliasRoutingConfiguration = S.Array(
  AgentAliasRoutingConfigurationListItem,
);
export interface UpdateAgentAliasRequest {
  agentId: string;
  agentAliasId: string;
  agentAliasName: string;
  description?: string;
  routingConfiguration?: AgentAliasRoutingConfiguration;
  aliasInvocationState?: string;
}
export const UpdateAgentAliasRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
    agentAliasName: S.String,
    description: S.optional(S.String),
    routingConfiguration: S.optional(AgentAliasRoutingConfiguration),
    aliasInvocationState: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/agents/{agentId}/agentaliases/{agentAliasId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAgentAliasRequest",
}) as any as S.Schema<UpdateAgentAliasRequest>;
export interface DeleteDataSourceRequest {
  knowledgeBaseId: string;
  dataSourceId: string;
}
export const DeleteDataSourceRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/{dataSourceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataSourceRequest",
}) as any as S.Schema<DeleteDataSourceRequest>;
export interface GetDataSourceRequest {
  knowledgeBaseId: string;
  dataSourceId: string;
}
export const GetDataSourceRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/{dataSourceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataSourceRequest",
}) as any as S.Schema<GetDataSourceRequest>;
export interface ListDataSourcesRequest {
  knowledgeBaseId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListDataSourcesRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataSourcesRequest",
}) as any as S.Schema<ListDataSourcesRequest>;
export type S3Prefixes = string | Redacted.Redacted<string>[];
export const S3Prefixes = S.Array(SensitiveString);
export interface S3DataSourceConfiguration {
  bucketArn: string;
  inclusionPrefixes?: S3Prefixes;
  bucketOwnerAccountId?: string;
}
export const S3DataSourceConfiguration = S.suspend(() =>
  S.Struct({
    bucketArn: S.String,
    inclusionPrefixes: S.optional(S3Prefixes),
    bucketOwnerAccountId: S.optional(S.String),
  }),
).annotations({
  identifier: "S3DataSourceConfiguration",
}) as any as S.Schema<S3DataSourceConfiguration>;
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
export interface WebSourceConfiguration {
  urlConfiguration: UrlConfiguration;
}
export const WebSourceConfiguration = S.suspend(() =>
  S.Struct({ urlConfiguration: UrlConfiguration }),
).annotations({
  identifier: "WebSourceConfiguration",
}) as any as S.Schema<WebSourceConfiguration>;
export interface WebCrawlerLimits {
  rateLimit?: number;
  maxPages?: number;
}
export const WebCrawlerLimits = S.suspend(() =>
  S.Struct({ rateLimit: S.optional(S.Number), maxPages: S.optional(S.Number) }),
).annotations({
  identifier: "WebCrawlerLimits",
}) as any as S.Schema<WebCrawlerLimits>;
export type FilterList = string | Redacted.Redacted<string>[];
export const FilterList = S.Array(SensitiveString);
export interface WebCrawlerConfiguration {
  crawlerLimits?: WebCrawlerLimits;
  inclusionFilters?: FilterList;
  exclusionFilters?: FilterList;
  scope?: string;
  userAgent?: string | Redacted.Redacted<string>;
  userAgentHeader?: string | Redacted.Redacted<string>;
}
export const WebCrawlerConfiguration = S.suspend(() =>
  S.Struct({
    crawlerLimits: S.optional(WebCrawlerLimits),
    inclusionFilters: S.optional(FilterList),
    exclusionFilters: S.optional(FilterList),
    scope: S.optional(S.String),
    userAgent: S.optional(SensitiveString),
    userAgentHeader: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "WebCrawlerConfiguration",
}) as any as S.Schema<WebCrawlerConfiguration>;
export interface WebDataSourceConfiguration {
  sourceConfiguration: WebSourceConfiguration;
  crawlerConfiguration?: WebCrawlerConfiguration;
}
export const WebDataSourceConfiguration = S.suspend(() =>
  S.Struct({
    sourceConfiguration: WebSourceConfiguration,
    crawlerConfiguration: S.optional(WebCrawlerConfiguration),
  }),
).annotations({
  identifier: "WebDataSourceConfiguration",
}) as any as S.Schema<WebDataSourceConfiguration>;
export interface ConfluenceSourceConfiguration {
  hostUrl: string;
  hostType: string;
  authType: string;
  credentialsSecretArn: string;
}
export const ConfluenceSourceConfiguration = S.suspend(() =>
  S.Struct({
    hostUrl: S.String,
    hostType: S.String,
    authType: S.String,
    credentialsSecretArn: S.String,
  }),
).annotations({
  identifier: "ConfluenceSourceConfiguration",
}) as any as S.Schema<ConfluenceSourceConfiguration>;
export interface PatternObjectFilter {
  objectType: string | Redacted.Redacted<string>;
  inclusionFilters?: FilterList;
  exclusionFilters?: FilterList;
}
export const PatternObjectFilter = S.suspend(() =>
  S.Struct({
    objectType: SensitiveString,
    inclusionFilters: S.optional(FilterList),
    exclusionFilters: S.optional(FilterList),
  }),
).annotations({
  identifier: "PatternObjectFilter",
}) as any as S.Schema<PatternObjectFilter>;
export type PatternObjectFilterList = PatternObjectFilter[];
export const PatternObjectFilterList = S.Array(PatternObjectFilter);
export interface PatternObjectFilterConfiguration {
  filters: PatternObjectFilterList;
}
export const PatternObjectFilterConfiguration = S.suspend(() =>
  S.Struct({ filters: PatternObjectFilterList }),
).annotations({
  identifier: "PatternObjectFilterConfiguration",
}) as any as S.Schema<PatternObjectFilterConfiguration>;
export interface CrawlFilterConfiguration {
  type: string;
  patternObjectFilter?: PatternObjectFilterConfiguration;
}
export const CrawlFilterConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    patternObjectFilter: S.optional(PatternObjectFilterConfiguration),
  }),
).annotations({
  identifier: "CrawlFilterConfiguration",
}) as any as S.Schema<CrawlFilterConfiguration>;
export interface ConfluenceCrawlerConfiguration {
  filterConfiguration?: CrawlFilterConfiguration;
}
export const ConfluenceCrawlerConfiguration = S.suspend(() =>
  S.Struct({ filterConfiguration: S.optional(CrawlFilterConfiguration) }),
).annotations({
  identifier: "ConfluenceCrawlerConfiguration",
}) as any as S.Schema<ConfluenceCrawlerConfiguration>;
export interface ConfluenceDataSourceConfiguration {
  sourceConfiguration: ConfluenceSourceConfiguration;
  crawlerConfiguration?: ConfluenceCrawlerConfiguration;
}
export const ConfluenceDataSourceConfiguration = S.suspend(() =>
  S.Struct({
    sourceConfiguration: ConfluenceSourceConfiguration,
    crawlerConfiguration: S.optional(ConfluenceCrawlerConfiguration),
  }),
).annotations({
  identifier: "ConfluenceDataSourceConfiguration",
}) as any as S.Schema<ConfluenceDataSourceConfiguration>;
export interface SalesforceSourceConfiguration {
  hostUrl: string;
  authType: string;
  credentialsSecretArn: string;
}
export const SalesforceSourceConfiguration = S.suspend(() =>
  S.Struct({
    hostUrl: S.String,
    authType: S.String,
    credentialsSecretArn: S.String,
  }),
).annotations({
  identifier: "SalesforceSourceConfiguration",
}) as any as S.Schema<SalesforceSourceConfiguration>;
export interface SalesforceCrawlerConfiguration {
  filterConfiguration?: CrawlFilterConfiguration;
}
export const SalesforceCrawlerConfiguration = S.suspend(() =>
  S.Struct({ filterConfiguration: S.optional(CrawlFilterConfiguration) }),
).annotations({
  identifier: "SalesforceCrawlerConfiguration",
}) as any as S.Schema<SalesforceCrawlerConfiguration>;
export interface SalesforceDataSourceConfiguration {
  sourceConfiguration: SalesforceSourceConfiguration;
  crawlerConfiguration?: SalesforceCrawlerConfiguration;
}
export const SalesforceDataSourceConfiguration = S.suspend(() =>
  S.Struct({
    sourceConfiguration: SalesforceSourceConfiguration,
    crawlerConfiguration: S.optional(SalesforceCrawlerConfiguration),
  }),
).annotations({
  identifier: "SalesforceDataSourceConfiguration",
}) as any as S.Schema<SalesforceDataSourceConfiguration>;
export type SharePointSiteUrls = string[];
export const SharePointSiteUrls = S.Array(S.String);
export interface SharePointSourceConfiguration {
  tenantId?: string;
  domain: string;
  siteUrls: SharePointSiteUrls;
  hostType: string;
  authType: string;
  credentialsSecretArn: string;
}
export const SharePointSourceConfiguration = S.suspend(() =>
  S.Struct({
    tenantId: S.optional(S.String),
    domain: S.String,
    siteUrls: SharePointSiteUrls,
    hostType: S.String,
    authType: S.String,
    credentialsSecretArn: S.String,
  }),
).annotations({
  identifier: "SharePointSourceConfiguration",
}) as any as S.Schema<SharePointSourceConfiguration>;
export interface SharePointCrawlerConfiguration {
  filterConfiguration?: CrawlFilterConfiguration;
}
export const SharePointCrawlerConfiguration = S.suspend(() =>
  S.Struct({ filterConfiguration: S.optional(CrawlFilterConfiguration) }),
).annotations({
  identifier: "SharePointCrawlerConfiguration",
}) as any as S.Schema<SharePointCrawlerConfiguration>;
export interface SharePointDataSourceConfiguration {
  sourceConfiguration: SharePointSourceConfiguration;
  crawlerConfiguration?: SharePointCrawlerConfiguration;
}
export const SharePointDataSourceConfiguration = S.suspend(() =>
  S.Struct({
    sourceConfiguration: SharePointSourceConfiguration,
    crawlerConfiguration: S.optional(SharePointCrawlerConfiguration),
  }),
).annotations({
  identifier: "SharePointDataSourceConfiguration",
}) as any as S.Schema<SharePointDataSourceConfiguration>;
export interface DataSourceConfiguration {
  type: string;
  s3Configuration?: S3DataSourceConfiguration;
  webConfiguration?: WebDataSourceConfiguration;
  confluenceConfiguration?: ConfluenceDataSourceConfiguration;
  salesforceConfiguration?: SalesforceDataSourceConfiguration;
  sharePointConfiguration?: SharePointDataSourceConfiguration;
}
export const DataSourceConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    s3Configuration: S.optional(S3DataSourceConfiguration),
    webConfiguration: S.optional(WebDataSourceConfiguration),
    confluenceConfiguration: S.optional(ConfluenceDataSourceConfiguration),
    salesforceConfiguration: S.optional(SalesforceDataSourceConfiguration),
    sharePointConfiguration: S.optional(SharePointDataSourceConfiguration),
  }),
).annotations({
  identifier: "DataSourceConfiguration",
}) as any as S.Schema<DataSourceConfiguration>;
export interface ServerSideEncryptionConfiguration {
  kmsKeyArn?: string;
}
export const ServerSideEncryptionConfiguration = S.suspend(() =>
  S.Struct({ kmsKeyArn: S.optional(S.String) }),
).annotations({
  identifier: "ServerSideEncryptionConfiguration",
}) as any as S.Schema<ServerSideEncryptionConfiguration>;
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
export interface S3Location {
  uri: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ uri: S.String }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface IntermediateStorage {
  s3Location: S3Location;
}
export const IntermediateStorage = S.suspend(() =>
  S.Struct({ s3Location: S3Location }),
).annotations({
  identifier: "IntermediateStorage",
}) as any as S.Schema<IntermediateStorage>;
export interface TransformationLambdaConfiguration {
  lambdaArn: string;
}
export const TransformationLambdaConfiguration = S.suspend(() =>
  S.Struct({ lambdaArn: S.String }),
).annotations({
  identifier: "TransformationLambdaConfiguration",
}) as any as S.Schema<TransformationLambdaConfiguration>;
export interface TransformationFunction {
  transformationLambdaConfiguration: TransformationLambdaConfiguration;
}
export const TransformationFunction = S.suspend(() =>
  S.Struct({
    transformationLambdaConfiguration: TransformationLambdaConfiguration,
  }),
).annotations({
  identifier: "TransformationFunction",
}) as any as S.Schema<TransformationFunction>;
export interface Transformation {
  transformationFunction: TransformationFunction;
  stepToApply: string;
}
export const Transformation = S.suspend(() =>
  S.Struct({
    transformationFunction: TransformationFunction,
    stepToApply: S.String,
  }),
).annotations({
  identifier: "Transformation",
}) as any as S.Schema<Transformation>;
export type Transformations = Transformation[];
export const Transformations = S.Array(Transformation);
export interface CustomTransformationConfiguration {
  intermediateStorage: IntermediateStorage;
  transformations: Transformations;
}
export const CustomTransformationConfiguration = S.suspend(() =>
  S.Struct({
    intermediateStorage: IntermediateStorage,
    transformations: Transformations,
  }),
).annotations({
  identifier: "CustomTransformationConfiguration",
}) as any as S.Schema<CustomTransformationConfiguration>;
export interface ParsingPrompt {
  parsingPromptText: string;
}
export const ParsingPrompt = S.suspend(() =>
  S.Struct({ parsingPromptText: S.String }),
).annotations({
  identifier: "ParsingPrompt",
}) as any as S.Schema<ParsingPrompt>;
export interface BedrockFoundationModelConfiguration {
  modelArn: string;
  parsingPrompt?: ParsingPrompt;
  parsingModality?: string;
}
export const BedrockFoundationModelConfiguration = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    parsingPrompt: S.optional(ParsingPrompt),
    parsingModality: S.optional(S.String),
  }),
).annotations({
  identifier: "BedrockFoundationModelConfiguration",
}) as any as S.Schema<BedrockFoundationModelConfiguration>;
export interface BedrockDataAutomationConfiguration {
  parsingModality?: string;
}
export const BedrockDataAutomationConfiguration = S.suspend(() =>
  S.Struct({ parsingModality: S.optional(S.String) }),
).annotations({
  identifier: "BedrockDataAutomationConfiguration",
}) as any as S.Schema<BedrockDataAutomationConfiguration>;
export interface ParsingConfiguration {
  parsingStrategy: string;
  bedrockFoundationModelConfiguration?: BedrockFoundationModelConfiguration;
  bedrockDataAutomationConfiguration?: BedrockDataAutomationConfiguration;
}
export const ParsingConfiguration = S.suspend(() =>
  S.Struct({
    parsingStrategy: S.String,
    bedrockFoundationModelConfiguration: S.optional(
      BedrockFoundationModelConfiguration,
    ),
    bedrockDataAutomationConfiguration: S.optional(
      BedrockDataAutomationConfiguration,
    ),
  }),
).annotations({
  identifier: "ParsingConfiguration",
}) as any as S.Schema<ParsingConfiguration>;
export interface EnrichmentStrategyConfiguration {
  method: string;
}
export const EnrichmentStrategyConfiguration = S.suspend(() =>
  S.Struct({ method: S.String }),
).annotations({
  identifier: "EnrichmentStrategyConfiguration",
}) as any as S.Schema<EnrichmentStrategyConfiguration>;
export interface BedrockFoundationModelContextEnrichmentConfiguration {
  enrichmentStrategyConfiguration: EnrichmentStrategyConfiguration;
  modelArn: string;
}
export const BedrockFoundationModelContextEnrichmentConfiguration = S.suspend(
  () =>
    S.Struct({
      enrichmentStrategyConfiguration: EnrichmentStrategyConfiguration,
      modelArn: S.String,
    }),
).annotations({
  identifier: "BedrockFoundationModelContextEnrichmentConfiguration",
}) as any as S.Schema<BedrockFoundationModelContextEnrichmentConfiguration>;
export interface ContextEnrichmentConfiguration {
  type: string;
  bedrockFoundationModelConfiguration?: BedrockFoundationModelContextEnrichmentConfiguration;
}
export const ContextEnrichmentConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    bedrockFoundationModelConfiguration: S.optional(
      BedrockFoundationModelContextEnrichmentConfiguration,
    ),
  }),
).annotations({
  identifier: "ContextEnrichmentConfiguration",
}) as any as S.Schema<ContextEnrichmentConfiguration>;
export interface VectorIngestionConfiguration {
  chunkingConfiguration?: ChunkingConfiguration;
  customTransformationConfiguration?: CustomTransformationConfiguration;
  parsingConfiguration?: ParsingConfiguration;
  contextEnrichmentConfiguration?: ContextEnrichmentConfiguration;
}
export const VectorIngestionConfiguration = S.suspend(() =>
  S.Struct({
    chunkingConfiguration: S.optional(ChunkingConfiguration),
    customTransformationConfiguration: S.optional(
      CustomTransformationConfiguration,
    ),
    parsingConfiguration: S.optional(ParsingConfiguration),
    contextEnrichmentConfiguration: S.optional(ContextEnrichmentConfiguration),
  }),
).annotations({
  identifier: "VectorIngestionConfiguration",
}) as any as S.Schema<VectorIngestionConfiguration>;
export interface UpdateDataSourceRequest {
  knowledgeBaseId: string;
  dataSourceId: string;
  name: string;
  description?: string;
  dataSourceConfiguration: DataSourceConfiguration;
  dataDeletionPolicy?: string;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  vectorIngestionConfiguration?: VectorIngestionConfiguration;
}
export const UpdateDataSourceRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    name: S.String,
    description: S.optional(S.String),
    dataSourceConfiguration: DataSourceConfiguration,
    dataDeletionPolicy: S.optional(S.String),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    vectorIngestionConfiguration: S.optional(VectorIngestionConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/{dataSourceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataSourceRequest",
}) as any as S.Schema<UpdateDataSourceRequest>;
export interface FlowDataConnectionConfiguration {
  sourceOutput: string;
  targetInput: string;
}
export const FlowDataConnectionConfiguration = S.suspend(() =>
  S.Struct({ sourceOutput: S.String, targetInput: S.String }),
).annotations({
  identifier: "FlowDataConnectionConfiguration",
}) as any as S.Schema<FlowDataConnectionConfiguration>;
export interface FlowConditionalConnectionConfiguration {
  condition: string;
}
export const FlowConditionalConnectionConfiguration = S.suspend(() =>
  S.Struct({ condition: S.String }),
).annotations({
  identifier: "FlowConditionalConnectionConfiguration",
}) as any as S.Schema<FlowConditionalConnectionConfiguration>;
export type FlowConnectionConfiguration =
  | { data: FlowDataConnectionConfiguration }
  | { conditional: FlowConditionalConnectionConfiguration };
export const FlowConnectionConfiguration = S.Union(
  S.Struct({ data: FlowDataConnectionConfiguration }),
  S.Struct({ conditional: FlowConditionalConnectionConfiguration }),
);
export interface FlowConnection {
  type: string;
  name: string;
  source: string;
  target: string;
  configuration?: (typeof FlowConnectionConfiguration)["Type"];
}
export const FlowConnection = S.suspend(() =>
  S.Struct({
    type: S.String,
    name: S.String,
    source: S.String,
    target: S.String,
    configuration: S.optional(FlowConnectionConfiguration),
  }),
).annotations({
  identifier: "FlowConnection",
}) as any as S.Schema<FlowConnection>;
export type FlowConnections = FlowConnection[];
export const FlowConnections = S.Array(FlowConnection);
export interface FlowDefinition {
  nodes?: FlowNodes;
  connections?: FlowConnections;
}
export const FlowDefinition = S.suspend(() =>
  S.Struct({
    nodes: S.optional(
      S.suspend(() => FlowNodes).annotations({ identifier: "FlowNodes" }),
    ),
    connections: S.optional(FlowConnections),
  }),
).annotations({
  identifier: "FlowDefinition",
}) as any as S.Schema<FlowDefinition>;
export type TagsMap = { [key: string]: string };
export const TagsMap = S.Record({ key: S.String, value: S.String });
export interface CreateFlowRequest {
  name: string;
  description?: string;
  executionRoleArn: string;
  customerEncryptionKeyArn?: string;
  definition?: FlowDefinition;
  clientToken?: string;
  tags?: TagsMap;
}
export const CreateFlowRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    executionRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    definition: S.optional(FlowDefinition),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/flows/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFlowRequest",
}) as any as S.Schema<CreateFlowRequest>;
export interface GetFlowRequest {
  flowIdentifier: string;
}
export const GetFlowRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/flows/{flowIdentifier}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFlowRequest",
}) as any as S.Schema<GetFlowRequest>;
export interface UpdateFlowRequest {
  name: string;
  description?: string;
  executionRoleArn: string;
  customerEncryptionKeyArn?: string;
  definition?: FlowDefinition;
  flowIdentifier: string;
}
export const UpdateFlowRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    executionRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    definition: S.optional(FlowDefinition),
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/flows/{flowIdentifier}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFlowRequest",
}) as any as S.Schema<UpdateFlowRequest>;
export interface DeleteFlowRequest {
  flowIdentifier: string;
  skipResourceInUseCheck?: boolean;
}
export const DeleteFlowRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/flows/{flowIdentifier}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFlowRequest",
}) as any as S.Schema<DeleteFlowRequest>;
export interface ListFlowsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListFlowsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/flows/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFlowsRequest",
}) as any as S.Schema<ListFlowsRequest>;
export interface PrepareFlowRequest {
  flowIdentifier: string;
}
export const PrepareFlowRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/flows/{flowIdentifier}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PrepareFlowRequest",
}) as any as S.Schema<PrepareFlowRequest>;
export interface GetFlowAliasRequest {
  flowIdentifier: string;
  aliasIdentifier: string;
}
export const GetFlowAliasRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    aliasIdentifier: S.String.pipe(T.HttpLabel("aliasIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/flows/{flowIdentifier}/aliases/{aliasIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFlowAliasRequest",
}) as any as S.Schema<GetFlowAliasRequest>;
export interface FlowAliasRoutingConfigurationListItem {
  flowVersion?: string;
}
export const FlowAliasRoutingConfigurationListItem = S.suspend(() =>
  S.Struct({ flowVersion: S.optional(S.String) }),
).annotations({
  identifier: "FlowAliasRoutingConfigurationListItem",
}) as any as S.Schema<FlowAliasRoutingConfigurationListItem>;
export type FlowAliasRoutingConfiguration =
  FlowAliasRoutingConfigurationListItem[];
export const FlowAliasRoutingConfiguration = S.Array(
  FlowAliasRoutingConfigurationListItem,
);
export interface FlowAliasConcurrencyConfiguration {
  type: string;
  maxConcurrency?: number;
}
export const FlowAliasConcurrencyConfiguration = S.suspend(() =>
  S.Struct({ type: S.String, maxConcurrency: S.optional(S.Number) }),
).annotations({
  identifier: "FlowAliasConcurrencyConfiguration",
}) as any as S.Schema<FlowAliasConcurrencyConfiguration>;
export interface UpdateFlowAliasRequest {
  name: string;
  description?: string;
  routingConfiguration: FlowAliasRoutingConfiguration;
  concurrencyConfiguration?: FlowAliasConcurrencyConfiguration;
  flowIdentifier: string;
  aliasIdentifier: string;
}
export const UpdateFlowAliasRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    routingConfiguration: FlowAliasRoutingConfiguration,
    concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    aliasIdentifier: S.String.pipe(T.HttpLabel("aliasIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/flows/{flowIdentifier}/aliases/{aliasIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFlowAliasRequest",
}) as any as S.Schema<UpdateFlowAliasRequest>;
export interface DeleteFlowAliasRequest {
  flowIdentifier: string;
  aliasIdentifier: string;
}
export const DeleteFlowAliasRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    aliasIdentifier: S.String.pipe(T.HttpLabel("aliasIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/flows/{flowIdentifier}/aliases/{aliasIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFlowAliasRequest",
}) as any as S.Schema<DeleteFlowAliasRequest>;
export interface ListFlowAliasesRequest {
  flowIdentifier: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListFlowAliasesRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/flows/{flowIdentifier}/aliases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFlowAliasesRequest",
}) as any as S.Schema<ListFlowAliasesRequest>;
export interface CreateFlowVersionRequest {
  flowIdentifier: string;
  description?: string;
  clientToken?: string;
}
export const CreateFlowVersionRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/flows/{flowIdentifier}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFlowVersionRequest",
}) as any as S.Schema<CreateFlowVersionRequest>;
export interface GetFlowVersionRequest {
  flowIdentifier: string;
  flowVersion: string;
}
export const GetFlowVersionRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowVersion: S.String.pipe(T.HttpLabel("flowVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/flows/{flowIdentifier}/versions/{flowVersion}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFlowVersionRequest",
}) as any as S.Schema<GetFlowVersionRequest>;
export interface DeleteFlowVersionRequest {
  flowIdentifier: string;
  flowVersion: string;
  skipResourceInUseCheck?: boolean;
}
export const DeleteFlowVersionRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowVersion: S.String.pipe(T.HttpLabel("flowVersion")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/flows/{flowIdentifier}/versions/{flowVersion}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFlowVersionRequest",
}) as any as S.Schema<DeleteFlowVersionRequest>;
export interface ListFlowVersionsRequest {
  flowIdentifier: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListFlowVersionsRequest = S.suspend(() =>
  S.Struct({
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/flows/{flowIdentifier}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFlowVersionsRequest",
}) as any as S.Schema<ListFlowVersionsRequest>;
export interface GetIngestionJobRequest {
  knowledgeBaseId: string;
  dataSourceId: string;
  ingestionJobId: string;
}
export const GetIngestionJobRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    ingestionJobId: S.String.pipe(T.HttpLabel("ingestionJobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/{dataSourceId}/ingestionjobs/{ingestionJobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIngestionJobRequest",
}) as any as S.Schema<GetIngestionJobRequest>;
export interface StartIngestionJobRequest {
  knowledgeBaseId: string;
  dataSourceId: string;
  clientToken?: string;
  description?: string;
}
export const StartIngestionJobRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    clientToken: S.optional(S.String),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/{dataSourceId}/ingestionjobs/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartIngestionJobRequest",
}) as any as S.Schema<StartIngestionJobRequest>;
export interface StopIngestionJobRequest {
  knowledgeBaseId: string;
  dataSourceId: string;
  ingestionJobId: string;
}
export const StopIngestionJobRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    ingestionJobId: S.String.pipe(T.HttpLabel("ingestionJobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/{dataSourceId}/ingestionjobs/{ingestionJobId}/stop",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopIngestionJobRequest",
}) as any as S.Schema<StopIngestionJobRequest>;
export interface CustomDocumentIdentifier {
  id: string;
}
export const CustomDocumentIdentifier = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "CustomDocumentIdentifier",
}) as any as S.Schema<CustomDocumentIdentifier>;
export interface DocumentIdentifier {
  dataSourceType: string;
  s3?: S3Location;
  custom?: CustomDocumentIdentifier;
}
export const DocumentIdentifier = S.suspend(() =>
  S.Struct({
    dataSourceType: S.String,
    s3: S.optional(S3Location),
    custom: S.optional(CustomDocumentIdentifier),
  }),
).annotations({
  identifier: "DocumentIdentifier",
}) as any as S.Schema<DocumentIdentifier>;
export type DocumentIdentifiers = DocumentIdentifier[];
export const DocumentIdentifiers = S.Array(DocumentIdentifier);
export interface GetKnowledgeBaseDocumentsRequest {
  knowledgeBaseId: string;
  dataSourceId: string;
  documentIdentifiers: DocumentIdentifiers;
}
export const GetKnowledgeBaseDocumentsRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    documentIdentifiers: DocumentIdentifiers,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/{dataSourceId}/documents/getDocuments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetKnowledgeBaseDocumentsRequest",
}) as any as S.Schema<GetKnowledgeBaseDocumentsRequest>;
export interface ListKnowledgeBaseDocumentsRequest {
  knowledgeBaseId: string;
  dataSourceId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListKnowledgeBaseDocumentsRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/{dataSourceId}/documents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKnowledgeBaseDocumentsRequest",
}) as any as S.Schema<ListKnowledgeBaseDocumentsRequest>;
export interface AssociateAgentKnowledgeBaseRequest {
  agentId: string;
  agentVersion: string;
  knowledgeBaseId: string;
  description: string;
  knowledgeBaseState?: string;
}
export const AssociateAgentKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    knowledgeBaseId: S.String,
    description: S.String,
    knowledgeBaseState: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/knowledgebases/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateAgentKnowledgeBaseRequest",
}) as any as S.Schema<AssociateAgentKnowledgeBaseRequest>;
export interface DeleteKnowledgeBaseRequest {
  knowledgeBaseId: string;
}
export const DeleteKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/knowledgebases/{knowledgeBaseId}" }),
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
export interface DisassociateAgentKnowledgeBaseRequest {
  agentId: string;
  agentVersion: string;
  knowledgeBaseId: string;
}
export const DisassociateAgentKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/knowledgebases/{knowledgeBaseId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateAgentKnowledgeBaseRequest",
}) as any as S.Schema<DisassociateAgentKnowledgeBaseRequest>;
export interface DisassociateAgentKnowledgeBaseResponse {}
export const DisassociateAgentKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateAgentKnowledgeBaseResponse",
}) as any as S.Schema<DisassociateAgentKnowledgeBaseResponse>;
export interface GetAgentKnowledgeBaseRequest {
  agentId: string;
  agentVersion: string;
  knowledgeBaseId: string;
}
export const GetAgentKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/knowledgebases/{knowledgeBaseId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAgentKnowledgeBaseRequest",
}) as any as S.Schema<GetAgentKnowledgeBaseRequest>;
export interface GetKnowledgeBaseRequest {
  knowledgeBaseId: string;
}
export const GetKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/knowledgebases/{knowledgeBaseId}" }),
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
export interface ListAgentKnowledgeBasesRequest {
  agentId: string;
  agentVersion: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAgentKnowledgeBasesRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/knowledgebases/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAgentKnowledgeBasesRequest",
}) as any as S.Schema<ListAgentKnowledgeBasesRequest>;
export interface ListKnowledgeBasesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListKnowledgeBasesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/knowledgebases/" }),
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
export interface UpdateAgentKnowledgeBaseRequest {
  agentId: string;
  agentVersion: string;
  knowledgeBaseId: string;
  description?: string;
  knowledgeBaseState?: string;
}
export const UpdateAgentKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    description: S.optional(S.String),
    knowledgeBaseState: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/knowledgebases/{knowledgeBaseId}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAgentKnowledgeBaseRequest",
}) as any as S.Schema<UpdateAgentKnowledgeBaseRequest>;
export interface AudioSegmentationConfiguration {
  fixedLengthDuration: number;
}
export const AudioSegmentationConfiguration = S.suspend(() =>
  S.Struct({ fixedLengthDuration: S.Number }),
).annotations({
  identifier: "AudioSegmentationConfiguration",
}) as any as S.Schema<AudioSegmentationConfiguration>;
export interface AudioConfiguration {
  segmentationConfiguration: AudioSegmentationConfiguration;
}
export const AudioConfiguration = S.suspend(() =>
  S.Struct({ segmentationConfiguration: AudioSegmentationConfiguration }),
).annotations({
  identifier: "AudioConfiguration",
}) as any as S.Schema<AudioConfiguration>;
export type AudioConfigurations = AudioConfiguration[];
export const AudioConfigurations = S.Array(AudioConfiguration);
export interface VideoSegmentationConfiguration {
  fixedLengthDuration: number;
}
export const VideoSegmentationConfiguration = S.suspend(() =>
  S.Struct({ fixedLengthDuration: S.Number }),
).annotations({
  identifier: "VideoSegmentationConfiguration",
}) as any as S.Schema<VideoSegmentationConfiguration>;
export interface VideoConfiguration {
  segmentationConfiguration: VideoSegmentationConfiguration;
}
export const VideoConfiguration = S.suspend(() =>
  S.Struct({ segmentationConfiguration: VideoSegmentationConfiguration }),
).annotations({
  identifier: "VideoConfiguration",
}) as any as S.Schema<VideoConfiguration>;
export type VideoConfigurations = VideoConfiguration[];
export const VideoConfigurations = S.Array(VideoConfiguration);
export interface BedrockEmbeddingModelConfiguration {
  dimensions?: number;
  embeddingDataType?: string;
  audio?: AudioConfigurations;
  video?: VideoConfigurations;
}
export const BedrockEmbeddingModelConfiguration = S.suspend(() =>
  S.Struct({
    dimensions: S.optional(S.Number),
    embeddingDataType: S.optional(S.String),
    audio: S.optional(AudioConfigurations),
    video: S.optional(VideoConfigurations),
  }),
).annotations({
  identifier: "BedrockEmbeddingModelConfiguration",
}) as any as S.Schema<BedrockEmbeddingModelConfiguration>;
export interface EmbeddingModelConfiguration {
  bedrockEmbeddingModelConfiguration?: BedrockEmbeddingModelConfiguration;
}
export const EmbeddingModelConfiguration = S.suspend(() =>
  S.Struct({
    bedrockEmbeddingModelConfiguration: S.optional(
      BedrockEmbeddingModelConfiguration,
    ),
  }),
).annotations({
  identifier: "EmbeddingModelConfiguration",
}) as any as S.Schema<EmbeddingModelConfiguration>;
export interface SupplementalDataStorageLocation {
  type: string;
  s3Location?: S3Location;
}
export const SupplementalDataStorageLocation = S.suspend(() =>
  S.Struct({ type: S.String, s3Location: S.optional(S3Location) }),
).annotations({
  identifier: "SupplementalDataStorageLocation",
}) as any as S.Schema<SupplementalDataStorageLocation>;
export type SupplementalDataStorageLocations =
  SupplementalDataStorageLocation[];
export const SupplementalDataStorageLocations = S.Array(
  SupplementalDataStorageLocation,
);
export interface SupplementalDataStorageConfiguration {
  storageLocations: SupplementalDataStorageLocations;
}
export const SupplementalDataStorageConfiguration = S.suspend(() =>
  S.Struct({ storageLocations: SupplementalDataStorageLocations }),
).annotations({
  identifier: "SupplementalDataStorageConfiguration",
}) as any as S.Schema<SupplementalDataStorageConfiguration>;
export interface VectorKnowledgeBaseConfiguration {
  embeddingModelArn: string;
  embeddingModelConfiguration?: EmbeddingModelConfiguration;
  supplementalDataStorageConfiguration?: SupplementalDataStorageConfiguration;
}
export const VectorKnowledgeBaseConfiguration = S.suspend(() =>
  S.Struct({
    embeddingModelArn: S.String,
    embeddingModelConfiguration: S.optional(EmbeddingModelConfiguration),
    supplementalDataStorageConfiguration: S.optional(
      SupplementalDataStorageConfiguration,
    ),
  }),
).annotations({
  identifier: "VectorKnowledgeBaseConfiguration",
}) as any as S.Schema<VectorKnowledgeBaseConfiguration>;
export interface KendraKnowledgeBaseConfiguration {
  kendraIndexArn: string;
}
export const KendraKnowledgeBaseConfiguration = S.suspend(() =>
  S.Struct({ kendraIndexArn: S.String }),
).annotations({
  identifier: "KendraKnowledgeBaseConfiguration",
}) as any as S.Schema<KendraKnowledgeBaseConfiguration>;
export type AwsDataCatalogTableNames = string[];
export const AwsDataCatalogTableNames = S.Array(S.String);
export interface RedshiftQueryEngineAwsDataCatalogStorageConfiguration {
  tableNames: AwsDataCatalogTableNames;
}
export const RedshiftQueryEngineAwsDataCatalogStorageConfiguration = S.suspend(
  () => S.Struct({ tableNames: AwsDataCatalogTableNames }),
).annotations({
  identifier: "RedshiftQueryEngineAwsDataCatalogStorageConfiguration",
}) as any as S.Schema<RedshiftQueryEngineAwsDataCatalogStorageConfiguration>;
export interface RedshiftQueryEngineRedshiftStorageConfiguration {
  databaseName: string;
}
export const RedshiftQueryEngineRedshiftStorageConfiguration = S.suspend(() =>
  S.Struct({ databaseName: S.String }),
).annotations({
  identifier: "RedshiftQueryEngineRedshiftStorageConfiguration",
}) as any as S.Schema<RedshiftQueryEngineRedshiftStorageConfiguration>;
export interface RedshiftQueryEngineStorageConfiguration {
  type: string;
  awsDataCatalogConfiguration?: RedshiftQueryEngineAwsDataCatalogStorageConfiguration;
  redshiftConfiguration?: RedshiftQueryEngineRedshiftStorageConfiguration;
}
export const RedshiftQueryEngineStorageConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    awsDataCatalogConfiguration: S.optional(
      RedshiftQueryEngineAwsDataCatalogStorageConfiguration,
    ),
    redshiftConfiguration: S.optional(
      RedshiftQueryEngineRedshiftStorageConfiguration,
    ),
  }),
).annotations({
  identifier: "RedshiftQueryEngineStorageConfiguration",
}) as any as S.Schema<RedshiftQueryEngineStorageConfiguration>;
export type RedshiftQueryEngineStorageConfigurations =
  RedshiftQueryEngineStorageConfiguration[];
export const RedshiftQueryEngineStorageConfigurations = S.Array(
  RedshiftQueryEngineStorageConfiguration,
);
export interface RedshiftServerlessAuthConfiguration {
  type: string;
  usernamePasswordSecretArn?: string;
}
export const RedshiftServerlessAuthConfiguration = S.suspend(() =>
  S.Struct({ type: S.String, usernamePasswordSecretArn: S.optional(S.String) }),
).annotations({
  identifier: "RedshiftServerlessAuthConfiguration",
}) as any as S.Schema<RedshiftServerlessAuthConfiguration>;
export interface RedshiftServerlessConfiguration {
  workgroupArn: string;
  authConfiguration: RedshiftServerlessAuthConfiguration;
}
export const RedshiftServerlessConfiguration = S.suspend(() =>
  S.Struct({
    workgroupArn: S.String,
    authConfiguration: RedshiftServerlessAuthConfiguration,
  }),
).annotations({
  identifier: "RedshiftServerlessConfiguration",
}) as any as S.Schema<RedshiftServerlessConfiguration>;
export interface RedshiftProvisionedAuthConfiguration {
  type: string;
  databaseUser?: string;
  usernamePasswordSecretArn?: string;
}
export const RedshiftProvisionedAuthConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    databaseUser: S.optional(S.String),
    usernamePasswordSecretArn: S.optional(S.String),
  }),
).annotations({
  identifier: "RedshiftProvisionedAuthConfiguration",
}) as any as S.Schema<RedshiftProvisionedAuthConfiguration>;
export interface RedshiftProvisionedConfiguration {
  clusterIdentifier: string;
  authConfiguration: RedshiftProvisionedAuthConfiguration;
}
export const RedshiftProvisionedConfiguration = S.suspend(() =>
  S.Struct({
    clusterIdentifier: S.String,
    authConfiguration: RedshiftProvisionedAuthConfiguration,
  }),
).annotations({
  identifier: "RedshiftProvisionedConfiguration",
}) as any as S.Schema<RedshiftProvisionedConfiguration>;
export interface RedshiftQueryEngineConfiguration {
  type: string;
  serverlessConfiguration?: RedshiftServerlessConfiguration;
  provisionedConfiguration?: RedshiftProvisionedConfiguration;
}
export const RedshiftQueryEngineConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    serverlessConfiguration: S.optional(RedshiftServerlessConfiguration),
    provisionedConfiguration: S.optional(RedshiftProvisionedConfiguration),
  }),
).annotations({
  identifier: "RedshiftQueryEngineConfiguration",
}) as any as S.Schema<RedshiftQueryEngineConfiguration>;
export interface QueryGenerationColumn {
  name?: string;
  description?: string;
  inclusion?: string;
}
export const QueryGenerationColumn = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    inclusion: S.optional(S.String),
  }),
).annotations({
  identifier: "QueryGenerationColumn",
}) as any as S.Schema<QueryGenerationColumn>;
export type QueryGenerationColumns = QueryGenerationColumn[];
export const QueryGenerationColumns = S.Array(QueryGenerationColumn);
export interface QueryGenerationTable {
  name: string;
  description?: string;
  inclusion?: string;
  columns?: QueryGenerationColumns;
}
export const QueryGenerationTable = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    inclusion: S.optional(S.String),
    columns: S.optional(QueryGenerationColumns),
  }),
).annotations({
  identifier: "QueryGenerationTable",
}) as any as S.Schema<QueryGenerationTable>;
export type QueryGenerationTables = QueryGenerationTable[];
export const QueryGenerationTables = S.Array(QueryGenerationTable);
export interface CuratedQuery {
  naturalLanguage: string;
  sql: string;
}
export const CuratedQuery = S.suspend(() =>
  S.Struct({ naturalLanguage: S.String, sql: S.String }),
).annotations({ identifier: "CuratedQuery" }) as any as S.Schema<CuratedQuery>;
export type CuratedQueries = CuratedQuery[];
export const CuratedQueries = S.Array(CuratedQuery);
export interface QueryGenerationContext {
  tables?: QueryGenerationTables;
  curatedQueries?: CuratedQueries;
}
export const QueryGenerationContext = S.suspend(() =>
  S.Struct({
    tables: S.optional(QueryGenerationTables),
    curatedQueries: S.optional(CuratedQueries),
  }),
).annotations({
  identifier: "QueryGenerationContext",
}) as any as S.Schema<QueryGenerationContext>;
export interface QueryGenerationConfiguration {
  executionTimeoutSeconds?: number;
  generationContext?: QueryGenerationContext;
}
export const QueryGenerationConfiguration = S.suspend(() =>
  S.Struct({
    executionTimeoutSeconds: S.optional(S.Number),
    generationContext: S.optional(QueryGenerationContext),
  }),
).annotations({
  identifier: "QueryGenerationConfiguration",
}) as any as S.Schema<QueryGenerationConfiguration>;
export interface RedshiftConfiguration {
  storageConfigurations: RedshiftQueryEngineStorageConfigurations;
  queryEngineConfiguration: RedshiftQueryEngineConfiguration;
  queryGenerationConfiguration?: QueryGenerationConfiguration;
}
export const RedshiftConfiguration = S.suspend(() =>
  S.Struct({
    storageConfigurations: RedshiftQueryEngineStorageConfigurations,
    queryEngineConfiguration: RedshiftQueryEngineConfiguration,
    queryGenerationConfiguration: S.optional(QueryGenerationConfiguration),
  }),
).annotations({
  identifier: "RedshiftConfiguration",
}) as any as S.Schema<RedshiftConfiguration>;
export interface SqlKnowledgeBaseConfiguration {
  type: string;
  redshiftConfiguration?: RedshiftConfiguration;
}
export const SqlKnowledgeBaseConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    redshiftConfiguration: S.optional(RedshiftConfiguration),
  }),
).annotations({
  identifier: "SqlKnowledgeBaseConfiguration",
}) as any as S.Schema<SqlKnowledgeBaseConfiguration>;
export interface KnowledgeBaseConfiguration {
  type: string;
  vectorKnowledgeBaseConfiguration?: VectorKnowledgeBaseConfiguration;
  kendraKnowledgeBaseConfiguration?: KendraKnowledgeBaseConfiguration;
  sqlKnowledgeBaseConfiguration?: SqlKnowledgeBaseConfiguration;
}
export const KnowledgeBaseConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    vectorKnowledgeBaseConfiguration: S.optional(
      VectorKnowledgeBaseConfiguration,
    ),
    kendraKnowledgeBaseConfiguration: S.optional(
      KendraKnowledgeBaseConfiguration,
    ),
    sqlKnowledgeBaseConfiguration: S.optional(SqlKnowledgeBaseConfiguration),
  }),
).annotations({
  identifier: "KnowledgeBaseConfiguration",
}) as any as S.Schema<KnowledgeBaseConfiguration>;
export interface OpenSearchServerlessFieldMapping {
  vectorField: string;
  textField: string;
  metadataField: string;
}
export const OpenSearchServerlessFieldMapping = S.suspend(() =>
  S.Struct({
    vectorField: S.String,
    textField: S.String,
    metadataField: S.String,
  }),
).annotations({
  identifier: "OpenSearchServerlessFieldMapping",
}) as any as S.Schema<OpenSearchServerlessFieldMapping>;
export interface OpenSearchServerlessConfiguration {
  collectionArn: string;
  vectorIndexName: string;
  fieldMapping: OpenSearchServerlessFieldMapping;
}
export const OpenSearchServerlessConfiguration = S.suspend(() =>
  S.Struct({
    collectionArn: S.String,
    vectorIndexName: S.String,
    fieldMapping: OpenSearchServerlessFieldMapping,
  }),
).annotations({
  identifier: "OpenSearchServerlessConfiguration",
}) as any as S.Schema<OpenSearchServerlessConfiguration>;
export interface OpenSearchManagedClusterFieldMapping {
  vectorField: string;
  textField: string;
  metadataField: string;
}
export const OpenSearchManagedClusterFieldMapping = S.suspend(() =>
  S.Struct({
    vectorField: S.String,
    textField: S.String,
    metadataField: S.String,
  }),
).annotations({
  identifier: "OpenSearchManagedClusterFieldMapping",
}) as any as S.Schema<OpenSearchManagedClusterFieldMapping>;
export interface OpenSearchManagedClusterConfiguration {
  domainEndpoint: string;
  domainArn: string;
  vectorIndexName: string | Redacted.Redacted<string>;
  fieldMapping: OpenSearchManagedClusterFieldMapping;
}
export const OpenSearchManagedClusterConfiguration = S.suspend(() =>
  S.Struct({
    domainEndpoint: S.String,
    domainArn: S.String,
    vectorIndexName: SensitiveString,
    fieldMapping: OpenSearchManagedClusterFieldMapping,
  }),
).annotations({
  identifier: "OpenSearchManagedClusterConfiguration",
}) as any as S.Schema<OpenSearchManagedClusterConfiguration>;
export interface PineconeFieldMapping {
  textField: string;
  metadataField: string;
}
export const PineconeFieldMapping = S.suspend(() =>
  S.Struct({ textField: S.String, metadataField: S.String }),
).annotations({
  identifier: "PineconeFieldMapping",
}) as any as S.Schema<PineconeFieldMapping>;
export interface PineconeConfiguration {
  connectionString: string;
  credentialsSecretArn: string;
  namespace?: string;
  fieldMapping: PineconeFieldMapping;
}
export const PineconeConfiguration = S.suspend(() =>
  S.Struct({
    connectionString: S.String,
    credentialsSecretArn: S.String,
    namespace: S.optional(S.String),
    fieldMapping: PineconeFieldMapping,
  }),
).annotations({
  identifier: "PineconeConfiguration",
}) as any as S.Schema<PineconeConfiguration>;
export interface RedisEnterpriseCloudFieldMapping {
  vectorField: string;
  textField: string;
  metadataField: string;
}
export const RedisEnterpriseCloudFieldMapping = S.suspend(() =>
  S.Struct({
    vectorField: S.String,
    textField: S.String,
    metadataField: S.String,
  }),
).annotations({
  identifier: "RedisEnterpriseCloudFieldMapping",
}) as any as S.Schema<RedisEnterpriseCloudFieldMapping>;
export interface RedisEnterpriseCloudConfiguration {
  endpoint: string;
  vectorIndexName: string;
  credentialsSecretArn: string;
  fieldMapping: RedisEnterpriseCloudFieldMapping;
}
export const RedisEnterpriseCloudConfiguration = S.suspend(() =>
  S.Struct({
    endpoint: S.String,
    vectorIndexName: S.String,
    credentialsSecretArn: S.String,
    fieldMapping: RedisEnterpriseCloudFieldMapping,
  }),
).annotations({
  identifier: "RedisEnterpriseCloudConfiguration",
}) as any as S.Schema<RedisEnterpriseCloudConfiguration>;
export interface RdsFieldMapping {
  primaryKeyField: string;
  vectorField: string;
  textField: string;
  metadataField: string;
  customMetadataField?: string;
}
export const RdsFieldMapping = S.suspend(() =>
  S.Struct({
    primaryKeyField: S.String,
    vectorField: S.String,
    textField: S.String,
    metadataField: S.String,
    customMetadataField: S.optional(S.String),
  }),
).annotations({
  identifier: "RdsFieldMapping",
}) as any as S.Schema<RdsFieldMapping>;
export interface RdsConfiguration {
  resourceArn: string;
  credentialsSecretArn: string;
  databaseName: string;
  tableName: string;
  fieldMapping: RdsFieldMapping;
}
export const RdsConfiguration = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    credentialsSecretArn: S.String,
    databaseName: S.String,
    tableName: S.String,
    fieldMapping: RdsFieldMapping,
  }),
).annotations({
  identifier: "RdsConfiguration",
}) as any as S.Schema<RdsConfiguration>;
export interface MongoDbAtlasFieldMapping {
  vectorField: string;
  textField: string;
  metadataField: string;
}
export const MongoDbAtlasFieldMapping = S.suspend(() =>
  S.Struct({
    vectorField: S.String,
    textField: S.String,
    metadataField: S.String,
  }),
).annotations({
  identifier: "MongoDbAtlasFieldMapping",
}) as any as S.Schema<MongoDbAtlasFieldMapping>;
export interface MongoDbAtlasConfiguration {
  endpoint: string;
  databaseName: string;
  collectionName: string;
  vectorIndexName: string;
  credentialsSecretArn: string;
  fieldMapping: MongoDbAtlasFieldMapping;
  endpointServiceName?: string;
  textIndexName?: string;
}
export const MongoDbAtlasConfiguration = S.suspend(() =>
  S.Struct({
    endpoint: S.String,
    databaseName: S.String,
    collectionName: S.String,
    vectorIndexName: S.String,
    credentialsSecretArn: S.String,
    fieldMapping: MongoDbAtlasFieldMapping,
    endpointServiceName: S.optional(S.String),
    textIndexName: S.optional(S.String),
  }),
).annotations({
  identifier: "MongoDbAtlasConfiguration",
}) as any as S.Schema<MongoDbAtlasConfiguration>;
export interface NeptuneAnalyticsFieldMapping {
  textField: string;
  metadataField: string;
}
export const NeptuneAnalyticsFieldMapping = S.suspend(() =>
  S.Struct({ textField: S.String, metadataField: S.String }),
).annotations({
  identifier: "NeptuneAnalyticsFieldMapping",
}) as any as S.Schema<NeptuneAnalyticsFieldMapping>;
export interface NeptuneAnalyticsConfiguration {
  graphArn: string | Redacted.Redacted<string>;
  fieldMapping: NeptuneAnalyticsFieldMapping;
}
export const NeptuneAnalyticsConfiguration = S.suspend(() =>
  S.Struct({
    graphArn: SensitiveString,
    fieldMapping: NeptuneAnalyticsFieldMapping,
  }),
).annotations({
  identifier: "NeptuneAnalyticsConfiguration",
}) as any as S.Schema<NeptuneAnalyticsConfiguration>;
export interface S3VectorsConfiguration {
  vectorBucketArn?: string | Redacted.Redacted<string>;
  indexArn?: string | Redacted.Redacted<string>;
  indexName?: string | Redacted.Redacted<string>;
}
export const S3VectorsConfiguration = S.suspend(() =>
  S.Struct({
    vectorBucketArn: S.optional(SensitiveString),
    indexArn: S.optional(SensitiveString),
    indexName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "S3VectorsConfiguration",
}) as any as S.Schema<S3VectorsConfiguration>;
export interface StorageConfiguration {
  type: string;
  opensearchServerlessConfiguration?: OpenSearchServerlessConfiguration;
  opensearchManagedClusterConfiguration?: OpenSearchManagedClusterConfiguration;
  pineconeConfiguration?: PineconeConfiguration;
  redisEnterpriseCloudConfiguration?: RedisEnterpriseCloudConfiguration;
  rdsConfiguration?: RdsConfiguration;
  mongoDbAtlasConfiguration?: MongoDbAtlasConfiguration;
  neptuneAnalyticsConfiguration?: NeptuneAnalyticsConfiguration;
  s3VectorsConfiguration?: S3VectorsConfiguration;
}
export const StorageConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    opensearchServerlessConfiguration: S.optional(
      OpenSearchServerlessConfiguration,
    ),
    opensearchManagedClusterConfiguration: S.optional(
      OpenSearchManagedClusterConfiguration,
    ),
    pineconeConfiguration: S.optional(PineconeConfiguration),
    redisEnterpriseCloudConfiguration: S.optional(
      RedisEnterpriseCloudConfiguration,
    ),
    rdsConfiguration: S.optional(RdsConfiguration),
    mongoDbAtlasConfiguration: S.optional(MongoDbAtlasConfiguration),
    neptuneAnalyticsConfiguration: S.optional(NeptuneAnalyticsConfiguration),
    s3VectorsConfiguration: S.optional(S3VectorsConfiguration),
  }),
).annotations({
  identifier: "StorageConfiguration",
}) as any as S.Schema<StorageConfiguration>;
export interface UpdateKnowledgeBaseRequest {
  knowledgeBaseId: string;
  name: string;
  description?: string;
  roleArn: string;
  knowledgeBaseConfiguration: KnowledgeBaseConfiguration;
  storageConfiguration?: StorageConfiguration;
}
export const UpdateKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    name: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    knowledgeBaseConfiguration: KnowledgeBaseConfiguration,
    storageConfiguration: S.optional(StorageConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/knowledgebases/{knowledgeBaseId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKnowledgeBaseRequest",
}) as any as S.Schema<UpdateKnowledgeBaseRequest>;
export interface GetPromptRequest {
  promptIdentifier: string;
  promptVersion?: string;
}
export const GetPromptRequest = S.suspend(() =>
  S.Struct({
    promptIdentifier: S.String.pipe(T.HttpLabel("promptIdentifier")),
    promptVersion: S.optional(S.String).pipe(T.HttpQuery("promptVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prompts/{promptIdentifier}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPromptRequest",
}) as any as S.Schema<GetPromptRequest>;
export interface CachePointBlock {
  type: string;
}
export const CachePointBlock = S.suspend(() =>
  S.Struct({ type: S.String }),
).annotations({
  identifier: "CachePointBlock",
}) as any as S.Schema<CachePointBlock>;
export interface PromptInputVariable {
  name?: string;
}
export const PromptInputVariable = S.suspend(() =>
  S.Struct({ name: S.optional(S.String) }),
).annotations({
  identifier: "PromptInputVariable",
}) as any as S.Schema<PromptInputVariable>;
export type PromptInputVariablesList = PromptInputVariable[];
export const PromptInputVariablesList = S.Array(PromptInputVariable);
export interface TextPromptTemplateConfiguration {
  text: string | Redacted.Redacted<string>;
  cachePoint?: CachePointBlock;
  inputVariables?: PromptInputVariablesList;
}
export const TextPromptTemplateConfiguration = S.suspend(() =>
  S.Struct({
    text: SensitiveString,
    cachePoint: S.optional(CachePointBlock),
    inputVariables: S.optional(PromptInputVariablesList),
  }),
).annotations({
  identifier: "TextPromptTemplateConfiguration",
}) as any as S.Schema<TextPromptTemplateConfiguration>;
export type ContentBlock = { text: string } | { cachePoint: CachePointBlock };
export const ContentBlock = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ cachePoint: CachePointBlock }),
);
export type ContentBlocks = (typeof ContentBlock)["Type"][];
export const ContentBlocks = S.Array(ContentBlock);
export interface Message {
  role: string;
  content: ContentBlocks;
}
export const Message = S.suspend(() =>
  S.Struct({ role: S.String, content: ContentBlocks }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export type Messages = Message[];
export const Messages = S.Array(Message);
export type SystemContentBlock =
  | { text: string }
  | { cachePoint: CachePointBlock };
export const SystemContentBlock = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ cachePoint: CachePointBlock }),
);
export type SystemContentBlocks = (typeof SystemContentBlock)["Type"][];
export const SystemContentBlocks = S.Array(SystemContentBlock);
export type ToolInputSchema = { json: any };
export const ToolInputSchema = S.Union(S.Struct({ json: S.Any }));
export interface ToolSpecification {
  name: string;
  description?: string;
  inputSchema: (typeof ToolInputSchema)["Type"];
}
export const ToolSpecification = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    inputSchema: ToolInputSchema,
  }),
).annotations({
  identifier: "ToolSpecification",
}) as any as S.Schema<ToolSpecification>;
export type Tool =
  | { toolSpec: ToolSpecification }
  | { cachePoint: CachePointBlock };
export const Tool = S.Union(
  S.Struct({ toolSpec: ToolSpecification }),
  S.Struct({ cachePoint: CachePointBlock }),
);
export type Tools = (typeof Tool)["Type"][];
export const Tools = S.Array(Tool);
export interface AutoToolChoice {}
export const AutoToolChoice = S.suspend(() => S.Struct({})).annotations({
  identifier: "AutoToolChoice",
}) as any as S.Schema<AutoToolChoice>;
export interface AnyToolChoice {}
export const AnyToolChoice = S.suspend(() => S.Struct({})).annotations({
  identifier: "AnyToolChoice",
}) as any as S.Schema<AnyToolChoice>;
export interface SpecificToolChoice {
  name: string;
}
export const SpecificToolChoice = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({
  identifier: "SpecificToolChoice",
}) as any as S.Schema<SpecificToolChoice>;
export type ToolChoice =
  | { auto: AutoToolChoice }
  | { any: AnyToolChoice }
  | { tool: SpecificToolChoice };
export const ToolChoice = S.Union(
  S.Struct({ auto: AutoToolChoice }),
  S.Struct({ any: AnyToolChoice }),
  S.Struct({ tool: SpecificToolChoice }),
);
export interface ToolConfiguration {
  tools: Tools;
  toolChoice?: (typeof ToolChoice)["Type"];
}
export const ToolConfiguration = S.suspend(() =>
  S.Struct({ tools: Tools, toolChoice: S.optional(ToolChoice) }),
).annotations({
  identifier: "ToolConfiguration",
}) as any as S.Schema<ToolConfiguration>;
export interface ChatPromptTemplateConfiguration {
  messages: Messages;
  system?: SystemContentBlocks;
  inputVariables?: PromptInputVariablesList;
  toolConfiguration?: ToolConfiguration;
}
export const ChatPromptTemplateConfiguration = S.suspend(() =>
  S.Struct({
    messages: Messages,
    system: S.optional(SystemContentBlocks),
    inputVariables: S.optional(PromptInputVariablesList),
    toolConfiguration: S.optional(ToolConfiguration),
  }),
).annotations({
  identifier: "ChatPromptTemplateConfiguration",
}) as any as S.Schema<ChatPromptTemplateConfiguration>;
export type PromptTemplateConfiguration =
  | { text: TextPromptTemplateConfiguration }
  | { chat: ChatPromptTemplateConfiguration };
export const PromptTemplateConfiguration = S.Union(
  S.Struct({ text: TextPromptTemplateConfiguration }),
  S.Struct({ chat: ChatPromptTemplateConfiguration }),
);
export interface PromptModelInferenceConfiguration {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stopSequences?: StopSequences;
}
export const PromptModelInferenceConfiguration = S.suspend(() =>
  S.Struct({
    temperature: S.optional(S.Number),
    topP: S.optional(S.Number),
    maxTokens: S.optional(S.Number),
    stopSequences: S.optional(StopSequences),
  }),
).annotations({
  identifier: "PromptModelInferenceConfiguration",
}) as any as S.Schema<PromptModelInferenceConfiguration>;
export type PromptInferenceConfiguration = {
  text: PromptModelInferenceConfiguration;
};
export const PromptInferenceConfiguration = S.Union(
  S.Struct({ text: PromptModelInferenceConfiguration }),
);
export interface PromptMetadataEntry {
  key: string | Redacted.Redacted<string>;
  value: string | Redacted.Redacted<string>;
}
export const PromptMetadataEntry = S.suspend(() =>
  S.Struct({ key: SensitiveString, value: SensitiveString }),
).annotations({
  identifier: "PromptMetadataEntry",
}) as any as S.Schema<PromptMetadataEntry>;
export type PromptMetadataList = PromptMetadataEntry[];
export const PromptMetadataList = S.Array(PromptMetadataEntry);
export interface PromptAgentResource {
  agentIdentifier: string;
}
export const PromptAgentResource = S.suspend(() =>
  S.Struct({ agentIdentifier: S.String }),
).annotations({
  identifier: "PromptAgentResource",
}) as any as S.Schema<PromptAgentResource>;
export type PromptGenAiResource = { agent: PromptAgentResource };
export const PromptGenAiResource = S.Union(
  S.Struct({ agent: PromptAgentResource }),
);
export interface PromptVariant {
  name: string;
  templateType: string;
  templateConfiguration: (typeof PromptTemplateConfiguration)["Type"];
  modelId?: string;
  inferenceConfiguration?: (typeof PromptInferenceConfiguration)["Type"];
  metadata?: PromptMetadataList;
  additionalModelRequestFields?: any;
  genAiResource?: (typeof PromptGenAiResource)["Type"];
}
export const PromptVariant = S.suspend(() =>
  S.Struct({
    name: S.String,
    templateType: S.String,
    templateConfiguration: PromptTemplateConfiguration,
    modelId: S.optional(S.String),
    inferenceConfiguration: S.optional(PromptInferenceConfiguration),
    metadata: S.optional(PromptMetadataList),
    additionalModelRequestFields: S.optional(S.Any),
    genAiResource: S.optional(PromptGenAiResource),
  }),
).annotations({
  identifier: "PromptVariant",
}) as any as S.Schema<PromptVariant>;
export type PromptVariantList = PromptVariant[];
export const PromptVariantList = S.Array(PromptVariant);
export interface UpdatePromptRequest {
  name: string;
  description?: string;
  customerEncryptionKeyArn?: string;
  defaultVariant?: string;
  variants?: PromptVariantList;
  promptIdentifier: string;
}
export const UpdatePromptRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    customerEncryptionKeyArn: S.optional(S.String),
    defaultVariant: S.optional(S.String),
    variants: S.optional(PromptVariantList),
    promptIdentifier: S.String.pipe(T.HttpLabel("promptIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prompts/{promptIdentifier}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePromptRequest",
}) as any as S.Schema<UpdatePromptRequest>;
export interface DeletePromptRequest {
  promptIdentifier: string;
  promptVersion?: string;
}
export const DeletePromptRequest = S.suspend(() =>
  S.Struct({
    promptIdentifier: S.String.pipe(T.HttpLabel("promptIdentifier")),
    promptVersion: S.optional(S.String).pipe(T.HttpQuery("promptVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prompts/{promptIdentifier}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePromptRequest",
}) as any as S.Schema<DeletePromptRequest>;
export interface ListPromptsRequest {
  promptIdentifier?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListPromptsRequest = S.suspend(() =>
  S.Struct({
    promptIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("promptIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prompts/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPromptsRequest",
}) as any as S.Schema<ListPromptsRequest>;
export interface CreatePromptVersionRequest {
  promptIdentifier: string;
  description?: string;
  clientToken?: string;
  tags?: TagsMap;
}
export const CreatePromptVersionRequest = S.suspend(() =>
  S.Struct({
    promptIdentifier: S.String.pipe(T.HttpLabel("promptIdentifier")),
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prompts/{promptIdentifier}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePromptVersionRequest",
}) as any as S.Schema<CreatePromptVersionRequest>;
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
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagsMap;
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
export interface DeleteAgentVersionRequest {
  agentId: string;
  agentVersion: string;
  skipResourceInUseCheck?: boolean;
}
export const DeleteAgentVersionRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAgentVersionRequest",
}) as any as S.Schema<DeleteAgentVersionRequest>;
export interface GetAgentVersionRequest {
  agentId: string;
  agentVersion: string;
}
export const GetAgentVersionRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAgentVersionRequest",
}) as any as S.Schema<GetAgentVersionRequest>;
export interface ListAgentVersionsRequest {
  agentId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAgentVersionsRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/agents/{agentId}/agentversions/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAgentVersionsRequest",
}) as any as S.Schema<ListAgentVersionsRequest>;
export type IngestionJobFilterValues = string[];
export const IngestionJobFilterValues = S.Array(S.String);
export interface IngestionJobFilter {
  attribute: string;
  operator: string;
  values: IngestionJobFilterValues;
}
export const IngestionJobFilter = S.suspend(() =>
  S.Struct({
    attribute: S.String,
    operator: S.String,
    values: IngestionJobFilterValues,
  }),
).annotations({
  identifier: "IngestionJobFilter",
}) as any as S.Schema<IngestionJobFilter>;
export type IngestionJobFilters = IngestionJobFilter[];
export const IngestionJobFilters = S.Array(IngestionJobFilter);
export interface IngestionJobSortBy {
  attribute: string;
  order: string;
}
export const IngestionJobSortBy = S.suspend(() =>
  S.Struct({ attribute: S.String, order: S.String }),
).annotations({
  identifier: "IngestionJobSortBy",
}) as any as S.Schema<IngestionJobSortBy>;
export interface AgentActionGroup {
  agentId: string;
  agentVersion: string;
  actionGroupId: string;
  actionGroupName: string;
  clientToken?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  parentActionSignature?: string;
  parentActionGroupSignatureParams?: ActionGroupSignatureParams;
  actionGroupExecutor?: (typeof ActionGroupExecutor)["Type"];
  apiSchema?: (typeof APISchema)["Type"];
  functionSchema?: (typeof FunctionSchema)["Type"];
  actionGroupState: string;
}
export const AgentActionGroup = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    agentVersion: S.String,
    actionGroupId: S.String,
    actionGroupName: S.String,
    clientToken: S.optional(S.String),
    description: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    parentActionSignature: S.optional(S.String),
    parentActionGroupSignatureParams: S.optional(ActionGroupSignatureParams),
    actionGroupExecutor: S.optional(ActionGroupExecutor),
    apiSchema: S.optional(APISchema),
    functionSchema: S.optional(FunctionSchema),
    actionGroupState: S.String,
  }),
).annotations({
  identifier: "AgentActionGroup",
}) as any as S.Schema<AgentActionGroup>;
export interface UpdateAgentActionGroupResponse {
  agentActionGroup: AgentActionGroup;
}
export const UpdateAgentActionGroupResponse = S.suspend(() =>
  S.Struct({ agentActionGroup: AgentActionGroup }),
).annotations({
  identifier: "UpdateAgentActionGroupResponse",
}) as any as S.Schema<UpdateAgentActionGroupResponse>;
export interface AssociateAgentCollaboratorRequest {
  agentId: string;
  agentVersion: string;
  agentDescriptor: AgentDescriptor;
  collaboratorName: string;
  collaborationInstruction: string | Redacted.Redacted<string>;
  relayConversationHistory?: string;
  clientToken?: string;
}
export const AssociateAgentCollaboratorRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    agentDescriptor: AgentDescriptor,
    collaboratorName: S.String,
    collaborationInstruction: SensitiveString,
    relayConversationHistory: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/agentcollaborators/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateAgentCollaboratorRequest",
}) as any as S.Schema<AssociateAgentCollaboratorRequest>;
export interface AgentCollaborator {
  agentId: string;
  agentVersion: string;
  agentDescriptor: AgentDescriptor;
  collaboratorId: string;
  collaborationInstruction: string | Redacted.Redacted<string>;
  collaboratorName: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  relayConversationHistory?: string;
  clientToken?: string;
}
export const AgentCollaborator = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    agentVersion: S.String,
    agentDescriptor: AgentDescriptor,
    collaboratorId: S.String,
    collaborationInstruction: SensitiveString,
    collaboratorName: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    relayConversationHistory: S.optional(S.String),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "AgentCollaborator",
}) as any as S.Schema<AgentCollaborator>;
export interface UpdateAgentCollaboratorResponse {
  agentCollaborator: AgentCollaborator;
}
export const UpdateAgentCollaboratorResponse = S.suspend(() =>
  S.Struct({ agentCollaborator: AgentCollaborator }),
).annotations({
  identifier: "UpdateAgentCollaboratorResponse",
}) as any as S.Schema<UpdateAgentCollaboratorResponse>;
export interface DeleteAgentResponse {
  agentId: string;
  agentStatus: string;
}
export const DeleteAgentResponse = S.suspend(() =>
  S.Struct({ agentId: S.String, agentStatus: S.String }),
).annotations({
  identifier: "DeleteAgentResponse",
}) as any as S.Schema<DeleteAgentResponse>;
export interface PrepareAgentResponse {
  agentId: string;
  agentStatus: string;
  agentVersion: string;
  preparedAt: Date;
}
export const PrepareAgentResponse = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    agentStatus: S.String,
    agentVersion: S.String,
    preparedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "PrepareAgentResponse",
}) as any as S.Schema<PrepareAgentResponse>;
export type FailureReasons = string[];
export const FailureReasons = S.Array(S.String);
export type RecommendedActions = string[];
export const RecommendedActions = S.Array(S.String);
export interface Agent {
  agentId: string;
  agentName: string;
  agentArn: string;
  agentVersion: string;
  clientToken?: string;
  instruction?: string | Redacted.Redacted<string>;
  agentStatus: string;
  foundationModel?: string;
  description?: string;
  orchestrationType?: string;
  customOrchestration?: CustomOrchestration;
  idleSessionTTLInSeconds: number;
  agentResourceRoleArn: string;
  customerEncryptionKeyArn?: string;
  createdAt: Date;
  updatedAt: Date;
  preparedAt?: Date;
  failureReasons?: FailureReasons;
  recommendedActions?: RecommendedActions;
  promptOverrideConfiguration?: PromptOverrideConfiguration;
  guardrailConfiguration?: GuardrailConfiguration;
  memoryConfiguration?: MemoryConfiguration;
  agentCollaboration?: string;
}
export const Agent = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    agentName: S.String,
    agentArn: S.String,
    agentVersion: S.String,
    clientToken: S.optional(S.String),
    instruction: S.optional(SensitiveString),
    agentStatus: S.String,
    foundationModel: S.optional(S.String),
    description: S.optional(S.String),
    orchestrationType: S.optional(S.String),
    customOrchestration: S.optional(CustomOrchestration),
    idleSessionTTLInSeconds: S.Number,
    agentResourceRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    preparedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    failureReasons: S.optional(FailureReasons),
    recommendedActions: S.optional(RecommendedActions),
    promptOverrideConfiguration: S.optional(PromptOverrideConfiguration),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
    memoryConfiguration: S.optional(MemoryConfiguration),
    agentCollaboration: S.optional(S.String),
  }),
).annotations({ identifier: "Agent" }) as any as S.Schema<Agent>;
export interface UpdateAgentResponse {
  agent: Agent;
}
export const UpdateAgentResponse = S.suspend(() =>
  S.Struct({ agent: Agent }),
).annotations({
  identifier: "UpdateAgentResponse",
}) as any as S.Schema<UpdateAgentResponse>;
export interface CreateAgentAliasRequest {
  agentId: string;
  agentAliasName: string;
  clientToken?: string;
  description?: string;
  routingConfiguration?: AgentAliasRoutingConfiguration;
  tags?: TagsMap;
}
export const CreateAgentAliasRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasName: S.String,
    clientToken: S.optional(S.String),
    description: S.optional(S.String),
    routingConfiguration: S.optional(AgentAliasRoutingConfiguration),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/agents/{agentId}/agentaliases/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAgentAliasRequest",
}) as any as S.Schema<CreateAgentAliasRequest>;
export interface DeleteAgentAliasResponse {
  agentId: string;
  agentAliasId: string;
  agentAliasStatus: string;
}
export const DeleteAgentAliasResponse = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    agentAliasId: S.String,
    agentAliasStatus: S.String,
  }),
).annotations({
  identifier: "DeleteAgentAliasResponse",
}) as any as S.Schema<DeleteAgentAliasResponse>;
export interface AgentAliasHistoryEvent {
  routingConfiguration?: AgentAliasRoutingConfiguration;
  endDate?: Date;
  startDate?: Date;
}
export const AgentAliasHistoryEvent = S.suspend(() =>
  S.Struct({
    routingConfiguration: S.optional(AgentAliasRoutingConfiguration),
    endDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "AgentAliasHistoryEvent",
}) as any as S.Schema<AgentAliasHistoryEvent>;
export type AgentAliasHistoryEvents = AgentAliasHistoryEvent[];
export const AgentAliasHistoryEvents = S.Array(AgentAliasHistoryEvent);
export interface AgentAlias {
  agentId: string;
  agentAliasId: string;
  agentAliasName: string;
  agentAliasArn: string;
  clientToken?: string;
  description?: string;
  routingConfiguration: AgentAliasRoutingConfiguration;
  createdAt: Date;
  updatedAt: Date;
  agentAliasHistoryEvents?: AgentAliasHistoryEvents;
  agentAliasStatus: string;
  failureReasons?: FailureReasons;
  aliasInvocationState?: string;
}
export const AgentAlias = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    agentAliasId: S.String,
    agentAliasName: S.String,
    agentAliasArn: S.String,
    clientToken: S.optional(S.String),
    description: S.optional(S.String),
    routingConfiguration: AgentAliasRoutingConfiguration,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    agentAliasHistoryEvents: S.optional(AgentAliasHistoryEvents),
    agentAliasStatus: S.String,
    failureReasons: S.optional(FailureReasons),
    aliasInvocationState: S.optional(S.String),
  }),
).annotations({ identifier: "AgentAlias" }) as any as S.Schema<AgentAlias>;
export interface UpdateAgentAliasResponse {
  agentAlias: AgentAlias;
}
export const UpdateAgentAliasResponse = S.suspend(() =>
  S.Struct({ agentAlias: AgentAlias }),
).annotations({
  identifier: "UpdateAgentAliasResponse",
}) as any as S.Schema<UpdateAgentAliasResponse>;
export interface DeleteDataSourceResponse {
  knowledgeBaseId: string;
  dataSourceId: string;
  status: string;
}
export const DeleteDataSourceResponse = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    dataSourceId: S.String,
    status: S.String,
  }),
).annotations({
  identifier: "DeleteDataSourceResponse",
}) as any as S.Schema<DeleteDataSourceResponse>;
export interface DataSource {
  knowledgeBaseId: string;
  dataSourceId: string;
  name: string;
  status: string;
  description?: string;
  dataSourceConfiguration: DataSourceConfiguration;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  vectorIngestionConfiguration?: VectorIngestionConfiguration;
  dataDeletionPolicy?: string;
  createdAt: Date;
  updatedAt: Date;
  failureReasons?: FailureReasons;
}
export const DataSource = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    dataSourceId: S.String,
    name: S.String,
    status: S.String,
    description: S.optional(S.String),
    dataSourceConfiguration: DataSourceConfiguration,
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    vectorIngestionConfiguration: S.optional(VectorIngestionConfiguration),
    dataDeletionPolicy: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    failureReasons: S.optional(FailureReasons),
  }),
).annotations({ identifier: "DataSource" }) as any as S.Schema<DataSource>;
export interface UpdateDataSourceResponse {
  dataSource: DataSource;
}
export const UpdateDataSourceResponse = S.suspend(() =>
  S.Struct({ dataSource: DataSource }),
).annotations({
  identifier: "UpdateDataSourceResponse",
}) as any as S.Schema<UpdateDataSourceResponse>;
export interface CreateFlowResponse {
  name: string;
  description?: string;
  executionRoleArn: string;
  customerEncryptionKeyArn?: string;
  id: string;
  arn: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  definition?: FlowDefinition;
}
export const CreateFlowResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    executionRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    id: S.String,
    arn: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    version: S.String,
    definition: S.optional(FlowDefinition),
  }),
).annotations({
  identifier: "CreateFlowResponse",
}) as any as S.Schema<CreateFlowResponse>;
export interface UpdateFlowResponse {
  name: string;
  description?: string;
  executionRoleArn: string;
  customerEncryptionKeyArn?: string;
  id: string;
  arn: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  definition?: FlowDefinition;
}
export const UpdateFlowResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    executionRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    id: S.String,
    arn: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    version: S.String,
    definition: S.optional(FlowDefinition),
  }),
).annotations({
  identifier: "UpdateFlowResponse",
}) as any as S.Schema<UpdateFlowResponse>;
export interface DeleteFlowResponse {
  id: string;
}
export const DeleteFlowResponse = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "DeleteFlowResponse",
}) as any as S.Schema<DeleteFlowResponse>;
export interface PrepareFlowResponse {
  id: string;
  status: string;
}
export const PrepareFlowResponse = S.suspend(() =>
  S.Struct({ id: S.String, status: S.String }),
).annotations({
  identifier: "PrepareFlowResponse",
}) as any as S.Schema<PrepareFlowResponse>;
export interface CreateFlowAliasRequest {
  name: string;
  description?: string;
  routingConfiguration: FlowAliasRoutingConfiguration;
  concurrencyConfiguration?: FlowAliasConcurrencyConfiguration;
  flowIdentifier: string;
  clientToken?: string;
  tags?: TagsMap;
}
export const CreateFlowAliasRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    routingConfiguration: FlowAliasRoutingConfiguration,
    concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/flows/{flowIdentifier}/aliases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFlowAliasRequest",
}) as any as S.Schema<CreateFlowAliasRequest>;
export interface GetFlowAliasResponse {
  name: string;
  description?: string;
  routingConfiguration: FlowAliasRoutingConfiguration;
  concurrencyConfiguration?: FlowAliasConcurrencyConfiguration;
  flowId: string;
  id: string;
  arn: string;
  createdAt: Date;
  updatedAt: Date;
}
export const GetFlowAliasResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    routingConfiguration: FlowAliasRoutingConfiguration,
    concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
    flowId: S.String,
    id: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetFlowAliasResponse",
}) as any as S.Schema<GetFlowAliasResponse>;
export interface UpdateFlowAliasResponse {
  name: string;
  description?: string;
  routingConfiguration: FlowAliasRoutingConfiguration;
  concurrencyConfiguration?: FlowAliasConcurrencyConfiguration;
  flowId: string;
  id: string;
  arn: string;
  createdAt: Date;
  updatedAt: Date;
}
export const UpdateFlowAliasResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    routingConfiguration: FlowAliasRoutingConfiguration,
    concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
    flowId: S.String,
    id: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateFlowAliasResponse",
}) as any as S.Schema<UpdateFlowAliasResponse>;
export interface DeleteFlowAliasResponse {
  flowId: string;
  id: string;
}
export const DeleteFlowAliasResponse = S.suspend(() =>
  S.Struct({ flowId: S.String, id: S.String }),
).annotations({
  identifier: "DeleteFlowAliasResponse",
}) as any as S.Schema<DeleteFlowAliasResponse>;
export interface CreateFlowVersionResponse {
  name: string;
  description?: string;
  executionRoleArn: string;
  customerEncryptionKeyArn?: string;
  id: string;
  arn: string;
  status: string;
  createdAt: Date;
  version: string;
  definition?: FlowDefinition;
}
export const CreateFlowVersionResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    executionRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    id: S.String,
    arn: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    version: S.String,
    definition: S.optional(FlowDefinition),
  }),
).annotations({
  identifier: "CreateFlowVersionResponse",
}) as any as S.Schema<CreateFlowVersionResponse>;
export interface GetFlowVersionResponse {
  name: string;
  description?: string;
  executionRoleArn: string;
  customerEncryptionKeyArn?: string;
  id: string;
  arn: string;
  status: string;
  createdAt: Date;
  version: string;
  definition?: FlowDefinition;
}
export const GetFlowVersionResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    executionRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    id: S.String,
    arn: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    version: S.String,
    definition: S.optional(FlowDefinition),
  }),
).annotations({
  identifier: "GetFlowVersionResponse",
}) as any as S.Schema<GetFlowVersionResponse>;
export interface DeleteFlowVersionResponse {
  id: string;
  version: string;
}
export const DeleteFlowVersionResponse = S.suspend(() =>
  S.Struct({ id: S.String, version: S.String }),
).annotations({
  identifier: "DeleteFlowVersionResponse",
}) as any as S.Schema<DeleteFlowVersionResponse>;
export interface ListIngestionJobsRequest {
  knowledgeBaseId: string;
  dataSourceId: string;
  filters?: IngestionJobFilters;
  sortBy?: IngestionJobSortBy;
  maxResults?: number;
  nextToken?: string;
}
export const ListIngestionJobsRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    filters: S.optional(IngestionJobFilters),
    sortBy: S.optional(IngestionJobSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/{dataSourceId}/ingestionjobs/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIngestionJobsRequest",
}) as any as S.Schema<ListIngestionJobsRequest>;
export interface IngestionJobStatistics {
  numberOfDocumentsScanned?: number;
  numberOfMetadataDocumentsScanned?: number;
  numberOfNewDocumentsIndexed?: number;
  numberOfModifiedDocumentsIndexed?: number;
  numberOfMetadataDocumentsModified?: number;
  numberOfDocumentsDeleted?: number;
  numberOfDocumentsFailed?: number;
}
export const IngestionJobStatistics = S.suspend(() =>
  S.Struct({
    numberOfDocumentsScanned: S.optional(S.Number),
    numberOfMetadataDocumentsScanned: S.optional(S.Number),
    numberOfNewDocumentsIndexed: S.optional(S.Number),
    numberOfModifiedDocumentsIndexed: S.optional(S.Number),
    numberOfMetadataDocumentsModified: S.optional(S.Number),
    numberOfDocumentsDeleted: S.optional(S.Number),
    numberOfDocumentsFailed: S.optional(S.Number),
  }),
).annotations({
  identifier: "IngestionJobStatistics",
}) as any as S.Schema<IngestionJobStatistics>;
export interface IngestionJob {
  knowledgeBaseId: string;
  dataSourceId: string;
  ingestionJobId: string;
  description?: string;
  status: string;
  statistics?: IngestionJobStatistics;
  failureReasons?: FailureReasons;
  startedAt: Date;
  updatedAt: Date;
}
export const IngestionJob = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    dataSourceId: S.String,
    ingestionJobId: S.String,
    description: S.optional(S.String),
    status: S.String,
    statistics: S.optional(IngestionJobStatistics),
    failureReasons: S.optional(FailureReasons),
    startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({ identifier: "IngestionJob" }) as any as S.Schema<IngestionJob>;
export interface StartIngestionJobResponse {
  ingestionJob: IngestionJob;
}
export const StartIngestionJobResponse = S.suspend(() =>
  S.Struct({ ingestionJob: IngestionJob }),
).annotations({
  identifier: "StartIngestionJobResponse",
}) as any as S.Schema<StartIngestionJobResponse>;
export interface StopIngestionJobResponse {
  ingestionJob: IngestionJob;
}
export const StopIngestionJobResponse = S.suspend(() =>
  S.Struct({ ingestionJob: IngestionJob }),
).annotations({
  identifier: "StopIngestionJobResponse",
}) as any as S.Schema<StopIngestionJobResponse>;
export interface KnowledgeBaseDocumentDetail {
  knowledgeBaseId: string;
  dataSourceId: string;
  status: string;
  identifier: DocumentIdentifier;
  statusReason?: string;
  updatedAt?: Date;
}
export const KnowledgeBaseDocumentDetail = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    dataSourceId: S.String,
    status: S.String,
    identifier: DocumentIdentifier,
    statusReason: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "KnowledgeBaseDocumentDetail",
}) as any as S.Schema<KnowledgeBaseDocumentDetail>;
export type KnowledgeBaseDocumentDetails = KnowledgeBaseDocumentDetail[];
export const KnowledgeBaseDocumentDetails = S.Array(
  KnowledgeBaseDocumentDetail,
);
export interface ListKnowledgeBaseDocumentsResponse {
  documentDetails: KnowledgeBaseDocumentDetails;
  nextToken?: string;
}
export const ListKnowledgeBaseDocumentsResponse = S.suspend(() =>
  S.Struct({
    documentDetails: KnowledgeBaseDocumentDetails,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKnowledgeBaseDocumentsResponse",
}) as any as S.Schema<ListKnowledgeBaseDocumentsResponse>;
export interface DeleteKnowledgeBaseResponse {
  knowledgeBaseId: string;
  status: string;
}
export const DeleteKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({ knowledgeBaseId: S.String, status: S.String }),
).annotations({
  identifier: "DeleteKnowledgeBaseResponse",
}) as any as S.Schema<DeleteKnowledgeBaseResponse>;
export interface AgentKnowledgeBase {
  agentId: string;
  agentVersion: string;
  knowledgeBaseId: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  knowledgeBaseState: string;
}
export const AgentKnowledgeBase = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    agentVersion: S.String,
    knowledgeBaseId: S.String,
    description: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    knowledgeBaseState: S.String,
  }),
).annotations({
  identifier: "AgentKnowledgeBase",
}) as any as S.Schema<AgentKnowledgeBase>;
export interface GetAgentKnowledgeBaseResponse {
  agentKnowledgeBase: AgentKnowledgeBase;
}
export const GetAgentKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({ agentKnowledgeBase: AgentKnowledgeBase }),
).annotations({
  identifier: "GetAgentKnowledgeBaseResponse",
}) as any as S.Schema<GetAgentKnowledgeBaseResponse>;
export interface UpdateAgentKnowledgeBaseResponse {
  agentKnowledgeBase: AgentKnowledgeBase;
}
export const UpdateAgentKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({ agentKnowledgeBase: AgentKnowledgeBase }),
).annotations({
  identifier: "UpdateAgentKnowledgeBaseResponse",
}) as any as S.Schema<UpdateAgentKnowledgeBaseResponse>;
export interface KnowledgeBase {
  knowledgeBaseId: string;
  name: string;
  knowledgeBaseArn: string;
  description?: string;
  roleArn: string;
  knowledgeBaseConfiguration: KnowledgeBaseConfiguration;
  storageConfiguration?: StorageConfiguration;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  failureReasons?: FailureReasons;
}
export const KnowledgeBase = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    name: S.String,
    knowledgeBaseArn: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    knowledgeBaseConfiguration: KnowledgeBaseConfiguration,
    storageConfiguration: S.optional(StorageConfiguration),
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    failureReasons: S.optional(FailureReasons),
  }),
).annotations({
  identifier: "KnowledgeBase",
}) as any as S.Schema<KnowledgeBase>;
export interface UpdateKnowledgeBaseResponse {
  knowledgeBase: KnowledgeBase;
}
export const UpdateKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({ knowledgeBase: KnowledgeBase }),
).annotations({
  identifier: "UpdateKnowledgeBaseResponse",
}) as any as S.Schema<UpdateKnowledgeBaseResponse>;
export interface GetPromptResponse {
  name: string;
  description?: string;
  customerEncryptionKeyArn?: string;
  defaultVariant?: string;
  variants?: PromptVariantList;
  id: string;
  arn: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}
export const GetPromptResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    customerEncryptionKeyArn: S.optional(S.String),
    defaultVariant: S.optional(S.String),
    variants: S.optional(PromptVariantList),
    id: S.String,
    arn: S.String,
    version: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetPromptResponse",
}) as any as S.Schema<GetPromptResponse>;
export interface UpdatePromptResponse {
  name: string;
  description?: string;
  customerEncryptionKeyArn?: string;
  defaultVariant?: string;
  variants?: PromptVariantList;
  id: string;
  arn: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}
export const UpdatePromptResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    customerEncryptionKeyArn: S.optional(S.String),
    defaultVariant: S.optional(S.String),
    variants: S.optional(PromptVariantList),
    id: S.String,
    arn: S.String,
    version: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdatePromptResponse",
}) as any as S.Schema<UpdatePromptResponse>;
export interface DeletePromptResponse {
  id: string;
  version?: string;
}
export const DeletePromptResponse = S.suspend(() =>
  S.Struct({ id: S.String, version: S.optional(S.String) }),
).annotations({
  identifier: "DeletePromptResponse",
}) as any as S.Schema<DeletePromptResponse>;
export interface CreatePromptVersionResponse {
  name: string;
  description?: string;
  customerEncryptionKeyArn?: string;
  defaultVariant?: string;
  variants?: PromptVariantList;
  id: string;
  arn: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}
export const CreatePromptVersionResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    customerEncryptionKeyArn: S.optional(S.String),
    defaultVariant: S.optional(S.String),
    variants: S.optional(PromptVariantList),
    id: S.String,
    arn: S.String,
    version: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreatePromptVersionResponse",
}) as any as S.Schema<CreatePromptVersionResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagsMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagsMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface DeleteAgentVersionResponse {
  agentId: string;
  agentVersion: string;
  agentStatus: string;
}
export const DeleteAgentVersionResponse = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    agentVersion: S.String,
    agentStatus: S.String,
  }),
).annotations({
  identifier: "DeleteAgentVersionResponse",
}) as any as S.Schema<DeleteAgentVersionResponse>;
export interface InputFlowNodeConfiguration {}
export const InputFlowNodeConfiguration = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "InputFlowNodeConfiguration",
}) as any as S.Schema<InputFlowNodeConfiguration>;
export interface OutputFlowNodeConfiguration {}
export const OutputFlowNodeConfiguration = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "OutputFlowNodeConfiguration",
}) as any as S.Schema<OutputFlowNodeConfiguration>;
export interface IteratorFlowNodeConfiguration {}
export const IteratorFlowNodeConfiguration = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "IteratorFlowNodeConfiguration",
}) as any as S.Schema<IteratorFlowNodeConfiguration>;
export interface CollectorFlowNodeConfiguration {}
export const CollectorFlowNodeConfiguration = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CollectorFlowNodeConfiguration",
}) as any as S.Schema<CollectorFlowNodeConfiguration>;
export interface LoopInputFlowNodeConfiguration {}
export const LoopInputFlowNodeConfiguration = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "LoopInputFlowNodeConfiguration",
}) as any as S.Schema<LoopInputFlowNodeConfiguration>;
export interface ActionGroupSummary {
  actionGroupId: string;
  actionGroupName: string;
  actionGroupState: string;
  description?: string;
  updatedAt: Date;
}
export const ActionGroupSummary = S.suspend(() =>
  S.Struct({
    actionGroupId: S.String,
    actionGroupName: S.String,
    actionGroupState: S.String,
    description: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ActionGroupSummary",
}) as any as S.Schema<ActionGroupSummary>;
export type ActionGroupSummaries = ActionGroupSummary[];
export const ActionGroupSummaries = S.Array(ActionGroupSummary);
export interface AgentCollaboratorSummary {
  agentId: string;
  agentVersion: string;
  collaboratorId: string;
  agentDescriptor: AgentDescriptor;
  collaborationInstruction: string | Redacted.Redacted<string>;
  relayConversationHistory: string;
  collaboratorName: string;
  createdAt: Date;
  lastUpdatedAt: Date;
}
export const AgentCollaboratorSummary = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    agentVersion: S.String,
    collaboratorId: S.String,
    agentDescriptor: AgentDescriptor,
    collaborationInstruction: SensitiveString,
    relayConversationHistory: S.String,
    collaboratorName: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "AgentCollaboratorSummary",
}) as any as S.Schema<AgentCollaboratorSummary>;
export type AgentCollaboratorSummaries = AgentCollaboratorSummary[];
export const AgentCollaboratorSummaries = S.Array(AgentCollaboratorSummary);
export interface AgentSummary {
  agentId: string;
  agentName: string;
  agentStatus: string;
  description?: string;
  updatedAt: Date;
  latestAgentVersion?: string;
  guardrailConfiguration?: GuardrailConfiguration;
}
export const AgentSummary = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    agentName: S.String,
    agentStatus: S.String,
    description: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    latestAgentVersion: S.optional(S.String),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
  }),
).annotations({ identifier: "AgentSummary" }) as any as S.Schema<AgentSummary>;
export type AgentSummaries = AgentSummary[];
export const AgentSummaries = S.Array(AgentSummary);
export interface AgentAliasSummary {
  agentAliasId: string;
  agentAliasName: string;
  description?: string;
  routingConfiguration?: AgentAliasRoutingConfiguration;
  agentAliasStatus: string;
  createdAt: Date;
  updatedAt: Date;
  aliasInvocationState?: string;
}
export const AgentAliasSummary = S.suspend(() =>
  S.Struct({
    agentAliasId: S.String,
    agentAliasName: S.String,
    description: S.optional(S.String),
    routingConfiguration: S.optional(AgentAliasRoutingConfiguration),
    agentAliasStatus: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    aliasInvocationState: S.optional(S.String),
  }),
).annotations({
  identifier: "AgentAliasSummary",
}) as any as S.Schema<AgentAliasSummary>;
export type AgentAliasSummaries = AgentAliasSummary[];
export const AgentAliasSummaries = S.Array(AgentAliasSummary);
export interface DataSourceSummary {
  knowledgeBaseId: string;
  dataSourceId: string;
  name: string;
  status: string;
  description?: string;
  updatedAt: Date;
}
export const DataSourceSummary = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    dataSourceId: S.String,
    name: S.String,
    status: S.String,
    description: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "DataSourceSummary",
}) as any as S.Schema<DataSourceSummary>;
export type DataSourceSummaries = DataSourceSummary[];
export const DataSourceSummaries = S.Array(DataSourceSummary);
export interface FlowSummary {
  name: string;
  description?: string;
  id: string;
  arn: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}
export const FlowSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    id: S.String,
    arn: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    version: S.String,
  }),
).annotations({ identifier: "FlowSummary" }) as any as S.Schema<FlowSummary>;
export type FlowSummaries = FlowSummary[];
export const FlowSummaries = S.Array(FlowSummary);
export interface FlowAliasSummary {
  name: string;
  description?: string;
  routingConfiguration: FlowAliasRoutingConfiguration;
  concurrencyConfiguration?: FlowAliasConcurrencyConfiguration;
  flowId: string;
  id: string;
  arn: string;
  createdAt: Date;
  updatedAt: Date;
}
export const FlowAliasSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    routingConfiguration: FlowAliasRoutingConfiguration,
    concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
    flowId: S.String,
    id: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "FlowAliasSummary",
}) as any as S.Schema<FlowAliasSummary>;
export type FlowAliasSummaries = FlowAliasSummary[];
export const FlowAliasSummaries = S.Array(FlowAliasSummary);
export interface FlowVersionSummary {
  id: string;
  arn: string;
  status: string;
  createdAt: Date;
  version: string;
}
export const FlowVersionSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    version: S.String,
  }),
).annotations({
  identifier: "FlowVersionSummary",
}) as any as S.Schema<FlowVersionSummary>;
export type FlowVersionSummaries = FlowVersionSummary[];
export const FlowVersionSummaries = S.Array(FlowVersionSummary);
export interface AgentKnowledgeBaseSummary {
  knowledgeBaseId: string;
  description?: string;
  knowledgeBaseState: string;
  updatedAt: Date;
}
export const AgentKnowledgeBaseSummary = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    description: S.optional(S.String),
    knowledgeBaseState: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "AgentKnowledgeBaseSummary",
}) as any as S.Schema<AgentKnowledgeBaseSummary>;
export type AgentKnowledgeBaseSummaries = AgentKnowledgeBaseSummary[];
export const AgentKnowledgeBaseSummaries = S.Array(AgentKnowledgeBaseSummary);
export interface KnowledgeBaseSummary {
  knowledgeBaseId: string;
  name: string;
  description?: string;
  status: string;
  updatedAt: Date;
}
export const KnowledgeBaseSummary = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    name: S.String,
    description: S.optional(S.String),
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "KnowledgeBaseSummary",
}) as any as S.Schema<KnowledgeBaseSummary>;
export type KnowledgeBaseSummaries = KnowledgeBaseSummary[];
export const KnowledgeBaseSummaries = S.Array(KnowledgeBaseSummary);
export interface PromptSummary {
  name: string;
  description?: string;
  id: string;
  arn: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}
export const PromptSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    id: S.String,
    arn: S.String,
    version: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "PromptSummary",
}) as any as S.Schema<PromptSummary>;
export type PromptSummaries = PromptSummary[];
export const PromptSummaries = S.Array(PromptSummary);
export interface AgentVersion {
  agentId: string;
  agentName: string;
  agentArn: string;
  version: string;
  instruction?: string | Redacted.Redacted<string>;
  agentStatus: string;
  foundationModel?: string;
  description?: string;
  idleSessionTTLInSeconds: number;
  agentResourceRoleArn: string;
  customerEncryptionKeyArn?: string;
  createdAt: Date;
  updatedAt: Date;
  failureReasons?: FailureReasons;
  recommendedActions?: RecommendedActions;
  promptOverrideConfiguration?: PromptOverrideConfiguration;
  guardrailConfiguration?: GuardrailConfiguration;
  memoryConfiguration?: MemoryConfiguration;
  agentCollaboration?: string;
}
export const AgentVersion = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    agentName: S.String,
    agentArn: S.String,
    version: S.String,
    instruction: S.optional(SensitiveString),
    agentStatus: S.String,
    foundationModel: S.optional(S.String),
    description: S.optional(S.String),
    idleSessionTTLInSeconds: S.Number,
    agentResourceRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    failureReasons: S.optional(FailureReasons),
    recommendedActions: S.optional(RecommendedActions),
    promptOverrideConfiguration: S.optional(PromptOverrideConfiguration),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
    memoryConfiguration: S.optional(MemoryConfiguration),
    agentCollaboration: S.optional(S.String),
  }),
).annotations({ identifier: "AgentVersion" }) as any as S.Schema<AgentVersion>;
export interface AgentVersionSummary {
  agentName: string;
  agentStatus: string;
  agentVersion: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  guardrailConfiguration?: GuardrailConfiguration;
}
export const AgentVersionSummary = S.suspend(() =>
  S.Struct({
    agentName: S.String,
    agentStatus: S.String,
    agentVersion: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(S.String),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
  }),
).annotations({
  identifier: "AgentVersionSummary",
}) as any as S.Schema<AgentVersionSummary>;
export type AgentVersionSummaries = AgentVersionSummary[];
export const AgentVersionSummaries = S.Array(AgentVersionSummary);
export interface FlowNodeInput {
  name: string;
  type: string;
  expression: string | Redacted.Redacted<string>;
  category?: string;
}
export const FlowNodeInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: S.String,
    expression: SensitiveString,
    category: S.optional(S.String),
  }),
).annotations({
  identifier: "FlowNodeInput",
}) as any as S.Schema<FlowNodeInput>;
export type FlowNodeInputs = FlowNodeInput[];
export const FlowNodeInputs = S.Array(FlowNodeInput);
export interface FlowNodeOutput {
  name: string;
  type: string;
}
export const FlowNodeOutput = S.suspend(() =>
  S.Struct({ name: S.String, type: S.String }),
).annotations({
  identifier: "FlowNodeOutput",
}) as any as S.Schema<FlowNodeOutput>;
export type FlowNodeOutputs = FlowNodeOutput[];
export const FlowNodeOutputs = S.Array(FlowNodeOutput);
export interface MissingEndingNodesFlowValidationDetails {}
export const MissingEndingNodesFlowValidationDetails = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "MissingEndingNodesFlowValidationDetails",
}) as any as S.Schema<MissingEndingNodesFlowValidationDetails>;
export interface MissingStartingNodesFlowValidationDetails {}
export const MissingStartingNodesFlowValidationDetails = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "MissingStartingNodesFlowValidationDetails",
}) as any as S.Schema<MissingStartingNodesFlowValidationDetails>;
export interface UnspecifiedFlowValidationDetails {}
export const UnspecifiedFlowValidationDetails = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UnspecifiedFlowValidationDetails",
}) as any as S.Schema<UnspecifiedFlowValidationDetails>;
export interface CustomS3Location {
  uri: string;
  bucketOwnerAccountId?: string;
}
export const CustomS3Location = S.suspend(() =>
  S.Struct({ uri: S.String, bucketOwnerAccountId: S.optional(S.String) }),
).annotations({
  identifier: "CustomS3Location",
}) as any as S.Schema<CustomS3Location>;
export interface S3Content {
  s3Location: S3Location;
}
export const S3Content = S.suspend(() =>
  S.Struct({ s3Location: S3Location }),
).annotations({ identifier: "S3Content" }) as any as S.Schema<S3Content>;
export interface GetAgentActionGroupResponse {
  agentActionGroup: AgentActionGroup;
}
export const GetAgentActionGroupResponse = S.suspend(() =>
  S.Struct({ agentActionGroup: AgentActionGroup }),
).annotations({
  identifier: "GetAgentActionGroupResponse",
}) as any as S.Schema<GetAgentActionGroupResponse>;
export interface ListAgentActionGroupsResponse {
  actionGroupSummaries: ActionGroupSummaries;
  nextToken?: string;
}
export const ListAgentActionGroupsResponse = S.suspend(() =>
  S.Struct({
    actionGroupSummaries: ActionGroupSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAgentActionGroupsResponse",
}) as any as S.Schema<ListAgentActionGroupsResponse>;
export interface AssociateAgentCollaboratorResponse {
  agentCollaborator: AgentCollaborator;
}
export const AssociateAgentCollaboratorResponse = S.suspend(() =>
  S.Struct({ agentCollaborator: AgentCollaborator }),
).annotations({
  identifier: "AssociateAgentCollaboratorResponse",
}) as any as S.Schema<AssociateAgentCollaboratorResponse>;
export interface GetAgentCollaboratorResponse {
  agentCollaborator: AgentCollaborator;
}
export const GetAgentCollaboratorResponse = S.suspend(() =>
  S.Struct({ agentCollaborator: AgentCollaborator }),
).annotations({
  identifier: "GetAgentCollaboratorResponse",
}) as any as S.Schema<GetAgentCollaboratorResponse>;
export interface ListAgentCollaboratorsResponse {
  agentCollaboratorSummaries: AgentCollaboratorSummaries;
  nextToken?: string;
}
export const ListAgentCollaboratorsResponse = S.suspend(() =>
  S.Struct({
    agentCollaboratorSummaries: AgentCollaboratorSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAgentCollaboratorsResponse",
}) as any as S.Schema<ListAgentCollaboratorsResponse>;
export interface GetAgentResponse {
  agent: Agent;
}
export const GetAgentResponse = S.suspend(() =>
  S.Struct({ agent: Agent }),
).annotations({
  identifier: "GetAgentResponse",
}) as any as S.Schema<GetAgentResponse>;
export interface ListAgentsResponse {
  agentSummaries: AgentSummaries;
  nextToken?: string;
}
export const ListAgentsResponse = S.suspend(() =>
  S.Struct({ agentSummaries: AgentSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAgentsResponse",
}) as any as S.Schema<ListAgentsResponse>;
export interface CreateAgentAliasResponse {
  agentAlias: AgentAlias;
}
export const CreateAgentAliasResponse = S.suspend(() =>
  S.Struct({ agentAlias: AgentAlias }),
).annotations({
  identifier: "CreateAgentAliasResponse",
}) as any as S.Schema<CreateAgentAliasResponse>;
export interface ListAgentAliasesResponse {
  agentAliasSummaries: AgentAliasSummaries;
  nextToken?: string;
}
export const ListAgentAliasesResponse = S.suspend(() =>
  S.Struct({
    agentAliasSummaries: AgentAliasSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAgentAliasesResponse",
}) as any as S.Schema<ListAgentAliasesResponse>;
export interface GetDataSourceResponse {
  dataSource: DataSource;
}
export const GetDataSourceResponse = S.suspend(() =>
  S.Struct({ dataSource: DataSource }),
).annotations({
  identifier: "GetDataSourceResponse",
}) as any as S.Schema<GetDataSourceResponse>;
export interface ListDataSourcesResponse {
  dataSourceSummaries: DataSourceSummaries;
  nextToken?: string;
}
export const ListDataSourcesResponse = S.suspend(() =>
  S.Struct({
    dataSourceSummaries: DataSourceSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataSourcesResponse",
}) as any as S.Schema<ListDataSourcesResponse>;
export interface ListFlowsResponse {
  flowSummaries: FlowSummaries;
  nextToken?: string;
}
export const ListFlowsResponse = S.suspend(() =>
  S.Struct({ flowSummaries: FlowSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFlowsResponse",
}) as any as S.Schema<ListFlowsResponse>;
export interface CreateFlowAliasResponse {
  name: string;
  description?: string;
  routingConfiguration: FlowAliasRoutingConfiguration;
  concurrencyConfiguration?: FlowAliasConcurrencyConfiguration;
  flowId: string;
  id: string;
  arn: string;
  createdAt: Date;
  updatedAt: Date;
}
export const CreateFlowAliasResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    routingConfiguration: FlowAliasRoutingConfiguration,
    concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
    flowId: S.String,
    id: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateFlowAliasResponse",
}) as any as S.Schema<CreateFlowAliasResponse>;
export interface ListFlowAliasesResponse {
  flowAliasSummaries: FlowAliasSummaries;
  nextToken?: string;
}
export const ListFlowAliasesResponse = S.suspend(() =>
  S.Struct({
    flowAliasSummaries: FlowAliasSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFlowAliasesResponse",
}) as any as S.Schema<ListFlowAliasesResponse>;
export interface ListFlowVersionsResponse {
  flowVersionSummaries: FlowVersionSummaries;
  nextToken?: string;
}
export const ListFlowVersionsResponse = S.suspend(() =>
  S.Struct({
    flowVersionSummaries: FlowVersionSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFlowVersionsResponse",
}) as any as S.Schema<ListFlowVersionsResponse>;
export interface DeleteKnowledgeBaseDocumentsRequest {
  knowledgeBaseId: string;
  dataSourceId: string;
  clientToken?: string;
  documentIdentifiers: DocumentIdentifiers;
}
export const DeleteKnowledgeBaseDocumentsRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    clientToken: S.optional(S.String),
    documentIdentifiers: DocumentIdentifiers,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/{dataSourceId}/documents/deleteDocuments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKnowledgeBaseDocumentsRequest",
}) as any as S.Schema<DeleteKnowledgeBaseDocumentsRequest>;
export interface GetKnowledgeBaseDocumentsResponse {
  documentDetails?: KnowledgeBaseDocumentDetails;
}
export const GetKnowledgeBaseDocumentsResponse = S.suspend(() =>
  S.Struct({ documentDetails: S.optional(KnowledgeBaseDocumentDetails) }),
).annotations({
  identifier: "GetKnowledgeBaseDocumentsResponse",
}) as any as S.Schema<GetKnowledgeBaseDocumentsResponse>;
export type StringListValue = string | Redacted.Redacted<string>[];
export const StringListValue = S.Array(SensitiveString);
export interface AssociateAgentKnowledgeBaseResponse {
  agentKnowledgeBase: AgentKnowledgeBase;
}
export const AssociateAgentKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({ agentKnowledgeBase: AgentKnowledgeBase }),
).annotations({
  identifier: "AssociateAgentKnowledgeBaseResponse",
}) as any as S.Schema<AssociateAgentKnowledgeBaseResponse>;
export interface GetKnowledgeBaseResponse {
  knowledgeBase: KnowledgeBase;
}
export const GetKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({ knowledgeBase: KnowledgeBase }),
).annotations({
  identifier: "GetKnowledgeBaseResponse",
}) as any as S.Schema<GetKnowledgeBaseResponse>;
export interface ListAgentKnowledgeBasesResponse {
  agentKnowledgeBaseSummaries: AgentKnowledgeBaseSummaries;
  nextToken?: string;
}
export const ListAgentKnowledgeBasesResponse = S.suspend(() =>
  S.Struct({
    agentKnowledgeBaseSummaries: AgentKnowledgeBaseSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAgentKnowledgeBasesResponse",
}) as any as S.Schema<ListAgentKnowledgeBasesResponse>;
export interface ListKnowledgeBasesResponse {
  knowledgeBaseSummaries: KnowledgeBaseSummaries;
  nextToken?: string;
}
export const ListKnowledgeBasesResponse = S.suspend(() =>
  S.Struct({
    knowledgeBaseSummaries: KnowledgeBaseSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKnowledgeBasesResponse",
}) as any as S.Schema<ListKnowledgeBasesResponse>;
export interface ListPromptsResponse {
  promptSummaries: PromptSummaries;
  nextToken?: string;
}
export const ListPromptsResponse = S.suspend(() =>
  S.Struct({
    promptSummaries: PromptSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPromptsResponse",
}) as any as S.Schema<ListPromptsResponse>;
export interface GetAgentVersionResponse {
  agentVersion: AgentVersion;
}
export const GetAgentVersionResponse = S.suspend(() =>
  S.Struct({ agentVersion: AgentVersion }),
).annotations({
  identifier: "GetAgentVersionResponse",
}) as any as S.Schema<GetAgentVersionResponse>;
export interface ListAgentVersionsResponse {
  agentVersionSummaries: AgentVersionSummaries;
  nextToken?: string;
}
export const ListAgentVersionsResponse = S.suspend(() =>
  S.Struct({
    agentVersionSummaries: AgentVersionSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAgentVersionsResponse",
}) as any as S.Schema<ListAgentVersionsResponse>;
export interface LexFlowNodeConfiguration {
  botAliasArn: string;
  localeId: string;
}
export const LexFlowNodeConfiguration = S.suspend(() =>
  S.Struct({ botAliasArn: S.String, localeId: S.String }),
).annotations({
  identifier: "LexFlowNodeConfiguration",
}) as any as S.Schema<LexFlowNodeConfiguration>;
export interface LambdaFunctionFlowNodeConfiguration {
  lambdaArn: string;
}
export const LambdaFunctionFlowNodeConfiguration = S.suspend(() =>
  S.Struct({ lambdaArn: S.String }),
).annotations({
  identifier: "LambdaFunctionFlowNodeConfiguration",
}) as any as S.Schema<LambdaFunctionFlowNodeConfiguration>;
export interface AgentFlowNodeConfiguration {
  agentAliasArn: string;
}
export const AgentFlowNodeConfiguration = S.suspend(() =>
  S.Struct({ agentAliasArn: S.String }),
).annotations({
  identifier: "AgentFlowNodeConfiguration",
}) as any as S.Schema<AgentFlowNodeConfiguration>;
export interface InlineCodeFlowNodeConfiguration {
  code: string | Redacted.Redacted<string>;
  language: string;
}
export const InlineCodeFlowNodeConfiguration = S.suspend(() =>
  S.Struct({ code: SensitiveString, language: S.String }),
).annotations({
  identifier: "InlineCodeFlowNodeConfiguration",
}) as any as S.Schema<InlineCodeFlowNodeConfiguration>;
export interface LoopFlowNodeConfiguration {
  definition: FlowDefinition;
}
export const LoopFlowNodeConfiguration = S.suspend(() =>
  S.Struct({
    definition: S.suspend(
      (): S.Schema<FlowDefinition, any> => FlowDefinition,
    ).annotations({ identifier: "FlowDefinition" }),
  }),
).annotations({
  identifier: "LoopFlowNodeConfiguration",
}) as any as S.Schema<LoopFlowNodeConfiguration>;
export interface FlowCondition {
  name: string;
  expression?: string | Redacted.Redacted<string>;
}
export const FlowCondition = S.suspend(() =>
  S.Struct({ name: S.String, expression: S.optional(SensitiveString) }),
).annotations({
  identifier: "FlowCondition",
}) as any as S.Schema<FlowCondition>;
export interface LoopControllerFlowNodeConfiguration {
  continueCondition: FlowCondition;
  maxIterations?: number;
}
export const LoopControllerFlowNodeConfiguration = S.suspend(() =>
  S.Struct({
    continueCondition: FlowCondition,
    maxIterations: S.optional(S.Number),
  }),
).annotations({
  identifier: "LoopControllerFlowNodeConfiguration",
}) as any as S.Schema<LoopControllerFlowNodeConfiguration>;
export interface MetadataAttributeValue {
  type: string;
  numberValue?: number;
  booleanValue?: boolean;
  stringValue?: string | Redacted.Redacted<string>;
  stringListValue?: StringListValue;
}
export const MetadataAttributeValue = S.suspend(() =>
  S.Struct({
    type: S.String,
    numberValue: S.optional(S.Number),
    booleanValue: S.optional(S.Boolean),
    stringValue: S.optional(SensitiveString),
    stringListValue: S.optional(StringListValue),
  }),
).annotations({
  identifier: "MetadataAttributeValue",
}) as any as S.Schema<MetadataAttributeValue>;
export interface IngestionJobSummary {
  knowledgeBaseId: string;
  dataSourceId: string;
  ingestionJobId: string;
  description?: string;
  status: string;
  startedAt: Date;
  updatedAt: Date;
  statistics?: IngestionJobStatistics;
}
export const IngestionJobSummary = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    dataSourceId: S.String,
    ingestionJobId: S.String,
    description: S.optional(S.String),
    status: S.String,
    startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    statistics: S.optional(IngestionJobStatistics),
  }),
).annotations({
  identifier: "IngestionJobSummary",
}) as any as S.Schema<IngestionJobSummary>;
export type IngestionJobSummaries = IngestionJobSummary[];
export const IngestionJobSummaries = S.Array(IngestionJobSummary);
export interface CyclicConnectionFlowValidationDetails {
  connection: string;
}
export const CyclicConnectionFlowValidationDetails = S.suspend(() =>
  S.Struct({ connection: S.String }),
).annotations({
  identifier: "CyclicConnectionFlowValidationDetails",
}) as any as S.Schema<CyclicConnectionFlowValidationDetails>;
export interface DuplicateConnectionsFlowValidationDetails {
  source: string;
  target: string;
}
export const DuplicateConnectionsFlowValidationDetails = S.suspend(() =>
  S.Struct({ source: S.String, target: S.String }),
).annotations({
  identifier: "DuplicateConnectionsFlowValidationDetails",
}) as any as S.Schema<DuplicateConnectionsFlowValidationDetails>;
export interface DuplicateConditionExpressionFlowValidationDetails {
  node: string;
  expression: string | Redacted.Redacted<string>;
}
export const DuplicateConditionExpressionFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String, expression: SensitiveString }),
).annotations({
  identifier: "DuplicateConditionExpressionFlowValidationDetails",
}) as any as S.Schema<DuplicateConditionExpressionFlowValidationDetails>;
export interface UnreachableNodeFlowValidationDetails {
  node: string;
}
export const UnreachableNodeFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String }),
).annotations({
  identifier: "UnreachableNodeFlowValidationDetails",
}) as any as S.Schema<UnreachableNodeFlowValidationDetails>;
export interface UnknownConnectionSourceFlowValidationDetails {
  connection: string;
}
export const UnknownConnectionSourceFlowValidationDetails = S.suspend(() =>
  S.Struct({ connection: S.String }),
).annotations({
  identifier: "UnknownConnectionSourceFlowValidationDetails",
}) as any as S.Schema<UnknownConnectionSourceFlowValidationDetails>;
export interface UnknownConnectionSourceOutputFlowValidationDetails {
  connection: string;
}
export const UnknownConnectionSourceOutputFlowValidationDetails = S.suspend(
  () => S.Struct({ connection: S.String }),
).annotations({
  identifier: "UnknownConnectionSourceOutputFlowValidationDetails",
}) as any as S.Schema<UnknownConnectionSourceOutputFlowValidationDetails>;
export interface UnknownConnectionTargetFlowValidationDetails {
  connection: string;
}
export const UnknownConnectionTargetFlowValidationDetails = S.suspend(() =>
  S.Struct({ connection: S.String }),
).annotations({
  identifier: "UnknownConnectionTargetFlowValidationDetails",
}) as any as S.Schema<UnknownConnectionTargetFlowValidationDetails>;
export interface UnknownConnectionTargetInputFlowValidationDetails {
  connection: string;
}
export const UnknownConnectionTargetInputFlowValidationDetails = S.suspend(() =>
  S.Struct({ connection: S.String }),
).annotations({
  identifier: "UnknownConnectionTargetInputFlowValidationDetails",
}) as any as S.Schema<UnknownConnectionTargetInputFlowValidationDetails>;
export interface UnknownConnectionConditionFlowValidationDetails {
  connection: string;
}
export const UnknownConnectionConditionFlowValidationDetails = S.suspend(() =>
  S.Struct({ connection: S.String }),
).annotations({
  identifier: "UnknownConnectionConditionFlowValidationDetails",
}) as any as S.Schema<UnknownConnectionConditionFlowValidationDetails>;
export interface MalformedConditionExpressionFlowValidationDetails {
  node: string;
  condition: string;
  cause: string;
}
export const MalformedConditionExpressionFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String, condition: S.String, cause: S.String }),
).annotations({
  identifier: "MalformedConditionExpressionFlowValidationDetails",
}) as any as S.Schema<MalformedConditionExpressionFlowValidationDetails>;
export interface MalformedNodeInputExpressionFlowValidationDetails {
  node: string;
  input: string;
  cause: string;
}
export const MalformedNodeInputExpressionFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String, input: S.String, cause: S.String }),
).annotations({
  identifier: "MalformedNodeInputExpressionFlowValidationDetails",
}) as any as S.Schema<MalformedNodeInputExpressionFlowValidationDetails>;
export interface MismatchedNodeInputTypeFlowValidationDetails {
  node: string;
  input: string;
  expectedType: string;
}
export const MismatchedNodeInputTypeFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String, input: S.String, expectedType: S.String }),
).annotations({
  identifier: "MismatchedNodeInputTypeFlowValidationDetails",
}) as any as S.Schema<MismatchedNodeInputTypeFlowValidationDetails>;
export interface MismatchedNodeOutputTypeFlowValidationDetails {
  node: string;
  output: string;
  expectedType: string;
}
export const MismatchedNodeOutputTypeFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String, output: S.String, expectedType: S.String }),
).annotations({
  identifier: "MismatchedNodeOutputTypeFlowValidationDetails",
}) as any as S.Schema<MismatchedNodeOutputTypeFlowValidationDetails>;
export interface IncompatibleConnectionDataTypeFlowValidationDetails {
  connection: string;
}
export const IncompatibleConnectionDataTypeFlowValidationDetails = S.suspend(
  () => S.Struct({ connection: S.String }),
).annotations({
  identifier: "IncompatibleConnectionDataTypeFlowValidationDetails",
}) as any as S.Schema<IncompatibleConnectionDataTypeFlowValidationDetails>;
export interface MissingConnectionConfigurationFlowValidationDetails {
  connection: string;
}
export const MissingConnectionConfigurationFlowValidationDetails = S.suspend(
  () => S.Struct({ connection: S.String }),
).annotations({
  identifier: "MissingConnectionConfigurationFlowValidationDetails",
}) as any as S.Schema<MissingConnectionConfigurationFlowValidationDetails>;
export interface MissingDefaultConditionFlowValidationDetails {
  node: string;
}
export const MissingDefaultConditionFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String }),
).annotations({
  identifier: "MissingDefaultConditionFlowValidationDetails",
}) as any as S.Schema<MissingDefaultConditionFlowValidationDetails>;
export interface MissingNodeConfigurationFlowValidationDetails {
  node: string;
}
export const MissingNodeConfigurationFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String }),
).annotations({
  identifier: "MissingNodeConfigurationFlowValidationDetails",
}) as any as S.Schema<MissingNodeConfigurationFlowValidationDetails>;
export interface MissingNodeInputFlowValidationDetails {
  node: string;
  input: string;
}
export const MissingNodeInputFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String, input: S.String }),
).annotations({
  identifier: "MissingNodeInputFlowValidationDetails",
}) as any as S.Schema<MissingNodeInputFlowValidationDetails>;
export interface MissingNodeOutputFlowValidationDetails {
  node: string;
  output: string;
}
export const MissingNodeOutputFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String, output: S.String }),
).annotations({
  identifier: "MissingNodeOutputFlowValidationDetails",
}) as any as S.Schema<MissingNodeOutputFlowValidationDetails>;
export interface MultipleNodeInputConnectionsFlowValidationDetails {
  node: string;
  input: string;
}
export const MultipleNodeInputConnectionsFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String, input: S.String }),
).annotations({
  identifier: "MultipleNodeInputConnectionsFlowValidationDetails",
}) as any as S.Schema<MultipleNodeInputConnectionsFlowValidationDetails>;
export interface UnfulfilledNodeInputFlowValidationDetails {
  node: string;
  input: string;
}
export const UnfulfilledNodeInputFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String, input: S.String }),
).annotations({
  identifier: "UnfulfilledNodeInputFlowValidationDetails",
}) as any as S.Schema<UnfulfilledNodeInputFlowValidationDetails>;
export interface UnsatisfiedConnectionConditionsFlowValidationDetails {
  connection: string;
}
export const UnsatisfiedConnectionConditionsFlowValidationDetails = S.suspend(
  () => S.Struct({ connection: S.String }),
).annotations({
  identifier: "UnsatisfiedConnectionConditionsFlowValidationDetails",
}) as any as S.Schema<UnsatisfiedConnectionConditionsFlowValidationDetails>;
export interface UnknownNodeInputFlowValidationDetails {
  node: string;
  input: string;
}
export const UnknownNodeInputFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String, input: S.String }),
).annotations({
  identifier: "UnknownNodeInputFlowValidationDetails",
}) as any as S.Schema<UnknownNodeInputFlowValidationDetails>;
export interface UnknownNodeOutputFlowValidationDetails {
  node: string;
  output: string;
}
export const UnknownNodeOutputFlowValidationDetails = S.suspend(() =>
  S.Struct({ node: S.String, output: S.String }),
).annotations({
  identifier: "UnknownNodeOutputFlowValidationDetails",
}) as any as S.Schema<UnknownNodeOutputFlowValidationDetails>;
export interface MissingLoopInputNodeFlowValidationDetails {
  loopNode: string;
}
export const MissingLoopInputNodeFlowValidationDetails = S.suspend(() =>
  S.Struct({ loopNode: S.String }),
).annotations({
  identifier: "MissingLoopInputNodeFlowValidationDetails",
}) as any as S.Schema<MissingLoopInputNodeFlowValidationDetails>;
export interface MissingLoopControllerNodeFlowValidationDetails {
  loopNode: string;
}
export const MissingLoopControllerNodeFlowValidationDetails = S.suspend(() =>
  S.Struct({ loopNode: S.String }),
).annotations({
  identifier: "MissingLoopControllerNodeFlowValidationDetails",
}) as any as S.Schema<MissingLoopControllerNodeFlowValidationDetails>;
export interface MultipleLoopInputNodesFlowValidationDetails {
  loopNode: string;
}
export const MultipleLoopInputNodesFlowValidationDetails = S.suspend(() =>
  S.Struct({ loopNode: S.String }),
).annotations({
  identifier: "MultipleLoopInputNodesFlowValidationDetails",
}) as any as S.Schema<MultipleLoopInputNodesFlowValidationDetails>;
export interface MultipleLoopControllerNodesFlowValidationDetails {
  loopNode: string;
}
export const MultipleLoopControllerNodesFlowValidationDetails = S.suspend(() =>
  S.Struct({ loopNode: S.String }),
).annotations({
  identifier: "MultipleLoopControllerNodesFlowValidationDetails",
}) as any as S.Schema<MultipleLoopControllerNodesFlowValidationDetails>;
export interface LoopIncompatibleNodeTypeFlowValidationDetails {
  node: string;
  incompatibleNodeType: string;
  incompatibleNodeName: string;
}
export const LoopIncompatibleNodeTypeFlowValidationDetails = S.suspend(() =>
  S.Struct({
    node: S.String,
    incompatibleNodeType: S.String,
    incompatibleNodeName: S.String,
  }),
).annotations({
  identifier: "LoopIncompatibleNodeTypeFlowValidationDetails",
}) as any as S.Schema<LoopIncompatibleNodeTypeFlowValidationDetails>;
export interface InvalidLoopBoundaryFlowValidationDetails {
  connection: string;
  source: string;
  target: string;
}
export const InvalidLoopBoundaryFlowValidationDetails = S.suspend(() =>
  S.Struct({ connection: S.String, source: S.String, target: S.String }),
).annotations({
  identifier: "InvalidLoopBoundaryFlowValidationDetails",
}) as any as S.Schema<InvalidLoopBoundaryFlowValidationDetails>;
export interface MetadataAttribute {
  key: string | Redacted.Redacted<string>;
  value: MetadataAttributeValue;
}
export const MetadataAttribute = S.suspend(() =>
  S.Struct({ key: SensitiveString, value: MetadataAttributeValue }),
).annotations({
  identifier: "MetadataAttribute",
}) as any as S.Schema<MetadataAttribute>;
export type MetadataAttributes = MetadataAttribute[];
export const MetadataAttributes = S.Array(MetadataAttribute);
export interface KnowledgeBasePromptTemplate {
  textPromptTemplate?: string | Redacted.Redacted<string>;
}
export const KnowledgeBasePromptTemplate = S.suspend(() =>
  S.Struct({ textPromptTemplate: S.optional(SensitiveString) }),
).annotations({
  identifier: "KnowledgeBasePromptTemplate",
}) as any as S.Schema<KnowledgeBasePromptTemplate>;
export type FlowConditions = FlowCondition[];
export const FlowConditions = S.Array(FlowCondition);
export interface CreateAgentRequest {
  agentName: string;
  clientToken?: string;
  instruction?: string | Redacted.Redacted<string>;
  foundationModel?: string;
  description?: string;
  orchestrationType?: string;
  customOrchestration?: CustomOrchestration;
  idleSessionTTLInSeconds?: number;
  agentResourceRoleArn?: string;
  customerEncryptionKeyArn?: string;
  tags?: TagsMap;
  promptOverrideConfiguration?: PromptOverrideConfiguration;
  guardrailConfiguration?: GuardrailConfiguration;
  memoryConfiguration?: MemoryConfiguration;
  agentCollaboration?: string;
}
export const CreateAgentRequest = S.suspend(() =>
  S.Struct({
    agentName: S.String,
    clientToken: S.optional(S.String),
    instruction: S.optional(SensitiveString),
    foundationModel: S.optional(S.String),
    description: S.optional(S.String),
    orchestrationType: S.optional(S.String),
    customOrchestration: S.optional(CustomOrchestration),
    idleSessionTTLInSeconds: S.optional(S.Number),
    agentResourceRoleArn: S.optional(S.String),
    customerEncryptionKeyArn: S.optional(S.String),
    tags: S.optional(TagsMap),
    promptOverrideConfiguration: S.optional(PromptOverrideConfiguration),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
    memoryConfiguration: S.optional(MemoryConfiguration),
    agentCollaboration: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/agents/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAgentRequest",
}) as any as S.Schema<CreateAgentRequest>;
export interface GetAgentAliasResponse {
  agentAlias: AgentAlias;
}
export const GetAgentAliasResponse = S.suspend(() =>
  S.Struct({ agentAlias: AgentAlias }),
).annotations({
  identifier: "GetAgentAliasResponse",
}) as any as S.Schema<GetAgentAliasResponse>;
export interface GetIngestionJobResponse {
  ingestionJob: IngestionJob;
}
export const GetIngestionJobResponse = S.suspend(() =>
  S.Struct({ ingestionJob: IngestionJob }),
).annotations({
  identifier: "GetIngestionJobResponse",
}) as any as S.Schema<GetIngestionJobResponse>;
export interface ListIngestionJobsResponse {
  ingestionJobSummaries: IngestionJobSummaries;
  nextToken?: string;
}
export const ListIngestionJobsResponse = S.suspend(() =>
  S.Struct({
    ingestionJobSummaries: IngestionJobSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIngestionJobsResponse",
}) as any as S.Schema<ListIngestionJobsResponse>;
export interface DeleteKnowledgeBaseDocumentsResponse {
  documentDetails?: KnowledgeBaseDocumentDetails;
}
export const DeleteKnowledgeBaseDocumentsResponse = S.suspend(() =>
  S.Struct({ documentDetails: S.optional(KnowledgeBaseDocumentDetails) }),
).annotations({
  identifier: "DeleteKnowledgeBaseDocumentsResponse",
}) as any as S.Schema<DeleteKnowledgeBaseDocumentsResponse>;
export interface ByteContentDoc {
  mimeType: string;
  data: Uint8Array | Redacted.Redacted<Uint8Array>;
}
export const ByteContentDoc = S.suspend(() =>
  S.Struct({ mimeType: S.String, data: SensitiveBlob }),
).annotations({
  identifier: "ByteContentDoc",
}) as any as S.Schema<ByteContentDoc>;
export interface TextContentDoc {
  data: string | Redacted.Redacted<string>;
}
export const TextContentDoc = S.suspend(() =>
  S.Struct({ data: SensitiveString }),
).annotations({
  identifier: "TextContentDoc",
}) as any as S.Schema<TextContentDoc>;
export type FlowValidationDetails =
  | { cyclicConnection: CyclicConnectionFlowValidationDetails }
  | { duplicateConnections: DuplicateConnectionsFlowValidationDetails }
  | {
      duplicateConditionExpression: DuplicateConditionExpressionFlowValidationDetails;
    }
  | { unreachableNode: UnreachableNodeFlowValidationDetails }
  | { unknownConnectionSource: UnknownConnectionSourceFlowValidationDetails }
  | {
      unknownConnectionSourceOutput: UnknownConnectionSourceOutputFlowValidationDetails;
    }
  | { unknownConnectionTarget: UnknownConnectionTargetFlowValidationDetails }
  | {
      unknownConnectionTargetInput: UnknownConnectionTargetInputFlowValidationDetails;
    }
  | {
      unknownConnectionCondition: UnknownConnectionConditionFlowValidationDetails;
    }
  | {
      malformedConditionExpression: MalformedConditionExpressionFlowValidationDetails;
    }
  | {
      malformedNodeInputExpression: MalformedNodeInputExpressionFlowValidationDetails;
    }
  | { mismatchedNodeInputType: MismatchedNodeInputTypeFlowValidationDetails }
  | { mismatchedNodeOutputType: MismatchedNodeOutputTypeFlowValidationDetails }
  | {
      incompatibleConnectionDataType: IncompatibleConnectionDataTypeFlowValidationDetails;
    }
  | {
      missingConnectionConfiguration: MissingConnectionConfigurationFlowValidationDetails;
    }
  | { missingDefaultCondition: MissingDefaultConditionFlowValidationDetails }
  | { missingEndingNodes: MissingEndingNodesFlowValidationDetails }
  | { missingNodeConfiguration: MissingNodeConfigurationFlowValidationDetails }
  | { missingNodeInput: MissingNodeInputFlowValidationDetails }
  | { missingNodeOutput: MissingNodeOutputFlowValidationDetails }
  | { missingStartingNodes: MissingStartingNodesFlowValidationDetails }
  | {
      multipleNodeInputConnections: MultipleNodeInputConnectionsFlowValidationDetails;
    }
  | { unfulfilledNodeInput: UnfulfilledNodeInputFlowValidationDetails }
  | {
      unsatisfiedConnectionConditions: UnsatisfiedConnectionConditionsFlowValidationDetails;
    }
  | { unspecified: UnspecifiedFlowValidationDetails }
  | { unknownNodeInput: UnknownNodeInputFlowValidationDetails }
  | { unknownNodeOutput: UnknownNodeOutputFlowValidationDetails }
  | { missingLoopInputNode: MissingLoopInputNodeFlowValidationDetails }
  | {
      missingLoopControllerNode: MissingLoopControllerNodeFlowValidationDetails;
    }
  | { multipleLoopInputNodes: MultipleLoopInputNodesFlowValidationDetails }
  | {
      multipleLoopControllerNodes: MultipleLoopControllerNodesFlowValidationDetails;
    }
  | { loopIncompatibleNodeType: LoopIncompatibleNodeTypeFlowValidationDetails }
  | { invalidLoopBoundary: InvalidLoopBoundaryFlowValidationDetails };
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
export interface DocumentMetadata {
  type: string;
  inlineAttributes?: MetadataAttributes;
  s3Location?: CustomS3Location;
}
export const DocumentMetadata = S.suspend(() =>
  S.Struct({
    type: S.String,
    inlineAttributes: S.optional(MetadataAttributes),
    s3Location: S.optional(CustomS3Location),
  }),
).annotations({
  identifier: "DocumentMetadata",
}) as any as S.Schema<DocumentMetadata>;
export interface ConditionFlowNodeConfiguration {
  conditions: FlowConditions;
}
export const ConditionFlowNodeConfiguration = S.suspend(() =>
  S.Struct({ conditions: FlowConditions }),
).annotations({
  identifier: "ConditionFlowNodeConfiguration",
}) as any as S.Schema<ConditionFlowNodeConfiguration>;
export interface InlineContent {
  type: string;
  byteContent?: ByteContentDoc;
  textContent?: TextContentDoc;
}
export const InlineContent = S.suspend(() =>
  S.Struct({
    type: S.String,
    byteContent: S.optional(ByteContentDoc),
    textContent: S.optional(TextContentDoc),
  }),
).annotations({
  identifier: "InlineContent",
}) as any as S.Schema<InlineContent>;
export type AdditionalModelRequestFields = { [key: string]: any };
export const AdditionalModelRequestFields = S.Record({
  key: S.String,
  value: S.Any,
});
export interface PerformanceConfiguration {
  latency?: string;
}
export const PerformanceConfiguration = S.suspend(() =>
  S.Struct({ latency: S.optional(S.String) }),
).annotations({
  identifier: "PerformanceConfiguration",
}) as any as S.Schema<PerformanceConfiguration>;
export interface PromptFlowNodeResourceConfiguration {
  promptArn: string;
}
export const PromptFlowNodeResourceConfiguration = S.suspend(() =>
  S.Struct({ promptArn: S.String }),
).annotations({
  identifier: "PromptFlowNodeResourceConfiguration",
}) as any as S.Schema<PromptFlowNodeResourceConfiguration>;
export interface PromptFlowNodeInlineConfiguration {
  templateType: string;
  templateConfiguration: (typeof PromptTemplateConfiguration)["Type"];
  modelId: string;
  inferenceConfiguration?: (typeof PromptInferenceConfiguration)["Type"];
  additionalModelRequestFields?: any;
}
export const PromptFlowNodeInlineConfiguration = S.suspend(() =>
  S.Struct({
    templateType: S.String,
    templateConfiguration: PromptTemplateConfiguration,
    modelId: S.String,
    inferenceConfiguration: S.optional(PromptInferenceConfiguration),
    additionalModelRequestFields: S.optional(S.Any),
  }),
).annotations({
  identifier: "PromptFlowNodeInlineConfiguration",
}) as any as S.Schema<PromptFlowNodeInlineConfiguration>;
export interface StorageFlowNodeS3Configuration {
  bucketName: string;
}
export const StorageFlowNodeS3Configuration = S.suspend(() =>
  S.Struct({ bucketName: S.String }),
).annotations({
  identifier: "StorageFlowNodeS3Configuration",
}) as any as S.Schema<StorageFlowNodeS3Configuration>;
export interface RetrievalFlowNodeS3Configuration {
  bucketName: string;
}
export const RetrievalFlowNodeS3Configuration = S.suspend(() =>
  S.Struct({ bucketName: S.String }),
).annotations({
  identifier: "RetrievalFlowNodeS3Configuration",
}) as any as S.Schema<RetrievalFlowNodeS3Configuration>;
export interface FlowValidation {
  message: string;
  severity: string;
  details?: (typeof FlowValidationDetails)["Type"];
  type?: string;
}
export const FlowValidation = S.suspend(() =>
  S.Struct({
    message: S.String,
    severity: S.String,
    details: S.optional(FlowValidationDetails),
    type: S.optional(S.String),
  }),
).annotations({
  identifier: "FlowValidation",
}) as any as S.Schema<FlowValidation>;
export type FlowValidations = FlowValidation[];
export const FlowValidations = S.Array(FlowValidation);
export interface CustomContent {
  customDocumentIdentifier: CustomDocumentIdentifier;
  sourceType: string;
  s3Location?: CustomS3Location;
  inlineContent?: InlineContent;
}
export const CustomContent = S.suspend(() =>
  S.Struct({
    customDocumentIdentifier: CustomDocumentIdentifier,
    sourceType: S.String,
    s3Location: S.optional(CustomS3Location),
    inlineContent: S.optional(InlineContent),
  }),
).annotations({
  identifier: "CustomContent",
}) as any as S.Schema<CustomContent>;
export interface KnowledgeBaseOrchestrationConfiguration {
  promptTemplate?: KnowledgeBasePromptTemplate;
  inferenceConfig?: (typeof PromptInferenceConfiguration)["Type"];
  additionalModelRequestFields?: AdditionalModelRequestFields;
  performanceConfig?: PerformanceConfiguration;
}
export const KnowledgeBaseOrchestrationConfiguration = S.suspend(() =>
  S.Struct({
    promptTemplate: S.optional(KnowledgeBasePromptTemplate),
    inferenceConfig: S.optional(PromptInferenceConfiguration),
    additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
    performanceConfig: S.optional(PerformanceConfiguration),
  }),
).annotations({
  identifier: "KnowledgeBaseOrchestrationConfiguration",
}) as any as S.Schema<KnowledgeBaseOrchestrationConfiguration>;
export type PromptFlowNodeSourceConfiguration =
  | { resource: PromptFlowNodeResourceConfiguration }
  | { inline: PromptFlowNodeInlineConfiguration };
export const PromptFlowNodeSourceConfiguration = S.Union(
  S.Struct({ resource: PromptFlowNodeResourceConfiguration }),
  S.Struct({ inline: PromptFlowNodeInlineConfiguration }),
);
export type StorageFlowNodeServiceConfiguration = {
  s3: StorageFlowNodeS3Configuration;
};
export const StorageFlowNodeServiceConfiguration = S.Union(
  S.Struct({ s3: StorageFlowNodeS3Configuration }),
);
export type RetrievalFlowNodeServiceConfiguration = {
  s3: RetrievalFlowNodeS3Configuration;
};
export const RetrievalFlowNodeServiceConfiguration = S.Union(
  S.Struct({ s3: RetrievalFlowNodeS3Configuration }),
);
export interface CreateAgentActionGroupRequest {
  agentId: string;
  agentVersion: string;
  actionGroupName: string;
  clientToken?: string;
  description?: string;
  parentActionGroupSignature?: string;
  parentActionGroupSignatureParams?: ActionGroupSignatureParams;
  actionGroupExecutor?: (typeof ActionGroupExecutor)["Type"];
  apiSchema?: (typeof APISchema)["Type"];
  actionGroupState?: string;
  functionSchema?: (typeof FunctionSchema)["Type"];
}
export const CreateAgentActionGroupRequest = S.suspend(() =>
  S.Struct({
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    actionGroupName: S.String,
    clientToken: S.optional(S.String),
    description: S.optional(S.String),
    parentActionGroupSignature: S.optional(S.String),
    parentActionGroupSignatureParams: S.optional(ActionGroupSignatureParams),
    actionGroupExecutor: S.optional(ActionGroupExecutor),
    apiSchema: S.optional(APISchema),
    actionGroupState: S.optional(S.String),
    functionSchema: S.optional(FunctionSchema),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/agents/{agentId}/agentversions/{agentVersion}/actiongroups/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAgentActionGroupRequest",
}) as any as S.Schema<CreateAgentActionGroupRequest>;
export interface CreateAgentResponse {
  agent: Agent;
}
export const CreateAgentResponse = S.suspend(() =>
  S.Struct({ agent: Agent }),
).annotations({
  identifier: "CreateAgentResponse",
}) as any as S.Schema<CreateAgentResponse>;
export interface GetFlowResponse {
  name: string;
  description?: string;
  executionRoleArn: string;
  customerEncryptionKeyArn?: string;
  id: string;
  arn: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  definition?: FlowDefinition;
  validations?: FlowValidations;
}
export const GetFlowResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    executionRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    id: S.String,
    arn: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    version: S.String,
    definition: S.optional(FlowDefinition),
    validations: S.optional(FlowValidations),
  }),
).annotations({
  identifier: "GetFlowResponse",
}) as any as S.Schema<GetFlowResponse>;
export interface VectorSearchBedrockRerankingModelConfiguration {
  modelArn: string;
  additionalModelRequestFields?: AdditionalModelRequestFields;
}
export const VectorSearchBedrockRerankingModelConfiguration = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
  }),
).annotations({
  identifier: "VectorSearchBedrockRerankingModelConfiguration",
}) as any as S.Schema<VectorSearchBedrockRerankingModelConfiguration>;
export interface DocumentContent {
  dataSourceType: string;
  custom?: CustomContent;
  s3?: S3Content;
}
export const DocumentContent = S.suspend(() =>
  S.Struct({
    dataSourceType: S.String,
    custom: S.optional(CustomContent),
    s3: S.optional(S3Content),
  }),
).annotations({
  identifier: "DocumentContent",
}) as any as S.Schema<DocumentContent>;
export interface PromptFlowNodeConfiguration {
  sourceConfiguration: (typeof PromptFlowNodeSourceConfiguration)["Type"];
  guardrailConfiguration?: GuardrailConfiguration;
}
export const PromptFlowNodeConfiguration = S.suspend(() =>
  S.Struct({
    sourceConfiguration: PromptFlowNodeSourceConfiguration,
    guardrailConfiguration: S.optional(GuardrailConfiguration),
  }),
).annotations({
  identifier: "PromptFlowNodeConfiguration",
}) as any as S.Schema<PromptFlowNodeConfiguration>;
export interface StorageFlowNodeConfiguration {
  serviceConfiguration: (typeof StorageFlowNodeServiceConfiguration)["Type"];
}
export const StorageFlowNodeConfiguration = S.suspend(() =>
  S.Struct({ serviceConfiguration: StorageFlowNodeServiceConfiguration }),
).annotations({
  identifier: "StorageFlowNodeConfiguration",
}) as any as S.Schema<StorageFlowNodeConfiguration>;
export interface RetrievalFlowNodeConfiguration {
  serviceConfiguration: (typeof RetrievalFlowNodeServiceConfiguration)["Type"];
}
export const RetrievalFlowNodeConfiguration = S.suspend(() =>
  S.Struct({ serviceConfiguration: RetrievalFlowNodeServiceConfiguration }),
).annotations({
  identifier: "RetrievalFlowNodeConfiguration",
}) as any as S.Schema<RetrievalFlowNodeConfiguration>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface KnowledgeBaseDocument {
  metadata?: DocumentMetadata;
  content: DocumentContent;
}
export const KnowledgeBaseDocument = S.suspend(() =>
  S.Struct({
    metadata: S.optional(DocumentMetadata),
    content: DocumentContent,
  }),
).annotations({
  identifier: "KnowledgeBaseDocument",
}) as any as S.Schema<KnowledgeBaseDocument>;
export type KnowledgeBaseDocuments = KnowledgeBaseDocument[];
export const KnowledgeBaseDocuments = S.Array(KnowledgeBaseDocument);
export interface CreateAgentActionGroupResponse {
  agentActionGroup: AgentActionGroup;
}
export const CreateAgentActionGroupResponse = S.suspend(() =>
  S.Struct({ agentActionGroup: AgentActionGroup }),
).annotations({
  identifier: "CreateAgentActionGroupResponse",
}) as any as S.Schema<CreateAgentActionGroupResponse>;
export interface IngestKnowledgeBaseDocumentsRequest {
  knowledgeBaseId: string;
  dataSourceId: string;
  clientToken?: string;
  documents: KnowledgeBaseDocuments;
}
export const IngestKnowledgeBaseDocumentsRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    clientToken: S.optional(S.String),
    documents: KnowledgeBaseDocuments,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/{dataSourceId}/documents",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "IngestKnowledgeBaseDocumentsRequest",
}) as any as S.Schema<IngestKnowledgeBaseDocumentsRequest>;
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
  | { fieldsToInclude: FieldsForReranking }
  | { fieldsToExclude: FieldsForReranking };
export const RerankingMetadataSelectiveModeConfiguration = S.Union(
  S.Struct({ fieldsToInclude: FieldsForReranking }),
  S.Struct({ fieldsToExclude: FieldsForReranking }),
);
export interface CreateDataSourceRequest {
  knowledgeBaseId: string;
  clientToken?: string;
  name: string;
  description?: string;
  dataSourceConfiguration: DataSourceConfiguration;
  dataDeletionPolicy?: string;
  serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
  vectorIngestionConfiguration?: VectorIngestionConfiguration;
}
export const CreateDataSourceRequest = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    clientToken: S.optional(S.String),
    name: S.String,
    description: S.optional(S.String),
    dataSourceConfiguration: DataSourceConfiguration,
    dataDeletionPolicy: S.optional(S.String),
    serverSideEncryptionConfiguration: S.optional(
      ServerSideEncryptionConfiguration,
    ),
    vectorIngestionConfiguration: S.optional(VectorIngestionConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/knowledgebases/{knowledgeBaseId}/datasources/",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataSourceRequest",
}) as any as S.Schema<CreateDataSourceRequest>;
export interface IngestKnowledgeBaseDocumentsResponse {
  documentDetails?: KnowledgeBaseDocumentDetails;
}
export const IngestKnowledgeBaseDocumentsResponse = S.suspend(() =>
  S.Struct({ documentDetails: S.optional(KnowledgeBaseDocumentDetails) }),
).annotations({
  identifier: "IngestKnowledgeBaseDocumentsResponse",
}) as any as S.Schema<IngestKnowledgeBaseDocumentsResponse>;
export interface MetadataConfigurationForReranking {
  selectionMode: string;
  selectiveModeConfiguration?: (typeof RerankingMetadataSelectiveModeConfiguration)["Type"];
}
export const MetadataConfigurationForReranking = S.suspend(() =>
  S.Struct({
    selectionMode: S.String,
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
  type: string;
  bedrockRerankingConfiguration?: VectorSearchBedrockRerankingConfiguration;
}
export const VectorSearchRerankingConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    bedrockRerankingConfiguration: S.optional(
      VectorSearchBedrockRerankingConfiguration,
    ),
  }),
).annotations({
  identifier: "VectorSearchRerankingConfiguration",
}) as any as S.Schema<VectorSearchRerankingConfiguration>;
export interface CreateDataSourceResponse {
  dataSource: DataSource;
}
export const CreateDataSourceResponse = S.suspend(() =>
  S.Struct({ dataSource: DataSource }),
).annotations({
  identifier: "CreateDataSourceResponse",
}) as any as S.Schema<CreateDataSourceResponse>;
export interface CreateKnowledgeBaseRequest {
  clientToken?: string;
  name: string;
  description?: string;
  roleArn: string;
  knowledgeBaseConfiguration: KnowledgeBaseConfiguration;
  storageConfiguration?: StorageConfiguration;
  tags?: TagsMap;
}
export const CreateKnowledgeBaseRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    name: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    knowledgeBaseConfiguration: KnowledgeBaseConfiguration,
    storageConfiguration: S.optional(StorageConfiguration),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/knowledgebases/" }),
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
export interface CreatePromptRequest {
  name: string;
  description?: string;
  customerEncryptionKeyArn?: string;
  defaultVariant?: string;
  variants?: PromptVariantList;
  clientToken?: string;
  tags?: TagsMap;
}
export const CreatePromptRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    customerEncryptionKeyArn: S.optional(S.String),
    defaultVariant: S.optional(S.String),
    variants: S.optional(PromptVariantList),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prompts/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePromptRequest",
}) as any as S.Schema<CreatePromptRequest>;
export interface KnowledgeBaseFlowNodeConfiguration {
  knowledgeBaseId: string;
  modelId?: string;
  guardrailConfiguration?: GuardrailConfiguration;
  numberOfResults?: number;
  promptTemplate?: KnowledgeBasePromptTemplate;
  inferenceConfiguration?: (typeof PromptInferenceConfiguration)["Type"];
  rerankingConfiguration?: VectorSearchRerankingConfiguration;
  orchestrationConfiguration?: KnowledgeBaseOrchestrationConfiguration;
}
export const KnowledgeBaseFlowNodeConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "KnowledgeBaseFlowNodeConfiguration",
}) as any as S.Schema<KnowledgeBaseFlowNodeConfiguration>;
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
    ).annotations({ identifier: "LoopFlowNodeConfiguration" }),
  }),
  S.Struct({ loopInput: LoopInputFlowNodeConfiguration }),
  S.Struct({ loopController: LoopControllerFlowNodeConfiguration }),
) as any as S.Schema<FlowNodeConfiguration>;
export interface CreateKnowledgeBaseResponse {
  knowledgeBase: KnowledgeBase;
}
export const CreateKnowledgeBaseResponse = S.suspend(() =>
  S.Struct({ knowledgeBase: KnowledgeBase }),
).annotations({
  identifier: "CreateKnowledgeBaseResponse",
}) as any as S.Schema<CreateKnowledgeBaseResponse>;
export interface CreatePromptResponse {
  name: string;
  description?: string;
  customerEncryptionKeyArn?: string;
  defaultVariant?: string;
  variants?: PromptVariantList;
  id: string;
  arn: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}
export const CreatePromptResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    customerEncryptionKeyArn: S.optional(S.String),
    defaultVariant: S.optional(S.String),
    variants: S.optional(PromptVariantList),
    id: S.String,
    arn: S.String,
    version: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreatePromptResponse",
}) as any as S.Schema<CreatePromptResponse>;
export interface FlowNode {
  name: string;
  type: string;
  configuration?: FlowNodeConfiguration;
  inputs?: FlowNodeInputs;
  outputs?: FlowNodeOutputs;
}
export const FlowNode = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: S.String,
    configuration: S.optional(
      S.suspend(() => FlowNodeConfiguration).annotations({
        identifier: "FlowNodeConfiguration",
      }),
    ),
    inputs: S.optional(FlowNodeInputs),
    outputs: S.optional(FlowNodeOutputs),
  }),
).annotations({ identifier: "FlowNode" }) as any as S.Schema<FlowNode>;
export type FlowNodes = FlowNode[];
export const FlowNodes = S.Array(
  S.suspend((): S.Schema<FlowNode, any> => FlowNode).annotations({
    identifier: "FlowNode",
  }),
) as any as S.Schema<FlowNodes>;
export interface ValidateFlowDefinitionRequest {
  definition: FlowDefinition;
}
export const ValidateFlowDefinitionRequest = S.suspend(() =>
  S.Struct({ definition: FlowDefinition }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/flows/validate-definition" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ValidateFlowDefinitionRequest",
}) as any as S.Schema<ValidateFlowDefinitionRequest>;
export interface ValidateFlowDefinitionResponse {
  validations: FlowValidations;
}
export const ValidateFlowDefinitionResponse = S.suspend(() =>
  S.Struct({ validations: FlowValidations }),
).annotations({
  identifier: "ValidateFlowDefinitionResponse",
}) as any as S.Schema<ValidateFlowDefinitionResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of flows and information about each flow. For more information, see Manage a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const listFlows: {
  (
    input: ListFlowsRequest,
  ): Effect.Effect<
    ListFlowsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFlowsRequest,
  ) => Stream.Stream<
    ListFlowsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFlowsRequest,
  ) => Stream.Stream<
    FlowSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFlowsRequest,
  output: ListFlowsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "flowSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about a data ingestion job. Data sources are ingested into your knowledge base so that Large Language Models (LLMs) can use your data.
 */
export const getIngestionJob: (
  input: GetIngestionJobRequest,
) => Effect.Effect<
  GetIngestionJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIngestionJobRequest,
  output: GetIngestionJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the data ingestion jobs for a data source. The list also includes information about each job.
 */
export const listIngestionJobs: {
  (
    input: ListIngestionJobsRequest,
  ): Effect.Effect<
    ListIngestionJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIngestionJobsRequest,
  ) => Stream.Stream<
    ListIngestionJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIngestionJobsRequest,
  ) => Stream.Stream<
    IngestionJobSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIngestionJobsRequest,
  output: ListIngestionJobsResponse,
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
    items: "ingestionJobSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a prompt flow that you can use to send an input through various steps to yield an output. Configure nodes, each of which corresponds to a step of the flow, and create connections between the nodes to create paths to different outputs. For more information, see How it works and Create a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const createFlow: (
  input: CreateFlowRequest,
) => Effect.Effect<
  CreateFlowResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFlowRequest,
  output: CreateFlowResponse,
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
 * Lists the aliases of an agent and information about each one.
 */
export const listAgentAliases: {
  (
    input: ListAgentAliasesRequest,
  ): Effect.Effect<
    ListAgentAliasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAgentAliasesRequest,
  ) => Stream.Stream<
    ListAgentAliasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAgentAliasesRequest,
  ) => Stream.Stream<
    AgentAliasSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAgentAliasesRequest,
  output: ListAgentAliasesResponse,
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
    items: "agentAliasSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about a data source.
 */
export const getDataSource: (
  input: GetDataSourceRequest,
) => Effect.Effect<
  GetDataSourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSourceRequest,
  output: GetDataSourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the data sources in a knowledge base and information about each one.
 */
export const listDataSources: {
  (
    input: ListDataSourcesRequest,
  ): Effect.Effect<
    ListDataSourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSourcesRequest,
  ) => Stream.Stream<
    ListDataSourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSourcesRequest,
  ) => Stream.Stream<
    DataSourceSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataSourcesRequest,
  output: ListDataSourcesResponse,
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
    items: "dataSourceSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an alias of a flow for deployment. For more information, see Deploy a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const createFlowAlias: (
  input: CreateFlowAliasRequest,
) => Effect.Effect<
  CreateFlowAliasResponse,
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
  input: CreateFlowAliasRequest,
  output: CreateFlowAliasResponse,
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
 * Returns a list of aliases for a flow.
 */
export const listFlowAliases: {
  (
    input: ListFlowAliasesRequest,
  ): Effect.Effect<
    ListFlowAliasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFlowAliasesRequest,
  ) => Stream.Stream<
    ListFlowAliasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFlowAliasesRequest,
  ) => Stream.Stream<
    FlowAliasSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFlowAliasesRequest,
  output: ListFlowAliasesResponse,
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
    items: "flowAliasSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of information about each flow. For more information, see Deploy a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const listFlowVersions: {
  (
    input: ListFlowVersionsRequest,
  ): Effect.Effect<
    ListFlowVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFlowVersionsRequest,
  ) => Stream.Stream<
    ListFlowVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFlowVersionsRequest,
  ) => Stream.Stream<
    FlowVersionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFlowVersionsRequest,
  output: ListFlowVersionsResponse,
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
    items: "flowVersionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves specific documents from a data source that is connected to a knowledge base. For more information, see Ingest changes directly into a knowledge base in the Amazon Bedrock User Guide.
 */
export const getKnowledgeBaseDocuments: (
  input: GetKnowledgeBaseDocumentsRequest,
) => Effect.Effect<
  GetKnowledgeBaseDocumentsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKnowledgeBaseDocumentsRequest,
  output: GetKnowledgeBaseDocumentsResponse,
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
 * Associates a knowledge base with an agent. If a knowledge base is associated and its `indexState` is set to `Enabled`, the agent queries the knowledge base for information to augment its response to the user.
 */
export const associateAgentKnowledgeBase: (
  input: AssociateAgentKnowledgeBaseRequest,
) => Effect.Effect<
  AssociateAgentKnowledgeBaseResponse,
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
  input: AssociateAgentKnowledgeBaseRequest,
  output: AssociateAgentKnowledgeBaseResponse,
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
 * Gets information about a knowledge base.
 */
export const getKnowledgeBase: (
  input: GetKnowledgeBaseRequest,
) => Effect.Effect<
  GetKnowledgeBaseResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKnowledgeBaseRequest,
  output: GetKnowledgeBaseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists knowledge bases associated with an agent and information about each one.
 */
export const listAgentKnowledgeBases: {
  (
    input: ListAgentKnowledgeBasesRequest,
  ): Effect.Effect<
    ListAgentKnowledgeBasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAgentKnowledgeBasesRequest,
  ) => Stream.Stream<
    ListAgentKnowledgeBasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAgentKnowledgeBasesRequest,
  ) => Stream.Stream<
    AgentKnowledgeBaseSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAgentKnowledgeBasesRequest,
  output: ListAgentKnowledgeBasesResponse,
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
    items: "agentKnowledgeBaseSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns either information about the working draft (`DRAFT` version) of each prompt in an account, or information about of all versions of a prompt, depending on whether you include the `promptIdentifier` field or not. For more information, see View information about prompts using Prompt management in the Amazon Bedrock User Guide.
 */
export const listPrompts: {
  (
    input: ListPromptsRequest,
  ): Effect.Effect<
    ListPromptsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPromptsRequest,
  ) => Stream.Stream<
    ListPromptsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPromptsRequest,
  ) => Stream.Stream<
    PromptSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPromptsRequest,
  output: ListPromptsResponse,
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
    items: "promptSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets details about a version of an agent.
 */
export const getAgentVersion: (
  input: GetAgentVersionRequest,
) => Effect.Effect<
  GetAgentVersionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAgentVersionRequest,
  output: GetAgentVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the versions of an agent and information about each version.
 */
export const listAgentVersions: {
  (
    input: ListAgentVersionsRequest,
  ): Effect.Effect<
    ListAgentVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAgentVersionsRequest,
  ) => Stream.Stream<
    ListAgentVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAgentVersionsRequest,
  ) => Stream.Stream<
    AgentVersionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAgentVersionsRequest,
  output: ListAgentVersionsResponse,
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
    items: "agentVersionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the configuration for an action group for an agent.
 */
export const updateAgentActionGroup: (
  input: UpdateAgentActionGroupRequest,
) => Effect.Effect<
  UpdateAgentActionGroupResponse,
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
  input: UpdateAgentActionGroupRequest,
  output: UpdateAgentActionGroupResponse,
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
 * Updates an agent's collaborator.
 */
export const updateAgentCollaborator: (
  input: UpdateAgentCollaboratorRequest,
) => Effect.Effect<
  UpdateAgentCollaboratorResponse,
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
  input: UpdateAgentCollaboratorRequest,
  output: UpdateAgentCollaboratorResponse,
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
 * Deletes an agent.
 */
export const deleteAgent: (
  input: DeleteAgentRequest,
) => Effect.Effect<
  DeleteAgentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAgentRequest,
  output: DeleteAgentResponse,
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
 * Creates a `DRAFT` version of the agent that can be used for internal testing.
 */
export const prepareAgent: (
  input: PrepareAgentRequest,
) => Effect.Effect<
  PrepareAgentResponse,
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
  input: PrepareAgentRequest,
  output: PrepareAgentResponse,
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
 * Updates the configuration of an agent.
 */
export const updateAgent: (
  input: UpdateAgentRequest,
) => Effect.Effect<
  UpdateAgentResponse,
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
  input: UpdateAgentRequest,
  output: UpdateAgentResponse,
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
 * Updates configurations for an alias of an agent.
 */
export const updateAgentAlias: (
  input: UpdateAgentAliasRequest,
) => Effect.Effect<
  UpdateAgentAliasResponse,
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
  input: UpdateAgentAliasRequest,
  output: UpdateAgentAliasResponse,
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
 * Deletes a data source from a knowledge base.
 */
export const deleteDataSource: (
  input: DeleteDataSourceRequest,
) => Effect.Effect<
  DeleteDataSourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSourceRequest,
  output: DeleteDataSourceResponse,
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
 * Updates the configurations for a data source connector.
 *
 * You can't change the `chunkingConfiguration` after you create the data source connector. Specify the existing `chunkingConfiguration`.
 */
export const updateDataSource: (
  input: UpdateDataSourceRequest,
) => Effect.Effect<
  UpdateDataSourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSourceRequest,
  output: UpdateDataSourceResponse,
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
 * Modifies a flow. Include both fields that you want to keep and fields that you want to change. For more information, see How it works and Create a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const updateFlow: (
  input: UpdateFlowRequest,
) => Effect.Effect<
  UpdateFlowResponse,
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
  input: UpdateFlowRequest,
  output: UpdateFlowResponse,
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
 * Deletes a flow.
 */
export const deleteFlow: (
  input: DeleteFlowRequest,
) => Effect.Effect<
  DeleteFlowResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFlowRequest,
  output: DeleteFlowResponse,
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
 * Prepares the `DRAFT` version of a flow so that it can be invoked. For more information, see Test a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const prepareFlow: (
  input: PrepareFlowRequest,
) => Effect.Effect<
  PrepareFlowResponse,
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
  input: PrepareFlowRequest,
  output: PrepareFlowResponse,
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
 * Modifies the alias of a flow. Include both fields that you want to keep and ones that you want to change. For more information, see Deploy a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const updateFlowAlias: (
  input: UpdateFlowAliasRequest,
) => Effect.Effect<
  UpdateFlowAliasResponse,
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
  input: UpdateFlowAliasRequest,
  output: UpdateFlowAliasResponse,
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
 * Deletes an alias of a flow.
 */
export const deleteFlowAlias: (
  input: DeleteFlowAliasRequest,
) => Effect.Effect<
  DeleteFlowAliasResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFlowAliasRequest,
  output: DeleteFlowAliasResponse,
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
 * Creates a version of the flow that you can deploy. For more information, see Deploy a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const createFlowVersion: (
  input: CreateFlowVersionRequest,
) => Effect.Effect<
  CreateFlowVersionResponse,
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
  input: CreateFlowVersionRequest,
  output: CreateFlowVersionResponse,
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
 * Deletes a version of a flow.
 */
export const deleteFlowVersion: (
  input: DeleteFlowVersionRequest,
) => Effect.Effect<
  DeleteFlowVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFlowVersionRequest,
  output: DeleteFlowVersionResponse,
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
 * Begins a data ingestion job. Data sources are ingested into your knowledge base so that Large Language Models (LLMs) can use your data.
 */
export const startIngestionJob: (
  input: StartIngestionJobRequest,
) => Effect.Effect<
  StartIngestionJobResponse,
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
  input: StartIngestionJobRequest,
  output: StartIngestionJobResponse,
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
 * Stops a currently running data ingestion job. You can send a `StartIngestionJob` request again to ingest the rest of your data when you are ready.
 */
export const stopIngestionJob: (
  input: StopIngestionJobRequest,
) => Effect.Effect<
  StopIngestionJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopIngestionJobRequest,
  output: StopIngestionJobResponse,
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
 * Deletes a knowledge base. Before deleting a knowledge base, you should disassociate the knowledge base from any agents that it is associated with by making a DisassociateAgentKnowledgeBase request.
 */
export const deleteKnowledgeBase: (
  input: DeleteKnowledgeBaseRequest,
) => Effect.Effect<
  DeleteKnowledgeBaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKnowledgeBaseRequest,
  output: DeleteKnowledgeBaseResponse,
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
 * Updates the configuration for a knowledge base that has been associated with an agent.
 */
export const updateAgentKnowledgeBase: (
  input: UpdateAgentKnowledgeBaseRequest,
) => Effect.Effect<
  UpdateAgentKnowledgeBaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAgentKnowledgeBaseRequest,
  output: UpdateAgentKnowledgeBaseResponse,
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
 * Updates the configuration of a knowledge base with the fields that you specify. Because all fields will be overwritten, you must include the same values for fields that you want to keep the same.
 *
 * You can change the following fields:
 *
 * - `name`
 *
 * - `description`
 *
 * - `roleArn`
 *
 * You can't change the `knowledgeBaseConfiguration` or `storageConfiguration` fields, so you must specify the same configurations as when you created the knowledge base. You can send a GetKnowledgeBase request and copy the same configurations.
 */
export const updateKnowledgeBase: (
  input: UpdateKnowledgeBaseRequest,
) => Effect.Effect<
  UpdateKnowledgeBaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKnowledgeBaseRequest,
  output: UpdateKnowledgeBaseResponse,
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
 * Modifies a prompt in your prompt library. Include both fields that you want to keep and fields that you want to replace. For more information, see Prompt management in Amazon Bedrock and Edit prompts in your prompt library in the Amazon Bedrock User Guide.
 */
export const updatePrompt: (
  input: UpdatePromptRequest,
) => Effect.Effect<
  UpdatePromptResponse,
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
  input: UpdatePromptRequest,
  output: UpdatePromptResponse,
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
 * Deletes a prompt or a version of it, depending on whether you include the `promptVersion` field or not. For more information, see Delete prompts from the Prompt management tool and Delete a version of a prompt from the Prompt management tool in the Amazon Bedrock User Guide.
 */
export const deletePrompt: (
  input: DeletePromptRequest,
) => Effect.Effect<
  DeletePromptResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePromptRequest,
  output: DeletePromptResponse,
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
 * Creates a static snapshot of your prompt that can be deployed to production. For more information, see Deploy prompts using Prompt management by creating versions in the Amazon Bedrock User Guide.
 */
export const createPromptVersion: (
  input: CreatePromptVersionRequest,
) => Effect.Effect<
  CreatePromptVersionResponse,
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
  input: CreatePromptVersionRequest,
  output: CreatePromptVersionResponse,
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
 * Deletes a version of an agent.
 */
export const deleteAgentVersion: (
  input: DeleteAgentVersionRequest,
) => Effect.Effect<
  DeleteAgentVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAgentVersionRequest,
  output: DeleteAgentVersionResponse,
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
 * Disassociates an agent collaborator.
 */
export const disassociateAgentCollaborator: (
  input: DisassociateAgentCollaboratorRequest,
) => Effect.Effect<
  DisassociateAgentCollaboratorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAgentCollaboratorRequest,
  output: DisassociateAgentCollaboratorResponse,
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
 * Disassociates a knowledge base from an agent.
 */
export const disassociateAgentKnowledgeBase: (
  input: DisassociateAgentKnowledgeBaseRequest,
) => Effect.Effect<
  DisassociateAgentKnowledgeBaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAgentKnowledgeBaseRequest,
  output: DisassociateAgentKnowledgeBaseResponse,
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
 * Retrieves information about a flow. For more information, see Deploy a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const getFlowAlias: (
  input: GetFlowAliasRequest,
) => Effect.Effect<
  GetFlowAliasResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFlowAliasRequest,
  output: GetFlowAliasResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a version of a flow. For more information, see Deploy a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const getFlowVersion: (
  input: GetFlowVersionRequest,
) => Effect.Effect<
  GetFlowVersionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFlowVersionRequest,
  output: GetFlowVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves all the documents contained in a data source that is connected to a knowledge base. For more information, see Ingest changes directly into a knowledge base in the Amazon Bedrock User Guide.
 */
export const listKnowledgeBaseDocuments: {
  (
    input: ListKnowledgeBaseDocumentsRequest,
  ): Effect.Effect<
    ListKnowledgeBaseDocumentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKnowledgeBaseDocumentsRequest,
  ) => Stream.Stream<
    ListKnowledgeBaseDocumentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKnowledgeBaseDocumentsRequest,
  ) => Stream.Stream<
    KnowledgeBaseDocumentDetail,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKnowledgeBaseDocumentsRequest,
  output: ListKnowledgeBaseDocumentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "documentDetails",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about a knowledge base associated with an agent.
 */
export const getAgentKnowledgeBase: (
  input: GetAgentKnowledgeBaseRequest,
) => Effect.Effect<
  GetAgentKnowledgeBaseResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAgentKnowledgeBaseRequest,
  output: GetAgentKnowledgeBaseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the working draft (`DRAFT` version) of a prompt or a version of it, depending on whether you include the `promptVersion` field or not. For more information, see View information about prompts using Prompt management and View information about a version of your prompt in the Amazon Bedrock User Guide.
 */
export const getPrompt: (
  input: GetPromptRequest,
) => Effect.Effect<
  GetPromptResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPromptRequest,
  output: GetPromptResponse,
  errors: [
    AccessDeniedException,
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
 * Deletes an action group in an agent.
 */
export const deleteAgentActionGroup: (
  input: DeleteAgentActionGroupRequest,
) => Effect.Effect<
  DeleteAgentActionGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAgentActionGroupRequest,
  output: DeleteAgentActionGroupResponse,
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
 * Gets information about an action group for an agent.
 */
export const getAgentActionGroup: (
  input: GetAgentActionGroupRequest,
) => Effect.Effect<
  GetAgentActionGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAgentActionGroupRequest,
  output: GetAgentActionGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the action groups for an agent and information about each one.
 */
export const listAgentActionGroups: {
  (
    input: ListAgentActionGroupsRequest,
  ): Effect.Effect<
    ListAgentActionGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAgentActionGroupsRequest,
  ) => Stream.Stream<
    ListAgentActionGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAgentActionGroupsRequest,
  ) => Stream.Stream<
    ActionGroupSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAgentActionGroupsRequest,
  output: ListAgentActionGroupsResponse,
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
    items: "actionGroupSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Makes an agent a collaborator for another agent.
 */
export const associateAgentCollaborator: (
  input: AssociateAgentCollaboratorRequest,
) => Effect.Effect<
  AssociateAgentCollaboratorResponse,
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
  input: AssociateAgentCollaboratorRequest,
  output: AssociateAgentCollaboratorResponse,
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
 * Retrieves information about an agent's collaborator.
 */
export const getAgentCollaborator: (
  input: GetAgentCollaboratorRequest,
) => Effect.Effect<
  GetAgentCollaboratorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAgentCollaboratorRequest,
  output: GetAgentCollaboratorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieve a list of an agent's collaborators.
 */
export const listAgentCollaborators: {
  (
    input: ListAgentCollaboratorsRequest,
  ): Effect.Effect<
    ListAgentCollaboratorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAgentCollaboratorsRequest,
  ) => Stream.Stream<
    ListAgentCollaboratorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAgentCollaboratorsRequest,
  ) => Stream.Stream<
    AgentCollaboratorSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAgentCollaboratorsRequest,
  output: ListAgentCollaboratorsResponse,
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
    items: "agentCollaboratorSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about an agent.
 */
export const getAgent: (
  input: GetAgentRequest,
) => Effect.Effect<
  GetAgentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAgentRequest,
  output: GetAgentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an alias of an agent that can be used to deploy the agent.
 */
export const createAgentAlias: (
  input: CreateAgentAliasRequest,
) => Effect.Effect<
  CreateAgentAliasResponse,
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
  input: CreateAgentAliasRequest,
  output: CreateAgentAliasResponse,
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
 * Lists the knowledge bases in an account. The list also includesinformation about each knowledge base.
 */
export const listKnowledgeBases: {
  (
    input: ListKnowledgeBasesRequest,
  ): Effect.Effect<
    ListKnowledgeBasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKnowledgeBasesRequest,
  ) => Stream.Stream<
    ListKnowledgeBasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKnowledgeBasesRequest,
  ) => Stream.Stream<
    KnowledgeBaseSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKnowledgeBasesRequest,
  output: ListKnowledgeBasesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "knowledgeBaseSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the agents belonging to an account and information about each agent.
 */
export const listAgents: {
  (
    input: ListAgentsRequest,
  ): Effect.Effect<
    ListAgentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAgentsRequest,
  ) => Stream.Stream<
    ListAgentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAgentsRequest,
  ) => Stream.Stream<
    AgentSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAgentsRequest,
  output: ListAgentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "agentSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes an alias of an agent.
 */
export const deleteAgentAlias: (
  input: DeleteAgentAliasRequest,
) => Effect.Effect<
  DeleteAgentAliasResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAgentAliasRequest,
  output: DeleteAgentAliasResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about an alias of an agent.
 */
export const getAgentAlias: (
  input: GetAgentAliasRequest,
) => Effect.Effect<
  GetAgentAliasResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAgentAliasRequest,
  output: GetAgentAliasResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes documents from a data source and syncs the changes to the knowledge base that is connected to it. For more information, see Ingest changes directly into a knowledge base in the Amazon Bedrock User Guide.
 */
export const deleteKnowledgeBaseDocuments: (
  input: DeleteKnowledgeBaseDocumentsRequest,
) => Effect.Effect<
  DeleteKnowledgeBaseDocumentsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKnowledgeBaseDocumentsRequest,
  output: DeleteKnowledgeBaseDocumentsResponse,
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
 * Creates an agent that orchestrates interactions between foundation models, data sources, software applications, user conversations, and APIs to carry out tasks to help customers.
 *
 * - Specify the following fields for security purposes.
 *
 * - `agentResourceRoleArn` – The Amazon Resource Name (ARN) of the role with permissions to invoke API operations on an agent.
 *
 * - (Optional) `customerEncryptionKeyArn` – The Amazon Resource Name (ARN) of a KMS key to encrypt the creation of the agent.
 *
 * - (Optional) `idleSessionTTLinSeconds` – Specify the number of seconds for which the agent should maintain session information. After this time expires, the subsequent `InvokeAgent` request begins a new session.
 *
 * - To enable your agent to retain conversational context across multiple sessions, include a `memoryConfiguration` object. For more information, see Configure memory.
 *
 * - To override the default prompt behavior for agent orchestration and to use advanced prompts, include a `promptOverrideConfiguration` object. For more information, see Advanced prompts.
 *
 * - If your agent fails to be created, the response returns a list of `failureReasons` alongside a list of `recommendedActions` for you to troubleshoot.
 *
 * - The agent instructions will not be honored if your agent has only one knowledge base, uses default prompts, has no action group, and user input is disabled.
 */
export const createAgent: (
  input: CreateAgentRequest,
) => Effect.Effect<
  CreateAgentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAgentRequest,
  output: CreateAgentResponse,
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
 * Retrieves information about a flow. For more information, see Manage a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const getFlow: (
  input: GetFlowRequest,
) => Effect.Effect<
  GetFlowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFlowRequest,
  output: GetFlowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an action group for an agent. An action group represents the actions that an agent can carry out for the customer by defining the APIs that an agent can call and the logic for calling them.
 *
 * To allow your agent to request the user for additional information when trying to complete a task, add an action group with the `parentActionGroupSignature` field set to `AMAZON.UserInput`.
 *
 * To allow your agent to generate, run, and troubleshoot code when trying to complete a task, add an action group with the `parentActionGroupSignature` field set to `AMAZON.CodeInterpreter`.
 *
 * You must leave the `description`, `apiSchema`, and `actionGroupExecutor` fields blank for this action group. During orchestration, if your agent determines that it needs to invoke an API in an action group, but doesn't have enough information to complete the API request, it will invoke this action group instead and return an Observation reprompting the user for more information.
 */
export const createAgentActionGroup: (
  input: CreateAgentActionGroupRequest,
) => Effect.Effect<
  CreateAgentActionGroupResponse,
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
  input: CreateAgentActionGroupRequest,
  output: CreateAgentActionGroupResponse,
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
 * Ingests documents directly into the knowledge base that is connected to the data source. The `dataSourceType` specified in the content for each document must match the type of the data source that you specify in the header. For more information, see Ingest changes directly into a knowledge base in the Amazon Bedrock User Guide.
 */
export const ingestKnowledgeBaseDocuments: (
  input: IngestKnowledgeBaseDocumentsRequest,
) => Effect.Effect<
  IngestKnowledgeBaseDocumentsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IngestKnowledgeBaseDocumentsRequest,
  output: IngestKnowledgeBaseDocumentsResponse,
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
 * Connects a knowledge base to a data source. You specify the configuration for the specific data source service in the `dataSourceConfiguration` field.
 *
 * You can't change the `chunkingConfiguration` after you create the data source connector.
 */
export const createDataSource: (
  input: CreateDataSourceRequest,
) => Effect.Effect<
  CreateDataSourceResponse,
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
  input: CreateDataSourceRequest,
  output: CreateDataSourceResponse,
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
 * Creates a knowledge base. A knowledge base contains your data sources so that Large Language Models (LLMs) can use your data. To create a knowledge base, you must first set up your data sources and configure a supported vector store. For more information, see Set up a knowledge base.
 *
 * If you prefer to let Amazon Bedrock create and manage a vector store for you in Amazon OpenSearch Service, use the console. For more information, see Create a knowledge base.
 *
 * - Provide the `name` and an optional `description`.
 *
 * - Provide the Amazon Resource Name (ARN) with permissions to create a knowledge base in the `roleArn` field.
 *
 * - Provide the embedding model to use in the `embeddingModelArn` field in the `knowledgeBaseConfiguration` object.
 *
 * - Provide the configuration for your vector store in the `storageConfiguration` object.
 *
 * - For an Amazon OpenSearch Service database, use the `opensearchServerlessConfiguration` object. For more information, see Create a vector store in Amazon OpenSearch Service.
 *
 * - For an Amazon Aurora database, use the `RdsConfiguration` object. For more information, see Create a vector store in Amazon Aurora.
 *
 * - For a Pinecone database, use the `pineconeConfiguration` object. For more information, see Create a vector store in Pinecone.
 *
 * - For a Redis Enterprise Cloud database, use the `redisEnterpriseCloudConfiguration` object. For more information, see Create a vector store in Redis Enterprise Cloud.
 */
export const createKnowledgeBase: (
  input: CreateKnowledgeBaseRequest,
) => Effect.Effect<
  CreateKnowledgeBaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKnowledgeBaseRequest,
  output: CreateKnowledgeBaseResponse,
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
 * Creates a prompt in your prompt library that you can add to a flow. For more information, see Prompt management in Amazon Bedrock, Create a prompt using Prompt management and Prompt flows in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const createPrompt: (
  input: CreatePromptRequest,
) => Effect.Effect<
  CreatePromptResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePromptRequest,
  output: CreatePromptResponse,
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
 * Validates the definition of a flow.
 */
export const validateFlowDefinition: (
  input: ValidateFlowDefinitionRequest,
) => Effect.Effect<
  ValidateFlowDefinitionResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidateFlowDefinitionRequest,
  output: ValidateFlowDefinitionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
