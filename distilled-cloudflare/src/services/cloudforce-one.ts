/**
 * Cloudflare CLOUDFORCE-ONE API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service cloudforce-one
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
// BinaryStorage
// =============================================================================

export interface GetBinaryStorageRequest {
  hash: string;
  /** Account ID. */
  accountId: string;
}

export const GetBinaryStorageRequest = Schema.Struct({
  hash: Schema.String.pipe(T.HttpPath("hash")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/binary/{hash}",
  }),
) as unknown as Schema.Schema<GetBinaryStorageRequest>;

export type GetBinaryStorageResponse = unknown;

export const GetBinaryStorageResponse =
  Schema.Unknown as unknown as Schema.Schema<GetBinaryStorageResponse>;

export const getBinaryStorage: (
  input: GetBinaryStorageRequest,
) => Effect.Effect<
  GetBinaryStorageResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBinaryStorageRequest,
  output: GetBinaryStorageResponse,
  errors: [],
}));

export interface CreateBinaryStorageRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: The binary file content to upload. */
  file: File | Blob;
}

export const CreateBinaryStorageRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  file: UploadableSchema.pipe(T.HttpFormDataFile()),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cloudforce-one/binary",
    contentType: "multipart",
  }),
) as unknown as Schema.Schema<CreateBinaryStorageRequest>;

export interface CreateBinaryStorageResponse {
  contentType: string;
  md5: string;
  sha1: string;
  sha256: string;
}

export const CreateBinaryStorageResponse = Schema.Struct({
  contentType: Schema.String.pipe(T.JsonName("content_type")),
  md5: Schema.String,
  sha1: Schema.String,
  sha256: Schema.String,
}) as unknown as Schema.Schema<CreateBinaryStorageResponse>;

export const createBinaryStorage: (
  input: CreateBinaryStorageRequest,
) => Effect.Effect<
  CreateBinaryStorageResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateBinaryStorageRequest,
  output: CreateBinaryStorageResponse,
  errors: [],
}));

// =============================================================================
// Request
// =============================================================================

export interface GetRequestRequest {
  requestId: string;
  /** Identifier. */
  accountId: string;
}

export const GetRequestRequest = Schema.Struct({
  requestId: Schema.String.pipe(T.HttpPath("requestId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/requests/{requestId}",
  }),
) as unknown as Schema.Schema<GetRequestRequest>;

export interface GetRequestResponse {
  /** UUID. */
  id: string;
  /** Request content. */
  content: string;
  created: string;
  priority: string;
  /** Requested information from request. */
  request: string;
  /** Brief description of the request. */
  summary: string;
  /** The CISA defined Traffic Light Protocol (TLP). */
  tlp: "clear" | "amber" | "amber-strict" | "green" | "red";
  updated: string;
  completed?: string;
  /** Tokens for the request messages. */
  messageTokens?: number;
  /** Readable Request ID. */
  readableId?: string;
  /** Request Status. */
  status?:
    | "open"
    | "accepted"
    | "reported"
    | "approved"
    | "completed"
    | "declined";
  /** Tokens for the request. */
  tokens?: number;
}

export const GetRequestResponse = Schema.Struct({
  id: Schema.String,
  content: Schema.String,
  created: Schema.String,
  priority: Schema.String,
  request: Schema.String,
  summary: Schema.String,
  tlp: Schema.Literal("clear", "amber", "amber-strict", "green", "red"),
  updated: Schema.String,
  completed: Schema.optional(Schema.String),
  messageTokens: Schema.optional(Schema.Number).pipe(
    T.JsonName("message_tokens"),
  ),
  readableId: Schema.optional(Schema.String).pipe(T.JsonName("readable_id")),
  status: Schema.optional(
    Schema.Literal(
      "open",
      "accepted",
      "reported",
      "approved",
      "completed",
      "declined",
    ),
  ),
  tokens: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetRequestResponse>;

export const getRequest: (
  input: GetRequestRequest,
) => Effect.Effect<
  GetRequestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRequestRequest,
  output: GetRequestResponse,
  errors: [],
}));

export interface CreateRequestRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Request content. */
  content?: string;
  /** Body param: Priority for analyzing the request. */
  priority?: string;
  /** Body param: Requested information from request. */
  requestType?: string;
  /** Body param: Brief description of the request. */
  summary?: string;
  /** Body param: The CISA defined Traffic Light Protocol (TLP). */
  tlp?: "clear" | "amber" | "amber-strict" | "green" | "red";
}

export const CreateRequestRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  content: Schema.optional(Schema.String),
  priority: Schema.optional(Schema.String),
  requestType: Schema.optional(Schema.String).pipe(T.JsonName("request_type")),
  summary: Schema.optional(Schema.String),
  tlp: Schema.optional(
    Schema.Literal("clear", "amber", "amber-strict", "green", "red"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cloudforce-one/requests/new",
  }),
) as unknown as Schema.Schema<CreateRequestRequest>;

export interface CreateRequestResponse {
  /** UUID. */
  id: string;
  /** Request content. */
  content: string;
  created: string;
  priority: string;
  /** Requested information from request. */
  request: string;
  /** Brief description of the request. */
  summary: string;
  /** The CISA defined Traffic Light Protocol (TLP). */
  tlp: "clear" | "amber" | "amber-strict" | "green" | "red";
  updated: string;
  completed?: string;
  /** Tokens for the request messages. */
  messageTokens?: number;
  /** Readable Request ID. */
  readableId?: string;
  /** Request Status. */
  status?:
    | "open"
    | "accepted"
    | "reported"
    | "approved"
    | "completed"
    | "declined";
  /** Tokens for the request. */
  tokens?: number;
}

export const CreateRequestResponse = Schema.Struct({
  id: Schema.String,
  content: Schema.String,
  created: Schema.String,
  priority: Schema.String,
  request: Schema.String,
  summary: Schema.String,
  tlp: Schema.Literal("clear", "amber", "amber-strict", "green", "red"),
  updated: Schema.String,
  completed: Schema.optional(Schema.String),
  messageTokens: Schema.optional(Schema.Number).pipe(
    T.JsonName("message_tokens"),
  ),
  readableId: Schema.optional(Schema.String).pipe(T.JsonName("readable_id")),
  status: Schema.optional(
    Schema.Literal(
      "open",
      "accepted",
      "reported",
      "approved",
      "completed",
      "declined",
    ),
  ),
  tokens: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<CreateRequestResponse>;

export const createRequest: (
  input: CreateRequestRequest,
) => Effect.Effect<
  CreateRequestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateRequestRequest,
  output: CreateRequestResponse,
  errors: [],
}));

export interface UpdateRequestRequest {
  requestId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Request content. */
  content?: string;
  /** Body param: Priority for analyzing the request. */
  priority?: string;
  /** Body param: Requested information from request. */
  requestType?: string;
  /** Body param: Brief description of the request. */
  summary?: string;
  /** Body param: The CISA defined Traffic Light Protocol (TLP). */
  tlp?: "clear" | "amber" | "amber-strict" | "green" | "red";
}

export const UpdateRequestRequest = Schema.Struct({
  requestId: Schema.String.pipe(T.HttpPath("requestId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  content: Schema.optional(Schema.String),
  priority: Schema.optional(Schema.String),
  requestType: Schema.optional(Schema.String).pipe(T.JsonName("request_type")),
  summary: Schema.optional(Schema.String),
  tlp: Schema.optional(
    Schema.Literal("clear", "amber", "amber-strict", "green", "red"),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/cloudforce-one/requests/{requestId}",
  }),
) as unknown as Schema.Schema<UpdateRequestRequest>;

export interface UpdateRequestResponse {
  /** UUID. */
  id: string;
  /** Request content. */
  content: string;
  created: string;
  priority: string;
  /** Requested information from request. */
  request: string;
  /** Brief description of the request. */
  summary: string;
  /** The CISA defined Traffic Light Protocol (TLP). */
  tlp: "clear" | "amber" | "amber-strict" | "green" | "red";
  updated: string;
  completed?: string;
  /** Tokens for the request messages. */
  messageTokens?: number;
  /** Readable Request ID. */
  readableId?: string;
  /** Request Status. */
  status?:
    | "open"
    | "accepted"
    | "reported"
    | "approved"
    | "completed"
    | "declined";
  /** Tokens for the request. */
  tokens?: number;
}

export const UpdateRequestResponse = Schema.Struct({
  id: Schema.String,
  content: Schema.String,
  created: Schema.String,
  priority: Schema.String,
  request: Schema.String,
  summary: Schema.String,
  tlp: Schema.Literal("clear", "amber", "amber-strict", "green", "red"),
  updated: Schema.String,
  completed: Schema.optional(Schema.String),
  messageTokens: Schema.optional(Schema.Number).pipe(
    T.JsonName("message_tokens"),
  ),
  readableId: Schema.optional(Schema.String).pipe(T.JsonName("readable_id")),
  status: Schema.optional(
    Schema.Literal(
      "open",
      "accepted",
      "reported",
      "approved",
      "completed",
      "declined",
    ),
  ),
  tokens: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<UpdateRequestResponse>;

export const updateRequest: (
  input: UpdateRequestRequest,
) => Effect.Effect<
  UpdateRequestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateRequestRequest,
  output: UpdateRequestResponse,
  errors: [],
}));

export interface DeleteRequestRequest {
  requestId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteRequestRequest = Schema.Struct({
  requestId: Schema.String.pipe(T.HttpPath("requestId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cloudforce-one/requests/{requestId}",
  }),
) as unknown as Schema.Schema<DeleteRequestRequest>;

export interface DeleteRequestResponse {
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

export const DeleteRequestResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<DeleteRequestResponse>;

export const deleteRequest: (
  input: DeleteRequestRequest,
) => Effect.Effect<
  DeleteRequestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteRequestRequest,
  output: DeleteRequestResponse,
  errors: [],
}));

export interface ConstantsRequestRequest {
  /** Identifier. */
  accountId: string;
}

export const ConstantsRequestRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/requests/constants",
  }),
) as unknown as Schema.Schema<ConstantsRequestRequest>;

export interface ConstantsRequestResponse {
  priority?: ("routine" | "high" | "urgent")[];
  status?: (
    | "open"
    | "accepted"
    | "reported"
    | "approved"
    | "completed"
    | "declined"
  )[];
  tlp?: ("clear" | "amber" | "amber-strict" | "green" | "red")[];
}

export const ConstantsRequestResponse = Schema.Struct({
  priority: Schema.optional(
    Schema.Array(Schema.Literal("routine", "high", "urgent")),
  ),
  status: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "open",
        "accepted",
        "reported",
        "approved",
        "completed",
        "declined",
      ),
    ),
  ),
  tlp: Schema.optional(
    Schema.Array(
      Schema.Literal("clear", "amber", "amber-strict", "green", "red"),
    ),
  ),
}) as unknown as Schema.Schema<ConstantsRequestResponse>;

export const constantsRequest: (
  input: ConstantsRequestRequest,
) => Effect.Effect<
  ConstantsRequestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ConstantsRequestRequest,
  output: ConstantsRequestResponse,
  errors: [],
}));

export interface QuotaRequestRequest {
  /** Identifier. */
  accountId: string;
}

export const QuotaRequestRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/requests/quota",
  }),
) as unknown as Schema.Schema<QuotaRequestRequest>;

export interface QuotaRequestResponse {
  /** Anniversary date is when annual quota limit is refreshed. */
  anniversaryDate?: string;
  /** Quarter anniversary date is when quota limit is refreshed each quarter. */
  quarterAnniversaryDate?: string;
  /** Tokens for the quarter. */
  quota?: number;
  /** Tokens remaining for the quarter. */
  remaining?: number;
}

export const QuotaRequestResponse = Schema.Struct({
  anniversaryDate: Schema.optional(Schema.String).pipe(
    T.JsonName("anniversary_date"),
  ),
  quarterAnniversaryDate: Schema.optional(Schema.String).pipe(
    T.JsonName("quarter_anniversary_date"),
  ),
  quota: Schema.optional(Schema.Number),
  remaining: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<QuotaRequestResponse>;

export const quotaRequest: (
  input: QuotaRequestRequest,
) => Effect.Effect<
  QuotaRequestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: QuotaRequestRequest,
  output: QuotaRequestResponse,
  errors: [],
}));

// =============================================================================
// RequestAsset
// =============================================================================

export interface PutRequestAssetRequest {
  requestId: string;
  assetId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Asset file to upload. */
  source?: string;
}

export const PutRequestAssetRequest = Schema.Struct({
  requestId: Schema.String.pipe(T.HttpPath("requestId")),
  assetId: Schema.String.pipe(T.HttpPath("assetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  source: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/cloudforce-one/requests/{requestId}/asset/{assetId}",
  }),
) as unknown as Schema.Schema<PutRequestAssetRequest>;

export interface PutRequestAssetResponse {
  /** Asset ID. */
  id: number;
  /** Asset name. */
  name: string;
  /** Defines the asset creation time. */
  created?: string;
  /** Asset description. */
  description?: string;
  /** Asset file type. */
  fileType?: string;
}

export const PutRequestAssetResponse = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  created: Schema.optional(Schema.String),
  description: Schema.optional(Schema.String),
  fileType: Schema.optional(Schema.String).pipe(T.JsonName("file_type")),
}) as unknown as Schema.Schema<PutRequestAssetResponse>;

export const putRequestAsset: (
  input: PutRequestAssetRequest,
) => Effect.Effect<
  PutRequestAssetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutRequestAssetRequest,
  output: PutRequestAssetResponse,
  errors: [],
}));

export interface DeleteRequestAssetRequest {
  requestId: string;
  assetId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteRequestAssetRequest = Schema.Struct({
  requestId: Schema.String.pipe(T.HttpPath("requestId")),
  assetId: Schema.String.pipe(T.HttpPath("assetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cloudforce-one/requests/{requestId}/asset/{assetId}",
  }),
) as unknown as Schema.Schema<DeleteRequestAssetRequest>;

export interface DeleteRequestAssetResponse {
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

export const DeleteRequestAssetResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<DeleteRequestAssetResponse>;

export const deleteRequestAsset: (
  input: DeleteRequestAssetRequest,
) => Effect.Effect<
  DeleteRequestAssetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteRequestAssetRequest,
  output: DeleteRequestAssetResponse,
  errors: [],
}));

// =============================================================================
// RequestMessage
// =============================================================================

export interface CreateRequestMessageRequest {
  requestId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Content of message. */
  content?: string;
}

export const CreateRequestMessageRequest = Schema.Struct({
  requestId: Schema.String.pipe(T.HttpPath("requestId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  content: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cloudforce-one/requests/{requestId}/message/new",
  }),
) as unknown as Schema.Schema<CreateRequestMessageRequest>;

export interface CreateRequestMessageResponse {
  code: number;
  message: string;
  documentationUrl?: string;
  source?: { pointer?: string };
}

export const CreateRequestMessageResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<CreateRequestMessageResponse>;

export const createRequestMessage: (
  input: CreateRequestMessageRequest,
) => Effect.Effect<
  CreateRequestMessageResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateRequestMessageRequest,
  output: CreateRequestMessageResponse,
  errors: [],
}));

export interface UpdateRequestMessageRequest {
  requestId: string;
  messageId: number;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Content of message. */
  content?: string;
}

export const UpdateRequestMessageRequest = Schema.Struct({
  requestId: Schema.String.pipe(T.HttpPath("requestId")),
  messageId: Schema.Number.pipe(T.HttpPath("messageId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  content: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/cloudforce-one/requests/{requestId}/message/{messageId}",
  }),
) as unknown as Schema.Schema<UpdateRequestMessageRequest>;

export interface UpdateRequestMessageResponse {
  code: number;
  message: string;
  documentationUrl?: string;
  source?: { pointer?: string };
}

export const UpdateRequestMessageResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<UpdateRequestMessageResponse>;

export const updateRequestMessage: (
  input: UpdateRequestMessageRequest,
) => Effect.Effect<
  UpdateRequestMessageResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateRequestMessageRequest,
  output: UpdateRequestMessageResponse,
  errors: [],
}));

export interface DeleteRequestMessageRequest {
  requestId: string;
  messageId: number;
  /** Identifier. */
  accountId: string;
}

export const DeleteRequestMessageRequest = Schema.Struct({
  requestId: Schema.String.pipe(T.HttpPath("requestId")),
  messageId: Schema.Number.pipe(T.HttpPath("messageId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cloudforce-one/requests/{requestId}/message/{messageId}",
  }),
) as unknown as Schema.Schema<DeleteRequestMessageRequest>;

export interface DeleteRequestMessageResponse {
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

export const DeleteRequestMessageResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<DeleteRequestMessageResponse>;

export const deleteRequestMessage: (
  input: DeleteRequestMessageRequest,
) => Effect.Effect<
  DeleteRequestMessageResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteRequestMessageRequest,
  output: DeleteRequestMessageResponse,
  errors: [],
}));

// =============================================================================
// RequestPriority
// =============================================================================

export interface GetRequestPriorityRequest {
  priorityId: string;
  /** Identifier. */
  accountId: string;
}

export const GetRequestPriorityRequest = Schema.Struct({
  priorityId: Schema.String.pipe(T.HttpPath("priorityId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/requests/priority/{priorityId}",
  }),
) as unknown as Schema.Schema<GetRequestPriorityRequest>;

export type GetRequestPriorityResponse = unknown;

export const GetRequestPriorityResponse =
  Schema.Unknown as unknown as Schema.Schema<GetRequestPriorityResponse>;

export const getRequestPriority: (
  input: GetRequestPriorityRequest,
) => Effect.Effect<
  GetRequestPriorityResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRequestPriorityRequest,
  output: GetRequestPriorityResponse,
  errors: [],
}));

export interface CreateRequestPriorityRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: List of labels. */
  labels: string[];
  /** Body param: Priority. */
  priority: number;
  /** Body param: Requirement. */
  requirement: string;
  /** Body param: The CISA defined Traffic Light Protocol (TLP). */
  tlp: "clear" | "amber" | "amber-strict" | "green" | "red";
}

export const CreateRequestPriorityRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  labels: Schema.Array(Schema.String),
  priority: Schema.Number,
  requirement: Schema.String,
  tlp: Schema.Literal("clear", "amber", "amber-strict", "green", "red"),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cloudforce-one/requests/priority/new",
  }),
) as unknown as Schema.Schema<CreateRequestPriorityRequest>;

export interface CreateRequestPriorityResponse {
  /** UUID. */
  id: string;
  /** Priority creation time. */
  created: string;
  /** List of labels. */
  labels: string[];
  /** Priority. */
  priority: number;
  /** Requirement. */
  requirement: string;
  /** The CISA defined Traffic Light Protocol (TLP). */
  tlp: "clear" | "amber" | "amber-strict" | "green" | "red";
  /** Priority last updated time. */
  updated: string;
}

export const CreateRequestPriorityResponse = Schema.Struct({
  id: Schema.String,
  created: Schema.String,
  labels: Schema.Array(Schema.String),
  priority: Schema.Number,
  requirement: Schema.String,
  tlp: Schema.Literal("clear", "amber", "amber-strict", "green", "red"),
  updated: Schema.String,
}) as unknown as Schema.Schema<CreateRequestPriorityResponse>;

export const createRequestPriority: (
  input: CreateRequestPriorityRequest,
) => Effect.Effect<
  CreateRequestPriorityResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateRequestPriorityRequest,
  output: CreateRequestPriorityResponse,
  errors: [],
}));

export interface UpdateRequestPriorityRequest {
  priorityId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: List of labels. */
  labels: string[];
  /** Body param: Priority. */
  priority: number;
  /** Body param: Requirement. */
  requirement: string;
  /** Body param: The CISA defined Traffic Light Protocol (TLP). */
  tlp: "clear" | "amber" | "amber-strict" | "green" | "red";
}

export const UpdateRequestPriorityRequest = Schema.Struct({
  priorityId: Schema.String.pipe(T.HttpPath("priorityId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  labels: Schema.Array(Schema.String),
  priority: Schema.Number,
  requirement: Schema.String,
  tlp: Schema.Literal("clear", "amber", "amber-strict", "green", "red"),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/cloudforce-one/requests/priority/{priorityId}",
  }),
) as unknown as Schema.Schema<UpdateRequestPriorityRequest>;

export type UpdateRequestPriorityResponse = unknown;

export const UpdateRequestPriorityResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateRequestPriorityResponse>;

export const updateRequestPriority: (
  input: UpdateRequestPriorityRequest,
) => Effect.Effect<
  UpdateRequestPriorityResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateRequestPriorityRequest,
  output: UpdateRequestPriorityResponse,
  errors: [],
}));

export interface DeleteRequestPriorityRequest {
  priorityId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteRequestPriorityRequest = Schema.Struct({
  priorityId: Schema.String.pipe(T.HttpPath("priorityId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cloudforce-one/requests/priority/{priorityId}",
  }),
) as unknown as Schema.Schema<DeleteRequestPriorityRequest>;

export interface DeleteRequestPriorityResponse {
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

export const DeleteRequestPriorityResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<DeleteRequestPriorityResponse>;

export const deleteRequestPriority: (
  input: DeleteRequestPriorityRequest,
) => Effect.Effect<
  DeleteRequestPriorityResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteRequestPriorityRequest,
  output: DeleteRequestPriorityResponse,
  errors: [],
}));

export interface QuotaRequestPriorityRequest {
  /** Identifier. */
  accountId: string;
}

export const QuotaRequestPriorityRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/requests/priority/quota",
  }),
) as unknown as Schema.Schema<QuotaRequestPriorityRequest>;

export type QuotaRequestPriorityResponse = unknown;

export const QuotaRequestPriorityResponse =
  Schema.Unknown as unknown as Schema.Schema<QuotaRequestPriorityResponse>;

export const quotaRequestPriority: (
  input: QuotaRequestPriorityRequest,
) => Effect.Effect<
  QuotaRequestPriorityResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: QuotaRequestPriorityRequest,
  output: QuotaRequestPriorityResponse,
  errors: [],
}));

// =============================================================================
// ScanConfig
// =============================================================================

export interface CreateScanConfigRequest {
  /** Path param: Defines the Account ID. */
  accountId: string;
  /** Body param: Defines a list of IP addresses or CIDR blocks to scan. The maximum number of total IP addresses allowed is 5000. */
  ips: string[];
  /** Body param: Defines the number of days between each scan (0 = One-off scan). */
  frequency?: number;
  /** Body param: Defines a list of ports to scan. Valid values are:"default", "all", or a comma-separated list of ports or range of ports (e.g. ["1-80", "443"]). "default" scans the 100 most commonly open  */
  ports?: string[];
}

export const CreateScanConfigRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  ips: Schema.Array(Schema.String),
  frequency: Schema.optional(Schema.Number),
  ports: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cloudforce-one/scans/config",
  }),
) as unknown as Schema.Schema<CreateScanConfigRequest>;

export interface CreateScanConfigResponse {
  /** Defines the Config ID. */
  id: string;
  accountId: string;
  /** Defines the number of days between each scan (0 = One-off scan). */
  frequency: number;
  /** Defines a list of IP addresses or CIDR blocks to scan. The maximum number of total IP addresses allowed is 5000. */
  ips: string[];
  /** Defines a list of ports to scan. Valid values are:"default", "all", or a comma-separated list of ports or range of ports (e.g. ["1-80", "443"]). "default" scans the 100 most commonly open ports. */
  ports: string[];
}

export const CreateScanConfigResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.String.pipe(T.JsonName("account_id")),
  frequency: Schema.Number,
  ips: Schema.Array(Schema.String),
  ports: Schema.Array(Schema.String),
}) as unknown as Schema.Schema<CreateScanConfigResponse>;

export const createScanConfig: (
  input: CreateScanConfigRequest,
) => Effect.Effect<
  CreateScanConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateScanConfigRequest,
  output: CreateScanConfigResponse,
  errors: [],
}));

export interface PatchScanConfigRequest {
  configId: string;
  /** Path param: Defines the Account ID. */
  accountId: string;
  /** Body param: Defines the number of days between each scan (0 = One-off scan). */
  frequency?: number;
  /** Body param: Defines a list of IP addresses or CIDR blocks to scan. The maximum number of total IP addresses allowed is 5000. */
  ips?: string[];
  /** Body param: Defines a list of ports to scan. Valid values are:"default", "all", or a comma-separated list of ports or range of ports (e.g. ["1-80", "443"]). "default" scans the 100 most commonly open  */
  ports?: string[];
}

export const PatchScanConfigRequest = Schema.Struct({
  configId: Schema.String.pipe(T.HttpPath("configId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  frequency: Schema.optional(Schema.Number),
  ips: Schema.optional(Schema.Array(Schema.String)),
  ports: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/cloudforce-one/scans/config/{configId}",
  }),
) as unknown as Schema.Schema<PatchScanConfigRequest>;

export interface PatchScanConfigResponse {
  /** Defines the Config ID. */
  id: string;
  accountId: string;
  /** Defines the number of days between each scan (0 = One-off scan). */
  frequency: number;
  /** Defines a list of IP addresses or CIDR blocks to scan. The maximum number of total IP addresses allowed is 5000. */
  ips: string[];
  /** Defines a list of ports to scan. Valid values are:"default", "all", or a comma-separated list of ports or range of ports (e.g. ["1-80", "443"]). "default" scans the 100 most commonly open ports. */
  ports: string[];
}

export const PatchScanConfigResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.String.pipe(T.JsonName("account_id")),
  frequency: Schema.Number,
  ips: Schema.Array(Schema.String),
  ports: Schema.Array(Schema.String),
}) as unknown as Schema.Schema<PatchScanConfigResponse>;

export const patchScanConfig: (
  input: PatchScanConfigRequest,
) => Effect.Effect<
  PatchScanConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchScanConfigRequest,
  output: PatchScanConfigResponse,
  errors: [],
}));

export interface DeleteScanConfigRequest {
  configId: string;
  /** Defines the Account ID. */
  accountId: string;
}

export const DeleteScanConfigRequest = Schema.Struct({
  configId: Schema.String.pipe(T.HttpPath("configId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cloudforce-one/scans/config/{configId}",
  }),
) as unknown as Schema.Schema<DeleteScanConfigRequest>;

export type DeleteScanConfigResponse = unknown;

export const DeleteScanConfigResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteScanConfigResponse>;

export const deleteScanConfig: (
  input: DeleteScanConfigRequest,
) => Effect.Effect<
  DeleteScanConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteScanConfigRequest,
  output: DeleteScanConfigResponse,
  errors: [],
}));

// =============================================================================
// ScanResult
// =============================================================================

export interface GetScanResultRequest {
  configId: string;
  /** Defines the Account ID. */
  accountId: string;
}

export const GetScanResultRequest = Schema.Struct({
  configId: Schema.String.pipe(T.HttpPath("configId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/scans/results/{configId}",
  }),
) as unknown as Schema.Schema<GetScanResultRequest>;

export interface GetScanResultResponse {
  "1.1.1.1": { number?: number; proto?: string; status?: string }[];
}

export const GetScanResultResponse = Schema.Struct({
  "1.1.1.1": Schema.Array(
    Schema.Struct({
      number: Schema.optional(Schema.Number),
      proto: Schema.optional(Schema.String),
      status: Schema.optional(Schema.String),
    }),
  ),
}) as unknown as Schema.Schema<GetScanResultResponse>;

export const getScanResult: (
  input: GetScanResultRequest,
) => Effect.Effect<
  GetScanResultResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetScanResultRequest,
  output: GetScanResultResponse,
  errors: [],
}));

// =============================================================================
// ThreatEvent
// =============================================================================

export interface GetThreatEventRequest {
  eventId: string;
  /** Account ID. */
  accountId: string;
}

export const GetThreatEventRequest = Schema.Struct({
  eventId: Schema.String.pipe(T.HttpPath("eventId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events/{eventId}",
  }),
) as unknown as Schema.Schema<GetThreatEventRequest>;

export interface GetThreatEventResponse {
  attacker: string;
  attackerCountry: string;
  category: string;
  date: string;
  event: string;
  indicator: string;
  indicatorType: string;
  indicatorTypeId: number;
  killChain: number;
  mitreAttack: string[];
  numReferenced: number;
  numReferences: number;
  rawId: string;
  referenced: string[];
  referencedIds: number[];
  references: string[];
  referencesIds: number[];
  tags: string[];
  targetCountry: string;
  targetIndustry: string;
  tlp: string;
  uuid: string;
  insight?: string;
  releasabilityId?: string;
}

export const GetThreatEventResponse = Schema.Struct({
  attacker: Schema.String,
  attackerCountry: Schema.String,
  category: Schema.String,
  date: Schema.String,
  event: Schema.String,
  indicator: Schema.String,
  indicatorType: Schema.String,
  indicatorTypeId: Schema.Number,
  killChain: Schema.Number,
  mitreAttack: Schema.Array(Schema.String),
  numReferenced: Schema.Number,
  numReferences: Schema.Number,
  rawId: Schema.String,
  referenced: Schema.Array(Schema.String),
  referencedIds: Schema.Array(Schema.Number),
  references: Schema.Array(Schema.String),
  referencesIds: Schema.Array(Schema.Number),
  tags: Schema.Array(Schema.String),
  targetCountry: Schema.String,
  targetIndustry: Schema.String,
  tlp: Schema.String,
  uuid: Schema.String,
  insight: Schema.optional(Schema.String),
  releasabilityId: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetThreatEventResponse>;

export const getThreatEvent: (
  input: GetThreatEventRequest,
) => Effect.Effect<
  GetThreatEventResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetThreatEventRequest,
  output: GetThreatEventResponse,
  errors: [],
}));

export interface ListThreatEventsRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Query param: */
  datasetId?: string[];
  /** Query param: */
  forceRefresh?: boolean;
  /** Query param: */
  order?: "asc" | "desc";
  /** Query param: */
  orderBy?: string;
  /** Query param: */
  page?: number;
  /** Query param: */
  pageSize?: number;
  /** Query param: */
  search?: {
    field?: string;
    op?:
      | "equals"
      | "not"
      | "gt"
      | "gte"
      | "lt"
      | "lte"
      | "like"
      | "contains"
      | "startsWith"
      | "endsWith"
      | "in"
      | "find";
    value?: string | number | (string | number)[];
  }[];
}

export const ListThreatEventsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  datasetId: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("datasetId"),
  ),
  forceRefresh: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("forceRefresh"),
  ),
  order: Schema.optional(Schema.Literal("asc", "desc")).pipe(
    T.HttpQuery("order"),
  ),
  orderBy: Schema.optional(Schema.String).pipe(T.HttpQuery("orderBy")),
  page: Schema.optional(Schema.Number).pipe(T.HttpQuery("page")),
  pageSize: Schema.optional(Schema.Number).pipe(T.HttpQuery("pageSize")),
  search: Schema.optional(
    Schema.Array(
      Schema.Struct({
        field: Schema.optional(Schema.String),
        op: Schema.optional(
          Schema.Literal(
            "equals",
            "not",
            "gt",
            "gte",
            "lt",
            "lte",
            "like",
            "contains",
            "startsWith",
            "endsWith",
            "in",
            "find",
          ),
        ),
        value: Schema.optional(
          Schema.Union(
            Schema.String,
            Schema.Number,
            Schema.Array(Schema.Union(Schema.String, Schema.Number)),
          ),
        ),
      }),
    ),
  ).pipe(T.HttpQuery("search")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events",
  }),
) as unknown as Schema.Schema<ListThreatEventsRequest>;

export type ListThreatEventsResponse = {
  attacker: string;
  attackerCountry: string;
  category: string;
  date: string;
  event: string;
  indicator: string;
  indicatorType: string;
  indicatorTypeId: number;
  killChain: number;
  mitreAttack: string[];
  numReferenced: number;
  numReferences: number;
  rawId: string;
  referenced: string[];
  referencedIds: number[];
  references: string[];
  referencesIds: number[];
  tags: string[];
  targetCountry: string;
  targetIndustry: string;
  tlp: string;
  uuid: string;
  insight?: string;
  releasabilityId?: string;
}[];

export const ListThreatEventsResponse = Schema.Array(
  Schema.Struct({
    attacker: Schema.String,
    attackerCountry: Schema.String,
    category: Schema.String,
    date: Schema.String,
    event: Schema.String,
    indicator: Schema.String,
    indicatorType: Schema.String,
    indicatorTypeId: Schema.Number,
    killChain: Schema.Number,
    mitreAttack: Schema.Array(Schema.String),
    numReferenced: Schema.Number,
    numReferences: Schema.Number,
    rawId: Schema.String,
    referenced: Schema.Array(Schema.String),
    referencedIds: Schema.Array(Schema.Number),
    references: Schema.Array(Schema.String),
    referencesIds: Schema.Array(Schema.Number),
    tags: Schema.Array(Schema.String),
    targetCountry: Schema.String,
    targetIndustry: Schema.String,
    tlp: Schema.String,
    uuid: Schema.String,
    insight: Schema.optional(Schema.String),
    releasabilityId: Schema.optional(Schema.String),
  }),
) as unknown as Schema.Schema<ListThreatEventsResponse>;

export const listThreatEvents: (
  input: ListThreatEventsRequest,
) => Effect.Effect<
  ListThreatEventsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListThreatEventsRequest,
  output: ListThreatEventsResponse,
  errors: [],
}));

export interface CreateThreatEventRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: */
  category: string;
  /** Body param: */
  date: string;
  /** Body param: */
  event: string;
  /** Body param: */
  indicatorType: string;
  /** Body param: */
  raw: { data: Record<string, unknown> | null; source?: string; tlp?: string };
  /** Body param: */
  tlp: string;
  /** Body param: */
  attacker?: string | null;
  /** Body param: */
  attackerCountry?: string;
  /** Body param: */
  datasetId?: string;
  /** Body param: */
  indicator?: string;
  /** Body param: */
  insight?: string;
  /** Body param: */
  tags?: string[];
  /** Body param: */
  targetCountry?: string;
  /** Body param: */
  targetIndustry?: string;
}

export const CreateThreatEventRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  category: Schema.String,
  date: Schema.String,
  event: Schema.String,
  indicatorType: Schema.String,
  raw: Schema.Struct({
    data: Schema.Union(Schema.Struct({}), Schema.Null),
    source: Schema.optional(Schema.String),
    tlp: Schema.optional(Schema.String),
  }),
  tlp: Schema.String,
  attacker: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  attackerCountry: Schema.optional(Schema.String),
  datasetId: Schema.optional(Schema.String),
  indicator: Schema.optional(Schema.String),
  insight: Schema.optional(Schema.String),
  tags: Schema.optional(Schema.Array(Schema.String)),
  targetCountry: Schema.optional(Schema.String),
  targetIndustry: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cloudforce-one/events/create",
  }),
) as unknown as Schema.Schema<CreateThreatEventRequest>;

export interface CreateThreatEventResponse {
  attacker: string;
  attackerCountry: string;
  category: string;
  date: string;
  event: string;
  indicator: string;
  indicatorType: string;
  indicatorTypeId: number;
  killChain: number;
  mitreAttack: string[];
  numReferenced: number;
  numReferences: number;
  rawId: string;
  referenced: string[];
  referencedIds: number[];
  references: string[];
  referencesIds: number[];
  tags: string[];
  targetCountry: string;
  targetIndustry: string;
  tlp: string;
  uuid: string;
  insight?: string;
  releasabilityId?: string;
}

export const CreateThreatEventResponse = Schema.Struct({
  attacker: Schema.String,
  attackerCountry: Schema.String,
  category: Schema.String,
  date: Schema.String,
  event: Schema.String,
  indicator: Schema.String,
  indicatorType: Schema.String,
  indicatorTypeId: Schema.Number,
  killChain: Schema.Number,
  mitreAttack: Schema.Array(Schema.String),
  numReferenced: Schema.Number,
  numReferences: Schema.Number,
  rawId: Schema.String,
  referenced: Schema.Array(Schema.String),
  referencedIds: Schema.Array(Schema.Number),
  references: Schema.Array(Schema.String),
  referencesIds: Schema.Array(Schema.Number),
  tags: Schema.Array(Schema.String),
  targetCountry: Schema.String,
  targetIndustry: Schema.String,
  tlp: Schema.String,
  uuid: Schema.String,
  insight: Schema.optional(Schema.String),
  releasabilityId: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateThreatEventResponse>;

export const createThreatEvent: (
  input: CreateThreatEventRequest,
) => Effect.Effect<
  CreateThreatEventResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateThreatEventRequest,
  output: CreateThreatEventResponse,
  errors: [],
}));

export interface PatchThreatEventRequest {
  eventId: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: */
  attacker?: string | null;
  /** Body param: */
  attackerCountry?: string;
  /** Body param: */
  category?: string;
  /** Body param: */
  date?: string;
  /** Body param: */
  event?: string;
  /** Body param: */
  indicator?: string;
  /** Body param: */
  indicatorType?: string;
  /** Body param: */
  insight?: string;
  /** Body param: */
  raw?: {
    data?: Record<string, unknown> | null;
    source?: string;
    tlp?: string;
  };
  /** Body param: */
  targetCountry?: string;
  /** Body param: */
  targetIndustry?: string;
  /** Body param: */
  tlp?: string;
}

export const PatchThreatEventRequest = Schema.Struct({
  eventId: Schema.String.pipe(T.HttpPath("eventId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  attacker: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  attackerCountry: Schema.optional(Schema.String),
  category: Schema.optional(Schema.String),
  date: Schema.optional(Schema.String),
  event: Schema.optional(Schema.String),
  indicator: Schema.optional(Schema.String),
  indicatorType: Schema.optional(Schema.String),
  insight: Schema.optional(Schema.String),
  raw: Schema.optional(
    Schema.Struct({
      data: Schema.optional(Schema.Union(Schema.Struct({}), Schema.Null)),
      source: Schema.optional(Schema.String),
      tlp: Schema.optional(Schema.String),
    }),
  ),
  targetCountry: Schema.optional(Schema.String),
  targetIndustry: Schema.optional(Schema.String),
  tlp: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/cloudforce-one/events/{eventId}",
  }),
) as unknown as Schema.Schema<PatchThreatEventRequest>;

export interface PatchThreatEventResponse {
  attacker: string;
  attackerCountry: string;
  category: string;
  date: string;
  event: string;
  indicator: string;
  indicatorType: string;
  indicatorTypeId: number;
  killChain: number;
  mitreAttack: string[];
  numReferenced: number;
  numReferences: number;
  rawId: string;
  referenced: string[];
  referencedIds: number[];
  references: string[];
  referencesIds: number[];
  tags: string[];
  targetCountry: string;
  targetIndustry: string;
  tlp: string;
  uuid: string;
  insight?: string;
  releasabilityId?: string;
}

export const PatchThreatEventResponse = Schema.Struct({
  attacker: Schema.String,
  attackerCountry: Schema.String,
  category: Schema.String,
  date: Schema.String,
  event: Schema.String,
  indicator: Schema.String,
  indicatorType: Schema.String,
  indicatorTypeId: Schema.Number,
  killChain: Schema.Number,
  mitreAttack: Schema.Array(Schema.String),
  numReferenced: Schema.Number,
  numReferences: Schema.Number,
  rawId: Schema.String,
  referenced: Schema.Array(Schema.String),
  referencedIds: Schema.Array(Schema.Number),
  references: Schema.Array(Schema.String),
  referencesIds: Schema.Array(Schema.Number),
  tags: Schema.Array(Schema.String),
  targetCountry: Schema.String,
  targetIndustry: Schema.String,
  tlp: Schema.String,
  uuid: Schema.String,
  insight: Schema.optional(Schema.String),
  releasabilityId: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PatchThreatEventResponse>;

export const patchThreatEvent: (
  input: PatchThreatEventRequest,
) => Effect.Effect<
  PatchThreatEventResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchThreatEventRequest,
  output: PatchThreatEventResponse,
  errors: [],
}));

export interface DeleteThreatEventRequest {
  eventId: string;
  /** Account ID. */
  accountId: string;
}

export const DeleteThreatEventRequest = Schema.Struct({
  eventId: Schema.String.pipe(T.HttpPath("eventId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cloudforce-one/events/{eventId}",
  }),
) as unknown as Schema.Schema<DeleteThreatEventRequest>;

export interface DeleteThreatEventResponse {
  uuid: string;
}

export const DeleteThreatEventResponse = Schema.Struct({
  uuid: Schema.String,
}) as unknown as Schema.Schema<DeleteThreatEventResponse>;

export const deleteThreatEvent: (
  input: DeleteThreatEventRequest,
) => Effect.Effect<
  DeleteThreatEventResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteThreatEventRequest,
  output: DeleteThreatEventResponse,
  errors: [],
}));

export interface BulkCreateThreatEventsRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: */
  data: {
    category: string;
    date: string;
    event: string;
    indicatorType: string;
    raw: {
      data: Record<string, unknown> | null;
      source?: string;
      tlp?: string;
    };
    tlp: string;
    accountId?: number;
    attacker?: string | null;
    attackerCountry?: string;
    datasetId?: string;
    indicator?: string;
    insight?: string;
    tags?: string[];
    targetCountry?: string;
    targetIndustry?: string;
  }[];
  /** Body param: */
  datasetId: string;
}

export const BulkCreateThreatEventsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  data: Schema.Array(
    Schema.Struct({
      category: Schema.String,
      date: Schema.String,
      event: Schema.String,
      indicatorType: Schema.String,
      raw: Schema.Struct({
        data: Schema.Union(Schema.Struct({}), Schema.Null),
        source: Schema.optional(Schema.String),
        tlp: Schema.optional(Schema.String),
      }),
      tlp: Schema.String,
      accountId: Schema.optional(Schema.Number),
      attacker: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      attackerCountry: Schema.optional(Schema.String),
      datasetId: Schema.optional(Schema.String),
      indicator: Schema.optional(Schema.String),
      insight: Schema.optional(Schema.String),
      tags: Schema.optional(Schema.Array(Schema.String)),
      targetCountry: Schema.optional(Schema.String),
      targetIndustry: Schema.optional(Schema.String),
    }),
  ),
  datasetId: Schema.String,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cloudforce-one/events/create/bulk",
  }),
) as unknown as Schema.Schema<BulkCreateThreatEventsRequest>;

export type BulkCreateThreatEventsResponse = number;

export const BulkCreateThreatEventsResponse =
  Schema.Number as unknown as Schema.Schema<BulkCreateThreatEventsResponse>;

export const bulkCreateThreatEvents: (
  input: BulkCreateThreatEventsRequest,
) => Effect.Effect<
  BulkCreateThreatEventsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkCreateThreatEventsRequest,
  output: BulkCreateThreatEventsResponse,
  errors: [],
}));

// =============================================================================
// ThreatEventAttacker
// =============================================================================

export interface ListThreatEventAttackersRequest {
  /** Account ID. */
  accountId: string;
}

export const ListThreatEventAttackersRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events/attackers",
  }),
) as unknown as Schema.Schema<ListThreatEventAttackersRequest>;

export interface ListThreatEventAttackersResponse {
  items: { type: string };
  type: string;
}

export const ListThreatEventAttackersResponse = Schema.Struct({
  items: Schema.Struct({
    type: Schema.String,
  }),
  type: Schema.String,
}) as unknown as Schema.Schema<ListThreatEventAttackersResponse>;

export const listThreatEventAttackers: (
  input: ListThreatEventAttackersRequest,
) => Effect.Effect<
  ListThreatEventAttackersResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListThreatEventAttackersRequest,
  output: ListThreatEventAttackersResponse,
  errors: [],
}));

// =============================================================================
// ThreatEventCategory
// =============================================================================

export interface GetThreatEventCategoryRequest {
  categoryId: string;
  /** Account ID. */
  accountId: string;
}

export const GetThreatEventCategoryRequest = Schema.Struct({
  categoryId: Schema.String.pipe(T.HttpPath("categoryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events/categories/{categoryId}",
  }),
) as unknown as Schema.Schema<GetThreatEventCategoryRequest>;

export interface GetThreatEventCategoryResponse {
  killChain: number;
  name: string;
  uuid: string;
  mitreAttack?: string[];
  shortname?: string;
}

export const GetThreatEventCategoryResponse = Schema.Struct({
  killChain: Schema.Number,
  name: Schema.String,
  uuid: Schema.String,
  mitreAttack: Schema.optional(Schema.Array(Schema.String)),
  shortname: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetThreatEventCategoryResponse>;

export const getThreatEventCategory: (
  input: GetThreatEventCategoryRequest,
) => Effect.Effect<
  GetThreatEventCategoryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetThreatEventCategoryRequest,
  output: GetThreatEventCategoryResponse,
  errors: [],
}));

export interface ListThreatEventCategoriesRequest {
  /** Account ID. */
  accountId: string;
}

export const ListThreatEventCategoriesRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events/categories",
  }),
) as unknown as Schema.Schema<ListThreatEventCategoriesRequest>;

export type ListThreatEventCategoriesResponse = {
  killChain: number;
  name: string;
  uuid: string;
  mitreAttack?: string[];
  shortname?: string;
}[];

export const ListThreatEventCategoriesResponse = Schema.Array(
  Schema.Struct({
    killChain: Schema.Number,
    name: Schema.String,
    uuid: Schema.String,
    mitreAttack: Schema.optional(Schema.Array(Schema.String)),
    shortname: Schema.optional(Schema.String),
  }),
) as unknown as Schema.Schema<ListThreatEventCategoriesResponse>;

export const listThreatEventCategories: (
  input: ListThreatEventCategoriesRequest,
) => Effect.Effect<
  ListThreatEventCategoriesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListThreatEventCategoriesRequest,
  output: ListThreatEventCategoriesResponse,
  errors: [],
}));

export interface CreateThreatEventCategoryRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: */
  killChain: number;
  /** Body param: */
  name: string;
  /** Body param: */
  mitreAttack?: string[];
  /** Body param: */
  shortname?: string;
}

export const CreateThreatEventCategoryRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  killChain: Schema.Number,
  name: Schema.String,
  mitreAttack: Schema.optional(Schema.Array(Schema.String)),
  shortname: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cloudforce-one/events/categories/create",
  }),
) as unknown as Schema.Schema<CreateThreatEventCategoryRequest>;

export interface CreateThreatEventCategoryResponse {
  killChain: number;
  name: string;
  uuid: string;
  mitreAttack?: string[];
  shortname?: string;
}

export const CreateThreatEventCategoryResponse = Schema.Struct({
  killChain: Schema.Number,
  name: Schema.String,
  uuid: Schema.String,
  mitreAttack: Schema.optional(Schema.Array(Schema.String)),
  shortname: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateThreatEventCategoryResponse>;

export const createThreatEventCategory: (
  input: CreateThreatEventCategoryRequest,
) => Effect.Effect<
  CreateThreatEventCategoryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateThreatEventCategoryRequest,
  output: CreateThreatEventCategoryResponse,
  errors: [],
}));

export interface PatchThreatEventCategoryRequest {
  categoryId: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: */
  killChain?: number;
  /** Body param: */
  mitreAttack?: string[];
  /** Body param: */
  name?: string;
  /** Body param: */
  shortname?: string;
}

export const PatchThreatEventCategoryRequest = Schema.Struct({
  categoryId: Schema.String.pipe(T.HttpPath("categoryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  killChain: Schema.optional(Schema.Number),
  mitreAttack: Schema.optional(Schema.Array(Schema.String)),
  name: Schema.optional(Schema.String),
  shortname: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/cloudforce-one/events/categories/{categoryId}",
  }),
) as unknown as Schema.Schema<PatchThreatEventCategoryRequest>;

export interface PatchThreatEventCategoryResponse {
  killChain: number;
  name: string;
  uuid: string;
  mitreAttack?: string[];
  shortname?: string;
}

export const PatchThreatEventCategoryResponse = Schema.Struct({
  killChain: Schema.Number,
  name: Schema.String,
  uuid: Schema.String,
  mitreAttack: Schema.optional(Schema.Array(Schema.String)),
  shortname: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PatchThreatEventCategoryResponse>;

export const patchThreatEventCategory: (
  input: PatchThreatEventCategoryRequest,
) => Effect.Effect<
  PatchThreatEventCategoryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchThreatEventCategoryRequest,
  output: PatchThreatEventCategoryResponse,
  errors: [],
}));

export interface DeleteThreatEventCategoryRequest {
  categoryId: string;
  /** Account ID. */
  accountId: string;
}

export const DeleteThreatEventCategoryRequest = Schema.Struct({
  categoryId: Schema.String.pipe(T.HttpPath("categoryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cloudforce-one/events/categories/{categoryId}",
  }),
) as unknown as Schema.Schema<DeleteThreatEventCategoryRequest>;

export interface DeleteThreatEventCategoryResponse {
  uuid: string;
}

export const DeleteThreatEventCategoryResponse = Schema.Struct({
  uuid: Schema.String,
}) as unknown as Schema.Schema<DeleteThreatEventCategoryResponse>;

export const deleteThreatEventCategory: (
  input: DeleteThreatEventCategoryRequest,
) => Effect.Effect<
  DeleteThreatEventCategoryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteThreatEventCategoryRequest,
  output: DeleteThreatEventCategoryResponse,
  errors: [],
}));

// =============================================================================
// ThreatEventCountry
// =============================================================================

export interface ListThreatEventCountriesRequest {
  /** Account ID. */
  accountId: string;
}

export const ListThreatEventCountriesRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events/countries",
  }),
) as unknown as Schema.Schema<ListThreatEventCountriesRequest>;

export type ListThreatEventCountriesResponse = {
  result: { alpha3: string; name: string }[];
  success: string;
}[];

export const ListThreatEventCountriesResponse = Schema.Array(
  Schema.Struct({
    result: Schema.Array(
      Schema.Struct({
        alpha3: Schema.String,
        name: Schema.String,
      }),
    ),
    success: Schema.String,
  }),
) as unknown as Schema.Schema<ListThreatEventCountriesResponse>;

export const listThreatEventCountries: (
  input: ListThreatEventCountriesRequest,
) => Effect.Effect<
  ListThreatEventCountriesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListThreatEventCountriesRequest,
  output: ListThreatEventCountriesResponse,
  errors: [],
}));

// =============================================================================
// ThreatEventDataset
// =============================================================================

export interface GetThreatEventDatasetRequest {
  datasetId: string;
  /** Account ID. */
  accountId: string;
}

export const GetThreatEventDatasetRequest = Schema.Struct({
  datasetId: Schema.String.pipe(T.HttpPath("datasetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events/dataset/{datasetId}",
  }),
) as unknown as Schema.Schema<GetThreatEventDatasetRequest>;

export interface GetThreatEventDatasetResponse {
  isPublic: boolean;
  name: string;
  uuid: string;
}

export const GetThreatEventDatasetResponse = Schema.Struct({
  isPublic: Schema.Boolean,
  name: Schema.String,
  uuid: Schema.String,
}) as unknown as Schema.Schema<GetThreatEventDatasetResponse>;

export const getThreatEventDataset: (
  input: GetThreatEventDatasetRequest,
) => Effect.Effect<
  GetThreatEventDatasetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetThreatEventDatasetRequest,
  output: GetThreatEventDatasetResponse,
  errors: [],
}));

export interface ListThreatEventDatasetsRequest {
  /** Account ID. */
  accountId: string;
}

export const ListThreatEventDatasetsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events/dataset",
  }),
) as unknown as Schema.Schema<ListThreatEventDatasetsRequest>;

export type ListThreatEventDatasetsResponse = {
  isPublic: boolean;
  name: string;
  uuid: string;
}[];

export const ListThreatEventDatasetsResponse = Schema.Array(
  Schema.Struct({
    isPublic: Schema.Boolean,
    name: Schema.String,
    uuid: Schema.String,
  }),
) as unknown as Schema.Schema<ListThreatEventDatasetsResponse>;

export const listThreatEventDatasets: (
  input: ListThreatEventDatasetsRequest,
) => Effect.Effect<
  ListThreatEventDatasetsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListThreatEventDatasetsRequest,
  output: ListThreatEventDatasetsResponse,
  errors: [],
}));

export interface CreateThreatEventDatasetRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: If true, then anyone can search the dataset. If false, then its limited to the account. */
  isPublic: boolean;
  /** Body param: Used to describe the dataset within the account context. */
  name: string;
}

export const CreateThreatEventDatasetRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  isPublic: Schema.Boolean,
  name: Schema.String,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cloudforce-one/events/dataset/create",
  }),
) as unknown as Schema.Schema<CreateThreatEventDatasetRequest>;

export interface CreateThreatEventDatasetResponse {
  isPublic: boolean;
  name: string;
  uuid: string;
}

export const CreateThreatEventDatasetResponse = Schema.Struct({
  isPublic: Schema.Boolean,
  name: Schema.String,
  uuid: Schema.String,
}) as unknown as Schema.Schema<CreateThreatEventDatasetResponse>;

export const createThreatEventDataset: (
  input: CreateThreatEventDatasetRequest,
) => Effect.Effect<
  CreateThreatEventDatasetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateThreatEventDatasetRequest,
  output: CreateThreatEventDatasetResponse,
  errors: [],
}));

export interface PatchThreatEventDatasetRequest {
  datasetId: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: If true, then anyone can search the dataset. If false, then its limited to the account. */
  isPublic: boolean;
  /** Body param: Used to describe the dataset within the account context. */
  name: string;
}

export const PatchThreatEventDatasetRequest = Schema.Struct({
  datasetId: Schema.String.pipe(T.HttpPath("datasetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  isPublic: Schema.Boolean,
  name: Schema.String,
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/cloudforce-one/events/dataset/{datasetId}",
  }),
) as unknown as Schema.Schema<PatchThreatEventDatasetRequest>;

export interface PatchThreatEventDatasetResponse {
  isPublic: boolean;
  name: string;
  uuid: string;
}

export const PatchThreatEventDatasetResponse = Schema.Struct({
  isPublic: Schema.Boolean,
  name: Schema.String,
  uuid: Schema.String,
}) as unknown as Schema.Schema<PatchThreatEventDatasetResponse>;

export const patchThreatEventDataset: (
  input: PatchThreatEventDatasetRequest,
) => Effect.Effect<
  PatchThreatEventDatasetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchThreatEventDatasetRequest,
  output: PatchThreatEventDatasetResponse,
  errors: [],
}));

export interface RawThreatEventDatasetRequest {
  datasetId: string;
  eventId: string;
  /** Account ID. */
  accountId: string;
}

export const RawThreatEventDatasetRequest = Schema.Struct({
  datasetId: Schema.String.pipe(T.HttpPath("datasetId")),
  eventId: Schema.String.pipe(T.HttpPath("eventId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events/raw/{datasetId}/{eventId}",
  }),
) as unknown as Schema.Schema<RawThreatEventDatasetRequest>;

export interface RawThreatEventDatasetResponse {
  id: string;
  accountId: number;
  created: string;
  data: unknown;
  source: string;
  tlp: string;
}

export const RawThreatEventDatasetResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.Number,
  created: Schema.String,
  data: Schema.Unknown,
  source: Schema.String,
  tlp: Schema.String,
}) as unknown as Schema.Schema<RawThreatEventDatasetResponse>;

export const rawThreatEventDataset: (
  input: RawThreatEventDatasetRequest,
) => Effect.Effect<
  RawThreatEventDatasetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RawThreatEventDatasetRequest,
  output: RawThreatEventDatasetResponse,
  errors: [],
}));

// =============================================================================
// ThreatEventEventTag
// =============================================================================

export interface CreateThreatEventEventTagRequest {
  eventId: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: */
  tags: string[];
}

export const CreateThreatEventEventTagRequest = Schema.Struct({
  eventId: Schema.String.pipe(T.HttpPath("eventId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  tags: Schema.Array(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cloudforce-one/events/event_tag/{eventId}/create",
  }),
) as unknown as Schema.Schema<CreateThreatEventEventTagRequest>;

export interface CreateThreatEventEventTagResponse {
  success: boolean;
}

export const CreateThreatEventEventTagResponse = Schema.Struct({
  success: Schema.Boolean,
}) as unknown as Schema.Schema<CreateThreatEventEventTagResponse>;

export const createThreatEventEventTag: (
  input: CreateThreatEventEventTagRequest,
) => Effect.Effect<
  CreateThreatEventEventTagResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateThreatEventEventTagRequest,
  output: CreateThreatEventEventTagResponse,
  errors: [],
}));

export interface DeleteThreatEventEventTagRequest {
  eventId: string;
  /** Account ID. */
  accountId: string;
}

export const DeleteThreatEventEventTagRequest = Schema.Struct({
  eventId: Schema.String.pipe(T.HttpPath("eventId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cloudforce-one/events/event_tag/{eventId}",
  }),
) as unknown as Schema.Schema<DeleteThreatEventEventTagRequest>;

export interface DeleteThreatEventEventTagResponse {
  success: boolean;
}

export const DeleteThreatEventEventTagResponse = Schema.Struct({
  success: Schema.Boolean,
}) as unknown as Schema.Schema<DeleteThreatEventEventTagResponse>;

export const deleteThreatEventEventTag: (
  input: DeleteThreatEventEventTagRequest,
) => Effect.Effect<
  DeleteThreatEventEventTagResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteThreatEventEventTagRequest,
  output: DeleteThreatEventEventTagResponse,
  errors: [],
}));

// =============================================================================
// ThreatEventIndicatorType
// =============================================================================

export interface ListThreatEventIndicatorTypesRequest {
  /** Account ID. */
  accountId: string;
}

export const ListThreatEventIndicatorTypesRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events/indicatorTypes",
  }),
) as unknown as Schema.Schema<ListThreatEventIndicatorTypesRequest>;

export interface ListThreatEventIndicatorTypesResponse {
  items: { type: string };
  type: string;
}

export const ListThreatEventIndicatorTypesResponse = Schema.Struct({
  items: Schema.Struct({
    type: Schema.String,
  }),
  type: Schema.String,
}) as unknown as Schema.Schema<ListThreatEventIndicatorTypesResponse>;

export const listThreatEventIndicatorTypes: (
  input: ListThreatEventIndicatorTypesRequest,
) => Effect.Effect<
  ListThreatEventIndicatorTypesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListThreatEventIndicatorTypesRequest,
  output: ListThreatEventIndicatorTypesResponse,
  errors: [],
}));

// =============================================================================
// ThreatEventRaw
// =============================================================================

export interface GetThreatEventRawRequest {
  eventId: string;
  rawId: string;
  /** Account ID. */
  accountId: string;
}

export const GetThreatEventRawRequest = Schema.Struct({
  eventId: Schema.String.pipe(T.HttpPath("eventId")),
  rawId: Schema.String.pipe(T.HttpPath("rawId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events/{eventId}/raw/{rawId}",
  }),
) as unknown as Schema.Schema<GetThreatEventRawRequest>;

export interface GetThreatEventRawResponse {
  id: string;
  accountId: number;
  created: string;
  data: unknown;
  source: string;
  tlp: string;
}

export const GetThreatEventRawResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.Number,
  created: Schema.String,
  data: Schema.Unknown,
  source: Schema.String,
  tlp: Schema.String,
}) as unknown as Schema.Schema<GetThreatEventRawResponse>;

export const getThreatEventRaw: (
  input: GetThreatEventRawRequest,
) => Effect.Effect<
  GetThreatEventRawResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetThreatEventRawRequest,
  output: GetThreatEventRawResponse,
  errors: [],
}));

export interface PatchThreatEventRawRequest {
  eventId: string;
  rawId: string;
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: */
  data?: unknown;
  /** Body param: */
  source?: string;
  /** Body param: */
  tlp?: string;
}

export const PatchThreatEventRawRequest = Schema.Struct({
  eventId: Schema.String.pipe(T.HttpPath("eventId")),
  rawId: Schema.String.pipe(T.HttpPath("rawId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  data: Schema.optional(Schema.Unknown),
  source: Schema.optional(Schema.String),
  tlp: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/cloudforce-one/events/{eventId}/raw/{rawId}",
  }),
) as unknown as Schema.Schema<PatchThreatEventRawRequest>;

export interface PatchThreatEventRawResponse {
  id: string;
  data: unknown;
}

export const PatchThreatEventRawResponse = Schema.Struct({
  id: Schema.String,
  data: Schema.Unknown,
}) as unknown as Schema.Schema<PatchThreatEventRawResponse>;

export const patchThreatEventRaw: (
  input: PatchThreatEventRawRequest,
) => Effect.Effect<
  PatchThreatEventRawResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchThreatEventRawRequest,
  output: PatchThreatEventRawResponse,
  errors: [],
}));

// =============================================================================
// ThreatEventRelate
// =============================================================================

export interface DeleteThreatEventRelateRequest {
  eventId: string;
  /** Account ID. */
  accountId: string;
}

export const DeleteThreatEventRelateRequest = Schema.Struct({
  eventId: Schema.String.pipe(T.HttpPath("eventId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cloudforce-one/events/relate/{eventId}",
  }),
) as unknown as Schema.Schema<DeleteThreatEventRelateRequest>;

export interface DeleteThreatEventRelateResponse {
  success: boolean;
}

export const DeleteThreatEventRelateResponse = Schema.Struct({
  success: Schema.Boolean,
}) as unknown as Schema.Schema<DeleteThreatEventRelateResponse>;

export const deleteThreatEventRelate: (
  input: DeleteThreatEventRelateRequest,
) => Effect.Effect<
  DeleteThreatEventRelateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteThreatEventRelateRequest,
  output: DeleteThreatEventRelateResponse,
  errors: [],
}));

// =============================================================================
// ThreatEventTag
// =============================================================================

export interface CreateThreatEventTagRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: */
  value: string;
  /** Body param: */
  activeDuration?: string;
  /** Body param: */
  actorCategory?: string;
  /** Body param: */
  aliasGroupNames?: string[];
  /** Body param: */
  aliasGroupNamesInternal?: string[];
  /** Body param: */
  analyticPriority?: number;
  /** Body param: */
  attributionConfidence?: string;
  /** Body param: */
  attributionOrganization?: string;
  /** Body param: */
  categoryUuid?: string;
  /** Body param: */
  externalReferenceLinks?: string[];
  /** Body param: */
  internalDescription?: string;
  /** Body param: */
  motive?: string;
  /** Body param: */
  opsecLevel?: string;
  /** Body param: */
  originCountryISO?: string;
  /** Body param: */
  priority?: number;
  /** Body param: */
  sophisticationLevel?: string;
}

export const CreateThreatEventTagRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  value: Schema.String,
  activeDuration: Schema.optional(Schema.String),
  actorCategory: Schema.optional(Schema.String),
  aliasGroupNames: Schema.optional(Schema.Array(Schema.String)),
  aliasGroupNamesInternal: Schema.optional(Schema.Array(Schema.String)),
  analyticPriority: Schema.optional(Schema.Number),
  attributionConfidence: Schema.optional(Schema.String),
  attributionOrganization: Schema.optional(Schema.String),
  categoryUuid: Schema.optional(Schema.String),
  externalReferenceLinks: Schema.optional(Schema.Array(Schema.String)),
  internalDescription: Schema.optional(Schema.String),
  motive: Schema.optional(Schema.String),
  opsecLevel: Schema.optional(Schema.String),
  originCountryISO: Schema.optional(Schema.String),
  priority: Schema.optional(Schema.Number),
  sophisticationLevel: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cloudforce-one/events/tags/create",
  }),
) as unknown as Schema.Schema<CreateThreatEventTagRequest>;

export interface CreateThreatEventTagResponse {
  uuid: string;
  value: string;
  activeDuration?: string;
  actorCategory?: string;
  aliasGroupNames?: string[];
  aliasGroupNamesInternal?: string[];
  analyticPriority?: number;
  attributionConfidence?: string;
  attributionOrganization?: string;
  categoryName?: string;
  externalReferenceLinks?: string[];
  internalDescription?: string;
  motive?: string;
  opsecLevel?: string;
  originCountryISO?: string;
  priority?: number;
  sophisticationLevel?: string;
}

export const CreateThreatEventTagResponse = Schema.Struct({
  uuid: Schema.String,
  value: Schema.String,
  activeDuration: Schema.optional(Schema.String),
  actorCategory: Schema.optional(Schema.String),
  aliasGroupNames: Schema.optional(Schema.Array(Schema.String)),
  aliasGroupNamesInternal: Schema.optional(Schema.Array(Schema.String)),
  analyticPriority: Schema.optional(Schema.Number),
  attributionConfidence: Schema.optional(Schema.String),
  attributionOrganization: Schema.optional(Schema.String),
  categoryName: Schema.optional(Schema.String),
  externalReferenceLinks: Schema.optional(Schema.Array(Schema.String)),
  internalDescription: Schema.optional(Schema.String),
  motive: Schema.optional(Schema.String),
  opsecLevel: Schema.optional(Schema.String),
  originCountryISO: Schema.optional(Schema.String),
  priority: Schema.optional(Schema.Number),
  sophisticationLevel: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateThreatEventTagResponse>;

export const createThreatEventTag: (
  input: CreateThreatEventTagRequest,
) => Effect.Effect<
  CreateThreatEventTagResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateThreatEventTagRequest,
  output: CreateThreatEventTagResponse,
  errors: [],
}));

// =============================================================================
// ThreatEventTargetIndustry
// =============================================================================

export interface ListThreatEventTargetIndustriesRequest {
  /** Account ID. */
  accountId: string;
}

export const ListThreatEventTargetIndustriesRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cloudforce-one/events/targetIndustries",
  }),
) as unknown as Schema.Schema<ListThreatEventTargetIndustriesRequest>;

export interface ListThreatEventTargetIndustriesResponse {
  items: { type: string };
  type: string;
}

export const ListThreatEventTargetIndustriesResponse = Schema.Struct({
  items: Schema.Struct({
    type: Schema.String,
  }),
  type: Schema.String,
}) as unknown as Schema.Schema<ListThreatEventTargetIndustriesResponse>;

export const listThreatEventTargetIndustries: (
  input: ListThreatEventTargetIndustriesRequest,
) => Effect.Effect<
  ListThreatEventTargetIndustriesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListThreatEventTargetIndustriesRequest,
  output: ListThreatEventTargetIndustriesResponse,
  errors: [],
}));
