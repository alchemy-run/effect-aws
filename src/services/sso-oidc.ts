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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "SSO OIDC",
  serviceShapeName: "AWSSSOOIDCService",
});
const auth = T.AwsAuthSigv4({ name: "sso-oauth" });
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
                        url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://oidc.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}",
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
export type ClientId = string;
export type ClientSecret = string | Redacted.Redacted<string>;
export type GrantType = string;
export type DeviceCode = string;
export type AuthCode = string;
export type RefreshToken = string | Redacted.Redacted<string>;
export type Scope = string;
export type URI = string;
export type CodeVerifier = string | Redacted.Redacted<string>;
export type Assertion = string | Redacted.Redacted<string>;
export type SubjectToken = string | Redacted.Redacted<string>;
export type TokenTypeURI = string;
export type ClientName = string;
export type ClientType = string;
export type ArnType = string;
export type AccessToken = string | Redacted.Redacted<string>;
export type TokenType = string;
export type ExpirationInSeconds = number;
export type IdToken = string | Redacted.Redacted<string>;
export type LongTimeStampType = number;
export type UserCode = string;
export type IntervalInSeconds = number;
export type IdentityContext = string;
export type ErrorDescription = string;
export type Location = string;
export type Region = string;

//# Schemas
export type Scopes = string[];
export const Scopes = S.Array(S.String);
export type RedirectUris = string[];
export const RedirectUris = S.Array(S.String);
export type GrantTypes = string[];
export const GrantTypes = S.Array(S.String);
export interface CreateTokenRequest {
  clientId: string;
  clientSecret: string | Redacted.Redacted<string>;
  grantType: string;
  deviceCode?: string;
  code?: string;
  refreshToken?: string | Redacted.Redacted<string>;
  scope?: Scopes;
  redirectUri?: string;
  codeVerifier?: string | Redacted.Redacted<string>;
}
export const CreateTokenRequest = S.suspend(() =>
  S.Struct({
    clientId: S.String,
    clientSecret: SensitiveString,
    grantType: S.String,
    deviceCode: S.optional(S.String),
    code: S.optional(S.String),
    refreshToken: S.optional(SensitiveString),
    scope: S.optional(Scopes),
    redirectUri: S.optional(S.String),
    codeVerifier: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/token" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTokenRequest",
}) as any as S.Schema<CreateTokenRequest>;
export interface CreateTokenWithIAMRequest {
  clientId: string;
  grantType: string;
  code?: string;
  refreshToken?: string | Redacted.Redacted<string>;
  assertion?: string | Redacted.Redacted<string>;
  scope?: Scopes;
  redirectUri?: string;
  subjectToken?: string | Redacted.Redacted<string>;
  subjectTokenType?: string;
  requestedTokenType?: string;
  codeVerifier?: string | Redacted.Redacted<string>;
}
export const CreateTokenWithIAMRequest = S.suspend(() =>
  S.Struct({
    clientId: S.String,
    grantType: S.String,
    code: S.optional(S.String),
    refreshToken: S.optional(SensitiveString),
    assertion: S.optional(SensitiveString),
    scope: S.optional(Scopes),
    redirectUri: S.optional(S.String),
    subjectToken: S.optional(SensitiveString),
    subjectTokenType: S.optional(S.String),
    requestedTokenType: S.optional(S.String),
    codeVerifier: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/token?aws_iam=t" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTokenWithIAMRequest",
}) as any as S.Schema<CreateTokenWithIAMRequest>;
export interface RegisterClientRequest {
  clientName: string;
  clientType: string;
  scopes?: Scopes;
  redirectUris?: RedirectUris;
  grantTypes?: GrantTypes;
  issuerUrl?: string;
  entitledApplicationArn?: string;
}
export const RegisterClientRequest = S.suspend(() =>
  S.Struct({
    clientName: S.String,
    clientType: S.String,
    scopes: S.optional(Scopes),
    redirectUris: S.optional(RedirectUris),
    grantTypes: S.optional(GrantTypes),
    issuerUrl: S.optional(S.String),
    entitledApplicationArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/client/register" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterClientRequest",
}) as any as S.Schema<RegisterClientRequest>;
export interface StartDeviceAuthorizationRequest {
  clientId: string;
  clientSecret: string | Redacted.Redacted<string>;
  startUrl: string;
}
export const StartDeviceAuthorizationRequest = S.suspend(() =>
  S.Struct({
    clientId: S.String,
    clientSecret: SensitiveString,
    startUrl: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/device_authorization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDeviceAuthorizationRequest",
}) as any as S.Schema<StartDeviceAuthorizationRequest>;
export interface CreateTokenResponse {
  accessToken?: string | Redacted.Redacted<string>;
  tokenType?: string;
  expiresIn?: number;
  refreshToken?: string | Redacted.Redacted<string>;
  idToken?: string | Redacted.Redacted<string>;
}
export const CreateTokenResponse = S.suspend(() =>
  S.Struct({
    accessToken: S.optional(SensitiveString),
    tokenType: S.optional(S.String),
    expiresIn: S.optional(S.Number),
    refreshToken: S.optional(SensitiveString),
    idToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "CreateTokenResponse",
}) as any as S.Schema<CreateTokenResponse>;
export interface RegisterClientResponse {
  clientId?: string;
  clientSecret?: string | Redacted.Redacted<string>;
  clientIdIssuedAt?: number;
  clientSecretExpiresAt?: number;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
}
export const RegisterClientResponse = S.suspend(() =>
  S.Struct({
    clientId: S.optional(S.String),
    clientSecret: S.optional(SensitiveString),
    clientIdIssuedAt: S.optional(S.Number),
    clientSecretExpiresAt: S.optional(S.Number),
    authorizationEndpoint: S.optional(S.String),
    tokenEndpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterClientResponse",
}) as any as S.Schema<RegisterClientResponse>;
export interface StartDeviceAuthorizationResponse {
  deviceCode?: string;
  userCode?: string;
  verificationUri?: string;
  verificationUriComplete?: string;
  expiresIn?: number;
  interval?: number;
}
export const StartDeviceAuthorizationResponse = S.suspend(() =>
  S.Struct({
    deviceCode: S.optional(S.String),
    userCode: S.optional(S.String),
    verificationUri: S.optional(S.String),
    verificationUriComplete: S.optional(S.String),
    expiresIn: S.optional(S.Number),
    interval: S.optional(S.Number),
  }),
).annotations({
  identifier: "StartDeviceAuthorizationResponse",
}) as any as S.Schema<StartDeviceAuthorizationResponse>;
export interface AwsAdditionalDetails {
  identityContext?: string;
}
export const AwsAdditionalDetails = S.suspend(() =>
  S.Struct({ identityContext: S.optional(S.String) }),
).annotations({
  identifier: "AwsAdditionalDetails",
}) as any as S.Schema<AwsAdditionalDetails>;
export interface CreateTokenWithIAMResponse {
  accessToken?: string | Redacted.Redacted<string>;
  tokenType?: string;
  expiresIn?: number;
  refreshToken?: string | Redacted.Redacted<string>;
  idToken?: string | Redacted.Redacted<string>;
  issuedTokenType?: string;
  scope?: Scopes;
  awsAdditionalDetails?: AwsAdditionalDetails;
}
export const CreateTokenWithIAMResponse = S.suspend(() =>
  S.Struct({
    accessToken: S.optional(SensitiveString),
    tokenType: S.optional(S.String),
    expiresIn: S.optional(S.Number),
    refreshToken: S.optional(SensitiveString),
    idToken: S.optional(SensitiveString),
    issuedTokenType: S.optional(S.String),
    scope: S.optional(Scopes),
    awsAdditionalDetails: S.optional(AwsAdditionalDetails),
  }),
).annotations({
  identifier: "CreateTokenWithIAMResponse",
}) as any as S.Schema<CreateTokenWithIAMResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    error: S.optional(S.String),
    reason: S.optional(S.String),
    error_description: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { error: S.optional(S.String), error_description: S.optional(S.String) },
).pipe(C.withServerError) {}
export class AuthorizationPendingException extends S.TaggedError<AuthorizationPendingException>()(
  "AuthorizationPendingException",
  { error: S.optional(S.String), error_description: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidClientMetadataException extends S.TaggedError<InvalidClientMetadataException>()(
  "InvalidClientMetadataException",
  { error: S.optional(S.String), error_description: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidClientException extends S.TaggedError<InvalidClientException>()(
  "InvalidClientException",
  { error: S.optional(S.String), error_description: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ExpiredTokenException extends S.TaggedError<ExpiredTokenException>()(
  "ExpiredTokenException",
  { error: S.optional(S.String), error_description: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidRedirectUriException extends S.TaggedError<InvalidRedirectUriException>()(
  "InvalidRedirectUriException",
  { error: S.optional(S.String), error_description: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {
    error: S.optional(S.String),
    reason: S.optional(S.String),
    error_description: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class InvalidGrantException extends S.TaggedError<InvalidGrantException>()(
  "InvalidGrantException",
  { error: S.optional(S.String), error_description: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SlowDownException extends S.TaggedError<SlowDownException>()(
  "SlowDownException",
  { error: S.optional(S.String), error_description: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidScopeException extends S.TaggedError<InvalidScopeException>()(
  "InvalidScopeException",
  { error: S.optional(S.String), error_description: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidRequestRegionException extends S.TaggedError<InvalidRequestRegionException>()(
  "InvalidRequestRegionException",
  {
    error: S.optional(S.String),
    error_description: S.optional(S.String),
    endpoint: S.optional(S.String),
    region: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class UnauthorizedClientException extends S.TaggedError<UnauthorizedClientException>()(
  "UnauthorizedClientException",
  { error: S.optional(S.String), error_description: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedGrantTypeException extends S.TaggedError<UnsupportedGrantTypeException>()(
  "UnsupportedGrantTypeException",
  { error: S.optional(S.String), error_description: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Initiates device authorization by requesting a pair of verification codes from the
 * authorization service.
 */
export const startDeviceAuthorization: (
  input: StartDeviceAuthorizationRequest,
) => Effect.Effect<
  StartDeviceAuthorizationResponse,
  | InternalServerException
  | InvalidClientException
  | InvalidRequestException
  | SlowDownException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDeviceAuthorizationRequest,
  output: StartDeviceAuthorizationResponse,
  errors: [
    InternalServerException,
    InvalidClientException,
    InvalidRequestException,
    SlowDownException,
    UnauthorizedClientException,
  ],
}));
/**
 * Registers a public client with IAM Identity Center. This allows clients to perform authorization using
 * the authorization code grant with Proof Key for Code Exchange (PKCE) or the device
 * code grant.
 */
export const registerClient: (
  input: RegisterClientRequest,
) => Effect.Effect<
  RegisterClientResponse,
  | InternalServerException
  | InvalidClientMetadataException
  | InvalidRedirectUriException
  | InvalidRequestException
  | InvalidScopeException
  | SlowDownException
  | UnsupportedGrantTypeException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterClientRequest,
  output: RegisterClientResponse,
  errors: [
    InternalServerException,
    InvalidClientMetadataException,
    InvalidRedirectUriException,
    InvalidRequestException,
    InvalidScopeException,
    SlowDownException,
    UnsupportedGrantTypeException,
  ],
}));
/**
 * Creates and returns access and refresh tokens for clients that are authenticated using
 * client secrets. The access token can be used to fetch short-lived credentials for the assigned
 * AWS accounts or to access application APIs using `bearer` authentication.
 */
export const createToken: (
  input: CreateTokenRequest,
) => Effect.Effect<
  CreateTokenResponse,
  | AccessDeniedException
  | AuthorizationPendingException
  | ExpiredTokenException
  | InternalServerException
  | InvalidClientException
  | InvalidGrantException
  | InvalidRequestException
  | InvalidScopeException
  | SlowDownException
  | UnauthorizedClientException
  | UnsupportedGrantTypeException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTokenRequest,
  output: CreateTokenResponse,
  errors: [
    AccessDeniedException,
    AuthorizationPendingException,
    ExpiredTokenException,
    InternalServerException,
    InvalidClientException,
    InvalidGrantException,
    InvalidRequestException,
    InvalidScopeException,
    SlowDownException,
    UnauthorizedClientException,
    UnsupportedGrantTypeException,
  ],
}));
/**
 * Creates and returns access and refresh tokens for authorized client applications that are
 * authenticated using any IAM entity, such as a service
 * role or user. These tokens might contain defined scopes that specify permissions such as `read:profile` or `write:data`. Through downscoping, you can use the scopes parameter to request tokens with reduced permissions compared to the original client application's permissions or, if applicable, the refresh token's scopes. The access token can be used to fetch short-lived credentials for the assigned
 * Amazon Web Services accounts or to access application APIs using `bearer` authentication.
 *
 * This API is used with Signature Version 4. For more information, see Amazon Web Services Signature
 * Version 4 for API Requests.
 */
export const createTokenWithIAM: (
  input: CreateTokenWithIAMRequest,
) => Effect.Effect<
  CreateTokenWithIAMResponse,
  | AccessDeniedException
  | AuthorizationPendingException
  | ExpiredTokenException
  | InternalServerException
  | InvalidClientException
  | InvalidGrantException
  | InvalidRequestException
  | InvalidRequestRegionException
  | InvalidScopeException
  | SlowDownException
  | UnauthorizedClientException
  | UnsupportedGrantTypeException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTokenWithIAMRequest,
  output: CreateTokenWithIAMResponse,
  errors: [
    AccessDeniedException,
    AuthorizationPendingException,
    ExpiredTokenException,
    InternalServerException,
    InvalidClientException,
    InvalidGrantException,
    InvalidRequestException,
    InvalidRequestRegionException,
    InvalidScopeException,
    SlowDownException,
    UnauthorizedClientException,
    UnsupportedGrantTypeException,
  ],
}));
