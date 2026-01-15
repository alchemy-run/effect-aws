/**
 * Cloudflare RULESETS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service rulesets
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Pha
// =============================================================================

export interface GetPhasRequest {}

export const GetPhasRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/rulesets/phases/{rulesetPhase}/entrypoint",
  }),
) as unknown as Schema.Schema<GetPhasRequest>;

export interface GetPhasResponse {
  /** The unique ID of the ruleset. */
  id: string;
  /** The kind of the ruleset. */
  kind: "managed" | "custom" | "root" | "zone";
  /** The timestamp of when the ruleset was last modified. */
  lastUpdated: string;
  /** The human-readable name of the ruleset. */
  name: string;
  /** The phase of the ruleset. */
  phase:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** The list of rules in the ruleset. */
  rules: (
    | unknown
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
  /** The version of the ruleset. */
  version: string;
  /** An informative description of the ruleset. */
  description?: string;
}

export const GetPhasResponse = Schema.Struct({
  id: Schema.String,
  kind: Schema.Literal("managed", "custom", "root", "zone"),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  name: Schema.String,
  phase: Schema.Literal(
    "ddos_l4",
    "ddos_l7",
    "http_config_settings",
    "http_custom_errors",
    "http_log_custom_fields",
    "http_ratelimit",
    "http_request_cache_settings",
    "http_request_dynamic_redirect",
    "http_request_firewall_custom",
    "http_request_firewall_managed",
    "http_request_late_transform",
    "http_request_origin",
    "http_request_redirect",
    "http_request_sanitize",
    "http_request_sbfm",
    "http_request_transform",
    "http_response_compression",
    "http_response_firewall_managed",
    "http_response_headers_transform",
    "magic_transit",
    "magic_transit_ids_managed",
    "magic_transit_managed",
    "magic_transit_ratelimit",
  ),
  rules: Schema.Array(
    Schema.Union(
      Schema.Unknown,
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("js_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
    ),
  ),
  version: Schema.String,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetPhasResponse>;

export const getPhas = API.make(() => ({
  input: GetPhasRequest,
  output: GetPhasResponse,
  errors: [],
}));

export interface PutPhasRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: An informative description of the ruleset. */
  description?: string;
  /** Body param: The human-readable name of the ruleset. */
  name?: string;
  /** Body param: The list of rules in the ruleset. */
  rules?: (
    | unknown
    | {
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
}

export const PutPhasRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  description: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  rules: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Unknown,
        Schema.Struct({
          id: Schema.optional(Schema.String),
          action: Schema.optional(Schema.Literal("challenge")),
          actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
          description: Schema.optional(Schema.String),
          enabled: Schema.optional(Schema.Boolean),
          exposedCredentialCheck: Schema.optional(
            Schema.Struct({
              passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
              usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
            }),
          ).pipe(T.JsonName("exposed_credential_check")),
          expression: Schema.optional(Schema.String),
          logging: Schema.optional(Schema.Unknown),
          ratelimit: Schema.optional(
            Schema.Struct({
              characteristics: Schema.Array(Schema.String),
              period: Schema.Number,
              countingExpression: Schema.optional(Schema.String).pipe(
                T.JsonName("counting_expression"),
              ),
              mitigationTimeout: Schema.optional(Schema.Number).pipe(
                T.JsonName("mitigation_timeout"),
              ),
              requestsPerPeriod: Schema.optional(Schema.Number).pipe(
                T.JsonName("requests_per_period"),
              ),
              requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("requests_to_origin"),
              ),
              scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
              scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
                T.JsonName("score_response_header_name"),
              ),
            }),
          ),
          ref: Schema.optional(Schema.String),
        }),
        Schema.Struct({
          id: Schema.optional(Schema.String),
          action: Schema.optional(Schema.Literal("js_challenge")),
          actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
          description: Schema.optional(Schema.String),
          enabled: Schema.optional(Schema.Boolean),
          exposedCredentialCheck: Schema.optional(
            Schema.Struct({
              passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
              usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
            }),
          ).pipe(T.JsonName("exposed_credential_check")),
          expression: Schema.optional(Schema.String),
          logging: Schema.optional(Schema.Unknown),
          ratelimit: Schema.optional(
            Schema.Struct({
              characteristics: Schema.Array(Schema.String),
              period: Schema.Number,
              countingExpression: Schema.optional(Schema.String).pipe(
                T.JsonName("counting_expression"),
              ),
              mitigationTimeout: Schema.optional(Schema.Number).pipe(
                T.JsonName("mitigation_timeout"),
              ),
              requestsPerPeriod: Schema.optional(Schema.Number).pipe(
                T.JsonName("requests_per_period"),
              ),
              requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("requests_to_origin"),
              ),
              scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
              scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
                T.JsonName("score_response_header_name"),
              ),
            }),
          ),
          ref: Schema.optional(Schema.String),
        }),
      ),
    ),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/{accountOrZone}/{accountOrZoneId}/rulesets/phases/{rulesetPhase}/entrypoint",
  }),
) as unknown as Schema.Schema<PutPhasRequest>;

export interface PutPhasResponse {
  /** The unique ID of the ruleset. */
  id: string;
  /** The kind of the ruleset. */
  kind: "managed" | "custom" | "root" | "zone";
  /** The timestamp of when the ruleset was last modified. */
  lastUpdated: string;
  /** The human-readable name of the ruleset. */
  name: string;
  /** The phase of the ruleset. */
  phase:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** The list of rules in the ruleset. */
  rules: (
    | unknown
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
  /** The version of the ruleset. */
  version: string;
  /** An informative description of the ruleset. */
  description?: string;
}

export const PutPhasResponse = Schema.Struct({
  id: Schema.String,
  kind: Schema.Literal("managed", "custom", "root", "zone"),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  name: Schema.String,
  phase: Schema.Literal(
    "ddos_l4",
    "ddos_l7",
    "http_config_settings",
    "http_custom_errors",
    "http_log_custom_fields",
    "http_ratelimit",
    "http_request_cache_settings",
    "http_request_dynamic_redirect",
    "http_request_firewall_custom",
    "http_request_firewall_managed",
    "http_request_late_transform",
    "http_request_origin",
    "http_request_redirect",
    "http_request_sanitize",
    "http_request_sbfm",
    "http_request_transform",
    "http_response_compression",
    "http_response_firewall_managed",
    "http_response_headers_transform",
    "magic_transit",
    "magic_transit_ids_managed",
    "magic_transit_managed",
    "magic_transit_ratelimit",
  ),
  rules: Schema.Array(
    Schema.Union(
      Schema.Unknown,
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("js_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
    ),
  ),
  version: Schema.String,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PutPhasResponse>;

export const putPhas = API.make(() => ({
  input: PutPhasRequest,
  output: PutPhasResponse,
  errors: [],
}));

// =============================================================================
// PhasVersion
// =============================================================================

export interface GetPhasVersionRequest {
  rulesetVersion: string;
}

export const GetPhasVersionRequest = Schema.Struct({
  rulesetVersion: Schema.String.pipe(T.HttpPath("rulesetVersion")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/rulesets/phases/{rulesetPhase}/entrypoint/versions/{rulesetVersion}",
  }),
) as unknown as Schema.Schema<GetPhasVersionRequest>;

export interface GetPhasVersionResponse {
  /** The unique ID of the ruleset. */
  id: string;
  /** The kind of the ruleset. */
  kind: "managed" | "custom" | "root" | "zone";
  /** The timestamp of when the ruleset was last modified. */
  lastUpdated: string;
  /** The human-readable name of the ruleset. */
  name: string;
  /** The phase of the ruleset. */
  phase:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** The list of rules in the ruleset. */
  rules: (
    | unknown
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
  /** The version of the ruleset. */
  version: string;
  /** An informative description of the ruleset. */
  description?: string;
}

export const GetPhasVersionResponse = Schema.Struct({
  id: Schema.String,
  kind: Schema.Literal("managed", "custom", "root", "zone"),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  name: Schema.String,
  phase: Schema.Literal(
    "ddos_l4",
    "ddos_l7",
    "http_config_settings",
    "http_custom_errors",
    "http_log_custom_fields",
    "http_ratelimit",
    "http_request_cache_settings",
    "http_request_dynamic_redirect",
    "http_request_firewall_custom",
    "http_request_firewall_managed",
    "http_request_late_transform",
    "http_request_origin",
    "http_request_redirect",
    "http_request_sanitize",
    "http_request_sbfm",
    "http_request_transform",
    "http_response_compression",
    "http_response_firewall_managed",
    "http_response_headers_transform",
    "magic_transit",
    "magic_transit_ids_managed",
    "magic_transit_managed",
    "magic_transit_ratelimit",
  ),
  rules: Schema.Array(
    Schema.Union(
      Schema.Unknown,
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("js_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
    ),
  ),
  version: Schema.String,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetPhasVersionResponse>;

export const getPhasVersion = API.make(() => ({
  input: GetPhasVersionRequest,
  output: GetPhasVersionResponse,
  errors: [],
}));

// =============================================================================
// Rule
// =============================================================================

export interface CreateRuleRequest {
  rulesetId: string;
}

export const CreateRuleRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
}).pipe(
  T.Http({ method: "POST", path: "/{accountOrZone}/{accountOrZoneId}/rulesets/{rulesetId}/rules" }),
) as unknown as Schema.Schema<CreateRuleRequest>;

export interface CreateRuleResponse {
  /** The unique ID of the ruleset. */
  id: string;
  /** The kind of the ruleset. */
  kind: "managed" | "custom" | "root" | "zone";
  /** The timestamp of when the ruleset was last modified. */
  lastUpdated: string;
  /** The human-readable name of the ruleset. */
  name: string;
  /** The phase of the ruleset. */
  phase:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** The list of rules in the ruleset. */
  rules: (
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "block";
        actionParameters?: {
          response?: { content: string; contentType: string; statusCode: number };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "compress_response";
        actionParameters?: {
          algorithms: { name?: "none" | "auto" | "default" | "gzip" | "brotli" | "zstd" }[];
        };
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "ddos_dynamic";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "execute";
        actionParameters?: {
          id: string;
          matchedData?: { publicKey: string };
          overrides?: {
            action?: string;
            categories?: {
              category: string;
              action?: string;
              enabled?: boolean;
              sensitivityLevel?: "default" | "medium" | "low" | "eoff";
            }[];
            enabled?: boolean;
            rules?: {
              id: string;
              action?: string;
              enabled?: boolean;
              scoreThreshold?: number;
              sensitivityLevel?: "default" | "medium" | "low" | "eoff";
            }[];
            sensitivityLevel?: "default" | "medium" | "low" | "eoff";
          };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "force_connection_close";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "log";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "log_custom_field";
        actionParameters?: {
          cookieFields?: { name: string }[];
          rawResponseFields?: { name: string; preserveDuplicates?: boolean }[];
          requestFields?: { name: string }[];
          responseFields?: { name: string; preserveDuplicates?: boolean }[];
          transformedRequestFields?: { name: string }[];
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "managed_challenge";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "redirect";
        actionParameters?: {
          fromList?: { key: string; name: string };
          fromValue?: {
            targetUrl: { expression?: string; value?: string };
            preserveQueryString?: boolean;
            statusCode?: "301" | "302" | "303" | "307" | "308";
          };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "rewrite";
        actionParameters?: {
          headers?: Record<string, unknown>;
          uri?:
            | { path: { expression?: string; value?: string } }
            | { query: { expression?: string; value?: string } };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "route";
        actionParameters?: {
          hostHeader?: string;
          origin?: { host?: string; port?: number };
          sni?: { value: string };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "score";
        actionParameters?: { increment: number };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "serve_error";
        actionParameters?:
          | {
              content: string;
              contentType?: "application/json" | "text/html" | "text/plain" | "text/xml";
              statusCode?: number;
            }
          | {
              assetName: string;
              contentType?: "application/json" | "text/html" | "text/plain" | "text/xml";
              statusCode?: number;
            };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "set_cache_settings";
        actionParameters?: {
          additionalCacheablePorts?: number[];
          browserTtl?: {
            mode: "respect_origin" | "bypass_by_default" | "override_origin" | "bypass";
            default?: number;
          };
          cache?: boolean;
          cacheKey?: {
            cacheByDeviceType?: boolean;
            cacheDeceptionArmor?: boolean;
            customKey?: {
              cookie?: { checkPresence?: string[]; include?: string[] };
              header?: {
                checkPresence?: string[];
                contains?: Record<string, unknown>;
                excludeOrigin?: boolean;
                include?: string[];
              };
              host?: { resolved?: boolean };
              queryString?: {
                exclude?: { all?: true; list?: string[] };
                include?: { all?: true; list?: string[] };
              };
              user?: { deviceType?: boolean; geo?: boolean; lang?: boolean };
            };
            ignoreQueryStringsOrder?: boolean;
          };
          cacheReserve?: { eligible: boolean; minimumFileSize?: number };
          edgeTtl?: {
            mode: "respect_origin" | "bypass_by_default" | "override_origin";
            default?: number;
            statusCodeTtl?: {
              value: number;
              statusCode?: number;
              statusCodeRange?: { from?: number; to?: number };
            }[];
          };
          originCacheControl?: boolean;
          originErrorPagePassthru?: boolean;
          readTimeout?: number;
          respectStrongEtags?: boolean;
          serveStale?: { disableStaleWhileUpdating?: boolean };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "set_config";
        actionParameters?: {
          automaticHttpsRewrites?: boolean;
          autominify?: { css?: boolean; html?: boolean; js?: boolean };
          bic?: boolean;
          disableApps?: true;
          disablePayPerCrawl?: true;
          disableRum?: true;
          disableZaraz?: true;
          emailObfuscation?: boolean;
          fonts?: boolean;
          hotlinkProtection?: boolean;
          mirage?: boolean;
          opportunisticEncryption?: boolean;
          polish?: "off" | "lossless" | "lossy" | "webp";
          rocketLoader?: boolean;
          securityLevel?: "off" | "essentially_off" | "low" | "medium" | "high" | "under_attack";
          serverSideExcludes?: boolean;
          ssl?: "off" | "flexible" | "full" | "strict" | "origin_pull";
          sxg?: boolean;
        };
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "skip";
        actionParameters?: {
          phase?: "current";
          phases?: (
            | "ddos_l4"
            | "ddos_l7"
            | "http_config_settings"
            | "http_custom_errors"
            | "http_log_custom_fields"
            | "http_ratelimit"
            | "http_request_cache_settings"
            | "http_request_dynamic_redirect"
            | "http_request_firewall_custom"
            | "http_request_firewall_managed"
            | "http_request_late_transform"
            | "http_request_origin"
            | "http_request_redirect"
            | "http_request_sanitize"
            | "http_request_sbfm"
            | "http_request_transform"
            | "http_response_compression"
            | "http_response_firewall_managed"
            | "http_response_headers_transform"
            | "magic_transit"
            | "magic_transit_ids_managed"
            | "magic_transit_managed"
            | "magic_transit_ratelimit"
          )[];
          products?: (
            | "bic"
            | "hot"
            | "rateLimit"
            | "securityLevel"
            | "uaBlock"
            | "waf"
            | "zoneLockdown"
          )[];
          rules?: Record<string, unknown>;
          ruleset?: "current";
          rulesets?: string[];
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
  /** The version of the ruleset. */
  version: string;
  /** An informative description of the ruleset. */
  description?: string;
}

export const CreateRuleResponse = Schema.Struct({
  id: Schema.String,
  kind: Schema.Literal("managed", "custom", "root", "zone"),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  name: Schema.String,
  phase: Schema.Literal(
    "ddos_l4",
    "ddos_l7",
    "http_config_settings",
    "http_custom_errors",
    "http_log_custom_fields",
    "http_ratelimit",
    "http_request_cache_settings",
    "http_request_dynamic_redirect",
    "http_request_firewall_custom",
    "http_request_firewall_managed",
    "http_request_late_transform",
    "http_request_origin",
    "http_request_redirect",
    "http_request_sanitize",
    "http_request_sbfm",
    "http_request_transform",
    "http_response_compression",
    "http_response_firewall_managed",
    "http_response_headers_transform",
    "magic_transit",
    "magic_transit_ids_managed",
    "magic_transit_managed",
    "magic_transit_ratelimit",
  ),
  rules: Schema.Array(
    Schema.Union(
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("block")),
        actionParameters: Schema.optional(
          Schema.Struct({
            response: Schema.optional(
              Schema.Struct({
                content: Schema.String,
                contentType: Schema.String.pipe(T.JsonName("content_type")),
                statusCode: Schema.Number.pipe(T.JsonName("status_code")),
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("compress_response")),
        actionParameters: Schema.optional(
          Schema.Struct({
            algorithms: Schema.Array(
              Schema.Struct({
                name: Schema.optional(
                  Schema.Literal("none", "auto", "default", "gzip", "brotli", "zstd"),
                ),
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("ddos_dynamic")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("execute")),
        actionParameters: Schema.optional(
          Schema.Struct({
            id: Schema.String,
            matchedData: Schema.optional(
              Schema.Struct({
                publicKey: Schema.String.pipe(T.JsonName("public_key")),
              }),
            ).pipe(T.JsonName("matched_data")),
            overrides: Schema.optional(
              Schema.Struct({
                action: Schema.optional(Schema.String),
                categories: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      category: Schema.String,
                      action: Schema.optional(Schema.String),
                      enabled: Schema.optional(Schema.Boolean),
                      sensitivityLevel: Schema.optional(
                        Schema.Literal("default", "medium", "low", "eoff"),
                      ).pipe(T.JsonName("sensitivity_level")),
                    }),
                  ),
                ),
                enabled: Schema.optional(Schema.Boolean),
                rules: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      id: Schema.String,
                      action: Schema.optional(Schema.String),
                      enabled: Schema.optional(Schema.Boolean),
                      scoreThreshold: Schema.optional(Schema.Number).pipe(
                        T.JsonName("score_threshold"),
                      ),
                      sensitivityLevel: Schema.optional(
                        Schema.Literal("default", "medium", "low", "eoff"),
                      ).pipe(T.JsonName("sensitivity_level")),
                    }),
                  ),
                ),
                sensitivityLevel: Schema.optional(
                  Schema.Literal("default", "medium", "low", "eoff"),
                ).pipe(T.JsonName("sensitivity_level")),
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("force_connection_close")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("js_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("log")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("log_custom_field")),
        actionParameters: Schema.optional(
          Schema.Struct({
            cookieFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                }),
              ),
            ).pipe(T.JsonName("cookie_fields")),
            rawResponseFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                  preserveDuplicates: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("preserve_duplicates"),
                  ),
                }),
              ),
            ).pipe(T.JsonName("raw_response_fields")),
            requestFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                }),
              ),
            ).pipe(T.JsonName("request_fields")),
            responseFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                  preserveDuplicates: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("preserve_duplicates"),
                  ),
                }),
              ),
            ).pipe(T.JsonName("response_fields")),
            transformedRequestFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                }),
              ),
            ).pipe(T.JsonName("transformed_request_fields")),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("managed_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("redirect")),
        actionParameters: Schema.optional(
          Schema.Struct({
            fromList: Schema.optional(
              Schema.Struct({
                key: Schema.String,
                name: Schema.String,
              }),
            ).pipe(T.JsonName("from_list")),
            fromValue: Schema.optional(
              Schema.Struct({
                targetUrl: Schema.Struct({
                  expression: Schema.optional(Schema.String),
                  value: Schema.optional(Schema.String),
                }).pipe(T.JsonName("target_url")),
                preserveQueryString: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("preserve_query_string"),
                ),
                statusCode: Schema.optional(Schema.Literal("301", "302", "303", "307", "308")).pipe(
                  T.JsonName("status_code"),
                ),
              }),
            ).pipe(T.JsonName("from_value")),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("rewrite")),
        actionParameters: Schema.optional(
          Schema.Struct({
            headers: Schema.optional(Schema.Struct({})),
            uri: Schema.optional(
              Schema.Union(
                Schema.Struct({
                  path: Schema.Struct({
                    expression: Schema.optional(Schema.String),
                    value: Schema.optional(Schema.String),
                  }),
                }),
                Schema.Struct({
                  query: Schema.Struct({
                    expression: Schema.optional(Schema.String),
                    value: Schema.optional(Schema.String),
                  }),
                }),
              ),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("route")),
        actionParameters: Schema.optional(
          Schema.Struct({
            hostHeader: Schema.optional(Schema.String).pipe(T.JsonName("host_header")),
            origin: Schema.optional(
              Schema.Struct({
                host: Schema.optional(Schema.String),
                port: Schema.optional(Schema.Number),
              }),
            ),
            sni: Schema.optional(
              Schema.Struct({
                value: Schema.String,
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("score")),
        actionParameters: Schema.optional(
          Schema.Struct({
            increment: Schema.Number,
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("serve_error")),
        actionParameters: Schema.optional(
          Schema.Union(
            Schema.Struct({
              content: Schema.String,
              contentType: Schema.optional(
                Schema.Literal("application/json", "text/html", "text/plain", "text/xml"),
              ).pipe(T.JsonName("content_type")),
              statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
            }),
            Schema.Struct({
              assetName: Schema.String.pipe(T.JsonName("asset_name")),
              contentType: Schema.optional(
                Schema.Literal("application/json", "text/html", "text/plain", "text/xml"),
              ).pipe(T.JsonName("content_type")),
              statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
            }),
          ),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("set_cache_settings")),
        actionParameters: Schema.optional(
          Schema.Struct({
            additionalCacheablePorts: Schema.optional(Schema.Array(Schema.Number)).pipe(
              T.JsonName("additional_cacheable_ports"),
            ),
            browserTtl: Schema.optional(
              Schema.Struct({
                mode: Schema.Literal(
                  "respect_origin",
                  "bypass_by_default",
                  "override_origin",
                  "bypass",
                ),
                default: Schema.optional(Schema.Number),
              }),
            ).pipe(T.JsonName("browser_ttl")),
            cache: Schema.optional(Schema.Boolean),
            cacheKey: Schema.optional(
              Schema.Struct({
                cacheByDeviceType: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("cache_by_device_type"),
                ),
                cacheDeceptionArmor: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("cache_deception_armor"),
                ),
                customKey: Schema.optional(
                  Schema.Struct({
                    cookie: Schema.optional(
                      Schema.Struct({
                        checkPresence: Schema.optional(Schema.Array(Schema.String)).pipe(
                          T.JsonName("check_presence"),
                        ),
                        include: Schema.optional(Schema.Array(Schema.String)),
                      }),
                    ),
                    header: Schema.optional(
                      Schema.Struct({
                        checkPresence: Schema.optional(Schema.Array(Schema.String)).pipe(
                          T.JsonName("check_presence"),
                        ),
                        contains: Schema.optional(Schema.Struct({})),
                        excludeOrigin: Schema.optional(Schema.Boolean).pipe(
                          T.JsonName("exclude_origin"),
                        ),
                        include: Schema.optional(Schema.Array(Schema.String)),
                      }),
                    ),
                    host: Schema.optional(
                      Schema.Struct({
                        resolved: Schema.optional(Schema.Boolean),
                      }),
                    ),
                    queryString: Schema.optional(
                      Schema.Struct({
                        exclude: Schema.optional(
                          Schema.Struct({
                            all: Schema.optional(Schema.Literal(true)),
                            list: Schema.optional(Schema.Array(Schema.String)),
                          }),
                        ),
                        include: Schema.optional(
                          Schema.Struct({
                            all: Schema.optional(Schema.Literal(true)),
                            list: Schema.optional(Schema.Array(Schema.String)),
                          }),
                        ),
                      }),
                    ).pipe(T.JsonName("query_string")),
                    user: Schema.optional(
                      Schema.Struct({
                        deviceType: Schema.optional(Schema.Boolean).pipe(T.JsonName("device_type")),
                        geo: Schema.optional(Schema.Boolean),
                        lang: Schema.optional(Schema.Boolean),
                      }),
                    ),
                  }),
                ).pipe(T.JsonName("custom_key")),
                ignoreQueryStringsOrder: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("ignore_query_strings_order"),
                ),
              }),
            ).pipe(T.JsonName("cache_key")),
            cacheReserve: Schema.optional(
              Schema.Struct({
                eligible: Schema.Boolean,
                minimumFileSize: Schema.optional(Schema.Number).pipe(
                  T.JsonName("minimum_file_size"),
                ),
              }),
            ).pipe(T.JsonName("cache_reserve")),
            edgeTtl: Schema.optional(
              Schema.Struct({
                mode: Schema.Literal("respect_origin", "bypass_by_default", "override_origin"),
                default: Schema.optional(Schema.Number),
                statusCodeTtl: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      value: Schema.Number,
                      statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
                      statusCodeRange: Schema.optional(
                        Schema.Struct({
                          from: Schema.optional(Schema.Number),
                          to: Schema.optional(Schema.Number),
                        }),
                      ).pipe(T.JsonName("status_code_range")),
                    }),
                  ),
                ).pipe(T.JsonName("status_code_ttl")),
              }),
            ).pipe(T.JsonName("edge_ttl")),
            originCacheControl: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("origin_cache_control"),
            ),
            originErrorPagePassthru: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("origin_error_page_passthru"),
            ),
            readTimeout: Schema.optional(Schema.Number).pipe(T.JsonName("read_timeout")),
            respectStrongEtags: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("respect_strong_etags"),
            ),
            serveStale: Schema.optional(
              Schema.Struct({
                disableStaleWhileUpdating: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("disable_stale_while_updating"),
                ),
              }),
            ).pipe(T.JsonName("serve_stale")),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("set_config")),
        actionParameters: Schema.optional(
          Schema.Struct({
            automaticHttpsRewrites: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("automatic_https_rewrites"),
            ),
            autominify: Schema.optional(
              Schema.Struct({
                css: Schema.optional(Schema.Boolean),
                html: Schema.optional(Schema.Boolean),
                js: Schema.optional(Schema.Boolean),
              }),
            ),
            bic: Schema.optional(Schema.Boolean),
            disableApps: Schema.optional(Schema.Literal(true)).pipe(T.JsonName("disable_apps")),
            disablePayPerCrawl: Schema.optional(Schema.Literal(true)).pipe(
              T.JsonName("disable_pay_per_crawl"),
            ),
            disableRum: Schema.optional(Schema.Literal(true)).pipe(T.JsonName("disable_rum")),
            disableZaraz: Schema.optional(Schema.Literal(true)).pipe(T.JsonName("disable_zaraz")),
            emailObfuscation: Schema.optional(Schema.Boolean).pipe(T.JsonName("email_obfuscation")),
            fonts: Schema.optional(Schema.Boolean),
            hotlinkProtection: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("hotlink_protection"),
            ),
            mirage: Schema.optional(Schema.Boolean),
            opportunisticEncryption: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("opportunistic_encryption"),
            ),
            polish: Schema.optional(Schema.Literal("off", "lossless", "lossy", "webp")),
            rocketLoader: Schema.optional(Schema.Boolean).pipe(T.JsonName("rocket_loader")),
            securityLevel: Schema.optional(
              Schema.Literal("off", "essentially_off", "low", "medium", "high", "under_attack"),
            ).pipe(T.JsonName("security_level")),
            serverSideExcludes: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("server_side_excludes"),
            ),
            ssl: Schema.optional(
              Schema.Literal("off", "flexible", "full", "strict", "origin_pull"),
            ),
            sxg: Schema.optional(Schema.Boolean),
          }),
        ).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("skip")),
        actionParameters: Schema.optional(
          Schema.Struct({
            phase: Schema.optional(Schema.Literal("current")),
            phases: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "ddos_l4",
                  "ddos_l7",
                  "http_config_settings",
                  "http_custom_errors",
                  "http_log_custom_fields",
                  "http_ratelimit",
                  "http_request_cache_settings",
                  "http_request_dynamic_redirect",
                  "http_request_firewall_custom",
                  "http_request_firewall_managed",
                  "http_request_late_transform",
                  "http_request_origin",
                  "http_request_redirect",
                  "http_request_sanitize",
                  "http_request_sbfm",
                  "http_request_transform",
                  "http_response_compression",
                  "http_response_firewall_managed",
                  "http_response_headers_transform",
                  "magic_transit",
                  "magic_transit_ids_managed",
                  "magic_transit_managed",
                  "magic_transit_ratelimit",
                ),
              ),
            ),
            products: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "bic",
                  "hot",
                  "rateLimit",
                  "securityLevel",
                  "uaBlock",
                  "waf",
                  "zoneLockdown",
                ),
              ),
            ),
            rules: Schema.optional(Schema.Struct({})),
            ruleset: Schema.optional(Schema.Literal("current")),
            rulesets: Schema.optional(Schema.Array(Schema.String)),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
    ),
  ),
  version: Schema.String,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateRuleResponse>;

export const createRule = API.make(() => ({
  input: CreateRuleRequest,
  output: CreateRuleResponse,
  errors: [],
}));

export interface PatchRuleRequest {
  rulesetId: string;
  ruleId: string;
}

export const PatchRuleRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/{accountOrZone}/{accountOrZoneId}/rulesets/{rulesetId}/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<PatchRuleRequest>;

export interface PatchRuleResponse {
  /** The unique ID of the ruleset. */
  id: string;
  /** The kind of the ruleset. */
  kind: "managed" | "custom" | "root" | "zone";
  /** The timestamp of when the ruleset was last modified. */
  lastUpdated: string;
  /** The human-readable name of the ruleset. */
  name: string;
  /** The phase of the ruleset. */
  phase:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** The list of rules in the ruleset. */
  rules: (
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "block";
        actionParameters?: {
          response?: { content: string; contentType: string; statusCode: number };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "compress_response";
        actionParameters?: {
          algorithms: { name?: "none" | "auto" | "default" | "gzip" | "brotli" | "zstd" }[];
        };
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "ddos_dynamic";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "execute";
        actionParameters?: {
          id: string;
          matchedData?: { publicKey: string };
          overrides?: {
            action?: string;
            categories?: {
              category: string;
              action?: string;
              enabled?: boolean;
              sensitivityLevel?: "default" | "medium" | "low" | "eoff";
            }[];
            enabled?: boolean;
            rules?: {
              id: string;
              action?: string;
              enabled?: boolean;
              scoreThreshold?: number;
              sensitivityLevel?: "default" | "medium" | "low" | "eoff";
            }[];
            sensitivityLevel?: "default" | "medium" | "low" | "eoff";
          };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "force_connection_close";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "log";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "log_custom_field";
        actionParameters?: {
          cookieFields?: { name: string }[];
          rawResponseFields?: { name: string; preserveDuplicates?: boolean }[];
          requestFields?: { name: string }[];
          responseFields?: { name: string; preserveDuplicates?: boolean }[];
          transformedRequestFields?: { name: string }[];
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "managed_challenge";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "redirect";
        actionParameters?: {
          fromList?: { key: string; name: string };
          fromValue?: {
            targetUrl: { expression?: string; value?: string };
            preserveQueryString?: boolean;
            statusCode?: "301" | "302" | "303" | "307" | "308";
          };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "rewrite";
        actionParameters?: {
          headers?: Record<string, unknown>;
          uri?:
            | { path: { expression?: string; value?: string } }
            | { query: { expression?: string; value?: string } };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "route";
        actionParameters?: {
          hostHeader?: string;
          origin?: { host?: string; port?: number };
          sni?: { value: string };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "score";
        actionParameters?: { increment: number };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "serve_error";
        actionParameters?:
          | {
              content: string;
              contentType?: "application/json" | "text/html" | "text/plain" | "text/xml";
              statusCode?: number;
            }
          | {
              assetName: string;
              contentType?: "application/json" | "text/html" | "text/plain" | "text/xml";
              statusCode?: number;
            };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "set_cache_settings";
        actionParameters?: {
          additionalCacheablePorts?: number[];
          browserTtl?: {
            mode: "respect_origin" | "bypass_by_default" | "override_origin" | "bypass";
            default?: number;
          };
          cache?: boolean;
          cacheKey?: {
            cacheByDeviceType?: boolean;
            cacheDeceptionArmor?: boolean;
            customKey?: {
              cookie?: { checkPresence?: string[]; include?: string[] };
              header?: {
                checkPresence?: string[];
                contains?: Record<string, unknown>;
                excludeOrigin?: boolean;
                include?: string[];
              };
              host?: { resolved?: boolean };
              queryString?: {
                exclude?: { all?: true; list?: string[] };
                include?: { all?: true; list?: string[] };
              };
              user?: { deviceType?: boolean; geo?: boolean; lang?: boolean };
            };
            ignoreQueryStringsOrder?: boolean;
          };
          cacheReserve?: { eligible: boolean; minimumFileSize?: number };
          edgeTtl?: {
            mode: "respect_origin" | "bypass_by_default" | "override_origin";
            default?: number;
            statusCodeTtl?: {
              value: number;
              statusCode?: number;
              statusCodeRange?: { from?: number; to?: number };
            }[];
          };
          originCacheControl?: boolean;
          originErrorPagePassthru?: boolean;
          readTimeout?: number;
          respectStrongEtags?: boolean;
          serveStale?: { disableStaleWhileUpdating?: boolean };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "set_config";
        actionParameters?: {
          automaticHttpsRewrites?: boolean;
          autominify?: { css?: boolean; html?: boolean; js?: boolean };
          bic?: boolean;
          disableApps?: true;
          disablePayPerCrawl?: true;
          disableRum?: true;
          disableZaraz?: true;
          emailObfuscation?: boolean;
          fonts?: boolean;
          hotlinkProtection?: boolean;
          mirage?: boolean;
          opportunisticEncryption?: boolean;
          polish?: "off" | "lossless" | "lossy" | "webp";
          rocketLoader?: boolean;
          securityLevel?: "off" | "essentially_off" | "low" | "medium" | "high" | "under_attack";
          serverSideExcludes?: boolean;
          ssl?: "off" | "flexible" | "full" | "strict" | "origin_pull";
          sxg?: boolean;
        };
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "skip";
        actionParameters?: {
          phase?: "current";
          phases?: (
            | "ddos_l4"
            | "ddos_l7"
            | "http_config_settings"
            | "http_custom_errors"
            | "http_log_custom_fields"
            | "http_ratelimit"
            | "http_request_cache_settings"
            | "http_request_dynamic_redirect"
            | "http_request_firewall_custom"
            | "http_request_firewall_managed"
            | "http_request_late_transform"
            | "http_request_origin"
            | "http_request_redirect"
            | "http_request_sanitize"
            | "http_request_sbfm"
            | "http_request_transform"
            | "http_response_compression"
            | "http_response_firewall_managed"
            | "http_response_headers_transform"
            | "magic_transit"
            | "magic_transit_ids_managed"
            | "magic_transit_managed"
            | "magic_transit_ratelimit"
          )[];
          products?: (
            | "bic"
            | "hot"
            | "rateLimit"
            | "securityLevel"
            | "uaBlock"
            | "waf"
            | "zoneLockdown"
          )[];
          rules?: Record<string, unknown>;
          ruleset?: "current";
          rulesets?: string[];
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
  /** The version of the ruleset. */
  version: string;
  /** An informative description of the ruleset. */
  description?: string;
}

export const PatchRuleResponse = Schema.Struct({
  id: Schema.String,
  kind: Schema.Literal("managed", "custom", "root", "zone"),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  name: Schema.String,
  phase: Schema.Literal(
    "ddos_l4",
    "ddos_l7",
    "http_config_settings",
    "http_custom_errors",
    "http_log_custom_fields",
    "http_ratelimit",
    "http_request_cache_settings",
    "http_request_dynamic_redirect",
    "http_request_firewall_custom",
    "http_request_firewall_managed",
    "http_request_late_transform",
    "http_request_origin",
    "http_request_redirect",
    "http_request_sanitize",
    "http_request_sbfm",
    "http_request_transform",
    "http_response_compression",
    "http_response_firewall_managed",
    "http_response_headers_transform",
    "magic_transit",
    "magic_transit_ids_managed",
    "magic_transit_managed",
    "magic_transit_ratelimit",
  ),
  rules: Schema.Array(
    Schema.Union(
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("block")),
        actionParameters: Schema.optional(
          Schema.Struct({
            response: Schema.optional(
              Schema.Struct({
                content: Schema.String,
                contentType: Schema.String.pipe(T.JsonName("content_type")),
                statusCode: Schema.Number.pipe(T.JsonName("status_code")),
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("compress_response")),
        actionParameters: Schema.optional(
          Schema.Struct({
            algorithms: Schema.Array(
              Schema.Struct({
                name: Schema.optional(
                  Schema.Literal("none", "auto", "default", "gzip", "brotli", "zstd"),
                ),
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("ddos_dynamic")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("execute")),
        actionParameters: Schema.optional(
          Schema.Struct({
            id: Schema.String,
            matchedData: Schema.optional(
              Schema.Struct({
                publicKey: Schema.String.pipe(T.JsonName("public_key")),
              }),
            ).pipe(T.JsonName("matched_data")),
            overrides: Schema.optional(
              Schema.Struct({
                action: Schema.optional(Schema.String),
                categories: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      category: Schema.String,
                      action: Schema.optional(Schema.String),
                      enabled: Schema.optional(Schema.Boolean),
                      sensitivityLevel: Schema.optional(
                        Schema.Literal("default", "medium", "low", "eoff"),
                      ).pipe(T.JsonName("sensitivity_level")),
                    }),
                  ),
                ),
                enabled: Schema.optional(Schema.Boolean),
                rules: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      id: Schema.String,
                      action: Schema.optional(Schema.String),
                      enabled: Schema.optional(Schema.Boolean),
                      scoreThreshold: Schema.optional(Schema.Number).pipe(
                        T.JsonName("score_threshold"),
                      ),
                      sensitivityLevel: Schema.optional(
                        Schema.Literal("default", "medium", "low", "eoff"),
                      ).pipe(T.JsonName("sensitivity_level")),
                    }),
                  ),
                ),
                sensitivityLevel: Schema.optional(
                  Schema.Literal("default", "medium", "low", "eoff"),
                ).pipe(T.JsonName("sensitivity_level")),
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("force_connection_close")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("js_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("log")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("log_custom_field")),
        actionParameters: Schema.optional(
          Schema.Struct({
            cookieFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                }),
              ),
            ).pipe(T.JsonName("cookie_fields")),
            rawResponseFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                  preserveDuplicates: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("preserve_duplicates"),
                  ),
                }),
              ),
            ).pipe(T.JsonName("raw_response_fields")),
            requestFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                }),
              ),
            ).pipe(T.JsonName("request_fields")),
            responseFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                  preserveDuplicates: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("preserve_duplicates"),
                  ),
                }),
              ),
            ).pipe(T.JsonName("response_fields")),
            transformedRequestFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                }),
              ),
            ).pipe(T.JsonName("transformed_request_fields")),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("managed_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("redirect")),
        actionParameters: Schema.optional(
          Schema.Struct({
            fromList: Schema.optional(
              Schema.Struct({
                key: Schema.String,
                name: Schema.String,
              }),
            ).pipe(T.JsonName("from_list")),
            fromValue: Schema.optional(
              Schema.Struct({
                targetUrl: Schema.Struct({
                  expression: Schema.optional(Schema.String),
                  value: Schema.optional(Schema.String),
                }).pipe(T.JsonName("target_url")),
                preserveQueryString: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("preserve_query_string"),
                ),
                statusCode: Schema.optional(Schema.Literal("301", "302", "303", "307", "308")).pipe(
                  T.JsonName("status_code"),
                ),
              }),
            ).pipe(T.JsonName("from_value")),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("rewrite")),
        actionParameters: Schema.optional(
          Schema.Struct({
            headers: Schema.optional(Schema.Struct({})),
            uri: Schema.optional(
              Schema.Union(
                Schema.Struct({
                  path: Schema.Struct({
                    expression: Schema.optional(Schema.String),
                    value: Schema.optional(Schema.String),
                  }),
                }),
                Schema.Struct({
                  query: Schema.Struct({
                    expression: Schema.optional(Schema.String),
                    value: Schema.optional(Schema.String),
                  }),
                }),
              ),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("route")),
        actionParameters: Schema.optional(
          Schema.Struct({
            hostHeader: Schema.optional(Schema.String).pipe(T.JsonName("host_header")),
            origin: Schema.optional(
              Schema.Struct({
                host: Schema.optional(Schema.String),
                port: Schema.optional(Schema.Number),
              }),
            ),
            sni: Schema.optional(
              Schema.Struct({
                value: Schema.String,
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("score")),
        actionParameters: Schema.optional(
          Schema.Struct({
            increment: Schema.Number,
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("serve_error")),
        actionParameters: Schema.optional(
          Schema.Union(
            Schema.Struct({
              content: Schema.String,
              contentType: Schema.optional(
                Schema.Literal("application/json", "text/html", "text/plain", "text/xml"),
              ).pipe(T.JsonName("content_type")),
              statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
            }),
            Schema.Struct({
              assetName: Schema.String.pipe(T.JsonName("asset_name")),
              contentType: Schema.optional(
                Schema.Literal("application/json", "text/html", "text/plain", "text/xml"),
              ).pipe(T.JsonName("content_type")),
              statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
            }),
          ),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("set_cache_settings")),
        actionParameters: Schema.optional(
          Schema.Struct({
            additionalCacheablePorts: Schema.optional(Schema.Array(Schema.Number)).pipe(
              T.JsonName("additional_cacheable_ports"),
            ),
            browserTtl: Schema.optional(
              Schema.Struct({
                mode: Schema.Literal(
                  "respect_origin",
                  "bypass_by_default",
                  "override_origin",
                  "bypass",
                ),
                default: Schema.optional(Schema.Number),
              }),
            ).pipe(T.JsonName("browser_ttl")),
            cache: Schema.optional(Schema.Boolean),
            cacheKey: Schema.optional(
              Schema.Struct({
                cacheByDeviceType: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("cache_by_device_type"),
                ),
                cacheDeceptionArmor: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("cache_deception_armor"),
                ),
                customKey: Schema.optional(
                  Schema.Struct({
                    cookie: Schema.optional(
                      Schema.Struct({
                        checkPresence: Schema.optional(Schema.Array(Schema.String)).pipe(
                          T.JsonName("check_presence"),
                        ),
                        include: Schema.optional(Schema.Array(Schema.String)),
                      }),
                    ),
                    header: Schema.optional(
                      Schema.Struct({
                        checkPresence: Schema.optional(Schema.Array(Schema.String)).pipe(
                          T.JsonName("check_presence"),
                        ),
                        contains: Schema.optional(Schema.Struct({})),
                        excludeOrigin: Schema.optional(Schema.Boolean).pipe(
                          T.JsonName("exclude_origin"),
                        ),
                        include: Schema.optional(Schema.Array(Schema.String)),
                      }),
                    ),
                    host: Schema.optional(
                      Schema.Struct({
                        resolved: Schema.optional(Schema.Boolean),
                      }),
                    ),
                    queryString: Schema.optional(
                      Schema.Struct({
                        exclude: Schema.optional(
                          Schema.Struct({
                            all: Schema.optional(Schema.Literal(true)),
                            list: Schema.optional(Schema.Array(Schema.String)),
                          }),
                        ),
                        include: Schema.optional(
                          Schema.Struct({
                            all: Schema.optional(Schema.Literal(true)),
                            list: Schema.optional(Schema.Array(Schema.String)),
                          }),
                        ),
                      }),
                    ).pipe(T.JsonName("query_string")),
                    user: Schema.optional(
                      Schema.Struct({
                        deviceType: Schema.optional(Schema.Boolean).pipe(T.JsonName("device_type")),
                        geo: Schema.optional(Schema.Boolean),
                        lang: Schema.optional(Schema.Boolean),
                      }),
                    ),
                  }),
                ).pipe(T.JsonName("custom_key")),
                ignoreQueryStringsOrder: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("ignore_query_strings_order"),
                ),
              }),
            ).pipe(T.JsonName("cache_key")),
            cacheReserve: Schema.optional(
              Schema.Struct({
                eligible: Schema.Boolean,
                minimumFileSize: Schema.optional(Schema.Number).pipe(
                  T.JsonName("minimum_file_size"),
                ),
              }),
            ).pipe(T.JsonName("cache_reserve")),
            edgeTtl: Schema.optional(
              Schema.Struct({
                mode: Schema.Literal("respect_origin", "bypass_by_default", "override_origin"),
                default: Schema.optional(Schema.Number),
                statusCodeTtl: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      value: Schema.Number,
                      statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
                      statusCodeRange: Schema.optional(
                        Schema.Struct({
                          from: Schema.optional(Schema.Number),
                          to: Schema.optional(Schema.Number),
                        }),
                      ).pipe(T.JsonName("status_code_range")),
                    }),
                  ),
                ).pipe(T.JsonName("status_code_ttl")),
              }),
            ).pipe(T.JsonName("edge_ttl")),
            originCacheControl: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("origin_cache_control"),
            ),
            originErrorPagePassthru: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("origin_error_page_passthru"),
            ),
            readTimeout: Schema.optional(Schema.Number).pipe(T.JsonName("read_timeout")),
            respectStrongEtags: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("respect_strong_etags"),
            ),
            serveStale: Schema.optional(
              Schema.Struct({
                disableStaleWhileUpdating: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("disable_stale_while_updating"),
                ),
              }),
            ).pipe(T.JsonName("serve_stale")),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("set_config")),
        actionParameters: Schema.optional(
          Schema.Struct({
            automaticHttpsRewrites: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("automatic_https_rewrites"),
            ),
            autominify: Schema.optional(
              Schema.Struct({
                css: Schema.optional(Schema.Boolean),
                html: Schema.optional(Schema.Boolean),
                js: Schema.optional(Schema.Boolean),
              }),
            ),
            bic: Schema.optional(Schema.Boolean),
            disableApps: Schema.optional(Schema.Literal(true)).pipe(T.JsonName("disable_apps")),
            disablePayPerCrawl: Schema.optional(Schema.Literal(true)).pipe(
              T.JsonName("disable_pay_per_crawl"),
            ),
            disableRum: Schema.optional(Schema.Literal(true)).pipe(T.JsonName("disable_rum")),
            disableZaraz: Schema.optional(Schema.Literal(true)).pipe(T.JsonName("disable_zaraz")),
            emailObfuscation: Schema.optional(Schema.Boolean).pipe(T.JsonName("email_obfuscation")),
            fonts: Schema.optional(Schema.Boolean),
            hotlinkProtection: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("hotlink_protection"),
            ),
            mirage: Schema.optional(Schema.Boolean),
            opportunisticEncryption: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("opportunistic_encryption"),
            ),
            polish: Schema.optional(Schema.Literal("off", "lossless", "lossy", "webp")),
            rocketLoader: Schema.optional(Schema.Boolean).pipe(T.JsonName("rocket_loader")),
            securityLevel: Schema.optional(
              Schema.Literal("off", "essentially_off", "low", "medium", "high", "under_attack"),
            ).pipe(T.JsonName("security_level")),
            serverSideExcludes: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("server_side_excludes"),
            ),
            ssl: Schema.optional(
              Schema.Literal("off", "flexible", "full", "strict", "origin_pull"),
            ),
            sxg: Schema.optional(Schema.Boolean),
          }),
        ).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("skip")),
        actionParameters: Schema.optional(
          Schema.Struct({
            phase: Schema.optional(Schema.Literal("current")),
            phases: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "ddos_l4",
                  "ddos_l7",
                  "http_config_settings",
                  "http_custom_errors",
                  "http_log_custom_fields",
                  "http_ratelimit",
                  "http_request_cache_settings",
                  "http_request_dynamic_redirect",
                  "http_request_firewall_custom",
                  "http_request_firewall_managed",
                  "http_request_late_transform",
                  "http_request_origin",
                  "http_request_redirect",
                  "http_request_sanitize",
                  "http_request_sbfm",
                  "http_request_transform",
                  "http_response_compression",
                  "http_response_firewall_managed",
                  "http_response_headers_transform",
                  "magic_transit",
                  "magic_transit_ids_managed",
                  "magic_transit_managed",
                  "magic_transit_ratelimit",
                ),
              ),
            ),
            products: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "bic",
                  "hot",
                  "rateLimit",
                  "securityLevel",
                  "uaBlock",
                  "waf",
                  "zoneLockdown",
                ),
              ),
            ),
            rules: Schema.optional(Schema.Struct({})),
            ruleset: Schema.optional(Schema.Literal("current")),
            rulesets: Schema.optional(Schema.Array(Schema.String)),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
    ),
  ),
  version: Schema.String,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PatchRuleResponse>;

export const patchRule = API.make(() => ({
  input: PatchRuleRequest,
  output: PatchRuleResponse,
  errors: [],
}));

export interface DeleteRuleRequest {
  rulesetId: string;
  ruleId: string;
}

export const DeleteRuleRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/{accountOrZone}/{accountOrZoneId}/rulesets/{rulesetId}/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<DeleteRuleRequest>;

export interface DeleteRuleResponse {
  /** The unique ID of the ruleset. */
  id: string;
  /** The kind of the ruleset. */
  kind: "managed" | "custom" | "root" | "zone";
  /** The timestamp of when the ruleset was last modified. */
  lastUpdated: string;
  /** The human-readable name of the ruleset. */
  name: string;
  /** The phase of the ruleset. */
  phase:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** The list of rules in the ruleset. */
  rules: (
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "block";
        actionParameters?: {
          response?: { content: string; contentType: string; statusCode: number };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "compress_response";
        actionParameters?: {
          algorithms: { name?: "none" | "auto" | "default" | "gzip" | "brotli" | "zstd" }[];
        };
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "ddos_dynamic";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "execute";
        actionParameters?: {
          id: string;
          matchedData?: { publicKey: string };
          overrides?: {
            action?: string;
            categories?: {
              category: string;
              action?: string;
              enabled?: boolean;
              sensitivityLevel?: "default" | "medium" | "low" | "eoff";
            }[];
            enabled?: boolean;
            rules?: {
              id: string;
              action?: string;
              enabled?: boolean;
              scoreThreshold?: number;
              sensitivityLevel?: "default" | "medium" | "low" | "eoff";
            }[];
            sensitivityLevel?: "default" | "medium" | "low" | "eoff";
          };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "force_connection_close";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "log";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "log_custom_field";
        actionParameters?: {
          cookieFields?: { name: string }[];
          rawResponseFields?: { name: string; preserveDuplicates?: boolean }[];
          requestFields?: { name: string }[];
          responseFields?: { name: string; preserveDuplicates?: boolean }[];
          transformedRequestFields?: { name: string }[];
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "managed_challenge";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "redirect";
        actionParameters?: {
          fromList?: { key: string; name: string };
          fromValue?: {
            targetUrl: { expression?: string; value?: string };
            preserveQueryString?: boolean;
            statusCode?: "301" | "302" | "303" | "307" | "308";
          };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "rewrite";
        actionParameters?: {
          headers?: Record<string, unknown>;
          uri?:
            | { path: { expression?: string; value?: string } }
            | { query: { expression?: string; value?: string } };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "route";
        actionParameters?: {
          hostHeader?: string;
          origin?: { host?: string; port?: number };
          sni?: { value: string };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "score";
        actionParameters?: { increment: number };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "serve_error";
        actionParameters?:
          | {
              content: string;
              contentType?: "application/json" | "text/html" | "text/plain" | "text/xml";
              statusCode?: number;
            }
          | {
              assetName: string;
              contentType?: "application/json" | "text/html" | "text/plain" | "text/xml";
              statusCode?: number;
            };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "set_cache_settings";
        actionParameters?: {
          additionalCacheablePorts?: number[];
          browserTtl?: {
            mode: "respect_origin" | "bypass_by_default" | "override_origin" | "bypass";
            default?: number;
          };
          cache?: boolean;
          cacheKey?: {
            cacheByDeviceType?: boolean;
            cacheDeceptionArmor?: boolean;
            customKey?: {
              cookie?: { checkPresence?: string[]; include?: string[] };
              header?: {
                checkPresence?: string[];
                contains?: Record<string, unknown>;
                excludeOrigin?: boolean;
                include?: string[];
              };
              host?: { resolved?: boolean };
              queryString?: {
                exclude?: { all?: true; list?: string[] };
                include?: { all?: true; list?: string[] };
              };
              user?: { deviceType?: boolean; geo?: boolean; lang?: boolean };
            };
            ignoreQueryStringsOrder?: boolean;
          };
          cacheReserve?: { eligible: boolean; minimumFileSize?: number };
          edgeTtl?: {
            mode: "respect_origin" | "bypass_by_default" | "override_origin";
            default?: number;
            statusCodeTtl?: {
              value: number;
              statusCode?: number;
              statusCodeRange?: { from?: number; to?: number };
            }[];
          };
          originCacheControl?: boolean;
          originErrorPagePassthru?: boolean;
          readTimeout?: number;
          respectStrongEtags?: boolean;
          serveStale?: { disableStaleWhileUpdating?: boolean };
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "set_config";
        actionParameters?: {
          automaticHttpsRewrites?: boolean;
          autominify?: { css?: boolean; html?: boolean; js?: boolean };
          bic?: boolean;
          disableApps?: true;
          disablePayPerCrawl?: true;
          disableRum?: true;
          disableZaraz?: true;
          emailObfuscation?: boolean;
          fonts?: boolean;
          hotlinkProtection?: boolean;
          mirage?: boolean;
          opportunisticEncryption?: boolean;
          polish?: "off" | "lossless" | "lossy" | "webp";
          rocketLoader?: boolean;
          securityLevel?: "off" | "essentially_off" | "low" | "medium" | "high" | "under_attack";
          serverSideExcludes?: boolean;
          ssl?: "off" | "flexible" | "full" | "strict" | "origin_pull";
          sxg?: boolean;
        };
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        accountId?: string;
        zoneId?: string;
        id?: string;
        action?: "skip";
        actionParameters?: {
          phase?: "current";
          phases?: (
            | "ddos_l4"
            | "ddos_l7"
            | "http_config_settings"
            | "http_custom_errors"
            | "http_log_custom_fields"
            | "http_ratelimit"
            | "http_request_cache_settings"
            | "http_request_dynamic_redirect"
            | "http_request_firewall_custom"
            | "http_request_firewall_managed"
            | "http_request_late_transform"
            | "http_request_origin"
            | "http_request_redirect"
            | "http_request_sanitize"
            | "http_request_sbfm"
            | "http_request_transform"
            | "http_response_compression"
            | "http_response_firewall_managed"
            | "http_response_headers_transform"
            | "magic_transit"
            | "magic_transit_ids_managed"
            | "magic_transit_managed"
            | "magic_transit_ratelimit"
          )[];
          products?: (
            | "bic"
            | "hot"
            | "rateLimit"
            | "securityLevel"
            | "uaBlock"
            | "waf"
            | "zoneLockdown"
          )[];
          rules?: Record<string, unknown>;
          ruleset?: "current";
          rulesets?: string[];
        };
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: { enabled: boolean };
        position?: { before?: string } | { after?: string } | { index?: number };
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
  /** The version of the ruleset. */
  version: string;
  /** An informative description of the ruleset. */
  description?: string;
}

export const DeleteRuleResponse = Schema.Struct({
  id: Schema.String,
  kind: Schema.Literal("managed", "custom", "root", "zone"),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  name: Schema.String,
  phase: Schema.Literal(
    "ddos_l4",
    "ddos_l7",
    "http_config_settings",
    "http_custom_errors",
    "http_log_custom_fields",
    "http_ratelimit",
    "http_request_cache_settings",
    "http_request_dynamic_redirect",
    "http_request_firewall_custom",
    "http_request_firewall_managed",
    "http_request_late_transform",
    "http_request_origin",
    "http_request_redirect",
    "http_request_sanitize",
    "http_request_sbfm",
    "http_request_transform",
    "http_response_compression",
    "http_response_firewall_managed",
    "http_response_headers_transform",
    "magic_transit",
    "magic_transit_ids_managed",
    "magic_transit_managed",
    "magic_transit_ratelimit",
  ),
  rules: Schema.Array(
    Schema.Union(
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("block")),
        actionParameters: Schema.optional(
          Schema.Struct({
            response: Schema.optional(
              Schema.Struct({
                content: Schema.String,
                contentType: Schema.String.pipe(T.JsonName("content_type")),
                statusCode: Schema.Number.pipe(T.JsonName("status_code")),
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("compress_response")),
        actionParameters: Schema.optional(
          Schema.Struct({
            algorithms: Schema.Array(
              Schema.Struct({
                name: Schema.optional(
                  Schema.Literal("none", "auto", "default", "gzip", "brotli", "zstd"),
                ),
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("ddos_dynamic")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("execute")),
        actionParameters: Schema.optional(
          Schema.Struct({
            id: Schema.String,
            matchedData: Schema.optional(
              Schema.Struct({
                publicKey: Schema.String.pipe(T.JsonName("public_key")),
              }),
            ).pipe(T.JsonName("matched_data")),
            overrides: Schema.optional(
              Schema.Struct({
                action: Schema.optional(Schema.String),
                categories: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      category: Schema.String,
                      action: Schema.optional(Schema.String),
                      enabled: Schema.optional(Schema.Boolean),
                      sensitivityLevel: Schema.optional(
                        Schema.Literal("default", "medium", "low", "eoff"),
                      ).pipe(T.JsonName("sensitivity_level")),
                    }),
                  ),
                ),
                enabled: Schema.optional(Schema.Boolean),
                rules: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      id: Schema.String,
                      action: Schema.optional(Schema.String),
                      enabled: Schema.optional(Schema.Boolean),
                      scoreThreshold: Schema.optional(Schema.Number).pipe(
                        T.JsonName("score_threshold"),
                      ),
                      sensitivityLevel: Schema.optional(
                        Schema.Literal("default", "medium", "low", "eoff"),
                      ).pipe(T.JsonName("sensitivity_level")),
                    }),
                  ),
                ),
                sensitivityLevel: Schema.optional(
                  Schema.Literal("default", "medium", "low", "eoff"),
                ).pipe(T.JsonName("sensitivity_level")),
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("force_connection_close")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("js_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("log")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("log_custom_field")),
        actionParameters: Schema.optional(
          Schema.Struct({
            cookieFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                }),
              ),
            ).pipe(T.JsonName("cookie_fields")),
            rawResponseFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                  preserveDuplicates: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("preserve_duplicates"),
                  ),
                }),
              ),
            ).pipe(T.JsonName("raw_response_fields")),
            requestFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                }),
              ),
            ).pipe(T.JsonName("request_fields")),
            responseFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                  preserveDuplicates: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("preserve_duplicates"),
                  ),
                }),
              ),
            ).pipe(T.JsonName("response_fields")),
            transformedRequestFields: Schema.optional(
              Schema.Array(
                Schema.Struct({
                  name: Schema.String,
                }),
              ),
            ).pipe(T.JsonName("transformed_request_fields")),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("managed_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("redirect")),
        actionParameters: Schema.optional(
          Schema.Struct({
            fromList: Schema.optional(
              Schema.Struct({
                key: Schema.String,
                name: Schema.String,
              }),
            ).pipe(T.JsonName("from_list")),
            fromValue: Schema.optional(
              Schema.Struct({
                targetUrl: Schema.Struct({
                  expression: Schema.optional(Schema.String),
                  value: Schema.optional(Schema.String),
                }).pipe(T.JsonName("target_url")),
                preserveQueryString: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("preserve_query_string"),
                ),
                statusCode: Schema.optional(Schema.Literal("301", "302", "303", "307", "308")).pipe(
                  T.JsonName("status_code"),
                ),
              }),
            ).pipe(T.JsonName("from_value")),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("rewrite")),
        actionParameters: Schema.optional(
          Schema.Struct({
            headers: Schema.optional(Schema.Struct({})),
            uri: Schema.optional(
              Schema.Union(
                Schema.Struct({
                  path: Schema.Struct({
                    expression: Schema.optional(Schema.String),
                    value: Schema.optional(Schema.String),
                  }),
                }),
                Schema.Struct({
                  query: Schema.Struct({
                    expression: Schema.optional(Schema.String),
                    value: Schema.optional(Schema.String),
                  }),
                }),
              ),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("route")),
        actionParameters: Schema.optional(
          Schema.Struct({
            hostHeader: Schema.optional(Schema.String).pipe(T.JsonName("host_header")),
            origin: Schema.optional(
              Schema.Struct({
                host: Schema.optional(Schema.String),
                port: Schema.optional(Schema.Number),
              }),
            ),
            sni: Schema.optional(
              Schema.Struct({
                value: Schema.String,
              }),
            ),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("score")),
        actionParameters: Schema.optional(
          Schema.Struct({
            increment: Schema.Number,
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("serve_error")),
        actionParameters: Schema.optional(
          Schema.Union(
            Schema.Struct({
              content: Schema.String,
              contentType: Schema.optional(
                Schema.Literal("application/json", "text/html", "text/plain", "text/xml"),
              ).pipe(T.JsonName("content_type")),
              statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
            }),
            Schema.Struct({
              assetName: Schema.String.pipe(T.JsonName("asset_name")),
              contentType: Schema.optional(
                Schema.Literal("application/json", "text/html", "text/plain", "text/xml"),
              ).pipe(T.JsonName("content_type")),
              statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
            }),
          ),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("set_cache_settings")),
        actionParameters: Schema.optional(
          Schema.Struct({
            additionalCacheablePorts: Schema.optional(Schema.Array(Schema.Number)).pipe(
              T.JsonName("additional_cacheable_ports"),
            ),
            browserTtl: Schema.optional(
              Schema.Struct({
                mode: Schema.Literal(
                  "respect_origin",
                  "bypass_by_default",
                  "override_origin",
                  "bypass",
                ),
                default: Schema.optional(Schema.Number),
              }),
            ).pipe(T.JsonName("browser_ttl")),
            cache: Schema.optional(Schema.Boolean),
            cacheKey: Schema.optional(
              Schema.Struct({
                cacheByDeviceType: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("cache_by_device_type"),
                ),
                cacheDeceptionArmor: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("cache_deception_armor"),
                ),
                customKey: Schema.optional(
                  Schema.Struct({
                    cookie: Schema.optional(
                      Schema.Struct({
                        checkPresence: Schema.optional(Schema.Array(Schema.String)).pipe(
                          T.JsonName("check_presence"),
                        ),
                        include: Schema.optional(Schema.Array(Schema.String)),
                      }),
                    ),
                    header: Schema.optional(
                      Schema.Struct({
                        checkPresence: Schema.optional(Schema.Array(Schema.String)).pipe(
                          T.JsonName("check_presence"),
                        ),
                        contains: Schema.optional(Schema.Struct({})),
                        excludeOrigin: Schema.optional(Schema.Boolean).pipe(
                          T.JsonName("exclude_origin"),
                        ),
                        include: Schema.optional(Schema.Array(Schema.String)),
                      }),
                    ),
                    host: Schema.optional(
                      Schema.Struct({
                        resolved: Schema.optional(Schema.Boolean),
                      }),
                    ),
                    queryString: Schema.optional(
                      Schema.Struct({
                        exclude: Schema.optional(
                          Schema.Struct({
                            all: Schema.optional(Schema.Literal(true)),
                            list: Schema.optional(Schema.Array(Schema.String)),
                          }),
                        ),
                        include: Schema.optional(
                          Schema.Struct({
                            all: Schema.optional(Schema.Literal(true)),
                            list: Schema.optional(Schema.Array(Schema.String)),
                          }),
                        ),
                      }),
                    ).pipe(T.JsonName("query_string")),
                    user: Schema.optional(
                      Schema.Struct({
                        deviceType: Schema.optional(Schema.Boolean).pipe(T.JsonName("device_type")),
                        geo: Schema.optional(Schema.Boolean),
                        lang: Schema.optional(Schema.Boolean),
                      }),
                    ),
                  }),
                ).pipe(T.JsonName("custom_key")),
                ignoreQueryStringsOrder: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("ignore_query_strings_order"),
                ),
              }),
            ).pipe(T.JsonName("cache_key")),
            cacheReserve: Schema.optional(
              Schema.Struct({
                eligible: Schema.Boolean,
                minimumFileSize: Schema.optional(Schema.Number).pipe(
                  T.JsonName("minimum_file_size"),
                ),
              }),
            ).pipe(T.JsonName("cache_reserve")),
            edgeTtl: Schema.optional(
              Schema.Struct({
                mode: Schema.Literal("respect_origin", "bypass_by_default", "override_origin"),
                default: Schema.optional(Schema.Number),
                statusCodeTtl: Schema.optional(
                  Schema.Array(
                    Schema.Struct({
                      value: Schema.Number,
                      statusCode: Schema.optional(Schema.Number).pipe(T.JsonName("status_code")),
                      statusCodeRange: Schema.optional(
                        Schema.Struct({
                          from: Schema.optional(Schema.Number),
                          to: Schema.optional(Schema.Number),
                        }),
                      ).pipe(T.JsonName("status_code_range")),
                    }),
                  ),
                ).pipe(T.JsonName("status_code_ttl")),
              }),
            ).pipe(T.JsonName("edge_ttl")),
            originCacheControl: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("origin_cache_control"),
            ),
            originErrorPagePassthru: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("origin_error_page_passthru"),
            ),
            readTimeout: Schema.optional(Schema.Number).pipe(T.JsonName("read_timeout")),
            respectStrongEtags: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("respect_strong_etags"),
            ),
            serveStale: Schema.optional(
              Schema.Struct({
                disableStaleWhileUpdating: Schema.optional(Schema.Boolean).pipe(
                  T.JsonName("disable_stale_while_updating"),
                ),
              }),
            ).pipe(T.JsonName("serve_stale")),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("set_config")),
        actionParameters: Schema.optional(
          Schema.Struct({
            automaticHttpsRewrites: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("automatic_https_rewrites"),
            ),
            autominify: Schema.optional(
              Schema.Struct({
                css: Schema.optional(Schema.Boolean),
                html: Schema.optional(Schema.Boolean),
                js: Schema.optional(Schema.Boolean),
              }),
            ),
            bic: Schema.optional(Schema.Boolean),
            disableApps: Schema.optional(Schema.Literal(true)).pipe(T.JsonName("disable_apps")),
            disablePayPerCrawl: Schema.optional(Schema.Literal(true)).pipe(
              T.JsonName("disable_pay_per_crawl"),
            ),
            disableRum: Schema.optional(Schema.Literal(true)).pipe(T.JsonName("disable_rum")),
            disableZaraz: Schema.optional(Schema.Literal(true)).pipe(T.JsonName("disable_zaraz")),
            emailObfuscation: Schema.optional(Schema.Boolean).pipe(T.JsonName("email_obfuscation")),
            fonts: Schema.optional(Schema.Boolean),
            hotlinkProtection: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("hotlink_protection"),
            ),
            mirage: Schema.optional(Schema.Boolean),
            opportunisticEncryption: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("opportunistic_encryption"),
            ),
            polish: Schema.optional(Schema.Literal("off", "lossless", "lossy", "webp")),
            rocketLoader: Schema.optional(Schema.Boolean).pipe(T.JsonName("rocket_loader")),
            securityLevel: Schema.optional(
              Schema.Literal("off", "essentially_off", "low", "medium", "high", "under_attack"),
            ).pipe(T.JsonName("security_level")),
            serverSideExcludes: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("server_side_excludes"),
            ),
            ssl: Schema.optional(
              Schema.Literal("off", "flexible", "full", "strict", "origin_pull"),
            ),
            sxg: Schema.optional(Schema.Boolean),
          }),
        ).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
        zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("skip")),
        actionParameters: Schema.optional(
          Schema.Struct({
            phase: Schema.optional(Schema.Literal("current")),
            phases: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "ddos_l4",
                  "ddos_l7",
                  "http_config_settings",
                  "http_custom_errors",
                  "http_log_custom_fields",
                  "http_ratelimit",
                  "http_request_cache_settings",
                  "http_request_dynamic_redirect",
                  "http_request_firewall_custom",
                  "http_request_firewall_managed",
                  "http_request_late_transform",
                  "http_request_origin",
                  "http_request_redirect",
                  "http_request_sanitize",
                  "http_request_sbfm",
                  "http_request_transform",
                  "http_response_compression",
                  "http_response_firewall_managed",
                  "http_response_headers_transform",
                  "magic_transit",
                  "magic_transit_ids_managed",
                  "magic_transit_managed",
                  "magic_transit_ratelimit",
                ),
              ),
            ),
            products: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "bic",
                  "hot",
                  "rateLimit",
                  "securityLevel",
                  "uaBlock",
                  "waf",
                  "zoneLockdown",
                ),
              ),
            ),
            rules: Schema.optional(Schema.Struct({})),
            ruleset: Schema.optional(Schema.Literal("current")),
            rulesets: Schema.optional(Schema.Array(Schema.String)),
          }),
        ).pipe(T.JsonName("action_parameters")),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(
          Schema.Struct({
            enabled: Schema.Boolean,
          }),
        ),
        position: Schema.optional(
          Schema.Union(
            Schema.Struct({
              before: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              after: Schema.optional(Schema.String),
            }),
            Schema.Struct({
              index: Schema.optional(Schema.Number),
            }),
          ),
        ),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
    ),
  ),
  version: Schema.String,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteRuleResponse>;

export const deleteRule = API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResponse,
  errors: [],
}));

// =============================================================================
// Ruleset
// =============================================================================

export interface GetRulesetRequest {
  rulesetId: string;
}

export const GetRulesetRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
}).pipe(
  T.Http({ method: "GET", path: "/{accountOrZone}/{accountOrZoneId}/rulesets/{rulesetId}" }),
) as unknown as Schema.Schema<GetRulesetRequest>;

export interface GetRulesetResponse {
  /** The unique ID of the ruleset. */
  id: string;
  /** The kind of the ruleset. */
  kind: "managed" | "custom" | "root" | "zone";
  /** The timestamp of when the ruleset was last modified. */
  lastUpdated: string;
  /** The human-readable name of the ruleset. */
  name: string;
  /** The phase of the ruleset. */
  phase:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** The list of rules in the ruleset. */
  rules: (
    | unknown
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
  /** The version of the ruleset. */
  version: string;
  /** An informative description of the ruleset. */
  description?: string;
}

export const GetRulesetResponse = Schema.Struct({
  id: Schema.String,
  kind: Schema.Literal("managed", "custom", "root", "zone"),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  name: Schema.String,
  phase: Schema.Literal(
    "ddos_l4",
    "ddos_l7",
    "http_config_settings",
    "http_custom_errors",
    "http_log_custom_fields",
    "http_ratelimit",
    "http_request_cache_settings",
    "http_request_dynamic_redirect",
    "http_request_firewall_custom",
    "http_request_firewall_managed",
    "http_request_late_transform",
    "http_request_origin",
    "http_request_redirect",
    "http_request_sanitize",
    "http_request_sbfm",
    "http_request_transform",
    "http_response_compression",
    "http_response_firewall_managed",
    "http_response_headers_transform",
    "magic_transit",
    "magic_transit_ids_managed",
    "magic_transit_managed",
    "magic_transit_ratelimit",
  ),
  rules: Schema.Array(
    Schema.Union(
      Schema.Unknown,
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("js_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
    ),
  ),
  version: Schema.String,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetRulesetResponse>;

export const getRuleset = API.make(() => ({
  input: GetRulesetRequest,
  output: GetRulesetResponse,
  errors: [],
}));

export interface CreateRulesetRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: The kind of the ruleset. */
  kind: "managed" | "custom" | "root" | "zone";
  /** Body param: The human-readable name of the ruleset. */
  name: string;
  /** Body param: The phase of the ruleset. */
  phase:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** Body param: An informative description of the ruleset. */
  description?: string;
  /** Body param: The list of rules in the ruleset. */
  rules?: (
    | unknown
    | {
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
}

export const CreateRulesetRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  kind: Schema.Literal("managed", "custom", "root", "zone"),
  name: Schema.String,
  phase: Schema.Literal(
    "ddos_l4",
    "ddos_l7",
    "http_config_settings",
    "http_custom_errors",
    "http_log_custom_fields",
    "http_ratelimit",
    "http_request_cache_settings",
    "http_request_dynamic_redirect",
    "http_request_firewall_custom",
    "http_request_firewall_managed",
    "http_request_late_transform",
    "http_request_origin",
    "http_request_redirect",
    "http_request_sanitize",
    "http_request_sbfm",
    "http_request_transform",
    "http_response_compression",
    "http_response_firewall_managed",
    "http_response_headers_transform",
    "magic_transit",
    "magic_transit_ids_managed",
    "magic_transit_managed",
    "magic_transit_ratelimit",
  ),
  description: Schema.optional(Schema.String),
  rules: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Unknown,
        Schema.Struct({
          id: Schema.optional(Schema.String),
          action: Schema.optional(Schema.Literal("challenge")),
          actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
          description: Schema.optional(Schema.String),
          enabled: Schema.optional(Schema.Boolean),
          exposedCredentialCheck: Schema.optional(
            Schema.Struct({
              passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
              usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
            }),
          ).pipe(T.JsonName("exposed_credential_check")),
          expression: Schema.optional(Schema.String),
          logging: Schema.optional(Schema.Unknown),
          ratelimit: Schema.optional(
            Schema.Struct({
              characteristics: Schema.Array(Schema.String),
              period: Schema.Number,
              countingExpression: Schema.optional(Schema.String).pipe(
                T.JsonName("counting_expression"),
              ),
              mitigationTimeout: Schema.optional(Schema.Number).pipe(
                T.JsonName("mitigation_timeout"),
              ),
              requestsPerPeriod: Schema.optional(Schema.Number).pipe(
                T.JsonName("requests_per_period"),
              ),
              requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("requests_to_origin"),
              ),
              scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
              scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
                T.JsonName("score_response_header_name"),
              ),
            }),
          ),
          ref: Schema.optional(Schema.String),
        }),
        Schema.Struct({
          id: Schema.optional(Schema.String),
          action: Schema.optional(Schema.Literal("js_challenge")),
          actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
          description: Schema.optional(Schema.String),
          enabled: Schema.optional(Schema.Boolean),
          exposedCredentialCheck: Schema.optional(
            Schema.Struct({
              passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
              usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
            }),
          ).pipe(T.JsonName("exposed_credential_check")),
          expression: Schema.optional(Schema.String),
          logging: Schema.optional(Schema.Unknown),
          ratelimit: Schema.optional(
            Schema.Struct({
              characteristics: Schema.Array(Schema.String),
              period: Schema.Number,
              countingExpression: Schema.optional(Schema.String).pipe(
                T.JsonName("counting_expression"),
              ),
              mitigationTimeout: Schema.optional(Schema.Number).pipe(
                T.JsonName("mitigation_timeout"),
              ),
              requestsPerPeriod: Schema.optional(Schema.Number).pipe(
                T.JsonName("requests_per_period"),
              ),
              requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("requests_to_origin"),
              ),
              scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
              scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
                T.JsonName("score_response_header_name"),
              ),
            }),
          ),
          ref: Schema.optional(Schema.String),
        }),
      ),
    ),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/{accountOrZone}/{accountOrZoneId}/rulesets" }),
) as unknown as Schema.Schema<CreateRulesetRequest>;

export interface CreateRulesetResponse {
  /** The unique ID of the ruleset. */
  id: string;
  /** The kind of the ruleset. */
  kind: "managed" | "custom" | "root" | "zone";
  /** The timestamp of when the ruleset was last modified. */
  lastUpdated: string;
  /** The human-readable name of the ruleset. */
  name: string;
  /** The phase of the ruleset. */
  phase:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** The list of rules in the ruleset. */
  rules: (
    | unknown
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
  /** The version of the ruleset. */
  version: string;
  /** An informative description of the ruleset. */
  description?: string;
}

export const CreateRulesetResponse = Schema.Struct({
  id: Schema.String,
  kind: Schema.Literal("managed", "custom", "root", "zone"),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  name: Schema.String,
  phase: Schema.Literal(
    "ddos_l4",
    "ddos_l7",
    "http_config_settings",
    "http_custom_errors",
    "http_log_custom_fields",
    "http_ratelimit",
    "http_request_cache_settings",
    "http_request_dynamic_redirect",
    "http_request_firewall_custom",
    "http_request_firewall_managed",
    "http_request_late_transform",
    "http_request_origin",
    "http_request_redirect",
    "http_request_sanitize",
    "http_request_sbfm",
    "http_request_transform",
    "http_response_compression",
    "http_response_firewall_managed",
    "http_response_headers_transform",
    "magic_transit",
    "magic_transit_ids_managed",
    "magic_transit_managed",
    "magic_transit_ratelimit",
  ),
  rules: Schema.Array(
    Schema.Union(
      Schema.Unknown,
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("js_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
    ),
  ),
  version: Schema.String,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateRulesetResponse>;

export const createRuleset = API.make(() => ({
  input: CreateRulesetRequest,
  output: CreateRulesetResponse,
  errors: [],
}));

export interface UpdateRulesetRequest {
  rulesetId: string;
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: An informative description of the ruleset. */
  description?: string;
  /** Body param: The kind of the ruleset. */
  kind?: "managed" | "custom" | "root" | "zone";
  /** Body param: The human-readable name of the ruleset. */
  name?: string;
  /** Body param: The phase of the ruleset. */
  phase?:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** Body param: The list of rules in the ruleset. */
  rules?: (
    | unknown
    | {
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
}

export const UpdateRulesetRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  description: Schema.optional(Schema.String),
  kind: Schema.optional(Schema.Literal("managed", "custom", "root", "zone")),
  name: Schema.optional(Schema.String),
  phase: Schema.optional(
    Schema.Literal(
      "ddos_l4",
      "ddos_l7",
      "http_config_settings",
      "http_custom_errors",
      "http_log_custom_fields",
      "http_ratelimit",
      "http_request_cache_settings",
      "http_request_dynamic_redirect",
      "http_request_firewall_custom",
      "http_request_firewall_managed",
      "http_request_late_transform",
      "http_request_origin",
      "http_request_redirect",
      "http_request_sanitize",
      "http_request_sbfm",
      "http_request_transform",
      "http_response_compression",
      "http_response_firewall_managed",
      "http_response_headers_transform",
      "magic_transit",
      "magic_transit_ids_managed",
      "magic_transit_managed",
      "magic_transit_ratelimit",
    ),
  ),
  rules: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Unknown,
        Schema.Struct({
          id: Schema.optional(Schema.String),
          action: Schema.optional(Schema.Literal("challenge")),
          actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
          description: Schema.optional(Schema.String),
          enabled: Schema.optional(Schema.Boolean),
          exposedCredentialCheck: Schema.optional(
            Schema.Struct({
              passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
              usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
            }),
          ).pipe(T.JsonName("exposed_credential_check")),
          expression: Schema.optional(Schema.String),
          logging: Schema.optional(Schema.Unknown),
          ratelimit: Schema.optional(
            Schema.Struct({
              characteristics: Schema.Array(Schema.String),
              period: Schema.Number,
              countingExpression: Schema.optional(Schema.String).pipe(
                T.JsonName("counting_expression"),
              ),
              mitigationTimeout: Schema.optional(Schema.Number).pipe(
                T.JsonName("mitigation_timeout"),
              ),
              requestsPerPeriod: Schema.optional(Schema.Number).pipe(
                T.JsonName("requests_per_period"),
              ),
              requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("requests_to_origin"),
              ),
              scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
              scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
                T.JsonName("score_response_header_name"),
              ),
            }),
          ),
          ref: Schema.optional(Schema.String),
        }),
        Schema.Struct({
          id: Schema.optional(Schema.String),
          action: Schema.optional(Schema.Literal("js_challenge")),
          actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
          description: Schema.optional(Schema.String),
          enabled: Schema.optional(Schema.Boolean),
          exposedCredentialCheck: Schema.optional(
            Schema.Struct({
              passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
              usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
            }),
          ).pipe(T.JsonName("exposed_credential_check")),
          expression: Schema.optional(Schema.String),
          logging: Schema.optional(Schema.Unknown),
          ratelimit: Schema.optional(
            Schema.Struct({
              characteristics: Schema.Array(Schema.String),
              period: Schema.Number,
              countingExpression: Schema.optional(Schema.String).pipe(
                T.JsonName("counting_expression"),
              ),
              mitigationTimeout: Schema.optional(Schema.Number).pipe(
                T.JsonName("mitigation_timeout"),
              ),
              requestsPerPeriod: Schema.optional(Schema.Number).pipe(
                T.JsonName("requests_per_period"),
              ),
              requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("requests_to_origin"),
              ),
              scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
              scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
                T.JsonName("score_response_header_name"),
              ),
            }),
          ),
          ref: Schema.optional(Schema.String),
        }),
      ),
    ),
  ),
}).pipe(
  T.Http({ method: "PUT", path: "/{accountOrZone}/{accountOrZoneId}/rulesets/{rulesetId}" }),
) as unknown as Schema.Schema<UpdateRulesetRequest>;

export interface UpdateRulesetResponse {
  /** The unique ID of the ruleset. */
  id: string;
  /** The kind of the ruleset. */
  kind: "managed" | "custom" | "root" | "zone";
  /** The timestamp of when the ruleset was last modified. */
  lastUpdated: string;
  /** The human-readable name of the ruleset. */
  name: string;
  /** The phase of the ruleset. */
  phase:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** The list of rules in the ruleset. */
  rules: (
    | unknown
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
  /** The version of the ruleset. */
  version: string;
  /** An informative description of the ruleset. */
  description?: string;
}

export const UpdateRulesetResponse = Schema.Struct({
  id: Schema.String,
  kind: Schema.Literal("managed", "custom", "root", "zone"),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  name: Schema.String,
  phase: Schema.Literal(
    "ddos_l4",
    "ddos_l7",
    "http_config_settings",
    "http_custom_errors",
    "http_log_custom_fields",
    "http_ratelimit",
    "http_request_cache_settings",
    "http_request_dynamic_redirect",
    "http_request_firewall_custom",
    "http_request_firewall_managed",
    "http_request_late_transform",
    "http_request_origin",
    "http_request_redirect",
    "http_request_sanitize",
    "http_request_sbfm",
    "http_request_transform",
    "http_response_compression",
    "http_response_firewall_managed",
    "http_response_headers_transform",
    "magic_transit",
    "magic_transit_ids_managed",
    "magic_transit_managed",
    "magic_transit_ratelimit",
  ),
  rules: Schema.Array(
    Schema.Union(
      Schema.Unknown,
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("js_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
    ),
  ),
  version: Schema.String,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateRulesetResponse>;

export const updateRuleset = API.make(() => ({
  input: UpdateRulesetRequest,
  output: UpdateRulesetResponse,
  errors: [],
}));

export interface DeleteRulesetRequest {
  rulesetId: string;
}

export const DeleteRulesetRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
}).pipe(
  T.Http({ method: "DELETE", path: "/{accountOrZone}/{accountOrZoneId}/rulesets/{rulesetId}" }),
) as unknown as Schema.Schema<DeleteRulesetRequest>;

export type DeleteRulesetResponse = unknown;

export const DeleteRulesetResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteRulesetResponse>;

export const deleteRuleset = API.make(() => ({
  input: DeleteRulesetRequest,
  output: DeleteRulesetResponse,
  errors: [],
}));

// =============================================================================
// Version
// =============================================================================

export interface GetVersionRequest {
  rulesetId: string;
  rulesetVersion: string;
}

export const GetVersionRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
  rulesetVersion: Schema.String.pipe(T.HttpPath("rulesetVersion")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/rulesets/{rulesetId}/versions/{rulesetVersion}",
  }),
) as unknown as Schema.Schema<GetVersionRequest>;

export interface GetVersionResponse {
  /** The unique ID of the ruleset. */
  id: string;
  /** The kind of the ruleset. */
  kind: "managed" | "custom" | "root" | "zone";
  /** The timestamp of when the ruleset was last modified. */
  lastUpdated: string;
  /** The human-readable name of the ruleset. */
  name: string;
  /** The phase of the ruleset. */
  phase:
    | "ddos_l4"
    | "ddos_l7"
    | "http_config_settings"
    | "http_custom_errors"
    | "http_log_custom_fields"
    | "http_ratelimit"
    | "http_request_cache_settings"
    | "http_request_dynamic_redirect"
    | "http_request_firewall_custom"
    | "http_request_firewall_managed"
    | "http_request_late_transform"
    | "http_request_origin"
    | "http_request_redirect"
    | "http_request_sanitize"
    | "http_request_sbfm"
    | "http_request_transform"
    | "http_response_compression"
    | "http_response_firewall_managed"
    | "http_response_headers_transform"
    | "magic_transit"
    | "magic_transit_ids_managed"
    | "magic_transit_managed"
    | "magic_transit_ratelimit";
  /** The list of rules in the ruleset. */
  rules: (
    | unknown
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
    | {
        lastUpdated: string;
        version: string;
        id?: string;
        action?: "js_challenge";
        actionParameters?: unknown;
        categories?: string[];
        description?: string;
        enabled?: boolean;
        exposedCredentialCheck?: { passwordExpression: string; usernameExpression: string };
        expression?: string;
        logging?: unknown;
        ratelimit?: {
          characteristics: string[];
          period: number;
          countingExpression?: string;
          mitigationTimeout?: number;
          requestsPerPeriod?: number;
          requestsToOrigin?: boolean;
          scorePerPeriod?: number;
          scoreResponseHeaderName?: string;
        };
        ref?: string;
      }
  )[];
  /** The version of the ruleset. */
  version: string;
  /** An informative description of the ruleset. */
  description?: string;
}

export const GetVersionResponse = Schema.Struct({
  id: Schema.String,
  kind: Schema.Literal("managed", "custom", "root", "zone"),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  name: Schema.String,
  phase: Schema.Literal(
    "ddos_l4",
    "ddos_l7",
    "http_config_settings",
    "http_custom_errors",
    "http_log_custom_fields",
    "http_ratelimit",
    "http_request_cache_settings",
    "http_request_dynamic_redirect",
    "http_request_firewall_custom",
    "http_request_firewall_managed",
    "http_request_late_transform",
    "http_request_origin",
    "http_request_redirect",
    "http_request_sanitize",
    "http_request_sbfm",
    "http_request_transform",
    "http_response_compression",
    "http_response_firewall_managed",
    "http_response_headers_transform",
    "magic_transit",
    "magic_transit_ids_managed",
    "magic_transit_managed",
    "magic_transit_ratelimit",
  ),
  rules: Schema.Array(
    Schema.Union(
      Schema.Unknown,
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
        version: Schema.String,
        id: Schema.optional(Schema.String),
        action: Schema.optional(Schema.Literal("js_challenge")),
        actionParameters: Schema.optional(Schema.Unknown).pipe(T.JsonName("action_parameters")),
        categories: Schema.optional(Schema.Array(Schema.String)),
        description: Schema.optional(Schema.String),
        enabled: Schema.optional(Schema.Boolean),
        exposedCredentialCheck: Schema.optional(
          Schema.Struct({
            passwordExpression: Schema.String.pipe(T.JsonName("password_expression")),
            usernameExpression: Schema.String.pipe(T.JsonName("username_expression")),
          }),
        ).pipe(T.JsonName("exposed_credential_check")),
        expression: Schema.optional(Schema.String),
        logging: Schema.optional(Schema.Unknown),
        ratelimit: Schema.optional(
          Schema.Struct({
            characteristics: Schema.Array(Schema.String),
            period: Schema.Number,
            countingExpression: Schema.optional(Schema.String).pipe(
              T.JsonName("counting_expression"),
            ),
            mitigationTimeout: Schema.optional(Schema.Number).pipe(
              T.JsonName("mitigation_timeout"),
            ),
            requestsPerPeriod: Schema.optional(Schema.Number).pipe(
              T.JsonName("requests_per_period"),
            ),
            requestsToOrigin: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("requests_to_origin"),
            ),
            scorePerPeriod: Schema.optional(Schema.Number).pipe(T.JsonName("score_per_period")),
            scoreResponseHeaderName: Schema.optional(Schema.String).pipe(
              T.JsonName("score_response_header_name"),
            ),
          }),
        ),
        ref: Schema.optional(Schema.String),
      }),
    ),
  ),
  version: Schema.String,
  description: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetVersionResponse>;

export const getVersion = API.make(() => ({
  input: GetVersionRequest,
  output: GetVersionResponse,
  errors: [],
}));

export interface DeleteVersionRequest {
  rulesetId: string;
  rulesetVersion: string;
}

export const DeleteVersionRequest = Schema.Struct({
  rulesetId: Schema.String.pipe(T.HttpPath("rulesetId")),
  rulesetVersion: Schema.String.pipe(T.HttpPath("rulesetVersion")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/{accountOrZone}/{accountOrZoneId}/rulesets/{rulesetId}/versions/{rulesetVersion}",
  }),
) as unknown as Schema.Schema<DeleteVersionRequest>;

export type DeleteVersionResponse = unknown;

export const DeleteVersionResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteVersionResponse>;

export const deleteVersion = API.make(() => ({
  input: DeleteVersionRequest,
  output: DeleteVersionResponse,
  errors: [],
}));
