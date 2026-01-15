/**
 * Cloudflare RUM API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service rum
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Rule
// =============================================================================

export interface ListRulesRequest {
  rulesetId: string;
  /** Identifier. */
  accountId: string;
}

export const ListRulesRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/rum/v2/{rulesetId}/rules" }),
) as unknown as Schema.Schema<ListRulesRequest>;

export interface ListRulesResponse {
  /** A list of rules. */
  rules?: {
    id?: string;
    created?: string;
    host?: string;
    inclusive?: boolean;
    isPaused?: boolean;
    paths?: string[];
    priority?: number;
  }[];
  ruleset?: { id?: string; enabled?: boolean; zoneName?: string; zoneTag?: string };
}

export const ListRulesResponse = Schema.Struct({
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        created: Schema.optional(Schema.String),
        host: Schema.optional(Schema.String),
        inclusive: Schema.optional(Schema.Boolean),
        isPaused: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_paused")),
        paths: Schema.optional(Schema.Array(Schema.String)),
        priority: Schema.optional(Schema.Number),
      }),
    ),
  ),
  ruleset: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      enabled: Schema.optional(Schema.Boolean),
      zoneName: Schema.optional(Schema.String).pipe(T.JsonName("zone_name")),
      zoneTag: Schema.optional(Schema.String).pipe(T.JsonName("zone_tag")),
    }),
  ),
}) as unknown as Schema.Schema<ListRulesResponse>;

export const listRules = API.make(() => ({
  input: ListRulesRequest,
  output: ListRulesResponse,
  errors: [],
}));

export interface CreateRuleRequest {
  rulesetId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  host?: string;
  /** Body param: Whether the rule includes or excludes traffic from being measured. */
  inclusive?: boolean;
  /** Body param: Whether the rule is paused or not. */
  isPaused?: boolean;
  /** Body param: */
  paths?: string[];
}

export const CreateRuleRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  host: Schema.optional(Schema.String),
  inclusive: Schema.optional(Schema.Boolean),
  isPaused: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_paused")),
  paths: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/rum/v2/{rulesetId}/rule" }),
) as unknown as Schema.Schema<CreateRuleRequest>;

export interface CreateRuleResponse {
  /** The Web Analytics rule identifier. */
  id?: string;
  created?: string;
  /** The hostname the rule will be applied to. */
  host?: string;
  /** Whether the rule includes or excludes traffic from being measured. */
  inclusive?: boolean;
  /** Whether the rule is paused or not. */
  isPaused?: boolean;
  /** The paths the rule will be applied to. */
  paths?: string[];
  priority?: number;
}

export const CreateRuleResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  created: Schema.optional(Schema.String),
  host: Schema.optional(Schema.String),
  inclusive: Schema.optional(Schema.Boolean),
  isPaused: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_paused")),
  paths: Schema.optional(Schema.Array(Schema.String)),
  priority: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<CreateRuleResponse>;

export const createRule = API.make(() => ({
  input: CreateRuleRequest,
  output: CreateRuleResponse,
  errors: [],
}));

export interface UpdateRuleRequest {
  rulesetId: string;
  ruleId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  host?: string;
  /** Body param: Whether the rule includes or excludes traffic from being measured. */
  inclusive?: boolean;
  /** Body param: Whether the rule is paused or not. */
  isPaused?: boolean;
  /** Body param: */
  paths?: string[];
}

export const UpdateRuleRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  host: Schema.optional(Schema.String),
  inclusive: Schema.optional(Schema.Boolean),
  isPaused: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_paused")),
  paths: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/rum/v2/{rulesetId}/rule/{ruleId}" }),
) as unknown as Schema.Schema<UpdateRuleRequest>;

export interface UpdateRuleResponse {
  /** The Web Analytics rule identifier. */
  id?: string;
  created?: string;
  /** The hostname the rule will be applied to. */
  host?: string;
  /** Whether the rule includes or excludes traffic from being measured. */
  inclusive?: boolean;
  /** Whether the rule is paused or not. */
  isPaused?: boolean;
  /** The paths the rule will be applied to. */
  paths?: string[];
  priority?: number;
}

export const UpdateRuleResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  created: Schema.optional(Schema.String),
  host: Schema.optional(Schema.String),
  inclusive: Schema.optional(Schema.Boolean),
  isPaused: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_paused")),
  paths: Schema.optional(Schema.Array(Schema.String)),
  priority: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<UpdateRuleResponse>;

export const updateRule = API.make(() => ({
  input: UpdateRuleRequest,
  output: UpdateRuleResponse,
  errors: [],
}));

export interface DeleteRuleRequest {
  rulesetId: string;
  ruleId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteRuleRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/rum/v2/{rulesetId}/rule/{ruleId}" }),
) as unknown as Schema.Schema<DeleteRuleRequest>;

export interface DeleteRuleResponse {
  /** The Web Analytics rule identifier. */
  id?: string;
}

export const DeleteRuleResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteRuleResponse>;

export const deleteRule = API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResponse,
  errors: [],
}));

export interface BulkCreateRulesRequest {
  rulesetId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: A list of rule identifiers to delete. */
  deleteRules?: string[];
  /** Body param: A list of rules to create or update. */
  rules?: {
    id?: string;
    host?: string;
    inclusive?: boolean;
    isPaused?: boolean;
    paths?: string[];
  }[];
}

export const BulkCreateRulesRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  deleteRules: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("delete_rules")),
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        host: Schema.optional(Schema.String),
        inclusive: Schema.optional(Schema.Boolean),
        isPaused: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_paused")),
        paths: Schema.optional(Schema.Array(Schema.String)),
      }),
    ),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/rum/v2/{rulesetId}/rules" }),
) as unknown as Schema.Schema<BulkCreateRulesRequest>;

export interface BulkCreateRulesResponse {
  /** A list of rules. */
  rules?: {
    id?: string;
    created?: string;
    host?: string;
    inclusive?: boolean;
    isPaused?: boolean;
    paths?: string[];
    priority?: number;
  }[];
  ruleset?: { id?: string; enabled?: boolean; zoneName?: string; zoneTag?: string };
}

export const BulkCreateRulesResponse = Schema.Struct({
  rules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        created: Schema.optional(Schema.String),
        host: Schema.optional(Schema.String),
        inclusive: Schema.optional(Schema.Boolean),
        isPaused: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_paused")),
        paths: Schema.optional(Schema.Array(Schema.String)),
        priority: Schema.optional(Schema.Number),
      }),
    ),
  ),
  ruleset: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      enabled: Schema.optional(Schema.Boolean),
      zoneName: Schema.optional(Schema.String).pipe(T.JsonName("zone_name")),
      zoneTag: Schema.optional(Schema.String).pipe(T.JsonName("zone_tag")),
    }),
  ),
}) as unknown as Schema.Schema<BulkCreateRulesResponse>;

export const bulkCreateRules = API.make(() => ({
  input: BulkCreateRulesRequest,
  output: BulkCreateRulesResponse,
  errors: [],
}));

// =============================================================================
// SiteInfo
// =============================================================================

export interface GetSiteInfoRequest {
  siteId: string;
  /** Identifier. */
  accountId: string;
}

export const GetSiteInfoRequest = Schema.Struct({
  siteId: Schema.String.pipe(T.HttpPath("siteId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/rum/site_info/{siteId}" }),
) as unknown as Schema.Schema<GetSiteInfoRequest>;

export interface GetSiteInfoResponse {
  /** If enabled, the JavaScript snippet is automatically injected for orange-clouded sites. */
  autoInstall?: boolean;
  created?: string;
  /** A list of rules. */
  rules?: unknown[];
  ruleset?: { id?: string; enabled?: boolean; zoneName?: string; zoneTag?: string };
  /** The Web Analytics site identifier. */
  siteTag?: string;
  /** The Web Analytics site token. */
  siteToken?: string;
  /** Encoded JavaScript snippet. */
  snippet?: string;
}

export const GetSiteInfoResponse = Schema.Struct({
  autoInstall: Schema.optional(Schema.Boolean).pipe(T.JsonName("auto_install")),
  created: Schema.optional(Schema.String),
  rules: Schema.optional(Schema.Array(Schema.Unknown)),
  ruleset: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      enabled: Schema.optional(Schema.Boolean),
      zoneName: Schema.optional(Schema.String).pipe(T.JsonName("zone_name")),
      zoneTag: Schema.optional(Schema.String).pipe(T.JsonName("zone_tag")),
    }),
  ),
  siteTag: Schema.optional(Schema.String).pipe(T.JsonName("site_tag")),
  siteToken: Schema.optional(Schema.String).pipe(T.JsonName("site_token")),
  snippet: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetSiteInfoResponse>;

export const getSiteInfo = API.make(() => ({
  input: GetSiteInfoRequest,
  output: GetSiteInfoResponse,
  errors: [],
}));

export interface CreateSiteInfoRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: If enabled, the JavaScript snippet is automatically injected for orange-clouded sites. */
  autoInstall?: boolean;
  /** Body param: The hostname to use for gray-clouded sites. */
  host?: string;
  /** Body param: The zone identifier. */
  zoneTag?: string;
}

export const CreateSiteInfoRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  autoInstall: Schema.optional(Schema.Boolean).pipe(T.JsonName("auto_install")),
  host: Schema.optional(Schema.String),
  zoneTag: Schema.optional(Schema.String).pipe(T.JsonName("zone_tag")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/rum/site_info" }),
) as unknown as Schema.Schema<CreateSiteInfoRequest>;

export interface CreateSiteInfoResponse {
  /** If enabled, the JavaScript snippet is automatically injected for orange-clouded sites. */
  autoInstall?: boolean;
  created?: string;
  /** A list of rules. */
  rules?: unknown[];
  ruleset?: { id?: string; enabled?: boolean; zoneName?: string; zoneTag?: string };
  /** The Web Analytics site identifier. */
  siteTag?: string;
  /** The Web Analytics site token. */
  siteToken?: string;
  /** Encoded JavaScript snippet. */
  snippet?: string;
}

export const CreateSiteInfoResponse = Schema.Struct({
  autoInstall: Schema.optional(Schema.Boolean).pipe(T.JsonName("auto_install")),
  created: Schema.optional(Schema.String),
  rules: Schema.optional(Schema.Array(Schema.Unknown)),
  ruleset: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      enabled: Schema.optional(Schema.Boolean),
      zoneName: Schema.optional(Schema.String).pipe(T.JsonName("zone_name")),
      zoneTag: Schema.optional(Schema.String).pipe(T.JsonName("zone_tag")),
    }),
  ),
  siteTag: Schema.optional(Schema.String).pipe(T.JsonName("site_tag")),
  siteToken: Schema.optional(Schema.String).pipe(T.JsonName("site_token")),
  snippet: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateSiteInfoResponse>;

export const createSiteInfo = API.make(() => ({
  input: CreateSiteInfoRequest,
  output: CreateSiteInfoResponse,
  errors: [],
}));

export interface UpdateSiteInfoRequest {
  siteId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: If enabled, the JavaScript snippet is automatically injected for orange-clouded sites. */
  autoInstall?: boolean;
  /** Body param: Enables or disables RUM. This option can be used only when auto_install is set to true. */
  enabled?: boolean;
  /** Body param: The hostname to use for gray-clouded sites. */
  host?: string;
  /** Body param: If enabled, the JavaScript snippet will not be injected for visitors from the EU. */
  lite?: boolean;
  /** Body param: The zone identifier. */
  zoneTag?: string;
}

export const UpdateSiteInfoRequest = Schema.Struct({
  siteId: Schema.String.pipe(T.HttpPath("siteId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  autoInstall: Schema.optional(Schema.Boolean).pipe(T.JsonName("auto_install")),
  enabled: Schema.optional(Schema.Boolean),
  host: Schema.optional(Schema.String),
  lite: Schema.optional(Schema.Boolean),
  zoneTag: Schema.optional(Schema.String).pipe(T.JsonName("zone_tag")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/rum/site_info/{siteId}" }),
) as unknown as Schema.Schema<UpdateSiteInfoRequest>;

export interface UpdateSiteInfoResponse {
  /** If enabled, the JavaScript snippet is automatically injected for orange-clouded sites. */
  autoInstall?: boolean;
  created?: string;
  /** A list of rules. */
  rules?: unknown[];
  ruleset?: { id?: string; enabled?: boolean; zoneName?: string; zoneTag?: string };
  /** The Web Analytics site identifier. */
  siteTag?: string;
  /** The Web Analytics site token. */
  siteToken?: string;
  /** Encoded JavaScript snippet. */
  snippet?: string;
}

export const UpdateSiteInfoResponse = Schema.Struct({
  autoInstall: Schema.optional(Schema.Boolean).pipe(T.JsonName("auto_install")),
  created: Schema.optional(Schema.String),
  rules: Schema.optional(Schema.Array(Schema.Unknown)),
  ruleset: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      enabled: Schema.optional(Schema.Boolean),
      zoneName: Schema.optional(Schema.String).pipe(T.JsonName("zone_name")),
      zoneTag: Schema.optional(Schema.String).pipe(T.JsonName("zone_tag")),
    }),
  ),
  siteTag: Schema.optional(Schema.String).pipe(T.JsonName("site_tag")),
  siteToken: Schema.optional(Schema.String).pipe(T.JsonName("site_token")),
  snippet: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateSiteInfoResponse>;

export const updateSiteInfo = API.make(() => ({
  input: UpdateSiteInfoRequest,
  output: UpdateSiteInfoResponse,
  errors: [],
}));

export interface DeleteSiteInfoRequest {
  siteId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteSiteInfoRequest = Schema.Struct({
  siteId: Schema.String.pipe(T.HttpPath("siteId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/rum/site_info/{siteId}" }),
) as unknown as Schema.Schema<DeleteSiteInfoRequest>;

export interface DeleteSiteInfoResponse {
  /** The Web Analytics site identifier. */
  siteTag?: string;
}

export const DeleteSiteInfoResponse = Schema.Struct({
  siteTag: Schema.optional(Schema.String).pipe(T.JsonName("site_tag")),
}) as unknown as Schema.Schema<DeleteSiteInfoResponse>;

export const deleteSiteInfo = API.make(() => ({
  input: DeleteSiteInfoRequest,
  output: DeleteSiteInfoResponse,
  errors: [],
}));
