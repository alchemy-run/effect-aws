/**
 * Cloudflare SECRETS-STORE API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service secrets-store
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Quota
// =============================================================================

export interface GetQuotaRequest {
  /** Account Identifier */
  accountId: string;
}

export const GetQuotaRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/secrets_store/quota" }),
) as unknown as Schema.Schema<GetQuotaRequest>;

export interface GetQuotaResponse {
  secrets: { quota: number; usage: number };
}

export const GetQuotaResponse = Schema.Struct({
  secrets: Schema.Struct({
    quota: Schema.Number,
    usage: Schema.Number,
  }),
}) as unknown as Schema.Schema<GetQuotaResponse>;

export const getQuota = API.make(() => ({
  input: GetQuotaRequest,
  output: GetQuotaResponse,
  errors: [],
}));

// =============================================================================
// Store
// =============================================================================

export interface DeleteStoreRequest {
  storeId: string;
  /** Account Identifier */
  accountId: string;
}

export const DeleteStoreRequest = Schema.Struct({
  storeId: Schema.String.pipe(T.HttpPath("storeId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/secrets_store/stores/{storeId}" }),
) as unknown as Schema.Schema<DeleteStoreRequest>;

export interface DeleteStoreResponse {
  /** Store Identifier */
  id: string;
  /** Whenthe secret was created. */
  created: string;
  /** When the secret was modified. */
  modified: string;
  /** The name of the store */
  name: string;
}

export const DeleteStoreResponse = Schema.Struct({
  id: Schema.String,
  created: Schema.String,
  modified: Schema.String,
  name: Schema.String,
}) as unknown as Schema.Schema<DeleteStoreResponse>;

export const deleteStore = API.make(() => ({
  input: DeleteStoreRequest,
  output: DeleteStoreResponse,
  errors: [],
}));

// =============================================================================
// StoreSecret
// =============================================================================

export interface GetStoreSecretRequest {
  storeId: string;
  secretId: string;
  /** Account Identifier */
  accountId: string;
}

export const GetStoreSecretRequest = Schema.Struct({
  storeId: Schema.String.pipe(T.HttpPath("storeId")),
  secretId: Schema.String.pipe(T.HttpPath("secretId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/secrets_store/stores/{storeId}/secrets/{secretId}",
  }),
) as unknown as Schema.Schema<GetStoreSecretRequest>;

export interface GetStoreSecretResponse {
  /** Secret identifier tag. */
  id: string;
  /** Whenthe secret was created. */
  created: string;
  /** When the secret was modified. */
  modified: string;
  /** The name of the secret */
  name: string;
  status: "pending" | "active" | "deleted";
  /** Store Identifier */
  storeId: string;
  /** Freeform text describing the secret */
  comment?: string;
}

export const GetStoreSecretResponse = Schema.Struct({
  id: Schema.String,
  created: Schema.String,
  modified: Schema.String,
  name: Schema.String,
  status: Schema.Literal("pending", "active", "deleted"),
  storeId: Schema.String.pipe(T.JsonName("store_id")),
  comment: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetStoreSecretResponse>;

export const getStoreSecret = API.make(() => ({
  input: GetStoreSecretRequest,
  output: GetStoreSecretResponse,
  errors: [],
}));

export interface PatchStoreSecretRequest {
  storeId: string;
  secretId: string;
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: Freeform text describing the secret */
  comment?: string;
  /** Body param: The list of services that can use this secret. */
  scopes?: string[];
}

export const PatchStoreSecretRequest = Schema.Struct({
  storeId: Schema.String.pipe(T.HttpPath("storeId")),
  secretId: Schema.String.pipe(T.HttpPath("secretId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  comment: Schema.optional(Schema.String),
  scopes: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/secrets_store/stores/{storeId}/secrets/{secretId}",
  }),
) as unknown as Schema.Schema<PatchStoreSecretRequest>;

export interface PatchStoreSecretResponse {
  /** Secret identifier tag. */
  id: string;
  /** Whenthe secret was created. */
  created: string;
  /** When the secret was modified. */
  modified: string;
  /** The name of the secret */
  name: string;
  status: "pending" | "active" | "deleted";
  /** Store Identifier */
  storeId: string;
  /** Freeform text describing the secret */
  comment?: string;
}

export const PatchStoreSecretResponse = Schema.Struct({
  id: Schema.String,
  created: Schema.String,
  modified: Schema.String,
  name: Schema.String,
  status: Schema.Literal("pending", "active", "deleted"),
  storeId: Schema.String.pipe(T.JsonName("store_id")),
  comment: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PatchStoreSecretResponse>;

export const patchStoreSecret = API.make(() => ({
  input: PatchStoreSecretRequest,
  output: PatchStoreSecretResponse,
  errors: [],
}));

export interface DeleteStoreSecretRequest {
  storeId: string;
  secretId: string;
  /** Account Identifier */
  accountId: string;
}

export const DeleteStoreSecretRequest = Schema.Struct({
  storeId: Schema.String.pipe(T.HttpPath("storeId")),
  secretId: Schema.String.pipe(T.HttpPath("secretId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/secrets_store/stores/{storeId}/secrets/{secretId}",
  }),
) as unknown as Schema.Schema<DeleteStoreSecretRequest>;

export interface DeleteStoreSecretResponse {
  /** Secret identifier tag. */
  id: string;
  /** Whenthe secret was created. */
  created: string;
  /** When the secret was modified. */
  modified: string;
  /** The name of the secret */
  name: string;
  status: "pending" | "active" | "deleted";
  /** Store Identifier */
  storeId: string;
  /** Freeform text describing the secret */
  comment?: string;
}

export const DeleteStoreSecretResponse = Schema.Struct({
  id: Schema.String,
  created: Schema.String,
  modified: Schema.String,
  name: Schema.String,
  status: Schema.Literal("pending", "active", "deleted"),
  storeId: Schema.String.pipe(T.JsonName("store_id")),
  comment: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteStoreSecretResponse>;

export const deleteStoreSecret = API.make(() => ({
  input: DeleteStoreSecretRequest,
  output: DeleteStoreSecretResponse,
  errors: [],
}));

export interface DuplicateStoreSecretRequest {
  storeId: string;
  secretId: string;
  /** Path param: Account Identifier */
  accountId: string;
  /** Body param: The name of the secret */
  name: string;
  /** Body param: The list of services that can use this secret. */
  scopes: string[];
  /** Body param: Freeform text describing the secret */
  comment?: string;
}

export const DuplicateStoreSecretRequest = Schema.Struct({
  storeId: Schema.String.pipe(T.HttpPath("storeId")),
  secretId: Schema.String.pipe(T.HttpPath("secretId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  scopes: Schema.Array(Schema.String),
  comment: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/secrets_store/stores/{storeId}/secrets/{secretId}/duplicate",
  }),
) as unknown as Schema.Schema<DuplicateStoreSecretRequest>;

export interface DuplicateStoreSecretResponse {
  /** Secret identifier tag. */
  id: string;
  /** Whenthe secret was created. */
  created: string;
  /** When the secret was modified. */
  modified: string;
  /** The name of the secret */
  name: string;
  status: "pending" | "active" | "deleted";
  /** Store Identifier */
  storeId: string;
  /** Freeform text describing the secret */
  comment?: string;
}

export const DuplicateStoreSecretResponse = Schema.Struct({
  id: Schema.String,
  created: Schema.String,
  modified: Schema.String,
  name: Schema.String,
  status: Schema.Literal("pending", "active", "deleted"),
  storeId: Schema.String.pipe(T.JsonName("store_id")),
  comment: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DuplicateStoreSecretResponse>;

export const duplicateStoreSecret = API.make(() => ({
  input: DuplicateStoreSecretRequest,
  output: DuplicateStoreSecretResponse,
  errors: [],
}));
