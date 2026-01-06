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
  sdkId: "SSO",
  serviceShapeName: "SWBPortalService",
});
const auth = T.AwsAuthSigv4({ name: "awsssoportal" });
const ver = T.ServiceVersion("2019-06-10");
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
                        url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://portal.sso.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}",
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
export type RoleNameType = string;
export type AccountIdType = string;
export type AccessTokenType = string | Redacted.Redacted<string>;
export type NextTokenType = string;
export type MaxResultType = number;
export type ErrorDescription = string;
export type AccessKeyType = string;
export type SecretAccessKeyType = string | Redacted.Redacted<string>;
export type SessionTokenType = string | Redacted.Redacted<string>;
export type ExpirationTimestampType = number;
export type AccountNameType = string;
export type EmailAddressType = string;

//# Schemas
export interface GetRoleCredentialsRequest {
  roleName: string;
  accountId: string;
  accessToken: string | Redacted.Redacted<string>;
}
export const GetRoleCredentialsRequest = S.suspend(() =>
  S.Struct({
    roleName: S.String.pipe(T.HttpQuery("role_name")),
    accountId: S.String.pipe(T.HttpQuery("account_id")),
    accessToken: SensitiveString.pipe(T.HttpHeader("x-amz-sso_bearer_token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/federation/credentials" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRoleCredentialsRequest",
}) as any as S.Schema<GetRoleCredentialsRequest>;
export interface ListAccountRolesRequest {
  nextToken?: string;
  maxResults?: number;
  accessToken: string | Redacted.Redacted<string>;
  accountId: string;
}
export const ListAccountRolesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_result")),
    accessToken: SensitiveString.pipe(T.HttpHeader("x-amz-sso_bearer_token")),
    accountId: S.String.pipe(T.HttpQuery("account_id")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assignment/roles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccountRolesRequest",
}) as any as S.Schema<ListAccountRolesRequest>;
export interface ListAccountsRequest {
  nextToken?: string;
  maxResults?: number;
  accessToken: string | Redacted.Redacted<string>;
}
export const ListAccountsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_result")),
    accessToken: SensitiveString.pipe(T.HttpHeader("x-amz-sso_bearer_token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assignment/accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccountsRequest",
}) as any as S.Schema<ListAccountsRequest>;
export interface LogoutRequest {
  accessToken: string | Redacted.Redacted<string>;
}
export const LogoutRequest = S.suspend(() =>
  S.Struct({
    accessToken: SensitiveString.pipe(T.HttpHeader("x-amz-sso_bearer_token")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/logout" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "LogoutRequest",
}) as any as S.Schema<LogoutRequest>;
export interface LogoutResponse {}
export const LogoutResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "LogoutResponse",
}) as any as S.Schema<LogoutResponse>;
export interface RoleCredentials {
  accessKeyId?: string;
  secretAccessKey?: string | Redacted.Redacted<string>;
  sessionToken?: string | Redacted.Redacted<string>;
  expiration?: number;
}
export const RoleCredentials = S.suspend(() =>
  S.Struct({
    accessKeyId: S.optional(S.String),
    secretAccessKey: S.optional(SensitiveString),
    sessionToken: S.optional(SensitiveString),
    expiration: S.optional(S.Number),
  }),
).annotations({
  identifier: "RoleCredentials",
}) as any as S.Schema<RoleCredentials>;
export interface RoleInfo {
  roleName?: string;
  accountId?: string;
}
export const RoleInfo = S.suspend(() =>
  S.Struct({ roleName: S.optional(S.String), accountId: S.optional(S.String) }),
).annotations({ identifier: "RoleInfo" }) as any as S.Schema<RoleInfo>;
export type RoleListType = RoleInfo[];
export const RoleListType = S.Array(RoleInfo);
export interface AccountInfo {
  accountId?: string;
  accountName?: string;
  emailAddress?: string;
}
export const AccountInfo = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    accountName: S.optional(S.String),
    emailAddress: S.optional(S.String),
  }),
).annotations({ identifier: "AccountInfo" }) as any as S.Schema<AccountInfo>;
export type AccountListType = AccountInfo[];
export const AccountListType = S.Array(AccountInfo);
export interface GetRoleCredentialsResponse {
  roleCredentials?: RoleCredentials;
}
export const GetRoleCredentialsResponse = S.suspend(() =>
  S.Struct({ roleCredentials: S.optional(RoleCredentials) }),
).annotations({
  identifier: "GetRoleCredentialsResponse",
}) as any as S.Schema<GetRoleCredentialsResponse>;
export interface ListAccountRolesResponse {
  nextToken?: string;
  roleList?: RoleListType;
}
export const ListAccountRolesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    roleList: S.optional(RoleListType),
  }),
).annotations({
  identifier: "ListAccountRolesResponse",
}) as any as S.Schema<ListAccountRolesResponse>;
export interface ListAccountsResponse {
  nextToken?: string;
  accountList?: AccountListType;
}
export const ListAccountsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    accountList: S.optional(AccountListType),
  }),
).annotations({
  identifier: "ListAccountsResponse",
}) as any as S.Schema<ListAccountsResponse>;

//# Errors
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Removes the locally stored SSO tokens from the client-side cache and sends an API call to
 * the IAM Identity Center service to invalidate the corresponding server-side IAM Identity Center sign in
 * session.
 *
 * If a user uses IAM Identity Center to access the AWS CLI, the user’s IAM Identity Center sign in session is
 * used to obtain an IAM session, as specified in the corresponding IAM Identity Center permission set.
 * More specifically, IAM Identity Center assumes an IAM role in the target account on behalf of the user,
 * and the corresponding temporary AWS credentials are returned to the client.
 *
 * After user logout, any existing IAM role sessions that were created by using IAM Identity Center
 * permission sets continue based on the duration configured in the permission set.
 * For more information, see User
 * authentications in the IAM Identity Center User
 * Guide.
 */
export const logout: (
  input: LogoutRequest,
) => Effect.Effect<
  LogoutResponse,
  | InvalidRequestException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: LogoutRequest,
  output: LogoutResponse,
  errors: [
    InvalidRequestException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Lists all roles that are assigned to the user for a given AWS account.
 */
export const listAccountRoles: {
  (
    input: ListAccountRolesRequest,
  ): Effect.Effect<
    ListAccountRolesResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountRolesRequest,
  ) => Stream.Stream<
    ListAccountRolesResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountRolesRequest,
  ) => Stream.Stream<
    RoleInfo,
    | InvalidRequestException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountRolesRequest,
  output: ListAccountRolesResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "roleList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all AWS accounts assigned to the user. These AWS accounts are assigned by the
 * administrator of the account. For more information, see Assign User Access in the *IAM Identity Center User Guide*. This operation
 * returns a paginated response.
 */
export const listAccounts: {
  (
    input: ListAccountsRequest,
  ): Effect.Effect<
    ListAccountsResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountsRequest,
  ) => Stream.Stream<
    ListAccountsResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountsRequest,
  ) => Stream.Stream<
    AccountInfo,
    | InvalidRequestException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountsRequest,
  output: ListAccountsResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "accountList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns the STS short-term credentials for a given role name that is assigned to the
 * user.
 */
export const getRoleCredentials: (
  input: GetRoleCredentialsRequest,
) => Effect.Effect<
  GetRoleCredentialsResponse,
  | InvalidRequestException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRoleCredentialsRequest,
  output: GetRoleCredentialsResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
