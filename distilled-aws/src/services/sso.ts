import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
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
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://portal.sso-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://portal.sso.${Region}.amazonaws.com`);
            }
            return e(
              `https://portal.sso-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://portal.sso.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://portal.sso.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type RoleNameType = string;
export type AccountIdType = string;
export type AccessTokenType = string | redacted.Redacted<string>;
export type NextTokenType = string;
export type MaxResultType = number;
export type ErrorDescription = string;
export type AccessKeyType = string;
export type SecretAccessKeyType = string | redacted.Redacted<string>;
export type SessionTokenType = string | redacted.Redacted<string>;
export type ExpirationTimestampType = number;
export type AccountNameType = string;
export type EmailAddressType = string;

//# Schemas
export interface GetRoleCredentialsRequest {
  roleName: string;
  accountId: string;
  accessToken: string | redacted.Redacted<string>;
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
  accessToken: string | redacted.Redacted<string>;
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
  accessToken: string | redacted.Redacted<string>;
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
  accessToken: string | redacted.Redacted<string>;
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
  secretAccessKey?: string | redacted.Redacted<string>;
  sessionToken?: string | redacted.Redacted<string>;
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
  roleList?: RoleInfo[];
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
  accountList?: AccountInfo[];
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
) => effect.Effect<
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
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
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
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
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
) => effect.Effect<
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
