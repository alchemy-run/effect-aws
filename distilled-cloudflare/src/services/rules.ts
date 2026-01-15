/**
 * Cloudflare RULES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service rules
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// List
// =============================================================================

export interface GetListRequest {
  listId: string;
  /** The Account ID for this resource. */
  accountId: string;
}

export const GetListRequest = Schema.Struct({
  listId: Schema.String.pipe(T.HttpPath("listId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/rules/lists/{listId}" }),
) as unknown as Schema.Schema<GetListRequest>;

export interface GetListResponse {
  /** The unique ID of the list. */
  id: string;
  /** The RFC 3339 timestamp of when the list was created. */
  createdOn: string;
  /** The type of the list. Each type supports specific list items (IP addresses, ASNs, hostnames or redirects). */
  kind: "ip" | "redirect" | "hostname" | "asn";
  /** The RFC 3339 timestamp of when the list was last modified. */
  modifiedOn: string;
  /** An informative name for the list. Use this name in filter and rule expressions. */
  name: string;
  /** The number of items in the list. */
  numItems: number;
  /** The number of [filters](/api/resources/filters/) referencing the list. */
  numReferencingFilters: number;
  /** An informative summary of the list. */
  description?: string;
}

export const GetListResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  kind: Schema.Literal("ip", "redirect", "hostname", "asn"),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  numItems: Schema.Number.pipe(T.JsonName("num_items")),
  numReferencingFilters: Schema.Number.pipe(T.JsonName("num_referencing_filters")),
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetListResponse>;

export const getList = API.make(() => ({
  input: GetListRequest,
  output: GetListResponse,
  errors: [],
}));

export interface CreateListRequest {
  /** Path param: The Account ID for this resource. */
  accountId: string;
  /** Body param: The type of the list. Each type supports specific list items (IP addresses, ASNs, hostnames or redirects). */
  kind: "ip" | "redirect" | "hostname" | "asn";
  /** Body param: An informative name for the list. Use this name in filter and rule expressions. */
  name: string;
  /** Body param: An informative summary of the list. */
  description?: string;
}

export const CreateListRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  kind: Schema.Literal("ip", "redirect", "hostname", "asn"),
  name: Schema.String,
  description: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/rules/lists" }),
) as unknown as Schema.Schema<CreateListRequest>;

export interface CreateListResponse {
  /** The unique ID of the list. */
  id: string;
  /** The RFC 3339 timestamp of when the list was created. */
  createdOn: string;
  /** The type of the list. Each type supports specific list items (IP addresses, ASNs, hostnames or redirects). */
  kind: "ip" | "redirect" | "hostname" | "asn";
  /** The RFC 3339 timestamp of when the list was last modified. */
  modifiedOn: string;
  /** An informative name for the list. Use this name in filter and rule expressions. */
  name: string;
  /** The number of items in the list. */
  numItems: number;
  /** The number of [filters](/api/resources/filters/) referencing the list. */
  numReferencingFilters: number;
  /** An informative summary of the list. */
  description?: string;
}

export const CreateListResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  kind: Schema.Literal("ip", "redirect", "hostname", "asn"),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  numItems: Schema.Number.pipe(T.JsonName("num_items")),
  numReferencingFilters: Schema.Number.pipe(T.JsonName("num_referencing_filters")),
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateListResponse>;

export const createList = API.make(() => ({
  input: CreateListRequest,
  output: CreateListResponse,
  errors: [],
}));

export interface UpdateListRequest {
  listId: string;
  /** Path param: The Account ID for this resource. */
  accountId: string;
  /** Body param: An informative summary of the list. */
  description?: string;
}

export const UpdateListRequest = Schema.Struct({
  listId: Schema.String.pipe(T.HttpPath("listId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  description: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/rules/lists/{listId}" }),
) as unknown as Schema.Schema<UpdateListRequest>;

export interface UpdateListResponse {
  /** The unique ID of the list. */
  id: string;
  /** The RFC 3339 timestamp of when the list was created. */
  createdOn: string;
  /** The type of the list. Each type supports specific list items (IP addresses, ASNs, hostnames or redirects). */
  kind: "ip" | "redirect" | "hostname" | "asn";
  /** The RFC 3339 timestamp of when the list was last modified. */
  modifiedOn: string;
  /** An informative name for the list. Use this name in filter and rule expressions. */
  name: string;
  /** The number of items in the list. */
  numItems: number;
  /** The number of [filters](/api/resources/filters/) referencing the list. */
  numReferencingFilters: number;
  /** An informative summary of the list. */
  description?: string;
}

export const UpdateListResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  kind: Schema.Literal("ip", "redirect", "hostname", "asn"),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  numItems: Schema.Number.pipe(T.JsonName("num_items")),
  numReferencingFilters: Schema.Number.pipe(T.JsonName("num_referencing_filters")),
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateListResponse>;

export const updateList = API.make(() => ({
  input: UpdateListRequest,
  output: UpdateListResponse,
  errors: [],
}));

export interface DeleteListRequest {
  listId: string;
  /** The Account ID for this resource. */
  accountId: string;
}

export const DeleteListRequest = Schema.Struct({
  listId: Schema.String.pipe(T.HttpPath("listId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/rules/lists/{listId}" }),
) as unknown as Schema.Schema<DeleteListRequest>;

export interface DeleteListResponse {
  /** The unique ID of the list. */
  id: string;
}

export const DeleteListResponse = Schema.Struct({
  id: Schema.String,
}) as unknown as Schema.Schema<DeleteListResponse>;

export const deleteList = API.make(() => ({
  input: DeleteListRequest,
  output: DeleteListResponse,
  errors: [],
}));

// =============================================================================
// ListBulkOperation
// =============================================================================

export interface GetListBulkOperationRequest {
  operationId: string;
  /** The Account ID for this resource. */
  accountId: string;
}

export const GetListBulkOperationRequest = Schema.Struct({
  operationId: Schema.String.pipe(T.HttpPath("operationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/rules/lists/bulk_operations/{operationId}",
  }),
) as unknown as Schema.Schema<GetListBulkOperationRequest>;

export type GetListBulkOperationResponse =
  | { id: string; status: "pending" | "running" }
  | { id: string; completed: string; status: "completed" }
  | { id: string; completed: string; error: string; status: "failed" };

export const GetListBulkOperationResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    status: Schema.Literal("pending", "running"),
  }),
  Schema.Struct({
    id: Schema.String,
    completed: Schema.String,
    status: Schema.Literal("completed"),
  }),
  Schema.Struct({
    id: Schema.String,
    completed: Schema.String,
    error: Schema.String,
    status: Schema.Literal("failed"),
  }),
) as unknown as Schema.Schema<GetListBulkOperationResponse>;

export const getListBulkOperation = API.make(() => ({
  input: GetListBulkOperationRequest,
  output: GetListBulkOperationResponse,
  errors: [],
}));

// =============================================================================
// ListItem
// =============================================================================

export interface GetListItemRequest {
  listId: string;
  itemId: string;
  /** The Account ID for this resource. */
  accountId: string;
}

export const GetListItemRequest = Schema.Struct({
  listId: Schema.String.pipe(T.HttpPath("listId")),
  itemId: Schema.String.pipe(T.HttpPath("itemId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/rules/lists/{listId}/items/{itemId}" }),
) as unknown as Schema.Schema<GetListItemRequest>;

export type GetListItemResponse =
  | { id: string; createdOn: string; ip: string; modifiedOn: string; comment?: string }
  | { id: string; createdOn: string; hostname: unknown; modifiedOn: string; comment?: string }
  | { id: string; createdOn: string; modifiedOn: string; redirect: unknown; comment?: string }
  | { id: string; asn: number; createdOn: string; modifiedOn: string; comment?: string };

export const GetListItemResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    ip: Schema.String,
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    comment: Schema.optional(Schema.String),
  }),
  Schema.Struct({
    id: Schema.String,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    hostname: Schema.Unknown,
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    comment: Schema.optional(Schema.String),
  }),
  Schema.Struct({
    id: Schema.String,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    redirect: Schema.Unknown,
    comment: Schema.optional(Schema.String),
  }),
  Schema.Struct({
    id: Schema.String,
    asn: Schema.Number,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    comment: Schema.optional(Schema.String),
  }),
) as unknown as Schema.Schema<GetListItemResponse>;

export const getListItem = API.make(() => ({
  input: GetListItemRequest,
  output: GetListItemResponse,
  errors: [],
}));

export interface CreateListItemRequest {
  listId: string;
  /** Path param: The Account ID for this resource. */
  accountId: string;
  /** Body param: */
  body: (
    | { ip: string; comment?: string }
    | { redirect: unknown; comment?: string }
    | { hostname: unknown; comment?: string }
    | { asn: number; comment?: string }
  )[];
}

export const CreateListItemRequest = Schema.Struct({
  listId: Schema.String.pipe(T.HttpPath("listId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Array(
    Schema.Union(
      Schema.Struct({
        ip: Schema.String,
        comment: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        redirect: Schema.Unknown,
        comment: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        hostname: Schema.Unknown,
        comment: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        asn: Schema.Number,
        comment: Schema.optional(Schema.String),
      }),
    ),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/rules/lists/{listId}/items" }),
) as unknown as Schema.Schema<CreateListItemRequest>;

export interface CreateListItemResponse {
  /** The unique operation ID of the asynchronous action. */
  operationId: string;
}

export const CreateListItemResponse = Schema.Struct({
  operationId: Schema.String.pipe(T.JsonName("operation_id")),
}) as unknown as Schema.Schema<CreateListItemResponse>;

export const createListItem = API.make(() => ({
  input: CreateListItemRequest,
  output: CreateListItemResponse,
  errors: [],
}));

export interface UpdateListItemRequest {
  listId: string;
  /** Path param: The Account ID for this resource. */
  accountId: string;
  /** Body param: */
  body: (
    | { ip: string; comment?: string }
    | { redirect: unknown; comment?: string }
    | { hostname: unknown; comment?: string }
    | { asn: number; comment?: string }
  )[];
}

export const UpdateListItemRequest = Schema.Struct({
  listId: Schema.String.pipe(T.HttpPath("listId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Array(
    Schema.Union(
      Schema.Struct({
        ip: Schema.String,
        comment: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        redirect: Schema.Unknown,
        comment: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        hostname: Schema.Unknown,
        comment: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        asn: Schema.Number,
        comment: Schema.optional(Schema.String),
      }),
    ),
  ),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/rules/lists/{listId}/items" }),
) as unknown as Schema.Schema<UpdateListItemRequest>;

export interface UpdateListItemResponse {
  /** The unique operation ID of the asynchronous action. */
  operationId: string;
}

export const UpdateListItemResponse = Schema.Struct({
  operationId: Schema.String.pipe(T.JsonName("operation_id")),
}) as unknown as Schema.Schema<UpdateListItemResponse>;

export const updateListItem = API.make(() => ({
  input: UpdateListItemRequest,
  output: UpdateListItemResponse,
  errors: [],
}));

export interface DeleteListItemRequest {
  listId: string;
  /** Path param: The Account ID for this resource. */
  accountId: string;
  /** Body param: */
  items?: unknown[];
}

export const DeleteListItemRequest = Schema.Struct({
  listId: Schema.String.pipe(T.HttpPath("listId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  items: Schema.optional(Schema.Array(Schema.Unknown)),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/rules/lists/{listId}/items" }),
) as unknown as Schema.Schema<DeleteListItemRequest>;

export interface DeleteListItemResponse {
  /** The unique operation ID of the asynchronous action. */
  operationId: string;
}

export const DeleteListItemResponse = Schema.Struct({
  operationId: Schema.String.pipe(T.JsonName("operation_id")),
}) as unknown as Schema.Schema<DeleteListItemResponse>;

export const deleteListItem = API.make(() => ({
  input: DeleteListItemRequest,
  output: DeleteListItemResponse,
  errors: [],
}));
