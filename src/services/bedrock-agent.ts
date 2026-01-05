import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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
export const TagKeyList = S.Array(S.String);
export class DeleteAgentActionGroupRequest extends S.Class<DeleteAgentActionGroupRequest>(
  "DeleteAgentActionGroupRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    actionGroupId: S.String.pipe(T.HttpLabel("actionGroupId")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  },
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
) {}
export class DeleteAgentActionGroupResponse extends S.Class<DeleteAgentActionGroupResponse>(
  "DeleteAgentActionGroupResponse",
)({}) {}
export class GetAgentActionGroupRequest extends S.Class<GetAgentActionGroupRequest>(
  "GetAgentActionGroupRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    actionGroupId: S.String.pipe(T.HttpLabel("actionGroupId")),
  },
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
) {}
export class ListAgentActionGroupsRequest extends S.Class<ListAgentActionGroupsRequest>(
  "ListAgentActionGroupsRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
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
) {}
export const ActionGroupSignatureParams = S.Record({
  key: S.String,
  value: S.String,
});
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
export class Function extends S.Class<Function>("Function")({
  name: S.String,
  description: S.optional(S.String),
  parameters: S.optional(ParameterMap),
  requireConfirmation: S.optional(S.String),
}) {}
export const Functions = S.Array(Function);
export const FunctionSchema = S.Union(S.Struct({ functions: Functions }));
export class UpdateAgentActionGroupRequest extends S.Class<UpdateAgentActionGroupRequest>(
  "UpdateAgentActionGroupRequest",
)(
  {
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
  },
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
) {}
export class DisassociateAgentCollaboratorRequest extends S.Class<DisassociateAgentCollaboratorRequest>(
  "DisassociateAgentCollaboratorRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    collaboratorId: S.String.pipe(T.HttpLabel("collaboratorId")),
  },
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
) {}
export class DisassociateAgentCollaboratorResponse extends S.Class<DisassociateAgentCollaboratorResponse>(
  "DisassociateAgentCollaboratorResponse",
)({}) {}
export class GetAgentCollaboratorRequest extends S.Class<GetAgentCollaboratorRequest>(
  "GetAgentCollaboratorRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    collaboratorId: S.String.pipe(T.HttpLabel("collaboratorId")),
  },
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
) {}
export class ListAgentCollaboratorsRequest extends S.Class<ListAgentCollaboratorsRequest>(
  "ListAgentCollaboratorsRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
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
) {}
export class AgentDescriptor extends S.Class<AgentDescriptor>(
  "AgentDescriptor",
)({ aliasArn: S.optional(S.String) }) {}
export class UpdateAgentCollaboratorRequest extends S.Class<UpdateAgentCollaboratorRequest>(
  "UpdateAgentCollaboratorRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    collaboratorId: S.String.pipe(T.HttpLabel("collaboratorId")),
    agentDescriptor: AgentDescriptor,
    collaboratorName: S.String,
    collaborationInstruction: S.String,
    relayConversationHistory: S.optional(S.String),
  },
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
) {}
export class DeleteAgentRequest extends S.Class<DeleteAgentRequest>(
  "DeleteAgentRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/agents/{agentId}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAgentRequest extends S.Class<GetAgentRequest>(
  "GetAgentRequest",
)(
  { agentId: S.String.pipe(T.HttpLabel("agentId")) },
  T.all(
    T.Http({ method: "GET", uri: "/agents/{agentId}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAgentsRequest extends S.Class<ListAgentsRequest>(
  "ListAgentsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/agents/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PrepareAgentRequest extends S.Class<PrepareAgentRequest>(
  "PrepareAgentRequest",
)(
  { agentId: S.String.pipe(T.HttpLabel("agentId")) },
  T.all(
    T.Http({ method: "POST", uri: "/agents/{agentId}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const OrchestrationExecutor = S.Union(S.Struct({ lambda: S.String }));
export class CustomOrchestration extends S.Class<CustomOrchestration>(
  "CustomOrchestration",
)({ executor: S.optional(OrchestrationExecutor) }) {}
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
export class GuardrailConfiguration extends S.Class<GuardrailConfiguration>(
  "GuardrailConfiguration",
)({
  guardrailIdentifier: S.optional(S.String),
  guardrailVersion: S.optional(S.String),
}) {}
export const EnabledMemoryTypes = S.Array(S.String);
export class SessionSummaryConfiguration extends S.Class<SessionSummaryConfiguration>(
  "SessionSummaryConfiguration",
)({ maxRecentSessions: S.optional(S.Number) }) {}
export class MemoryConfiguration extends S.Class<MemoryConfiguration>(
  "MemoryConfiguration",
)({
  enabledMemoryTypes: EnabledMemoryTypes,
  storageDays: S.optional(S.Number),
  sessionSummaryConfiguration: S.optional(SessionSummaryConfiguration),
}) {}
export class UpdateAgentRequest extends S.Class<UpdateAgentRequest>(
  "UpdateAgentRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentName: S.String,
    instruction: S.optional(S.String),
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
  },
  T.all(
    T.Http({ method: "PUT", uri: "/agents/{agentId}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAgentAliasRequest extends S.Class<DeleteAgentAliasRequest>(
  "DeleteAgentAliasRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
  },
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
) {}
export class GetAgentAliasRequest extends S.Class<GetAgentAliasRequest>(
  "GetAgentAliasRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
  },
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
) {}
export class ListAgentAliasesRequest extends S.Class<ListAgentAliasesRequest>(
  "ListAgentAliasesRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/agents/{agentId}/agentaliases/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AgentAliasRoutingConfigurationListItem extends S.Class<AgentAliasRoutingConfigurationListItem>(
  "AgentAliasRoutingConfigurationListItem",
)({
  agentVersion: S.optional(S.String),
  provisionedThroughput: S.optional(S.String),
}) {}
export const AgentAliasRoutingConfiguration = S.Array(
  AgentAliasRoutingConfigurationListItem,
);
export class UpdateAgentAliasRequest extends S.Class<UpdateAgentAliasRequest>(
  "UpdateAgentAliasRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasId: S.String.pipe(T.HttpLabel("agentAliasId")),
    agentAliasName: S.String,
    description: S.optional(S.String),
    routingConfiguration: S.optional(AgentAliasRoutingConfiguration),
    aliasInvocationState: S.optional(S.String),
  },
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
) {}
export class DeleteDataSourceRequest extends S.Class<DeleteDataSourceRequest>(
  "DeleteDataSourceRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
  },
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
) {}
export class GetDataSourceRequest extends S.Class<GetDataSourceRequest>(
  "GetDataSourceRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
  },
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
) {}
export class ListDataSourcesRequest extends S.Class<ListDataSourcesRequest>(
  "ListDataSourcesRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
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
) {}
export const S3Prefixes = S.Array(S.String);
export class S3DataSourceConfiguration extends S.Class<S3DataSourceConfiguration>(
  "S3DataSourceConfiguration",
)({
  bucketArn: S.String,
  inclusionPrefixes: S.optional(S3Prefixes),
  bucketOwnerAccountId: S.optional(S.String),
}) {}
export class SeedUrl extends S.Class<SeedUrl>("SeedUrl")({
  url: S.optional(S.String),
}) {}
export const SeedUrls = S.Array(SeedUrl);
export class UrlConfiguration extends S.Class<UrlConfiguration>(
  "UrlConfiguration",
)({ seedUrls: S.optional(SeedUrls) }) {}
export class WebSourceConfiguration extends S.Class<WebSourceConfiguration>(
  "WebSourceConfiguration",
)({ urlConfiguration: UrlConfiguration }) {}
export class WebCrawlerLimits extends S.Class<WebCrawlerLimits>(
  "WebCrawlerLimits",
)({ rateLimit: S.optional(S.Number), maxPages: S.optional(S.Number) }) {}
export const FilterList = S.Array(S.String);
export class WebCrawlerConfiguration extends S.Class<WebCrawlerConfiguration>(
  "WebCrawlerConfiguration",
)({
  crawlerLimits: S.optional(WebCrawlerLimits),
  inclusionFilters: S.optional(FilterList),
  exclusionFilters: S.optional(FilterList),
  scope: S.optional(S.String),
  userAgent: S.optional(S.String),
  userAgentHeader: S.optional(S.String),
}) {}
export class WebDataSourceConfiguration extends S.Class<WebDataSourceConfiguration>(
  "WebDataSourceConfiguration",
)({
  sourceConfiguration: WebSourceConfiguration,
  crawlerConfiguration: S.optional(WebCrawlerConfiguration),
}) {}
export class ConfluenceSourceConfiguration extends S.Class<ConfluenceSourceConfiguration>(
  "ConfluenceSourceConfiguration",
)({
  hostUrl: S.String,
  hostType: S.String,
  authType: S.String,
  credentialsSecretArn: S.String,
}) {}
export class PatternObjectFilter extends S.Class<PatternObjectFilter>(
  "PatternObjectFilter",
)({
  objectType: S.String,
  inclusionFilters: S.optional(FilterList),
  exclusionFilters: S.optional(FilterList),
}) {}
export const PatternObjectFilterList = S.Array(PatternObjectFilter);
export class PatternObjectFilterConfiguration extends S.Class<PatternObjectFilterConfiguration>(
  "PatternObjectFilterConfiguration",
)({ filters: PatternObjectFilterList }) {}
export class CrawlFilterConfiguration extends S.Class<CrawlFilterConfiguration>(
  "CrawlFilterConfiguration",
)({
  type: S.String,
  patternObjectFilter: S.optional(PatternObjectFilterConfiguration),
}) {}
export class ConfluenceCrawlerConfiguration extends S.Class<ConfluenceCrawlerConfiguration>(
  "ConfluenceCrawlerConfiguration",
)({ filterConfiguration: S.optional(CrawlFilterConfiguration) }) {}
export class ConfluenceDataSourceConfiguration extends S.Class<ConfluenceDataSourceConfiguration>(
  "ConfluenceDataSourceConfiguration",
)({
  sourceConfiguration: ConfluenceSourceConfiguration,
  crawlerConfiguration: S.optional(ConfluenceCrawlerConfiguration),
}) {}
export class SalesforceSourceConfiguration extends S.Class<SalesforceSourceConfiguration>(
  "SalesforceSourceConfiguration",
)({ hostUrl: S.String, authType: S.String, credentialsSecretArn: S.String }) {}
export class SalesforceCrawlerConfiguration extends S.Class<SalesforceCrawlerConfiguration>(
  "SalesforceCrawlerConfiguration",
)({ filterConfiguration: S.optional(CrawlFilterConfiguration) }) {}
export class SalesforceDataSourceConfiguration extends S.Class<SalesforceDataSourceConfiguration>(
  "SalesforceDataSourceConfiguration",
)({
  sourceConfiguration: SalesforceSourceConfiguration,
  crawlerConfiguration: S.optional(SalesforceCrawlerConfiguration),
}) {}
export const SharePointSiteUrls = S.Array(S.String);
export class SharePointSourceConfiguration extends S.Class<SharePointSourceConfiguration>(
  "SharePointSourceConfiguration",
)({
  tenantId: S.optional(S.String),
  domain: S.String,
  siteUrls: SharePointSiteUrls,
  hostType: S.String,
  authType: S.String,
  credentialsSecretArn: S.String,
}) {}
export class SharePointCrawlerConfiguration extends S.Class<SharePointCrawlerConfiguration>(
  "SharePointCrawlerConfiguration",
)({ filterConfiguration: S.optional(CrawlFilterConfiguration) }) {}
export class SharePointDataSourceConfiguration extends S.Class<SharePointDataSourceConfiguration>(
  "SharePointDataSourceConfiguration",
)({
  sourceConfiguration: SharePointSourceConfiguration,
  crawlerConfiguration: S.optional(SharePointCrawlerConfiguration),
}) {}
export class DataSourceConfiguration extends S.Class<DataSourceConfiguration>(
  "DataSourceConfiguration",
)({
  type: S.String,
  s3Configuration: S.optional(S3DataSourceConfiguration),
  webConfiguration: S.optional(WebDataSourceConfiguration),
  confluenceConfiguration: S.optional(ConfluenceDataSourceConfiguration),
  salesforceConfiguration: S.optional(SalesforceDataSourceConfiguration),
  sharePointConfiguration: S.optional(SharePointDataSourceConfiguration),
}) {}
export class ServerSideEncryptionConfiguration extends S.Class<ServerSideEncryptionConfiguration>(
  "ServerSideEncryptionConfiguration",
)({ kmsKeyArn: S.optional(S.String) }) {}
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
export class S3Location extends S.Class<S3Location>("S3Location")({
  uri: S.String,
}) {}
export class IntermediateStorage extends S.Class<IntermediateStorage>(
  "IntermediateStorage",
)({ s3Location: S3Location }) {}
export class TransformationLambdaConfiguration extends S.Class<TransformationLambdaConfiguration>(
  "TransformationLambdaConfiguration",
)({ lambdaArn: S.String }) {}
export class TransformationFunction extends S.Class<TransformationFunction>(
  "TransformationFunction",
)({ transformationLambdaConfiguration: TransformationLambdaConfiguration }) {}
export class Transformation extends S.Class<Transformation>("Transformation")({
  transformationFunction: TransformationFunction,
  stepToApply: S.String,
}) {}
export const Transformations = S.Array(Transformation);
export class CustomTransformationConfiguration extends S.Class<CustomTransformationConfiguration>(
  "CustomTransformationConfiguration",
)({
  intermediateStorage: IntermediateStorage,
  transformations: Transformations,
}) {}
export class ParsingPrompt extends S.Class<ParsingPrompt>("ParsingPrompt")({
  parsingPromptText: S.String,
}) {}
export class BedrockFoundationModelConfiguration extends S.Class<BedrockFoundationModelConfiguration>(
  "BedrockFoundationModelConfiguration",
)({
  modelArn: S.String,
  parsingPrompt: S.optional(ParsingPrompt),
  parsingModality: S.optional(S.String),
}) {}
export class BedrockDataAutomationConfiguration extends S.Class<BedrockDataAutomationConfiguration>(
  "BedrockDataAutomationConfiguration",
)({ parsingModality: S.optional(S.String) }) {}
export class ParsingConfiguration extends S.Class<ParsingConfiguration>(
  "ParsingConfiguration",
)({
  parsingStrategy: S.String,
  bedrockFoundationModelConfiguration: S.optional(
    BedrockFoundationModelConfiguration,
  ),
  bedrockDataAutomationConfiguration: S.optional(
    BedrockDataAutomationConfiguration,
  ),
}) {}
export class EnrichmentStrategyConfiguration extends S.Class<EnrichmentStrategyConfiguration>(
  "EnrichmentStrategyConfiguration",
)({ method: S.String }) {}
export class BedrockFoundationModelContextEnrichmentConfiguration extends S.Class<BedrockFoundationModelContextEnrichmentConfiguration>(
  "BedrockFoundationModelContextEnrichmentConfiguration",
)({
  enrichmentStrategyConfiguration: EnrichmentStrategyConfiguration,
  modelArn: S.String,
}) {}
export class ContextEnrichmentConfiguration extends S.Class<ContextEnrichmentConfiguration>(
  "ContextEnrichmentConfiguration",
)({
  type: S.String,
  bedrockFoundationModelConfiguration: S.optional(
    BedrockFoundationModelContextEnrichmentConfiguration,
  ),
}) {}
export class VectorIngestionConfiguration extends S.Class<VectorIngestionConfiguration>(
  "VectorIngestionConfiguration",
)({
  chunkingConfiguration: S.optional(ChunkingConfiguration),
  customTransformationConfiguration: S.optional(
    CustomTransformationConfiguration,
  ),
  parsingConfiguration: S.optional(ParsingConfiguration),
  contextEnrichmentConfiguration: S.optional(ContextEnrichmentConfiguration),
}) {}
export class UpdateDataSourceRequest extends S.Class<UpdateDataSourceRequest>(
  "UpdateDataSourceRequest",
)(
  {
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
  },
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
) {}
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
export class FlowConnection extends S.Class<FlowConnection>("FlowConnection")({
  type: S.String,
  name: S.String,
  source: S.String,
  target: S.String,
  configuration: S.optional(FlowConnectionConfiguration),
}) {}
export const FlowConnections = S.Array(FlowConnection);
export class FlowDefinition extends S.Class<FlowDefinition>("FlowDefinition")({
  nodes: S.optional(S.suspend(() => FlowNodes)),
  connections: S.optional(FlowConnections),
}) {}
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class CreateFlowRequest extends S.Class<CreateFlowRequest>(
  "CreateFlowRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    executionRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    definition: S.optional(FlowDefinition),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/flows/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFlowRequest extends S.Class<GetFlowRequest>("GetFlowRequest")(
  { flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/flows/{flowIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFlowRequest extends S.Class<UpdateFlowRequest>(
  "UpdateFlowRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    executionRoleArn: S.String,
    customerEncryptionKeyArn: S.optional(S.String),
    definition: S.optional(FlowDefinition),
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/flows/{flowIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFlowRequest extends S.Class<DeleteFlowRequest>(
  "DeleteFlowRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/flows/{flowIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFlowsRequest extends S.Class<ListFlowsRequest>(
  "ListFlowsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/flows/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PrepareFlowRequest extends S.Class<PrepareFlowRequest>(
  "PrepareFlowRequest",
)(
  { flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")) },
  T.all(
    T.Http({ method: "POST", uri: "/flows/{flowIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFlowAliasRequest extends S.Class<GetFlowAliasRequest>(
  "GetFlowAliasRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    aliasIdentifier: S.String.pipe(T.HttpLabel("aliasIdentifier")),
  },
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
) {}
export class FlowAliasRoutingConfigurationListItem extends S.Class<FlowAliasRoutingConfigurationListItem>(
  "FlowAliasRoutingConfigurationListItem",
)({ flowVersion: S.optional(S.String) }) {}
export const FlowAliasRoutingConfiguration = S.Array(
  FlowAliasRoutingConfigurationListItem,
);
export class FlowAliasConcurrencyConfiguration extends S.Class<FlowAliasConcurrencyConfiguration>(
  "FlowAliasConcurrencyConfiguration",
)({ type: S.String, maxConcurrency: S.optional(S.Number) }) {}
export class UpdateFlowAliasRequest extends S.Class<UpdateFlowAliasRequest>(
  "UpdateFlowAliasRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    routingConfiguration: FlowAliasRoutingConfiguration,
    concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    aliasIdentifier: S.String.pipe(T.HttpLabel("aliasIdentifier")),
  },
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
) {}
export class DeleteFlowAliasRequest extends S.Class<DeleteFlowAliasRequest>(
  "DeleteFlowAliasRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    aliasIdentifier: S.String.pipe(T.HttpLabel("aliasIdentifier")),
  },
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
) {}
export class ListFlowAliasesRequest extends S.Class<ListFlowAliasesRequest>(
  "ListFlowAliasesRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/flows/{flowIdentifier}/aliases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFlowVersionRequest extends S.Class<CreateFlowVersionRequest>(
  "CreateFlowVersionRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/flows/{flowIdentifier}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFlowVersionRequest extends S.Class<GetFlowVersionRequest>(
  "GetFlowVersionRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowVersion: S.String.pipe(T.HttpLabel("flowVersion")),
  },
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
) {}
export class DeleteFlowVersionRequest extends S.Class<DeleteFlowVersionRequest>(
  "DeleteFlowVersionRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    flowVersion: S.String.pipe(T.HttpLabel("flowVersion")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  },
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
) {}
export class ListFlowVersionsRequest extends S.Class<ListFlowVersionsRequest>(
  "ListFlowVersionsRequest",
)(
  {
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/flows/{flowIdentifier}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIngestionJobRequest extends S.Class<GetIngestionJobRequest>(
  "GetIngestionJobRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    ingestionJobId: S.String.pipe(T.HttpLabel("ingestionJobId")),
  },
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
) {}
export class StartIngestionJobRequest extends S.Class<StartIngestionJobRequest>(
  "StartIngestionJobRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    clientToken: S.optional(S.String),
    description: S.optional(S.String),
  },
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
) {}
export class StopIngestionJobRequest extends S.Class<StopIngestionJobRequest>(
  "StopIngestionJobRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    ingestionJobId: S.String.pipe(T.HttpLabel("ingestionJobId")),
  },
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
) {}
export class CustomDocumentIdentifier extends S.Class<CustomDocumentIdentifier>(
  "CustomDocumentIdentifier",
)({ id: S.String }) {}
export class DocumentIdentifier extends S.Class<DocumentIdentifier>(
  "DocumentIdentifier",
)({
  dataSourceType: S.String,
  s3: S.optional(S3Location),
  custom: S.optional(CustomDocumentIdentifier),
}) {}
export const DocumentIdentifiers = S.Array(DocumentIdentifier);
export class GetKnowledgeBaseDocumentsRequest extends S.Class<GetKnowledgeBaseDocumentsRequest>(
  "GetKnowledgeBaseDocumentsRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    documentIdentifiers: DocumentIdentifiers,
  },
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
) {}
export class ListKnowledgeBaseDocumentsRequest extends S.Class<ListKnowledgeBaseDocumentsRequest>(
  "ListKnowledgeBaseDocumentsRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
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
) {}
export class AssociateAgentKnowledgeBaseRequest extends S.Class<AssociateAgentKnowledgeBaseRequest>(
  "AssociateAgentKnowledgeBaseRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    knowledgeBaseId: S.String,
    description: S.String,
    knowledgeBaseState: S.optional(S.String),
  },
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
) {}
export class DeleteKnowledgeBaseRequest extends S.Class<DeleteKnowledgeBaseRequest>(
  "DeleteKnowledgeBaseRequest",
)(
  { knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/knowledgebases/{knowledgeBaseId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAgentKnowledgeBaseRequest extends S.Class<DisassociateAgentKnowledgeBaseRequest>(
  "DisassociateAgentKnowledgeBaseRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class DisassociateAgentKnowledgeBaseResponse extends S.Class<DisassociateAgentKnowledgeBaseResponse>(
  "DisassociateAgentKnowledgeBaseResponse",
)({}) {}
export class GetAgentKnowledgeBaseRequest extends S.Class<GetAgentKnowledgeBaseRequest>(
  "GetAgentKnowledgeBaseRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
  },
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
) {}
export class GetKnowledgeBaseRequest extends S.Class<GetKnowledgeBaseRequest>(
  "GetKnowledgeBaseRequest",
)(
  { knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")) },
  T.all(
    T.Http({ method: "GET", uri: "/knowledgebases/{knowledgeBaseId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAgentKnowledgeBasesRequest extends S.Class<ListAgentKnowledgeBasesRequest>(
  "ListAgentKnowledgeBasesRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
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
) {}
export class ListKnowledgeBasesRequest extends S.Class<ListKnowledgeBasesRequest>(
  "ListKnowledgeBasesRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/knowledgebases/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAgentKnowledgeBaseRequest extends S.Class<UpdateAgentKnowledgeBaseRequest>(
  "UpdateAgentKnowledgeBaseRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    description: S.optional(S.String),
    knowledgeBaseState: S.optional(S.String),
  },
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
) {}
export class AudioSegmentationConfiguration extends S.Class<AudioSegmentationConfiguration>(
  "AudioSegmentationConfiguration",
)({ fixedLengthDuration: S.Number }) {}
export class AudioConfiguration extends S.Class<AudioConfiguration>(
  "AudioConfiguration",
)({ segmentationConfiguration: AudioSegmentationConfiguration }) {}
export const AudioConfigurations = S.Array(AudioConfiguration);
export class VideoSegmentationConfiguration extends S.Class<VideoSegmentationConfiguration>(
  "VideoSegmentationConfiguration",
)({ fixedLengthDuration: S.Number }) {}
export class VideoConfiguration extends S.Class<VideoConfiguration>(
  "VideoConfiguration",
)({ segmentationConfiguration: VideoSegmentationConfiguration }) {}
export const VideoConfigurations = S.Array(VideoConfiguration);
export class BedrockEmbeddingModelConfiguration extends S.Class<BedrockEmbeddingModelConfiguration>(
  "BedrockEmbeddingModelConfiguration",
)({
  dimensions: S.optional(S.Number),
  embeddingDataType: S.optional(S.String),
  audio: S.optional(AudioConfigurations),
  video: S.optional(VideoConfigurations),
}) {}
export class EmbeddingModelConfiguration extends S.Class<EmbeddingModelConfiguration>(
  "EmbeddingModelConfiguration",
)({
  bedrockEmbeddingModelConfiguration: S.optional(
    BedrockEmbeddingModelConfiguration,
  ),
}) {}
export class SupplementalDataStorageLocation extends S.Class<SupplementalDataStorageLocation>(
  "SupplementalDataStorageLocation",
)({ type: S.String, s3Location: S.optional(S3Location) }) {}
export const SupplementalDataStorageLocations = S.Array(
  SupplementalDataStorageLocation,
);
export class SupplementalDataStorageConfiguration extends S.Class<SupplementalDataStorageConfiguration>(
  "SupplementalDataStorageConfiguration",
)({ storageLocations: SupplementalDataStorageLocations }) {}
export class VectorKnowledgeBaseConfiguration extends S.Class<VectorKnowledgeBaseConfiguration>(
  "VectorKnowledgeBaseConfiguration",
)({
  embeddingModelArn: S.String,
  embeddingModelConfiguration: S.optional(EmbeddingModelConfiguration),
  supplementalDataStorageConfiguration: S.optional(
    SupplementalDataStorageConfiguration,
  ),
}) {}
export class KendraKnowledgeBaseConfiguration extends S.Class<KendraKnowledgeBaseConfiguration>(
  "KendraKnowledgeBaseConfiguration",
)({ kendraIndexArn: S.String }) {}
export const AwsDataCatalogTableNames = S.Array(S.String);
export class RedshiftQueryEngineAwsDataCatalogStorageConfiguration extends S.Class<RedshiftQueryEngineAwsDataCatalogStorageConfiguration>(
  "RedshiftQueryEngineAwsDataCatalogStorageConfiguration",
)({ tableNames: AwsDataCatalogTableNames }) {}
export class RedshiftQueryEngineRedshiftStorageConfiguration extends S.Class<RedshiftQueryEngineRedshiftStorageConfiguration>(
  "RedshiftQueryEngineRedshiftStorageConfiguration",
)({ databaseName: S.String }) {}
export class RedshiftQueryEngineStorageConfiguration extends S.Class<RedshiftQueryEngineStorageConfiguration>(
  "RedshiftQueryEngineStorageConfiguration",
)({
  type: S.String,
  awsDataCatalogConfiguration: S.optional(
    RedshiftQueryEngineAwsDataCatalogStorageConfiguration,
  ),
  redshiftConfiguration: S.optional(
    RedshiftQueryEngineRedshiftStorageConfiguration,
  ),
}) {}
export const RedshiftQueryEngineStorageConfigurations = S.Array(
  RedshiftQueryEngineStorageConfiguration,
);
export class RedshiftServerlessAuthConfiguration extends S.Class<RedshiftServerlessAuthConfiguration>(
  "RedshiftServerlessAuthConfiguration",
)({ type: S.String, usernamePasswordSecretArn: S.optional(S.String) }) {}
export class RedshiftServerlessConfiguration extends S.Class<RedshiftServerlessConfiguration>(
  "RedshiftServerlessConfiguration",
)({
  workgroupArn: S.String,
  authConfiguration: RedshiftServerlessAuthConfiguration,
}) {}
export class RedshiftProvisionedAuthConfiguration extends S.Class<RedshiftProvisionedAuthConfiguration>(
  "RedshiftProvisionedAuthConfiguration",
)({
  type: S.String,
  databaseUser: S.optional(S.String),
  usernamePasswordSecretArn: S.optional(S.String),
}) {}
export class RedshiftProvisionedConfiguration extends S.Class<RedshiftProvisionedConfiguration>(
  "RedshiftProvisionedConfiguration",
)({
  clusterIdentifier: S.String,
  authConfiguration: RedshiftProvisionedAuthConfiguration,
}) {}
export class RedshiftQueryEngineConfiguration extends S.Class<RedshiftQueryEngineConfiguration>(
  "RedshiftQueryEngineConfiguration",
)({
  type: S.String,
  serverlessConfiguration: S.optional(RedshiftServerlessConfiguration),
  provisionedConfiguration: S.optional(RedshiftProvisionedConfiguration),
}) {}
export class QueryGenerationColumn extends S.Class<QueryGenerationColumn>(
  "QueryGenerationColumn",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  inclusion: S.optional(S.String),
}) {}
export const QueryGenerationColumns = S.Array(QueryGenerationColumn);
export class QueryGenerationTable extends S.Class<QueryGenerationTable>(
  "QueryGenerationTable",
)({
  name: S.String,
  description: S.optional(S.String),
  inclusion: S.optional(S.String),
  columns: S.optional(QueryGenerationColumns),
}) {}
export const QueryGenerationTables = S.Array(QueryGenerationTable);
export class CuratedQuery extends S.Class<CuratedQuery>("CuratedQuery")({
  naturalLanguage: S.String,
  sql: S.String,
}) {}
export const CuratedQueries = S.Array(CuratedQuery);
export class QueryGenerationContext extends S.Class<QueryGenerationContext>(
  "QueryGenerationContext",
)({
  tables: S.optional(QueryGenerationTables),
  curatedQueries: S.optional(CuratedQueries),
}) {}
export class QueryGenerationConfiguration extends S.Class<QueryGenerationConfiguration>(
  "QueryGenerationConfiguration",
)({
  executionTimeoutSeconds: S.optional(S.Number),
  generationContext: S.optional(QueryGenerationContext),
}) {}
export class RedshiftConfiguration extends S.Class<RedshiftConfiguration>(
  "RedshiftConfiguration",
)({
  storageConfigurations: RedshiftQueryEngineStorageConfigurations,
  queryEngineConfiguration: RedshiftQueryEngineConfiguration,
  queryGenerationConfiguration: S.optional(QueryGenerationConfiguration),
}) {}
export class SqlKnowledgeBaseConfiguration extends S.Class<SqlKnowledgeBaseConfiguration>(
  "SqlKnowledgeBaseConfiguration",
)({
  type: S.String,
  redshiftConfiguration: S.optional(RedshiftConfiguration),
}) {}
export class KnowledgeBaseConfiguration extends S.Class<KnowledgeBaseConfiguration>(
  "KnowledgeBaseConfiguration",
)({
  type: S.String,
  vectorKnowledgeBaseConfiguration: S.optional(
    VectorKnowledgeBaseConfiguration,
  ),
  kendraKnowledgeBaseConfiguration: S.optional(
    KendraKnowledgeBaseConfiguration,
  ),
  sqlKnowledgeBaseConfiguration: S.optional(SqlKnowledgeBaseConfiguration),
}) {}
export class OpenSearchServerlessFieldMapping extends S.Class<OpenSearchServerlessFieldMapping>(
  "OpenSearchServerlessFieldMapping",
)({ vectorField: S.String, textField: S.String, metadataField: S.String }) {}
export class OpenSearchServerlessConfiguration extends S.Class<OpenSearchServerlessConfiguration>(
  "OpenSearchServerlessConfiguration",
)({
  collectionArn: S.String,
  vectorIndexName: S.String,
  fieldMapping: OpenSearchServerlessFieldMapping,
}) {}
export class OpenSearchManagedClusterFieldMapping extends S.Class<OpenSearchManagedClusterFieldMapping>(
  "OpenSearchManagedClusterFieldMapping",
)({ vectorField: S.String, textField: S.String, metadataField: S.String }) {}
export class OpenSearchManagedClusterConfiguration extends S.Class<OpenSearchManagedClusterConfiguration>(
  "OpenSearchManagedClusterConfiguration",
)({
  domainEndpoint: S.String,
  domainArn: S.String,
  vectorIndexName: S.String,
  fieldMapping: OpenSearchManagedClusterFieldMapping,
}) {}
export class PineconeFieldMapping extends S.Class<PineconeFieldMapping>(
  "PineconeFieldMapping",
)({ textField: S.String, metadataField: S.String }) {}
export class PineconeConfiguration extends S.Class<PineconeConfiguration>(
  "PineconeConfiguration",
)({
  connectionString: S.String,
  credentialsSecretArn: S.String,
  namespace: S.optional(S.String),
  fieldMapping: PineconeFieldMapping,
}) {}
export class RedisEnterpriseCloudFieldMapping extends S.Class<RedisEnterpriseCloudFieldMapping>(
  "RedisEnterpriseCloudFieldMapping",
)({ vectorField: S.String, textField: S.String, metadataField: S.String }) {}
export class RedisEnterpriseCloudConfiguration extends S.Class<RedisEnterpriseCloudConfiguration>(
  "RedisEnterpriseCloudConfiguration",
)({
  endpoint: S.String,
  vectorIndexName: S.String,
  credentialsSecretArn: S.String,
  fieldMapping: RedisEnterpriseCloudFieldMapping,
}) {}
export class RdsFieldMapping extends S.Class<RdsFieldMapping>(
  "RdsFieldMapping",
)({
  primaryKeyField: S.String,
  vectorField: S.String,
  textField: S.String,
  metadataField: S.String,
  customMetadataField: S.optional(S.String),
}) {}
export class RdsConfiguration extends S.Class<RdsConfiguration>(
  "RdsConfiguration",
)({
  resourceArn: S.String,
  credentialsSecretArn: S.String,
  databaseName: S.String,
  tableName: S.String,
  fieldMapping: RdsFieldMapping,
}) {}
export class MongoDbAtlasFieldMapping extends S.Class<MongoDbAtlasFieldMapping>(
  "MongoDbAtlasFieldMapping",
)({ vectorField: S.String, textField: S.String, metadataField: S.String }) {}
export class MongoDbAtlasConfiguration extends S.Class<MongoDbAtlasConfiguration>(
  "MongoDbAtlasConfiguration",
)({
  endpoint: S.String,
  databaseName: S.String,
  collectionName: S.String,
  vectorIndexName: S.String,
  credentialsSecretArn: S.String,
  fieldMapping: MongoDbAtlasFieldMapping,
  endpointServiceName: S.optional(S.String),
  textIndexName: S.optional(S.String),
}) {}
export class NeptuneAnalyticsFieldMapping extends S.Class<NeptuneAnalyticsFieldMapping>(
  "NeptuneAnalyticsFieldMapping",
)({ textField: S.String, metadataField: S.String }) {}
export class NeptuneAnalyticsConfiguration extends S.Class<NeptuneAnalyticsConfiguration>(
  "NeptuneAnalyticsConfiguration",
)({ graphArn: S.String, fieldMapping: NeptuneAnalyticsFieldMapping }) {}
export class S3VectorsConfiguration extends S.Class<S3VectorsConfiguration>(
  "S3VectorsConfiguration",
)({
  vectorBucketArn: S.optional(S.String),
  indexArn: S.optional(S.String),
  indexName: S.optional(S.String),
}) {}
export class StorageConfiguration extends S.Class<StorageConfiguration>(
  "StorageConfiguration",
)({
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
}) {}
export class UpdateKnowledgeBaseRequest extends S.Class<UpdateKnowledgeBaseRequest>(
  "UpdateKnowledgeBaseRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    name: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    knowledgeBaseConfiguration: KnowledgeBaseConfiguration,
    storageConfiguration: S.optional(StorageConfiguration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/knowledgebases/{knowledgeBaseId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPromptRequest extends S.Class<GetPromptRequest>(
  "GetPromptRequest",
)(
  {
    promptIdentifier: S.String.pipe(T.HttpLabel("promptIdentifier")),
    promptVersion: S.optional(S.String).pipe(T.HttpQuery("promptVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prompts/{promptIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CachePointBlock extends S.Class<CachePointBlock>(
  "CachePointBlock",
)({ type: S.String }) {}
export class PromptInputVariable extends S.Class<PromptInputVariable>(
  "PromptInputVariable",
)({ name: S.optional(S.String) }) {}
export const PromptInputVariablesList = S.Array(PromptInputVariable);
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
export class Message extends S.Class<Message>("Message")({
  role: S.String,
  content: ContentBlocks,
}) {}
export const Messages = S.Array(Message);
export const SystemContentBlock = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ cachePoint: CachePointBlock }),
);
export const SystemContentBlocks = S.Array(SystemContentBlock);
export const ToolInputSchema = S.Union(S.Struct({ json: S.Any }));
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
export class AutoToolChoice extends S.Class<AutoToolChoice>("AutoToolChoice")(
  {},
) {}
export class AnyToolChoice extends S.Class<AnyToolChoice>("AnyToolChoice")(
  {},
) {}
export class SpecificToolChoice extends S.Class<SpecificToolChoice>(
  "SpecificToolChoice",
)({ name: S.String }) {}
export const ToolChoice = S.Union(
  S.Struct({ auto: AutoToolChoice }),
  S.Struct({ any: AnyToolChoice }),
  S.Struct({ tool: SpecificToolChoice }),
);
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
export class PromptModelInferenceConfiguration extends S.Class<PromptModelInferenceConfiguration>(
  "PromptModelInferenceConfiguration",
)({
  temperature: S.optional(S.Number),
  topP: S.optional(S.Number),
  maxTokens: S.optional(S.Number),
  stopSequences: S.optional(StopSequences),
}) {}
export const PromptInferenceConfiguration = S.Union(
  S.Struct({ text: PromptModelInferenceConfiguration }),
);
export class PromptMetadataEntry extends S.Class<PromptMetadataEntry>(
  "PromptMetadataEntry",
)({ key: S.String, value: S.String }) {}
export const PromptMetadataList = S.Array(PromptMetadataEntry);
export class PromptAgentResource extends S.Class<PromptAgentResource>(
  "PromptAgentResource",
)({ agentIdentifier: S.String }) {}
export const PromptGenAiResource = S.Union(
  S.Struct({ agent: PromptAgentResource }),
);
export class PromptVariant extends S.Class<PromptVariant>("PromptVariant")({
  name: S.String,
  templateType: S.String,
  templateConfiguration: PromptTemplateConfiguration,
  modelId: S.optional(S.String),
  inferenceConfiguration: S.optional(PromptInferenceConfiguration),
  metadata: S.optional(PromptMetadataList),
  additionalModelRequestFields: S.optional(S.Any),
  genAiResource: S.optional(PromptGenAiResource),
}) {}
export const PromptVariantList = S.Array(PromptVariant);
export class UpdatePromptRequest extends S.Class<UpdatePromptRequest>(
  "UpdatePromptRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    customerEncryptionKeyArn: S.optional(S.String),
    defaultVariant: S.optional(S.String),
    variants: S.optional(PromptVariantList),
    promptIdentifier: S.String.pipe(T.HttpLabel("promptIdentifier")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prompts/{promptIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePromptRequest extends S.Class<DeletePromptRequest>(
  "DeletePromptRequest",
)(
  {
    promptIdentifier: S.String.pipe(T.HttpLabel("promptIdentifier")),
    promptVersion: S.optional(S.String).pipe(T.HttpQuery("promptVersion")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/prompts/{promptIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPromptsRequest extends S.Class<ListPromptsRequest>(
  "ListPromptsRequest",
)(
  {
    promptIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("promptIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prompts/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePromptVersionRequest extends S.Class<CreatePromptVersionRequest>(
  "CreatePromptVersionRequest",
)(
  {
    promptIdentifier: S.String.pipe(T.HttpLabel("promptIdentifier")),
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prompts/{promptIdentifier}/versions" }),
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
export class DeleteAgentVersionRequest extends S.Class<DeleteAgentVersionRequest>(
  "DeleteAgentVersionRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    skipResourceInUseCheck: S.optional(S.Boolean).pipe(
      T.HttpQuery("skipResourceInUseCheck"),
    ),
  },
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
) {}
export class GetAgentVersionRequest extends S.Class<GetAgentVersionRequest>(
  "GetAgentVersionRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
  },
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
) {}
export class ListAgentVersionsRequest extends S.Class<ListAgentVersionsRequest>(
  "ListAgentVersionsRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/agents/{agentId}/agentversions/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const IngestionJobFilterValues = S.Array(S.String);
export class IngestionJobFilter extends S.Class<IngestionJobFilter>(
  "IngestionJobFilter",
)({
  attribute: S.String,
  operator: S.String,
  values: IngestionJobFilterValues,
}) {}
export const IngestionJobFilters = S.Array(IngestionJobFilter);
export class IngestionJobSortBy extends S.Class<IngestionJobSortBy>(
  "IngestionJobSortBy",
)({ attribute: S.String, order: S.String }) {}
export class AgentActionGroup extends S.Class<AgentActionGroup>(
  "AgentActionGroup",
)({
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
}) {}
export class UpdateAgentActionGroupResponse extends S.Class<UpdateAgentActionGroupResponse>(
  "UpdateAgentActionGroupResponse",
)({ agentActionGroup: AgentActionGroup }) {}
export class AssociateAgentCollaboratorRequest extends S.Class<AssociateAgentCollaboratorRequest>(
  "AssociateAgentCollaboratorRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentVersion: S.String.pipe(T.HttpLabel("agentVersion")),
    agentDescriptor: AgentDescriptor,
    collaboratorName: S.String,
    collaborationInstruction: S.String,
    relayConversationHistory: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
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
) {}
export class AgentCollaborator extends S.Class<AgentCollaborator>(
  "AgentCollaborator",
)({
  agentId: S.String,
  agentVersion: S.String,
  agentDescriptor: AgentDescriptor,
  collaboratorId: S.String,
  collaborationInstruction: S.String,
  collaboratorName: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  relayConversationHistory: S.optional(S.String),
  clientToken: S.optional(S.String),
}) {}
export class UpdateAgentCollaboratorResponse extends S.Class<UpdateAgentCollaboratorResponse>(
  "UpdateAgentCollaboratorResponse",
)({ agentCollaborator: AgentCollaborator }) {}
export class DeleteAgentResponse extends S.Class<DeleteAgentResponse>(
  "DeleteAgentResponse",
)({ agentId: S.String, agentStatus: S.String }) {}
export class PrepareAgentResponse extends S.Class<PrepareAgentResponse>(
  "PrepareAgentResponse",
)({
  agentId: S.String,
  agentStatus: S.String,
  agentVersion: S.String,
  preparedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const FailureReasons = S.Array(S.String);
export const RecommendedActions = S.Array(S.String);
export class Agent extends S.Class<Agent>("Agent")({
  agentId: S.String,
  agentName: S.String,
  agentArn: S.String,
  agentVersion: S.String,
  clientToken: S.optional(S.String),
  instruction: S.optional(S.String),
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
}) {}
export class UpdateAgentResponse extends S.Class<UpdateAgentResponse>(
  "UpdateAgentResponse",
)({ agent: Agent }) {}
export class CreateAgentAliasRequest extends S.Class<CreateAgentAliasRequest>(
  "CreateAgentAliasRequest",
)(
  {
    agentId: S.String.pipe(T.HttpLabel("agentId")),
    agentAliasName: S.String,
    clientToken: S.optional(S.String),
    description: S.optional(S.String),
    routingConfiguration: S.optional(AgentAliasRoutingConfiguration),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/agents/{agentId}/agentaliases/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAgentAliasResponse extends S.Class<DeleteAgentAliasResponse>(
  "DeleteAgentAliasResponse",
)({ agentId: S.String, agentAliasId: S.String, agentAliasStatus: S.String }) {}
export class AgentAliasHistoryEvent extends S.Class<AgentAliasHistoryEvent>(
  "AgentAliasHistoryEvent",
)({
  routingConfiguration: S.optional(AgentAliasRoutingConfiguration),
  endDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const AgentAliasHistoryEvents = S.Array(AgentAliasHistoryEvent);
export class AgentAlias extends S.Class<AgentAlias>("AgentAlias")({
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
}) {}
export class UpdateAgentAliasResponse extends S.Class<UpdateAgentAliasResponse>(
  "UpdateAgentAliasResponse",
)({ agentAlias: AgentAlias }) {}
export class DeleteDataSourceResponse extends S.Class<DeleteDataSourceResponse>(
  "DeleteDataSourceResponse",
)({ knowledgeBaseId: S.String, dataSourceId: S.String, status: S.String }) {}
export class DataSource extends S.Class<DataSource>("DataSource")({
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
}) {}
export class UpdateDataSourceResponse extends S.Class<UpdateDataSourceResponse>(
  "UpdateDataSourceResponse",
)({ dataSource: DataSource }) {}
export class CreateFlowResponse extends S.Class<CreateFlowResponse>(
  "CreateFlowResponse",
)({
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
}) {}
export class UpdateFlowResponse extends S.Class<UpdateFlowResponse>(
  "UpdateFlowResponse",
)({
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
}) {}
export class DeleteFlowResponse extends S.Class<DeleteFlowResponse>(
  "DeleteFlowResponse",
)({ id: S.String }) {}
export class PrepareFlowResponse extends S.Class<PrepareFlowResponse>(
  "PrepareFlowResponse",
)({ id: S.String, status: S.String }) {}
export class CreateFlowAliasRequest extends S.Class<CreateFlowAliasRequest>(
  "CreateFlowAliasRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    routingConfiguration: FlowAliasRoutingConfiguration,
    concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
    flowIdentifier: S.String.pipe(T.HttpLabel("flowIdentifier")),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/flows/{flowIdentifier}/aliases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFlowAliasResponse extends S.Class<GetFlowAliasResponse>(
  "GetFlowAliasResponse",
)({
  name: S.String,
  description: S.optional(S.String),
  routingConfiguration: FlowAliasRoutingConfiguration,
  concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
  flowId: S.String,
  id: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class UpdateFlowAliasResponse extends S.Class<UpdateFlowAliasResponse>(
  "UpdateFlowAliasResponse",
)({
  name: S.String,
  description: S.optional(S.String),
  routingConfiguration: FlowAliasRoutingConfiguration,
  concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
  flowId: S.String,
  id: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class DeleteFlowAliasResponse extends S.Class<DeleteFlowAliasResponse>(
  "DeleteFlowAliasResponse",
)({ flowId: S.String, id: S.String }) {}
export class CreateFlowVersionResponse extends S.Class<CreateFlowVersionResponse>(
  "CreateFlowVersionResponse",
)({
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
}) {}
export class GetFlowVersionResponse extends S.Class<GetFlowVersionResponse>(
  "GetFlowVersionResponse",
)({
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
}) {}
export class DeleteFlowVersionResponse extends S.Class<DeleteFlowVersionResponse>(
  "DeleteFlowVersionResponse",
)({ id: S.String, version: S.String }) {}
export class ListIngestionJobsRequest extends S.Class<ListIngestionJobsRequest>(
  "ListIngestionJobsRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    filters: S.optional(IngestionJobFilters),
    sortBy: S.optional(IngestionJobSortBy),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
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
) {}
export class IngestionJobStatistics extends S.Class<IngestionJobStatistics>(
  "IngestionJobStatistics",
)({
  numberOfDocumentsScanned: S.optional(S.Number),
  numberOfMetadataDocumentsScanned: S.optional(S.Number),
  numberOfNewDocumentsIndexed: S.optional(S.Number),
  numberOfModifiedDocumentsIndexed: S.optional(S.Number),
  numberOfMetadataDocumentsModified: S.optional(S.Number),
  numberOfDocumentsDeleted: S.optional(S.Number),
  numberOfDocumentsFailed: S.optional(S.Number),
}) {}
export class IngestionJob extends S.Class<IngestionJob>("IngestionJob")({
  knowledgeBaseId: S.String,
  dataSourceId: S.String,
  ingestionJobId: S.String,
  description: S.optional(S.String),
  status: S.String,
  statistics: S.optional(IngestionJobStatistics),
  failureReasons: S.optional(FailureReasons),
  startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class StartIngestionJobResponse extends S.Class<StartIngestionJobResponse>(
  "StartIngestionJobResponse",
)({ ingestionJob: IngestionJob }) {}
export class StopIngestionJobResponse extends S.Class<StopIngestionJobResponse>(
  "StopIngestionJobResponse",
)({ ingestionJob: IngestionJob }) {}
export class KnowledgeBaseDocumentDetail extends S.Class<KnowledgeBaseDocumentDetail>(
  "KnowledgeBaseDocumentDetail",
)({
  knowledgeBaseId: S.String,
  dataSourceId: S.String,
  status: S.String,
  identifier: DocumentIdentifier,
  statusReason: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const KnowledgeBaseDocumentDetails = S.Array(
  KnowledgeBaseDocumentDetail,
);
export class ListKnowledgeBaseDocumentsResponse extends S.Class<ListKnowledgeBaseDocumentsResponse>(
  "ListKnowledgeBaseDocumentsResponse",
)({
  documentDetails: KnowledgeBaseDocumentDetails,
  nextToken: S.optional(S.String),
}) {}
export class DeleteKnowledgeBaseResponse extends S.Class<DeleteKnowledgeBaseResponse>(
  "DeleteKnowledgeBaseResponse",
)({ knowledgeBaseId: S.String, status: S.String }) {}
export class AgentKnowledgeBase extends S.Class<AgentKnowledgeBase>(
  "AgentKnowledgeBase",
)({
  agentId: S.String,
  agentVersion: S.String,
  knowledgeBaseId: S.String,
  description: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  knowledgeBaseState: S.String,
}) {}
export class GetAgentKnowledgeBaseResponse extends S.Class<GetAgentKnowledgeBaseResponse>(
  "GetAgentKnowledgeBaseResponse",
)({ agentKnowledgeBase: AgentKnowledgeBase }) {}
export class UpdateAgentKnowledgeBaseResponse extends S.Class<UpdateAgentKnowledgeBaseResponse>(
  "UpdateAgentKnowledgeBaseResponse",
)({ agentKnowledgeBase: AgentKnowledgeBase }) {}
export class KnowledgeBase extends S.Class<KnowledgeBase>("KnowledgeBase")({
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
}) {}
export class UpdateKnowledgeBaseResponse extends S.Class<UpdateKnowledgeBaseResponse>(
  "UpdateKnowledgeBaseResponse",
)({ knowledgeBase: KnowledgeBase }) {}
export class GetPromptResponse extends S.Class<GetPromptResponse>(
  "GetPromptResponse",
)({
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
}) {}
export class UpdatePromptResponse extends S.Class<UpdatePromptResponse>(
  "UpdatePromptResponse",
)({
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
}) {}
export class DeletePromptResponse extends S.Class<DeletePromptResponse>(
  "DeletePromptResponse",
)({ id: S.String, version: S.optional(S.String) }) {}
export class CreatePromptVersionResponse extends S.Class<CreatePromptVersionResponse>(
  "CreatePromptVersionResponse",
)({
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
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class DeleteAgentVersionResponse extends S.Class<DeleteAgentVersionResponse>(
  "DeleteAgentVersionResponse",
)({ agentId: S.String, agentVersion: S.String, agentStatus: S.String }) {}
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
export class ActionGroupSummary extends S.Class<ActionGroupSummary>(
  "ActionGroupSummary",
)({
  actionGroupId: S.String,
  actionGroupName: S.String,
  actionGroupState: S.String,
  description: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ActionGroupSummaries = S.Array(ActionGroupSummary);
export class AgentCollaboratorSummary extends S.Class<AgentCollaboratorSummary>(
  "AgentCollaboratorSummary",
)({
  agentId: S.String,
  agentVersion: S.String,
  collaboratorId: S.String,
  agentDescriptor: AgentDescriptor,
  collaborationInstruction: S.String,
  relayConversationHistory: S.String,
  collaboratorName: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const AgentCollaboratorSummaries = S.Array(AgentCollaboratorSummary);
export class AgentSummary extends S.Class<AgentSummary>("AgentSummary")({
  agentId: S.String,
  agentName: S.String,
  agentStatus: S.String,
  description: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  latestAgentVersion: S.optional(S.String),
  guardrailConfiguration: S.optional(GuardrailConfiguration),
}) {}
export const AgentSummaries = S.Array(AgentSummary);
export class AgentAliasSummary extends S.Class<AgentAliasSummary>(
  "AgentAliasSummary",
)({
  agentAliasId: S.String,
  agentAliasName: S.String,
  description: S.optional(S.String),
  routingConfiguration: S.optional(AgentAliasRoutingConfiguration),
  agentAliasStatus: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  aliasInvocationState: S.optional(S.String),
}) {}
export const AgentAliasSummaries = S.Array(AgentAliasSummary);
export class DataSourceSummary extends S.Class<DataSourceSummary>(
  "DataSourceSummary",
)({
  knowledgeBaseId: S.String,
  dataSourceId: S.String,
  name: S.String,
  status: S.String,
  description: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const DataSourceSummaries = S.Array(DataSourceSummary);
export class FlowSummary extends S.Class<FlowSummary>("FlowSummary")({
  name: S.String,
  description: S.optional(S.String),
  id: S.String,
  arn: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  version: S.String,
}) {}
export const FlowSummaries = S.Array(FlowSummary);
export class FlowAliasSummary extends S.Class<FlowAliasSummary>(
  "FlowAliasSummary",
)({
  name: S.String,
  description: S.optional(S.String),
  routingConfiguration: FlowAliasRoutingConfiguration,
  concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
  flowId: S.String,
  id: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const FlowAliasSummaries = S.Array(FlowAliasSummary);
export class FlowVersionSummary extends S.Class<FlowVersionSummary>(
  "FlowVersionSummary",
)({
  id: S.String,
  arn: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  version: S.String,
}) {}
export const FlowVersionSummaries = S.Array(FlowVersionSummary);
export class AgentKnowledgeBaseSummary extends S.Class<AgentKnowledgeBaseSummary>(
  "AgentKnowledgeBaseSummary",
)({
  knowledgeBaseId: S.String,
  description: S.optional(S.String),
  knowledgeBaseState: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const AgentKnowledgeBaseSummaries = S.Array(AgentKnowledgeBaseSummary);
export class KnowledgeBaseSummary extends S.Class<KnowledgeBaseSummary>(
  "KnowledgeBaseSummary",
)({
  knowledgeBaseId: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const KnowledgeBaseSummaries = S.Array(KnowledgeBaseSummary);
export class PromptSummary extends S.Class<PromptSummary>("PromptSummary")({
  name: S.String,
  description: S.optional(S.String),
  id: S.String,
  arn: S.String,
  version: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const PromptSummaries = S.Array(PromptSummary);
export class AgentVersion extends S.Class<AgentVersion>("AgentVersion")({
  agentId: S.String,
  agentName: S.String,
  agentArn: S.String,
  version: S.String,
  instruction: S.optional(S.String),
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
}) {}
export class AgentVersionSummary extends S.Class<AgentVersionSummary>(
  "AgentVersionSummary",
)({
  agentName: S.String,
  agentStatus: S.String,
  agentVersion: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  description: S.optional(S.String),
  guardrailConfiguration: S.optional(GuardrailConfiguration),
}) {}
export const AgentVersionSummaries = S.Array(AgentVersionSummary);
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
export class MissingEndingNodesFlowValidationDetails extends S.Class<MissingEndingNodesFlowValidationDetails>(
  "MissingEndingNodesFlowValidationDetails",
)({}) {}
export class MissingStartingNodesFlowValidationDetails extends S.Class<MissingStartingNodesFlowValidationDetails>(
  "MissingStartingNodesFlowValidationDetails",
)({}) {}
export class UnspecifiedFlowValidationDetails extends S.Class<UnspecifiedFlowValidationDetails>(
  "UnspecifiedFlowValidationDetails",
)({}) {}
export class CustomS3Location extends S.Class<CustomS3Location>(
  "CustomS3Location",
)({ uri: S.String, bucketOwnerAccountId: S.optional(S.String) }) {}
export class S3Content extends S.Class<S3Content>("S3Content")({
  s3Location: S3Location,
}) {}
export class GetAgentActionGroupResponse extends S.Class<GetAgentActionGroupResponse>(
  "GetAgentActionGroupResponse",
)({ agentActionGroup: AgentActionGroup }) {}
export class ListAgentActionGroupsResponse extends S.Class<ListAgentActionGroupsResponse>(
  "ListAgentActionGroupsResponse",
)({
  actionGroupSummaries: ActionGroupSummaries,
  nextToken: S.optional(S.String),
}) {}
export class AssociateAgentCollaboratorResponse extends S.Class<AssociateAgentCollaboratorResponse>(
  "AssociateAgentCollaboratorResponse",
)({ agentCollaborator: AgentCollaborator }) {}
export class GetAgentCollaboratorResponse extends S.Class<GetAgentCollaboratorResponse>(
  "GetAgentCollaboratorResponse",
)({ agentCollaborator: AgentCollaborator }) {}
export class ListAgentCollaboratorsResponse extends S.Class<ListAgentCollaboratorsResponse>(
  "ListAgentCollaboratorsResponse",
)({
  agentCollaboratorSummaries: AgentCollaboratorSummaries,
  nextToken: S.optional(S.String),
}) {}
export class GetAgentResponse extends S.Class<GetAgentResponse>(
  "GetAgentResponse",
)({ agent: Agent }) {}
export class ListAgentsResponse extends S.Class<ListAgentsResponse>(
  "ListAgentsResponse",
)({ agentSummaries: AgentSummaries, nextToken: S.optional(S.String) }) {}
export class CreateAgentAliasResponse extends S.Class<CreateAgentAliasResponse>(
  "CreateAgentAliasResponse",
)({ agentAlias: AgentAlias }) {}
export class ListAgentAliasesResponse extends S.Class<ListAgentAliasesResponse>(
  "ListAgentAliasesResponse",
)({
  agentAliasSummaries: AgentAliasSummaries,
  nextToken: S.optional(S.String),
}) {}
export class GetDataSourceResponse extends S.Class<GetDataSourceResponse>(
  "GetDataSourceResponse",
)({ dataSource: DataSource }) {}
export class ListDataSourcesResponse extends S.Class<ListDataSourcesResponse>(
  "ListDataSourcesResponse",
)({
  dataSourceSummaries: DataSourceSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListFlowsResponse extends S.Class<ListFlowsResponse>(
  "ListFlowsResponse",
)({ flowSummaries: FlowSummaries, nextToken: S.optional(S.String) }) {}
export class CreateFlowAliasResponse extends S.Class<CreateFlowAliasResponse>(
  "CreateFlowAliasResponse",
)({
  name: S.String,
  description: S.optional(S.String),
  routingConfiguration: FlowAliasRoutingConfiguration,
  concurrencyConfiguration: S.optional(FlowAliasConcurrencyConfiguration),
  flowId: S.String,
  id: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListFlowAliasesResponse extends S.Class<ListFlowAliasesResponse>(
  "ListFlowAliasesResponse",
)({
  flowAliasSummaries: FlowAliasSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListFlowVersionsResponse extends S.Class<ListFlowVersionsResponse>(
  "ListFlowVersionsResponse",
)({
  flowVersionSummaries: FlowVersionSummaries,
  nextToken: S.optional(S.String),
}) {}
export class DeleteKnowledgeBaseDocumentsRequest extends S.Class<DeleteKnowledgeBaseDocumentsRequest>(
  "DeleteKnowledgeBaseDocumentsRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    clientToken: S.optional(S.String),
    documentIdentifiers: DocumentIdentifiers,
  },
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
) {}
export class GetKnowledgeBaseDocumentsResponse extends S.Class<GetKnowledgeBaseDocumentsResponse>(
  "GetKnowledgeBaseDocumentsResponse",
)({ documentDetails: S.optional(KnowledgeBaseDocumentDetails) }) {}
export const StringListValue = S.Array(S.String);
export class AssociateAgentKnowledgeBaseResponse extends S.Class<AssociateAgentKnowledgeBaseResponse>(
  "AssociateAgentKnowledgeBaseResponse",
)({ agentKnowledgeBase: AgentKnowledgeBase }) {}
export class GetKnowledgeBaseResponse extends S.Class<GetKnowledgeBaseResponse>(
  "GetKnowledgeBaseResponse",
)({ knowledgeBase: KnowledgeBase }) {}
export class ListAgentKnowledgeBasesResponse extends S.Class<ListAgentKnowledgeBasesResponse>(
  "ListAgentKnowledgeBasesResponse",
)({
  agentKnowledgeBaseSummaries: AgentKnowledgeBaseSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListKnowledgeBasesResponse extends S.Class<ListKnowledgeBasesResponse>(
  "ListKnowledgeBasesResponse",
)({
  knowledgeBaseSummaries: KnowledgeBaseSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListPromptsResponse extends S.Class<ListPromptsResponse>(
  "ListPromptsResponse",
)({ promptSummaries: PromptSummaries, nextToken: S.optional(S.String) }) {}
export class GetAgentVersionResponse extends S.Class<GetAgentVersionResponse>(
  "GetAgentVersionResponse",
)({ agentVersion: AgentVersion }) {}
export class ListAgentVersionsResponse extends S.Class<ListAgentVersionsResponse>(
  "ListAgentVersionsResponse",
)({
  agentVersionSummaries: AgentVersionSummaries,
  nextToken: S.optional(S.String),
}) {}
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
export class MetadataAttributeValue extends S.Class<MetadataAttributeValue>(
  "MetadataAttributeValue",
)({
  type: S.String,
  numberValue: S.optional(S.Number),
  booleanValue: S.optional(S.Boolean),
  stringValue: S.optional(S.String),
  stringListValue: S.optional(StringListValue),
}) {}
export class IngestionJobSummary extends S.Class<IngestionJobSummary>(
  "IngestionJobSummary",
)({
  knowledgeBaseId: S.String,
  dataSourceId: S.String,
  ingestionJobId: S.String,
  description: S.optional(S.String),
  status: S.String,
  startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  statistics: S.optional(IngestionJobStatistics),
}) {}
export const IngestionJobSummaries = S.Array(IngestionJobSummary);
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
export class MetadataAttribute extends S.Class<MetadataAttribute>(
  "MetadataAttribute",
)({ key: S.String, value: MetadataAttributeValue }) {}
export const MetadataAttributes = S.Array(MetadataAttribute);
export class KnowledgeBasePromptTemplate extends S.Class<KnowledgeBasePromptTemplate>(
  "KnowledgeBasePromptTemplate",
)({ textPromptTemplate: S.optional(S.String) }) {}
export const FlowConditions = S.Array(FlowCondition);
export class CreateAgentRequest extends S.Class<CreateAgentRequest>(
  "CreateAgentRequest",
)(
  {
    agentName: S.String,
    clientToken: S.optional(S.String),
    instruction: S.optional(S.String),
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
  },
  T.all(
    T.Http({ method: "PUT", uri: "/agents/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAgentAliasResponse extends S.Class<GetAgentAliasResponse>(
  "GetAgentAliasResponse",
)({ agentAlias: AgentAlias }) {}
export class GetIngestionJobResponse extends S.Class<GetIngestionJobResponse>(
  "GetIngestionJobResponse",
)({ ingestionJob: IngestionJob }) {}
export class ListIngestionJobsResponse extends S.Class<ListIngestionJobsResponse>(
  "ListIngestionJobsResponse",
)({
  ingestionJobSummaries: IngestionJobSummaries,
  nextToken: S.optional(S.String),
}) {}
export class DeleteKnowledgeBaseDocumentsResponse extends S.Class<DeleteKnowledgeBaseDocumentsResponse>(
  "DeleteKnowledgeBaseDocumentsResponse",
)({ documentDetails: S.optional(KnowledgeBaseDocumentDetails) }) {}
export class ByteContentDoc extends S.Class<ByteContentDoc>("ByteContentDoc")({
  mimeType: S.String,
  data: T.Blob,
}) {}
export class TextContentDoc extends S.Class<TextContentDoc>("TextContentDoc")({
  data: S.String,
}) {}
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
export class DocumentMetadata extends S.Class<DocumentMetadata>(
  "DocumentMetadata",
)({
  type: S.String,
  inlineAttributes: S.optional(MetadataAttributes),
  s3Location: S.optional(CustomS3Location),
}) {}
export class ConditionFlowNodeConfiguration extends S.Class<ConditionFlowNodeConfiguration>(
  "ConditionFlowNodeConfiguration",
)({ conditions: FlowConditions }) {}
export class InlineContent extends S.Class<InlineContent>("InlineContent")({
  type: S.String,
  byteContent: S.optional(ByteContentDoc),
  textContent: S.optional(TextContentDoc),
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
export class PromptFlowNodeInlineConfiguration extends S.Class<PromptFlowNodeInlineConfiguration>(
  "PromptFlowNodeInlineConfiguration",
)({
  templateType: S.String,
  templateConfiguration: PromptTemplateConfiguration,
  modelId: S.String,
  inferenceConfiguration: S.optional(PromptInferenceConfiguration),
  additionalModelRequestFields: S.optional(S.Any),
}) {}
export class StorageFlowNodeS3Configuration extends S.Class<StorageFlowNodeS3Configuration>(
  "StorageFlowNodeS3Configuration",
)({ bucketName: S.String }) {}
export class RetrievalFlowNodeS3Configuration extends S.Class<RetrievalFlowNodeS3Configuration>(
  "RetrievalFlowNodeS3Configuration",
)({ bucketName: S.String }) {}
export class FlowValidation extends S.Class<FlowValidation>("FlowValidation")({
  message: S.String,
  severity: S.String,
  details: S.optional(FlowValidationDetails),
  type: S.optional(S.String),
}) {}
export const FlowValidations = S.Array(FlowValidation);
export class CustomContent extends S.Class<CustomContent>("CustomContent")({
  customDocumentIdentifier: CustomDocumentIdentifier,
  sourceType: S.String,
  s3Location: S.optional(CustomS3Location),
  inlineContent: S.optional(InlineContent),
}) {}
export class KnowledgeBaseOrchestrationConfiguration extends S.Class<KnowledgeBaseOrchestrationConfiguration>(
  "KnowledgeBaseOrchestrationConfiguration",
)({
  promptTemplate: S.optional(KnowledgeBasePromptTemplate),
  inferenceConfig: S.optional(PromptInferenceConfiguration),
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
  performanceConfig: S.optional(PerformanceConfiguration),
}) {}
export const PromptFlowNodeSourceConfiguration = S.Union(
  S.Struct({ resource: PromptFlowNodeResourceConfiguration }),
  S.Struct({ inline: PromptFlowNodeInlineConfiguration }),
);
export const StorageFlowNodeServiceConfiguration = S.Union(
  S.Struct({ s3: StorageFlowNodeS3Configuration }),
);
export const RetrievalFlowNodeServiceConfiguration = S.Union(
  S.Struct({ s3: RetrievalFlowNodeS3Configuration }),
);
export class CreateAgentActionGroupRequest extends S.Class<CreateAgentActionGroupRequest>(
  "CreateAgentActionGroupRequest",
)(
  {
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
  },
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
) {}
export class CreateAgentResponse extends S.Class<CreateAgentResponse>(
  "CreateAgentResponse",
)({ agent: Agent }) {}
export class GetFlowResponse extends S.Class<GetFlowResponse>(
  "GetFlowResponse",
)({
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
}) {}
export class VectorSearchBedrockRerankingModelConfiguration extends S.Class<VectorSearchBedrockRerankingModelConfiguration>(
  "VectorSearchBedrockRerankingModelConfiguration",
)({
  modelArn: S.String,
  additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
}) {}
export class DocumentContent extends S.Class<DocumentContent>(
  "DocumentContent",
)({
  dataSourceType: S.String,
  custom: S.optional(CustomContent),
  s3: S.optional(S3Content),
}) {}
export class PromptFlowNodeConfiguration extends S.Class<PromptFlowNodeConfiguration>(
  "PromptFlowNodeConfiguration",
)({
  sourceConfiguration: PromptFlowNodeSourceConfiguration,
  guardrailConfiguration: S.optional(GuardrailConfiguration),
}) {}
export class StorageFlowNodeConfiguration extends S.Class<StorageFlowNodeConfiguration>(
  "StorageFlowNodeConfiguration",
)({ serviceConfiguration: StorageFlowNodeServiceConfiguration }) {}
export class RetrievalFlowNodeConfiguration extends S.Class<RetrievalFlowNodeConfiguration>(
  "RetrievalFlowNodeConfiguration",
)({ serviceConfiguration: RetrievalFlowNodeServiceConfiguration }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class KnowledgeBaseDocument extends S.Class<KnowledgeBaseDocument>(
  "KnowledgeBaseDocument",
)({ metadata: S.optional(DocumentMetadata), content: DocumentContent }) {}
export const KnowledgeBaseDocuments = S.Array(KnowledgeBaseDocument);
export class CreateAgentActionGroupResponse extends S.Class<CreateAgentActionGroupResponse>(
  "CreateAgentActionGroupResponse",
)({ agentActionGroup: AgentActionGroup }) {}
export class IngestKnowledgeBaseDocumentsRequest extends S.Class<IngestKnowledgeBaseDocumentsRequest>(
  "IngestKnowledgeBaseDocumentsRequest",
)(
  {
    knowledgeBaseId: S.String.pipe(T.HttpLabel("knowledgeBaseId")),
    dataSourceId: S.String.pipe(T.HttpLabel("dataSourceId")),
    clientToken: S.optional(S.String),
    documents: KnowledgeBaseDocuments,
  },
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
) {}
export class FieldForReranking extends S.Class<FieldForReranking>(
  "FieldForReranking",
)({ fieldName: S.String }) {}
export const FieldsForReranking = S.Array(FieldForReranking);
export const RerankingMetadataSelectiveModeConfiguration = S.Union(
  S.Struct({ fieldsToInclude: FieldsForReranking }),
  S.Struct({ fieldsToExclude: FieldsForReranking }),
);
export class CreateDataSourceRequest extends S.Class<CreateDataSourceRequest>(
  "CreateDataSourceRequest",
)(
  {
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
  },
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
) {}
export class IngestKnowledgeBaseDocumentsResponse extends S.Class<IngestKnowledgeBaseDocumentsResponse>(
  "IngestKnowledgeBaseDocumentsResponse",
)({ documentDetails: S.optional(KnowledgeBaseDocumentDetails) }) {}
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
export class CreateDataSourceResponse extends S.Class<CreateDataSourceResponse>(
  "CreateDataSourceResponse",
)({ dataSource: DataSource }) {}
export class CreateKnowledgeBaseRequest extends S.Class<CreateKnowledgeBaseRequest>(
  "CreateKnowledgeBaseRequest",
)(
  {
    clientToken: S.optional(S.String),
    name: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    knowledgeBaseConfiguration: KnowledgeBaseConfiguration,
    storageConfiguration: S.optional(StorageConfiguration),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/knowledgebases/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePromptRequest extends S.Class<CreatePromptRequest>(
  "CreatePromptRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    customerEncryptionKeyArn: S.optional(S.String),
    defaultVariant: S.optional(S.String),
    variants: S.optional(PromptVariantList),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prompts/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
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
export class CreateKnowledgeBaseResponse extends S.Class<CreateKnowledgeBaseResponse>(
  "CreateKnowledgeBaseResponse",
)({ knowledgeBase: KnowledgeBase }) {}
export class CreatePromptResponse extends S.Class<CreatePromptResponse>(
  "CreatePromptResponse",
)({
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
}) {}
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
export class ValidateFlowDefinitionResponse extends S.Class<ValidateFlowDefinitionResponse>(
  "ValidateFlowDefinitionResponse",
)({ validations: FlowValidations }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
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
 * Returns a list of flows and information about each flow. For more information, see Manage a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const listFlows = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getIngestionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listIngestionJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Creates a prompt flow that you can use to send an input through various steps to yield an output. Configure nodes, each of which corresponds to a step of the flow, and create connections between the nodes to create paths to different outputs. For more information, see How it works and Create a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const createFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAgentAliases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Gets information about a data source.
 */
export const getDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDataSources = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Creates an alias of a flow for deployment. For more information, see Deploy a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const createFlowAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFlowAliases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns a list of information about each flow. For more information, see Deploy a flow in Amazon Bedrock in the Amazon Bedrock User Guide.
 */
export const listFlowVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Retrieves specific documents from a data source that is connected to a knowledge base. For more information, see Ingest changes directly into a knowledge base in the Amazon Bedrock User Guide.
 */
export const getKnowledgeBaseDocuments = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Associates a knowledge base with an agent. If a knowledge base is associated and its `indexState` is set to `Enabled`, the agent queries the knowledge base for information to augment its response to the user.
 */
export const associateAgentKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Gets information about a knowledge base.
 */
export const getKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAgentKnowledgeBases =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPrompts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Gets details about a version of an agent.
 */
export const getAgentVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAgentVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Updates the configuration for an action group for an agent.
 */
export const updateAgentActionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates an agent's collaborator.
 */
export const updateAgentCollaborator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes an agent.
 */
export const deleteAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const prepareAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAgentAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const prepareFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFlowAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFlowAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFlowVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFlowVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startIngestionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopIngestionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAgentKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const updateKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPromptVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAgentVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateAgentCollaborator =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateAgentKnowledgeBase =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFlowAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFlowVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listKnowledgeBaseDocuments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getAgentKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAgentKnowledgeBaseRequest,
    output: GetAgentKnowledgeBaseResponse,
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
 * Retrieves information about the working draft (`DRAFT` version) of a prompt or a version of it, depending on whether you include the `promptVersion` field or not. For more information, see View information about prompts using Prompt management and View information about a version of your prompt in the Amazon Bedrock User Guide.
 */
export const getPrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an action group in an agent.
 */
export const deleteAgentActionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Gets information about an action group for an agent.
 */
export const getAgentActionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAgentActionGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const associateAgentCollaborator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves information about an agent's collaborator.
 */
export const getAgentCollaborator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAgentCollaboratorRequest,
    output: GetAgentCollaboratorResponse,
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
 * Retrieve a list of an agent's collaborators.
 */
export const listAgentCollaborators =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAgentAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listKnowledgeBases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists the agents belonging to an account and information about each agent.
 */
export const listAgents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteAgentAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAgentAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteKnowledgeBaseDocuments =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAgentActionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Ingests documents directly into the knowledge base that is connected to the data source. The `dataSourceType` specified in the content for each document must match the type of the data source that you specify in the header. For more information, see Ingest changes directly into a knowledge base in the Amazon Bedrock User Guide.
 */
export const ingestKnowledgeBaseDocuments =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createKnowledgeBase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPrompt = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
