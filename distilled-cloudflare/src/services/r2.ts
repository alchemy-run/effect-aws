/**
 * Cloudflare R2 API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service r2
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
// AllSuperSlurperJob
// =============================================================================

export interface AbortAllSuperSlurperJobRequest {
  accountId: string;
}

export const AbortAllSuperSlurperJobRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/slurper/jobs/abortAll",
  }),
) as unknown as Schema.Schema<AbortAllSuperSlurperJobRequest>;

export type AbortAllSuperSlurperJobResponse = string;

export const AbortAllSuperSlurperJobResponse =
  Schema.String as unknown as Schema.Schema<AbortAllSuperSlurperJobResponse>;

export const abortAllSuperSlurperJob: (
  input: AbortAllSuperSlurperJobRequest,
) => Effect.Effect<
  AbortAllSuperSlurperJobResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: AbortAllSuperSlurperJobRequest,
  output: AbortAllSuperSlurperJobResponse,
  errors: [],
}));

// =============================================================================
// Bucket
// =============================================================================

export interface GetBucketRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const GetBucketRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}",
  }),
) as unknown as Schema.Schema<GetBucketRequest>;

export interface GetBucketResponse {
  /** Creation timestamp. */
  creationDate?: string;
  /** Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
  /** Location of the bucket. */
  location?: "apac" | "eeur" | "enam" | "weur" | "wnam" | "oc";
  /** Name of the bucket. */
  name?: string;
  /** Storage class for newly uploaded objects, unless specified otherwise. */
  storageClass?: "Standard" | "InfrequentAccess";
}

export const GetBucketResponse = Schema.Struct({
  creationDate: Schema.optional(Schema.String).pipe(
    T.JsonName("creation_date"),
  ),
  jurisdiction: Schema.optional(Schema.Literal("default", "eu", "fedramp")),
  location: Schema.optional(
    Schema.Literal("apac", "eeur", "enam", "weur", "wnam", "oc"),
  ),
  name: Schema.optional(Schema.String),
  storageClass: Schema.optional(
    Schema.Literal("Standard", "InfrequentAccess"),
  ).pipe(T.JsonName("storage_class")),
}) as unknown as Schema.Schema<GetBucketResponse>;

export const getBucket: (
  input: GetBucketRequest,
) => Effect.Effect<
  GetBucketResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBucketRequest,
  output: GetBucketResponse,
  errors: [],
}));

export interface ListBucketsRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: Pagination cursor received during the last List Buckets call. R2 buckets are paginated using cursors instead of page numbers. */
  cursor?: string;
  /** Query param: Direction to order buckets. */
  direction?: "asc" | "desc";
  /** Query param: Bucket names to filter by. Only buckets with this phrase in their name will be returned. */
  nameContains?: string;
  /** Query param: Field to order buckets by. */
  order?: "name";
  /** Query param: Maximum number of buckets to return in a single call. */
  perPage?: number;
  /** Query param: Bucket name to start searching after. Buckets are ordered lexicographically. */
  startAfter?: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const ListBucketsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cursor: Schema.optional(Schema.String).pipe(T.HttpQuery("cursor")),
  direction: Schema.optional(Schema.Literal("asc", "desc")).pipe(
    T.HttpQuery("direction"),
  ),
  nameContains: Schema.optional(Schema.String).pipe(
    T.HttpQuery("name_contains"),
  ),
  order: Schema.optional(Schema.Literal("name")).pipe(T.HttpQuery("order")),
  perPage: Schema.optional(Schema.Number).pipe(T.HttpQuery("per_page")),
  startAfter: Schema.optional(Schema.String).pipe(T.HttpQuery("start_after")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/r2/buckets" }),
) as unknown as Schema.Schema<ListBucketsRequest>;

export interface ListBucketsResponse {
  buckets?: {
    creationDate?: string;
    jurisdiction?: "default" | "eu" | "fedramp";
    location?: "apac" | "eeur" | "enam" | "weur" | "wnam" | "oc";
    name?: string;
    storageClass?: "Standard" | "InfrequentAccess";
  }[];
}

export const ListBucketsResponse = Schema.Struct({
  buckets: Schema.optional(
    Schema.Array(
      Schema.Struct({
        creationDate: Schema.optional(Schema.String).pipe(
          T.JsonName("creation_date"),
        ),
        jurisdiction: Schema.optional(
          Schema.Literal("default", "eu", "fedramp"),
        ),
        location: Schema.optional(
          Schema.Literal("apac", "eeur", "enam", "weur", "wnam", "oc"),
        ),
        name: Schema.optional(Schema.String),
        storageClass: Schema.optional(
          Schema.Literal("Standard", "InfrequentAccess"),
        ).pipe(T.JsonName("storage_class")),
      }),
    ),
  ),
}) as unknown as Schema.Schema<ListBucketsResponse>;

export const listBuckets: (
  input: ListBucketsRequest,
) => Effect.Effect<
  ListBucketsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListBucketsRequest,
  output: ListBucketsResponse,
  errors: [],
}));

export interface CreateBucketRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
  /** Body param: Name of the bucket. */
  name: string;
  /** Body param: Location of the bucket. */
  locationHint?: "apac" | "eeur" | "enam" | "weur" | "wnam" | "oc";
  /** Body param: Storage class for newly uploaded objects, unless specified otherwise. */
  storageClass?: "Standard" | "InfrequentAccess";
}

export const CreateBucketRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
  name: Schema.String,
  locationHint: Schema.optional(
    Schema.Literal("apac", "eeur", "enam", "weur", "wnam", "oc"),
  ),
  storageClass: Schema.optional(Schema.Literal("Standard", "InfrequentAccess")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/r2/buckets" }),
) as unknown as Schema.Schema<CreateBucketRequest>;

export interface CreateBucketResponse {
  /** Creation timestamp. */
  creationDate?: string;
  /** Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
  /** Location of the bucket. */
  location?: "apac" | "eeur" | "enam" | "weur" | "wnam" | "oc";
  /** Name of the bucket. */
  name?: string;
  /** Storage class for newly uploaded objects, unless specified otherwise. */
  storageClass?: "Standard" | "InfrequentAccess";
}

export const CreateBucketResponse = Schema.Struct({
  creationDate: Schema.optional(Schema.String).pipe(
    T.JsonName("creation_date"),
  ),
  jurisdiction: Schema.optional(Schema.Literal("default", "eu", "fedramp")),
  location: Schema.optional(
    Schema.Literal("apac", "eeur", "enam", "weur", "wnam", "oc"),
  ),
  name: Schema.optional(Schema.String),
  storageClass: Schema.optional(
    Schema.Literal("Standard", "InfrequentAccess"),
  ).pipe(T.JsonName("storage_class")),
}) as unknown as Schema.Schema<CreateBucketResponse>;

export const createBucket: (
  input: CreateBucketRequest,
) => Effect.Effect<
  CreateBucketResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateBucketRequest,
  output: CreateBucketResponse,
  errors: [],
}));

export interface PatchBucketRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Storage class for newly uploaded objects, unless specified otherwise. */
  storageClass: "Standard" | "InfrequentAccess";
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const PatchBucketRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  storageClass: Schema.Literal("Standard", "InfrequentAccess").pipe(
    T.HttpHeader("cf-r2-storage-class"),
  ),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}",
  }),
) as unknown as Schema.Schema<PatchBucketRequest>;

export interface PatchBucketResponse {
  /** Creation timestamp. */
  creationDate?: string;
  /** Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
  /** Location of the bucket. */
  location?: "apac" | "eeur" | "enam" | "weur" | "wnam" | "oc";
  /** Name of the bucket. */
  name?: string;
  /** Storage class for newly uploaded objects, unless specified otherwise. */
  storageClass?: "Standard" | "InfrequentAccess";
}

export const PatchBucketResponse = Schema.Struct({
  creationDate: Schema.optional(Schema.String).pipe(
    T.JsonName("creation_date"),
  ),
  jurisdiction: Schema.optional(Schema.Literal("default", "eu", "fedramp")),
  location: Schema.optional(
    Schema.Literal("apac", "eeur", "enam", "weur", "wnam", "oc"),
  ),
  name: Schema.optional(Schema.String),
  storageClass: Schema.optional(
    Schema.Literal("Standard", "InfrequentAccess"),
  ).pipe(T.JsonName("storage_class")),
}) as unknown as Schema.Schema<PatchBucketResponse>;

export const patchBucket: (
  input: PatchBucketRequest,
) => Effect.Effect<
  PatchBucketResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchBucketRequest,
  output: PatchBucketResponse,
  errors: [],
}));

export interface DeleteBucketRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const DeleteBucketRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}",
  }),
) as unknown as Schema.Schema<DeleteBucketRequest>;

export type DeleteBucketResponse = unknown;

export const DeleteBucketResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteBucketResponse>;

export const deleteBucket: (
  input: DeleteBucketRequest,
) => Effect.Effect<
  DeleteBucketResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteBucketRequest,
  output: DeleteBucketResponse,
  errors: [],
}));

// =============================================================================
// BucketCor
// =============================================================================

export interface GetBucketCorsRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const GetBucketCorsRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/cors",
  }),
) as unknown as Schema.Schema<GetBucketCorsRequest>;

export interface GetBucketCorsResponse {
  rules?: {
    allowed: {
      methods: ("GET" | "PUT" | "POST" | "DELETE" | "HEAD")[];
      origins: string[];
      headers?: string[];
    };
    id?: string;
    exposeHeaders?: string[];
    maxAgeSeconds?: number;
  }[];
}

export const GetBucketCorsResponse = Schema.Struct({
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        allowed: Schema.Struct({
          methods: Schema.Array(
            Schema.Literal("GET", "PUT", "POST", "DELETE", "HEAD"),
          ),
          origins: Schema.Array(Schema.String),
          headers: Schema.optional(Schema.Array(Schema.String)),
        }),
        id: Schema.optional(Schema.String),
        exposeHeaders: Schema.optional(Schema.Array(Schema.String)),
        maxAgeSeconds: Schema.optional(Schema.Number),
      }),
    ),
  ),
}) as unknown as Schema.Schema<GetBucketCorsResponse>;

export const getBucketCors: (
  input: GetBucketCorsRequest,
) => Effect.Effect<
  GetBucketCorsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBucketCorsRequest,
  output: GetBucketCorsResponse,
  errors: [],
}));

export interface PutBucketCorsRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
  /** Body param: */
  rules?: {
    allowed: {
      methods: ("GET" | "PUT" | "POST" | "DELETE" | "HEAD")[];
      origins: string[];
      headers?: string[];
    };
    id?: string;
    exposeHeaders?: string[];
    maxAgeSeconds?: number;
  }[];
}

export const PutBucketCorsRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        allowed: Schema.Struct({
          methods: Schema.Array(
            Schema.Literal("GET", "PUT", "POST", "DELETE", "HEAD"),
          ),
          origins: Schema.Array(Schema.String),
          headers: Schema.optional(Schema.Array(Schema.String)),
        }),
        id: Schema.optional(Schema.String),
        exposeHeaders: Schema.optional(Schema.Array(Schema.String)),
        maxAgeSeconds: Schema.optional(Schema.Number),
      }),
    ),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/cors",
  }),
) as unknown as Schema.Schema<PutBucketCorsRequest>;

export type PutBucketCorsResponse = unknown;

export const PutBucketCorsResponse =
  Schema.Unknown as unknown as Schema.Schema<PutBucketCorsResponse>;

export const putBucketCors: (
  input: PutBucketCorsRequest,
) => Effect.Effect<
  PutBucketCorsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutBucketCorsRequest,
  output: PutBucketCorsResponse,
  errors: [],
}));

export interface DeleteBucketCorsRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const DeleteBucketCorsRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/cors",
  }),
) as unknown as Schema.Schema<DeleteBucketCorsRequest>;

export type DeleteBucketCorsResponse = unknown;

export const DeleteBucketCorsResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteBucketCorsResponse>;

export const deleteBucketCors: (
  input: DeleteBucketCorsRequest,
) => Effect.Effect<
  DeleteBucketCorsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteBucketCorsRequest,
  output: DeleteBucketCorsResponse,
  errors: [],
}));

// =============================================================================
// BucketDomainCustom
// =============================================================================

export interface GetBucketDomainCustomRequest {
  bucketName: string;
  domain: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const GetBucketDomainCustomRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  domain: Schema.String.pipe(T.HttpPath("domain")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/domains/custom/{domain}",
  }),
) as unknown as Schema.Schema<GetBucketDomainCustomRequest>;

export interface GetBucketDomainCustomResponse {
  /** Domain name of the custom domain to be added. */
  domain: string;
  /** Whether this bucket is publicly accessible at the specified custom domain. */
  enabled: boolean;
  status: {
    ownership:
      | "pending"
      | "active"
      | "deactivated"
      | "blocked"
      | "error"
      | "unknown";
    ssl:
      | "initializing"
      | "pending"
      | "active"
      | "deactivated"
      | "error"
      | "unknown";
  };
  /** An allowlist of ciphers for TLS termination. These ciphers must be in the BoringSSL format. */
  ciphers?: string[];
  /** Minimum TLS Version the custom domain will accept for incoming connections. If not set, defaults to 1.0. */
  minTLS?: "1.0" | "1.1" | "1.2" | "1.3";
  /** Zone ID of the custom domain resides in. */
  zoneId?: string;
  /** Zone that the custom domain resides in. */
  zoneName?: string;
}

export const GetBucketDomainCustomResponse = Schema.Struct({
  domain: Schema.String,
  enabled: Schema.Boolean,
  status: Schema.Struct({
    ownership: Schema.Literal(
      "pending",
      "active",
      "deactivated",
      "blocked",
      "error",
      "unknown",
    ),
    ssl: Schema.Literal(
      "initializing",
      "pending",
      "active",
      "deactivated",
      "error",
      "unknown",
    ),
  }),
  ciphers: Schema.optional(Schema.Array(Schema.String)),
  minTLS: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")),
  zoneId: Schema.optional(Schema.String),
  zoneName: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetBucketDomainCustomResponse>;

export const getBucketDomainCustom: (
  input: GetBucketDomainCustomRequest,
) => Effect.Effect<
  GetBucketDomainCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBucketDomainCustomRequest,
  output: GetBucketDomainCustomResponse,
  errors: [],
}));

export interface ListBucketDomainCustomsRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const ListBucketDomainCustomsRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/domains/custom",
  }),
) as unknown as Schema.Schema<ListBucketDomainCustomsRequest>;

export interface ListBucketDomainCustomsResponse {
  domains: {
    domain: string;
    enabled: boolean;
    status: {
      ownership:
        | "pending"
        | "active"
        | "deactivated"
        | "blocked"
        | "error"
        | "unknown";
      ssl:
        | "initializing"
        | "pending"
        | "active"
        | "deactivated"
        | "error"
        | "unknown";
    };
    ciphers?: string[];
    minTLS?: "1.0" | "1.1" | "1.2" | "1.3";
    zoneId?: string;
    zoneName?: string;
  }[];
}

export const ListBucketDomainCustomsResponse = Schema.Struct({
  domains: Schema.Array(
    Schema.Struct({
      domain: Schema.String,
      enabled: Schema.Boolean,
      status: Schema.Struct({
        ownership: Schema.Literal(
          "pending",
          "active",
          "deactivated",
          "blocked",
          "error",
          "unknown",
        ),
        ssl: Schema.Literal(
          "initializing",
          "pending",
          "active",
          "deactivated",
          "error",
          "unknown",
        ),
      }),
      ciphers: Schema.optional(Schema.Array(Schema.String)),
      minTLS: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")),
      zoneId: Schema.optional(Schema.String),
      zoneName: Schema.optional(Schema.String),
    }),
  ),
}) as unknown as Schema.Schema<ListBucketDomainCustomsResponse>;

export const listBucketDomainCustoms: (
  input: ListBucketDomainCustomsRequest,
) => Effect.Effect<
  ListBucketDomainCustomsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListBucketDomainCustomsRequest,
  output: ListBucketDomainCustomsResponse,
  errors: [],
}));

export class NoSuchBucket extends Schema.TaggedError<NoSuchBucket>()(
  "NoSuchBucket",
  { code: Schema.Number, message: Schema.String },
).pipe(T.HttpErrorMatchers([{ code: 10006 }])) {}

export class InvalidBucketName extends Schema.TaggedError<InvalidBucketName>()(
  "InvalidBucketName",
  { code: Schema.Number, message: Schema.String },
).pipe(T.HttpErrorMatchers([{ code: 10005 }])) {}

export interface CreateBucketDomainCustomRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
  /** Body param: Name of the custom domain to be added. */
  domain: string;
  /** Body param: Whether to enable public bucket access at the custom domain. If undefined, the domain will be enabled. */
  enabled: boolean;
  /** Body param: Zone ID of the custom domain. */
  zoneId: string;
  /** Body param: An allowlist of ciphers for TLS termination. These ciphers must be in the BoringSSL format. */
  ciphers?: string[];
  /** Body param: Minimum TLS Version the custom domain will accept for incoming connections. If not set, defaults to 1.0. */
  minTLS?: "1.0" | "1.1" | "1.2" | "1.3";
}

export const CreateBucketDomainCustomRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
  domain: Schema.String,
  enabled: Schema.Boolean,
  zoneId: Schema.String,
  ciphers: Schema.optional(Schema.Array(Schema.String)),
  minTLS: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/domains/custom",
  }),
) as unknown as Schema.Schema<CreateBucketDomainCustomRequest>;

export interface CreateBucketDomainCustomResponse {
  /** Domain name of the affected custom domain. */
  domain: string;
  /** Whether this bucket is publicly accessible at the specified custom domain. */
  enabled: boolean;
  /** An allowlist of ciphers for TLS termination. These ciphers must be in the BoringSSL format. */
  ciphers?: string[];
  /** Minimum TLS Version the custom domain will accept for incoming connections. If not set, defaults to 1.0. */
  minTLS?: "1.0" | "1.1" | "1.2" | "1.3";
}

export const CreateBucketDomainCustomResponse = Schema.Struct({
  domain: Schema.String,
  enabled: Schema.Boolean,
  ciphers: Schema.optional(Schema.Array(Schema.String)),
  minTLS: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")),
}) as unknown as Schema.Schema<CreateBucketDomainCustomResponse>;

export const createBucketDomainCustom: (
  input: CreateBucketDomainCustomRequest,
) => Effect.Effect<
  CreateBucketDomainCustomResponse,
  CommonErrors | NoSuchBucket | InvalidBucketName,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateBucketDomainCustomRequest,
  output: CreateBucketDomainCustomResponse,
  errors: [NoSuchBucket, InvalidBucketName],
}));

export interface UpdateBucketDomainCustomRequest {
  bucketName: string;
  domain: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
  /** Body param: An allowlist of ciphers for TLS termination. These ciphers must be in the BoringSSL format. */
  ciphers?: string[];
  /** Body param: Whether to enable public bucket access at the specified custom domain. */
  enabled?: boolean;
  /** Body param: Minimum TLS Version the custom domain will accept for incoming connections. If not set, defaults to previous value. */
  minTLS?: "1.0" | "1.1" | "1.2" | "1.3";
}

export const UpdateBucketDomainCustomRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  domain: Schema.String.pipe(T.HttpPath("domain")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
  ciphers: Schema.optional(Schema.Array(Schema.String)),
  enabled: Schema.optional(Schema.Boolean),
  minTLS: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/domains/custom/{domain}",
  }),
) as unknown as Schema.Schema<UpdateBucketDomainCustomRequest>;

export interface UpdateBucketDomainCustomResponse {
  /** Domain name of the affected custom domain. */
  domain: string;
  /** An allowlist of ciphers for TLS termination. These ciphers must be in the BoringSSL format. */
  ciphers?: string[];
  /** Whether this bucket is publicly accessible at the specified custom domain. */
  enabled?: boolean;
  /** Minimum TLS Version the custom domain will accept for incoming connections. If not set, defaults to 1.0. */
  minTLS?: "1.0" | "1.1" | "1.2" | "1.3";
}

export const UpdateBucketDomainCustomResponse = Schema.Struct({
  domain: Schema.String,
  ciphers: Schema.optional(Schema.Array(Schema.String)),
  enabled: Schema.optional(Schema.Boolean),
  minTLS: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")),
}) as unknown as Schema.Schema<UpdateBucketDomainCustomResponse>;

export const updateBucketDomainCustom: (
  input: UpdateBucketDomainCustomRequest,
) => Effect.Effect<
  UpdateBucketDomainCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateBucketDomainCustomRequest,
  output: UpdateBucketDomainCustomResponse,
  errors: [],
}));

export interface DeleteBucketDomainCustomRequest {
  bucketName: string;
  domain: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const DeleteBucketDomainCustomRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  domain: Schema.String.pipe(T.HttpPath("domain")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/domains/custom/{domain}",
  }),
) as unknown as Schema.Schema<DeleteBucketDomainCustomRequest>;

export interface DeleteBucketDomainCustomResponse {
  /** Name of the removed custom domain. */
  domain: string;
}

export const DeleteBucketDomainCustomResponse = Schema.Struct({
  domain: Schema.String,
}) as unknown as Schema.Schema<DeleteBucketDomainCustomResponse>;

export const deleteBucketDomainCustom: (
  input: DeleteBucketDomainCustomRequest,
) => Effect.Effect<
  DeleteBucketDomainCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteBucketDomainCustomRequest,
  output: DeleteBucketDomainCustomResponse,
  errors: [],
}));

// =============================================================================
// BucketDomainManaged
// =============================================================================

export interface ListBucketDomainManagedsRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const ListBucketDomainManagedsRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/domains/managed",
  }),
) as unknown as Schema.Schema<ListBucketDomainManagedsRequest>;

export interface ListBucketDomainManagedsResponse {
  /** Bucket ID. */
  bucketId: string;
  /** Domain name of the bucket's r2.dev domain. */
  domain: string;
  /** Whether this bucket is publicly accessible at the r2.dev domain. */
  enabled: boolean;
}

export const ListBucketDomainManagedsResponse = Schema.Struct({
  bucketId: Schema.String,
  domain: Schema.String,
  enabled: Schema.Boolean,
}) as unknown as Schema.Schema<ListBucketDomainManagedsResponse>;

export const listBucketDomainManageds: (
  input: ListBucketDomainManagedsRequest,
) => Effect.Effect<
  ListBucketDomainManagedsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListBucketDomainManagedsRequest,
  output: ListBucketDomainManagedsResponse,
  errors: [],
}));

export interface PutBucketDomainManagedRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
  /** Body param: Whether to enable public bucket access at the r2.dev domain. */
  enabled: boolean;
}

export const PutBucketDomainManagedRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
  enabled: Schema.Boolean,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/domains/managed",
  }),
) as unknown as Schema.Schema<PutBucketDomainManagedRequest>;

export interface PutBucketDomainManagedResponse {
  /** Bucket ID. */
  bucketId: string;
  /** Domain name of the bucket's r2.dev domain. */
  domain: string;
  /** Whether this bucket is publicly accessible at the r2.dev domain. */
  enabled: boolean;
}

export const PutBucketDomainManagedResponse = Schema.Struct({
  bucketId: Schema.String,
  domain: Schema.String,
  enabled: Schema.Boolean,
}) as unknown as Schema.Schema<PutBucketDomainManagedResponse>;

export const putBucketDomainManaged: (
  input: PutBucketDomainManagedRequest,
) => Effect.Effect<
  PutBucketDomainManagedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutBucketDomainManagedRequest,
  output: PutBucketDomainManagedResponse,
  errors: [],
}));

// =============================================================================
// BucketEventNotification
// =============================================================================

export interface GetBucketEventNotificationRequest {
  bucketName: string;
  queueId: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: The bucket jurisdiction. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const GetBucketEventNotificationRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  queueId: Schema.String.pipe(T.HttpPath("queueId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/event_notifications/r2/{bucketName}/configuration/queues/{queueId}",
  }),
) as unknown as Schema.Schema<GetBucketEventNotificationRequest>;

export interface GetBucketEventNotificationResponse {
  /** Queue ID. */
  queueId?: string;
  /** Name of the queue. */
  queueName?: string;
  rules?: {
    actions: (
      | "PutObject"
      | "CopyObject"
      | "DeleteObject"
      | "CompleteMultipartUpload"
      | "LifecycleDeletion"
    )[];
    createdAt?: string;
    description?: string;
    prefix?: string;
    ruleId?: string;
    suffix?: string;
  }[];
}

export const GetBucketEventNotificationResponse = Schema.Struct({
  queueId: Schema.optional(Schema.String),
  queueName: Schema.optional(Schema.String),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        actions: Schema.Array(
          Schema.Literal(
            "PutObject",
            "CopyObject",
            "DeleteObject",
            "CompleteMultipartUpload",
            "LifecycleDeletion",
          ),
        ),
        createdAt: Schema.optional(Schema.String),
        description: Schema.optional(Schema.String),
        prefix: Schema.optional(Schema.String),
        ruleId: Schema.optional(Schema.String),
        suffix: Schema.optional(Schema.String),
      }),
    ),
  ),
}) as unknown as Schema.Schema<GetBucketEventNotificationResponse>;

export const getBucketEventNotification: (
  input: GetBucketEventNotificationRequest,
) => Effect.Effect<
  GetBucketEventNotificationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBucketEventNotificationRequest,
  output: GetBucketEventNotificationResponse,
  errors: [],
}));

export interface ListBucketEventNotificationsRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const ListBucketEventNotificationsRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/event_notifications/r2/{bucketName}/configuration",
  }),
) as unknown as Schema.Schema<ListBucketEventNotificationsRequest>;

export interface ListBucketEventNotificationsResponse {
  /** Name of the bucket. */
  bucketName?: string;
  /** List of queues associated with the bucket. */
  queues?: {
    queueId?: string;
    queueName?: string;
    rules?: {
      actions: (
        | "PutObject"
        | "CopyObject"
        | "DeleteObject"
        | "CompleteMultipartUpload"
        | "LifecycleDeletion"
      )[];
      createdAt?: string;
      description?: string;
      prefix?: string;
      ruleId?: string;
      suffix?: string;
    }[];
  }[];
}

export const ListBucketEventNotificationsResponse = Schema.Struct({
  bucketName: Schema.optional(Schema.String),
  queues: Schema.optional(
    Schema.Array(
      Schema.Struct({
        queueId: Schema.optional(Schema.String),
        queueName: Schema.optional(Schema.String),
        rules: Schema.optional(
          Schema.Array(
            Schema.Struct({
              actions: Schema.Array(
                Schema.Literal(
                  "PutObject",
                  "CopyObject",
                  "DeleteObject",
                  "CompleteMultipartUpload",
                  "LifecycleDeletion",
                ),
              ),
              createdAt: Schema.optional(Schema.String),
              description: Schema.optional(Schema.String),
              prefix: Schema.optional(Schema.String),
              ruleId: Schema.optional(Schema.String),
              suffix: Schema.optional(Schema.String),
            }),
          ),
        ),
      }),
    ),
  ),
}) as unknown as Schema.Schema<ListBucketEventNotificationsResponse>;

export const listBucketEventNotifications: (
  input: ListBucketEventNotificationsRequest,
) => Effect.Effect<
  ListBucketEventNotificationsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListBucketEventNotificationsRequest,
  output: ListBucketEventNotificationsResponse,
  errors: [],
}));

export interface PutBucketEventNotificationRequest {
  bucketName: string;
  queueId: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
  /** Body param: Array of rules to drive notifications. */
  rules: {
    actions: (
      | "PutObject"
      | "CopyObject"
      | "DeleteObject"
      | "CompleteMultipartUpload"
      | "LifecycleDeletion"
    )[];
    description?: string;
    prefix?: string;
    suffix?: string;
  }[];
}

export const PutBucketEventNotificationRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  queueId: Schema.String.pipe(T.HttpPath("queueId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
  rules: Schema.Array(
    Schema.Struct({
      actions: Schema.Array(
        Schema.Literal(
          "PutObject",
          "CopyObject",
          "DeleteObject",
          "CompleteMultipartUpload",
          "LifecycleDeletion",
        ),
      ),
      description: Schema.optional(Schema.String),
      prefix: Schema.optional(Schema.String),
      suffix: Schema.optional(Schema.String),
    }),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/event_notifications/r2/{bucketName}/configuration/queues/{queueId}",
  }),
) as unknown as Schema.Schema<PutBucketEventNotificationRequest>;

export type PutBucketEventNotificationResponse = unknown;

export const PutBucketEventNotificationResponse =
  Schema.Unknown as unknown as Schema.Schema<PutBucketEventNotificationResponse>;

export const putBucketEventNotification: (
  input: PutBucketEventNotificationRequest,
) => Effect.Effect<
  PutBucketEventNotificationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutBucketEventNotificationRequest,
  output: PutBucketEventNotificationResponse,
  errors: [],
}));

export interface DeleteBucketEventNotificationRequest {
  bucketName: string;
  queueId: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const DeleteBucketEventNotificationRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  queueId: Schema.String.pipe(T.HttpPath("queueId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/event_notifications/r2/{bucketName}/configuration/queues/{queueId}",
  }),
) as unknown as Schema.Schema<DeleteBucketEventNotificationRequest>;

export type DeleteBucketEventNotificationResponse = unknown;

export const DeleteBucketEventNotificationResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteBucketEventNotificationResponse>;

export const deleteBucketEventNotification: (
  input: DeleteBucketEventNotificationRequest,
) => Effect.Effect<
  DeleteBucketEventNotificationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteBucketEventNotificationRequest,
  output: DeleteBucketEventNotificationResponse,
  errors: [],
}));

// =============================================================================
// BucketLifecycle
// =============================================================================

export interface GetBucketLifecycleRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const GetBucketLifecycleRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/lifecycle",
  }),
) as unknown as Schema.Schema<GetBucketLifecycleRequest>;

export interface GetBucketLifecycleResponse {
  rules?: {
    id: string;
    conditions: { prefix: string };
    enabled: boolean;
    abortMultipartUploadsTransition?: {
      condition?: { maxAge: number; type: "Age" };
    };
    deleteObjectsTransition?: {
      condition?:
        | { maxAge: number; type: "Age" }
        | { date: string; type: "Date" };
    };
    storageClassTransitions?: {
      condition:
        | { maxAge: number; type: "Age" }
        | { date: string; type: "Date" };
      storageClass: "InfrequentAccess";
    }[];
  }[];
}

export const GetBucketLifecycleResponse = Schema.Struct({
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        conditions: Schema.Struct({
          prefix: Schema.String,
        }),
        enabled: Schema.Boolean,
        abortMultipartUploadsTransition: Schema.optional(
          Schema.Struct({
            condition: Schema.optional(
              Schema.Struct({
                maxAge: Schema.Number,
                type: Schema.Literal("Age"),
              }),
            ),
          }),
        ),
        deleteObjectsTransition: Schema.optional(
          Schema.Struct({
            condition: Schema.optional(
              Schema.Union(
                Schema.Struct({
                  maxAge: Schema.Number,
                  type: Schema.Literal("Age"),
                }),
                Schema.Struct({
                  date: Schema.String,
                  type: Schema.Literal("Date"),
                }),
              ),
            ),
          }),
        ),
        storageClassTransitions: Schema.optional(
          Schema.Array(
            Schema.Struct({
              condition: Schema.Union(
                Schema.Struct({
                  maxAge: Schema.Number,
                  type: Schema.Literal("Age"),
                }),
                Schema.Struct({
                  date: Schema.String,
                  type: Schema.Literal("Date"),
                }),
              ),
              storageClass: Schema.Literal("InfrequentAccess"),
            }),
          ),
        ),
      }),
    ),
  ),
}) as unknown as Schema.Schema<GetBucketLifecycleResponse>;

export const getBucketLifecycle: (
  input: GetBucketLifecycleRequest,
) => Effect.Effect<
  GetBucketLifecycleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBucketLifecycleRequest,
  output: GetBucketLifecycleResponse,
  errors: [],
}));

export interface PutBucketLifecycleRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
  /** Body param: */
  rules?: {
    id: string;
    conditions: { prefix: string };
    enabled: boolean;
    abortMultipartUploadsTransition?: {
      condition?: { maxAge: number; type: "Age" };
    };
    deleteObjectsTransition?: {
      condition?:
        | { maxAge: number; type: "Age" }
        | { date: string; type: "Date" };
    };
    storageClassTransitions?: {
      condition:
        | { maxAge: number; type: "Age" }
        | { date: string; type: "Date" };
      storageClass: "InfrequentAccess";
    }[];
  }[];
}

export const PutBucketLifecycleRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        conditions: Schema.Struct({
          prefix: Schema.String,
        }),
        enabled: Schema.Boolean,
        abortMultipartUploadsTransition: Schema.optional(
          Schema.Struct({
            condition: Schema.optional(
              Schema.Struct({
                maxAge: Schema.Number,
                type: Schema.Literal("Age"),
              }),
            ),
          }),
        ),
        deleteObjectsTransition: Schema.optional(
          Schema.Struct({
            condition: Schema.optional(
              Schema.Union(
                Schema.Struct({
                  maxAge: Schema.Number,
                  type: Schema.Literal("Age"),
                }),
                Schema.Struct({
                  date: Schema.String,
                  type: Schema.Literal("Date"),
                }),
              ),
            ),
          }),
        ),
        storageClassTransitions: Schema.optional(
          Schema.Array(
            Schema.Struct({
              condition: Schema.Union(
                Schema.Struct({
                  maxAge: Schema.Number,
                  type: Schema.Literal("Age"),
                }),
                Schema.Struct({
                  date: Schema.String,
                  type: Schema.Literal("Date"),
                }),
              ),
              storageClass: Schema.Literal("InfrequentAccess"),
            }),
          ),
        ),
      }),
    ),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/lifecycle",
  }),
) as unknown as Schema.Schema<PutBucketLifecycleRequest>;

export type PutBucketLifecycleResponse = unknown;

export const PutBucketLifecycleResponse =
  Schema.Unknown as unknown as Schema.Schema<PutBucketLifecycleResponse>;

export const putBucketLifecycle: (
  input: PutBucketLifecycleRequest,
) => Effect.Effect<
  PutBucketLifecycleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutBucketLifecycleRequest,
  output: PutBucketLifecycleResponse,
  errors: [],
}));

// =============================================================================
// BucketLock
// =============================================================================

export interface GetBucketLockRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const GetBucketLockRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/lock",
  }),
) as unknown as Schema.Schema<GetBucketLockRequest>;

export interface GetBucketLockResponse {
  rules?: {
    id: string;
    condition:
      | { maxAgeSeconds: number; type: "Age" }
      | { date: string; type: "Date" }
      | { type: "Indefinite" };
    enabled: boolean;
    prefix?: string;
  }[];
}

export const GetBucketLockResponse = Schema.Struct({
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        condition: Schema.Union(
          Schema.Struct({
            maxAgeSeconds: Schema.Number,
            type: Schema.Literal("Age"),
          }),
          Schema.Struct({
            date: Schema.String,
            type: Schema.Literal("Date"),
          }),
          Schema.Struct({
            type: Schema.Literal("Indefinite"),
          }),
        ),
        enabled: Schema.Boolean,
        prefix: Schema.optional(Schema.String),
      }),
    ),
  ),
}) as unknown as Schema.Schema<GetBucketLockResponse>;

export const getBucketLock: (
  input: GetBucketLockRequest,
) => Effect.Effect<
  GetBucketLockResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBucketLockRequest,
  output: GetBucketLockResponse,
  errors: [],
}));

export interface PutBucketLockRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
  /** Body param: */
  rules?: {
    id: string;
    condition:
      | { maxAgeSeconds: number; type: "Age" }
      | { date: string; type: "Date" }
      | { type: "Indefinite" };
    enabled: boolean;
    prefix?: string;
  }[];
}

export const PutBucketLockRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        condition: Schema.Union(
          Schema.Struct({
            maxAgeSeconds: Schema.Number,
            type: Schema.Literal("Age"),
          }),
          Schema.Struct({
            date: Schema.String,
            type: Schema.Literal("Date"),
          }),
          Schema.Struct({
            type: Schema.Literal("Indefinite"),
          }),
        ),
        enabled: Schema.Boolean,
        prefix: Schema.optional(Schema.String),
      }),
    ),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/lock",
  }),
) as unknown as Schema.Schema<PutBucketLockRequest>;

export type PutBucketLockResponse = unknown;

export const PutBucketLockResponse =
  Schema.Unknown as unknown as Schema.Schema<PutBucketLockResponse>;

export const putBucketLock: (
  input: PutBucketLockRequest,
) => Effect.Effect<
  PutBucketLockResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutBucketLockRequest,
  output: PutBucketLockResponse,
  errors: [],
}));

// =============================================================================
// BucketMetric
// =============================================================================

export interface ListBucketMetricsRequest {
  /** Account ID. */
  accountId: string;
}

export const ListBucketMetricsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/r2/metrics" }),
) as unknown as Schema.Schema<ListBucketMetricsRequest>;

export interface ListBucketMetricsResponse {
  /** Metrics based on what state they are in(uploaded or published). */
  infrequentAccess?: {
    published?: {
      metadataSize?: number;
      objects?: number;
      payloadSize?: number;
    };
    uploaded?: {
      metadataSize?: number;
      objects?: number;
      payloadSize?: number;
    };
  };
  /** Metrics based on what state they are in(uploaded or published). */
  standard?: {
    published?: {
      metadataSize?: number;
      objects?: number;
      payloadSize?: number;
    };
    uploaded?: {
      metadataSize?: number;
      objects?: number;
      payloadSize?: number;
    };
  };
}

export const ListBucketMetricsResponse = Schema.Struct({
  infrequentAccess: Schema.optional(
    Schema.Struct({
      published: Schema.optional(
        Schema.Struct({
          metadataSize: Schema.optional(Schema.Number),
          objects: Schema.optional(Schema.Number),
          payloadSize: Schema.optional(Schema.Number),
        }),
      ),
      uploaded: Schema.optional(
        Schema.Struct({
          metadataSize: Schema.optional(Schema.Number),
          objects: Schema.optional(Schema.Number),
          payloadSize: Schema.optional(Schema.Number),
        }),
      ),
    }),
  ),
  standard: Schema.optional(
    Schema.Struct({
      published: Schema.optional(
        Schema.Struct({
          metadataSize: Schema.optional(Schema.Number),
          objects: Schema.optional(Schema.Number),
          payloadSize: Schema.optional(Schema.Number),
        }),
      ),
      uploaded: Schema.optional(
        Schema.Struct({
          metadataSize: Schema.optional(Schema.Number),
          objects: Schema.optional(Schema.Number),
          payloadSize: Schema.optional(Schema.Number),
        }),
      ),
    }),
  ),
}) as unknown as Schema.Schema<ListBucketMetricsResponse>;

export const listBucketMetrics: (
  input: ListBucketMetricsRequest,
) => Effect.Effect<
  ListBucketMetricsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListBucketMetricsRequest,
  output: ListBucketMetricsResponse,
  errors: [],
}));

// =============================================================================
// BucketSippy
// =============================================================================

export interface GetBucketSippyRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const GetBucketSippyRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/sippy",
  }),
) as unknown as Schema.Schema<GetBucketSippyRequest>;

export interface GetBucketSippyResponse {
  /** Details about the configured destination bucket. */
  destination?: {
    accessKeyId?: string;
    account?: string;
    bucket?: string;
    provider?: "r2";
  };
  /** State of Sippy for this bucket. */
  enabled?: boolean;
  /** Details about the configured source bucket. */
  source?: {
    bucket?: string | null;
    bucketUrl?: string | null;
    provider?: "aws" | "gcs" | "s3";
    region?: string | null;
  };
}

export const GetBucketSippyResponse = Schema.Struct({
  destination: Schema.optional(
    Schema.Struct({
      accessKeyId: Schema.optional(Schema.String),
      account: Schema.optional(Schema.String),
      bucket: Schema.optional(Schema.String),
      provider: Schema.optional(Schema.Literal("r2")),
    }),
  ),
  enabled: Schema.optional(Schema.Boolean),
  source: Schema.optional(
    Schema.Struct({
      bucket: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      bucketUrl: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      provider: Schema.optional(Schema.Literal("aws", "gcs", "s3")),
      region: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
}) as unknown as Schema.Schema<GetBucketSippyResponse>;

export const getBucketSippy: (
  input: GetBucketSippyRequest,
) => Effect.Effect<
  GetBucketSippyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBucketSippyRequest,
  output: GetBucketSippyResponse,
  errors: [],
}));

export interface PutBucketSippyRequest {
  bucketName: string;
}

export const PutBucketSippyRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/sippy",
  }),
) as unknown as Schema.Schema<PutBucketSippyRequest>;

export interface PutBucketSippyResponse {
  /** Details about the configured destination bucket. */
  destination?: {
    accessKeyId?: string;
    account?: string;
    bucket?: string;
    provider?: "r2";
  };
  /** State of Sippy for this bucket. */
  enabled?: boolean;
  /** Details about the configured source bucket. */
  source?: {
    bucket?: string | null;
    bucketUrl?: string | null;
    provider?: "aws" | "gcs" | "s3";
    region?: string | null;
  };
}

export const PutBucketSippyResponse = Schema.Struct({
  destination: Schema.optional(
    Schema.Struct({
      accessKeyId: Schema.optional(Schema.String),
      account: Schema.optional(Schema.String),
      bucket: Schema.optional(Schema.String),
      provider: Schema.optional(Schema.Literal("r2")),
    }),
  ),
  enabled: Schema.optional(Schema.Boolean),
  source: Schema.optional(
    Schema.Struct({
      bucket: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      bucketUrl: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      provider: Schema.optional(Schema.Literal("aws", "gcs", "s3")),
      region: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
}) as unknown as Schema.Schema<PutBucketSippyResponse>;

export const putBucketSippy: (
  input: PutBucketSippyRequest,
) => Effect.Effect<
  PutBucketSippyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutBucketSippyRequest,
  output: PutBucketSippyResponse,
  errors: [],
}));

export interface DeleteBucketSippyRequest {
  bucketName: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Header param: Jurisdiction where objects in this bucket are guaranteed to be stored. */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const DeleteBucketSippyRequest = Schema.Struct({
  bucketName: Schema.String.pipe(T.HttpPath("bucketName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  jurisdiction: Schema.optional(
    Schema.Literal("default", "eu", "fedramp"),
  ).pipe(T.HttpHeader("cf-r2-jurisdiction")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/r2/buckets/{bucketName}/sippy",
  }),
) as unknown as Schema.Schema<DeleteBucketSippyRequest>;

export interface DeleteBucketSippyResponse {
  enabled?: false;
}

export const DeleteBucketSippyResponse = Schema.Struct({
  enabled: Schema.optional(Schema.Literal(false)),
}) as unknown as Schema.Schema<DeleteBucketSippyResponse>;

export const deleteBucketSippy: (
  input: DeleteBucketSippyRequest,
) => Effect.Effect<
  DeleteBucketSippyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteBucketSippyRequest,
  output: DeleteBucketSippyResponse,
  errors: [],
}));

// =============================================================================
// SuperSlurperConnectivityPrecheck
// =============================================================================

export interface SourceSuperSlurperConnectivityPrecheckRequest {}

export const SourceSuperSlurperConnectivityPrecheckRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/slurper/source/connectivity-precheck",
  }),
) as unknown as Schema.Schema<SourceSuperSlurperConnectivityPrecheckRequest>;

export interface SourceSuperSlurperConnectivityPrecheckResponse {
  connectivityStatus?: "success" | "error";
}

export const SourceSuperSlurperConnectivityPrecheckResponse = Schema.Struct({
  connectivityStatus: Schema.optional(Schema.Literal("success", "error")),
}) as unknown as Schema.Schema<SourceSuperSlurperConnectivityPrecheckResponse>;

export const sourceSuperSlurperConnectivityPrecheck: (
  input: SourceSuperSlurperConnectivityPrecheckRequest,
) => Effect.Effect<
  SourceSuperSlurperConnectivityPrecheckResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SourceSuperSlurperConnectivityPrecheckRequest,
  output: SourceSuperSlurperConnectivityPrecheckResponse,
  errors: [],
}));

export interface TargetSuperSlurperConnectivityPrecheckRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  bucket: string;
  /** Body param: */
  secret: { accessKeyId: string; secretAccessKey: string };
  /** Body param: */
  vendor: "r2";
  /** Body param: */
  jurisdiction?: "default" | "eu" | "fedramp";
}

export const TargetSuperSlurperConnectivityPrecheckRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  bucket: Schema.String,
  secret: Schema.Struct({
    accessKeyId: Schema.String,
    secretAccessKey: Schema.String,
  }),
  vendor: Schema.Literal("r2"),
  jurisdiction: Schema.optional(Schema.Literal("default", "eu", "fedramp")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/slurper/target/connectivity-precheck",
  }),
) as unknown as Schema.Schema<TargetSuperSlurperConnectivityPrecheckRequest>;

export interface TargetSuperSlurperConnectivityPrecheckResponse {
  connectivityStatus?: "success" | "error";
}

export const TargetSuperSlurperConnectivityPrecheckResponse = Schema.Struct({
  connectivityStatus: Schema.optional(Schema.Literal("success", "error")),
}) as unknown as Schema.Schema<TargetSuperSlurperConnectivityPrecheckResponse>;

export const targetSuperSlurperConnectivityPrecheck: (
  input: TargetSuperSlurperConnectivityPrecheckRequest,
) => Effect.Effect<
  TargetSuperSlurperConnectivityPrecheckResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TargetSuperSlurperConnectivityPrecheckRequest,
  output: TargetSuperSlurperConnectivityPrecheckResponse,
  errors: [],
}));

// =============================================================================
// SuperSlurperJob
// =============================================================================

export interface GetSuperSlurperJobRequest {
  jobId: string;
  accountId: string;
}

export const GetSuperSlurperJobRequest = Schema.Struct({
  jobId: Schema.String.pipe(T.HttpPath("jobId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/slurper/jobs/{jobId}",
  }),
) as unknown as Schema.Schema<GetSuperSlurperJobRequest>;

export interface GetSuperSlurperJobResponse {
  id?: string;
  createdAt?: string;
  finishedAt?: string | null;
  overwrite?: boolean;
  source?:
    | {
        bucket?: string;
        endpoint?: string | null;
        keys?: string[] | null;
        pathPrefix?: string | null;
        vendor?: "s3";
      }
    | {
        bucket?: string;
        keys?: string[] | null;
        pathPrefix?: string | null;
        vendor?: "gcs";
      }
    | {
        bucket?: string;
        jurisdiction?: "default" | "eu" | "fedramp";
        keys?: string[] | null;
        pathPrefix?: string | null;
        vendor?: "r2";
      };
  status?: "running" | "paused" | "aborted" | "completed";
  target?: {
    bucket?: string;
    jurisdiction?: "default" | "eu" | "fedramp";
    vendor?: "r2";
  };
}

export const GetSuperSlurperJobResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String),
  finishedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  overwrite: Schema.optional(Schema.Boolean),
  source: Schema.optional(
    Schema.Union(
      Schema.Struct({
        bucket: Schema.optional(Schema.String),
        endpoint: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        keys: Schema.optional(
          Schema.Union(Schema.Array(Schema.String), Schema.Null),
        ),
        pathPrefix: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        vendor: Schema.optional(Schema.Literal("s3")),
      }),
      Schema.Struct({
        bucket: Schema.optional(Schema.String),
        keys: Schema.optional(
          Schema.Union(Schema.Array(Schema.String), Schema.Null),
        ),
        pathPrefix: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        vendor: Schema.optional(Schema.Literal("gcs")),
      }),
      Schema.Struct({
        bucket: Schema.optional(Schema.String),
        jurisdiction: Schema.optional(
          Schema.Literal("default", "eu", "fedramp"),
        ),
        keys: Schema.optional(
          Schema.Union(Schema.Array(Schema.String), Schema.Null),
        ),
        pathPrefix: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        vendor: Schema.optional(Schema.Literal("r2")),
      }),
    ),
  ),
  status: Schema.optional(
    Schema.Literal("running", "paused", "aborted", "completed"),
  ),
  target: Schema.optional(
    Schema.Struct({
      bucket: Schema.optional(Schema.String),
      jurisdiction: Schema.optional(Schema.Literal("default", "eu", "fedramp")),
      vendor: Schema.optional(Schema.Literal("r2")),
    }),
  ),
}) as unknown as Schema.Schema<GetSuperSlurperJobResponse>;

export const getSuperSlurperJob: (
  input: GetSuperSlurperJobRequest,
) => Effect.Effect<
  GetSuperSlurperJobResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSuperSlurperJobRequest,
  output: GetSuperSlurperJobResponse,
  errors: [],
}));

export interface CreateSuperSlurperJobRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  overwrite?: boolean;
  /** Body param: */
  source?:
    | {
        bucket: string;
        secret: { accessKeyId: string; secretAccessKey: string };
        vendor: "s3";
        endpoint?: string | null;
        pathPrefix?: string | null;
        region?: string | null;
      }
    | {
        bucket: string;
        secret: { clientEmail: string; privateKey: string };
        vendor: "gcs";
        pathPrefix?: string | null;
      }
    | {
        bucket: string;
        secret: { accessKeyId: string; secretAccessKey: string };
        vendor: "r2";
        jurisdiction?: "default" | "eu" | "fedramp";
        pathPrefix?: string | null;
      };
  /** Body param: */
  target?: {
    bucket: string;
    secret: { accessKeyId: string; secretAccessKey: string };
    vendor: "r2";
    jurisdiction?: "default" | "eu" | "fedramp";
  };
}

export const CreateSuperSlurperJobRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  overwrite: Schema.optional(Schema.Boolean),
  source: Schema.optional(
    Schema.Union(
      Schema.Struct({
        bucket: Schema.String,
        secret: Schema.Struct({
          accessKeyId: Schema.String,
          secretAccessKey: Schema.String,
        }),
        vendor: Schema.Literal("s3"),
        endpoint: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        pathPrefix: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        region: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      }),
      Schema.Struct({
        bucket: Schema.String,
        secret: Schema.Struct({
          clientEmail: Schema.String,
          privateKey: Schema.String,
        }),
        vendor: Schema.Literal("gcs"),
        pathPrefix: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      }),
      Schema.Struct({
        bucket: Schema.String,
        secret: Schema.Struct({
          accessKeyId: Schema.String,
          secretAccessKey: Schema.String,
        }),
        vendor: Schema.Literal("r2"),
        jurisdiction: Schema.optional(
          Schema.Literal("default", "eu", "fedramp"),
        ),
        pathPrefix: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      }),
    ),
  ),
  target: Schema.optional(
    Schema.Struct({
      bucket: Schema.String,
      secret: Schema.Struct({
        accessKeyId: Schema.String,
        secretAccessKey: Schema.String,
      }),
      vendor: Schema.Literal("r2"),
      jurisdiction: Schema.optional(Schema.Literal("default", "eu", "fedramp")),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/slurper/jobs" }),
) as unknown as Schema.Schema<CreateSuperSlurperJobRequest>;

export interface CreateSuperSlurperJobResponse {
  id?: string;
}

export const CreateSuperSlurperJobResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateSuperSlurperJobResponse>;

export const createSuperSlurperJob: (
  input: CreateSuperSlurperJobRequest,
) => Effect.Effect<
  CreateSuperSlurperJobResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateSuperSlurperJobRequest,
  output: CreateSuperSlurperJobResponse,
  errors: [],
}));

export interface AbortSuperSlurperJobRequest {
  jobId: string;
  accountId: string;
}

export const AbortSuperSlurperJobRequest = Schema.Struct({
  jobId: Schema.String.pipe(T.HttpPath("jobId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/slurper/jobs/{jobId}/abort",
  }),
) as unknown as Schema.Schema<AbortSuperSlurperJobRequest>;

export type AbortSuperSlurperJobResponse = string;

export const AbortSuperSlurperJobResponse =
  Schema.String as unknown as Schema.Schema<AbortSuperSlurperJobResponse>;

export const abortSuperSlurperJob: (
  input: AbortSuperSlurperJobRequest,
) => Effect.Effect<
  AbortSuperSlurperJobResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: AbortSuperSlurperJobRequest,
  output: AbortSuperSlurperJobResponse,
  errors: [],
}));

export interface PauseSuperSlurperJobRequest {
  jobId: string;
  accountId: string;
}

export const PauseSuperSlurperJobRequest = Schema.Struct({
  jobId: Schema.String.pipe(T.HttpPath("jobId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/slurper/jobs/{jobId}/pause",
  }),
) as unknown as Schema.Schema<PauseSuperSlurperJobRequest>;

export type PauseSuperSlurperJobResponse = string;

export const PauseSuperSlurperJobResponse =
  Schema.String as unknown as Schema.Schema<PauseSuperSlurperJobResponse>;

export const pauseSuperSlurperJob: (
  input: PauseSuperSlurperJobRequest,
) => Effect.Effect<
  PauseSuperSlurperJobResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PauseSuperSlurperJobRequest,
  output: PauseSuperSlurperJobResponse,
  errors: [],
}));

export interface ProgressSuperSlurperJobRequest {
  jobId: string;
  accountId: string;
}

export const ProgressSuperSlurperJobRequest = Schema.Struct({
  jobId: Schema.String.pipe(T.HttpPath("jobId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/slurper/jobs/{jobId}/progress",
  }),
) as unknown as Schema.Schema<ProgressSuperSlurperJobRequest>;

export interface ProgressSuperSlurperJobResponse {
  id?: string;
  createdAt?: string;
  failedObjects?: number;
  objects?: number;
  skippedObjects?: number;
  status?: "running" | "paused" | "aborted" | "completed";
  transferredObjects?: number;
}

export const ProgressSuperSlurperJobResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String),
  failedObjects: Schema.optional(Schema.Number),
  objects: Schema.optional(Schema.Number),
  skippedObjects: Schema.optional(Schema.Number),
  status: Schema.optional(
    Schema.Literal("running", "paused", "aborted", "completed"),
  ),
  transferredObjects: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<ProgressSuperSlurperJobResponse>;

export const progressSuperSlurperJob: (
  input: ProgressSuperSlurperJobRequest,
) => Effect.Effect<
  ProgressSuperSlurperJobResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ProgressSuperSlurperJobRequest,
  output: ProgressSuperSlurperJobResponse,
  errors: [],
}));

export interface ResumeSuperSlurperJobRequest {
  jobId: string;
  accountId: string;
}

export const ResumeSuperSlurperJobRequest = Schema.Struct({
  jobId: Schema.String.pipe(T.HttpPath("jobId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/slurper/jobs/{jobId}/resume",
  }),
) as unknown as Schema.Schema<ResumeSuperSlurperJobRequest>;

export type ResumeSuperSlurperJobResponse = string;

export const ResumeSuperSlurperJobResponse =
  Schema.String as unknown as Schema.Schema<ResumeSuperSlurperJobResponse>;

export const resumeSuperSlurperJob: (
  input: ResumeSuperSlurperJobRequest,
) => Effect.Effect<
  ResumeSuperSlurperJobResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ResumeSuperSlurperJobRequest,
  output: ResumeSuperSlurperJobResponse,
  errors: [],
}));

// =============================================================================
// TemporaryCredential
// =============================================================================

export interface CreateTemporaryCredentialRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: Name of the R2 bucket. */
  bucket: string;
  /** Body param: The parent access key id to use for signing. */
  parentAccessKeyId: string;
  /** Body param: Permissions allowed on the credentials. */
  permission:
    | "admin-read-write"
    | "admin-read-only"
    | "object-read-write"
    | "object-read-only";
  /** Body param: How long the credentials will live for in seconds. */
  ttlSeconds: number;
  /** Body param: Optional object paths to scope the credentials to. */
  objects?: string[];
  /** Body param: Optional prefix paths to scope the credentials to. */
  prefixes?: string[];
}

export const CreateTemporaryCredentialRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  bucket: Schema.String,
  parentAccessKeyId: Schema.String,
  permission: Schema.Literal(
    "admin-read-write",
    "admin-read-only",
    "object-read-write",
    "object-read-only",
  ),
  ttlSeconds: Schema.Number,
  objects: Schema.optional(Schema.Array(Schema.String)),
  prefixes: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/r2/temp-access-credentials",
  }),
) as unknown as Schema.Schema<CreateTemporaryCredentialRequest>;

export interface CreateTemporaryCredentialResponse {
  /** ID for new access key. */
  accessKeyId?: string;
  /** Secret access key. */
  secretAccessKey?: string;
  /** Security token. */
  sessionToken?: string;
}

export const CreateTemporaryCredentialResponse = Schema.Struct({
  accessKeyId: Schema.optional(Schema.String),
  secretAccessKey: Schema.optional(Schema.String),
  sessionToken: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateTemporaryCredentialResponse>;

export const createTemporaryCredential: (
  input: CreateTemporaryCredentialRequest,
) => Effect.Effect<
  CreateTemporaryCredentialResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateTemporaryCredentialRequest,
  output: CreateTemporaryCredentialResponse,
  errors: [],
}));
