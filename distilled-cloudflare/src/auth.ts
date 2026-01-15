/**
 * Authentication for Cloudflare API.
 *
 * Cloudflare supports three authentication methods:
 * 1. API Token (recommended) - scoped to specific permissions
 * 2. API Key + Email - global access to all resources
 * 3. OAuth - client credentials with refresh token
 *
 * @see https://developers.cloudflare.com/fundamentals/api/
 */

import { HttpClient, HttpClientRequest, HttpBody } from "@effect/platform";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";

/**
 * OAuth token endpoint for Cloudflare.
 */
const CLOUDFLARE_TOKEN_ENDPOINT = "https://dash.cloudflare.com/oauth2/token";

/**
 * Error thrown when OAuth token refresh fails.
 */
export class OAuthError extends Data.TaggedError("OAuthError")<{
  readonly message: string;
  readonly error?: string;
  readonly cause?: unknown;
}> {}

/**
 * Cloudflare authentication - API Token, API Key + Email, or OAuth.
 */
export type CloudflareAuth =
  | { readonly type: "token"; readonly token: Redacted.Redacted<string> }
  | {
      readonly type: "key";
      readonly apiKey: Redacted.Redacted<string>;
      readonly email: string;
    }
  | {
      readonly type: "oauth";
      readonly accessToken: Redacted.Redacted<string>;
    };

export interface ApiToken {
  readonly auth: CloudflareAuth;
}

export const ApiToken = Context.GenericTag<ApiToken>("@distilled-cloudflare/ApiToken");

/**
 * Cloudflare Account ID - required for account-scoped operations.
 */
export interface AccountId {
  readonly accountId: string;
}

export const AccountId = Context.GenericTag<AccountId>("@distilled-cloudflare/AccountId");

/**
 * Cloudflare Zone ID - required for zone-scoped operations.
 */
export interface ZoneId {
  readonly zoneId: string;
}

export const ZoneId = Context.GenericTag<ZoneId>("@distilled-cloudflare/ZoneId");

/**
 * Create an ApiToken layer from environment variables.
 * Reads from CLOUDFLARE_API_TOKEN or (CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL).
 */
export const fromEnv = (): Layer.Layer<ApiToken> =>
  Layer.effect(
    ApiToken,
    Effect.sync(() => {
      const token = process.env.CLOUDFLARE_API_TOKEN;
      if (token) {
        return { auth: { type: "token" as const, token: Redacted.make(token) } };
      }

      const apiKey = process.env.CLOUDFLARE_API_KEY;
      const email = process.env.CLOUDFLARE_EMAIL;
      if (apiKey && email) {
        return {
          auth: {
            type: "key" as const,
            apiKey: Redacted.make(apiKey),
            email,
          },
        };
      }

      throw new Error(
        "Either CLOUDFLARE_API_TOKEN or (CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL) must be set",
      );
    }),
  );

/**
 * Create an ApiToken layer from a static token value.
 * Useful for testing or when token is retrieved from a secret store.
 */
export const fromToken = (token: string): Layer.Layer<ApiToken> =>
  Layer.succeed(ApiToken, {
    auth: { type: "token" as const, token: Redacted.make(token) },
  });

/**
 * Create an ApiToken layer from API Key + Email.
 */
export const fromApiKey = (apiKey: string, email: string): Layer.Layer<ApiToken> =>
  Layer.succeed(ApiToken, {
    auth: { type: "key" as const, apiKey: Redacted.make(apiKey), email },
  });

/**
 * Create an AccountId layer from environment variables.
 * Reads from CLOUDFLARE_ACCOUNT_ID.
 */
export const accountIdFromEnv = (): Layer.Layer<AccountId> =>
  Layer.effect(
    AccountId,
    Effect.sync(() => {
      const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
      if (!accountId) {
        throw new Error("CLOUDFLARE_ACCOUNT_ID environment variable is not set");
      }
      return { accountId };
    }),
  );

/**
 * Create an AccountId layer from a static value.
 */
export const fromAccountId = (accountId: string): Layer.Layer<AccountId> =>
  Layer.succeed(AccountId, { accountId });

/**
 * Create a ZoneId layer from environment variables.
 * Reads from CLOUDFLARE_ZONE_ID.
 */
export const zoneIdFromEnv = (): Layer.Layer<ZoneId> =>
  Layer.effect(
    ZoneId,
    Effect.sync(() => {
      const zoneId = process.env.CLOUDFLARE_ZONE_ID;
      if (!zoneId) {
        throw new Error("CLOUDFLARE_ZONE_ID environment variable is not set");
      }
      return { zoneId };
    }),
  );

/**
 * Create a ZoneId layer from a static value.
 */
export const fromZoneId = (zoneId: string): Layer.Layer<ZoneId> =>
  Layer.succeed(ZoneId, { zoneId });

/**
 * OAuth credentials configuration.
 */
export interface OAuthOptions {
  /** OAuth client ID */
  readonly clientId: string;
  /** OAuth client secret */
  readonly clientSecret: string;
  /** OAuth refresh token */
  readonly refreshToken: string;
}

/**
 * OAuth token response from Cloudflare.
 */
interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * OAuth error response from Cloudflare.
 */
interface OAuthErrorResponse {
  error: string;
  error_description: string;
}

/**
 * Exchange a refresh token for an access token.
 */
const refreshAccessToken = (
  options: OAuthOptions,
): Effect.Effect<ApiToken, OAuthError, HttpClient.HttpClient> =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: options.refreshToken,
      client_id: options.clientId,
      client_secret: options.clientSecret,
    });

    const request = HttpClientRequest.post(CLOUDFLARE_TOKEN_ENDPOINT).pipe(
      HttpClientRequest.setBody(
        HttpBody.text(body.toString(), "application/x-www-form-urlencoded"),
      ),
      HttpClientRequest.setHeader("Accept", "application/json"),
    );

    const response = yield* client.execute(request).pipe(
      Effect.mapError(
        (error) =>
          new OAuthError({
            message: "Failed to connect to Cloudflare OAuth endpoint",
            cause: error,
          }),
      ),
    );

    const json = yield* response.json.pipe(
      Effect.mapError(
        (error) =>
          new OAuthError({
            message: "Failed to parse OAuth response",
            cause: error,
          }),
      ),
    );

    if (response.status !== 200) {
      const errorBody = json as OAuthErrorResponse;
      return yield* Effect.fail(
        new OAuthError({
          message: errorBody.error_description ?? "OAuth token refresh failed",
          error: errorBody.error,
        }),
      );
    }

    const tokenResponse = json as OAuthTokenResponse;

    return {
      auth: {
        type: "oauth" as const,
        accessToken: Redacted.make(tokenResponse.access_token),
      },
    };
  });

/**
 * Create an ApiToken layer from OAuth credentials.
 * Exchanges the refresh token for an access token on layer construction.
 *
 * @example
 * ```typescript
 * import { Auth } from "distilled-cloudflare";
 * import { FetchHttpClient } from "@effect/platform";
 *
 * const authLayer = Auth.fromOAuth({
 *   clientId: "your-client-id",
 *   clientSecret: "your-client-secret",
 *   refreshToken: "your-refresh-token",
 * });
 *
 * program.pipe(
 *   Effect.provide(authLayer),
 *   Effect.provide(FetchHttpClient.layer),
 * );
 * ```
 */
export const fromOAuth = (
  options: OAuthOptions,
): Layer.Layer<ApiToken, OAuthError, HttpClient.HttpClient> =>
  Layer.effect(ApiToken, refreshAccessToken(options));
