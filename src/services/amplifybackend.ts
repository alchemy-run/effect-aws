import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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

//# Schemas
export class ResourceConfig extends S.Class<ResourceConfig>("ResourceConfig")(
  {},
) {}
export class CloneBackendRequest extends S.Class<CloneBackendRequest>(
  "CloneBackendRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    TargetEnvironmentName: S.String.pipe(T.JsonName("targetEnvironmentName")),
  },
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
) {}
export class CreateBackendRequest extends S.Class<CreateBackendRequest>(
  "CreateBackendRequest",
)(
  {
    AppId: S.String.pipe(T.JsonName("appId")),
    AppName: S.String.pipe(T.JsonName("appName")),
    BackendEnvironmentName: S.String.pipe(T.JsonName("backendEnvironmentName")),
    ResourceConfig: S.optional(ResourceConfig).pipe(
      T.JsonName("resourceConfig"),
    ),
    ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/backend" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBackendConfigRequest extends S.Class<CreateBackendConfigRequest>(
  "CreateBackendConfigRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendManagerAppId: S.optional(S.String).pipe(
      T.JsonName("backendManagerAppId"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/backend/{AppId}/config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTokenRequest extends S.Class<CreateTokenRequest>(
  "CreateTokenRequest",
)(
  { AppId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/backend/{AppId}/challenge" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBackendRequest extends S.Class<DeleteBackendRequest>(
  "DeleteBackendRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class BackendAPIAppSyncAuthSettings extends S.Class<BackendAPIAppSyncAuthSettings>(
  "BackendAPIAppSyncAuthSettings",
)({
  CognitoUserPoolId: S.optional(S.String).pipe(T.JsonName("cognitoUserPoolId")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  ExpirationTime: S.optional(S.Number).pipe(T.JsonName("expirationTime")),
  OpenIDAuthTTL: S.optional(S.String).pipe(T.JsonName("openIDAuthTTL")),
  OpenIDClientId: S.optional(S.String).pipe(T.JsonName("openIDClientId")),
  OpenIDIatTTL: S.optional(S.String).pipe(T.JsonName("openIDIatTTL")),
  OpenIDIssueURL: S.optional(S.String).pipe(T.JsonName("openIDIssueURL")),
  OpenIDProviderName: S.optional(S.String).pipe(
    T.JsonName("openIDProviderName"),
  ),
}) {}
export class BackendAPIAuthType extends S.Class<BackendAPIAuthType>(
  "BackendAPIAuthType",
)({
  Mode: S.optional(S.String).pipe(T.JsonName("mode")),
  Settings: S.optional(BackendAPIAppSyncAuthSettings).pipe(
    T.JsonName("settings"),
  ),
}) {}
export const ListOfBackendAPIAuthType = S.Array(BackendAPIAuthType);
export class BackendAPIConflictResolution extends S.Class<BackendAPIConflictResolution>(
  "BackendAPIConflictResolution",
)({
  ResolutionStrategy: S.optional(S.String).pipe(
    T.JsonName("resolutionStrategy"),
  ),
}) {}
export class BackendAPIResourceConfig extends S.Class<BackendAPIResourceConfig>(
  "BackendAPIResourceConfig",
)({
  AdditionalAuthTypes: S.optional(ListOfBackendAPIAuthType).pipe(
    T.JsonName("additionalAuthTypes"),
  ),
  ApiName: S.optional(S.String).pipe(T.JsonName("apiName")),
  ConflictResolution: S.optional(BackendAPIConflictResolution).pipe(
    T.JsonName("conflictResolution"),
  ),
  DefaultAuthType: S.optional(BackendAPIAuthType).pipe(
    T.JsonName("defaultAuthType"),
  ),
  Service: S.optional(S.String).pipe(T.JsonName("service")),
  TransformSchema: S.optional(S.String).pipe(T.JsonName("transformSchema")),
}) {}
export class DeleteBackendAPIRequest extends S.Class<DeleteBackendAPIRequest>(
  "DeleteBackendAPIRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    ResourceConfig: S.optional(BackendAPIResourceConfig).pipe(
      T.JsonName("resourceConfig"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
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
) {}
export class DeleteBackendAuthRequest extends S.Class<DeleteBackendAuthRequest>(
  "DeleteBackendAuthRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
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
) {}
export class DeleteBackendStorageRequest extends S.Class<DeleteBackendStorageRequest>(
  "DeleteBackendStorageRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
    ServiceName: S.String.pipe(T.JsonName("serviceName")),
  },
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
) {}
export class DeleteTokenRequest extends S.Class<DeleteTokenRequest>(
  "DeleteTokenRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    SessionId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GenerateBackendAPIModelsRequest extends S.Class<GenerateBackendAPIModelsRequest>(
  "GenerateBackendAPIModelsRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
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
) {}
export class GetBackendRequest extends S.Class<GetBackendRequest>(
  "GetBackendRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.optional(S.String).pipe(
      T.JsonName("backendEnvironmentName"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/backend/{AppId}/details" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBackendAPIRequest extends S.Class<GetBackendAPIRequest>(
  "GetBackendAPIRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    ResourceConfig: S.optional(BackendAPIResourceConfig).pipe(
      T.JsonName("resourceConfig"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
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
) {}
export class GetBackendAPIModelsRequest extends S.Class<GetBackendAPIModelsRequest>(
  "GetBackendAPIModelsRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
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
) {}
export class GetBackendAuthRequest extends S.Class<GetBackendAuthRequest>(
  "GetBackendAuthRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
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
) {}
export class GetBackendJobRequest extends S.Class<GetBackendJobRequest>(
  "GetBackendJobRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    JobId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetBackendStorageRequest extends S.Class<GetBackendStorageRequest>(
  "GetBackendStorageRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
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
) {}
export class GetTokenRequest extends S.Class<GetTokenRequest>(
  "GetTokenRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    SessionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/backend/{AppId}/challenge/{SessionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportBackendAuthRequest extends S.Class<ImportBackendAuthRequest>(
  "ImportBackendAuthRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    IdentityPoolId: S.optional(S.String).pipe(T.JsonName("identityPoolId")),
    NativeClientId: S.String.pipe(T.JsonName("nativeClientId")),
    UserPoolId: S.String.pipe(T.JsonName("userPoolId")),
    WebClientId: S.String.pipe(T.JsonName("webClientId")),
  },
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
) {}
export class ImportBackendStorageRequest extends S.Class<ImportBackendStorageRequest>(
  "ImportBackendStorageRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    BucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
    ServiceName: S.String.pipe(T.JsonName("serviceName")),
  },
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
) {}
export class ListBackendJobsRequest extends S.Class<ListBackendJobsRequest>(
  "ListBackendJobsRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  },
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
) {}
export class ListS3BucketsRequest extends S.Class<ListS3BucketsRequest>(
  "ListS3BucketsRequest",
)(
  { NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")) },
  T.all(
    T.Http({ method: "POST", uri: "/s3Buckets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveAllBackendsRequest extends S.Class<RemoveAllBackendsRequest>(
  "RemoveAllBackendsRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    CleanAmplifyApp: S.optional(S.Boolean).pipe(T.JsonName("cleanAmplifyApp")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/backend/{AppId}/remove" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveBackendConfigRequest extends S.Class<RemoveBackendConfigRequest>(
  "RemoveBackendConfigRequest",
)(
  { AppId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/backend/{AppId}/config/remove" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBackendAPIRequest extends S.Class<UpdateBackendAPIRequest>(
  "UpdateBackendAPIRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    ResourceConfig: S.optional(BackendAPIResourceConfig).pipe(
      T.JsonName("resourceConfig"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
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
) {}
export class UpdateBackendJobRequest extends S.Class<UpdateBackendJobRequest>(
  "UpdateBackendJobRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    JobId: S.String.pipe(T.HttpLabel()),
    Operation: S.optional(S.String).pipe(T.JsonName("operation")),
    Status: S.optional(S.String).pipe(T.JsonName("status")),
  },
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
) {}
export const ListOf__string = S.Array(S.String);
export class LoginAuthConfigReqObj extends S.Class<LoginAuthConfigReqObj>(
  "LoginAuthConfigReqObj",
)({
  AwsCognitoIdentityPoolId: S.optional(S.String).pipe(
    T.JsonName("aws_cognito_identity_pool_id"),
  ),
  AwsCognitoRegion: S.optional(S.String).pipe(T.JsonName("aws_cognito_region")),
  AwsUserPoolsId: S.optional(S.String).pipe(T.JsonName("aws_user_pools_id")),
  AwsUserPoolsWebClientId: S.optional(S.String).pipe(
    T.JsonName("aws_user_pools_web_client_id"),
  ),
}) {}
export const ListOfAuthenticatedElement = S.Array(S.String);
export const ListOfUnAuthenticatedElement = S.Array(S.String);
export class BackendStoragePermissions extends S.Class<BackendStoragePermissions>(
  "BackendStoragePermissions",
)({
  Authenticated: ListOfAuthenticatedElement.pipe(T.JsonName("authenticated")),
  UnAuthenticated: S.optional(ListOfUnAuthenticatedElement).pipe(
    T.JsonName("unAuthenticated"),
  ),
}) {}
export class UpdateBackendStorageResourceConfig extends S.Class<UpdateBackendStorageResourceConfig>(
  "UpdateBackendStorageResourceConfig",
)({
  Permissions: BackendStoragePermissions.pipe(T.JsonName("permissions")),
  ServiceName: S.String.pipe(T.JsonName("serviceName")),
}) {}
export const ListOfRequiredSignUpAttributesElement = S.Array(S.String);
export class CloneBackendResponse extends S.Class<CloneBackendResponse>(
  "CloneBackendResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class CreateBackendResponse extends S.Class<CreateBackendResponse>(
  "CreateBackendResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class CreateBackendConfigResponse extends S.Class<CreateBackendConfigResponse>(
  "CreateBackendConfigResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class CreateTokenResponse extends S.Class<CreateTokenResponse>(
  "CreateTokenResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  ChallengeCode: S.optional(S.String).pipe(T.JsonName("challengeCode")),
  SessionId: S.optional(S.String).pipe(T.JsonName("sessionId")),
  Ttl: S.optional(S.String).pipe(T.JsonName("ttl")),
}) {}
export class DeleteBackendResponse extends S.Class<DeleteBackendResponse>(
  "DeleteBackendResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class DeleteBackendAPIResponse extends S.Class<DeleteBackendAPIResponse>(
  "DeleteBackendAPIResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class DeleteBackendAuthResponse extends S.Class<DeleteBackendAuthResponse>(
  "DeleteBackendAuthResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class DeleteBackendStorageResponse extends S.Class<DeleteBackendStorageResponse>(
  "DeleteBackendStorageResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class DeleteTokenResponse extends S.Class<DeleteTokenResponse>(
  "DeleteTokenResponse",
)({ IsSuccess: S.optional(S.Boolean).pipe(T.JsonName("isSuccess")) }) {}
export class GenerateBackendAPIModelsResponse extends S.Class<GenerateBackendAPIModelsResponse>(
  "GenerateBackendAPIModelsResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class GetBackendResponse extends S.Class<GetBackendResponse>(
  "GetBackendResponse",
)({
  AmplifyFeatureFlags: S.optional(S.String).pipe(
    T.JsonName("amplifyFeatureFlags"),
  ),
  AmplifyMetaConfig: S.optional(S.String).pipe(T.JsonName("amplifyMetaConfig")),
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  AppName: S.optional(S.String).pipe(T.JsonName("appName")),
  BackendEnvironmentList: S.optional(ListOf__string).pipe(
    T.JsonName("backendEnvironmentList"),
  ),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
}) {}
export class GetBackendAPIResponse extends S.Class<GetBackendAPIResponse>(
  "GetBackendAPIResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  ResourceConfig: S.optional(BackendAPIResourceConfig).pipe(
    T.JsonName("resourceConfig"),
  ),
  ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
}) {}
export class GetBackendAPIModelsResponse extends S.Class<GetBackendAPIModelsResponse>(
  "GetBackendAPIModelsResponse",
)({
  Models: S.optional(S.String).pipe(T.JsonName("models")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  ModelIntrospectionSchema: S.optional(S.String).pipe(
    T.JsonName("modelIntrospectionSchema"),
  ),
}) {}
export class CreateBackendAuthIdentityPoolConfig extends S.Class<CreateBackendAuthIdentityPoolConfig>(
  "CreateBackendAuthIdentityPoolConfig",
)({
  IdentityPoolName: S.String.pipe(T.JsonName("identityPoolName")),
  UnauthenticatedLogin: S.Boolean.pipe(T.JsonName("unauthenticatedLogin")),
}) {}
export class EmailSettings extends S.Class<EmailSettings>("EmailSettings")({
  EmailMessage: S.optional(S.String).pipe(T.JsonName("emailMessage")),
  EmailSubject: S.optional(S.String).pipe(T.JsonName("emailSubject")),
}) {}
export class SmsSettings extends S.Class<SmsSettings>("SmsSettings")({
  SmsMessage: S.optional(S.String).pipe(T.JsonName("smsMessage")),
}) {}
export class CreateBackendAuthForgotPasswordConfig extends S.Class<CreateBackendAuthForgotPasswordConfig>(
  "CreateBackendAuthForgotPasswordConfig",
)({
  DeliveryMethod: S.String.pipe(T.JsonName("deliveryMethod")),
  EmailSettings: S.optional(EmailSettings).pipe(T.JsonName("emailSettings")),
  SmsSettings: S.optional(SmsSettings).pipe(T.JsonName("smsSettings")),
}) {}
export const ListOfMfaTypesElement = S.Array(S.String);
export class Settings extends S.Class<Settings>("Settings")({
  MfaTypes: S.optional(ListOfMfaTypesElement).pipe(T.JsonName("mfaTypes")),
  SmsMessage: S.optional(S.String).pipe(T.JsonName("smsMessage")),
}) {}
export class CreateBackendAuthMFAConfig extends S.Class<CreateBackendAuthMFAConfig>(
  "CreateBackendAuthMFAConfig",
)({
  MFAMode: S.String,
  Settings: S.optional(Settings).pipe(T.JsonName("settings")),
}) {}
export const ListOfOAuthScopesElement = S.Array(S.String);
export class BackendAuthSocialProviderConfig extends S.Class<BackendAuthSocialProviderConfig>(
  "BackendAuthSocialProviderConfig",
)({
  ClientId: S.optional(S.String).pipe(T.JsonName("client_id")),
  ClientSecret: S.optional(S.String).pipe(T.JsonName("client_secret")),
}) {}
export class BackendAuthAppleProviderConfig extends S.Class<BackendAuthAppleProviderConfig>(
  "BackendAuthAppleProviderConfig",
)({
  ClientId: S.optional(S.String).pipe(T.JsonName("client_id")),
  KeyId: S.optional(S.String).pipe(T.JsonName("key_id")),
  PrivateKey: S.optional(S.String).pipe(T.JsonName("private_key")),
  TeamId: S.optional(S.String).pipe(T.JsonName("team_id")),
}) {}
export class SocialProviderSettings extends S.Class<SocialProviderSettings>(
  "SocialProviderSettings",
)({
  Facebook: S.optional(BackendAuthSocialProviderConfig),
  Google: S.optional(BackendAuthSocialProviderConfig),
  LoginWithAmazon: S.optional(BackendAuthSocialProviderConfig),
  SignInWithApple: S.optional(BackendAuthAppleProviderConfig),
}) {}
export class CreateBackendAuthOAuthConfig extends S.Class<CreateBackendAuthOAuthConfig>(
  "CreateBackendAuthOAuthConfig",
)({
  DomainPrefix: S.optional(S.String).pipe(T.JsonName("domainPrefix")),
  OAuthGrantType: S.String.pipe(T.JsonName("oAuthGrantType")),
  OAuthScopes: ListOfOAuthScopesElement.pipe(T.JsonName("oAuthScopes")),
  RedirectSignInURIs: ListOf__string.pipe(T.JsonName("redirectSignInURIs")),
  RedirectSignOutURIs: ListOf__string.pipe(T.JsonName("redirectSignOutURIs")),
  SocialProviderSettings: S.optional(SocialProviderSettings).pipe(
    T.JsonName("socialProviderSettings"),
  ),
}) {}
export const ListOfAdditionalConstraintsElement = S.Array(S.String);
export class CreateBackendAuthPasswordPolicyConfig extends S.Class<CreateBackendAuthPasswordPolicyConfig>(
  "CreateBackendAuthPasswordPolicyConfig",
)({
  AdditionalConstraints: S.optional(ListOfAdditionalConstraintsElement).pipe(
    T.JsonName("additionalConstraints"),
  ),
  MinimumLength: S.Number.pipe(T.JsonName("minimumLength")),
}) {}
export class CreateBackendAuthVerificationMessageConfig extends S.Class<CreateBackendAuthVerificationMessageConfig>(
  "CreateBackendAuthVerificationMessageConfig",
)({
  DeliveryMethod: S.String.pipe(T.JsonName("deliveryMethod")),
  EmailSettings: S.optional(EmailSettings).pipe(T.JsonName("emailSettings")),
  SmsSettings: S.optional(SmsSettings).pipe(T.JsonName("smsSettings")),
}) {}
export class CreateBackendAuthUserPoolConfig extends S.Class<CreateBackendAuthUserPoolConfig>(
  "CreateBackendAuthUserPoolConfig",
)({
  ForgotPassword: S.optional(CreateBackendAuthForgotPasswordConfig).pipe(
    T.JsonName("forgotPassword"),
  ),
  Mfa: S.optional(CreateBackendAuthMFAConfig).pipe(T.JsonName("mfa")),
  OAuth: S.optional(CreateBackendAuthOAuthConfig).pipe(T.JsonName("oAuth")),
  PasswordPolicy: S.optional(CreateBackendAuthPasswordPolicyConfig).pipe(
    T.JsonName("passwordPolicy"),
  ),
  RequiredSignUpAttributes: ListOfRequiredSignUpAttributesElement.pipe(
    T.JsonName("requiredSignUpAttributes"),
  ),
  SignInMethod: S.String.pipe(T.JsonName("signInMethod")),
  UserPoolName: S.String.pipe(T.JsonName("userPoolName")),
  VerificationMessage: S.optional(
    CreateBackendAuthVerificationMessageConfig,
  ).pipe(T.JsonName("verificationMessage")),
}) {}
export class CreateBackendAuthResourceConfig extends S.Class<CreateBackendAuthResourceConfig>(
  "CreateBackendAuthResourceConfig",
)({
  AuthResources: S.String.pipe(T.JsonName("authResources")),
  IdentityPoolConfigs: S.optional(CreateBackendAuthIdentityPoolConfig).pipe(
    T.JsonName("identityPoolConfigs"),
  ),
  Service: S.String.pipe(T.JsonName("service")),
  UserPoolConfigs: CreateBackendAuthUserPoolConfig.pipe(
    T.JsonName("userPoolConfigs"),
  ),
}) {}
export class GetBackendAuthResponse extends S.Class<GetBackendAuthResponse>(
  "GetBackendAuthResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  ResourceConfig: S.optional(CreateBackendAuthResourceConfig).pipe(
    T.JsonName("resourceConfig"),
  ),
  ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
}) {}
export class GetBackendJobResponse extends S.Class<GetBackendJobResponse>(
  "GetBackendJobResponse",
)({
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
}) {}
export class GetTokenResponse extends S.Class<GetTokenResponse>(
  "GetTokenResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  ChallengeCode: S.optional(S.String).pipe(T.JsonName("challengeCode")),
  SessionId: S.optional(S.String).pipe(T.JsonName("sessionId")),
  Ttl: S.optional(S.String).pipe(T.JsonName("ttl")),
}) {}
export class ImportBackendAuthResponse extends S.Class<ImportBackendAuthResponse>(
  "ImportBackendAuthResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class ImportBackendStorageResponse extends S.Class<ImportBackendStorageResponse>(
  "ImportBackendStorageResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class RemoveAllBackendsResponse extends S.Class<RemoveAllBackendsResponse>(
  "RemoveAllBackendsResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class RemoveBackendConfigResponse extends S.Class<RemoveBackendConfigResponse>(
  "RemoveBackendConfigResponse",
)({ Error: S.optional(S.String).pipe(T.JsonName("error")) }) {}
export class UpdateBackendAPIResponse extends S.Class<UpdateBackendAPIResponse>(
  "UpdateBackendAPIResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class UpdateBackendConfigRequest extends S.Class<UpdateBackendConfigRequest>(
  "UpdateBackendConfigRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    LoginAuthConfig: S.optional(LoginAuthConfigReqObj).pipe(
      T.JsonName("loginAuthConfig"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/backend/{AppId}/config/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBackendJobResponse extends S.Class<UpdateBackendJobResponse>(
  "UpdateBackendJobResponse",
)({
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
}) {}
export class UpdateBackendStorageRequest extends S.Class<UpdateBackendStorageRequest>(
  "UpdateBackendStorageRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    ResourceConfig: UpdateBackendStorageResourceConfig.pipe(
      T.JsonName("resourceConfig"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
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
) {}
export class UpdateBackendAuthIdentityPoolConfig extends S.Class<UpdateBackendAuthIdentityPoolConfig>(
  "UpdateBackendAuthIdentityPoolConfig",
)({
  UnauthenticatedLogin: S.optional(S.Boolean).pipe(
    T.JsonName("unauthenticatedLogin"),
  ),
}) {}
export class CreateBackendStorageResourceConfig extends S.Class<CreateBackendStorageResourceConfig>(
  "CreateBackendStorageResourceConfig",
)({
  BucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
  Permissions: BackendStoragePermissions.pipe(T.JsonName("permissions")),
  ServiceName: S.String.pipe(T.JsonName("serviceName")),
}) {}
export class GetBackendStorageResourceConfig extends S.Class<GetBackendStorageResourceConfig>(
  "GetBackendStorageResourceConfig",
)({
  BucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
  Imported: S.Boolean.pipe(T.JsonName("imported")),
  Permissions: S.optional(BackendStoragePermissions).pipe(
    T.JsonName("permissions"),
  ),
  ServiceName: S.String.pipe(T.JsonName("serviceName")),
}) {}
export class BackendJobRespObj extends S.Class<BackendJobRespObj>(
  "BackendJobRespObj",
)({
  AppId: S.String.pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.String.pipe(T.JsonName("backendEnvironmentName")),
  CreateTime: S.optional(S.String).pipe(T.JsonName("createTime")),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  UpdateTime: S.optional(S.String).pipe(T.JsonName("updateTime")),
}) {}
export const ListOfBackendJobRespObj = S.Array(BackendJobRespObj);
export class S3BucketInfo extends S.Class<S3BucketInfo>("S3BucketInfo")({
  CreationDate: S.optional(S.String).pipe(T.JsonName("creationDate")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export const ListOfS3BucketInfo = S.Array(S3BucketInfo);
export class UpdateBackendAuthForgotPasswordConfig extends S.Class<UpdateBackendAuthForgotPasswordConfig>(
  "UpdateBackendAuthForgotPasswordConfig",
)({
  DeliveryMethod: S.optional(S.String).pipe(T.JsonName("deliveryMethod")),
  EmailSettings: S.optional(EmailSettings).pipe(T.JsonName("emailSettings")),
  SmsSettings: S.optional(SmsSettings).pipe(T.JsonName("smsSettings")),
}) {}
export class UpdateBackendAuthMFAConfig extends S.Class<UpdateBackendAuthMFAConfig>(
  "UpdateBackendAuthMFAConfig",
)({
  MFAMode: S.optional(S.String),
  Settings: S.optional(Settings).pipe(T.JsonName("settings")),
}) {}
export class UpdateBackendAuthOAuthConfig extends S.Class<UpdateBackendAuthOAuthConfig>(
  "UpdateBackendAuthOAuthConfig",
)({
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
  SocialProviderSettings: S.optional(SocialProviderSettings).pipe(
    T.JsonName("socialProviderSettings"),
  ),
}) {}
export class UpdateBackendAuthPasswordPolicyConfig extends S.Class<UpdateBackendAuthPasswordPolicyConfig>(
  "UpdateBackendAuthPasswordPolicyConfig",
)({
  AdditionalConstraints: S.optional(ListOfAdditionalConstraintsElement).pipe(
    T.JsonName("additionalConstraints"),
  ),
  MinimumLength: S.optional(S.Number).pipe(T.JsonName("minimumLength")),
}) {}
export class UpdateBackendAuthVerificationMessageConfig extends S.Class<UpdateBackendAuthVerificationMessageConfig>(
  "UpdateBackendAuthVerificationMessageConfig",
)({
  DeliveryMethod: S.String.pipe(T.JsonName("deliveryMethod")),
  EmailSettings: S.optional(EmailSettings).pipe(T.JsonName("emailSettings")),
  SmsSettings: S.optional(SmsSettings).pipe(T.JsonName("smsSettings")),
}) {}
export class CreateBackendStorageRequest extends S.Class<CreateBackendStorageRequest>(
  "CreateBackendStorageRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.JsonName("backendEnvironmentName")),
    ResourceConfig: CreateBackendStorageResourceConfig.pipe(
      T.JsonName("resourceConfig"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/backend/{AppId}/storage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBackendStorageResponse extends S.Class<GetBackendStorageResponse>(
  "GetBackendStorageResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  ResourceConfig: S.optional(GetBackendStorageResourceConfig).pipe(
    T.JsonName("resourceConfig"),
  ),
  ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
}) {}
export class ListBackendJobsResponse extends S.Class<ListBackendJobsResponse>(
  "ListBackendJobsResponse",
)({
  Jobs: S.optional(ListOfBackendJobRespObj).pipe(T.JsonName("jobs")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListS3BucketsResponse extends S.Class<ListS3BucketsResponse>(
  "ListS3BucketsResponse",
)({
  Buckets: S.optional(ListOfS3BucketInfo).pipe(T.JsonName("buckets")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class UpdateBackendConfigResponse extends S.Class<UpdateBackendConfigResponse>(
  "UpdateBackendConfigResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendManagerAppId: S.optional(S.String).pipe(
    T.JsonName("backendManagerAppId"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  LoginAuthConfig: S.optional(LoginAuthConfigReqObj).pipe(
    T.JsonName("loginAuthConfig"),
  ),
}) {}
export class UpdateBackendStorageResponse extends S.Class<UpdateBackendStorageResponse>(
  "UpdateBackendStorageResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class UpdateBackendAuthUserPoolConfig extends S.Class<UpdateBackendAuthUserPoolConfig>(
  "UpdateBackendAuthUserPoolConfig",
)({
  ForgotPassword: S.optional(UpdateBackendAuthForgotPasswordConfig).pipe(
    T.JsonName("forgotPassword"),
  ),
  Mfa: S.optional(UpdateBackendAuthMFAConfig).pipe(T.JsonName("mfa")),
  OAuth: S.optional(UpdateBackendAuthOAuthConfig).pipe(T.JsonName("oAuth")),
  PasswordPolicy: S.optional(UpdateBackendAuthPasswordPolicyConfig).pipe(
    T.JsonName("passwordPolicy"),
  ),
  VerificationMessage: S.optional(
    UpdateBackendAuthVerificationMessageConfig,
  ).pipe(T.JsonName("verificationMessage")),
}) {}
export class UpdateBackendAuthResourceConfig extends S.Class<UpdateBackendAuthResourceConfig>(
  "UpdateBackendAuthResourceConfig",
)({
  AuthResources: S.String.pipe(T.JsonName("authResources")),
  IdentityPoolConfigs: S.optional(UpdateBackendAuthIdentityPoolConfig).pipe(
    T.JsonName("identityPoolConfigs"),
  ),
  Service: S.String.pipe(T.JsonName("service")),
  UserPoolConfigs: UpdateBackendAuthUserPoolConfig.pipe(
    T.JsonName("userPoolConfigs"),
  ),
}) {}
export class CreateBackendAPIRequest extends S.Class<CreateBackendAPIRequest>(
  "CreateBackendAPIRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.JsonName("backendEnvironmentName")),
    ResourceConfig: BackendAPIResourceConfig.pipe(T.JsonName("resourceConfig")),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/backend/{AppId}/api" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBackendStorageResponse extends S.Class<CreateBackendStorageResponse>(
  "CreateBackendStorageResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class UpdateBackendAuthRequest extends S.Class<UpdateBackendAuthRequest>(
  "UpdateBackendAuthRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.HttpLabel()),
    ResourceConfig: UpdateBackendAuthResourceConfig.pipe(
      T.JsonName("resourceConfig"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
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
) {}
export class CreateBackendAPIResponse extends S.Class<CreateBackendAPIResponse>(
  "CreateBackendAPIResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class UpdateBackendAuthResponse extends S.Class<UpdateBackendAuthResponse>(
  "UpdateBackendAuthResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class CreateBackendAuthRequest extends S.Class<CreateBackendAuthRequest>(
  "CreateBackendAuthRequest",
)(
  {
    AppId: S.String.pipe(T.HttpLabel()),
    BackendEnvironmentName: S.String.pipe(T.JsonName("backendEnvironmentName")),
    ResourceConfig: CreateBackendAuthResourceConfig.pipe(
      T.JsonName("resourceConfig"),
    ),
    ResourceName: S.String.pipe(T.JsonName("resourceName")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/backend/{AppId}/auth" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBackendAuthResponse extends S.Class<CreateBackendAuthResponse>(
  "CreateBackendAuthResponse",
)({
  AppId: S.optional(S.String).pipe(T.JsonName("appId")),
  BackendEnvironmentName: S.optional(S.String).pipe(
    T.JsonName("backendEnvironmentName"),
  ),
  Error: S.optional(S.String).pipe(T.JsonName("error")),
  JobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  Operation: S.optional(S.String).pipe(T.JsonName("operation")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class GatewayTimeoutException extends S.TaggedError<GatewayTimeoutException>()(
  "GatewayTimeoutException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}

//# Operations
/**
 * Removes an existing environment from your Amplify project.
 */
export const deleteBackend = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBackendAPI = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBackendAuth = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBackendStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBackendStorageRequest,
    output: DeleteBackendStorageResponse,
    errors: [
      BadRequestException,
      GatewayTimeoutException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes the challenge token based on the given appId and sessionId.
 */
export const deleteToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const generateBackendAPIModels = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GenerateBackendAPIModelsRequest,
    output: GenerateBackendAPIModelsResponse,
    errors: [
      BadRequestException,
      GatewayTimeoutException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Provides project-level details for your Amplify UI project.
 */
export const getBackend = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBackendAPI = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBackendAPIModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBackendAuth = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBackendJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importBackendAuth = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importBackendStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ImportBackendStorageRequest,
    output: ImportBackendStorageResponse,
    errors: [
      BadRequestException,
      GatewayTimeoutException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Removes all backend environments from your Amplify project.
 */
export const removeAllBackends = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeBackendConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBackendAPI = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBackendJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * This operation clones an existing backend.
 */
export const cloneBackend = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * This operation creates a backend for an Amplify app. Backends are automatically created at the time of app creation.
 */
export const createBackend = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBackendConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets details for a backend storage resource.
 */
export const getBackendStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBackendJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listS3Buckets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBackendConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBackendStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateBackendStorageRequest,
    output: UpdateBackendStorageResponse,
    errors: [
      BadRequestException,
      GatewayTimeoutException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates a backend storage resource.
 */
export const createBackendStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateBackendStorageRequest,
    output: CreateBackendStorageResponse,
    errors: [
      BadRequestException,
      GatewayTimeoutException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates a new backend API resource.
 */
export const createBackendAPI = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBackendAuth = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new backend authentication resource.
 */
export const createBackendAuth = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBackendAuthRequest,
  output: CreateBackendAuthResponse,
  errors: [
    BadRequestException,
    GatewayTimeoutException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
