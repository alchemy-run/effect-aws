import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "API Gateway",
  serviceShapeName: "BackplaneControlService",
});
const auth = T.AwsAuthSigv4({ name: "apigateway" });
const ver = T.ServiceVersion("2015-07-09");
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
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
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
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
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
                      endpoint: {
                        url: "https://apigateway-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
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
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://apigateway-fips.{Region}.{PartitionResult#dnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
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
                      endpoint: {
                        url: "https://apigateway.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
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
              endpoint: {
                url: "https://apigateway.{Region}.{PartitionResult#dnsSuffix}",
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
      error: "Invalid Configuration: Missing Region",
      type: "error",
    },
  ],
});

//# Schemas
export class GetAccountRequest extends S.Class<GetAccountRequest>(
  "GetAccountRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/account" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ListOfARNs = S.Array(S.String);
export const ListOfString = S.Array(S.String);
export class CreateAuthorizerRequest extends S.Class<CreateAuthorizerRequest>(
  "CreateAuthorizerRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    name: S.String,
    type: S.String,
    providerARNs: S.optional(ListOfARNs),
    authType: S.optional(S.String),
    authorizerUri: S.optional(S.String),
    authorizerCredentials: S.optional(S.String),
    identitySource: S.optional(S.String),
    identityValidationExpression: S.optional(S.String),
    authorizerResultTtlInSeconds: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/restapis/{restApiId}/authorizers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBasePathMappingRequest extends S.Class<CreateBasePathMappingRequest>(
  "CreateBasePathMappingRequest",
)(
  {
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    basePath: S.optional(S.String),
    restApiId: S.String,
    stage: S.optional(S.String),
  },
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
) {}
export class CreateDocumentationVersionRequest extends S.Class<CreateDocumentationVersionRequest>(
  "CreateDocumentationVersionRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationVersion: S.String,
    stageName: S.optional(S.String),
    description: S.optional(S.String),
  },
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
) {}
export const MapOfStringToString = S.Record({ key: S.String, value: S.String });
export class CreateDomainNameAccessAssociationRequest extends S.Class<CreateDomainNameAccessAssociationRequest>(
  "CreateDomainNameAccessAssociationRequest",
)(
  {
    domainNameArn: S.String,
    accessAssociationSourceType: S.String,
    accessAssociationSource: S.String,
    tags: S.optional(MapOfStringToString),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domainnameaccessassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateModelRequest extends S.Class<CreateModelRequest>(
  "CreateModelRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    name: S.String,
    description: S.optional(S.String),
    schema: S.optional(S.String),
    contentType: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/restapis/{restApiId}/models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRequestValidatorRequest extends S.Class<CreateRequestValidatorRequest>(
  "CreateRequestValidatorRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    name: S.optional(S.String),
    validateRequestBody: S.optional(S.Boolean),
    validateRequestParameters: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/restapis/{restApiId}/requestvalidators" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourceRequest extends S.Class<CreateResourceRequest>(
  "CreateResourceRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    parentId: S.String.pipe(T.HttpLabel("parentId")),
    pathPart: S.String,
  },
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
) {}
export const ListOfEndpointType = S.Array(S.String);
export class EndpointConfiguration extends S.Class<EndpointConfiguration>(
  "EndpointConfiguration",
)({
  types: S.optional(ListOfEndpointType),
  ipAddressType: S.optional(S.String),
  vpcEndpointIds: S.optional(ListOfString),
}) {}
export class CreateRestApiRequest extends S.Class<CreateRestApiRequest>(
  "CreateRestApiRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    version: S.optional(S.String),
    cloneFrom: S.optional(S.String),
    binaryMediaTypes: S.optional(ListOfString),
    minimumCompressionSize: S.optional(S.Number),
    apiKeySource: S.optional(S.String),
    endpointConfiguration: S.optional(EndpointConfiguration),
    policy: S.optional(S.String),
    tags: S.optional(MapOfStringToString),
    disableExecuteApiEndpoint: S.optional(S.Boolean),
    securityPolicy: S.optional(S.String),
    endpointAccessMode: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/restapis" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateUsagePlanKeyRequest extends S.Class<CreateUsagePlanKeyRequest>(
  "CreateUsagePlanKeyRequest",
)(
  {
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    keyId: S.String,
    keyType: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/usageplans/{usagePlanId}/keys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVpcLinkRequest extends S.Class<CreateVpcLinkRequest>(
  "CreateVpcLinkRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    targetArns: ListOfString,
    tags: S.optional(MapOfStringToString),
  },
  T.all(
    T.Http({ method: "POST", uri: "/vpclinks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApiKeyRequest extends S.Class<DeleteApiKeyRequest>(
  "DeleteApiKeyRequest",
)(
  { apiKey: S.String.pipe(T.HttpLabel("apiKey")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/apikeys/{apiKey}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApiKeyResponse extends S.Class<DeleteApiKeyResponse>(
  "DeleteApiKeyResponse",
)({}) {}
export class DeleteAuthorizerRequest extends S.Class<DeleteAuthorizerRequest>(
  "DeleteAuthorizerRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    authorizerId: S.String.pipe(T.HttpLabel("authorizerId")),
  },
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
) {}
export class DeleteAuthorizerResponse extends S.Class<DeleteAuthorizerResponse>(
  "DeleteAuthorizerResponse",
)({}) {}
export class DeleteBasePathMappingRequest extends S.Class<DeleteBasePathMappingRequest>(
  "DeleteBasePathMappingRequest",
)(
  {
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    basePath: S.String.pipe(T.HttpLabel("basePath")),
  },
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
) {}
export class DeleteBasePathMappingResponse extends S.Class<DeleteBasePathMappingResponse>(
  "DeleteBasePathMappingResponse",
)({}) {}
export class DeleteClientCertificateRequest extends S.Class<DeleteClientCertificateRequest>(
  "DeleteClientCertificateRequest",
)(
  { clientCertificateId: S.String.pipe(T.HttpLabel("clientCertificateId")) },
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
) {}
export class DeleteClientCertificateResponse extends S.Class<DeleteClientCertificateResponse>(
  "DeleteClientCertificateResponse",
)({}) {}
export class DeleteDeploymentRequest extends S.Class<DeleteDeploymentRequest>(
  "DeleteDeploymentRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    deploymentId: S.String.pipe(T.HttpLabel("deploymentId")),
  },
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
) {}
export class DeleteDeploymentResponse extends S.Class<DeleteDeploymentResponse>(
  "DeleteDeploymentResponse",
)({}) {}
export class DeleteDocumentationPartRequest extends S.Class<DeleteDocumentationPartRequest>(
  "DeleteDocumentationPartRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationPartId: S.String.pipe(T.HttpLabel("documentationPartId")),
  },
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
) {}
export class DeleteDocumentationPartResponse extends S.Class<DeleteDocumentationPartResponse>(
  "DeleteDocumentationPartResponse",
)({}) {}
export class DeleteDocumentationVersionRequest extends S.Class<DeleteDocumentationVersionRequest>(
  "DeleteDocumentationVersionRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationVersion: S.String.pipe(T.HttpLabel("documentationVersion")),
  },
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
) {}
export class DeleteDocumentationVersionResponse extends S.Class<DeleteDocumentationVersionResponse>(
  "DeleteDocumentationVersionResponse",
)({}) {}
export class DeleteDomainNameRequest extends S.Class<DeleteDomainNameRequest>(
  "DeleteDomainNameRequest",
)(
  {
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/domainnames/{domainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainNameResponse extends S.Class<DeleteDomainNameResponse>(
  "DeleteDomainNameResponse",
)({}) {}
export class DeleteDomainNameAccessAssociationRequest extends S.Class<DeleteDomainNameAccessAssociationRequest>(
  "DeleteDomainNameAccessAssociationRequest",
)(
  {
    domainNameAccessAssociationArn: S.String.pipe(
      T.HttpLabel("domainNameAccessAssociationArn"),
    ),
  },
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
) {}
export class DeleteDomainNameAccessAssociationResponse extends S.Class<DeleteDomainNameAccessAssociationResponse>(
  "DeleteDomainNameAccessAssociationResponse",
)({}) {}
export class DeleteGatewayResponseRequest extends S.Class<DeleteGatewayResponseRequest>(
  "DeleteGatewayResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    responseType: S.String.pipe(T.HttpLabel("responseType")),
  },
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
) {}
export class DeleteGatewayResponseResponse extends S.Class<DeleteGatewayResponseResponse>(
  "DeleteGatewayResponseResponse",
)({}) {}
export class DeleteIntegrationRequest extends S.Class<DeleteIntegrationRequest>(
  "DeleteIntegrationRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
  },
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
) {}
export class DeleteIntegrationResponse extends S.Class<DeleteIntegrationResponse>(
  "DeleteIntegrationResponse",
)({}) {}
export class DeleteIntegrationResponseRequest extends S.Class<DeleteIntegrationResponseRequest>(
  "DeleteIntegrationResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
  },
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
) {}
export class DeleteIntegrationResponseResponse extends S.Class<DeleteIntegrationResponseResponse>(
  "DeleteIntegrationResponseResponse",
)({}) {}
export class DeleteMethodRequest extends S.Class<DeleteMethodRequest>(
  "DeleteMethodRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
  },
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
) {}
export class DeleteMethodResponse extends S.Class<DeleteMethodResponse>(
  "DeleteMethodResponse",
)({}) {}
export class DeleteMethodResponseRequest extends S.Class<DeleteMethodResponseRequest>(
  "DeleteMethodResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
  },
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
) {}
export class DeleteMethodResponseResponse extends S.Class<DeleteMethodResponseResponse>(
  "DeleteMethodResponseResponse",
)({}) {}
export class DeleteModelRequest extends S.Class<DeleteModelRequest>(
  "DeleteModelRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    modelName: S.String.pipe(T.HttpLabel("modelName")),
  },
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
) {}
export class DeleteModelResponse extends S.Class<DeleteModelResponse>(
  "DeleteModelResponse",
)({}) {}
export class DeleteRequestValidatorRequest extends S.Class<DeleteRequestValidatorRequest>(
  "DeleteRequestValidatorRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    requestValidatorId: S.String.pipe(T.HttpLabel("requestValidatorId")),
  },
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
) {}
export class DeleteRequestValidatorResponse extends S.Class<DeleteRequestValidatorResponse>(
  "DeleteRequestValidatorResponse",
)({}) {}
export class DeleteResourceRequest extends S.Class<DeleteResourceRequest>(
  "DeleteResourceRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
  },
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
) {}
export class DeleteResourceResponse extends S.Class<DeleteResourceResponse>(
  "DeleteResourceResponse",
)({}) {}
export class DeleteRestApiRequest extends S.Class<DeleteRestApiRequest>(
  "DeleteRestApiRequest",
)(
  { restApiId: S.String.pipe(T.HttpLabel("restApiId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/restapis/{restApiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRestApiResponse extends S.Class<DeleteRestApiResponse>(
  "DeleteRestApiResponse",
)({}) {}
export class DeleteStageRequest extends S.Class<DeleteStageRequest>(
  "DeleteStageRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
  },
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
) {}
export class DeleteStageResponse extends S.Class<DeleteStageResponse>(
  "DeleteStageResponse",
)({}) {}
export class DeleteUsagePlanRequest extends S.Class<DeleteUsagePlanRequest>(
  "DeleteUsagePlanRequest",
)(
  { usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/usageplans/{usagePlanId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUsagePlanResponse extends S.Class<DeleteUsagePlanResponse>(
  "DeleteUsagePlanResponse",
)({}) {}
export class DeleteUsagePlanKeyRequest extends S.Class<DeleteUsagePlanKeyRequest>(
  "DeleteUsagePlanKeyRequest",
)(
  {
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    keyId: S.String.pipe(T.HttpLabel("keyId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/usageplans/{usagePlanId}/keys/{keyId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUsagePlanKeyResponse extends S.Class<DeleteUsagePlanKeyResponse>(
  "DeleteUsagePlanKeyResponse",
)({}) {}
export class DeleteVpcLinkRequest extends S.Class<DeleteVpcLinkRequest>(
  "DeleteVpcLinkRequest",
)(
  { vpcLinkId: S.String.pipe(T.HttpLabel("vpcLinkId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/vpclinks/{vpcLinkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVpcLinkResponse extends S.Class<DeleteVpcLinkResponse>(
  "DeleteVpcLinkResponse",
)({}) {}
export class FlushStageAuthorizersCacheRequest extends S.Class<FlushStageAuthorizersCacheRequest>(
  "FlushStageAuthorizersCacheRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
  },
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
) {}
export class FlushStageAuthorizersCacheResponse extends S.Class<FlushStageAuthorizersCacheResponse>(
  "FlushStageAuthorizersCacheResponse",
)({}) {}
export class FlushStageCacheRequest extends S.Class<FlushStageCacheRequest>(
  "FlushStageCacheRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
  },
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
) {}
export class FlushStageCacheResponse extends S.Class<FlushStageCacheResponse>(
  "FlushStageCacheResponse",
)({}) {}
export class GenerateClientCertificateRequest extends S.Class<GenerateClientCertificateRequest>(
  "GenerateClientCertificateRequest",
)(
  { description: S.optional(S.String), tags: S.optional(MapOfStringToString) },
  T.all(
    T.Http({ method: "POST", uri: "/clientcertificates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ThrottleSettings extends S.Class<ThrottleSettings>(
  "ThrottleSettings",
)({ burstLimit: S.optional(S.Number), rateLimit: S.optional(S.Number) }) {}
export class Account extends S.Class<Account>("Account")({
  cloudwatchRoleArn: S.optional(S.String),
  throttleSettings: S.optional(ThrottleSettings),
  features: S.optional(ListOfString),
  apiKeyVersion: S.optional(S.String),
}) {}
export class GetApiKeyRequest extends S.Class<GetApiKeyRequest>(
  "GetApiKeyRequest",
)(
  {
    apiKey: S.String.pipe(T.HttpLabel("apiKey")),
    includeValue: S.optional(S.Boolean).pipe(T.HttpQuery("includeValue")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/apikeys/{apiKey}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApiKeysRequest extends S.Class<GetApiKeysRequest>(
  "GetApiKeysRequest",
)(
  {
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    nameQuery: S.optional(S.String).pipe(T.HttpQuery("name")),
    customerId: S.optional(S.String).pipe(T.HttpQuery("customerId")),
    includeValues: S.optional(S.Boolean).pipe(T.HttpQuery("includeValues")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/apikeys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAuthorizerRequest extends S.Class<GetAuthorizerRequest>(
  "GetAuthorizerRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    authorizerId: S.String.pipe(T.HttpLabel("authorizerId")),
  },
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
) {}
export class GetAuthorizersRequest extends S.Class<GetAuthorizersRequest>(
  "GetAuthorizersRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restapis/{restApiId}/authorizers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBasePathMappingRequest extends S.Class<GetBasePathMappingRequest>(
  "GetBasePathMappingRequest",
)(
  {
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    basePath: S.String.pipe(T.HttpLabel("basePath")),
  },
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
) {}
export class GetBasePathMappingsRequest extends S.Class<GetBasePathMappingsRequest>(
  "GetBasePathMappingsRequest",
)(
  {
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
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
) {}
export class GetClientCertificateRequest extends S.Class<GetClientCertificateRequest>(
  "GetClientCertificateRequest",
)(
  { clientCertificateId: S.String.pipe(T.HttpLabel("clientCertificateId")) },
  T.all(
    T.Http({ method: "GET", uri: "/clientcertificates/{clientCertificateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetClientCertificatesRequest extends S.Class<GetClientCertificatesRequest>(
  "GetClientCertificatesRequest",
)(
  {
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/clientcertificates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeploymentRequest extends S.Class<GetDeploymentRequest>(
  "GetDeploymentRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    deploymentId: S.String.pipe(T.HttpLabel("deploymentId")),
    embed: S.optional(ListOfString).pipe(T.HttpQuery("embed")),
  },
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
) {}
export class GetDeploymentsRequest extends S.Class<GetDeploymentsRequest>(
  "GetDeploymentsRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restapis/{restApiId}/deployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDocumentationPartRequest extends S.Class<GetDocumentationPartRequest>(
  "GetDocumentationPartRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationPartId: S.String.pipe(T.HttpLabel("documentationPartId")),
  },
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
) {}
export class GetDocumentationPartsRequest extends S.Class<GetDocumentationPartsRequest>(
  "GetDocumentationPartsRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    nameQuery: S.optional(S.String).pipe(T.HttpQuery("name")),
    path: S.optional(S.String).pipe(T.HttpQuery("path")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    locationStatus: S.optional(S.String).pipe(T.HttpQuery("locationStatus")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restapis/{restApiId}/documentation/parts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDocumentationVersionRequest extends S.Class<GetDocumentationVersionRequest>(
  "GetDocumentationVersionRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationVersion: S.String.pipe(T.HttpLabel("documentationVersion")),
  },
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
) {}
export class GetDocumentationVersionsRequest extends S.Class<GetDocumentationVersionsRequest>(
  "GetDocumentationVersionsRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
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
) {}
export class GetDomainNameRequest extends S.Class<GetDomainNameRequest>(
  "GetDomainNameRequest",
)(
  {
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domainnames/{domainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainNameAccessAssociationsRequest extends S.Class<GetDomainNameAccessAssociationsRequest>(
  "GetDomainNameAccessAssociationsRequest",
)(
  {
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    resourceOwner: S.optional(S.String).pipe(T.HttpQuery("resourceOwner")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domainnameaccessassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainNamesRequest extends S.Class<GetDomainNamesRequest>(
  "GetDomainNamesRequest",
)(
  {
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    resourceOwner: S.optional(S.String).pipe(T.HttpQuery("resourceOwner")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/domainnames" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExportRequest extends S.Class<GetExportRequest>(
  "GetExportRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
    exportType: S.String.pipe(T.HttpLabel("exportType")),
    parameters: S.optional(MapOfStringToString).pipe(T.HttpQueryParams()),
    accepts: S.optional(S.String).pipe(T.HttpHeader("Accept")),
  },
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
) {}
export class GetGatewayResponseRequest extends S.Class<GetGatewayResponseRequest>(
  "GetGatewayResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    responseType: S.String.pipe(T.HttpLabel("responseType")),
  },
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
) {}
export class GetGatewayResponsesRequest extends S.Class<GetGatewayResponsesRequest>(
  "GetGatewayResponsesRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restapis/{restApiId}/gatewayresponses" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIntegrationRequest extends S.Class<GetIntegrationRequest>(
  "GetIntegrationRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
  },
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
) {}
export class GetIntegrationResponseRequest extends S.Class<GetIntegrationResponseRequest>(
  "GetIntegrationResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
  },
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
) {}
export class GetMethodRequest extends S.Class<GetMethodRequest>(
  "GetMethodRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
  },
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
) {}
export class GetMethodResponseRequest extends S.Class<GetMethodResponseRequest>(
  "GetMethodResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
  },
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
) {}
export class GetModelRequest extends S.Class<GetModelRequest>(
  "GetModelRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    modelName: S.String.pipe(T.HttpLabel("modelName")),
    flatten: S.optional(S.Boolean).pipe(T.HttpQuery("flatten")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restapis/{restApiId}/models/{modelName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetModelsRequest extends S.Class<GetModelsRequest>(
  "GetModelsRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restapis/{restApiId}/models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetModelTemplateRequest extends S.Class<GetModelTemplateRequest>(
  "GetModelTemplateRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    modelName: S.String.pipe(T.HttpLabel("modelName")),
  },
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
) {}
export class GetRequestValidatorRequest extends S.Class<GetRequestValidatorRequest>(
  "GetRequestValidatorRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    requestValidatorId: S.String.pipe(T.HttpLabel("requestValidatorId")),
  },
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
) {}
export class GetRequestValidatorsRequest extends S.Class<GetRequestValidatorsRequest>(
  "GetRequestValidatorsRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restapis/{restApiId}/requestvalidators" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceRequest extends S.Class<GetResourceRequest>(
  "GetResourceRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    embed: S.optional(ListOfString).pipe(T.HttpQuery("embed")),
  },
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
) {}
export class GetResourcesRequest extends S.Class<GetResourcesRequest>(
  "GetResourcesRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    embed: S.optional(ListOfString).pipe(T.HttpQuery("embed")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restapis/{restApiId}/resources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRestApiRequest extends S.Class<GetRestApiRequest>(
  "GetRestApiRequest",
)(
  { restApiId: S.String.pipe(T.HttpLabel("restApiId")) },
  T.all(
    T.Http({ method: "GET", uri: "/restapis/{restApiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRestApisRequest extends S.Class<GetRestApisRequest>(
  "GetRestApisRequest",
)(
  {
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restapis" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSdkRequest extends S.Class<GetSdkRequest>("GetSdkRequest")(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
    sdkType: S.String.pipe(T.HttpLabel("sdkType")),
    parameters: S.optional(MapOfStringToString).pipe(T.HttpQueryParams()),
  },
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
) {}
export class GetSdkTypeRequest extends S.Class<GetSdkTypeRequest>(
  "GetSdkTypeRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/sdktypes/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSdkTypesRequest extends S.Class<GetSdkTypesRequest>(
  "GetSdkTypesRequest",
)(
  {
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/sdktypes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStageRequest extends S.Class<GetStageRequest>(
  "GetStageRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restapis/{restApiId}/stages/{stageName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStagesRequest extends S.Class<GetStagesRequest>(
  "GetStagesRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    deploymentId: S.optional(S.String).pipe(T.HttpQuery("deploymentId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restapis/{restApiId}/stages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTagsRequest extends S.Class<GetTagsRequest>("GetTagsRequest")(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUsageRequest extends S.Class<GetUsageRequest>(
  "GetUsageRequest",
)(
  {
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    keyId: S.optional(S.String).pipe(T.HttpQuery("keyId")),
    startDate: S.String.pipe(T.HttpQuery("startDate")),
    endDate: S.String.pipe(T.HttpQuery("endDate")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/usageplans/{usagePlanId}/usage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUsagePlanRequest extends S.Class<GetUsagePlanRequest>(
  "GetUsagePlanRequest",
)(
  { usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")) },
  T.all(
    T.Http({ method: "GET", uri: "/usageplans/{usagePlanId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUsagePlanKeyRequest extends S.Class<GetUsagePlanKeyRequest>(
  "GetUsagePlanKeyRequest",
)(
  {
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    keyId: S.String.pipe(T.HttpLabel("keyId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/usageplans/{usagePlanId}/keys/{keyId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUsagePlanKeysRequest extends S.Class<GetUsagePlanKeysRequest>(
  "GetUsagePlanKeysRequest",
)(
  {
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
    nameQuery: S.optional(S.String).pipe(T.HttpQuery("name")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/usageplans/{usagePlanId}/keys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUsagePlansRequest extends S.Class<GetUsagePlansRequest>(
  "GetUsagePlansRequest",
)(
  {
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    keyId: S.optional(S.String).pipe(T.HttpQuery("keyId")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/usageplans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVpcLinkRequest extends S.Class<GetVpcLinkRequest>(
  "GetVpcLinkRequest",
)(
  { vpcLinkId: S.String.pipe(T.HttpLabel("vpcLinkId")) },
  T.all(
    T.Http({ method: "GET", uri: "/vpclinks/{vpcLinkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVpcLinksRequest extends S.Class<GetVpcLinksRequest>(
  "GetVpcLinksRequest",
)(
  {
    position: S.optional(S.String).pipe(T.HttpQuery("position")),
    limit: S.optional(S.Number).pipe(T.HttpQuery("limit")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/vpclinks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportApiKeysRequest extends S.Class<ImportApiKeysRequest>(
  "ImportApiKeysRequest",
)(
  {
    body: T.StreamingInput.pipe(T.HttpPayload()),
    format: S.String.pipe(T.HttpQuery("format")),
    failOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failonwarnings")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/apikeys?mode=import" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportDocumentationPartsRequest extends S.Class<ImportDocumentationPartsRequest>(
  "ImportDocumentationPartsRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    mode: S.optional(S.String).pipe(T.HttpQuery("mode")),
    failOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failonwarnings")),
    body: T.StreamingInput.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/restapis/{restApiId}/documentation/parts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportRestApiRequest extends S.Class<ImportRestApiRequest>(
  "ImportRestApiRequest",
)(
  {
    failOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failonwarnings")),
    parameters: S.optional(MapOfStringToString).pipe(T.HttpQueryParams()),
    body: T.StreamingInput.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/restapis?mode=import" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutGatewayResponseRequest extends S.Class<PutGatewayResponseRequest>(
  "PutGatewayResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    responseType: S.String.pipe(T.HttpLabel("responseType")),
    statusCode: S.optional(S.String),
    responseParameters: S.optional(MapOfStringToString),
    responseTemplates: S.optional(MapOfStringToString),
  },
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
) {}
export class PutIntegrationResponseRequest extends S.Class<PutIntegrationResponseRequest>(
  "PutIntegrationResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
    selectionPattern: S.optional(S.String),
    responseParameters: S.optional(MapOfStringToString),
    responseTemplates: S.optional(MapOfStringToString),
    contentHandling: S.optional(S.String),
  },
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
) {}
export const MapOfStringToBoolean = S.Record({
  key: S.String,
  value: S.Boolean,
});
export class PutMethodResponseRequest extends S.Class<PutMethodResponseRequest>(
  "PutMethodResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
    responseParameters: S.optional(MapOfStringToBoolean),
    responseModels: S.optional(MapOfStringToString),
  },
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
) {}
export class PutRestApiRequest extends S.Class<PutRestApiRequest>(
  "PutRestApiRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    mode: S.optional(S.String).pipe(T.HttpQuery("mode")),
    failOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failonwarnings")),
    parameters: S.optional(MapOfStringToString).pipe(T.HttpQueryParams()),
    body: T.StreamingInput.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/restapis/{restApiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectDomainNameAccessAssociationRequest extends S.Class<RejectDomainNameAccessAssociationRequest>(
  "RejectDomainNameAccessAssociationRequest",
)(
  {
    domainNameAccessAssociationArn: S.String.pipe(
      T.HttpQuery("domainNameAccessAssociationArn"),
    ),
    domainNameArn: S.String.pipe(T.HttpQuery("domainNameArn")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/rejectdomainnameaccessassociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectDomainNameAccessAssociationResponse extends S.Class<RejectDomainNameAccessAssociationResponse>(
  "RejectDomainNameAccessAssociationResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: MapOfStringToString,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/tags/{resourceArn}" }),
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
export const MapOfStringToList = S.Record({
  key: S.String,
  value: ListOfString,
});
export class TestInvokeMethodRequest extends S.Class<TestInvokeMethodRequest>(
  "TestInvokeMethodRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    pathWithQueryString: S.optional(S.String),
    body: S.optional(S.String),
    headers: S.optional(MapOfStringToString),
    multiValueHeaders: S.optional(MapOfStringToList),
    clientCertificateId: S.optional(S.String),
    stageVariables: S.optional(MapOfStringToString),
  },
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
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: ListOfString.pipe(T.HttpQuery("tagKeys")),
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
export class PatchOperation extends S.Class<PatchOperation>("PatchOperation")({
  op: S.optional(S.String),
  path: S.optional(S.String),
  value: S.optional(S.String),
  from: S.optional(S.String),
}) {}
export const ListOfPatchOperation = S.Array(PatchOperation);
export class UpdateApiKeyRequest extends S.Class<UpdateApiKeyRequest>(
  "UpdateApiKeyRequest",
)(
  {
    apiKey: S.String.pipe(T.HttpLabel("apiKey")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/apikeys/{apiKey}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAuthorizerRequest extends S.Class<UpdateAuthorizerRequest>(
  "UpdateAuthorizerRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    authorizerId: S.String.pipe(T.HttpLabel("authorizerId")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateBasePathMappingRequest extends S.Class<UpdateBasePathMappingRequest>(
  "UpdateBasePathMappingRequest",
)(
  {
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    basePath: S.String.pipe(T.HttpLabel("basePath")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateClientCertificateRequest extends S.Class<UpdateClientCertificateRequest>(
  "UpdateClientCertificateRequest",
)(
  {
    clientCertificateId: S.String.pipe(T.HttpLabel("clientCertificateId")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateDeploymentRequest extends S.Class<UpdateDeploymentRequest>(
  "UpdateDeploymentRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    deploymentId: S.String.pipe(T.HttpLabel("deploymentId")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateDocumentationPartRequest extends S.Class<UpdateDocumentationPartRequest>(
  "UpdateDocumentationPartRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationPartId: S.String.pipe(T.HttpLabel("documentationPartId")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateDocumentationVersionRequest extends S.Class<UpdateDocumentationVersionRequest>(
  "UpdateDocumentationVersionRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    documentationVersion: S.String.pipe(T.HttpLabel("documentationVersion")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateDomainNameRequest extends S.Class<UpdateDomainNameRequest>(
  "UpdateDomainNameRequest",
)(
  {
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    domainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/domainnames/{domainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGatewayResponseRequest extends S.Class<UpdateGatewayResponseRequest>(
  "UpdateGatewayResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    responseType: S.String.pipe(T.HttpLabel("responseType")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateIntegrationRequest extends S.Class<UpdateIntegrationRequest>(
  "UpdateIntegrationRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateIntegrationResponseRequest extends S.Class<UpdateIntegrationResponseRequest>(
  "UpdateIntegrationResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateMethodRequest extends S.Class<UpdateMethodRequest>(
  "UpdateMethodRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateMethodResponseRequest extends S.Class<UpdateMethodResponseRequest>(
  "UpdateMethodResponseRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(T.HttpLabel("httpMethod")),
    statusCode: S.String.pipe(T.HttpLabel("statusCode")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateModelRequest extends S.Class<UpdateModelRequest>(
  "UpdateModelRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    modelName: S.String.pipe(T.HttpLabel("modelName")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateRequestValidatorRequest extends S.Class<UpdateRequestValidatorRequest>(
  "UpdateRequestValidatorRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    requestValidatorId: S.String.pipe(T.HttpLabel("requestValidatorId")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateResourceRequest extends S.Class<UpdateResourceRequest>(
  "UpdateResourceRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateRestApiRequest extends S.Class<UpdateRestApiRequest>(
  "UpdateRestApiRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/restapis/{restApiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateStageRequest extends S.Class<UpdateStageRequest>(
  "UpdateStageRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String.pipe(T.HttpLabel("stageName")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateUsageRequest extends S.Class<UpdateUsageRequest>(
  "UpdateUsageRequest",
)(
  {
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    keyId: S.String.pipe(T.HttpLabel("keyId")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
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
) {}
export class UpdateUsagePlanRequest extends S.Class<UpdateUsagePlanRequest>(
  "UpdateUsagePlanRequest",
)(
  {
    usagePlanId: S.String.pipe(T.HttpLabel("usagePlanId")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/usageplans/{usagePlanId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateVpcLinkRequest extends S.Class<UpdateVpcLinkRequest>(
  "UpdateVpcLinkRequest",
)(
  {
    vpcLinkId: S.String.pipe(T.HttpLabel("vpcLinkId")),
    patchOperations: S.optional(ListOfPatchOperation),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/vpclinks/{vpcLinkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StageKey extends S.Class<StageKey>("StageKey")({
  restApiId: S.optional(S.String),
  stageName: S.optional(S.String),
}) {}
export const ListOfStageKeys = S.Array(StageKey);
export class DeploymentCanarySettings extends S.Class<DeploymentCanarySettings>(
  "DeploymentCanarySettings",
)({
  percentTraffic: S.optional(S.Number),
  stageVariableOverrides: S.optional(MapOfStringToString),
  useStageCache: S.optional(S.Boolean),
}) {}
export class DocumentationPartLocation extends S.Class<DocumentationPartLocation>(
  "DocumentationPartLocation",
)({
  type: S.String,
  path: S.optional(S.String),
  method: S.optional(S.String),
  statusCode: S.optional(S.String),
  name: S.optional(S.String),
}) {}
export class MutualTlsAuthenticationInput extends S.Class<MutualTlsAuthenticationInput>(
  "MutualTlsAuthenticationInput",
)({
  truststoreUri: S.optional(S.String),
  truststoreVersion: S.optional(S.String),
}) {}
export class CanarySettings extends S.Class<CanarySettings>("CanarySettings")({
  percentTraffic: S.optional(S.Number),
  deploymentId: S.optional(S.String),
  stageVariableOverrides: S.optional(MapOfStringToString),
  useStageCache: S.optional(S.Boolean),
}) {}
export class QuotaSettings extends S.Class<QuotaSettings>("QuotaSettings")({
  limit: S.optional(S.Number),
  offset: S.optional(S.Number),
  period: S.optional(S.String),
}) {}
export class ApiKey extends S.Class<ApiKey>("ApiKey")({
  id: S.optional(S.String),
  value: S.optional(S.String),
  name: S.optional(S.String),
  customerId: S.optional(S.String),
  description: S.optional(S.String),
  enabled: S.optional(S.Boolean),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  stageKeys: S.optional(ListOfString),
  tags: S.optional(MapOfStringToString),
}) {}
export const ListOfApiKey = S.Array(ApiKey);
export class Authorizer extends S.Class<Authorizer>("Authorizer")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  providerARNs: S.optional(ListOfARNs),
  authType: S.optional(S.String),
  authorizerUri: S.optional(S.String),
  authorizerCredentials: S.optional(S.String),
  identitySource: S.optional(S.String),
  identityValidationExpression: S.optional(S.String),
  authorizerResultTtlInSeconds: S.optional(S.Number),
}) {}
export const ListOfAuthorizer = S.Array(Authorizer);
export class BasePathMapping extends S.Class<BasePathMapping>(
  "BasePathMapping",
)({
  basePath: S.optional(S.String),
  restApiId: S.optional(S.String),
  stage: S.optional(S.String),
}) {}
export const ListOfBasePathMapping = S.Array(BasePathMapping);
export class ClientCertificate extends S.Class<ClientCertificate>(
  "ClientCertificate",
)({
  clientCertificateId: S.optional(S.String),
  description: S.optional(S.String),
  pemEncodedCertificate: S.optional(S.String),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(MapOfStringToString),
}) {}
export const ListOfClientCertificate = S.Array(ClientCertificate);
export class MethodSnapshot extends S.Class<MethodSnapshot>("MethodSnapshot")({
  authorizationType: S.optional(S.String),
  apiKeyRequired: S.optional(S.Boolean),
}) {}
export const MapOfMethodSnapshot = S.Record({
  key: S.String,
  value: MethodSnapshot,
});
export const PathToMapOfMethodSnapshot = S.Record({
  key: S.String,
  value: MapOfMethodSnapshot,
});
export class Deployment extends S.Class<Deployment>("Deployment")({
  id: S.optional(S.String),
  description: S.optional(S.String),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  apiSummary: S.optional(PathToMapOfMethodSnapshot),
}) {}
export const ListOfDeployment = S.Array(Deployment);
export class DocumentationPart extends S.Class<DocumentationPart>(
  "DocumentationPart",
)({
  id: S.optional(S.String),
  location: S.optional(DocumentationPartLocation),
  properties: S.optional(S.String),
}) {}
export const ListOfDocumentationPart = S.Array(DocumentationPart);
export class DocumentationVersion extends S.Class<DocumentationVersion>(
  "DocumentationVersion",
)({
  version: S.optional(S.String),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  description: S.optional(S.String),
}) {}
export const ListOfDocumentationVersion = S.Array(DocumentationVersion);
export class DomainNameAccessAssociation extends S.Class<DomainNameAccessAssociation>(
  "DomainNameAccessAssociation",
)({
  domainNameAccessAssociationArn: S.optional(S.String),
  domainNameArn: S.optional(S.String),
  accessAssociationSourceType: S.optional(S.String),
  accessAssociationSource: S.optional(S.String),
  tags: S.optional(MapOfStringToString),
}) {}
export const ListOfDomainNameAccessAssociation = S.Array(
  DomainNameAccessAssociation,
);
export class MutualTlsAuthentication extends S.Class<MutualTlsAuthentication>(
  "MutualTlsAuthentication",
)({
  truststoreUri: S.optional(S.String),
  truststoreVersion: S.optional(S.String),
  truststoreWarnings: S.optional(ListOfString),
}) {}
export class DomainName extends S.Class<DomainName>("DomainName")({
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
  domainNameStatus: S.optional(S.String),
  domainNameStatusMessage: S.optional(S.String),
  securityPolicy: S.optional(S.String),
  endpointAccessMode: S.optional(S.String),
  tags: S.optional(MapOfStringToString),
  mutualTlsAuthentication: S.optional(MutualTlsAuthentication),
  ownershipVerificationCertificateArn: S.optional(S.String),
  managementPolicy: S.optional(S.String),
  policy: S.optional(S.String),
  routingMode: S.optional(S.String),
}) {}
export const ListOfDomainName = S.Array(DomainName);
export class GatewayResponse extends S.Class<GatewayResponse>(
  "GatewayResponse",
)({
  responseType: S.optional(S.String),
  statusCode: S.optional(S.String),
  responseParameters: S.optional(MapOfStringToString),
  responseTemplates: S.optional(MapOfStringToString),
  defaultResponse: S.optional(S.Boolean),
}) {}
export const ListOfGatewayResponse = S.Array(GatewayResponse);
export class Model extends S.Class<Model>("Model")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  schema: S.optional(S.String),
  contentType: S.optional(S.String),
}) {}
export const ListOfModel = S.Array(Model);
export class RequestValidator extends S.Class<RequestValidator>(
  "RequestValidator",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  validateRequestBody: S.optional(S.Boolean),
  validateRequestParameters: S.optional(S.Boolean),
}) {}
export const ListOfRequestValidator = S.Array(RequestValidator);
export class MethodResponse extends S.Class<MethodResponse>("MethodResponse")({
  statusCode: S.optional(S.String),
  responseParameters: S.optional(MapOfStringToBoolean),
  responseModels: S.optional(MapOfStringToString),
}) {}
export const MapOfMethodResponse = S.Record({
  key: S.String,
  value: MethodResponse,
});
export class IntegrationResponse extends S.Class<IntegrationResponse>(
  "IntegrationResponse",
)({
  statusCode: S.optional(S.String),
  selectionPattern: S.optional(S.String),
  responseParameters: S.optional(MapOfStringToString),
  responseTemplates: S.optional(MapOfStringToString),
  contentHandling: S.optional(S.String),
}) {}
export const MapOfIntegrationResponse = S.Record({
  key: S.String,
  value: IntegrationResponse,
});
export class TlsConfig extends S.Class<TlsConfig>("TlsConfig")({
  insecureSkipVerification: S.optional(S.Boolean),
}) {}
export class Integration extends S.Class<Integration>("Integration")({
  type: S.optional(S.String),
  httpMethod: S.optional(S.String),
  uri: S.optional(S.String),
  connectionType: S.optional(S.String),
  connectionId: S.optional(S.String),
  credentials: S.optional(S.String),
  requestParameters: S.optional(MapOfStringToString),
  requestTemplates: S.optional(MapOfStringToString),
  passthroughBehavior: S.optional(S.String),
  contentHandling: S.optional(S.String),
  timeoutInMillis: S.optional(S.Number),
  cacheNamespace: S.optional(S.String),
  cacheKeyParameters: S.optional(ListOfString),
  integrationResponses: S.optional(MapOfIntegrationResponse),
  tlsConfig: S.optional(TlsConfig),
  responseTransferMode: S.optional(S.String),
  integrationTarget: S.optional(S.String),
}) {}
export class Method extends S.Class<Method>("Method")({
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
}) {}
export const MapOfMethod = S.Record({ key: S.String, value: Method });
export class Resource extends S.Class<Resource>("Resource")({
  id: S.optional(S.String),
  parentId: S.optional(S.String),
  pathPart: S.optional(S.String),
  path: S.optional(S.String),
  resourceMethods: S.optional(MapOfMethod),
}) {}
export const ListOfResource = S.Array(Resource);
export class RestApi extends S.Class<RestApi>("RestApi")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  version: S.optional(S.String),
  warnings: S.optional(ListOfString),
  binaryMediaTypes: S.optional(ListOfString),
  minimumCompressionSize: S.optional(S.Number),
  apiKeySource: S.optional(S.String),
  endpointConfiguration: S.optional(EndpointConfiguration),
  policy: S.optional(S.String),
  tags: S.optional(MapOfStringToString),
  disableExecuteApiEndpoint: S.optional(S.Boolean),
  rootResourceId: S.optional(S.String),
  securityPolicy: S.optional(S.String),
  endpointAccessMode: S.optional(S.String),
  apiStatus: S.optional(S.String),
  apiStatusMessage: S.optional(S.String),
}) {}
export const ListOfRestApi = S.Array(RestApi);
export class SdkConfigurationProperty extends S.Class<SdkConfigurationProperty>(
  "SdkConfigurationProperty",
)({
  name: S.optional(S.String),
  friendlyName: S.optional(S.String),
  description: S.optional(S.String),
  required: S.optional(S.Boolean),
  defaultValue: S.optional(S.String),
}) {}
export const ListOfSdkConfigurationProperty = S.Array(SdkConfigurationProperty);
export class SdkType extends S.Class<SdkType>("SdkType")({
  id: S.optional(S.String),
  friendlyName: S.optional(S.String),
  description: S.optional(S.String),
  configurationProperties: S.optional(ListOfSdkConfigurationProperty),
}) {}
export const ListOfSdkType = S.Array(SdkType);
export class MethodSetting extends S.Class<MethodSetting>("MethodSetting")({
  metricsEnabled: S.optional(S.Boolean),
  loggingLevel: S.optional(S.String),
  dataTraceEnabled: S.optional(S.Boolean),
  throttlingBurstLimit: S.optional(S.Number),
  throttlingRateLimit: S.optional(S.Number),
  cachingEnabled: S.optional(S.Boolean),
  cacheTtlInSeconds: S.optional(S.Number),
  cacheDataEncrypted: S.optional(S.Boolean),
  requireAuthorizationForCacheControl: S.optional(S.Boolean),
  unauthorizedCacheControlHeaderStrategy: S.optional(S.String),
}) {}
export const MapOfMethodSettings = S.Record({
  key: S.String,
  value: MethodSetting,
});
export class AccessLogSettings extends S.Class<AccessLogSettings>(
  "AccessLogSettings",
)({ format: S.optional(S.String), destinationArn: S.optional(S.String) }) {}
export class Stage extends S.Class<Stage>("Stage")({
  deploymentId: S.optional(S.String),
  clientCertificateId: S.optional(S.String),
  stageName: S.optional(S.String),
  description: S.optional(S.String),
  cacheClusterEnabled: S.optional(S.Boolean),
  cacheClusterSize: S.optional(S.String),
  cacheClusterStatus: S.optional(S.String),
  methodSettings: S.optional(MapOfMethodSettings),
  variables: S.optional(MapOfStringToString),
  documentationVersion: S.optional(S.String),
  accessLogSettings: S.optional(AccessLogSettings),
  canarySettings: S.optional(CanarySettings),
  tracingEnabled: S.optional(S.Boolean),
  webAclArn: S.optional(S.String),
  tags: S.optional(MapOfStringToString),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ListOfStage = S.Array(Stage);
export class UsagePlanKey extends S.Class<UsagePlanKey>("UsagePlanKey")({
  id: S.optional(S.String),
  type: S.optional(S.String),
  value: S.optional(S.String),
  name: S.optional(S.String),
}) {}
export const ListOfUsagePlanKey = S.Array(UsagePlanKey);
export const MapOfApiStageThrottleSettings = S.Record({
  key: S.String,
  value: ThrottleSettings,
});
export class ApiStage extends S.Class<ApiStage>("ApiStage")({
  apiId: S.optional(S.String),
  stage: S.optional(S.String),
  throttle: S.optional(MapOfApiStageThrottleSettings),
}) {}
export const ListOfApiStage = S.Array(ApiStage);
export class UsagePlan extends S.Class<UsagePlan>("UsagePlan")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  apiStages: S.optional(ListOfApiStage),
  throttle: S.optional(ThrottleSettings),
  quota: S.optional(QuotaSettings),
  productCode: S.optional(S.String),
  tags: S.optional(MapOfStringToString),
}) {}
export const ListOfUsagePlan = S.Array(UsagePlan);
export class VpcLink extends S.Class<VpcLink>("VpcLink")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  targetArns: S.optional(ListOfString),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  tags: S.optional(MapOfStringToString),
}) {}
export const ListOfVpcLink = S.Array(VpcLink);
export class CreateApiKeyRequest extends S.Class<CreateApiKeyRequest>(
  "CreateApiKeyRequest",
)(
  {
    name: S.optional(S.String),
    description: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    generateDistinctId: S.optional(S.Boolean),
    value: S.optional(S.String),
    stageKeys: S.optional(ListOfStageKeys),
    customerId: S.optional(S.String),
    tags: S.optional(MapOfStringToString),
  },
  T.all(
    T.Http({ method: "POST", uri: "/apikeys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDeploymentRequest extends S.Class<CreateDeploymentRequest>(
  "CreateDeploymentRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.optional(S.String),
    stageDescription: S.optional(S.String),
    description: S.optional(S.String),
    cacheClusterEnabled: S.optional(S.Boolean),
    cacheClusterSize: S.optional(S.String),
    variables: S.optional(MapOfStringToString),
    canarySettings: S.optional(DeploymentCanarySettings),
    tracingEnabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/restapis/{restApiId}/deployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDocumentationPartRequest extends S.Class<CreateDocumentationPartRequest>(
  "CreateDocumentationPartRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    location: DocumentationPartLocation,
    properties: S.String,
  },
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
) {}
export class CreateDomainNameRequest extends S.Class<CreateDomainNameRequest>(
  "CreateDomainNameRequest",
)(
  {
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
    securityPolicy: S.optional(S.String),
    endpointAccessMode: S.optional(S.String),
    mutualTlsAuthentication: S.optional(MutualTlsAuthenticationInput),
    ownershipVerificationCertificateArn: S.optional(S.String),
    policy: S.optional(S.String),
    routingMode: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/domainnames" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateStageRequest extends S.Class<CreateStageRequest>(
  "CreateStageRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    stageName: S.String,
    deploymentId: S.String,
    description: S.optional(S.String),
    cacheClusterEnabled: S.optional(S.Boolean),
    cacheClusterSize: S.optional(S.String),
    variables: S.optional(MapOfStringToString),
    documentationVersion: S.optional(S.String),
    canarySettings: S.optional(CanarySettings),
    tracingEnabled: S.optional(S.Boolean),
    tags: S.optional(MapOfStringToString),
  },
  T.all(
    T.Http({ method: "POST", uri: "/restapis/{restApiId}/stages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ApiKeys extends S.Class<ApiKeys>("ApiKeys")({
  warnings: S.optional(ListOfString),
  items: S.optional(ListOfApiKey).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class Authorizers extends S.Class<Authorizers>("Authorizers")({
  items: S.optional(ListOfAuthorizer).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class BasePathMappings extends S.Class<BasePathMappings>(
  "BasePathMappings",
)({
  items: S.optional(ListOfBasePathMapping).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class ClientCertificates extends S.Class<ClientCertificates>(
  "ClientCertificates",
)({
  items: S.optional(ListOfClientCertificate).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class Deployments extends S.Class<Deployments>("Deployments")({
  items: S.optional(ListOfDeployment).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class DocumentationParts extends S.Class<DocumentationParts>(
  "DocumentationParts",
)({
  items: S.optional(ListOfDocumentationPart).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class DocumentationVersions extends S.Class<DocumentationVersions>(
  "DocumentationVersions",
)({
  items: S.optional(ListOfDocumentationVersion).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class DomainNameAccessAssociations extends S.Class<DomainNameAccessAssociations>(
  "DomainNameAccessAssociations",
)({
  items: S.optional(ListOfDomainNameAccessAssociation).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class DomainNames extends S.Class<DomainNames>("DomainNames")({
  items: S.optional(ListOfDomainName).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class ExportResponse extends S.Class<ExportResponse>("ExportResponse")({
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  contentDisposition: S.optional(S.String).pipe(
    T.HttpHeader("Content-Disposition"),
  ),
  body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
}) {}
export class GatewayResponses extends S.Class<GatewayResponses>(
  "GatewayResponses",
)({
  items: S.optional(ListOfGatewayResponse).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class Models extends S.Class<Models>("Models")({
  items: S.optional(ListOfModel).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class Template extends S.Class<Template>("Template")({
  value: S.optional(S.String),
}) {}
export class RequestValidators extends S.Class<RequestValidators>(
  "RequestValidators",
)({
  items: S.optional(ListOfRequestValidator).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class Resources extends S.Class<Resources>("Resources")({
  items: S.optional(ListOfResource).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class RestApis extends S.Class<RestApis>("RestApis")({
  items: S.optional(ListOfRestApi).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class SdkResponse extends S.Class<SdkResponse>("SdkResponse")({
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  contentDisposition: S.optional(S.String).pipe(
    T.HttpHeader("Content-Disposition"),
  ),
  body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
}) {}
export class SdkTypes extends S.Class<SdkTypes>("SdkTypes")({
  items: S.optional(ListOfSdkType).pipe(T.JsonName("item")),
}) {}
export class Stages extends S.Class<Stages>("Stages")({
  item: S.optional(ListOfStage),
}) {}
export class Tags extends S.Class<Tags>("Tags")({
  tags: S.optional(MapOfStringToString),
}) {}
export class UsagePlanKeys extends S.Class<UsagePlanKeys>("UsagePlanKeys")({
  items: S.optional(ListOfUsagePlanKey).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class UsagePlans extends S.Class<UsagePlans>("UsagePlans")({
  items: S.optional(ListOfUsagePlan).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class VpcLinks extends S.Class<VpcLinks>("VpcLinks")({
  items: S.optional(ListOfVpcLink).pipe(T.JsonName("item")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class ApiKeyIds extends S.Class<ApiKeyIds>("ApiKeyIds")({
  ids: S.optional(ListOfString),
  warnings: S.optional(ListOfString),
}) {}
export class DocumentationPartIds extends S.Class<DocumentationPartIds>(
  "DocumentationPartIds",
)({ ids: S.optional(ListOfString), warnings: S.optional(ListOfString) }) {}
export class PutIntegrationRequest extends S.Class<PutIntegrationRequest>(
  "PutIntegrationRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    resourceId: S.String.pipe(T.HttpLabel("resourceId")),
    httpMethod: S.String.pipe(
      T.HttpLabel("httpMethod"),
      T.JsonName("requestHttpMethod"),
    ),
    type: S.String,
    integrationHttpMethod: S.optional(S.String).pipe(T.JsonName("httpMethod")),
    uri: S.optional(S.String),
    connectionType: S.optional(S.String),
    connectionId: S.optional(S.String),
    credentials: S.optional(S.String),
    requestParameters: S.optional(MapOfStringToString),
    requestTemplates: S.optional(MapOfStringToString),
    passthroughBehavior: S.optional(S.String),
    cacheNamespace: S.optional(S.String),
    cacheKeyParameters: S.optional(ListOfString),
    contentHandling: S.optional(S.String),
    timeoutInMillis: S.optional(S.Number),
    tlsConfig: S.optional(TlsConfig),
    responseTransferMode: S.optional(S.String),
    integrationTarget: S.optional(S.String),
  },
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
) {}
export class PutMethodRequest extends S.Class<PutMethodRequest>(
  "PutMethodRequest",
)(
  {
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
  },
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
) {}
export class TestInvokeAuthorizerRequest extends S.Class<TestInvokeAuthorizerRequest>(
  "TestInvokeAuthorizerRequest",
)(
  {
    restApiId: S.String.pipe(T.HttpLabel("restApiId")),
    authorizerId: S.String.pipe(T.HttpLabel("authorizerId")),
    headers: S.optional(MapOfStringToString),
    multiValueHeaders: S.optional(MapOfStringToList),
    pathWithQueryString: S.optional(S.String),
    body: S.optional(S.String),
    stageVariables: S.optional(MapOfStringToString),
    additionalContext: S.optional(MapOfStringToString),
  },
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
) {}
export class TestInvokeMethodResponse extends S.Class<TestInvokeMethodResponse>(
  "TestInvokeMethodResponse",
)({
  status: S.optional(S.Number),
  body: S.optional(S.String),
  headers: S.optional(MapOfStringToString),
  multiValueHeaders: S.optional(MapOfStringToList),
  log: S.optional(S.String),
  latency: S.optional(S.Number),
}) {}
export class UpdateAccountRequest extends S.Class<UpdateAccountRequest>(
  "UpdateAccountRequest",
)(
  { patchOperations: S.optional(ListOfPatchOperation) },
  T.all(
    T.Http({ method: "PATCH", uri: "/account" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ListOfLong = S.Array(S.Number);
export const ListOfUsage = S.Array(ListOfLong);
export const MapOfKeyUsages = S.Record({ key: S.String, value: ListOfUsage });
export class CreateUsagePlanRequest extends S.Class<CreateUsagePlanRequest>(
  "CreateUsagePlanRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    apiStages: S.optional(ListOfApiStage),
    throttle: S.optional(ThrottleSettings),
    quota: S.optional(QuotaSettings),
    tags: S.optional(MapOfStringToString),
  },
  T.all(
    T.Http({ method: "POST", uri: "/usageplans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Usage extends S.Class<Usage>("Usage")({
  usagePlanId: S.optional(S.String),
  startDate: S.optional(S.String),
  endDate: S.optional(S.String),
  items: S.optional(MapOfKeyUsages).pipe(T.JsonName("values")),
  position: S.optional(S.String).pipe(T.HttpQuery("position")),
}) {}
export class TestInvokeAuthorizerResponse extends S.Class<TestInvokeAuthorizerResponse>(
  "TestInvokeAuthorizerResponse",
)({
  clientStatus: S.optional(S.Number),
  log: S.optional(S.String),
  latency: S.optional(S.Number),
  principalId: S.optional(S.String),
  policy: S.optional(S.String),
  authorization: S.optional(MapOfStringToList),
  claims: S.optional(MapOfStringToString),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Gets a documentation version.
 */
export const getDocumentationVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDocumentationVersionRequest,
    output: DocumentationVersion,
    errors: [
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Gets information about a Stage resource.
 */
export const getStage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMethod = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMethodRequest,
  output: Method,
  errors: [NotFoundException, TooManyRequestsException, UnauthorizedException],
}));
/**
 * Gets an SDK type.
 */
export const getSdkType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getUsage = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const testInvokeAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TestInvokeAuthorizerRequest,
    output: TestInvokeAuthorizerResponse,
    errors: [
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Exports a deployed version of a RestApi in a specified format.
 */
export const getExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSdk = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getStages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importApiKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importDocumentationParts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Sets up a method's integration.
 */
export const putIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putMethod = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteStage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const flushStageAuthorizersCache = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Flushes a stage's cache.
 */
export const flushStageCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importRestApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putGatewayResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putIntegrationResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Adds a MethodResponse to an existing Method resource.
 */
export const putMethodResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putRestApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApiKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBasePathMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Changes information about an ClientCertificate resource.
 */
export const updateClientCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates a documentation part.
 */
export const updateDocumentationPart = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates a documentation version.
 */
export const updateDocumentationVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Changes information about the DomainName resource.
 */
export const updateDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateGatewayResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Represents an update integration.
 */
export const updateIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateIntegrationResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates an existing MethodResponse resource.
 */
export const updateMethodResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Changes information about a model. The maximum size of the model is 400 KB.
 */
export const updateModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRequestValidator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Changes information about the specified API.
 */
export const updateRestApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateStage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateUsage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateUsagePlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVpcLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApiKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBasePathMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a documentation part.
 */
export const createDocumentationPart = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a documentation version
 */
export const createDocumentationVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a new domain name.
 */
export const createDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDomainNameAccessAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRequestValidator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a new RestApi resource.
 */
export const createRestApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createStage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createUsagePlanKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVpcLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createUsagePlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDeployments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Gets documentation versions.
 */
export const getDocumentationVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDocumentationVersionsRequest,
    output: DocumentationVersions,
    errors: [
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Represents a collection on DomainNameAccessAssociations resources.
 */
export const getDomainNameAccessAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDomainNames = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Gets a GatewayResponse of a specified response type on the given RestApi.
 */
export const getGatewayResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getGatewayResponses = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getIntegrationResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIntegrationResponseRequest,
    output: IntegrationResponse,
    errors: [
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Describes a MethodResponse resource.
 */
export const getMethodResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMethodResponseRequest,
  output: MethodResponse,
  errors: [NotFoundException, TooManyRequestsException, UnauthorizedException],
}));
/**
 * Describes existing Models defined for a RestApi resource.
 */
export const getModels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getModelTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRequestValidators = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRequestValidatorsRequest,
    output: RequestValidators,
    errors: [
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists information about a collection of Resource resources.
 */
export const getResources = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists the RestApis resources for your collection.
 */
export const getRestApis = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Gets SDK types
 */
export const getSdkTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getUsagePlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getUsagePlanKeys = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Gets all the usage plans of the caller's account.
 */
export const getUsagePlans = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Gets the VpcLinks collection under the caller's account in a selected region.
 */
export const getVpcLinks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Simulate the invocation of a Method in your RestApi with headers, parameters, and an incoming request body.
 */
export const testInvokeMethod = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBasePathMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBasePathMappingRequest,
    output: DeleteBasePathMappingResponse,
    errors: [
      BadRequestException,
      ConflictException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes the ClientCertificate resource.
 */
export const deleteClientCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteClientCertificateRequest,
    output: DeleteClientCertificateResponse,
    errors: [
      BadRequestException,
      ConflictException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a documentation part
 */
export const deleteDocumentationPart = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDocumentationPartRequest,
    output: DeleteDocumentationPartResponse,
    errors: [
      BadRequestException,
      ConflictException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a documentation version.
 */
export const deleteDocumentationVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDocumentationVersionRequest,
    output: DeleteDocumentationVersionResponse,
    errors: [
      BadRequestException,
      ConflictException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes the DomainName resource.
 */
export const deleteDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDomainNameAccessAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteGatewayResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteGatewayResponseRequest,
    output: DeleteGatewayResponseResponse,
    errors: [
      BadRequestException,
      ConflictException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Represents a delete integration.
 */
export const deleteIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteIntegrationResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIntegrationResponseRequest,
    output: DeleteIntegrationResponseResponse,
    errors: [
      BadRequestException,
      ConflictException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes an existing MethodResponse resource.
 */
export const deleteMethodResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMethodResponseRequest,
    output: DeleteMethodResponseResponse,
    errors: [
      BadRequestException,
      ConflictException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a model.
 */
export const deleteModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRequestValidator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRequestValidatorRequest,
    output: DeleteRequestValidatorResponse,
    errors: [
      BadRequestException,
      ConflictException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a Resource resource.
 */
export const deleteResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRestApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteUsagePlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteUsagePlanKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVpcLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBasePathMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getClientCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetClientCertificateRequest,
    output: ClientCertificate,
    errors: [
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Describes an existing model defined for a RestApi resource.
 */
export const getModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRequestValidator = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRestApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getUsagePlanKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVpcLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const rejectDomainNameAccessAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateMethod = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteApiKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceRequest,
  output: Resource,
  errors: [NotFoundException, TooManyRequestsException, UnauthorizedException],
}));
/**
 * Deletes an existing Method resource.
 */
export const deleteMethod = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApiKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApiKeys = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getAuthorizers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBasePathMappings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getClientCertificates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getDocumentationPart = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDocumentationPartRequest,
    output: DocumentationPart,
    errors: [
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Gets documentation parts.
 */
export const getDocumentationParts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDocumentationPartsRequest,
    output: DocumentationParts,
    errors: [
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Generates a ClientCertificate resource.
 */
export const generateClientCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GenerateClientCertificateRequest,
    output: ClientCertificate,
    errors: [
      BadRequestException,
      ConflictException,
      LimitExceededException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Changes information about a Deployment resource.
 */
export const updateDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
