/**
 * Cloudflare FIREWALL API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service firewall
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import {
  UnknownCloudflareError,
  CloudflareNetworkError,
  CloudflareHttpError,
} from "../errors.ts";

// =============================================================================
// AccessRule
// =============================================================================

export interface GetAccessRuleRequest {
  ruleId: string;
}

export const GetAccessRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/firewall/access_rules/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<GetAccessRuleRequest>;

export interface GetAccessRuleResponse {
  /** The unique identifier of the IP Access rule. */
  id: string;
  /** The available actions that a rule can apply to a matched request. */
  allowedModes: (
    | "block"
    | "challenge"
    | "whitelist"
    | "js_challenge"
    | "managed_challenge"
  )[];
  /** The rule configuration. */
  configuration:
    | { target?: "ip"; value?: string }
    | { target?: "ip6"; value?: string }
    | { target?: "ip_range"; value?: string }
    | { target?: "asn"; value?: string }
    | { target?: "country"; value?: string };
  /** The action to apply to a matched request. */
  mode:
    | "block"
    | "challenge"
    | "whitelist"
    | "js_challenge"
    | "managed_challenge";
  /** The timestamp of when the rule was created. */
  createdOn?: string;
  /** The timestamp of when the rule was last modified. */
  modifiedOn?: string;
  /** An informative summary of the rule, typically used as a reminder or explanation. */
  notes?: string;
  /** All zones owned by the user will have the rule applied. */
  scope?: { id?: string; email?: string; type?: "user" | "organization" };
}

export const GetAccessRuleResponse = Schema.Struct({
  id: Schema.String,
  allowedModes: Schema.Array(
    Schema.Literal(
      "block",
      "challenge",
      "whitelist",
      "js_challenge",
      "managed_challenge",
    ),
  ).pipe(T.JsonName("allowed_modes")),
  configuration: Schema.Union(
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip6")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip_range")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("asn")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("country")),
      value: Schema.optional(Schema.String),
    }),
  ),
  mode: Schema.Literal(
    "block",
    "challenge",
    "whitelist",
    "js_challenge",
    "managed_challenge",
  ),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  notes: Schema.optional(Schema.String),
  scope: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      email: Schema.optional(Schema.String),
      type: Schema.optional(Schema.Literal("user", "organization")),
    }),
  ),
}) as unknown as Schema.Schema<GetAccessRuleResponse>;

export const getAccessRule = API.make(() => ({
  input: GetAccessRuleRequest,
  output: GetAccessRuleResponse,
  errors: [],
}));

export interface CreateAccessRuleRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: The rule configuration. */
  configuration:
    | { target?: "ip"; value?: string }
    | { target?: "ip6"; value?: string }
    | { target?: "ip_range"; value?: string }
    | { target?: "asn"; value?: string }
    | { target?: "country"; value?: string };
  /** Body param: The action to apply to a matched request. */
  mode:
    | "block"
    | "challenge"
    | "whitelist"
    | "js_challenge"
    | "managed_challenge";
  /** Body param: An informative summary of the rule, typically used as a reminder or explanation. */
  notes?: string;
}

export const CreateAccessRuleRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  configuration: Schema.Union(
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip6")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip_range")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("asn")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("country")),
      value: Schema.optional(Schema.String),
    }),
  ),
  mode: Schema.Literal(
    "block",
    "challenge",
    "whitelist",
    "js_challenge",
    "managed_challenge",
  ),
  notes: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/firewall/access_rules/rules",
  }),
) as unknown as Schema.Schema<CreateAccessRuleRequest>;

export interface CreateAccessRuleResponse {
  /** The unique identifier of the IP Access rule. */
  id: string;
  /** The available actions that a rule can apply to a matched request. */
  allowedModes: (
    | "block"
    | "challenge"
    | "whitelist"
    | "js_challenge"
    | "managed_challenge"
  )[];
  /** The rule configuration. */
  configuration:
    | { target?: "ip"; value?: string }
    | { target?: "ip6"; value?: string }
    | { target?: "ip_range"; value?: string }
    | { target?: "asn"; value?: string }
    | { target?: "country"; value?: string };
  /** The action to apply to a matched request. */
  mode:
    | "block"
    | "challenge"
    | "whitelist"
    | "js_challenge"
    | "managed_challenge";
  /** The timestamp of when the rule was created. */
  createdOn?: string;
  /** The timestamp of when the rule was last modified. */
  modifiedOn?: string;
  /** An informative summary of the rule, typically used as a reminder or explanation. */
  notes?: string;
  /** All zones owned by the user will have the rule applied. */
  scope?: { id?: string; email?: string; type?: "user" | "organization" };
}

export const CreateAccessRuleResponse = Schema.Struct({
  id: Schema.String,
  allowedModes: Schema.Array(
    Schema.Literal(
      "block",
      "challenge",
      "whitelist",
      "js_challenge",
      "managed_challenge",
    ),
  ).pipe(T.JsonName("allowed_modes")),
  configuration: Schema.Union(
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip6")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip_range")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("asn")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("country")),
      value: Schema.optional(Schema.String),
    }),
  ),
  mode: Schema.Literal(
    "block",
    "challenge",
    "whitelist",
    "js_challenge",
    "managed_challenge",
  ),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  notes: Schema.optional(Schema.String),
  scope: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      email: Schema.optional(Schema.String),
      type: Schema.optional(Schema.Literal("user", "organization")),
    }),
  ),
}) as unknown as Schema.Schema<CreateAccessRuleResponse>;

export const createAccessRule = API.make(() => ({
  input: CreateAccessRuleRequest,
  output: CreateAccessRuleResponse,
  errors: [],
}));

export interface PatchAccessRuleRequest {
  ruleId: string;
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: The rule configuration. */
  configuration:
    | { target?: "ip"; value?: string }
    | { target?: "ip6"; value?: string }
    | { target?: "ip_range"; value?: string }
    | { target?: "asn"; value?: string }
    | { target?: "country"; value?: string };
  /** Body param: The action to apply to a matched request. */
  mode:
    | "block"
    | "challenge"
    | "whitelist"
    | "js_challenge"
    | "managed_challenge";
  /** Body param: An informative summary of the rule, typically used as a reminder or explanation. */
  notes?: string;
}

export const PatchAccessRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  configuration: Schema.Union(
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip6")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip_range")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("asn")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("country")),
      value: Schema.optional(Schema.String),
    }),
  ),
  mode: Schema.Literal(
    "block",
    "challenge",
    "whitelist",
    "js_challenge",
    "managed_challenge",
  ),
  notes: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/{accountOrZone}/{accountOrZoneId}/firewall/access_rules/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<PatchAccessRuleRequest>;

export interface PatchAccessRuleResponse {
  /** The unique identifier of the IP Access rule. */
  id: string;
  /** The available actions that a rule can apply to a matched request. */
  allowedModes: (
    | "block"
    | "challenge"
    | "whitelist"
    | "js_challenge"
    | "managed_challenge"
  )[];
  /** The rule configuration. */
  configuration:
    | { target?: "ip"; value?: string }
    | { target?: "ip6"; value?: string }
    | { target?: "ip_range"; value?: string }
    | { target?: "asn"; value?: string }
    | { target?: "country"; value?: string };
  /** The action to apply to a matched request. */
  mode:
    | "block"
    | "challenge"
    | "whitelist"
    | "js_challenge"
    | "managed_challenge";
  /** The timestamp of when the rule was created. */
  createdOn?: string;
  /** The timestamp of when the rule was last modified. */
  modifiedOn?: string;
  /** An informative summary of the rule, typically used as a reminder or explanation. */
  notes?: string;
  /** All zones owned by the user will have the rule applied. */
  scope?: { id?: string; email?: string; type?: "user" | "organization" };
}

export const PatchAccessRuleResponse = Schema.Struct({
  id: Schema.String,
  allowedModes: Schema.Array(
    Schema.Literal(
      "block",
      "challenge",
      "whitelist",
      "js_challenge",
      "managed_challenge",
    ),
  ).pipe(T.JsonName("allowed_modes")),
  configuration: Schema.Union(
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip6")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("ip_range")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("asn")),
      value: Schema.optional(Schema.String),
    }),
    Schema.Struct({
      target: Schema.optional(Schema.Literal("country")),
      value: Schema.optional(Schema.String),
    }),
  ),
  mode: Schema.Literal(
    "block",
    "challenge",
    "whitelist",
    "js_challenge",
    "managed_challenge",
  ),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  notes: Schema.optional(Schema.String),
  scope: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      email: Schema.optional(Schema.String),
      type: Schema.optional(Schema.Literal("user", "organization")),
    }),
  ),
}) as unknown as Schema.Schema<PatchAccessRuleResponse>;

export const patchAccessRule = API.make(() => ({
  input: PatchAccessRuleRequest,
  output: PatchAccessRuleResponse,
  errors: [],
}));

export interface DeleteAccessRuleRequest {
  ruleId: string;
}

export const DeleteAccessRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/{accountOrZone}/{accountOrZoneId}/firewall/access_rules/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<DeleteAccessRuleRequest>;

export type DeleteAccessRuleResponse = unknown;

export const DeleteAccessRuleResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteAccessRuleResponse>;

export const deleteAccessRule = API.make(() => ({
  input: DeleteAccessRuleRequest,
  output: DeleteAccessRuleResponse,
  errors: [],
}));

// =============================================================================
// Lockdown
// =============================================================================

export interface GetLockdownRequest {
  lockDownsId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const GetLockdownRequest = Schema.Struct({
  lockDownsId: Schema.String.pipe(T.HttpPath("lockDownsId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/firewall/lockdowns/{lockDownsId}",
  }),
) as unknown as Schema.Schema<GetLockdownRequest>;

export interface GetLockdownResponse {
  /** The unique identifier of the Zone Lockdown rule. */
  id: string;
  /** A list of IP addresses or CIDR ranges that will be allowed to access the URLs specified in the Zone Lockdown rule. You can include any number of `ip` or `ip_range` configurations. */
  configurations: unknown;
  /** The timestamp of when the rule was created. */
  createdOn: string;
  /** An informative summary of the rule. */
  description: string;
  /** The timestamp of when the rule was last modified. */
  modifiedOn: string;
  /** When true, indicates that the rule is currently paused. */
  paused: boolean;
  /** The URLs to include in the rule definition. You can use wildcards. Each entered URL will be escaped before use, which means you can only use simple wildcard patterns. */
  urls: string[];
}

export const GetLockdownResponse = Schema.Struct({
  id: Schema.String,
  configurations: Schema.Unknown,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  description: Schema.String,
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  paused: Schema.Boolean,
  urls: Schema.Array(Schema.String),
}) as unknown as Schema.Schema<GetLockdownResponse>;

export const getLockdown = API.make(() => ({
  input: GetLockdownRequest,
  output: GetLockdownResponse,
  errors: [],
}));

export interface CreateLockdownRequest {
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: A list of IP addresses or CIDR ranges that will be allowed to access the URLs specified in the Zone Lockdown rule. You can include any number of `ip` or `ip_range` configurations. */
  configurations: unknown;
  /** Body param: The URLs to include in the current WAF override. You can use wildcards. Each entered URL will be escaped before use, which means you can only use simple wildcard patterns. */
  urls: string[];
  /** Body param: An informative summary of the rule. This value is sanitized and any tags will be removed. */
  description?: string;
  /** Body param: When true, indicates that the rule is currently paused. */
  paused?: boolean;
  /** Body param: The priority of the rule to control the processing order. A lower number indicates higher priority. If not provided, any rules with a configured priority will be processed before rules wit */
  priority?: number;
}

export const CreateLockdownRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  configurations: Schema.Unknown,
  urls: Schema.Array(Schema.String),
  description: Schema.optional(Schema.String),
  paused: Schema.optional(Schema.Boolean),
  priority: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/firewall/lockdowns" }),
) as unknown as Schema.Schema<CreateLockdownRequest>;

export interface CreateLockdownResponse {
  /** The unique identifier of the Zone Lockdown rule. */
  id: string;
  /** A list of IP addresses or CIDR ranges that will be allowed to access the URLs specified in the Zone Lockdown rule. You can include any number of `ip` or `ip_range` configurations. */
  configurations: unknown;
  /** The timestamp of when the rule was created. */
  createdOn: string;
  /** An informative summary of the rule. */
  description: string;
  /** The timestamp of when the rule was last modified. */
  modifiedOn: string;
  /** When true, indicates that the rule is currently paused. */
  paused: boolean;
  /** The URLs to include in the rule definition. You can use wildcards. Each entered URL will be escaped before use, which means you can only use simple wildcard patterns. */
  urls: string[];
}

export const CreateLockdownResponse = Schema.Struct({
  id: Schema.String,
  configurations: Schema.Unknown,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  description: Schema.String,
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  paused: Schema.Boolean,
  urls: Schema.Array(Schema.String),
}) as unknown as Schema.Schema<CreateLockdownResponse>;

export const createLockdown = API.make(() => ({
  input: CreateLockdownRequest,
  output: CreateLockdownResponse,
  errors: [],
}));

export interface UpdateLockdownRequest {
  lockDownsId: string;
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: A list of IP addresses or CIDR ranges that will be allowed to access the URLs specified in the Zone Lockdown rule. You can include any number of `ip` or `ip_range` configurations. */
  configurations: unknown;
  /** Body param: The URLs to include in the current WAF override. You can use wildcards. Each entered URL will be escaped before use, which means you can only use simple wildcard patterns. */
  urls: string[];
}

export const UpdateLockdownRequest = Schema.Struct({
  lockDownsId: Schema.String.pipe(T.HttpPath("lockDownsId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  configurations: Schema.Unknown,
  urls: Schema.Array(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/zones/{zone_id}/firewall/lockdowns/{lockDownsId}",
  }),
) as unknown as Schema.Schema<UpdateLockdownRequest>;

export interface UpdateLockdownResponse {
  /** The unique identifier of the Zone Lockdown rule. */
  id: string;
  /** A list of IP addresses or CIDR ranges that will be allowed to access the URLs specified in the Zone Lockdown rule. You can include any number of `ip` or `ip_range` configurations. */
  configurations: unknown;
  /** The timestamp of when the rule was created. */
  createdOn: string;
  /** An informative summary of the rule. */
  description: string;
  /** The timestamp of when the rule was last modified. */
  modifiedOn: string;
  /** When true, indicates that the rule is currently paused. */
  paused: boolean;
  /** The URLs to include in the rule definition. You can use wildcards. Each entered URL will be escaped before use, which means you can only use simple wildcard patterns. */
  urls: string[];
}

export const UpdateLockdownResponse = Schema.Struct({
  id: Schema.String,
  configurations: Schema.Unknown,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  description: Schema.String,
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  paused: Schema.Boolean,
  urls: Schema.Array(Schema.String),
}) as unknown as Schema.Schema<UpdateLockdownResponse>;

export const updateLockdown = API.make(() => ({
  input: UpdateLockdownRequest,
  output: UpdateLockdownResponse,
  errors: [],
}));

export interface DeleteLockdownRequest {
  lockDownsId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const DeleteLockdownRequest = Schema.Struct({
  lockDownsId: Schema.String.pipe(T.HttpPath("lockDownsId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/firewall/lockdowns/{lockDownsId}",
  }),
) as unknown as Schema.Schema<DeleteLockdownRequest>;

export interface DeleteLockdownResponse {
  /** The unique identifier of the Zone Lockdown rule. */
  id?: string;
}

export const DeleteLockdownResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteLockdownResponse>;

export const deleteLockdown = API.make(() => ({
  input: DeleteLockdownRequest,
  output: DeleteLockdownResponse,
  errors: [],
}));

// =============================================================================
// Rule
// =============================================================================

export interface GetRuleRequest {
  ruleId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const GetRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/firewall/rules/{ruleId}" }),
) as unknown as Schema.Schema<GetRuleRequest>;

export interface GetRuleResponse {
  /** The unique identifier of the firewall rule. */
  id?: string;
  /** The action to apply to a matched request. The `log` action is only available on an Enterprise plan. */
  action?:
    | "block"
    | "challenge"
    | "js_challenge"
    | "managed_challenge"
    | "allow"
    | "log"
    | "bypass";
  /** An informative summary of the firewall rule. */
  description?: string;
  filter?: unknown | { id: string; deleted: boolean };
  /** When true, indicates that the firewall rule is currently paused. */
  paused?: boolean;
  /** The priority of the rule. Optional value used to define the processing order. A lower number indicates a higher priority. If not provided, rules with a defined priority will be processed before rules  */
  priority?: number;
  products?: (
    | "zoneLockdown"
    | "uaBlock"
    | "bic"
    | "hot"
    | "securityLevel"
    | "rateLimit"
    | "waf"
  )[];
  /** A short reference tag. Allows you to select related firewall rules. */
  ref?: string;
}

export const GetRuleResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  action: Schema.optional(
    Schema.Literal(
      "block",
      "challenge",
      "js_challenge",
      "managed_challenge",
      "allow",
      "log",
      "bypass",
    ),
  ),
  description: Schema.optional(Schema.String),
  filter: Schema.optional(
    Schema.Union(
      Schema.Unknown,
      Schema.Struct({
        id: Schema.String,
        deleted: Schema.Boolean,
      }),
    ),
  ),
  paused: Schema.optional(Schema.Boolean),
  priority: Schema.optional(Schema.Number),
  products: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "zoneLockdown",
        "uaBlock",
        "bic",
        "hot",
        "securityLevel",
        "rateLimit",
        "waf",
      ),
    ),
  ),
  ref: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetRuleResponse>;

export const getRule = API.make(() => ({
  input: GetRuleRequest,
  output: GetRuleResponse,
  errors: [],
}));

export interface PutRuleRequest {
  ruleId: string;
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: The action to perform when the threshold of matched traffic within the configured period is exceeded. */
  action: {
    mode?:
      | "simulate"
      | "ban"
      | "challenge"
      | "js_challenge"
      | "managed_challenge";
    response?: { body?: string; contentType?: string };
    timeout?: number;
  };
  /** Body param: */
  filter: unknown;
}

export const PutRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  action: Schema.Struct({
    mode: Schema.optional(
      Schema.Literal(
        "simulate",
        "ban",
        "challenge",
        "js_challenge",
        "managed_challenge",
      ),
    ),
    response: Schema.optional(
      Schema.Struct({
        body: Schema.optional(Schema.String),
        contentType: Schema.optional(Schema.String).pipe(
          T.JsonName("content_type"),
        ),
      }),
    ),
    timeout: Schema.optional(Schema.Number),
  }),
  filter: Schema.Unknown,
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/firewall/rules/{ruleId}" }),
) as unknown as Schema.Schema<PutRuleRequest>;

export interface PutRuleResponse {
  /** The unique identifier of the firewall rule. */
  id?: string;
  /** The action to apply to a matched request. The `log` action is only available on an Enterprise plan. */
  action?:
    | "block"
    | "challenge"
    | "js_challenge"
    | "managed_challenge"
    | "allow"
    | "log"
    | "bypass";
  /** An informative summary of the firewall rule. */
  description?: string;
  filter?: unknown | { id: string; deleted: boolean };
  /** When true, indicates that the firewall rule is currently paused. */
  paused?: boolean;
  /** The priority of the rule. Optional value used to define the processing order. A lower number indicates a higher priority. If not provided, rules with a defined priority will be processed before rules  */
  priority?: number;
  products?: (
    | "zoneLockdown"
    | "uaBlock"
    | "bic"
    | "hot"
    | "securityLevel"
    | "rateLimit"
    | "waf"
  )[];
  /** A short reference tag. Allows you to select related firewall rules. */
  ref?: string;
}

export const PutRuleResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  action: Schema.optional(
    Schema.Literal(
      "block",
      "challenge",
      "js_challenge",
      "managed_challenge",
      "allow",
      "log",
      "bypass",
    ),
  ),
  description: Schema.optional(Schema.String),
  filter: Schema.optional(
    Schema.Union(
      Schema.Unknown,
      Schema.Struct({
        id: Schema.String,
        deleted: Schema.Boolean,
      }),
    ),
  ),
  paused: Schema.optional(Schema.Boolean),
  priority: Schema.optional(Schema.Number),
  products: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "zoneLockdown",
        "uaBlock",
        "bic",
        "hot",
        "securityLevel",
        "rateLimit",
        "waf",
      ),
    ),
  ),
  ref: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PutRuleResponse>;

export const putRule = API.make(() => ({
  input: PutRuleRequest,
  output: PutRuleResponse,
  errors: [],
}));

export interface DeleteRuleRequest {
  ruleId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const DeleteRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/firewall/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<DeleteRuleRequest>;

export interface DeleteRuleResponse {
  /** The unique identifier of the firewall rule. */
  id?: string;
  /** The action to apply to a matched request. The `log` action is only available on an Enterprise plan. */
  action?:
    | "block"
    | "challenge"
    | "js_challenge"
    | "managed_challenge"
    | "allow"
    | "log"
    | "bypass";
  /** An informative summary of the firewall rule. */
  description?: string;
  filter?: unknown | { id: string; deleted: boolean };
  /** When true, indicates that the firewall rule is currently paused. */
  paused?: boolean;
  /** The priority of the rule. Optional value used to define the processing order. A lower number indicates a higher priority. If not provided, rules with a defined priority will be processed before rules  */
  priority?: number;
  products?: (
    | "zoneLockdown"
    | "uaBlock"
    | "bic"
    | "hot"
    | "securityLevel"
    | "rateLimit"
    | "waf"
  )[];
  /** A short reference tag. Allows you to select related firewall rules. */
  ref?: string;
}

export const DeleteRuleResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  action: Schema.optional(
    Schema.Literal(
      "block",
      "challenge",
      "js_challenge",
      "managed_challenge",
      "allow",
      "log",
      "bypass",
    ),
  ),
  description: Schema.optional(Schema.String),
  filter: Schema.optional(
    Schema.Union(
      Schema.Unknown,
      Schema.Struct({
        id: Schema.String,
        deleted: Schema.Boolean,
      }),
    ),
  ),
  paused: Schema.optional(Schema.Boolean),
  priority: Schema.optional(Schema.Number),
  products: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "zoneLockdown",
        "uaBlock",
        "bic",
        "hot",
        "securityLevel",
        "rateLimit",
        "waf",
      ),
    ),
  ),
  ref: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteRuleResponse>;

export const deleteRule = API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResponse,
  errors: [],
}));

// =============================================================================
// UaRule
// =============================================================================

export interface GetUaRuleRequest {
  uaRuleId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const GetUaRuleRequest = Schema.Struct({
  uaRuleId: Schema.String.pipe(T.HttpPath("uaRuleId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/firewall/ua_rules/{uaRuleId}",
  }),
) as unknown as Schema.Schema<GetUaRuleRequest>;

export interface GetUaRuleResponse {
  /** The unique identifier of the User Agent Blocking rule. */
  id?: string;
  /** The configuration object for the current rule. */
  configuration?: { target?: string; value?: string };
  /** An informative summary of the rule. */
  description?: string;
  /** The action to apply to a matched request. */
  mode?: "block" | "challenge" | "js_challenge" | "managed_challenge";
  /** When true, indicates that the rule is currently paused. */
  paused?: boolean;
}

export const GetUaRuleResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  configuration: Schema.optional(
    Schema.Struct({
      target: Schema.optional(Schema.String),
      value: Schema.optional(Schema.String),
    }),
  ),
  description: Schema.optional(Schema.String),
  mode: Schema.optional(
    Schema.Literal("block", "challenge", "js_challenge", "managed_challenge"),
  ),
  paused: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<GetUaRuleResponse>;

export const getUaRule = API.make(() => ({
  input: GetUaRuleRequest,
  output: GetUaRuleResponse,
  errors: [],
}));

export interface CreateUaRuleRequest {
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: */
  configuration: { target?: "ua"; value?: string };
  /** Body param: The action to apply to a matched request. */
  mode:
    | "block"
    | "challenge"
    | "whitelist"
    | "js_challenge"
    | "managed_challenge";
  /** Body param: An informative summary of the rule. This value is sanitized and any tags will be removed. */
  description?: string;
  /** Body param: When true, indicates that the rule is currently paused. */
  paused?: boolean;
}

export const CreateUaRuleRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  configuration: Schema.Struct({
    target: Schema.optional(Schema.Literal("ua")),
    value: Schema.optional(Schema.String),
  }),
  mode: Schema.Literal(
    "block",
    "challenge",
    "whitelist",
    "js_challenge",
    "managed_challenge",
  ),
  description: Schema.optional(Schema.String),
  paused: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/firewall/ua_rules" }),
) as unknown as Schema.Schema<CreateUaRuleRequest>;

export interface CreateUaRuleResponse {
  /** The unique identifier of the User Agent Blocking rule. */
  id?: string;
  /** The configuration object for the current rule. */
  configuration?: { target?: string; value?: string };
  /** An informative summary of the rule. */
  description?: string;
  /** The action to apply to a matched request. */
  mode?: "block" | "challenge" | "js_challenge" | "managed_challenge";
  /** When true, indicates that the rule is currently paused. */
  paused?: boolean;
}

export const CreateUaRuleResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  configuration: Schema.optional(
    Schema.Struct({
      target: Schema.optional(Schema.String),
      value: Schema.optional(Schema.String),
    }),
  ),
  description: Schema.optional(Schema.String),
  mode: Schema.optional(
    Schema.Literal("block", "challenge", "js_challenge", "managed_challenge"),
  ),
  paused: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<CreateUaRuleResponse>;

export const createUaRule = API.make(() => ({
  input: CreateUaRuleRequest,
  output: CreateUaRuleResponse,
  errors: [],
}));

export interface UpdateUaRuleRequest {
  uaRuleId: string;
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: The rule configuration. */
  configuration: unknown;
  /** Body param: The action to apply to a matched request. */
  mode:
    | "block"
    | "challenge"
    | "whitelist"
    | "js_challenge"
    | "managed_challenge";
  /** Body param: An informative summary of the rule. This value is sanitized and any tags will be removed. */
  description?: string;
  /** Body param: When true, indicates that the rule is currently paused. */
  paused?: boolean;
}

export const UpdateUaRuleRequest = Schema.Struct({
  uaRuleId: Schema.String.pipe(T.HttpPath("uaRuleId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  configuration: Schema.Unknown,
  mode: Schema.Literal(
    "block",
    "challenge",
    "whitelist",
    "js_challenge",
    "managed_challenge",
  ),
  description: Schema.optional(Schema.String),
  paused: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/zones/{zone_id}/firewall/ua_rules/{uaRuleId}",
  }),
) as unknown as Schema.Schema<UpdateUaRuleRequest>;

export interface UpdateUaRuleResponse {
  /** The unique identifier of the User Agent Blocking rule. */
  id?: string;
  /** The configuration object for the current rule. */
  configuration?: { target?: string; value?: string };
  /** An informative summary of the rule. */
  description?: string;
  /** The action to apply to a matched request. */
  mode?: "block" | "challenge" | "js_challenge" | "managed_challenge";
  /** When true, indicates that the rule is currently paused. */
  paused?: boolean;
}

export const UpdateUaRuleResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  configuration: Schema.optional(
    Schema.Struct({
      target: Schema.optional(Schema.String),
      value: Schema.optional(Schema.String),
    }),
  ),
  description: Schema.optional(Schema.String),
  mode: Schema.optional(
    Schema.Literal("block", "challenge", "js_challenge", "managed_challenge"),
  ),
  paused: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<UpdateUaRuleResponse>;

export const updateUaRule = API.make(() => ({
  input: UpdateUaRuleRequest,
  output: UpdateUaRuleResponse,
  errors: [],
}));

export interface DeleteUaRuleRequest {
  uaRuleId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const DeleteUaRuleRequest = Schema.Struct({
  uaRuleId: Schema.String.pipe(T.HttpPath("uaRuleId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/firewall/ua_rules/{uaRuleId}",
  }),
) as unknown as Schema.Schema<DeleteUaRuleRequest>;

export interface DeleteUaRuleResponse {
  /** The unique identifier of the User Agent Blocking rule. */
  id?: string;
  /** The configuration object for the current rule. */
  configuration?: { target?: string; value?: string };
  /** An informative summary of the rule. */
  description?: string;
  /** The action to apply to a matched request. */
  mode?: "block" | "challenge" | "js_challenge" | "managed_challenge";
  /** When true, indicates that the rule is currently paused. */
  paused?: boolean;
}

export const DeleteUaRuleResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  configuration: Schema.optional(
    Schema.Struct({
      target: Schema.optional(Schema.String),
      value: Schema.optional(Schema.String),
    }),
  ),
  description: Schema.optional(Schema.String),
  mode: Schema.optional(
    Schema.Literal("block", "challenge", "js_challenge", "managed_challenge"),
  ),
  paused: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<DeleteUaRuleResponse>;

export const deleteUaRule = API.make(() => ({
  input: DeleteUaRuleRequest,
  output: DeleteUaRuleResponse,
  errors: [],
}));

// =============================================================================
// WafOverride
// =============================================================================

export interface GetWafOverrideRequest {
  overridesId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const GetWafOverrideRequest = Schema.Struct({
  overridesId: Schema.String.pipe(T.HttpPath("overridesId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/firewall/waf/overrides/{overridesId}",
  }),
) as unknown as Schema.Schema<GetWafOverrideRequest>;

export interface GetWafOverrideResponse {
  /** The unique identifier of the WAF override. */
  id?: string;
  /** An informative summary of the current URI-based WAF override. */
  description?: string | null;
  /** An object that allows you to enable or disable WAF rule groups for the current WAF override. Each key of this object must be the ID of a WAF rule group, and each value must be a valid WAF action (usua */
  groups?: Record<string, unknown>;
  /** When true, indicates that the rule is currently paused. */
  paused?: boolean;
  /** The relative priority of the current URI-based WAF override when multiple overrides match a single URL. A lower number indicates higher priority. Higher priority overrides may overwrite values set by  */
  priority?: number;
  /** Specifies that, when a WAF rule matches, its configured action will be replaced by the action configured in this object. */
  rewriteAction?: {
    block?: "challenge" | "block" | "simulate" | "disable" | "default";
    challenge?: "challenge" | "block" | "simulate" | "disable" | "default";
    default?: "challenge" | "block" | "simulate" | "disable" | "default";
    disable?: "challenge" | "block" | "simulate" | "disable" | "default";
    simulate?: "challenge" | "block" | "simulate" | "disable" | "default";
  };
  /** An object that allows you to override the action of specific WAF rules. Each key of this object must be the ID of a WAF rule, and each value must be a valid WAF action. Unless you are disabling a rule */
  rules?: unknown;
  /** The URLs to include in the current WAF override. You can use wildcards. Each entered URL will be escaped before use, which means you can only use simple wildcard patterns. */
  urls?: string[];
}

export const GetWafOverrideResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  groups: Schema.optional(Schema.Struct({})),
  paused: Schema.optional(Schema.Boolean),
  priority: Schema.optional(Schema.Number),
  rewriteAction: Schema.optional(
    Schema.Struct({
      block: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      challenge: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      default: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      disable: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      simulate: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
    }),
  ).pipe(T.JsonName("rewrite_action")),
  rules: Schema.optional(Schema.Unknown),
  urls: Schema.optional(Schema.Array(Schema.String)),
}) as unknown as Schema.Schema<GetWafOverrideResponse>;

export const getWafOverride = API.make(() => ({
  input: GetWafOverrideRequest,
  output: GetWafOverrideResponse,
  errors: [],
}));

export interface CreateWafOverrideRequest {
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: The URLs to include in the current WAF override. You can use wildcards. Each entered URL will be escaped before use, which means you can only use simple wildcard patterns. */
  urls: string[];
}

export const CreateWafOverrideRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  urls: Schema.Array(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/firewall/waf/overrides" }),
) as unknown as Schema.Schema<CreateWafOverrideRequest>;

export interface CreateWafOverrideResponse {
  /** The unique identifier of the WAF override. */
  id?: string;
  /** An informative summary of the current URI-based WAF override. */
  description?: string | null;
  /** An object that allows you to enable or disable WAF rule groups for the current WAF override. Each key of this object must be the ID of a WAF rule group, and each value must be a valid WAF action (usua */
  groups?: Record<string, unknown>;
  /** When true, indicates that the rule is currently paused. */
  paused?: boolean;
  /** The relative priority of the current URI-based WAF override when multiple overrides match a single URL. A lower number indicates higher priority. Higher priority overrides may overwrite values set by  */
  priority?: number;
  /** Specifies that, when a WAF rule matches, its configured action will be replaced by the action configured in this object. */
  rewriteAction?: {
    block?: "challenge" | "block" | "simulate" | "disable" | "default";
    challenge?: "challenge" | "block" | "simulate" | "disable" | "default";
    default?: "challenge" | "block" | "simulate" | "disable" | "default";
    disable?: "challenge" | "block" | "simulate" | "disable" | "default";
    simulate?: "challenge" | "block" | "simulate" | "disable" | "default";
  };
  /** An object that allows you to override the action of specific WAF rules. Each key of this object must be the ID of a WAF rule, and each value must be a valid WAF action. Unless you are disabling a rule */
  rules?: unknown;
  /** The URLs to include in the current WAF override. You can use wildcards. Each entered URL will be escaped before use, which means you can only use simple wildcard patterns. */
  urls?: string[];
}

export const CreateWafOverrideResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  groups: Schema.optional(Schema.Struct({})),
  paused: Schema.optional(Schema.Boolean),
  priority: Schema.optional(Schema.Number),
  rewriteAction: Schema.optional(
    Schema.Struct({
      block: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      challenge: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      default: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      disable: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      simulate: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
    }),
  ).pipe(T.JsonName("rewrite_action")),
  rules: Schema.optional(Schema.Unknown),
  urls: Schema.optional(Schema.Array(Schema.String)),
}) as unknown as Schema.Schema<CreateWafOverrideResponse>;

export const createWafOverride = API.make(() => ({
  input: CreateWafOverrideRequest,
  output: CreateWafOverrideResponse,
  errors: [],
}));

export interface UpdateWafOverrideRequest {
  overridesId: string;
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: Defines an identifier. */
  id: string;
  /** Body param: Specifies that, when a WAF rule matches, its configured action will be replaced by the action configured in this object. */
  rewriteAction: {
    block?: "challenge" | "block" | "simulate" | "disable" | "default";
    challenge?: "challenge" | "block" | "simulate" | "disable" | "default";
    default?: "challenge" | "block" | "simulate" | "disable" | "default";
    disable?: "challenge" | "block" | "simulate" | "disable" | "default";
    simulate?: "challenge" | "block" | "simulate" | "disable" | "default";
  };
  /** Body param: An object that allows you to override the action of specific WAF rules. Each key of this object must be the ID of a WAF rule, and each value must be a valid WAF action. Unless you are disa */
  rules: unknown;
  /** Body param: The URLs to include in the current WAF override. You can use wildcards. Each entered URL will be escaped before use, which means you can only use simple wildcard patterns. */
  urls: string[];
}

export const UpdateWafOverrideRequest = Schema.Struct({
  overridesId: Schema.String.pipe(T.HttpPath("overridesId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  id: Schema.String,
  rewriteAction: Schema.Struct({
    block: Schema.optional(
      Schema.Literal("challenge", "block", "simulate", "disable", "default"),
    ),
    challenge: Schema.optional(
      Schema.Literal("challenge", "block", "simulate", "disable", "default"),
    ),
    default: Schema.optional(
      Schema.Literal("challenge", "block", "simulate", "disable", "default"),
    ),
    disable: Schema.optional(
      Schema.Literal("challenge", "block", "simulate", "disable", "default"),
    ),
    simulate: Schema.optional(
      Schema.Literal("challenge", "block", "simulate", "disable", "default"),
    ),
  }).pipe(T.JsonName("rewrite_action")),
  rules: Schema.Unknown,
  urls: Schema.Array(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/zones/{zone_id}/firewall/waf/overrides/{overridesId}",
  }),
) as unknown as Schema.Schema<UpdateWafOverrideRequest>;

export interface UpdateWafOverrideResponse {
  /** The unique identifier of the WAF override. */
  id?: string;
  /** An informative summary of the current URI-based WAF override. */
  description?: string | null;
  /** An object that allows you to enable or disable WAF rule groups for the current WAF override. Each key of this object must be the ID of a WAF rule group, and each value must be a valid WAF action (usua */
  groups?: Record<string, unknown>;
  /** When true, indicates that the rule is currently paused. */
  paused?: boolean;
  /** The relative priority of the current URI-based WAF override when multiple overrides match a single URL. A lower number indicates higher priority. Higher priority overrides may overwrite values set by  */
  priority?: number;
  /** Specifies that, when a WAF rule matches, its configured action will be replaced by the action configured in this object. */
  rewriteAction?: {
    block?: "challenge" | "block" | "simulate" | "disable" | "default";
    challenge?: "challenge" | "block" | "simulate" | "disable" | "default";
    default?: "challenge" | "block" | "simulate" | "disable" | "default";
    disable?: "challenge" | "block" | "simulate" | "disable" | "default";
    simulate?: "challenge" | "block" | "simulate" | "disable" | "default";
  };
  /** An object that allows you to override the action of specific WAF rules. Each key of this object must be the ID of a WAF rule, and each value must be a valid WAF action. Unless you are disabling a rule */
  rules?: unknown;
  /** The URLs to include in the current WAF override. You can use wildcards. Each entered URL will be escaped before use, which means you can only use simple wildcard patterns. */
  urls?: string[];
}

export const UpdateWafOverrideResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  groups: Schema.optional(Schema.Struct({})),
  paused: Schema.optional(Schema.Boolean),
  priority: Schema.optional(Schema.Number),
  rewriteAction: Schema.optional(
    Schema.Struct({
      block: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      challenge: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      default: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      disable: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
      simulate: Schema.optional(
        Schema.Literal("challenge", "block", "simulate", "disable", "default"),
      ),
    }),
  ).pipe(T.JsonName("rewrite_action")),
  rules: Schema.optional(Schema.Unknown),
  urls: Schema.optional(Schema.Array(Schema.String)),
}) as unknown as Schema.Schema<UpdateWafOverrideResponse>;

export const updateWafOverride = API.make(() => ({
  input: UpdateWafOverrideRequest,
  output: UpdateWafOverrideResponse,
  errors: [],
}));

export interface DeleteWafOverrideRequest {
  overridesId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const DeleteWafOverrideRequest = Schema.Struct({
  overridesId: Schema.String.pipe(T.HttpPath("overridesId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/firewall/waf/overrides/{overridesId}",
  }),
) as unknown as Schema.Schema<DeleteWafOverrideRequest>;

export interface DeleteWafOverrideResponse {
  /** The unique identifier of the WAF override. */
  id?: string;
}

export const DeleteWafOverrideResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteWafOverrideResponse>;

export const deleteWafOverride = API.make(() => ({
  input: DeleteWafOverrideRequest,
  output: DeleteWafOverrideResponse,
  errors: [],
}));

// =============================================================================
// WafPackage
// =============================================================================

export interface GetWafPackageRequest {
  packageId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const GetWafPackageRequest = Schema.Struct({
  packageId: Schema.String.pipe(T.HttpPath("packageId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/firewall/waf/packages/{packageId}",
  }),
) as unknown as Schema.Schema<GetWafPackageRequest>;

export type GetWafPackageResponse =
  | {
      errors: unknown[];
      messages: unknown[];
      result: string | null;
      success: true;
    }
  | { result?: unknown };

export const GetWafPackageResponse = Schema.Union(
  Schema.Struct({
    errors: Schema.Array(Schema.Unknown),
    messages: Schema.Array(Schema.Unknown),
    result: Schema.Union(Schema.String, Schema.Null),
    success: Schema.Literal(true),
  }),
  Schema.Struct({
    result: Schema.optional(Schema.Unknown),
  }),
) as unknown as Schema.Schema<GetWafPackageResponse>;

export const getWafPackage = API.make(() => ({
  input: GetWafPackageRequest,
  output: GetWafPackageResponse,
  errors: [],
}));

// =============================================================================
// WafPackageGroup
// =============================================================================

export interface GetWafPackageGroupRequest {
  packageId: string;
  groupId: string;
  /** Defines an identifier of a schema. */
  zoneId: string;
}

export const GetWafPackageGroupRequest = Schema.Struct({
  packageId: Schema.String.pipe(T.HttpPath("packageId")),
  groupId: Schema.String.pipe(T.HttpPath("groupId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/firewall/waf/packages/{packageId}/groups/{groupId}",
  }),
) as unknown as Schema.Schema<GetWafPackageGroupRequest>;

export type GetWafPackageGroupResponse = string | null;

export const GetWafPackageGroupResponse = Schema.Union(
  Schema.String,
  Schema.Null,
) as unknown as Schema.Schema<GetWafPackageGroupResponse>;

export const getWafPackageGroup = API.make(() => ({
  input: GetWafPackageGroupRequest,
  output: GetWafPackageGroupResponse,
  errors: [],
}));

export interface PatchWafPackageGroupRequest {
  packageId: string;
  groupId: string;
  /** Path param: Defines an identifier of a schema. */
  zoneId: string;
  /** Body param: Defines the state of the rules contained in the rule group. When `on`, the rules in the group are configurable/usable. */
  mode?: "on" | "off";
}

export const PatchWafPackageGroupRequest = Schema.Struct({
  packageId: Schema.String.pipe(T.HttpPath("packageId")),
  groupId: Schema.String.pipe(T.HttpPath("groupId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  mode: Schema.optional(Schema.Literal("on", "off")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/zones/{zone_id}/firewall/waf/packages/{packageId}/groups/{groupId}",
  }),
) as unknown as Schema.Schema<PatchWafPackageGroupRequest>;

export type PatchWafPackageGroupResponse = string | null;

export const PatchWafPackageGroupResponse = Schema.Union(
  Schema.String,
  Schema.Null,
) as unknown as Schema.Schema<PatchWafPackageGroupResponse>;

export const patchWafPackageGroup = API.make(() => ({
  input: PatchWafPackageGroupRequest,
  output: PatchWafPackageGroupResponse,
  errors: [],
}));

// =============================================================================
// WafPackageRule
// =============================================================================

export interface GetWafPackageRuleRequest {
  packageId: string;
  ruleId: string;
  /** Defines an identifier of a schema. */
  zoneId: string;
}

export const GetWafPackageRuleRequest = Schema.Struct({
  packageId: Schema.String.pipe(T.HttpPath("packageId")),
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/firewall/waf/packages/{packageId}/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<GetWafPackageRuleRequest>;

export type GetWafPackageRuleResponse = string | null;

export const GetWafPackageRuleResponse = Schema.Union(
  Schema.String,
  Schema.Null,
) as unknown as Schema.Schema<GetWafPackageRuleResponse>;

export const getWafPackageRule = API.make(() => ({
  input: GetWafPackageRuleRequest,
  output: GetWafPackageRuleResponse,
  errors: [],
}));

export interface PatchWafPackageRuleRequest {
  packageId: string;
  ruleId: string;
  /** Path param: Defines an identifier of a schema. */
  zoneId: string;
  /** Body param: Defines the mode/action of the rule when triggered. You must use a value from the `allowed_modes` array of the current rule. */
  mode?:
    | "default"
    | "disable"
    | "simulate"
    | "block"
    | "challenge"
    | "on"
    | "off";
}

export const PatchWafPackageRuleRequest = Schema.Struct({
  packageId: Schema.String.pipe(T.HttpPath("packageId")),
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  mode: Schema.optional(
    Schema.Literal(
      "default",
      "disable",
      "simulate",
      "block",
      "challenge",
      "on",
      "off",
    ),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/zones/{zone_id}/firewall/waf/packages/{packageId}/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<PatchWafPackageRuleRequest>;

export type PatchWafPackageRuleResponse =
  | {
      id: string;
      allowedModes: ("on" | "off")[];
      description: string;
      group: unknown;
      mode: "on" | "off";
      packageId: string;
      priority: string;
    }
  | {
      id: string;
      allowedModes: (
        | "default"
        | "disable"
        | "simulate"
        | "block"
        | "challenge"
      )[];
      defaultMode: "disable" | "simulate" | "block" | "challenge";
      description: string;
      group: unknown;
      mode: "default" | "disable" | "simulate" | "block" | "challenge";
      packageId: string;
      priority: string;
    };

export const PatchWafPackageRuleResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    allowedModes: Schema.Array(Schema.Literal("on", "off")).pipe(
      T.JsonName("allowed_modes"),
    ),
    description: Schema.String,
    group: Schema.Unknown,
    mode: Schema.Literal("on", "off"),
    packageId: Schema.String.pipe(T.JsonName("package_id")),
    priority: Schema.String,
  }),
  Schema.Struct({
    id: Schema.String,
    allowedModes: Schema.Array(
      Schema.Literal("default", "disable", "simulate", "block", "challenge"),
    ).pipe(T.JsonName("allowed_modes")),
    defaultMode: Schema.Literal(
      "disable",
      "simulate",
      "block",
      "challenge",
    ).pipe(T.JsonName("default_mode")),
    description: Schema.String,
    group: Schema.Unknown,
    mode: Schema.Literal(
      "default",
      "disable",
      "simulate",
      "block",
      "challenge",
    ),
    packageId: Schema.String.pipe(T.JsonName("package_id")),
    priority: Schema.String,
  }),
) as unknown as Schema.Schema<PatchWafPackageRuleResponse>;

export const patchWafPackageRule = API.make(() => ({
  input: PatchWafPackageRuleRequest,
  output: PatchWafPackageRuleResponse,
  errors: [],
}));
