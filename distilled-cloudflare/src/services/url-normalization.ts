/**
 * Cloudflare URL-NORMALIZATION API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service url-normalization
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// URLNormalization
// =============================================================================

export interface GetURLNormalizationRequest {
  /** The unique ID of the zone. */
  zoneId: string;
}

export const GetURLNormalizationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/url_normalization" }),
) as unknown as Schema.Schema<GetURLNormalizationRequest>;

export interface GetURLNormalizationResponse {
  /** The scope of the URL normalization. */
  scope: "incoming" | "both" | "none";
  /** The type of URL normalization performed by Cloudflare. */
  type: "cloudflare" | "rfc3986";
}

export const GetURLNormalizationResponse = Schema.Struct({
  scope: Schema.Literal("incoming", "both", "none"),
  type: Schema.Literal("cloudflare", "rfc3986"),
}) as unknown as Schema.Schema<GetURLNormalizationResponse>;

export const getURLNormalization = API.make(() => ({
  input: GetURLNormalizationRequest,
  output: GetURLNormalizationResponse,
  errors: [],
}));

export interface PutURLNormalizationRequest {
  /** Path param: The unique ID of the zone. */
  zoneId: string;
  /** Body param: The scope of the URL normalization. */
  scope: "incoming" | "both" | "none";
  /** Body param: The type of URL normalization performed by Cloudflare. */
  type: "cloudflare" | "rfc3986";
}

export const PutURLNormalizationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  scope: Schema.Literal("incoming", "both", "none"),
  type: Schema.Literal("cloudflare", "rfc3986"),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/url_normalization" }),
) as unknown as Schema.Schema<PutURLNormalizationRequest>;

export interface PutURLNormalizationResponse {
  /** The scope of the URL normalization. */
  scope: "incoming" | "both" | "none";
  /** The type of URL normalization performed by Cloudflare. */
  type: "cloudflare" | "rfc3986";
}

export const PutURLNormalizationResponse = Schema.Struct({
  scope: Schema.Literal("incoming", "both", "none"),
  type: Schema.Literal("cloudflare", "rfc3986"),
}) as unknown as Schema.Schema<PutURLNormalizationResponse>;

export const putURLNormalization = API.make(() => ({
  input: PutURLNormalizationRequest,
  output: PutURLNormalizationResponse,
  errors: [],
}));

export interface DeleteURLNormalizationRequest {
  /** The unique ID of the zone. */
  zoneId: string;
}

export const DeleteURLNormalizationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/url_normalization" }),
) as unknown as Schema.Schema<DeleteURLNormalizationRequest>;

export type DeleteURLNormalizationResponse = unknown;

export const DeleteURLNormalizationResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteURLNormalizationResponse>;

export const deleteURLNormalization = API.make(() => ({
  input: DeleteURLNormalizationRequest,
  output: DeleteURLNormalizationResponse,
  errors: [],
}));
