/**
 * Cloudflare KV API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service kv
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
// Namespace
// =============================================================================

export interface GetNamespaceRequest {
  namespaceId: string;
  /** Identifier. */
  accountId: string;
}

export const GetNamespaceRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}",
  }),
) as unknown as Schema.Schema<GetNamespaceRequest>;

export interface GetNamespaceResponse {
  /** Namespace identifier tag. */
  id: string;
  /** A human-readable string name for a Namespace. */
  title: string;
  /** True if keys written on the URL will be URL-decoded before storing. For example, if set to "true", a key written on the URL as "%3F" will be stored as "?". */
  supportsUrlEncoding?: boolean;
}

export const GetNamespaceResponse = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  supportsUrlEncoding: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("supports_url_encoding"),
  ),
}) as unknown as Schema.Schema<GetNamespaceResponse>;

export const getNamespace: (
  input: GetNamespaceRequest,
) => Effect.Effect<
  GetNamespaceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetNamespaceRequest,
  output: GetNamespaceResponse,
  errors: [],
}));

export interface CreateNamespaceRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: A human-readable string name for a Namespace. */
  title: string;
}

export const CreateNamespaceRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  title: Schema.String,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/storage/kv/namespaces",
  }),
) as unknown as Schema.Schema<CreateNamespaceRequest>;

export interface CreateNamespaceResponse {
  /** Namespace identifier tag. */
  id: string;
  /** A human-readable string name for a Namespace. */
  title: string;
  /** True if keys written on the URL will be URL-decoded before storing. For example, if set to "true", a key written on the URL as "%3F" will be stored as "?". */
  supportsUrlEncoding?: boolean;
}

export const CreateNamespaceResponse = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  supportsUrlEncoding: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("supports_url_encoding"),
  ),
}) as unknown as Schema.Schema<CreateNamespaceResponse>;

export const createNamespace: (
  input: CreateNamespaceRequest,
) => Effect.Effect<
  CreateNamespaceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateNamespaceRequest,
  output: CreateNamespaceResponse,
  errors: [],
}));

export interface UpdateNamespaceRequest {
  namespaceId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: A human-readable string name for a Namespace. */
  title: string;
}

export const UpdateNamespaceRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  title: Schema.String,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}",
  }),
) as unknown as Schema.Schema<UpdateNamespaceRequest>;

export interface UpdateNamespaceResponse {
  /** Namespace identifier tag. */
  id: string;
  /** A human-readable string name for a Namespace. */
  title: string;
  /** True if keys written on the URL will be URL-decoded before storing. For example, if set to "true", a key written on the URL as "%3F" will be stored as "?". */
  supportsUrlEncoding?: boolean;
}

export const UpdateNamespaceResponse = Schema.Struct({
  id: Schema.String,
  title: Schema.String,
  supportsUrlEncoding: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("supports_url_encoding"),
  ),
}) as unknown as Schema.Schema<UpdateNamespaceResponse>;

export const updateNamespace: (
  input: UpdateNamespaceRequest,
) => Effect.Effect<
  UpdateNamespaceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateNamespaceRequest,
  output: UpdateNamespaceResponse,
  errors: [],
}));

export interface DeleteNamespaceRequest {
  namespaceId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteNamespaceRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}",
  }),
) as unknown as Schema.Schema<DeleteNamespaceRequest>;

export type DeleteNamespaceResponse = unknown;

export const DeleteNamespaceResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteNamespaceResponse>;

export const deleteNamespace: (
  input: DeleteNamespaceRequest,
) => Effect.Effect<
  DeleteNamespaceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteNamespaceRequest,
  output: DeleteNamespaceResponse,
  errors: [],
}));

export interface BulkGetNamespacesRequest {
  namespaceId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Array of keys to retrieve (maximum of 100). */
  keys: string[];
  /** Body param: Whether to parse JSON values in the response. */
  type?: "text" | "json";
  /** Body param: Whether to include metadata in the response. */
  withMetadata?: boolean;
}

export const BulkGetNamespacesRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  keys: Schema.Array(Schema.String),
  type: Schema.optional(Schema.Literal("text", "json")),
  withMetadata: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}/bulk/get",
  }),
) as unknown as Schema.Schema<BulkGetNamespacesRequest>;

export type BulkGetNamespacesResponse = unknown;

export const BulkGetNamespacesResponse =
  Schema.Unknown as unknown as Schema.Schema<BulkGetNamespacesResponse>;

export const bulkGetNamespaces: (
  input: BulkGetNamespacesRequest,
) => Effect.Effect<
  BulkGetNamespacesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkGetNamespacesRequest,
  output: BulkGetNamespacesResponse,
  errors: [],
}));

export interface BulkDeleteNamespacesRequest {
  namespaceId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  body: string[];
}

export const BulkDeleteNamespacesRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Array(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}/bulk/delete",
  }),
) as unknown as Schema.Schema<BulkDeleteNamespacesRequest>;

export type BulkDeleteNamespacesResponse = unknown;

export const BulkDeleteNamespacesResponse =
  Schema.Unknown as unknown as Schema.Schema<BulkDeleteNamespacesResponse>;

export const bulkDeleteNamespaces: (
  input: BulkDeleteNamespacesRequest,
) => Effect.Effect<
  BulkDeleteNamespacesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkDeleteNamespacesRequest,
  output: BulkDeleteNamespacesResponse,
  errors: [],
}));

// =============================================================================
// NamespaceKey
// =============================================================================

export interface BulkGetNamespaceKeysRequest {
  namespaceId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Array of keys to retrieve (maximum of 100). */
  keys: string[];
  /** Body param: Whether to parse JSON values in the response. */
  type?: "text" | "json";
  /** Body param: Whether to include metadata in the response. */
  withMetadata?: boolean;
}

export const BulkGetNamespaceKeysRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  keys: Schema.Array(Schema.String),
  type: Schema.optional(Schema.Literal("text", "json")),
  withMetadata: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}/bulk/get",
  }),
) as unknown as Schema.Schema<BulkGetNamespaceKeysRequest>;

export type BulkGetNamespaceKeysResponse = unknown;

export const BulkGetNamespaceKeysResponse =
  Schema.Unknown as unknown as Schema.Schema<BulkGetNamespaceKeysResponse>;

export const bulkGetNamespaceKeys: (
  input: BulkGetNamespaceKeysRequest,
) => Effect.Effect<
  BulkGetNamespaceKeysResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkGetNamespaceKeysRequest,
  output: BulkGetNamespaceKeysResponse,
  errors: [],
}));

export interface BulkDeleteNamespaceKeysRequest {
  namespaceId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  body: string[];
}

export const BulkDeleteNamespaceKeysRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Array(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}/bulk/delete",
  }),
) as unknown as Schema.Schema<BulkDeleteNamespaceKeysRequest>;

export type BulkDeleteNamespaceKeysResponse = unknown;

export const BulkDeleteNamespaceKeysResponse =
  Schema.Unknown as unknown as Schema.Schema<BulkDeleteNamespaceKeysResponse>;

export const bulkDeleteNamespaceKeys: (
  input: BulkDeleteNamespaceKeysRequest,
) => Effect.Effect<
  BulkDeleteNamespaceKeysResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkDeleteNamespaceKeysRequest,
  output: BulkDeleteNamespaceKeysResponse,
  errors: [],
}));

// =============================================================================
// NamespaceMetadata
// =============================================================================

export interface GetNamespaceMetadataRequest {
  namespaceId: string;
  keyName: string;
  /** Identifier. */
  accountId: string;
}

export const GetNamespaceMetadataRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  keyName: Schema.String.pipe(T.HttpPath("keyName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}/metadata/{keyName}",
  }),
) as unknown as Schema.Schema<GetNamespaceMetadataRequest>;

export type GetNamespaceMetadataResponse = unknown;

export const GetNamespaceMetadataResponse =
  Schema.Unknown as unknown as Schema.Schema<GetNamespaceMetadataResponse>;

export const getNamespaceMetadata: (
  input: GetNamespaceMetadataRequest,
) => Effect.Effect<
  GetNamespaceMetadataResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetNamespaceMetadataRequest,
  output: GetNamespaceMetadataResponse,
  errors: [],
}));

// =============================================================================
// NamespaceValue
// =============================================================================

export interface GetNamespaceValueRequest {
  namespaceId: string;
  keyName: string;
  /** Identifier. */
  accountId: string;
}

export const GetNamespaceValueRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  keyName: Schema.String.pipe(T.HttpPath("keyName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}/values/{keyName}",
  }),
) as unknown as Schema.Schema<GetNamespaceValueRequest>;

export type GetNamespaceValueResponse = unknown;

export const GetNamespaceValueResponse =
  Schema.Unknown as unknown as Schema.Schema<GetNamespaceValueResponse>;

export const getNamespaceValue: (
  input: GetNamespaceValueRequest,
) => Effect.Effect<
  GetNamespaceValueResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetNamespaceValueRequest,
  output: GetNamespaceValueResponse,
  errors: [],
}));

export interface PutNamespaceValueRequest {
  namespaceId: string;
  keyName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: Expires the key at a certain time, measured in number of seconds since the UNIX epoch. */
  expiration?: number;
  /** Query param: Expires the key after a number of seconds. Must be at least 60. */
  expirationTtl?: number;
  /** Body param: A byte sequence to be stored, up to 25 MiB in length. */
  value: string;
  /** Body param: Associates arbitrary JSON data with a key/value pair. */
  metadata?: unknown;
}

export const PutNamespaceValueRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  keyName: Schema.String.pipe(T.HttpPath("keyName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  expiration: Schema.optional(Schema.Number).pipe(T.HttpQuery("expiration")),
  expirationTtl: Schema.optional(Schema.Number).pipe(
    T.HttpQuery("expiration_ttl"),
  ),
  value: Schema.String,
  metadata: Schema.optional(Schema.Unknown),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}/values/{keyName}",
  }),
) as unknown as Schema.Schema<PutNamespaceValueRequest>;

export type PutNamespaceValueResponse = unknown;

export const PutNamespaceValueResponse =
  Schema.Unknown as unknown as Schema.Schema<PutNamespaceValueResponse>;

export const putNamespaceValue: (
  input: PutNamespaceValueRequest,
) => Effect.Effect<
  PutNamespaceValueResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutNamespaceValueRequest,
  output: PutNamespaceValueResponse,
  errors: [],
}));

export interface DeleteNamespaceValueRequest {
  namespaceId: string;
  keyName: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteNamespaceValueRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  keyName: Schema.String.pipe(T.HttpPath("keyName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}/values/{keyName}",
  }),
) as unknown as Schema.Schema<DeleteNamespaceValueRequest>;

export type DeleteNamespaceValueResponse = unknown;

export const DeleteNamespaceValueResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteNamespaceValueResponse>;

export const deleteNamespaceValue: (
  input: DeleteNamespaceValueRequest,
) => Effect.Effect<
  DeleteNamespaceValueResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteNamespaceValueRequest,
  output: DeleteNamespaceValueResponse,
  errors: [],
}));

// =============================================================================
// PutNamespace
// =============================================================================

export interface BulkPutNamespacesRequest {
  namespaceId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  body: {
    key: string;
    value: string;
    base64?: boolean;
    expiration?: number;
    expirationTtl?: number;
    metadata?: unknown;
  }[];
}

export const BulkPutNamespacesRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Array(
    Schema.Struct({
      key: Schema.String,
      value: Schema.String,
      base64: Schema.optional(Schema.Boolean),
      expiration: Schema.optional(Schema.Number),
      expirationTtl: Schema.optional(Schema.Number).pipe(
        T.JsonName("expiration_ttl"),
      ),
      metadata: Schema.optional(Schema.Unknown),
    }),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}/bulk",
  }),
) as unknown as Schema.Schema<BulkPutNamespacesRequest>;

export type BulkPutNamespacesResponse = unknown;

export const BulkPutNamespacesResponse =
  Schema.Unknown as unknown as Schema.Schema<BulkPutNamespacesResponse>;

export const bulkPutNamespaces: (
  input: BulkPutNamespacesRequest,
) => Effect.Effect<
  BulkPutNamespacesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkPutNamespacesRequest,
  output: BulkPutNamespacesResponse,
  errors: [],
}));

// =============================================================================
// PutNamespaceKey
// =============================================================================

export interface BulkPutNamespaceKeysRequest {
  namespaceId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  body: {
    key: string;
    value: string;
    base64?: boolean;
    expiration?: number;
    expirationTtl?: number;
    metadata?: unknown;
  }[];
}

export const BulkPutNamespaceKeysRequest = Schema.Struct({
  namespaceId: Schema.String.pipe(T.HttpPath("namespaceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Array(
    Schema.Struct({
      key: Schema.String,
      value: Schema.String,
      base64: Schema.optional(Schema.Boolean),
      expiration: Schema.optional(Schema.Number),
      expirationTtl: Schema.optional(Schema.Number).pipe(
        T.JsonName("expiration_ttl"),
      ),
      metadata: Schema.optional(Schema.Unknown),
    }),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/storage/kv/namespaces/{namespaceId}/bulk",
  }),
) as unknown as Schema.Schema<BulkPutNamespaceKeysRequest>;

export type BulkPutNamespaceKeysResponse = unknown;

export const BulkPutNamespaceKeysResponse =
  Schema.Unknown as unknown as Schema.Schema<BulkPutNamespaceKeysResponse>;

export const bulkPutNamespaceKeys: (
  input: BulkPutNamespaceKeysRequest,
) => Effect.Effect<
  BulkPutNamespaceKeysResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkPutNamespaceKeysRequest,
  output: BulkPutNamespaceKeysResponse,
  errors: [],
}));
