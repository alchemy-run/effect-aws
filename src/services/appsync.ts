import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://appsync.amazonaws.com");
const svc = T.AwsApiService({
  sdkId: "AppSync",
  serviceShapeName: "AWSDeepdishControlPlaneService",
});
const auth = T.AwsAuthSigv4({ name: "appsync" });
const ver = T.ServiceVersion("2017-07-25");
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
                        url: "https://appsync-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://appsync-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://appsync.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://appsync.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class AssociateApiRequest extends S.Class<AssociateApiRequest>(
  "AssociateApiRequest",
)(
  { domainName: S.String.pipe(T.HttpLabel()), apiId: S.String },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/v1/domainnames/{domainName}/apiassociation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SourceApiAssociationConfig extends S.Class<SourceApiAssociationConfig>(
  "SourceApiAssociationConfig",
)({ mergeType: S.optional(S.String) }) {}
export class AssociateSourceGraphqlApiRequest extends S.Class<AssociateSourceGraphqlApiRequest>(
  "AssociateSourceGraphqlApiRequest",
)(
  {
    mergedApiIdentifier: S.String.pipe(T.HttpLabel()),
    sourceApiIdentifier: S.String,
    description: S.optional(S.String),
    sourceApiAssociationConfig: S.optional(SourceApiAssociationConfig),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/v1/mergedApis/{mergedApiIdentifier}/sourceApiAssociations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateApiCacheRequest extends S.Class<CreateApiCacheRequest>(
  "CreateApiCacheRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    ttl: S.Number,
    transitEncryptionEnabled: S.optional(S.Boolean),
    atRestEncryptionEnabled: S.optional(S.Boolean),
    apiCachingBehavior: S.String,
    type: S.String,
    healthMetricsConfig: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}/ApiCaches" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateApiKeyRequest extends S.Class<CreateApiKeyRequest>(
  "CreateApiKeyRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    expires: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}/apikeys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateDomainNameRequest extends S.Class<CreateDomainNameRequest>(
  "CreateDomainNameRequest",
)(
  {
    domainName: S.String,
    certificateArn: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/domainnames" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTypeRequest extends S.Class<CreateTypeRequest>(
  "CreateTypeRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    definition: S.String,
    format: S.String,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}/types" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApiRequest extends S.Class<DeleteApiRequest>(
  "DeleteApiRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/v2/apis/{apiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApiResponse extends S.Class<DeleteApiResponse>(
  "DeleteApiResponse",
)({}, ns) {}
export class DeleteApiCacheRequest extends S.Class<DeleteApiCacheRequest>(
  "DeleteApiCacheRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}/ApiCaches" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApiCacheResponse extends S.Class<DeleteApiCacheResponse>(
  "DeleteApiCacheResponse",
)({}, ns) {}
export class DeleteApiKeyRequest extends S.Class<DeleteApiKeyRequest>(
  "DeleteApiKeyRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()), id: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}/apikeys/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApiKeyResponse extends S.Class<DeleteApiKeyResponse>(
  "DeleteApiKeyResponse",
)({}, ns) {}
export class DeleteChannelNamespaceRequest extends S.Class<DeleteChannelNamespaceRequest>(
  "DeleteChannelNamespaceRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()), name: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/v2/apis/{apiId}/channelNamespaces/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChannelNamespaceResponse extends S.Class<DeleteChannelNamespaceResponse>(
  "DeleteChannelNamespaceResponse",
)({}, ns) {}
export class DeleteDataSourceRequest extends S.Class<DeleteDataSourceRequest>(
  "DeleteDataSourceRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()), name: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}/datasources/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataSourceResponse extends S.Class<DeleteDataSourceResponse>(
  "DeleteDataSourceResponse",
)({}, ns) {}
export class DeleteDomainNameRequest extends S.Class<DeleteDomainNameRequest>(
  "DeleteDomainNameRequest",
)(
  { domainName: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/v1/domainnames/{domainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainNameResponse extends S.Class<DeleteDomainNameResponse>(
  "DeleteDomainNameResponse",
)({}, ns) {}
export class DeleteFunctionRequest extends S.Class<DeleteFunctionRequest>(
  "DeleteFunctionRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    functionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/v1/apis/{apiId}/functions/{functionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFunctionResponse extends S.Class<DeleteFunctionResponse>(
  "DeleteFunctionResponse",
)({}, ns) {}
export class DeleteGraphqlApiRequest extends S.Class<DeleteGraphqlApiRequest>(
  "DeleteGraphqlApiRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGraphqlApiResponse extends S.Class<DeleteGraphqlApiResponse>(
  "DeleteGraphqlApiResponse",
)({}, ns) {}
export class DeleteResolverRequest extends S.Class<DeleteResolverRequest>(
  "DeleteResolverRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    typeName: S.String.pipe(T.HttpLabel()),
    fieldName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/v1/apis/{apiId}/types/{typeName}/resolvers/{fieldName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResolverResponse extends S.Class<DeleteResolverResponse>(
  "DeleteResolverResponse",
)({}, ns) {}
export class DeleteTypeRequest extends S.Class<DeleteTypeRequest>(
  "DeleteTypeRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    typeName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}/types/{typeName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTypeResponse extends S.Class<DeleteTypeResponse>(
  "DeleteTypeResponse",
)({}, ns) {}
export class DisassociateApiRequest extends S.Class<DisassociateApiRequest>(
  "DisassociateApiRequest",
)(
  { domainName: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/v1/domainnames/{domainName}/apiassociation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateApiResponse extends S.Class<DisassociateApiResponse>(
  "DisassociateApiResponse",
)({}, ns) {}
export class DisassociateMergedGraphqlApiRequest extends S.Class<DisassociateMergedGraphqlApiRequest>(
  "DisassociateMergedGraphqlApiRequest",
)(
  {
    sourceApiIdentifier: S.String.pipe(T.HttpLabel()),
    associationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/v1/sourceApis/{sourceApiIdentifier}/mergedApiAssociations/{associationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateSourceGraphqlApiRequest extends S.Class<DisassociateSourceGraphqlApiRequest>(
  "DisassociateSourceGraphqlApiRequest",
)(
  {
    mergedApiIdentifier: S.String.pipe(T.HttpLabel()),
    associationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/v1/mergedApis/{mergedApiIdentifier}/sourceApiAssociations/{associationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AppSyncRuntime extends S.Class<AppSyncRuntime>("AppSyncRuntime")({
  name: S.String,
  runtimeVersion: S.String,
}) {}
export class EvaluateCodeRequest extends S.Class<EvaluateCodeRequest>(
  "EvaluateCodeRequest",
)(
  {
    runtime: AppSyncRuntime,
    code: S.String,
    context: S.String,
    function: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/dataplane-evaluatecode" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EvaluateMappingTemplateRequest extends S.Class<EvaluateMappingTemplateRequest>(
  "EvaluateMappingTemplateRequest",
)(
  { template: S.String, context: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/dataplane-evaluatetemplate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class FlushApiCacheRequest extends S.Class<FlushApiCacheRequest>(
  "FlushApiCacheRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}/FlushCache" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class FlushApiCacheResponse extends S.Class<FlushApiCacheResponse>(
  "FlushApiCacheResponse",
)({}, ns) {}
export class GetApiRequest extends S.Class<GetApiRequest>("GetApiRequest")(
  { apiId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v2/apis/{apiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApiAssociationRequest extends S.Class<GetApiAssociationRequest>(
  "GetApiAssociationRequest",
)(
  { domainName: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/v1/domainnames/{domainName}/apiassociation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApiCacheRequest extends S.Class<GetApiCacheRequest>(
  "GetApiCacheRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/ApiCaches" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetChannelNamespaceRequest extends S.Class<GetChannelNamespaceRequest>(
  "GetChannelNamespaceRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()), name: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v2/apis/{apiId}/channelNamespaces/{name}" }),
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
  { apiId: S.String.pipe(T.HttpLabel()), name: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/datasources/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataSourceIntrospectionRequest extends S.Class<GetDataSourceIntrospectionRequest>(
  "GetDataSourceIntrospectionRequest",
)(
  {
    introspectionId: S.String.pipe(T.HttpLabel()),
    includeModelsSDL: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeModelsSDL"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/v1/datasources/introspections/{introspectionId}",
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
  { domainName: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/domainnames/{domainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFunctionRequest extends S.Class<GetFunctionRequest>(
  "GetFunctionRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    functionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/functions/{functionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGraphqlApiRequest extends S.Class<GetGraphqlApiRequest>(
  "GetGraphqlApiRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGraphqlApiEnvironmentVariablesRequest extends S.Class<GetGraphqlApiEnvironmentVariablesRequest>(
  "GetGraphqlApiEnvironmentVariablesRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/environmentVariables" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIntrospectionSchemaRequest extends S.Class<GetIntrospectionSchemaRequest>(
  "GetIntrospectionSchemaRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    format: S.String.pipe(T.HttpQuery("format")),
    includeDirectives: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeDirectives"),
    ),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/schema" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResolverRequest extends S.Class<GetResolverRequest>(
  "GetResolverRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    typeName: S.String.pipe(T.HttpLabel()),
    fieldName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/v1/apis/{apiId}/types/{typeName}/resolvers/{fieldName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSchemaCreationStatusRequest extends S.Class<GetSchemaCreationStatusRequest>(
  "GetSchemaCreationStatusRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/schemacreation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSourceApiAssociationRequest extends S.Class<GetSourceApiAssociationRequest>(
  "GetSourceApiAssociationRequest",
)(
  {
    mergedApiIdentifier: S.String.pipe(T.HttpLabel()),
    associationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/v1/mergedApis/{mergedApiIdentifier}/sourceApiAssociations/{associationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTypeRequest extends S.Class<GetTypeRequest>("GetTypeRequest")(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    typeName: S.String.pipe(T.HttpLabel()),
    format: S.String.pipe(T.HttpQuery("format")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/types/{typeName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListApiKeysRequest extends S.Class<ListApiKeysRequest>(
  "ListApiKeysRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/apikeys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListApisRequest extends S.Class<ListApisRequest>(
  "ListApisRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v2/apis" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListChannelNamespacesRequest extends S.Class<ListChannelNamespacesRequest>(
  "ListChannelNamespacesRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v2/apis/{apiId}/channelNamespaces" }),
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
    apiId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/datasources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainNamesRequest extends S.Class<ListDomainNamesRequest>(
  "ListDomainNamesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/domainnames" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFunctionsRequest extends S.Class<ListFunctionsRequest>(
  "ListFunctionsRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/functions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGraphqlApisRequest extends S.Class<ListGraphqlApisRequest>(
  "ListGraphqlApisRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    apiType: S.optional(S.String).pipe(T.HttpQuery("apiType")),
    owner: S.optional(S.String).pipe(T.HttpQuery("owner")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResolversRequest extends S.Class<ListResolversRequest>(
  "ListResolversRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    typeName: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/v1/apis/{apiId}/types/{typeName}/resolvers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResolversByFunctionRequest extends S.Class<ListResolversByFunctionRequest>(
  "ListResolversByFunctionRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    functionId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/v1/apis/{apiId}/functions/{functionId}/resolvers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSourceApiAssociationsRequest extends S.Class<ListSourceApiAssociationsRequest>(
  "ListSourceApiAssociationsRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/sourceApiAssociations" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTypesRequest extends S.Class<ListTypesRequest>(
  "ListTypesRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    format: S.String.pipe(T.HttpQuery("format")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/v1/apis/{apiId}/types" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTypesByAssociationRequest extends S.Class<ListTypesByAssociationRequest>(
  "ListTypesByAssociationRequest",
)(
  {
    mergedApiIdentifier: S.String.pipe(T.HttpLabel()),
    associationId: S.String.pipe(T.HttpLabel()),
    format: S.String.pipe(T.HttpQuery("format")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/v1/mergedApis/{mergedApiIdentifier}/sourceApiAssociations/{associationId}/types",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartSchemaCreationRequest extends S.Class<StartSchemaCreationRequest>(
  "StartSchemaCreationRequest",
)(
  { apiId: S.String.pipe(T.HttpLabel()), definition: T.Blob },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}/schemacreation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartSchemaMergeRequest extends S.Class<StartSchemaMergeRequest>(
  "StartSchemaMergeRequest",
)(
  {
    associationId: S.String.pipe(T.HttpLabel()),
    mergedApiIdentifier: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/v1/mergedApis/{mergedApiIdentifier}/sourceApiAssociations/{associationId}/merge",
    }),
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
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class CognitoConfig extends S.Class<CognitoConfig>("CognitoConfig")({
  userPoolId: S.String,
  awsRegion: S.String,
  appIdClientRegex: S.optional(S.String),
}) {}
export class OpenIDConnectConfig extends S.Class<OpenIDConnectConfig>(
  "OpenIDConnectConfig",
)({
  issuer: S.String,
  clientId: S.optional(S.String),
  iatTTL: S.optional(S.Number),
  authTTL: S.optional(S.Number),
}) {}
export class LambdaAuthorizerConfig extends S.Class<LambdaAuthorizerConfig>(
  "LambdaAuthorizerConfig",
)({
  authorizerResultTtlInSeconds: S.optional(S.Number),
  authorizerUri: S.String,
  identityValidationExpression: S.optional(S.String),
}) {}
export class AuthProvider extends S.Class<AuthProvider>("AuthProvider")({
  authType: S.String,
  cognitoConfig: S.optional(CognitoConfig),
  openIDConnectConfig: S.optional(OpenIDConnectConfig),
  lambdaAuthorizerConfig: S.optional(LambdaAuthorizerConfig),
}) {}
export const AuthProviders = S.Array(AuthProvider);
export class AuthMode extends S.Class<AuthMode>("AuthMode")({
  authType: S.String,
}) {}
export const AuthModes = S.Array(AuthMode);
export class EventLogConfig extends S.Class<EventLogConfig>("EventLogConfig")({
  logLevel: S.String,
  cloudWatchLogsRoleArn: S.String,
}) {}
export class EventConfig extends S.Class<EventConfig>("EventConfig")({
  authProviders: AuthProviders,
  connectionAuthModes: AuthModes,
  defaultPublishAuthModes: AuthModes,
  defaultSubscribeAuthModes: AuthModes,
  logConfig: S.optional(EventLogConfig),
}) {}
export class UpdateApiRequest extends S.Class<UpdateApiRequest>(
  "UpdateApiRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    name: S.String,
    ownerContact: S.optional(S.String),
    eventConfig: EventConfig,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v2/apis/{apiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApiCacheRequest extends S.Class<UpdateApiCacheRequest>(
  "UpdateApiCacheRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    ttl: S.Number,
    apiCachingBehavior: S.String,
    type: S.String,
    healthMetricsConfig: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}/ApiCaches/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApiKeyRequest extends S.Class<UpdateApiKeyRequest>(
  "UpdateApiKeyRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    id: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    expires: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}/apikeys/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LambdaConfig extends S.Class<LambdaConfig>("LambdaConfig")({
  invokeType: S.optional(S.String),
}) {}
export class Integration extends S.Class<Integration>("Integration")({
  dataSourceName: S.String,
  lambdaConfig: S.optional(LambdaConfig),
}) {}
export class HandlerConfig extends S.Class<HandlerConfig>("HandlerConfig")({
  behavior: S.String,
  integration: Integration,
}) {}
export class HandlerConfigs extends S.Class<HandlerConfigs>("HandlerConfigs")({
  onPublish: S.optional(HandlerConfig),
  onSubscribe: S.optional(HandlerConfig),
}) {}
export class UpdateChannelNamespaceRequest extends S.Class<UpdateChannelNamespaceRequest>(
  "UpdateChannelNamespaceRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    name: S.String.pipe(T.HttpLabel()),
    subscribeAuthModes: S.optional(AuthModes),
    publishAuthModes: S.optional(AuthModes),
    codeHandlers: S.optional(S.String),
    handlerConfigs: S.optional(HandlerConfigs),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/v2/apis/{apiId}/channelNamespaces/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeltaSyncConfig extends S.Class<DeltaSyncConfig>(
  "DeltaSyncConfig",
)({
  baseTableTTL: S.optional(S.Number),
  deltaSyncTableName: S.optional(S.String),
  deltaSyncTableTTL: S.optional(S.Number),
}) {}
export class DynamodbDataSourceConfig extends S.Class<DynamodbDataSourceConfig>(
  "DynamodbDataSourceConfig",
)({
  tableName: S.String,
  awsRegion: S.String,
  useCallerCredentials: S.optional(S.Boolean),
  deltaSyncConfig: S.optional(DeltaSyncConfig),
  versioned: S.optional(S.Boolean),
}) {}
export class LambdaDataSourceConfig extends S.Class<LambdaDataSourceConfig>(
  "LambdaDataSourceConfig",
)({ lambdaFunctionArn: S.String }) {}
export class ElasticsearchDataSourceConfig extends S.Class<ElasticsearchDataSourceConfig>(
  "ElasticsearchDataSourceConfig",
)({ endpoint: S.String, awsRegion: S.String }) {}
export class OpenSearchServiceDataSourceConfig extends S.Class<OpenSearchServiceDataSourceConfig>(
  "OpenSearchServiceDataSourceConfig",
)({ endpoint: S.String, awsRegion: S.String }) {}
export class AwsIamConfig extends S.Class<AwsIamConfig>("AwsIamConfig")({
  signingRegion: S.optional(S.String),
  signingServiceName: S.optional(S.String),
}) {}
export class AuthorizationConfig extends S.Class<AuthorizationConfig>(
  "AuthorizationConfig",
)({ authorizationType: S.String, awsIamConfig: S.optional(AwsIamConfig) }) {}
export class HttpDataSourceConfig extends S.Class<HttpDataSourceConfig>(
  "HttpDataSourceConfig",
)({
  endpoint: S.optional(S.String),
  authorizationConfig: S.optional(AuthorizationConfig),
}) {}
export class RdsHttpEndpointConfig extends S.Class<RdsHttpEndpointConfig>(
  "RdsHttpEndpointConfig",
)({
  awsRegion: S.optional(S.String),
  dbClusterIdentifier: S.optional(S.String),
  databaseName: S.optional(S.String),
  schema: S.optional(S.String),
  awsSecretStoreArn: S.optional(S.String),
}) {}
export class RelationalDatabaseDataSourceConfig extends S.Class<RelationalDatabaseDataSourceConfig>(
  "RelationalDatabaseDataSourceConfig",
)({
  relationalDatabaseSourceType: S.optional(S.String),
  rdsHttpEndpointConfig: S.optional(RdsHttpEndpointConfig),
}) {}
export class EventBridgeDataSourceConfig extends S.Class<EventBridgeDataSourceConfig>(
  "EventBridgeDataSourceConfig",
)({ eventBusArn: S.String }) {}
export class UpdateDataSourceRequest extends S.Class<UpdateDataSourceRequest>(
  "UpdateDataSourceRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    name: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    type: S.String,
    serviceRoleArn: S.optional(S.String),
    dynamodbConfig: S.optional(DynamodbDataSourceConfig),
    lambdaConfig: S.optional(LambdaDataSourceConfig),
    elasticsearchConfig: S.optional(ElasticsearchDataSourceConfig),
    openSearchServiceConfig: S.optional(OpenSearchServiceDataSourceConfig),
    httpConfig: S.optional(HttpDataSourceConfig),
    relationalDatabaseConfig: S.optional(RelationalDatabaseDataSourceConfig),
    eventBridgeConfig: S.optional(EventBridgeDataSourceConfig),
    metricsConfig: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}/datasources/{name}" }),
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
    domainName: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/domainnames/{domainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LambdaConflictHandlerConfig extends S.Class<LambdaConflictHandlerConfig>(
  "LambdaConflictHandlerConfig",
)({ lambdaConflictHandlerArn: S.optional(S.String) }) {}
export class SyncConfig extends S.Class<SyncConfig>("SyncConfig")({
  conflictHandler: S.optional(S.String),
  conflictDetection: S.optional(S.String),
  lambdaConflictHandlerConfig: S.optional(LambdaConflictHandlerConfig),
}) {}
export class UpdateFunctionRequest extends S.Class<UpdateFunctionRequest>(
  "UpdateFunctionRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    name: S.String,
    description: S.optional(S.String),
    functionId: S.String.pipe(T.HttpLabel()),
    dataSourceName: S.String,
    requestMappingTemplate: S.optional(S.String),
    responseMappingTemplate: S.optional(S.String),
    functionVersion: S.optional(S.String),
    syncConfig: S.optional(SyncConfig),
    maxBatchSize: S.optional(S.Number),
    runtime: S.optional(AppSyncRuntime),
    code: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}/functions/{functionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LogConfig extends S.Class<LogConfig>("LogConfig")({
  fieldLogLevel: S.String,
  cloudWatchLogsRoleArn: S.String,
  excludeVerboseContent: S.optional(S.Boolean),
}) {}
export class UserPoolConfig extends S.Class<UserPoolConfig>("UserPoolConfig")({
  userPoolId: S.String,
  awsRegion: S.String,
  defaultAction: S.String,
  appIdClientRegex: S.optional(S.String),
}) {}
export class CognitoUserPoolConfig extends S.Class<CognitoUserPoolConfig>(
  "CognitoUserPoolConfig",
)({
  userPoolId: S.String,
  awsRegion: S.String,
  appIdClientRegex: S.optional(S.String),
}) {}
export class AdditionalAuthenticationProvider extends S.Class<AdditionalAuthenticationProvider>(
  "AdditionalAuthenticationProvider",
)({
  authenticationType: S.optional(S.String),
  openIDConnectConfig: S.optional(OpenIDConnectConfig),
  userPoolConfig: S.optional(CognitoUserPoolConfig),
  lambdaAuthorizerConfig: S.optional(LambdaAuthorizerConfig),
}) {}
export const AdditionalAuthenticationProviders = S.Array(
  AdditionalAuthenticationProvider,
);
export class EnhancedMetricsConfig extends S.Class<EnhancedMetricsConfig>(
  "EnhancedMetricsConfig",
)({
  resolverLevelMetricsBehavior: S.String,
  dataSourceLevelMetricsBehavior: S.String,
  operationLevelMetricsConfig: S.String,
}) {}
export class UpdateGraphqlApiRequest extends S.Class<UpdateGraphqlApiRequest>(
  "UpdateGraphqlApiRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    name: S.String,
    logConfig: S.optional(LogConfig),
    authenticationType: S.String,
    userPoolConfig: S.optional(UserPoolConfig),
    openIDConnectConfig: S.optional(OpenIDConnectConfig),
    additionalAuthenticationProviders: S.optional(
      AdditionalAuthenticationProviders,
    ),
    xrayEnabled: S.optional(S.Boolean),
    lambdaAuthorizerConfig: S.optional(LambdaAuthorizerConfig),
    mergedApiExecutionRoleArn: S.optional(S.String),
    ownerContact: S.optional(S.String),
    introspectionConfig: S.optional(S.String),
    queryDepthLimit: S.optional(S.Number),
    resolverCountLimit: S.optional(S.Number),
    enhancedMetricsConfig: S.optional(EnhancedMetricsConfig),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FunctionsIds = S.Array(S.String);
export class PipelineConfig extends S.Class<PipelineConfig>("PipelineConfig")({
  functions: S.optional(FunctionsIds),
}) {}
export const CachingKeys = S.Array(S.String);
export class CachingConfig extends S.Class<CachingConfig>("CachingConfig")({
  ttl: S.Number,
  cachingKeys: S.optional(CachingKeys),
}) {}
export class UpdateResolverRequest extends S.Class<UpdateResolverRequest>(
  "UpdateResolverRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    typeName: S.String.pipe(T.HttpLabel()),
    fieldName: S.String.pipe(T.HttpLabel()),
    dataSourceName: S.optional(S.String),
    requestMappingTemplate: S.optional(S.String),
    responseMappingTemplate: S.optional(S.String),
    kind: S.optional(S.String),
    pipelineConfig: S.optional(PipelineConfig),
    syncConfig: S.optional(SyncConfig),
    cachingConfig: S.optional(CachingConfig),
    maxBatchSize: S.optional(S.Number),
    runtime: S.optional(AppSyncRuntime),
    code: S.optional(S.String),
    metricsConfig: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/v1/apis/{apiId}/types/{typeName}/resolvers/{fieldName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSourceApiAssociationRequest extends S.Class<UpdateSourceApiAssociationRequest>(
  "UpdateSourceApiAssociationRequest",
)(
  {
    associationId: S.String.pipe(T.HttpLabel()),
    mergedApiIdentifier: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    sourceApiAssociationConfig: S.optional(SourceApiAssociationConfig),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/v1/mergedApis/{mergedApiIdentifier}/sourceApiAssociations/{associationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTypeRequest extends S.Class<UpdateTypeRequest>(
  "UpdateTypeRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    typeName: S.String.pipe(T.HttpLabel()),
    definition: S.optional(S.String),
    format: S.String,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}/types/{typeName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Logs = S.Array(S.String);
export class ApiKey extends S.Class<ApiKey>("ApiKey")({
  id: S.optional(S.String),
  description: S.optional(S.String),
  expires: S.optional(S.Number),
  deletes: S.optional(S.Number),
}) {}
export const ApiKeys = S.Array(ApiKey);
export const MapOfStringToString = S.Record({ key: S.String, value: S.String });
export class Api extends S.Class<Api>("Api")({
  apiId: S.optional(S.String),
  name: S.optional(S.String),
  ownerContact: S.optional(S.String),
  tags: S.optional(TagMap),
  dns: S.optional(MapOfStringToString),
  apiArn: S.optional(S.String),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  xrayEnabled: S.optional(S.Boolean),
  wafWebAclArn: S.optional(S.String),
  eventConfig: S.optional(EventConfig),
}) {}
export const Apis = S.Array(Api);
export class ChannelNamespace extends S.Class<ChannelNamespace>(
  "ChannelNamespace",
)({
  apiId: S.optional(S.String),
  name: S.optional(S.String),
  subscribeAuthModes: S.optional(AuthModes),
  publishAuthModes: S.optional(AuthModes),
  codeHandlers: S.optional(S.String),
  tags: S.optional(TagMap),
  channelNamespaceArn: S.optional(S.String),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  handlerConfigs: S.optional(HandlerConfigs),
}) {}
export const ChannelNamespaces = S.Array(ChannelNamespace);
export class DataSource extends S.Class<DataSource>("DataSource")({
  dataSourceArn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  type: S.optional(S.String),
  serviceRoleArn: S.optional(S.String),
  dynamodbConfig: S.optional(DynamodbDataSourceConfig),
  lambdaConfig: S.optional(LambdaDataSourceConfig),
  elasticsearchConfig: S.optional(ElasticsearchDataSourceConfig),
  openSearchServiceConfig: S.optional(OpenSearchServiceDataSourceConfig),
  httpConfig: S.optional(HttpDataSourceConfig),
  relationalDatabaseConfig: S.optional(RelationalDatabaseDataSourceConfig),
  eventBridgeConfig: S.optional(EventBridgeDataSourceConfig),
  metricsConfig: S.optional(S.String),
}) {}
export const DataSources = S.Array(DataSource);
export class DomainNameConfig extends S.Class<DomainNameConfig>(
  "DomainNameConfig",
)({
  domainName: S.optional(S.String),
  description: S.optional(S.String),
  certificateArn: S.optional(S.String),
  appsyncDomainName: S.optional(S.String),
  hostedZoneId: S.optional(S.String),
  tags: S.optional(TagMap),
  domainNameArn: S.optional(S.String),
}) {}
export const DomainNameConfigs = S.Array(DomainNameConfig);
export class FunctionConfiguration extends S.Class<FunctionConfiguration>(
  "FunctionConfiguration",
)({
  functionId: S.optional(S.String),
  functionArn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  dataSourceName: S.optional(S.String),
  requestMappingTemplate: S.optional(S.String),
  responseMappingTemplate: S.optional(S.String),
  functionVersion: S.optional(S.String),
  syncConfig: S.optional(SyncConfig),
  maxBatchSize: S.optional(S.Number),
  runtime: S.optional(AppSyncRuntime),
  code: S.optional(S.String),
}) {}
export const Functions = S.Array(FunctionConfiguration);
export class GraphqlApi extends S.Class<GraphqlApi>("GraphqlApi")({
  name: S.optional(S.String),
  apiId: S.optional(S.String),
  authenticationType: S.optional(S.String),
  logConfig: S.optional(LogConfig),
  userPoolConfig: S.optional(UserPoolConfig),
  openIDConnectConfig: S.optional(OpenIDConnectConfig),
  arn: S.optional(S.String),
  uris: S.optional(MapOfStringToString),
  tags: S.optional(TagMap),
  additionalAuthenticationProviders: S.optional(
    AdditionalAuthenticationProviders,
  ),
  xrayEnabled: S.optional(S.Boolean),
  wafWebAclArn: S.optional(S.String),
  lambdaAuthorizerConfig: S.optional(LambdaAuthorizerConfig),
  dns: S.optional(MapOfStringToString),
  visibility: S.optional(S.String),
  apiType: S.optional(S.String),
  mergedApiExecutionRoleArn: S.optional(S.String),
  owner: S.optional(S.String),
  ownerContact: S.optional(S.String),
  introspectionConfig: S.optional(S.String),
  queryDepthLimit: S.optional(S.Number),
  resolverCountLimit: S.optional(S.Number),
  enhancedMetricsConfig: S.optional(EnhancedMetricsConfig),
}) {}
export const GraphqlApis = S.Array(GraphqlApi);
export class Resolver extends S.Class<Resolver>("Resolver")({
  typeName: S.optional(S.String),
  fieldName: S.optional(S.String),
  dataSourceName: S.optional(S.String),
  resolverArn: S.optional(S.String),
  requestMappingTemplate: S.optional(S.String),
  responseMappingTemplate: S.optional(S.String),
  kind: S.optional(S.String),
  pipelineConfig: S.optional(PipelineConfig),
  syncConfig: S.optional(SyncConfig),
  cachingConfig: S.optional(CachingConfig),
  maxBatchSize: S.optional(S.Number),
  runtime: S.optional(AppSyncRuntime),
  code: S.optional(S.String),
  metricsConfig: S.optional(S.String),
}) {}
export const Resolvers = S.Array(Resolver);
export class Type extends S.Class<Type>("Type")({
  name: S.optional(S.String),
  description: S.optional(S.String),
  arn: S.optional(S.String),
  definition: S.optional(S.String),
  format: S.optional(S.String),
}) {}
export const TypeList = S.Array(Type);
export const EnvironmentVariableMap = S.Record({
  key: S.String,
  value: S.String,
});
export class RdsDataApiConfig extends S.Class<RdsDataApiConfig>(
  "RdsDataApiConfig",
)({ resourceArn: S.String, secretArn: S.String, databaseName: S.String }) {}
export class AssociateMergedGraphqlApiRequest extends S.Class<AssociateMergedGraphqlApiRequest>(
  "AssociateMergedGraphqlApiRequest",
)(
  {
    sourceApiIdentifier: S.String.pipe(T.HttpLabel()),
    mergedApiIdentifier: S.String,
    description: S.optional(S.String),
    sourceApiAssociationConfig: S.optional(SourceApiAssociationConfig),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/v1/sourceApis/{sourceApiIdentifier}/mergedApiAssociations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResolverRequest extends S.Class<CreateResolverRequest>(
  "CreateResolverRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    typeName: S.String.pipe(T.HttpLabel()),
    fieldName: S.String,
    dataSourceName: S.optional(S.String),
    requestMappingTemplate: S.optional(S.String),
    responseMappingTemplate: S.optional(S.String),
    kind: S.optional(S.String),
    pipelineConfig: S.optional(PipelineConfig),
    syncConfig: S.optional(SyncConfig),
    cachingConfig: S.optional(CachingConfig),
    maxBatchSize: S.optional(S.Number),
    runtime: S.optional(AppSyncRuntime),
    code: S.optional(S.String),
    metricsConfig: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/v1/apis/{apiId}/types/{typeName}/resolvers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateMergedGraphqlApiResponse extends S.Class<DisassociateMergedGraphqlApiResponse>(
  "DisassociateMergedGraphqlApiResponse",
)({ sourceApiAssociationStatus: S.optional(S.String) }, ns) {}
export class DisassociateSourceGraphqlApiResponse extends S.Class<DisassociateSourceGraphqlApiResponse>(
  "DisassociateSourceGraphqlApiResponse",
)({ sourceApiAssociationStatus: S.optional(S.String) }, ns) {}
export class ApiAssociation extends S.Class<ApiAssociation>("ApiAssociation")({
  domainName: S.optional(S.String),
  apiId: S.optional(S.String),
  associationStatus: S.optional(S.String),
  deploymentDetail: S.optional(S.String),
}) {}
export class GetApiAssociationResponse extends S.Class<GetApiAssociationResponse>(
  "GetApiAssociationResponse",
)({ apiAssociation: S.optional(ApiAssociation) }, ns) {}
export class ApiCache extends S.Class<ApiCache>("ApiCache")({
  ttl: S.optional(S.Number),
  apiCachingBehavior: S.optional(S.String),
  transitEncryptionEnabled: S.optional(S.Boolean),
  atRestEncryptionEnabled: S.optional(S.Boolean),
  type: S.optional(S.String),
  status: S.optional(S.String),
  healthMetricsConfig: S.optional(S.String),
}) {}
export class GetApiCacheResponse extends S.Class<GetApiCacheResponse>(
  "GetApiCacheResponse",
)({ apiCache: S.optional(ApiCache) }, ns) {}
export class GetDomainNameResponse extends S.Class<GetDomainNameResponse>(
  "GetDomainNameResponse",
)({ domainNameConfig: S.optional(DomainNameConfig) }, ns) {}
export class GetGraphqlApiEnvironmentVariablesResponse extends S.Class<GetGraphqlApiEnvironmentVariablesResponse>(
  "GetGraphqlApiEnvironmentVariablesResponse",
)({ environmentVariables: S.optional(EnvironmentVariableMap) }, ns) {}
export class GetIntrospectionSchemaResponse extends S.Class<GetIntrospectionSchemaResponse>(
  "GetIntrospectionSchemaResponse",
)({ schema: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }, ns) {}
export class GetSchemaCreationStatusResponse extends S.Class<GetSchemaCreationStatusResponse>(
  "GetSchemaCreationStatusResponse",
)({ status: S.optional(S.String), details: S.optional(S.String) }, ns) {}
export class SourceApiAssociation extends S.Class<SourceApiAssociation>(
  "SourceApiAssociation",
)({
  associationId: S.optional(S.String),
  associationArn: S.optional(S.String),
  sourceApiId: S.optional(S.String),
  sourceApiArn: S.optional(S.String),
  mergedApiArn: S.optional(S.String),
  mergedApiId: S.optional(S.String),
  description: S.optional(S.String),
  sourceApiAssociationConfig: S.optional(SourceApiAssociationConfig),
  sourceApiAssociationStatus: S.optional(S.String),
  sourceApiAssociationStatusDetail: S.optional(S.String),
  lastSuccessfulMergeDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class GetSourceApiAssociationResponse extends S.Class<GetSourceApiAssociationResponse>(
  "GetSourceApiAssociationResponse",
)({ sourceApiAssociation: S.optional(SourceApiAssociation) }, ns) {}
export class GetTypeResponse extends S.Class<GetTypeResponse>(
  "GetTypeResponse",
)({ type: S.optional(Type) }, ns) {}
export class ListApiKeysResponse extends S.Class<ListApiKeysResponse>(
  "ListApiKeysResponse",
)({ apiKeys: S.optional(ApiKeys), nextToken: S.optional(S.String) }, ns) {}
export class ListApisResponse extends S.Class<ListApisResponse>(
  "ListApisResponse",
)({ apis: S.optional(Apis), nextToken: S.optional(S.String) }, ns) {}
export class ListChannelNamespacesResponse extends S.Class<ListChannelNamespacesResponse>(
  "ListChannelNamespacesResponse",
)(
  {
    channelNamespaces: S.optional(ChannelNamespaces),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDataSourcesResponse extends S.Class<ListDataSourcesResponse>(
  "ListDataSourcesResponse",
)(
  { dataSources: S.optional(DataSources), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListDomainNamesResponse extends S.Class<ListDomainNamesResponse>(
  "ListDomainNamesResponse",
)(
  {
    domainNameConfigs: S.optional(DomainNameConfigs),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListFunctionsResponse extends S.Class<ListFunctionsResponse>(
  "ListFunctionsResponse",
)({ functions: S.optional(Functions), nextToken: S.optional(S.String) }, ns) {}
export class ListGraphqlApisResponse extends S.Class<ListGraphqlApisResponse>(
  "ListGraphqlApisResponse",
)(
  { graphqlApis: S.optional(GraphqlApis), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListResolversResponse extends S.Class<ListResolversResponse>(
  "ListResolversResponse",
)({ resolvers: S.optional(Resolvers), nextToken: S.optional(S.String) }, ns) {}
export class ListResolversByFunctionResponse extends S.Class<ListResolversByFunctionResponse>(
  "ListResolversByFunctionResponse",
)({ resolvers: S.optional(Resolvers), nextToken: S.optional(S.String) }, ns) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }, ns) {}
export class ListTypesResponse extends S.Class<ListTypesResponse>(
  "ListTypesResponse",
)({ types: S.optional(TypeList), nextToken: S.optional(S.String) }, ns) {}
export class ListTypesByAssociationResponse extends S.Class<ListTypesByAssociationResponse>(
  "ListTypesByAssociationResponse",
)({ types: S.optional(TypeList), nextToken: S.optional(S.String) }, ns) {}
export class PutGraphqlApiEnvironmentVariablesRequest extends S.Class<PutGraphqlApiEnvironmentVariablesRequest>(
  "PutGraphqlApiEnvironmentVariablesRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    environmentVariables: EnvironmentVariableMap,
  },
  T.all(
    ns,
    T.Http({ method: "PUT", uri: "/v1/apis/{apiId}/environmentVariables" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDataSourceIntrospectionRequest extends S.Class<StartDataSourceIntrospectionRequest>(
  "StartDataSourceIntrospectionRequest",
)(
  { rdsDataApiConfig: S.optional(RdsDataApiConfig) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/datasources/introspections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartSchemaCreationResponse extends S.Class<StartSchemaCreationResponse>(
  "StartSchemaCreationResponse",
)({ status: S.optional(S.String) }, ns) {}
export class StartSchemaMergeResponse extends S.Class<StartSchemaMergeResponse>(
  "StartSchemaMergeResponse",
)({ sourceApiAssociationStatus: S.optional(S.String) }, ns) {}
export class UpdateApiResponse extends S.Class<UpdateApiResponse>(
  "UpdateApiResponse",
)({ api: S.optional(Api) }, ns) {}
export class UpdateApiCacheResponse extends S.Class<UpdateApiCacheResponse>(
  "UpdateApiCacheResponse",
)({ apiCache: S.optional(ApiCache) }, ns) {}
export class UpdateApiKeyResponse extends S.Class<UpdateApiKeyResponse>(
  "UpdateApiKeyResponse",
)({ apiKey: S.optional(ApiKey) }, ns) {}
export class UpdateChannelNamespaceResponse extends S.Class<UpdateChannelNamespaceResponse>(
  "UpdateChannelNamespaceResponse",
)({ channelNamespace: S.optional(ChannelNamespace) }, ns) {}
export class UpdateDataSourceResponse extends S.Class<UpdateDataSourceResponse>(
  "UpdateDataSourceResponse",
)({ dataSource: S.optional(DataSource) }, ns) {}
export class UpdateDomainNameResponse extends S.Class<UpdateDomainNameResponse>(
  "UpdateDomainNameResponse",
)({ domainNameConfig: S.optional(DomainNameConfig) }, ns) {}
export class UpdateFunctionResponse extends S.Class<UpdateFunctionResponse>(
  "UpdateFunctionResponse",
)({ functionConfiguration: S.optional(FunctionConfiguration) }, ns) {}
export class UpdateGraphqlApiResponse extends S.Class<UpdateGraphqlApiResponse>(
  "UpdateGraphqlApiResponse",
)({ graphqlApi: S.optional(GraphqlApi) }, ns) {}
export class UpdateResolverResponse extends S.Class<UpdateResolverResponse>(
  "UpdateResolverResponse",
)({ resolver: S.optional(Resolver) }, ns) {}
export class UpdateSourceApiAssociationResponse extends S.Class<UpdateSourceApiAssociationResponse>(
  "UpdateSourceApiAssociationResponse",
)({ sourceApiAssociation: S.optional(SourceApiAssociation) }, ns) {}
export class UpdateTypeResponse extends S.Class<UpdateTypeResponse>(
  "UpdateTypeResponse",
)({ type: S.optional(Type) }, ns) {}
export class CodeErrorLocation extends S.Class<CodeErrorLocation>(
  "CodeErrorLocation",
)({
  line: S.optional(S.Number),
  column: S.optional(S.Number),
  span: S.optional(S.Number),
}) {}
export class CodeError extends S.Class<CodeError>("CodeError")({
  errorType: S.optional(S.String),
  value: S.optional(S.String),
  location: S.optional(CodeErrorLocation),
}) {}
export const CodeErrors = S.Array(CodeError);
export class EvaluateCodeErrorDetail extends S.Class<EvaluateCodeErrorDetail>(
  "EvaluateCodeErrorDetail",
)({ message: S.optional(S.String), codeErrors: S.optional(CodeErrors) }) {}
export class ErrorDetail extends S.Class<ErrorDetail>("ErrorDetail")({
  message: S.optional(S.String),
}) {}
export class SourceApiAssociationSummary extends S.Class<SourceApiAssociationSummary>(
  "SourceApiAssociationSummary",
)({
  associationId: S.optional(S.String),
  associationArn: S.optional(S.String),
  sourceApiId: S.optional(S.String),
  sourceApiArn: S.optional(S.String),
  mergedApiId: S.optional(S.String),
  mergedApiArn: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export const SourceApiAssociationSummaryList = S.Array(
  SourceApiAssociationSummary,
);
export const DataSourceIntrospectionModelIndexFields = S.Array(S.String);
export class DataSourceIntrospectionModelIndex extends S.Class<DataSourceIntrospectionModelIndex>(
  "DataSourceIntrospectionModelIndex",
)({
  name: S.optional(S.String),
  fields: S.optional(DataSourceIntrospectionModelIndexFields),
}) {}
export const DataSourceIntrospectionModelIndexes = S.Array(
  DataSourceIntrospectionModelIndex,
);
export class AssociateApiResponse extends S.Class<AssociateApiResponse>(
  "AssociateApiResponse",
)({ apiAssociation: S.optional(ApiAssociation) }, ns) {}
export class AssociateMergedGraphqlApiResponse extends S.Class<AssociateMergedGraphqlApiResponse>(
  "AssociateMergedGraphqlApiResponse",
)({ sourceApiAssociation: S.optional(SourceApiAssociation) }, ns) {}
export class AssociateSourceGraphqlApiResponse extends S.Class<AssociateSourceGraphqlApiResponse>(
  "AssociateSourceGraphqlApiResponse",
)({ sourceApiAssociation: S.optional(SourceApiAssociation) }, ns) {}
export class CreateApiCacheResponse extends S.Class<CreateApiCacheResponse>(
  "CreateApiCacheResponse",
)({ apiCache: S.optional(ApiCache) }, ns) {}
export class CreateApiKeyResponse extends S.Class<CreateApiKeyResponse>(
  "CreateApiKeyResponse",
)({ apiKey: S.optional(ApiKey) }, ns) {}
export class CreateDomainNameResponse extends S.Class<CreateDomainNameResponse>(
  "CreateDomainNameResponse",
)({ domainNameConfig: S.optional(DomainNameConfig) }, ns) {}
export class CreateFunctionRequest extends S.Class<CreateFunctionRequest>(
  "CreateFunctionRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    name: S.String,
    description: S.optional(S.String),
    dataSourceName: S.String,
    requestMappingTemplate: S.optional(S.String),
    responseMappingTemplate: S.optional(S.String),
    functionVersion: S.optional(S.String),
    syncConfig: S.optional(SyncConfig),
    maxBatchSize: S.optional(S.Number),
    runtime: S.optional(AppSyncRuntime),
    code: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}/functions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGraphqlApiRequest extends S.Class<CreateGraphqlApiRequest>(
  "CreateGraphqlApiRequest",
)(
  {
    name: S.String,
    logConfig: S.optional(LogConfig),
    authenticationType: S.String,
    userPoolConfig: S.optional(UserPoolConfig),
    openIDConnectConfig: S.optional(OpenIDConnectConfig),
    tags: S.optional(TagMap),
    additionalAuthenticationProviders: S.optional(
      AdditionalAuthenticationProviders,
    ),
    xrayEnabled: S.optional(S.Boolean),
    lambdaAuthorizerConfig: S.optional(LambdaAuthorizerConfig),
    apiType: S.optional(S.String),
    mergedApiExecutionRoleArn: S.optional(S.String),
    visibility: S.optional(S.String),
    ownerContact: S.optional(S.String),
    introspectionConfig: S.optional(S.String),
    queryDepthLimit: S.optional(S.Number),
    resolverCountLimit: S.optional(S.Number),
    enhancedMetricsConfig: S.optional(EnhancedMetricsConfig),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResolverResponse extends S.Class<CreateResolverResponse>(
  "CreateResolverResponse",
)({ resolver: S.optional(Resolver) }, ns) {}
export class CreateTypeResponse extends S.Class<CreateTypeResponse>(
  "CreateTypeResponse",
)({ type: S.optional(Type) }, ns) {}
export class EvaluateCodeResponse extends S.Class<EvaluateCodeResponse>(
  "EvaluateCodeResponse",
)(
  {
    evaluationResult: S.optional(S.String),
    error: S.optional(EvaluateCodeErrorDetail),
    logs: S.optional(Logs),
    stash: S.optional(S.String),
    outErrors: S.optional(S.String),
  },
  ns,
) {}
export class EvaluateMappingTemplateResponse extends S.Class<EvaluateMappingTemplateResponse>(
  "EvaluateMappingTemplateResponse",
)(
  {
    evaluationResult: S.optional(S.String),
    error: S.optional(ErrorDetail),
    logs: S.optional(Logs),
    stash: S.optional(S.String),
    outErrors: S.optional(S.String),
  },
  ns,
) {}
export class GetChannelNamespaceResponse extends S.Class<GetChannelNamespaceResponse>(
  "GetChannelNamespaceResponse",
)({ channelNamespace: S.optional(ChannelNamespace) }, ns) {}
export class GetDataSourceResponse extends S.Class<GetDataSourceResponse>(
  "GetDataSourceResponse",
)({ dataSource: S.optional(DataSource) }, ns) {}
export class GetFunctionResponse extends S.Class<GetFunctionResponse>(
  "GetFunctionResponse",
)({ functionConfiguration: S.optional(FunctionConfiguration) }, ns) {}
export class GetGraphqlApiResponse extends S.Class<GetGraphqlApiResponse>(
  "GetGraphqlApiResponse",
)({ graphqlApi: S.optional(GraphqlApi) }, ns) {}
export class GetResolverResponse extends S.Class<GetResolverResponse>(
  "GetResolverResponse",
)({ resolver: S.optional(Resolver) }, ns) {}
export class ListSourceApiAssociationsResponse extends S.Class<ListSourceApiAssociationsResponse>(
  "ListSourceApiAssociationsResponse",
)(
  {
    sourceApiAssociationSummaries: S.optional(SourceApiAssociationSummaryList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class PutGraphqlApiEnvironmentVariablesResponse extends S.Class<PutGraphqlApiEnvironmentVariablesResponse>(
  "PutGraphqlApiEnvironmentVariablesResponse",
)({ environmentVariables: S.optional(EnvironmentVariableMap) }, ns) {}
export class StartDataSourceIntrospectionResponse extends S.Class<StartDataSourceIntrospectionResponse>(
  "StartDataSourceIntrospectionResponse",
)(
  {
    introspectionId: S.optional(S.String),
    introspectionStatus: S.optional(S.String),
    introspectionStatusDetail: S.optional(S.String),
  },
  ns,
) {}
export class CreateApiRequest extends S.Class<CreateApiRequest>(
  "CreateApiRequest",
)(
  {
    name: S.String,
    ownerContact: S.optional(S.String),
    tags: S.optional(TagMap),
    eventConfig: EventConfig,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v2/apis" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataSourceRequest extends S.Class<CreateDataSourceRequest>(
  "CreateDataSourceRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    name: S.String,
    description: S.optional(S.String),
    type: S.String,
    serviceRoleArn: S.optional(S.String),
    dynamodbConfig: S.optional(DynamodbDataSourceConfig),
    lambdaConfig: S.optional(LambdaDataSourceConfig),
    elasticsearchConfig: S.optional(ElasticsearchDataSourceConfig),
    openSearchServiceConfig: S.optional(OpenSearchServiceDataSourceConfig),
    httpConfig: S.optional(HttpDataSourceConfig),
    relationalDatabaseConfig: S.optional(RelationalDatabaseDataSourceConfig),
    eventBridgeConfig: S.optional(EventBridgeDataSourceConfig),
    metricsConfig: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/apis/{apiId}/datasources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFunctionResponse extends S.Class<CreateFunctionResponse>(
  "CreateFunctionResponse",
)({ functionConfiguration: S.optional(FunctionConfiguration) }, ns) {}
export class CreateGraphqlApiResponse extends S.Class<CreateGraphqlApiResponse>(
  "CreateGraphqlApiResponse",
)({ graphqlApi: S.optional(GraphqlApi) }, ns) {}
export class GetApiResponse extends S.Class<GetApiResponse>("GetApiResponse")(
  { api: S.optional(Api) },
  ns,
) {}
export const DataSourceIntrospectionModelFieldTypeValues = S.Array(S.String);
export class DataSourceIntrospectionModelFieldType extends S.Class<DataSourceIntrospectionModelFieldType>(
  "DataSourceIntrospectionModelFieldType",
)({
  kind: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(
    S.suspend(
      (): S.Schema<DataSourceIntrospectionModelFieldType, any> =>
        DataSourceIntrospectionModelFieldType,
    ),
  ),
  values: S.optional(DataSourceIntrospectionModelFieldTypeValues),
}) {}
export class BadRequestDetail extends S.Class<BadRequestDetail>(
  "BadRequestDetail",
)({ codeErrors: S.optional(CodeErrors) }) {}
export class DataSourceIntrospectionModelField extends S.Class<DataSourceIntrospectionModelField>(
  "DataSourceIntrospectionModelField",
)({
  name: S.optional(S.String),
  type: S.optional(DataSourceIntrospectionModelFieldType),
  length: S.optional(S.Number),
}) {}
export const DataSourceIntrospectionModelFields = S.Array(
  DataSourceIntrospectionModelField,
);
export class CreateApiResponse extends S.Class<CreateApiResponse>(
  "CreateApiResponse",
)({ api: S.optional(Api) }, ns) {}
export class CreateChannelNamespaceRequest extends S.Class<CreateChannelNamespaceRequest>(
  "CreateChannelNamespaceRequest",
)(
  {
    apiId: S.String.pipe(T.HttpLabel()),
    name: S.String,
    subscribeAuthModes: S.optional(AuthModes),
    publishAuthModes: S.optional(AuthModes),
    codeHandlers: S.optional(S.String),
    tags: S.optional(TagMap),
    handlerConfigs: S.optional(HandlerConfigs),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v2/apis/{apiId}/channelNamespaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataSourceResponse extends S.Class<CreateDataSourceResponse>(
  "CreateDataSourceResponse",
)({ dataSource: S.optional(DataSource) }, ns) {}
export class DataSourceIntrospectionModel extends S.Class<DataSourceIntrospectionModel>(
  "DataSourceIntrospectionModel",
)({
  name: S.optional(S.String),
  fields: S.optional(DataSourceIntrospectionModelFields),
  primaryKey: S.optional(DataSourceIntrospectionModelIndex),
  indexes: S.optional(DataSourceIntrospectionModelIndexes),
  sdl: S.optional(S.String),
}) {}
export const DataSourceIntrospectionModels = S.Array(
  DataSourceIntrospectionModel,
);
export class DataSourceIntrospectionResult extends S.Class<DataSourceIntrospectionResult>(
  "DataSourceIntrospectionResult",
)({
  models: S.optional(DataSourceIntrospectionModels),
  nextToken: S.optional(S.String),
}) {}
export class CreateChannelNamespaceResponse extends S.Class<CreateChannelNamespaceResponse>(
  "CreateChannelNamespaceResponse",
)({ channelNamespace: S.optional(ChannelNamespace) }, ns) {}
export class GetDataSourceIntrospectionResponse extends S.Class<GetDataSourceIntrospectionResponse>(
  "GetDataSourceIntrospectionResponse",
)(
  {
    introspectionId: S.optional(S.String),
    introspectionStatus: S.optional(S.String),
    introspectionStatusDetail: S.optional(S.String),
    introspectionResult: S.optional(DataSourceIntrospectionResult),
  },
  ns,
) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  {},
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class GraphQLSchemaException extends S.TaggedError<GraphQLSchemaException>()(
  "GraphQLSchemaException",
  { message: S.optional(S.String) },
) {}
export class ApiKeyValidityOutOfBoundsException extends S.TaggedError<ApiKeyValidityOutOfBoundsException>()(
  "ApiKeyValidityOutOfBoundsException",
  { message: S.optional(S.String) },
) {}
export class ApiKeyLimitExceededException extends S.TaggedError<ApiKeyLimitExceededException>()(
  "ApiKeyLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ApiLimitExceededException extends S.TaggedError<ApiLimitExceededException>()(
  "ApiLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a custom `DomainName` object.
 */
export const deleteDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainNameRequest,
  output: DeleteDomainNameResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
  ],
}));
/**
 * Deletes a `GraphqlApi` object.
 */
export const deleteGraphqlApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGraphqlApiRequest,
  output: DeleteGraphqlApiResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a `Resolver` object.
 */
export const deleteResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResolverRequest,
  output: DeleteResolverResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a `Type` object.
 */
export const deleteType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTypeRequest,
  output: DeleteTypeResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Removes an `ApiAssociation` object from a custom domain.
 */
export const disassociateApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateApiRequest,
  output: DisassociateApiResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
  ],
}));
/**
 * Flushes an `ApiCache` object.
 */
export const flushApiCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FlushApiCacheRequest,
  output: FlushApiCacheResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Untags a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes an `Api` object
 */
export const deleteApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApiRequest,
  output: DeleteApiResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes an API key.
 */
export const deleteApiKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApiKeyRequest,
  output: DeleteApiKeyResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a `ChannelNamespace`.
 */
export const deleteChannelNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteChannelNamespaceRequest,
    output: DeleteChannelNamespaceResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConcurrentModificationException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a `DataSource` object.
 */
export const deleteDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSourceRequest,
  output: DeleteDataSourceResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a `Function`.
 */
export const deleteFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFunctionRequest,
  output: DeleteFunctionResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes an association between a Merged API and source API using the source API's
 * identifier and the association ID.
 */
export const disassociateMergedGraphqlApi =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateMergedGraphqlApiRequest,
    output: DisassociateMergedGraphqlApiResponse,
    errors: [
      BadRequestException,
      ConcurrentModificationException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }));
/**
 * Deletes an association between a Merged API and source API using the Merged API's
 * identifier and the association ID.
 */
export const disassociateSourceGraphqlApi =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateSourceGraphqlApiRequest,
    output: DisassociateSourceGraphqlApiResponse,
    errors: [
      BadRequestException,
      ConcurrentModificationException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }));
/**
 * Retrieves an `ApiAssociation` object.
 */
export const getApiAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApiAssociationRequest,
  output: GetApiAssociationResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
    NotFoundException,
  ],
}));
/**
 * Retrieves an `ApiCache` object.
 */
export const getApiCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApiCacheRequest,
  output: GetApiCacheResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves a custom `DomainName` object.
 */
export const getDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainNameRequest,
  output: GetDomainNameResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
    NotFoundException,
  ],
}));
/**
 * Retrieves the list of environmental variable key-value pairs associated with an API by
 * its ID value.
 */
export const getGraphqlApiEnvironmentVariables =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetGraphqlApiEnvironmentVariablesRequest,
    output: GetGraphqlApiEnvironmentVariablesResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }));
/**
 * Retrieves the current status of a schema creation operation.
 */
export const getSchemaCreationStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSchemaCreationStatusRequest,
    output: GetSchemaCreationStatusResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Retrieves a `SourceApiAssociation` object.
 */
export const getSourceApiAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSourceApiAssociationRequest,
    output: GetSourceApiAssociationResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Retrieves a `Type` object.
 */
export const getType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTypeRequest,
  output: GetTypeResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the API keys for a given API.
 *
 * API keys are deleted automatically 60 days after they expire. However, they may still
 * be included in the response until they have actually been deleted. You can safely call
 * `DeleteApiKey` to manually delete a key before it's automatically
 * deleted.
 */
export const listApiKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApiKeysRequest,
  output: ListApiKeysResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the APIs in your AppSync account.
 *
 * `ListApis` returns only the high level API details. For more detailed
 * information about an API, use `GetApi`.
 */
export const listApis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApisRequest,
  output: ListApisResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the channel namespaces for a specified `Api`.
 *
 * `ListChannelNamespaces` returns only high level details for the channel
 * namespace. To retrieve code handlers, use `GetChannelNamespace`.
 */
export const listChannelNamespaces = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListChannelNamespacesRequest,
    output: ListChannelNamespacesResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists the data sources for a given API.
 */
export const listDataSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataSourcesRequest,
  output: ListDataSourcesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Lists multiple custom domain names.
 */
export const listDomainNames = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDomainNamesRequest,
  output: ListDomainNamesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
  ],
}));
/**
 * List multiple functions.
 */
export const listFunctions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFunctionsRequest,
  output: ListFunctionsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Lists your GraphQL APIs.
 */
export const listGraphqlApis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGraphqlApisRequest,
  output: ListGraphqlApisResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the resolvers for a given API and type.
 */
export const listResolvers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListResolversRequest,
  output: ListResolversResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * List the resolvers that are associated with a specific function.
 */
export const listResolversByFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResolversByFunctionRequest,
    output: ListResolversByFunctionResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists the tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the types for a given API.
 */
export const listTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTypesRequest,
  output: ListTypesResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Lists `Type` objects by the source API association ID.
 */
export const listTypesByAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTypesByAssociationRequest,
    output: ListTypesByAssociationResponse,
    errors: [
      BadRequestException,
      ConcurrentModificationException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Adds a new schema to your GraphQL API.
 *
 * This operation is asynchronous. Use to
 * determine when it has completed.
 */
export const startSchemaCreation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSchemaCreationRequest,
  output: StartSchemaCreationResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Initiates a merge operation. Returns a status that shows the result of the merge
 * operation.
 */
export const startSchemaMerge = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSchemaMergeRequest,
  output: StartSchemaMergeResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Tags a resource with user-supplied tags.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates an `Api`.
 */
export const updateApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApiRequest,
  output: UpdateApiResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates the cache for the GraphQL API.
 */
export const updateApiCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApiCacheRequest,
  output: UpdateApiCacheResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a `ChannelNamespace` associated with an `Api`.
 */
export const updateChannelNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateChannelNamespaceRequest,
    output: UpdateChannelNamespaceResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConcurrentModificationException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Updates a `DataSource` object.
 */
export const updateDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSourceRequest,
  output: UpdateDataSourceResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a custom `DomainName` object.
 */
export const updateDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainNameRequest,
  output: UpdateDomainNameResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
  ],
}));
/**
 * Updates a `Function` object.
 */
export const updateFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFunctionRequest,
  output: UpdateFunctionResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a `GraphqlApi` object.
 */
export const updateGraphqlApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGraphqlApiRequest,
  output: UpdateGraphqlApiResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a `Resolver` object.
 */
export const updateResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResolverRequest,
  output: UpdateResolverResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates some of the configuration choices of a particular source API association.
 */
export const updateSourceApiAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSourceApiAssociationRequest,
    output: UpdateSourceApiAssociationResponse,
    errors: [
      BadRequestException,
      ConcurrentModificationException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Updates a `Type` object.
 */
export const updateType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTypeRequest,
  output: UpdateTypeResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Maps an endpoint to your custom domain.
 */
export const associateApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateApiRequest,
  output: AssociateApiResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
    NotFoundException,
  ],
}));
/**
 * Creates an association between a Merged API and source API using the source API's
 * identifier.
 */
export const associateMergedGraphqlApi = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateMergedGraphqlApiRequest,
    output: AssociateMergedGraphqlApiResponse,
    errors: [
      BadRequestException,
      ConcurrentModificationException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates an association between a Merged API and source API using the Merged API's
 * identifier.
 */
export const associateSourceGraphqlApi = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateSourceGraphqlApiRequest,
    output: AssociateSourceGraphqlApiResponse,
    errors: [
      BadRequestException,
      ConcurrentModificationException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates a cache for the GraphQL API.
 */
export const createApiCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApiCacheRequest,
  output: CreateApiCacheResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a custom `DomainName` object.
 */
export const createDomainName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainNameRequest,
  output: CreateDomainNameResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
  ],
}));
/**
 * Creates a `Resolver` object.
 *
 * A resolver converts incoming requests into a format that a data source can understand,
 * and converts the data source's responses into GraphQL.
 */
export const createResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResolverRequest,
  output: CreateResolverResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a `Type` object.
 */
export const createType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTypeRequest,
  output: CreateTypeResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Evaluates the given code and returns the response. The code definition requirements
 * depend on the specified runtime. For `APPSYNC_JS` runtimes, the code defines the
 * request and response functions. The request function takes the incoming request after a
 * GraphQL operation is parsed and converts it into a request configuration for the selected
 * data source operation. The response function interprets responses from the data source and
 * maps it to the shape of the GraphQL field output type.
 */
export const evaluateCode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EvaluateCodeRequest,
  output: EvaluateCodeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
  ],
}));
/**
 * Evaluates a given template and returns the response. The mapping template can be a
 * request or response template.
 *
 * Request templates take the incoming request after a GraphQL operation is parsed and
 * convert it into a request configuration for the selected data source operation. Response
 * templates interpret responses from the data source and map it to the shape of the GraphQL
 * field output type.
 *
 * Mapping templates are written in the Apache Velocity Template Language (VTL).
 */
export const evaluateMappingTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: EvaluateMappingTemplateRequest,
    output: EvaluateMappingTemplateResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalFailureException,
    ],
  }),
);
/**
 * Retrieves the channel namespace for a specified `Api`.
 */
export const getChannelNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelNamespaceRequest,
  output: GetChannelNamespaceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves a `DataSource` object.
 */
export const getDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSourceRequest,
  output: GetDataSourceResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Get a `Function`.
 */
export const getFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionRequest,
  output: GetFunctionResponse,
  errors: [
    ConcurrentModificationException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves a `GraphqlApi` object.
 */
export const getGraphqlApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGraphqlApiRequest,
  output: GetGraphqlApiResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves the introspection schema for a GraphQL API.
 */
export const getIntrospectionSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIntrospectionSchemaRequest,
    output: GetIntrospectionSchemaResponse,
    errors: [
      GraphQLSchemaException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Retrieves a `Resolver` object.
 */
export const getResolver = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResolverRequest,
  output: GetResolverResponse,
  errors: [
    ConcurrentModificationException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the `SourceApiAssociationSummary` data.
 */
export const listSourceApiAssociations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSourceApiAssociationsRequest,
    output: ListSourceApiAssociationsResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates a list of environmental variables in an API by its ID value.
 *
 * When creating an environmental variable, it must follow the constraints below:
 *
 * - Both JavaScript and VTL templates support environmental variables.
 *
 * - Environmental variables are not evaluated before function invocation.
 *
 * - Environmental variables only support string values.
 *
 * - Any defined value in an environmental variable is considered a string literal
 * and not expanded.
 *
 * - Variable evaluations should ideally be performed in the function
 * code.
 *
 * When creating an environmental variable key-value pair, it must follow the additional
 * constraints below:
 *
 * - Keys must begin with a letter.
 *
 * - Keys must be at least two characters long.
 *
 * - Keys can only contain letters, numbers, and the underscore character
 * (_).
 *
 * - Values can be up to 512 characters long.
 *
 * - You can configure up to 50 key-value pairs in a GraphQL API.
 *
 * You can create a list of environmental variables by adding it to the
 * `environmentVariables` payload as a list in the format
 * `{"key1":"value1","key2":"value2", …}`. Note that each call of the
 * `PutGraphqlApiEnvironmentVariables` action will result in the overwriting of
 * the existing environmental variable list of that API. This means the existing environmental
 * variables will be lost. To avoid this, you must include all existing and new environmental
 * variables in the list each time you call this action.
 */
export const putGraphqlApiEnvironmentVariables =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutGraphqlApiEnvironmentVariablesRequest,
    output: PutGraphqlApiEnvironmentVariablesResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConcurrentModificationException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }));
/**
 * Creates a new introspection. Returns the `introspectionId` of the new
 * introspection after its creation.
 */
export const startDataSourceIntrospection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartDataSourceIntrospectionRequest,
    output: StartDataSourceIntrospectionResponse,
    errors: [
      BadRequestException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }));
/**
 * Updates an API key. You can update the key as long as it's not deleted.
 */
export const updateApiKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApiKeyRequest,
  output: UpdateApiKeyResponse,
  errors: [
    ApiKeyValidityOutOfBoundsException,
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a unique key that you can distribute to clients who invoke your API.
 */
export const createApiKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApiKeyRequest,
  output: CreateApiKeyResponse,
  errors: [
    ApiKeyLimitExceededException,
    ApiKeyValidityOutOfBoundsException,
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a `Function` object.
 *
 * A function is a reusable entity. You can use multiple functions to compose the resolver
 * logic.
 */
export const createFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFunctionRequest,
  output: CreateFunctionResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves an `Api` object.
 */
export const getApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApiRequest,
  output: GetApiResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a `DataSource` object.
 */
export const createDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataSourceRequest,
  output: CreateDataSourceResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a `GraphqlApi` object.
 */
export const createGraphqlApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGraphqlApiRequest,
  output: CreateGraphqlApiResponse,
  errors: [
    ApiLimitExceededException,
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    LimitExceededException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes an `ApiCache` object.
 */
export const deleteApiCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApiCacheRequest,
  output: DeleteApiCacheResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Creates an `Api` object. Use this operation to create an AppSync
 * API with your preferred configuration, such as an Event API that provides real-time message
 * publishing and message subscriptions over WebSockets.
 */
export const createApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApiRequest,
  output: CreateApiResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    ServiceQuotaExceededException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves the record of an existing introspection. If the retrieval is successful, the
 * result of the instrospection will also be returned. If the retrieval fails the operation,
 * an error message will be returned instead.
 */
export const getDataSourceIntrospection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataSourceIntrospectionRequest,
    output: GetDataSourceIntrospectionResponse,
    errors: [BadRequestException, InternalFailureException, NotFoundException],
  }),
);
/**
 * Creates a `ChannelNamespace` for an `Api`.
 */
export const createChannelNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateChannelNamespaceRequest,
    output: CreateChannelNamespaceResponse,
    errors: [
      BadRequestException,
      ConcurrentModificationException,
      ConflictException,
      InternalFailureException,
      NotFoundException,
      ServiceQuotaExceededException,
      UnauthorizedException,
    ],
  }),
);
