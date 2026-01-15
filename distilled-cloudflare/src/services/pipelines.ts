/**
 * Cloudflare PIPELINES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service pipelines
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Pipeline
// =============================================================================

export interface GetPipelineRequest {
  pipelineName: string;
  /** Specifies the public ID of the account. */
  accountId: string;
}

export const GetPipelineRequest = Schema.Struct({
  pipelineName: Schema.String.pipe(T.HttpPath("pipelineName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/pipelines/{pipelineName}" }),
) as unknown as Schema.Schema<GetPipelineRequest>;

export interface GetPipelineResponse {
  /** Specifies the pipeline identifier. */
  id: string;
  destination: {
    batch: { maxBytes?: number; maxDurationS?: number; maxRows?: number };
    compression: { type?: "none" | "gzip" | "deflate" };
    format: "json";
    path: { bucket: string; filename?: string; filepath?: string; prefix?: string };
    type: "r2";
  };
  /** Indicates the endpoint URL to send traffic. */
  endpoint: string;
  /** Defines the name of the pipeline. */
  name: string;
  source: (
    | { format: "json"; type: string; authentication?: boolean; cors?: { origins?: string[] } }
    | { format: "json"; type: string }
  )[];
  /** Indicates the version number of last saved configuration. */
  version: number;
}

export const GetPipelineResponse = Schema.Struct({
  id: Schema.String,
  destination: Schema.Struct({
    batch: Schema.Struct({
      maxBytes: Schema.optional(Schema.Number).pipe(T.JsonName("max_bytes")),
      maxDurationS: Schema.optional(Schema.Number).pipe(T.JsonName("max_duration_s")),
      maxRows: Schema.optional(Schema.Number).pipe(T.JsonName("max_rows")),
    }),
    compression: Schema.Struct({
      type: Schema.optional(Schema.Literal("none", "gzip", "deflate")),
    }),
    format: Schema.Literal("json"),
    path: Schema.Struct({
      bucket: Schema.String,
      filename: Schema.optional(Schema.String),
      filepath: Schema.optional(Schema.String),
      prefix: Schema.optional(Schema.String),
    }),
    type: Schema.Literal("r2"),
  }),
  endpoint: Schema.String,
  name: Schema.String,
  source: Schema.Array(
    Schema.Union(
      Schema.Struct({
        format: Schema.Literal("json"),
        type: Schema.String,
        authentication: Schema.optional(Schema.Boolean),
        cors: Schema.optional(
          Schema.Struct({
            origins: Schema.optional(Schema.Array(Schema.String)),
          }),
        ),
      }),
      Schema.Struct({
        format: Schema.Literal("json"),
        type: Schema.String,
      }),
    ),
  ),
  version: Schema.Number,
}) as unknown as Schema.Schema<GetPipelineResponse>;

export const getPipeline = API.make(() => ({
  input: GetPipelineRequest,
  output: GetPipelineResponse,
  errors: [],
}));

export interface ListPipelinesRequest {
  /** Path param: Specifies the public ID of the account. */
  accountId: string;
  /** Query param: Specifies which page to retrieve. */
  page?: string;
  /** Query param: Specifies the number of pipelines per page. */
  perPage?: string;
  /** Query param: Specifies the prefix of pipeline name to search. */
  search?: string;
}

export const ListPipelinesRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  page: Schema.optional(Schema.String).pipe(T.HttpQuery("page")),
  perPage: Schema.optional(Schema.String).pipe(T.HttpQuery("per_page")),
  search: Schema.optional(Schema.String).pipe(T.HttpQuery("search")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/pipelines" }),
) as unknown as Schema.Schema<ListPipelinesRequest>;

export interface ListPipelinesResponse {
  resultInfo: { count: number; page: number; perPage: number; totalCount: number };
  results: {
    id: string;
    destination: {
      batch: { maxBytes?: number; maxDurationS?: number; maxRows?: number };
      compression: { type?: "none" | "gzip" | "deflate" };
      format: "json";
      path: { bucket: string; filename?: string; filepath?: string; prefix?: string };
      type: "r2";
    };
    endpoint: string;
    name: string;
    source: (
      | { format: "json"; type: string; authentication?: boolean; cors?: { origins?: string[] } }
      | { format: "json"; type: string }
    )[];
    version: number;
  }[];
  /** Indicates whether the API call was successful. */
  success: boolean;
}

export const ListPipelinesResponse = Schema.Struct({
  resultInfo: Schema.Struct({
    count: Schema.Number,
    page: Schema.Number,
    perPage: Schema.Number.pipe(T.JsonName("per_page")),
    totalCount: Schema.Number.pipe(T.JsonName("total_count")),
  }).pipe(T.JsonName("result_info")),
  results: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      destination: Schema.Struct({
        batch: Schema.Struct({
          maxBytes: Schema.optional(Schema.Number).pipe(T.JsonName("max_bytes")),
          maxDurationS: Schema.optional(Schema.Number).pipe(T.JsonName("max_duration_s")),
          maxRows: Schema.optional(Schema.Number).pipe(T.JsonName("max_rows")),
        }),
        compression: Schema.Struct({
          type: Schema.optional(Schema.Literal("none", "gzip", "deflate")),
        }),
        format: Schema.Literal("json"),
        path: Schema.Struct({
          bucket: Schema.String,
          filename: Schema.optional(Schema.String),
          filepath: Schema.optional(Schema.String),
          prefix: Schema.optional(Schema.String),
        }),
        type: Schema.Literal("r2"),
      }),
      endpoint: Schema.String,
      name: Schema.String,
      source: Schema.Array(
        Schema.Union(
          Schema.Struct({
            format: Schema.Literal("json"),
            type: Schema.String,
            authentication: Schema.optional(Schema.Boolean),
            cors: Schema.optional(
              Schema.Struct({
                origins: Schema.optional(Schema.Array(Schema.String)),
              }),
            ),
          }),
          Schema.Struct({
            format: Schema.Literal("json"),
            type: Schema.String,
          }),
        ),
      ),
      version: Schema.Number,
    }),
  ),
  success: Schema.Boolean,
}) as unknown as Schema.Schema<ListPipelinesResponse>;

export const listPipelines = API.make(() => ({
  input: ListPipelinesRequest,
  output: ListPipelinesResponse,
  errors: [],
}));

export interface CreatePipelineRequest {
  /** Path param: Specifies the public ID of the account. */
  accountId: string;
  /** Body param: */
  destination: {
    batch: { maxBytes?: number; maxDurationS?: number; maxRows?: number };
    compression: { type?: "none" | "gzip" | "deflate" };
    credentials: { accessKeyId: string; endpoint: string; secretAccessKey: string };
    format: "json";
    path: { bucket: string; filename?: string; filepath?: string; prefix?: string };
    type: "r2";
  };
  /** Body param: Defines the name of the pipeline. */
  name: string;
  /** Body param: */
  source: (
    | { format: "json"; type: string; authentication?: boolean; cors?: { origins?: string[] } }
    | { format: "json"; type: string }
  )[];
}

export const CreatePipelineRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  destination: Schema.Struct({
    batch: Schema.Struct({
      maxBytes: Schema.optional(Schema.Number).pipe(T.JsonName("max_bytes")),
      maxDurationS: Schema.optional(Schema.Number).pipe(T.JsonName("max_duration_s")),
      maxRows: Schema.optional(Schema.Number).pipe(T.JsonName("max_rows")),
    }),
    compression: Schema.Struct({
      type: Schema.optional(Schema.Literal("none", "gzip", "deflate")),
    }),
    credentials: Schema.Struct({
      accessKeyId: Schema.String.pipe(T.JsonName("access_key_id")),
      endpoint: Schema.String,
      secretAccessKey: Schema.String.pipe(T.JsonName("secret_access_key")),
    }),
    format: Schema.Literal("json"),
    path: Schema.Struct({
      bucket: Schema.String,
      filename: Schema.optional(Schema.String),
      filepath: Schema.optional(Schema.String),
      prefix: Schema.optional(Schema.String),
    }),
    type: Schema.Literal("r2"),
  }),
  name: Schema.String,
  source: Schema.Array(
    Schema.Union(
      Schema.Struct({
        format: Schema.Literal("json"),
        type: Schema.String,
        authentication: Schema.optional(Schema.Boolean),
        cors: Schema.optional(
          Schema.Struct({
            origins: Schema.optional(Schema.Array(Schema.String)),
          }),
        ),
      }),
      Schema.Struct({
        format: Schema.Literal("json"),
        type: Schema.String,
      }),
    ),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/pipelines" }),
) as unknown as Schema.Schema<CreatePipelineRequest>;

export interface CreatePipelineResponse {
  /** Specifies the pipeline identifier. */
  id: string;
  destination: {
    batch: { maxBytes?: number; maxDurationS?: number; maxRows?: number };
    compression: { type?: "none" | "gzip" | "deflate" };
    format: "json";
    path: { bucket: string; filename?: string; filepath?: string; prefix?: string };
    type: "r2";
  };
  /** Indicates the endpoint URL to send traffic. */
  endpoint: string;
  /** Defines the name of the pipeline. */
  name: string;
  source: (
    | { format: "json"; type: string; authentication?: boolean; cors?: { origins?: string[] } }
    | { format: "json"; type: string }
  )[];
  /** Indicates the version number of last saved configuration. */
  version: number;
}

export const CreatePipelineResponse = Schema.Struct({
  id: Schema.String,
  destination: Schema.Struct({
    batch: Schema.Struct({
      maxBytes: Schema.optional(Schema.Number).pipe(T.JsonName("max_bytes")),
      maxDurationS: Schema.optional(Schema.Number).pipe(T.JsonName("max_duration_s")),
      maxRows: Schema.optional(Schema.Number).pipe(T.JsonName("max_rows")),
    }),
    compression: Schema.Struct({
      type: Schema.optional(Schema.Literal("none", "gzip", "deflate")),
    }),
    format: Schema.Literal("json"),
    path: Schema.Struct({
      bucket: Schema.String,
      filename: Schema.optional(Schema.String),
      filepath: Schema.optional(Schema.String),
      prefix: Schema.optional(Schema.String),
    }),
    type: Schema.Literal("r2"),
  }),
  endpoint: Schema.String,
  name: Schema.String,
  source: Schema.Array(
    Schema.Union(
      Schema.Struct({
        format: Schema.Literal("json"),
        type: Schema.String,
        authentication: Schema.optional(Schema.Boolean),
        cors: Schema.optional(
          Schema.Struct({
            origins: Schema.optional(Schema.Array(Schema.String)),
          }),
        ),
      }),
      Schema.Struct({
        format: Schema.Literal("json"),
        type: Schema.String,
      }),
    ),
  ),
  version: Schema.Number,
}) as unknown as Schema.Schema<CreatePipelineResponse>;

export const createPipeline = API.make(() => ({
  input: CreatePipelineRequest,
  output: CreatePipelineResponse,
  errors: [],
}));

export interface UpdatePipelineRequest {
  pipelineName: string;
  /** Path param: Specifies the public ID of the account. */
  accountId: string;
  /** Body param: */
  destination: {
    batch: { maxBytes?: number; maxDurationS?: number; maxRows?: number };
    compression: { type?: "none" | "gzip" | "deflate" };
    format: "json";
    path: { bucket: string; filename?: string; filepath?: string; prefix?: string };
    type: "r2";
    credentials?: { accessKeyId: string; endpoint: string; secretAccessKey: string };
  };
  /** Body param: Defines the name of the pipeline. */
  name: string;
  /** Body param: */
  source: (
    | { format: "json"; type: string; authentication?: boolean; cors?: { origins?: string[] } }
    | { format: "json"; type: string }
  )[];
}

export const UpdatePipelineRequest = Schema.Struct({
  pipelineName: Schema.String.pipe(T.HttpPath("pipelineName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  destination: Schema.Struct({
    batch: Schema.Struct({
      maxBytes: Schema.optional(Schema.Number).pipe(T.JsonName("max_bytes")),
      maxDurationS: Schema.optional(Schema.Number).pipe(T.JsonName("max_duration_s")),
      maxRows: Schema.optional(Schema.Number).pipe(T.JsonName("max_rows")),
    }),
    compression: Schema.Struct({
      type: Schema.optional(Schema.Literal("none", "gzip", "deflate")),
    }),
    format: Schema.Literal("json"),
    path: Schema.Struct({
      bucket: Schema.String,
      filename: Schema.optional(Schema.String),
      filepath: Schema.optional(Schema.String),
      prefix: Schema.optional(Schema.String),
    }),
    type: Schema.Literal("r2"),
    credentials: Schema.optional(
      Schema.Struct({
        accessKeyId: Schema.String.pipe(T.JsonName("access_key_id")),
        endpoint: Schema.String,
        secretAccessKey: Schema.String.pipe(T.JsonName("secret_access_key")),
      }),
    ),
  }),
  name: Schema.String,
  source: Schema.Array(
    Schema.Union(
      Schema.Struct({
        format: Schema.Literal("json"),
        type: Schema.String,
        authentication: Schema.optional(Schema.Boolean),
        cors: Schema.optional(
          Schema.Struct({
            origins: Schema.optional(Schema.Array(Schema.String)),
          }),
        ),
      }),
      Schema.Struct({
        format: Schema.Literal("json"),
        type: Schema.String,
      }),
    ),
  ),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/pipelines/{pipelineName}" }),
) as unknown as Schema.Schema<UpdatePipelineRequest>;

export interface UpdatePipelineResponse {
  /** Specifies the pipeline identifier. */
  id: string;
  destination: {
    batch: { maxBytes?: number; maxDurationS?: number; maxRows?: number };
    compression: { type?: "none" | "gzip" | "deflate" };
    format: "json";
    path: { bucket: string; filename?: string; filepath?: string; prefix?: string };
    type: "r2";
  };
  /** Indicates the endpoint URL to send traffic. */
  endpoint: string;
  /** Defines the name of the pipeline. */
  name: string;
  source: (
    | { format: "json"; type: string; authentication?: boolean; cors?: { origins?: string[] } }
    | { format: "json"; type: string }
  )[];
  /** Indicates the version number of last saved configuration. */
  version: number;
}

export const UpdatePipelineResponse = Schema.Struct({
  id: Schema.String,
  destination: Schema.Struct({
    batch: Schema.Struct({
      maxBytes: Schema.optional(Schema.Number).pipe(T.JsonName("max_bytes")),
      maxDurationS: Schema.optional(Schema.Number).pipe(T.JsonName("max_duration_s")),
      maxRows: Schema.optional(Schema.Number).pipe(T.JsonName("max_rows")),
    }),
    compression: Schema.Struct({
      type: Schema.optional(Schema.Literal("none", "gzip", "deflate")),
    }),
    format: Schema.Literal("json"),
    path: Schema.Struct({
      bucket: Schema.String,
      filename: Schema.optional(Schema.String),
      filepath: Schema.optional(Schema.String),
      prefix: Schema.optional(Schema.String),
    }),
    type: Schema.Literal("r2"),
  }),
  endpoint: Schema.String,
  name: Schema.String,
  source: Schema.Array(
    Schema.Union(
      Schema.Struct({
        format: Schema.Literal("json"),
        type: Schema.String,
        authentication: Schema.optional(Schema.Boolean),
        cors: Schema.optional(
          Schema.Struct({
            origins: Schema.optional(Schema.Array(Schema.String)),
          }),
        ),
      }),
      Schema.Struct({
        format: Schema.Literal("json"),
        type: Schema.String,
      }),
    ),
  ),
  version: Schema.Number,
}) as unknown as Schema.Schema<UpdatePipelineResponse>;

export const updatePipeline = API.make(() => ({
  input: UpdatePipelineRequest,
  output: UpdatePipelineResponse,
  errors: [],
}));

export interface DeletePipelineRequest {
  pipelineName: string;
  /** Specifies the public ID of the account. */
  accountId: string;
}

export const DeletePipelineRequest = Schema.Struct({
  pipelineName: Schema.String.pipe(T.HttpPath("pipelineName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/pipelines/{pipelineName}" }),
) as unknown as Schema.Schema<DeletePipelineRequest>;

export type DeletePipelineResponse = unknown;

export const DeletePipelineResponse =
  Schema.Unknown as unknown as Schema.Schema<DeletePipelineResponse>;

export const deletePipeline = API.make(() => ({
  input: DeletePipelineRequest,
  output: DeletePipelineResponse,
  errors: [],
}));
