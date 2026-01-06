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

//# Newtypes
export type NetworkId = string;
export type ClientToken = string;
export type UserId = string;
export type GenericString = string;
export type SensitiveString = string | Redacted.Redacted<string>;
export type BotId = string;
export type SecurityGroupId = string;
export type Uname = string;

//# Schemas
export type UserIds = string[];
export const UserIds = S.Array(S.String);
export type Unames = string[];
export const Unames = S.Array(S.String);
export type AppIds = string[];
export const AppIds = S.Array(S.String);
export interface BatchDeleteUserRequest {
  networkId: string;
  userIds: UserIds;
  clientToken?: string;
}
export const BatchDeleteUserRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    userIds: UserIds,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/networks/{networkId}/users/batch-delete",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteUserRequest",
}) as any as S.Schema<BatchDeleteUserRequest>;
export interface BatchLookupUserUnameRequest {
  networkId: string;
  unames: Unames;
  clientToken?: string;
}
export const BatchLookupUserUnameRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    unames: Unames,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/networks/{networkId}/users/uname-lookup",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchLookupUserUnameRequest",
}) as any as S.Schema<BatchLookupUserUnameRequest>;
export interface BatchReinviteUserRequest {
  networkId: string;
  userIds: UserIds;
  clientToken?: string;
}
export const BatchReinviteUserRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    userIds: UserIds,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/networks/{networkId}/users/re-invite" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchReinviteUserRequest",
}) as any as S.Schema<BatchReinviteUserRequest>;
export interface BatchResetDevicesForUserRequest {
  networkId: string;
  userId: string;
  appIds: AppIds;
  clientToken?: string;
}
export const BatchResetDevicesForUserRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    appIds: AppIds,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchResetDevicesForUserRequest",
}) as any as S.Schema<BatchResetDevicesForUserRequest>;
export interface BatchToggleUserSuspendStatusRequest {
  networkId: string;
  suspend: boolean;
  userIds: UserIds;
  clientToken?: string;
}
export const BatchToggleUserSuspendStatusRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    suspend: S.Boolean.pipe(T.HttpQuery("suspend")),
    userIds: UserIds,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchToggleUserSuspendStatusRequest",
}) as any as S.Schema<BatchToggleUserSuspendStatusRequest>;
export interface CreateBotRequest {
  networkId: string;
  username: string;
  displayName?: string;
  groupId: string;
  challenge: string | Redacted.Redacted<string>;
}
export const CreateBotRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    username: S.String,
    displayName: S.optional(S.String),
    groupId: S.String,
    challenge: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/networks/{networkId}/bots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBotRequest",
}) as any as S.Schema<CreateBotRequest>;
export interface CreateDataRetentionBotRequest {
  networkId: string;
}
export const CreateDataRetentionBotRequest = S.suspend(() =>
  S.Struct({ networkId: S.String.pipe(T.HttpLabel("networkId")) }).pipe(
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
  ),
).annotations({
  identifier: "CreateDataRetentionBotRequest",
}) as any as S.Schema<CreateDataRetentionBotRequest>;
export interface CreateDataRetentionBotChallengeRequest {
  networkId: string;
}
export const CreateDataRetentionBotChallengeRequest = S.suspend(() =>
  S.Struct({ networkId: S.String.pipe(T.HttpLabel("networkId")) }).pipe(
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
  ),
).annotations({
  identifier: "CreateDataRetentionBotChallengeRequest",
}) as any as S.Schema<CreateDataRetentionBotChallengeRequest>;
export interface CreateNetworkRequest {
  networkName: string;
  accessLevel: string;
  enablePremiumFreeTrial?: boolean;
  encryptionKeyArn?: string;
}
export const CreateNetworkRequest = S.suspend(() =>
  S.Struct({
    networkName: S.String,
    accessLevel: S.String,
    enablePremiumFreeTrial: S.optional(S.Boolean),
    encryptionKeyArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/networks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNetworkRequest",
}) as any as S.Schema<CreateNetworkRequest>;
export interface DeleteBotRequest {
  networkId: string;
  botId: string;
}
export const DeleteBotRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    botId: S.String.pipe(T.HttpLabel("botId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/networks/{networkId}/bots/{botId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBotRequest",
}) as any as S.Schema<DeleteBotRequest>;
export interface DeleteDataRetentionBotRequest {
  networkId: string;
}
export const DeleteDataRetentionBotRequest = S.suspend(() =>
  S.Struct({ networkId: S.String.pipe(T.HttpLabel("networkId")) }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDataRetentionBotRequest",
}) as any as S.Schema<DeleteDataRetentionBotRequest>;
export interface DeleteNetworkRequest {
  networkId: string;
  clientToken?: string;
}
export const DeleteNetworkRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/networks/{networkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteNetworkRequest",
}) as any as S.Schema<DeleteNetworkRequest>;
export interface DeleteSecurityGroupRequest {
  networkId: string;
  groupId: string;
}
export const DeleteSecurityGroupRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    groupId: S.String.pipe(T.HttpLabel("groupId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteSecurityGroupRequest",
}) as any as S.Schema<DeleteSecurityGroupRequest>;
export interface GetBotRequest {
  networkId: string;
  botId: string;
}
export const GetBotRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    botId: S.String.pipe(T.HttpLabel("botId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}/bots/{botId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBotRequest",
}) as any as S.Schema<GetBotRequest>;
export interface GetBotsCountRequest {
  networkId: string;
}
export const GetBotsCountRequest = S.suspend(() =>
  S.Struct({ networkId: S.String.pipe(T.HttpLabel("networkId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}/bots/count" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBotsCountRequest",
}) as any as S.Schema<GetBotsCountRequest>;
export interface GetDataRetentionBotRequest {
  networkId: string;
}
export const GetDataRetentionBotRequest = S.suspend(() =>
  S.Struct({ networkId: S.String.pipe(T.HttpLabel("networkId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/networks/{networkId}/data-retention-bots",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataRetentionBotRequest",
}) as any as S.Schema<GetDataRetentionBotRequest>;
export interface GetGuestUserHistoryCountRequest {
  networkId: string;
}
export const GetGuestUserHistoryCountRequest = S.suspend(() =>
  S.Struct({ networkId: S.String.pipe(T.HttpLabel("networkId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}/guest-users/count" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGuestUserHistoryCountRequest",
}) as any as S.Schema<GetGuestUserHistoryCountRequest>;
export interface GetNetworkRequest {
  networkId: string;
}
export const GetNetworkRequest = S.suspend(() =>
  S.Struct({ networkId: S.String.pipe(T.HttpLabel("networkId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetNetworkRequest",
}) as any as S.Schema<GetNetworkRequest>;
export interface GetNetworkSettingsRequest {
  networkId: string;
}
export const GetNetworkSettingsRequest = S.suspend(() =>
  S.Struct({ networkId: S.String.pipe(T.HttpLabel("networkId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}/settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetNetworkSettingsRequest",
}) as any as S.Schema<GetNetworkSettingsRequest>;
export interface GetOidcInfoRequest {
  networkId: string;
  clientId?: string;
  code?: string;
  grantType?: string;
  redirectUri?: string;
  url?: string;
  clientSecret?: string | Redacted.Redacted<string>;
  codeVerifier?: string;
  certificate?: string;
}
export const GetOidcInfoRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    clientId: S.optional(S.String).pipe(T.HttpQuery("clientId")),
    code: S.optional(S.String).pipe(T.HttpQuery("code")),
    grantType: S.optional(S.String).pipe(T.HttpQuery("grantType")),
    redirectUri: S.optional(S.String).pipe(T.HttpQuery("redirectUri")),
    url: S.optional(S.String).pipe(T.HttpQuery("url")),
    clientSecret: S.optional(SensitiveString).pipe(T.HttpQuery("clientSecret")),
    codeVerifier: S.optional(S.String).pipe(T.HttpQuery("codeVerifier")),
    certificate: S.optional(S.String).pipe(T.HttpQuery("certificate")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}/oidc" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOidcInfoRequest",
}) as any as S.Schema<GetOidcInfoRequest>;
export interface GetSecurityGroupRequest {
  networkId: string;
  groupId: string;
}
export const GetSecurityGroupRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    groupId: S.String.pipe(T.HttpLabel("groupId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSecurityGroupRequest",
}) as any as S.Schema<GetSecurityGroupRequest>;
export interface GetUserRequest {
  networkId: string;
  userId: string;
  startTime?: Date;
  endTime?: Date;
}
export const GetUserRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endTime"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}/users/{userId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUserRequest",
}) as any as S.Schema<GetUserRequest>;
export interface GetUsersCountRequest {
  networkId: string;
}
export const GetUsersCountRequest = S.suspend(() =>
  S.Struct({ networkId: S.String.pipe(T.HttpLabel("networkId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}/users/count" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUsersCountRequest",
}) as any as S.Schema<GetUsersCountRequest>;
export interface ListBlockedGuestUsersRequest {
  networkId: string;
  maxResults?: number;
  sortDirection?: string;
  sortFields?: string;
  username?: string;
  admin?: string;
  nextToken?: string;
}
export const ListBlockedGuestUsersRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    username: S.optional(S.String).pipe(T.HttpQuery("username")),
    admin: S.optional(S.String).pipe(T.HttpQuery("admin")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListBlockedGuestUsersRequest",
}) as any as S.Schema<ListBlockedGuestUsersRequest>;
export interface ListBotsRequest {
  networkId: string;
  nextToken?: string;
  maxResults?: number;
  sortFields?: string;
  sortDirection?: string;
  displayName?: string;
  username?: string;
  status?: number;
  groupId?: string;
}
export const ListBotsRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
    displayName: S.optional(S.String).pipe(T.HttpQuery("displayName")),
    username: S.optional(S.String).pipe(T.HttpQuery("username")),
    status: S.optional(S.Number).pipe(T.HttpQuery("status")),
    groupId: S.optional(S.String).pipe(T.HttpQuery("groupId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}/bots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBotsRequest",
}) as any as S.Schema<ListBotsRequest>;
export interface ListDevicesForUserRequest {
  networkId: string;
  userId: string;
  nextToken?: string;
  maxResults?: number;
  sortFields?: string;
  sortDirection?: string;
}
export const ListDevicesForUserRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    userId: S.String.pipe(T.HttpLabel("userId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDevicesForUserRequest",
}) as any as S.Schema<ListDevicesForUserRequest>;
export interface ListGuestUsersRequest {
  networkId: string;
  maxResults?: number;
  sortDirection?: string;
  sortFields?: string;
  username?: string;
  billingPeriod?: string;
  nextToken?: string;
}
export const ListGuestUsersRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    username: S.optional(S.String).pipe(T.HttpQuery("username")),
    billingPeriod: S.optional(S.String).pipe(T.HttpQuery("billingPeriod")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}/guest-users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGuestUsersRequest",
}) as any as S.Schema<ListGuestUsersRequest>;
export interface ListNetworksRequest {
  maxResults?: number;
  sortFields?: string;
  sortDirection?: string;
  nextToken?: string;
}
export const ListNetworksRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNetworksRequest",
}) as any as S.Schema<ListNetworksRequest>;
export interface ListSecurityGroupsRequest {
  networkId: string;
  nextToken?: string;
  maxResults?: number;
  sortFields?: string;
  sortDirection?: string;
}
export const ListSecurityGroupsRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}/security-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSecurityGroupsRequest",
}) as any as S.Schema<ListSecurityGroupsRequest>;
export interface ListSecurityGroupUsersRequest {
  networkId: string;
  groupId: string;
  nextToken?: string;
  maxResults?: number;
  sortFields?: string;
  sortDirection?: string;
}
export const ListSecurityGroupUsersRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    groupId: S.String.pipe(T.HttpLabel("groupId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListSecurityGroupUsersRequest",
}) as any as S.Schema<ListSecurityGroupUsersRequest>;
export interface ListUsersRequest {
  networkId: string;
  nextToken?: string;
  maxResults?: number;
  sortFields?: string;
  sortDirection?: string;
  firstName?: string | Redacted.Redacted<string>;
  lastName?: string | Redacted.Redacted<string>;
  username?: string;
  status?: number;
  groupId?: string;
}
export const ListUsersRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortFields: S.optional(S.String).pipe(T.HttpQuery("sortFields")),
    sortDirection: S.optional(S.String).pipe(T.HttpQuery("sortDirection")),
    firstName: S.optional(SensitiveString).pipe(T.HttpQuery("firstName")),
    lastName: S.optional(SensitiveString).pipe(T.HttpQuery("lastName")),
    username: S.optional(S.String).pipe(T.HttpQuery("username")),
    status: S.optional(S.Number).pipe(T.HttpQuery("status")),
    groupId: S.optional(S.String).pipe(T.HttpQuery("groupId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{networkId}/users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUsersRequest",
}) as any as S.Schema<ListUsersRequest>;
export interface RegisterOidcConfigRequest {
  networkId: string;
  companyId: string;
  customUsername?: string;
  extraAuthParams?: string;
  issuer: string;
  scopes: string;
  secret?: string | Redacted.Redacted<string>;
  ssoTokenBufferMinutes?: number;
  userId?: string;
}
export const RegisterOidcConfigRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    companyId: S.String,
    customUsername: S.optional(S.String),
    extraAuthParams: S.optional(S.String),
    issuer: S.String,
    scopes: S.String,
    secret: S.optional(SensitiveString),
    ssoTokenBufferMinutes: S.optional(S.Number),
    userId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/networks/{networkId}/oidc/save" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterOidcConfigRequest",
}) as any as S.Schema<RegisterOidcConfigRequest>;
export interface RegisterOidcConfigTestRequest {
  networkId: string;
  extraAuthParams?: string;
  issuer: string;
  scopes: string;
  certificate?: string;
}
export const RegisterOidcConfigTestRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    extraAuthParams: S.optional(S.String),
    issuer: S.String,
    scopes: S.String,
    certificate: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/networks/{networkId}/oidc/test" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterOidcConfigTestRequest",
}) as any as S.Schema<RegisterOidcConfigTestRequest>;
export interface UpdateBotRequest {
  networkId: string;
  botId: string;
  displayName?: string;
  groupId?: string;
  challenge?: string | Redacted.Redacted<string>;
  suspend?: boolean;
}
export const UpdateBotRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    botId: S.String.pipe(T.HttpLabel("botId")),
    displayName: S.optional(S.String),
    groupId: S.optional(S.String),
    challenge: S.optional(SensitiveString),
    suspend: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/networks/{networkId}/bots/{botId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBotRequest",
}) as any as S.Schema<UpdateBotRequest>;
export interface UpdateDataRetentionRequest {
  networkId: string;
  actionType: string;
}
export const UpdateDataRetentionRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    actionType: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateDataRetentionRequest",
}) as any as S.Schema<UpdateDataRetentionRequest>;
export interface UpdateGuestUserRequest {
  networkId: string;
  usernameHash: string;
  block: boolean;
}
export const UpdateGuestUserRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    usernameHash: S.String.pipe(T.HttpLabel("usernameHash")),
    block: S.Boolean,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateGuestUserRequest",
}) as any as S.Schema<UpdateGuestUserRequest>;
export interface UpdateNetworkRequest {
  networkId: string;
  networkName: string;
  clientToken?: string;
  encryptionKeyArn?: string;
}
export const UpdateNetworkRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    networkName: S.String,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
    encryptionKeyArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/networks/{networkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNetworkRequest",
}) as any as S.Schema<UpdateNetworkRequest>;
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export type PermittedNetworksList = string[];
export const PermittedNetworksList = S.Array(S.String);
export type SecurityGroupStringList = string[];
export const SecurityGroupStringList = S.Array(S.String);
export interface BatchCreateUserRequestItem {
  firstName?: string | Redacted.Redacted<string>;
  lastName?: string | Redacted.Redacted<string>;
  securityGroupIds: SecurityGroupIdList;
  username: string;
  inviteCode?: string;
  inviteCodeTtl?: number;
  codeValidation?: boolean;
}
export const BatchCreateUserRequestItem = S.suspend(() =>
  S.Struct({
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
    securityGroupIds: SecurityGroupIdList,
    username: S.String,
    inviteCode: S.optional(S.String),
    inviteCodeTtl: S.optional(S.Number),
    codeValidation: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "BatchCreateUserRequestItem",
}) as any as S.Schema<BatchCreateUserRequestItem>;
export type BatchCreateUserRequestItems = BatchCreateUserRequestItem[];
export const BatchCreateUserRequestItems = S.Array(BatchCreateUserRequestItem);
export interface CallingSettings {
  canStart11Call?: boolean;
  canVideoCall?: boolean;
  forceTcpCall?: boolean;
}
export const CallingSettings = S.suspend(() =>
  S.Struct({
    canStart11Call: S.optional(S.Boolean),
    canVideoCall: S.optional(S.Boolean),
    forceTcpCall: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CallingSettings",
}) as any as S.Schema<CallingSettings>;
export interface PasswordRequirements {
  lowercase?: number;
  minLength?: number;
  numbers?: number;
  symbols?: number;
  uppercase?: number;
}
export const PasswordRequirements = S.suspend(() =>
  S.Struct({
    lowercase: S.optional(S.Number),
    minLength: S.optional(S.Number),
    numbers: S.optional(S.Number),
    symbols: S.optional(S.Number),
    uppercase: S.optional(S.Number),
  }),
).annotations({
  identifier: "PasswordRequirements",
}) as any as S.Schema<PasswordRequirements>;
export interface ShredderSettings {
  canProcessManually?: boolean;
  intensity?: number;
}
export const ShredderSettings = S.suspend(() =>
  S.Struct({
    canProcessManually: S.optional(S.Boolean),
    intensity: S.optional(S.Number),
  }),
).annotations({
  identifier: "ShredderSettings",
}) as any as S.Schema<ShredderSettings>;
export interface WickrAwsNetworks {
  region: string;
  networkId: string;
}
export const WickrAwsNetworks = S.suspend(() =>
  S.Struct({ region: S.String, networkId: S.String }),
).annotations({
  identifier: "WickrAwsNetworks",
}) as any as S.Schema<WickrAwsNetworks>;
export type WickrAwsNetworksList = WickrAwsNetworks[];
export const WickrAwsNetworksList = S.Array(WickrAwsNetworks);
export interface PermittedWickrEnterpriseNetwork {
  domain: string;
  networkId: string;
}
export const PermittedWickrEnterpriseNetwork = S.suspend(() =>
  S.Struct({ domain: S.String, networkId: S.String }),
).annotations({
  identifier: "PermittedWickrEnterpriseNetwork",
}) as any as S.Schema<PermittedWickrEnterpriseNetwork>;
export type PermittedWickrEnterpriseNetworksList =
  PermittedWickrEnterpriseNetwork[];
export const PermittedWickrEnterpriseNetworksList = S.Array(
  PermittedWickrEnterpriseNetwork,
);
export interface SecurityGroupSettings {
  alwaysReauthenticate?: boolean;
  atakPackageValues?: SecurityGroupStringList;
  calling?: CallingSettings;
  checkForUpdates?: boolean;
  enableAtak?: boolean;
  enableCrashReports?: boolean;
  enableFileDownload?: boolean;
  enableGuestFederation?: boolean;
  enableNotificationPreview?: boolean;
  enableOpenAccessOption?: boolean;
  enableRestrictedGlobalFederation?: boolean;
  filesEnabled?: boolean;
  forceDeviceLockout?: number;
  forceOpenAccess?: boolean;
  forceReadReceipts?: boolean;
  globalFederation?: boolean;
  isAtoEnabled?: boolean;
  isLinkPreviewEnabled?: boolean;
  locationAllowMaps?: boolean;
  locationEnabled?: boolean;
  maxAutoDownloadSize?: number;
  maxBor?: number;
  maxTtl?: number;
  messageForwardingEnabled?: boolean;
  passwordRequirements?: PasswordRequirements;
  presenceEnabled?: boolean;
  quickResponses?: SecurityGroupStringList;
  showMasterRecoveryKey?: boolean;
  shredder?: ShredderSettings;
  ssoMaxIdleMinutes?: number;
  federationMode?: number;
  lockoutThreshold?: number;
  permittedNetworks?: PermittedNetworksList;
  permittedWickrAwsNetworks?: WickrAwsNetworksList;
  permittedWickrEnterpriseNetworks?: PermittedWickrEnterpriseNetworksList;
}
export const SecurityGroupSettings = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "SecurityGroupSettings",
}) as any as S.Schema<SecurityGroupSettings>;
export interface SecurityGroup {
  activeMembers: number;
  botMembers: number;
  activeDirectoryGuid?: string;
  id: string;
  isDefault: boolean;
  name: string;
  modified: number;
  securityGroupSettings: SecurityGroupSettings;
}
export const SecurityGroup = S.suspend(() =>
  S.Struct({
    activeMembers: S.Number,
    botMembers: S.Number,
    activeDirectoryGuid: S.optional(S.String),
    id: S.String,
    isDefault: S.Boolean,
    name: S.String,
    modified: S.Number,
    securityGroupSettings: SecurityGroupSettings,
  }),
).annotations({
  identifier: "SecurityGroup",
}) as any as S.Schema<SecurityGroup>;
export type SecurityGroupList = SecurityGroup[];
export const SecurityGroupList = S.Array(SecurityGroup);
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface UpdateUserDetails {
  firstName?: string | Redacted.Redacted<string>;
  lastName?: string | Redacted.Redacted<string>;
  username?: string;
  securityGroupIds?: SecurityGroupIdList;
  inviteCode?: string;
  inviteCodeTtl?: number;
  codeValidation?: boolean;
}
export const UpdateUserDetails = S.suspend(() =>
  S.Struct({
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
    username: S.optional(S.String),
    securityGroupIds: S.optional(SecurityGroupIdList),
    inviteCode: S.optional(S.String),
    inviteCodeTtl: S.optional(S.Number),
    codeValidation: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UpdateUserDetails",
}) as any as S.Schema<UpdateUserDetails>;
export interface BatchCreateUserRequest {
  networkId: string;
  users: BatchCreateUserRequestItems;
  clientToken?: string;
}
export const BatchCreateUserRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    users: BatchCreateUserRequestItems,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/networks/{networkId}/users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchCreateUserRequest",
}) as any as S.Schema<BatchCreateUserRequest>;
export interface BatchUserSuccessResponseItem {
  userId: string;
}
export const BatchUserSuccessResponseItem = S.suspend(() =>
  S.Struct({ userId: S.String }),
).annotations({
  identifier: "BatchUserSuccessResponseItem",
}) as any as S.Schema<BatchUserSuccessResponseItem>;
export type BatchUserSuccessResponseItems = BatchUserSuccessResponseItem[];
export const BatchUserSuccessResponseItems = S.Array(
  BatchUserSuccessResponseItem,
);
export interface BatchUserErrorResponseItem {
  field?: string;
  reason?: string;
  userId: string;
}
export const BatchUserErrorResponseItem = S.suspend(() =>
  S.Struct({
    field: S.optional(S.String),
    reason: S.optional(S.String),
    userId: S.String,
  }),
).annotations({
  identifier: "BatchUserErrorResponseItem",
}) as any as S.Schema<BatchUserErrorResponseItem>;
export type BatchUserErrorResponseItems = BatchUserErrorResponseItem[];
export const BatchUserErrorResponseItems = S.Array(BatchUserErrorResponseItem);
export interface BatchReinviteUserResponse {
  message?: string;
  successful?: BatchUserSuccessResponseItems;
  failed?: BatchUserErrorResponseItems;
}
export const BatchReinviteUserResponse = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    successful: S.optional(BatchUserSuccessResponseItems),
    failed: S.optional(BatchUserErrorResponseItems),
  }),
).annotations({
  identifier: "BatchReinviteUserResponse",
}) as any as S.Schema<BatchReinviteUserResponse>;
export interface BatchToggleUserSuspendStatusResponse {
  message?: string;
  successful?: BatchUserSuccessResponseItems;
  failed?: BatchUserErrorResponseItems;
}
export const BatchToggleUserSuspendStatusResponse = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    successful: S.optional(BatchUserSuccessResponseItems),
    failed: S.optional(BatchUserErrorResponseItems),
  }),
).annotations({
  identifier: "BatchToggleUserSuspendStatusResponse",
}) as any as S.Schema<BatchToggleUserSuspendStatusResponse>;
export interface CreateBotResponse {
  message?: string;
  botId: string;
  networkId?: string;
  username?: string;
  displayName?: string;
  groupId?: string;
}
export const CreateBotResponse = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    botId: S.String,
    networkId: S.optional(S.String),
    username: S.optional(S.String),
    displayName: S.optional(S.String),
    groupId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateBotResponse",
}) as any as S.Schema<CreateBotResponse>;
export interface CreateDataRetentionBotResponse {
  message?: string;
}
export const CreateDataRetentionBotResponse = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "CreateDataRetentionBotResponse",
}) as any as S.Schema<CreateDataRetentionBotResponse>;
export interface CreateDataRetentionBotChallengeResponse {
  challenge: string | Redacted.Redacted<string>;
}
export const CreateDataRetentionBotChallengeResponse = S.suspend(() =>
  S.Struct({ challenge: SensitiveString }),
).annotations({
  identifier: "CreateDataRetentionBotChallengeResponse",
}) as any as S.Schema<CreateDataRetentionBotChallengeResponse>;
export interface CreateNetworkResponse {
  networkId?: string;
  networkName?: string;
  encryptionKeyArn?: string;
}
export const CreateNetworkResponse = S.suspend(() =>
  S.Struct({
    networkId: S.optional(S.String),
    networkName: S.optional(S.String),
    encryptionKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateNetworkResponse",
}) as any as S.Schema<CreateNetworkResponse>;
export interface DeleteBotResponse {
  message?: string;
}
export const DeleteBotResponse = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "DeleteBotResponse",
}) as any as S.Schema<DeleteBotResponse>;
export interface DeleteDataRetentionBotResponse {
  message?: string;
}
export const DeleteDataRetentionBotResponse = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "DeleteDataRetentionBotResponse",
}) as any as S.Schema<DeleteDataRetentionBotResponse>;
export interface DeleteNetworkResponse {
  message?: string;
}
export const DeleteNetworkResponse = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "DeleteNetworkResponse",
}) as any as S.Schema<DeleteNetworkResponse>;
export interface DeleteSecurityGroupResponse {
  message?: string;
  networkId?: string;
  groupId?: string;
}
export const DeleteSecurityGroupResponse = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    networkId: S.optional(S.String),
    groupId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteSecurityGroupResponse",
}) as any as S.Schema<DeleteSecurityGroupResponse>;
export interface GetBotResponse {
  botId?: string;
  displayName?: string;
  username?: string;
  uname?: string;
  pubkey?: string;
  status?: number;
  groupId?: string;
  hasChallenge?: boolean;
  suspended?: boolean;
  lastLogin?: string;
}
export const GetBotResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetBotResponse",
}) as any as S.Schema<GetBotResponse>;
export interface GetBotsCountResponse {
  pending: number;
  active: number;
  total: number;
}
export const GetBotsCountResponse = S.suspend(() =>
  S.Struct({ pending: S.Number, active: S.Number, total: S.Number }),
).annotations({
  identifier: "GetBotsCountResponse",
}) as any as S.Schema<GetBotsCountResponse>;
export interface GetDataRetentionBotResponse {
  botName?: string;
  botExists?: boolean;
  isBotActive?: boolean;
  isDataRetentionBotRegistered?: boolean;
  isDataRetentionServiceEnabled?: boolean;
  isPubkeyMsgAcked?: boolean;
}
export const GetDataRetentionBotResponse = S.suspend(() =>
  S.Struct({
    botName: S.optional(S.String),
    botExists: S.optional(S.Boolean),
    isBotActive: S.optional(S.Boolean),
    isDataRetentionBotRegistered: S.optional(S.Boolean),
    isDataRetentionServiceEnabled: S.optional(S.Boolean),
    isPubkeyMsgAcked: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetDataRetentionBotResponse",
}) as any as S.Schema<GetDataRetentionBotResponse>;
export interface GetNetworkResponse {
  networkId: string;
  networkName: string;
  accessLevel: string;
  awsAccountId: string;
  networkArn: string;
  standing?: number;
  freeTrialExpiration?: string;
  migrationState?: number;
  encryptionKeyArn?: string;
}
export const GetNetworkResponse = S.suspend(() =>
  S.Struct({
    networkId: S.String,
    networkName: S.String,
    accessLevel: S.String,
    awsAccountId: S.String,
    networkArn: S.String,
    standing: S.optional(S.Number),
    freeTrialExpiration: S.optional(S.String),
    migrationState: S.optional(S.Number),
    encryptionKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetNetworkResponse",
}) as any as S.Schema<GetNetworkResponse>;
export interface GetUserResponse {
  userId: string;
  firstName?: string | Redacted.Redacted<string>;
  lastName?: string | Redacted.Redacted<string>;
  username?: string;
  isAdmin?: boolean;
  suspended?: boolean;
  status?: number;
  lastActivity?: number;
  lastLogin?: number;
  securityGroupIds?: SecurityGroupIdList;
}
export const GetUserResponse = S.suspend(() =>
  S.Struct({
    userId: S.String,
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
    username: S.optional(S.String),
    isAdmin: S.optional(S.Boolean),
    suspended: S.optional(S.Boolean),
    status: S.optional(S.Number),
    lastActivity: S.optional(S.Number),
    lastLogin: S.optional(S.Number),
    securityGroupIds: S.optional(SecurityGroupIdList),
  }),
).annotations({
  identifier: "GetUserResponse",
}) as any as S.Schema<GetUserResponse>;
export interface GetUsersCountResponse {
  pending: number;
  active: number;
  rejected: number;
  remaining: number;
  total: number;
}
export const GetUsersCountResponse = S.suspend(() =>
  S.Struct({
    pending: S.Number,
    active: S.Number,
    rejected: S.Number,
    remaining: S.Number,
    total: S.Number,
  }),
).annotations({
  identifier: "GetUsersCountResponse",
}) as any as S.Schema<GetUsersCountResponse>;
export interface ListSecurityGroupsResponse {
  securityGroups?: SecurityGroupList;
  nextToken?: string;
}
export const ListSecurityGroupsResponse = S.suspend(() =>
  S.Struct({
    securityGroups: S.optional(SecurityGroupList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSecurityGroupsResponse",
}) as any as S.Schema<ListSecurityGroupsResponse>;
export interface User {
  userId?: string;
  firstName?: string | Redacted.Redacted<string>;
  lastName?: string | Redacted.Redacted<string>;
  username?: string;
  securityGroups?: SecurityGroupIdList;
  isAdmin?: boolean;
  suspended?: boolean;
  status?: number;
  otpEnabled?: boolean;
  scimId?: string;
  type?: string;
  cell?: string;
  countryCode?: string;
  challengeFailures?: number;
  isInviteExpired?: boolean;
  isUser?: boolean;
  inviteCode?: string;
  codeValidation?: boolean;
  uname?: string;
}
export const User = S.suspend(() =>
  S.Struct({
    userId: S.optional(S.String),
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
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
  }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type Users = User[];
export const Users = S.Array(User);
export interface ListUsersResponse {
  nextToken?: string;
  users?: Users;
}
export const ListUsersResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), users: S.optional(Users) }),
).annotations({
  identifier: "ListUsersResponse",
}) as any as S.Schema<ListUsersResponse>;
export interface RegisterOidcConfigResponse {
  applicationName?: string;
  clientId?: string;
  companyId: string;
  scopes: string;
  issuer: string;
  clientSecret?: string | Redacted.Redacted<string>;
  secret?: string | Redacted.Redacted<string>;
  redirectUrl?: string;
  userId?: string;
  customUsername?: string;
  caCertificate?: string;
  applicationId?: number;
  ssoTokenBufferMinutes?: number;
  extraAuthParams?: string;
}
export const RegisterOidcConfigResponse = S.suspend(() =>
  S.Struct({
    applicationName: S.optional(S.String),
    clientId: S.optional(S.String),
    companyId: S.String,
    scopes: S.String,
    issuer: S.String,
    clientSecret: S.optional(SensitiveString),
    secret: S.optional(SensitiveString),
    redirectUrl: S.optional(S.String),
    userId: S.optional(S.String),
    customUsername: S.optional(S.String),
    caCertificate: S.optional(S.String),
    applicationId: S.optional(S.Number),
    ssoTokenBufferMinutes: S.optional(S.Number),
    extraAuthParams: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterOidcConfigResponse",
}) as any as S.Schema<RegisterOidcConfigResponse>;
export interface RegisterOidcConfigTestResponse {
  tokenEndpoint?: string;
  userinfoEndpoint?: string;
  responseTypesSupported?: StringList;
  scopesSupported?: StringList;
  issuer?: string;
  authorizationEndpoint?: string;
  endSessionEndpoint?: string;
  logoutEndpoint?: string;
  grantTypesSupported?: StringList;
  revocationEndpoint?: string;
  tokenEndpointAuthMethodsSupported?: StringList;
  microsoftMultiRefreshToken?: boolean;
}
export const RegisterOidcConfigTestResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "RegisterOidcConfigTestResponse",
}) as any as S.Schema<RegisterOidcConfigTestResponse>;
export interface UpdateBotResponse {
  message?: string;
}
export const UpdateBotResponse = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "UpdateBotResponse",
}) as any as S.Schema<UpdateBotResponse>;
export interface UpdateDataRetentionResponse {
  message?: string;
}
export const UpdateDataRetentionResponse = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "UpdateDataRetentionResponse",
}) as any as S.Schema<UpdateDataRetentionResponse>;
export interface UpdateGuestUserResponse {
  message?: string;
}
export const UpdateGuestUserResponse = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "UpdateGuestUserResponse",
}) as any as S.Schema<UpdateGuestUserResponse>;
export interface UpdateNetworkResponse {
  message?: string;
}
export const UpdateNetworkResponse = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "UpdateNetworkResponse",
}) as any as S.Schema<UpdateNetworkResponse>;
export interface UpdateUserRequest {
  networkId: string;
  userId: string;
  userDetails?: UpdateUserDetails;
}
export const UpdateUserRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    userId: S.String,
    userDetails: S.optional(UpdateUserDetails),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/networks/{networkId}/users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateUserRequest",
}) as any as S.Schema<UpdateUserRequest>;
export interface ReadReceiptConfig {
  status?: string;
}
export const ReadReceiptConfig = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "ReadReceiptConfig",
}) as any as S.Schema<ReadReceiptConfig>;
export interface BatchUnameSuccessResponseItem {
  uname: string;
  username: string;
}
export const BatchUnameSuccessResponseItem = S.suspend(() =>
  S.Struct({ uname: S.String, username: S.String }),
).annotations({
  identifier: "BatchUnameSuccessResponseItem",
}) as any as S.Schema<BatchUnameSuccessResponseItem>;
export type BatchUnameSuccessResponseItems = BatchUnameSuccessResponseItem[];
export const BatchUnameSuccessResponseItems = S.Array(
  BatchUnameSuccessResponseItem,
);
export interface BatchUnameErrorResponseItem {
  field?: string;
  reason?: string;
  uname: string;
}
export const BatchUnameErrorResponseItem = S.suspend(() =>
  S.Struct({
    field: S.optional(S.String),
    reason: S.optional(S.String),
    uname: S.String,
  }),
).annotations({
  identifier: "BatchUnameErrorResponseItem",
}) as any as S.Schema<BatchUnameErrorResponseItem>;
export type BatchUnameErrorResponseItems = BatchUnameErrorResponseItem[];
export const BatchUnameErrorResponseItems = S.Array(
  BatchUnameErrorResponseItem,
);
export interface BatchDeviceSuccessResponseItem {
  appId: string;
}
export const BatchDeviceSuccessResponseItem = S.suspend(() =>
  S.Struct({ appId: S.String }),
).annotations({
  identifier: "BatchDeviceSuccessResponseItem",
}) as any as S.Schema<BatchDeviceSuccessResponseItem>;
export type BatchDeviceSuccessResponseItems = BatchDeviceSuccessResponseItem[];
export const BatchDeviceSuccessResponseItems = S.Array(
  BatchDeviceSuccessResponseItem,
);
export interface BatchDeviceErrorResponseItem {
  field?: string;
  reason?: string;
  appId: string;
}
export const BatchDeviceErrorResponseItem = S.suspend(() =>
  S.Struct({
    field: S.optional(S.String),
    reason: S.optional(S.String),
    appId: S.String,
  }),
).annotations({
  identifier: "BatchDeviceErrorResponseItem",
}) as any as S.Schema<BatchDeviceErrorResponseItem>;
export type BatchDeviceErrorResponseItems = BatchDeviceErrorResponseItem[];
export const BatchDeviceErrorResponseItems = S.Array(
  BatchDeviceErrorResponseItem,
);
export interface SecurityGroupSettingsRequest {
  lockoutThreshold?: number;
  permittedNetworks?: PermittedNetworksList;
  enableGuestFederation?: boolean;
  globalFederation?: boolean;
  federationMode?: number;
  enableRestrictedGlobalFederation?: boolean;
  permittedWickrAwsNetworks?: WickrAwsNetworksList;
  permittedWickrEnterpriseNetworks?: PermittedWickrEnterpriseNetworksList;
}
export const SecurityGroupSettingsRequest = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "SecurityGroupSettingsRequest",
}) as any as S.Schema<SecurityGroupSettingsRequest>;
export interface GuestUserHistoryCount {
  month: string;
  count: string;
}
export const GuestUserHistoryCount = S.suspend(() =>
  S.Struct({ month: S.String, count: S.String }),
).annotations({
  identifier: "GuestUserHistoryCount",
}) as any as S.Schema<GuestUserHistoryCount>;
export type GuestUserHistoryCountList = GuestUserHistoryCount[];
export const GuestUserHistoryCountList = S.Array(GuestUserHistoryCount);
export interface Setting {
  optionName: string;
  value: string;
  type: string;
}
export const Setting = S.suspend(() =>
  S.Struct({ optionName: S.String, value: S.String, type: S.String }),
).annotations({ identifier: "Setting" }) as any as S.Schema<Setting>;
export type SettingsList = Setting[];
export const SettingsList = S.Array(Setting);
export interface OidcConfigInfo {
  applicationName?: string;
  clientId?: string;
  companyId: string;
  scopes: string;
  issuer: string;
  clientSecret?: string | Redacted.Redacted<string>;
  secret?: string | Redacted.Redacted<string>;
  redirectUrl?: string;
  userId?: string;
  customUsername?: string;
  caCertificate?: string;
  applicationId?: number;
  ssoTokenBufferMinutes?: number;
  extraAuthParams?: string;
}
export const OidcConfigInfo = S.suspend(() =>
  S.Struct({
    applicationName: S.optional(S.String),
    clientId: S.optional(S.String),
    companyId: S.String,
    scopes: S.String,
    issuer: S.String,
    clientSecret: S.optional(SensitiveString),
    secret: S.optional(SensitiveString),
    redirectUrl: S.optional(S.String),
    userId: S.optional(S.String),
    customUsername: S.optional(S.String),
    caCertificate: S.optional(S.String),
    applicationId: S.optional(S.Number),
    ssoTokenBufferMinutes: S.optional(S.Number),
    extraAuthParams: S.optional(S.String),
  }),
).annotations({
  identifier: "OidcConfigInfo",
}) as any as S.Schema<OidcConfigInfo>;
export interface OidcTokenInfo {
  codeVerifier?: string;
  codeChallenge?: string;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
}
export const OidcTokenInfo = S.suspend(() =>
  S.Struct({
    codeVerifier: S.optional(S.String),
    codeChallenge: S.optional(S.String),
    accessToken: S.optional(S.String),
    idToken: S.optional(S.String),
    refreshToken: S.optional(S.String),
    tokenType: S.optional(S.String),
    expiresIn: S.optional(S.Number),
  }),
).annotations({
  identifier: "OidcTokenInfo",
}) as any as S.Schema<OidcTokenInfo>;
export interface BlockedGuestUser {
  username: string;
  admin: string;
  modified: string;
  usernameHash: string;
}
export const BlockedGuestUser = S.suspend(() =>
  S.Struct({
    username: S.String,
    admin: S.String,
    modified: S.String,
    usernameHash: S.String,
  }),
).annotations({
  identifier: "BlockedGuestUser",
}) as any as S.Schema<BlockedGuestUser>;
export type BlockedGuestUserList = BlockedGuestUser[];
export const BlockedGuestUserList = S.Array(BlockedGuestUser);
export interface Bot {
  botId?: string;
  displayName?: string;
  username?: string;
  uname?: string;
  pubkey?: string;
  status?: number;
  groupId?: string;
  hasChallenge?: boolean;
  suspended?: boolean;
  lastLogin?: string;
}
export const Bot = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Bot" }) as any as S.Schema<Bot>;
export type Bots = Bot[];
export const Bots = S.Array(Bot);
export interface BasicDeviceObject {
  appId?: string;
  created?: string;
  lastLogin?: string;
  statusText?: string;
  suspend?: boolean;
  type?: string;
}
export const BasicDeviceObject = S.suspend(() =>
  S.Struct({
    appId: S.optional(S.String),
    created: S.optional(S.String),
    lastLogin: S.optional(S.String),
    statusText: S.optional(S.String),
    suspend: S.optional(S.Boolean),
    type: S.optional(S.String),
  }),
).annotations({
  identifier: "BasicDeviceObject",
}) as any as S.Schema<BasicDeviceObject>;
export type Devices = BasicDeviceObject[];
export const Devices = S.Array(BasicDeviceObject);
export interface GuestUser {
  billingPeriod: string;
  username: string;
  usernameHash: string;
}
export const GuestUser = S.suspend(() =>
  S.Struct({
    billingPeriod: S.String,
    username: S.String,
    usernameHash: S.String,
  }),
).annotations({ identifier: "GuestUser" }) as any as S.Schema<GuestUser>;
export type GuestUserList = GuestUser[];
export const GuestUserList = S.Array(GuestUser);
export interface Network {
  networkId: string;
  networkName: string;
  accessLevel: string;
  awsAccountId: string;
  networkArn: string;
  standing?: number;
  freeTrialExpiration?: string;
  migrationState?: number;
  encryptionKeyArn?: string;
}
export const Network = S.suspend(() =>
  S.Struct({
    networkId: S.String,
    networkName: S.String,
    accessLevel: S.String,
    awsAccountId: S.String,
    networkArn: S.String,
    standing: S.optional(S.Number),
    freeTrialExpiration: S.optional(S.String),
    migrationState: S.optional(S.Number),
    encryptionKeyArn: S.optional(S.String),
  }),
).annotations({ identifier: "Network" }) as any as S.Schema<Network>;
export type NetworkList = Network[];
export const NetworkList = S.Array(Network);
export interface NetworkSettings {
  enableClientMetrics?: boolean;
  readReceiptConfig?: ReadReceiptConfig;
  dataRetention?: boolean;
}
export const NetworkSettings = S.suspend(() =>
  S.Struct({
    enableClientMetrics: S.optional(S.Boolean),
    readReceiptConfig: S.optional(ReadReceiptConfig),
    dataRetention: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "NetworkSettings",
}) as any as S.Schema<NetworkSettings>;
export interface BatchCreateUserResponse {
  message?: string;
  successful?: Users;
  failed?: BatchUserErrorResponseItems;
}
export const BatchCreateUserResponse = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    successful: S.optional(Users),
    failed: S.optional(BatchUserErrorResponseItems),
  }),
).annotations({
  identifier: "BatchCreateUserResponse",
}) as any as S.Schema<BatchCreateUserResponse>;
export interface BatchDeleteUserResponse {
  message?: string;
  successful?: BatchUserSuccessResponseItems;
  failed?: BatchUserErrorResponseItems;
}
export const BatchDeleteUserResponse = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    successful: S.optional(BatchUserSuccessResponseItems),
    failed: S.optional(BatchUserErrorResponseItems),
  }),
).annotations({
  identifier: "BatchDeleteUserResponse",
}) as any as S.Schema<BatchDeleteUserResponse>;
export interface BatchLookupUserUnameResponse {
  message?: string;
  successful?: BatchUnameSuccessResponseItems;
  failed?: BatchUnameErrorResponseItems;
}
export const BatchLookupUserUnameResponse = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    successful: S.optional(BatchUnameSuccessResponseItems),
    failed: S.optional(BatchUnameErrorResponseItems),
  }),
).annotations({
  identifier: "BatchLookupUserUnameResponse",
}) as any as S.Schema<BatchLookupUserUnameResponse>;
export interface BatchResetDevicesForUserResponse {
  message?: string;
  successful?: BatchDeviceSuccessResponseItems;
  failed?: BatchDeviceErrorResponseItems;
}
export const BatchResetDevicesForUserResponse = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    successful: S.optional(BatchDeviceSuccessResponseItems),
    failed: S.optional(BatchDeviceErrorResponseItems),
  }),
).annotations({
  identifier: "BatchResetDevicesForUserResponse",
}) as any as S.Schema<BatchResetDevicesForUserResponse>;
export interface CreateSecurityGroupRequest {
  networkId: string;
  name: string;
  securityGroupSettings: SecurityGroupSettingsRequest;
  clientToken?: string;
}
export const CreateSecurityGroupRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    name: S.String,
    securityGroupSettings: SecurityGroupSettingsRequest,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Client-Token")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/networks/{networkId}/security-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSecurityGroupRequest",
}) as any as S.Schema<CreateSecurityGroupRequest>;
export interface GetGuestUserHistoryCountResponse {
  history: GuestUserHistoryCountList;
}
export const GetGuestUserHistoryCountResponse = S.suspend(() =>
  S.Struct({ history: GuestUserHistoryCountList }),
).annotations({
  identifier: "GetGuestUserHistoryCountResponse",
}) as any as S.Schema<GetGuestUserHistoryCountResponse>;
export interface GetNetworkSettingsResponse {
  settings: SettingsList;
}
export const GetNetworkSettingsResponse = S.suspend(() =>
  S.Struct({ settings: SettingsList }),
).annotations({
  identifier: "GetNetworkSettingsResponse",
}) as any as S.Schema<GetNetworkSettingsResponse>;
export interface GetOidcInfoResponse {
  openidConnectInfo?: OidcConfigInfo;
  tokenInfo?: OidcTokenInfo;
}
export const GetOidcInfoResponse = S.suspend(() =>
  S.Struct({
    openidConnectInfo: S.optional(OidcConfigInfo),
    tokenInfo: S.optional(OidcTokenInfo),
  }),
).annotations({
  identifier: "GetOidcInfoResponse",
}) as any as S.Schema<GetOidcInfoResponse>;
export interface GetSecurityGroupResponse {
  securityGroup: SecurityGroup;
}
export const GetSecurityGroupResponse = S.suspend(() =>
  S.Struct({ securityGroup: SecurityGroup }),
).annotations({
  identifier: "GetSecurityGroupResponse",
}) as any as S.Schema<GetSecurityGroupResponse>;
export interface ListBlockedGuestUsersResponse {
  nextToken?: string;
  blocklist: BlockedGuestUserList;
}
export const ListBlockedGuestUsersResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    blocklist: BlockedGuestUserList,
  }),
).annotations({
  identifier: "ListBlockedGuestUsersResponse",
}) as any as S.Schema<ListBlockedGuestUsersResponse>;
export interface ListBotsResponse {
  bots: Bots;
  nextToken?: string;
}
export const ListBotsResponse = S.suspend(() =>
  S.Struct({ bots: Bots, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListBotsResponse",
}) as any as S.Schema<ListBotsResponse>;
export interface ListDevicesForUserResponse {
  nextToken?: string;
  devices: Devices;
}
export const ListDevicesForUserResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), devices: Devices }),
).annotations({
  identifier: "ListDevicesForUserResponse",
}) as any as S.Schema<ListDevicesForUserResponse>;
export interface ListGuestUsersResponse {
  nextToken?: string;
  guestlist: GuestUserList;
}
export const ListGuestUsersResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), guestlist: GuestUserList }),
).annotations({
  identifier: "ListGuestUsersResponse",
}) as any as S.Schema<ListGuestUsersResponse>;
export interface ListNetworksResponse {
  networks: NetworkList;
  nextToken?: string;
}
export const ListNetworksResponse = S.suspend(() =>
  S.Struct({ networks: NetworkList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListNetworksResponse",
}) as any as S.Schema<ListNetworksResponse>;
export interface ListSecurityGroupUsersResponse {
  users: Users;
  nextToken?: string;
}
export const ListSecurityGroupUsersResponse = S.suspend(() =>
  S.Struct({ users: Users, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSecurityGroupUsersResponse",
}) as any as S.Schema<ListSecurityGroupUsersResponse>;
export interface UpdateNetworkSettingsRequest {
  networkId: string;
  settings: NetworkSettings;
}
export const UpdateNetworkSettingsRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    settings: NetworkSettings,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/networks/{networkId}/settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNetworkSettingsRequest",
}) as any as S.Schema<UpdateNetworkSettingsRequest>;
export interface UpdateSecurityGroupRequest {
  networkId: string;
  groupId: string;
  name?: string;
  securityGroupSettings?: SecurityGroupSettings;
}
export const UpdateSecurityGroupRequest = S.suspend(() =>
  S.Struct({
    networkId: S.String.pipe(T.HttpLabel("networkId")),
    groupId: S.String.pipe(T.HttpLabel("groupId")),
    name: S.optional(S.String),
    securityGroupSettings: S.optional(SecurityGroupSettings),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateSecurityGroupRequest",
}) as any as S.Schema<UpdateSecurityGroupRequest>;
export interface UpdateUserResponse {
  userId: string;
  networkId: string;
  securityGroupIds?: SecurityGroupIdList;
  firstName?: string | Redacted.Redacted<string>;
  lastName?: string | Redacted.Redacted<string>;
  middleName?: string;
  suspended: boolean;
  modified?: number;
  status?: number;
  inviteCode?: string;
  inviteExpiration?: number;
  codeValidation?: boolean;
}
export const UpdateUserResponse = S.suspend(() =>
  S.Struct({
    userId: S.String,
    networkId: S.String,
    securityGroupIds: S.optional(SecurityGroupIdList),
    firstName: S.optional(SensitiveString),
    lastName: S.optional(SensitiveString),
    middleName: S.optional(S.String),
    suspended: S.Boolean,
    modified: S.optional(S.Number),
    status: S.optional(S.Number),
    inviteCode: S.optional(S.String),
    inviteExpiration: S.optional(S.Number),
    codeValidation: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UpdateUserResponse",
}) as any as S.Schema<UpdateUserResponse>;
export interface CreateSecurityGroupResponse {
  securityGroup: SecurityGroup;
}
export const CreateSecurityGroupResponse = S.suspend(() =>
  S.Struct({ securityGroup: SecurityGroup }),
).annotations({
  identifier: "CreateSecurityGroupResponse",
}) as any as S.Schema<CreateSecurityGroupResponse>;
export interface UpdateNetworkSettingsResponse {
  settings: SettingsList;
}
export const UpdateNetworkSettingsResponse = S.suspend(() =>
  S.Struct({ settings: SettingsList }),
).annotations({
  identifier: "UpdateNetworkSettingsResponse",
}) as any as S.Schema<UpdateNetworkSettingsResponse>;
export interface UpdateSecurityGroupResponse {
  securityGroup: SecurityGroup;
}
export const UpdateSecurityGroupResponse = S.suspend(() =>
  S.Struct({ securityGroup: SecurityGroup }),
).annotations({
  identifier: "UpdateSecurityGroupResponse",
}) as any as S.Schema<UpdateSecurityGroupResponse>;
export interface ErrorDetail {
  field?: string;
  reason?: string;
}
export const ErrorDetail = S.suspend(() =>
  S.Struct({ field: S.optional(S.String), reason: S.optional(S.String) }),
).annotations({ identifier: "ErrorDetail" }) as any as S.Schema<ErrorDetail>;
export type ErrorDetailList = ErrorDetail[];
export const ErrorDetailList = S.Array(ErrorDetail);

//# Errors
export class BadRequestError extends S.TaggedError<BadRequestError>()(
  "BadRequestError",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ForbiddenError extends S.TaggedError<ForbiddenError>()(
  "ForbiddenError",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { message: S.String },
).pipe(C.withServerError) {}
export class RateLimitError extends S.TaggedError<RateLimitError>()(
  "RateLimitError",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundError extends S.TaggedError<ResourceNotFoundError>()(
  "ResourceNotFoundError",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnauthorizedError extends S.TaggedError<UnauthorizedError>()(
  "UnauthorizedError",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ValidationError extends S.TaggedError<ValidationError>()(
  "ValidationError",
  { reasons: S.optional(ErrorDetailList) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Retrieves a paginated list of all Wickr networks associated with your Amazon Web Services account. You can sort the results by network ID or name.
 */
export const listNetworks: {
  (
    input: ListNetworksRequest,
  ): Effect.Effect<
    ListNetworksResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNetworksRequest,
  ) => Stream.Stream<
    ListNetworksResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNetworksRequest,
  ) => Stream.Stream<
    Network,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "networks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new security group in a Wickr network. Security groups allow you to organize users and control their permissions, features, and security settings.
 */
export const createSecurityGroup: (
  input: CreateSecurityGroupRequest,
) => Effect.Effect<
  CreateSecurityGroupResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates network-level settings for a Wickr network. You can modify settings such as client metrics, data retention, and other network-wide options.
 */
export const updateNetworkSettings: (
  input: UpdateNetworkSettingsRequest,
) => Effect.Effect<
  UpdateNetworkSettingsResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the properties of an existing security group in a Wickr network, such as its name or settings.
 */
export const updateSecurityGroup: (
  input: UpdateSecurityGroupRequest,
) => Effect.Effect<
  UpdateSecurityGroupResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Resets multiple devices for a specific user in a Wickr network. This operation forces the selected devices to log out and requires users to re-authenticate, which is useful for security purposes or when devices need to be revoked.
 */
export const batchResetDevicesForUser: (
  input: BatchResetDevicesForUserRequest,
) => Effect.Effect<
  BatchResetDevicesForUserResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves historical guest user count data for a Wickr network, showing the number of guest users per billing period over the past 90 days.
 */
export const getGuestUserHistoryCount: (
  input: GetGuestUserHistoryCountRequest,
) => Effect.Effect<
  GetGuestUserHistoryCountResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves all network-level settings for a Wickr network, including client metrics, data retention, and other configuration options.
 */
export const getNetworkSettings: (
  input: GetNetworkSettingsRequest,
) => Effect.Effect<
  GetNetworkSettingsResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getOidcInfo: (
  input: GetOidcInfoRequest,
) => Effect.Effect<
  GetOidcInfoResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSecurityGroup: (
  input: GetSecurityGroupRequest,
) => Effect.Effect<
  GetSecurityGroupResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBlockedGuestUsers: {
  (
    input: ListBlockedGuestUsersRequest,
  ): Effect.Effect<
    ListBlockedGuestUsersResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBlockedGuestUsersRequest,
  ) => Stream.Stream<
    ListBlockedGuestUsersResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBlockedGuestUsersRequest,
  ) => Stream.Stream<
    BlockedGuestUser,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "blocklist",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of bots in a specified Wickr network. You can filter and sort the results based on various criteria.
 */
export const listBots: {
  (
    input: ListBotsRequest,
  ): Effect.Effect<
    ListBotsResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBotsRequest,
  ) => Stream.Stream<
    ListBotsResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBotsRequest,
  ) => Stream.Stream<
    Bot,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "bots",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of devices associated with a specific user in a Wickr network. This operation returns information about all devices where the user has logged into Wickr.
 */
export const listDevicesForUser: {
  (
    input: ListDevicesForUserRequest,
  ): Effect.Effect<
    ListDevicesForUserResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevicesForUserRequest,
  ) => Stream.Stream<
    ListDevicesForUserResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDevicesForUserRequest,
  ) => Stream.Stream<
    BasicDeviceObject,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "devices",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of guest users who have communicated with your Wickr network. Guest users are external users from federated networks who can communicate with network members.
 */
export const listGuestUsers: {
  (
    input: ListGuestUsersRequest,
  ): Effect.Effect<
    ListGuestUsersResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGuestUsersRequest,
  ) => Stream.Stream<
    ListGuestUsersResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGuestUsersRequest,
  ) => Stream.Stream<
    GuestUser,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "guestlist",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of users who belong to a specific security group in a Wickr network.
 */
export const listSecurityGroupUsers: {
  (
    input: ListSecurityGroupUsersRequest,
  ): Effect.Effect<
    ListSecurityGroupUsersResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecurityGroupUsersRequest,
  ) => Stream.Stream<
    ListSecurityGroupUsersResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecurityGroupUsersRequest,
  ) => Stream.Stream<
    User,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "users",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the properties of an existing user in a Wickr network. This operation allows you to modify the user's name, password, security group membership, and invite code settings.
 *
 * `codeValidation`, `inviteCode`, and `inviteCodeTtl` are restricted to networks under preview only.
 */
export const updateUser: (
  input: UpdateUserRequest,
) => Effect.Effect<
  UpdateUserResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Suspends or unsuspends multiple users in a Wickr network. Suspended users cannot access the network until they are unsuspended. This operation is useful for temporarily restricting access without deleting user accounts.
 */
export const batchToggleUserSuspendStatus: (
  input: BatchToggleUserSuspendStatusRequest,
) => Effect.Effect<
  BatchToggleUserSuspendStatusResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBot: (
  input: CreateBotRequest,
) => Effect.Effect<
  CreateBotResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataRetentionBot: (
  input: CreateDataRetentionBotRequest,
) => Effect.Effect<
  CreateDataRetentionBotResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new challenge password for the data retention bot. This password is used for authentication when the bot connects to the network.
 */
export const createDataRetentionBotChallenge: (
  input: CreateDataRetentionBotChallengeRequest,
) => Effect.Effect<
  CreateDataRetentionBotChallengeResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createNetwork: (
  input: CreateNetworkRequest,
) => Effect.Effect<
  CreateNetworkResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a bot from a specified Wickr network. This operation permanently removes the bot account and its associated data from the network.
 */
export const deleteBot: (
  input: DeleteBotRequest,
) => Effect.Effect<
  DeleteBotResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the data retention bot from a Wickr network. This operation permanently removes the bot and all its associated data from the database.
 */
export const deleteDataRetentionBot: (
  input: DeleteDataRetentionBotRequest,
) => Effect.Effect<
  DeleteDataRetentionBotResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a Wickr network and all its associated resources, including users, bots, security groups, and settings. This operation is permanent and cannot be undone.
 */
export const deleteNetwork: (
  input: DeleteNetworkRequest,
) => Effect.Effect<
  DeleteNetworkResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSecurityGroup: (
  input: DeleteSecurityGroupRequest,
) => Effect.Effect<
  DeleteSecurityGroupResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBot: (
  input: GetBotRequest,
) => Effect.Effect<
  GetBotResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBotsCount: (
  input: GetBotsCountRequest,
) => Effect.Effect<
  GetBotsCountResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataRetentionBot: (
  input: GetDataRetentionBotRequest,
) => Effect.Effect<
  GetDataRetentionBotResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getNetwork: (
  input: GetNetworkRequest,
) => Effect.Effect<
  GetNetworkResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getUser: (
  input: GetUserRequest,
) => Effect.Effect<
  GetUserResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getUsersCount: (
  input: GetUsersCountRequest,
) => Effect.Effect<
  GetUsersCountResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSecurityGroups: {
  (
    input: ListSecurityGroupsRequest,
  ): Effect.Effect<
    ListSecurityGroupsResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecurityGroupsRequest,
  ) => Stream.Stream<
    ListSecurityGroupsResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecurityGroupsRequest,
  ) => Stream.Stream<
    SecurityGroup,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "securityGroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of users in a specified Wickr network. You can filter and sort the results based on various criteria such as name, status, or security group membership.
 */
export const listUsers: {
  (
    input: ListUsersRequest,
  ): Effect.Effect<
    ListUsersResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUsersRequest,
  ) => Stream.Stream<
    ListUsersResponse,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUsersRequest,
  ) => Stream.Stream<
    User,
    | BadRequestError
    | ForbiddenError
    | InternalServerError
    | RateLimitError
    | ResourceNotFoundError
    | UnauthorizedError
    | ValidationError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "users",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Registers and saves an OpenID Connect (OIDC) configuration for a Wickr network, enabling Single Sign-On (SSO) authentication through an identity provider.
 */
export const registerOidcConfig: (
  input: RegisterOidcConfigRequest,
) => Effect.Effect<
  RegisterOidcConfigResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const registerOidcConfigTest: (
  input: RegisterOidcConfigTestRequest,
) => Effect.Effect<
  RegisterOidcConfigTestResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the properties of an existing bot in a Wickr network. This operation allows you to modify the bot's display name, security group, password, or suspension status.
 */
export const updateBot: (
  input: UpdateBotRequest,
) => Effect.Effect<
  UpdateBotResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDataRetention: (
  input: UpdateDataRetentionRequest,
) => Effect.Effect<
  UpdateDataRetentionResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateGuestUser: (
  input: UpdateGuestUserRequest,
) => Effect.Effect<
  UpdateGuestUserResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateNetwork: (
  input: UpdateNetworkRequest,
) => Effect.Effect<
  UpdateNetworkResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchCreateUser: (
  input: BatchCreateUserRequest,
) => Effect.Effect<
  BatchCreateUserResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDeleteUser: (
  input: BatchDeleteUserRequest,
) => Effect.Effect<
  BatchDeleteUserResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchLookupUserUname: (
  input: BatchLookupUserUnameRequest,
) => Effect.Effect<
  BatchLookupUserUnameResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Resends invitation codes to multiple users who have pending invitations in a Wickr network. This operation is useful when users haven't accepted their initial invitations or when invitations have expired.
 */
export const batchReinviteUser: (
  input: BatchReinviteUserRequest,
) => Effect.Effect<
  BatchReinviteUserResponse,
  | BadRequestError
  | ForbiddenError
  | InternalServerError
  | RateLimitError
  | ResourceNotFoundError
  | UnauthorizedError
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
