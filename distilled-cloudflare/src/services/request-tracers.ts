/**
 * Cloudflare REQUEST-TRACERS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service request-tracers
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import {
  type CommonErrors,
  UnknownCloudflareError,
  CloudflareNetworkError,
  CloudflareHttpError,
} from "../errors.ts";

// =============================================================================
// Trace
// =============================================================================

export interface CreateTraceRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: HTTP Method of tracing request */
  method: string;
  /** Body param: URL to which perform tracing request */
  url: string;
  /** Body param: */
  body?: { base64?: string; json?: unknown; plainText?: string };
  /** Body param: Additional request parameters */
  context?: {
    botScore?: number;
    geoloc?: {
      city?: string;
      continent?: string;
      isEuCountry?: boolean;
      isoCode?: string;
      latitude?: number;
      longitude?: number;
      postalCode?: string;
      regionCode?: string;
      subdivision_2IsoCode?: string;
      timezone?: string;
    };
    skipChallenge?: boolean;
    threatScore?: number;
  };
  /** Body param: Cookies added to tracing request */
  cookies?: Record<string, unknown>;
  /** Body param: Headers added to tracing request */
  headers?: Record<string, unknown>;
  /** Body param: HTTP Protocol of tracing request */
  protocol?: string;
  /** Body param: Skip sending the request to the Origin server after all rules evaluation */
  skipResponse?: boolean;
}

export const CreateTraceRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  method: Schema.String,
  url: Schema.String,
  body: Schema.optional(
    Schema.Struct({
      base64: Schema.optional(Schema.String),
      json: Schema.optional(Schema.Unknown),
      plainText: Schema.optional(Schema.String).pipe(T.JsonName("plain_text")),
    }),
  ),
  context: Schema.optional(
    Schema.Struct({
      botScore: Schema.optional(Schema.Number).pipe(T.JsonName("bot_score")),
      geoloc: Schema.optional(
        Schema.Struct({
          city: Schema.optional(Schema.String),
          continent: Schema.optional(Schema.String),
          isEuCountry: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("is_eu_country"),
          ),
          isoCode: Schema.optional(Schema.String).pipe(T.JsonName("iso_code")),
          latitude: Schema.optional(Schema.Number),
          longitude: Schema.optional(Schema.Number),
          postalCode: Schema.optional(Schema.String).pipe(
            T.JsonName("postal_code"),
          ),
          regionCode: Schema.optional(Schema.String).pipe(
            T.JsonName("region_code"),
          ),
          subdivision_2IsoCode: Schema.optional(Schema.String).pipe(
            T.JsonName("subdivision_2_iso_code"),
          ),
          timezone: Schema.optional(Schema.String),
        }),
      ),
      skipChallenge: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("skip_challenge"),
      ),
      threatScore: Schema.optional(Schema.Number).pipe(
        T.JsonName("threat_score"),
      ),
    }),
  ),
  cookies: Schema.optional(Schema.Struct({})),
  headers: Schema.optional(Schema.Struct({})),
  protocol: Schema.optional(Schema.String),
  skipResponse: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("skip_response"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/request-tracer/trace",
  }),
) as unknown as Schema.Schema<CreateTraceRequest>;

export interface CreateTraceResponse {
  /** HTTP Status code of zone response */
  statusCode?: number;
  trace?: unknown;
}

export const CreateTraceResponse = Schema.Struct({
  statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
  trace: Schema.optional(Schema.Unknown),
}) as unknown as Schema.Schema<CreateTraceResponse>;

export const createTrace: (
  input: CreateTraceRequest,
) => Effect.Effect<
  CreateTraceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateTraceRequest,
  output: CreateTraceResponse,
  errors: [],
}));
