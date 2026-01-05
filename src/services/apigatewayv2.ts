import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ApiGatewayV2",
  serviceShapeName: "ApiGatewayV2",
});
const auth = T.AwsAuthSigv4({ name: "apigateway" });
const ver = T.ServiceVersion("2018-11-29");
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
export const IdentitySourceList = S.Array(S.String);
export const __listOf__stringMin20Max2048 = S.Array(S.String);
export const AuthorizationScopes = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export const SubnetIdList = S.Array(S.String);
export const __listOf__string = S.Array(S.String);
export class CreateApiMappingRequest extends S.Class<CreateApiMappingRequest>(
  "CreateApiMappingRequest",
)(
  {
    ApiId: S.String.pipe(T.JsonName("apiId")),
    ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Stage: S.String.pipe(T.JsonName("stage")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/domainnames/{DomainName}/apimappings" }),
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    StageName: S.optional(S.String).pipe(T.JsonName("stageName")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/deployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const IntegrationParameters = S.Record({
  key: S.String,
  value: S.String,
});
export const TemplateMap = S.Record({ key: S.String, value: S.String });
export class CreateIntegrationResponseRequest extends S.Class<CreateIntegrationResponseRequest>(
  "CreateIntegrationResponseRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ContentHandlingStrategy: S.optional(S.String).pipe(
      T.JsonName("contentHandlingStrategy"),
    ),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
    IntegrationResponseKey: S.String.pipe(T.JsonName("integrationResponseKey")),
    ResponseParameters: S.optional(IntegrationParameters).pipe(
      T.JsonName("responseParameters"),
    ),
    ResponseTemplates: S.optional(TemplateMap).pipe(
      T.JsonName("responseTemplates"),
    ),
    TemplateSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("templateSelectionExpression"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/apis/{ApiId}/integrations/{IntegrationId}/integrationresponses",
    }),
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.JsonName("name")),
    Schema: S.String.pipe(T.JsonName("schema")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreatePortalProductRequest extends S.Class<CreatePortalProductRequest>(
  "CreatePortalProductRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DisplayName: S.String.pipe(T.JsonName("displayName")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/portalproducts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const RouteModels = S.Record({ key: S.String, value: S.String });
export class ParameterConstraints extends S.Class<ParameterConstraints>(
  "ParameterConstraints",
)({ Required: S.optional(S.Boolean).pipe(T.JsonName("required")) }) {}
export const RouteParameters = S.Record({
  key: S.String,
  value: ParameterConstraints,
});
export class CreateRouteResponseRequest extends S.Class<CreateRouteResponseRequest>(
  "CreateRouteResponseRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ModelSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("modelSelectionExpression"),
    ),
    ResponseModels: S.optional(RouteModels).pipe(T.JsonName("responseModels")),
    ResponseParameters: S.optional(RouteParameters).pipe(
      T.JsonName("responseParameters"),
    ),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
    RouteResponseKey: S.String.pipe(T.JsonName("routeResponseKey")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/apis/{ApiId}/routes/{RouteId}/routeresponses",
    }),
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
    Name: S.String.pipe(T.JsonName("name")),
    SecurityGroupIds: S.optional(SecurityGroupIdList).pipe(
      T.JsonName("securityGroupIds"),
    ),
    SubnetIds: SubnetIdList.pipe(T.JsonName("subnetIds")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/vpclinks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessLogSettingsRequest extends S.Class<DeleteAccessLogSettingsRequest>(
  "DeleteAccessLogSettingsRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/apis/{ApiId}/stages/{StageName}/accesslogsettings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessLogSettingsResponse extends S.Class<DeleteAccessLogSettingsResponse>(
  "DeleteAccessLogSettingsResponse",
)({}) {}
export class DeleteApiRequest extends S.Class<DeleteApiRequest>(
  "DeleteApiRequest",
)(
  { ApiId: S.String.pipe(T.HttpLabel("ApiId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/apis/{ApiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApiResponse extends S.Class<DeleteApiResponse>(
  "DeleteApiResponse",
)({}) {}
export class DeleteApiMappingRequest extends S.Class<DeleteApiMappingRequest>(
  "DeleteApiMappingRequest",
)(
  {
    ApiMappingId: S.String.pipe(T.HttpLabel("ApiMappingId")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domainnames/{DomainName}/apimappings/{ApiMappingId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApiMappingResponse extends S.Class<DeleteApiMappingResponse>(
  "DeleteApiMappingResponse",
)({}) {}
export class DeleteAuthorizerRequest extends S.Class<DeleteAuthorizerRequest>(
  "DeleteAuthorizerRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    AuthorizerId: S.String.pipe(T.HttpLabel("AuthorizerId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/apis/{ApiId}/authorizers/{AuthorizerId}",
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
export class DeleteCorsConfigurationRequest extends S.Class<DeleteCorsConfigurationRequest>(
  "DeleteCorsConfigurationRequest",
)(
  { ApiId: S.String.pipe(T.HttpLabel("ApiId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/apis/{ApiId}/cors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCorsConfigurationResponse extends S.Class<DeleteCorsConfigurationResponse>(
  "DeleteCorsConfigurationResponse",
)({}) {}
export class DeleteDeploymentRequest extends S.Class<DeleteDeploymentRequest>(
  "DeleteDeploymentRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    DeploymentId: S.String.pipe(T.HttpLabel("DeploymentId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/apis/{ApiId}/deployments/{DeploymentId}",
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
export class DeleteDomainNameRequest extends S.Class<DeleteDomainNameRequest>(
  "DeleteDomainNameRequest",
)(
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/domainnames/{DomainName}" }),
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
export class DeleteIntegrationRequest extends S.Class<DeleteIntegrationRequest>(
  "DeleteIntegrationRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/apis/{ApiId}/integrations/{IntegrationId}",
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
    IntegrationResponseId: S.String.pipe(T.HttpLabel("IntegrationResponseId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/apis/{ApiId}/integrations/{IntegrationId}/integrationresponses/{IntegrationResponseId}",
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
export class DeleteModelRequest extends S.Class<DeleteModelRequest>(
  "DeleteModelRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ModelId: S.String.pipe(T.HttpLabel("ModelId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/apis/{ApiId}/models/{ModelId}" }),
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
export class DeletePortalRequest extends S.Class<DeletePortalRequest>(
  "DeletePortalRequest",
)(
  { PortalId: S.String.pipe(T.HttpLabel("PortalId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/portals/{PortalId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePortalResponse extends S.Class<DeletePortalResponse>(
  "DeletePortalResponse",
)({}) {}
export class DeletePortalProductRequest extends S.Class<DeletePortalProductRequest>(
  "DeletePortalProductRequest",
)(
  { PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/portalproducts/{PortalProductId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePortalProductResponse extends S.Class<DeletePortalProductResponse>(
  "DeletePortalProductResponse",
)({}) {}
export class DeletePortalProductSharingPolicyRequest extends S.Class<DeletePortalProductSharingPolicyRequest>(
  "DeletePortalProductSharingPolicyRequest",
)(
  { PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/portalproducts/{PortalProductId}/sharingpolicy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePortalProductSharingPolicyResponse extends S.Class<DeletePortalProductSharingPolicyResponse>(
  "DeletePortalProductSharingPolicyResponse",
)({}) {}
export class DeleteProductPageRequest extends S.Class<DeleteProductPageRequest>(
  "DeleteProductPageRequest",
)(
  {
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ProductPageId: S.String.pipe(T.HttpLabel("ProductPageId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/portalproducts/{PortalProductId}/productpages/{ProductPageId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProductPageResponse extends S.Class<DeleteProductPageResponse>(
  "DeleteProductPageResponse",
)({}) {}
export class DeleteProductRestEndpointPageRequest extends S.Class<DeleteProductRestEndpointPageRequest>(
  "DeleteProductRestEndpointPageRequest",
)(
  {
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ProductRestEndpointPageId: S.String.pipe(
      T.HttpLabel("ProductRestEndpointPageId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/portalproducts/{PortalProductId}/productrestendpointpages/{ProductRestEndpointPageId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProductRestEndpointPageResponse extends S.Class<DeleteProductRestEndpointPageResponse>(
  "DeleteProductRestEndpointPageResponse",
)({}) {}
export class DeleteRouteRequest extends S.Class<DeleteRouteRequest>(
  "DeleteRouteRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/apis/{ApiId}/routes/{RouteId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRouteResponse extends S.Class<DeleteRouteResponse>(
  "DeleteRouteResponse",
)({}) {}
export class DeleteRouteRequestParameterRequest extends S.Class<DeleteRouteRequestParameterRequest>(
  "DeleteRouteRequestParameterRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RequestParameterKey: S.String.pipe(T.HttpLabel("RequestParameterKey")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/apis/{ApiId}/routes/{RouteId}/requestparameters/{RequestParameterKey}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRouteRequestParameterResponse extends S.Class<DeleteRouteRequestParameterResponse>(
  "DeleteRouteRequestParameterResponse",
)({}) {}
export class DeleteRouteResponseRequest extends S.Class<DeleteRouteResponseRequest>(
  "DeleteRouteResponseRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
    RouteResponseId: S.String.pipe(T.HttpLabel("RouteResponseId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/apis/{ApiId}/routes/{RouteId}/routeresponses/{RouteResponseId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRouteResponseResponse extends S.Class<DeleteRouteResponseResponse>(
  "DeleteRouteResponseResponse",
)({}) {}
export class DeleteRouteSettingsRequest extends S.Class<DeleteRouteSettingsRequest>(
  "DeleteRouteSettingsRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RouteKey: S.String.pipe(T.HttpLabel("RouteKey")),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/apis/{ApiId}/stages/{StageName}/routesettings/{RouteKey}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRouteSettingsResponse extends S.Class<DeleteRouteSettingsResponse>(
  "DeleteRouteSettingsResponse",
)({}) {}
export class DeleteRoutingRuleRequest extends S.Class<DeleteRoutingRuleRequest>(
  "DeleteRoutingRuleRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    RoutingRuleId: S.String.pipe(T.HttpLabel("RoutingRuleId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/domainnames/{DomainName}/routingrules/{RoutingRuleId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRoutingRuleResponse extends S.Class<DeleteRoutingRuleResponse>(
  "DeleteRoutingRuleResponse",
)({}) {}
export class DeleteStageRequest extends S.Class<DeleteStageRequest>(
  "DeleteStageRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/apis/{ApiId}/stages/{StageName}" }),
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
export class DeleteVpcLinkRequest extends S.Class<DeleteVpcLinkRequest>(
  "DeleteVpcLinkRequest",
)(
  { VpcLinkId: S.String.pipe(T.HttpLabel("VpcLinkId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/vpclinks/{VpcLinkId}" }),
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
export class DisablePortalRequest extends S.Class<DisablePortalRequest>(
  "DisablePortalRequest",
)(
  { PortalId: S.String.pipe(T.HttpLabel("PortalId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/portals/{PortalId}/publish" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisablePortalResponse extends S.Class<DisablePortalResponse>(
  "DisablePortalResponse",
)({}) {}
export class ExportApiRequest extends S.Class<ExportApiRequest>(
  "ExportApiRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ExportVersion: S.optional(S.String).pipe(T.HttpQuery("exportVersion")),
    IncludeExtensions: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeExtensions"),
    ),
    OutputType: S.String.pipe(T.HttpQuery("outputType")),
    Specification: S.String.pipe(T.HttpLabel("Specification")),
    StageName: S.optional(S.String).pipe(T.HttpQuery("stageName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/exports/{Specification}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApiRequest extends S.Class<GetApiRequest>("GetApiRequest")(
  { ApiId: S.String.pipe(T.HttpLabel("ApiId")) },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis/{ApiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApiMappingRequest extends S.Class<GetApiMappingRequest>(
  "GetApiMappingRequest",
)(
  {
    ApiMappingId: S.String.pipe(T.HttpLabel("ApiMappingId")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domainnames/{DomainName}/apimappings/{ApiMappingId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApiMappingsRequest extends S.Class<GetApiMappingsRequest>(
  "GetApiMappingsRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/domainnames/{DomainName}/apimappings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApisRequest extends S.Class<GetApisRequest>("GetApisRequest")(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis" }),
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    AuthorizerId: S.String.pipe(T.HttpLabel("AuthorizerId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/apis/{ApiId}/authorizers/{AuthorizerId}",
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/authorizers" }),
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    DeploymentId: S.String.pipe(T.HttpLabel("DeploymentId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/apis/{ApiId}/deployments/{DeploymentId}",
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/deployments" }),
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
  { DomainName: S.String.pipe(T.HttpLabel("DomainName")) },
  T.all(
    T.Http({ method: "GET", uri: "/v2/domainnames/{DomainName}" }),
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
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/domainnames" }),
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/apis/{ApiId}/integrations/{IntegrationId}",
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
    IntegrationResponseId: S.String.pipe(T.HttpLabel("IntegrationResponseId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/apis/{ApiId}/integrations/{IntegrationId}/integrationresponses/{IntegrationResponseId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIntegrationResponsesRequest extends S.Class<GetIntegrationResponsesRequest>(
  "GetIntegrationResponsesRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/apis/{ApiId}/integrations/{IntegrationId}/integrationresponses",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIntegrationsRequest extends S.Class<GetIntegrationsRequest>(
  "GetIntegrationsRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/integrations" }),
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ModelId: S.String.pipe(T.HttpLabel("ModelId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/models/{ModelId}" }),
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/models" }),
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ModelId: S.String.pipe(T.HttpLabel("ModelId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/apis/{ApiId}/models/{ModelId}/template",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPortalRequest extends S.Class<GetPortalRequest>(
  "GetPortalRequest",
)(
  { PortalId: S.String.pipe(T.HttpLabel("PortalId")) },
  T.all(
    T.Http({ method: "GET", uri: "/v2/portals/{PortalId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPortalProductRequest extends S.Class<GetPortalProductRequest>(
  "GetPortalProductRequest",
)(
  {
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ResourceOwnerAccountId: S.optional(S.String).pipe(
      T.HttpQuery("resourceOwnerAccountId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/portalproducts/{PortalProductId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPortalProductSharingPolicyRequest extends S.Class<GetPortalProductSharingPolicyRequest>(
  "GetPortalProductSharingPolicyRequest",
)(
  { PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/portalproducts/{PortalProductId}/sharingpolicy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProductPageRequest extends S.Class<GetProductPageRequest>(
  "GetProductPageRequest",
)(
  {
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ProductPageId: S.String.pipe(T.HttpLabel("ProductPageId")),
    ResourceOwnerAccountId: S.optional(S.String).pipe(
      T.HttpQuery("resourceOwnerAccountId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/portalproducts/{PortalProductId}/productpages/{ProductPageId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProductRestEndpointPageRequest extends S.Class<GetProductRestEndpointPageRequest>(
  "GetProductRestEndpointPageRequest",
)(
  {
    IncludeRawDisplayContent: S.optional(S.String).pipe(
      T.HttpQuery("includeRawDisplayContent"),
    ),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ProductRestEndpointPageId: S.String.pipe(
      T.HttpLabel("ProductRestEndpointPageId"),
    ),
    ResourceOwnerAccountId: S.optional(S.String).pipe(
      T.HttpQuery("resourceOwnerAccountId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/portalproducts/{PortalProductId}/productrestendpointpages/{ProductRestEndpointPageId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRouteRequest extends S.Class<GetRouteRequest>(
  "GetRouteRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/routes/{RouteId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRouteResponseRequest extends S.Class<GetRouteResponseRequest>(
  "GetRouteResponseRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
    RouteResponseId: S.String.pipe(T.HttpLabel("RouteResponseId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/apis/{ApiId}/routes/{RouteId}/routeresponses/{RouteResponseId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRouteResponsesRequest extends S.Class<GetRouteResponsesRequest>(
  "GetRouteResponsesRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/apis/{ApiId}/routes/{RouteId}/routeresponses",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRoutesRequest extends S.Class<GetRoutesRequest>(
  "GetRoutesRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/routes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRoutingRuleRequest extends S.Class<GetRoutingRuleRequest>(
  "GetRoutingRuleRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    RoutingRuleId: S.String.pipe(T.HttpLabel("RoutingRuleId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/domainnames/{DomainName}/routingrules/{RoutingRuleId}",
    }),
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/stages/{StageName}" }),
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/stages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTagsRequest extends S.Class<GetTagsRequest>("GetTagsRequest")(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v2/tags/{ResourceArn}" }),
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
  { VpcLinkId: S.String.pipe(T.HttpLabel("VpcLinkId")) },
  T.all(
    T.Http({ method: "GET", uri: "/v2/vpclinks/{VpcLinkId}" }),
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
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/vpclinks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportApiRequest extends S.Class<ImportApiRequest>(
  "ImportApiRequest",
)(
  {
    Basepath: S.optional(S.String).pipe(T.HttpQuery("basepath")),
    Body: S.String.pipe(T.JsonName("body")),
    FailOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failOnWarnings")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v2/apis" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPortalProductsRequest extends S.Class<ListPortalProductsRequest>(
  "ListPortalProductsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ResourceOwner: S.optional(S.String).pipe(T.HttpQuery("resourceOwner")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/portalproducts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPortalsRequest extends S.Class<ListPortalsRequest>(
  "ListPortalsRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/portals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProductPagesRequest extends S.Class<ListProductPagesRequest>(
  "ListProductPagesRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ResourceOwnerAccountId: S.optional(S.String).pipe(
      T.HttpQuery("resourceOwnerAccountId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/portalproducts/{PortalProductId}/productpages",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProductRestEndpointPagesRequest extends S.Class<ListProductRestEndpointPagesRequest>(
  "ListProductRestEndpointPagesRequest",
)(
  {
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ResourceOwnerAccountId: S.optional(S.String).pipe(
      T.HttpQuery("resourceOwnerAccountId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v2/portalproducts/{PortalProductId}/productrestendpointpages",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRoutingRulesRequest extends S.Class<ListRoutingRulesRequest>(
  "ListRoutingRulesRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v2/domainnames/{DomainName}/routingrules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PreviewPortalRequest extends S.Class<PreviewPortalRequest>(
  "PreviewPortalRequest",
)(
  { PortalId: S.String.pipe(T.HttpLabel("PortalId")) },
  T.all(
    T.Http({ method: "POST", uri: "/v2/portals/{PortalId}/preview" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PreviewPortalResponse extends S.Class<PreviewPortalResponse>(
  "PreviewPortalResponse",
)({}) {}
export class PublishPortalRequest extends S.Class<PublishPortalRequest>(
  "PublishPortalRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    PortalId: S.String.pipe(T.HttpLabel("PortalId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/portals/{PortalId}/publish" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublishPortalResponse extends S.Class<PublishPortalResponse>(
  "PublishPortalResponse",
)({}) {}
export class PutPortalProductSharingPolicyRequest extends S.Class<PutPortalProductSharingPolicyRequest>(
  "PutPortalProductSharingPolicyRequest",
)(
  {
    PolicyDocument: S.String.pipe(T.JsonName("policyDocument")),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/portalproducts/{PortalProductId}/sharingpolicy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutPortalProductSharingPolicyResponse extends S.Class<PutPortalProductSharingPolicyResponse>(
  "PutPortalProductSharingPolicyResponse",
)({}) {}
export class RoutingRuleActionInvokeApi extends S.Class<RoutingRuleActionInvokeApi>(
  "RoutingRuleActionInvokeApi",
)({
  ApiId: S.String.pipe(T.JsonName("apiId")),
  Stage: S.String.pipe(T.JsonName("stage")),
  StripBasePath: S.optional(S.Boolean).pipe(T.JsonName("stripBasePath")),
}) {}
export class RoutingRuleAction extends S.Class<RoutingRuleAction>(
  "RoutingRuleAction",
)({ InvokeApi: RoutingRuleActionInvokeApi.pipe(T.JsonName("invokeApi")) }) {}
export const __listOfRoutingRuleAction = S.Array(RoutingRuleAction);
export const __listOfSelectionKey = S.Array(S.String);
export class RoutingRuleMatchBasePaths extends S.Class<RoutingRuleMatchBasePaths>(
  "RoutingRuleMatchBasePaths",
)({ AnyOf: __listOfSelectionKey.pipe(T.JsonName("anyOf")) }) {}
export class RoutingRuleMatchHeaderValue extends S.Class<RoutingRuleMatchHeaderValue>(
  "RoutingRuleMatchHeaderValue",
)({
  Header: S.String.pipe(T.JsonName("header")),
  ValueGlob: S.String.pipe(T.JsonName("valueGlob")),
}) {}
export const __listOfRoutingRuleMatchHeaderValue = S.Array(
  RoutingRuleMatchHeaderValue,
);
export class RoutingRuleMatchHeaders extends S.Class<RoutingRuleMatchHeaders>(
  "RoutingRuleMatchHeaders",
)({ AnyOf: __listOfRoutingRuleMatchHeaderValue.pipe(T.JsonName("anyOf")) }) {}
export class RoutingRuleCondition extends S.Class<RoutingRuleCondition>(
  "RoutingRuleCondition",
)({
  MatchBasePaths: S.optional(RoutingRuleMatchBasePaths).pipe(
    T.JsonName("matchBasePaths"),
  ),
  MatchHeaders: S.optional(RoutingRuleMatchHeaders).pipe(
    T.JsonName("matchHeaders"),
  ),
}) {}
export const __listOfRoutingRuleCondition = S.Array(RoutingRuleCondition);
export class PutRoutingRuleRequest extends S.Class<PutRoutingRuleRequest>(
  "PutRoutingRuleRequest",
)(
  {
    Actions: __listOfRoutingRuleAction.pipe(T.JsonName("actions")),
    Conditions: __listOfRoutingRuleCondition.pipe(T.JsonName("conditions")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    Priority: S.Number.pipe(T.JsonName("priority")),
    RoutingRuleId: S.String.pipe(T.HttpLabel("RoutingRuleId")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v2/domainnames/{DomainName}/routingrules/{RoutingRuleId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReimportApiRequest extends S.Class<ReimportApiRequest>(
  "ReimportApiRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    Basepath: S.optional(S.String).pipe(T.HttpQuery("basepath")),
    Body: S.String.pipe(T.JsonName("body")),
    FailOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failOnWarnings")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v2/apis/{ApiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetAuthorizersCacheRequest extends S.Class<ResetAuthorizersCacheRequest>(
  "ResetAuthorizersCacheRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v2/apis/{ApiId}/stages/{StageName}/cache/authorizers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetAuthorizersCacheResponse extends S.Class<ResetAuthorizersCacheResponse>(
  "ResetAuthorizersCacheResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/tags/{ResourceArn}" }),
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
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/tags/{ResourceArn}" }),
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
export const CorsHeaderList = S.Array(S.String);
export const CorsMethodList = S.Array(S.String);
export const CorsOriginList = S.Array(S.String);
export class Cors extends S.Class<Cors>("Cors")({
  AllowCredentials: S.optional(S.Boolean).pipe(T.JsonName("allowCredentials")),
  AllowHeaders: S.optional(CorsHeaderList).pipe(T.JsonName("allowHeaders")),
  AllowMethods: S.optional(CorsMethodList).pipe(T.JsonName("allowMethods")),
  AllowOrigins: S.optional(CorsOriginList).pipe(T.JsonName("allowOrigins")),
  ExposeHeaders: S.optional(CorsHeaderList).pipe(T.JsonName("exposeHeaders")),
  MaxAge: S.optional(S.Number).pipe(T.JsonName("maxAge")),
}) {}
export class UpdateApiRequest extends S.Class<UpdateApiRequest>(
  "UpdateApiRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ApiKeySelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiKeySelectionExpression"),
    ),
    CorsConfiguration: S.optional(Cors).pipe(T.JsonName("corsConfiguration")),
    CredentialsArn: S.optional(S.String).pipe(T.JsonName("credentialsArn")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DisableSchemaValidation: S.optional(S.Boolean).pipe(
      T.JsonName("disableSchemaValidation"),
    ),
    DisableExecuteApiEndpoint: S.optional(S.Boolean).pipe(
      T.JsonName("disableExecuteApiEndpoint"),
    ),
    IpAddressType: S.optional(S.String).pipe(T.JsonName("ipAddressType")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RouteKey: S.optional(S.String).pipe(T.JsonName("routeKey")),
    RouteSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("routeSelectionExpression"),
    ),
    Target: S.optional(S.String).pipe(T.JsonName("target")),
    Version: S.optional(S.String).pipe(T.JsonName("version")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v2/apis/{ApiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApiMappingRequest extends S.Class<UpdateApiMappingRequest>(
  "UpdateApiMappingRequest",
)(
  {
    ApiId: S.String.pipe(T.JsonName("apiId")),
    ApiMappingId: S.String.pipe(T.HttpLabel("ApiMappingId")),
    ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Stage: S.optional(S.String).pipe(T.JsonName("stage")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/domainnames/{DomainName}/apimappings/{ApiMappingId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class JWTConfiguration extends S.Class<JWTConfiguration>(
  "JWTConfiguration",
)({
  Audience: S.optional(__listOf__string).pipe(T.JsonName("audience")),
  Issuer: S.optional(S.String).pipe(T.JsonName("issuer")),
}) {}
export class UpdateAuthorizerRequest extends S.Class<UpdateAuthorizerRequest>(
  "UpdateAuthorizerRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    AuthorizerCredentialsArn: S.optional(S.String).pipe(
      T.JsonName("authorizerCredentialsArn"),
    ),
    AuthorizerId: S.String.pipe(T.HttpLabel("AuthorizerId")),
    AuthorizerPayloadFormatVersion: S.optional(S.String).pipe(
      T.JsonName("authorizerPayloadFormatVersion"),
    ),
    AuthorizerResultTtlInSeconds: S.optional(S.Number).pipe(
      T.JsonName("authorizerResultTtlInSeconds"),
    ),
    AuthorizerType: S.optional(S.String).pipe(T.JsonName("authorizerType")),
    AuthorizerUri: S.optional(S.String).pipe(T.JsonName("authorizerUri")),
    EnableSimpleResponses: S.optional(S.Boolean).pipe(
      T.JsonName("enableSimpleResponses"),
    ),
    IdentitySource: S.optional(IdentitySourceList).pipe(
      T.JsonName("identitySource"),
    ),
    IdentityValidationExpression: S.optional(S.String).pipe(
      T.JsonName("identityValidationExpression"),
    ),
    JwtConfiguration: S.optional(JWTConfiguration).pipe(
      T.JsonName("jwtConfiguration"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/apis/{ApiId}/authorizers/{AuthorizerId}",
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    DeploymentId: S.String.pipe(T.HttpLabel("DeploymentId")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/apis/{ApiId}/deployments/{DeploymentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DomainNameConfiguration extends S.Class<DomainNameConfiguration>(
  "DomainNameConfiguration",
)({
  ApiGatewayDomainName: S.optional(S.String).pipe(
    T.JsonName("apiGatewayDomainName"),
  ),
  CertificateArn: S.optional(S.String).pipe(T.JsonName("certificateArn")),
  CertificateName: S.optional(S.String).pipe(T.JsonName("certificateName")),
  CertificateUploadDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("certificateUploadDate")),
  DomainNameStatus: S.optional(S.String).pipe(T.JsonName("domainNameStatus")),
  DomainNameStatusMessage: S.optional(S.String).pipe(
    T.JsonName("domainNameStatusMessage"),
  ),
  EndpointType: S.optional(S.String).pipe(T.JsonName("endpointType")),
  HostedZoneId: S.optional(S.String).pipe(T.JsonName("hostedZoneId")),
  IpAddressType: S.optional(S.String).pipe(T.JsonName("ipAddressType")),
  SecurityPolicy: S.optional(S.String).pipe(T.JsonName("securityPolicy")),
  OwnershipVerificationCertificateArn: S.optional(S.String).pipe(
    T.JsonName("ownershipVerificationCertificateArn"),
  ),
}) {}
export const DomainNameConfigurations = S.Array(DomainNameConfiguration);
export class MutualTlsAuthenticationInput extends S.Class<MutualTlsAuthenticationInput>(
  "MutualTlsAuthenticationInput",
)({
  TruststoreUri: S.optional(S.String).pipe(T.JsonName("truststoreUri")),
  TruststoreVersion: S.optional(S.String).pipe(T.JsonName("truststoreVersion")),
}) {}
export class UpdateDomainNameRequest extends S.Class<UpdateDomainNameRequest>(
  "UpdateDomainNameRequest",
)(
  {
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
      T.JsonName("domainNameConfigurations"),
    ),
    MutualTlsAuthentication: S.optional(MutualTlsAuthenticationInput).pipe(
      T.JsonName("mutualTlsAuthentication"),
    ),
    RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v2/domainnames/{DomainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ResponseParameters = S.Record({
  key: S.String,
  value: IntegrationParameters,
});
export class TlsConfigInput extends S.Class<TlsConfigInput>("TlsConfigInput")({
  ServerNameToVerify: S.optional(S.String).pipe(
    T.JsonName("serverNameToVerify"),
  ),
}) {}
export class UpdateIntegrationRequest extends S.Class<UpdateIntegrationRequest>(
  "UpdateIntegrationRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ConnectionId: S.optional(S.String).pipe(T.JsonName("connectionId")),
    ConnectionType: S.optional(S.String).pipe(T.JsonName("connectionType")),
    ContentHandlingStrategy: S.optional(S.String).pipe(
      T.JsonName("contentHandlingStrategy"),
    ),
    CredentialsArn: S.optional(S.String).pipe(T.JsonName("credentialsArn")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
    IntegrationMethod: S.optional(S.String).pipe(
      T.JsonName("integrationMethod"),
    ),
    IntegrationSubtype: S.optional(S.String).pipe(
      T.JsonName("integrationSubtype"),
    ),
    IntegrationType: S.optional(S.String).pipe(T.JsonName("integrationType")),
    IntegrationUri: S.optional(S.String).pipe(T.JsonName("integrationUri")),
    PassthroughBehavior: S.optional(S.String).pipe(
      T.JsonName("passthroughBehavior"),
    ),
    PayloadFormatVersion: S.optional(S.String).pipe(
      T.JsonName("payloadFormatVersion"),
    ),
    RequestParameters: S.optional(IntegrationParameters).pipe(
      T.JsonName("requestParameters"),
    ),
    RequestTemplates: S.optional(TemplateMap).pipe(
      T.JsonName("requestTemplates"),
    ),
    ResponseParameters: S.optional(ResponseParameters).pipe(
      T.JsonName("responseParameters"),
    ),
    TemplateSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("templateSelectionExpression"),
    ),
    TimeoutInMillis: S.optional(S.Number).pipe(T.JsonName("timeoutInMillis")),
    TlsConfig: S.optional(TlsConfigInput).pipe(T.JsonName("tlsConfig")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/apis/{ApiId}/integrations/{IntegrationId}",
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ContentHandlingStrategy: S.optional(S.String).pipe(
      T.JsonName("contentHandlingStrategy"),
    ),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
    IntegrationResponseId: S.String.pipe(T.HttpLabel("IntegrationResponseId")),
    IntegrationResponseKey: S.optional(S.String).pipe(
      T.JsonName("integrationResponseKey"),
    ),
    ResponseParameters: S.optional(IntegrationParameters).pipe(
      T.JsonName("responseParameters"),
    ),
    ResponseTemplates: S.optional(TemplateMap).pipe(
      T.JsonName("responseTemplates"),
    ),
    TemplateSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("templateSelectionExpression"),
    ),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/apis/{ApiId}/integrations/{IntegrationId}/integrationresponses/{IntegrationResponseId}",
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
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    ModelId: S.String.pipe(T.HttpLabel("ModelId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Schema: S.optional(S.String).pipe(T.JsonName("schema")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v2/apis/{ApiId}/models/{ModelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CognitoConfig extends S.Class<CognitoConfig>("CognitoConfig")({
  AppClientId: S.String.pipe(T.JsonName("appClientId")),
  UserPoolArn: S.String.pipe(T.JsonName("userPoolArn")),
  UserPoolDomain: S.String.pipe(T.JsonName("userPoolDomain")),
}) {}
export class None extends S.Class<None>("None")({}) {}
export class Authorization extends S.Class<Authorization>("Authorization")({
  CognitoConfig: S.optional(CognitoConfig).pipe(T.JsonName("cognitoConfig")),
  None: S.optional(None).pipe(T.JsonName("none")),
}) {}
export class ACMManaged extends S.Class<ACMManaged>("ACMManaged")({
  CertificateArn: S.String.pipe(T.JsonName("certificateArn")),
  DomainName: S.String.pipe(T.JsonName("domainName")),
}) {}
export class EndpointConfigurationRequest extends S.Class<EndpointConfigurationRequest>(
  "EndpointConfigurationRequest",
)({
  AcmManaged: S.optional(ACMManaged).pipe(T.JsonName("acmManaged")),
  None: S.optional(None).pipe(T.JsonName("none")),
}) {}
export class CustomColors extends S.Class<CustomColors>("CustomColors")({
  AccentColor: S.String.pipe(T.JsonName("accentColor")),
  BackgroundColor: S.String.pipe(T.JsonName("backgroundColor")),
  ErrorValidationColor: S.String.pipe(T.JsonName("errorValidationColor")),
  HeaderColor: S.String.pipe(T.JsonName("headerColor")),
  NavigationColor: S.String.pipe(T.JsonName("navigationColor")),
  TextColor: S.String.pipe(T.JsonName("textColor")),
}) {}
export class PortalTheme extends S.Class<PortalTheme>("PortalTheme")({
  CustomColors: CustomColors.pipe(T.JsonName("customColors")),
  LogoLastUploaded: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("logoLastUploaded")),
}) {}
export class PortalContent extends S.Class<PortalContent>("PortalContent")({
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DisplayName: S.String.pipe(T.JsonName("displayName")),
  Theme: PortalTheme.pipe(T.JsonName("theme")),
}) {}
export class UpdatePortalRequest extends S.Class<UpdatePortalRequest>(
  "UpdatePortalRequest",
)(
  {
    Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
    EndpointConfiguration: S.optional(EndpointConfigurationRequest).pipe(
      T.JsonName("endpointConfiguration"),
    ),
    IncludedPortalProductArns: S.optional(__listOf__stringMin20Max2048).pipe(
      T.JsonName("includedPortalProductArns"),
    ),
    LogoUri: S.optional(S.String).pipe(T.JsonName("logoUri")),
    PortalContent: S.optional(PortalContent).pipe(T.JsonName("portalContent")),
    PortalId: S.String.pipe(T.HttpLabel("PortalId")),
    RumAppMonitorName: S.optional(S.String).pipe(
      T.JsonName("rumAppMonitorName"),
    ),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v2/portals/{PortalId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisplayContent extends S.Class<DisplayContent>("DisplayContent")({
  Body: S.String.pipe(T.JsonName("body")),
  Title: S.String.pipe(T.JsonName("title")),
}) {}
export class UpdateProductPageRequest extends S.Class<UpdateProductPageRequest>(
  "UpdateProductPageRequest",
)(
  {
    DisplayContent: S.optional(DisplayContent).pipe(
      T.JsonName("displayContent"),
    ),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ProductPageId: S.String.pipe(T.HttpLabel("ProductPageId")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/portalproducts/{PortalProductId}/productpages/{ProductPageId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisplayContentOverrides extends S.Class<DisplayContentOverrides>(
  "DisplayContentOverrides",
)({
  Body: S.optional(S.String).pipe(T.JsonName("body")),
  Endpoint: S.optional(S.String).pipe(T.JsonName("endpoint")),
  OperationName: S.optional(S.String).pipe(T.JsonName("operationName")),
}) {}
export class EndpointDisplayContent extends S.Class<EndpointDisplayContent>(
  "EndpointDisplayContent",
)({
  None: S.optional(None).pipe(T.JsonName("none")),
  Overrides: S.optional(DisplayContentOverrides).pipe(T.JsonName("overrides")),
}) {}
export class UpdateProductRestEndpointPageRequest extends S.Class<UpdateProductRestEndpointPageRequest>(
  "UpdateProductRestEndpointPageRequest",
)(
  {
    DisplayContent: S.optional(EndpointDisplayContent).pipe(
      T.JsonName("displayContent"),
    ),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ProductRestEndpointPageId: S.String.pipe(
      T.HttpLabel("ProductRestEndpointPageId"),
    ),
    TryItState: S.optional(S.String).pipe(T.JsonName("tryItState")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/portalproducts/{PortalProductId}/productrestendpointpages/{ProductRestEndpointPageId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRouteRequest extends S.Class<UpdateRouteRequest>(
  "UpdateRouteRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ApiKeyRequired: S.optional(S.Boolean).pipe(T.JsonName("apiKeyRequired")),
    AuthorizationScopes: S.optional(AuthorizationScopes).pipe(
      T.JsonName("authorizationScopes"),
    ),
    AuthorizationType: S.optional(S.String).pipe(
      T.JsonName("authorizationType"),
    ),
    AuthorizerId: S.optional(S.String).pipe(T.JsonName("authorizerId")),
    ModelSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("modelSelectionExpression"),
    ),
    OperationName: S.optional(S.String).pipe(T.JsonName("operationName")),
    RequestModels: S.optional(RouteModels).pipe(T.JsonName("requestModels")),
    RequestParameters: S.optional(RouteParameters).pipe(
      T.JsonName("requestParameters"),
    ),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
    RouteKey: S.optional(S.String).pipe(T.JsonName("routeKey")),
    RouteResponseSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("routeResponseSelectionExpression"),
    ),
    Target: S.optional(S.String).pipe(T.JsonName("target")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v2/apis/{ApiId}/routes/{RouteId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRouteResponseRequest extends S.Class<UpdateRouteResponseRequest>(
  "UpdateRouteResponseRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ModelSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("modelSelectionExpression"),
    ),
    ResponseModels: S.optional(RouteModels).pipe(T.JsonName("responseModels")),
    ResponseParameters: S.optional(RouteParameters).pipe(
      T.JsonName("responseParameters"),
    ),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
    RouteResponseId: S.String.pipe(T.HttpLabel("RouteResponseId")),
    RouteResponseKey: S.optional(S.String).pipe(T.JsonName("routeResponseKey")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v2/apis/{ApiId}/routes/{RouteId}/routeresponses/{RouteResponseId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AccessLogSettings extends S.Class<AccessLogSettings>(
  "AccessLogSettings",
)({
  DestinationArn: S.optional(S.String).pipe(T.JsonName("destinationArn")),
  Format: S.optional(S.String).pipe(T.JsonName("format")),
}) {}
export class RouteSettings extends S.Class<RouteSettings>("RouteSettings")({
  DataTraceEnabled: S.optional(S.Boolean).pipe(T.JsonName("dataTraceEnabled")),
  DetailedMetricsEnabled: S.optional(S.Boolean).pipe(
    T.JsonName("detailedMetricsEnabled"),
  ),
  LoggingLevel: S.optional(S.String).pipe(T.JsonName("loggingLevel")),
  ThrottlingBurstLimit: S.optional(S.Number).pipe(
    T.JsonName("throttlingBurstLimit"),
  ),
  ThrottlingRateLimit: S.optional(S.Number).pipe(
    T.JsonName("throttlingRateLimit"),
  ),
}) {}
export const RouteSettingsMap = S.Record({
  key: S.String,
  value: RouteSettings,
});
export const StageVariablesMap = S.Record({ key: S.String, value: S.String });
export class UpdateStageRequest extends S.Class<UpdateStageRequest>(
  "UpdateStageRequest",
)(
  {
    AccessLogSettings: S.optional(AccessLogSettings).pipe(
      T.JsonName("accessLogSettings"),
    ),
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    AutoDeploy: S.optional(S.Boolean).pipe(T.JsonName("autoDeploy")),
    ClientCertificateId: S.optional(S.String).pipe(
      T.JsonName("clientCertificateId"),
    ),
    DefaultRouteSettings: S.optional(RouteSettings).pipe(
      T.JsonName("defaultRouteSettings"),
    ),
    DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    RouteSettings: S.optional(RouteSettingsMap).pipe(
      T.JsonName("routeSettings"),
    ),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
    StageVariables: S.optional(StageVariablesMap).pipe(
      T.JsonName("stageVariables"),
    ),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v2/apis/{ApiId}/stages/{StageName}" }),
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
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    VpcLinkId: S.String.pipe(T.HttpLabel("VpcLinkId")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v2/vpclinks/{VpcLinkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateApiRequest extends S.Class<CreateApiRequest>(
  "CreateApiRequest",
)(
  {
    ApiKeySelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiKeySelectionExpression"),
    ),
    CorsConfiguration: S.optional(Cors).pipe(T.JsonName("corsConfiguration")),
    CredentialsArn: S.optional(S.String).pipe(T.JsonName("credentialsArn")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DisableSchemaValidation: S.optional(S.Boolean).pipe(
      T.JsonName("disableSchemaValidation"),
    ),
    DisableExecuteApiEndpoint: S.optional(S.Boolean).pipe(
      T.JsonName("disableExecuteApiEndpoint"),
    ),
    IpAddressType: S.optional(S.String).pipe(T.JsonName("ipAddressType")),
    Name: S.String.pipe(T.JsonName("name")),
    ProtocolType: S.String.pipe(T.JsonName("protocolType")),
    RouteKey: S.optional(S.String).pipe(T.JsonName("routeKey")),
    RouteSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("routeSelectionExpression"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Target: S.optional(S.String).pipe(T.JsonName("target")),
    Version: S.optional(S.String).pipe(T.JsonName("version")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/apis" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateApiMappingResponse extends S.Class<CreateApiMappingResponse>(
  "CreateApiMappingResponse",
)({
  ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
  ApiMappingId: S.optional(S.String).pipe(T.JsonName("apiMappingId")),
  ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
  Stage: S.optional(S.String).pipe(T.JsonName("stage")),
}) {}
export class CreateAuthorizerRequest extends S.Class<CreateAuthorizerRequest>(
  "CreateAuthorizerRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    AuthorizerCredentialsArn: S.optional(S.String).pipe(
      T.JsonName("authorizerCredentialsArn"),
    ),
    AuthorizerPayloadFormatVersion: S.optional(S.String).pipe(
      T.JsonName("authorizerPayloadFormatVersion"),
    ),
    AuthorizerResultTtlInSeconds: S.optional(S.Number).pipe(
      T.JsonName("authorizerResultTtlInSeconds"),
    ),
    AuthorizerType: S.String.pipe(T.JsonName("authorizerType")),
    AuthorizerUri: S.optional(S.String).pipe(T.JsonName("authorizerUri")),
    EnableSimpleResponses: S.optional(S.Boolean).pipe(
      T.JsonName("enableSimpleResponses"),
    ),
    IdentitySource: IdentitySourceList.pipe(T.JsonName("identitySource")),
    IdentityValidationExpression: S.optional(S.String).pipe(
      T.JsonName("identityValidationExpression"),
    ),
    JwtConfiguration: S.optional(JWTConfiguration).pipe(
      T.JsonName("jwtConfiguration"),
    ),
    Name: S.String.pipe(T.JsonName("name")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/authorizers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDeploymentResponse extends S.Class<CreateDeploymentResponse>(
  "CreateDeploymentResponse",
)({
  AutoDeployed: S.optional(S.Boolean).pipe(T.JsonName("autoDeployed")),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
  DeploymentStatus: S.optional(S.String).pipe(T.JsonName("deploymentStatus")),
  DeploymentStatusMessage: S.optional(S.String).pipe(
    T.JsonName("deploymentStatusMessage"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
}) {}
export class CreateDomainNameRequest extends S.Class<CreateDomainNameRequest>(
  "CreateDomainNameRequest",
)(
  {
    DomainName: S.String.pipe(T.JsonName("domainName")),
    DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
      T.JsonName("domainNameConfigurations"),
    ),
    MutualTlsAuthentication: S.optional(MutualTlsAuthenticationInput).pipe(
      T.JsonName("mutualTlsAuthentication"),
    ),
    RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/domainnames" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateIntegrationRequest extends S.Class<CreateIntegrationRequest>(
  "CreateIntegrationRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ConnectionId: S.optional(S.String).pipe(T.JsonName("connectionId")),
    ConnectionType: S.optional(S.String).pipe(T.JsonName("connectionType")),
    ContentHandlingStrategy: S.optional(S.String).pipe(
      T.JsonName("contentHandlingStrategy"),
    ),
    CredentialsArn: S.optional(S.String).pipe(T.JsonName("credentialsArn")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    IntegrationMethod: S.optional(S.String).pipe(
      T.JsonName("integrationMethod"),
    ),
    IntegrationSubtype: S.optional(S.String).pipe(
      T.JsonName("integrationSubtype"),
    ),
    IntegrationType: S.String.pipe(T.JsonName("integrationType")),
    IntegrationUri: S.optional(S.String).pipe(T.JsonName("integrationUri")),
    PassthroughBehavior: S.optional(S.String).pipe(
      T.JsonName("passthroughBehavior"),
    ),
    PayloadFormatVersion: S.optional(S.String).pipe(
      T.JsonName("payloadFormatVersion"),
    ),
    RequestParameters: S.optional(IntegrationParameters).pipe(
      T.JsonName("requestParameters"),
    ),
    RequestTemplates: S.optional(TemplateMap).pipe(
      T.JsonName("requestTemplates"),
    ),
    ResponseParameters: S.optional(ResponseParameters).pipe(
      T.JsonName("responseParameters"),
    ),
    TemplateSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("templateSelectionExpression"),
    ),
    TimeoutInMillis: S.optional(S.Number).pipe(T.JsonName("timeoutInMillis")),
    TlsConfig: S.optional(TlsConfigInput).pipe(T.JsonName("tlsConfig")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/integrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateIntegrationResponseResponse extends S.Class<CreateIntegrationResponseResponse>(
  "CreateIntegrationResponseResponse",
)({
  ContentHandlingStrategy: S.optional(S.String).pipe(
    T.JsonName("contentHandlingStrategy"),
  ),
  IntegrationResponseId: S.optional(S.String).pipe(
    T.JsonName("integrationResponseId"),
  ),
  IntegrationResponseKey: S.optional(S.String).pipe(
    T.JsonName("integrationResponseKey"),
  ),
  ResponseParameters: S.optional(IntegrationParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  ResponseTemplates: S.optional(TemplateMap).pipe(
    T.JsonName("responseTemplates"),
  ),
  TemplateSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("templateSelectionExpression"),
  ),
}) {}
export class CreateModelResponse extends S.Class<CreateModelResponse>(
  "CreateModelResponse",
)({
  ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  ModelId: S.optional(S.String).pipe(T.JsonName("modelId")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Schema: S.optional(S.String).pipe(T.JsonName("schema")),
}) {}
export class Section extends S.Class<Section>("Section")({
  ProductRestEndpointPageArns: __listOf__stringMin20Max2048.pipe(
    T.JsonName("productRestEndpointPageArns"),
  ),
  SectionName: S.String.pipe(T.JsonName("sectionName")),
}) {}
export const __listOfSection = S.Array(Section);
export class DisplayOrder extends S.Class<DisplayOrder>("DisplayOrder")({
  Contents: S.optional(__listOfSection).pipe(T.JsonName("contents")),
  OverviewPageArn: S.optional(S.String).pipe(T.JsonName("overviewPageArn")),
  ProductPageArns: S.optional(__listOf__stringMin20Max2048).pipe(
    T.JsonName("productPageArns"),
  ),
}) {}
export class CreatePortalProductResponse extends S.Class<CreatePortalProductResponse>(
  "CreatePortalProductResponse",
)({
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DisplayName: S.optional(S.String).pipe(T.JsonName("displayName")),
  DisplayOrder: S.optional(DisplayOrder).pipe(T.JsonName("displayOrder")),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  PortalProductArn: S.optional(S.String).pipe(T.JsonName("portalProductArn")),
  PortalProductId: S.optional(S.String).pipe(T.JsonName("portalProductId")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class CreateProductPageRequest extends S.Class<CreateProductPageRequest>(
  "CreateProductPageRequest",
)(
  {
    DisplayContent: DisplayContent.pipe(T.JsonName("displayContent")),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/portalproducts/{PortalProductId}/productpages",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRouteResponseResponse extends S.Class<CreateRouteResponseResponse>(
  "CreateRouteResponseResponse",
)({
  ModelSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("modelSelectionExpression"),
  ),
  ResponseModels: S.optional(RouteModels).pipe(T.JsonName("responseModels")),
  ResponseParameters: S.optional(RouteParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  RouteResponseId: S.optional(S.String).pipe(T.JsonName("routeResponseId")),
  RouteResponseKey: S.optional(S.String).pipe(T.JsonName("routeResponseKey")),
}) {}
export class CreateStageRequest extends S.Class<CreateStageRequest>(
  "CreateStageRequest",
)(
  {
    AccessLogSettings: S.optional(AccessLogSettings).pipe(
      T.JsonName("accessLogSettings"),
    ),
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    AutoDeploy: S.optional(S.Boolean).pipe(T.JsonName("autoDeploy")),
    ClientCertificateId: S.optional(S.String).pipe(
      T.JsonName("clientCertificateId"),
    ),
    DefaultRouteSettings: S.optional(RouteSettings).pipe(
      T.JsonName("defaultRouteSettings"),
    ),
    DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    RouteSettings: S.optional(RouteSettingsMap).pipe(
      T.JsonName("routeSettings"),
    ),
    StageName: S.String.pipe(T.JsonName("stageName")),
    StageVariables: S.optional(StageVariablesMap).pipe(
      T.JsonName("stageVariables"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/stages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVpcLinkResponse extends S.Class<CreateVpcLinkResponse>(
  "CreateVpcLinkResponse",
)({
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  SecurityGroupIds: S.optional(SecurityGroupIdList).pipe(
    T.JsonName("securityGroupIds"),
  ),
  SubnetIds: S.optional(SubnetIdList).pipe(T.JsonName("subnetIds")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  VpcLinkId: S.optional(S.String).pipe(T.JsonName("vpcLinkId")),
  VpcLinkStatus: S.optional(S.String).pipe(T.JsonName("vpcLinkStatus")),
  VpcLinkStatusMessage: S.optional(S.String).pipe(
    T.JsonName("vpcLinkStatusMessage"),
  ),
  VpcLinkVersion: S.optional(S.String).pipe(T.JsonName("vpcLinkVersion")),
}) {}
export class ExportApiResponse extends S.Class<ExportApiResponse>(
  "ExportApiResponse",
)({ body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }) {}
export class GetApiResponse extends S.Class<GetApiResponse>("GetApiResponse")({
  ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
  ApiKeySelectionExpression: S.optional(S.String).pipe(
    T.JsonName("apiKeySelectionExpression"),
  ),
  CorsConfiguration: S.optional(Cors).pipe(T.JsonName("corsConfiguration")),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DisableSchemaValidation: S.optional(S.Boolean).pipe(
    T.JsonName("disableSchemaValidation"),
  ),
  DisableExecuteApiEndpoint: S.optional(S.Boolean).pipe(
    T.JsonName("disableExecuteApiEndpoint"),
  ),
  ImportInfo: S.optional(__listOf__string).pipe(T.JsonName("importInfo")),
  IpAddressType: S.optional(S.String).pipe(T.JsonName("ipAddressType")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  ProtocolType: S.optional(S.String).pipe(T.JsonName("protocolType")),
  RouteSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("routeSelectionExpression"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Version: S.optional(S.String).pipe(T.JsonName("version")),
  Warnings: S.optional(__listOf__string).pipe(T.JsonName("warnings")),
}) {}
export class GetApiMappingResponse extends S.Class<GetApiMappingResponse>(
  "GetApiMappingResponse",
)({
  ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
  ApiMappingId: S.optional(S.String).pipe(T.JsonName("apiMappingId")),
  ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
  Stage: S.optional(S.String).pipe(T.JsonName("stage")),
}) {}
export class GetAuthorizerResponse extends S.Class<GetAuthorizerResponse>(
  "GetAuthorizerResponse",
)({
  AuthorizerCredentialsArn: S.optional(S.String).pipe(
    T.JsonName("authorizerCredentialsArn"),
  ),
  AuthorizerId: S.optional(S.String).pipe(T.JsonName("authorizerId")),
  AuthorizerPayloadFormatVersion: S.optional(S.String).pipe(
    T.JsonName("authorizerPayloadFormatVersion"),
  ),
  AuthorizerResultTtlInSeconds: S.optional(S.Number).pipe(
    T.JsonName("authorizerResultTtlInSeconds"),
  ),
  AuthorizerType: S.optional(S.String).pipe(T.JsonName("authorizerType")),
  AuthorizerUri: S.optional(S.String).pipe(T.JsonName("authorizerUri")),
  EnableSimpleResponses: S.optional(S.Boolean).pipe(
    T.JsonName("enableSimpleResponses"),
  ),
  IdentitySource: S.optional(IdentitySourceList).pipe(
    T.JsonName("identitySource"),
  ),
  IdentityValidationExpression: S.optional(S.String).pipe(
    T.JsonName("identityValidationExpression"),
  ),
  JwtConfiguration: S.optional(JWTConfiguration).pipe(
    T.JsonName("jwtConfiguration"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export class GetDeploymentResponse extends S.Class<GetDeploymentResponse>(
  "GetDeploymentResponse",
)({
  AutoDeployed: S.optional(S.Boolean).pipe(T.JsonName("autoDeployed")),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
  DeploymentStatus: S.optional(S.String).pipe(T.JsonName("deploymentStatus")),
  DeploymentStatusMessage: S.optional(S.String).pipe(
    T.JsonName("deploymentStatusMessage"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
}) {}
export class GetIntegrationResponseResponse extends S.Class<GetIntegrationResponseResponse>(
  "GetIntegrationResponseResponse",
)({
  ContentHandlingStrategy: S.optional(S.String).pipe(
    T.JsonName("contentHandlingStrategy"),
  ),
  IntegrationResponseId: S.optional(S.String).pipe(
    T.JsonName("integrationResponseId"),
  ),
  IntegrationResponseKey: S.optional(S.String).pipe(
    T.JsonName("integrationResponseKey"),
  ),
  ResponseParameters: S.optional(IntegrationParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  ResponseTemplates: S.optional(TemplateMap).pipe(
    T.JsonName("responseTemplates"),
  ),
  TemplateSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("templateSelectionExpression"),
  ),
}) {}
export class GetModelResponse extends S.Class<GetModelResponse>(
  "GetModelResponse",
)({
  ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  ModelId: S.optional(S.String).pipe(T.JsonName("modelId")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Schema: S.optional(S.String).pipe(T.JsonName("schema")),
}) {}
export class GetModelTemplateResponse extends S.Class<GetModelTemplateResponse>(
  "GetModelTemplateResponse",
)({ Value: S.optional(S.String).pipe(T.JsonName("value")) }) {}
export class GetPortalProductResponse extends S.Class<GetPortalProductResponse>(
  "GetPortalProductResponse",
)({
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DisplayName: S.optional(S.String).pipe(T.JsonName("displayName")),
  DisplayOrder: S.optional(DisplayOrder).pipe(T.JsonName("displayOrder")),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  PortalProductArn: S.optional(S.String).pipe(T.JsonName("portalProductArn")),
  PortalProductId: S.optional(S.String).pipe(T.JsonName("portalProductId")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class GetPortalProductSharingPolicyResponse extends S.Class<GetPortalProductSharingPolicyResponse>(
  "GetPortalProductSharingPolicyResponse",
)({
  PolicyDocument: S.optional(S.String).pipe(T.JsonName("policyDocument")),
  PortalProductId: S.optional(S.String).pipe(T.JsonName("portalProductId")),
}) {}
export class GetProductPageResponse extends S.Class<GetProductPageResponse>(
  "GetProductPageResponse",
)({
  DisplayContent: S.optional(DisplayContent).pipe(T.JsonName("displayContent")),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  ProductPageArn: S.optional(S.String).pipe(T.JsonName("productPageArn")),
  ProductPageId: S.optional(S.String).pipe(T.JsonName("productPageId")),
}) {}
export class GetRouteResult extends S.Class<GetRouteResult>("GetRouteResult")({
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ApiKeyRequired: S.optional(S.Boolean).pipe(T.JsonName("apiKeyRequired")),
  AuthorizationScopes: S.optional(AuthorizationScopes).pipe(
    T.JsonName("authorizationScopes"),
  ),
  AuthorizationType: S.optional(S.String).pipe(T.JsonName("authorizationType")),
  AuthorizerId: S.optional(S.String).pipe(T.JsonName("authorizerId")),
  ModelSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("modelSelectionExpression"),
  ),
  OperationName: S.optional(S.String).pipe(T.JsonName("operationName")),
  RequestModels: S.optional(RouteModels).pipe(T.JsonName("requestModels")),
  RequestParameters: S.optional(RouteParameters).pipe(
    T.JsonName("requestParameters"),
  ),
  RouteId: S.optional(S.String).pipe(T.JsonName("routeId")),
  RouteKey: S.optional(S.String).pipe(T.JsonName("routeKey")),
  RouteResponseSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("routeResponseSelectionExpression"),
  ),
  Target: S.optional(S.String).pipe(T.JsonName("target")),
}) {}
export class GetRouteResponseResponse extends S.Class<GetRouteResponseResponse>(
  "GetRouteResponseResponse",
)({
  ModelSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("modelSelectionExpression"),
  ),
  ResponseModels: S.optional(RouteModels).pipe(T.JsonName("responseModels")),
  ResponseParameters: S.optional(RouteParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  RouteResponseId: S.optional(S.String).pipe(T.JsonName("routeResponseId")),
  RouteResponseKey: S.optional(S.String).pipe(T.JsonName("routeResponseKey")),
}) {}
export class GetRoutingRuleResponse extends S.Class<GetRoutingRuleResponse>(
  "GetRoutingRuleResponse",
)({
  Actions: S.optional(__listOfRoutingRuleAction).pipe(T.JsonName("actions")),
  Conditions: S.optional(__listOfRoutingRuleCondition).pipe(
    T.JsonName("conditions"),
  ),
  Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
  RoutingRuleArn: S.optional(S.String).pipe(T.JsonName("routingRuleArn")),
  RoutingRuleId: S.optional(S.String).pipe(T.JsonName("routingRuleId")),
}) {}
export class GetStageResponse extends S.Class<GetStageResponse>(
  "GetStageResponse",
)({
  AccessLogSettings: S.optional(AccessLogSettings).pipe(
    T.JsonName("accessLogSettings"),
  ),
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  AutoDeploy: S.optional(S.Boolean).pipe(T.JsonName("autoDeploy")),
  ClientCertificateId: S.optional(S.String).pipe(
    T.JsonName("clientCertificateId"),
  ),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  DefaultRouteSettings: S.optional(RouteSettings).pipe(
    T.JsonName("defaultRouteSettings"),
  ),
  DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  LastDeploymentStatusMessage: S.optional(S.String).pipe(
    T.JsonName("lastDeploymentStatusMessage"),
  ),
  LastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastUpdatedDate"),
  ),
  RouteSettings: S.optional(RouteSettingsMap).pipe(T.JsonName("routeSettings")),
  StageName: S.optional(S.String).pipe(T.JsonName("stageName")),
  StageVariables: S.optional(StageVariablesMap).pipe(
    T.JsonName("stageVariables"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class GetTagsResponse extends S.Class<GetTagsResponse>(
  "GetTagsResponse",
)({ Tags: S.optional(Tags).pipe(T.JsonName("tags")) }) {}
export class GetVpcLinkResponse extends S.Class<GetVpcLinkResponse>(
  "GetVpcLinkResponse",
)({
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  SecurityGroupIds: S.optional(SecurityGroupIdList).pipe(
    T.JsonName("securityGroupIds"),
  ),
  SubnetIds: S.optional(SubnetIdList).pipe(T.JsonName("subnetIds")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  VpcLinkId: S.optional(S.String).pipe(T.JsonName("vpcLinkId")),
  VpcLinkStatus: S.optional(S.String).pipe(T.JsonName("vpcLinkStatus")),
  VpcLinkStatusMessage: S.optional(S.String).pipe(
    T.JsonName("vpcLinkStatusMessage"),
  ),
  VpcLinkVersion: S.optional(S.String).pipe(T.JsonName("vpcLinkVersion")),
}) {}
export class ImportApiResponse extends S.Class<ImportApiResponse>(
  "ImportApiResponse",
)({
  ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
  ApiKeySelectionExpression: S.optional(S.String).pipe(
    T.JsonName("apiKeySelectionExpression"),
  ),
  CorsConfiguration: S.optional(Cors).pipe(T.JsonName("corsConfiguration")),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DisableSchemaValidation: S.optional(S.Boolean).pipe(
    T.JsonName("disableSchemaValidation"),
  ),
  DisableExecuteApiEndpoint: S.optional(S.Boolean).pipe(
    T.JsonName("disableExecuteApiEndpoint"),
  ),
  ImportInfo: S.optional(__listOf__string).pipe(T.JsonName("importInfo")),
  IpAddressType: S.optional(S.String).pipe(T.JsonName("ipAddressType")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  ProtocolType: S.optional(S.String).pipe(T.JsonName("protocolType")),
  RouteSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("routeSelectionExpression"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Version: S.optional(S.String).pipe(T.JsonName("version")),
  Warnings: S.optional(__listOf__string).pipe(T.JsonName("warnings")),
}) {}
export class PutRoutingRuleResponse extends S.Class<PutRoutingRuleResponse>(
  "PutRoutingRuleResponse",
)({
  Actions: S.optional(__listOfRoutingRuleAction).pipe(T.JsonName("actions")),
  Conditions: S.optional(__listOfRoutingRuleCondition).pipe(
    T.JsonName("conditions"),
  ),
  Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
  RoutingRuleArn: S.optional(S.String).pipe(T.JsonName("routingRuleArn")),
  RoutingRuleId: S.optional(S.String).pipe(T.JsonName("routingRuleId")),
}) {}
export class ReimportApiResponse extends S.Class<ReimportApiResponse>(
  "ReimportApiResponse",
)({
  ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
  ApiKeySelectionExpression: S.optional(S.String).pipe(
    T.JsonName("apiKeySelectionExpression"),
  ),
  CorsConfiguration: S.optional(Cors).pipe(T.JsonName("corsConfiguration")),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DisableSchemaValidation: S.optional(S.Boolean).pipe(
    T.JsonName("disableSchemaValidation"),
  ),
  DisableExecuteApiEndpoint: S.optional(S.Boolean).pipe(
    T.JsonName("disableExecuteApiEndpoint"),
  ),
  ImportInfo: S.optional(__listOf__string).pipe(T.JsonName("importInfo")),
  IpAddressType: S.optional(S.String).pipe(T.JsonName("ipAddressType")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  ProtocolType: S.optional(S.String).pipe(T.JsonName("protocolType")),
  RouteSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("routeSelectionExpression"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Version: S.optional(S.String).pipe(T.JsonName("version")),
  Warnings: S.optional(__listOf__string).pipe(T.JsonName("warnings")),
}) {}
export class UpdateApiResponse extends S.Class<UpdateApiResponse>(
  "UpdateApiResponse",
)({
  ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
  ApiKeySelectionExpression: S.optional(S.String).pipe(
    T.JsonName("apiKeySelectionExpression"),
  ),
  CorsConfiguration: S.optional(Cors).pipe(T.JsonName("corsConfiguration")),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DisableSchemaValidation: S.optional(S.Boolean).pipe(
    T.JsonName("disableSchemaValidation"),
  ),
  DisableExecuteApiEndpoint: S.optional(S.Boolean).pipe(
    T.JsonName("disableExecuteApiEndpoint"),
  ),
  ImportInfo: S.optional(__listOf__string).pipe(T.JsonName("importInfo")),
  IpAddressType: S.optional(S.String).pipe(T.JsonName("ipAddressType")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  ProtocolType: S.optional(S.String).pipe(T.JsonName("protocolType")),
  RouteSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("routeSelectionExpression"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Version: S.optional(S.String).pipe(T.JsonName("version")),
  Warnings: S.optional(__listOf__string).pipe(T.JsonName("warnings")),
}) {}
export class UpdateApiMappingResponse extends S.Class<UpdateApiMappingResponse>(
  "UpdateApiMappingResponse",
)({
  ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
  ApiMappingId: S.optional(S.String).pipe(T.JsonName("apiMappingId")),
  ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
  Stage: S.optional(S.String).pipe(T.JsonName("stage")),
}) {}
export class UpdateAuthorizerResponse extends S.Class<UpdateAuthorizerResponse>(
  "UpdateAuthorizerResponse",
)({
  AuthorizerCredentialsArn: S.optional(S.String).pipe(
    T.JsonName("authorizerCredentialsArn"),
  ),
  AuthorizerId: S.optional(S.String).pipe(T.JsonName("authorizerId")),
  AuthorizerPayloadFormatVersion: S.optional(S.String).pipe(
    T.JsonName("authorizerPayloadFormatVersion"),
  ),
  AuthorizerResultTtlInSeconds: S.optional(S.Number).pipe(
    T.JsonName("authorizerResultTtlInSeconds"),
  ),
  AuthorizerType: S.optional(S.String).pipe(T.JsonName("authorizerType")),
  AuthorizerUri: S.optional(S.String).pipe(T.JsonName("authorizerUri")),
  EnableSimpleResponses: S.optional(S.Boolean).pipe(
    T.JsonName("enableSimpleResponses"),
  ),
  IdentitySource: S.optional(IdentitySourceList).pipe(
    T.JsonName("identitySource"),
  ),
  IdentityValidationExpression: S.optional(S.String).pipe(
    T.JsonName("identityValidationExpression"),
  ),
  JwtConfiguration: S.optional(JWTConfiguration).pipe(
    T.JsonName("jwtConfiguration"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export class UpdateDeploymentResponse extends S.Class<UpdateDeploymentResponse>(
  "UpdateDeploymentResponse",
)({
  AutoDeployed: S.optional(S.Boolean).pipe(T.JsonName("autoDeployed")),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
  DeploymentStatus: S.optional(S.String).pipe(T.JsonName("deploymentStatus")),
  DeploymentStatusMessage: S.optional(S.String).pipe(
    T.JsonName("deploymentStatusMessage"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
}) {}
export class MutualTlsAuthentication extends S.Class<MutualTlsAuthentication>(
  "MutualTlsAuthentication",
)({
  TruststoreUri: S.optional(S.String).pipe(T.JsonName("truststoreUri")),
  TruststoreVersion: S.optional(S.String).pipe(T.JsonName("truststoreVersion")),
  TruststoreWarnings: S.optional(__listOf__string).pipe(
    T.JsonName("truststoreWarnings"),
  ),
}) {}
export class UpdateDomainNameResponse extends S.Class<UpdateDomainNameResponse>(
  "UpdateDomainNameResponse",
)({
  ApiMappingSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("apiMappingSelectionExpression"),
  ),
  DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
  DomainNameArn: S.optional(S.String).pipe(T.JsonName("domainNameArn")),
  DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
    T.JsonName("domainNameConfigurations"),
  ),
  MutualTlsAuthentication: S.optional(MutualTlsAuthentication).pipe(
    T.JsonName("mutualTlsAuthentication"),
  ),
  RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class TlsConfig extends S.Class<TlsConfig>("TlsConfig")({
  ServerNameToVerify: S.optional(S.String).pipe(
    T.JsonName("serverNameToVerify"),
  ),
}) {}
export class UpdateIntegrationResult extends S.Class<UpdateIntegrationResult>(
  "UpdateIntegrationResult",
)({
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ConnectionId: S.optional(S.String).pipe(T.JsonName("connectionId")),
  ConnectionType: S.optional(S.String).pipe(T.JsonName("connectionType")),
  ContentHandlingStrategy: S.optional(S.String).pipe(
    T.JsonName("contentHandlingStrategy"),
  ),
  CredentialsArn: S.optional(S.String).pipe(T.JsonName("credentialsArn")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  IntegrationId: S.optional(S.String).pipe(T.JsonName("integrationId")),
  IntegrationMethod: S.optional(S.String).pipe(T.JsonName("integrationMethod")),
  IntegrationResponseSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("integrationResponseSelectionExpression"),
  ),
  IntegrationSubtype: S.optional(S.String).pipe(
    T.JsonName("integrationSubtype"),
  ),
  IntegrationType: S.optional(S.String).pipe(T.JsonName("integrationType")),
  IntegrationUri: S.optional(S.String).pipe(T.JsonName("integrationUri")),
  PassthroughBehavior: S.optional(S.String).pipe(
    T.JsonName("passthroughBehavior"),
  ),
  PayloadFormatVersion: S.optional(S.String).pipe(
    T.JsonName("payloadFormatVersion"),
  ),
  RequestParameters: S.optional(IntegrationParameters).pipe(
    T.JsonName("requestParameters"),
  ),
  RequestTemplates: S.optional(TemplateMap).pipe(
    T.JsonName("requestTemplates"),
  ),
  ResponseParameters: S.optional(ResponseParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  TemplateSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("templateSelectionExpression"),
  ),
  TimeoutInMillis: S.optional(S.Number).pipe(T.JsonName("timeoutInMillis")),
  TlsConfig: S.optional(TlsConfig).pipe(T.JsonName("tlsConfig")),
}) {}
export class UpdateIntegrationResponseResponse extends S.Class<UpdateIntegrationResponseResponse>(
  "UpdateIntegrationResponseResponse",
)({
  ContentHandlingStrategy: S.optional(S.String).pipe(
    T.JsonName("contentHandlingStrategy"),
  ),
  IntegrationResponseId: S.optional(S.String).pipe(
    T.JsonName("integrationResponseId"),
  ),
  IntegrationResponseKey: S.optional(S.String).pipe(
    T.JsonName("integrationResponseKey"),
  ),
  ResponseParameters: S.optional(IntegrationParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  ResponseTemplates: S.optional(TemplateMap).pipe(
    T.JsonName("responseTemplates"),
  ),
  TemplateSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("templateSelectionExpression"),
  ),
}) {}
export class UpdateModelResponse extends S.Class<UpdateModelResponse>(
  "UpdateModelResponse",
)({
  ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  ModelId: S.optional(S.String).pipe(T.JsonName("modelId")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Schema: S.optional(S.String).pipe(T.JsonName("schema")),
}) {}
export class EndpointConfigurationResponse extends S.Class<EndpointConfigurationResponse>(
  "EndpointConfigurationResponse",
)({
  CertificateArn: S.optional(S.String).pipe(T.JsonName("certificateArn")),
  DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
  PortalDefaultDomainName: S.String.pipe(T.JsonName("portalDefaultDomainName")),
  PortalDomainHostedZoneId: S.String.pipe(
    T.JsonName("portalDomainHostedZoneId"),
  ),
}) {}
export class StatusException extends S.Class<StatusException>(
  "StatusException",
)({
  Exception: S.optional(S.String).pipe(T.JsonName("exception")),
  Message: S.optional(S.String).pipe(T.JsonName("message")),
}) {}
export class Preview extends S.Class<Preview>("Preview")({
  PreviewStatus: S.String.pipe(T.JsonName("previewStatus")),
  PreviewUrl: S.optional(S.String).pipe(T.JsonName("previewUrl")),
  StatusException: S.optional(StatusException).pipe(
    T.JsonName("statusException"),
  ),
}) {}
export class UpdatePortalResponse extends S.Class<UpdatePortalResponse>(
  "UpdatePortalResponse",
)({
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  EndpointConfiguration: S.optional(EndpointConfigurationResponse).pipe(
    T.JsonName("endpointConfiguration"),
  ),
  IncludedPortalProductArns: S.optional(__listOf__stringMin20Max2048).pipe(
    T.JsonName("includedPortalProductArns"),
  ),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  LastPublished: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastPublished"),
  ),
  LastPublishedDescription: S.optional(S.String).pipe(
    T.JsonName("lastPublishedDescription"),
  ),
  PortalArn: S.optional(S.String).pipe(T.JsonName("portalArn")),
  PortalContent: S.optional(PortalContent).pipe(T.JsonName("portalContent")),
  PortalId: S.optional(S.String).pipe(T.JsonName("portalId")),
  Preview: S.optional(Preview).pipe(T.JsonName("preview")),
  PublishStatus: S.optional(S.String).pipe(T.JsonName("publishStatus")),
  RumAppMonitorName: S.optional(S.String).pipe(T.JsonName("rumAppMonitorName")),
  StatusException: S.optional(StatusException).pipe(
    T.JsonName("statusException"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class UpdateProductPageResponse extends S.Class<UpdateProductPageResponse>(
  "UpdateProductPageResponse",
)({
  DisplayContent: S.optional(DisplayContent).pipe(T.JsonName("displayContent")),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  ProductPageArn: S.optional(S.String).pipe(T.JsonName("productPageArn")),
  ProductPageId: S.optional(S.String).pipe(T.JsonName("productPageId")),
}) {}
export class EndpointDisplayContentResponse extends S.Class<EndpointDisplayContentResponse>(
  "EndpointDisplayContentResponse",
)({
  Body: S.optional(S.String).pipe(T.JsonName("body")),
  Endpoint: S.String.pipe(T.JsonName("endpoint")),
  OperationName: S.optional(S.String).pipe(T.JsonName("operationName")),
}) {}
export class IdentifierParts extends S.Class<IdentifierParts>(
  "IdentifierParts",
)({
  Method: S.String.pipe(T.JsonName("method")),
  Path: S.String.pipe(T.JsonName("path")),
  RestApiId: S.String.pipe(T.JsonName("restApiId")),
  Stage: S.String.pipe(T.JsonName("stage")),
}) {}
export class RestEndpointIdentifier extends S.Class<RestEndpointIdentifier>(
  "RestEndpointIdentifier",
)({
  IdentifierParts: S.optional(IdentifierParts).pipe(
    T.JsonName("identifierParts"),
  ),
}) {}
export class UpdateProductRestEndpointPageResponse extends S.Class<UpdateProductRestEndpointPageResponse>(
  "UpdateProductRestEndpointPageResponse",
)({
  DisplayContent: S.optional(EndpointDisplayContentResponse).pipe(
    T.JsonName("displayContent"),
  ),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  ProductRestEndpointPageArn: S.optional(S.String).pipe(
    T.JsonName("productRestEndpointPageArn"),
  ),
  ProductRestEndpointPageId: S.optional(S.String).pipe(
    T.JsonName("productRestEndpointPageId"),
  ),
  RestEndpointIdentifier: S.optional(RestEndpointIdentifier).pipe(
    T.JsonName("restEndpointIdentifier"),
  ),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  StatusException: S.optional(StatusException).pipe(
    T.JsonName("statusException"),
  ),
  TryItState: S.optional(S.String).pipe(T.JsonName("tryItState")),
}) {}
export class UpdateRouteResult extends S.Class<UpdateRouteResult>(
  "UpdateRouteResult",
)({
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ApiKeyRequired: S.optional(S.Boolean).pipe(T.JsonName("apiKeyRequired")),
  AuthorizationScopes: S.optional(AuthorizationScopes).pipe(
    T.JsonName("authorizationScopes"),
  ),
  AuthorizationType: S.optional(S.String).pipe(T.JsonName("authorizationType")),
  AuthorizerId: S.optional(S.String).pipe(T.JsonName("authorizerId")),
  ModelSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("modelSelectionExpression"),
  ),
  OperationName: S.optional(S.String).pipe(T.JsonName("operationName")),
  RequestModels: S.optional(RouteModels).pipe(T.JsonName("requestModels")),
  RequestParameters: S.optional(RouteParameters).pipe(
    T.JsonName("requestParameters"),
  ),
  RouteId: S.optional(S.String).pipe(T.JsonName("routeId")),
  RouteKey: S.optional(S.String).pipe(T.JsonName("routeKey")),
  RouteResponseSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("routeResponseSelectionExpression"),
  ),
  Target: S.optional(S.String).pipe(T.JsonName("target")),
}) {}
export class UpdateRouteResponseResponse extends S.Class<UpdateRouteResponseResponse>(
  "UpdateRouteResponseResponse",
)({
  ModelSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("modelSelectionExpression"),
  ),
  ResponseModels: S.optional(RouteModels).pipe(T.JsonName("responseModels")),
  ResponseParameters: S.optional(RouteParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  RouteResponseId: S.optional(S.String).pipe(T.JsonName("routeResponseId")),
  RouteResponseKey: S.optional(S.String).pipe(T.JsonName("routeResponseKey")),
}) {}
export class UpdateStageResponse extends S.Class<UpdateStageResponse>(
  "UpdateStageResponse",
)({
  AccessLogSettings: S.optional(AccessLogSettings).pipe(
    T.JsonName("accessLogSettings"),
  ),
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  AutoDeploy: S.optional(S.Boolean).pipe(T.JsonName("autoDeploy")),
  ClientCertificateId: S.optional(S.String).pipe(
    T.JsonName("clientCertificateId"),
  ),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  DefaultRouteSettings: S.optional(RouteSettings).pipe(
    T.JsonName("defaultRouteSettings"),
  ),
  DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  LastDeploymentStatusMessage: S.optional(S.String).pipe(
    T.JsonName("lastDeploymentStatusMessage"),
  ),
  LastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastUpdatedDate"),
  ),
  RouteSettings: S.optional(RouteSettingsMap).pipe(T.JsonName("routeSettings")),
  StageName: S.optional(S.String).pipe(T.JsonName("stageName")),
  StageVariables: S.optional(StageVariablesMap).pipe(
    T.JsonName("stageVariables"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class UpdateVpcLinkResponse extends S.Class<UpdateVpcLinkResponse>(
  "UpdateVpcLinkResponse",
)({
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  SecurityGroupIds: S.optional(SecurityGroupIdList).pipe(
    T.JsonName("securityGroupIds"),
  ),
  SubnetIds: S.optional(SubnetIdList).pipe(T.JsonName("subnetIds")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  VpcLinkId: S.optional(S.String).pipe(T.JsonName("vpcLinkId")),
  VpcLinkStatus: S.optional(S.String).pipe(T.JsonName("vpcLinkStatus")),
  VpcLinkStatusMessage: S.optional(S.String).pipe(
    T.JsonName("vpcLinkStatusMessage"),
  ),
  VpcLinkVersion: S.optional(S.String).pipe(T.JsonName("vpcLinkVersion")),
}) {}
export class ApiMapping extends S.Class<ApiMapping>("ApiMapping")({
  ApiId: S.String.pipe(T.JsonName("apiId")),
  ApiMappingId: S.optional(S.String).pipe(T.JsonName("apiMappingId")),
  ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
  Stage: S.String.pipe(T.JsonName("stage")),
}) {}
export const __listOfApiMapping = S.Array(ApiMapping);
export class Api extends S.Class<Api>("Api")({
  ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
  ApiKeySelectionExpression: S.optional(S.String).pipe(
    T.JsonName("apiKeySelectionExpression"),
  ),
  CorsConfiguration: S.optional(Cors).pipe(T.JsonName("corsConfiguration")),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DisableSchemaValidation: S.optional(S.Boolean).pipe(
    T.JsonName("disableSchemaValidation"),
  ),
  DisableExecuteApiEndpoint: S.optional(S.Boolean).pipe(
    T.JsonName("disableExecuteApiEndpoint"),
  ),
  ImportInfo: S.optional(__listOf__string).pipe(T.JsonName("importInfo")),
  IpAddressType: S.optional(S.String).pipe(T.JsonName("ipAddressType")),
  Name: S.String.pipe(T.JsonName("name")),
  ProtocolType: S.String.pipe(T.JsonName("protocolType")),
  RouteSelectionExpression: S.String.pipe(
    T.JsonName("routeSelectionExpression"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Version: S.optional(S.String).pipe(T.JsonName("version")),
  Warnings: S.optional(__listOf__string).pipe(T.JsonName("warnings")),
}) {}
export const __listOfApi = S.Array(Api);
export class Authorizer extends S.Class<Authorizer>("Authorizer")({
  AuthorizerCredentialsArn: S.optional(S.String).pipe(
    T.JsonName("authorizerCredentialsArn"),
  ),
  AuthorizerId: S.optional(S.String).pipe(T.JsonName("authorizerId")),
  AuthorizerPayloadFormatVersion: S.optional(S.String).pipe(
    T.JsonName("authorizerPayloadFormatVersion"),
  ),
  AuthorizerResultTtlInSeconds: S.optional(S.Number).pipe(
    T.JsonName("authorizerResultTtlInSeconds"),
  ),
  AuthorizerType: S.optional(S.String).pipe(T.JsonName("authorizerType")),
  AuthorizerUri: S.optional(S.String).pipe(T.JsonName("authorizerUri")),
  EnableSimpleResponses: S.optional(S.Boolean).pipe(
    T.JsonName("enableSimpleResponses"),
  ),
  IdentitySource: S.optional(IdentitySourceList).pipe(
    T.JsonName("identitySource"),
  ),
  IdentityValidationExpression: S.optional(S.String).pipe(
    T.JsonName("identityValidationExpression"),
  ),
  JwtConfiguration: S.optional(JWTConfiguration).pipe(
    T.JsonName("jwtConfiguration"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
}) {}
export const __listOfAuthorizer = S.Array(Authorizer);
export class Deployment extends S.Class<Deployment>("Deployment")({
  AutoDeployed: S.optional(S.Boolean).pipe(T.JsonName("autoDeployed")),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
  DeploymentStatus: S.optional(S.String).pipe(T.JsonName("deploymentStatus")),
  DeploymentStatusMessage: S.optional(S.String).pipe(
    T.JsonName("deploymentStatusMessage"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
}) {}
export const __listOfDeployment = S.Array(Deployment);
export class DomainName extends S.Class<DomainName>("DomainName")({
  ApiMappingSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("apiMappingSelectionExpression"),
  ),
  DomainName: S.String.pipe(T.JsonName("domainName")),
  DomainNameArn: S.optional(S.String).pipe(T.JsonName("domainNameArn")),
  DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
    T.JsonName("domainNameConfigurations"),
  ),
  MutualTlsAuthentication: S.optional(MutualTlsAuthentication).pipe(
    T.JsonName("mutualTlsAuthentication"),
  ),
  RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfDomainName = S.Array(DomainName);
export class IntegrationResponse extends S.Class<IntegrationResponse>(
  "IntegrationResponse",
)({
  ContentHandlingStrategy: S.optional(S.String).pipe(
    T.JsonName("contentHandlingStrategy"),
  ),
  IntegrationResponseId: S.optional(S.String).pipe(
    T.JsonName("integrationResponseId"),
  ),
  IntegrationResponseKey: S.String.pipe(T.JsonName("integrationResponseKey")),
  ResponseParameters: S.optional(IntegrationParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  ResponseTemplates: S.optional(TemplateMap).pipe(
    T.JsonName("responseTemplates"),
  ),
  TemplateSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("templateSelectionExpression"),
  ),
}) {}
export const __listOfIntegrationResponse = S.Array(IntegrationResponse);
export class Integration extends S.Class<Integration>("Integration")({
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ConnectionId: S.optional(S.String).pipe(T.JsonName("connectionId")),
  ConnectionType: S.optional(S.String).pipe(T.JsonName("connectionType")),
  ContentHandlingStrategy: S.optional(S.String).pipe(
    T.JsonName("contentHandlingStrategy"),
  ),
  CredentialsArn: S.optional(S.String).pipe(T.JsonName("credentialsArn")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  IntegrationId: S.optional(S.String).pipe(T.JsonName("integrationId")),
  IntegrationMethod: S.optional(S.String).pipe(T.JsonName("integrationMethod")),
  IntegrationResponseSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("integrationResponseSelectionExpression"),
  ),
  IntegrationSubtype: S.optional(S.String).pipe(
    T.JsonName("integrationSubtype"),
  ),
  IntegrationType: S.optional(S.String).pipe(T.JsonName("integrationType")),
  IntegrationUri: S.optional(S.String).pipe(T.JsonName("integrationUri")),
  PassthroughBehavior: S.optional(S.String).pipe(
    T.JsonName("passthroughBehavior"),
  ),
  PayloadFormatVersion: S.optional(S.String).pipe(
    T.JsonName("payloadFormatVersion"),
  ),
  RequestParameters: S.optional(IntegrationParameters).pipe(
    T.JsonName("requestParameters"),
  ),
  RequestTemplates: S.optional(TemplateMap).pipe(
    T.JsonName("requestTemplates"),
  ),
  ResponseParameters: S.optional(ResponseParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  TemplateSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("templateSelectionExpression"),
  ),
  TimeoutInMillis: S.optional(S.Number).pipe(T.JsonName("timeoutInMillis")),
  TlsConfig: S.optional(TlsConfig).pipe(T.JsonName("tlsConfig")),
}) {}
export const __listOfIntegration = S.Array(Integration);
export class Model extends S.Class<Model>("Model")({
  ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  ModelId: S.optional(S.String).pipe(T.JsonName("modelId")),
  Name: S.String.pipe(T.JsonName("name")),
  Schema: S.optional(S.String).pipe(T.JsonName("schema")),
}) {}
export const __listOfModel = S.Array(Model);
export class RouteResponse extends S.Class<RouteResponse>("RouteResponse")({
  ModelSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("modelSelectionExpression"),
  ),
  ResponseModels: S.optional(RouteModels).pipe(T.JsonName("responseModels")),
  ResponseParameters: S.optional(RouteParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  RouteResponseId: S.optional(S.String).pipe(T.JsonName("routeResponseId")),
  RouteResponseKey: S.String.pipe(T.JsonName("routeResponseKey")),
}) {}
export const __listOfRouteResponse = S.Array(RouteResponse);
export class Route extends S.Class<Route>("Route")({
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ApiKeyRequired: S.optional(S.Boolean).pipe(T.JsonName("apiKeyRequired")),
  AuthorizationScopes: S.optional(AuthorizationScopes).pipe(
    T.JsonName("authorizationScopes"),
  ),
  AuthorizationType: S.optional(S.String).pipe(T.JsonName("authorizationType")),
  AuthorizerId: S.optional(S.String).pipe(T.JsonName("authorizerId")),
  ModelSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("modelSelectionExpression"),
  ),
  OperationName: S.optional(S.String).pipe(T.JsonName("operationName")),
  RequestModels: S.optional(RouteModels).pipe(T.JsonName("requestModels")),
  RequestParameters: S.optional(RouteParameters).pipe(
    T.JsonName("requestParameters"),
  ),
  RouteId: S.optional(S.String).pipe(T.JsonName("routeId")),
  RouteKey: S.String.pipe(T.JsonName("routeKey")),
  RouteResponseSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("routeResponseSelectionExpression"),
  ),
  Target: S.optional(S.String).pipe(T.JsonName("target")),
}) {}
export const __listOfRoute = S.Array(Route);
export class Stage extends S.Class<Stage>("Stage")({
  AccessLogSettings: S.optional(AccessLogSettings).pipe(
    T.JsonName("accessLogSettings"),
  ),
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  AutoDeploy: S.optional(S.Boolean).pipe(T.JsonName("autoDeploy")),
  ClientCertificateId: S.optional(S.String).pipe(
    T.JsonName("clientCertificateId"),
  ),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  DefaultRouteSettings: S.optional(RouteSettings).pipe(
    T.JsonName("defaultRouteSettings"),
  ),
  DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  LastDeploymentStatusMessage: S.optional(S.String).pipe(
    T.JsonName("lastDeploymentStatusMessage"),
  ),
  LastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastUpdatedDate"),
  ),
  RouteSettings: S.optional(RouteSettingsMap).pipe(T.JsonName("routeSettings")),
  StageName: S.String.pipe(T.JsonName("stageName")),
  StageVariables: S.optional(StageVariablesMap).pipe(
    T.JsonName("stageVariables"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfStage = S.Array(Stage);
export class VpcLink extends S.Class<VpcLink>("VpcLink")({
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  SecurityGroupIds: SecurityGroupIdList.pipe(T.JsonName("securityGroupIds")),
  SubnetIds: SubnetIdList.pipe(T.JsonName("subnetIds")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  VpcLinkId: S.String.pipe(T.JsonName("vpcLinkId")),
  VpcLinkStatus: S.optional(S.String).pipe(T.JsonName("vpcLinkStatus")),
  VpcLinkStatusMessage: S.optional(S.String).pipe(
    T.JsonName("vpcLinkStatusMessage"),
  ),
  VpcLinkVersion: S.optional(S.String).pipe(T.JsonName("vpcLinkVersion")),
}) {}
export const __listOfVpcLink = S.Array(VpcLink);
export class PortalProductSummary extends S.Class<PortalProductSummary>(
  "PortalProductSummary",
)({
  Description: S.String.pipe(T.JsonName("description")),
  DisplayName: S.String.pipe(T.JsonName("displayName")),
  LastModified: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("lastModified"),
  ),
  PortalProductArn: S.String.pipe(T.JsonName("portalProductArn")),
  PortalProductId: S.String.pipe(T.JsonName("portalProductId")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfPortalProductSummary = S.Array(PortalProductSummary);
export class PortalSummary extends S.Class<PortalSummary>("PortalSummary")({
  Authorization: Authorization.pipe(T.JsonName("authorization")),
  EndpointConfiguration: EndpointConfigurationResponse.pipe(
    T.JsonName("endpointConfiguration"),
  ),
  IncludedPortalProductArns: __listOf__stringMin20Max2048.pipe(
    T.JsonName("includedPortalProductArns"),
  ),
  LastModified: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("lastModified"),
  ),
  LastPublished: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastPublished"),
  ),
  LastPublishedDescription: S.optional(S.String).pipe(
    T.JsonName("lastPublishedDescription"),
  ),
  PortalArn: S.String.pipe(T.JsonName("portalArn")),
  PortalContent: PortalContent.pipe(T.JsonName("portalContent")),
  PortalId: S.String.pipe(T.JsonName("portalId")),
  Preview: S.optional(Preview).pipe(T.JsonName("preview")),
  PublishStatus: S.optional(S.String).pipe(T.JsonName("publishStatus")),
  RumAppMonitorName: S.optional(S.String).pipe(T.JsonName("rumAppMonitorName")),
  StatusException: S.optional(StatusException).pipe(
    T.JsonName("statusException"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfPortalSummary = S.Array(PortalSummary);
export class ProductPageSummaryNoBody extends S.Class<ProductPageSummaryNoBody>(
  "ProductPageSummaryNoBody",
)({
  LastModified: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("lastModified"),
  ),
  PageTitle: S.String.pipe(T.JsonName("pageTitle")),
  ProductPageArn: S.String.pipe(T.JsonName("productPageArn")),
  ProductPageId: S.String.pipe(T.JsonName("productPageId")),
}) {}
export const __listOfProductPageSummaryNoBody = S.Array(
  ProductPageSummaryNoBody,
);
export class ProductRestEndpointPageSummaryNoBody extends S.Class<ProductRestEndpointPageSummaryNoBody>(
  "ProductRestEndpointPageSummaryNoBody",
)({
  Endpoint: S.String.pipe(T.JsonName("endpoint")),
  LastModified: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("lastModified"),
  ),
  OperationName: S.optional(S.String).pipe(T.JsonName("operationName")),
  ProductRestEndpointPageArn: S.String.pipe(
    T.JsonName("productRestEndpointPageArn"),
  ),
  ProductRestEndpointPageId: S.String.pipe(
    T.JsonName("productRestEndpointPageId"),
  ),
  RestEndpointIdentifier: RestEndpointIdentifier.pipe(
    T.JsonName("restEndpointIdentifier"),
  ),
  Status: S.String.pipe(T.JsonName("status")),
  StatusException: S.optional(StatusException).pipe(
    T.JsonName("statusException"),
  ),
  TryItState: S.String.pipe(T.JsonName("tryItState")),
}) {}
export const __listOfProductRestEndpointPageSummaryNoBody = S.Array(
  ProductRestEndpointPageSummaryNoBody,
);
export class RoutingRule extends S.Class<RoutingRule>("RoutingRule")({
  Actions: S.optional(__listOfRoutingRuleAction).pipe(T.JsonName("actions")),
  Conditions: S.optional(__listOfRoutingRuleCondition).pipe(
    T.JsonName("conditions"),
  ),
  Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
  RoutingRuleArn: S.optional(S.String).pipe(T.JsonName("routingRuleArn")),
  RoutingRuleId: S.optional(S.String).pipe(T.JsonName("routingRuleId")),
}) {}
export const __listOfRoutingRule = S.Array(RoutingRule);
export class CreateApiResponse extends S.Class<CreateApiResponse>(
  "CreateApiResponse",
)({
  ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
  ApiKeySelectionExpression: S.optional(S.String).pipe(
    T.JsonName("apiKeySelectionExpression"),
  ),
  CorsConfiguration: S.optional(Cors).pipe(T.JsonName("corsConfiguration")),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DisableSchemaValidation: S.optional(S.Boolean).pipe(
    T.JsonName("disableSchemaValidation"),
  ),
  DisableExecuteApiEndpoint: S.optional(S.Boolean).pipe(
    T.JsonName("disableExecuteApiEndpoint"),
  ),
  ImportInfo: S.optional(__listOf__string).pipe(T.JsonName("importInfo")),
  IpAddressType: S.optional(S.String).pipe(T.JsonName("ipAddressType")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  ProtocolType: S.optional(S.String).pipe(T.JsonName("protocolType")),
  RouteSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("routeSelectionExpression"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Version: S.optional(S.String).pipe(T.JsonName("version")),
  Warnings: S.optional(__listOf__string).pipe(T.JsonName("warnings")),
}) {}
export class CreateAuthorizerResponse extends S.Class<CreateAuthorizerResponse>(
  "CreateAuthorizerResponse",
)({
  AuthorizerCredentialsArn: S.optional(S.String).pipe(
    T.JsonName("authorizerCredentialsArn"),
  ),
  AuthorizerId: S.optional(S.String).pipe(T.JsonName("authorizerId")),
  AuthorizerPayloadFormatVersion: S.optional(S.String).pipe(
    T.JsonName("authorizerPayloadFormatVersion"),
  ),
  AuthorizerResultTtlInSeconds: S.optional(S.Number).pipe(
    T.JsonName("authorizerResultTtlInSeconds"),
  ),
  AuthorizerType: S.optional(S.String).pipe(T.JsonName("authorizerType")),
  AuthorizerUri: S.optional(S.String).pipe(T.JsonName("authorizerUri")),
  EnableSimpleResponses: S.optional(S.Boolean).pipe(
    T.JsonName("enableSimpleResponses"),
  ),
  IdentitySource: S.optional(IdentitySourceList).pipe(
    T.JsonName("identitySource"),
  ),
  IdentityValidationExpression: S.optional(S.String).pipe(
    T.JsonName("identityValidationExpression"),
  ),
  JwtConfiguration: S.optional(JWTConfiguration).pipe(
    T.JsonName("jwtConfiguration"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export class CreateDomainNameResponse extends S.Class<CreateDomainNameResponse>(
  "CreateDomainNameResponse",
)({
  ApiMappingSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("apiMappingSelectionExpression"),
  ),
  DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
  DomainNameArn: S.optional(S.String).pipe(T.JsonName("domainNameArn")),
  DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
    T.JsonName("domainNameConfigurations"),
  ),
  MutualTlsAuthentication: S.optional(MutualTlsAuthentication).pipe(
    T.JsonName("mutualTlsAuthentication"),
  ),
  RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class CreateIntegrationResult extends S.Class<CreateIntegrationResult>(
  "CreateIntegrationResult",
)({
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ConnectionId: S.optional(S.String).pipe(T.JsonName("connectionId")),
  ConnectionType: S.optional(S.String).pipe(T.JsonName("connectionType")),
  ContentHandlingStrategy: S.optional(S.String).pipe(
    T.JsonName("contentHandlingStrategy"),
  ),
  CredentialsArn: S.optional(S.String).pipe(T.JsonName("credentialsArn")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  IntegrationId: S.optional(S.String).pipe(T.JsonName("integrationId")),
  IntegrationMethod: S.optional(S.String).pipe(T.JsonName("integrationMethod")),
  IntegrationResponseSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("integrationResponseSelectionExpression"),
  ),
  IntegrationSubtype: S.optional(S.String).pipe(
    T.JsonName("integrationSubtype"),
  ),
  IntegrationType: S.optional(S.String).pipe(T.JsonName("integrationType")),
  IntegrationUri: S.optional(S.String).pipe(T.JsonName("integrationUri")),
  PassthroughBehavior: S.optional(S.String).pipe(
    T.JsonName("passthroughBehavior"),
  ),
  PayloadFormatVersion: S.optional(S.String).pipe(
    T.JsonName("payloadFormatVersion"),
  ),
  RequestParameters: S.optional(IntegrationParameters).pipe(
    T.JsonName("requestParameters"),
  ),
  RequestTemplates: S.optional(TemplateMap).pipe(
    T.JsonName("requestTemplates"),
  ),
  ResponseParameters: S.optional(ResponseParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  TemplateSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("templateSelectionExpression"),
  ),
  TimeoutInMillis: S.optional(S.Number).pipe(T.JsonName("timeoutInMillis")),
  TlsConfig: S.optional(TlsConfig).pipe(T.JsonName("tlsConfig")),
}) {}
export class CreateProductPageResponse extends S.Class<CreateProductPageResponse>(
  "CreateProductPageResponse",
)({
  DisplayContent: S.optional(DisplayContent).pipe(T.JsonName("displayContent")),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  ProductPageArn: S.optional(S.String).pipe(T.JsonName("productPageArn")),
  ProductPageId: S.optional(S.String).pipe(T.JsonName("productPageId")),
}) {}
export class CreateProductRestEndpointPageRequest extends S.Class<CreateProductRestEndpointPageRequest>(
  "CreateProductRestEndpointPageRequest",
)(
  {
    DisplayContent: S.optional(EndpointDisplayContent).pipe(
      T.JsonName("displayContent"),
    ),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    RestEndpointIdentifier: RestEndpointIdentifier.pipe(
      T.JsonName("restEndpointIdentifier"),
    ),
    TryItState: S.optional(S.String).pipe(T.JsonName("tryItState")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/portalproducts/{PortalProductId}/productrestendpointpages",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRouteRequest extends S.Class<CreateRouteRequest>(
  "CreateRouteRequest",
)(
  {
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ApiKeyRequired: S.optional(S.Boolean).pipe(T.JsonName("apiKeyRequired")),
    AuthorizationScopes: S.optional(AuthorizationScopes).pipe(
      T.JsonName("authorizationScopes"),
    ),
    AuthorizationType: S.optional(S.String).pipe(
      T.JsonName("authorizationType"),
    ),
    AuthorizerId: S.optional(S.String).pipe(T.JsonName("authorizerId")),
    ModelSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("modelSelectionExpression"),
    ),
    OperationName: S.optional(S.String).pipe(T.JsonName("operationName")),
    RequestModels: S.optional(RouteModels).pipe(T.JsonName("requestModels")),
    RequestParameters: S.optional(RouteParameters).pipe(
      T.JsonName("requestParameters"),
    ),
    RouteKey: S.String.pipe(T.JsonName("routeKey")),
    RouteResponseSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("routeResponseSelectionExpression"),
    ),
    Target: S.optional(S.String).pipe(T.JsonName("target")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/routes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateStageResponse extends S.Class<CreateStageResponse>(
  "CreateStageResponse",
)({
  AccessLogSettings: S.optional(AccessLogSettings).pipe(
    T.JsonName("accessLogSettings"),
  ),
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  AutoDeploy: S.optional(S.Boolean).pipe(T.JsonName("autoDeploy")),
  ClientCertificateId: S.optional(S.String).pipe(
    T.JsonName("clientCertificateId"),
  ),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdDate"),
  ),
  DefaultRouteSettings: S.optional(RouteSettings).pipe(
    T.JsonName("defaultRouteSettings"),
  ),
  DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  LastDeploymentStatusMessage: S.optional(S.String).pipe(
    T.JsonName("lastDeploymentStatusMessage"),
  ),
  LastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastUpdatedDate"),
  ),
  RouteSettings: S.optional(RouteSettingsMap).pipe(T.JsonName("routeSettings")),
  StageName: S.optional(S.String).pipe(T.JsonName("stageName")),
  StageVariables: S.optional(StageVariablesMap).pipe(
    T.JsonName("stageVariables"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class GetApiMappingsResponse extends S.Class<GetApiMappingsResponse>(
  "GetApiMappingsResponse",
)({
  Items: S.optional(__listOfApiMapping).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetApisResponse extends S.Class<GetApisResponse>(
  "GetApisResponse",
)({
  Items: S.optional(__listOfApi).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetAuthorizersResponse extends S.Class<GetAuthorizersResponse>(
  "GetAuthorizersResponse",
)({
  Items: S.optional(__listOfAuthorizer).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetDeploymentsResponse extends S.Class<GetDeploymentsResponse>(
  "GetDeploymentsResponse",
)({
  Items: S.optional(__listOfDeployment).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetDomainNameResponse extends S.Class<GetDomainNameResponse>(
  "GetDomainNameResponse",
)({
  ApiMappingSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("apiMappingSelectionExpression"),
  ),
  DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
  DomainNameArn: S.optional(S.String).pipe(T.JsonName("domainNameArn")),
  DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
    T.JsonName("domainNameConfigurations"),
  ),
  MutualTlsAuthentication: S.optional(MutualTlsAuthentication).pipe(
    T.JsonName("mutualTlsAuthentication"),
  ),
  RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class GetDomainNamesResponse extends S.Class<GetDomainNamesResponse>(
  "GetDomainNamesResponse",
)({
  Items: S.optional(__listOfDomainName).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetIntegrationResult extends S.Class<GetIntegrationResult>(
  "GetIntegrationResult",
)({
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ConnectionId: S.optional(S.String).pipe(T.JsonName("connectionId")),
  ConnectionType: S.optional(S.String).pipe(T.JsonName("connectionType")),
  ContentHandlingStrategy: S.optional(S.String).pipe(
    T.JsonName("contentHandlingStrategy"),
  ),
  CredentialsArn: S.optional(S.String).pipe(T.JsonName("credentialsArn")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  IntegrationId: S.optional(S.String).pipe(T.JsonName("integrationId")),
  IntegrationMethod: S.optional(S.String).pipe(T.JsonName("integrationMethod")),
  IntegrationResponseSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("integrationResponseSelectionExpression"),
  ),
  IntegrationSubtype: S.optional(S.String).pipe(
    T.JsonName("integrationSubtype"),
  ),
  IntegrationType: S.optional(S.String).pipe(T.JsonName("integrationType")),
  IntegrationUri: S.optional(S.String).pipe(T.JsonName("integrationUri")),
  PassthroughBehavior: S.optional(S.String).pipe(
    T.JsonName("passthroughBehavior"),
  ),
  PayloadFormatVersion: S.optional(S.String).pipe(
    T.JsonName("payloadFormatVersion"),
  ),
  RequestParameters: S.optional(IntegrationParameters).pipe(
    T.JsonName("requestParameters"),
  ),
  RequestTemplates: S.optional(TemplateMap).pipe(
    T.JsonName("requestTemplates"),
  ),
  ResponseParameters: S.optional(ResponseParameters).pipe(
    T.JsonName("responseParameters"),
  ),
  TemplateSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("templateSelectionExpression"),
  ),
  TimeoutInMillis: S.optional(S.Number).pipe(T.JsonName("timeoutInMillis")),
  TlsConfig: S.optional(TlsConfig).pipe(T.JsonName("tlsConfig")),
}) {}
export class GetIntegrationResponsesResponse extends S.Class<GetIntegrationResponsesResponse>(
  "GetIntegrationResponsesResponse",
)({
  Items: S.optional(__listOfIntegrationResponse).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetIntegrationsResponse extends S.Class<GetIntegrationsResponse>(
  "GetIntegrationsResponse",
)({
  Items: S.optional(__listOfIntegration).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetModelsResponse extends S.Class<GetModelsResponse>(
  "GetModelsResponse",
)({
  Items: S.optional(__listOfModel).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetPortalResponse extends S.Class<GetPortalResponse>(
  "GetPortalResponse",
)({
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  EndpointConfiguration: S.optional(EndpointConfigurationResponse).pipe(
    T.JsonName("endpointConfiguration"),
  ),
  IncludedPortalProductArns: S.optional(__listOf__stringMin20Max2048).pipe(
    T.JsonName("includedPortalProductArns"),
  ),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  LastPublished: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastPublished"),
  ),
  LastPublishedDescription: S.optional(S.String).pipe(
    T.JsonName("lastPublishedDescription"),
  ),
  PortalArn: S.optional(S.String).pipe(T.JsonName("portalArn")),
  PortalContent: S.optional(PortalContent).pipe(T.JsonName("portalContent")),
  PortalId: S.optional(S.String).pipe(T.JsonName("portalId")),
  Preview: S.optional(Preview).pipe(T.JsonName("preview")),
  PublishStatus: S.optional(S.String).pipe(T.JsonName("publishStatus")),
  RumAppMonitorName: S.optional(S.String).pipe(T.JsonName("rumAppMonitorName")),
  StatusException: S.optional(StatusException).pipe(
    T.JsonName("statusException"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class GetProductRestEndpointPageResponse extends S.Class<GetProductRestEndpointPageResponse>(
  "GetProductRestEndpointPageResponse",
)({
  DisplayContent: S.optional(EndpointDisplayContentResponse).pipe(
    T.JsonName("displayContent"),
  ),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  ProductRestEndpointPageArn: S.optional(S.String).pipe(
    T.JsonName("productRestEndpointPageArn"),
  ),
  ProductRestEndpointPageId: S.optional(S.String).pipe(
    T.JsonName("productRestEndpointPageId"),
  ),
  RawDisplayContent: S.optional(S.String).pipe(T.JsonName("rawDisplayContent")),
  RestEndpointIdentifier: S.optional(RestEndpointIdentifier).pipe(
    T.JsonName("restEndpointIdentifier"),
  ),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  StatusException: S.optional(StatusException).pipe(
    T.JsonName("statusException"),
  ),
  TryItState: S.optional(S.String).pipe(T.JsonName("tryItState")),
}) {}
export class GetRouteResponsesResponse extends S.Class<GetRouteResponsesResponse>(
  "GetRouteResponsesResponse",
)({
  Items: S.optional(__listOfRouteResponse).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetRoutesResponse extends S.Class<GetRoutesResponse>(
  "GetRoutesResponse",
)({
  Items: S.optional(__listOfRoute).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetStagesResponse extends S.Class<GetStagesResponse>(
  "GetStagesResponse",
)({
  Items: S.optional(__listOfStage).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetVpcLinksResponse extends S.Class<GetVpcLinksResponse>(
  "GetVpcLinksResponse",
)({
  Items: S.optional(__listOfVpcLink).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListPortalProductsResponse extends S.Class<ListPortalProductsResponse>(
  "ListPortalProductsResponse",
)({
  Items: S.optional(__listOfPortalProductSummary).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListPortalsResponse extends S.Class<ListPortalsResponse>(
  "ListPortalsResponse",
)({
  Items: S.optional(__listOfPortalSummary).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListProductPagesResponse extends S.Class<ListProductPagesResponse>(
  "ListProductPagesResponse",
)({
  Items: S.optional(__listOfProductPageSummaryNoBody).pipe(T.JsonName("items")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListProductRestEndpointPagesResponse extends S.Class<ListProductRestEndpointPagesResponse>(
  "ListProductRestEndpointPagesResponse",
)({
  Items: S.optional(__listOfProductRestEndpointPageSummaryNoBody).pipe(
    T.JsonName("items"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListRoutingRulesResponse extends S.Class<ListRoutingRulesResponse>(
  "ListRoutingRulesResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  RoutingRules: S.optional(__listOfRoutingRule).pipe(
    T.JsonName("routingRules"),
  ),
}) {}
export class UpdatePortalProductRequest extends S.Class<UpdatePortalProductRequest>(
  "UpdatePortalProductRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DisplayName: S.optional(S.String).pipe(T.JsonName("displayName")),
    DisplayOrder: S.optional(DisplayOrder).pipe(T.JsonName("displayOrder")),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v2/portalproducts/{PortalProductId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePortalRequest extends S.Class<CreatePortalRequest>(
  "CreatePortalRequest",
)(
  {
    Authorization: Authorization.pipe(T.JsonName("authorization")),
    EndpointConfiguration: EndpointConfigurationRequest.pipe(
      T.JsonName("endpointConfiguration"),
    ),
    IncludedPortalProductArns: S.optional(__listOf__stringMin20Max2048).pipe(
      T.JsonName("includedPortalProductArns"),
    ),
    LogoUri: S.optional(S.String).pipe(T.JsonName("logoUri")),
    PortalContent: PortalContent.pipe(T.JsonName("portalContent")),
    RumAppMonitorName: S.optional(S.String).pipe(
      T.JsonName("rumAppMonitorName"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/portals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProductRestEndpointPageResponse extends S.Class<CreateProductRestEndpointPageResponse>(
  "CreateProductRestEndpointPageResponse",
)({
  DisplayContent: S.optional(EndpointDisplayContentResponse).pipe(
    T.JsonName("displayContent"),
  ),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  ProductRestEndpointPageArn: S.optional(S.String).pipe(
    T.JsonName("productRestEndpointPageArn"),
  ),
  ProductRestEndpointPageId: S.optional(S.String).pipe(
    T.JsonName("productRestEndpointPageId"),
  ),
  RestEndpointIdentifier: S.optional(RestEndpointIdentifier).pipe(
    T.JsonName("restEndpointIdentifier"),
  ),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  StatusException: S.optional(StatusException).pipe(
    T.JsonName("statusException"),
  ),
  TryItState: S.optional(S.String).pipe(T.JsonName("tryItState")),
}) {}
export class CreateRouteResult extends S.Class<CreateRouteResult>(
  "CreateRouteResult",
)({
  ApiGatewayManaged: S.optional(S.Boolean).pipe(
    T.JsonName("apiGatewayManaged"),
  ),
  ApiKeyRequired: S.optional(S.Boolean).pipe(T.JsonName("apiKeyRequired")),
  AuthorizationScopes: S.optional(AuthorizationScopes).pipe(
    T.JsonName("authorizationScopes"),
  ),
  AuthorizationType: S.optional(S.String).pipe(T.JsonName("authorizationType")),
  AuthorizerId: S.optional(S.String).pipe(T.JsonName("authorizerId")),
  ModelSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("modelSelectionExpression"),
  ),
  OperationName: S.optional(S.String).pipe(T.JsonName("operationName")),
  RequestModels: S.optional(RouteModels).pipe(T.JsonName("requestModels")),
  RequestParameters: S.optional(RouteParameters).pipe(
    T.JsonName("requestParameters"),
  ),
  RouteId: S.optional(S.String).pipe(T.JsonName("routeId")),
  RouteKey: S.optional(S.String).pipe(T.JsonName("routeKey")),
  RouteResponseSelectionExpression: S.optional(S.String).pipe(
    T.JsonName("routeResponseSelectionExpression"),
  ),
  Target: S.optional(S.String).pipe(T.JsonName("target")),
}) {}
export class CreateRoutingRuleRequest extends S.Class<CreateRoutingRuleRequest>(
  "CreateRoutingRuleRequest",
)(
  {
    Actions: __listOfRoutingRuleAction.pipe(T.JsonName("actions")),
    Conditions: __listOfRoutingRuleCondition.pipe(T.JsonName("conditions")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    Priority: S.Number.pipe(T.JsonName("priority")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v2/domainnames/{DomainName}/routingrules",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePortalProductResponse extends S.Class<UpdatePortalProductResponse>(
  "UpdatePortalProductResponse",
)({
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DisplayName: S.optional(S.String).pipe(T.JsonName("displayName")),
  DisplayOrder: S.optional(DisplayOrder).pipe(T.JsonName("displayOrder")),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  PortalProductArn: S.optional(S.String).pipe(T.JsonName("portalProductArn")),
  PortalProductId: S.optional(S.String).pipe(T.JsonName("portalProductId")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class CreatePortalResponse extends S.Class<CreatePortalResponse>(
  "CreatePortalResponse",
)({
  Authorization: S.optional(Authorization).pipe(T.JsonName("authorization")),
  EndpointConfiguration: S.optional(EndpointConfigurationResponse).pipe(
    T.JsonName("endpointConfiguration"),
  ),
  IncludedPortalProductArns: S.optional(__listOf__stringMin20Max2048).pipe(
    T.JsonName("includedPortalProductArns"),
  ),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  LastPublished: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastPublished"),
  ),
  LastPublishedDescription: S.optional(S.String).pipe(
    T.JsonName("lastPublishedDescription"),
  ),
  PortalArn: S.optional(S.String).pipe(T.JsonName("portalArn")),
  PortalContent: S.optional(PortalContent).pipe(T.JsonName("portalContent")),
  PortalId: S.optional(S.String).pipe(T.JsonName("portalId")),
  PublishStatus: S.optional(S.String).pipe(T.JsonName("publishStatus")),
  RumAppMonitorName: S.optional(S.String).pipe(T.JsonName("rumAppMonitorName")),
  StatusException: S.optional(StatusException).pipe(
    T.JsonName("statusException"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class CreateRoutingRuleResponse extends S.Class<CreateRoutingRuleResponse>(
  "CreateRoutingRuleResponse",
)({
  Actions: S.optional(__listOfRoutingRuleAction).pipe(T.JsonName("actions")),
  Conditions: S.optional(__listOfRoutingRuleCondition).pipe(
    T.JsonName("conditions"),
  ),
  Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
  RoutingRuleArn: S.optional(S.String).pipe(T.JsonName("routingRuleArn")),
  RoutingRuleId: S.optional(S.String).pipe(T.JsonName("routingRuleId")),
}) {}

//# Errors
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    ResourceType: S.optional(S.String).pipe(T.JsonName("resourceType")),
  },
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {
    LimitType: S.optional(S.String).pipe(T.JsonName("limitType")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}

//# Operations
/**
 * Deletes the AccessLogSettings for a Stage. To disable access logging for a Stage, delete its AccessLogSettings.
 */
export const deleteAccessLogSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAccessLogSettingsRequest,
    output: DeleteAccessLogSettingsResponse,
    errors: [NotFoundException, TooManyRequestsException],
  }),
);
/**
 * Gets API mappings.
 */
export const getApiMappings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApiMappingsRequest,
  output: GetApiMappingsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a collection of Api resources.
 */
export const getApis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApisRequest,
  output: GetApisResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the Authorizers for an API.
 */
export const getAuthorizers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAuthorizersRequest,
  output: GetAuthorizersResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the Deployments for an API.
 */
export const getDeployments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentsRequest,
  output: GetDeploymentsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a domain name.
 */
export const getDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainNameRequest,
  output: GetDomainNameResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the domain names for an AWS account.
 */
export const getDomainNames = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainNamesRequest,
  output: GetDomainNamesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets an Integration.
 */
export const getIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntegrationRequest,
  output: GetIntegrationResult,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the IntegrationResponses for an Integration.
 */
export const getIntegrationResponses = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIntegrationResponsesRequest,
    output: GetIntegrationResponsesResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  }),
);
/**
 * Gets the Integrations for an API.
 */
export const getIntegrations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntegrationsRequest,
  output: GetIntegrationsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the Models for an API.
 */
export const getModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelsRequest,
  output: GetModelsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a portal.
 */
export const getPortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPortalRequest,
  output: GetPortalResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets a product REST endpoint page.
 */
export const getProductRestEndpointPage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetProductRestEndpointPageRequest,
    output: GetProductRestEndpointPageResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets the RouteResponses for a Route.
 */
export const getRouteResponses = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouteResponsesRequest,
  output: GetRouteResponsesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the Routes for an API.
 */
export const getRoutes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRoutesRequest,
  output: GetRoutesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the Stages for an API.
 */
export const getStages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStagesRequest,
  output: GetStagesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a collection of Tag resources.
 */
export const getTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTagsRequest,
  output: GetTagsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets a collection of VPC links.
 */
export const getVpcLinks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVpcLinksRequest,
  output: GetVpcLinksResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Lists portal products.
 */
export const listPortalProducts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPortalProductsRequest,
  output: ListPortalProductsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists portals.
 */
export const listPortals = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPortalsRequest,
  output: ListPortalsResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the product pages for a portal product.
 */
export const listProductPages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProductPagesRequest,
  output: ListProductPagesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the product REST endpoint pages of a portal product.
 */
export const listProductRestEndpointPages =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListProductRestEndpointPagesRequest,
    output: ListProductRestEndpointPagesResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Lists routing rules.
 */
export const listRoutingRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRoutingRulesRequest,
    output: ListRoutingRulesResponse,
    errors: [BadRequestException, NotFoundException, TooManyRequestsException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RoutingRules",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Deletes an API mapping.
 */
export const deleteApiMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApiMappingRequest,
  output: DeleteApiMappingResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a portal.
 */
export const deletePortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePortalRequest,
  output: DeletePortalResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    TooManyRequestsException,
  ],
}));
/**
 *
 */
export const exportApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportApiRequest,
  output: ExportApiResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets an Api resource.
 */
export const getApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApiRequest,
  output: GetApiResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets an API mapping.
 */
export const getApiMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApiMappingRequest,
  output: GetApiMappingResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets an Authorizer.
 */
export const getAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAuthorizerRequest,
  output: GetAuthorizerResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a Deployment.
 */
export const getDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentRequest,
  output: GetDeploymentResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets an IntegrationResponses.
 */
export const getIntegrationResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIntegrationResponseRequest,
    output: GetIntegrationResponseResponse,
    errors: [NotFoundException, TooManyRequestsException],
  }),
);
/**
 * Gets a Model.
 */
export const getModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelRequest,
  output: GetModelResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a model template.
 */
export const getModelTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelTemplateRequest,
  output: GetModelTemplateResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a portal product.
 */
export const getPortalProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPortalProductRequest,
  output: GetPortalProductResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the sharing policy for a portal product.
 */
export const getPortalProductSharingPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetPortalProductSharingPolicyRequest,
    output: GetPortalProductSharingPolicyResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Gets a product page of a portal product.
 */
export const getProductPage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProductPageRequest,
  output: GetProductPageResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets a Route.
 */
export const getRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouteRequest,
  output: GetRouteResult,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a RouteResponse.
 */
export const getRouteResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouteResponseRequest,
  output: GetRouteResponseResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a routing rule.
 */
export const getRoutingRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRoutingRuleRequest,
  output: GetRoutingRuleResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a Stage.
 */
export const getStage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStageRequest,
  output: GetStageResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a VPC link.
 */
export const getVpcLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVpcLinkRequest,
  output: GetVpcLinkResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Updates a product page of a portal product.
 */
export const updateProductPage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProductPageRequest,
  output: UpdateProductPageResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a product REST endpoint page.
 */
export const updateProductRestEndpointPage =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateProductRestEndpointPageRequest,
    output: UpdateProductRestEndpointPageResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Updates a VPC link.
 */
export const updateVpcLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVpcLinkRequest,
  output: UpdateVpcLinkResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes an Api resource.
 */
export const deleteApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApiRequest,
  output: DeleteApiResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes an Authorizer.
 */
export const deleteAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAuthorizerRequest,
  output: DeleteAuthorizerResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a CORS configuration.
 */
export const deleteCorsConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCorsConfigurationRequest,
    output: DeleteCorsConfigurationResponse,
    errors: [NotFoundException, TooManyRequestsException],
  }),
);
/**
 * Deletes a Deployment.
 */
export const deleteDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeploymentRequest,
  output: DeleteDeploymentResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a domain name.
 */
export const deleteDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainNameRequest,
  output: DeleteDomainNameResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes an Integration.
 */
export const deleteIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationRequest,
  output: DeleteIntegrationResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes an IntegrationResponses.
 */
export const deleteIntegrationResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIntegrationResponseRequest,
    output: DeleteIntegrationResponseResponse,
    errors: [NotFoundException, TooManyRequestsException],
  }),
);
/**
 * Deletes a Model.
 */
export const deleteModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelRequest,
  output: DeleteModelResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a Route.
 */
export const deleteRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouteRequest,
  output: DeleteRouteResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a route request parameter. Supported only for WebSocket APIs.
 */
export const deleteRouteRequestParameter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRouteRequestParameterRequest,
    output: DeleteRouteRequestParameterResponse,
    errors: [NotFoundException, TooManyRequestsException],
  }),
);
/**
 * Deletes a RouteResponse.
 */
export const deleteRouteResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouteResponseRequest,
  output: DeleteRouteResponseResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes the RouteSettings for a stage.
 */
export const deleteRouteSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouteSettingsRequest,
  output: DeleteRouteSettingsResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a Stage.
 */
export const deleteStage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStageRequest,
  output: DeleteStageResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a VPC link.
 */
export const deleteVpcLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVpcLinkRequest,
  output: DeleteVpcLinkResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Resets all authorizer cache entries on a stage. Supported only for HTTP APIs.
 */
export const resetAuthorizersCache = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResetAuthorizersCacheRequest,
    output: ResetAuthorizersCacheResponse,
    errors: [NotFoundException, TooManyRequestsException],
  }),
);
/**
 * Deletes a routing rule.
 */
export const deleteRoutingRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRoutingRuleRequest,
  output: DeleteRoutingRuleResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Creates a VPC link.
 */
export const createVpcLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcLinkRequest,
  output: CreateVpcLinkResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Deletes a portal product.
 */
export const deletePortalProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePortalProductRequest,
  output: DeletePortalProductResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the sharing policy for a portal product.
 */
export const deletePortalProductSharingPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeletePortalProductSharingPolicyRequest,
    output: DeletePortalProductSharingPolicyResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Deletes a product page of a portal product.
 */
export const deleteProductPage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProductPageRequest,
  output: DeleteProductPageResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a product REST endpoint page.
 */
export const deleteProductRestEndpointPage =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteProductRestEndpointPageRequest,
    output: DeleteProductRestEndpointPageResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Updates the sharing policy for a portal product.
 */
export const putPortalProductSharingPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutPortalProductSharingPolicyRequest,
    output: PutPortalProductSharingPolicyResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Creates a new portal product.
 */
export const createPortalProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePortalProductRequest,
  output: CreatePortalProductResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new product page for a portal product.
 */
export const createProductPage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProductPageRequest,
  output: CreateProductPageResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Imports an API.
 */
export const importApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportApiRequest,
  output: ImportApiResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a routing rule.
 */
export const putRoutingRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRoutingRuleRequest,
  output: PutRoutingRuleResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Puts an Api resource.
 */
export const reimportApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReimportApiRequest,
  output: ReimportApiResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an Api resource.
 */
export const updateApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApiRequest,
  output: UpdateApiResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * The API mapping.
 */
export const updateApiMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApiMappingRequest,
  output: UpdateApiMappingResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an Authorizer.
 */
export const updateAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAuthorizerRequest,
  output: UpdateAuthorizerResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a Deployment.
 */
export const updateDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDeploymentRequest,
  output: UpdateDeploymentResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a domain name.
 */
export const updateDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainNameRequest,
  output: UpdateDomainNameResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an Integration.
 */
export const updateIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIntegrationRequest,
  output: UpdateIntegrationResult,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an IntegrationResponses.
 */
export const updateIntegrationResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateIntegrationResponseRequest,
    output: UpdateIntegrationResponseResponse,
    errors: [
      BadRequestException,
      ConflictException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Updates a Model.
 */
export const updateModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateModelRequest,
  output: UpdateModelResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a portal.
 */
export const updatePortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePortalRequest,
  output: UpdatePortalResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a Route.
 */
export const updateRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRouteRequest,
  output: UpdateRouteResult,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a RouteResponse.
 */
export const updateRouteResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRouteResponseRequest,
  output: UpdateRouteResponseResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a Stage.
 */
export const updateStage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStageRequest,
  output: UpdateStageResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new Tag resource to represent a tag.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a Tag.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an API mapping.
 */
export const createApiMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApiMappingRequest,
  output: CreateApiMappingResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a Deployment for an API.
 */
export const createDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeploymentRequest,
  output: CreateDeploymentResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an IntegrationResponses.
 */
export const createIntegrationResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateIntegrationResponseRequest,
    output: CreateIntegrationResponseResponse,
    errors: [
      BadRequestException,
      ConflictException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates a Model for an API.
 */
export const createModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelRequest,
  output: CreateModelResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a RouteResponse for a Route.
 */
export const createRouteResponse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRouteResponseRequest,
  output: CreateRouteResponseResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the publication of a portal portal.
 */
export const disablePortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisablePortalRequest,
  output: DisablePortalResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a portal preview.
 */
export const previewPortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PreviewPortalRequest,
  output: PreviewPortalResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Publishes a portal.
 */
export const publishPortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishPortalRequest,
  output: PublishPortalResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an Api resource.
 */
export const createApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApiRequest,
  output: CreateApiResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an Authorizer for an API.
 */
export const createAuthorizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAuthorizerRequest,
  output: CreateAuthorizerResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a domain name.
 */
export const createDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainNameRequest,
  output: CreateDomainNameResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an Integration.
 */
export const createIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIntegrationRequest,
  output: CreateIntegrationResult,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a Stage for an API.
 */
export const createStage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStageRequest,
  output: CreateStageResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a product REST endpoint page for a portal product.
 */
export const createProductRestEndpointPage =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateProductRestEndpointPageRequest,
    output: CreateProductRestEndpointPageResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Creates a Route for an API.
 */
export const createRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRouteRequest,
  output: CreateRouteResult,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the portal product.
 */
export const updatePortalProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePortalProductRequest,
  output: UpdatePortalProductResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a portal.
 */
export const createPortal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePortalRequest,
  output: CreatePortalResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a RoutingRule.
 */
export const createRoutingRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRoutingRuleRequest,
  output: CreateRoutingRuleResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
