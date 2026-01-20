/**
 * Cloudflare AI API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service ai
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
// Ai
// =============================================================================

export interface RunAiRequest {
  modelName: string;
}

export const RunAiRequest = Schema.Struct({
  modelName: Schema.String.pipe(T.HttpPath("modelName")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/ai/run/{modelName}" }),
) as unknown as Schema.Schema<RunAiRequest>;

export type RunAiResponse =
  | { label?: string; score?: number }[]
  | File
  | Blob
  | { audio?: string }
  | { data?: number[][]; shape?: number[] }
  | {
      text: string;
      vtt?: string;
      wordCount?: number;
      words?: { end?: number; start?: number; word?: string }[];
    }
  | {
      box?: { xmax?: number; xmin?: number; ymax?: number; ymin?: number };
      label?: string;
      score?: number;
    }[]
  | {
      response: string;
      toolCalls?: { arguments?: unknown; name?: string }[];
      usage?: {
        completionTokens?: number;
        promptTokens?: number;
        totalTokens?: number;
      };
    }
  | { translatedText?: string }
  | { summary?: string }
  | { description?: string };

export const RunAiResponse = Schema.Union(
  Schema.Array(
    Schema.Struct({
      label: Schema.optional(Schema.String),
      score: Schema.optional(Schema.Number),
    }),
  ),
  UploadableSchema.pipe(T.HttpFormDataFile()),
  Schema.Struct({
    audio: Schema.optional(Schema.String),
  }),
  Schema.Struct({
    data: Schema.optional(Schema.Array(Schema.Array(Schema.Number))),
    shape: Schema.optional(Schema.Array(Schema.Number)),
  }),
  Schema.Struct({
    text: Schema.String,
    vtt: Schema.optional(Schema.String),
    wordCount: Schema.optional(Schema.Number).pipe(T.JsonName("word_count")),
    words: Schema.optional(
      Schema.Array(
        Schema.Struct({
          end: Schema.optional(Schema.Number),
          start: Schema.optional(Schema.Number),
          word: Schema.optional(Schema.String),
        }),
      ),
    ),
  }),
  Schema.Array(
    Schema.Struct({
      box: Schema.optional(
        Schema.Struct({
          xmax: Schema.optional(Schema.Number),
          xmin: Schema.optional(Schema.Number),
          ymax: Schema.optional(Schema.Number),
          ymin: Schema.optional(Schema.Number),
        }),
      ),
      label: Schema.optional(Schema.String),
      score: Schema.optional(Schema.Number),
    }),
  ),
  Schema.Struct({
    response: Schema.String,
    toolCalls: Schema.optional(
      Schema.Array(
        Schema.Struct({
          arguments: Schema.optional(Schema.Unknown),
          name: Schema.optional(Schema.String),
        }),
      ),
    ).pipe(T.JsonName("tool_calls")),
    usage: Schema.optional(
      Schema.Struct({
        completionTokens: Schema.optional(Schema.Number).pipe(
          T.JsonName("completion_tokens"),
        ),
        promptTokens: Schema.optional(Schema.Number).pipe(
          T.JsonName("prompt_tokens"),
        ),
        totalTokens: Schema.optional(Schema.Number).pipe(
          T.JsonName("total_tokens"),
        ),
      }),
    ),
  }),
  Schema.Struct({
    translatedText: Schema.optional(Schema.String).pipe(
      T.JsonName("translated_text"),
    ),
  }),
  Schema.Struct({
    summary: Schema.optional(Schema.String),
  }),
  Schema.Struct({
    description: Schema.optional(Schema.String),
  }),
) as unknown as Schema.Schema<RunAiResponse>;

export const runAi: (
  input: RunAiRequest,
) => Effect.Effect<
  RunAiResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RunAiRequest,
  output: RunAiResponse,
  errors: [],
}));

// =============================================================================
// Finetune
// =============================================================================

export interface ListFinetunesRequest {
  accountId: string;
}

export const ListFinetunesRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/ai/finetunes" }),
) as unknown as Schema.Schema<ListFinetunesRequest>;

export interface ListFinetunesResponse {
  id: string;
  createdAt: string;
  model: string;
  modifiedAt: string;
  name: string;
  description?: string;
}

export const ListFinetunesResponse = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  model: Schema.String,
  modifiedAt: Schema.String.pipe(T.JsonName("modified_at")),
  name: Schema.String,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<ListFinetunesResponse>;

export const listFinetunes: (
  input: ListFinetunesRequest,
) => Effect.Effect<
  ListFinetunesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListFinetunesRequest,
  output: ListFinetunesResponse,
  errors: [],
}));

export interface CreateFinetuneRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  model: string;
  /** Body param: */
  name: string;
  /** Body param: */
  description?: string;
  /** Body param: */
  public?: boolean;
}

export const CreateFinetuneRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  model: Schema.String,
  name: Schema.String,
  description: Schema.optional(Schema.String),
  public: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/ai/finetunes" }),
) as unknown as Schema.Schema<CreateFinetuneRequest>;

export interface CreateFinetuneResponse {
  id: string;
  createdAt: string;
  model: string;
  modifiedAt: string;
  name: string;
  public: boolean;
  description?: string;
}

export const CreateFinetuneResponse = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  model: Schema.String,
  modifiedAt: Schema.String.pipe(T.JsonName("modified_at")),
  name: Schema.String,
  public: Schema.Boolean,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateFinetuneResponse>;

export const createFinetune: (
  input: CreateFinetuneRequest,
) => Effect.Effect<
  CreateFinetuneResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateFinetuneRequest,
  output: CreateFinetuneResponse,
  errors: [],
}));

// =============================================================================
// FinetuneAsset
// =============================================================================

export interface CreateFinetuneAssetRequest {
  finetuneId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  file?: File | Blob;
  /** Body param: */
  fileName?: string;
}

export const CreateFinetuneAssetRequest = Schema.Struct({
  finetuneId: Schema.String.pipe(T.HttpPath("finetuneId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  file: Schema.optional(UploadableSchema.pipe(T.HttpFormDataFile())),
  fileName: Schema.optional(Schema.String).pipe(T.JsonName("file_name")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/ai/finetunes/{finetuneId}/finetune-assets",
    contentType: "multipart",
  }),
) as unknown as Schema.Schema<CreateFinetuneAssetRequest>;

export interface CreateFinetuneAssetResponse {
  success: boolean;
}

export const CreateFinetuneAssetResponse = Schema.Struct({
  success: Schema.Boolean,
}) as unknown as Schema.Schema<CreateFinetuneAssetResponse>;

export const createFinetuneAsset: (
  input: CreateFinetuneAssetRequest,
) => Effect.Effect<
  CreateFinetuneAssetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateFinetuneAssetRequest,
  output: CreateFinetuneAssetResponse,
  errors: [],
}));

// =============================================================================
// ModelSchema
// =============================================================================

export interface GetModelSchemaRequest {
  /** Path param: */
  accountId: string;
  /** Query param: Model Name */
  model: string;
}

export const GetModelSchemaRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  model: Schema.String.pipe(T.HttpQuery("model")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/ai/models/schema" }),
) as unknown as Schema.Schema<GetModelSchemaRequest>;

export type GetModelSchemaResponse = unknown;

export const GetModelSchemaResponse =
  Schema.Unknown as unknown as Schema.Schema<GetModelSchemaResponse>;

export const getModelSchema: (
  input: GetModelSchemaRequest,
) => Effect.Effect<
  GetModelSchemaResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetModelSchemaRequest,
  output: GetModelSchemaResponse,
  errors: [],
}));
