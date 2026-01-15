/**
 * Cloudflare IMAGES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service images
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// V1
// =============================================================================

export interface GetV1Request {
  imageId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const GetV1Request = Schema.Struct({
  imageId: Schema.String.pipe(T.HttpPath("imageId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/images/v1/{imageId}" }),
) as unknown as Schema.Schema<GetV1Request>;

export interface GetV1Response {
  /** Image unique identifier. */
  id?: string;
  /** Can set the creator field with an internal user ID. */
  creator?: string | null;
  /** Image file name. */
  filename?: string;
  /** User modifiable key-value store. Can be used for keeping references to another system of record for managing images. Metadata must not exceed 1024 bytes. */
  meta?: unknown;
  /** Indicates whether the image can be a accessed only using it's UID. If set to true, a signed token needs to be generated with a signing key to view the image. */
  requireSignedURLs?: boolean;
  /** When the media item was uploaded. */
  uploaded?: string;
  /** Object specifying available variants for an image. */
  variants?: string[];
}

export const GetV1Response = Schema.Struct({
  id: Schema.optional(Schema.String),
  creator: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  filename: Schema.optional(Schema.String),
  meta: Schema.optional(Schema.Unknown),
  requireSignedURLs: Schema.optional(Schema.Boolean),
  uploaded: Schema.optional(Schema.String),
  variants: Schema.optional(Schema.Array(Schema.String)),
}) as unknown as Schema.Schema<GetV1Response>;

export const getV1 = API.make(() => ({
  input: GetV1Request,
  output: GetV1Response,
  errors: [],
}));

export interface CreateV1Request {
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: An optional custom unique identifier for your image. */
  id?: string;
  /** Body param: Can set the creator field with an internal user ID. */
  creator?: string;
  /** Body param: An image binary data. Only needed when type is uploading a file. */
  file?: unknown;
  /** Body param: User modifiable key-value store. Can use used for keeping references to another system of record for managing images. */
  metadata?: unknown;
  /** Body param: Indicates whether the image requires a signature token for the access. */
  requireSignedURLs?: boolean;
  /** Body param: A URL to fetch an image from origin. Only needed when type is uploading from a URL. */
  url?: string;
}

export const CreateV1Request = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.optional(Schema.String),
  creator: Schema.optional(Schema.String),
  file: Schema.optional(Schema.Unknown),
  metadata: Schema.optional(Schema.Unknown),
  requireSignedURLs: Schema.optional(Schema.Boolean),
  url: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/images/v1" }),
) as unknown as Schema.Schema<CreateV1Request>;

export interface CreateV1Response {
  /** Image unique identifier. */
  id?: string;
  /** Can set the creator field with an internal user ID. */
  creator?: string | null;
  /** Image file name. */
  filename?: string;
  /** User modifiable key-value store. Can be used for keeping references to another system of record for managing images. Metadata must not exceed 1024 bytes. */
  meta?: unknown;
  /** Indicates whether the image can be a accessed only using it's UID. If set to true, a signed token needs to be generated with a signing key to view the image. */
  requireSignedURLs?: boolean;
  /** When the media item was uploaded. */
  uploaded?: string;
  /** Object specifying available variants for an image. */
  variants?: string[];
}

export const CreateV1Response = Schema.Struct({
  id: Schema.optional(Schema.String),
  creator: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  filename: Schema.optional(Schema.String),
  meta: Schema.optional(Schema.Unknown),
  requireSignedURLs: Schema.optional(Schema.Boolean),
  uploaded: Schema.optional(Schema.String),
  variants: Schema.optional(Schema.Array(Schema.String)),
}) as unknown as Schema.Schema<CreateV1Response>;

export const createV1 = API.make(() => ({
  input: CreateV1Request,
  output: CreateV1Response,
  errors: [],
}));

export interface PatchV1Request {
  imageId: string;
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Can set the creator field with an internal user ID. */
  creator?: string;
  /** Body param: User modifiable key-value store. Can be used for keeping references to another system of record for managing images. No change if not specified. */
  metadata?: unknown;
  /** Body param: Indicates whether the image can be accessed using only its UID. If set to `true`, a signed token needs to be generated with a signing key to view the image. Returns a new UID on a change.  */
  requireSignedURLs?: boolean;
}

export const PatchV1Request = Schema.Struct({
  imageId: Schema.String.pipe(T.HttpPath("imageId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  creator: Schema.optional(Schema.String),
  metadata: Schema.optional(Schema.Unknown),
  requireSignedURLs: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/images/v1/{imageId}" }),
) as unknown as Schema.Schema<PatchV1Request>;

export interface PatchV1Response {
  /** Image unique identifier. */
  id?: string;
  /** Can set the creator field with an internal user ID. */
  creator?: string | null;
  /** Image file name. */
  filename?: string;
  /** User modifiable key-value store. Can be used for keeping references to another system of record for managing images. Metadata must not exceed 1024 bytes. */
  meta?: unknown;
  /** Indicates whether the image can be a accessed only using it's UID. If set to true, a signed token needs to be generated with a signing key to view the image. */
  requireSignedURLs?: boolean;
  /** When the media item was uploaded. */
  uploaded?: string;
  /** Object specifying available variants for an image. */
  variants?: string[];
}

export const PatchV1Response = Schema.Struct({
  id: Schema.optional(Schema.String),
  creator: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  filename: Schema.optional(Schema.String),
  meta: Schema.optional(Schema.Unknown),
  requireSignedURLs: Schema.optional(Schema.Boolean),
  uploaded: Schema.optional(Schema.String),
  variants: Schema.optional(Schema.Array(Schema.String)),
}) as unknown as Schema.Schema<PatchV1Response>;

export const patchV1 = API.make(() => ({
  input: PatchV1Request,
  output: PatchV1Response,
  errors: [],
}));

export interface DeleteV1Request {
  imageId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const DeleteV1Request = Schema.Struct({
  imageId: Schema.String.pipe(T.HttpPath("imageId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/images/v1/{imageId}" }),
) as unknown as Schema.Schema<DeleteV1Request>;

export type DeleteV1Response = string;

export const DeleteV1Response = Schema.String as unknown as Schema.Schema<DeleteV1Response>;

export const deleteV1 = API.make(() => ({
  input: DeleteV1Request,
  output: DeleteV1Response,
  errors: [],
}));

// =============================================================================
// V1Blob
// =============================================================================

export interface GetV1BlobRequest {
  imageId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const GetV1BlobRequest = Schema.Struct({
  imageId: Schema.String.pipe(T.HttpPath("imageId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/images/v1/{imageId}/blob" }),
) as unknown as Schema.Schema<GetV1BlobRequest>;

export type GetV1BlobResponse = unknown;

export const GetV1BlobResponse = Schema.Unknown as unknown as Schema.Schema<GetV1BlobResponse>;

export const getV1Blob = API.make(() => ({
  input: GetV1BlobRequest,
  output: GetV1BlobResponse,
  errors: [],
}));

// =============================================================================
// V1Key
// =============================================================================

export interface ListV1KeysRequest {
  /** Account identifier tag. */
  accountId: string;
}

export const ListV1KeysRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/images/v1/keys" }),
) as unknown as Schema.Schema<ListV1KeysRequest>;

export interface ListV1KeysResponse {
  keys?: { name?: string; value?: string }[];
}

export const ListV1KeysResponse = Schema.Struct({
  keys: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.optional(Schema.String),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
}) as unknown as Schema.Schema<ListV1KeysResponse>;

export const listV1Keys = API.make(() => ({
  input: ListV1KeysRequest,
  output: ListV1KeysResponse,
  errors: [],
}));

export interface PutV1KeyRequest {
  signingKeyName: string;
  /** Account identifier tag. */
  accountId: string;
}

export const PutV1KeyRequest = Schema.Struct({
  signingKeyName: Schema.String.pipe(T.HttpPath("signingKeyName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/images/v1/keys/{signingKeyName}" }),
) as unknown as Schema.Schema<PutV1KeyRequest>;

export interface PutV1KeyResponse {
  keys?: { name?: string; value?: string }[];
}

export const PutV1KeyResponse = Schema.Struct({
  keys: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.optional(Schema.String),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
}) as unknown as Schema.Schema<PutV1KeyResponse>;

export const putV1Key = API.make(() => ({
  input: PutV1KeyRequest,
  output: PutV1KeyResponse,
  errors: [],
}));

export interface DeleteV1KeyRequest {
  signingKeyName: string;
  /** Account identifier tag. */
  accountId: string;
}

export const DeleteV1KeyRequest = Schema.Struct({
  signingKeyName: Schema.String.pipe(T.HttpPath("signingKeyName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/images/v1/keys/{signingKeyName}" }),
) as unknown as Schema.Schema<DeleteV1KeyRequest>;

export interface DeleteV1KeyResponse {
  keys?: { name?: string; value?: string }[];
}

export const DeleteV1KeyResponse = Schema.Struct({
  keys: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.optional(Schema.String),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
}) as unknown as Schema.Schema<DeleteV1KeyResponse>;

export const deleteV1Key = API.make(() => ({
  input: DeleteV1KeyRequest,
  output: DeleteV1KeyResponse,
  errors: [],
}));

// =============================================================================
// V1Stat
// =============================================================================

export interface GetV1StatRequest {
  /** Account identifier tag. */
  accountId: string;
}

export const GetV1StatRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/images/v1/stats" }),
) as unknown as Schema.Schema<GetV1StatRequest>;

export interface GetV1StatResponse {
  count?: { allowed?: number; current?: number };
}

export const GetV1StatResponse = Schema.Struct({
  count: Schema.optional(
    Schema.Struct({
      allowed: Schema.optional(Schema.Number),
      current: Schema.optional(Schema.Number),
    }),
  ),
}) as unknown as Schema.Schema<GetV1StatResponse>;

export const getV1Stat = API.make(() => ({
  input: GetV1StatRequest,
  output: GetV1StatResponse,
  errors: [],
}));

// =============================================================================
// V1Variant
// =============================================================================

export interface GetV1VariantRequest {
  variantId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const GetV1VariantRequest = Schema.Struct({
  variantId: Schema.String.pipe(T.HttpPath("variantId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/images/v1/variants/{variantId}" }),
) as unknown as Schema.Schema<GetV1VariantRequest>;

export interface GetV1VariantResponse {
  variant?: {
    id: string;
    options: {
      fit: "scale-down" | "contain" | "cover" | "crop" | "pad";
      height: number;
      metadata: "keep" | "copyright" | "none";
      width: number;
    };
    neverRequireSignedURLs?: boolean;
  };
}

export const GetV1VariantResponse = Schema.Struct({
  variant: Schema.optional(
    Schema.Struct({
      id: Schema.String,
      options: Schema.Struct({
        fit: Schema.Literal("scale-down", "contain", "cover", "crop", "pad"),
        height: Schema.Number,
        metadata: Schema.Literal("keep", "copyright", "none"),
        width: Schema.Number,
      }),
      neverRequireSignedURLs: Schema.optional(Schema.Boolean),
    }),
  ),
}) as unknown as Schema.Schema<GetV1VariantResponse>;

export const getV1Variant = API.make(() => ({
  input: GetV1VariantRequest,
  output: GetV1VariantResponse,
  errors: [],
}));

export interface ListV1VariantsRequest {
  /** Account identifier tag. */
  accountId: string;
}

export const ListV1VariantsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/images/v1/variants" }),
) as unknown as Schema.Schema<ListV1VariantsRequest>;

export interface ListV1VariantsResponse {
  id: string;
  /** Allows you to define image resizing sizes for different use cases. */
  options: {
    fit: "scale-down" | "contain" | "cover" | "crop" | "pad";
    height: number;
    metadata: "keep" | "copyright" | "none";
    width: number;
  };
  /** Indicates whether the variant can access an image without a signature, regardless of image access control. */
  neverRequireSignedURLs?: boolean;
}

export const ListV1VariantsResponse = Schema.Struct({
  id: Schema.String,
  options: Schema.Struct({
    fit: Schema.Literal("scale-down", "contain", "cover", "crop", "pad"),
    height: Schema.Number,
    metadata: Schema.Literal("keep", "copyright", "none"),
    width: Schema.Number,
  }),
  neverRequireSignedURLs: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<ListV1VariantsResponse>;

export const listV1Variants = API.make(() => ({
  input: ListV1VariantsRequest,
  output: ListV1VariantsResponse,
  errors: [],
}));

export interface CreateV1VariantRequest {
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: */
  id: string;
  /** Body param: Allows you to define image resizing sizes for different use cases. */
  options: {
    fit: "scale-down" | "contain" | "cover" | "crop" | "pad";
    height: number;
    metadata: "keep" | "copyright" | "none";
    width: number;
  };
  /** Body param: Indicates whether the variant can access an image without a signature, regardless of image access control. */
  neverRequireSignedURLs?: boolean;
}

export const CreateV1VariantRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.String,
  options: Schema.Struct({
    fit: Schema.Literal("scale-down", "contain", "cover", "crop", "pad"),
    height: Schema.Number,
    metadata: Schema.Literal("keep", "copyright", "none"),
    width: Schema.Number,
  }),
  neverRequireSignedURLs: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/images/v1/variants" }),
) as unknown as Schema.Schema<CreateV1VariantRequest>;

export interface CreateV1VariantResponse {
  variant?: {
    id: string;
    options: {
      fit: "scale-down" | "contain" | "cover" | "crop" | "pad";
      height: number;
      metadata: "keep" | "copyright" | "none";
      width: number;
    };
    neverRequireSignedURLs?: boolean;
  };
}

export const CreateV1VariantResponse = Schema.Struct({
  variant: Schema.optional(
    Schema.Struct({
      id: Schema.String,
      options: Schema.Struct({
        fit: Schema.Literal("scale-down", "contain", "cover", "crop", "pad"),
        height: Schema.Number,
        metadata: Schema.Literal("keep", "copyright", "none"),
        width: Schema.Number,
      }),
      neverRequireSignedURLs: Schema.optional(Schema.Boolean),
    }),
  ),
}) as unknown as Schema.Schema<CreateV1VariantResponse>;

export const createV1Variant = API.make(() => ({
  input: CreateV1VariantRequest,
  output: CreateV1VariantResponse,
  errors: [],
}));

export interface PatchV1VariantRequest {
  variantId: string;
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Allows you to define image resizing sizes for different use cases. */
  options: {
    fit: "scale-down" | "contain" | "cover" | "crop" | "pad";
    height: number;
    metadata: "keep" | "copyright" | "none";
    width: number;
  };
  /** Body param: Indicates whether the variant can access an image without a signature, regardless of image access control. */
  neverRequireSignedURLs?: boolean;
}

export const PatchV1VariantRequest = Schema.Struct({
  variantId: Schema.String.pipe(T.HttpPath("variantId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  options: Schema.Struct({
    fit: Schema.Literal("scale-down", "contain", "cover", "crop", "pad"),
    height: Schema.Number,
    metadata: Schema.Literal("keep", "copyright", "none"),
    width: Schema.Number,
  }),
  neverRequireSignedURLs: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/images/v1/variants/{variantId}" }),
) as unknown as Schema.Schema<PatchV1VariantRequest>;

export interface PatchV1VariantResponse {
  variant?: {
    id: string;
    options: {
      fit: "scale-down" | "contain" | "cover" | "crop" | "pad";
      height: number;
      metadata: "keep" | "copyright" | "none";
      width: number;
    };
    neverRequireSignedURLs?: boolean;
  };
}

export const PatchV1VariantResponse = Schema.Struct({
  variant: Schema.optional(
    Schema.Struct({
      id: Schema.String,
      options: Schema.Struct({
        fit: Schema.Literal("scale-down", "contain", "cover", "crop", "pad"),
        height: Schema.Number,
        metadata: Schema.Literal("keep", "copyright", "none"),
        width: Schema.Number,
      }),
      neverRequireSignedURLs: Schema.optional(Schema.Boolean),
    }),
  ),
}) as unknown as Schema.Schema<PatchV1VariantResponse>;

export const patchV1Variant = API.make(() => ({
  input: PatchV1VariantRequest,
  output: PatchV1VariantResponse,
  errors: [],
}));

export interface DeleteV1VariantRequest {
  variantId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const DeleteV1VariantRequest = Schema.Struct({
  variantId: Schema.String.pipe(T.HttpPath("variantId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/images/v1/variants/{variantId}" }),
) as unknown as Schema.Schema<DeleteV1VariantRequest>;

export type DeleteV1VariantResponse = string;

export const DeleteV1VariantResponse =
  Schema.String as unknown as Schema.Schema<DeleteV1VariantResponse>;

export const deleteV1Variant = API.make(() => ({
  input: DeleteV1VariantRequest,
  output: DeleteV1VariantResponse,
  errors: [],
}));

// =============================================================================
// V2
// =============================================================================

export interface ListV2sRequest {
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Query param: Continuation token for a next page. List images V2 returns continuation_token */
  continuationToken?: string | null;
  /** Query param: Internal user ID set within the creator field. Setting to empty string "" will return images where creator field is not set */
  creator?: string | null;
  /** Query param: Number of items per page. */
  perPage?: number;
  /** Query param: Sorting order by upload time. */
  sortOrder?: "asc" | "desc";
}

export const ListV2sRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  continuationToken: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.HttpQuery("continuation_token"),
  ),
  creator: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(T.HttpQuery("creator")),
  perPage: Schema.optional(Schema.Number).pipe(T.HttpQuery("per_page")),
  sortOrder: Schema.optional(Schema.Literal("asc", "desc")).pipe(T.HttpQuery("sort_order")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/images/v2" }),
) as unknown as Schema.Schema<ListV2sRequest>;

export interface ListV2sResponse {
  /** Continuation token to fetch next page. Passed as a query param when requesting List V2 api endpoint. */
  continuationToken?: string | null;
  images?: unknown[];
}

export const ListV2sResponse = Schema.Struct({
  continuationToken: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("continuation_token"),
  ),
  images: Schema.optional(Schema.Array(Schema.Unknown)),
}) as unknown as Schema.Schema<ListV2sResponse>;

export const listV2s = API.make(() => ({
  input: ListV2sRequest,
  output: ListV2sResponse,
  errors: [],
}));

// =============================================================================
// V2DirectUpload
// =============================================================================

export interface CreateV2DirectUploadRequest {
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Optional Image Custom ID. Up to 1024 chars. Can include any number of subpaths, and utf8 characters. Cannot start nor end with a / (forward slash). Cannot be a UUID. */
  id?: string;
  /** Body param: Can set the creator field with an internal user ID. */
  creator?: string;
  /** Body param: The date after which the upload will not be accepted. Minimum: Now + 2 minutes. Maximum: Now + 6 hours. */
  expiry?: string;
  /** Body param: User modifiable key-value store. Can be used for keeping references to another system of record, for managing images. */
  metadata?: unknown;
  /** Body param: Indicates whether the image requires a signature token to be accessed. */
  requireSignedURLs?: boolean;
}

export const CreateV2DirectUploadRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.optional(Schema.String),
  creator: Schema.optional(Schema.String),
  expiry: Schema.optional(Schema.String),
  metadata: Schema.optional(Schema.Unknown),
  requireSignedURLs: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/images/v2/direct_upload" }),
) as unknown as Schema.Schema<CreateV2DirectUploadRequest>;

export interface CreateV2DirectUploadResponse {
  /** Image unique identifier. */
  id?: string;
  /** The URL the unauthenticated upload can be performed to using a single HTTP POST (multipart/form-data) request. */
  uploadURL?: string;
}

export const CreateV2DirectUploadResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  uploadURL: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateV2DirectUploadResponse>;

export const createV2DirectUpload = API.make(() => ({
  input: CreateV2DirectUploadRequest,
  output: CreateV2DirectUploadResponse,
  errors: [],
}));
