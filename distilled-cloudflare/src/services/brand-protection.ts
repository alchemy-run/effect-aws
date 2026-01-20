/**
 * Cloudflare BRAND-PROTECTION API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service brand-protection
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
// BrandProtection
// =============================================================================

export interface SubmitBrandProtectionRequest {
  accountId: string;
}

export const SubmitBrandProtectionRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/brand-protection/submit",
  }),
) as unknown as Schema.Schema<SubmitBrandProtectionRequest>;

export interface SubmitBrandProtectionResponse {
  skippedUrls?: Record<string, unknown>[];
  submittedUrls?: Record<string, unknown>[];
}

export const SubmitBrandProtectionResponse = Schema.Struct({
  skippedUrls: Schema.optional(Schema.Array(Schema.Struct({}))).pipe(
    T.JsonName("skipped_urls"),
  ),
  submittedUrls: Schema.optional(Schema.Array(Schema.Struct({}))).pipe(
    T.JsonName("submitted_urls"),
  ),
}) as unknown as Schema.Schema<SubmitBrandProtectionResponse>;

export const submitBrandProtection: (
  input: SubmitBrandProtectionRequest,
) => Effect.Effect<
  SubmitBrandProtectionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SubmitBrandProtectionRequest,
  output: SubmitBrandProtectionResponse,
  errors: [],
}));

// =============================================================================
// Logo
// =============================================================================

export interface CreateLogoRequest {
  /** Path param: */
  accountId: string;
  /** Query param: */
  matchType?: string;
  /** Query param: */
  tag?: string;
  /** Query param: */
  threshold?: number;
  /** Body param: */
  image?: File | Blob;
}

export const CreateLogoRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  matchType: Schema.optional(Schema.String).pipe(T.HttpQuery("match_type")),
  tag: Schema.optional(Schema.String).pipe(T.HttpQuery("tag")),
  threshold: Schema.optional(Schema.Number).pipe(T.HttpQuery("threshold")),
  image: Schema.optional(UploadableSchema.pipe(T.HttpFormDataFile())),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/brand-protection/logos",
    contentType: "multipart",
  }),
) as unknown as Schema.Schema<CreateLogoRequest>;

export interface CreateLogoResponse {
  id?: number;
  tag?: string;
  uploadPath?: string;
}

export const CreateLogoResponse = Schema.Struct({
  id: Schema.optional(Schema.Number),
  tag: Schema.optional(Schema.String),
  uploadPath: Schema.optional(Schema.String).pipe(T.JsonName("upload_path")),
}) as unknown as Schema.Schema<CreateLogoResponse>;

export const createLogo: (
  input: CreateLogoRequest,
) => Effect.Effect<
  CreateLogoResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateLogoRequest,
  output: CreateLogoResponse,
  errors: [],
}));

export interface DeleteLogoRequest {
  logoId: string;
  accountId: string;
}

export const DeleteLogoRequest = Schema.Struct({
  logoId: Schema.String.pipe(T.HttpPath("logoId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/brand-protection/logos/{logoId}",
  }),
) as unknown as Schema.Schema<DeleteLogoRequest>;

export type DeleteLogoResponse = unknown;

export const DeleteLogoResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteLogoResponse>;

export const deleteLogo: (
  input: DeleteLogoRequest,
) => Effect.Effect<
  DeleteLogoResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteLogoRequest,
  output: DeleteLogoResponse,
  errors: [],
}));

// =============================================================================
// LogoMatch
// =============================================================================

export interface GetLogoMatchRequest {
  /** Path param: */
  accountId: string;
  /** Query param: */
  limit?: string;
  /** Query param: */
  logoId?: string[];
  /** Query param: */
  offset?: string;
}

export const GetLogoMatchRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  limit: Schema.optional(Schema.String).pipe(T.HttpQuery("limit")),
  logoId: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("logo_id"),
  ),
  offset: Schema.optional(Schema.String).pipe(T.HttpQuery("offset")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/brand-protection/logo-matches",
  }),
) as unknown as Schema.Schema<GetLogoMatchRequest>;

export interface GetLogoMatchResponse {
  matches?: Record<string, unknown>[];
  total?: number;
}

export const GetLogoMatchResponse = Schema.Struct({
  matches: Schema.optional(Schema.Array(Schema.Struct({}))),
  total: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetLogoMatchResponse>;

export const getLogoMatch: (
  input: GetLogoMatchRequest,
) => Effect.Effect<
  GetLogoMatchResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetLogoMatchRequest,
  output: GetLogoMatchResponse,
  errors: [],
}));

export interface DownloadLogoMatchRequest {
  /** Path param: */
  accountId: string;
  /** Query param: */
  limit?: string;
  /** Query param: */
  logoId?: string[];
  /** Query param: */
  offset?: string;
}

export const DownloadLogoMatchRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  limit: Schema.optional(Schema.String).pipe(T.HttpQuery("limit")),
  logoId: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("logo_id"),
  ),
  offset: Schema.optional(Schema.String).pipe(T.HttpQuery("offset")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/brand-protection/logo-matches/download",
  }),
) as unknown as Schema.Schema<DownloadLogoMatchRequest>;

export interface DownloadLogoMatchResponse {
  matches?: Record<string, unknown>[];
  total?: number;
}

export const DownloadLogoMatchResponse = Schema.Struct({
  matches: Schema.optional(Schema.Array(Schema.Struct({}))),
  total: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<DownloadLogoMatchResponse>;

export const downloadLogoMatch: (
  input: DownloadLogoMatchRequest,
) => Effect.Effect<
  DownloadLogoMatchResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DownloadLogoMatchRequest,
  output: DownloadLogoMatchResponse,
  errors: [],
}));

// =============================================================================
// Match
// =============================================================================

export interface GetMatchRequest {
  /** Path param: */
  accountId: string;
  /** Query param: */
  id?: string;
  /** Query param: */
  includeDomainId?: boolean;
  /** Query param: */
  limit?: number;
  /** Query param: */
  offset?: number;
}

export const GetMatchRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.optional(Schema.String).pipe(T.HttpQuery("id")),
  includeDomainId: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("include_domain_id"),
  ),
  limit: Schema.optional(Schema.Number).pipe(T.HttpQuery("limit")),
  offset: Schema.optional(Schema.Number).pipe(T.HttpQuery("offset")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/brand-protection/matches",
  }),
) as unknown as Schema.Schema<GetMatchRequest>;

export interface GetMatchResponse {
  matches?: Record<string, unknown>[];
  total?: number;
}

export const GetMatchResponse = Schema.Struct({
  matches: Schema.optional(Schema.Array(Schema.Struct({}))),
  total: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetMatchResponse>;

export const getMatch: (
  input: GetMatchRequest,
) => Effect.Effect<
  GetMatchResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetMatchRequest,
  output: GetMatchResponse,
  errors: [],
}));

export interface DownloadMatchRequest {
  /** Path param: */
  accountId: string;
  /** Query param: */
  id?: string;
  /** Query param: */
  includeDomainId?: boolean;
  /** Query param: */
  limit?: number;
  /** Query param: */
  offset?: number;
}

export const DownloadMatchRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.optional(Schema.String).pipe(T.HttpQuery("id")),
  includeDomainId: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("include_domain_id"),
  ),
  limit: Schema.optional(Schema.Number).pipe(T.HttpQuery("limit")),
  offset: Schema.optional(Schema.Number).pipe(T.HttpQuery("offset")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/brand-protection/matches/download",
  }),
) as unknown as Schema.Schema<DownloadMatchRequest>;

export interface DownloadMatchResponse {
  matches?: Record<string, unknown>[];
  total?: number;
}

export const DownloadMatchResponse = Schema.Struct({
  matches: Schema.optional(Schema.Array(Schema.Struct({}))),
  total: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<DownloadMatchResponse>;

export const downloadMatch: (
  input: DownloadMatchRequest,
) => Effect.Effect<
  DownloadMatchResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DownloadMatchRequest,
  output: DownloadMatchResponse,
  errors: [],
}));

// =============================================================================
// Query
// =============================================================================

export interface CreateQueryRequest {
  /** Path param: */
  accountId: string;
  /** Query param: */
  id?: string;
  /** Query param: */
  queryScan?: boolean;
  /** Query param: */
  queryTag?: string;
  /** Body param: */
  maxTime?: string | null;
  /** Body param: */
  minTime?: string | null;
  /** Body param: */
  bodyScan?: boolean;
  /** Body param: */
  stringMatches?: unknown;
  /** Body param: */
  bodyTag?: string;
}

export const CreateQueryRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.optional(Schema.String).pipe(T.HttpQuery("id")),
  queryScan: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("query_scan")),
  queryTag: Schema.optional(Schema.String).pipe(T.HttpQuery("query_tag")),
  maxTime: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("max_time"),
  ),
  minTime: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("min_time"),
  ),
  bodyScan: Schema.optional(Schema.Boolean).pipe(T.JsonName("body_scan")),
  stringMatches: Schema.optional(Schema.Unknown).pipe(
    T.JsonName("string_matches"),
  ),
  bodyTag: Schema.optional(Schema.String).pipe(T.JsonName("body_tag")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/brand-protection/queries",
  }),
) as unknown as Schema.Schema<CreateQueryRequest>;

export type CreateQueryResponse = unknown;

export const CreateQueryResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateQueryResponse>;

export const createQuery: (
  input: CreateQueryRequest,
) => Effect.Effect<
  CreateQueryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateQueryRequest,
  output: CreateQueryResponse,
  errors: [],
}));

export interface DeleteQueryRequest {
  /** Path param: */
  accountId: string;
  /** Query param: */
  id?: string;
  /** Query param: */
  scan?: boolean;
  /** Query param: */
  tag?: string;
}

export const DeleteQueryRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.optional(Schema.String).pipe(T.HttpQuery("id")),
  scan: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("scan")),
  tag: Schema.optional(Schema.String).pipe(T.HttpQuery("tag")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/brand-protection/queries",
  }),
) as unknown as Schema.Schema<DeleteQueryRequest>;

export type DeleteQueryResponse = unknown;

export const DeleteQueryResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteQueryResponse>;

export const deleteQuery: (
  input: DeleteQueryRequest,
) => Effect.Effect<
  DeleteQueryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteQueryRequest,
  output: DeleteQueryResponse,
  errors: [],
}));

export interface BulkQueryRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  queries?: Record<string, unknown>[];
}

export const BulkQueryRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  queries: Schema.optional(Schema.Array(Schema.Struct({}))),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/brand-protection/queries/bulk",
  }),
) as unknown as Schema.Schema<BulkQueryRequest>;

export type BulkQueryResponse = unknown;

export const BulkQueryResponse =
  Schema.Unknown as unknown as Schema.Schema<BulkQueryResponse>;

export const bulkQuery: (
  input: BulkQueryRequest,
) => Effect.Effect<
  BulkQueryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkQueryRequest,
  output: BulkQueryResponse,
  errors: [],
}));
