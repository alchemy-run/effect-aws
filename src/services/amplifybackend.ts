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
  sdkId: "AmplifyBackend",
  serviceShapeName: "AmplifyBackend",
});
const auth = T.AwsAuthSigv4({ name: "amplifybackend" });
const ver = T.ServiceVersion("2020-08-11");
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
                        url: "https://amplifybackend-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://amplifybackend-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://amplifybackend.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://amplifybackend.{Region}.{PartitionResult#dnsSuffix}",
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
export type __string = string;
export type __integerMin1Max25 = number;
export type __double = number;

//# Schemas
export interface ResourceConfig {}
export const ResourceConfig = S.suspend(() => S.Struct({})).annotations({
  identifier: "ResourceConfig",
}) as any as S.Schema<ResourceConfig>;
export interface CloneBackendRequest {
  AppId: string;
  BackendEnvironmentName: string;
  TargetEnvironmentName: string;
}
export const CloneBackendRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    TargetEnvironmentName: S.String.pipe(T.JsonName("targetEnvironmentName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/environments/{BackendEnvironmentName}/clone",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CloneBackendRequest",
}) as any as S.Schema<CloneBackendRequest>;
export interface CreateBackendRequest {
  AppId: string;
  AppName: string;
  BackendEnvironmentName: string;
  ResourceConfig?: ResourceConfig;
  ResourceName?: string;
}
export const CreateBackendRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.JsonName("appId")),
    AppName: S.String.pipe(T.JsonName("appName")),
    BackendEnvironmentName: S.String.pipe(T.JsonName("backendEnvironmentName")),
    ResourceConfig: S.optional(ResourceConfig)
      .pipe(T.JsonName("resourceConfig"))
      .annotations({ identifier: "ResourceConfig" }),
    ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/backend" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBackendRequest",
}) as any as S.Schema<CreateBackendRequest>;
export interface CreateBackendConfigRequest {
  AppId: string;
  BackendManagerAppId?: string;
}
export const CreateBackendConfigRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendManagerAppId: S.optional(S.String).pipe(
      T.JsonName("backendManagerAppId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/backend/{AppId}/config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBackendConfigRequest",
}) as any as S.Schema<CreateBackendConfigRequest>;
export interface CreateTokenRequest {
  AppId: string;
}
export const CreateTokenRequest = S.suspend(() =>
  S.Struct({ AppId: S.String.pipe(T.HttpLabel("AppId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/backend/{AppId}/challenge" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTokenRequest",
}) as any as S.Schema<CreateTokenRequest>;
export interface DeleteBackendRequest {
  AppId: string;
  BackendEnvironmentName: string;
}
export const DeleteBackendRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/environments/{BackendEnvironmentName}/remove",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBackendRequest",
}) as any as S.Schema<DeleteBackendRequest>;
export interface BackendAPIAppSyncAuthSettings {
  CognitoUserPoolId?: string;
  Description?: string;
  ExpirationTime?: number;
  OpenIDAuthTTL?: string;
  OpenIDClientId?: string;
  OpenIDIatTTL?: string;
  OpenIDIssueURL?: string;
  OpenIDProviderName?: string;
}
export const BackendAPIAppSyncAuthSettings = S.suspend(() =>
  S.Struct({
    CognitoUserPoolId: S.optional(S.String).pipe(
      T.JsonName("cognitoUserPoolId"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    ExpirationTime: S.optional(S.Number).pipe(T.JsonName("expirationTime")),
    OpenIDAuthTTL: S.optional(S.String).pipe(T.JsonName("openIDAuthTTL")),
    OpenIDClientId: S.optional(S.String).pipe(T.JsonName("openIDClientId")),
    OpenIDIatTTL: S.optional(S.String).pipe(T.JsonName("openIDIatTTL")),
    OpenIDIssueURL: S.optional(S.String).pipe(T.JsonName("openIDIssueURL")),
    OpenIDProviderName: S.optional(S.String).pipe(
      T.JsonName("openIDProviderName"),
    ),
  }),
).annotations({
  identifier: "BackendAPIAppSyncAuthSettings",
}) as any as S.Schema<BackendAPIAppSyncAuthSettings>;
export interface BackendAPIAuthType {
  Mode?: string;
  Settings?: BackendAPIAppSyncAuthSettings;
}
export const BackendAPIAuthType = S.suspend(() =>
  S.Struct({
    Mode: S.optional(S.String).pipe(T.JsonName("mode")),
    Settings: S.optional(BackendAPIAppSyncAuthSettings)
      .pipe(T.JsonName("settings"))
      .annotations({ identifier: "BackendAPIAppSyncAuthSettings" }),
  }),
).annotations({
  identifier: "BackendAPIAuthType",
}) as any as S.Schema<BackendAPIAuthType>;
export type ListOfBackendAPIAuthType = BackendAPIAuthType[];
export const ListOfBackendAPIAuthType = S.Array(BackendAPIAuthType);
export interface BackendAPIConflictResolution {
  ResolutionStrategy?: string;
}
export const BackendAPIConflictResolution = S.suspend(() =>
  S.Struct({
    ResolutionStrategy: S.optional(S.String).pipe(
      T.JsonName("resolutionStrategy"),
    ),
  }),
).annotations({
  identifier: "BackendAPIConflictResolution",
}) as any as S.Schema<BackendAPIConflictResolution>;
export interface BackendAPIResourceConfig {
  AdditionalAuthTypes?: ListOfBackendAPIAuthType;
  ApiName?: string;
  ConflictResolution?: BackendAPIConflictResolution;
  DefaultAuthType?: BackendAPIAuthType;
  Service?: string;
  TransformSchema?: string;
}
export const BackendAPIResourceConfig = S.suspend(() =>
  S.Struct({
    AdditionalAuthTypes: S.optional(ListOfBackendAPIAuthType).pipe(
      T.JsonName("additionalAuthTypes"),
    ),
    ApiName: S.optional(S.String).pipe(T.JsonName("apiName")),
    ConflictResolution: S.optional(BackendAPIConflictResolution)
      .pipe(T.JsonName("conflictResolution"))
      .annotations({ identifier: "BackendAPIConflictResolution" }),
    DefaultAuthType: S.optional(BackendAPIAuthType)
      .pipe(T.JsonName("defaultAuthType"))
      .annotations({ identifier: "BackendAPIAuthType" }),
    Service: S.optional(S.String).pipe(T.JsonName("service")),
    TransformSchema: S.optional(S.String).pipe(T.JsonName("transformSchema")),
  }),
).annotations({
  identifier: "BackendAPIResourceConfig",
}) as any as S.Schema<BackendAPIResourceConfig>;
export interface DeleteBackendAPIRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceConfig?: BackendAPIResourceConfig;
  ResourceName: string;
}
export const DeleteBackendAPIRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    ResourceConfig: S.optional(BackendAPIResourceConfig)
      .pipe(T.JsonName("resourceConfig"))
      .annotations({ identifier: "BackendAPIResourceConfig" }),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/api/{BackendEnvironmentName}/remove",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBackendAPIRequest",
}) as any as S.Schema<DeleteBackendAPIRequest>;
export interface DeleteBackendAuthRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceName: string;
}
export const DeleteBackendAuthRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/auth/{BackendEnvironmentName}/remove",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBackendAuthRequest",
}) as any as S.Schema<DeleteBackendAuthRequest>;
export interface DeleteBackendStorageRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceName: string;
  ServiceName: string;
}
export const DeleteBackendStorageRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
    ServiceName: S.String.pipe(T.JsonName("serviceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/storage/{BackendEnvironmentName}/remove",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBackendStorageRequest",
}) as any as S.Schema<DeleteBackendStorageRequest>;
export interface DeleteTokenRequest {
  AppId: string;
  SessionId: string;
}
export const DeleteTokenRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    SessionId: S.String.pipe(T.HttpLabel("SessionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/challenge/{SessionId}/remove",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTokenRequest",
}) as any as S.Schema<DeleteTokenRequest>;
export interface GenerateBackendAPIModelsRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceName: string;
}
export const GenerateBackendAPIModelsRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/api/{BackendEnvironmentName}/generateModels",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateBackendAPIModelsRequest",
}) as any as S.Schema<GenerateBackendAPIModelsRequest>;
export interface GetBackendRequest {
  AppId: string;
  BackendEnvironmentName?: string;
}
export const GetBackendRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/backend/{AppId}/details" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBackendRequest",
}) as any as S.Schema<GetBackendRequest>;
export interface GetBackendAPIRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceConfig?: BackendAPIResourceConfig;
  ResourceName: string;
}
export const GetBackendAPIRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    ResourceConfig: S.optional(BackendAPIResourceConfig)
      .pipe(T.JsonName("resourceConfig"))
      .annotations({ identifier: "BackendAPIResourceConfig" }),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/api/{BackendEnvironmentName}/details",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBackendAPIRequest",
}) as any as S.Schema<GetBackendAPIRequest>;
export interface GetBackendAPIModelsRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceName: string;
}
export const GetBackendAPIModelsRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/api/{BackendEnvironmentName}/getModels",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBackendAPIModelsRequest",
}) as any as S.Schema<GetBackendAPIModelsRequest>;
export interface GetBackendAuthRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceName: string;
}
export const GetBackendAuthRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/auth/{BackendEnvironmentName}/details",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBackendAuthRequest",
}) as any as S.Schema<GetBackendAuthRequest>;
export interface GetBackendJobRequest {
  AppId: string;
  BackendEnvironmentName: string;
  JobId: string;
}
export const GetBackendJobRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/backend/{AppId}/job/{BackendEnvironmentName}/{JobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBackendJobRequest",
}) as any as S.Schema<GetBackendJobRequest>;
export interface GetBackendStorageRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceName: string;
}
export const GetBackendStorageRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/storage/{BackendEnvironmentName}/details",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBackendStorageRequest",
}) as any as S.Schema<GetBackendStorageRequest>;
export interface GetTokenRequest {
  AppId: string;
  SessionId: string;
}
export const GetTokenRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    SessionId: S.String.pipe(T.HttpLabel("SessionId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/backend/{AppId}/challenge/{SessionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTokenRequest",
}) as any as S.Schema<GetTokenRequest>;
export interface ImportBackendAuthRequest {
  AppId: string;
  BackendEnvironmentName: string;
  IdentityPoolId?: string;
  NativeClientId: string;
  UserPoolId: string;
  WebClientId: string;
}
export const ImportBackendAuthRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    IdentityPoolId: S.optional(S.String).pipe(T.JsonName("identityPoolId")),
    NativeClientId: S.String.pipe(T.JsonName("nativeClientId")),
    UserPoolId: S.String.pipe(T.JsonName("userPoolId")),
    WebClientId: S.String.pipe(T.JsonName("webClientId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/auth/{BackendEnvironmentName}/import",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportBackendAuthRequest",
}) as any as S.Schema<ImportBackendAuthRequest>;
export interface ImportBackendStorageRequest {
  AppId: string;
  BackendEnvironmentName: string;
  BucketName?: string;
  ServiceName: string;
}
export const ImportBackendStorageRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    BucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
    ServiceName: S.String.pipe(T.JsonName("serviceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/storage/{BackendEnvironmentName}/import",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportBackendStorageRequest",
}) as any as S.Schema<ImportBackendStorageRequest>;
export interface ListBackendJobsRequest {
  AppId: string;
  BackendEnvironmentName: string;
  JobId?: string;
  MaxResults?: number;
  NextToken?: string;
  Operation?: string;
  Status?: string;
}
export const ListBackendJobsRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/job/{BackendEnvironmentName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBackendJobsRequest",
}) as any as S.Schema<ListBackendJobsRequest>;
export interface ListS3BucketsRequest {
  NextToken?: string;
}
export const ListS3BucketsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/s3Buckets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListS3BucketsRequest",
}) as any as S.Schema<ListS3BucketsRequest>;
export interface RemoveAllBackendsRequest {
  AppId: string;
  CleanAmplifyApp?: boolean;
}
export const RemoveAllBackendsRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    CleanAmplifyApp: S.optional(S.Boolean).pipe(T.JsonName("cleanAmplifyApp")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/backend/{AppId}/remove" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveAllBackendsRequest",
}) as any as S.Schema<RemoveAllBackendsRequest>;
export interface RemoveBackendConfigRequest {
  AppId: string;
}
export const RemoveBackendConfigRequest = S.suspend(() =>
  S.Struct({ AppId: S.String.pipe(T.HttpLabel("AppId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/backend/{AppId}/config/remove" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveBackendConfigRequest",
}) as any as S.Schema<RemoveBackendConfigRequest>;
export interface UpdateBackendAPIRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceConfig?: BackendAPIResourceConfig;
  ResourceName: string;
}
export const UpdateBackendAPIRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    ResourceConfig: S.optional(BackendAPIResourceConfig)
      .pipe(T.JsonName("resourceConfig"))
      .annotations({ identifier: "BackendAPIResourceConfig" }),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/api/{BackendEnvironmentName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBackendAPIRequest",
}) as any as S.Schema<UpdateBackendAPIRequest>;
export interface UpdateBackendJobRequest {
  AppId: string;
  BackendEnvironmentName: string;
  JobId: string;
  Operation?: string;
  Status?: string;
}
export const UpdateBackendJobRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/job/{BackendEnvironmentName}/{JobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBackendJobRequest",
}) as any as S.Schema<UpdateBackendJobRequest>;
export type ListOf__string = string[];
export const ListOf__string = S.Array(S.String);
export interface LoginAuthConfigReqObj {
  AwsCognitoIdentityPoolId?: string;
  AwsCognitoRegion?: string;
  AwsUserPoolsId?: string;
  AwsUserPoolsWebClientId?: string;
}
export const LoginAuthConfigReqObj = S.suspend(() =>
  S.Struct({
    AwsCognitoIdentityPoolId: S.optional(S.String).pipe(
      T.JsonName("aws_cognito_identity_pool_id"),
    ),
    AwsCognitoRegion: S.optional(S.String).pipe(
      T.JsonName("aws_cognito_region"),
    ),
    AwsUserPoolsId: S.optional(S.String).pipe(T.JsonName("aws_user_pools_id")),
    AwsUserPoolsWebClientId: S.optional(S.String).pipe(
      T.JsonName("aws_user_pools_web_client_id"),
    ),
  }),
).annotations({
  identifier: "LoginAuthConfigReqObj",
}) as any as S.Schema<LoginAuthConfigReqObj>;
export type ListOfAuthenticatedElement = string[];
export const ListOfAuthenticatedElement = S.Array(S.String);
export type ListOfUnAuthenticatedElement = string[];
export const ListOfUnAuthenticatedElement = S.Array(S.String);
export interface BackendStoragePermissions {
  Authenticated: ListOfAuthenticatedElement;
  UnAuthenticated?: ListOfUnAuthenticatedElement;
}
export const BackendStoragePermissions = S.suspend(() =>
  S.Struct({
    Authenticated: ListOfAuthenticatedElement.pipe(T.JsonName("authenticated")),
    UnAuthenticated: S.optional(ListOfUnAuthenticatedElement).pipe(
      T.JsonName("unAuthenticated"),
    ),
  }),
).annotations({
  identifier: "BackendStoragePermissions",
}) as any as S.Schema<BackendStoragePermissions>;
export interface UpdateBackendStorageResourceConfig {
  Permissions: BackendStoragePermissions;
  ServiceName: string;
}
export const UpdateBackendStorageResourceConfig = S.suspend(() =>
  S.Struct({
    Permissions: BackendStoragePermissions.pipe(
      T.JsonName("permissions"),
    ).annotations({ identifier: "BackendStoragePermissions" }),
    ServiceName: S.String.pipe(T.JsonName("serviceName")),
  }),
).annotations({
  identifier: "UpdateBackendStorageResourceConfig",
}) as any as S.Schema<UpdateBackendStorageResourceConfig>;
export type ListOfRequiredSignUpAttributesElement = string[];
export const ListOfRequiredSignUpAttributesElement = S.Array(S.String);
export interface CloneBackendResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const CloneBackendResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "CloneBackendResponse",
}) as any as S.Schema<CloneBackendResponse>;
export interface CreateBackendResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const CreateBackendResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "CreateBackendResponse",
}) as any as S.Schema<CreateBackendResponse>;
export interface CreateBackendConfigResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  JobId?: string;
  Status?: string;
}
export const CreateBackendConfigResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "CreateBackendConfigResponse",
}) as any as S.Schema<CreateBackendConfigResponse>;
export interface CreateTokenResponse {
  AppId?: string;
  ChallengeCode?: string;
  SessionId?: string;
  Ttl?: string;
}
export const CreateTokenResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    ChallengeCode: S.optional(S.String).pipe(T.JsonName("challengeCode")),
    SessionId: S.optional(S.String).pipe(T.JsonName("sessionId")),
    Ttl: S.optional(S.String).pipe(T.JsonName("ttl")),
  }),
).annotations({
  identifier: "CreateTokenResponse",
}) as any as S.Schema<CreateTokenResponse>;
export interface DeleteBackendResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const DeleteBackendResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "DeleteBackendResponse",
}) as any as S.Schema<DeleteBackendResponse>;
export interface DeleteBackendAPIResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const DeleteBackendAPIResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "DeleteBackendAPIResponse",
}) as any as S.Schema<DeleteBackendAPIResponse>;
export interface DeleteBackendAuthResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const DeleteBackendAuthResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "DeleteBackendAuthResponse",
}) as any as S.Schema<DeleteBackendAuthResponse>;
export interface DeleteBackendStorageResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  JobId?: string;
  Status?: string;
}
export const DeleteBackendStorageResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "DeleteBackendStorageResponse",
}) as any as S.Schema<DeleteBackendStorageResponse>;
export interface DeleteTokenResponse {
  IsSuccess?: boolean;
}
export const DeleteTokenResponse = S.suspend(() =>
  S.Struct({ IsSuccess: S.optional(S.Boolean).pipe(T.JsonName("isSuccess")) }),
).annotations({
  identifier: "DeleteTokenResponse",
}) as any as S.Schema<DeleteTokenResponse>;
export interface GenerateBackendAPIModelsResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const GenerateBackendAPIModelsResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "GenerateBackendAPIModelsResponse",
}) as any as S.Schema<GenerateBackendAPIModelsResponse>;
export interface GetBackendResponse {
  AmplifyFeatureFlags?: string;
  AmplifyMetaConfig?: string;
  AppId?: string;
  AppName?: string;
  BackendEnvironmentList?: ListOf__string;
  BackendEnvironmentName?: string;
  Error?: string;
}
export const GetBackendResponse = S.suspend(() =>
  S.Struct({
    AmplifyFeatureFlags: S.optional(S.String).pipe(
      T.JsonName("amplifyFeatureFlags"),
    ),
    AmplifyMetaConfig: S.optional(S.String).pipe(
      T.JsonName("amplifyMetaConfig"),
    ),
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    AppName: S.optional(S.String).pipe(T.JsonName("appName")),
    BackendEnvironmentList: S.optional(ListOf__string).pipe(
      T.JsonName("backendEnvironmentList"),
    ),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
  }),
).annotations({
  identifier: "GetBackendResponse",
}) as any as S.Schema<GetBackendResponse>;
export interface GetBackendAPIResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  ResourceConfig?: BackendAPIResourceConfig;
  ResourceName?: string;
}
export const GetBackendAPIResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    ResourceConfig: S.optional(BackendAPIResourceConfig)
      .pipe(T.JsonName("resourceConfig"))
      .annotations({ identifier: "BackendAPIResourceConfig" }),
    ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
  }),
).annotations({
  identifier: "GetBackendAPIResponse",
}) as any as S.Schema<GetBackendAPIResponse>;
export interface GetBackendAPIModelsResponse {
  Models?: string;
  Status?: string;
  ModelIntrospectionSchema?: string;
}
export const GetBackendAPIModelsResponse = S.suspend(() =>
  S.Struct({
    Models: S.optional(S.String).pipe(T.JsonName("models")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    ModelIntrospectionSchema: S.optional(S.String).pipe(
      T.JsonName("modelIntrospectionSchema"),
    ),
  }),
).annotations({
  identifier: "GetBackendAPIModelsResponse",
}) as any as S.Schema<GetBackendAPIModelsResponse>;
export interface CreateBackendAuthIdentityPoolConfig {
  IdentityPoolName: string;
  UnauthenticatedLogin: boolean;
}
export const CreateBackendAuthIdentityPoolConfig = S.suspend(() =>
  S.Struct({
    IdentityPoolName: S.String.pipe(T.JsonName("identityPoolName")),
    UnauthenticatedLogin: S.Boolean.pipe(T.JsonName("unauthenticatedLogin")),
  }),
).annotations({
  identifier: "CreateBackendAuthIdentityPoolConfig",
}) as any as S.Schema<CreateBackendAuthIdentityPoolConfig>;
export interface EmailSettings {
  EmailMessage?: string;
  EmailSubject?: string;
}
export const EmailSettings = S.suspend(() =>
  S.Struct({
    EmailMessage: S.optional(S.String).pipe(T.JsonName("emailMessage")),
    EmailSubject: S.optional(S.String).pipe(T.JsonName("emailSubject")),
  }),
).annotations({
  identifier: "EmailSettings",
}) as any as S.Schema<EmailSettings>;
export interface SmsSettings {
  SmsMessage?: string;
}
export const SmsSettings = S.suspend(() =>
  S.Struct({ SmsMessage: S.optional(S.String).pipe(T.JsonName("smsMessage")) }),
).annotations({ identifier: "SmsSettings" }) as any as S.Schema<SmsSettings>;
export interface CreateBackendAuthForgotPasswordConfig {
  DeliveryMethod: string;
  EmailSettings?: EmailSettings;
  SmsSettings?: SmsSettings;
}
export const CreateBackendAuthForgotPasswordConfig = S.suspend(() =>
  S.Struct({
    DeliveryMethod: S.String.pipe(T.JsonName("deliveryMethod")),
    EmailSettings: S.optional(EmailSettings)
      .pipe(T.JsonName("emailSettings"))
      .annotations({ identifier: "EmailSettings" }),
    SmsSettings: S.optional(SmsSettings)
      .pipe(T.JsonName("smsSettings"))
      .annotations({ identifier: "SmsSettings" }),
  }),
).annotations({
  identifier: "CreateBackendAuthForgotPasswordConfig",
}) as any as S.Schema<CreateBackendAuthForgotPasswordConfig>;
export type ListOfMfaTypesElement = string[];
export const ListOfMfaTypesElement = S.Array(S.String);
export interface Settings {
  MfaTypes?: ListOfMfaTypesElement;
  SmsMessage?: string;
}
export const Settings = S.suspend(() =>
  S.Struct({
    MfaTypes: S.optional(ListOfMfaTypesElement).pipe(T.JsonName("mfaTypes")),
    SmsMessage: S.optional(S.String).pipe(T.JsonName("smsMessage")),
  }),
).annotations({ identifier: "Settings" }) as any as S.Schema<Settings>;
export interface CreateBackendAuthMFAConfig {
  MFAMode: string;
  Settings?: Settings;
}
export const CreateBackendAuthMFAConfig = S.suspend(() =>
  S.Struct({
    MFAMode: S.String,
    Settings: S.optional(Settings)
      .pipe(T.JsonName("settings"))
      .annotations({ identifier: "Settings" }),
  }),
).annotations({
  identifier: "CreateBackendAuthMFAConfig",
}) as any as S.Schema<CreateBackendAuthMFAConfig>;
export type ListOfOAuthScopesElement = string[];
export const ListOfOAuthScopesElement = S.Array(S.String);
export interface BackendAuthSocialProviderConfig {
  ClientId?: string;
  ClientSecret?: string;
}
export const BackendAuthSocialProviderConfig = S.suspend(() =>
  S.Struct({
    ClientId: S.optional(S.String).pipe(T.JsonName("client_id")),
    ClientSecret: S.optional(S.String).pipe(T.JsonName("client_secret")),
  }),
).annotations({
  identifier: "BackendAuthSocialProviderConfig",
}) as any as S.Schema<BackendAuthSocialProviderConfig>;
export interface BackendAuthAppleProviderConfig {
  ClientId?: string;
  KeyId?: string;
  PrivateKey?: string;
  TeamId?: string;
}
export const BackendAuthAppleProviderConfig = S.suspend(() =>
  S.Struct({
    ClientId: S.optional(S.String).pipe(T.JsonName("client_id")),
    KeyId: S.optional(S.String).pipe(T.JsonName("key_id")),
    PrivateKey: S.optional(S.String).pipe(T.JsonName("private_key")),
    TeamId: S.optional(S.String).pipe(T.JsonName("team_id")),
  }),
).annotations({
  identifier: "BackendAuthAppleProviderConfig",
}) as any as S.Schema<BackendAuthAppleProviderConfig>;
export interface SocialProviderSettings {
  Facebook?: BackendAuthSocialProviderConfig;
  Google?: BackendAuthSocialProviderConfig;
  LoginWithAmazon?: BackendAuthSocialProviderConfig;
  SignInWithApple?: BackendAuthAppleProviderConfig;
}
export const SocialProviderSettings = S.suspend(() =>
  S.Struct({
    Facebook: S.optional(BackendAuthSocialProviderConfig),
    Google: S.optional(BackendAuthSocialProviderConfig),
    LoginWithAmazon: S.optional(BackendAuthSocialProviderConfig),
    SignInWithApple: S.optional(BackendAuthAppleProviderConfig),
  }),
).annotations({
  identifier: "SocialProviderSettings",
}) as any as S.Schema<SocialProviderSettings>;
export interface CreateBackendAuthOAuthConfig {
  DomainPrefix?: string;
  OAuthGrantType: string;
  OAuthScopes: ListOfOAuthScopesElement;
  RedirectSignInURIs: ListOf__string;
  RedirectSignOutURIs: ListOf__string;
  SocialProviderSettings?: SocialProviderSettings;
}
export const CreateBackendAuthOAuthConfig = S.suspend(() =>
  S.Struct({
    DomainPrefix: S.optional(S.String).pipe(T.JsonName("domainPrefix")),
    OAuthGrantType: S.String.pipe(T.JsonName("oAuthGrantType")),
    OAuthScopes: ListOfOAuthScopesElement.pipe(T.JsonName("oAuthScopes")),
    RedirectSignInURIs: ListOf__string.pipe(T.JsonName("redirectSignInURIs")),
    RedirectSignOutURIs: ListOf__string.pipe(T.JsonName("redirectSignOutURIs")),
    SocialProviderSettings: S.optional(SocialProviderSettings)
      .pipe(T.JsonName("socialProviderSettings"))
      .annotations({ identifier: "SocialProviderSettings" }),
  }),
).annotations({
  identifier: "CreateBackendAuthOAuthConfig",
}) as any as S.Schema<CreateBackendAuthOAuthConfig>;
export type ListOfAdditionalConstraintsElement = string[];
export const ListOfAdditionalConstraintsElement = S.Array(S.String);
export interface CreateBackendAuthPasswordPolicyConfig {
  AdditionalConstraints?: ListOfAdditionalConstraintsElement;
  MinimumLength: number;
}
export const CreateBackendAuthPasswordPolicyConfig = S.suspend(() =>
  S.Struct({
    AdditionalConstraints: S.optional(ListOfAdditionalConstraintsElement).pipe(
      T.JsonName("additionalConstraints"),
    ),
    MinimumLength: S.Number.pipe(T.JsonName("minimumLength")),
  }),
).annotations({
  identifier: "CreateBackendAuthPasswordPolicyConfig",
}) as any as S.Schema<CreateBackendAuthPasswordPolicyConfig>;
export interface CreateBackendAuthVerificationMessageConfig {
  DeliveryMethod: string;
  EmailSettings?: EmailSettings;
  SmsSettings?: SmsSettings;
}
export const CreateBackendAuthVerificationMessageConfig = S.suspend(() =>
  S.Struct({
    DeliveryMethod: S.String.pipe(T.JsonName("deliveryMethod")),
    EmailSettings: S.optional(EmailSettings)
      .pipe(T.JsonName("emailSettings"))
      .annotations({ identifier: "EmailSettings" }),
    SmsSettings: S.optional(SmsSettings)
      .pipe(T.JsonName("smsSettings"))
      .annotations({ identifier: "SmsSettings" }),
  }),
).annotations({
  identifier: "CreateBackendAuthVerificationMessageConfig",
}) as any as S.Schema<CreateBackendAuthVerificationMessageConfig>;
export interface CreateBackendAuthUserPoolConfig {
  ForgotPassword?: CreateBackendAuthForgotPasswordConfig;
  Mfa?: CreateBackendAuthMFAConfig;
  OAuth?: CreateBackendAuthOAuthConfig;
  PasswordPolicy?: CreateBackendAuthPasswordPolicyConfig;
  RequiredSignUpAttributes: ListOfRequiredSignUpAttributesElement;
  SignInMethod: string;
  UserPoolName: string;
  VerificationMessage?: CreateBackendAuthVerificationMessageConfig;
}
export const CreateBackendAuthUserPoolConfig = S.suspend(() =>
  S.Struct({
    ForgotPassword: S.optional(CreateBackendAuthForgotPasswordConfig)
      .pipe(T.JsonName("forgotPassword"))
      .annotations({ identifier: "CreateBackendAuthForgotPasswordConfig" }),
    Mfa: S.optional(CreateBackendAuthMFAConfig)
      .pipe(T.JsonName("mfa"))
      .annotations({ identifier: "CreateBackendAuthMFAConfig" }),
    OAuth: S.optional(CreateBackendAuthOAuthConfig)
      .pipe(T.JsonName("oAuth"))
      .annotations({ identifier: "CreateBackendAuthOAuthConfig" }),
    PasswordPolicy: S.optional(CreateBackendAuthPasswordPolicyConfig)
      .pipe(T.JsonName("passwordPolicy"))
      .annotations({ identifier: "CreateBackendAuthPasswordPolicyConfig" }),
    RequiredSignUpAttributes: ListOfRequiredSignUpAttributesElement.pipe(
      T.JsonName("requiredSignUpAttributes"),
    ),
    SignInMethod: S.String.pipe(T.JsonName("signInMethod")),
    UserPoolName: S.String.pipe(T.JsonName("userPoolName")),
    VerificationMessage: S.optional(CreateBackendAuthVerificationMessageConfig)
      .pipe(T.JsonName("verificationMessage"))
      .annotations({
        identifier: "CreateBackendAuthVerificationMessageConfig",
      }),
  }),
).annotations({
  identifier: "CreateBackendAuthUserPoolConfig",
}) as any as S.Schema<CreateBackendAuthUserPoolConfig>;
export interface CreateBackendAuthResourceConfig {
  AuthResources: string;
  IdentityPoolConfigs?: CreateBackendAuthIdentityPoolConfig;
  Service: string;
  UserPoolConfigs: CreateBackendAuthUserPoolConfig;
}
export const CreateBackendAuthResourceConfig = S.suspend(() =>
  S.Struct({
    AuthResources: S.String.pipe(T.JsonName("authResources")),
    IdentityPoolConfigs: S.optional(CreateBackendAuthIdentityPoolConfig)
      .pipe(T.JsonName("identityPoolConfigs"))
      .annotations({ identifier: "CreateBackendAuthIdentityPoolConfig" }),
    Service: S.String.pipe(T.JsonName("service")),
    UserPoolConfigs: CreateBackendAuthUserPoolConfig.pipe(
      T.JsonName("userPoolConfigs"),
    ).annotations({ identifier: "CreateBackendAuthUserPoolConfig" }),
  }),
).annotations({
  identifier: "CreateBackendAuthResourceConfig",
}) as any as S.Schema<CreateBackendAuthResourceConfig>;
export interface GetBackendAuthResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  ResourceConfig?: CreateBackendAuthResourceConfig;
  ResourceName?: string;
}
export const GetBackendAuthResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    ResourceConfig: S.optional(CreateBackendAuthResourceConfig)
      .pipe(T.JsonName("resourceConfig"))
      .annotations({ identifier: "CreateBackendAuthResourceConfig" }),
    ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
  }),
).annotations({
  identifier: "GetBackendAuthResponse",
}) as any as S.Schema<GetBackendAuthResponse>;
export interface GetBackendJobResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  CreateTime?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
  UpdateTime?: string;
}
export const GetBackendJobResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    CreateTime: S.optional(S.String).pipe(T.JsonName("createTime")),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    UpdateTime: S.optional(S.String).pipe(T.JsonName("updateTime")),
  }),
).annotations({
  identifier: "GetBackendJobResponse",
}) as any as S.Schema<GetBackendJobResponse>;
export interface GetTokenResponse {
  AppId?: string;
  ChallengeCode?: string;
  SessionId?: string;
  Ttl?: string;
}
export const GetTokenResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    ChallengeCode: S.optional(S.String).pipe(T.JsonName("challengeCode")),
    SessionId: S.optional(S.String).pipe(T.JsonName("sessionId")),
    Ttl: S.optional(S.String).pipe(T.JsonName("ttl")),
  }),
).annotations({
  identifier: "GetTokenResponse",
}) as any as S.Schema<GetTokenResponse>;
export interface ImportBackendAuthResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const ImportBackendAuthResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "ImportBackendAuthResponse",
}) as any as S.Schema<ImportBackendAuthResponse>;
export interface ImportBackendStorageResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  JobId?: string;
  Status?: string;
}
export const ImportBackendStorageResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "ImportBackendStorageResponse",
}) as any as S.Schema<ImportBackendStorageResponse>;
export interface RemoveAllBackendsResponse {
  AppId?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const RemoveAllBackendsResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "RemoveAllBackendsResponse",
}) as any as S.Schema<RemoveAllBackendsResponse>;
export interface RemoveBackendConfigResponse {
  Error?: string;
}
export const RemoveBackendConfigResponse = S.suspend(() =>
  S.Struct({ Error: S.optional(S.String).pipe(T.JsonName("error")) }),
).annotations({
  identifier: "RemoveBackendConfigResponse",
}) as any as S.Schema<RemoveBackendConfigResponse>;
export interface UpdateBackendAPIResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const UpdateBackendAPIResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "UpdateBackendAPIResponse",
}) as any as S.Schema<UpdateBackendAPIResponse>;
export interface UpdateBackendConfigRequest {
  AppId: string;
  LoginAuthConfig?: LoginAuthConfigReqObj;
}
export const UpdateBackendConfigRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    LoginAuthConfig: S.optional(LoginAuthConfigReqObj)
      .pipe(T.JsonName("loginAuthConfig"))
      .annotations({ identifier: "LoginAuthConfigReqObj" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/backend/{AppId}/config/update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBackendConfigRequest",
}) as any as S.Schema<UpdateBackendConfigRequest>;
export interface UpdateBackendJobResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  CreateTime?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
  UpdateTime?: string;
}
export const UpdateBackendJobResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    CreateTime: S.optional(S.String).pipe(T.JsonName("createTime")),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    UpdateTime: S.optional(S.String).pipe(T.JsonName("updateTime")),
  }),
).annotations({
  identifier: "UpdateBackendJobResponse",
}) as any as S.Schema<UpdateBackendJobResponse>;
export interface UpdateBackendStorageRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceConfig: UpdateBackendStorageResourceConfig;
  ResourceName: string;
}
export const UpdateBackendStorageRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    ResourceConfig: UpdateBackendStorageResourceConfig.pipe(
      T.JsonName("resourceConfig"),
    ).annotations({ identifier: "UpdateBackendStorageResourceConfig" }),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/storage/{BackendEnvironmentName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBackendStorageRequest",
}) as any as S.Schema<UpdateBackendStorageRequest>;
export interface UpdateBackendAuthIdentityPoolConfig {
  UnauthenticatedLogin?: boolean;
}
export const UpdateBackendAuthIdentityPoolConfig = S.suspend(() =>
  S.Struct({
    UnauthenticatedLogin: S.optional(S.Boolean).pipe(
      T.JsonName("unauthenticatedLogin"),
    ),
  }),
).annotations({
  identifier: "UpdateBackendAuthIdentityPoolConfig",
}) as any as S.Schema<UpdateBackendAuthIdentityPoolConfig>;
export interface CreateBackendStorageResourceConfig {
  BucketName?: string;
  Permissions: BackendStoragePermissions;
  ServiceName: string;
}
export const CreateBackendStorageResourceConfig = S.suspend(() =>
  S.Struct({
    BucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
    Permissions: BackendStoragePermissions.pipe(
      T.JsonName("permissions"),
    ).annotations({ identifier: "BackendStoragePermissions" }),
    ServiceName: S.String.pipe(T.JsonName("serviceName")),
  }),
).annotations({
  identifier: "CreateBackendStorageResourceConfig",
}) as any as S.Schema<CreateBackendStorageResourceConfig>;
export interface GetBackendStorageResourceConfig {
  BucketName?: string;
  Imported: boolean;
  Permissions?: BackendStoragePermissions;
  ServiceName: string;
}
export const GetBackendStorageResourceConfig = S.suspend(() =>
  S.Struct({
    BucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
    Imported: S.Boolean.pipe(T.JsonName("imported")),
    Permissions: S.optional(BackendStoragePermissions)
      .pipe(T.JsonName("permissions"))
      .annotations({ identifier: "BackendStoragePermissions" }),
    ServiceName: S.String.pipe(T.JsonName("serviceName")),
  }),
).annotations({
  identifier: "GetBackendStorageResourceConfig",
}) as any as S.Schema<GetBackendStorageResourceConfig>;
export interface BackendJobRespObj {
  AppId: string;
  BackendEnvironmentName: string;
  CreateTime?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
  UpdateTime?: string;
}
export const BackendJobRespObj = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.String.pipe(T.JsonName("backendEnvironmentName")),
    CreateTime: S.optional(S.String).pipe(T.JsonName("createTime")),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
    UpdateTime: S.optional(S.String).pipe(T.JsonName("updateTime")),
  }),
).annotations({
  identifier: "BackendJobRespObj",
}) as any as S.Schema<BackendJobRespObj>;
export type ListOfBackendJobRespObj = BackendJobRespObj[];
export const ListOfBackendJobRespObj = S.Array(BackendJobRespObj);
export interface S3BucketInfo {
  CreationDate?: string;
  Name?: string;
}
export const S3BucketInfo = S.suspend(() =>
  S.Struct({
    CreationDate: S.optional(S.String).pipe(T.JsonName("creationDate")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({ identifier: "S3BucketInfo" }) as any as S.Schema<S3BucketInfo>;
export type ListOfS3BucketInfo = S3BucketInfo[];
export const ListOfS3BucketInfo = S.Array(S3BucketInfo);
export interface UpdateBackendAuthForgotPasswordConfig {
  DeliveryMethod?: string;
  EmailSettings?: EmailSettings;
  SmsSettings?: SmsSettings;
}
export const UpdateBackendAuthForgotPasswordConfig = S.suspend(() =>
  S.Struct({
    DeliveryMethod: S.optional(S.String).pipe(T.JsonName("deliveryMethod")),
    EmailSettings: S.optional(EmailSettings)
      .pipe(T.JsonName("emailSettings"))
      .annotations({ identifier: "EmailSettings" }),
    SmsSettings: S.optional(SmsSettings)
      .pipe(T.JsonName("smsSettings"))
      .annotations({ identifier: "SmsSettings" }),
  }),
).annotations({
  identifier: "UpdateBackendAuthForgotPasswordConfig",
}) as any as S.Schema<UpdateBackendAuthForgotPasswordConfig>;
export interface UpdateBackendAuthMFAConfig {
  MFAMode?: string;
  Settings?: Settings;
}
export const UpdateBackendAuthMFAConfig = S.suspend(() =>
  S.Struct({
    MFAMode: S.optional(S.String),
    Settings: S.optional(Settings)
      .pipe(T.JsonName("settings"))
      .annotations({ identifier: "Settings" }),
  }),
).annotations({
  identifier: "UpdateBackendAuthMFAConfig",
}) as any as S.Schema<UpdateBackendAuthMFAConfig>;
export interface UpdateBackendAuthOAuthConfig {
  DomainPrefix?: string;
  OAuthGrantType?: string;
  OAuthScopes?: ListOfOAuthScopesElement;
  RedirectSignInURIs?: ListOf__string;
  RedirectSignOutURIs?: ListOf__string;
  SocialProviderSettings?: SocialProviderSettings;
}
export const UpdateBackendAuthOAuthConfig = S.suspend(() =>
  S.Struct({
    DomainPrefix: S.optional(S.String).pipe(T.JsonName("domainPrefix")),
    OAuthGrantType: S.optional(S.String).pipe(T.JsonName("oAuthGrantType")),
    OAuthScopes: S.optional(ListOfOAuthScopesElement).pipe(
      T.JsonName("oAuthScopes"),
    ),
    RedirectSignInURIs: S.optional(ListOf__string).pipe(
      T.JsonName("redirectSignInURIs"),
    ),
    RedirectSignOutURIs: S.optional(ListOf__string).pipe(
      T.JsonName("redirectSignOutURIs"),
    ),
    SocialProviderSettings: S.optional(SocialProviderSettings)
      .pipe(T.JsonName("socialProviderSettings"))
      .annotations({ identifier: "SocialProviderSettings" }),
  }),
).annotations({
  identifier: "UpdateBackendAuthOAuthConfig",
}) as any as S.Schema<UpdateBackendAuthOAuthConfig>;
export interface UpdateBackendAuthPasswordPolicyConfig {
  AdditionalConstraints?: ListOfAdditionalConstraintsElement;
  MinimumLength?: number;
}
export const UpdateBackendAuthPasswordPolicyConfig = S.suspend(() =>
  S.Struct({
    AdditionalConstraints: S.optional(ListOfAdditionalConstraintsElement).pipe(
      T.JsonName("additionalConstraints"),
    ),
    MinimumLength: S.optional(S.Number).pipe(T.JsonName("minimumLength")),
  }),
).annotations({
  identifier: "UpdateBackendAuthPasswordPolicyConfig",
}) as any as S.Schema<UpdateBackendAuthPasswordPolicyConfig>;
export interface UpdateBackendAuthVerificationMessageConfig {
  DeliveryMethod: string;
  EmailSettings?: EmailSettings;
  SmsSettings?: SmsSettings;
}
export const UpdateBackendAuthVerificationMessageConfig = S.suspend(() =>
  S.Struct({
    DeliveryMethod: S.String.pipe(T.JsonName("deliveryMethod")),
    EmailSettings: S.optional(EmailSettings)
      .pipe(T.JsonName("emailSettings"))
      .annotations({ identifier: "EmailSettings" }),
    SmsSettings: S.optional(SmsSettings)
      .pipe(T.JsonName("smsSettings"))
      .annotations({ identifier: "SmsSettings" }),
  }),
).annotations({
  identifier: "UpdateBackendAuthVerificationMessageConfig",
}) as any as S.Schema<UpdateBackendAuthVerificationMessageConfig>;
export interface CreateBackendStorageRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceConfig: CreateBackendStorageResourceConfig;
  ResourceName: string;
}
export const CreateBackendStorageRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(T.JsonName("backendEnvironmentName")),
    ResourceConfig: CreateBackendStorageResourceConfig.pipe(
      T.JsonName("resourceConfig"),
    ).annotations({ identifier: "CreateBackendStorageResourceConfig" }),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/backend/{AppId}/storage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBackendStorageRequest",
}) as any as S.Schema<CreateBackendStorageRequest>;
export interface GetBackendStorageResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  ResourceConfig?: GetBackendStorageResourceConfig;
  ResourceName?: string;
}
export const GetBackendStorageResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    ResourceConfig: S.optional(GetBackendStorageResourceConfig)
      .pipe(T.JsonName("resourceConfig"))
      .annotations({ identifier: "GetBackendStorageResourceConfig" }),
    ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
  }),
).annotations({
  identifier: "GetBackendStorageResponse",
}) as any as S.Schema<GetBackendStorageResponse>;
export interface ListBackendJobsResponse {
  Jobs?: ListOfBackendJobRespObj;
  NextToken?: string;
}
export const ListBackendJobsResponse = S.suspend(() =>
  S.Struct({
    Jobs: S.optional(ListOfBackendJobRespObj).pipe(T.JsonName("jobs")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListBackendJobsResponse",
}) as any as S.Schema<ListBackendJobsResponse>;
export interface ListS3BucketsResponse {
  Buckets?: ListOfS3BucketInfo;
  NextToken?: string;
}
export const ListS3BucketsResponse = S.suspend(() =>
  S.Struct({
    Buckets: S.optional(ListOfS3BucketInfo).pipe(T.JsonName("buckets")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListS3BucketsResponse",
}) as any as S.Schema<ListS3BucketsResponse>;
export interface UpdateBackendConfigResponse {
  AppId?: string;
  BackendManagerAppId?: string;
  Error?: string;
  LoginAuthConfig?: LoginAuthConfigReqObj;
}
export const UpdateBackendConfigResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendManagerAppId: S.optional(S.String).pipe(
      T.JsonName("backendManagerAppId"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    LoginAuthConfig: S.optional(LoginAuthConfigReqObj)
      .pipe(T.JsonName("loginAuthConfig"))
      .annotations({ identifier: "LoginAuthConfigReqObj" }),
  }),
).annotations({
  identifier: "UpdateBackendConfigResponse",
}) as any as S.Schema<UpdateBackendConfigResponse>;
export interface UpdateBackendStorageResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  JobId?: string;
  Status?: string;
}
export const UpdateBackendStorageResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "UpdateBackendStorageResponse",
}) as any as S.Schema<UpdateBackendStorageResponse>;
export interface UpdateBackendAuthUserPoolConfig {
  ForgotPassword?: UpdateBackendAuthForgotPasswordConfig;
  Mfa?: UpdateBackendAuthMFAConfig;
  OAuth?: UpdateBackendAuthOAuthConfig;
  PasswordPolicy?: UpdateBackendAuthPasswordPolicyConfig;
  VerificationMessage?: UpdateBackendAuthVerificationMessageConfig;
}
export const UpdateBackendAuthUserPoolConfig = S.suspend(() =>
  S.Struct({
    ForgotPassword: S.optional(UpdateBackendAuthForgotPasswordConfig)
      .pipe(T.JsonName("forgotPassword"))
      .annotations({ identifier: "UpdateBackendAuthForgotPasswordConfig" }),
    Mfa: S.optional(UpdateBackendAuthMFAConfig)
      .pipe(T.JsonName("mfa"))
      .annotations({ identifier: "UpdateBackendAuthMFAConfig" }),
    OAuth: S.optional(UpdateBackendAuthOAuthConfig)
      .pipe(T.JsonName("oAuth"))
      .annotations({ identifier: "UpdateBackendAuthOAuthConfig" }),
    PasswordPolicy: S.optional(UpdateBackendAuthPasswordPolicyConfig)
      .pipe(T.JsonName("passwordPolicy"))
      .annotations({ identifier: "UpdateBackendAuthPasswordPolicyConfig" }),
    VerificationMessage: S.optional(UpdateBackendAuthVerificationMessageConfig)
      .pipe(T.JsonName("verificationMessage"))
      .annotations({
        identifier: "UpdateBackendAuthVerificationMessageConfig",
      }),
  }),
).annotations({
  identifier: "UpdateBackendAuthUserPoolConfig",
}) as any as S.Schema<UpdateBackendAuthUserPoolConfig>;
export interface UpdateBackendAuthResourceConfig {
  AuthResources: string;
  IdentityPoolConfigs?: UpdateBackendAuthIdentityPoolConfig;
  Service: string;
  UserPoolConfigs: UpdateBackendAuthUserPoolConfig;
}
export const UpdateBackendAuthResourceConfig = S.suspend(() =>
  S.Struct({
    AuthResources: S.String.pipe(T.JsonName("authResources")),
    IdentityPoolConfigs: S.optional(UpdateBackendAuthIdentityPoolConfig)
      .pipe(T.JsonName("identityPoolConfigs"))
      .annotations({ identifier: "UpdateBackendAuthIdentityPoolConfig" }),
    Service: S.String.pipe(T.JsonName("service")),
    UserPoolConfigs: UpdateBackendAuthUserPoolConfig.pipe(
      T.JsonName("userPoolConfigs"),
    ).annotations({ identifier: "UpdateBackendAuthUserPoolConfig" }),
  }),
).annotations({
  identifier: "UpdateBackendAuthResourceConfig",
}) as any as S.Schema<UpdateBackendAuthResourceConfig>;
export interface CreateBackendAPIRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceConfig: BackendAPIResourceConfig;
  ResourceName: string;
}
export const CreateBackendAPIRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(T.JsonName("backendEnvironmentName")),
    ResourceConfig: BackendAPIResourceConfig.pipe(
      T.JsonName("resourceConfig"),
    ).annotations({ identifier: "BackendAPIResourceConfig" }),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/backend/{AppId}/api" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBackendAPIRequest",
}) as any as S.Schema<CreateBackendAPIRequest>;
export interface CreateBackendStorageResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  JobId?: string;
  Status?: string;
}
export const CreateBackendStorageResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "CreateBackendStorageResponse",
}) as any as S.Schema<CreateBackendStorageResponse>;
export interface UpdateBackendAuthRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceConfig: UpdateBackendAuthResourceConfig;
  ResourceName: string;
}
export const UpdateBackendAuthRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(
      T.HttpLabel("BackendEnvironmentName"),
    ),
    ResourceConfig: UpdateBackendAuthResourceConfig.pipe(
      T.JsonName("resourceConfig"),
    ).annotations({ identifier: "UpdateBackendAuthResourceConfig" }),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/backend/{AppId}/auth/{BackendEnvironmentName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBackendAuthRequest",
}) as any as S.Schema<UpdateBackendAuthRequest>;
export interface CreateBackendAPIResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const CreateBackendAPIResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "CreateBackendAPIResponse",
}) as any as S.Schema<CreateBackendAPIResponse>;
export interface UpdateBackendAuthResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const UpdateBackendAuthResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "UpdateBackendAuthResponse",
}) as any as S.Schema<UpdateBackendAuthResponse>;
export interface CreateBackendAuthRequest {
  AppId: string;
  BackendEnvironmentName: string;
  ResourceConfig: CreateBackendAuthResourceConfig;
  ResourceName: string;
}
export const CreateBackendAuthRequest = S.suspend(() =>
  S.Struct({
    AppId: S.String.pipe(T.HttpLabel("AppId")),
    BackendEnvironmentName: S.String.pipe(T.JsonName("backendEnvironmentName")),
    ResourceConfig: CreateBackendAuthResourceConfig.pipe(
      T.JsonName("resourceConfig"),
    ).annotations({ identifier: "CreateBackendAuthResourceConfig" }),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/backend/{AppId}/auth" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBackendAuthRequest",
}) as any as S.Schema<CreateBackendAuthRequest>;
export interface CreateBackendAuthResponse {
  AppId?: string;
  BackendEnvironmentName?: string;
  Error?: string;
  JobId?: string;
  Operation?: string;
  Status?: string;
}
export const CreateBackendAuthResponse = S.suspend(() =>
  S.Struct({
    AppId: S.optional(S.String).pipe(T.JsonName("appId")),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
    Error: S.optional(S.String).pipe(T.JsonName("error")),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "CreateBackendAuthResponse",
}) as any as S.Schema<CreateBackendAuthResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class GatewayTimeoutException extends S.TaggedError<GatewayTimeoutException>()(
  "GatewayTimeoutException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withTimeoutError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    ResourceType: S.optional(S.String).pipe(T.JsonName("resourceType")),
  },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {
    LimitType: S.optional(S.String).pipe(T.JsonName("limitType")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * This operation clones an existing backend.
 */
export const cloneBackend: (
  input: CloneBackendRequest,
) => Effect.Effect<
  CloneBackendResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CloneBackendRequest,
  output: CloneBackendResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new backend API resource.
 */
export const createBackendAPI: (
  input: CreateBackendAPIRequest,
) => Effect.Effect<
  CreateBackendAPIResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBackendAPIRequest,
  output: CreateBackendAPIResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing backend authentication resource.
 */
export const updateBackendAuth: (
  input: UpdateBackendAuthRequest,
) => Effect.Effect<
  UpdateBackendAuthResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBackendAuthRequest,
  output: UpdateBackendAuthResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a backend storage resource.
 */
export const createBackendStorage: (
  input: CreateBackendStorageRequest,
) => Effect.Effect<
  CreateBackendStorageResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBackendStorageRequest,
  output: CreateBackendStorageResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets details for a backend storage resource.
 */
export const getBackendStorage: (
  input: GetBackendStorageRequest,
) => Effect.Effect<
  GetBackendStorageResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBackendStorageRequest,
  output: GetBackendStorageResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the jobs for the backend of an Amplify app.
 */
export const listBackendJobs: (
  input: ListBackendJobsRequest,
) => Effect.Effect<
  ListBackendJobsResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBackendJobsRequest,
  output: ListBackendJobsResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * The list of S3 buckets in your account.
 */
export const listS3Buckets: (
  input: ListS3BucketsRequest,
) => Effect.Effect<
  ListS3BucketsResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListS3BucketsRequest,
  output: ListS3BucketsResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the AWS resources required to access the Amplify Admin UI.
 */
export const updateBackendConfig: (
  input: UpdateBackendConfigRequest,
) => Effect.Effect<
  UpdateBackendConfigResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBackendConfigRequest,
  output: UpdateBackendConfigResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing backend storage resource.
 */
export const updateBackendStorage: (
  input: UpdateBackendStorageRequest,
) => Effect.Effect<
  UpdateBackendStorageResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBackendStorageRequest,
  output: UpdateBackendStorageResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * This operation creates a backend for an Amplify app. Backends are automatically created at the time of app creation.
 */
export const createBackend: (
  input: CreateBackendRequest,
) => Effect.Effect<
  CreateBackendResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBackendRequest,
  output: CreateBackendResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a config object for a backend.
 */
export const createBackendConfig: (
  input: CreateBackendConfigRequest,
) => Effect.Effect<
  CreateBackendConfigResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBackendConfigRequest,
  output: CreateBackendConfigResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Generates a one-time challenge code to authenticate a user into your Amplify Admin UI.
 */
export const createToken: (
  input: CreateTokenRequest,
) => Effect.Effect<
  CreateTokenResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTokenRequest,
  output: CreateTokenResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes an existing environment from your Amplify project.
 */
export const deleteBackend: (
  input: DeleteBackendRequest,
) => Effect.Effect<
  DeleteBackendResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBackendRequest,
  output: DeleteBackendResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an existing backend API resource.
 */
export const deleteBackendAPI: (
  input: DeleteBackendAPIRequest,
) => Effect.Effect<
  DeleteBackendAPIResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBackendAPIRequest,
  output: DeleteBackendAPIResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an existing backend authentication resource.
 */
export const deleteBackendAuth: (
  input: DeleteBackendAuthRequest,
) => Effect.Effect<
  DeleteBackendAuthResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBackendAuthRequest,
  output: DeleteBackendAuthResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes the specified backend storage resource.
 */
export const deleteBackendStorage: (
  input: DeleteBackendStorageRequest,
) => Effect.Effect<
  DeleteBackendStorageResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBackendStorageRequest,
  output: DeleteBackendStorageResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the challenge token based on the given appId and sessionId.
 */
export const deleteToken: (
  input: DeleteTokenRequest,
) => Effect.Effect<
  DeleteTokenResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTokenRequest,
  output: DeleteTokenResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Generates a model schema for an existing backend API resource.
 */
export const generateBackendAPIModels: (
  input: GenerateBackendAPIModelsRequest,
) => Effect.Effect<
  GenerateBackendAPIModelsResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateBackendAPIModelsRequest,
  output: GenerateBackendAPIModelsResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Provides project-level details for your Amplify UI project.
 */
export const getBackend: (
  input: GetBackendRequest,
) => Effect.Effect<
  GetBackendResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBackendRequest,
  output: GetBackendResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the details for a backend API.
 */
export const getBackendAPI: (
  input: GetBackendAPIRequest,
) => Effect.Effect<
  GetBackendAPIResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBackendAPIRequest,
  output: GetBackendAPIResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets a model introspection schema for an existing backend API resource.
 */
export const getBackendAPIModels: (
  input: GetBackendAPIModelsRequest,
) => Effect.Effect<
  GetBackendAPIModelsResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBackendAPIModelsRequest,
  output: GetBackendAPIModelsResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets a backend auth details.
 */
export const getBackendAuth: (
  input: GetBackendAuthRequest,
) => Effect.Effect<
  GetBackendAuthResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBackendAuthRequest,
  output: GetBackendAuthResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns information about a specific job.
 */
export const getBackendJob: (
  input: GetBackendJobRequest,
) => Effect.Effect<
  GetBackendJobResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBackendJobRequest,
  output: GetBackendJobResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the challenge token based on the given appId and sessionId.
 */
export const getToken: (
  input: GetTokenRequest,
) => Effect.Effect<
  GetTokenResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTokenRequest,
  output: GetTokenResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Imports an existing backend authentication resource.
 */
export const importBackendAuth: (
  input: ImportBackendAuthRequest,
) => Effect.Effect<
  ImportBackendAuthResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportBackendAuthRequest,
  output: ImportBackendAuthResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Imports an existing backend storage resource.
 */
export const importBackendStorage: (
  input: ImportBackendStorageRequest,
) => Effect.Effect<
  ImportBackendStorageResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportBackendStorageRequest,
  output: ImportBackendStorageResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes all backend environments from your Amplify project.
 */
export const removeAllBackends: (
  input: RemoveAllBackendsRequest,
) => Effect.Effect<
  RemoveAllBackendsResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveAllBackendsRequest,
  output: RemoveAllBackendsResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes the AWS resources required to access the Amplify Admin UI.
 */
export const removeBackendConfig: (
  input: RemoveBackendConfigRequest,
) => Effect.Effect<
  RemoveBackendConfigResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveBackendConfigRequest,
  output: RemoveBackendConfigResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing backend API resource.
 */
export const updateBackendAPI: (
  input: UpdateBackendAPIRequest,
) => Effect.Effect<
  UpdateBackendAPIResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBackendAPIRequest,
  output: UpdateBackendAPIResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a specific job.
 */
export const updateBackendJob: (
  input: UpdateBackendJobRequest,
) => Effect.Effect<
  UpdateBackendJobResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBackendJobRequest,
  output: UpdateBackendJobResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new backend authentication resource.
 */
export const createBackendAuth: (
  input: CreateBackendAuthRequest,
) => Effect.Effect<
  CreateBackendAuthResponse,
  | BadRequestException
  | GatewayTimeoutException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBackendAuthRequest,
  output: CreateBackendAuthResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
