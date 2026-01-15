/**
 * Cloudflare TURNSTILE API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service turnstile
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// SecretWidget
// =============================================================================

export interface RotateSecretWidgetRequest {
  sitekey: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: If `invalidate_immediately` is set to `false`, the previous secret will remain valid for two hours. Otherwise, the secret is immediately invalidated, and requests using it will be rejected */
  invalidateImmediately?: boolean;
}

export const RotateSecretWidgetRequest = Schema.Struct({
  sitekey: Schema.String.pipe(T.HttpPath("sitekey")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  invalidateImmediately: Schema.optional(Schema.Boolean).pipe(T.JsonName("invalidate_immediately")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/challenges/widgets/{sitekey}/rotate_secret",
  }),
) as unknown as Schema.Schema<RotateSecretWidgetRequest>;

export interface RotateSecretWidgetResponse {
  /** If bot_fight_mode is set to `true`, Cloudflare issues computationally expensive challenges in response to malicious bots (ENT only). */
  botFightMode: boolean;
  /** If Turnstile is embedded on a Cloudflare site and the widget should grant challenge clearance, this setting can determine the clearance level to be set */
  clearanceLevel: "no_clearance" | "jschallenge" | "managed" | "interactive";
  /** When the widget was created. */
  createdOn: string;
  domains: string[];
  /** Return the Ephemeral ID in /siteverify (ENT only). */
  ephemeralId: boolean;
  /** Widget Mode */
  mode: "non-interactive" | "invisible" | "managed";
  /** When the widget was modified. */
  modifiedOn: string;
  /** Human readable widget name. Not unique. Cloudflare suggests that you set this to a meaningful string to make it easier to identify your widget, and where it is used. */
  name: string;
  /** Do not show any Cloudflare branding on the widget (ENT only). */
  offlabel: boolean;
  /** Region where this widget can be used. This cannot be changed after creation. */
  region: "world" | "china";
  /** Secret key for this widget. */
  secret: string;
  /** Widget item identifier tag. */
  sitekey: string;
}

export const RotateSecretWidgetResponse = Schema.Struct({
  botFightMode: Schema.Boolean.pipe(T.JsonName("bot_fight_mode")),
  clearanceLevel: Schema.Literal("no_clearance", "jschallenge", "managed", "interactive").pipe(
    T.JsonName("clearance_level"),
  ),
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  domains: Schema.Array(Schema.String),
  ephemeralId: Schema.Boolean.pipe(T.JsonName("ephemeral_id")),
  mode: Schema.Literal("non-interactive", "invisible", "managed"),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  offlabel: Schema.Boolean,
  region: Schema.Literal("world", "china"),
  secret: Schema.String,
  sitekey: Schema.String,
}) as unknown as Schema.Schema<RotateSecretWidgetResponse>;

export const rotateSecretWidget = API.make(() => ({
  input: RotateSecretWidgetRequest,
  output: RotateSecretWidgetResponse,
  errors: [],
}));

// =============================================================================
// Widget
// =============================================================================

export interface GetWidgetRequest {
  sitekey: string;
  /** Identifier */
  accountId: string;
}

export const GetWidgetRequest = Schema.Struct({
  sitekey: Schema.String.pipe(T.HttpPath("sitekey")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/challenges/widgets/{sitekey}" }),
) as unknown as Schema.Schema<GetWidgetRequest>;

export interface GetWidgetResponse {
  /** If bot_fight_mode is set to `true`, Cloudflare issues computationally expensive challenges in response to malicious bots (ENT only). */
  botFightMode: boolean;
  /** If Turnstile is embedded on a Cloudflare site and the widget should grant challenge clearance, this setting can determine the clearance level to be set */
  clearanceLevel: "no_clearance" | "jschallenge" | "managed" | "interactive";
  /** When the widget was created. */
  createdOn: string;
  domains: string[];
  /** Return the Ephemeral ID in /siteverify (ENT only). */
  ephemeralId: boolean;
  /** Widget Mode */
  mode: "non-interactive" | "invisible" | "managed";
  /** When the widget was modified. */
  modifiedOn: string;
  /** Human readable widget name. Not unique. Cloudflare suggests that you set this to a meaningful string to make it easier to identify your widget, and where it is used. */
  name: string;
  /** Do not show any Cloudflare branding on the widget (ENT only). */
  offlabel: boolean;
  /** Region where this widget can be used. This cannot be changed after creation. */
  region: "world" | "china";
  /** Secret key for this widget. */
  secret: string;
  /** Widget item identifier tag. */
  sitekey: string;
}

export const GetWidgetResponse = Schema.Struct({
  botFightMode: Schema.Boolean.pipe(T.JsonName("bot_fight_mode")),
  clearanceLevel: Schema.Literal("no_clearance", "jschallenge", "managed", "interactive").pipe(
    T.JsonName("clearance_level"),
  ),
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  domains: Schema.Array(Schema.String),
  ephemeralId: Schema.Boolean.pipe(T.JsonName("ephemeral_id")),
  mode: Schema.Literal("non-interactive", "invisible", "managed"),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  offlabel: Schema.Boolean,
  region: Schema.Literal("world", "china"),
  secret: Schema.String,
  sitekey: Schema.String,
}) as unknown as Schema.Schema<GetWidgetResponse>;

export const getWidget = API.make(() => ({
  input: GetWidgetRequest,
  output: GetWidgetResponse,
  errors: [],
}));

export interface CreateWidgetRequest {
  /** Path param: Identifier */
  accountId: string;
  /** Query param: Direction to order widgets. */
  direction?: "asc" | "desc";
  /** Query param: Field to order widgets by. */
  order?: "id" | "sitekey" | "name" | "created_on" | "modified_on";
  /** Query param: Page number of paginated results. */
  page?: number;
  /** Query param: Number of items per page. */
  perPage?: number;
  /** Body param: */
  domains: string[];
  /** Body param: Widget Mode */
  mode: "non-interactive" | "invisible" | "managed";
  /** Body param: Human readable widget name. Not unique. Cloudflare suggests that you set this to a meaningful string to make it easier to identify your widget, and where it is used. */
  name: string;
  /** Body param: If bot_fight_mode is set to `true`, Cloudflare issues computationally expensive challenges in response to malicious bots (ENT only). */
  botFightMode?: boolean;
  /** Body param: If Turnstile is embedded on a Cloudflare site and the widget should grant challenge clearance, this setting can determine the clearance level to be set */
  clearanceLevel?: "no_clearance" | "jschallenge" | "managed" | "interactive";
  /** Body param: Return the Ephemeral ID in /siteverify (ENT only). */
  ephemeralId?: boolean;
  /** Body param: Do not show any Cloudflare branding on the widget (ENT only). */
  offlabel?: boolean;
  /** Body param: Region where this widget can be used. This cannot be changed after creation. */
  region?: "world" | "china";
}

export const CreateWidgetRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  direction: Schema.optional(Schema.Literal("asc", "desc")).pipe(T.HttpQuery("direction")),
  order: Schema.optional(Schema.Literal("id", "sitekey", "name", "created_on", "modified_on")).pipe(
    T.HttpQuery("order"),
  ),
  page: Schema.optional(Schema.Number).pipe(T.HttpQuery("page")),
  perPage: Schema.optional(Schema.Number).pipe(T.HttpQuery("per_page")),
  domains: Schema.Array(Schema.String),
  mode: Schema.Literal("non-interactive", "invisible", "managed"),
  name: Schema.String,
  botFightMode: Schema.optional(Schema.Boolean).pipe(T.JsonName("bot_fight_mode")),
  clearanceLevel: Schema.optional(
    Schema.Literal("no_clearance", "jschallenge", "managed", "interactive"),
  ).pipe(T.JsonName("clearance_level")),
  ephemeralId: Schema.optional(Schema.Boolean).pipe(T.JsonName("ephemeral_id")),
  offlabel: Schema.optional(Schema.Boolean),
  region: Schema.optional(Schema.Literal("world", "china")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/challenges/widgets" }),
) as unknown as Schema.Schema<CreateWidgetRequest>;

export interface CreateWidgetResponse {
  /** If bot_fight_mode is set to `true`, Cloudflare issues computationally expensive challenges in response to malicious bots (ENT only). */
  botFightMode: boolean;
  /** If Turnstile is embedded on a Cloudflare site and the widget should grant challenge clearance, this setting can determine the clearance level to be set */
  clearanceLevel: "no_clearance" | "jschallenge" | "managed" | "interactive";
  /** When the widget was created. */
  createdOn: string;
  domains: string[];
  /** Return the Ephemeral ID in /siteverify (ENT only). */
  ephemeralId: boolean;
  /** Widget Mode */
  mode: "non-interactive" | "invisible" | "managed";
  /** When the widget was modified. */
  modifiedOn: string;
  /** Human readable widget name. Not unique. Cloudflare suggests that you set this to a meaningful string to make it easier to identify your widget, and where it is used. */
  name: string;
  /** Do not show any Cloudflare branding on the widget (ENT only). */
  offlabel: boolean;
  /** Region where this widget can be used. This cannot be changed after creation. */
  region: "world" | "china";
  /** Secret key for this widget. */
  secret: string;
  /** Widget item identifier tag. */
  sitekey: string;
}

export const CreateWidgetResponse = Schema.Struct({
  botFightMode: Schema.Boolean.pipe(T.JsonName("bot_fight_mode")),
  clearanceLevel: Schema.Literal("no_clearance", "jschallenge", "managed", "interactive").pipe(
    T.JsonName("clearance_level"),
  ),
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  domains: Schema.Array(Schema.String),
  ephemeralId: Schema.Boolean.pipe(T.JsonName("ephemeral_id")),
  mode: Schema.Literal("non-interactive", "invisible", "managed"),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  offlabel: Schema.Boolean,
  region: Schema.Literal("world", "china"),
  secret: Schema.String,
  sitekey: Schema.String,
}) as unknown as Schema.Schema<CreateWidgetResponse>;

export const createWidget = API.make(() => ({
  input: CreateWidgetRequest,
  output: CreateWidgetResponse,
  errors: [],
}));

export interface UpdateWidgetRequest {
  sitekey: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: */
  domains: string[];
  /** Body param: Widget Mode */
  mode: "non-interactive" | "invisible" | "managed";
  /** Body param: Human readable widget name. Not unique. Cloudflare suggests that you set this to a meaningful string to make it easier to identify your widget, and where it is used. */
  name: string;
  /** Body param: If bot_fight_mode is set to `true`, Cloudflare issues computationally expensive challenges in response to malicious bots (ENT only). */
  botFightMode?: boolean;
  /** Body param: If Turnstile is embedded on a Cloudflare site and the widget should grant challenge clearance, this setting can determine the clearance level to be set */
  clearanceLevel?: "no_clearance" | "jschallenge" | "managed" | "interactive";
  /** Body param: Return the Ephemeral ID in /siteverify (ENT only). */
  ephemeralId?: boolean;
  /** Body param: Do not show any Cloudflare branding on the widget (ENT only). */
  offlabel?: boolean;
  /** Body param: Region where this widget can be used. This cannot be changed after creation. */
  region?: "world" | "china";
}

export const UpdateWidgetRequest = Schema.Struct({
  sitekey: Schema.String.pipe(T.HttpPath("sitekey")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  domains: Schema.Array(Schema.String),
  mode: Schema.Literal("non-interactive", "invisible", "managed"),
  name: Schema.String,
  botFightMode: Schema.optional(Schema.Boolean).pipe(T.JsonName("bot_fight_mode")),
  clearanceLevel: Schema.optional(
    Schema.Literal("no_clearance", "jschallenge", "managed", "interactive"),
  ).pipe(T.JsonName("clearance_level")),
  ephemeralId: Schema.optional(Schema.Boolean).pipe(T.JsonName("ephemeral_id")),
  offlabel: Schema.optional(Schema.Boolean),
  region: Schema.optional(Schema.Literal("world", "china")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/challenges/widgets/{sitekey}" }),
) as unknown as Schema.Schema<UpdateWidgetRequest>;

export interface UpdateWidgetResponse {
  /** If bot_fight_mode is set to `true`, Cloudflare issues computationally expensive challenges in response to malicious bots (ENT only). */
  botFightMode: boolean;
  /** If Turnstile is embedded on a Cloudflare site and the widget should grant challenge clearance, this setting can determine the clearance level to be set */
  clearanceLevel: "no_clearance" | "jschallenge" | "managed" | "interactive";
  /** When the widget was created. */
  createdOn: string;
  domains: string[];
  /** Return the Ephemeral ID in /siteverify (ENT only). */
  ephemeralId: boolean;
  /** Widget Mode */
  mode: "non-interactive" | "invisible" | "managed";
  /** When the widget was modified. */
  modifiedOn: string;
  /** Human readable widget name. Not unique. Cloudflare suggests that you set this to a meaningful string to make it easier to identify your widget, and where it is used. */
  name: string;
  /** Do not show any Cloudflare branding on the widget (ENT only). */
  offlabel: boolean;
  /** Region where this widget can be used. This cannot be changed after creation. */
  region: "world" | "china";
  /** Secret key for this widget. */
  secret: string;
  /** Widget item identifier tag. */
  sitekey: string;
}

export const UpdateWidgetResponse = Schema.Struct({
  botFightMode: Schema.Boolean.pipe(T.JsonName("bot_fight_mode")),
  clearanceLevel: Schema.Literal("no_clearance", "jschallenge", "managed", "interactive").pipe(
    T.JsonName("clearance_level"),
  ),
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  domains: Schema.Array(Schema.String),
  ephemeralId: Schema.Boolean.pipe(T.JsonName("ephemeral_id")),
  mode: Schema.Literal("non-interactive", "invisible", "managed"),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  offlabel: Schema.Boolean,
  region: Schema.Literal("world", "china"),
  secret: Schema.String,
  sitekey: Schema.String,
}) as unknown as Schema.Schema<UpdateWidgetResponse>;

export const updateWidget = API.make(() => ({
  input: UpdateWidgetRequest,
  output: UpdateWidgetResponse,
  errors: [],
}));

export interface DeleteWidgetRequest {
  sitekey: string;
  /** Identifier */
  accountId: string;
}

export const DeleteWidgetRequest = Schema.Struct({
  sitekey: Schema.String.pipe(T.HttpPath("sitekey")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/challenges/widgets/{sitekey}" }),
) as unknown as Schema.Schema<DeleteWidgetRequest>;

export interface DeleteWidgetResponse {
  /** If bot_fight_mode is set to `true`, Cloudflare issues computationally expensive challenges in response to malicious bots (ENT only). */
  botFightMode: boolean;
  /** If Turnstile is embedded on a Cloudflare site and the widget should grant challenge clearance, this setting can determine the clearance level to be set */
  clearanceLevel: "no_clearance" | "jschallenge" | "managed" | "interactive";
  /** When the widget was created. */
  createdOn: string;
  domains: string[];
  /** Return the Ephemeral ID in /siteverify (ENT only). */
  ephemeralId: boolean;
  /** Widget Mode */
  mode: "non-interactive" | "invisible" | "managed";
  /** When the widget was modified. */
  modifiedOn: string;
  /** Human readable widget name. Not unique. Cloudflare suggests that you set this to a meaningful string to make it easier to identify your widget, and where it is used. */
  name: string;
  /** Do not show any Cloudflare branding on the widget (ENT only). */
  offlabel: boolean;
  /** Region where this widget can be used. This cannot be changed after creation. */
  region: "world" | "china";
  /** Secret key for this widget. */
  secret: string;
  /** Widget item identifier tag. */
  sitekey: string;
}

export const DeleteWidgetResponse = Schema.Struct({
  botFightMode: Schema.Boolean.pipe(T.JsonName("bot_fight_mode")),
  clearanceLevel: Schema.Literal("no_clearance", "jschallenge", "managed", "interactive").pipe(
    T.JsonName("clearance_level"),
  ),
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  domains: Schema.Array(Schema.String),
  ephemeralId: Schema.Boolean.pipe(T.JsonName("ephemeral_id")),
  mode: Schema.Literal("non-interactive", "invisible", "managed"),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  offlabel: Schema.Boolean,
  region: Schema.Literal("world", "china"),
  secret: Schema.String,
  sitekey: Schema.String,
}) as unknown as Schema.Schema<DeleteWidgetResponse>;

export const deleteWidget = API.make(() => ({
  input: DeleteWidgetRequest,
  output: DeleteWidgetResponse,
  errors: [],
}));
