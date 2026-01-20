/**
 * Cloudflare LOGS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service logs
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
// ControlCmbConfig
// =============================================================================

export interface GetControlCmbConfigRequest {
  /** Identifier. */
  accountId: string;
}

export const GetControlCmbConfigRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/logs/control/cmb/config",
  }),
) as unknown as Schema.Schema<GetControlCmbConfigRequest>;

export type GetControlCmbConfigResponse = unknown;

export const GetControlCmbConfigResponse =
  Schema.Unknown as unknown as Schema.Schema<GetControlCmbConfigResponse>;

export const getControlCmbConfig: (
  input: GetControlCmbConfigRequest,
) => Effect.Effect<
  GetControlCmbConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetControlCmbConfigRequest,
  output: GetControlCmbConfigResponse,
  errors: [],
}));

export interface CreateControlCmbConfigRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Allow out of region access */
  allowOutOfRegionAccess?: boolean;
  /** Body param: Name of the region. */
  regions?: string;
}

export const CreateControlCmbConfigRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  allowOutOfRegionAccess: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_out_of_region_access"),
  ),
  regions: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/logs/control/cmb/config",
  }),
) as unknown as Schema.Schema<CreateControlCmbConfigRequest>;

export type CreateControlCmbConfigResponse = unknown;

export const CreateControlCmbConfigResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateControlCmbConfigResponse>;

export const createControlCmbConfig: (
  input: CreateControlCmbConfigRequest,
) => Effect.Effect<
  CreateControlCmbConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateControlCmbConfigRequest,
  output: CreateControlCmbConfigResponse,
  errors: [],
}));

export interface DeleteControlCmbConfigRequest {
  /** Identifier. */
  accountId: string;
}

export const DeleteControlCmbConfigRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/logs/control/cmb/config",
  }),
) as unknown as Schema.Schema<DeleteControlCmbConfigRequest>;

export type DeleteControlCmbConfigResponse = unknown;

export const DeleteControlCmbConfigResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteControlCmbConfigResponse>;

export const deleteControlCmbConfig: (
  input: DeleteControlCmbConfigRequest,
) => Effect.Effect<
  DeleteControlCmbConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteControlCmbConfigRequest,
  output: DeleteControlCmbConfigResponse,
  errors: [],
}));

// =============================================================================
// ControlRetention
// =============================================================================

export interface GetControlRetentionRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetControlRetentionRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/logs/control/retention/flag",
  }),
) as unknown as Schema.Schema<GetControlRetentionRequest>;

export type GetControlRetentionResponse = unknown;

export const GetControlRetentionResponse =
  Schema.Unknown as unknown as Schema.Schema<GetControlRetentionResponse>;

export const getControlRetention: (
  input: GetControlRetentionRequest,
) => Effect.Effect<
  GetControlRetentionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetControlRetentionRequest,
  output: GetControlRetentionResponse,
  errors: [],
}));

export interface CreateControlRetentionRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: The log retention flag for Logpull API. */
  flag?: boolean;
}

export const CreateControlRetentionRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  flag: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({
    method: "POST",
    path: "/zones/{zone_id}/logs/control/retention/flag",
  }),
) as unknown as Schema.Schema<CreateControlRetentionRequest>;

export type CreateControlRetentionResponse = unknown;

export const CreateControlRetentionResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateControlRetentionResponse>;

export const createControlRetention: (
  input: CreateControlRetentionRequest,
) => Effect.Effect<
  CreateControlRetentionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateControlRetentionRequest,
  output: CreateControlRetentionResponse,
  errors: [],
}));

// =============================================================================
// Rayid
// =============================================================================

export interface GetRayidRequest {
  rayID: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: The `/received` route by default returns a limited set of fields, and allows customers to override the default field set by specifying individual fields. The reasons for this are: 1. Most */
  fields?: string;
  /** Query param: By default, timestamps in responses are returned as Unix nanosecond integers. The `?timestamps=` argument can be set to change the format in which response timestamps are returned. Possib */
  timestamps?: "unix" | "unixnano" | "rfc3339";
}

export const GetRayidRequest = Schema.Struct({
  rayID: Schema.String.pipe(T.HttpPath("RayID")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  fields: Schema.optional(Schema.String).pipe(T.HttpQuery("fields")),
  timestamps: Schema.optional(
    Schema.Literal("unix", "unixnano", "rfc3339"),
  ).pipe(T.HttpQuery("timestamps")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/logs/rayids/{RayID}" }),
) as unknown as Schema.Schema<GetRayidRequest>;

export type GetRayidResponse = string;

export const GetRayidResponse =
  Schema.String as unknown as Schema.Schema<GetRayidResponse>;

export const getRayid: (
  input: GetRayidRequest,
) => Effect.Effect<
  GetRayidResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRayidRequest,
  output: GetRayidResponse,
  errors: [],
}));

// =============================================================================
// Received
// =============================================================================

export interface GetReceivedRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: Sets the (exclusive) end of the requested time frame. This can be a unix timestamp (in seconds or nanoseconds), or an absolute timestamp that conforms to RFC 3339. `end` must be at least  */
  end: string | number;
  /** Query param: When `?count=` is provided, the response will contain up to `count` results. Since results are not sorted, you are likely to get different data for repeated requests. `count` must be an i */
  count?: number;
  /** Query param: The `/received` route by default returns a limited set of fields, and allows customers to override the default field set by specifying individual fields. The reasons for this are: 1. Most */
  fields?: string;
  /** Query param: When `?sample=` is provided, a sample of matching records is returned. If `sample=0.1` then 10% of records will be returned. Sampling is random: repeated calls will not only return differ */
  sample?: number;
  /** Query param: Sets the (inclusive) beginning of the requested time frame. This can be a unix timestamp (in seconds or nanoseconds), or an absolute timestamp that conforms to RFC 3339. At this point in  */
  start?: string | number;
  /** Query param: By default, timestamps in responses are returned as Unix nanosecond integers. The `?timestamps=` argument can be set to change the format in which response timestamps are returned. Possib */
  timestamps?: "unix" | "unixnano" | "rfc3339";
}

export const GetReceivedRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  end: Schema.Union(Schema.String, Schema.Number).pipe(T.HttpQuery("end")),
  count: Schema.optional(Schema.Number).pipe(T.HttpQuery("count")),
  fields: Schema.optional(Schema.String).pipe(T.HttpQuery("fields")),
  sample: Schema.optional(Schema.Number).pipe(T.HttpQuery("sample")),
  start: Schema.optional(Schema.Union(Schema.String, Schema.Number)).pipe(
    T.HttpQuery("start"),
  ),
  timestamps: Schema.optional(
    Schema.Literal("unix", "unixnano", "rfc3339"),
  ).pipe(T.HttpQuery("timestamps")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/logs/received" }),
) as unknown as Schema.Schema<GetReceivedRequest>;

export type GetReceivedResponse = string;

export const GetReceivedResponse =
  Schema.String as unknown as Schema.Schema<GetReceivedResponse>;

export const getReceived: (
  input: GetReceivedRequest,
) => Effect.Effect<
  GetReceivedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetReceivedRequest,
  output: GetReceivedResponse,
  errors: [],
}));

// =============================================================================
// ReceivedField
// =============================================================================

export interface GetReceivedFieldRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetReceivedFieldRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/logs/received/fields" }),
) as unknown as Schema.Schema<GetReceivedFieldRequest>;

export interface GetReceivedFieldResponse {
  key?: string;
}

export const GetReceivedFieldResponse = Schema.Struct({
  key: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetReceivedFieldResponse>;

export const getReceivedField: (
  input: GetReceivedFieldRequest,
) => Effect.Effect<
  GetReceivedFieldResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetReceivedFieldRequest,
  output: GetReceivedFieldResponse,
  errors: [],
}));
