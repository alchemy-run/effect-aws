import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Migration Hub Refactor Spaces",
  serviceShapeName: "RefactorSpaces",
});
const auth = T.AwsAuthSigv4({ name: "refactor-spaces" });
const ver = T.ServiceVersion("2021-10-26");
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
                        url: "https://refactor-spaces-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://refactor-spaces-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://refactor-spaces.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://refactor-spaces.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateEnvironmentRequest extends S.Class<CreateEnvironmentRequest>(
  "CreateEnvironmentRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    NetworkFabricType: S.String,
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/environments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationRequest extends S.Class<DeleteApplicationRequest>(
  "DeleteApplicationRequest",
)(
  {
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteEnvironmentRequest extends S.Class<DeleteEnvironmentRequest>(
  "DeleteEnvironmentRequest",
)(
  { EnvironmentIdentifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/environments/{EnvironmentIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/resourcepolicy/{Identifier}" }),
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
export class DeleteRouteRequest extends S.Class<DeleteRouteRequest>(
  "DeleteRouteRequest",
)(
  {
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel()),
    RouteIdentifier: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteServiceRequest extends S.Class<DeleteServiceRequest>(
  "DeleteServiceRequest",
)(
  {
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel()),
    ServiceIdentifier: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetApplicationRequest extends S.Class<GetApplicationRequest>(
  "GetApplicationRequest",
)(
  {
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetEnvironmentRequest extends S.Class<GetEnvironmentRequest>(
  "GetEnvironmentRequest",
)(
  { EnvironmentIdentifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/environments/{EnvironmentIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/resourcepolicy/{Identifier}" }),
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
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel()),
    RouteIdentifier: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetServiceRequest extends S.Class<GetServiceRequest>(
  "GetServiceRequest",
)(
  {
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel()),
    ServiceIdentifier: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  {
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListEnvironmentsRequest extends S.Class<ListEnvironmentsRequest>(
  "ListEnvironmentsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/environments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnvironmentVpcsRequest extends S.Class<ListEnvironmentVpcsRequest>(
  "ListEnvironmentVpcsRequest",
)(
  {
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListRoutesRequest extends S.Class<ListRoutesRequest>(
  "ListRoutesRequest",
)(
  {
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListServicesRequest extends S.Class<ListServicesRequest>(
  "ListServicesRequest",
)(
  {
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
  { ResourceArn: S.String, Policy: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/resourcepolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
    ResourceArn: S.String.pipe(T.HttpLabel()),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export class UpdateRouteRequest extends S.Class<UpdateRouteRequest>(
  "UpdateRouteRequest",
)(
  {
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel()),
    RouteIdentifier: S.String.pipe(T.HttpLabel()),
    ActivationState: S.String,
  },
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
) {}
export const HttpMethods = S.Array(S.String);
export class ApiGatewayProxyInput extends S.Class<ApiGatewayProxyInput>(
  "ApiGatewayProxyInput",
)({ EndpointType: S.optional(S.String), StageName: S.optional(S.String) }) {}
export class DefaultRouteInput extends S.Class<DefaultRouteInput>(
  "DefaultRouteInput",
)({ ActivationState: S.optional(S.String) }) {}
export class UriPathRouteInput extends S.Class<UriPathRouteInput>(
  "UriPathRouteInput",
)({
  SourcePath: S.String,
  ActivationState: S.String,
  Methods: S.optional(HttpMethods),
  IncludeChildPaths: S.optional(S.Boolean),
  AppendSourcePath: S.optional(S.Boolean),
}) {}
export class UrlEndpointInput extends S.Class<UrlEndpointInput>(
  "UrlEndpointInput",
)({ Url: S.String, HealthUrl: S.optional(S.String) }) {}
export class LambdaEndpointInput extends S.Class<LambdaEndpointInput>(
  "LambdaEndpointInput",
)({ Arn: S.String }) {}
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    Name: S.String,
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    VpcId: S.String,
    ProxyType: S.String,
    ApiGatewayProxy: S.optional(ApiGatewayProxyInput),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
  },
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
) {}
export class CreateEnvironmentResponse extends S.Class<CreateEnvironmentResponse>(
  "CreateEnvironmentResponse",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  EnvironmentId: S.optional(S.String),
  NetworkFabricType: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  State: S.optional(S.String),
  Tags: S.optional(TagMap),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateRouteRequest extends S.Class<CreateRouteRequest>(
  "CreateRouteRequest",
)(
  {
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel()),
    ServiceIdentifier: S.String,
    RouteType: S.String,
    DefaultRoute: S.optional(DefaultRouteInput),
    UriPathRoute: S.optional(UriPathRouteInput),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
  },
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
) {}
export class CreateServiceRequest extends S.Class<CreateServiceRequest>(
  "CreateServiceRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    EnvironmentIdentifier: S.String.pipe(T.HttpLabel()),
    ApplicationIdentifier: S.String.pipe(T.HttpLabel()),
    VpcId: S.optional(S.String),
    EndpointType: S.String,
    UrlEndpoint: S.optional(UrlEndpointInput),
    LambdaEndpoint: S.optional(LambdaEndpointInput),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
  },
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
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  ApplicationId: S.optional(S.String),
  EnvironmentId: S.optional(S.String),
  State: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeleteEnvironmentResponse extends S.Class<DeleteEnvironmentResponse>(
  "DeleteEnvironmentResponse",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  EnvironmentId: S.optional(S.String),
  State: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeleteRouteResponse extends S.Class<DeleteRouteResponse>(
  "DeleteRouteResponse",
)({
  RouteId: S.optional(S.String),
  Arn: S.optional(S.String),
  ServiceId: S.optional(S.String),
  ApplicationId: S.optional(S.String),
  State: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeleteServiceResponse extends S.Class<DeleteServiceResponse>(
  "DeleteServiceResponse",
)({
  ServiceId: S.optional(S.String),
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  EnvironmentId: S.optional(S.String),
  ApplicationId: S.optional(S.String),
  State: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AdditionalDetails = S.Record({ key: S.String, value: S.String });
export class ErrorResponse extends S.Class<ErrorResponse>("ErrorResponse")({
  Code: S.optional(S.String),
  Message: S.optional(S.String),
  AccountId: S.optional(S.String),
  ResourceIdentifier: S.optional(S.String),
  ResourceType: S.optional(S.String),
  AdditionalDetails: S.optional(AdditionalDetails),
}) {}
export class GetEnvironmentResponse extends S.Class<GetEnvironmentResponse>(
  "GetEnvironmentResponse",
)({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({ Policy: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class UpdateRouteResponse extends S.Class<UpdateRouteResponse>(
  "UpdateRouteResponse",
)({
  RouteId: S.optional(S.String),
  Arn: S.optional(S.String),
  ServiceId: S.optional(S.String),
  ApplicationId: S.optional(S.String),
  State: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const CidrBlocks = S.Array(S.String);
export class ApiGatewayProxyConfig extends S.Class<ApiGatewayProxyConfig>(
  "ApiGatewayProxyConfig",
)({
  ProxyUrl: S.optional(S.String),
  ApiGatewayId: S.optional(S.String),
  VpcLinkId: S.optional(S.String),
  NlbArn: S.optional(S.String),
  NlbName: S.optional(S.String),
  EndpointType: S.optional(S.String),
  StageName: S.optional(S.String),
}) {}
export const PathResourceToId = S.Record({ key: S.String, value: S.String });
export class UrlEndpointConfig extends S.Class<UrlEndpointConfig>(
  "UrlEndpointConfig",
)({ Url: S.optional(S.String), HealthUrl: S.optional(S.String) }) {}
export class LambdaEndpointConfig extends S.Class<LambdaEndpointConfig>(
  "LambdaEndpointConfig",
)({ Arn: S.optional(S.String) }) {}
export class EnvironmentSummary extends S.Class<EnvironmentSummary>(
  "EnvironmentSummary",
)({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EnvironmentSummaries = S.Array(EnvironmentSummary);
export class EnvironmentVpc extends S.Class<EnvironmentVpc>("EnvironmentVpc")({
  EnvironmentId: S.optional(S.String),
  VpcId: S.optional(S.String),
  AccountId: S.optional(S.String),
  CidrBlocks: S.optional(CidrBlocks),
  VpcName: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EnvironmentVpcs = S.Array(EnvironmentVpc);
export class RouteSummary extends S.Class<RouteSummary>("RouteSummary")({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AppendSourcePath: S.optional(S.Boolean),
}) {}
export const RouteSummaries = S.Array(RouteSummary);
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateRouteResponse extends S.Class<CreateRouteResponse>(
  "CreateRouteResponse",
)({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateServiceResponse extends S.Class<CreateServiceResponse>(
  "CreateServiceResponse",
)({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetRouteResponse extends S.Class<GetRouteResponse>(
  "GetRouteResponse",
)({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AppendSourcePath: S.optional(S.Boolean),
}) {}
export class GetServiceResponse extends S.Class<GetServiceResponse>(
  "GetServiceResponse",
)({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListEnvironmentsResponse extends S.Class<ListEnvironmentsResponse>(
  "ListEnvironmentsResponse",
)({
  EnvironmentSummaryList: S.optional(EnvironmentSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListEnvironmentVpcsResponse extends S.Class<ListEnvironmentVpcsResponse>(
  "ListEnvironmentVpcsResponse",
)({
  EnvironmentVpcList: S.optional(EnvironmentVpcs),
  NextToken: S.optional(S.String),
}) {}
export class ListRoutesResponse extends S.Class<ListRoutesResponse>(
  "ListRoutesResponse",
)({
  RouteSummaryList: S.optional(RouteSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ApiGatewayProxySummary extends S.Class<ApiGatewayProxySummary>(
  "ApiGatewayProxySummary",
)({
  ProxyUrl: S.optional(S.String),
  ApiGatewayId: S.optional(S.String),
  VpcLinkId: S.optional(S.String),
  NlbArn: S.optional(S.String),
  NlbName: S.optional(S.String),
  EndpointType: S.optional(S.String),
  StageName: S.optional(S.String),
}) {}
export class UrlEndpointSummary extends S.Class<UrlEndpointSummary>(
  "UrlEndpointSummary",
)({ Url: S.optional(S.String), HealthUrl: S.optional(S.String) }) {}
export class LambdaEndpointSummary extends S.Class<LambdaEndpointSummary>(
  "LambdaEndpointSummary",
)({ Arn: S.optional(S.String) }) {}
export class ApplicationSummary extends S.Class<ApplicationSummary>(
  "ApplicationSummary",
)({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ApplicationSummaries = S.Array(ApplicationSummary);
export class ServiceSummary extends S.Class<ServiceSummary>("ServiceSummary")({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ServiceSummaries = S.Array(ServiceSummary);
export class GetApplicationResponse extends S.Class<GetApplicationResponse>(
  "GetApplicationResponse",
)({
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
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)({
  ApplicationSummaryList: S.optional(ApplicationSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListServicesResponse extends S.Class<ListServicesResponse>(
  "ListServicesResponse",
)({
  ServiceSummaryList: S.optional(ServiceSummaries),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class InvalidResourcePolicyException extends S.TaggedError<InvalidResourcePolicyException>()(
  "InvalidResourcePolicyException",
  { Message: S.String },
) {}

//# Operations
/**
 * Deletes an Amazon Web Services Migration Hub Refactor Spaces environment. Before you can delete an environment, you must first
 * delete any applications and services within the environment.
 */
export const deleteEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the resource policy set for the environment.
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
 * Deletes an Amazon Web Services Migration Hub Refactor Spaces route.
 */
export const deleteRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an Amazon Web Services Migration Hub Refactor Spaces service.
 */
export const deleteService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets an Amazon Web Services Migration Hub Refactor Spaces environment.
 */
export const getEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists the tags of a resource. The caller account must be the same as the resource’s
 * `OwnerAccountId`. Listing tags in other accounts is not supported.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes the tags of a given resource. Tags are metadata which can be used to manage a
 * resource. To tag a resource, the caller account must be the same as the resource’s
 * `OwnerAccountId`. Tagging resources in other accounts is not supported.
 *
 * Amazon Web Services Migration Hub Refactor Spaces does not propagate tags to orchestrated resources, such as an
 * environment’s transit gateway.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds to or modifies the tags of the given resource. Tags are metadata which can be used to
 * manage a resource. To untag a resource, the caller account must be the same as the resource’s
 * `OwnerAccountId`. Untagging resources across accounts is not supported.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates an Amazon Web Services Migration Hub Refactor Spaces route.
 */
export const updateRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an Amazon Web Services Migration Hub Refactor Spaces application. Before you can delete an application, you must first
 * delete any services or routes within the application.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets an Amazon Web Services Migration Hub Refactor Spaces route.
 */
export const getRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEnvironmentsRequest,
  output: ListEnvironmentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all Amazon Web Services Migration Hub Refactor Spaces service virtual private clouds (VPCs) that are part of the
 * environment.
 */
export const listEnvironmentVpcs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEnvironmentVpcsRequest,
  output: ListEnvironmentVpcsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the Amazon Web Services Migration Hub Refactor Spaces routes within an application.
 */
export const listRoutes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Attaches a resource-based permission policy to the Amazon Web Services Migration Hub Refactor Spaces environment. The policy
 * must contain the same actions and condition statements as the
 * `arn:aws:ram::aws:permission/AWSRAMDefaultPermissionRefactorSpacesEnvironment`
 * permission in Resource Access Manager. The policy must not contain new lines or blank lines.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets an Amazon Web Services Migration Hub Refactor Spaces application.
 */
export const getApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists all the Amazon Web Services Migration Hub Refactor Spaces applications within an environment.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists all the Amazon Web Services Migration Hub Refactor Spaces services within an application.
 */
export const listServices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
