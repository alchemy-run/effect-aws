/**
 * Cloudflare CACHE API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service cache
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
// Cache
// =============================================================================

export interface PurgeCacheRequest {}

export const PurgeCacheRequest = Schema.Struct({}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/purge_cache" }),
) as unknown as Schema.Schema<PurgeCacheRequest>;

export type PurgeCacheResponse = unknown;

export const PurgeCacheResponse =
  Schema.Unknown as unknown as Schema.Schema<PurgeCacheResponse>;

export const purgeCache: (
  input: PurgeCacheRequest,
) => Effect.Effect<
  PurgeCacheResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PurgeCacheRequest,
  output: PurgeCacheResponse,
  errors: [],
}));

// =============================================================================
// CacheReserve
// =============================================================================

export interface GetCacheReserveRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetCacheReserveRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/cache/cache_reserve" }),
) as unknown as Schema.Schema<GetCacheReserveRequest>;

export interface GetCacheReserveResponse {
  /** The identifier of the caching setting. */
  id: "cache_reserve";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the Cache Reserve zone setting. */
  value: "on" | "off";
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const GetCacheReserveResponse = Schema.Struct({
  id: Schema.Literal("cache_reserve"),
  editable: Schema.Boolean,
  value: Schema.Literal("on", "off"),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<GetCacheReserveResponse>;

export const getCacheReserve: (
  input: GetCacheReserveRequest,
) => Effect.Effect<
  GetCacheReserveResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetCacheReserveRequest,
  output: GetCacheReserveResponse,
  errors: [],
}));

export interface PatchCacheReserveRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Value of the Cache Reserve zone setting. */
  value: "on" | "off";
}

export const PatchCacheReserveRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  value: Schema.Literal("on", "off"),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/cache/cache_reserve" }),
) as unknown as Schema.Schema<PatchCacheReserveRequest>;

export interface PatchCacheReserveResponse {
  /** The identifier of the caching setting. */
  id: "cache_reserve";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the Cache Reserve zone setting. */
  value: "on" | "off";
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const PatchCacheReserveResponse = Schema.Struct({
  id: Schema.Literal("cache_reserve"),
  editable: Schema.Boolean,
  value: Schema.Literal("on", "off"),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<PatchCacheReserveResponse>;

export const patchCacheReserve: (
  input: PatchCacheReserveRequest,
) => Effect.Effect<
  PatchCacheReserveResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchCacheReserveRequest,
  output: PatchCacheReserveResponse,
  errors: [],
}));

export interface StatusCacheReserveRequest {
  /** Identifier. */
  zoneId: string;
}

export const StatusCacheReserveRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/cache/cache_reserve_clear" }),
) as unknown as Schema.Schema<StatusCacheReserveRequest>;

export interface StatusCacheReserveResponse {
  /** ID of the zone setting. */
  id: "cache_reserve_clear";
  /** The time that the latest Cache Reserve Clear operation started. */
  startTs: string;
  /** The current state of the Cache Reserve Clear operation. */
  state: "In-progress" | "Completed";
  /** The time that the latest Cache Reserve Clear operation completed. */
  endTs?: string;
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const StatusCacheReserveResponse = Schema.Struct({
  id: Schema.Literal("cache_reserve_clear"),
  startTs: Schema.String.pipe(T.JsonName("start_ts")),
  state: Schema.Literal("In-progress", "Completed"),
  endTs: Schema.optional(Schema.String).pipe(T.JsonName("end_ts")),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<StatusCacheReserveResponse>;

export const statusCacheReserve: (
  input: StatusCacheReserveRequest,
) => Effect.Effect<
  StatusCacheReserveResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: StatusCacheReserveRequest,
  output: StatusCacheReserveResponse,
  errors: [],
}));

export interface ClearCacheReserveRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: */
  body: unknown;
}

export const ClearCacheReserveRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "POST",
    path: "/zones/{zone_id}/cache/cache_reserve_clear",
  }),
) as unknown as Schema.Schema<ClearCacheReserveRequest>;

export interface ClearCacheReserveResponse {
  /** ID of the zone setting. */
  id: "cache_reserve_clear";
  /** The time that the latest Cache Reserve Clear operation started. */
  startTs: string;
  /** The current state of the Cache Reserve Clear operation. */
  state: "In-progress" | "Completed";
  /** The time that the latest Cache Reserve Clear operation completed. */
  endTs?: string;
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const ClearCacheReserveResponse = Schema.Struct({
  id: Schema.Literal("cache_reserve_clear"),
  startTs: Schema.String.pipe(T.JsonName("start_ts")),
  state: Schema.Literal("In-progress", "Completed"),
  endTs: Schema.optional(Schema.String).pipe(T.JsonName("end_ts")),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<ClearCacheReserveResponse>;

export const clearCacheReserve: (
  input: ClearCacheReserveRequest,
) => Effect.Effect<
  ClearCacheReserveResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ClearCacheReserveRequest,
  output: ClearCacheReserveResponse,
  errors: [],
}));

// =============================================================================
// RegionalTieredCache
// =============================================================================

export interface GetRegionalTieredCacheRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetRegionalTieredCacheRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/cache/regional_tiered_cache",
  }),
) as unknown as Schema.Schema<GetRegionalTieredCacheRequest>;

export interface GetRegionalTieredCacheResponse {
  /** The identifier of the caching setting. */
  id: "tc_regional";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the Regional Tiered Cache zone setting. */
  value: "on" | "off";
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const GetRegionalTieredCacheResponse = Schema.Struct({
  id: Schema.Literal("tc_regional"),
  editable: Schema.Boolean,
  value: Schema.Literal("on", "off"),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<GetRegionalTieredCacheResponse>;

export const getRegionalTieredCache: (
  input: GetRegionalTieredCacheRequest,
) => Effect.Effect<
  GetRegionalTieredCacheResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRegionalTieredCacheRequest,
  output: GetRegionalTieredCacheResponse,
  errors: [],
}));

export interface PatchRegionalTieredCacheRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Value of the Regional Tiered Cache zone setting. */
  value: "on" | "off";
}

export const PatchRegionalTieredCacheRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  value: Schema.Literal("on", "off"),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/zones/{zone_id}/cache/regional_tiered_cache",
  }),
) as unknown as Schema.Schema<PatchRegionalTieredCacheRequest>;

export interface PatchRegionalTieredCacheResponse {
  /** The identifier of the caching setting. */
  id: "tc_regional";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the Regional Tiered Cache zone setting. */
  value: "on" | "off";
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const PatchRegionalTieredCacheResponse = Schema.Struct({
  id: Schema.Literal("tc_regional"),
  editable: Schema.Boolean,
  value: Schema.Literal("on", "off"),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<PatchRegionalTieredCacheResponse>;

export const patchRegionalTieredCache: (
  input: PatchRegionalTieredCacheRequest,
) => Effect.Effect<
  PatchRegionalTieredCacheResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchRegionalTieredCacheRequest,
  output: PatchRegionalTieredCacheResponse,
  errors: [],
}));

// =============================================================================
// SmartTieredCache
// =============================================================================

export interface GetSmartTieredCacheRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetSmartTieredCacheRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/cache/tiered_cache_smart_topology_enable",
  }),
) as unknown as Schema.Schema<GetSmartTieredCacheRequest>;

export interface GetSmartTieredCacheResponse {
  /** The identifier of the caching setting. */
  id: "tiered_cache_smart_topology_enable";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the Smart Tiered Cache zone setting. */
  value: "on" | "off";
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const GetSmartTieredCacheResponse = Schema.Struct({
  id: Schema.Literal("tiered_cache_smart_topology_enable"),
  editable: Schema.Boolean,
  value: Schema.Literal("on", "off"),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<GetSmartTieredCacheResponse>;

export const getSmartTieredCache: (
  input: GetSmartTieredCacheRequest,
) => Effect.Effect<
  GetSmartTieredCacheResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSmartTieredCacheRequest,
  output: GetSmartTieredCacheResponse,
  errors: [],
}));

export interface PatchSmartTieredCacheRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Enable or disable the Smart Tiered Cache. */
  value: "on" | "off";
}

export const PatchSmartTieredCacheRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  value: Schema.Literal("on", "off"),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/zones/{zone_id}/cache/tiered_cache_smart_topology_enable",
  }),
) as unknown as Schema.Schema<PatchSmartTieredCacheRequest>;

export interface PatchSmartTieredCacheResponse {
  /** The identifier of the caching setting. */
  id: "tiered_cache_smart_topology_enable";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the Smart Tiered Cache zone setting. */
  value: "on" | "off";
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const PatchSmartTieredCacheResponse = Schema.Struct({
  id: Schema.Literal("tiered_cache_smart_topology_enable"),
  editable: Schema.Boolean,
  value: Schema.Literal("on", "off"),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<PatchSmartTieredCacheResponse>;

export const patchSmartTieredCache: (
  input: PatchSmartTieredCacheRequest,
) => Effect.Effect<
  PatchSmartTieredCacheResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchSmartTieredCacheRequest,
  output: PatchSmartTieredCacheResponse,
  errors: [],
}));

export interface DeleteSmartTieredCacheRequest {
  /** Identifier. */
  zoneId: string;
}

export const DeleteSmartTieredCacheRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/cache/tiered_cache_smart_topology_enable",
  }),
) as unknown as Schema.Schema<DeleteSmartTieredCacheRequest>;

export interface DeleteSmartTieredCacheResponse {
  /** The identifier of the caching setting. */
  id: "tiered_cache_smart_topology_enable";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const DeleteSmartTieredCacheResponse = Schema.Struct({
  id: Schema.Literal("tiered_cache_smart_topology_enable"),
  editable: Schema.Boolean,
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<DeleteSmartTieredCacheResponse>;

export const deleteSmartTieredCache: (
  input: DeleteSmartTieredCacheRequest,
) => Effect.Effect<
  DeleteSmartTieredCacheResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteSmartTieredCacheRequest,
  output: DeleteSmartTieredCacheResponse,
  errors: [],
}));

// =============================================================================
// Variant
// =============================================================================

export interface GetVariantRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetVariantRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/cache/variants" }),
) as unknown as Schema.Schema<GetVariantRequest>;

export interface GetVariantResponse {
  /** The identifier of the caching setting. */
  id: "variants";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the zone setting. */
  value: {
    avif?: string[];
    bmp?: string[];
    gif?: string[];
    jp2?: string[];
    jpeg?: string[];
    jpg?: string[];
    jpg2?: string[];
    png?: string[];
    tif?: string[];
    tiff?: string[];
    webp?: string[];
  };
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const GetVariantResponse = Schema.Struct({
  id: Schema.Literal("variants"),
  editable: Schema.Boolean,
  value: Schema.Struct({
    avif: Schema.optional(Schema.Array(Schema.String)),
    bmp: Schema.optional(Schema.Array(Schema.String)),
    gif: Schema.optional(Schema.Array(Schema.String)),
    jp2: Schema.optional(Schema.Array(Schema.String)),
    jpeg: Schema.optional(Schema.Array(Schema.String)),
    jpg: Schema.optional(Schema.Array(Schema.String)),
    jpg2: Schema.optional(Schema.Array(Schema.String)),
    png: Schema.optional(Schema.Array(Schema.String)),
    tif: Schema.optional(Schema.Array(Schema.String)),
    tiff: Schema.optional(Schema.Array(Schema.String)),
    webp: Schema.optional(Schema.Array(Schema.String)),
  }),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<GetVariantResponse>;

export const getVariant: (
  input: GetVariantRequest,
) => Effect.Effect<
  GetVariantResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetVariantRequest,
  output: GetVariantResponse,
  errors: [],
}));

export interface PatchVariantRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Value of the zone setting. */
  value: {
    avif?: string[];
    bmp?: string[];
    gif?: string[];
    jp2?: string[];
    jpeg?: string[];
    jpg?: string[];
    jpg2?: string[];
    png?: string[];
    tif?: string[];
    tiff?: string[];
    webp?: string[];
  };
}

export const PatchVariantRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  value: Schema.Struct({
    avif: Schema.optional(Schema.Array(Schema.String)),
    bmp: Schema.optional(Schema.Array(Schema.String)),
    gif: Schema.optional(Schema.Array(Schema.String)),
    jp2: Schema.optional(Schema.Array(Schema.String)),
    jpeg: Schema.optional(Schema.Array(Schema.String)),
    jpg: Schema.optional(Schema.Array(Schema.String)),
    jpg2: Schema.optional(Schema.Array(Schema.String)),
    png: Schema.optional(Schema.Array(Schema.String)),
    tif: Schema.optional(Schema.Array(Schema.String)),
    tiff: Schema.optional(Schema.Array(Schema.String)),
    webp: Schema.optional(Schema.Array(Schema.String)),
  }),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/cache/variants" }),
) as unknown as Schema.Schema<PatchVariantRequest>;

export interface PatchVariantResponse {
  /** The identifier of the caching setting. */
  id: "variants";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the zone setting. */
  value: {
    avif?: string[];
    bmp?: string[];
    gif?: string[];
    jp2?: string[];
    jpeg?: string[];
    jpg?: string[];
    jpg2?: string[];
    png?: string[];
    tif?: string[];
    tiff?: string[];
    webp?: string[];
  };
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const PatchVariantResponse = Schema.Struct({
  id: Schema.Literal("variants"),
  editable: Schema.Boolean,
  value: Schema.Struct({
    avif: Schema.optional(Schema.Array(Schema.String)),
    bmp: Schema.optional(Schema.Array(Schema.String)),
    gif: Schema.optional(Schema.Array(Schema.String)),
    jp2: Schema.optional(Schema.Array(Schema.String)),
    jpeg: Schema.optional(Schema.Array(Schema.String)),
    jpg: Schema.optional(Schema.Array(Schema.String)),
    jpg2: Schema.optional(Schema.Array(Schema.String)),
    png: Schema.optional(Schema.Array(Schema.String)),
    tif: Schema.optional(Schema.Array(Schema.String)),
    tiff: Schema.optional(Schema.Array(Schema.String)),
    webp: Schema.optional(Schema.Array(Schema.String)),
  }),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<PatchVariantResponse>;

export const patchVariant: (
  input: PatchVariantRequest,
) => Effect.Effect<
  PatchVariantResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchVariantRequest,
  output: PatchVariantResponse,
  errors: [],
}));

export interface DeleteVariantRequest {
  /** Identifier. */
  zoneId: string;
}

export const DeleteVariantRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/cache/variants" }),
) as unknown as Schema.Schema<DeleteVariantRequest>;

export interface DeleteVariantResponse {
  /** The identifier of the caching setting. */
  id: "variants";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const DeleteVariantResponse = Schema.Struct({
  id: Schema.Literal("variants"),
  editable: Schema.Boolean,
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<DeleteVariantResponse>;

export const deleteVariant: (
  input: DeleteVariantRequest,
) => Effect.Effect<
  DeleteVariantResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteVariantRequest,
  output: DeleteVariantResponse,
  errors: [],
}));
