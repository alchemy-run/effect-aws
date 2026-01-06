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

//# Newtypes
export type DomainName = string;
export type ApiName = string;
export type Long = number;
export type Namespace = string;
export type Code = string;
export type ResourceName = string;
export type CertificateArn = string;
export type Description = string;
export type MappingTemplate = string;
export type MaxBatchSize = number;
export type QueryDepthLimit = number;
export type ResolverCountLimit = number;
export type Context = string;
export type Template = string;
export type PaginationToken = string;
export type MaxResults = number;
export type ResourceArn = string;
export type TagKey = string;
export type TagValue = string;
export type TTL = number;
export type EnvironmentVariableKey = string;
export type EnvironmentVariableValue = string;
export type RdsDataApiConfigResourceArn = string;
export type RdsDataApiConfigSecretArn = string;
export type RdsDataApiConfigDatabaseName = string;
export type ErrorMessage = string;
export type EvaluationResult = string;
export type Stash = string;
export type OutErrors = string;
export type OwnerContact = string;
export type CodeErrorLine = number;
export type CodeErrorColumn = number;
export type CodeErrorSpan = number;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateApiRequest {
  domainName: string;
  apiId: string;
}
export const AssociateApiRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    apiId: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateApiRequest",
}) as any as S.Schema<AssociateApiRequest>;
export interface SourceApiAssociationConfig {
  mergeType?: string;
}
export const SourceApiAssociationConfig = S.suspend(() =>
  S.Struct({ mergeType: S.optional(S.String) }),
).annotations({
  identifier: "SourceApiAssociationConfig",
}) as any as S.Schema<SourceApiAssociationConfig>;
export interface AssociateSourceGraphqlApiRequest {
  mergedApiIdentifier: string;
  sourceApiIdentifier: string;
  description?: string;
  sourceApiAssociationConfig?: SourceApiAssociationConfig;
}
export const AssociateSourceGraphqlApiRequest = S.suspend(() =>
  S.Struct({
    mergedApiIdentifier: S.String.pipe(T.HttpLabel("mergedApiIdentifier")),
    sourceApiIdentifier: S.String,
    description: S.optional(S.String),
    sourceApiAssociationConfig: S.optional(SourceApiAssociationConfig),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateSourceGraphqlApiRequest",
}) as any as S.Schema<AssociateSourceGraphqlApiRequest>;
export interface CreateApiCacheRequest {
  apiId: string;
  ttl: number;
  transitEncryptionEnabled?: boolean;
  atRestEncryptionEnabled?: boolean;
  apiCachingBehavior: string;
  type: string;
  healthMetricsConfig?: string;
}
export const CreateApiCacheRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    ttl: S.Number,
    transitEncryptionEnabled: S.optional(S.Boolean),
    atRestEncryptionEnabled: S.optional(S.Boolean),
    apiCachingBehavior: S.String,
    type: S.String,
    healthMetricsConfig: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis/{apiId}/ApiCaches" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApiCacheRequest",
}) as any as S.Schema<CreateApiCacheRequest>;
export interface CreateApiKeyRequest {
  apiId: string;
  description?: string;
  expires?: number;
}
export const CreateApiKeyRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    description: S.optional(S.String),
    expires: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis/{apiId}/apikeys" }),
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
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateDomainNameRequest {
  domainName: string;
  certificateArn: string;
  description?: string;
  tags?: TagMap;
}
export const CreateDomainNameRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String,
    certificateArn: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/domainnames" }),
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
export interface CreateTypeRequest {
  apiId: string;
  definition: string;
  format: string;
}
export const CreateTypeRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    definition: S.String,
    format: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis/{apiId}/types" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTypeRequest",
}) as any as S.Schema<CreateTypeRequest>;
export interface DeleteApiRequest {
  apiId: string;
}
export const DeleteApiRequest = S.suspend(() =>
  S.Struct({ apiId: S.String.pipe(T.HttpLabel("apiId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v2/apis/{apiId}" }),
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
export const DeleteApiResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApiResponse",
}) as any as S.Schema<DeleteApiResponse>;
export interface DeleteApiCacheRequest {
  apiId: string;
}
export const DeleteApiCacheRequest = S.suspend(() =>
  S.Struct({ apiId: S.String.pipe(T.HttpLabel("apiId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}/ApiCaches" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApiCacheRequest",
}) as any as S.Schema<DeleteApiCacheRequest>;
export interface DeleteApiCacheResponse {}
export const DeleteApiCacheResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApiCacheResponse",
}) as any as S.Schema<DeleteApiCacheResponse>;
export interface DeleteApiKeyRequest {
  apiId: string;
  id: string;
}
export const DeleteApiKeyRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}/apikeys/{id}" }),
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
export const DeleteApiKeyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApiKeyResponse",
}) as any as S.Schema<DeleteApiKeyResponse>;
export interface DeleteChannelNamespaceRequest {
  apiId: string;
  name: string;
}
export const DeleteChannelNamespaceRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteChannelNamespaceRequest",
}) as any as S.Schema<DeleteChannelNamespaceRequest>;
export interface DeleteChannelNamespaceResponse {}
export const DeleteChannelNamespaceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteChannelNamespaceResponse",
}) as any as S.Schema<DeleteChannelNamespaceResponse>;
export interface DeleteDataSourceRequest {
  apiId: string;
  name: string;
}
export const DeleteDataSourceRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}/datasources/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataSourceRequest",
}) as any as S.Schema<DeleteDataSourceRequest>;
export interface DeleteDataSourceResponse {}
export const DeleteDataSourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDataSourceResponse",
}) as any as S.Schema<DeleteDataSourceResponse>;
export interface DeleteDomainNameRequest {
  domainName: string;
}
export const DeleteDomainNameRequest = S.suspend(() =>
  S.Struct({ domainName: S.String.pipe(T.HttpLabel("domainName")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v1/domainnames/{domainName}" }),
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
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDomainNameResponse",
}) as any as S.Schema<DeleteDomainNameResponse>;
export interface DeleteFunctionRequest {
  apiId: string;
  functionId: string;
}
export const DeleteFunctionRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    functionId: S.String.pipe(T.HttpLabel("functionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteFunctionRequest",
}) as any as S.Schema<DeleteFunctionRequest>;
export interface DeleteFunctionResponse {}
export const DeleteFunctionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteFunctionResponse",
}) as any as S.Schema<DeleteFunctionResponse>;
export interface DeleteGraphqlApiRequest {
  apiId: string;
}
export const DeleteGraphqlApiRequest = S.suspend(() =>
  S.Struct({ apiId: S.String.pipe(T.HttpLabel("apiId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGraphqlApiRequest",
}) as any as S.Schema<DeleteGraphqlApiRequest>;
export interface DeleteGraphqlApiResponse {}
export const DeleteGraphqlApiResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteGraphqlApiResponse",
}) as any as S.Schema<DeleteGraphqlApiResponse>;
export interface DeleteResolverRequest {
  apiId: string;
  typeName: string;
  fieldName: string;
}
export const DeleteResolverRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    typeName: S.String.pipe(T.HttpLabel("typeName")),
    fieldName: S.String.pipe(T.HttpLabel("fieldName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteResolverRequest",
}) as any as S.Schema<DeleteResolverRequest>;
export interface DeleteResolverResponse {}
export const DeleteResolverResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResolverResponse",
}) as any as S.Schema<DeleteResolverResponse>;
export interface DeleteTypeRequest {
  apiId: string;
  typeName: string;
}
export const DeleteTypeRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    typeName: S.String.pipe(T.HttpLabel("typeName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}/types/{typeName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTypeRequest",
}) as any as S.Schema<DeleteTypeRequest>;
export interface DeleteTypeResponse {}
export const DeleteTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTypeResponse",
}) as any as S.Schema<DeleteTypeResponse>;
export interface DisassociateApiRequest {
  domainName: string;
}
export const DisassociateApiRequest = S.suspend(() =>
  S.Struct({ domainName: S.String.pipe(T.HttpLabel("domainName")) }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateApiRequest",
}) as any as S.Schema<DisassociateApiRequest>;
export interface DisassociateApiResponse {}
export const DisassociateApiResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateApiResponse",
}) as any as S.Schema<DisassociateApiResponse>;
export interface DisassociateMergedGraphqlApiRequest {
  sourceApiIdentifier: string;
  associationId: string;
}
export const DisassociateMergedGraphqlApiRequest = S.suspend(() =>
  S.Struct({
    sourceApiIdentifier: S.String.pipe(T.HttpLabel("sourceApiIdentifier")),
    associationId: S.String.pipe(T.HttpLabel("associationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateMergedGraphqlApiRequest",
}) as any as S.Schema<DisassociateMergedGraphqlApiRequest>;
export interface DisassociateSourceGraphqlApiRequest {
  mergedApiIdentifier: string;
  associationId: string;
}
export const DisassociateSourceGraphqlApiRequest = S.suspend(() =>
  S.Struct({
    mergedApiIdentifier: S.String.pipe(T.HttpLabel("mergedApiIdentifier")),
    associationId: S.String.pipe(T.HttpLabel("associationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateSourceGraphqlApiRequest",
}) as any as S.Schema<DisassociateSourceGraphqlApiRequest>;
export interface AppSyncRuntime {
  name: string;
  runtimeVersion: string;
}
export const AppSyncRuntime = S.suspend(() =>
  S.Struct({ name: S.String, runtimeVersion: S.String }),
).annotations({
  identifier: "AppSyncRuntime",
}) as any as S.Schema<AppSyncRuntime>;
export interface EvaluateCodeRequest {
  runtime: AppSyncRuntime;
  code: string;
  context: string;
  function?: string;
}
export const EvaluateCodeRequest = S.suspend(() =>
  S.Struct({
    runtime: AppSyncRuntime,
    code: S.String,
    context: S.String,
    function: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/dataplane-evaluatecode" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EvaluateCodeRequest",
}) as any as S.Schema<EvaluateCodeRequest>;
export interface EvaluateMappingTemplateRequest {
  template: string;
  context: string;
}
export const EvaluateMappingTemplateRequest = S.suspend(() =>
  S.Struct({ template: S.String, context: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/dataplane-evaluatetemplate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EvaluateMappingTemplateRequest",
}) as any as S.Schema<EvaluateMappingTemplateRequest>;
export interface FlushApiCacheRequest {
  apiId: string;
}
export const FlushApiCacheRequest = S.suspend(() =>
  S.Struct({ apiId: S.String.pipe(T.HttpLabel("apiId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v1/apis/{apiId}/FlushCache" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "FlushApiCacheRequest",
}) as any as S.Schema<FlushApiCacheRequest>;
export interface FlushApiCacheResponse {}
export const FlushApiCacheResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "FlushApiCacheResponse",
}) as any as S.Schema<FlushApiCacheResponse>;
export interface GetApiRequest {
  apiId: string;
}
export const GetApiRequest = S.suspend(() =>
  S.Struct({ apiId: S.String.pipe(T.HttpLabel("apiId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v2/apis/{apiId}" }),
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
export interface GetApiAssociationRequest {
  domainName: string;
}
export const GetApiAssociationRequest = S.suspend(() =>
  S.Struct({ domainName: S.String.pipe(T.HttpLabel("domainName")) }).pipe(
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
  ),
).annotations({
  identifier: "GetApiAssociationRequest",
}) as any as S.Schema<GetApiAssociationRequest>;
export interface GetApiCacheRequest {
  apiId: string;
}
export const GetApiCacheRequest = S.suspend(() =>
  S.Struct({ apiId: S.String.pipe(T.HttpLabel("apiId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/ApiCaches" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApiCacheRequest",
}) as any as S.Schema<GetApiCacheRequest>;
export interface GetChannelNamespaceRequest {
  apiId: string;
  name: string;
}
export const GetChannelNamespaceRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/v2/apis/{apiId}/channelNamespaces/{name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChannelNamespaceRequest",
}) as any as S.Schema<GetChannelNamespaceRequest>;
export interface GetDataSourceRequest {
  apiId: string;
  name: string;
}
export const GetDataSourceRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/datasources/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataSourceRequest",
}) as any as S.Schema<GetDataSourceRequest>;
export interface GetDataSourceIntrospectionRequest {
  introspectionId: string;
  includeModelsSDL?: boolean;
  nextToken?: string;
  maxResults?: number;
}
export const GetDataSourceIntrospectionRequest = S.suspend(() =>
  S.Struct({
    introspectionId: S.String.pipe(T.HttpLabel("introspectionId")),
    includeModelsSDL: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeModelsSDL"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDataSourceIntrospectionRequest",
}) as any as S.Schema<GetDataSourceIntrospectionRequest>;
export interface GetDomainNameRequest {
  domainName: string;
}
export const GetDomainNameRequest = S.suspend(() =>
  S.Struct({ domainName: S.String.pipe(T.HttpLabel("domainName")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/domainnames/{domainName}" }),
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
export interface GetFunctionRequest {
  apiId: string;
  functionId: string;
}
export const GetFunctionRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    functionId: S.String.pipe(T.HttpLabel("functionId")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/functions/{functionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFunctionRequest",
}) as any as S.Schema<GetFunctionRequest>;
export interface GetGraphqlApiRequest {
  apiId: string;
}
export const GetGraphqlApiRequest = S.suspend(() =>
  S.Struct({ apiId: S.String.pipe(T.HttpLabel("apiId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGraphqlApiRequest",
}) as any as S.Schema<GetGraphqlApiRequest>;
export interface GetGraphqlApiEnvironmentVariablesRequest {
  apiId: string;
}
export const GetGraphqlApiEnvironmentVariablesRequest = S.suspend(() =>
  S.Struct({ apiId: S.String.pipe(T.HttpLabel("apiId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/environmentVariables" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGraphqlApiEnvironmentVariablesRequest",
}) as any as S.Schema<GetGraphqlApiEnvironmentVariablesRequest>;
export interface GetIntrospectionSchemaRequest {
  apiId: string;
  format: string;
  includeDirectives?: boolean;
}
export const GetIntrospectionSchemaRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    format: S.String.pipe(T.HttpQuery("format")),
    includeDirectives: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeDirectives"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/schema" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIntrospectionSchemaRequest",
}) as any as S.Schema<GetIntrospectionSchemaRequest>;
export interface GetResolverRequest {
  apiId: string;
  typeName: string;
  fieldName: string;
}
export const GetResolverRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    typeName: S.String.pipe(T.HttpLabel("typeName")),
    fieldName: S.String.pipe(T.HttpLabel("fieldName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetResolverRequest",
}) as any as S.Schema<GetResolverRequest>;
export interface GetSchemaCreationStatusRequest {
  apiId: string;
}
export const GetSchemaCreationStatusRequest = S.suspend(() =>
  S.Struct({ apiId: S.String.pipe(T.HttpLabel("apiId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/schemacreation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSchemaCreationStatusRequest",
}) as any as S.Schema<GetSchemaCreationStatusRequest>;
export interface GetSourceApiAssociationRequest {
  mergedApiIdentifier: string;
  associationId: string;
}
export const GetSourceApiAssociationRequest = S.suspend(() =>
  S.Struct({
    mergedApiIdentifier: S.String.pipe(T.HttpLabel("mergedApiIdentifier")),
    associationId: S.String.pipe(T.HttpLabel("associationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSourceApiAssociationRequest",
}) as any as S.Schema<GetSourceApiAssociationRequest>;
export interface GetTypeRequest {
  apiId: string;
  typeName: string;
  format: string;
}
export const GetTypeRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    typeName: S.String.pipe(T.HttpLabel("typeName")),
    format: S.String.pipe(T.HttpQuery("format")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/types/{typeName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTypeRequest",
}) as any as S.Schema<GetTypeRequest>;
export interface ListApiKeysRequest {
  apiId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListApiKeysRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/apikeys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApiKeysRequest",
}) as any as S.Schema<ListApiKeysRequest>;
export interface ListApisRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListApisRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v2/apis" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApisRequest",
}) as any as S.Schema<ListApisRequest>;
export interface ListChannelNamespacesRequest {
  apiId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListChannelNamespacesRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v2/apis/{apiId}/channelNamespaces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelNamespacesRequest",
}) as any as S.Schema<ListChannelNamespacesRequest>;
export interface ListDataSourcesRequest {
  apiId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataSourcesRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/datasources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataSourcesRequest",
}) as any as S.Schema<ListDataSourcesRequest>;
export interface ListDomainNamesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListDomainNamesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/domainnames" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainNamesRequest",
}) as any as S.Schema<ListDomainNamesRequest>;
export interface ListFunctionsRequest {
  apiId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListFunctionsRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/functions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFunctionsRequest",
}) as any as S.Schema<ListFunctionsRequest>;
export interface ListGraphqlApisRequest {
  nextToken?: string;
  maxResults?: number;
  apiType?: string;
  owner?: string;
}
export const ListGraphqlApisRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    apiType: S.optional(S.String).pipe(T.HttpQuery("apiType")),
    owner: S.optional(S.String).pipe(T.HttpQuery("owner")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGraphqlApisRequest",
}) as any as S.Schema<ListGraphqlApisRequest>;
export interface ListResolversRequest {
  apiId: string;
  typeName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListResolversRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    typeName: S.String.pipe(T.HttpLabel("typeName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListResolversRequest",
}) as any as S.Schema<ListResolversRequest>;
export interface ListResolversByFunctionRequest {
  apiId: string;
  functionId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListResolversByFunctionRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    functionId: S.String.pipe(T.HttpLabel("functionId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListResolversByFunctionRequest",
}) as any as S.Schema<ListResolversByFunctionRequest>;
export interface ListSourceApiAssociationsRequest {
  apiId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSourceApiAssociationsRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/sourceApiAssociations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSourceApiAssociationsRequest",
}) as any as S.Schema<ListSourceApiAssociationsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/tags/{resourceArn}" }),
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
export interface ListTypesRequest {
  apiId: string;
  format: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListTypesRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    format: S.String.pipe(T.HttpQuery("format")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/apis/{apiId}/types" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTypesRequest",
}) as any as S.Schema<ListTypesRequest>;
export interface ListTypesByAssociationRequest {
  mergedApiIdentifier: string;
  associationId: string;
  format: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListTypesByAssociationRequest = S.suspend(() =>
  S.Struct({
    mergedApiIdentifier: S.String.pipe(T.HttpLabel("mergedApiIdentifier")),
    associationId: S.String.pipe(T.HttpLabel("associationId")),
    format: S.String.pipe(T.HttpQuery("format")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListTypesByAssociationRequest",
}) as any as S.Schema<ListTypesByAssociationRequest>;
export interface StartSchemaCreationRequest {
  apiId: string;
  definition: Uint8Array;
}
export const StartSchemaCreationRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    definition: T.Blob,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis/{apiId}/schemacreation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartSchemaCreationRequest",
}) as any as S.Schema<StartSchemaCreationRequest>;
export interface StartSchemaMergeRequest {
  associationId: string;
  mergedApiIdentifier: string;
}
export const StartSchemaMergeRequest = S.suspend(() =>
  S.Struct({
    associationId: S.String.pipe(T.HttpLabel("associationId")),
    mergedApiIdentifier: S.String.pipe(T.HttpLabel("mergedApiIdentifier")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartSchemaMergeRequest",
}) as any as S.Schema<StartSchemaMergeRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/tags/{resourceArn}" }),
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
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v1/tags/{resourceArn}" }),
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
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface CognitoConfig {
  userPoolId: string;
  awsRegion: string;
  appIdClientRegex?: string;
}
export const CognitoConfig = S.suspend(() =>
  S.Struct({
    userPoolId: S.String,
    awsRegion: S.String,
    appIdClientRegex: S.optional(S.String),
  }),
).annotations({
  identifier: "CognitoConfig",
}) as any as S.Schema<CognitoConfig>;
export interface OpenIDConnectConfig {
  issuer: string;
  clientId?: string;
  iatTTL?: number;
  authTTL?: number;
}
export const OpenIDConnectConfig = S.suspend(() =>
  S.Struct({
    issuer: S.String,
    clientId: S.optional(S.String),
    iatTTL: S.optional(S.Number),
    authTTL: S.optional(S.Number),
  }),
).annotations({
  identifier: "OpenIDConnectConfig",
}) as any as S.Schema<OpenIDConnectConfig>;
export interface LambdaAuthorizerConfig {
  authorizerResultTtlInSeconds?: number;
  authorizerUri: string;
  identityValidationExpression?: string;
}
export const LambdaAuthorizerConfig = S.suspend(() =>
  S.Struct({
    authorizerResultTtlInSeconds: S.optional(S.Number),
    authorizerUri: S.String,
    identityValidationExpression: S.optional(S.String),
  }),
).annotations({
  identifier: "LambdaAuthorizerConfig",
}) as any as S.Schema<LambdaAuthorizerConfig>;
export interface AuthProvider {
  authType: string;
  cognitoConfig?: CognitoConfig;
  openIDConnectConfig?: OpenIDConnectConfig;
  lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
}
export const AuthProvider = S.suspend(() =>
  S.Struct({
    authType: S.String,
    cognitoConfig: S.optional(CognitoConfig),
    openIDConnectConfig: S.optional(OpenIDConnectConfig),
    lambdaAuthorizerConfig: S.optional(LambdaAuthorizerConfig),
  }),
).annotations({ identifier: "AuthProvider" }) as any as S.Schema<AuthProvider>;
export type AuthProviders = AuthProvider[];
export const AuthProviders = S.Array(AuthProvider);
export interface AuthMode {
  authType: string;
}
export const AuthMode = S.suspend(() =>
  S.Struct({ authType: S.String }),
).annotations({ identifier: "AuthMode" }) as any as S.Schema<AuthMode>;
export type AuthModes = AuthMode[];
export const AuthModes = S.Array(AuthMode);
export interface EventLogConfig {
  logLevel: string;
  cloudWatchLogsRoleArn: string;
}
export const EventLogConfig = S.suspend(() =>
  S.Struct({ logLevel: S.String, cloudWatchLogsRoleArn: S.String }),
).annotations({
  identifier: "EventLogConfig",
}) as any as S.Schema<EventLogConfig>;
export interface EventConfig {
  authProviders: AuthProviders;
  connectionAuthModes: AuthModes;
  defaultPublishAuthModes: AuthModes;
  defaultSubscribeAuthModes: AuthModes;
  logConfig?: EventLogConfig;
}
export const EventConfig = S.suspend(() =>
  S.Struct({
    authProviders: AuthProviders,
    connectionAuthModes: AuthModes,
    defaultPublishAuthModes: AuthModes,
    defaultSubscribeAuthModes: AuthModes,
    logConfig: S.optional(EventLogConfig),
  }),
).annotations({ identifier: "EventConfig" }) as any as S.Schema<EventConfig>;
export interface UpdateApiRequest {
  apiId: string;
  name: string;
  ownerContact?: string;
  eventConfig: EventConfig;
}
export const UpdateApiRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    name: S.String,
    ownerContact: S.optional(S.String),
    eventConfig: EventConfig,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v2/apis/{apiId}" }),
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
export interface UpdateApiCacheRequest {
  apiId: string;
  ttl: number;
  apiCachingBehavior: string;
  type: string;
  healthMetricsConfig?: string;
}
export const UpdateApiCacheRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    ttl: S.Number,
    apiCachingBehavior: S.String,
    type: S.String,
    healthMetricsConfig: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis/{apiId}/ApiCaches/update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApiCacheRequest",
}) as any as S.Schema<UpdateApiCacheRequest>;
export interface UpdateApiKeyRequest {
  apiId: string;
  id: string;
  description?: string;
  expires?: number;
}
export const UpdateApiKeyRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    id: S.String.pipe(T.HttpLabel("id")),
    description: S.optional(S.String),
    expires: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis/{apiId}/apikeys/{id}" }),
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
export interface LambdaConfig {
  invokeType?: string;
}
export const LambdaConfig = S.suspend(() =>
  S.Struct({ invokeType: S.optional(S.String) }),
).annotations({ identifier: "LambdaConfig" }) as any as S.Schema<LambdaConfig>;
export interface Integration {
  dataSourceName: string;
  lambdaConfig?: LambdaConfig;
}
export const Integration = S.suspend(() =>
  S.Struct({
    dataSourceName: S.String,
    lambdaConfig: S.optional(LambdaConfig),
  }),
).annotations({ identifier: "Integration" }) as any as S.Schema<Integration>;
export interface HandlerConfig {
  behavior: string;
  integration: Integration;
}
export const HandlerConfig = S.suspend(() =>
  S.Struct({ behavior: S.String, integration: Integration }),
).annotations({
  identifier: "HandlerConfig",
}) as any as S.Schema<HandlerConfig>;
export interface HandlerConfigs {
  onPublish?: HandlerConfig;
  onSubscribe?: HandlerConfig;
}
export const HandlerConfigs = S.suspend(() =>
  S.Struct({
    onPublish: S.optional(HandlerConfig),
    onSubscribe: S.optional(HandlerConfig),
  }),
).annotations({
  identifier: "HandlerConfigs",
}) as any as S.Schema<HandlerConfigs>;
export interface UpdateChannelNamespaceRequest {
  apiId: string;
  name: string;
  subscribeAuthModes?: AuthModes;
  publishAuthModes?: AuthModes;
  codeHandlers?: string;
  handlerConfigs?: HandlerConfigs;
}
export const UpdateChannelNamespaceRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    name: S.String.pipe(T.HttpLabel("name")),
    subscribeAuthModes: S.optional(AuthModes),
    publishAuthModes: S.optional(AuthModes),
    codeHandlers: S.optional(S.String),
    handlerConfigs: S.optional(HandlerConfigs),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateChannelNamespaceRequest",
}) as any as S.Schema<UpdateChannelNamespaceRequest>;
export interface DeltaSyncConfig {
  baseTableTTL?: number;
  deltaSyncTableName?: string;
  deltaSyncTableTTL?: number;
}
export const DeltaSyncConfig = S.suspend(() =>
  S.Struct({
    baseTableTTL: S.optional(S.Number),
    deltaSyncTableName: S.optional(S.String),
    deltaSyncTableTTL: S.optional(S.Number),
  }),
).annotations({
  identifier: "DeltaSyncConfig",
}) as any as S.Schema<DeltaSyncConfig>;
export interface DynamodbDataSourceConfig {
  tableName: string;
  awsRegion: string;
  useCallerCredentials?: boolean;
  deltaSyncConfig?: DeltaSyncConfig;
  versioned?: boolean;
}
export const DynamodbDataSourceConfig = S.suspend(() =>
  S.Struct({
    tableName: S.String,
    awsRegion: S.String,
    useCallerCredentials: S.optional(S.Boolean),
    deltaSyncConfig: S.optional(DeltaSyncConfig),
    versioned: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DynamodbDataSourceConfig",
}) as any as S.Schema<DynamodbDataSourceConfig>;
export interface LambdaDataSourceConfig {
  lambdaFunctionArn: string;
}
export const LambdaDataSourceConfig = S.suspend(() =>
  S.Struct({ lambdaFunctionArn: S.String }),
).annotations({
  identifier: "LambdaDataSourceConfig",
}) as any as S.Schema<LambdaDataSourceConfig>;
export interface ElasticsearchDataSourceConfig {
  endpoint: string;
  awsRegion: string;
}
export const ElasticsearchDataSourceConfig = S.suspend(() =>
  S.Struct({ endpoint: S.String, awsRegion: S.String }),
).annotations({
  identifier: "ElasticsearchDataSourceConfig",
}) as any as S.Schema<ElasticsearchDataSourceConfig>;
export interface OpenSearchServiceDataSourceConfig {
  endpoint: string;
  awsRegion: string;
}
export const OpenSearchServiceDataSourceConfig = S.suspend(() =>
  S.Struct({ endpoint: S.String, awsRegion: S.String }),
).annotations({
  identifier: "OpenSearchServiceDataSourceConfig",
}) as any as S.Schema<OpenSearchServiceDataSourceConfig>;
export interface AwsIamConfig {
  signingRegion?: string;
  signingServiceName?: string;
}
export const AwsIamConfig = S.suspend(() =>
  S.Struct({
    signingRegion: S.optional(S.String),
    signingServiceName: S.optional(S.String),
  }),
).annotations({ identifier: "AwsIamConfig" }) as any as S.Schema<AwsIamConfig>;
export interface AuthorizationConfig {
  authorizationType: string;
  awsIamConfig?: AwsIamConfig;
}
export const AuthorizationConfig = S.suspend(() =>
  S.Struct({
    authorizationType: S.String,
    awsIamConfig: S.optional(AwsIamConfig),
  }),
).annotations({
  identifier: "AuthorizationConfig",
}) as any as S.Schema<AuthorizationConfig>;
export interface HttpDataSourceConfig {
  endpoint?: string;
  authorizationConfig?: AuthorizationConfig;
}
export const HttpDataSourceConfig = S.suspend(() =>
  S.Struct({
    endpoint: S.optional(S.String),
    authorizationConfig: S.optional(AuthorizationConfig),
  }),
).annotations({
  identifier: "HttpDataSourceConfig",
}) as any as S.Schema<HttpDataSourceConfig>;
export interface RdsHttpEndpointConfig {
  awsRegion?: string;
  dbClusterIdentifier?: string;
  databaseName?: string;
  schema?: string;
  awsSecretStoreArn?: string;
}
export const RdsHttpEndpointConfig = S.suspend(() =>
  S.Struct({
    awsRegion: S.optional(S.String),
    dbClusterIdentifier: S.optional(S.String),
    databaseName: S.optional(S.String),
    schema: S.optional(S.String),
    awsSecretStoreArn: S.optional(S.String),
  }),
).annotations({
  identifier: "RdsHttpEndpointConfig",
}) as any as S.Schema<RdsHttpEndpointConfig>;
export interface RelationalDatabaseDataSourceConfig {
  relationalDatabaseSourceType?: string;
  rdsHttpEndpointConfig?: RdsHttpEndpointConfig;
}
export const RelationalDatabaseDataSourceConfig = S.suspend(() =>
  S.Struct({
    relationalDatabaseSourceType: S.optional(S.String),
    rdsHttpEndpointConfig: S.optional(RdsHttpEndpointConfig),
  }),
).annotations({
  identifier: "RelationalDatabaseDataSourceConfig",
}) as any as S.Schema<RelationalDatabaseDataSourceConfig>;
export interface EventBridgeDataSourceConfig {
  eventBusArn: string;
}
export const EventBridgeDataSourceConfig = S.suspend(() =>
  S.Struct({ eventBusArn: S.String }),
).annotations({
  identifier: "EventBridgeDataSourceConfig",
}) as any as S.Schema<EventBridgeDataSourceConfig>;
export interface UpdateDataSourceRequest {
  apiId: string;
  name: string;
  description?: string;
  type: string;
  serviceRoleArn?: string;
  dynamodbConfig?: DynamodbDataSourceConfig;
  lambdaConfig?: LambdaDataSourceConfig;
  elasticsearchConfig?: ElasticsearchDataSourceConfig;
  openSearchServiceConfig?: OpenSearchServiceDataSourceConfig;
  httpConfig?: HttpDataSourceConfig;
  relationalDatabaseConfig?: RelationalDatabaseDataSourceConfig;
  eventBridgeConfig?: EventBridgeDataSourceConfig;
  metricsConfig?: string;
}
export const UpdateDataSourceRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    name: S.String.pipe(T.HttpLabel("name")),
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis/{apiId}/datasources/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataSourceRequest",
}) as any as S.Schema<UpdateDataSourceRequest>;
export interface UpdateDomainNameRequest {
  domainName: string;
  description?: string;
}
export const UpdateDomainNameRequest = S.suspend(() =>
  S.Struct({
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/domainnames/{domainName}" }),
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
export interface LambdaConflictHandlerConfig {
  lambdaConflictHandlerArn?: string;
}
export const LambdaConflictHandlerConfig = S.suspend(() =>
  S.Struct({ lambdaConflictHandlerArn: S.optional(S.String) }),
).annotations({
  identifier: "LambdaConflictHandlerConfig",
}) as any as S.Schema<LambdaConflictHandlerConfig>;
export interface SyncConfig {
  conflictHandler?: string;
  conflictDetection?: string;
  lambdaConflictHandlerConfig?: LambdaConflictHandlerConfig;
}
export const SyncConfig = S.suspend(() =>
  S.Struct({
    conflictHandler: S.optional(S.String),
    conflictDetection: S.optional(S.String),
    lambdaConflictHandlerConfig: S.optional(LambdaConflictHandlerConfig),
  }),
).annotations({ identifier: "SyncConfig" }) as any as S.Schema<SyncConfig>;
export interface UpdateFunctionRequest {
  apiId: string;
  name: string;
  description?: string;
  functionId: string;
  dataSourceName: string;
  requestMappingTemplate?: string;
  responseMappingTemplate?: string;
  functionVersion?: string;
  syncConfig?: SyncConfig;
  maxBatchSize?: number;
  runtime?: AppSyncRuntime;
  code?: string;
}
export const UpdateFunctionRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    name: S.String,
    description: S.optional(S.String),
    functionId: S.String.pipe(T.HttpLabel("functionId")),
    dataSourceName: S.String,
    requestMappingTemplate: S.optional(S.String),
    responseMappingTemplate: S.optional(S.String),
    functionVersion: S.optional(S.String),
    syncConfig: S.optional(SyncConfig),
    maxBatchSize: S.optional(S.Number),
    runtime: S.optional(AppSyncRuntime),
    code: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/v1/apis/{apiId}/functions/{functionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFunctionRequest",
}) as any as S.Schema<UpdateFunctionRequest>;
export interface LogConfig {
  fieldLogLevel: string;
  cloudWatchLogsRoleArn: string;
  excludeVerboseContent?: boolean;
}
export const LogConfig = S.suspend(() =>
  S.Struct({
    fieldLogLevel: S.String,
    cloudWatchLogsRoleArn: S.String,
    excludeVerboseContent: S.optional(S.Boolean),
  }),
).annotations({ identifier: "LogConfig" }) as any as S.Schema<LogConfig>;
export interface UserPoolConfig {
  userPoolId: string;
  awsRegion: string;
  defaultAction: string;
  appIdClientRegex?: string;
}
export const UserPoolConfig = S.suspend(() =>
  S.Struct({
    userPoolId: S.String,
    awsRegion: S.String,
    defaultAction: S.String,
    appIdClientRegex: S.optional(S.String),
  }),
).annotations({
  identifier: "UserPoolConfig",
}) as any as S.Schema<UserPoolConfig>;
export interface CognitoUserPoolConfig {
  userPoolId: string;
  awsRegion: string;
  appIdClientRegex?: string;
}
export const CognitoUserPoolConfig = S.suspend(() =>
  S.Struct({
    userPoolId: S.String,
    awsRegion: S.String,
    appIdClientRegex: S.optional(S.String),
  }),
).annotations({
  identifier: "CognitoUserPoolConfig",
}) as any as S.Schema<CognitoUserPoolConfig>;
export interface AdditionalAuthenticationProvider {
  authenticationType?: string;
  openIDConnectConfig?: OpenIDConnectConfig;
  userPoolConfig?: CognitoUserPoolConfig;
  lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
}
export const AdditionalAuthenticationProvider = S.suspend(() =>
  S.Struct({
    authenticationType: S.optional(S.String),
    openIDConnectConfig: S.optional(OpenIDConnectConfig),
    userPoolConfig: S.optional(CognitoUserPoolConfig),
    lambdaAuthorizerConfig: S.optional(LambdaAuthorizerConfig),
  }),
).annotations({
  identifier: "AdditionalAuthenticationProvider",
}) as any as S.Schema<AdditionalAuthenticationProvider>;
export type AdditionalAuthenticationProviders =
  AdditionalAuthenticationProvider[];
export const AdditionalAuthenticationProviders = S.Array(
  AdditionalAuthenticationProvider,
);
export interface EnhancedMetricsConfig {
  resolverLevelMetricsBehavior: string;
  dataSourceLevelMetricsBehavior: string;
  operationLevelMetricsConfig: string;
}
export const EnhancedMetricsConfig = S.suspend(() =>
  S.Struct({
    resolverLevelMetricsBehavior: S.String,
    dataSourceLevelMetricsBehavior: S.String,
    operationLevelMetricsConfig: S.String,
  }),
).annotations({
  identifier: "EnhancedMetricsConfig",
}) as any as S.Schema<EnhancedMetricsConfig>;
export interface UpdateGraphqlApiRequest {
  apiId: string;
  name: string;
  logConfig?: LogConfig;
  authenticationType: string;
  userPoolConfig?: UserPoolConfig;
  openIDConnectConfig?: OpenIDConnectConfig;
  additionalAuthenticationProviders?: AdditionalAuthenticationProviders;
  xrayEnabled?: boolean;
  lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
  mergedApiExecutionRoleArn?: string;
  ownerContact?: string;
  introspectionConfig?: string;
  queryDepthLimit?: number;
  resolverCountLimit?: number;
  enhancedMetricsConfig?: EnhancedMetricsConfig;
}
export const UpdateGraphqlApiRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis/{apiId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGraphqlApiRequest",
}) as any as S.Schema<UpdateGraphqlApiRequest>;
export type FunctionsIds = string[];
export const FunctionsIds = S.Array(S.String);
export interface PipelineConfig {
  functions?: FunctionsIds;
}
export const PipelineConfig = S.suspend(() =>
  S.Struct({ functions: S.optional(FunctionsIds) }),
).annotations({
  identifier: "PipelineConfig",
}) as any as S.Schema<PipelineConfig>;
export type CachingKeys = string[];
export const CachingKeys = S.Array(S.String);
export interface CachingConfig {
  ttl: number;
  cachingKeys?: CachingKeys;
}
export const CachingConfig = S.suspend(() =>
  S.Struct({ ttl: S.Number, cachingKeys: S.optional(CachingKeys) }),
).annotations({
  identifier: "CachingConfig",
}) as any as S.Schema<CachingConfig>;
export interface UpdateResolverRequest {
  apiId: string;
  typeName: string;
  fieldName: string;
  dataSourceName?: string;
  requestMappingTemplate?: string;
  responseMappingTemplate?: string;
  kind?: string;
  pipelineConfig?: PipelineConfig;
  syncConfig?: SyncConfig;
  cachingConfig?: CachingConfig;
  maxBatchSize?: number;
  runtime?: AppSyncRuntime;
  code?: string;
  metricsConfig?: string;
}
export const UpdateResolverRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    typeName: S.String.pipe(T.HttpLabel("typeName")),
    fieldName: S.String.pipe(T.HttpLabel("fieldName")),
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
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateResolverRequest",
}) as any as S.Schema<UpdateResolverRequest>;
export interface UpdateSourceApiAssociationRequest {
  associationId: string;
  mergedApiIdentifier: string;
  description?: string;
  sourceApiAssociationConfig?: SourceApiAssociationConfig;
}
export const UpdateSourceApiAssociationRequest = S.suspend(() =>
  S.Struct({
    associationId: S.String.pipe(T.HttpLabel("associationId")),
    mergedApiIdentifier: S.String.pipe(T.HttpLabel("mergedApiIdentifier")),
    description: S.optional(S.String),
    sourceApiAssociationConfig: S.optional(SourceApiAssociationConfig),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateSourceApiAssociationRequest",
}) as any as S.Schema<UpdateSourceApiAssociationRequest>;
export interface UpdateTypeRequest {
  apiId: string;
  typeName: string;
  definition?: string;
  format: string;
}
export const UpdateTypeRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    typeName: S.String.pipe(T.HttpLabel("typeName")),
    definition: S.optional(S.String),
    format: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis/{apiId}/types/{typeName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTypeRequest",
}) as any as S.Schema<UpdateTypeRequest>;
export type Logs = string[];
export const Logs = S.Array(S.String);
export interface ApiKey {
  id?: string;
  description?: string;
  expires?: number;
  deletes?: number;
}
export const ApiKey = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    description: S.optional(S.String),
    expires: S.optional(S.Number),
    deletes: S.optional(S.Number),
  }),
).annotations({ identifier: "ApiKey" }) as any as S.Schema<ApiKey>;
export type ApiKeys = ApiKey[];
export const ApiKeys = S.Array(ApiKey);
export type MapOfStringToString = { [key: string]: string };
export const MapOfStringToString = S.Record({ key: S.String, value: S.String });
export interface Api {
  apiId?: string;
  name?: string;
  ownerContact?: string;
  tags?: TagMap;
  dns?: MapOfStringToString;
  apiArn?: string;
  created?: Date;
  xrayEnabled?: boolean;
  wafWebAclArn?: string;
  eventConfig?: EventConfig;
}
export const Api = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Api" }) as any as S.Schema<Api>;
export type Apis = Api[];
export const Apis = S.Array(Api);
export interface ChannelNamespace {
  apiId?: string;
  name?: string;
  subscribeAuthModes?: AuthModes;
  publishAuthModes?: AuthModes;
  codeHandlers?: string;
  tags?: TagMap;
  channelNamespaceArn?: string;
  created?: Date;
  lastModified?: Date;
  handlerConfigs?: HandlerConfigs;
}
export const ChannelNamespace = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ChannelNamespace",
}) as any as S.Schema<ChannelNamespace>;
export type ChannelNamespaces = ChannelNamespace[];
export const ChannelNamespaces = S.Array(ChannelNamespace);
export interface DataSource {
  dataSourceArn?: string;
  name?: string;
  description?: string;
  type?: string;
  serviceRoleArn?: string;
  dynamodbConfig?: DynamodbDataSourceConfig;
  lambdaConfig?: LambdaDataSourceConfig;
  elasticsearchConfig?: ElasticsearchDataSourceConfig;
  openSearchServiceConfig?: OpenSearchServiceDataSourceConfig;
  httpConfig?: HttpDataSourceConfig;
  relationalDatabaseConfig?: RelationalDatabaseDataSourceConfig;
  eventBridgeConfig?: EventBridgeDataSourceConfig;
  metricsConfig?: string;
}
export const DataSource = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "DataSource" }) as any as S.Schema<DataSource>;
export type DataSources = DataSource[];
export const DataSources = S.Array(DataSource);
export interface DomainNameConfig {
  domainName?: string;
  description?: string;
  certificateArn?: string;
  appsyncDomainName?: string;
  hostedZoneId?: string;
  tags?: TagMap;
  domainNameArn?: string;
}
export const DomainNameConfig = S.suspend(() =>
  S.Struct({
    domainName: S.optional(S.String),
    description: S.optional(S.String),
    certificateArn: S.optional(S.String),
    appsyncDomainName: S.optional(S.String),
    hostedZoneId: S.optional(S.String),
    tags: S.optional(TagMap),
    domainNameArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DomainNameConfig",
}) as any as S.Schema<DomainNameConfig>;
export type DomainNameConfigs = DomainNameConfig[];
export const DomainNameConfigs = S.Array(DomainNameConfig);
export interface FunctionConfiguration {
  functionId?: string;
  functionArn?: string;
  name?: string;
  description?: string;
  dataSourceName?: string;
  requestMappingTemplate?: string;
  responseMappingTemplate?: string;
  functionVersion?: string;
  syncConfig?: SyncConfig;
  maxBatchSize?: number;
  runtime?: AppSyncRuntime;
  code?: string;
}
export const FunctionConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "FunctionConfiguration",
}) as any as S.Schema<FunctionConfiguration>;
export type Functions = FunctionConfiguration[];
export const Functions = S.Array(FunctionConfiguration);
export interface GraphqlApi {
  name?: string;
  apiId?: string;
  authenticationType?: string;
  logConfig?: LogConfig;
  userPoolConfig?: UserPoolConfig;
  openIDConnectConfig?: OpenIDConnectConfig;
  arn?: string;
  uris?: MapOfStringToString;
  tags?: TagMap;
  additionalAuthenticationProviders?: AdditionalAuthenticationProviders;
  xrayEnabled?: boolean;
  wafWebAclArn?: string;
  lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
  dns?: MapOfStringToString;
  visibility?: string;
  apiType?: string;
  mergedApiExecutionRoleArn?: string;
  owner?: string;
  ownerContact?: string;
  introspectionConfig?: string;
  queryDepthLimit?: number;
  resolverCountLimit?: number;
  enhancedMetricsConfig?: EnhancedMetricsConfig;
}
export const GraphqlApi = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "GraphqlApi" }) as any as S.Schema<GraphqlApi>;
export type GraphqlApis = GraphqlApi[];
export const GraphqlApis = S.Array(GraphqlApi);
export interface Resolver {
  typeName?: string;
  fieldName?: string;
  dataSourceName?: string;
  resolverArn?: string;
  requestMappingTemplate?: string;
  responseMappingTemplate?: string;
  kind?: string;
  pipelineConfig?: PipelineConfig;
  syncConfig?: SyncConfig;
  cachingConfig?: CachingConfig;
  maxBatchSize?: number;
  runtime?: AppSyncRuntime;
  code?: string;
  metricsConfig?: string;
}
export const Resolver = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Resolver" }) as any as S.Schema<Resolver>;
export type Resolvers = Resolver[];
export const Resolvers = S.Array(Resolver);
export interface Type {
  name?: string;
  description?: string;
  arn?: string;
  definition?: string;
  format?: string;
}
export const Type = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    arn: S.optional(S.String),
    definition: S.optional(S.String),
    format: S.optional(S.String),
  }),
).annotations({ identifier: "Type" }) as any as S.Schema<Type>;
export type TypeList = Type[];
export const TypeList = S.Array(Type);
export type EnvironmentVariableMap = { [key: string]: string };
export const EnvironmentVariableMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface RdsDataApiConfig {
  resourceArn: string;
  secretArn: string;
  databaseName: string;
}
export const RdsDataApiConfig = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    secretArn: S.String,
    databaseName: S.String,
  }),
).annotations({
  identifier: "RdsDataApiConfig",
}) as any as S.Schema<RdsDataApiConfig>;
export interface AssociateMergedGraphqlApiRequest {
  sourceApiIdentifier: string;
  mergedApiIdentifier: string;
  description?: string;
  sourceApiAssociationConfig?: SourceApiAssociationConfig;
}
export const AssociateMergedGraphqlApiRequest = S.suspend(() =>
  S.Struct({
    sourceApiIdentifier: S.String.pipe(T.HttpLabel("sourceApiIdentifier")),
    mergedApiIdentifier: S.String,
    description: S.optional(S.String),
    sourceApiAssociationConfig: S.optional(SourceApiAssociationConfig),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateMergedGraphqlApiRequest",
}) as any as S.Schema<AssociateMergedGraphqlApiRequest>;
export interface CreateResolverRequest {
  apiId: string;
  typeName: string;
  fieldName: string;
  dataSourceName?: string;
  requestMappingTemplate?: string;
  responseMappingTemplate?: string;
  kind?: string;
  pipelineConfig?: PipelineConfig;
  syncConfig?: SyncConfig;
  cachingConfig?: CachingConfig;
  maxBatchSize?: number;
  runtime?: AppSyncRuntime;
  code?: string;
  metricsConfig?: string;
}
export const CreateResolverRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    typeName: S.String.pipe(T.HttpLabel("typeName")),
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
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateResolverRequest",
}) as any as S.Schema<CreateResolverRequest>;
export interface DisassociateMergedGraphqlApiResponse {
  sourceApiAssociationStatus?: string;
}
export const DisassociateMergedGraphqlApiResponse = S.suspend(() =>
  S.Struct({ sourceApiAssociationStatus: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DisassociateMergedGraphqlApiResponse",
}) as any as S.Schema<DisassociateMergedGraphqlApiResponse>;
export interface DisassociateSourceGraphqlApiResponse {
  sourceApiAssociationStatus?: string;
}
export const DisassociateSourceGraphqlApiResponse = S.suspend(() =>
  S.Struct({ sourceApiAssociationStatus: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DisassociateSourceGraphqlApiResponse",
}) as any as S.Schema<DisassociateSourceGraphqlApiResponse>;
export interface ApiAssociation {
  domainName?: string;
  apiId?: string;
  associationStatus?: string;
  deploymentDetail?: string;
}
export const ApiAssociation = S.suspend(() =>
  S.Struct({
    domainName: S.optional(S.String),
    apiId: S.optional(S.String),
    associationStatus: S.optional(S.String),
    deploymentDetail: S.optional(S.String),
  }),
).annotations({
  identifier: "ApiAssociation",
}) as any as S.Schema<ApiAssociation>;
export interface GetApiAssociationResponse {
  apiAssociation?: ApiAssociation;
}
export const GetApiAssociationResponse = S.suspend(() =>
  S.Struct({ apiAssociation: S.optional(ApiAssociation) }).pipe(ns),
).annotations({
  identifier: "GetApiAssociationResponse",
}) as any as S.Schema<GetApiAssociationResponse>;
export interface ApiCache {
  ttl?: number;
  apiCachingBehavior?: string;
  transitEncryptionEnabled?: boolean;
  atRestEncryptionEnabled?: boolean;
  type?: string;
  status?: string;
  healthMetricsConfig?: string;
}
export const ApiCache = S.suspend(() =>
  S.Struct({
    ttl: S.optional(S.Number),
    apiCachingBehavior: S.optional(S.String),
    transitEncryptionEnabled: S.optional(S.Boolean),
    atRestEncryptionEnabled: S.optional(S.Boolean),
    type: S.optional(S.String),
    status: S.optional(S.String),
    healthMetricsConfig: S.optional(S.String),
  }),
).annotations({ identifier: "ApiCache" }) as any as S.Schema<ApiCache>;
export interface GetApiCacheResponse {
  apiCache?: ApiCache;
}
export const GetApiCacheResponse = S.suspend(() =>
  S.Struct({ apiCache: S.optional(ApiCache) }).pipe(ns),
).annotations({
  identifier: "GetApiCacheResponse",
}) as any as S.Schema<GetApiCacheResponse>;
export interface GetDomainNameResponse {
  domainNameConfig?: DomainNameConfig;
}
export const GetDomainNameResponse = S.suspend(() =>
  S.Struct({ domainNameConfig: S.optional(DomainNameConfig) }).pipe(ns),
).annotations({
  identifier: "GetDomainNameResponse",
}) as any as S.Schema<GetDomainNameResponse>;
export interface GetGraphqlApiEnvironmentVariablesResponse {
  environmentVariables?: EnvironmentVariableMap;
}
export const GetGraphqlApiEnvironmentVariablesResponse = S.suspend(() =>
  S.Struct({ environmentVariables: S.optional(EnvironmentVariableMap) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetGraphqlApiEnvironmentVariablesResponse",
}) as any as S.Schema<GetGraphqlApiEnvironmentVariablesResponse>;
export interface GetIntrospectionSchemaResponse {
  schema?: T.StreamingOutputBody;
}
export const GetIntrospectionSchemaResponse = S.suspend(() =>
  S.Struct({
    schema: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  }).pipe(ns),
).annotations({
  identifier: "GetIntrospectionSchemaResponse",
}) as any as S.Schema<GetIntrospectionSchemaResponse>;
export interface GetSchemaCreationStatusResponse {
  status?: string;
  details?: string;
}
export const GetSchemaCreationStatusResponse = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    details: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetSchemaCreationStatusResponse",
}) as any as S.Schema<GetSchemaCreationStatusResponse>;
export interface SourceApiAssociation {
  associationId?: string;
  associationArn?: string;
  sourceApiId?: string;
  sourceApiArn?: string;
  mergedApiArn?: string;
  mergedApiId?: string;
  description?: string;
  sourceApiAssociationConfig?: SourceApiAssociationConfig;
  sourceApiAssociationStatus?: string;
  sourceApiAssociationStatusDetail?: string;
  lastSuccessfulMergeDate?: Date;
}
export const SourceApiAssociation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "SourceApiAssociation",
}) as any as S.Schema<SourceApiAssociation>;
export interface GetSourceApiAssociationResponse {
  sourceApiAssociation?: SourceApiAssociation;
}
export const GetSourceApiAssociationResponse = S.suspend(() =>
  S.Struct({ sourceApiAssociation: S.optional(SourceApiAssociation) }).pipe(ns),
).annotations({
  identifier: "GetSourceApiAssociationResponse",
}) as any as S.Schema<GetSourceApiAssociationResponse>;
export interface GetTypeResponse {
  type?: Type;
}
export const GetTypeResponse = S.suspend(() =>
  S.Struct({ type: S.optional(Type) }).pipe(ns),
).annotations({
  identifier: "GetTypeResponse",
}) as any as S.Schema<GetTypeResponse>;
export interface ListApiKeysResponse {
  apiKeys?: ApiKeys;
  nextToken?: string;
}
export const ListApiKeysResponse = S.suspend(() =>
  S.Struct({
    apiKeys: S.optional(ApiKeys),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListApiKeysResponse",
}) as any as S.Schema<ListApiKeysResponse>;
export interface ListApisResponse {
  apis?: Apis;
  nextToken?: string;
}
export const ListApisResponse = S.suspend(() =>
  S.Struct({ apis: S.optional(Apis), nextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListApisResponse",
}) as any as S.Schema<ListApisResponse>;
export interface ListChannelNamespacesResponse {
  channelNamespaces?: ChannelNamespaces;
  nextToken?: string;
}
export const ListChannelNamespacesResponse = S.suspend(() =>
  S.Struct({
    channelNamespaces: S.optional(ChannelNamespaces),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListChannelNamespacesResponse",
}) as any as S.Schema<ListChannelNamespacesResponse>;
export interface ListDataSourcesResponse {
  dataSources?: DataSources;
  nextToken?: string;
}
export const ListDataSourcesResponse = S.suspend(() =>
  S.Struct({
    dataSources: S.optional(DataSources),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDataSourcesResponse",
}) as any as S.Schema<ListDataSourcesResponse>;
export interface ListDomainNamesResponse {
  domainNameConfigs?: DomainNameConfigs;
  nextToken?: string;
}
export const ListDomainNamesResponse = S.suspend(() =>
  S.Struct({
    domainNameConfigs: S.optional(DomainNameConfigs),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDomainNamesResponse",
}) as any as S.Schema<ListDomainNamesResponse>;
export interface ListFunctionsResponse {
  functions?: Functions;
  nextToken?: string;
}
export const ListFunctionsResponse = S.suspend(() =>
  S.Struct({
    functions: S.optional(Functions),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListFunctionsResponse",
}) as any as S.Schema<ListFunctionsResponse>;
export interface ListGraphqlApisResponse {
  graphqlApis?: GraphqlApis;
  nextToken?: string;
}
export const ListGraphqlApisResponse = S.suspend(() =>
  S.Struct({
    graphqlApis: S.optional(GraphqlApis),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListGraphqlApisResponse",
}) as any as S.Schema<ListGraphqlApisResponse>;
export interface ListResolversResponse {
  resolvers?: Resolvers;
  nextToken?: string;
}
export const ListResolversResponse = S.suspend(() =>
  S.Struct({
    resolvers: S.optional(Resolvers),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListResolversResponse",
}) as any as S.Schema<ListResolversResponse>;
export interface ListResolversByFunctionResponse {
  resolvers?: Resolvers;
  nextToken?: string;
}
export const ListResolversByFunctionResponse = S.suspend(() =>
  S.Struct({
    resolvers: S.optional(Resolvers),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListResolversByFunctionResponse",
}) as any as S.Schema<ListResolversByFunctionResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListTypesResponse {
  types?: TypeList;
  nextToken?: string;
}
export const ListTypesResponse = S.suspend(() =>
  S.Struct({
    types: S.optional(TypeList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTypesResponse",
}) as any as S.Schema<ListTypesResponse>;
export interface ListTypesByAssociationResponse {
  types?: TypeList;
  nextToken?: string;
}
export const ListTypesByAssociationResponse = S.suspend(() =>
  S.Struct({
    types: S.optional(TypeList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTypesByAssociationResponse",
}) as any as S.Schema<ListTypesByAssociationResponse>;
export interface PutGraphqlApiEnvironmentVariablesRequest {
  apiId: string;
  environmentVariables: EnvironmentVariableMap;
}
export const PutGraphqlApiEnvironmentVariablesRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    environmentVariables: EnvironmentVariableMap,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v1/apis/{apiId}/environmentVariables" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutGraphqlApiEnvironmentVariablesRequest",
}) as any as S.Schema<PutGraphqlApiEnvironmentVariablesRequest>;
export interface StartDataSourceIntrospectionRequest {
  rdsDataApiConfig?: RdsDataApiConfig;
}
export const StartDataSourceIntrospectionRequest = S.suspend(() =>
  S.Struct({ rdsDataApiConfig: S.optional(RdsDataApiConfig) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/datasources/introspections" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDataSourceIntrospectionRequest",
}) as any as S.Schema<StartDataSourceIntrospectionRequest>;
export interface StartSchemaCreationResponse {
  status?: string;
}
export const StartSchemaCreationResponse = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartSchemaCreationResponse",
}) as any as S.Schema<StartSchemaCreationResponse>;
export interface StartSchemaMergeResponse {
  sourceApiAssociationStatus?: string;
}
export const StartSchemaMergeResponse = S.suspend(() =>
  S.Struct({ sourceApiAssociationStatus: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartSchemaMergeResponse",
}) as any as S.Schema<StartSchemaMergeResponse>;
export interface UpdateApiResponse {
  api?: Api;
}
export const UpdateApiResponse = S.suspend(() =>
  S.Struct({ api: S.optional(Api) }).pipe(ns),
).annotations({
  identifier: "UpdateApiResponse",
}) as any as S.Schema<UpdateApiResponse>;
export interface UpdateApiCacheResponse {
  apiCache?: ApiCache;
}
export const UpdateApiCacheResponse = S.suspend(() =>
  S.Struct({ apiCache: S.optional(ApiCache) }).pipe(ns),
).annotations({
  identifier: "UpdateApiCacheResponse",
}) as any as S.Schema<UpdateApiCacheResponse>;
export interface UpdateApiKeyResponse {
  apiKey?: ApiKey;
}
export const UpdateApiKeyResponse = S.suspend(() =>
  S.Struct({ apiKey: S.optional(ApiKey) }).pipe(ns),
).annotations({
  identifier: "UpdateApiKeyResponse",
}) as any as S.Schema<UpdateApiKeyResponse>;
export interface UpdateChannelNamespaceResponse {
  channelNamespace?: ChannelNamespace;
}
export const UpdateChannelNamespaceResponse = S.suspend(() =>
  S.Struct({ channelNamespace: S.optional(ChannelNamespace) }).pipe(ns),
).annotations({
  identifier: "UpdateChannelNamespaceResponse",
}) as any as S.Schema<UpdateChannelNamespaceResponse>;
export interface UpdateDataSourceResponse {
  dataSource?: DataSource;
}
export const UpdateDataSourceResponse = S.suspend(() =>
  S.Struct({ dataSource: S.optional(DataSource) }).pipe(ns),
).annotations({
  identifier: "UpdateDataSourceResponse",
}) as any as S.Schema<UpdateDataSourceResponse>;
export interface UpdateDomainNameResponse {
  domainNameConfig?: DomainNameConfig;
}
export const UpdateDomainNameResponse = S.suspend(() =>
  S.Struct({ domainNameConfig: S.optional(DomainNameConfig) }).pipe(ns),
).annotations({
  identifier: "UpdateDomainNameResponse",
}) as any as S.Schema<UpdateDomainNameResponse>;
export interface UpdateFunctionResponse {
  functionConfiguration?: FunctionConfiguration;
}
export const UpdateFunctionResponse = S.suspend(() =>
  S.Struct({ functionConfiguration: S.optional(FunctionConfiguration) }).pipe(
    ns,
  ),
).annotations({
  identifier: "UpdateFunctionResponse",
}) as any as S.Schema<UpdateFunctionResponse>;
export interface UpdateGraphqlApiResponse {
  graphqlApi?: GraphqlApi;
}
export const UpdateGraphqlApiResponse = S.suspend(() =>
  S.Struct({ graphqlApi: S.optional(GraphqlApi) }).pipe(ns),
).annotations({
  identifier: "UpdateGraphqlApiResponse",
}) as any as S.Schema<UpdateGraphqlApiResponse>;
export interface UpdateResolverResponse {
  resolver?: Resolver;
}
export const UpdateResolverResponse = S.suspend(() =>
  S.Struct({ resolver: S.optional(Resolver) }).pipe(ns),
).annotations({
  identifier: "UpdateResolverResponse",
}) as any as S.Schema<UpdateResolverResponse>;
export interface UpdateSourceApiAssociationResponse {
  sourceApiAssociation?: SourceApiAssociation;
}
export const UpdateSourceApiAssociationResponse = S.suspend(() =>
  S.Struct({ sourceApiAssociation: S.optional(SourceApiAssociation) }).pipe(ns),
).annotations({
  identifier: "UpdateSourceApiAssociationResponse",
}) as any as S.Schema<UpdateSourceApiAssociationResponse>;
export interface UpdateTypeResponse {
  type?: Type;
}
export const UpdateTypeResponse = S.suspend(() =>
  S.Struct({ type: S.optional(Type) }).pipe(ns),
).annotations({
  identifier: "UpdateTypeResponse",
}) as any as S.Schema<UpdateTypeResponse>;
export interface CodeErrorLocation {
  line?: number;
  column?: number;
  span?: number;
}
export const CodeErrorLocation = S.suspend(() =>
  S.Struct({
    line: S.optional(S.Number),
    column: S.optional(S.Number),
    span: S.optional(S.Number),
  }),
).annotations({
  identifier: "CodeErrorLocation",
}) as any as S.Schema<CodeErrorLocation>;
export interface CodeError {
  errorType?: string;
  value?: string;
  location?: CodeErrorLocation;
}
export const CodeError = S.suspend(() =>
  S.Struct({
    errorType: S.optional(S.String),
    value: S.optional(S.String),
    location: S.optional(CodeErrorLocation),
  }),
).annotations({ identifier: "CodeError" }) as any as S.Schema<CodeError>;
export type CodeErrors = CodeError[];
export const CodeErrors = S.Array(CodeError);
export interface EvaluateCodeErrorDetail {
  message?: string;
  codeErrors?: CodeErrors;
}
export const EvaluateCodeErrorDetail = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    codeErrors: S.optional(CodeErrors),
  }),
).annotations({
  identifier: "EvaluateCodeErrorDetail",
}) as any as S.Schema<EvaluateCodeErrorDetail>;
export interface ErrorDetail {
  message?: string;
}
export const ErrorDetail = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({ identifier: "ErrorDetail" }) as any as S.Schema<ErrorDetail>;
export interface SourceApiAssociationSummary {
  associationId?: string;
  associationArn?: string;
  sourceApiId?: string;
  sourceApiArn?: string;
  mergedApiId?: string;
  mergedApiArn?: string;
  description?: string;
}
export const SourceApiAssociationSummary = S.suspend(() =>
  S.Struct({
    associationId: S.optional(S.String),
    associationArn: S.optional(S.String),
    sourceApiId: S.optional(S.String),
    sourceApiArn: S.optional(S.String),
    mergedApiId: S.optional(S.String),
    mergedApiArn: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceApiAssociationSummary",
}) as any as S.Schema<SourceApiAssociationSummary>;
export type SourceApiAssociationSummaryList = SourceApiAssociationSummary[];
export const SourceApiAssociationSummaryList = S.Array(
  SourceApiAssociationSummary,
);
export type DataSourceIntrospectionModelIndexFields = string[];
export const DataSourceIntrospectionModelIndexFields = S.Array(S.String);
export interface DataSourceIntrospectionModelIndex {
  name?: string;
  fields?: DataSourceIntrospectionModelIndexFields;
}
export const DataSourceIntrospectionModelIndex = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    fields: S.optional(DataSourceIntrospectionModelIndexFields),
  }),
).annotations({
  identifier: "DataSourceIntrospectionModelIndex",
}) as any as S.Schema<DataSourceIntrospectionModelIndex>;
export type DataSourceIntrospectionModelIndexes =
  DataSourceIntrospectionModelIndex[];
export const DataSourceIntrospectionModelIndexes = S.Array(
  DataSourceIntrospectionModelIndex,
);
export interface AssociateApiResponse {
  apiAssociation?: ApiAssociation;
}
export const AssociateApiResponse = S.suspend(() =>
  S.Struct({ apiAssociation: S.optional(ApiAssociation) }).pipe(ns),
).annotations({
  identifier: "AssociateApiResponse",
}) as any as S.Schema<AssociateApiResponse>;
export interface AssociateMergedGraphqlApiResponse {
  sourceApiAssociation?: SourceApiAssociation;
}
export const AssociateMergedGraphqlApiResponse = S.suspend(() =>
  S.Struct({ sourceApiAssociation: S.optional(SourceApiAssociation) }).pipe(ns),
).annotations({
  identifier: "AssociateMergedGraphqlApiResponse",
}) as any as S.Schema<AssociateMergedGraphqlApiResponse>;
export interface AssociateSourceGraphqlApiResponse {
  sourceApiAssociation?: SourceApiAssociation;
}
export const AssociateSourceGraphqlApiResponse = S.suspend(() =>
  S.Struct({ sourceApiAssociation: S.optional(SourceApiAssociation) }).pipe(ns),
).annotations({
  identifier: "AssociateSourceGraphqlApiResponse",
}) as any as S.Schema<AssociateSourceGraphqlApiResponse>;
export interface CreateApiCacheResponse {
  apiCache?: ApiCache;
}
export const CreateApiCacheResponse = S.suspend(() =>
  S.Struct({ apiCache: S.optional(ApiCache) }).pipe(ns),
).annotations({
  identifier: "CreateApiCacheResponse",
}) as any as S.Schema<CreateApiCacheResponse>;
export interface CreateApiKeyResponse {
  apiKey?: ApiKey;
}
export const CreateApiKeyResponse = S.suspend(() =>
  S.Struct({ apiKey: S.optional(ApiKey) }).pipe(ns),
).annotations({
  identifier: "CreateApiKeyResponse",
}) as any as S.Schema<CreateApiKeyResponse>;
export interface CreateDomainNameResponse {
  domainNameConfig?: DomainNameConfig;
}
export const CreateDomainNameResponse = S.suspend(() =>
  S.Struct({ domainNameConfig: S.optional(DomainNameConfig) }).pipe(ns),
).annotations({
  identifier: "CreateDomainNameResponse",
}) as any as S.Schema<CreateDomainNameResponse>;
export interface CreateFunctionRequest {
  apiId: string;
  name: string;
  description?: string;
  dataSourceName: string;
  requestMappingTemplate?: string;
  responseMappingTemplate?: string;
  functionVersion?: string;
  syncConfig?: SyncConfig;
  maxBatchSize?: number;
  runtime?: AppSyncRuntime;
  code?: string;
}
export const CreateFunctionRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis/{apiId}/functions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFunctionRequest",
}) as any as S.Schema<CreateFunctionRequest>;
export interface CreateGraphqlApiRequest {
  name: string;
  logConfig?: LogConfig;
  authenticationType: string;
  userPoolConfig?: UserPoolConfig;
  openIDConnectConfig?: OpenIDConnectConfig;
  tags?: TagMap;
  additionalAuthenticationProviders?: AdditionalAuthenticationProviders;
  xrayEnabled?: boolean;
  lambdaAuthorizerConfig?: LambdaAuthorizerConfig;
  apiType?: string;
  mergedApiExecutionRoleArn?: string;
  visibility?: string;
  ownerContact?: string;
  introspectionConfig?: string;
  queryDepthLimit?: number;
  resolverCountLimit?: number;
  enhancedMetricsConfig?: EnhancedMetricsConfig;
}
export const CreateGraphqlApiRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGraphqlApiRequest",
}) as any as S.Schema<CreateGraphqlApiRequest>;
export interface CreateResolverResponse {
  resolver?: Resolver;
}
export const CreateResolverResponse = S.suspend(() =>
  S.Struct({ resolver: S.optional(Resolver) }).pipe(ns),
).annotations({
  identifier: "CreateResolverResponse",
}) as any as S.Schema<CreateResolverResponse>;
export interface CreateTypeResponse {
  type?: Type;
}
export const CreateTypeResponse = S.suspend(() =>
  S.Struct({ type: S.optional(Type) }).pipe(ns),
).annotations({
  identifier: "CreateTypeResponse",
}) as any as S.Schema<CreateTypeResponse>;
export interface EvaluateCodeResponse {
  evaluationResult?: string;
  error?: EvaluateCodeErrorDetail;
  logs?: Logs;
  stash?: string;
  outErrors?: string;
}
export const EvaluateCodeResponse = S.suspend(() =>
  S.Struct({
    evaluationResult: S.optional(S.String),
    error: S.optional(EvaluateCodeErrorDetail),
    logs: S.optional(Logs),
    stash: S.optional(S.String),
    outErrors: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "EvaluateCodeResponse",
}) as any as S.Schema<EvaluateCodeResponse>;
export interface EvaluateMappingTemplateResponse {
  evaluationResult?: string;
  error?: ErrorDetail;
  logs?: Logs;
  stash?: string;
  outErrors?: string;
}
export const EvaluateMappingTemplateResponse = S.suspend(() =>
  S.Struct({
    evaluationResult: S.optional(S.String),
    error: S.optional(ErrorDetail),
    logs: S.optional(Logs),
    stash: S.optional(S.String),
    outErrors: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "EvaluateMappingTemplateResponse",
}) as any as S.Schema<EvaluateMappingTemplateResponse>;
export interface GetChannelNamespaceResponse {
  channelNamespace?: ChannelNamespace;
}
export const GetChannelNamespaceResponse = S.suspend(() =>
  S.Struct({ channelNamespace: S.optional(ChannelNamespace) }).pipe(ns),
).annotations({
  identifier: "GetChannelNamespaceResponse",
}) as any as S.Schema<GetChannelNamespaceResponse>;
export interface GetDataSourceResponse {
  dataSource?: DataSource;
}
export const GetDataSourceResponse = S.suspend(() =>
  S.Struct({ dataSource: S.optional(DataSource) }).pipe(ns),
).annotations({
  identifier: "GetDataSourceResponse",
}) as any as S.Schema<GetDataSourceResponse>;
export interface GetFunctionResponse {
  functionConfiguration?: FunctionConfiguration;
}
export const GetFunctionResponse = S.suspend(() =>
  S.Struct({ functionConfiguration: S.optional(FunctionConfiguration) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetFunctionResponse",
}) as any as S.Schema<GetFunctionResponse>;
export interface GetGraphqlApiResponse {
  graphqlApi?: GraphqlApi;
}
export const GetGraphqlApiResponse = S.suspend(() =>
  S.Struct({ graphqlApi: S.optional(GraphqlApi) }).pipe(ns),
).annotations({
  identifier: "GetGraphqlApiResponse",
}) as any as S.Schema<GetGraphqlApiResponse>;
export interface GetResolverResponse {
  resolver?: Resolver;
}
export const GetResolverResponse = S.suspend(() =>
  S.Struct({ resolver: S.optional(Resolver) }).pipe(ns),
).annotations({
  identifier: "GetResolverResponse",
}) as any as S.Schema<GetResolverResponse>;
export interface ListSourceApiAssociationsResponse {
  sourceApiAssociationSummaries?: SourceApiAssociationSummaryList;
  nextToken?: string;
}
export const ListSourceApiAssociationsResponse = S.suspend(() =>
  S.Struct({
    sourceApiAssociationSummaries: S.optional(SourceApiAssociationSummaryList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSourceApiAssociationsResponse",
}) as any as S.Schema<ListSourceApiAssociationsResponse>;
export interface PutGraphqlApiEnvironmentVariablesResponse {
  environmentVariables?: EnvironmentVariableMap;
}
export const PutGraphqlApiEnvironmentVariablesResponse = S.suspend(() =>
  S.Struct({ environmentVariables: S.optional(EnvironmentVariableMap) }).pipe(
    ns,
  ),
).annotations({
  identifier: "PutGraphqlApiEnvironmentVariablesResponse",
}) as any as S.Schema<PutGraphqlApiEnvironmentVariablesResponse>;
export interface StartDataSourceIntrospectionResponse {
  introspectionId?: string;
  introspectionStatus?: string;
  introspectionStatusDetail?: string;
}
export const StartDataSourceIntrospectionResponse = S.suspend(() =>
  S.Struct({
    introspectionId: S.optional(S.String),
    introspectionStatus: S.optional(S.String),
    introspectionStatusDetail: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "StartDataSourceIntrospectionResponse",
}) as any as S.Schema<StartDataSourceIntrospectionResponse>;
export interface CreateApiRequest {
  name: string;
  ownerContact?: string;
  tags?: TagMap;
  eventConfig: EventConfig;
}
export const CreateApiRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    ownerContact: S.optional(S.String),
    tags: S.optional(TagMap),
    eventConfig: EventConfig,
  }).pipe(
    T.all(
      ns,
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
export interface CreateDataSourceRequest {
  apiId: string;
  name: string;
  description?: string;
  type: string;
  serviceRoleArn?: string;
  dynamodbConfig?: DynamodbDataSourceConfig;
  lambdaConfig?: LambdaDataSourceConfig;
  elasticsearchConfig?: ElasticsearchDataSourceConfig;
  openSearchServiceConfig?: OpenSearchServiceDataSourceConfig;
  httpConfig?: HttpDataSourceConfig;
  relationalDatabaseConfig?: RelationalDatabaseDataSourceConfig;
  eventBridgeConfig?: EventBridgeDataSourceConfig;
  metricsConfig?: string;
}
export const CreateDataSourceRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/apis/{apiId}/datasources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataSourceRequest",
}) as any as S.Schema<CreateDataSourceRequest>;
export interface CreateFunctionResponse {
  functionConfiguration?: FunctionConfiguration;
}
export const CreateFunctionResponse = S.suspend(() =>
  S.Struct({ functionConfiguration: S.optional(FunctionConfiguration) }).pipe(
    ns,
  ),
).annotations({
  identifier: "CreateFunctionResponse",
}) as any as S.Schema<CreateFunctionResponse>;
export interface CreateGraphqlApiResponse {
  graphqlApi?: GraphqlApi;
}
export const CreateGraphqlApiResponse = S.suspend(() =>
  S.Struct({ graphqlApi: S.optional(GraphqlApi) }).pipe(ns),
).annotations({
  identifier: "CreateGraphqlApiResponse",
}) as any as S.Schema<CreateGraphqlApiResponse>;
export interface GetApiResponse {
  api?: Api;
}
export const GetApiResponse = S.suspend(() =>
  S.Struct({ api: S.optional(Api) }).pipe(ns),
).annotations({
  identifier: "GetApiResponse",
}) as any as S.Schema<GetApiResponse>;
export type DataSourceIntrospectionModelFieldTypeValues = string[];
export const DataSourceIntrospectionModelFieldTypeValues = S.Array(S.String);
export interface DataSourceIntrospectionModelFieldType {
  kind?: string;
  name?: string;
  type?: DataSourceIntrospectionModelFieldType;
  values?: DataSourceIntrospectionModelFieldTypeValues;
}
export const DataSourceIntrospectionModelFieldType = S.suspend(() =>
  S.Struct({
    kind: S.optional(S.String),
    name: S.optional(S.String),
    type: S.optional(
      S.suspend(
        (): S.Schema<DataSourceIntrospectionModelFieldType, any> =>
          DataSourceIntrospectionModelFieldType,
      ).annotations({ identifier: "DataSourceIntrospectionModelFieldType" }),
    ),
    values: S.optional(DataSourceIntrospectionModelFieldTypeValues),
  }),
).annotations({
  identifier: "DataSourceIntrospectionModelFieldType",
}) as any as S.Schema<DataSourceIntrospectionModelFieldType>;
export interface BadRequestDetail {
  codeErrors?: CodeErrors;
}
export const BadRequestDetail = S.suspend(() =>
  S.Struct({ codeErrors: S.optional(CodeErrors) }),
).annotations({
  identifier: "BadRequestDetail",
}) as any as S.Schema<BadRequestDetail>;
export interface DataSourceIntrospectionModelField {
  name?: string;
  type?: DataSourceIntrospectionModelFieldType;
  length?: number;
}
export const DataSourceIntrospectionModelField = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(DataSourceIntrospectionModelFieldType),
    length: S.optional(S.Number),
  }),
).annotations({
  identifier: "DataSourceIntrospectionModelField",
}) as any as S.Schema<DataSourceIntrospectionModelField>;
export type DataSourceIntrospectionModelFields =
  DataSourceIntrospectionModelField[];
export const DataSourceIntrospectionModelFields = S.Array(
  DataSourceIntrospectionModelField,
);
export interface CreateApiResponse {
  api?: Api;
}
export const CreateApiResponse = S.suspend(() =>
  S.Struct({ api: S.optional(Api) }).pipe(ns),
).annotations({
  identifier: "CreateApiResponse",
}) as any as S.Schema<CreateApiResponse>;
export interface CreateChannelNamespaceRequest {
  apiId: string;
  name: string;
  subscribeAuthModes?: AuthModes;
  publishAuthModes?: AuthModes;
  codeHandlers?: string;
  tags?: TagMap;
  handlerConfigs?: HandlerConfigs;
}
export const CreateChannelNamespaceRequest = S.suspend(() =>
  S.Struct({
    apiId: S.String.pipe(T.HttpLabel("apiId")),
    name: S.String,
    subscribeAuthModes: S.optional(AuthModes),
    publishAuthModes: S.optional(AuthModes),
    codeHandlers: S.optional(S.String),
    tags: S.optional(TagMap),
    handlerConfigs: S.optional(HandlerConfigs),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v2/apis/{apiId}/channelNamespaces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelNamespaceRequest",
}) as any as S.Schema<CreateChannelNamespaceRequest>;
export interface CreateDataSourceResponse {
  dataSource?: DataSource;
}
export const CreateDataSourceResponse = S.suspend(() =>
  S.Struct({ dataSource: S.optional(DataSource) }).pipe(ns),
).annotations({
  identifier: "CreateDataSourceResponse",
}) as any as S.Schema<CreateDataSourceResponse>;
export interface DataSourceIntrospectionModel {
  name?: string;
  fields?: DataSourceIntrospectionModelFields;
  primaryKey?: DataSourceIntrospectionModelIndex;
  indexes?: DataSourceIntrospectionModelIndexes;
  sdl?: string;
}
export const DataSourceIntrospectionModel = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    fields: S.optional(DataSourceIntrospectionModelFields),
    primaryKey: S.optional(DataSourceIntrospectionModelIndex),
    indexes: S.optional(DataSourceIntrospectionModelIndexes),
    sdl: S.optional(S.String),
  }),
).annotations({
  identifier: "DataSourceIntrospectionModel",
}) as any as S.Schema<DataSourceIntrospectionModel>;
export type DataSourceIntrospectionModels = DataSourceIntrospectionModel[];
export const DataSourceIntrospectionModels = S.Array(
  DataSourceIntrospectionModel,
);
export interface DataSourceIntrospectionResult {
  models?: DataSourceIntrospectionModels;
  nextToken?: string;
}
export const DataSourceIntrospectionResult = S.suspend(() =>
  S.Struct({
    models: S.optional(DataSourceIntrospectionModels),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DataSourceIntrospectionResult",
}) as any as S.Schema<DataSourceIntrospectionResult>;
export interface CreateChannelNamespaceResponse {
  channelNamespace?: ChannelNamespace;
}
export const CreateChannelNamespaceResponse = S.suspend(() =>
  S.Struct({ channelNamespace: S.optional(ChannelNamespace) }).pipe(ns),
).annotations({
  identifier: "CreateChannelNamespaceResponse",
}) as any as S.Schema<CreateChannelNamespaceResponse>;
export interface GetDataSourceIntrospectionResponse {
  introspectionId?: string;
  introspectionStatus?: string;
  introspectionStatusDetail?: string;
  introspectionResult?: DataSourceIntrospectionResult;
}
export const GetDataSourceIntrospectionResponse = S.suspend(() =>
  S.Struct({
    introspectionId: S.optional(S.String),
    introspectionStatus: S.optional(S.String),
    introspectionStatusDetail: S.optional(S.String),
    introspectionResult: S.optional(DataSourceIntrospectionResult),
  }).pipe(ns),
).annotations({
  identifier: "GetDataSourceIntrospectionResponse",
}) as any as S.Schema<GetDataSourceIntrospectionResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class GraphQLSchemaException extends S.TaggedError<GraphQLSchemaException>()(
  "GraphQLSchemaException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ApiKeyValidityOutOfBoundsException extends S.TaggedError<ApiKeyValidityOutOfBoundsException>()(
  "ApiKeyValidityOutOfBoundsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ApiKeyLimitExceededException extends S.TaggedError<ApiKeyLimitExceededException>()(
  "ApiKeyLimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ApiLimitExceededException extends S.TaggedError<ApiLimitExceededException>()(
  "ApiLimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    detail: S.optional(BadRequestDetail),
  },
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}

//# Operations
/**
 * Retrieves an `ApiAssociation` object.
 */
export const getApiAssociation: (
  input: GetApiAssociationRequest,
) => Effect.Effect<
  GetApiAssociationResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves a custom `DomainName` object.
 */
export const getDomainName: (
  input: GetDomainNameRequest,
) => Effect.Effect<
  GetDomainNameResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists multiple custom domain names.
 */
export const listDomainNames: {
  (
    input: ListDomainNamesRequest,
  ): Effect.Effect<
    ListDomainNamesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainNamesRequest,
  ) => Stream.Stream<
    ListDomainNamesResponse,
    | AccessDeniedException
    | BadRequestException
    | InternalFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainNamesRequest,
  ) => Stream.Stream<
    DomainNameConfig,
    | AccessDeniedException
    | BadRequestException
    | InternalFailureException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDomainNamesRequest,
  output: ListDomainNamesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "domainNameConfigs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a custom `DomainName` object.
 */
export const updateDomainName: (
  input: UpdateDomainNameRequest,
) => Effect.Effect<
  UpdateDomainNameResponse,
  | AccessDeniedException
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a custom `DomainName` object.
 */
export const deleteDomainName: (
  input: DeleteDomainNameRequest,
) => Effect.Effect<
  DeleteDomainNameResponse,
  | AccessDeniedException
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes an `ApiAssociation` object from a custom domain.
 */
export const disassociateApi: (
  input: DisassociateApiRequest,
) => Effect.Effect<
  DisassociateApiResponse,
  | AccessDeniedException
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Maps an endpoint to your custom domain.
 */
export const associateApi: (
  input: AssociateApiRequest,
) => Effect.Effect<
  AssociateApiResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a custom `DomainName` object.
 */
export const createDomainName: (
  input: CreateDomainNameRequest,
) => Effect.Effect<
  CreateDomainNameResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainNameRequest,
  output: CreateDomainNameResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
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
export const evaluateCode: (
  input: EvaluateCodeRequest,
) => Effect.Effect<
  EvaluateCodeResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const evaluateMappingTemplate: (
  input: EvaluateMappingTemplateRequest,
) => Effect.Effect<
  EvaluateMappingTemplateResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EvaluateMappingTemplateRequest,
  output: EvaluateMappingTemplateResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalFailureException,
  ],
}));
/**
 * Retrieves the record of an existing introspection. If the retrieval is successful, the
 * result of the instrospection will also be returned. If the retrieval fails the operation,
 * an error message will be returned instead.
 */
export const getDataSourceIntrospection: (
  input: GetDataSourceIntrospectionRequest,
) => Effect.Effect<
  GetDataSourceIntrospectionResponse,
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSourceIntrospectionRequest,
  output: GetDataSourceIntrospectionResponse,
  errors: [BadRequestException, InternalFailureException, NotFoundException],
}));
/**
 * Get a `Function`.
 */
export const getFunction: (
  input: GetFunctionRequest,
) => Effect.Effect<
  GetFunctionResponse,
  | ConcurrentModificationException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFunctionRequest,
  output: GetFunctionResponse,
  errors: [
    ConcurrentModificationException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the tags for a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an `Api` object. Use this operation to create an AppSync
 * API with your preferred configuration, such as an Event API that provides real-time message
 * publishing and message subscriptions over WebSockets.
 */
export const createApi: (
  input: CreateApiRequest,
) => Effect.Effect<
  CreateApiResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | ServiceQuotaExceededException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an API key.
 */
export const deleteApiKey: (
  input: DeleteApiKeyRequest,
) => Effect.Effect<
  DeleteApiKeyResponse,
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a `DataSource` object.
 */
export const deleteDataSource: (
  input: DeleteDataSourceRequest,
) => Effect.Effect<
  DeleteDataSourceResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFunction: (
  input: DeleteFunctionRequest,
) => Effect.Effect<
  DeleteFunctionResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a `Resolver` object.
 */
export const deleteResolver: (
  input: DeleteResolverRequest,
) => Effect.Effect<
  DeleteResolverResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteType: (
  input: DeleteTypeRequest,
) => Effect.Effect<
  DeleteTypeResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Flushes an `ApiCache` object.
 */
export const flushApiCache: (
  input: FlushApiCacheRequest,
) => Effect.Effect<
  FlushApiCacheResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an `Api` object
 */
export const deleteApi: (
  input: DeleteApiRequest,
) => Effect.Effect<
  DeleteApiResponse,
  | AccessDeniedException
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an association between a Merged API and source API using the source API's
 * identifier and the association ID.
 */
export const disassociateMergedGraphqlApi: (
  input: DisassociateMergedGraphqlApiRequest,
) => Effect.Effect<
  DisassociateMergedGraphqlApiResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateSourceGraphqlApi: (
  input: DisassociateSourceGraphqlApiRequest,
) => Effect.Effect<
  DisassociateSourceGraphqlApiResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves an `ApiCache` object.
 */
export const getApiCache: (
  input: GetApiCacheRequest,
) => Effect.Effect<
  GetApiCacheResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the list of environmental variable key-value pairs associated with an API by
 * its ID value.
 */
export const getGraphqlApiEnvironmentVariables: (
  input: GetGraphqlApiEnvironmentVariablesRequest,
) => Effect.Effect<
  GetGraphqlApiEnvironmentVariablesResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSchemaCreationStatus: (
  input: GetSchemaCreationStatusRequest,
) => Effect.Effect<
  GetSchemaCreationStatusResponse,
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaCreationStatusRequest,
  output: GetSchemaCreationStatusResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves a `SourceApiAssociation` object.
 */
export const getSourceApiAssociation: (
  input: GetSourceApiAssociationRequest,
) => Effect.Effect<
  GetSourceApiAssociationResponse,
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSourceApiAssociationRequest,
  output: GetSourceApiAssociationResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves a `Type` object.
 */
export const getType: (
  input: GetTypeRequest,
) => Effect.Effect<
  GetTypeResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listApiKeys: {
  (
    input: ListApiKeysRequest,
  ): Effect.Effect<
    ListApiKeysResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApiKeysRequest,
  ) => Stream.Stream<
    ListApiKeysResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApiKeysRequest,
  ) => Stream.Stream<
    ApiKey,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApiKeysRequest,
  output: ListApiKeysResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "apiKeys",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the APIs in your AppSync account.
 *
 * `ListApis` returns only the high level API details. For more detailed
 * information about an API, use `GetApi`.
 */
export const listApis: {
  (
    input: ListApisRequest,
  ): Effect.Effect<
    ListApisResponse,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApisRequest,
  ) => Stream.Stream<
    ListApisResponse,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApisRequest,
  ) => Stream.Stream<
    Api,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApisRequest,
  output: ListApisResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "apis",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the channel namespaces for a specified `Api`.
 *
 * `ListChannelNamespaces` returns only high level details for the channel
 * namespace. To retrieve code handlers, use `GetChannelNamespace`.
 */
export const listChannelNamespaces: {
  (
    input: ListChannelNamespacesRequest,
  ): Effect.Effect<
    ListChannelNamespacesResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelNamespacesRequest,
  ) => Stream.Stream<
    ListChannelNamespacesResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelNamespacesRequest,
  ) => Stream.Stream<
    ChannelNamespace,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelNamespacesRequest,
  output: ListChannelNamespacesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "channelNamespaces",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the data sources for a given API.
 */
export const listDataSources: {
  (
    input: ListDataSourcesRequest,
  ): Effect.Effect<
    ListDataSourcesResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSourcesRequest,
  ) => Stream.Stream<
    ListDataSourcesResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSourcesRequest,
  ) => Stream.Stream<
    DataSource,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataSourcesRequest,
  output: ListDataSourcesResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "dataSources",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List multiple functions.
 */
export const listFunctions: {
  (
    input: ListFunctionsRequest,
  ): Effect.Effect<
    ListFunctionsResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFunctionsRequest,
  ) => Stream.Stream<
    ListFunctionsResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFunctionsRequest,
  ) => Stream.Stream<
    FunctionConfiguration,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFunctionsRequest,
  output: ListFunctionsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "functions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists your GraphQL APIs.
 */
export const listGraphqlApis: {
  (
    input: ListGraphqlApisRequest,
  ): Effect.Effect<
    ListGraphqlApisResponse,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGraphqlApisRequest,
  ) => Stream.Stream<
    ListGraphqlApisResponse,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGraphqlApisRequest,
  ) => Stream.Stream<
    GraphqlApi,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGraphqlApisRequest,
  output: ListGraphqlApisResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "graphqlApis",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the resolvers for a given API and type.
 */
export const listResolvers: {
  (
    input: ListResolversRequest,
  ): Effect.Effect<
    ListResolversResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResolversRequest,
  ) => Stream.Stream<
    ListResolversResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResolversRequest,
  ) => Stream.Stream<
    Resolver,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResolversRequest,
  output: ListResolversResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "resolvers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List the resolvers that are associated with a specific function.
 */
export const listResolversByFunction: {
  (
    input: ListResolversByFunctionRequest,
  ): Effect.Effect<
    ListResolversByFunctionResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResolversByFunctionRequest,
  ) => Stream.Stream<
    ListResolversByFunctionResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResolversByFunctionRequest,
  ) => Stream.Stream<
    Resolver,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResolversByFunctionRequest,
  output: ListResolversByFunctionResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "resolvers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the types for a given API.
 */
export const listTypes: {
  (
    input: ListTypesRequest,
  ): Effect.Effect<
    ListTypesResponse,
    | BadRequestException
    | ConcurrentModificationException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTypesRequest,
  ) => Stream.Stream<
    ListTypesResponse,
    | BadRequestException
    | ConcurrentModificationException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTypesRequest,
  ) => Stream.Stream<
    Type,
    | BadRequestException
    | ConcurrentModificationException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTypesRequest,
  output: ListTypesResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "types",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists `Type` objects by the source API association ID.
 */
export const listTypesByAssociation: {
  (
    input: ListTypesByAssociationRequest,
  ): Effect.Effect<
    ListTypesByAssociationResponse,
    | BadRequestException
    | ConcurrentModificationException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTypesByAssociationRequest,
  ) => Stream.Stream<
    ListTypesByAssociationResponse,
    | BadRequestException
    | ConcurrentModificationException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTypesByAssociationRequest,
  ) => Stream.Stream<
    Type,
    | BadRequestException
    | ConcurrentModificationException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTypesByAssociationRequest,
  output: ListTypesByAssociationResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "types",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds a new schema to your GraphQL API.
 *
 * This operation is asynchronous. Use to
 * determine when it has completed.
 */
export const startSchemaCreation: (
  input: StartSchemaCreationRequest,
) => Effect.Effect<
  StartSchemaCreationResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startSchemaMerge: (
  input: StartSchemaMergeRequest,
) => Effect.Effect<
  StartSchemaMergeResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an `Api`.
 */
export const updateApi: (
  input: UpdateApiRequest,
) => Effect.Effect<
  UpdateApiResponse,
  | AccessDeniedException
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApiCache: (
  input: UpdateApiCacheRequest,
) => Effect.Effect<
  UpdateApiCacheResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateChannelNamespace: (
  input: UpdateChannelNamespaceRequest,
) => Effect.Effect<
  UpdateChannelNamespaceResponse,
  | AccessDeniedException
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates a `DataSource` object.
 */
export const updateDataSource: (
  input: UpdateDataSourceRequest,
) => Effect.Effect<
  UpdateDataSourceResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates a `Function` object.
 */
export const updateFunction: (
  input: UpdateFunctionRequest,
) => Effect.Effect<
  UpdateFunctionResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateGraphqlApi: (
  input: UpdateGraphqlApiRequest,
) => Effect.Effect<
  UpdateGraphqlApiResponse,
  | AccessDeniedException
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateResolver: (
  input: UpdateResolverRequest,
) => Effect.Effect<
  UpdateResolverResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSourceApiAssociation: (
  input: UpdateSourceApiAssociationRequest,
) => Effect.Effect<
  UpdateSourceApiAssociationResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSourceApiAssociationRequest,
  output: UpdateSourceApiAssociationResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a `Type` object.
 */
export const updateType: (
  input: UpdateTypeRequest,
) => Effect.Effect<
  UpdateTypeResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a `ChannelNamespace`.
 */
export const deleteChannelNamespace: (
  input: DeleteChannelNamespaceRequest,
) => Effect.Effect<
  DeleteChannelNamespaceResponse,
  | AccessDeniedException
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a `GraphqlApi` object.
 */
export const deleteGraphqlApi: (
  input: DeleteGraphqlApiRequest,
) => Effect.Effect<
  DeleteGraphqlApiResponse,
  | AccessDeniedException
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a cache for the GraphQL API.
 */
export const createApiCache: (
  input: CreateApiCacheRequest,
) => Effect.Effect<
  CreateApiCacheResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a `Resolver` object.
 *
 * A resolver converts incoming requests into a format that a data source can understand,
 * and converts the data source's responses into GraphQL.
 */
export const createResolver: (
  input: CreateResolverRequest,
) => Effect.Effect<
  CreateResolverResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createType: (
  input: CreateTypeRequest,
) => Effect.Effect<
  CreateTypeResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the channel namespace for a specified `Api`.
 */
export const getChannelNamespace: (
  input: GetChannelNamespaceRequest,
) => Effect.Effect<
  GetChannelNamespaceResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataSource: (
  input: GetDataSourceRequest,
) => Effect.Effect<
  GetDataSourceResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves a `GraphqlApi` object.
 */
export const getGraphqlApi: (
  input: GetGraphqlApiRequest,
) => Effect.Effect<
  GetGraphqlApiResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists the `SourceApiAssociationSummary` data.
 */
export const listSourceApiAssociations: {
  (
    input: ListSourceApiAssociationsRequest,
  ): Effect.Effect<
    ListSourceApiAssociationsResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSourceApiAssociationsRequest,
  ) => Stream.Stream<
    ListSourceApiAssociationsResponse,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSourceApiAssociationsRequest,
  ) => Stream.Stream<
    SourceApiAssociationSummary,
    | BadRequestException
    | InternalFailureException
    | NotFoundException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSourceApiAssociationsRequest,
  output: ListSourceApiAssociationsResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "sourceApiAssociationSummaries",
    pageSize: "maxResults",
  } as const,
}));
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
export const putGraphqlApiEnvironmentVariables: (
  input: PutGraphqlApiEnvironmentVariablesRequest,
) => Effect.Effect<
  PutGraphqlApiEnvironmentVariablesResponse,
  | AccessDeniedException
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startDataSourceIntrospection: (
  input: StartDataSourceIntrospectionRequest,
) => Effect.Effect<
  StartDataSourceIntrospectionResponse,
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a `Function` object.
 *
 * A function is a reusable entity. You can use multiple functions to compose the resolver
 * logic.
 */
export const createFunction: (
  input: CreateFunctionRequest,
) => Effect.Effect<
  CreateFunctionResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApi: (
  input: GetApiRequest,
) => Effect.Effect<
  GetApiResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataSource: (
  input: CreateDataSourceRequest,
) => Effect.Effect<
  CreateDataSourceResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the introspection schema for a GraphQL API.
 */
export const getIntrospectionSchema: (
  input: GetIntrospectionSchemaRequest,
) => Effect.Effect<
  GetIntrospectionSchemaResponse,
  | GraphQLSchemaException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIntrospectionSchemaRequest,
  output: GetIntrospectionSchemaResponse,
  errors: [
    GraphQLSchemaException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Retrieves a `Resolver` object.
 */
export const getResolver: (
  input: GetResolverRequest,
) => Effect.Effect<
  GetResolverResponse,
  | ConcurrentModificationException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResolverRequest,
  output: GetResolverResponse,
  errors: [
    ConcurrentModificationException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes an `ApiCache` object.
 */
export const deleteApiCache: (
  input: DeleteApiCacheRequest,
) => Effect.Effect<
  DeleteApiCacheResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Tags a resource with user-supplied tags.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Untags a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an association between a Merged API and source API using the source API's
 * identifier.
 */
export const associateMergedGraphqlApi: (
  input: AssociateMergedGraphqlApiRequest,
) => Effect.Effect<
  AssociateMergedGraphqlApiResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates an association between a Merged API and source API using the Merged API's
 * identifier.
 */
export const associateSourceGraphqlApi: (
  input: AssociateSourceGraphqlApiRequest,
) => Effect.Effect<
  AssociateSourceGraphqlApiResponse,
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates an API key. You can update the key as long as it's not deleted.
 */
export const updateApiKey: (
  input: UpdateApiKeyRequest,
) => Effect.Effect<
  UpdateApiKeyResponse,
  | ApiKeyValidityOutOfBoundsException
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApiKey: (
  input: CreateApiKeyRequest,
) => Effect.Effect<
  CreateApiKeyResponse,
  | ApiKeyLimitExceededException
  | ApiKeyValidityOutOfBoundsException
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a `GraphqlApi` object.
 */
export const createGraphqlApi: (
  input: CreateGraphqlApiRequest,
) => Effect.Effect<
  CreateGraphqlApiResponse,
  | ApiLimitExceededException
  | BadRequestException
  | ConcurrentModificationException
  | InternalFailureException
  | LimitExceededException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a `ChannelNamespace` for an `Api`.
 */
export const createChannelNamespace: (
  input: CreateChannelNamespaceRequest,
) => Effect.Effect<
  CreateChannelNamespaceResponse,
  | BadRequestException
  | ConcurrentModificationException
  | ConflictException
  | InternalFailureException
  | NotFoundException
  | ServiceQuotaExceededException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
