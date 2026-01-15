/**
 * Cloudflare FILTERS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service filters
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Filter
// =============================================================================

export interface GetFilterRequest {
  filterId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const GetFilterRequest = Schema.Struct({
  filterId: Schema.String.pipe(T.HttpPath("filterId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/filters/{filterId}" }),
) as unknown as Schema.Schema<GetFilterRequest>;

export interface GetFilterResponse {
  /** The unique identifier of the filter. */
  id?: string;
  /** An informative summary of the filter. */
  description?: string;
  /** The filter expression. For more information, refer to [Expressions](https://developers.cloudflare.com/ruleset-engine/rules-language/expressions/). */
  expression?: string;
  /** When true, indicates that the filter is currently paused. */
  paused?: boolean;
  /** A short reference tag. Allows you to select related filters. */
  ref?: string;
}

export const GetFilterResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  description: Schema.optional(Schema.String),
  expression: Schema.optional(Schema.String),
  paused: Schema.optional(Schema.Boolean),
  ref: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetFilterResponse>;

export const getFilter = API.make(() => ({
  input: GetFilterRequest,
  output: GetFilterResponse,
  errors: [],
}));

export interface PutFilterRequest {
  filterId: string;
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: An informative summary of the filter. */
  description?: string;
  /** Body param: The filter expression. For more information, refer to [Expressions](https://developers.cloudflare.com/ruleset-engine/rules-language/expressions/). */
  expression?: string;
  /** Body param: When true, indicates that the filter is currently paused. */
  paused?: boolean;
  /** Body param: A short reference tag. Allows you to select related filters. */
  ref?: string;
}

export const PutFilterRequest = Schema.Struct({
  filterId: Schema.String.pipe(T.HttpPath("filterId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  description: Schema.optional(Schema.String),
  expression: Schema.optional(Schema.String),
  paused: Schema.optional(Schema.Boolean),
  ref: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/filters/{filterId}" }),
) as unknown as Schema.Schema<PutFilterRequest>;

export interface PutFilterResponse {
  /** The unique identifier of the filter. */
  id?: string;
  /** An informative summary of the filter. */
  description?: string;
  /** The filter expression. For more information, refer to [Expressions](https://developers.cloudflare.com/ruleset-engine/rules-language/expressions/). */
  expression?: string;
  /** When true, indicates that the filter is currently paused. */
  paused?: boolean;
  /** A short reference tag. Allows you to select related filters. */
  ref?: string;
}

export const PutFilterResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  description: Schema.optional(Schema.String),
  expression: Schema.optional(Schema.String),
  paused: Schema.optional(Schema.Boolean),
  ref: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PutFilterResponse>;

export const putFilter = API.make(() => ({
  input: PutFilterRequest,
  output: PutFilterResponse,
  errors: [],
}));

export interface DeleteFilterRequest {
  filterId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const DeleteFilterRequest = Schema.Struct({
  filterId: Schema.String.pipe(T.HttpPath("filterId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/filters/{filterId}" }),
) as unknown as Schema.Schema<DeleteFilterRequest>;

export interface DeleteFilterResponse {
  /** The unique identifier of the filter. */
  id: string;
}

export const DeleteFilterResponse = Schema.Struct({
  id: Schema.String,
}) as unknown as Schema.Schema<DeleteFilterResponse>;

export const deleteFilter = API.make(() => ({
  input: DeleteFilterRequest,
  output: DeleteFilterResponse,
  errors: [],
}));

export interface BulkDeleteFiltersRequest {
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Query param: */
  id: string[];
}

export const BulkDeleteFiltersRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  id: Schema.Array(Schema.String).pipe(T.HttpQuery("id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/filters" }),
) as unknown as Schema.Schema<BulkDeleteFiltersRequest>;

export type BulkDeleteFiltersResponse = unknown;

export const BulkDeleteFiltersResponse =
  Schema.Unknown as unknown as Schema.Schema<BulkDeleteFiltersResponse>;

export const bulkDeleteFilters = API.make(() => ({
  input: BulkDeleteFiltersRequest,
  output: BulkDeleteFiltersResponse,
  errors: [],
}));
