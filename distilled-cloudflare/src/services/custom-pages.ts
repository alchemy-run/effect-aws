/**
 * Cloudflare CUSTOM-PAGES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service custom-pages
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// CustomPage
// =============================================================================

export interface GetCustomPageRequest {
  identifier:
    | "waf_block"
    | "ip_block"
    | "country_challenge"
    | "500_errors"
    | "1000_errors"
    | "managed_challenge"
    | "ratelimit_block";
}

export const GetCustomPageRequest = Schema.Struct({
  identifier: Schema.Literal(
    "waf_block",
    "ip_block",
    "country_challenge",
    "500_errors",
    "1000_errors",
    "managed_challenge",
    "ratelimit_block",
  ).pipe(T.HttpPath("identifier")),
}).pipe(
  T.Http({ method: "GET", path: "/{accountOrZone}/{accountOrZoneId}/custom_pages/{identifier}" }),
) as unknown as Schema.Schema<GetCustomPageRequest>;

export interface GetCustomPageResponse {
  id?: string;
  createdOn?: string;
  description?: string;
  modifiedOn?: string;
  previewTarget?: string;
  requiredTokens?: string[];
  /** The custom page state. */
  state?: "default" | "customized";
  /** The URL associated with the custom page. */
  url?: string;
}

export const GetCustomPageResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  previewTarget: Schema.optional(Schema.String).pipe(T.JsonName("preview_target")),
  requiredTokens: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("required_tokens")),
  state: Schema.optional(Schema.Literal("default", "customized")),
  url: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetCustomPageResponse>;

export const getCustomPage = API.make(() => ({
  input: GetCustomPageRequest,
  output: GetCustomPageResponse,
  errors: [],
}));

export interface PutCustomPageRequest {
  identifier:
    | "waf_block"
    | "ip_block"
    | "country_challenge"
    | "500_errors"
    | "1000_errors"
    | "managed_challenge"
    | "ratelimit_block";
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: The custom page state. */
  state: "default" | "customized";
  /** Body param: The URL associated with the custom page. */
  url: string;
}

export const PutCustomPageRequest = Schema.Struct({
  identifier: Schema.Literal(
    "waf_block",
    "ip_block",
    "country_challenge",
    "500_errors",
    "1000_errors",
    "managed_challenge",
    "ratelimit_block",
  ).pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  state: Schema.Literal("default", "customized"),
  url: Schema.String,
}).pipe(
  T.Http({ method: "PUT", path: "/{accountOrZone}/{accountOrZoneId}/custom_pages/{identifier}" }),
) as unknown as Schema.Schema<PutCustomPageRequest>;

export interface PutCustomPageResponse {
  id?: string;
  createdOn?: string;
  description?: string;
  modifiedOn?: string;
  previewTarget?: string;
  requiredTokens?: string[];
  /** The custom page state. */
  state?: "default" | "customized";
  /** The URL associated with the custom page. */
  url?: string;
}

export const PutCustomPageResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  previewTarget: Schema.optional(Schema.String).pipe(T.JsonName("preview_target")),
  requiredTokens: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("required_tokens")),
  state: Schema.optional(Schema.Literal("default", "customized")),
  url: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PutCustomPageResponse>;

export const putCustomPage = API.make(() => ({
  input: PutCustomPageRequest,
  output: PutCustomPageResponse,
  errors: [],
}));
