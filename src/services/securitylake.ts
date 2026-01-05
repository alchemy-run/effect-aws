import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "SecurityLake",
  serviceShapeName: "SecurityLake",
});
const auth = T.AwsAuthSigv4({ name: "securitylake" });
const ver = T.ServiceVersion("2018-05-10");
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
                                url: "https://securitylake-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://securitylake-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://securitylake.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://securitylake.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteDataLakeExceptionSubscriptionRequest extends S.Class<DeleteDataLakeExceptionSubscriptionRequest>(
  "DeleteDataLakeExceptionSubscriptionRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/datalake/exceptions/subscription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataLakeExceptionSubscriptionResponse extends S.Class<DeleteDataLakeExceptionSubscriptionResponse>(
  "DeleteDataLakeExceptionSubscriptionResponse",
)({}) {}
export class DeregisterDataLakeDelegatedAdministratorRequest extends S.Class<DeregisterDataLakeDelegatedAdministratorRequest>(
  "DeregisterDataLakeDelegatedAdministratorRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/datalake/delegate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterDataLakeDelegatedAdministratorResponse extends S.Class<DeregisterDataLakeDelegatedAdministratorResponse>(
  "DeregisterDataLakeDelegatedAdministratorResponse",
)({}) {}
export class GetDataLakeExceptionSubscriptionRequest extends S.Class<GetDataLakeExceptionSubscriptionRequest>(
  "GetDataLakeExceptionSubscriptionRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/v1/datalake/exceptions/subscription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataLakeOrganizationConfigurationRequest extends S.Class<GetDataLakeOrganizationConfigurationRequest>(
  "GetDataLakeOrganizationConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/v1/datalake/organization/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const RegionList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const OcsfEventClassList = S.Array(S.String);
export const AccountList = S.Array(S.String);
export const AccessTypeList = S.Array(S.String);
export class CreateDataLakeExceptionSubscriptionRequest extends S.Class<CreateDataLakeExceptionSubscriptionRequest>(
  "CreateDataLakeExceptionSubscriptionRequest",
)(
  {
    subscriptionProtocol: S.String,
    notificationEndpoint: S.String,
    exceptionTimeToLive: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/exceptions/subscription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataLakeExceptionSubscriptionResponse extends S.Class<CreateDataLakeExceptionSubscriptionResponse>(
  "CreateDataLakeExceptionSubscriptionResponse",
)({}) {}
export class GetDataLakeExceptionSubscriptionResponse extends S.Class<GetDataLakeExceptionSubscriptionResponse>(
  "GetDataLakeExceptionSubscriptionResponse",
)({
  subscriptionProtocol: S.optional(S.String),
  notificationEndpoint: S.optional(S.String),
  exceptionTimeToLive: S.optional(S.Number),
}) {}
export class ListDataLakeExceptionsRequest extends S.Class<ListDataLakeExceptionsRequest>(
  "ListDataLakeExceptionsRequest",
)(
  {
    regions: S.optional(RegionList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/exceptions" }),
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
    T.Http({ method: "GET", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterDataLakeDelegatedAdministratorRequest extends S.Class<RegisterDataLakeDelegatedAdministratorRequest>(
  "RegisterDataLakeDelegatedAdministratorRequest",
)(
  { accountId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/delegate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterDataLakeDelegatedAdministratorResponse extends S.Class<RegisterDataLakeDelegatedAdministratorResponse>(
  "RegisterDataLakeDelegatedAdministratorResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
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
)({}) {}
export class UpdateDataLakeExceptionSubscriptionRequest extends S.Class<UpdateDataLakeExceptionSubscriptionRequest>(
  "UpdateDataLakeExceptionSubscriptionRequest",
)(
  {
    subscriptionProtocol: S.String,
    notificationEndpoint: S.String,
    exceptionTimeToLive: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/datalake/exceptions/subscription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataLakeExceptionSubscriptionResponse extends S.Class<UpdateDataLakeExceptionSubscriptionResponse>(
  "UpdateDataLakeExceptionSubscriptionResponse",
)({}) {}
export class AwsLogSourceConfiguration extends S.Class<AwsLogSourceConfiguration>(
  "AwsLogSourceConfiguration",
)({
  accounts: S.optional(AccountList),
  regions: RegionList,
  sourceName: S.String,
  sourceVersion: S.optional(S.String),
}) {}
export const AwsLogSourceConfigurationList = S.Array(AwsLogSourceConfiguration);
export class DeleteAwsLogSourceRequest extends S.Class<DeleteAwsLogSourceRequest>(
  "DeleteAwsLogSourceRequest",
)(
  { sources: AwsLogSourceConfigurationList },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/logsources/aws/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomLogSourceRequest extends S.Class<DeleteCustomLogSourceRequest>(
  "DeleteCustomLogSourceRequest",
)(
  {
    sourceName: S.String.pipe(T.HttpLabel("sourceName")),
    sourceVersion: S.optional(S.String).pipe(T.HttpQuery("sourceVersion")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/datalake/logsources/custom/{sourceName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomLogSourceResponse extends S.Class<DeleteCustomLogSourceResponse>(
  "DeleteCustomLogSourceResponse",
)({}) {}
export class DeleteDataLakeRequest extends S.Class<DeleteDataLakeRequest>(
  "DeleteDataLakeRequest",
)(
  { regions: RegionList },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataLakeResponse extends S.Class<DeleteDataLakeResponse>(
  "DeleteDataLakeResponse",
)({}) {}
export class AwsLogSourceResource extends S.Class<AwsLogSourceResource>(
  "AwsLogSourceResource",
)({ sourceName: S.optional(S.String), sourceVersion: S.optional(S.String) }) {}
export const AwsLogSourceResourceList = S.Array(AwsLogSourceResource);
export class DataLakeAutoEnableNewAccountConfiguration extends S.Class<DataLakeAutoEnableNewAccountConfiguration>(
  "DataLakeAutoEnableNewAccountConfiguration",
)({ region: S.String, sources: AwsLogSourceResourceList }) {}
export const DataLakeAutoEnableNewAccountConfigurationList = S.Array(
  DataLakeAutoEnableNewAccountConfiguration,
);
export class DeleteDataLakeOrganizationConfigurationRequest extends S.Class<DeleteDataLakeOrganizationConfigurationRequest>(
  "DeleteDataLakeOrganizationConfigurationRequest",
)(
  {
    autoEnableNewAccount: S.optional(
      DataLakeAutoEnableNewAccountConfigurationList,
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/datalake/organization/configuration/delete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataLakeOrganizationConfigurationResponse extends S.Class<DeleteDataLakeOrganizationConfigurationResponse>(
  "DeleteDataLakeOrganizationConfigurationResponse",
)({}) {}
export class GetDataLakeOrganizationConfigurationResponse extends S.Class<GetDataLakeOrganizationConfigurationResponse>(
  "GetDataLakeOrganizationConfigurationResponse",
)({
  autoEnableNewAccount: S.optional(
    DataLakeAutoEnableNewAccountConfigurationList,
  ),
}) {}
export class GetDataLakeSourcesRequest extends S.Class<GetDataLakeSourcesRequest>(
  "GetDataLakeSourcesRequest",
)(
  {
    accounts: S.optional(AccountList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/sources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataLakesRequest extends S.Class<ListDataLakesRequest>(
  "ListDataLakesRequest",
)(
  { regions: S.optional(RegionList).pipe(T.HttpQuery("regions")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/datalakes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DataLakeEncryptionConfiguration extends S.Class<DataLakeEncryptionConfiguration>(
  "DataLakeEncryptionConfiguration",
)({ kmsKeyId: S.optional(S.String) }) {}
export class DataLakeLifecycleExpiration extends S.Class<DataLakeLifecycleExpiration>(
  "DataLakeLifecycleExpiration",
)({ days: S.optional(S.Number) }) {}
export class DataLakeLifecycleTransition extends S.Class<DataLakeLifecycleTransition>(
  "DataLakeLifecycleTransition",
)({ storageClass: S.optional(S.String), days: S.optional(S.Number) }) {}
export const DataLakeLifecycleTransitionList = S.Array(
  DataLakeLifecycleTransition,
);
export class DataLakeLifecycleConfiguration extends S.Class<DataLakeLifecycleConfiguration>(
  "DataLakeLifecycleConfiguration",
)({
  expiration: S.optional(DataLakeLifecycleExpiration),
  transitions: S.optional(DataLakeLifecycleTransitionList),
}) {}
export class DataLakeReplicationConfiguration extends S.Class<DataLakeReplicationConfiguration>(
  "DataLakeReplicationConfiguration",
)({ regions: S.optional(RegionList), roleArn: S.optional(S.String) }) {}
export class DataLakeConfiguration extends S.Class<DataLakeConfiguration>(
  "DataLakeConfiguration",
)({
  region: S.String,
  encryptionConfiguration: S.optional(DataLakeEncryptionConfiguration),
  lifecycleConfiguration: S.optional(DataLakeLifecycleConfiguration),
  replicationConfiguration: S.optional(DataLakeReplicationConfiguration),
}) {}
export const DataLakeConfigurationList = S.Array(DataLakeConfiguration);
export class UpdateDataLakeRequest extends S.Class<UpdateDataLakeRequest>(
  "UpdateDataLakeRequest",
)(
  {
    configurations: DataLakeConfigurationList,
    metaStoreManagerRoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/datalake" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSubscriberRequest extends S.Class<GetSubscriberRequest>(
  "GetSubscriberRequest",
)(
  { subscriberId: S.String.pipe(T.HttpLabel("subscriberId")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/subscribers/{subscriberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AwsIdentity extends S.Class<AwsIdentity>("AwsIdentity")({
  principal: S.String,
  externalId: S.String,
}) {}
export class CustomLogSourceProvider extends S.Class<CustomLogSourceProvider>(
  "CustomLogSourceProvider",
)({ roleArn: S.optional(S.String), location: S.optional(S.String) }) {}
export class CustomLogSourceAttributes extends S.Class<CustomLogSourceAttributes>(
  "CustomLogSourceAttributes",
)({
  crawlerArn: S.optional(S.String),
  databaseArn: S.optional(S.String),
  tableArn: S.optional(S.String),
}) {}
export class CustomLogSourceResource extends S.Class<CustomLogSourceResource>(
  "CustomLogSourceResource",
)({
  sourceName: S.optional(S.String),
  sourceVersion: S.optional(S.String),
  provider: S.optional(CustomLogSourceProvider),
  attributes: S.optional(CustomLogSourceAttributes),
}) {}
export const LogSourceResource = S.Union(
  S.Struct({ awsLogSource: AwsLogSourceResource }),
  S.Struct({ customLogSource: CustomLogSourceResource }),
);
export const LogSourceResourceList = S.Array(LogSourceResource);
export class UpdateSubscriberRequest extends S.Class<UpdateSubscriberRequest>(
  "UpdateSubscriberRequest",
)(
  {
    subscriberId: S.String.pipe(T.HttpLabel("subscriberId")),
    subscriberIdentity: S.optional(AwsIdentity),
    subscriberName: S.optional(S.String),
    subscriberDescription: S.optional(S.String),
    sources: S.optional(LogSourceResourceList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/subscribers/{subscriberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSubscriberRequest extends S.Class<DeleteSubscriberRequest>(
  "DeleteSubscriberRequest",
)(
  { subscriberId: S.String.pipe(T.HttpLabel("subscriberId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/subscribers/{subscriberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSubscriberResponse extends S.Class<DeleteSubscriberResponse>(
  "DeleteSubscriberResponse",
)({}) {}
export class ListSubscribersRequest extends S.Class<ListSubscribersRequest>(
  "ListSubscribersRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/subscribers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSubscriberNotificationRequest extends S.Class<DeleteSubscriberNotificationRequest>(
  "DeleteSubscriberNotificationRequest",
)(
  { subscriberId: S.String.pipe(T.HttpLabel("subscriberId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/subscribers/{subscriberId}/notification",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSubscriberNotificationResponse extends S.Class<DeleteSubscriberNotificationResponse>(
  "DeleteSubscriberNotificationResponse",
)({}) {}
export class SqsNotificationConfiguration extends S.Class<SqsNotificationConfiguration>(
  "SqsNotificationConfiguration",
)({}) {}
export class HttpsNotificationConfiguration extends S.Class<HttpsNotificationConfiguration>(
  "HttpsNotificationConfiguration",
)({
  endpoint: S.String,
  authorizationApiKeyName: S.optional(S.String),
  authorizationApiKeyValue: S.optional(S.String),
  httpMethod: S.optional(S.String),
  targetRoleArn: S.String,
}) {}
export const NotificationConfiguration = S.Union(
  S.Struct({ sqsNotificationConfiguration: SqsNotificationConfiguration }),
  S.Struct({ httpsNotificationConfiguration: HttpsNotificationConfiguration }),
);
export class UpdateSubscriberNotificationRequest extends S.Class<UpdateSubscriberNotificationRequest>(
  "UpdateSubscriberNotificationRequest",
)(
  {
    subscriberId: S.String.pipe(T.HttpLabel("subscriberId")),
    configuration: NotificationConfiguration,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/subscribers/{subscriberId}/notification",
    }),
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
export class SubscriberResource extends S.Class<SubscriberResource>(
  "SubscriberResource",
)({
  subscriberId: S.String,
  subscriberArn: S.String,
  subscriberIdentity: AwsIdentity,
  subscriberName: S.String,
  subscriberDescription: S.optional(S.String),
  sources: LogSourceResourceList,
  accessTypes: S.optional(AccessTypeList),
  roleArn: S.optional(S.String),
  s3BucketArn: S.optional(S.String),
  subscriberEndpoint: S.optional(S.String),
  subscriberStatus: S.optional(S.String),
  resourceShareArn: S.optional(S.String),
  resourceShareName: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const SubscriberResourceList = S.Array(SubscriberResource);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagList },
  T.all(
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
)({}) {}
export class CreateAwsLogSourceRequest extends S.Class<CreateAwsLogSourceRequest>(
  "CreateAwsLogSourceRequest",
)(
  { sources: AwsLogSourceConfigurationList },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/logsources/aws" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAwsLogSourceResponse extends S.Class<DeleteAwsLogSourceResponse>(
  "DeleteAwsLogSourceResponse",
)({ failed: S.optional(AccountList) }) {}
export class DataLakeUpdateException extends S.Class<DataLakeUpdateException>(
  "DataLakeUpdateException",
)({ reason: S.optional(S.String), code: S.optional(S.String) }) {}
export class DataLakeUpdateStatus extends S.Class<DataLakeUpdateStatus>(
  "DataLakeUpdateStatus",
)({
  requestId: S.optional(S.String),
  status: S.optional(S.String),
  exception: S.optional(DataLakeUpdateException),
}) {}
export class DataLakeResource extends S.Class<DataLakeResource>(
  "DataLakeResource",
)({
  dataLakeArn: S.String,
  region: S.String,
  s3BucketArn: S.optional(S.String),
  encryptionConfiguration: S.optional(DataLakeEncryptionConfiguration),
  lifecycleConfiguration: S.optional(DataLakeLifecycleConfiguration),
  replicationConfiguration: S.optional(DataLakeReplicationConfiguration),
  createStatus: S.optional(S.String),
  updateStatus: S.optional(DataLakeUpdateStatus),
}) {}
export const DataLakeResourceList = S.Array(DataLakeResource);
export class UpdateDataLakeResponse extends S.Class<UpdateDataLakeResponse>(
  "UpdateDataLakeResponse",
)({ dataLakes: S.optional(DataLakeResourceList) }) {}
export class CreateSubscriberRequest extends S.Class<CreateSubscriberRequest>(
  "CreateSubscriberRequest",
)(
  {
    subscriberIdentity: AwsIdentity,
    subscriberName: S.String,
    subscriberDescription: S.optional(S.String),
    sources: LogSourceResourceList,
    accessTypes: S.optional(AccessTypeList),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/subscribers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSubscriberResponse extends S.Class<UpdateSubscriberResponse>(
  "UpdateSubscriberResponse",
)({ subscriber: S.optional(SubscriberResource) }) {}
export class ListSubscribersResponse extends S.Class<ListSubscribersResponse>(
  "ListSubscribersResponse",
)({
  subscribers: S.optional(SubscriberResourceList),
  nextToken: S.optional(S.String),
}) {}
export class UpdateSubscriberNotificationResponse extends S.Class<UpdateSubscriberNotificationResponse>(
  "UpdateSubscriberNotificationResponse",
)({ subscriberEndpoint: S.optional(S.String) }) {}
export class CustomLogSourceCrawlerConfiguration extends S.Class<CustomLogSourceCrawlerConfiguration>(
  "CustomLogSourceCrawlerConfiguration",
)({ roleArn: S.String }) {}
export class DataLakeException extends S.Class<DataLakeException>(
  "DataLakeException",
)({
  region: S.optional(S.String),
  exception: S.optional(S.String),
  remediation: S.optional(S.String),
  timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const DataLakeExceptionList = S.Array(DataLakeException);
export class CustomLogSourceConfiguration extends S.Class<CustomLogSourceConfiguration>(
  "CustomLogSourceConfiguration",
)({
  crawlerConfiguration: CustomLogSourceCrawlerConfiguration,
  providerIdentity: AwsIdentity,
}) {}
export class ListDataLakeExceptionsResponse extends S.Class<ListDataLakeExceptionsResponse>(
  "ListDataLakeExceptionsResponse",
)({
  exceptions: S.optional(DataLakeExceptionList),
  nextToken: S.optional(S.String),
}) {}
export class CreateAwsLogSourceResponse extends S.Class<CreateAwsLogSourceResponse>(
  "CreateAwsLogSourceResponse",
)({ failed: S.optional(AccountList) }) {}
export class CreateCustomLogSourceRequest extends S.Class<CreateCustomLogSourceRequest>(
  "CreateCustomLogSourceRequest",
)(
  {
    sourceName: S.String,
    sourceVersion: S.optional(S.String),
    eventClasses: S.optional(OcsfEventClassList),
    configuration: CustomLogSourceConfiguration,
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/logsources/custom" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataLakeOrganizationConfigurationRequest extends S.Class<CreateDataLakeOrganizationConfigurationRequest>(
  "CreateDataLakeOrganizationConfigurationRequest",
)(
  {
    autoEnableNewAccount: S.optional(
      DataLakeAutoEnableNewAccountConfigurationList,
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/organization/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataLakeOrganizationConfigurationResponse extends S.Class<CreateDataLakeOrganizationConfigurationResponse>(
  "CreateDataLakeOrganizationConfigurationResponse",
)({}) {}
export class CreateSubscriberResponse extends S.Class<CreateSubscriberResponse>(
  "CreateSubscriberResponse",
)({ subscriber: S.optional(SubscriberResource) }) {}
export class GetSubscriberResponse extends S.Class<GetSubscriberResponse>(
  "GetSubscriberResponse",
)({ subscriber: S.optional(SubscriberResource) }) {}
export class CreateSubscriberNotificationRequest extends S.Class<CreateSubscriberNotificationRequest>(
  "CreateSubscriberNotificationRequest",
)(
  {
    subscriberId: S.String.pipe(T.HttpLabel("subscriberId")),
    configuration: NotificationConfiguration,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/subscribers/{subscriberId}/notification",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DataLakeSourceStatus extends S.Class<DataLakeSourceStatus>(
  "DataLakeSourceStatus",
)({ resource: S.optional(S.String), status: S.optional(S.String) }) {}
export const DataLakeSourceStatusList = S.Array(DataLakeSourceStatus);
export class DataLakeSource extends S.Class<DataLakeSource>("DataLakeSource")({
  account: S.optional(S.String),
  sourceName: S.optional(S.String),
  eventClasses: S.optional(OcsfEventClassList),
  sourceStatuses: S.optional(DataLakeSourceStatusList),
}) {}
export const DataLakeSourceList = S.Array(DataLakeSource);
export class CreateCustomLogSourceResponse extends S.Class<CreateCustomLogSourceResponse>(
  "CreateCustomLogSourceResponse",
)({ source: S.optional(CustomLogSourceResource) }) {}
export class CreateDataLakeRequest extends S.Class<CreateDataLakeRequest>(
  "CreateDataLakeRequest",
)(
  {
    configurations: DataLakeConfigurationList,
    metaStoreManagerRoleArn: S.String,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataLakeSourcesResponse extends S.Class<GetDataLakeSourcesResponse>(
  "GetDataLakeSourcesResponse",
)({
  dataLakeArn: S.optional(S.String),
  dataLakeSources: S.optional(DataLakeSourceList),
  nextToken: S.optional(S.String),
}) {}
export class ListLogSourcesRequest extends S.Class<ListLogSourcesRequest>(
  "ListLogSourcesRequest",
)(
  {
    accounts: S.optional(AccountList),
    regions: S.optional(RegionList),
    sources: S.optional(LogSourceResourceList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/logsources/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSubscriberNotificationResponse extends S.Class<CreateSubscriberNotificationResponse>(
  "CreateSubscriberNotificationResponse",
)({ subscriberEndpoint: S.optional(S.String) }) {}
export class CreateDataLakeResponse extends S.Class<CreateDataLakeResponse>(
  "CreateDataLakeResponse",
)({ dataLakes: S.optional(DataLakeResourceList) }) {}
export class ListDataLakesResponse extends S.Class<ListDataLakesResponse>(
  "ListDataLakesResponse",
)({ dataLakes: S.optional(DataLakeResourceList) }) {}
export class LogSource extends S.Class<LogSource>("LogSource")({
  account: S.optional(S.String),
  region: S.optional(S.String),
  sources: S.optional(LogSourceResourceList),
}) {}
export const LogSourceList = S.Array(LogSource);
export class ListLogSourcesResponse extends S.Class<ListLogSourcesResponse>(
  "ListLogSourcesResponse",
)({ sources: S.optional(LogSourceList), nextToken: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String), errorCode: S.optional(S.String) },
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceName: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    resourceName: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Deletes the specified notification subscription in Amazon Security Lake for the organization
 * you specify.
 */
export const deleteDataLakeExceptionSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDataLakeExceptionSubscriptionRequest,
    output: DeleteDataLakeExceptionSubscriptionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves the log sources.
 */
export const listLogSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLogSourcesRequest,
  output: ListLogSourcesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Initializes an Amazon Security Lake instance with the provided (or default) configuration. You
 * can enable Security Lake in Amazon Web Services Regions with customized settings before enabling
 * log collection in Regions. To specify particular Regions, configure these Regions using the
 * `configurations` parameter. If you have already enabled Security Lake in a Region
 * when you call this command, the command will update the Region if you provide new
 * configuration parameters. If you have not already enabled Security Lake in the Region when you
 * call this API, it will set up the data lake in the Region with the specified
 * configurations.
 *
 * When you enable Security Lake, it starts ingesting security data after the
 * `CreateAwsLogSource` call and after you create subscribers using the `CreateSubscriber` API. This includes ingesting security data from
 * sources, storing data, and making data accessible to subscribers. Security Lake also enables
 * all the existing settings and resources that it stores or maintains for your Amazon Web Services account in the current Region, including security log and event data. For
 * more information, see the Amazon Security Lake User
 * Guide.
 */
export const createDataLake = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataLakeRequest,
  output: CreateDataLakeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the Amazon Security Lake configuration object for the specified Amazon Web Services Regions. You can use this operation to determine whether
 * Security Lake is enabled for a Region.
 */
export const listDataLakes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataLakesRequest,
  output: ListDataLakesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds a third-party custom source in Amazon Security Lake, from the Amazon Web Services Region
 * where you want to create a custom source. Security Lake can collect logs and events from
 * third-party custom sources. After creating the appropriate IAM role to
 * invoke Glue crawler, use this API to add a custom source name in Security Lake. This
 * operation creates a partition in the Amazon S3 bucket for Security Lake as the target
 * location for log files from the custom source. In addition, this operation also creates an
 * associated Glue table and an Glue crawler.
 */
export const createCustomLogSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCustomLogSourceRequest,
    output: CreateCustomLogSourceResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves a snapshot of the current Region, including whether Amazon Security Lake is enabled
 * for those accounts and which sources Security Lake is collecting data from.
 */
export const getDataLakeSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataLakeSourcesRequest,
  output: GetDataLakeSourcesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Notifies the subscriber when new data is written to the data lake for the sources that
 * the subscriber consumes in Security Lake. You can create only one subscriber notification per
 * subscriber.
 */
export const createSubscriberNotification =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateSubscriberNotificationRequest,
    output: CreateSubscriberNotificationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Lists the Amazon Security Lake exceptions that you can use to find the source of problems and
 * fix them.
 */
export const listDataLakeExceptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDataLakeExceptionsRequest,
    output: ListDataLakeExceptionsResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Adds a natively supported Amazon Web Services service as an Amazon Security Lake source. Enables
 * source types for member accounts in required Amazon Web Services Regions, based on the
 * parameters you specify. You can choose any source type in any Region for either accounts
 * that are part of a trusted organization or standalone accounts. Once you add an Amazon Web Services service as a source, Security Lake starts collecting logs and events from it.
 *
 * You can use this API only to enable natively supported Amazon Web Services services as a
 * source. Use `CreateCustomLogSource` to enable data collection from a custom
 * source.
 */
export const createAwsLogSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAwsLogSourceRequest,
  output: CreateAwsLogSourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Automatically enables Amazon Security Lake for new member accounts in your organization.
 * Security Lake is not automatically enabled for any existing member accounts in your
 * organization.
 *
 * This operation merges the new data lake organization configuration with the existing configuration for Security Lake in your organization. If you want to create a new data lake organization configuration, you must delete the existing one using DeleteDataLakeOrganizationConfiguration.
 */
export const createDataLakeOrganizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDataLakeOrganizationConfigurationRequest,
    output: CreateDataLakeOrganizationConfigurationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Creates a subscriber for accounts that are already enabled in Amazon Security Lake. You can
 * create a subscriber with access to data in the current Amazon Web Services Region.
 */
export const createSubscriber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubscriberRequest,
  output: CreateSubscriberResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the subscription information for the specified subscription ID. You can get
 * information about a specific subscriber.
 */
export const getSubscriber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSubscriberRequest,
  output: GetSubscriberResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the tags (keys and values) that are associated with an Amazon Security Lake resource: a subscriber, or the data lake configuration for
 * your Amazon Web Services account in a particular Amazon Web Services Region.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds or updates one or more tags that are associated with an Amazon Security Lake resource: a subscriber, or the data lake configuration for your
 * Amazon Web Services account in a particular Amazon Web Services Region. A *tag* is a label that you can define and associate with
 * Amazon Web Services resources. Each tag consists of a required *tag key* and an associated *tag value*. A
 * *tag key* is a general label that acts as a category for a more specific tag value. A *tag value* acts as a
 * descriptor for a tag key. Tags can help you identify, categorize, and manage resources in different ways, such as by owner, environment, or other
 * criteria. For more information, see
 * Tagging Amazon Security Lake resources in the
 * *Amazon Security Lake User Guide*.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes a natively supported Amazon Web Services service as an Amazon Security Lake source. You
 * can remove a source for one or more Regions. When you remove the source, Security Lake stops
 * collecting data from that source in the specified Regions and accounts, and subscribers can
 * no longer consume new data from the source. However, subscribers can still consume data
 * that Security Lake collected from the source before removal.
 *
 * You can choose any source type in any Amazon Web Services Region for either accounts that
 * are part of a trusted organization or standalone accounts.
 */
export const deleteAwsLogSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAwsLogSourceRequest,
  output: DeleteAwsLogSourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * You can use `UpdateDataLake` to specify where to store your security data, how it should
 * be encrypted at rest and for how long. You can add a Rollup
 * Region to consolidate data from multiple Amazon Web Services Regions, replace
 * default encryption (SSE-S3) with Customer Manged Key,
 * or specify transition and expiration actions through storage Lifecycle management. The `UpdateDataLake` API works as an "upsert" operation that performs an insert if the specified item or record does not exist, or an update if it
 * already exists. Security Lake securely stores your data at rest using Amazon Web Services encryption solutions. For more details, see Data protection in Amazon Security Lake.
 *
 * For example, omitting the key `encryptionConfiguration` from a Region that is
 * included in an update call that currently uses KMS will leave that Region's KMS key in
 * place, but specifying `encryptionConfiguration: {kmsKeyId: 'S3_MANAGED_KEY'}`
 * for that same Region will reset the key to `S3-managed`.
 *
 * For more details about lifecycle management and how to update retention settings for one or more Regions after enabling Security Lake, see the Amazon Security Lake User Guide.
 */
export const updateDataLake = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataLakeRequest,
  output: UpdateDataLakeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an existing subscription for the given Amazon Security Lake account ID. You can update
 * a subscriber by changing the sources that the subscriber consumes data from.
 */
export const updateSubscriber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSubscriberRequest,
  output: UpdateSubscriberResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all subscribers for the specific Amazon Security Lake account ID. You can retrieve a list
 * of subscriptions associated with a specific organization or Amazon Web Services account.
 */
export const listSubscribers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSubscribersRequest,
  output: ListSubscribersResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an existing notification method for the subscription (SQS or HTTPs endpoint) or
 * switches the notification subscription endpoint for a subscriber.
 */
export const updateSubscriberNotification =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSubscriberNotificationRequest,
    output: UpdateSubscriberNotificationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves the protocol and endpoint that were provided when subscribing to Amazon SNS topics for exception notifications.
 */
export const getDataLakeExceptionSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDataLakeExceptionSubscriptionRequest,
    output: GetDataLakeExceptionSubscriptionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Designates the Amazon Security Lake delegated administrator account for the organization. This
 * API can only be called by the organization management account. The organization management
 * account cannot be the delegated administrator account.
 */
export const registerDataLakeDelegatedAdministrator =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RegisterDataLakeDelegatedAdministratorRequest,
    output: RegisterDataLakeDelegatedAdministratorResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Removes one or more tags (keys and values) from an Amazon Security Lake resource: a subscriber, or the data lake configuration for your
 * Amazon Web Services account in a particular Amazon Web Services Region.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the specified notification subscription in Amazon Security Lake for the organization
 * you specify.
 */
export const updateDataLakeExceptionSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDataLakeExceptionSubscriptionRequest,
    output: UpdateDataLakeExceptionSubscriptionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Removes a custom log source from Amazon Security Lake, to stop sending data from the custom
 * source to Security Lake.
 */
export const deleteCustomLogSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCustomLogSourceRequest,
    output: DeleteCustomLogSourceResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * When you disable Amazon Security Lake from your account, Security Lake is disabled in all Amazon Web Services Regions and it stops collecting data from your sources. Also, this API
 * automatically takes steps to remove the account from Security Lake. However, Security Lake retains
 * all of your existing settings and the resources that it created in your Amazon Web Services
 * account in the current Amazon Web Services Region.
 *
 * The `DeleteDataLake` operation does not delete the data that is stored in
 * your Amazon S3 bucket, which is owned by your Amazon Web Services account. For more
 * information, see the Amazon Security Lake User
 * Guide.
 */
export const deleteDataLake = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataLakeRequest,
  output: DeleteDataLakeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Turns off automatic enablement of Amazon Security Lake for member accounts that are added to an organization in Organizations. Only the delegated
 * Security Lake administrator for an organization can perform this operation. If the delegated Security Lake administrator performs this operation, new member
 * accounts won't automatically contribute data to the data lake.
 */
export const deleteDataLakeOrganizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDataLakeOrganizationConfigurationRequest,
    output: DeleteDataLakeOrganizationConfigurationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves the configuration that will be automatically set up for accounts added to the
 * organization after the organization has onboarded to Amazon Security Lake. This API does not take
 * input parameters.
 */
export const getDataLakeOrganizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDataLakeOrganizationConfigurationRequest,
    output: GetDataLakeOrganizationConfigurationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes the subscription permission and all notification settings for accounts that are
 * already enabled in Amazon Security Lake. When you run `DeleteSubscriber`, the
 * subscriber will no longer consume data from Security Lake and the subscriber is removed. This
 * operation deletes the subscriber and removes access to data in the current Amazon Web Services Region.
 */
export const deleteSubscriber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubscriberRequest,
  output: DeleteSubscriberResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified subscription notification in Amazon Security Lake for the organization
 * you specify.
 */
export const deleteSubscriberNotification =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteSubscriberNotificationRequest,
    output: DeleteSubscriberNotificationResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes the Amazon Security Lake delegated administrator account for the organization. This API
 * can only be called by the organization management account. The organization management
 * account cannot be the delegated administrator account.
 */
export const deregisterDataLakeDelegatedAdministrator =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeregisterDataLakeDelegatedAdministratorRequest,
    output: DeregisterDataLakeDelegatedAdministratorResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Creates the specified notification subscription in Amazon Security Lake for the organization
 * you specify. The notification subscription is created for exceptions that cannot be resolved by Security Lake automatically.
 */
export const createDataLakeExceptionSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDataLakeExceptionSubscriptionRequest,
    output: CreateDataLakeExceptionSubscriptionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
