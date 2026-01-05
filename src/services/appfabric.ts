import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "AppFabric",
  serviceShapeName: "FabricFrontEndService",
});
const auth = T.AwsAuthSigv4({ name: "appfabric" });
const ver = T.ServiceVersion("2023-05-19");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://appfabric-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://appfabric-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://appfabric.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://appfabric.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export const TaskIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BatchGetUserAccessTasksRequest extends S.Class<BatchGetUserAccessTasksRequest>(
  "BatchGetUserAccessTasksRequest",
)(
  { appBundleIdentifier: S.String, taskIdList: TaskIdList },
  T.all(
    T.Http({ method: "POST", uri: "/useraccess/batchget" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateAppBundleRequest extends S.Class<CreateAppBundleRequest>(
  "CreateAppBundleRequest",
)(
  {
    clientToken: S.optional(S.String),
    customerManagedKeyIdentifier: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/appbundles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateIngestionRequest extends S.Class<CreateIngestionRequest>(
  "CreateIngestionRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    app: S.String,
    tenantId: S.String,
    ingestionType: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/appbundles/{appBundleIdentifier}/ingestions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppAuthorizationRequest extends S.Class<DeleteAppAuthorizationRequest>(
  "DeleteAppAuthorizationRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    appAuthorizationIdentifier: S.String.pipe(
      T.HttpLabel("appAuthorizationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/appbundles/{appBundleIdentifier}/appauthorizations/{appAuthorizationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppAuthorizationResponse extends S.Class<DeleteAppAuthorizationResponse>(
  "DeleteAppAuthorizationResponse",
)({}) {}
export class DeleteAppBundleRequest extends S.Class<DeleteAppBundleRequest>(
  "DeleteAppBundleRequest",
)(
  { appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/appbundles/{appBundleIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppBundleResponse extends S.Class<DeleteAppBundleResponse>(
  "DeleteAppBundleResponse",
)({}) {}
export class DeleteIngestionRequest extends S.Class<DeleteIngestionRequest>(
  "DeleteIngestionRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIngestionResponse extends S.Class<DeleteIngestionResponse>(
  "DeleteIngestionResponse",
)({}) {}
export class DeleteIngestionDestinationRequest extends S.Class<DeleteIngestionDestinationRequest>(
  "DeleteIngestionDestinationRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    ingestionDestinationIdentifier: S.String.pipe(
      T.HttpLabel("ingestionDestinationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/ingestiondestinations/{ingestionDestinationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIngestionDestinationResponse extends S.Class<DeleteIngestionDestinationResponse>(
  "DeleteIngestionDestinationResponse",
)({}) {}
export class GetAppAuthorizationRequest extends S.Class<GetAppAuthorizationRequest>(
  "GetAppAuthorizationRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    appAuthorizationIdentifier: S.String.pipe(
      T.HttpLabel("appAuthorizationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/appbundles/{appBundleIdentifier}/appauthorizations/{appAuthorizationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAppBundleRequest extends S.Class<GetAppBundleRequest>(
  "GetAppBundleRequest",
)(
  { appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/appbundles/{appBundleIdentifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIngestionRequest extends S.Class<GetIngestionRequest>(
  "GetIngestionRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIngestionDestinationRequest extends S.Class<GetIngestionDestinationRequest>(
  "GetIngestionDestinationRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    ingestionDestinationIdentifier: S.String.pipe(
      T.HttpLabel("ingestionDestinationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/ingestiondestinations/{ingestionDestinationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppAuthorizationsRequest extends S.Class<ListAppAuthorizationsRequest>(
  "ListAppAuthorizationsRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/appbundles/{appBundleIdentifier}/appauthorizations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppBundlesRequest extends S.Class<ListAppBundlesRequest>(
  "ListAppBundlesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/appbundles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIngestionDestinationsRequest extends S.Class<ListIngestionDestinationsRequest>(
  "ListIngestionDestinationsRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/ingestiondestinations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIngestionsRequest extends S.Class<ListIngestionsRequest>(
  "ListIngestionsRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/appbundles/{appBundleIdentifier}/ingestions",
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartIngestionRequest extends S.Class<StartIngestionRequest>(
  "StartIngestionRequest",
)(
  {
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartIngestionResponse extends S.Class<StartIngestionResponse>(
  "StartIngestionResponse",
)({}) {}
export class StartUserAccessTasksRequest extends S.Class<StartUserAccessTasksRequest>(
  "StartUserAccessTasksRequest",
)(
  { appBundleIdentifier: S.String, email: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/useraccess/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopIngestionRequest extends S.Class<StopIngestionRequest>(
  "StopIngestionRequest",
)(
  {
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopIngestionResponse extends S.Class<StopIngestionResponse>(
  "StopIngestionResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export class Oauth2Credential extends S.Class<Oauth2Credential>(
  "Oauth2Credential",
)({ clientId: S.String, clientSecret: S.String }) {}
export class ApiKeyCredential extends S.Class<ApiKeyCredential>(
  "ApiKeyCredential",
)({ apiKey: S.String }) {}
export const Credential = S.Union(
  S.Struct({ oauth2Credential: Oauth2Credential }),
  S.Struct({ apiKeyCredential: ApiKeyCredential }),
);
export class Tenant extends S.Class<Tenant>("Tenant")({
  tenantIdentifier: S.String,
  tenantDisplayName: S.String,
}) {}
export class UpdateAppAuthorizationRequest extends S.Class<UpdateAppAuthorizationRequest>(
  "UpdateAppAuthorizationRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    appAuthorizationIdentifier: S.String.pipe(
      T.HttpLabel("appAuthorizationIdentifier"),
    ),
    credential: S.optional(Credential),
    tenant: S.optional(Tenant),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/appbundles/{appBundleIdentifier}/appauthorizations/{appAuthorizationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3Bucket extends S.Class<S3Bucket>("S3Bucket")({
  bucketName: S.String,
  prefix: S.optional(S.String),
}) {}
export class FirehoseStream extends S.Class<FirehoseStream>("FirehoseStream")({
  streamName: S.String,
}) {}
export const Destination = S.Union(
  S.Struct({ s3Bucket: S3Bucket }),
  S.Struct({ firehoseStream: FirehoseStream }),
);
export class AuditLogDestinationConfiguration extends S.Class<AuditLogDestinationConfiguration>(
  "AuditLogDestinationConfiguration",
)({ destination: Destination }) {}
export const DestinationConfiguration = S.Union(
  S.Struct({ auditLog: AuditLogDestinationConfiguration }),
);
export class UpdateIngestionDestinationRequest extends S.Class<UpdateIngestionDestinationRequest>(
  "UpdateIngestionDestinationRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    ingestionDestinationIdentifier: S.String.pipe(
      T.HttpLabel("ingestionDestinationIdentifier"),
    ),
    destinationConfiguration: DestinationConfiguration,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/ingestiondestinations/{ingestionDestinationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AuthRequest extends S.Class<AuthRequest>("AuthRequest")({
  redirectUri: S.String,
  code: S.String,
}) {}
export class ConnectAppAuthorizationRequest extends S.Class<ConnectAppAuthorizationRequest>(
  "ConnectAppAuthorizationRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    appAuthorizationIdentifier: S.String.pipe(
      T.HttpLabel("appAuthorizationIdentifier"),
    ),
    authRequest: S.optional(AuthRequest),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/appbundles/{appBundleIdentifier}/appauthorizations/{appAuthorizationIdentifier}/connect",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AppBundle extends S.Class<AppBundle>("AppBundle")({
  arn: S.String,
  customerManagedKeyArn: S.optional(S.String),
}) {}
export class GetAppBundleResponse extends S.Class<GetAppBundleResponse>(
  "GetAppBundleResponse",
)({ appBundle: AppBundle }) {}
export class Ingestion extends S.Class<Ingestion>("Ingestion")({
  arn: S.String,
  appBundleArn: S.String,
  app: S.String,
  tenantId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  state: S.String,
  ingestionType: S.String,
}) {}
export class GetIngestionResponse extends S.Class<GetIngestionResponse>(
  "GetIngestionResponse",
)({ ingestion: Ingestion }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class AppAuthorization extends S.Class<AppAuthorization>(
  "AppAuthorization",
)({
  appAuthorizationArn: S.String,
  appBundleArn: S.String,
  app: S.String,
  tenant: Tenant,
  authType: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  persona: S.optional(S.String),
  authUrl: S.optional(S.String),
}) {}
export class UpdateAppAuthorizationResponse extends S.Class<UpdateAppAuthorizationResponse>(
  "UpdateAppAuthorizationResponse",
)({ appAuthorization: AppAuthorization }) {}
export class AuditLogProcessingConfiguration extends S.Class<AuditLogProcessingConfiguration>(
  "AuditLogProcessingConfiguration",
)({ schema: S.String, format: S.String }) {}
export const ProcessingConfiguration = S.Union(
  S.Struct({ auditLog: AuditLogProcessingConfiguration }),
);
export class IngestionDestination extends S.Class<IngestionDestination>(
  "IngestionDestination",
)({
  arn: S.String,
  ingestionArn: S.String,
  processingConfiguration: ProcessingConfiguration,
  destinationConfiguration: DestinationConfiguration,
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateIngestionDestinationResponse extends S.Class<UpdateIngestionDestinationResponse>(
  "UpdateIngestionDestinationResponse",
)({ ingestionDestination: IngestionDestination }) {}
export class AppAuthorizationSummary extends S.Class<AppAuthorizationSummary>(
  "AppAuthorizationSummary",
)({
  appAuthorizationArn: S.String,
  appBundleArn: S.String,
  app: S.String,
  tenant: Tenant,
  status: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const AppAuthorizationSummaryList = S.Array(AppAuthorizationSummary);
export class AppBundleSummary extends S.Class<AppBundleSummary>(
  "AppBundleSummary",
)({ arn: S.String }) {}
export const AppBundleSummaryList = S.Array(AppBundleSummary);
export class IngestionDestinationSummary extends S.Class<IngestionDestinationSummary>(
  "IngestionDestinationSummary",
)({ arn: S.String }) {}
export const IngestionDestinationList = S.Array(IngestionDestinationSummary);
export class IngestionSummary extends S.Class<IngestionSummary>(
  "IngestionSummary",
)({ arn: S.String, app: S.String, tenantId: S.String, state: S.String }) {}
export const IngestionList = S.Array(IngestionSummary);
export class TaskError extends S.Class<TaskError>("TaskError")({
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export class UserAccessTaskItem extends S.Class<UserAccessTaskItem>(
  "UserAccessTaskItem",
)({
  app: S.String,
  tenantId: S.String,
  taskId: S.optional(S.String),
  error: S.optional(TaskError),
}) {}
export const UserAccessTasksList = S.Array(UserAccessTaskItem);
export class ConnectAppAuthorizationResponse extends S.Class<ConnectAppAuthorizationResponse>(
  "ConnectAppAuthorizationResponse",
)({ appAuthorizationSummary: AppAuthorizationSummary }) {}
export class CreateAppAuthorizationRequest extends S.Class<CreateAppAuthorizationRequest>(
  "CreateAppAuthorizationRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    app: S.String,
    credential: Credential,
    tenant: Tenant,
    authType: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/appbundles/{appBundleIdentifier}/appauthorizations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAppBundleResponse extends S.Class<CreateAppBundleResponse>(
  "CreateAppBundleResponse",
)({ appBundle: AppBundle }) {}
export class CreateIngestionResponse extends S.Class<CreateIngestionResponse>(
  "CreateIngestionResponse",
)({ ingestion: Ingestion }) {}
export class GetAppAuthorizationResponse extends S.Class<GetAppAuthorizationResponse>(
  "GetAppAuthorizationResponse",
)({ appAuthorization: AppAuthorization }) {}
export class GetIngestionDestinationResponse extends S.Class<GetIngestionDestinationResponse>(
  "GetIngestionDestinationResponse",
)({ ingestionDestination: IngestionDestination }) {}
export class ListAppAuthorizationsResponse extends S.Class<ListAppAuthorizationsResponse>(
  "ListAppAuthorizationsResponse",
)({
  appAuthorizationSummaryList: AppAuthorizationSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListAppBundlesResponse extends S.Class<ListAppBundlesResponse>(
  "ListAppBundlesResponse",
)({
  appBundleSummaryList: AppBundleSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListIngestionDestinationsResponse extends S.Class<ListIngestionDestinationsResponse>(
  "ListIngestionDestinationsResponse",
)({
  ingestionDestinations: IngestionDestinationList,
  nextToken: S.optional(S.String),
}) {}
export class ListIngestionsResponse extends S.Class<ListIngestionsResponse>(
  "ListIngestionsResponse",
)({ ingestions: IngestionList, nextToken: S.optional(S.String) }) {}
export class StartUserAccessTasksResponse extends S.Class<StartUserAccessTasksResponse>(
  "StartUserAccessTasksResponse",
)({ userAccessTasksList: S.optional(UserAccessTasksList) }) {}
export class UserAccessResultItem extends S.Class<UserAccessResultItem>(
  "UserAccessResultItem",
)({
  app: S.optional(S.String),
  tenantId: S.optional(S.String),
  tenantDisplayName: S.optional(S.String),
  taskId: S.optional(S.String),
  resultStatus: S.optional(S.String),
  email: S.optional(S.String),
  userId: S.optional(S.String),
  userFullName: S.optional(S.String),
  userFirstName: S.optional(S.String),
  userLastName: S.optional(S.String),
  userStatus: S.optional(S.String),
  taskError: S.optional(TaskError),
}) {}
export const UserAccessResultsList = S.Array(UserAccessResultItem);
export class BatchGetUserAccessTasksResponse extends S.Class<BatchGetUserAccessTasksResponse>(
  "BatchGetUserAccessTasksResponse",
)({ userAccessResultsList: S.optional(UserAccessResultsList) }) {}
export class CreateAppAuthorizationResponse extends S.Class<CreateAppAuthorizationResponse>(
  "CreateAppAuthorizationResponse",
)({ appAuthorization: AppAuthorization }) {}
export class CreateIngestionDestinationRequest extends S.Class<CreateIngestionDestinationRequest>(
  "CreateIngestionDestinationRequest",
)(
  {
    appBundleIdentifier: S.String.pipe(T.HttpLabel("appBundleIdentifier")),
    ingestionIdentifier: S.String.pipe(T.HttpLabel("ingestionIdentifier")),
    processingConfiguration: ProcessingConfiguration,
    destinationConfiguration: DestinationConfiguration,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/appbundles/{appBundleIdentifier}/ingestions/{ingestionIdentifier}/ingestiondestinations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class CreateIngestionDestinationResponse extends S.Class<CreateIngestionDestinationResponse>(
  "CreateIngestionDestinationResponse",
)({ ingestionDestination: IngestionDestination }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Returns a list of app bundles.
 */
export const listAppBundles = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAppBundlesRequest,
    output: ListAppBundlesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "appBundleSummaryList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns information about an app authorization.
 */
export const getAppAuthorization = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppAuthorizationRequest,
  output: GetAppAuthorizationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about an ingestion destination.
 */
export const getIngestionDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIngestionDestinationRequest,
    output: GetIngestionDestinationResponse,
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
 * Returns a list of all app authorizations configured for an app bundle.
 */
export const listAppAuthorizations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAppAuthorizationsRequest,
    output: ListAppAuthorizationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "appAuthorizationSummaryList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of all ingestion destinations configured for an ingestion.
 */
export const listIngestionDestinations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListIngestionDestinationsRequest,
    output: ListIngestionDestinationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "ingestionDestinations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of all ingestions configured for an app bundle.
 */
export const listIngestions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListIngestionsRequest,
    output: ListIngestionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "ingestions",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Starts the tasks to search user access status for a specific email address.
 *
 * The tasks are stopped when the user access status data is found. The tasks are
 * terminated when the API calls to the application time out.
 */
export const startUserAccessTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartUserAccessTasksRequest,
    output: StartUserAccessTasksResponse,
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
 * Returns information about an app bundle.
 */
export const getAppBundle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppBundleRequest,
  output: GetAppBundleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about an ingestion.
 */
export const getIngestion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIngestionRequest,
  output: GetIngestionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an app authorization within an app bundle, which allows AppFabric to connect to an
 * application.
 *
 * If the app authorization was in a `connected` state, updating the app
 * authorization will set it back to a `PendingConnect` state.
 */
export const updateAppAuthorization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAppAuthorizationRequest,
    output: UpdateAppAuthorizationResponse,
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
 * Deletes an ingestion. You must stop (disable) the ingestion and you must delete all
 * associated ingestion destinations before you can delete an app ingestion.
 */
export const deleteIngestion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIngestionRequest,
  output: DeleteIngestionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an ingestion destination.
 *
 * This deletes the association between an ingestion and it's destination. It doesn't
 * delete previously ingested data or the storage destination, such as the Amazon S3
 * bucket where the data is delivered. If the ingestion destination is deleted while the
 * associated ingestion is enabled, the ingestion will fail and is eventually disabled.
 */
export const deleteIngestionDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIngestionDestinationRequest,
    output: DeleteIngestionDestinationResponse,
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
 * Assigns one or more tags (key-value pairs) to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag or tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Establishes a connection between Amazon Web Services AppFabric and an application, which allows AppFabric to
 * call the APIs of the application.
 */
export const connectAppAuthorization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ConnectAppAuthorizationRequest,
    output: ConnectAppAuthorizationResponse,
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
 * Starts (enables) an ingestion, which collects data from an application.
 */
export const startIngestion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartIngestionRequest,
  output: StartIngestionResponse,
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
 * Stops (disables) an ingestion.
 */
export const stopIngestion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopIngestionRequest,
  output: StopIngestionResponse,
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
 * Gets user access details in a batch request.
 *
 * This action polls data from the tasks that are kicked off by the
 * `StartUserAccessTasks` action.
 */
export const batchGetUserAccessTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetUserAccessTasksRequest,
    output: BatchGetUserAccessTasksResponse,
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
 * Deletes an app bundle. You must delete all associated app authorizations before you can
 * delete an app bundle.
 */
export const deleteAppBundle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppBundleRequest,
  output: DeleteAppBundleResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an app authorization. You must delete the associated ingestion before you can
 * delete an app authorization.
 */
export const deleteAppAuthorization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAppAuthorizationRequest,
    output: DeleteAppAuthorizationResponse,
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
 * Creates an app bundle to collect data from an application using AppFabric.
 */
export const createAppBundle = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppBundleRequest,
  output: CreateAppBundleResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a data ingestion for an application.
 */
export const createIngestion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIngestionRequest,
  output: CreateIngestionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an ingestion destination, which specifies how an application's ingested data is
 * processed by Amazon Web Services AppFabric and where it's delivered.
 */
export const updateIngestionDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateIngestionDestinationRequest,
    output: UpdateIngestionDestinationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an app authorization within an app bundle, which allows AppFabric to connect to an
 * application.
 */
export const createAppAuthorization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAppAuthorizationRequest,
    output: CreateAppAuthorizationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an ingestion destination, which specifies how an application's ingested data is
 * processed by Amazon Web Services AppFabric and where it's delivered.
 */
export const createIngestionDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateIngestionDestinationRequest,
    output: CreateIngestionDestinationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
