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
  sdkId: "ApiGatewayV2",
  serviceShapeName: "ApiGatewayV2",
});
const auth = T.AwsAuthSigv4({ name: "apigateway" });
const ver = T.ServiceVersion("2018-11-29");
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
export type SelectionExpression = string;
export type Arn = string;
export type StringWithLengthBetween0And1024 = string;
export type StringWithLengthBetween1And128 = string;
export type SelectionKey = string;
export type UriWithLengthBetween1And2048 = string;
export type StringWithLengthBetween1And64 = string;
export type Id = string;
export type __string = string;
export type IntegerWithLengthBetween0And3600 = number;
export type StringWithLengthBetween1And512 = string;
export type StringWithLengthBetween1And1024 = string;
export type IntegerWithLengthBetween50And30000 = number;
export type StringWithLengthBetween1And256 = string;
export type StringWithLengthBetween0And32K = string;
export type __stringMin20Max2048 = string;
export type __stringMin0Max1092 = string;
export type __stringMin0Max255 = string;
export type __stringMin0Max1024 = string;
export type __stringMin1Max255 = string;
export type RoutingRulePriority = number;
export type MaxResults = number;
export type __stringMin1Max307200 = string;
export type IntegerWithLengthBetweenMinus1And86400 = number;
export type StringWithLengthBetween1And1600 = string;
export type __stringMin3Max255 = string;
export type __stringMin1Max32768 = string;
export type __integer = number;
export type __double = number;
export type StringWithLengthBetween0And2048 = string;
export type __stringMin10Max30PatternAZ09 = string;
export type NextToken = string;
export type __stringMin1Max2048 = string;
export type __stringMin1Max256 = string;
export type __stringMin10Max2048 = string;
export type __stringMin3Max256 = string;
export type __stringMin1Max1024 = string;
export type __stringMin1Max20 = string;
export type __stringMin1Max4096 = string;
export type __stringMin1Max50 = string;
export type __stringMin1Max128 = string;
export type __stringMin1Max64 = string;
export type __stringMin1Max16 = string;

//# Schemas
export type IdentitySourceList = string[];
export const IdentitySourceList = S.Array(S.String);
export type __listOf__stringMin20Max2048 = string[];
export const __listOf__stringMin20Max2048 = S.Array(S.String);
export type AuthorizationScopes = string[];
export const AuthorizationScopes = S.Array(S.String);
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export interface CreateApiMappingRequest {
  ApiId: string;
  ApiMappingKey?: string;
  DomainName: string;
  Stage: string;
}
export const CreateApiMappingRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.JsonName("apiId")),
    ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Stage: S.String.pipe(T.JsonName("stage")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/domainnames/{DomainName}/apimappings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApiMappingRequest",
}) as any as S.Schema<CreateApiMappingRequest>;
export interface CreateDeploymentRequest {
  ApiId: string;
  Description?: string;
  StageName?: string;
}
export const CreateDeploymentRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    StageName: S.optional(S.String).pipe(T.JsonName("stageName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/deployments" }),
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
export type IntegrationParameters = { [key: string]: string };
export const IntegrationParameters = S.Record({
  key: S.String,
  value: S.String,
});
export type TemplateMap = { [key: string]: string };
export const TemplateMap = S.Record({ key: S.String, value: S.String });
export interface CreateIntegrationResponseRequest {
  ApiId: string;
  ContentHandlingStrategy?: string;
  IntegrationId: string;
  IntegrationResponseKey: string;
  ResponseParameters?: IntegrationParameters;
  ResponseTemplates?: TemplateMap;
  TemplateSelectionExpression?: string;
}
export const CreateIntegrationResponseRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateIntegrationResponseRequest",
}) as any as S.Schema<CreateIntegrationResponseRequest>;
export interface CreateModelRequest {
  ApiId: string;
  ContentType?: string;
  Description?: string;
  Name: string;
  Schema: string;
}
export const CreateModelRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.JsonName("name")),
    Schema: S.String.pipe(T.JsonName("schema")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/models" }),
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
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreatePortalProductRequest {
  Description?: string;
  DisplayName: string;
  Tags?: Tags;
}
export const CreatePortalProductRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DisplayName: S.String.pipe(T.JsonName("displayName")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/portalproducts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePortalProductRequest",
}) as any as S.Schema<CreatePortalProductRequest>;
export type RouteModels = { [key: string]: string };
export const RouteModels = S.Record({ key: S.String, value: S.String });
export interface ParameterConstraints {
  Required?: boolean;
}
export const ParameterConstraints = S.suspend(() =>
  S.Struct({ Required: S.optional(S.Boolean).pipe(T.JsonName("required")) }),
).annotations({
  identifier: "ParameterConstraints",
}) as any as S.Schema<ParameterConstraints>;
export type RouteParameters = { [key: string]: ParameterConstraints };
export const RouteParameters = S.Record({
  key: S.String,
  value: ParameterConstraints,
});
export interface CreateRouteResponseRequest {
  ApiId: string;
  ModelSelectionExpression?: string;
  ResponseModels?: RouteModels;
  ResponseParameters?: RouteParameters;
  RouteId: string;
  RouteResponseKey: string;
}
export const CreateRouteResponseRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateRouteResponseRequest",
}) as any as S.Schema<CreateRouteResponseRequest>;
export interface CreateVpcLinkRequest {
  Name: string;
  SecurityGroupIds?: SecurityGroupIdList;
  SubnetIds: SubnetIdList;
  Tags?: Tags;
}
export const CreateVpcLinkRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    SecurityGroupIds: S.optional(SecurityGroupIdList).pipe(
      T.JsonName("securityGroupIds"),
    ),
    SubnetIds: SubnetIdList.pipe(T.JsonName("subnetIds")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/vpclinks" }),
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
export interface DeleteAccessLogSettingsRequest {
  ApiId: string;
  StageName: string;
}
export const DeleteAccessLogSettingsRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteAccessLogSettingsRequest",
}) as any as S.Schema<DeleteAccessLogSettingsRequest>;
export interface DeleteAccessLogSettingsResponse {}
export const DeleteAccessLogSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccessLogSettingsResponse",
}) as any as S.Schema<DeleteAccessLogSettingsResponse>;
export interface DeleteApiRequest {
  ApiId: string;
}
export const DeleteApiRequest = S.suspend(() =>
  S.Struct({ ApiId: S.String.pipe(T.HttpLabel("ApiId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/apis/{ApiId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApiRequest",
}) as any as S.Schema<DeleteApiRequest>;
export interface DeleteApiResponse {}
export const DeleteApiResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteApiResponse",
}) as any as S.Schema<DeleteApiResponse>;
export interface DeleteApiMappingRequest {
  ApiMappingId: string;
  DomainName: string;
}
export const DeleteApiMappingRequest = S.suspend(() =>
  S.Struct({
    ApiMappingId: S.String.pipe(T.HttpLabel("ApiMappingId")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteApiMappingRequest",
}) as any as S.Schema<DeleteApiMappingRequest>;
export interface DeleteApiMappingResponse {}
export const DeleteApiMappingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteApiMappingResponse",
}) as any as S.Schema<DeleteApiMappingResponse>;
export interface DeleteAuthorizerRequest {
  ApiId: string;
  AuthorizerId: string;
}
export const DeleteAuthorizerRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    AuthorizerId: S.String.pipe(T.HttpLabel("AuthorizerId")),
  }).pipe(
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
export interface DeleteCorsConfigurationRequest {
  ApiId: string;
}
export const DeleteCorsConfigurationRequest = S.suspend(() =>
  S.Struct({ ApiId: S.String.pipe(T.HttpLabel("ApiId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/apis/{ApiId}/cors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCorsConfigurationRequest",
}) as any as S.Schema<DeleteCorsConfigurationRequest>;
export interface DeleteCorsConfigurationResponse {}
export const DeleteCorsConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCorsConfigurationResponse",
}) as any as S.Schema<DeleteCorsConfigurationResponse>;
export interface DeleteDeploymentRequest {
  ApiId: string;
  DeploymentId: string;
}
export const DeleteDeploymentRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    DeploymentId: S.String.pipe(T.HttpLabel("DeploymentId")),
  }).pipe(
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
export interface DeleteDomainNameRequest {
  DomainName: string;
}
export const DeleteDomainNameRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/domainnames/{DomainName}" }),
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
export interface DeleteIntegrationRequest {
  ApiId: string;
  IntegrationId: string;
}
export const DeleteIntegrationRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
  }).pipe(
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
  ApiId: string;
  IntegrationId: string;
  IntegrationResponseId: string;
}
export const DeleteIntegrationResponseRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
    IntegrationResponseId: S.String.pipe(T.HttpLabel("IntegrationResponseId")),
  }).pipe(
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
export interface DeleteModelRequest {
  ApiId: string;
  ModelId: string;
}
export const DeleteModelRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ModelId: S.String.pipe(T.HttpLabel("ModelId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/apis/{ApiId}/models/{ModelId}" }),
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
export interface DeletePortalRequest {
  PortalId: string;
}
export const DeletePortalRequest = S.suspend(() =>
  S.Struct({ PortalId: S.String.pipe(T.HttpLabel("PortalId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/portals/{PortalId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePortalRequest",
}) as any as S.Schema<DeletePortalRequest>;
export interface DeletePortalResponse {}
export const DeletePortalResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePortalResponse",
}) as any as S.Schema<DeletePortalResponse>;
export interface DeletePortalProductRequest {
  PortalProductId: string;
}
export const DeletePortalProductRequest = S.suspend(() =>
  S.Struct({
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/portalproducts/{PortalProductId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePortalProductRequest",
}) as any as S.Schema<DeletePortalProductRequest>;
export interface DeletePortalProductResponse {}
export const DeletePortalProductResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePortalProductResponse",
}) as any as S.Schema<DeletePortalProductResponse>;
export interface DeletePortalProductSharingPolicyRequest {
  PortalProductId: string;
}
export const DeletePortalProductSharingPolicyRequest = S.suspend(() =>
  S.Struct({
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeletePortalProductSharingPolicyRequest",
}) as any as S.Schema<DeletePortalProductSharingPolicyRequest>;
export interface DeletePortalProductSharingPolicyResponse {}
export const DeletePortalProductSharingPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePortalProductSharingPolicyResponse",
}) as any as S.Schema<DeletePortalProductSharingPolicyResponse>;
export interface DeleteProductPageRequest {
  PortalProductId: string;
  ProductPageId: string;
}
export const DeleteProductPageRequest = S.suspend(() =>
  S.Struct({
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ProductPageId: S.String.pipe(T.HttpLabel("ProductPageId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteProductPageRequest",
}) as any as S.Schema<DeleteProductPageRequest>;
export interface DeleteProductPageResponse {}
export const DeleteProductPageResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProductPageResponse",
}) as any as S.Schema<DeleteProductPageResponse>;
export interface DeleteProductRestEndpointPageRequest {
  PortalProductId: string;
  ProductRestEndpointPageId: string;
}
export const DeleteProductRestEndpointPageRequest = S.suspend(() =>
  S.Struct({
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ProductRestEndpointPageId: S.String.pipe(
      T.HttpLabel("ProductRestEndpointPageId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteProductRestEndpointPageRequest",
}) as any as S.Schema<DeleteProductRestEndpointPageRequest>;
export interface DeleteProductRestEndpointPageResponse {}
export const DeleteProductRestEndpointPageResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProductRestEndpointPageResponse",
}) as any as S.Schema<DeleteProductRestEndpointPageResponse>;
export interface DeleteRouteRequest {
  ApiId: string;
  RouteId: string;
}
export const DeleteRouteRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/apis/{ApiId}/routes/{RouteId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRouteRequest",
}) as any as S.Schema<DeleteRouteRequest>;
export interface DeleteRouteResponse {}
export const DeleteRouteResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteRouteResponse",
}) as any as S.Schema<DeleteRouteResponse>;
export interface DeleteRouteRequestParameterRequest {
  ApiId: string;
  RequestParameterKey: string;
  RouteId: string;
}
export const DeleteRouteRequestParameterRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RequestParameterKey: S.String.pipe(T.HttpLabel("RequestParameterKey")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteRouteRequestParameterRequest",
}) as any as S.Schema<DeleteRouteRequestParameterRequest>;
export interface DeleteRouteRequestParameterResponse {}
export const DeleteRouteRequestParameterResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRouteRequestParameterResponse",
}) as any as S.Schema<DeleteRouteRequestParameterResponse>;
export interface DeleteRouteResponseRequest {
  ApiId: string;
  RouteId: string;
  RouteResponseId: string;
}
export const DeleteRouteResponseRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
    RouteResponseId: S.String.pipe(T.HttpLabel("RouteResponseId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteRouteResponseRequest",
}) as any as S.Schema<DeleteRouteResponseRequest>;
export interface DeleteRouteResponseResponse {}
export const DeleteRouteResponseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRouteResponseResponse",
}) as any as S.Schema<DeleteRouteResponseResponse>;
export interface DeleteRouteSettingsRequest {
  ApiId: string;
  RouteKey: string;
  StageName: string;
}
export const DeleteRouteSettingsRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RouteKey: S.String.pipe(T.HttpLabel("RouteKey")),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteRouteSettingsRequest",
}) as any as S.Schema<DeleteRouteSettingsRequest>;
export interface DeleteRouteSettingsResponse {}
export const DeleteRouteSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRouteSettingsResponse",
}) as any as S.Schema<DeleteRouteSettingsResponse>;
export interface DeleteRoutingRuleRequest {
  DomainName: string;
  DomainNameId?: string;
  RoutingRuleId: string;
}
export const DeleteRoutingRuleRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    RoutingRuleId: S.String.pipe(T.HttpLabel("RoutingRuleId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteRoutingRuleRequest",
}) as any as S.Schema<DeleteRoutingRuleRequest>;
export interface DeleteRoutingRuleResponse {}
export const DeleteRoutingRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRoutingRuleResponse",
}) as any as S.Schema<DeleteRoutingRuleResponse>;
export interface DeleteStageRequest {
  ApiId: string;
  StageName: string;
}
export const DeleteStageRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/apis/{ApiId}/stages/{StageName}" }),
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
export interface DeleteVpcLinkRequest {
  VpcLinkId: string;
}
export const DeleteVpcLinkRequest = S.suspend(() =>
  S.Struct({ VpcLinkId: S.String.pipe(T.HttpLabel("VpcLinkId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/vpclinks/{VpcLinkId}" }),
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
export interface DisablePortalRequest {
  PortalId: string;
}
export const DisablePortalRequest = S.suspend(() =>
  S.Struct({ PortalId: S.String.pipe(T.HttpLabel("PortalId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/portals/{PortalId}/publish" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisablePortalRequest",
}) as any as S.Schema<DisablePortalRequest>;
export interface DisablePortalResponse {}
export const DisablePortalResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DisablePortalResponse",
}) as any as S.Schema<DisablePortalResponse>;
export interface ExportApiRequest {
  ApiId: string;
  ExportVersion?: string;
  IncludeExtensions?: boolean;
  OutputType: string;
  Specification: string;
  StageName?: string;
}
export const ExportApiRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ExportVersion: S.optional(S.String).pipe(T.HttpQuery("exportVersion")),
    IncludeExtensions: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeExtensions"),
    ),
    OutputType: S.String.pipe(T.HttpQuery("outputType")),
    Specification: S.String.pipe(T.HttpLabel("Specification")),
    StageName: S.optional(S.String).pipe(T.HttpQuery("stageName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/apis/{ApiId}/exports/{Specification}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExportApiRequest",
}) as any as S.Schema<ExportApiRequest>;
export interface GetApiRequest {
  ApiId: string;
}
export const GetApiRequest = S.suspend(() =>
  S.Struct({ ApiId: S.String.pipe(T.HttpLabel("ApiId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/apis/{ApiId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApiRequest",
}) as any as S.Schema<GetApiRequest>;
export interface GetApiMappingRequest {
  ApiMappingId: string;
  DomainName: string;
}
export const GetApiMappingRequest = S.suspend(() =>
  S.Struct({
    ApiMappingId: S.String.pipe(T.HttpLabel("ApiMappingId")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetApiMappingRequest",
}) as any as S.Schema<GetApiMappingRequest>;
export interface GetApiMappingsRequest {
  DomainName: string;
  MaxResults?: string;
  NextToken?: string;
}
export const GetApiMappingsRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domainnames/{DomainName}/apimappings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApiMappingsRequest",
}) as any as S.Schema<GetApiMappingsRequest>;
export interface GetApisRequest {
  MaxResults?: string;
  NextToken?: string;
}
export const GetApisRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/apis" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApisRequest",
}) as any as S.Schema<GetApisRequest>;
export interface GetAuthorizerRequest {
  ApiId: string;
  AuthorizerId: string;
}
export const GetAuthorizerRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    AuthorizerId: S.String.pipe(T.HttpLabel("AuthorizerId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetAuthorizerRequest",
}) as any as S.Schema<GetAuthorizerRequest>;
export interface GetAuthorizersRequest {
  ApiId: string;
  MaxResults?: string;
  NextToken?: string;
}
export const GetAuthorizersRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/authorizers" }),
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
export interface GetDeploymentRequest {
  ApiId: string;
  DeploymentId: string;
}
export const GetDeploymentRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    DeploymentId: S.String.pipe(T.HttpLabel("DeploymentId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDeploymentRequest",
}) as any as S.Schema<GetDeploymentRequest>;
export interface GetDeploymentsRequest {
  ApiId: string;
  MaxResults?: string;
  NextToken?: string;
}
export const GetDeploymentsRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/deployments" }),
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
export interface GetDomainNameRequest {
  DomainName: string;
}
export const GetDomainNameRequest = S.suspend(() =>
  S.Struct({ DomainName: S.String.pipe(T.HttpLabel("DomainName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/domainnames/{DomainName}" }),
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
export interface GetDomainNamesRequest {
  MaxResults?: string;
  NextToken?: string;
}
export const GetDomainNamesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/domainnames" }),
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
export interface GetIntegrationRequest {
  ApiId: string;
  IntegrationId: string;
}
export const GetIntegrationRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetIntegrationRequest",
}) as any as S.Schema<GetIntegrationRequest>;
export interface GetIntegrationResponseRequest {
  ApiId: string;
  IntegrationId: string;
  IntegrationResponseId: string;
}
export const GetIntegrationResponseRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
    IntegrationResponseId: S.String.pipe(T.HttpLabel("IntegrationResponseId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetIntegrationResponseRequest",
}) as any as S.Schema<GetIntegrationResponseRequest>;
export interface GetIntegrationResponsesRequest {
  ApiId: string;
  IntegrationId: string;
  MaxResults?: string;
  NextToken?: string;
}
export const GetIntegrationResponsesRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    IntegrationId: S.String.pipe(T.HttpLabel("IntegrationId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetIntegrationResponsesRequest",
}) as any as S.Schema<GetIntegrationResponsesRequest>;
export interface GetIntegrationsRequest {
  ApiId: string;
  MaxResults?: string;
  NextToken?: string;
}
export const GetIntegrationsRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/integrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIntegrationsRequest",
}) as any as S.Schema<GetIntegrationsRequest>;
export interface GetModelRequest {
  ApiId: string;
  ModelId: string;
}
export const GetModelRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ModelId: S.String.pipe(T.HttpLabel("ModelId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/models/{ModelId}" }),
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
  ApiId: string;
  MaxResults?: string;
  NextToken?: string;
}
export const GetModelsRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/models" }),
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
  ApiId: string;
  ModelId: string;
}
export const GetModelTemplateRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ModelId: S.String.pipe(T.HttpLabel("ModelId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetModelTemplateRequest",
}) as any as S.Schema<GetModelTemplateRequest>;
export interface GetPortalRequest {
  PortalId: string;
}
export const GetPortalRequest = S.suspend(() =>
  S.Struct({ PortalId: S.String.pipe(T.HttpLabel("PortalId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/portals/{PortalId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPortalRequest",
}) as any as S.Schema<GetPortalRequest>;
export interface GetPortalProductRequest {
  PortalProductId: string;
  ResourceOwnerAccountId?: string;
}
export const GetPortalProductRequest = S.suspend(() =>
  S.Struct({
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ResourceOwnerAccountId: S.optional(S.String).pipe(
      T.HttpQuery("resourceOwnerAccountId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/portalproducts/{PortalProductId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPortalProductRequest",
}) as any as S.Schema<GetPortalProductRequest>;
export interface GetPortalProductSharingPolicyRequest {
  PortalProductId: string;
}
export const GetPortalProductSharingPolicyRequest = S.suspend(() =>
  S.Struct({
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetPortalProductSharingPolicyRequest",
}) as any as S.Schema<GetPortalProductSharingPolicyRequest>;
export interface GetProductPageRequest {
  PortalProductId: string;
  ProductPageId: string;
  ResourceOwnerAccountId?: string;
}
export const GetProductPageRequest = S.suspend(() =>
  S.Struct({
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ProductPageId: S.String.pipe(T.HttpLabel("ProductPageId")),
    ResourceOwnerAccountId: S.optional(S.String).pipe(
      T.HttpQuery("resourceOwnerAccountId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetProductPageRequest",
}) as any as S.Schema<GetProductPageRequest>;
export interface GetProductRestEndpointPageRequest {
  IncludeRawDisplayContent?: string;
  PortalProductId: string;
  ProductRestEndpointPageId: string;
  ResourceOwnerAccountId?: string;
}
export const GetProductRestEndpointPageRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "GetProductRestEndpointPageRequest",
}) as any as S.Schema<GetProductRestEndpointPageRequest>;
export interface GetRouteRequest {
  ApiId: string;
  RouteId: string;
}
export const GetRouteRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/routes/{RouteId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRouteRequest",
}) as any as S.Schema<GetRouteRequest>;
export interface GetRouteResponseRequest {
  ApiId: string;
  RouteId: string;
  RouteResponseId: string;
}
export const GetRouteResponseRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
    RouteResponseId: S.String.pipe(T.HttpLabel("RouteResponseId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetRouteResponseRequest",
}) as any as S.Schema<GetRouteResponseRequest>;
export interface GetRouteResponsesRequest {
  ApiId: string;
  MaxResults?: string;
  NextToken?: string;
  RouteId: string;
}
export const GetRouteResponsesRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RouteId: S.String.pipe(T.HttpLabel("RouteId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetRouteResponsesRequest",
}) as any as S.Schema<GetRouteResponsesRequest>;
export interface GetRoutesRequest {
  ApiId: string;
  MaxResults?: string;
  NextToken?: string;
}
export const GetRoutesRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/routes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRoutesRequest",
}) as any as S.Schema<GetRoutesRequest>;
export interface GetRoutingRuleRequest {
  DomainName: string;
  DomainNameId?: string;
  RoutingRuleId: string;
}
export const GetRoutingRuleRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    RoutingRuleId: S.String.pipe(T.HttpLabel("RoutingRuleId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetRoutingRuleRequest",
}) as any as S.Schema<GetRoutingRuleRequest>;
export interface GetStageRequest {
  ApiId: string;
  StageName: string;
}
export const GetStageRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/stages/{StageName}" }),
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
  ApiId: string;
  MaxResults?: string;
  NextToken?: string;
}
export const GetStagesRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/apis/{ApiId}/stages" }),
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
  ResourceArn: string;
}
export const GetTagsRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/tags/{ResourceArn}" }),
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
export interface GetVpcLinkRequest {
  VpcLinkId: string;
}
export const GetVpcLinkRequest = S.suspend(() =>
  S.Struct({ VpcLinkId: S.String.pipe(T.HttpLabel("VpcLinkId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/vpclinks/{VpcLinkId}" }),
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
  MaxResults?: string;
  NextToken?: string;
}
export const GetVpcLinksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/vpclinks" }),
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
export interface ImportApiRequest {
  Basepath?: string;
  Body: string;
  FailOnWarnings?: boolean;
}
export const ImportApiRequest = S.suspend(() =>
  S.Struct({
    Basepath: S.optional(S.String).pipe(T.HttpQuery("basepath")),
    Body: S.String.pipe(T.JsonName("body")),
    FailOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failOnWarnings")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/apis" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportApiRequest",
}) as any as S.Schema<ImportApiRequest>;
export interface ListPortalProductsRequest {
  MaxResults?: string;
  NextToken?: string;
  ResourceOwner?: string;
}
export const ListPortalProductsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ResourceOwner: S.optional(S.String).pipe(T.HttpQuery("resourceOwner")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/portalproducts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPortalProductsRequest",
}) as any as S.Schema<ListPortalProductsRequest>;
export interface ListPortalsRequest {
  MaxResults?: string;
  NextToken?: string;
}
export const ListPortalsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/portals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPortalsRequest",
}) as any as S.Schema<ListPortalsRequest>;
export interface ListProductPagesRequest {
  MaxResults?: string;
  NextToken?: string;
  PortalProductId: string;
  ResourceOwnerAccountId?: string;
}
export const ListProductPagesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ResourceOwnerAccountId: S.optional(S.String).pipe(
      T.HttpQuery("resourceOwnerAccountId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListProductPagesRequest",
}) as any as S.Schema<ListProductPagesRequest>;
export interface ListProductRestEndpointPagesRequest {
  MaxResults?: string;
  NextToken?: string;
  PortalProductId: string;
  ResourceOwnerAccountId?: string;
}
export const ListProductRestEndpointPagesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.String).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ResourceOwnerAccountId: S.optional(S.String).pipe(
      T.HttpQuery("resourceOwnerAccountId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListProductRestEndpointPagesRequest",
}) as any as S.Schema<ListProductRestEndpointPagesRequest>;
export interface ListRoutingRulesRequest {
  DomainName: string;
  DomainNameId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListRoutingRulesRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/domainnames/{DomainName}/routingrules",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRoutingRulesRequest",
}) as any as S.Schema<ListRoutingRulesRequest>;
export interface PreviewPortalRequest {
  PortalId: string;
}
export const PreviewPortalRequest = S.suspend(() =>
  S.Struct({ PortalId: S.String.pipe(T.HttpLabel("PortalId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/portals/{PortalId}/preview" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PreviewPortalRequest",
}) as any as S.Schema<PreviewPortalRequest>;
export interface PreviewPortalResponse {}
export const PreviewPortalResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PreviewPortalResponse",
}) as any as S.Schema<PreviewPortalResponse>;
export interface PublishPortalRequest {
  Description?: string;
  PortalId: string;
}
export const PublishPortalRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    PortalId: S.String.pipe(T.HttpLabel("PortalId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/portals/{PortalId}/publish" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PublishPortalRequest",
}) as any as S.Schema<PublishPortalRequest>;
export interface PublishPortalResponse {}
export const PublishPortalResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PublishPortalResponse",
}) as any as S.Schema<PublishPortalResponse>;
export interface PutPortalProductSharingPolicyRequest {
  PolicyDocument: string;
  PortalProductId: string;
}
export const PutPortalProductSharingPolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyDocument: S.String.pipe(T.JsonName("policyDocument")),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutPortalProductSharingPolicyRequest",
}) as any as S.Schema<PutPortalProductSharingPolicyRequest>;
export interface PutPortalProductSharingPolicyResponse {}
export const PutPortalProductSharingPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutPortalProductSharingPolicyResponse",
}) as any as S.Schema<PutPortalProductSharingPolicyResponse>;
export interface RoutingRuleActionInvokeApi {
  ApiId: string;
  Stage: string;
  StripBasePath?: boolean;
}
export const RoutingRuleActionInvokeApi = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.JsonName("apiId")),
    Stage: S.String.pipe(T.JsonName("stage")),
    StripBasePath: S.optional(S.Boolean).pipe(T.JsonName("stripBasePath")),
  }),
).annotations({
  identifier: "RoutingRuleActionInvokeApi",
}) as any as S.Schema<RoutingRuleActionInvokeApi>;
export interface RoutingRuleAction {
  InvokeApi: RoutingRuleActionInvokeApi;
}
export const RoutingRuleAction = S.suspend(() =>
  S.Struct({
    InvokeApi: RoutingRuleActionInvokeApi.pipe(
      T.JsonName("invokeApi"),
    ).annotations({ identifier: "RoutingRuleActionInvokeApi" }),
  }),
).annotations({
  identifier: "RoutingRuleAction",
}) as any as S.Schema<RoutingRuleAction>;
export type __listOfRoutingRuleAction = RoutingRuleAction[];
export const __listOfRoutingRuleAction = S.Array(RoutingRuleAction);
export type __listOfSelectionKey = string[];
export const __listOfSelectionKey = S.Array(S.String);
export interface RoutingRuleMatchBasePaths {
  AnyOf: __listOfSelectionKey;
}
export const RoutingRuleMatchBasePaths = S.suspend(() =>
  S.Struct({ AnyOf: __listOfSelectionKey.pipe(T.JsonName("anyOf")) }),
).annotations({
  identifier: "RoutingRuleMatchBasePaths",
}) as any as S.Schema<RoutingRuleMatchBasePaths>;
export interface RoutingRuleMatchHeaderValue {
  Header: string;
  ValueGlob: string;
}
export const RoutingRuleMatchHeaderValue = S.suspend(() =>
  S.Struct({
    Header: S.String.pipe(T.JsonName("header")),
    ValueGlob: S.String.pipe(T.JsonName("valueGlob")),
  }),
).annotations({
  identifier: "RoutingRuleMatchHeaderValue",
}) as any as S.Schema<RoutingRuleMatchHeaderValue>;
export type __listOfRoutingRuleMatchHeaderValue = RoutingRuleMatchHeaderValue[];
export const __listOfRoutingRuleMatchHeaderValue = S.Array(
  RoutingRuleMatchHeaderValue,
);
export interface RoutingRuleMatchHeaders {
  AnyOf: __listOfRoutingRuleMatchHeaderValue;
}
export const RoutingRuleMatchHeaders = S.suspend(() =>
  S.Struct({
    AnyOf: __listOfRoutingRuleMatchHeaderValue.pipe(T.JsonName("anyOf")),
  }),
).annotations({
  identifier: "RoutingRuleMatchHeaders",
}) as any as S.Schema<RoutingRuleMatchHeaders>;
export interface RoutingRuleCondition {
  MatchBasePaths?: RoutingRuleMatchBasePaths;
  MatchHeaders?: RoutingRuleMatchHeaders;
}
export const RoutingRuleCondition = S.suspend(() =>
  S.Struct({
    MatchBasePaths: S.optional(RoutingRuleMatchBasePaths)
      .pipe(T.JsonName("matchBasePaths"))
      .annotations({ identifier: "RoutingRuleMatchBasePaths" }),
    MatchHeaders: S.optional(RoutingRuleMatchHeaders)
      .pipe(T.JsonName("matchHeaders"))
      .annotations({ identifier: "RoutingRuleMatchHeaders" }),
  }),
).annotations({
  identifier: "RoutingRuleCondition",
}) as any as S.Schema<RoutingRuleCondition>;
export type __listOfRoutingRuleCondition = RoutingRuleCondition[];
export const __listOfRoutingRuleCondition = S.Array(RoutingRuleCondition);
export interface PutRoutingRuleRequest {
  Actions: __listOfRoutingRuleAction;
  Conditions: __listOfRoutingRuleCondition;
  DomainName: string;
  DomainNameId?: string;
  Priority: number;
  RoutingRuleId: string;
}
export const PutRoutingRuleRequest = S.suspend(() =>
  S.Struct({
    Actions: __listOfRoutingRuleAction.pipe(T.JsonName("actions")),
    Conditions: __listOfRoutingRuleCondition.pipe(T.JsonName("conditions")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    Priority: S.Number.pipe(T.JsonName("priority")),
    RoutingRuleId: S.String.pipe(T.HttpLabel("RoutingRuleId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutRoutingRuleRequest",
}) as any as S.Schema<PutRoutingRuleRequest>;
export interface ReimportApiRequest {
  ApiId: string;
  Basepath?: string;
  Body: string;
  FailOnWarnings?: boolean;
}
export const ReimportApiRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    Basepath: S.optional(S.String).pipe(T.HttpQuery("basepath")),
    Body: S.String.pipe(T.JsonName("body")),
    FailOnWarnings: S.optional(S.Boolean).pipe(T.HttpQuery("failOnWarnings")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/apis/{ApiId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ReimportApiRequest",
}) as any as S.Schema<ReimportApiRequest>;
export interface ResetAuthorizersCacheRequest {
  ApiId: string;
  StageName: string;
}
export const ResetAuthorizersCacheRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ResetAuthorizersCacheRequest",
}) as any as S.Schema<ResetAuthorizersCacheRequest>;
export interface ResetAuthorizersCacheResponse {}
export const ResetAuthorizersCacheResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ResetAuthorizersCacheResponse",
}) as any as S.Schema<ResetAuthorizersCacheResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags?: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/tags/{ResourceArn}" }),
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
  ResourceArn: string;
  TagKeys: __listOf__string;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/tags/{ResourceArn}" }),
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
export type CorsHeaderList = string[];
export const CorsHeaderList = S.Array(S.String);
export type CorsMethodList = string[];
export const CorsMethodList = S.Array(S.String);
export type CorsOriginList = string[];
export const CorsOriginList = S.Array(S.String);
export interface Cors {
  AllowCredentials?: boolean;
  AllowHeaders?: CorsHeaderList;
  AllowMethods?: CorsMethodList;
  AllowOrigins?: CorsOriginList;
  ExposeHeaders?: CorsHeaderList;
  MaxAge?: number;
}
export const Cors = S.suspend(() =>
  S.Struct({
    AllowCredentials: S.optional(S.Boolean).pipe(
      T.JsonName("allowCredentials"),
    ),
    AllowHeaders: S.optional(CorsHeaderList).pipe(T.JsonName("allowHeaders")),
    AllowMethods: S.optional(CorsMethodList).pipe(T.JsonName("allowMethods")),
    AllowOrigins: S.optional(CorsOriginList).pipe(T.JsonName("allowOrigins")),
    ExposeHeaders: S.optional(CorsHeaderList).pipe(T.JsonName("exposeHeaders")),
    MaxAge: S.optional(S.Number).pipe(T.JsonName("maxAge")),
  }),
).annotations({ identifier: "Cors" }) as any as S.Schema<Cors>;
export interface UpdateApiRequest {
  ApiId: string;
  ApiKeySelectionExpression?: string;
  CorsConfiguration?: Cors;
  CredentialsArn?: string;
  Description?: string;
  DisableSchemaValidation?: boolean;
  DisableExecuteApiEndpoint?: boolean;
  IpAddressType?: string;
  Name?: string;
  RouteKey?: string;
  RouteSelectionExpression?: string;
  Target?: string;
  Version?: string;
}
export const UpdateApiRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ApiKeySelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiKeySelectionExpression"),
    ),
    CorsConfiguration: S.optional(Cors)
      .pipe(T.JsonName("corsConfiguration"))
      .annotations({ identifier: "Cors" }),
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
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v2/apis/{ApiId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApiRequest",
}) as any as S.Schema<UpdateApiRequest>;
export interface UpdateApiMappingRequest {
  ApiId: string;
  ApiMappingId: string;
  ApiMappingKey?: string;
  DomainName: string;
  Stage?: string;
}
export const UpdateApiMappingRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.JsonName("apiId")),
    ApiMappingId: S.String.pipe(T.HttpLabel("ApiMappingId")),
    ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    Stage: S.optional(S.String).pipe(T.JsonName("stage")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateApiMappingRequest",
}) as any as S.Schema<UpdateApiMappingRequest>;
export interface JWTConfiguration {
  Audience?: __listOf__string;
  Issuer?: string;
}
export const JWTConfiguration = S.suspend(() =>
  S.Struct({
    Audience: S.optional(__listOf__string).pipe(T.JsonName("audience")),
    Issuer: S.optional(S.String).pipe(T.JsonName("issuer")),
  }),
).annotations({
  identifier: "JWTConfiguration",
}) as any as S.Schema<JWTConfiguration>;
export interface UpdateAuthorizerRequest {
  ApiId: string;
  AuthorizerCredentialsArn?: string;
  AuthorizerId: string;
  AuthorizerPayloadFormatVersion?: string;
  AuthorizerResultTtlInSeconds?: number;
  AuthorizerType?: string;
  AuthorizerUri?: string;
  EnableSimpleResponses?: boolean;
  IdentitySource?: IdentitySourceList;
  IdentityValidationExpression?: string;
  JwtConfiguration?: JWTConfiguration;
  Name?: string;
}
export const UpdateAuthorizerRequest = S.suspend(() =>
  S.Struct({
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
    JwtConfiguration: S.optional(JWTConfiguration)
      .pipe(T.JsonName("jwtConfiguration"))
      .annotations({ identifier: "JWTConfiguration" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateAuthorizerRequest",
}) as any as S.Schema<UpdateAuthorizerRequest>;
export interface UpdateDeploymentRequest {
  ApiId: string;
  DeploymentId: string;
  Description?: string;
}
export const UpdateDeploymentRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    DeploymentId: S.String.pipe(T.HttpLabel("DeploymentId")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateDeploymentRequest",
}) as any as S.Schema<UpdateDeploymentRequest>;
export interface DomainNameConfiguration {
  ApiGatewayDomainName?: string;
  CertificateArn?: string;
  CertificateName?: string;
  CertificateUploadDate?: Date;
  DomainNameStatus?: string;
  DomainNameStatusMessage?: string;
  EndpointType?: string;
  HostedZoneId?: string;
  IpAddressType?: string;
  SecurityPolicy?: string;
  OwnershipVerificationCertificateArn?: string;
}
export const DomainNameConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DomainNameConfiguration",
}) as any as S.Schema<DomainNameConfiguration>;
export type DomainNameConfigurations = DomainNameConfiguration[];
export const DomainNameConfigurations = S.Array(DomainNameConfiguration);
export interface MutualTlsAuthenticationInput {
  TruststoreUri?: string;
  TruststoreVersion?: string;
}
export const MutualTlsAuthenticationInput = S.suspend(() =>
  S.Struct({
    TruststoreUri: S.optional(S.String).pipe(T.JsonName("truststoreUri")),
    TruststoreVersion: S.optional(S.String).pipe(
      T.JsonName("truststoreVersion"),
    ),
  }),
).annotations({
  identifier: "MutualTlsAuthenticationInput",
}) as any as S.Schema<MutualTlsAuthenticationInput>;
export interface UpdateDomainNameRequest {
  DomainName: string;
  DomainNameConfigurations?: DomainNameConfigurations;
  MutualTlsAuthentication?: MutualTlsAuthenticationInput;
  RoutingMode?: string;
}
export const UpdateDomainNameRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
      T.JsonName("domainNameConfigurations"),
    ),
    MutualTlsAuthentication: S.optional(MutualTlsAuthenticationInput)
      .pipe(T.JsonName("mutualTlsAuthentication"))
      .annotations({ identifier: "MutualTlsAuthenticationInput" }),
    RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v2/domainnames/{DomainName}" }),
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
export type ResponseParameters = { [key: string]: IntegrationParameters };
export const ResponseParameters = S.Record({
  key: S.String,
  value: IntegrationParameters,
});
export interface TlsConfigInput {
  ServerNameToVerify?: string;
}
export const TlsConfigInput = S.suspend(() =>
  S.Struct({
    ServerNameToVerify: S.optional(S.String).pipe(
      T.JsonName("serverNameToVerify"),
    ),
  }),
).annotations({
  identifier: "TlsConfigInput",
}) as any as S.Schema<TlsConfigInput>;
export interface UpdateIntegrationRequest {
  ApiId: string;
  ConnectionId?: string;
  ConnectionType?: string;
  ContentHandlingStrategy?: string;
  CredentialsArn?: string;
  Description?: string;
  IntegrationId: string;
  IntegrationMethod?: string;
  IntegrationSubtype?: string;
  IntegrationType?: string;
  IntegrationUri?: string;
  PassthroughBehavior?: string;
  PayloadFormatVersion?: string;
  RequestParameters?: IntegrationParameters;
  RequestTemplates?: TemplateMap;
  ResponseParameters?: ResponseParameters;
  TemplateSelectionExpression?: string;
  TimeoutInMillis?: number;
  TlsConfig?: TlsConfigInput;
}
export const UpdateIntegrationRequest = S.suspend(() =>
  S.Struct({
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
    TlsConfig: S.optional(TlsConfigInput)
      .pipe(T.JsonName("tlsConfig"))
      .annotations({ identifier: "TlsConfigInput" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateIntegrationRequest",
}) as any as S.Schema<UpdateIntegrationRequest>;
export interface UpdateIntegrationResponseRequest {
  ApiId: string;
  ContentHandlingStrategy?: string;
  IntegrationId: string;
  IntegrationResponseId: string;
  IntegrationResponseKey?: string;
  ResponseParameters?: IntegrationParameters;
  ResponseTemplates?: TemplateMap;
  TemplateSelectionExpression?: string;
}
export const UpdateIntegrationResponseRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateIntegrationResponseRequest",
}) as any as S.Schema<UpdateIntegrationResponseRequest>;
export interface UpdateModelRequest {
  ApiId: string;
  ContentType?: string;
  Description?: string;
  ModelId: string;
  Name?: string;
  Schema?: string;
}
export const UpdateModelRequest = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    ModelId: S.String.pipe(T.HttpLabel("ModelId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Schema: S.optional(S.String).pipe(T.JsonName("schema")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v2/apis/{ApiId}/models/{ModelId}" }),
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
export interface CognitoConfig {
  AppClientId: string;
  UserPoolArn: string;
  UserPoolDomain: string;
}
export const CognitoConfig = S.suspend(() =>
  S.Struct({
    AppClientId: S.String.pipe(T.JsonName("appClientId")),
    UserPoolArn: S.String.pipe(T.JsonName("userPoolArn")),
    UserPoolDomain: S.String.pipe(T.JsonName("userPoolDomain")),
  }),
).annotations({
  identifier: "CognitoConfig",
}) as any as S.Schema<CognitoConfig>;
export interface None {}
export const None = S.suspend(() => S.Struct({})).annotations({
  identifier: "None",
}) as any as S.Schema<None>;
export interface Authorization {
  CognitoConfig?: CognitoConfig;
  None?: None;
}
export const Authorization = S.suspend(() =>
  S.Struct({
    CognitoConfig: S.optional(CognitoConfig)
      .pipe(T.JsonName("cognitoConfig"))
      .annotations({ identifier: "CognitoConfig" }),
    None: S.optional(None)
      .pipe(T.JsonName("none"))
      .annotations({ identifier: "None" }),
  }),
).annotations({
  identifier: "Authorization",
}) as any as S.Schema<Authorization>;
export interface ACMManaged {
  CertificateArn: string;
  DomainName: string;
}
export const ACMManaged = S.suspend(() =>
  S.Struct({
    CertificateArn: S.String.pipe(T.JsonName("certificateArn")),
    DomainName: S.String.pipe(T.JsonName("domainName")),
  }),
).annotations({ identifier: "ACMManaged" }) as any as S.Schema<ACMManaged>;
export interface EndpointConfigurationRequest {
  AcmManaged?: ACMManaged;
  None?: None;
}
export const EndpointConfigurationRequest = S.suspend(() =>
  S.Struct({
    AcmManaged: S.optional(ACMManaged)
      .pipe(T.JsonName("acmManaged"))
      .annotations({ identifier: "ACMManaged" }),
    None: S.optional(None)
      .pipe(T.JsonName("none"))
      .annotations({ identifier: "None" }),
  }),
).annotations({
  identifier: "EndpointConfigurationRequest",
}) as any as S.Schema<EndpointConfigurationRequest>;
export interface CustomColors {
  AccentColor: string;
  BackgroundColor: string;
  ErrorValidationColor: string;
  HeaderColor: string;
  NavigationColor: string;
  TextColor: string;
}
export const CustomColors = S.suspend(() =>
  S.Struct({
    AccentColor: S.String.pipe(T.JsonName("accentColor")),
    BackgroundColor: S.String.pipe(T.JsonName("backgroundColor")),
    ErrorValidationColor: S.String.pipe(T.JsonName("errorValidationColor")),
    HeaderColor: S.String.pipe(T.JsonName("headerColor")),
    NavigationColor: S.String.pipe(T.JsonName("navigationColor")),
    TextColor: S.String.pipe(T.JsonName("textColor")),
  }),
).annotations({ identifier: "CustomColors" }) as any as S.Schema<CustomColors>;
export interface PortalTheme {
  CustomColors: CustomColors;
  LogoLastUploaded?: Date;
}
export const PortalTheme = S.suspend(() =>
  S.Struct({
    CustomColors: CustomColors.pipe(T.JsonName("customColors")).annotations({
      identifier: "CustomColors",
    }),
    LogoLastUploaded: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("logoLastUploaded")),
  }),
).annotations({ identifier: "PortalTheme" }) as any as S.Schema<PortalTheme>;
export interface PortalContent {
  Description?: string;
  DisplayName: string;
  Theme: PortalTheme;
}
export const PortalContent = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DisplayName: S.String.pipe(T.JsonName("displayName")),
    Theme: PortalTheme.pipe(T.JsonName("theme")).annotations({
      identifier: "PortalTheme",
    }),
  }),
).annotations({
  identifier: "PortalContent",
}) as any as S.Schema<PortalContent>;
export interface UpdatePortalRequest {
  Authorization?: Authorization;
  EndpointConfiguration?: EndpointConfigurationRequest;
  IncludedPortalProductArns?: __listOf__stringMin20Max2048;
  LogoUri?: string;
  PortalContent?: PortalContent;
  PortalId: string;
  RumAppMonitorName?: string;
}
export const UpdatePortalRequest = S.suspend(() =>
  S.Struct({
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    EndpointConfiguration: S.optional(EndpointConfigurationRequest)
      .pipe(T.JsonName("endpointConfiguration"))
      .annotations({ identifier: "EndpointConfigurationRequest" }),
    IncludedPortalProductArns: S.optional(__listOf__stringMin20Max2048).pipe(
      T.JsonName("includedPortalProductArns"),
    ),
    LogoUri: S.optional(S.String).pipe(T.JsonName("logoUri")),
    PortalContent: S.optional(PortalContent)
      .pipe(T.JsonName("portalContent"))
      .annotations({ identifier: "PortalContent" }),
    PortalId: S.String.pipe(T.HttpLabel("PortalId")),
    RumAppMonitorName: S.optional(S.String).pipe(
      T.JsonName("rumAppMonitorName"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v2/portals/{PortalId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePortalRequest",
}) as any as S.Schema<UpdatePortalRequest>;
export interface DisplayContent {
  Body: string;
  Title: string;
}
export const DisplayContent = S.suspend(() =>
  S.Struct({
    Body: S.String.pipe(T.JsonName("body")),
    Title: S.String.pipe(T.JsonName("title")),
  }),
).annotations({
  identifier: "DisplayContent",
}) as any as S.Schema<DisplayContent>;
export interface UpdateProductPageRequest {
  DisplayContent?: DisplayContent;
  PortalProductId: string;
  ProductPageId: string;
}
export const UpdateProductPageRequest = S.suspend(() =>
  S.Struct({
    DisplayContent: S.optional(DisplayContent)
      .pipe(T.JsonName("displayContent"))
      .annotations({ identifier: "DisplayContent" }),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ProductPageId: S.String.pipe(T.HttpLabel("ProductPageId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateProductPageRequest",
}) as any as S.Schema<UpdateProductPageRequest>;
export interface DisplayContentOverrides {
  Body?: string;
  Endpoint?: string;
  OperationName?: string;
}
export const DisplayContentOverrides = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String).pipe(T.JsonName("body")),
    Endpoint: S.optional(S.String).pipe(T.JsonName("endpoint")),
    OperationName: S.optional(S.String).pipe(T.JsonName("operationName")),
  }),
).annotations({
  identifier: "DisplayContentOverrides",
}) as any as S.Schema<DisplayContentOverrides>;
export interface EndpointDisplayContent {
  None?: None;
  Overrides?: DisplayContentOverrides;
}
export const EndpointDisplayContent = S.suspend(() =>
  S.Struct({
    None: S.optional(None)
      .pipe(T.JsonName("none"))
      .annotations({ identifier: "None" }),
    Overrides: S.optional(DisplayContentOverrides)
      .pipe(T.JsonName("overrides"))
      .annotations({ identifier: "DisplayContentOverrides" }),
  }),
).annotations({
  identifier: "EndpointDisplayContent",
}) as any as S.Schema<EndpointDisplayContent>;
export interface UpdateProductRestEndpointPageRequest {
  DisplayContent?: EndpointDisplayContent;
  PortalProductId: string;
  ProductRestEndpointPageId: string;
  TryItState?: string;
}
export const UpdateProductRestEndpointPageRequest = S.suspend(() =>
  S.Struct({
    DisplayContent: S.optional(EndpointDisplayContent)
      .pipe(T.JsonName("displayContent"))
      .annotations({ identifier: "EndpointDisplayContent" }),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    ProductRestEndpointPageId: S.String.pipe(
      T.HttpLabel("ProductRestEndpointPageId"),
    ),
    TryItState: S.optional(S.String).pipe(T.JsonName("tryItState")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateProductRestEndpointPageRequest",
}) as any as S.Schema<UpdateProductRestEndpointPageRequest>;
export interface UpdateRouteRequest {
  ApiId: string;
  ApiKeyRequired?: boolean;
  AuthorizationScopes?: AuthorizationScopes;
  AuthorizationType?: string;
  AuthorizerId?: string;
  ModelSelectionExpression?: string;
  OperationName?: string;
  RequestModels?: RouteModels;
  RequestParameters?: RouteParameters;
  RouteId: string;
  RouteKey?: string;
  RouteResponseSelectionExpression?: string;
  Target?: string;
}
export const UpdateRouteRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v2/apis/{ApiId}/routes/{RouteId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRouteRequest",
}) as any as S.Schema<UpdateRouteRequest>;
export interface UpdateRouteResponseRequest {
  ApiId: string;
  ModelSelectionExpression?: string;
  ResponseModels?: RouteModels;
  ResponseParameters?: RouteParameters;
  RouteId: string;
  RouteResponseId: string;
  RouteResponseKey?: string;
}
export const UpdateRouteResponseRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateRouteResponseRequest",
}) as any as S.Schema<UpdateRouteResponseRequest>;
export interface AccessLogSettings {
  DestinationArn?: string;
  Format?: string;
}
export const AccessLogSettings = S.suspend(() =>
  S.Struct({
    DestinationArn: S.optional(S.String).pipe(T.JsonName("destinationArn")),
    Format: S.optional(S.String).pipe(T.JsonName("format")),
  }),
).annotations({
  identifier: "AccessLogSettings",
}) as any as S.Schema<AccessLogSettings>;
export interface RouteSettings {
  DataTraceEnabled?: boolean;
  DetailedMetricsEnabled?: boolean;
  LoggingLevel?: string;
  ThrottlingBurstLimit?: number;
  ThrottlingRateLimit?: number;
}
export const RouteSettings = S.suspend(() =>
  S.Struct({
    DataTraceEnabled: S.optional(S.Boolean).pipe(
      T.JsonName("dataTraceEnabled"),
    ),
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
  }),
).annotations({
  identifier: "RouteSettings",
}) as any as S.Schema<RouteSettings>;
export type RouteSettingsMap = { [key: string]: RouteSettings };
export const RouteSettingsMap = S.Record({
  key: S.String,
  value: RouteSettings,
});
export type StageVariablesMap = { [key: string]: string };
export const StageVariablesMap = S.Record({ key: S.String, value: S.String });
export interface UpdateStageRequest {
  AccessLogSettings?: AccessLogSettings;
  ApiId: string;
  AutoDeploy?: boolean;
  ClientCertificateId?: string;
  DefaultRouteSettings?: RouteSettings;
  DeploymentId?: string;
  Description?: string;
  RouteSettings?: RouteSettingsMap;
  StageName: string;
  StageVariables?: StageVariablesMap;
}
export const UpdateStageRequest = S.suspend(() =>
  S.Struct({
    AccessLogSettings: S.optional(AccessLogSettings)
      .pipe(T.JsonName("accessLogSettings"))
      .annotations({ identifier: "AccessLogSettings" }),
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    AutoDeploy: S.optional(S.Boolean).pipe(T.JsonName("autoDeploy")),
    ClientCertificateId: S.optional(S.String).pipe(
      T.JsonName("clientCertificateId"),
    ),
    DefaultRouteSettings: S.optional(RouteSettings)
      .pipe(T.JsonName("defaultRouteSettings"))
      .annotations({ identifier: "RouteSettings" }),
    DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    RouteSettings: S.optional(RouteSettingsMap).pipe(
      T.JsonName("routeSettings"),
    ),
    StageName: S.String.pipe(T.HttpLabel("StageName")),
    StageVariables: S.optional(StageVariablesMap).pipe(
      T.JsonName("stageVariables"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v2/apis/{ApiId}/stages/{StageName}" }),
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
export interface UpdateVpcLinkRequest {
  Name?: string;
  VpcLinkId: string;
}
export const UpdateVpcLinkRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    VpcLinkId: S.String.pipe(T.HttpLabel("VpcLinkId")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v2/vpclinks/{VpcLinkId}" }),
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
export interface CreateApiRequest {
  ApiKeySelectionExpression?: string;
  CorsConfiguration?: Cors;
  CredentialsArn?: string;
  Description?: string;
  DisableSchemaValidation?: boolean;
  DisableExecuteApiEndpoint?: boolean;
  IpAddressType?: string;
  Name: string;
  ProtocolType: string;
  RouteKey?: string;
  RouteSelectionExpression?: string;
  Tags?: Tags;
  Target?: string;
  Version?: string;
}
export const CreateApiRequest = S.suspend(() =>
  S.Struct({
    ApiKeySelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiKeySelectionExpression"),
    ),
    CorsConfiguration: S.optional(Cors)
      .pipe(T.JsonName("corsConfiguration"))
      .annotations({ identifier: "Cors" }),
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/apis" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApiRequest",
}) as any as S.Schema<CreateApiRequest>;
export interface CreateApiMappingResponse {
  ApiId?: string;
  ApiMappingId?: string;
  ApiMappingKey?: string;
  Stage?: string;
}
export const CreateApiMappingResponse = S.suspend(() =>
  S.Struct({
    ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
    ApiMappingId: S.optional(S.String).pipe(T.JsonName("apiMappingId")),
    ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
    Stage: S.optional(S.String).pipe(T.JsonName("stage")),
  }),
).annotations({
  identifier: "CreateApiMappingResponse",
}) as any as S.Schema<CreateApiMappingResponse>;
export interface CreateAuthorizerRequest {
  ApiId: string;
  AuthorizerCredentialsArn?: string;
  AuthorizerPayloadFormatVersion?: string;
  AuthorizerResultTtlInSeconds?: number;
  AuthorizerType: string;
  AuthorizerUri?: string;
  EnableSimpleResponses?: boolean;
  IdentitySource: IdentitySourceList;
  IdentityValidationExpression?: string;
  JwtConfiguration?: JWTConfiguration;
  Name: string;
}
export const CreateAuthorizerRequest = S.suspend(() =>
  S.Struct({
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
    JwtConfiguration: S.optional(JWTConfiguration)
      .pipe(T.JsonName("jwtConfiguration"))
      .annotations({ identifier: "JWTConfiguration" }),
    Name: S.String.pipe(T.JsonName("name")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/authorizers" }),
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
export interface CreateDeploymentResponse {
  AutoDeployed?: boolean;
  CreatedDate?: Date;
  DeploymentId?: string;
  DeploymentStatus?: string;
  DeploymentStatusMessage?: string;
  Description?: string;
}
export const CreateDeploymentResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "CreateDeploymentResponse",
}) as any as S.Schema<CreateDeploymentResponse>;
export interface CreateDomainNameRequest {
  DomainName: string;
  DomainNameConfigurations?: DomainNameConfigurations;
  MutualTlsAuthentication?: MutualTlsAuthenticationInput;
  RoutingMode?: string;
  Tags?: Tags;
}
export const CreateDomainNameRequest = S.suspend(() =>
  S.Struct({
    DomainName: S.String.pipe(T.JsonName("domainName")),
    DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
      T.JsonName("domainNameConfigurations"),
    ),
    MutualTlsAuthentication: S.optional(MutualTlsAuthenticationInput)
      .pipe(T.JsonName("mutualTlsAuthentication"))
      .annotations({ identifier: "MutualTlsAuthenticationInput" }),
    RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/domainnames" }),
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
export interface CreateIntegrationRequest {
  ApiId: string;
  ConnectionId?: string;
  ConnectionType?: string;
  ContentHandlingStrategy?: string;
  CredentialsArn?: string;
  Description?: string;
  IntegrationMethod?: string;
  IntegrationSubtype?: string;
  IntegrationType: string;
  IntegrationUri?: string;
  PassthroughBehavior?: string;
  PayloadFormatVersion?: string;
  RequestParameters?: IntegrationParameters;
  RequestTemplates?: TemplateMap;
  ResponseParameters?: ResponseParameters;
  TemplateSelectionExpression?: string;
  TimeoutInMillis?: number;
  TlsConfig?: TlsConfigInput;
}
export const CreateIntegrationRequest = S.suspend(() =>
  S.Struct({
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
    TlsConfig: S.optional(TlsConfigInput)
      .pipe(T.JsonName("tlsConfig"))
      .annotations({ identifier: "TlsConfigInput" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/integrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIntegrationRequest",
}) as any as S.Schema<CreateIntegrationRequest>;
export interface CreateIntegrationResponseResponse {
  ContentHandlingStrategy?: string;
  IntegrationResponseId?: string;
  IntegrationResponseKey?: string;
  ResponseParameters?: IntegrationParameters;
  ResponseTemplates?: TemplateMap;
  TemplateSelectionExpression?: string;
}
export const CreateIntegrationResponseResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "CreateIntegrationResponseResponse",
}) as any as S.Schema<CreateIntegrationResponseResponse>;
export interface CreateModelResponse {
  ContentType?: string;
  Description?: string;
  ModelId?: string;
  Name?: string;
  Schema?: string;
}
export const CreateModelResponse = S.suspend(() =>
  S.Struct({
    ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    ModelId: S.optional(S.String).pipe(T.JsonName("modelId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Schema: S.optional(S.String).pipe(T.JsonName("schema")),
  }),
).annotations({
  identifier: "CreateModelResponse",
}) as any as S.Schema<CreateModelResponse>;
export interface Section {
  ProductRestEndpointPageArns: __listOf__stringMin20Max2048;
  SectionName: string;
}
export const Section = S.suspend(() =>
  S.Struct({
    ProductRestEndpointPageArns: __listOf__stringMin20Max2048.pipe(
      T.JsonName("productRestEndpointPageArns"),
    ),
    SectionName: S.String.pipe(T.JsonName("sectionName")),
  }),
).annotations({ identifier: "Section" }) as any as S.Schema<Section>;
export type __listOfSection = Section[];
export const __listOfSection = S.Array(Section);
export interface DisplayOrder {
  Contents?: __listOfSection;
  OverviewPageArn?: string;
  ProductPageArns?: __listOf__stringMin20Max2048;
}
export const DisplayOrder = S.suspend(() =>
  S.Struct({
    Contents: S.optional(__listOfSection).pipe(T.JsonName("contents")),
    OverviewPageArn: S.optional(S.String).pipe(T.JsonName("overviewPageArn")),
    ProductPageArns: S.optional(__listOf__stringMin20Max2048).pipe(
      T.JsonName("productPageArns"),
    ),
  }),
).annotations({ identifier: "DisplayOrder" }) as any as S.Schema<DisplayOrder>;
export interface CreatePortalProductResponse {
  Description?: string;
  DisplayName?: string;
  DisplayOrder?: DisplayOrder;
  LastModified?: Date;
  PortalProductArn?: string;
  PortalProductId?: string;
  Tags?: Tags;
}
export const CreatePortalProductResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DisplayName: S.optional(S.String).pipe(T.JsonName("displayName")),
    DisplayOrder: S.optional(DisplayOrder)
      .pipe(T.JsonName("displayOrder"))
      .annotations({ identifier: "DisplayOrder" }),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastModified"),
    ),
    PortalProductArn: S.optional(S.String).pipe(T.JsonName("portalProductArn")),
    PortalProductId: S.optional(S.String).pipe(T.JsonName("portalProductId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreatePortalProductResponse",
}) as any as S.Schema<CreatePortalProductResponse>;
export interface CreateProductPageRequest {
  DisplayContent: DisplayContent;
  PortalProductId: string;
}
export const CreateProductPageRequest = S.suspend(() =>
  S.Struct({
    DisplayContent: DisplayContent.pipe(
      T.JsonName("displayContent"),
    ).annotations({ identifier: "DisplayContent" }),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateProductPageRequest",
}) as any as S.Schema<CreateProductPageRequest>;
export interface CreateRouteResponseResponse {
  ModelSelectionExpression?: string;
  ResponseModels?: RouteModels;
  ResponseParameters?: RouteParameters;
  RouteResponseId?: string;
  RouteResponseKey?: string;
}
export const CreateRouteResponseResponse = S.suspend(() =>
  S.Struct({
    ModelSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("modelSelectionExpression"),
    ),
    ResponseModels: S.optional(RouteModels).pipe(T.JsonName("responseModels")),
    ResponseParameters: S.optional(RouteParameters).pipe(
      T.JsonName("responseParameters"),
    ),
    RouteResponseId: S.optional(S.String).pipe(T.JsonName("routeResponseId")),
    RouteResponseKey: S.optional(S.String).pipe(T.JsonName("routeResponseKey")),
  }),
).annotations({
  identifier: "CreateRouteResponseResponse",
}) as any as S.Schema<CreateRouteResponseResponse>;
export interface CreateStageRequest {
  AccessLogSettings?: AccessLogSettings;
  ApiId: string;
  AutoDeploy?: boolean;
  ClientCertificateId?: string;
  DefaultRouteSettings?: RouteSettings;
  DeploymentId?: string;
  Description?: string;
  RouteSettings?: RouteSettingsMap;
  StageName: string;
  StageVariables?: StageVariablesMap;
  Tags?: Tags;
}
export const CreateStageRequest = S.suspend(() =>
  S.Struct({
    AccessLogSettings: S.optional(AccessLogSettings)
      .pipe(T.JsonName("accessLogSettings"))
      .annotations({ identifier: "AccessLogSettings" }),
    ApiId: S.String.pipe(T.HttpLabel("ApiId")),
    AutoDeploy: S.optional(S.Boolean).pipe(T.JsonName("autoDeploy")),
    ClientCertificateId: S.optional(S.String).pipe(
      T.JsonName("clientCertificateId"),
    ),
    DefaultRouteSettings: S.optional(RouteSettings)
      .pipe(T.JsonName("defaultRouteSettings"))
      .annotations({ identifier: "RouteSettings" }),
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/stages" }),
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
export interface CreateVpcLinkResponse {
  CreatedDate?: Date;
  Name?: string;
  SecurityGroupIds?: SecurityGroupIdList;
  SubnetIds?: SubnetIdList;
  Tags?: Tags;
  VpcLinkId?: string;
  VpcLinkStatus?: string;
  VpcLinkStatusMessage?: string;
  VpcLinkVersion?: string;
}
export const CreateVpcLinkResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "CreateVpcLinkResponse",
}) as any as S.Schema<CreateVpcLinkResponse>;
export interface ExportApiResponse {
  body?: T.StreamingOutputBody;
}
export const ExportApiResponse = S.suspend(() =>
  S.Struct({ body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }),
).annotations({
  identifier: "ExportApiResponse",
}) as any as S.Schema<ExportApiResponse>;
export interface GetApiResponse {
  ApiEndpoint?: string;
  ApiGatewayManaged?: boolean;
  ApiId?: string;
  ApiKeySelectionExpression?: string;
  CorsConfiguration?: Cors;
  CreatedDate?: Date;
  Description?: string;
  DisableSchemaValidation?: boolean;
  DisableExecuteApiEndpoint?: boolean;
  ImportInfo?: __listOf__string;
  IpAddressType?: string;
  Name?: string;
  ProtocolType?: string;
  RouteSelectionExpression?: string;
  Tags?: Tags;
  Version?: string;
  Warnings?: __listOf__string;
}
export const GetApiResponse = S.suspend(() =>
  S.Struct({
    ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
    ApiGatewayManaged: S.optional(S.Boolean).pipe(
      T.JsonName("apiGatewayManaged"),
    ),
    ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
    ApiKeySelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiKeySelectionExpression"),
    ),
    CorsConfiguration: S.optional(Cors)
      .pipe(T.JsonName("corsConfiguration"))
      .annotations({ identifier: "Cors" }),
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
  }),
).annotations({
  identifier: "GetApiResponse",
}) as any as S.Schema<GetApiResponse>;
export interface GetApiMappingResponse {
  ApiId?: string;
  ApiMappingId?: string;
  ApiMappingKey?: string;
  Stage?: string;
}
export const GetApiMappingResponse = S.suspend(() =>
  S.Struct({
    ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
    ApiMappingId: S.optional(S.String).pipe(T.JsonName("apiMappingId")),
    ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
    Stage: S.optional(S.String).pipe(T.JsonName("stage")),
  }),
).annotations({
  identifier: "GetApiMappingResponse",
}) as any as S.Schema<GetApiMappingResponse>;
export interface GetAuthorizerResponse {
  AuthorizerCredentialsArn?: string;
  AuthorizerId?: string;
  AuthorizerPayloadFormatVersion?: string;
  AuthorizerResultTtlInSeconds?: number;
  AuthorizerType?: string;
  AuthorizerUri?: string;
  EnableSimpleResponses?: boolean;
  IdentitySource?: IdentitySourceList;
  IdentityValidationExpression?: string;
  JwtConfiguration?: JWTConfiguration;
  Name?: string;
}
export const GetAuthorizerResponse = S.suspend(() =>
  S.Struct({
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
    JwtConfiguration: S.optional(JWTConfiguration)
      .pipe(T.JsonName("jwtConfiguration"))
      .annotations({ identifier: "JWTConfiguration" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "GetAuthorizerResponse",
}) as any as S.Schema<GetAuthorizerResponse>;
export interface GetDeploymentResponse {
  AutoDeployed?: boolean;
  CreatedDate?: Date;
  DeploymentId?: string;
  DeploymentStatus?: string;
  DeploymentStatusMessage?: string;
  Description?: string;
}
export const GetDeploymentResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetDeploymentResponse",
}) as any as S.Schema<GetDeploymentResponse>;
export interface GetIntegrationResponseResponse {
  ContentHandlingStrategy?: string;
  IntegrationResponseId?: string;
  IntegrationResponseKey?: string;
  ResponseParameters?: IntegrationParameters;
  ResponseTemplates?: TemplateMap;
  TemplateSelectionExpression?: string;
}
export const GetIntegrationResponseResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetIntegrationResponseResponse",
}) as any as S.Schema<GetIntegrationResponseResponse>;
export interface GetModelResponse {
  ContentType?: string;
  Description?: string;
  ModelId?: string;
  Name?: string;
  Schema?: string;
}
export const GetModelResponse = S.suspend(() =>
  S.Struct({
    ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    ModelId: S.optional(S.String).pipe(T.JsonName("modelId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Schema: S.optional(S.String).pipe(T.JsonName("schema")),
  }),
).annotations({
  identifier: "GetModelResponse",
}) as any as S.Schema<GetModelResponse>;
export interface GetModelTemplateResponse {
  Value?: string;
}
export const GetModelTemplateResponse = S.suspend(() =>
  S.Struct({ Value: S.optional(S.String).pipe(T.JsonName("value")) }),
).annotations({
  identifier: "GetModelTemplateResponse",
}) as any as S.Schema<GetModelTemplateResponse>;
export interface GetPortalProductResponse {
  Description?: string;
  DisplayName?: string;
  DisplayOrder?: DisplayOrder;
  LastModified?: Date;
  PortalProductArn?: string;
  PortalProductId?: string;
  Tags?: Tags;
}
export const GetPortalProductResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DisplayName: S.optional(S.String).pipe(T.JsonName("displayName")),
    DisplayOrder: S.optional(DisplayOrder)
      .pipe(T.JsonName("displayOrder"))
      .annotations({ identifier: "DisplayOrder" }),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastModified"),
    ),
    PortalProductArn: S.optional(S.String).pipe(T.JsonName("portalProductArn")),
    PortalProductId: S.optional(S.String).pipe(T.JsonName("portalProductId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetPortalProductResponse",
}) as any as S.Schema<GetPortalProductResponse>;
export interface GetPortalProductSharingPolicyResponse {
  PolicyDocument?: string;
  PortalProductId?: string;
}
export const GetPortalProductSharingPolicyResponse = S.suspend(() =>
  S.Struct({
    PolicyDocument: S.optional(S.String).pipe(T.JsonName("policyDocument")),
    PortalProductId: S.optional(S.String).pipe(T.JsonName("portalProductId")),
  }),
).annotations({
  identifier: "GetPortalProductSharingPolicyResponse",
}) as any as S.Schema<GetPortalProductSharingPolicyResponse>;
export interface GetProductPageResponse {
  DisplayContent?: DisplayContent;
  LastModified?: Date;
  ProductPageArn?: string;
  ProductPageId?: string;
}
export const GetProductPageResponse = S.suspend(() =>
  S.Struct({
    DisplayContent: S.optional(DisplayContent)
      .pipe(T.JsonName("displayContent"))
      .annotations({ identifier: "DisplayContent" }),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastModified"),
    ),
    ProductPageArn: S.optional(S.String).pipe(T.JsonName("productPageArn")),
    ProductPageId: S.optional(S.String).pipe(T.JsonName("productPageId")),
  }),
).annotations({
  identifier: "GetProductPageResponse",
}) as any as S.Schema<GetProductPageResponse>;
export interface GetRouteResult {
  ApiGatewayManaged?: boolean;
  ApiKeyRequired?: boolean;
  AuthorizationScopes?: AuthorizationScopes;
  AuthorizationType?: string;
  AuthorizerId?: string;
  ModelSelectionExpression?: string;
  OperationName?: string;
  RequestModels?: RouteModels;
  RequestParameters?: RouteParameters;
  RouteId?: string;
  RouteKey?: string;
  RouteResponseSelectionExpression?: string;
  Target?: string;
}
export const GetRouteResult = S.suspend(() =>
  S.Struct({
    ApiGatewayManaged: S.optional(S.Boolean).pipe(
      T.JsonName("apiGatewayManaged"),
    ),
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
    RouteId: S.optional(S.String).pipe(T.JsonName("routeId")),
    RouteKey: S.optional(S.String).pipe(T.JsonName("routeKey")),
    RouteResponseSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("routeResponseSelectionExpression"),
    ),
    Target: S.optional(S.String).pipe(T.JsonName("target")),
  }),
).annotations({
  identifier: "GetRouteResult",
}) as any as S.Schema<GetRouteResult>;
export interface GetRouteResponseResponse {
  ModelSelectionExpression?: string;
  ResponseModels?: RouteModels;
  ResponseParameters?: RouteParameters;
  RouteResponseId?: string;
  RouteResponseKey?: string;
}
export const GetRouteResponseResponse = S.suspend(() =>
  S.Struct({
    ModelSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("modelSelectionExpression"),
    ),
    ResponseModels: S.optional(RouteModels).pipe(T.JsonName("responseModels")),
    ResponseParameters: S.optional(RouteParameters).pipe(
      T.JsonName("responseParameters"),
    ),
    RouteResponseId: S.optional(S.String).pipe(T.JsonName("routeResponseId")),
    RouteResponseKey: S.optional(S.String).pipe(T.JsonName("routeResponseKey")),
  }),
).annotations({
  identifier: "GetRouteResponseResponse",
}) as any as S.Schema<GetRouteResponseResponse>;
export interface GetRoutingRuleResponse {
  Actions?: __listOfRoutingRuleAction;
  Conditions?: __listOfRoutingRuleCondition;
  Priority?: number;
  RoutingRuleArn?: string;
  RoutingRuleId?: string;
}
export const GetRoutingRuleResponse = S.suspend(() =>
  S.Struct({
    Actions: S.optional(__listOfRoutingRuleAction).pipe(T.JsonName("actions")),
    Conditions: S.optional(__listOfRoutingRuleCondition).pipe(
      T.JsonName("conditions"),
    ),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    RoutingRuleArn: S.optional(S.String).pipe(T.JsonName("routingRuleArn")),
    RoutingRuleId: S.optional(S.String).pipe(T.JsonName("routingRuleId")),
  }),
).annotations({
  identifier: "GetRoutingRuleResponse",
}) as any as S.Schema<GetRoutingRuleResponse>;
export interface GetStageResponse {
  AccessLogSettings?: AccessLogSettings;
  ApiGatewayManaged?: boolean;
  AutoDeploy?: boolean;
  ClientCertificateId?: string;
  CreatedDate?: Date;
  DefaultRouteSettings?: RouteSettings;
  DeploymentId?: string;
  Description?: string;
  LastDeploymentStatusMessage?: string;
  LastUpdatedDate?: Date;
  RouteSettings?: RouteSettingsMap;
  StageName?: string;
  StageVariables?: StageVariablesMap;
  Tags?: Tags;
}
export const GetStageResponse = S.suspend(() =>
  S.Struct({
    AccessLogSettings: S.optional(AccessLogSettings)
      .pipe(T.JsonName("accessLogSettings"))
      .annotations({ identifier: "AccessLogSettings" }),
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
    DefaultRouteSettings: S.optional(RouteSettings)
      .pipe(T.JsonName("defaultRouteSettings"))
      .annotations({ identifier: "RouteSettings" }),
    DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    LastDeploymentStatusMessage: S.optional(S.String).pipe(
      T.JsonName("lastDeploymentStatusMessage"),
    ),
    LastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastUpdatedDate")),
    RouteSettings: S.optional(RouteSettingsMap).pipe(
      T.JsonName("routeSettings"),
    ),
    StageName: S.optional(S.String).pipe(T.JsonName("stageName")),
    StageVariables: S.optional(StageVariablesMap).pipe(
      T.JsonName("stageVariables"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetStageResponse",
}) as any as S.Schema<GetStageResponse>;
export interface GetTagsResponse {
  Tags?: Tags;
}
export const GetTagsResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "GetTagsResponse",
}) as any as S.Schema<GetTagsResponse>;
export interface GetVpcLinkResponse {
  CreatedDate?: Date;
  Name?: string;
  SecurityGroupIds?: SecurityGroupIdList;
  SubnetIds?: SubnetIdList;
  Tags?: Tags;
  VpcLinkId?: string;
  VpcLinkStatus?: string;
  VpcLinkStatusMessage?: string;
  VpcLinkVersion?: string;
}
export const GetVpcLinkResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetVpcLinkResponse",
}) as any as S.Schema<GetVpcLinkResponse>;
export interface ImportApiResponse {
  ApiEndpoint?: string;
  ApiGatewayManaged?: boolean;
  ApiId?: string;
  ApiKeySelectionExpression?: string;
  CorsConfiguration?: Cors;
  CreatedDate?: Date;
  Description?: string;
  DisableSchemaValidation?: boolean;
  DisableExecuteApiEndpoint?: boolean;
  ImportInfo?: __listOf__string;
  IpAddressType?: string;
  Name?: string;
  ProtocolType?: string;
  RouteSelectionExpression?: string;
  Tags?: Tags;
  Version?: string;
  Warnings?: __listOf__string;
}
export const ImportApiResponse = S.suspend(() =>
  S.Struct({
    ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
    ApiGatewayManaged: S.optional(S.Boolean).pipe(
      T.JsonName("apiGatewayManaged"),
    ),
    ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
    ApiKeySelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiKeySelectionExpression"),
    ),
    CorsConfiguration: S.optional(Cors)
      .pipe(T.JsonName("corsConfiguration"))
      .annotations({ identifier: "Cors" }),
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
  }),
).annotations({
  identifier: "ImportApiResponse",
}) as any as S.Schema<ImportApiResponse>;
export interface PutRoutingRuleResponse {
  Actions?: __listOfRoutingRuleAction;
  Conditions?: __listOfRoutingRuleCondition;
  Priority?: number;
  RoutingRuleArn?: string;
  RoutingRuleId?: string;
}
export const PutRoutingRuleResponse = S.suspend(() =>
  S.Struct({
    Actions: S.optional(__listOfRoutingRuleAction).pipe(T.JsonName("actions")),
    Conditions: S.optional(__listOfRoutingRuleCondition).pipe(
      T.JsonName("conditions"),
    ),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    RoutingRuleArn: S.optional(S.String).pipe(T.JsonName("routingRuleArn")),
    RoutingRuleId: S.optional(S.String).pipe(T.JsonName("routingRuleId")),
  }),
).annotations({
  identifier: "PutRoutingRuleResponse",
}) as any as S.Schema<PutRoutingRuleResponse>;
export interface ReimportApiResponse {
  ApiEndpoint?: string;
  ApiGatewayManaged?: boolean;
  ApiId?: string;
  ApiKeySelectionExpression?: string;
  CorsConfiguration?: Cors;
  CreatedDate?: Date;
  Description?: string;
  DisableSchemaValidation?: boolean;
  DisableExecuteApiEndpoint?: boolean;
  ImportInfo?: __listOf__string;
  IpAddressType?: string;
  Name?: string;
  ProtocolType?: string;
  RouteSelectionExpression?: string;
  Tags?: Tags;
  Version?: string;
  Warnings?: __listOf__string;
}
export const ReimportApiResponse = S.suspend(() =>
  S.Struct({
    ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
    ApiGatewayManaged: S.optional(S.Boolean).pipe(
      T.JsonName("apiGatewayManaged"),
    ),
    ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
    ApiKeySelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiKeySelectionExpression"),
    ),
    CorsConfiguration: S.optional(Cors)
      .pipe(T.JsonName("corsConfiguration"))
      .annotations({ identifier: "Cors" }),
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
  }),
).annotations({
  identifier: "ReimportApiResponse",
}) as any as S.Schema<ReimportApiResponse>;
export interface UpdateApiResponse {
  ApiEndpoint?: string;
  ApiGatewayManaged?: boolean;
  ApiId?: string;
  ApiKeySelectionExpression?: string;
  CorsConfiguration?: Cors;
  CreatedDate?: Date;
  Description?: string;
  DisableSchemaValidation?: boolean;
  DisableExecuteApiEndpoint?: boolean;
  ImportInfo?: __listOf__string;
  IpAddressType?: string;
  Name?: string;
  ProtocolType?: string;
  RouteSelectionExpression?: string;
  Tags?: Tags;
  Version?: string;
  Warnings?: __listOf__string;
}
export const UpdateApiResponse = S.suspend(() =>
  S.Struct({
    ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
    ApiGatewayManaged: S.optional(S.Boolean).pipe(
      T.JsonName("apiGatewayManaged"),
    ),
    ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
    ApiKeySelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiKeySelectionExpression"),
    ),
    CorsConfiguration: S.optional(Cors)
      .pipe(T.JsonName("corsConfiguration"))
      .annotations({ identifier: "Cors" }),
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
  }),
).annotations({
  identifier: "UpdateApiResponse",
}) as any as S.Schema<UpdateApiResponse>;
export interface UpdateApiMappingResponse {
  ApiId?: string;
  ApiMappingId?: string;
  ApiMappingKey?: string;
  Stage?: string;
}
export const UpdateApiMappingResponse = S.suspend(() =>
  S.Struct({
    ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
    ApiMappingId: S.optional(S.String).pipe(T.JsonName("apiMappingId")),
    ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
    Stage: S.optional(S.String).pipe(T.JsonName("stage")),
  }),
).annotations({
  identifier: "UpdateApiMappingResponse",
}) as any as S.Schema<UpdateApiMappingResponse>;
export interface UpdateAuthorizerResponse {
  AuthorizerCredentialsArn?: string;
  AuthorizerId?: string;
  AuthorizerPayloadFormatVersion?: string;
  AuthorizerResultTtlInSeconds?: number;
  AuthorizerType?: string;
  AuthorizerUri?: string;
  EnableSimpleResponses?: boolean;
  IdentitySource?: IdentitySourceList;
  IdentityValidationExpression?: string;
  JwtConfiguration?: JWTConfiguration;
  Name?: string;
}
export const UpdateAuthorizerResponse = S.suspend(() =>
  S.Struct({
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
    JwtConfiguration: S.optional(JWTConfiguration)
      .pipe(T.JsonName("jwtConfiguration"))
      .annotations({ identifier: "JWTConfiguration" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "UpdateAuthorizerResponse",
}) as any as S.Schema<UpdateAuthorizerResponse>;
export interface UpdateDeploymentResponse {
  AutoDeployed?: boolean;
  CreatedDate?: Date;
  DeploymentId?: string;
  DeploymentStatus?: string;
  DeploymentStatusMessage?: string;
  Description?: string;
}
export const UpdateDeploymentResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "UpdateDeploymentResponse",
}) as any as S.Schema<UpdateDeploymentResponse>;
export interface MutualTlsAuthentication {
  TruststoreUri?: string;
  TruststoreVersion?: string;
  TruststoreWarnings?: __listOf__string;
}
export const MutualTlsAuthentication = S.suspend(() =>
  S.Struct({
    TruststoreUri: S.optional(S.String).pipe(T.JsonName("truststoreUri")),
    TruststoreVersion: S.optional(S.String).pipe(
      T.JsonName("truststoreVersion"),
    ),
    TruststoreWarnings: S.optional(__listOf__string).pipe(
      T.JsonName("truststoreWarnings"),
    ),
  }),
).annotations({
  identifier: "MutualTlsAuthentication",
}) as any as S.Schema<MutualTlsAuthentication>;
export interface UpdateDomainNameResponse {
  ApiMappingSelectionExpression?: string;
  DomainName?: string;
  DomainNameArn?: string;
  DomainNameConfigurations?: DomainNameConfigurations;
  MutualTlsAuthentication?: MutualTlsAuthentication;
  RoutingMode?: string;
  Tags?: Tags;
}
export const UpdateDomainNameResponse = S.suspend(() =>
  S.Struct({
    ApiMappingSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiMappingSelectionExpression"),
    ),
    DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
    DomainNameArn: S.optional(S.String).pipe(T.JsonName("domainNameArn")),
    DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
      T.JsonName("domainNameConfigurations"),
    ),
    MutualTlsAuthentication: S.optional(MutualTlsAuthentication)
      .pipe(T.JsonName("mutualTlsAuthentication"))
      .annotations({ identifier: "MutualTlsAuthentication" }),
    RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateDomainNameResponse",
}) as any as S.Schema<UpdateDomainNameResponse>;
export interface TlsConfig {
  ServerNameToVerify?: string;
}
export const TlsConfig = S.suspend(() =>
  S.Struct({
    ServerNameToVerify: S.optional(S.String).pipe(
      T.JsonName("serverNameToVerify"),
    ),
  }),
).annotations({ identifier: "TlsConfig" }) as any as S.Schema<TlsConfig>;
export interface UpdateIntegrationResult {
  ApiGatewayManaged?: boolean;
  ConnectionId?: string;
  ConnectionType?: string;
  ContentHandlingStrategy?: string;
  CredentialsArn?: string;
  Description?: string;
  IntegrationId?: string;
  IntegrationMethod?: string;
  IntegrationResponseSelectionExpression?: string;
  IntegrationSubtype?: string;
  IntegrationType?: string;
  IntegrationUri?: string;
  PassthroughBehavior?: string;
  PayloadFormatVersion?: string;
  RequestParameters?: IntegrationParameters;
  RequestTemplates?: TemplateMap;
  ResponseParameters?: ResponseParameters;
  TemplateSelectionExpression?: string;
  TimeoutInMillis?: number;
  TlsConfig?: TlsConfig;
}
export const UpdateIntegrationResult = S.suspend(() =>
  S.Struct({
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
    IntegrationMethod: S.optional(S.String).pipe(
      T.JsonName("integrationMethod"),
    ),
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
    TlsConfig: S.optional(TlsConfig)
      .pipe(T.JsonName("tlsConfig"))
      .annotations({ identifier: "TlsConfig" }),
  }),
).annotations({
  identifier: "UpdateIntegrationResult",
}) as any as S.Schema<UpdateIntegrationResult>;
export interface UpdateIntegrationResponseResponse {
  ContentHandlingStrategy?: string;
  IntegrationResponseId?: string;
  IntegrationResponseKey?: string;
  ResponseParameters?: IntegrationParameters;
  ResponseTemplates?: TemplateMap;
  TemplateSelectionExpression?: string;
}
export const UpdateIntegrationResponseResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "UpdateIntegrationResponseResponse",
}) as any as S.Schema<UpdateIntegrationResponseResponse>;
export interface UpdateModelResponse {
  ContentType?: string;
  Description?: string;
  ModelId?: string;
  Name?: string;
  Schema?: string;
}
export const UpdateModelResponse = S.suspend(() =>
  S.Struct({
    ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    ModelId: S.optional(S.String).pipe(T.JsonName("modelId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Schema: S.optional(S.String).pipe(T.JsonName("schema")),
  }),
).annotations({
  identifier: "UpdateModelResponse",
}) as any as S.Schema<UpdateModelResponse>;
export interface EndpointConfigurationResponse {
  CertificateArn?: string;
  DomainName?: string;
  PortalDefaultDomainName: string;
  PortalDomainHostedZoneId: string;
}
export const EndpointConfigurationResponse = S.suspend(() =>
  S.Struct({
    CertificateArn: S.optional(S.String).pipe(T.JsonName("certificateArn")),
    DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
    PortalDefaultDomainName: S.String.pipe(
      T.JsonName("portalDefaultDomainName"),
    ),
    PortalDomainHostedZoneId: S.String.pipe(
      T.JsonName("portalDomainHostedZoneId"),
    ),
  }),
).annotations({
  identifier: "EndpointConfigurationResponse",
}) as any as S.Schema<EndpointConfigurationResponse>;
export interface StatusException {
  Exception?: string;
  Message?: string;
}
export const StatusException = S.suspend(() =>
  S.Struct({
    Exception: S.optional(S.String).pipe(T.JsonName("exception")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  }),
).annotations({
  identifier: "StatusException",
}) as any as S.Schema<StatusException>;
export interface Preview {
  PreviewStatus: string;
  PreviewUrl?: string;
  StatusException?: StatusException;
}
export const Preview = S.suspend(() =>
  S.Struct({
    PreviewStatus: S.String.pipe(T.JsonName("previewStatus")),
    PreviewUrl: S.optional(S.String).pipe(T.JsonName("previewUrl")),
    StatusException: S.optional(StatusException)
      .pipe(T.JsonName("statusException"))
      .annotations({ identifier: "StatusException" }),
  }),
).annotations({ identifier: "Preview" }) as any as S.Schema<Preview>;
export interface UpdatePortalResponse {
  Authorization?: Authorization;
  EndpointConfiguration?: EndpointConfigurationResponse;
  IncludedPortalProductArns?: __listOf__stringMin20Max2048;
  LastModified?: Date;
  LastPublished?: Date;
  LastPublishedDescription?: string;
  PortalArn?: string;
  PortalContent?: PortalContent;
  PortalId?: string;
  Preview?: Preview;
  PublishStatus?: string;
  RumAppMonitorName?: string;
  StatusException?: StatusException;
  Tags?: Tags;
}
export const UpdatePortalResponse = S.suspend(() =>
  S.Struct({
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    EndpointConfiguration: S.optional(EndpointConfigurationResponse)
      .pipe(T.JsonName("endpointConfiguration"))
      .annotations({ identifier: "EndpointConfigurationResponse" }),
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
    PortalContent: S.optional(PortalContent)
      .pipe(T.JsonName("portalContent"))
      .annotations({ identifier: "PortalContent" }),
    PortalId: S.optional(S.String).pipe(T.JsonName("portalId")),
    Preview: S.optional(Preview)
      .pipe(T.JsonName("preview"))
      .annotations({ identifier: "Preview" }),
    PublishStatus: S.optional(S.String).pipe(T.JsonName("publishStatus")),
    RumAppMonitorName: S.optional(S.String).pipe(
      T.JsonName("rumAppMonitorName"),
    ),
    StatusException: S.optional(StatusException)
      .pipe(T.JsonName("statusException"))
      .annotations({ identifier: "StatusException" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdatePortalResponse",
}) as any as S.Schema<UpdatePortalResponse>;
export interface UpdateProductPageResponse {
  DisplayContent?: DisplayContent;
  LastModified?: Date;
  ProductPageArn?: string;
  ProductPageId?: string;
}
export const UpdateProductPageResponse = S.suspend(() =>
  S.Struct({
    DisplayContent: S.optional(DisplayContent)
      .pipe(T.JsonName("displayContent"))
      .annotations({ identifier: "DisplayContent" }),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastModified"),
    ),
    ProductPageArn: S.optional(S.String).pipe(T.JsonName("productPageArn")),
    ProductPageId: S.optional(S.String).pipe(T.JsonName("productPageId")),
  }),
).annotations({
  identifier: "UpdateProductPageResponse",
}) as any as S.Schema<UpdateProductPageResponse>;
export interface EndpointDisplayContentResponse {
  Body?: string;
  Endpoint: string;
  OperationName?: string;
}
export const EndpointDisplayContentResponse = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String).pipe(T.JsonName("body")),
    Endpoint: S.String.pipe(T.JsonName("endpoint")),
    OperationName: S.optional(S.String).pipe(T.JsonName("operationName")),
  }),
).annotations({
  identifier: "EndpointDisplayContentResponse",
}) as any as S.Schema<EndpointDisplayContentResponse>;
export interface IdentifierParts {
  Method: string;
  Path: string;
  RestApiId: string;
  Stage: string;
}
export const IdentifierParts = S.suspend(() =>
  S.Struct({
    Method: S.String.pipe(T.JsonName("method")),
    Path: S.String.pipe(T.JsonName("path")),
    RestApiId: S.String.pipe(T.JsonName("restApiId")),
    Stage: S.String.pipe(T.JsonName("stage")),
  }),
).annotations({
  identifier: "IdentifierParts",
}) as any as S.Schema<IdentifierParts>;
export interface RestEndpointIdentifier {
  IdentifierParts?: IdentifierParts;
}
export const RestEndpointIdentifier = S.suspend(() =>
  S.Struct({
    IdentifierParts: S.optional(IdentifierParts)
      .pipe(T.JsonName("identifierParts"))
      .annotations({ identifier: "IdentifierParts" }),
  }),
).annotations({
  identifier: "RestEndpointIdentifier",
}) as any as S.Schema<RestEndpointIdentifier>;
export interface UpdateProductRestEndpointPageResponse {
  DisplayContent?: EndpointDisplayContentResponse;
  LastModified?: Date;
  ProductRestEndpointPageArn?: string;
  ProductRestEndpointPageId?: string;
  RestEndpointIdentifier?: RestEndpointIdentifier;
  Status?: string;
  StatusException?: StatusException;
  TryItState?: string;
}
export const UpdateProductRestEndpointPageResponse = S.suspend(() =>
  S.Struct({
    DisplayContent: S.optional(EndpointDisplayContentResponse)
      .pipe(T.JsonName("displayContent"))
      .annotations({ identifier: "EndpointDisplayContentResponse" }),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastModified"),
    ),
    ProductRestEndpointPageArn: S.optional(S.String).pipe(
      T.JsonName("productRestEndpointPageArn"),
    ),
    ProductRestEndpointPageId: S.optional(S.String).pipe(
      T.JsonName("productRestEndpointPageId"),
    ),
    RestEndpointIdentifier: S.optional(RestEndpointIdentifier)
      .pipe(T.JsonName("restEndpointIdentifier"))
      .annotations({ identifier: "RestEndpointIdentifier" }),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    StatusException: S.optional(StatusException)
      .pipe(T.JsonName("statusException"))
      .annotations({ identifier: "StatusException" }),
    TryItState: S.optional(S.String).pipe(T.JsonName("tryItState")),
  }),
).annotations({
  identifier: "UpdateProductRestEndpointPageResponse",
}) as any as S.Schema<UpdateProductRestEndpointPageResponse>;
export interface UpdateRouteResult {
  ApiGatewayManaged?: boolean;
  ApiKeyRequired?: boolean;
  AuthorizationScopes?: AuthorizationScopes;
  AuthorizationType?: string;
  AuthorizerId?: string;
  ModelSelectionExpression?: string;
  OperationName?: string;
  RequestModels?: RouteModels;
  RequestParameters?: RouteParameters;
  RouteId?: string;
  RouteKey?: string;
  RouteResponseSelectionExpression?: string;
  Target?: string;
}
export const UpdateRouteResult = S.suspend(() =>
  S.Struct({
    ApiGatewayManaged: S.optional(S.Boolean).pipe(
      T.JsonName("apiGatewayManaged"),
    ),
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
    RouteId: S.optional(S.String).pipe(T.JsonName("routeId")),
    RouteKey: S.optional(S.String).pipe(T.JsonName("routeKey")),
    RouteResponseSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("routeResponseSelectionExpression"),
    ),
    Target: S.optional(S.String).pipe(T.JsonName("target")),
  }),
).annotations({
  identifier: "UpdateRouteResult",
}) as any as S.Schema<UpdateRouteResult>;
export interface UpdateRouteResponseResponse {
  ModelSelectionExpression?: string;
  ResponseModels?: RouteModels;
  ResponseParameters?: RouteParameters;
  RouteResponseId?: string;
  RouteResponseKey?: string;
}
export const UpdateRouteResponseResponse = S.suspend(() =>
  S.Struct({
    ModelSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("modelSelectionExpression"),
    ),
    ResponseModels: S.optional(RouteModels).pipe(T.JsonName("responseModels")),
    ResponseParameters: S.optional(RouteParameters).pipe(
      T.JsonName("responseParameters"),
    ),
    RouteResponseId: S.optional(S.String).pipe(T.JsonName("routeResponseId")),
    RouteResponseKey: S.optional(S.String).pipe(T.JsonName("routeResponseKey")),
  }),
).annotations({
  identifier: "UpdateRouteResponseResponse",
}) as any as S.Schema<UpdateRouteResponseResponse>;
export interface UpdateStageResponse {
  AccessLogSettings?: AccessLogSettings;
  ApiGatewayManaged?: boolean;
  AutoDeploy?: boolean;
  ClientCertificateId?: string;
  CreatedDate?: Date;
  DefaultRouteSettings?: RouteSettings;
  DeploymentId?: string;
  Description?: string;
  LastDeploymentStatusMessage?: string;
  LastUpdatedDate?: Date;
  RouteSettings?: RouteSettingsMap;
  StageName?: string;
  StageVariables?: StageVariablesMap;
  Tags?: Tags;
}
export const UpdateStageResponse = S.suspend(() =>
  S.Struct({
    AccessLogSettings: S.optional(AccessLogSettings)
      .pipe(T.JsonName("accessLogSettings"))
      .annotations({ identifier: "AccessLogSettings" }),
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
    DefaultRouteSettings: S.optional(RouteSettings)
      .pipe(T.JsonName("defaultRouteSettings"))
      .annotations({ identifier: "RouteSettings" }),
    DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    LastDeploymentStatusMessage: S.optional(S.String).pipe(
      T.JsonName("lastDeploymentStatusMessage"),
    ),
    LastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastUpdatedDate")),
    RouteSettings: S.optional(RouteSettingsMap).pipe(
      T.JsonName("routeSettings"),
    ),
    StageName: S.optional(S.String).pipe(T.JsonName("stageName")),
    StageVariables: S.optional(StageVariablesMap).pipe(
      T.JsonName("stageVariables"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateStageResponse",
}) as any as S.Schema<UpdateStageResponse>;
export interface UpdateVpcLinkResponse {
  CreatedDate?: Date;
  Name?: string;
  SecurityGroupIds?: SecurityGroupIdList;
  SubnetIds?: SubnetIdList;
  Tags?: Tags;
  VpcLinkId?: string;
  VpcLinkStatus?: string;
  VpcLinkStatusMessage?: string;
  VpcLinkVersion?: string;
}
export const UpdateVpcLinkResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "UpdateVpcLinkResponse",
}) as any as S.Schema<UpdateVpcLinkResponse>;
export interface ApiMapping {
  ApiId: string;
  ApiMappingId?: string;
  ApiMappingKey?: string;
  Stage: string;
}
export const ApiMapping = S.suspend(() =>
  S.Struct({
    ApiId: S.String.pipe(T.JsonName("apiId")),
    ApiMappingId: S.optional(S.String).pipe(T.JsonName("apiMappingId")),
    ApiMappingKey: S.optional(S.String).pipe(T.JsonName("apiMappingKey")),
    Stage: S.String.pipe(T.JsonName("stage")),
  }),
).annotations({ identifier: "ApiMapping" }) as any as S.Schema<ApiMapping>;
export type __listOfApiMapping = ApiMapping[];
export const __listOfApiMapping = S.Array(ApiMapping);
export interface Api {
  ApiEndpoint?: string;
  ApiGatewayManaged?: boolean;
  ApiId?: string;
  ApiKeySelectionExpression?: string;
  CorsConfiguration?: Cors;
  CreatedDate?: Date;
  Description?: string;
  DisableSchemaValidation?: boolean;
  DisableExecuteApiEndpoint?: boolean;
  ImportInfo?: __listOf__string;
  IpAddressType?: string;
  Name: string;
  ProtocolType: string;
  RouteSelectionExpression: string;
  Tags?: Tags;
  Version?: string;
  Warnings?: __listOf__string;
}
export const Api = S.suspend(() =>
  S.Struct({
    ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
    ApiGatewayManaged: S.optional(S.Boolean).pipe(
      T.JsonName("apiGatewayManaged"),
    ),
    ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
    ApiKeySelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiKeySelectionExpression"),
    ),
    CorsConfiguration: S.optional(Cors)
      .pipe(T.JsonName("corsConfiguration"))
      .annotations({ identifier: "Cors" }),
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
  }),
).annotations({ identifier: "Api" }) as any as S.Schema<Api>;
export type __listOfApi = Api[];
export const __listOfApi = S.Array(Api);
export interface Authorizer {
  AuthorizerCredentialsArn?: string;
  AuthorizerId?: string;
  AuthorizerPayloadFormatVersion?: string;
  AuthorizerResultTtlInSeconds?: number;
  AuthorizerType?: string;
  AuthorizerUri?: string;
  EnableSimpleResponses?: boolean;
  IdentitySource?: IdentitySourceList;
  IdentityValidationExpression?: string;
  JwtConfiguration?: JWTConfiguration;
  Name: string;
}
export const Authorizer = S.suspend(() =>
  S.Struct({
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
    JwtConfiguration: S.optional(JWTConfiguration)
      .pipe(T.JsonName("jwtConfiguration"))
      .annotations({ identifier: "JWTConfiguration" }),
    Name: S.String.pipe(T.JsonName("name")),
  }),
).annotations({ identifier: "Authorizer" }) as any as S.Schema<Authorizer>;
export type __listOfAuthorizer = Authorizer[];
export const __listOfAuthorizer = S.Array(Authorizer);
export interface Deployment {
  AutoDeployed?: boolean;
  CreatedDate?: Date;
  DeploymentId?: string;
  DeploymentStatus?: string;
  DeploymentStatusMessage?: string;
  Description?: string;
}
export const Deployment = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Deployment" }) as any as S.Schema<Deployment>;
export type __listOfDeployment = Deployment[];
export const __listOfDeployment = S.Array(Deployment);
export interface DomainName {
  ApiMappingSelectionExpression?: string;
  DomainName: string;
  DomainNameArn?: string;
  DomainNameConfigurations?: DomainNameConfigurations;
  MutualTlsAuthentication?: MutualTlsAuthentication;
  RoutingMode?: string;
  Tags?: Tags;
}
export const DomainName = S.suspend(() =>
  S.Struct({
    ApiMappingSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiMappingSelectionExpression"),
    ),
    DomainName: S.String.pipe(T.JsonName("domainName")),
    DomainNameArn: S.optional(S.String).pipe(T.JsonName("domainNameArn")),
    DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
      T.JsonName("domainNameConfigurations"),
    ),
    MutualTlsAuthentication: S.optional(MutualTlsAuthentication)
      .pipe(T.JsonName("mutualTlsAuthentication"))
      .annotations({ identifier: "MutualTlsAuthentication" }),
    RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({ identifier: "DomainName" }) as any as S.Schema<DomainName>;
export type __listOfDomainName = DomainName[];
export const __listOfDomainName = S.Array(DomainName);
export interface IntegrationResponse {
  ContentHandlingStrategy?: string;
  IntegrationResponseId?: string;
  IntegrationResponseKey: string;
  ResponseParameters?: IntegrationParameters;
  ResponseTemplates?: TemplateMap;
  TemplateSelectionExpression?: string;
}
export const IntegrationResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "IntegrationResponse",
}) as any as S.Schema<IntegrationResponse>;
export type __listOfIntegrationResponse = IntegrationResponse[];
export const __listOfIntegrationResponse = S.Array(IntegrationResponse);
export interface Integration {
  ApiGatewayManaged?: boolean;
  ConnectionId?: string;
  ConnectionType?: string;
  ContentHandlingStrategy?: string;
  CredentialsArn?: string;
  Description?: string;
  IntegrationId?: string;
  IntegrationMethod?: string;
  IntegrationResponseSelectionExpression?: string;
  IntegrationSubtype?: string;
  IntegrationType?: string;
  IntegrationUri?: string;
  PassthroughBehavior?: string;
  PayloadFormatVersion?: string;
  RequestParameters?: IntegrationParameters;
  RequestTemplates?: TemplateMap;
  ResponseParameters?: ResponseParameters;
  TemplateSelectionExpression?: string;
  TimeoutInMillis?: number;
  TlsConfig?: TlsConfig;
}
export const Integration = S.suspend(() =>
  S.Struct({
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
    IntegrationMethod: S.optional(S.String).pipe(
      T.JsonName("integrationMethod"),
    ),
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
    TlsConfig: S.optional(TlsConfig)
      .pipe(T.JsonName("tlsConfig"))
      .annotations({ identifier: "TlsConfig" }),
  }),
).annotations({ identifier: "Integration" }) as any as S.Schema<Integration>;
export type __listOfIntegration = Integration[];
export const __listOfIntegration = S.Array(Integration);
export interface Model {
  ContentType?: string;
  Description?: string;
  ModelId?: string;
  Name: string;
  Schema?: string;
}
export const Model = S.suspend(() =>
  S.Struct({
    ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    ModelId: S.optional(S.String).pipe(T.JsonName("modelId")),
    Name: S.String.pipe(T.JsonName("name")),
    Schema: S.optional(S.String).pipe(T.JsonName("schema")),
  }),
).annotations({ identifier: "Model" }) as any as S.Schema<Model>;
export type __listOfModel = Model[];
export const __listOfModel = S.Array(Model);
export interface RouteResponse {
  ModelSelectionExpression?: string;
  ResponseModels?: RouteModels;
  ResponseParameters?: RouteParameters;
  RouteResponseId?: string;
  RouteResponseKey: string;
}
export const RouteResponse = S.suspend(() =>
  S.Struct({
    ModelSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("modelSelectionExpression"),
    ),
    ResponseModels: S.optional(RouteModels).pipe(T.JsonName("responseModels")),
    ResponseParameters: S.optional(RouteParameters).pipe(
      T.JsonName("responseParameters"),
    ),
    RouteResponseId: S.optional(S.String).pipe(T.JsonName("routeResponseId")),
    RouteResponseKey: S.String.pipe(T.JsonName("routeResponseKey")),
  }),
).annotations({
  identifier: "RouteResponse",
}) as any as S.Schema<RouteResponse>;
export type __listOfRouteResponse = RouteResponse[];
export const __listOfRouteResponse = S.Array(RouteResponse);
export interface Route {
  ApiGatewayManaged?: boolean;
  ApiKeyRequired?: boolean;
  AuthorizationScopes?: AuthorizationScopes;
  AuthorizationType?: string;
  AuthorizerId?: string;
  ModelSelectionExpression?: string;
  OperationName?: string;
  RequestModels?: RouteModels;
  RequestParameters?: RouteParameters;
  RouteId?: string;
  RouteKey: string;
  RouteResponseSelectionExpression?: string;
  Target?: string;
}
export const Route = S.suspend(() =>
  S.Struct({
    ApiGatewayManaged: S.optional(S.Boolean).pipe(
      T.JsonName("apiGatewayManaged"),
    ),
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
    RouteId: S.optional(S.String).pipe(T.JsonName("routeId")),
    RouteKey: S.String.pipe(T.JsonName("routeKey")),
    RouteResponseSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("routeResponseSelectionExpression"),
    ),
    Target: S.optional(S.String).pipe(T.JsonName("target")),
  }),
).annotations({ identifier: "Route" }) as any as S.Schema<Route>;
export type __listOfRoute = Route[];
export const __listOfRoute = S.Array(Route);
export interface Stage {
  AccessLogSettings?: AccessLogSettings;
  ApiGatewayManaged?: boolean;
  AutoDeploy?: boolean;
  ClientCertificateId?: string;
  CreatedDate?: Date;
  DefaultRouteSettings?: RouteSettings;
  DeploymentId?: string;
  Description?: string;
  LastDeploymentStatusMessage?: string;
  LastUpdatedDate?: Date;
  RouteSettings?: RouteSettingsMap;
  StageName: string;
  StageVariables?: StageVariablesMap;
  Tags?: Tags;
}
export const Stage = S.suspend(() =>
  S.Struct({
    AccessLogSettings: S.optional(AccessLogSettings)
      .pipe(T.JsonName("accessLogSettings"))
      .annotations({ identifier: "AccessLogSettings" }),
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
    DefaultRouteSettings: S.optional(RouteSettings)
      .pipe(T.JsonName("defaultRouteSettings"))
      .annotations({ identifier: "RouteSettings" }),
    DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    LastDeploymentStatusMessage: S.optional(S.String).pipe(
      T.JsonName("lastDeploymentStatusMessage"),
    ),
    LastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastUpdatedDate")),
    RouteSettings: S.optional(RouteSettingsMap).pipe(
      T.JsonName("routeSettings"),
    ),
    StageName: S.String.pipe(T.JsonName("stageName")),
    StageVariables: S.optional(StageVariablesMap).pipe(
      T.JsonName("stageVariables"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({ identifier: "Stage" }) as any as S.Schema<Stage>;
export type __listOfStage = Stage[];
export const __listOfStage = S.Array(Stage);
export interface VpcLink {
  CreatedDate?: Date;
  Name: string;
  SecurityGroupIds: SecurityGroupIdList;
  SubnetIds: SubnetIdList;
  Tags?: Tags;
  VpcLinkId: string;
  VpcLinkStatus?: string;
  VpcLinkStatusMessage?: string;
  VpcLinkVersion?: string;
}
export const VpcLink = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "VpcLink" }) as any as S.Schema<VpcLink>;
export type __listOfVpcLink = VpcLink[];
export const __listOfVpcLink = S.Array(VpcLink);
export interface PortalProductSummary {
  Description: string;
  DisplayName: string;
  LastModified: Date;
  PortalProductArn: string;
  PortalProductId: string;
  Tags?: Tags;
}
export const PortalProductSummary = S.suspend(() =>
  S.Struct({
    Description: S.String.pipe(T.JsonName("description")),
    DisplayName: S.String.pipe(T.JsonName("displayName")),
    LastModified: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("lastModified"),
    ),
    PortalProductArn: S.String.pipe(T.JsonName("portalProductArn")),
    PortalProductId: S.String.pipe(T.JsonName("portalProductId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "PortalProductSummary",
}) as any as S.Schema<PortalProductSummary>;
export type __listOfPortalProductSummary = PortalProductSummary[];
export const __listOfPortalProductSummary = S.Array(PortalProductSummary);
export interface PortalSummary {
  Authorization: Authorization;
  EndpointConfiguration: EndpointConfigurationResponse;
  IncludedPortalProductArns: __listOf__stringMin20Max2048;
  LastModified: Date;
  LastPublished?: Date;
  LastPublishedDescription?: string;
  PortalArn: string;
  PortalContent: PortalContent;
  PortalId: string;
  Preview?: Preview;
  PublishStatus?: string;
  RumAppMonitorName?: string;
  StatusException?: StatusException;
  Tags?: Tags;
}
export const PortalSummary = S.suspend(() =>
  S.Struct({
    Authorization: Authorization.pipe(T.JsonName("authorization")).annotations({
      identifier: "Authorization",
    }),
    EndpointConfiguration: EndpointConfigurationResponse.pipe(
      T.JsonName("endpointConfiguration"),
    ).annotations({ identifier: "EndpointConfigurationResponse" }),
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
    PortalContent: PortalContent.pipe(T.JsonName("portalContent")).annotations({
      identifier: "PortalContent",
    }),
    PortalId: S.String.pipe(T.JsonName("portalId")),
    Preview: S.optional(Preview)
      .pipe(T.JsonName("preview"))
      .annotations({ identifier: "Preview" }),
    PublishStatus: S.optional(S.String).pipe(T.JsonName("publishStatus")),
    RumAppMonitorName: S.optional(S.String).pipe(
      T.JsonName("rumAppMonitorName"),
    ),
    StatusException: S.optional(StatusException)
      .pipe(T.JsonName("statusException"))
      .annotations({ identifier: "StatusException" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "PortalSummary",
}) as any as S.Schema<PortalSummary>;
export type __listOfPortalSummary = PortalSummary[];
export const __listOfPortalSummary = S.Array(PortalSummary);
export interface ProductPageSummaryNoBody {
  LastModified: Date;
  PageTitle: string;
  ProductPageArn: string;
  ProductPageId: string;
}
export const ProductPageSummaryNoBody = S.suspend(() =>
  S.Struct({
    LastModified: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.JsonName("lastModified"),
    ),
    PageTitle: S.String.pipe(T.JsonName("pageTitle")),
    ProductPageArn: S.String.pipe(T.JsonName("productPageArn")),
    ProductPageId: S.String.pipe(T.JsonName("productPageId")),
  }),
).annotations({
  identifier: "ProductPageSummaryNoBody",
}) as any as S.Schema<ProductPageSummaryNoBody>;
export type __listOfProductPageSummaryNoBody = ProductPageSummaryNoBody[];
export const __listOfProductPageSummaryNoBody = S.Array(
  ProductPageSummaryNoBody,
);
export interface ProductRestEndpointPageSummaryNoBody {
  Endpoint: string;
  LastModified: Date;
  OperationName?: string;
  ProductRestEndpointPageArn: string;
  ProductRestEndpointPageId: string;
  RestEndpointIdentifier: RestEndpointIdentifier;
  Status: string;
  StatusException?: StatusException;
  TryItState: string;
}
export const ProductRestEndpointPageSummaryNoBody = S.suspend(() =>
  S.Struct({
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
    ).annotations({ identifier: "RestEndpointIdentifier" }),
    Status: S.String.pipe(T.JsonName("status")),
    StatusException: S.optional(StatusException)
      .pipe(T.JsonName("statusException"))
      .annotations({ identifier: "StatusException" }),
    TryItState: S.String.pipe(T.JsonName("tryItState")),
  }),
).annotations({
  identifier: "ProductRestEndpointPageSummaryNoBody",
}) as any as S.Schema<ProductRestEndpointPageSummaryNoBody>;
export type __listOfProductRestEndpointPageSummaryNoBody =
  ProductRestEndpointPageSummaryNoBody[];
export const __listOfProductRestEndpointPageSummaryNoBody = S.Array(
  ProductRestEndpointPageSummaryNoBody,
);
export interface RoutingRule {
  Actions?: __listOfRoutingRuleAction;
  Conditions?: __listOfRoutingRuleCondition;
  Priority?: number;
  RoutingRuleArn?: string;
  RoutingRuleId?: string;
}
export const RoutingRule = S.suspend(() =>
  S.Struct({
    Actions: S.optional(__listOfRoutingRuleAction).pipe(T.JsonName("actions")),
    Conditions: S.optional(__listOfRoutingRuleCondition).pipe(
      T.JsonName("conditions"),
    ),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    RoutingRuleArn: S.optional(S.String).pipe(T.JsonName("routingRuleArn")),
    RoutingRuleId: S.optional(S.String).pipe(T.JsonName("routingRuleId")),
  }),
).annotations({ identifier: "RoutingRule" }) as any as S.Schema<RoutingRule>;
export type __listOfRoutingRule = RoutingRule[];
export const __listOfRoutingRule = S.Array(RoutingRule);
export interface CreateApiResponse {
  ApiEndpoint?: string;
  ApiGatewayManaged?: boolean;
  ApiId?: string;
  ApiKeySelectionExpression?: string;
  CorsConfiguration?: Cors;
  CreatedDate?: Date;
  Description?: string;
  DisableSchemaValidation?: boolean;
  DisableExecuteApiEndpoint?: boolean;
  ImportInfo?: __listOf__string;
  IpAddressType?: string;
  Name?: string;
  ProtocolType?: string;
  RouteSelectionExpression?: string;
  Tags?: Tags;
  Version?: string;
  Warnings?: __listOf__string;
}
export const CreateApiResponse = S.suspend(() =>
  S.Struct({
    ApiEndpoint: S.optional(S.String).pipe(T.JsonName("apiEndpoint")),
    ApiGatewayManaged: S.optional(S.Boolean).pipe(
      T.JsonName("apiGatewayManaged"),
    ),
    ApiId: S.optional(S.String).pipe(T.JsonName("apiId")),
    ApiKeySelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiKeySelectionExpression"),
    ),
    CorsConfiguration: S.optional(Cors)
      .pipe(T.JsonName("corsConfiguration"))
      .annotations({ identifier: "Cors" }),
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
  }),
).annotations({
  identifier: "CreateApiResponse",
}) as any as S.Schema<CreateApiResponse>;
export interface CreateAuthorizerResponse {
  AuthorizerCredentialsArn?: string;
  AuthorizerId?: string;
  AuthorizerPayloadFormatVersion?: string;
  AuthorizerResultTtlInSeconds?: number;
  AuthorizerType?: string;
  AuthorizerUri?: string;
  EnableSimpleResponses?: boolean;
  IdentitySource?: IdentitySourceList;
  IdentityValidationExpression?: string;
  JwtConfiguration?: JWTConfiguration;
  Name?: string;
}
export const CreateAuthorizerResponse = S.suspend(() =>
  S.Struct({
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
    JwtConfiguration: S.optional(JWTConfiguration)
      .pipe(T.JsonName("jwtConfiguration"))
      .annotations({ identifier: "JWTConfiguration" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "CreateAuthorizerResponse",
}) as any as S.Schema<CreateAuthorizerResponse>;
export interface CreateDomainNameResponse {
  ApiMappingSelectionExpression?: string;
  DomainName?: string;
  DomainNameArn?: string;
  DomainNameConfigurations?: DomainNameConfigurations;
  MutualTlsAuthentication?: MutualTlsAuthentication;
  RoutingMode?: string;
  Tags?: Tags;
}
export const CreateDomainNameResponse = S.suspend(() =>
  S.Struct({
    ApiMappingSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiMappingSelectionExpression"),
    ),
    DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
    DomainNameArn: S.optional(S.String).pipe(T.JsonName("domainNameArn")),
    DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
      T.JsonName("domainNameConfigurations"),
    ),
    MutualTlsAuthentication: S.optional(MutualTlsAuthentication)
      .pipe(T.JsonName("mutualTlsAuthentication"))
      .annotations({ identifier: "MutualTlsAuthentication" }),
    RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateDomainNameResponse",
}) as any as S.Schema<CreateDomainNameResponse>;
export interface CreateIntegrationResult {
  ApiGatewayManaged?: boolean;
  ConnectionId?: string;
  ConnectionType?: string;
  ContentHandlingStrategy?: string;
  CredentialsArn?: string;
  Description?: string;
  IntegrationId?: string;
  IntegrationMethod?: string;
  IntegrationResponseSelectionExpression?: string;
  IntegrationSubtype?: string;
  IntegrationType?: string;
  IntegrationUri?: string;
  PassthroughBehavior?: string;
  PayloadFormatVersion?: string;
  RequestParameters?: IntegrationParameters;
  RequestTemplates?: TemplateMap;
  ResponseParameters?: ResponseParameters;
  TemplateSelectionExpression?: string;
  TimeoutInMillis?: number;
  TlsConfig?: TlsConfig;
}
export const CreateIntegrationResult = S.suspend(() =>
  S.Struct({
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
    IntegrationMethod: S.optional(S.String).pipe(
      T.JsonName("integrationMethod"),
    ),
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
    TlsConfig: S.optional(TlsConfig)
      .pipe(T.JsonName("tlsConfig"))
      .annotations({ identifier: "TlsConfig" }),
  }),
).annotations({
  identifier: "CreateIntegrationResult",
}) as any as S.Schema<CreateIntegrationResult>;
export interface CreateProductPageResponse {
  DisplayContent?: DisplayContent;
  LastModified?: Date;
  ProductPageArn?: string;
  ProductPageId?: string;
}
export const CreateProductPageResponse = S.suspend(() =>
  S.Struct({
    DisplayContent: S.optional(DisplayContent)
      .pipe(T.JsonName("displayContent"))
      .annotations({ identifier: "DisplayContent" }),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastModified"),
    ),
    ProductPageArn: S.optional(S.String).pipe(T.JsonName("productPageArn")),
    ProductPageId: S.optional(S.String).pipe(T.JsonName("productPageId")),
  }),
).annotations({
  identifier: "CreateProductPageResponse",
}) as any as S.Schema<CreateProductPageResponse>;
export interface CreateProductRestEndpointPageRequest {
  DisplayContent?: EndpointDisplayContent;
  PortalProductId: string;
  RestEndpointIdentifier: RestEndpointIdentifier;
  TryItState?: string;
}
export const CreateProductRestEndpointPageRequest = S.suspend(() =>
  S.Struct({
    DisplayContent: S.optional(EndpointDisplayContent)
      .pipe(T.JsonName("displayContent"))
      .annotations({ identifier: "EndpointDisplayContent" }),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
    RestEndpointIdentifier: RestEndpointIdentifier.pipe(
      T.JsonName("restEndpointIdentifier"),
    ).annotations({ identifier: "RestEndpointIdentifier" }),
    TryItState: S.optional(S.String).pipe(T.JsonName("tryItState")),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateProductRestEndpointPageRequest",
}) as any as S.Schema<CreateProductRestEndpointPageRequest>;
export interface CreateRouteRequest {
  ApiId: string;
  ApiKeyRequired?: boolean;
  AuthorizationScopes?: AuthorizationScopes;
  AuthorizationType?: string;
  AuthorizerId?: string;
  ModelSelectionExpression?: string;
  OperationName?: string;
  RequestModels?: RouteModels;
  RequestParameters?: RouteParameters;
  RouteKey: string;
  RouteResponseSelectionExpression?: string;
  Target?: string;
}
export const CreateRouteRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/apis/{ApiId}/routes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRouteRequest",
}) as any as S.Schema<CreateRouteRequest>;
export interface CreateStageResponse {
  AccessLogSettings?: AccessLogSettings;
  ApiGatewayManaged?: boolean;
  AutoDeploy?: boolean;
  ClientCertificateId?: string;
  CreatedDate?: Date;
  DefaultRouteSettings?: RouteSettings;
  DeploymentId?: string;
  Description?: string;
  LastDeploymentStatusMessage?: string;
  LastUpdatedDate?: Date;
  RouteSettings?: RouteSettingsMap;
  StageName?: string;
  StageVariables?: StageVariablesMap;
  Tags?: Tags;
}
export const CreateStageResponse = S.suspend(() =>
  S.Struct({
    AccessLogSettings: S.optional(AccessLogSettings)
      .pipe(T.JsonName("accessLogSettings"))
      .annotations({ identifier: "AccessLogSettings" }),
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
    DefaultRouteSettings: S.optional(RouteSettings)
      .pipe(T.JsonName("defaultRouteSettings"))
      .annotations({ identifier: "RouteSettings" }),
    DeploymentId: S.optional(S.String).pipe(T.JsonName("deploymentId")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    LastDeploymentStatusMessage: S.optional(S.String).pipe(
      T.JsonName("lastDeploymentStatusMessage"),
    ),
    LastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastUpdatedDate")),
    RouteSettings: S.optional(RouteSettingsMap).pipe(
      T.JsonName("routeSettings"),
    ),
    StageName: S.optional(S.String).pipe(T.JsonName("stageName")),
    StageVariables: S.optional(StageVariablesMap).pipe(
      T.JsonName("stageVariables"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateStageResponse",
}) as any as S.Schema<CreateStageResponse>;
export interface GetApiMappingsResponse {
  Items?: __listOfApiMapping;
  NextToken?: string;
}
export const GetApiMappingsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfApiMapping).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetApiMappingsResponse",
}) as any as S.Schema<GetApiMappingsResponse>;
export interface GetApisResponse {
  Items?: __listOfApi;
  NextToken?: string;
}
export const GetApisResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfApi).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetApisResponse",
}) as any as S.Schema<GetApisResponse>;
export interface GetAuthorizersResponse {
  Items?: __listOfAuthorizer;
  NextToken?: string;
}
export const GetAuthorizersResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfAuthorizer).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetAuthorizersResponse",
}) as any as S.Schema<GetAuthorizersResponse>;
export interface GetDeploymentsResponse {
  Items?: __listOfDeployment;
  NextToken?: string;
}
export const GetDeploymentsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfDeployment).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetDeploymentsResponse",
}) as any as S.Schema<GetDeploymentsResponse>;
export interface GetDomainNameResponse {
  ApiMappingSelectionExpression?: string;
  DomainName?: string;
  DomainNameArn?: string;
  DomainNameConfigurations?: DomainNameConfigurations;
  MutualTlsAuthentication?: MutualTlsAuthentication;
  RoutingMode?: string;
  Tags?: Tags;
}
export const GetDomainNameResponse = S.suspend(() =>
  S.Struct({
    ApiMappingSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("apiMappingSelectionExpression"),
    ),
    DomainName: S.optional(S.String).pipe(T.JsonName("domainName")),
    DomainNameArn: S.optional(S.String).pipe(T.JsonName("domainNameArn")),
    DomainNameConfigurations: S.optional(DomainNameConfigurations).pipe(
      T.JsonName("domainNameConfigurations"),
    ),
    MutualTlsAuthentication: S.optional(MutualTlsAuthentication)
      .pipe(T.JsonName("mutualTlsAuthentication"))
      .annotations({ identifier: "MutualTlsAuthentication" }),
    RoutingMode: S.optional(S.String).pipe(T.JsonName("routingMode")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetDomainNameResponse",
}) as any as S.Schema<GetDomainNameResponse>;
export interface GetDomainNamesResponse {
  Items?: __listOfDomainName;
  NextToken?: string;
}
export const GetDomainNamesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfDomainName).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetDomainNamesResponse",
}) as any as S.Schema<GetDomainNamesResponse>;
export interface GetIntegrationResult {
  ApiGatewayManaged?: boolean;
  ConnectionId?: string;
  ConnectionType?: string;
  ContentHandlingStrategy?: string;
  CredentialsArn?: string;
  Description?: string;
  IntegrationId?: string;
  IntegrationMethod?: string;
  IntegrationResponseSelectionExpression?: string;
  IntegrationSubtype?: string;
  IntegrationType?: string;
  IntegrationUri?: string;
  PassthroughBehavior?: string;
  PayloadFormatVersion?: string;
  RequestParameters?: IntegrationParameters;
  RequestTemplates?: TemplateMap;
  ResponseParameters?: ResponseParameters;
  TemplateSelectionExpression?: string;
  TimeoutInMillis?: number;
  TlsConfig?: TlsConfig;
}
export const GetIntegrationResult = S.suspend(() =>
  S.Struct({
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
    IntegrationMethod: S.optional(S.String).pipe(
      T.JsonName("integrationMethod"),
    ),
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
    TlsConfig: S.optional(TlsConfig)
      .pipe(T.JsonName("tlsConfig"))
      .annotations({ identifier: "TlsConfig" }),
  }),
).annotations({
  identifier: "GetIntegrationResult",
}) as any as S.Schema<GetIntegrationResult>;
export interface GetIntegrationResponsesResponse {
  Items?: __listOfIntegrationResponse;
  NextToken?: string;
}
export const GetIntegrationResponsesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfIntegrationResponse).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetIntegrationResponsesResponse",
}) as any as S.Schema<GetIntegrationResponsesResponse>;
export interface GetIntegrationsResponse {
  Items?: __listOfIntegration;
  NextToken?: string;
}
export const GetIntegrationsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfIntegration).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetIntegrationsResponse",
}) as any as S.Schema<GetIntegrationsResponse>;
export interface GetModelsResponse {
  Items?: __listOfModel;
  NextToken?: string;
}
export const GetModelsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfModel).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetModelsResponse",
}) as any as S.Schema<GetModelsResponse>;
export interface GetPortalResponse {
  Authorization?: Authorization;
  EndpointConfiguration?: EndpointConfigurationResponse;
  IncludedPortalProductArns?: __listOf__stringMin20Max2048;
  LastModified?: Date;
  LastPublished?: Date;
  LastPublishedDescription?: string;
  PortalArn?: string;
  PortalContent?: PortalContent;
  PortalId?: string;
  Preview?: Preview;
  PublishStatus?: string;
  RumAppMonitorName?: string;
  StatusException?: StatusException;
  Tags?: Tags;
}
export const GetPortalResponse = S.suspend(() =>
  S.Struct({
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    EndpointConfiguration: S.optional(EndpointConfigurationResponse)
      .pipe(T.JsonName("endpointConfiguration"))
      .annotations({ identifier: "EndpointConfigurationResponse" }),
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
    PortalContent: S.optional(PortalContent)
      .pipe(T.JsonName("portalContent"))
      .annotations({ identifier: "PortalContent" }),
    PortalId: S.optional(S.String).pipe(T.JsonName("portalId")),
    Preview: S.optional(Preview)
      .pipe(T.JsonName("preview"))
      .annotations({ identifier: "Preview" }),
    PublishStatus: S.optional(S.String).pipe(T.JsonName("publishStatus")),
    RumAppMonitorName: S.optional(S.String).pipe(
      T.JsonName("rumAppMonitorName"),
    ),
    StatusException: S.optional(StatusException)
      .pipe(T.JsonName("statusException"))
      .annotations({ identifier: "StatusException" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetPortalResponse",
}) as any as S.Schema<GetPortalResponse>;
export interface GetProductRestEndpointPageResponse {
  DisplayContent?: EndpointDisplayContentResponse;
  LastModified?: Date;
  ProductRestEndpointPageArn?: string;
  ProductRestEndpointPageId?: string;
  RawDisplayContent?: string;
  RestEndpointIdentifier?: RestEndpointIdentifier;
  Status?: string;
  StatusException?: StatusException;
  TryItState?: string;
}
export const GetProductRestEndpointPageResponse = S.suspend(() =>
  S.Struct({
    DisplayContent: S.optional(EndpointDisplayContentResponse)
      .pipe(T.JsonName("displayContent"))
      .annotations({ identifier: "EndpointDisplayContentResponse" }),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastModified"),
    ),
    ProductRestEndpointPageArn: S.optional(S.String).pipe(
      T.JsonName("productRestEndpointPageArn"),
    ),
    ProductRestEndpointPageId: S.optional(S.String).pipe(
      T.JsonName("productRestEndpointPageId"),
    ),
    RawDisplayContent: S.optional(S.String).pipe(
      T.JsonName("rawDisplayContent"),
    ),
    RestEndpointIdentifier: S.optional(RestEndpointIdentifier)
      .pipe(T.JsonName("restEndpointIdentifier"))
      .annotations({ identifier: "RestEndpointIdentifier" }),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    StatusException: S.optional(StatusException)
      .pipe(T.JsonName("statusException"))
      .annotations({ identifier: "StatusException" }),
    TryItState: S.optional(S.String).pipe(T.JsonName("tryItState")),
  }),
).annotations({
  identifier: "GetProductRestEndpointPageResponse",
}) as any as S.Schema<GetProductRestEndpointPageResponse>;
export interface GetRouteResponsesResponse {
  Items?: __listOfRouteResponse;
  NextToken?: string;
}
export const GetRouteResponsesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfRouteResponse).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetRouteResponsesResponse",
}) as any as S.Schema<GetRouteResponsesResponse>;
export interface GetRoutesResponse {
  Items?: __listOfRoute;
  NextToken?: string;
}
export const GetRoutesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfRoute).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetRoutesResponse",
}) as any as S.Schema<GetRoutesResponse>;
export interface GetStagesResponse {
  Items?: __listOfStage;
  NextToken?: string;
}
export const GetStagesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfStage).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetStagesResponse",
}) as any as S.Schema<GetStagesResponse>;
export interface GetVpcLinksResponse {
  Items?: __listOfVpcLink;
  NextToken?: string;
}
export const GetVpcLinksResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfVpcLink).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "GetVpcLinksResponse",
}) as any as S.Schema<GetVpcLinksResponse>;
export interface ListPortalProductsResponse {
  Items?: __listOfPortalProductSummary;
  NextToken?: string;
}
export const ListPortalProductsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfPortalProductSummary).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListPortalProductsResponse",
}) as any as S.Schema<ListPortalProductsResponse>;
export interface ListPortalsResponse {
  Items?: __listOfPortalSummary;
  NextToken?: string;
}
export const ListPortalsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfPortalSummary).pipe(T.JsonName("items")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListPortalsResponse",
}) as any as S.Schema<ListPortalsResponse>;
export interface ListProductPagesResponse {
  Items?: __listOfProductPageSummaryNoBody;
  NextToken?: string;
}
export const ListProductPagesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfProductPageSummaryNoBody).pipe(
      T.JsonName("items"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListProductPagesResponse",
}) as any as S.Schema<ListProductPagesResponse>;
export interface ListProductRestEndpointPagesResponse {
  Items?: __listOfProductRestEndpointPageSummaryNoBody;
  NextToken?: string;
}
export const ListProductRestEndpointPagesResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(__listOfProductRestEndpointPageSummaryNoBody).pipe(
      T.JsonName("items"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListProductRestEndpointPagesResponse",
}) as any as S.Schema<ListProductRestEndpointPagesResponse>;
export interface ListRoutingRulesResponse {
  NextToken?: string;
  RoutingRules?: __listOfRoutingRule;
}
export const ListRoutingRulesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    RoutingRules: S.optional(__listOfRoutingRule).pipe(
      T.JsonName("routingRules"),
    ),
  }),
).annotations({
  identifier: "ListRoutingRulesResponse",
}) as any as S.Schema<ListRoutingRulesResponse>;
export interface UpdatePortalProductRequest {
  Description?: string;
  DisplayName?: string;
  DisplayOrder?: DisplayOrder;
  PortalProductId: string;
}
export const UpdatePortalProductRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DisplayName: S.optional(S.String).pipe(T.JsonName("displayName")),
    DisplayOrder: S.optional(DisplayOrder)
      .pipe(T.JsonName("displayOrder"))
      .annotations({ identifier: "DisplayOrder" }),
    PortalProductId: S.String.pipe(T.HttpLabel("PortalProductId")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v2/portalproducts/{PortalProductId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePortalProductRequest",
}) as any as S.Schema<UpdatePortalProductRequest>;
export interface CreatePortalRequest {
  Authorization: Authorization;
  EndpointConfiguration: EndpointConfigurationRequest;
  IncludedPortalProductArns?: __listOf__stringMin20Max2048;
  LogoUri?: string;
  PortalContent: PortalContent;
  RumAppMonitorName?: string;
  Tags?: Tags;
}
export const CreatePortalRequest = S.suspend(() =>
  S.Struct({
    Authorization: Authorization.pipe(T.JsonName("authorization")).annotations({
      identifier: "Authorization",
    }),
    EndpointConfiguration: EndpointConfigurationRequest.pipe(
      T.JsonName("endpointConfiguration"),
    ).annotations({ identifier: "EndpointConfigurationRequest" }),
    IncludedPortalProductArns: S.optional(__listOf__stringMin20Max2048).pipe(
      T.JsonName("includedPortalProductArns"),
    ),
    LogoUri: S.optional(S.String).pipe(T.JsonName("logoUri")),
    PortalContent: PortalContent.pipe(T.JsonName("portalContent")).annotations({
      identifier: "PortalContent",
    }),
    RumAppMonitorName: S.optional(S.String).pipe(
      T.JsonName("rumAppMonitorName"),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/portals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePortalRequest",
}) as any as S.Schema<CreatePortalRequest>;
export interface CreateProductRestEndpointPageResponse {
  DisplayContent?: EndpointDisplayContentResponse;
  LastModified?: Date;
  ProductRestEndpointPageArn?: string;
  ProductRestEndpointPageId?: string;
  RestEndpointIdentifier?: RestEndpointIdentifier;
  Status?: string;
  StatusException?: StatusException;
  TryItState?: string;
}
export const CreateProductRestEndpointPageResponse = S.suspend(() =>
  S.Struct({
    DisplayContent: S.optional(EndpointDisplayContentResponse)
      .pipe(T.JsonName("displayContent"))
      .annotations({ identifier: "EndpointDisplayContentResponse" }),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastModified"),
    ),
    ProductRestEndpointPageArn: S.optional(S.String).pipe(
      T.JsonName("productRestEndpointPageArn"),
    ),
    ProductRestEndpointPageId: S.optional(S.String).pipe(
      T.JsonName("productRestEndpointPageId"),
    ),
    RestEndpointIdentifier: S.optional(RestEndpointIdentifier)
      .pipe(T.JsonName("restEndpointIdentifier"))
      .annotations({ identifier: "RestEndpointIdentifier" }),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    StatusException: S.optional(StatusException)
      .pipe(T.JsonName("statusException"))
      .annotations({ identifier: "StatusException" }),
    TryItState: S.optional(S.String).pipe(T.JsonName("tryItState")),
  }),
).annotations({
  identifier: "CreateProductRestEndpointPageResponse",
}) as any as S.Schema<CreateProductRestEndpointPageResponse>;
export interface CreateRouteResult {
  ApiGatewayManaged?: boolean;
  ApiKeyRequired?: boolean;
  AuthorizationScopes?: AuthorizationScopes;
  AuthorizationType?: string;
  AuthorizerId?: string;
  ModelSelectionExpression?: string;
  OperationName?: string;
  RequestModels?: RouteModels;
  RequestParameters?: RouteParameters;
  RouteId?: string;
  RouteKey?: string;
  RouteResponseSelectionExpression?: string;
  Target?: string;
}
export const CreateRouteResult = S.suspend(() =>
  S.Struct({
    ApiGatewayManaged: S.optional(S.Boolean).pipe(
      T.JsonName("apiGatewayManaged"),
    ),
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
    RouteId: S.optional(S.String).pipe(T.JsonName("routeId")),
    RouteKey: S.optional(S.String).pipe(T.JsonName("routeKey")),
    RouteResponseSelectionExpression: S.optional(S.String).pipe(
      T.JsonName("routeResponseSelectionExpression"),
    ),
    Target: S.optional(S.String).pipe(T.JsonName("target")),
  }),
).annotations({
  identifier: "CreateRouteResult",
}) as any as S.Schema<CreateRouteResult>;
export interface CreateRoutingRuleRequest {
  Actions: __listOfRoutingRuleAction;
  Conditions: __listOfRoutingRuleCondition;
  DomainName: string;
  DomainNameId?: string;
  Priority: number;
}
export const CreateRoutingRuleRequest = S.suspend(() =>
  S.Struct({
    Actions: __listOfRoutingRuleAction.pipe(T.JsonName("actions")),
    Conditions: __listOfRoutingRuleCondition.pipe(T.JsonName("conditions")),
    DomainName: S.String.pipe(T.HttpLabel("DomainName")),
    DomainNameId: S.optional(S.String).pipe(T.HttpQuery("domainNameId")),
    Priority: S.Number.pipe(T.JsonName("priority")),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateRoutingRuleRequest",
}) as any as S.Schema<CreateRoutingRuleRequest>;
export interface UpdatePortalProductResponse {
  Description?: string;
  DisplayName?: string;
  DisplayOrder?: DisplayOrder;
  LastModified?: Date;
  PortalProductArn?: string;
  PortalProductId?: string;
  Tags?: Tags;
}
export const UpdatePortalProductResponse = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DisplayName: S.optional(S.String).pipe(T.JsonName("displayName")),
    DisplayOrder: S.optional(DisplayOrder)
      .pipe(T.JsonName("displayOrder"))
      .annotations({ identifier: "DisplayOrder" }),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastModified"),
    ),
    PortalProductArn: S.optional(S.String).pipe(T.JsonName("portalProductArn")),
    PortalProductId: S.optional(S.String).pipe(T.JsonName("portalProductId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdatePortalProductResponse",
}) as any as S.Schema<UpdatePortalProductResponse>;
export interface CreatePortalResponse {
  Authorization?: Authorization;
  EndpointConfiguration?: EndpointConfigurationResponse;
  IncludedPortalProductArns?: __listOf__stringMin20Max2048;
  LastModified?: Date;
  LastPublished?: Date;
  LastPublishedDescription?: string;
  PortalArn?: string;
  PortalContent?: PortalContent;
  PortalId?: string;
  PublishStatus?: string;
  RumAppMonitorName?: string;
  StatusException?: StatusException;
  Tags?: Tags;
}
export const CreatePortalResponse = S.suspend(() =>
  S.Struct({
    Authorization: S.optional(Authorization)
      .pipe(T.JsonName("authorization"))
      .annotations({ identifier: "Authorization" }),
    EndpointConfiguration: S.optional(EndpointConfigurationResponse)
      .pipe(T.JsonName("endpointConfiguration"))
      .annotations({ identifier: "EndpointConfigurationResponse" }),
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
    PortalContent: S.optional(PortalContent)
      .pipe(T.JsonName("portalContent"))
      .annotations({ identifier: "PortalContent" }),
    PortalId: S.optional(S.String).pipe(T.JsonName("portalId")),
    PublishStatus: S.optional(S.String).pipe(T.JsonName("publishStatus")),
    RumAppMonitorName: S.optional(S.String).pipe(
      T.JsonName("rumAppMonitorName"),
    ),
    StatusException: S.optional(StatusException)
      .pipe(T.JsonName("statusException"))
      .annotations({ identifier: "StatusException" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreatePortalResponse",
}) as any as S.Schema<CreatePortalResponse>;
export interface CreateRoutingRuleResponse {
  Actions?: __listOfRoutingRuleAction;
  Conditions?: __listOfRoutingRuleCondition;
  Priority?: number;
  RoutingRuleArn?: string;
  RoutingRuleId?: string;
}
export const CreateRoutingRuleResponse = S.suspend(() =>
  S.Struct({
    Actions: S.optional(__listOfRoutingRuleAction).pipe(T.JsonName("actions")),
    Conditions: S.optional(__listOfRoutingRuleCondition).pipe(
      T.JsonName("conditions"),
    ),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
    RoutingRuleArn: S.optional(S.String).pipe(T.JsonName("routingRuleArn")),
    RoutingRuleId: S.optional(S.String).pipe(T.JsonName("routingRuleId")),
  }),
).annotations({
  identifier: "CreateRoutingRuleResponse",
}) as any as S.Schema<CreateRoutingRuleResponse>;

//# Errors
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    ResourceType: S.optional(S.String).pipe(T.JsonName("resourceType")),
  },
).pipe(C.withBadRequestError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withAuthError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {
    LimitType: S.optional(S.String).pipe(T.JsonName("limitType")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withThrottlingError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withConflictError) {}

//# Operations
/**
 * Deletes the AccessLogSettings for a Stage. To disable access logging for a Stage, delete its AccessLogSettings.
 */
export const deleteAccessLogSettings: (
  input: DeleteAccessLogSettingsRequest,
) => Effect.Effect<
  DeleteAccessLogSettingsResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessLogSettingsRequest,
  output: DeleteAccessLogSettingsResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets API mappings.
 */
export const getApiMappings: (
  input: GetApiMappingsRequest,
) => Effect.Effect<
  GetApiMappingsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApiMappingsRequest,
  output: GetApiMappingsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a collection of Api resources.
 */
export const getApis: (
  input: GetApisRequest,
) => Effect.Effect<
  GetApisResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApisRequest,
  output: GetApisResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the Authorizers for an API.
 */
export const getAuthorizers: (
  input: GetAuthorizersRequest,
) => Effect.Effect<
  GetAuthorizersResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAuthorizersRequest,
  output: GetAuthorizersResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the Deployments for an API.
 */
export const getDeployments: (
  input: GetDeploymentsRequest,
) => Effect.Effect<
  GetDeploymentsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentsRequest,
  output: GetDeploymentsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a domain name.
 */
export const getDomainName: (
  input: GetDomainNameRequest,
) => Effect.Effect<
  GetDomainNameResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainNameRequest,
  output: GetDomainNameResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the domain names for an AWS account.
 */
export const getDomainNames: (
  input: GetDomainNamesRequest,
) => Effect.Effect<
  GetDomainNamesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainNamesRequest,
  output: GetDomainNamesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets an Integration.
 */
export const getIntegration: (
  input: GetIntegrationRequest,
) => Effect.Effect<
  GetIntegrationResult,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntegrationRequest,
  output: GetIntegrationResult,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the IntegrationResponses for an Integration.
 */
export const getIntegrationResponses: (
  input: GetIntegrationResponsesRequest,
) => Effect.Effect<
  GetIntegrationResponsesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntegrationResponsesRequest,
  output: GetIntegrationResponsesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the Integrations for an API.
 */
export const getIntegrations: (
  input: GetIntegrationsRequest,
) => Effect.Effect<
  GetIntegrationsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntegrationsRequest,
  output: GetIntegrationsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the Models for an API.
 */
export const getModels: (
  input: GetModelsRequest,
) => Effect.Effect<
  GetModelsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelsRequest,
  output: GetModelsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a portal.
 */
export const getPortal: (
  input: GetPortalRequest,
) => Effect.Effect<
  GetPortalResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getProductRestEndpointPage: (
  input: GetProductRestEndpointPageRequest,
) => Effect.Effect<
  GetProductRestEndpointPageResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProductRestEndpointPageRequest,
  output: GetProductRestEndpointPageResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the RouteResponses for a Route.
 */
export const getRouteResponses: (
  input: GetRouteResponsesRequest,
) => Effect.Effect<
  GetRouteResponsesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouteResponsesRequest,
  output: GetRouteResponsesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the Routes for an API.
 */
export const getRoutes: (
  input: GetRoutesRequest,
) => Effect.Effect<
  GetRoutesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRoutesRequest,
  output: GetRoutesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets the Stages for an API.
 */
export const getStages: (
  input: GetStagesRequest,
) => Effect.Effect<
  GetStagesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStagesRequest,
  output: GetStagesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a collection of Tag resources.
 */
export const getTags: (
  input: GetTagsRequest,
) => Effect.Effect<
  GetTagsResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVpcLinks: (
  input: GetVpcLinksRequest,
) => Effect.Effect<
  GetVpcLinksResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVpcLinksRequest,
  output: GetVpcLinksResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Lists portal products.
 */
export const listPortalProducts: (
  input: ListPortalProductsRequest,
) => Effect.Effect<
  ListPortalProductsResponse,
  | AccessDeniedException
  | BadRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPortals: (
  input: ListPortalsRequest,
) => Effect.Effect<
  ListPortalsResponse,
  | AccessDeniedException
  | BadRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listProductPages: (
  input: ListProductPagesRequest,
) => Effect.Effect<
  ListProductPagesResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listProductRestEndpointPages: (
  input: ListProductRestEndpointPagesRequest,
) => Effect.Effect<
  ListProductRestEndpointPagesResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listRoutingRules: {
  (
    input: ListRoutingRulesRequest,
  ): Effect.Effect<
    ListRoutingRulesResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRoutingRulesRequest,
  ) => Stream.Stream<
    ListRoutingRulesResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRoutingRulesRequest,
  ) => Stream.Stream<
    RoutingRule,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRoutingRulesRequest,
  output: ListRoutingRulesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RoutingRules",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes an API mapping.
 */
export const deleteApiMapping: (
  input: DeleteApiMappingRequest,
) => Effect.Effect<
  DeleteApiMappingResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApiMappingRequest,
  output: DeleteApiMappingResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a portal.
 */
export const deletePortal: (
  input: DeletePortalRequest,
) => Effect.Effect<
  DeletePortalResponse,
  | AccessDeniedException
  | BadRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const exportApi: (
  input: ExportApiRequest,
) => Effect.Effect<
  ExportApiResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportApiRequest,
  output: ExportApiResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets an Api resource.
 */
export const getApi: (
  input: GetApiRequest,
) => Effect.Effect<
  GetApiResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApiRequest,
  output: GetApiResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets an API mapping.
 */
export const getApiMapping: (
  input: GetApiMappingRequest,
) => Effect.Effect<
  GetApiMappingResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApiMappingRequest,
  output: GetApiMappingResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets an Authorizer.
 */
export const getAuthorizer: (
  input: GetAuthorizerRequest,
) => Effect.Effect<
  GetAuthorizerResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAuthorizerRequest,
  output: GetAuthorizerResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a Deployment.
 */
export const getDeployment: (
  input: GetDeploymentRequest,
) => Effect.Effect<
  GetDeploymentResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentRequest,
  output: GetDeploymentResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets an IntegrationResponses.
 */
export const getIntegrationResponse: (
  input: GetIntegrationResponseRequest,
) => Effect.Effect<
  GetIntegrationResponseResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntegrationResponseRequest,
  output: GetIntegrationResponseResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a Model.
 */
export const getModel: (
  input: GetModelRequest,
) => Effect.Effect<
  GetModelResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelRequest,
  output: GetModelResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a model template.
 */
export const getModelTemplate: (
  input: GetModelTemplateRequest,
) => Effect.Effect<
  GetModelTemplateResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelTemplateRequest,
  output: GetModelTemplateResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a portal product.
 */
export const getPortalProduct: (
  input: GetPortalProductRequest,
) => Effect.Effect<
  GetPortalProductResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPortalProductSharingPolicy: (
  input: GetPortalProductSharingPolicyRequest,
) => Effect.Effect<
  GetPortalProductSharingPolicyResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getProductPage: (
  input: GetProductPageRequest,
) => Effect.Effect<
  GetProductPageResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRoute: (
  input: GetRouteRequest,
) => Effect.Effect<
  GetRouteResult,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouteRequest,
  output: GetRouteResult,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a RouteResponse.
 */
export const getRouteResponse: (
  input: GetRouteResponseRequest,
) => Effect.Effect<
  GetRouteResponseResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouteResponseRequest,
  output: GetRouteResponseResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a routing rule.
 */
export const getRoutingRule: (
  input: GetRoutingRuleRequest,
) => Effect.Effect<
  GetRoutingRuleResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRoutingRuleRequest,
  output: GetRoutingRuleResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a Stage.
 */
export const getStage: (
  input: GetStageRequest,
) => Effect.Effect<
  GetStageResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStageRequest,
  output: GetStageResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Gets a VPC link.
 */
export const getVpcLink: (
  input: GetVpcLinkRequest,
) => Effect.Effect<
  GetVpcLinkResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVpcLinkRequest,
  output: GetVpcLinkResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Updates a product page of a portal product.
 */
export const updateProductPage: (
  input: UpdateProductPageRequest,
) => Effect.Effect<
  UpdateProductPageResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProductRestEndpointPage: (
  input: UpdateProductRestEndpointPageRequest,
) => Effect.Effect<
  UpdateProductRestEndpointPageResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVpcLink: (
  input: UpdateVpcLinkRequest,
) => Effect.Effect<
  UpdateVpcLinkResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVpcLinkRequest,
  output: UpdateVpcLinkResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes an Api resource.
 */
export const deleteApi: (
  input: DeleteApiRequest,
) => Effect.Effect<
  DeleteApiResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApiRequest,
  output: DeleteApiResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes an Authorizer.
 */
export const deleteAuthorizer: (
  input: DeleteAuthorizerRequest,
) => Effect.Effect<
  DeleteAuthorizerResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAuthorizerRequest,
  output: DeleteAuthorizerResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a CORS configuration.
 */
export const deleteCorsConfiguration: (
  input: DeleteCorsConfigurationRequest,
) => Effect.Effect<
  DeleteCorsConfigurationResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCorsConfigurationRequest,
  output: DeleteCorsConfigurationResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a Deployment.
 */
export const deleteDeployment: (
  input: DeleteDeploymentRequest,
) => Effect.Effect<
  DeleteDeploymentResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeploymentRequest,
  output: DeleteDeploymentResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a domain name.
 */
export const deleteDomainName: (
  input: DeleteDomainNameRequest,
) => Effect.Effect<
  DeleteDomainNameResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainNameRequest,
  output: DeleteDomainNameResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes an Integration.
 */
export const deleteIntegration: (
  input: DeleteIntegrationRequest,
) => Effect.Effect<
  DeleteIntegrationResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationRequest,
  output: DeleteIntegrationResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes an IntegrationResponses.
 */
export const deleteIntegrationResponse: (
  input: DeleteIntegrationResponseRequest,
) => Effect.Effect<
  DeleteIntegrationResponseResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationResponseRequest,
  output: DeleteIntegrationResponseResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a Model.
 */
export const deleteModel: (
  input: DeleteModelRequest,
) => Effect.Effect<
  DeleteModelResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelRequest,
  output: DeleteModelResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a Route.
 */
export const deleteRoute: (
  input: DeleteRouteRequest,
) => Effect.Effect<
  DeleteRouteResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouteRequest,
  output: DeleteRouteResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a route request parameter. Supported only for WebSocket APIs.
 */
export const deleteRouteRequestParameter: (
  input: DeleteRouteRequestParameterRequest,
) => Effect.Effect<
  DeleteRouteRequestParameterResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouteRequestParameterRequest,
  output: DeleteRouteRequestParameterResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a RouteResponse.
 */
export const deleteRouteResponse: (
  input: DeleteRouteResponseRequest,
) => Effect.Effect<
  DeleteRouteResponseResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouteResponseRequest,
  output: DeleteRouteResponseResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes the RouteSettings for a stage.
 */
export const deleteRouteSettings: (
  input: DeleteRouteSettingsRequest,
) => Effect.Effect<
  DeleteRouteSettingsResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouteSettingsRequest,
  output: DeleteRouteSettingsResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a Stage.
 */
export const deleteStage: (
  input: DeleteStageRequest,
) => Effect.Effect<
  DeleteStageResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStageRequest,
  output: DeleteStageResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a VPC link.
 */
export const deleteVpcLink: (
  input: DeleteVpcLinkRequest,
) => Effect.Effect<
  DeleteVpcLinkResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVpcLinkRequest,
  output: DeleteVpcLinkResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Resets all authorizer cache entries on a stage. Supported only for HTTP APIs.
 */
export const resetAuthorizersCache: (
  input: ResetAuthorizersCacheRequest,
) => Effect.Effect<
  ResetAuthorizersCacheResponse,
  NotFoundException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetAuthorizersCacheRequest,
  output: ResetAuthorizersCacheResponse,
  errors: [NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes a routing rule.
 */
export const deleteRoutingRule: (
  input: DeleteRoutingRuleRequest,
) => Effect.Effect<
  DeleteRoutingRuleResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRoutingRuleRequest,
  output: DeleteRoutingRuleResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Creates a VPC link.
 */
export const createVpcLink: (
  input: CreateVpcLinkRequest,
) => Effect.Effect<
  CreateVpcLinkResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcLinkRequest,
  output: CreateVpcLinkResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Deletes a portal product.
 */
export const deletePortalProduct: (
  input: DeletePortalProductRequest,
) => Effect.Effect<
  DeletePortalProductResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePortalProductSharingPolicy: (
  input: DeletePortalProductSharingPolicyRequest,
) => Effect.Effect<
  DeletePortalProductSharingPolicyResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProductPage: (
  input: DeleteProductPageRequest,
) => Effect.Effect<
  DeleteProductPageResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProductRestEndpointPage: (
  input: DeleteProductRestEndpointPageRequest,
) => Effect.Effect<
  DeleteProductRestEndpointPageResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putPortalProductSharingPolicy: (
  input: PutPortalProductSharingPolicyRequest,
) => Effect.Effect<
  PutPortalProductSharingPolicyResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPortalProduct: (
  input: CreatePortalProductRequest,
) => Effect.Effect<
  CreatePortalProductResponse,
  | AccessDeniedException
  | BadRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createProductPage: (
  input: CreateProductPageRequest,
) => Effect.Effect<
  CreateProductPageResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importApi: (
  input: ImportApiRequest,
) => Effect.Effect<
  ImportApiResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putRoutingRule: (
  input: PutRoutingRuleRequest,
) => Effect.Effect<
  PutRoutingRuleResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const reimportApi: (
  input: ReimportApiRequest,
) => Effect.Effect<
  ReimportApiResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApi: (
  input: UpdateApiRequest,
) => Effect.Effect<
  UpdateApiResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApiMapping: (
  input: UpdateApiMappingRequest,
) => Effect.Effect<
  UpdateApiMappingResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAuthorizer: (
  input: UpdateAuthorizerRequest,
) => Effect.Effect<
  UpdateAuthorizerResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDeployment: (
  input: UpdateDeploymentRequest,
) => Effect.Effect<
  UpdateDeploymentResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDomainName: (
  input: UpdateDomainNameRequest,
) => Effect.Effect<
  UpdateDomainNameResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateIntegration: (
  input: UpdateIntegrationRequest,
) => Effect.Effect<
  UpdateIntegrationResult,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateIntegrationResponse: (
  input: UpdateIntegrationResponseRequest,
) => Effect.Effect<
  UpdateIntegrationResponseResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIntegrationResponseRequest,
  output: UpdateIntegrationResponseResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a Model.
 */
export const updateModel: (
  input: UpdateModelRequest,
) => Effect.Effect<
  UpdateModelResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePortal: (
  input: UpdatePortalRequest,
) => Effect.Effect<
  UpdatePortalResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRoute: (
  input: UpdateRouteRequest,
) => Effect.Effect<
  UpdateRouteResult,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRouteResponse: (
  input: UpdateRouteResponseRequest,
) => Effect.Effect<
  UpdateRouteResponseResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateStage: (
  input: UpdateStageRequest,
) => Effect.Effect<
  UpdateStageResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApiMapping: (
  input: CreateApiMappingRequest,
) => Effect.Effect<
  CreateApiMappingResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDeployment: (
  input: CreateDeploymentRequest,
) => Effect.Effect<
  CreateDeploymentResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createIntegrationResponse: (
  input: CreateIntegrationResponseRequest,
) => Effect.Effect<
  CreateIntegrationResponseResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIntegrationResponseRequest,
  output: CreateIntegrationResponseResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a Model for an API.
 */
export const createModel: (
  input: CreateModelRequest,
) => Effect.Effect<
  CreateModelResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRouteResponse: (
  input: CreateRouteResponseRequest,
) => Effect.Effect<
  CreateRouteResponseResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disablePortal: (
  input: DisablePortalRequest,
) => Effect.Effect<
  DisablePortalResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const previewPortal: (
  input: PreviewPortalRequest,
) => Effect.Effect<
  PreviewPortalResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const publishPortal: (
  input: PublishPortalRequest,
) => Effect.Effect<
  PublishPortalResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApi: (
  input: CreateApiRequest,
) => Effect.Effect<
  CreateApiResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAuthorizer: (
  input: CreateAuthorizerRequest,
) => Effect.Effect<
  CreateAuthorizerResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDomainName: (
  input: CreateDomainNameRequest,
) => Effect.Effect<
  CreateDomainNameResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createIntegration: (
  input: CreateIntegrationRequest,
) => Effect.Effect<
  CreateIntegrationResult,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createStage: (
  input: CreateStageRequest,
) => Effect.Effect<
  CreateStageResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createProductRestEndpointPage: (
  input: CreateProductRestEndpointPageRequest,
) => Effect.Effect<
  CreateProductRestEndpointPageResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRoute: (
  input: CreateRouteRequest,
) => Effect.Effect<
  CreateRouteResult,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePortalProduct: (
  input: UpdatePortalProductRequest,
) => Effect.Effect<
  UpdatePortalProductResponse,
  | AccessDeniedException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPortal: (
  input: CreatePortalRequest,
) => Effect.Effect<
  CreatePortalResponse,
  | AccessDeniedException
  | BadRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRoutingRule: (
  input: CreateRoutingRuleRequest,
) => Effect.Effect<
  CreateRoutingRuleResponse,
  | BadRequestException
  | ConflictException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRoutingRuleRequest,
  output: CreateRoutingRuleResponse,
  errors: [
    BadRequestException,
    ConflictException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
