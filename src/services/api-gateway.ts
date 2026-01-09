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
  sdkId: "API Gateway",
  serviceShapeName: "BackplaneControlService",
});
const auth = T.AwsAuthSigv4({ name: "apigateway" });
const ver = T.ServiceVersion("2015-07-09");
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
              `https://apigateway-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://apigateway-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://apigateway.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://apigateway.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ProviderARN = string;
export type StatusCode = string;
export type DocumentationPartLocationStatusCode = string;

//# Schemas
export interface GetAccountRequest {}
export const GetAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/account" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountRequest",
}) as any as S.Schema<GetAccountRequest>;
export type AuthorizerType =
  | "TOKEN"
  | "REQUEST"
  | "COGNITO_USER_POOLS"
  | (string & {});
export const AuthorizerType = S.String;
export type ListOfARNs = string[];
export const ListOfARNs = S.Array(S.String);
export type CacheClusterSize =
  | "0.5"
  | "1.6"
  | "6.1"
  | "13.5"
  | "28.4"
  | "58.2"
  | "118"
  | "237"
  | (string & {});
export const CacheClusterSize = S.String;
export type SecurityPolicy =
  | "TLS_1_0"
  | "TLS_1_2"
  | "SecurityPolicy_TLS13_1_3_2025_09"
  | "SecurityPolicy_TLS13_1_3_FIPS_2025_09"
  | "SecurityPolicy_TLS13_1_2_PFS_PQ_2025_09"
  | "SecurityPolicy_TLS13_1_2_FIPS_PQ_2025_09"
  | "SecurityPolicy_TLS13_1_2_PQ_2025_09"
  | "SecurityPolicy_TLS13_1_2_2021_06"
  | "SecurityPolicy_TLS13_2025_EDGE"
  | "SecurityPolicy_TLS12_PFS_2025_EDGE"
  | "SecurityPolicy_TLS12_2018_EDGE"
  | (string & {});
export const SecurityPolicy = S.String;
export type EndpointAccessMode = "BASIC" | "STRICT" | (string & {});
export const EndpointAccessMode = S.String;
export type RoutingMode =
  | "BASE_PATH_MAPPING_ONLY"
  | "ROUTING_RULE_ONLY"
  | "ROUTING_RULE_THEN_BASE_PATH_MAPPING"
  | (string & {});
export const RoutingMode = S.String;
export type AccessAssociationSourceType = "VPCE" | (string & {});
export const AccessAssociationSourceType = S.String;
export type ListOfString = string[];
export const ListOfString = S.Array(S.String);
export type ApiKeySourceType = "HEADER" | "AUTHORIZER" | (string & {});
export const ApiKeySourceType = S.String;
export type GatewayResponseType =
  | "DEFAULT_4XX"
  | "DEFAULT_5XX"
  | "RESOURCE_NOT_FOUND"
  | "UNAUTHORIZED"
  | "INVALID_API_KEY"
  | "ACCESS_DENIED"
  | "AUTHORIZER_FAILURE"
  | "AUTHORIZER_CONFIGURATION_ERROR"
  | "INVALID_SIGNATURE"
  | "EXPIRED_TOKEN"
  | "MISSING_AUTHENTICATION_TOKEN"
  | "INTEGRATION_FAILURE"
  | "INTEGRATION_TIMEOUT"
  | "API_CONFIGURATION_ERROR"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "BAD_REQUEST_PARAMETERS"
  | "BAD_REQUEST_BODY"
  | "REQUEST_TOO_LARGE"
  | "THROTTLED"
  | "QUOTA_EXCEEDED"
  | "WAF_FILTERED"
  | (string & {});
export const GatewayResponseType = S.String;
export type DocumentationPartType =
  | "API"
  | "AUTHORIZER"
  | "MODEL"
  | "RESOURCE"
  | "METHOD"
  | "PATH_PARAMETER"
  | "QUERY_PARAMETER"
  | "REQUEST_HEADER"
  | "REQUEST_BODY"
  | "RESPONSE"
  | "RESPONSE_HEADER"
  | "RESPONSE_BODY"
  | (string & {});
export const DocumentationPartType = S.String;
export type LocationStatusType = "DOCUMENTED" | "UNDOCUMENTED" | (string & {});
export const LocationStatusType = S.String;
export type ResourceOwner = "SELF" | "OTHER_ACCOUNTS" | (string & {});
export const ResourceOwner = S.String;
export type ApiKeysFormat = "csv" | (string & {});
export const ApiKeysFormat = S.String;
export type PutMode = "merge" | "overwrite" | (string & {});
export const PutMode = S.String;
export type IntegrationType =
  | "HTTP"
  | "AWS"
  | "MOCK"
  | "HTTP_PROXY"
  | "AWS_PROXY"
  | (string & {});
export const IntegrationType = S.String;
export type ConnectionType = "INTERNET" | "VPC_LINK" | (string & {});
export const ConnectionType = S.String;
export type ContentHandlingStrategy =
  | "CONVERT_TO_BINARY"
  | "CONVERT_TO_TEXT"
  | (string & {});
export const ContentHandlingStrategy = S.String;
export type ResponseTransferMode = "BUFFERED" | "STREAM" | (string & {});
export const ResponseTransferMode = S.String;
export interface CreateAuthorizerRequest {
  restApiId: string;
  name: string;
  type: AuthorizerType;
  providerARNs?: string[];
  authType?: string;
  authorizerUri?: string;
  authorizerCredentials?: string;
  identitySource?: string;
  identityValidationExpression?: string;
  authorizerResultTtlInSeconds?: number;
}
export const CreateAuthorizerRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    name: S.String,
    type: AuthorizerType,
    providerARNs: S.optional(ListOfARNs),
    authType: S.optional(S.String),
    authorizerUri: S.optional(S.String),
    authorizerCredentials: S.optional(S.String),
    identitySource: S.optional(S.String),
    identityValidationExpression: S.optional(S.String),
    authorizerResultTtlInSeconds: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/restapis/{restApiId}/authorizers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAuthorizerRequest",
}) as any as S.Schema<CreateAuthorizerRequest>;
export interface CreateBasePathMappingRequest {
  domainName: string;
  domainNameId?: string;
  basePath?: string;
  restApiId: string;
  stage?: string;
}
export const CreateBasePathMappingRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    basePath: S.optional(S.String),
    restApiId: S.String,
    stage: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/domainnames/{domainName}/basepathmappings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBasePathMappingRequest",
}) as any as S.Schema<CreateBasePathMappingRequest>;
export interface CreateDocumentationVersionRequest {
  restApiId: string;
  documentationVersion: string;
  stageName?: string;
  description?: string;
}
export const CreateDocumentationVersionRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationVersion: S.String,
    stageName: S.optional(S.String),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/restapis/{restApiId}/documentation/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDocumentationVersionRequest",
}) as any as S.Schema<CreateDocumentationVersionRequest>;
export type MapOfStringToString = { [key: string]: string | undefined };
export const MapOfStringToString = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateDomainNameAccessAssociationRequest {
  domainNameArn: string;
  accessAssociationSourceType: AccessAssociationSourceType;
  accessAssociationSource: string;
  tags?: { [key: string]: string | undefined };
}
export const CreateDomainNameAccessAssociationRequest = S.suspend(() =>
  S.Struct({
    domainNameArn: S.String,
    accessAssociationSourceType: AccessAssociationSourceType,
    accessAssociationSource: S.String,
    tags: S.optional(MapOfStringToString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domainnameaccessassociations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainNameAccessAssociationRequest",
}) as any as S.Schema<CreateDomainNameAccessAssociationRequest>;
export interface CreateModelRequest {
  restApiId: string;
  name: string;
  description?: string;
  schema?: string;
  contentType: string;
}
export const CreateModelRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    name: S.String,
    description: S.optional(S.String),
    schema: S.optional(S.String),
    contentType: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/restapis/{restApiId}/models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateModelRequest",
}) as any as S.Schema<CreateModelRequest>;
export interface CreateRequestValidatorRequest {
  restApiId: string;
  name?: string;
  validateRequestBody?: boolean;
  validateRequestParameters?: boolean;
}
export const CreateRequestValidatorRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    name: S.optional(S.String),
    validateRequestBody: S.optional(S.Boolean),
    validateRequestParameters: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/restapis/{restApiId}/requestvalidators",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRequestValidatorRequest",
}) as any as S.Schema<CreateRequestValidatorRequest>;
export interface CreateResourceRequest {
  restApiId: string;
  parentId: string;
  pathPart: string;
}
export const CreateResourceRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    parentId: S.String.pipe(T.HttpLabel("parentId")),
    pathPart: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/restapis/{restApiId}/resources/{parentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourceRequest",
}) as any as S.Schema<CreateResourceRequest>;
export type EndpointType = "REGIONAL" | "EDGE" | "PRIVATE" | (string & {});
export const EndpointType = S.String;
export type ListOfEndpointType = EndpointType[];
export const ListOfEndpointType = S.Array(EndpointType);
export type IpAddressType = "ipv4" | "dualstack" | (string & {});
export const IpAddressType = S.String;
export interface EndpointConfiguration {
  types?: EndpointType[];
  ipAddressType?: IpAddressType;
  vpcEndpointIds?: string[];
}
export const EndpointConfiguration = S.suspend(() =>
  S.Struct({
    types: S.optional(ListOfEndpointType),
    ipAddressType: S.optional(IpAddressType),
    vpcEndpointIds: S.optional(ListOfString),
  }),
).annotations({
  identifier: "EndpointConfiguration",
}) as any as S.Schema<EndpointConfiguration>;
export interface CreateRestApiRequest {
  name: string;
  description?: string;
  version?: string;
  cloneFrom?: string;
  binaryMediaTypes?: string[];
  minimumCompressionSize?: number;
  apiKeySource?: ApiKeySourceType;
  endpointConfiguration?: EndpointConfiguration;
  policy?: string;
  tags?: { [key: string]: string | undefined };
  disableExecuteApiEndpoint?: boolean;
  securityPolicy?: SecurityPolicy;
  endpointAccessMode?: EndpointAccessMode;
}
export const CreateRestApiRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    version: S.optional(S.String),
    cloneFrom: S.optional(S.String),
    binaryMediaTypes: S.optional(ListOfString),
    minimumCompressionSize: S.optional(S.Number),
    apiKeySource: S.optional(ApiKeySourceType),
    endpointConfiguration: S.optional(EndpointConfiguration),
    policy: S.optional(S.String),
    tags: S.optional(MapOfStringToString),
    disableExecuteApiEndpoint: S.optional(S.Boolean),
    securityPolicy: S.optional(SecurityPolicy),
    endpointAccessMode: S.optional(EndpointAccessMode),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/restapis" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRestApiRequest",
}) as any as S.Schema<CreateRestApiRequest>;
export interface CreateUsagePlanKeyRequest {
  usagePlanId: string;
  keyId: string;
  keyType: string;
}
export const CreateUsagePlanKeyRequest = S.suspend(() =>
  S.Struct({
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    keyId: S.String,
    keyType: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/usageplans/{usagePlanId}/keys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUsagePlanKeyRequest",
}) as any as S.Schema<CreateUsagePlanKeyRequest>;
export interface CreateVpcLinkRequest {
  name: string;
  description?: string;
  targetArns: string[];
  tags?: { [key: string]: string | undefined };
}
export const CreateVpcLinkRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    targetArns: ListOfString,
    tags: S.optional(MapOfStringToString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/vpclinks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVpcLinkRequest",
}) as any as S.Schema<CreateVpcLinkRequest>;
export interface DeleteApiKeyRequest {
  apiKey: string;
}
export const DeleteApiKeyRequest = S.suspend(() =>
  S.Struct({ apiKey: S.String.pipe(T.HttpLabel("apiKey")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/apikeys/{apiKey}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApiKeyRequest",
}) as any as S.Schema<DeleteApiKeyRequest>;
export interface DeleteApiKeyResponse {}
export const DeleteApiKeyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteApiKeyResponse",
}) as any as S.Schema<DeleteApiKeyResponse>;
export interface DeleteAuthorizerRequest {
  restApiId: string;
  authorizerId: string;
}
export const DeleteAuthorizerRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    authorizerId: S.String.pipe(T.HttpLabel("authorizerId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/authorizers/{authorizerId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAuthorizerRequest",
}) as any as S.Schema<DeleteAuthorizerRequest>;
export interface DeleteAuthorizerResponse {}
export const DeleteAuthorizerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAuthorizerResponse",
}) as any as S.Schema<DeleteAuthorizerResponse>;
export interface DeleteBasePathMappingRequest {
  domainName: string;
  domainNameId?: string;
  basePath: string;
}
export const DeleteBasePathMappingRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    basePath: S.String.pipe(T.HttpLabel("basePath")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domainnames/{domainName}/basepathmappings/{basePath}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBasePathMappingRequest",
}) as any as S.Schema<DeleteBasePathMappingRequest>;
export interface DeleteBasePathMappingResponse {}
export const DeleteBasePathMappingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteBasePathMappingResponse",
}) as any as S.Schema<DeleteBasePathMappingResponse>;
export interface DeleteClientCertificateRequest {
  clientCertificateId: string;
}
export const DeleteClientCertificateRequest = S.suspend(() =>
  S.Struct({
    clientCertificateId: S.String.pipe(T.HttpLabel("clientCertificateId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/clientcertificates/{clientCertificateId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClientCertificateRequest",
}) as any as S.Schema<DeleteClientCertificateRequest>;
export interface DeleteClientCertificateResponse {}
export const DeleteClientCertificateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteClientCertificateResponse",
}) as any as S.Schema<DeleteClientCertificateResponse>;
export interface DeleteDeploymentRequest {
  restApiId: string;
  deploymentId: string;
}
export const DeleteDeploymentRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    deploymentId: S.String.pipe(T.HttpLabel("deploymentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/deployments/{deploymentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDeploymentRequest",
}) as any as S.Schema<DeleteDeploymentRequest>;
export interface DeleteDeploymentResponse {}
export const DeleteDeploymentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDeploymentResponse",
}) as any as S.Schema<DeleteDeploymentResponse>;
export interface DeleteDocumentationPartRequest {
  restApiId: string;
  documentationPartId: string;
}
export const DeleteDocumentationPartRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationPartId: S.String.pipe(T.HttpLabel("documentationPartId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/documentation/parts/{documentationPartId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDocumentationPartRequest",
}) as any as S.Schema<DeleteDocumentationPartRequest>;
export interface DeleteDocumentationPartResponse {}
export const DeleteDocumentationPartResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDocumentationPartResponse",
}) as any as S.Schema<DeleteDocumentationPartResponse>;
export interface DeleteDocumentationVersionRequest {
  restApiId: string;
  documentationVersion: string;
}
export const DeleteDocumentationVersionRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationVersion: S.String.pipe(T.HttpLabel("documentationVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/documentation/versions/{documentationVersion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDocumentationVersionRequest",
}) as any as S.Schema<DeleteDocumentationVersionRequest>;
export interface DeleteDocumentationVersionResponse {}
export const DeleteDocumentationVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDocumentationVersionResponse",
}) as any as S.Schema<DeleteDocumentationVersionResponse>;
export interface DeleteDomainNameRequest {
  domainName: string;
  domainNameId?: string;
}
export const DeleteDomainNameRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/domainnames/{domainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainNameRequest",
}) as any as S.Schema<DeleteDomainNameRequest>;
export interface DeleteDomainNameResponse {}
export const DeleteDomainNameResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDomainNameResponse",
}) as any as S.Schema<DeleteDomainNameResponse>;
export interface DeleteDomainNameAccessAssociationRequest {
  domainNameAccessAssociationArn: string;
}
export const DeleteDomainNameAccessAssociationRequest = S.suspend(() =>
  S.Struct({
    domainNameAccessAssociationArn: S.String.pipe(
      T.HttpLabel("domainNameAccessAssociationArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/domainnameaccessassociations/{domainNameAccessAssociationArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainNameAccessAssociationRequest",
}) as any as S.Schema<DeleteDomainNameAccessAssociationRequest>;
export interface DeleteDomainNameAccessAssociationResponse {}
export const DeleteDomainNameAccessAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDomainNameAccessAssociationResponse",
}) as any as S.Schema<DeleteDomainNameAccessAssociationResponse>;
export interface DeleteGatewayResponseRequest {
  restApiId: string;
  responseType: GatewayResponseType;
}
export const DeleteGatewayResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    responseType: GatewayResponseType.pipe(T.HttpLabel("responseType")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/gatewayresponses/{responseType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGatewayResponseRequest",
}) as any as S.Schema<DeleteGatewayResponseRequest>;
export interface DeleteGatewayResponseResponse {}
export const DeleteGatewayResponseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteGatewayResponseResponse",
}) as any as S.Schema<DeleteGatewayResponseResponse>;
export interface DeleteIntegrationRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
}
export const DeleteIntegrationRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/integration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIntegrationRequest",
}) as any as S.Schema<DeleteIntegrationRequest>;
export interface DeleteIntegrationResponse {}
export const DeleteIntegrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIntegrationResponse",
}) as any as S.Schema<DeleteIntegrationResponse>;
export interface DeleteIntegrationResponseRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  statusCode: string;
}
export const DeleteIntegrationResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/integration/responses/{statusCode}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIntegrationResponseRequest",
}) as any as S.Schema<DeleteIntegrationResponseRequest>;
export interface DeleteIntegrationResponseResponse {}
export const DeleteIntegrationResponseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIntegrationResponseResponse",
}) as any as S.Schema<DeleteIntegrationResponseResponse>;
export interface DeleteMethodRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
}
export const DeleteMethodRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMethodRequest",
}) as any as S.Schema<DeleteMethodRequest>;
export interface DeleteMethodResponse {}
export const DeleteMethodResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteMethodResponse",
}) as any as S.Schema<DeleteMethodResponse>;
export interface DeleteMethodResponseRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  statusCode: string;
}
export const DeleteMethodResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/responses/{statusCode}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMethodResponseRequest",
}) as any as S.Schema<DeleteMethodResponseRequest>;
export interface DeleteMethodResponseResponse {}
export const DeleteMethodResponseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMethodResponseResponse",
}) as any as S.Schema<DeleteMethodResponseResponse>;
export interface DeleteModelRequest {
  restApiId: string;
  modelName: string;
}
export const DeleteModelRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    modelName: S.String.pipe(T.HttpLabel("modelName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/models/{modelName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteModelRequest",
}) as any as S.Schema<DeleteModelRequest>;
export interface DeleteModelResponse {}
export const DeleteModelResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteModelResponse",
}) as any as S.Schema<DeleteModelResponse>;
export interface DeleteRequestValidatorRequest {
  restApiId: string;
  requestValidatorId: string;
}
export const DeleteRequestValidatorRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    requestValidatorId: S.String.pipe(T.HttpLabel("requestValidatorId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/requestvalidators/{requestValidatorId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRequestValidatorRequest",
}) as any as S.Schema<DeleteRequestValidatorRequest>;
export interface DeleteRequestValidatorResponse {}
export const DeleteRequestValidatorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRequestValidatorResponse",
}) as any as S.Schema<DeleteRequestValidatorResponse>;
export interface DeleteResourceRequest {
  restApiId: string;
  resourceId: string;
}
export const DeleteResourceRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/resources/{resourceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourceRequest",
}) as any as S.Schema<DeleteResourceRequest>;
export interface DeleteResourceResponse {}
export const DeleteResourceResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteResourceResponse" },
) as any as S.Schema<DeleteResourceResponse>;
export interface DeleteRestApiRequest {
  restApiId: string;
}
export const DeleteRestApiRequest = S.suspend(() =>
  S.Struct({ restApiId: S.String.pipe(T.HttpLabel("restApiId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/restapis/{restApiId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRestApiRequest",
}) as any as S.Schema<DeleteRestApiRequest>;
export interface DeleteRestApiResponse {}
export const DeleteRestApiResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteRestApiResponse",
}) as any as S.Schema<DeleteRestApiResponse>;
export interface DeleteStageRequest {
  restApiId: string;
  stageName: string;
}
export const DeleteStageRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/stages/{stageName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteStageRequest",
}) as any as S.Schema<DeleteStageRequest>;
export interface DeleteStageResponse {}
export const DeleteStageResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteStageResponse",
}) as any as S.Schema<DeleteStageResponse>;
export interface DeleteUsagePlanRequest {
  usagePlanId: string;
}
export const DeleteUsagePlanRequest = S.suspend(() =>
  S.Struct({ usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/usageplans/{usagePlanId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUsagePlanRequest",
}) as any as S.Schema<DeleteUsagePlanRequest>;
export interface DeleteUsagePlanResponse {}
export const DeleteUsagePlanResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteUsagePlanResponse",
}) as any as S.Schema<DeleteUsagePlanResponse>;
export interface DeleteUsagePlanKeyRequest {
  usagePlanId: string;
  keyId: string;
}
export const DeleteUsagePlanKeyRequest = S.suspend(() =>
  S.Struct({
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    keyId: S.String.pipe(T.HttpLabel("keyId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/usageplans/{usagePlanId}/keys/{keyId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUsagePlanKeyRequest",
}) as any as S.Schema<DeleteUsagePlanKeyRequest>;
export interface DeleteUsagePlanKeyResponse {}
export const DeleteUsagePlanKeyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteUsagePlanKeyResponse",
}) as any as S.Schema<DeleteUsagePlanKeyResponse>;
export interface DeleteVpcLinkRequest {
  vpcLinkId: string;
}
export const DeleteVpcLinkRequest = S.suspend(() =>
  S.Struct({ vpcLinkId: S.String.pipe(T.HttpLabel("vpcLinkId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/vpclinks/{vpcLinkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVpcLinkRequest",
}) as any as S.Schema<DeleteVpcLinkRequest>;
export interface DeleteVpcLinkResponse {}
export const DeleteVpcLinkResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteVpcLinkResponse",
}) as any as S.Schema<DeleteVpcLinkResponse>;
export interface FlushStageAuthorizersCacheRequest {
  restApiId: string;
  stageName: string;
}
export const FlushStageAuthorizersCacheRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/stages/{stageName}/cache/authorizers",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "FlushStageAuthorizersCacheRequest",
}) as any as S.Schema<FlushStageAuthorizersCacheRequest>;
export interface FlushStageAuthorizersCacheResponse {}
export const FlushStageAuthorizersCacheResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "FlushStageAuthorizersCacheResponse",
}) as any as S.Schema<FlushStageAuthorizersCacheResponse>;
export interface FlushStageCacheRequest {
  restApiId: string;
  stageName: string;
}
export const FlushStageCacheRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/restapis/{restApiId}/stages/{stageName}/cache/data",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "FlushStageCacheRequest",
}) as any as S.Schema<FlushStageCacheRequest>;
export interface FlushStageCacheResponse {}
export const FlushStageCacheResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "FlushStageCacheResponse",
}) as any as S.Schema<FlushStageCacheResponse>;
export interface GenerateClientCertificateRequest {
  description?: string;
  tags?: { [key: string]: string | undefined };
}
export const GenerateClientCertificateRequest = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    tags: S.optional(MapOfStringToString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/clientcertificates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateClientCertificateRequest",
}) as any as S.Schema<GenerateClientCertificateRequest>;
export interface ThrottleSettings {
  burstLimit?: number;
  rateLimit?: number;
}
export const ThrottleSettings = S.suspend(() =>
  S.Struct({
    burstLimit: S.optional(S.Number),
    rateLimit: S.optional(S.Number),
  }),
).annotations({
  identifier: "ThrottleSettings",
}) as any as S.Schema<ThrottleSettings>;
export interface Account {
  cloudwatchRoleArn?: string;
  throttleSettings?: ThrottleSettings;
  features?: string[];
  apiKeyVersion?: string;
}
export const Account = S.suspend(() =>
  S.Struct({
    cloudwatchRoleArn: S.optional(S.String),
    throttleSettings: S.optional(ThrottleSettings),
    features: S.optional(ListOfString),
    apiKeyVersion: S.optional(S.String),
  }),
).annotations({ identifier: "Account" }) as any as S.Schema<Account>;
export interface GetApiKeyRequest {
  apiKey: string;
  includeValue?: boolean;
}
export const GetApiKeyRequest = S.suspend(() =>
  S.Struct({
    apiKey: S.String.pipe(T.HttpLabel("apiKey")),
    includeValue: S.optional(S.Boolean).pipe(T.HttpQuery("includeValue")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/apikeys/{apiKey}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApiKeyRequest",
}) as any as S.Schema<GetApiKeyRequest>;
export interface GetApiKeysRequest {
  position?: string;
  limit?: number;
  nameQuery?: string;
  customerId?: string;
  includeValues?: boolean;
}
export const GetApiKeysRequest = S.suspend(() =>
  S.Struct({
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    nameQuery: S.optional(S.String).pipe(T.HttpQuery("name")),
    customerId: S.optional(S.String).pipe(T.HttpQuery("customerId")),
    includeValues: S.optional(S.Boolean).pipe(T.HttpQuery("includeValues")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/apikeys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApiKeysRequest",
}) as any as S.Schema<GetApiKeysRequest>;
export interface GetAuthorizerRequest {
  restApiId: string;
  authorizerId: string;
}
export const GetAuthorizerRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    authorizerId: S.String.pipe(T.HttpLabel("authorizerId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/authorizers/{authorizerId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAuthorizerRequest",
}) as any as S.Schema<GetAuthorizerRequest>;
export interface GetAuthorizersRequest {
  restApiId: string;
  position?: string;
  limit?: number;
}
export const GetAuthorizersRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/restapis/{restApiId}/authorizers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAuthorizersRequest",
}) as any as S.Schema<GetAuthorizersRequest>;
export interface GetBasePathMappingRequest {
  domainName: string;
  domainNameId?: string;
  basePath: string;
}
export const GetBasePathMappingRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    basePath: S.String.pipe(T.HttpLabel("basePath")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domainnames/{domainName}/basepathmappings/{basePath}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBasePathMappingRequest",
}) as any as S.Schema<GetBasePathMappingRequest>;
export interface GetBasePathMappingsRequest {
  domainName: string;
  domainNameId?: string;
  position?: string;
  limit?: number;
}
export const GetBasePathMappingsRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/domainnames/{domainName}/basepathmappings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBasePathMappingsRequest",
}) as any as S.Schema<GetBasePathMappingsRequest>;
export interface GetClientCertificateRequest {
  clientCertificateId: string;
}
export const GetClientCertificateRequest = S.suspend(() =>
  S.Struct({
    clientCertificateId: S.String.pipe(T.HttpLabel("clientCertificateId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/clientcertificates/{clientCertificateId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetClientCertificateRequest",
}) as any as S.Schema<GetClientCertificateRequest>;
export interface GetClientCertificatesRequest {
  position?: string;
  limit?: number;
}
export const GetClientCertificatesRequest = S.suspend(() =>
  S.Struct({
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/clientcertificates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetClientCertificatesRequest",
}) as any as S.Schema<GetClientCertificatesRequest>;
export interface GetDeploymentRequest {
  restApiId: string;
  deploymentId: string;
  embed?: string[];
}
export const GetDeploymentRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    deploymentId: S.String.pipe(T.HttpLabel("deploymentId")),
    embed: S.optional(ListOfString).pipe(T.HttpQuery("embed")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/deployments/{deploymentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeploymentRequest",
}) as any as S.Schema<GetDeploymentRequest>;
export interface GetDeploymentsRequest {
  restApiId: string;
  position?: string;
  limit?: number;
}
export const GetDeploymentsRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/restapis/{restApiId}/deployments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeploymentsRequest",
}) as any as S.Schema<GetDeploymentsRequest>;
export interface GetDocumentationPartRequest {
  restApiId: string;
  documentationPartId: string;
}
export const GetDocumentationPartRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationPartId: S.String.pipe(T.HttpLabel("documentationPartId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/documentation/parts/{documentationPartId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDocumentationPartRequest",
}) as any as S.Schema<GetDocumentationPartRequest>;
export interface GetDocumentationPartsRequest {
  restApiId: string;
  type?: DocumentationPartType;
  nameQuery?: string;
  path?: string;
  position?: string;
  limit?: number;
  locationStatus?: LocationStatusType;
}
export const GetDocumentationPartsRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    type: S.optional(DocumentationPartType).pipe(T.HttpQuery("type")),
    nameQuery: S.optional(S.String).pipe(T.HttpQuery("name")),
    path: S.optional(S.String).pipe(T.HttpQuery("path")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    locationStatus: S.optional(LocationStatusType).pipe(
      T.HttpQuery("locationStatus"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/documentation/parts",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDocumentationPartsRequest",
}) as any as S.Schema<GetDocumentationPartsRequest>;
export interface GetDocumentationVersionRequest {
  restApiId: string;
  documentationVersion: string;
}
export const GetDocumentationVersionRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationVersion: S.String.pipe(T.HttpLabel("documentationVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/documentation/versions/{documentationVersion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDocumentationVersionRequest",
}) as any as S.Schema<GetDocumentationVersionRequest>;
export interface GetDocumentationVersionsRequest {
  restApiId: string;
  position?: string;
  limit?: number;
}
export const GetDocumentationVersionsRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/documentation/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDocumentationVersionsRequest",
}) as any as S.Schema<GetDocumentationVersionsRequest>;
export interface GetDomainNameRequest {
  domainName: string;
  domainNameId?: string;
}
export const GetDomainNameRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domainnames/{domainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainNameRequest",
}) as any as S.Schema<GetDomainNameRequest>;
export interface GetDomainNameAccessAssociationsRequest {
  position?: string;
  limit?: number;
  resourceOwner?: ResourceOwner;
}
export const GetDomainNameAccessAssociationsRequest = S.suspend(() =>
  S.Struct({
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    resourceOwner: S.optional(ResourceOwner).pipe(T.HttpQuery("resourceOwner")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domainnameaccessassociations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainNameAccessAssociationsRequest",
}) as any as S.Schema<GetDomainNameAccessAssociationsRequest>;
export interface GetDomainNamesRequest {
  position?: string;
  limit?: number;
  resourceOwner?: ResourceOwner;
}
export const GetDomainNamesRequest = S.suspend(() =>
  S.Struct({
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    resourceOwner: S.optional(ResourceOwner).pipe(T.HttpQuery("resourceOwner")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/domainnames" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainNamesRequest",
}) as any as S.Schema<GetDomainNamesRequest>;
export interface GetExportRequest {
  restApiId: string;
  stageName: string;
  exportType: string;
  parameters?: { [key: string]: string | undefined };
  accepts?: string;
}
export const GetExportRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
    exportType: S.String.pipe(T.HttpLabel("exportType")),
    parameters: S.optional(MapOfStringToString).pipe(T.HttpQueryParams()),
    accepts: S.optional(S.String).pipe(T.HttpHeader("Accept")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/stages/{stageName}/exports/{exportType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetExportRequest",
}) as any as S.Schema<GetExportRequest>;
export interface GetGatewayResponseRequest {
  restApiId: string;
  responseType: GatewayResponseType;
}
export const GetGatewayResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    responseType: GatewayResponseType.pipe(T.HttpLabel("responseType")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/gatewayresponses/{responseType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGatewayResponseRequest",
}) as any as S.Schema<GetGatewayResponseRequest>;
export interface GetGatewayResponsesRequest {
  restApiId: string;
  position?: string;
  limit?: number;
}
export const GetGatewayResponsesRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/restapis/{restApiId}/gatewayresponses" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGatewayResponsesRequest",
}) as any as S.Schema<GetGatewayResponsesRequest>;
export interface GetIntegrationRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
}
export const GetIntegrationRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/integration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIntegrationRequest",
}) as any as S.Schema<GetIntegrationRequest>;
export interface GetIntegrationResponseRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  statusCode: string;
}
export const GetIntegrationResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/integration/responses/{statusCode}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIntegrationResponseRequest",
}) as any as S.Schema<GetIntegrationResponseRequest>;
export interface GetMethodRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
}
export const GetMethodRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMethodRequest",
}) as any as S.Schema<GetMethodRequest>;
export interface GetMethodResponseRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  statusCode: string;
}
export const GetMethodResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/responses/{statusCode}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMethodResponseRequest",
}) as any as S.Schema<GetMethodResponseRequest>;
export interface GetModelRequest {
  restApiId: string;
  modelName: string;
  flatten?: boolean;
}
export const GetModelRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    modelName: S.String.pipe(T.HttpLabel("modelName")),
    flatten: S.optional(S.Boolean).pipe(T.HttpQuery("flatten")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/models/{modelName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetModelRequest",
}) as any as S.Schema<GetModelRequest>;
export interface GetModelsRequest {
  restApiId: string;
  position?: string;
  limit?: number;
}
export const GetModelsRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/restapis/{restApiId}/models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetModelsRequest",
}) as any as S.Schema<GetModelsRequest>;
export interface GetModelTemplateRequest {
  restApiId: string;
  modelName: string;
}
export const GetModelTemplateRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    modelName: S.String.pipe(T.HttpLabel("modelName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/models/{modelName}/default_template",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetModelTemplateRequest",
}) as any as S.Schema<GetModelTemplateRequest>;
export interface GetRequestValidatorRequest {
  restApiId: string;
  requestValidatorId: string;
}
export const GetRequestValidatorRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    requestValidatorId: S.String.pipe(T.HttpLabel("requestValidatorId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/requestvalidators/{requestValidatorId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRequestValidatorRequest",
}) as any as S.Schema<GetRequestValidatorRequest>;
export interface GetRequestValidatorsRequest {
  restApiId: string;
  position?: string;
  limit?: number;
}
export const GetRequestValidatorsRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/restapis/{restApiId}/requestvalidators" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRequestValidatorsRequest",
}) as any as S.Schema<GetRequestValidatorsRequest>;
export interface GetResourceRequest {
  restApiId: string;
  resourceId: string;
  embed?: string[];
}
export const GetResourceRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    embed: S.optional(ListOfString).pipe(T.HttpQuery("embed")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/resources/{resourceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceRequest",
}) as any as S.Schema<GetResourceRequest>;
export interface GetResourcesRequest {
  restApiId: string;
  position?: string;
  limit?: number;
  embed?: string[];
}
export const GetResourcesRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    embed: S.optional(ListOfString).pipe(T.HttpQuery("embed")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/restapis/{restApiId}/resources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcesRequest",
}) as any as S.Schema<GetResourcesRequest>;
export interface GetRestApiRequest {
  restApiId: string;
}
export const GetRestApiRequest = S.suspend(() =>
  S.Struct({ restApiId: S.String.pipe(T.HttpLabel("restApiId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/restapis/{restApiId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRestApiRequest",
}) as any as S.Schema<GetRestApiRequest>;
export interface GetRestApisRequest {
  position?: string;
  limit?: number;
}
export const GetRestApisRequest = S.suspend(() =>
  S.Struct({
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/restapis" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRestApisRequest",
}) as any as S.Schema<GetRestApisRequest>;
export interface GetSdkRequest {
  restApiId: string;
  stageName: string;
  sdkType: string;
  parameters?: { [key: string]: string | undefined };
}
export const GetSdkRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
    sdkType: S.String.pipe(T.HttpLabel("sdkType")),
    parameters: S.optional(MapOfStringToString).pipe(T.HttpQueryParams()),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/stages/{stageName}/sdks/{sdkType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSdkRequest",
}) as any as S.Schema<GetSdkRequest>;
export interface GetSdkTypeRequest {
  id: string;
}
export const GetSdkTypeRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sdktypes/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSdkTypeRequest",
}) as any as S.Schema<GetSdkTypeRequest>;
export interface GetSdkTypesRequest {
  position?: string;
  limit?: number;
}
export const GetSdkTypesRequest = S.suspend(() =>
  S.Struct({
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sdktypes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSdkTypesRequest",
}) as any as S.Schema<GetSdkTypesRequest>;
export interface GetStageRequest {
  restApiId: string;
  stageName: string;
}
export const GetStageRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/restapis/{restApiId}/stages/{stageName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStageRequest",
}) as any as S.Schema<GetStageRequest>;
export interface GetStagesRequest {
  restApiId: string;
  deploymentId?: string;
}
export const GetStagesRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    deploymentId: S.optional(S.String).pipe(T.HttpQuery("deploymentId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/restapis/{restApiId}/stages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStagesRequest",
}) as any as S.Schema<GetStagesRequest>;
export interface GetTagsRequest {
  resourceArn: string;
  position?: string;
  limit?: number;
}
export const GetTagsRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
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
  identifier: "GetTagsRequest",
}) as any as S.Schema<GetTagsRequest>;
export interface GetUsageRequest {
  usagePlanId: string;
  keyId?: string;
  startDate: string;
  endDate: string;
  position?: string;
  limit?: number;
}
export const GetUsageRequest = S.suspend(() =>
  S.Struct({
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    keyId: S.optional(S.String).pipe(T.HttpQuery("keyId")),
    startDate: S.String.pipe(T.HttpQuery("startDate")),
    endDate: S.String.pipe(T.HttpQuery("endDate")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/usageplans/{usagePlanId}/usage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUsageRequest",
}) as any as S.Schema<GetUsageRequest>;
export interface GetUsagePlanRequest {
  usagePlanId: string;
}
export const GetUsagePlanRequest = S.suspend(() =>
  S.Struct({ usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/usageplans/{usagePlanId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUsagePlanRequest",
}) as any as S.Schema<GetUsagePlanRequest>;
export interface GetUsagePlanKeyRequest {
  usagePlanId: string;
  keyId: string;
}
export const GetUsagePlanKeyRequest = S.suspend(() =>
  S.Struct({
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    keyId: S.String.pipe(T.HttpLabel("keyId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/usageplans/{usagePlanId}/keys/{keyId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUsagePlanKeyRequest",
}) as any as S.Schema<GetUsagePlanKeyRequest>;
export interface GetUsagePlanKeysRequest {
  usagePlanId: string;
  position?: string;
  limit?: number;
  nameQuery?: string;
}
export const GetUsagePlanKeysRequest = S.suspend(() =>
  S.Struct({
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    nameQuery: S.optional(S.String).pipe(T.HttpQuery("name")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/usageplans/{usagePlanId}/keys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUsagePlanKeysRequest",
}) as any as S.Schema<GetUsagePlanKeysRequest>;
export interface GetUsagePlansRequest {
  position?: string;
  keyId?: string;
  limit?: number;
}
export const GetUsagePlansRequest = S.suspend(() =>
  S.Struct({
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    keyId: S.optional(S.String).pipe(T.HttpQuery("keyId")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/usageplans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUsagePlansRequest",
}) as any as S.Schema<GetUsagePlansRequest>;
export interface GetVpcLinkRequest {
  vpcLinkId: string;
}
export const GetVpcLinkRequest = S.suspend(() =>
  S.Struct({ vpcLinkId: S.String.pipe(T.HttpLabel("vpcLinkId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/vpclinks/{vpcLinkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVpcLinkRequest",
}) as any as S.Schema<GetVpcLinkRequest>;
export interface GetVpcLinksRequest {
  position?: string;
  limit?: number;
}
export const GetVpcLinksRequest = S.suspend(() =>
  S.Struct({
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/vpclinks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVpcLinksRequest",
}) as any as S.Schema<GetVpcLinksRequest>;
export interface ImportApiKeysRequest {
  body: T.StreamingInputBody;
  format: ApiKeysFormat;
  failOnWarnings?: boolean;
}
export const ImportApiKeysRequest = S.suspend(() =>
  S.Struct({
    body: T.StreamingInput.pipe(T.HttpPayload()),
    format: ApiKeysFormat.pipe(T.HttpQuery("format")),
    failOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failonwarnings")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/apikeys?mode=import" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportApiKeysRequest",
}) as any as S.Schema<ImportApiKeysRequest>;
export interface ImportDocumentationPartsRequest {
  restApiId: string;
  mode?: PutMode;
  failOnWarnings?: boolean;
  body: T.StreamingInputBody;
}
export const ImportDocumentationPartsRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    mode: S.optional(PutMode).pipe(T.HttpQuery("mode")),
    failOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failonwarnings")),
    body: T.StreamingInput.pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/restapis/{restApiId}/documentation/parts",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportDocumentationPartsRequest",
}) as any as S.Schema<ImportDocumentationPartsRequest>;
export interface ImportRestApiRequest {
  failOnWarnings?: boolean;
  parameters?: { [key: string]: string | undefined };
  body: T.StreamingInputBody;
}
export const ImportRestApiRequest = S.suspend(() =>
  S.Struct({
    failOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failonwarnings")),
    parameters: S.optional(MapOfStringToString).pipe(T.HttpQueryParams()),
    body: T.StreamingInput.pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/restapis?mode=import" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportRestApiRequest",
}) as any as S.Schema<ImportRestApiRequest>;
export interface PutGatewayResponseRequest {
  restApiId: string;
  responseType: GatewayResponseType;
  statusCode?: string;
  responseParameters?: { [key: string]: string | undefined };
  responseTemplates?: { [key: string]: string | undefined };
}
export const PutGatewayResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    responseType: GatewayResponseType.pipe(T.HttpLabel("responseType")),
    statusCode: S.optional(S.String),
    responseParameters: S.optional(MapOfStringToString),
    responseTemplates: S.optional(MapOfStringToString),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/restapis/{restApiId}/gatewayresponses/{responseType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutGatewayResponseRequest",
}) as any as S.Schema<PutGatewayResponseRequest>;
export interface PutIntegrationResponseRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  statusCode: string;
  selectionPattern?: string;
  responseParameters?: { [key: string]: string | undefined };
  responseTemplates?: { [key: string]: string | undefined };
  contentHandling?: ContentHandlingStrategy;
}
export const PutIntegrationResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
    selectionPattern: S.optional(S.String),
    responseParameters: S.optional(MapOfStringToString),
    responseTemplates: S.optional(MapOfStringToString),
    contentHandling: S.optional(ContentHandlingStrategy),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/integration/responses/{statusCode}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutIntegrationResponseRequest",
}) as any as S.Schema<PutIntegrationResponseRequest>;
export type MapOfStringToBoolean = { [key: string]: boolean | undefined };
export const MapOfStringToBoolean = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.Boolean),
});
export interface PutMethodResponseRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  statusCode: string;
  responseParameters?: { [key: string]: boolean | undefined };
  responseModels?: { [key: string]: string | undefined };
}
export const PutMethodResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
    responseParameters: S.optional(MapOfStringToBoolean),
    responseModels: S.optional(MapOfStringToString),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/responses/{statusCode}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutMethodResponseRequest",
}) as any as S.Schema<PutMethodResponseRequest>;
export interface PutRestApiRequest {
  restApiId: string;
  mode?: PutMode;
  failOnWarnings?: boolean;
  parameters?: { [key: string]: string | undefined };
  body: T.StreamingInputBody;
}
export const PutRestApiRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    mode: S.optional(PutMode).pipe(T.HttpQuery("mode")),
    failOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failonwarnings")),
    parameters: S.optional(MapOfStringToString).pipe(T.HttpQueryParams()),
    body: T.StreamingInput.pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/restapis/{restApiId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRestApiRequest",
}) as any as S.Schema<PutRestApiRequest>;
export interface RejectDomainNameAccessAssociationRequest {
  domainNameAccessAssociationArn: string;
  domainNameArn: string;
}
export const RejectDomainNameAccessAssociationRequest = S.suspend(() =>
  S.Struct({
    domainNameAccessAssociationArn: S.String.pipe(
      T.HttpQuery("domainNameAccessAssociationArn"),
    ),
    domainNameArn: S.String.pipe(T.HttpQuery("domainNameArn")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/rejectdomainnameaccessassociations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectDomainNameAccessAssociationRequest",
}) as any as S.Schema<RejectDomainNameAccessAssociationRequest>;
export interface RejectDomainNameAccessAssociationResponse {}
export const RejectDomainNameAccessAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RejectDomainNameAccessAssociationResponse",
}) as any as S.Schema<RejectDomainNameAccessAssociationResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: MapOfStringToString,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/tags/{resourceArn}" }),
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
export type MapOfStringToList = { [key: string]: string[] | undefined };
export const MapOfStringToList = S.Record({
  key: S.String,
  value: S.UndefinedOr(ListOfString),
});
export interface TestInvokeMethodRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  pathWithQueryString?: string;
  body?: string;
  headers?: { [key: string]: string | undefined };
  multiValueHeaders?: { [key: string]: string[] | undefined };
  clientCertificateId?: string;
  stageVariables?: { [key: string]: string | undefined };
}
export const TestInvokeMethodRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    pathWithQueryString: S.optional(S.String),
    body: S.optional(S.String),
    headers: S.optional(MapOfStringToString),
    multiValueHeaders: S.optional(MapOfStringToList),
    clientCertificateId: S.optional(S.String),
    stageVariables: S.optional(MapOfStringToString),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestInvokeMethodRequest",
}) as any as S.Schema<TestInvokeMethodRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: ListOfString.pipe(T.HttpQuery("tagKeys")),
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
export type Op =
  | "add"
  | "remove"
  | "replace"
  | "move"
  | "copy"
  | "test"
  | (string & {});
export const Op = S.String;
export interface PatchOperation {
  op?: Op;
  path?: string;
  value?: string;
  from?: string;
}
export const PatchOperation = S.suspend(() =>
  S.Struct({
    op: S.optional(Op),
    path: S.optional(S.String),
    value: S.optional(S.String),
    from: S.optional(S.String),
  }),
).annotations({
  identifier: "PatchOperation",
}) as any as S.Schema<PatchOperation>;
export type ListOfPatchOperation = PatchOperation[];
export const ListOfPatchOperation = S.Array(PatchOperation);
export interface UpdateApiKeyRequest {
  apiKey: string;
  patchOperations?: PatchOperation[];
}
export const UpdateApiKeyRequest = S.suspend(() =>
  S.Struct({
    apiKey: S.String.pipe(T.HttpLabel("apiKey")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/apikeys/{apiKey}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApiKeyRequest",
}) as any as S.Schema<UpdateApiKeyRequest>;
export interface UpdateAuthorizerRequest {
  restApiId: string;
  authorizerId: string;
  patchOperations?: PatchOperation[];
}
export const UpdateAuthorizerRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    authorizerId: S.String.pipe(T.HttpLabel("authorizerId")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/authorizers/{authorizerId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAuthorizerRequest",
}) as any as S.Schema<UpdateAuthorizerRequest>;
export interface UpdateBasePathMappingRequest {
  domainName: string;
  domainNameId?: string;
  basePath: string;
  patchOperations?: PatchOperation[];
}
export const UpdateBasePathMappingRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    basePath: S.String.pipe(T.HttpLabel("basePath")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/domainnames/{domainName}/basepathmappings/{basePath}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBasePathMappingRequest",
}) as any as S.Schema<UpdateBasePathMappingRequest>;
export interface UpdateClientCertificateRequest {
  clientCertificateId: string;
  patchOperations?: PatchOperation[];
}
export const UpdateClientCertificateRequest = S.suspend(() =>
  S.Struct({
    clientCertificateId: S.String.pipe(T.HttpLabel("clientCertificateId")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/clientcertificates/{clientCertificateId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateClientCertificateRequest",
}) as any as S.Schema<UpdateClientCertificateRequest>;
export interface UpdateDeploymentRequest {
  restApiId: string;
  deploymentId: string;
  patchOperations?: PatchOperation[];
}
export const UpdateDeploymentRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    deploymentId: S.String.pipe(T.HttpLabel("deploymentId")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/deployments/{deploymentId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDeploymentRequest",
}) as any as S.Schema<UpdateDeploymentRequest>;
export interface UpdateDocumentationPartRequest {
  restApiId: string;
  documentationPartId: string;
  patchOperations?: PatchOperation[];
}
export const UpdateDocumentationPartRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationPartId: S.String.pipe(T.HttpLabel("documentationPartId")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/documentation/parts/{documentationPartId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDocumentationPartRequest",
}) as any as S.Schema<UpdateDocumentationPartRequest>;
export interface UpdateDocumentationVersionRequest {
  restApiId: string;
  documentationVersion: string;
  patchOperations?: PatchOperation[];
}
export const UpdateDocumentationVersionRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationVersion: S.String.pipe(T.HttpLabel("documentationVersion")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/documentation/versions/{documentationVersion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDocumentationVersionRequest",
}) as any as S.Schema<UpdateDocumentationVersionRequest>;
export interface UpdateDomainNameRequest {
  domainName: string;
  domainNameId?: string;
  patchOperations?: PatchOperation[];
}
export const UpdateDomainNameRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/domainnames/{domainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDomainNameRequest",
}) as any as S.Schema<UpdateDomainNameRequest>;
export interface UpdateGatewayResponseRequest {
  restApiId: string;
  responseType: GatewayResponseType;
  patchOperations?: PatchOperation[];
}
export const UpdateGatewayResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    responseType: GatewayResponseType.pipe(T.HttpLabel("responseType")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/gatewayresponses/{responseType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGatewayResponseRequest",
}) as any as S.Schema<UpdateGatewayResponseRequest>;
export interface UpdateIntegrationRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  patchOperations?: PatchOperation[];
}
export const UpdateIntegrationRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/integration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIntegrationRequest",
}) as any as S.Schema<UpdateIntegrationRequest>;
export interface UpdateIntegrationResponseRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  statusCode: string;
  patchOperations?: PatchOperation[];
}
export const UpdateIntegrationResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/integration/responses/{statusCode}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIntegrationResponseRequest",
}) as any as S.Schema<UpdateIntegrationResponseRequest>;
export interface UpdateMethodRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  patchOperations?: PatchOperation[];
}
export const UpdateMethodRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMethodRequest",
}) as any as S.Schema<UpdateMethodRequest>;
export interface UpdateMethodResponseRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  statusCode: string;
  patchOperations?: PatchOperation[];
}
export const UpdateMethodResponseRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/responses/{statusCode}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMethodResponseRequest",
}) as any as S.Schema<UpdateMethodResponseRequest>;
export interface UpdateModelRequest {
  restApiId: string;
  modelName: string;
  patchOperations?: PatchOperation[];
}
export const UpdateModelRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    modelName: S.String.pipe(T.HttpLabel("modelName")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/models/{modelName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateModelRequest",
}) as any as S.Schema<UpdateModelRequest>;
export interface UpdateRequestValidatorRequest {
  restApiId: string;
  requestValidatorId: string;
  patchOperations?: PatchOperation[];
}
export const UpdateRequestValidatorRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    requestValidatorId: S.String.pipe(T.HttpLabel("requestValidatorId")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/requestvalidators/{requestValidatorId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRequestValidatorRequest",
}) as any as S.Schema<UpdateRequestValidatorRequest>;
export interface UpdateResourceRequest {
  restApiId: string;
  resourceId: string;
  patchOperations?: PatchOperation[];
}
export const UpdateResourceRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/resources/{resourceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResourceRequest",
}) as any as S.Schema<UpdateResourceRequest>;
export interface UpdateRestApiRequest {
  restApiId: string;
  patchOperations?: PatchOperation[];
}
export const UpdateRestApiRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/restapis/{restApiId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRestApiRequest",
}) as any as S.Schema<UpdateRestApiRequest>;
export interface UpdateStageRequest {
  restApiId: string;
  stageName: string;
  patchOperations?: PatchOperation[];
}
export const UpdateStageRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/restapis/{restApiId}/stages/{stageName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateStageRequest",
}) as any as S.Schema<UpdateStageRequest>;
export interface UpdateUsageRequest {
  usagePlanId: string;
  keyId: string;
  patchOperations?: PatchOperation[];
}
export const UpdateUsageRequest = S.suspend(() =>
  S.Struct({
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    keyId: S.String.pipe(T.HttpLabel("keyId")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/usageplans/{usagePlanId}/keys/{keyId}/usage",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateUsageRequest",
}) as any as S.Schema<UpdateUsageRequest>;
export interface UpdateUsagePlanRequest {
  usagePlanId: string;
  patchOperations?: PatchOperation[];
}
export const UpdateUsagePlanRequest = S.suspend(() =>
  S.Struct({
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/usageplans/{usagePlanId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateUsagePlanRequest",
}) as any as S.Schema<UpdateUsagePlanRequest>;
export interface UpdateVpcLinkRequest {
  vpcLinkId: string;
  patchOperations?: PatchOperation[];
}
export const UpdateVpcLinkRequest = S.suspend(() =>
  S.Struct({
    vpcLinkId: S.String.pipe(T.HttpLabel("vpcLinkId")),
    patchOperations: S.optional(ListOfPatchOperation),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/vpclinks/{vpcLinkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVpcLinkRequest",
}) as any as S.Schema<UpdateVpcLinkRequest>;
export type QuotaPeriodType = "DAY" | "WEEK" | "MONTH" | (string & {});
export const QuotaPeriodType = S.String;
export interface StageKey {
  restApiId?: string;
  stageName?: string;
}
export const StageKey = S.suspend(() =>
  S.Struct({
    restApiId: S.optional(S.String),
    stageName: S.optional(S.String),
  }),
).annotations({ identifier: "StageKey" }) as any as S.Schema<StageKey>;
export type ListOfStageKeys = StageKey[];
export const ListOfStageKeys = S.Array(StageKey);
export interface DeploymentCanarySettings {
  percentTraffic?: number;
  stageVariableOverrides?: { [key: string]: string | undefined };
  useStageCache?: boolean;
}
export const DeploymentCanarySettings = S.suspend(() =>
  S.Struct({
    percentTraffic: S.optional(S.Number),
    stageVariableOverrides: S.optional(MapOfStringToString),
    useStageCache: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DeploymentCanarySettings",
}) as any as S.Schema<DeploymentCanarySettings>;
export interface DocumentationPartLocation {
  type: DocumentationPartType;
  path?: string;
  method?: string;
  statusCode?: string;
  name?: string;
}
export const DocumentationPartLocation = S.suspend(() =>
  S.Struct({
    type: DocumentationPartType,
    path: S.optional(S.String),
    method: S.optional(S.String),
    statusCode: S.optional(S.String),
    name: S.optional(S.String),
  }),
).annotations({
  identifier: "DocumentationPartLocation",
}) as any as S.Schema<DocumentationPartLocation>;
export interface MutualTlsAuthenticationInput {
  truststoreUri?: string;
  truststoreVersion?: string;
}
export const MutualTlsAuthenticationInput = S.suspend(() =>
  S.Struct({
    truststoreUri: S.optional(S.String),
    truststoreVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "MutualTlsAuthenticationInput",
}) as any as S.Schema<MutualTlsAuthenticationInput>;
export type ApiStatus =
  | "UPDATING"
  | "AVAILABLE"
  | "PENDING"
  | "FAILED"
  | (string & {});
export const ApiStatus = S.String;
export interface CanarySettings {
  percentTraffic?: number;
  deploymentId?: string;
  stageVariableOverrides?: { [key: string]: string | undefined };
  useStageCache?: boolean;
}
export const CanarySettings = S.suspend(() =>
  S.Struct({
    percentTraffic: S.optional(S.Number),
    deploymentId: S.optional(S.String),
    stageVariableOverrides: S.optional(MapOfStringToString),
    useStageCache: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CanarySettings",
}) as any as S.Schema<CanarySettings>;
export interface QuotaSettings {
  limit?: number;
  offset?: number;
  period?: QuotaPeriodType;
}
export const QuotaSettings = S.suspend(() =>
  S.Struct({
    limit: S.optional(S.Number),
    offset: S.optional(S.Number),
    period: S.optional(QuotaPeriodType),
  }),
).annotations({
  identifier: "QuotaSettings",
}) as any as S.Schema<QuotaSettings>;
export type VpcLinkStatus =
  | "AVAILABLE"
  | "PENDING"
  | "DELETING"
  | "FAILED"
  | (string & {});
export const VpcLinkStatus = S.String;
export interface ApiKey {
  id?: string;
  value?: string;
  name?: string;
  customerId?: string;
  description?: string;
  enabled?: boolean;
  createdDate?: Date;
  lastUpdatedDate?: Date;
  stageKeys?: string[];
  tags?: { [key: string]: string | undefined };
}
export const ApiKey = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    value: S.optional(S.String),
    name: S.optional(S.String),
    customerId: S.optional(S.String),
    description: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    stageKeys: S.optional(ListOfString),
    tags: S.optional(MapOfStringToString),
  }),
).annotations({ identifier: "ApiKey" }) as any as S.Schema<ApiKey>;
export type ListOfApiKey = ApiKey[];
export const ListOfApiKey = S.Array(ApiKey);
export interface Authorizer {
  id?: string;
  name?: string;
  type?: AuthorizerType;
  providerARNs?: string[];
  authType?: string;
  authorizerUri?: string;
  authorizerCredentials?: string;
  identitySource?: string;
  identityValidationExpression?: string;
  authorizerResultTtlInSeconds?: number;
}
export const Authorizer = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    type: S.optional(AuthorizerType),
    providerARNs: S.optional(ListOfARNs),
    authType: S.optional(S.String),
    authorizerUri: S.optional(S.String),
    authorizerCredentials: S.optional(S.String),
    identitySource: S.optional(S.String),
    identityValidationExpression: S.optional(S.String),
    authorizerResultTtlInSeconds: S.optional(S.Number),
  }),
).annotations({ identifier: "Authorizer" }) as any as S.Schema<Authorizer>;
export type ListOfAuthorizer = Authorizer[];
export const ListOfAuthorizer = S.Array(Authorizer);
export interface BasePathMapping {
  basePath?: string;
  restApiId?: string;
  stage?: string;
}
export const BasePathMapping = S.suspend(() =>
  S.Struct({
    basePath: S.optional(S.String),
    restApiId: S.optional(S.String),
    stage: S.optional(S.String),
  }),
).annotations({
  identifier: "BasePathMapping",
}) as any as S.Schema<BasePathMapping>;
export type ListOfBasePathMapping = BasePathMapping[];
export const ListOfBasePathMapping = S.Array(BasePathMapping);
export interface ClientCertificate {
  clientCertificateId?: string;
  description?: string;
  pemEncodedCertificate?: string;
  createdDate?: Date;
  expirationDate?: Date;
  tags?: { [key: string]: string | undefined };
}
export const ClientCertificate = S.suspend(() =>
  S.Struct({
    clientCertificateId: S.optional(S.String),
    description: S.optional(S.String),
    pemEncodedCertificate: S.optional(S.String),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(MapOfStringToString),
  }),
).annotations({
  identifier: "ClientCertificate",
}) as any as S.Schema<ClientCertificate>;
export type ListOfClientCertificate = ClientCertificate[];
export const ListOfClientCertificate = S.Array(ClientCertificate);
export interface MethodSnapshot {
  authorizationType?: string;
  apiKeyRequired?: boolean;
}
export const MethodSnapshot = S.suspend(() =>
  S.Struct({
    authorizationType: S.optional(S.String),
    apiKeyRequired: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "MethodSnapshot",
}) as any as S.Schema<MethodSnapshot>;
export type MapOfMethodSnapshot = { [key: string]: MethodSnapshot | undefined };
export const MapOfMethodSnapshot = S.Record({
  key: S.String,
  value: S.UndefinedOr(MethodSnapshot),
});
export type PathToMapOfMethodSnapshot = {
  [key: string]: { [key: string]: MethodSnapshot | undefined } | undefined;
};
export const PathToMapOfMethodSnapshot = S.Record({
  key: S.String,
  value: S.UndefinedOr(MapOfMethodSnapshot),
});
export interface Deployment {
  id?: string;
  description?: string;
  createdDate?: Date;
  apiSummary?: {
    [key: string]: { [key: string]: MethodSnapshot | undefined } | undefined;
  };
}
export const Deployment = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    description: S.optional(S.String),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    apiSummary: S.optional(PathToMapOfMethodSnapshot),
  }),
).annotations({ identifier: "Deployment" }) as any as S.Schema<Deployment>;
export type ListOfDeployment = Deployment[];
export const ListOfDeployment = S.Array(Deployment);
export interface DocumentationPart {
  id?: string;
  location?: DocumentationPartLocation;
  properties?: string;
}
export const DocumentationPart = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    location: S.optional(DocumentationPartLocation),
    properties: S.optional(S.String),
  }),
).annotations({
  identifier: "DocumentationPart",
}) as any as S.Schema<DocumentationPart>;
export type ListOfDocumentationPart = DocumentationPart[];
export const ListOfDocumentationPart = S.Array(DocumentationPart);
export interface DocumentationVersion {
  version?: string;
  createdDate?: Date;
  description?: string;
}
export const DocumentationVersion = S.suspend(() =>
  S.Struct({
    version: S.optional(S.String),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "DocumentationVersion",
}) as any as S.Schema<DocumentationVersion>;
export type ListOfDocumentationVersion = DocumentationVersion[];
export const ListOfDocumentationVersion = S.Array(DocumentationVersion);
export type DomainNameStatus =
  | "AVAILABLE"
  | "UPDATING"
  | "PENDING"
  | "PENDING_CERTIFICATE_REIMPORT"
  | "PENDING_OWNERSHIP_VERIFICATION"
  | "FAILED"
  | (string & {});
export const DomainNameStatus = S.String;
export interface DomainNameAccessAssociation {
  domainNameAccessAssociationArn?: string;
  domainNameArn?: string;
  accessAssociationSourceType?: AccessAssociationSourceType;
  accessAssociationSource?: string;
  tags?: { [key: string]: string | undefined };
}
export const DomainNameAccessAssociation = S.suspend(() =>
  S.Struct({
    domainNameAccessAssociationArn: S.optional(S.String),
    domainNameArn: S.optional(S.String),
    accessAssociationSourceType: S.optional(AccessAssociationSourceType),
    accessAssociationSource: S.optional(S.String),
    tags: S.optional(MapOfStringToString),
  }),
).annotations({
  identifier: "DomainNameAccessAssociation",
}) as any as S.Schema<DomainNameAccessAssociation>;
export type ListOfDomainNameAccessAssociation = DomainNameAccessAssociation[];
export const ListOfDomainNameAccessAssociation = S.Array(
  DomainNameAccessAssociation,
);
export interface MutualTlsAuthentication {
  truststoreUri?: string;
  truststoreVersion?: string;
  truststoreWarnings?: string[];
}
export const MutualTlsAuthentication = S.suspend(() =>
  S.Struct({
    truststoreUri: S.optional(S.String),
    truststoreVersion: S.optional(S.String),
    truststoreWarnings: S.optional(ListOfString),
  }),
).annotations({
  identifier: "MutualTlsAuthentication",
}) as any as S.Schema<MutualTlsAuthentication>;
export interface DomainName {
  domainName?: string;
  domainNameId?: string;
  domainNameArn?: string;
  certificateName?: string;
  certificateArn?: string;
  certificateUploadDate?: Date;
  regionalDomainName?: string;
  regionalHostedZoneId?: string;
  regionalCertificateName?: string;
  regionalCertificateArn?: string;
  distributionDomainName?: string;
  distributionHostedZoneId?: string;
  endpointConfiguration?: EndpointConfiguration;
  domainNameStatus?: DomainNameStatus;
  domainNameStatusMessage?: string;
  securityPolicy?: SecurityPolicy;
  endpointAccessMode?: EndpointAccessMode;
  tags?: { [key: string]: string | undefined };
  mutualTlsAuthentication?: MutualTlsAuthentication;
  ownershipVerificationCertificateArn?: string;
  managementPolicy?: string;
  policy?: string;
  routingMode?: RoutingMode;
}
export const DomainName = S.suspend(() =>
  S.Struct({
    domainName: S.optional(S.String),
    domainNameId: S.optional(S.String),
    domainNameArn: S.optional(S.String),
    certificateName: S.optional(S.String),
    certificateArn: S.optional(S.String),
    certificateUploadDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    regionalDomainName: S.optional(S.String),
    regionalHostedZoneId: S.optional(S.String),
    regionalCertificateName: S.optional(S.String),
    regionalCertificateArn: S.optional(S.String),
    distributionDomainName: S.optional(S.String),
    distributionHostedZoneId: S.optional(S.String),
    endpointConfiguration: S.optional(EndpointConfiguration),
    domainNameStatus: S.optional(DomainNameStatus),
    domainNameStatusMessage: S.optional(S.String),
    securityPolicy: S.optional(SecurityPolicy),
    endpointAccessMode: S.optional(EndpointAccessMode),
    tags: S.optional(MapOfStringToString),
    mutualTlsAuthentication: S.optional(MutualTlsAuthentication),
    ownershipVerificationCertificateArn: S.optional(S.String),
    managementPolicy: S.optional(S.String),
    policy: S.optional(S.String),
    routingMode: S.optional(RoutingMode),
  }),
).annotations({ identifier: "DomainName" }) as any as S.Schema<DomainName>;
export type ListOfDomainName = DomainName[];
export const ListOfDomainName = S.Array(DomainName);
export interface GatewayResponse {
  responseType?: GatewayResponseType;
  statusCode?: string;
  responseParameters?: { [key: string]: string | undefined };
  responseTemplates?: { [key: string]: string | undefined };
  defaultResponse?: boolean;
}
export const GatewayResponse = S.suspend(() =>
  S.Struct({
    responseType: S.optional(GatewayResponseType),
    statusCode: S.optional(S.String),
    responseParameters: S.optional(MapOfStringToString),
    responseTemplates: S.optional(MapOfStringToString),
    defaultResponse: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GatewayResponse",
}) as any as S.Schema<GatewayResponse>;
export type ListOfGatewayResponse = GatewayResponse[];
export const ListOfGatewayResponse = S.Array(GatewayResponse);
export interface Model {
  id?: string;
  name?: string;
  description?: string;
  schema?: string;
  contentType?: string;
}
export const Model = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    schema: S.optional(S.String),
    contentType: S.optional(S.String),
  }),
).annotations({ identifier: "Model" }) as any as S.Schema<Model>;
export type ListOfModel = Model[];
export const ListOfModel = S.Array(Model);
export interface RequestValidator {
  id?: string;
  name?: string;
  validateRequestBody?: boolean;
  validateRequestParameters?: boolean;
}
export const RequestValidator = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    validateRequestBody: S.optional(S.Boolean),
    validateRequestParameters: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RequestValidator",
}) as any as S.Schema<RequestValidator>;
export type ListOfRequestValidator = RequestValidator[];
export const ListOfRequestValidator = S.Array(RequestValidator);
export interface MethodResponse {
  statusCode?: string;
  responseParameters?: { [key: string]: boolean | undefined };
  responseModels?: { [key: string]: string | undefined };
}
export const MethodResponse = S.suspend(() =>
  S.Struct({
    statusCode: S.optional(S.String),
    responseParameters: S.optional(MapOfStringToBoolean),
    responseModels: S.optional(MapOfStringToString),
  }),
).annotations({
  identifier: "MethodResponse",
}) as any as S.Schema<MethodResponse>;
export type MapOfMethodResponse = { [key: string]: MethodResponse | undefined };
export const MapOfMethodResponse = S.Record({
  key: S.String,
  value: S.UndefinedOr(MethodResponse),
});
export interface IntegrationResponse {
  statusCode?: string;
  selectionPattern?: string;
  responseParameters?: { [key: string]: string | undefined };
  responseTemplates?: { [key: string]: string | undefined };
  contentHandling?: ContentHandlingStrategy;
}
export const IntegrationResponse = S.suspend(() =>
  S.Struct({
    statusCode: S.optional(S.String),
    selectionPattern: S.optional(S.String),
    responseParameters: S.optional(MapOfStringToString),
    responseTemplates: S.optional(MapOfStringToString),
    contentHandling: S.optional(ContentHandlingStrategy),
  }),
).annotations({
  identifier: "IntegrationResponse",
}) as any as S.Schema<IntegrationResponse>;
export type MapOfIntegrationResponse = {
  [key: string]: IntegrationResponse | undefined;
};
export const MapOfIntegrationResponse = S.Record({
  key: S.String,
  value: S.UndefinedOr(IntegrationResponse),
});
export interface TlsConfig {
  insecureSkipVerification?: boolean;
}
export const TlsConfig = S.suspend(() =>
  S.Struct({ insecureSkipVerification: S.optional(S.Boolean) }),
).annotations({ identifier: "TlsConfig" }) as any as S.Schema<TlsConfig>;
export interface Integration {
  type?: IntegrationType;
  httpMethod?: string;
  uri?: string;
  connectionType?: ConnectionType;
  connectionId?: string;
  credentials?: string;
  requestParameters?: { [key: string]: string | undefined };
  requestTemplates?: { [key: string]: string | undefined };
  passthroughBehavior?: string;
  contentHandling?: ContentHandlingStrategy;
  timeoutInMillis?: number;
  cacheNamespace?: string;
  cacheKeyParameters?: string[];
  integrationResponses?: { [key: string]: IntegrationResponse | undefined };
  tlsConfig?: TlsConfig;
  responseTransferMode?: ResponseTransferMode;
  integrationTarget?: string;
}
export const Integration = S.suspend(() =>
  S.Struct({
    type: S.optional(IntegrationType),
    httpMethod: S.optional(S.String),
    uri: S.optional(S.String),
    connectionType: S.optional(ConnectionType),
    connectionId: S.optional(S.String),
    credentials: S.optional(S.String),
    requestParameters: S.optional(MapOfStringToString),
    requestTemplates: S.optional(MapOfStringToString),
    passthroughBehavior: S.optional(S.String),
    contentHandling: S.optional(ContentHandlingStrategy),
    timeoutInMillis: S.optional(S.Number),
    cacheNamespace: S.optional(S.String),
    cacheKeyParameters: S.optional(ListOfString),
    integrationResponses: S.optional(MapOfIntegrationResponse),
    tlsConfig: S.optional(TlsConfig),
    responseTransferMode: S.optional(ResponseTransferMode),
    integrationTarget: S.optional(S.String),
  }),
).annotations({ identifier: "Integration" }) as any as S.Schema<Integration>;
export interface Method {
  httpMethod?: string;
  authorizationType?: string;
  authorizerId?: string;
  apiKeyRequired?: boolean;
  requestValidatorId?: string;
  operationName?: string;
  requestParameters?: { [key: string]: boolean | undefined };
  requestModels?: { [key: string]: string | undefined };
  methodResponses?: { [key: string]: MethodResponse | undefined };
  methodIntegration?: Integration;
  authorizationScopes?: string[];
}
export const Method = S.suspend(() =>
  S.Struct({
    httpMethod: S.optional(S.String),
    authorizationType: S.optional(S.String),
    authorizerId: S.optional(S.String),
    apiKeyRequired: S.optional(S.Boolean),
    requestValidatorId: S.optional(S.String),
    operationName: S.optional(S.String),
    requestParameters: S.optional(MapOfStringToBoolean),
    requestModels: S.optional(MapOfStringToString),
    methodResponses: S.optional(MapOfMethodResponse),
    methodIntegration: S.optional(Integration),
    authorizationScopes: S.optional(ListOfString),
  }),
).annotations({ identifier: "Method" }) as any as S.Schema<Method>;
export type MapOfMethod = { [key: string]: Method | undefined };
export const MapOfMethod = S.Record({
  key: S.String,
  value: S.UndefinedOr(Method),
});
export interface Resource {
  id?: string;
  parentId?: string;
  pathPart?: string;
  path?: string;
  resourceMethods?: { [key: string]: Method | undefined };
}
export const Resource = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    parentId: S.optional(S.String),
    pathPart: S.optional(S.String),
    path: S.optional(S.String),
    resourceMethods: S.optional(MapOfMethod),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type ListOfResource = Resource[];
export const ListOfResource = S.Array(Resource);
export interface RestApi {
  id?: string;
  name?: string;
  description?: string;
  createdDate?: Date;
  version?: string;
  warnings?: string[];
  binaryMediaTypes?: string[];
  minimumCompressionSize?: number;
  apiKeySource?: ApiKeySourceType;
  endpointConfiguration?: EndpointConfiguration;
  policy?: string;
  tags?: { [key: string]: string | undefined };
  disableExecuteApiEndpoint?: boolean;
  rootResourceId?: string;
  securityPolicy?: SecurityPolicy;
  endpointAccessMode?: EndpointAccessMode;
  apiStatus?: ApiStatus;
  apiStatusMessage?: string;
}
export const RestApi = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    version: S.optional(S.String),
    warnings: S.optional(ListOfString),
    binaryMediaTypes: S.optional(ListOfString),
    minimumCompressionSize: S.optional(S.Number),
    apiKeySource: S.optional(ApiKeySourceType),
    endpointConfiguration: S.optional(EndpointConfiguration),
    policy: S.optional(S.String),
    tags: S.optional(MapOfStringToString),
    disableExecuteApiEndpoint: S.optional(S.Boolean),
    rootResourceId: S.optional(S.String),
    securityPolicy: S.optional(SecurityPolicy),
    endpointAccessMode: S.optional(EndpointAccessMode),
    apiStatus: S.optional(ApiStatus),
    apiStatusMessage: S.optional(S.String),
  }),
).annotations({ identifier: "RestApi" }) as any as S.Schema<RestApi>;
export type ListOfRestApi = RestApi[];
export const ListOfRestApi = S.Array(RestApi);
export interface SdkConfigurationProperty {
  name?: string;
  friendlyName?: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
}
export const SdkConfigurationProperty = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    friendlyName: S.optional(S.String),
    description: S.optional(S.String),
    required: S.optional(S.Boolean),
    defaultValue: S.optional(S.String),
  }),
).annotations({
  identifier: "SdkConfigurationProperty",
}) as any as S.Schema<SdkConfigurationProperty>;
export type ListOfSdkConfigurationProperty = SdkConfigurationProperty[];
export const ListOfSdkConfigurationProperty = S.Array(SdkConfigurationProperty);
export interface SdkType {
  id?: string;
  friendlyName?: string;
  description?: string;
  configurationProperties?: SdkConfigurationProperty[];
}
export const SdkType = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    friendlyName: S.optional(S.String),
    description: S.optional(S.String),
    configurationProperties: S.optional(ListOfSdkConfigurationProperty),
  }),
).annotations({ identifier: "SdkType" }) as any as S.Schema<SdkType>;
export type ListOfSdkType = SdkType[];
export const ListOfSdkType = S.Array(SdkType);
export type CacheClusterStatus =
  | "CREATE_IN_PROGRESS"
  | "AVAILABLE"
  | "DELETE_IN_PROGRESS"
  | "NOT_AVAILABLE"
  | "FLUSH_IN_PROGRESS"
  | (string & {});
export const CacheClusterStatus = S.String;
export type UnauthorizedCacheControlHeaderStrategy =
  | "FAIL_WITH_403"
  | "SUCCEED_WITH_RESPONSE_HEADER"
  | "SUCCEED_WITHOUT_RESPONSE_HEADER"
  | (string & {});
export const UnauthorizedCacheControlHeaderStrategy = S.String;
export interface MethodSetting {
  metricsEnabled?: boolean;
  loggingLevel?: string;
  dataTraceEnabled?: boolean;
  throttlingBurstLimit?: number;
  throttlingRateLimit?: number;
  cachingEnabled?: boolean;
  cacheTtlInSeconds?: number;
  cacheDataEncrypted?: boolean;
  requireAuthorizationForCacheControl?: boolean;
  unauthorizedCacheControlHeaderStrategy?: UnauthorizedCacheControlHeaderStrategy;
}
export const MethodSetting = S.suspend(() =>
  S.Struct({
    metricsEnabled: S.optional(S.Boolean),
    loggingLevel: S.optional(S.String),
    dataTraceEnabled: S.optional(S.Boolean),
    throttlingBurstLimit: S.optional(S.Number),
    throttlingRateLimit: S.optional(S.Number),
    cachingEnabled: S.optional(S.Boolean),
    cacheTtlInSeconds: S.optional(S.Number),
    cacheDataEncrypted: S.optional(S.Boolean),
    requireAuthorizationForCacheControl: S.optional(S.Boolean),
    unauthorizedCacheControlHeaderStrategy: S.optional(
      UnauthorizedCacheControlHeaderStrategy,
    ),
  }),
).annotations({
  identifier: "MethodSetting",
}) as any as S.Schema<MethodSetting>;
export type MapOfMethodSettings = { [key: string]: MethodSetting | undefined };
export const MapOfMethodSettings = S.Record({
  key: S.String,
  value: S.UndefinedOr(MethodSetting),
});
export interface AccessLogSettings {
  format?: string;
  destinationArn?: string;
}
export const AccessLogSettings = S.suspend(() =>
  S.Struct({
    format: S.optional(S.String),
    destinationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AccessLogSettings",
}) as any as S.Schema<AccessLogSettings>;
export interface Stage {
  deploymentId?: string;
  clientCertificateId?: string;
  stageName?: string;
  description?: string;
  cacheClusterEnabled?: boolean;
  cacheClusterSize?: CacheClusterSize;
  cacheClusterStatus?: CacheClusterStatus;
  methodSettings?: { [key: string]: MethodSetting | undefined };
  variables?: { [key: string]: string | undefined };
  documentationVersion?: string;
  accessLogSettings?: AccessLogSettings;
  canarySettings?: CanarySettings;
  tracingEnabled?: boolean;
  webAclArn?: string;
  tags?: { [key: string]: string | undefined };
  createdDate?: Date;
  lastUpdatedDate?: Date;
}
export const Stage = S.suspend(() =>
  S.Struct({
    deploymentId: S.optional(S.String),
    clientCertificateId: S.optional(S.String),
    stageName: S.optional(S.String),
    description: S.optional(S.String),
    cacheClusterEnabled: S.optional(S.Boolean),
    cacheClusterSize: S.optional(CacheClusterSize),
    cacheClusterStatus: S.optional(CacheClusterStatus),
    methodSettings: S.optional(MapOfMethodSettings),
    variables: S.optional(MapOfStringToString),
    documentationVersion: S.optional(S.String),
    accessLogSettings: S.optional(AccessLogSettings),
    canarySettings: S.optional(CanarySettings),
    tracingEnabled: S.optional(S.Boolean),
    webAclArn: S.optional(S.String),
    tags: S.optional(MapOfStringToString),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Stage" }) as any as S.Schema<Stage>;
export type ListOfStage = Stage[];
export const ListOfStage = S.Array(Stage);
export interface UsagePlanKey {
  id?: string;
  type?: string;
  value?: string;
  name?: string;
}
export const UsagePlanKey = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    type: S.optional(S.String),
    value: S.optional(S.String),
    name: S.optional(S.String),
  }),
).annotations({ identifier: "UsagePlanKey" }) as any as S.Schema<UsagePlanKey>;
export type ListOfUsagePlanKey = UsagePlanKey[];
export const ListOfUsagePlanKey = S.Array(UsagePlanKey);
export type MapOfApiStageThrottleSettings = {
  [key: string]: ThrottleSettings | undefined;
};
export const MapOfApiStageThrottleSettings = S.Record({
  key: S.String,
  value: S.UndefinedOr(ThrottleSettings),
});
export interface ApiStage {
  apiId?: string;
  stage?: string;
  throttle?: { [key: string]: ThrottleSettings | undefined };
}
export const ApiStage = S.suspend(() =>
  S.Struct({
    apiId: S.optional(S.String),
    stage: S.optional(S.String),
    throttle: S.optional(MapOfApiStageThrottleSettings),
  }),
).annotations({ identifier: "ApiStage" }) as any as S.Schema<ApiStage>;
export type ListOfApiStage = ApiStage[];
export const ListOfApiStage = S.Array(ApiStage);
export interface UsagePlan {
  id?: string;
  name?: string;
  description?: string;
  apiStages?: ApiStage[];
  throttle?: ThrottleSettings;
  quota?: QuotaSettings;
  productCode?: string;
  tags?: { [key: string]: string | undefined };
}
export const UsagePlan = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    apiStages: S.optional(ListOfApiStage),
    throttle: S.optional(ThrottleSettings),
    quota: S.optional(QuotaSettings),
    productCode: S.optional(S.String),
    tags: S.optional(MapOfStringToString),
  }),
).annotations({ identifier: "UsagePlan" }) as any as S.Schema<UsagePlan>;
export type ListOfUsagePlan = UsagePlan[];
export const ListOfUsagePlan = S.Array(UsagePlan);
export interface VpcLink {
  id?: string;
  name?: string;
  description?: string;
  targetArns?: string[];
  status?: VpcLinkStatus;
  statusMessage?: string;
  tags?: { [key: string]: string | undefined };
}
export const VpcLink = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    targetArns: S.optional(ListOfString),
    status: S.optional(VpcLinkStatus),
    statusMessage: S.optional(S.String),
    tags: S.optional(MapOfStringToString),
  }),
).annotations({ identifier: "VpcLink" }) as any as S.Schema<VpcLink>;
export type ListOfVpcLink = VpcLink[];
export const ListOfVpcLink = S.Array(VpcLink);
export interface CreateApiKeyRequest {
  name?: string;
  description?: string;
  enabled?: boolean;
  generateDistinctId?: boolean;
  value?: string;
  stageKeys?: StageKey[];
  customerId?: string;
  tags?: { [key: string]: string | undefined };
}
export const CreateApiKeyRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    generateDistinctId: S.optional(S.Boolean),
    value: S.optional(S.String),
    stageKeys: S.optional(ListOfStageKeys),
    customerId: S.optional(S.String),
    tags: S.optional(MapOfStringToString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/apikeys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApiKeyRequest",
}) as any as S.Schema<CreateApiKeyRequest>;
export interface CreateDeploymentRequest {
  restApiId: string;
  stageName?: string;
  stageDescription?: string;
  description?: string;
  cacheClusterEnabled?: boolean;
  cacheClusterSize?: CacheClusterSize;
  variables?: { [key: string]: string | undefined };
  canarySettings?: DeploymentCanarySettings;
  tracingEnabled?: boolean;
}
export const CreateDeploymentRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.optional(S.String),
    stageDescription: S.optional(S.String),
    description: S.optional(S.String),
    cacheClusterEnabled: S.optional(S.Boolean),
    cacheClusterSize: S.optional(CacheClusterSize),
    variables: S.optional(MapOfStringToString),
    canarySettings: S.optional(DeploymentCanarySettings),
    tracingEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/restapis/{restApiId}/deployments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDeploymentRequest",
}) as any as S.Schema<CreateDeploymentRequest>;
export interface CreateDocumentationPartRequest {
  restApiId: string;
  location: DocumentationPartLocation;
  properties: string;
}
export const CreateDocumentationPartRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    location: DocumentationPartLocation,
    properties: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/restapis/{restApiId}/documentation/parts",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDocumentationPartRequest",
}) as any as S.Schema<CreateDocumentationPartRequest>;
export interface CreateDomainNameRequest {
  domainName: string;
  certificateName?: string;
  certificateBody?: string;
  certificatePrivateKey?: string;
  certificateChain?: string;
  certificateArn?: string;
  regionalCertificateName?: string;
  regionalCertificateArn?: string;
  endpointConfiguration?: EndpointConfiguration;
  tags?: { [key: string]: string | undefined };
  securityPolicy?: SecurityPolicy;
  endpointAccessMode?: EndpointAccessMode;
  mutualTlsAuthentication?: MutualTlsAuthenticationInput;
  ownershipVerificationCertificateArn?: string;
  policy?: string;
  routingMode?: RoutingMode;
}
export const CreateDomainNameRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String,
    certificateName: S.optional(S.String),
    certificateBody: S.optional(S.String),
    certificatePrivateKey: S.optional(S.String),
    certificateChain: S.optional(S.String),
    certificateArn: S.optional(S.String),
    regionalCertificateName: S.optional(S.String),
    regionalCertificateArn: S.optional(S.String),
    endpointConfiguration: S.optional(EndpointConfiguration),
    tags: S.optional(MapOfStringToString),
    securityPolicy: S.optional(SecurityPolicy),
    endpointAccessMode: S.optional(EndpointAccessMode),
    mutualTlsAuthentication: S.optional(MutualTlsAuthenticationInput),
    ownershipVerificationCertificateArn: S.optional(S.String),
    policy: S.optional(S.String),
    routingMode: S.optional(RoutingMode),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/domainnames" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainNameRequest",
}) as any as S.Schema<CreateDomainNameRequest>;
export interface CreateStageRequest {
  restApiId: string;
  stageName: string;
  deploymentId: string;
  description?: string;
  cacheClusterEnabled?: boolean;
  cacheClusterSize?: CacheClusterSize;
  variables?: { [key: string]: string | undefined };
  documentationVersion?: string;
  canarySettings?: CanarySettings;
  tracingEnabled?: boolean;
  tags?: { [key: string]: string | undefined };
}
export const CreateStageRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String,
    deploymentId: S.String,
    description: S.optional(S.String),
    cacheClusterEnabled: S.optional(S.Boolean),
    cacheClusterSize: S.optional(CacheClusterSize),
    variables: S.optional(MapOfStringToString),
    documentationVersion: S.optional(S.String),
    canarySettings: S.optional(CanarySettings),
    tracingEnabled: S.optional(S.Boolean),
    tags: S.optional(MapOfStringToString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/restapis/{restApiId}/stages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateStageRequest",
}) as any as S.Schema<CreateStageRequest>;
export interface ApiKeys {
  warnings?: string[];
  items?: ApiKey[];
  position?: string;
}
export const ApiKeys = S.suspend(() =>
  S.Struct({
    warnings: S.optional(ListOfString),
    items: S.optional(ListOfApiKey).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({ identifier: "ApiKeys" }) as any as S.Schema<ApiKeys>;
export interface Authorizers {
  items?: Authorizer[];
  position?: string;
}
export const Authorizers = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfAuthorizer).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({ identifier: "Authorizers" }) as any as S.Schema<Authorizers>;
export interface BasePathMappings {
  items?: BasePathMapping[];
  position?: string;
}
export const BasePathMappings = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfBasePathMapping).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({
  identifier: "BasePathMappings",
}) as any as S.Schema<BasePathMappings>;
export interface ClientCertificates {
  items?: ClientCertificate[];
  position?: string;
}
export const ClientCertificates = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfClientCertificate).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({
  identifier: "ClientCertificates",
}) as any as S.Schema<ClientCertificates>;
export interface Deployments {
  items?: Deployment[];
  position?: string;
}
export const Deployments = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfDeployment).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({ identifier: "Deployments" }) as any as S.Schema<Deployments>;
export interface DocumentationParts {
  items?: DocumentationPart[];
  position?: string;
}
export const DocumentationParts = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfDocumentationPart).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({
  identifier: "DocumentationParts",
}) as any as S.Schema<DocumentationParts>;
export interface DocumentationVersions {
  items?: DocumentationVersion[];
  position?: string;
}
export const DocumentationVersions = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfDocumentationVersion).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({
  identifier: "DocumentationVersions",
}) as any as S.Schema<DocumentationVersions>;
export interface DomainNameAccessAssociations {
  items?: DomainNameAccessAssociation[];
  position?: string;
}
export const DomainNameAccessAssociations = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfDomainNameAccessAssociation).pipe(
      T.JsonName("item"),
    ),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({
  identifier: "DomainNameAccessAssociations",
}) as any as S.Schema<DomainNameAccessAssociations>;
export interface DomainNames {
  items?: DomainName[];
  position?: string;
}
export const DomainNames = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfDomainName).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({ identifier: "DomainNames" }) as any as S.Schema<DomainNames>;
export interface ExportResponse {
  contentType?: string;
  contentDisposition?: string;
  body?: T.StreamingOutputBody;
}
export const ExportResponse = S.suspend(() =>
  S.Struct({
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    contentDisposition: S.optional(S.String).pipe(
      T.HttpHeader("Content-Disposition"),
    ),
    body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "ExportResponse",
}) as any as S.Schema<ExportResponse>;
export interface GatewayResponses {
  items?: GatewayResponse[];
  position?: string;
}
export const GatewayResponses = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfGatewayResponse).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({
  identifier: "GatewayResponses",
}) as any as S.Schema<GatewayResponses>;
export interface Models {
  items?: Model[];
  position?: string;
}
export const Models = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfModel).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({ identifier: "Models" }) as any as S.Schema<Models>;
export interface Template {
  value?: string;
}
export const Template = S.suspend(() =>
  S.Struct({ value: S.optional(S.String) }),
).annotations({ identifier: "Template" }) as any as S.Schema<Template>;
export interface RequestValidators {
  items?: RequestValidator[];
  position?: string;
}
export const RequestValidators = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfRequestValidator).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({
  identifier: "RequestValidators",
}) as any as S.Schema<RequestValidators>;
export interface Resources {
  items?: Resource[];
  position?: string;
}
export const Resources = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfResource).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({ identifier: "Resources" }) as any as S.Schema<Resources>;
export interface RestApis {
  items?: RestApi[];
  position?: string;
}
export const RestApis = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfRestApi).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({ identifier: "RestApis" }) as any as S.Schema<RestApis>;
export interface SdkResponse {
  contentType?: string;
  contentDisposition?: string;
  body?: T.StreamingOutputBody;
}
export const SdkResponse = S.suspend(() =>
  S.Struct({
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    contentDisposition: S.optional(S.String).pipe(
      T.HttpHeader("Content-Disposition"),
    ),
    body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  }),
).annotations({ identifier: "SdkResponse" }) as any as S.Schema<SdkResponse>;
export interface SdkTypes {
  items?: SdkType[];
}
export const SdkTypes = S.suspend(() =>
  S.Struct({ items: S.optional(ListOfSdkType).pipe(T.JsonName("item")) }),
).annotations({ identifier: "SdkTypes" }) as any as S.Schema<SdkTypes>;
export interface Stages {
  item?: Stage[];
}
export const Stages = S.suspend(() =>
  S.Struct({ item: S.optional(ListOfStage) }),
).annotations({ identifier: "Stages" }) as any as S.Schema<Stages>;
export interface Tags {
  tags?: { [key: string]: string | undefined };
}
export const Tags = S.suspend(() =>
  S.Struct({ tags: S.optional(MapOfStringToString) }),
).annotations({ identifier: "Tags" }) as any as S.Schema<Tags>;
export interface UsagePlanKeys {
  items?: UsagePlanKey[];
  position?: string;
}
export const UsagePlanKeys = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfUsagePlanKey).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({
  identifier: "UsagePlanKeys",
}) as any as S.Schema<UsagePlanKeys>;
export interface UsagePlans {
  items?: UsagePlan[];
  position?: string;
}
export const UsagePlans = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfUsagePlan).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({ identifier: "UsagePlans" }) as any as S.Schema<UsagePlans>;
export interface VpcLinks {
  items?: VpcLink[];
  position?: string;
}
export const VpcLinks = S.suspend(() =>
  S.Struct({
    items: S.optional(ListOfVpcLink).pipe(T.JsonName("item")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({ identifier: "VpcLinks" }) as any as S.Schema<VpcLinks>;
export interface ApiKeyIds {
  ids?: string[];
  warnings?: string[];
}
export const ApiKeyIds = S.suspend(() =>
  S.Struct({
    ids: S.optional(ListOfString),
    warnings: S.optional(ListOfString),
  }),
).annotations({ identifier: "ApiKeyIds" }) as any as S.Schema<ApiKeyIds>;
export interface DocumentationPartIds {
  ids?: string[];
  warnings?: string[];
}
export const DocumentationPartIds = S.suspend(() =>
  S.Struct({
    ids: S.optional(ListOfString),
    warnings: S.optional(ListOfString),
  }),
).annotations({
  identifier: "DocumentationPartIds",
}) as any as S.Schema<DocumentationPartIds>;
export interface PutIntegrationRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  type: IntegrationType;
  integrationHttpMethod?: string;
  uri?: string;
  connectionType?: ConnectionType;
  connectionId?: string;
  credentials?: string;
  requestParameters?: { [key: string]: string | undefined };
  requestTemplates?: { [key: string]: string | undefined };
  passthroughBehavior?: string;
  cacheNamespace?: string;
  cacheKeyParameters?: string[];
  contentHandling?: ContentHandlingStrategy;
  timeoutInMillis?: number;
  tlsConfig?: TlsConfig;
  responseTransferMode?: ResponseTransferMode;
  integrationTarget?: string;
}
export const PutIntegrationRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(
      T.HttpLabel("httpMethod"),
      T.JsonName("requestHttpMethod"),
    ),
    type: IntegrationType,
    integrationHttpMethod: S.optional(S.String).pipe(T.JsonName("httpMethod")),
    uri: S.optional(S.String),
    connectionType: S.optional(ConnectionType),
    connectionId: S.optional(S.String),
    credentials: S.optional(S.String),
    requestParameters: S.optional(MapOfStringToString),
    requestTemplates: S.optional(MapOfStringToString),
    passthroughBehavior: S.optional(S.String),
    cacheNamespace: S.optional(S.String),
    cacheKeyParameters: S.optional(ListOfString),
    contentHandling: S.optional(ContentHandlingStrategy),
    timeoutInMillis: S.optional(S.Number),
    tlsConfig: S.optional(TlsConfig),
    responseTransferMode: S.optional(ResponseTransferMode),
    integrationTarget: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}/integration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutIntegrationRequest",
}) as any as S.Schema<PutIntegrationRequest>;
export interface PutMethodRequest {
  restApiId: string;
  resourceId: string;
  httpMethod: string;
  authorizationType: string;
  authorizerId?: string;
  apiKeyRequired?: boolean;
  operationName?: string;
  requestParameters?: { [key: string]: boolean | undefined };
  requestModels?: { [key: string]: string | undefined };
  requestValidatorId?: string;
  authorizationScopes?: string[];
}
export const PutMethodRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    authorizationType: S.String,
    authorizerId: S.optional(S.String),
    apiKeyRequired: S.optional(S.Boolean),
    operationName: S.optional(S.String),
    requestParameters: S.optional(MapOfStringToBoolean),
    requestModels: S.optional(MapOfStringToString),
    requestValidatorId: S.optional(S.String),
    authorizationScopes: S.optional(ListOfString),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/restapis/{restApiId}/resources/{resourceId}/methods/{httpMethod}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutMethodRequest",
}) as any as S.Schema<PutMethodRequest>;
export interface TestInvokeAuthorizerRequest {
  restApiId: string;
  authorizerId: string;
  headers?: { [key: string]: string | undefined };
  multiValueHeaders?: { [key: string]: string[] | undefined };
  pathWithQueryString?: string;
  body?: string;
  stageVariables?: { [key: string]: string | undefined };
  additionalContext?: { [key: string]: string | undefined };
}
export const TestInvokeAuthorizerRequest = S.suspend(() =>
  S.Struct({
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    authorizerId: S.String.pipe(T.HttpLabel("authorizerId")),
    headers: S.optional(MapOfStringToString),
    multiValueHeaders: S.optional(MapOfStringToList),
    pathWithQueryString: S.optional(S.String),
    body: S.optional(S.String),
    stageVariables: S.optional(MapOfStringToString),
    additionalContext: S.optional(MapOfStringToString),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/restapis/{restApiId}/authorizers/{authorizerId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestInvokeAuthorizerRequest",
}) as any as S.Schema<TestInvokeAuthorizerRequest>;
export interface TestInvokeMethodResponse {
  status?: number;
  body?: string;
  headers?: { [key: string]: string | undefined };
  multiValueHeaders?: { [key: string]: string[] | undefined };
  log?: string;
  latency?: number;
}
export const TestInvokeMethodResponse = S.suspend(() =>
  S.Struct({
    status: S.optional(S.Number),
    body: S.optional(S.String),
    headers: S.optional(MapOfStringToString),
    multiValueHeaders: S.optional(MapOfStringToList),
    log: S.optional(S.String),
    latency: S.optional(S.Number),
  }),
).annotations({
  identifier: "TestInvokeMethodResponse",
}) as any as S.Schema<TestInvokeMethodResponse>;
export interface UpdateAccountRequest {
  patchOperations?: PatchOperation[];
}
export const UpdateAccountRequest = S.suspend(() =>
  S.Struct({ patchOperations: S.optional(ListOfPatchOperation) }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/account" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccountRequest",
}) as any as S.Schema<UpdateAccountRequest>;
export type ListOfLong = number[];
export const ListOfLong = S.Array(S.Number);
export type ListOfUsage = number[][];
export const ListOfUsage = S.Array(ListOfLong);
export type MapOfKeyUsages = { [key: string]: number[][] | undefined };
export const MapOfKeyUsages = S.Record({
  key: S.String,
  value: S.UndefinedOr(ListOfUsage),
});
export interface CreateUsagePlanRequest {
  name: string;
  description?: string;
  apiStages?: ApiStage[];
  throttle?: ThrottleSettings;
  quota?: QuotaSettings;
  tags?: { [key: string]: string | undefined };
}
export const CreateUsagePlanRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    apiStages: S.optional(ListOfApiStage),
    throttle: S.optional(ThrottleSettings),
    quota: S.optional(QuotaSettings),
    tags: S.optional(MapOfStringToString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/usageplans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUsagePlanRequest",
}) as any as S.Schema<CreateUsagePlanRequest>;
export interface Usage {
  usagePlanId?: string;
  startDate?: string;
  endDate?: string;
  items?: { [key: string]: number[][] | undefined };
  position?: string;
}
export const Usage = S.suspend(() =>
  S.Struct({
    usagePlanId: S.optional(S.String),
    startDate: S.optional(S.String),
    endDate: S.optional(S.String),
    items: S.optional(MapOfKeyUsages).pipe(T.JsonName("values")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
  }),
).annotations({ identifier: "Usage" }) as any as S.Schema<Usage>;
export interface TestInvokeAuthorizerResponse {
  clientStatus?: number;
  log?: string;
  latency?: number;
  principalId?: string;
  policy?: string;
  authorization?: { [key: string]: string[] | undefined };
  claims?: { [key: string]: string | undefined };
}
export const TestInvokeAuthorizerResponse = S.suspend(() =>
  S.Struct({
    clientStatus: S.optional(S.Number),
    log: S.optional(S.String),
    latency: S.optional(S.Number),
    principalId: S.optional(S.String),
    policy: S.optional(S.String),
    authorization: S.optional(MapOfStringToList),
    claims: S.optional(MapOfStringToString),
  }),
).annotations({
  identifier: "TestInvokeAuthorizerResponse",
}) as any as S.Schema<TestInvokeAuthorizerResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
).pipe(C.withThrottlingError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
).pipe(C.withThrottlingError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
).pipe(C.withServerError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Gets a documentation version.
 */
export const getDocumentationVersion: (
  input: GetDocumentationVersionRequest,
) => effect.Effect<
  DocumentationVersion,
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDocumentationVersionRequest,
  output: DocumentationVersion,
  errors: [NotFoundException, TooManyRequestsException, UnauthorizedException],
}));
/**
 * Gets information about a Stage resource.
 */
export const getStage: (
  input: GetStageRequest,
) => effect.Effect<
  Stage,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStageRequest,
  output: Stage,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Represents a domain name that is contained in a simpler, more intuitive URL that can be called.
 */
export const getDomainName: (
  input: GetDomainNameRequest,
) => effect.Effect<
  DomainName,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainNameRequest,
  output: DomainName,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Get the integration settings.
 */
export const getIntegration: (
  input: GetIntegrationRequest,
) => effect.Effect<
  Integration,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntegrationRequest,
  output: Integration,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Describe an existing Method resource.
 */
export const getMethod: (
  input: GetMethodRequest,
) => effect.Effect<
  Method,
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMethodRequest,
  output: Method,
  errors: [NotFoundException, TooManyRequestsException, UnauthorizedException],
}));
/**
 * Gets an SDK type.
 */
export const getSdkType: (
  input: GetSdkTypeRequest,
) => effect.Effect<
  SdkType,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSdkTypeRequest,
  output: SdkType,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the usage data of a usage plan in a specified time interval.
 */
export const getUsage: {
  (
    input: GetUsageRequest,
  ): effect.Effect<
    Usage,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetUsageRequest,
  ) => stream.Stream<
    Usage,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetUsageRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetUsageRequest,
  output: Usage,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Simulate the execution of an Authorizer in your RestApi with headers, parameters, and an incoming request body.
 */
export const testInvokeAuthorizer: (
  input: TestInvokeAuthorizerRequest,
) => effect.Effect<
  TestInvokeAuthorizerResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestInvokeAuthorizerRequest,
  output: TestInvokeAuthorizerResponse,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Exports a deployed version of a RestApi in a specified format.
 */
export const getExport: (
  input: GetExportRequest,
) => effect.Effect<
  ExportResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExportRequest,
  output: ExportResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Generates a client SDK for a RestApi and Stage.
 */
export const getSdk: (
  input: GetSdkRequest,
) => effect.Effect<
  SdkResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSdkRequest,
  output: SdkResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about one or more Stage resources.
 */
export const getStages: (
  input: GetStagesRequest,
) => effect.Effect<
  Stages,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStagesRequest,
  output: Stages,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Import API keys from an external source, such as a CSV-formatted file.
 */
export const importApiKeys: (
  input: ImportApiKeysRequest,
) => effect.Effect<
  ApiKeyIds,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportApiKeysRequest,
  output: ApiKeyIds,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Imports documentation parts
 */
export const importDocumentationParts: (
  input: ImportDocumentationPartsRequest,
) => effect.Effect<
  DocumentationPartIds,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportDocumentationPartsRequest,
  output: DocumentationPartIds,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Sets up a method's integration.
 */
export const putIntegration: (
  input: PutIntegrationRequest,
) => effect.Effect<
  Integration,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutIntegrationRequest,
  output: Integration,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Add a method to an existing Resource resource.
 */
export const putMethod: (
  input: PutMethodRequest,
) => effect.Effect<
  Method,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMethodRequest,
  output: Method,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Changes information about the current Account resource.
 */
export const updateAccount: (
  input: UpdateAccountRequest,
) => effect.Effect<
  Account,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountRequest,
  output: Account,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a Deployment resource. Deleting a deployment will only succeed if there are no Stage resources associated with it.
 */
export const deleteDeployment: (
  input: DeleteDeploymentRequest,
) => effect.Effect<
  DeleteDeploymentResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeploymentRequest,
  output: DeleteDeploymentResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a Stage resource.
 */
export const deleteStage: (
  input: DeleteStageRequest,
) => effect.Effect<
  DeleteStageResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStageRequest,
  output: DeleteStageResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Flushes all authorizer cache entries on a stage.
 */
export const flushStageAuthorizersCache: (
  input: FlushStageAuthorizersCacheRequest,
) => effect.Effect<
  FlushStageAuthorizersCacheResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FlushStageAuthorizersCacheRequest,
  output: FlushStageAuthorizersCacheResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Flushes a stage's cache.
 */
export const flushStageCache: (
  input: FlushStageCacheRequest,
) => effect.Effect<
  FlushStageCacheResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FlushStageCacheRequest,
  output: FlushStageCacheResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * A feature of the API Gateway control service for creating a new API from an external API definition file.
 */
export const importRestApi: (
  input: ImportRestApiRequest,
) => effect.Effect<
  RestApi,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportRestApiRequest,
  output: RestApi,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a customization of a GatewayResponse of a specified response type and status code on the given RestApi.
 */
export const putGatewayResponse: (
  input: PutGatewayResponseRequest,
) => effect.Effect<
  GatewayResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutGatewayResponseRequest,
  output: GatewayResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Represents a put integration.
 */
export const putIntegrationResponse: (
  input: PutIntegrationResponseRequest,
) => effect.Effect<
  IntegrationResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutIntegrationResponseRequest,
  output: IntegrationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Adds a MethodResponse to an existing Method resource.
 */
export const putMethodResponse: (
  input: PutMethodResponseRequest,
) => effect.Effect<
  MethodResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMethodResponseRequest,
  output: MethodResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * A feature of the API Gateway control service for updating an existing API with an input of external API definitions.
 * The update can take the form of merging the supplied definition into the existing API or overwriting the existing API.
 */
export const putRestApi: (
  input: PutRestApiRequest,
) => effect.Effect<
  RestApi,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRestApiRequest,
  output: RestApi,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Adds or updates a tag on a given resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Removes a tag from a given resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Changes information about an ApiKey resource.
 */
export const updateApiKey: (
  input: UpdateApiKeyRequest,
) => effect.Effect<
  ApiKey,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApiKeyRequest,
  output: ApiKey,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates an existing Authorizer resource.
 */
export const updateAuthorizer: (
  input: UpdateAuthorizerRequest,
) => effect.Effect<
  Authorizer,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAuthorizerRequest,
  output: Authorizer,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Changes information about the BasePathMapping resource.
 */
export const updateBasePathMapping: (
  input: UpdateBasePathMappingRequest,
) => effect.Effect<
  BasePathMapping,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBasePathMappingRequest,
  output: BasePathMapping,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Changes information about an ClientCertificate resource.
 */
export const updateClientCertificate: (
  input: UpdateClientCertificateRequest,
) => effect.Effect<
  ClientCertificate,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClientCertificateRequest,
  output: ClientCertificate,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a documentation part.
 */
export const updateDocumentationPart: (
  input: UpdateDocumentationPartRequest,
) => effect.Effect<
  DocumentationPart,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDocumentationPartRequest,
  output: DocumentationPart,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a documentation version.
 */
export const updateDocumentationVersion: (
  input: UpdateDocumentationVersionRequest,
) => effect.Effect<
  DocumentationVersion,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDocumentationVersionRequest,
  output: DocumentationVersion,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Changes information about the DomainName resource.
 */
export const updateDomainName: (
  input: UpdateDomainNameRequest,
) => effect.Effect<
  DomainName,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainNameRequest,
  output: DomainName,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a GatewayResponse of a specified response type on the given RestApi.
 */
export const updateGatewayResponse: (
  input: UpdateGatewayResponseRequest,
) => effect.Effect<
  GatewayResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewayResponseRequest,
  output: GatewayResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Represents an update integration.
 */
export const updateIntegration: (
  input: UpdateIntegrationRequest,
) => effect.Effect<
  Integration,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIntegrationRequest,
  output: Integration,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Represents an update integration response.
 */
export const updateIntegrationResponse: (
  input: UpdateIntegrationResponseRequest,
) => effect.Effect<
  IntegrationResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIntegrationResponseRequest,
  output: IntegrationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates an existing MethodResponse resource.
 */
export const updateMethodResponse: (
  input: UpdateMethodResponseRequest,
) => effect.Effect<
  MethodResponse,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMethodResponseRequest,
  output: MethodResponse,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Changes information about a model. The maximum size of the model is 400 KB.
 */
export const updateModel: (
  input: UpdateModelRequest,
) => effect.Effect<
  Model,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateModelRequest,
  output: Model,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a RequestValidator of a given RestApi.
 */
export const updateRequestValidator: (
  input: UpdateRequestValidatorRequest,
) => effect.Effect<
  RequestValidator,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRequestValidatorRequest,
  output: RequestValidator,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Changes information about the specified API.
 */
export const updateRestApi: (
  input: UpdateRestApiRequest,
) => effect.Effect<
  RestApi,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRestApiRequest,
  output: RestApi,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Changes information about a Stage resource.
 */
export const updateStage: (
  input: UpdateStageRequest,
) => effect.Effect<
  Stage,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStageRequest,
  output: Stage,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Grants a temporary extension to the remaining quota of a usage plan associated with a specified API key.
 */
export const updateUsage: (
  input: UpdateUsageRequest,
) => effect.Effect<
  Usage,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUsageRequest,
  output: Usage,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a usage plan of a given plan Id.
 */
export const updateUsagePlan: (
  input: UpdateUsagePlanRequest,
) => effect.Effect<
  UsagePlan,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUsagePlanRequest,
  output: UsagePlan,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates an existing VpcLink of a specified identifier.
 */
export const updateVpcLink: (
  input: UpdateVpcLinkRequest,
) => effect.Effect<
  VpcLink,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVpcLinkRequest,
  output: VpcLink,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Create an ApiKey resource.
 */
export const createApiKey: (
  input: CreateApiKeyRequest,
) => effect.Effect<
  ApiKey,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApiKeyRequest,
  output: ApiKey,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Adds a new Authorizer resource to an existing RestApi resource.
 */
export const createAuthorizer: (
  input: CreateAuthorizerRequest,
) => effect.Effect<
  Authorizer,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAuthorizerRequest,
  output: Authorizer,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new BasePathMapping resource.
 */
export const createBasePathMapping: (
  input: CreateBasePathMappingRequest,
) => effect.Effect<
  BasePathMapping,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBasePathMappingRequest,
  output: BasePathMapping,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a documentation part.
 */
export const createDocumentationPart: (
  input: CreateDocumentationPartRequest,
) => effect.Effect<
  DocumentationPart,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDocumentationPartRequest,
  output: DocumentationPart,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a documentation version
 */
export const createDocumentationVersion: (
  input: CreateDocumentationVersionRequest,
) => effect.Effect<
  DocumentationVersion,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDocumentationVersionRequest,
  output: DocumentationVersion,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new domain name.
 */
export const createDomainName: (
  input: CreateDomainNameRequest,
) => effect.Effect<
  DomainName,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainNameRequest,
  output: DomainName,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a domain name access association resource between an access association source and a private custom
 * domain name.
 */
export const createDomainNameAccessAssociation: (
  input: CreateDomainNameAccessAssociationRequest,
) => effect.Effect<
  DomainNameAccessAssociation,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainNameAccessAssociationRequest,
  output: DomainNameAccessAssociation,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Adds a new Model resource to an existing RestApi resource.
 */
export const createModel: (
  input: CreateModelRequest,
) => effect.Effect<
  Model,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelRequest,
  output: Model,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a RequestValidator of a given RestApi.
 */
export const createRequestValidator: (
  input: CreateRequestValidatorRequest,
) => effect.Effect<
  RequestValidator,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRequestValidatorRequest,
  output: RequestValidator,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new RestApi resource.
 */
export const createRestApi: (
  input: CreateRestApiRequest,
) => effect.Effect<
  RestApi,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRestApiRequest,
  output: RestApi,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new Stage resource that references a pre-existing Deployment for the API.
 */
export const createStage: (
  input: CreateStageRequest,
) => effect.Effect<
  Stage,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStageRequest,
  output: Stage,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a usage plan key for adding an existing API key to a usage plan.
 */
export const createUsagePlanKey: (
  input: CreateUsagePlanKeyRequest,
) => effect.Effect<
  UsagePlanKey,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUsagePlanKeyRequest,
  output: UsagePlanKey,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a VPC link, under the caller's account in a selected region, in an asynchronous operation that typically takes 2-4 minutes to complete and become operational. The caller must have permissions to create and update VPC Endpoint services.
 */
export const createVpcLink: (
  input: CreateVpcLinkRequest,
) => effect.Effect<
  VpcLink,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcLinkRequest,
  output: VpcLink,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a Resource resource.
 */
export const createResource: (
  input: CreateResourceRequest,
) => effect.Effect<
  Resource,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourceRequest,
  output: Resource,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a usage plan with the throttle and quota limits, as well as the associated API stages, specified in the payload.
 */
export const createUsagePlan: (
  input: CreateUsagePlanRequest,
) => effect.Effect<
  UsagePlan,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUsagePlanRequest,
  output: UsagePlan,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about a Deployments collection.
 */
export const getDeployments: {
  (
    input: GetDeploymentsRequest,
  ): effect.Effect<
    Deployments,
    | BadRequestException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDeploymentsRequest,
  ) => stream.Stream<
    Deployments,
    | BadRequestException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDeploymentsRequest,
  ) => stream.Stream<
    Deployment,
    | BadRequestException
    | NotFoundException
    | ServiceUnavailableException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetDeploymentsRequest,
  output: Deployments,
  errors: [
    BadRequestException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Gets documentation versions.
 */
export const getDocumentationVersions: (
  input: GetDocumentationVersionsRequest,
) => effect.Effect<
  DocumentationVersions,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDocumentationVersionsRequest,
  output: DocumentationVersions,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Represents a collection on DomainNameAccessAssociations resources.
 */
export const getDomainNameAccessAssociations: (
  input: GetDomainNameAccessAssociationsRequest,
) => effect.Effect<
  DomainNameAccessAssociations,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainNameAccessAssociationsRequest,
  output: DomainNameAccessAssociations,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Represents a collection of DomainName resources.
 */
export const getDomainNames: {
  (
    input: GetDomainNamesRequest,
  ): effect.Effect<
    DomainNames,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDomainNamesRequest,
  ) => stream.Stream<
    DomainNames,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDomainNamesRequest,
  ) => stream.Stream<
    DomainName,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetDomainNamesRequest,
  output: DomainNames,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Gets a GatewayResponse of a specified response type on the given RestApi.
 */
export const getGatewayResponse: (
  input: GetGatewayResponseRequest,
) => effect.Effect<
  GatewayResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGatewayResponseRequest,
  output: GatewayResponse,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the GatewayResponses collection on the given RestApi. If an API developer has not added any definitions for gateway responses, the result will be the API Gateway-generated default GatewayResponses collection for the supported response types.
 */
export const getGatewayResponses: (
  input: GetGatewayResponsesRequest,
) => effect.Effect<
  GatewayResponses,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGatewayResponsesRequest,
  output: GatewayResponses,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Represents a get integration response.
 */
export const getIntegrationResponse: (
  input: GetIntegrationResponseRequest,
) => effect.Effect<
  IntegrationResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntegrationResponseRequest,
  output: IntegrationResponse,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Describes a MethodResponse resource.
 */
export const getMethodResponse: (
  input: GetMethodResponseRequest,
) => effect.Effect<
  MethodResponse,
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMethodResponseRequest,
  output: MethodResponse,
  errors: [NotFoundException, TooManyRequestsException, UnauthorizedException],
}));
/**
 * Describes existing Models defined for a RestApi resource.
 */
export const getModels: {
  (
    input: GetModelsRequest,
  ): effect.Effect<
    Models,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetModelsRequest,
  ) => stream.Stream<
    Models,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetModelsRequest,
  ) => stream.Stream<
    Model,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetModelsRequest,
  output: Models,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Generates a sample mapping template that can be used to transform a payload into the structure of a model.
 */
export const getModelTemplate: (
  input: GetModelTemplateRequest,
) => effect.Effect<
  Template,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelTemplateRequest,
  output: Template,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the RequestValidators collection of a given RestApi.
 */
export const getRequestValidators: (
  input: GetRequestValidatorsRequest,
) => effect.Effect<
  RequestValidators,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRequestValidatorsRequest,
  output: RequestValidators,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Lists information about a collection of Resource resources.
 */
export const getResources: {
  (
    input: GetResourcesRequest,
  ): effect.Effect<
    Resources,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourcesRequest,
  ) => stream.Stream<
    Resources,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourcesRequest,
  ) => stream.Stream<
    Resource,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourcesRequest,
  output: Resources,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Lists the RestApis resources for your collection.
 */
export const getRestApis: {
  (
    input: GetRestApisRequest,
  ): effect.Effect<
    RestApis,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetRestApisRequest,
  ) => stream.Stream<
    RestApis,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetRestApisRequest,
  ) => stream.Stream<
    RestApi,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetRestApisRequest,
  output: RestApis,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Gets SDK types
 */
export const getSdkTypes: (
  input: GetSdkTypesRequest,
) => effect.Effect<
  SdkTypes,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSdkTypesRequest,
  output: SdkTypes,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the Tags collection for a given resource.
 */
export const getTags: (
  input: GetTagsRequest,
) => effect.Effect<
  Tags,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTagsRequest,
  output: Tags,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets a usage plan of a given plan identifier.
 */
export const getUsagePlan: (
  input: GetUsagePlanRequest,
) => effect.Effect<
  UsagePlan,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUsagePlanRequest,
  output: UsagePlan,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets all the usage plan keys representing the API keys added to a specified usage plan.
 */
export const getUsagePlanKeys: {
  (
    input: GetUsagePlanKeysRequest,
  ): effect.Effect<
    UsagePlanKeys,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetUsagePlanKeysRequest,
  ) => stream.Stream<
    UsagePlanKeys,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetUsagePlanKeysRequest,
  ) => stream.Stream<
    UsagePlanKey,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetUsagePlanKeysRequest,
  output: UsagePlanKeys,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Gets all the usage plans of the caller's account.
 */
export const getUsagePlans: {
  (
    input: GetUsagePlansRequest,
  ): effect.Effect<
    UsagePlans,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetUsagePlansRequest,
  ) => stream.Stream<
    UsagePlans,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetUsagePlansRequest,
  ) => stream.Stream<
    UsagePlan,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetUsagePlansRequest,
  output: UsagePlans,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Gets the VpcLinks collection under the caller's account in a selected region.
 */
export const getVpcLinks: {
  (
    input: GetVpcLinksRequest,
  ): effect.Effect<
    VpcLinks,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetVpcLinksRequest,
  ) => stream.Stream<
    VpcLinks,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetVpcLinksRequest,
  ) => stream.Stream<
    VpcLink,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetVpcLinksRequest,
  output: VpcLinks,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Simulate the invocation of a Method in your RestApi with headers, parameters, and an incoming request body.
 */
export const testInvokeMethod: (
  input: TestInvokeMethodRequest,
) => effect.Effect<
  TestInvokeMethodResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestInvokeMethodRequest,
  output: TestInvokeMethodResponse,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes an existing Authorizer resource.
 */
export const deleteAuthorizer: (
  input: DeleteAuthorizerRequest,
) => effect.Effect<
  DeleteAuthorizerResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAuthorizerRequest,
  output: DeleteAuthorizerResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the BasePathMapping resource.
 */
export const deleteBasePathMapping: (
  input: DeleteBasePathMappingRequest,
) => effect.Effect<
  DeleteBasePathMappingResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBasePathMappingRequest,
  output: DeleteBasePathMappingResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the ClientCertificate resource.
 */
export const deleteClientCertificate: (
  input: DeleteClientCertificateRequest,
) => effect.Effect<
  DeleteClientCertificateResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClientCertificateRequest,
  output: DeleteClientCertificateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a documentation part
 */
export const deleteDocumentationPart: (
  input: DeleteDocumentationPartRequest,
) => effect.Effect<
  DeleteDocumentationPartResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDocumentationPartRequest,
  output: DeleteDocumentationPartResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a documentation version.
 */
export const deleteDocumentationVersion: (
  input: DeleteDocumentationVersionRequest,
) => effect.Effect<
  DeleteDocumentationVersionResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDocumentationVersionRequest,
  output: DeleteDocumentationVersionResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the DomainName resource.
 */
export const deleteDomainName: (
  input: DeleteDomainNameRequest,
) => effect.Effect<
  DeleteDomainNameResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainNameRequest,
  output: DeleteDomainNameResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the DomainNameAccessAssociation resource.
 *
 * Only the AWS account that created the DomainNameAccessAssociation resource can delete it. To stop an access association source in another AWS account from accessing your private custom domain name, use the RejectDomainNameAccessAssociation operation.
 */
export const deleteDomainNameAccessAssociation: (
  input: DeleteDomainNameAccessAssociationRequest,
) => effect.Effect<
  DeleteDomainNameAccessAssociationResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainNameAccessAssociationRequest,
  output: DeleteDomainNameAccessAssociationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Clears any customization of a GatewayResponse of a specified response type on the given RestApi and resets it with the default settings.
 */
export const deleteGatewayResponse: (
  input: DeleteGatewayResponseRequest,
) => effect.Effect<
  DeleteGatewayResponseResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGatewayResponseRequest,
  output: DeleteGatewayResponseResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Represents a delete integration.
 */
export const deleteIntegration: (
  input: DeleteIntegrationRequest,
) => effect.Effect<
  DeleteIntegrationResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationRequest,
  output: DeleteIntegrationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Represents a delete integration response.
 */
export const deleteIntegrationResponse: (
  input: DeleteIntegrationResponseRequest,
) => effect.Effect<
  DeleteIntegrationResponseResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationResponseRequest,
  output: DeleteIntegrationResponseResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes an existing MethodResponse resource.
 */
export const deleteMethodResponse: (
  input: DeleteMethodResponseRequest,
) => effect.Effect<
  DeleteMethodResponseResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMethodResponseRequest,
  output: DeleteMethodResponseResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a model.
 */
export const deleteModel: (
  input: DeleteModelRequest,
) => effect.Effect<
  DeleteModelResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelRequest,
  output: DeleteModelResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a RequestValidator of a given RestApi.
 */
export const deleteRequestValidator: (
  input: DeleteRequestValidatorRequest,
) => effect.Effect<
  DeleteRequestValidatorResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRequestValidatorRequest,
  output: DeleteRequestValidatorResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a Resource resource.
 */
export const deleteResource: (
  input: DeleteResourceRequest,
) => effect.Effect<
  DeleteResourceResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceRequest,
  output: DeleteResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the specified API.
 */
export const deleteRestApi: (
  input: DeleteRestApiRequest,
) => effect.Effect<
  DeleteRestApiResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRestApiRequest,
  output: DeleteRestApiResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a usage plan of a given plan Id.
 */
export const deleteUsagePlan: (
  input: DeleteUsagePlanRequest,
) => effect.Effect<
  DeleteUsagePlanResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUsagePlanRequest,
  output: DeleteUsagePlanResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a usage plan key and remove the underlying API key from the associated usage plan.
 */
export const deleteUsagePlanKey: (
  input: DeleteUsagePlanKeyRequest,
) => effect.Effect<
  DeleteUsagePlanKeyResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUsagePlanKeyRequest,
  output: DeleteUsagePlanKeyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes an existing VpcLink of a specified identifier.
 */
export const deleteVpcLink: (
  input: DeleteVpcLinkRequest,
) => effect.Effect<
  DeleteVpcLinkResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVpcLinkRequest,
  output: DeleteVpcLinkResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the current Account resource.
 */
export const getAccount: (
  input: GetAccountRequest,
) => effect.Effect<
  Account,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountRequest,
  output: Account,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Describe an existing Authorizer resource.
 */
export const getAuthorizer: (
  input: GetAuthorizerRequest,
) => effect.Effect<
  Authorizer,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAuthorizerRequest,
  output: Authorizer,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Describe a BasePathMapping resource.
 */
export const getBasePathMapping: (
  input: GetBasePathMappingRequest,
) => effect.Effect<
  BasePathMapping,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBasePathMappingRequest,
  output: BasePathMapping,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the current ClientCertificate resource.
 */
export const getClientCertificate: (
  input: GetClientCertificateRequest,
) => effect.Effect<
  ClientCertificate,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClientCertificateRequest,
  output: ClientCertificate,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Describes an existing model defined for a RestApi resource.
 */
export const getModel: (
  input: GetModelRequest,
) => effect.Effect<
  Model,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelRequest,
  output: Model,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets a RequestValidator of a given RestApi.
 */
export const getRequestValidator: (
  input: GetRequestValidatorRequest,
) => effect.Effect<
  RequestValidator,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRequestValidatorRequest,
  output: RequestValidator,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the RestApi resource in the collection.
 */
export const getRestApi: (
  input: GetRestApiRequest,
) => effect.Effect<
  RestApi,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRestApiRequest,
  output: RestApi,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets a usage plan key of a given key identifier.
 */
export const getUsagePlanKey: (
  input: GetUsagePlanKeyRequest,
) => effect.Effect<
  UsagePlanKey,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUsagePlanKeyRequest,
  output: UsagePlanKey,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets a specified VPC link under the caller's account in a region.
 */
export const getVpcLink: (
  input: GetVpcLinkRequest,
) => effect.Effect<
  VpcLink,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVpcLinkRequest,
  output: VpcLink,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Rejects a domain name access association with a private custom domain name.
 *
 * To reject a domain name access association with an access association source in another AWS account, use this operation. To remove a domain name access association with an access association source in your own account, use the DeleteDomainNameAccessAssociation operation.
 */
export const rejectDomainNameAccessAssociation: (
  input: RejectDomainNameAccessAssociationRequest,
) => effect.Effect<
  RejectDomainNameAccessAssociationResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectDomainNameAccessAssociationRequest,
  output: RejectDomainNameAccessAssociationResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Updates an existing Method resource.
 */
export const updateMethod: (
  input: UpdateMethodRequest,
) => effect.Effect<
  Method,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMethodRequest,
  output: Method,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Changes information about a Resource resource.
 */
export const updateResource: (
  input: UpdateResourceRequest,
) => effect.Effect<
  Resource,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceRequest,
  output: Resource,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes the ApiKey resource.
 */
export const deleteApiKey: (
  input: DeleteApiKeyRequest,
) => effect.Effect<
  DeleteApiKeyResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApiKeyRequest,
  output: DeleteApiKeyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Lists information about a resource.
 */
export const getResource: (
  input: GetResourceRequest,
) => effect.Effect<
  Resource,
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceRequest,
  output: Resource,
  errors: [NotFoundException, TooManyRequestsException, UnauthorizedException],
}));
/**
 * Deletes an existing Method resource.
 */
export const deleteMethod: (
  input: DeleteMethodRequest,
) => effect.Effect<
  DeleteMethodResponse,
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMethodRequest,
  output: DeleteMethodResponse,
  errors: [
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the current ApiKey resource.
 */
export const getApiKey: (
  input: GetApiKeyRequest,
) => effect.Effect<
  ApiKey,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApiKeyRequest,
  output: ApiKey,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about the current ApiKeys resource.
 */
export const getApiKeys: {
  (
    input: GetApiKeysRequest,
  ): effect.Effect<
    ApiKeys,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetApiKeysRequest,
  ) => stream.Stream<
    ApiKeys,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetApiKeysRequest,
  ) => stream.Stream<
    ApiKey,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetApiKeysRequest,
  output: ApiKeys,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Describe an existing Authorizers resource.
 */
export const getAuthorizers: (
  input: GetAuthorizersRequest,
) => effect.Effect<
  Authorizers,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAuthorizersRequest,
  output: Authorizers,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Represents a collection of BasePathMapping resources.
 */
export const getBasePathMappings: {
  (
    input: GetBasePathMappingsRequest,
  ): effect.Effect<
    BasePathMappings,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBasePathMappingsRequest,
  ) => stream.Stream<
    BasePathMappings,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBasePathMappingsRequest,
  ) => stream.Stream<
    BasePathMapping,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetBasePathMappingsRequest,
  output: BasePathMappings,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Gets a collection of ClientCertificate resources.
 */
export const getClientCertificates: {
  (
    input: GetClientCertificatesRequest,
  ): effect.Effect<
    ClientCertificates,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetClientCertificatesRequest,
  ) => stream.Stream<
    ClientCertificates,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetClientCertificatesRequest,
  ) => stream.Stream<
    ClientCertificate,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetClientCertificatesRequest,
  output: ClientCertificates,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "position",
    outputToken: "position",
    items: "items",
    pageSize: "limit",
  } as const,
}));
/**
 * Gets a documentation part.
 */
export const getDocumentationPart: (
  input: GetDocumentationPartRequest,
) => effect.Effect<
  DocumentationPart,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDocumentationPartRequest,
  output: DocumentationPart,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets documentation parts.
 */
export const getDocumentationParts: (
  input: GetDocumentationPartsRequest,
) => effect.Effect<
  DocumentationParts,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDocumentationPartsRequest,
  output: DocumentationParts,
  errors: [
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Generates a ClientCertificate resource.
 */
export const generateClientCertificate: (
  input: GenerateClientCertificateRequest,
) => effect.Effect<
  ClientCertificate,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateClientCertificateRequest,
  output: ClientCertificate,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Changes information about a Deployment resource.
 */
export const updateDeployment: (
  input: UpdateDeploymentRequest,
) => effect.Effect<
  Deployment,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDeploymentRequest,
  output: Deployment,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a Deployment resource, which makes a specified RestApi callable over the internet.
 */
export const createDeployment: (
  input: CreateDeploymentRequest,
) => effect.Effect<
  Deployment,
  | BadRequestException
  | ConflictException
  | LimitExceededException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeploymentRequest,
  output: Deployment,
  errors: [
    BadRequestException,
    ConflictException,
    LimitExceededException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Gets information about a Deployment resource.
 */
export const getDeployment: (
  input: GetDeploymentRequest,
) => effect.Effect<
  Deployment,
  | BadRequestException
  | NotFoundException
  | ServiceUnavailableException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentRequest,
  output: Deployment,
  errors: [
    BadRequestException,
    NotFoundException,
    ServiceUnavailableException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
