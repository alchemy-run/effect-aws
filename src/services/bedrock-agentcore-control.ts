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
  sdkId: "Bedrock AgentCore Control",
  serviceShapeName: "AmazonBedrockAgentCoreControl",
});
const auth = T.AwsAuthSigv4({ name: "bedrock-agentcore" });
const ver = T.ServiceVersion("2023-06-05");
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
              `https://bedrock-agentcore-control-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://bedrock-agentcore-control-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://bedrock-agentcore-control.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://bedrock-agentcore-control.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type BedrockAgentcoreResourceArn = string;
export type TokenVaultIdType = string;
export type TaggableResourcesArn = string;
export type ResourcePolicyBody = string;
export type TagKey = string;
export type AgentRuntimeId = string;
export type EndpointName = string | redacted.Redacted<string>;
export type AgentRuntimeVersion = string;
export type AgentEndpointDescription = string;
export type ClientToken = string;
export type MaxResults = number;
export type NextToken = string;
export type AgentRuntimeName = string;
export type RoleArn = string;
export type Description = string | redacted.Redacted<string>;
export type CredentialProviderName = string;
export type ApiKeyType = string | redacted.Redacted<string>;
export type SandboxName = string;
export type BrowserId = string;
export type CodeInterpreterId = string;
export type CustomEvaluatorName = string;
export type EvaluatorDescription = string | redacted.Redacted<string>;
export type EvaluatorId = string;
export type GatewayName = string | redacted.Redacted<string>;
export type GatewayDescription = string | redacted.Redacted<string>;
export type KmsKeyArn = string;
export type GatewayIdentifier = string;
export type GatewayMaxResults = number;
export type GatewayNextToken = string;
export type TargetName = string | redacted.Redacted<string>;
export type TargetDescription = string | redacted.Redacted<string>;
export type TargetId = string;
export type TargetMaxResults = number;
export type TargetNextToken = string;
export type NonEmptyString = string;
export type Name = string;
export type Arn = string;
export type MemoryId = string;
export type EvaluationConfigName = string;
export type EvaluationConfigDescription = string | redacted.Redacted<string>;
export type OnlineEvaluationConfigId = string;
export type PolicyEngineName = string;
export type ResourceId = string;
export type PolicyGenerationName = string;
export type PolicyName = string;
export type WorkloadIdentityNameType = string;
export type ResourceOauth2ReturnUrlType = string;
export type TagValue = string;
export type HeaderName = string;
export type EnvironmentVariableKey = string;
export type EnvironmentVariableValue = string;
export type GatewayPolicyEngineArn = string;
export type HttpHeaderName = string;
export type HttpQueryParameterName = string;
export type NaturalLanguage = string;
export type NonBlankString = string;
export type AgentRuntimeEndpointArn = string;
export type AgentRuntimeArn = string;
export type AgentRuntimeEndpointId = string;
export type ApiKeyCredentialProviderArnType = string;
export type BrowserArn = string;
export type CodeInterpreterArn = string;
export type EvaluatorArn = string;
export type EvaluatorName = string;
export type GatewayId = string;
export type StatusReason = string;
export type GatewayArn = string;
export type GatewayUrl = string;
export type CredentialProviderArnType = string;
export type OnlineEvaluationConfigArn = string;
export type PolicyEngineArn = string;
export type PolicyGenerationArn = string;
export type PolicyArn = string;
export type WorkloadIdentityArnType = string;
export type RuntimeContainerUri = string;
export type entryPoint = string;
export type SecurityGroupId = string;
export type SubnetId = string;
export type DiscoveryUrl = string;
export type AllowedAudience = string;
export type AllowedClient = string;
export type AllowedScopeType = string;
export type EvaluatorInstructions = string | redacted.Redacted<string>;
export type McpVersion = string;
export type McpInstructions = string;
export type Namespace = string;
export type ClientIdType = string;
export type ClientSecretType = string | redacted.Redacted<string>;
export type TenantIdType = string;
export type IssuerUrlType = string;
export type AuthorizationEndpointType = string;
export type TokenEndpointType = string;
export type SamplingPercentage = number;
export type LogGroupName = string;
export type ServiceName = string;
export type Statement = string;
export type WorkloadIdentityArn = string;
export type SecretArn = string;
export type MemoryArn = string;
export type InboundTokenClaimNameType = string;
export type LambdaFunctionArn = string;
export type InlinePayload = string | redacted.Redacted<string>;
export type OAuthCredentialProviderArn = string;
export type OAuthScope = string;
export type OAuthDefaultReturnUrl = string;
export type ApiKeyCredentialProviderArn = string;
export type ApiKeyCredentialParameterName = string;
export type ApiKeyCredentialPrefix = string;
export type DiscoveryUrlType = string;
export type MemoryStrategyId = string;
export type ModelId = string;
export type AdditionalModelRequestFields = unknown;
export type S3BucketUri = string;
export type AwsAccountId = string;
export type OAuthCustomParametersKey = string;
export type OAuthCustomParametersValue = string | redacted.Redacted<string>;
export type ResponseType = string;
export type TokenAuthMethod = string;
export type MatchValueString = string;
export type Prompt = string | redacted.Redacted<string>;
export type CustomEvaluatorArn = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type ResourceType = "SYSTEM" | "CUSTOM";
export const ResourceType = S.Literal("SYSTEM", "CUSTOM");
export type EvaluatorLevel = "TOOL_CALL" | "TRACE" | "SESSION";
export const EvaluatorLevel = S.Literal("TOOL_CALL", "TRACE", "SESSION");
export type GatewayProtocolType = "MCP";
export const GatewayProtocolType = S.Literal("MCP");
export type AuthorizerType = "CUSTOM_JWT" | "AWS_IAM" | "NONE";
export const AuthorizerType = S.Literal("CUSTOM_JWT", "AWS_IAM", "NONE");
export type ExceptionLevel = "DEBUG";
export const ExceptionLevel = S.Literal("DEBUG");
export type TargetIdList = string[];
export const TargetIdList = S.Array(S.String);
export type CredentialProviderVendorType =
  | "GoogleOauth2"
  | "GithubOauth2"
  | "SlackOauth2"
  | "SalesforceOauth2"
  | "MicrosoftOauth2"
  | "CustomOauth2"
  | "AtlassianOauth2"
  | "LinkedinOauth2"
  | "XOauth2"
  | "OktaOauth2"
  | "OneLoginOauth2"
  | "PingOneOauth2"
  | "FacebookOauth2"
  | "YandexOauth2"
  | "RedditOauth2"
  | "ZoomOauth2"
  | "TwitchOauth2"
  | "SpotifyOauth2"
  | "DropboxOauth2"
  | "NotionOauth2"
  | "HubspotOauth2"
  | "CyberArkOauth2"
  | "FusionAuthOauth2"
  | "Auth0Oauth2"
  | "CognitoOauth2";
export const CredentialProviderVendorType = S.Literal(
  "GoogleOauth2",
  "GithubOauth2",
  "SlackOauth2",
  "SalesforceOauth2",
  "MicrosoftOauth2",
  "CustomOauth2",
  "AtlassianOauth2",
  "LinkedinOauth2",
  "XOauth2",
  "OktaOauth2",
  "OneLoginOauth2",
  "PingOneOauth2",
  "FacebookOauth2",
  "YandexOauth2",
  "RedditOauth2",
  "ZoomOauth2",
  "TwitchOauth2",
  "SpotifyOauth2",
  "DropboxOauth2",
  "NotionOauth2",
  "HubspotOauth2",
  "CyberArkOauth2",
  "FusionAuthOauth2",
  "Auth0Oauth2",
  "CognitoOauth2",
);
export type OnlineEvaluationExecutionStatus = "ENABLED" | "DISABLED";
export const OnlineEvaluationExecutionStatus = S.Literal("ENABLED", "DISABLED");
export type PolicyValidationMode =
  | "FAIL_ON_ANY_FINDINGS"
  | "IGNORE_ALL_FINDINGS";
export const PolicyValidationMode = S.Literal(
  "FAIL_ON_ANY_FINDINGS",
  "IGNORE_ALL_FINDINGS",
);
export type ResourceOauth2ReturnUrlListType = string[];
export const ResourceOauth2ReturnUrlListType = S.Array(S.String);
export interface DeleteResourcePolicyRequest {
  resourceArn: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/resourcepolicy/{resourceArn}" }),
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
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface GetResourcePolicyRequest {
  resourceArn: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/resourcepolicy/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface GetTokenVaultRequest {
  tokenVaultId?: string;
}
export const GetTokenVaultRequest = S.suspend(() =>
  S.Struct({ tokenVaultId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identities/get-token-vault" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTokenVaultRequest",
}) as any as S.Schema<GetTokenVaultRequest>;
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
export interface PutResourcePolicyRequest {
  resourceArn: string;
  policy: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    policy: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/resourcepolicy/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
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
export type TagsMap = { [key: string]: string };
export const TagsMap = S.Record({ key: S.String, value: S.String });
export interface CreateAgentRuntimeEndpointRequest {
  agentRuntimeId: string;
  name: string | redacted.Redacted<string>;
  agentRuntimeVersion?: string;
  description?: string;
  clientToken?: string;
  tags?: { [key: string]: string };
}
export const CreateAgentRuntimeEndpointRequest = S.suspend(() =>
  S.Struct({
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    name: SensitiveString,
    agentRuntimeVersion: S.optional(S.String),
    description: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagsMap),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateAgentRuntimeEndpointRequest",
}) as any as S.Schema<CreateAgentRuntimeEndpointRequest>;
export interface GetAgentRuntimeEndpointRequest {
  agentRuntimeId: string;
  endpointName: string | redacted.Redacted<string>;
}
export const GetAgentRuntimeEndpointRequest = S.suspend(() =>
  S.Struct({
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    endpointName: SensitiveString.pipe(T.HttpLabel("endpointName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetAgentRuntimeEndpointRequest",
}) as any as S.Schema<GetAgentRuntimeEndpointRequest>;
export interface UpdateAgentRuntimeEndpointRequest {
  agentRuntimeId: string;
  endpointName: string | redacted.Redacted<string>;
  agentRuntimeVersion?: string;
  description?: string;
  clientToken?: string;
}
export const UpdateAgentRuntimeEndpointRequest = S.suspend(() =>
  S.Struct({
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    endpointName: SensitiveString.pipe(T.HttpLabel("endpointName")),
    agentRuntimeVersion: S.optional(S.String),
    description: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateAgentRuntimeEndpointRequest",
}) as any as S.Schema<UpdateAgentRuntimeEndpointRequest>;
export interface DeleteAgentRuntimeEndpointRequest {
  agentRuntimeId: string;
  endpointName: string | redacted.Redacted<string>;
  clientToken?: string;
}
export const DeleteAgentRuntimeEndpointRequest = S.suspend(() =>
  S.Struct({
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    endpointName: SensitiveString.pipe(T.HttpLabel("endpointName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteAgentRuntimeEndpointRequest",
}) as any as S.Schema<DeleteAgentRuntimeEndpointRequest>;
export interface ListAgentRuntimeEndpointsRequest {
  agentRuntimeId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAgentRuntimeEndpointsRequest = S.suspend(() =>
  S.Struct({
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListAgentRuntimeEndpointsRequest",
}) as any as S.Schema<ListAgentRuntimeEndpointsRequest>;
export interface GetAgentRuntimeRequest {
  agentRuntimeId: string;
  agentRuntimeVersion?: string;
}
export const GetAgentRuntimeRequest = S.suspend(() =>
  S.Struct({
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    agentRuntimeVersion: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/runtimes/{agentRuntimeId}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAgentRuntimeRequest",
}) as any as S.Schema<GetAgentRuntimeRequest>;
export interface ContainerConfiguration {
  containerUri: string;
}
export const ContainerConfiguration = S.suspend(() =>
  S.Struct({ containerUri: S.String }),
).annotations({
  identifier: "ContainerConfiguration",
}) as any as S.Schema<ContainerConfiguration>;
export interface S3Location {
  bucket: string;
  prefix: string;
  versionId?: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({
    bucket: S.String,
    prefix: S.String,
    versionId: S.optional(S.String),
  }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export type Code = { s3: S3Location };
export const Code = S.Union(S.Struct({ s3: S3Location }));
export type AgentManagedRuntimeType =
  | "PYTHON_3_10"
  | "PYTHON_3_11"
  | "PYTHON_3_12"
  | "PYTHON_3_13";
export const AgentManagedRuntimeType = S.Literal(
  "PYTHON_3_10",
  "PYTHON_3_11",
  "PYTHON_3_12",
  "PYTHON_3_13",
);
export type EntryPoints = string[];
export const EntryPoints = S.Array(S.String);
export interface CodeConfiguration {
  code: Code;
  runtime: AgentManagedRuntimeType;
  entryPoint: string[];
}
export const CodeConfiguration = S.suspend(() =>
  S.Struct({
    code: Code,
    runtime: AgentManagedRuntimeType,
    entryPoint: EntryPoints,
  }),
).annotations({
  identifier: "CodeConfiguration",
}) as any as S.Schema<CodeConfiguration>;
export type AgentRuntimeArtifact =
  | { containerConfiguration: ContainerConfiguration }
  | { codeConfiguration: CodeConfiguration };
export const AgentRuntimeArtifact = S.Union(
  S.Struct({ containerConfiguration: ContainerConfiguration }),
  S.Struct({ codeConfiguration: CodeConfiguration }),
);
export type NetworkMode = "PUBLIC" | "VPC";
export const NetworkMode = S.Literal("PUBLIC", "VPC");
export type SecurityGroups = string[];
export const SecurityGroups = S.Array(S.String);
export type Subnets = string[];
export const Subnets = S.Array(S.String);
export interface VpcConfig {
  securityGroups: string[];
  subnets: string[];
}
export const VpcConfig = S.suspend(() =>
  S.Struct({ securityGroups: SecurityGroups, subnets: Subnets }),
).annotations({ identifier: "VpcConfig" }) as any as S.Schema<VpcConfig>;
export interface NetworkConfiguration {
  networkMode: NetworkMode;
  networkModeConfig?: VpcConfig;
}
export const NetworkConfiguration = S.suspend(() =>
  S.Struct({
    networkMode: NetworkMode,
    networkModeConfig: S.optional(VpcConfig),
  }),
).annotations({
  identifier: "NetworkConfiguration",
}) as any as S.Schema<NetworkConfiguration>;
export type AllowedAudienceList = string[];
export const AllowedAudienceList = S.Array(S.String);
export type AllowedClientsList = string[];
export const AllowedClientsList = S.Array(S.String);
export type AllowedScopesType = string[];
export const AllowedScopesType = S.Array(S.String);
export type InboundTokenClaimValueType = "STRING" | "STRING_ARRAY";
export const InboundTokenClaimValueType = S.Literal("STRING", "STRING_ARRAY");
export type MatchValueStringList = string[];
export const MatchValueStringList = S.Array(S.String);
export type ClaimMatchValueType =
  | { matchValueString: string }
  | { matchValueStringList: string[] };
export const ClaimMatchValueType = S.Union(
  S.Struct({ matchValueString: S.String }),
  S.Struct({ matchValueStringList: MatchValueStringList }),
);
export type ClaimMatchOperatorType = "EQUALS" | "CONTAINS" | "CONTAINS_ANY";
export const ClaimMatchOperatorType = S.Literal(
  "EQUALS",
  "CONTAINS",
  "CONTAINS_ANY",
);
export interface AuthorizingClaimMatchValueType {
  claimMatchValue: ClaimMatchValueType;
  claimMatchOperator: ClaimMatchOperatorType;
}
export const AuthorizingClaimMatchValueType = S.suspend(() =>
  S.Struct({
    claimMatchValue: ClaimMatchValueType,
    claimMatchOperator: ClaimMatchOperatorType,
  }),
).annotations({
  identifier: "AuthorizingClaimMatchValueType",
}) as any as S.Schema<AuthorizingClaimMatchValueType>;
export interface CustomClaimValidationType {
  inboundTokenClaimName: string;
  inboundTokenClaimValueType: InboundTokenClaimValueType;
  authorizingClaimMatchValue: AuthorizingClaimMatchValueType;
}
export const CustomClaimValidationType = S.suspend(() =>
  S.Struct({
    inboundTokenClaimName: S.String,
    inboundTokenClaimValueType: InboundTokenClaimValueType,
    authorizingClaimMatchValue: AuthorizingClaimMatchValueType,
  }),
).annotations({
  identifier: "CustomClaimValidationType",
}) as any as S.Schema<CustomClaimValidationType>;
export type CustomClaimValidationsType = CustomClaimValidationType[];
export const CustomClaimValidationsType = S.Array(CustomClaimValidationType);
export interface CustomJWTAuthorizerConfiguration {
  discoveryUrl: string;
  allowedAudience?: string[];
  allowedClients?: string[];
  allowedScopes?: string[];
  customClaims?: CustomClaimValidationType[];
}
export const CustomJWTAuthorizerConfiguration = S.suspend(() =>
  S.Struct({
    discoveryUrl: S.String,
    allowedAudience: S.optional(AllowedAudienceList),
    allowedClients: S.optional(AllowedClientsList),
    allowedScopes: S.optional(AllowedScopesType),
    customClaims: S.optional(CustomClaimValidationsType),
  }),
).annotations({
  identifier: "CustomJWTAuthorizerConfiguration",
}) as any as S.Schema<CustomJWTAuthorizerConfiguration>;
export type AuthorizerConfiguration = {
  customJWTAuthorizer: CustomJWTAuthorizerConfiguration;
};
export const AuthorizerConfiguration = S.Union(
  S.Struct({ customJWTAuthorizer: CustomJWTAuthorizerConfiguration }),
);
export type RequestHeaderAllowlist = string[];
export const RequestHeaderAllowlist = S.Array(S.String);
export type RequestHeaderConfiguration = { requestHeaderAllowlist: string[] };
export const RequestHeaderConfiguration = S.Union(
  S.Struct({ requestHeaderAllowlist: RequestHeaderAllowlist }),
);
export type ServerProtocol = "MCP" | "HTTP" | "A2A";
export const ServerProtocol = S.Literal("MCP", "HTTP", "A2A");
export interface ProtocolConfiguration {
  serverProtocol: ServerProtocol;
}
export const ProtocolConfiguration = S.suspend(() =>
  S.Struct({ serverProtocol: ServerProtocol }),
).annotations({
  identifier: "ProtocolConfiguration",
}) as any as S.Schema<ProtocolConfiguration>;
export interface LifecycleConfiguration {
  idleRuntimeSessionTimeout?: number;
  maxLifetime?: number;
}
export const LifecycleConfiguration = S.suspend(() =>
  S.Struct({
    idleRuntimeSessionTimeout: S.optional(S.Number),
    maxLifetime: S.optional(S.Number),
  }),
).annotations({
  identifier: "LifecycleConfiguration",
}) as any as S.Schema<LifecycleConfiguration>;
export type EnvironmentVariablesMap = { [key: string]: string };
export const EnvironmentVariablesMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface UpdateAgentRuntimeRequest {
  agentRuntimeId: string;
  agentRuntimeArtifact: AgentRuntimeArtifact;
  roleArn: string;
  networkConfiguration: NetworkConfiguration;
  description?: string | redacted.Redacted<string>;
  authorizerConfiguration?: AuthorizerConfiguration;
  requestHeaderConfiguration?: RequestHeaderConfiguration;
  protocolConfiguration?: ProtocolConfiguration;
  lifecycleConfiguration?: LifecycleConfiguration;
  environmentVariables?: { [key: string]: string };
  clientToken?: string;
}
export const UpdateAgentRuntimeRequest = S.suspend(() =>
  S.Struct({
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    agentRuntimeArtifact: AgentRuntimeArtifact,
    roleArn: S.String,
    networkConfiguration: NetworkConfiguration,
    description: S.optional(SensitiveString),
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    requestHeaderConfiguration: S.optional(RequestHeaderConfiguration),
    protocolConfiguration: S.optional(ProtocolConfiguration),
    lifecycleConfiguration: S.optional(LifecycleConfiguration),
    environmentVariables: S.optional(EnvironmentVariablesMap),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/runtimes/{agentRuntimeId}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAgentRuntimeRequest",
}) as any as S.Schema<UpdateAgentRuntimeRequest>;
export interface DeleteAgentRuntimeRequest {
  agentRuntimeId: string;
  clientToken?: string;
}
export const DeleteAgentRuntimeRequest = S.suspend(() =>
  S.Struct({
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/runtimes/{agentRuntimeId}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAgentRuntimeRequest",
}) as any as S.Schema<DeleteAgentRuntimeRequest>;
export interface ListAgentRuntimesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListAgentRuntimesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/runtimes/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAgentRuntimesRequest",
}) as any as S.Schema<ListAgentRuntimesRequest>;
export interface ListAgentRuntimeVersionsRequest {
  agentRuntimeId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAgentRuntimeVersionsRequest = S.suspend(() =>
  S.Struct({
    agentRuntimeId: S.String.pipe(T.HttpLabel("agentRuntimeId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/runtimes/{agentRuntimeId}/versions/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAgentRuntimeVersionsRequest",
}) as any as S.Schema<ListAgentRuntimeVersionsRequest>;
export interface CreateApiKeyCredentialProviderRequest {
  name: string;
  apiKey: string | redacted.Redacted<string>;
  tags?: { [key: string]: string };
}
export const CreateApiKeyCredentialProviderRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    apiKey: SensitiveString,
    tags: S.optional(TagsMap),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateApiKeyCredentialProviderRequest",
}) as any as S.Schema<CreateApiKeyCredentialProviderRequest>;
export interface GetApiKeyCredentialProviderRequest {
  name: string;
}
export const GetApiKeyCredentialProviderRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/identities/GetApiKeyCredentialProvider",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApiKeyCredentialProviderRequest",
}) as any as S.Schema<GetApiKeyCredentialProviderRequest>;
export interface UpdateApiKeyCredentialProviderRequest {
  name: string;
  apiKey: string | redacted.Redacted<string>;
}
export const UpdateApiKeyCredentialProviderRequest = S.suspend(() =>
  S.Struct({ name: S.String, apiKey: SensitiveString }).pipe(
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
  ),
).annotations({
  identifier: "UpdateApiKeyCredentialProviderRequest",
}) as any as S.Schema<UpdateApiKeyCredentialProviderRequest>;
export interface DeleteApiKeyCredentialProviderRequest {
  name: string;
}
export const DeleteApiKeyCredentialProviderRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
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
  ),
).annotations({
  identifier: "DeleteApiKeyCredentialProviderRequest",
}) as any as S.Schema<DeleteApiKeyCredentialProviderRequest>;
export interface DeleteApiKeyCredentialProviderResponse {}
export const DeleteApiKeyCredentialProviderResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteApiKeyCredentialProviderResponse",
}) as any as S.Schema<DeleteApiKeyCredentialProviderResponse>;
export interface ListApiKeyCredentialProvidersRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListApiKeyCredentialProvidersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListApiKeyCredentialProvidersRequest",
}) as any as S.Schema<ListApiKeyCredentialProvidersRequest>;
export interface GetBrowserRequest {
  browserId: string;
}
export const GetBrowserRequest = S.suspend(() =>
  S.Struct({ browserId: S.String.pipe(T.HttpLabel("browserId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/browsers/{browserId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBrowserRequest",
}) as any as S.Schema<GetBrowserRequest>;
export interface DeleteBrowserRequest {
  browserId: string;
  clientToken?: string;
}
export const DeleteBrowserRequest = S.suspend(() =>
  S.Struct({
    browserId: S.String.pipe(T.HttpLabel("browserId")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/browsers/{browserId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBrowserRequest",
}) as any as S.Schema<DeleteBrowserRequest>;
export interface ListBrowsersRequest {
  maxResults?: number;
  nextToken?: string;
  type?: ResourceType;
}
export const ListBrowsersRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    type: S.optional(ResourceType).pipe(T.HttpQuery("type")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/browsers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBrowsersRequest",
}) as any as S.Schema<ListBrowsersRequest>;
export interface GetCodeInterpreterRequest {
  codeInterpreterId: string;
}
export const GetCodeInterpreterRequest = S.suspend(() =>
  S.Struct({
    codeInterpreterId: S.String.pipe(T.HttpLabel("codeInterpreterId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/code-interpreters/{codeInterpreterId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCodeInterpreterRequest",
}) as any as S.Schema<GetCodeInterpreterRequest>;
export interface DeleteCodeInterpreterRequest {
  codeInterpreterId: string;
  clientToken?: string;
}
export const DeleteCodeInterpreterRequest = S.suspend(() =>
  S.Struct({
    codeInterpreterId: S.String.pipe(T.HttpLabel("codeInterpreterId")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/code-interpreters/{codeInterpreterId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCodeInterpreterRequest",
}) as any as S.Schema<DeleteCodeInterpreterRequest>;
export interface ListCodeInterpretersRequest {
  maxResults?: number;
  nextToken?: string;
  type?: ResourceType;
}
export const ListCodeInterpretersRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    type: S.optional(ResourceType).pipe(T.HttpQuery("type")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/code-interpreters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCodeInterpretersRequest",
}) as any as S.Schema<ListCodeInterpretersRequest>;
export interface GetEvaluatorRequest {
  evaluatorId: string;
}
export const GetEvaluatorRequest = S.suspend(() =>
  S.Struct({ evaluatorId: S.String.pipe(T.HttpLabel("evaluatorId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/evaluators/{evaluatorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEvaluatorRequest",
}) as any as S.Schema<GetEvaluatorRequest>;
export interface NumericalScaleDefinition {
  definition: string;
  value: number;
  label: string;
}
export const NumericalScaleDefinition = S.suspend(() =>
  S.Struct({ definition: S.String, value: S.Number, label: S.String }),
).annotations({
  identifier: "NumericalScaleDefinition",
}) as any as S.Schema<NumericalScaleDefinition>;
export type NumericalScaleDefinitions = NumericalScaleDefinition[];
export const NumericalScaleDefinitions = S.Array(NumericalScaleDefinition);
export interface CategoricalScaleDefinition {
  definition: string;
  label: string;
}
export const CategoricalScaleDefinition = S.suspend(() =>
  S.Struct({ definition: S.String, label: S.String }),
).annotations({
  identifier: "CategoricalScaleDefinition",
}) as any as S.Schema<CategoricalScaleDefinition>;
export type CategoricalScaleDefinitions = CategoricalScaleDefinition[];
export const CategoricalScaleDefinitions = S.Array(CategoricalScaleDefinition);
export type RatingScale =
  | { numerical: NumericalScaleDefinition[] }
  | { categorical: CategoricalScaleDefinition[] };
export const RatingScale = S.Union(
  S.Struct({ numerical: NumericalScaleDefinitions }),
  S.Struct({ categorical: CategoricalScaleDefinitions }),
);
export type NonEmptyStringList = string[];
export const NonEmptyStringList = S.Array(S.String);
export interface InferenceConfiguration {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
}
export const InferenceConfiguration = S.suspend(() =>
  S.Struct({
    maxTokens: S.optional(S.Number),
    temperature: S.optional(S.Number),
    topP: S.optional(S.Number),
    stopSequences: S.optional(NonEmptyStringList),
  }),
).annotations({
  identifier: "InferenceConfiguration",
}) as any as S.Schema<InferenceConfiguration>;
export interface BedrockEvaluatorModelConfig {
  modelId: string;
  inferenceConfig?: InferenceConfiguration;
  additionalModelRequestFields?: any;
}
export const BedrockEvaluatorModelConfig = S.suspend(() =>
  S.Struct({
    modelId: S.String,
    inferenceConfig: S.optional(InferenceConfiguration),
    additionalModelRequestFields: S.optional(S.Any),
  }),
).annotations({
  identifier: "BedrockEvaluatorModelConfig",
}) as any as S.Schema<BedrockEvaluatorModelConfig>;
export type EvaluatorModelConfig = {
  bedrockEvaluatorModelConfig: BedrockEvaluatorModelConfig;
};
export const EvaluatorModelConfig = S.Union(
  S.Struct({ bedrockEvaluatorModelConfig: BedrockEvaluatorModelConfig }),
);
export interface LlmAsAJudgeEvaluatorConfig {
  instructions: string | redacted.Redacted<string>;
  ratingScale: RatingScale;
  modelConfig: EvaluatorModelConfig;
}
export const LlmAsAJudgeEvaluatorConfig = S.suspend(() =>
  S.Struct({
    instructions: SensitiveString,
    ratingScale: RatingScale,
    modelConfig: EvaluatorModelConfig,
  }),
).annotations({
  identifier: "LlmAsAJudgeEvaluatorConfig",
}) as any as S.Schema<LlmAsAJudgeEvaluatorConfig>;
export type EvaluatorConfig = { llmAsAJudge: LlmAsAJudgeEvaluatorConfig };
export const EvaluatorConfig = S.Union(
  S.Struct({ llmAsAJudge: LlmAsAJudgeEvaluatorConfig }),
);
export interface UpdateEvaluatorRequest {
  clientToken?: string;
  evaluatorId: string;
  description?: string | redacted.Redacted<string>;
  evaluatorConfig?: EvaluatorConfig;
  level?: EvaluatorLevel;
}
export const UpdateEvaluatorRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    evaluatorId: S.String.pipe(T.HttpLabel("evaluatorId")),
    description: S.optional(SensitiveString),
    evaluatorConfig: S.optional(EvaluatorConfig),
    level: S.optional(EvaluatorLevel),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/evaluators/{evaluatorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEvaluatorRequest",
}) as any as S.Schema<UpdateEvaluatorRequest>;
export interface DeleteEvaluatorRequest {
  evaluatorId: string;
}
export const DeleteEvaluatorRequest = S.suspend(() =>
  S.Struct({ evaluatorId: S.String.pipe(T.HttpLabel("evaluatorId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/evaluators/{evaluatorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEvaluatorRequest",
}) as any as S.Schema<DeleteEvaluatorRequest>;
export interface ListEvaluatorsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListEvaluatorsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/evaluators" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEvaluatorsRequest",
}) as any as S.Schema<ListEvaluatorsRequest>;
export interface DeleteGatewayRequest {
  gatewayIdentifier: string;
}
export const DeleteGatewayRequest = S.suspend(() =>
  S.Struct({
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/gateways/{gatewayIdentifier}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGatewayRequest",
}) as any as S.Schema<DeleteGatewayRequest>;
export interface GetGatewayRequest {
  gatewayIdentifier: string;
}
export const GetGatewayRequest = S.suspend(() =>
  S.Struct({
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/gateways/{gatewayIdentifier}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGatewayRequest",
}) as any as S.Schema<GetGatewayRequest>;
export interface ListGatewaysRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListGatewaysRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/gateways/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGatewaysRequest",
}) as any as S.Schema<ListGatewaysRequest>;
export type McpSupportedVersions = string[];
export const McpSupportedVersions = S.Array(S.String);
export type SearchType = "SEMANTIC";
export const SearchType = S.Literal("SEMANTIC");
export interface MCPGatewayConfiguration {
  supportedVersions?: string[];
  instructions?: string;
  searchType?: SearchType;
}
export const MCPGatewayConfiguration = S.suspend(() =>
  S.Struct({
    supportedVersions: S.optional(McpSupportedVersions),
    instructions: S.optional(S.String),
    searchType: S.optional(SearchType),
  }),
).annotations({
  identifier: "MCPGatewayConfiguration",
}) as any as S.Schema<MCPGatewayConfiguration>;
export type GatewayProtocolConfiguration = { mcp: MCPGatewayConfiguration };
export const GatewayProtocolConfiguration = S.Union(
  S.Struct({ mcp: MCPGatewayConfiguration }),
);
export interface LambdaInterceptorConfiguration {
  arn: string;
}
export const LambdaInterceptorConfiguration = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "LambdaInterceptorConfiguration",
}) as any as S.Schema<LambdaInterceptorConfiguration>;
export type InterceptorConfiguration = {
  lambda: LambdaInterceptorConfiguration;
};
export const InterceptorConfiguration = S.Union(
  S.Struct({ lambda: LambdaInterceptorConfiguration }),
);
export type GatewayInterceptionPoint = "REQUEST" | "RESPONSE";
export const GatewayInterceptionPoint = S.Literal("REQUEST", "RESPONSE");
export type GatewayInterceptionPoints = GatewayInterceptionPoint[];
export const GatewayInterceptionPoints = S.Array(GatewayInterceptionPoint);
export interface InterceptorInputConfiguration {
  passRequestHeaders: boolean;
}
export const InterceptorInputConfiguration = S.suspend(() =>
  S.Struct({ passRequestHeaders: S.Boolean }),
).annotations({
  identifier: "InterceptorInputConfiguration",
}) as any as S.Schema<InterceptorInputConfiguration>;
export interface GatewayInterceptorConfiguration {
  interceptor: InterceptorConfiguration;
  interceptionPoints: GatewayInterceptionPoint[];
  inputConfiguration?: InterceptorInputConfiguration;
}
export const GatewayInterceptorConfiguration = S.suspend(() =>
  S.Struct({
    interceptor: InterceptorConfiguration,
    interceptionPoints: GatewayInterceptionPoints,
    inputConfiguration: S.optional(InterceptorInputConfiguration),
  }),
).annotations({
  identifier: "GatewayInterceptorConfiguration",
}) as any as S.Schema<GatewayInterceptorConfiguration>;
export type GatewayInterceptorConfigurations =
  GatewayInterceptorConfiguration[];
export const GatewayInterceptorConfigurations = S.Array(
  GatewayInterceptorConfiguration,
);
export type GatewayPolicyEngineMode = "LOG_ONLY" | "ENFORCE";
export const GatewayPolicyEngineMode = S.Literal("LOG_ONLY", "ENFORCE");
export interface GatewayPolicyEngineConfiguration {
  arn: string;
  mode: GatewayPolicyEngineMode;
}
export const GatewayPolicyEngineConfiguration = S.suspend(() =>
  S.Struct({ arn: S.String, mode: GatewayPolicyEngineMode }),
).annotations({
  identifier: "GatewayPolicyEngineConfiguration",
}) as any as S.Schema<GatewayPolicyEngineConfiguration>;
export interface UpdateGatewayRequest {
  gatewayIdentifier: string;
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  roleArn: string;
  protocolType: GatewayProtocolType;
  protocolConfiguration?: GatewayProtocolConfiguration;
  authorizerType: AuthorizerType;
  authorizerConfiguration?: AuthorizerConfiguration;
  kmsKeyArn?: string;
  interceptorConfigurations?: GatewayInterceptorConfiguration[];
  policyEngineConfiguration?: GatewayPolicyEngineConfiguration;
  exceptionLevel?: ExceptionLevel;
}
export const UpdateGatewayRequest = S.suspend(() =>
  S.Struct({
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    roleArn: S.String,
    protocolType: GatewayProtocolType,
    protocolConfiguration: S.optional(GatewayProtocolConfiguration),
    authorizerType: AuthorizerType,
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    kmsKeyArn: S.optional(S.String),
    interceptorConfigurations: S.optional(GatewayInterceptorConfigurations),
    policyEngineConfiguration: S.optional(GatewayPolicyEngineConfiguration),
    exceptionLevel: S.optional(ExceptionLevel),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/gateways/{gatewayIdentifier}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGatewayRequest",
}) as any as S.Schema<UpdateGatewayRequest>;
export interface DeleteGatewayTargetRequest {
  gatewayIdentifier: string;
  targetId: string;
}
export const DeleteGatewayTargetRequest = S.suspend(() =>
  S.Struct({
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    targetId: S.String.pipe(T.HttpLabel("targetId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteGatewayTargetRequest",
}) as any as S.Schema<DeleteGatewayTargetRequest>;
export interface GetGatewayTargetRequest {
  gatewayIdentifier: string;
  targetId: string;
}
export const GetGatewayTargetRequest = S.suspend(() =>
  S.Struct({
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    targetId: S.String.pipe(T.HttpLabel("targetId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetGatewayTargetRequest",
}) as any as S.Schema<GetGatewayTargetRequest>;
export interface ListGatewayTargetsRequest {
  gatewayIdentifier: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListGatewayTargetsRequest = S.suspend(() =>
  S.Struct({
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/gateways/{gatewayIdentifier}/targets/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGatewayTargetsRequest",
}) as any as S.Schema<ListGatewayTargetsRequest>;
export interface SynchronizeGatewayTargetsRequest {
  gatewayIdentifier: string;
  targetIdList: string[];
}
export const SynchronizeGatewayTargetsRequest = S.suspend(() =>
  S.Struct({
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    targetIdList: TargetIdList,
  }).pipe(
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
  ),
).annotations({
  identifier: "SynchronizeGatewayTargetsRequest",
}) as any as S.Schema<SynchronizeGatewayTargetsRequest>;
export interface S3Configuration {
  uri?: string;
  bucketOwnerAccountId?: string;
}
export const S3Configuration = S.suspend(() =>
  S.Struct({
    uri: S.optional(S.String),
    bucketOwnerAccountId: S.optional(S.String),
  }),
).annotations({
  identifier: "S3Configuration",
}) as any as S.Schema<S3Configuration>;
export type ApiSchemaConfiguration =
  | { s3: S3Configuration }
  | { inlinePayload: string | redacted.Redacted<string> };
export const ApiSchemaConfiguration = S.Union(
  S.Struct({ s3: S3Configuration }),
  S.Struct({ inlinePayload: SensitiveString }),
);
export type SchemaType =
  | "string"
  | "number"
  | "object"
  | "array"
  | "boolean"
  | "integer";
export const SchemaType = S.Literal(
  "string",
  "number",
  "object",
  "array",
  "boolean",
  "integer",
);
export type RequiredProperties = string[];
export const RequiredProperties = S.Array(S.String);
export interface SchemaDefinition {
  type: SchemaType;
  properties?: { [key: string]: SchemaDefinition };
  required?: string[];
  items?: SchemaDefinition;
  description?: string;
}
export const SchemaDefinition = S.suspend(() =>
  S.Struct({
    type: SchemaType,
    properties: S.optional(
      S.suspend(() => SchemaProperties).annotations({
        identifier: "SchemaProperties",
      }),
    ),
    required: S.optional(RequiredProperties),
    items: S.optional(
      S.suspend(
        (): S.Schema<SchemaDefinition, any> => SchemaDefinition,
      ).annotations({ identifier: "SchemaDefinition" }),
    ),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "SchemaDefinition",
}) as any as S.Schema<SchemaDefinition>;
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: SchemaDefinition;
  outputSchema?: SchemaDefinition;
}
export const ToolDefinition = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.String,
    inputSchema: SchemaDefinition,
    outputSchema: S.optional(SchemaDefinition),
  }),
).annotations({
  identifier: "ToolDefinition",
}) as any as S.Schema<ToolDefinition>;
export type ToolDefinitions = ToolDefinition[];
export const ToolDefinitions = S.Array(ToolDefinition);
export type ToolSchema =
  | { s3: S3Configuration }
  | { inlinePayload: ToolDefinition[] };
export const ToolSchema = S.Union(
  S.Struct({ s3: S3Configuration }),
  S.Struct({ inlinePayload: ToolDefinitions }),
);
export interface McpLambdaTargetConfiguration {
  lambdaArn: string;
  toolSchema: ToolSchema;
}
export const McpLambdaTargetConfiguration = S.suspend(() =>
  S.Struct({ lambdaArn: S.String, toolSchema: ToolSchema }),
).annotations({
  identifier: "McpLambdaTargetConfiguration",
}) as any as S.Schema<McpLambdaTargetConfiguration>;
export interface McpServerTargetConfiguration {
  endpoint: string;
}
export const McpServerTargetConfiguration = S.suspend(() =>
  S.Struct({ endpoint: S.String }),
).annotations({
  identifier: "McpServerTargetConfiguration",
}) as any as S.Schema<McpServerTargetConfiguration>;
export type RestApiMethod =
  | "GET"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "PATCH"
  | "PUT"
  | "POST";
export const RestApiMethod = S.Literal(
  "GET",
  "DELETE",
  "HEAD",
  "OPTIONS",
  "PATCH",
  "PUT",
  "POST",
);
export interface ApiGatewayToolOverride {
  name: string;
  description?: string;
  path: string;
  method: RestApiMethod;
}
export const ApiGatewayToolOverride = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    path: S.String,
    method: RestApiMethod,
  }),
).annotations({
  identifier: "ApiGatewayToolOverride",
}) as any as S.Schema<ApiGatewayToolOverride>;
export type ApiGatewayToolOverrides = ApiGatewayToolOverride[];
export const ApiGatewayToolOverrides = S.Array(ApiGatewayToolOverride);
export type RestApiMethods = RestApiMethod[];
export const RestApiMethods = S.Array(RestApiMethod);
export interface ApiGatewayToolFilter {
  filterPath: string;
  methods: RestApiMethod[];
}
export const ApiGatewayToolFilter = S.suspend(() =>
  S.Struct({ filterPath: S.String, methods: RestApiMethods }),
).annotations({
  identifier: "ApiGatewayToolFilter",
}) as any as S.Schema<ApiGatewayToolFilter>;
export type ApiGatewayToolFilters = ApiGatewayToolFilter[];
export const ApiGatewayToolFilters = S.Array(ApiGatewayToolFilter);
export interface ApiGatewayToolConfiguration {
  toolOverrides?: ApiGatewayToolOverride[];
  toolFilters: ApiGatewayToolFilter[];
}
export const ApiGatewayToolConfiguration = S.suspend(() =>
  S.Struct({
    toolOverrides: S.optional(ApiGatewayToolOverrides),
    toolFilters: ApiGatewayToolFilters,
  }),
).annotations({
  identifier: "ApiGatewayToolConfiguration",
}) as any as S.Schema<ApiGatewayToolConfiguration>;
export interface ApiGatewayTargetConfiguration {
  restApiId: string;
  stage: string;
  apiGatewayToolConfiguration: ApiGatewayToolConfiguration;
}
export const ApiGatewayTargetConfiguration = S.suspend(() =>
  S.Struct({
    restApiId: S.String,
    stage: S.String,
    apiGatewayToolConfiguration: ApiGatewayToolConfiguration,
  }),
).annotations({
  identifier: "ApiGatewayTargetConfiguration",
}) as any as S.Schema<ApiGatewayTargetConfiguration>;
export type McpTargetConfiguration =
  | { openApiSchema: ApiSchemaConfiguration }
  | { smithyModel: ApiSchemaConfiguration }
  | { lambda: McpLambdaTargetConfiguration }
  | { mcpServer: McpServerTargetConfiguration }
  | { apiGateway: ApiGatewayTargetConfiguration };
export const McpTargetConfiguration = S.Union(
  S.Struct({ openApiSchema: ApiSchemaConfiguration }),
  S.Struct({ smithyModel: ApiSchemaConfiguration }),
  S.Struct({ lambda: McpLambdaTargetConfiguration }),
  S.Struct({ mcpServer: McpServerTargetConfiguration }),
  S.Struct({ apiGateway: ApiGatewayTargetConfiguration }),
);
export type TargetConfiguration = { mcp: McpTargetConfiguration };
export const TargetConfiguration = S.Union(
  S.Struct({ mcp: McpTargetConfiguration }),
);
export type CredentialProviderType = "GATEWAY_IAM_ROLE" | "OAUTH" | "API_KEY";
export const CredentialProviderType = S.Literal(
  "GATEWAY_IAM_ROLE",
  "OAUTH",
  "API_KEY",
);
export type OAuthScopes = string[];
export const OAuthScopes = S.Array(S.String);
export type OAuthCustomParameters = {
  [key: string]: string | redacted.Redacted<string>;
};
export const OAuthCustomParameters = S.Record({
  key: S.String,
  value: SensitiveString,
});
export type OAuthGrantType = "CLIENT_CREDENTIALS" | "AUTHORIZATION_CODE";
export const OAuthGrantType = S.Literal(
  "CLIENT_CREDENTIALS",
  "AUTHORIZATION_CODE",
);
export interface OAuthCredentialProvider {
  providerArn: string;
  scopes: string[];
  customParameters?: { [key: string]: string | redacted.Redacted<string> };
  grantType?: OAuthGrantType;
  defaultReturnUrl?: string;
}
export const OAuthCredentialProvider = S.suspend(() =>
  S.Struct({
    providerArn: S.String,
    scopes: OAuthScopes,
    customParameters: S.optional(OAuthCustomParameters),
    grantType: S.optional(OAuthGrantType),
    defaultReturnUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "OAuthCredentialProvider",
}) as any as S.Schema<OAuthCredentialProvider>;
export type ApiKeyCredentialLocation = "HEADER" | "QUERY_PARAMETER";
export const ApiKeyCredentialLocation = S.Literal("HEADER", "QUERY_PARAMETER");
export interface GatewayApiKeyCredentialProvider {
  providerArn: string;
  credentialParameterName?: string;
  credentialPrefix?: string;
  credentialLocation?: ApiKeyCredentialLocation;
}
export const GatewayApiKeyCredentialProvider = S.suspend(() =>
  S.Struct({
    providerArn: S.String,
    credentialParameterName: S.optional(S.String),
    credentialPrefix: S.optional(S.String),
    credentialLocation: S.optional(ApiKeyCredentialLocation),
  }),
).annotations({
  identifier: "GatewayApiKeyCredentialProvider",
}) as any as S.Schema<GatewayApiKeyCredentialProvider>;
export type CredentialProvider =
  | { oauthCredentialProvider: OAuthCredentialProvider }
  | { apiKeyCredentialProvider: GatewayApiKeyCredentialProvider };
export const CredentialProvider = S.Union(
  S.Struct({ oauthCredentialProvider: OAuthCredentialProvider }),
  S.Struct({ apiKeyCredentialProvider: GatewayApiKeyCredentialProvider }),
);
export interface CredentialProviderConfiguration {
  credentialProviderType: CredentialProviderType;
  credentialProvider?: CredentialProvider;
}
export const CredentialProviderConfiguration = S.suspend(() =>
  S.Struct({
    credentialProviderType: CredentialProviderType,
    credentialProvider: S.optional(CredentialProvider),
  }),
).annotations({
  identifier: "CredentialProviderConfiguration",
}) as any as S.Schema<CredentialProviderConfiguration>;
export type CredentialProviderConfigurations =
  CredentialProviderConfiguration[];
export const CredentialProviderConfigurations = S.Array(
  CredentialProviderConfiguration,
);
export type AllowedRequestHeaders = string[];
export const AllowedRequestHeaders = S.Array(S.String);
export type AllowedQueryParameters = string[];
export const AllowedQueryParameters = S.Array(S.String);
export type AllowedResponseHeaders = string[];
export const AllowedResponseHeaders = S.Array(S.String);
export interface MetadataConfiguration {
  allowedRequestHeaders?: string[];
  allowedQueryParameters?: string[];
  allowedResponseHeaders?: string[];
}
export const MetadataConfiguration = S.suspend(() =>
  S.Struct({
    allowedRequestHeaders: S.optional(AllowedRequestHeaders),
    allowedQueryParameters: S.optional(AllowedQueryParameters),
    allowedResponseHeaders: S.optional(AllowedResponseHeaders),
  }),
).annotations({
  identifier: "MetadataConfiguration",
}) as any as S.Schema<MetadataConfiguration>;
export interface UpdateGatewayTargetRequest {
  gatewayIdentifier: string;
  targetId: string;
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  targetConfiguration: TargetConfiguration;
  credentialProviderConfigurations?: CredentialProviderConfiguration[];
  metadataConfiguration?: MetadataConfiguration;
}
export const UpdateGatewayTargetRequest = S.suspend(() =>
  S.Struct({
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    targetId: S.String.pipe(T.HttpLabel("targetId")),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    targetConfiguration: TargetConfiguration,
    credentialProviderConfigurations: S.optional(
      CredentialProviderConfigurations,
    ),
    metadataConfiguration: S.optional(MetadataConfiguration),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateGatewayTargetRequest",
}) as any as S.Schema<UpdateGatewayTargetRequest>;
export interface GetMemoryInput {
  memoryId: string;
}
export const GetMemoryInput = S.suspend(() =>
  S.Struct({ memoryId: S.String.pipe(T.HttpLabel("memoryId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/memories/{memoryId}/details" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMemoryInput",
}) as any as S.Schema<GetMemoryInput>;
export interface DeleteMemoryInput {
  clientToken?: string;
  memoryId: string;
}
export const DeleteMemoryInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/memories/{memoryId}/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMemoryInput",
}) as any as S.Schema<DeleteMemoryInput>;
export interface ListMemoriesInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListMemoriesInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/memories/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMemoriesInput",
}) as any as S.Schema<ListMemoriesInput>;
export interface GetOauth2CredentialProviderRequest {
  name: string;
}
export const GetOauth2CredentialProviderRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/identities/GetOauth2CredentialProvider",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOauth2CredentialProviderRequest",
}) as any as S.Schema<GetOauth2CredentialProviderRequest>;
export type ResponseListType = string[];
export const ResponseListType = S.Array(S.String);
export type TokenEndpointAuthMethodsType = string[];
export const TokenEndpointAuthMethodsType = S.Array(S.String);
export interface Oauth2AuthorizationServerMetadata {
  issuer: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  responseTypes?: string[];
  tokenEndpointAuthMethods?: string[];
}
export const Oauth2AuthorizationServerMetadata = S.suspend(() =>
  S.Struct({
    issuer: S.String,
    authorizationEndpoint: S.String,
    tokenEndpoint: S.String,
    responseTypes: S.optional(ResponseListType),
    tokenEndpointAuthMethods: S.optional(TokenEndpointAuthMethodsType),
  }),
).annotations({
  identifier: "Oauth2AuthorizationServerMetadata",
}) as any as S.Schema<Oauth2AuthorizationServerMetadata>;
export type Oauth2Discovery =
  | { discoveryUrl: string }
  | { authorizationServerMetadata: Oauth2AuthorizationServerMetadata };
export const Oauth2Discovery = S.Union(
  S.Struct({ discoveryUrl: S.String }),
  S.Struct({ authorizationServerMetadata: Oauth2AuthorizationServerMetadata }),
);
export interface CustomOauth2ProviderConfigInput {
  oauthDiscovery: Oauth2Discovery;
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
}
export const CustomOauth2ProviderConfigInput = S.suspend(() =>
  S.Struct({
    oauthDiscovery: Oauth2Discovery,
    clientId: S.String,
    clientSecret: SensitiveString,
  }),
).annotations({
  identifier: "CustomOauth2ProviderConfigInput",
}) as any as S.Schema<CustomOauth2ProviderConfigInput>;
export interface GoogleOauth2ProviderConfigInput {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
}
export const GoogleOauth2ProviderConfigInput = S.suspend(() =>
  S.Struct({ clientId: S.String, clientSecret: SensitiveString }),
).annotations({
  identifier: "GoogleOauth2ProviderConfigInput",
}) as any as S.Schema<GoogleOauth2ProviderConfigInput>;
export interface GithubOauth2ProviderConfigInput {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
}
export const GithubOauth2ProviderConfigInput = S.suspend(() =>
  S.Struct({ clientId: S.String, clientSecret: SensitiveString }),
).annotations({
  identifier: "GithubOauth2ProviderConfigInput",
}) as any as S.Schema<GithubOauth2ProviderConfigInput>;
export interface SlackOauth2ProviderConfigInput {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
}
export const SlackOauth2ProviderConfigInput = S.suspend(() =>
  S.Struct({ clientId: S.String, clientSecret: SensitiveString }),
).annotations({
  identifier: "SlackOauth2ProviderConfigInput",
}) as any as S.Schema<SlackOauth2ProviderConfigInput>;
export interface SalesforceOauth2ProviderConfigInput {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
}
export const SalesforceOauth2ProviderConfigInput = S.suspend(() =>
  S.Struct({ clientId: S.String, clientSecret: SensitiveString }),
).annotations({
  identifier: "SalesforceOauth2ProviderConfigInput",
}) as any as S.Schema<SalesforceOauth2ProviderConfigInput>;
export interface MicrosoftOauth2ProviderConfigInput {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
  tenantId?: string;
}
export const MicrosoftOauth2ProviderConfigInput = S.suspend(() =>
  S.Struct({
    clientId: S.String,
    clientSecret: SensitiveString,
    tenantId: S.optional(S.String),
  }),
).annotations({
  identifier: "MicrosoftOauth2ProviderConfigInput",
}) as any as S.Schema<MicrosoftOauth2ProviderConfigInput>;
export interface AtlassianOauth2ProviderConfigInput {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
}
export const AtlassianOauth2ProviderConfigInput = S.suspend(() =>
  S.Struct({ clientId: S.String, clientSecret: SensitiveString }),
).annotations({
  identifier: "AtlassianOauth2ProviderConfigInput",
}) as any as S.Schema<AtlassianOauth2ProviderConfigInput>;
export interface LinkedinOauth2ProviderConfigInput {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
}
export const LinkedinOauth2ProviderConfigInput = S.suspend(() =>
  S.Struct({ clientId: S.String, clientSecret: SensitiveString }),
).annotations({
  identifier: "LinkedinOauth2ProviderConfigInput",
}) as any as S.Schema<LinkedinOauth2ProviderConfigInput>;
export interface IncludedOauth2ProviderConfigInput {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
  issuer?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
}
export const IncludedOauth2ProviderConfigInput = S.suspend(() =>
  S.Struct({
    clientId: S.String,
    clientSecret: SensitiveString,
    issuer: S.optional(S.String),
    authorizationEndpoint: S.optional(S.String),
    tokenEndpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "IncludedOauth2ProviderConfigInput",
}) as any as S.Schema<IncludedOauth2ProviderConfigInput>;
export type Oauth2ProviderConfigInput =
  | { customOauth2ProviderConfig: CustomOauth2ProviderConfigInput }
  | { googleOauth2ProviderConfig: GoogleOauth2ProviderConfigInput }
  | { githubOauth2ProviderConfig: GithubOauth2ProviderConfigInput }
  | { slackOauth2ProviderConfig: SlackOauth2ProviderConfigInput }
  | { salesforceOauth2ProviderConfig: SalesforceOauth2ProviderConfigInput }
  | { microsoftOauth2ProviderConfig: MicrosoftOauth2ProviderConfigInput }
  | { atlassianOauth2ProviderConfig: AtlassianOauth2ProviderConfigInput }
  | { linkedinOauth2ProviderConfig: LinkedinOauth2ProviderConfigInput }
  | { includedOauth2ProviderConfig: IncludedOauth2ProviderConfigInput };
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
export interface UpdateOauth2CredentialProviderRequest {
  name: string;
  credentialProviderVendor: CredentialProviderVendorType;
  oauth2ProviderConfigInput: Oauth2ProviderConfigInput;
}
export const UpdateOauth2CredentialProviderRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    credentialProviderVendor: CredentialProviderVendorType,
    oauth2ProviderConfigInput: Oauth2ProviderConfigInput,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateOauth2CredentialProviderRequest",
}) as any as S.Schema<UpdateOauth2CredentialProviderRequest>;
export interface DeleteOauth2CredentialProviderRequest {
  name: string;
}
export const DeleteOauth2CredentialProviderRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
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
  ),
).annotations({
  identifier: "DeleteOauth2CredentialProviderRequest",
}) as any as S.Schema<DeleteOauth2CredentialProviderRequest>;
export interface DeleteOauth2CredentialProviderResponse {}
export const DeleteOauth2CredentialProviderResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteOauth2CredentialProviderResponse",
}) as any as S.Schema<DeleteOauth2CredentialProviderResponse>;
export interface ListOauth2CredentialProvidersRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListOauth2CredentialProvidersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListOauth2CredentialProvidersRequest",
}) as any as S.Schema<ListOauth2CredentialProvidersRequest>;
export interface GetOnlineEvaluationConfigRequest {
  onlineEvaluationConfigId: string;
}
export const GetOnlineEvaluationConfigRequest = S.suspend(() =>
  S.Struct({
    onlineEvaluationConfigId: S.String.pipe(
      T.HttpLabel("onlineEvaluationConfigId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetOnlineEvaluationConfigRequest",
}) as any as S.Schema<GetOnlineEvaluationConfigRequest>;
export interface SamplingConfig {
  samplingPercentage: number;
}
export const SamplingConfig = S.suspend(() =>
  S.Struct({ samplingPercentage: S.Number }),
).annotations({
  identifier: "SamplingConfig",
}) as any as S.Schema<SamplingConfig>;
export type FilterOperator =
  | "Equals"
  | "NotEquals"
  | "GreaterThan"
  | "LessThan"
  | "GreaterThanOrEqual"
  | "LessThanOrEqual"
  | "Contains"
  | "NotContains";
export const FilterOperator = S.Literal(
  "Equals",
  "NotEquals",
  "GreaterThan",
  "LessThan",
  "GreaterThanOrEqual",
  "LessThanOrEqual",
  "Contains",
  "NotContains",
);
export type FilterValue =
  | { stringValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean };
export const FilterValue = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ booleanValue: S.Boolean }),
);
export interface Filter {
  key: string;
  operator: FilterOperator;
  value: FilterValue;
}
export const Filter = S.suspend(() =>
  S.Struct({ key: S.String, operator: FilterOperator, value: FilterValue }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface SessionConfig {
  sessionTimeoutMinutes: number;
}
export const SessionConfig = S.suspend(() =>
  S.Struct({ sessionTimeoutMinutes: S.Number }),
).annotations({
  identifier: "SessionConfig",
}) as any as S.Schema<SessionConfig>;
export interface Rule {
  samplingConfig: SamplingConfig;
  filters?: Filter[];
  sessionConfig?: SessionConfig;
}
export const Rule = S.suspend(() =>
  S.Struct({
    samplingConfig: SamplingConfig,
    filters: S.optional(FilterList),
    sessionConfig: S.optional(SessionConfig),
  }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export type LogGroupNamesList = string[];
export const LogGroupNamesList = S.Array(S.String);
export type ServiceNamesList = string[];
export const ServiceNamesList = S.Array(S.String);
export interface CloudWatchLogsInputConfig {
  logGroupNames: string[];
  serviceNames: string[];
}
export const CloudWatchLogsInputConfig = S.suspend(() =>
  S.Struct({
    logGroupNames: LogGroupNamesList,
    serviceNames: ServiceNamesList,
  }),
).annotations({
  identifier: "CloudWatchLogsInputConfig",
}) as any as S.Schema<CloudWatchLogsInputConfig>;
export type DataSourceConfig = { cloudWatchLogs: CloudWatchLogsInputConfig };
export const DataSourceConfig = S.Union(
  S.Struct({ cloudWatchLogs: CloudWatchLogsInputConfig }),
);
export type EvaluatorReference = { evaluatorId: string };
export const EvaluatorReference = S.Union(S.Struct({ evaluatorId: S.String }));
export type EvaluatorList = EvaluatorReference[];
export const EvaluatorList = S.Array(EvaluatorReference);
export interface UpdateOnlineEvaluationConfigRequest {
  clientToken?: string;
  onlineEvaluationConfigId: string;
  description?: string | redacted.Redacted<string>;
  rule?: Rule;
  dataSourceConfig?: DataSourceConfig;
  evaluators?: EvaluatorReference[];
  evaluationExecutionRoleArn?: string;
  executionStatus?: OnlineEvaluationExecutionStatus;
}
export const UpdateOnlineEvaluationConfigRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    onlineEvaluationConfigId: S.String.pipe(
      T.HttpLabel("onlineEvaluationConfigId"),
    ),
    description: S.optional(SensitiveString),
    rule: S.optional(Rule),
    dataSourceConfig: S.optional(DataSourceConfig),
    evaluators: S.optional(EvaluatorList),
    evaluationExecutionRoleArn: S.optional(S.String),
    executionStatus: S.optional(OnlineEvaluationExecutionStatus),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateOnlineEvaluationConfigRequest",
}) as any as S.Schema<UpdateOnlineEvaluationConfigRequest>;
export interface DeleteOnlineEvaluationConfigRequest {
  onlineEvaluationConfigId: string;
}
export const DeleteOnlineEvaluationConfigRequest = S.suspend(() =>
  S.Struct({
    onlineEvaluationConfigId: S.String.pipe(
      T.HttpLabel("onlineEvaluationConfigId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteOnlineEvaluationConfigRequest",
}) as any as S.Schema<DeleteOnlineEvaluationConfigRequest>;
export interface ListOnlineEvaluationConfigsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListOnlineEvaluationConfigsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/online-evaluation-configs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOnlineEvaluationConfigsRequest",
}) as any as S.Schema<ListOnlineEvaluationConfigsRequest>;
export interface CreatePolicyEngineRequest {
  name: string;
  description?: string | redacted.Redacted<string>;
  clientToken?: string;
}
export const CreatePolicyEngineRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policy-engines" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePolicyEngineRequest",
}) as any as S.Schema<CreatePolicyEngineRequest>;
export interface GetPolicyEngineRequest {
  policyEngineId: string;
}
export const GetPolicyEngineRequest = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policy-engines/{policyEngineId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPolicyEngineRequest",
}) as any as S.Schema<GetPolicyEngineRequest>;
export interface UpdatePolicyEngineRequest {
  policyEngineId: string;
  description?: string | redacted.Redacted<string>;
}
export const UpdatePolicyEngineRequest = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    description: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/policy-engines/{policyEngineId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePolicyEngineRequest",
}) as any as S.Schema<UpdatePolicyEngineRequest>;
export interface DeletePolicyEngineRequest {
  policyEngineId: string;
}
export const DeletePolicyEngineRequest = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/policy-engines/{policyEngineId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePolicyEngineRequest",
}) as any as S.Schema<DeletePolicyEngineRequest>;
export interface ListPolicyEnginesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListPolicyEnginesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policy-engines" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPolicyEnginesRequest",
}) as any as S.Schema<ListPolicyEnginesRequest>;
export interface GetPolicyGenerationRequest {
  policyGenerationId: string;
  policyEngineId: string;
}
export const GetPolicyGenerationRequest = S.suspend(() =>
  S.Struct({
    policyGenerationId: S.String.pipe(T.HttpLabel("policyGenerationId")),
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetPolicyGenerationRequest",
}) as any as S.Schema<GetPolicyGenerationRequest>;
export interface ListPolicyGenerationsRequest {
  nextToken?: string;
  maxResults?: number;
  policyEngineId: string;
}
export const ListPolicyGenerationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListPolicyGenerationsRequest",
}) as any as S.Schema<ListPolicyGenerationsRequest>;
export interface ListPolicyGenerationAssetsRequest {
  policyGenerationId: string;
  policyEngineId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListPolicyGenerationAssetsRequest = S.suspend(() =>
  S.Struct({
    policyGenerationId: S.String.pipe(T.HttpLabel("policyGenerationId")),
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListPolicyGenerationAssetsRequest",
}) as any as S.Schema<ListPolicyGenerationAssetsRequest>;
export interface GetPolicyRequest {
  policyEngineId: string;
  policyId: string;
}
export const GetPolicyRequest = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    policyId: S.String.pipe(T.HttpLabel("policyId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetPolicyRequest",
}) as any as S.Schema<GetPolicyRequest>;
export interface CedarPolicy {
  statement: string;
}
export const CedarPolicy = S.suspend(() =>
  S.Struct({ statement: S.String }),
).annotations({ identifier: "CedarPolicy" }) as any as S.Schema<CedarPolicy>;
export type PolicyDefinition = { cedar: CedarPolicy };
export const PolicyDefinition = S.Union(S.Struct({ cedar: CedarPolicy }));
export interface UpdatePolicyRequest {
  policyEngineId: string;
  policyId: string;
  description?: string | redacted.Redacted<string>;
  definition: PolicyDefinition;
  validationMode?: PolicyValidationMode;
}
export const UpdatePolicyRequest = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    policyId: S.String.pipe(T.HttpLabel("policyId")),
    description: S.optional(SensitiveString),
    definition: PolicyDefinition,
    validationMode: S.optional(PolicyValidationMode),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdatePolicyRequest",
}) as any as S.Schema<UpdatePolicyRequest>;
export interface DeletePolicyRequest {
  policyEngineId: string;
  policyId: string;
}
export const DeletePolicyRequest = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    policyId: S.String.pipe(T.HttpLabel("policyId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeletePolicyRequest",
}) as any as S.Schema<DeletePolicyRequest>;
export interface ListPoliciesRequest {
  nextToken?: string;
  maxResults?: number;
  policyEngineId: string;
  targetResourceScope?: string;
}
export const ListPoliciesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    targetResourceScope: S.optional(S.String).pipe(
      T.HttpQuery("targetResourceScope"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/policy-engines/{policyEngineId}/policies",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPoliciesRequest",
}) as any as S.Schema<ListPoliciesRequest>;
export interface CreateWorkloadIdentityRequest {
  name: string;
  allowedResourceOauth2ReturnUrls?: string[];
  tags?: { [key: string]: string };
}
export const CreateWorkloadIdentityRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    allowedResourceOauth2ReturnUrls: S.optional(
      ResourceOauth2ReturnUrlListType,
    ),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identities/CreateWorkloadIdentity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWorkloadIdentityRequest",
}) as any as S.Schema<CreateWorkloadIdentityRequest>;
export interface GetWorkloadIdentityRequest {
  name: string;
}
export const GetWorkloadIdentityRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identities/GetWorkloadIdentity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkloadIdentityRequest",
}) as any as S.Schema<GetWorkloadIdentityRequest>;
export interface UpdateWorkloadIdentityRequest {
  name: string;
  allowedResourceOauth2ReturnUrls?: string[];
}
export const UpdateWorkloadIdentityRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    allowedResourceOauth2ReturnUrls: S.optional(
      ResourceOauth2ReturnUrlListType,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identities/UpdateWorkloadIdentity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWorkloadIdentityRequest",
}) as any as S.Schema<UpdateWorkloadIdentityRequest>;
export interface DeleteWorkloadIdentityRequest {
  name: string;
}
export const DeleteWorkloadIdentityRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identities/DeleteWorkloadIdentity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWorkloadIdentityRequest",
}) as any as S.Schema<DeleteWorkloadIdentityRequest>;
export interface DeleteWorkloadIdentityResponse {}
export const DeleteWorkloadIdentityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWorkloadIdentityResponse",
}) as any as S.Schema<DeleteWorkloadIdentityResponse>;
export interface ListWorkloadIdentitiesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListWorkloadIdentitiesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identities/ListWorkloadIdentities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkloadIdentitiesRequest",
}) as any as S.Schema<ListWorkloadIdentitiesRequest>;
export type KeyType = "CustomerManagedKey" | "ServiceManagedKey";
export const KeyType = S.Literal("CustomerManagedKey", "ServiceManagedKey");
export type BrowserNetworkMode = "PUBLIC" | "VPC";
export const BrowserNetworkMode = S.Literal("PUBLIC", "VPC");
export type CodeInterpreterNetworkMode = "PUBLIC" | "SANDBOX" | "VPC";
export const CodeInterpreterNetworkMode = S.Literal("PUBLIC", "SANDBOX", "VPC");
export interface KmsConfiguration {
  keyType: KeyType;
  kmsKeyArn?: string;
}
export const KmsConfiguration = S.suspend(() =>
  S.Struct({ keyType: KeyType, kmsKeyArn: S.optional(S.String) }),
).annotations({
  identifier: "KmsConfiguration",
}) as any as S.Schema<KmsConfiguration>;
export type AgentRuntimeEndpointStatus =
  | "CREATING"
  | "CREATE_FAILED"
  | "UPDATING"
  | "UPDATE_FAILED"
  | "READY"
  | "DELETING";
export const AgentRuntimeEndpointStatus = S.Literal(
  "CREATING",
  "CREATE_FAILED",
  "UPDATING",
  "UPDATE_FAILED",
  "READY",
  "DELETING",
);
export type AgentRuntimeStatus =
  | "CREATING"
  | "CREATE_FAILED"
  | "UPDATING"
  | "UPDATE_FAILED"
  | "READY"
  | "DELETING";
export const AgentRuntimeStatus = S.Literal(
  "CREATING",
  "CREATE_FAILED",
  "UPDATING",
  "UPDATE_FAILED",
  "READY",
  "DELETING",
);
export interface BrowserNetworkConfiguration {
  networkMode: BrowserNetworkMode;
  vpcConfig?: VpcConfig;
}
export const BrowserNetworkConfiguration = S.suspend(() =>
  S.Struct({
    networkMode: BrowserNetworkMode,
    vpcConfig: S.optional(VpcConfig),
  }),
).annotations({
  identifier: "BrowserNetworkConfiguration",
}) as any as S.Schema<BrowserNetworkConfiguration>;
export interface BrowserSigningConfigInput {
  enabled: boolean;
}
export const BrowserSigningConfigInput = S.suspend(() =>
  S.Struct({ enabled: S.Boolean }),
).annotations({
  identifier: "BrowserSigningConfigInput",
}) as any as S.Schema<BrowserSigningConfigInput>;
export type BrowserStatus =
  | "CREATING"
  | "CREATE_FAILED"
  | "READY"
  | "DELETING"
  | "DELETE_FAILED"
  | "DELETED";
export const BrowserStatus = S.Literal(
  "CREATING",
  "CREATE_FAILED",
  "READY",
  "DELETING",
  "DELETE_FAILED",
  "DELETED",
);
export interface CodeInterpreterNetworkConfiguration {
  networkMode: CodeInterpreterNetworkMode;
  vpcConfig?: VpcConfig;
}
export const CodeInterpreterNetworkConfiguration = S.suspend(() =>
  S.Struct({
    networkMode: CodeInterpreterNetworkMode,
    vpcConfig: S.optional(VpcConfig),
  }),
).annotations({
  identifier: "CodeInterpreterNetworkConfiguration",
}) as any as S.Schema<CodeInterpreterNetworkConfiguration>;
export type CodeInterpreterStatus =
  | "CREATING"
  | "CREATE_FAILED"
  | "READY"
  | "DELETING"
  | "DELETE_FAILED"
  | "DELETED";
export const CodeInterpreterStatus = S.Literal(
  "CREATING",
  "CREATE_FAILED",
  "READY",
  "DELETING",
  "DELETE_FAILED",
  "DELETED",
);
export type EvaluatorStatus =
  | "ACTIVE"
  | "CREATING"
  | "CREATE_FAILED"
  | "UPDATING"
  | "UPDATE_FAILED"
  | "DELETING";
export const EvaluatorStatus = S.Literal(
  "ACTIVE",
  "CREATING",
  "CREATE_FAILED",
  "UPDATING",
  "UPDATE_FAILED",
  "DELETING",
);
export type GatewayStatus =
  | "CREATING"
  | "UPDATING"
  | "UPDATE_UNSUCCESSFUL"
  | "DELETING"
  | "READY"
  | "FAILED";
export const GatewayStatus = S.Literal(
  "CREATING",
  "UPDATING",
  "UPDATE_UNSUCCESSFUL",
  "DELETING",
  "READY",
  "FAILED",
);
export type StatusReasons = string[];
export const StatusReasons = S.Array(S.String);
export type TargetStatus =
  | "CREATING"
  | "UPDATING"
  | "UPDATE_UNSUCCESSFUL"
  | "DELETING"
  | "READY"
  | "FAILED"
  | "SYNCHRONIZING"
  | "SYNCHRONIZE_UNSUCCESSFUL";
export const TargetStatus = S.Literal(
  "CREATING",
  "UPDATING",
  "UPDATE_UNSUCCESSFUL",
  "DELETING",
  "READY",
  "FAILED",
  "SYNCHRONIZING",
  "SYNCHRONIZE_UNSUCCESSFUL",
);
export type MemoryStatus = "CREATING" | "ACTIVE" | "FAILED" | "DELETING";
export const MemoryStatus = S.Literal(
  "CREATING",
  "ACTIVE",
  "FAILED",
  "DELETING",
);
export type OnlineEvaluationConfigStatus =
  | "ACTIVE"
  | "CREATING"
  | "CREATE_FAILED"
  | "UPDATING"
  | "UPDATE_FAILED"
  | "DELETING";
export const OnlineEvaluationConfigStatus = S.Literal(
  "ACTIVE",
  "CREATING",
  "CREATE_FAILED",
  "UPDATING",
  "UPDATE_FAILED",
  "DELETING",
);
export type PolicyEngineStatus =
  | "CREATING"
  | "ACTIVE"
  | "UPDATING"
  | "DELETING"
  | "CREATE_FAILED"
  | "UPDATE_FAILED"
  | "DELETE_FAILED";
export const PolicyEngineStatus = S.Literal(
  "CREATING",
  "ACTIVE",
  "UPDATING",
  "DELETING",
  "CREATE_FAILED",
  "UPDATE_FAILED",
  "DELETE_FAILED",
);
export type PolicyStatusReasons = string[];
export const PolicyStatusReasons = S.Array(S.String);
export type Resource = { arn: string };
export const Resource = S.Union(S.Struct({ arn: S.String }));
export type Content = { rawText: string };
export const Content = S.Union(S.Struct({ rawText: S.String }));
export type PolicyGenerationStatus =
  | "GENERATING"
  | "GENERATED"
  | "GENERATE_FAILED"
  | "DELETE_FAILED";
export const PolicyGenerationStatus = S.Literal(
  "GENERATING",
  "GENERATED",
  "GENERATE_FAILED",
  "DELETE_FAILED",
);
export type PolicyStatus =
  | "CREATING"
  | "ACTIVE"
  | "UPDATING"
  | "DELETING"
  | "CREATE_FAILED"
  | "UPDATE_FAILED"
  | "DELETE_FAILED";
export const PolicyStatus = S.Literal(
  "CREATING",
  "ACTIVE",
  "UPDATING",
  "DELETING",
  "CREATE_FAILED",
  "UPDATE_FAILED",
  "DELETE_FAILED",
);
export type NamespacesList = string[];
export const NamespacesList = S.Array(S.String);
export interface GetResourcePolicyResponse {
  policy?: string;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({ policy: S.optional(S.String) }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface GetTokenVaultResponse {
  tokenVaultId: string;
  kmsConfiguration: KmsConfiguration;
  lastModifiedDate: Date;
}
export const GetTokenVaultResponse = S.suspend(() =>
  S.Struct({
    tokenVaultId: S.String,
    kmsConfiguration: KmsConfiguration,
    lastModifiedDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetTokenVaultResponse",
}) as any as S.Schema<GetTokenVaultResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagsMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutResourcePolicyResponse {
  policy: string;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({ policy: S.String }),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface SetTokenVaultCMKRequest {
  tokenVaultId?: string;
  kmsConfiguration: KmsConfiguration;
}
export const SetTokenVaultCMKRequest = S.suspend(() =>
  S.Struct({
    tokenVaultId: S.optional(S.String),
    kmsConfiguration: KmsConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identities/set-token-vault-cmk" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetTokenVaultCMKRequest",
}) as any as S.Schema<SetTokenVaultCMKRequest>;
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
export interface CreateAgentRuntimeEndpointResponse {
  targetVersion: string;
  agentRuntimeEndpointArn: string;
  agentRuntimeArn: string;
  agentRuntimeId?: string;
  endpointName?: string | redacted.Redacted<string>;
  status: AgentRuntimeEndpointStatus;
  createdAt: Date;
}
export const CreateAgentRuntimeEndpointResponse = S.suspend(() =>
  S.Struct({
    targetVersion: S.String,
    agentRuntimeEndpointArn: S.String,
    agentRuntimeArn: S.String,
    agentRuntimeId: S.optional(S.String),
    endpointName: S.optional(SensitiveString),
    status: AgentRuntimeEndpointStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateAgentRuntimeEndpointResponse",
}) as any as S.Schema<CreateAgentRuntimeEndpointResponse>;
export interface GetAgentRuntimeEndpointResponse {
  liveVersion?: string;
  targetVersion?: string;
  agentRuntimeEndpointArn: string;
  agentRuntimeArn: string;
  description?: string;
  status: AgentRuntimeEndpointStatus;
  createdAt: Date;
  lastUpdatedAt: Date;
  failureReason?: string;
  name: string | redacted.Redacted<string>;
  id: string;
}
export const GetAgentRuntimeEndpointResponse = S.suspend(() =>
  S.Struct({
    liveVersion: S.optional(S.String),
    targetVersion: S.optional(S.String),
    agentRuntimeEndpointArn: S.String,
    agentRuntimeArn: S.String,
    description: S.optional(S.String),
    status: AgentRuntimeEndpointStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    failureReason: S.optional(S.String),
    name: SensitiveString,
    id: S.String,
  }),
).annotations({
  identifier: "GetAgentRuntimeEndpointResponse",
}) as any as S.Schema<GetAgentRuntimeEndpointResponse>;
export interface UpdateAgentRuntimeEndpointResponse {
  liveVersion?: string;
  targetVersion?: string;
  agentRuntimeEndpointArn: string;
  agentRuntimeArn: string;
  status: AgentRuntimeEndpointStatus;
  createdAt: Date;
  lastUpdatedAt: Date;
}
export const UpdateAgentRuntimeEndpointResponse = S.suspend(() =>
  S.Struct({
    liveVersion: S.optional(S.String),
    targetVersion: S.optional(S.String),
    agentRuntimeEndpointArn: S.String,
    agentRuntimeArn: S.String,
    status: AgentRuntimeEndpointStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateAgentRuntimeEndpointResponse",
}) as any as S.Schema<UpdateAgentRuntimeEndpointResponse>;
export interface DeleteAgentRuntimeEndpointResponse {
  status: AgentRuntimeEndpointStatus;
  agentRuntimeId?: string;
  endpointName?: string | redacted.Redacted<string>;
}
export const DeleteAgentRuntimeEndpointResponse = S.suspend(() =>
  S.Struct({
    status: AgentRuntimeEndpointStatus,
    agentRuntimeId: S.optional(S.String),
    endpointName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "DeleteAgentRuntimeEndpointResponse",
}) as any as S.Schema<DeleteAgentRuntimeEndpointResponse>;
export interface WorkloadIdentityDetails {
  workloadIdentityArn: string;
}
export const WorkloadIdentityDetails = S.suspend(() =>
  S.Struct({ workloadIdentityArn: S.String }),
).annotations({
  identifier: "WorkloadIdentityDetails",
}) as any as S.Schema<WorkloadIdentityDetails>;
export interface UpdateAgentRuntimeResponse {
  agentRuntimeArn: string;
  agentRuntimeId: string;
  workloadIdentityDetails?: WorkloadIdentityDetails;
  agentRuntimeVersion: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  status: AgentRuntimeStatus;
}
export const UpdateAgentRuntimeResponse = S.suspend(() =>
  S.Struct({
    agentRuntimeArn: S.String,
    agentRuntimeId: S.String,
    workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
    agentRuntimeVersion: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: AgentRuntimeStatus,
  }),
).annotations({
  identifier: "UpdateAgentRuntimeResponse",
}) as any as S.Schema<UpdateAgentRuntimeResponse>;
export interface DeleteAgentRuntimeResponse {
  status: AgentRuntimeStatus;
  agentRuntimeId?: string;
}
export const DeleteAgentRuntimeResponse = S.suspend(() =>
  S.Struct({
    status: AgentRuntimeStatus,
    agentRuntimeId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteAgentRuntimeResponse",
}) as any as S.Schema<DeleteAgentRuntimeResponse>;
export interface AgentRuntime {
  agentRuntimeArn: string;
  agentRuntimeId: string;
  agentRuntimeVersion: string;
  agentRuntimeName: string;
  description: string | redacted.Redacted<string>;
  lastUpdatedAt: Date;
  status: AgentRuntimeStatus;
}
export const AgentRuntime = S.suspend(() =>
  S.Struct({
    agentRuntimeArn: S.String,
    agentRuntimeId: S.String,
    agentRuntimeVersion: S.String,
    agentRuntimeName: S.String,
    description: SensitiveString,
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: AgentRuntimeStatus,
  }),
).annotations({ identifier: "AgentRuntime" }) as any as S.Schema<AgentRuntime>;
export type AgentRuntimes = AgentRuntime[];
export const AgentRuntimes = S.Array(AgentRuntime);
export interface ListAgentRuntimeVersionsResponse {
  agentRuntimes: AgentRuntime[];
  nextToken?: string;
}
export const ListAgentRuntimeVersionsResponse = S.suspend(() =>
  S.Struct({ agentRuntimes: AgentRuntimes, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAgentRuntimeVersionsResponse",
}) as any as S.Schema<ListAgentRuntimeVersionsResponse>;
export interface Secret {
  secretArn: string;
}
export const Secret = S.suspend(() =>
  S.Struct({ secretArn: S.String }),
).annotations({ identifier: "Secret" }) as any as S.Schema<Secret>;
export interface GetApiKeyCredentialProviderResponse {
  apiKeySecretArn: Secret;
  name: string;
  credentialProviderArn: string;
  createdTime: Date;
  lastUpdatedTime: Date;
}
export const GetApiKeyCredentialProviderResponse = S.suspend(() =>
  S.Struct({
    apiKeySecretArn: Secret,
    name: S.String,
    credentialProviderArn: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetApiKeyCredentialProviderResponse",
}) as any as S.Schema<GetApiKeyCredentialProviderResponse>;
export interface UpdateApiKeyCredentialProviderResponse {
  apiKeySecretArn: Secret;
  name: string;
  credentialProviderArn: string;
  createdTime: Date;
  lastUpdatedTime: Date;
}
export const UpdateApiKeyCredentialProviderResponse = S.suspend(() =>
  S.Struct({
    apiKeySecretArn: Secret,
    name: S.String,
    credentialProviderArn: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "UpdateApiKeyCredentialProviderResponse",
}) as any as S.Schema<UpdateApiKeyCredentialProviderResponse>;
export interface DeleteBrowserResponse {
  browserId: string;
  status: BrowserStatus;
  lastUpdatedAt: Date;
}
export const DeleteBrowserResponse = S.suspend(() =>
  S.Struct({
    browserId: S.String,
    status: BrowserStatus,
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "DeleteBrowserResponse",
}) as any as S.Schema<DeleteBrowserResponse>;
export interface CreateCodeInterpreterRequest {
  name: string;
  description?: string | redacted.Redacted<string>;
  executionRoleArn?: string;
  networkConfiguration: CodeInterpreterNetworkConfiguration;
  clientToken?: string;
  tags?: { [key: string]: string };
}
export const CreateCodeInterpreterRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    executionRoleArn: S.optional(S.String),
    networkConfiguration: CodeInterpreterNetworkConfiguration,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/code-interpreters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCodeInterpreterRequest",
}) as any as S.Schema<CreateCodeInterpreterRequest>;
export interface GetCodeInterpreterResponse {
  codeInterpreterId: string;
  codeInterpreterArn: string;
  name: string;
  description?: string | redacted.Redacted<string>;
  executionRoleArn?: string;
  networkConfiguration: CodeInterpreterNetworkConfiguration;
  status: CodeInterpreterStatus;
  failureReason?: string;
  createdAt: Date;
  lastUpdatedAt: Date;
}
export const GetCodeInterpreterResponse = S.suspend(() =>
  S.Struct({
    codeInterpreterId: S.String,
    codeInterpreterArn: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    executionRoleArn: S.optional(S.String),
    networkConfiguration: CodeInterpreterNetworkConfiguration,
    status: CodeInterpreterStatus,
    failureReason: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetCodeInterpreterResponse",
}) as any as S.Schema<GetCodeInterpreterResponse>;
export interface DeleteCodeInterpreterResponse {
  codeInterpreterId: string;
  status: CodeInterpreterStatus;
  lastUpdatedAt: Date;
}
export const DeleteCodeInterpreterResponse = S.suspend(() =>
  S.Struct({
    codeInterpreterId: S.String,
    status: CodeInterpreterStatus,
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "DeleteCodeInterpreterResponse",
}) as any as S.Schema<DeleteCodeInterpreterResponse>;
export interface GetEvaluatorResponse {
  evaluatorArn: string;
  evaluatorId: string;
  evaluatorName: string;
  description?: string | redacted.Redacted<string>;
  evaluatorConfig: EvaluatorConfig;
  level: EvaluatorLevel;
  status: EvaluatorStatus;
  createdAt: Date;
  updatedAt: Date;
  lockedForModification?: boolean;
}
export const GetEvaluatorResponse = S.suspend(() =>
  S.Struct({
    evaluatorArn: S.String,
    evaluatorId: S.String,
    evaluatorName: S.String,
    description: S.optional(SensitiveString),
    evaluatorConfig: EvaluatorConfig,
    level: EvaluatorLevel,
    status: EvaluatorStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lockedForModification: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetEvaluatorResponse",
}) as any as S.Schema<GetEvaluatorResponse>;
export interface UpdateEvaluatorResponse {
  evaluatorArn: string;
  evaluatorId: string;
  updatedAt: Date;
  status: EvaluatorStatus;
}
export const UpdateEvaluatorResponse = S.suspend(() =>
  S.Struct({
    evaluatorArn: S.String,
    evaluatorId: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: EvaluatorStatus,
  }),
).annotations({
  identifier: "UpdateEvaluatorResponse",
}) as any as S.Schema<UpdateEvaluatorResponse>;
export interface DeleteEvaluatorResponse {
  evaluatorArn: string;
  evaluatorId: string;
  status: EvaluatorStatus;
}
export const DeleteEvaluatorResponse = S.suspend(() =>
  S.Struct({
    evaluatorArn: S.String,
    evaluatorId: S.String,
    status: EvaluatorStatus,
  }),
).annotations({
  identifier: "DeleteEvaluatorResponse",
}) as any as S.Schema<DeleteEvaluatorResponse>;
export interface DeleteGatewayResponse {
  gatewayId: string;
  status: GatewayStatus;
  statusReasons?: string[];
}
export const DeleteGatewayResponse = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    status: GatewayStatus,
    statusReasons: S.optional(StatusReasons),
  }),
).annotations({
  identifier: "DeleteGatewayResponse",
}) as any as S.Schema<DeleteGatewayResponse>;
export interface GetGatewayResponse {
  gatewayArn: string;
  gatewayId: string;
  gatewayUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  status: GatewayStatus;
  statusReasons?: string[];
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  roleArn?: string;
  protocolType: GatewayProtocolType;
  protocolConfiguration?: GatewayProtocolConfiguration;
  authorizerType: AuthorizerType;
  authorizerConfiguration?: AuthorizerConfiguration;
  kmsKeyArn?: string;
  interceptorConfigurations?: GatewayInterceptorConfiguration[];
  policyEngineConfiguration?: GatewayPolicyEngineConfiguration;
  workloadIdentityDetails?: WorkloadIdentityDetails;
  exceptionLevel?: ExceptionLevel;
}
export const GetGatewayResponse = S.suspend(() =>
  S.Struct({
    gatewayArn: S.String,
    gatewayId: S.String,
    gatewayUrl: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: GatewayStatus,
    statusReasons: S.optional(StatusReasons),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    roleArn: S.optional(S.String),
    protocolType: GatewayProtocolType,
    protocolConfiguration: S.optional(GatewayProtocolConfiguration),
    authorizerType: AuthorizerType,
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    kmsKeyArn: S.optional(S.String),
    interceptorConfigurations: S.optional(GatewayInterceptorConfigurations),
    policyEngineConfiguration: S.optional(GatewayPolicyEngineConfiguration),
    workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
    exceptionLevel: S.optional(ExceptionLevel),
  }),
).annotations({
  identifier: "GetGatewayResponse",
}) as any as S.Schema<GetGatewayResponse>;
export interface UpdateGatewayResponse {
  gatewayArn: string;
  gatewayId: string;
  gatewayUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  status: GatewayStatus;
  statusReasons?: string[];
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  roleArn?: string;
  protocolType: GatewayProtocolType;
  protocolConfiguration?: GatewayProtocolConfiguration;
  authorizerType: AuthorizerType;
  authorizerConfiguration?: AuthorizerConfiguration;
  kmsKeyArn?: string;
  interceptorConfigurations?: GatewayInterceptorConfiguration[];
  policyEngineConfiguration?: GatewayPolicyEngineConfiguration;
  workloadIdentityDetails?: WorkloadIdentityDetails;
  exceptionLevel?: ExceptionLevel;
}
export const UpdateGatewayResponse = S.suspend(() =>
  S.Struct({
    gatewayArn: S.String,
    gatewayId: S.String,
    gatewayUrl: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: GatewayStatus,
    statusReasons: S.optional(StatusReasons),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    roleArn: S.optional(S.String),
    protocolType: GatewayProtocolType,
    protocolConfiguration: S.optional(GatewayProtocolConfiguration),
    authorizerType: AuthorizerType,
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    kmsKeyArn: S.optional(S.String),
    interceptorConfigurations: S.optional(GatewayInterceptorConfigurations),
    policyEngineConfiguration: S.optional(GatewayPolicyEngineConfiguration),
    workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
    exceptionLevel: S.optional(ExceptionLevel),
  }),
).annotations({
  identifier: "UpdateGatewayResponse",
}) as any as S.Schema<UpdateGatewayResponse>;
export interface DeleteGatewayTargetResponse {
  gatewayArn: string;
  targetId: string;
  status: TargetStatus;
  statusReasons?: string[];
}
export const DeleteGatewayTargetResponse = S.suspend(() =>
  S.Struct({
    gatewayArn: S.String,
    targetId: S.String,
    status: TargetStatus,
    statusReasons: S.optional(StatusReasons),
  }),
).annotations({
  identifier: "DeleteGatewayTargetResponse",
}) as any as S.Schema<DeleteGatewayTargetResponse>;
export interface GetGatewayTargetResponse {
  gatewayArn: string;
  targetId: string;
  createdAt: Date;
  updatedAt: Date;
  status: TargetStatus;
  statusReasons?: string[];
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  targetConfiguration: TargetConfiguration;
  credentialProviderConfigurations: CredentialProviderConfiguration[];
  lastSynchronizedAt?: Date;
  metadataConfiguration?: MetadataConfiguration;
}
export const GetGatewayTargetResponse = S.suspend(() =>
  S.Struct({
    gatewayArn: S.String,
    targetId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: TargetStatus,
    statusReasons: S.optional(StatusReasons),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    targetConfiguration: TargetConfiguration,
    credentialProviderConfigurations: CredentialProviderConfigurations,
    lastSynchronizedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    metadataConfiguration: S.optional(MetadataConfiguration),
  }),
).annotations({
  identifier: "GetGatewayTargetResponse",
}) as any as S.Schema<GetGatewayTargetResponse>;
export interface UpdateGatewayTargetResponse {
  gatewayArn: string;
  targetId: string;
  createdAt: Date;
  updatedAt: Date;
  status: TargetStatus;
  statusReasons?: string[];
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  targetConfiguration: TargetConfiguration;
  credentialProviderConfigurations: CredentialProviderConfiguration[];
  lastSynchronizedAt?: Date;
  metadataConfiguration?: MetadataConfiguration;
}
export const UpdateGatewayTargetResponse = S.suspend(() =>
  S.Struct({
    gatewayArn: S.String,
    targetId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: TargetStatus,
    statusReasons: S.optional(StatusReasons),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    targetConfiguration: TargetConfiguration,
    credentialProviderConfigurations: CredentialProviderConfigurations,
    lastSynchronizedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    metadataConfiguration: S.optional(MetadataConfiguration),
  }),
).annotations({
  identifier: "UpdateGatewayTargetResponse",
}) as any as S.Schema<UpdateGatewayTargetResponse>;
export interface DeleteMemoryOutput {
  memoryId: string;
  status?: MemoryStatus;
}
export const DeleteMemoryOutput = S.suspend(() =>
  S.Struct({ memoryId: S.String, status: S.optional(MemoryStatus) }),
).annotations({
  identifier: "DeleteMemoryOutput",
}) as any as S.Schema<DeleteMemoryOutput>;
export interface CustomOauth2ProviderConfigOutput {
  oauthDiscovery: Oauth2Discovery;
  clientId?: string;
}
export const CustomOauth2ProviderConfigOutput = S.suspend(() =>
  S.Struct({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }),
).annotations({
  identifier: "CustomOauth2ProviderConfigOutput",
}) as any as S.Schema<CustomOauth2ProviderConfigOutput>;
export interface GoogleOauth2ProviderConfigOutput {
  oauthDiscovery: Oauth2Discovery;
  clientId?: string;
}
export const GoogleOauth2ProviderConfigOutput = S.suspend(() =>
  S.Struct({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }),
).annotations({
  identifier: "GoogleOauth2ProviderConfigOutput",
}) as any as S.Schema<GoogleOauth2ProviderConfigOutput>;
export interface GithubOauth2ProviderConfigOutput {
  oauthDiscovery: Oauth2Discovery;
  clientId?: string;
}
export const GithubOauth2ProviderConfigOutput = S.suspend(() =>
  S.Struct({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }),
).annotations({
  identifier: "GithubOauth2ProviderConfigOutput",
}) as any as S.Schema<GithubOauth2ProviderConfigOutput>;
export interface SlackOauth2ProviderConfigOutput {
  oauthDiscovery: Oauth2Discovery;
  clientId?: string;
}
export const SlackOauth2ProviderConfigOutput = S.suspend(() =>
  S.Struct({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }),
).annotations({
  identifier: "SlackOauth2ProviderConfigOutput",
}) as any as S.Schema<SlackOauth2ProviderConfigOutput>;
export interface SalesforceOauth2ProviderConfigOutput {
  oauthDiscovery: Oauth2Discovery;
  clientId?: string;
}
export const SalesforceOauth2ProviderConfigOutput = S.suspend(() =>
  S.Struct({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }),
).annotations({
  identifier: "SalesforceOauth2ProviderConfigOutput",
}) as any as S.Schema<SalesforceOauth2ProviderConfigOutput>;
export interface MicrosoftOauth2ProviderConfigOutput {
  oauthDiscovery: Oauth2Discovery;
  clientId?: string;
}
export const MicrosoftOauth2ProviderConfigOutput = S.suspend(() =>
  S.Struct({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }),
).annotations({
  identifier: "MicrosoftOauth2ProviderConfigOutput",
}) as any as S.Schema<MicrosoftOauth2ProviderConfigOutput>;
export interface AtlassianOauth2ProviderConfigOutput {
  oauthDiscovery: Oauth2Discovery;
  clientId?: string;
}
export const AtlassianOauth2ProviderConfigOutput = S.suspend(() =>
  S.Struct({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }),
).annotations({
  identifier: "AtlassianOauth2ProviderConfigOutput",
}) as any as S.Schema<AtlassianOauth2ProviderConfigOutput>;
export interface LinkedinOauth2ProviderConfigOutput {
  oauthDiscovery: Oauth2Discovery;
  clientId?: string;
}
export const LinkedinOauth2ProviderConfigOutput = S.suspend(() =>
  S.Struct({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }),
).annotations({
  identifier: "LinkedinOauth2ProviderConfigOutput",
}) as any as S.Schema<LinkedinOauth2ProviderConfigOutput>;
export interface IncludedOauth2ProviderConfigOutput {
  oauthDiscovery: Oauth2Discovery;
  clientId?: string;
}
export const IncludedOauth2ProviderConfigOutput = S.suspend(() =>
  S.Struct({ oauthDiscovery: Oauth2Discovery, clientId: S.optional(S.String) }),
).annotations({
  identifier: "IncludedOauth2ProviderConfigOutput",
}) as any as S.Schema<IncludedOauth2ProviderConfigOutput>;
export type Oauth2ProviderConfigOutput =
  | { customOauth2ProviderConfig: CustomOauth2ProviderConfigOutput }
  | { googleOauth2ProviderConfig: GoogleOauth2ProviderConfigOutput }
  | { githubOauth2ProviderConfig: GithubOauth2ProviderConfigOutput }
  | { slackOauth2ProviderConfig: SlackOauth2ProviderConfigOutput }
  | { salesforceOauth2ProviderConfig: SalesforceOauth2ProviderConfigOutput }
  | { microsoftOauth2ProviderConfig: MicrosoftOauth2ProviderConfigOutput }
  | { atlassianOauth2ProviderConfig: AtlassianOauth2ProviderConfigOutput }
  | { linkedinOauth2ProviderConfig: LinkedinOauth2ProviderConfigOutput }
  | { includedOauth2ProviderConfig: IncludedOauth2ProviderConfigOutput };
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
export interface UpdateOauth2CredentialProviderResponse {
  clientSecretArn: Secret;
  name: string;
  credentialProviderVendor: CredentialProviderVendorType;
  credentialProviderArn: string;
  callbackUrl?: string;
  oauth2ProviderConfigOutput: Oauth2ProviderConfigOutput;
  createdTime: Date;
  lastUpdatedTime: Date;
}
export const UpdateOauth2CredentialProviderResponse = S.suspend(() =>
  S.Struct({
    clientSecretArn: Secret,
    name: S.String,
    credentialProviderVendor: CredentialProviderVendorType,
    credentialProviderArn: S.String,
    callbackUrl: S.optional(S.String),
    oauth2ProviderConfigOutput: Oauth2ProviderConfigOutput,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "UpdateOauth2CredentialProviderResponse",
}) as any as S.Schema<UpdateOauth2CredentialProviderResponse>;
export interface UpdateOnlineEvaluationConfigResponse {
  onlineEvaluationConfigArn: string;
  onlineEvaluationConfigId: string;
  updatedAt: Date;
  status: OnlineEvaluationConfigStatus;
  executionStatus: OnlineEvaluationExecutionStatus;
  failureReason?: string;
}
export const UpdateOnlineEvaluationConfigResponse = S.suspend(() =>
  S.Struct({
    onlineEvaluationConfigArn: S.String,
    onlineEvaluationConfigId: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: OnlineEvaluationConfigStatus,
    executionStatus: OnlineEvaluationExecutionStatus,
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateOnlineEvaluationConfigResponse",
}) as any as S.Schema<UpdateOnlineEvaluationConfigResponse>;
export interface DeleteOnlineEvaluationConfigResponse {
  onlineEvaluationConfigArn: string;
  onlineEvaluationConfigId: string;
  status: OnlineEvaluationConfigStatus;
}
export const DeleteOnlineEvaluationConfigResponse = S.suspend(() =>
  S.Struct({
    onlineEvaluationConfigArn: S.String,
    onlineEvaluationConfigId: S.String,
    status: OnlineEvaluationConfigStatus,
  }),
).annotations({
  identifier: "DeleteOnlineEvaluationConfigResponse",
}) as any as S.Schema<DeleteOnlineEvaluationConfigResponse>;
export interface CreatePolicyEngineResponse {
  policyEngineId: string;
  name: string;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  policyEngineArn: string;
  status: PolicyEngineStatus;
  statusReasons: string[];
}
export const CreatePolicyEngineResponse = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    policyEngineArn: S.String,
    status: PolicyEngineStatus,
    statusReasons: PolicyStatusReasons,
  }),
).annotations({
  identifier: "CreatePolicyEngineResponse",
}) as any as S.Schema<CreatePolicyEngineResponse>;
export interface GetPolicyEngineResponse {
  policyEngineId: string;
  name: string;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  policyEngineArn: string;
  status: PolicyEngineStatus;
  statusReasons: string[];
}
export const GetPolicyEngineResponse = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    policyEngineArn: S.String,
    status: PolicyEngineStatus,
    statusReasons: PolicyStatusReasons,
  }),
).annotations({
  identifier: "GetPolicyEngineResponse",
}) as any as S.Schema<GetPolicyEngineResponse>;
export interface UpdatePolicyEngineResponse {
  policyEngineId: string;
  name: string;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  policyEngineArn: string;
  status: PolicyEngineStatus;
  statusReasons: string[];
}
export const UpdatePolicyEngineResponse = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    policyEngineArn: S.String,
    status: PolicyEngineStatus,
    statusReasons: PolicyStatusReasons,
  }),
).annotations({
  identifier: "UpdatePolicyEngineResponse",
}) as any as S.Schema<UpdatePolicyEngineResponse>;
export interface DeletePolicyEngineResponse {
  policyEngineId: string;
  name: string;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  policyEngineArn: string;
  status: PolicyEngineStatus;
  statusReasons: string[];
}
export const DeletePolicyEngineResponse = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    policyEngineArn: S.String,
    status: PolicyEngineStatus,
    statusReasons: PolicyStatusReasons,
  }),
).annotations({
  identifier: "DeletePolicyEngineResponse",
}) as any as S.Schema<DeletePolicyEngineResponse>;
export interface StartPolicyGenerationRequest {
  policyEngineId: string;
  resource: Resource;
  content: Content;
  name: string;
  clientToken?: string;
}
export const StartPolicyGenerationRequest = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    resource: Resource,
    content: Content,
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartPolicyGenerationRequest",
}) as any as S.Schema<StartPolicyGenerationRequest>;
export interface GetPolicyGenerationResponse {
  policyEngineId: string;
  policyGenerationId: string;
  name: string;
  policyGenerationArn: string;
  resource: Resource;
  createdAt: Date;
  updatedAt: Date;
  status: PolicyGenerationStatus;
  statusReasons: string[];
  findings?: string;
}
export const GetPolicyGenerationResponse = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String,
    policyGenerationId: S.String,
    name: S.String,
    policyGenerationArn: S.String,
    resource: Resource,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: PolicyGenerationStatus,
    statusReasons: PolicyStatusReasons,
    findings: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPolicyGenerationResponse",
}) as any as S.Schema<GetPolicyGenerationResponse>;
export interface GetPolicyResponse {
  policyId: string;
  name: string;
  policyEngineId: string;
  definition: PolicyDefinition;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  policyArn: string;
  status: PolicyStatus;
  statusReasons: string[];
}
export const GetPolicyResponse = S.suspend(() =>
  S.Struct({
    policyId: S.String,
    name: S.String,
    policyEngineId: S.String,
    definition: PolicyDefinition,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    policyArn: S.String,
    status: PolicyStatus,
    statusReasons: PolicyStatusReasons,
  }),
).annotations({
  identifier: "GetPolicyResponse",
}) as any as S.Schema<GetPolicyResponse>;
export interface UpdatePolicyResponse {
  policyId: string;
  name: string;
  policyEngineId: string;
  definition: PolicyDefinition;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  policyArn: string;
  status: PolicyStatus;
  statusReasons: string[];
}
export const UpdatePolicyResponse = S.suspend(() =>
  S.Struct({
    policyId: S.String,
    name: S.String,
    policyEngineId: S.String,
    definition: PolicyDefinition,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    policyArn: S.String,
    status: PolicyStatus,
    statusReasons: PolicyStatusReasons,
  }),
).annotations({
  identifier: "UpdatePolicyResponse",
}) as any as S.Schema<UpdatePolicyResponse>;
export interface DeletePolicyResponse {
  policyId: string;
  name: string;
  policyEngineId: string;
  definition: PolicyDefinition;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  policyArn: string;
  status: PolicyStatus;
  statusReasons: string[];
}
export const DeletePolicyResponse = S.suspend(() =>
  S.Struct({
    policyId: S.String,
    name: S.String,
    policyEngineId: S.String,
    definition: PolicyDefinition,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    policyArn: S.String,
    status: PolicyStatus,
    statusReasons: PolicyStatusReasons,
  }),
).annotations({
  identifier: "DeletePolicyResponse",
}) as any as S.Schema<DeletePolicyResponse>;
export interface CreateWorkloadIdentityResponse {
  name: string;
  workloadIdentityArn: string;
  allowedResourceOauth2ReturnUrls?: string[];
}
export const CreateWorkloadIdentityResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    workloadIdentityArn: S.String,
    allowedResourceOauth2ReturnUrls: S.optional(
      ResourceOauth2ReturnUrlListType,
    ),
  }),
).annotations({
  identifier: "CreateWorkloadIdentityResponse",
}) as any as S.Schema<CreateWorkloadIdentityResponse>;
export interface GetWorkloadIdentityResponse {
  name: string;
  workloadIdentityArn: string;
  allowedResourceOauth2ReturnUrls?: string[];
  createdTime: Date;
  lastUpdatedTime: Date;
}
export const GetWorkloadIdentityResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    workloadIdentityArn: S.String,
    allowedResourceOauth2ReturnUrls: S.optional(
      ResourceOauth2ReturnUrlListType,
    ),
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetWorkloadIdentityResponse",
}) as any as S.Schema<GetWorkloadIdentityResponse>;
export interface UpdateWorkloadIdentityResponse {
  name: string;
  workloadIdentityArn: string;
  allowedResourceOauth2ReturnUrls?: string[];
  createdTime: Date;
  lastUpdatedTime: Date;
}
export const UpdateWorkloadIdentityResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    workloadIdentityArn: S.String,
    allowedResourceOauth2ReturnUrls: S.optional(
      ResourceOauth2ReturnUrlListType,
    ),
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "UpdateWorkloadIdentityResponse",
}) as any as S.Schema<UpdateWorkloadIdentityResponse>;
export type EvaluatorType = "Builtin" | "Custom";
export const EvaluatorType = S.Literal("Builtin", "Custom");
export interface SemanticMemoryStrategyInput {
  name: string;
  description?: string | redacted.Redacted<string>;
  namespaces?: string[];
}
export const SemanticMemoryStrategyInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    namespaces: S.optional(NamespacesList),
  }),
).annotations({
  identifier: "SemanticMemoryStrategyInput",
}) as any as S.Schema<SemanticMemoryStrategyInput>;
export interface SummaryMemoryStrategyInput {
  name: string;
  description?: string | redacted.Redacted<string>;
  namespaces?: string[];
}
export const SummaryMemoryStrategyInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    namespaces: S.optional(NamespacesList),
  }),
).annotations({
  identifier: "SummaryMemoryStrategyInput",
}) as any as S.Schema<SummaryMemoryStrategyInput>;
export interface UserPreferenceMemoryStrategyInput {
  name: string;
  description?: string | redacted.Redacted<string>;
  namespaces?: string[];
}
export const UserPreferenceMemoryStrategyInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    namespaces: S.optional(NamespacesList),
  }),
).annotations({
  identifier: "UserPreferenceMemoryStrategyInput",
}) as any as S.Schema<UserPreferenceMemoryStrategyInput>;
export interface DeleteMemoryStrategyInput {
  memoryStrategyId: string;
}
export const DeleteMemoryStrategyInput = S.suspend(() =>
  S.Struct({ memoryStrategyId: S.String }),
).annotations({
  identifier: "DeleteMemoryStrategyInput",
}) as any as S.Schema<DeleteMemoryStrategyInput>;
export type DeleteMemoryStrategiesList = DeleteMemoryStrategyInput[];
export const DeleteMemoryStrategiesList = S.Array(DeleteMemoryStrategyInput);
export interface AgentRuntimeEndpoint {
  name: string | redacted.Redacted<string>;
  liveVersion?: string;
  targetVersion?: string;
  agentRuntimeEndpointArn: string;
  agentRuntimeArn: string;
  status: AgentRuntimeEndpointStatus;
  id: string;
  description?: string;
  createdAt: Date;
  lastUpdatedAt: Date;
}
export const AgentRuntimeEndpoint = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    liveVersion: S.optional(S.String),
    targetVersion: S.optional(S.String),
    agentRuntimeEndpointArn: S.String,
    agentRuntimeArn: S.String,
    status: AgentRuntimeEndpointStatus,
    id: S.String,
    description: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "AgentRuntimeEndpoint",
}) as any as S.Schema<AgentRuntimeEndpoint>;
export type AgentRuntimeEndpoints = AgentRuntimeEndpoint[];
export const AgentRuntimeEndpoints = S.Array(AgentRuntimeEndpoint);
export interface ApiKeyCredentialProviderItem {
  name: string;
  credentialProviderArn: string;
  createdTime: Date;
  lastUpdatedTime: Date;
}
export const ApiKeyCredentialProviderItem = S.suspend(() =>
  S.Struct({
    name: S.String,
    credentialProviderArn: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ApiKeyCredentialProviderItem",
}) as any as S.Schema<ApiKeyCredentialProviderItem>;
export type ApiKeyCredentialProviders = ApiKeyCredentialProviderItem[];
export const ApiKeyCredentialProviders = S.Array(ApiKeyCredentialProviderItem);
export interface RecordingConfig {
  enabled?: boolean;
  s3Location?: S3Location;
}
export const RecordingConfig = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    s3Location: S.optional(S3Location),
  }),
).annotations({
  identifier: "RecordingConfig",
}) as any as S.Schema<RecordingConfig>;
export interface BrowserSigningConfigOutput {
  enabled: boolean;
}
export const BrowserSigningConfigOutput = S.suspend(() =>
  S.Struct({ enabled: S.Boolean }),
).annotations({
  identifier: "BrowserSigningConfigOutput",
}) as any as S.Schema<BrowserSigningConfigOutput>;
export interface BrowserSummary {
  browserId: string;
  browserArn: string;
  name?: string;
  description?: string | redacted.Redacted<string>;
  status: BrowserStatus;
  createdAt: Date;
  lastUpdatedAt?: Date;
}
export const BrowserSummary = S.suspend(() =>
  S.Struct({
    browserId: S.String,
    browserArn: S.String,
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    status: BrowserStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "BrowserSummary",
}) as any as S.Schema<BrowserSummary>;
export type BrowserSummaries = BrowserSummary[];
export const BrowserSummaries = S.Array(BrowserSummary);
export interface CodeInterpreterSummary {
  codeInterpreterId: string;
  codeInterpreterArn: string;
  name?: string;
  description?: string | redacted.Redacted<string>;
  status: CodeInterpreterStatus;
  createdAt: Date;
  lastUpdatedAt?: Date;
}
export const CodeInterpreterSummary = S.suspend(() =>
  S.Struct({
    codeInterpreterId: S.String,
    codeInterpreterArn: S.String,
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    status: CodeInterpreterStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CodeInterpreterSummary",
}) as any as S.Schema<CodeInterpreterSummary>;
export type CodeInterpreterSummaries = CodeInterpreterSummary[];
export const CodeInterpreterSummaries = S.Array(CodeInterpreterSummary);
export interface EvaluatorSummary {
  evaluatorArn: string;
  evaluatorId: string;
  evaluatorName: string;
  description?: string | redacted.Redacted<string>;
  evaluatorType: EvaluatorType;
  level?: EvaluatorLevel;
  status: EvaluatorStatus;
  createdAt: Date;
  updatedAt: Date;
  lockedForModification?: boolean;
}
export const EvaluatorSummary = S.suspend(() =>
  S.Struct({
    evaluatorArn: S.String,
    evaluatorId: S.String,
    evaluatorName: S.String,
    description: S.optional(SensitiveString),
    evaluatorType: EvaluatorType,
    level: S.optional(EvaluatorLevel),
    status: EvaluatorStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lockedForModification: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EvaluatorSummary",
}) as any as S.Schema<EvaluatorSummary>;
export type EvaluatorSummaryList = EvaluatorSummary[];
export const EvaluatorSummaryList = S.Array(EvaluatorSummary);
export interface GatewaySummary {
  gatewayId: string;
  name: string | redacted.Redacted<string>;
  status: GatewayStatus;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  authorizerType: AuthorizerType;
  protocolType: GatewayProtocolType;
}
export const GatewaySummary = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    name: SensitiveString,
    status: GatewayStatus,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    authorizerType: AuthorizerType,
    protocolType: GatewayProtocolType,
  }),
).annotations({
  identifier: "GatewaySummary",
}) as any as S.Schema<GatewaySummary>;
export type GatewaySummaries = GatewaySummary[];
export const GatewaySummaries = S.Array(GatewaySummary);
export interface TargetSummary {
  targetId: string;
  name: string | redacted.Redacted<string>;
  status: TargetStatus;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
}
export const TargetSummary = S.suspend(() =>
  S.Struct({
    targetId: S.String,
    name: SensitiveString,
    status: TargetStatus,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "TargetSummary",
}) as any as S.Schema<TargetSummary>;
export type TargetSummaries = TargetSummary[];
export const TargetSummaries = S.Array(TargetSummary);
export interface GatewayTarget {
  gatewayArn: string;
  targetId: string;
  createdAt: Date;
  updatedAt: Date;
  status: TargetStatus;
  statusReasons?: string[];
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  targetConfiguration: TargetConfiguration;
  credentialProviderConfigurations: CredentialProviderConfiguration[];
  lastSynchronizedAt?: Date;
  metadataConfiguration?: MetadataConfiguration;
}
export const GatewayTarget = S.suspend(() =>
  S.Struct({
    gatewayArn: S.String,
    targetId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: TargetStatus,
    statusReasons: S.optional(StatusReasons),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    targetConfiguration: TargetConfiguration,
    credentialProviderConfigurations: CredentialProviderConfigurations,
    lastSynchronizedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    metadataConfiguration: S.optional(MetadataConfiguration),
  }),
).annotations({
  identifier: "GatewayTarget",
}) as any as S.Schema<GatewayTarget>;
export type GatewayTargetList = GatewayTarget[];
export const GatewayTargetList = S.Array(GatewayTarget);
export interface MemorySummary {
  arn?: string;
  id?: string;
  status?: MemoryStatus;
  createdAt: Date;
  updatedAt: Date;
}
export const MemorySummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    status: S.optional(MemoryStatus),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "MemorySummary",
}) as any as S.Schema<MemorySummary>;
export type MemorySummaryList = MemorySummary[];
export const MemorySummaryList = S.Array(MemorySummary);
export interface Oauth2CredentialProviderItem {
  name: string;
  credentialProviderVendor: CredentialProviderVendorType;
  credentialProviderArn: string;
  createdTime: Date;
  lastUpdatedTime: Date;
}
export const Oauth2CredentialProviderItem = S.suspend(() =>
  S.Struct({
    name: S.String,
    credentialProviderVendor: CredentialProviderVendorType,
    credentialProviderArn: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "Oauth2CredentialProviderItem",
}) as any as S.Schema<Oauth2CredentialProviderItem>;
export type Oauth2CredentialProviders = Oauth2CredentialProviderItem[];
export const Oauth2CredentialProviders = S.Array(Oauth2CredentialProviderItem);
export interface OnlineEvaluationConfigSummary {
  onlineEvaluationConfigArn: string;
  onlineEvaluationConfigId: string;
  onlineEvaluationConfigName: string;
  description?: string | redacted.Redacted<string>;
  status: OnlineEvaluationConfigStatus;
  executionStatus: OnlineEvaluationExecutionStatus;
  createdAt: Date;
  updatedAt: Date;
  failureReason?: string;
}
export const OnlineEvaluationConfigSummary = S.suspend(() =>
  S.Struct({
    onlineEvaluationConfigArn: S.String,
    onlineEvaluationConfigId: S.String,
    onlineEvaluationConfigName: S.String,
    description: S.optional(SensitiveString),
    status: OnlineEvaluationConfigStatus,
    executionStatus: OnlineEvaluationExecutionStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "OnlineEvaluationConfigSummary",
}) as any as S.Schema<OnlineEvaluationConfigSummary>;
export type OnlineEvaluationConfigSummaryList = OnlineEvaluationConfigSummary[];
export const OnlineEvaluationConfigSummaryList = S.Array(
  OnlineEvaluationConfigSummary,
);
export interface PolicyEngine {
  policyEngineId: string;
  name: string;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  policyEngineArn: string;
  status: PolicyEngineStatus;
  statusReasons: string[];
}
export const PolicyEngine = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    policyEngineArn: S.String,
    status: PolicyEngineStatus,
    statusReasons: PolicyStatusReasons,
  }),
).annotations({ identifier: "PolicyEngine" }) as any as S.Schema<PolicyEngine>;
export type PolicyEngines = PolicyEngine[];
export const PolicyEngines = S.Array(PolicyEngine);
export interface PolicyGeneration {
  policyEngineId: string;
  policyGenerationId: string;
  name: string;
  policyGenerationArn: string;
  resource: Resource;
  createdAt: Date;
  updatedAt: Date;
  status: PolicyGenerationStatus;
  statusReasons: string[];
  findings?: string;
}
export const PolicyGeneration = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String,
    policyGenerationId: S.String,
    name: S.String,
    policyGenerationArn: S.String,
    resource: Resource,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: PolicyGenerationStatus,
    statusReasons: PolicyStatusReasons,
    findings: S.optional(S.String),
  }),
).annotations({
  identifier: "PolicyGeneration",
}) as any as S.Schema<PolicyGeneration>;
export type PolicyGenerations = PolicyGeneration[];
export const PolicyGenerations = S.Array(PolicyGeneration);
export interface Policy {
  policyId: string;
  name: string;
  policyEngineId: string;
  definition: PolicyDefinition;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  policyArn: string;
  status: PolicyStatus;
  statusReasons: string[];
}
export const Policy = S.suspend(() =>
  S.Struct({
    policyId: S.String,
    name: S.String,
    policyEngineId: S.String,
    definition: PolicyDefinition,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    policyArn: S.String,
    status: PolicyStatus,
    statusReasons: PolicyStatusReasons,
  }),
).annotations({ identifier: "Policy" }) as any as S.Schema<Policy>;
export type Policies = Policy[];
export const Policies = S.Array(Policy);
export interface WorkloadIdentityType {
  name: string;
  workloadIdentityArn: string;
}
export const WorkloadIdentityType = S.suspend(() =>
  S.Struct({ name: S.String, workloadIdentityArn: S.String }),
).annotations({
  identifier: "WorkloadIdentityType",
}) as any as S.Schema<WorkloadIdentityType>;
export type WorkloadIdentityList = WorkloadIdentityType[];
export const WorkloadIdentityList = S.Array(WorkloadIdentityType);
export interface EpisodicReflectionConfigurationInput {
  namespaces: string[];
}
export const EpisodicReflectionConfigurationInput = S.suspend(() =>
  S.Struct({ namespaces: NamespacesList }),
).annotations({
  identifier: "EpisodicReflectionConfigurationInput",
}) as any as S.Schema<EpisodicReflectionConfigurationInput>;
export type MemoryStrategyType =
  | "SEMANTIC"
  | "SUMMARIZATION"
  | "USER_PREFERENCE"
  | "CUSTOM"
  | "EPISODIC";
export const MemoryStrategyType = S.Literal(
  "SEMANTIC",
  "SUMMARIZATION",
  "USER_PREFERENCE",
  "CUSTOM",
  "EPISODIC",
);
export type MemoryStrategyStatus =
  | "CREATING"
  | "ACTIVE"
  | "DELETING"
  | "FAILED";
export const MemoryStrategyStatus = S.Literal(
  "CREATING",
  "ACTIVE",
  "DELETING",
  "FAILED",
);
export type FindingType =
  | "VALID"
  | "INVALID"
  | "NOT_TRANSLATABLE"
  | "ALLOW_ALL"
  | "ALLOW_NONE"
  | "DENY_ALL"
  | "DENY_NONE";
export const FindingType = S.Literal(
  "VALID",
  "INVALID",
  "NOT_TRANSLATABLE",
  "ALLOW_ALL",
  "ALLOW_NONE",
  "DENY_ALL",
  "DENY_NONE",
);
export interface SetTokenVaultCMKResponse {
  tokenVaultId: string;
  kmsConfiguration: KmsConfiguration;
  lastModifiedDate: Date;
}
export const SetTokenVaultCMKResponse = S.suspend(() =>
  S.Struct({
    tokenVaultId: S.String,
    kmsConfiguration: KmsConfiguration,
    lastModifiedDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "SetTokenVaultCMKResponse",
}) as any as S.Schema<SetTokenVaultCMKResponse>;
export interface ListAgentRuntimeEndpointsResponse {
  runtimeEndpoints: AgentRuntimeEndpoint[];
  nextToken?: string;
}
export const ListAgentRuntimeEndpointsResponse = S.suspend(() =>
  S.Struct({
    runtimeEndpoints: AgentRuntimeEndpoints,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAgentRuntimeEndpointsResponse",
}) as any as S.Schema<ListAgentRuntimeEndpointsResponse>;
export interface GetAgentRuntimeResponse {
  agentRuntimeArn: string;
  agentRuntimeName: string;
  agentRuntimeId: string;
  agentRuntimeVersion: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  roleArn: string;
  networkConfiguration: NetworkConfiguration;
  status: AgentRuntimeStatus;
  lifecycleConfiguration: LifecycleConfiguration;
  failureReason?: string;
  description?: string | redacted.Redacted<string>;
  workloadIdentityDetails?: WorkloadIdentityDetails;
  agentRuntimeArtifact?: AgentRuntimeArtifact;
  protocolConfiguration?: ProtocolConfiguration;
  environmentVariables?: { [key: string]: string };
  authorizerConfiguration?: AuthorizerConfiguration;
  requestHeaderConfiguration?: RequestHeaderConfiguration;
}
export const GetAgentRuntimeResponse = S.suspend(() =>
  S.Struct({
    agentRuntimeArn: S.String,
    agentRuntimeName: S.String,
    agentRuntimeId: S.String,
    agentRuntimeVersion: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    roleArn: S.String,
    networkConfiguration: NetworkConfiguration,
    status: AgentRuntimeStatus,
    lifecycleConfiguration: LifecycleConfiguration,
    failureReason: S.optional(S.String),
    description: S.optional(SensitiveString),
    workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
    agentRuntimeArtifact: S.optional(AgentRuntimeArtifact),
    protocolConfiguration: S.optional(ProtocolConfiguration),
    environmentVariables: S.optional(EnvironmentVariablesMap),
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    requestHeaderConfiguration: S.optional(RequestHeaderConfiguration),
  }),
).annotations({
  identifier: "GetAgentRuntimeResponse",
}) as any as S.Schema<GetAgentRuntimeResponse>;
export interface ListAgentRuntimesResponse {
  agentRuntimes: AgentRuntime[];
  nextToken?: string;
}
export const ListAgentRuntimesResponse = S.suspend(() =>
  S.Struct({ agentRuntimes: AgentRuntimes, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAgentRuntimesResponse",
}) as any as S.Schema<ListAgentRuntimesResponse>;
export interface CreateApiKeyCredentialProviderResponse {
  apiKeySecretArn: Secret;
  name: string;
  credentialProviderArn: string;
}
export const CreateApiKeyCredentialProviderResponse = S.suspend(() =>
  S.Struct({
    apiKeySecretArn: Secret,
    name: S.String,
    credentialProviderArn: S.String,
  }),
).annotations({
  identifier: "CreateApiKeyCredentialProviderResponse",
}) as any as S.Schema<CreateApiKeyCredentialProviderResponse>;
export interface ListApiKeyCredentialProvidersResponse {
  credentialProviders: ApiKeyCredentialProviderItem[];
  nextToken?: string;
}
export const ListApiKeyCredentialProvidersResponse = S.suspend(() =>
  S.Struct({
    credentialProviders: ApiKeyCredentialProviders,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApiKeyCredentialProvidersResponse",
}) as any as S.Schema<ListApiKeyCredentialProvidersResponse>;
export interface CreateBrowserRequest {
  name: string;
  description?: string | redacted.Redacted<string>;
  executionRoleArn?: string;
  networkConfiguration: BrowserNetworkConfiguration;
  recording?: RecordingConfig;
  browserSigning?: BrowserSigningConfigInput;
  clientToken?: string;
  tags?: { [key: string]: string };
}
export const CreateBrowserRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    executionRoleArn: S.optional(S.String),
    networkConfiguration: BrowserNetworkConfiguration,
    recording: S.optional(RecordingConfig),
    browserSigning: S.optional(BrowserSigningConfigInput),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/browsers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBrowserRequest",
}) as any as S.Schema<CreateBrowserRequest>;
export interface GetBrowserResponse {
  browserId: string;
  browserArn: string;
  name: string;
  description?: string | redacted.Redacted<string>;
  executionRoleArn?: string;
  networkConfiguration: BrowserNetworkConfiguration;
  recording?: RecordingConfig;
  browserSigning?: BrowserSigningConfigOutput;
  status: BrowserStatus;
  failureReason?: string;
  createdAt: Date;
  lastUpdatedAt: Date;
}
export const GetBrowserResponse = S.suspend(() =>
  S.Struct({
    browserId: S.String,
    browserArn: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    executionRoleArn: S.optional(S.String),
    networkConfiguration: BrowserNetworkConfiguration,
    recording: S.optional(RecordingConfig),
    browserSigning: S.optional(BrowserSigningConfigOutput),
    status: BrowserStatus,
    failureReason: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetBrowserResponse",
}) as any as S.Schema<GetBrowserResponse>;
export interface ListBrowsersResponse {
  browserSummaries: BrowserSummary[];
  nextToken?: string;
}
export const ListBrowsersResponse = S.suspend(() =>
  S.Struct({
    browserSummaries: BrowserSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBrowsersResponse",
}) as any as S.Schema<ListBrowsersResponse>;
export interface CreateCodeInterpreterResponse {
  codeInterpreterId: string;
  codeInterpreterArn: string;
  createdAt: Date;
  status: CodeInterpreterStatus;
}
export const CreateCodeInterpreterResponse = S.suspend(() =>
  S.Struct({
    codeInterpreterId: S.String,
    codeInterpreterArn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: CodeInterpreterStatus,
  }),
).annotations({
  identifier: "CreateCodeInterpreterResponse",
}) as any as S.Schema<CreateCodeInterpreterResponse>;
export interface ListCodeInterpretersResponse {
  codeInterpreterSummaries: CodeInterpreterSummary[];
  nextToken?: string;
}
export const ListCodeInterpretersResponse = S.suspend(() =>
  S.Struct({
    codeInterpreterSummaries: CodeInterpreterSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCodeInterpretersResponse",
}) as any as S.Schema<ListCodeInterpretersResponse>;
export interface ListEvaluatorsResponse {
  evaluators: EvaluatorSummary[];
  nextToken?: string;
}
export const ListEvaluatorsResponse = S.suspend(() =>
  S.Struct({
    evaluators: EvaluatorSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEvaluatorsResponse",
}) as any as S.Schema<ListEvaluatorsResponse>;
export interface ListGatewaysResponse {
  items: GatewaySummary[];
  nextToken?: string;
}
export const ListGatewaysResponse = S.suspend(() =>
  S.Struct({ items: GatewaySummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListGatewaysResponse",
}) as any as S.Schema<ListGatewaysResponse>;
export interface ListGatewayTargetsResponse {
  items: TargetSummary[];
  nextToken?: string;
}
export const ListGatewayTargetsResponse = S.suspend(() =>
  S.Struct({ items: TargetSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListGatewayTargetsResponse",
}) as any as S.Schema<ListGatewayTargetsResponse>;
export interface SynchronizeGatewayTargetsResponse {
  targets?: GatewayTarget[];
}
export const SynchronizeGatewayTargetsResponse = S.suspend(() =>
  S.Struct({ targets: S.optional(GatewayTargetList) }),
).annotations({
  identifier: "SynchronizeGatewayTargetsResponse",
}) as any as S.Schema<SynchronizeGatewayTargetsResponse>;
export interface ListMemoriesOutput {
  memories: MemorySummary[];
  nextToken?: string;
}
export const ListMemoriesOutput = S.suspend(() =>
  S.Struct({ memories: MemorySummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListMemoriesOutput",
}) as any as S.Schema<ListMemoriesOutput>;
export interface ListOauth2CredentialProvidersResponse {
  credentialProviders: Oauth2CredentialProviderItem[];
  nextToken?: string;
}
export const ListOauth2CredentialProvidersResponse = S.suspend(() =>
  S.Struct({
    credentialProviders: Oauth2CredentialProviders,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOauth2CredentialProvidersResponse",
}) as any as S.Schema<ListOauth2CredentialProvidersResponse>;
export interface ListOnlineEvaluationConfigsResponse {
  onlineEvaluationConfigs: OnlineEvaluationConfigSummary[];
  nextToken?: string;
}
export const ListOnlineEvaluationConfigsResponse = S.suspend(() =>
  S.Struct({
    onlineEvaluationConfigs: OnlineEvaluationConfigSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOnlineEvaluationConfigsResponse",
}) as any as S.Schema<ListOnlineEvaluationConfigsResponse>;
export interface ListPolicyEnginesResponse {
  policyEngines: PolicyEngine[];
  nextToken?: string;
}
export const ListPolicyEnginesResponse = S.suspend(() =>
  S.Struct({ policyEngines: PolicyEngines, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListPolicyEnginesResponse",
}) as any as S.Schema<ListPolicyEnginesResponse>;
export interface StartPolicyGenerationResponse {
  policyEngineId: string;
  policyGenerationId: string;
  name: string;
  policyGenerationArn: string;
  resource: Resource;
  createdAt: Date;
  updatedAt: Date;
  status: PolicyGenerationStatus;
  statusReasons: string[];
  findings?: string;
}
export const StartPolicyGenerationResponse = S.suspend(() =>
  S.Struct({
    policyEngineId: S.String,
    policyGenerationId: S.String,
    name: S.String,
    policyGenerationArn: S.String,
    resource: Resource,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: PolicyGenerationStatus,
    statusReasons: PolicyStatusReasons,
    findings: S.optional(S.String),
  }),
).annotations({
  identifier: "StartPolicyGenerationResponse",
}) as any as S.Schema<StartPolicyGenerationResponse>;
export interface ListPolicyGenerationsResponse {
  policyGenerations: PolicyGeneration[];
  nextToken?: string;
}
export const ListPolicyGenerationsResponse = S.suspend(() =>
  S.Struct({
    policyGenerations: PolicyGenerations,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPolicyGenerationsResponse",
}) as any as S.Schema<ListPolicyGenerationsResponse>;
export interface CreatePolicyRequest {
  name: string;
  definition: PolicyDefinition;
  description?: string | redacted.Redacted<string>;
  validationMode?: PolicyValidationMode;
  policyEngineId: string;
  clientToken?: string;
}
export const CreatePolicyRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    definition: PolicyDefinition,
    description: S.optional(SensitiveString),
    validationMode: S.optional(PolicyValidationMode),
    policyEngineId: S.String.pipe(T.HttpLabel("policyEngineId")),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreatePolicyRequest",
}) as any as S.Schema<CreatePolicyRequest>;
export interface ListPoliciesResponse {
  policies: Policy[];
  nextToken?: string;
}
export const ListPoliciesResponse = S.suspend(() =>
  S.Struct({ policies: Policies, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListPoliciesResponse",
}) as any as S.Schema<ListPoliciesResponse>;
export interface ListWorkloadIdentitiesResponse {
  workloadIdentities: WorkloadIdentityType[];
  nextToken?: string;
}
export const ListWorkloadIdentitiesResponse = S.suspend(() =>
  S.Struct({
    workloadIdentities: WorkloadIdentityList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkloadIdentitiesResponse",
}) as any as S.Schema<ListWorkloadIdentitiesResponse>;
export interface EpisodicMemoryStrategyInput {
  name: string;
  description?: string | redacted.Redacted<string>;
  namespaces?: string[];
  reflectionConfiguration?: EpisodicReflectionConfigurationInput;
}
export const EpisodicMemoryStrategyInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    namespaces: S.optional(NamespacesList),
    reflectionConfiguration: S.optional(EpisodicReflectionConfigurationInput),
  }),
).annotations({
  identifier: "EpisodicMemoryStrategyInput",
}) as any as S.Schema<EpisodicMemoryStrategyInput>;
export interface CloudWatchOutputConfig {
  logGroupName: string;
}
export const CloudWatchOutputConfig = S.suspend(() =>
  S.Struct({ logGroupName: S.String }),
).annotations({
  identifier: "CloudWatchOutputConfig",
}) as any as S.Schema<CloudWatchOutputConfig>;
export interface Finding {
  type?: FindingType;
  description?: string;
}
export const Finding = S.suspend(() =>
  S.Struct({
    type: S.optional(FindingType),
    description: S.optional(S.String),
  }),
).annotations({ identifier: "Finding" }) as any as S.Schema<Finding>;
export type Findings = Finding[];
export const Findings = S.Array(Finding);
export type OverrideType =
  | "SEMANTIC_OVERRIDE"
  | "SUMMARY_OVERRIDE"
  | "USER_PREFERENCE_OVERRIDE"
  | "SELF_MANAGED"
  | "EPISODIC_OVERRIDE";
export const OverrideType = S.Literal(
  "SEMANTIC_OVERRIDE",
  "SUMMARY_OVERRIDE",
  "USER_PREFERENCE_OVERRIDE",
  "SELF_MANAGED",
  "EPISODIC_OVERRIDE",
);
export interface OutputConfig {
  cloudWatchConfig: CloudWatchOutputConfig;
}
export const OutputConfig = S.suspend(() =>
  S.Struct({ cloudWatchConfig: CloudWatchOutputConfig }),
).annotations({ identifier: "OutputConfig" }) as any as S.Schema<OutputConfig>;
export interface PolicyGenerationAsset {
  policyGenerationAssetId: string;
  definition?: PolicyDefinition;
  rawTextFragment: string;
  findings: Finding[];
}
export const PolicyGenerationAsset = S.suspend(() =>
  S.Struct({
    policyGenerationAssetId: S.String,
    definition: S.optional(PolicyDefinition),
    rawTextFragment: S.String,
    findings: Findings,
  }),
).annotations({
  identifier: "PolicyGenerationAsset",
}) as any as S.Schema<PolicyGenerationAsset>;
export type PolicyGenerationAssets = PolicyGenerationAsset[];
export const PolicyGenerationAssets = S.Array(PolicyGenerationAsset);
export interface CreateBrowserResponse {
  browserId: string;
  browserArn: string;
  createdAt: Date;
  status: BrowserStatus;
}
export const CreateBrowserResponse = S.suspend(() =>
  S.Struct({
    browserId: S.String,
    browserArn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: BrowserStatus,
  }),
).annotations({
  identifier: "CreateBrowserResponse",
}) as any as S.Schema<CreateBrowserResponse>;
export interface CreateGatewayRequest {
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  clientToken?: string;
  roleArn: string;
  protocolType: GatewayProtocolType;
  protocolConfiguration?: GatewayProtocolConfiguration;
  authorizerType: AuthorizerType;
  authorizerConfiguration?: AuthorizerConfiguration;
  kmsKeyArn?: string;
  interceptorConfigurations?: GatewayInterceptorConfiguration[];
  policyEngineConfiguration?: GatewayPolicyEngineConfiguration;
  exceptionLevel?: ExceptionLevel;
  tags?: { [key: string]: string };
}
export const CreateGatewayRequest = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(SensitiveString),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    roleArn: S.String,
    protocolType: GatewayProtocolType,
    protocolConfiguration: S.optional(GatewayProtocolConfiguration),
    authorizerType: AuthorizerType,
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    kmsKeyArn: S.optional(S.String),
    interceptorConfigurations: S.optional(GatewayInterceptorConfigurations),
    policyEngineConfiguration: S.optional(GatewayPolicyEngineConfiguration),
    exceptionLevel: S.optional(ExceptionLevel),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/gateways/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGatewayRequest",
}) as any as S.Schema<CreateGatewayRequest>;
export interface SemanticOverrideExtractionConfigurationInput {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const SemanticOverrideExtractionConfigurationInput = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "SemanticOverrideExtractionConfigurationInput",
}) as any as S.Schema<SemanticOverrideExtractionConfigurationInput>;
export interface SemanticOverrideConsolidationConfigurationInput {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const SemanticOverrideConsolidationConfigurationInput = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "SemanticOverrideConsolidationConfigurationInput",
}) as any as S.Schema<SemanticOverrideConsolidationConfigurationInput>;
export interface SummaryOverrideConsolidationConfigurationInput {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const SummaryOverrideConsolidationConfigurationInput = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "SummaryOverrideConsolidationConfigurationInput",
}) as any as S.Schema<SummaryOverrideConsolidationConfigurationInput>;
export interface UserPreferenceOverrideExtractionConfigurationInput {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const UserPreferenceOverrideExtractionConfigurationInput = S.suspend(
  () => S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "UserPreferenceOverrideExtractionConfigurationInput",
}) as any as S.Schema<UserPreferenceOverrideExtractionConfigurationInput>;
export interface UserPreferenceOverrideConsolidationConfigurationInput {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const UserPreferenceOverrideConsolidationConfigurationInput = S.suspend(
  () => S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "UserPreferenceOverrideConsolidationConfigurationInput",
}) as any as S.Schema<UserPreferenceOverrideConsolidationConfigurationInput>;
export interface EpisodicOverrideExtractionConfigurationInput {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const EpisodicOverrideExtractionConfigurationInput = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "EpisodicOverrideExtractionConfigurationInput",
}) as any as S.Schema<EpisodicOverrideExtractionConfigurationInput>;
export interface EpisodicOverrideConsolidationConfigurationInput {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const EpisodicOverrideConsolidationConfigurationInput = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "EpisodicOverrideConsolidationConfigurationInput",
}) as any as S.Schema<EpisodicOverrideConsolidationConfigurationInput>;
export interface EpisodicOverrideReflectionConfigurationInput {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
  namespaces?: string[];
}
export const EpisodicOverrideReflectionConfigurationInput = S.suspend(() =>
  S.Struct({
    appendToPrompt: SensitiveString,
    modelId: S.String,
    namespaces: S.optional(NamespacesList),
  }),
).annotations({
  identifier: "EpisodicOverrideReflectionConfigurationInput",
}) as any as S.Schema<EpisodicOverrideReflectionConfigurationInput>;
export interface InvocationConfigurationInput {
  topicArn: string;
  payloadDeliveryBucketName: string;
}
export const InvocationConfigurationInput = S.suspend(() =>
  S.Struct({ topicArn: S.String, payloadDeliveryBucketName: S.String }),
).annotations({
  identifier: "InvocationConfigurationInput",
}) as any as S.Schema<InvocationConfigurationInput>;
export type CustomExtractionConfigurationInput =
  | { semanticExtractionOverride: SemanticOverrideExtractionConfigurationInput }
  | {
      userPreferenceExtractionOverride: UserPreferenceOverrideExtractionConfigurationInput;
    }
  | {
      episodicExtractionOverride: EpisodicOverrideExtractionConfigurationInput;
    };
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
export type CustomConsolidationConfigurationInput =
  | {
      semanticConsolidationOverride: SemanticOverrideConsolidationConfigurationInput;
    }
  | {
      summaryConsolidationOverride: SummaryOverrideConsolidationConfigurationInput;
    }
  | {
      userPreferenceConsolidationOverride: UserPreferenceOverrideConsolidationConfigurationInput;
    }
  | {
      episodicConsolidationOverride: EpisodicOverrideConsolidationConfigurationInput;
    };
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
export type CustomReflectionConfigurationInput = {
  episodicReflectionOverride: EpisodicOverrideReflectionConfigurationInput;
};
export const CustomReflectionConfigurationInput = S.Union(
  S.Struct({
    episodicReflectionOverride: EpisodicOverrideReflectionConfigurationInput,
  }),
);
export interface ModifyInvocationConfigurationInput {
  topicArn?: string;
  payloadDeliveryBucketName?: string;
}
export const ModifyInvocationConfigurationInput = S.suspend(() =>
  S.Struct({
    topicArn: S.optional(S.String),
    payloadDeliveryBucketName: S.optional(S.String),
  }),
).annotations({
  identifier: "ModifyInvocationConfigurationInput",
}) as any as S.Schema<ModifyInvocationConfigurationInput>;
export interface GetOauth2CredentialProviderResponse {
  clientSecretArn: Secret;
  name: string;
  credentialProviderArn: string;
  credentialProviderVendor: CredentialProviderVendorType;
  callbackUrl?: string;
  oauth2ProviderConfigOutput: Oauth2ProviderConfigOutput;
  createdTime: Date;
  lastUpdatedTime: Date;
}
export const GetOauth2CredentialProviderResponse = S.suspend(() =>
  S.Struct({
    clientSecretArn: Secret,
    name: S.String,
    credentialProviderArn: S.String,
    credentialProviderVendor: CredentialProviderVendorType,
    callbackUrl: S.optional(S.String),
    oauth2ProviderConfigOutput: Oauth2ProviderConfigOutput,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetOauth2CredentialProviderResponse",
}) as any as S.Schema<GetOauth2CredentialProviderResponse>;
export interface CreateOnlineEvaluationConfigRequest {
  clientToken?: string;
  onlineEvaluationConfigName: string;
  description?: string | redacted.Redacted<string>;
  rule: Rule;
  dataSourceConfig: DataSourceConfig;
  evaluators: EvaluatorReference[];
  evaluationExecutionRoleArn: string;
  enableOnCreate: boolean;
}
export const CreateOnlineEvaluationConfigRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    onlineEvaluationConfigName: S.String,
    description: S.optional(SensitiveString),
    rule: Rule,
    dataSourceConfig: DataSourceConfig,
    evaluators: EvaluatorList,
    evaluationExecutionRoleArn: S.String,
    enableOnCreate: S.Boolean,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/online-evaluation-configs/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOnlineEvaluationConfigRequest",
}) as any as S.Schema<CreateOnlineEvaluationConfigRequest>;
export interface GetOnlineEvaluationConfigResponse {
  onlineEvaluationConfigArn: string;
  onlineEvaluationConfigId: string;
  onlineEvaluationConfigName: string;
  description?: string | redacted.Redacted<string>;
  rule: Rule;
  dataSourceConfig: DataSourceConfig;
  evaluators: EvaluatorReference[];
  outputConfig?: OutputConfig;
  evaluationExecutionRoleArn?: string;
  status: OnlineEvaluationConfigStatus;
  executionStatus: OnlineEvaluationExecutionStatus;
  createdAt: Date;
  updatedAt: Date;
  failureReason?: string;
}
export const GetOnlineEvaluationConfigResponse = S.suspend(() =>
  S.Struct({
    onlineEvaluationConfigArn: S.String,
    onlineEvaluationConfigId: S.String,
    onlineEvaluationConfigName: S.String,
    description: S.optional(SensitiveString),
    rule: Rule,
    dataSourceConfig: DataSourceConfig,
    evaluators: EvaluatorList,
    outputConfig: S.optional(OutputConfig),
    evaluationExecutionRoleArn: S.optional(S.String),
    status: OnlineEvaluationConfigStatus,
    executionStatus: OnlineEvaluationExecutionStatus,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GetOnlineEvaluationConfigResponse",
}) as any as S.Schema<GetOnlineEvaluationConfigResponse>;
export interface ListPolicyGenerationAssetsResponse {
  policyGenerationAssets?: PolicyGenerationAsset[];
  nextToken?: string;
}
export const ListPolicyGenerationAssetsResponse = S.suspend(() =>
  S.Struct({
    policyGenerationAssets: S.optional(PolicyGenerationAssets),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPolicyGenerationAssetsResponse",
}) as any as S.Schema<ListPolicyGenerationAssetsResponse>;
export interface CreatePolicyResponse {
  policyId: string;
  name: string;
  policyEngineId: string;
  definition: PolicyDefinition;
  description?: string | redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
  policyArn: string;
  status: PolicyStatus;
  statusReasons: string[];
}
export const CreatePolicyResponse = S.suspend(() =>
  S.Struct({
    policyId: S.String,
    name: S.String,
    policyEngineId: S.String,
    definition: PolicyDefinition,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    policyArn: S.String,
    status: PolicyStatus,
    statusReasons: PolicyStatusReasons,
  }),
).annotations({
  identifier: "CreatePolicyResponse",
}) as any as S.Schema<CreatePolicyResponse>;
export interface SemanticOverrideConfigurationInput {
  extraction?: SemanticOverrideExtractionConfigurationInput;
  consolidation?: SemanticOverrideConsolidationConfigurationInput;
}
export const SemanticOverrideConfigurationInput = S.suspend(() =>
  S.Struct({
    extraction: S.optional(SemanticOverrideExtractionConfigurationInput),
    consolidation: S.optional(SemanticOverrideConsolidationConfigurationInput),
  }),
).annotations({
  identifier: "SemanticOverrideConfigurationInput",
}) as any as S.Schema<SemanticOverrideConfigurationInput>;
export interface SummaryOverrideConfigurationInput {
  consolidation?: SummaryOverrideConsolidationConfigurationInput;
}
export const SummaryOverrideConfigurationInput = S.suspend(() =>
  S.Struct({
    consolidation: S.optional(SummaryOverrideConsolidationConfigurationInput),
  }),
).annotations({
  identifier: "SummaryOverrideConfigurationInput",
}) as any as S.Schema<SummaryOverrideConfigurationInput>;
export interface UserPreferenceOverrideConfigurationInput {
  extraction?: UserPreferenceOverrideExtractionConfigurationInput;
  consolidation?: UserPreferenceOverrideConsolidationConfigurationInput;
}
export const UserPreferenceOverrideConfigurationInput = S.suspend(() =>
  S.Struct({
    extraction: S.optional(UserPreferenceOverrideExtractionConfigurationInput),
    consolidation: S.optional(
      UserPreferenceOverrideConsolidationConfigurationInput,
    ),
  }),
).annotations({
  identifier: "UserPreferenceOverrideConfigurationInput",
}) as any as S.Schema<UserPreferenceOverrideConfigurationInput>;
export interface EpisodicOverrideConfigurationInput {
  extraction?: EpisodicOverrideExtractionConfigurationInput;
  consolidation?: EpisodicOverrideConsolidationConfigurationInput;
  reflection?: EpisodicOverrideReflectionConfigurationInput;
}
export const EpisodicOverrideConfigurationInput = S.suspend(() =>
  S.Struct({
    extraction: S.optional(EpisodicOverrideExtractionConfigurationInput),
    consolidation: S.optional(EpisodicOverrideConsolidationConfigurationInput),
    reflection: S.optional(EpisodicOverrideReflectionConfigurationInput),
  }),
).annotations({
  identifier: "EpisodicOverrideConfigurationInput",
}) as any as S.Schema<EpisodicOverrideConfigurationInput>;
export type ModifyExtractionConfiguration = {
  customExtractionConfiguration: CustomExtractionConfigurationInput;
};
export const ModifyExtractionConfiguration = S.Union(
  S.Struct({
    customExtractionConfiguration: CustomExtractionConfigurationInput,
  }),
);
export type ModifyConsolidationConfiguration = {
  customConsolidationConfiguration: CustomConsolidationConfigurationInput;
};
export const ModifyConsolidationConfiguration = S.Union(
  S.Struct({
    customConsolidationConfiguration: CustomConsolidationConfigurationInput,
  }),
);
export type ModifyReflectionConfiguration =
  | { episodicReflectionConfiguration: EpisodicReflectionConfigurationInput }
  | { customReflectionConfiguration: CustomReflectionConfigurationInput };
export const ModifyReflectionConfiguration = S.Union(
  S.Struct({
    episodicReflectionConfiguration: EpisodicReflectionConfigurationInput,
  }),
  S.Struct({
    customReflectionConfiguration: CustomReflectionConfigurationInput,
  }),
);
export interface MessageBasedTriggerInput {
  messageCount?: number;
}
export const MessageBasedTriggerInput = S.suspend(() =>
  S.Struct({ messageCount: S.optional(S.Number) }),
).annotations({
  identifier: "MessageBasedTriggerInput",
}) as any as S.Schema<MessageBasedTriggerInput>;
export interface TokenBasedTriggerInput {
  tokenCount?: number;
}
export const TokenBasedTriggerInput = S.suspend(() =>
  S.Struct({ tokenCount: S.optional(S.Number) }),
).annotations({
  identifier: "TokenBasedTriggerInput",
}) as any as S.Schema<TokenBasedTriggerInput>;
export interface TimeBasedTriggerInput {
  idleSessionTimeout?: number;
}
export const TimeBasedTriggerInput = S.suspend(() =>
  S.Struct({ idleSessionTimeout: S.optional(S.Number) }),
).annotations({
  identifier: "TimeBasedTriggerInput",
}) as any as S.Schema<TimeBasedTriggerInput>;
export type TriggerConditionInput =
  | { messageBasedTrigger: MessageBasedTriggerInput }
  | { tokenBasedTrigger: TokenBasedTriggerInput }
  | { timeBasedTrigger: TimeBasedTriggerInput };
export const TriggerConditionInput = S.Union(
  S.Struct({ messageBasedTrigger: MessageBasedTriggerInput }),
  S.Struct({ tokenBasedTrigger: TokenBasedTriggerInput }),
  S.Struct({ timeBasedTrigger: TimeBasedTriggerInput }),
);
export type TriggerConditionInputList = TriggerConditionInput[];
export const TriggerConditionInputList = S.Array(TriggerConditionInput);
export interface ModifySelfManagedConfiguration {
  triggerConditions?: TriggerConditionInput[];
  invocationConfiguration?: ModifyInvocationConfigurationInput;
  historicalContextWindowSize?: number;
}
export const ModifySelfManagedConfiguration = S.suspend(() =>
  S.Struct({
    triggerConditions: S.optional(TriggerConditionInputList),
    invocationConfiguration: S.optional(ModifyInvocationConfigurationInput),
    historicalContextWindowSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "ModifySelfManagedConfiguration",
}) as any as S.Schema<ModifySelfManagedConfiguration>;
export type ValidationExceptionReason =
  | "CannotParse"
  | "FieldValidationFailed"
  | "IdempotentParameterMismatchException"
  | "EventInOtherSession"
  | "ResourceConflict";
export const ValidationExceptionReason = S.Literal(
  "CannotParse",
  "FieldValidationFailed",
  "IdempotentParameterMismatchException",
  "EventInOtherSession",
  "ResourceConflict",
);
export interface ModifyStrategyConfiguration {
  extraction?: ModifyExtractionConfiguration;
  consolidation?: ModifyConsolidationConfiguration;
  reflection?: ModifyReflectionConfiguration;
  selfManagedConfiguration?: ModifySelfManagedConfiguration;
}
export const ModifyStrategyConfiguration = S.suspend(() =>
  S.Struct({
    extraction: S.optional(ModifyExtractionConfiguration),
    consolidation: S.optional(ModifyConsolidationConfiguration),
    reflection: S.optional(ModifyReflectionConfiguration),
    selfManagedConfiguration: S.optional(ModifySelfManagedConfiguration),
  }),
).annotations({
  identifier: "ModifyStrategyConfiguration",
}) as any as S.Schema<ModifyStrategyConfiguration>;
export interface CreateGatewayResponse {
  gatewayArn: string;
  gatewayId: string;
  gatewayUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  status: GatewayStatus;
  statusReasons?: string[];
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  roleArn?: string;
  protocolType: GatewayProtocolType;
  protocolConfiguration?: GatewayProtocolConfiguration;
  authorizerType: AuthorizerType;
  authorizerConfiguration?: AuthorizerConfiguration;
  kmsKeyArn?: string;
  interceptorConfigurations?: GatewayInterceptorConfiguration[];
  policyEngineConfiguration?: GatewayPolicyEngineConfiguration;
  workloadIdentityDetails?: WorkloadIdentityDetails;
  exceptionLevel?: ExceptionLevel;
}
export const CreateGatewayResponse = S.suspend(() =>
  S.Struct({
    gatewayArn: S.String,
    gatewayId: S.String,
    gatewayUrl: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: GatewayStatus,
    statusReasons: S.optional(StatusReasons),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    roleArn: S.optional(S.String),
    protocolType: GatewayProtocolType,
    protocolConfiguration: S.optional(GatewayProtocolConfiguration),
    authorizerType: AuthorizerType,
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    kmsKeyArn: S.optional(S.String),
    interceptorConfigurations: S.optional(GatewayInterceptorConfigurations),
    policyEngineConfiguration: S.optional(GatewayPolicyEngineConfiguration),
    workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
    exceptionLevel: S.optional(ExceptionLevel),
  }),
).annotations({
  identifier: "CreateGatewayResponse",
}) as any as S.Schema<CreateGatewayResponse>;
export interface EpisodicReflectionConfiguration {
  namespaces: string[];
}
export const EpisodicReflectionConfiguration = S.suspend(() =>
  S.Struct({ namespaces: NamespacesList }),
).annotations({
  identifier: "EpisodicReflectionConfiguration",
}) as any as S.Schema<EpisodicReflectionConfiguration>;
export interface InvocationConfiguration {
  topicArn: string;
  payloadDeliveryBucketName: string;
}
export const InvocationConfiguration = S.suspend(() =>
  S.Struct({ topicArn: S.String, payloadDeliveryBucketName: S.String }),
).annotations({
  identifier: "InvocationConfiguration",
}) as any as S.Schema<InvocationConfiguration>;
export interface CreateOauth2CredentialProviderRequest {
  name: string;
  credentialProviderVendor: CredentialProviderVendorType;
  oauth2ProviderConfigInput: Oauth2ProviderConfigInput;
  tags?: { [key: string]: string };
}
export const CreateOauth2CredentialProviderRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    credentialProviderVendor: CredentialProviderVendorType,
    oauth2ProviderConfigInput: Oauth2ProviderConfigInput,
    tags: S.optional(TagsMap),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateOauth2CredentialProviderRequest",
}) as any as S.Schema<CreateOauth2CredentialProviderRequest>;
export interface CreateOnlineEvaluationConfigResponse {
  onlineEvaluationConfigArn: string;
  onlineEvaluationConfigId: string;
  createdAt: Date;
  outputConfig?: OutputConfig;
  status: OnlineEvaluationConfigStatus;
  executionStatus: OnlineEvaluationExecutionStatus;
  failureReason?: string;
}
export const CreateOnlineEvaluationConfigResponse = S.suspend(() =>
  S.Struct({
    onlineEvaluationConfigArn: S.String,
    onlineEvaluationConfigId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    outputConfig: S.optional(OutputConfig),
    status: OnlineEvaluationConfigStatus,
    executionStatus: OnlineEvaluationExecutionStatus,
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateOnlineEvaluationConfigResponse",
}) as any as S.Schema<CreateOnlineEvaluationConfigResponse>;
export type SchemaProperties = { [key: string]: SchemaDefinition };
export const SchemaProperties = S.Record({
  key: S.String,
  value: S.suspend(
    (): S.Schema<SchemaDefinition, any> => SchemaDefinition,
  ).annotations({ identifier: "SchemaDefinition" }),
}) as any as S.Schema<SchemaProperties>;
export interface ModifyMemoryStrategyInput {
  memoryStrategyId: string;
  description?: string | redacted.Redacted<string>;
  namespaces?: string[];
  configuration?: ModifyStrategyConfiguration;
}
export const ModifyMemoryStrategyInput = S.suspend(() =>
  S.Struct({
    memoryStrategyId: S.String,
    description: S.optional(SensitiveString),
    namespaces: S.optional(NamespacesList),
    configuration: S.optional(ModifyStrategyConfiguration),
  }),
).annotations({
  identifier: "ModifyMemoryStrategyInput",
}) as any as S.Schema<ModifyMemoryStrategyInput>;
export type ModifyMemoryStrategiesList = ModifyMemoryStrategyInput[];
export const ModifyMemoryStrategiesList = S.Array(ModifyMemoryStrategyInput);
export interface SelfManagedConfigurationInput {
  triggerConditions?: TriggerConditionInput[];
  invocationConfiguration: InvocationConfigurationInput;
  historicalContextWindowSize?: number;
}
export const SelfManagedConfigurationInput = S.suspend(() =>
  S.Struct({
    triggerConditions: S.optional(TriggerConditionInputList),
    invocationConfiguration: InvocationConfigurationInput,
    historicalContextWindowSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "SelfManagedConfigurationInput",
}) as any as S.Schema<SelfManagedConfigurationInput>;
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
export interface SemanticExtractionOverride {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const SemanticExtractionOverride = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "SemanticExtractionOverride",
}) as any as S.Schema<SemanticExtractionOverride>;
export interface UserPreferenceExtractionOverride {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const UserPreferenceExtractionOverride = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "UserPreferenceExtractionOverride",
}) as any as S.Schema<UserPreferenceExtractionOverride>;
export interface EpisodicExtractionOverride {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const EpisodicExtractionOverride = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "EpisodicExtractionOverride",
}) as any as S.Schema<EpisodicExtractionOverride>;
export interface SemanticConsolidationOverride {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const SemanticConsolidationOverride = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "SemanticConsolidationOverride",
}) as any as S.Schema<SemanticConsolidationOverride>;
export interface SummaryConsolidationOverride {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const SummaryConsolidationOverride = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "SummaryConsolidationOverride",
}) as any as S.Schema<SummaryConsolidationOverride>;
export interface UserPreferenceConsolidationOverride {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const UserPreferenceConsolidationOverride = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "UserPreferenceConsolidationOverride",
}) as any as S.Schema<UserPreferenceConsolidationOverride>;
export interface EpisodicConsolidationOverride {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
}
export const EpisodicConsolidationOverride = S.suspend(() =>
  S.Struct({ appendToPrompt: SensitiveString, modelId: S.String }),
).annotations({
  identifier: "EpisodicConsolidationOverride",
}) as any as S.Schema<EpisodicConsolidationOverride>;
export interface EpisodicReflectionOverride {
  appendToPrompt: string | redacted.Redacted<string>;
  modelId: string;
  namespaces?: string[];
}
export const EpisodicReflectionOverride = S.suspend(() =>
  S.Struct({
    appendToPrompt: SensitiveString,
    modelId: S.String,
    namespaces: S.optional(NamespacesList),
  }),
).annotations({
  identifier: "EpisodicReflectionOverride",
}) as any as S.Schema<EpisodicReflectionOverride>;
export interface MessageBasedTrigger {
  messageCount?: number;
}
export const MessageBasedTrigger = S.suspend(() =>
  S.Struct({ messageCount: S.optional(S.Number) }),
).annotations({
  identifier: "MessageBasedTrigger",
}) as any as S.Schema<MessageBasedTrigger>;
export interface TokenBasedTrigger {
  tokenCount?: number;
}
export const TokenBasedTrigger = S.suspend(() =>
  S.Struct({ tokenCount: S.optional(S.Number) }),
).annotations({
  identifier: "TokenBasedTrigger",
}) as any as S.Schema<TokenBasedTrigger>;
export interface TimeBasedTrigger {
  idleSessionTimeout?: number;
}
export const TimeBasedTrigger = S.suspend(() =>
  S.Struct({ idleSessionTimeout: S.optional(S.Number) }),
).annotations({
  identifier: "TimeBasedTrigger",
}) as any as S.Schema<TimeBasedTrigger>;
export type CustomConfigurationInput =
  | { semanticOverride: SemanticOverrideConfigurationInput }
  | { summaryOverride: SummaryOverrideConfigurationInput }
  | { userPreferenceOverride: UserPreferenceOverrideConfigurationInput }
  | { episodicOverride: EpisodicOverrideConfigurationInput }
  | { selfManagedConfiguration: SelfManagedConfigurationInput };
export const CustomConfigurationInput = S.Union(
  S.Struct({ semanticOverride: SemanticOverrideConfigurationInput }),
  S.Struct({ summaryOverride: SummaryOverrideConfigurationInput }),
  S.Struct({
    userPreferenceOverride: UserPreferenceOverrideConfigurationInput,
  }),
  S.Struct({ episodicOverride: EpisodicOverrideConfigurationInput }),
  S.Struct({ selfManagedConfiguration: SelfManagedConfigurationInput }),
);
export interface CustomMemoryStrategyInput {
  name: string;
  description?: string | redacted.Redacted<string>;
  namespaces?: string[];
  configuration?: CustomConfigurationInput;
}
export const CustomMemoryStrategyInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    namespaces: S.optional(NamespacesList),
    configuration: S.optional(CustomConfigurationInput),
  }),
).annotations({
  identifier: "CustomMemoryStrategyInput",
}) as any as S.Schema<CustomMemoryStrategyInput>;
export type MemoryStrategyInput =
  | { semanticMemoryStrategy: SemanticMemoryStrategyInput }
  | { summaryMemoryStrategy: SummaryMemoryStrategyInput }
  | { userPreferenceMemoryStrategy: UserPreferenceMemoryStrategyInput }
  | { customMemoryStrategy: CustomMemoryStrategyInput }
  | { episodicMemoryStrategy: EpisodicMemoryStrategyInput };
export const MemoryStrategyInput = S.Union(
  S.Struct({ semanticMemoryStrategy: SemanticMemoryStrategyInput }),
  S.Struct({ summaryMemoryStrategy: SummaryMemoryStrategyInput }),
  S.Struct({ userPreferenceMemoryStrategy: UserPreferenceMemoryStrategyInput }),
  S.Struct({ customMemoryStrategy: CustomMemoryStrategyInput }),
  S.Struct({ episodicMemoryStrategy: EpisodicMemoryStrategyInput }),
);
export type MemoryStrategyInputList = MemoryStrategyInput[];
export const MemoryStrategyInputList = S.Array(MemoryStrategyInput);
export interface ModifyMemoryStrategies {
  addMemoryStrategies?: MemoryStrategyInput[];
  modifyMemoryStrategies?: ModifyMemoryStrategyInput[];
  deleteMemoryStrategies?: DeleteMemoryStrategyInput[];
}
export const ModifyMemoryStrategies = S.suspend(() =>
  S.Struct({
    addMemoryStrategies: S.optional(MemoryStrategyInputList),
    modifyMemoryStrategies: S.optional(ModifyMemoryStrategiesList),
    deleteMemoryStrategies: S.optional(DeleteMemoryStrategiesList),
  }),
).annotations({
  identifier: "ModifyMemoryStrategies",
}) as any as S.Schema<ModifyMemoryStrategies>;
export interface CreateAgentRuntimeRequest {
  agentRuntimeName: string;
  agentRuntimeArtifact: AgentRuntimeArtifact;
  roleArn: string;
  networkConfiguration: NetworkConfiguration;
  clientToken?: string;
  description?: string | redacted.Redacted<string>;
  authorizerConfiguration?: AuthorizerConfiguration;
  requestHeaderConfiguration?: RequestHeaderConfiguration;
  protocolConfiguration?: ProtocolConfiguration;
  lifecycleConfiguration?: LifecycleConfiguration;
  environmentVariables?: { [key: string]: string };
  tags?: { [key: string]: string };
}
export const CreateAgentRuntimeRequest = S.suspend(() =>
  S.Struct({
    agentRuntimeName: S.String,
    agentRuntimeArtifact: AgentRuntimeArtifact,
    roleArn: S.String,
    networkConfiguration: NetworkConfiguration,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    description: S.optional(SensitiveString),
    authorizerConfiguration: S.optional(AuthorizerConfiguration),
    requestHeaderConfiguration: S.optional(RequestHeaderConfiguration),
    protocolConfiguration: S.optional(ProtocolConfiguration),
    lifecycleConfiguration: S.optional(LifecycleConfiguration),
    environmentVariables: S.optional(EnvironmentVariablesMap),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/runtimes/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAgentRuntimeRequest",
}) as any as S.Schema<CreateAgentRuntimeRequest>;
export interface CreateEvaluatorRequest {
  clientToken?: string;
  evaluatorName: string;
  description?: string | redacted.Redacted<string>;
  evaluatorConfig: EvaluatorConfig;
  level: EvaluatorLevel;
}
export const CreateEvaluatorRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    evaluatorName: S.String,
    description: S.optional(SensitiveString),
    evaluatorConfig: EvaluatorConfig,
    level: EvaluatorLevel,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/evaluators/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEvaluatorRequest",
}) as any as S.Schema<CreateEvaluatorRequest>;
export type CustomExtractionConfiguration =
  | { semanticExtractionOverride: SemanticExtractionOverride }
  | { userPreferenceExtractionOverride: UserPreferenceExtractionOverride }
  | { episodicExtractionOverride: EpisodicExtractionOverride };
export const CustomExtractionConfiguration = S.Union(
  S.Struct({ semanticExtractionOverride: SemanticExtractionOverride }),
  S.Struct({
    userPreferenceExtractionOverride: UserPreferenceExtractionOverride,
  }),
  S.Struct({ episodicExtractionOverride: EpisodicExtractionOverride }),
);
export type CustomConsolidationConfiguration =
  | { semanticConsolidationOverride: SemanticConsolidationOverride }
  | { summaryConsolidationOverride: SummaryConsolidationOverride }
  | { userPreferenceConsolidationOverride: UserPreferenceConsolidationOverride }
  | { episodicConsolidationOverride: EpisodicConsolidationOverride };
export const CustomConsolidationConfiguration = S.Union(
  S.Struct({ semanticConsolidationOverride: SemanticConsolidationOverride }),
  S.Struct({ summaryConsolidationOverride: SummaryConsolidationOverride }),
  S.Struct({
    userPreferenceConsolidationOverride: UserPreferenceConsolidationOverride,
  }),
  S.Struct({ episodicConsolidationOverride: EpisodicConsolidationOverride }),
);
export type CustomReflectionConfiguration = {
  episodicReflectionOverride: EpisodicReflectionOverride;
};
export const CustomReflectionConfiguration = S.Union(
  S.Struct({ episodicReflectionOverride: EpisodicReflectionOverride }),
);
export type TriggerCondition =
  | { messageBasedTrigger: MessageBasedTrigger }
  | { tokenBasedTrigger: TokenBasedTrigger }
  | { timeBasedTrigger: TimeBasedTrigger };
export const TriggerCondition = S.Union(
  S.Struct({ messageBasedTrigger: MessageBasedTrigger }),
  S.Struct({ tokenBasedTrigger: TokenBasedTrigger }),
  S.Struct({ timeBasedTrigger: TimeBasedTrigger }),
);
export type TriggerConditionsList = TriggerCondition[];
export const TriggerConditionsList = S.Array(TriggerCondition);
export interface UpdateMemoryInput {
  clientToken?: string;
  memoryId: string;
  description?: string | redacted.Redacted<string>;
  eventExpiryDuration?: number;
  memoryExecutionRoleArn?: string;
  memoryStrategies?: ModifyMemoryStrategies;
}
export const UpdateMemoryInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    description: S.optional(SensitiveString),
    eventExpiryDuration: S.optional(S.Number),
    memoryExecutionRoleArn: S.optional(S.String),
    memoryStrategies: S.optional(ModifyMemoryStrategies),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/memories/{memoryId}/update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMemoryInput",
}) as any as S.Schema<UpdateMemoryInput>;
export interface CreateOauth2CredentialProviderResponse {
  clientSecretArn: Secret;
  name: string;
  credentialProviderArn: string;
  callbackUrl?: string;
  oauth2ProviderConfigOutput?: Oauth2ProviderConfigOutput;
}
export const CreateOauth2CredentialProviderResponse = S.suspend(() =>
  S.Struct({
    clientSecretArn: Secret,
    name: S.String,
    credentialProviderArn: S.String,
    callbackUrl: S.optional(S.String),
    oauth2ProviderConfigOutput: S.optional(Oauth2ProviderConfigOutput),
  }),
).annotations({
  identifier: "CreateOauth2CredentialProviderResponse",
}) as any as S.Schema<CreateOauth2CredentialProviderResponse>;
export type ExtractionConfiguration = {
  customExtractionConfiguration: CustomExtractionConfiguration;
};
export const ExtractionConfiguration = S.Union(
  S.Struct({ customExtractionConfiguration: CustomExtractionConfiguration }),
);
export type ConsolidationConfiguration = {
  customConsolidationConfiguration: CustomConsolidationConfiguration;
};
export const ConsolidationConfiguration = S.Union(
  S.Struct({
    customConsolidationConfiguration: CustomConsolidationConfiguration,
  }),
);
export type ReflectionConfiguration =
  | { customReflectionConfiguration: CustomReflectionConfiguration }
  | { episodicReflectionConfiguration: EpisodicReflectionConfiguration };
export const ReflectionConfiguration = S.Union(
  S.Struct({ customReflectionConfiguration: CustomReflectionConfiguration }),
  S.Struct({
    episodicReflectionConfiguration: EpisodicReflectionConfiguration,
  }),
);
export interface SelfManagedConfiguration {
  triggerConditions: TriggerCondition[];
  invocationConfiguration: InvocationConfiguration;
  historicalContextWindowSize: number;
}
export const SelfManagedConfiguration = S.suspend(() =>
  S.Struct({
    triggerConditions: TriggerConditionsList,
    invocationConfiguration: InvocationConfiguration,
    historicalContextWindowSize: S.Number,
  }),
).annotations({
  identifier: "SelfManagedConfiguration",
}) as any as S.Schema<SelfManagedConfiguration>;
export interface StrategyConfiguration {
  type?: OverrideType;
  extraction?: ExtractionConfiguration;
  consolidation?: ConsolidationConfiguration;
  reflection?: ReflectionConfiguration;
  selfManagedConfiguration?: SelfManagedConfiguration;
}
export const StrategyConfiguration = S.suspend(() =>
  S.Struct({
    type: S.optional(OverrideType),
    extraction: S.optional(ExtractionConfiguration),
    consolidation: S.optional(ConsolidationConfiguration),
    reflection: S.optional(ReflectionConfiguration),
    selfManagedConfiguration: S.optional(SelfManagedConfiguration),
  }),
).annotations({
  identifier: "StrategyConfiguration",
}) as any as S.Schema<StrategyConfiguration>;
export interface CreateAgentRuntimeResponse {
  agentRuntimeArn: string;
  workloadIdentityDetails?: WorkloadIdentityDetails;
  agentRuntimeId: string;
  agentRuntimeVersion: string;
  createdAt: Date;
  status: AgentRuntimeStatus;
}
export const CreateAgentRuntimeResponse = S.suspend(() =>
  S.Struct({
    agentRuntimeArn: S.String,
    workloadIdentityDetails: S.optional(WorkloadIdentityDetails),
    agentRuntimeId: S.String,
    agentRuntimeVersion: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: AgentRuntimeStatus,
  }),
).annotations({
  identifier: "CreateAgentRuntimeResponse",
}) as any as S.Schema<CreateAgentRuntimeResponse>;
export interface CreateEvaluatorResponse {
  evaluatorArn: string;
  evaluatorId: string;
  createdAt: Date;
  status: EvaluatorStatus;
}
export const CreateEvaluatorResponse = S.suspend(() =>
  S.Struct({
    evaluatorArn: S.String,
    evaluatorId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: EvaluatorStatus,
  }),
).annotations({
  identifier: "CreateEvaluatorResponse",
}) as any as S.Schema<CreateEvaluatorResponse>;
export interface CreateMemoryInput {
  clientToken?: string;
  name: string;
  description?: string | redacted.Redacted<string>;
  encryptionKeyArn?: string;
  memoryExecutionRoleArn?: string;
  eventExpiryDuration: number;
  memoryStrategies?: MemoryStrategyInput[];
  tags?: { [key: string]: string };
}
export const CreateMemoryInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    name: S.String,
    description: S.optional(SensitiveString),
    encryptionKeyArn: S.optional(S.String),
    memoryExecutionRoleArn: S.optional(S.String),
    eventExpiryDuration: S.Number,
    memoryStrategies: S.optional(MemoryStrategyInputList),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/memories/create" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMemoryInput",
}) as any as S.Schema<CreateMemoryInput>;
export interface MemoryStrategy {
  strategyId: string;
  name: string;
  description?: string | redacted.Redacted<string>;
  configuration?: StrategyConfiguration;
  type: MemoryStrategyType;
  namespaces: string[];
  createdAt?: Date;
  updatedAt?: Date;
  status?: MemoryStrategyStatus;
}
export const MemoryStrategy = S.suspend(() =>
  S.Struct({
    strategyId: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    configuration: S.optional(StrategyConfiguration),
    type: MemoryStrategyType,
    namespaces: NamespacesList,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(MemoryStrategyStatus),
  }),
).annotations({
  identifier: "MemoryStrategy",
}) as any as S.Schema<MemoryStrategy>;
export type MemoryStrategyList = MemoryStrategy[];
export const MemoryStrategyList = S.Array(MemoryStrategy);
export interface Memory {
  arn: string;
  id: string;
  name: string;
  description?: string | redacted.Redacted<string>;
  encryptionKeyArn?: string;
  memoryExecutionRoleArn?: string;
  eventExpiryDuration: number;
  status: MemoryStatus;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
  strategies?: MemoryStrategy[];
}
export const Memory = S.suspend(() =>
  S.Struct({
    arn: S.String,
    id: S.String,
    name: S.String,
    description: S.optional(SensitiveString),
    encryptionKeyArn: S.optional(S.String),
    memoryExecutionRoleArn: S.optional(S.String),
    eventExpiryDuration: S.Number,
    status: MemoryStatus,
    failureReason: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    strategies: S.optional(MemoryStrategyList),
  }),
).annotations({ identifier: "Memory" }) as any as S.Schema<Memory>;
export interface UpdateMemoryOutput {
  memory?: Memory;
}
export const UpdateMemoryOutput = S.suspend(() =>
  S.Struct({ memory: S.optional(Memory) }),
).annotations({
  identifier: "UpdateMemoryOutput",
}) as any as S.Schema<UpdateMemoryOutput>;
export interface CreateGatewayTargetRequest {
  gatewayIdentifier: string;
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  clientToken?: string;
  targetConfiguration: TargetConfiguration;
  credentialProviderConfigurations?: CredentialProviderConfiguration[];
  metadataConfiguration?: MetadataConfiguration;
}
export const CreateGatewayTargetRequest = S.suspend(() =>
  S.Struct({
    gatewayIdentifier: S.String.pipe(T.HttpLabel("gatewayIdentifier")),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    targetConfiguration: TargetConfiguration,
    credentialProviderConfigurations: S.optional(
      CredentialProviderConfigurations,
    ),
    metadataConfiguration: S.optional(MetadataConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/gateways/{gatewayIdentifier}/targets/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGatewayTargetRequest",
}) as any as S.Schema<CreateGatewayTargetRequest>;
export interface CreateMemoryOutput {
  memory?: Memory;
}
export const CreateMemoryOutput = S.suspend(() =>
  S.Struct({ memory: S.optional(Memory) }),
).annotations({
  identifier: "CreateMemoryOutput",
}) as any as S.Schema<CreateMemoryOutput>;
export interface GetMemoryOutput {
  memory: Memory;
}
export const GetMemoryOutput = S.suspend(() =>
  S.Struct({ memory: Memory }),
).annotations({
  identifier: "GetMemoryOutput",
}) as any as S.Schema<GetMemoryOutput>;
export interface CreateGatewayTargetResponse {
  gatewayArn: string;
  targetId: string;
  createdAt: Date;
  updatedAt: Date;
  status: TargetStatus;
  statusReasons?: string[];
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  targetConfiguration: TargetConfiguration;
  credentialProviderConfigurations: CredentialProviderConfiguration[];
  lastSynchronizedAt?: Date;
  metadataConfiguration?: MetadataConfiguration;
}
export const CreateGatewayTargetResponse = S.suspend(() =>
  S.Struct({
    gatewayArn: S.String,
    targetId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: TargetStatus,
    statusReasons: S.optional(StatusReasons),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    targetConfiguration: TargetConfiguration,
    credentialProviderConfigurations: CredentialProviderConfigurations,
    lastSynchronizedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    metadataConfiguration: S.optional(MetadataConfiguration),
  }),
).annotations({
  identifier: "CreateGatewayTargetResponse",
}) as any as S.Schema<CreateGatewayTargetResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class DecryptionFailure extends S.TaggedError<DecryptionFailure>()(
  "DecryptionFailure",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class EncryptionFailure extends S.TaggedError<EncryptionFailure>()(
  "EncryptionFailure",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: ValidationExceptionReason,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class ThrottledException extends S.TaggedError<ThrottledException>()(
  "ThrottledException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}

//# Operations
/**
 * Gets information about a custom browser.
 */
export const getBrowser: (
  input: GetBrowserRequest,
) => effect.Effect<
  GetBrowserResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCodeInterpreter: (
  input: GetCodeInterpreterRequest,
) => effect.Effect<
  GetCodeInterpreterResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAgentRuntimeEndpoint: (
  input: DeleteAgentRuntimeEndpointRequest,
) => effect.Effect<
  DeleteAgentRuntimeEndpointResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAgentRuntimeEndpointRequest,
  output: DeleteAgentRuntimeEndpointResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an Amazon Bedrock AgentCore Runtime.
 */
export const deleteAgentRuntime: (
  input: DeleteAgentRuntimeRequest,
) => effect.Effect<
  DeleteAgentRuntimeResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAgentRuntimeEndpoints: {
  (
    input: ListAgentRuntimeEndpointsRequest,
  ): effect.Effect<
    ListAgentRuntimeEndpointsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAgentRuntimeEndpointsRequest,
  ) => stream.Stream<
    ListAgentRuntimeEndpointsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAgentRuntimeEndpointsRequest,
  ) => stream.Stream<
    AgentRuntimeEndpoint,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createOauth2CredentialProvider: (
  input: CreateOauth2CredentialProviderRequest,
) => effect.Effect<
  CreateOauth2CredentialProviderResponse,
  | AccessDeniedException
  | ConflictException
  | DecryptionFailure
  | EncryptionFailure
  | InternalServerException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listMemories: {
  (
    input: ListMemoriesInput,
  ): effect.Effect<
    ListMemoriesOutput,
    | AccessDeniedException
    | ResourceNotFoundException
    | ServiceException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMemoriesInput,
  ) => stream.Stream<
    ListMemoriesOutput,
    | AccessDeniedException
    | ResourceNotFoundException
    | ServiceException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMemoriesInput,
  ) => stream.Stream<
    MemorySummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ServiceException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Creates a custom code interpreter.
 */
export const createCodeInterpreter: (
  input: CreateCodeInterpreterRequest,
) => effect.Effect<
  CreateCodeInterpreterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves detailed information about an online evaluation configuration, including its rules, data sources, evaluators, and execution status.
 */
export const getOnlineEvaluationConfig: (
  input: GetOnlineEvaluationConfigRequest,
) => effect.Effect<
  GetOnlineEvaluationConfigResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOnlineEvaluationConfigRequest,
  output: GetOnlineEvaluationConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of generated policy assets from a policy generation request within the AgentCore Policy system. This operation returns the actual Cedar policies and related artifacts produced by the AI-powered policy generation process, allowing users to review and select from multiple generated policy options.
 */
export const listPolicyGenerationAssets: {
  (
    input: ListPolicyGenerationAssetsRequest,
  ): effect.Effect<
    ListPolicyGenerationAssetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyGenerationAssetsRequest,
  ) => stream.Stream<
    ListPolicyGenerationAssetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyGenerationAssetsRequest,
  ) => stream.Stream<
    PolicyGenerationAsset,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createPolicy: (
  input: CreatePolicyRequest,
) => effect.Effect<
  CreatePolicyResponse,
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
export const createAgentRuntimeEndpoint: (
  input: CreateAgentRuntimeEndpointRequest,
) => effect.Effect<
  CreateAgentRuntimeEndpointResponse,
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
}));
/**
 * Gets an Amazon Bedrock AgentCore Runtime.
 */
export const getAgentRuntime: (
  input: GetAgentRuntimeRequest,
) => effect.Effect<
  GetAgentRuntimeResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const synchronizeGatewayTargets: (
  input: SynchronizeGatewayTargetsRequest,
) => effect.Effect<
  SynchronizeGatewayTargetsResponse,
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
}));
/**
 * Initiates the AI-powered generation of Cedar policies from natural language descriptions within the AgentCore Policy system. This feature enables both technical and non-technical users to create policies by describing their authorization requirements in plain English, which is then automatically translated into formal Cedar policy statements. The generation process analyzes the natural language input along with the Gateway's tool context to produce validated policy options. Generated policy assets are automatically deleted after 7 days, so you should review and create policies from the generated assets within this timeframe. Once created, policies are permanent and not subject to this expiration. Generated policies should be reviewed and tested in log-only mode before deploying to production. Use this when you want to describe policy intent naturally rather than learning Cedar syntax, though generated policies may require refinement for complex scenarios.
 */
export const startPolicyGeneration: (
  input: StartPolicyGenerationRequest,
) => effect.Effect<
  StartPolicyGenerationResponse,
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
}));
/**
 * Retrieves a list of policy generation requests within the AgentCore Policy system. This operation supports pagination and filtering to help track and manage AI-powered policy generation operations.
 */
export const listPolicyGenerations: {
  (
    input: ListPolicyGenerationsRequest,
  ): effect.Effect<
    ListPolicyGenerationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyGenerationsRequest,
  ) => stream.Stream<
    ListPolicyGenerationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyGenerationsRequest,
  ) => stream.Stream<
    PolicyGeneration,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPolicies: {
  (
    input: ListPoliciesRequest,
  ): effect.Effect<
    ListPoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPoliciesRequest,
  ) => stream.Stream<
    ListPoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPoliciesRequest,
  ) => stream.Stream<
    Policy,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Retrieves the resource-based policy for a specified resource.
 *
 * This feature is currently available only for AgentCore Runtime and Gateway.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => effect.Effect<
  GetResourcePolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates or updates a resource-based policy for a resource with the specified resourceArn.
 *
 * This feature is currently available only for AgentCore Runtime and Gateway.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets information about an Amazon Secure AgentEndpoint.
 */
export const getAgentRuntimeEndpoint: (
  input: GetAgentRuntimeEndpointRequest,
) => effect.Effect<
  GetAgentRuntimeEndpointResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAgentRuntimeEndpointRequest,
  output: GetAgentRuntimeEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all versions of a specific Amazon Secure Agent.
 */
export const listAgentRuntimeVersions: {
  (
    input: ListAgentRuntimeVersionsRequest,
  ): effect.Effect<
    ListAgentRuntimeVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAgentRuntimeVersionsRequest,
  ) => stream.Stream<
    ListAgentRuntimeVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAgentRuntimeVersionsRequest,
  ) => stream.Stream<
    AgentRuntime,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getEvaluator: (
  input: GetEvaluatorRequest,
) => effect.Effect<
  GetEvaluatorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getGateway: (
  input: GetGatewayRequest,
) => effect.Effect<
  GetGatewayResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getGatewayTarget: (
  input: GetGatewayTargetRequest,
) => effect.Effect<
  GetGatewayTargetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPolicyEngine: (
  input: GetPolicyEngineRequest,
) => effect.Effect<
  GetPolicyEngineResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPolicyGeneration: (
  input: GetPolicyGenerationRequest,
) => effect.Effect<
  GetPolicyGenerationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPolicy: (
  input: GetPolicyRequest,
) => effect.Effect<
  GetPolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an existing Amazon Bedrock AgentCore Runtime endpoint.
 */
export const updateAgentRuntimeEndpoint: (
  input: UpdateAgentRuntimeEndpointRequest,
) => effect.Effect<
  UpdateAgentRuntimeEndpointResponse,
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
}));
/**
 * Updates an existing Amazon Secure Agent.
 */
export const updateAgentRuntime: (
  input: UpdateAgentRuntimeRequest,
) => effect.Effect<
  UpdateAgentRuntimeResponse,
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
export const deleteBrowser: (
  input: DeleteBrowserRequest,
) => effect.Effect<
  DeleteBrowserResponse,
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
export const deleteCodeInterpreter: (
  input: DeleteCodeInterpreterRequest,
) => effect.Effect<
  DeleteCodeInterpreterResponse,
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
}));
/**
 * Updates a custom evaluator's configuration, description, or evaluation level. Built-in evaluators cannot be updated. The evaluator must not be locked for modification.
 */
export const updateEvaluator: (
  input: UpdateEvaluatorRequest,
) => effect.Effect<
  UpdateEvaluatorResponse,
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
export const deleteEvaluator: (
  input: DeleteEvaluatorRequest,
) => effect.Effect<
  DeleteEvaluatorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteGateway: (
  input: DeleteGatewayRequest,
) => effect.Effect<
  DeleteGatewayResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateGateway: (
  input: UpdateGatewayRequest,
) => effect.Effect<
  UpdateGatewayResponse,
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
export const deleteGatewayTarget: (
  input: DeleteGatewayTargetRequest,
) => effect.Effect<
  DeleteGatewayTargetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateGatewayTarget: (
  input: UpdateGatewayTargetRequest,
) => effect.Effect<
  UpdateGatewayTargetResponse,
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
export const updateOnlineEvaluationConfig: (
  input: UpdateOnlineEvaluationConfigRequest,
) => effect.Effect<
  UpdateOnlineEvaluationConfigResponse,
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
export const deleteOnlineEvaluationConfig: (
  input: DeleteOnlineEvaluationConfigRequest,
) => effect.Effect<
  DeleteOnlineEvaluationConfigResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePolicyEngine: (
  input: UpdatePolicyEngineRequest,
) => effect.Effect<
  UpdatePolicyEngineResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePolicyEngine: (
  input: DeletePolicyEngineRequest,
) => effect.Effect<
  DeletePolicyEngineResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePolicy: (
  input: UpdatePolicyRequest,
) => effect.Effect<
  UpdatePolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePolicy: (
  input: DeletePolicyRequest,
) => effect.Effect<
  DeletePolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAgentRuntimes: {
  (
    input: ListAgentRuntimesRequest,
  ): effect.Effect<
    ListAgentRuntimesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAgentRuntimesRequest,
  ) => stream.Stream<
    ListAgentRuntimesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAgentRuntimesRequest,
  ) => stream.Stream<
    AgentRuntime,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all custom browsers in your account.
 */
export const listBrowsers: {
  (
    input: ListBrowsersRequest,
  ): effect.Effect<
    ListBrowsersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBrowsersRequest,
  ) => stream.Stream<
    ListBrowsersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBrowsersRequest,
  ) => stream.Stream<
    BrowserSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all custom code interpreters in your account.
 */
export const listCodeInterpreters: {
  (
    input: ListCodeInterpretersRequest,
  ): effect.Effect<
    ListCodeInterpretersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCodeInterpretersRequest,
  ) => stream.Stream<
    ListCodeInterpretersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCodeInterpretersRequest,
  ) => stream.Stream<
    CodeInterpreterSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listEvaluators: {
  (
    input: ListEvaluatorsRequest,
  ): effect.Effect<
    ListEvaluatorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEvaluatorsRequest,
  ) => stream.Stream<
    ListEvaluatorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEvaluatorsRequest,
  ) => stream.Stream<
    EvaluatorSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all gateways in the account.
 */
export const listGateways: {
  (
    input: ListGatewaysRequest,
  ): effect.Effect<
    ListGatewaysResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGatewaysRequest,
  ) => stream.Stream<
    ListGatewaysResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGatewaysRequest,
  ) => stream.Stream<
    GatewaySummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all targets for a specific gateway.
 */
export const listGatewayTargets: {
  (
    input: ListGatewayTargetsRequest,
  ): effect.Effect<
    ListGatewayTargetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGatewayTargetsRequest,
  ) => stream.Stream<
    ListGatewayTargetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGatewayTargetsRequest,
  ) => stream.Stream<
    TargetSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all online evaluation configurations in the account, providing summary information about each configuration's status and settings.
 */
export const listOnlineEvaluationConfigs: {
  (
    input: ListOnlineEvaluationConfigsRequest,
  ): effect.Effect<
    ListOnlineEvaluationConfigsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOnlineEvaluationConfigsRequest,
  ) => stream.Stream<
    ListOnlineEvaluationConfigsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOnlineEvaluationConfigsRequest,
  ) => stream.Stream<
    OnlineEvaluationConfigSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPolicyEngines: {
  (
    input: ListPolicyEnginesRequest,
  ): effect.Effect<
    ListPolicyEnginesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyEnginesRequest,
  ) => stream.Stream<
    ListPolicyEnginesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyEnginesRequest,
  ) => stream.Stream<
    PolicyEngine,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Deletes the resource-based policy for a specified resource.
 *
 * This feature is currently available only for AgentCore Runtime and Gateway.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new policy engine within the AgentCore Policy system. A policy engine is a collection of policies that evaluates and authorizes agent tool calls. When associated with Gateways (each Gateway can be associated with at most one policy engine, but multiple Gateways can be associated with the same engine), the policy engine intercepts all agent requests and determines whether to allow or deny each action based on the defined policies. This is an asynchronous operation. Use the GetPolicyEngine operation to poll the `status` field to track completion.
 */
export const createPolicyEngine: (
  input: CreatePolicyEngineRequest,
) => effect.Effect<
  CreatePolicyEngineResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBrowser: (
  input: CreateBrowserRequest,
) => effect.Effect<
  CreateBrowserResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createGateway: (
  input: CreateGatewayRequest,
) => effect.Effect<
  CreateGatewayResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getOauth2CredentialProvider: (
  input: GetOauth2CredentialProviderRequest,
) => effect.Effect<
  GetOauth2CredentialProviderResponse,
  | AccessDeniedException
  | DecryptionFailure
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates an online evaluation configuration for continuous monitoring of agent performance. Online evaluation automatically samples live traffic from CloudWatch logs at specified rates and applies evaluators to assess agent quality in production.
 */
export const createOnlineEvaluationConfig: (
  input: CreateOnlineEvaluationConfigRequest,
) => effect.Effect<
  CreateOnlineEvaluationConfigResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApiKeyCredentialProvider: (
  input: GetApiKeyCredentialProviderRequest,
) => effect.Effect<
  GetApiKeyCredentialProviderResponse,
  | AccessDeniedException
  | DecryptionFailure
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists all API key credential providers in your account.
 */
export const listApiKeyCredentialProviders: {
  (
    input: ListApiKeyCredentialProvidersRequest,
  ): effect.Effect<
    ListApiKeyCredentialProvidersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApiKeyCredentialProvidersRequest,
  ) => stream.Stream<
    ListApiKeyCredentialProvidersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApiKeyCredentialProvidersRequest,
  ) => stream.Stream<
    ApiKeyCredentialProviderItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listOauth2CredentialProviders: {
  (
    input: ListOauth2CredentialProvidersRequest,
  ): effect.Effect<
    ListOauth2CredentialProvidersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOauth2CredentialProvidersRequest,
  ) => stream.Stream<
    ListOauth2CredentialProvidersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOauth2CredentialProvidersRequest,
  ) => stream.Stream<
    Oauth2CredentialProviderItem,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listWorkloadIdentities: {
  (
    input: ListWorkloadIdentitiesRequest,
  ): effect.Effect<
    ListWorkloadIdentitiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkloadIdentitiesRequest,
  ) => stream.Stream<
    ListWorkloadIdentitiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkloadIdentitiesRequest,
  ) => stream.Stream<
    WorkloadIdentityType,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getTokenVault: (
  input: GetTokenVaultRequest,
) => effect.Effect<
  GetTokenVaultResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWorkloadIdentity: (
  input: CreateWorkloadIdentityRequest,
) => effect.Effect<
  CreateWorkloadIdentityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves information about a workload identity.
 */
export const getWorkloadIdentity: (
  input: GetWorkloadIdentityRequest,
) => effect.Effect<
  GetWorkloadIdentityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWorkloadIdentity: (
  input: UpdateWorkloadIdentityRequest,
) => effect.Effect<
  UpdateWorkloadIdentityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes an API key credential provider.
 */
export const deleteApiKeyCredentialProvider: (
  input: DeleteApiKeyCredentialProviderRequest,
) => effect.Effect<
  DeleteApiKeyCredentialProviderResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteOauth2CredentialProvider: (
  input: DeleteOauth2CredentialProviderRequest,
) => effect.Effect<
  DeleteOauth2CredentialProviderResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWorkloadIdentity: (
  input: DeleteWorkloadIdentityRequest,
) => effect.Effect<
  DeleteWorkloadIdentityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates an existing API key credential provider.
 */
export const updateApiKeyCredentialProvider: (
  input: UpdateApiKeyCredentialProviderRequest,
) => effect.Effect<
  UpdateApiKeyCredentialProviderResponse,
  | AccessDeniedException
  | ConflictException
  | DecryptionFailure
  | EncryptionFailure
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setTokenVaultCMK: (
  input: SetTokenVaultCMKRequest,
) => effect.Effect<
  SetTokenVaultCMKResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateOauth2CredentialProvider: (
  input: UpdateOauth2CredentialProviderRequest,
) => effect.Effect<
  UpdateOauth2CredentialProviderResponse,
  | AccessDeniedException
  | ConflictException
  | DecryptionFailure
  | EncryptionFailure
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApiKeyCredentialProvider: (
  input: CreateApiKeyCredentialProviderRequest,
) => effect.Effect<
  CreateApiKeyCredentialProviderResponse,
  | AccessDeniedException
  | ConflictException
  | DecryptionFailure
  | EncryptionFailure
  | InternalServerException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMemory: (
  input: DeleteMemoryInput,
) => effect.Effect<
  DeleteMemoryOutput,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAgentRuntime: (
  input: CreateAgentRuntimeRequest,
) => effect.Effect<
  CreateAgentRuntimeResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createEvaluator: (
  input: CreateEvaluatorRequest,
) => effect.Effect<
  CreateEvaluatorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateMemory: (
  input: UpdateMemoryInput,
) => effect.Effect<
  UpdateMemoryOutput,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceException
  | ServiceQuotaExceededException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createMemory: (
  input: CreateMemoryInput,
) => effect.Effect<
  CreateMemoryOutput,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceException
  | ServiceQuotaExceededException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMemory: (
  input: GetMemoryInput,
) => effect.Effect<
  GetMemoryOutput,
  | AccessDeniedException
  | ResourceNotFoundException
  | ServiceException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createGatewayTarget: (
  input: CreateGatewayTargetRequest,
) => effect.Effect<
  CreateGatewayTargetResponse,
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
