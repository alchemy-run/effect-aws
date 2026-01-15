/**
 * Cloudflare MANAGED-TRANSFORMS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service managed-transforms
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// ManagedTransform
// =============================================================================

export interface ListManagedTransformsRequest {
  /** The unique ID of the zone. */
  zoneId: string;
}

export const ListManagedTransformsRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/managed_headers" }),
) as unknown as Schema.Schema<ListManagedTransformsRequest>;

export interface ListManagedTransformsResponse {
  /** The list of Managed Request Transforms. */
  managedRequestHeaders: {
    id: string;
    enabled: boolean;
    hasConflict: boolean;
    conflictsWith?: string[];
  }[];
  /** The list of Managed Response Transforms. */
  managedResponseHeaders: {
    id: string;
    enabled: boolean;
    hasConflict: boolean;
    conflictsWith?: string[];
  }[];
}

export const ListManagedTransformsResponse = Schema.Struct({
  managedRequestHeaders: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      enabled: Schema.Boolean,
      hasConflict: Schema.Boolean.pipe(T.JsonName("has_conflict")),
      conflictsWith: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("conflicts_with"),
      ),
    }),
  ).pipe(T.JsonName("managed_request_headers")),
  managedResponseHeaders: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      enabled: Schema.Boolean,
      hasConflict: Schema.Boolean.pipe(T.JsonName("has_conflict")),
      conflictsWith: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("conflicts_with"),
      ),
    }),
  ).pipe(T.JsonName("managed_response_headers")),
}) as unknown as Schema.Schema<ListManagedTransformsResponse>;

export const listManagedTransforms = API.make(() => ({
  input: ListManagedTransformsRequest,
  output: ListManagedTransformsResponse,
  errors: [],
}));

export interface PatchManagedTransformRequest {
  /** Path param: The unique ID of the zone. */
  zoneId: string;
  /** Body param: The list of Managed Request Transforms. */
  managedRequestHeaders: { id: string; enabled: boolean }[];
  /** Body param: The list of Managed Response Transforms. */
  managedResponseHeaders: { id: string; enabled: boolean }[];
}

export const PatchManagedTransformRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  managedRequestHeaders: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      enabled: Schema.Boolean,
    }),
  ).pipe(T.JsonName("managed_request_headers")),
  managedResponseHeaders: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      enabled: Schema.Boolean,
    }),
  ).pipe(T.JsonName("managed_response_headers")),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/managed_headers" }),
) as unknown as Schema.Schema<PatchManagedTransformRequest>;

export interface PatchManagedTransformResponse {
  /** The list of Managed Request Transforms. */
  managedRequestHeaders: {
    id: string;
    enabled: boolean;
    hasConflict: boolean;
    conflictsWith?: string[];
  }[];
  /** The list of Managed Response Transforms. */
  managedResponseHeaders: {
    id: string;
    enabled: boolean;
    hasConflict: boolean;
    conflictsWith?: string[];
  }[];
}

export const PatchManagedTransformResponse = Schema.Struct({
  managedRequestHeaders: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      enabled: Schema.Boolean,
      hasConflict: Schema.Boolean.pipe(T.JsonName("has_conflict")),
      conflictsWith: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("conflicts_with"),
      ),
    }),
  ).pipe(T.JsonName("managed_request_headers")),
  managedResponseHeaders: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      enabled: Schema.Boolean,
      hasConflict: Schema.Boolean.pipe(T.JsonName("has_conflict")),
      conflictsWith: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("conflicts_with"),
      ),
    }),
  ).pipe(T.JsonName("managed_response_headers")),
}) as unknown as Schema.Schema<PatchManagedTransformResponse>;

export const patchManagedTransform = API.make(() => ({
  input: PatchManagedTransformRequest,
  output: PatchManagedTransformResponse,
  errors: [],
}));

export interface DeleteManagedTransformRequest {
  /** The unique ID of the zone. */
  zoneId: string;
}

export const DeleteManagedTransformRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/managed_headers" }),
) as unknown as Schema.Schema<DeleteManagedTransformRequest>;

export type DeleteManagedTransformResponse = unknown;

export const DeleteManagedTransformResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteManagedTransformResponse>;

export const deleteManagedTransform = API.make(() => ({
  input: DeleteManagedTransformRequest,
  output: DeleteManagedTransformResponse,
  errors: [],
}));
