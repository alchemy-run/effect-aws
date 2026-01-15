/**
 * Cloudflare CALLS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service calls
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Sfu
// =============================================================================

export interface GetSfuRequest {
  appId: string;
  /** The account identifier tag. */
  accountId: string;
}

export const GetSfuRequest = Schema.Struct({
  appId: Schema.String.pipe(T.HttpPath("appId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/calls/apps/{appId}" }),
) as unknown as Schema.Schema<GetSfuRequest>;

export interface GetSfuResponse {
  /** The date and time the item was created. */
  created?: string;
  /** The date and time the item was last modified. */
  modified?: string;
  /** A short description of Calls app, not shown to end users. */
  name?: string;
  /** A Cloudflare-generated unique identifier for a item. */
  uid?: string;
}

export const GetSfuResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  modified: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetSfuResponse>;

export const getSfu = API.make(() => ({
  input: GetSfuRequest,
  output: GetSfuResponse,
  errors: [],
}));

export interface CreateSfuRequest {
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Body param: A short description of Calls app, not shown to end users. */
  name?: string;
}

export const CreateSfuRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/calls/apps" }),
) as unknown as Schema.Schema<CreateSfuRequest>;

export interface CreateSfuResponse {
  /** The date and time the item was created. */
  created?: string;
  /** The date and time the item was last modified. */
  modified?: string;
  /** A short description of Calls app, not shown to end users. */
  name?: string;
  /** Bearer token */
  secret?: string;
  /** A Cloudflare-generated unique identifier for a item. */
  uid?: string;
}

export const CreateSfuResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  modified: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  secret: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateSfuResponse>;

export const createSfu = API.make(() => ({
  input: CreateSfuRequest,
  output: CreateSfuResponse,
  errors: [],
}));

export interface UpdateSfuRequest {
  appId: string;
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Body param: A short description of Calls app, not shown to end users. */
  name?: string;
}

export const UpdateSfuRequest = Schema.Struct({
  appId: Schema.String.pipe(T.HttpPath("appId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/calls/apps/{appId}" }),
) as unknown as Schema.Schema<UpdateSfuRequest>;

export interface UpdateSfuResponse {
  /** The date and time the item was created. */
  created?: string;
  /** The date and time the item was last modified. */
  modified?: string;
  /** A short description of Calls app, not shown to end users. */
  name?: string;
  /** A Cloudflare-generated unique identifier for a item. */
  uid?: string;
}

export const UpdateSfuResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  modified: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateSfuResponse>;

export const updateSfu = API.make(() => ({
  input: UpdateSfuRequest,
  output: UpdateSfuResponse,
  errors: [],
}));

export interface DeleteSfuRequest {
  appId: string;
  /** The account identifier tag. */
  accountId: string;
}

export const DeleteSfuRequest = Schema.Struct({
  appId: Schema.String.pipe(T.HttpPath("appId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/calls/apps/{appId}" }),
) as unknown as Schema.Schema<DeleteSfuRequest>;

export interface DeleteSfuResponse {
  /** The date and time the item was created. */
  created?: string;
  /** The date and time the item was last modified. */
  modified?: string;
  /** A short description of Calls app, not shown to end users. */
  name?: string;
  /** A Cloudflare-generated unique identifier for a item. */
  uid?: string;
}

export const DeleteSfuResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  modified: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteSfuResponse>;

export const deleteSfu = API.make(() => ({
  input: DeleteSfuRequest,
  output: DeleteSfuResponse,
  errors: [],
}));

// =============================================================================
// Turn
// =============================================================================

export interface GetTurnRequest {
  keyId: string;
  /** The account identifier tag. */
  accountId: string;
}

export const GetTurnRequest = Schema.Struct({
  keyId: Schema.String.pipe(T.HttpPath("keyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/calls/turn_keys/{keyId}" }),
) as unknown as Schema.Schema<GetTurnRequest>;

export interface GetTurnResponse {
  /** The date and time the item was created. */
  created?: string;
  /** The date and time the item was last modified. */
  modified?: string;
  /** A short description of Calls app, not shown to end users. */
  name?: string;
  /** A Cloudflare-generated unique identifier for a item. */
  uid?: string;
}

export const GetTurnResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  modified: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetTurnResponse>;

export const getTurn = API.make(() => ({
  input: GetTurnRequest,
  output: GetTurnResponse,
  errors: [],
}));

export interface CreateTurnRequest {
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Body param: A short description of a TURN key, not shown to end users. */
  name?: string;
}

export const CreateTurnRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/calls/turn_keys" }),
) as unknown as Schema.Schema<CreateTurnRequest>;

export interface CreateTurnResponse {
  /** The date and time the item was created. */
  created?: string;
  /** Bearer token */
  key?: string;
  /** The date and time the item was last modified. */
  modified?: string;
  /** A short description of a TURN key, not shown to end users. */
  name?: string;
  /** A Cloudflare-generated unique identifier for a item. */
  uid?: string;
}

export const CreateTurnResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  key: Schema.optional(Schema.String),
  modified: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateTurnResponse>;

export const createTurn = API.make(() => ({
  input: CreateTurnRequest,
  output: CreateTurnResponse,
  errors: [],
}));

export interface UpdateTurnRequest {
  keyId: string;
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Body param: A short description of a TURN key, not shown to end users. */
  name?: string;
}

export const UpdateTurnRequest = Schema.Struct({
  keyId: Schema.String.pipe(T.HttpPath("keyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/calls/turn_keys/{keyId}" }),
) as unknown as Schema.Schema<UpdateTurnRequest>;

export interface UpdateTurnResponse {
  /** The date and time the item was created. */
  created?: string;
  /** The date and time the item was last modified. */
  modified?: string;
  /** A short description of Calls app, not shown to end users. */
  name?: string;
  /** A Cloudflare-generated unique identifier for a item. */
  uid?: string;
}

export const UpdateTurnResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  modified: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateTurnResponse>;

export const updateTurn = API.make(() => ({
  input: UpdateTurnRequest,
  output: UpdateTurnResponse,
  errors: [],
}));

export interface DeleteTurnRequest {
  keyId: string;
  /** The account identifier tag. */
  accountId: string;
}

export const DeleteTurnRequest = Schema.Struct({
  keyId: Schema.String.pipe(T.HttpPath("keyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/calls/turn_keys/{keyId}" }),
) as unknown as Schema.Schema<DeleteTurnRequest>;

export interface DeleteTurnResponse {
  /** The date and time the item was created. */
  created?: string;
  /** The date and time the item was last modified. */
  modified?: string;
  /** A short description of Calls app, not shown to end users. */
  name?: string;
  /** A Cloudflare-generated unique identifier for a item. */
  uid?: string;
}

export const DeleteTurnResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  modified: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteTurnResponse>;

export const deleteTurn = API.make(() => ({
  input: DeleteTurnRequest,
  output: DeleteTurnResponse,
  errors: [],
}));
