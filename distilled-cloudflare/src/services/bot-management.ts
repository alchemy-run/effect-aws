/**
 * Cloudflare BOT-MANAGEMENT API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service bot-management
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
// BotManagement
// =============================================================================

export interface GetBotManagementRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetBotManagementRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/bot_management" }),
) as unknown as Schema.Schema<GetBotManagementRequest>;

export type GetBotManagementResponse =
  | {
      zoneId: string;
      aiBotsProtection?: "block" | "disabled" | "only_on_ad_pages";
      cfRobotsVariant?: "off" | "policy_only";
      crawlerProtection?: "enabled" | "disabled";
      enableJs?: boolean;
      fightMode?: boolean;
      isRobotsTxtManaged?: boolean;
    }
  | {
      zoneId: string;
      aiBotsProtection?: "block" | "disabled" | "only_on_ad_pages";
      cfRobotsVariant?: "off" | "policy_only";
      crawlerProtection?: "enabled" | "disabled";
      enableJs?: boolean;
      isRobotsTxtManaged?: boolean;
      optimizeWordpress?: boolean;
      sbfmDefinitelyAutomated?: "allow" | "block" | "managed_challenge";
      sbfmStaticResourceProtection?: boolean;
      sbfmVerifiedBots?: "allow" | "block";
    }
  | {
      zoneId: string;
      aiBotsProtection?: "block" | "disabled" | "only_on_ad_pages";
      cfRobotsVariant?: "off" | "policy_only";
      crawlerProtection?: "enabled" | "disabled";
      enableJs?: boolean;
      isRobotsTxtManaged?: boolean;
      optimizeWordpress?: boolean;
      sbfmDefinitelyAutomated?: "allow" | "block" | "managed_challenge";
      sbfmLikelyAutomated?: "allow" | "block" | "managed_challenge";
      sbfmStaticResourceProtection?: boolean;
      sbfmVerifiedBots?: "allow" | "block";
    }
  | {
      zoneId: string;
      aiBotsProtection?: "block" | "disabled" | "only_on_ad_pages";
      autoUpdateModel?: boolean;
      bmCookieEnabled?: boolean;
      cfRobotsVariant?: "off" | "policy_only";
      crawlerProtection?: "enabled" | "disabled";
      enableJs?: boolean;
      isRobotsTxtManaged?: boolean;
      suppressSessionScore?: boolean;
    };

export const GetBotManagementResponse = Schema.Union(
  Schema.Struct({
    zoneId: Schema.String.pipe(T.JsonName("zone_id")),
    aiBotsProtection: Schema.optional(
      Schema.Literal("block", "disabled", "only_on_ad_pages"),
    ).pipe(T.JsonName("ai_bots_protection")),
    cfRobotsVariant: Schema.optional(Schema.Literal("off", "policy_only")).pipe(
      T.JsonName("cf_robots_variant"),
    ),
    crawlerProtection: Schema.optional(
      Schema.Literal("enabled", "disabled"),
    ).pipe(T.JsonName("crawler_protection")),
    enableJs: Schema.optional(Schema.Boolean).pipe(T.JsonName("enable_js")),
    fightMode: Schema.optional(Schema.Boolean).pipe(T.JsonName("fight_mode")),
    isRobotsTxtManaged: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("is_robots_txt_managed"),
    ),
  }),
  Schema.Struct({
    zoneId: Schema.String.pipe(T.JsonName("zone_id")),
    aiBotsProtection: Schema.optional(
      Schema.Literal("block", "disabled", "only_on_ad_pages"),
    ).pipe(T.JsonName("ai_bots_protection")),
    cfRobotsVariant: Schema.optional(Schema.Literal("off", "policy_only")).pipe(
      T.JsonName("cf_robots_variant"),
    ),
    crawlerProtection: Schema.optional(
      Schema.Literal("enabled", "disabled"),
    ).pipe(T.JsonName("crawler_protection")),
    enableJs: Schema.optional(Schema.Boolean).pipe(T.JsonName("enable_js")),
    isRobotsTxtManaged: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("is_robots_txt_managed"),
    ),
    optimizeWordpress: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("optimize_wordpress"),
    ),
    sbfmDefinitelyAutomated: Schema.optional(
      Schema.Literal("allow", "block", "managed_challenge"),
    ).pipe(T.JsonName("sbfm_definitely_automated")),
    sbfmStaticResourceProtection: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("sbfm_static_resource_protection"),
    ),
    sbfmVerifiedBots: Schema.optional(Schema.Literal("allow", "block")).pipe(
      T.JsonName("sbfm_verified_bots"),
    ),
  }),
  Schema.Struct({
    zoneId: Schema.String.pipe(T.JsonName("zone_id")),
    aiBotsProtection: Schema.optional(
      Schema.Literal("block", "disabled", "only_on_ad_pages"),
    ).pipe(T.JsonName("ai_bots_protection")),
    cfRobotsVariant: Schema.optional(Schema.Literal("off", "policy_only")).pipe(
      T.JsonName("cf_robots_variant"),
    ),
    crawlerProtection: Schema.optional(
      Schema.Literal("enabled", "disabled"),
    ).pipe(T.JsonName("crawler_protection")),
    enableJs: Schema.optional(Schema.Boolean).pipe(T.JsonName("enable_js")),
    isRobotsTxtManaged: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("is_robots_txt_managed"),
    ),
    optimizeWordpress: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("optimize_wordpress"),
    ),
    sbfmDefinitelyAutomated: Schema.optional(
      Schema.Literal("allow", "block", "managed_challenge"),
    ).pipe(T.JsonName("sbfm_definitely_automated")),
    sbfmLikelyAutomated: Schema.optional(
      Schema.Literal("allow", "block", "managed_challenge"),
    ).pipe(T.JsonName("sbfm_likely_automated")),
    sbfmStaticResourceProtection: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("sbfm_static_resource_protection"),
    ),
    sbfmVerifiedBots: Schema.optional(Schema.Literal("allow", "block")).pipe(
      T.JsonName("sbfm_verified_bots"),
    ),
  }),
  Schema.Struct({
    zoneId: Schema.String.pipe(T.JsonName("zone_id")),
    aiBotsProtection: Schema.optional(
      Schema.Literal("block", "disabled", "only_on_ad_pages"),
    ).pipe(T.JsonName("ai_bots_protection")),
    autoUpdateModel: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_update_model"),
    ),
    bmCookieEnabled: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("bm_cookie_enabled"),
    ),
    cfRobotsVariant: Schema.optional(Schema.Literal("off", "policy_only")).pipe(
      T.JsonName("cf_robots_variant"),
    ),
    crawlerProtection: Schema.optional(
      Schema.Literal("enabled", "disabled"),
    ).pipe(T.JsonName("crawler_protection")),
    enableJs: Schema.optional(Schema.Boolean).pipe(T.JsonName("enable_js")),
    isRobotsTxtManaged: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("is_robots_txt_managed"),
    ),
    suppressSessionScore: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("suppress_session_score"),
    ),
  }),
) as unknown as Schema.Schema<GetBotManagementResponse>;

export const getBotManagement: (
  input: GetBotManagementRequest,
) => Effect.Effect<
  GetBotManagementResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetBotManagementRequest,
  output: GetBotManagementResponse,
  errors: [],
}));

export interface PutBotManagementRequest {}

export const PutBotManagementRequest = Schema.Struct({}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/bot_management" }),
) as unknown as Schema.Schema<PutBotManagementRequest>;

export type PutBotManagementResponse =
  | {
      zoneId: string;
      aiBotsProtection?: "block" | "disabled" | "only_on_ad_pages";
      cfRobotsVariant?: "off" | "policy_only";
      crawlerProtection?: "enabled" | "disabled";
      enableJs?: boolean;
      fightMode?: boolean;
      isRobotsTxtManaged?: boolean;
    }
  | {
      zoneId: string;
      aiBotsProtection?: "block" | "disabled" | "only_on_ad_pages";
      cfRobotsVariant?: "off" | "policy_only";
      crawlerProtection?: "enabled" | "disabled";
      enableJs?: boolean;
      isRobotsTxtManaged?: boolean;
      optimizeWordpress?: boolean;
      sbfmDefinitelyAutomated?: "allow" | "block" | "managed_challenge";
      sbfmStaticResourceProtection?: boolean;
      sbfmVerifiedBots?: "allow" | "block";
    }
  | {
      zoneId: string;
      aiBotsProtection?: "block" | "disabled" | "only_on_ad_pages";
      cfRobotsVariant?: "off" | "policy_only";
      crawlerProtection?: "enabled" | "disabled";
      enableJs?: boolean;
      isRobotsTxtManaged?: boolean;
      optimizeWordpress?: boolean;
      sbfmDefinitelyAutomated?: "allow" | "block" | "managed_challenge";
      sbfmLikelyAutomated?: "allow" | "block" | "managed_challenge";
      sbfmStaticResourceProtection?: boolean;
      sbfmVerifiedBots?: "allow" | "block";
    }
  | {
      zoneId: string;
      aiBotsProtection?: "block" | "disabled" | "only_on_ad_pages";
      autoUpdateModel?: boolean;
      bmCookieEnabled?: boolean;
      cfRobotsVariant?: "off" | "policy_only";
      crawlerProtection?: "enabled" | "disabled";
      enableJs?: boolean;
      isRobotsTxtManaged?: boolean;
      suppressSessionScore?: boolean;
    };

export const PutBotManagementResponse = Schema.Union(
  Schema.Struct({
    zoneId: Schema.String.pipe(T.JsonName("zone_id")),
    aiBotsProtection: Schema.optional(
      Schema.Literal("block", "disabled", "only_on_ad_pages"),
    ).pipe(T.JsonName("ai_bots_protection")),
    cfRobotsVariant: Schema.optional(Schema.Literal("off", "policy_only")).pipe(
      T.JsonName("cf_robots_variant"),
    ),
    crawlerProtection: Schema.optional(
      Schema.Literal("enabled", "disabled"),
    ).pipe(T.JsonName("crawler_protection")),
    enableJs: Schema.optional(Schema.Boolean).pipe(T.JsonName("enable_js")),
    fightMode: Schema.optional(Schema.Boolean).pipe(T.JsonName("fight_mode")),
    isRobotsTxtManaged: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("is_robots_txt_managed"),
    ),
  }),
  Schema.Struct({
    zoneId: Schema.String.pipe(T.JsonName("zone_id")),
    aiBotsProtection: Schema.optional(
      Schema.Literal("block", "disabled", "only_on_ad_pages"),
    ).pipe(T.JsonName("ai_bots_protection")),
    cfRobotsVariant: Schema.optional(Schema.Literal("off", "policy_only")).pipe(
      T.JsonName("cf_robots_variant"),
    ),
    crawlerProtection: Schema.optional(
      Schema.Literal("enabled", "disabled"),
    ).pipe(T.JsonName("crawler_protection")),
    enableJs: Schema.optional(Schema.Boolean).pipe(T.JsonName("enable_js")),
    isRobotsTxtManaged: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("is_robots_txt_managed"),
    ),
    optimizeWordpress: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("optimize_wordpress"),
    ),
    sbfmDefinitelyAutomated: Schema.optional(
      Schema.Literal("allow", "block", "managed_challenge"),
    ).pipe(T.JsonName("sbfm_definitely_automated")),
    sbfmStaticResourceProtection: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("sbfm_static_resource_protection"),
    ),
    sbfmVerifiedBots: Schema.optional(Schema.Literal("allow", "block")).pipe(
      T.JsonName("sbfm_verified_bots"),
    ),
  }),
  Schema.Struct({
    zoneId: Schema.String.pipe(T.JsonName("zone_id")),
    aiBotsProtection: Schema.optional(
      Schema.Literal("block", "disabled", "only_on_ad_pages"),
    ).pipe(T.JsonName("ai_bots_protection")),
    cfRobotsVariant: Schema.optional(Schema.Literal("off", "policy_only")).pipe(
      T.JsonName("cf_robots_variant"),
    ),
    crawlerProtection: Schema.optional(
      Schema.Literal("enabled", "disabled"),
    ).pipe(T.JsonName("crawler_protection")),
    enableJs: Schema.optional(Schema.Boolean).pipe(T.JsonName("enable_js")),
    isRobotsTxtManaged: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("is_robots_txt_managed"),
    ),
    optimizeWordpress: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("optimize_wordpress"),
    ),
    sbfmDefinitelyAutomated: Schema.optional(
      Schema.Literal("allow", "block", "managed_challenge"),
    ).pipe(T.JsonName("sbfm_definitely_automated")),
    sbfmLikelyAutomated: Schema.optional(
      Schema.Literal("allow", "block", "managed_challenge"),
    ).pipe(T.JsonName("sbfm_likely_automated")),
    sbfmStaticResourceProtection: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("sbfm_static_resource_protection"),
    ),
    sbfmVerifiedBots: Schema.optional(Schema.Literal("allow", "block")).pipe(
      T.JsonName("sbfm_verified_bots"),
    ),
  }),
  Schema.Struct({
    zoneId: Schema.String.pipe(T.JsonName("zone_id")),
    aiBotsProtection: Schema.optional(
      Schema.Literal("block", "disabled", "only_on_ad_pages"),
    ).pipe(T.JsonName("ai_bots_protection")),
    autoUpdateModel: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_update_model"),
    ),
    bmCookieEnabled: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("bm_cookie_enabled"),
    ),
    cfRobotsVariant: Schema.optional(Schema.Literal("off", "policy_only")).pipe(
      T.JsonName("cf_robots_variant"),
    ),
    crawlerProtection: Schema.optional(
      Schema.Literal("enabled", "disabled"),
    ).pipe(T.JsonName("crawler_protection")),
    enableJs: Schema.optional(Schema.Boolean).pipe(T.JsonName("enable_js")),
    isRobotsTxtManaged: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("is_robots_txt_managed"),
    ),
    suppressSessionScore: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("suppress_session_score"),
    ),
  }),
) as unknown as Schema.Schema<PutBotManagementResponse>;

export const putBotManagement: (
  input: PutBotManagementRequest,
) => Effect.Effect<
  PutBotManagementResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutBotManagementRequest,
  output: PutBotManagementResponse,
  errors: [],
}));
