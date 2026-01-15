/**
 * Cloudflare ARGO API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service argo
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// SmartRouting
// =============================================================================

export interface GetSmartRoutingRequest {
  /** Specifies the zone associated with the API call. */
  zoneId: string;
}

export const GetSmartRoutingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/argo/smart_routing" }),
) as unknown as Schema.Schema<GetSmartRoutingRequest>;

export interface GetSmartRoutingResponse {
  /** Specifies the identifier of the Argo Smart Routing setting. */
  id: string;
  /** Specifies if the setting is editable. */
  editable: boolean;
  /** Specifies the enablement value of Argo Smart Routing. */
  value: "on" | "off";
  /** Specifies the time when the setting was last modified. */
  modifiedOn?: string;
}

export const GetSmartRoutingResponse = Schema.Struct({
  id: Schema.String,
  editable: Schema.Boolean,
  value: Schema.Literal("on", "off"),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
}) as unknown as Schema.Schema<GetSmartRoutingResponse>;

export const getSmartRouting = API.make(() => ({
  input: GetSmartRoutingRequest,
  output: GetSmartRoutingResponse,
  errors: [],
}));

export interface PatchSmartRoutingRequest {
  /** Path param: Specifies the zone associated with the API call. */
  zoneId: string;
  /** Body param: Specifies the enablement value of Argo Smart Routing. */
  value: "on" | "off";
}

export const PatchSmartRoutingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  value: Schema.Literal("on", "off"),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/argo/smart_routing" }),
) as unknown as Schema.Schema<PatchSmartRoutingRequest>;

export interface PatchSmartRoutingResponse {
  /** Specifies the identifier of the Argo Smart Routing setting. */
  id: string;
  /** Specifies if the setting is editable. */
  editable: boolean;
  /** Specifies the enablement value of Argo Smart Routing. */
  value: "on" | "off";
  /** Specifies the time when the setting was last modified. */
  modifiedOn?: string;
}

export const PatchSmartRoutingResponse = Schema.Struct({
  id: Schema.String,
  editable: Schema.Boolean,
  value: Schema.Literal("on", "off"),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
}) as unknown as Schema.Schema<PatchSmartRoutingResponse>;

export const patchSmartRouting = API.make(() => ({
  input: PatchSmartRoutingRequest,
  output: PatchSmartRoutingResponse,
  errors: [],
}));

// =============================================================================
// TieredCaching
// =============================================================================

export interface GetTieredCachingRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetTieredCachingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/argo/tiered_caching" }),
) as unknown as Schema.Schema<GetTieredCachingRequest>;

export interface GetTieredCachingResponse {
  /** The identifier of the caching setting. */
  id: "tiered_caching";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the Tiered Cache zone setting. */
  value: "on" | "off";
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const GetTieredCachingResponse = Schema.Struct({
  id: Schema.Literal("tiered_caching"),
  editable: Schema.Boolean,
  value: Schema.Literal("on", "off"),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<GetTieredCachingResponse>;

export const getTieredCaching = API.make(() => ({
  input: GetTieredCachingRequest,
  output: GetTieredCachingResponse,
  errors: [],
}));

export interface PatchTieredCachingRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Enables Tiered Caching. */
  value: "on" | "off";
}

export const PatchTieredCachingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  value: Schema.Literal("on", "off"),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/argo/tiered_caching" }),
) as unknown as Schema.Schema<PatchTieredCachingRequest>;

export interface PatchTieredCachingResponse {
  /** The identifier of the caching setting. */
  id: "tiered_caching";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the Tiered Cache zone setting. */
  value: "on" | "off";
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const PatchTieredCachingResponse = Schema.Struct({
  id: Schema.Literal("tiered_caching"),
  editable: Schema.Boolean,
  value: Schema.Literal("on", "off"),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<PatchTieredCachingResponse>;

export const patchTieredCaching = API.make(() => ({
  input: PatchTieredCachingRequest,
  output: PatchTieredCachingResponse,
  errors: [],
}));
