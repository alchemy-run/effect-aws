/**
 * Cloudflare ZONES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service zones
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

// =============================================================================
// ActivationCheck
// =============================================================================

export interface TriggerActivationCheckRequest {
  /** Identifier. */
  zoneId: string;
}

export const TriggerActivationCheckRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/activation_check" }),
) as unknown as Schema.Schema<TriggerActivationCheckRequest>;

export interface TriggerActivationCheckResponse {
  /** Identifier. */
  id?: string;
}

export const TriggerActivationCheckResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<TriggerActivationCheckResponse>;

export const triggerActivationCheck: (
  input: TriggerActivationCheckRequest,
) => Effect.Effect<
  TriggerActivationCheckResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: TriggerActivationCheckRequest,
  output: TriggerActivationCheckResponse,
  errors: [],
}));

// =============================================================================
// CustomNameserver
// =============================================================================

export interface GetCustomNameserverRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetCustomNameserverRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/custom_ns" }),
) as unknown as Schema.Schema<GetCustomNameserverRequest>;

export interface GetCustomNameserverResponse {
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
  /** Whether zone uses account-level custom nameservers. */
  enabled?: boolean;
  /** The number of the name server set to assign to the zone. */
  nsSet?: number;
  resultInfo?: {
    count?: number;
    page?: number;
    perPage?: number;
    totalCount?: number;
  };
}

export const GetCustomNameserverResponse = Schema.Struct({
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
  enabled: Schema.optional(Schema.Boolean),
  nsSet: Schema.optional(Schema.Number).pipe(T.JsonName("ns_set")),
  resultInfo: Schema.optional(
    Schema.Struct({
      count: Schema.optional(Schema.Number),
      page: Schema.optional(Schema.Number),
      perPage: Schema.optional(Schema.Number).pipe(T.JsonName("per_page")),
      totalCount: Schema.optional(Schema.Number).pipe(
        T.JsonName("total_count"),
      ),
    }),
  ).pipe(T.JsonName("result_info")),
}) as unknown as Schema.Schema<GetCustomNameserverResponse>;

export const getCustomNameserver: (
  input: GetCustomNameserverRequest,
) => Effect.Effect<
  GetCustomNameserverResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetCustomNameserverRequest,
  output: GetCustomNameserverResponse,
  errors: [],
}));

// =============================================================================
// Hold
// =============================================================================

export interface GetHoldRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetHoldRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/hold" }),
) as unknown as Schema.Schema<GetHoldRequest>;

export interface GetHoldResponse {
  hold?: boolean;
  holdAfter?: string;
  includeSubdomains?: string;
}

export const GetHoldResponse = Schema.Struct({
  hold: Schema.optional(Schema.Boolean),
  holdAfter: Schema.optional(Schema.String).pipe(T.JsonName("hold_after")),
  includeSubdomains: Schema.optional(Schema.String).pipe(
    T.JsonName("include_subdomains"),
  ),
}) as unknown as Schema.Schema<GetHoldResponse>;

export const getHold: (
  input: GetHoldRequest,
) => Effect.Effect<
  GetHoldResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHoldRequest,
  output: GetHoldResponse,
  errors: [],
}));

export interface CreateHoldRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: If provided, the zone hold will extend to block any subdomain of the given zone, as well as SSL4SaaS Custom Hostnames. For example, a zone hold on a zone with the hostname 'example.com' a */
  includeSubdomains?: boolean;
}

export const CreateHoldRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  includeSubdomains: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("include_subdomains"),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/hold" }),
) as unknown as Schema.Schema<CreateHoldRequest>;

export interface CreateHoldResponse {
  hold?: boolean;
  holdAfter?: string;
  includeSubdomains?: string;
}

export const CreateHoldResponse = Schema.Struct({
  hold: Schema.optional(Schema.Boolean),
  holdAfter: Schema.optional(Schema.String).pipe(T.JsonName("hold_after")),
  includeSubdomains: Schema.optional(Schema.String).pipe(
    T.JsonName("include_subdomains"),
  ),
}) as unknown as Schema.Schema<CreateHoldResponse>;

export const createHold: (
  input: CreateHoldRequest,
) => Effect.Effect<
  CreateHoldResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateHoldRequest,
  output: CreateHoldResponse,
  errors: [],
}));

export interface PatchHoldRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: If `hold_after` is provided and future-dated, the hold will be temporarily disabled, then automatically re-enabled by the system at the time specified in this RFC3339-formatted timestamp.  */
  holdAfter?: string;
  /** Body param: If `true`, the zone hold will extend to block any subdomain of the given zone, as well as SSL4SaaS Custom Hostnames. For example, a zone hold on a zone with the hostname 'example.com' and  */
  includeSubdomains?: boolean;
}

export const PatchHoldRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  holdAfter: Schema.optional(Schema.String).pipe(T.JsonName("hold_after")),
  includeSubdomains: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("include_subdomains"),
  ),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/hold" }),
) as unknown as Schema.Schema<PatchHoldRequest>;

export interface PatchHoldResponse {
  hold?: boolean;
  holdAfter?: string;
  includeSubdomains?: string;
}

export const PatchHoldResponse = Schema.Struct({
  hold: Schema.optional(Schema.Boolean),
  holdAfter: Schema.optional(Schema.String).pipe(T.JsonName("hold_after")),
  includeSubdomains: Schema.optional(Schema.String).pipe(
    T.JsonName("include_subdomains"),
  ),
}) as unknown as Schema.Schema<PatchHoldResponse>;

export const patchHold: (
  input: PatchHoldRequest,
) => Effect.Effect<
  PatchHoldResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchHoldRequest,
  output: PatchHoldResponse,
  errors: [],
}));

export interface DeleteHoldRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: If `hold_after` is provided, the hold will be temporarily disabled, then automatically re-enabled by the system at the time specified in this RFC3339-formatted timestamp. Otherwise, the h */
  holdAfter?: string;
}

export const DeleteHoldRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  holdAfter: Schema.optional(Schema.String).pipe(T.HttpQuery("hold_after")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/hold" }),
) as unknown as Schema.Schema<DeleteHoldRequest>;

export interface DeleteHoldResponse {
  hold?: boolean;
  holdAfter?: string;
  includeSubdomains?: string;
}

export const DeleteHoldResponse = Schema.Struct({
  hold: Schema.optional(Schema.Boolean),
  holdAfter: Schema.optional(Schema.String).pipe(T.JsonName("hold_after")),
  includeSubdomains: Schema.optional(Schema.String).pipe(
    T.JsonName("include_subdomains"),
  ),
}) as unknown as Schema.Schema<DeleteHoldResponse>;

export const deleteHold: (
  input: DeleteHoldRequest,
) => Effect.Effect<
  DeleteHoldResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteHoldRequest,
  output: DeleteHoldResponse,
  errors: [],
}));

// =============================================================================
// Plan
// =============================================================================

export interface GetPlanRequest {
  planIdentifier: string;
  /** Identifier */
  zoneId: string;
}

export const GetPlanRequest = Schema.Struct({
  planIdentifier: Schema.String.pipe(T.HttpPath("planIdentifier")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/available_plans/{planIdentifier}",
  }),
) as unknown as Schema.Schema<GetPlanRequest>;

export interface GetPlanResponse {
  /** Identifier */
  id?: string;
  /** Indicates whether you can subscribe to this plan. */
  canSubscribe?: boolean;
  /** The monetary unit in which pricing information is displayed. */
  currency?: string;
  /** Indicates whether this plan is managed externally. */
  externallyManaged?: boolean;
  /** The frequency at which you will be billed for this plan. */
  frequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  /** Indicates whether you are currently subscribed to this plan. */
  isSubscribed?: boolean;
  /** Indicates whether this plan has a legacy discount applied. */
  legacyDiscount?: boolean;
  /** The legacy identifier for this rate plan, if any. */
  legacyId?: string;
  /** The plan name. */
  name?: string;
  /** The amount you will be billed for this plan. */
  price?: number;
}

export const GetPlanResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  canSubscribe: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("can_subscribe"),
  ),
  currency: Schema.optional(Schema.String),
  externallyManaged: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("externally_managed"),
  ),
  frequency: Schema.optional(
    Schema.Literal("weekly", "monthly", "quarterly", "yearly"),
  ),
  isSubscribed: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("is_subscribed"),
  ),
  legacyDiscount: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("legacy_discount"),
  ),
  legacyId: Schema.optional(Schema.String).pipe(T.JsonName("legacy_id")),
  name: Schema.optional(Schema.String),
  price: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetPlanResponse>;

export const getPlan: (
  input: GetPlanRequest,
) => Effect.Effect<
  GetPlanResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetPlanRequest,
  output: GetPlanResponse,
  errors: [],
}));

// =============================================================================
// Setting
// =============================================================================

export interface GetSettingRequest {
  settingId: string;
  /** Identifier */
  zoneId: string;
}

export const GetSettingRequest = Schema.Struct({
  settingId: Schema.String.pipe(T.HttpPath("settingId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/settings/{settingId}" }),
) as unknown as Schema.Schema<GetSettingRequest>;

export type GetSettingResponse =
  | {
      id: "0rtt";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "advanced_ddos";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "aegis";
      modifiedOn?: string | null;
      value?: { enabled?: boolean; poolId?: string };
    }
  | {
      id: "always_online";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "always_use_https";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "automatic_https_rewrites";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "brotli";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "browser_cache_ttl";
      value: number;
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "browser_check";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "cache_level";
      value: "aggressive" | "basic" | "simplified";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "challenge_ttl";
      value:
        | "300"
        | "900"
        | "1800"
        | "2700"
        | "3600"
        | "7200"
        | "10800"
        | "14400"
        | "28800"
        | "57600"
        | "86400"
        | "604800"
        | "2592000"
        | "31536000";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "china_network_enabled";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "ciphers";
      value: string[];
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "cname_flattening";
      value: "flatten_at_root" | "flatten_all";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "development_mode";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
      timeRemaining?: number;
    }
  | {
      id: "early_hints";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "edge_cache_ttl";
      value:
        | "30"
        | "60"
        | "300"
        | "1200"
        | "1800"
        | "3600"
        | "7200"
        | "10800"
        | "14400"
        | "18000"
        | "28800"
        | "43200"
        | "57600"
        | "72000"
        | "86400"
        | "172800"
        | "259200"
        | "345600"
        | "432000"
        | "518400"
        | "604800";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "email_obfuscation";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "h2_prioritization";
      value: "on" | "off" | "custom";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "hotlink_protection";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "http2";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "http3";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "image_resizing";
      value: "on" | "off" | "open";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "ip_geolocation";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "ipv6";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "max_upload";
      value:
        | "100"
        | "125"
        | "150"
        | "175"
        | "200"
        | "225"
        | "250"
        | "275"
        | "300"
        | "325"
        | "350"
        | "375"
        | "400"
        | "425"
        | "450"
        | "475"
        | "500"
        | "1000";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "min_tls_version";
      value: "1.0" | "1.1" | "1.2" | "1.3";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "mirage";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "nel";
      value: { enabled?: boolean };
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "opportunistic_encryption";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "opportunistic_onion";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "orange_to_orange";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "origin_error_page_pass_thru";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | { id: "origin_h2_max_streams"; modifiedOn?: string | null; value?: number }
  | {
      id: "origin_max_http_version";
      modifiedOn?: string | null;
      value?: "2" | "1";
    }
  | {
      id: "polish";
      value: "off" | "lossless" | "lossy";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "prefetch_preload";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "privacy_pass";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "proxy_read_timeout";
      value: number;
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "pseudo_ipv4";
      value: "off" | "add_header" | "overwrite_header";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "replace_insecure_js";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "response_buffering";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "rocket_loader";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "automatic_platform_optimization";
      value: unknown;
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "security_header";
      value: {
        strictTransportSecurity?: {
          enabled?: boolean;
          includeSubdomains?: boolean;
          maxAge?: number;
          nosniff?: boolean;
          preload?: boolean;
        };
      };
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "security_level";
      value:
        | "off"
        | "essentially_off"
        | "low"
        | "medium"
        | "high"
        | "under_attack";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "server_side_exclude";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "sha1_support";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "sort_query_string_for_cache";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "ssl";
      value: "off" | "flexible" | "full" | "strict";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | { id?: "ssl_recommender"; enabled?: boolean }
  | {
      id: "tls_1_2_only";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "tls_1_3";
      value: "on" | "off" | "zrt";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "tls_client_auth";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "transformations";
      value: "on" | "off" | "open";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "transformations_allowed_origins";
      value: string;
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "true_client_ip_header";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "waf";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "webp";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "websockets";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    };

export const GetSettingResponse = Schema.Union(
  Schema.Struct({
    id: Schema.Literal("0rtt"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("advanced_ddos"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("aegis"),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
    value: Schema.optional(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        poolId: Schema.optional(Schema.String).pipe(T.JsonName("pool_id")),
      }),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("always_online"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("always_use_https"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("automatic_https_rewrites"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("brotli"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("browser_cache_ttl"),
    value: Schema.Number,
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("browser_check"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("cache_level"),
    value: Schema.Literal("aggressive", "basic", "simplified"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("challenge_ttl"),
    value: Schema.Literal(
      "300",
      "900",
      "1800",
      "2700",
      "3600",
      "7200",
      "10800",
      "14400",
      "28800",
      "57600",
      "86400",
      "604800",
      "2592000",
      "31536000",
    ),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("china_network_enabled"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("ciphers"),
    value: Schema.Array(Schema.String),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("cname_flattening"),
    value: Schema.Literal("flatten_at_root", "flatten_all"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("development_mode"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
    timeRemaining: Schema.optional(Schema.Number).pipe(
      T.JsonName("time_remaining"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("early_hints"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("edge_cache_ttl"),
    value: Schema.Literal(
      "30",
      "60",
      "300",
      "1200",
      "1800",
      "3600",
      "7200",
      "10800",
      "14400",
      "18000",
      "28800",
      "43200",
      "57600",
      "72000",
      "86400",
      "172800",
      "259200",
      "345600",
      "432000",
      "518400",
      "604800",
    ),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("email_obfuscation"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("h2_prioritization"),
    value: Schema.Literal("on", "off", "custom"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("hotlink_protection"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("http2"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("http3"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("image_resizing"),
    value: Schema.Literal("on", "off", "open"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("ip_geolocation"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("ipv6"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("max_upload"),
    value: Schema.Literal(
      "100",
      "125",
      "150",
      "175",
      "200",
      "225",
      "250",
      "275",
      "300",
      "325",
      "350",
      "375",
      "400",
      "425",
      "450",
      "475",
      "500",
      "1000",
    ),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("min_tls_version"),
    value: Schema.Literal("1.0", "1.1", "1.2", "1.3"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("mirage"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("nel"),
    value: Schema.Struct({
      enabled: Schema.optional(Schema.Boolean),
    }),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("opportunistic_encryption"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("opportunistic_onion"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("orange_to_orange"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("origin_error_page_pass_thru"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("origin_h2_max_streams"),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
    value: Schema.optional(Schema.Number),
  }),
  Schema.Struct({
    id: Schema.Literal("origin_max_http_version"),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
    value: Schema.optional(Schema.Literal("2", "1")),
  }),
  Schema.Struct({
    id: Schema.Literal("polish"),
    value: Schema.Literal("off", "lossless", "lossy"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("prefetch_preload"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("privacy_pass"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("proxy_read_timeout"),
    value: Schema.Number,
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("pseudo_ipv4"),
    value: Schema.Literal("off", "add_header", "overwrite_header"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("replace_insecure_js"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("response_buffering"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("rocket_loader"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("automatic_platform_optimization"),
    value: Schema.Unknown,
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("security_header"),
    value: Schema.Struct({
      strictTransportSecurity: Schema.optional(
        Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          includeSubdomains: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("include_subdomains"),
          ),
          maxAge: Schema.optional(Schema.Number).pipe(T.JsonName("max_age")),
          nosniff: Schema.optional(Schema.Boolean),
          preload: Schema.optional(Schema.Boolean),
        }),
      ).pipe(T.JsonName("strict_transport_security")),
    }),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("security_level"),
    value: Schema.Literal(
      "off",
      "essentially_off",
      "low",
      "medium",
      "high",
      "under_attack",
    ),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("server_side_exclude"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("sha1_support"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("sort_query_string_for_cache"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("ssl"),
    value: Schema.Literal("off", "flexible", "full", "strict"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.optional(Schema.Literal("ssl_recommender")),
    enabled: Schema.optional(Schema.Boolean),
  }),
  Schema.Struct({
    id: Schema.Literal("tls_1_2_only"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("tls_1_3"),
    value: Schema.Literal("on", "off", "zrt"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("tls_client_auth"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("transformations"),
    value: Schema.Literal("on", "off", "open"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("transformations_allowed_origins"),
    value: Schema.String,
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("true_client_ip_header"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("waf"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("webp"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("websockets"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
) as unknown as Schema.Schema<GetSettingResponse>;

export const getSetting: (
  input: GetSettingRequest,
) => Effect.Effect<
  GetSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSettingRequest,
  output: GetSettingResponse,
  errors: [],
}));

export interface PatchSettingRequest {
  settingId: string;
}

export const PatchSettingRequest = Schema.Struct({
  settingId: Schema.String.pipe(T.HttpPath("settingId")),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/settings/{settingId}" }),
) as unknown as Schema.Schema<PatchSettingRequest>;

export type PatchSettingResponse =
  | {
      id: "0rtt";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "advanced_ddos";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "aegis";
      modifiedOn?: string | null;
      value?: { enabled?: boolean; poolId?: string };
    }
  | {
      id: "always_online";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "always_use_https";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "automatic_https_rewrites";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "brotli";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "browser_cache_ttl";
      value: number;
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "browser_check";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "cache_level";
      value: "aggressive" | "basic" | "simplified";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "challenge_ttl";
      value:
        | "300"
        | "900"
        | "1800"
        | "2700"
        | "3600"
        | "7200"
        | "10800"
        | "14400"
        | "28800"
        | "57600"
        | "86400"
        | "604800"
        | "2592000"
        | "31536000";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "china_network_enabled";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "ciphers";
      value: string[];
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "cname_flattening";
      value: "flatten_at_root" | "flatten_all";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "development_mode";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
      timeRemaining?: number;
    }
  | {
      id: "early_hints";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "edge_cache_ttl";
      value:
        | "30"
        | "60"
        | "300"
        | "1200"
        | "1800"
        | "3600"
        | "7200"
        | "10800"
        | "14400"
        | "18000"
        | "28800"
        | "43200"
        | "57600"
        | "72000"
        | "86400"
        | "172800"
        | "259200"
        | "345600"
        | "432000"
        | "518400"
        | "604800";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "email_obfuscation";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "h2_prioritization";
      value: "on" | "off" | "custom";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "hotlink_protection";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "http2";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "http3";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "image_resizing";
      value: "on" | "off" | "open";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "ip_geolocation";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "ipv6";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "max_upload";
      value:
        | "100"
        | "125"
        | "150"
        | "175"
        | "200"
        | "225"
        | "250"
        | "275"
        | "300"
        | "325"
        | "350"
        | "375"
        | "400"
        | "425"
        | "450"
        | "475"
        | "500"
        | "1000";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "min_tls_version";
      value: "1.0" | "1.1" | "1.2" | "1.3";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "mirage";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "nel";
      value: { enabled?: boolean };
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "opportunistic_encryption";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "opportunistic_onion";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "orange_to_orange";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "origin_error_page_pass_thru";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | { id: "origin_h2_max_streams"; modifiedOn?: string | null; value?: number }
  | {
      id: "origin_max_http_version";
      modifiedOn?: string | null;
      value?: "2" | "1";
    }
  | {
      id: "polish";
      value: "off" | "lossless" | "lossy";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "prefetch_preload";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "privacy_pass";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "proxy_read_timeout";
      value: number;
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "pseudo_ipv4";
      value: "off" | "add_header" | "overwrite_header";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "replace_insecure_js";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "response_buffering";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "rocket_loader";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "automatic_platform_optimization";
      value: unknown;
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "security_header";
      value: {
        strictTransportSecurity?: {
          enabled?: boolean;
          includeSubdomains?: boolean;
          maxAge?: number;
          nosniff?: boolean;
          preload?: boolean;
        };
      };
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "security_level";
      value:
        | "off"
        | "essentially_off"
        | "low"
        | "medium"
        | "high"
        | "under_attack";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "server_side_exclude";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "sha1_support";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "sort_query_string_for_cache";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "ssl";
      value: "off" | "flexible" | "full" | "strict";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | { id?: "ssl_recommender"; enabled?: boolean }
  | {
      id: "tls_1_2_only";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "tls_1_3";
      value: "on" | "off" | "zrt";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "tls_client_auth";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "transformations";
      value: "on" | "off" | "open";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "transformations_allowed_origins";
      value: string;
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "true_client_ip_header";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "waf";
      value: "on" | "off";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "webp";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    }
  | {
      id: "websockets";
      value: "off" | "on";
      editable?: true | false;
      modifiedOn?: string | null;
    };

export const PatchSettingResponse = Schema.Union(
  Schema.Struct({
    id: Schema.Literal("0rtt"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("advanced_ddos"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("aegis"),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
    value: Schema.optional(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        poolId: Schema.optional(Schema.String).pipe(T.JsonName("pool_id")),
      }),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("always_online"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("always_use_https"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("automatic_https_rewrites"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("brotli"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("browser_cache_ttl"),
    value: Schema.Number,
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("browser_check"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("cache_level"),
    value: Schema.Literal("aggressive", "basic", "simplified"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("challenge_ttl"),
    value: Schema.Literal(
      "300",
      "900",
      "1800",
      "2700",
      "3600",
      "7200",
      "10800",
      "14400",
      "28800",
      "57600",
      "86400",
      "604800",
      "2592000",
      "31536000",
    ),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("china_network_enabled"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("ciphers"),
    value: Schema.Array(Schema.String),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("cname_flattening"),
    value: Schema.Literal("flatten_at_root", "flatten_all"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("development_mode"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
    timeRemaining: Schema.optional(Schema.Number).pipe(
      T.JsonName("time_remaining"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("early_hints"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("edge_cache_ttl"),
    value: Schema.Literal(
      "30",
      "60",
      "300",
      "1200",
      "1800",
      "3600",
      "7200",
      "10800",
      "14400",
      "18000",
      "28800",
      "43200",
      "57600",
      "72000",
      "86400",
      "172800",
      "259200",
      "345600",
      "432000",
      "518400",
      "604800",
    ),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("email_obfuscation"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("h2_prioritization"),
    value: Schema.Literal("on", "off", "custom"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("hotlink_protection"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("http2"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("http3"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("image_resizing"),
    value: Schema.Literal("on", "off", "open"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("ip_geolocation"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("ipv6"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("max_upload"),
    value: Schema.Literal(
      "100",
      "125",
      "150",
      "175",
      "200",
      "225",
      "250",
      "275",
      "300",
      "325",
      "350",
      "375",
      "400",
      "425",
      "450",
      "475",
      "500",
      "1000",
    ),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("min_tls_version"),
    value: Schema.Literal("1.0", "1.1", "1.2", "1.3"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("mirage"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("nel"),
    value: Schema.Struct({
      enabled: Schema.optional(Schema.Boolean),
    }),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("opportunistic_encryption"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("opportunistic_onion"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("orange_to_orange"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("origin_error_page_pass_thru"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("origin_h2_max_streams"),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
    value: Schema.optional(Schema.Number),
  }),
  Schema.Struct({
    id: Schema.Literal("origin_max_http_version"),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
    value: Schema.optional(Schema.Literal("2", "1")),
  }),
  Schema.Struct({
    id: Schema.Literal("polish"),
    value: Schema.Literal("off", "lossless", "lossy"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("prefetch_preload"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("privacy_pass"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("proxy_read_timeout"),
    value: Schema.Number,
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("pseudo_ipv4"),
    value: Schema.Literal("off", "add_header", "overwrite_header"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("replace_insecure_js"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("response_buffering"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("rocket_loader"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("automatic_platform_optimization"),
    value: Schema.Unknown,
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("security_header"),
    value: Schema.Struct({
      strictTransportSecurity: Schema.optional(
        Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          includeSubdomains: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("include_subdomains"),
          ),
          maxAge: Schema.optional(Schema.Number).pipe(T.JsonName("max_age")),
          nosniff: Schema.optional(Schema.Boolean),
          preload: Schema.optional(Schema.Boolean),
        }),
      ).pipe(T.JsonName("strict_transport_security")),
    }),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("security_level"),
    value: Schema.Literal(
      "off",
      "essentially_off",
      "low",
      "medium",
      "high",
      "under_attack",
    ),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("server_side_exclude"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("sha1_support"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("sort_query_string_for_cache"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("ssl"),
    value: Schema.Literal("off", "flexible", "full", "strict"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.optional(Schema.Literal("ssl_recommender")),
    enabled: Schema.optional(Schema.Boolean),
  }),
  Schema.Struct({
    id: Schema.Literal("tls_1_2_only"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("tls_1_3"),
    value: Schema.Literal("on", "off", "zrt"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("tls_client_auth"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("transformations"),
    value: Schema.Literal("on", "off", "open"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("transformations_allowed_origins"),
    value: Schema.String,
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("true_client_ip_header"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("waf"),
    value: Schema.Literal("on", "off"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("webp"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.Literal("websockets"),
    value: Schema.Literal("off", "on"),
    editable: Schema.optional(Schema.Literal(true, false)),
    modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("modified_on"),
    ),
  }),
) as unknown as Schema.Schema<PatchSettingResponse>;

export const patchSetting: (
  input: PatchSettingRequest,
) => Effect.Effect<
  PatchSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchSettingRequest,
  output: PatchSettingResponse,
  errors: [],
}));

// =============================================================================
// Subscription
// =============================================================================

export interface GetSubscriptionRequest {
  /** Subscription identifier tag. */
  zoneId: string;
}

export const GetSubscriptionRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/subscription" }),
) as unknown as Schema.Schema<GetSubscriptionRequest>;

export type GetSubscriptionResponse = unknown;

export const GetSubscriptionResponse =
  Schema.Unknown as unknown as Schema.Schema<GetSubscriptionResponse>;

export const getSubscription: (
  input: GetSubscriptionRequest,
) => Effect.Effect<
  GetSubscriptionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSubscriptionRequest,
  output: GetSubscriptionResponse,
  errors: [],
}));

export interface CreateSubscriptionRequest {
  /** Path param: Subscription identifier tag. */
  zoneId: string;
  /** Body param: How often the subscription is renewed automatically. */
  frequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  /** Body param: The rate plan applied to the subscription. */
  ratePlan?: unknown;
}

export const CreateSubscriptionRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  frequency: Schema.optional(
    Schema.Literal("weekly", "monthly", "quarterly", "yearly"),
  ),
  ratePlan: Schema.optional(Schema.Unknown).pipe(T.JsonName("rate_plan")),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/subscription" }),
) as unknown as Schema.Schema<CreateSubscriptionRequest>;

export type CreateSubscriptionResponse = unknown;

export const CreateSubscriptionResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateSubscriptionResponse>;

export const createSubscription: (
  input: CreateSubscriptionRequest,
) => Effect.Effect<
  CreateSubscriptionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateSubscriptionRequest,
  output: CreateSubscriptionResponse,
  errors: [],
}));

export interface UpdateSubscriptionRequest {
  /** Path param: Subscription identifier tag. */
  zoneId: string;
  /** Body param: How often the subscription is renewed automatically. */
  frequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  /** Body param: The rate plan applied to the subscription. */
  ratePlan?: unknown;
}

export const UpdateSubscriptionRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  frequency: Schema.optional(
    Schema.Literal("weekly", "monthly", "quarterly", "yearly"),
  ),
  ratePlan: Schema.optional(Schema.Unknown).pipe(T.JsonName("rate_plan")),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/subscription" }),
) as unknown as Schema.Schema<UpdateSubscriptionRequest>;

export type UpdateSubscriptionResponse = unknown;

export const UpdateSubscriptionResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateSubscriptionResponse>;

export const updateSubscription: (
  input: UpdateSubscriptionRequest,
) => Effect.Effect<
  UpdateSubscriptionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateSubscriptionRequest,
  output: UpdateSubscriptionResponse,
  errors: [],
}));

// =============================================================================
// Zone
// =============================================================================

export interface GetZoneRequest {
  /** Identifier */
  zoneId: string;
}

export const GetZoneRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}" }),
) as unknown as Schema.Schema<GetZoneRequest>;

export interface GetZoneResponse {
  /** Identifier */
  id: string;
  /** The account the zone belongs to. */
  account: { id?: string; name?: string };
  /** The last time proof of ownership was detected and the zone was made active. */
  activatedOn: string | null;
  /** When the zone was created. */
  createdOn: string;
  /** The interval (in seconds) from when development mode expires (positive integer) or last expired (negative integer) for the domain. If development mode has never been enabled, this value is 0. */
  developmentMode: number;
  /** Metadata about the zone. */
  meta: {
    cdnOnly?: boolean;
    customCertificateQuota?: number;
    dnsOnly?: boolean;
    foundationDns?: boolean;
    pageRuleQuota?: number;
    phishingDetected?: boolean;
    step?: number;
  };
  /** When the zone was last modified. */
  modifiedOn: string;
  /** The domain name. */
  name: string;
  /** The name servers Cloudflare assigns to a zone. */
  nameServers: string[];
  /** DNS host at the time of switching to Cloudflare. */
  originalDnshost: string | null;
  /** Original name servers before moving to Cloudflare. */
  originalNameServers: string[] | null;
  /** Registrar for the domain at the time of switching to Cloudflare. */
  originalRegistrar: string | null;
  /** The owner of the zone. */
  owner: { id?: string; name?: string; type?: string };
  /** @deprecated Please use the `/zones/{zone_id}/subscription` API to update a zone's plan. Changing this value will create/cancel associated subscriptions. To view available plans for this zone, see [Zon */
  plan: {
    id?: string;
    canSubscribe?: boolean;
    currency?: string;
    externallyManaged?: boolean;
    frequency?: string;
    isSubscribed?: boolean;
    legacyDiscount?: boolean;
    legacyId?: string;
    name?: string;
    price?: number;
  };
  /** Allows the customer to use a custom apex. _Tenants Only Configuration_. */
  cnameSuffix?: string;
  /** Indicates whether the zone is only using Cloudflare DNS services. A true value means the zone will not receive security or performance benefits. */
  paused?: boolean;
  /** @deprecated This has been replaced by Account memberships. */
  permissions?: string[];
  /** The zone status on Cloudflare. */
  status?: "initializing" | "pending" | "active" | "moved";
  /** The root organizational unit that this zone belongs to (such as a tenant or organization). */
  tenant?: { id?: string; name?: string };
  /** The immediate parent organizational unit that this zone belongs to (such as under a tenant or sub-organization). */
  tenantUnit?: { id?: string };
  /** A full zone implies that DNS is hosted with Cloudflare. A partial zone is typically a partner-hosted zone or a CNAME setup. */
  type?: "full" | "partial" | "secondary" | "internal";
  /** An array of domains used for custom name servers. This is only available for Business and Enterprise plans. */
  vanityNameServers?: string[];
  /** Verification key for partial zone setup. */
  verificationKey?: string;
}

export const GetZoneResponse = Schema.Struct({
  id: Schema.String,
  account: Schema.Struct({
    id: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
  }),
  activatedOn: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("activated_on"),
  ),
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  developmentMode: Schema.Number.pipe(T.JsonName("development_mode")),
  meta: Schema.Struct({
    cdnOnly: Schema.optional(Schema.Boolean).pipe(T.JsonName("cdn_only")),
    customCertificateQuota: Schema.optional(Schema.Number).pipe(
      T.JsonName("custom_certificate_quota"),
    ),
    dnsOnly: Schema.optional(Schema.Boolean).pipe(T.JsonName("dns_only")),
    foundationDns: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("foundation_dns"),
    ),
    pageRuleQuota: Schema.optional(Schema.Number).pipe(
      T.JsonName("page_rule_quota"),
    ),
    phishingDetected: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("phishing_detected"),
    ),
    step: Schema.optional(Schema.Number),
  }),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  nameServers: Schema.Array(Schema.String).pipe(T.JsonName("name_servers")),
  originalDnshost: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("original_dnshost"),
  ),
  originalNameServers: Schema.Union(
    Schema.Array(Schema.String),
    Schema.Null,
  ).pipe(T.JsonName("original_name_servers")),
  originalRegistrar: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("original_registrar"),
  ),
  owner: Schema.Struct({
    id: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
    type: Schema.optional(Schema.String),
  }),
  plan: Schema.Struct({
    id: Schema.optional(Schema.String),
    canSubscribe: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("can_subscribe"),
    ),
    currency: Schema.optional(Schema.String),
    externallyManaged: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("externally_managed"),
    ),
    frequency: Schema.optional(Schema.String),
    isSubscribed: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("is_subscribed"),
    ),
    legacyDiscount: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("legacy_discount"),
    ),
    legacyId: Schema.optional(Schema.String).pipe(T.JsonName("legacy_id")),
    name: Schema.optional(Schema.String),
    price: Schema.optional(Schema.Number),
  }),
  cnameSuffix: Schema.optional(Schema.String).pipe(T.JsonName("cname_suffix")),
  paused: Schema.optional(Schema.Boolean),
  permissions: Schema.optional(Schema.Array(Schema.String)),
  status: Schema.optional(
    Schema.Literal("initializing", "pending", "active", "moved"),
  ),
  tenant: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      name: Schema.optional(Schema.String),
    }),
  ),
  tenantUnit: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("tenant_unit")),
  type: Schema.optional(
    Schema.Literal("full", "partial", "secondary", "internal"),
  ),
  vanityNameServers: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("vanity_name_servers"),
  ),
  verificationKey: Schema.optional(Schema.String).pipe(
    T.JsonName("verification_key"),
  ),
}) as unknown as Schema.Schema<GetZoneResponse>;

export const getZone: (
  input: GetZoneRequest,
) => Effect.Effect<
  GetZoneResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetZoneRequest,
  output: GetZoneResponse,
  errors: [],
}));

export interface CreateZoneRequest {
  account: { id?: string };
  /** The domain name. */
  name: string;
  /** A full zone implies that DNS is hosted with Cloudflare. A partial zone is typically a partner-hosted zone or a CNAME setup. */
  type?: "full" | "partial" | "secondary" | "internal";
}

export const CreateZoneRequest = Schema.Struct({
  account: Schema.Struct({
    id: Schema.optional(Schema.String),
  }),
  name: Schema.String,
  type: Schema.optional(
    Schema.Literal("full", "partial", "secondary", "internal"),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/zones" }),
) as unknown as Schema.Schema<CreateZoneRequest>;

export interface CreateZoneResponse {
  /** Identifier */
  id: string;
  /** The account the zone belongs to. */
  account: { id?: string; name?: string };
  /** The last time proof of ownership was detected and the zone was made active. */
  activatedOn: string | null;
  /** When the zone was created. */
  createdOn: string;
  /** The interval (in seconds) from when development mode expires (positive integer) or last expired (negative integer) for the domain. If development mode has never been enabled, this value is 0. */
  developmentMode: number;
  /** Metadata about the zone. */
  meta: {
    cdnOnly?: boolean;
    customCertificateQuota?: number;
    dnsOnly?: boolean;
    foundationDns?: boolean;
    pageRuleQuota?: number;
    phishingDetected?: boolean;
    step?: number;
  };
  /** When the zone was last modified. */
  modifiedOn: string;
  /** The domain name. */
  name: string;
  /** The name servers Cloudflare assigns to a zone. */
  nameServers: string[];
  /** DNS host at the time of switching to Cloudflare. */
  originalDnshost: string | null;
  /** Original name servers before moving to Cloudflare. */
  originalNameServers: string[] | null;
  /** Registrar for the domain at the time of switching to Cloudflare. */
  originalRegistrar: string | null;
  /** The owner of the zone. */
  owner: { id?: string; name?: string; type?: string };
  /** @deprecated Please use the `/zones/{zone_id}/subscription` API to update a zone's plan. Changing this value will create/cancel associated subscriptions. To view available plans for this zone, see [Zon */
  plan: {
    id?: string;
    canSubscribe?: boolean;
    currency?: string;
    externallyManaged?: boolean;
    frequency?: string;
    isSubscribed?: boolean;
    legacyDiscount?: boolean;
    legacyId?: string;
    name?: string;
    price?: number;
  };
  /** Allows the customer to use a custom apex. _Tenants Only Configuration_. */
  cnameSuffix?: string;
  /** Indicates whether the zone is only using Cloudflare DNS services. A true value means the zone will not receive security or performance benefits. */
  paused?: boolean;
  /** @deprecated This has been replaced by Account memberships. */
  permissions?: string[];
  /** The zone status on Cloudflare. */
  status?: "initializing" | "pending" | "active" | "moved";
  /** The root organizational unit that this zone belongs to (such as a tenant or organization). */
  tenant?: { id?: string; name?: string };
  /** The immediate parent organizational unit that this zone belongs to (such as under a tenant or sub-organization). */
  tenantUnit?: { id?: string };
  /** A full zone implies that DNS is hosted with Cloudflare. A partial zone is typically a partner-hosted zone or a CNAME setup. */
  type?: "full" | "partial" | "secondary" | "internal";
  /** An array of domains used for custom name servers. This is only available for Business and Enterprise plans. */
  vanityNameServers?: string[];
  /** Verification key for partial zone setup. */
  verificationKey?: string;
}

export const CreateZoneResponse = Schema.Struct({
  id: Schema.String,
  account: Schema.Struct({
    id: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
  }),
  activatedOn: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("activated_on"),
  ),
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  developmentMode: Schema.Number.pipe(T.JsonName("development_mode")),
  meta: Schema.Struct({
    cdnOnly: Schema.optional(Schema.Boolean).pipe(T.JsonName("cdn_only")),
    customCertificateQuota: Schema.optional(Schema.Number).pipe(
      T.JsonName("custom_certificate_quota"),
    ),
    dnsOnly: Schema.optional(Schema.Boolean).pipe(T.JsonName("dns_only")),
    foundationDns: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("foundation_dns"),
    ),
    pageRuleQuota: Schema.optional(Schema.Number).pipe(
      T.JsonName("page_rule_quota"),
    ),
    phishingDetected: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("phishing_detected"),
    ),
    step: Schema.optional(Schema.Number),
  }),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  nameServers: Schema.Array(Schema.String).pipe(T.JsonName("name_servers")),
  originalDnshost: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("original_dnshost"),
  ),
  originalNameServers: Schema.Union(
    Schema.Array(Schema.String),
    Schema.Null,
  ).pipe(T.JsonName("original_name_servers")),
  originalRegistrar: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("original_registrar"),
  ),
  owner: Schema.Struct({
    id: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
    type: Schema.optional(Schema.String),
  }),
  plan: Schema.Struct({
    id: Schema.optional(Schema.String),
    canSubscribe: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("can_subscribe"),
    ),
    currency: Schema.optional(Schema.String),
    externallyManaged: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("externally_managed"),
    ),
    frequency: Schema.optional(Schema.String),
    isSubscribed: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("is_subscribed"),
    ),
    legacyDiscount: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("legacy_discount"),
    ),
    legacyId: Schema.optional(Schema.String).pipe(T.JsonName("legacy_id")),
    name: Schema.optional(Schema.String),
    price: Schema.optional(Schema.Number),
  }),
  cnameSuffix: Schema.optional(Schema.String).pipe(T.JsonName("cname_suffix")),
  paused: Schema.optional(Schema.Boolean),
  permissions: Schema.optional(Schema.Array(Schema.String)),
  status: Schema.optional(
    Schema.Literal("initializing", "pending", "active", "moved"),
  ),
  tenant: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      name: Schema.optional(Schema.String),
    }),
  ),
  tenantUnit: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("tenant_unit")),
  type: Schema.optional(
    Schema.Literal("full", "partial", "secondary", "internal"),
  ),
  vanityNameServers: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("vanity_name_servers"),
  ),
  verificationKey: Schema.optional(Schema.String).pipe(
    T.JsonName("verification_key"),
  ),
}) as unknown as Schema.Schema<CreateZoneResponse>;

export const createZone: (
  input: CreateZoneRequest,
) => Effect.Effect<
  CreateZoneResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateZoneRequest,
  output: CreateZoneResponse,
  errors: [],
}));

export interface PatchZoneRequest {
  /** Path param: Identifier */
  zoneId: string;
  /** Body param: Indicates whether the zone is only using Cloudflare DNS services. A true value means the zone will not receive security or performance benefits. */
  paused?: boolean;
  /** Body param: A full zone implies that DNS is hosted with Cloudflare. A partial zone is typically a partner-hosted zone or a CNAME setup. This parameter is only available to Enterprise customers or if i */
  type?: "full" | "partial" | "secondary" | "internal";
  /** Body param: An array of domains used for custom name servers. This is only available for Business and Enterprise plans. */
  vanityNameServers?: string[];
}

export const PatchZoneRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  paused: Schema.optional(Schema.Boolean),
  type: Schema.optional(
    Schema.Literal("full", "partial", "secondary", "internal"),
  ),
  vanityNameServers: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("vanity_name_servers"),
  ),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}" }),
) as unknown as Schema.Schema<PatchZoneRequest>;

export interface PatchZoneResponse {
  /** Identifier */
  id: string;
  /** The account the zone belongs to. */
  account: { id?: string; name?: string };
  /** The last time proof of ownership was detected and the zone was made active. */
  activatedOn: string | null;
  /** When the zone was created. */
  createdOn: string;
  /** The interval (in seconds) from when development mode expires (positive integer) or last expired (negative integer) for the domain. If development mode has never been enabled, this value is 0. */
  developmentMode: number;
  /** Metadata about the zone. */
  meta: {
    cdnOnly?: boolean;
    customCertificateQuota?: number;
    dnsOnly?: boolean;
    foundationDns?: boolean;
    pageRuleQuota?: number;
    phishingDetected?: boolean;
    step?: number;
  };
  /** When the zone was last modified. */
  modifiedOn: string;
  /** The domain name. */
  name: string;
  /** The name servers Cloudflare assigns to a zone. */
  nameServers: string[];
  /** DNS host at the time of switching to Cloudflare. */
  originalDnshost: string | null;
  /** Original name servers before moving to Cloudflare. */
  originalNameServers: string[] | null;
  /** Registrar for the domain at the time of switching to Cloudflare. */
  originalRegistrar: string | null;
  /** The owner of the zone. */
  owner: { id?: string; name?: string; type?: string };
  /** @deprecated Please use the `/zones/{zone_id}/subscription` API to update a zone's plan. Changing this value will create/cancel associated subscriptions. To view available plans for this zone, see [Zon */
  plan: {
    id?: string;
    canSubscribe?: boolean;
    currency?: string;
    externallyManaged?: boolean;
    frequency?: string;
    isSubscribed?: boolean;
    legacyDiscount?: boolean;
    legacyId?: string;
    name?: string;
    price?: number;
  };
  /** Allows the customer to use a custom apex. _Tenants Only Configuration_. */
  cnameSuffix?: string;
  /** Indicates whether the zone is only using Cloudflare DNS services. A true value means the zone will not receive security or performance benefits. */
  paused?: boolean;
  /** @deprecated This has been replaced by Account memberships. */
  permissions?: string[];
  /** The zone status on Cloudflare. */
  status?: "initializing" | "pending" | "active" | "moved";
  /** The root organizational unit that this zone belongs to (such as a tenant or organization). */
  tenant?: { id?: string; name?: string };
  /** The immediate parent organizational unit that this zone belongs to (such as under a tenant or sub-organization). */
  tenantUnit?: { id?: string };
  /** A full zone implies that DNS is hosted with Cloudflare. A partial zone is typically a partner-hosted zone or a CNAME setup. */
  type?: "full" | "partial" | "secondary" | "internal";
  /** An array of domains used for custom name servers. This is only available for Business and Enterprise plans. */
  vanityNameServers?: string[];
  /** Verification key for partial zone setup. */
  verificationKey?: string;
}

export const PatchZoneResponse = Schema.Struct({
  id: Schema.String,
  account: Schema.Struct({
    id: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
  }),
  activatedOn: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("activated_on"),
  ),
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  developmentMode: Schema.Number.pipe(T.JsonName("development_mode")),
  meta: Schema.Struct({
    cdnOnly: Schema.optional(Schema.Boolean).pipe(T.JsonName("cdn_only")),
    customCertificateQuota: Schema.optional(Schema.Number).pipe(
      T.JsonName("custom_certificate_quota"),
    ),
    dnsOnly: Schema.optional(Schema.Boolean).pipe(T.JsonName("dns_only")),
    foundationDns: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("foundation_dns"),
    ),
    pageRuleQuota: Schema.optional(Schema.Number).pipe(
      T.JsonName("page_rule_quota"),
    ),
    phishingDetected: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("phishing_detected"),
    ),
    step: Schema.optional(Schema.Number),
  }),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  nameServers: Schema.Array(Schema.String).pipe(T.JsonName("name_servers")),
  originalDnshost: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("original_dnshost"),
  ),
  originalNameServers: Schema.Union(
    Schema.Array(Schema.String),
    Schema.Null,
  ).pipe(T.JsonName("original_name_servers")),
  originalRegistrar: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("original_registrar"),
  ),
  owner: Schema.Struct({
    id: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
    type: Schema.optional(Schema.String),
  }),
  plan: Schema.Struct({
    id: Schema.optional(Schema.String),
    canSubscribe: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("can_subscribe"),
    ),
    currency: Schema.optional(Schema.String),
    externallyManaged: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("externally_managed"),
    ),
    frequency: Schema.optional(Schema.String),
    isSubscribed: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("is_subscribed"),
    ),
    legacyDiscount: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("legacy_discount"),
    ),
    legacyId: Schema.optional(Schema.String).pipe(T.JsonName("legacy_id")),
    name: Schema.optional(Schema.String),
    price: Schema.optional(Schema.Number),
  }),
  cnameSuffix: Schema.optional(Schema.String).pipe(T.JsonName("cname_suffix")),
  paused: Schema.optional(Schema.Boolean),
  permissions: Schema.optional(Schema.Array(Schema.String)),
  status: Schema.optional(
    Schema.Literal("initializing", "pending", "active", "moved"),
  ),
  tenant: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      name: Schema.optional(Schema.String),
    }),
  ),
  tenantUnit: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("tenant_unit")),
  type: Schema.optional(
    Schema.Literal("full", "partial", "secondary", "internal"),
  ),
  vanityNameServers: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("vanity_name_servers"),
  ),
  verificationKey: Schema.optional(Schema.String).pipe(
    T.JsonName("verification_key"),
  ),
}) as unknown as Schema.Schema<PatchZoneResponse>;

export const patchZone: (
  input: PatchZoneRequest,
) => Effect.Effect<
  PatchZoneResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchZoneRequest,
  output: PatchZoneResponse,
  errors: [],
}));

export interface DeleteZoneRequest {
  /** Identifier */
  zoneId: string;
}

export const DeleteZoneRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}" }),
) as unknown as Schema.Schema<DeleteZoneRequest>;

export type DeleteZoneResponse = unknown;

export const DeleteZoneResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteZoneResponse>;

export const deleteZone: (
  input: DeleteZoneRequest,
) => Effect.Effect<
  DeleteZoneResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteZoneRequest,
  output: DeleteZoneResponse,
  errors: [],
}));
