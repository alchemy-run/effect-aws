/**
 * Cloudflare D1 API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service d1
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
// Database
// =============================================================================

export interface GetDatabaseRequest {
  databaseId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const GetDatabaseRequest = Schema.Struct({
  databaseId: Schema.String.pipe(T.HttpPath("databaseId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/d1/database/{databaseId}",
  }),
) as unknown as Schema.Schema<GetDatabaseRequest>;

export type GetDatabaseResponse = unknown;

export const GetDatabaseResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDatabaseResponse>;

export const getDatabase: (
  input: GetDatabaseRequest,
) => Effect.Effect<
  GetDatabaseResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDatabaseRequest,
  output: GetDatabaseResponse,
  errors: [],
}));

export interface CreateDatabaseRequest {
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: D1 database name. */
  name: string;
  /** Body param: Specify the region to create the D1 primary, if available. If this option is omitted, the D1 will be created as close as possible to the current user. */
  primaryLocationHint?: "wnam" | "enam" | "weur" | "eeur" | "apac" | "oc";
}

export const CreateDatabaseRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  primaryLocationHint: Schema.optional(
    Schema.Literal("wnam", "enam", "weur", "eeur", "apac", "oc"),
  ).pipe(T.JsonName("primary_location_hint")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/d1/database" }),
) as unknown as Schema.Schema<CreateDatabaseRequest>;

export type CreateDatabaseResponse = unknown;

export const CreateDatabaseResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateDatabaseResponse>;

export const createDatabase: (
  input: CreateDatabaseRequest,
) => Effect.Effect<
  CreateDatabaseResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDatabaseRequest,
  output: CreateDatabaseResponse,
  errors: [],
}));

export interface UpdateDatabaseRequest {
  databaseId: string;
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Configuration for D1 read replication. */
  readReplication: { mode: "auto" | "disabled" };
}

export const UpdateDatabaseRequest = Schema.Struct({
  databaseId: Schema.String.pipe(T.HttpPath("databaseId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  readReplication: Schema.Struct({
    mode: Schema.Literal("auto", "disabled"),
  }).pipe(T.JsonName("read_replication")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/d1/database/{databaseId}",
  }),
) as unknown as Schema.Schema<UpdateDatabaseRequest>;

export type UpdateDatabaseResponse = unknown;

export const UpdateDatabaseResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateDatabaseResponse>;

export const updateDatabase: (
  input: UpdateDatabaseRequest,
) => Effect.Effect<
  UpdateDatabaseResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDatabaseRequest,
  output: UpdateDatabaseResponse,
  errors: [],
}));

export interface PatchDatabaseRequest {
  databaseId: string;
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Configuration for D1 read replication. */
  readReplication?: { mode: "auto" | "disabled" };
}

export const PatchDatabaseRequest = Schema.Struct({
  databaseId: Schema.String.pipe(T.HttpPath("databaseId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  readReplication: Schema.optional(
    Schema.Struct({
      mode: Schema.Literal("auto", "disabled"),
    }),
  ).pipe(T.JsonName("read_replication")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/d1/database/{databaseId}",
  }),
) as unknown as Schema.Schema<PatchDatabaseRequest>;

export type PatchDatabaseResponse = unknown;

export const PatchDatabaseResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchDatabaseResponse>;

export const patchDatabase: (
  input: PatchDatabaseRequest,
) => Effect.Effect<
  PatchDatabaseResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchDatabaseRequest,
  output: PatchDatabaseResponse,
  errors: [],
}));

export interface DeleteDatabaseRequest {
  databaseId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const DeleteDatabaseRequest = Schema.Struct({
  databaseId: Schema.String.pipe(T.HttpPath("databaseId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/d1/database/{databaseId}",
  }),
) as unknown as Schema.Schema<DeleteDatabaseRequest>;

export type DeleteDatabaseResponse = unknown;

export const DeleteDatabaseResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDatabaseResponse>;

export const deleteDatabase: (
  input: DeleteDatabaseRequest,
) => Effect.Effect<
  DeleteDatabaseResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDatabaseRequest,
  output: DeleteDatabaseResponse,
  errors: [],
}));

export interface ExportDatabaseRequest {
  databaseId: string;
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Specifies that you will poll this endpoint until the export completes */
  outputFormat: "polling";
  /** Body param: To poll an in-progress export, provide the current bookmark (returned by your first polling response) */
  currentBookmark?: string;
  /** Body param: */
  dumpOptions?: { noData?: boolean; noSchema?: boolean; tables?: string[] };
}

export const ExportDatabaseRequest = Schema.Struct({
  databaseId: Schema.String.pipe(T.HttpPath("databaseId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  outputFormat: Schema.Literal("polling").pipe(T.JsonName("output_format")),
  currentBookmark: Schema.optional(Schema.String).pipe(
    T.JsonName("current_bookmark"),
  ),
  dumpOptions: Schema.optional(
    Schema.Struct({
      noData: Schema.optional(Schema.Boolean).pipe(T.JsonName("no_data")),
      noSchema: Schema.optional(Schema.Boolean).pipe(T.JsonName("no_schema")),
      tables: Schema.optional(Schema.Array(Schema.String)),
    }),
  ).pipe(T.JsonName("dump_options")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/d1/database/{databaseId}/export",
  }),
) as unknown as Schema.Schema<ExportDatabaseRequest>;

export interface ExportDatabaseResponse {
  /** The current time-travel bookmark for your D1, used to poll for updates. Will not change for the duration of the export task. */
  atBookmark?: string;
  /** Only present when status = 'error'. Contains the error message. */
  error?: string;
  /** Logs since the last time you polled */
  messages?: string[];
  /** Only present when status = 'complete' */
  result?: { filename?: string; signedUrl?: string };
  status?: "complete" | "error";
  success?: boolean;
  type?: "export";
}

export const ExportDatabaseResponse = Schema.Struct({
  atBookmark: Schema.optional(Schema.String).pipe(T.JsonName("at_bookmark")),
  error: Schema.optional(Schema.String),
  messages: Schema.optional(Schema.Array(Schema.String)),
  result: Schema.optional(
    Schema.Struct({
      filename: Schema.optional(Schema.String),
      signedUrl: Schema.optional(Schema.String).pipe(T.JsonName("signed_url")),
    }),
  ),
  status: Schema.optional(Schema.Literal("complete", "error")),
  success: Schema.optional(Schema.Boolean),
  type: Schema.optional(Schema.Literal("export")),
}) as unknown as Schema.Schema<ExportDatabaseResponse>;

export const exportDatabase: (
  input: ExportDatabaseRequest,
) => Effect.Effect<
  ExportDatabaseResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ExportDatabaseRequest,
  output: ExportDatabaseResponse,
  errors: [],
}));

export interface ImportDatabaseRequest {
  databaseId: string;
}

export const ImportDatabaseRequest = Schema.Struct({
  databaseId: Schema.String.pipe(T.HttpPath("databaseId")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/d1/database/{databaseId}/import",
  }),
) as unknown as Schema.Schema<ImportDatabaseRequest>;

export interface ImportDatabaseResponse {
  /** The current time-travel bookmark for your D1, used to poll for updates. Will not change for the duration of the import. Only returned if an import process is currently running or recently finished. */
  atBookmark?: string;
  /** Only present when status = 'error'. Contains the error message that prevented the import from succeeding. */
  error?: string;
  /** Derived from the database ID and etag, to use in avoiding repeated uploads. Only returned when for the 'init' action. */
  filename?: string;
  /** Logs since the last time you polled */
  messages?: string[];
  /** Only present when status = 'complete' */
  result?: {
    finalBookmark?: string;
    meta?: {
      changedDb?: boolean;
      changes?: number;
      duration?: number;
      lastRowId?: number;
      rowsRead?: number;
      rowsWritten?: number;
      servedByPrimary?: boolean;
      servedByRegion?: "WNAM" | "ENAM" | "WEUR" | "EEUR" | "APAC" | "OC";
      sizeAfter?: number;
      timings?: { sqlDurationMs?: number };
    };
    numQueries?: number;
  };
  status?: "complete" | "error";
  success?: boolean;
  type?: "import";
  /** The R2 presigned URL to use for uploading. Only returned when for the 'init' action. */
  uploadUrl?: string;
}

export const ImportDatabaseResponse = Schema.Struct({
  atBookmark: Schema.optional(Schema.String).pipe(T.JsonName("at_bookmark")),
  error: Schema.optional(Schema.String),
  filename: Schema.optional(Schema.String),
  messages: Schema.optional(Schema.Array(Schema.String)),
  result: Schema.optional(
    Schema.Struct({
      finalBookmark: Schema.optional(Schema.String).pipe(
        T.JsonName("final_bookmark"),
      ),
      meta: Schema.optional(
        Schema.Struct({
          changedDb: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("changed_db"),
          ),
          changes: Schema.optional(Schema.Number),
          duration: Schema.optional(Schema.Number),
          lastRowId: Schema.optional(Schema.Number).pipe(
            T.JsonName("last_row_id"),
          ),
          rowsRead: Schema.optional(Schema.Number).pipe(
            T.JsonName("rows_read"),
          ),
          rowsWritten: Schema.optional(Schema.Number).pipe(
            T.JsonName("rows_written"),
          ),
          servedByPrimary: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("served_by_primary"),
          ),
          servedByRegion: Schema.optional(
            Schema.Literal("WNAM", "ENAM", "WEUR", "EEUR", "APAC", "OC"),
          ).pipe(T.JsonName("served_by_region")),
          sizeAfter: Schema.optional(Schema.Number).pipe(
            T.JsonName("size_after"),
          ),
          timings: Schema.optional(
            Schema.Struct({
              sqlDurationMs: Schema.optional(Schema.Number).pipe(
                T.JsonName("sql_duration_ms"),
              ),
            }),
          ),
        }),
      ),
      numQueries: Schema.optional(Schema.Number).pipe(
        T.JsonName("num_queries"),
      ),
    }),
  ),
  status: Schema.optional(Schema.Literal("complete", "error")),
  success: Schema.optional(Schema.Boolean),
  type: Schema.optional(Schema.Literal("import")),
  uploadUrl: Schema.optional(Schema.String).pipe(T.JsonName("upload_url")),
}) as unknown as Schema.Schema<ImportDatabaseResponse>;

export const importDatabase: (
  input: ImportDatabaseRequest,
) => Effect.Effect<
  ImportDatabaseResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ImportDatabaseRequest,
  output: ImportDatabaseResponse,
  errors: [],
}));
