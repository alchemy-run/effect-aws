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
const svc = T.AwsApiService({ sdkId: "Signin", serviceShapeName: "Signin" });
const auth = T.AwsAuthSigv4({ name: "signin" });
const ver = T.ServiceVersion("2023-01-01");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(`https://${Region}.signin.aws.amazon.com`);
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(`https://${Region}.signin.amazonaws.cn`);
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(`https://${Region}.signin.amazonaws-us-gov.com`);
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://signin-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://signin-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://signin.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://signin.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClientId = string;
export type GrantType = string;
export type AuthorizationCode = string;
export type RedirectUri = string;
export type CodeVerifier = string;
export type RefreshToken = string | redacted.Redacted<string>;
export type TokenType = string;
export type ExpiresIn = number;
export type IdToken = string;

//# Schemas
export interface CreateOAuth2TokenRequestBody {
  clientId: string;
  grantType: string;
  code?: string;
  redirectUri?: string;
  codeVerifier?: string;
  refreshToken?: string | redacted.Redacted<string>;
}
export const CreateOAuth2TokenRequestBody = S.suspend(() =>
  S.Struct({
    clientId: S.String.pipe(T.JsonName("clientId")),
    grantType: S.String.pipe(T.JsonName("grantType")),
    code: S.optional(S.String),
    redirectUri: S.optional(S.String).pipe(T.JsonName("redirectUri")),
    codeVerifier: S.optional(S.String).pipe(T.JsonName("codeVerifier")),
    refreshToken: S.optional(SensitiveString).pipe(T.JsonName("refreshToken")),
  }),
).annotations({
  identifier: "CreateOAuth2TokenRequestBody",
}) as any as S.Schema<CreateOAuth2TokenRequestBody>;
export interface CreateOAuth2TokenRequest {
  tokenInput: CreateOAuth2TokenRequestBody;
}
export const CreateOAuth2TokenRequest = S.suspend(() =>
  S.Struct({
    tokenInput: CreateOAuth2TokenRequestBody.pipe(T.HttpPayload()).annotations({
      identifier: "CreateOAuth2TokenRequestBody",
    }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/token" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOAuth2TokenRequest",
}) as any as S.Schema<CreateOAuth2TokenRequest>;
export interface AccessToken {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
}
export const AccessToken = S.suspend(() =>
  S.Struct({
    accessKeyId: S.String.pipe(T.JsonName("accessKeyId")),
    secretAccessKey: S.String.pipe(T.JsonName("secretAccessKey")),
    sessionToken: S.String.pipe(T.JsonName("sessionToken")),
  }),
).annotations({ identifier: "AccessToken" }) as any as S.Schema<AccessToken>;
export interface CreateOAuth2TokenResponseBody {
  accessToken: AccessToken;
  tokenType: string;
  expiresIn: number;
  refreshToken: string | redacted.Redacted<string>;
  idToken?: string;
}
export const CreateOAuth2TokenResponseBody = S.suspend(() =>
  S.Struct({
    accessToken: AccessToken.pipe(T.JsonName("accessToken")).annotations({
      identifier: "AccessToken",
    }),
    tokenType: S.String.pipe(T.JsonName("tokenType")),
    expiresIn: S.Number.pipe(T.JsonName("expiresIn")),
    refreshToken: SensitiveString.pipe(T.JsonName("refreshToken")),
    idToken: S.optional(S.String).pipe(T.JsonName("idToken")),
  }),
).annotations({
  identifier: "CreateOAuth2TokenResponseBody",
}) as any as S.Schema<CreateOAuth2TokenResponseBody>;
export interface CreateOAuth2TokenResponse {
  tokenOutput: CreateOAuth2TokenResponseBody;
}
export const CreateOAuth2TokenResponse = S.suspend(() =>
  S.Struct({
    tokenOutput: CreateOAuth2TokenResponseBody.pipe(
      T.HttpPayload(),
    ).annotations({ identifier: "CreateOAuth2TokenResponseBody" }),
  }),
).annotations({
  identifier: "CreateOAuth2TokenResponse",
}) as any as S.Schema<CreateOAuth2TokenResponse>;
export type OAuth2ErrorCode =
  | "TOKEN_EXPIRED"
  | "USER_CREDENTIALS_CHANGED"
  | "INSUFFICIENT_PERMISSIONS"
  | "AUTHCODE_EXPIRED"
  | "server_error"
  | "INVALID_REQUEST"
  | (string & {});
export const OAuth2ErrorCode = S.String;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { error: OAuth2ErrorCode, message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { error: OAuth2ErrorCode, message: S.String },
).pipe(C.withServerError) {}
export class TooManyRequestsError extends S.TaggedError<TooManyRequestsError>()(
  "TooManyRequestsError",
  { error: OAuth2ErrorCode, message: S.String },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { error: OAuth2ErrorCode, message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * CreateOAuth2Token API
 *
 * Path: /v1/token
 * Request Method: POST
 * Content-Type: application/json or application/x-www-form-urlencoded
 *
 * This API implements OAuth 2.0 flows for AWS Sign-In CLI clients, supporting both:
 * 1. Authorization code redemption (grant_type=authorization_code) - NOT idempotent
 * 2. Token refresh (grant_type=refresh_token) - Idempotent within token validity window
 *
 * The operation behavior is determined by the grant_type parameter in the request body:
 *
 * **Authorization Code Flow (NOT Idempotent):**
 * - JSON or form-encoded body with client_id, grant_type=authorization_code, code, redirect_uri, code_verifier
 * - Returns access_token, token_type, expires_in, refresh_token, and id_token
 * - Each authorization code can only be used ONCE for security (prevents replay attacks)
 *
 * **Token Refresh Flow (Idempotent):**
 * - JSON or form-encoded body with client_id, grant_type=refresh_token, refresh_token
 * - Returns access_token, token_type, expires_in, and refresh_token (no id_token)
 * - Multiple calls with same refresh_token return consistent results within validity window
 *
 * Authentication and authorization:
 * - Confidential clients: sigv4 signing required with signin:ExchangeToken permissions
 * - CLI clients (public): authn/authz skipped based on client_id & grant_type
 *
 * Note: This operation cannot be marked as @idempotent because it handles both idempotent
 * (token refresh) and non-idempotent (auth code redemption) flows in a single endpoint.
 */
export const createOAuth2Token: (
  input: CreateOAuth2TokenRequest,
) => effect.Effect<
  CreateOAuth2TokenResponse,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsError
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOAuth2TokenRequest,
  output: CreateOAuth2TokenResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    TooManyRequestsError,
    ValidationException,
  ],
}));
