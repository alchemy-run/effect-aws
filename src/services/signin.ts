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
const svc = T.AwsApiService({ sdkId: "Signin", serviceShapeName: "Signin" });
const auth = T.AwsAuthSigv4({ name: "signin" });
const ver = T.ServiceVersion("2023-01-01");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://{Region}.signin.aws.amazon.com",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://{Region}.signin.amazonaws.cn",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://{Region}.signin.amazonaws-us-gov.com",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                          endpoint: {
                            url: "https://signin-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
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
                          endpoint: {
                            url: "https://signin-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
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
                          endpoint: {
                            url: "https://signin.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://signin.{Region}.{PartitionResult#dnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Newtypes
export type ClientId = string;
export type GrantType = string;
export type AuthorizationCode = string;
export type RedirectUri = string;
export type CodeVerifier = string;
export type RefreshToken = string | Redacted.Redacted<string>;
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
  refreshToken?: string | Redacted.Redacted<string>;
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
  refreshToken: string | Redacted.Redacted<string>;
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

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { error: S.String, message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { error: S.String, message: S.String },
).pipe(C.withServerError) {}
export class TooManyRequestsError extends S.TaggedError<TooManyRequestsError>()(
  "TooManyRequestsError",
  { error: S.String, message: S.String },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { error: S.String, message: S.String },
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
) => Effect.Effect<
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
