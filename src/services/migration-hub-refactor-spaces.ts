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
  sdkId: "Migration Hub Refactor Spaces",
  serviceShapeName: "RefactorSpaces",
});
const auth = T.AwsAuthSigv4({ name: "refactor-spaces" });
const ver = T.ServiceVersion("2021-10-26");
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
              `https://refactor-spaces-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://refactor-spaces-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://refactor-spaces.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://refactor-spaces.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ApplicationName = string;
export type EnvironmentId = string;
export type VpcId = string;
export type ProxyType = string;
export type ClientToken = string;
export type EnvironmentName = string;
export type Description = string;
export type NetworkFabricType = string;
export type ApplicationId = string;
export type ServiceId = string;
export type RouteType = string;
export type ServiceName = string;
export type ServiceEndpointType = string;
export type ResourcePolicyIdentifier = string;
export type RouteId = string;
export type NextToken = string;
export type MaxResults = number;
export type ResourceArn = string;
export type PolicyString = string;
export type RouteActivationState = string;
export type ApiGatewayEndpointType = string;
export type StageName = string;
export type UriPath = string;
export type HttpMethod = string;
export type Uri = string;
export type LambdaArn = string;
export type AccountId = string;
export type EnvironmentState = string;
export type ApplicationState = string;
export type RouteState = string;
export type ServiceState = string;
export type TransitGatewayId = string;
export type ApiGatewayId = string;
export type VpcLinkId = string;
export type NlbArn = string;
export type NlbName = string;
export type ErrorCode = string;
export type ErrorMessage = string;
export type ResourceIdentifier = string;
export type ErrorResourceType = string;
export type PathResourceToIdKey = string;
export type PathResourceToIdValue = string;
export type CidrBlock = string;
export type Ec2TagValue = string;
export type AdditionalDetailsKey = string;
export type AdditionalDetailsValue = string;
export type RetryAfterSeconds = number;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateEnvironmentRequest {
  Name: string;
  Description?: string;
  NetworkFabricType: string;
  Tags?: { [key: string]: string };
  ClientToken?: string;
}
export const CreateEnvironmentRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    NetworkFabricType: S.String,
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/environments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEnvironmentRequest",
}) as any as S.Schema<CreateEnvironmentRequest>;
export interface DeleteApplicationRequest {
  EnvironmentIdentifier: string;
  ApplicationIdentifier: string;
}
export const DeleteApplicationRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel("ApplicationIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/environments/{EnvironmentIdentifier}/applications/{ApplicationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApplicationRequest",
}) as any as S.Schema<DeleteApplicationRequest>;
export interface DeleteEnvironmentRequest {
  EnvironmentIdentifier: string;
}
export const DeleteEnvironmentRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/environments/{EnvironmentIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnvironmentRequest",
}) as any as S.Schema<DeleteEnvironmentRequest>;
export interface DeleteResourcePolicyRequest {
  Identifier: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/resourcepolicy/{Identifier}" }),
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
export interface DeleteRouteRequest {
  EnvironmentIdentifier: string;
  ApplicationIdentifier: string;
  RouteIdentifier: string;
}
export const DeleteRouteRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel("ApplicationIdentifier")),
    RouteIdentifier: S.String.pipe(T.HttpLabel("RouteIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/environments/{EnvironmentIdentifier}/applications/{ApplicationIdentifier}/routes/{RouteIdentifier}",
      }),
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
export interface DeleteServiceRequest {
  EnvironmentIdentifier: string;
  ApplicationIdentifier: string;
  ServiceIdentifier: string;
}
export const DeleteServiceRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel("ApplicationIdentifier")),
    ServiceIdentifier: S.String.pipe(T.HttpLabel("ServiceIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/environments/{EnvironmentIdentifier}/applications/{ApplicationIdentifier}/services/{ServiceIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteServiceRequest",
}) as any as S.Schema<DeleteServiceRequest>;
export interface GetApplicationRequest {
  EnvironmentIdentifier: string;
  ApplicationIdentifier: string;
}
export const GetApplicationRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel("ApplicationIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/environments/{EnvironmentIdentifier}/applications/{ApplicationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApplicationRequest",
}) as any as S.Schema<GetApplicationRequest>;
export interface GetEnvironmentRequest {
  EnvironmentIdentifier: string;
}
export const GetEnvironmentRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/environments/{EnvironmentIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnvironmentRequest",
}) as any as S.Schema<GetEnvironmentRequest>;
export interface GetResourcePolicyRequest {
  Identifier: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/resourcepolicy/{Identifier}" }),
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
export interface GetRouteRequest {
  EnvironmentIdentifier: string;
  ApplicationIdentifier: string;
  RouteIdentifier: string;
}
export const GetRouteRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel("ApplicationIdentifier")),
    RouteIdentifier: S.String.pipe(T.HttpLabel("RouteIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/environments/{EnvironmentIdentifier}/applications/{ApplicationIdentifier}/routes/{RouteIdentifier}",
      }),
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
export interface GetServiceRequest {
  EnvironmentIdentifier: string;
  ApplicationIdentifier: string;
  ServiceIdentifier: string;
}
export const GetServiceRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel("ApplicationIdentifier")),
    ServiceIdentifier: S.String.pipe(T.HttpLabel("ServiceIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/environments/{EnvironmentIdentifier}/applications/{ApplicationIdentifier}/services/{ServiceIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServiceRequest",
}) as any as S.Schema<GetServiceRequest>;
export interface ListApplicationsRequest {
  EnvironmentIdentifier: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListApplicationsRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/environments/{EnvironmentIdentifier}/applications",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationsRequest",
}) as any as S.Schema<ListApplicationsRequest>;
export interface ListEnvironmentsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/environments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnvironmentsRequest",
}) as any as S.Schema<ListEnvironmentsRequest>;
export interface ListEnvironmentVpcsRequest {
  EnvironmentIdentifier: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListEnvironmentVpcsRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/environments/{EnvironmentIdentifier}/vpcs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnvironmentVpcsRequest",
}) as any as S.Schema<ListEnvironmentVpcsRequest>;
export interface ListRoutesRequest {
  EnvironmentIdentifier: string;
  ApplicationIdentifier: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListRoutesRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel("ApplicationIdentifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/environments/{EnvironmentIdentifier}/applications/{ApplicationIdentifier}/routes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRoutesRequest",
}) as any as S.Schema<ListRoutesRequest>;
export interface ListServicesRequest {
  EnvironmentIdentifier: string;
  ApplicationIdentifier: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListServicesRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel("ApplicationIdentifier")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/environments/{EnvironmentIdentifier}/applications/{ApplicationIdentifier}/services",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListServicesRequest",
}) as any as S.Schema<ListServicesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
  ResourceArn: string;
  Policy: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Policy: S.String }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/resourcepolicy" }),
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
export interface PutResourcePolicyResponse {}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export interface UpdateRouteRequest {
  EnvironmentIdentifier: string;
  ApplicationIdentifier: string;
  RouteIdentifier: string;
  ActivationState: string;
}
export const UpdateRouteRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel("ApplicationIdentifier")),
    RouteIdentifier: S.String.pipe(T.HttpLabel("RouteIdentifier")),
    ActivationState: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/environments/{EnvironmentIdentifier}/applications/{ApplicationIdentifier}/routes/{RouteIdentifier}",
      }),
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
export type HttpMethods = string[];
export const HttpMethods = S.Array(S.String);
export interface ApiGatewayProxyInput {
  EndpointType?: string;
  StageName?: string;
}
export const ApiGatewayProxyInput = S.suspend(() =>
  S.Struct({
    EndpointType: S.optional(S.String),
    StageName: S.optional(S.String),
  }),
).annotations({
  identifier: "ApiGatewayProxyInput",
}) as any as S.Schema<ApiGatewayProxyInput>;
export interface DefaultRouteInput {
  ActivationState?: string;
}
export const DefaultRouteInput = S.suspend(() =>
  S.Struct({ ActivationState: S.optional(S.String) }),
).annotations({
  identifier: "DefaultRouteInput",
}) as any as S.Schema<DefaultRouteInput>;
export interface UriPathRouteInput {
  SourcePath: string;
  ActivationState: string;
  Methods?: string[];
  IncludeChildPaths?: boolean;
  AppendSourcePath?: boolean;
}
export const UriPathRouteInput = S.suspend(() =>
  S.Struct({
    SourcePath: S.String,
    ActivationState: S.String,
    Methods: S.optional(HttpMethods),
    IncludeChildPaths: S.optional(S.Boolean),
    AppendSourcePath: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UriPathRouteInput",
}) as any as S.Schema<UriPathRouteInput>;
export interface UrlEndpointInput {
  Url: string;
  HealthUrl?: string;
}
export const UrlEndpointInput = S.suspend(() =>
  S.Struct({ Url: S.String, HealthUrl: S.optional(S.String) }),
).annotations({
  identifier: "UrlEndpointInput",
}) as any as S.Schema<UrlEndpointInput>;
export interface LambdaEndpointInput {
  Arn: string;
}
export const LambdaEndpointInput = S.suspend(() =>
  S.Struct({ Arn: S.String }),
).annotations({
  identifier: "LambdaEndpointInput",
}) as any as S.Schema<LambdaEndpointInput>;
export interface CreateApplicationRequest {
  Name: string;
  EnvironmentIdentifier: string;
  VpcId: string;
  ProxyType: string;
  ApiGatewayProxy?: ApiGatewayProxyInput;
  Tags?: { [key: string]: string };
  ClientToken?: string;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    VpcId: S.String,
    ProxyType: S.String,
    ApiGatewayProxy: S.optional(ApiGatewayProxyInput),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/environments/{EnvironmentIdentifier}/applications",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface CreateEnvironmentResponse {
  Name?: string;
  Arn?: string;
  Description?: string;
  EnvironmentId?: string;
  NetworkFabricType?: string;
  OwnerAccountId?: string;
  State?: string;
  Tags?: { [key: string]: string };
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
}
export const CreateEnvironmentResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Description: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    NetworkFabricType: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateEnvironmentResponse",
}) as any as S.Schema<CreateEnvironmentResponse>;
export interface CreateRouteRequest {
  EnvironmentIdentifier: string;
  ApplicationIdentifier: string;
  ServiceIdentifier: string;
  RouteType: string;
  DefaultRoute?: DefaultRouteInput;
  UriPathRoute?: UriPathRouteInput;
  Tags?: { [key: string]: string };
  ClientToken?: string;
}
export const CreateRouteRequest = S.suspend(() =>
  S.Struct({
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel("ApplicationIdentifier")),
    ServiceIdentifier: S.String,
    RouteType: S.String,
    DefaultRoute: S.optional(DefaultRouteInput),
    UriPathRoute: S.optional(UriPathRouteInput),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/environments/{EnvironmentIdentifier}/applications/{ApplicationIdentifier}/routes",
      }),
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
export interface CreateServiceRequest {
  Name: string;
  Description?: string;
  EnvironmentIdentifier: string;
  ApplicationIdentifier: string;
  VpcId?: string;
  EndpointType: string;
  UrlEndpoint?: UrlEndpointInput;
  LambdaEndpoint?: LambdaEndpointInput;
  Tags?: { [key: string]: string };
  ClientToken?: string;
}
export const CreateServiceRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel("EnvironmentIdentifier")),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel("ApplicationIdentifier")),
    VpcId: S.optional(S.String),
    EndpointType: S.String,
    UrlEndpoint: S.optional(UrlEndpointInput),
    LambdaEndpoint: S.optional(LambdaEndpointInput),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/environments/{EnvironmentIdentifier}/applications/{ApplicationIdentifier}/services",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateServiceRequest",
}) as any as S.Schema<CreateServiceRequest>;
export interface DeleteApplicationResponse {
  Name?: string;
  Arn?: string;
  ApplicationId?: string;
  EnvironmentId?: string;
  State?: string;
  LastUpdatedTime?: Date;
}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    State: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface DeleteEnvironmentResponse {
  Name?: string;
  Arn?: string;
  EnvironmentId?: string;
  State?: string;
  LastUpdatedTime?: Date;
}
export const DeleteEnvironmentResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    State: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DeleteEnvironmentResponse",
}) as any as S.Schema<DeleteEnvironmentResponse>;
export interface DeleteRouteResponse {
  RouteId?: string;
  Arn?: string;
  ServiceId?: string;
  ApplicationId?: string;
  State?: string;
  LastUpdatedTime?: Date;
}
export const DeleteRouteResponse = S.suspend(() =>
  S.Struct({
    RouteId: S.optional(S.String),
    Arn: S.optional(S.String),
    ServiceId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    State: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DeleteRouteResponse",
}) as any as S.Schema<DeleteRouteResponse>;
export interface DeleteServiceResponse {
  ServiceId?: string;
  Name?: string;
  Arn?: string;
  EnvironmentId?: string;
  ApplicationId?: string;
  State?: string;
  LastUpdatedTime?: Date;
}
export const DeleteServiceResponse = S.suspend(() =>
  S.Struct({
    ServiceId: S.optional(S.String),
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    State: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DeleteServiceResponse",
}) as any as S.Schema<DeleteServiceResponse>;
export type AdditionalDetails = { [key: string]: string };
export const AdditionalDetails = S.Record({ key: S.String, value: S.String });
export interface ErrorResponse {
  Code?: string;
  Message?: string;
  AccountId?: string;
  ResourceIdentifier?: string;
  ResourceType?: string;
  AdditionalDetails?: { [key: string]: string };
}
export const ErrorResponse = S.suspend(() =>
  S.Struct({
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    AccountId: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    ResourceType: S.optional(S.String),
    AdditionalDetails: S.optional(AdditionalDetails),
  }),
).annotations({
  identifier: "ErrorResponse",
}) as any as S.Schema<ErrorResponse>;
export interface GetEnvironmentResponse {
  Name?: string;
  Arn?: string;
  Description?: string;
  EnvironmentId?: string;
  NetworkFabricType?: string;
  OwnerAccountId?: string;
  TransitGatewayId?: string;
  State?: string;
  Tags?: { [key: string]: string };
  Error?: ErrorResponse;
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
}
export const GetEnvironmentResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Description: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    NetworkFabricType: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    TransitGatewayId: S.optional(S.String),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    Error: S.optional(ErrorResponse),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetEnvironmentResponse",
}) as any as S.Schema<GetEnvironmentResponse>;
export interface GetResourcePolicyResponse {
  Policy?: string;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateRouteResponse {
  RouteId?: string;
  Arn?: string;
  ServiceId?: string;
  ApplicationId?: string;
  State?: string;
  LastUpdatedTime?: Date;
}
export const UpdateRouteResponse = S.suspend(() =>
  S.Struct({
    RouteId: S.optional(S.String),
    Arn: S.optional(S.String),
    ServiceId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    State: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateRouteResponse",
}) as any as S.Schema<UpdateRouteResponse>;
export type CidrBlocks = string[];
export const CidrBlocks = S.Array(S.String);
export interface ApiGatewayProxyConfig {
  ProxyUrl?: string;
  ApiGatewayId?: string;
  VpcLinkId?: string;
  NlbArn?: string;
  NlbName?: string;
  EndpointType?: string;
  StageName?: string;
}
export const ApiGatewayProxyConfig = S.suspend(() =>
  S.Struct({
    ProxyUrl: S.optional(S.String),
    ApiGatewayId: S.optional(S.String),
    VpcLinkId: S.optional(S.String),
    NlbArn: S.optional(S.String),
    NlbName: S.optional(S.String),
    EndpointType: S.optional(S.String),
    StageName: S.optional(S.String),
  }),
).annotations({
  identifier: "ApiGatewayProxyConfig",
}) as any as S.Schema<ApiGatewayProxyConfig>;
export type PathResourceToId = { [key: string]: string };
export const PathResourceToId = S.Record({ key: S.String, value: S.String });
export interface UrlEndpointConfig {
  Url?: string;
  HealthUrl?: string;
}
export const UrlEndpointConfig = S.suspend(() =>
  S.Struct({ Url: S.optional(S.String), HealthUrl: S.optional(S.String) }),
).annotations({
  identifier: "UrlEndpointConfig",
}) as any as S.Schema<UrlEndpointConfig>;
export interface LambdaEndpointConfig {
  Arn?: string;
}
export const LambdaEndpointConfig = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "LambdaEndpointConfig",
}) as any as S.Schema<LambdaEndpointConfig>;
export interface EnvironmentSummary {
  Name?: string;
  Arn?: string;
  Description?: string;
  EnvironmentId?: string;
  NetworkFabricType?: string;
  OwnerAccountId?: string;
  TransitGatewayId?: string;
  State?: string;
  Tags?: { [key: string]: string };
  Error?: ErrorResponse;
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
}
export const EnvironmentSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Description: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    NetworkFabricType: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    TransitGatewayId: S.optional(S.String),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    Error: S.optional(ErrorResponse),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "EnvironmentSummary",
}) as any as S.Schema<EnvironmentSummary>;
export type EnvironmentSummaries = EnvironmentSummary[];
export const EnvironmentSummaries = S.Array(EnvironmentSummary);
export interface EnvironmentVpc {
  EnvironmentId?: string;
  VpcId?: string;
  AccountId?: string;
  CidrBlocks?: string[];
  VpcName?: string;
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
}
export const EnvironmentVpc = S.suspend(() =>
  S.Struct({
    EnvironmentId: S.optional(S.String),
    VpcId: S.optional(S.String),
    AccountId: S.optional(S.String),
    CidrBlocks: S.optional(CidrBlocks),
    VpcName: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "EnvironmentVpc",
}) as any as S.Schema<EnvironmentVpc>;
export type EnvironmentVpcs = EnvironmentVpc[];
export const EnvironmentVpcs = S.Array(EnvironmentVpc);
export interface RouteSummary {
  RouteId?: string;
  Arn?: string;
  OwnerAccountId?: string;
  CreatedByAccountId?: string;
  RouteType?: string;
  ServiceId?: string;
  ApplicationId?: string;
  EnvironmentId?: string;
  SourcePath?: string;
  Methods?: string[];
  IncludeChildPaths?: boolean;
  PathResourceToId?: { [key: string]: string };
  State?: string;
  Tags?: { [key: string]: string };
  Error?: ErrorResponse;
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
  AppendSourcePath?: boolean;
}
export const RouteSummary = S.suspend(() =>
  S.Struct({
    RouteId: S.optional(S.String),
    Arn: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    CreatedByAccountId: S.optional(S.String),
    RouteType: S.optional(S.String),
    ServiceId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    SourcePath: S.optional(S.String),
    Methods: S.optional(HttpMethods),
    IncludeChildPaths: S.optional(S.Boolean),
    PathResourceToId: S.optional(PathResourceToId),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    Error: S.optional(ErrorResponse),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AppendSourcePath: S.optional(S.Boolean),
  }),
).annotations({ identifier: "RouteSummary" }) as any as S.Schema<RouteSummary>;
export type RouteSummaries = RouteSummary[];
export const RouteSummaries = S.Array(RouteSummary);
export interface CreateApplicationResponse {
  Name?: string;
  Arn?: string;
  OwnerAccountId?: string;
  CreatedByAccountId?: string;
  ApplicationId?: string;
  EnvironmentId?: string;
  VpcId?: string;
  ProxyType?: string;
  ApiGatewayProxy?: ApiGatewayProxyInput;
  State?: string;
  Tags?: { [key: string]: string };
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    CreatedByAccountId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    VpcId: S.optional(S.String),
    ProxyType: S.optional(S.String),
    ApiGatewayProxy: S.optional(ApiGatewayProxyInput),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface CreateRouteResponse {
  RouteId?: string;
  Arn?: string;
  OwnerAccountId?: string;
  CreatedByAccountId?: string;
  RouteType?: string;
  ServiceId?: string;
  ApplicationId?: string;
  UriPathRoute?: UriPathRouteInput;
  State?: string;
  Tags?: { [key: string]: string };
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
}
export const CreateRouteResponse = S.suspend(() =>
  S.Struct({
    RouteId: S.optional(S.String),
    Arn: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    CreatedByAccountId: S.optional(S.String),
    RouteType: S.optional(S.String),
    ServiceId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    UriPathRoute: S.optional(UriPathRouteInput),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateRouteResponse",
}) as any as S.Schema<CreateRouteResponse>;
export interface CreateServiceResponse {
  ServiceId?: string;
  Name?: string;
  Arn?: string;
  OwnerAccountId?: string;
  CreatedByAccountId?: string;
  Description?: string;
  EnvironmentId?: string;
  ApplicationId?: string;
  VpcId?: string;
  EndpointType?: string;
  UrlEndpoint?: UrlEndpointInput;
  LambdaEndpoint?: LambdaEndpointInput;
  State?: string;
  Tags?: { [key: string]: string };
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
}
export const CreateServiceResponse = S.suspend(() =>
  S.Struct({
    ServiceId: S.optional(S.String),
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    CreatedByAccountId: S.optional(S.String),
    Description: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    VpcId: S.optional(S.String),
    EndpointType: S.optional(S.String),
    UrlEndpoint: S.optional(UrlEndpointInput),
    LambdaEndpoint: S.optional(LambdaEndpointInput),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateServiceResponse",
}) as any as S.Schema<CreateServiceResponse>;
export interface GetRouteResponse {
  RouteId?: string;
  Arn?: string;
  OwnerAccountId?: string;
  CreatedByAccountId?: string;
  RouteType?: string;
  ServiceId?: string;
  ApplicationId?: string;
  EnvironmentId?: string;
  SourcePath?: string;
  Methods?: string[];
  IncludeChildPaths?: boolean;
  PathResourceToId?: { [key: string]: string };
  State?: string;
  Tags?: { [key: string]: string };
  Error?: ErrorResponse;
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
  AppendSourcePath?: boolean;
}
export const GetRouteResponse = S.suspend(() =>
  S.Struct({
    RouteId: S.optional(S.String),
    Arn: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    CreatedByAccountId: S.optional(S.String),
    RouteType: S.optional(S.String),
    ServiceId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    SourcePath: S.optional(S.String),
    Methods: S.optional(HttpMethods),
    IncludeChildPaths: S.optional(S.Boolean),
    PathResourceToId: S.optional(PathResourceToId),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    Error: S.optional(ErrorResponse),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AppendSourcePath: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetRouteResponse",
}) as any as S.Schema<GetRouteResponse>;
export interface GetServiceResponse {
  ServiceId?: string;
  Name?: string;
  Arn?: string;
  OwnerAccountId?: string;
  CreatedByAccountId?: string;
  Description?: string;
  EnvironmentId?: string;
  ApplicationId?: string;
  VpcId?: string;
  EndpointType?: string;
  UrlEndpoint?: UrlEndpointConfig;
  LambdaEndpoint?: LambdaEndpointConfig;
  State?: string;
  Tags?: { [key: string]: string };
  Error?: ErrorResponse;
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
}
export const GetServiceResponse = S.suspend(() =>
  S.Struct({
    ServiceId: S.optional(S.String),
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    CreatedByAccountId: S.optional(S.String),
    Description: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    VpcId: S.optional(S.String),
    EndpointType: S.optional(S.String),
    UrlEndpoint: S.optional(UrlEndpointConfig),
    LambdaEndpoint: S.optional(LambdaEndpointConfig),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    Error: S.optional(ErrorResponse),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetServiceResponse",
}) as any as S.Schema<GetServiceResponse>;
export interface ListEnvironmentsResponse {
  EnvironmentSummaryList?: EnvironmentSummary[];
  NextToken?: string;
}
export const ListEnvironmentsResponse = S.suspend(() =>
  S.Struct({
    EnvironmentSummaryList: S.optional(EnvironmentSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnvironmentsResponse",
}) as any as S.Schema<ListEnvironmentsResponse>;
export interface ListEnvironmentVpcsResponse {
  EnvironmentVpcList?: EnvironmentVpc[];
  NextToken?: string;
}
export const ListEnvironmentVpcsResponse = S.suspend(() =>
  S.Struct({
    EnvironmentVpcList: S.optional(EnvironmentVpcs),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnvironmentVpcsResponse",
}) as any as S.Schema<ListEnvironmentVpcsResponse>;
export interface ListRoutesResponse {
  RouteSummaryList?: RouteSummary[];
  NextToken?: string;
}
export const ListRoutesResponse = S.suspend(() =>
  S.Struct({
    RouteSummaryList: S.optional(RouteSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRoutesResponse",
}) as any as S.Schema<ListRoutesResponse>;
export interface ApiGatewayProxySummary {
  ProxyUrl?: string;
  ApiGatewayId?: string;
  VpcLinkId?: string;
  NlbArn?: string;
  NlbName?: string;
  EndpointType?: string;
  StageName?: string;
}
export const ApiGatewayProxySummary = S.suspend(() =>
  S.Struct({
    ProxyUrl: S.optional(S.String),
    ApiGatewayId: S.optional(S.String),
    VpcLinkId: S.optional(S.String),
    NlbArn: S.optional(S.String),
    NlbName: S.optional(S.String),
    EndpointType: S.optional(S.String),
    StageName: S.optional(S.String),
  }),
).annotations({
  identifier: "ApiGatewayProxySummary",
}) as any as S.Schema<ApiGatewayProxySummary>;
export interface UrlEndpointSummary {
  Url?: string;
  HealthUrl?: string;
}
export const UrlEndpointSummary = S.suspend(() =>
  S.Struct({ Url: S.optional(S.String), HealthUrl: S.optional(S.String) }),
).annotations({
  identifier: "UrlEndpointSummary",
}) as any as S.Schema<UrlEndpointSummary>;
export interface LambdaEndpointSummary {
  Arn?: string;
}
export const LambdaEndpointSummary = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "LambdaEndpointSummary",
}) as any as S.Schema<LambdaEndpointSummary>;
export interface ApplicationSummary {
  Name?: string;
  Arn?: string;
  OwnerAccountId?: string;
  CreatedByAccountId?: string;
  ApplicationId?: string;
  EnvironmentId?: string;
  VpcId?: string;
  ProxyType?: string;
  ApiGatewayProxy?: ApiGatewayProxySummary;
  State?: string;
  Tags?: { [key: string]: string };
  Error?: ErrorResponse;
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
}
export const ApplicationSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    CreatedByAccountId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    VpcId: S.optional(S.String),
    ProxyType: S.optional(S.String),
    ApiGatewayProxy: S.optional(ApiGatewayProxySummary),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    Error: S.optional(ErrorResponse),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ApplicationSummary",
}) as any as S.Schema<ApplicationSummary>;
export type ApplicationSummaries = ApplicationSummary[];
export const ApplicationSummaries = S.Array(ApplicationSummary);
export interface ServiceSummary {
  ServiceId?: string;
  Name?: string;
  Arn?: string;
  OwnerAccountId?: string;
  CreatedByAccountId?: string;
  Description?: string;
  EnvironmentId?: string;
  ApplicationId?: string;
  VpcId?: string;
  EndpointType?: string;
  UrlEndpoint?: UrlEndpointSummary;
  LambdaEndpoint?: LambdaEndpointSummary;
  State?: string;
  Tags?: { [key: string]: string };
  Error?: ErrorResponse;
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
}
export const ServiceSummary = S.suspend(() =>
  S.Struct({
    ServiceId: S.optional(S.String),
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    CreatedByAccountId: S.optional(S.String),
    Description: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    VpcId: S.optional(S.String),
    EndpointType: S.optional(S.String),
    UrlEndpoint: S.optional(UrlEndpointSummary),
    LambdaEndpoint: S.optional(LambdaEndpointSummary),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    Error: S.optional(ErrorResponse),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ServiceSummary",
}) as any as S.Schema<ServiceSummary>;
export type ServiceSummaries = ServiceSummary[];
export const ServiceSummaries = S.Array(ServiceSummary);
export interface GetApplicationResponse {
  Name?: string;
  Arn?: string;
  OwnerAccountId?: string;
  CreatedByAccountId?: string;
  ApplicationId?: string;
  EnvironmentId?: string;
  VpcId?: string;
  ProxyType?: string;
  ApiGatewayProxy?: ApiGatewayProxyConfig;
  State?: string;
  Tags?: { [key: string]: string };
  Error?: ErrorResponse;
  LastUpdatedTime?: Date;
  CreatedTime?: Date;
}
export const GetApplicationResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    CreatedByAccountId: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    VpcId: S.optional(S.String),
    ProxyType: S.optional(S.String),
    ApiGatewayProxy: S.optional(ApiGatewayProxyConfig),
    State: S.optional(S.String),
    Tags: S.optional(TagMap),
    Error: S.optional(ErrorResponse),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetApplicationResponse",
}) as any as S.Schema<GetApplicationResponse>;
export interface ListApplicationsResponse {
  ApplicationSummaryList?: ApplicationSummary[];
  NextToken?: string;
}
export const ListApplicationsResponse = S.suspend(() =>
  S.Struct({
    ApplicationSummaryList: S.optional(ApplicationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationsResponse",
}) as any as S.Schema<ListApplicationsResponse>;
export interface ListServicesResponse {
  ServiceSummaryList?: ServiceSummary[];
  NextToken?: string;
}
export const ListServicesResponse = S.suspend(() =>
  S.Struct({
    ServiceSummaryList: S.optional(ServiceSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListServicesResponse",
}) as any as S.Schema<ListServicesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withBadRequestError) {}
export class InvalidResourcePolicyException extends S.TaggedError<InvalidResourcePolicyException>()(
  "InvalidResourcePolicyException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    QuotaCode: S.optional(S.String),
    ServiceCode: S.String,
  },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Removes the tags of a given resource. Tags are metadata which can be used to manage a
 * resource. To tag a resource, the caller account must be the same as the resource’s
 * `OwnerAccountId`. Tagging resources in other accounts is not supported.
 *
 * Amazon Web Services Migration Hub Refactor Spaces does not propagate tags to orchestrated resources, such as an
 * environment’s transit gateway.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Attaches a resource-based permission policy to the Amazon Web Services Migration Hub Refactor Spaces environment. The policy
 * must contain the same actions and condition statements as the
 * `arn:aws:ram::aws:permission/AWSRAMDefaultPermissionRefactorSpacesEnvironment`
 * permission in Resource Access Manager. The policy must not contain new lines or blank lines.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidResourcePolicyException
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
    InvalidResourcePolicyException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Web Services Migration Hub Refactor Spaces environment. The caller owns the environment resource, and all
 * Refactor Spaces applications, services, and routes created within the environment. They are referred
 * to as the *environment owner*. The environment owner has cross-account
 * visibility and control of Refactor Spaces resources that are added to the environment by other
 * accounts that the environment is shared with.
 *
 * When creating an environment with a CreateEnvironment:NetworkFabricType of `TRANSIT_GATEWAY`, Refactor Spaces
 * provisions a transit gateway to enable services in VPCs to communicate directly across
 * accounts. If CreateEnvironment:NetworkFabricType is `NONE`, Refactor Spaces does not create
 * a transit gateway and you must use your network infrastructure to route traffic to services
 * with private URL endpoints.
 */
export const createEnvironment: (
  input: CreateEnvironmentRequest,
) => effect.Effect<
  CreateEnvironmentResponse,
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
  input: CreateEnvironmentRequest,
  output: CreateEnvironmentResponse,
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
 * Adds to or modifies the tags of the given resource. Tags are metadata which can be used to
 * manage a resource. To untag a resource, the caller account must be the same as the resource’s
 * `OwnerAccountId`. Untagging resources across accounts is not supported.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the tags of a resource. The caller account must be the same as the resource’s
 * `OwnerAccountId`. Listing tags in other accounts is not supported.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon Web Services Migration Hub Refactor Spaces service.
 */
export const deleteService: (
  input: DeleteServiceRequest,
) => effect.Effect<
  DeleteServiceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceRequest,
  output: DeleteServiceResponse,
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
 * Deletes an Amazon Web Services Migration Hub Refactor Spaces application. Before you can delete an application, you must first
 * delete any services or routes within the application.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => effect.Effect<
  DeleteApplicationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
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
 * Deletes an Amazon Web Services Migration Hub Refactor Spaces environment. Before you can delete an environment, you must first
 * delete any applications and services within the environment.
 */
export const deleteEnvironment: (
  input: DeleteEnvironmentRequest,
) => effect.Effect<
  DeleteEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentRequest,
  output: DeleteEnvironmentResponse,
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
 * Updates an Amazon Web Services Migration Hub Refactor Spaces route.
 */
export const updateRoute: (
  input: UpdateRouteRequest,
) => effect.Effect<
  UpdateRouteResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRouteRequest,
  output: UpdateRouteResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the resource policy set for the environment.
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
 * Gets an Amazon Web Services Migration Hub Refactor Spaces environment.
 */
export const getEnvironment: (
  input: GetEnvironmentRequest,
) => effect.Effect<
  GetEnvironmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentRequest,
  output: GetEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the resource-based permission policy that is set for the given environment.
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
 * Deletes an Amazon Web Services Migration Hub Refactor Spaces route.
 */
export const deleteRoute: (
  input: DeleteRouteRequest,
) => effect.Effect<
  DeleteRouteResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouteRequest,
  output: DeleteRouteResponse,
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
 * Gets an Amazon Web Services Migration Hub Refactor Spaces route.
 */
export const getRoute: (
  input: GetRouteRequest,
) => effect.Effect<
  GetRouteResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRouteRequest,
  output: GetRouteResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets an Amazon Web Services Migration Hub Refactor Spaces service.
 */
export const getService: (
  input: GetServiceRequest,
) => effect.Effect<
  GetServiceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceRequest,
  output: GetServiceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists Amazon Web Services Migration Hub Refactor Spaces environments owned by a caller account or shared with the caller
 * account.
 */
export const listEnvironments: {
  (
    input: ListEnvironmentsRequest,
  ): effect.Effect<
    ListEnvironmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentsRequest,
  ) => stream.Stream<
    ListEnvironmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentsRequest,
  ) => stream.Stream<
    EnvironmentSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentsRequest,
  output: ListEnvironmentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EnvironmentSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all Amazon Web Services Migration Hub Refactor Spaces service virtual private clouds (VPCs) that are part of the
 * environment.
 */
export const listEnvironmentVpcs: {
  (
    input: ListEnvironmentVpcsRequest,
  ): effect.Effect<
    ListEnvironmentVpcsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentVpcsRequest,
  ) => stream.Stream<
    ListEnvironmentVpcsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentVpcsRequest,
  ) => stream.Stream<
    EnvironmentVpc,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentVpcsRequest,
  output: ListEnvironmentVpcsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EnvironmentVpcList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets an Amazon Web Services Migration Hub Refactor Spaces application.
 */
export const getApplication: (
  input: GetApplicationRequest,
) => effect.Effect<
  GetApplicationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationRequest,
  output: GetApplicationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Web Services Migration Hub Refactor Spaces application. The account that owns the environment also owns the
 * applications created inside the environment, regardless of the account that creates the
 * application. Refactor Spaces provisions an Amazon API Gateway, API Gateway VPC link, and
 * Network Load Balancer for the application proxy inside your account.
 *
 * In environments created with a CreateEnvironment:NetworkFabricType of `NONE` you need to configure
 * VPC to VPC connectivity between your service VPC and the application proxy VPC to
 * route traffic through the application proxy to a service with a private URL endpoint. For more
 * information, see
 * Create an application in the *Refactor Spaces User Guide*.
 */
export const createApplication: (
  input: CreateApplicationRequest,
) => effect.Effect<
  CreateApplicationResponse,
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
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
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
 * Creates an Amazon Web Services Migration Hub Refactor Spaces route. The account owner of the service resource is always the
 * environment owner, regardless of which account creates the route. Routes target a service in
 * the application. If an application does not have any routes, then the first route must be
 * created as a `DEFAULT`
 * `RouteType`.
 *
 * When created, the default route defaults to an active state so state is not a required
 * input. However, like all other state values the state of the default route can be updated
 * after creation, but only when all other routes are also inactive. Conversely, no route can be
 * active without the default route also being active.
 *
 * When you create a route, Refactor Spaces configures the Amazon API Gateway to send traffic
 * to the target service as follows:
 *
 * - **URL Endpoints**
 *
 * If the service has a URL endpoint, and the endpoint resolves to a private IP address,
 * Refactor Spaces routes traffic using the API Gateway VPC link. If a service endpoint
 * resolves to a public IP address, Refactor Spaces routes traffic over the public internet.
 * Services can have HTTP or HTTPS URL endpoints. For HTTPS URLs, publicly-signed
 * certificates are supported. Private Certificate Authorities (CAs) are permitted only if
 * the CA's domain is also publicly resolvable.
 *
 * Refactor Spaces automatically resolves the public Domain Name System (DNS) names that are
 * set in `CreateService:UrlEndpoint `when you create a service. The DNS names
 * resolve when the DNS time-to-live (TTL) expires, or every 60 seconds for TTLs less than 60
 * seconds. This periodic DNS resolution ensures that the route configuration remains
 * up-to-date.
 *
 * **One-time health check**
 *
 * A one-time health check is performed on the service when either the route is updated
 * from inactive to active, or when it is created with an active state. If the health check
 * fails, the route transitions the route state to `FAILED`, an error code of
 * `SERVICE_ENDPOINT_HEALTH_CHECK_FAILURE` is provided, and no traffic is sent
 * to the service.
 *
 * For private URLs, a target group is created on the Network Load Balancer and the load
 * balancer target group runs default target health checks. By default, the health check is
 * run against the service endpoint URL. Optionally, the health check can be performed
 * against a different protocol, port, and/or path using the CreateService:UrlEndpoint parameter. All other health check settings for the
 * load balancer use the default values described in the Health
 * checks for your target groups in the Elastic Load Balancing
 * guide. The health check is considered successful if at least one target
 * within the target group transitions to a healthy state.
 *
 * - **Lambda function endpoints**
 *
 * If the service has an Lambda function endpoint, then Refactor Spaces
 * configures the Lambda function's resource policy to allow the application's
 * API Gateway to invoke the function.
 *
 * The Lambda function state is checked. If the function is not active, the
 * function configuration is updated so that Lambda resources are provisioned. If
 * the Lambda state is `Failed`, then the route creation fails. For
 * more information, see the GetFunctionConfiguration's State response parameter in the *Lambda Developer Guide*.
 *
 * A check is performed to determine that a Lambda function with the specified ARN
 * exists. If it does not exist, the health check fails. For public URLs, a connection is
 * opened to the public endpoint. If the URL is not reachable, the health check fails.
 *
 * **Environments without a network bridge**
 *
 * When you create environments without a network bridge (CreateEnvironment:NetworkFabricType is `NONE)` and you use your own
 * networking infrastructure, you need to configure VPC to VPC connectivity between your network and the application proxy VPC. Route
 * creation from the application proxy to service endpoints will fail if your network is not
 * configured to connect to the application proxy VPC. For more information, see Create
 * a route in the *Refactor Spaces User Guide*.
 */
export const createRoute: (
  input: CreateRouteRequest,
) => effect.Effect<
  CreateRouteResponse,
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
  input: CreateRouteRequest,
  output: CreateRouteResponse,
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
 * Creates an Amazon Web Services Migration Hub Refactor Spaces service. The account owner of the service is always the
 * environment owner, regardless of which account in the environment creates the service.
 * Services have either a URL endpoint in a virtual private cloud (VPC), or a Lambda
 * function endpoint.
 *
 * If an Amazon Web Services resource is launched in a service VPC, and you want it to be
 * accessible to all of an environment’s services with VPCs and routes, apply the
 * `RefactorSpacesSecurityGroup` to the resource. Alternatively, to add more
 * cross-account constraints, apply your own security group.
 */
export const createService: (
  input: CreateServiceRequest,
) => effect.Effect<
  CreateServiceResponse,
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
  input: CreateServiceRequest,
  output: CreateServiceResponse,
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
 * Lists all the Amazon Web Services Migration Hub Refactor Spaces routes within an application.
 */
export const listRoutes: {
  (
    input: ListRoutesRequest,
  ): effect.Effect<
    ListRoutesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRoutesRequest,
  ) => stream.Stream<
    ListRoutesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRoutesRequest,
  ) => stream.Stream<
    RouteSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRoutesRequest,
  output: ListRoutesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RouteSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the Amazon Web Services Migration Hub Refactor Spaces applications within an environment.
 */
export const listApplications: {
  (
    input: ListApplicationsRequest,
  ): effect.Effect<
    ListApplicationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsRequest,
  ) => stream.Stream<
    ListApplicationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsRequest,
  ) => stream.Stream<
    ApplicationSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ApplicationSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the Amazon Web Services Migration Hub Refactor Spaces services within an application.
 */
export const listServices: {
  (
    input: ListServicesRequest,
  ): effect.Effect<
    ListServicesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServicesRequest,
  ) => stream.Stream<
    ListServicesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServicesRequest,
  ) => stream.Stream<
    ServiceSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServicesRequest,
  output: ListServicesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ServiceSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
