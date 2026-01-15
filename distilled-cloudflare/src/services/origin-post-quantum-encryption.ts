/**
 * Cloudflare ORIGIN-POST-QUANTUM-ENCRYPTION API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service origin-post-quantum-encryption
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// OriginPostQuantumEncryption
// =============================================================================

export interface GetOriginPostQuantumEncryptionRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetOriginPostQuantumEncryptionRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/cache/origin_post_quantum_encryption" }),
) as unknown as Schema.Schema<GetOriginPostQuantumEncryptionRequest>;

export interface GetOriginPostQuantumEncryptionResponse {
  /** The identifier of the caching setting. */
  id: "origin_pqe";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the Origin Post Quantum Encryption Setting. */
  value: "preferred" | "supported" | "off";
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const GetOriginPostQuantumEncryptionResponse = Schema.Struct({
  id: Schema.Literal("origin_pqe"),
  editable: Schema.Boolean,
  value: Schema.Literal("preferred", "supported", "off"),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<GetOriginPostQuantumEncryptionResponse>;

export const getOriginPostQuantumEncryption = API.make(() => ({
  input: GetOriginPostQuantumEncryptionRequest,
  output: GetOriginPostQuantumEncryptionResponse,
  errors: [],
}));

export interface PutOriginPostQuantumEncryptionRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Value of the Origin Post Quantum Encryption Setting. */
  value: "preferred" | "supported" | "off";
}

export const PutOriginPostQuantumEncryptionRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  value: Schema.Literal("preferred", "supported", "off"),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/cache/origin_post_quantum_encryption" }),
) as unknown as Schema.Schema<PutOriginPostQuantumEncryptionRequest>;

export interface PutOriginPostQuantumEncryptionResponse {
  /** The identifier of the caching setting. */
  id: "origin_pqe";
  /** Whether the setting is editable. */
  editable: boolean;
  /** Value of the Origin Post Quantum Encryption Setting. */
  value: "preferred" | "supported" | "off";
  /** Last time this setting was modified. */
  modifiedOn?: string | null;
}

export const PutOriginPostQuantumEncryptionResponse = Schema.Struct({
  id: Schema.Literal("origin_pqe"),
  editable: Schema.Boolean,
  value: Schema.Literal("preferred", "supported", "off"),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
}) as unknown as Schema.Schema<PutOriginPostQuantumEncryptionResponse>;

export const putOriginPostQuantumEncryption = API.make(() => ({
  input: PutOriginPostQuantumEncryptionRequest,
  output: PutOriginPostQuantumEncryptionResponse,
  errors: [],
}));
