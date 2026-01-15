/**
 * Cloudflare HOSTNAMES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service hostnames
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// SettingTl
// =============================================================================

export interface PutSettingTlsRequest {
  settingId: "ciphers" | "min_tls_version" | "http2";
  hostname: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: The tls setting value. */
  value: string | number | unknown;
}

export const PutSettingTlsRequest = Schema.Struct({
  settingId: Schema.Literal("ciphers", "min_tls_version", "http2").pipe(T.HttpPath("settingId")),
  hostname: Schema.String.pipe(T.HttpPath("hostname")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  value: Schema.Union(Schema.String, Schema.Number, Schema.Unknown),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/hostnames/settings/{settingId}/{hostname}" }),
) as unknown as Schema.Schema<PutSettingTlsRequest>;

export interface PutSettingTlsResponse {
  /** This is the time the tls setting was originally created for this hostname. */
  createdAt?: string;
  /** The hostname for which the tls settings are set. */
  hostname?: string;
  /** Deployment status for the given tls setting. */
  status?: string;
  /** This is the time the tls setting was updated. */
  updatedAt?: string;
  /** The tls setting value. */
  value?: string | number | unknown;
}

export const PutSettingTlsResponse = Schema.Struct({
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  hostname: Schema.optional(Schema.String),
  status: Schema.optional(Schema.String),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  value: Schema.optional(Schema.Union(Schema.String, Schema.Number, Schema.Unknown)),
}) as unknown as Schema.Schema<PutSettingTlsResponse>;

export const putSettingTls = API.make(() => ({
  input: PutSettingTlsRequest,
  output: PutSettingTlsResponse,
  errors: [],
}));

export interface DeleteSettingTlsRequest {
  settingId: "ciphers" | "min_tls_version" | "http2";
  hostname: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteSettingTlsRequest = Schema.Struct({
  settingId: Schema.Literal("ciphers", "min_tls_version", "http2").pipe(T.HttpPath("settingId")),
  hostname: Schema.String.pipe(T.HttpPath("hostname")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/hostnames/settings/{settingId}/{hostname}" }),
) as unknown as Schema.Schema<DeleteSettingTlsRequest>;

export interface DeleteSettingTlsResponse {
  /** This is the time the tls setting was originally created for this hostname. */
  createdAt?: string;
  /** The hostname for which the tls settings are set. */
  hostname?: string;
  /** Deployment status for the given tls setting. */
  status?: string;
  /** This is the time the tls setting was updated. */
  updatedAt?: string;
  /** The tls setting value. */
  value?: string | number | unknown;
}

export const DeleteSettingTlsResponse = Schema.Struct({
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  hostname: Schema.optional(Schema.String),
  status: Schema.optional(Schema.String),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  value: Schema.optional(Schema.Union(Schema.String, Schema.Number, Schema.Unknown)),
}) as unknown as Schema.Schema<DeleteSettingTlsResponse>;

export const deleteSettingTls = API.make(() => ({
  input: DeleteSettingTlsRequest,
  output: DeleteSettingTlsResponse,
  errors: [],
}));
