import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Chime SDK Identity",
  serviceShapeName: "ChimeIdentityService",
});
const auth = T.AwsAuthSigv4({ name: "chime" });
const ver = T.ServiceVersion("2021-04-20");
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
                        url: "https://identity-chime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://identity-chime-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://identity-chime.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://identity-chime.{Region}.{PartitionResult#dnsSuffix}",
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
export class CreateAppInstanceAdminRequest extends S.Class<CreateAppInstanceAdminRequest>(
  "CreateAppInstanceAdminRequest",
)(
  {
    AppInstanceAdminArn: S.String,
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/app-instances/{AppInstanceArn}/admins" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppInstanceRequest extends S.Class<DeleteAppInstanceRequest>(
  "DeleteAppInstanceRequest",
)(
  { AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/app-instances/{AppInstanceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppInstanceResponse extends S.Class<DeleteAppInstanceResponse>(
  "DeleteAppInstanceResponse",
)({}) {}
export class DeleteAppInstanceAdminRequest extends S.Class<DeleteAppInstanceAdminRequest>(
  "DeleteAppInstanceAdminRequest",
)(
  {
    AppInstanceAdminArn: S.String.pipe(T.HttpLabel("AppInstanceAdminArn")),
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/app-instances/{AppInstanceArn}/admins/{AppInstanceAdminArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppInstanceAdminResponse extends S.Class<DeleteAppInstanceAdminResponse>(
  "DeleteAppInstanceAdminResponse",
)({}) {}
export class DeleteAppInstanceBotRequest extends S.Class<DeleteAppInstanceBotRequest>(
  "DeleteAppInstanceBotRequest",
)(
  { AppInstanceBotArn: S.String.pipe(T.HttpLabel("AppInstanceBotArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/app-instance-bots/{AppInstanceBotArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppInstanceBotResponse extends S.Class<DeleteAppInstanceBotResponse>(
  "DeleteAppInstanceBotResponse",
)({}) {}
export class DeleteAppInstanceUserRequest extends S.Class<DeleteAppInstanceUserRequest>(
  "DeleteAppInstanceUserRequest",
)(
  { AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/app-instance-users/{AppInstanceUserArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppInstanceUserResponse extends S.Class<DeleteAppInstanceUserResponse>(
  "DeleteAppInstanceUserResponse",
)({}) {}
export class DeregisterAppInstanceUserEndpointRequest extends S.Class<DeregisterAppInstanceUserEndpointRequest>(
  "DeregisterAppInstanceUserEndpointRequest",
)(
  {
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    EndpointId: S.String.pipe(T.HttpLabel("EndpointId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/app-instance-users/{AppInstanceUserArn}/endpoints/{EndpointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterAppInstanceUserEndpointResponse extends S.Class<DeregisterAppInstanceUserEndpointResponse>(
  "DeregisterAppInstanceUserEndpointResponse",
)({}) {}
export class DescribeAppInstanceRequest extends S.Class<DescribeAppInstanceRequest>(
  "DescribeAppInstanceRequest",
)(
  { AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/app-instances/{AppInstanceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppInstanceAdminRequest extends S.Class<DescribeAppInstanceAdminRequest>(
  "DescribeAppInstanceAdminRequest",
)(
  {
    AppInstanceAdminArn: S.String.pipe(T.HttpLabel("AppInstanceAdminArn")),
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app-instances/{AppInstanceArn}/admins/{AppInstanceAdminArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppInstanceBotRequest extends S.Class<DescribeAppInstanceBotRequest>(
  "DescribeAppInstanceBotRequest",
)(
  { AppInstanceBotArn: S.String.pipe(T.HttpLabel("AppInstanceBotArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/app-instance-bots/{AppInstanceBotArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppInstanceUserRequest extends S.Class<DescribeAppInstanceUserRequest>(
  "DescribeAppInstanceUserRequest",
)(
  { AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/app-instance-users/{AppInstanceUserArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppInstanceUserEndpointRequest extends S.Class<DescribeAppInstanceUserEndpointRequest>(
  "DescribeAppInstanceUserEndpointRequest",
)(
  {
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    EndpointId: S.String.pipe(T.HttpLabel("EndpointId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app-instance-users/{AppInstanceUserArn}/endpoints/{EndpointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAppInstanceRetentionSettingsRequest extends S.Class<GetAppInstanceRetentionSettingsRequest>(
  "GetAppInstanceRetentionSettingsRequest",
)(
  { AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app-instances/{AppInstanceArn}/retention-settings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppInstanceAdminsRequest extends S.Class<ListAppInstanceAdminsRequest>(
  "ListAppInstanceAdminsRequest",
)(
  {
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/app-instances/{AppInstanceArn}/admins" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppInstanceBotsRequest extends S.Class<ListAppInstanceBotsRequest>(
  "ListAppInstanceBotsRequest",
)(
  {
    AppInstanceArn: S.String.pipe(T.HttpQuery("app-instance-arn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/app-instance-bots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppInstancesRequest extends S.Class<ListAppInstancesRequest>(
  "ListAppInstancesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/app-instances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppInstanceUserEndpointsRequest extends S.Class<ListAppInstanceUserEndpointsRequest>(
  "ListAppInstanceUserEndpointsRequest",
)(
  {
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/app-instance-users/{AppInstanceUserArn}/endpoints",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppInstanceUsersRequest extends S.Class<ListAppInstanceUsersRequest>(
  "ListAppInstanceUsersRequest",
)(
  {
    AppInstanceArn: S.String.pipe(T.HttpQuery("app-instance-arn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/app-instance-users" }),
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
  { ResourceARN: S.String.pipe(T.HttpQuery("arn")) },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class ExpirationSettings extends S.Class<ExpirationSettings>(
  "ExpirationSettings",
)({ ExpirationDays: S.Number, ExpirationCriterion: S.String }) {}
export class PutAppInstanceUserExpirationSettingsRequest extends S.Class<PutAppInstanceUserExpirationSettingsRequest>(
  "PutAppInstanceUserExpirationSettingsRequest",
)(
  {
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    ExpirationSettings: S.optional(ExpirationSettings),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/app-instance-users/{AppInstanceUserArn}/expiration-settings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/tags?operation=tag-resource" }),
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
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/tags?operation=untag-resource" }),
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
export class UpdateAppInstanceRequest extends S.Class<UpdateAppInstanceRequest>(
  "UpdateAppInstanceRequest",
)(
  {
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
    Name: S.String,
    Metadata: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/app-instances/{AppInstanceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokedBy extends S.Class<InvokedBy>("InvokedBy")({
  StandardMessages: S.String,
  TargetedMessages: S.String,
}) {}
export class LexConfiguration extends S.Class<LexConfiguration>(
  "LexConfiguration",
)({
  RespondsTo: S.optional(S.String),
  InvokedBy: S.optional(InvokedBy),
  LexBotAliasArn: S.String,
  LocaleId: S.String,
  WelcomeIntent: S.optional(S.String),
}) {}
export class Configuration extends S.Class<Configuration>("Configuration")({
  Lex: LexConfiguration,
}) {}
export class UpdateAppInstanceBotRequest extends S.Class<UpdateAppInstanceBotRequest>(
  "UpdateAppInstanceBotRequest",
)(
  {
    AppInstanceBotArn: S.String.pipe(T.HttpLabel("AppInstanceBotArn")),
    Name: S.String,
    Metadata: S.String,
    Configuration: S.optional(Configuration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/app-instance-bots/{AppInstanceBotArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAppInstanceUserRequest extends S.Class<UpdateAppInstanceUserRequest>(
  "UpdateAppInstanceUserRequest",
)(
  {
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    Name: S.String,
    Metadata: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/app-instance-users/{AppInstanceUserArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAppInstanceUserEndpointRequest extends S.Class<UpdateAppInstanceUserEndpointRequest>(
  "UpdateAppInstanceUserEndpointRequest",
)(
  {
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    EndpointId: S.String.pipe(T.HttpLabel("EndpointId")),
    Name: S.optional(S.String),
    AllowMessages: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/app-instance-users/{AppInstanceUserArn}/endpoints/{EndpointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EndpointAttributes extends S.Class<EndpointAttributes>(
  "EndpointAttributes",
)({ DeviceToken: S.String, VoipDeviceToken: S.optional(S.String) }) {}
export class CreateAppInstanceRequest extends S.Class<CreateAppInstanceRequest>(
  "CreateAppInstanceRequest",
)(
  {
    Name: S.String,
    Metadata: S.optional(S.String),
    ClientRequestToken: S.String,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/app-instances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAppInstanceUserRequest extends S.Class<CreateAppInstanceUserRequest>(
  "CreateAppInstanceUserRequest",
)(
  {
    AppInstanceArn: S.String,
    AppInstanceUserId: S.String,
    Name: S.String,
    Metadata: S.optional(S.String),
    ClientRequestToken: S.String,
    Tags: S.optional(TagList),
    ExpirationSettings: S.optional(ExpirationSettings),
  },
  T.all(
    T.Http({ method: "POST", uri: "/app-instance-users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ChannelRetentionSettings extends S.Class<ChannelRetentionSettings>(
  "ChannelRetentionSettings",
)({ RetentionDays: S.optional(S.Number) }) {}
export class AppInstanceRetentionSettings extends S.Class<AppInstanceRetentionSettings>(
  "AppInstanceRetentionSettings",
)({ ChannelRetentionSettings: S.optional(ChannelRetentionSettings) }) {}
export class GetAppInstanceRetentionSettingsResponse extends S.Class<GetAppInstanceRetentionSettingsResponse>(
  "GetAppInstanceRetentionSettingsResponse",
)({
  AppInstanceRetentionSettings: S.optional(AppInstanceRetentionSettings),
  InitiateDeletionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class PutAppInstanceUserExpirationSettingsResponse extends S.Class<PutAppInstanceUserExpirationSettingsResponse>(
  "PutAppInstanceUserExpirationSettingsResponse",
)({
  AppInstanceUserArn: S.optional(S.String),
  ExpirationSettings: S.optional(ExpirationSettings),
}) {}
export class RegisterAppInstanceUserEndpointRequest extends S.Class<RegisterAppInstanceUserEndpointRequest>(
  "RegisterAppInstanceUserEndpointRequest",
)(
  {
    AppInstanceUserArn: S.String.pipe(T.HttpLabel("AppInstanceUserArn")),
    Name: S.optional(S.String),
    Type: S.String,
    ResourceArn: S.String,
    EndpointAttributes: EndpointAttributes,
    ClientRequestToken: S.String,
    AllowMessages: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/app-instance-users/{AppInstanceUserArn}/endpoints",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAppInstanceResponse extends S.Class<UpdateAppInstanceResponse>(
  "UpdateAppInstanceResponse",
)({ AppInstanceArn: S.optional(S.String) }) {}
export class UpdateAppInstanceBotResponse extends S.Class<UpdateAppInstanceBotResponse>(
  "UpdateAppInstanceBotResponse",
)({ AppInstanceBotArn: S.optional(S.String) }) {}
export class UpdateAppInstanceUserResponse extends S.Class<UpdateAppInstanceUserResponse>(
  "UpdateAppInstanceUserResponse",
)({ AppInstanceUserArn: S.optional(S.String) }) {}
export class UpdateAppInstanceUserEndpointResponse extends S.Class<UpdateAppInstanceUserEndpointResponse>(
  "UpdateAppInstanceUserEndpointResponse",
)({
  AppInstanceUserArn: S.optional(S.String),
  EndpointId: S.optional(S.String),
}) {}
export class Identity extends S.Class<Identity>("Identity")({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class AppInstance extends S.Class<AppInstance>("AppInstance")({
  AppInstanceArn: S.optional(S.String),
  Name: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Metadata: S.optional(S.String),
}) {}
export class AppInstanceAdmin extends S.Class<AppInstanceAdmin>(
  "AppInstanceAdmin",
)({
  Admin: S.optional(Identity),
  AppInstanceArn: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class AppInstanceBot extends S.Class<AppInstanceBot>("AppInstanceBot")({
  AppInstanceBotArn: S.optional(S.String),
  Name: S.optional(S.String),
  Configuration: S.optional(Configuration),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Metadata: S.optional(S.String),
}) {}
export class AppInstanceUser extends S.Class<AppInstanceUser>(
  "AppInstanceUser",
)({
  AppInstanceUserArn: S.optional(S.String),
  Name: S.optional(S.String),
  Metadata: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ExpirationSettings: S.optional(ExpirationSettings),
}) {}
export class AppInstanceAdminSummary extends S.Class<AppInstanceAdminSummary>(
  "AppInstanceAdminSummary",
)({ Admin: S.optional(Identity) }) {}
export const AppInstanceAdminList = S.Array(AppInstanceAdminSummary);
export class AppInstanceBotSummary extends S.Class<AppInstanceBotSummary>(
  "AppInstanceBotSummary",
)({
  AppInstanceBotArn: S.optional(S.String),
  Name: S.optional(S.String),
  Metadata: S.optional(S.String),
}) {}
export const AppInstanceBotList = S.Array(AppInstanceBotSummary);
export class AppInstanceSummary extends S.Class<AppInstanceSummary>(
  "AppInstanceSummary",
)({
  AppInstanceArn: S.optional(S.String),
  Name: S.optional(S.String),
  Metadata: S.optional(S.String),
}) {}
export const AppInstanceList = S.Array(AppInstanceSummary);
export class EndpointState extends S.Class<EndpointState>("EndpointState")({
  Status: S.String,
  StatusReason: S.optional(S.String),
}) {}
export class AppInstanceUserEndpointSummary extends S.Class<AppInstanceUserEndpointSummary>(
  "AppInstanceUserEndpointSummary",
)({
  AppInstanceUserArn: S.optional(S.String),
  EndpointId: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  AllowMessages: S.optional(S.String),
  EndpointState: S.optional(EndpointState),
}) {}
export const AppInstanceUserEndpointSummaryList = S.Array(
  AppInstanceUserEndpointSummary,
);
export class AppInstanceUserSummary extends S.Class<AppInstanceUserSummary>(
  "AppInstanceUserSummary",
)({
  AppInstanceUserArn: S.optional(S.String),
  Name: S.optional(S.String),
  Metadata: S.optional(S.String),
}) {}
export const AppInstanceUserList = S.Array(AppInstanceUserSummary);
export class CreateAppInstanceResponse extends S.Class<CreateAppInstanceResponse>(
  "CreateAppInstanceResponse",
)({ AppInstanceArn: S.optional(S.String) }) {}
export class CreateAppInstanceAdminResponse extends S.Class<CreateAppInstanceAdminResponse>(
  "CreateAppInstanceAdminResponse",
)({
  AppInstanceAdmin: S.optional(Identity),
  AppInstanceArn: S.optional(S.String),
}) {}
export class CreateAppInstanceUserResponse extends S.Class<CreateAppInstanceUserResponse>(
  "CreateAppInstanceUserResponse",
)({ AppInstanceUserArn: S.optional(S.String) }) {}
export class DescribeAppInstanceResponse extends S.Class<DescribeAppInstanceResponse>(
  "DescribeAppInstanceResponse",
)({ AppInstance: S.optional(AppInstance) }) {}
export class DescribeAppInstanceAdminResponse extends S.Class<DescribeAppInstanceAdminResponse>(
  "DescribeAppInstanceAdminResponse",
)({ AppInstanceAdmin: S.optional(AppInstanceAdmin) }) {}
export class DescribeAppInstanceBotResponse extends S.Class<DescribeAppInstanceBotResponse>(
  "DescribeAppInstanceBotResponse",
)({ AppInstanceBot: S.optional(AppInstanceBot) }) {}
export class DescribeAppInstanceUserResponse extends S.Class<DescribeAppInstanceUserResponse>(
  "DescribeAppInstanceUserResponse",
)({ AppInstanceUser: S.optional(AppInstanceUser) }) {}
export class ListAppInstanceAdminsResponse extends S.Class<ListAppInstanceAdminsResponse>(
  "ListAppInstanceAdminsResponse",
)({
  AppInstanceArn: S.optional(S.String),
  AppInstanceAdmins: S.optional(AppInstanceAdminList),
  NextToken: S.optional(S.String),
}) {}
export class ListAppInstanceBotsResponse extends S.Class<ListAppInstanceBotsResponse>(
  "ListAppInstanceBotsResponse",
)({
  AppInstanceArn: S.optional(S.String),
  AppInstanceBots: S.optional(AppInstanceBotList),
  NextToken: S.optional(S.String),
}) {}
export class ListAppInstancesResponse extends S.Class<ListAppInstancesResponse>(
  "ListAppInstancesResponse",
)({
  AppInstances: S.optional(AppInstanceList),
  NextToken: S.optional(S.String),
}) {}
export class ListAppInstanceUserEndpointsResponse extends S.Class<ListAppInstanceUserEndpointsResponse>(
  "ListAppInstanceUserEndpointsResponse",
)({
  AppInstanceUserEndpoints: S.optional(AppInstanceUserEndpointSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListAppInstanceUsersResponse extends S.Class<ListAppInstanceUsersResponse>(
  "ListAppInstanceUsersResponse",
)({
  AppInstanceArn: S.optional(S.String),
  AppInstanceUsers: S.optional(AppInstanceUserList),
  NextToken: S.optional(S.String),
}) {}
export class PutAppInstanceRetentionSettingsRequest extends S.Class<PutAppInstanceRetentionSettingsRequest>(
  "PutAppInstanceRetentionSettingsRequest",
)(
  {
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
    AppInstanceRetentionSettings: AppInstanceRetentionSettings,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/app-instances/{AppInstanceArn}/retention-settings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterAppInstanceUserEndpointResponse extends S.Class<RegisterAppInstanceUserEndpointResponse>(
  "RegisterAppInstanceUserEndpointResponse",
)({
  AppInstanceUserArn: S.optional(S.String),
  EndpointId: S.optional(S.String),
}) {}
export class AppInstanceUserEndpoint extends S.Class<AppInstanceUserEndpoint>(
  "AppInstanceUserEndpoint",
)({
  AppInstanceUserArn: S.optional(S.String),
  EndpointId: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  EndpointAttributes: S.optional(EndpointAttributes),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AllowMessages: S.optional(S.String),
  EndpointState: S.optional(EndpointState),
}) {}
export class CreateAppInstanceBotRequest extends S.Class<CreateAppInstanceBotRequest>(
  "CreateAppInstanceBotRequest",
)(
  {
    AppInstanceArn: S.String,
    Name: S.optional(S.String),
    Metadata: S.optional(S.String),
    ClientRequestToken: S.String,
    Tags: S.optional(TagList),
    Configuration: Configuration,
  },
  T.all(
    T.Http({ method: "POST", uri: "/app-instance-bots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAppInstanceUserEndpointResponse extends S.Class<DescribeAppInstanceUserEndpointResponse>(
  "DescribeAppInstanceUserEndpointResponse",
)({ AppInstanceUserEndpoint: S.optional(AppInstanceUserEndpoint) }) {}
export class PutAppInstanceRetentionSettingsResponse extends S.Class<PutAppInstanceRetentionSettingsResponse>(
  "PutAppInstanceRetentionSettingsResponse",
)({
  AppInstanceRetentionSettings: S.optional(AppInstanceRetentionSettings),
  InitiateDeletionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class CreateAppInstanceBotResponse extends S.Class<CreateAppInstanceBotResponse>(
  "CreateAppInstanceBotResponse",
)({ AppInstanceBotArn: S.optional(S.String) }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottledClientException extends S.TaggedError<ThrottledClientException>()(
  "ThrottledClientException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class UnauthorizedClientException extends S.TaggedError<UnauthorizedClientException>()(
  "UnauthorizedClientException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns the full details of an `AppInstance`.
 */
export const describeAppInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppInstanceRequest,
  output: DescribeAppInstanceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * The `AppInstanceBot's` information.
 */
export const describeAppInstanceBot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAppInstanceBotRequest,
    output: DescribeAppInstanceBotResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      NotFoundException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Returns the full details of an `AppInstanceUserEndpoint`.
 */
export const describeAppInstanceUserEndpoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAppInstanceUserEndpointRequest,
    output: DescribeAppInstanceUserEndpointResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Sets the amount of time in days that a given `AppInstance` retains
 * data.
 */
export const putAppInstanceRetentionSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutAppInstanceRetentionSettingsRequest,
    output: PutAppInstanceRetentionSettingsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Returns a list of the administrators in the `AppInstance`.
 */
export const listAppInstanceAdmins =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAppInstanceAdminsRequest,
    output: ListAppInstanceAdminsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all `AppInstanceBots` created under a single `AppInstance`.
 */
export const listAppInstanceBots =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAppInstanceBotsRequest,
    output: ListAppInstanceBotsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Registers an endpoint under an Amazon Chime `AppInstanceUser`. The endpoint receives messages for a user. For push notifications, the endpoint is a mobile device used to receive mobile push notifications for a user.
 */
export const registerAppInstanceUserEndpoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RegisterAppInstanceUserEndpointRequest,
    output: RegisterAppInstanceUserEndpointResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Applies the specified tags to the specified Amazon Chime SDK identity resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the name and metadata of an `AppInstanceBot`.
 */
export const updateAppInstanceBot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAppInstanceBotRequest,
    output: UpdateAppInstanceBotResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Updates the details of an `AppInstanceUser`. You can update names and
 * metadata.
 */
export const updateAppInstanceUser = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAppInstanceUserRequest,
    output: UpdateAppInstanceUserResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Demotes an `AppInstanceAdmin` to an `AppInstanceUser` or
 * `AppInstanceBot`. This action
 * does not delete the user.
 */
export const deleteAppInstanceAdmin = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAppInstanceAdminRequest,
    output: DeleteAppInstanceAdminResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Deletes an `AppInstanceBot`.
 */
export const deleteAppInstanceBot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAppInstanceBotRequest,
    output: DeleteAppInstanceBotResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Deletes an `AppInstanceUser`.
 */
export const deleteAppInstanceUser = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAppInstanceUserRequest,
    output: DeleteAppInstanceUserResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Creates an Amazon Chime SDK messaging `AppInstance` under an AWS account.
 * Only SDK messaging customers use this API. `CreateAppInstance` supports
 * idempotency behavior as described in the AWS API Standard.
 *
 * identity
 */
export const createAppInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppInstanceRequest,
  output: CreateAppInstanceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Promotes an `AppInstanceUser` or `AppInstanceBot` to an
 * `AppInstanceAdmin`. The
 * promoted entity can perform the following actions.
 *
 * - `ChannelModerator` actions across all channels in the
 * `AppInstance`.
 *
 * - `DeleteChannelMessage` actions.
 *
 * Only an `AppInstanceUser` and `AppInstanceBot` can be promoted to an `AppInstanceAdmin`
 * role.
 */
export const createAppInstanceAdmin = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAppInstanceAdminRequest,
    output: CreateAppInstanceAdminResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Creates a user under an Amazon Chime `AppInstance`. The request consists of a
 * unique `appInstanceUserId` and `Name` for that user.
 */
export const createAppInstanceUser = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAppInstanceUserRequest,
    output: CreateAppInstanceUserResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Returns the full details of an `AppInstanceAdmin`.
 */
export const describeAppInstanceAdmin = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAppInstanceAdminRequest,
    output: DescribeAppInstanceAdminResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Returns the full details of an `AppInstanceUser`.
 */
export const describeAppInstanceUser = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAppInstanceUserRequest,
    output: DescribeAppInstanceUserResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
/**
 * Lists all Amazon Chime `AppInstance`s created under a single AWS
 * account.
 */
export const listAppInstances = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAppInstancesRequest,
    output: ListAppInstancesResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all the `AppInstanceUserEndpoints` created under a single `AppInstanceUser`.
 */
export const listAppInstanceUserEndpoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAppInstanceUserEndpointsRequest,
    output: ListAppInstanceUserEndpointsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * List all `AppInstanceUsers` created under a single
 * `AppInstance`.
 */
export const listAppInstanceUsers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAppInstanceUsersRequest,
    output: ListAppInstanceUsersResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Sets the number of days before the `AppInstanceUser` is automatically deleted.
 *
 * A background process deletes expired `AppInstanceUsers` within 6 hours of expiration.
 * Actual deletion times may vary.
 *
 * Expired `AppInstanceUsers` that have not yet been deleted appear as active, and you can update
 * their expiration settings. The system honors the new settings.
 */
export const putAppInstanceUserExpirationSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutAppInstanceUserExpirationSettingsRequest,
    output: PutAppInstanceUserExpirationSettingsResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Gets the retention settings for an `AppInstance`.
 */
export const getAppInstanceRetentionSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAppInstanceRetentionSettingsRequest,
    output: GetAppInstanceRetentionSettingsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Lists the tags applied to an Amazon Chime SDK identity resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deregisters an `AppInstanceUserEndpoint`.
 */
export const deregisterAppInstanceUserEndpoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeregisterAppInstanceUserEndpointRequest,
    output: DeregisterAppInstanceUserEndpointResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Removes the specified tags from the specified Amazon Chime SDK identity resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates `AppInstance` metadata.
 */
export const updateAppInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppInstanceRequest,
  output: UpdateAppInstanceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the details of an `AppInstanceUserEndpoint`. You can update the name and `AllowMessage` values.
 */
export const updateAppInstanceUserEndpoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAppInstanceUserEndpointRequest,
    output: UpdateAppInstanceUserEndpointResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }));
/**
 * Deletes an `AppInstance` and all associated data asynchronously.
 */
export const deleteAppInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppInstanceRequest,
  output: DeleteAppInstanceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a bot under an Amazon Chime `AppInstance`. The request consists of a
 * unique `Configuration` and `Name` for that bot.
 */
export const createAppInstanceBot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAppInstanceBotRequest,
    output: CreateAppInstanceBotResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      ResourceLimitExceededException,
      ServiceFailureException,
      ServiceUnavailableException,
      ThrottledClientException,
      UnauthorizedClientException,
    ],
  }),
);
