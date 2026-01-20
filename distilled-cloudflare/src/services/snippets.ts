/**
 * Cloudflare SNIPPETS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service snippets
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
// Content
// =============================================================================

export interface GetContentRequest {
  snippetName: string;
  /** The unique ID of the zone. */
  zoneId: string;
}

export const GetContentRequest = Schema.Struct({
  snippetName: Schema.String.pipe(T.HttpPath("snippetName")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/snippets/{snippetName}/content",
  }),
) as unknown as Schema.Schema<GetContentRequest>;

export type GetContentResponse = unknown;

export const GetContentResponse =
  Schema.Unknown as unknown as Schema.Schema<GetContentResponse>;

export const getContent: (
  input: GetContentRequest,
) => Effect.Effect<
  GetContentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetContentRequest,
  output: GetContentResponse,
  errors: [],
}));

// =============================================================================
// Snippet
// =============================================================================

export interface GetSnippetRequest {
  snippetName: string;
  /** The unique ID of the zone. */
  zoneId: string;
}

export const GetSnippetRequest = Schema.Struct({
  snippetName: Schema.String.pipe(T.HttpPath("snippetName")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/snippets/{snippetName}" }),
) as unknown as Schema.Schema<GetSnippetRequest>;

export interface GetSnippetResponse {
  /** The timestamp of when the snippet was created. */
  createdOn: string;
  /** The identifying name of the snippet. */
  snippetName: string;
  /** The timestamp of when the snippet was last modified. */
  modifiedOn?: string;
}

export const GetSnippetResponse = Schema.Struct({
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  snippetName: Schema.String.pipe(T.JsonName("snippet_name")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
}) as unknown as Schema.Schema<GetSnippetResponse>;

export const getSnippet: (
  input: GetSnippetRequest,
) => Effect.Effect<
  GetSnippetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSnippetRequest,
  output: GetSnippetResponse,
  errors: [],
}));

export interface PutSnippetRequest {
  snippetName: string;
  /** Path param: The unique ID of the zone. */
  zoneId: string;
  /** Body param: Metadata about the snippet. */
  metadata: { mainModule: string };
}

export const PutSnippetRequest = Schema.Struct({
  snippetName: Schema.String.pipe(T.HttpPath("snippetName")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  metadata: Schema.Struct({
    mainModule: Schema.String.pipe(T.JsonName("main_module")),
  }),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/snippets/{snippetName}" }),
) as unknown as Schema.Schema<PutSnippetRequest>;

export interface PutSnippetResponse {
  /** The timestamp of when the snippet was created. */
  createdOn: string;
  /** The identifying name of the snippet. */
  snippetName: string;
  /** The timestamp of when the snippet was last modified. */
  modifiedOn?: string;
}

export const PutSnippetResponse = Schema.Struct({
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  snippetName: Schema.String.pipe(T.JsonName("snippet_name")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
}) as unknown as Schema.Schema<PutSnippetResponse>;

export const putSnippet: (
  input: PutSnippetRequest,
) => Effect.Effect<
  PutSnippetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutSnippetRequest,
  output: PutSnippetResponse,
  errors: [],
}));

export interface DeleteSnippetRequest {
  snippetName: string;
  /** The unique ID of the zone. */
  zoneId: string;
}

export const DeleteSnippetRequest = Schema.Struct({
  snippetName: Schema.String.pipe(T.HttpPath("snippetName")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/snippets/{snippetName}" }),
) as unknown as Schema.Schema<DeleteSnippetRequest>;

export type DeleteSnippetResponse = unknown;

export const DeleteSnippetResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteSnippetResponse>;

export const deleteSnippet: (
  input: DeleteSnippetRequest,
) => Effect.Effect<
  DeleteSnippetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteSnippetRequest,
  output: DeleteSnippetResponse,
  errors: [],
}));
