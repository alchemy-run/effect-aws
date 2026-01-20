/**
 * Cloudflare VECTORIZE API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service vectorize
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
import { UploadableSchema } from "../schemas.ts";

// =============================================================================
// ByIdsIndex
// =============================================================================

export interface GetByIdsIndexRequest {
  indexName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: A list of vector identifiers to retrieve from the index indicated by the path. */
  ids?: string[];
}

export const GetByIdsIndexRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  ids: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}/get_by_ids",
  }),
) as unknown as Schema.Schema<GetByIdsIndexRequest>;

export type GetByIdsIndexResponse = unknown;

export const GetByIdsIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<GetByIdsIndexResponse>;

export const getByIdsIndex: (
  input: GetByIdsIndexRequest,
) => Effect.Effect<
  GetByIdsIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetByIdsIndexRequest,
  output: GetByIdsIndexResponse,
  errors: [],
}));

export interface DeleteByIdsIndexRequest {
  indexName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: A list of vector identifiers to delete from the index indicated by the path. */
  ids?: string[];
}

export const DeleteByIdsIndexRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  ids: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}/delete_by_ids",
  }),
) as unknown as Schema.Schema<DeleteByIdsIndexRequest>;

export type DeleteByIdsIndexResponse = unknown;

export const DeleteByIdsIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteByIdsIndexResponse>;

export const deleteByIdsIndex: (
  input: DeleteByIdsIndexRequest,
) => Effect.Effect<
  DeleteByIdsIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteByIdsIndexRequest,
  output: DeleteByIdsIndexResponse,
  errors: [],
}));

// =============================================================================
// Index
// =============================================================================

export interface GetIndexRequest {
  indexName: string;
  /** Identifier */
  accountId: string;
}

export const GetIndexRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}",
  }),
) as unknown as Schema.Schema<GetIndexRequest>;

export type GetIndexResponse = unknown;

export const GetIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<GetIndexResponse>;

export const getIndex: (
  input: GetIndexRequest,
) => Effect.Effect<
  GetIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetIndexRequest,
  output: GetIndexResponse,
  errors: [],
}));

export interface CreateIndexRequest {
  /** Path param: Identifier */
  accountId: string;
  /** Body param: Specifies the type of configuration to use for the index. */
  config:
    | { dimensions: number; metric: "cosine" | "euclidean" | "dot-product" }
    | {
        preset:
          | "@cf/baai/bge-small-en-v1.5"
          | "@cf/baai/bge-base-en-v1.5"
          | "@cf/baai/bge-large-en-v1.5"
          | "openai/text-embedding-ada-002"
          | "cohere/embed-multilingual-v2.0";
      };
  /** Body param: */
  name: string;
  /** Body param: Specifies the description of the index. */
  description?: string;
}

export const CreateIndexRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  config: Schema.Union(
    Schema.Struct({
      dimensions: Schema.Number,
      metric: Schema.Literal("cosine", "euclidean", "dot-product"),
    }),
    Schema.Struct({
      preset: Schema.Literal(
        "@cf/baai/bge-small-en-v1.5",
        "@cf/baai/bge-base-en-v1.5",
        "@cf/baai/bge-large-en-v1.5",
        "openai/text-embedding-ada-002",
        "cohere/embed-multilingual-v2.0",
      ),
    }),
  ),
  name: Schema.String,
  description: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/vectorize/v2/indexes",
  }),
) as unknown as Schema.Schema<CreateIndexRequest>;

export type CreateIndexResponse = unknown;

export const CreateIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateIndexResponse>;

export const createIndex: (
  input: CreateIndexRequest,
) => Effect.Effect<
  CreateIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateIndexRequest,
  output: CreateIndexResponse,
  errors: [],
}));

export interface DeleteIndexRequest {
  indexName: string;
  /** Identifier */
  accountId: string;
}

export const DeleteIndexRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}",
  }),
) as unknown as Schema.Schema<DeleteIndexRequest>;

export type DeleteIndexResponse = unknown;

export const DeleteIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteIndexResponse>;

export const deleteIndex: (
  input: DeleteIndexRequest,
) => Effect.Effect<
  DeleteIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteIndexRequest,
  output: DeleteIndexResponse,
  errors: [],
}));

export interface InfoIndexRequest {
  indexName: string;
  /** Identifier */
  accountId: string;
}

export const InfoIndexRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}/info",
  }),
) as unknown as Schema.Schema<InfoIndexRequest>;

export type InfoIndexResponse = unknown;

export const InfoIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<InfoIndexResponse>;

export const infoIndex: (
  input: InfoIndexRequest,
) => Effect.Effect<
  InfoIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: InfoIndexRequest,
  output: InfoIndexResponse,
  errors: [],
}));

export interface InsertIndexRequest {
  indexName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Query param: Behavior for ndjson parse failures. */
  unparsableBehavior?: "error" | "discard";
  /** Body param: ndjson file containing vectors to insert. */
  body: File | Blob;
}

export const InsertIndexRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  unparsableBehavior: Schema.optional(Schema.Literal("error", "discard")).pipe(
    T.HttpQuery("'unparsable-behavior'"),
  ),
  body: UploadableSchema.pipe(T.HttpFormDataFile()),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}/insert",
    contentType: "multipart",
  }),
) as unknown as Schema.Schema<InsertIndexRequest>;

export type InsertIndexResponse = unknown;

export const InsertIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<InsertIndexResponse>;

export const insertIndex: (
  input: InsertIndexRequest,
) => Effect.Effect<
  InsertIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: InsertIndexRequest,
  output: InsertIndexResponse,
  errors: [],
}));

export interface QueryIndexRequest {
  indexName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: The search vector that will be used to find the nearest neighbors. */
  vector: number[];
  /** Body param: A metadata filter expression used to limit nearest neighbor results. */
  filter?: unknown;
  /** Body param: Whether to return no metadata, indexed metadata or all metadata associated with the closest vectors. */
  returnMetadata?: "none" | "indexed" | "all";
  /** Body param: Whether to return the values associated with the closest vectors. */
  returnValues?: boolean;
  /** Body param: The number of nearest neighbors to find. */
  topK?: number;
}

export const QueryIndexRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  vector: Schema.Array(Schema.Number),
  filter: Schema.optional(Schema.Unknown),
  returnMetadata: Schema.optional(Schema.Literal("none", "indexed", "all")),
  returnValues: Schema.optional(Schema.Boolean),
  topK: Schema.optional(Schema.Number),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}/query",
  }),
) as unknown as Schema.Schema<QueryIndexRequest>;

export type QueryIndexResponse = unknown;

export const QueryIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<QueryIndexResponse>;

export const queryIndex: (
  input: QueryIndexRequest,
) => Effect.Effect<
  QueryIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: QueryIndexRequest,
  output: QueryIndexResponse,
  errors: [],
}));

export interface UpsertIndexRequest {
  indexName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Query param: Behavior for ndjson parse failures. */
  unparsableBehavior?: "error" | "discard";
  /** Body param: ndjson file containing vectors to upsert. */
  body: File | Blob;
}

export const UpsertIndexRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  unparsableBehavior: Schema.optional(Schema.Literal("error", "discard")).pipe(
    T.HttpQuery("'unparsable-behavior'"),
  ),
  body: UploadableSchema.pipe(T.HttpFormDataFile()),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}/upsert",
    contentType: "multipart",
  }),
) as unknown as Schema.Schema<UpsertIndexRequest>;

export type UpsertIndexResponse = unknown;

export const UpsertIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<UpsertIndexResponse>;

export const upsertIndex: (
  input: UpsertIndexRequest,
) => Effect.Effect<
  UpsertIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpsertIndexRequest,
  output: UpsertIndexResponse,
  errors: [],
}));

// =============================================================================
// IndexMetadataIndex
// =============================================================================

export interface ListIndexMetadataIndexesRequest {
  indexName: string;
  /** Identifier */
  accountId: string;
}

export const ListIndexMetadataIndexesRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}/metadata_index/list",
  }),
) as unknown as Schema.Schema<ListIndexMetadataIndexesRequest>;

export type ListIndexMetadataIndexesResponse = unknown;

export const ListIndexMetadataIndexesResponse =
  Schema.Unknown as unknown as Schema.Schema<ListIndexMetadataIndexesResponse>;

export const listIndexMetadataIndexes: (
  input: ListIndexMetadataIndexesRequest,
) => Effect.Effect<
  ListIndexMetadataIndexesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListIndexMetadataIndexesRequest,
  output: ListIndexMetadataIndexesResponse,
  errors: [],
}));

export interface CreateIndexMetadataIndexRequest {
  indexName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: Specifies the type of metadata property to index. */
  indexType: "string" | "number" | "boolean";
  /** Body param: Specifies the metadata property to index. */
  propertyName: string;
}

export const CreateIndexMetadataIndexRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  indexType: Schema.Literal("string", "number", "boolean"),
  propertyName: Schema.String,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}/metadata_index/create",
  }),
) as unknown as Schema.Schema<CreateIndexMetadataIndexRequest>;

export type CreateIndexMetadataIndexResponse = unknown;

export const CreateIndexMetadataIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateIndexMetadataIndexResponse>;

export const createIndexMetadataIndex: (
  input: CreateIndexMetadataIndexRequest,
) => Effect.Effect<
  CreateIndexMetadataIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateIndexMetadataIndexRequest,
  output: CreateIndexMetadataIndexResponse,
  errors: [],
}));

export interface DeleteIndexMetadataIndexRequest {
  indexName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: Specifies the metadata property for which the index must be deleted. */
  propertyName: string;
}

export const DeleteIndexMetadataIndexRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  propertyName: Schema.String,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}/metadata_index/delete",
  }),
) as unknown as Schema.Schema<DeleteIndexMetadataIndexRequest>;

export type DeleteIndexMetadataIndexResponse = unknown;

export const DeleteIndexMetadataIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteIndexMetadataIndexResponse>;

export const deleteIndexMetadataIndex: (
  input: DeleteIndexMetadataIndexRequest,
) => Effect.Effect<
  DeleteIndexMetadataIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteIndexMetadataIndexRequest,
  output: DeleteIndexMetadataIndexResponse,
  errors: [],
}));

// =============================================================================
// VectorsIndex
// =============================================================================

export interface ListVectorsIndexRequest {
  indexName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Query param: Maximum number of vectors to return */
  count?: number;
  /** Query param: Cursor for pagination to get the next page of results */
  cursor?: string;
}

export const ListVectorsIndexRequest = Schema.Struct({
  indexName: Schema.String.pipe(T.HttpPath("indexName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  count: Schema.optional(Schema.Number).pipe(T.HttpQuery("count")),
  cursor: Schema.optional(Schema.String).pipe(T.HttpQuery("cursor")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/vectorize/v2/indexes/{indexName}/list",
  }),
) as unknown as Schema.Schema<ListVectorsIndexRequest>;

export type ListVectorsIndexResponse = unknown;

export const ListVectorsIndexResponse =
  Schema.Unknown as unknown as Schema.Schema<ListVectorsIndexResponse>;

export const listVectorsIndex: (
  input: ListVectorsIndexRequest,
) => Effect.Effect<
  ListVectorsIndexResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListVectorsIndexRequest,
  output: ListVectorsIndexResponse,
  errors: [],
}));
