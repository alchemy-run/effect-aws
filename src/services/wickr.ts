import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Wickr",
  serviceShapeName: "WickrAdminApi",
});
const auth = T.AwsAuthSigv4({ name: "wickr" });
const ver = T.ServiceVersion("2024-02-01");
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
                                url: "https://admin.wickr-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://admin.wickr-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://admin.wickr.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://admin.wickr.{Region}.{PartitionResult#dnsSuffix}",
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
export const UserIds = S.Array(S.String);
export const Unames = S.Array(S.String);
export const AppIds = S.Array(S.String);
export class BatchDeleteUserRequest extends S.Class<BatchDeleteUserRequest>(
  "BatchDeleteUserRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    userIds: UserIds,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks/{networkId}/users/batch-delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchLookupUserUnameRequest extends S.Class<BatchLookupUserUnameRequest>(
  "BatchLookupUserUnameRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    unames: Unames,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks/{networkId}/users/uname-lookup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchReinviteUserRequest extends S.Class<BatchReinviteUserRequest>(
  "BatchReinviteUserRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    userIds: UserIds,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/networks/{networkId}/users/re-invite" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchResetDevicesForUserRequest extends S.Class<BatchResetDevicesForUserRequest>(
  "BatchResetDevicesForUserRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    userId: S.String.pipe(T.HttpLabel()),
    appIds: AppIds,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/networks/{networkId}/users/{userId}/devices",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchToggleUserSuspendStatusRequest extends S.Class<BatchToggleUserSuspendStatusRequest>(
  "BatchToggleUserSuspendStatusRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    suspend: S.Boolean.pipe(T.HttpQuery("suspend")),
    userIds: UserIds,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/networks/{networkId}/users/toggleSuspend",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBotRequest extends S.Class<CreateBotRequest>(
  "CreateBotRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    username: S.String,
    displayName: S.optional(S.String),
    groupId: S.String,
    challenge: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks/{networkId}/bots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataRetentionBotRequest extends S.Class<CreateDataRetentionBotRequest>(
  "CreateDataRetentionBotRequest",
)(
  { networkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/networks/{networkId}/data-retention-bots",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataRetentionBotChallengeRequest extends S.Class<CreateDataRetentionBotChallengeRequest>(
  "CreateDataRetentionBotChallengeRequest",
)(
  { networkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/networks/{networkId}/data-retention-bots/challenge",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNetworkRequest extends S.Class<CreateNetworkRequest>(
  "CreateNetworkRequest",
)(
  {
    networkName: S.String,
    accessLevel: S.String,
    enablePremiumFreeTrial: S.optional(S.Boolean),
    encryptionKeyArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBotRequest extends S.Class<DeleteBotRequest>(
  "DeleteBotRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    botId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/networks/{networkId}/bots/{botId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataRetentionBotRequest extends S.Class<DeleteDataRetentionBotRequest>(
  "DeleteDataRetentionBotRequest",
)(
  { networkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/networks/{networkId}/data-retention-bots",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNetworkRequest extends S.Class<DeleteNetworkRequest>(
  "DeleteNetworkRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/networks/{networkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSecurityGroupRequest extends S.Class<DeleteSecurityGroupRequest>(
  "DeleteSecurityGroupRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    groupId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/networks/{networkId}/security-groups/{groupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBotRequest extends S.Class<GetBotRequest>("GetBotRequest")(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    botId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/bots/{botId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBotsCountRequest extends S.Class<GetBotsCountRequest>(
  "GetBotsCountRequest",
)(
  { networkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/bots/count" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataRetentionBotRequest extends S.Class<GetDataRetentionBotRequest>(
  "GetDataRetentionBotRequest",
)(
  { networkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/data-retention-bots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGuestUserHistoryCountRequest extends S.Class<GetGuestUserHistoryCountRequest>(
  "GetGuestUserHistoryCountRequest",
)(
  { networkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/guest-users/count" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNetworkRequest extends S.Class<GetNetworkRequest>(
  "GetNetworkRequest",
)(
  { networkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNetworkSettingsRequest extends S.Class<GetNetworkSettingsRequest>(
  "GetNetworkSettingsRequest",
)(
  { networkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOidcInfoRequest extends S.Class<GetOidcInfoRequest>(
  "GetOidcInfoRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    clientId: S.optional(S.String).pipe(T.HttpQuery("clientId")),
    code: S.optional(S.String).pipe(T.HttpQuery("code")),
    grantType: S.optional(S.String).pipe(T.HttpQuery("grantType")),
    redirectUri: S.optional(S.String).pipe(T.HttpQuery("redirectUri")),
    url: S.optional(S.String).pipe(T.HttpQuery("url")),
    clientSecret: S.optional(S.String).pipe(T.HttpQuery("clientSecret")),
    codeVerifier: S.optional(S.String).pipe(T.HttpQuery("codeVerifier")),
    certificate: S.optional(S.String).pipe(T.HttpQuery("certificate")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/oidc" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSecurityGroupRequest extends S.Class<GetSecurityGroupRequest>(
  "GetSecurityGroupRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    groupId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/networks/{networkId}/security-groups/{groupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUserRequest extends S.Class<GetUserRequest>("GetUserRequest")(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    userId: S.String.pipe(T.HttpLabel()),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endTime"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/users/{userId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUsersCountRequest extends S.Class<GetUsersCountRequest>(
  "GetUsersCountRequest",
)(
  { networkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/users/count" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBlockedGuestUsersRequest extends S.Class<ListBlockedGuestUsersRequest>(
  "ListBlockedGuestUsersRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    username: S.optional(S.String).pipe(T.HttpQuery("username")),
    admin: S.optional(S.String).pipe(T.HttpQuery("admin")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/networks/{networkId}/guest-users/blocklist",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBotsRequest extends S.Class<ListBotsRequest>(
  "ListBotsRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
    displayName: S.optional(S.String).pipe(T.HttpQuery("displayName")),
    username: S.optional(S.String).pipe(T.HttpQuery("username")),
    status: S.optional(S.Number).pipe(T.HttpQuery("status")),
    groupId: S.optional(S.String).pipe(T.HttpQuery("groupId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/bots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDevicesForUserRequest extends S.Class<ListDevicesForUserRequest>(
  "ListDevicesForUserRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    userId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/networks/{networkId}/users/{userId}/devices",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGuestUsersRequest extends S.Class<ListGuestUsersRequest>(
  "ListGuestUsersRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    username: S.optional(S.String).pipe(T.HttpQuery("username")),
    billingPeriod: S.optional(S.String).pipe(T.HttpQuery("billingPeriod")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/guest-users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNetworksRequest extends S.Class<ListNetworksRequest>(
  "ListNetworksRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSecurityGroupsRequest extends S.Class<ListSecurityGroupsRequest>(
  "ListSecurityGroupsRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/security-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSecurityGroupUsersRequest extends S.Class<ListSecurityGroupUsersRequest>(
  "ListSecurityGroupUsersRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    groupId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/networks/{networkId}/security-groups/{groupId}/users",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUsersRequest extends S.Class<ListUsersRequest>(
  "ListUsersRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
    firstName: S.optional(S.String).pipe(T.HttpQuery("firstName")),
    lastName: S.optional(S.String).pipe(T.HttpQuery("lastName")),
    username: S.optional(S.String).pipe(T.HttpQuery("username")),
    status: S.optional(S.Number).pipe(T.HttpQuery("status")),
    groupId: S.optional(S.String).pipe(T.HttpQuery("groupId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{networkId}/users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterOidcConfigRequest extends S.Class<RegisterOidcConfigRequest>(
  "RegisterOidcConfigRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    companyId: S.String,
    customUsername: S.optional(S.String),
    extraAuthParams: S.optional(S.String),
    issuer: S.String,
    scopes: S.String,
    secret: S.optional(S.String),
    ssoTokenBufferMinutes: S.optional(S.Number),
    userId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks/{networkId}/oidc/save" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterOidcConfigTestRequest extends S.Class<RegisterOidcConfigTestRequest>(
  "RegisterOidcConfigTestRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    extraAuthParams: S.optional(S.String),
    issuer: S.String,
    scopes: S.String,
    certificate: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks/{networkId}/oidc/test" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBotRequest extends S.Class<UpdateBotRequest>(
  "UpdateBotRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    botId: S.String.pipe(T.HttpLabel()),
    displayName: S.optional(S.String),
    groupId: S.optional(S.String),
    challenge: S.optional(S.String),
    suspend: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/networks/{networkId}/bots/{botId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataRetentionRequest extends S.Class<UpdateDataRetentionRequest>(
  "UpdateDataRetentionRequest",
)(
  { networkId: S.String.pipe(T.HttpLabel()), actionType: S.String },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/networks/{networkId}/data-retention-bots",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGuestUserRequest extends S.Class<UpdateGuestUserRequest>(
  "UpdateGuestUserRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    usernameHash: S.String.pipe(T.HttpLabel()),
    block: S.Boolean,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/networks/{networkId}/guest-users/{usernameHash}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNetworkRequest extends S.Class<UpdateNetworkRequest>(
  "UpdateNetworkRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    networkName: S.String,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
    encryptionKeyArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/networks/{networkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SecurityGroupIdList = S.Array(S.String);
export const PermittedNetworksList = S.Array(S.String);
export const SecurityGroupStringList = S.Array(S.String);
export class BatchCreateUserRequestItem extends S.Class<BatchCreateUserRequestItem>(
  "BatchCreateUserRequestItem",
)({
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  securityGroupIds: SecurityGroupIdList,
  username: S.String,
  inviteCode: S.optional(S.String),
  inviteCodeTtl: S.optional(S.Number),
  codeValidation: S.optional(S.Boolean),
}) {}
export const BatchCreateUserRequestItems = S.Array(BatchCreateUserRequestItem);
export class CallingSettings extends S.Class<CallingSettings>(
  "CallingSettings",
)({
  canStart11Call: S.optional(S.Boolean),
  canVideoCall: S.optional(S.Boolean),
  forceTcpCall: S.optional(S.Boolean),
}) {}
export class PasswordRequirements extends S.Class<PasswordRequirements>(
  "PasswordRequirements",
)({
  lowercase: S.optional(S.Number),
  minLength: S.optional(S.Number),
  numbers: S.optional(S.Number),
  symbols: S.optional(S.Number),
  uppercase: S.optional(S.Number),
}) {}
export class ShredderSettings extends S.Class<ShredderSettings>(
  "ShredderSettings",
)({
  canProcessManually: S.optional(S.Boolean),
  intensity: S.optional(S.Number),
}) {}
export class WickrAwsNetworks extends S.Class<WickrAwsNetworks>(
  "WickrAwsNetworks",
)({ region: S.String, networkId: S.String }) {}
export const WickrAwsNetworksList = S.Array(WickrAwsNetworks);
export class PermittedWickrEnterpriseNetwork extends S.Class<PermittedWickrEnterpriseNetwork>(
  "PermittedWickrEnterpriseNetwork",
)({ domain: S.String, networkId: S.String }) {}
export const PermittedWickrEnterpriseNetworksList = S.Array(
  PermittedWickrEnterpriseNetwork,
);
export class SecurityGroupSettings extends S.Class<SecurityGroupSettings>(
  "SecurityGroupSettings",
)({
  alwaysReauthenticate: S.optional(S.Boolean),
  atakPackageValues: S.optional(SecurityGroupStringList),
  calling: S.optional(CallingSettings),
  checkForUpdates: S.optional(S.Boolean),
  enableAtak: S.optional(S.Boolean),
  enableCrashReports: S.optional(S.Boolean),
  enableFileDownload: S.optional(S.Boolean),
  enableGuestFederation: S.optional(S.Boolean),
  enableNotificationPreview: S.optional(S.Boolean),
  enableOpenAccessOption: S.optional(S.Boolean),
  enableRestrictedGlobalFederation: S.optional(S.Boolean),
  filesEnabled: S.optional(S.Boolean),
  forceDeviceLockout: S.optional(S.Number),
  forceOpenAccess: S.optional(S.Boolean),
  forceReadReceipts: S.optional(S.Boolean),
  globalFederation: S.optional(S.Boolean),
  isAtoEnabled: S.optional(S.Boolean),
  isLinkPreviewEnabled: S.optional(S.Boolean),
  locationAllowMaps: S.optional(S.Boolean),
  locationEnabled: S.optional(S.Boolean),
  maxAutoDownloadSize: S.optional(S.Number),
  maxBor: S.optional(S.Number),
  maxTtl: S.optional(S.Number),
  messageForwardingEnabled: S.optional(S.Boolean),
  passwordRequirements: S.optional(PasswordRequirements),
  presenceEnabled: S.optional(S.Boolean),
  quickResponses: S.optional(SecurityGroupStringList),
  showMasterRecoveryKey: S.optional(S.Boolean),
  shredder: S.optional(ShredderSettings),
  ssoMaxIdleMinutes: S.optional(S.Number),
  federationMode: S.optional(S.Number),
  lockoutThreshold: S.optional(S.Number),
  permittedNetworks: S.optional(PermittedNetworksList),
  permittedWickrAwsNetworks: S.optional(WickrAwsNetworksList),
  permittedWickrEnterpriseNetworks: S.optional(
    PermittedWickrEnterpriseNetworksList,
  ),
}) {}
export class SecurityGroup extends S.Class<SecurityGroup>("SecurityGroup")({
  activeMembers: S.Number,
  botMembers: S.Number,
  activeDirectoryGuid: S.optional(S.String),
  id: S.String,
  isDefault: S.Boolean,
  name: S.String,
  modified: S.Number,
  securityGroupSettings: SecurityGroupSettings,
}) {}
export const SecurityGroupList = S.Array(SecurityGroup);
export const StringList = S.Array(S.String);
export class UpdateUserDetails extends S.Class<UpdateUserDetails>(
  "UpdateUserDetails",
)({
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  username: S.optional(S.String),
  securityGroupIds: S.optional(SecurityGroupIdList),
  inviteCode: S.optional(S.String),
  inviteCodeTtl: S.optional(S.Number),
  codeValidation: S.optional(S.Boolean),
}) {}
export class BatchCreateUserRequest extends S.Class<BatchCreateUserRequest>(
  "BatchCreateUserRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    users: BatchCreateUserRequestItems,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks/{networkId}/users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUserSuccessResponseItem extends S.Class<BatchUserSuccessResponseItem>(
  "BatchUserSuccessResponseItem",
)({ userId: S.String }) {}
export const BatchUserSuccessResponseItems = S.Array(
  BatchUserSuccessResponseItem,
);
export class BatchUserErrorResponseItem extends S.Class<BatchUserErrorResponseItem>(
  "BatchUserErrorResponseItem",
)({
  field: S.optional(S.String),
  reason: S.optional(S.String),
  userId: S.String,
}) {}
export const BatchUserErrorResponseItems = S.Array(BatchUserErrorResponseItem);
export class BatchReinviteUserResponse extends S.Class<BatchReinviteUserResponse>(
  "BatchReinviteUserResponse",
)({
  message: S.optional(S.String),
  successful: S.optional(BatchUserSuccessResponseItems),
  failed: S.optional(BatchUserErrorResponseItems),
}) {}
export class BatchToggleUserSuspendStatusResponse extends S.Class<BatchToggleUserSuspendStatusResponse>(
  "BatchToggleUserSuspendStatusResponse",
)({
  message: S.optional(S.String),
  successful: S.optional(BatchUserSuccessResponseItems),
  failed: S.optional(BatchUserErrorResponseItems),
}) {}
export class CreateBotResponse extends S.Class<CreateBotResponse>(
  "CreateBotResponse",
)({
  message: S.optional(S.String),
  botId: S.String,
  networkId: S.optional(S.String),
  username: S.optional(S.String),
  displayName: S.optional(S.String),
  groupId: S.optional(S.String),
}) {}
export class CreateDataRetentionBotResponse extends S.Class<CreateDataRetentionBotResponse>(
  "CreateDataRetentionBotResponse",
)({ message: S.optional(S.String) }) {}
export class CreateDataRetentionBotChallengeResponse extends S.Class<CreateDataRetentionBotChallengeResponse>(
  "CreateDataRetentionBotChallengeResponse",
)({ challenge: S.String }) {}
export class CreateNetworkResponse extends S.Class<CreateNetworkResponse>(
  "CreateNetworkResponse",
)({
  networkId: S.optional(S.String),
  networkName: S.optional(S.String),
  encryptionKeyArn: S.optional(S.String),
}) {}
export class DeleteBotResponse extends S.Class<DeleteBotResponse>(
  "DeleteBotResponse",
)({ message: S.optional(S.String) }) {}
export class DeleteDataRetentionBotResponse extends S.Class<DeleteDataRetentionBotResponse>(
  "DeleteDataRetentionBotResponse",
)({ message: S.optional(S.String) }) {}
export class DeleteNetworkResponse extends S.Class<DeleteNetworkResponse>(
  "DeleteNetworkResponse",
)({ message: S.optional(S.String) }) {}
export class DeleteSecurityGroupResponse extends S.Class<DeleteSecurityGroupResponse>(
  "DeleteSecurityGroupResponse",
)({
  message: S.optional(S.String),
  networkId: S.optional(S.String),
  groupId: S.optional(S.String),
}) {}
export class GetBotResponse extends S.Class<GetBotResponse>("GetBotResponse")({
  botId: S.optional(S.String),
  displayName: S.optional(S.String),
  username: S.optional(S.String),
  uname: S.optional(S.String),
  pubkey: S.optional(S.String),
  status: S.optional(S.Number),
  groupId: S.optional(S.String),
  hasChallenge: S.optional(S.Boolean),
  suspended: S.optional(S.Boolean),
  lastLogin: S.optional(S.String),
}) {}
export class GetBotsCountResponse extends S.Class<GetBotsCountResponse>(
  "GetBotsCountResponse",
)({ pending: S.Number, active: S.Number, total: S.Number }) {}
export class GetDataRetentionBotResponse extends S.Class<GetDataRetentionBotResponse>(
  "GetDataRetentionBotResponse",
)({
  botName: S.optional(S.String),
  botExists: S.optional(S.Boolean),
  isBotActive: S.optional(S.Boolean),
  isDataRetentionBotRegistered: S.optional(S.Boolean),
  isDataRetentionServiceEnabled: S.optional(S.Boolean),
  isPubkeyMsgAcked: S.optional(S.Boolean),
}) {}
export class GetNetworkResponse extends S.Class<GetNetworkResponse>(
  "GetNetworkResponse",
)({
  networkId: S.String,
  networkName: S.String,
  accessLevel: S.String,
  awsAccountId: S.String,
  networkArn: S.String,
  standing: S.optional(S.Number),
  freeTrialExpiration: S.optional(S.String),
  migrationState: S.optional(S.Number),
  encryptionKeyArn: S.optional(S.String),
}) {}
export class GetUserResponse extends S.Class<GetUserResponse>(
  "GetUserResponse",
)({
  userId: S.String,
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  username: S.optional(S.String),
  isAdmin: S.optional(S.Boolean),
  suspended: S.optional(S.Boolean),
  status: S.optional(S.Number),
  lastActivity: S.optional(S.Number),
  lastLogin: S.optional(S.Number),
  securityGroupIds: S.optional(SecurityGroupIdList),
}) {}
export class GetUsersCountResponse extends S.Class<GetUsersCountResponse>(
  "GetUsersCountResponse",
)({
  pending: S.Number,
  active: S.Number,
  rejected: S.Number,
  remaining: S.Number,
  total: S.Number,
}) {}
export class ListSecurityGroupsResponse extends S.Class<ListSecurityGroupsResponse>(
  "ListSecurityGroupsResponse",
)({
  securityGroups: S.optional(SecurityGroupList),
  nextToken: S.optional(S.String),
}) {}
export class User extends S.Class<User>("User")({
  userId: S.optional(S.String),
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  username: S.optional(S.String),
  securityGroups: S.optional(SecurityGroupIdList),
  isAdmin: S.optional(S.Boolean),
  suspended: S.optional(S.Boolean),
  status: S.optional(S.Number),
  otpEnabled: S.optional(S.Boolean),
  scimId: S.optional(S.String),
  type: S.optional(S.String),
  cell: S.optional(S.String),
  countryCode: S.optional(S.String),
  challengeFailures: S.optional(S.Number),
  isInviteExpired: S.optional(S.Boolean),
  isUser: S.optional(S.Boolean),
  inviteCode: S.optional(S.String),
  codeValidation: S.optional(S.Boolean),
  uname: S.optional(S.String),
}) {}
export const Users = S.Array(User);
export class ListUsersResponse extends S.Class<ListUsersResponse>(
  "ListUsersResponse",
)({ nextToken: S.optional(S.String), users: S.optional(Users) }) {}
export class RegisterOidcConfigResponse extends S.Class<RegisterOidcConfigResponse>(
  "RegisterOidcConfigResponse",
)({
  applicationName: S.optional(S.String),
  clientId: S.optional(S.String),
  companyId: S.String,
  scopes: S.String,
  issuer: S.String,
  clientSecret: S.optional(S.String),
  secret: S.optional(S.String),
  redirectUrl: S.optional(S.String),
  userId: S.optional(S.String),
  customUsername: S.optional(S.String),
  caCertificate: S.optional(S.String),
  applicationId: S.optional(S.Number),
  ssoTokenBufferMinutes: S.optional(S.Number),
  extraAuthParams: S.optional(S.String),
}) {}
export class RegisterOidcConfigTestResponse extends S.Class<RegisterOidcConfigTestResponse>(
  "RegisterOidcConfigTestResponse",
)({
  tokenEndpoint: S.optional(S.String),
  userinfoEndpoint: S.optional(S.String),
  responseTypesSupported: S.optional(StringList),
  scopesSupported: S.optional(StringList),
  issuer: S.optional(S.String),
  authorizationEndpoint: S.optional(S.String),
  endSessionEndpoint: S.optional(S.String),
  logoutEndpoint: S.optional(S.String),
  grantTypesSupported: S.optional(StringList),
  revocationEndpoint: S.optional(S.String),
  tokenEndpointAuthMethodsSupported: S.optional(StringList),
  microsoftMultiRefreshToken: S.optional(S.Boolean),
}) {}
export class UpdateBotResponse extends S.Class<UpdateBotResponse>(
  "UpdateBotResponse",
)({ message: S.optional(S.String) }) {}
export class UpdateDataRetentionResponse extends S.Class<UpdateDataRetentionResponse>(
  "UpdateDataRetentionResponse",
)({ message: S.optional(S.String) }) {}
export class UpdateGuestUserResponse extends S.Class<UpdateGuestUserResponse>(
  "UpdateGuestUserResponse",
)({ message: S.optional(S.String) }) {}
export class UpdateNetworkResponse extends S.Class<UpdateNetworkResponse>(
  "UpdateNetworkResponse",
)({ message: S.optional(S.String) }) {}
export class UpdateUserRequest extends S.Class<UpdateUserRequest>(
  "UpdateUserRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    userId: S.String,
    userDetails: S.optional(UpdateUserDetails),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/networks/{networkId}/users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReadReceiptConfig extends S.Class<ReadReceiptConfig>(
  "ReadReceiptConfig",
)({ status: S.optional(S.String) }) {}
export class BatchUnameSuccessResponseItem extends S.Class<BatchUnameSuccessResponseItem>(
  "BatchUnameSuccessResponseItem",
)({ uname: S.String, username: S.String }) {}
export const BatchUnameSuccessResponseItems = S.Array(
  BatchUnameSuccessResponseItem,
);
export class BatchUnameErrorResponseItem extends S.Class<BatchUnameErrorResponseItem>(
  "BatchUnameErrorResponseItem",
)({
  field: S.optional(S.String),
  reason: S.optional(S.String),
  uname: S.String,
}) {}
export const BatchUnameErrorResponseItems = S.Array(
  BatchUnameErrorResponseItem,
);
export class BatchDeviceSuccessResponseItem extends S.Class<BatchDeviceSuccessResponseItem>(
  "BatchDeviceSuccessResponseItem",
)({ appId: S.String }) {}
export const BatchDeviceSuccessResponseItems = S.Array(
  BatchDeviceSuccessResponseItem,
);
export class BatchDeviceErrorResponseItem extends S.Class<BatchDeviceErrorResponseItem>(
  "BatchDeviceErrorResponseItem",
)({
  field: S.optional(S.String),
  reason: S.optional(S.String),
  appId: S.String,
}) {}
export const BatchDeviceErrorResponseItems = S.Array(
  BatchDeviceErrorResponseItem,
);
export class SecurityGroupSettingsRequest extends S.Class<SecurityGroupSettingsRequest>(
  "SecurityGroupSettingsRequest",
)({
  lockoutThreshold: S.optional(S.Number),
  permittedNetworks: S.optional(PermittedNetworksList),
  enableGuestFederation: S.optional(S.Boolean),
  globalFederation: S.optional(S.Boolean),
  federationMode: S.optional(S.Number),
  enableRestrictedGlobalFederation: S.optional(S.Boolean),
  permittedWickrAwsNetworks: S.optional(WickrAwsNetworksList),
  permittedWickrEnterpriseNetworks: S.optional(
    PermittedWickrEnterpriseNetworksList,
  ),
}) {}
export class GuestUserHistoryCount extends S.Class<GuestUserHistoryCount>(
  "GuestUserHistoryCount",
)({ month: S.String, count: S.String }) {}
export const GuestUserHistoryCountList = S.Array(GuestUserHistoryCount);
export class Setting extends S.Class<Setting>("Setting")({
  optionName: S.String,
  value: S.String,
  type: S.String,
}) {}
export const SettingsList = S.Array(Setting);
export class OidcConfigInfo extends S.Class<OidcConfigInfo>("OidcConfigInfo")({
  applicationName: S.optional(S.String),
  clientId: S.optional(S.String),
  companyId: S.String,
  scopes: S.String,
  issuer: S.String,
  clientSecret: S.optional(S.String),
  secret: S.optional(S.String),
  redirectUrl: S.optional(S.String),
  userId: S.optional(S.String),
  customUsername: S.optional(S.String),
  caCertificate: S.optional(S.String),
  applicationId: S.optional(S.Number),
  ssoTokenBufferMinutes: S.optional(S.Number),
  extraAuthParams: S.optional(S.String),
}) {}
export class OidcTokenInfo extends S.Class<OidcTokenInfo>("OidcTokenInfo")({
  codeVerifier: S.optional(S.String),
  codeChallenge: S.optional(S.String),
  accessToken: S.optional(S.String),
  idToken: S.optional(S.String),
  refreshToken: S.optional(S.String),
  tokenType: S.optional(S.String),
  expiresIn: S.optional(S.Number),
}) {}
export class BlockedGuestUser extends S.Class<BlockedGuestUser>(
  "BlockedGuestUser",
)({
  username: S.String,
  admin: S.String,
  modified: S.String,
  usernameHash: S.String,
}) {}
export const BlockedGuestUserList = S.Array(BlockedGuestUser);
export class Bot extends S.Class<Bot>("Bot")({
  botId: S.optional(S.String),
  displayName: S.optional(S.String),
  username: S.optional(S.String),
  uname: S.optional(S.String),
  pubkey: S.optional(S.String),
  status: S.optional(S.Number),
  groupId: S.optional(S.String),
  hasChallenge: S.optional(S.Boolean),
  suspended: S.optional(S.Boolean),
  lastLogin: S.optional(S.String),
}) {}
export const Bots = S.Array(Bot);
export class BasicDeviceObject extends S.Class<BasicDeviceObject>(
  "BasicDeviceObject",
)({
  appId: S.optional(S.String),
  created: S.optional(S.String),
  lastLogin: S.optional(S.String),
  statusText: S.optional(S.String),
  suspend: S.optional(S.Boolean),
  type: S.optional(S.String),
}) {}
export const Devices = S.Array(BasicDeviceObject);
export class GuestUser extends S.Class<GuestUser>("GuestUser")({
  billingPeriod: S.String,
  username: S.String,
  usernameHash: S.String,
}) {}
export const GuestUserList = S.Array(GuestUser);
export class Network extends S.Class<Network>("Network")({
  networkId: S.String,
  networkName: S.String,
  accessLevel: S.String,
  awsAccountId: S.String,
  networkArn: S.String,
  standing: S.optional(S.Number),
  freeTrialExpiration: S.optional(S.String),
  migrationState: S.optional(S.Number),
  encryptionKeyArn: S.optional(S.String),
}) {}
export const NetworkList = S.Array(Network);
export class NetworkSettings extends S.Class<NetworkSettings>(
  "NetworkSettings",
)({
  enableClientMetrics: S.optional(S.Boolean),
  readReceiptConfig: S.optional(ReadReceiptConfig),
  dataRetention: S.optional(S.Boolean),
}) {}
export class BatchCreateUserResponse extends S.Class<BatchCreateUserResponse>(
  "BatchCreateUserResponse",
)({
  message: S.optional(S.String),
  successful: S.optional(Users),
  failed: S.optional(BatchUserErrorResponseItems),
}) {}
export class BatchDeleteUserResponse extends S.Class<BatchDeleteUserResponse>(
  "BatchDeleteUserResponse",
)({
  message: S.optional(S.String),
  successful: S.optional(BatchUserSuccessResponseItems),
  failed: S.optional(BatchUserErrorResponseItems),
}) {}
export class BatchLookupUserUnameResponse extends S.Class<BatchLookupUserUnameResponse>(
  "BatchLookupUserUnameResponse",
)({
  message: S.optional(S.String),
  successful: S.optional(BatchUnameSuccessResponseItems),
  failed: S.optional(BatchUnameErrorResponseItems),
}) {}
export class BatchResetDevicesForUserResponse extends S.Class<BatchResetDevicesForUserResponse>(
  "BatchResetDevicesForUserResponse",
)({
  message: S.optional(S.String),
  successful: S.optional(BatchDeviceSuccessResponseItems),
  failed: S.optional(BatchDeviceErrorResponseItems),
}) {}
export class CreateSecurityGroupRequest extends S.Class<CreateSecurityGroupRequest>(
  "CreateSecurityGroupRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    name: S.String,
    securityGroupSettings: SecurityGroupSettingsRequest,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks/{networkId}/security-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGuestUserHistoryCountResponse extends S.Class<GetGuestUserHistoryCountResponse>(
  "GetGuestUserHistoryCountResponse",
)({ history: GuestUserHistoryCountList }) {}
export class GetNetworkSettingsResponse extends S.Class<GetNetworkSettingsResponse>(
  "GetNetworkSettingsResponse",
)({ settings: SettingsList }) {}
export class GetOidcInfoResponse extends S.Class<GetOidcInfoResponse>(
  "GetOidcInfoResponse",
)({
  openidConnectInfo: S.optional(OidcConfigInfo),
  tokenInfo: S.optional(OidcTokenInfo),
}) {}
export class GetSecurityGroupResponse extends S.Class<GetSecurityGroupResponse>(
  "GetSecurityGroupResponse",
)({ securityGroup: SecurityGroup }) {}
export class ListBlockedGuestUsersResponse extends S.Class<ListBlockedGuestUsersResponse>(
  "ListBlockedGuestUsersResponse",
)({ nextToken: S.optional(S.String), blocklist: BlockedGuestUserList }) {}
export class ListBotsResponse extends S.Class<ListBotsResponse>(
  "ListBotsResponse",
)({ bots: Bots, nextToken: S.optional(S.String) }) {}
export class ListDevicesForUserResponse extends S.Class<ListDevicesForUserResponse>(
  "ListDevicesForUserResponse",
)({ nextToken: S.optional(S.String), devices: Devices }) {}
export class ListGuestUsersResponse extends S.Class<ListGuestUsersResponse>(
  "ListGuestUsersResponse",
)({ nextToken: S.optional(S.String), guestlist: GuestUserList }) {}
export class ListNetworksResponse extends S.Class<ListNetworksResponse>(
  "ListNetworksResponse",
)({ networks: NetworkList, nextToken: S.optional(S.String) }) {}
export class ListSecurityGroupUsersResponse extends S.Class<ListSecurityGroupUsersResponse>(
  "ListSecurityGroupUsersResponse",
)({ users: Users, nextToken: S.optional(S.String) }) {}
export class UpdateNetworkSettingsRequest extends S.Class<UpdateNetworkSettingsRequest>(
  "UpdateNetworkSettingsRequest",
)(
  { networkId: S.String.pipe(T.HttpLabel()), settings: NetworkSettings },
  T.all(
    T.Http({ method: "PATCH", uri: "/networks/{networkId}/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSecurityGroupRequest extends S.Class<UpdateSecurityGroupRequest>(
  "UpdateSecurityGroupRequest",
)(
  {
    networkId: S.String.pipe(T.HttpLabel()),
    groupId: S.String.pipe(T.HttpLabel()),
    name: S.optional(S.String),
    securityGroupSettings: S.optional(SecurityGroupSettings),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/networks/{networkId}/security-groups/{groupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserResponse extends S.Class<UpdateUserResponse>(
  "UpdateUserResponse",
)({
  userId: S.String,
  networkId: S.String,
  securityGroupIds: S.optional(SecurityGroupIdList),
  firstName: S.optional(S.String),
  lastName: S.optional(S.String),
  middleName: S.optional(S.String),
  suspended: S.Boolean,
  modified: S.optional(S.Number),
  status: S.optional(S.Number),
  inviteCode: S.optional(S.String),
  inviteExpiration: S.optional(S.Number),
  codeValidation: S.optional(S.Boolean),
}) {}
export class ErrorDetail extends S.Class<ErrorDetail>("ErrorDetail")({
  field: S.optional(S.String),
  reason: S.optional(S.String),
}) {}
export const ErrorDetailList = S.Array(ErrorDetail);
export class CreateSecurityGroupResponse extends S.Class<CreateSecurityGroupResponse>(
  "CreateSecurityGroupResponse",
)({ securityGroup: SecurityGroup }) {}
export class UpdateNetworkSettingsResponse extends S.Class<UpdateNetworkSettingsResponse>(
  "UpdateNetworkSettingsResponse",
)({ settings: SettingsList }) {}
export class UpdateSecurityGroupResponse extends S.Class<UpdateSecurityGroupResponse>(
  "UpdateSecurityGroupResponse",
)({ securityGroup: SecurityGroup }) {}

//# Errors
export class BadRequestError extends S.TaggedError<BadRequestError>()(
  "BadRequestError",
  {},
) {}
export class ForbiddenError extends S.TaggedError<ForbiddenError>()(
  "ForbiddenError",
  {},
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  {},
) {}
export class RateLimitError extends S.TaggedError<RateLimitError>()(
  "RateLimitError",
  {},
) {}
export class ResourceNotFoundError extends S.TaggedError<ResourceNotFoundError>()(
  "ResourceNotFoundError",
  {},
) {}
export class UnauthorizedError extends S.TaggedError<UnauthorizedError>()(
  "UnauthorizedError",
  {},
) {}
export class ValidationError extends S.TaggedError<ValidationError>()(
  "ValidationError",
  {},
) {}

//# Operations
/**
 * Deletes the data retention bot from a Wickr network. This operation permanently removes the bot and all its associated data from the database.
 */
export const deleteDataRetentionBot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDataRetentionBotRequest,
    output: DeleteDataRetentionBotResponse,
    errors: [
      BadRequestError,
      ForbiddenError,
      InternalServerError,
      RateLimitError,
      ResourceNotFoundError,
      UnauthorizedError,
      ValidationError,
    ],
  }),
);
/**
 * Deletes a Wickr network and all its associated resources, including users, bots, security groups, and settings. This operation is permanent and cannot be undone.
 */
export const deleteNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNetworkRequest,
  output: DeleteNetworkResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Deletes a security group from a Wickr network. This operation cannot be performed on the default security group.
 */
export const deleteSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSecurityGroupRequest,
  output: DeleteSecurityGroupResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves detailed information about a specific bot in a Wickr network, including its status, group membership, and authentication details.
 */
export const getBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBotRequest,
  output: GetBotResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves the count of bots in a Wickr network, categorized by their status (pending, active, and total).
 */
export const getBotsCount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBotsCountRequest,
  output: GetBotsCountResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves information about the data retention bot in a Wickr network, including its status and whether the data retention service is enabled.
 */
export const getDataRetentionBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataRetentionBotRequest,
  output: GetDataRetentionBotResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves detailed information about a specific Wickr network, including its configuration, access level, and status.
 */
export const getNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNetworkRequest,
  output: GetNetworkResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves detailed information about a specific user in a Wickr network, including their profile, status, and activity history.
 */
export const getUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserRequest,
  output: GetUserResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves the count of users in a Wickr network, categorized by their status (pending, active, rejected) and showing how many users can still be added.
 */
export const getUsersCount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUsersCountRequest,
  output: GetUsersCountResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves a paginated list of security groups in a specified Wickr network. You can sort the results by various criteria.
 */
export const listSecurityGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSecurityGroupsRequest,
  output: ListSecurityGroupsResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves a paginated list of users in a specified Wickr network. You can filter and sort the results based on various criteria such as name, status, or security group membership.
 */
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Registers and saves an OpenID Connect (OIDC) configuration for a Wickr network, enabling Single Sign-On (SSO) authentication through an identity provider.
 */
export const registerOidcConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterOidcConfigRequest,
  output: RegisterOidcConfigResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Tests an OpenID Connect (OIDC) configuration for a Wickr network by validating the connection to the identity provider and retrieving its supported capabilities.
 */
export const registerOidcConfigTest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterOidcConfigTestRequest,
    output: RegisterOidcConfigTestResponse,
    errors: [
      BadRequestError,
      ForbiddenError,
      InternalServerError,
      RateLimitError,
      ResourceNotFoundError,
      UnauthorizedError,
      ValidationError,
    ],
  }),
);
/**
 * Updates the properties of an existing bot in a Wickr network. This operation allows you to modify the bot's display name, security group, password, or suspension status.
 */
export const updateBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBotRequest,
  output: UpdateBotResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Updates the data retention bot settings, allowing you to enable or disable the data retention service, or acknowledge the public key message.
 */
export const updateDataRetention = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataRetentionRequest,
  output: UpdateDataRetentionResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Updates the block status of a guest user in a Wickr network. This operation allows you to block or unblock a guest user from accessing the network.
 */
export const updateGuestUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGuestUserRequest,
  output: UpdateGuestUserResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Updates the properties of an existing Wickr network, such as its name or encryption key configuration.
 */
export const updateNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNetworkRequest,
  output: UpdateNetworkResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Creates multiple users in a specified Wickr network. This operation allows you to provision multiple user accounts simultaneously, optionally specifying security groups, and validation requirements for each user.
 *
 * `codeValidation`, `inviteCode`, and `inviteCodeTtl` are restricted to networks under preview only.
 */
export const batchCreateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateUserRequest,
  output: BatchCreateUserResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Deletes multiple users from a specified Wickr network. This operation permanently removes user accounts and their associated data from the network.
 */
export const batchDeleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteUserRequest,
  output: BatchDeleteUserResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Looks up multiple user usernames from their unique username hashes (unames). This operation allows you to retrieve the email addresses associated with a list of username hashes.
 */
export const batchLookupUserUname = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchLookupUserUnameRequest,
    output: BatchLookupUserUnameResponse,
    errors: [
      BadRequestError,
      ForbiddenError,
      InternalServerError,
      RateLimitError,
      ResourceNotFoundError,
      UnauthorizedError,
      ValidationError,
    ],
  }),
);
/**
 * Resends invitation codes to multiple users who have pending invitations in a Wickr network. This operation is useful when users haven't accepted their initial invitations or when invitations have expired.
 */
export const batchReinviteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchReinviteUserRequest,
  output: BatchReinviteUserResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Resets multiple devices for a specific user in a Wickr network. This operation forces the selected devices to log out and requires users to re-authenticate, which is useful for security purposes or when devices need to be revoked.
 */
export const batchResetDevicesForUser = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchResetDevicesForUserRequest,
    output: BatchResetDevicesForUserResponse,
    errors: [
      BadRequestError,
      ForbiddenError,
      InternalServerError,
      RateLimitError,
      ResourceNotFoundError,
      UnauthorizedError,
      ValidationError,
    ],
  }),
);
/**
 * Suspends or unsuspends multiple users in a Wickr network. Suspended users cannot access the network until they are unsuspended. This operation is useful for temporarily restricting access without deleting user accounts.
 */
export const batchToggleUserSuspendStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchToggleUserSuspendStatusRequest,
    output: BatchToggleUserSuspendStatusResponse,
    errors: [
      BadRequestError,
      ForbiddenError,
      InternalServerError,
      RateLimitError,
      ResourceNotFoundError,
      UnauthorizedError,
      ValidationError,
    ],
  }));
/**
 * Creates a new bot in a specified Wickr network. Bots are automated accounts that can send and receive messages, enabling integration with external systems and automation of tasks.
 */
export const createBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotRequest,
  output: CreateBotResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Creates a data retention bot in a Wickr network. Data retention bots are specialized bots that handle message archiving and compliance by capturing and storing messages for regulatory or organizational requirements.
 */
export const createDataRetentionBot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataRetentionBotRequest,
    output: CreateDataRetentionBotResponse,
    errors: [
      BadRequestError,
      ForbiddenError,
      InternalServerError,
      RateLimitError,
      ResourceNotFoundError,
      UnauthorizedError,
      ValidationError,
    ],
  }),
);
/**
 * Creates a new challenge password for the data retention bot. This password is used for authentication when the bot connects to the network.
 */
export const createDataRetentionBotChallenge =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDataRetentionBotChallengeRequest,
    output: CreateDataRetentionBotChallengeResponse,
    errors: [
      BadRequestError,
      ForbiddenError,
      InternalServerError,
      RateLimitError,
      ResourceNotFoundError,
      UnauthorizedError,
      ValidationError,
    ],
  }));
/**
 * Creates a new Wickr network with specified access level and configuration. This operation provisions a new communication network for your organization.
 */
export const createNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNetworkRequest,
  output: CreateNetworkResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves historical guest user count data for a Wickr network, showing the number of guest users per billing period over the past 90 days.
 */
export const getGuestUserHistoryCount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetGuestUserHistoryCountRequest,
    output: GetGuestUserHistoryCountResponse,
    errors: [
      BadRequestError,
      ForbiddenError,
      InternalServerError,
      RateLimitError,
      ResourceNotFoundError,
      UnauthorizedError,
      ValidationError,
    ],
  }),
);
/**
 * Retrieves all network-level settings for a Wickr network, including client metrics, data retention, and other configuration options.
 */
export const getNetworkSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNetworkSettingsRequest,
  output: GetNetworkSettingsResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves the OpenID Connect (OIDC) configuration for a Wickr network, including SSO settings and optional token information if access token parameters are provided.
 */
export const getOidcInfo = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOidcInfoRequest,
  output: GetOidcInfoResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves detailed information about a specific security group in a Wickr network, including its settings, member counts, and configuration.
 */
export const getSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSecurityGroupRequest,
  output: GetSecurityGroupResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves a paginated list of guest users who have been blocked from a Wickr network. You can filter and sort the results.
 */
export const listBlockedGuestUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListBlockedGuestUsersRequest,
    output: ListBlockedGuestUsersResponse,
    errors: [
      BadRequestError,
      ForbiddenError,
      InternalServerError,
      RateLimitError,
      ResourceNotFoundError,
      UnauthorizedError,
      ValidationError,
    ],
  }),
);
/**
 * Retrieves a paginated list of bots in a specified Wickr network. You can filter and sort the results based on various criteria.
 */
export const listBots = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBotsRequest,
  output: ListBotsResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves a paginated list of devices associated with a specific user in a Wickr network. This operation returns information about all devices where the user has logged into Wickr.
 */
export const listDevicesForUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDevicesForUserRequest,
  output: ListDevicesForUserResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves a paginated list of guest users who have communicated with your Wickr network. Guest users are external users from federated networks who can communicate with network members.
 */
export const listGuestUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGuestUsersRequest,
  output: ListGuestUsersResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves a paginated list of all Wickr networks associated with your Amazon Web Services account. You can sort the results by network ID or name.
 */
export const listNetworks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNetworksRequest,
  output: ListNetworksResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Retrieves a paginated list of users who belong to a specific security group in a Wickr network.
 */
export const listSecurityGroupUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSecurityGroupUsersRequest,
    output: ListSecurityGroupUsersResponse,
    errors: [
      BadRequestError,
      ForbiddenError,
      InternalServerError,
      RateLimitError,
      ResourceNotFoundError,
      UnauthorizedError,
      ValidationError,
    ],
  }),
);
/**
 * Updates the properties of an existing user in a Wickr network. This operation allows you to modify the user's name, password, security group membership, and invite code settings.
 *
 * `codeValidation`, `inviteCode`, and `inviteCodeTtl` are restricted to networks under preview only.
 */
export const updateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Creates a new security group in a Wickr network. Security groups allow you to organize users and control their permissions, features, and security settings.
 */
export const createSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSecurityGroupRequest,
  output: CreateSecurityGroupResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Deletes a bot from a specified Wickr network. This operation permanently removes the bot account and its associated data from the network.
 */
export const deleteBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBotRequest,
  output: DeleteBotResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
/**
 * Updates network-level settings for a Wickr network. You can modify settings such as client metrics, data retention, and other network-wide options.
 */
export const updateNetworkSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateNetworkSettingsRequest,
    output: UpdateNetworkSettingsResponse,
    errors: [
      BadRequestError,
      ForbiddenError,
      InternalServerError,
      RateLimitError,
      ResourceNotFoundError,
      UnauthorizedError,
      ValidationError,
    ],
  }),
);
/**
 * Updates the properties of an existing security group in a Wickr network, such as its name or settings.
 */
export const updateSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSecurityGroupRequest,
  output: UpdateSecurityGroupResponse,
  errors: [
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    RateLimitError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
  ],
}));
