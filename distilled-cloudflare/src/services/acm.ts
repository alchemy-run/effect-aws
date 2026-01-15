/**
 * Cloudflare ACM API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service acm
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// TotalTl
// =============================================================================

export interface GetTotalTlRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetTotalTlRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/acm/total_tls" }),
) as unknown as Schema.Schema<GetTotalTlRequest>;

export interface GetTotalTlResponse {
  /** The Certificate Authority that Total TLS certificates will be issued through. */
  certificateAuthority?: "google" | "lets_encrypt" | "ssl_com";
  /** If enabled, Total TLS will order a hostname specific TLS certificate for any proxied A, AAAA, or CNAME record in your zone. */
  enabled?: boolean;
  /** The validity period in days for the certificates ordered via Total TLS. */
  validityPeriod?: "90";
}

export const GetTotalTlResponse = Schema.Struct({
  certificateAuthority: Schema.optional(Schema.Literal("google", "lets_encrypt", "ssl_com")).pipe(
    T.JsonName("certificate_authority"),
  ),
  enabled: Schema.optional(Schema.Boolean),
  validityPeriod: Schema.optional(Schema.Literal("90")).pipe(T.JsonName("validity_period")),
}) as unknown as Schema.Schema<GetTotalTlResponse>;

export const getTotalTl = API.make(() => ({
  input: GetTotalTlRequest,
  output: GetTotalTlResponse,
  errors: [],
}));

export interface CreateTotalTlRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: If enabled, Total TLS will order a hostname specific TLS certificate for any proxied A, AAAA, or CNAME record in your zone. */
  enabled: boolean;
  /** Body param: The Certificate Authority that Total TLS certificates will be issued through. */
  certificateAuthority?: "google" | "lets_encrypt" | "ssl_com";
}

export const CreateTotalTlRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  enabled: Schema.Boolean,
  certificateAuthority: Schema.optional(Schema.Literal("google", "lets_encrypt", "ssl_com")).pipe(
    T.JsonName("certificate_authority"),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/acm/total_tls" }),
) as unknown as Schema.Schema<CreateTotalTlRequest>;

export interface CreateTotalTlResponse {
  /** The Certificate Authority that Total TLS certificates will be issued through. */
  certificateAuthority?: "google" | "lets_encrypt" | "ssl_com";
  /** If enabled, Total TLS will order a hostname specific TLS certificate for any proxied A, AAAA, or CNAME record in your zone. */
  enabled?: boolean;
  /** The validity period in days for the certificates ordered via Total TLS. */
  validityPeriod?: "90";
}

export const CreateTotalTlResponse = Schema.Struct({
  certificateAuthority: Schema.optional(Schema.Literal("google", "lets_encrypt", "ssl_com")).pipe(
    T.JsonName("certificate_authority"),
  ),
  enabled: Schema.optional(Schema.Boolean),
  validityPeriod: Schema.optional(Schema.Literal("90")).pipe(T.JsonName("validity_period")),
}) as unknown as Schema.Schema<CreateTotalTlResponse>;

export const createTotalTl = API.make(() => ({
  input: CreateTotalTlRequest,
  output: CreateTotalTlResponse,
  errors: [],
}));
