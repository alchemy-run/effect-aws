/**
 * Cloudflare WORKERS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service workers
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
// AccountSetting
// =============================================================================

export interface GetAccountSettingRequest {
  /** Identifier. */
  accountId: string;
}

export const GetAccountSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/account-settings",
  }),
) as unknown as Schema.Schema<GetAccountSettingRequest>;

export interface GetAccountSettingResponse {
  defaultUsageModel?: string;
  greenCompute?: boolean;
}

export const GetAccountSettingResponse = Schema.Struct({
  defaultUsageModel: Schema.optional(Schema.String).pipe(
    T.JsonName("default_usage_model"),
  ),
  greenCompute: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("green_compute"),
  ),
}) as unknown as Schema.Schema<GetAccountSettingResponse>;

export const getAccountSetting: (
  input: GetAccountSettingRequest,
) => Effect.Effect<
  GetAccountSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccountSettingRequest,
  output: GetAccountSettingResponse,
  errors: [],
}));

export interface PutAccountSettingRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  defaultUsageModel?: string;
  /** Body param: */
  greenCompute?: boolean;
}

export const PutAccountSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  defaultUsageModel: Schema.optional(Schema.String).pipe(
    T.JsonName("default_usage_model"),
  ),
  greenCompute: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("green_compute"),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/workers/account-settings",
  }),
) as unknown as Schema.Schema<PutAccountSettingRequest>;

export interface PutAccountSettingResponse {
  defaultUsageModel?: string;
  greenCompute?: boolean;
}

export const PutAccountSettingResponse = Schema.Struct({
  defaultUsageModel: Schema.optional(Schema.String).pipe(
    T.JsonName("default_usage_model"),
  ),
  greenCompute: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("green_compute"),
  ),
}) as unknown as Schema.Schema<PutAccountSettingResponse>;

export const putAccountSetting: (
  input: PutAccountSettingRequest,
) => Effect.Effect<
  PutAccountSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutAccountSettingRequest,
  output: PutAccountSettingResponse,
  errors: [],
}));

// =============================================================================
// AssetUpload
// =============================================================================

export interface CreateAssetUploadRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: Whether the file contents are base64-encoded. Must be `true`. */
  base64: true;
  /** Body param: */
  body: Record<string, unknown>;
}

export const CreateAssetUploadRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  base64: Schema.Literal(true).pipe(T.HttpQuery("base64")),
  body: Schema.Struct({}),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/workers/assets/upload",
  }),
) as unknown as Schema.Schema<CreateAssetUploadRequest>;

export interface CreateAssetUploadResponse {
  /** A "completion" JWT which can be redeemed when creating a Worker version. */
  jwt?: string;
}

export const CreateAssetUploadResponse = Schema.Struct({
  jwt: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateAssetUploadResponse>;

export const createAssetUpload: (
  input: CreateAssetUploadRequest,
) => Effect.Effect<
  CreateAssetUploadResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAssetUploadRequest,
  output: CreateAssetUploadResponse,
  errors: [],
}));

// =============================================================================
// BetaWorker
// =============================================================================

export interface GetBetaWorkerRequest {
  workerId: string;
  /** Identifier. */
  accountId: string;
}

export const GetBetaWorkerRequest = Schema.Struct({
  workerId: Schema.String.pipe(T.HttpPath("workerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/workers/{workerId}",
  }),
) as unknown as Schema.Schema<GetBetaWorkerRequest>;

export interface GetBetaWorkerResponse {
  /** Immutable ID of the Worker. */
  id: string;
  /** When the Worker was created. */
  createdOn: string;
  /** Whether logpush is enabled for the Worker. */
  logpush: boolean;
  /** Name of the Worker. */
  name: string;
  /** Observability settings for the Worker. */
  observability: {
    enabled?: boolean;
    headSamplingRate?: number;
    logs?: {
      enabled?: boolean;
      headSamplingRate?: number;
      invocationLogs?: boolean;
    };
  };
  /** Subdomain settings for the Worker. */
  subdomain: { enabled?: boolean; previewsEnabled?: boolean };
  /** Tags associated with the Worker. */
  tags: string[];
  /** Other Workers that should consume logs from the Worker. */
  tailConsumers: { name: string }[];
  /** When the Worker was most recently updated. */
  updatedOn: string;
}

export const GetBetaWorkerResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  logpush: Schema.Boolean,
  name: Schema.String,
  observability: Schema.Struct({
    enabled: Schema.optional(Schema.Boolean),
    headSamplingRate: Schema.optional(Schema.Number).pipe(
      T.JsonName("head_sampling_rate"),
    ),
    logs: Schema.optional(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        headSamplingRate: Schema.optional(Schema.Number).pipe(
          T.JsonName("head_sampling_rate"),
        ),
        invocationLogs: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("invocation_logs"),
        ),
      }),
    ),
  }),
  subdomain: Schema.Struct({
    enabled: Schema.optional(Schema.Boolean),
    previewsEnabled: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("previews_enabled"),
    ),
  }),
  tags: Schema.Array(Schema.String),
  tailConsumers: Schema.Array(
    Schema.Struct({
      name: Schema.String,
    }),
  ).pipe(T.JsonName("tail_consumers")),
  updatedOn: Schema.String.pipe(T.JsonName("updated_on")),
}) as unknown as Schema.Schema<GetBetaWorkerResponse>;

export const getBetaWorker: (
  input: GetBetaWorkerRequest,
) => Effect.Effect<
  GetBetaWorkerResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBetaWorkerRequest,
  output: GetBetaWorkerResponse,
  errors: [],
}));

export interface CreateBetaWorkerRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Name of the Worker. */
  name: string;
  /** Body param: Whether logpush is enabled for the Worker. */
  logpush?: boolean;
  /** Body param: Observability settings for the Worker. */
  observability?: {
    enabled?: boolean;
    headSamplingRate?: number;
    logs?: {
      enabled?: boolean;
      headSamplingRate?: number;
      invocationLogs?: boolean;
    };
  };
  /** Body param: Subdomain settings for the Worker. */
  subdomain?: { enabled?: boolean; previewsEnabled?: boolean };
  /** Body param: Tags associated with the Worker. */
  tags?: string[];
  /** Body param: Other Workers that should consume logs from the Worker. */
  tailConsumers?: { name: string }[];
}

export const CreateBetaWorkerRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  logpush: Schema.optional(Schema.Boolean),
  observability: Schema.optional(
    Schema.Struct({
      enabled: Schema.optional(Schema.Boolean),
      headSamplingRate: Schema.optional(Schema.Number).pipe(
        T.JsonName("head_sampling_rate"),
      ),
      logs: Schema.optional(
        Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          headSamplingRate: Schema.optional(Schema.Number).pipe(
            T.JsonName("head_sampling_rate"),
          ),
          invocationLogs: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("invocation_logs"),
          ),
        }),
      ),
    }),
  ),
  subdomain: Schema.optional(
    Schema.Struct({
      enabled: Schema.optional(Schema.Boolean),
      previewsEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("previews_enabled"),
      ),
    }),
  ),
  tags: Schema.optional(Schema.Array(Schema.String)),
  tailConsumers: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
      }),
    ),
  ).pipe(T.JsonName("tail_consumers")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/workers/workers" }),
) as unknown as Schema.Schema<CreateBetaWorkerRequest>;

export interface CreateBetaWorkerResponse {
  /** Immutable ID of the Worker. */
  id: string;
  /** When the Worker was created. */
  createdOn: string;
  /** Whether logpush is enabled for the Worker. */
  logpush: boolean;
  /** Name of the Worker. */
  name: string;
  /** Observability settings for the Worker. */
  observability: {
    enabled?: boolean;
    headSamplingRate?: number;
    logs?: {
      enabled?: boolean;
      headSamplingRate?: number;
      invocationLogs?: boolean;
    };
  };
  /** Subdomain settings for the Worker. */
  subdomain: { enabled?: boolean; previewsEnabled?: boolean };
  /** Tags associated with the Worker. */
  tags: string[];
  /** Other Workers that should consume logs from the Worker. */
  tailConsumers: { name: string }[];
  /** When the Worker was most recently updated. */
  updatedOn: string;
}

export const CreateBetaWorkerResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  logpush: Schema.Boolean,
  name: Schema.String,
  observability: Schema.Struct({
    enabled: Schema.optional(Schema.Boolean),
    headSamplingRate: Schema.optional(Schema.Number).pipe(
      T.JsonName("head_sampling_rate"),
    ),
    logs: Schema.optional(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        headSamplingRate: Schema.optional(Schema.Number).pipe(
          T.JsonName("head_sampling_rate"),
        ),
        invocationLogs: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("invocation_logs"),
        ),
      }),
    ),
  }),
  subdomain: Schema.Struct({
    enabled: Schema.optional(Schema.Boolean),
    previewsEnabled: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("previews_enabled"),
    ),
  }),
  tags: Schema.Array(Schema.String),
  tailConsumers: Schema.Array(
    Schema.Struct({
      name: Schema.String,
    }),
  ).pipe(T.JsonName("tail_consumers")),
  updatedOn: Schema.String.pipe(T.JsonName("updated_on")),
}) as unknown as Schema.Schema<CreateBetaWorkerResponse>;

export const createBetaWorker: (
  input: CreateBetaWorkerRequest,
) => Effect.Effect<
  CreateBetaWorkerResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateBetaWorkerRequest,
  output: CreateBetaWorkerResponse,
  errors: [],
}));

export interface UpdateBetaWorkerRequest {
  workerId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Name of the Worker. */
  name: string;
  /** Body param: Whether logpush is enabled for the Worker. */
  logpush?: boolean;
  /** Body param: Observability settings for the Worker. */
  observability?: {
    enabled?: boolean;
    headSamplingRate?: number;
    logs?: {
      enabled?: boolean;
      headSamplingRate?: number;
      invocationLogs?: boolean;
    };
  };
  /** Body param: Subdomain settings for the Worker. */
  subdomain?: { enabled?: boolean; previewsEnabled?: boolean };
  /** Body param: Tags associated with the Worker. */
  tags?: string[];
  /** Body param: Other Workers that should consume logs from the Worker. */
  tailConsumers?: { name: string }[];
}

export const UpdateBetaWorkerRequest = Schema.Struct({
  workerId: Schema.String.pipe(T.HttpPath("workerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  logpush: Schema.optional(Schema.Boolean),
  observability: Schema.optional(
    Schema.Struct({
      enabled: Schema.optional(Schema.Boolean),
      headSamplingRate: Schema.optional(Schema.Number).pipe(
        T.JsonName("head_sampling_rate"),
      ),
      logs: Schema.optional(
        Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          headSamplingRate: Schema.optional(Schema.Number).pipe(
            T.JsonName("head_sampling_rate"),
          ),
          invocationLogs: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("invocation_logs"),
          ),
        }),
      ),
    }),
  ),
  subdomain: Schema.optional(
    Schema.Struct({
      enabled: Schema.optional(Schema.Boolean),
      previewsEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("previews_enabled"),
      ),
    }),
  ),
  tags: Schema.optional(Schema.Array(Schema.String)),
  tailConsumers: Schema.optional(
    Schema.Array(
      Schema.Struct({
        name: Schema.String,
      }),
    ),
  ).pipe(T.JsonName("tail_consumers")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/workers/workers/{workerId}",
  }),
) as unknown as Schema.Schema<UpdateBetaWorkerRequest>;

export interface UpdateBetaWorkerResponse {
  /** Immutable ID of the Worker. */
  id: string;
  /** When the Worker was created. */
  createdOn: string;
  /** Whether logpush is enabled for the Worker. */
  logpush: boolean;
  /** Name of the Worker. */
  name: string;
  /** Observability settings for the Worker. */
  observability: {
    enabled?: boolean;
    headSamplingRate?: number;
    logs?: {
      enabled?: boolean;
      headSamplingRate?: number;
      invocationLogs?: boolean;
    };
  };
  /** Subdomain settings for the Worker. */
  subdomain: { enabled?: boolean; previewsEnabled?: boolean };
  /** Tags associated with the Worker. */
  tags: string[];
  /** Other Workers that should consume logs from the Worker. */
  tailConsumers: { name: string }[];
  /** When the Worker was most recently updated. */
  updatedOn: string;
}

export const UpdateBetaWorkerResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  logpush: Schema.Boolean,
  name: Schema.String,
  observability: Schema.Struct({
    enabled: Schema.optional(Schema.Boolean),
    headSamplingRate: Schema.optional(Schema.Number).pipe(
      T.JsonName("head_sampling_rate"),
    ),
    logs: Schema.optional(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        headSamplingRate: Schema.optional(Schema.Number).pipe(
          T.JsonName("head_sampling_rate"),
        ),
        invocationLogs: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("invocation_logs"),
        ),
      }),
    ),
  }),
  subdomain: Schema.Struct({
    enabled: Schema.optional(Schema.Boolean),
    previewsEnabled: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("previews_enabled"),
    ),
  }),
  tags: Schema.Array(Schema.String),
  tailConsumers: Schema.Array(
    Schema.Struct({
      name: Schema.String,
    }),
  ).pipe(T.JsonName("tail_consumers")),
  updatedOn: Schema.String.pipe(T.JsonName("updated_on")),
}) as unknown as Schema.Schema<UpdateBetaWorkerResponse>;

export const updateBetaWorker: (
  input: UpdateBetaWorkerRequest,
) => Effect.Effect<
  UpdateBetaWorkerResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateBetaWorkerRequest,
  output: UpdateBetaWorkerResponse,
  errors: [],
}));

export interface PatchBetaWorkerRequest {
  workerId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Whether logpush is enabled for the Worker. */
  logpush: boolean;
  /** Body param: Name of the Worker. */
  name: string;
  /** Body param: Observability settings for the Worker. */
  observability: {
    enabled?: boolean;
    headSamplingRate?: number;
    logs?: {
      enabled?: boolean;
      headSamplingRate?: number;
      invocationLogs?: boolean;
    };
  };
  /** Body param: Subdomain settings for the Worker. */
  subdomain: { enabled?: boolean; previewsEnabled?: boolean };
  /** Body param: Tags associated with the Worker. */
  tags: string[];
  /** Body param: Other Workers that should consume logs from the Worker. */
  tailConsumers: { name: string }[];
}

export const PatchBetaWorkerRequest = Schema.Struct({
  workerId: Schema.String.pipe(T.HttpPath("workerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  logpush: Schema.Boolean,
  name: Schema.String,
  observability: Schema.Struct({
    enabled: Schema.optional(Schema.Boolean),
    headSamplingRate: Schema.optional(Schema.Number).pipe(
      T.JsonName("head_sampling_rate"),
    ),
    logs: Schema.optional(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        headSamplingRate: Schema.optional(Schema.Number).pipe(
          T.JsonName("head_sampling_rate"),
        ),
        invocationLogs: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("invocation_logs"),
        ),
      }),
    ),
  }),
  subdomain: Schema.Struct({
    enabled: Schema.optional(Schema.Boolean),
    previewsEnabled: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("previews_enabled"),
    ),
  }),
  tags: Schema.Array(Schema.String),
  tailConsumers: Schema.Array(
    Schema.Struct({
      name: Schema.String,
    }),
  ).pipe(T.JsonName("tail_consumers")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/workers/workers/{workerId}",
  }),
) as unknown as Schema.Schema<PatchBetaWorkerRequest>;

export interface PatchBetaWorkerResponse {
  /** Immutable ID of the Worker. */
  id: string;
  /** When the Worker was created. */
  createdOn: string;
  /** Whether logpush is enabled for the Worker. */
  logpush: boolean;
  /** Name of the Worker. */
  name: string;
  /** Observability settings for the Worker. */
  observability: {
    enabled?: boolean;
    headSamplingRate?: number;
    logs?: {
      enabled?: boolean;
      headSamplingRate?: number;
      invocationLogs?: boolean;
    };
  };
  /** Subdomain settings for the Worker. */
  subdomain: { enabled?: boolean; previewsEnabled?: boolean };
  /** Tags associated with the Worker. */
  tags: string[];
  /** Other Workers that should consume logs from the Worker. */
  tailConsumers: { name: string }[];
  /** When the Worker was most recently updated. */
  updatedOn: string;
}

export const PatchBetaWorkerResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  logpush: Schema.Boolean,
  name: Schema.String,
  observability: Schema.Struct({
    enabled: Schema.optional(Schema.Boolean),
    headSamplingRate: Schema.optional(Schema.Number).pipe(
      T.JsonName("head_sampling_rate"),
    ),
    logs: Schema.optional(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        headSamplingRate: Schema.optional(Schema.Number).pipe(
          T.JsonName("head_sampling_rate"),
        ),
        invocationLogs: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("invocation_logs"),
        ),
      }),
    ),
  }),
  subdomain: Schema.Struct({
    enabled: Schema.optional(Schema.Boolean),
    previewsEnabled: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("previews_enabled"),
    ),
  }),
  tags: Schema.Array(Schema.String),
  tailConsumers: Schema.Array(
    Schema.Struct({
      name: Schema.String,
    }),
  ).pipe(T.JsonName("tail_consumers")),
  updatedOn: Schema.String.pipe(T.JsonName("updated_on")),
}) as unknown as Schema.Schema<PatchBetaWorkerResponse>;

export const patchBetaWorker: (
  input: PatchBetaWorkerRequest,
) => Effect.Effect<
  PatchBetaWorkerResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchBetaWorkerRequest,
  output: PatchBetaWorkerResponse,
  errors: [],
}));

export interface DeleteBetaWorkerRequest {
  workerId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteBetaWorkerRequest = Schema.Struct({
  workerId: Schema.String.pipe(T.HttpPath("workerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/workers/{workerId}",
  }),
) as unknown as Schema.Schema<DeleteBetaWorkerRequest>;

export interface DeleteBetaWorkerResponse {
  errors: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  messages: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  /** Whether the API call was successful. */
  success: true;
}

export const DeleteBetaWorkerResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<DeleteBetaWorkerResponse>;

export const deleteBetaWorker: (
  input: DeleteBetaWorkerRequest,
) => Effect.Effect<
  DeleteBetaWorkerResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteBetaWorkerRequest,
  output: DeleteBetaWorkerResponse,
  errors: [],
}));

// =============================================================================
// BetaWorkerVersion
// =============================================================================

export interface GetBetaWorkerVersionRequest {
  workerId: string;
  versionId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: Whether to include the `modules` property of the version in the response, which contains code and sourcemap content and may add several megabytes to the response size. */
  include?: "modules";
}

export const GetBetaWorkerVersionRequest = Schema.Struct({
  workerId: Schema.String.pipe(T.HttpPath("workerId")),
  versionId: Schema.String.pipe(T.HttpPath("versionId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  include: Schema.optional(Schema.Literal("modules")).pipe(
    T.HttpQuery("include"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/workers/{workerId}/versions/{versionId}",
  }),
) as unknown as Schema.Schema<GetBetaWorkerVersionRequest>;

export interface GetBetaWorkerVersionResponse {
  /** Version identifier. */
  id: string;
  /** When the version was created. */
  createdOn: string;
  /** The integer version number, starting from one. */
  number: number;
  /** Metadata about the version. */
  annotations?: {
    "workers/message"?: string;
    "workers/tag"?: string;
    "workers/triggeredBy"?: string;
  };
  /** Configuration for assets within a Worker.  [`_headers`](https://developers.cloudflare.com/workers/static-assets/headers/#custom-headers) and [`_redirects`](https://developers.cloudflare.com/workers/st */
  assets?: {
    config?: {
      htmlHandling?:
        | "auto-trailing-slash"
        | "force-trailing-slash"
        | "drop-trailing-slash"
        | "none";
      notFoundHandling?: "none" | "404-page" | "single-page-application";
      runWorkerFirst?: string[] | boolean;
    };
    jwt?: string;
  };
  /** List of bindings attached to a Worker. You can find more about bindings on our docs: https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/#bindings. */
  bindings?: (
    | { name: string; type: "ai" }
    | { dataset: string; name: string; type: "analytics_engine" }
    | { name: string; type: "assets" }
    | { name: string; type: "browser" }
    | { id: string; name: string; type: "d1" }
    | { name: string; part: string; type: "data_blob" }
    | {
        name: string;
        namespace: string;
        type: "dispatch_namespace";
        outbound?: {
          params?: string[];
          worker?: { environment?: string; service?: string };
        };
      }
    | {
        name: string;
        type: "durable_object_namespace";
        className?: string;
        environment?: string;
        namespaceId?: string;
        scriptName?: string;
      }
    | { id: string; name: string; type: "hyperdrive" }
    | { name: string; type: "inherit"; oldName?: string; versionId?: string }
    | { name: string; type: "images" }
    | { json: string; name: string; type: "json" }
    | { name: string; namespaceId: string; type: "kv_namespace" }
    | { certificateId: string; name: string; type: "mtls_certificate" }
    | { name: string; text: string; type: "plain_text" }
    | { name: string; pipeline: string; type: "pipelines" }
    | { name: string; queueName: string; type: "queue" }
    | {
        bucketName: string;
        name: string;
        type: "r2_bucket";
        jurisdiction?: "eu" | "fedramp";
      }
    | { name: string; type: "secret_text" }
    | {
        name: string;
        type: "send_email";
        allowedDestinationAddresses?: string[];
        allowedSenderAddresses?: string[];
        destinationAddress?: string;
      }
    | { name: string; service: string; type: "service"; environment?: string }
    | { name: string; service: string; type: "tail_consumer" }
    | { name: string; part: string; type: "text_blob" }
    | { indexName: string; name: string; type: "vectorize" }
    | { name: string; type: "version_metadata" }
    | {
        name: string;
        secretName: string;
        storeId: string;
        type: "secrets_store_secret";
      }
    | {
        algorithm: unknown;
        format: "raw" | "pkcs8" | "spki" | "jwk";
        name: string;
        type: "secret_key";
        usages: (
          | "encrypt"
          | "decrypt"
          | "sign"
          | "verify"
          | "deriveKey"
          | "deriveBits"
          | "wrapKey"
          | "unwrapKey"
        )[];
      }
    | {
        name: string;
        type: "workflow";
        workflowName: string;
        className?: string;
        scriptName?: string;
      }
    | { name: string; part: string; type: "wasm_module" }
  )[];
  /** Date indicating targeted support in the Workers runtime. Backwards incompatible fixes to the runtime following this date will not affect this Worker. */
  compatibilityDate?: string;
  /** Flags that enable or disable certain features in the Workers runtime. Used to enable upcoming features or opt in or out of specific changes not included in a `compatibility_date`. */
  compatibilityFlags?: string[];
  /** Resource limits enforced at runtime. */
  limits?: { cpuMs: number };
  /** The name of the main module in the `modules` array (e.g. the name of the module that exports a `fetch` handler). */
  mainModule?: string;
  /** Migrations for Durable Objects associated with the version. Migrations are applied when the version is deployed. */
  migrations?: unknown;
  /** Code, sourcemaps, and other content used at runtime.  This includes [`_headers`](https://developers.cloudflare.com/workers/static-assets/headers/#custom-headers) and [`_redirects`](https://developers. */
  modules?: { contentBase64: string; contentType: string; name: string }[];
  /** Placement settings for the version. */
  placement?: { mode?: "smart" };
  /** The client used to create the version. */
  source?: string;
  /** @deprecated Usage model for the version. */
  usageModel?: "standard" | "bundled" | "unbound";
}

export const GetBetaWorkerVersionResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  number: Schema.Number,
  annotations: Schema.optional(
    Schema.Struct({
      "workers/message": Schema.optional(Schema.String),
      "workers/tag": Schema.optional(Schema.String),
      "workers/triggeredBy": Schema.optional(Schema.String).pipe(
        T.JsonName("'workers/triggered_by'"),
      ),
    }),
  ),
  assets: Schema.optional(
    Schema.Struct({
      config: Schema.optional(
        Schema.Struct({
          htmlHandling: Schema.optional(
            Schema.Literal(
              "auto-trailing-slash",
              "force-trailing-slash",
              "drop-trailing-slash",
              "none",
            ),
          ).pipe(T.JsonName("html_handling")),
          notFoundHandling: Schema.optional(
            Schema.Literal("none", "404-page", "single-page-application"),
          ).pipe(T.JsonName("not_found_handling")),
          runWorkerFirst: Schema.optional(
            Schema.Union(Schema.Array(Schema.String), Schema.Boolean),
          ).pipe(T.JsonName("run_worker_first")),
        }),
      ),
      jwt: Schema.optional(Schema.String),
    }),
  ),
  bindings: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("ai"),
        }),
        Schema.Struct({
          dataset: Schema.String,
          name: Schema.String,
          type: Schema.Literal("analytics_engine"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("assets"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("browser"),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("d1"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("data_blob"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespace: Schema.String,
          type: Schema.Literal("dispatch_namespace"),
          outbound: Schema.optional(
            Schema.Struct({
              params: Schema.optional(Schema.Array(Schema.String)),
              worker: Schema.optional(
                Schema.Struct({
                  environment: Schema.optional(Schema.String),
                  service: Schema.optional(Schema.String),
                }),
              ),
            }),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("durable_object_namespace"),
          className: Schema.optional(Schema.String).pipe(
            T.JsonName("class_name"),
          ),
          environment: Schema.optional(Schema.String),
          namespaceId: Schema.optional(Schema.String).pipe(
            T.JsonName("namespace_id"),
          ),
          scriptName: Schema.optional(Schema.String).pipe(
            T.JsonName("script_name"),
          ),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("hyperdrive"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("inherit"),
          oldName: Schema.optional(Schema.String).pipe(T.JsonName("old_name")),
          versionId: Schema.optional(Schema.String).pipe(
            T.JsonName("version_id"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("images"),
        }),
        Schema.Struct({
          json: Schema.String,
          name: Schema.String,
          type: Schema.Literal("json"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
          type: Schema.Literal("kv_namespace"),
        }),
        Schema.Struct({
          certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
          name: Schema.String,
          type: Schema.Literal("mtls_certificate"),
        }),
        Schema.Struct({
          name: Schema.String,
          text: Schema.String,
          type: Schema.Literal("plain_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          pipeline: Schema.String,
          type: Schema.Literal("pipelines"),
        }),
        Schema.Struct({
          name: Schema.String,
          queueName: Schema.String.pipe(T.JsonName("queue_name")),
          type: Schema.Literal("queue"),
        }),
        Schema.Struct({
          bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
          name: Schema.String,
          type: Schema.Literal("r2_bucket"),
          jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("secret_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("send_email"),
          allowedDestinationAddresses: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("allowed_destination_addresses")),
          allowedSenderAddresses: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("allowed_sender_addresses")),
          destinationAddress: Schema.optional(Schema.String).pipe(
            T.JsonName("destination_address"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("service"),
          environment: Schema.optional(Schema.String),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("tail_consumer"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("text_blob"),
        }),
        Schema.Struct({
          indexName: Schema.String.pipe(T.JsonName("index_name")),
          name: Schema.String,
          type: Schema.Literal("vectorize"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("version_metadata"),
        }),
        Schema.Struct({
          name: Schema.String,
          secretName: Schema.String.pipe(T.JsonName("secret_name")),
          storeId: Schema.String.pipe(T.JsonName("store_id")),
          type: Schema.Literal("secrets_store_secret"),
        }),
        Schema.Struct({
          algorithm: Schema.Unknown,
          format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
          name: Schema.String,
          type: Schema.Literal("secret_key"),
          usages: Schema.Array(
            Schema.Literal(
              "encrypt",
              "decrypt",
              "sign",
              "verify",
              "deriveKey",
              "deriveBits",
              "wrapKey",
              "unwrapKey",
            ),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("workflow"),
          workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
          className: Schema.optional(Schema.String).pipe(
            T.JsonName("class_name"),
          ),
          scriptName: Schema.optional(Schema.String).pipe(
            T.JsonName("script_name"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("wasm_module"),
        }),
      ),
    ),
  ),
  compatibilityDate: Schema.optional(Schema.String).pipe(
    T.JsonName("compatibility_date"),
  ),
  compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("compatibility_flags"),
  ),
  limits: Schema.optional(
    Schema.Struct({
      cpuMs: Schema.Number.pipe(T.JsonName("cpu_ms")),
    }),
  ),
  mainModule: Schema.optional(Schema.String).pipe(T.JsonName("main_module")),
  migrations: Schema.optional(Schema.Unknown),
  modules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        contentBase64: Schema.String.pipe(T.JsonName("content_base64")),
        contentType: Schema.String.pipe(T.JsonName("content_type")),
        name: Schema.String,
      }),
    ),
  ),
  placement: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("smart")),
    }),
  ),
  source: Schema.optional(Schema.String),
  usageModel: Schema.optional(
    Schema.Literal("standard", "bundled", "unbound"),
  ).pipe(T.JsonName("usage_model")),
}) as unknown as Schema.Schema<GetBetaWorkerVersionResponse>;

export const getBetaWorkerVersion: (
  input: GetBetaWorkerVersionRequest,
) => Effect.Effect<
  GetBetaWorkerVersionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBetaWorkerVersionRequest,
  output: GetBetaWorkerVersionResponse,
  errors: [],
}));

export interface CreateBetaWorkerVersionRequest {
  workerId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: If true, a deployment will be created that sends 100% of traffic to the new version. */
  deploy?: boolean;
  /** Body param: Metadata about the version. */
  annotations?: { "workers/message"?: string; "workers/tag"?: string };
  /** Body param: Configuration for assets within a Worker.  [`_headers`](https://developers.cloudflare.com/workers/static-assets/headers/#custom-headers) and [`_redirects`](https://developers.cloudflare.co */
  assets?: {
    config?: {
      htmlHandling?:
        | "auto-trailing-slash"
        | "force-trailing-slash"
        | "drop-trailing-slash"
        | "none";
      notFoundHandling?: "none" | "404-page" | "single-page-application";
      runWorkerFirst?: string[] | boolean;
    };
    jwt?: string;
  };
  /** Body param: List of bindings attached to a Worker. You can find more about bindings on our docs: https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/#bindings. */
  bindings?: (
    | { name: string; type: "ai" }
    | { dataset: string; name: string; type: "analytics_engine" }
    | { name: string; type: "assets" }
    | { name: string; type: "browser" }
    | { id: string; name: string; type: "d1" }
    | { name: string; part: string; type: "data_blob" }
    | {
        name: string;
        namespace: string;
        type: "dispatch_namespace";
        outbound?: {
          params?: string[];
          worker?: { environment?: string; service?: string };
        };
      }
    | {
        name: string;
        type: "durable_object_namespace";
        className?: string;
        environment?: string;
        namespaceId?: string;
        scriptName?: string;
      }
    | { id: string; name: string; type: "hyperdrive" }
    | { name: string; type: "inherit"; oldName?: string; versionId?: string }
    | { name: string; type: "images" }
    | { json: string; name: string; type: "json" }
    | { name: string; namespaceId: string; type: "kv_namespace" }
    | { certificateId: string; name: string; type: "mtls_certificate" }
    | { name: string; text: string; type: "plain_text" }
    | { name: string; pipeline: string; type: "pipelines" }
    | { name: string; queueName: string; type: "queue" }
    | {
        bucketName: string;
        name: string;
        type: "r2_bucket";
        jurisdiction?: "eu" | "fedramp";
      }
    | { name: string; text: string; type: "secret_text" }
    | {
        name: string;
        type: "send_email";
        allowedDestinationAddresses?: string[];
        allowedSenderAddresses?: string[];
        destinationAddress?: string;
      }
    | { name: string; service: string; type: "service"; environment?: string }
    | { name: string; service: string; type: "tail_consumer" }
    | { name: string; part: string; type: "text_blob" }
    | { indexName: string; name: string; type: "vectorize" }
    | { name: string; type: "version_metadata" }
    | {
        name: string;
        secretName: string;
        storeId: string;
        type: "secrets_store_secret";
      }
    | {
        algorithm: unknown;
        format: "raw" | "pkcs8" | "spki" | "jwk";
        name: string;
        type: "secret_key";
        usages: (
          | "encrypt"
          | "decrypt"
          | "sign"
          | "verify"
          | "deriveKey"
          | "deriveBits"
          | "wrapKey"
          | "unwrapKey"
        )[];
        keyBase64?: string;
        keyJwk?: unknown;
      }
    | {
        name: string;
        type: "workflow";
        workflowName: string;
        className?: string;
        scriptName?: string;
      }
    | { name: string; part: string; type: "wasm_module" }
  )[];
  /** Body param: Date indicating targeted support in the Workers runtime. Backwards incompatible fixes to the runtime following this date will not affect this Worker. */
  compatibilityDate?: string;
  /** Body param: Flags that enable or disable certain features in the Workers runtime. Used to enable upcoming features or opt in or out of specific changes not included in a `compatibility_date`. */
  compatibilityFlags?: string[];
  /** Body param: Resource limits enforced at runtime. */
  limits?: { cpuMs: number };
  /** Body param: The name of the main module in the `modules` array (e.g. the name of the module that exports a `fetch` handler). */
  mainModule?: string;
  /** Body param: Migrations for Durable Objects associated with the version. Migrations are applied when the version is deployed. */
  migrations?:
    | unknown
    | { newTag?: string; oldTag?: string; steps?: unknown[] };
  /** Body param: Code, sourcemaps, and other content used at runtime.  This includes [`_headers`](https://developers.cloudflare.com/workers/static-assets/headers/#custom-headers) and [`_redirects`](https:/ */
  modules?: { contentBase64: string; contentType: string; name: string }[];
  /** Body param: Placement settings for the version. */
  placement?: { mode?: "smart" };
  /** @deprecated Body param: Usage model for the version. */
  usageModel?: "standard" | "bundled" | "unbound";
}

export const CreateBetaWorkerVersionRequest = Schema.Struct({
  workerId: Schema.String.pipe(T.HttpPath("workerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  deploy: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("deploy")),
  annotations: Schema.optional(
    Schema.Struct({
      "workers/message": Schema.optional(Schema.String),
      "workers/tag": Schema.optional(Schema.String),
    }),
  ),
  assets: Schema.optional(
    Schema.Struct({
      config: Schema.optional(
        Schema.Struct({
          htmlHandling: Schema.optional(
            Schema.Literal(
              "auto-trailing-slash",
              "force-trailing-slash",
              "drop-trailing-slash",
              "none",
            ),
          ).pipe(T.JsonName("html_handling")),
          notFoundHandling: Schema.optional(
            Schema.Literal("none", "404-page", "single-page-application"),
          ).pipe(T.JsonName("not_found_handling")),
          runWorkerFirst: Schema.optional(
            Schema.Union(Schema.Array(Schema.String), Schema.Boolean),
          ).pipe(T.JsonName("run_worker_first")),
        }),
      ),
      jwt: Schema.optional(Schema.String),
    }),
  ),
  bindings: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("ai"),
        }),
        Schema.Struct({
          dataset: Schema.String,
          name: Schema.String,
          type: Schema.Literal("analytics_engine"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("assets"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("browser"),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("d1"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("data_blob"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespace: Schema.String,
          type: Schema.Literal("dispatch_namespace"),
          outbound: Schema.optional(
            Schema.Struct({
              params: Schema.optional(Schema.Array(Schema.String)),
              worker: Schema.optional(
                Schema.Struct({
                  environment: Schema.optional(Schema.String),
                  service: Schema.optional(Schema.String),
                }),
              ),
            }),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("durable_object_namespace"),
          className: Schema.optional(Schema.String).pipe(
            T.JsonName("class_name"),
          ),
          environment: Schema.optional(Schema.String),
          namespaceId: Schema.optional(Schema.String).pipe(
            T.JsonName("namespace_id"),
          ),
          scriptName: Schema.optional(Schema.String).pipe(
            T.JsonName("script_name"),
          ),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("hyperdrive"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("inherit"),
          oldName: Schema.optional(Schema.String).pipe(T.JsonName("old_name")),
          versionId: Schema.optional(Schema.String).pipe(
            T.JsonName("version_id"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("images"),
        }),
        Schema.Struct({
          json: Schema.String,
          name: Schema.String,
          type: Schema.Literal("json"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
          type: Schema.Literal("kv_namespace"),
        }),
        Schema.Struct({
          certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
          name: Schema.String,
          type: Schema.Literal("mtls_certificate"),
        }),
        Schema.Struct({
          name: Schema.String,
          text: Schema.String,
          type: Schema.Literal("plain_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          pipeline: Schema.String,
          type: Schema.Literal("pipelines"),
        }),
        Schema.Struct({
          name: Schema.String,
          queueName: Schema.String.pipe(T.JsonName("queue_name")),
          type: Schema.Literal("queue"),
        }),
        Schema.Struct({
          bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
          name: Schema.String,
          type: Schema.Literal("r2_bucket"),
          jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
        }),
        Schema.Struct({
          name: Schema.String,
          text: Schema.String,
          type: Schema.Literal("secret_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("send_email"),
          allowedDestinationAddresses: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("allowed_destination_addresses")),
          allowedSenderAddresses: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("allowed_sender_addresses")),
          destinationAddress: Schema.optional(Schema.String).pipe(
            T.JsonName("destination_address"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("service"),
          environment: Schema.optional(Schema.String),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("tail_consumer"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("text_blob"),
        }),
        Schema.Struct({
          indexName: Schema.String.pipe(T.JsonName("index_name")),
          name: Schema.String,
          type: Schema.Literal("vectorize"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("version_metadata"),
        }),
        Schema.Struct({
          name: Schema.String,
          secretName: Schema.String.pipe(T.JsonName("secret_name")),
          storeId: Schema.String.pipe(T.JsonName("store_id")),
          type: Schema.Literal("secrets_store_secret"),
        }),
        Schema.Struct({
          algorithm: Schema.Unknown,
          format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
          name: Schema.String,
          type: Schema.Literal("secret_key"),
          usages: Schema.Array(
            Schema.Literal(
              "encrypt",
              "decrypt",
              "sign",
              "verify",
              "deriveKey",
              "deriveBits",
              "wrapKey",
              "unwrapKey",
            ),
          ),
          keyBase64: Schema.optional(Schema.String).pipe(
            T.JsonName("key_base64"),
          ),
          keyJwk: Schema.optional(Schema.Unknown).pipe(T.JsonName("key_jwk")),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("workflow"),
          workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
          className: Schema.optional(Schema.String).pipe(
            T.JsonName("class_name"),
          ),
          scriptName: Schema.optional(Schema.String).pipe(
            T.JsonName("script_name"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("wasm_module"),
        }),
      ),
    ),
  ),
  compatibilityDate: Schema.optional(Schema.String).pipe(
    T.JsonName("compatibility_date"),
  ),
  compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("compatibility_flags"),
  ),
  limits: Schema.optional(
    Schema.Struct({
      cpuMs: Schema.Number.pipe(T.JsonName("cpu_ms")),
    }),
  ),
  mainModule: Schema.optional(Schema.String).pipe(T.JsonName("main_module")),
  migrations: Schema.optional(
    Schema.Union(
      Schema.Unknown,
      Schema.Struct({
        newTag: Schema.optional(Schema.String).pipe(T.JsonName("new_tag")),
        oldTag: Schema.optional(Schema.String).pipe(T.JsonName("old_tag")),
        steps: Schema.optional(Schema.Array(Schema.Unknown)),
      }),
    ),
  ),
  modules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        contentBase64: Schema.String.pipe(T.JsonName("content_base64")),
        contentType: Schema.String.pipe(T.JsonName("content_type")),
        name: Schema.String,
      }),
    ),
  ),
  placement: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("smart")),
    }),
  ),
  usageModel: Schema.optional(
    Schema.Literal("standard", "bundled", "unbound"),
  ).pipe(T.JsonName("usage_model")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/workers/workers/{workerId}/versions",
  }),
) as unknown as Schema.Schema<CreateBetaWorkerVersionRequest>;

export interface CreateBetaWorkerVersionResponse {
  /** Version identifier. */
  id: string;
  /** When the version was created. */
  createdOn: string;
  /** The integer version number, starting from one. */
  number: number;
  /** Metadata about the version. */
  annotations?: {
    "workers/message"?: string;
    "workers/tag"?: string;
    "workers/triggeredBy"?: string;
  };
  /** Configuration for assets within a Worker.  [`_headers`](https://developers.cloudflare.com/workers/static-assets/headers/#custom-headers) and [`_redirects`](https://developers.cloudflare.com/workers/st */
  assets?: {
    config?: {
      htmlHandling?:
        | "auto-trailing-slash"
        | "force-trailing-slash"
        | "drop-trailing-slash"
        | "none";
      notFoundHandling?: "none" | "404-page" | "single-page-application";
      runWorkerFirst?: string[] | boolean;
    };
    jwt?: string;
  };
  /** List of bindings attached to a Worker. You can find more about bindings on our docs: https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/#bindings. */
  bindings?: (
    | { name: string; type: "ai" }
    | { dataset: string; name: string; type: "analytics_engine" }
    | { name: string; type: "assets" }
    | { name: string; type: "browser" }
    | { id: string; name: string; type: "d1" }
    | { name: string; part: string; type: "data_blob" }
    | {
        name: string;
        namespace: string;
        type: "dispatch_namespace";
        outbound?: {
          params?: string[];
          worker?: { environment?: string; service?: string };
        };
      }
    | {
        name: string;
        type: "durable_object_namespace";
        className?: string;
        environment?: string;
        namespaceId?: string;
        scriptName?: string;
      }
    | { id: string; name: string; type: "hyperdrive" }
    | { name: string; type: "inherit"; oldName?: string; versionId?: string }
    | { name: string; type: "images" }
    | { json: string; name: string; type: "json" }
    | { name: string; namespaceId: string; type: "kv_namespace" }
    | { certificateId: string; name: string; type: "mtls_certificate" }
    | { name: string; text: string; type: "plain_text" }
    | { name: string; pipeline: string; type: "pipelines" }
    | { name: string; queueName: string; type: "queue" }
    | {
        bucketName: string;
        name: string;
        type: "r2_bucket";
        jurisdiction?: "eu" | "fedramp";
      }
    | { name: string; type: "secret_text" }
    | {
        name: string;
        type: "send_email";
        allowedDestinationAddresses?: string[];
        allowedSenderAddresses?: string[];
        destinationAddress?: string;
      }
    | { name: string; service: string; type: "service"; environment?: string }
    | { name: string; service: string; type: "tail_consumer" }
    | { name: string; part: string; type: "text_blob" }
    | { indexName: string; name: string; type: "vectorize" }
    | { name: string; type: "version_metadata" }
    | {
        name: string;
        secretName: string;
        storeId: string;
        type: "secrets_store_secret";
      }
    | {
        algorithm: unknown;
        format: "raw" | "pkcs8" | "spki" | "jwk";
        name: string;
        type: "secret_key";
        usages: (
          | "encrypt"
          | "decrypt"
          | "sign"
          | "verify"
          | "deriveKey"
          | "deriveBits"
          | "wrapKey"
          | "unwrapKey"
        )[];
      }
    | {
        name: string;
        type: "workflow";
        workflowName: string;
        className?: string;
        scriptName?: string;
      }
    | { name: string; part: string; type: "wasm_module" }
  )[];
  /** Date indicating targeted support in the Workers runtime. Backwards incompatible fixes to the runtime following this date will not affect this Worker. */
  compatibilityDate?: string;
  /** Flags that enable or disable certain features in the Workers runtime. Used to enable upcoming features or opt in or out of specific changes not included in a `compatibility_date`. */
  compatibilityFlags?: string[];
  /** Resource limits enforced at runtime. */
  limits?: { cpuMs: number };
  /** The name of the main module in the `modules` array (e.g. the name of the module that exports a `fetch` handler). */
  mainModule?: string;
  /** Migrations for Durable Objects associated with the version. Migrations are applied when the version is deployed. */
  migrations?: unknown;
  /** Code, sourcemaps, and other content used at runtime.  This includes [`_headers`](https://developers.cloudflare.com/workers/static-assets/headers/#custom-headers) and [`_redirects`](https://developers. */
  modules?: { contentBase64: string; contentType: string; name: string }[];
  /** Placement settings for the version. */
  placement?: { mode?: "smart" };
  /** The client used to create the version. */
  source?: string;
  /** @deprecated Usage model for the version. */
  usageModel?: "standard" | "bundled" | "unbound";
}

export const CreateBetaWorkerVersionResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  number: Schema.Number,
  annotations: Schema.optional(
    Schema.Struct({
      "workers/message": Schema.optional(Schema.String),
      "workers/tag": Schema.optional(Schema.String),
      "workers/triggeredBy": Schema.optional(Schema.String).pipe(
        T.JsonName("'workers/triggered_by'"),
      ),
    }),
  ),
  assets: Schema.optional(
    Schema.Struct({
      config: Schema.optional(
        Schema.Struct({
          htmlHandling: Schema.optional(
            Schema.Literal(
              "auto-trailing-slash",
              "force-trailing-slash",
              "drop-trailing-slash",
              "none",
            ),
          ).pipe(T.JsonName("html_handling")),
          notFoundHandling: Schema.optional(
            Schema.Literal("none", "404-page", "single-page-application"),
          ).pipe(T.JsonName("not_found_handling")),
          runWorkerFirst: Schema.optional(
            Schema.Union(Schema.Array(Schema.String), Schema.Boolean),
          ).pipe(T.JsonName("run_worker_first")),
        }),
      ),
      jwt: Schema.optional(Schema.String),
    }),
  ),
  bindings: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("ai"),
        }),
        Schema.Struct({
          dataset: Schema.String,
          name: Schema.String,
          type: Schema.Literal("analytics_engine"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("assets"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("browser"),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("d1"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("data_blob"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespace: Schema.String,
          type: Schema.Literal("dispatch_namespace"),
          outbound: Schema.optional(
            Schema.Struct({
              params: Schema.optional(Schema.Array(Schema.String)),
              worker: Schema.optional(
                Schema.Struct({
                  environment: Schema.optional(Schema.String),
                  service: Schema.optional(Schema.String),
                }),
              ),
            }),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("durable_object_namespace"),
          className: Schema.optional(Schema.String).pipe(
            T.JsonName("class_name"),
          ),
          environment: Schema.optional(Schema.String),
          namespaceId: Schema.optional(Schema.String).pipe(
            T.JsonName("namespace_id"),
          ),
          scriptName: Schema.optional(Schema.String).pipe(
            T.JsonName("script_name"),
          ),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("hyperdrive"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("inherit"),
          oldName: Schema.optional(Schema.String).pipe(T.JsonName("old_name")),
          versionId: Schema.optional(Schema.String).pipe(
            T.JsonName("version_id"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("images"),
        }),
        Schema.Struct({
          json: Schema.String,
          name: Schema.String,
          type: Schema.Literal("json"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
          type: Schema.Literal("kv_namespace"),
        }),
        Schema.Struct({
          certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
          name: Schema.String,
          type: Schema.Literal("mtls_certificate"),
        }),
        Schema.Struct({
          name: Schema.String,
          text: Schema.String,
          type: Schema.Literal("plain_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          pipeline: Schema.String,
          type: Schema.Literal("pipelines"),
        }),
        Schema.Struct({
          name: Schema.String,
          queueName: Schema.String.pipe(T.JsonName("queue_name")),
          type: Schema.Literal("queue"),
        }),
        Schema.Struct({
          bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
          name: Schema.String,
          type: Schema.Literal("r2_bucket"),
          jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("secret_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("send_email"),
          allowedDestinationAddresses: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("allowed_destination_addresses")),
          allowedSenderAddresses: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("allowed_sender_addresses")),
          destinationAddress: Schema.optional(Schema.String).pipe(
            T.JsonName("destination_address"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("service"),
          environment: Schema.optional(Schema.String),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("tail_consumer"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("text_blob"),
        }),
        Schema.Struct({
          indexName: Schema.String.pipe(T.JsonName("index_name")),
          name: Schema.String,
          type: Schema.Literal("vectorize"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("version_metadata"),
        }),
        Schema.Struct({
          name: Schema.String,
          secretName: Schema.String.pipe(T.JsonName("secret_name")),
          storeId: Schema.String.pipe(T.JsonName("store_id")),
          type: Schema.Literal("secrets_store_secret"),
        }),
        Schema.Struct({
          algorithm: Schema.Unknown,
          format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
          name: Schema.String,
          type: Schema.Literal("secret_key"),
          usages: Schema.Array(
            Schema.Literal(
              "encrypt",
              "decrypt",
              "sign",
              "verify",
              "deriveKey",
              "deriveBits",
              "wrapKey",
              "unwrapKey",
            ),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("workflow"),
          workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
          className: Schema.optional(Schema.String).pipe(
            T.JsonName("class_name"),
          ),
          scriptName: Schema.optional(Schema.String).pipe(
            T.JsonName("script_name"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("wasm_module"),
        }),
      ),
    ),
  ),
  compatibilityDate: Schema.optional(Schema.String).pipe(
    T.JsonName("compatibility_date"),
  ),
  compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("compatibility_flags"),
  ),
  limits: Schema.optional(
    Schema.Struct({
      cpuMs: Schema.Number.pipe(T.JsonName("cpu_ms")),
    }),
  ),
  mainModule: Schema.optional(Schema.String).pipe(T.JsonName("main_module")),
  migrations: Schema.optional(Schema.Unknown),
  modules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        contentBase64: Schema.String.pipe(T.JsonName("content_base64")),
        contentType: Schema.String.pipe(T.JsonName("content_type")),
        name: Schema.String,
      }),
    ),
  ),
  placement: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("smart")),
    }),
  ),
  source: Schema.optional(Schema.String),
  usageModel: Schema.optional(
    Schema.Literal("standard", "bundled", "unbound"),
  ).pipe(T.JsonName("usage_model")),
}) as unknown as Schema.Schema<CreateBetaWorkerVersionResponse>;

export const createBetaWorkerVersion: (
  input: CreateBetaWorkerVersionRequest,
) => Effect.Effect<
  CreateBetaWorkerVersionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateBetaWorkerVersionRequest,
  output: CreateBetaWorkerVersionResponse,
  errors: [],
}));

export interface DeleteBetaWorkerVersionRequest {
  workerId: string;
  versionId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteBetaWorkerVersionRequest = Schema.Struct({
  workerId: Schema.String.pipe(T.HttpPath("workerId")),
  versionId: Schema.String.pipe(T.HttpPath("versionId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/workers/{workerId}/versions/{versionId}",
  }),
) as unknown as Schema.Schema<DeleteBetaWorkerVersionRequest>;

export interface DeleteBetaWorkerVersionResponse {
  errors: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  messages: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  /** Whether the API call was successful. */
  success: true;
}

export const DeleteBetaWorkerVersionResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<DeleteBetaWorkerVersionResponse>;

export const deleteBetaWorkerVersion: (
  input: DeleteBetaWorkerVersionRequest,
) => Effect.Effect<
  DeleteBetaWorkerVersionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteBetaWorkerVersionRequest,
  output: DeleteBetaWorkerVersionResponse,
  errors: [],
}));

// =============================================================================
// Domain
// =============================================================================

export interface GetDomainRequest {
  domainId: string;
  /** Identifer of the account. */
  accountId: string;
}

export const GetDomainRequest = Schema.Struct({
  domainId: Schema.String.pipe(T.HttpPath("domainId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/domains/{domainId}",
  }),
) as unknown as Schema.Schema<GetDomainRequest>;

export interface GetDomainResponse {
  /** Identifer of the Worker Domain. */
  id?: string;
  /** Worker environment associated with the zone and hostname. */
  environment?: string;
  /** Hostname of the Worker Domain. */
  hostname?: string;
  /** Worker service associated with the zone and hostname. */
  service?: string;
  /** Identifier of the zone. */
  zoneId?: string;
  /** Name of the zone. */
  zoneName?: string;
}

export const GetDomainResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  environment: Schema.optional(Schema.String),
  hostname: Schema.optional(Schema.String),
  service: Schema.optional(Schema.String),
  zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
  zoneName: Schema.optional(Schema.String).pipe(T.JsonName("zone_name")),
}) as unknown as Schema.Schema<GetDomainResponse>;

export const getDomain: (
  input: GetDomainRequest,
) => Effect.Effect<
  GetDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDomainRequest,
  output: GetDomainResponse,
  errors: [],
}));

export interface PutDomainRequest {
  /** Path param: Identifer of the account. */
  accountId: string;
  /** Body param: Worker environment associated with the zone and hostname. */
  environment: string;
  /** Body param: Hostname of the Worker Domain. */
  hostname: string;
  /** Body param: Worker service associated with the zone and hostname. */
  service: string;
  /** Body param: Identifier of the zone. */
  zoneId: string;
}

export const PutDomainRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  environment: Schema.String,
  hostname: Schema.String,
  service: Schema.String,
  zoneId: Schema.String.pipe(T.JsonName("zone_id")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/workers/domains" }),
) as unknown as Schema.Schema<PutDomainRequest>;

export interface PutDomainResponse {
  /** Identifer of the Worker Domain. */
  id?: string;
  /** Worker environment associated with the zone and hostname. */
  environment?: string;
  /** Hostname of the Worker Domain. */
  hostname?: string;
  /** Worker service associated with the zone and hostname. */
  service?: string;
  /** Identifier of the zone. */
  zoneId?: string;
  /** Name of the zone. */
  zoneName?: string;
}

export const PutDomainResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  environment: Schema.optional(Schema.String),
  hostname: Schema.optional(Schema.String),
  service: Schema.optional(Schema.String),
  zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
  zoneName: Schema.optional(Schema.String).pipe(T.JsonName("zone_name")),
}) as unknown as Schema.Schema<PutDomainResponse>;

export const putDomain: (
  input: PutDomainRequest,
) => Effect.Effect<
  PutDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutDomainRequest,
  output: PutDomainResponse,
  errors: [],
}));

export interface DeleteDomainRequest {
  domainId: string;
  /** Identifer of the account. */
  accountId: string;
}

export const DeleteDomainRequest = Schema.Struct({
  domainId: Schema.String.pipe(T.HttpPath("domainId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/domains/{domainId}",
  }),
) as unknown as Schema.Schema<DeleteDomainRequest>;

export type DeleteDomainResponse = unknown;

export const DeleteDomainResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDomainResponse>;

export const deleteDomain: (
  input: DeleteDomainRequest,
) => Effect.Effect<
  DeleteDomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResponse,
  errors: [],
}));

// =============================================================================
// ObservabilityTelemetry
// =============================================================================

export interface QueryObservabilityTelemetryRequest {
  /** Path param: Your Cloudflare account ID. */
  accountId: string;
  /** Body param: */
  queryId: string;
  /** Body param: */
  timeframe: { from: number; to: number };
  /** Body param: */
  chart?: boolean;
  /** Body param: */
  compare?: boolean;
  /** Body param: */
  dry?: boolean;
  /** Body param: */
  granularity?: number;
  /** Body param: */
  ignoreSeries?: boolean;
  /** Body param: */
  limit?: number;
  /** Body param: */
  offset?: string;
  /** Body param: */
  offsetBy?: number;
  /** Body param: */
  offsetDirection?: string;
  /** Body param: */
  parameters?: {
    calculations?: {
      operator:
        | "uniq"
        | "count"
        | "max"
        | "min"
        | "sum"
        | "avg"
        | "median"
        | "p001"
        | "p01"
        | "p05"
        | "p10"
        | "p25"
        | "p75"
        | "p90"
        | "p95"
        | "p99"
        | "p999"
        | "stddev"
        | "variance"
        | "COUNT_DISTINCT"
        | "COUNT"
        | "MAX"
        | "MIN"
        | "SUM"
        | "AVG"
        | "MEDIAN"
        | "P001"
        | "P01"
        | "P05"
        | "P10"
        | "P25"
        | "P75"
        | "P90"
        | "P95"
        | "P99"
        | "P999"
        | "STDDEV"
        | "VARIANCE";
      alias?: string;
      key?: string;
      keyType?: "string" | "number" | "boolean";
    }[];
    datasets?: string[];
    filterCombination?: "and" | "or" | "AND" | "OR";
    filters?: {
      key: string;
      operation:
        | "includes"
        | "not_includes"
        | "starts_with"
        | "regex"
        | "exists"
        | "is_null"
        | "in"
        | "not_in"
        | "eq"
        | "neq"
        | "gt"
        | "gte"
        | "lt"
        | "lte"
        | "="
        | "!="
        | ">"
        | ">="
        | "<"
        | "<="
        | "INCLUDES"
        | "DOES_NOT_INCLUDE"
        | "MATCH_REGEX"
        | "EXISTS"
        | "DOES_NOT_EXIST"
        | "IN"
        | "NOT_IN"
        | "STARTS_WITH";
      type: "string" | "number" | "boolean";
      value?: string | number | boolean;
    }[];
    groupBys?: { type: "string" | "number" | "boolean"; value: string }[];
    havings?: {
      key: string;
      operation: "eq" | "neq" | "gt" | "gte" | "lt" | "lte";
      value: number;
    }[];
    limit?: number;
    needle?: {
      value: string | number | boolean;
      isRegex?: boolean;
      matchCase?: boolean;
    };
    orderBy?: { value: string; order?: "asc" | "desc" };
  };
  /** Body param: */
  patternType?: "message" | "error";
  /** Body param: */
  view?:
    | "traces"
    | "events"
    | "calculations"
    | "invocations"
    | "requests"
    | "patterns";
}

export const QueryObservabilityTelemetryRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  queryId: Schema.String,
  timeframe: Schema.Struct({
    from: Schema.Number,
    to: Schema.Number,
  }),
  chart: Schema.optional(Schema.Boolean),
  compare: Schema.optional(Schema.Boolean),
  dry: Schema.optional(Schema.Boolean),
  granularity: Schema.optional(Schema.Number),
  ignoreSeries: Schema.optional(Schema.Boolean),
  limit: Schema.optional(Schema.Number),
  offset: Schema.optional(Schema.String),
  offsetBy: Schema.optional(Schema.Number),
  offsetDirection: Schema.optional(Schema.String),
  parameters: Schema.optional(
    Schema.Struct({
      calculations: Schema.optional(
        Schema.Array(
          Schema.Struct({
            operator: Schema.Literal(
              "uniq",
              "count",
              "max",
              "min",
              "sum",
              "avg",
              "median",
              "p001",
              "p01",
              "p05",
              "p10",
              "p25",
              "p75",
              "p90",
              "p95",
              "p99",
              "p999",
              "stddev",
              "variance",
              "COUNT_DISTINCT",
              "COUNT",
              "MAX",
              "MIN",
              "SUM",
              "AVG",
              "MEDIAN",
              "P001",
              "P01",
              "P05",
              "P10",
              "P25",
              "P75",
              "P90",
              "P95",
              "P99",
              "P999",
              "STDDEV",
              "VARIANCE",
            ),
            alias: Schema.optional(Schema.String),
            key: Schema.optional(Schema.String),
            keyType: Schema.optional(
              Schema.Literal("string", "number", "boolean"),
            ),
          }),
        ),
      ),
      datasets: Schema.optional(Schema.Array(Schema.String)),
      filterCombination: Schema.optional(
        Schema.Literal("and", "or", "AND", "OR"),
      ),
      filters: Schema.optional(
        Schema.Array(
          Schema.Struct({
            key: Schema.String,
            operation: Schema.Literal(
              "includes",
              "not_includes",
              "starts_with",
              "regex",
              "exists",
              "is_null",
              "in",
              "not_in",
              "eq",
              "neq",
              "gt",
              "gte",
              "lt",
              "lte",
              "=",
              "!=",
              ">",
              ">=",
              "<",
              "<=",
              "INCLUDES",
              "DOES_NOT_INCLUDE",
              "MATCH_REGEX",
              "EXISTS",
              "DOES_NOT_EXIST",
              "IN",
              "NOT_IN",
              "STARTS_WITH",
            ),
            type: Schema.Literal("string", "number", "boolean"),
            value: Schema.optional(
              Schema.Union(Schema.String, Schema.Number, Schema.Boolean),
            ),
          }),
        ),
      ),
      groupBys: Schema.optional(
        Schema.Array(
          Schema.Struct({
            type: Schema.Literal("string", "number", "boolean"),
            value: Schema.String,
          }),
        ),
      ),
      havings: Schema.optional(
        Schema.Array(
          Schema.Struct({
            key: Schema.String,
            operation: Schema.Literal("eq", "neq", "gt", "gte", "lt", "lte"),
            value: Schema.Number,
          }),
        ),
      ),
      limit: Schema.optional(Schema.Number),
      needle: Schema.optional(
        Schema.Struct({
          value: Schema.Union(Schema.String, Schema.Number, Schema.Boolean),
          isRegex: Schema.optional(Schema.Boolean),
          matchCase: Schema.optional(Schema.Boolean),
        }),
      ),
      orderBy: Schema.optional(
        Schema.Struct({
          value: Schema.String,
          order: Schema.optional(Schema.Literal("asc", "desc")),
        }),
      ),
    }),
  ),
  patternType: Schema.optional(Schema.Literal("message", "error")),
  view: Schema.optional(
    Schema.Literal(
      "traces",
      "events",
      "calculations",
      "invocations",
      "requests",
      "patterns",
    ),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/workers/observability/telemetry/query",
  }),
) as unknown as Schema.Schema<QueryObservabilityTelemetryRequest>;

export interface QueryObservabilityTelemetryResponse {
  /** A Workers Observability Query Object */
  run: {
    id: string;
    accountId: string;
    dry: boolean;
    environmentId: string;
    granularity: number;
    query: {
      id: string;
      created: string;
      description: string | null;
      environmentId: string;
      generated: boolean | null;
      name: string | null;
      parameters: {
        calculations?: {
          operator:
            | "uniq"
            | "count"
            | "max"
            | "min"
            | "sum"
            | "avg"
            | "median"
            | "p001"
            | "p01"
            | "p05"
            | "p10"
            | "p25"
            | "p75"
            | "p90"
            | "p95"
            | "p99"
            | "p999"
            | "stddev"
            | "variance"
            | "COUNT_DISTINCT"
            | "COUNT"
            | "MAX"
            | "MIN"
            | "SUM"
            | "AVG"
            | "MEDIAN"
            | "P001"
            | "P01"
            | "P05"
            | "P10"
            | "P25"
            | "P75"
            | "P90"
            | "P95"
            | "P99"
            | "P999"
            | "STDDEV"
            | "VARIANCE";
          alias?: string;
          key?: string;
          keyType?: "string" | "number" | "boolean";
        }[];
        datasets?: string[];
        filterCombination?: "and" | "or" | "AND" | "OR";
        filters?: {
          key: string;
          operation:
            | "includes"
            | "not_includes"
            | "starts_with"
            | "regex"
            | "exists"
            | "is_null"
            | "in"
            | "not_in"
            | "eq"
            | "neq"
            | "gt"
            | "gte"
            | "lt"
            | "lte"
            | "="
            | "!="
            | ">"
            | ">="
            | "<"
            | "<="
            | "INCLUDES"
            | "DOES_NOT_INCLUDE"
            | "MATCH_REGEX"
            | "EXISTS"
            | "DOES_NOT_EXIST"
            | "IN"
            | "NOT_IN"
            | "STARTS_WITH";
          type: "string" | "number" | "boolean";
          value?: string | number | boolean;
        }[];
        groupBys?: { type: "string" | "number" | "boolean"; value: string }[];
        havings?: {
          key: string;
          operation: "eq" | "neq" | "gt" | "gte" | "lt" | "lte";
          value: number;
        }[];
        limit?: number;
        needle?: {
          value: string | number | boolean;
          isRegex?: boolean;
          matchCase?: boolean;
        };
        orderBy?: { value: string; order?: "asc" | "desc" };
      };
      updated: string;
      userId: string;
      workspaceId: string;
    };
    status: "STARTED" | "COMPLETED";
    timeframe: { from: number; to: number };
    userId: string;
    workspaceId: string;
    created?: string;
    statistics?: { bytesRead: number; elapsed: number; rowsRead: number };
    updated?: string;
  };
  /** The statistics object contains information about query performance from the database, it does not include any network latency */
  statistics: { bytesRead: number; elapsed: number; rowsRead: number };
  calculations?: {
    aggregates: {
      count: number;
      interval: number;
      sampleInterval: number;
      value: number;
      groups?: { key: string; value: string | number | boolean }[];
    }[];
    calculation: string;
    series: {
      data: {
        count: number;
        interval: number;
        sampleInterval: number;
        value: number;
        groups?: { key: string; value: string | number | boolean }[];
      }[];
      time: string;
    }[];
    alias?: string;
  }[];
  compare?: {
    aggregates: {
      count: number;
      interval: number;
      sampleInterval: number;
      value: number;
      groups?: { key: string; value: string | number | boolean }[];
    }[];
    calculation: string;
    series: {
      data: {
        count: number;
        interval: number;
        sampleInterval: number;
        value: number;
        groups?: { key: string; value: string | number | boolean }[];
      }[];
      time: string;
    }[];
    alias?: string;
  }[];
  events?: {
    count?: number;
    events?: {
      $metadata: {
        id: string;
        account?: string;
        cloudService?: string;
        coldStart?: number;
        cost?: number;
        duration?: number;
        endTime?: number;
        error?: string;
        errorTemplate?: string;
        fingerprint?: string;
        level?: string;
        message?: string;
        messageTemplate?: string;
        metricName?: string;
        origin?: string;
        parentSpanId?: string;
        provider?: string;
        region?: string;
        requestId?: string;
        service?: string;
        spanId?: string;
        spanName?: string;
        stackId?: string;
        startTime?: number;
        statusCode?: number;
        traceDuration?: number;
        traceId?: string;
        trigger?: string;
        type?: string;
        url?: string;
      };
      dataset: string;
      source: string;
      timestamp: number;
      $workers?:
        | {
            eventType:
              | "fetch"
              | "scheduled"
              | "alarm"
              | "cron"
              | "queue"
              | "email"
              | "tail"
              | "rpc"
              | "websocket"
              | "unknown";
            outcome: string;
            requestId: string;
            scriptName: string;
            entrypoint?: string;
            event?: Record<string, unknown>;
            executionModel?: "durableObject" | "stateless";
            scriptVersion?: { id?: string; message?: string; tag?: string };
            truncated?: boolean;
          }
        | {
            cpuTimeMs: number;
            eventType:
              | "fetch"
              | "scheduled"
              | "alarm"
              | "cron"
              | "queue"
              | "email"
              | "tail"
              | "rpc"
              | "websocket"
              | "unknown";
            outcome: string;
            requestId: string;
            scriptName: string;
            wallTimeMs: number;
            diagnosticsChannelEvents?: {
              channel: string;
              message: string;
              timestamp: number;
            }[];
            dispatchNamespace?: string;
            entrypoint?: string;
            event?: Record<string, unknown>;
            executionModel?: "durableObject" | "stateless";
            scriptVersion?: { id?: string; message?: string; tag?: string };
            truncated?: boolean;
          };
    }[];
    fields?: { key: string; type: string }[];
    series?: {
      data: {
        count: number;
        interval: number;
        sampleInterval: number;
        value: number;
        groups?: { key: string; value: string | number | boolean }[];
      }[];
      time: string;
    }[];
  };
  invocations?: Record<string, unknown>;
  patterns?: {
    count: number;
    pattern: string;
    series: {
      data: {
        count: number;
        interval: number;
        sampleInterval: number;
        value: number;
        groups?: { key: string; value: string | number | boolean }[];
      };
      time: string;
    }[];
    service: string;
  }[];
}

export const QueryObservabilityTelemetryResponse = Schema.Struct({
  run: Schema.Struct({
    id: Schema.String,
    accountId: Schema.String,
    dry: Schema.Boolean,
    environmentId: Schema.String,
    granularity: Schema.Number,
    query: Schema.Struct({
      id: Schema.String,
      created: Schema.String,
      description: Schema.Union(Schema.String, Schema.Null),
      environmentId: Schema.String,
      generated: Schema.Union(Schema.Boolean, Schema.Null),
      name: Schema.Union(Schema.String, Schema.Null),
      parameters: Schema.Struct({
        calculations: Schema.optional(
          Schema.Array(
            Schema.Struct({
              operator: Schema.Literal(
                "uniq",
                "count",
                "max",
                "min",
                "sum",
                "avg",
                "median",
                "p001",
                "p01",
                "p05",
                "p10",
                "p25",
                "p75",
                "p90",
                "p95",
                "p99",
                "p999",
                "stddev",
                "variance",
                "COUNT_DISTINCT",
                "COUNT",
                "MAX",
                "MIN",
                "SUM",
                "AVG",
                "MEDIAN",
                "P001",
                "P01",
                "P05",
                "P10",
                "P25",
                "P75",
                "P90",
                "P95",
                "P99",
                "P999",
                "STDDEV",
                "VARIANCE",
              ),
              alias: Schema.optional(Schema.String),
              key: Schema.optional(Schema.String),
              keyType: Schema.optional(
                Schema.Literal("string", "number", "boolean"),
              ),
            }),
          ),
        ),
        datasets: Schema.optional(Schema.Array(Schema.String)),
        filterCombination: Schema.optional(
          Schema.Literal("and", "or", "AND", "OR"),
        ),
        filters: Schema.optional(
          Schema.Array(
            Schema.Struct({
              key: Schema.String,
              operation: Schema.Literal(
                "includes",
                "not_includes",
                "starts_with",
                "regex",
                "exists",
                "is_null",
                "in",
                "not_in",
                "eq",
                "neq",
                "gt",
                "gte",
                "lt",
                "lte",
                "=",
                "!=",
                ">",
                ">=",
                "<",
                "<=",
                "INCLUDES",
                "DOES_NOT_INCLUDE",
                "MATCH_REGEX",
                "EXISTS",
                "DOES_NOT_EXIST",
                "IN",
                "NOT_IN",
                "STARTS_WITH",
              ),
              type: Schema.Literal("string", "number", "boolean"),
              value: Schema.optional(
                Schema.Union(Schema.String, Schema.Number, Schema.Boolean),
              ),
            }),
          ),
        ),
        groupBys: Schema.optional(
          Schema.Array(
            Schema.Struct({
              type: Schema.Literal("string", "number", "boolean"),
              value: Schema.String,
            }),
          ),
        ),
        havings: Schema.optional(
          Schema.Array(
            Schema.Struct({
              key: Schema.String,
              operation: Schema.Literal("eq", "neq", "gt", "gte", "lt", "lte"),
              value: Schema.Number,
            }),
          ),
        ),
        limit: Schema.optional(Schema.Number),
        needle: Schema.optional(
          Schema.Struct({
            value: Schema.Union(Schema.String, Schema.Number, Schema.Boolean),
            isRegex: Schema.optional(Schema.Boolean),
            matchCase: Schema.optional(Schema.Boolean),
          }),
        ),
        orderBy: Schema.optional(
          Schema.Struct({
            value: Schema.String,
            order: Schema.optional(Schema.Literal("asc", "desc")),
          }),
        ),
      }),
      updated: Schema.String,
      userId: Schema.String,
      workspaceId: Schema.String,
    }),
    status: Schema.Literal("STARTED", "COMPLETED"),
    timeframe: Schema.Struct({
      from: Schema.Number,
      to: Schema.Number,
    }),
    userId: Schema.String,
    workspaceId: Schema.String,
    created: Schema.optional(Schema.String),
    statistics: Schema.optional(
      Schema.Struct({
        bytesRead: Schema.Number.pipe(T.JsonName("bytes_read")),
        elapsed: Schema.Number,
        rowsRead: Schema.Number.pipe(T.JsonName("rows_read")),
      }),
    ),
    updated: Schema.optional(Schema.String),
  }),
  statistics: Schema.Struct({
    bytesRead: Schema.Number.pipe(T.JsonName("bytes_read")),
    elapsed: Schema.Number,
    rowsRead: Schema.Number.pipe(T.JsonName("rows_read")),
  }),
  calculations: Schema.optional(
    Schema.Array(
      Schema.Struct({
        aggregates: Schema.Array(
          Schema.Struct({
            count: Schema.Number,
            interval: Schema.Number,
            sampleInterval: Schema.Number,
            value: Schema.Number,
            groups: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  key: Schema.String,
                  value: Schema.Union(
                    Schema.String,
                    Schema.Number,
                    Schema.Boolean,
                  ),
                }),
              ),
            ),
          }),
        ),
        calculation: Schema.String,
        series: Schema.Array(
          Schema.Struct({
            data: Schema.Array(
              Schema.Struct({
                count: Schema.Number,
                interval: Schema.Number,
                sampleInterval: Schema.Number,
                value: Schema.Number,
                groups: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      key: Schema.String,
                      value: Schema.Union(
                        Schema.String,
                        Schema.Number,
                        Schema.Boolean,
                      ),
                    }),
                  ),
                ),
              }),
            ),
            time: Schema.String,
          }),
        ),
        alias: Schema.optional(Schema.String),
      }),
    ),
  ),
  compare: Schema.optional(
    Schema.Array(
      Schema.Struct({
        aggregates: Schema.Array(
          Schema.Struct({
            count: Schema.Number,
            interval: Schema.Number,
            sampleInterval: Schema.Number,
            value: Schema.Number,
            groups: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  key: Schema.String,
                  value: Schema.Union(
                    Schema.String,
                    Schema.Number,
                    Schema.Boolean,
                  ),
                }),
              ),
            ),
          }),
        ),
        calculation: Schema.String,
        series: Schema.Array(
          Schema.Struct({
            data: Schema.Array(
              Schema.Struct({
                count: Schema.Number,
                interval: Schema.Number,
                sampleInterval: Schema.Number,
                value: Schema.Number,
                groups: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      key: Schema.String,
                      value: Schema.Union(
                        Schema.String,
                        Schema.Number,
                        Schema.Boolean,
                      ),
                    }),
                  ),
                ),
              }),
            ),
            time: Schema.String,
          }),
        ),
        alias: Schema.optional(Schema.String),
      }),
    ),
  ),
  events: Schema.optional(
    Schema.Struct({
      count: Schema.optional(Schema.Number),
      events: Schema.optional(
        Schema.Array(
          Schema.Struct({
            $metadata: Schema.Struct({
              id: Schema.String,
              account: Schema.optional(Schema.String),
              cloudService: Schema.optional(Schema.String),
              coldStart: Schema.optional(Schema.Number),
              cost: Schema.optional(Schema.Number),
              duration: Schema.optional(Schema.Number),
              endTime: Schema.optional(Schema.Number),
              error: Schema.optional(Schema.String),
              errorTemplate: Schema.optional(Schema.String),
              fingerprint: Schema.optional(Schema.String),
              level: Schema.optional(Schema.String),
              message: Schema.optional(Schema.String),
              messageTemplate: Schema.optional(Schema.String),
              metricName: Schema.optional(Schema.String),
              origin: Schema.optional(Schema.String),
              parentSpanId: Schema.optional(Schema.String),
              provider: Schema.optional(Schema.String),
              region: Schema.optional(Schema.String),
              requestId: Schema.optional(Schema.String),
              service: Schema.optional(Schema.String),
              spanId: Schema.optional(Schema.String),
              spanName: Schema.optional(Schema.String),
              stackId: Schema.optional(Schema.String),
              startTime: Schema.optional(Schema.Number),
              statusCode: Schema.optional(Schema.Number),
              traceDuration: Schema.optional(Schema.Number),
              traceId: Schema.optional(Schema.String),
              trigger: Schema.optional(Schema.String),
              type: Schema.optional(Schema.String),
              url: Schema.optional(Schema.String),
            }),
            dataset: Schema.String,
            source: Schema.String,
            timestamp: Schema.Number,
            $workers: Schema.optional(
              Schema.Union(
                Schema.Struct({
                  eventType: Schema.Literal(
                    "fetch",
                    "scheduled",
                    "alarm",
                    "cron",
                    "queue",
                    "email",
                    "tail",
                    "rpc",
                    "websocket",
                    "unknown",
                  ),
                  outcome: Schema.String,
                  requestId: Schema.String,
                  scriptName: Schema.String,
                  entrypoint: Schema.optional(Schema.String),
                  event: Schema.optional(Schema.Struct({})),
                  executionModel: Schema.optional(
                    Schema.Literal("durableObject", "stateless"),
                  ),
                  scriptVersion: Schema.optional(
                    Schema.Struct({
                      id: Schema.optional(Schema.String),
                      message: Schema.optional(Schema.String),
                      tag: Schema.optional(Schema.String),
                    }),
                  ),
                  truncated: Schema.optional(Schema.Boolean),
                }),
                Schema.Struct({
                  cpuTimeMs: Schema.Number,
                  eventType: Schema.Literal(
                    "fetch",
                    "scheduled",
                    "alarm",
                    "cron",
                    "queue",
                    "email",
                    "tail",
                    "rpc",
                    "websocket",
                    "unknown",
                  ),
                  outcome: Schema.String,
                  requestId: Schema.String,
                  scriptName: Schema.String,
                  wallTimeMs: Schema.Number,
                  diagnosticsChannelEvents: Schema.optional(
                    Schema.Array(
                      Schema.Struct({
                        channel: Schema.String,
                        message: Schema.String,
                        timestamp: Schema.Number,
                      }),
                    ),
                  ),
                  dispatchNamespace: Schema.optional(Schema.String),
                  entrypoint: Schema.optional(Schema.String),
                  event: Schema.optional(Schema.Struct({})),
                  executionModel: Schema.optional(
                    Schema.Literal("durableObject", "stateless"),
                  ),
                  scriptVersion: Schema.optional(
                    Schema.Struct({
                      id: Schema.optional(Schema.String),
                      message: Schema.optional(Schema.String),
                      tag: Schema.optional(Schema.String),
                    }),
                  ),
                  truncated: Schema.optional(Schema.Boolean),
                }),
              ),
            ),
          }),
        ),
      ),
      fields: Schema.optional(
        Schema.Array(
          Schema.Struct({
            key: Schema.String,
            type: Schema.String,
          }),
        ),
      ),
      series: Schema.optional(
        Schema.Array(
          Schema.Struct({
            data: Schema.Array(
              Schema.Struct({
                count: Schema.Number,
                interval: Schema.Number,
                sampleInterval: Schema.Number,
                value: Schema.Number,
                groups: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      key: Schema.String,
                      value: Schema.Union(
                        Schema.String,
                        Schema.Number,
                        Schema.Boolean,
                      ),
                    }),
                  ),
                ),
              }),
            ),
            time: Schema.String,
          }),
        ),
      ),
    }),
  ),
  invocations: Schema.optional(Schema.Struct({})),
  patterns: Schema.optional(
    Schema.Array(
      Schema.Struct({
        count: Schema.Number,
        pattern: Schema.String,
        series: Schema.Array(
          Schema.Struct({
            data: Schema.Struct({
              count: Schema.Number,
              interval: Schema.Number,
              sampleInterval: Schema.Number,
              value: Schema.Number,
              groups: Schema.optional(
                Schema.Array(
                  Schema.Struct({
                    key: Schema.String,
                    value: Schema.Union(
                      Schema.String,
                      Schema.Number,
                      Schema.Boolean,
                    ),
                  }),
                ),
              ),
            }),
            time: Schema.String,
          }),
        ),
        service: Schema.String,
      }),
    ),
  ),
}) as unknown as Schema.Schema<QueryObservabilityTelemetryResponse>;

export const queryObservabilityTelemetry: (
  input: QueryObservabilityTelemetryRequest,
) => Effect.Effect<
  QueryObservabilityTelemetryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: QueryObservabilityTelemetryRequest,
  output: QueryObservabilityTelemetryResponse,
  errors: [],
}));

// =============================================================================
// Route
// =============================================================================

export interface GetRouteRequest {
  routeId: string;
  /** Identifier. */
  zoneId: string;
}

export const GetRouteRequest = Schema.Struct({
  routeId: Schema.String.pipe(T.HttpPath("routeId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/workers/routes/{routeId}" }),
) as unknown as Schema.Schema<GetRouteRequest>;

export interface GetRouteResponse {
  /** Identifier. */
  id: string;
  /** Pattern to match incoming requests against. [Learn more](https://developers.cloudflare.com/workers/configuration/routing/routes/#matching-behavior). */
  pattern: string;
  /** Name of the script to run if the route matches. */
  script?: string;
}

export const GetRouteResponse = Schema.Struct({
  id: Schema.String,
  pattern: Schema.String,
  script: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetRouteResponse>;

export const getRoute: (
  input: GetRouteRequest,
) => Effect.Effect<
  GetRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRouteRequest,
  output: GetRouteResponse,
  errors: [],
}));

export interface CreateRouteRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Pattern to match incoming requests against. [Learn more](https://developers.cloudflare.com/workers/configuration/routing/routes/#matching-behavior). */
  pattern: string;
  /** Body param: Name of the script to run if the route matches. */
  script?: string;
}

export const CreateRouteRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  pattern: Schema.String,
  script: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/workers/routes" }),
) as unknown as Schema.Schema<CreateRouteRequest>;

export interface CreateRouteResponse {
  /** Identifier. */
  id: string;
  /** Pattern to match incoming requests against. [Learn more](https://developers.cloudflare.com/workers/configuration/routing/routes/#matching-behavior). */
  pattern: string;
  /** Name of the script to run if the route matches. */
  script?: string;
}

export const CreateRouteResponse = Schema.Struct({
  id: Schema.String,
  pattern: Schema.String,
  script: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateRouteResponse>;

export const createRoute: (
  input: CreateRouteRequest,
) => Effect.Effect<
  CreateRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateRouteRequest,
  output: CreateRouteResponse,
  errors: [],
}));

export interface UpdateRouteRequest {
  routeId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Pattern to match incoming requests against. [Learn more](https://developers.cloudflare.com/workers/configuration/routing/routes/#matching-behavior). */
  pattern: string;
  /** Body param: Name of the script to run if the route matches. */
  script?: string;
}

export const UpdateRouteRequest = Schema.Struct({
  routeId: Schema.String.pipe(T.HttpPath("routeId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  pattern: Schema.String,
  script: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/workers/routes/{routeId}" }),
) as unknown as Schema.Schema<UpdateRouteRequest>;

export interface UpdateRouteResponse {
  /** Identifier. */
  id: string;
  /** Pattern to match incoming requests against. [Learn more](https://developers.cloudflare.com/workers/configuration/routing/routes/#matching-behavior). */
  pattern: string;
  /** Name of the script to run if the route matches. */
  script?: string;
}

export const UpdateRouteResponse = Schema.Struct({
  id: Schema.String,
  pattern: Schema.String,
  script: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateRouteResponse>;

export const updateRoute: (
  input: UpdateRouteRequest,
) => Effect.Effect<
  UpdateRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateRouteRequest,
  output: UpdateRouteResponse,
  errors: [],
}));

export interface DeleteRouteRequest {
  routeId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteRouteRequest = Schema.Struct({
  routeId: Schema.String.pipe(T.HttpPath("routeId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/workers/routes/{routeId}",
  }),
) as unknown as Schema.Schema<DeleteRouteRequest>;

export interface DeleteRouteResponse {
  /** Identifier. */
  id?: string;
}

export const DeleteRouteResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteRouteResponse>;

export const deleteRoute: (
  input: DeleteRouteRequest,
) => Effect.Effect<
  DeleteRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteRouteRequest,
  output: DeleteRouteResponse,
  errors: [],
}));

// =============================================================================
// Script
// =============================================================================

export interface GetScriptRequest {
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const GetScriptRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}",
  }),
) as unknown as Schema.Schema<GetScriptRequest>;

export type GetScriptResponse = unknown;

export const GetScriptResponse =
  Schema.Unknown as unknown as Schema.Schema<GetScriptResponse>;

export const getScript: (
  input: GetScriptRequest,
) => Effect.Effect<
  GetScriptResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScriptRequest,
  output: GetScriptResponse,
  errors: [],
}));

export interface PutScriptRequest {
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: JSON-encoded metadata about the uploaded parts and Worker configuration. */
  metadata: {
    assets?: {
      config?: {
        headers?: string;
        redirects?: string;
        htmlHandling?:
          | "auto-trailing-slash"
          | "force-trailing-slash"
          | "drop-trailing-slash"
          | "none";
        notFoundHandling?: "none" | "404-page" | "single-page-application";
        runWorkerFirst?: string[] | boolean;
        serveDirectly?: boolean;
      };
      jwt?: string;
    };
    bindings?: (
      | { name: string; type: "ai" }
      | { dataset: string; name: string; type: "analytics_engine" }
      | { name: string; type: "assets" }
      | { name: string; type: "browser" }
      | { id: string; name: string; type: "d1" }
      | { name: string; part: string; type: "data_blob" }
      | {
          name: string;
          namespace: string;
          type: "dispatch_namespace";
          outbound?: {
            params?: string[];
            worker?: { environment?: string; service?: string };
          };
        }
      | {
          name: string;
          type: "durable_object_namespace";
          className?: string;
          environment?: string;
          namespaceId?: string;
          scriptName?: string;
        }
      | { id: string; name: string; type: "hyperdrive" }
      | { name: string; type: "inherit"; oldName?: string; versionId?: string }
      | { name: string; type: "images" }
      | { json: string; name: string; type: "json" }
      | { name: string; namespaceId: string; type: "kv_namespace" }
      | { certificateId: string; name: string; type: "mtls_certificate" }
      | { name: string; text: string; type: "plain_text" }
      | { name: string; pipeline: string; type: "pipelines" }
      | { name: string; queueName: string; type: "queue" }
      | {
          bucketName: string;
          name: string;
          type: "r2_bucket";
          jurisdiction?: "eu" | "fedramp";
        }
      | { name: string; text: string; type: "secret_text" }
      | {
          name: string;
          type: "send_email";
          allowedDestinationAddresses?: string[];
          allowedSenderAddresses?: string[];
          destinationAddress?: string;
        }
      | { name: string; service: string; type: "service"; environment?: string }
      | { name: string; service: string; type: "tail_consumer" }
      | { name: string; part: string; type: "text_blob" }
      | { indexName: string; name: string; type: "vectorize" }
      | { name: string; type: "version_metadata" }
      | {
          name: string;
          secretName: string;
          storeId: string;
          type: "secrets_store_secret";
        }
      | {
          algorithm: unknown;
          format: "raw" | "pkcs8" | "spki" | "jwk";
          name: string;
          type: "secret_key";
          usages: (
            | "encrypt"
            | "decrypt"
            | "sign"
            | "verify"
            | "deriveKey"
            | "deriveBits"
            | "wrapKey"
            | "unwrapKey"
          )[];
          keyBase64?: string;
          keyJwk?: unknown;
        }
      | {
          name: string;
          type: "workflow";
          workflowName: string;
          className?: string;
          scriptName?: string;
        }
      | { name: string; part: string; type: "wasm_module" }
    )[];
    bodyPart?: string;
    compatibilityDate?: string;
    compatibilityFlags?: string[];
    keepAssets?: boolean;
    keepBindings?: string[];
    limits?: { cpuMs?: number };
    logpush?: boolean;
    mainModule?: string;
    migrations?:
      | unknown
      | { newTag?: string; oldTag?: string; steps?: unknown[] };
    observability?: {
      enabled: boolean;
      headSamplingRate?: number | null;
      logs?: {
        enabled: boolean;
        invocationLogs: boolean;
        destinations?: string[];
        headSamplingRate?: number | null;
        persist?: boolean;
      } | null;
    };
    placement?: { mode?: "smart" };
    tags?: string[];
    tailConsumers?: unknown[];
    usageModel?: "standard" | "bundled" | "unbound";
  };
  /** Body param: An array of modules (often JavaScript files) comprising a Worker script. At least one module must be present and referenced in the metadata as `main_module` or `body_part` by filename.<br/ */
  files?: (File | Blob)[];
}

export const PutScriptRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  metadata: Schema.Struct({
    assets: Schema.optional(
      Schema.Struct({
        config: Schema.optional(
          Schema.Struct({
            headers: Schema.optional(Schema.String).pipe(
              T.JsonName("_headers"),
            ),
            redirects: Schema.optional(Schema.String).pipe(
              T.JsonName("_redirects"),
            ),
            htmlHandling: Schema.optional(
              Schema.Literal(
                "auto-trailing-slash",
                "force-trailing-slash",
                "drop-trailing-slash",
                "none",
              ),
            ).pipe(T.JsonName("html_handling")),
            notFoundHandling: Schema.optional(
              Schema.Literal("none", "404-page", "single-page-application"),
            ).pipe(T.JsonName("not_found_handling")),
            runWorkerFirst: Schema.optional(
              Schema.Union(Schema.Array(Schema.String), Schema.Boolean),
            ).pipe(T.JsonName("run_worker_first")),
            serveDirectly: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("serve_directly"),
            ),
          }),
        ),
        jwt: Schema.optional(Schema.String),
      }),
    ),
    bindings: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("ai"),
          }),
          Schema.Struct({
            dataset: Schema.String,
            name: Schema.String,
            type: Schema.Literal("analytics_engine"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("assets"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("browser"),
          }),
          Schema.Struct({
            id: Schema.String,
            name: Schema.String,
            type: Schema.Literal("d1"),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("data_blob"),
          }),
          Schema.Struct({
            name: Schema.String,
            namespace: Schema.String,
            type: Schema.Literal("dispatch_namespace"),
            outbound: Schema.optional(
              Schema.Struct({
                params: Schema.optional(Schema.Array(Schema.String)),
                worker: Schema.optional(
                  Schema.Struct({
                    environment: Schema.optional(Schema.String),
                    service: Schema.optional(Schema.String),
                  }),
                ),
              }),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("durable_object_namespace"),
            className: Schema.optional(Schema.String).pipe(
              T.JsonName("class_name"),
            ),
            environment: Schema.optional(Schema.String),
            namespaceId: Schema.optional(Schema.String).pipe(
              T.JsonName("namespace_id"),
            ),
            scriptName: Schema.optional(Schema.String).pipe(
              T.JsonName("script_name"),
            ),
          }),
          Schema.Struct({
            id: Schema.String,
            name: Schema.String,
            type: Schema.Literal("hyperdrive"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("inherit"),
            oldName: Schema.optional(Schema.String).pipe(
              T.JsonName("old_name"),
            ),
            versionId: Schema.optional(Schema.String).pipe(
              T.JsonName("version_id"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("images"),
          }),
          Schema.Struct({
            json: Schema.String,
            name: Schema.String,
            type: Schema.Literal("json"),
          }),
          Schema.Struct({
            name: Schema.String,
            namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
            type: Schema.Literal("kv_namespace"),
          }),
          Schema.Struct({
            certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
            name: Schema.String,
            type: Schema.Literal("mtls_certificate"),
          }),
          Schema.Struct({
            name: Schema.String,
            text: Schema.String,
            type: Schema.Literal("plain_text"),
          }),
          Schema.Struct({
            name: Schema.String,
            pipeline: Schema.String,
            type: Schema.Literal("pipelines"),
          }),
          Schema.Struct({
            name: Schema.String,
            queueName: Schema.String.pipe(T.JsonName("queue_name")),
            type: Schema.Literal("queue"),
          }),
          Schema.Struct({
            bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
            name: Schema.String,
            type: Schema.Literal("r2_bucket"),
            jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
          }),
          Schema.Struct({
            name: Schema.String,
            text: Schema.String,
            type: Schema.Literal("secret_text"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("send_email"),
            allowedDestinationAddresses: Schema.optional(
              Schema.Array(Schema.String),
            ).pipe(T.JsonName("allowed_destination_addresses")),
            allowedSenderAddresses: Schema.optional(
              Schema.Array(Schema.String),
            ).pipe(T.JsonName("allowed_sender_addresses")),
            destinationAddress: Schema.optional(Schema.String).pipe(
              T.JsonName("destination_address"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            service: Schema.String,
            type: Schema.Literal("service"),
            environment: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            name: Schema.String,
            service: Schema.String,
            type: Schema.Literal("tail_consumer"),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("text_blob"),
          }),
          Schema.Struct({
            indexName: Schema.String.pipe(T.JsonName("index_name")),
            name: Schema.String,
            type: Schema.Literal("vectorize"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("version_metadata"),
          }),
          Schema.Struct({
            name: Schema.String,
            secretName: Schema.String.pipe(T.JsonName("secret_name")),
            storeId: Schema.String.pipe(T.JsonName("store_id")),
            type: Schema.Literal("secrets_store_secret"),
          }),
          Schema.Struct({
            algorithm: Schema.Unknown,
            format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
            name: Schema.String,
            type: Schema.Literal("secret_key"),
            usages: Schema.Array(
              Schema.Literal(
                "encrypt",
                "decrypt",
                "sign",
                "verify",
                "deriveKey",
                "deriveBits",
                "wrapKey",
                "unwrapKey",
              ),
            ),
            keyBase64: Schema.optional(Schema.String).pipe(
              T.JsonName("key_base64"),
            ),
            keyJwk: Schema.optional(Schema.Unknown).pipe(T.JsonName("key_jwk")),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("workflow"),
            workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
            className: Schema.optional(Schema.String).pipe(
              T.JsonName("class_name"),
            ),
            scriptName: Schema.optional(Schema.String).pipe(
              T.JsonName("script_name"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("wasm_module"),
          }),
        ),
      ),
    ),
    bodyPart: Schema.optional(Schema.String).pipe(T.JsonName("body_part")),
    compatibilityDate: Schema.optional(Schema.String).pipe(
      T.JsonName("compatibility_date"),
    ),
    compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("compatibility_flags"),
    ),
    keepAssets: Schema.optional(Schema.Boolean).pipe(T.JsonName("keep_assets")),
    keepBindings: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("keep_bindings"),
    ),
    limits: Schema.optional(
      Schema.Struct({
        cpuMs: Schema.optional(Schema.Number).pipe(T.JsonName("cpu_ms")),
      }),
    ),
    logpush: Schema.optional(Schema.Boolean),
    mainModule: Schema.optional(Schema.String).pipe(T.JsonName("main_module")),
    migrations: Schema.optional(
      Schema.Union(
        Schema.Unknown,
        Schema.Struct({
          newTag: Schema.optional(Schema.String).pipe(T.JsonName("new_tag")),
          oldTag: Schema.optional(Schema.String).pipe(T.JsonName("old_tag")),
          steps: Schema.optional(Schema.Array(Schema.Unknown)),
        }),
      ),
    ),
    observability: Schema.optional(
      Schema.Struct({
        enabled: Schema.Boolean,
        headSamplingRate: Schema.optional(
          Schema.Union(Schema.Number, Schema.Null),
        ).pipe(T.JsonName("head_sampling_rate")),
        logs: Schema.optional(
          Schema.Union(
            Schema.Struct({
              enabled: Schema.Boolean,
              invocationLogs: Schema.Boolean.pipe(
                T.JsonName("invocation_logs"),
              ),
              destinations: Schema.optional(Schema.Array(Schema.String)),
              headSamplingRate: Schema.optional(
                Schema.Union(Schema.Number, Schema.Null),
              ).pipe(T.JsonName("head_sampling_rate")),
              persist: Schema.optional(Schema.Boolean),
            }),
            Schema.Null,
          ),
        ),
      }),
    ),
    placement: Schema.optional(
      Schema.Struct({
        mode: Schema.optional(Schema.Literal("smart")),
      }),
    ),
    tags: Schema.optional(Schema.Array(Schema.String)),
    tailConsumers: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
      T.JsonName("tail_consumers"),
    ),
    usageModel: Schema.optional(
      Schema.Literal("standard", "bundled", "unbound"),
    ).pipe(T.JsonName("usage_model")),
  }),
  files: Schema.optional(
    Schema.Array(UploadableSchema.pipe(T.HttpFormDataFile())),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}",
    contentType: "multipart",
  }),
) as unknown as Schema.Schema<PutScriptRequest>;

export interface PutScriptResponse {
  startupTimeMs: number;
  /** The id of the script in the Workers system. Usually the script name. */
  id?: string;
  /** Date indicating targeted support in the Workers runtime. Backwards incompatible fixes to the runtime following this date will not affect this Worker. */
  compatibilityDate?: string;
  /** Flags that enable or disable certain features in the Workers runtime. Used to enable upcoming features or opt in or out of specific changes not included in a `compatibility_date`. */
  compatibilityFlags?: string[];
  /** When the script was created. */
  createdOn?: string;
  /** Hashed script content, can be used in a If-None-Match header when updating. */
  etag?: string;
  /** The names of handlers exported as part of the default export. */
  handlers?: string[];
  /** Whether a Worker contains assets. */
  hasAssets?: boolean;
  /** Whether a Worker contains modules. */
  hasModules?: boolean;
  /** The client most recently used to deploy this Worker. */
  lastDeployedFrom?: string;
  /** Whether Logpush is turned on for the Worker. */
  logpush?: boolean;
  /** The tag of the Durable Object migration that was most recently applied for this Worker. */
  migrationTag?: string;
  /** When the script was last modified. */
  modifiedOn?: string;
  /** Named exports, such as Durable Object class implementations and named entrypoints. */
  namedHandlers?: { handlers?: string[]; name?: string }[];
  /** Configuration for [Smart Placement](https://developers.cloudflare.com/workers/configuration/smart-placement). */
  placement?: {
    lastAnalyzedAt?: string;
    mode?: "smart";
    status?: "SUCCESS" | "UNSUPPORTED_APPLICATION" | "INSUFFICIENT_INVOCATIONS";
  };
  /** @deprecated */
  placementMode?: "smart";
  /** @deprecated */
  placementStatus?:
    | "SUCCESS"
    | "UNSUPPORTED_APPLICATION"
    | "INSUFFICIENT_INVOCATIONS";
  /** List of Workers that will consume logs from the attached Worker. */
  tailConsumers?: unknown[];
  /** Usage model for the Worker invocations. */
  usageModel?: "standard" | "bundled" | "unbound";
}

export const PutScriptResponse = Schema.Struct({
  startupTimeMs: Schema.Number.pipe(T.JsonName("startup_time_ms")),
  id: Schema.optional(Schema.String),
  compatibilityDate: Schema.optional(Schema.String).pipe(
    T.JsonName("compatibility_date"),
  ),
  compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("compatibility_flags"),
  ),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  etag: Schema.optional(Schema.String),
  handlers: Schema.optional(Schema.Array(Schema.String)),
  hasAssets: Schema.optional(Schema.Boolean).pipe(T.JsonName("has_assets")),
  hasModules: Schema.optional(Schema.Boolean).pipe(T.JsonName("has_modules")),
  lastDeployedFrom: Schema.optional(Schema.String).pipe(
    T.JsonName("last_deployed_from"),
  ),
  logpush: Schema.optional(Schema.Boolean),
  migrationTag: Schema.optional(Schema.String).pipe(
    T.JsonName("migration_tag"),
  ),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  namedHandlers: Schema.optional(
    Schema.Array(
      Schema.Struct({
        handlers: Schema.optional(Schema.Array(Schema.String)),
        name: Schema.optional(Schema.String),
      }),
    ),
  ).pipe(T.JsonName("named_handlers")),
  placement: Schema.optional(
    Schema.Struct({
      lastAnalyzedAt: Schema.optional(Schema.String).pipe(
        T.JsonName("last_analyzed_at"),
      ),
      mode: Schema.optional(Schema.Literal("smart")),
      status: Schema.optional(
        Schema.Literal(
          "SUCCESS",
          "UNSUPPORTED_APPLICATION",
          "INSUFFICIENT_INVOCATIONS",
        ),
      ),
    }),
  ),
  placementMode: Schema.optional(Schema.Literal("smart")).pipe(
    T.JsonName("placement_mode"),
  ),
  placementStatus: Schema.optional(
    Schema.Literal(
      "SUCCESS",
      "UNSUPPORTED_APPLICATION",
      "INSUFFICIENT_INVOCATIONS",
    ),
  ).pipe(T.JsonName("placement_status")),
  tailConsumers: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
    T.JsonName("tail_consumers"),
  ),
  usageModel: Schema.optional(
    Schema.Literal("standard", "bundled", "unbound"),
  ).pipe(T.JsonName("usage_model")),
}) as unknown as Schema.Schema<PutScriptResponse>;

export const putScript: (
  input: PutScriptRequest,
) => Effect.Effect<
  PutScriptResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutScriptRequest,
  output: PutScriptResponse,
  errors: [],
}));

export interface DeleteScriptRequest {
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: If set to true, delete will not be stopped by associated service binding, durable object, or other binding. Any of these associated bindings/durable objects will be deleted along with the */
  force?: boolean;
}

export const DeleteScriptRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  force: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("force")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}",
  }),
) as unknown as Schema.Schema<DeleteScriptRequest>;

export type DeleteScriptResponse = unknown;

export const DeleteScriptResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteScriptResponse>;

export const deleteScript: (
  input: DeleteScriptRequest,
) => Effect.Effect<
  DeleteScriptResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteScriptRequest,
  output: DeleteScriptResponse,
  errors: [],
}));

export interface SearchScriptRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: Worker ID (also called tag) to search for. Only exact matches are returned. */
  id?: string;
  /** Query param: Worker name to search for. Both exact and partial matches are returned. */
  name?: string;
  /** Query param: Property to sort results by. Results are sorted in ascending order. */
  orderBy?: "created_on" | "modified_on" | "name";
  /** Query param: Current page. */
  page?: number;
  /** Query param: Items per page. */
  perPage?: number;
}

export const SearchScriptRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.optional(Schema.String).pipe(T.HttpQuery("id")),
  name: Schema.optional(Schema.String).pipe(T.HttpQuery("name")),
  orderBy: Schema.optional(
    Schema.Literal("created_on", "modified_on", "name"),
  ).pipe(T.HttpQuery("order_by")),
  page: Schema.optional(Schema.Number).pipe(T.HttpQuery("page")),
  perPage: Schema.optional(Schema.Number).pipe(T.HttpQuery("per_page")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts-search",
  }),
) as unknown as Schema.Schema<SearchScriptRequest>;

export type SearchScriptResponse = {
  createdOn: string;
  modifiedOn: string;
  scriptName: string;
  scriptTag: string;
  environmentIsDefault?: boolean;
  environmentName?: string;
  serviceName?: string;
}[];

export const SearchScriptResponse = Schema.Array(
  Schema.Struct({
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    scriptName: Schema.String.pipe(T.JsonName("script_name")),
    scriptTag: Schema.String.pipe(T.JsonName("script_tag")),
    environmentIsDefault: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("environment_is_default"),
    ),
    environmentName: Schema.optional(Schema.String).pipe(
      T.JsonName("environment_name"),
    ),
    serviceName: Schema.optional(Schema.String).pipe(
      T.JsonName("service_name"),
    ),
  }),
) as unknown as Schema.Schema<SearchScriptResponse>;

export const searchScript: (
  input: SearchScriptRequest,
) => Effect.Effect<
  SearchScriptResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: SearchScriptRequest,
  output: SearchScriptResponse,
  errors: [],
}));

// =============================================================================
// ScriptAssetUpload
// =============================================================================

export interface CreateScriptAssetUploadRequest {
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: A manifest ([path]: {hash, size}) map of files to upload. As an example, `/blog/hello-world.html` would be a valid path key. */
  manifest: Record<string, unknown>;
}

export const CreateScriptAssetUploadRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  manifest: Schema.Struct({}),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/assets-upload-session",
  }),
) as unknown as Schema.Schema<CreateScriptAssetUploadRequest>;

export interface CreateScriptAssetUploadResponse {
  /** The requests to make to upload assets. */
  buckets?: string[][];
  /** A JWT to use as authentication for uploading assets. */
  jwt?: string;
}

export const CreateScriptAssetUploadResponse = Schema.Struct({
  buckets: Schema.optional(Schema.Array(Schema.Array(Schema.String))),
  jwt: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateScriptAssetUploadResponse>;

export const createScriptAssetUpload: (
  input: CreateScriptAssetUploadRequest,
) => Effect.Effect<
  CreateScriptAssetUploadResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateScriptAssetUploadRequest,
  output: CreateScriptAssetUploadResponse,
  errors: [],
}));

// =============================================================================
// ScriptContent
// =============================================================================

export interface GetScriptContentRequest {
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const GetScriptContentRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/content/v2",
  }),
) as unknown as Schema.Schema<GetScriptContentRequest>;

export type GetScriptContentResponse = unknown;

export const GetScriptContentResponse =
  Schema.Unknown as unknown as Schema.Schema<GetScriptContentResponse>;

export const getScriptContent: (
  input: GetScriptContentRequest,
) => Effect.Effect<
  GetScriptContentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScriptContentRequest,
  output: GetScriptContentResponse,
  errors: [],
}));

export interface PutScriptContentRequest {
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Header param: The multipart name of a script upload part containing script content in service worker format. Alternative to including in a metadata part. */
  "CF-WORKER-BODY-PART"?: string;
  /** Header param: The multipart name of a script upload part containing script content in es module format. Alternative to including in a metadata part. */
  "CF-WORKER-MAIN-MODULE-PART"?: string;
  /** Body param: JSON-encoded metadata about the uploaded parts and Worker configuration. */
  metadata: { bodyPart?: string; mainModule?: string };
  /** Body param: An array of modules (often JavaScript files) comprising a Worker script. At least one module must be present and referenced in the metadata as `main_module` or `body_part` by filename.<br/ */
  files?: (File | Blob)[];
}

export const PutScriptContentRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  "CF-WORKER-BODY-PART": Schema.optional(Schema.String).pipe(
    T.HttpHeader("'CF-WORKER-BODY-PART'"),
  ),
  "CF-WORKER-MAIN-MODULE-PART": Schema.optional(Schema.String).pipe(
    T.HttpHeader("'CF-WORKER-MAIN-MODULE-PART'"),
  ),
  metadata: Schema.Struct({
    bodyPart: Schema.optional(Schema.String).pipe(T.JsonName("body_part")),
    mainModule: Schema.optional(Schema.String).pipe(T.JsonName("main_module")),
  }),
  files: Schema.optional(
    Schema.Array(UploadableSchema.pipe(T.HttpFormDataFile())),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/content",
    contentType: "multipart",
  }),
) as unknown as Schema.Schema<PutScriptContentRequest>;

export type PutScriptContentResponse = unknown;

export const PutScriptContentResponse =
  Schema.Unknown as unknown as Schema.Schema<PutScriptContentResponse>;

export const putScriptContent: (
  input: PutScriptContentRequest,
) => Effect.Effect<
  PutScriptContentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutScriptContentRequest,
  output: PutScriptContentResponse,
  errors: [],
}));

// =============================================================================
// ScriptDeployment
// =============================================================================

export interface GetScriptDeploymentRequest {
  scriptName: string;
  deploymentId: string;
  /** Identifier. */
  accountId: string;
}

export const GetScriptDeploymentRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  deploymentId: Schema.String.pipe(T.HttpPath("deploymentId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/deployments/{deploymentId}",
  }),
) as unknown as Schema.Schema<GetScriptDeploymentRequest>;

export interface GetScriptDeploymentResponse {
  id: string;
  createdOn: string;
  source: string;
  strategy: "percentage";
  versions: { percentage: number; versionId: string }[];
  annotations?: { "workers/message"?: string; "workers/triggeredBy"?: string };
  authorEmail?: string;
}

export const GetScriptDeploymentResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  source: Schema.String,
  strategy: Schema.Literal("percentage"),
  versions: Schema.Array(
    Schema.Struct({
      percentage: Schema.Number,
      versionId: Schema.String.pipe(T.JsonName("version_id")),
    }),
  ),
  annotations: Schema.optional(
    Schema.Struct({
      "workers/message": Schema.optional(Schema.String),
      "workers/triggeredBy": Schema.optional(Schema.String).pipe(
        T.JsonName("'workers/triggered_by'"),
      ),
    }),
  ),
  authorEmail: Schema.optional(Schema.String).pipe(T.JsonName("author_email")),
}) as unknown as Schema.Schema<GetScriptDeploymentResponse>;

export const getScriptDeployment: (
  input: GetScriptDeploymentRequest,
) => Effect.Effect<
  GetScriptDeploymentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScriptDeploymentRequest,
  output: GetScriptDeploymentResponse,
  errors: [],
}));

export interface ListScriptDeploymentsRequest {
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const ListScriptDeploymentsRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/deployments",
  }),
) as unknown as Schema.Schema<ListScriptDeploymentsRequest>;

export interface ListScriptDeploymentsResponse {
  deployments: {
    id: string;
    createdOn: string;
    source: string;
    strategy: "percentage";
    versions: { percentage: number; versionId: string }[];
    annotations?: {
      "workers/message"?: string;
      "workers/triggeredBy"?: string;
    };
    authorEmail?: string;
  }[];
}

export const ListScriptDeploymentsResponse = Schema.Struct({
  deployments: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      createdOn: Schema.String.pipe(T.JsonName("created_on")),
      source: Schema.String,
      strategy: Schema.Literal("percentage"),
      versions: Schema.Array(
        Schema.Struct({
          percentage: Schema.Number,
          versionId: Schema.String.pipe(T.JsonName("version_id")),
        }),
      ),
      annotations: Schema.optional(
        Schema.Struct({
          "workers/message": Schema.optional(Schema.String),
          "workers/triggeredBy": Schema.optional(Schema.String).pipe(
            T.JsonName("'workers/triggered_by'"),
          ),
        }),
      ),
      authorEmail: Schema.optional(Schema.String).pipe(
        T.JsonName("author_email"),
      ),
    }),
  ),
}) as unknown as Schema.Schema<ListScriptDeploymentsResponse>;

export const listScriptDeployments: (
  input: ListScriptDeploymentsRequest,
) => Effect.Effect<
  ListScriptDeploymentsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListScriptDeploymentsRequest,
  output: ListScriptDeploymentsResponse,
  errors: [],
}));

export interface CreateScriptDeploymentRequest {
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: If set to true, the deployment will be created even if normally blocked by something such rolling back to an older version when a secret has changed. */
  force?: boolean;
  /** Body param: */
  strategy: "percentage";
  /** Body param: */
  versions: { percentage: number; versionId: string }[];
  /** Body param: */
  annotations?: { "workers/message"?: string };
}

export const CreateScriptDeploymentRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  force: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("force")),
  strategy: Schema.Literal("percentage"),
  versions: Schema.Array(
    Schema.Struct({
      percentage: Schema.Number,
      versionId: Schema.String.pipe(T.JsonName("version_id")),
    }),
  ),
  annotations: Schema.optional(
    Schema.Struct({
      "workers/message": Schema.optional(Schema.String),
    }),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/deployments",
  }),
) as unknown as Schema.Schema<CreateScriptDeploymentRequest>;

export interface CreateScriptDeploymentResponse {
  id: string;
  createdOn: string;
  source: string;
  strategy: "percentage";
  versions: { percentage: number; versionId: string }[];
  annotations?: { "workers/message"?: string; "workers/triggeredBy"?: string };
  authorEmail?: string;
}

export const CreateScriptDeploymentResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  source: Schema.String,
  strategy: Schema.Literal("percentage"),
  versions: Schema.Array(
    Schema.Struct({
      percentage: Schema.Number,
      versionId: Schema.String.pipe(T.JsonName("version_id")),
    }),
  ),
  annotations: Schema.optional(
    Schema.Struct({
      "workers/message": Schema.optional(Schema.String),
      "workers/triggeredBy": Schema.optional(Schema.String).pipe(
        T.JsonName("'workers/triggered_by'"),
      ),
    }),
  ),
  authorEmail: Schema.optional(Schema.String).pipe(T.JsonName("author_email")),
}) as unknown as Schema.Schema<CreateScriptDeploymentResponse>;

export const createScriptDeployment: (
  input: CreateScriptDeploymentRequest,
) => Effect.Effect<
  CreateScriptDeploymentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateScriptDeploymentRequest,
  output: CreateScriptDeploymentResponse,
  errors: [],
}));

export interface DeleteScriptDeploymentRequest {
  scriptName: string;
  deploymentId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteScriptDeploymentRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  deploymentId: Schema.String.pipe(T.HttpPath("deploymentId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/deployments/{deploymentId}",
  }),
) as unknown as Schema.Schema<DeleteScriptDeploymentRequest>;

export interface DeleteScriptDeploymentResponse {
  errors: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  messages: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  /** Whether the API call was successful. */
  success: true;
}

export const DeleteScriptDeploymentResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<DeleteScriptDeploymentResponse>;

export const deleteScriptDeployment: (
  input: DeleteScriptDeploymentRequest,
) => Effect.Effect<
  DeleteScriptDeploymentResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteScriptDeploymentRequest,
  output: DeleteScriptDeploymentResponse,
  errors: [],
}));

// =============================================================================
// ScriptSchedule
// =============================================================================

export interface GetScriptScheduleRequest {
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const GetScriptScheduleRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/schedules",
  }),
) as unknown as Schema.Schema<GetScriptScheduleRequest>;

export interface GetScriptScheduleResponse {
  schedules: { cron: string; createdOn?: string; modifiedOn?: string }[];
}

export const GetScriptScheduleResponse = Schema.Struct({
  schedules: Schema.Array(
    Schema.Struct({
      cron: Schema.String,
      createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
      modifiedOn: Schema.optional(Schema.String).pipe(
        T.JsonName("modified_on"),
      ),
    }),
  ),
}) as unknown as Schema.Schema<GetScriptScheduleResponse>;

export const getScriptSchedule: (
  input: GetScriptScheduleRequest,
) => Effect.Effect<
  GetScriptScheduleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScriptScheduleRequest,
  output: GetScriptScheduleResponse,
  errors: [],
}));

export interface PutScriptScheduleRequest {
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  body: { cron: string }[];
}

export const PutScriptScheduleRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Array(
    Schema.Struct({
      cron: Schema.String,
    }),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/schedules",
  }),
) as unknown as Schema.Schema<PutScriptScheduleRequest>;

export interface PutScriptScheduleResponse {
  schedules: { cron: string; createdOn?: string; modifiedOn?: string }[];
}

export const PutScriptScheduleResponse = Schema.Struct({
  schedules: Schema.Array(
    Schema.Struct({
      cron: Schema.String,
      createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
      modifiedOn: Schema.optional(Schema.String).pipe(
        T.JsonName("modified_on"),
      ),
    }),
  ),
}) as unknown as Schema.Schema<PutScriptScheduleResponse>;

export const putScriptSchedule: (
  input: PutScriptScheduleRequest,
) => Effect.Effect<
  PutScriptScheduleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutScriptScheduleRequest,
  output: PutScriptScheduleResponse,
  errors: [],
}));

// =============================================================================
// ScriptScriptAndVersionSetting
// =============================================================================

export interface GetScriptScriptAndVersionSettingRequest {
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const GetScriptScriptAndVersionSettingRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/settings",
  }),
) as unknown as Schema.Schema<GetScriptScriptAndVersionSettingRequest>;

export interface GetScriptScriptAndVersionSettingResponse {
  /** List of bindings attached to a Worker. You can find more about bindings on our docs: https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/#bindings. */
  bindings?: (
    | { name: string; type: "ai" }
    | { dataset: string; name: string; type: "analytics_engine" }
    | { name: string; type: "assets" }
    | { name: string; type: "browser" }
    | { id: string; name: string; type: "d1" }
    | { name: string; part: string; type: "data_blob" }
    | {
        name: string;
        namespace: string;
        type: "dispatch_namespace";
        outbound?: {
          params?: string[];
          worker?: { environment?: string; service?: string };
        };
      }
    | {
        name: string;
        type: "durable_object_namespace";
        className?: string;
        environment?: string;
        namespaceId?: string;
        scriptName?: string;
      }
    | { id: string; name: string; type: "hyperdrive" }
    | { name: string; type: "inherit"; oldName?: string; versionId?: string }
    | { name: string; type: "images" }
    | { json: string; name: string; type: "json" }
    | { name: string; namespaceId: string; type: "kv_namespace" }
    | { certificateId: string; name: string; type: "mtls_certificate" }
    | { name: string; text: string; type: "plain_text" }
    | { name: string; pipeline: string; type: "pipelines" }
    | { name: string; queueName: string; type: "queue" }
    | {
        bucketName: string;
        name: string;
        type: "r2_bucket";
        jurisdiction?: "eu" | "fedramp";
      }
    | { name: string; type: "secret_text" }
    | {
        name: string;
        type: "send_email";
        allowedDestinationAddresses?: string[];
        allowedSenderAddresses?: string[];
        destinationAddress?: string;
      }
    | { name: string; service: string; type: "service"; environment?: string }
    | { name: string; service: string; type: "tail_consumer" }
    | { name: string; part: string; type: "text_blob" }
    | { indexName: string; name: string; type: "vectorize" }
    | { name: string; type: "version_metadata" }
    | {
        name: string;
        secretName: string;
        storeId: string;
        type: "secrets_store_secret";
      }
    | {
        algorithm: unknown;
        format: "raw" | "pkcs8" | "spki" | "jwk";
        name: string;
        type: "secret_key";
        usages: (
          | "encrypt"
          | "decrypt"
          | "sign"
          | "verify"
          | "deriveKey"
          | "deriveBits"
          | "wrapKey"
          | "unwrapKey"
        )[];
      }
    | {
        name: string;
        type: "workflow";
        workflowName: string;
        className?: string;
        scriptName?: string;
      }
    | { name: string; part: string; type: "wasm_module" }
  )[];
  /** Date indicating targeted support in the Workers runtime. Backwards incompatible fixes to the runtime following this date will not affect this Worker. */
  compatibilityDate?: string;
  /** Flags that enable or disable certain features in the Workers runtime. Used to enable upcoming features or opt in or out of specific changes not included in a `compatibility_date`. */
  compatibilityFlags?: string[];
  /** Limits to apply for this Worker. */
  limits?: { cpuMs?: number };
  /** Whether Logpush is turned on for the Worker. */
  logpush?: boolean;
  /** Observability settings for the Worker. */
  observability?: {
    enabled: boolean;
    headSamplingRate?: number | null;
    logs?: {
      enabled: boolean;
      invocationLogs: boolean;
      destinations?: string[];
      headSamplingRate?: number | null;
      persist?: boolean;
    } | null;
  };
  /** Configuration for [Smart Placement](https://developers.cloudflare.com/workers/configuration/smart-placement). */
  placement?: { mode?: "smart" };
  /** Tags associated with the Worker. */
  tags?: string[];
  /** List of Workers that will consume logs from the attached Worker. */
  tailConsumers?: unknown[];
  /** Usage model for the Worker invocations. */
  usageModel?: "standard" | "bundled" | "unbound";
}

export const GetScriptScriptAndVersionSettingResponse = Schema.Struct({
  bindings: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("ai"),
        }),
        Schema.Struct({
          dataset: Schema.String,
          name: Schema.String,
          type: Schema.Literal("analytics_engine"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("assets"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("browser"),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("d1"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("data_blob"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespace: Schema.String,
          type: Schema.Literal("dispatch_namespace"),
          outbound: Schema.optional(
            Schema.Struct({
              params: Schema.optional(Schema.Array(Schema.String)),
              worker: Schema.optional(
                Schema.Struct({
                  environment: Schema.optional(Schema.String),
                  service: Schema.optional(Schema.String),
                }),
              ),
            }),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("durable_object_namespace"),
          className: Schema.optional(Schema.String).pipe(
            T.JsonName("class_name"),
          ),
          environment: Schema.optional(Schema.String),
          namespaceId: Schema.optional(Schema.String).pipe(
            T.JsonName("namespace_id"),
          ),
          scriptName: Schema.optional(Schema.String).pipe(
            T.JsonName("script_name"),
          ),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("hyperdrive"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("inherit"),
          oldName: Schema.optional(Schema.String).pipe(T.JsonName("old_name")),
          versionId: Schema.optional(Schema.String).pipe(
            T.JsonName("version_id"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("images"),
        }),
        Schema.Struct({
          json: Schema.String,
          name: Schema.String,
          type: Schema.Literal("json"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
          type: Schema.Literal("kv_namespace"),
        }),
        Schema.Struct({
          certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
          name: Schema.String,
          type: Schema.Literal("mtls_certificate"),
        }),
        Schema.Struct({
          name: Schema.String,
          text: Schema.String,
          type: Schema.Literal("plain_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          pipeline: Schema.String,
          type: Schema.Literal("pipelines"),
        }),
        Schema.Struct({
          name: Schema.String,
          queueName: Schema.String.pipe(T.JsonName("queue_name")),
          type: Schema.Literal("queue"),
        }),
        Schema.Struct({
          bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
          name: Schema.String,
          type: Schema.Literal("r2_bucket"),
          jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("secret_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("send_email"),
          allowedDestinationAddresses: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("allowed_destination_addresses")),
          allowedSenderAddresses: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("allowed_sender_addresses")),
          destinationAddress: Schema.optional(Schema.String).pipe(
            T.JsonName("destination_address"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("service"),
          environment: Schema.optional(Schema.String),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("tail_consumer"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("text_blob"),
        }),
        Schema.Struct({
          indexName: Schema.String.pipe(T.JsonName("index_name")),
          name: Schema.String,
          type: Schema.Literal("vectorize"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("version_metadata"),
        }),
        Schema.Struct({
          name: Schema.String,
          secretName: Schema.String.pipe(T.JsonName("secret_name")),
          storeId: Schema.String.pipe(T.JsonName("store_id")),
          type: Schema.Literal("secrets_store_secret"),
        }),
        Schema.Struct({
          algorithm: Schema.Unknown,
          format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
          name: Schema.String,
          type: Schema.Literal("secret_key"),
          usages: Schema.Array(
            Schema.Literal(
              "encrypt",
              "decrypt",
              "sign",
              "verify",
              "deriveKey",
              "deriveBits",
              "wrapKey",
              "unwrapKey",
            ),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("workflow"),
          workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
          className: Schema.optional(Schema.String).pipe(
            T.JsonName("class_name"),
          ),
          scriptName: Schema.optional(Schema.String).pipe(
            T.JsonName("script_name"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("wasm_module"),
        }),
      ),
    ),
  ),
  compatibilityDate: Schema.optional(Schema.String).pipe(
    T.JsonName("compatibility_date"),
  ),
  compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("compatibility_flags"),
  ),
  limits: Schema.optional(
    Schema.Struct({
      cpuMs: Schema.optional(Schema.Number).pipe(T.JsonName("cpu_ms")),
    }),
  ),
  logpush: Schema.optional(Schema.Boolean),
  observability: Schema.optional(
    Schema.Struct({
      enabled: Schema.Boolean,
      headSamplingRate: Schema.optional(
        Schema.Union(Schema.Number, Schema.Null),
      ).pipe(T.JsonName("head_sampling_rate")),
      logs: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.Boolean,
            invocationLogs: Schema.Boolean.pipe(T.JsonName("invocation_logs")),
            destinations: Schema.optional(Schema.Array(Schema.String)),
            headSamplingRate: Schema.optional(
              Schema.Union(Schema.Number, Schema.Null),
            ).pipe(T.JsonName("head_sampling_rate")),
            persist: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ),
    }),
  ),
  placement: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("smart")),
    }),
  ),
  tags: Schema.optional(Schema.Array(Schema.String)),
  tailConsumers: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
    T.JsonName("tail_consumers"),
  ),
  usageModel: Schema.optional(
    Schema.Literal("standard", "bundled", "unbound"),
  ).pipe(T.JsonName("usage_model")),
}) as unknown as Schema.Schema<GetScriptScriptAndVersionSettingResponse>;

export const getScriptScriptAndVersionSetting: (
  input: GetScriptScriptAndVersionSettingRequest,
) => Effect.Effect<
  GetScriptScriptAndVersionSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScriptScriptAndVersionSettingRequest,
  output: GetScriptScriptAndVersionSettingResponse,
  errors: [],
}));

export interface PatchScriptScriptAndVersionSettingRequest {
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  settings?: {
    bindings?: (
      | { name: string; type: "ai" }
      | { dataset: string; name: string; type: "analytics_engine" }
      | { name: string; type: "assets" }
      | { name: string; type: "browser" }
      | { id: string; name: string; type: "d1" }
      | { name: string; part: string; type: "data_blob" }
      | {
          name: string;
          namespace: string;
          type: "dispatch_namespace";
          outbound?: {
            params?: string[];
            worker?: { environment?: string; service?: string };
          };
        }
      | {
          name: string;
          type: "durable_object_namespace";
          className?: string;
          environment?: string;
          namespaceId?: string;
          scriptName?: string;
        }
      | { id: string; name: string; type: "hyperdrive" }
      | { name: string; type: "inherit"; oldName?: string; versionId?: string }
      | { name: string; type: "images" }
      | { json: string; name: string; type: "json" }
      | { name: string; namespaceId: string; type: "kv_namespace" }
      | { certificateId: string; name: string; type: "mtls_certificate" }
      | { name: string; text: string; type: "plain_text" }
      | { name: string; pipeline: string; type: "pipelines" }
      | { name: string; queueName: string; type: "queue" }
      | {
          bucketName: string;
          name: string;
          type: "r2_bucket";
          jurisdiction?: "eu" | "fedramp";
        }
      | { name: string; text: string; type: "secret_text" }
      | {
          name: string;
          type: "send_email";
          allowedDestinationAddresses?: string[];
          allowedSenderAddresses?: string[];
          destinationAddress?: string;
        }
      | { name: string; service: string; type: "service"; environment?: string }
      | { name: string; service: string; type: "tail_consumer" }
      | { name: string; part: string; type: "text_blob" }
      | { indexName: string; name: string; type: "vectorize" }
      | { name: string; type: "version_metadata" }
      | {
          name: string;
          secretName: string;
          storeId: string;
          type: "secrets_store_secret";
        }
      | {
          algorithm: unknown;
          format: "raw" | "pkcs8" | "spki" | "jwk";
          name: string;
          type: "secret_key";
          usages: (
            | "encrypt"
            | "decrypt"
            | "sign"
            | "verify"
            | "deriveKey"
            | "deriveBits"
            | "wrapKey"
            | "unwrapKey"
          )[];
          keyBase64?: string;
          keyJwk?: unknown;
        }
      | {
          name: string;
          type: "workflow";
          workflowName: string;
          className?: string;
          scriptName?: string;
        }
      | { name: string; part: string; type: "wasm_module" }
    )[];
    compatibilityDate?: string;
    compatibilityFlags?: string[];
    limits?: { cpuMs?: number };
    logpush?: boolean;
    migrations?:
      | unknown
      | { newTag?: string; oldTag?: string; steps?: unknown[] };
    observability?: {
      enabled: boolean;
      headSamplingRate?: number | null;
      logs?: {
        enabled: boolean;
        invocationLogs: boolean;
        destinations?: string[];
        headSamplingRate?: number | null;
        persist?: boolean;
      } | null;
    };
    placement?: { mode?: "smart" };
    tags?: string[];
    tailConsumers?: unknown[];
    usageModel?: "standard" | "bundled" | "unbound";
  };
}

export const PatchScriptScriptAndVersionSettingRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  settings: Schema.optional(
    Schema.Struct({
      bindings: Schema.optional(
        Schema.Array(
          Schema.Union(
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("ai"),
            }),
            Schema.Struct({
              dataset: Schema.String,
              name: Schema.String,
              type: Schema.Literal("analytics_engine"),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("assets"),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("browser"),
            }),
            Schema.Struct({
              id: Schema.String,
              name: Schema.String,
              type: Schema.Literal("d1"),
            }),
            Schema.Struct({
              name: Schema.String,
              part: Schema.String,
              type: Schema.Literal("data_blob"),
            }),
            Schema.Struct({
              name: Schema.String,
              namespace: Schema.String,
              type: Schema.Literal("dispatch_namespace"),
              outbound: Schema.optional(
                Schema.Struct({
                  params: Schema.optional(Schema.Array(Schema.String)),
                  worker: Schema.optional(
                    Schema.Struct({
                      environment: Schema.optional(Schema.String),
                      service: Schema.optional(Schema.String),
                    }),
                  ),
                }),
              ),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("durable_object_namespace"),
              className: Schema.optional(Schema.String).pipe(
                T.JsonName("class_name"),
              ),
              environment: Schema.optional(Schema.String),
              namespaceId: Schema.optional(Schema.String).pipe(
                T.JsonName("namespace_id"),
              ),
              scriptName: Schema.optional(Schema.String).pipe(
                T.JsonName("script_name"),
              ),
            }),
            Schema.Struct({
              id: Schema.String,
              name: Schema.String,
              type: Schema.Literal("hyperdrive"),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("inherit"),
              oldName: Schema.optional(Schema.String).pipe(
                T.JsonName("old_name"),
              ),
              versionId: Schema.optional(Schema.String).pipe(
                T.JsonName("version_id"),
              ),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("images"),
            }),
            Schema.Struct({
              json: Schema.String,
              name: Schema.String,
              type: Schema.Literal("json"),
            }),
            Schema.Struct({
              name: Schema.String,
              namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
              type: Schema.Literal("kv_namespace"),
            }),
            Schema.Struct({
              certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
              name: Schema.String,
              type: Schema.Literal("mtls_certificate"),
            }),
            Schema.Struct({
              name: Schema.String,
              text: Schema.String,
              type: Schema.Literal("plain_text"),
            }),
            Schema.Struct({
              name: Schema.String,
              pipeline: Schema.String,
              type: Schema.Literal("pipelines"),
            }),
            Schema.Struct({
              name: Schema.String,
              queueName: Schema.String.pipe(T.JsonName("queue_name")),
              type: Schema.Literal("queue"),
            }),
            Schema.Struct({
              bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
              name: Schema.String,
              type: Schema.Literal("r2_bucket"),
              jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
            }),
            Schema.Struct({
              name: Schema.String,
              text: Schema.String,
              type: Schema.Literal("secret_text"),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("send_email"),
              allowedDestinationAddresses: Schema.optional(
                Schema.Array(Schema.String),
              ).pipe(T.JsonName("allowed_destination_addresses")),
              allowedSenderAddresses: Schema.optional(
                Schema.Array(Schema.String),
              ).pipe(T.JsonName("allowed_sender_addresses")),
              destinationAddress: Schema.optional(Schema.String).pipe(
                T.JsonName("destination_address"),
              ),
            }),
            Schema.Struct({
              name: Schema.String,
              service: Schema.String,
              type: Schema.Literal("service"),
              environment: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              name: Schema.String,
              service: Schema.String,
              type: Schema.Literal("tail_consumer"),
            }),
            Schema.Struct({
              name: Schema.String,
              part: Schema.String,
              type: Schema.Literal("text_blob"),
            }),
            Schema.Struct({
              indexName: Schema.String.pipe(T.JsonName("index_name")),
              name: Schema.String,
              type: Schema.Literal("vectorize"),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("version_metadata"),
            }),
            Schema.Struct({
              name: Schema.String,
              secretName: Schema.String.pipe(T.JsonName("secret_name")),
              storeId: Schema.String.pipe(T.JsonName("store_id")),
              type: Schema.Literal("secrets_store_secret"),
            }),
            Schema.Struct({
              algorithm: Schema.Unknown,
              format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
              name: Schema.String,
              type: Schema.Literal("secret_key"),
              usages: Schema.Array(
                Schema.Literal(
                  "encrypt",
                  "decrypt",
                  "sign",
                  "verify",
                  "deriveKey",
                  "deriveBits",
                  "wrapKey",
                  "unwrapKey",
                ),
              ),
              keyBase64: Schema.optional(Schema.String).pipe(
                T.JsonName("key_base64"),
              ),
              keyJwk: Schema.optional(Schema.Unknown).pipe(
                T.JsonName("key_jwk"),
              ),
            }),
            Schema.Struct({
              name: Schema.String,
              type: Schema.Literal("workflow"),
              workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
              className: Schema.optional(Schema.String).pipe(
                T.JsonName("class_name"),
              ),
              scriptName: Schema.optional(Schema.String).pipe(
                T.JsonName("script_name"),
              ),
            }),
            Schema.Struct({
              name: Schema.String,
              part: Schema.String,
              type: Schema.Literal("wasm_module"),
            }),
          ),
        ),
      ),
      compatibilityDate: Schema.optional(Schema.String).pipe(
        T.JsonName("compatibility_date"),
      ),
      compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("compatibility_flags"),
      ),
      limits: Schema.optional(
        Schema.Struct({
          cpuMs: Schema.optional(Schema.Number).pipe(T.JsonName("cpu_ms")),
        }),
      ),
      logpush: Schema.optional(Schema.Boolean),
      migrations: Schema.optional(
        Schema.Union(
          Schema.Unknown,
          Schema.Struct({
            newTag: Schema.optional(Schema.String).pipe(T.JsonName("new_tag")),
            oldTag: Schema.optional(Schema.String).pipe(T.JsonName("old_tag")),
            steps: Schema.optional(Schema.Array(Schema.Unknown)),
          }),
        ),
      ),
      observability: Schema.optional(
        Schema.Struct({
          enabled: Schema.Boolean,
          headSamplingRate: Schema.optional(
            Schema.Union(Schema.Number, Schema.Null),
          ).pipe(T.JsonName("head_sampling_rate")),
          logs: Schema.optional(
            Schema.Union(
              Schema.Struct({
                enabled: Schema.Boolean,
                invocationLogs: Schema.Boolean.pipe(
                  T.JsonName("invocation_logs"),
                ),
                destinations: Schema.optional(Schema.Array(Schema.String)),
                headSamplingRate: Schema.optional(
                  Schema.Union(Schema.Number, Schema.Null),
                ).pipe(T.JsonName("head_sampling_rate")),
                persist: Schema.optional(Schema.Boolean),
              }),
              Schema.Null,
            ),
          ),
        }),
      ),
      placement: Schema.optional(
        Schema.Struct({
          mode: Schema.optional(Schema.Literal("smart")),
        }),
      ),
      tags: Schema.optional(Schema.Array(Schema.String)),
      tailConsumers: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
        T.JsonName("tail_consumers"),
      ),
      usageModel: Schema.optional(
        Schema.Literal("standard", "bundled", "unbound"),
      ).pipe(T.JsonName("usage_model")),
    }),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/settings",
  }),
) as unknown as Schema.Schema<PatchScriptScriptAndVersionSettingRequest>;

export interface PatchScriptScriptAndVersionSettingResponse {
  /** List of bindings attached to a Worker. You can find more about bindings on our docs: https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/#bindings. */
  bindings?: (
    | { name: string; type: "ai" }
    | { dataset: string; name: string; type: "analytics_engine" }
    | { name: string; type: "assets" }
    | { name: string; type: "browser" }
    | { id: string; name: string; type: "d1" }
    | { name: string; part: string; type: "data_blob" }
    | {
        name: string;
        namespace: string;
        type: "dispatch_namespace";
        outbound?: {
          params?: string[];
          worker?: { environment?: string; service?: string };
        };
      }
    | {
        name: string;
        type: "durable_object_namespace";
        className?: string;
        environment?: string;
        namespaceId?: string;
        scriptName?: string;
      }
    | { id: string; name: string; type: "hyperdrive" }
    | { name: string; type: "inherit"; oldName?: string; versionId?: string }
    | { name: string; type: "images" }
    | { json: string; name: string; type: "json" }
    | { name: string; namespaceId: string; type: "kv_namespace" }
    | { certificateId: string; name: string; type: "mtls_certificate" }
    | { name: string; text: string; type: "plain_text" }
    | { name: string; pipeline: string; type: "pipelines" }
    | { name: string; queueName: string; type: "queue" }
    | {
        bucketName: string;
        name: string;
        type: "r2_bucket";
        jurisdiction?: "eu" | "fedramp";
      }
    | { name: string; type: "secret_text" }
    | {
        name: string;
        type: "send_email";
        allowedDestinationAddresses?: string[];
        allowedSenderAddresses?: string[];
        destinationAddress?: string;
      }
    | { name: string; service: string; type: "service"; environment?: string }
    | { name: string; service: string; type: "tail_consumer" }
    | { name: string; part: string; type: "text_blob" }
    | { indexName: string; name: string; type: "vectorize" }
    | { name: string; type: "version_metadata" }
    | {
        name: string;
        secretName: string;
        storeId: string;
        type: "secrets_store_secret";
      }
    | {
        algorithm: unknown;
        format: "raw" | "pkcs8" | "spki" | "jwk";
        name: string;
        type: "secret_key";
        usages: (
          | "encrypt"
          | "decrypt"
          | "sign"
          | "verify"
          | "deriveKey"
          | "deriveBits"
          | "wrapKey"
          | "unwrapKey"
        )[];
      }
    | {
        name: string;
        type: "workflow";
        workflowName: string;
        className?: string;
        scriptName?: string;
      }
    | { name: string; part: string; type: "wasm_module" }
  )[];
  /** Date indicating targeted support in the Workers runtime. Backwards incompatible fixes to the runtime following this date will not affect this Worker. */
  compatibilityDate?: string;
  /** Flags that enable or disable certain features in the Workers runtime. Used to enable upcoming features or opt in or out of specific changes not included in a `compatibility_date`. */
  compatibilityFlags?: string[];
  /** Limits to apply for this Worker. */
  limits?: { cpuMs?: number };
  /** Whether Logpush is turned on for the Worker. */
  logpush?: boolean;
  /** Observability settings for the Worker. */
  observability?: {
    enabled: boolean;
    headSamplingRate?: number | null;
    logs?: {
      enabled: boolean;
      invocationLogs: boolean;
      destinations?: string[];
      headSamplingRate?: number | null;
      persist?: boolean;
    } | null;
  };
  /** Configuration for [Smart Placement](https://developers.cloudflare.com/workers/configuration/smart-placement). */
  placement?: { mode?: "smart" };
  /** Tags associated with the Worker. */
  tags?: string[];
  /** List of Workers that will consume logs from the attached Worker. */
  tailConsumers?: unknown[];
  /** Usage model for the Worker invocations. */
  usageModel?: "standard" | "bundled" | "unbound";
}

export const PatchScriptScriptAndVersionSettingResponse = Schema.Struct({
  bindings: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("ai"),
        }),
        Schema.Struct({
          dataset: Schema.String,
          name: Schema.String,
          type: Schema.Literal("analytics_engine"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("assets"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("browser"),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("d1"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("data_blob"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespace: Schema.String,
          type: Schema.Literal("dispatch_namespace"),
          outbound: Schema.optional(
            Schema.Struct({
              params: Schema.optional(Schema.Array(Schema.String)),
              worker: Schema.optional(
                Schema.Struct({
                  environment: Schema.optional(Schema.String),
                  service: Schema.optional(Schema.String),
                }),
              ),
            }),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("durable_object_namespace"),
          className: Schema.optional(Schema.String).pipe(
            T.JsonName("class_name"),
          ),
          environment: Schema.optional(Schema.String),
          namespaceId: Schema.optional(Schema.String).pipe(
            T.JsonName("namespace_id"),
          ),
          scriptName: Schema.optional(Schema.String).pipe(
            T.JsonName("script_name"),
          ),
        }),
        Schema.Struct({
          id: Schema.String,
          name: Schema.String,
          type: Schema.Literal("hyperdrive"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("inherit"),
          oldName: Schema.optional(Schema.String).pipe(T.JsonName("old_name")),
          versionId: Schema.optional(Schema.String).pipe(
            T.JsonName("version_id"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("images"),
        }),
        Schema.Struct({
          json: Schema.String,
          name: Schema.String,
          type: Schema.Literal("json"),
        }),
        Schema.Struct({
          name: Schema.String,
          namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
          type: Schema.Literal("kv_namespace"),
        }),
        Schema.Struct({
          certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
          name: Schema.String,
          type: Schema.Literal("mtls_certificate"),
        }),
        Schema.Struct({
          name: Schema.String,
          text: Schema.String,
          type: Schema.Literal("plain_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          pipeline: Schema.String,
          type: Schema.Literal("pipelines"),
        }),
        Schema.Struct({
          name: Schema.String,
          queueName: Schema.String.pipe(T.JsonName("queue_name")),
          type: Schema.Literal("queue"),
        }),
        Schema.Struct({
          bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
          name: Schema.String,
          type: Schema.Literal("r2_bucket"),
          jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("secret_text"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("send_email"),
          allowedDestinationAddresses: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("allowed_destination_addresses")),
          allowedSenderAddresses: Schema.optional(
            Schema.Array(Schema.String),
          ).pipe(T.JsonName("allowed_sender_addresses")),
          destinationAddress: Schema.optional(Schema.String).pipe(
            T.JsonName("destination_address"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("service"),
          environment: Schema.optional(Schema.String),
        }),
        Schema.Struct({
          name: Schema.String,
          service: Schema.String,
          type: Schema.Literal("tail_consumer"),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("text_blob"),
        }),
        Schema.Struct({
          indexName: Schema.String.pipe(T.JsonName("index_name")),
          name: Schema.String,
          type: Schema.Literal("vectorize"),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("version_metadata"),
        }),
        Schema.Struct({
          name: Schema.String,
          secretName: Schema.String.pipe(T.JsonName("secret_name")),
          storeId: Schema.String.pipe(T.JsonName("store_id")),
          type: Schema.Literal("secrets_store_secret"),
        }),
        Schema.Struct({
          algorithm: Schema.Unknown,
          format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
          name: Schema.String,
          type: Schema.Literal("secret_key"),
          usages: Schema.Array(
            Schema.Literal(
              "encrypt",
              "decrypt",
              "sign",
              "verify",
              "deriveKey",
              "deriveBits",
              "wrapKey",
              "unwrapKey",
            ),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          type: Schema.Literal("workflow"),
          workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
          className: Schema.optional(Schema.String).pipe(
            T.JsonName("class_name"),
          ),
          scriptName: Schema.optional(Schema.String).pipe(
            T.JsonName("script_name"),
          ),
        }),
        Schema.Struct({
          name: Schema.String,
          part: Schema.String,
          type: Schema.Literal("wasm_module"),
        }),
      ),
    ),
  ),
  compatibilityDate: Schema.optional(Schema.String).pipe(
    T.JsonName("compatibility_date"),
  ),
  compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("compatibility_flags"),
  ),
  limits: Schema.optional(
    Schema.Struct({
      cpuMs: Schema.optional(Schema.Number).pipe(T.JsonName("cpu_ms")),
    }),
  ),
  logpush: Schema.optional(Schema.Boolean),
  observability: Schema.optional(
    Schema.Struct({
      enabled: Schema.Boolean,
      headSamplingRate: Schema.optional(
        Schema.Union(Schema.Number, Schema.Null),
      ).pipe(T.JsonName("head_sampling_rate")),
      logs: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.Boolean,
            invocationLogs: Schema.Boolean.pipe(T.JsonName("invocation_logs")),
            destinations: Schema.optional(Schema.Array(Schema.String)),
            headSamplingRate: Schema.optional(
              Schema.Union(Schema.Number, Schema.Null),
            ).pipe(T.JsonName("head_sampling_rate")),
            persist: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ),
    }),
  ),
  placement: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literal("smart")),
    }),
  ),
  tags: Schema.optional(Schema.Array(Schema.String)),
  tailConsumers: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
    T.JsonName("tail_consumers"),
  ),
  usageModel: Schema.optional(
    Schema.Literal("standard", "bundled", "unbound"),
  ).pipe(T.JsonName("usage_model")),
}) as unknown as Schema.Schema<PatchScriptScriptAndVersionSettingResponse>;

export const patchScriptScriptAndVersionSetting: (
  input: PatchScriptScriptAndVersionSettingRequest,
) => Effect.Effect<
  PatchScriptScriptAndVersionSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchScriptScriptAndVersionSettingRequest,
  output: PatchScriptScriptAndVersionSettingResponse,
  errors: [],
}));

// =============================================================================
// ScriptSecret
// =============================================================================

export interface GetScriptSecretRequest {
  scriptName: string;
  secretName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: Flag that indicates whether the secret name is URL encoded. */
  urlEncoded?: boolean;
}

export const GetScriptSecretRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  secretName: Schema.String.pipe(T.HttpPath("secretName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  urlEncoded: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("url_encoded")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/secrets/{secretName}",
  }),
) as unknown as Schema.Schema<GetScriptSecretRequest>;

export type GetScriptSecretResponse =
  | { name: string; type: "secret_text" }
  | {
      algorithm: unknown;
      format: "raw" | "pkcs8" | "spki" | "jwk";
      name: string;
      type: "secret_key";
      usages: (
        | "encrypt"
        | "decrypt"
        | "sign"
        | "verify"
        | "deriveKey"
        | "deriveBits"
        | "wrapKey"
        | "unwrapKey"
      )[];
    };

export const GetScriptSecretResponse = Schema.Union(
  Schema.Struct({
    name: Schema.String,
    type: Schema.Literal("secret_text"),
  }),
  Schema.Struct({
    algorithm: Schema.Unknown,
    format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
    name: Schema.String,
    type: Schema.Literal("secret_key"),
    usages: Schema.Array(
      Schema.Literal(
        "encrypt",
        "decrypt",
        "sign",
        "verify",
        "deriveKey",
        "deriveBits",
        "wrapKey",
        "unwrapKey",
      ),
    ),
  }),
) as unknown as Schema.Schema<GetScriptSecretResponse>;

export const getScriptSecret: (
  input: GetScriptSecretRequest,
) => Effect.Effect<
  GetScriptSecretResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScriptSecretRequest,
  output: GetScriptSecretResponse,
  errors: [],
}));

export interface PutScriptSecretRequest {
  scriptName: string;
}

export const PutScriptSecretRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/secrets",
  }),
) as unknown as Schema.Schema<PutScriptSecretRequest>;

export type PutScriptSecretResponse =
  | { name: string; type: "secret_text" }
  | {
      algorithm: unknown;
      format: "raw" | "pkcs8" | "spki" | "jwk";
      name: string;
      type: "secret_key";
      usages: (
        | "encrypt"
        | "decrypt"
        | "sign"
        | "verify"
        | "deriveKey"
        | "deriveBits"
        | "wrapKey"
        | "unwrapKey"
      )[];
    };

export const PutScriptSecretResponse = Schema.Union(
  Schema.Struct({
    name: Schema.String,
    type: Schema.Literal("secret_text"),
  }),
  Schema.Struct({
    algorithm: Schema.Unknown,
    format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
    name: Schema.String,
    type: Schema.Literal("secret_key"),
    usages: Schema.Array(
      Schema.Literal(
        "encrypt",
        "decrypt",
        "sign",
        "verify",
        "deriveKey",
        "deriveBits",
        "wrapKey",
        "unwrapKey",
      ),
    ),
  }),
) as unknown as Schema.Schema<PutScriptSecretResponse>;

export const putScriptSecret: (
  input: PutScriptSecretRequest,
) => Effect.Effect<
  PutScriptSecretResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutScriptSecretRequest,
  output: PutScriptSecretResponse,
  errors: [],
}));

export interface DeleteScriptSecretRequest {
  scriptName: string;
  secretName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: Flag that indicates whether the secret name is URL encoded. */
  urlEncoded?: boolean;
}

export const DeleteScriptSecretRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  secretName: Schema.String.pipe(T.HttpPath("secretName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  urlEncoded: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("url_encoded")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/secrets/{secretName}",
  }),
) as unknown as Schema.Schema<DeleteScriptSecretRequest>;

export type DeleteScriptSecretResponse = unknown;

export const DeleteScriptSecretResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteScriptSecretResponse>;

export const deleteScriptSecret: (
  input: DeleteScriptSecretRequest,
) => Effect.Effect<
  DeleteScriptSecretResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteScriptSecretRequest,
  output: DeleteScriptSecretResponse,
  errors: [],
}));

// =============================================================================
// ScriptSetting
// =============================================================================

export interface GetScriptSettingRequest {
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const GetScriptSettingRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/script-settings",
  }),
) as unknown as Schema.Schema<GetScriptSettingRequest>;

export type GetScriptSettingResponse = unknown;

export const GetScriptSettingResponse =
  Schema.Unknown as unknown as Schema.Schema<GetScriptSettingResponse>;

export const getScriptSetting: (
  input: GetScriptSettingRequest,
) => Effect.Effect<
  GetScriptSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScriptSettingRequest,
  output: GetScriptSettingResponse,
  errors: [],
}));

export interface PatchScriptSettingRequest {
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Whether Logpush is turned on for the Worker. */
  logpush?: boolean;
  /** Body param: Observability settings for the Worker. */
  observability?: {
    enabled: boolean;
    headSamplingRate?: number | null;
    logs?: {
      enabled: boolean;
      invocationLogs: boolean;
      destinations?: string[];
      headSamplingRate?: number | null;
      persist?: boolean;
    } | null;
  } | null;
  /** Body param: Tags associated with the Worker. */
  tags?: string[];
  /** Body param: List of Workers that will consume logs from the attached Worker. */
  tailConsumers?: unknown[] | null;
}

export const PatchScriptSettingRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  logpush: Schema.optional(Schema.Boolean),
  observability: Schema.optional(
    Schema.Union(
      Schema.Struct({
        enabled: Schema.Boolean,
        headSamplingRate: Schema.optional(
          Schema.Union(Schema.Number, Schema.Null),
        ).pipe(T.JsonName("head_sampling_rate")),
        logs: Schema.optional(
          Schema.Union(
            Schema.Struct({
              enabled: Schema.Boolean,
              invocationLogs: Schema.Boolean.pipe(
                T.JsonName("invocation_logs"),
              ),
              destinations: Schema.optional(Schema.Array(Schema.String)),
              headSamplingRate: Schema.optional(
                Schema.Union(Schema.Number, Schema.Null),
              ).pipe(T.JsonName("head_sampling_rate")),
              persist: Schema.optional(Schema.Boolean),
            }),
            Schema.Null,
          ),
        ),
      }),
      Schema.Null,
    ),
  ),
  tags: Schema.optional(Schema.Array(Schema.String)),
  tailConsumers: Schema.optional(
    Schema.Union(Schema.Array(Schema.Unknown), Schema.Null),
  ).pipe(T.JsonName("tail_consumers")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/script-settings",
  }),
) as unknown as Schema.Schema<PatchScriptSettingRequest>;

export type PatchScriptSettingResponse = unknown;

export const PatchScriptSettingResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchScriptSettingResponse>;

export const patchScriptSetting: (
  input: PatchScriptSettingRequest,
) => Effect.Effect<
  PatchScriptSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchScriptSettingRequest,
  output: PatchScriptSettingResponse,
  errors: [],
}));

// =============================================================================
// ScriptSubdomain
// =============================================================================

export interface GetScriptSubdomainRequest {
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const GetScriptSubdomainRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/subdomain",
  }),
) as unknown as Schema.Schema<GetScriptSubdomainRequest>;

export interface GetScriptSubdomainResponse {
  /** Whether the Worker is available on the workers.dev subdomain. */
  enabled: boolean;
  /** Whether the Worker's Preview URLs are available on the workers.dev subdomain. */
  previewsEnabled: boolean;
}

export const GetScriptSubdomainResponse = Schema.Struct({
  enabled: Schema.Boolean,
  previewsEnabled: Schema.Boolean.pipe(T.JsonName("previews_enabled")),
}) as unknown as Schema.Schema<GetScriptSubdomainResponse>;

export const getScriptSubdomain: (
  input: GetScriptSubdomainRequest,
) => Effect.Effect<
  GetScriptSubdomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScriptSubdomainRequest,
  output: GetScriptSubdomainResponse,
  errors: [],
}));

export interface CreateScriptSubdomainRequest {
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Whether the Worker should be available on the workers.dev subdomain. */
  enabled: boolean;
  /** Body param: Whether the Worker's Preview URLs should be available on the workers.dev subdomain. */
  previewsEnabled?: boolean;
}

export const CreateScriptSubdomainRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  enabled: Schema.Boolean,
  previewsEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("previews_enabled"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/subdomain",
  }),
) as unknown as Schema.Schema<CreateScriptSubdomainRequest>;

export interface CreateScriptSubdomainResponse {
  /** Whether the Worker is available on the workers.dev subdomain. */
  enabled: boolean;
  /** Whether the Worker's Preview URLs are available on the workers.dev subdomain. */
  previewsEnabled: boolean;
}

export const CreateScriptSubdomainResponse = Schema.Struct({
  enabled: Schema.Boolean,
  previewsEnabled: Schema.Boolean.pipe(T.JsonName("previews_enabled")),
}) as unknown as Schema.Schema<CreateScriptSubdomainResponse>;

export const createScriptSubdomain: (
  input: CreateScriptSubdomainRequest,
) => Effect.Effect<
  CreateScriptSubdomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateScriptSubdomainRequest,
  output: CreateScriptSubdomainResponse,
  errors: [],
}));

export interface DeleteScriptSubdomainRequest {
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteScriptSubdomainRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/subdomain",
  }),
) as unknown as Schema.Schema<DeleteScriptSubdomainRequest>;

export interface DeleteScriptSubdomainResponse {
  /** Whether the Worker is available on the workers.dev subdomain. */
  enabled: boolean;
  /** Whether the Worker's Preview URLs are available on the workers.dev subdomain. */
  previewsEnabled: boolean;
}

export const DeleteScriptSubdomainResponse = Schema.Struct({
  enabled: Schema.Boolean,
  previewsEnabled: Schema.Boolean.pipe(T.JsonName("previews_enabled")),
}) as unknown as Schema.Schema<DeleteScriptSubdomainResponse>;

export const deleteScriptSubdomain: (
  input: DeleteScriptSubdomainRequest,
) => Effect.Effect<
  DeleteScriptSubdomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteScriptSubdomainRequest,
  output: DeleteScriptSubdomainResponse,
  errors: [],
}));

// =============================================================================
// ScriptTail
// =============================================================================

export interface GetScriptTailRequest {
  scriptName: string;
  /** Identifier. */
  accountId: string;
}

export const GetScriptTailRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/tails",
  }),
) as unknown as Schema.Schema<GetScriptTailRequest>;

export interface GetScriptTailResponse {
  /** Identifier. */
  id: string;
  expiresAt: string;
  url: string;
}

export const GetScriptTailResponse = Schema.Struct({
  id: Schema.String,
  expiresAt: Schema.String.pipe(T.JsonName("expires_at")),
  url: Schema.String,
}) as unknown as Schema.Schema<GetScriptTailResponse>;

export const getScriptTail: (
  input: GetScriptTailRequest,
) => Effect.Effect<
  GetScriptTailResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScriptTailRequest,
  output: GetScriptTailResponse,
  errors: [],
}));

export interface CreateScriptTailRequest {
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const CreateScriptTailRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/tails",
  }),
) as unknown as Schema.Schema<CreateScriptTailRequest>;

export interface CreateScriptTailResponse {
  /** Identifier. */
  id: string;
  expiresAt: string;
  url: string;
}

export const CreateScriptTailResponse = Schema.Struct({
  id: Schema.String,
  expiresAt: Schema.String.pipe(T.JsonName("expires_at")),
  url: Schema.String,
}) as unknown as Schema.Schema<CreateScriptTailResponse>;

export const createScriptTail: (
  input: CreateScriptTailRequest,
) => Effect.Effect<
  CreateScriptTailResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateScriptTailRequest,
  output: CreateScriptTailResponse,
  errors: [],
}));

export interface DeleteScriptTailRequest {
  scriptName: string;
  id: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteScriptTailRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  id: Schema.String.pipe(T.HttpPath("id")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/tails/{id}",
  }),
) as unknown as Schema.Schema<DeleteScriptTailRequest>;

export interface DeleteScriptTailResponse {
  errors: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  messages: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  /** Whether the API call was successful. */
  success: true;
}

export const DeleteScriptTailResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<DeleteScriptTailResponse>;

export const deleteScriptTail: (
  input: DeleteScriptTailRequest,
) => Effect.Effect<
  DeleteScriptTailResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteScriptTailRequest,
  output: DeleteScriptTailResponse,
  errors: [],
}));

// =============================================================================
// ScriptVersion
// =============================================================================

export interface GetScriptVersionRequest {
  scriptName: string;
  versionId: string;
  /** Identifier. */
  accountId: string;
}

export const GetScriptVersionRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  versionId: Schema.String.pipe(T.HttpPath("versionId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/versions/{versionId}",
  }),
) as unknown as Schema.Schema<GetScriptVersionRequest>;

export interface GetScriptVersionResponse {
  resources: {
    bindings?: (
      | { name: string; type: "ai" }
      | { dataset: string; name: string; type: "analytics_engine" }
      | { name: string; type: "assets" }
      | { name: string; type: "browser" }
      | { id: string; name: string; type: "d1" }
      | { name: string; part: string; type: "data_blob" }
      | {
          name: string;
          namespace: string;
          type: "dispatch_namespace";
          outbound?: {
            params?: string[];
            worker?: { environment?: string; service?: string };
          };
        }
      | {
          name: string;
          type: "durable_object_namespace";
          className?: string;
          environment?: string;
          namespaceId?: string;
          scriptName?: string;
        }
      | { id: string; name: string; type: "hyperdrive" }
      | { name: string; type: "inherit"; oldName?: string; versionId?: string }
      | { name: string; type: "images" }
      | { json: string; name: string; type: "json" }
      | { name: string; namespaceId: string; type: "kv_namespace" }
      | { certificateId: string; name: string; type: "mtls_certificate" }
      | { name: string; text: string; type: "plain_text" }
      | { name: string; pipeline: string; type: "pipelines" }
      | { name: string; queueName: string; type: "queue" }
      | {
          bucketName: string;
          name: string;
          type: "r2_bucket";
          jurisdiction?: "eu" | "fedramp";
        }
      | { name: string; type: "secret_text" }
      | {
          name: string;
          type: "send_email";
          allowedDestinationAddresses?: string[];
          allowedSenderAddresses?: string[];
          destinationAddress?: string;
        }
      | { name: string; service: string; type: "service"; environment?: string }
      | { name: string; service: string; type: "tail_consumer" }
      | { name: string; part: string; type: "text_blob" }
      | { indexName: string; name: string; type: "vectorize" }
      | { name: string; type: "version_metadata" }
      | {
          name: string;
          secretName: string;
          storeId: string;
          type: "secrets_store_secret";
        }
      | {
          algorithm: unknown;
          format: "raw" | "pkcs8" | "spki" | "jwk";
          name: string;
          type: "secret_key";
          usages: (
            | "encrypt"
            | "decrypt"
            | "sign"
            | "verify"
            | "deriveKey"
            | "deriveBits"
            | "wrapKey"
            | "unwrapKey"
          )[];
        }
      | {
          name: string;
          type: "workflow";
          workflowName: string;
          className?: string;
          scriptName?: string;
        }
      | { name: string; part: string; type: "wasm_module" }
    )[];
    script?: {
      etag?: string;
      handlers?: string[];
      lastDeployedFrom?: string;
      namedHandlers?: { handlers?: string[]; name?: string }[];
    };
    scriptRuntime?: {
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      limits?: { cpuMs?: number };
      migrationTag?: string;
      usageModel?: "bundled" | "unbound" | "standard";
    };
  };
  id?: string;
  metadata?: {
    authorEmail?: string;
    authorId?: string;
    createdOn?: string;
    hasPreview?: boolean;
    modifiedOn?: string;
    source?:
      | "unknown"
      | "api"
      | "wrangler"
      | "terraform"
      | "dash"
      | "dash_template"
      | "integration"
      | "quick_editor"
      | "playground"
      | "workersci";
  };
  number?: number;
}

export const GetScriptVersionResponse = Schema.Struct({
  resources: Schema.Struct({
    bindings: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("ai"),
          }),
          Schema.Struct({
            dataset: Schema.String,
            name: Schema.String,
            type: Schema.Literal("analytics_engine"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("assets"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("browser"),
          }),
          Schema.Struct({
            id: Schema.String,
            name: Schema.String,
            type: Schema.Literal("d1"),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("data_blob"),
          }),
          Schema.Struct({
            name: Schema.String,
            namespace: Schema.String,
            type: Schema.Literal("dispatch_namespace"),
            outbound: Schema.optional(
              Schema.Struct({
                params: Schema.optional(Schema.Array(Schema.String)),
                worker: Schema.optional(
                  Schema.Struct({
                    environment: Schema.optional(Schema.String),
                    service: Schema.optional(Schema.String),
                  }),
                ),
              }),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("durable_object_namespace"),
            className: Schema.optional(Schema.String).pipe(
              T.JsonName("class_name"),
            ),
            environment: Schema.optional(Schema.String),
            namespaceId: Schema.optional(Schema.String).pipe(
              T.JsonName("namespace_id"),
            ),
            scriptName: Schema.optional(Schema.String).pipe(
              T.JsonName("script_name"),
            ),
          }),
          Schema.Struct({
            id: Schema.String,
            name: Schema.String,
            type: Schema.Literal("hyperdrive"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("inherit"),
            oldName: Schema.optional(Schema.String).pipe(
              T.JsonName("old_name"),
            ),
            versionId: Schema.optional(Schema.String).pipe(
              T.JsonName("version_id"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("images"),
          }),
          Schema.Struct({
            json: Schema.String,
            name: Schema.String,
            type: Schema.Literal("json"),
          }),
          Schema.Struct({
            name: Schema.String,
            namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
            type: Schema.Literal("kv_namespace"),
          }),
          Schema.Struct({
            certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
            name: Schema.String,
            type: Schema.Literal("mtls_certificate"),
          }),
          Schema.Struct({
            name: Schema.String,
            text: Schema.String,
            type: Schema.Literal("plain_text"),
          }),
          Schema.Struct({
            name: Schema.String,
            pipeline: Schema.String,
            type: Schema.Literal("pipelines"),
          }),
          Schema.Struct({
            name: Schema.String,
            queueName: Schema.String.pipe(T.JsonName("queue_name")),
            type: Schema.Literal("queue"),
          }),
          Schema.Struct({
            bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
            name: Schema.String,
            type: Schema.Literal("r2_bucket"),
            jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("secret_text"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("send_email"),
            allowedDestinationAddresses: Schema.optional(
              Schema.Array(Schema.String),
            ).pipe(T.JsonName("allowed_destination_addresses")),
            allowedSenderAddresses: Schema.optional(
              Schema.Array(Schema.String),
            ).pipe(T.JsonName("allowed_sender_addresses")),
            destinationAddress: Schema.optional(Schema.String).pipe(
              T.JsonName("destination_address"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            service: Schema.String,
            type: Schema.Literal("service"),
            environment: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            name: Schema.String,
            service: Schema.String,
            type: Schema.Literal("tail_consumer"),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("text_blob"),
          }),
          Schema.Struct({
            indexName: Schema.String.pipe(T.JsonName("index_name")),
            name: Schema.String,
            type: Schema.Literal("vectorize"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("version_metadata"),
          }),
          Schema.Struct({
            name: Schema.String,
            secretName: Schema.String.pipe(T.JsonName("secret_name")),
            storeId: Schema.String.pipe(T.JsonName("store_id")),
            type: Schema.Literal("secrets_store_secret"),
          }),
          Schema.Struct({
            algorithm: Schema.Unknown,
            format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
            name: Schema.String,
            type: Schema.Literal("secret_key"),
            usages: Schema.Array(
              Schema.Literal(
                "encrypt",
                "decrypt",
                "sign",
                "verify",
                "deriveKey",
                "deriveBits",
                "wrapKey",
                "unwrapKey",
              ),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("workflow"),
            workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
            className: Schema.optional(Schema.String).pipe(
              T.JsonName("class_name"),
            ),
            scriptName: Schema.optional(Schema.String).pipe(
              T.JsonName("script_name"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("wasm_module"),
          }),
        ),
      ),
    ),
    script: Schema.optional(
      Schema.Struct({
        etag: Schema.optional(Schema.String),
        handlers: Schema.optional(Schema.Array(Schema.String)),
        lastDeployedFrom: Schema.optional(Schema.String).pipe(
          T.JsonName("last_deployed_from"),
        ),
        namedHandlers: Schema.optional(
          Schema.Array(
            Schema.Struct({
              handlers: Schema.optional(Schema.Array(Schema.String)),
              name: Schema.optional(Schema.String),
            }),
          ),
        ).pipe(T.JsonName("named_handlers")),
      }),
    ),
    scriptRuntime: Schema.optional(
      Schema.Struct({
        compatibilityDate: Schema.optional(Schema.String).pipe(
          T.JsonName("compatibility_date"),
        ),
        compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
          T.JsonName("compatibility_flags"),
        ),
        limits: Schema.optional(
          Schema.Struct({
            cpuMs: Schema.optional(Schema.Number).pipe(T.JsonName("cpu_ms")),
          }),
        ),
        migrationTag: Schema.optional(Schema.String).pipe(
          T.JsonName("migration_tag"),
        ),
        usageModel: Schema.optional(
          Schema.Literal("bundled", "unbound", "standard"),
        ).pipe(T.JsonName("usage_model")),
      }),
    ).pipe(T.JsonName("script_runtime")),
  }),
  id: Schema.optional(Schema.String),
  metadata: Schema.optional(
    Schema.Struct({
      authorEmail: Schema.optional(Schema.String).pipe(
        T.JsonName("author_email"),
      ),
      authorId: Schema.optional(Schema.String).pipe(T.JsonName("author_id")),
      createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
      hasPreview: Schema.optional(Schema.Boolean),
      modifiedOn: Schema.optional(Schema.String).pipe(
        T.JsonName("modified_on"),
      ),
      source: Schema.optional(
        Schema.Literal(
          "unknown",
          "api",
          "wrangler",
          "terraform",
          "dash",
          "dash_template",
          "integration",
          "quick_editor",
          "playground",
          "workersci",
        ),
      ),
    }),
  ),
  number: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetScriptVersionResponse>;

export const getScriptVersion: (
  input: GetScriptVersionRequest,
) => Effect.Effect<
  GetScriptVersionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScriptVersionRequest,
  output: GetScriptVersionResponse,
  errors: [],
}));

export interface CreateScriptVersionRequest {
  scriptName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: JSON-encoded metadata about the uploaded parts and Worker configuration. */
  metadata: {
    mainModule: string;
    annotations?: { "workers/message"?: string; "workers/tag"?: string };
    bindings?: (
      | { name: string; type: "ai" }
      | { dataset: string; name: string; type: "analytics_engine" }
      | { name: string; type: "assets" }
      | { name: string; type: "browser" }
      | { id: string; name: string; type: "d1" }
      | { name: string; part: string; type: "data_blob" }
      | {
          name: string;
          namespace: string;
          type: "dispatch_namespace";
          outbound?: {
            params?: string[];
            worker?: { environment?: string; service?: string };
          };
        }
      | {
          name: string;
          type: "durable_object_namespace";
          className?: string;
          environment?: string;
          namespaceId?: string;
          scriptName?: string;
        }
      | { id: string; name: string; type: "hyperdrive" }
      | { name: string; type: "inherit"; oldName?: string; versionId?: string }
      | { name: string; type: "images" }
      | { json: string; name: string; type: "json" }
      | { name: string; namespaceId: string; type: "kv_namespace" }
      | { certificateId: string; name: string; type: "mtls_certificate" }
      | { name: string; text: string; type: "plain_text" }
      | { name: string; pipeline: string; type: "pipelines" }
      | { name: string; queueName: string; type: "queue" }
      | {
          bucketName: string;
          name: string;
          type: "r2_bucket";
          jurisdiction?: "eu" | "fedramp";
        }
      | { name: string; text: string; type: "secret_text" }
      | {
          name: string;
          type: "send_email";
          allowedDestinationAddresses?: string[];
          allowedSenderAddresses?: string[];
          destinationAddress?: string;
        }
      | { name: string; service: string; type: "service"; environment?: string }
      | { name: string; service: string; type: "tail_consumer" }
      | { name: string; part: string; type: "text_blob" }
      | { indexName: string; name: string; type: "vectorize" }
      | { name: string; type: "version_metadata" }
      | {
          name: string;
          secretName: string;
          storeId: string;
          type: "secrets_store_secret";
        }
      | {
          algorithm: unknown;
          format: "raw" | "pkcs8" | "spki" | "jwk";
          name: string;
          type: "secret_key";
          usages: (
            | "encrypt"
            | "decrypt"
            | "sign"
            | "verify"
            | "deriveKey"
            | "deriveBits"
            | "wrapKey"
            | "unwrapKey"
          )[];
          keyBase64?: string;
          keyJwk?: unknown;
        }
      | {
          name: string;
          type: "workflow";
          workflowName: string;
          className?: string;
          scriptName?: string;
        }
      | { name: string; part: string; type: "wasm_module" }
    )[];
    compatibilityDate?: string;
    compatibilityFlags?: string[];
    keepBindings?: string[];
    usageModel?: "standard" | "bundled" | "unbound";
  };
  /** Body param: An array of modules (often JavaScript files) comprising a Worker script. At least one module must be present and referenced in the metadata as `main_module` or `body_part` by filename.<br/ */
  files?: (File | Blob)[];
}

export const CreateScriptVersionRequest = Schema.Struct({
  scriptName: Schema.String.pipe(T.HttpPath("scriptName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  metadata: Schema.Struct({
    mainModule: Schema.String.pipe(T.JsonName("main_module")),
    annotations: Schema.optional(
      Schema.Struct({
        "workers/message": Schema.optional(Schema.String),
        "workers/tag": Schema.optional(Schema.String),
      }),
    ),
    bindings: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("ai"),
          }),
          Schema.Struct({
            dataset: Schema.String,
            name: Schema.String,
            type: Schema.Literal("analytics_engine"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("assets"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("browser"),
          }),
          Schema.Struct({
            id: Schema.String,
            name: Schema.String,
            type: Schema.Literal("d1"),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("data_blob"),
          }),
          Schema.Struct({
            name: Schema.String,
            namespace: Schema.String,
            type: Schema.Literal("dispatch_namespace"),
            outbound: Schema.optional(
              Schema.Struct({
                params: Schema.optional(Schema.Array(Schema.String)),
                worker: Schema.optional(
                  Schema.Struct({
                    environment: Schema.optional(Schema.String),
                    service: Schema.optional(Schema.String),
                  }),
                ),
              }),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("durable_object_namespace"),
            className: Schema.optional(Schema.String).pipe(
              T.JsonName("class_name"),
            ),
            environment: Schema.optional(Schema.String),
            namespaceId: Schema.optional(Schema.String).pipe(
              T.JsonName("namespace_id"),
            ),
            scriptName: Schema.optional(Schema.String).pipe(
              T.JsonName("script_name"),
            ),
          }),
          Schema.Struct({
            id: Schema.String,
            name: Schema.String,
            type: Schema.Literal("hyperdrive"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("inherit"),
            oldName: Schema.optional(Schema.String).pipe(
              T.JsonName("old_name"),
            ),
            versionId: Schema.optional(Schema.String).pipe(
              T.JsonName("version_id"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("images"),
          }),
          Schema.Struct({
            json: Schema.String,
            name: Schema.String,
            type: Schema.Literal("json"),
          }),
          Schema.Struct({
            name: Schema.String,
            namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
            type: Schema.Literal("kv_namespace"),
          }),
          Schema.Struct({
            certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
            name: Schema.String,
            type: Schema.Literal("mtls_certificate"),
          }),
          Schema.Struct({
            name: Schema.String,
            text: Schema.String,
            type: Schema.Literal("plain_text"),
          }),
          Schema.Struct({
            name: Schema.String,
            pipeline: Schema.String,
            type: Schema.Literal("pipelines"),
          }),
          Schema.Struct({
            name: Schema.String,
            queueName: Schema.String.pipe(T.JsonName("queue_name")),
            type: Schema.Literal("queue"),
          }),
          Schema.Struct({
            bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
            name: Schema.String,
            type: Schema.Literal("r2_bucket"),
            jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
          }),
          Schema.Struct({
            name: Schema.String,
            text: Schema.String,
            type: Schema.Literal("secret_text"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("send_email"),
            allowedDestinationAddresses: Schema.optional(
              Schema.Array(Schema.String),
            ).pipe(T.JsonName("allowed_destination_addresses")),
            allowedSenderAddresses: Schema.optional(
              Schema.Array(Schema.String),
            ).pipe(T.JsonName("allowed_sender_addresses")),
            destinationAddress: Schema.optional(Schema.String).pipe(
              T.JsonName("destination_address"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            service: Schema.String,
            type: Schema.Literal("service"),
            environment: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            name: Schema.String,
            service: Schema.String,
            type: Schema.Literal("tail_consumer"),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("text_blob"),
          }),
          Schema.Struct({
            indexName: Schema.String.pipe(T.JsonName("index_name")),
            name: Schema.String,
            type: Schema.Literal("vectorize"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("version_metadata"),
          }),
          Schema.Struct({
            name: Schema.String,
            secretName: Schema.String.pipe(T.JsonName("secret_name")),
            storeId: Schema.String.pipe(T.JsonName("store_id")),
            type: Schema.Literal("secrets_store_secret"),
          }),
          Schema.Struct({
            algorithm: Schema.Unknown,
            format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
            name: Schema.String,
            type: Schema.Literal("secret_key"),
            usages: Schema.Array(
              Schema.Literal(
                "encrypt",
                "decrypt",
                "sign",
                "verify",
                "deriveKey",
                "deriveBits",
                "wrapKey",
                "unwrapKey",
              ),
            ),
            keyBase64: Schema.optional(Schema.String).pipe(
              T.JsonName("key_base64"),
            ),
            keyJwk: Schema.optional(Schema.Unknown).pipe(T.JsonName("key_jwk")),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("workflow"),
            workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
            className: Schema.optional(Schema.String).pipe(
              T.JsonName("class_name"),
            ),
            scriptName: Schema.optional(Schema.String).pipe(
              T.JsonName("script_name"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("wasm_module"),
          }),
        ),
      ),
    ),
    compatibilityDate: Schema.optional(Schema.String).pipe(
      T.JsonName("compatibility_date"),
    ),
    compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("compatibility_flags"),
    ),
    keepBindings: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("keep_bindings"),
    ),
    usageModel: Schema.optional(
      Schema.Literal("standard", "bundled", "unbound"),
    ).pipe(T.JsonName("usage_model")),
  }),
  files: Schema.optional(
    Schema.Array(UploadableSchema.pipe(T.HttpFormDataFile())),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/workers/scripts/{scriptName}/versions",
    contentType: "multipart",
  }),
) as unknown as Schema.Schema<CreateScriptVersionRequest>;

export interface CreateScriptVersionResponse {
  resources: {
    bindings?: (
      | { name: string; type: "ai" }
      | { dataset: string; name: string; type: "analytics_engine" }
      | { name: string; type: "assets" }
      | { name: string; type: "browser" }
      | { id: string; name: string; type: "d1" }
      | { name: string; part: string; type: "data_blob" }
      | {
          name: string;
          namespace: string;
          type: "dispatch_namespace";
          outbound?: {
            params?: string[];
            worker?: { environment?: string; service?: string };
          };
        }
      | {
          name: string;
          type: "durable_object_namespace";
          className?: string;
          environment?: string;
          namespaceId?: string;
          scriptName?: string;
        }
      | { id: string; name: string; type: "hyperdrive" }
      | { name: string; type: "inherit"; oldName?: string; versionId?: string }
      | { name: string; type: "images" }
      | { json: string; name: string; type: "json" }
      | { name: string; namespaceId: string; type: "kv_namespace" }
      | { certificateId: string; name: string; type: "mtls_certificate" }
      | { name: string; text: string; type: "plain_text" }
      | { name: string; pipeline: string; type: "pipelines" }
      | { name: string; queueName: string; type: "queue" }
      | {
          bucketName: string;
          name: string;
          type: "r2_bucket";
          jurisdiction?: "eu" | "fedramp";
        }
      | { name: string; type: "secret_text" }
      | {
          name: string;
          type: "send_email";
          allowedDestinationAddresses?: string[];
          allowedSenderAddresses?: string[];
          destinationAddress?: string;
        }
      | { name: string; service: string; type: "service"; environment?: string }
      | { name: string; service: string; type: "tail_consumer" }
      | { name: string; part: string; type: "text_blob" }
      | { indexName: string; name: string; type: "vectorize" }
      | { name: string; type: "version_metadata" }
      | {
          name: string;
          secretName: string;
          storeId: string;
          type: "secrets_store_secret";
        }
      | {
          algorithm: unknown;
          format: "raw" | "pkcs8" | "spki" | "jwk";
          name: string;
          type: "secret_key";
          usages: (
            | "encrypt"
            | "decrypt"
            | "sign"
            | "verify"
            | "deriveKey"
            | "deriveBits"
            | "wrapKey"
            | "unwrapKey"
          )[];
        }
      | {
          name: string;
          type: "workflow";
          workflowName: string;
          className?: string;
          scriptName?: string;
        }
      | { name: string; part: string; type: "wasm_module" }
    )[];
    script?: {
      etag?: string;
      handlers?: string[];
      lastDeployedFrom?: string;
      namedHandlers?: { handlers?: string[]; name?: string }[];
    };
    scriptRuntime?: {
      compatibilityDate?: string;
      compatibilityFlags?: string[];
      limits?: { cpuMs?: number };
      migrationTag?: string;
      usageModel?: "bundled" | "unbound" | "standard";
    };
  };
  id?: string;
  metadata?: {
    authorEmail?: string;
    authorId?: string;
    createdOn?: string;
    hasPreview?: boolean;
    modifiedOn?: string;
    source?:
      | "unknown"
      | "api"
      | "wrangler"
      | "terraform"
      | "dash"
      | "dash_template"
      | "integration"
      | "quick_editor"
      | "playground"
      | "workersci";
  };
  number?: number;
  startupTimeMs?: number;
}

export const CreateScriptVersionResponse = Schema.Struct({
  resources: Schema.Struct({
    bindings: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("ai"),
          }),
          Schema.Struct({
            dataset: Schema.String,
            name: Schema.String,
            type: Schema.Literal("analytics_engine"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("assets"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("browser"),
          }),
          Schema.Struct({
            id: Schema.String,
            name: Schema.String,
            type: Schema.Literal("d1"),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("data_blob"),
          }),
          Schema.Struct({
            name: Schema.String,
            namespace: Schema.String,
            type: Schema.Literal("dispatch_namespace"),
            outbound: Schema.optional(
              Schema.Struct({
                params: Schema.optional(Schema.Array(Schema.String)),
                worker: Schema.optional(
                  Schema.Struct({
                    environment: Schema.optional(Schema.String),
                    service: Schema.optional(Schema.String),
                  }),
                ),
              }),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("durable_object_namespace"),
            className: Schema.optional(Schema.String).pipe(
              T.JsonName("class_name"),
            ),
            environment: Schema.optional(Schema.String),
            namespaceId: Schema.optional(Schema.String).pipe(
              T.JsonName("namespace_id"),
            ),
            scriptName: Schema.optional(Schema.String).pipe(
              T.JsonName("script_name"),
            ),
          }),
          Schema.Struct({
            id: Schema.String,
            name: Schema.String,
            type: Schema.Literal("hyperdrive"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("inherit"),
            oldName: Schema.optional(Schema.String).pipe(
              T.JsonName("old_name"),
            ),
            versionId: Schema.optional(Schema.String).pipe(
              T.JsonName("version_id"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("images"),
          }),
          Schema.Struct({
            json: Schema.String,
            name: Schema.String,
            type: Schema.Literal("json"),
          }),
          Schema.Struct({
            name: Schema.String,
            namespaceId: Schema.String.pipe(T.JsonName("namespace_id")),
            type: Schema.Literal("kv_namespace"),
          }),
          Schema.Struct({
            certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
            name: Schema.String,
            type: Schema.Literal("mtls_certificate"),
          }),
          Schema.Struct({
            name: Schema.String,
            text: Schema.String,
            type: Schema.Literal("plain_text"),
          }),
          Schema.Struct({
            name: Schema.String,
            pipeline: Schema.String,
            type: Schema.Literal("pipelines"),
          }),
          Schema.Struct({
            name: Schema.String,
            queueName: Schema.String.pipe(T.JsonName("queue_name")),
            type: Schema.Literal("queue"),
          }),
          Schema.Struct({
            bucketName: Schema.String.pipe(T.JsonName("bucket_name")),
            name: Schema.String,
            type: Schema.Literal("r2_bucket"),
            jurisdiction: Schema.optional(Schema.Literal("eu", "fedramp")),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("secret_text"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("send_email"),
            allowedDestinationAddresses: Schema.optional(
              Schema.Array(Schema.String),
            ).pipe(T.JsonName("allowed_destination_addresses")),
            allowedSenderAddresses: Schema.optional(
              Schema.Array(Schema.String),
            ).pipe(T.JsonName("allowed_sender_addresses")),
            destinationAddress: Schema.optional(Schema.String).pipe(
              T.JsonName("destination_address"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            service: Schema.String,
            type: Schema.Literal("service"),
            environment: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            name: Schema.String,
            service: Schema.String,
            type: Schema.Literal("tail_consumer"),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("text_blob"),
          }),
          Schema.Struct({
            indexName: Schema.String.pipe(T.JsonName("index_name")),
            name: Schema.String,
            type: Schema.Literal("vectorize"),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("version_metadata"),
          }),
          Schema.Struct({
            name: Schema.String,
            secretName: Schema.String.pipe(T.JsonName("secret_name")),
            storeId: Schema.String.pipe(T.JsonName("store_id")),
            type: Schema.Literal("secrets_store_secret"),
          }),
          Schema.Struct({
            algorithm: Schema.Unknown,
            format: Schema.Literal("raw", "pkcs8", "spki", "jwk"),
            name: Schema.String,
            type: Schema.Literal("secret_key"),
            usages: Schema.Array(
              Schema.Literal(
                "encrypt",
                "decrypt",
                "sign",
                "verify",
                "deriveKey",
                "deriveBits",
                "wrapKey",
                "unwrapKey",
              ),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            type: Schema.Literal("workflow"),
            workflowName: Schema.String.pipe(T.JsonName("workflow_name")),
            className: Schema.optional(Schema.String).pipe(
              T.JsonName("class_name"),
            ),
            scriptName: Schema.optional(Schema.String).pipe(
              T.JsonName("script_name"),
            ),
          }),
          Schema.Struct({
            name: Schema.String,
            part: Schema.String,
            type: Schema.Literal("wasm_module"),
          }),
        ),
      ),
    ),
    script: Schema.optional(
      Schema.Struct({
        etag: Schema.optional(Schema.String),
        handlers: Schema.optional(Schema.Array(Schema.String)),
        lastDeployedFrom: Schema.optional(Schema.String).pipe(
          T.JsonName("last_deployed_from"),
        ),
        namedHandlers: Schema.optional(
          Schema.Array(
            Schema.Struct({
              handlers: Schema.optional(Schema.Array(Schema.String)),
              name: Schema.optional(Schema.String),
            }),
          ),
        ).pipe(T.JsonName("named_handlers")),
      }),
    ),
    scriptRuntime: Schema.optional(
      Schema.Struct({
        compatibilityDate: Schema.optional(Schema.String).pipe(
          T.JsonName("compatibility_date"),
        ),
        compatibilityFlags: Schema.optional(Schema.Array(Schema.String)).pipe(
          T.JsonName("compatibility_flags"),
        ),
        limits: Schema.optional(
          Schema.Struct({
            cpuMs: Schema.optional(Schema.Number).pipe(T.JsonName("cpu_ms")),
          }),
        ),
        migrationTag: Schema.optional(Schema.String).pipe(
          T.JsonName("migration_tag"),
        ),
        usageModel: Schema.optional(
          Schema.Literal("bundled", "unbound", "standard"),
        ).pipe(T.JsonName("usage_model")),
      }),
    ).pipe(T.JsonName("script_runtime")),
  }),
  id: Schema.optional(Schema.String),
  metadata: Schema.optional(
    Schema.Struct({
      authorEmail: Schema.optional(Schema.String).pipe(
        T.JsonName("author_email"),
      ),
      authorId: Schema.optional(Schema.String).pipe(T.JsonName("author_id")),
      createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
      hasPreview: Schema.optional(Schema.Boolean),
      modifiedOn: Schema.optional(Schema.String).pipe(
        T.JsonName("modified_on"),
      ),
      source: Schema.optional(
        Schema.Literal(
          "unknown",
          "api",
          "wrangler",
          "terraform",
          "dash",
          "dash_template",
          "integration",
          "quick_editor",
          "playground",
          "workersci",
        ),
      ),
    }),
  ),
  number: Schema.optional(Schema.Number),
  startupTimeMs: Schema.optional(Schema.Number).pipe(
    T.JsonName("startup_time_ms"),
  ),
}) as unknown as Schema.Schema<CreateScriptVersionResponse>;

export const createScriptVersion: (
  input: CreateScriptVersionRequest,
) => Effect.Effect<
  CreateScriptVersionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateScriptVersionRequest,
  output: CreateScriptVersionResponse,
  errors: [],
}));

// =============================================================================
// Subdomain
// =============================================================================

export interface GetSubdomainRequest {
  /** Identifier. */
  accountId: string;
}

export const GetSubdomainRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/workers/subdomain" }),
) as unknown as Schema.Schema<GetSubdomainRequest>;

export interface GetSubdomainResponse {
  subdomain: string;
}

export const GetSubdomainResponse = Schema.Struct({
  subdomain: Schema.String,
}) as unknown as Schema.Schema<GetSubdomainResponse>;

export const getSubdomain: (
  input: GetSubdomainRequest,
) => Effect.Effect<
  GetSubdomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSubdomainRequest,
  output: GetSubdomainResponse,
  errors: [],
}));

export interface PutSubdomainRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  subdomain: string;
}

export const PutSubdomainRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  subdomain: Schema.String,
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/workers/subdomain" }),
) as unknown as Schema.Schema<PutSubdomainRequest>;

export interface PutSubdomainResponse {
  subdomain: string;
}

export const PutSubdomainResponse = Schema.Struct({
  subdomain: Schema.String,
}) as unknown as Schema.Schema<PutSubdomainResponse>;

export const putSubdomain: (
  input: PutSubdomainRequest,
) => Effect.Effect<
  PutSubdomainResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutSubdomainRequest,
  output: PutSubdomainResponse,
  errors: [],
}));
