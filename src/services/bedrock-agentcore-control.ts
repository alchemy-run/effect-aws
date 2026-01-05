import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Bedrock AgentCore Control",
  serviceShapeName: "AmazonBedrockAgentCoreControl",
});
const auth = T.AwsAuthSigv4({ name: "bedrock-agentcore" });
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
                                url: "https://bedrock-agentcore-control-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://bedrock-agentcore-control-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://bedrock-agentcore-control.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://bedrock-agentcore-control.{Region}.{PartitionResult#dnsSuffix}",
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
export const TargetIdList = S.Array(S.String);
export const ResourceOauth2ReturnUrlListType = S.Array(S.String);
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/resourcepolicy/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/resourcepolicy/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTokenVaultRequest extends S.Class<GetTokenVaultRequest>(
  "GetTokenVaultRequest",
)(
  { tokenVaultId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/identities/get-token-vault" }),
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
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), policy: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/resourcepolicy/{resourceArn}" }),
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
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class CreateAgentRuntimeEndpointRequest extends S.Class<CreateAgentRuntimeEndpointRequest>(
  "CreateAgentRuntimeEndpointRequest",
)(
  {
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    name: S.String,
    agentRuntimeVersion: S.optional(S.String),
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/runtimes/{agentRuntimeId}/runtime-endpoints/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAgentRuntimeEndpointRequest extends S.Class<GetAgentRuntimeEndpointRequest>(
  "GetAgentRuntimeEndpointRequest",
)(
  {
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    endpointName: S.String.pipe(T.HttpLabel("endpointName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/runtimes/{agentRuntimeId}/runtime-endpoints/{endpointName}/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAgentRuntimeEndpointRequest extends S.Class<UpdateAgentRuntimeEndpointRequest>(
  "UpdateAgentRuntimeEndpointRequest",
)(
  {
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    endpointName: S.String.pipe(T.HttpLabel("endpointName")),
    agentRuntimeVersion: S.optional(S.String),
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/runtimes/{agentRuntimeId}/runtime-endpoints/{endpointName}/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAgentRuntimeEndpointRequest extends S.Class<DeleteAgentRuntimeEndpointRequest>(
  "DeleteAgentRuntimeEndpointRequest",
)(
  {
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    endpointName: S.String.pipe(T.HttpLabel("endpointName")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/runtimes/{agentRuntimeId}/runtime-endpoints/{endpointName}/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAgentRuntimeEndpointsRequest extends S.Class<ListAgentRuntimeEndpointsRequest>(
  "ListAgentRuntimeEndpointsRequest",
)(
  {
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/runtimes/{agentRuntimeId}/runtime-endpoints/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAgentRuntimeRequest extends S.Class<GetAgentRuntimeRequest>(
  "GetAgentRuntimeRequest",
)(
  {
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    agentRuntimeVersion: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/runtimes/{agentRuntimeId}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ContainerConfiguration extends S.Class<ContainerConfiguration>(
  "ContainerConfiguration",
)({ containerUri: S.String }) {}
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucket: S.String,
  prefix: S.String,
  versionId: S.optional(S.String),
}) {}
export const Code = S.Union(S.Struct({ s3: S3Location }));
export const EntryPoints = S.Array(S.String);
export class CodeConfiguration extends S.Class<CodeConfiguration>(
  "CodeConfiguration",
)({ code: Code, runtime: S.String, entryPoint: EntryPoints }) {}
export const AgentRuntimeArtifact = S.Union(
  S.Struct({ containerConfiguration: ContainerConfiguration }),
  S.Struct({ codeConfiguration: CodeConfiguration }),
);
export const SecurityGroups = S.Array(S.String);
export const Subnets = S.Array(S.String);
export class VpcConfig extends S.Class<VpcConfig>("VpcConfig")({
  securityGroups: SecurityGroups,
  subnets: Subnets,
}) {}
export class NetworkConfiguration extends S.Class<NetworkConfiguration>(
  "NetworkConfiguration",
)({ networkMode: S.String, networkModeConfig: S.optional(VpcConfig) }) {}
export const AllowedAudienceList = S.Array(S.String);
export const AllowedClientsList = S.Array(S.String);
export const AllowedScopesType = S.Array(S.String);
export const MatchValueStringList = S.Array(S.String);
export const ClaimMatchValueType = S.Union(
  S.Struct({ matchValueString: S.String }),
  S.Struct({ matchValueStringList: MatchValueStringList }),
);
export class AuthorizingClaimMatchValueType extends S.Class<AuthorizingClaimMatchValueType>(
  "AuthorizingClaimMatchValueType",
)({ claimMatchValue: ClaimMatchValueType, claimMatchOperator: S.String }) {}
export class CustomClaimValidationType extends S.Class<CustomClaimValidationType>(
  "CustomClaimValidationType",
)({
  inboundTokenClaimName: S.String,
  inboundTokenClaimValueType: S.String,
  authorizingClaimMatchValue: AuthorizingClaimMatchValueType,
}) {}
export const CustomClaimValidationsType = S.Array(CustomClaimValidationType);
export class CustomJWTAuthorizerConfiguration extends S.Class<CustomJWTAuthorizerConfiguration>(
  "CustomJWTAuthorizerConfiguration",
)({
  discoveryUrl: S.String,
  allowedAudience: S.optional(AllowedAudienceList),
  allowedClients: S.optional(AllowedClientsList),
  allowedScopes: S.optional(AllowedScopesType),
  customClaims: S.optional(CustomClaimValidationsType),
}) {}
export const AuthorizerConfiguration = S.Union(
  S.Struct({ customJWTAuthorizer: CustomJWTAuthorizerConfiguration }),
);
export const RequestHeaderAllowlist = S.Array(S.String);
export const RequestHeaderConfiguration = S.Union(
  S.Struct({ requestHeaderAllowlist: RequestHeaderAllowlist }),
);
export class ProtocolConfiguration extends S.Class<ProtocolConfiguration>(
  "ProtocolConfiguration",
)({ serverProtocol: S.String }) {}
export class LifecycleConfiguration extends S.Class<LifecycleConfiguration>(
  "LifecycleConfiguration",
)({
  idleRuntimeSessionTimeout: S.optional(S.Number),
  maxLifetime: S.optional(S.Number),
}) {}
export const EnvironmentVariablesMap = S.Record({
  key: S.String,
  value: S.String,
});
export class UpdateAgentRuntimeRequest extends S.Class<UpdateAgentRuntimeRequest>(
  "UpdateAgentRuntimeRequest",
)(
  {
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    agentRuntimeArtifact: AgentRuntimeArtifact,
    roleArn: S.String,
    networkConfiguration: NetworkConfiguration,
    description: S.optional(S.String),
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    requestHeaderConfiguration: S.optional(RequestHeaderConfiguration),
    protocolConfiguration: S.optional(ProtocolConfiguration),
    lifecycleConfiguration: S.optional(LifecycleConfiguration),
    environmentVariables: S.optional(EnvironmentVariablesMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/runtimes/{agentRuntimeId}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAgentRuntimeRequest extends S.Class<DeleteAgentRuntimeRequest>(
  "DeleteAgentRuntimeRequest",
)(
  {
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/runtimes/{agentRuntimeId}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAgentRuntimesRequest extends S.Class<ListAgentRuntimesRequest>(
  "ListAgentRuntimesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/runtimes/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAgentRuntimeVersionsRequest extends S.Class<ListAgentRuntimeVersionsRequest>(
  "ListAgentRuntimeVersionsRequest",
)(
  {
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/runtimes/{agentRuntimeId}/versions/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateApiKeyCredentialProviderRequest extends S.Class<CreateApiKeyCredentialProviderRequest>(
  "CreateApiKeyCredentialProviderRequest",
)(
  { name: S.String, apiKey: S.String, tags: S.optional(TagsMap) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identities/CreateApiKeyCredentialProvider",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApiKeyCredentialProviderRequest extends S.Class<GetApiKeyCredentialProviderRequest>(
  "GetApiKeyCredentialProviderRequest",
)(
  { name: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/identities/GetApiKeyCredentialProvider" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApiKeyCredentialProviderRequest extends S.Class<UpdateApiKeyCredentialProviderRequest>(
  "UpdateApiKeyCredentialProviderRequest",
)(
  { name: S.String, apiKey: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identities/UpdateApiKeyCredentialProvider",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApiKeyCredentialProviderRequest extends S.Class<DeleteApiKeyCredentialProviderRequest>(
  "DeleteApiKeyCredentialProviderRequest",
)(
  { name: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identities/DeleteApiKeyCredentialProvider",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApiKeyCredentialProviderResponse extends S.Class<DeleteApiKeyCredentialProviderResponse>(
  "DeleteApiKeyCredentialProviderResponse",
)({}) {}
export class ListApiKeyCredentialProvidersRequest extends S.Class<ListApiKeyCredentialProvidersRequest>(
  "ListApiKeyCredentialProvidersRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identities/ListApiKeyCredentialProviders",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBrowserRequest extends S.Class<GetBrowserRequest>(
  "GetBrowserRequest",
)(
  { browserId: S.String.pipe(T.HttpLabel("browserId")) },
  T.all(
    T.Http({ method: "GET", uri: "/browsers/{browserId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBrowserRequest extends S.Class<DeleteBrowserRequest>(
  "DeleteBrowserRequest",
)(
  {
    browserId: S.String.pipe(T.HttpLabel("browserId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/browsers/{browserId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBrowsersRequest extends S.Class<ListBrowsersRequest>(
  "ListBrowsersRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/browsers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCodeInterpreterRequest extends S.Class<GetCodeInterpreterRequest>(
  "GetCodeInterpreterRequest",
)(
  { codeInterpreterId: S.String.pipe(T.HttpLabel("codeInterpreterId")) },
  T.all(
    T.Http({ method: "GET", uri: "/code-interpreters/{codeInterpreterId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCodeInterpreterRequest extends S.Class<DeleteCodeInterpreterRequest>(
  "DeleteCodeInterpreterRequest",
)(
  {
    codeInterpreterId: S.String.pipe(T.HttpLabel("codeInterpreterId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/code-interpreters/{codeInterpreterId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCodeInterpretersRequest extends S.Class<ListCodeInterpretersRequest>(
  "ListCodeInterpretersRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/code-interpreters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEvaluatorRequest extends S.Class<GetEvaluatorRequest>(
  "GetEvaluatorRequest",
)(
  { evaluatorId: S.String.pipe(T.HttpLabel("evaluatorId")) },
  T.all(
    T.Http({ method: "GET", uri: "/evaluators/{evaluatorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class NumericalScaleDefinition extends S.Class<NumericalScaleDefinition>(
  "NumericalScaleDefinition",
)({ definition: S.String, value: S.Number, label: S.String }) {}
export const NumericalScaleDefinitions = S.Array(NumericalScaleDefinition);
export class CategoricalScaleDefinition extends S.Class<CategoricalScaleDefinition>(
  "CategoricalScaleDefinition",
)({ definition: S.String, label: S.String }) {}
export const CategoricalScaleDefinitions = S.Array(CategoricalScaleDefinition);
export const RatingScale = S.Union(
  S.Struct({ numerical: NumericalScaleDefinitions }),
  S.Struct({ categorical: CategoricalScaleDefinitions }),
);
export const NonEmptyStringList = S.Array(S.String);
export class InferenceConfiguration extends S.Class<InferenceConfiguration>(
  "InferenceConfiguration",
)({
  maxTokens: S.optional(S.Number),
  temperature: S.optional(S.Number),
  topP: S.optional(S.Number),
  stopSequences: S.optional(NonEmptyStringList),
}) {}
export class BedrockEvaluatorModelConfig extends S.Class<BedrockEvaluatorModelConfig>(
  "BedrockEvaluatorModelConfig",
)({
  modelId: S.String,
  inferenceConfig: S.optional(InferenceConfiguration),
  additionalModelRequestFields: S.optional(S.Any),
}) {}
export const EvaluatorModelConfig = S.Union(
  S.Struct({ bedrockEvaluatorModelConfig: BedrockEvaluatorModelConfig }),
);
export class LlmAsAJudgeEvaluatorConfig extends S.Class<LlmAsAJudgeEvaluatorConfig>(
  "LlmAsAJudgeEvaluatorConfig",
)({
  instructions: S.String,
  ratingScale: RatingScale,
  modelConfig: EvaluatorModelConfig,
}) {}
export const EvaluatorConfig = S.Union(
  S.Struct({ llmAsAJudge: LlmAsAJudgeEvaluatorConfig }),
);
export class UpdateEvaluatorRequest extends S.Class<UpdateEvaluatorRequest>(
  "UpdateEvaluatorRequest",
)(
  {
    clientToken: S.optional(S.String),
    evaluatorId: S.String.pipe(T.HttpLabel("evaluatorId")),
    description: S.optional(S.String),
    evaluatorConfig: S.optional(EvaluatorConfig),
    level: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/evaluators/{evaluatorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEvaluatorRequest extends S.Class<DeleteEvaluatorRequest>(
  "DeleteEvaluatorRequest",
)(
  { evaluatorId: S.String.pipe(T.HttpLabel("evaluatorId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/evaluators/{evaluatorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEvaluatorsRequest extends S.Class<ListEvaluatorsRequest>(
  "ListEvaluatorsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/evaluators" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGatewayRequest extends S.Class<DeleteGatewayRequest>(
  "DeleteGatewayRequest",
)(
  { gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/gateways/{gatewayIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGatewayRequest extends S.Class<GetGatewayRequest>(
  "GetGatewayRequest",
)(
  { gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/gateways/{gatewayIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGatewaysRequest extends S.Class<ListGatewaysRequest>(
  "ListGatewaysRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/gateways/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const McpSupportedVersions = S.Array(S.String);
export class MCPGatewayConfiguration extends S.Class<MCPGatewayConfiguration>(
  "MCPGatewayConfiguration",
)({
  supportedVersions: S.optional(McpSupportedVersions),
  instructions: S.optional(S.String),
  searchType: S.optional(S.String),
}) {}
export const GatewayProtocolConfiguration = S.Union(
  S.Struct({ mcp: MCPGatewayConfiguration }),
);
export class LambdaInterceptorConfiguration extends S.Class<LambdaInterceptorConfiguration>(
  "LambdaInterceptorConfiguration",
)({ arn: S.String }) {}
export const InterceptorConfiguration = S.Union(
  S.Struct({ lambda: LambdaInterceptorConfiguration }),
);
export const GatewayInterceptionPoints = S.Array(S.String);
export class InterceptorInputConfiguration extends S.Class<InterceptorInputConfiguration>(
  "InterceptorInputConfiguration",
)({ passRequestHeaders: S.Boolean }) {}
export class GatewayInterceptorConfiguration extends S.Class<GatewayInterceptorConfiguration>(
  "GatewayInterceptorConfiguration",
)({
  interceptor: InterceptorConfiguration,
  interceptionPoints: GatewayInterceptionPoints,
  inputConfiguration: S.optional(InterceptorInputConfiguration),
}) {}
export const GatewayInterceptorConfigurations = S.Array(
  GatewayInterceptorConfiguration,
);
export class GatewayPolicyEngineConfiguration extends S.Class<GatewayPolicyEngineConfiguration>(
  "GatewayPolicyEngineConfiguration",
)({ arn: S.String, mode: S.String }) {}
export class UpdateGatewayRequest extends S.Class<UpdateGatewayRequest>(
  "UpdateGatewayRequest",
)(
  {
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    protocolType: S.String,
    protocolConfiguration: S.optional(GatewayProtocolConfiguration),
    authorizerType: S.String,
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    kmsKeyArn: S.optional(S.String),
    interceptorConfigurations: S.optional(GatewayInterceptorConfigurations),
    policyEngineConfiguration: S.optional(GatewayPolicyEngineConfiguration),
    exceptionLevel: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/gateways/{gatewayIdentifier}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGatewayTargetRequest extends S.Class<DeleteGatewayTargetRequest>(
  "DeleteGatewayTargetRequest",
)(
  {
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    targetId: S.String.pipe(T.HttpLabel("targetId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/gateways/{gatewayIdentifier}/targets/{targetId}/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGatewayTargetRequest extends S.Class<GetGatewayTargetRequest>(
  "GetGatewayTargetRequest",
)(
  {
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    targetId: S.String.pipe(T.HttpLabel("targetId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/gateways/{gatewayIdentifier}/targets/{targetId}/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGatewayTargetsRequest extends S.Class<ListGatewayTargetsRequest>(
  "ListGatewayTargetsRequest",
)(
  {
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/gateways/{gatewayIdentifier}/targets/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SynchronizeGatewayTargetsRequest extends S.Class<SynchronizeGatewayTargetsRequest>(
  "SynchronizeGatewayTargetsRequest",
)(
  {
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    targetIdList: TargetIdList,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/gateways/{gatewayIdentifier}/synchronizeTargets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3Configuration extends S.Class<S3Configuration>(
  "S3Configuration",
)({ uri: S.optional(S.String), bucketOwnerAccountId: S.optional(S.String) }) {}
export const ApiSchemaConfiguration = S.Union(
  S.Struct({ s3: S3Configuration }),
  S.Struct({ inlinePayload: S.String }),
);
export const RequiredProperties = S.Array(S.String);
export class SchemaDefinition extends S.Class<SchemaDefinition>(
  "SchemaDefinition",
)({
  type: S.String,
  properties: S.optional(S.suspend(() => SchemaProperties)),
  required: S.optional(RequiredProperties),
  items: S.optional(
    S.suspend((): S.Schema<SchemaDefinition, any> => SchemaDefinition),
  ),
  description: S.optional(S.String),
}) {}
export class ToolDefinition extends S.Class<ToolDefinition>("ToolDefinition")({
  name: S.String,
  description: S.String,
  inputSchema: SchemaDefinition,
  outputSchema: S.optional(SchemaDefinition),
}) {}
export const ToolDefinitions = S.Array(ToolDefinition);
export const ToolSchema = S.Union(
  S.Struct({ s3: S3Configuration }),
  S.Struct({ inlinePayload: ToolDefinitions }),
);
export class McpLambdaTargetConfiguration extends S.Class<McpLambdaTargetConfiguration>(
  "McpLambdaTargetConfiguration",
)({ lambdaArn: S.String, toolSchema: ToolSchema }) {}
export class McpServerTargetConfiguration extends S.Class<McpServerTargetConfiguration>(
  "McpServerTargetConfiguration",
)({ endpoint: S.String }) {}
export class ApiGatewayToolOverride extends S.Class<ApiGatewayToolOverride>(
  "ApiGatewayToolOverride",
)({
  name: S.String,
  description: S.optional(S.String),
  path: S.String,
  method: S.String,
}) {}
export const ApiGatewayToolOverrides = S.Array(ApiGatewayToolOverride);
export const RestApiMethods = S.Array(S.String);
export class ApiGatewayToolFilter extends S.Class<ApiGatewayToolFilter>(
  "ApiGatewayToolFilter",
)({ filterPath: S.String, methods: RestApiMethods }) {}
export const ApiGatewayToolFilters = S.Array(ApiGatewayToolFilter);
export class ApiGatewayToolConfiguration extends S.Class<ApiGatewayToolConfiguration>(
  "ApiGatewayToolConfiguration",
)({
  toolOverrides: S.optional(ApiGatewayToolOverrides),
  toolFilters: ApiGatewayToolFilters,
}) {}
export class ApiGatewayTargetConfiguration extends S.Class<ApiGatewayTargetConfiguration>(
  "ApiGatewayTargetConfiguration",
)({
  restApiId: S.String,
  stage: S.String,
  apiGatewayToolConfiguration: ApiGatewayToolConfiguration,
}) {}
export const McpTargetConfiguration = S.Union(
  S.Struct({ openApiSchema: ApiSchemaConfiguration }),
  S.Struct({ smithyModel: ApiSchemaConfiguration }),
  S.Struct({ lambda: McpLambdaTargetConfiguration }),
  S.Struct({ mcpServer: McpServerTargetConfiguration }),
  S.Struct({ apiGateway: ApiGatewayTargetConfiguration }),
);
export const TargetConfiguration = S.Union(
  S.Struct({ mcp: McpTargetConfiguration }),
);
export const OAuthScopes = S.Array(S.String);
export const OAuthCustomParameters = S.Record({
  key: S.String,
  value: S.String,
});
export class OAuthCredentialProvider extends S.Class<OAuthCredentialProvider>(
  "OAuthCredentialProvider",
)({
  providerArn: S.String,
  scopes: OAuthScopes,
  customParameters: S.optional(OAuthCustomParameters),
  grantType: S.optional(S.String),
  defaultReturnUrl: S.optional(S.String),
}) {}
export class GatewayApiKeyCredentialProvider extends S.Class<GatewayApiKeyCredentialProvider>(
  "GatewayApiKeyCredentialProvider",
)({
  providerArn: S.String,
  credentialParameterName: S.optional(S.String),
  credentialPrefix: S.optional(S.String),
  credentialLocation: S.optional(S.String),
}) {}
export const CredentialProvider = S.Union(
  S.Struct({ oauthCredentialProvider: OAuthCredentialProvider }),
  S.Struct({ apiKeyCredentialProvider: GatewayApiKeyCredentialProvider }),
);
export class CredentialProviderConfiguration extends S.Class<CredentialProviderConfiguration>(
  "CredentialProviderConfiguration",
)({
  credentialProviderType: S.String,
  credentialProvider: S.optional(CredentialProvider),
}) {}
export const CredentialProviderConfigurations = S.Array(
  CredentialProviderConfiguration,
);
export const AllowedRequestHeaders = S.Array(S.String);
export const AllowedQueryParameters = S.Array(S.String);
export const AllowedResponseHeaders = S.Array(S.String);
export class MetadataConfiguration extends S.Class<MetadataConfiguration>(
  "MetadataConfiguration",
)({
  allowedRequestHeaders: S.optional(AllowedRequestHeaders),
  allowedQueryParameters: S.optional(AllowedQueryParameters),
  allowedResponseHeaders: S.optional(AllowedResponseHeaders),
}) {}
export class UpdateGatewayTargetRequest extends S.Class<UpdateGatewayTargetRequest>(
  "UpdateGatewayTargetRequest",
)(
  {
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    targetId: S.String.pipe(T.HttpLabel("targetId")),
    name: S.String,
    description: S.optional(S.String),
    targetConfiguration: TargetConfiguration,
    credentialProviderConfigurations: S.optional(
      CredentialProviderConfigurations,
    ),
    metadataConfiguration: S.optional(MetadataConfiguration),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/gateways/{gatewayIdentifier}/targets/{targetId}/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMemoryInput extends S.Class<GetMemoryInput>("GetMemoryInput")(
  { memoryId: S.String.pipe(T.HttpLabel("memoryId")) },
  T.all(
    T.Http({ method: "GET", uri: "/memories/{memoryId}/details" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMemoryInput extends S.Class<DeleteMemoryInput>(
  "DeleteMemoryInput",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/memories/{memoryId}/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMemoriesInput extends S.Class<ListMemoriesInput>(
  "ListMemoriesInput",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/memories/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOauth2CredentialProviderRequest extends S.Class<GetOauth2CredentialProviderRequest>(
  "GetOauth2CredentialProviderRequest",
)(
  { name: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/identities/GetOauth2CredentialProvider" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ResponseListType = S.Array(S.String);
export const TokenEndpointAuthMethodsType = S.Array(S.String);
export class Oauth2AuthorizationServerMetadata extends S.Class<Oauth2AuthorizationServerMetadata>(
  "Oauth2AuthorizationServerMetadata",
)({
  issuer: S.String,
  authorizationEndpoint: S.String,
  tokenEndpoint: S.String,
  responseTypes: S.optional(ResponseListType),
  tokenEndpointAuthMethods: S.optional(TokenEndpointAuthMethodsType),
}) {}
export const Oauth2Discovery = S.Union(
  S.Struct({ discoveryUrl: S.String }),
  S.Struct({ authorizationServerMetadata: Oauth2AuthorizationServerMetadata }),
);
export class CustomOauth2ProviderConfigInput extends S.Class<CustomOauth2ProviderConfigInput>(
  "CustomOauth2ProviderConfigInput",
)({
  oauthDiscovery: Oauth2Discovery,
  clientId: S.String,
  clientSecret: S.String,
}) {}
export class GoogleOauth2ProviderConfigInput extends S.Class<GoogleOauth2ProviderConfigInput>(
  "GoogleOauth2ProviderConfigInput",
)({ clientId: S.String, clientSecret: S.String }) {}
export class GithubOauth2ProviderConfigInput extends S.Class<GithubOauth2ProviderConfigInput>(
  "GithubOauth2ProviderConfigInput",
)({ clientId: S.String, clientSecret: S.String }) {}
export class SlackOauth2ProviderConfigInput extends S.Class<SlackOauth2ProviderConfigInput>(
  "SlackOauth2ProviderConfigInput",
)({ clientId: S.String, clientSecret: S.String }) {}
export class SalesforceOauth2ProviderConfigInput extends S.Class<SalesforceOauth2ProviderConfigInput>(
  "SalesforceOauth2ProviderConfigInput",
)({ clientId: S.String, clientSecret: S.String }) {}
export class MicrosoftOauth2ProviderConfigInput extends S.Class<MicrosoftOauth2ProviderConfigInput>(
  "MicrosoftOauth2ProviderConfigInput",
)({
  clientId: S.String,
  clientSecret: S.String,
  tenantId: S.optional(S.String),
}) {}
export class AtlassianOauth2ProviderConfigInput extends S.Class<AtlassianOauth2ProviderConfigInput>(
  "AtlassianOauth2ProviderConfigInput",
)({ clientId: S.String, clientSecret: S.String }) {}
export class LinkedinOauth2ProviderConfigInput extends S.Class<LinkedinOauth2ProviderConfigInput>(
  "LinkedinOauth2ProviderConfigInput",
)({ clientId: S.String, clientSecret: S.String }) {}
export class IncludedOauth2ProviderConfigInput extends S.Class<IncludedOauth2ProviderConfigInput>(
  "IncludedOauth2ProviderConfigInput",
)({
  clientId: S.String,
  clientSecret: S.String,
  issuer: S.optional(S.String),
  authorizationEndpoint: S.optional(S.String),
  tokenEndpoint: S.optional(S.String),
}) {}
export const Oauth2ProviderConfigInput = S.Union(
  S.Struct({ customOauth2ProviderConfig: CustomOauth2ProviderConfigInput }),
  S.Struct({ googleOauth2ProviderConfig: GoogleOauth2ProviderConfigInput }),
  S.Struct({ githubOauth2ProviderConfig: GithubOauth2ProviderConfigInput }),
  S.Struct({ slackOauth2ProviderConfig: SlackOauth2ProviderConfigInput }),
  S.Struct({
    salesforceOauth2ProviderConfig: SalesforceOauth2ProviderConfigInput,
  }),
  S.Struct({
    microsoftOauth2ProviderConfig: MicrosoftOauth2ProviderConfigInput,
  }),
  S.Struct({
    atlassianOauth2ProviderConfig: AtlassianOauth2ProviderConfigInput,
  }),
  S.Struct({ linkedinOauth2ProviderConfig: LinkedinOauth2ProviderConfigInput }),
  S.Struct({ includedOauth2ProviderConfig: IncludedOauth2ProviderConfigInput }),
);
export class UpdateOauth2CredentialProviderRequest extends S.Class<UpdateOauth2CredentialProviderRequest>(
  "UpdateOauth2CredentialProviderRequest",
)(
  {
    name: S.String,
    credentialProviderVendor: S.String,
    oauth2ProviderConfigInput: Oauth2ProviderConfigInput,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identities/UpdateOauth2CredentialProvider",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteOauth2CredentialProviderRequest extends S.Class<DeleteOauth2CredentialProviderRequest>(
  "DeleteOauth2CredentialProviderRequest",
)(
  { name: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identities/DeleteOauth2CredentialProvider",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteOauth2CredentialProviderResponse extends S.Class<DeleteOauth2CredentialProviderResponse>(
  "DeleteOauth2CredentialProviderResponse",
)({}) {}
export class ListOauth2CredentialProvidersRequest extends S.Class<ListOauth2CredentialProvidersRequest>(
  "ListOauth2CredentialProvidersRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identities/ListOauth2CredentialProviders",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOnlineEvaluationConfigRequest extends S.Class<GetOnlineEvaluationConfigRequest>(
  "GetOnlineEvaluationConfigRequest",
)(
  {
    onlineEvaluationConfigId: S.String.pipe(
      T.HttpLabel("onlineEvaluationConfigId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/online-evaluation-configs/{onlineEvaluationConfigId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SamplingConfig extends S.Class<SamplingConfig>("SamplingConfig")({
  samplingPercentage: S.Number,
}) {}
export const FilterValue = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ booleanValue: S.Boolean }),
);
export class Filter extends S.Class<Filter>("Filter")({
  key: S.String,
  operator: S.String,
  value: FilterValue,
}) {}
export const FilterList = S.Array(Filter);
export class SessionConfig extends S.Class<SessionConfig>("SessionConfig")({
  sessionTimeoutMinutes: S.Number,
}) {}
export class Rule extends S.Class<Rule>("Rule")({
  samplingConfig: SamplingConfig,
  filters: S.optional(FilterList),
  sessionConfig: S.optional(SessionConfig),
}) {}
export const LogGroupNamesList = S.Array(S.String);
export const ServiceNamesList = S.Array(S.String);
export class CloudWatchLogsInputConfig extends S.Class<CloudWatchLogsInputConfig>(
  "CloudWatchLogsInputConfig",
)({ logGroupNames: LogGroupNamesList, serviceNames: ServiceNamesList }) {}
export const DataSourceConfig = S.Union(
  S.Struct({ cloudWatchLogs: CloudWatchLogsInputConfig }),
);
export const EvaluatorReference = S.Union(S.Struct({ evaluatorId: S.String }));
export const EvaluatorList = S.Array(EvaluatorReference);
export class UpdateOnlineEvaluationConfigRequest extends S.Class<UpdateOnlineEvaluationConfigRequest>(
  "UpdateOnlineEvaluationConfigRequest",
)(
  {
    clientToken: S.optional(S.String),
    onlineEvaluationConfigId: S.String.pipe(
      T.HttpLabel("onlineEvaluationConfigId"),
    ),
    description: S.optional(S.String),
    rule: S.optional(Rule),
    dataSourceConfig: S.optional(DataSourceConfig),
    evaluators: S.optional(EvaluatorList),
    evaluationExecutionRoleArn: S.optional(S.String),
    executionStatus: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/online-evaluation-configs/{onlineEvaluationConfigId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteOnlineEvaluationConfigRequest extends S.Class<DeleteOnlineEvaluationConfigRequest>(
  "DeleteOnlineEvaluationConfigRequest",
)(
  {
    onlineEvaluationConfigId: S.String.pipe(
      T.HttpLabel("onlineEvaluationConfigId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/online-evaluation-configs/{onlineEvaluationConfigId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOnlineEvaluationConfigsRequest extends S.Class<ListOnlineEvaluationConfigsRequest>(
  "ListOnlineEvaluationConfigsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/online-evaluation-configs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePolicyEngineRequest extends S.Class<CreatePolicyEngineRequest>(
  "CreatePolicyEngineRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policy-engines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPolicyEngineRequest extends S.Class<GetPolicyEngineRequest>(
  "GetPolicyEngineRequest",
)(
  { policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")) },
  T.all(
    T.Http({ method: "GET", uri: "/policy-engines/{policyEngineId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePolicyEngineRequest extends S.Class<UpdatePolicyEngineRequest>(
  "UpdatePolicyEngineRequest",
)(
  {
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/policy-engines/{policyEngineId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePolicyEngineRequest extends S.Class<DeletePolicyEngineRequest>(
  "DeletePolicyEngineRequest",
)(
  { policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/policy-engines/{policyEngineId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPolicyEnginesRequest extends S.Class<ListPolicyEnginesRequest>(
  "ListPolicyEnginesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/policy-engines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPolicyGenerationRequest extends S.Class<GetPolicyGenerationRequest>(
  "GetPolicyGenerationRequest",
)(
  {
    policyGenerationId: S.String.pipe(T.HttpLabel("policyGenerationId")),
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/policy-engines/{policyEngineId}/policy-generations/{policyGenerationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPolicyGenerationsRequest extends S.Class<ListPolicyGenerationsRequest>(
  "ListPolicyGenerationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/policy-engines/{policyEngineId}/policy-generations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPolicyGenerationAssetsRequest extends S.Class<ListPolicyGenerationAssetsRequest>(
  "ListPolicyGenerationAssetsRequest",
)(
  {
    policyGenerationId: S.String.pipe(T.HttpLabel("policyGenerationId")),
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/policy-engines/{policyEngineId}/policy-generations/{policyGenerationId}/assets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPolicyRequest extends S.Class<GetPolicyRequest>(
  "GetPolicyRequest",
)(
  {
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    policyId: S.String.pipe(T.HttpLabel("policyId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/policy-engines/{policyEngineId}/policies/{policyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CedarPolicy extends S.Class<CedarPolicy>("CedarPolicy")({
  statement: S.String,
}) {}
export const PolicyDefinition = S.Union(S.Struct({ cedar: CedarPolicy }));
export class UpdatePolicyRequest extends S.Class<UpdatePolicyRequest>(
  "UpdatePolicyRequest",
)(
  {
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    policyId: S.String.pipe(T.HttpLabel("policyId")),
    description: S.optional(S.String),
    definition: PolicyDefinition,
    validationMode: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/policy-engines/{policyEngineId}/policies/{policyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePolicyRequest extends S.Class<DeletePolicyRequest>(
  "DeletePolicyRequest",
)(
  {
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    policyId: S.String.pipe(T.HttpLabel("policyId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/policy-engines/{policyEngineId}/policies/{policyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPoliciesRequest extends S.Class<ListPoliciesRequest>(
  "ListPoliciesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    targetResourceScope: S.optional(S.String).pipe(
      T.HttpQuery("targetResourceScope"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/policy-engines/{policyEngineId}/policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWorkloadIdentityRequest extends S.Class<CreateWorkloadIdentityRequest>(
  "CreateWorkloadIdentityRequest",
)(
  {
    name: S.String,
    allowedResourceOauth2ReturnUrls: S.optional(
      ResourceOauth2ReturnUrlListType,
    ),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/identities/CreateWorkloadIdentity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkloadIdentityRequest extends S.Class<GetWorkloadIdentityRequest>(
  "GetWorkloadIdentityRequest",
)(
  { name: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/identities/GetWorkloadIdentity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkloadIdentityRequest extends S.Class<UpdateWorkloadIdentityRequest>(
  "UpdateWorkloadIdentityRequest",
)(
  {
    name: S.String,
    allowedResourceOauth2ReturnUrls: S.optional(
      ResourceOauth2ReturnUrlListType,
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/identities/UpdateWorkloadIdentity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkloadIdentityRequest extends S.Class<DeleteWorkloadIdentityRequest>(
  "DeleteWorkloadIdentityRequest",
)(
  { name: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/identities/DeleteWorkloadIdentity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkloadIdentityResponse extends S.Class<DeleteWorkloadIdentityResponse>(
  "DeleteWorkloadIdentityResponse",
)({}) {}
export class ListWorkloadIdentitiesRequest extends S.Class<ListWorkloadIdentitiesRequest>(
  "ListWorkloadIdentitiesRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/identities/ListWorkloadIdentities" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class KmsConfiguration extends S.Class<KmsConfiguration>(
  "KmsConfiguration",
)({ keyType: S.String, kmsKeyArn: S.optional(S.String) }) {}
export class BrowserNetworkConfiguration extends S.Class<BrowserNetworkConfiguration>(
  "BrowserNetworkConfiguration",
)({ networkMode: S.String, vpcConfig: S.optional(VpcConfig) }) {}
export class BrowserSigningConfigInput extends S.Class<BrowserSigningConfigInput>(
  "BrowserSigningConfigInput",
)({ enabled: S.Boolean }) {}
export class CodeInterpreterNetworkConfiguration extends S.Class<CodeInterpreterNetworkConfiguration>(
  "CodeInterpreterNetworkConfiguration",
)({ networkMode: S.String, vpcConfig: S.optional(VpcConfig) }) {}
export const StatusReasons = S.Array(S.String);
export const PolicyStatusReasons = S.Array(S.String);
export const Resource = S.Union(S.Struct({ arn: S.String }));
export const Content = S.Union(S.Struct({ rawText: S.String }));
export const NamespacesList = S.Array(S.String);
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({ policy: S.optional(S.String) }) {}
export class GetTokenVaultResponse extends S.Class<GetTokenVaultResponse>(
  "GetTokenVaultResponse",
)({
  tokenVaultId: S.String,
  kmsConfiguration: KmsConfiguration,
  lastModifiedDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({ policy: S.String }) {}
export class SetTokenVaultCMKRequest extends S.Class<SetTokenVaultCMKRequest>(
  "SetTokenVaultCMKRequest",
)(
  { tokenVaultId: S.optional(S.String), kmsConfiguration: KmsConfiguration },
  T.all(
    T.Http({ method: "POST", uri: "/identities/set-token-vault-cmk" }),
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
export class CreateAgentRuntimeEndpointResponse extends S.Class<CreateAgentRuntimeEndpointResponse>(
  "CreateAgentRuntimeEndpointResponse",
)({
  targetVersion: S.String,
  agentRuntimeEndpointArn: S.String,
  agentRuntimeArn: S.String,
  agentRuntimeId: S.optional(S.String),
  endpointName: S.optional(S.String),
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetAgentRuntimeEndpointResponse extends S.Class<GetAgentRuntimeEndpointResponse>(
  "GetAgentRuntimeEndpointResponse",
)({
  liveVersion: S.optional(S.String),
  targetVersion: S.optional(S.String),
  agentRuntimeEndpointArn: S.String,
  agentRuntimeArn: S.String,
  description: S.optional(S.String),
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  failureReason: S.optional(S.String),
  name: S.String,
  id: S.String,
}) {}
export class UpdateAgentRuntimeEndpointResponse extends S.Class<UpdateAgentRuntimeEndpointResponse>(
  "UpdateAgentRuntimeEndpointResponse",
)({
  liveVersion: S.optional(S.String),
  targetVersion: S.optional(S.String),
  agentRuntimeEndpointArn: S.String,
  agentRuntimeArn: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class DeleteAgentRuntimeEndpointResponse extends S.Class<DeleteAgentRuntimeEndpointResponse>(
  "DeleteAgentRuntimeEndpointResponse",
)({
  status: S.String,
  agentRuntimeId: S.optional(S.String),
  endpointName: S.optional(S.String),
}) {}
export class WorkloadIdentityDetails extends S.Class<WorkloadIdentityDetails>(
  "WorkloadIdentityDetails",
)({ workloadIdentityArn: S.String }) {}
export class UpdateAgentRuntimeResponse extends S.Class<UpdateAgentRuntimeResponse>(
  "UpdateAgentRuntimeResponse",
)({
  agentRuntimeArn: S.String,
  agentRuntimeId: S.String,
  workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
  agentRuntimeVersion: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export class DeleteAgentRuntimeResponse extends S.Class<DeleteAgentRuntimeResponse>(
  "DeleteAgentRuntimeResponse",
)({ status: S.String, agentRuntimeId: S.optional(S.String) }) {}
export class AgentRuntime extends S.Class<AgentRuntime>("AgentRuntime")({
  agentRuntimeArn: S.String,
  agentRuntimeId: S.String,
  agentRuntimeVersion: S.String,
  agentRuntimeName: S.String,
  description: S.String,
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export const AgentRuntimes = S.Array(AgentRuntime);
export class ListAgentRuntimeVersionsResponse extends S.Class<ListAgentRuntimeVersionsResponse>(
  "ListAgentRuntimeVersionsResponse",
)({ agentRuntimes: AgentRuntimes, nextToken: S.optional(S.String) }) {}
export class Secret extends S.Class<Secret>("Secret")({
  secretArn: S.String,
}) {}
export class GetApiKeyCredentialProviderResponse extends S.Class<GetApiKeyCredentialProviderResponse>(
  "GetApiKeyCredentialProviderResponse",
)({
  apiKeySecretArn: Secret,
  name: S.String,
  credentialProviderArn: S.String,
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateApiKeyCredentialProviderResponse extends S.Class<UpdateApiKeyCredentialProviderResponse>(
  "UpdateApiKeyCredentialProviderResponse",
)({
  apiKeySecretArn: Secret,
  name: S.String,
  credentialProviderArn: S.String,
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DeleteBrowserResponse extends S.Class<DeleteBrowserResponse>(
  "DeleteBrowserResponse",
)({
  browserId: S.String,
  status: S.String,
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class CreateCodeInterpreterRequest extends S.Class<CreateCodeInterpreterRequest>(
  "CreateCodeInterpreterRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    executionRoleArn: S.optional(S.String),
    networkConfiguration: CodeInterpreterNetworkConfiguration,
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/code-interpreters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCodeInterpreterResponse extends S.Class<GetCodeInterpreterResponse>(
  "GetCodeInterpreterResponse",
)({
  codeInterpreterId: S.String,
  codeInterpreterArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  executionRoleArn: S.optional(S.String),
  networkConfiguration: CodeInterpreterNetworkConfiguration,
  status: S.String,
  failureReason: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class DeleteCodeInterpreterResponse extends S.Class<DeleteCodeInterpreterResponse>(
  "DeleteCodeInterpreterResponse",
)({
  codeInterpreterId: S.String,
  status: S.String,
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetEvaluatorResponse extends S.Class<GetEvaluatorResponse>(
  "GetEvaluatorResponse",
)({
  evaluatorArn: S.String,
  evaluatorId: S.String,
  evaluatorName: S.String,
  description: S.optional(S.String),
  evaluatorConfig: EvaluatorConfig,
  level: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lockedForModification: S.optional(S.Boolean),
}) {}
export class UpdateEvaluatorResponse extends S.Class<UpdateEvaluatorResponse>(
  "UpdateEvaluatorResponse",
)({
  evaluatorArn: S.String,
  evaluatorId: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
}) {}
export class DeleteEvaluatorResponse extends S.Class<DeleteEvaluatorResponse>(
  "DeleteEvaluatorResponse",
)({ evaluatorArn: S.String, evaluatorId: S.String, status: S.String }) {}
export class DeleteGatewayResponse extends S.Class<DeleteGatewayResponse>(
  "DeleteGatewayResponse",
)({
  gatewayId: S.String,
  status: S.String,
  statusReasons: S.optional(StatusReasons),
}) {}
export class GetGatewayResponse extends S.Class<GetGatewayResponse>(
  "GetGatewayResponse",
)({
  gatewayArn: S.String,
  gatewayId: S.String,
  gatewayUrl: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReasons: S.optional(StatusReasons),
  name: S.String,
  description: S.optional(S.String),
  roleArn: S.optional(S.String),
  protocolType: S.String,
  protocolConfiguration: S.optional(GatewayProtocolConfiguration),
  authorizerType: S.String,
  authorizerConfiguration: S.optional(AuthorizerConfiguration),
  kmsKeyArn: S.optional(S.String),
  interceptorConfigurations: S.optional(GatewayInterceptorConfigurations),
  policyEngineConfiguration: S.optional(GatewayPolicyEngineConfiguration),
  workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
  exceptionLevel: S.optional(S.String),
}) {}
export class UpdateGatewayResponse extends S.Class<UpdateGatewayResponse>(
  "UpdateGatewayResponse",
)({
  gatewayArn: S.String,
  gatewayId: S.String,
  gatewayUrl: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReasons: S.optional(StatusReasons),
  name: S.String,
  description: S.optional(S.String),
  roleArn: S.optional(S.String),
  protocolType: S.String,
  protocolConfiguration: S.optional(GatewayProtocolConfiguration),
  authorizerType: S.String,
  authorizerConfiguration: S.optional(AuthorizerConfiguration),
  kmsKeyArn: S.optional(S.String),
  interceptorConfigurations: S.optional(GatewayInterceptorConfigurations),
  policyEngineConfiguration: S.optional(GatewayPolicyEngineConfiguration),
  workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
  exceptionLevel: S.optional(S.String),
}) {}
export class DeleteGatewayTargetResponse extends S.Class<DeleteGatewayTargetResponse>(
  "DeleteGatewayTargetResponse",
)({
  gatewayArn: S.String,
  targetId: S.String,
  status: S.String,
  statusReasons: S.optional(StatusReasons),
}) {}
export class GetGatewayTargetResponse extends S.Class<GetGatewayTargetResponse>(
  "GetGatewayTargetResponse",
)({
  gatewayArn: S.String,
  targetId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReasons: S.optional(StatusReasons),
  name: S.String,
  description: S.optional(S.String),
  targetConfiguration: TargetConfiguration,
  credentialProviderConfigurations: CredentialProviderConfigurations,
  lastSynchronizedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  metadataConfiguration: S.optional(MetadataConfiguration),
}) {}
export class UpdateGatewayTargetResponse extends S.Class<UpdateGatewayTargetResponse>(
  "UpdateGatewayTargetResponse",
)({
  gatewayArn: S.String,
  targetId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReasons: S.optional(StatusReasons),
  name: S.String,
  description: S.optional(S.String),
  targetConfiguration: TargetConfiguration,
  credentialProviderConfigurations: CredentialProviderConfigurations,
  lastSynchronizedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  metadataConfiguration: S.optional(MetadataConfiguration),
}) {}
export class DeleteMemoryOutput extends S.Class<DeleteMemoryOutput>(
  "DeleteMemoryOutput",
)({ memoryId: S.String, status: S.optional(S.String) }) {}
export class CustomOauth2ProviderConfigOutput extends S.Class<CustomOauth2ProviderConfigOutput>(
  "CustomOauth2ProviderConfigOutput",
)({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }) {}
export class GoogleOauth2ProviderConfigOutput extends S.Class<GoogleOauth2ProviderConfigOutput>(
  "GoogleOauth2ProviderConfigOutput",
)({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }) {}
export class GithubOauth2ProviderConfigOutput extends S.Class<GithubOauth2ProviderConfigOutput>(
  "GithubOauth2ProviderConfigOutput",
)({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }) {}
export class SlackOauth2ProviderConfigOutput extends S.Class<SlackOauth2ProviderConfigOutput>(
  "SlackOauth2ProviderConfigOutput",
)({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }) {}
export class SalesforceOauth2ProviderConfigOutput extends S.Class<SalesforceOauth2ProviderConfigOutput>(
  "SalesforceOauth2ProviderConfigOutput",
)({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }) {}
export class MicrosoftOauth2ProviderConfigOutput extends S.Class<MicrosoftOauth2ProviderConfigOutput>(
  "MicrosoftOauth2ProviderConfigOutput",
)({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }) {}
export class AtlassianOauth2ProviderConfigOutput extends S.Class<AtlassianOauth2ProviderConfigOutput>(
  "AtlassianOauth2ProviderConfigOutput",
)({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }) {}
export class LinkedinOauth2ProviderConfigOutput extends S.Class<LinkedinOauth2ProviderConfigOutput>(
  "LinkedinOauth2ProviderConfigOutput",
)({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }) {}
export class IncludedOauth2ProviderConfigOutput extends S.Class<IncludedOauth2ProviderConfigOutput>(
  "IncludedOauth2ProviderConfigOutput",
)({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }) {}
export const Oauth2ProviderConfigOutput = S.Union(
  S.Struct({ customOauth2ProviderConfig: CustomOauth2ProviderConfigOutput }),
  S.Struct({ googleOauth2ProviderConfig: GoogleOauth2ProviderConfigOutput }),
  S.Struct({ githubOauth2ProviderConfig: GithubOauth2ProviderConfigOutput }),
  S.Struct({ slackOauth2ProviderConfig: SlackOauth2ProviderConfigOutput }),
  S.Struct({
    salesforceOauth2ProviderConfig: SalesforceOauth2ProviderConfigOutput,
  }),
  S.Struct({
    microsoftOauth2ProviderConfig: MicrosoftOauth2ProviderConfigOutput,
  }),
  S.Struct({
    atlassianOauth2ProviderConfig: AtlassianOauth2ProviderConfigOutput,
  }),
  S.Struct({
    linkedinOauth2ProviderConfig: LinkedinOauth2ProviderConfigOutput,
  }),
  S.Struct({
    includedOauth2ProviderConfig: IncludedOauth2ProviderConfigOutput,
  }),
);
export class UpdateOauth2CredentialProviderResponse extends S.Class<UpdateOauth2CredentialProviderResponse>(
  "UpdateOauth2CredentialProviderResponse",
)({
  clientSecretArn: Secret,
  name: S.String,
  credentialProviderVendor: S.String,
  credentialProviderArn: S.String,
  callbackUrl: S.optional(S.String),
  oauth2ProviderConfigOutput: Oauth2ProviderConfigOutput,
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateOnlineEvaluationConfigResponse extends S.Class<UpdateOnlineEvaluationConfigResponse>(
  "UpdateOnlineEvaluationConfigResponse",
)({
  onlineEvaluationConfigArn: S.String,
  onlineEvaluationConfigId: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  executionStatus: S.String,
  failureReason: S.optional(S.String),
}) {}
export class DeleteOnlineEvaluationConfigResponse extends S.Class<DeleteOnlineEvaluationConfigResponse>(
  "DeleteOnlineEvaluationConfigResponse",
)({
  onlineEvaluationConfigArn: S.String,
  onlineEvaluationConfigId: S.String,
  status: S.String,
}) {}
export class CreatePolicyEngineResponse extends S.Class<CreatePolicyEngineResponse>(
  "CreatePolicyEngineResponse",
)({
  policyEngineId: S.String,
  name: S.String,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  policyEngineArn: S.String,
  status: S.String,
  statusReasons: PolicyStatusReasons,
}) {}
export class GetPolicyEngineResponse extends S.Class<GetPolicyEngineResponse>(
  "GetPolicyEngineResponse",
)({
  policyEngineId: S.String,
  name: S.String,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  policyEngineArn: S.String,
  status: S.String,
  statusReasons: PolicyStatusReasons,
}) {}
export class UpdatePolicyEngineResponse extends S.Class<UpdatePolicyEngineResponse>(
  "UpdatePolicyEngineResponse",
)({
  policyEngineId: S.String,
  name: S.String,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  policyEngineArn: S.String,
  status: S.String,
  statusReasons: PolicyStatusReasons,
}) {}
export class DeletePolicyEngineResponse extends S.Class<DeletePolicyEngineResponse>(
  "DeletePolicyEngineResponse",
)({
  policyEngineId: S.String,
  name: S.String,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  policyEngineArn: S.String,
  status: S.String,
  statusReasons: PolicyStatusReasons,
}) {}
export class StartPolicyGenerationRequest extends S.Class<StartPolicyGenerationRequest>(
  "StartPolicyGenerationRequest",
)(
  {
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    resource: Resource,
    content: Content,
    name: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/policy-engines/{policyEngineId}/policy-generations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPolicyGenerationResponse extends S.Class<GetPolicyGenerationResponse>(
  "GetPolicyGenerationResponse",
)({
  policyEngineId: S.String,
  policyGenerationId: S.String,
  name: S.String,
  policyGenerationArn: S.String,
  resource: Resource,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReasons: PolicyStatusReasons,
  findings: S.optional(S.String),
}) {}
export class GetPolicyResponse extends S.Class<GetPolicyResponse>(
  "GetPolicyResponse",
)({
  policyId: S.String,
  name: S.String,
  policyEngineId: S.String,
  definition: PolicyDefinition,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  policyArn: S.String,
  status: S.String,
  statusReasons: PolicyStatusReasons,
}) {}
export class UpdatePolicyResponse extends S.Class<UpdatePolicyResponse>(
  "UpdatePolicyResponse",
)({
  policyId: S.String,
  name: S.String,
  policyEngineId: S.String,
  definition: PolicyDefinition,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  policyArn: S.String,
  status: S.String,
  statusReasons: PolicyStatusReasons,
}) {}
export class DeletePolicyResponse extends S.Class<DeletePolicyResponse>(
  "DeletePolicyResponse",
)({
  policyId: S.String,
  name: S.String,
  policyEngineId: S.String,
  definition: PolicyDefinition,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  policyArn: S.String,
  status: S.String,
  statusReasons: PolicyStatusReasons,
}) {}
export class CreateWorkloadIdentityResponse extends S.Class<CreateWorkloadIdentityResponse>(
  "CreateWorkloadIdentityResponse",
)({
  name: S.String,
  workloadIdentityArn: S.String,
  allowedResourceOauth2ReturnUrls: S.optional(ResourceOauth2ReturnUrlListType),
}) {}
export class GetWorkloadIdentityResponse extends S.Class<GetWorkloadIdentityResponse>(
  "GetWorkloadIdentityResponse",
)({
  name: S.String,
  workloadIdentityArn: S.String,
  allowedResourceOauth2ReturnUrls: S.optional(ResourceOauth2ReturnUrlListType),
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateWorkloadIdentityResponse extends S.Class<UpdateWorkloadIdentityResponse>(
  "UpdateWorkloadIdentityResponse",
)({
  name: S.String,
  workloadIdentityArn: S.String,
  allowedResourceOauth2ReturnUrls: S.optional(ResourceOauth2ReturnUrlListType),
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class SemanticMemoryStrategyInput extends S.Class<SemanticMemoryStrategyInput>(
  "SemanticMemoryStrategyInput",
)({
  name: S.String,
  description: S.optional(S.String),
  namespaces: S.optional(NamespacesList),
}) {}
export class SummaryMemoryStrategyInput extends S.Class<SummaryMemoryStrategyInput>(
  "SummaryMemoryStrategyInput",
)({
  name: S.String,
  description: S.optional(S.String),
  namespaces: S.optional(NamespacesList),
}) {}
export class UserPreferenceMemoryStrategyInput extends S.Class<UserPreferenceMemoryStrategyInput>(
  "UserPreferenceMemoryStrategyInput",
)({
  name: S.String,
  description: S.optional(S.String),
  namespaces: S.optional(NamespacesList),
}) {}
export class DeleteMemoryStrategyInput extends S.Class<DeleteMemoryStrategyInput>(
  "DeleteMemoryStrategyInput",
)({ memoryStrategyId: S.String }) {}
export const DeleteMemoryStrategiesList = S.Array(DeleteMemoryStrategyInput);
export class AgentRuntimeEndpoint extends S.Class<AgentRuntimeEndpoint>(
  "AgentRuntimeEndpoint",
)({
  name: S.String,
  liveVersion: S.optional(S.String),
  targetVersion: S.optional(S.String),
  agentRuntimeEndpointArn: S.String,
  agentRuntimeArn: S.String,
  status: S.String,
  id: S.String,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const AgentRuntimeEndpoints = S.Array(AgentRuntimeEndpoint);
export class ApiKeyCredentialProviderItem extends S.Class<ApiKeyCredentialProviderItem>(
  "ApiKeyCredentialProviderItem",
)({
  name: S.String,
  credentialProviderArn: S.String,
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ApiKeyCredentialProviders = S.Array(ApiKeyCredentialProviderItem);
export class RecordingConfig extends S.Class<RecordingConfig>(
  "RecordingConfig",
)({ enabled: S.optional(S.Boolean), s3Location: S.optional(S3Location) }) {}
export class BrowserSigningConfigOutput extends S.Class<BrowserSigningConfigOutput>(
  "BrowserSigningConfigOutput",
)({ enabled: S.Boolean }) {}
export class BrowserSummary extends S.Class<BrowserSummary>("BrowserSummary")({
  browserId: S.String,
  browserArn: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const BrowserSummaries = S.Array(BrowserSummary);
export class CodeInterpreterSummary extends S.Class<CodeInterpreterSummary>(
  "CodeInterpreterSummary",
)({
  codeInterpreterId: S.String,
  codeInterpreterArn: S.String,
  name: S.optional(S.String),
  description: S.optional(S.String),
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const CodeInterpreterSummaries = S.Array(CodeInterpreterSummary);
export class EvaluatorSummary extends S.Class<EvaluatorSummary>(
  "EvaluatorSummary",
)({
  evaluatorArn: S.String,
  evaluatorId: S.String,
  evaluatorName: S.String,
  description: S.optional(S.String),
  evaluatorType: S.String,
  level: S.optional(S.String),
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lockedForModification: S.optional(S.Boolean),
}) {}
export const EvaluatorSummaryList = S.Array(EvaluatorSummary);
export class GatewaySummary extends S.Class<GatewaySummary>("GatewaySummary")({
  gatewayId: S.String,
  name: S.String,
  status: S.String,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  authorizerType: S.String,
  protocolType: S.String,
}) {}
export const GatewaySummaries = S.Array(GatewaySummary);
export class TargetSummary extends S.Class<TargetSummary>("TargetSummary")({
  targetId: S.String,
  name: S.String,
  status: S.String,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const TargetSummaries = S.Array(TargetSummary);
export class GatewayTarget extends S.Class<GatewayTarget>("GatewayTarget")({
  gatewayArn: S.String,
  targetId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReasons: S.optional(StatusReasons),
  name: S.String,
  description: S.optional(S.String),
  targetConfiguration: TargetConfiguration,
  credentialProviderConfigurations: CredentialProviderConfigurations,
  lastSynchronizedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  metadataConfiguration: S.optional(MetadataConfiguration),
}) {}
export const GatewayTargetList = S.Array(GatewayTarget);
export class MemorySummary extends S.Class<MemorySummary>("MemorySummary")({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  status: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const MemorySummaryList = S.Array(MemorySummary);
export class Oauth2CredentialProviderItem extends S.Class<Oauth2CredentialProviderItem>(
  "Oauth2CredentialProviderItem",
)({
  name: S.String,
  credentialProviderVendor: S.String,
  credentialProviderArn: S.String,
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const Oauth2CredentialProviders = S.Array(Oauth2CredentialProviderItem);
export class OnlineEvaluationConfigSummary extends S.Class<OnlineEvaluationConfigSummary>(
  "OnlineEvaluationConfigSummary",
)({
  onlineEvaluationConfigArn: S.String,
  onlineEvaluationConfigId: S.String,
  onlineEvaluationConfigName: S.String,
  description: S.optional(S.String),
  status: S.String,
  executionStatus: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  failureReason: S.optional(S.String),
}) {}
export const OnlineEvaluationConfigSummaryList = S.Array(
  OnlineEvaluationConfigSummary,
);
export class PolicyEngine extends S.Class<PolicyEngine>("PolicyEngine")({
  policyEngineId: S.String,
  name: S.String,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  policyEngineArn: S.String,
  status: S.String,
  statusReasons: PolicyStatusReasons,
}) {}
export const PolicyEngines = S.Array(PolicyEngine);
export class PolicyGeneration extends S.Class<PolicyGeneration>(
  "PolicyGeneration",
)({
  policyEngineId: S.String,
  policyGenerationId: S.String,
  name: S.String,
  policyGenerationArn: S.String,
  resource: Resource,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReasons: PolicyStatusReasons,
  findings: S.optional(S.String),
}) {}
export const PolicyGenerations = S.Array(PolicyGeneration);
export class Policy extends S.Class<Policy>("Policy")({
  policyId: S.String,
  name: S.String,
  policyEngineId: S.String,
  definition: PolicyDefinition,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  policyArn: S.String,
  status: S.String,
  statusReasons: PolicyStatusReasons,
}) {}
export const Policies = S.Array(Policy);
export class WorkloadIdentityType extends S.Class<WorkloadIdentityType>(
  "WorkloadIdentityType",
)({ name: S.String, workloadIdentityArn: S.String }) {}
export const WorkloadIdentityList = S.Array(WorkloadIdentityType);
export class EpisodicReflectionConfigurationInput extends S.Class<EpisodicReflectionConfigurationInput>(
  "EpisodicReflectionConfigurationInput",
)({ namespaces: NamespacesList }) {}
export class SetTokenVaultCMKResponse extends S.Class<SetTokenVaultCMKResponse>(
  "SetTokenVaultCMKResponse",
)({
  tokenVaultId: S.String,
  kmsConfiguration: KmsConfiguration,
  lastModifiedDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ListAgentRuntimeEndpointsResponse extends S.Class<ListAgentRuntimeEndpointsResponse>(
  "ListAgentRuntimeEndpointsResponse",
)({
  runtimeEndpoints: AgentRuntimeEndpoints,
  nextToken: S.optional(S.String),
}) {}
export class GetAgentRuntimeResponse extends S.Class<GetAgentRuntimeResponse>(
  "GetAgentRuntimeResponse",
)({
  agentRuntimeArn: S.String,
  agentRuntimeName: S.String,
  agentRuntimeId: S.String,
  agentRuntimeVersion: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  roleArn: S.String,
  networkConfiguration: NetworkConfiguration,
  status: S.String,
  lifecycleConfiguration: LifecycleConfiguration,
  failureReason: S.optional(S.String),
  description: S.optional(S.String),
  workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
  agentRuntimeArtifact: S.optional(AgentRuntimeArtifact),
  protocolConfiguration: S.optional(ProtocolConfiguration),
  environmentVariables: S.optional(EnvironmentVariablesMap),
  authorizerConfiguration: S.optional(AuthorizerConfiguration),
  requestHeaderConfiguration: S.optional(RequestHeaderConfiguration),
}) {}
export class ListAgentRuntimesResponse extends S.Class<ListAgentRuntimesResponse>(
  "ListAgentRuntimesResponse",
)({ agentRuntimes: AgentRuntimes, nextToken: S.optional(S.String) }) {}
export class CreateApiKeyCredentialProviderResponse extends S.Class<CreateApiKeyCredentialProviderResponse>(
  "CreateApiKeyCredentialProviderResponse",
)({
  apiKeySecretArn: Secret,
  name: S.String,
  credentialProviderArn: S.String,
}) {}
export class ListApiKeyCredentialProvidersResponse extends S.Class<ListApiKeyCredentialProvidersResponse>(
  "ListApiKeyCredentialProvidersResponse",
)({
  credentialProviders: ApiKeyCredentialProviders,
  nextToken: S.optional(S.String),
}) {}
export class CreateBrowserRequest extends S.Class<CreateBrowserRequest>(
  "CreateBrowserRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    executionRoleArn: S.optional(S.String),
    networkConfiguration: BrowserNetworkConfiguration,
    recording: S.optional(RecordingConfig),
    browserSigning: S.optional(BrowserSigningConfigInput),
    clientToken: S.optional(S.String),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/browsers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBrowserResponse extends S.Class<GetBrowserResponse>(
  "GetBrowserResponse",
)({
  browserId: S.String,
  browserArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  executionRoleArn: S.optional(S.String),
  networkConfiguration: BrowserNetworkConfiguration,
  recording: S.optional(RecordingConfig),
  browserSigning: S.optional(BrowserSigningConfigOutput),
  status: S.String,
  failureReason: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListBrowsersResponse extends S.Class<ListBrowsersResponse>(
  "ListBrowsersResponse",
)({ browserSummaries: BrowserSummaries, nextToken: S.optional(S.String) }) {}
export class CreateCodeInterpreterResponse extends S.Class<CreateCodeInterpreterResponse>(
  "CreateCodeInterpreterResponse",
)({
  codeInterpreterId: S.String,
  codeInterpreterArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export class ListCodeInterpretersResponse extends S.Class<ListCodeInterpretersResponse>(
  "ListCodeInterpretersResponse",
)({
  codeInterpreterSummaries: CodeInterpreterSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListEvaluatorsResponse extends S.Class<ListEvaluatorsResponse>(
  "ListEvaluatorsResponse",
)({ evaluators: EvaluatorSummaryList, nextToken: S.optional(S.String) }) {}
export class ListGatewaysResponse extends S.Class<ListGatewaysResponse>(
  "ListGatewaysResponse",
)({ items: GatewaySummaries, nextToken: S.optional(S.String) }) {}
export class ListGatewayTargetsResponse extends S.Class<ListGatewayTargetsResponse>(
  "ListGatewayTargetsResponse",
)({ items: TargetSummaries, nextToken: S.optional(S.String) }) {}
export class SynchronizeGatewayTargetsResponse extends S.Class<SynchronizeGatewayTargetsResponse>(
  "SynchronizeGatewayTargetsResponse",
)({ targets: S.optional(GatewayTargetList) }) {}
export class ListMemoriesOutput extends S.Class<ListMemoriesOutput>(
  "ListMemoriesOutput",
)({ memories: MemorySummaryList, nextToken: S.optional(S.String) }) {}
export class ListOauth2CredentialProvidersResponse extends S.Class<ListOauth2CredentialProvidersResponse>(
  "ListOauth2CredentialProvidersResponse",
)({
  credentialProviders: Oauth2CredentialProviders,
  nextToken: S.optional(S.String),
}) {}
export class ListOnlineEvaluationConfigsResponse extends S.Class<ListOnlineEvaluationConfigsResponse>(
  "ListOnlineEvaluationConfigsResponse",
)({
  onlineEvaluationConfigs: OnlineEvaluationConfigSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListPolicyEnginesResponse extends S.Class<ListPolicyEnginesResponse>(
  "ListPolicyEnginesResponse",
)({ policyEngines: PolicyEngines, nextToken: S.optional(S.String) }) {}
export class StartPolicyGenerationResponse extends S.Class<StartPolicyGenerationResponse>(
  "StartPolicyGenerationResponse",
)({
  policyEngineId: S.String,
  policyGenerationId: S.String,
  name: S.String,
  policyGenerationArn: S.String,
  resource: Resource,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReasons: PolicyStatusReasons,
  findings: S.optional(S.String),
}) {}
export class ListPolicyGenerationsResponse extends S.Class<ListPolicyGenerationsResponse>(
  "ListPolicyGenerationsResponse",
)({ policyGenerations: PolicyGenerations, nextToken: S.optional(S.String) }) {}
export class CreatePolicyRequest extends S.Class<CreatePolicyRequest>(
  "CreatePolicyRequest",
)(
  {
    name: S.String,
    definition: PolicyDefinition,
    description: S.optional(S.String),
    validationMode: S.optional(S.String),
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/policy-engines/{policyEngineId}/policies",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPoliciesResponse extends S.Class<ListPoliciesResponse>(
  "ListPoliciesResponse",
)({ policies: Policies, nextToken: S.optional(S.String) }) {}
export class ListWorkloadIdentitiesResponse extends S.Class<ListWorkloadIdentitiesResponse>(
  "ListWorkloadIdentitiesResponse",
)({
  workloadIdentities: WorkloadIdentityList,
  nextToken: S.optional(S.String),
}) {}
export class EpisodicMemoryStrategyInput extends S.Class<EpisodicMemoryStrategyInput>(
  "EpisodicMemoryStrategyInput",
)({
  name: S.String,
  description: S.optional(S.String),
  namespaces: S.optional(NamespacesList),
  reflectionConfiguration: S.optional(EpisodicReflectionConfigurationInput),
}) {}
export class CloudWatchOutputConfig extends S.Class<CloudWatchOutputConfig>(
  "CloudWatchOutputConfig",
)({ logGroupName: S.String }) {}
export class Finding extends S.Class<Finding>("Finding")({
  type: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export const Findings = S.Array(Finding);
export class OutputConfig extends S.Class<OutputConfig>("OutputConfig")({
  cloudWatchConfig: CloudWatchOutputConfig,
}) {}
export class PolicyGenerationAsset extends S.Class<PolicyGenerationAsset>(
  "PolicyGenerationAsset",
)({
  policyGenerationAssetId: S.String,
  definition: S.optional(PolicyDefinition),
  rawTextFragment: S.String,
  findings: Findings,
}) {}
export const PolicyGenerationAssets = S.Array(PolicyGenerationAsset);
export class CreateBrowserResponse extends S.Class<CreateBrowserResponse>(
  "CreateBrowserResponse",
)({
  browserId: S.String,
  browserArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export class CreateGatewayRequest extends S.Class<CreateGatewayRequest>(
  "CreateGatewayRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
    roleArn: S.String,
    protocolType: S.String,
    protocolConfiguration: S.optional(GatewayProtocolConfiguration),
    authorizerType: S.String,
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    kmsKeyArn: S.optional(S.String),
    interceptorConfigurations: S.optional(GatewayInterceptorConfigurations),
    policyEngineConfiguration: S.optional(GatewayPolicyEngineConfiguration),
    exceptionLevel: S.optional(S.String),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/gateways/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SemanticOverrideExtractionConfigurationInput extends S.Class<SemanticOverrideExtractionConfigurationInput>(
  "SemanticOverrideExtractionConfigurationInput",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class SemanticOverrideConsolidationConfigurationInput extends S.Class<SemanticOverrideConsolidationConfigurationInput>(
  "SemanticOverrideConsolidationConfigurationInput",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class SummaryOverrideConsolidationConfigurationInput extends S.Class<SummaryOverrideConsolidationConfigurationInput>(
  "SummaryOverrideConsolidationConfigurationInput",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class UserPreferenceOverrideExtractionConfigurationInput extends S.Class<UserPreferenceOverrideExtractionConfigurationInput>(
  "UserPreferenceOverrideExtractionConfigurationInput",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class UserPreferenceOverrideConsolidationConfigurationInput extends S.Class<UserPreferenceOverrideConsolidationConfigurationInput>(
  "UserPreferenceOverrideConsolidationConfigurationInput",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class EpisodicOverrideExtractionConfigurationInput extends S.Class<EpisodicOverrideExtractionConfigurationInput>(
  "EpisodicOverrideExtractionConfigurationInput",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class EpisodicOverrideConsolidationConfigurationInput extends S.Class<EpisodicOverrideConsolidationConfigurationInput>(
  "EpisodicOverrideConsolidationConfigurationInput",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class EpisodicOverrideReflectionConfigurationInput extends S.Class<EpisodicOverrideReflectionConfigurationInput>(
  "EpisodicOverrideReflectionConfigurationInput",
)({
  appendToPrompt: S.String,
  modelId: S.String,
  namespaces: S.optional(NamespacesList),
}) {}
export class InvocationConfigurationInput extends S.Class<InvocationConfigurationInput>(
  "InvocationConfigurationInput",
)({ topicArn: S.String, payloadDeliveryBucketName: S.String }) {}
export const CustomExtractionConfigurationInput = S.Union(
  S.Struct({
    semanticExtractionOverride: SemanticOverrideExtractionConfigurationInput,
  }),
  S.Struct({
    userPreferenceExtractionOverride:
      UserPreferenceOverrideExtractionConfigurationInput,
  }),
  S.Struct({
    episodicExtractionOverride: EpisodicOverrideExtractionConfigurationInput,
  }),
);
export const CustomConsolidationConfigurationInput = S.Union(
  S.Struct({
    semanticConsolidationOverride:
      SemanticOverrideConsolidationConfigurationInput,
  }),
  S.Struct({
    summaryConsolidationOverride:
      SummaryOverrideConsolidationConfigurationInput,
  }),
  S.Struct({
    userPreferenceConsolidationOverride:
      UserPreferenceOverrideConsolidationConfigurationInput,
  }),
  S.Struct({
    episodicConsolidationOverride:
      EpisodicOverrideConsolidationConfigurationInput,
  }),
);
export const CustomReflectionConfigurationInput = S.Union(
  S.Struct({
    episodicReflectionOverride: EpisodicOverrideReflectionConfigurationInput,
  }),
);
export class ModifyInvocationConfigurationInput extends S.Class<ModifyInvocationConfigurationInput>(
  "ModifyInvocationConfigurationInput",
)({
  topicArn: S.optional(S.String),
  payloadDeliveryBucketName: S.optional(S.String),
}) {}
export class GetOauth2CredentialProviderResponse extends S.Class<GetOauth2CredentialProviderResponse>(
  "GetOauth2CredentialProviderResponse",
)({
  clientSecretArn: Secret,
  name: S.String,
  credentialProviderArn: S.String,
  credentialProviderVendor: S.String,
  callbackUrl: S.optional(S.String),
  oauth2ProviderConfigOutput: Oauth2ProviderConfigOutput,
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class CreateOnlineEvaluationConfigRequest extends S.Class<CreateOnlineEvaluationConfigRequest>(
  "CreateOnlineEvaluationConfigRequest",
)(
  {
    clientToken: S.optional(S.String),
    onlineEvaluationConfigName: S.String,
    description: S.optional(S.String),
    rule: Rule,
    dataSourceConfig: DataSourceConfig,
    evaluators: EvaluatorList,
    evaluationExecutionRoleArn: S.String,
    enableOnCreate: S.Boolean,
  },
  T.all(
    T.Http({ method: "POST", uri: "/online-evaluation-configs/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOnlineEvaluationConfigResponse extends S.Class<GetOnlineEvaluationConfigResponse>(
  "GetOnlineEvaluationConfigResponse",
)({
  onlineEvaluationConfigArn: S.String,
  onlineEvaluationConfigId: S.String,
  onlineEvaluationConfigName: S.String,
  description: S.optional(S.String),
  rule: Rule,
  dataSourceConfig: DataSourceConfig,
  evaluators: EvaluatorList,
  outputConfig: S.optional(OutputConfig),
  evaluationExecutionRoleArn: S.optional(S.String),
  status: S.String,
  executionStatus: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  failureReason: S.optional(S.String),
}) {}
export class ListPolicyGenerationAssetsResponse extends S.Class<ListPolicyGenerationAssetsResponse>(
  "ListPolicyGenerationAssetsResponse",
)({
  policyGenerationAssets: S.optional(PolicyGenerationAssets),
  nextToken: S.optional(S.String),
}) {}
export class CreatePolicyResponse extends S.Class<CreatePolicyResponse>(
  "CreatePolicyResponse",
)({
  policyId: S.String,
  name: S.String,
  policyEngineId: S.String,
  definition: PolicyDefinition,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  policyArn: S.String,
  status: S.String,
  statusReasons: PolicyStatusReasons,
}) {}
export class SemanticOverrideConfigurationInput extends S.Class<SemanticOverrideConfigurationInput>(
  "SemanticOverrideConfigurationInput",
)({
  extraction: S.optional(SemanticOverrideExtractionConfigurationInput),
  consolidation: S.optional(SemanticOverrideConsolidationConfigurationInput),
}) {}
export class SummaryOverrideConfigurationInput extends S.Class<SummaryOverrideConfigurationInput>(
  "SummaryOverrideConfigurationInput",
)({
  consolidation: S.optional(SummaryOverrideConsolidationConfigurationInput),
}) {}
export class UserPreferenceOverrideConfigurationInput extends S.Class<UserPreferenceOverrideConfigurationInput>(
  "UserPreferenceOverrideConfigurationInput",
)({
  extraction: S.optional(UserPreferenceOverrideExtractionConfigurationInput),
  consolidation: S.optional(
    UserPreferenceOverrideConsolidationConfigurationInput,
  ),
}) {}
export class EpisodicOverrideConfigurationInput extends S.Class<EpisodicOverrideConfigurationInput>(
  "EpisodicOverrideConfigurationInput",
)({
  extraction: S.optional(EpisodicOverrideExtractionConfigurationInput),
  consolidation: S.optional(EpisodicOverrideConsolidationConfigurationInput),
  reflection: S.optional(EpisodicOverrideReflectionConfigurationInput),
}) {}
export const ModifyExtractionConfiguration = S.Union(
  S.Struct({
    customExtractionConfiguration: CustomExtractionConfigurationInput,
  }),
);
export const ModifyConsolidationConfiguration = S.Union(
  S.Struct({
    customConsolidationConfiguration: CustomConsolidationConfigurationInput,
  }),
);
export const ModifyReflectionConfiguration = S.Union(
  S.Struct({
    episodicReflectionConfiguration: EpisodicReflectionConfigurationInput,
  }),
  S.Struct({
    customReflectionConfiguration: CustomReflectionConfigurationInput,
  }),
);
export class MessageBasedTriggerInput extends S.Class<MessageBasedTriggerInput>(
  "MessageBasedTriggerInput",
)({ messageCount: S.optional(S.Number) }) {}
export class TokenBasedTriggerInput extends S.Class<TokenBasedTriggerInput>(
  "TokenBasedTriggerInput",
)({ tokenCount: S.optional(S.Number) }) {}
export class TimeBasedTriggerInput extends S.Class<TimeBasedTriggerInput>(
  "TimeBasedTriggerInput",
)({ idleSessionTimeout: S.optional(S.Number) }) {}
export const TriggerConditionInput = S.Union(
  S.Struct({ messageBasedTrigger: MessageBasedTriggerInput }),
  S.Struct({ tokenBasedTrigger: TokenBasedTriggerInput }),
  S.Struct({ timeBasedTrigger: TimeBasedTriggerInput }),
);
export const TriggerConditionInputList = S.Array(TriggerConditionInput);
export class ModifySelfManagedConfiguration extends S.Class<ModifySelfManagedConfiguration>(
  "ModifySelfManagedConfiguration",
)({
  triggerConditions: S.optional(TriggerConditionInputList),
  invocationConfiguration: S.optional(ModifyInvocationConfigurationInput),
  historicalContextWindowSize: S.optional(S.Number),
}) {}
export class ModifyStrategyConfiguration extends S.Class<ModifyStrategyConfiguration>(
  "ModifyStrategyConfiguration",
)({
  extraction: S.optional(ModifyExtractionConfiguration),
  consolidation: S.optional(ModifyConsolidationConfiguration),
  reflection: S.optional(ModifyReflectionConfiguration),
  selfManagedConfiguration: S.optional(ModifySelfManagedConfiguration),
}) {}
export class CreateGatewayResponse extends S.Class<CreateGatewayResponse>(
  "CreateGatewayResponse",
)({
  gatewayArn: S.String,
  gatewayId: S.String,
  gatewayUrl: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReasons: S.optional(StatusReasons),
  name: S.String,
  description: S.optional(S.String),
  roleArn: S.optional(S.String),
  protocolType: S.String,
  protocolConfiguration: S.optional(GatewayProtocolConfiguration),
  authorizerType: S.String,
  authorizerConfiguration: S.optional(AuthorizerConfiguration),
  kmsKeyArn: S.optional(S.String),
  interceptorConfigurations: S.optional(GatewayInterceptorConfigurations),
  policyEngineConfiguration: S.optional(GatewayPolicyEngineConfiguration),
  workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
  exceptionLevel: S.optional(S.String),
}) {}
export class EpisodicReflectionConfiguration extends S.Class<EpisodicReflectionConfiguration>(
  "EpisodicReflectionConfiguration",
)({ namespaces: NamespacesList }) {}
export class InvocationConfiguration extends S.Class<InvocationConfiguration>(
  "InvocationConfiguration",
)({ topicArn: S.String, payloadDeliveryBucketName: S.String }) {}
export class CreateOauth2CredentialProviderRequest extends S.Class<CreateOauth2CredentialProviderRequest>(
  "CreateOauth2CredentialProviderRequest",
)(
  {
    name: S.String,
    credentialProviderVendor: S.String,
    oauth2ProviderConfigInput: Oauth2ProviderConfigInput,
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identities/CreateOauth2CredentialProvider",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateOnlineEvaluationConfigResponse extends S.Class<CreateOnlineEvaluationConfigResponse>(
  "CreateOnlineEvaluationConfigResponse",
)({
  onlineEvaluationConfigArn: S.String,
  onlineEvaluationConfigId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  outputConfig: S.optional(OutputConfig),
  status: S.String,
  executionStatus: S.String,
  failureReason: S.optional(S.String),
}) {}
export type SchemaProperties = { [key: string]: SchemaDefinition };
export const SchemaProperties = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<SchemaDefinition, any> => SchemaDefinition),
}) as any as S.Schema<SchemaProperties>;
export class ModifyMemoryStrategyInput extends S.Class<ModifyMemoryStrategyInput>(
  "ModifyMemoryStrategyInput",
)({
  memoryStrategyId: S.String,
  description: S.optional(S.String),
  namespaces: S.optional(NamespacesList),
  configuration: S.optional(ModifyStrategyConfiguration),
}) {}
export const ModifyMemoryStrategiesList = S.Array(ModifyMemoryStrategyInput);
export class SelfManagedConfigurationInput extends S.Class<SelfManagedConfigurationInput>(
  "SelfManagedConfigurationInput",
)({
  triggerConditions: S.optional(TriggerConditionInputList),
  invocationConfiguration: InvocationConfigurationInput,
  historicalContextWindowSize: S.optional(S.Number),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class SemanticExtractionOverride extends S.Class<SemanticExtractionOverride>(
  "SemanticExtractionOverride",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class UserPreferenceExtractionOverride extends S.Class<UserPreferenceExtractionOverride>(
  "UserPreferenceExtractionOverride",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class EpisodicExtractionOverride extends S.Class<EpisodicExtractionOverride>(
  "EpisodicExtractionOverride",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class SemanticConsolidationOverride extends S.Class<SemanticConsolidationOverride>(
  "SemanticConsolidationOverride",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class SummaryConsolidationOverride extends S.Class<SummaryConsolidationOverride>(
  "SummaryConsolidationOverride",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class UserPreferenceConsolidationOverride extends S.Class<UserPreferenceConsolidationOverride>(
  "UserPreferenceConsolidationOverride",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class EpisodicConsolidationOverride extends S.Class<EpisodicConsolidationOverride>(
  "EpisodicConsolidationOverride",
)({ appendToPrompt: S.String, modelId: S.String }) {}
export class EpisodicReflectionOverride extends S.Class<EpisodicReflectionOverride>(
  "EpisodicReflectionOverride",
)({
  appendToPrompt: S.String,
  modelId: S.String,
  namespaces: S.optional(NamespacesList),
}) {}
export class MessageBasedTrigger extends S.Class<MessageBasedTrigger>(
  "MessageBasedTrigger",
)({ messageCount: S.optional(S.Number) }) {}
export class TokenBasedTrigger extends S.Class<TokenBasedTrigger>(
  "TokenBasedTrigger",
)({ tokenCount: S.optional(S.Number) }) {}
export class TimeBasedTrigger extends S.Class<TimeBasedTrigger>(
  "TimeBasedTrigger",
)({ idleSessionTimeout: S.optional(S.Number) }) {}
export const CustomConfigurationInput = S.Union(
  S.Struct({ semanticOverride: SemanticOverrideConfigurationInput }),
  S.Struct({ summaryOverride: SummaryOverrideConfigurationInput }),
  S.Struct({
    userPreferenceOverride: UserPreferenceOverrideConfigurationInput,
  }),
  S.Struct({ episodicOverride: EpisodicOverrideConfigurationInput }),
  S.Struct({ selfManagedConfiguration: SelfManagedConfigurationInput }),
);
export class CustomMemoryStrategyInput extends S.Class<CustomMemoryStrategyInput>(
  "CustomMemoryStrategyInput",
)({
  name: S.String,
  description: S.optional(S.String),
  namespaces: S.optional(NamespacesList),
  configuration: S.optional(CustomConfigurationInput),
}) {}
export const MemoryStrategyInput = S.Union(
  S.Struct({ semanticMemoryStrategy: SemanticMemoryStrategyInput }),
  S.Struct({ summaryMemoryStrategy: SummaryMemoryStrategyInput }),
  S.Struct({ userPreferenceMemoryStrategy: UserPreferenceMemoryStrategyInput }),
  S.Struct({ customMemoryStrategy: CustomMemoryStrategyInput }),
  S.Struct({ episodicMemoryStrategy: EpisodicMemoryStrategyInput }),
);
export const MemoryStrategyInputList = S.Array(MemoryStrategyInput);
export class ModifyMemoryStrategies extends S.Class<ModifyMemoryStrategies>(
  "ModifyMemoryStrategies",
)({
  addMemoryStrategies: S.optional(MemoryStrategyInputList),
  modifyMemoryStrategies: S.optional(ModifyMemoryStrategiesList),
  deleteMemoryStrategies: S.optional(DeleteMemoryStrategiesList),
}) {}
export class CreateAgentRuntimeRequest extends S.Class<CreateAgentRuntimeRequest>(
  "CreateAgentRuntimeRequest",
)(
  {
    agentRuntimeName: S.String,
    agentRuntimeArtifact: AgentRuntimeArtifact,
    roleArn: S.String,
    networkConfiguration: NetworkConfiguration,
    clientToken: S.optional(S.String),
    description: S.optional(S.String),
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    requestHeaderConfiguration: S.optional(RequestHeaderConfiguration),
    protocolConfiguration: S.optional(ProtocolConfiguration),
    lifecycleConfiguration: S.optional(LifecycleConfiguration),
    environmentVariables: S.optional(EnvironmentVariablesMap),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/runtimes/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEvaluatorRequest extends S.Class<CreateEvaluatorRequest>(
  "CreateEvaluatorRequest",
)(
  {
    clientToken: S.optional(S.String),
    evaluatorName: S.String,
    description: S.optional(S.String),
    evaluatorConfig: EvaluatorConfig,
    level: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/evaluators/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const CustomExtractionConfiguration = S.Union(
  S.Struct({ semanticExtractionOverride: SemanticExtractionOverride }),
  S.Struct({
    userPreferenceExtractionOverride: UserPreferenceExtractionOverride,
  }),
  S.Struct({ episodicExtractionOverride: EpisodicExtractionOverride }),
);
export const CustomConsolidationConfiguration = S.Union(
  S.Struct({ semanticConsolidationOverride: SemanticConsolidationOverride }),
  S.Struct({ summaryConsolidationOverride: SummaryConsolidationOverride }),
  S.Struct({
    userPreferenceConsolidationOverride: UserPreferenceConsolidationOverride,
  }),
  S.Struct({ episodicConsolidationOverride: EpisodicConsolidationOverride }),
);
export const CustomReflectionConfiguration = S.Union(
  S.Struct({ episodicReflectionOverride: EpisodicReflectionOverride }),
);
export const TriggerCondition = S.Union(
  S.Struct({ messageBasedTrigger: MessageBasedTrigger }),
  S.Struct({ tokenBasedTrigger: TokenBasedTrigger }),
  S.Struct({ timeBasedTrigger: TimeBasedTrigger }),
);
export const TriggerConditionsList = S.Array(TriggerCondition);
export class UpdateMemoryInput extends S.Class<UpdateMemoryInput>(
  "UpdateMemoryInput",
)(
  {
    clientToken: S.optional(S.String),
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    description: S.optional(S.String),
    eventExpiryDuration: S.optional(S.Number),
    memoryExecutionRoleArn: S.optional(S.String),
    memoryStrategies: S.optional(ModifyMemoryStrategies),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/memories/{memoryId}/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateOauth2CredentialProviderResponse extends S.Class<CreateOauth2CredentialProviderResponse>(
  "CreateOauth2CredentialProviderResponse",
)({
  clientSecretArn: Secret,
  name: S.String,
  credentialProviderArn: S.String,
  callbackUrl: S.optional(S.String),
  oauth2ProviderConfigOutput: S.optional(Oauth2ProviderConfigOutput),
}) {}
export const ExtractionConfiguration = S.Union(
  S.Struct({ customExtractionConfiguration: CustomExtractionConfiguration }),
);
export const ConsolidationConfiguration = S.Union(
  S.Struct({
    customConsolidationConfiguration: CustomConsolidationConfiguration,
  }),
);
export const ReflectionConfiguration = S.Union(
  S.Struct({ customReflectionConfiguration: CustomReflectionConfiguration }),
  S.Struct({
    episodicReflectionConfiguration: EpisodicReflectionConfiguration,
  }),
);
export class SelfManagedConfiguration extends S.Class<SelfManagedConfiguration>(
  "SelfManagedConfiguration",
)({
  triggerConditions: TriggerConditionsList,
  invocationConfiguration: InvocationConfiguration,
  historicalContextWindowSize: S.Number,
}) {}
export class StrategyConfiguration extends S.Class<StrategyConfiguration>(
  "StrategyConfiguration",
)({
  type: S.optional(S.String),
  extraction: S.optional(ExtractionConfiguration),
  consolidation: S.optional(ConsolidationConfiguration),
  reflection: S.optional(ReflectionConfiguration),
  selfManagedConfiguration: S.optional(SelfManagedConfiguration),
}) {}
export class CreateAgentRuntimeResponse extends S.Class<CreateAgentRuntimeResponse>(
  "CreateAgentRuntimeResponse",
)({
  agentRuntimeArn: S.String,
  workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
  agentRuntimeId: S.String,
  agentRuntimeVersion: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export class CreateEvaluatorResponse extends S.Class<CreateEvaluatorResponse>(
  "CreateEvaluatorResponse",
)({
  evaluatorArn: S.String,
  evaluatorId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
}) {}
export class CreateMemoryInput extends S.Class<CreateMemoryInput>(
  "CreateMemoryInput",
)(
  {
    clientToken: S.optional(S.String),
    name: S.String,
    description: S.optional(S.String),
    encryptionKeyArn: S.optional(S.String),
    memoryExecutionRoleArn: S.optional(S.String),
    eventExpiryDuration: S.Number,
    memoryStrategies: S.optional(MemoryStrategyInputList),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/memories/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MemoryStrategy extends S.Class<MemoryStrategy>("MemoryStrategy")({
  strategyId: S.String,
  name: S.String,
  description: S.optional(S.String),
  configuration: S.optional(StrategyConfiguration),
  type: S.String,
  namespaces: NamespacesList,
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
}) {}
export const MemoryStrategyList = S.Array(MemoryStrategy);
export class Memory extends S.Class<Memory>("Memory")({
  arn: S.String,
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  encryptionKeyArn: S.optional(S.String),
  memoryExecutionRoleArn: S.optional(S.String),
  eventExpiryDuration: S.Number,
  status: S.String,
  failureReason: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  strategies: S.optional(MemoryStrategyList),
}) {}
export class UpdateMemoryOutput extends S.Class<UpdateMemoryOutput>(
  "UpdateMemoryOutput",
)({ memory: S.optional(Memory) }) {}
export class CreateGatewayTargetRequest extends S.Class<CreateGatewayTargetRequest>(
  "CreateGatewayTargetRequest",
)(
  {
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
    targetConfiguration: TargetConfiguration,
    credentialProviderConfigurations: S.optional(
      CredentialProviderConfigurations,
    ),
    metadataConfiguration: S.optional(MetadataConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/gateways/{gatewayIdentifier}/targets/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMemoryOutput extends S.Class<CreateMemoryOutput>(
  "CreateMemoryOutput",
)({ memory: S.optional(Memory) }) {}
export class GetMemoryOutput extends S.Class<GetMemoryOutput>(
  "GetMemoryOutput",
)({ memory: Memory }) {}
export class CreateGatewayTargetResponse extends S.Class<CreateGatewayTargetResponse>(
  "CreateGatewayTargetResponse",
)({
  gatewayArn: S.String,
  targetId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReasons: S.optional(StatusReasons),
  name: S.String,
  description: S.optional(S.String),
  targetConfiguration: TargetConfiguration,
  credentialProviderConfigurations: CredentialProviderConfigurations,
  lastSynchronizedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  metadataConfiguration: S.optional(MetadataConfiguration),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class DecryptionFailure extends S.TaggedError<DecryptionFailure>()(
  "DecryptionFailure",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class EncryptionFailure extends S.TaggedError<EncryptionFailure>()(
  "EncryptionFailure",
  { message: S.String },
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}
export class ThrottledException extends S.TaggedError<ThrottledException>()(
  "ThrottledException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Gets information about a custom browser.
 */
export const getBrowser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBrowserRequest,
  output: GetBrowserResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Gets information about a custom code interpreter.
 */
export const getCodeInterpreter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCodeInterpreterRequest,
  output: GetCodeInterpreterResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an AAgentCore Runtime endpoint.
 */
export const deleteAgentRuntimeEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAgentRuntimeEndpointRequest,
    output: DeleteAgentRuntimeEndpointResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes an Amazon Bedrock AgentCore Runtime.
 */
export const deleteAgentRuntime = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAgentRuntimeRequest,
  output: DeleteAgentRuntimeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all endpoints for a specific Amazon Secure Agent.
 */
export const listAgentRuntimeEndpoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAgentRuntimeEndpointsRequest,
    output: ListAgentRuntimeEndpointsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "runtimeEndpoints",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a new OAuth2 credential provider.
 */
export const createOauth2CredentialProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateOauth2CredentialProviderRequest,
    output: CreateOauth2CredentialProviderResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      DecryptionFailure,
      EncryptionFailure,
      InternalServerException,
      ResourceLimitExceededException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }));
/**
 * Lists the available Amazon Bedrock AgentCore Memory resources in the current Amazon Web Services Region.
 */
export const listMemories = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMemoriesInput,
    output: ListMemoriesOutput,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ServiceException,
      ThrottledException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "memories",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a custom code interpreter.
 */
export const createCodeInterpreter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCodeInterpreterRequest,
    output: CreateCodeInterpreterResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves detailed information about an online evaluation configuration, including its rules, data sources, evaluators, and execution status.
 */
export const getOnlineEvaluationConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOnlineEvaluationConfigRequest,
    output: GetOnlineEvaluationConfigResponse,
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
 * Retrieves a list of generated policy assets from a policy generation request within the AgentCore Policy system. This operation returns the actual Cedar policies and related artifacts produced by the AI-powered policy generation process, allowing users to review and select from multiple generated policy options.
 */
export const listPolicyGenerationAssets =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPolicyGenerationAssetsRequest,
    output: ListPolicyGenerationAssetsResponse,
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
      items: "policyGenerationAssets",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a policy within the AgentCore Policy system. Policies provide real-time, deterministic control over agentic interactions with AgentCore Gateway. Using the Cedar policy language, you can define fine-grained policies that specify which interactions with Gateway tools are permitted based on input parameters and OAuth claims, ensuring agents operate within defined boundaries and business rules. The policy is validated during creation against the Cedar schema generated from the Gateway's tools' input schemas, which defines the available tools, their parameters, and expected data types. This is an asynchronous operation. Use the GetPolicy operation to poll the `status` field to track completion.
 */
export const createPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyRequest,
  output: CreatePolicyResponse,
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
 * Creates an AgentCore Runtime endpoint.
 */
export const createAgentRuntimeEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAgentRuntimeEndpointRequest,
    output: CreateAgentRuntimeEndpointResponse,
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
 * Gets an Amazon Bedrock AgentCore Runtime.
 */
export const getAgentRuntime = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAgentRuntimeRequest,
  output: GetAgentRuntimeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The gateway targets.
 */
export const synchronizeGatewayTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SynchronizeGatewayTargetsRequest,
    output: SynchronizeGatewayTargetsResponse,
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
 * Initiates the AI-powered generation of Cedar policies from natural language descriptions within the AgentCore Policy system. This feature enables both technical and non-technical users to create policies by describing their authorization requirements in plain English, which is then automatically translated into formal Cedar policy statements. The generation process analyzes the natural language input along with the Gateway's tool context to produce validated policy options. Generated policy assets are automatically deleted after 7 days, so you should review and create policies from the generated assets within this timeframe. Once created, policies are permanent and not subject to this expiration. Generated policies should be reviewed and tested in log-only mode before deploying to production. Use this when you want to describe policy intent naturally rather than learning Cedar syntax, though generated policies may require refinement for complex scenarios.
 */
export const startPolicyGeneration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartPolicyGenerationRequest,
    output: StartPolicyGenerationResponse,
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
 * Retrieves a list of policy generation requests within the AgentCore Policy system. This operation supports pagination and filtering to help track and manage AI-powered policy generation operations.
 */
export const listPolicyGenerations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPolicyGenerationsRequest,
    output: ListPolicyGenerationsResponse,
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
      items: "policyGenerations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a list of policies within the AgentCore Policy engine. This operation supports pagination and filtering to help administrators manage and discover policies across policy engines. Results can be filtered by policy engine or resource associations.
 */
export const listPolicies = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPoliciesRequest,
    output: ListPoliciesResponse,
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
      items: "policies",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves the resource-based policy for a specified resource.
 *
 * This feature is currently available only for AgentCore Runtime and Gateway.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags associated with the specified resource.
 *
 * This feature is currently available only for AgentCore Runtime, Browser, Code Interpreter tool, and Gateway.
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
 * Creates or updates a resource-based policy for a resource with the specified resourceArn.
 *
 * This feature is currently available only for AgentCore Runtime and Gateway.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource are not specified in the request parameters, they are not changed. When a resource is deleted, the tags associated with that resource are also deleted.
 *
 * This feature is currently available only for AgentCore Runtime, Browser, Code Interpreter tool, and Gateway.
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
 * Gets information about an Amazon Secure AgentEndpoint.
 */
export const getAgentRuntimeEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAgentRuntimeEndpointRequest,
    output: GetAgentRuntimeEndpointResponse,
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
 * Lists all versions of a specific Amazon Secure Agent.
 */
export const listAgentRuntimeVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAgentRuntimeVersionsRequest,
    output: ListAgentRuntimeVersionsResponse,
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
      items: "agentRuntimes",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves detailed information about an evaluator, including its configuration, status, and metadata. Works with both built-in and custom evaluators.
 */
export const getEvaluator = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEvaluatorRequest,
  output: GetEvaluatorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a specific Gateway.
 */
export const getGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGatewayRequest,
  output: GetGatewayResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a specific gateway target.
 */
export const getGatewayTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGatewayTargetRequest,
  output: GetGatewayTargetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves detailed information about a specific policy engine within the AgentCore Policy system. This operation returns the complete policy engine configuration, metadata, and current status, allowing administrators to review and manage policy engine settings.
 */
export const getPolicyEngine = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyEngineRequest,
  output: GetPolicyEngineResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a policy generation request within the AgentCore Policy system. Policy generation converts natural language descriptions into Cedar policy statements using AI-powered translation, enabling non-technical users to create policies.
 */
export const getPolicyGeneration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyGenerationRequest,
  output: GetPolicyGenerationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves detailed information about a specific policy within the AgentCore Policy system. This operation returns the complete policy definition, metadata, and current status, allowing administrators to review and manage policy configurations.
 */
export const getPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the specified tags from the specified resource.
 *
 * This feature is currently available only for AgentCore Runtime, Browser, Code Interpreter tool, and Gateway.
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
 * Updates an existing Amazon Bedrock AgentCore Runtime endpoint.
 */
export const updateAgentRuntimeEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAgentRuntimeEndpointRequest,
    output: UpdateAgentRuntimeEndpointResponse,
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
 * Updates an existing Amazon Secure Agent.
 */
export const updateAgentRuntime = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAgentRuntimeRequest,
  output: UpdateAgentRuntimeResponse,
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
 * Deletes a custom browser.
 */
export const deleteBrowser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBrowserRequest,
  output: DeleteBrowserResponse,
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
 * Deletes a custom code interpreter.
 */
export const deleteCodeInterpreter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCodeInterpreterRequest,
    output: DeleteCodeInterpreterResponse,
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
 * Updates a custom evaluator's configuration, description, or evaluation level. Built-in evaluators cannot be updated. The evaluator must not be locked for modification.
 */
export const updateEvaluator = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEvaluatorRequest,
  output: UpdateEvaluatorResponse,
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
 * Deletes a custom evaluator. Builtin evaluators cannot be deleted. The evaluator must not be referenced by any active online evaluation configurations.
 */
export const deleteEvaluator = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEvaluatorRequest,
  output: DeleteEvaluatorResponse,
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
 * Deletes a gateway.
 */
export const deleteGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGatewayRequest,
  output: DeleteGatewayResponse,
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
 * Updates an existing gateway.
 */
export const updateGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewayRequest,
  output: UpdateGatewayResponse,
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
 * Deletes a gateway target.
 */
export const deleteGatewayTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGatewayTargetRequest,
  output: DeleteGatewayTargetResponse,
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
 * Updates an existing gateway target.
 */
export const updateGatewayTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewayTargetRequest,
  output: UpdateGatewayTargetResponse,
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
 * Updates an online evaluation configuration's settings, including rules, data sources, evaluators, and execution status. Changes take effect immediately for ongoing evaluations.
 */
export const updateOnlineEvaluationConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateOnlineEvaluationConfigRequest,
    output: UpdateOnlineEvaluationConfigResponse,
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
 * Deletes an online evaluation configuration and stops any ongoing evaluation processes associated with it.
 */
export const deleteOnlineEvaluationConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteOnlineEvaluationConfigRequest,
    output: DeleteOnlineEvaluationConfigResponse,
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
 * Updates an existing policy engine within the AgentCore Policy system. This operation allows modification of the policy engine description while maintaining its identity. This is an asynchronous operation. Use the `GetPolicyEngine` operation to poll the `status` field to track completion.
 */
export const updatePolicyEngine = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePolicyEngineRequest,
  output: UpdatePolicyEngineResponse,
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
 * Deletes an existing policy engine from the AgentCore Policy system. The policy engine must not have any associated policies before deletion. Once deleted, the policy engine and all its configurations become unavailable for policy management and evaluation. This is an asynchronous operation. Use the `GetPolicyEngine` operation to poll the `status` field to track completion.
 */
export const deletePolicyEngine = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyEngineRequest,
  output: DeletePolicyEngineResponse,
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
 * Updates an existing policy within the AgentCore Policy system. This operation allows modification of the policy description and definition while maintaining the policy's identity. The updated policy is validated against the Cedar schema before being applied. This is an asynchronous operation. Use the `GetPolicy` operation to poll the `status` field to track completion.
 */
export const updatePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePolicyRequest,
  output: UpdatePolicyResponse,
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
 * Deletes an existing policy from the AgentCore Policy system. Once deleted, the policy can no longer be used for agent behavior control and all references to it become invalid. This is an asynchronous operation. Use the `GetPolicy` operation to poll the `status` field to track completion.
 */
export const deletePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
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
 * Lists all Amazon Secure Agents in your account.
 */
export const listAgentRuntimes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAgentRuntimesRequest,
    output: ListAgentRuntimesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "agentRuntimes",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all custom browsers in your account.
 */
export const listBrowsers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListBrowsersRequest,
    output: ListBrowsersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "browserSummaries",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all custom code interpreters in your account.
 */
export const listCodeInterpreters =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCodeInterpretersRequest,
    output: ListCodeInterpretersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "codeInterpreterSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all available evaluators, including both builtin evaluators provided by the service and custom evaluators created by the user.
 */
export const listEvaluators = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEvaluatorsRequest,
    output: ListEvaluatorsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "evaluators",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all gateways in the account.
 */
export const listGateways = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListGatewaysRequest,
    output: ListGatewaysResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all targets for a specific gateway.
 */
export const listGatewayTargets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListGatewayTargetsRequest,
    output: ListGatewayTargetsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all online evaluation configurations in the account, providing summary information about each configuration's status and settings.
 */
export const listOnlineEvaluationConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListOnlineEvaluationConfigsRequest,
    output: ListOnlineEvaluationConfigsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "onlineEvaluationConfigs",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a list of policy engines within the AgentCore Policy system. This operation supports pagination to help administrators discover and manage policy engines across their account. Each policy engine serves as a container for related policies.
 */
export const listPolicyEngines = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPolicyEnginesRequest,
    output: ListPolicyEnginesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "policyEngines",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Deletes the resource-based policy for a specified resource.
 *
 * This feature is currently available only for AgentCore Runtime and Gateway.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
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
 * Creates a new policy engine within the AgentCore Policy system. A policy engine is a collection of policies that evaluates and authorizes agent tool calls. When associated with Gateways (each Gateway can be associated with at most one policy engine, but multiple Gateways can be associated with the same engine), the policy engine intercepts all agent requests and determines whether to allow or deny each action based on the defined policies. This is an asynchronous operation. Use the GetPolicyEngine operation to poll the `status` field to track completion.
 */
export const createPolicyEngine = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePolicyEngineRequest,
  output: CreatePolicyEngineResponse,
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
 * Creates a custom browser.
 */
export const createBrowser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBrowserRequest,
  output: CreateBrowserResponse,
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
 * Creates a gateway for Amazon Bedrock Agent. A gateway serves as an integration point between your agent and external services.
 *
 * If you specify `CUSTOM_JWT` as the `authorizerType`, you must provide an `authorizerConfiguration`.
 */
export const createGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGatewayRequest,
  output: CreateGatewayResponse,
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
 * Retrieves information about an OAuth2 credential provider.
 */
export const getOauth2CredentialProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOauth2CredentialProviderRequest,
    output: GetOauth2CredentialProviderResponse,
    errors: [
      AccessDeniedException,
      DecryptionFailure,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an online evaluation configuration for continuous monitoring of agent performance. Online evaluation automatically samples live traffic from CloudWatch logs at specified rates and applies evaluators to assess agent quality in production.
 */
export const createOnlineEvaluationConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateOnlineEvaluationConfigRequest,
    output: CreateOnlineEvaluationConfigResponse,
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
 * Retrieves information about an API key credential provider.
 */
export const getApiKeyCredentialProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetApiKeyCredentialProviderRequest,
    output: GetApiKeyCredentialProviderResponse,
    errors: [
      AccessDeniedException,
      DecryptionFailure,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all API key credential providers in your account.
 */
export const listApiKeyCredentialProviders =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListApiKeyCredentialProvidersRequest,
    output: ListApiKeyCredentialProvidersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "credentialProviders",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all OAuth2 credential providers in your account.
 */
export const listOauth2CredentialProviders =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListOauth2CredentialProvidersRequest,
    output: ListOauth2CredentialProvidersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "credentialProviders",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all workload identities in your account.
 */
export const listWorkloadIdentities =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkloadIdentitiesRequest,
    output: ListWorkloadIdentitiesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workloadIdentities",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves information about a token vault.
 */
export const getTokenVault = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTokenVaultRequest,
  output: GetTokenVaultResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates a new workload identity.
 */
export const createWorkloadIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWorkloadIdentityRequest,
    output: CreateWorkloadIdentityResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves information about a workload identity.
 */
export const getWorkloadIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkloadIdentityRequest,
  output: GetWorkloadIdentityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates an existing workload identity.
 */
export const updateWorkloadIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWorkloadIdentityRequest,
    output: UpdateWorkloadIdentityResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an API key credential provider.
 */
export const deleteApiKeyCredentialProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteApiKeyCredentialProviderRequest,
    output: DeleteApiKeyCredentialProviderResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }));
/**
 * Deletes an OAuth2 credential provider.
 */
export const deleteOauth2CredentialProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteOauth2CredentialProviderRequest,
    output: DeleteOauth2CredentialProviderResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }));
/**
 * Deletes a workload identity.
 */
export const deleteWorkloadIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWorkloadIdentityRequest,
    output: DeleteWorkloadIdentityResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Updates an existing API key credential provider.
 */
export const updateApiKeyCredentialProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateApiKeyCredentialProviderRequest,
    output: UpdateApiKeyCredentialProviderResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      DecryptionFailure,
      EncryptionFailure,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }));
/**
 * Sets the customer master key (CMK) for a token vault.
 */
export const setTokenVaultCMK = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetTokenVaultCMKRequest,
  output: SetTokenVaultCMKResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Updates an existing OAuth2 credential provider.
 */
export const updateOauth2CredentialProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateOauth2CredentialProviderRequest,
    output: UpdateOauth2CredentialProviderResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      DecryptionFailure,
      EncryptionFailure,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }));
/**
 * Creates a new API key credential provider.
 */
export const createApiKeyCredentialProvider =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateApiKeyCredentialProviderRequest,
    output: CreateApiKeyCredentialProviderResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      DecryptionFailure,
      EncryptionFailure,
      InternalServerException,
      ResourceLimitExceededException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }));
/**
 * Deletes an Amazon Bedrock AgentCore Memory resource.
 */
export const deleteMemory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMemoryInput,
  output: DeleteMemoryOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Bedrock AgentCore Runtime.
 */
export const createAgentRuntime = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAgentRuntimeRequest,
  output: CreateAgentRuntimeResponse,
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
 * Creates a custom evaluator for agent quality assessment. Custom evaluators use LLM-as-a-Judge configurations with user-defined prompts, rating scales, and model settings to evaluate agent performance at tool call, trace, or session levels.
 */
export const createEvaluator = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEvaluatorRequest,
  output: CreateEvaluatorResponse,
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
 * Update an Amazon Bedrock AgentCore Memory resource memory.
 */
export const updateMemory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMemoryInput,
  output: UpdateMemoryOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Creates a new Amazon Bedrock AgentCore Memory resource.
 */
export const createMemory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMemoryInput,
  output: CreateMemoryOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Retrieve an existing Amazon Bedrock AgentCore Memory resource.
 */
export const getMemory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMemoryInput,
  output: GetMemoryOutput,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ServiceException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Creates a target for a gateway. A target defines an endpoint that the gateway can connect to.
 */
export const createGatewayTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGatewayTargetRequest,
  output: CreateGatewayTargetResponse,
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
