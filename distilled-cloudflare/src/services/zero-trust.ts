/**
 * Cloudflare ZERO-TRUST API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service zero-trust
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
// AccessApplication
// =============================================================================

export interface GetAccessApplicationRequest {}

export const GetAccessApplicationRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}",
  }),
) as unknown as Schema.Schema<GetAccessApplicationRequest>;

export type GetAccessApplicationResponse =
  | {
      domain: string;
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowAuthenticateViaWarp?: boolean;
      allowIframe?: boolean;
      allowedIdps?: string[];
      appLauncherVisible?: boolean;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      corsHeaders?: unknown;
      customDenyMessage?: string;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      destinations?: (
        | { type?: "public"; uri?: string }
        | {
            cidr?: string;
            hostname?: string;
            l4Protocol?: "tcp" | "udp";
            portRange?: string;
            type?: "private";
            vnetId?: string;
          }
      )[];
      enableBindingCookie?: boolean;
      httpOnlyCookieAttribute?: boolean;
      logoUrl?: string;
      name?: string;
      optionsPreflightBypass?: boolean;
      pathCookieAttribute?: boolean;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      readServiceTokensFromHeader?: string;
      sameSiteCookieAttribute?: string;
      scimConfig?: {
        idpUid: string;
        remoteUri: string;
        authentication?:
          | unknown
          | {
              clientId: string;
              clientSecret: string;
              scheme: "access_service_token";
            }
          | (
              | unknown
              | {
                  clientId: string;
                  clientSecret: string;
                  scheme: "access_service_token";
                }
            )[];
        deactivateOnDelete?: boolean;
        enabled?: boolean;
        mappings?: unknown[];
      };
      selfHostedDomains?: string[];
      serviceAuth_401Redirect?: boolean;
      sessionDuration?: string;
      skipInterstitial?: boolean;
      tags?: string[];
    }
  | {
      id?: string;
      allowedIdps?: string[];
      appLauncherVisible?: boolean;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      customPages?: string[];
      logoUrl?: string;
      name?: string;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      saasApp?: unknown;
      scimConfig?: {
        idpUid: string;
        remoteUri: string;
        authentication?:
          | unknown
          | {
              clientId: string;
              clientSecret: string;
              scheme: "access_service_token";
            }
          | (
              | unknown
              | {
                  clientId: string;
                  clientSecret: string;
                  scheme: "access_service_token";
                }
            )[];
        deactivateOnDelete?: boolean;
        enabled?: boolean;
        mappings?: unknown[];
      };
      tags?: string[];
      type?:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
    }
  | {
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowedIdps?: string[];
      appLauncherLogoUrl?: string;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      bgColor?: string;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      domain?: string;
      footerLinks?: { name: string; url: string }[];
      headerBgColor?: string;
      landingPageDesign?: {
        buttonColor?: string;
        buttonTextColor?: string;
        imageUrl?: string;
        message?: string;
        title?: string;
      };
      name?: string;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      sessionDuration?: string;
      skipAppLauncherLoginPage?: boolean;
    }
  | {
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowedIdps?: string[];
      aud?: string;
      autoRedirectToIdentity?: boolean;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      domain?: string;
      name?: string;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      sessionDuration?: string;
    }
  | {
      id?: string;
      appLauncherVisible?: boolean;
      aud?: string;
      domain?: string;
      logoUrl?: string;
      name?: string;
      tags?: string[];
      type?:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
    }
  | {
      targetCriteria: {
        port: number;
        protocol: "SSH";
        targetAttributes: Record<string, unknown>;
      }[];
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      aud?: string;
      name?: string;
      policies?: {
        decision: "allow" | "bypass" | "deny" | "non_identity";
        include: unknown[];
        name: string;
        connectionRules?: {
          ssh?: { usernames: string[]; allowEmailAlias?: boolean };
        };
        exclude?: unknown[];
        require?: unknown[];
      }[];
    }
  | {
      domain: string;
      targetCriteria: {
        port: number;
        protocol: "RDP";
        targetAttributes: Record<string, unknown>;
      }[];
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowAuthenticateViaWarp?: boolean;
      allowIframe?: boolean;
      allowedIdps?: string[];
      appLauncherVisible?: boolean;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      corsHeaders?: unknown;
      customDenyMessage?: string;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      destinations?: (
        | { type?: "public"; uri?: string }
        | {
            cidr?: string;
            hostname?: string;
            l4Protocol?: "tcp" | "udp";
            portRange?: string;
            type?: "private";
            vnetId?: string;
          }
      )[];
      enableBindingCookie?: boolean;
      httpOnlyCookieAttribute?: boolean;
      logoUrl?: string;
      name?: string;
      optionsPreflightBypass?: boolean;
      pathCookieAttribute?: boolean;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      readServiceTokensFromHeader?: string;
      sameSiteCookieAttribute?: string;
      scimConfig?: {
        idpUid: string;
        remoteUri: string;
        authentication?:
          | unknown
          | {
              clientId: string;
              clientSecret: string;
              scheme: "access_service_token";
            }
          | (
              | unknown
              | {
                  clientId: string;
                  clientSecret: string;
                  scheme: "access_service_token";
                }
            )[];
        deactivateOnDelete?: boolean;
        enabled?: boolean;
        mappings?: unknown[];
      };
      selfHostedDomains?: string[];
      serviceAuth_401Redirect?: boolean;
      sessionDuration?: string;
      skipInterstitial?: boolean;
      tags?: string[];
    };

export const GetAccessApplicationResponse = Schema.Union(
  Schema.Struct({
    domain: Schema.String,
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowAuthenticateViaWarp: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_authenticate_via_warp"),
    ),
    allowIframe: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_iframe"),
    ),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    corsHeaders: Schema.optional(Schema.Unknown).pipe(
      T.JsonName("cors_headers"),
    ),
    customDenyMessage: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_message"),
    ),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    destinations: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            type: Schema.optional(Schema.Literal("public")),
            uri: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            cidr: Schema.optional(Schema.String),
            hostname: Schema.optional(Schema.String),
            l4Protocol: Schema.optional(Schema.Literal("tcp", "udp")).pipe(
              T.JsonName("l4_protocol"),
            ),
            portRange: Schema.optional(Schema.String).pipe(
              T.JsonName("port_range"),
            ),
            type: Schema.optional(Schema.Literal("private")),
            vnetId: Schema.optional(Schema.String).pipe(T.JsonName("vnet_id")),
          }),
        ),
      ),
    ),
    enableBindingCookie: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("enable_binding_cookie"),
    ),
    httpOnlyCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("http_only_cookie_attribute"),
    ),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    optionsPreflightBypass: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("options_preflight_bypass"),
    ),
    pathCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("path_cookie_attribute"),
    ),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    readServiceTokensFromHeader: Schema.optional(Schema.String).pipe(
      T.JsonName("read_service_tokens_from_header"),
    ),
    sameSiteCookieAttribute: Schema.optional(Schema.String).pipe(
      T.JsonName("same_site_cookie_attribute"),
    ),
    scimConfig: Schema.optional(
      Schema.Struct({
        idpUid: Schema.String.pipe(T.JsonName("idp_uid")),
        remoteUri: Schema.String.pipe(T.JsonName("remote_uri")),
        authentication: Schema.optional(
          Schema.Union(
            Schema.Unknown,
            Schema.Struct({
              clientId: Schema.String.pipe(T.JsonName("client_id")),
              clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
              scheme: Schema.Literal("access_service_token"),
            }),
            Schema.Array(
              Schema.Union(
                Schema.Unknown,
                Schema.Struct({
                  clientId: Schema.String.pipe(T.JsonName("client_id")),
                  clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
                  scheme: Schema.Literal("access_service_token"),
                }),
              ),
            ),
          ),
        ),
        deactivateOnDelete: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("deactivate_on_delete"),
        ),
        enabled: Schema.optional(Schema.Boolean),
        mappings: Schema.optional(Schema.Array(Schema.Unknown)),
      }),
    ).pipe(T.JsonName("scim_config")),
    selfHostedDomains: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("self_hosted_domains"),
    ),
    serviceAuth_401Redirect: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("service_auth_401_redirect"),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
    skipInterstitial: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("skip_interstitial"),
    ),
    tags: Schema.optional(Schema.Array(Schema.String)),
  }),
  Schema.Struct({
    id: Schema.optional(Schema.String),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    saasApp: Schema.optional(Schema.Unknown).pipe(T.JsonName("saas_app")),
    scimConfig: Schema.optional(
      Schema.Struct({
        idpUid: Schema.String.pipe(T.JsonName("idp_uid")),
        remoteUri: Schema.String.pipe(T.JsonName("remote_uri")),
        authentication: Schema.optional(
          Schema.Union(
            Schema.Unknown,
            Schema.Struct({
              clientId: Schema.String.pipe(T.JsonName("client_id")),
              clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
              scheme: Schema.Literal("access_service_token"),
            }),
            Schema.Array(
              Schema.Union(
                Schema.Unknown,
                Schema.Struct({
                  clientId: Schema.String.pipe(T.JsonName("client_id")),
                  clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
                  scheme: Schema.Literal("access_service_token"),
                }),
              ),
            ),
          ),
        ),
        deactivateOnDelete: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("deactivate_on_delete"),
        ),
        enabled: Schema.optional(Schema.Boolean),
        mappings: Schema.optional(Schema.Array(Schema.Unknown)),
      }),
    ).pipe(T.JsonName("scim_config")),
    tags: Schema.optional(Schema.Array(Schema.String)),
    type: Schema.optional(
      Schema.Literal(
        "self_hosted",
        "saas",
        "ssh",
        "vnc",
        "app_launcher",
        "warp",
        "biso",
        "bookmark",
        "dash_sso",
        "infrastructure",
        "rdp",
      ),
    ),
  }),
  Schema.Struct({
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherLogoUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("app_launcher_logo_url"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    bgColor: Schema.optional(Schema.String).pipe(T.JsonName("bg_color")),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    domain: Schema.optional(Schema.String),
    footerLinks: Schema.optional(
      Schema.Array(
        Schema.Struct({
          name: Schema.String,
          url: Schema.String,
        }),
      ),
    ).pipe(T.JsonName("footer_links")),
    headerBgColor: Schema.optional(Schema.String).pipe(
      T.JsonName("header_bg_color"),
    ),
    landingPageDesign: Schema.optional(
      Schema.Struct({
        buttonColor: Schema.optional(Schema.String).pipe(
          T.JsonName("button_color"),
        ),
        buttonTextColor: Schema.optional(Schema.String).pipe(
          T.JsonName("button_text_color"),
        ),
        imageUrl: Schema.optional(Schema.String).pipe(T.JsonName("image_url")),
        message: Schema.optional(Schema.String),
        title: Schema.optional(Schema.String),
      }),
    ).pipe(T.JsonName("landing_page_design")),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
    skipAppLauncherLoginPage: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("skip_app_launcher_login_page"),
    ),
  }),
  Schema.Struct({
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    domain: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
  }),
  Schema.Struct({
    id: Schema.optional(Schema.String),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    domain: Schema.optional(Schema.String),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    tags: Schema.optional(Schema.Array(Schema.String)),
    type: Schema.optional(
      Schema.Literal(
        "self_hosted",
        "saas",
        "ssh",
        "vnc",
        "app_launcher",
        "warp",
        "biso",
        "bookmark",
        "dash_sso",
        "infrastructure",
        "rdp",
      ),
    ),
  }),
  Schema.Struct({
    targetCriteria: Schema.Array(
      Schema.Struct({
        port: Schema.Number,
        protocol: Schema.Literal("SSH"),
        targetAttributes: Schema.Struct({}).pipe(
          T.JsonName("target_attributes"),
        ),
      }),
    ).pipe(T.JsonName("target_criteria")),
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    aud: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          decision: Schema.Literal("allow", "bypass", "deny", "non_identity"),
          include: Schema.Array(Schema.Unknown),
          name: Schema.String,
          connectionRules: Schema.optional(
            Schema.Struct({
              ssh: Schema.optional(
                Schema.Struct({
                  usernames: Schema.Array(Schema.String),
                  allowEmailAlias: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("allow_email_alias"),
                  ),
                }),
              ),
            }),
          ).pipe(T.JsonName("connection_rules")),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
        }),
      ),
    ),
  }),
  Schema.Struct({
    domain: Schema.String,
    targetCriteria: Schema.Array(
      Schema.Struct({
        port: Schema.Number,
        protocol: Schema.Literal("RDP"),
        targetAttributes: Schema.Struct({}).pipe(
          T.JsonName("target_attributes"),
        ),
      }),
    ).pipe(T.JsonName("target_criteria")),
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowAuthenticateViaWarp: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_authenticate_via_warp"),
    ),
    allowIframe: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_iframe"),
    ),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    corsHeaders: Schema.optional(Schema.Unknown).pipe(
      T.JsonName("cors_headers"),
    ),
    customDenyMessage: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_message"),
    ),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    destinations: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            type: Schema.optional(Schema.Literal("public")),
            uri: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            cidr: Schema.optional(Schema.String),
            hostname: Schema.optional(Schema.String),
            l4Protocol: Schema.optional(Schema.Literal("tcp", "udp")).pipe(
              T.JsonName("l4_protocol"),
            ),
            portRange: Schema.optional(Schema.String).pipe(
              T.JsonName("port_range"),
            ),
            type: Schema.optional(Schema.Literal("private")),
            vnetId: Schema.optional(Schema.String).pipe(T.JsonName("vnet_id")),
          }),
        ),
      ),
    ),
    enableBindingCookie: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("enable_binding_cookie"),
    ),
    httpOnlyCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("http_only_cookie_attribute"),
    ),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    optionsPreflightBypass: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("options_preflight_bypass"),
    ),
    pathCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("path_cookie_attribute"),
    ),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    readServiceTokensFromHeader: Schema.optional(Schema.String).pipe(
      T.JsonName("read_service_tokens_from_header"),
    ),
    sameSiteCookieAttribute: Schema.optional(Schema.String).pipe(
      T.JsonName("same_site_cookie_attribute"),
    ),
    scimConfig: Schema.optional(
      Schema.Struct({
        idpUid: Schema.String.pipe(T.JsonName("idp_uid")),
        remoteUri: Schema.String.pipe(T.JsonName("remote_uri")),
        authentication: Schema.optional(
          Schema.Union(
            Schema.Unknown,
            Schema.Struct({
              clientId: Schema.String.pipe(T.JsonName("client_id")),
              clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
              scheme: Schema.Literal("access_service_token"),
            }),
            Schema.Array(
              Schema.Union(
                Schema.Unknown,
                Schema.Struct({
                  clientId: Schema.String.pipe(T.JsonName("client_id")),
                  clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
                  scheme: Schema.Literal("access_service_token"),
                }),
              ),
            ),
          ),
        ),
        deactivateOnDelete: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("deactivate_on_delete"),
        ),
        enabled: Schema.optional(Schema.Boolean),
        mappings: Schema.optional(Schema.Array(Schema.Unknown)),
      }),
    ).pipe(T.JsonName("scim_config")),
    selfHostedDomains: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("self_hosted_domains"),
    ),
    serviceAuth_401Redirect: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("service_auth_401_redirect"),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
    skipInterstitial: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("skip_interstitial"),
    ),
    tags: Schema.optional(Schema.Array(Schema.String)),
  }),
) as unknown as Schema.Schema<GetAccessApplicationResponse>;

export const getAccessApplication: (
  input: GetAccessApplicationRequest,
) => Effect.Effect<
  GetAccessApplicationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessApplicationRequest,
  output: GetAccessApplicationResponse,
  errors: [],
}));

export interface CreateAccessApplicationRequest {}

export const CreateAccessApplicationRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps",
  }),
) as unknown as Schema.Schema<CreateAccessApplicationRequest>;

export type CreateAccessApplicationResponse =
  | {
      domain: string;
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowAuthenticateViaWarp?: boolean;
      allowIframe?: boolean;
      allowedIdps?: string[];
      appLauncherVisible?: boolean;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      corsHeaders?: unknown;
      customDenyMessage?: string;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      destinations?: (
        | { type?: "public"; uri?: string }
        | {
            cidr?: string;
            hostname?: string;
            l4Protocol?: "tcp" | "udp";
            portRange?: string;
            type?: "private";
            vnetId?: string;
          }
      )[];
      enableBindingCookie?: boolean;
      httpOnlyCookieAttribute?: boolean;
      logoUrl?: string;
      name?: string;
      optionsPreflightBypass?: boolean;
      pathCookieAttribute?: boolean;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      readServiceTokensFromHeader?: string;
      sameSiteCookieAttribute?: string;
      scimConfig?: {
        idpUid: string;
        remoteUri: string;
        authentication?:
          | unknown
          | {
              clientId: string;
              clientSecret: string;
              scheme: "access_service_token";
            }
          | (
              | unknown
              | {
                  clientId: string;
                  clientSecret: string;
                  scheme: "access_service_token";
                }
            )[];
        deactivateOnDelete?: boolean;
        enabled?: boolean;
        mappings?: unknown[];
      };
      selfHostedDomains?: string[];
      serviceAuth_401Redirect?: boolean;
      sessionDuration?: string;
      skipInterstitial?: boolean;
      tags?: string[];
    }
  | {
      id?: string;
      allowedIdps?: string[];
      appLauncherVisible?: boolean;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      customPages?: string[];
      logoUrl?: string;
      name?: string;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      saasApp?: unknown;
      scimConfig?: {
        idpUid: string;
        remoteUri: string;
        authentication?:
          | unknown
          | {
              clientId: string;
              clientSecret: string;
              scheme: "access_service_token";
            }
          | (
              | unknown
              | {
                  clientId: string;
                  clientSecret: string;
                  scheme: "access_service_token";
                }
            )[];
        deactivateOnDelete?: boolean;
        enabled?: boolean;
        mappings?: unknown[];
      };
      tags?: string[];
      type?:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
    }
  | {
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowedIdps?: string[];
      appLauncherLogoUrl?: string;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      bgColor?: string;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      domain?: string;
      footerLinks?: { name: string; url: string }[];
      headerBgColor?: string;
      landingPageDesign?: {
        buttonColor?: string;
        buttonTextColor?: string;
        imageUrl?: string;
        message?: string;
        title?: string;
      };
      name?: string;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      sessionDuration?: string;
      skipAppLauncherLoginPage?: boolean;
    }
  | {
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowedIdps?: string[];
      aud?: string;
      autoRedirectToIdentity?: boolean;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      domain?: string;
      name?: string;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      sessionDuration?: string;
    }
  | {
      id?: string;
      appLauncherVisible?: boolean;
      aud?: string;
      domain?: string;
      logoUrl?: string;
      name?: string;
      tags?: string[];
      type?:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
    }
  | {
      targetCriteria: {
        port: number;
        protocol: "SSH";
        targetAttributes: Record<string, unknown>;
      }[];
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      aud?: string;
      name?: string;
      policies?: {
        decision: "allow" | "bypass" | "deny" | "non_identity";
        include: unknown[];
        name: string;
        connectionRules?: {
          ssh?: { usernames: string[]; allowEmailAlias?: boolean };
        };
        exclude?: unknown[];
        require?: unknown[];
      }[];
    }
  | {
      domain: string;
      targetCriteria: {
        port: number;
        protocol: "RDP";
        targetAttributes: Record<string, unknown>;
      }[];
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowAuthenticateViaWarp?: boolean;
      allowIframe?: boolean;
      allowedIdps?: string[];
      appLauncherVisible?: boolean;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      corsHeaders?: unknown;
      customDenyMessage?: string;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      destinations?: (
        | { type?: "public"; uri?: string }
        | {
            cidr?: string;
            hostname?: string;
            l4Protocol?: "tcp" | "udp";
            portRange?: string;
            type?: "private";
            vnetId?: string;
          }
      )[];
      enableBindingCookie?: boolean;
      httpOnlyCookieAttribute?: boolean;
      logoUrl?: string;
      name?: string;
      optionsPreflightBypass?: boolean;
      pathCookieAttribute?: boolean;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      readServiceTokensFromHeader?: string;
      sameSiteCookieAttribute?: string;
      scimConfig?: {
        idpUid: string;
        remoteUri: string;
        authentication?:
          | unknown
          | {
              clientId: string;
              clientSecret: string;
              scheme: "access_service_token";
            }
          | (
              | unknown
              | {
                  clientId: string;
                  clientSecret: string;
                  scheme: "access_service_token";
                }
            )[];
        deactivateOnDelete?: boolean;
        enabled?: boolean;
        mappings?: unknown[];
      };
      selfHostedDomains?: string[];
      serviceAuth_401Redirect?: boolean;
      sessionDuration?: string;
      skipInterstitial?: boolean;
      tags?: string[];
    };

export const CreateAccessApplicationResponse = Schema.Union(
  Schema.Struct({
    domain: Schema.String,
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowAuthenticateViaWarp: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_authenticate_via_warp"),
    ),
    allowIframe: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_iframe"),
    ),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    corsHeaders: Schema.optional(Schema.Unknown).pipe(
      T.JsonName("cors_headers"),
    ),
    customDenyMessage: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_message"),
    ),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    destinations: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            type: Schema.optional(Schema.Literal("public")),
            uri: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            cidr: Schema.optional(Schema.String),
            hostname: Schema.optional(Schema.String),
            l4Protocol: Schema.optional(Schema.Literal("tcp", "udp")).pipe(
              T.JsonName("l4_protocol"),
            ),
            portRange: Schema.optional(Schema.String).pipe(
              T.JsonName("port_range"),
            ),
            type: Schema.optional(Schema.Literal("private")),
            vnetId: Schema.optional(Schema.String).pipe(T.JsonName("vnet_id")),
          }),
        ),
      ),
    ),
    enableBindingCookie: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("enable_binding_cookie"),
    ),
    httpOnlyCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("http_only_cookie_attribute"),
    ),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    optionsPreflightBypass: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("options_preflight_bypass"),
    ),
    pathCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("path_cookie_attribute"),
    ),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    readServiceTokensFromHeader: Schema.optional(Schema.String).pipe(
      T.JsonName("read_service_tokens_from_header"),
    ),
    sameSiteCookieAttribute: Schema.optional(Schema.String).pipe(
      T.JsonName("same_site_cookie_attribute"),
    ),
    scimConfig: Schema.optional(
      Schema.Struct({
        idpUid: Schema.String.pipe(T.JsonName("idp_uid")),
        remoteUri: Schema.String.pipe(T.JsonName("remote_uri")),
        authentication: Schema.optional(
          Schema.Union(
            Schema.Unknown,
            Schema.Struct({
              clientId: Schema.String.pipe(T.JsonName("client_id")),
              clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
              scheme: Schema.Literal("access_service_token"),
            }),
            Schema.Array(
              Schema.Union(
                Schema.Unknown,
                Schema.Struct({
                  clientId: Schema.String.pipe(T.JsonName("client_id")),
                  clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
                  scheme: Schema.Literal("access_service_token"),
                }),
              ),
            ),
          ),
        ),
        deactivateOnDelete: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("deactivate_on_delete"),
        ),
        enabled: Schema.optional(Schema.Boolean),
        mappings: Schema.optional(Schema.Array(Schema.Unknown)),
      }),
    ).pipe(T.JsonName("scim_config")),
    selfHostedDomains: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("self_hosted_domains"),
    ),
    serviceAuth_401Redirect: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("service_auth_401_redirect"),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
    skipInterstitial: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("skip_interstitial"),
    ),
    tags: Schema.optional(Schema.Array(Schema.String)),
  }),
  Schema.Struct({
    id: Schema.optional(Schema.String),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    saasApp: Schema.optional(Schema.Unknown).pipe(T.JsonName("saas_app")),
    scimConfig: Schema.optional(
      Schema.Struct({
        idpUid: Schema.String.pipe(T.JsonName("idp_uid")),
        remoteUri: Schema.String.pipe(T.JsonName("remote_uri")),
        authentication: Schema.optional(
          Schema.Union(
            Schema.Unknown,
            Schema.Struct({
              clientId: Schema.String.pipe(T.JsonName("client_id")),
              clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
              scheme: Schema.Literal("access_service_token"),
            }),
            Schema.Array(
              Schema.Union(
                Schema.Unknown,
                Schema.Struct({
                  clientId: Schema.String.pipe(T.JsonName("client_id")),
                  clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
                  scheme: Schema.Literal("access_service_token"),
                }),
              ),
            ),
          ),
        ),
        deactivateOnDelete: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("deactivate_on_delete"),
        ),
        enabled: Schema.optional(Schema.Boolean),
        mappings: Schema.optional(Schema.Array(Schema.Unknown)),
      }),
    ).pipe(T.JsonName("scim_config")),
    tags: Schema.optional(Schema.Array(Schema.String)),
    type: Schema.optional(
      Schema.Literal(
        "self_hosted",
        "saas",
        "ssh",
        "vnc",
        "app_launcher",
        "warp",
        "biso",
        "bookmark",
        "dash_sso",
        "infrastructure",
        "rdp",
      ),
    ),
  }),
  Schema.Struct({
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherLogoUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("app_launcher_logo_url"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    bgColor: Schema.optional(Schema.String).pipe(T.JsonName("bg_color")),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    domain: Schema.optional(Schema.String),
    footerLinks: Schema.optional(
      Schema.Array(
        Schema.Struct({
          name: Schema.String,
          url: Schema.String,
        }),
      ),
    ).pipe(T.JsonName("footer_links")),
    headerBgColor: Schema.optional(Schema.String).pipe(
      T.JsonName("header_bg_color"),
    ),
    landingPageDesign: Schema.optional(
      Schema.Struct({
        buttonColor: Schema.optional(Schema.String).pipe(
          T.JsonName("button_color"),
        ),
        buttonTextColor: Schema.optional(Schema.String).pipe(
          T.JsonName("button_text_color"),
        ),
        imageUrl: Schema.optional(Schema.String).pipe(T.JsonName("image_url")),
        message: Schema.optional(Schema.String),
        title: Schema.optional(Schema.String),
      }),
    ).pipe(T.JsonName("landing_page_design")),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
    skipAppLauncherLoginPage: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("skip_app_launcher_login_page"),
    ),
  }),
  Schema.Struct({
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    domain: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
  }),
  Schema.Struct({
    id: Schema.optional(Schema.String),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    domain: Schema.optional(Schema.String),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    tags: Schema.optional(Schema.Array(Schema.String)),
    type: Schema.optional(
      Schema.Literal(
        "self_hosted",
        "saas",
        "ssh",
        "vnc",
        "app_launcher",
        "warp",
        "biso",
        "bookmark",
        "dash_sso",
        "infrastructure",
        "rdp",
      ),
    ),
  }),
  Schema.Struct({
    targetCriteria: Schema.Array(
      Schema.Struct({
        port: Schema.Number,
        protocol: Schema.Literal("SSH"),
        targetAttributes: Schema.Struct({}).pipe(
          T.JsonName("target_attributes"),
        ),
      }),
    ).pipe(T.JsonName("target_criteria")),
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    aud: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          decision: Schema.Literal("allow", "bypass", "deny", "non_identity"),
          include: Schema.Array(Schema.Unknown),
          name: Schema.String,
          connectionRules: Schema.optional(
            Schema.Struct({
              ssh: Schema.optional(
                Schema.Struct({
                  usernames: Schema.Array(Schema.String),
                  allowEmailAlias: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("allow_email_alias"),
                  ),
                }),
              ),
            }),
          ).pipe(T.JsonName("connection_rules")),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
        }),
      ),
    ),
  }),
  Schema.Struct({
    domain: Schema.String,
    targetCriteria: Schema.Array(
      Schema.Struct({
        port: Schema.Number,
        protocol: Schema.Literal("RDP"),
        targetAttributes: Schema.Struct({}).pipe(
          T.JsonName("target_attributes"),
        ),
      }),
    ).pipe(T.JsonName("target_criteria")),
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowAuthenticateViaWarp: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_authenticate_via_warp"),
    ),
    allowIframe: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_iframe"),
    ),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    corsHeaders: Schema.optional(Schema.Unknown).pipe(
      T.JsonName("cors_headers"),
    ),
    customDenyMessage: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_message"),
    ),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    destinations: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            type: Schema.optional(Schema.Literal("public")),
            uri: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            cidr: Schema.optional(Schema.String),
            hostname: Schema.optional(Schema.String),
            l4Protocol: Schema.optional(Schema.Literal("tcp", "udp")).pipe(
              T.JsonName("l4_protocol"),
            ),
            portRange: Schema.optional(Schema.String).pipe(
              T.JsonName("port_range"),
            ),
            type: Schema.optional(Schema.Literal("private")),
            vnetId: Schema.optional(Schema.String).pipe(T.JsonName("vnet_id")),
          }),
        ),
      ),
    ),
    enableBindingCookie: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("enable_binding_cookie"),
    ),
    httpOnlyCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("http_only_cookie_attribute"),
    ),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    optionsPreflightBypass: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("options_preflight_bypass"),
    ),
    pathCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("path_cookie_attribute"),
    ),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    readServiceTokensFromHeader: Schema.optional(Schema.String).pipe(
      T.JsonName("read_service_tokens_from_header"),
    ),
    sameSiteCookieAttribute: Schema.optional(Schema.String).pipe(
      T.JsonName("same_site_cookie_attribute"),
    ),
    scimConfig: Schema.optional(
      Schema.Struct({
        idpUid: Schema.String.pipe(T.JsonName("idp_uid")),
        remoteUri: Schema.String.pipe(T.JsonName("remote_uri")),
        authentication: Schema.optional(
          Schema.Union(
            Schema.Unknown,
            Schema.Struct({
              clientId: Schema.String.pipe(T.JsonName("client_id")),
              clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
              scheme: Schema.Literal("access_service_token"),
            }),
            Schema.Array(
              Schema.Union(
                Schema.Unknown,
                Schema.Struct({
                  clientId: Schema.String.pipe(T.JsonName("client_id")),
                  clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
                  scheme: Schema.Literal("access_service_token"),
                }),
              ),
            ),
          ),
        ),
        deactivateOnDelete: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("deactivate_on_delete"),
        ),
        enabled: Schema.optional(Schema.Boolean),
        mappings: Schema.optional(Schema.Array(Schema.Unknown)),
      }),
    ).pipe(T.JsonName("scim_config")),
    selfHostedDomains: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("self_hosted_domains"),
    ),
    serviceAuth_401Redirect: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("service_auth_401_redirect"),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
    skipInterstitial: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("skip_interstitial"),
    ),
    tags: Schema.optional(Schema.Array(Schema.String)),
  }),
) as unknown as Schema.Schema<CreateAccessApplicationResponse>;

export const createAccessApplication: (
  input: CreateAccessApplicationRequest,
) => Effect.Effect<
  CreateAccessApplicationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessApplicationRequest,
  output: CreateAccessApplicationResponse,
  errors: [],
}));

export interface UpdateAccessApplicationRequest {}

export const UpdateAccessApplicationRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "PUT",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}",
  }),
) as unknown as Schema.Schema<UpdateAccessApplicationRequest>;

export type UpdateAccessApplicationResponse =
  | {
      domain: string;
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowAuthenticateViaWarp?: boolean;
      allowIframe?: boolean;
      allowedIdps?: string[];
      appLauncherVisible?: boolean;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      corsHeaders?: unknown;
      customDenyMessage?: string;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      destinations?: (
        | { type?: "public"; uri?: string }
        | {
            cidr?: string;
            hostname?: string;
            l4Protocol?: "tcp" | "udp";
            portRange?: string;
            type?: "private";
            vnetId?: string;
          }
      )[];
      enableBindingCookie?: boolean;
      httpOnlyCookieAttribute?: boolean;
      logoUrl?: string;
      name?: string;
      optionsPreflightBypass?: boolean;
      pathCookieAttribute?: boolean;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      readServiceTokensFromHeader?: string;
      sameSiteCookieAttribute?: string;
      scimConfig?: {
        idpUid: string;
        remoteUri: string;
        authentication?:
          | unknown
          | {
              clientId: string;
              clientSecret: string;
              scheme: "access_service_token";
            }
          | (
              | unknown
              | {
                  clientId: string;
                  clientSecret: string;
                  scheme: "access_service_token";
                }
            )[];
        deactivateOnDelete?: boolean;
        enabled?: boolean;
        mappings?: unknown[];
      };
      selfHostedDomains?: string[];
      serviceAuth_401Redirect?: boolean;
      sessionDuration?: string;
      skipInterstitial?: boolean;
      tags?: string[];
    }
  | {
      id?: string;
      allowedIdps?: string[];
      appLauncherVisible?: boolean;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      customPages?: string[];
      logoUrl?: string;
      name?: string;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      saasApp?: unknown;
      scimConfig?: {
        idpUid: string;
        remoteUri: string;
        authentication?:
          | unknown
          | {
              clientId: string;
              clientSecret: string;
              scheme: "access_service_token";
            }
          | (
              | unknown
              | {
                  clientId: string;
                  clientSecret: string;
                  scheme: "access_service_token";
                }
            )[];
        deactivateOnDelete?: boolean;
        enabled?: boolean;
        mappings?: unknown[];
      };
      tags?: string[];
      type?:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
    }
  | {
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowedIdps?: string[];
      appLauncherLogoUrl?: string;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      bgColor?: string;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      domain?: string;
      footerLinks?: { name: string; url: string }[];
      headerBgColor?: string;
      landingPageDesign?: {
        buttonColor?: string;
        buttonTextColor?: string;
        imageUrl?: string;
        message?: string;
        title?: string;
      };
      name?: string;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      sessionDuration?: string;
      skipAppLauncherLoginPage?: boolean;
    }
  | {
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowedIdps?: string[];
      aud?: string;
      autoRedirectToIdentity?: boolean;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      domain?: string;
      name?: string;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      sessionDuration?: string;
    }
  | {
      id?: string;
      appLauncherVisible?: boolean;
      aud?: string;
      domain?: string;
      logoUrl?: string;
      name?: string;
      tags?: string[];
      type?:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
    }
  | {
      targetCriteria: {
        port: number;
        protocol: "SSH";
        targetAttributes: Record<string, unknown>;
      }[];
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      aud?: string;
      name?: string;
      policies?: {
        decision: "allow" | "bypass" | "deny" | "non_identity";
        include: unknown[];
        name: string;
        connectionRules?: {
          ssh?: { usernames: string[]; allowEmailAlias?: boolean };
        };
        exclude?: unknown[];
        require?: unknown[];
      }[];
    }
  | {
      domain: string;
      targetCriteria: {
        port: number;
        protocol: "RDP";
        targetAttributes: Record<string, unknown>;
      }[];
      type:
        | "self_hosted"
        | "saas"
        | "ssh"
        | "vnc"
        | "app_launcher"
        | "warp"
        | "biso"
        | "bookmark"
        | "dash_sso"
        | "infrastructure"
        | "rdp";
      id?: string;
      allowAuthenticateViaWarp?: boolean;
      allowIframe?: boolean;
      allowedIdps?: string[];
      appLauncherVisible?: boolean;
      aud?: string;
      autoRedirectToIdentity?: boolean;
      corsHeaders?: unknown;
      customDenyMessage?: string;
      customDenyUrl?: string;
      customNonIdentityDenyUrl?: string;
      customPages?: string[];
      destinations?: (
        | { type?: "public"; uri?: string }
        | {
            cidr?: string;
            hostname?: string;
            l4Protocol?: "tcp" | "udp";
            portRange?: string;
            type?: "private";
            vnetId?: string;
          }
      )[];
      enableBindingCookie?: boolean;
      httpOnlyCookieAttribute?: boolean;
      logoUrl?: string;
      name?: string;
      optionsPreflightBypass?: boolean;
      pathCookieAttribute?: boolean;
      policies?: {
        id?: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        createdAt?: string;
        decision?: "allow" | "bypass" | "deny" | "non_identity";
        exclude?: unknown[];
        include?: unknown[];
        isolationRequired?: boolean;
        name?: string;
        precedence?: number;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
        updatedAt?: string;
      }[];
      readServiceTokensFromHeader?: string;
      sameSiteCookieAttribute?: string;
      scimConfig?: {
        idpUid: string;
        remoteUri: string;
        authentication?:
          | unknown
          | {
              clientId: string;
              clientSecret: string;
              scheme: "access_service_token";
            }
          | (
              | unknown
              | {
                  clientId: string;
                  clientSecret: string;
                  scheme: "access_service_token";
                }
            )[];
        deactivateOnDelete?: boolean;
        enabled?: boolean;
        mappings?: unknown[];
      };
      selfHostedDomains?: string[];
      serviceAuth_401Redirect?: boolean;
      sessionDuration?: string;
      skipInterstitial?: boolean;
      tags?: string[];
    };

export const UpdateAccessApplicationResponse = Schema.Union(
  Schema.Struct({
    domain: Schema.String,
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowAuthenticateViaWarp: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_authenticate_via_warp"),
    ),
    allowIframe: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_iframe"),
    ),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    corsHeaders: Schema.optional(Schema.Unknown).pipe(
      T.JsonName("cors_headers"),
    ),
    customDenyMessage: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_message"),
    ),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    destinations: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            type: Schema.optional(Schema.Literal("public")),
            uri: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            cidr: Schema.optional(Schema.String),
            hostname: Schema.optional(Schema.String),
            l4Protocol: Schema.optional(Schema.Literal("tcp", "udp")).pipe(
              T.JsonName("l4_protocol"),
            ),
            portRange: Schema.optional(Schema.String).pipe(
              T.JsonName("port_range"),
            ),
            type: Schema.optional(Schema.Literal("private")),
            vnetId: Schema.optional(Schema.String).pipe(T.JsonName("vnet_id")),
          }),
        ),
      ),
    ),
    enableBindingCookie: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("enable_binding_cookie"),
    ),
    httpOnlyCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("http_only_cookie_attribute"),
    ),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    optionsPreflightBypass: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("options_preflight_bypass"),
    ),
    pathCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("path_cookie_attribute"),
    ),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    readServiceTokensFromHeader: Schema.optional(Schema.String).pipe(
      T.JsonName("read_service_tokens_from_header"),
    ),
    sameSiteCookieAttribute: Schema.optional(Schema.String).pipe(
      T.JsonName("same_site_cookie_attribute"),
    ),
    scimConfig: Schema.optional(
      Schema.Struct({
        idpUid: Schema.String.pipe(T.JsonName("idp_uid")),
        remoteUri: Schema.String.pipe(T.JsonName("remote_uri")),
        authentication: Schema.optional(
          Schema.Union(
            Schema.Unknown,
            Schema.Struct({
              clientId: Schema.String.pipe(T.JsonName("client_id")),
              clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
              scheme: Schema.Literal("access_service_token"),
            }),
            Schema.Array(
              Schema.Union(
                Schema.Unknown,
                Schema.Struct({
                  clientId: Schema.String.pipe(T.JsonName("client_id")),
                  clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
                  scheme: Schema.Literal("access_service_token"),
                }),
              ),
            ),
          ),
        ),
        deactivateOnDelete: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("deactivate_on_delete"),
        ),
        enabled: Schema.optional(Schema.Boolean),
        mappings: Schema.optional(Schema.Array(Schema.Unknown)),
      }),
    ).pipe(T.JsonName("scim_config")),
    selfHostedDomains: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("self_hosted_domains"),
    ),
    serviceAuth_401Redirect: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("service_auth_401_redirect"),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
    skipInterstitial: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("skip_interstitial"),
    ),
    tags: Schema.optional(Schema.Array(Schema.String)),
  }),
  Schema.Struct({
    id: Schema.optional(Schema.String),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    saasApp: Schema.optional(Schema.Unknown).pipe(T.JsonName("saas_app")),
    scimConfig: Schema.optional(
      Schema.Struct({
        idpUid: Schema.String.pipe(T.JsonName("idp_uid")),
        remoteUri: Schema.String.pipe(T.JsonName("remote_uri")),
        authentication: Schema.optional(
          Schema.Union(
            Schema.Unknown,
            Schema.Struct({
              clientId: Schema.String.pipe(T.JsonName("client_id")),
              clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
              scheme: Schema.Literal("access_service_token"),
            }),
            Schema.Array(
              Schema.Union(
                Schema.Unknown,
                Schema.Struct({
                  clientId: Schema.String.pipe(T.JsonName("client_id")),
                  clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
                  scheme: Schema.Literal("access_service_token"),
                }),
              ),
            ),
          ),
        ),
        deactivateOnDelete: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("deactivate_on_delete"),
        ),
        enabled: Schema.optional(Schema.Boolean),
        mappings: Schema.optional(Schema.Array(Schema.Unknown)),
      }),
    ).pipe(T.JsonName("scim_config")),
    tags: Schema.optional(Schema.Array(Schema.String)),
    type: Schema.optional(
      Schema.Literal(
        "self_hosted",
        "saas",
        "ssh",
        "vnc",
        "app_launcher",
        "warp",
        "biso",
        "bookmark",
        "dash_sso",
        "infrastructure",
        "rdp",
      ),
    ),
  }),
  Schema.Struct({
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherLogoUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("app_launcher_logo_url"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    bgColor: Schema.optional(Schema.String).pipe(T.JsonName("bg_color")),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    domain: Schema.optional(Schema.String),
    footerLinks: Schema.optional(
      Schema.Array(
        Schema.Struct({
          name: Schema.String,
          url: Schema.String,
        }),
      ),
    ).pipe(T.JsonName("footer_links")),
    headerBgColor: Schema.optional(Schema.String).pipe(
      T.JsonName("header_bg_color"),
    ),
    landingPageDesign: Schema.optional(
      Schema.Struct({
        buttonColor: Schema.optional(Schema.String).pipe(
          T.JsonName("button_color"),
        ),
        buttonTextColor: Schema.optional(Schema.String).pipe(
          T.JsonName("button_text_color"),
        ),
        imageUrl: Schema.optional(Schema.String).pipe(T.JsonName("image_url")),
        message: Schema.optional(Schema.String),
        title: Schema.optional(Schema.String),
      }),
    ).pipe(T.JsonName("landing_page_design")),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
    skipAppLauncherLoginPage: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("skip_app_launcher_login_page"),
    ),
  }),
  Schema.Struct({
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    domain: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
  }),
  Schema.Struct({
    id: Schema.optional(Schema.String),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    domain: Schema.optional(Schema.String),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    tags: Schema.optional(Schema.Array(Schema.String)),
    type: Schema.optional(
      Schema.Literal(
        "self_hosted",
        "saas",
        "ssh",
        "vnc",
        "app_launcher",
        "warp",
        "biso",
        "bookmark",
        "dash_sso",
        "infrastructure",
        "rdp",
      ),
    ),
  }),
  Schema.Struct({
    targetCriteria: Schema.Array(
      Schema.Struct({
        port: Schema.Number,
        protocol: Schema.Literal("SSH"),
        targetAttributes: Schema.Struct({}).pipe(
          T.JsonName("target_attributes"),
        ),
      }),
    ).pipe(T.JsonName("target_criteria")),
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    aud: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          decision: Schema.Literal("allow", "bypass", "deny", "non_identity"),
          include: Schema.Array(Schema.Unknown),
          name: Schema.String,
          connectionRules: Schema.optional(
            Schema.Struct({
              ssh: Schema.optional(
                Schema.Struct({
                  usernames: Schema.Array(Schema.String),
                  allowEmailAlias: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("allow_email_alias"),
                  ),
                }),
              ),
            }),
          ).pipe(T.JsonName("connection_rules")),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
        }),
      ),
    ),
  }),
  Schema.Struct({
    domain: Schema.String,
    targetCriteria: Schema.Array(
      Schema.Struct({
        port: Schema.Number,
        protocol: Schema.Literal("RDP"),
        targetAttributes: Schema.Struct({}).pipe(
          T.JsonName("target_attributes"),
        ),
      }),
    ).pipe(T.JsonName("target_criteria")),
    type: Schema.Literal(
      "self_hosted",
      "saas",
      "ssh",
      "vnc",
      "app_launcher",
      "warp",
      "biso",
      "bookmark",
      "dash_sso",
      "infrastructure",
      "rdp",
    ),
    id: Schema.optional(Schema.String),
    allowAuthenticateViaWarp: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_authenticate_via_warp"),
    ),
    allowIframe: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("allow_iframe"),
    ),
    allowedIdps: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("allowed_idps"),
    ),
    appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("app_launcher_visible"),
    ),
    aud: Schema.optional(Schema.String),
    autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("auto_redirect_to_identity"),
    ),
    corsHeaders: Schema.optional(Schema.Unknown).pipe(
      T.JsonName("cors_headers"),
    ),
    customDenyMessage: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_message"),
    ),
    customDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_deny_url"),
    ),
    customNonIdentityDenyUrl: Schema.optional(Schema.String).pipe(
      T.JsonName("custom_non_identity_deny_url"),
    ),
    customPages: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("custom_pages"),
    ),
    destinations: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            type: Schema.optional(Schema.Literal("public")),
            uri: Schema.optional(Schema.String),
          }),
          Schema.Struct({
            cidr: Schema.optional(Schema.String),
            hostname: Schema.optional(Schema.String),
            l4Protocol: Schema.optional(Schema.Literal("tcp", "udp")).pipe(
              T.JsonName("l4_protocol"),
            ),
            portRange: Schema.optional(Schema.String).pipe(
              T.JsonName("port_range"),
            ),
            type: Schema.optional(Schema.Literal("private")),
            vnetId: Schema.optional(Schema.String).pipe(T.JsonName("vnet_id")),
          }),
        ),
      ),
    ),
    enableBindingCookie: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("enable_binding_cookie"),
    ),
    httpOnlyCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("http_only_cookie_attribute"),
    ),
    logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
    name: Schema.optional(Schema.String),
    optionsPreflightBypass: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("options_preflight_bypass"),
    ),
    pathCookieAttribute: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("path_cookie_attribute"),
    ),
    policies: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          createdAt: Schema.optional(Schema.String).pipe(
            T.JsonName("created_at"),
          ),
          decision: Schema.optional(
            Schema.Literal("allow", "bypass", "deny", "non_identity"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          include: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          name: Schema.optional(Schema.String),
          precedence: Schema.optional(Schema.Number),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
          updatedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("updated_at"),
          ),
        }),
      ),
    ),
    readServiceTokensFromHeader: Schema.optional(Schema.String).pipe(
      T.JsonName("read_service_tokens_from_header"),
    ),
    sameSiteCookieAttribute: Schema.optional(Schema.String).pipe(
      T.JsonName("same_site_cookie_attribute"),
    ),
    scimConfig: Schema.optional(
      Schema.Struct({
        idpUid: Schema.String.pipe(T.JsonName("idp_uid")),
        remoteUri: Schema.String.pipe(T.JsonName("remote_uri")),
        authentication: Schema.optional(
          Schema.Union(
            Schema.Unknown,
            Schema.Struct({
              clientId: Schema.String.pipe(T.JsonName("client_id")),
              clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
              scheme: Schema.Literal("access_service_token"),
            }),
            Schema.Array(
              Schema.Union(
                Schema.Unknown,
                Schema.Struct({
                  clientId: Schema.String.pipe(T.JsonName("client_id")),
                  clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
                  scheme: Schema.Literal("access_service_token"),
                }),
              ),
            ),
          ),
        ),
        deactivateOnDelete: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("deactivate_on_delete"),
        ),
        enabled: Schema.optional(Schema.Boolean),
        mappings: Schema.optional(Schema.Array(Schema.Unknown)),
      }),
    ).pipe(T.JsonName("scim_config")),
    selfHostedDomains: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("self_hosted_domains"),
    ),
    serviceAuth_401Redirect: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("service_auth_401_redirect"),
    ),
    sessionDuration: Schema.optional(Schema.String).pipe(
      T.JsonName("session_duration"),
    ),
    skipInterstitial: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("skip_interstitial"),
    ),
    tags: Schema.optional(Schema.Array(Schema.String)),
  }),
) as unknown as Schema.Schema<UpdateAccessApplicationResponse>;

export const updateAccessApplication: (
  input: UpdateAccessApplicationRequest,
) => Effect.Effect<
  UpdateAccessApplicationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateAccessApplicationRequest,
  output: UpdateAccessApplicationResponse,
  errors: [],
}));

export interface DeleteAccessApplicationRequest {}

export const DeleteAccessApplicationRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "DELETE",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}",
  }),
) as unknown as Schema.Schema<DeleteAccessApplicationRequest>;

export interface DeleteAccessApplicationResponse {
  /** UUID. */
  id?: string;
}

export const DeleteAccessApplicationResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteAccessApplicationResponse>;

export const deleteAccessApplication: (
  input: DeleteAccessApplicationRequest,
) => Effect.Effect<
  DeleteAccessApplicationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessApplicationRequest,
  output: DeleteAccessApplicationResponse,
  errors: [],
}));

// =============================================================================
// AccessApplicationCa
// =============================================================================

export interface GetAccessApplicationCaRequest {
  appId: string;
}

export const GetAccessApplicationCaRequest = Schema.Struct({
  appId: Schema.String.pipe(T.HttpPath("appId")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}/ca",
  }),
) as unknown as Schema.Schema<GetAccessApplicationCaRequest>;

export interface GetAccessApplicationCaResponse {
  /** The ID of the CA. */
  id?: string;
  /** The Application Audience (AUD) tag. Identifies the application associated with the CA. */
  aud?: string;
  /** The public key to add to your SSH server configuration. */
  publicKey?: string;
}

export const GetAccessApplicationCaResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  aud: Schema.optional(Schema.String),
  publicKey: Schema.optional(Schema.String).pipe(T.JsonName("public_key")),
}) as unknown as Schema.Schema<GetAccessApplicationCaResponse>;

export const getAccessApplicationCa: (
  input: GetAccessApplicationCaRequest,
) => Effect.Effect<
  GetAccessApplicationCaResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessApplicationCaRequest,
  output: GetAccessApplicationCaResponse,
  errors: [],
}));

export interface CreateAccessApplicationCaRequest {
  appId: string;
}

export const CreateAccessApplicationCaRequest = Schema.Struct({
  appId: Schema.String.pipe(T.HttpPath("appId")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}/ca",
  }),
) as unknown as Schema.Schema<CreateAccessApplicationCaRequest>;

export interface CreateAccessApplicationCaResponse {
  /** The ID of the CA. */
  id?: string;
  /** The Application Audience (AUD) tag. Identifies the application associated with the CA. */
  aud?: string;
  /** The public key to add to your SSH server configuration. */
  publicKey?: string;
}

export const CreateAccessApplicationCaResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  aud: Schema.optional(Schema.String),
  publicKey: Schema.optional(Schema.String).pipe(T.JsonName("public_key")),
}) as unknown as Schema.Schema<CreateAccessApplicationCaResponse>;

export const createAccessApplicationCa: (
  input: CreateAccessApplicationCaRequest,
) => Effect.Effect<
  CreateAccessApplicationCaResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessApplicationCaRequest,
  output: CreateAccessApplicationCaResponse,
  errors: [],
}));

export interface DeleteAccessApplicationCaRequest {
  appId: string;
}

export const DeleteAccessApplicationCaRequest = Schema.Struct({
  appId: Schema.String.pipe(T.HttpPath("appId")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}/ca",
  }),
) as unknown as Schema.Schema<DeleteAccessApplicationCaRequest>;

export interface DeleteAccessApplicationCaResponse {
  /** The ID of the CA. */
  id?: string;
}

export const DeleteAccessApplicationCaResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteAccessApplicationCaResponse>;

export const deleteAccessApplicationCa: (
  input: DeleteAccessApplicationCaRequest,
) => Effect.Effect<
  DeleteAccessApplicationCaResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessApplicationCaRequest,
  output: DeleteAccessApplicationCaResponse,
  errors: [],
}));

// =============================================================================
// AccessApplicationPolicy
// =============================================================================

export interface GetAccessApplicationPolicyRequest {
  appId: string;
  policyId: string;
}

export const GetAccessApplicationPolicyRequest = Schema.Struct({
  appId: Schema.String.pipe(T.HttpPath("appId")),
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}/policies/{policyId}",
  }),
) as unknown as Schema.Schema<GetAccessApplicationPolicyRequest>;

export interface GetAccessApplicationPolicyResponse {
  /** The UUID of the policy */
  id?: string;
  /** Administrators who can approve a temporary authentication request. */
  approvalGroups?: unknown[];
  /** Requires the user to request access from an administrator at the start of each session. */
  approvalRequired?: boolean;
  createdAt?: string;
  /** The action Access will take if a user matches this policy. Infrastructure application policies can only use the Allow action. */
  decision?: "allow" | "bypass" | "deny" | "non_identity";
  /** Rules evaluated with a NOT logical operator. To match the policy, a user cannot meet any of the Exclude rules. */
  exclude?: (
    | { group: { id: string } }
    | { anyValidServiceToken: unknown }
    | { authContext: { id: string; acId: string; identityProviderId: string } }
    | { authMethod: { authMethod: string } }
    | { azureAD: { id: string; identityProviderId: string } }
    | { certificate: unknown }
    | { commonName: { commonName: string } }
    | { geo: { countryCode: string } }
    | { devicePosture: { integrationUid: string } }
    | { emailDomain: { domain: string } }
    | { emailList: { id: string } }
    | { email: { email: string } }
    | { everyone: unknown }
    | { externalEvaluation: { evaluateUrl: string; keysUrl: string } }
    | {
        githubOrganization: {
          identityProviderId: string;
          name: string;
          team?: string;
        };
      }
    | { gsuite: { email: string; identityProviderId: string } }
    | { loginMethod: { id: string } }
    | { ipList: { id: string } }
    | { ip: { ip: string } }
    | { okta: { identityProviderId: string; name: string } }
    | {
        saml: {
          attributeName: string;
          attributeValue: string;
          identityProviderId: string;
        };
      }
    | {
        oidc: {
          claimName: string;
          claimValue: string;
          identityProviderId: string;
        };
      }
    | { serviceToken: { tokenId: string } }
    | { linkedAppToken: { appUid: string } }
  )[];
  /** Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include?: (
    | { group: { id: string } }
    | { anyValidServiceToken: unknown }
    | { authContext: { id: string; acId: string; identityProviderId: string } }
    | { authMethod: { authMethod: string } }
    | { azureAD: { id: string; identityProviderId: string } }
    | { certificate: unknown }
    | { commonName: { commonName: string } }
    | { geo: { countryCode: string } }
    | { devicePosture: { integrationUid: string } }
    | { emailDomain: { domain: string } }
    | { emailList: { id: string } }
    | { email: { email: string } }
    | { everyone: unknown }
    | { externalEvaluation: { evaluateUrl: string; keysUrl: string } }
    | {
        githubOrganization: {
          identityProviderId: string;
          name: string;
          team?: string;
        };
      }
    | { gsuite: { email: string; identityProviderId: string } }
    | { loginMethod: { id: string } }
    | { ipList: { id: string } }
    | { ip: { ip: string } }
    | { okta: { identityProviderId: string; name: string } }
    | {
        saml: {
          attributeName: string;
          attributeValue: string;
          identityProviderId: string;
        };
      }
    | {
        oidc: {
          claimName: string;
          claimValue: string;
          identityProviderId: string;
        };
      }
    | { serviceToken: { tokenId: string } }
    | { linkedAppToken: { appUid: string } }
  )[];
  /** Require this application to be served in an isolated browser for users matching this policy. 'Client Web Isolation' must be on for the account in order to use this feature. */
  isolationRequired?: boolean;
  /** The name of the Access policy. */
  name?: string;
  /** The order of execution for this policy. Must be unique for each policy within an app. */
  precedence?: number;
  /** A custom message that will appear on the purpose justification screen. */
  purposeJustificationPrompt?: string;
  /** Require users to enter a justification when they log in to the application. */
  purposeJustificationRequired?: boolean;
  /** Rules evaluated with an AND logical operator. To match the policy, a user must meet all of the Require rules. */
  require?: (
    | { group: { id: string } }
    | { anyValidServiceToken: unknown }
    | { authContext: { id: string; acId: string; identityProviderId: string } }
    | { authMethod: { authMethod: string } }
    | { azureAD: { id: string; identityProviderId: string } }
    | { certificate: unknown }
    | { commonName: { commonName: string } }
    | { geo: { countryCode: string } }
    | { devicePosture: { integrationUid: string } }
    | { emailDomain: { domain: string } }
    | { emailList: { id: string } }
    | { email: { email: string } }
    | { everyone: unknown }
    | { externalEvaluation: { evaluateUrl: string; keysUrl: string } }
    | {
        githubOrganization: {
          identityProviderId: string;
          name: string;
          team?: string;
        };
      }
    | { gsuite: { email: string; identityProviderId: string } }
    | { loginMethod: { id: string } }
    | { ipList: { id: string } }
    | { ip: { ip: string } }
    | { okta: { identityProviderId: string; name: string } }
    | {
        saml: {
          attributeName: string;
          attributeValue: string;
          identityProviderId: string;
        };
      }
    | {
        oidc: {
          claimName: string;
          claimValue: string;
          identityProviderId: string;
        };
      }
    | { serviceToken: { tokenId: string } }
    | { linkedAppToken: { appUid: string } }
  )[];
  /** The amount of time that tokens issued for the application will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
  updatedAt?: string;
}

export const GetAccessApplicationPolicyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
    T.JsonName("approval_groups"),
  ),
  approvalRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("approval_required"),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  decision: Schema.optional(
    Schema.Literal("allow", "bypass", "deny", "non_identity"),
  ),
  exclude: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          group: Schema.Struct({
            id: Schema.String,
          }),
        }),
        Schema.Struct({
          anyValidServiceToken: Schema.Unknown.pipe(
            T.JsonName("any_valid_service_token"),
          ),
        }),
        Schema.Struct({
          authContext: Schema.Struct({
            id: Schema.String,
            acId: Schema.String.pipe(T.JsonName("ac_id")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }).pipe(T.JsonName("auth_context")),
        }),
        Schema.Struct({
          authMethod: Schema.Struct({
            authMethod: Schema.String.pipe(T.JsonName("auth_method")),
          }).pipe(T.JsonName("auth_method")),
        }),
        Schema.Struct({
          azureAD: Schema.Struct({
            id: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          certificate: Schema.Unknown,
        }),
        Schema.Struct({
          commonName: Schema.Struct({
            commonName: Schema.String.pipe(T.JsonName("common_name")),
          }).pipe(T.JsonName("common_name")),
        }),
        Schema.Struct({
          geo: Schema.Struct({
            countryCode: Schema.String.pipe(T.JsonName("country_code")),
          }),
        }),
        Schema.Struct({
          devicePosture: Schema.Struct({
            integrationUid: Schema.String.pipe(T.JsonName("integration_uid")),
          }).pipe(T.JsonName("device_posture")),
        }),
        Schema.Struct({
          emailDomain: Schema.Struct({
            domain: Schema.String,
          }).pipe(T.JsonName("email_domain")),
        }),
        Schema.Struct({
          emailList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("email_list")),
        }),
        Schema.Struct({
          email: Schema.Struct({
            email: Schema.String,
          }),
        }),
        Schema.Struct({
          everyone: Schema.Unknown,
        }),
        Schema.Struct({
          externalEvaluation: Schema.Struct({
            evaluateUrl: Schema.String.pipe(T.JsonName("evaluate_url")),
            keysUrl: Schema.String.pipe(T.JsonName("keys_url")),
          }).pipe(T.JsonName("external_evaluation")),
        }),
        Schema.Struct({
          githubOrganization: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
            team: Schema.optional(Schema.String),
          }).pipe(T.JsonName("'github-organization'")),
        }),
        Schema.Struct({
          gsuite: Schema.Struct({
            email: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          loginMethod: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("login_method")),
        }),
        Schema.Struct({
          ipList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("ip_list")),
        }),
        Schema.Struct({
          ip: Schema.Struct({
            ip: Schema.String,
          }),
        }),
        Schema.Struct({
          okta: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
          }),
        }),
        Schema.Struct({
          saml: Schema.Struct({
            attributeName: Schema.String.pipe(T.JsonName("attribute_name")),
            attributeValue: Schema.String.pipe(T.JsonName("attribute_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          oidc: Schema.Struct({
            claimName: Schema.String.pipe(T.JsonName("claim_name")),
            claimValue: Schema.String.pipe(T.JsonName("claim_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          serviceToken: Schema.Struct({
            tokenId: Schema.String.pipe(T.JsonName("token_id")),
          }).pipe(T.JsonName("service_token")),
        }),
        Schema.Struct({
          linkedAppToken: Schema.Struct({
            appUid: Schema.String.pipe(T.JsonName("app_uid")),
          }).pipe(T.JsonName("linked_app_token")),
        }),
      ),
    ),
  ),
  include: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          group: Schema.Struct({
            id: Schema.String,
          }),
        }),
        Schema.Struct({
          anyValidServiceToken: Schema.Unknown.pipe(
            T.JsonName("any_valid_service_token"),
          ),
        }),
        Schema.Struct({
          authContext: Schema.Struct({
            id: Schema.String,
            acId: Schema.String.pipe(T.JsonName("ac_id")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }).pipe(T.JsonName("auth_context")),
        }),
        Schema.Struct({
          authMethod: Schema.Struct({
            authMethod: Schema.String.pipe(T.JsonName("auth_method")),
          }).pipe(T.JsonName("auth_method")),
        }),
        Schema.Struct({
          azureAD: Schema.Struct({
            id: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          certificate: Schema.Unknown,
        }),
        Schema.Struct({
          commonName: Schema.Struct({
            commonName: Schema.String.pipe(T.JsonName("common_name")),
          }).pipe(T.JsonName("common_name")),
        }),
        Schema.Struct({
          geo: Schema.Struct({
            countryCode: Schema.String.pipe(T.JsonName("country_code")),
          }),
        }),
        Schema.Struct({
          devicePosture: Schema.Struct({
            integrationUid: Schema.String.pipe(T.JsonName("integration_uid")),
          }).pipe(T.JsonName("device_posture")),
        }),
        Schema.Struct({
          emailDomain: Schema.Struct({
            domain: Schema.String,
          }).pipe(T.JsonName("email_domain")),
        }),
        Schema.Struct({
          emailList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("email_list")),
        }),
        Schema.Struct({
          email: Schema.Struct({
            email: Schema.String,
          }),
        }),
        Schema.Struct({
          everyone: Schema.Unknown,
        }),
        Schema.Struct({
          externalEvaluation: Schema.Struct({
            evaluateUrl: Schema.String.pipe(T.JsonName("evaluate_url")),
            keysUrl: Schema.String.pipe(T.JsonName("keys_url")),
          }).pipe(T.JsonName("external_evaluation")),
        }),
        Schema.Struct({
          githubOrganization: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
            team: Schema.optional(Schema.String),
          }).pipe(T.JsonName("'github-organization'")),
        }),
        Schema.Struct({
          gsuite: Schema.Struct({
            email: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          loginMethod: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("login_method")),
        }),
        Schema.Struct({
          ipList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("ip_list")),
        }),
        Schema.Struct({
          ip: Schema.Struct({
            ip: Schema.String,
          }),
        }),
        Schema.Struct({
          okta: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
          }),
        }),
        Schema.Struct({
          saml: Schema.Struct({
            attributeName: Schema.String.pipe(T.JsonName("attribute_name")),
            attributeValue: Schema.String.pipe(T.JsonName("attribute_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          oidc: Schema.Struct({
            claimName: Schema.String.pipe(T.JsonName("claim_name")),
            claimValue: Schema.String.pipe(T.JsonName("claim_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          serviceToken: Schema.Struct({
            tokenId: Schema.String.pipe(T.JsonName("token_id")),
          }).pipe(T.JsonName("service_token")),
        }),
        Schema.Struct({
          linkedAppToken: Schema.Struct({
            appUid: Schema.String.pipe(T.JsonName("app_uid")),
          }).pipe(T.JsonName("linked_app_token")),
        }),
      ),
    ),
  ),
  isolationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("isolation_required"),
  ),
  name: Schema.optional(Schema.String),
  precedence: Schema.optional(Schema.Number),
  purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
    T.JsonName("purpose_justification_prompt"),
  ),
  purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("purpose_justification_required"),
  ),
  require: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          group: Schema.Struct({
            id: Schema.String,
          }),
        }),
        Schema.Struct({
          anyValidServiceToken: Schema.Unknown.pipe(
            T.JsonName("any_valid_service_token"),
          ),
        }),
        Schema.Struct({
          authContext: Schema.Struct({
            id: Schema.String,
            acId: Schema.String.pipe(T.JsonName("ac_id")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }).pipe(T.JsonName("auth_context")),
        }),
        Schema.Struct({
          authMethod: Schema.Struct({
            authMethod: Schema.String.pipe(T.JsonName("auth_method")),
          }).pipe(T.JsonName("auth_method")),
        }),
        Schema.Struct({
          azureAD: Schema.Struct({
            id: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          certificate: Schema.Unknown,
        }),
        Schema.Struct({
          commonName: Schema.Struct({
            commonName: Schema.String.pipe(T.JsonName("common_name")),
          }).pipe(T.JsonName("common_name")),
        }),
        Schema.Struct({
          geo: Schema.Struct({
            countryCode: Schema.String.pipe(T.JsonName("country_code")),
          }),
        }),
        Schema.Struct({
          devicePosture: Schema.Struct({
            integrationUid: Schema.String.pipe(T.JsonName("integration_uid")),
          }).pipe(T.JsonName("device_posture")),
        }),
        Schema.Struct({
          emailDomain: Schema.Struct({
            domain: Schema.String,
          }).pipe(T.JsonName("email_domain")),
        }),
        Schema.Struct({
          emailList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("email_list")),
        }),
        Schema.Struct({
          email: Schema.Struct({
            email: Schema.String,
          }),
        }),
        Schema.Struct({
          everyone: Schema.Unknown,
        }),
        Schema.Struct({
          externalEvaluation: Schema.Struct({
            evaluateUrl: Schema.String.pipe(T.JsonName("evaluate_url")),
            keysUrl: Schema.String.pipe(T.JsonName("keys_url")),
          }).pipe(T.JsonName("external_evaluation")),
        }),
        Schema.Struct({
          githubOrganization: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
            team: Schema.optional(Schema.String),
          }).pipe(T.JsonName("'github-organization'")),
        }),
        Schema.Struct({
          gsuite: Schema.Struct({
            email: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          loginMethod: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("login_method")),
        }),
        Schema.Struct({
          ipList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("ip_list")),
        }),
        Schema.Struct({
          ip: Schema.Struct({
            ip: Schema.String,
          }),
        }),
        Schema.Struct({
          okta: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
          }),
        }),
        Schema.Struct({
          saml: Schema.Struct({
            attributeName: Schema.String.pipe(T.JsonName("attribute_name")),
            attributeValue: Schema.String.pipe(T.JsonName("attribute_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          oidc: Schema.Struct({
            claimName: Schema.String.pipe(T.JsonName("claim_name")),
            claimValue: Schema.String.pipe(T.JsonName("claim_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          serviceToken: Schema.Struct({
            tokenId: Schema.String.pipe(T.JsonName("token_id")),
          }).pipe(T.JsonName("service_token")),
        }),
        Schema.Struct({
          linkedAppToken: Schema.Struct({
            appUid: Schema.String.pipe(T.JsonName("app_uid")),
          }).pipe(T.JsonName("linked_app_token")),
        }),
      ),
    ),
  ),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<GetAccessApplicationPolicyResponse>;

export const getAccessApplicationPolicy: (
  input: GetAccessApplicationPolicyRequest,
) => Effect.Effect<
  GetAccessApplicationPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessApplicationPolicyRequest,
  output: GetAccessApplicationPolicyResponse,
  errors: [],
}));

export interface CreateAccessApplicationPolicyRequest {
  appId: string;
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Administrators who can approve a temporary authentication request. */
  approvalGroups?: unknown[];
  /** Body param: Requires the user to request access from an administrator at the start of each session. */
  approvalRequired?: boolean;
  /** Body param: Require this application to be served in an isolated browser for users matching this policy. 'Client Web Isolation' must be on for the account in order to use this feature. */
  isolationRequired?: boolean;
  /** Body param: The order of execution for this policy. Must be unique for each policy within an app. */
  precedence?: number;
  /** Body param: A custom message that will appear on the purpose justification screen. */
  purposeJustificationPrompt?: string;
  /** Body param: Require users to enter a justification when they log in to the application. */
  purposeJustificationRequired?: boolean;
  /** Body param: The amount of time that tokens issued for the application will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
}

export const CreateAccessApplicationPolicyRequest = Schema.Struct({
  appId: Schema.String.pipe(T.HttpPath("appId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
    T.JsonName("approval_groups"),
  ),
  approvalRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("approval_required"),
  ),
  isolationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("isolation_required"),
  ),
  precedence: Schema.optional(Schema.Number),
  purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
    T.JsonName("purpose_justification_prompt"),
  ),
  purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("purpose_justification_required"),
  ),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}/policies",
  }),
) as unknown as Schema.Schema<CreateAccessApplicationPolicyRequest>;

export interface CreateAccessApplicationPolicyResponse {
  /** The UUID of the policy */
  id?: string;
  /** Administrators who can approve a temporary authentication request. */
  approvalGroups?: unknown[];
  /** Requires the user to request access from an administrator at the start of each session. */
  approvalRequired?: boolean;
  createdAt?: string;
  /** The action Access will take if a user matches this policy. Infrastructure application policies can only use the Allow action. */
  decision?: "allow" | "bypass" | "deny" | "non_identity";
  /** Rules evaluated with a NOT logical operator. To match the policy, a user cannot meet any of the Exclude rules. */
  exclude?: (
    | { group: { id: string } }
    | { anyValidServiceToken: unknown }
    | { authContext: { id: string; acId: string; identityProviderId: string } }
    | { authMethod: { authMethod: string } }
    | { azureAD: { id: string; identityProviderId: string } }
    | { certificate: unknown }
    | { commonName: { commonName: string } }
    | { geo: { countryCode: string } }
    | { devicePosture: { integrationUid: string } }
    | { emailDomain: { domain: string } }
    | { emailList: { id: string } }
    | { email: { email: string } }
    | { everyone: unknown }
    | { externalEvaluation: { evaluateUrl: string; keysUrl: string } }
    | {
        githubOrganization: {
          identityProviderId: string;
          name: string;
          team?: string;
        };
      }
    | { gsuite: { email: string; identityProviderId: string } }
    | { loginMethod: { id: string } }
    | { ipList: { id: string } }
    | { ip: { ip: string } }
    | { okta: { identityProviderId: string; name: string } }
    | {
        saml: {
          attributeName: string;
          attributeValue: string;
          identityProviderId: string;
        };
      }
    | {
        oidc: {
          claimName: string;
          claimValue: string;
          identityProviderId: string;
        };
      }
    | { serviceToken: { tokenId: string } }
    | { linkedAppToken: { appUid: string } }
  )[];
  /** Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include?: (
    | { group: { id: string } }
    | { anyValidServiceToken: unknown }
    | { authContext: { id: string; acId: string; identityProviderId: string } }
    | { authMethod: { authMethod: string } }
    | { azureAD: { id: string; identityProviderId: string } }
    | { certificate: unknown }
    | { commonName: { commonName: string } }
    | { geo: { countryCode: string } }
    | { devicePosture: { integrationUid: string } }
    | { emailDomain: { domain: string } }
    | { emailList: { id: string } }
    | { email: { email: string } }
    | { everyone: unknown }
    | { externalEvaluation: { evaluateUrl: string; keysUrl: string } }
    | {
        githubOrganization: {
          identityProviderId: string;
          name: string;
          team?: string;
        };
      }
    | { gsuite: { email: string; identityProviderId: string } }
    | { loginMethod: { id: string } }
    | { ipList: { id: string } }
    | { ip: { ip: string } }
    | { okta: { identityProviderId: string; name: string } }
    | {
        saml: {
          attributeName: string;
          attributeValue: string;
          identityProviderId: string;
        };
      }
    | {
        oidc: {
          claimName: string;
          claimValue: string;
          identityProviderId: string;
        };
      }
    | { serviceToken: { tokenId: string } }
    | { linkedAppToken: { appUid: string } }
  )[];
  /** Require this application to be served in an isolated browser for users matching this policy. 'Client Web Isolation' must be on for the account in order to use this feature. */
  isolationRequired?: boolean;
  /** The name of the Access policy. */
  name?: string;
  /** The order of execution for this policy. Must be unique for each policy within an app. */
  precedence?: number;
  /** A custom message that will appear on the purpose justification screen. */
  purposeJustificationPrompt?: string;
  /** Require users to enter a justification when they log in to the application. */
  purposeJustificationRequired?: boolean;
  /** Rules evaluated with an AND logical operator. To match the policy, a user must meet all of the Require rules. */
  require?: (
    | { group: { id: string } }
    | { anyValidServiceToken: unknown }
    | { authContext: { id: string; acId: string; identityProviderId: string } }
    | { authMethod: { authMethod: string } }
    | { azureAD: { id: string; identityProviderId: string } }
    | { certificate: unknown }
    | { commonName: { commonName: string } }
    | { geo: { countryCode: string } }
    | { devicePosture: { integrationUid: string } }
    | { emailDomain: { domain: string } }
    | { emailList: { id: string } }
    | { email: { email: string } }
    | { everyone: unknown }
    | { externalEvaluation: { evaluateUrl: string; keysUrl: string } }
    | {
        githubOrganization: {
          identityProviderId: string;
          name: string;
          team?: string;
        };
      }
    | { gsuite: { email: string; identityProviderId: string } }
    | { loginMethod: { id: string } }
    | { ipList: { id: string } }
    | { ip: { ip: string } }
    | { okta: { identityProviderId: string; name: string } }
    | {
        saml: {
          attributeName: string;
          attributeValue: string;
          identityProviderId: string;
        };
      }
    | {
        oidc: {
          claimName: string;
          claimValue: string;
          identityProviderId: string;
        };
      }
    | { serviceToken: { tokenId: string } }
    | { linkedAppToken: { appUid: string } }
  )[];
  /** The amount of time that tokens issued for the application will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
  updatedAt?: string;
}

export const CreateAccessApplicationPolicyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
    T.JsonName("approval_groups"),
  ),
  approvalRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("approval_required"),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  decision: Schema.optional(
    Schema.Literal("allow", "bypass", "deny", "non_identity"),
  ),
  exclude: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          group: Schema.Struct({
            id: Schema.String,
          }),
        }),
        Schema.Struct({
          anyValidServiceToken: Schema.Unknown.pipe(
            T.JsonName("any_valid_service_token"),
          ),
        }),
        Schema.Struct({
          authContext: Schema.Struct({
            id: Schema.String,
            acId: Schema.String.pipe(T.JsonName("ac_id")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }).pipe(T.JsonName("auth_context")),
        }),
        Schema.Struct({
          authMethod: Schema.Struct({
            authMethod: Schema.String.pipe(T.JsonName("auth_method")),
          }).pipe(T.JsonName("auth_method")),
        }),
        Schema.Struct({
          azureAD: Schema.Struct({
            id: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          certificate: Schema.Unknown,
        }),
        Schema.Struct({
          commonName: Schema.Struct({
            commonName: Schema.String.pipe(T.JsonName("common_name")),
          }).pipe(T.JsonName("common_name")),
        }),
        Schema.Struct({
          geo: Schema.Struct({
            countryCode: Schema.String.pipe(T.JsonName("country_code")),
          }),
        }),
        Schema.Struct({
          devicePosture: Schema.Struct({
            integrationUid: Schema.String.pipe(T.JsonName("integration_uid")),
          }).pipe(T.JsonName("device_posture")),
        }),
        Schema.Struct({
          emailDomain: Schema.Struct({
            domain: Schema.String,
          }).pipe(T.JsonName("email_domain")),
        }),
        Schema.Struct({
          emailList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("email_list")),
        }),
        Schema.Struct({
          email: Schema.Struct({
            email: Schema.String,
          }),
        }),
        Schema.Struct({
          everyone: Schema.Unknown,
        }),
        Schema.Struct({
          externalEvaluation: Schema.Struct({
            evaluateUrl: Schema.String.pipe(T.JsonName("evaluate_url")),
            keysUrl: Schema.String.pipe(T.JsonName("keys_url")),
          }).pipe(T.JsonName("external_evaluation")),
        }),
        Schema.Struct({
          githubOrganization: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
            team: Schema.optional(Schema.String),
          }).pipe(T.JsonName("'github-organization'")),
        }),
        Schema.Struct({
          gsuite: Schema.Struct({
            email: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          loginMethod: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("login_method")),
        }),
        Schema.Struct({
          ipList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("ip_list")),
        }),
        Schema.Struct({
          ip: Schema.Struct({
            ip: Schema.String,
          }),
        }),
        Schema.Struct({
          okta: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
          }),
        }),
        Schema.Struct({
          saml: Schema.Struct({
            attributeName: Schema.String.pipe(T.JsonName("attribute_name")),
            attributeValue: Schema.String.pipe(T.JsonName("attribute_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          oidc: Schema.Struct({
            claimName: Schema.String.pipe(T.JsonName("claim_name")),
            claimValue: Schema.String.pipe(T.JsonName("claim_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          serviceToken: Schema.Struct({
            tokenId: Schema.String.pipe(T.JsonName("token_id")),
          }).pipe(T.JsonName("service_token")),
        }),
        Schema.Struct({
          linkedAppToken: Schema.Struct({
            appUid: Schema.String.pipe(T.JsonName("app_uid")),
          }).pipe(T.JsonName("linked_app_token")),
        }),
      ),
    ),
  ),
  include: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          group: Schema.Struct({
            id: Schema.String,
          }),
        }),
        Schema.Struct({
          anyValidServiceToken: Schema.Unknown.pipe(
            T.JsonName("any_valid_service_token"),
          ),
        }),
        Schema.Struct({
          authContext: Schema.Struct({
            id: Schema.String,
            acId: Schema.String.pipe(T.JsonName("ac_id")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }).pipe(T.JsonName("auth_context")),
        }),
        Schema.Struct({
          authMethod: Schema.Struct({
            authMethod: Schema.String.pipe(T.JsonName("auth_method")),
          }).pipe(T.JsonName("auth_method")),
        }),
        Schema.Struct({
          azureAD: Schema.Struct({
            id: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          certificate: Schema.Unknown,
        }),
        Schema.Struct({
          commonName: Schema.Struct({
            commonName: Schema.String.pipe(T.JsonName("common_name")),
          }).pipe(T.JsonName("common_name")),
        }),
        Schema.Struct({
          geo: Schema.Struct({
            countryCode: Schema.String.pipe(T.JsonName("country_code")),
          }),
        }),
        Schema.Struct({
          devicePosture: Schema.Struct({
            integrationUid: Schema.String.pipe(T.JsonName("integration_uid")),
          }).pipe(T.JsonName("device_posture")),
        }),
        Schema.Struct({
          emailDomain: Schema.Struct({
            domain: Schema.String,
          }).pipe(T.JsonName("email_domain")),
        }),
        Schema.Struct({
          emailList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("email_list")),
        }),
        Schema.Struct({
          email: Schema.Struct({
            email: Schema.String,
          }),
        }),
        Schema.Struct({
          everyone: Schema.Unknown,
        }),
        Schema.Struct({
          externalEvaluation: Schema.Struct({
            evaluateUrl: Schema.String.pipe(T.JsonName("evaluate_url")),
            keysUrl: Schema.String.pipe(T.JsonName("keys_url")),
          }).pipe(T.JsonName("external_evaluation")),
        }),
        Schema.Struct({
          githubOrganization: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
            team: Schema.optional(Schema.String),
          }).pipe(T.JsonName("'github-organization'")),
        }),
        Schema.Struct({
          gsuite: Schema.Struct({
            email: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          loginMethod: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("login_method")),
        }),
        Schema.Struct({
          ipList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("ip_list")),
        }),
        Schema.Struct({
          ip: Schema.Struct({
            ip: Schema.String,
          }),
        }),
        Schema.Struct({
          okta: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
          }),
        }),
        Schema.Struct({
          saml: Schema.Struct({
            attributeName: Schema.String.pipe(T.JsonName("attribute_name")),
            attributeValue: Schema.String.pipe(T.JsonName("attribute_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          oidc: Schema.Struct({
            claimName: Schema.String.pipe(T.JsonName("claim_name")),
            claimValue: Schema.String.pipe(T.JsonName("claim_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          serviceToken: Schema.Struct({
            tokenId: Schema.String.pipe(T.JsonName("token_id")),
          }).pipe(T.JsonName("service_token")),
        }),
        Schema.Struct({
          linkedAppToken: Schema.Struct({
            appUid: Schema.String.pipe(T.JsonName("app_uid")),
          }).pipe(T.JsonName("linked_app_token")),
        }),
      ),
    ),
  ),
  isolationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("isolation_required"),
  ),
  name: Schema.optional(Schema.String),
  precedence: Schema.optional(Schema.Number),
  purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
    T.JsonName("purpose_justification_prompt"),
  ),
  purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("purpose_justification_required"),
  ),
  require: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          group: Schema.Struct({
            id: Schema.String,
          }),
        }),
        Schema.Struct({
          anyValidServiceToken: Schema.Unknown.pipe(
            T.JsonName("any_valid_service_token"),
          ),
        }),
        Schema.Struct({
          authContext: Schema.Struct({
            id: Schema.String,
            acId: Schema.String.pipe(T.JsonName("ac_id")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }).pipe(T.JsonName("auth_context")),
        }),
        Schema.Struct({
          authMethod: Schema.Struct({
            authMethod: Schema.String.pipe(T.JsonName("auth_method")),
          }).pipe(T.JsonName("auth_method")),
        }),
        Schema.Struct({
          azureAD: Schema.Struct({
            id: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          certificate: Schema.Unknown,
        }),
        Schema.Struct({
          commonName: Schema.Struct({
            commonName: Schema.String.pipe(T.JsonName("common_name")),
          }).pipe(T.JsonName("common_name")),
        }),
        Schema.Struct({
          geo: Schema.Struct({
            countryCode: Schema.String.pipe(T.JsonName("country_code")),
          }),
        }),
        Schema.Struct({
          devicePosture: Schema.Struct({
            integrationUid: Schema.String.pipe(T.JsonName("integration_uid")),
          }).pipe(T.JsonName("device_posture")),
        }),
        Schema.Struct({
          emailDomain: Schema.Struct({
            domain: Schema.String,
          }).pipe(T.JsonName("email_domain")),
        }),
        Schema.Struct({
          emailList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("email_list")),
        }),
        Schema.Struct({
          email: Schema.Struct({
            email: Schema.String,
          }),
        }),
        Schema.Struct({
          everyone: Schema.Unknown,
        }),
        Schema.Struct({
          externalEvaluation: Schema.Struct({
            evaluateUrl: Schema.String.pipe(T.JsonName("evaluate_url")),
            keysUrl: Schema.String.pipe(T.JsonName("keys_url")),
          }).pipe(T.JsonName("external_evaluation")),
        }),
        Schema.Struct({
          githubOrganization: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
            team: Schema.optional(Schema.String),
          }).pipe(T.JsonName("'github-organization'")),
        }),
        Schema.Struct({
          gsuite: Schema.Struct({
            email: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          loginMethod: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("login_method")),
        }),
        Schema.Struct({
          ipList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("ip_list")),
        }),
        Schema.Struct({
          ip: Schema.Struct({
            ip: Schema.String,
          }),
        }),
        Schema.Struct({
          okta: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
          }),
        }),
        Schema.Struct({
          saml: Schema.Struct({
            attributeName: Schema.String.pipe(T.JsonName("attribute_name")),
            attributeValue: Schema.String.pipe(T.JsonName("attribute_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          oidc: Schema.Struct({
            claimName: Schema.String.pipe(T.JsonName("claim_name")),
            claimValue: Schema.String.pipe(T.JsonName("claim_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          serviceToken: Schema.Struct({
            tokenId: Schema.String.pipe(T.JsonName("token_id")),
          }).pipe(T.JsonName("service_token")),
        }),
        Schema.Struct({
          linkedAppToken: Schema.Struct({
            appUid: Schema.String.pipe(T.JsonName("app_uid")),
          }).pipe(T.JsonName("linked_app_token")),
        }),
      ),
    ),
  ),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<CreateAccessApplicationPolicyResponse>;

export const createAccessApplicationPolicy: (
  input: CreateAccessApplicationPolicyRequest,
) => Effect.Effect<
  CreateAccessApplicationPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessApplicationPolicyRequest,
  output: CreateAccessApplicationPolicyResponse,
  errors: [],
}));

export interface UpdateAccessApplicationPolicyRequest {
  appId: string;
  policyId: string;
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Administrators who can approve a temporary authentication request. */
  approvalGroups?: unknown[];
  /** Body param: Requires the user to request access from an administrator at the start of each session. */
  approvalRequired?: boolean;
  /** Body param: Require this application to be served in an isolated browser for users matching this policy. 'Client Web Isolation' must be on for the account in order to use this feature. */
  isolationRequired?: boolean;
  /** Body param: The order of execution for this policy. Must be unique for each policy within an app. */
  precedence?: number;
  /** Body param: A custom message that will appear on the purpose justification screen. */
  purposeJustificationPrompt?: string;
  /** Body param: Require users to enter a justification when they log in to the application. */
  purposeJustificationRequired?: boolean;
  /** Body param: The amount of time that tokens issued for the application will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
}

export const UpdateAccessApplicationPolicyRequest = Schema.Struct({
  appId: Schema.String.pipe(T.HttpPath("appId")),
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
    T.JsonName("approval_groups"),
  ),
  approvalRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("approval_required"),
  ),
  isolationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("isolation_required"),
  ),
  precedence: Schema.optional(Schema.Number),
  purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
    T.JsonName("purpose_justification_prompt"),
  ),
  purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("purpose_justification_required"),
  ),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}/policies/{policyId}",
  }),
) as unknown as Schema.Schema<UpdateAccessApplicationPolicyRequest>;

export interface UpdateAccessApplicationPolicyResponse {
  /** The UUID of the policy */
  id?: string;
  /** Administrators who can approve a temporary authentication request. */
  approvalGroups?: unknown[];
  /** Requires the user to request access from an administrator at the start of each session. */
  approvalRequired?: boolean;
  createdAt?: string;
  /** The action Access will take if a user matches this policy. Infrastructure application policies can only use the Allow action. */
  decision?: "allow" | "bypass" | "deny" | "non_identity";
  /** Rules evaluated with a NOT logical operator. To match the policy, a user cannot meet any of the Exclude rules. */
  exclude?: (
    | { group: { id: string } }
    | { anyValidServiceToken: unknown }
    | { authContext: { id: string; acId: string; identityProviderId: string } }
    | { authMethod: { authMethod: string } }
    | { azureAD: { id: string; identityProviderId: string } }
    | { certificate: unknown }
    | { commonName: { commonName: string } }
    | { geo: { countryCode: string } }
    | { devicePosture: { integrationUid: string } }
    | { emailDomain: { domain: string } }
    | { emailList: { id: string } }
    | { email: { email: string } }
    | { everyone: unknown }
    | { externalEvaluation: { evaluateUrl: string; keysUrl: string } }
    | {
        githubOrganization: {
          identityProviderId: string;
          name: string;
          team?: string;
        };
      }
    | { gsuite: { email: string; identityProviderId: string } }
    | { loginMethod: { id: string } }
    | { ipList: { id: string } }
    | { ip: { ip: string } }
    | { okta: { identityProviderId: string; name: string } }
    | {
        saml: {
          attributeName: string;
          attributeValue: string;
          identityProviderId: string;
        };
      }
    | {
        oidc: {
          claimName: string;
          claimValue: string;
          identityProviderId: string;
        };
      }
    | { serviceToken: { tokenId: string } }
    | { linkedAppToken: { appUid: string } }
  )[];
  /** Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include?: (
    | { group: { id: string } }
    | { anyValidServiceToken: unknown }
    | { authContext: { id: string; acId: string; identityProviderId: string } }
    | { authMethod: { authMethod: string } }
    | { azureAD: { id: string; identityProviderId: string } }
    | { certificate: unknown }
    | { commonName: { commonName: string } }
    | { geo: { countryCode: string } }
    | { devicePosture: { integrationUid: string } }
    | { emailDomain: { domain: string } }
    | { emailList: { id: string } }
    | { email: { email: string } }
    | { everyone: unknown }
    | { externalEvaluation: { evaluateUrl: string; keysUrl: string } }
    | {
        githubOrganization: {
          identityProviderId: string;
          name: string;
          team?: string;
        };
      }
    | { gsuite: { email: string; identityProviderId: string } }
    | { loginMethod: { id: string } }
    | { ipList: { id: string } }
    | { ip: { ip: string } }
    | { okta: { identityProviderId: string; name: string } }
    | {
        saml: {
          attributeName: string;
          attributeValue: string;
          identityProviderId: string;
        };
      }
    | {
        oidc: {
          claimName: string;
          claimValue: string;
          identityProviderId: string;
        };
      }
    | { serviceToken: { tokenId: string } }
    | { linkedAppToken: { appUid: string } }
  )[];
  /** Require this application to be served in an isolated browser for users matching this policy. 'Client Web Isolation' must be on for the account in order to use this feature. */
  isolationRequired?: boolean;
  /** The name of the Access policy. */
  name?: string;
  /** The order of execution for this policy. Must be unique for each policy within an app. */
  precedence?: number;
  /** A custom message that will appear on the purpose justification screen. */
  purposeJustificationPrompt?: string;
  /** Require users to enter a justification when they log in to the application. */
  purposeJustificationRequired?: boolean;
  /** Rules evaluated with an AND logical operator. To match the policy, a user must meet all of the Require rules. */
  require?: (
    | { group: { id: string } }
    | { anyValidServiceToken: unknown }
    | { authContext: { id: string; acId: string; identityProviderId: string } }
    | { authMethod: { authMethod: string } }
    | { azureAD: { id: string; identityProviderId: string } }
    | { certificate: unknown }
    | { commonName: { commonName: string } }
    | { geo: { countryCode: string } }
    | { devicePosture: { integrationUid: string } }
    | { emailDomain: { domain: string } }
    | { emailList: { id: string } }
    | { email: { email: string } }
    | { everyone: unknown }
    | { externalEvaluation: { evaluateUrl: string; keysUrl: string } }
    | {
        githubOrganization: {
          identityProviderId: string;
          name: string;
          team?: string;
        };
      }
    | { gsuite: { email: string; identityProviderId: string } }
    | { loginMethod: { id: string } }
    | { ipList: { id: string } }
    | { ip: { ip: string } }
    | { okta: { identityProviderId: string; name: string } }
    | {
        saml: {
          attributeName: string;
          attributeValue: string;
          identityProviderId: string;
        };
      }
    | {
        oidc: {
          claimName: string;
          claimValue: string;
          identityProviderId: string;
        };
      }
    | { serviceToken: { tokenId: string } }
    | { linkedAppToken: { appUid: string } }
  )[];
  /** The amount of time that tokens issued for the application will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
  updatedAt?: string;
}

export const UpdateAccessApplicationPolicyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
    T.JsonName("approval_groups"),
  ),
  approvalRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("approval_required"),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  decision: Schema.optional(
    Schema.Literal("allow", "bypass", "deny", "non_identity"),
  ),
  exclude: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          group: Schema.Struct({
            id: Schema.String,
          }),
        }),
        Schema.Struct({
          anyValidServiceToken: Schema.Unknown.pipe(
            T.JsonName("any_valid_service_token"),
          ),
        }),
        Schema.Struct({
          authContext: Schema.Struct({
            id: Schema.String,
            acId: Schema.String.pipe(T.JsonName("ac_id")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }).pipe(T.JsonName("auth_context")),
        }),
        Schema.Struct({
          authMethod: Schema.Struct({
            authMethod: Schema.String.pipe(T.JsonName("auth_method")),
          }).pipe(T.JsonName("auth_method")),
        }),
        Schema.Struct({
          azureAD: Schema.Struct({
            id: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          certificate: Schema.Unknown,
        }),
        Schema.Struct({
          commonName: Schema.Struct({
            commonName: Schema.String.pipe(T.JsonName("common_name")),
          }).pipe(T.JsonName("common_name")),
        }),
        Schema.Struct({
          geo: Schema.Struct({
            countryCode: Schema.String.pipe(T.JsonName("country_code")),
          }),
        }),
        Schema.Struct({
          devicePosture: Schema.Struct({
            integrationUid: Schema.String.pipe(T.JsonName("integration_uid")),
          }).pipe(T.JsonName("device_posture")),
        }),
        Schema.Struct({
          emailDomain: Schema.Struct({
            domain: Schema.String,
          }).pipe(T.JsonName("email_domain")),
        }),
        Schema.Struct({
          emailList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("email_list")),
        }),
        Schema.Struct({
          email: Schema.Struct({
            email: Schema.String,
          }),
        }),
        Schema.Struct({
          everyone: Schema.Unknown,
        }),
        Schema.Struct({
          externalEvaluation: Schema.Struct({
            evaluateUrl: Schema.String.pipe(T.JsonName("evaluate_url")),
            keysUrl: Schema.String.pipe(T.JsonName("keys_url")),
          }).pipe(T.JsonName("external_evaluation")),
        }),
        Schema.Struct({
          githubOrganization: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
            team: Schema.optional(Schema.String),
          }).pipe(T.JsonName("'github-organization'")),
        }),
        Schema.Struct({
          gsuite: Schema.Struct({
            email: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          loginMethod: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("login_method")),
        }),
        Schema.Struct({
          ipList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("ip_list")),
        }),
        Schema.Struct({
          ip: Schema.Struct({
            ip: Schema.String,
          }),
        }),
        Schema.Struct({
          okta: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
          }),
        }),
        Schema.Struct({
          saml: Schema.Struct({
            attributeName: Schema.String.pipe(T.JsonName("attribute_name")),
            attributeValue: Schema.String.pipe(T.JsonName("attribute_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          oidc: Schema.Struct({
            claimName: Schema.String.pipe(T.JsonName("claim_name")),
            claimValue: Schema.String.pipe(T.JsonName("claim_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          serviceToken: Schema.Struct({
            tokenId: Schema.String.pipe(T.JsonName("token_id")),
          }).pipe(T.JsonName("service_token")),
        }),
        Schema.Struct({
          linkedAppToken: Schema.Struct({
            appUid: Schema.String.pipe(T.JsonName("app_uid")),
          }).pipe(T.JsonName("linked_app_token")),
        }),
      ),
    ),
  ),
  include: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          group: Schema.Struct({
            id: Schema.String,
          }),
        }),
        Schema.Struct({
          anyValidServiceToken: Schema.Unknown.pipe(
            T.JsonName("any_valid_service_token"),
          ),
        }),
        Schema.Struct({
          authContext: Schema.Struct({
            id: Schema.String,
            acId: Schema.String.pipe(T.JsonName("ac_id")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }).pipe(T.JsonName("auth_context")),
        }),
        Schema.Struct({
          authMethod: Schema.Struct({
            authMethod: Schema.String.pipe(T.JsonName("auth_method")),
          }).pipe(T.JsonName("auth_method")),
        }),
        Schema.Struct({
          azureAD: Schema.Struct({
            id: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          certificate: Schema.Unknown,
        }),
        Schema.Struct({
          commonName: Schema.Struct({
            commonName: Schema.String.pipe(T.JsonName("common_name")),
          }).pipe(T.JsonName("common_name")),
        }),
        Schema.Struct({
          geo: Schema.Struct({
            countryCode: Schema.String.pipe(T.JsonName("country_code")),
          }),
        }),
        Schema.Struct({
          devicePosture: Schema.Struct({
            integrationUid: Schema.String.pipe(T.JsonName("integration_uid")),
          }).pipe(T.JsonName("device_posture")),
        }),
        Schema.Struct({
          emailDomain: Schema.Struct({
            domain: Schema.String,
          }).pipe(T.JsonName("email_domain")),
        }),
        Schema.Struct({
          emailList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("email_list")),
        }),
        Schema.Struct({
          email: Schema.Struct({
            email: Schema.String,
          }),
        }),
        Schema.Struct({
          everyone: Schema.Unknown,
        }),
        Schema.Struct({
          externalEvaluation: Schema.Struct({
            evaluateUrl: Schema.String.pipe(T.JsonName("evaluate_url")),
            keysUrl: Schema.String.pipe(T.JsonName("keys_url")),
          }).pipe(T.JsonName("external_evaluation")),
        }),
        Schema.Struct({
          githubOrganization: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
            team: Schema.optional(Schema.String),
          }).pipe(T.JsonName("'github-organization'")),
        }),
        Schema.Struct({
          gsuite: Schema.Struct({
            email: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          loginMethod: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("login_method")),
        }),
        Schema.Struct({
          ipList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("ip_list")),
        }),
        Schema.Struct({
          ip: Schema.Struct({
            ip: Schema.String,
          }),
        }),
        Schema.Struct({
          okta: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
          }),
        }),
        Schema.Struct({
          saml: Schema.Struct({
            attributeName: Schema.String.pipe(T.JsonName("attribute_name")),
            attributeValue: Schema.String.pipe(T.JsonName("attribute_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          oidc: Schema.Struct({
            claimName: Schema.String.pipe(T.JsonName("claim_name")),
            claimValue: Schema.String.pipe(T.JsonName("claim_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          serviceToken: Schema.Struct({
            tokenId: Schema.String.pipe(T.JsonName("token_id")),
          }).pipe(T.JsonName("service_token")),
        }),
        Schema.Struct({
          linkedAppToken: Schema.Struct({
            appUid: Schema.String.pipe(T.JsonName("app_uid")),
          }).pipe(T.JsonName("linked_app_token")),
        }),
      ),
    ),
  ),
  isolationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("isolation_required"),
  ),
  name: Schema.optional(Schema.String),
  precedence: Schema.optional(Schema.Number),
  purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
    T.JsonName("purpose_justification_prompt"),
  ),
  purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("purpose_justification_required"),
  ),
  require: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          group: Schema.Struct({
            id: Schema.String,
          }),
        }),
        Schema.Struct({
          anyValidServiceToken: Schema.Unknown.pipe(
            T.JsonName("any_valid_service_token"),
          ),
        }),
        Schema.Struct({
          authContext: Schema.Struct({
            id: Schema.String,
            acId: Schema.String.pipe(T.JsonName("ac_id")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }).pipe(T.JsonName("auth_context")),
        }),
        Schema.Struct({
          authMethod: Schema.Struct({
            authMethod: Schema.String.pipe(T.JsonName("auth_method")),
          }).pipe(T.JsonName("auth_method")),
        }),
        Schema.Struct({
          azureAD: Schema.Struct({
            id: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          certificate: Schema.Unknown,
        }),
        Schema.Struct({
          commonName: Schema.Struct({
            commonName: Schema.String.pipe(T.JsonName("common_name")),
          }).pipe(T.JsonName("common_name")),
        }),
        Schema.Struct({
          geo: Schema.Struct({
            countryCode: Schema.String.pipe(T.JsonName("country_code")),
          }),
        }),
        Schema.Struct({
          devicePosture: Schema.Struct({
            integrationUid: Schema.String.pipe(T.JsonName("integration_uid")),
          }).pipe(T.JsonName("device_posture")),
        }),
        Schema.Struct({
          emailDomain: Schema.Struct({
            domain: Schema.String,
          }).pipe(T.JsonName("email_domain")),
        }),
        Schema.Struct({
          emailList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("email_list")),
        }),
        Schema.Struct({
          email: Schema.Struct({
            email: Schema.String,
          }),
        }),
        Schema.Struct({
          everyone: Schema.Unknown,
        }),
        Schema.Struct({
          externalEvaluation: Schema.Struct({
            evaluateUrl: Schema.String.pipe(T.JsonName("evaluate_url")),
            keysUrl: Schema.String.pipe(T.JsonName("keys_url")),
          }).pipe(T.JsonName("external_evaluation")),
        }),
        Schema.Struct({
          githubOrganization: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
            team: Schema.optional(Schema.String),
          }).pipe(T.JsonName("'github-organization'")),
        }),
        Schema.Struct({
          gsuite: Schema.Struct({
            email: Schema.String,
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          loginMethod: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("login_method")),
        }),
        Schema.Struct({
          ipList: Schema.Struct({
            id: Schema.String,
          }).pipe(T.JsonName("ip_list")),
        }),
        Schema.Struct({
          ip: Schema.Struct({
            ip: Schema.String,
          }),
        }),
        Schema.Struct({
          okta: Schema.Struct({
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
            name: Schema.String,
          }),
        }),
        Schema.Struct({
          saml: Schema.Struct({
            attributeName: Schema.String.pipe(T.JsonName("attribute_name")),
            attributeValue: Schema.String.pipe(T.JsonName("attribute_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          oidc: Schema.Struct({
            claimName: Schema.String.pipe(T.JsonName("claim_name")),
            claimValue: Schema.String.pipe(T.JsonName("claim_value")),
            identityProviderId: Schema.String.pipe(
              T.JsonName("identity_provider_id"),
            ),
          }),
        }),
        Schema.Struct({
          serviceToken: Schema.Struct({
            tokenId: Schema.String.pipe(T.JsonName("token_id")),
          }).pipe(T.JsonName("service_token")),
        }),
        Schema.Struct({
          linkedAppToken: Schema.Struct({
            appUid: Schema.String.pipe(T.JsonName("app_uid")),
          }).pipe(T.JsonName("linked_app_token")),
        }),
      ),
    ),
  ),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<UpdateAccessApplicationPolicyResponse>;

export const updateAccessApplicationPolicy: (
  input: UpdateAccessApplicationPolicyRequest,
) => Effect.Effect<
  UpdateAccessApplicationPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateAccessApplicationPolicyRequest,
  output: UpdateAccessApplicationPolicyResponse,
  errors: [],
}));

export interface DeleteAccessApplicationPolicyRequest {
  appId: string;
  policyId: string;
}

export const DeleteAccessApplicationPolicyRequest = Schema.Struct({
  appId: Schema.String.pipe(T.HttpPath("appId")),
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}/policies/{policyId}",
  }),
) as unknown as Schema.Schema<DeleteAccessApplicationPolicyRequest>;

export interface DeleteAccessApplicationPolicyResponse {
  /** UUID. */
  id?: string;
}

export const DeleteAccessApplicationPolicyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteAccessApplicationPolicyResponse>;

export const deleteAccessApplicationPolicy: (
  input: DeleteAccessApplicationPolicyRequest,
) => Effect.Effect<
  DeleteAccessApplicationPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessApplicationPolicyRequest,
  output: DeleteAccessApplicationPolicyResponse,
  errors: [],
}));

// =============================================================================
// AccessApplicationPolicyTest
// =============================================================================

export interface GetAccessApplicationPolicyTestRequest {
  policyTestId: string;
  /** Identifier. */
  accountId: string;
}

export const GetAccessApplicationPolicyTestRequest = Schema.Struct({
  policyTestId: Schema.String.pipe(T.HttpPath("policyTestId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/access/policy-tests/{policyTestId}",
  }),
) as unknown as Schema.Schema<GetAccessApplicationPolicyTestRequest>;

export interface GetAccessApplicationPolicyTestResponse {
  /** The UUID of the policy test. */
  id?: string;
  /** The percentage of (processed) users approved based on policy evaluation results. */
  percentApproved?: number;
  /** The percentage of (processed) users blocked based on policy evaluation results. */
  percentBlocked?: number;
  /** The percentage of (processed) users errored based on policy evaluation results. */
  percentErrored?: number;
  /** The percentage of users processed so far (of the entire user base). */
  percentUsersProcessed?: number;
  /** The status of the policy test. */
  status?: "blocked" | "processing" | "exceeded time" | "complete";
  /** The total number of users in the user base. */
  totalUsers?: number;
  /** The number of (processed) users approved based on policy evaluation results. */
  usersApproved?: number;
  /** The number of (processed) users blocked based on policy evaluation results. */
  usersBlocked?: number;
  /** The number of (processed) users errored based on policy evaluation results. */
  usersErrored?: number;
}

export const GetAccessApplicationPolicyTestResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  percentApproved: Schema.optional(Schema.Number).pipe(
    T.JsonName("percent_approved"),
  ),
  percentBlocked: Schema.optional(Schema.Number).pipe(
    T.JsonName("percent_blocked"),
  ),
  percentErrored: Schema.optional(Schema.Number).pipe(
    T.JsonName("percent_errored"),
  ),
  percentUsersProcessed: Schema.optional(Schema.Number).pipe(
    T.JsonName("percent_users_processed"),
  ),
  status: Schema.optional(
    Schema.Literal("blocked", "processing", "exceeded time", "complete"),
  ),
  totalUsers: Schema.optional(Schema.Number).pipe(T.JsonName("total_users")),
  usersApproved: Schema.optional(Schema.Number).pipe(
    T.JsonName("users_approved"),
  ),
  usersBlocked: Schema.optional(Schema.Number).pipe(
    T.JsonName("users_blocked"),
  ),
  usersErrored: Schema.optional(Schema.Number).pipe(
    T.JsonName("users_errored"),
  ),
}) as unknown as Schema.Schema<GetAccessApplicationPolicyTestResponse>;

export const getAccessApplicationPolicyTest: (
  input: GetAccessApplicationPolicyTestRequest,
) => Effect.Effect<
  GetAccessApplicationPolicyTestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessApplicationPolicyTestRequest,
  output: GetAccessApplicationPolicyTestResponse,
  errors: [],
}));

export interface CreateAccessApplicationPolicyTestRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  policies?: (
    | {
        decision: "allow" | "bypass" | "deny" | "non_identity";
        include: unknown[];
        name: string;
        approvalGroups?: unknown[];
        approvalRequired?: boolean;
        exclude?: unknown[];
        isolationRequired?: boolean;
        purposeJustificationPrompt?: string;
        purposeJustificationRequired?: boolean;
        require?: unknown[];
        sessionDuration?: string;
      }
    | string
  )[];
}

export const CreateAccessApplicationPolicyTestRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  policies: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          decision: Schema.Literal("allow", "bypass", "deny", "non_identity"),
          include: Schema.Array(Schema.Unknown),
          name: Schema.String,
          approvalGroups: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
            T.JsonName("approval_groups"),
          ),
          approvalRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("approval_required"),
          ),
          exclude: Schema.optional(Schema.Array(Schema.Unknown)),
          isolationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("isolation_required"),
          ),
          purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
            T.JsonName("purpose_justification_prompt"),
          ),
          purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("purpose_justification_required"),
          ),
          require: Schema.optional(Schema.Array(Schema.Unknown)),
          sessionDuration: Schema.optional(Schema.String).pipe(
            T.JsonName("session_duration"),
          ),
        }),
        Schema.String,
      ),
    ),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/access/policy-tests",
  }),
) as unknown as Schema.Schema<CreateAccessApplicationPolicyTestRequest>;

export interface CreateAccessApplicationPolicyTestResponse {
  /** The UUID of the policy test. */
  id?: string;
  /** The status of the policy test request. */
  status?: "success";
}

export const CreateAccessApplicationPolicyTestResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  status: Schema.optional(Schema.Literal("success")),
}) as unknown as Schema.Schema<CreateAccessApplicationPolicyTestResponse>;

export const createAccessApplicationPolicyTest: (
  input: CreateAccessApplicationPolicyTestRequest,
) => Effect.Effect<
  CreateAccessApplicationPolicyTestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessApplicationPolicyTestRequest,
  output: CreateAccessApplicationPolicyTestResponse,
  errors: [],
}));

// =============================================================================
// AccessApplicationSetting
// =============================================================================

export interface PutAccessApplicationSettingRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Enables loading application content in an iFrame. */
  allowIframe?: boolean;
  /** Body param: Enables automatic authentication through cloudflared. */
  skipInterstitial?: boolean;
}

export const PutAccessApplicationSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  allowIframe: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_iframe")),
  skipInterstitial: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("skip_interstitial"),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}/settings",
  }),
) as unknown as Schema.Schema<PutAccessApplicationSettingRequest>;

export interface PutAccessApplicationSettingResponse {
  /** Enables loading application content in an iFrame. */
  allowIframe?: boolean;
  /** Enables automatic authentication through cloudflared. */
  skipInterstitial?: boolean;
}

export const PutAccessApplicationSettingResponse = Schema.Struct({
  allowIframe: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_iframe")),
  skipInterstitial: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("skip_interstitial"),
  ),
}) as unknown as Schema.Schema<PutAccessApplicationSettingResponse>;

export const putAccessApplicationSetting: (
  input: PutAccessApplicationSettingRequest,
) => Effect.Effect<
  PutAccessApplicationSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutAccessApplicationSettingRequest,
  output: PutAccessApplicationSettingResponse,
  errors: [],
}));

export interface PatchAccessApplicationSettingRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Enables loading application content in an iFrame. */
  allowIframe?: boolean;
  /** Body param: Enables automatic authentication through cloudflared. */
  skipInterstitial?: boolean;
}

export const PatchAccessApplicationSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  allowIframe: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_iframe")),
  skipInterstitial: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("skip_interstitial"),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}/settings",
  }),
) as unknown as Schema.Schema<PatchAccessApplicationSettingRequest>;

export interface PatchAccessApplicationSettingResponse {
  /** Enables loading application content in an iFrame. */
  allowIframe?: boolean;
  /** Enables automatic authentication through cloudflared. */
  skipInterstitial?: boolean;
}

export const PatchAccessApplicationSettingResponse = Schema.Struct({
  allowIframe: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_iframe")),
  skipInterstitial: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("skip_interstitial"),
  ),
}) as unknown as Schema.Schema<PatchAccessApplicationSettingResponse>;

export const patchAccessApplicationSetting: (
  input: PatchAccessApplicationSettingRequest,
) => Effect.Effect<
  PatchAccessApplicationSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchAccessApplicationSettingRequest,
  output: PatchAccessApplicationSettingResponse,
  errors: [],
}));

// =============================================================================
// AccessApplicationUserPolicyCheck
// =============================================================================

export interface ListAccessApplicationUserPolicyChecksRequest {}

export const ListAccessApplicationUserPolicyChecksRequest = Schema.Struct(
  {},
).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}/user_policy_checks",
  }),
) as unknown as Schema.Schema<ListAccessApplicationUserPolicyChecksRequest>;

export interface ListAccessApplicationUserPolicyChecksResponse {
  appState?: {
    appUid?: string;
    aud?: string;
    hostname?: string;
    name?: string;
    policies?: unknown[];
    status?: string;
  };
  userIdentity?: {
    id?: string;
    accountId?: string;
    deviceSessions?: unknown;
    email?: string;
    geo?: unknown;
    iat?: number;
    isGateway?: boolean;
    isWarp?: boolean;
    name?: string;
    userUuid?: string;
    version?: number;
  };
}

export const ListAccessApplicationUserPolicyChecksResponse = Schema.Struct({
  appState: Schema.optional(
    Schema.Struct({
      appUid: Schema.optional(Schema.String).pipe(T.JsonName("app_uid")),
      aud: Schema.optional(Schema.String),
      hostname: Schema.optional(Schema.String),
      name: Schema.optional(Schema.String),
      policies: Schema.optional(Schema.Array(Schema.Unknown)),
      status: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("app_state")),
  userIdentity: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
      deviceSessions: Schema.optional(Schema.Unknown).pipe(
        T.JsonName("device_sessions"),
      ),
      email: Schema.optional(Schema.String),
      geo: Schema.optional(Schema.Unknown),
      iat: Schema.optional(Schema.Number),
      isGateway: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_gateway")),
      isWarp: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_warp")),
      name: Schema.optional(Schema.String),
      userUuid: Schema.optional(Schema.String).pipe(T.JsonName("user_uuid")),
      version: Schema.optional(Schema.Number),
    }),
  ).pipe(T.JsonName("user_identity")),
}) as unknown as Schema.Schema<ListAccessApplicationUserPolicyChecksResponse>;

export const listAccessApplicationUserPolicyChecks: (
  input: ListAccessApplicationUserPolicyChecksRequest,
) => Effect.Effect<
  ListAccessApplicationUserPolicyChecksResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListAccessApplicationUserPolicyChecksRequest,
  output: ListAccessApplicationUserPolicyChecksResponse,
  errors: [],
}));

// =============================================================================
// AccessBookmark
// =============================================================================

export interface GetAccessBookmarkRequest {
  bookmarkId: string;
  accountId: string;
}

export const GetAccessBookmarkRequest = Schema.Struct({
  bookmarkId: Schema.String.pipe(T.HttpPath("bookmarkId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/access/bookmarks/{bookmarkId}",
  }),
) as unknown as Schema.Schema<GetAccessBookmarkRequest>;

export interface GetAccessBookmarkResponse {
  /** The unique identifier for the Bookmark application. */
  id?: string;
  /** Displays the application in the App Launcher. */
  appLauncherVisible?: boolean;
  /** The domain of the Bookmark application. */
  domain?: string;
  /** The image URL for the logo shown in the App Launcher dashboard. */
  logoUrl?: string;
  /** The name of the Bookmark application. */
  name?: string;
}

export const GetAccessBookmarkResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("app_launcher_visible"),
  ),
  domain: Schema.optional(Schema.String),
  logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetAccessBookmarkResponse>;

export const getAccessBookmark: (
  input: GetAccessBookmarkRequest,
) => Effect.Effect<
  GetAccessBookmarkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessBookmarkRequest,
  output: GetAccessBookmarkResponse,
  errors: [],
}));

export interface CreateAccessBookmarkRequest {
  bookmarkId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const CreateAccessBookmarkRequest = Schema.Struct({
  bookmarkId: Schema.String.pipe(T.HttpPath("bookmarkId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/access/bookmarks/{bookmarkId}",
  }),
) as unknown as Schema.Schema<CreateAccessBookmarkRequest>;

export interface CreateAccessBookmarkResponse {
  /** The unique identifier for the Bookmark application. */
  id?: string;
  /** Displays the application in the App Launcher. */
  appLauncherVisible?: boolean;
  /** The domain of the Bookmark application. */
  domain?: string;
  /** The image URL for the logo shown in the App Launcher dashboard. */
  logoUrl?: string;
  /** The name of the Bookmark application. */
  name?: string;
}

export const CreateAccessBookmarkResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("app_launcher_visible"),
  ),
  domain: Schema.optional(Schema.String),
  logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateAccessBookmarkResponse>;

export const createAccessBookmark: (
  input: CreateAccessBookmarkRequest,
) => Effect.Effect<
  CreateAccessBookmarkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessBookmarkRequest,
  output: CreateAccessBookmarkResponse,
  errors: [],
}));

export interface UpdateAccessBookmarkRequest {
  bookmarkId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const UpdateAccessBookmarkRequest = Schema.Struct({
  bookmarkId: Schema.String.pipe(T.HttpPath("bookmarkId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/access/bookmarks/{bookmarkId}",
  }),
) as unknown as Schema.Schema<UpdateAccessBookmarkRequest>;

export interface UpdateAccessBookmarkResponse {
  /** The unique identifier for the Bookmark application. */
  id?: string;
  /** Displays the application in the App Launcher. */
  appLauncherVisible?: boolean;
  /** The domain of the Bookmark application. */
  domain?: string;
  /** The image URL for the logo shown in the App Launcher dashboard. */
  logoUrl?: string;
  /** The name of the Bookmark application. */
  name?: string;
}

export const UpdateAccessBookmarkResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  appLauncherVisible: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("app_launcher_visible"),
  ),
  domain: Schema.optional(Schema.String),
  logoUrl: Schema.optional(Schema.String).pipe(T.JsonName("logo_url")),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateAccessBookmarkResponse>;

export const updateAccessBookmark: (
  input: UpdateAccessBookmarkRequest,
) => Effect.Effect<
  UpdateAccessBookmarkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateAccessBookmarkRequest,
  output: UpdateAccessBookmarkResponse,
  errors: [],
}));

export interface DeleteAccessBookmarkRequest {
  bookmarkId: string;
  accountId: string;
}

export const DeleteAccessBookmarkRequest = Schema.Struct({
  bookmarkId: Schema.String.pipe(T.HttpPath("bookmarkId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/access/bookmarks/{bookmarkId}",
  }),
) as unknown as Schema.Schema<DeleteAccessBookmarkRequest>;

export interface DeleteAccessBookmarkResponse {
  /** UUID. */
  id?: string;
}

export const DeleteAccessBookmarkResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteAccessBookmarkResponse>;

export const deleteAccessBookmark: (
  input: DeleteAccessBookmarkRequest,
) => Effect.Effect<
  DeleteAccessBookmarkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessBookmarkRequest,
  output: DeleteAccessBookmarkResponse,
  errors: [],
}));

// =============================================================================
// AccessCertificate
// =============================================================================

export interface GetAccessCertificateRequest {
  certificateId: string;
}

export const GetAccessCertificateRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/access/certificates/{certificateId}",
  }),
) as unknown as Schema.Schema<GetAccessCertificateRequest>;

export interface GetAccessCertificateResponse {
  /** The ID of the application that will use this certificate. */
  id?: string;
  /** The hostnames of the applications that will use this certificate. */
  associatedHostnames?: string[];
  expiresOn?: string;
  /** The MD5 fingerprint of the certificate. */
  fingerprint?: string;
  /** The name of the certificate. */
  name?: string;
}

export const GetAccessCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  associatedHostnames: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("associated_hostnames"),
  ),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprint: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetAccessCertificateResponse>;

export const getAccessCertificate: (
  input: GetAccessCertificateRequest,
) => Effect.Effect<
  GetAccessCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessCertificateRequest,
  output: GetAccessCertificateResponse,
  errors: [],
}));

export interface CreateAccessCertificateRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: The certificate content. */
  certificate: string;
  /** Body param: The name of the certificate. */
  name: string;
  /** Body param: The hostnames of the applications that will use this certificate. */
  associatedHostnames?: string[];
}

export const CreateAccessCertificateRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  certificate: Schema.String,
  name: Schema.String,
  associatedHostnames: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("associated_hostnames"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/access/certificates",
  }),
) as unknown as Schema.Schema<CreateAccessCertificateRequest>;

export interface CreateAccessCertificateResponse {
  /** The ID of the application that will use this certificate. */
  id?: string;
  /** The hostnames of the applications that will use this certificate. */
  associatedHostnames?: string[];
  expiresOn?: string;
  /** The MD5 fingerprint of the certificate. */
  fingerprint?: string;
  /** The name of the certificate. */
  name?: string;
}

export const CreateAccessCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  associatedHostnames: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("associated_hostnames"),
  ),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprint: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateAccessCertificateResponse>;

export const createAccessCertificate: (
  input: CreateAccessCertificateRequest,
) => Effect.Effect<
  CreateAccessCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessCertificateRequest,
  output: CreateAccessCertificateResponse,
  errors: [],
}));

export interface UpdateAccessCertificateRequest {
  certificateId: string;
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: The hostnames of the applications that will use this certificate. */
  associatedHostnames: string[];
  /** Body param: The name of the certificate. */
  name?: string;
}

export const UpdateAccessCertificateRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  associatedHostnames: Schema.Array(Schema.String).pipe(
    T.JsonName("associated_hostnames"),
  ),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/{accountOrZone}/{accountOrZoneId}/access/certificates/{certificateId}",
  }),
) as unknown as Schema.Schema<UpdateAccessCertificateRequest>;

export interface UpdateAccessCertificateResponse {
  /** The ID of the application that will use this certificate. */
  id?: string;
  /** The hostnames of the applications that will use this certificate. */
  associatedHostnames?: string[];
  expiresOn?: string;
  /** The MD5 fingerprint of the certificate. */
  fingerprint?: string;
  /** The name of the certificate. */
  name?: string;
}

export const UpdateAccessCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  associatedHostnames: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("associated_hostnames"),
  ),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprint: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateAccessCertificateResponse>;

export const updateAccessCertificate: (
  input: UpdateAccessCertificateRequest,
) => Effect.Effect<
  UpdateAccessCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateAccessCertificateRequest,
  output: UpdateAccessCertificateResponse,
  errors: [],
}));

export interface DeleteAccessCertificateRequest {
  certificateId: string;
}

export const DeleteAccessCertificateRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/{accountOrZone}/{accountOrZoneId}/access/certificates/{certificateId}",
  }),
) as unknown as Schema.Schema<DeleteAccessCertificateRequest>;

export interface DeleteAccessCertificateResponse {
  /** UUID. */
  id?: string;
}

export const DeleteAccessCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteAccessCertificateResponse>;

export const deleteAccessCertificate: (
  input: DeleteAccessCertificateRequest,
) => Effect.Effect<
  DeleteAccessCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessCertificateRequest,
  output: DeleteAccessCertificateResponse,
  errors: [],
}));

// =============================================================================
// AccessCustomPage
// =============================================================================

export interface GetAccessCustomPageRequest {
  customPageId: string;
  /** Identifier. */
  accountId: string;
}

export const GetAccessCustomPageRequest = Schema.Struct({
  customPageId: Schema.String.pipe(T.HttpPath("customPageId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/access/custom_pages/{customPageId}",
  }),
) as unknown as Schema.Schema<GetAccessCustomPageRequest>;

export interface GetAccessCustomPageResponse {
  /** Custom page HTML. */
  customHtml: string;
  /** Custom page name. */
  name: string;
  /** Custom page type. */
  type: "identity_denied" | "forbidden";
  /** UUID. */
  uid?: string;
}

export const GetAccessCustomPageResponse = Schema.Struct({
  customHtml: Schema.String.pipe(T.JsonName("custom_html")),
  name: Schema.String,
  type: Schema.Literal("identity_denied", "forbidden"),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetAccessCustomPageResponse>;

export const getAccessCustomPage: (
  input: GetAccessCustomPageRequest,
) => Effect.Effect<
  GetAccessCustomPageResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessCustomPageRequest,
  output: GetAccessCustomPageResponse,
  errors: [],
}));

export interface CreateAccessCustomPageRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Custom page HTML. */
  customHtml: string;
  /** Body param: Custom page name. */
  name: string;
  /** Body param: Custom page type. */
  type: "identity_denied" | "forbidden";
}

export const CreateAccessCustomPageRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  customHtml: Schema.String.pipe(T.JsonName("custom_html")),
  name: Schema.String,
  type: Schema.Literal("identity_denied", "forbidden"),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/access/custom_pages",
  }),
) as unknown as Schema.Schema<CreateAccessCustomPageRequest>;

export interface CreateAccessCustomPageResponse {
  /** Custom page name. */
  name: string;
  /** Custom page type. */
  type: "identity_denied" | "forbidden";
  /** UUID. */
  uid?: string;
}

export const CreateAccessCustomPageResponse = Schema.Struct({
  name: Schema.String,
  type: Schema.Literal("identity_denied", "forbidden"),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateAccessCustomPageResponse>;

export const createAccessCustomPage: (
  input: CreateAccessCustomPageRequest,
) => Effect.Effect<
  CreateAccessCustomPageResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessCustomPageRequest,
  output: CreateAccessCustomPageResponse,
  errors: [],
}));

export interface UpdateAccessCustomPageRequest {
  customPageId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Custom page HTML. */
  customHtml: string;
  /** Body param: Custom page name. */
  name: string;
  /** Body param: Custom page type. */
  type: "identity_denied" | "forbidden";
}

export const UpdateAccessCustomPageRequest = Schema.Struct({
  customPageId: Schema.String.pipe(T.HttpPath("customPageId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  customHtml: Schema.String.pipe(T.JsonName("custom_html")),
  name: Schema.String,
  type: Schema.Literal("identity_denied", "forbidden"),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/access/custom_pages/{customPageId}",
  }),
) as unknown as Schema.Schema<UpdateAccessCustomPageRequest>;

export interface UpdateAccessCustomPageResponse {
  /** Custom page name. */
  name: string;
  /** Custom page type. */
  type: "identity_denied" | "forbidden";
  /** UUID. */
  uid?: string;
}

export const UpdateAccessCustomPageResponse = Schema.Struct({
  name: Schema.String,
  type: Schema.Literal("identity_denied", "forbidden"),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateAccessCustomPageResponse>;

export const updateAccessCustomPage: (
  input: UpdateAccessCustomPageRequest,
) => Effect.Effect<
  UpdateAccessCustomPageResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateAccessCustomPageRequest,
  output: UpdateAccessCustomPageResponse,
  errors: [],
}));

export interface DeleteAccessCustomPageRequest {
  customPageId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteAccessCustomPageRequest = Schema.Struct({
  customPageId: Schema.String.pipe(T.HttpPath("customPageId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/access/custom_pages/{customPageId}",
  }),
) as unknown as Schema.Schema<DeleteAccessCustomPageRequest>;

export interface DeleteAccessCustomPageResponse {
  /** UUID. */
  id?: string;
}

export const DeleteAccessCustomPageResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteAccessCustomPageResponse>;

export const deleteAccessCustomPage: (
  input: DeleteAccessCustomPageRequest,
) => Effect.Effect<
  DeleteAccessCustomPageResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessCustomPageRequest,
  output: DeleteAccessCustomPageResponse,
  errors: [],
}));

// =============================================================================
// AccessGatewayCa
// =============================================================================

export interface CreateAccessGatewayCaRequest {
  /** Identifier. */
  accountId: string;
}

export const CreateAccessGatewayCaRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/access/gateway_ca" }),
) as unknown as Schema.Schema<CreateAccessGatewayCaRequest>;

export interface CreateAccessGatewayCaResponse {
  /** The key ID of this certificate. */
  id?: string;
  /** The public key of this certificate. */
  publicKey?: string;
}

export const CreateAccessGatewayCaResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  publicKey: Schema.optional(Schema.String).pipe(T.JsonName("public_key")),
}) as unknown as Schema.Schema<CreateAccessGatewayCaResponse>;

export const createAccessGatewayCa: (
  input: CreateAccessGatewayCaRequest,
) => Effect.Effect<
  CreateAccessGatewayCaResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessGatewayCaRequest,
  output: CreateAccessGatewayCaResponse,
  errors: [],
}));

export interface DeleteAccessGatewayCaRequest {
  certificateId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteAccessGatewayCaRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/access/gateway_ca/{certificateId}",
  }),
) as unknown as Schema.Schema<DeleteAccessGatewayCaRequest>;

export interface DeleteAccessGatewayCaResponse {
  /** UUID. */
  id?: string;
}

export const DeleteAccessGatewayCaResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteAccessGatewayCaResponse>;

export const deleteAccessGatewayCa: (
  input: DeleteAccessGatewayCaRequest,
) => Effect.Effect<
  DeleteAccessGatewayCaResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessGatewayCaRequest,
  output: DeleteAccessGatewayCaResponse,
  errors: [],
}));

// =============================================================================
// AccessGroup
// =============================================================================

export interface GetAccessGroupRequest {
  groupId: string;
}

export const GetAccessGroupRequest = Schema.Struct({
  groupId: Schema.String.pipe(T.HttpPath("groupId")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/access/groups/{groupId}",
  }),
) as unknown as Schema.Schema<GetAccessGroupRequest>;

export interface GetAccessGroupResponse {
  /** UUID. */
  id?: string;
  /** Rules evaluated with a NOT logical operator. To match a policy, a user cannot meet any of the Exclude rules. */
  exclude?: unknown[];
  /** Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include?: unknown[];
  /** Rules evaluated with an AND logical operator. To match a policy, a user must meet all of the Require rules. */
  isDefault?: unknown[];
  /** The name of the Access group. */
  name?: string;
  /** Rules evaluated with an AND logical operator. To match a policy, a user must meet all of the Require rules. */
  require?: unknown[];
}

export const GetAccessGroupResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  include: Schema.optional(Schema.Array(Schema.Unknown)),
  isDefault: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
    T.JsonName("is_default"),
  ),
  name: Schema.optional(Schema.String),
  require: Schema.optional(Schema.Array(Schema.Unknown)),
}) as unknown as Schema.Schema<GetAccessGroupResponse>;

export const getAccessGroup: (
  input: GetAccessGroupRequest,
) => Effect.Effect<
  GetAccessGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessGroupRequest,
  output: GetAccessGroupResponse,
  errors: [],
}));

export interface CreateAccessGroupRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include: unknown[];
  /** Body param: The name of the Access group. */
  name: string;
  /** Body param: Rules evaluated with a NOT logical operator. To match a policy, a user cannot meet any of the Exclude rules. */
  exclude?: unknown[];
  /** Body param: Whether this is the default group */
  isDefault?: boolean;
  /** Body param: Rules evaluated with an AND logical operator. To match a policy, a user must meet all of the Require rules. */
  require?: unknown[];
}

export const CreateAccessGroupRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  include: Schema.Array(Schema.Unknown),
  name: Schema.String,
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  isDefault: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_default")),
  require: Schema.optional(Schema.Array(Schema.Unknown)),
}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/access/groups",
  }),
) as unknown as Schema.Schema<CreateAccessGroupRequest>;

export interface CreateAccessGroupResponse {
  /** UUID. */
  id?: string;
  /** Rules evaluated with a NOT logical operator. To match a policy, a user cannot meet any of the Exclude rules. */
  exclude?: unknown[];
  /** Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include?: unknown[];
  /** Rules evaluated with an AND logical operator. To match a policy, a user must meet all of the Require rules. */
  isDefault?: unknown[];
  /** The name of the Access group. */
  name?: string;
  /** Rules evaluated with an AND logical operator. To match a policy, a user must meet all of the Require rules. */
  require?: unknown[];
}

export const CreateAccessGroupResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  include: Schema.optional(Schema.Array(Schema.Unknown)),
  isDefault: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
    T.JsonName("is_default"),
  ),
  name: Schema.optional(Schema.String),
  require: Schema.optional(Schema.Array(Schema.Unknown)),
}) as unknown as Schema.Schema<CreateAccessGroupResponse>;

export const createAccessGroup: (
  input: CreateAccessGroupRequest,
) => Effect.Effect<
  CreateAccessGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessGroupRequest,
  output: CreateAccessGroupResponse,
  errors: [],
}));

export interface UpdateAccessGroupRequest {
  groupId: string;
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include: unknown[];
  /** Body param: The name of the Access group. */
  name: string;
  /** Body param: Rules evaluated with a NOT logical operator. To match a policy, a user cannot meet any of the Exclude rules. */
  exclude?: unknown[];
  /** Body param: Whether this is the default group */
  isDefault?: boolean;
  /** Body param: Rules evaluated with an AND logical operator. To match a policy, a user must meet all of the Require rules. */
  require?: unknown[];
}

export const UpdateAccessGroupRequest = Schema.Struct({
  groupId: Schema.String.pipe(T.HttpPath("groupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  include: Schema.Array(Schema.Unknown),
  name: Schema.String,
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  isDefault: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_default")),
  require: Schema.optional(Schema.Array(Schema.Unknown)),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/{accountOrZone}/{accountOrZoneId}/access/groups/{groupId}",
  }),
) as unknown as Schema.Schema<UpdateAccessGroupRequest>;

export interface UpdateAccessGroupResponse {
  /** UUID. */
  id?: string;
  /** Rules evaluated with a NOT logical operator. To match a policy, a user cannot meet any of the Exclude rules. */
  exclude?: unknown[];
  /** Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include?: unknown[];
  /** Rules evaluated with an AND logical operator. To match a policy, a user must meet all of the Require rules. */
  isDefault?: unknown[];
  /** The name of the Access group. */
  name?: string;
  /** Rules evaluated with an AND logical operator. To match a policy, a user must meet all of the Require rules. */
  require?: unknown[];
}

export const UpdateAccessGroupResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  include: Schema.optional(Schema.Array(Schema.Unknown)),
  isDefault: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
    T.JsonName("is_default"),
  ),
  name: Schema.optional(Schema.String),
  require: Schema.optional(Schema.Array(Schema.Unknown)),
}) as unknown as Schema.Schema<UpdateAccessGroupResponse>;

export const updateAccessGroup: (
  input: UpdateAccessGroupRequest,
) => Effect.Effect<
  UpdateAccessGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateAccessGroupRequest,
  output: UpdateAccessGroupResponse,
  errors: [],
}));

export interface DeleteAccessGroupRequest {
  groupId: string;
}

export const DeleteAccessGroupRequest = Schema.Struct({
  groupId: Schema.String.pipe(T.HttpPath("groupId")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/{accountOrZone}/{accountOrZoneId}/access/groups/{groupId}",
  }),
) as unknown as Schema.Schema<DeleteAccessGroupRequest>;

export interface DeleteAccessGroupResponse {
  /** UUID. */
  id?: string;
}

export const DeleteAccessGroupResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteAccessGroupResponse>;

export const deleteAccessGroup: (
  input: DeleteAccessGroupRequest,
) => Effect.Effect<
  DeleteAccessGroupResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessGroupRequest,
  output: DeleteAccessGroupResponse,
  errors: [],
}));

// =============================================================================
// AccessInfrastructureTarget
// =============================================================================

export interface GetAccessInfrastructureTargetRequest {
  targetId: string;
  /** Account identifier */
  accountId: string;
}

export const GetAccessInfrastructureTargetRequest = Schema.Struct({
  targetId: Schema.String.pipe(T.HttpPath("targetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/infrastructure/targets/{targetId}",
  }),
) as unknown as Schema.Schema<GetAccessInfrastructureTargetRequest>;

export interface GetAccessInfrastructureTargetResponse {
  /** Target identifier */
  id: string;
  /** Date and time at which the target was created */
  createdAt: string;
  /** A non-unique field that refers to a target */
  hostname: string;
  /** The IPv4/IPv6 address that identifies where to reach a target */
  ip: {
    ipv4?: { ipAddr?: string; virtualNetworkId?: string };
    ipv6?: { ipAddr?: string; virtualNetworkId?: string };
  };
  /** Date and time at which the target was modified */
  modifiedAt: string;
}

export const GetAccessInfrastructureTargetResponse = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  hostname: Schema.String,
  ip: Schema.Struct({
    ipv4: Schema.optional(
      Schema.Struct({
        ipAddr: Schema.optional(Schema.String).pipe(T.JsonName("ip_addr")),
        virtualNetworkId: Schema.optional(Schema.String).pipe(
          T.JsonName("virtual_network_id"),
        ),
      }),
    ),
    ipv6: Schema.optional(
      Schema.Struct({
        ipAddr: Schema.optional(Schema.String).pipe(T.JsonName("ip_addr")),
        virtualNetworkId: Schema.optional(Schema.String).pipe(
          T.JsonName("virtual_network_id"),
        ),
      }),
    ),
  }),
  modifiedAt: Schema.String.pipe(T.JsonName("modified_at")),
}) as unknown as Schema.Schema<GetAccessInfrastructureTargetResponse>;

export const getAccessInfrastructureTarget: (
  input: GetAccessInfrastructureTargetRequest,
) => Effect.Effect<
  GetAccessInfrastructureTargetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessInfrastructureTargetRequest,
  output: GetAccessInfrastructureTargetResponse,
  errors: [],
}));

export interface CreateAccessInfrastructureTargetRequest {
  /** Path param: Account identifier */
  accountId: string;
  /** Body param: A non-unique field that refers to a target. Case insensitive, maximum length of 255 characters, supports the use of special characters dash and period, does not support spaces, and must st */
  hostname: string;
  /** Body param: The IPv4/IPv6 address that identifies where to reach a target */
  ip: {
    ipv4?: { ipAddr?: string; virtualNetworkId?: string };
    ipv6?: { ipAddr?: string; virtualNetworkId?: string };
  };
}

export const CreateAccessInfrastructureTargetRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  hostname: Schema.String,
  ip: Schema.Struct({
    ipv4: Schema.optional(
      Schema.Struct({
        ipAddr: Schema.optional(Schema.String).pipe(T.JsonName("ip_addr")),
        virtualNetworkId: Schema.optional(Schema.String).pipe(
          T.JsonName("virtual_network_id"),
        ),
      }),
    ),
    ipv6: Schema.optional(
      Schema.Struct({
        ipAddr: Schema.optional(Schema.String).pipe(T.JsonName("ip_addr")),
        virtualNetworkId: Schema.optional(Schema.String).pipe(
          T.JsonName("virtual_network_id"),
        ),
      }),
    ),
  }),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/infrastructure/targets",
  }),
) as unknown as Schema.Schema<CreateAccessInfrastructureTargetRequest>;

export interface CreateAccessInfrastructureTargetResponse {
  /** Target identifier */
  id: string;
  /** Date and time at which the target was created */
  createdAt: string;
  /** A non-unique field that refers to a target */
  hostname: string;
  /** The IPv4/IPv6 address that identifies where to reach a target */
  ip: {
    ipv4?: { ipAddr?: string; virtualNetworkId?: string };
    ipv6?: { ipAddr?: string; virtualNetworkId?: string };
  };
  /** Date and time at which the target was modified */
  modifiedAt: string;
}

export const CreateAccessInfrastructureTargetResponse = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  hostname: Schema.String,
  ip: Schema.Struct({
    ipv4: Schema.optional(
      Schema.Struct({
        ipAddr: Schema.optional(Schema.String).pipe(T.JsonName("ip_addr")),
        virtualNetworkId: Schema.optional(Schema.String).pipe(
          T.JsonName("virtual_network_id"),
        ),
      }),
    ),
    ipv6: Schema.optional(
      Schema.Struct({
        ipAddr: Schema.optional(Schema.String).pipe(T.JsonName("ip_addr")),
        virtualNetworkId: Schema.optional(Schema.String).pipe(
          T.JsonName("virtual_network_id"),
        ),
      }),
    ),
  }),
  modifiedAt: Schema.String.pipe(T.JsonName("modified_at")),
}) as unknown as Schema.Schema<CreateAccessInfrastructureTargetResponse>;

export const createAccessInfrastructureTarget: (
  input: CreateAccessInfrastructureTargetRequest,
) => Effect.Effect<
  CreateAccessInfrastructureTargetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessInfrastructureTargetRequest,
  output: CreateAccessInfrastructureTargetResponse,
  errors: [],
}));

export interface UpdateAccessInfrastructureTargetRequest {
  targetId: string;
  /** Path param: Account identifier */
  accountId: string;
  /** Body param: A non-unique field that refers to a target. Case insensitive, maximum length of 255 characters, supports the use of special characters dash and period, does not support spaces, and must st */
  hostname: string;
  /** Body param: The IPv4/IPv6 address that identifies where to reach a target */
  ip: {
    ipv4?: { ipAddr?: string; virtualNetworkId?: string };
    ipv6?: { ipAddr?: string; virtualNetworkId?: string };
  };
}

export const UpdateAccessInfrastructureTargetRequest = Schema.Struct({
  targetId: Schema.String.pipe(T.HttpPath("targetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  hostname: Schema.String,
  ip: Schema.Struct({
    ipv4: Schema.optional(
      Schema.Struct({
        ipAddr: Schema.optional(Schema.String).pipe(T.JsonName("ip_addr")),
        virtualNetworkId: Schema.optional(Schema.String).pipe(
          T.JsonName("virtual_network_id"),
        ),
      }),
    ),
    ipv6: Schema.optional(
      Schema.Struct({
        ipAddr: Schema.optional(Schema.String).pipe(T.JsonName("ip_addr")),
        virtualNetworkId: Schema.optional(Schema.String).pipe(
          T.JsonName("virtual_network_id"),
        ),
      }),
    ),
  }),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/infrastructure/targets/{targetId}",
  }),
) as unknown as Schema.Schema<UpdateAccessInfrastructureTargetRequest>;

export interface UpdateAccessInfrastructureTargetResponse {
  /** Target identifier */
  id: string;
  /** Date and time at which the target was created */
  createdAt: string;
  /** A non-unique field that refers to a target */
  hostname: string;
  /** The IPv4/IPv6 address that identifies where to reach a target */
  ip: {
    ipv4?: { ipAddr?: string; virtualNetworkId?: string };
    ipv6?: { ipAddr?: string; virtualNetworkId?: string };
  };
  /** Date and time at which the target was modified */
  modifiedAt: string;
}

export const UpdateAccessInfrastructureTargetResponse = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  hostname: Schema.String,
  ip: Schema.Struct({
    ipv4: Schema.optional(
      Schema.Struct({
        ipAddr: Schema.optional(Schema.String).pipe(T.JsonName("ip_addr")),
        virtualNetworkId: Schema.optional(Schema.String).pipe(
          T.JsonName("virtual_network_id"),
        ),
      }),
    ),
    ipv6: Schema.optional(
      Schema.Struct({
        ipAddr: Schema.optional(Schema.String).pipe(T.JsonName("ip_addr")),
        virtualNetworkId: Schema.optional(Schema.String).pipe(
          T.JsonName("virtual_network_id"),
        ),
      }),
    ),
  }),
  modifiedAt: Schema.String.pipe(T.JsonName("modified_at")),
}) as unknown as Schema.Schema<UpdateAccessInfrastructureTargetResponse>;

export const updateAccessInfrastructureTarget: (
  input: UpdateAccessInfrastructureTargetRequest,
) => Effect.Effect<
  UpdateAccessInfrastructureTargetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateAccessInfrastructureTargetRequest,
  output: UpdateAccessInfrastructureTargetResponse,
  errors: [],
}));

export interface DeleteAccessInfrastructureTargetRequest {
  targetId: string;
  /** Account identifier */
  accountId: string;
}

export const DeleteAccessInfrastructureTargetRequest = Schema.Struct({
  targetId: Schema.String.pipe(T.HttpPath("targetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/infrastructure/targets/{targetId}",
  }),
) as unknown as Schema.Schema<DeleteAccessInfrastructureTargetRequest>;

export type DeleteAccessInfrastructureTargetResponse = unknown;

export const DeleteAccessInfrastructureTargetResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteAccessInfrastructureTargetResponse>;

export const deleteAccessInfrastructureTarget: (
  input: DeleteAccessInfrastructureTargetRequest,
) => Effect.Effect<
  DeleteAccessInfrastructureTargetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessInfrastructureTargetRequest,
  output: DeleteAccessInfrastructureTargetResponse,
  errors: [],
}));

export interface BulkDeleteAccessInfrastructureTargetsRequest {
  /** Account identifier */
  accountId: string;
}

export const BulkDeleteAccessInfrastructureTargetsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/infrastructure/targets/batch",
  }),
) as unknown as Schema.Schema<BulkDeleteAccessInfrastructureTargetsRequest>;

export type BulkDeleteAccessInfrastructureTargetsResponse = unknown;

export const BulkDeleteAccessInfrastructureTargetsResponse =
  Schema.Unknown as unknown as Schema.Schema<BulkDeleteAccessInfrastructureTargetsResponse>;

export const bulkDeleteAccessInfrastructureTargets: (
  input: BulkDeleteAccessInfrastructureTargetsRequest,
) => Effect.Effect<
  BulkDeleteAccessInfrastructureTargetsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkDeleteAccessInfrastructureTargetsRequest,
  output: BulkDeleteAccessInfrastructureTargetsResponse,
  errors: [],
}));

// =============================================================================
// AccessKey
// =============================================================================

export interface GetAccessKeyRequest {
  /** Identifier. */
  accountId: string;
}

export const GetAccessKeyRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/access/keys" }),
) as unknown as Schema.Schema<GetAccessKeyRequest>;

export interface GetAccessKeyResponse {
  /** The number of days until the next key rotation. */
  daysUntilNextRotation?: number;
  /** The number of days between key rotations. */
  keyRotationIntervalDays?: number;
  /** The timestamp of the previous key rotation. */
  lastKeyRotationAt?: string;
}

export const GetAccessKeyResponse = Schema.Struct({
  daysUntilNextRotation: Schema.optional(Schema.Number).pipe(
    T.JsonName("days_until_next_rotation"),
  ),
  keyRotationIntervalDays: Schema.optional(Schema.Number).pipe(
    T.JsonName("key_rotation_interval_days"),
  ),
  lastKeyRotationAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_key_rotation_at"),
  ),
}) as unknown as Schema.Schema<GetAccessKeyResponse>;

export const getAccessKey: (
  input: GetAccessKeyRequest,
) => Effect.Effect<
  GetAccessKeyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessKeyRequest,
  output: GetAccessKeyResponse,
  errors: [],
}));

export interface PutAccessKeyRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The number of days between key rotations. */
  keyRotationIntervalDays: number;
}

export const PutAccessKeyRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  keyRotationIntervalDays: Schema.Number.pipe(
    T.JsonName("key_rotation_interval_days"),
  ),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/access/keys" }),
) as unknown as Schema.Schema<PutAccessKeyRequest>;

export interface PutAccessKeyResponse {
  /** The number of days until the next key rotation. */
  daysUntilNextRotation?: number;
  /** The number of days between key rotations. */
  keyRotationIntervalDays?: number;
  /** The timestamp of the previous key rotation. */
  lastKeyRotationAt?: string;
}

export const PutAccessKeyResponse = Schema.Struct({
  daysUntilNextRotation: Schema.optional(Schema.Number).pipe(
    T.JsonName("days_until_next_rotation"),
  ),
  keyRotationIntervalDays: Schema.optional(Schema.Number).pipe(
    T.JsonName("key_rotation_interval_days"),
  ),
  lastKeyRotationAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_key_rotation_at"),
  ),
}) as unknown as Schema.Schema<PutAccessKeyResponse>;

export const putAccessKey: (
  input: PutAccessKeyRequest,
) => Effect.Effect<
  PutAccessKeyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutAccessKeyRequest,
  output: PutAccessKeyResponse,
  errors: [],
}));

export interface RotateAccessKeyRequest {
  /** Identifier. */
  accountId: string;
}

export const RotateAccessKeyRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/access/keys/rotate" }),
) as unknown as Schema.Schema<RotateAccessKeyRequest>;

export interface RotateAccessKeyResponse {
  /** The number of days until the next key rotation. */
  daysUntilNextRotation?: number;
  /** The number of days between key rotations. */
  keyRotationIntervalDays?: number;
  /** The timestamp of the previous key rotation. */
  lastKeyRotationAt?: string;
}

export const RotateAccessKeyResponse = Schema.Struct({
  daysUntilNextRotation: Schema.optional(Schema.Number).pipe(
    T.JsonName("days_until_next_rotation"),
  ),
  keyRotationIntervalDays: Schema.optional(Schema.Number).pipe(
    T.JsonName("key_rotation_interval_days"),
  ),
  lastKeyRotationAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_key_rotation_at"),
  ),
}) as unknown as Schema.Schema<RotateAccessKeyResponse>;

export const rotateAccessKey: (
  input: RotateAccessKeyRequest,
) => Effect.Effect<
  RotateAccessKeyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RotateAccessKeyRequest,
  output: RotateAccessKeyResponse,
  errors: [],
}));

// =============================================================================
// AccessLogAccessRequest
// =============================================================================

export interface ListAccessLogAccessRequestsRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: The chronological sorting order for the logs. */
  direction?: "desc" | "asc";
  /** Query param: The maximum number of log entries to retrieve. */
  limit?: number;
  /** Query param: Page number of results. */
  page?: number;
  /** Query param: Number of results per page. */
  perPage?: number;
  /** Query param: The earliest event timestamp to query. */
  since?: string;
  /** Query param: The latest event timestamp to query. */
  until?: string;
}

export const ListAccessLogAccessRequestsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  direction: Schema.optional(Schema.Literal("desc", "asc")).pipe(
    T.HttpQuery("direction"),
  ),
  limit: Schema.optional(Schema.Number).pipe(T.HttpQuery("limit")),
  page: Schema.optional(Schema.Number).pipe(T.HttpQuery("page")),
  perPage: Schema.optional(Schema.Number).pipe(T.HttpQuery("per_page")),
  since: Schema.optional(Schema.String).pipe(T.HttpQuery("since")),
  until: Schema.optional(Schema.String).pipe(T.HttpQuery("until")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/access/logs/access_requests",
  }),
) as unknown as Schema.Schema<ListAccessLogAccessRequestsRequest>;

export type ListAccessLogAccessRequestsResponse = unknown[];

export const ListAccessLogAccessRequestsResponse = Schema.Array(
  Schema.Unknown,
) as unknown as Schema.Schema<ListAccessLogAccessRequestsResponse>;

export const listAccessLogAccessRequests: (
  input: ListAccessLogAccessRequestsRequest,
) => Effect.Effect<
  ListAccessLogAccessRequestsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListAccessLogAccessRequestsRequest,
  output: ListAccessLogAccessRequestsResponse,
  errors: [],
}));

// =============================================================================
// AccessPolicy
// =============================================================================

export interface GetAccessPolicyRequest {
  policyId: string;
  /** Identifier. */
  accountId: string;
}

export const GetAccessPolicyRequest = Schema.Struct({
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/access/policies/{policyId}",
  }),
) as unknown as Schema.Schema<GetAccessPolicyRequest>;

export interface GetAccessPolicyResponse {
  /** The UUID of the policy */
  id?: string;
  /** Number of access applications currently using this policy. */
  appCount?: number;
  /** Administrators who can approve a temporary authentication request. */
  approvalGroups?: {
    approvalsNeeded: number;
    emailAddresses?: unknown[];
    emailListUuid?: string;
  }[];
  /** Requires the user to request access from an administrator at the start of each session. */
  approvalRequired?: boolean;
  createdAt?: string;
  /** The action Access will take if a user matches this policy. Infrastructure application policies can only use the Allow action. */
  decision?: "allow" | "bypass" | "deny" | "non_identity";
  /** Rules evaluated with a NOT logical operator. To match the policy, a user cannot meet any of the Exclude rules. */
  exclude?: unknown[];
  /** Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include?: unknown[];
  /** Require this application to be served in an isolated browser for users matching this policy. 'Client Web Isolation' must be on for the account in order to use this feature. */
  isolationRequired?: boolean;
  /** The name of the Access policy. */
  name?: string;
  /** A custom message that will appear on the purpose justification screen. */
  purposeJustificationPrompt?: string;
  /** Require users to enter a justification when they log in to the application. */
  purposeJustificationRequired?: boolean;
  /** Rules evaluated with an AND logical operator. To match the policy, a user must meet all of the Require rules. */
  require?: unknown[];
  reusable?: true;
  /** The amount of time that tokens issued for the application will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
  updatedAt?: string;
}

export const GetAccessPolicyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  appCount: Schema.optional(Schema.Number).pipe(T.JsonName("app_count")),
  approvalGroups: Schema.optional(
    Schema.Array(
      Schema.Struct({
        approvalsNeeded: Schema.Number.pipe(T.JsonName("approvals_needed")),
        emailAddresses: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
          T.JsonName("email_addresses"),
        ),
        emailListUuid: Schema.optional(Schema.String).pipe(
          T.JsonName("email_list_uuid"),
        ),
      }),
    ),
  ).pipe(T.JsonName("approval_groups")),
  approvalRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("approval_required"),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  decision: Schema.optional(
    Schema.Literal("allow", "bypass", "deny", "non_identity"),
  ),
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  include: Schema.optional(Schema.Array(Schema.Unknown)),
  isolationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("isolation_required"),
  ),
  name: Schema.optional(Schema.String),
  purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
    T.JsonName("purpose_justification_prompt"),
  ),
  purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("purpose_justification_required"),
  ),
  require: Schema.optional(Schema.Array(Schema.Unknown)),
  reusable: Schema.optional(Schema.Literal(true)),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<GetAccessPolicyResponse>;

export const getAccessPolicy: (
  input: GetAccessPolicyRequest,
) => Effect.Effect<
  GetAccessPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessPolicyRequest,
  output: GetAccessPolicyResponse,
  errors: [],
}));

export interface CreateAccessPolicyRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The action Access will take if a user matches this policy. Infrastructure application policies can only use the Allow action. */
  decision: "allow" | "bypass" | "deny" | "non_identity";
  /** Body param: Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include: unknown[];
  /** Body param: The name of the Access policy. */
  name: string;
  /** Body param: Administrators who can approve a temporary authentication request. */
  approvalGroups?: {
    approvalsNeeded: number;
    emailAddresses?: string[];
    emailListUuid?: string;
  }[];
  /** Body param: Requires the user to request access from an administrator at the start of each session. */
  approvalRequired?: boolean;
  /** Body param: Rules evaluated with a NOT logical operator. To match the policy, a user cannot meet any of the Exclude rules. */
  exclude?: unknown[];
  /** Body param: Require this application to be served in an isolated browser for users matching this policy. 'Client Web Isolation' must be on for the account in order to use this feature. */
  isolationRequired?: boolean;
  /** Body param: A custom message that will appear on the purpose justification screen. */
  purposeJustificationPrompt?: string;
  /** Body param: Require users to enter a justification when they log in to the application. */
  purposeJustificationRequired?: boolean;
  /** Body param: Rules evaluated with an AND logical operator. To match the policy, a user must meet all of the Require rules. */
  require?: unknown[];
  /** Body param: The amount of time that tokens issued for the application will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
}

export const CreateAccessPolicyRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  decision: Schema.Literal("allow", "bypass", "deny", "non_identity"),
  include: Schema.Array(Schema.Unknown),
  name: Schema.String,
  approvalGroups: Schema.optional(
    Schema.Array(
      Schema.Struct({
        approvalsNeeded: Schema.Number.pipe(T.JsonName("approvals_needed")),
        emailAddresses: Schema.optional(Schema.Array(Schema.String)).pipe(
          T.JsonName("email_addresses"),
        ),
        emailListUuid: Schema.optional(Schema.String).pipe(
          T.JsonName("email_list_uuid"),
        ),
      }),
    ),
  ).pipe(T.JsonName("approval_groups")),
  approvalRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("approval_required"),
  ),
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  isolationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("isolation_required"),
  ),
  purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
    T.JsonName("purpose_justification_prompt"),
  ),
  purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("purpose_justification_required"),
  ),
  require: Schema.optional(Schema.Array(Schema.Unknown)),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/access/policies" }),
) as unknown as Schema.Schema<CreateAccessPolicyRequest>;

export interface CreateAccessPolicyResponse {
  /** The UUID of the policy */
  id?: string;
  /** Number of access applications currently using this policy. */
  appCount?: number;
  /** Administrators who can approve a temporary authentication request. */
  approvalGroups?: {
    approvalsNeeded: number;
    emailAddresses?: unknown[];
    emailListUuid?: string;
  }[];
  /** Requires the user to request access from an administrator at the start of each session. */
  approvalRequired?: boolean;
  createdAt?: string;
  /** The action Access will take if a user matches this policy. Infrastructure application policies can only use the Allow action. */
  decision?: "allow" | "bypass" | "deny" | "non_identity";
  /** Rules evaluated with a NOT logical operator. To match the policy, a user cannot meet any of the Exclude rules. */
  exclude?: unknown[];
  /** Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include?: unknown[];
  /** Require this application to be served in an isolated browser for users matching this policy. 'Client Web Isolation' must be on for the account in order to use this feature. */
  isolationRequired?: boolean;
  /** The name of the Access policy. */
  name?: string;
  /** A custom message that will appear on the purpose justification screen. */
  purposeJustificationPrompt?: string;
  /** Require users to enter a justification when they log in to the application. */
  purposeJustificationRequired?: boolean;
  /** Rules evaluated with an AND logical operator. To match the policy, a user must meet all of the Require rules. */
  require?: unknown[];
  reusable?: true;
  /** The amount of time that tokens issued for the application will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
  updatedAt?: string;
}

export const CreateAccessPolicyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  appCount: Schema.optional(Schema.Number).pipe(T.JsonName("app_count")),
  approvalGroups: Schema.optional(
    Schema.Array(
      Schema.Struct({
        approvalsNeeded: Schema.Number.pipe(T.JsonName("approvals_needed")),
        emailAddresses: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
          T.JsonName("email_addresses"),
        ),
        emailListUuid: Schema.optional(Schema.String).pipe(
          T.JsonName("email_list_uuid"),
        ),
      }),
    ),
  ).pipe(T.JsonName("approval_groups")),
  approvalRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("approval_required"),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  decision: Schema.optional(
    Schema.Literal("allow", "bypass", "deny", "non_identity"),
  ),
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  include: Schema.optional(Schema.Array(Schema.Unknown)),
  isolationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("isolation_required"),
  ),
  name: Schema.optional(Schema.String),
  purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
    T.JsonName("purpose_justification_prompt"),
  ),
  purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("purpose_justification_required"),
  ),
  require: Schema.optional(Schema.Array(Schema.Unknown)),
  reusable: Schema.optional(Schema.Literal(true)),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<CreateAccessPolicyResponse>;

export const createAccessPolicy: (
  input: CreateAccessPolicyRequest,
) => Effect.Effect<
  CreateAccessPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessPolicyRequest,
  output: CreateAccessPolicyResponse,
  errors: [],
}));

export interface UpdateAccessPolicyRequest {
  policyId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The action Access will take if a user matches this policy. Infrastructure application policies can only use the Allow action. */
  decision: "allow" | "bypass" | "deny" | "non_identity";
  /** Body param: Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include: unknown[];
  /** Body param: The name of the Access policy. */
  name: string;
  /** Body param: Administrators who can approve a temporary authentication request. */
  approvalGroups?: {
    approvalsNeeded: number;
    emailAddresses?: string[];
    emailListUuid?: string;
  }[];
  /** Body param: Requires the user to request access from an administrator at the start of each session. */
  approvalRequired?: boolean;
  /** Body param: Rules evaluated with a NOT logical operator. To match the policy, a user cannot meet any of the Exclude rules. */
  exclude?: unknown[];
  /** Body param: Require this application to be served in an isolated browser for users matching this policy. 'Client Web Isolation' must be on for the account in order to use this feature. */
  isolationRequired?: boolean;
  /** Body param: A custom message that will appear on the purpose justification screen. */
  purposeJustificationPrompt?: string;
  /** Body param: Require users to enter a justification when they log in to the application. */
  purposeJustificationRequired?: boolean;
  /** Body param: Rules evaluated with an AND logical operator. To match the policy, a user must meet all of the Require rules. */
  require?: unknown[];
  /** Body param: The amount of time that tokens issued for the application will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
}

export const UpdateAccessPolicyRequest = Schema.Struct({
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  decision: Schema.Literal("allow", "bypass", "deny", "non_identity"),
  include: Schema.Array(Schema.Unknown),
  name: Schema.String,
  approvalGroups: Schema.optional(
    Schema.Array(
      Schema.Struct({
        approvalsNeeded: Schema.Number.pipe(T.JsonName("approvals_needed")),
        emailAddresses: Schema.optional(Schema.Array(Schema.String)).pipe(
          T.JsonName("email_addresses"),
        ),
        emailListUuid: Schema.optional(Schema.String).pipe(
          T.JsonName("email_list_uuid"),
        ),
      }),
    ),
  ).pipe(T.JsonName("approval_groups")),
  approvalRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("approval_required"),
  ),
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  isolationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("isolation_required"),
  ),
  purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
    T.JsonName("purpose_justification_prompt"),
  ),
  purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("purpose_justification_required"),
  ),
  require: Schema.optional(Schema.Array(Schema.Unknown)),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/access/policies/{policyId}",
  }),
) as unknown as Schema.Schema<UpdateAccessPolicyRequest>;

export interface UpdateAccessPolicyResponse {
  /** The UUID of the policy */
  id?: string;
  /** Number of access applications currently using this policy. */
  appCount?: number;
  /** Administrators who can approve a temporary authentication request. */
  approvalGroups?: {
    approvalsNeeded: number;
    emailAddresses?: unknown[];
    emailListUuid?: string;
  }[];
  /** Requires the user to request access from an administrator at the start of each session. */
  approvalRequired?: boolean;
  createdAt?: string;
  /** The action Access will take if a user matches this policy. Infrastructure application policies can only use the Allow action. */
  decision?: "allow" | "bypass" | "deny" | "non_identity";
  /** Rules evaluated with a NOT logical operator. To match the policy, a user cannot meet any of the Exclude rules. */
  exclude?: unknown[];
  /** Rules evaluated with an OR logical operator. A user needs to meet only one of the Include rules. */
  include?: unknown[];
  /** Require this application to be served in an isolated browser for users matching this policy. 'Client Web Isolation' must be on for the account in order to use this feature. */
  isolationRequired?: boolean;
  /** The name of the Access policy. */
  name?: string;
  /** A custom message that will appear on the purpose justification screen. */
  purposeJustificationPrompt?: string;
  /** Require users to enter a justification when they log in to the application. */
  purposeJustificationRequired?: boolean;
  /** Rules evaluated with an AND logical operator. To match the policy, a user must meet all of the Require rules. */
  require?: unknown[];
  reusable?: true;
  /** The amount of time that tokens issued for the application will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
  updatedAt?: string;
}

export const UpdateAccessPolicyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  appCount: Schema.optional(Schema.Number).pipe(T.JsonName("app_count")),
  approvalGroups: Schema.optional(
    Schema.Array(
      Schema.Struct({
        approvalsNeeded: Schema.Number.pipe(T.JsonName("approvals_needed")),
        emailAddresses: Schema.optional(Schema.Array(Schema.Unknown)).pipe(
          T.JsonName("email_addresses"),
        ),
        emailListUuid: Schema.optional(Schema.String).pipe(
          T.JsonName("email_list_uuid"),
        ),
      }),
    ),
  ).pipe(T.JsonName("approval_groups")),
  approvalRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("approval_required"),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  decision: Schema.optional(
    Schema.Literal("allow", "bypass", "deny", "non_identity"),
  ),
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  include: Schema.optional(Schema.Array(Schema.Unknown)),
  isolationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("isolation_required"),
  ),
  name: Schema.optional(Schema.String),
  purposeJustificationPrompt: Schema.optional(Schema.String).pipe(
    T.JsonName("purpose_justification_prompt"),
  ),
  purposeJustificationRequired: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("purpose_justification_required"),
  ),
  require: Schema.optional(Schema.Array(Schema.Unknown)),
  reusable: Schema.optional(Schema.Literal(true)),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<UpdateAccessPolicyResponse>;

export const updateAccessPolicy: (
  input: UpdateAccessPolicyRequest,
) => Effect.Effect<
  UpdateAccessPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateAccessPolicyRequest,
  output: UpdateAccessPolicyResponse,
  errors: [],
}));

export interface DeleteAccessPolicyRequest {
  policyId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteAccessPolicyRequest = Schema.Struct({
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/access/policies/{policyId}",
  }),
) as unknown as Schema.Schema<DeleteAccessPolicyRequest>;

export interface DeleteAccessPolicyResponse {
  /** The UUID of the policy */
  id?: string;
}

export const DeleteAccessPolicyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteAccessPolicyResponse>;

export const deleteAccessPolicy: (
  input: DeleteAccessPolicyRequest,
) => Effect.Effect<
  DeleteAccessPolicyResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessPolicyRequest,
  output: DeleteAccessPolicyResponse,
  errors: [],
}));

// =============================================================================
// AccessServiceToken
// =============================================================================

export interface GetAccessServiceTokenRequest {
  serviceTokenId: string;
}

export const GetAccessServiceTokenRequest = Schema.Struct({
  serviceTokenId: Schema.String.pipe(T.HttpPath("serviceTokenId")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/access/service_tokens/{serviceTokenId}",
  }),
) as unknown as Schema.Schema<GetAccessServiceTokenRequest>;

export interface GetAccessServiceTokenResponse {
  /** The ID of the service token. */
  id?: string;
  /** The Client ID for the service token. Access will check for this value in the `CF-Access-Client-ID` request header. */
  clientId?: string;
  /** The duration for how long the service token will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. The default is 1 year in hours (8760h). */
  duration?: string;
  expiresAt?: string;
  /** The name of the service token. */
  name?: string;
}

export const GetAccessServiceTokenResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
  duration: Schema.optional(Schema.String),
  expiresAt: Schema.optional(Schema.String).pipe(T.JsonName("expires_at")),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetAccessServiceTokenResponse>;

export const getAccessServiceToken: (
  input: GetAccessServiceTokenRequest,
) => Effect.Effect<
  GetAccessServiceTokenResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessServiceTokenRequest,
  output: GetAccessServiceTokenResponse,
  errors: [],
}));

export interface CreateAccessServiceTokenRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: The name of the service token. */
  name: string;
  /** Body param: A version number identifying the current `client_secret` associated with the service token. Incrementing it triggers a rotation; the previous secret will still be accepted until the time i */
  clientSecretVersion?: number;
  /** Body param: The duration for how long the service token will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. The default is 1 year in hours (8760 */
  duration?: string;
  /** Body param: The expiration of the previous `client_secret`. This can be modified at any point after a rotation. For example, you may extend it further into the future if you need more time to update s */
  previousClientSecretExpiresAt?: string;
}

export const CreateAccessServiceTokenRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  name: Schema.String,
  clientSecretVersion: Schema.optional(Schema.Number).pipe(
    T.JsonName("client_secret_version"),
  ),
  duration: Schema.optional(Schema.String),
  previousClientSecretExpiresAt: Schema.optional(Schema.String).pipe(
    T.JsonName("previous_client_secret_expires_at"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/access/service_tokens",
  }),
) as unknown as Schema.Schema<CreateAccessServiceTokenRequest>;

export interface CreateAccessServiceTokenResponse {
  /** The ID of the service token. */
  id?: string;
  /** The Client ID for the service token. Access will check for this value in the `CF-Access-Client-ID` request header. */
  clientId?: string;
  /** The Client Secret for the service token. Access will check for this value in the `CF-Access-Client-Secret` request header. */
  clientSecret?: string;
  /** The duration for how long the service token will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. The default is 1 year in hours (8760h). */
  duration?: string;
  /** The name of the service token. */
  name?: string;
}

export const CreateAccessServiceTokenResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
  clientSecret: Schema.optional(Schema.String).pipe(
    T.JsonName("client_secret"),
  ),
  duration: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateAccessServiceTokenResponse>;

export const createAccessServiceToken: (
  input: CreateAccessServiceTokenRequest,
) => Effect.Effect<
  CreateAccessServiceTokenResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessServiceTokenRequest,
  output: CreateAccessServiceTokenResponse,
  errors: [],
}));

export interface UpdateAccessServiceTokenRequest {
  serviceTokenId: string;
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: A version number identifying the current `client_secret` associated with the service token. Incrementing it triggers a rotation; the previous secret will still be accepted until the time i */
  clientSecretVersion?: number;
  /** Body param: The duration for how long the service token will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. The default is 1 year in hours (8760 */
  duration?: string;
  /** Body param: The name of the service token. */
  name?: string;
  /** Body param: The expiration of the previous `client_secret`. This can be modified at any point after a rotation. For example, you may extend it further into the future if you need more time to update s */
  previousClientSecretExpiresAt?: string;
}

export const UpdateAccessServiceTokenRequest = Schema.Struct({
  serviceTokenId: Schema.String.pipe(T.HttpPath("serviceTokenId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  clientSecretVersion: Schema.optional(Schema.Number).pipe(
    T.JsonName("client_secret_version"),
  ),
  duration: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  previousClientSecretExpiresAt: Schema.optional(Schema.String).pipe(
    T.JsonName("previous_client_secret_expires_at"),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/{accountOrZone}/{accountOrZoneId}/access/service_tokens/{serviceTokenId}",
  }),
) as unknown as Schema.Schema<UpdateAccessServiceTokenRequest>;

export interface UpdateAccessServiceTokenResponse {
  /** The ID of the service token. */
  id?: string;
  /** The Client ID for the service token. Access will check for this value in the `CF-Access-Client-ID` request header. */
  clientId?: string;
  /** The duration for how long the service token will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. The default is 1 year in hours (8760h). */
  duration?: string;
  expiresAt?: string;
  /** The name of the service token. */
  name?: string;
}

export const UpdateAccessServiceTokenResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
  duration: Schema.optional(Schema.String),
  expiresAt: Schema.optional(Schema.String).pipe(T.JsonName("expires_at")),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateAccessServiceTokenResponse>;

export const updateAccessServiceToken: (
  input: UpdateAccessServiceTokenRequest,
) => Effect.Effect<
  UpdateAccessServiceTokenResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateAccessServiceTokenRequest,
  output: UpdateAccessServiceTokenResponse,
  errors: [],
}));

export interface DeleteAccessServiceTokenRequest {
  serviceTokenId: string;
}

export const DeleteAccessServiceTokenRequest = Schema.Struct({
  serviceTokenId: Schema.String.pipe(T.HttpPath("serviceTokenId")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/{accountOrZone}/{accountOrZoneId}/access/service_tokens/{serviceTokenId}",
  }),
) as unknown as Schema.Schema<DeleteAccessServiceTokenRequest>;

export interface DeleteAccessServiceTokenResponse {
  /** The ID of the service token. */
  id?: string;
  /** The Client ID for the service token. Access will check for this value in the `CF-Access-Client-ID` request header. */
  clientId?: string;
  /** The duration for how long the service token will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. The default is 1 year in hours (8760h). */
  duration?: string;
  expiresAt?: string;
  /** The name of the service token. */
  name?: string;
}

export const DeleteAccessServiceTokenResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
  duration: Schema.optional(Schema.String),
  expiresAt: Schema.optional(Schema.String).pipe(T.JsonName("expires_at")),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteAccessServiceTokenResponse>;

export const deleteAccessServiceToken: (
  input: DeleteAccessServiceTokenRequest,
) => Effect.Effect<
  DeleteAccessServiceTokenResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessServiceTokenRequest,
  output: DeleteAccessServiceTokenResponse,
  errors: [],
}));

export interface RefreshAccessServiceTokenRequest {
  serviceTokenId: string;
  /** Identifier. */
  accountId: string;
}

export const RefreshAccessServiceTokenRequest = Schema.Struct({
  serviceTokenId: Schema.String.pipe(T.HttpPath("serviceTokenId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/access/service_tokens/{serviceTokenId}/refresh",
  }),
) as unknown as Schema.Schema<RefreshAccessServiceTokenRequest>;

export interface RefreshAccessServiceTokenResponse {
  /** The ID of the service token. */
  id?: string;
  /** The Client ID for the service token. Access will check for this value in the `CF-Access-Client-ID` request header. */
  clientId?: string;
  /** The duration for how long the service token will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. The default is 1 year in hours (8760h). */
  duration?: string;
  expiresAt?: string;
  /** The name of the service token. */
  name?: string;
}

export const RefreshAccessServiceTokenResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
  duration: Schema.optional(Schema.String),
  expiresAt: Schema.optional(Schema.String).pipe(T.JsonName("expires_at")),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<RefreshAccessServiceTokenResponse>;

export const refreshAccessServiceToken: (
  input: RefreshAccessServiceTokenRequest,
) => Effect.Effect<
  RefreshAccessServiceTokenResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RefreshAccessServiceTokenRequest,
  output: RefreshAccessServiceTokenResponse,
  errors: [],
}));

export interface RotateAccessServiceTokenRequest {
  serviceTokenId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The expiration of the previous `client_secret`. If not provided, it defaults to the current timestamp in order to immediately expire the previous secret. */
  previousClientSecretExpiresAt?: string;
}

export const RotateAccessServiceTokenRequest = Schema.Struct({
  serviceTokenId: Schema.String.pipe(T.HttpPath("serviceTokenId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  previousClientSecretExpiresAt: Schema.optional(Schema.String).pipe(
    T.JsonName("previous_client_secret_expires_at"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/access/service_tokens/{serviceTokenId}/rotate",
  }),
) as unknown as Schema.Schema<RotateAccessServiceTokenRequest>;

export interface RotateAccessServiceTokenResponse {
  /** The ID of the service token. */
  id?: string;
  /** The Client ID for the service token. Access will check for this value in the `CF-Access-Client-ID` request header. */
  clientId?: string;
  /** The Client Secret for the service token. Access will check for this value in the `CF-Access-Client-Secret` request header. */
  clientSecret?: string;
  /** The duration for how long the service token will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. The default is 1 year in hours (8760h). */
  duration?: string;
  /** The name of the service token. */
  name?: string;
}

export const RotateAccessServiceTokenResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
  clientSecret: Schema.optional(Schema.String).pipe(
    T.JsonName("client_secret"),
  ),
  duration: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<RotateAccessServiceTokenResponse>;

export const rotateAccessServiceToken: (
  input: RotateAccessServiceTokenRequest,
) => Effect.Effect<
  RotateAccessServiceTokenResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RotateAccessServiceTokenRequest,
  output: RotateAccessServiceTokenResponse,
  errors: [],
}));

// =============================================================================
// AccessTag
// =============================================================================

export interface GetAccessTagRequest {
  tagName: string;
  /** Identifier. */
  accountId: string;
}

export const GetAccessTagRequest = Schema.Struct({
  tagName: Schema.String.pipe(T.HttpPath("tagName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/access/tags/{tagName}",
  }),
) as unknown as Schema.Schema<GetAccessTagRequest>;

export interface GetAccessTagResponse {
  /** The name of the tag */
  name: string;
}

export const GetAccessTagResponse = Schema.Struct({
  name: Schema.String,
}) as unknown as Schema.Schema<GetAccessTagResponse>;

export const getAccessTag: (
  input: GetAccessTagRequest,
) => Effect.Effect<
  GetAccessTagResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessTagRequest,
  output: GetAccessTagResponse,
  errors: [],
}));

export interface CreateAccessTagRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The name of the tag */
  name?: string;
}

export const CreateAccessTagRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/access/tags" }),
) as unknown as Schema.Schema<CreateAccessTagRequest>;

export interface CreateAccessTagResponse {
  /** The name of the tag */
  name: string;
}

export const CreateAccessTagResponse = Schema.Struct({
  name: Schema.String,
}) as unknown as Schema.Schema<CreateAccessTagResponse>;

export const createAccessTag: (
  input: CreateAccessTagRequest,
) => Effect.Effect<
  CreateAccessTagResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAccessTagRequest,
  output: CreateAccessTagResponse,
  errors: [],
}));

export interface UpdateAccessTagRequest {
  tagName: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The name of the tag */
  name: string;
}

export const UpdateAccessTagRequest = Schema.Struct({
  tagName: Schema.String.pipe(T.HttpPath("tagName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/access/tags/{tagName}",
  }),
) as unknown as Schema.Schema<UpdateAccessTagRequest>;

export interface UpdateAccessTagResponse {
  /** The name of the tag */
  name: string;
}

export const UpdateAccessTagResponse = Schema.Struct({
  name: Schema.String,
}) as unknown as Schema.Schema<UpdateAccessTagResponse>;

export const updateAccessTag: (
  input: UpdateAccessTagRequest,
) => Effect.Effect<
  UpdateAccessTagResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateAccessTagRequest,
  output: UpdateAccessTagResponse,
  errors: [],
}));

export interface DeleteAccessTagRequest {
  tagName: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteAccessTagRequest = Schema.Struct({
  tagName: Schema.String.pipe(T.HttpPath("tagName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/access/tags/{tagName}",
  }),
) as unknown as Schema.Schema<DeleteAccessTagRequest>;

export interface DeleteAccessTagResponse {
  /** The name of the tag */
  name?: string;
}

export const DeleteAccessTagResponse = Schema.Struct({
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteAccessTagResponse>;

export const deleteAccessTag: (
  input: DeleteAccessTagRequest,
) => Effect.Effect<
  DeleteAccessTagResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteAccessTagRequest,
  output: DeleteAccessTagResponse,
  errors: [],
}));

// =============================================================================
// AccessUserActiveSession
// =============================================================================

export interface GetAccessUserActiveSessionRequest {
  userId: string;
  nonce: string;
  /** Identifier. */
  accountId: string;
}

export const GetAccessUserActiveSessionRequest = Schema.Struct({
  userId: Schema.String.pipe(T.HttpPath("userId")),
  nonce: Schema.String.pipe(T.HttpPath("nonce")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/access/users/{userId}/active_sessions/{nonce}",
  }),
) as unknown as Schema.Schema<GetAccessUserActiveSessionRequest>;

export interface GetAccessUserActiveSessionResponse {
  accountId?: string;
  authStatus?: string;
  commonName?: string;
  deviceId?: string;
  deviceSessions?: Record<string, unknown>;
  devicePosture?: Record<string, unknown>;
  email?: string;
  geo?: unknown;
  iat?: number;
  idp?: { id?: string; type?: string };
  ip?: string;
  isGateway?: boolean;
  isWarp?: boolean;
  isActive?: boolean;
  mtlsAuth?: {
    authStatus?: string;
    certIssuerDn?: string;
    certIssuerSki?: string;
    certPresented?: boolean;
    certSerial?: string;
  };
  serviceTokenId?: string;
  serviceTokenStatus?: boolean;
  userUuid?: string;
  version?: number;
}

export const GetAccessUserActiveSessionResponse = Schema.Struct({
  accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
  authStatus: Schema.optional(Schema.String).pipe(T.JsonName("auth_status")),
  commonName: Schema.optional(Schema.String).pipe(T.JsonName("common_name")),
  deviceId: Schema.optional(Schema.String).pipe(T.JsonName("device_id")),
  deviceSessions: Schema.optional(Schema.Struct({})).pipe(
    T.JsonName("device_sessions"),
  ),
  devicePosture: Schema.optional(Schema.Struct({})),
  email: Schema.optional(Schema.String),
  geo: Schema.optional(Schema.Unknown),
  iat: Schema.optional(Schema.Number),
  idp: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      type: Schema.optional(Schema.String),
    }),
  ),
  ip: Schema.optional(Schema.String),
  isGateway: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_gateway")),
  isWarp: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_warp")),
  isActive: Schema.optional(Schema.Boolean),
  mtlsAuth: Schema.optional(
    Schema.Struct({
      authStatus: Schema.optional(Schema.String).pipe(
        T.JsonName("auth_status"),
      ),
      certIssuerDn: Schema.optional(Schema.String).pipe(
        T.JsonName("cert_issuer_dn"),
      ),
      certIssuerSki: Schema.optional(Schema.String).pipe(
        T.JsonName("cert_issuer_ski"),
      ),
      certPresented: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("cert_presented"),
      ),
      certSerial: Schema.optional(Schema.String).pipe(
        T.JsonName("cert_serial"),
      ),
    }),
  ).pipe(T.JsonName("mtls_auth")),
  serviceTokenId: Schema.optional(Schema.String).pipe(
    T.JsonName("service_token_id"),
  ),
  serviceTokenStatus: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("service_token_status"),
  ),
  userUuid: Schema.optional(Schema.String).pipe(T.JsonName("user_uuid")),
  version: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetAccessUserActiveSessionResponse>;

export const getAccessUserActiveSession: (
  input: GetAccessUserActiveSessionRequest,
) => Effect.Effect<
  GetAccessUserActiveSessionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessUserActiveSessionRequest,
  output: GetAccessUserActiveSessionResponse,
  errors: [],
}));

// =============================================================================
// AccessUserLastSeenIdentity
// =============================================================================

export interface GetAccessUserLastSeenIdentityRequest {
  userId: string;
  /** Identifier. */
  accountId: string;
}

export const GetAccessUserLastSeenIdentityRequest = Schema.Struct({
  userId: Schema.String.pipe(T.HttpPath("userId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/access/users/{userId}/last_seen_identity",
  }),
) as unknown as Schema.Schema<GetAccessUserLastSeenIdentityRequest>;

export interface GetAccessUserLastSeenIdentityResponse {
  accountId?: string;
  authStatus?: string;
  commonName?: string;
  deviceId?: string;
  deviceSessions?: Record<string, unknown>;
  devicePosture?: Record<string, unknown>;
  email?: string;
  geo?: unknown;
  iat?: number;
  idp?: { id?: string; type?: string };
  ip?: string;
  isGateway?: boolean;
  isWarp?: boolean;
  mtlsAuth?: {
    authStatus?: string;
    certIssuerDn?: string;
    certIssuerSki?: string;
    certPresented?: boolean;
    certSerial?: string;
  };
  serviceTokenId?: string;
  serviceTokenStatus?: boolean;
  userUuid?: string;
  version?: number;
}

export const GetAccessUserLastSeenIdentityResponse = Schema.Struct({
  accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
  authStatus: Schema.optional(Schema.String).pipe(T.JsonName("auth_status")),
  commonName: Schema.optional(Schema.String).pipe(T.JsonName("common_name")),
  deviceId: Schema.optional(Schema.String).pipe(T.JsonName("device_id")),
  deviceSessions: Schema.optional(Schema.Struct({})).pipe(
    T.JsonName("device_sessions"),
  ),
  devicePosture: Schema.optional(Schema.Struct({})),
  email: Schema.optional(Schema.String),
  geo: Schema.optional(Schema.Unknown),
  iat: Schema.optional(Schema.Number),
  idp: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      type: Schema.optional(Schema.String),
    }),
  ),
  ip: Schema.optional(Schema.String),
  isGateway: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_gateway")),
  isWarp: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_warp")),
  mtlsAuth: Schema.optional(
    Schema.Struct({
      authStatus: Schema.optional(Schema.String).pipe(
        T.JsonName("auth_status"),
      ),
      certIssuerDn: Schema.optional(Schema.String).pipe(
        T.JsonName("cert_issuer_dn"),
      ),
      certIssuerSki: Schema.optional(Schema.String).pipe(
        T.JsonName("cert_issuer_ski"),
      ),
      certPresented: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("cert_presented"),
      ),
      certSerial: Schema.optional(Schema.String).pipe(
        T.JsonName("cert_serial"),
      ),
    }),
  ).pipe(T.JsonName("mtls_auth")),
  serviceTokenId: Schema.optional(Schema.String).pipe(
    T.JsonName("service_token_id"),
  ),
  serviceTokenStatus: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("service_token_status"),
  ),
  userUuid: Schema.optional(Schema.String).pipe(T.JsonName("user_uuid")),
  version: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetAccessUserLastSeenIdentityResponse>;

export const getAccessUserLastSeenIdentity: (
  input: GetAccessUserLastSeenIdentityRequest,
) => Effect.Effect<
  GetAccessUserLastSeenIdentityResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAccessUserLastSeenIdentityRequest,
  output: GetAccessUserLastSeenIdentityResponse,
  errors: [],
}));

// =============================================================================
// ConnectivitySetting
// =============================================================================

export interface GetConnectivitySettingRequest {
  /** Cloudflare account ID */
  accountId: string;
}

export const GetConnectivitySettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/zerotrust/connectivity_settings",
  }),
) as unknown as Schema.Schema<GetConnectivitySettingRequest>;

export interface GetConnectivitySettingResponse {
  /** A flag to enable the ICMP proxy for the account network. */
  icmpProxyEnabled?: boolean;
  /** A flag to enable WARP to WARP traffic. */
  offrampWarpEnabled?: boolean;
}

export const GetConnectivitySettingResponse = Schema.Struct({
  icmpProxyEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("icmp_proxy_enabled"),
  ),
  offrampWarpEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("offramp_warp_enabled"),
  ),
}) as unknown as Schema.Schema<GetConnectivitySettingResponse>;

export const getConnectivitySetting: (
  input: GetConnectivitySettingRequest,
) => Effect.Effect<
  GetConnectivitySettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetConnectivitySettingRequest,
  output: GetConnectivitySettingResponse,
  errors: [],
}));

export interface PatchConnectivitySettingRequest {
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: A flag to enable the ICMP proxy for the account network. */
  icmpProxyEnabled?: boolean;
  /** Body param: A flag to enable WARP to WARP traffic. */
  offrampWarpEnabled?: boolean;
}

export const PatchConnectivitySettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  icmpProxyEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("icmp_proxy_enabled"),
  ),
  offrampWarpEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("offramp_warp_enabled"),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/zerotrust/connectivity_settings",
  }),
) as unknown as Schema.Schema<PatchConnectivitySettingRequest>;

export interface PatchConnectivitySettingResponse {
  /** A flag to enable the ICMP proxy for the account network. */
  icmpProxyEnabled?: boolean;
  /** A flag to enable WARP to WARP traffic. */
  offrampWarpEnabled?: boolean;
}

export const PatchConnectivitySettingResponse = Schema.Struct({
  icmpProxyEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("icmp_proxy_enabled"),
  ),
  offrampWarpEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("offramp_warp_enabled"),
  ),
}) as unknown as Schema.Schema<PatchConnectivitySettingResponse>;

export const patchConnectivitySetting: (
  input: PatchConnectivitySettingRequest,
) => Effect.Effect<
  PatchConnectivitySettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchConnectivitySettingRequest,
  output: PatchConnectivitySettingResponse,
  errors: [],
}));

// =============================================================================
// Device
// =============================================================================

export interface GetDeviceRequest {
  deviceId: string;
  accountId: string;
}

export const GetDeviceRequest = Schema.Struct({
  deviceId: Schema.String.pipe(T.HttpPath("deviceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/devices/{deviceId}" }),
) as unknown as Schema.Schema<GetDeviceRequest>;

export type GetDeviceResponse = unknown;

export const GetDeviceResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDeviceResponse>;

export const getDevice: (
  input: GetDeviceRequest,
) => Effect.Effect<
  GetDeviceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDeviceRequest,
  output: GetDeviceResponse,
  errors: [],
}));

// =============================================================================
// DeviceDevices_
// =============================================================================

export interface GetDeviceDevices_Request {
  deviceId: string;
  /** Path param: */
  accountId: string;
  /** Query param: Comma-separated list of additional information that should be included in the device response. Supported values are: "last_seen_registration.policy". */
  include?: string;
}

export const GetDeviceDevices_Request = Schema.Struct({
  deviceId: Schema.String.pipe(T.HttpPath("deviceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  include: Schema.optional(Schema.String).pipe(T.HttpQuery("include")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/devices/physical-devices/{deviceId}",
  }),
) as unknown as Schema.Schema<GetDeviceDevices_Request>;

export interface GetDeviceDevices_Response {
  /** The unique ID of the device. */
  id: string;
  /** The number of active registrations for the device. Active registrations are those which haven't been revoked or deleted. */
  activeRegistrations: number;
  /** The RFC3339 timestamp when the device was created. */
  createdAt: string;
  /** The RFC3339 timestamp when the device was last seen. */
  lastSeenAt: string | null;
  /** The name of the device. */
  name: string;
  /** The RFC3339 timestamp when the device was last updated. */
  updatedAt: string;
  /** Version of the WARP client. */
  clientVersion?: string | null;
  /** The RFC3339 timestamp when the device was deleted. */
  deletedAt?: string | null;
  /** The device operating system. */
  deviceType?: string | null;
  /** A string that uniquely identifies the hardware or virtual machine (VM). */
  hardwareId?: string | null;
  /** The last seen registration for the device. */
  lastSeenRegistration?: {
    policy?: {
      id: string;
      default: boolean;
      deleted: boolean;
      name: string;
      updatedAt: string;
    } | null;
  } | null;
  /** The last user to use the WARP device. */
  lastSeenUser?: { id?: string; email?: string; name?: string } | null;
  /** The device MAC address. */
  macAddress?: string | null;
  /** The device manufacturer. */
  manufacturer?: string | null;
  /** The model name of the device. */
  model?: string | null;
  /** The device operating system version number. */
  osVersion?: string | null;
  /** Additional operating system version data. For macOS or iOS, the Product Version Extra. For Linux, the kernel release version. */
  osVersionExtra?: string | null;
  /** The public IP address of the WARP client. */
  publicIp?: string | null;
  /** The device serial number. */
  serialNumber?: string | null;
}

export const GetDeviceDevices_Response = Schema.Struct({
  id: Schema.String,
  activeRegistrations: Schema.Number.pipe(T.JsonName("active_registrations")),
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  lastSeenAt: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("last_seen_at"),
  ),
  name: Schema.String,
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  clientVersion: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("client_version"),
  ),
  deletedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("deleted_at"),
  ),
  deviceType: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("device_type"),
  ),
  hardwareId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("hardware_id"),
  ),
  lastSeenRegistration: Schema.optional(
    Schema.Union(
      Schema.Struct({
        policy: Schema.optional(
          Schema.Union(
            Schema.Struct({
              id: Schema.String,
              default: Schema.Boolean,
              deleted: Schema.Boolean,
              name: Schema.String,
              updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
            }),
            Schema.Null,
          ),
        ),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("last_seen_registration")),
  lastSeenUser: Schema.optional(
    Schema.Union(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        email: Schema.optional(Schema.String),
        name: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("last_seen_user")),
  macAddress: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("mac_address"),
  ),
  manufacturer: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  model: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  osVersion: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("os_version"),
  ),
  osVersionExtra: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("os_version_extra")),
  publicIp: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("public_ip"),
  ),
  serialNumber: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("serial_number"),
  ),
}) as unknown as Schema.Schema<GetDeviceDevices_Response>;

export const getDeviceDevices_: (
  input: GetDeviceDevices_Request,
) => Effect.Effect<
  GetDeviceDevices_Response,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDeviceDevices_Request,
  output: GetDeviceDevices_Response,
  errors: [],
}));

export interface DeleteDeviceDevices_Request {
  deviceId: string;
  accountId: string;
}

export const DeleteDeviceDevices_Request = Schema.Struct({
  deviceId: Schema.String.pipe(T.HttpPath("deviceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/devices/physical-devices/{deviceId}",
  }),
) as unknown as Schema.Schema<DeleteDeviceDevices_Request>;

export type DeleteDeviceDevices_Response = unknown;

export const DeleteDeviceDevices_Response =
  Schema.Unknown as unknown as Schema.Schema<DeleteDeviceDevices_Response>;

export const deleteDeviceDevices_: (
  input: DeleteDeviceDevices_Request,
) => Effect.Effect<
  DeleteDeviceDevices_Response,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDeviceDevices_Request,
  output: DeleteDeviceDevices_Response,
  errors: [],
}));

export interface RevokeDeviceDevices_Request {
  deviceId: string;
  accountId: string;
}

export const RevokeDeviceDevices_Request = Schema.Struct({
  deviceId: Schema.String.pipe(T.HttpPath("deviceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/devices/physical-devices/{deviceId}/revoke",
  }),
) as unknown as Schema.Schema<RevokeDeviceDevices_Request>;

export type RevokeDeviceDevices_Response = unknown;

export const RevokeDeviceDevices_Response =
  Schema.Unknown as unknown as Schema.Schema<RevokeDeviceDevices_Response>;

export const revokeDeviceDevices_: (
  input: RevokeDeviceDevices_Request,
) => Effect.Effect<
  RevokeDeviceDevices_Response,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RevokeDeviceDevices_Request,
  output: RevokeDeviceDevices_Response,
  errors: [],
}));

// =============================================================================
// DeviceDexTest
// =============================================================================

export interface GetDeviceDexTestRequest {
  dexTestId: string;
  accountId: string;
}

export const GetDeviceDexTestRequest = Schema.Struct({
  dexTestId: Schema.String.pipe(T.HttpPath("dexTestId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/devices/dex_tests/{dexTestId}",
  }),
) as unknown as Schema.Schema<GetDeviceDexTestRequest>;

export interface GetDeviceDexTestResponse {
  /** The configuration object which contains the details for the WARP client to conduct the test. */
  data: { host?: string; kind?: string; method?: string };
  /** Determines whether or not the test is active. */
  enabled: boolean;
  /** How often the test will run. */
  interval: string;
  /** The name of the DEX test. Must be unique. */
  name: string;
  /** Additional details about the test. */
  description?: string;
  /** DEX rules targeted by this test */
  targetPolicies?: { id?: string; default?: boolean; name?: string }[];
  targeted?: boolean;
  /** The unique identifier for the test. */
  testId?: string;
}

export const GetDeviceDexTestResponse = Schema.Struct({
  data: Schema.Struct({
    host: Schema.optional(Schema.String),
    kind: Schema.optional(Schema.String),
    method: Schema.optional(Schema.String),
  }),
  enabled: Schema.Boolean,
  interval: Schema.String,
  name: Schema.String,
  description: Schema.optional(Schema.String),
  targetPolicies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        default: Schema.optional(Schema.Boolean),
        name: Schema.optional(Schema.String),
      }),
    ),
  ).pipe(T.JsonName("target_policies")),
  targeted: Schema.optional(Schema.Boolean),
  testId: Schema.optional(Schema.String).pipe(T.JsonName("test_id")),
}) as unknown as Schema.Schema<GetDeviceDexTestResponse>;

export const getDeviceDexTest: (
  input: GetDeviceDexTestRequest,
) => Effect.Effect<
  GetDeviceDexTestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDeviceDexTestRequest,
  output: GetDeviceDexTestResponse,
  errors: [],
}));

export interface CreateDeviceDexTestRequest {
  /** Path param: */
  accountId: string;
  /** Body param: The configuration object which contains the details for the WARP client to conduct the test. */
  data: { host?: string; kind?: string; method?: string };
  /** Body param: Determines whether or not the test is active. */
  enabled: boolean;
  /** Body param: How often the test will run. */
  interval: string;
  /** Body param: The name of the DEX test. Must be unique. */
  name: string;
  /** Body param: Additional details about the test. */
  description?: string;
  /** Body param: DEX rules targeted by this test */
  targetPolicies?: { id?: string; default?: boolean; name?: string }[];
  /** Body param: */
  targeted?: boolean;
}

export const CreateDeviceDexTestRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  data: Schema.Struct({
    host: Schema.optional(Schema.String),
    kind: Schema.optional(Schema.String),
    method: Schema.optional(Schema.String),
  }),
  enabled: Schema.Boolean,
  interval: Schema.String,
  name: Schema.String,
  description: Schema.optional(Schema.String),
  targetPolicies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        default: Schema.optional(Schema.Boolean),
        name: Schema.optional(Schema.String),
      }),
    ),
  ).pipe(T.JsonName("target_policies")),
  targeted: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/dex/devices/dex_tests",
  }),
) as unknown as Schema.Schema<CreateDeviceDexTestRequest>;

export interface CreateDeviceDexTestResponse {
  /** The configuration object which contains the details for the WARP client to conduct the test. */
  data: { host?: string; kind?: string; method?: string };
  /** Determines whether or not the test is active. */
  enabled: boolean;
  /** How often the test will run. */
  interval: string;
  /** The name of the DEX test. Must be unique. */
  name: string;
  /** Additional details about the test. */
  description?: string;
  /** DEX rules targeted by this test */
  targetPolicies?: { id?: string; default?: boolean; name?: string }[];
  targeted?: boolean;
  /** The unique identifier for the test. */
  testId?: string;
}

export const CreateDeviceDexTestResponse = Schema.Struct({
  data: Schema.Struct({
    host: Schema.optional(Schema.String),
    kind: Schema.optional(Schema.String),
    method: Schema.optional(Schema.String),
  }),
  enabled: Schema.Boolean,
  interval: Schema.String,
  name: Schema.String,
  description: Schema.optional(Schema.String),
  targetPolicies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        default: Schema.optional(Schema.Boolean),
        name: Schema.optional(Schema.String),
      }),
    ),
  ).pipe(T.JsonName("target_policies")),
  targeted: Schema.optional(Schema.Boolean),
  testId: Schema.optional(Schema.String).pipe(T.JsonName("test_id")),
}) as unknown as Schema.Schema<CreateDeviceDexTestResponse>;

export const createDeviceDexTest: (
  input: CreateDeviceDexTestRequest,
) => Effect.Effect<
  CreateDeviceDexTestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDeviceDexTestRequest,
  output: CreateDeviceDexTestResponse,
  errors: [],
}));

export interface UpdateDeviceDexTestRequest {
  dexTestId: string;
  /** Path param: */
  accountId: string;
  /** Body param: The configuration object which contains the details for the WARP client to conduct the test. */
  data: { host?: string; kind?: string; method?: string };
  /** Body param: Determines whether or not the test is active. */
  enabled: boolean;
  /** Body param: How often the test will run. */
  interval: string;
  /** Body param: The name of the DEX test. Must be unique. */
  name: string;
  /** Body param: Additional details about the test. */
  description?: string;
  /** Body param: DEX rules targeted by this test */
  targetPolicies?: { id?: string; default?: boolean; name?: string }[];
  /** Body param: */
  targeted?: boolean;
}

export const UpdateDeviceDexTestRequest = Schema.Struct({
  dexTestId: Schema.String.pipe(T.HttpPath("dexTestId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  data: Schema.Struct({
    host: Schema.optional(Schema.String),
    kind: Schema.optional(Schema.String),
    method: Schema.optional(Schema.String),
  }),
  enabled: Schema.Boolean,
  interval: Schema.String,
  name: Schema.String,
  description: Schema.optional(Schema.String),
  targetPolicies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        default: Schema.optional(Schema.Boolean),
        name: Schema.optional(Schema.String),
      }),
    ),
  ).pipe(T.JsonName("target_policies")),
  targeted: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/dex/devices/dex_tests/{dexTestId}",
  }),
) as unknown as Schema.Schema<UpdateDeviceDexTestRequest>;

export interface UpdateDeviceDexTestResponse {
  /** The configuration object which contains the details for the WARP client to conduct the test. */
  data: { host?: string; kind?: string; method?: string };
  /** Determines whether or not the test is active. */
  enabled: boolean;
  /** How often the test will run. */
  interval: string;
  /** The name of the DEX test. Must be unique. */
  name: string;
  /** Additional details about the test. */
  description?: string;
  /** DEX rules targeted by this test */
  targetPolicies?: { id?: string; default?: boolean; name?: string }[];
  targeted?: boolean;
  /** The unique identifier for the test. */
  testId?: string;
}

export const UpdateDeviceDexTestResponse = Schema.Struct({
  data: Schema.Struct({
    host: Schema.optional(Schema.String),
    kind: Schema.optional(Schema.String),
    method: Schema.optional(Schema.String),
  }),
  enabled: Schema.Boolean,
  interval: Schema.String,
  name: Schema.String,
  description: Schema.optional(Schema.String),
  targetPolicies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        default: Schema.optional(Schema.Boolean),
        name: Schema.optional(Schema.String),
      }),
    ),
  ).pipe(T.JsonName("target_policies")),
  targeted: Schema.optional(Schema.Boolean),
  testId: Schema.optional(Schema.String).pipe(T.JsonName("test_id")),
}) as unknown as Schema.Schema<UpdateDeviceDexTestResponse>;

export const updateDeviceDexTest: (
  input: UpdateDeviceDexTestRequest,
) => Effect.Effect<
  UpdateDeviceDexTestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDeviceDexTestRequest,
  output: UpdateDeviceDexTestResponse,
  errors: [],
}));

export interface DeleteDeviceDexTestRequest {
  dexTestId: string;
  accountId: string;
}

export const DeleteDeviceDexTestRequest = Schema.Struct({
  dexTestId: Schema.String.pipe(T.HttpPath("dexTestId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/dex/devices/dex_tests/{dexTestId}",
  }),
) as unknown as Schema.Schema<DeleteDeviceDexTestRequest>;

export interface DeleteDeviceDexTestResponse {
  dexTests?: {
    data: { host?: string; kind?: string; method?: string };
    enabled: boolean;
    interval: string;
    name: string;
    description?: string;
    targetPolicies?: { id?: string; default?: boolean; name?: string }[];
    targeted?: boolean;
    testId?: string;
  }[];
}

export const DeleteDeviceDexTestResponse = Schema.Struct({
  dexTests: Schema.optional(
    Schema.Array(
      Schema.Struct({
        data: Schema.Struct({
          host: Schema.optional(Schema.String),
          kind: Schema.optional(Schema.String),
          method: Schema.optional(Schema.String),
        }),
        enabled: Schema.Boolean,
        interval: Schema.String,
        name: Schema.String,
        description: Schema.optional(Schema.String),
        targetPolicies: Schema.optional(
          Schema.Array(
            Schema.Struct({
              id: Schema.optional(Schema.String),
              default: Schema.optional(Schema.Boolean),
              name: Schema.optional(Schema.String),
            }),
          ),
        ).pipe(T.JsonName("target_policies")),
        targeted: Schema.optional(Schema.Boolean),
        testId: Schema.optional(Schema.String).pipe(T.JsonName("test_id")),
      }),
    ),
  ).pipe(T.JsonName("dex_tests")),
}) as unknown as Schema.Schema<DeleteDeviceDexTestResponse>;

export const deleteDeviceDexTest: (
  input: DeleteDeviceDexTestRequest,
) => Effect.Effect<
  DeleteDeviceDexTestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDeviceDexTestRequest,
  output: DeleteDeviceDexTestResponse,
  errors: [],
}));

// =============================================================================
// DeviceFleetStatus
// =============================================================================

export interface GetDeviceFleetStatusRequest {
  deviceId: string;
  /** Path param: Unique identifier for account */
  accountId: string;
  /** Query param: Number of minutes before current time */
  sinceMinutes: number;
  /** Query param: List of data centers to filter results */
  colo?: string;
  /** Query param: Number of minutes before current time */
  timeNow?: string;
}

export const GetDeviceFleetStatusRequest = Schema.Struct({
  deviceId: Schema.String.pipe(T.HttpPath("deviceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  sinceMinutes: Schema.Number.pipe(T.HttpQuery("since_minutes")),
  colo: Schema.optional(Schema.String).pipe(T.HttpQuery("colo")),
  timeNow: Schema.optional(Schema.String).pipe(T.HttpQuery("time_now")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/devices/{deviceId}/fleet-status/live",
  }),
) as unknown as Schema.Schema<GetDeviceFleetStatusRequest>;

export interface GetDeviceFleetStatusResponse {
  /** Cloudflare colo */
  colo: string;
  /** Device identifier (UUID v4) */
  deviceId: string;
  /** The mode under which the WARP client is run */
  mode: string;
  /** Operating system */
  platform: string;
  /** Network status */
  status: string;
  /** Timestamp in ISO format */
  timestamp: string;
  /** WARP client version */
  version: string;
  alwaysOn?: boolean | null;
  batteryCharging?: boolean | null;
  batteryCycles?: number | null;
  batteryPct?: number | null;
  connectionType?: string | null;
  cpuPct?: number | null;
  cpuPctByApp?: { cpuPct?: number; name?: string }[][] | null;
  deviceIpv4?: {
    address?: string | null;
    asn?: number | null;
    aso?: string | null;
    location?: {
      city?: string | null;
      countryIso?: string | null;
      stateIso?: string | null;
      zip?: string | null;
    };
    netmask?: string | null;
    version?: string | null;
  };
  deviceIpv6?: {
    address?: string | null;
    asn?: number | null;
    aso?: string | null;
    location?: {
      city?: string | null;
      countryIso?: string | null;
      stateIso?: string | null;
      zip?: string | null;
    };
    netmask?: string | null;
    version?: string | null;
  };
  /** Device identifier (human readable) */
  deviceName?: string;
  diskReadBps?: number | null;
  diskUsagePct?: number | null;
  diskWriteBps?: number | null;
  dohSubdomain?: string | null;
  estimatedLossPct?: number | null;
  firewallEnabled?: boolean | null;
  gatewayIpv4?: {
    address?: string | null;
    asn?: number | null;
    aso?: string | null;
    location?: {
      city?: string | null;
      countryIso?: string | null;
      stateIso?: string | null;
      zip?: string | null;
    };
    netmask?: string | null;
    version?: string | null;
  };
  gatewayIpv6?: {
    address?: string | null;
    asn?: number | null;
    aso?: string | null;
    location?: {
      city?: string | null;
      countryIso?: string | null;
      stateIso?: string | null;
      zip?: string | null;
    };
    netmask?: string | null;
    version?: string | null;
  };
  handshakeLatencyMs?: number | null;
  ispIpv4?: {
    address?: string | null;
    asn?: number | null;
    aso?: string | null;
    location?: {
      city?: string | null;
      countryIso?: string | null;
      stateIso?: string | null;
      zip?: string | null;
    };
    netmask?: string | null;
    version?: string | null;
  };
  ispIpv6?: {
    address?: string | null;
    asn?: number | null;
    aso?: string | null;
    location?: {
      city?: string | null;
      countryIso?: string | null;
      stateIso?: string | null;
      zip?: string | null;
    };
    netmask?: string | null;
    version?: string | null;
  };
  metal?: string | null;
  networkRcvdBps?: number | null;
  networkSentBps?: number | null;
  networkSsid?: string | null;
  /** User contact email address */
  personEmail?: string;
  ramAvailableKb?: number | null;
  ramUsedPct?: number | null;
  ramUsedPctByApp?: { name?: string; ramUsedPct?: number }[][] | null;
  switchLocked?: boolean | null;
  wifiStrengthDbm?: number | null;
}

export const GetDeviceFleetStatusResponse = Schema.Struct({
  colo: Schema.String,
  deviceId: Schema.String,
  mode: Schema.String,
  platform: Schema.String,
  status: Schema.String,
  timestamp: Schema.String,
  version: Schema.String,
  alwaysOn: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  batteryCharging: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  batteryCycles: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  batteryPct: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  connectionType: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  cpuPct: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  cpuPctByApp: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Array(
          Schema.Struct({
            cpuPct: Schema.optional(Schema.Number).pipe(T.JsonName("cpu_pct")),
            name: Schema.optional(Schema.String),
          }),
        ),
      ),
      Schema.Null,
    ),
  ),
  deviceIpv4: Schema.optional(
    Schema.Struct({
      address: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      aso: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      location: Schema.optional(
        Schema.Struct({
          city: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
          countryIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("country_iso")),
          stateIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("state_iso")),
          zip: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        }),
      ),
      netmask: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      version: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
  deviceIpv6: Schema.optional(
    Schema.Struct({
      address: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      aso: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      location: Schema.optional(
        Schema.Struct({
          city: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
          countryIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("country_iso")),
          stateIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("state_iso")),
          zip: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        }),
      ),
      netmask: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      version: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
  deviceName: Schema.optional(Schema.String),
  diskReadBps: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  diskUsagePct: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  diskWriteBps: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  dohSubdomain: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  estimatedLossPct: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  firewallEnabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  gatewayIpv4: Schema.optional(
    Schema.Struct({
      address: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      aso: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      location: Schema.optional(
        Schema.Struct({
          city: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
          countryIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("country_iso")),
          stateIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("state_iso")),
          zip: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        }),
      ),
      netmask: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      version: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
  gatewayIpv6: Schema.optional(
    Schema.Struct({
      address: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      aso: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      location: Schema.optional(
        Schema.Struct({
          city: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
          countryIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("country_iso")),
          stateIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("state_iso")),
          zip: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        }),
      ),
      netmask: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      version: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
  handshakeLatencyMs: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  ispIpv4: Schema.optional(
    Schema.Struct({
      address: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      aso: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      location: Schema.optional(
        Schema.Struct({
          city: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
          countryIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("country_iso")),
          stateIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("state_iso")),
          zip: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        }),
      ),
      netmask: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      version: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
  ispIpv6: Schema.optional(
    Schema.Struct({
      address: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      aso: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      location: Schema.optional(
        Schema.Struct({
          city: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
          countryIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("country_iso")),
          stateIso: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("state_iso")),
          zip: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
        }),
      ),
      netmask: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      version: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
  metal: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  networkRcvdBps: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  networkSentBps: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  networkSsid: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  personEmail: Schema.optional(Schema.String),
  ramAvailableKb: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  ramUsedPct: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  ramUsedPctByApp: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Array(
          Schema.Struct({
            name: Schema.optional(Schema.String),
            ramUsedPct: Schema.optional(Schema.Number).pipe(
              T.JsonName("ram_used_pct"),
            ),
          }),
        ),
      ),
      Schema.Null,
    ),
  ),
  switchLocked: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  wifiStrengthDbm: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
}) as unknown as Schema.Schema<GetDeviceFleetStatusResponse>;

export const getDeviceFleetStatus: (
  input: GetDeviceFleetStatusRequest,
) => Effect.Effect<
  GetDeviceFleetStatusResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDeviceFleetStatusRequest,
  output: GetDeviceFleetStatusResponse,
  errors: [],
}));

// =============================================================================
// DeviceNetwork
// =============================================================================

export interface GetDeviceNetworkRequest {
  networkId: string;
  accountId: string;
}

export const GetDeviceNetworkRequest = Schema.Struct({
  networkId: Schema.String.pipe(T.HttpPath("networkId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/devices/networks/{networkId}",
  }),
) as unknown as Schema.Schema<GetDeviceNetworkRequest>;

export type GetDeviceNetworkResponse = unknown;

export const GetDeviceNetworkResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDeviceNetworkResponse>;

export const getDeviceNetwork: (
  input: GetDeviceNetworkRequest,
) => Effect.Effect<
  GetDeviceNetworkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDeviceNetworkRequest,
  output: GetDeviceNetworkResponse,
  errors: [],
}));

export interface CreateDeviceNetworkRequest {
  /** Path param: */
  accountId: string;
  /** Body param: The configuration object containing information for the WARP client to detect the managed network. */
  config: { tlsSockaddr: string; sha256?: string };
  /** Body param: The name of the device managed network. This name must be unique. */
  name: string;
  /** Body param: The type of device managed network. */
  type: "tls";
}

export const CreateDeviceNetworkRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  config: Schema.Struct({
    tlsSockaddr: Schema.String.pipe(T.JsonName("tls_sockaddr")),
    sha256: Schema.optional(Schema.String),
  }),
  name: Schema.String,
  type: Schema.Literal("tls"),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/devices/networks" }),
) as unknown as Schema.Schema<CreateDeviceNetworkRequest>;

export type CreateDeviceNetworkResponse = unknown;

export const CreateDeviceNetworkResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateDeviceNetworkResponse>;

export const createDeviceNetwork: (
  input: CreateDeviceNetworkRequest,
) => Effect.Effect<
  CreateDeviceNetworkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDeviceNetworkRequest,
  output: CreateDeviceNetworkResponse,
  errors: [],
}));

export interface UpdateDeviceNetworkRequest {
  networkId: string;
  /** Path param: */
  accountId: string;
  /** Body param: The configuration object containing information for the WARP client to detect the managed network. */
  config?: { tlsSockaddr: string; sha256?: string };
  /** Body param: The name of the device managed network. This name must be unique. */
  name?: string;
  /** Body param: The type of device managed network. */
  type?: "tls";
}

export const UpdateDeviceNetworkRequest = Schema.Struct({
  networkId: Schema.String.pipe(T.HttpPath("networkId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  config: Schema.optional(
    Schema.Struct({
      tlsSockaddr: Schema.String.pipe(T.JsonName("tls_sockaddr")),
      sha256: Schema.optional(Schema.String),
    }),
  ),
  name: Schema.optional(Schema.String),
  type: Schema.optional(Schema.Literal("tls")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/devices/networks/{networkId}",
  }),
) as unknown as Schema.Schema<UpdateDeviceNetworkRequest>;

export type UpdateDeviceNetworkResponse = unknown;

export const UpdateDeviceNetworkResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateDeviceNetworkResponse>;

export const updateDeviceNetwork: (
  input: UpdateDeviceNetworkRequest,
) => Effect.Effect<
  UpdateDeviceNetworkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDeviceNetworkRequest,
  output: UpdateDeviceNetworkResponse,
  errors: [],
}));

// =============================================================================
// DeviceOverrideCode
// =============================================================================

export interface GetDeviceOverrideCodeRequest {
  registrationId: string;
  accountId: string;
}

export const GetDeviceOverrideCodeRequest = Schema.Struct({
  registrationId: Schema.String.pipe(T.HttpPath("registrationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/devices/registrations/{registrationId}/override_codes",
  }),
) as unknown as Schema.Schema<GetDeviceOverrideCodeRequest>;

export interface GetDeviceOverrideCodeResponse {
  disableForTime?: Record<string, unknown>;
}

export const GetDeviceOverrideCodeResponse = Schema.Struct({
  disableForTime: Schema.optional(Schema.Struct({})).pipe(
    T.JsonName("disable_for_time"),
  ),
}) as unknown as Schema.Schema<GetDeviceOverrideCodeResponse>;

export const getDeviceOverrideCode: (
  input: GetDeviceOverrideCodeRequest,
) => Effect.Effect<
  GetDeviceOverrideCodeResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDeviceOverrideCodeRequest,
  output: GetDeviceOverrideCodeResponse,
  errors: [],
}));

// =============================================================================
// DevicePolicyCustom
// =============================================================================

export interface GetDevicePolicyCustomRequest {
  policyId: string;
  accountId: string;
}

export const GetDevicePolicyCustomRequest = Schema.Struct({
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/devices/policy/{policyId}",
  }),
) as unknown as Schema.Schema<GetDevicePolicyCustomRequest>;

export type GetDevicePolicyCustomResponse = unknown;

export const GetDevicePolicyCustomResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDevicePolicyCustomResponse>;

export const getDevicePolicyCustom: (
  input: GetDevicePolicyCustomRequest,
) => Effect.Effect<
  GetDevicePolicyCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDevicePolicyCustomRequest,
  output: GetDevicePolicyCustomResponse,
  errors: [],
}));

export interface CreateDevicePolicyCustomRequest {
  /** Path param: */
  accountId: string;
  /** Body param: The wirefilter expression to match devices. Available values: "identity.email", "identity.groups.id", "identity.groups.name", "identity.groups.email", "identity.service_token_uuid", "ident */
  match: string;
  /** Body param: The name of the device settings profile. */
  name: string;
  /** Body param: The precedence of the policy. Lower values indicate higher precedence. Policies will be evaluated in ascending order of this field. */
  precedence: number;
  /** Body param: Whether to allow the user to switch WARP between modes. */
  allowModeSwitch?: boolean;
  /** Body param: Whether to receive update notifications when a new version of the client is available. */
  allowUpdates?: boolean;
  /** Body param: Whether to allow devices to leave the organization. */
  allowedToLeave?: boolean;
  /** Body param: The amount of time in seconds to reconnect after having been disabled. */
  autoConnect?: number;
  /** Body param: Turn on the captive portal after the specified amount of time. */
  captivePortal?: number;
  /** Body param: A description of the policy. */
  description?: string;
  /** Body param: If the `dns_server` field of a fallback domain is not present, the client will fall back to a best guess of the default/system DNS resolvers unless this policy option is set to `true`. */
  disableAutoFallback?: boolean;
  /** Body param: Whether the policy will be applied to matching devices. */
  enabled?: boolean;
  /** Body param: List of routes excluded in the WARP client's tunnel. Both 'exclude' and 'include' cannot be set in the same request. */
  exclude?: unknown[];
  /** Body param: Whether to add Microsoft IPs to Split Tunnel exclusions. */
  excludeOfficeIps?: boolean;
  /** Body param: List of routes included in the WARP client's tunnel. Both 'exclude' and 'include' cannot be set in the same request. */
  include?: unknown[];
  /** Body param: The amount of time in minutes a user is allowed access to their LAN. A value of 0 will allow LAN access until the next WARP reconnection, such as a reboot or a laptop waking from sleep. No */
  lanAllowMinutes?: number;
  /** Body param: The size of the subnet for the local access network. Note that this field is omitted from the response if null or unset. */
  lanAllowSubnetSize?: number;
  /** Body param: Determines if the operating system will register WARP's local interface IP with your on-premises DNS server. */
  registerInterfaceIpWithDns?: boolean;
  /** Body param: Determines whether the WARP client indicates to SCCM that it is inside a VPN boundary. (Windows only). */
  sccmVpnBoundarySupport?: boolean;
  /** Body param: */
  serviceModeV2?: { mode?: string; port?: number };
  /** Body param: The URL to launch when the Send Feedback button is clicked. */
  supportUrl?: string;
  /** Body param: Whether to allow the user to turn off the WARP switch and disconnect the client. */
  switchLocked?: boolean;
  /** Body param: Determines which tunnel protocol to use. */
  tunnelProtocol?: string;
}

export const CreateDevicePolicyCustomRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  match: Schema.String,
  name: Schema.String,
  precedence: Schema.Number,
  allowModeSwitch: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_mode_switch"),
  ),
  allowUpdates: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_updates"),
  ),
  allowedToLeave: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allowed_to_leave"),
  ),
  autoConnect: Schema.optional(Schema.Number).pipe(T.JsonName("auto_connect")),
  captivePortal: Schema.optional(Schema.Number).pipe(
    T.JsonName("captive_portal"),
  ),
  description: Schema.optional(Schema.String),
  disableAutoFallback: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("disable_auto_fallback"),
  ),
  enabled: Schema.optional(Schema.Boolean),
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  excludeOfficeIps: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("exclude_office_ips"),
  ),
  include: Schema.optional(Schema.Array(Schema.Unknown)),
  lanAllowMinutes: Schema.optional(Schema.Number).pipe(
    T.JsonName("lan_allow_minutes"),
  ),
  lanAllowSubnetSize: Schema.optional(Schema.Number).pipe(
    T.JsonName("lan_allow_subnet_size"),
  ),
  registerInterfaceIpWithDns: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("register_interface_ip_with_dns"),
  ),
  sccmVpnBoundarySupport: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("sccm_vpn_boundary_support"),
  ),
  serviceModeV2: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.String),
      port: Schema.optional(Schema.Number),
    }),
  ).pipe(T.JsonName("service_mode_v2")),
  supportUrl: Schema.optional(Schema.String).pipe(T.JsonName("support_url")),
  switchLocked: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("switch_locked"),
  ),
  tunnelProtocol: Schema.optional(Schema.String).pipe(
    T.JsonName("tunnel_protocol"),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/devices/policy" }),
) as unknown as Schema.Schema<CreateDevicePolicyCustomRequest>;

export type CreateDevicePolicyCustomResponse = unknown;

export const CreateDevicePolicyCustomResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateDevicePolicyCustomResponse>;

export const createDevicePolicyCustom: (
  input: CreateDevicePolicyCustomRequest,
) => Effect.Effect<
  CreateDevicePolicyCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDevicePolicyCustomRequest,
  output: CreateDevicePolicyCustomResponse,
  errors: [],
}));

export interface PatchDevicePolicyCustomRequest {
  policyId: string;
  /** Path param: */
  accountId: string;
  /** Body param: Whether to allow the user to switch WARP between modes. */
  allowModeSwitch?: boolean;
  /** Body param: Whether to receive update notifications when a new version of the client is available. */
  allowUpdates?: boolean;
  /** Body param: Whether to allow devices to leave the organization. */
  allowedToLeave?: boolean;
  /** Body param: The amount of time in seconds to reconnect after having been disabled. */
  autoConnect?: number;
  /** Body param: Turn on the captive portal after the specified amount of time. */
  captivePortal?: number;
  /** Body param: A description of the policy. */
  description?: string;
  /** Body param: If the `dns_server` field of a fallback domain is not present, the client will fall back to a best guess of the default/system DNS resolvers unless this policy option is set to `true`. */
  disableAutoFallback?: boolean;
  /** Body param: Whether the policy will be applied to matching devices. */
  enabled?: boolean;
  /** Body param: List of routes excluded in the WARP client's tunnel. Both 'exclude' and 'include' cannot be set in the same request. */
  exclude?: unknown[];
  /** Body param: Whether to add Microsoft IPs to Split Tunnel exclusions. */
  excludeOfficeIps?: boolean;
  /** Body param: List of routes included in the WARP client's tunnel. Both 'exclude' and 'include' cannot be set in the same request. */
  include?: unknown[];
  /** Body param: The amount of time in minutes a user is allowed access to their LAN. A value of 0 will allow LAN access until the next WARP reconnection, such as a reboot or a laptop waking from sleep. No */
  lanAllowMinutes?: number;
  /** Body param: The size of the subnet for the local access network. Note that this field is omitted from the response if null or unset. */
  lanAllowSubnetSize?: number;
  /** Body param: The wirefilter expression to match devices. Available values: "identity.email", "identity.groups.id", "identity.groups.name", "identity.groups.email", "identity.service_token_uuid", "ident */
  match?: string;
  /** Body param: The name of the device settings profile. */
  name?: string;
  /** Body param: The precedence of the policy. Lower values indicate higher precedence. Policies will be evaluated in ascending order of this field. */
  precedence?: number;
  /** Body param: Determines if the operating system will register WARP's local interface IP with your on-premises DNS server. */
  registerInterfaceIpWithDns?: boolean;
  /** Body param: Determines whether the WARP client indicates to SCCM that it is inside a VPN boundary. (Windows only). */
  sccmVpnBoundarySupport?: boolean;
  /** Body param: */
  serviceModeV2?: { mode?: string; port?: number };
  /** Body param: The URL to launch when the Send Feedback button is clicked. */
  supportUrl?: string;
  /** Body param: Whether to allow the user to turn off the WARP switch and disconnect the client. */
  switchLocked?: boolean;
  /** Body param: Determines which tunnel protocol to use. */
  tunnelProtocol?: string;
}

export const PatchDevicePolicyCustomRequest = Schema.Struct({
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  allowModeSwitch: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_mode_switch"),
  ),
  allowUpdates: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_updates"),
  ),
  allowedToLeave: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allowed_to_leave"),
  ),
  autoConnect: Schema.optional(Schema.Number).pipe(T.JsonName("auto_connect")),
  captivePortal: Schema.optional(Schema.Number).pipe(
    T.JsonName("captive_portal"),
  ),
  description: Schema.optional(Schema.String),
  disableAutoFallback: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("disable_auto_fallback"),
  ),
  enabled: Schema.optional(Schema.Boolean),
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  excludeOfficeIps: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("exclude_office_ips"),
  ),
  include: Schema.optional(Schema.Array(Schema.Unknown)),
  lanAllowMinutes: Schema.optional(Schema.Number).pipe(
    T.JsonName("lan_allow_minutes"),
  ),
  lanAllowSubnetSize: Schema.optional(Schema.Number).pipe(
    T.JsonName("lan_allow_subnet_size"),
  ),
  match: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  precedence: Schema.optional(Schema.Number),
  registerInterfaceIpWithDns: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("register_interface_ip_with_dns"),
  ),
  sccmVpnBoundarySupport: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("sccm_vpn_boundary_support"),
  ),
  serviceModeV2: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.String),
      port: Schema.optional(Schema.Number),
    }),
  ).pipe(T.JsonName("service_mode_v2")),
  supportUrl: Schema.optional(Schema.String).pipe(T.JsonName("support_url")),
  switchLocked: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("switch_locked"),
  ),
  tunnelProtocol: Schema.optional(Schema.String).pipe(
    T.JsonName("tunnel_protocol"),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/devices/policy/{policyId}",
  }),
) as unknown as Schema.Schema<PatchDevicePolicyCustomRequest>;

export type PatchDevicePolicyCustomResponse = unknown;

export const PatchDevicePolicyCustomResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchDevicePolicyCustomResponse>;

export const patchDevicePolicyCustom: (
  input: PatchDevicePolicyCustomRequest,
) => Effect.Effect<
  PatchDevicePolicyCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchDevicePolicyCustomRequest,
  output: PatchDevicePolicyCustomResponse,
  errors: [],
}));

// =============================================================================
// DevicePolicyDefault
// =============================================================================

export interface GetDevicePolicyDefaultRequest {
  accountId: string;
}

export const GetDevicePolicyDefaultRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/devices/policy" }),
) as unknown as Schema.Schema<GetDevicePolicyDefaultRequest>;

export type GetDevicePolicyDefaultResponse = unknown;

export const GetDevicePolicyDefaultResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDevicePolicyDefaultResponse>;

export const getDevicePolicyDefault: (
  input: GetDevicePolicyDefaultRequest,
) => Effect.Effect<
  GetDevicePolicyDefaultResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDevicePolicyDefaultRequest,
  output: GetDevicePolicyDefaultResponse,
  errors: [],
}));

export interface PatchDevicePolicyDefaultRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Whether to allow the user to switch WARP between modes. */
  allowModeSwitch?: boolean;
  /** Body param: Whether to receive update notifications when a new version of the client is available. */
  allowUpdates?: boolean;
  /** Body param: Whether to allow devices to leave the organization. */
  allowedToLeave?: boolean;
  /** Body param: The amount of time in seconds to reconnect after having been disabled. */
  autoConnect?: number;
  /** Body param: Turn on the captive portal after the specified amount of time. */
  captivePortal?: number;
  /** Body param: If the `dns_server` field of a fallback domain is not present, the client will fall back to a best guess of the default/system DNS resolvers unless this policy option is set to `true`. */
  disableAutoFallback?: boolean;
  /** Body param: List of routes excluded in the WARP client's tunnel. Both 'exclude' and 'include' cannot be set in the same request. */
  exclude?: unknown[];
  /** Body param: Whether to add Microsoft IPs to Split Tunnel exclusions. */
  excludeOfficeIps?: boolean;
  /** Body param: List of routes included in the WARP client's tunnel. Both 'exclude' and 'include' cannot be set in the same request. */
  include?: unknown[];
  /** Body param: The amount of time in minutes a user is allowed access to their LAN. A value of 0 will allow LAN access until the next WARP reconnection, such as a reboot or a laptop waking from sleep. No */
  lanAllowMinutes?: number;
  /** Body param: The size of the subnet for the local access network. Note that this field is omitted from the response if null or unset. */
  lanAllowSubnetSize?: number;
  /** Body param: Determines if the operating system will register WARP's local interface IP with your on-premises DNS server. */
  registerInterfaceIpWithDns?: boolean;
  /** Body param: Determines whether the WARP client indicates to SCCM that it is inside a VPN boundary. (Windows only). */
  sccmVpnBoundarySupport?: boolean;
  /** Body param: */
  serviceModeV2?: { mode?: string; port?: number };
  /** Body param: The URL to launch when the Send Feedback button is clicked. */
  supportUrl?: string;
  /** Body param: Whether to allow the user to turn off the WARP switch and disconnect the client. */
  switchLocked?: boolean;
  /** Body param: Determines which tunnel protocol to use. */
  tunnelProtocol?: string;
}

export const PatchDevicePolicyDefaultRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  allowModeSwitch: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_mode_switch"),
  ),
  allowUpdates: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_updates"),
  ),
  allowedToLeave: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allowed_to_leave"),
  ),
  autoConnect: Schema.optional(Schema.Number).pipe(T.JsonName("auto_connect")),
  captivePortal: Schema.optional(Schema.Number).pipe(
    T.JsonName("captive_portal"),
  ),
  disableAutoFallback: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("disable_auto_fallback"),
  ),
  exclude: Schema.optional(Schema.Array(Schema.Unknown)),
  excludeOfficeIps: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("exclude_office_ips"),
  ),
  include: Schema.optional(Schema.Array(Schema.Unknown)),
  lanAllowMinutes: Schema.optional(Schema.Number).pipe(
    T.JsonName("lan_allow_minutes"),
  ),
  lanAllowSubnetSize: Schema.optional(Schema.Number).pipe(
    T.JsonName("lan_allow_subnet_size"),
  ),
  registerInterfaceIpWithDns: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("register_interface_ip_with_dns"),
  ),
  sccmVpnBoundarySupport: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("sccm_vpn_boundary_support"),
  ),
  serviceModeV2: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.String),
      port: Schema.optional(Schema.Number),
    }),
  ).pipe(T.JsonName("service_mode_v2")),
  supportUrl: Schema.optional(Schema.String).pipe(T.JsonName("support_url")),
  switchLocked: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("switch_locked"),
  ),
  tunnelProtocol: Schema.optional(Schema.String).pipe(
    T.JsonName("tunnel_protocol"),
  ),
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/devices/policy" }),
) as unknown as Schema.Schema<PatchDevicePolicyDefaultRequest>;

export type PatchDevicePolicyDefaultResponse = unknown;

export const PatchDevicePolicyDefaultResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchDevicePolicyDefaultResponse>;

export const patchDevicePolicyDefault: (
  input: PatchDevicePolicyDefaultRequest,
) => Effect.Effect<
  PatchDevicePolicyDefaultResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchDevicePolicyDefaultRequest,
  output: PatchDevicePolicyDefaultResponse,
  errors: [],
}));

// =============================================================================
// DevicePolicyDefaultCertificate
// =============================================================================

export interface GetDevicePolicyDefaultCertificateRequest {
  zoneId: string;
}

export const GetDevicePolicyDefaultCertificateRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/devices/policy/certificates",
  }),
) as unknown as Schema.Schema<GetDevicePolicyDefaultCertificateRequest>;

export type GetDevicePolicyDefaultCertificateResponse = unknown;

export const GetDevicePolicyDefaultCertificateResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDevicePolicyDefaultCertificateResponse>;

export const getDevicePolicyDefaultCertificate: (
  input: GetDevicePolicyDefaultCertificateRequest,
) => Effect.Effect<
  GetDevicePolicyDefaultCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDevicePolicyDefaultCertificateRequest,
  output: GetDevicePolicyDefaultCertificateResponse,
  errors: [],
}));

export interface PatchDevicePolicyDefaultCertificateRequest {
  /** Path param: */
  zoneId: string;
  /** Body param: The current status of the device policy certificate provisioning feature for WARP clients. */
  enabled: boolean;
}

export const PatchDevicePolicyDefaultCertificateRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  enabled: Schema.Boolean,
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/zones/{zone_id}/devices/policy/certificates",
  }),
) as unknown as Schema.Schema<PatchDevicePolicyDefaultCertificateRequest>;

export type PatchDevicePolicyDefaultCertificateResponse = unknown;

export const PatchDevicePolicyDefaultCertificateResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchDevicePolicyDefaultCertificateResponse>;

export const patchDevicePolicyDefaultCertificate: (
  input: PatchDevicePolicyDefaultCertificateRequest,
) => Effect.Effect<
  PatchDevicePolicyDefaultCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchDevicePolicyDefaultCertificateRequest,
  output: PatchDevicePolicyDefaultCertificateResponse,
  errors: [],
}));

// =============================================================================
// DevicePosture
// =============================================================================

export interface GetDevicePostureRequest {
  ruleId: string;
  accountId: string;
}

export const GetDevicePostureRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/devices/posture/{ruleId}",
  }),
) as unknown as Schema.Schema<GetDevicePostureRequest>;

export type GetDevicePostureResponse = unknown;

export const GetDevicePostureResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDevicePostureResponse>;

export const getDevicePosture: (
  input: GetDevicePostureRequest,
) => Effect.Effect<
  GetDevicePostureResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDevicePostureRequest,
  output: GetDevicePostureResponse,
  errors: [],
}));

export interface CreateDevicePostureRequest {
  /** Path param: */
  accountId: string;
  /** Body param: The name of the device posture rule. */
  name: string;
  /** Body param: The type of device posture rule. */
  type:
    | "file"
    | "application"
    | "tanium"
    | "gateway"
    | "warp"
    | "disk_encryption"
    | "serial_number"
    | "sentinelone"
    | "carbonblack"
    | "firewall"
    | "os_version"
    | "domain_joined"
    | "client_certificate"
    | "client_certificate_v2"
    | "unique_client_id"
    | "kolide"
    | "tanium_s2s"
    | "crowdstrike_s2s"
    | "intune"
    | "workspace_one"
    | "sentinelone_s2s"
    | "custom_s2s";
  /** Body param: The description of the device posture rule. */
  description?: string;
  /** Body param: Sets the expiration time for a posture check result. If empty, the result remains valid until it is overwritten by new data from the WARP client. */
  expiration?: string;
  /** Body param: The value to be checked against. */
  input?:
    | {
        operatingSystem: "windows" | "linux" | "mac";
        path: string;
        exists?: boolean;
        sha256?: string;
        thumbprint?: string;
      }
    | { id: string; operatingSystem: "android" | "ios" | "chromeos" }
    | { operatingSystem: "windows"; domain?: string }
    | {
        operatingSystem: "windows";
        operator: "<" | "<=" | ">" | ">=" | "==";
        version: string;
        osDistroName?: string;
        osDistroRevision?: string;
        osVersionExtra?: string;
      }
    | { enabled: boolean; operatingSystem: "windows" | "mac" }
    | {
        operatingSystem: "windows" | "linux" | "mac";
        path: string;
        sha256?: string;
        thumbprint?: string;
      }
    | { id: string }
    | { checkDisks?: string[]; requireAll?: boolean }
    | { certificateId: string; cn: string }
    | {
        certificateId: string;
        checkPrivateKey: boolean;
        operatingSystem: "windows" | "linux" | "mac";
        cn?: string;
        extendedKeyUsage?: ("clientAuth" | "emailProtection")[];
        locations?: { paths?: string[]; trustStores?: ("system" | "user")[] };
        subjectAlternativeNames?: string[];
      }
    | {
        complianceStatus: "compliant" | "noncompliant" | "unknown";
        connectionId: string;
      }
    | {
        connectionId: string;
        lastSeen?: string;
        operator?: "<" | "<=" | ">" | ">=" | "==";
        os?: string;
        overall?: string;
        sensorConfig?: string;
        state?: "online" | "offline" | "unknown";
        version?: string;
        versionOperator?: "<" | "<=" | ">" | ">=" | "==";
      }
    | {
        complianceStatus:
          | "compliant"
          | "noncompliant"
          | "unknown"
          | "notapplicable"
          | "ingraceperiod"
          | "error";
        connectionId: string;
      }
    | {
        connectionId: string;
        countOperator: "<" | "<=" | ">" | ">=" | "==";
        issueCount: string;
      }
    | {
        connectionId: string;
        eidLastSeen?: string;
        operator?: "<" | "<=" | ">" | ">=" | "==";
        riskLevel?: "low" | "medium" | "high" | "critical";
        scoreOperator?: "<" | "<=" | ">" | ">=" | "==";
        totalScore?: number;
      }
    | {
        connectionId: string;
        activeThreats?: number;
        infected?: boolean;
        isActive?: boolean;
        networkStatus?:
          | "connected"
          | "disconnected"
          | "disconnecting"
          | "connecting";
        operationalState?:
          | "na"
          | "partially_disabled"
          | "auto_fully_disabled"
          | "fully_disabled"
          | "auto_partially_disabled"
          | "disabled_error"
          | "db_corruption";
        operator?: "<" | "<=" | ">" | ">=" | "==";
      }
    | {
        connectionId: string;
        operator: "<" | "<=" | ">" | ">=" | "==";
        score: number;
      };
  /** Body param: The conditions that the client must match to run the rule. */
  match?: {
    platform?: "windows" | "mac" | "linux" | "android" | "ios" | "chromeos";
  }[];
  /** Body param: Polling frequency for the WARP client posture check. Default: `5m` (poll every five minutes). Minimum: `1m`. */
  schedule?: string;
}

export const CreateDevicePostureRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  type: Schema.Literal(
    "file",
    "application",
    "tanium",
    "gateway",
    "warp",
    "disk_encryption",
    "serial_number",
    "sentinelone",
    "carbonblack",
    "firewall",
    "os_version",
    "domain_joined",
    "client_certificate",
    "client_certificate_v2",
    "unique_client_id",
    "kolide",
    "tanium_s2s",
    "crowdstrike_s2s",
    "intune",
    "workspace_one",
    "sentinelone_s2s",
    "custom_s2s",
  ),
  description: Schema.optional(Schema.String),
  expiration: Schema.optional(Schema.String),
  input: Schema.optional(
    Schema.Union(
      Schema.Struct({
        operatingSystem: Schema.Literal("windows", "linux", "mac").pipe(
          T.JsonName("operating_system"),
        ),
        path: Schema.String,
        exists: Schema.optional(Schema.Boolean),
        sha256: Schema.optional(Schema.String),
        thumbprint: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        id: Schema.String,
        operatingSystem: Schema.Literal("android", "ios", "chromeos").pipe(
          T.JsonName("operating_system"),
        ),
      }),
      Schema.Struct({
        operatingSystem: Schema.Literal("windows").pipe(
          T.JsonName("operating_system"),
        ),
        domain: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        operatingSystem: Schema.Literal("windows").pipe(
          T.JsonName("operating_system"),
        ),
        operator: Schema.Literal("<", "<=", ">", ">=", "=="),
        version: Schema.String,
        osDistroName: Schema.optional(Schema.String).pipe(
          T.JsonName("os_distro_name"),
        ),
        osDistroRevision: Schema.optional(Schema.String).pipe(
          T.JsonName("os_distro_revision"),
        ),
        osVersionExtra: Schema.optional(Schema.String).pipe(
          T.JsonName("os_version_extra"),
        ),
      }),
      Schema.Struct({
        enabled: Schema.Boolean,
        operatingSystem: Schema.Literal("windows", "mac").pipe(
          T.JsonName("operating_system"),
        ),
      }),
      Schema.Struct({
        operatingSystem: Schema.Literal("windows", "linux", "mac").pipe(
          T.JsonName("operating_system"),
        ),
        path: Schema.String,
        sha256: Schema.optional(Schema.String),
        thumbprint: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        id: Schema.String,
      }),
      Schema.Struct({
        checkDisks: Schema.optional(Schema.Array(Schema.String)),
        requireAll: Schema.optional(Schema.Boolean),
      }),
      Schema.Struct({
        certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
        cn: Schema.String,
      }),
      Schema.Struct({
        certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
        checkPrivateKey: Schema.Boolean.pipe(T.JsonName("check_private_key")),
        operatingSystem: Schema.Literal("windows", "linux", "mac").pipe(
          T.JsonName("operating_system"),
        ),
        cn: Schema.optional(Schema.String),
        extendedKeyUsage: Schema.optional(
          Schema.Array(Schema.Literal("clientAuth", "emailProtection")),
        ).pipe(T.JsonName("extended_key_usage")),
        locations: Schema.optional(
          Schema.Struct({
            paths: Schema.optional(Schema.Array(Schema.String)),
            trustStores: Schema.optional(
              Schema.Array(Schema.Literal("system", "user")),
            ).pipe(T.JsonName("trust_stores")),
          }),
        ),
        subjectAlternativeNames: Schema.optional(
          Schema.Array(Schema.String),
        ).pipe(T.JsonName("subject_alternative_names")),
      }),
      Schema.Struct({
        complianceStatus: Schema.Literal(
          "compliant",
          "noncompliant",
          "unknown",
        ).pipe(T.JsonName("compliance_status")),
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
      }),
      Schema.Struct({
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
        lastSeen: Schema.optional(Schema.String).pipe(T.JsonName("last_seen")),
        operator: Schema.optional(Schema.Literal("<", "<=", ">", ">=", "==")),
        os: Schema.optional(Schema.String),
        overall: Schema.optional(Schema.String),
        sensorConfig: Schema.optional(Schema.String).pipe(
          T.JsonName("sensor_config"),
        ),
        state: Schema.optional(Schema.Literal("online", "offline", "unknown")),
        version: Schema.optional(Schema.String),
        versionOperator: Schema.optional(
          Schema.Literal("<", "<=", ">", ">=", "=="),
        ),
      }),
      Schema.Struct({
        complianceStatus: Schema.Literal(
          "compliant",
          "noncompliant",
          "unknown",
          "notapplicable",
          "ingraceperiod",
          "error",
        ).pipe(T.JsonName("compliance_status")),
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
      }),
      Schema.Struct({
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
        countOperator: Schema.Literal("<", "<=", ">", ">=", "=="),
        issueCount: Schema.String.pipe(T.JsonName("issue_count")),
      }),
      Schema.Struct({
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
        eidLastSeen: Schema.optional(Schema.String).pipe(
          T.JsonName("eid_last_seen"),
        ),
        operator: Schema.optional(Schema.Literal("<", "<=", ">", ">=", "==")),
        riskLevel: Schema.optional(
          Schema.Literal("low", "medium", "high", "critical"),
        ).pipe(T.JsonName("risk_level")),
        scoreOperator: Schema.optional(
          Schema.Literal("<", "<=", ">", ">=", "=="),
        ),
        totalScore: Schema.optional(Schema.Number).pipe(
          T.JsonName("total_score"),
        ),
      }),
      Schema.Struct({
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
        activeThreats: Schema.optional(Schema.Number).pipe(
          T.JsonName("active_threats"),
        ),
        infected: Schema.optional(Schema.Boolean),
        isActive: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_active")),
        networkStatus: Schema.optional(
          Schema.Literal(
            "connected",
            "disconnected",
            "disconnecting",
            "connecting",
          ),
        ).pipe(T.JsonName("network_status")),
        operationalState: Schema.optional(
          Schema.Literal(
            "na",
            "partially_disabled",
            "auto_fully_disabled",
            "fully_disabled",
            "auto_partially_disabled",
            "disabled_error",
            "db_corruption",
          ),
        ).pipe(T.JsonName("operational_state")),
        operator: Schema.optional(Schema.Literal("<", "<=", ">", ">=", "==")),
      }),
      Schema.Struct({
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
        operator: Schema.Literal("<", "<=", ">", ">=", "=="),
        score: Schema.Number,
      }),
    ),
  ),
  match: Schema.optional(
    Schema.Array(
      Schema.Struct({
        platform: Schema.optional(
          Schema.Literal(
            "windows",
            "mac",
            "linux",
            "android",
            "ios",
            "chromeos",
          ),
        ),
      }),
    ),
  ),
  schedule: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/devices/posture" }),
) as unknown as Schema.Schema<CreateDevicePostureRequest>;

export type CreateDevicePostureResponse = unknown;

export const CreateDevicePostureResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateDevicePostureResponse>;

export const createDevicePosture: (
  input: CreateDevicePostureRequest,
) => Effect.Effect<
  CreateDevicePostureResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDevicePostureRequest,
  output: CreateDevicePostureResponse,
  errors: [],
}));

export interface UpdateDevicePostureRequest {
  ruleId: string;
  /** Path param: */
  accountId: string;
  /** Body param: The name of the device posture rule. */
  name: string;
  /** Body param: The type of device posture rule. */
  type:
    | "file"
    | "application"
    | "tanium"
    | "gateway"
    | "warp"
    | "disk_encryption"
    | "serial_number"
    | "sentinelone"
    | "carbonblack"
    | "firewall"
    | "os_version"
    | "domain_joined"
    | "client_certificate"
    | "client_certificate_v2"
    | "unique_client_id"
    | "kolide"
    | "tanium_s2s"
    | "crowdstrike_s2s"
    | "intune"
    | "workspace_one"
    | "sentinelone_s2s"
    | "custom_s2s";
  /** Body param: The description of the device posture rule. */
  description?: string;
  /** Body param: Sets the expiration time for a posture check result. If empty, the result remains valid until it is overwritten by new data from the WARP client. */
  expiration?: string;
  /** Body param: The value to be checked against. */
  input?:
    | {
        operatingSystem: "windows" | "linux" | "mac";
        path: string;
        exists?: boolean;
        sha256?: string;
        thumbprint?: string;
      }
    | { id: string; operatingSystem: "android" | "ios" | "chromeos" }
    | { operatingSystem: "windows"; domain?: string }
    | {
        operatingSystem: "windows";
        operator: "<" | "<=" | ">" | ">=" | "==";
        version: string;
        osDistroName?: string;
        osDistroRevision?: string;
        osVersionExtra?: string;
      }
    | { enabled: boolean; operatingSystem: "windows" | "mac" }
    | {
        operatingSystem: "windows" | "linux" | "mac";
        path: string;
        sha256?: string;
        thumbprint?: string;
      }
    | { id: string }
    | { checkDisks?: string[]; requireAll?: boolean }
    | { certificateId: string; cn: string }
    | {
        certificateId: string;
        checkPrivateKey: boolean;
        operatingSystem: "windows" | "linux" | "mac";
        cn?: string;
        extendedKeyUsage?: ("clientAuth" | "emailProtection")[];
        locations?: { paths?: string[]; trustStores?: ("system" | "user")[] };
        subjectAlternativeNames?: string[];
      }
    | {
        complianceStatus: "compliant" | "noncompliant" | "unknown";
        connectionId: string;
      }
    | {
        connectionId: string;
        lastSeen?: string;
        operator?: "<" | "<=" | ">" | ">=" | "==";
        os?: string;
        overall?: string;
        sensorConfig?: string;
        state?: "online" | "offline" | "unknown";
        version?: string;
        versionOperator?: "<" | "<=" | ">" | ">=" | "==";
      }
    | {
        complianceStatus:
          | "compliant"
          | "noncompliant"
          | "unknown"
          | "notapplicable"
          | "ingraceperiod"
          | "error";
        connectionId: string;
      }
    | {
        connectionId: string;
        countOperator: "<" | "<=" | ">" | ">=" | "==";
        issueCount: string;
      }
    | {
        connectionId: string;
        eidLastSeen?: string;
        operator?: "<" | "<=" | ">" | ">=" | "==";
        riskLevel?: "low" | "medium" | "high" | "critical";
        scoreOperator?: "<" | "<=" | ">" | ">=" | "==";
        totalScore?: number;
      }
    | {
        connectionId: string;
        activeThreats?: number;
        infected?: boolean;
        isActive?: boolean;
        networkStatus?:
          | "connected"
          | "disconnected"
          | "disconnecting"
          | "connecting";
        operationalState?:
          | "na"
          | "partially_disabled"
          | "auto_fully_disabled"
          | "fully_disabled"
          | "auto_partially_disabled"
          | "disabled_error"
          | "db_corruption";
        operator?: "<" | "<=" | ">" | ">=" | "==";
      }
    | {
        connectionId: string;
        operator: "<" | "<=" | ">" | ">=" | "==";
        score: number;
      };
  /** Body param: The conditions that the client must match to run the rule. */
  match?: {
    platform?: "windows" | "mac" | "linux" | "android" | "ios" | "chromeos";
  }[];
  /** Body param: Polling frequency for the WARP client posture check. Default: `5m` (poll every five minutes). Minimum: `1m`. */
  schedule?: string;
}

export const UpdateDevicePostureRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  type: Schema.Literal(
    "file",
    "application",
    "tanium",
    "gateway",
    "warp",
    "disk_encryption",
    "serial_number",
    "sentinelone",
    "carbonblack",
    "firewall",
    "os_version",
    "domain_joined",
    "client_certificate",
    "client_certificate_v2",
    "unique_client_id",
    "kolide",
    "tanium_s2s",
    "crowdstrike_s2s",
    "intune",
    "workspace_one",
    "sentinelone_s2s",
    "custom_s2s",
  ),
  description: Schema.optional(Schema.String),
  expiration: Schema.optional(Schema.String),
  input: Schema.optional(
    Schema.Union(
      Schema.Struct({
        operatingSystem: Schema.Literal("windows", "linux", "mac").pipe(
          T.JsonName("operating_system"),
        ),
        path: Schema.String,
        exists: Schema.optional(Schema.Boolean),
        sha256: Schema.optional(Schema.String),
        thumbprint: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        id: Schema.String,
        operatingSystem: Schema.Literal("android", "ios", "chromeos").pipe(
          T.JsonName("operating_system"),
        ),
      }),
      Schema.Struct({
        operatingSystem: Schema.Literal("windows").pipe(
          T.JsonName("operating_system"),
        ),
        domain: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        operatingSystem: Schema.Literal("windows").pipe(
          T.JsonName("operating_system"),
        ),
        operator: Schema.Literal("<", "<=", ">", ">=", "=="),
        version: Schema.String,
        osDistroName: Schema.optional(Schema.String).pipe(
          T.JsonName("os_distro_name"),
        ),
        osDistroRevision: Schema.optional(Schema.String).pipe(
          T.JsonName("os_distro_revision"),
        ),
        osVersionExtra: Schema.optional(Schema.String).pipe(
          T.JsonName("os_version_extra"),
        ),
      }),
      Schema.Struct({
        enabled: Schema.Boolean,
        operatingSystem: Schema.Literal("windows", "mac").pipe(
          T.JsonName("operating_system"),
        ),
      }),
      Schema.Struct({
        operatingSystem: Schema.Literal("windows", "linux", "mac").pipe(
          T.JsonName("operating_system"),
        ),
        path: Schema.String,
        sha256: Schema.optional(Schema.String),
        thumbprint: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        id: Schema.String,
      }),
      Schema.Struct({
        checkDisks: Schema.optional(Schema.Array(Schema.String)),
        requireAll: Schema.optional(Schema.Boolean),
      }),
      Schema.Struct({
        certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
        cn: Schema.String,
      }),
      Schema.Struct({
        certificateId: Schema.String.pipe(T.JsonName("certificate_id")),
        checkPrivateKey: Schema.Boolean.pipe(T.JsonName("check_private_key")),
        operatingSystem: Schema.Literal("windows", "linux", "mac").pipe(
          T.JsonName("operating_system"),
        ),
        cn: Schema.optional(Schema.String),
        extendedKeyUsage: Schema.optional(
          Schema.Array(Schema.Literal("clientAuth", "emailProtection")),
        ).pipe(T.JsonName("extended_key_usage")),
        locations: Schema.optional(
          Schema.Struct({
            paths: Schema.optional(Schema.Array(Schema.String)),
            trustStores: Schema.optional(
              Schema.Array(Schema.Literal("system", "user")),
            ).pipe(T.JsonName("trust_stores")),
          }),
        ),
        subjectAlternativeNames: Schema.optional(
          Schema.Array(Schema.String),
        ).pipe(T.JsonName("subject_alternative_names")),
      }),
      Schema.Struct({
        complianceStatus: Schema.Literal(
          "compliant",
          "noncompliant",
          "unknown",
        ).pipe(T.JsonName("compliance_status")),
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
      }),
      Schema.Struct({
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
        lastSeen: Schema.optional(Schema.String).pipe(T.JsonName("last_seen")),
        operator: Schema.optional(Schema.Literal("<", "<=", ">", ">=", "==")),
        os: Schema.optional(Schema.String),
        overall: Schema.optional(Schema.String),
        sensorConfig: Schema.optional(Schema.String).pipe(
          T.JsonName("sensor_config"),
        ),
        state: Schema.optional(Schema.Literal("online", "offline", "unknown")),
        version: Schema.optional(Schema.String),
        versionOperator: Schema.optional(
          Schema.Literal("<", "<=", ">", ">=", "=="),
        ),
      }),
      Schema.Struct({
        complianceStatus: Schema.Literal(
          "compliant",
          "noncompliant",
          "unknown",
          "notapplicable",
          "ingraceperiod",
          "error",
        ).pipe(T.JsonName("compliance_status")),
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
      }),
      Schema.Struct({
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
        countOperator: Schema.Literal("<", "<=", ">", ">=", "=="),
        issueCount: Schema.String.pipe(T.JsonName("issue_count")),
      }),
      Schema.Struct({
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
        eidLastSeen: Schema.optional(Schema.String).pipe(
          T.JsonName("eid_last_seen"),
        ),
        operator: Schema.optional(Schema.Literal("<", "<=", ">", ">=", "==")),
        riskLevel: Schema.optional(
          Schema.Literal("low", "medium", "high", "critical"),
        ).pipe(T.JsonName("risk_level")),
        scoreOperator: Schema.optional(
          Schema.Literal("<", "<=", ">", ">=", "=="),
        ),
        totalScore: Schema.optional(Schema.Number).pipe(
          T.JsonName("total_score"),
        ),
      }),
      Schema.Struct({
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
        activeThreats: Schema.optional(Schema.Number).pipe(
          T.JsonName("active_threats"),
        ),
        infected: Schema.optional(Schema.Boolean),
        isActive: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_active")),
        networkStatus: Schema.optional(
          Schema.Literal(
            "connected",
            "disconnected",
            "disconnecting",
            "connecting",
          ),
        ).pipe(T.JsonName("network_status")),
        operationalState: Schema.optional(
          Schema.Literal(
            "na",
            "partially_disabled",
            "auto_fully_disabled",
            "fully_disabled",
            "auto_partially_disabled",
            "disabled_error",
            "db_corruption",
          ),
        ).pipe(T.JsonName("operational_state")),
        operator: Schema.optional(Schema.Literal("<", "<=", ">", ">=", "==")),
      }),
      Schema.Struct({
        connectionId: Schema.String.pipe(T.JsonName("connection_id")),
        operator: Schema.Literal("<", "<=", ">", ">=", "=="),
        score: Schema.Number,
      }),
    ),
  ),
  match: Schema.optional(
    Schema.Array(
      Schema.Struct({
        platform: Schema.optional(
          Schema.Literal(
            "windows",
            "mac",
            "linux",
            "android",
            "ios",
            "chromeos",
          ),
        ),
      }),
    ),
  ),
  schedule: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/devices/posture/{ruleId}",
  }),
) as unknown as Schema.Schema<UpdateDevicePostureRequest>;

export type UpdateDevicePostureResponse = unknown;

export const UpdateDevicePostureResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateDevicePostureResponse>;

export const updateDevicePosture: (
  input: UpdateDevicePostureRequest,
) => Effect.Effect<
  UpdateDevicePostureResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDevicePostureRequest,
  output: UpdateDevicePostureResponse,
  errors: [],
}));

export interface DeleteDevicePostureRequest {
  ruleId: string;
  accountId: string;
}

export const DeleteDevicePostureRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/devices/posture/{ruleId}",
  }),
) as unknown as Schema.Schema<DeleteDevicePostureRequest>;

export type DeleteDevicePostureResponse = unknown;

export const DeleteDevicePostureResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDevicePostureResponse>;

export const deleteDevicePosture: (
  input: DeleteDevicePostureRequest,
) => Effect.Effect<
  DeleteDevicePostureResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDevicePostureRequest,
  output: DeleteDevicePostureResponse,
  errors: [],
}));

// =============================================================================
// DevicePostureIntegration
// =============================================================================

export interface GetDevicePostureIntegrationRequest {
  integrationId: string;
  accountId: string;
}

export const GetDevicePostureIntegrationRequest = Schema.Struct({
  integrationId: Schema.String.pipe(T.HttpPath("integrationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/devices/posture/integration/{integrationId}",
  }),
) as unknown as Schema.Schema<GetDevicePostureIntegrationRequest>;

export type GetDevicePostureIntegrationResponse = unknown;

export const GetDevicePostureIntegrationResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDevicePostureIntegrationResponse>;

export const getDevicePostureIntegration: (
  input: GetDevicePostureIntegrationRequest,
) => Effect.Effect<
  GetDevicePostureIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDevicePostureIntegrationRequest,
  output: GetDevicePostureIntegrationResponse,
  errors: [],
}));

export interface CreateDevicePostureIntegrationRequest {
  /** Path param: */
  accountId: string;
  /** Body param: The configuration object containing third-party integration information. */
  config:
    | {
        apiUrl: string;
        authUrl: string;
        clientId: string;
        clientSecret: string;
      }
    | {
        apiUrl: string;
        clientId: string;
        clientSecret: string;
        customerId: string;
      }
    | {
        apiUrl: string;
        clientKey: string;
        clientSecret: string;
        customerId: string;
      }
    | { clientId: string; clientSecret: string; customerId: string }
    | { clientId: string; clientSecret: string }
    | {
        apiUrl: string;
        clientSecret: string;
        accessClientId?: string;
        accessClientSecret?: string;
      }
    | { apiUrl: string; clientSecret: string }
    | { accessClientId: string; accessClientSecret: string; apiUrl: string };
  /** Body param: The interval between each posture check with the third-party API. Use `m` for minutes (e.g. `5m`) and `h` for hours (e.g. `12h`). */
  interval: string;
  /** Body param: The name of the device posture integration. */
  name: string;
  /** Body param: The type of device posture integration. */
  type:
    | "workspace_one"
    | "crowdstrike_s2s"
    | "uptycs"
    | "intune"
    | "kolide"
    | "tanium_s2s"
    | "sentinelone_s2s"
    | "custom_s2s";
}

export const CreateDevicePostureIntegrationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  config: Schema.Union(
    Schema.Struct({
      apiUrl: Schema.String.pipe(T.JsonName("api_url")),
      authUrl: Schema.String.pipe(T.JsonName("auth_url")),
      clientId: Schema.String.pipe(T.JsonName("client_id")),
      clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
    }),
    Schema.Struct({
      apiUrl: Schema.String.pipe(T.JsonName("api_url")),
      clientId: Schema.String.pipe(T.JsonName("client_id")),
      clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
      customerId: Schema.String.pipe(T.JsonName("customer_id")),
    }),
    Schema.Struct({
      apiUrl: Schema.String.pipe(T.JsonName("api_url")),
      clientKey: Schema.String.pipe(T.JsonName("client_key")),
      clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
      customerId: Schema.String.pipe(T.JsonName("customer_id")),
    }),
    Schema.Struct({
      clientId: Schema.String.pipe(T.JsonName("client_id")),
      clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
      customerId: Schema.String.pipe(T.JsonName("customer_id")),
    }),
    Schema.Struct({
      clientId: Schema.String.pipe(T.JsonName("client_id")),
      clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
    }),
    Schema.Struct({
      apiUrl: Schema.String.pipe(T.JsonName("api_url")),
      clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
      accessClientId: Schema.optional(Schema.String).pipe(
        T.JsonName("access_client_id"),
      ),
      accessClientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("access_client_secret"),
      ),
    }),
    Schema.Struct({
      apiUrl: Schema.String.pipe(T.JsonName("api_url")),
      clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
    }),
    Schema.Struct({
      accessClientId: Schema.String.pipe(T.JsonName("access_client_id")),
      accessClientSecret: Schema.String.pipe(
        T.JsonName("access_client_secret"),
      ),
      apiUrl: Schema.String.pipe(T.JsonName("api_url")),
    }),
  ),
  interval: Schema.String,
  name: Schema.String,
  type: Schema.Literal(
    "workspace_one",
    "crowdstrike_s2s",
    "uptycs",
    "intune",
    "kolide",
    "tanium_s2s",
    "sentinelone_s2s",
    "custom_s2s",
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/devices/posture/integration",
  }),
) as unknown as Schema.Schema<CreateDevicePostureIntegrationRequest>;

export type CreateDevicePostureIntegrationResponse = unknown;

export const CreateDevicePostureIntegrationResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateDevicePostureIntegrationResponse>;

export const createDevicePostureIntegration: (
  input: CreateDevicePostureIntegrationRequest,
) => Effect.Effect<
  CreateDevicePostureIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDevicePostureIntegrationRequest,
  output: CreateDevicePostureIntegrationResponse,
  errors: [],
}));

export interface PatchDevicePostureIntegrationRequest {
  integrationId: string;
  /** Path param: */
  accountId: string;
  /** Body param: The configuration object containing third-party integration information. */
  config?:
    | {
        apiUrl: string;
        authUrl: string;
        clientId: string;
        clientSecret: string;
      }
    | {
        apiUrl: string;
        clientId: string;
        clientSecret: string;
        customerId: string;
      }
    | {
        apiUrl: string;
        clientKey: string;
        clientSecret: string;
        customerId: string;
      }
    | { clientId: string; clientSecret: string; customerId: string }
    | { clientId: string; clientSecret: string }
    | {
        apiUrl: string;
        clientSecret: string;
        accessClientId?: string;
        accessClientSecret?: string;
      }
    | { apiUrl: string; clientSecret: string }
    | { accessClientId: string; accessClientSecret: string; apiUrl: string };
  /** Body param: The interval between each posture check with the third-party API. Use `m` for minutes (e.g. `5m`) and `h` for hours (e.g. `12h`). */
  interval?: string;
  /** Body param: The name of the device posture integration. */
  name?: string;
  /** Body param: The type of device posture integration. */
  type?:
    | "workspace_one"
    | "crowdstrike_s2s"
    | "uptycs"
    | "intune"
    | "kolide"
    | "tanium_s2s"
    | "sentinelone_s2s"
    | "custom_s2s";
}

export const PatchDevicePostureIntegrationRequest = Schema.Struct({
  integrationId: Schema.String.pipe(T.HttpPath("integrationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  config: Schema.optional(
    Schema.Union(
      Schema.Struct({
        apiUrl: Schema.String.pipe(T.JsonName("api_url")),
        authUrl: Schema.String.pipe(T.JsonName("auth_url")),
        clientId: Schema.String.pipe(T.JsonName("client_id")),
        clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
      }),
      Schema.Struct({
        apiUrl: Schema.String.pipe(T.JsonName("api_url")),
        clientId: Schema.String.pipe(T.JsonName("client_id")),
        clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
        customerId: Schema.String.pipe(T.JsonName("customer_id")),
      }),
      Schema.Struct({
        apiUrl: Schema.String.pipe(T.JsonName("api_url")),
        clientKey: Schema.String.pipe(T.JsonName("client_key")),
        clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
        customerId: Schema.String.pipe(T.JsonName("customer_id")),
      }),
      Schema.Struct({
        clientId: Schema.String.pipe(T.JsonName("client_id")),
        clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
        customerId: Schema.String.pipe(T.JsonName("customer_id")),
      }),
      Schema.Struct({
        clientId: Schema.String.pipe(T.JsonName("client_id")),
        clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
      }),
      Schema.Struct({
        apiUrl: Schema.String.pipe(T.JsonName("api_url")),
        clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
        accessClientId: Schema.optional(Schema.String).pipe(
          T.JsonName("access_client_id"),
        ),
        accessClientSecret: Schema.optional(Schema.String).pipe(
          T.JsonName("access_client_secret"),
        ),
      }),
      Schema.Struct({
        apiUrl: Schema.String.pipe(T.JsonName("api_url")),
        clientSecret: Schema.String.pipe(T.JsonName("client_secret")),
      }),
      Schema.Struct({
        accessClientId: Schema.String.pipe(T.JsonName("access_client_id")),
        accessClientSecret: Schema.String.pipe(
          T.JsonName("access_client_secret"),
        ),
        apiUrl: Schema.String.pipe(T.JsonName("api_url")),
      }),
    ),
  ),
  interval: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  type: Schema.optional(
    Schema.Literal(
      "workspace_one",
      "crowdstrike_s2s",
      "uptycs",
      "intune",
      "kolide",
      "tanium_s2s",
      "sentinelone_s2s",
      "custom_s2s",
    ),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/devices/posture/integration/{integrationId}",
  }),
) as unknown as Schema.Schema<PatchDevicePostureIntegrationRequest>;

export type PatchDevicePostureIntegrationResponse = unknown;

export const PatchDevicePostureIntegrationResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchDevicePostureIntegrationResponse>;

export const patchDevicePostureIntegration: (
  input: PatchDevicePostureIntegrationRequest,
) => Effect.Effect<
  PatchDevicePostureIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchDevicePostureIntegrationRequest,
  output: PatchDevicePostureIntegrationResponse,
  errors: [],
}));

export interface DeleteDevicePostureIntegrationRequest {
  integrationId: string;
  accountId: string;
}

export const DeleteDevicePostureIntegrationRequest = Schema.Struct({
  integrationId: Schema.String.pipe(T.HttpPath("integrationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/devices/posture/integration/{integrationId}",
  }),
) as unknown as Schema.Schema<DeleteDevicePostureIntegrationRequest>;

export type DeleteDevicePostureIntegrationResponse = unknown;

export const DeleteDevicePostureIntegrationResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDevicePostureIntegrationResponse>;

export const deleteDevicePostureIntegration: (
  input: DeleteDevicePostureIntegrationRequest,
) => Effect.Effect<
  DeleteDevicePostureIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDevicePostureIntegrationRequest,
  output: DeleteDevicePostureIntegrationResponse,
  errors: [],
}));

// =============================================================================
// DeviceRegistration
// =============================================================================

export interface GetDeviceRegistrationRequest {
  registrationId: string;
  /** Path param: */
  accountId: string;
  /** Query param: Comma-separated list of additional information that should be included in the registration response. Supported values are: "policy". */
  include?: string;
}

export const GetDeviceRegistrationRequest = Schema.Struct({
  registrationId: Schema.String.pipe(T.HttpPath("registrationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  include: Schema.optional(Schema.String).pipe(T.HttpQuery("include")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/devices/registrations/{registrationId}",
  }),
) as unknown as Schema.Schema<GetDeviceRegistrationRequest>;

export interface GetDeviceRegistrationResponse {
  /** The ID of the registration. */
  id: string;
  /** The RFC3339 timestamp when the registration was created. */
  createdAt: string;
  /** Device details embedded inside of a registration. */
  device: { id: string; name: string; clientVersion?: string };
  /** The public key used to connect to the Cloudflare network. */
  key: string;
  /** The RFC3339 timestamp when the registration was last seen. */
  lastSeenAt: string;
  /** The RFC3339 timestamp when the registration was last updated. */
  updatedAt: string;
  /** The RFC3339 timestamp when the registration was deleted. */
  deletedAt?: string | null;
  /** The type of encryption key used by the WARP client for the active key. Currently 'curve25519' for WireGuard and 'secp256r1' for MASQUE. */
  keyType?: string | null;
  /** The device settings profile assigned to this registration. */
  policy?: {
    id: string;
    default: boolean;
    deleted: boolean;
    name: string;
    updatedAt: string;
  };
  /** The RFC3339 timestamp when the registration was revoked. */
  revokedAt?: string | null;
  /** Type of the tunnel - wireguard or masque. */
  tunnelType?: string | null;
  user?: { id?: string; email?: string; name?: string };
}

export const GetDeviceRegistrationResponse = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  device: Schema.Struct({
    id: Schema.String,
    name: Schema.String,
    clientVersion: Schema.optional(Schema.String).pipe(
      T.JsonName("client_version"),
    ),
  }),
  key: Schema.String,
  lastSeenAt: Schema.String.pipe(T.JsonName("last_seen_at")),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  deletedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("deleted_at"),
  ),
  keyType: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("key_type"),
  ),
  policy: Schema.optional(
    Schema.Struct({
      id: Schema.String,
      default: Schema.Boolean,
      deleted: Schema.Boolean,
      name: Schema.String,
      updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    }),
  ),
  revokedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("revoked_at"),
  ),
  tunnelType: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("tunnel_type"),
  ),
  user: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      email: Schema.optional(Schema.String),
      name: Schema.optional(Schema.String),
    }),
  ),
}) as unknown as Schema.Schema<GetDeviceRegistrationResponse>;

export const getDeviceRegistration: (
  input: GetDeviceRegistrationRequest,
) => Effect.Effect<
  GetDeviceRegistrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDeviceRegistrationRequest,
  output: GetDeviceRegistrationResponse,
  errors: [],
}));

export interface DeleteDeviceRegistrationRequest {
  registrationId: string;
  accountId: string;
}

export const DeleteDeviceRegistrationRequest = Schema.Struct({
  registrationId: Schema.String.pipe(T.HttpPath("registrationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/devices/registrations/{registrationId}",
  }),
) as unknown as Schema.Schema<DeleteDeviceRegistrationRequest>;

export type DeleteDeviceRegistrationResponse = unknown;

export const DeleteDeviceRegistrationResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDeviceRegistrationResponse>;

export const deleteDeviceRegistration: (
  input: DeleteDeviceRegistrationRequest,
) => Effect.Effect<
  DeleteDeviceRegistrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDeviceRegistrationRequest,
  output: DeleteDeviceRegistrationResponse,
  errors: [],
}));

export interface BulkDeleteDeviceRegistrationsRequest {
  /** Path param: */
  accountId: string;
  /** Query param: A list of registration IDs to delete. */
  id: string[];
}

export const BulkDeleteDeviceRegistrationsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.Array(Schema.String).pipe(T.HttpQuery("id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/devices/registrations",
  }),
) as unknown as Schema.Schema<BulkDeleteDeviceRegistrationsRequest>;

export type BulkDeleteDeviceRegistrationsResponse = unknown;

export const BulkDeleteDeviceRegistrationsResponse =
  Schema.Unknown as unknown as Schema.Schema<BulkDeleteDeviceRegistrationsResponse>;

export const bulkDeleteDeviceRegistrations: (
  input: BulkDeleteDeviceRegistrationsRequest,
) => Effect.Effect<
  BulkDeleteDeviceRegistrationsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkDeleteDeviceRegistrationsRequest,
  output: BulkDeleteDeviceRegistrationsResponse,
  errors: [],
}));

export interface RevokeDeviceRegistrationRequest {
  /** Path param: */
  accountId: string;
  /** Query param: A list of registration IDs to revoke. */
  id: string[];
}

export const RevokeDeviceRegistrationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.Array(Schema.String).pipe(T.HttpQuery("id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/devices/registrations/revoke",
  }),
) as unknown as Schema.Schema<RevokeDeviceRegistrationRequest>;

export type RevokeDeviceRegistrationResponse = unknown;

export const RevokeDeviceRegistrationResponse =
  Schema.Unknown as unknown as Schema.Schema<RevokeDeviceRegistrationResponse>;

export const revokeDeviceRegistration: (
  input: RevokeDeviceRegistrationRequest,
) => Effect.Effect<
  RevokeDeviceRegistrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RevokeDeviceRegistrationRequest,
  output: RevokeDeviceRegistrationResponse,
  errors: [],
}));

export interface UnrevokeDeviceRegistrationRequest {
  /** Path param: */
  accountId: string;
  /** Query param: A list of registration IDs to unrevoke. */
  id: string[];
}

export const UnrevokeDeviceRegistrationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.Array(Schema.String).pipe(T.HttpQuery("id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/devices/registrations/unrevoke",
  }),
) as unknown as Schema.Schema<UnrevokeDeviceRegistrationRequest>;

export type UnrevokeDeviceRegistrationResponse = unknown;

export const UnrevokeDeviceRegistrationResponse =
  Schema.Unknown as unknown as Schema.Schema<UnrevokeDeviceRegistrationResponse>;

export const unrevokeDeviceRegistration: (
  input: UnrevokeDeviceRegistrationRequest,
) => Effect.Effect<
  UnrevokeDeviceRegistrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UnrevokeDeviceRegistrationRequest,
  output: UnrevokeDeviceRegistrationResponse,
  errors: [],
}));

// =============================================================================
// DeviceResilienceGlobalWarpOverride
// =============================================================================

export interface GetDeviceResilienceGlobalWarpOverrideRequest {
  accountId: string;
}

export const GetDeviceResilienceGlobalWarpOverrideRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/devices/resilience/disconnect",
  }),
) as unknown as Schema.Schema<GetDeviceResilienceGlobalWarpOverrideRequest>;

export type GetDeviceResilienceGlobalWarpOverrideResponse = unknown;

export const GetDeviceResilienceGlobalWarpOverrideResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDeviceResilienceGlobalWarpOverrideResponse>;

export const getDeviceResilienceGlobalWarpOverride: (
  input: GetDeviceResilienceGlobalWarpOverrideRequest,
) => Effect.Effect<
  GetDeviceResilienceGlobalWarpOverrideResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDeviceResilienceGlobalWarpOverrideRequest,
  output: GetDeviceResilienceGlobalWarpOverrideResponse,
  errors: [],
}));

export interface CreateDeviceResilienceGlobalWarpOverrideRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Disconnects all devices on the account using Global WARP override. */
  disconnect: boolean;
  /** Body param: Reasoning for setting the Global WARP override state. This will be surfaced in the audit log. */
  justification?: string;
}

export const CreateDeviceResilienceGlobalWarpOverrideRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  disconnect: Schema.Boolean,
  justification: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/devices/resilience/disconnect",
  }),
) as unknown as Schema.Schema<CreateDeviceResilienceGlobalWarpOverrideRequest>;

export type CreateDeviceResilienceGlobalWarpOverrideResponse = unknown;

export const CreateDeviceResilienceGlobalWarpOverrideResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateDeviceResilienceGlobalWarpOverrideResponse>;

export const createDeviceResilienceGlobalWarpOverride: (
  input: CreateDeviceResilienceGlobalWarpOverrideRequest,
) => Effect.Effect<
  CreateDeviceResilienceGlobalWarpOverrideResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDeviceResilienceGlobalWarpOverrideRequest,
  output: CreateDeviceResilienceGlobalWarpOverrideResponse,
  errors: [],
}));

// =============================================================================
// DeviceRevoke
// =============================================================================

export interface CreateDeviceRevokeRequest {
  /** Path param: */
  accountId: string;
  /** Body param: A list of Registration IDs to revoke. */
  body: string[];
}

export const CreateDeviceRevokeRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Array(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/devices/revoke" }),
) as unknown as Schema.Schema<CreateDeviceRevokeRequest>;

export type CreateDeviceRevokeResponse = unknown;

export const CreateDeviceRevokeResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateDeviceRevokeResponse>;

export const createDeviceRevoke: (
  input: CreateDeviceRevokeRequest,
) => Effect.Effect<
  CreateDeviceRevokeResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDeviceRevokeRequest,
  output: CreateDeviceRevokeResponse,
  errors: [],
}));

// =============================================================================
// DeviceSetting
// =============================================================================

export interface GetDeviceSettingRequest {
  accountId: string;
}

export const GetDeviceSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/devices/settings" }),
) as unknown as Schema.Schema<GetDeviceSettingRequest>;

export type GetDeviceSettingResponse = unknown;

export const GetDeviceSettingResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDeviceSettingResponse>;

export const getDeviceSetting: (
  input: GetDeviceSettingRequest,
) => Effect.Effect<
  GetDeviceSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDeviceSettingRequest,
  output: GetDeviceSettingResponse,
  errors: [],
}));

export interface PutDeviceSettingRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Sets the time limit, in seconds, that a user can use an override code to bypass WARP. */
  disableForTime?: number;
  /** Body param: Enable gateway proxy filtering on TCP. */
  gatewayProxyEnabled?: boolean;
  /** Body param: Enable gateway proxy filtering on UDP. */
  gatewayUdpProxyEnabled?: boolean;
  /** Body param: Enable installation of cloudflare managed root certificate. */
  rootCertificateInstallationEnabled?: boolean;
  /** Body param: Enable using CGNAT virtual IPv4. */
  useZtVirtualIp?: boolean;
}

export const PutDeviceSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  disableForTime: Schema.optional(Schema.Number).pipe(
    T.JsonName("disable_for_time"),
  ),
  gatewayProxyEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("gateway_proxy_enabled"),
  ),
  gatewayUdpProxyEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("gateway_udp_proxy_enabled"),
  ),
  rootCertificateInstallationEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("root_certificate_installation_enabled"),
  ),
  useZtVirtualIp: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("use_zt_virtual_ip"),
  ),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/devices/settings" }),
) as unknown as Schema.Schema<PutDeviceSettingRequest>;

export type PutDeviceSettingResponse = unknown;

export const PutDeviceSettingResponse =
  Schema.Unknown as unknown as Schema.Schema<PutDeviceSettingResponse>;

export const putDeviceSetting: (
  input: PutDeviceSettingRequest,
) => Effect.Effect<
  PutDeviceSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutDeviceSettingRequest,
  output: PutDeviceSettingResponse,
  errors: [],
}));

export interface PatchDeviceSettingRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Sets the time limit, in seconds, that a user can use an override code to bypass WARP. */
  disableForTime?: number;
  /** Body param: Enable gateway proxy filtering on TCP. */
  gatewayProxyEnabled?: boolean;
  /** Body param: Enable gateway proxy filtering on UDP. */
  gatewayUdpProxyEnabled?: boolean;
  /** Body param: Enable installation of cloudflare managed root certificate. */
  rootCertificateInstallationEnabled?: boolean;
  /** Body param: Enable using CGNAT virtual IPv4. */
  useZtVirtualIp?: boolean;
}

export const PatchDeviceSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  disableForTime: Schema.optional(Schema.Number).pipe(
    T.JsonName("disable_for_time"),
  ),
  gatewayProxyEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("gateway_proxy_enabled"),
  ),
  gatewayUdpProxyEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("gateway_udp_proxy_enabled"),
  ),
  rootCertificateInstallationEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("root_certificate_installation_enabled"),
  ),
  useZtVirtualIp: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("use_zt_virtual_ip"),
  ),
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/devices/settings" }),
) as unknown as Schema.Schema<PatchDeviceSettingRequest>;

export type PatchDeviceSettingResponse = unknown;

export const PatchDeviceSettingResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchDeviceSettingResponse>;

export const patchDeviceSetting: (
  input: PatchDeviceSettingRequest,
) => Effect.Effect<
  PatchDeviceSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchDeviceSettingRequest,
  output: PatchDeviceSettingResponse,
  errors: [],
}));

export interface DeleteDeviceSettingRequest {
  accountId: string;
}

export const DeleteDeviceSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/devices/settings" }),
) as unknown as Schema.Schema<DeleteDeviceSettingRequest>;

export type DeleteDeviceSettingResponse = unknown;

export const DeleteDeviceSettingResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDeviceSettingResponse>;

export const deleteDeviceSetting: (
  input: DeleteDeviceSettingRequest,
) => Effect.Effect<
  DeleteDeviceSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDeviceSettingRequest,
  output: DeleteDeviceSettingResponse,
  errors: [],
}));

// =============================================================================
// DeviceUnrevoke
// =============================================================================

export interface CreateDeviceUnrevokeRequest {
  /** Path param: */
  accountId: string;
  /** Body param: A list of Registration IDs to unrevoke. */
  body: string[];
}

export const CreateDeviceUnrevokeRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Array(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/devices/unrevoke" }),
) as unknown as Schema.Schema<CreateDeviceUnrevokeRequest>;

export type CreateDeviceUnrevokeResponse = unknown;

export const CreateDeviceUnrevokeResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateDeviceUnrevokeResponse>;

export const createDeviceUnrevoke: (
  input: CreateDeviceUnrevokeRequest,
) => Effect.Effect<
  CreateDeviceUnrevokeResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDeviceUnrevokeRequest,
  output: CreateDeviceUnrevokeResponse,
  errors: [],
}));

// =============================================================================
// DexCommand
// =============================================================================

export interface CreateDexCommandRequest {
  /** Path param: unique identifier linked to an account in the API request path */
  accountId: string;
  /** Body param: List of device-level commands to execute */
  commands: {
    commandType: "pcap" | "warp-diag";
    deviceId: string;
    userEmail: string;
    commandArgs?: {
      interfaces?: ("default" | "tunnel")[];
      maxFileSizeMb?: number;
      packetSizeBytes?: number;
      testAllRoutes?: boolean;
      timeLimitMin?: number;
    };
  }[];
}

export const CreateDexCommandRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  commands: Schema.Array(
    Schema.Struct({
      commandType: Schema.Literal("pcap", "warp-diag").pipe(
        T.JsonName("command_type"),
      ),
      deviceId: Schema.String.pipe(T.JsonName("device_id")),
      userEmail: Schema.String.pipe(T.JsonName("user_email")),
      commandArgs: Schema.optional(
        Schema.Struct({
          interfaces: Schema.optional(
            Schema.Array(Schema.Literal("default", "tunnel")),
          ),
          maxFileSizeMb: Schema.optional(Schema.Number).pipe(
            T.JsonName("'max-file-size-mb'"),
          ),
          packetSizeBytes: Schema.optional(Schema.Number).pipe(
            T.JsonName("'packet-size-bytes'"),
          ),
          testAllRoutes: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("'test-all-routes'"),
          ),
          timeLimitMin: Schema.optional(Schema.Number).pipe(
            T.JsonName("'time-limit-min'"),
          ),
        }),
      ).pipe(T.JsonName("command_args")),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/dex/commands" }),
) as unknown as Schema.Schema<CreateDexCommandRequest>;

export interface CreateDexCommandResponse {
  /** List of created commands */
  commands?: {
    id?: string;
    args?: Record<string, unknown>;
    deviceId?: string;
    status?: "PENDING_EXEC" | "PENDING_UPLOAD" | "SUCCESS" | "FAILED";
    type?: string;
  }[];
}

export const CreateDexCommandResponse = Schema.Struct({
  commands: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        args: Schema.optional(Schema.Struct({})),
        deviceId: Schema.optional(Schema.String).pipe(T.JsonName("device_id")),
        status: Schema.optional(
          Schema.Literal("PENDING_EXEC", "PENDING_UPLOAD", "SUCCESS", "FAILED"),
        ),
        type: Schema.optional(Schema.String),
      }),
    ),
  ),
}) as unknown as Schema.Schema<CreateDexCommandResponse>;

export const createDexCommand: (
  input: CreateDexCommandRequest,
) => Effect.Effect<
  CreateDexCommandResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDexCommandRequest,
  output: CreateDexCommandResponse,
  errors: [],
}));

// =============================================================================
// DexCommandDownload
// =============================================================================

export interface GetDexCommandDownloadRequest {
  commandId: string;
  filename: string;
  /** unique identifier linked to an account in the API request path */
  accountId: string;
}

export const GetDexCommandDownloadRequest = Schema.Struct({
  commandId: Schema.String.pipe(T.HttpPath("commandId")),
  filename: Schema.String.pipe(T.HttpPath("filename")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/commands/{commandId}/downloads/{filename}",
  }),
) as unknown as Schema.Schema<GetDexCommandDownloadRequest>;

export type GetDexCommandDownloadResponse = unknown;

export const GetDexCommandDownloadResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDexCommandDownloadResponse>;

export const getDexCommandDownload: (
  input: GetDexCommandDownloadRequest,
) => Effect.Effect<
  GetDexCommandDownloadResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDexCommandDownloadRequest,
  output: GetDexCommandDownloadResponse,
  errors: [],
}));

// =============================================================================
// DexCommandQuota
// =============================================================================

export interface GetDexCommandQuotaRequest {
  /** unique identifier linked to an account in the API request path */
  accountId: string;
}

export const GetDexCommandQuotaRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/dex/commands/quota" }),
) as unknown as Schema.Schema<GetDexCommandQuotaRequest>;

export interface GetDexCommandQuotaResponse {
  /** The remaining number of commands that can be initiated for an account */
  quota: number;
  /** The number of commands that have been initiated for an account */
  quotaUsage: number;
  /** The time when the quota resets */
  resetTime: string;
}

export const GetDexCommandQuotaResponse = Schema.Struct({
  quota: Schema.Number,
  quotaUsage: Schema.Number.pipe(T.JsonName("quota_usage")),
  resetTime: Schema.String.pipe(T.JsonName("reset_time")),
}) as unknown as Schema.Schema<GetDexCommandQuotaResponse>;

export const getDexCommandQuota: (
  input: GetDexCommandQuotaRequest,
) => Effect.Effect<
  GetDexCommandQuotaResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDexCommandQuotaRequest,
  output: GetDexCommandQuotaResponse,
  errors: [],
}));

// =============================================================================
// DexFleetStatus
// =============================================================================

export interface LiveDexFleetStatusRequest {
  /** Path param: Unique identifier for account */
  accountId: string;
  /** Query param: Number of minutes before current time */
  sinceMinutes: number;
}

export const LiveDexFleetStatusRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  sinceMinutes: Schema.Number.pipe(T.HttpQuery("since_minutes")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/fleet-status/live",
  }),
) as unknown as Schema.Schema<LiveDexFleetStatusRequest>;

export interface LiveDexFleetStatusResponse {
  deviceStats?: {
    byColo?: unknown[] | null;
    byMode?: unknown[] | null;
    byPlatform?: unknown[] | null;
    byStatus?: unknown[] | null;
    byVersion?: unknown[] | null;
    uniqueDevicesTotal?: number;
  };
}

export const LiveDexFleetStatusResponse = Schema.Struct({
  deviceStats: Schema.optional(
    Schema.Struct({
      byColo: Schema.optional(
        Schema.Union(Schema.Array(Schema.Unknown), Schema.Null),
      ),
      byMode: Schema.optional(
        Schema.Union(Schema.Array(Schema.Unknown), Schema.Null),
      ),
      byPlatform: Schema.optional(
        Schema.Union(Schema.Array(Schema.Unknown), Schema.Null),
      ),
      byStatus: Schema.optional(
        Schema.Union(Schema.Array(Schema.Unknown), Schema.Null),
      ),
      byVersion: Schema.optional(
        Schema.Union(Schema.Array(Schema.Unknown), Schema.Null),
      ),
      uniqueDevicesTotal: Schema.optional(Schema.Number),
    }),
  ),
}) as unknown as Schema.Schema<LiveDexFleetStatusResponse>;

export const liveDexFleetStatus: (
  input: LiveDexFleetStatusRequest,
) => Effect.Effect<
  LiveDexFleetStatusResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: LiveDexFleetStatusRequest,
  output: LiveDexFleetStatusResponse,
  errors: [],
}));

// =============================================================================
// DexHttpTest
// =============================================================================

export interface GetDexHttpTestRequest {
  testId: string;
  /** Path param: unique identifier linked to an account in the API request path. */
  accountId: string;
  /** Query param: Start time for aggregate metrics in ISO ms */
  from: string;
  /** Query param: Time interval for aggregate time slots. */
  interval: "minute" | "hour";
  /** Query param: End time for aggregate metrics in ISO ms */
  to: string;
  /** Query param: Optionally filter result stats to a Cloudflare colo. Cannot be used in combination with deviceId param. */
  colo?: string;
  /** Query param: Optionally filter result stats to a specific device(s). Cannot be used in combination with colo param. */
  deviceId?: string[];
}

export const GetDexHttpTestRequest = Schema.Struct({
  testId: Schema.String.pipe(T.HttpPath("testId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  from: Schema.String.pipe(T.HttpQuery("from")),
  interval: Schema.Literal("minute", "hour").pipe(T.HttpQuery("interval")),
  to: Schema.String.pipe(T.HttpQuery("to")),
  colo: Schema.optional(Schema.String).pipe(T.HttpQuery("colo")),
  deviceId: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("deviceId"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/http-tests/{testId}",
  }),
) as unknown as Schema.Schema<GetDexHttpTestRequest>;

export interface GetDexHttpTestResponse {
  /** The url of the HTTP synthetic application test */
  host?: string;
  httpStats?: {
    availabilityPct: {
      slots: { timestamp: string; value: number }[];
      avg?: number | null;
      max?: number | null;
      min?: number | null;
    };
    dnsResponseTimeMs: unknown;
    httpStatusCode: {
      status200: number;
      status300: number;
      status400: number;
      status500: number;
      timestamp: string;
    }[];
    resourceFetchTimeMs: unknown;
    serverResponseTimeMs: unknown;
    uniqueDevicesTotal: number;
  } | null;
  httpStatsByColo?: {
    availabilityPct: {
      slots: { timestamp: string; value: number }[];
      avg?: number | null;
      max?: number | null;
      min?: number | null;
    };
    colo: string;
    dnsResponseTimeMs: unknown;
    httpStatusCode: {
      status200: number;
      status300: number;
      status400: number;
      status500: number;
      timestamp: string;
    }[];
    resourceFetchTimeMs: unknown;
    serverResponseTimeMs: unknown;
    uniqueDevicesTotal: number;
  }[];
  /** The interval at which the HTTP synthetic application test is set to run. */
  interval?: string;
  kind?: "http";
  /** The HTTP method to use when running the test */
  method?: string;
  /** The name of the HTTP synthetic application test */
  name?: string;
  targetPolicies?: unknown[] | null;
  targeted?: boolean;
}

export const GetDexHttpTestResponse = Schema.Struct({
  host: Schema.optional(Schema.String),
  httpStats: Schema.optional(
    Schema.Union(
      Schema.Struct({
        availabilityPct: Schema.Struct({
          slots: Schema.Array(
            Schema.Struct({
              timestamp: Schema.String,
              value: Schema.Number,
            }),
          ),
          avg: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          max: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          min: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
        }),
        dnsResponseTimeMs: Schema.Unknown,
        httpStatusCode: Schema.Array(
          Schema.Struct({
            status200: Schema.Number,
            status300: Schema.Number,
            status400: Schema.Number,
            status500: Schema.Number,
            timestamp: Schema.String,
          }),
        ),
        resourceFetchTimeMs: Schema.Unknown,
        serverResponseTimeMs: Schema.Unknown,
        uniqueDevicesTotal: Schema.Number,
      }),
      Schema.Null,
    ),
  ),
  httpStatsByColo: Schema.optional(
    Schema.Array(
      Schema.Struct({
        availabilityPct: Schema.Struct({
          slots: Schema.Array(
            Schema.Struct({
              timestamp: Schema.String,
              value: Schema.Number,
            }),
          ),
          avg: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          max: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          min: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
        }),
        colo: Schema.String,
        dnsResponseTimeMs: Schema.Unknown,
        httpStatusCode: Schema.Array(
          Schema.Struct({
            status200: Schema.Number,
            status300: Schema.Number,
            status400: Schema.Number,
            status500: Schema.Number,
            timestamp: Schema.String,
          }),
        ),
        resourceFetchTimeMs: Schema.Unknown,
        serverResponseTimeMs: Schema.Unknown,
        uniqueDevicesTotal: Schema.Number,
      }),
    ),
  ),
  interval: Schema.optional(Schema.String),
  kind: Schema.optional(Schema.Literal("http")),
  method: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  targetPolicies: Schema.optional(
    Schema.Union(Schema.Array(Schema.Unknown), Schema.Null),
  ).pipe(T.JsonName("target_policies")),
  targeted: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<GetDexHttpTestResponse>;

export const getDexHttpTest: (
  input: GetDexHttpTestRequest,
) => Effect.Effect<
  GetDexHttpTestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDexHttpTestRequest,
  output: GetDexHttpTestResponse,
  errors: [],
}));

// =============================================================================
// DexHttpTestPercentile
// =============================================================================

export interface GetDexHttpTestPercentileRequest {
  testId: string;
  /** Path param: unique identifier linked to an account in the API request path. */
  accountId: string;
  /** Query param: Start time for the query in ISO (RFC3339 - ISO 8601) format */
  from: string;
  /** Query param: End time for the query in ISO (RFC3339 - ISO 8601) format */
  to: string;
  /** Query param: Optionally filter result stats to a Cloudflare colo. Cannot be used in combination with deviceId param. */
  colo?: string;
  /** Query param: Optionally filter result stats to a specific device(s). Cannot be used in combination with colo param. */
  deviceId?: string[];
}

export const GetDexHttpTestPercentileRequest = Schema.Struct({
  testId: Schema.String.pipe(T.HttpPath("testId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  from: Schema.String.pipe(T.HttpQuery("from")),
  to: Schema.String.pipe(T.HttpQuery("to")),
  colo: Schema.optional(Schema.String).pipe(T.HttpQuery("colo")),
  deviceId: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("deviceId"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/http-tests/{testId}/percentiles",
  }),
) as unknown as Schema.Schema<GetDexHttpTestPercentileRequest>;

export interface GetDexHttpTestPercentileResponse {
  dnsResponseTimeMs?: unknown;
  resourceFetchTimeMs?: unknown;
  serverResponseTimeMs?: unknown;
}

export const GetDexHttpTestPercentileResponse = Schema.Struct({
  dnsResponseTimeMs: Schema.optional(Schema.Unknown),
  resourceFetchTimeMs: Schema.optional(Schema.Unknown),
  serverResponseTimeMs: Schema.optional(Schema.Unknown),
}) as unknown as Schema.Schema<GetDexHttpTestPercentileResponse>;

export const getDexHttpTestPercentile: (
  input: GetDexHttpTestPercentileRequest,
) => Effect.Effect<
  GetDexHttpTestPercentileResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDexHttpTestPercentileRequest,
  output: GetDexHttpTestPercentileResponse,
  errors: [],
}));

// =============================================================================
// DexTestUniqueDevice
// =============================================================================

export interface ListDexTestUniqueDevicesRequest {
  /** Path param: unique identifier linked to an account in the API request path. */
  accountId: string;
  /** Query param: Optionally filter result stats to a specific device(s). Cannot be used in combination with colo param. */
  deviceId?: string[];
  /** Query param: Optionally filter results by test name */
  testName?: string;
}

export const ListDexTestUniqueDevicesRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  deviceId: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("deviceId"),
  ),
  testName: Schema.optional(Schema.String).pipe(T.HttpQuery("testName")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/tests/unique-devices",
  }),
) as unknown as Schema.Schema<ListDexTestUniqueDevicesRequest>;

export interface ListDexTestUniqueDevicesResponse {
  /** total number of unique devices */
  uniqueDevicesTotal: number;
}

export const ListDexTestUniqueDevicesResponse = Schema.Struct({
  uniqueDevicesTotal: Schema.Number,
}) as unknown as Schema.Schema<ListDexTestUniqueDevicesResponse>;

export const listDexTestUniqueDevices: (
  input: ListDexTestUniqueDevicesRequest,
) => Effect.Effect<
  ListDexTestUniqueDevicesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListDexTestUniqueDevicesRequest,
  output: ListDexTestUniqueDevicesResponse,
  errors: [],
}));

// =============================================================================
// DexTracerouteTest
// =============================================================================

export interface GetDexTracerouteTestRequest {
  testId: string;
  /** Path param: Unique identifier linked to an account */
  accountId: string;
  /** Query param: Start time for aggregate metrics in ISO ms */
  from: string;
  /** Query param: Time interval for aggregate time slots. */
  interval: "minute" | "hour";
  /** Query param: End time for aggregate metrics in ISO ms */
  to: string;
  /** Query param: Optionally filter result stats to a Cloudflare colo. Cannot be used in combination with deviceId param. */
  colo?: string;
  /** Query param: Optionally filter result stats to a specific device(s). Cannot be used in combination with colo param. */
  deviceId?: string[];
}

export const GetDexTracerouteTestRequest = Schema.Struct({
  testId: Schema.String.pipe(T.HttpPath("testId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  from: Schema.String.pipe(T.HttpQuery("from")),
  interval: Schema.Literal("minute", "hour").pipe(T.HttpQuery("interval")),
  to: Schema.String.pipe(T.HttpQuery("to")),
  colo: Schema.optional(Schema.String).pipe(T.HttpQuery("colo")),
  deviceId: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("deviceId"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/traceroute-tests/{testId}",
  }),
) as unknown as Schema.Schema<GetDexTracerouteTestRequest>;

export interface GetDexTracerouteTestResponse {
  /** The host of the Traceroute synthetic application test */
  host: string;
  /** The interval at which the Traceroute synthetic application test is set to run. */
  interval: string;
  kind: "traceroute";
  /** The name of the Traceroute synthetic application test */
  name: string;
  targetPolicies?: unknown[] | null;
  targeted?: boolean;
  tracerouteStats?: {
    availabilityPct: {
      slots: { timestamp: string; value: number }[];
      avg?: number | null;
      max?: number | null;
      min?: number | null;
    };
    hopsCount: unknown;
    packetLossPct: {
      slots: { timestamp: string; value: number }[];
      avg?: number | null;
      max?: number | null;
      min?: number | null;
    };
    roundTripTimeMs: unknown;
    uniqueDevicesTotal: number;
  } | null;
  tracerouteStatsByColo?: {
    availabilityPct: {
      slots: { timestamp: string; value: number }[];
      avg?: number | null;
      max?: number | null;
      min?: number | null;
    };
    colo: string;
    hopsCount: unknown;
    packetLossPct: {
      slots: { timestamp: string; value: number }[];
      avg?: number | null;
      max?: number | null;
      min?: number | null;
    };
    roundTripTimeMs: unknown;
    uniqueDevicesTotal: number;
  }[];
}

export const GetDexTracerouteTestResponse = Schema.Struct({
  host: Schema.String,
  interval: Schema.String,
  kind: Schema.Literal("traceroute"),
  name: Schema.String,
  targetPolicies: Schema.optional(
    Schema.Union(Schema.Array(Schema.Unknown), Schema.Null),
  ).pipe(T.JsonName("target_policies")),
  targeted: Schema.optional(Schema.Boolean),
  tracerouteStats: Schema.optional(
    Schema.Union(
      Schema.Struct({
        availabilityPct: Schema.Struct({
          slots: Schema.Array(
            Schema.Struct({
              timestamp: Schema.String,
              value: Schema.Number,
            }),
          ),
          avg: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          max: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          min: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
        }),
        hopsCount: Schema.Unknown,
        packetLossPct: Schema.Struct({
          slots: Schema.Array(
            Schema.Struct({
              timestamp: Schema.String,
              value: Schema.Number,
            }),
          ),
          avg: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          max: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          min: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
        }),
        roundTripTimeMs: Schema.Unknown,
        uniqueDevicesTotal: Schema.Number,
      }),
      Schema.Null,
    ),
  ),
  tracerouteStatsByColo: Schema.optional(
    Schema.Array(
      Schema.Struct({
        availabilityPct: Schema.Struct({
          slots: Schema.Array(
            Schema.Struct({
              timestamp: Schema.String,
              value: Schema.Number,
            }),
          ),
          avg: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          max: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          min: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
        }),
        colo: Schema.String,
        hopsCount: Schema.Unknown,
        packetLossPct: Schema.Struct({
          slots: Schema.Array(
            Schema.Struct({
              timestamp: Schema.String,
              value: Schema.Number,
            }),
          ),
          avg: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          max: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          min: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
        }),
        roundTripTimeMs: Schema.Unknown,
        uniqueDevicesTotal: Schema.Number,
      }),
    ),
  ),
}) as unknown as Schema.Schema<GetDexTracerouteTestResponse>;

export const getDexTracerouteTest: (
  input: GetDexTracerouteTestRequest,
) => Effect.Effect<
  GetDexTracerouteTestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDexTracerouteTestRequest,
  output: GetDexTracerouteTestResponse,
  errors: [],
}));

export interface PercentilesDexTracerouteTestRequest {
  testId: string;
  /** Path param: unique identifier linked to an account in the API request path. */
  accountId: string;
  /** Query param: Start time for the query in ISO (RFC3339 - ISO 8601) format */
  from: string;
  /** Query param: End time for the query in ISO (RFC3339 - ISO 8601) format */
  to: string;
  /** Query param: Optionally filter result stats to a Cloudflare colo. Cannot be used in combination with deviceId param. */
  colo?: string;
  /** Query param: Optionally filter result stats to a specific device(s). Cannot be used in combination with colo param. */
  deviceId?: string[];
}

export const PercentilesDexTracerouteTestRequest = Schema.Struct({
  testId: Schema.String.pipe(T.HttpPath("testId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  from: Schema.String.pipe(T.HttpQuery("from")),
  to: Schema.String.pipe(T.HttpQuery("to")),
  colo: Schema.optional(Schema.String).pipe(T.HttpQuery("colo")),
  deviceId: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("deviceId"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/traceroute-tests/{testId}/percentiles",
  }),
) as unknown as Schema.Schema<PercentilesDexTracerouteTestRequest>;

export interface PercentilesDexTracerouteTestResponse {
  hopsCount?: unknown;
  packetLossPct?: unknown;
  roundTripTimeMs?: unknown;
}

export const PercentilesDexTracerouteTestResponse = Schema.Struct({
  hopsCount: Schema.optional(Schema.Unknown),
  packetLossPct: Schema.optional(Schema.Unknown),
  roundTripTimeMs: Schema.optional(Schema.Unknown),
}) as unknown as Schema.Schema<PercentilesDexTracerouteTestResponse>;

export const percentilesDexTracerouteTest: (
  input: PercentilesDexTracerouteTestRequest,
) => Effect.Effect<
  PercentilesDexTracerouteTestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PercentilesDexTracerouteTestRequest,
  output: PercentilesDexTracerouteTestResponse,
  errors: [],
}));

// =============================================================================
// DexTracerouteTestResultNetworkPath
// =============================================================================

export interface GetDexTracerouteTestResultNetworkPathRequest {
  testResultId: string;
  /** unique identifier linked to an account */
  accountId: string;
}

export const GetDexTracerouteTestResultNetworkPathRequest = Schema.Struct({
  testResultId: Schema.String.pipe(T.HttpPath("testResultId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/traceroute-test-results/{testResultId}/network-path",
  }),
) as unknown as Schema.Schema<GetDexTracerouteTestResultNetworkPathRequest>;

export interface GetDexTracerouteTestResultNetworkPathResponse {
  /** an array of the hops taken by the device to reach the end destination */
  hops: {
    ttl: number;
    asn?: number | null;
    aso?: string | null;
    ipAddress?: string | null;
    location?: {
      city?: string | null;
      state?: string | null;
      zip?: string | null;
    } | null;
    mile?:
      | "client-to-app"
      | "client-to-cf-egress"
      | "client-to-cf-ingress"
      | "client-to-isp"
      | null;
    name?: string | null;
    packetLossPct?: number | null;
    rttMs?: number | null;
  }[];
  /** API Resource UUID tag. */
  resultId: string;
  /** name of the device associated with this network path response */
  deviceName?: string;
  /** API Resource UUID tag. */
  testId?: string;
  /** name of the tracroute test */
  testName?: string;
}

export const GetDexTracerouteTestResultNetworkPathResponse = Schema.Struct({
  hops: Schema.Array(
    Schema.Struct({
      ttl: Schema.Number,
      asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      aso: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      ipAddress: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      location: Schema.optional(
        Schema.Union(
          Schema.Struct({
            city: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
            state: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
            zip: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
          }),
          Schema.Null,
        ),
      ),
      mile: Schema.optional(
        Schema.Union(
          Schema.Literal("client-to-app"),
          Schema.Literal("client-to-cf-egress"),
          Schema.Literal("client-to-cf-ingress"),
          Schema.Literal("client-to-isp"),
          Schema.Null,
        ),
      ),
      name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      packetLossPct: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
      rttMs: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
    }),
  ),
  resultId: Schema.String,
  deviceName: Schema.optional(Schema.String),
  testId: Schema.optional(Schema.String),
  testName: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetDexTracerouteTestResultNetworkPathResponse>;

export const getDexTracerouteTestResultNetworkPath: (
  input: GetDexTracerouteTestResultNetworkPathRequest,
) => Effect.Effect<
  GetDexTracerouteTestResultNetworkPathResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDexTracerouteTestResultNetworkPathRequest,
  output: GetDexTracerouteTestResultNetworkPathResponse,
  errors: [],
}));

// =============================================================================
// DexWarpChangeEvent
// =============================================================================

export interface GetDexWarpChangeEventRequest {
  /** Path param: unique identifier linked to an account in the API request path */
  accountId: string;
  /** Query param: Start time for the query in ISO (RFC3339 - ISO 8601) format */
  from: string;
  /** Query param: Page number of paginated results */
  page: number;
  /** Query param: Number of items per page */
  perPage: number;
  /** Query param: End time for the query in ISO (RFC3339 - ISO 8601) format */
  to: string;
  /** Query param: Filter events by account name. */
  accountName?: string;
  /** Query param: Filter events by WARP configuration name changed from or to. Applicable to type='config' events only. */
  configName?: string;
  /** Query param: Sort response by event timestamp. */
  sortOrder?: "ASC" | "DESC";
  /** Query param: Filter events by type toggle value. Applicable to type='toggle' events only. */
  toggle?: "on" | "off";
  /** Query param: Filter events by type 'config' or 'toggle' */
  type?: "config" | "toggle";
}

export const GetDexWarpChangeEventRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  from: Schema.String.pipe(T.HttpQuery("from")),
  page: Schema.Number.pipe(T.HttpQuery("page")),
  perPage: Schema.Number.pipe(T.HttpQuery("per_page")),
  to: Schema.String.pipe(T.HttpQuery("to")),
  accountName: Schema.optional(Schema.String).pipe(T.HttpQuery("account_name")),
  configName: Schema.optional(Schema.String).pipe(T.HttpQuery("config_name")),
  sortOrder: Schema.optional(Schema.Literal("ASC", "DESC")).pipe(
    T.HttpQuery("sort_order"),
  ),
  toggle: Schema.optional(Schema.Literal("on", "off")).pipe(
    T.HttpQuery("toggle"),
  ),
  type: Schema.optional(Schema.Literal("config", "toggle")).pipe(
    T.HttpQuery("type"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/warp-change-events",
  }),
) as unknown as Schema.Schema<GetDexWarpChangeEventRequest>;

export type GetDexWarpChangeEventResponse = (
  | {
      accountName?: string;
      accountTag?: string;
      deviceId?: string;
      deviceRegistration?: string;
      hostname?: string;
      serialNumber?: string;
      timestamp?: string;
      toggle?: "on" | "off";
      userEmail?: string;
    }
  | {
      deviceId?: string;
      deviceRegistration?: string;
      from?: { accountName?: string; accountTag?: string; configName?: string };
      hostname?: string;
      serialNumber?: string;
      timestamp?: string;
      to?: { accountName?: string; accountTag?: string; configName?: string };
      userEmail?: string;
    }
)[];

export const GetDexWarpChangeEventResponse = Schema.Array(
  Schema.Union(
    Schema.Struct({
      accountName: Schema.optional(Schema.String).pipe(
        T.JsonName("account_name"),
      ),
      accountTag: Schema.optional(Schema.String).pipe(
        T.JsonName("account_tag"),
      ),
      deviceId: Schema.optional(Schema.String).pipe(T.JsonName("device_id")),
      deviceRegistration: Schema.optional(Schema.String).pipe(
        T.JsonName("device_registration"),
      ),
      hostname: Schema.optional(Schema.String),
      serialNumber: Schema.optional(Schema.String).pipe(
        T.JsonName("serial_number"),
      ),
      timestamp: Schema.optional(Schema.String),
      toggle: Schema.optional(Schema.Literal("on", "off")),
      userEmail: Schema.optional(Schema.String).pipe(T.JsonName("user_email")),
    }),
    Schema.Struct({
      deviceId: Schema.optional(Schema.String).pipe(T.JsonName("device_id")),
      deviceRegistration: Schema.optional(Schema.String).pipe(
        T.JsonName("device_registration"),
      ),
      from: Schema.optional(
        Schema.Struct({
          accountName: Schema.optional(Schema.String).pipe(
            T.JsonName("account_name"),
          ),
          accountTag: Schema.optional(Schema.String).pipe(
            T.JsonName("account_tag"),
          ),
          configName: Schema.optional(Schema.String).pipe(
            T.JsonName("config_name"),
          ),
        }),
      ),
      hostname: Schema.optional(Schema.String),
      serialNumber: Schema.optional(Schema.String).pipe(
        T.JsonName("serial_number"),
      ),
      timestamp: Schema.optional(Schema.String),
      to: Schema.optional(
        Schema.Struct({
          accountName: Schema.optional(Schema.String).pipe(
            T.JsonName("account_name"),
          ),
          accountTag: Schema.optional(Schema.String).pipe(
            T.JsonName("account_tag"),
          ),
          configName: Schema.optional(Schema.String).pipe(
            T.JsonName("config_name"),
          ),
        }),
      ),
      userEmail: Schema.optional(Schema.String).pipe(T.JsonName("user_email")),
    }),
  ),
) as unknown as Schema.Schema<GetDexWarpChangeEventResponse>;

export const getDexWarpChangeEvent: (
  input: GetDexWarpChangeEventRequest,
) => Effect.Effect<
  GetDexWarpChangeEventResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDexWarpChangeEventRequest,
  output: GetDexWarpChangeEventResponse,
  errors: [],
}));

// =============================================================================
// DlpDataset
// =============================================================================

export interface GetDlpDatasetRequest {
  datasetId: string;
  accountId: string;
}

export const GetDlpDatasetRequest = Schema.Struct({
  datasetId: Schema.String.pipe(T.HttpPath("datasetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dlp/datasets/{datasetId}",
  }),
) as unknown as Schema.Schema<GetDlpDatasetRequest>;

export interface GetDlpDatasetResponse {
  id: string;
  columns: {
    entryId: string;
    headerName: string;
    numCells: number;
    uploadStatus:
      | "empty"
      | "uploading"
      | "pending"
      | "processing"
      | "failed"
      | "complete";
  }[];
  createdAt: string;
  encodingVersion: number;
  name: string;
  numCells: number;
  secret: boolean;
  status:
    | "empty"
    | "uploading"
    | "pending"
    | "processing"
    | "failed"
    | "complete";
  /** When the dataset was last updated.  This includes name or description changes as well as uploads. */
  updatedAt: string;
  uploads: {
    numCells: number;
    status:
      | "empty"
      | "uploading"
      | "pending"
      | "processing"
      | "failed"
      | "complete";
    version: number;
  }[];
  caseSensitive?: boolean;
  /** The description of the dataset. */
  description?: string | null;
}

export const GetDlpDatasetResponse = Schema.Struct({
  id: Schema.String,
  columns: Schema.Array(
    Schema.Struct({
      entryId: Schema.String.pipe(T.JsonName("entry_id")),
      headerName: Schema.String.pipe(T.JsonName("header_name")),
      numCells: Schema.Number.pipe(T.JsonName("num_cells")),
      uploadStatus: Schema.Literal(
        "empty",
        "uploading",
        "pending",
        "processing",
        "failed",
        "complete",
      ).pipe(T.JsonName("upload_status")),
    }),
  ),
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  encodingVersion: Schema.Number.pipe(T.JsonName("encoding_version")),
  name: Schema.String,
  numCells: Schema.Number.pipe(T.JsonName("num_cells")),
  secret: Schema.Boolean,
  status: Schema.Literal(
    "empty",
    "uploading",
    "pending",
    "processing",
    "failed",
    "complete",
  ),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  uploads: Schema.Array(
    Schema.Struct({
      numCells: Schema.Number.pipe(T.JsonName("num_cells")),
      status: Schema.Literal(
        "empty",
        "uploading",
        "pending",
        "processing",
        "failed",
        "complete",
      ),
      version: Schema.Number,
    }),
  ),
  caseSensitive: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("case_sensitive"),
  ),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<GetDlpDatasetResponse>;

export const getDlpDataset: (
  input: GetDlpDatasetRequest,
) => Effect.Effect<
  GetDlpDatasetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDlpDatasetRequest,
  output: GetDlpDatasetResponse,
  errors: [],
}));

export interface CreateDlpDatasetRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  name: string;
  /** Body param: Only applies to custom word lists. Determines if the words should be matched in a case-sensitive manner Cannot be set to false if `secret` is true or undefined */
  caseSensitive?: boolean;
  /** Body param: The description of the dataset. */
  description?: string | null;
  /** Body param: Dataset encoding version  Non-secret custom word lists with no header are always version 1. Secret EDM lists with no header are version 1. Multicolumn CSV with headers are version 2. Omitt */
  encodingVersion?: number;
  /** Body param: Generate a secret dataset.  If true, the response will include a secret to use with the EDM encoder. If false, the response has no secret and the dataset is uploaded in plaintext. */
  secret?: boolean;
}

export const CreateDlpDatasetRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  caseSensitive: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("case_sensitive"),
  ),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  encodingVersion: Schema.optional(Schema.Number).pipe(
    T.JsonName("encoding_version"),
  ),
  secret: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/dlp/datasets" }),
) as unknown as Schema.Schema<CreateDlpDatasetRequest>;

export interface CreateDlpDatasetResponse {
  dataset: {
    id: string;
    columns: {
      entryId: string;
      headerName: string;
      numCells: number;
      uploadStatus:
        | "empty"
        | "uploading"
        | "pending"
        | "processing"
        | "failed"
        | "complete";
    }[];
    createdAt: string;
    encodingVersion: number;
    name: string;
    numCells: number;
    secret: boolean;
    status:
      | "empty"
      | "uploading"
      | "pending"
      | "processing"
      | "failed"
      | "complete";
    updatedAt: string;
    uploads: {
      numCells: number;
      status:
        | "empty"
        | "uploading"
        | "pending"
        | "processing"
        | "failed"
        | "complete";
      version: number;
    }[];
    caseSensitive?: boolean;
    description?: string | null;
  };
  /** Encoding version to use for dataset. */
  encodingVersion: number;
  maxCells: number;
  /** The version to use when uploading the dataset. */
  version: number;
  /** The secret to use for Exact Data Match datasets. This is not present in Custom Wordlists. */
  secret?: string;
}

export const CreateDlpDatasetResponse = Schema.Struct({
  dataset: Schema.Struct({
    id: Schema.String,
    columns: Schema.Array(
      Schema.Struct({
        entryId: Schema.String.pipe(T.JsonName("entry_id")),
        headerName: Schema.String.pipe(T.JsonName("header_name")),
        numCells: Schema.Number.pipe(T.JsonName("num_cells")),
        uploadStatus: Schema.Literal(
          "empty",
          "uploading",
          "pending",
          "processing",
          "failed",
          "complete",
        ).pipe(T.JsonName("upload_status")),
      }),
    ),
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    encodingVersion: Schema.Number.pipe(T.JsonName("encoding_version")),
    name: Schema.String,
    numCells: Schema.Number.pipe(T.JsonName("num_cells")),
    secret: Schema.Boolean,
    status: Schema.Literal(
      "empty",
      "uploading",
      "pending",
      "processing",
      "failed",
      "complete",
    ),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    uploads: Schema.Array(
      Schema.Struct({
        numCells: Schema.Number.pipe(T.JsonName("num_cells")),
        status: Schema.Literal(
          "empty",
          "uploading",
          "pending",
          "processing",
          "failed",
          "complete",
        ),
        version: Schema.Number,
      }),
    ),
    caseSensitive: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("case_sensitive"),
    ),
    description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
  encodingVersion: Schema.Number.pipe(T.JsonName("encoding_version")),
  maxCells: Schema.Number.pipe(T.JsonName("max_cells")),
  version: Schema.Number,
  secret: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateDlpDatasetResponse>;

export const createDlpDataset: (
  input: CreateDlpDatasetRequest,
) => Effect.Effect<
  CreateDlpDatasetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDlpDatasetRequest,
  output: CreateDlpDatasetResponse,
  errors: [],
}));

export interface UpdateDlpDatasetRequest {
  datasetId: string;
  /** Path param: */
  accountId: string;
  /** Body param: Determines if the words should be matched in a case-sensitive manner.  Only required for custom word lists. */
  caseSensitive?: boolean;
  /** Body param: The description of the dataset. */
  description?: string | null;
  /** Body param: The name of the dataset, must be unique. */
  name?: string | null;
}

export const UpdateDlpDatasetRequest = Schema.Struct({
  datasetId: Schema.String.pipe(T.HttpPath("datasetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  caseSensitive: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("case_sensitive"),
  ),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/dlp/datasets/{datasetId}",
  }),
) as unknown as Schema.Schema<UpdateDlpDatasetRequest>;

export interface UpdateDlpDatasetResponse {
  id: string;
  columns: {
    entryId: string;
    headerName: string;
    numCells: number;
    uploadStatus:
      | "empty"
      | "uploading"
      | "pending"
      | "processing"
      | "failed"
      | "complete";
  }[];
  createdAt: string;
  encodingVersion: number;
  name: string;
  numCells: number;
  secret: boolean;
  status:
    | "empty"
    | "uploading"
    | "pending"
    | "processing"
    | "failed"
    | "complete";
  /** When the dataset was last updated.  This includes name or description changes as well as uploads. */
  updatedAt: string;
  uploads: {
    numCells: number;
    status:
      | "empty"
      | "uploading"
      | "pending"
      | "processing"
      | "failed"
      | "complete";
    version: number;
  }[];
  caseSensitive?: boolean;
  /** The description of the dataset. */
  description?: string | null;
}

export const UpdateDlpDatasetResponse = Schema.Struct({
  id: Schema.String,
  columns: Schema.Array(
    Schema.Struct({
      entryId: Schema.String.pipe(T.JsonName("entry_id")),
      headerName: Schema.String.pipe(T.JsonName("header_name")),
      numCells: Schema.Number.pipe(T.JsonName("num_cells")),
      uploadStatus: Schema.Literal(
        "empty",
        "uploading",
        "pending",
        "processing",
        "failed",
        "complete",
      ).pipe(T.JsonName("upload_status")),
    }),
  ),
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  encodingVersion: Schema.Number.pipe(T.JsonName("encoding_version")),
  name: Schema.String,
  numCells: Schema.Number.pipe(T.JsonName("num_cells")),
  secret: Schema.Boolean,
  status: Schema.Literal(
    "empty",
    "uploading",
    "pending",
    "processing",
    "failed",
    "complete",
  ),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  uploads: Schema.Array(
    Schema.Struct({
      numCells: Schema.Number.pipe(T.JsonName("num_cells")),
      status: Schema.Literal(
        "empty",
        "uploading",
        "pending",
        "processing",
        "failed",
        "complete",
      ),
      version: Schema.Number,
    }),
  ),
  caseSensitive: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("case_sensitive"),
  ),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<UpdateDlpDatasetResponse>;

export const updateDlpDataset: (
  input: UpdateDlpDatasetRequest,
) => Effect.Effect<
  UpdateDlpDatasetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDlpDatasetRequest,
  output: UpdateDlpDatasetResponse,
  errors: [],
}));

export interface DeleteDlpDatasetRequest {
  datasetId: string;
  accountId: string;
}

export const DeleteDlpDatasetRequest = Schema.Struct({
  datasetId: Schema.String.pipe(T.HttpPath("datasetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/dlp/datasets/{datasetId}",
  }),
) as unknown as Schema.Schema<DeleteDlpDatasetRequest>;

export type DeleteDlpDatasetResponse = unknown;

export const DeleteDlpDatasetResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDlpDatasetResponse>;

export const deleteDlpDataset: (
  input: DeleteDlpDatasetRequest,
) => Effect.Effect<
  DeleteDlpDatasetResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDlpDatasetRequest,
  output: DeleteDlpDatasetResponse,
  errors: [],
}));

// =============================================================================
// DlpDatasetUpload
// =============================================================================

export interface CreateDlpDatasetUploadRequest {
  datasetId: string;
  accountId: string;
}

export const CreateDlpDatasetUploadRequest = Schema.Struct({
  datasetId: Schema.String.pipe(T.HttpPath("datasetId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/dlp/datasets/{datasetId}/upload",
  }),
) as unknown as Schema.Schema<CreateDlpDatasetUploadRequest>;

export interface CreateDlpDatasetUploadResponse {
  encodingVersion: number;
  maxCells: number;
  version: number;
  caseSensitive?: boolean;
  columns?: {
    entryId: string;
    headerName: string;
    numCells: number;
    uploadStatus:
      | "empty"
      | "uploading"
      | "pending"
      | "processing"
      | "failed"
      | "complete";
  }[];
  secret?: string;
}

export const CreateDlpDatasetUploadResponse = Schema.Struct({
  encodingVersion: Schema.Number.pipe(T.JsonName("encoding_version")),
  maxCells: Schema.Number.pipe(T.JsonName("max_cells")),
  version: Schema.Number,
  caseSensitive: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("case_sensitive"),
  ),
  columns: Schema.optional(
    Schema.Array(
      Schema.Struct({
        entryId: Schema.String.pipe(T.JsonName("entry_id")),
        headerName: Schema.String.pipe(T.JsonName("header_name")),
        numCells: Schema.Number.pipe(T.JsonName("num_cells")),
        uploadStatus: Schema.Literal(
          "empty",
          "uploading",
          "pending",
          "processing",
          "failed",
          "complete",
        ).pipe(T.JsonName("upload_status")),
      }),
    ),
  ),
  secret: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateDlpDatasetUploadResponse>;

export const createDlpDatasetUpload: (
  input: CreateDlpDatasetUploadRequest,
) => Effect.Effect<
  CreateDlpDatasetUploadResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDlpDatasetUploadRequest,
  output: CreateDlpDatasetUploadResponse,
  errors: [],
}));

export interface EditDlpDatasetUploadRequest {
  datasetId: string;
  version: number;
  /** Path param: */
  accountId: string;
}

export const EditDlpDatasetUploadRequest = Schema.Struct({
  datasetId: Schema.String.pipe(T.HttpPath("datasetId")),
  version: Schema.Number.pipe(T.HttpPath("version")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/dlp/datasets/{datasetId}/upload/{version}",
  }),
) as unknown as Schema.Schema<EditDlpDatasetUploadRequest>;

export type EditDlpDatasetUploadResponse = unknown;

export const EditDlpDatasetUploadResponse =
  Schema.Unknown as unknown as Schema.Schema<EditDlpDatasetUploadResponse>;

export const editDlpDatasetUpload: (
  input: EditDlpDatasetUploadRequest,
) => Effect.Effect<
  EditDlpDatasetUploadResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: EditDlpDatasetUploadRequest,
  output: EditDlpDatasetUploadResponse,
  errors: [],
}));

// =============================================================================
// DlpDatasetVersionEntry
// =============================================================================

export interface CreateDlpDatasetVersionEntryRequest {
  datasetId: string;
  version: number;
  entryId: string;
  /** Path param: */
  accountId: string;
}

export const CreateDlpDatasetVersionEntryRequest = Schema.Struct({
  datasetId: Schema.String.pipe(T.HttpPath("datasetId")),
  version: Schema.Number.pipe(T.HttpPath("version")),
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/dlp/datasets/{datasetId}/versions/{version}/entries/{entryId}",
  }),
) as unknown as Schema.Schema<CreateDlpDatasetVersionEntryRequest>;

export interface CreateDlpDatasetVersionEntryResponse {
  entryId: string;
  headerName: string;
  numCells: number;
  uploadStatus:
    | "empty"
    | "uploading"
    | "pending"
    | "processing"
    | "failed"
    | "complete";
}

export const CreateDlpDatasetVersionEntryResponse = Schema.Struct({
  entryId: Schema.String.pipe(T.JsonName("entry_id")),
  headerName: Schema.String.pipe(T.JsonName("header_name")),
  numCells: Schema.Number.pipe(T.JsonName("num_cells")),
  uploadStatus: Schema.Literal(
    "empty",
    "uploading",
    "pending",
    "processing",
    "failed",
    "complete",
  ).pipe(T.JsonName("upload_status")),
}) as unknown as Schema.Schema<CreateDlpDatasetVersionEntryResponse>;

export const createDlpDatasetVersionEntry: (
  input: CreateDlpDatasetVersionEntryRequest,
) => Effect.Effect<
  CreateDlpDatasetVersionEntryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDlpDatasetVersionEntryRequest,
  output: CreateDlpDatasetVersionEntryResponse,
  errors: [],
}));

// =============================================================================
// DlpEmailAccountMapping
// =============================================================================

export interface GetDlpEmailAccountMappingRequest {
  accountId: string;
}

export const GetDlpEmailAccountMappingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dlp/email/account_mapping",
  }),
) as unknown as Schema.Schema<GetDlpEmailAccountMappingRequest>;

export interface GetDlpEmailAccountMappingResponse {
  addinIdentifierToken: string;
  authRequirements:
    | { allowedMicrosoftOrganizations: string[]; type: "Org" }
    | { type: "NoAuth" };
}

export const GetDlpEmailAccountMappingResponse = Schema.Struct({
  addinIdentifierToken: Schema.String.pipe(
    T.JsonName("addin_identifier_token"),
  ),
  authRequirements: Schema.Union(
    Schema.Struct({
      allowedMicrosoftOrganizations: Schema.Array(Schema.String).pipe(
        T.JsonName("allowed_microsoft_organizations"),
      ),
      type: Schema.Literal("Org"),
    }),
    Schema.Struct({
      type: Schema.Literal("NoAuth"),
    }),
  ).pipe(T.JsonName("auth_requirements")),
}) as unknown as Schema.Schema<GetDlpEmailAccountMappingResponse>;

export const getDlpEmailAccountMapping: (
  input: GetDlpEmailAccountMappingRequest,
) => Effect.Effect<
  GetDlpEmailAccountMappingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDlpEmailAccountMappingRequest,
  output: GetDlpEmailAccountMappingResponse,
  errors: [],
}));

export interface CreateDlpEmailAccountMappingRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  authRequirements:
    | { allowedMicrosoftOrganizations: string[]; type: "Org" }
    | { type: "NoAuth" };
}

export const CreateDlpEmailAccountMappingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  authRequirements: Schema.Union(
    Schema.Struct({
      allowedMicrosoftOrganizations: Schema.Array(Schema.String).pipe(
        T.JsonName("allowed_microsoft_organizations"),
      ),
      type: Schema.Literal("Org"),
    }),
    Schema.Struct({
      type: Schema.Literal("NoAuth"),
    }),
  ).pipe(T.JsonName("auth_requirements")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/dlp/email/account_mapping",
  }),
) as unknown as Schema.Schema<CreateDlpEmailAccountMappingRequest>;

export interface CreateDlpEmailAccountMappingResponse {
  addinIdentifierToken: string;
  authRequirements:
    | { allowedMicrosoftOrganizations: string[]; type: "Org" }
    | { type: "NoAuth" };
}

export const CreateDlpEmailAccountMappingResponse = Schema.Struct({
  addinIdentifierToken: Schema.String.pipe(
    T.JsonName("addin_identifier_token"),
  ),
  authRequirements: Schema.Union(
    Schema.Struct({
      allowedMicrosoftOrganizations: Schema.Array(Schema.String).pipe(
        T.JsonName("allowed_microsoft_organizations"),
      ),
      type: Schema.Literal("Org"),
    }),
    Schema.Struct({
      type: Schema.Literal("NoAuth"),
    }),
  ).pipe(T.JsonName("auth_requirements")),
}) as unknown as Schema.Schema<CreateDlpEmailAccountMappingResponse>;

export const createDlpEmailAccountMapping: (
  input: CreateDlpEmailAccountMappingRequest,
) => Effect.Effect<
  CreateDlpEmailAccountMappingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDlpEmailAccountMappingRequest,
  output: CreateDlpEmailAccountMappingResponse,
  errors: [],
}));

// =============================================================================
// DlpEmailRule
// =============================================================================

export interface GetDlpEmailRuleRequest {
  ruleId: string;
  accountId: string;
}

export const GetDlpEmailRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dlp/email/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<GetDlpEmailRuleRequest>;

export interface GetDlpEmailRuleResponse {
  action: { action: "Block"; message?: string | null };
  /** Rule is triggered if all conditions match. */
  conditions: {
    operator: "InList" | "NotInList" | "MatchRegex" | "NotMatchRegex";
    selector: "Recipients" | "Sender" | "DLPProfiles";
    value: string[] | string;
  }[];
  createdAt: string;
  enabled: boolean;
  name: string;
  priority: number;
  ruleId: string;
  updatedAt: string;
  description?: string | null;
}

export const GetDlpEmailRuleResponse = Schema.Struct({
  action: Schema.Struct({
    action: Schema.Literal("Block"),
    message: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
  conditions: Schema.Array(
    Schema.Struct({
      operator: Schema.Literal(
        "InList",
        "NotInList",
        "MatchRegex",
        "NotMatchRegex",
      ),
      selector: Schema.Literal("Recipients", "Sender", "DLPProfiles"),
      value: Schema.Union(Schema.Array(Schema.String), Schema.String),
    }),
  ),
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  enabled: Schema.Boolean,
  name: Schema.String,
  priority: Schema.Number,
  ruleId: Schema.String.pipe(T.JsonName("rule_id")),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<GetDlpEmailRuleResponse>;

export const getDlpEmailRule: (
  input: GetDlpEmailRuleRequest,
) => Effect.Effect<
  GetDlpEmailRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDlpEmailRuleRequest,
  output: GetDlpEmailRuleResponse,
  errors: [],
}));

export interface CreateDlpEmailRuleRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  action: { action: "Block"; message?: string | null };
  /** Body param: Rule is triggered if all conditions match. */
  conditions: {
    operator: "InList" | "NotInList" | "MatchRegex" | "NotMatchRegex";
    selector: "Recipients" | "Sender" | "DLPProfiles";
    value: string[] | string;
  }[];
  /** Body param: */
  enabled: boolean;
  /** Body param: */
  name: string;
  /** Body param: */
  description?: string | null;
}

export const CreateDlpEmailRuleRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  action: Schema.Struct({
    action: Schema.Literal("Block"),
    message: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
  conditions: Schema.Array(
    Schema.Struct({
      operator: Schema.Literal(
        "InList",
        "NotInList",
        "MatchRegex",
        "NotMatchRegex",
      ),
      selector: Schema.Literal("Recipients", "Sender", "DLPProfiles"),
      value: Schema.Union(Schema.Array(Schema.String), Schema.String),
    }),
  ),
  enabled: Schema.Boolean,
  name: Schema.String,
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/dlp/email/rules" }),
) as unknown as Schema.Schema<CreateDlpEmailRuleRequest>;

export interface CreateDlpEmailRuleResponse {
  action: { action: "Block"; message?: string | null };
  /** Rule is triggered if all conditions match. */
  conditions: {
    operator: "InList" | "NotInList" | "MatchRegex" | "NotMatchRegex";
    selector: "Recipients" | "Sender" | "DLPProfiles";
    value: string[] | string;
  }[];
  createdAt: string;
  enabled: boolean;
  name: string;
  priority: number;
  ruleId: string;
  updatedAt: string;
  description?: string | null;
}

export const CreateDlpEmailRuleResponse = Schema.Struct({
  action: Schema.Struct({
    action: Schema.Literal("Block"),
    message: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
  conditions: Schema.Array(
    Schema.Struct({
      operator: Schema.Literal(
        "InList",
        "NotInList",
        "MatchRegex",
        "NotMatchRegex",
      ),
      selector: Schema.Literal("Recipients", "Sender", "DLPProfiles"),
      value: Schema.Union(Schema.Array(Schema.String), Schema.String),
    }),
  ),
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  enabled: Schema.Boolean,
  name: Schema.String,
  priority: Schema.Number,
  ruleId: Schema.String.pipe(T.JsonName("rule_id")),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<CreateDlpEmailRuleResponse>;

export const createDlpEmailRule: (
  input: CreateDlpEmailRuleRequest,
) => Effect.Effect<
  CreateDlpEmailRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDlpEmailRuleRequest,
  output: CreateDlpEmailRuleResponse,
  errors: [],
}));

export interface UpdateDlpEmailRuleRequest {
  ruleId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  action: { action: "Block"; message?: string | null };
  /** Body param: Rule is triggered if all conditions match. */
  conditions: {
    operator: "InList" | "NotInList" | "MatchRegex" | "NotMatchRegex";
    selector: "Recipients" | "Sender" | "DLPProfiles";
    value: string[] | string;
  }[];
  /** Body param: */
  enabled: boolean;
  /** Body param: */
  name: string;
  /** Body param: */
  description?: string | null;
}

export const UpdateDlpEmailRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  action: Schema.Struct({
    action: Schema.Literal("Block"),
    message: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
  conditions: Schema.Array(
    Schema.Struct({
      operator: Schema.Literal(
        "InList",
        "NotInList",
        "MatchRegex",
        "NotMatchRegex",
      ),
      selector: Schema.Literal("Recipients", "Sender", "DLPProfiles"),
      value: Schema.Union(Schema.Array(Schema.String), Schema.String),
    }),
  ),
  enabled: Schema.Boolean,
  name: Schema.String,
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/dlp/email/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<UpdateDlpEmailRuleRequest>;

export interface UpdateDlpEmailRuleResponse {
  action: { action: "Block"; message?: string | null };
  /** Rule is triggered if all conditions match. */
  conditions: {
    operator: "InList" | "NotInList" | "MatchRegex" | "NotMatchRegex";
    selector: "Recipients" | "Sender" | "DLPProfiles";
    value: string[] | string;
  }[];
  createdAt: string;
  enabled: boolean;
  name: string;
  priority: number;
  ruleId: string;
  updatedAt: string;
  description?: string | null;
}

export const UpdateDlpEmailRuleResponse = Schema.Struct({
  action: Schema.Struct({
    action: Schema.Literal("Block"),
    message: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
  conditions: Schema.Array(
    Schema.Struct({
      operator: Schema.Literal(
        "InList",
        "NotInList",
        "MatchRegex",
        "NotMatchRegex",
      ),
      selector: Schema.Literal("Recipients", "Sender", "DLPProfiles"),
      value: Schema.Union(Schema.Array(Schema.String), Schema.String),
    }),
  ),
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  enabled: Schema.Boolean,
  name: Schema.String,
  priority: Schema.Number,
  ruleId: Schema.String.pipe(T.JsonName("rule_id")),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<UpdateDlpEmailRuleResponse>;

export const updateDlpEmailRule: (
  input: UpdateDlpEmailRuleRequest,
) => Effect.Effect<
  UpdateDlpEmailRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDlpEmailRuleRequest,
  output: UpdateDlpEmailRuleResponse,
  errors: [],
}));

export interface DeleteDlpEmailRuleRequest {
  ruleId: string;
  accountId: string;
}

export const DeleteDlpEmailRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/dlp/email/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<DeleteDlpEmailRuleRequest>;

export interface DeleteDlpEmailRuleResponse {
  action: { action: "Block"; message?: string | null };
  /** Rule is triggered if all conditions match. */
  conditions: {
    operator: "InList" | "NotInList" | "MatchRegex" | "NotMatchRegex";
    selector: "Recipients" | "Sender" | "DLPProfiles";
    value: string[] | string;
  }[];
  createdAt: string;
  enabled: boolean;
  name: string;
  priority: number;
  ruleId: string;
  updatedAt: string;
  description?: string | null;
}

export const DeleteDlpEmailRuleResponse = Schema.Struct({
  action: Schema.Struct({
    action: Schema.Literal("Block"),
    message: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
  conditions: Schema.Array(
    Schema.Struct({
      operator: Schema.Literal(
        "InList",
        "NotInList",
        "MatchRegex",
        "NotMatchRegex",
      ),
      selector: Schema.Literal("Recipients", "Sender", "DLPProfiles"),
      value: Schema.Union(Schema.Array(Schema.String), Schema.String),
    }),
  ),
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  enabled: Schema.Boolean,
  name: Schema.String,
  priority: Schema.Number,
  ruleId: Schema.String.pipe(T.JsonName("rule_id")),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<DeleteDlpEmailRuleResponse>;

export const deleteDlpEmailRule: (
  input: DeleteDlpEmailRuleRequest,
) => Effect.Effect<
  DeleteDlpEmailRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDlpEmailRuleRequest,
  output: DeleteDlpEmailRuleResponse,
  errors: [],
}));

export interface BulkPatchDlpEmailRulesRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  newPriorities: Record<string, unknown>;
}

export const BulkPatchDlpEmailRulesRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  newPriorities: Schema.Struct({}).pipe(T.JsonName("new_priorities")),
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/dlp/email/rules" }),
) as unknown as Schema.Schema<BulkPatchDlpEmailRulesRequest>;

export interface BulkPatchDlpEmailRulesResponse {
  action: { action: "Block"; message?: string | null };
  /** Rule is triggered if all conditions match. */
  conditions: {
    operator: "InList" | "NotInList" | "MatchRegex" | "NotMatchRegex";
    selector: "Recipients" | "Sender" | "DLPProfiles";
    value: string[] | string;
  }[];
  createdAt: string;
  enabled: boolean;
  name: string;
  priority: number;
  ruleId: string;
  updatedAt: string;
  description?: string | null;
}

export const BulkPatchDlpEmailRulesResponse = Schema.Struct({
  action: Schema.Struct({
    action: Schema.Literal("Block"),
    message: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
  conditions: Schema.Array(
    Schema.Struct({
      operator: Schema.Literal(
        "InList",
        "NotInList",
        "MatchRegex",
        "NotMatchRegex",
      ),
      selector: Schema.Literal("Recipients", "Sender", "DLPProfiles"),
      value: Schema.Union(Schema.Array(Schema.String), Schema.String),
    }),
  ),
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  enabled: Schema.Boolean,
  name: Schema.String,
  priority: Schema.Number,
  ruleId: Schema.String.pipe(T.JsonName("rule_id")),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<BulkPatchDlpEmailRulesResponse>;

export const bulkPatchDlpEmailRules: (
  input: BulkPatchDlpEmailRulesRequest,
) => Effect.Effect<
  BulkPatchDlpEmailRulesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkPatchDlpEmailRulesRequest,
  output: BulkPatchDlpEmailRulesResponse,
  errors: [],
}));

// =============================================================================
// DlpEntry
// =============================================================================

export interface GetDlpEntryRequest {
  entryId: string;
  accountId: string;
}

export const GetDlpEntryRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dlp/entries/{entryId}",
  }),
) as unknown as Schema.Schema<GetDlpEntryRequest>;

export type GetDlpEntryResponse =
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      pattern: unknown;
      type: "custom";
      updatedAt: string;
      profileId?: string | null;
    }
  | {
      id: string;
      confidence: { aiContextAvailable: boolean; available: boolean };
      enabled: boolean;
      name: string;
      type: "predefined";
      profileId?: string | null;
      variant?: {
        topicType: "Intent" | "Content";
        type: "PromptTopic";
        description?: string | null;
      };
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "integration";
      updatedAt: string;
      profileId?: string | null;
    }
  | {
      id: string;
      caseSensitive: boolean;
      createdAt: string;
      enabled: boolean;
      name: string;
      secret: boolean;
      type: "exact_data";
      updatedAt: string;
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "document_fingerprint";
      updatedAt: string;
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "word_list";
      updatedAt: string;
      wordList: unknown;
      profileId?: string | null;
    };

export const GetDlpEntryResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    pattern: Schema.Unknown,
    type: Schema.Literal("custom"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    confidence: Schema.Struct({
      aiContextAvailable: Schema.Boolean.pipe(
        T.JsonName("ai_context_available"),
      ),
      available: Schema.Boolean,
    }),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("predefined"),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
    variant: Schema.optional(
      Schema.Struct({
        topicType: Schema.Literal("Intent", "Content").pipe(
          T.JsonName("topic_type"),
        ),
        type: Schema.Literal("PromptTopic"),
        description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      }),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("integration"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    caseSensitive: Schema.Boolean.pipe(T.JsonName("case_sensitive")),
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    secret: Schema.Boolean,
    type: Schema.Literal("exact_data"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("document_fingerprint"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("word_list"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    wordList: Schema.Unknown.pipe(T.JsonName("word_list")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
) as unknown as Schema.Schema<GetDlpEntryResponse>;

export const getDlpEntry: (
  input: GetDlpEntryRequest,
) => Effect.Effect<
  GetDlpEntryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDlpEntryRequest,
  output: GetDlpEntryResponse,
  errors: [],
}));

export interface CreateDlpEntryRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  enabled: boolean;
  /** Body param: */
  name: string;
  /** Body param: */
  pattern: unknown;
  /** Body param: */
  profileId: string;
}

export const CreateDlpEntryRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  enabled: Schema.Boolean,
  name: Schema.String,
  pattern: Schema.Unknown,
  profileId: Schema.String.pipe(T.JsonName("profile_id")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/dlp/entries" }),
) as unknown as Schema.Schema<CreateDlpEntryRequest>;

export interface CreateDlpEntryResponse {
  id: string;
  createdAt: string;
  enabled: boolean;
  name: string;
  pattern: unknown;
  updatedAt: string;
  profileId?: string | null;
}

export const CreateDlpEntryResponse = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  enabled: Schema.Boolean,
  name: Schema.String,
  pattern: Schema.Unknown,
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("profile_id"),
  ),
}) as unknown as Schema.Schema<CreateDlpEntryResponse>;

export const createDlpEntry: (
  input: CreateDlpEntryRequest,
) => Effect.Effect<
  CreateDlpEntryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDlpEntryRequest,
  output: CreateDlpEntryResponse,
  errors: [],
}));

export interface UpdateDlpEntryRequest {
  entryId: string;
}

export const UpdateDlpEntryRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/dlp/entries/{entryId}",
  }),
) as unknown as Schema.Schema<UpdateDlpEntryRequest>;

export type UpdateDlpEntryResponse =
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      pattern: unknown;
      type: "custom";
      updatedAt: string;
      profileId?: string | null;
    }
  | {
      id: string;
      confidence: { aiContextAvailable: boolean; available: boolean };
      enabled: boolean;
      name: string;
      type: "predefined";
      profileId?: string | null;
      variant?: {
        topicType: "Intent" | "Content";
        type: "PromptTopic";
        description?: string | null;
      };
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "integration";
      updatedAt: string;
      profileId?: string | null;
    }
  | {
      id: string;
      caseSensitive: boolean;
      createdAt: string;
      enabled: boolean;
      name: string;
      secret: boolean;
      type: "exact_data";
      updatedAt: string;
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "document_fingerprint";
      updatedAt: string;
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "word_list";
      updatedAt: string;
      wordList: unknown;
      profileId?: string | null;
    };

export const UpdateDlpEntryResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    pattern: Schema.Unknown,
    type: Schema.Literal("custom"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    confidence: Schema.Struct({
      aiContextAvailable: Schema.Boolean.pipe(
        T.JsonName("ai_context_available"),
      ),
      available: Schema.Boolean,
    }),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("predefined"),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
    variant: Schema.optional(
      Schema.Struct({
        topicType: Schema.Literal("Intent", "Content").pipe(
          T.JsonName("topic_type"),
        ),
        type: Schema.Literal("PromptTopic"),
        description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      }),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("integration"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    caseSensitive: Schema.Boolean.pipe(T.JsonName("case_sensitive")),
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    secret: Schema.Boolean,
    type: Schema.Literal("exact_data"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("document_fingerprint"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("word_list"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    wordList: Schema.Unknown.pipe(T.JsonName("word_list")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
) as unknown as Schema.Schema<UpdateDlpEntryResponse>;

export const updateDlpEntry: (
  input: UpdateDlpEntryRequest,
) => Effect.Effect<
  UpdateDlpEntryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDlpEntryRequest,
  output: UpdateDlpEntryResponse,
  errors: [],
}));

export interface DeleteDlpEntryRequest {
  entryId: string;
  accountId: string;
}

export const DeleteDlpEntryRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/dlp/entries/{entryId}",
  }),
) as unknown as Schema.Schema<DeleteDlpEntryRequest>;

export type DeleteDlpEntryResponse = unknown;

export const DeleteDlpEntryResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDlpEntryResponse>;

export const deleteDlpEntry: (
  input: DeleteDlpEntryRequest,
) => Effect.Effect<
  DeleteDlpEntryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDlpEntryRequest,
  output: DeleteDlpEntryResponse,
  errors: [],
}));

// =============================================================================
// DlpEntryCustom
// =============================================================================

export interface GetDlpEntryCustomRequest {
  entryId: string;
  accountId: string;
}

export const GetDlpEntryCustomRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dlp/entries/{entryId}",
  }),
) as unknown as Schema.Schema<GetDlpEntryCustomRequest>;

export type GetDlpEntryCustomResponse =
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      pattern: unknown;
      type: "custom";
      updatedAt: string;
      profileId?: string | null;
    }
  | {
      id: string;
      confidence: { aiContextAvailable: boolean; available: boolean };
      enabled: boolean;
      name: string;
      type: "predefined";
      profileId?: string | null;
      variant?: {
        topicType: "Intent" | "Content";
        type: "PromptTopic";
        description?: string | null;
      };
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "integration";
      updatedAt: string;
      profileId?: string | null;
    }
  | {
      id: string;
      caseSensitive: boolean;
      createdAt: string;
      enabled: boolean;
      name: string;
      secret: boolean;
      type: "exact_data";
      updatedAt: string;
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "document_fingerprint";
      updatedAt: string;
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "word_list";
      updatedAt: string;
      wordList: unknown;
      profileId?: string | null;
    };

export const GetDlpEntryCustomResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    pattern: Schema.Unknown,
    type: Schema.Literal("custom"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    confidence: Schema.Struct({
      aiContextAvailable: Schema.Boolean.pipe(
        T.JsonName("ai_context_available"),
      ),
      available: Schema.Boolean,
    }),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("predefined"),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
    variant: Schema.optional(
      Schema.Struct({
        topicType: Schema.Literal("Intent", "Content").pipe(
          T.JsonName("topic_type"),
        ),
        type: Schema.Literal("PromptTopic"),
        description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      }),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("integration"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    caseSensitive: Schema.Boolean.pipe(T.JsonName("case_sensitive")),
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    secret: Schema.Boolean,
    type: Schema.Literal("exact_data"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("document_fingerprint"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("word_list"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    wordList: Schema.Unknown.pipe(T.JsonName("word_list")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
) as unknown as Schema.Schema<GetDlpEntryCustomResponse>;

export const getDlpEntryCustom: (
  input: GetDlpEntryCustomRequest,
) => Effect.Effect<
  GetDlpEntryCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDlpEntryCustomRequest,
  output: GetDlpEntryCustomResponse,
  errors: [],
}));

export interface CreateDlpEntryCustomRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  enabled: boolean;
  /** Body param: */
  name: string;
  /** Body param: */
  pattern: unknown;
  /** Body param: */
  profileId: string;
}

export const CreateDlpEntryCustomRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  enabled: Schema.Boolean,
  name: Schema.String,
  pattern: Schema.Unknown,
  profileId: Schema.String.pipe(T.JsonName("profile_id")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/dlp/entries" }),
) as unknown as Schema.Schema<CreateDlpEntryCustomRequest>;

export interface CreateDlpEntryCustomResponse {
  id: string;
  createdAt: string;
  enabled: boolean;
  name: string;
  pattern: unknown;
  updatedAt: string;
  profileId?: string | null;
}

export const CreateDlpEntryCustomResponse = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  enabled: Schema.Boolean,
  name: Schema.String,
  pattern: Schema.Unknown,
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("profile_id"),
  ),
}) as unknown as Schema.Schema<CreateDlpEntryCustomResponse>;

export const createDlpEntryCustom: (
  input: CreateDlpEntryCustomRequest,
) => Effect.Effect<
  CreateDlpEntryCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDlpEntryCustomRequest,
  output: CreateDlpEntryCustomResponse,
  errors: [],
}));

export interface UpdateDlpEntryCustomRequest {
  entryId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  enabled: boolean;
  /** Body param: */
  name: string;
  /** Body param: */
  pattern: unknown;
}

export const UpdateDlpEntryCustomRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  enabled: Schema.Boolean,
  name: Schema.String,
  pattern: Schema.Unknown,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/dlp/entries/custom/{entryId}",
  }),
) as unknown as Schema.Schema<UpdateDlpEntryCustomRequest>;

export interface UpdateDlpEntryCustomResponse {
  id: string;
  createdAt: string;
  enabled: boolean;
  name: string;
  pattern: unknown;
  updatedAt: string;
  profileId?: string | null;
}

export const UpdateDlpEntryCustomResponse = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  enabled: Schema.Boolean,
  name: Schema.String,
  pattern: Schema.Unknown,
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("profile_id"),
  ),
}) as unknown as Schema.Schema<UpdateDlpEntryCustomResponse>;

export const updateDlpEntryCustom: (
  input: UpdateDlpEntryCustomRequest,
) => Effect.Effect<
  UpdateDlpEntryCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDlpEntryCustomRequest,
  output: UpdateDlpEntryCustomResponse,
  errors: [],
}));

export interface DeleteDlpEntryCustomRequest {
  entryId: string;
  accountId: string;
}

export const DeleteDlpEntryCustomRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/dlp/entries/{entryId}",
  }),
) as unknown as Schema.Schema<DeleteDlpEntryCustomRequest>;

export type DeleteDlpEntryCustomResponse = unknown;

export const DeleteDlpEntryCustomResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDlpEntryCustomResponse>;

export const deleteDlpEntryCustom: (
  input: DeleteDlpEntryCustomRequest,
) => Effect.Effect<
  DeleteDlpEntryCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDlpEntryCustomRequest,
  output: DeleteDlpEntryCustomResponse,
  errors: [],
}));

// =============================================================================
// DlpEntryIntegration
// =============================================================================

export interface GetDlpEntryIntegrationRequest {
  entryId: string;
  accountId: string;
}

export const GetDlpEntryIntegrationRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dlp/entries/{entryId}",
  }),
) as unknown as Schema.Schema<GetDlpEntryIntegrationRequest>;

export type GetDlpEntryIntegrationResponse =
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      pattern: unknown;
      type: "custom";
      updatedAt: string;
      profileId?: string | null;
    }
  | {
      id: string;
      confidence: { aiContextAvailable: boolean; available: boolean };
      enabled: boolean;
      name: string;
      type: "predefined";
      profileId?: string | null;
      variant?: {
        topicType: "Intent" | "Content";
        type: "PromptTopic";
        description?: string | null;
      };
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "integration";
      updatedAt: string;
      profileId?: string | null;
    }
  | {
      id: string;
      caseSensitive: boolean;
      createdAt: string;
      enabled: boolean;
      name: string;
      secret: boolean;
      type: "exact_data";
      updatedAt: string;
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "document_fingerprint";
      updatedAt: string;
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "word_list";
      updatedAt: string;
      wordList: unknown;
      profileId?: string | null;
    };

export const GetDlpEntryIntegrationResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    pattern: Schema.Unknown,
    type: Schema.Literal("custom"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    confidence: Schema.Struct({
      aiContextAvailable: Schema.Boolean.pipe(
        T.JsonName("ai_context_available"),
      ),
      available: Schema.Boolean,
    }),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("predefined"),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
    variant: Schema.optional(
      Schema.Struct({
        topicType: Schema.Literal("Intent", "Content").pipe(
          T.JsonName("topic_type"),
        ),
        type: Schema.Literal("PromptTopic"),
        description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      }),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("integration"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    caseSensitive: Schema.Boolean.pipe(T.JsonName("case_sensitive")),
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    secret: Schema.Boolean,
    type: Schema.Literal("exact_data"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("document_fingerprint"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("word_list"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    wordList: Schema.Unknown.pipe(T.JsonName("word_list")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
) as unknown as Schema.Schema<GetDlpEntryIntegrationResponse>;

export const getDlpEntryIntegration: (
  input: GetDlpEntryIntegrationRequest,
) => Effect.Effect<
  GetDlpEntryIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDlpEntryIntegrationRequest,
  output: GetDlpEntryIntegrationResponse,
  errors: [],
}));

export interface CreateDlpEntryIntegrationRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  enabled: boolean;
  /** Body param: */
  entryId: string;
  /** Body param: This field is not actually used as the owning profile for a predefined entry is already set to a predefined profile */
  profileId?: string | null;
}

export const CreateDlpEntryIntegrationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  enabled: Schema.Boolean,
  entryId: Schema.String.pipe(T.JsonName("entry_id")),
  profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("profile_id"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/dlp/entries/integration",
  }),
) as unknown as Schema.Schema<CreateDlpEntryIntegrationRequest>;

export interface CreateDlpEntryIntegrationResponse {
  id: string;
  createdAt: string;
  enabled: boolean;
  name: string;
  updatedAt: string;
  profileId?: string | null;
}

export const CreateDlpEntryIntegrationResponse = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  enabled: Schema.Boolean,
  name: Schema.String,
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("profile_id"),
  ),
}) as unknown as Schema.Schema<CreateDlpEntryIntegrationResponse>;

export const createDlpEntryIntegration: (
  input: CreateDlpEntryIntegrationRequest,
) => Effect.Effect<
  CreateDlpEntryIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDlpEntryIntegrationRequest,
  output: CreateDlpEntryIntegrationResponse,
  errors: [],
}));

export interface UpdateDlpEntryIntegrationRequest {
  entryId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  enabled: boolean;
}

export const UpdateDlpEntryIntegrationRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  enabled: Schema.Boolean,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/dlp/entries/integration/{entryId}",
  }),
) as unknown as Schema.Schema<UpdateDlpEntryIntegrationRequest>;

export interface UpdateDlpEntryIntegrationResponse {
  id: string;
  createdAt: string;
  enabled: boolean;
  name: string;
  updatedAt: string;
  profileId?: string | null;
}

export const UpdateDlpEntryIntegrationResponse = Schema.Struct({
  id: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  enabled: Schema.Boolean,
  name: Schema.String,
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("profile_id"),
  ),
}) as unknown as Schema.Schema<UpdateDlpEntryIntegrationResponse>;

export const updateDlpEntryIntegration: (
  input: UpdateDlpEntryIntegrationRequest,
) => Effect.Effect<
  UpdateDlpEntryIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDlpEntryIntegrationRequest,
  output: UpdateDlpEntryIntegrationResponse,
  errors: [],
}));

export interface DeleteDlpEntryIntegrationRequest {
  entryId: string;
  accountId: string;
}

export const DeleteDlpEntryIntegrationRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/dlp/entries/integration/{entryId}",
  }),
) as unknown as Schema.Schema<DeleteDlpEntryIntegrationRequest>;

export type DeleteDlpEntryIntegrationResponse = unknown;

export const DeleteDlpEntryIntegrationResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDlpEntryIntegrationResponse>;

export const deleteDlpEntryIntegration: (
  input: DeleteDlpEntryIntegrationRequest,
) => Effect.Effect<
  DeleteDlpEntryIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDlpEntryIntegrationRequest,
  output: DeleteDlpEntryIntegrationResponse,
  errors: [],
}));

// =============================================================================
// DlpEntryPredefined
// =============================================================================

export interface GetDlpEntryPredefinedRequest {
  entryId: string;
  accountId: string;
}

export const GetDlpEntryPredefinedRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dlp/entries/{entryId}",
  }),
) as unknown as Schema.Schema<GetDlpEntryPredefinedRequest>;

export type GetDlpEntryPredefinedResponse =
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      pattern: unknown;
      type: "custom";
      updatedAt: string;
      profileId?: string | null;
    }
  | {
      id: string;
      confidence: { aiContextAvailable: boolean; available: boolean };
      enabled: boolean;
      name: string;
      type: "predefined";
      profileId?: string | null;
      variant?: {
        topicType: "Intent" | "Content";
        type: "PromptTopic";
        description?: string | null;
      };
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "integration";
      updatedAt: string;
      profileId?: string | null;
    }
  | {
      id: string;
      caseSensitive: boolean;
      createdAt: string;
      enabled: boolean;
      name: string;
      secret: boolean;
      type: "exact_data";
      updatedAt: string;
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "document_fingerprint";
      updatedAt: string;
    }
  | {
      id: string;
      createdAt: string;
      enabled: boolean;
      name: string;
      type: "word_list";
      updatedAt: string;
      wordList: unknown;
      profileId?: string | null;
    };

export const GetDlpEntryPredefinedResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    pattern: Schema.Unknown,
    type: Schema.Literal("custom"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    confidence: Schema.Struct({
      aiContextAvailable: Schema.Boolean.pipe(
        T.JsonName("ai_context_available"),
      ),
      available: Schema.Boolean,
    }),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("predefined"),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
    variant: Schema.optional(
      Schema.Struct({
        topicType: Schema.Literal("Intent", "Content").pipe(
          T.JsonName("topic_type"),
        ),
        type: Schema.Literal("PromptTopic"),
        description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      }),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("integration"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    caseSensitive: Schema.Boolean.pipe(T.JsonName("case_sensitive")),
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    secret: Schema.Boolean,
    type: Schema.Literal("exact_data"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("document_fingerprint"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    enabled: Schema.Boolean,
    name: Schema.String,
    type: Schema.Literal("word_list"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    wordList: Schema.Unknown.pipe(T.JsonName("word_list")),
    profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
      T.JsonName("profile_id"),
    ),
  }),
) as unknown as Schema.Schema<GetDlpEntryPredefinedResponse>;

export const getDlpEntryPredefined: (
  input: GetDlpEntryPredefinedRequest,
) => Effect.Effect<
  GetDlpEntryPredefinedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDlpEntryPredefinedRequest,
  output: GetDlpEntryPredefinedResponse,
  errors: [],
}));

export interface CreateDlpEntryPredefinedRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  enabled: boolean;
  /** Body param: */
  entryId: string;
  /** Body param: This field is not actually used as the owning profile for a predefined entry is already set to a predefined profile */
  profileId?: string | null;
}

export const CreateDlpEntryPredefinedRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  enabled: Schema.Boolean,
  entryId: Schema.String.pipe(T.JsonName("entry_id")),
  profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("profile_id"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/dlp/entries/predefined",
  }),
) as unknown as Schema.Schema<CreateDlpEntryPredefinedRequest>;

export interface CreateDlpEntryPredefinedResponse {
  id: string;
  confidence: { aiContextAvailable: boolean; available: boolean };
  enabled: boolean;
  name: string;
  profileId?: string | null;
  variant?: {
    topicType: "Intent" | "Content";
    type: "PromptTopic";
    description?: string | null;
  };
}

export const CreateDlpEntryPredefinedResponse = Schema.Struct({
  id: Schema.String,
  confidence: Schema.Struct({
    aiContextAvailable: Schema.Boolean.pipe(T.JsonName("ai_context_available")),
    available: Schema.Boolean,
  }),
  enabled: Schema.Boolean,
  name: Schema.String,
  profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("profile_id"),
  ),
  variant: Schema.optional(
    Schema.Struct({
      topicType: Schema.Literal("Intent", "Content").pipe(
        T.JsonName("topic_type"),
      ),
      type: Schema.Literal("PromptTopic"),
      description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
}) as unknown as Schema.Schema<CreateDlpEntryPredefinedResponse>;

export const createDlpEntryPredefined: (
  input: CreateDlpEntryPredefinedRequest,
) => Effect.Effect<
  CreateDlpEntryPredefinedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDlpEntryPredefinedRequest,
  output: CreateDlpEntryPredefinedResponse,
  errors: [],
}));

export interface UpdateDlpEntryPredefinedRequest {
  entryId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  enabled: boolean;
}

export const UpdateDlpEntryPredefinedRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  enabled: Schema.Boolean,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/dlp/entries/predefined/{entryId}",
  }),
) as unknown as Schema.Schema<UpdateDlpEntryPredefinedRequest>;

export interface UpdateDlpEntryPredefinedResponse {
  id: string;
  confidence: { aiContextAvailable: boolean; available: boolean };
  enabled: boolean;
  name: string;
  profileId?: string | null;
  variant?: {
    topicType: "Intent" | "Content";
    type: "PromptTopic";
    description?: string | null;
  };
}

export const UpdateDlpEntryPredefinedResponse = Schema.Struct({
  id: Schema.String,
  confidence: Schema.Struct({
    aiContextAvailable: Schema.Boolean.pipe(T.JsonName("ai_context_available")),
    available: Schema.Boolean,
  }),
  enabled: Schema.Boolean,
  name: Schema.String,
  profileId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("profile_id"),
  ),
  variant: Schema.optional(
    Schema.Struct({
      topicType: Schema.Literal("Intent", "Content").pipe(
        T.JsonName("topic_type"),
      ),
      type: Schema.Literal("PromptTopic"),
      description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    }),
  ),
}) as unknown as Schema.Schema<UpdateDlpEntryPredefinedResponse>;

export const updateDlpEntryPredefined: (
  input: UpdateDlpEntryPredefinedRequest,
) => Effect.Effect<
  UpdateDlpEntryPredefinedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDlpEntryPredefinedRequest,
  output: UpdateDlpEntryPredefinedResponse,
  errors: [],
}));

export interface DeleteDlpEntryPredefinedRequest {
  entryId: string;
  accountId: string;
}

export const DeleteDlpEntryPredefinedRequest = Schema.Struct({
  entryId: Schema.String.pipe(T.HttpPath("entryId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/dlp/entries/predefined/{entryId}",
  }),
) as unknown as Schema.Schema<DeleteDlpEntryPredefinedRequest>;

export type DeleteDlpEntryPredefinedResponse = unknown;

export const DeleteDlpEntryPredefinedResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDlpEntryPredefinedResponse>;

export const deleteDlpEntryPredefined: (
  input: DeleteDlpEntryPredefinedRequest,
) => Effect.Effect<
  DeleteDlpEntryPredefinedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDlpEntryPredefinedRequest,
  output: DeleteDlpEntryPredefinedResponse,
  errors: [],
}));

// =============================================================================
// DlpLimit
// =============================================================================

export interface ListDlpLimitsRequest {
  accountId: string;
}

export const ListDlpLimitsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/dlp/limits" }),
) as unknown as Schema.Schema<ListDlpLimitsRequest>;

export interface ListDlpLimitsResponse {
  maxDatasetCells: number;
}

export const ListDlpLimitsResponse = Schema.Struct({
  maxDatasetCells: Schema.Number.pipe(T.JsonName("max_dataset_cells")),
}) as unknown as Schema.Schema<ListDlpLimitsResponse>;

export const listDlpLimits: (
  input: ListDlpLimitsRequest,
) => Effect.Effect<
  ListDlpLimitsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListDlpLimitsRequest,
  output: ListDlpLimitsResponse,
  errors: [],
}));

// =============================================================================
// DlpPattern
// =============================================================================

export interface ValidateDlpPatternRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: */
  regex: string;
  /** Body param: Maximum number of bytes that the regular expression can match.  If this is `null` then there is no limit on the length. Patterns can use ` ` and `+`. Otherwise repeats should use a range ` */
  maxMatchBytes?: number | null;
}

export const ValidateDlpPatternRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  regex: Schema.String,
  maxMatchBytes: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.JsonName("max_match_bytes"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/dlp/patterns/validate",
  }),
) as unknown as Schema.Schema<ValidateDlpPatternRequest>;

export interface ValidateDlpPatternResponse {
  valid: boolean;
}

export const ValidateDlpPatternResponse = Schema.Struct({
  valid: Schema.Boolean,
}) as unknown as Schema.Schema<ValidateDlpPatternResponse>;

export const validateDlpPattern: (
  input: ValidateDlpPatternRequest,
) => Effect.Effect<
  ValidateDlpPatternResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ValidateDlpPatternRequest,
  output: ValidateDlpPatternResponse,
  errors: [],
}));

// =============================================================================
// DlpPayloadLog
// =============================================================================

export interface GetDlpPayloadLogRequest {
  accountId: string;
}

export const GetDlpPayloadLogRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/dlp/payload_log" }),
) as unknown as Schema.Schema<GetDlpPayloadLogRequest>;

export interface GetDlpPayloadLogResponse {
  updatedAt: string;
  publicKey?: string | null;
}

export const GetDlpPayloadLogResponse = Schema.Struct({
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  publicKey: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("public_key"),
  ),
}) as unknown as Schema.Schema<GetDlpPayloadLogResponse>;

export const getDlpPayloadLog: (
  input: GetDlpPayloadLogRequest,
) => Effect.Effect<
  GetDlpPayloadLogResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDlpPayloadLogRequest,
  output: GetDlpPayloadLogResponse,
  errors: [],
}));

export interface PutDlpPayloadLogRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  publicKey?: string | null;
}

export const PutDlpPayloadLogRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  publicKey: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("public_key"),
  ),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/dlp/payload_log" }),
) as unknown as Schema.Schema<PutDlpPayloadLogRequest>;

export interface PutDlpPayloadLogResponse {
  updatedAt: string;
  publicKey?: string | null;
}

export const PutDlpPayloadLogResponse = Schema.Struct({
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  publicKey: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("public_key"),
  ),
}) as unknown as Schema.Schema<PutDlpPayloadLogResponse>;

export const putDlpPayloadLog: (
  input: PutDlpPayloadLogRequest,
) => Effect.Effect<
  PutDlpPayloadLogResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutDlpPayloadLogRequest,
  output: PutDlpPayloadLogResponse,
  errors: [],
}));

// =============================================================================
// DlpProfile
// =============================================================================

export interface GetDlpProfileRequest {
  profileId: string;
  accountId: string;
}

export const GetDlpProfileRequest = Schema.Struct({
  profileId: Schema.String.pipe(T.HttpPath("profileId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dlp/profiles/{profileId}",
  }),
) as unknown as Schema.Schema<GetDlpProfileRequest>;

export type GetDlpProfileResponse =
  | {
      id: string;
      allowedMatchCount: number;
      createdAt: string;
      name: string;
      ocrEnabled: boolean;
      type: "custom";
      updatedAt: string;
      aiContextEnabled?: boolean;
      confidenceThreshold?: "low" | "medium" | "high" | "very_high";
      contextAwareness?: unknown;
      description?: string | null;
      entries?: (
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            pattern: unknown;
            type: "custom";
            updatedAt: string;
            profileId?: string | null;
          }
        | {
            id: string;
            confidence: { aiContextAvailable: boolean; available: boolean };
            enabled: boolean;
            name: string;
            type: "predefined";
            profileId?: string | null;
            variant?: {
              topicType: "Intent" | "Content";
              type: "PromptTopic";
              description?: string | null;
            };
          }
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            type: "integration";
            updatedAt: string;
            profileId?: string | null;
          }
        | {
            id: string;
            caseSensitive: boolean;
            createdAt: string;
            enabled: boolean;
            name: string;
            secret: boolean;
            type: "exact_data";
            updatedAt: string;
          }
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            type: "document_fingerprint";
            updatedAt: string;
          }
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            type: "word_list";
            updatedAt: string;
            wordList: unknown;
            profileId?: string | null;
          }
      )[];
    }
  | {
      id: string;
      allowedMatchCount: number;
      entries: (
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            pattern: unknown;
            type: "custom";
            updatedAt: string;
            profileId?: string | null;
          }
        | {
            id: string;
            confidence: { aiContextAvailable: boolean; available: boolean };
            enabled: boolean;
            name: string;
            type: "predefined";
            profileId?: string | null;
            variant?: {
              topicType: "Intent" | "Content";
              type: "PromptTopic";
              description?: string | null;
            };
          }
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            type: "integration";
            updatedAt: string;
            profileId?: string | null;
          }
        | {
            id: string;
            caseSensitive: boolean;
            createdAt: string;
            enabled: boolean;
            name: string;
            secret: boolean;
            type: "exact_data";
            updatedAt: string;
          }
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            type: "document_fingerprint";
            updatedAt: string;
          }
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            type: "word_list";
            updatedAt: string;
            wordList: unknown;
            profileId?: string | null;
          }
      )[];
      name: string;
      type: "predefined";
      aiContextEnabled?: boolean;
      confidenceThreshold?: "low" | "medium" | "high" | "very_high";
      contextAwareness?: unknown;
      ocrEnabled?: boolean;
      openAccess?: boolean;
    }
  | {
      id: string;
      createdAt: string;
      entries: (
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            pattern: unknown;
            type: "custom";
            updatedAt: string;
            profileId?: string | null;
          }
        | {
            id: string;
            confidence: { aiContextAvailable: boolean; available: boolean };
            enabled: boolean;
            name: string;
            type: "predefined";
            profileId?: string | null;
            variant?: {
              topicType: "Intent" | "Content";
              type: "PromptTopic";
              description?: string | null;
            };
          }
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            type: "integration";
            updatedAt: string;
            profileId?: string | null;
          }
        | {
            id: string;
            caseSensitive: boolean;
            createdAt: string;
            enabled: boolean;
            name: string;
            secret: boolean;
            type: "exact_data";
            updatedAt: string;
          }
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            type: "document_fingerprint";
            updatedAt: string;
          }
        | {
            id: string;
            createdAt: string;
            enabled: boolean;
            name: string;
            type: "word_list";
            updatedAt: string;
            wordList: unknown;
            profileId?: string | null;
          }
      )[];
      name: string;
      type: "integration";
      updatedAt: string;
      description?: string | null;
    };

export const GetDlpProfileResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    allowedMatchCount: Schema.Number.pipe(T.JsonName("allowed_match_count")),
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    name: Schema.String,
    ocrEnabled: Schema.Boolean.pipe(T.JsonName("ocr_enabled")),
    type: Schema.Literal("custom"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    aiContextEnabled: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("ai_context_enabled"),
    ),
    confidenceThreshold: Schema.optional(
      Schema.Literal("low", "medium", "high", "very_high"),
    ).pipe(T.JsonName("confidence_threshold")),
    contextAwareness: Schema.optional(Schema.Unknown).pipe(
      T.JsonName("context_awareness"),
    ),
    description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    entries: Schema.optional(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            id: Schema.String,
            createdAt: Schema.String.pipe(T.JsonName("created_at")),
            enabled: Schema.Boolean,
            name: Schema.String,
            pattern: Schema.Unknown,
            type: Schema.Literal("custom"),
            updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
            profileId: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("profile_id")),
          }),
          Schema.Struct({
            id: Schema.String,
            confidence: Schema.Struct({
              aiContextAvailable: Schema.Boolean.pipe(
                T.JsonName("ai_context_available"),
              ),
              available: Schema.Boolean,
            }),
            enabled: Schema.Boolean,
            name: Schema.String,
            type: Schema.Literal("predefined"),
            profileId: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("profile_id")),
            variant: Schema.optional(
              Schema.Struct({
                topicType: Schema.Literal("Intent", "Content").pipe(
                  T.JsonName("topic_type"),
                ),
                type: Schema.Literal("PromptTopic"),
                description: Schema.optional(
                  Schema.Union(Schema.String, Schema.Null),
                ),
              }),
            ),
          }),
          Schema.Struct({
            id: Schema.String,
            createdAt: Schema.String.pipe(T.JsonName("created_at")),
            enabled: Schema.Boolean,
            name: Schema.String,
            type: Schema.Literal("integration"),
            updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
            profileId: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("profile_id")),
          }),
          Schema.Struct({
            id: Schema.String,
            caseSensitive: Schema.Boolean.pipe(T.JsonName("case_sensitive")),
            createdAt: Schema.String.pipe(T.JsonName("created_at")),
            enabled: Schema.Boolean,
            name: Schema.String,
            secret: Schema.Boolean,
            type: Schema.Literal("exact_data"),
            updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
          }),
          Schema.Struct({
            id: Schema.String,
            createdAt: Schema.String.pipe(T.JsonName("created_at")),
            enabled: Schema.Boolean,
            name: Schema.String,
            type: Schema.Literal("document_fingerprint"),
            updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
          }),
          Schema.Struct({
            id: Schema.String,
            createdAt: Schema.String.pipe(T.JsonName("created_at")),
            enabled: Schema.Boolean,
            name: Schema.String,
            type: Schema.Literal("word_list"),
            updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
            wordList: Schema.Unknown.pipe(T.JsonName("word_list")),
            profileId: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("profile_id")),
          }),
        ),
      ),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    allowedMatchCount: Schema.Number.pipe(T.JsonName("allowed_match_count")),
    entries: Schema.Array(
      Schema.Union(
        Schema.Struct({
          id: Schema.String,
          createdAt: Schema.String.pipe(T.JsonName("created_at")),
          enabled: Schema.Boolean,
          name: Schema.String,
          pattern: Schema.Unknown,
          type: Schema.Literal("custom"),
          updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
          profileId: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("profile_id")),
        }),
        Schema.Struct({
          id: Schema.String,
          confidence: Schema.Struct({
            aiContextAvailable: Schema.Boolean.pipe(
              T.JsonName("ai_context_available"),
            ),
            available: Schema.Boolean,
          }),
          enabled: Schema.Boolean,
          name: Schema.String,
          type: Schema.Literal("predefined"),
          profileId: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("profile_id")),
          variant: Schema.optional(
            Schema.Struct({
              topicType: Schema.Literal("Intent", "Content").pipe(
                T.JsonName("topic_type"),
              ),
              type: Schema.Literal("PromptTopic"),
              description: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ),
            }),
          ),
        }),
        Schema.Struct({
          id: Schema.String,
          createdAt: Schema.String.pipe(T.JsonName("created_at")),
          enabled: Schema.Boolean,
          name: Schema.String,
          type: Schema.Literal("integration"),
          updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
          profileId: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("profile_id")),
        }),
        Schema.Struct({
          id: Schema.String,
          caseSensitive: Schema.Boolean.pipe(T.JsonName("case_sensitive")),
          createdAt: Schema.String.pipe(T.JsonName("created_at")),
          enabled: Schema.Boolean,
          name: Schema.String,
          secret: Schema.Boolean,
          type: Schema.Literal("exact_data"),
          updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
        }),
        Schema.Struct({
          id: Schema.String,
          createdAt: Schema.String.pipe(T.JsonName("created_at")),
          enabled: Schema.Boolean,
          name: Schema.String,
          type: Schema.Literal("document_fingerprint"),
          updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
        }),
        Schema.Struct({
          id: Schema.String,
          createdAt: Schema.String.pipe(T.JsonName("created_at")),
          enabled: Schema.Boolean,
          name: Schema.String,
          type: Schema.Literal("word_list"),
          updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
          wordList: Schema.Unknown.pipe(T.JsonName("word_list")),
          profileId: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("profile_id")),
        }),
      ),
    ),
    name: Schema.String,
    type: Schema.Literal("predefined"),
    aiContextEnabled: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("ai_context_enabled"),
    ),
    confidenceThreshold: Schema.optional(
      Schema.Literal("low", "medium", "high", "very_high"),
    ).pipe(T.JsonName("confidence_threshold")),
    contextAwareness: Schema.optional(Schema.Unknown).pipe(
      T.JsonName("context_awareness"),
    ),
    ocrEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("ocr_enabled")),
    openAccess: Schema.optional(Schema.Boolean).pipe(T.JsonName("open_access")),
  }),
  Schema.Struct({
    id: Schema.String,
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    entries: Schema.Array(
      Schema.Union(
        Schema.Struct({
          id: Schema.String,
          createdAt: Schema.String.pipe(T.JsonName("created_at")),
          enabled: Schema.Boolean,
          name: Schema.String,
          pattern: Schema.Unknown,
          type: Schema.Literal("custom"),
          updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
          profileId: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("profile_id")),
        }),
        Schema.Struct({
          id: Schema.String,
          confidence: Schema.Struct({
            aiContextAvailable: Schema.Boolean.pipe(
              T.JsonName("ai_context_available"),
            ),
            available: Schema.Boolean,
          }),
          enabled: Schema.Boolean,
          name: Schema.String,
          type: Schema.Literal("predefined"),
          profileId: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("profile_id")),
          variant: Schema.optional(
            Schema.Struct({
              topicType: Schema.Literal("Intent", "Content").pipe(
                T.JsonName("topic_type"),
              ),
              type: Schema.Literal("PromptTopic"),
              description: Schema.optional(
                Schema.Union(Schema.String, Schema.Null),
              ),
            }),
          ),
        }),
        Schema.Struct({
          id: Schema.String,
          createdAt: Schema.String.pipe(T.JsonName("created_at")),
          enabled: Schema.Boolean,
          name: Schema.String,
          type: Schema.Literal("integration"),
          updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
          profileId: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("profile_id")),
        }),
        Schema.Struct({
          id: Schema.String,
          caseSensitive: Schema.Boolean.pipe(T.JsonName("case_sensitive")),
          createdAt: Schema.String.pipe(T.JsonName("created_at")),
          enabled: Schema.Boolean,
          name: Schema.String,
          secret: Schema.Boolean,
          type: Schema.Literal("exact_data"),
          updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
        }),
        Schema.Struct({
          id: Schema.String,
          createdAt: Schema.String.pipe(T.JsonName("created_at")),
          enabled: Schema.Boolean,
          name: Schema.String,
          type: Schema.Literal("document_fingerprint"),
          updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
        }),
        Schema.Struct({
          id: Schema.String,
          createdAt: Schema.String.pipe(T.JsonName("created_at")),
          enabled: Schema.Boolean,
          name: Schema.String,
          type: Schema.Literal("word_list"),
          updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
          wordList: Schema.Unknown.pipe(T.JsonName("word_list")),
          profileId: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("profile_id")),
        }),
      ),
    ),
    name: Schema.String,
    type: Schema.Literal("integration"),
    updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
    description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
) as unknown as Schema.Schema<GetDlpProfileResponse>;

export const getDlpProfile: (
  input: GetDlpProfileRequest,
) => Effect.Effect<
  GetDlpProfileResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDlpProfileRequest,
  output: GetDlpProfileResponse,
  errors: [],
}));

// =============================================================================
// DlpProfileCustom
// =============================================================================

export interface GetDlpProfileCustomRequest {
  profileId: string;
  accountId: string;
}

export const GetDlpProfileCustomRequest = Schema.Struct({
  profileId: Schema.String.pipe(T.HttpPath("profileId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dlp/profiles/custom/{profileId}",
  }),
) as unknown as Schema.Schema<GetDlpProfileCustomRequest>;

export type GetDlpProfileCustomResponse = unknown;

export const GetDlpProfileCustomResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDlpProfileCustomResponse>;

export const getDlpProfileCustom: (
  input: GetDlpProfileCustomRequest,
) => Effect.Effect<
  GetDlpProfileCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDlpProfileCustomRequest,
  output: GetDlpProfileCustomResponse,
  errors: [],
}));

export interface CreateDlpProfileCustomRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  name: string;
  /** Body param: */
  aiContextEnabled?: boolean;
  /** Body param: Related DLP policies will trigger when the match count exceeds the number set. */
  allowedMatchCount?: number;
  /** Body param: */
  confidenceThreshold?: string | null;
  /** @deprecated Body param: Scan the context of predefined entries to only return matches surrounded by keywords. */
  contextAwareness?: unknown;
  /** Body param: The description of the profile. */
  description?: string | null;
  /** Body param: */
  entries?: (
    | { enabled: boolean; name: string; pattern: unknown }
    | { enabled: boolean; name: string; words: string[] }
  )[];
  /** Body param: */
  ocrEnabled?: boolean;
  /** Body param: Entries from other profiles (e.g. pre-defined Cloudflare profiles, or your Microsoft Information Protection profiles). */
  sharedEntries?: (
    | { enabled: boolean; entryId: string; entryType: "custom" }
    | { enabled: boolean; entryId: string; entryType: "predefined" }
    | { enabled: boolean; entryId: string; entryType: "integration" }
    | { enabled: boolean; entryId: string; entryType: "exact_data" }
    | { enabled: boolean; entryId: string; entryType: "document_fingerprint" }
  )[];
}

export const CreateDlpProfileCustomRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  aiContextEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("ai_context_enabled"),
  ),
  allowedMatchCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("allowed_match_count"),
  ),
  confidenceThreshold: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("confidence_threshold")),
  contextAwareness: Schema.optional(Schema.Unknown).pipe(
    T.JsonName("context_awareness"),
  ),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  entries: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          enabled: Schema.Boolean,
          name: Schema.String,
          pattern: Schema.Unknown,
        }),
        Schema.Struct({
          enabled: Schema.Boolean,
          name: Schema.String,
          words: Schema.Array(Schema.String),
        }),
      ),
    ),
  ),
  ocrEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("ocr_enabled")),
  sharedEntries: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          enabled: Schema.Boolean,
          entryId: Schema.String.pipe(T.JsonName("entry_id")),
          entryType: Schema.Literal("custom").pipe(T.JsonName("entry_type")),
        }),
        Schema.Struct({
          enabled: Schema.Boolean,
          entryId: Schema.String.pipe(T.JsonName("entry_id")),
          entryType: Schema.Literal("predefined").pipe(
            T.JsonName("entry_type"),
          ),
        }),
        Schema.Struct({
          enabled: Schema.Boolean,
          entryId: Schema.String.pipe(T.JsonName("entry_id")),
          entryType: Schema.Literal("integration").pipe(
            T.JsonName("entry_type"),
          ),
        }),
        Schema.Struct({
          enabled: Schema.Boolean,
          entryId: Schema.String.pipe(T.JsonName("entry_id")),
          entryType: Schema.Literal("exact_data").pipe(
            T.JsonName("entry_type"),
          ),
        }),
        Schema.Struct({
          enabled: Schema.Boolean,
          entryId: Schema.String.pipe(T.JsonName("entry_id")),
          entryType: Schema.Literal("document_fingerprint").pipe(
            T.JsonName("entry_type"),
          ),
        }),
      ),
    ),
  ).pipe(T.JsonName("shared_entries")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/dlp/profiles/custom",
  }),
) as unknown as Schema.Schema<CreateDlpProfileCustomRequest>;

export type CreateDlpProfileCustomResponse = unknown;

export const CreateDlpProfileCustomResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateDlpProfileCustomResponse>;

export const createDlpProfileCustom: (
  input: CreateDlpProfileCustomRequest,
) => Effect.Effect<
  CreateDlpProfileCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDlpProfileCustomRequest,
  output: CreateDlpProfileCustomResponse,
  errors: [],
}));

export interface UpdateDlpProfileCustomRequest {
  profileId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  name: string;
  /** Body param: */
  aiContextEnabled?: boolean;
  /** Body param: */
  allowedMatchCount?: number | null;
  /** Body param: */
  confidenceThreshold?: string | null;
  /** @deprecated Body param: Scan the context of predefined entries to only return matches surrounded by keywords. */
  contextAwareness?: unknown;
  /** Body param: The description of the profile. */
  description?: string | null;
  /** @deprecated Body param: Custom entries from this profile. If this field is omitted, entries owned by this profile will not be changed. */
  entries?:
    | (
        | { enabled: boolean; entryId: string; name: string; pattern: unknown }
        | { enabled: boolean; name: string; pattern: unknown }
      )[]
    | null;
  /** Body param: */
  ocrEnabled?: boolean;
  /** Body param: Other entries, e.g. predefined or integration. */
  sharedEntries?: (
    | { enabled: boolean; entryId: string; entryType: "predefined" }
    | { enabled: boolean; entryId: string; entryType: "integration" }
    | { enabled: boolean; entryId: string; entryType: "exact_data" }
    | { enabled: boolean; entryId: string; entryType: "document_fingerprint" }
  )[];
}

export const UpdateDlpProfileCustomRequest = Schema.Struct({
  profileId: Schema.String.pipe(T.HttpPath("profileId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  aiContextEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("ai_context_enabled"),
  ),
  allowedMatchCount: Schema.optional(
    Schema.Union(Schema.Number, Schema.Null),
  ).pipe(T.JsonName("allowed_match_count")),
  confidenceThreshold: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("confidence_threshold")),
  contextAwareness: Schema.optional(Schema.Unknown).pipe(
    T.JsonName("context_awareness"),
  ),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  entries: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.Boolean,
            entryId: Schema.String.pipe(T.JsonName("entry_id")),
            name: Schema.String,
            pattern: Schema.Unknown,
          }),
          Schema.Struct({
            enabled: Schema.Boolean,
            name: Schema.String,
            pattern: Schema.Unknown,
          }),
        ),
      ),
      Schema.Null,
    ),
  ),
  ocrEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("ocr_enabled")),
  sharedEntries: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          enabled: Schema.Boolean,
          entryId: Schema.String.pipe(T.JsonName("entry_id")),
          entryType: Schema.Literal("predefined").pipe(
            T.JsonName("entry_type"),
          ),
        }),
        Schema.Struct({
          enabled: Schema.Boolean,
          entryId: Schema.String.pipe(T.JsonName("entry_id")),
          entryType: Schema.Literal("integration").pipe(
            T.JsonName("entry_type"),
          ),
        }),
        Schema.Struct({
          enabled: Schema.Boolean,
          entryId: Schema.String.pipe(T.JsonName("entry_id")),
          entryType: Schema.Literal("exact_data").pipe(
            T.JsonName("entry_type"),
          ),
        }),
        Schema.Struct({
          enabled: Schema.Boolean,
          entryId: Schema.String.pipe(T.JsonName("entry_id")),
          entryType: Schema.Literal("document_fingerprint").pipe(
            T.JsonName("entry_type"),
          ),
        }),
      ),
    ),
  ).pipe(T.JsonName("shared_entries")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/dlp/profiles/custom/{profileId}",
  }),
) as unknown as Schema.Schema<UpdateDlpProfileCustomRequest>;

export type UpdateDlpProfileCustomResponse = unknown;

export const UpdateDlpProfileCustomResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateDlpProfileCustomResponse>;

export const updateDlpProfileCustom: (
  input: UpdateDlpProfileCustomRequest,
) => Effect.Effect<
  UpdateDlpProfileCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDlpProfileCustomRequest,
  output: UpdateDlpProfileCustomResponse,
  errors: [],
}));

export interface DeleteDlpProfileCustomRequest {
  profileId: string;
  accountId: string;
}

export const DeleteDlpProfileCustomRequest = Schema.Struct({
  profileId: Schema.String.pipe(T.HttpPath("profileId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/dlp/profiles/custom/{profileId}",
  }),
) as unknown as Schema.Schema<DeleteDlpProfileCustomRequest>;

export type DeleteDlpProfileCustomResponse = unknown;

export const DeleteDlpProfileCustomResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDlpProfileCustomResponse>;

export const deleteDlpProfileCustom: (
  input: DeleteDlpProfileCustomRequest,
) => Effect.Effect<
  DeleteDlpProfileCustomResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDlpProfileCustomRequest,
  output: DeleteDlpProfileCustomResponse,
  errors: [],
}));

// =============================================================================
// DlpProfilePredefined
// =============================================================================

export interface GetDlpProfilePredefinedRequest {
  profileId: string;
  accountId: string;
}

export const GetDlpProfilePredefinedRequest = Schema.Struct({
  profileId: Schema.String.pipe(T.HttpPath("profileId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dlp/profiles/predefined/{profileId}",
  }),
) as unknown as Schema.Schema<GetDlpProfilePredefinedRequest>;

export type GetDlpProfilePredefinedResponse = unknown;

export const GetDlpProfilePredefinedResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDlpProfilePredefinedResponse>;

export const getDlpProfilePredefined: (
  input: GetDlpProfilePredefinedRequest,
) => Effect.Effect<
  GetDlpProfilePredefinedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDlpProfilePredefinedRequest,
  output: GetDlpProfilePredefinedResponse,
  errors: [],
}));

export interface CreateDlpProfilePredefinedRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  profileId: string;
  /** Body param: */
  aiContextEnabled?: boolean;
  /** Body param: */
  allowedMatchCount?: number | null;
  /** Body param: */
  confidenceThreshold?: string | null;
  /** @deprecated Body param: Scan the context of predefined entries to only return matches surrounded by keywords. */
  contextAwareness?: unknown;
  /** @deprecated Body param: */
  entries?: { id: string; enabled: boolean }[];
  /** Body param: */
  ocrEnabled?: boolean;
}

export const CreateDlpProfilePredefinedRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  profileId: Schema.String.pipe(T.JsonName("profile_id")),
  aiContextEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("ai_context_enabled"),
  ),
  allowedMatchCount: Schema.optional(
    Schema.Union(Schema.Number, Schema.Null),
  ).pipe(T.JsonName("allowed_match_count")),
  confidenceThreshold: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("confidence_threshold")),
  contextAwareness: Schema.optional(Schema.Unknown).pipe(
    T.JsonName("context_awareness"),
  ),
  entries: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        enabled: Schema.Boolean,
      }),
    ),
  ),
  ocrEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("ocr_enabled")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/dlp/profiles/predefined",
  }),
) as unknown as Schema.Schema<CreateDlpProfilePredefinedRequest>;

export type CreateDlpProfilePredefinedResponse = unknown;

export const CreateDlpProfilePredefinedResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateDlpProfilePredefinedResponse>;

export const createDlpProfilePredefined: (
  input: CreateDlpProfilePredefinedRequest,
) => Effect.Effect<
  CreateDlpProfilePredefinedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDlpProfilePredefinedRequest,
  output: CreateDlpProfilePredefinedResponse,
  errors: [],
}));

export interface UpdateDlpProfilePredefinedRequest {
  profileId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  aiContextEnabled?: boolean;
  /** Body param: */
  allowedMatchCount?: number | null;
  /** Body param: */
  confidenceThreshold?: string | null;
  /** @deprecated Body param: Scan the context of predefined entries to only return matches surrounded by keywords. */
  contextAwareness?: unknown;
  /** @deprecated Body param: */
  entries?: { id: string; enabled: boolean }[];
  /** Body param: */
  ocrEnabled?: boolean;
}

export const UpdateDlpProfilePredefinedRequest = Schema.Struct({
  profileId: Schema.String.pipe(T.HttpPath("profileId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  aiContextEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("ai_context_enabled"),
  ),
  allowedMatchCount: Schema.optional(
    Schema.Union(Schema.Number, Schema.Null),
  ).pipe(T.JsonName("allowed_match_count")),
  confidenceThreshold: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("confidence_threshold")),
  contextAwareness: Schema.optional(Schema.Unknown).pipe(
    T.JsonName("context_awareness"),
  ),
  entries: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        enabled: Schema.Boolean,
      }),
    ),
  ),
  ocrEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("ocr_enabled")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/dlp/profiles/predefined/{profileId}",
  }),
) as unknown as Schema.Schema<UpdateDlpProfilePredefinedRequest>;

export type UpdateDlpProfilePredefinedResponse = unknown;

export const UpdateDlpProfilePredefinedResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateDlpProfilePredefinedResponse>;

export const updateDlpProfilePredefined: (
  input: UpdateDlpProfilePredefinedRequest,
) => Effect.Effect<
  UpdateDlpProfilePredefinedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDlpProfilePredefinedRequest,
  output: UpdateDlpProfilePredefinedResponse,
  errors: [],
}));

export interface DeleteDlpProfilePredefinedRequest {
  profileId: string;
  accountId: string;
}

export const DeleteDlpProfilePredefinedRequest = Schema.Struct({
  profileId: Schema.String.pipe(T.HttpPath("profileId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/dlp/profiles/predefined/{profileId}",
  }),
) as unknown as Schema.Schema<DeleteDlpProfilePredefinedRequest>;

export type DeleteDlpProfilePredefinedResponse = unknown;

export const DeleteDlpProfilePredefinedResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDlpProfilePredefinedResponse>;

export const deleteDlpProfilePredefined: (
  input: DeleteDlpProfilePredefinedRequest,
) => Effect.Effect<
  DeleteDlpProfilePredefinedResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDlpProfilePredefinedRequest,
  output: DeleteDlpProfilePredefinedResponse,
  errors: [],
}));

// =============================================================================
// ExpirationGatewayRule
// =============================================================================

export interface ResetExpirationGatewayRuleRequest {
  ruleId: string;
  accountId: string;
}

export const ResetExpirationGatewayRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/gateway/rules/{ruleId}/reset_expiration",
  }),
) as unknown as Schema.Schema<ResetExpirationGatewayRuleRequest>;

export interface ResetExpirationGatewayRuleResponse {
  /** Specify the action to perform when the associated traffic, identity, and device posture expressions either absent or evaluate to `true`. */
  action:
    | "on"
    | "off"
    | "allow"
    | "block"
    | "scan"
    | "noscan"
    | "safesearch"
    | "ytrestricted"
    | "isolate"
    | "noisolate"
    | "override"
    | "l4_override"
    | "egress"
    | "resolve"
    | "quarantine"
    | "redirect";
  /** Specify whether the rule is enabled. */
  enabled: boolean;
  /** Specify the protocol or layer to evaluate the traffic, identity, and device posture expressions. */
  filters: ("http" | "dns" | "l4" | "egress" | "dns_resolver")[];
  /** Specify the rule name. */
  name: string;
  /** Set the order of your rules. Lower values indicate higher precedence. At each processing phase, evaluate applicable rules in ascending order of this value. Refer to [Order of enforcement](http://devel */
  precedence: number;
  /** Specify the wirefilter expression used for traffic matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expression */
  traffic: string;
  /** Identify the API resource with a UUID. */
  id?: string;
  createdAt?: string;
  /** Indicate the date of deletion, if any. */
  deletedAt?: string | null;
  /** Specify the rule description. */
  description?: string;
  /** Specify the wirefilter expression used for device posture check. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expres */
  devicePosture?: string;
  /** Defines the expiration time stamp and default duration of a DNS policy. Takes precedence over the policy's `schedule` configuration, if any. This does not apply to HTTP or network policies. Settable o */
  expiration?: {
    expiresAt: string;
    duration?: number;
    expired?: boolean;
  } | null;
  /** Specify the wirefilter expression used for identity matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expressio */
  identity?: string;
  /** Indicate that this rule is shared via the Orgs API and read only. */
  readOnly?: boolean;
  /** Set settings related to this rule. Each setting is only valid for specific rule types and can only be used with the appropriate selectors. If Terraform drift is observed in these setting values, verif */
  ruleSettings?: {
    addHeaders?: Record<string, unknown> | null;
    allowChildBypass?: boolean | null;
    auditSsh?: { commandLogging?: boolean } | null;
    bisoAdminControls?: {
      copy?: "enabled" | "disabled" | "remote_only";
      dcp?: boolean;
      dd?: boolean;
      dk?: boolean;
      download?: "enabled" | "disabled" | "remote_only";
      dp?: boolean;
      du?: boolean;
      keyboard?: "enabled" | "disabled";
      paste?: "enabled" | "disabled" | "remote_only";
      printing?: "enabled" | "disabled";
      upload?: "enabled" | "disabled";
      version?: "v1" | "v2";
    };
    blockPage?: { targetUri: string; includeContext?: boolean } | null;
    blockPageEnabled?: boolean;
    blockReason?: string | null;
    bypassParentRule?: boolean | null;
    checkSession?: { duration?: string; enforce?: boolean } | null;
    dnsResolvers?: { ipv4?: unknown[]; ipv6?: unknown[] } | null;
    egress?: { ipv4?: string; ipv4Fallback?: string; ipv6?: string } | null;
    ignoreCnameCategoryMatches?: boolean;
    insecureDisableDnssecValidation?: boolean;
    ipCategories?: boolean;
    ipIndicatorFeeds?: boolean;
    l4override?: { ip?: string; port?: number } | null;
    notificationSettings?: {
      enabled?: boolean;
      includeContext?: boolean;
      msg?: string;
      supportUrl?: string;
    } | null;
    overrideHost?: string;
    overrideIps?: string[] | null;
    payloadLog?: { enabled?: boolean } | null;
    quarantine?: {
      fileTypes?: (
        | "exe"
        | "pdf"
        | "doc"
        | "docm"
        | "docx"
        | "rtf"
        | "ppt"
        | "pptx"
        | "xls"
        | "xlsm"
        | "xlsx"
        | "zip"
        | "rar"
      )[];
    } | null;
    redirect?: {
      targetUri: string;
      includeContext?: boolean;
      preservePathAndQuery?: boolean;
    } | null;
    resolveDnsInternally?: {
      fallback?: "none" | "public_dns";
      viewId?: string;
    } | null;
    resolveDnsThroughCloudflare?: boolean | null;
    untrustedCert?: { action?: "pass_through" | "block" | "error" } | null;
  };
  /** Defines the schedule for activating DNS policies. Settable only for `dns` and `dns_resolver` rules. */
  schedule?: {
    fri?: string;
    mon?: string;
    sat?: string;
    sun?: string;
    thu?: string;
    timeZone?: string;
    tue?: string;
    wed?: string;
  } | null;
  /** Indicate that this rule is sharable via the Orgs API. */
  sharable?: boolean;
  /** Provide the account tag of the account that created the rule. */
  sourceAccount?: string;
  updatedAt?: string;
  /** Indicate the version number of the rule(read-only). */
  version?: number;
  /** Indicate a warning for a misconfigured rule, if any. */
  warningStatus?: string | null;
}

export const ResetExpirationGatewayRuleResponse = Schema.Struct({
  action: Schema.Literal(
    "on",
    "off",
    "allow",
    "block",
    "scan",
    "noscan",
    "safesearch",
    "ytrestricted",
    "isolate",
    "noisolate",
    "override",
    "l4_override",
    "egress",
    "resolve",
    "quarantine",
    "redirect",
  ),
  enabled: Schema.Boolean,
  filters: Schema.Array(
    Schema.Literal("http", "dns", "l4", "egress", "dns_resolver"),
  ),
  name: Schema.String,
  precedence: Schema.Number,
  traffic: Schema.String,
  id: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("deleted_at"),
  ),
  description: Schema.optional(Schema.String),
  devicePosture: Schema.optional(Schema.String).pipe(
    T.JsonName("device_posture"),
  ),
  expiration: Schema.optional(
    Schema.Union(
      Schema.Struct({
        expiresAt: Schema.String.pipe(T.JsonName("expires_at")),
        duration: Schema.optional(Schema.Number),
        expired: Schema.optional(Schema.Boolean),
      }),
      Schema.Null,
    ),
  ),
  identity: Schema.optional(Schema.String),
  readOnly: Schema.optional(Schema.Boolean).pipe(T.JsonName("read_only")),
  ruleSettings: Schema.optional(
    Schema.Struct({
      addHeaders: Schema.optional(
        Schema.Union(Schema.Struct({}), Schema.Null),
      ).pipe(T.JsonName("add_headers")),
      allowChildBypass: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("allow_child_bypass")),
      auditSsh: Schema.optional(
        Schema.Union(
          Schema.Struct({
            commandLogging: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("command_logging"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("audit_ssh")),
      bisoAdminControls: Schema.optional(
        Schema.Struct({
          copy: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dcp: Schema.optional(Schema.Boolean),
          dd: Schema.optional(Schema.Boolean),
          dk: Schema.optional(Schema.Boolean),
          download: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dp: Schema.optional(Schema.Boolean),
          du: Schema.optional(Schema.Boolean),
          keyboard: Schema.optional(Schema.Literal("enabled", "disabled")),
          paste: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          printing: Schema.optional(Schema.Literal("enabled", "disabled")),
          upload: Schema.optional(Schema.Literal("enabled", "disabled")),
          version: Schema.optional(Schema.Literal("v1", "v2")),
        }),
      ).pipe(T.JsonName("biso_admin_controls")),
      blockPage: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("block_page")),
      blockPageEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("block_page_enabled"),
      ),
      blockReason: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("block_reason")),
      bypassParentRule: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("bypass_parent_rule")),
      checkSession: Schema.optional(
        Schema.Union(
          Schema.Struct({
            duration: Schema.optional(Schema.String),
            enforce: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("check_session")),
      dnsResolvers: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.Array(Schema.Unknown)),
            ipv6: Schema.optional(Schema.Array(Schema.Unknown)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("dns_resolvers")),
      egress: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.String),
            ipv4Fallback: Schema.optional(Schema.String).pipe(
              T.JsonName("ipv4_fallback"),
            ),
            ipv6: Schema.optional(Schema.String),
          }),
          Schema.Null,
        ),
      ),
      ignoreCnameCategoryMatches: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ignore_cname_category_matches"),
      ),
      insecureDisableDnssecValidation: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("insecure_disable_dnssec_validation"),
      ),
      ipCategories: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_categories"),
      ),
      ipIndicatorFeeds: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_indicator_feeds"),
      ),
      l4override: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ip: Schema.optional(Schema.String),
            port: Schema.optional(Schema.Number),
          }),
          Schema.Null,
        ),
      ),
      notificationSettings: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            msg: Schema.optional(Schema.String),
            supportUrl: Schema.optional(Schema.String).pipe(
              T.JsonName("support_url"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("notification_settings")),
      overrideHost: Schema.optional(Schema.String).pipe(
        T.JsonName("override_host"),
      ),
      overrideIps: Schema.optional(
        Schema.Union(Schema.Array(Schema.String), Schema.Null),
      ).pipe(T.JsonName("override_ips")),
      payloadLog: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("payload_log")),
      quarantine: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fileTypes: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "exe",
                  "pdf",
                  "doc",
                  "docm",
                  "docx",
                  "rtf",
                  "ppt",
                  "pptx",
                  "xls",
                  "xlsm",
                  "xlsx",
                  "zip",
                  "rar",
                ),
              ),
            ).pipe(T.JsonName("file_types")),
          }),
          Schema.Null,
        ),
      ),
      redirect: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            preservePathAndQuery: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("preserve_path_and_query"),
            ),
          }),
          Schema.Null,
        ),
      ),
      resolveDnsInternally: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fallback: Schema.optional(Schema.Literal("none", "public_dns")),
            viewId: Schema.optional(Schema.String).pipe(T.JsonName("view_id")),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("resolve_dns_internally")),
      resolveDnsThroughCloudflare: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("resolve_dns_through_cloudflare")),
      untrustedCert: Schema.optional(
        Schema.Union(
          Schema.Struct({
            action: Schema.optional(
              Schema.Literal("pass_through", "block", "error"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("untrusted_cert")),
    }),
  ).pipe(T.JsonName("rule_settings")),
  schedule: Schema.optional(
    Schema.Union(
      Schema.Struct({
        fri: Schema.optional(Schema.String),
        mon: Schema.optional(Schema.String),
        sat: Schema.optional(Schema.String),
        sun: Schema.optional(Schema.String),
        thu: Schema.optional(Schema.String),
        timeZone: Schema.optional(Schema.String).pipe(T.JsonName("time_zone")),
        tue: Schema.optional(Schema.String),
        wed: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ),
  sharable: Schema.optional(Schema.Boolean),
  sourceAccount: Schema.optional(Schema.String).pipe(
    T.JsonName("source_account"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  version: Schema.optional(Schema.Number),
  warningStatus: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("warning_status"),
  ),
}) as unknown as Schema.Schema<ResetExpirationGatewayRuleResponse>;

export const resetExpirationGatewayRule: (
  input: ResetExpirationGatewayRuleRequest,
) => Effect.Effect<
  ResetExpirationGatewayRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ResetExpirationGatewayRuleRequest,
  output: ResetExpirationGatewayRuleResponse,
  errors: [],
}));

// =============================================================================
// Gateway
// =============================================================================

export interface ListGatewaysRequest {
  accountId: string;
}

export const ListGatewaysRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/gateway" }),
) as unknown as Schema.Schema<ListGatewaysRequest>;

export interface ListGatewaysResponse {
  /** Specify the Cloudflare account ID. */
  id?: string;
  /** Specify the gateway internal ID. */
  gatewayTag?: string;
  /** Specify the provider name (usually Cloudflare). */
  providerName?: string;
}

export const ListGatewaysResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  gatewayTag: Schema.optional(Schema.String).pipe(T.JsonName("gateway_tag")),
  providerName: Schema.optional(Schema.String).pipe(
    T.JsonName("provider_name"),
  ),
}) as unknown as Schema.Schema<ListGatewaysResponse>;

export const listGateways: (
  input: ListGatewaysRequest,
) => Effect.Effect<
  ListGatewaysResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListGatewaysRequest,
  output: ListGatewaysResponse,
  errors: [],
}));

export interface CreateGatewayRequest {
  accountId: string;
}

export const CreateGatewayRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/gateway" }),
) as unknown as Schema.Schema<CreateGatewayRequest>;

export interface CreateGatewayResponse {
  /** Specify the Cloudflare account ID. */
  id?: string;
  /** Specify the gateway internal ID. */
  gatewayTag?: string;
  /** Specify the provider name (usually Cloudflare). */
  providerName?: string;
}

export const CreateGatewayResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  gatewayTag: Schema.optional(Schema.String).pipe(T.JsonName("gateway_tag")),
  providerName: Schema.optional(Schema.String).pipe(
    T.JsonName("provider_name"),
  ),
}) as unknown as Schema.Schema<CreateGatewayResponse>;

export const createGateway: (
  input: CreateGatewayRequest,
) => Effect.Effect<
  CreateGatewayResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateGatewayRequest,
  output: CreateGatewayResponse,
  errors: [],
}));

// =============================================================================
// GatewayAuditSshSetting
// =============================================================================

export interface GetGatewayAuditSshSettingRequest {
  accountId: string;
}

export const GetGatewayAuditSshSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/gateway/audit_ssh_settings",
  }),
) as unknown as Schema.Schema<GetGatewayAuditSshSettingRequest>;

export interface GetGatewayAuditSshSettingResponse {
  createdAt?: string;
  /** Provide the Base64-encoded HPKE public key that encrypts SSH session logs. See https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/use-cases/ssh/ssh-infrastructure-access/#en */
  publicKey?: string;
  /** Identify the seed ID. */
  seedId?: string;
  updatedAt?: string;
}

export const GetGatewayAuditSshSettingResponse = Schema.Struct({
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  publicKey: Schema.optional(Schema.String).pipe(T.JsonName("public_key")),
  seedId: Schema.optional(Schema.String).pipe(T.JsonName("seed_id")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<GetGatewayAuditSshSettingResponse>;

export const getGatewayAuditSshSetting: (
  input: GetGatewayAuditSshSettingRequest,
) => Effect.Effect<
  GetGatewayAuditSshSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetGatewayAuditSshSettingRequest,
  output: GetGatewayAuditSshSettingResponse,
  errors: [],
}));

export interface PutGatewayAuditSshSettingRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Provide the Base64-encoded HPKE public key that encrypts SSH session logs. See https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/use-cases/ssh/ssh-infrastructur */
  publicKey: string;
}

export const PutGatewayAuditSshSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  publicKey: Schema.String.pipe(T.JsonName("public_key")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/gateway/audit_ssh_settings",
  }),
) as unknown as Schema.Schema<PutGatewayAuditSshSettingRequest>;

export interface PutGatewayAuditSshSettingResponse {
  createdAt?: string;
  /** Provide the Base64-encoded HPKE public key that encrypts SSH session logs. See https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/use-cases/ssh/ssh-infrastructure-access/#en */
  publicKey?: string;
  /** Identify the seed ID. */
  seedId?: string;
  updatedAt?: string;
}

export const PutGatewayAuditSshSettingResponse = Schema.Struct({
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  publicKey: Schema.optional(Schema.String).pipe(T.JsonName("public_key")),
  seedId: Schema.optional(Schema.String).pipe(T.JsonName("seed_id")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<PutGatewayAuditSshSettingResponse>;

export const putGatewayAuditSshSetting: (
  input: PutGatewayAuditSshSettingRequest,
) => Effect.Effect<
  PutGatewayAuditSshSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutGatewayAuditSshSettingRequest,
  output: PutGatewayAuditSshSettingResponse,
  errors: [],
}));

// =============================================================================
// GatewayCertificate
// =============================================================================

export interface GetGatewayCertificateRequest {
  certificateId: string;
  accountId: string;
}

export const GetGatewayCertificateRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/gateway/certificates/{certificateId}",
  }),
) as unknown as Schema.Schema<GetGatewayCertificateRequest>;

export interface GetGatewayCertificateResponse {
  /** Identify the certificate with a UUID. */
  id?: string;
  /** Indicate the read-only deployment status of the certificate on Cloudflare's edge. Gateway TLS interception can use certificates in the 'available' (previously called 'active') state. */
  bindingStatus?:
    | "pending_deployment"
    | "available"
    | "pending_deletion"
    | "inactive";
  /** Provide the CA certificate (read-only). */
  certificate?: string;
  createdAt?: string;
  expiresOn?: string;
  /** Provide the SHA256 fingerprint of the certificate (read-only). */
  fingerprint?: string;
  /** Indicate whether Gateway TLS interception uses this certificate (read-only). You cannot set this value directly. To configure interception, use the Gateway configuration setting named `certificate` (r */
  inUse?: boolean;
  /** Indicate the organization that issued the certificate (read-only). */
  issuerOrg?: string;
  /** Provide the entire issuer field of the certificate (read-only). */
  issuerRaw?: string;
  /** Indicate the read-only certificate type, BYO-PKI (custom) or Gateway-managed. */
  type?: "custom" | "gateway_managed";
  updatedAt?: string;
  uploadedOn?: string;
}

export const GetGatewayCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  bindingStatus: Schema.optional(
    Schema.Literal(
      "pending_deployment",
      "available",
      "pending_deletion",
      "inactive",
    ),
  ).pipe(T.JsonName("binding_status")),
  certificate: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprint: Schema.optional(Schema.String),
  inUse: Schema.optional(Schema.Boolean).pipe(T.JsonName("in_use")),
  issuerOrg: Schema.optional(Schema.String).pipe(T.JsonName("issuer_org")),
  issuerRaw: Schema.optional(Schema.String).pipe(T.JsonName("issuer_raw")),
  type: Schema.optional(Schema.Literal("custom", "gateway_managed")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
}) as unknown as Schema.Schema<GetGatewayCertificateResponse>;

export const getGatewayCertificate: (
  input: GetGatewayCertificateRequest,
) => Effect.Effect<
  GetGatewayCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetGatewayCertificateRequest,
  output: GetGatewayCertificateResponse,
  errors: [],
}));

export interface CreateGatewayCertificateRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Sets the certificate validity period in days (range: 1-10,950 days / ~30 years). Defaults to 1,825 days (5 years).  Important  : This field is only settable during the certificate creation */
  validityPeriodDays?: number;
}

export const CreateGatewayCertificateRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  validityPeriodDays: Schema.optional(Schema.Number).pipe(
    T.JsonName("validity_period_days"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/gateway/certificates",
  }),
) as unknown as Schema.Schema<CreateGatewayCertificateRequest>;

export interface CreateGatewayCertificateResponse {
  /** Identify the certificate with a UUID. */
  id?: string;
  /** Indicate the read-only deployment status of the certificate on Cloudflare's edge. Gateway TLS interception can use certificates in the 'available' (previously called 'active') state. */
  bindingStatus?:
    | "pending_deployment"
    | "available"
    | "pending_deletion"
    | "inactive";
  /** Provide the CA certificate (read-only). */
  certificate?: string;
  createdAt?: string;
  expiresOn?: string;
  /** Provide the SHA256 fingerprint of the certificate (read-only). */
  fingerprint?: string;
  /** Indicate whether Gateway TLS interception uses this certificate (read-only). You cannot set this value directly. To configure interception, use the Gateway configuration setting named `certificate` (r */
  inUse?: boolean;
  /** Indicate the organization that issued the certificate (read-only). */
  issuerOrg?: string;
  /** Provide the entire issuer field of the certificate (read-only). */
  issuerRaw?: string;
  /** Indicate the read-only certificate type, BYO-PKI (custom) or Gateway-managed. */
  type?: "custom" | "gateway_managed";
  updatedAt?: string;
  uploadedOn?: string;
}

export const CreateGatewayCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  bindingStatus: Schema.optional(
    Schema.Literal(
      "pending_deployment",
      "available",
      "pending_deletion",
      "inactive",
    ),
  ).pipe(T.JsonName("binding_status")),
  certificate: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprint: Schema.optional(Schema.String),
  inUse: Schema.optional(Schema.Boolean).pipe(T.JsonName("in_use")),
  issuerOrg: Schema.optional(Schema.String).pipe(T.JsonName("issuer_org")),
  issuerRaw: Schema.optional(Schema.String).pipe(T.JsonName("issuer_raw")),
  type: Schema.optional(Schema.Literal("custom", "gateway_managed")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
}) as unknown as Schema.Schema<CreateGatewayCertificateResponse>;

export const createGatewayCertificate: (
  input: CreateGatewayCertificateRequest,
) => Effect.Effect<
  CreateGatewayCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateGatewayCertificateRequest,
  output: CreateGatewayCertificateResponse,
  errors: [],
}));

export interface DeleteGatewayCertificateRequest {
  certificateId: string;
  accountId: string;
}

export const DeleteGatewayCertificateRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/gateway/certificates/{certificateId}",
  }),
) as unknown as Schema.Schema<DeleteGatewayCertificateRequest>;

export interface DeleteGatewayCertificateResponse {
  /** Identify the certificate with a UUID. */
  id?: string;
  /** Indicate the read-only deployment status of the certificate on Cloudflare's edge. Gateway TLS interception can use certificates in the 'available' (previously called 'active') state. */
  bindingStatus?:
    | "pending_deployment"
    | "available"
    | "pending_deletion"
    | "inactive";
  /** Provide the CA certificate (read-only). */
  certificate?: string;
  createdAt?: string;
  expiresOn?: string;
  /** Provide the SHA256 fingerprint of the certificate (read-only). */
  fingerprint?: string;
  /** Indicate whether Gateway TLS interception uses this certificate (read-only). You cannot set this value directly. To configure interception, use the Gateway configuration setting named `certificate` (r */
  inUse?: boolean;
  /** Indicate the organization that issued the certificate (read-only). */
  issuerOrg?: string;
  /** Provide the entire issuer field of the certificate (read-only). */
  issuerRaw?: string;
  /** Indicate the read-only certificate type, BYO-PKI (custom) or Gateway-managed. */
  type?: "custom" | "gateway_managed";
  updatedAt?: string;
  uploadedOn?: string;
}

export const DeleteGatewayCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  bindingStatus: Schema.optional(
    Schema.Literal(
      "pending_deployment",
      "available",
      "pending_deletion",
      "inactive",
    ),
  ).pipe(T.JsonName("binding_status")),
  certificate: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprint: Schema.optional(Schema.String),
  inUse: Schema.optional(Schema.Boolean).pipe(T.JsonName("in_use")),
  issuerOrg: Schema.optional(Schema.String).pipe(T.JsonName("issuer_org")),
  issuerRaw: Schema.optional(Schema.String).pipe(T.JsonName("issuer_raw")),
  type: Schema.optional(Schema.Literal("custom", "gateway_managed")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
}) as unknown as Schema.Schema<DeleteGatewayCertificateResponse>;

export const deleteGatewayCertificate: (
  input: DeleteGatewayCertificateRequest,
) => Effect.Effect<
  DeleteGatewayCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteGatewayCertificateRequest,
  output: DeleteGatewayCertificateResponse,
  errors: [],
}));

export interface ActivateGatewayCertificateRequest {
  certificateId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const ActivateGatewayCertificateRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/gateway/certificates/{certificateId}/activate",
  }),
) as unknown as Schema.Schema<ActivateGatewayCertificateRequest>;

export interface ActivateGatewayCertificateResponse {
  /** Identify the certificate with a UUID. */
  id?: string;
  /** Indicate the read-only deployment status of the certificate on Cloudflare's edge. Gateway TLS interception can use certificates in the 'available' (previously called 'active') state. */
  bindingStatus?:
    | "pending_deployment"
    | "available"
    | "pending_deletion"
    | "inactive";
  /** Provide the CA certificate (read-only). */
  certificate?: string;
  createdAt?: string;
  expiresOn?: string;
  /** Provide the SHA256 fingerprint of the certificate (read-only). */
  fingerprint?: string;
  /** Indicate whether Gateway TLS interception uses this certificate (read-only). You cannot set this value directly. To configure interception, use the Gateway configuration setting named `certificate` (r */
  inUse?: boolean;
  /** Indicate the organization that issued the certificate (read-only). */
  issuerOrg?: string;
  /** Provide the entire issuer field of the certificate (read-only). */
  issuerRaw?: string;
  /** Indicate the read-only certificate type, BYO-PKI (custom) or Gateway-managed. */
  type?: "custom" | "gateway_managed";
  updatedAt?: string;
  uploadedOn?: string;
}

export const ActivateGatewayCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  bindingStatus: Schema.optional(
    Schema.Literal(
      "pending_deployment",
      "available",
      "pending_deletion",
      "inactive",
    ),
  ).pipe(T.JsonName("binding_status")),
  certificate: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprint: Schema.optional(Schema.String),
  inUse: Schema.optional(Schema.Boolean).pipe(T.JsonName("in_use")),
  issuerOrg: Schema.optional(Schema.String).pipe(T.JsonName("issuer_org")),
  issuerRaw: Schema.optional(Schema.String).pipe(T.JsonName("issuer_raw")),
  type: Schema.optional(Schema.Literal("custom", "gateway_managed")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
}) as unknown as Schema.Schema<ActivateGatewayCertificateResponse>;

export const activateGatewayCertificate: (
  input: ActivateGatewayCertificateRequest,
) => Effect.Effect<
  ActivateGatewayCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ActivateGatewayCertificateRequest,
  output: ActivateGatewayCertificateResponse,
  errors: [],
}));

export interface DeactivateGatewayCertificateRequest {
  certificateId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const DeactivateGatewayCertificateRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/gateway/certificates/{certificateId}/deactivate",
  }),
) as unknown as Schema.Schema<DeactivateGatewayCertificateRequest>;

export interface DeactivateGatewayCertificateResponse {
  /** Identify the certificate with a UUID. */
  id?: string;
  /** Indicate the read-only deployment status of the certificate on Cloudflare's edge. Gateway TLS interception can use certificates in the 'available' (previously called 'active') state. */
  bindingStatus?:
    | "pending_deployment"
    | "available"
    | "pending_deletion"
    | "inactive";
  /** Provide the CA certificate (read-only). */
  certificate?: string;
  createdAt?: string;
  expiresOn?: string;
  /** Provide the SHA256 fingerprint of the certificate (read-only). */
  fingerprint?: string;
  /** Indicate whether Gateway TLS interception uses this certificate (read-only). You cannot set this value directly. To configure interception, use the Gateway configuration setting named `certificate` (r */
  inUse?: boolean;
  /** Indicate the organization that issued the certificate (read-only). */
  issuerOrg?: string;
  /** Provide the entire issuer field of the certificate (read-only). */
  issuerRaw?: string;
  /** Indicate the read-only certificate type, BYO-PKI (custom) or Gateway-managed. */
  type?: "custom" | "gateway_managed";
  updatedAt?: string;
  uploadedOn?: string;
}

export const DeactivateGatewayCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  bindingStatus: Schema.optional(
    Schema.Literal(
      "pending_deployment",
      "available",
      "pending_deletion",
      "inactive",
    ),
  ).pipe(T.JsonName("binding_status")),
  certificate: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprint: Schema.optional(Schema.String),
  inUse: Schema.optional(Schema.Boolean).pipe(T.JsonName("in_use")),
  issuerOrg: Schema.optional(Schema.String).pipe(T.JsonName("issuer_org")),
  issuerRaw: Schema.optional(Schema.String).pipe(T.JsonName("issuer_raw")),
  type: Schema.optional(Schema.Literal("custom", "gateway_managed")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
}) as unknown as Schema.Schema<DeactivateGatewayCertificateResponse>;

export const deactivateGatewayCertificate: (
  input: DeactivateGatewayCertificateRequest,
) => Effect.Effect<
  DeactivateGatewayCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeactivateGatewayCertificateRequest,
  output: DeactivateGatewayCertificateResponse,
  errors: [],
}));

// =============================================================================
// GatewayConfiguration
// =============================================================================

export interface GetGatewayConfigurationRequest {
  accountId: string;
}

export const GetGatewayConfigurationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/gateway/configuration",
  }),
) as unknown as Schema.Schema<GetGatewayConfigurationRequest>;

export interface GetGatewayConfigurationResponse {
  createdAt?: string;
  /** Specify account settings. */
  settings?: {
    activityLog?: { enabled?: boolean | null } | null;
    antivirus?: {
      enabledDownloadPhase?: boolean | null;
      enabledUploadPhase?: boolean | null;
      failClosed?: boolean | null;
      notificationSettings?: {
        enabled?: boolean;
        includeContext?: boolean;
        msg?: string;
        supportUrl?: string;
      } | null;
    } | null;
    blockPage?: {
      backgroundColor?: string;
      enabled?: boolean | null;
      footerText?: string;
      headerText?: string;
      includeContext?: boolean;
      logoPath?: string;
      mailtoAddress?: string;
      mailtoSubject?: string;
      mode?: "" | "customized_block_page" | "redirect_uri";
      name?: string;
      readOnly?: boolean | null;
      sourceAccount?: string | null;
      suppressFooter?: boolean;
      targetUri?: string;
      version?: number | null;
    } | null;
    bodyScanning?: { inspectionMode?: "deep" | "shallow" } | null;
    browserIsolation?: {
      nonIdentityEnabled?: boolean;
      urlBrowserIsolationEnabled?: boolean;
    } | null;
    certificate?: { id: string } | null;
    customCertificate?: {
      enabled: boolean | null;
      id?: string;
      bindingStatus?: string;
      updatedAt?: string;
    } | null;
    extendedEmailMatching?: {
      enabled?: boolean | null;
      readOnly?: boolean;
      sourceAccount?: string;
      version?: number;
    } | null;
    fips?: { tls?: boolean } | null;
    hostSelector?: { enabled?: boolean | null } | null;
    inspection?: { mode?: "static" | "dynamic" } | null;
    protocolDetection?: { enabled?: boolean | null } | null;
    sandbox?: {
      enabled?: boolean | null;
      fallbackAction?: "allow" | "block";
    } | null;
    tlsDecrypt?: { enabled?: boolean } | null;
  };
  updatedAt?: string;
}

export const GetGatewayConfigurationResponse = Schema.Struct({
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  settings: Schema.optional(
    Schema.Struct({
      activityLog: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("activity_log")),
      antivirus: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabledDownloadPhase: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("enabled_download_phase")),
            enabledUploadPhase: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("enabled_upload_phase")),
            failClosed: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("fail_closed")),
            notificationSettings: Schema.optional(
              Schema.Union(
                Schema.Struct({
                  enabled: Schema.optional(Schema.Boolean),
                  includeContext: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("include_context"),
                  ),
                  msg: Schema.optional(Schema.String),
                  supportUrl: Schema.optional(Schema.String).pipe(
                    T.JsonName("support_url"),
                  ),
                }),
                Schema.Null,
              ),
            ).pipe(T.JsonName("notification_settings")),
          }),
          Schema.Null,
        ),
      ),
      blockPage: Schema.optional(
        Schema.Union(
          Schema.Struct({
            backgroundColor: Schema.optional(Schema.String).pipe(
              T.JsonName("background_color"),
            ),
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            footerText: Schema.optional(Schema.String).pipe(
              T.JsonName("footer_text"),
            ),
            headerText: Schema.optional(Schema.String).pipe(
              T.JsonName("header_text"),
            ),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            logoPath: Schema.optional(Schema.String).pipe(
              T.JsonName("logo_path"),
            ),
            mailtoAddress: Schema.optional(Schema.String).pipe(
              T.JsonName("mailto_address"),
            ),
            mailtoSubject: Schema.optional(Schema.String).pipe(
              T.JsonName("mailto_subject"),
            ),
            mode: Schema.optional(
              Schema.Literal("", "customized_block_page", "redirect_uri"),
            ),
            name: Schema.optional(Schema.String),
            readOnly: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("read_only")),
            sourceAccount: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("source_account")),
            suppressFooter: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("suppress_footer"),
            ),
            targetUri: Schema.optional(Schema.String).pipe(
              T.JsonName("target_uri"),
            ),
            version: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("block_page")),
      bodyScanning: Schema.optional(
        Schema.Union(
          Schema.Struct({
            inspectionMode: Schema.optional(
              Schema.Literal("deep", "shallow"),
            ).pipe(T.JsonName("inspection_mode")),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("body_scanning")),
      browserIsolation: Schema.optional(
        Schema.Union(
          Schema.Struct({
            nonIdentityEnabled: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("non_identity_enabled"),
            ),
            urlBrowserIsolationEnabled: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("url_browser_isolation_enabled"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("browser_isolation")),
      certificate: Schema.optional(
        Schema.Union(
          Schema.Struct({
            id: Schema.String,
          }),
          Schema.Null,
        ),
      ),
      customCertificate: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.Union(Schema.Boolean, Schema.Null),
            id: Schema.optional(Schema.String),
            bindingStatus: Schema.optional(Schema.String).pipe(
              T.JsonName("binding_status"),
            ),
            updatedAt: Schema.optional(Schema.String).pipe(
              T.JsonName("updated_at"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("custom_certificate")),
      extendedEmailMatching: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            readOnly: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("read_only"),
            ),
            sourceAccount: Schema.optional(Schema.String).pipe(
              T.JsonName("source_account"),
            ),
            version: Schema.optional(Schema.Number),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("extended_email_matching")),
      fips: Schema.optional(
        Schema.Union(
          Schema.Struct({
            tls: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ),
      hostSelector: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("host_selector")),
      inspection: Schema.optional(
        Schema.Union(
          Schema.Struct({
            mode: Schema.optional(Schema.Literal("static", "dynamic")),
          }),
          Schema.Null,
        ),
      ),
      protocolDetection: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("protocol_detection")),
      sandbox: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            fallbackAction: Schema.optional(
              Schema.Literal("allow", "block"),
            ).pipe(T.JsonName("fallback_action")),
          }),
          Schema.Null,
        ),
      ),
      tlsDecrypt: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("tls_decrypt")),
    }),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<GetGatewayConfigurationResponse>;

export const getGatewayConfiguration: (
  input: GetGatewayConfigurationRequest,
) => Effect.Effect<
  GetGatewayConfigurationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetGatewayConfigurationRequest,
  output: GetGatewayConfigurationResponse,
  errors: [],
}));

export interface PutGatewayConfigurationRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Specify account settings. */
  settings?: {
    activityLog?: { enabled?: boolean | null } | null;
    antivirus?: {
      enabledDownloadPhase?: boolean | null;
      enabledUploadPhase?: boolean | null;
      failClosed?: boolean | null;
      notificationSettings?: {
        enabled?: boolean;
        includeContext?: boolean;
        msg?: string;
        supportUrl?: string;
      } | null;
    } | null;
    blockPage?: {
      backgroundColor?: string;
      enabled?: boolean | null;
      footerText?: string;
      headerText?: string;
      includeContext?: boolean;
      logoPath?: string;
      mailtoAddress?: string;
      mailtoSubject?: string;
      mode?: "" | "customized_block_page" | "redirect_uri";
      name?: string;
      suppressFooter?: boolean;
      targetUri?: string;
    } | null;
    bodyScanning?: { inspectionMode?: "deep" | "shallow" } | null;
    browserIsolation?: {
      nonIdentityEnabled?: boolean;
      urlBrowserIsolationEnabled?: boolean;
    } | null;
    certificate?: { id: string } | null;
    customCertificate?: { enabled: boolean | null; id?: string } | null;
    extendedEmailMatching?: { enabled?: boolean | null } | null;
    fips?: { tls?: boolean } | null;
    hostSelector?: { enabled?: boolean | null } | null;
    inspection?: { mode?: "static" | "dynamic" } | null;
    protocolDetection?: { enabled?: boolean | null } | null;
    sandbox?: {
      enabled?: boolean | null;
      fallbackAction?: "allow" | "block";
    } | null;
    tlsDecrypt?: { enabled?: boolean } | null;
  };
}

export const PutGatewayConfigurationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  settings: Schema.optional(
    Schema.Struct({
      activityLog: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("activity_log")),
      antivirus: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabledDownloadPhase: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("enabled_download_phase")),
            enabledUploadPhase: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("enabled_upload_phase")),
            failClosed: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("fail_closed")),
            notificationSettings: Schema.optional(
              Schema.Union(
                Schema.Struct({
                  enabled: Schema.optional(Schema.Boolean),
                  includeContext: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("include_context"),
                  ),
                  msg: Schema.optional(Schema.String),
                  supportUrl: Schema.optional(Schema.String).pipe(
                    T.JsonName("support_url"),
                  ),
                }),
                Schema.Null,
              ),
            ).pipe(T.JsonName("notification_settings")),
          }),
          Schema.Null,
        ),
      ),
      blockPage: Schema.optional(
        Schema.Union(
          Schema.Struct({
            backgroundColor: Schema.optional(Schema.String).pipe(
              T.JsonName("background_color"),
            ),
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            footerText: Schema.optional(Schema.String).pipe(
              T.JsonName("footer_text"),
            ),
            headerText: Schema.optional(Schema.String).pipe(
              T.JsonName("header_text"),
            ),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            logoPath: Schema.optional(Schema.String).pipe(
              T.JsonName("logo_path"),
            ),
            mailtoAddress: Schema.optional(Schema.String).pipe(
              T.JsonName("mailto_address"),
            ),
            mailtoSubject: Schema.optional(Schema.String).pipe(
              T.JsonName("mailto_subject"),
            ),
            mode: Schema.optional(
              Schema.Literal("", "customized_block_page", "redirect_uri"),
            ),
            name: Schema.optional(Schema.String),
            suppressFooter: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("suppress_footer"),
            ),
            targetUri: Schema.optional(Schema.String).pipe(
              T.JsonName("target_uri"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("block_page")),
      bodyScanning: Schema.optional(
        Schema.Union(
          Schema.Struct({
            inspectionMode: Schema.optional(
              Schema.Literal("deep", "shallow"),
            ).pipe(T.JsonName("inspection_mode")),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("body_scanning")),
      browserIsolation: Schema.optional(
        Schema.Union(
          Schema.Struct({
            nonIdentityEnabled: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("non_identity_enabled"),
            ),
            urlBrowserIsolationEnabled: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("url_browser_isolation_enabled"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("browser_isolation")),
      certificate: Schema.optional(
        Schema.Union(
          Schema.Struct({
            id: Schema.String,
          }),
          Schema.Null,
        ),
      ),
      customCertificate: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.Union(Schema.Boolean, Schema.Null),
            id: Schema.optional(Schema.String),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("custom_certificate")),
      extendedEmailMatching: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("extended_email_matching")),
      fips: Schema.optional(
        Schema.Union(
          Schema.Struct({
            tls: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ),
      hostSelector: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("host_selector")),
      inspection: Schema.optional(
        Schema.Union(
          Schema.Struct({
            mode: Schema.optional(Schema.Literal("static", "dynamic")),
          }),
          Schema.Null,
        ),
      ),
      protocolDetection: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("protocol_detection")),
      sandbox: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            fallbackAction: Schema.optional(
              Schema.Literal("allow", "block"),
            ).pipe(T.JsonName("fallback_action")),
          }),
          Schema.Null,
        ),
      ),
      tlsDecrypt: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("tls_decrypt")),
    }),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/gateway/configuration",
  }),
) as unknown as Schema.Schema<PutGatewayConfigurationRequest>;

export interface PutGatewayConfigurationResponse {
  createdAt?: string;
  /** Specify account settings. */
  settings?: {
    activityLog?: { enabled?: boolean | null } | null;
    antivirus?: {
      enabledDownloadPhase?: boolean | null;
      enabledUploadPhase?: boolean | null;
      failClosed?: boolean | null;
      notificationSettings?: {
        enabled?: boolean;
        includeContext?: boolean;
        msg?: string;
        supportUrl?: string;
      } | null;
    } | null;
    blockPage?: {
      backgroundColor?: string;
      enabled?: boolean | null;
      footerText?: string;
      headerText?: string;
      includeContext?: boolean;
      logoPath?: string;
      mailtoAddress?: string;
      mailtoSubject?: string;
      mode?: "" | "customized_block_page" | "redirect_uri";
      name?: string;
      readOnly?: boolean | null;
      sourceAccount?: string | null;
      suppressFooter?: boolean;
      targetUri?: string;
      version?: number | null;
    } | null;
    bodyScanning?: { inspectionMode?: "deep" | "shallow" } | null;
    browserIsolation?: {
      nonIdentityEnabled?: boolean;
      urlBrowserIsolationEnabled?: boolean;
    } | null;
    certificate?: { id: string } | null;
    customCertificate?: {
      enabled: boolean | null;
      id?: string;
      bindingStatus?: string;
      updatedAt?: string;
    } | null;
    extendedEmailMatching?: {
      enabled?: boolean | null;
      readOnly?: boolean;
      sourceAccount?: string;
      version?: number;
    } | null;
    fips?: { tls?: boolean } | null;
    hostSelector?: { enabled?: boolean | null } | null;
    inspection?: { mode?: "static" | "dynamic" } | null;
    protocolDetection?: { enabled?: boolean | null } | null;
    sandbox?: {
      enabled?: boolean | null;
      fallbackAction?: "allow" | "block";
    } | null;
    tlsDecrypt?: { enabled?: boolean } | null;
  };
  updatedAt?: string;
}

export const PutGatewayConfigurationResponse = Schema.Struct({
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  settings: Schema.optional(
    Schema.Struct({
      activityLog: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("activity_log")),
      antivirus: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabledDownloadPhase: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("enabled_download_phase")),
            enabledUploadPhase: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("enabled_upload_phase")),
            failClosed: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("fail_closed")),
            notificationSettings: Schema.optional(
              Schema.Union(
                Schema.Struct({
                  enabled: Schema.optional(Schema.Boolean),
                  includeContext: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("include_context"),
                  ),
                  msg: Schema.optional(Schema.String),
                  supportUrl: Schema.optional(Schema.String).pipe(
                    T.JsonName("support_url"),
                  ),
                }),
                Schema.Null,
              ),
            ).pipe(T.JsonName("notification_settings")),
          }),
          Schema.Null,
        ),
      ),
      blockPage: Schema.optional(
        Schema.Union(
          Schema.Struct({
            backgroundColor: Schema.optional(Schema.String).pipe(
              T.JsonName("background_color"),
            ),
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            footerText: Schema.optional(Schema.String).pipe(
              T.JsonName("footer_text"),
            ),
            headerText: Schema.optional(Schema.String).pipe(
              T.JsonName("header_text"),
            ),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            logoPath: Schema.optional(Schema.String).pipe(
              T.JsonName("logo_path"),
            ),
            mailtoAddress: Schema.optional(Schema.String).pipe(
              T.JsonName("mailto_address"),
            ),
            mailtoSubject: Schema.optional(Schema.String).pipe(
              T.JsonName("mailto_subject"),
            ),
            mode: Schema.optional(
              Schema.Literal("", "customized_block_page", "redirect_uri"),
            ),
            name: Schema.optional(Schema.String),
            readOnly: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("read_only")),
            sourceAccount: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("source_account")),
            suppressFooter: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("suppress_footer"),
            ),
            targetUri: Schema.optional(Schema.String).pipe(
              T.JsonName("target_uri"),
            ),
            version: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("block_page")),
      bodyScanning: Schema.optional(
        Schema.Union(
          Schema.Struct({
            inspectionMode: Schema.optional(
              Schema.Literal("deep", "shallow"),
            ).pipe(T.JsonName("inspection_mode")),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("body_scanning")),
      browserIsolation: Schema.optional(
        Schema.Union(
          Schema.Struct({
            nonIdentityEnabled: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("non_identity_enabled"),
            ),
            urlBrowserIsolationEnabled: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("url_browser_isolation_enabled"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("browser_isolation")),
      certificate: Schema.optional(
        Schema.Union(
          Schema.Struct({
            id: Schema.String,
          }),
          Schema.Null,
        ),
      ),
      customCertificate: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.Union(Schema.Boolean, Schema.Null),
            id: Schema.optional(Schema.String),
            bindingStatus: Schema.optional(Schema.String).pipe(
              T.JsonName("binding_status"),
            ),
            updatedAt: Schema.optional(Schema.String).pipe(
              T.JsonName("updated_at"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("custom_certificate")),
      extendedEmailMatching: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            readOnly: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("read_only"),
            ),
            sourceAccount: Schema.optional(Schema.String).pipe(
              T.JsonName("source_account"),
            ),
            version: Schema.optional(Schema.Number),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("extended_email_matching")),
      fips: Schema.optional(
        Schema.Union(
          Schema.Struct({
            tls: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ),
      hostSelector: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("host_selector")),
      inspection: Schema.optional(
        Schema.Union(
          Schema.Struct({
            mode: Schema.optional(Schema.Literal("static", "dynamic")),
          }),
          Schema.Null,
        ),
      ),
      protocolDetection: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("protocol_detection")),
      sandbox: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            fallbackAction: Schema.optional(
              Schema.Literal("allow", "block"),
            ).pipe(T.JsonName("fallback_action")),
          }),
          Schema.Null,
        ),
      ),
      tlsDecrypt: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("tls_decrypt")),
    }),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<PutGatewayConfigurationResponse>;

export const putGatewayConfiguration: (
  input: PutGatewayConfigurationRequest,
) => Effect.Effect<
  PutGatewayConfigurationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutGatewayConfigurationRequest,
  output: PutGatewayConfigurationResponse,
  errors: [],
}));

export interface PatchGatewayConfigurationRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Specify account settings. */
  settings?: {
    activityLog?: { enabled?: boolean | null } | null;
    antivirus?: {
      enabledDownloadPhase?: boolean | null;
      enabledUploadPhase?: boolean | null;
      failClosed?: boolean | null;
      notificationSettings?: {
        enabled?: boolean;
        includeContext?: boolean;
        msg?: string;
        supportUrl?: string;
      } | null;
    } | null;
    blockPage?: {
      backgroundColor?: string;
      enabled?: boolean | null;
      footerText?: string;
      headerText?: string;
      includeContext?: boolean;
      logoPath?: string;
      mailtoAddress?: string;
      mailtoSubject?: string;
      mode?: "" | "customized_block_page" | "redirect_uri";
      name?: string;
      suppressFooter?: boolean;
      targetUri?: string;
    } | null;
    bodyScanning?: { inspectionMode?: "deep" | "shallow" } | null;
    browserIsolation?: {
      nonIdentityEnabled?: boolean;
      urlBrowserIsolationEnabled?: boolean;
    } | null;
    certificate?: { id: string } | null;
    customCertificate?: { enabled: boolean | null; id?: string } | null;
    extendedEmailMatching?: { enabled?: boolean | null } | null;
    fips?: { tls?: boolean } | null;
    hostSelector?: { enabled?: boolean | null } | null;
    inspection?: { mode?: "static" | "dynamic" } | null;
    protocolDetection?: { enabled?: boolean | null } | null;
    sandbox?: {
      enabled?: boolean | null;
      fallbackAction?: "allow" | "block";
    } | null;
    tlsDecrypt?: { enabled?: boolean } | null;
  };
}

export const PatchGatewayConfigurationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  settings: Schema.optional(
    Schema.Struct({
      activityLog: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("activity_log")),
      antivirus: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabledDownloadPhase: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("enabled_download_phase")),
            enabledUploadPhase: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("enabled_upload_phase")),
            failClosed: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("fail_closed")),
            notificationSettings: Schema.optional(
              Schema.Union(
                Schema.Struct({
                  enabled: Schema.optional(Schema.Boolean),
                  includeContext: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("include_context"),
                  ),
                  msg: Schema.optional(Schema.String),
                  supportUrl: Schema.optional(Schema.String).pipe(
                    T.JsonName("support_url"),
                  ),
                }),
                Schema.Null,
              ),
            ).pipe(T.JsonName("notification_settings")),
          }),
          Schema.Null,
        ),
      ),
      blockPage: Schema.optional(
        Schema.Union(
          Schema.Struct({
            backgroundColor: Schema.optional(Schema.String).pipe(
              T.JsonName("background_color"),
            ),
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            footerText: Schema.optional(Schema.String).pipe(
              T.JsonName("footer_text"),
            ),
            headerText: Schema.optional(Schema.String).pipe(
              T.JsonName("header_text"),
            ),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            logoPath: Schema.optional(Schema.String).pipe(
              T.JsonName("logo_path"),
            ),
            mailtoAddress: Schema.optional(Schema.String).pipe(
              T.JsonName("mailto_address"),
            ),
            mailtoSubject: Schema.optional(Schema.String).pipe(
              T.JsonName("mailto_subject"),
            ),
            mode: Schema.optional(
              Schema.Literal("", "customized_block_page", "redirect_uri"),
            ),
            name: Schema.optional(Schema.String),
            suppressFooter: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("suppress_footer"),
            ),
            targetUri: Schema.optional(Schema.String).pipe(
              T.JsonName("target_uri"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("block_page")),
      bodyScanning: Schema.optional(
        Schema.Union(
          Schema.Struct({
            inspectionMode: Schema.optional(
              Schema.Literal("deep", "shallow"),
            ).pipe(T.JsonName("inspection_mode")),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("body_scanning")),
      browserIsolation: Schema.optional(
        Schema.Union(
          Schema.Struct({
            nonIdentityEnabled: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("non_identity_enabled"),
            ),
            urlBrowserIsolationEnabled: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("url_browser_isolation_enabled"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("browser_isolation")),
      certificate: Schema.optional(
        Schema.Union(
          Schema.Struct({
            id: Schema.String,
          }),
          Schema.Null,
        ),
      ),
      customCertificate: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.Union(Schema.Boolean, Schema.Null),
            id: Schema.optional(Schema.String),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("custom_certificate")),
      extendedEmailMatching: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("extended_email_matching")),
      fips: Schema.optional(
        Schema.Union(
          Schema.Struct({
            tls: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ),
      hostSelector: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("host_selector")),
      inspection: Schema.optional(
        Schema.Union(
          Schema.Struct({
            mode: Schema.optional(Schema.Literal("static", "dynamic")),
          }),
          Schema.Null,
        ),
      ),
      protocolDetection: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("protocol_detection")),
      sandbox: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            fallbackAction: Schema.optional(
              Schema.Literal("allow", "block"),
            ).pipe(T.JsonName("fallback_action")),
          }),
          Schema.Null,
        ),
      ),
      tlsDecrypt: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("tls_decrypt")),
    }),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/gateway/configuration",
  }),
) as unknown as Schema.Schema<PatchGatewayConfigurationRequest>;

export interface PatchGatewayConfigurationResponse {
  createdAt?: string;
  /** Specify account settings. */
  settings?: {
    activityLog?: { enabled?: boolean | null } | null;
    antivirus?: {
      enabledDownloadPhase?: boolean | null;
      enabledUploadPhase?: boolean | null;
      failClosed?: boolean | null;
      notificationSettings?: {
        enabled?: boolean;
        includeContext?: boolean;
        msg?: string;
        supportUrl?: string;
      } | null;
    } | null;
    blockPage?: {
      backgroundColor?: string;
      enabled?: boolean | null;
      footerText?: string;
      headerText?: string;
      includeContext?: boolean;
      logoPath?: string;
      mailtoAddress?: string;
      mailtoSubject?: string;
      mode?: "" | "customized_block_page" | "redirect_uri";
      name?: string;
      readOnly?: boolean | null;
      sourceAccount?: string | null;
      suppressFooter?: boolean;
      targetUri?: string;
      version?: number | null;
    } | null;
    bodyScanning?: { inspectionMode?: "deep" | "shallow" } | null;
    browserIsolation?: {
      nonIdentityEnabled?: boolean;
      urlBrowserIsolationEnabled?: boolean;
    } | null;
    certificate?: { id: string } | null;
    customCertificate?: {
      enabled: boolean | null;
      id?: string;
      bindingStatus?: string;
      updatedAt?: string;
    } | null;
    extendedEmailMatching?: {
      enabled?: boolean | null;
      readOnly?: boolean;
      sourceAccount?: string;
      version?: number;
    } | null;
    fips?: { tls?: boolean } | null;
    hostSelector?: { enabled?: boolean | null } | null;
    inspection?: { mode?: "static" | "dynamic" } | null;
    protocolDetection?: { enabled?: boolean | null } | null;
    sandbox?: {
      enabled?: boolean | null;
      fallbackAction?: "allow" | "block";
    } | null;
    tlsDecrypt?: { enabled?: boolean } | null;
  };
  updatedAt?: string;
}

export const PatchGatewayConfigurationResponse = Schema.Struct({
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  settings: Schema.optional(
    Schema.Struct({
      activityLog: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("activity_log")),
      antivirus: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabledDownloadPhase: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("enabled_download_phase")),
            enabledUploadPhase: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("enabled_upload_phase")),
            failClosed: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("fail_closed")),
            notificationSettings: Schema.optional(
              Schema.Union(
                Schema.Struct({
                  enabled: Schema.optional(Schema.Boolean),
                  includeContext: Schema.optional(Schema.Boolean).pipe(
                    T.JsonName("include_context"),
                  ),
                  msg: Schema.optional(Schema.String),
                  supportUrl: Schema.optional(Schema.String).pipe(
                    T.JsonName("support_url"),
                  ),
                }),
                Schema.Null,
              ),
            ).pipe(T.JsonName("notification_settings")),
          }),
          Schema.Null,
        ),
      ),
      blockPage: Schema.optional(
        Schema.Union(
          Schema.Struct({
            backgroundColor: Schema.optional(Schema.String).pipe(
              T.JsonName("background_color"),
            ),
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            footerText: Schema.optional(Schema.String).pipe(
              T.JsonName("footer_text"),
            ),
            headerText: Schema.optional(Schema.String).pipe(
              T.JsonName("header_text"),
            ),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            logoPath: Schema.optional(Schema.String).pipe(
              T.JsonName("logo_path"),
            ),
            mailtoAddress: Schema.optional(Schema.String).pipe(
              T.JsonName("mailto_address"),
            ),
            mailtoSubject: Schema.optional(Schema.String).pipe(
              T.JsonName("mailto_subject"),
            ),
            mode: Schema.optional(
              Schema.Literal("", "customized_block_page", "redirect_uri"),
            ),
            name: Schema.optional(Schema.String),
            readOnly: Schema.optional(
              Schema.Union(Schema.Boolean, Schema.Null),
            ).pipe(T.JsonName("read_only")),
            sourceAccount: Schema.optional(
              Schema.Union(Schema.String, Schema.Null),
            ).pipe(T.JsonName("source_account")),
            suppressFooter: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("suppress_footer"),
            ),
            targetUri: Schema.optional(Schema.String).pipe(
              T.JsonName("target_uri"),
            ),
            version: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("block_page")),
      bodyScanning: Schema.optional(
        Schema.Union(
          Schema.Struct({
            inspectionMode: Schema.optional(
              Schema.Literal("deep", "shallow"),
            ).pipe(T.JsonName("inspection_mode")),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("body_scanning")),
      browserIsolation: Schema.optional(
        Schema.Union(
          Schema.Struct({
            nonIdentityEnabled: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("non_identity_enabled"),
            ),
            urlBrowserIsolationEnabled: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("url_browser_isolation_enabled"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("browser_isolation")),
      certificate: Schema.optional(
        Schema.Union(
          Schema.Struct({
            id: Schema.String,
          }),
          Schema.Null,
        ),
      ),
      customCertificate: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.Union(Schema.Boolean, Schema.Null),
            id: Schema.optional(Schema.String),
            bindingStatus: Schema.optional(Schema.String).pipe(
              T.JsonName("binding_status"),
            ),
            updatedAt: Schema.optional(Schema.String).pipe(
              T.JsonName("updated_at"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("custom_certificate")),
      extendedEmailMatching: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            readOnly: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("read_only"),
            ),
            sourceAccount: Schema.optional(Schema.String).pipe(
              T.JsonName("source_account"),
            ),
            version: Schema.optional(Schema.Number),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("extended_email_matching")),
      fips: Schema.optional(
        Schema.Union(
          Schema.Struct({
            tls: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ),
      hostSelector: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("host_selector")),
      inspection: Schema.optional(
        Schema.Union(
          Schema.Struct({
            mode: Schema.optional(Schema.Literal("static", "dynamic")),
          }),
          Schema.Null,
        ),
      ),
      protocolDetection: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("protocol_detection")),
      sandbox: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
            fallbackAction: Schema.optional(
              Schema.Literal("allow", "block"),
            ).pipe(T.JsonName("fallback_action")),
          }),
          Schema.Null,
        ),
      ),
      tlsDecrypt: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("tls_decrypt")),
    }),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<PatchGatewayConfigurationResponse>;

export const patchGatewayConfiguration: (
  input: PatchGatewayConfigurationRequest,
) => Effect.Effect<
  PatchGatewayConfigurationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchGatewayConfigurationRequest,
  output: PatchGatewayConfigurationResponse,
  errors: [],
}));

// =============================================================================
// GatewayConfigurationCustomCertificate
// =============================================================================

export interface GetGatewayConfigurationCustomCertificateRequest {
  accountId: string;
}

export const GetGatewayConfigurationCustomCertificateRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/gateway/configuration/custom_certificate",
  }),
) as unknown as Schema.Schema<GetGatewayConfigurationCustomCertificateRequest>;

export type GetGatewayConfigurationCustomCertificateResponse = unknown;

export const GetGatewayConfigurationCustomCertificateResponse =
  Schema.Unknown as unknown as Schema.Schema<GetGatewayConfigurationCustomCertificateResponse>;

export const getGatewayConfigurationCustomCertificate: (
  input: GetGatewayConfigurationCustomCertificateRequest,
) => Effect.Effect<
  GetGatewayConfigurationCustomCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetGatewayConfigurationCustomCertificateRequest,
  output: GetGatewayConfigurationCustomCertificateResponse,
  errors: [],
}));

// =============================================================================
// GatewayList
// =============================================================================

export interface GetGatewayListRequest {
  listId: string;
  accountId: string;
}

export const GetGatewayListRequest = Schema.Struct({
  listId: Schema.String.pipe(T.HttpPath("listId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/gateway/lists/{listId}",
  }),
) as unknown as Schema.Schema<GetGatewayListRequest>;

export interface GetGatewayListResponse {
  /** Identify the API resource with a UUID. */
  id?: string;
  /** Indicate the number of items in the list. */
  count?: number;
  createdAt?: string;
  /** Provide the list description. */
  description?: string;
  /** Provide the list items. */
  items?: { createdAt?: string; description?: string; value?: string }[];
  /** Specify the list name. */
  name?: string;
  /** Specify the list type. */
  type?: "SERIAL" | "URL" | "DOMAIN" | "EMAIL" | "IP";
  updatedAt?: string;
}

export const GetGatewayListResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  count: Schema.optional(Schema.Number),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  description: Schema.optional(Schema.String),
  items: Schema.optional(
    Schema.Array(
      Schema.Struct({
        createdAt: Schema.optional(Schema.String).pipe(
          T.JsonName("created_at"),
        ),
        description: Schema.optional(Schema.String),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
  name: Schema.optional(Schema.String),
  type: Schema.optional(
    Schema.Literal("SERIAL", "URL", "DOMAIN", "EMAIL", "IP"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<GetGatewayListResponse>;

export const getGatewayList: (
  input: GetGatewayListRequest,
) => Effect.Effect<
  GetGatewayListResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetGatewayListRequest,
  output: GetGatewayListResponse,
  errors: [],
}));

export interface CreateGatewayListRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Specify the list name. */
  name: string;
  /** Body param: Specify the list type. */
  type: "SERIAL" | "URL" | "DOMAIN" | "EMAIL" | "IP";
  /** Body param: Provide the list description. */
  description?: string;
  /** Body param: Add items to the list. */
  items?: { description?: string; value?: string }[];
}

export const CreateGatewayListRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  type: Schema.Literal("SERIAL", "URL", "DOMAIN", "EMAIL", "IP"),
  description: Schema.optional(Schema.String),
  items: Schema.optional(
    Schema.Array(
      Schema.Struct({
        description: Schema.optional(Schema.String),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/gateway/lists" }),
) as unknown as Schema.Schema<CreateGatewayListRequest>;

export interface CreateGatewayListResponse {
  /** Identify the API resource with a UUID. */
  id?: string;
  createdAt?: string;
  /** Provide the list description. */
  description?: string;
  /** Provide the list items. */
  items?: { createdAt?: string; description?: string; value?: string }[];
  /** Specify the list name. */
  name?: string;
  /** Specify the list type. */
  type?: "SERIAL" | "URL" | "DOMAIN" | "EMAIL" | "IP";
  updatedAt?: string;
}

export const CreateGatewayListResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  description: Schema.optional(Schema.String),
  items: Schema.optional(
    Schema.Array(
      Schema.Struct({
        createdAt: Schema.optional(Schema.String).pipe(
          T.JsonName("created_at"),
        ),
        description: Schema.optional(Schema.String),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
  name: Schema.optional(Schema.String),
  type: Schema.optional(
    Schema.Literal("SERIAL", "URL", "DOMAIN", "EMAIL", "IP"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<CreateGatewayListResponse>;

export const createGatewayList: (
  input: CreateGatewayListRequest,
) => Effect.Effect<
  CreateGatewayListResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateGatewayListRequest,
  output: CreateGatewayListResponse,
  errors: [],
}));

export interface UpdateGatewayListRequest {
  listId: string;
  /** Path param: */
  accountId: string;
  /** Body param: Specify the list name. */
  name: string;
  /** Body param: Provide the list description. */
  description?: string;
  /** Body param: Add items to the list. */
  items?: { description?: string; value?: string }[];
}

export const UpdateGatewayListRequest = Schema.Struct({
  listId: Schema.String.pipe(T.HttpPath("listId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  description: Schema.optional(Schema.String),
  items: Schema.optional(
    Schema.Array(
      Schema.Struct({
        description: Schema.optional(Schema.String),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/gateway/lists/{listId}",
  }),
) as unknown as Schema.Schema<UpdateGatewayListRequest>;

export interface UpdateGatewayListResponse {
  /** Identify the API resource with a UUID. */
  id?: string;
  /** Indicate the number of items in the list. */
  count?: number;
  createdAt?: string;
  /** Provide the list description. */
  description?: string;
  /** Provide the list items. */
  items?: { createdAt?: string; description?: string; value?: string }[];
  /** Specify the list name. */
  name?: string;
  /** Specify the list type. */
  type?: "SERIAL" | "URL" | "DOMAIN" | "EMAIL" | "IP";
  updatedAt?: string;
}

export const UpdateGatewayListResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  count: Schema.optional(Schema.Number),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  description: Schema.optional(Schema.String),
  items: Schema.optional(
    Schema.Array(
      Schema.Struct({
        createdAt: Schema.optional(Schema.String).pipe(
          T.JsonName("created_at"),
        ),
        description: Schema.optional(Schema.String),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
  name: Schema.optional(Schema.String),
  type: Schema.optional(
    Schema.Literal("SERIAL", "URL", "DOMAIN", "EMAIL", "IP"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<UpdateGatewayListResponse>;

export const updateGatewayList: (
  input: UpdateGatewayListRequest,
) => Effect.Effect<
  UpdateGatewayListResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateGatewayListRequest,
  output: UpdateGatewayListResponse,
  errors: [],
}));

export interface PatchGatewayListRequest {
  listId: string;
  /** Path param: */
  accountId: string;
  /** Body param: Add items to the list. */
  append?: { description?: string; value?: string }[];
  /** Body param: Lists of item values you want to remove. */
  remove?: string[];
}

export const PatchGatewayListRequest = Schema.Struct({
  listId: Schema.String.pipe(T.HttpPath("listId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  append: Schema.optional(
    Schema.Array(
      Schema.Struct({
        description: Schema.optional(Schema.String),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
  remove: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/gateway/lists/{listId}",
  }),
) as unknown as Schema.Schema<PatchGatewayListRequest>;

export interface PatchGatewayListResponse {
  /** Identify the API resource with a UUID. */
  id?: string;
  /** Indicate the number of items in the list. */
  count?: number;
  createdAt?: string;
  /** Provide the list description. */
  description?: string;
  /** Provide the list items. */
  items?: { createdAt?: string; description?: string; value?: string }[];
  /** Specify the list name. */
  name?: string;
  /** Specify the list type. */
  type?: "SERIAL" | "URL" | "DOMAIN" | "EMAIL" | "IP";
  updatedAt?: string;
}

export const PatchGatewayListResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  count: Schema.optional(Schema.Number),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  description: Schema.optional(Schema.String),
  items: Schema.optional(
    Schema.Array(
      Schema.Struct({
        createdAt: Schema.optional(Schema.String).pipe(
          T.JsonName("created_at"),
        ),
        description: Schema.optional(Schema.String),
        value: Schema.optional(Schema.String),
      }),
    ),
  ),
  name: Schema.optional(Schema.String),
  type: Schema.optional(
    Schema.Literal("SERIAL", "URL", "DOMAIN", "EMAIL", "IP"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<PatchGatewayListResponse>;

export const patchGatewayList: (
  input: PatchGatewayListRequest,
) => Effect.Effect<
  PatchGatewayListResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchGatewayListRequest,
  output: PatchGatewayListResponse,
  errors: [],
}));

export interface DeleteGatewayListRequest {
  listId: string;
  accountId: string;
}

export const DeleteGatewayListRequest = Schema.Struct({
  listId: Schema.String.pipe(T.HttpPath("listId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/gateway/lists/{listId}",
  }),
) as unknown as Schema.Schema<DeleteGatewayListRequest>;

export type DeleteGatewayListResponse = unknown;

export const DeleteGatewayListResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteGatewayListResponse>;

export const deleteGatewayList: (
  input: DeleteGatewayListRequest,
) => Effect.Effect<
  DeleteGatewayListResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteGatewayListRequest,
  output: DeleteGatewayListResponse,
  errors: [],
}));

// =============================================================================
// GatewayLocation
// =============================================================================

export interface GetGatewayLocationRequest {
  locationId: string;
  accountId: string;
}

export const GetGatewayLocationRequest = Schema.Struct({
  locationId: Schema.String.pipe(T.HttpPath("locationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/gateway/locations/{locationId}",
  }),
) as unknown as Schema.Schema<GetGatewayLocationRequest>;

export interface GetGatewayLocationResponse {
  id?: string;
  /** Indicate whether this location is the default location. */
  clientDefault?: boolean;
  createdAt?: string;
  /** Indicate the identifier of the pair of IPv4 addresses assigned to this location. */
  dnsDestinationIpsId?: string;
  /** Specify the UUID of the IPv6 block brought to the gateway so that this location's IPv6 address is allocated from the Bring Your Own IPv6 (BYOIPv6) block rather than the standard Cloudflare IPv6 block. */
  dnsDestinationIpv6BlockId?: string | null;
  /** Specify the DNS over HTTPS domain that receives DNS requests. Gateway automatically generates this value. */
  dohSubdomain?: string;
  /** Indicate whether the location must resolve EDNS queries. */
  ecsSupport?: boolean;
  /** Configure the destination endpoints for this location. */
  endpoints?: {
    doh: {
      enabled?: boolean;
      networks?: { network: string }[] | null;
      requireToken?: boolean;
    };
    dot: { enabled?: boolean; networks?: { network: string }[] | null };
    ipv4: { enabled?: boolean };
    ipv6: { enabled?: boolean; networks?: { network: string }[] | null };
  } | null;
  /** Defines the automatically generated IPv6 destination IP assigned to this location. Gateway counts all DNS requests sent to this IP as requests under this location. */
  ip?: string;
  /** Show the primary destination IPv4 address from the pair identified dns_destination_ips_id. This field read-only. */
  ipv4Destination?: string;
  /** Show the backup destination IPv4 address from the pair identified dns_destination_ips_id. This field read-only. */
  ipv4DestinationBackup?: string;
  /** Specify the location name. */
  name?: string;
  /** Specify the list of network ranges from which requests at this location originate. The list takes effect only if it is non-empty and the IPv4 endpoint is enabled for this location. */
  networks?: { network: string }[] | null;
  updatedAt?: string;
}

export const GetGatewayLocationResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  clientDefault: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("client_default"),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  dnsDestinationIpsId: Schema.optional(Schema.String).pipe(
    T.JsonName("dns_destination_ips_id"),
  ),
  dnsDestinationIpv6BlockId: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("dns_destination_ipv6_block_id")),
  dohSubdomain: Schema.optional(Schema.String).pipe(
    T.JsonName("doh_subdomain"),
  ),
  ecsSupport: Schema.optional(Schema.Boolean).pipe(T.JsonName("ecs_support")),
  endpoints: Schema.optional(
    Schema.Union(
      Schema.Struct({
        doh: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
          requireToken: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("require_token"),
          ),
        }),
        dot: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
        }),
        ipv4: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
        }),
        ipv6: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
        }),
      }),
      Schema.Null,
    ),
  ),
  ip: Schema.optional(Schema.String),
  ipv4Destination: Schema.optional(Schema.String).pipe(
    T.JsonName("ipv4_destination"),
  ),
  ipv4DestinationBackup: Schema.optional(Schema.String).pipe(
    T.JsonName("ipv4_destination_backup"),
  ),
  name: Schema.optional(Schema.String),
  networks: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Struct({
          network: Schema.String,
        }),
      ),
      Schema.Null,
    ),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<GetGatewayLocationResponse>;

export const getGatewayLocation: (
  input: GetGatewayLocationRequest,
) => Effect.Effect<
  GetGatewayLocationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetGatewayLocationRequest,
  output: GetGatewayLocationResponse,
  errors: [],
}));

export interface CreateGatewayLocationRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Specify the location name. */
  name: string;
  /** Body param: Indicate whether this location is the default location. */
  clientDefault?: boolean;
  /** Body param: Specify the identifier of the pair of IPv4 addresses assigned to this location. When creating a location, if this field is absent or set to null, the pair of shared IPv4 addresses (0e4a32c */
  dnsDestinationIpsId?: string;
  /** Body param: Indicate whether the location must resolve EDNS queries. */
  ecsSupport?: boolean;
  /** Body param: Configure the destination endpoints for this location. */
  endpoints?: {
    doh: {
      enabled?: boolean;
      networks?: { network: string }[] | null;
      requireToken?: boolean;
    };
    dot: { enabled?: boolean; networks?: { network: string }[] | null };
    ipv4: { enabled?: boolean };
    ipv6: { enabled?: boolean; networks?: { network: string }[] | null };
  } | null;
  /** Body param: Specify the list of network ranges from which requests at this location originate. The list takes effect only if it is non-empty and the IPv4 endpoint is enabled for this location. */
  networks?: { network: string }[] | null;
}

export const CreateGatewayLocationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  clientDefault: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("client_default"),
  ),
  dnsDestinationIpsId: Schema.optional(Schema.String).pipe(
    T.JsonName("dns_destination_ips_id"),
  ),
  ecsSupport: Schema.optional(Schema.Boolean).pipe(T.JsonName("ecs_support")),
  endpoints: Schema.optional(
    Schema.Union(
      Schema.Struct({
        doh: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
          requireToken: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("require_token"),
          ),
        }),
        dot: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
        }),
        ipv4: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
        }),
        ipv6: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
        }),
      }),
      Schema.Null,
    ),
  ),
  networks: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Struct({
          network: Schema.String,
        }),
      ),
      Schema.Null,
    ),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/gateway/locations" }),
) as unknown as Schema.Schema<CreateGatewayLocationRequest>;

export interface CreateGatewayLocationResponse {
  id?: string;
  /** Indicate whether this location is the default location. */
  clientDefault?: boolean;
  createdAt?: string;
  /** Indicate the identifier of the pair of IPv4 addresses assigned to this location. */
  dnsDestinationIpsId?: string;
  /** Specify the UUID of the IPv6 block brought to the gateway so that this location's IPv6 address is allocated from the Bring Your Own IPv6 (BYOIPv6) block rather than the standard Cloudflare IPv6 block. */
  dnsDestinationIpv6BlockId?: string | null;
  /** Specify the DNS over HTTPS domain that receives DNS requests. Gateway automatically generates this value. */
  dohSubdomain?: string;
  /** Indicate whether the location must resolve EDNS queries. */
  ecsSupport?: boolean;
  /** Configure the destination endpoints for this location. */
  endpoints?: {
    doh: {
      enabled?: boolean;
      networks?: { network: string }[] | null;
      requireToken?: boolean;
    };
    dot: { enabled?: boolean; networks?: { network: string }[] | null };
    ipv4: { enabled?: boolean };
    ipv6: { enabled?: boolean; networks?: { network: string }[] | null };
  } | null;
  /** Defines the automatically generated IPv6 destination IP assigned to this location. Gateway counts all DNS requests sent to this IP as requests under this location. */
  ip?: string;
  /** Show the primary destination IPv4 address from the pair identified dns_destination_ips_id. This field read-only. */
  ipv4Destination?: string;
  /** Show the backup destination IPv4 address from the pair identified dns_destination_ips_id. This field read-only. */
  ipv4DestinationBackup?: string;
  /** Specify the location name. */
  name?: string;
  /** Specify the list of network ranges from which requests at this location originate. The list takes effect only if it is non-empty and the IPv4 endpoint is enabled for this location. */
  networks?: { network: string }[] | null;
  updatedAt?: string;
}

export const CreateGatewayLocationResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  clientDefault: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("client_default"),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  dnsDestinationIpsId: Schema.optional(Schema.String).pipe(
    T.JsonName("dns_destination_ips_id"),
  ),
  dnsDestinationIpv6BlockId: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("dns_destination_ipv6_block_id")),
  dohSubdomain: Schema.optional(Schema.String).pipe(
    T.JsonName("doh_subdomain"),
  ),
  ecsSupport: Schema.optional(Schema.Boolean).pipe(T.JsonName("ecs_support")),
  endpoints: Schema.optional(
    Schema.Union(
      Schema.Struct({
        doh: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
          requireToken: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("require_token"),
          ),
        }),
        dot: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
        }),
        ipv4: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
        }),
        ipv6: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
        }),
      }),
      Schema.Null,
    ),
  ),
  ip: Schema.optional(Schema.String),
  ipv4Destination: Schema.optional(Schema.String).pipe(
    T.JsonName("ipv4_destination"),
  ),
  ipv4DestinationBackup: Schema.optional(Schema.String).pipe(
    T.JsonName("ipv4_destination_backup"),
  ),
  name: Schema.optional(Schema.String),
  networks: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Struct({
          network: Schema.String,
        }),
      ),
      Schema.Null,
    ),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<CreateGatewayLocationResponse>;

export const createGatewayLocation: (
  input: CreateGatewayLocationRequest,
) => Effect.Effect<
  CreateGatewayLocationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateGatewayLocationRequest,
  output: CreateGatewayLocationResponse,
  errors: [],
}));

export interface UpdateGatewayLocationRequest {
  locationId: string;
  /** Path param: */
  accountId: string;
  /** Body param: Specify the location name. */
  name: string;
  /** Body param: Indicate whether this location is the default location. */
  clientDefault?: boolean;
  /** Body param: Specify the identifier of the pair of IPv4 addresses assigned to this location. When creating a location, if this field is absent or set to null, the pair of shared IPv4 addresses (0e4a32c */
  dnsDestinationIpsId?: string;
  /** Body param: Indicate whether the location must resolve EDNS queries. */
  ecsSupport?: boolean;
  /** Body param: Configure the destination endpoints for this location. */
  endpoints?: {
    doh: {
      enabled?: boolean;
      networks?: { network: string }[] | null;
      requireToken?: boolean;
    };
    dot: { enabled?: boolean; networks?: { network: string }[] | null };
    ipv4: { enabled?: boolean };
    ipv6: { enabled?: boolean; networks?: { network: string }[] | null };
  } | null;
  /** Body param: Specify the list of network ranges from which requests at this location originate. The list takes effect only if it is non-empty and the IPv4 endpoint is enabled for this location. */
  networks?: { network: string }[] | null;
}

export const UpdateGatewayLocationRequest = Schema.Struct({
  locationId: Schema.String.pipe(T.HttpPath("locationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  clientDefault: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("client_default"),
  ),
  dnsDestinationIpsId: Schema.optional(Schema.String).pipe(
    T.JsonName("dns_destination_ips_id"),
  ),
  ecsSupport: Schema.optional(Schema.Boolean).pipe(T.JsonName("ecs_support")),
  endpoints: Schema.optional(
    Schema.Union(
      Schema.Struct({
        doh: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
          requireToken: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("require_token"),
          ),
        }),
        dot: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
        }),
        ipv4: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
        }),
        ipv6: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
        }),
      }),
      Schema.Null,
    ),
  ),
  networks: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Struct({
          network: Schema.String,
        }),
      ),
      Schema.Null,
    ),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/gateway/locations/{locationId}",
  }),
) as unknown as Schema.Schema<UpdateGatewayLocationRequest>;

export interface UpdateGatewayLocationResponse {
  id?: string;
  /** Indicate whether this location is the default location. */
  clientDefault?: boolean;
  createdAt?: string;
  /** Indicate the identifier of the pair of IPv4 addresses assigned to this location. */
  dnsDestinationIpsId?: string;
  /** Specify the UUID of the IPv6 block brought to the gateway so that this location's IPv6 address is allocated from the Bring Your Own IPv6 (BYOIPv6) block rather than the standard Cloudflare IPv6 block. */
  dnsDestinationIpv6BlockId?: string | null;
  /** Specify the DNS over HTTPS domain that receives DNS requests. Gateway automatically generates this value. */
  dohSubdomain?: string;
  /** Indicate whether the location must resolve EDNS queries. */
  ecsSupport?: boolean;
  /** Configure the destination endpoints for this location. */
  endpoints?: {
    doh: {
      enabled?: boolean;
      networks?: { network: string }[] | null;
      requireToken?: boolean;
    };
    dot: { enabled?: boolean; networks?: { network: string }[] | null };
    ipv4: { enabled?: boolean };
    ipv6: { enabled?: boolean; networks?: { network: string }[] | null };
  } | null;
  /** Defines the automatically generated IPv6 destination IP assigned to this location. Gateway counts all DNS requests sent to this IP as requests under this location. */
  ip?: string;
  /** Show the primary destination IPv4 address from the pair identified dns_destination_ips_id. This field read-only. */
  ipv4Destination?: string;
  /** Show the backup destination IPv4 address from the pair identified dns_destination_ips_id. This field read-only. */
  ipv4DestinationBackup?: string;
  /** Specify the location name. */
  name?: string;
  /** Specify the list of network ranges from which requests at this location originate. The list takes effect only if it is non-empty and the IPv4 endpoint is enabled for this location. */
  networks?: { network: string }[] | null;
  updatedAt?: string;
}

export const UpdateGatewayLocationResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  clientDefault: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("client_default"),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  dnsDestinationIpsId: Schema.optional(Schema.String).pipe(
    T.JsonName("dns_destination_ips_id"),
  ),
  dnsDestinationIpv6BlockId: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("dns_destination_ipv6_block_id")),
  dohSubdomain: Schema.optional(Schema.String).pipe(
    T.JsonName("doh_subdomain"),
  ),
  ecsSupport: Schema.optional(Schema.Boolean).pipe(T.JsonName("ecs_support")),
  endpoints: Schema.optional(
    Schema.Union(
      Schema.Struct({
        doh: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
          requireToken: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("require_token"),
          ),
        }),
        dot: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
        }),
        ipv4: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
        }),
        ipv6: Schema.Struct({
          enabled: Schema.optional(Schema.Boolean),
          networks: Schema.optional(
            Schema.Union(
              Schema.Array(
                Schema.Struct({
                  network: Schema.String,
                }),
              ),
              Schema.Null,
            ),
          ),
        }),
      }),
      Schema.Null,
    ),
  ),
  ip: Schema.optional(Schema.String),
  ipv4Destination: Schema.optional(Schema.String).pipe(
    T.JsonName("ipv4_destination"),
  ),
  ipv4DestinationBackup: Schema.optional(Schema.String).pipe(
    T.JsonName("ipv4_destination_backup"),
  ),
  name: Schema.optional(Schema.String),
  networks: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Struct({
          network: Schema.String,
        }),
      ),
      Schema.Null,
    ),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<UpdateGatewayLocationResponse>;

export const updateGatewayLocation: (
  input: UpdateGatewayLocationRequest,
) => Effect.Effect<
  UpdateGatewayLocationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateGatewayLocationRequest,
  output: UpdateGatewayLocationResponse,
  errors: [],
}));

export interface DeleteGatewayLocationRequest {
  locationId: string;
  accountId: string;
}

export const DeleteGatewayLocationRequest = Schema.Struct({
  locationId: Schema.String.pipe(T.HttpPath("locationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/gateway/locations/{locationId}",
  }),
) as unknown as Schema.Schema<DeleteGatewayLocationRequest>;

export type DeleteGatewayLocationResponse = unknown;

export const DeleteGatewayLocationResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteGatewayLocationResponse>;

export const deleteGatewayLocation: (
  input: DeleteGatewayLocationRequest,
) => Effect.Effect<
  DeleteGatewayLocationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteGatewayLocationRequest,
  output: DeleteGatewayLocationResponse,
  errors: [],
}));

// =============================================================================
// GatewayLogging
// =============================================================================

export interface GetGatewayLoggingRequest {
  accountId: string;
}

export const GetGatewayLoggingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/gateway/logging" }),
) as unknown as Schema.Schema<GetGatewayLoggingRequest>;

export interface GetGatewayLoggingResponse {
  /** Indicate whether to redact personally identifiable information from activity logging (PII fields include source IP, user email, user ID, device ID, URL, referrer, and user agent). */
  redactPii?: boolean;
  /** Configure logging settings for each rule type. */
  settingsByRuleType?: {
    dns?: { logAll?: boolean; logBlocks?: boolean };
    http?: { logAll?: boolean; logBlocks?: boolean };
    l4?: { logAll?: boolean; logBlocks?: boolean };
  };
}

export const GetGatewayLoggingResponse = Schema.Struct({
  redactPii: Schema.optional(Schema.Boolean).pipe(T.JsonName("redact_pii")),
  settingsByRuleType: Schema.optional(
    Schema.Struct({
      dns: Schema.optional(
        Schema.Struct({
          logAll: Schema.optional(Schema.Boolean).pipe(T.JsonName("log_all")),
          logBlocks: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("log_blocks"),
          ),
        }),
      ),
      http: Schema.optional(
        Schema.Struct({
          logAll: Schema.optional(Schema.Boolean).pipe(T.JsonName("log_all")),
          logBlocks: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("log_blocks"),
          ),
        }),
      ),
      l4: Schema.optional(
        Schema.Struct({
          logAll: Schema.optional(Schema.Boolean).pipe(T.JsonName("log_all")),
          logBlocks: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("log_blocks"),
          ),
        }),
      ),
    }),
  ).pipe(T.JsonName("settings_by_rule_type")),
}) as unknown as Schema.Schema<GetGatewayLoggingResponse>;

export const getGatewayLogging: (
  input: GetGatewayLoggingRequest,
) => Effect.Effect<
  GetGatewayLoggingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetGatewayLoggingRequest,
  output: GetGatewayLoggingResponse,
  errors: [],
}));

export interface PutGatewayLoggingRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Indicate whether to redact personally identifiable information from activity logging (PII fields include source IP, user email, user ID, device ID, URL, referrer, and user agent). */
  redactPii?: boolean;
  /** Body param: Configure logging settings for each rule type. */
  settingsByRuleType?: {
    dns?: { logAll?: boolean; logBlocks?: boolean };
    http?: { logAll?: boolean; logBlocks?: boolean };
    l4?: { logAll?: boolean; logBlocks?: boolean };
  };
}

export const PutGatewayLoggingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  redactPii: Schema.optional(Schema.Boolean).pipe(T.JsonName("redact_pii")),
  settingsByRuleType: Schema.optional(
    Schema.Struct({
      dns: Schema.optional(
        Schema.Struct({
          logAll: Schema.optional(Schema.Boolean).pipe(T.JsonName("log_all")),
          logBlocks: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("log_blocks"),
          ),
        }),
      ),
      http: Schema.optional(
        Schema.Struct({
          logAll: Schema.optional(Schema.Boolean).pipe(T.JsonName("log_all")),
          logBlocks: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("log_blocks"),
          ),
        }),
      ),
      l4: Schema.optional(
        Schema.Struct({
          logAll: Schema.optional(Schema.Boolean).pipe(T.JsonName("log_all")),
          logBlocks: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("log_blocks"),
          ),
        }),
      ),
    }),
  ).pipe(T.JsonName("settings_by_rule_type")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/gateway/logging" }),
) as unknown as Schema.Schema<PutGatewayLoggingRequest>;

export interface PutGatewayLoggingResponse {
  /** Indicate whether to redact personally identifiable information from activity logging (PII fields include source IP, user email, user ID, device ID, URL, referrer, and user agent). */
  redactPii?: boolean;
  /** Configure logging settings for each rule type. */
  settingsByRuleType?: {
    dns?: { logAll?: boolean; logBlocks?: boolean };
    http?: { logAll?: boolean; logBlocks?: boolean };
    l4?: { logAll?: boolean; logBlocks?: boolean };
  };
}

export const PutGatewayLoggingResponse = Schema.Struct({
  redactPii: Schema.optional(Schema.Boolean).pipe(T.JsonName("redact_pii")),
  settingsByRuleType: Schema.optional(
    Schema.Struct({
      dns: Schema.optional(
        Schema.Struct({
          logAll: Schema.optional(Schema.Boolean).pipe(T.JsonName("log_all")),
          logBlocks: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("log_blocks"),
          ),
        }),
      ),
      http: Schema.optional(
        Schema.Struct({
          logAll: Schema.optional(Schema.Boolean).pipe(T.JsonName("log_all")),
          logBlocks: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("log_blocks"),
          ),
        }),
      ),
      l4: Schema.optional(
        Schema.Struct({
          logAll: Schema.optional(Schema.Boolean).pipe(T.JsonName("log_all")),
          logBlocks: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("log_blocks"),
          ),
        }),
      ),
    }),
  ).pipe(T.JsonName("settings_by_rule_type")),
}) as unknown as Schema.Schema<PutGatewayLoggingResponse>;

export const putGatewayLogging: (
  input: PutGatewayLoggingRequest,
) => Effect.Effect<
  PutGatewayLoggingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutGatewayLoggingRequest,
  output: PutGatewayLoggingResponse,
  errors: [],
}));

// =============================================================================
// GatewayProxyEndpoint
// =============================================================================

export interface ListGatewayProxyEndpointsRequest {
  accountId: string;
}

export const ListGatewayProxyEndpointsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/gateway/proxy_endpoints",
  }),
) as unknown as Schema.Schema<ListGatewayProxyEndpointsRequest>;

export interface ListGatewayProxyEndpointsResponse {
  id?: string;
  createdAt?: string;
  /** Specify the list of CIDRs to restrict ingress connections. */
  ips?: string[];
  /** Specify the name of the proxy endpoint. */
  name?: string;
  /** Specify the subdomain to use as the destination in the proxy client. */
  subdomain?: string;
  updatedAt?: string;
}

export const ListGatewayProxyEndpointsResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  ips: Schema.optional(Schema.Array(Schema.String)),
  name: Schema.optional(Schema.String),
  subdomain: Schema.optional(Schema.String),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<ListGatewayProxyEndpointsResponse>;

export const listGatewayProxyEndpoints: (
  input: ListGatewayProxyEndpointsRequest,
) => Effect.Effect<
  ListGatewayProxyEndpointsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListGatewayProxyEndpointsRequest,
  output: ListGatewayProxyEndpointsResponse,
  errors: [],
}));

export interface CreateGatewayProxyEndpointRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Specify the list of CIDRs to restrict ingress connections. */
  ips: string[];
  /** Body param: Specify the name of the proxy endpoint. */
  name: string;
}

export const CreateGatewayProxyEndpointRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  ips: Schema.Array(Schema.String),
  name: Schema.String,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/gateway/proxy_endpoints",
  }),
) as unknown as Schema.Schema<CreateGatewayProxyEndpointRequest>;

export interface CreateGatewayProxyEndpointResponse {
  id?: string;
  createdAt?: string;
  /** Specify the list of CIDRs to restrict ingress connections. */
  ips?: string[];
  /** Specify the name of the proxy endpoint. */
  name?: string;
  /** Specify the subdomain to use as the destination in the proxy client. */
  subdomain?: string;
  updatedAt?: string;
}

export const CreateGatewayProxyEndpointResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  ips: Schema.optional(Schema.Array(Schema.String)),
  name: Schema.optional(Schema.String),
  subdomain: Schema.optional(Schema.String),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<CreateGatewayProxyEndpointResponse>;

export const createGatewayProxyEndpoint: (
  input: CreateGatewayProxyEndpointRequest,
) => Effect.Effect<
  CreateGatewayProxyEndpointResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateGatewayProxyEndpointRequest,
  output: CreateGatewayProxyEndpointResponse,
  errors: [],
}));

export interface PatchGatewayProxyEndpointRequest {
  proxyEndpointId: string;
  /** Path param: */
  accountId: string;
  /** Body param: Specify the list of CIDRs to restrict ingress connections. */
  ips?: string[];
  /** Body param: Specify the name of the proxy endpoint. */
  name?: string;
}

export const PatchGatewayProxyEndpointRequest = Schema.Struct({
  proxyEndpointId: Schema.String.pipe(T.HttpPath("proxyEndpointId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  ips: Schema.optional(Schema.Array(Schema.String)),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/gateway/proxy_endpoints/{proxyEndpointId}",
  }),
) as unknown as Schema.Schema<PatchGatewayProxyEndpointRequest>;

export interface PatchGatewayProxyEndpointResponse {
  id?: string;
  createdAt?: string;
  /** Specify the list of CIDRs to restrict ingress connections. */
  ips?: string[];
  /** Specify the name of the proxy endpoint. */
  name?: string;
  /** Specify the subdomain to use as the destination in the proxy client. */
  subdomain?: string;
  updatedAt?: string;
}

export const PatchGatewayProxyEndpointResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  ips: Schema.optional(Schema.Array(Schema.String)),
  name: Schema.optional(Schema.String),
  subdomain: Schema.optional(Schema.String),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<PatchGatewayProxyEndpointResponse>;

export const patchGatewayProxyEndpoint: (
  input: PatchGatewayProxyEndpointRequest,
) => Effect.Effect<
  PatchGatewayProxyEndpointResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchGatewayProxyEndpointRequest,
  output: PatchGatewayProxyEndpointResponse,
  errors: [],
}));

export interface DeleteGatewayProxyEndpointRequest {
  proxyEndpointId: string;
  accountId: string;
}

export const DeleteGatewayProxyEndpointRequest = Schema.Struct({
  proxyEndpointId: Schema.String.pipe(T.HttpPath("proxyEndpointId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/gateway/proxy_endpoints/{proxyEndpointId}",
  }),
) as unknown as Schema.Schema<DeleteGatewayProxyEndpointRequest>;

export type DeleteGatewayProxyEndpointResponse = unknown;

export const DeleteGatewayProxyEndpointResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteGatewayProxyEndpointResponse>;

export const deleteGatewayProxyEndpoint: (
  input: DeleteGatewayProxyEndpointRequest,
) => Effect.Effect<
  DeleteGatewayProxyEndpointResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteGatewayProxyEndpointRequest,
  output: DeleteGatewayProxyEndpointResponse,
  errors: [],
}));

// =============================================================================
// GatewayRule
// =============================================================================

export interface GetGatewayRuleRequest {
  ruleId: string;
  accountId: string;
}

export const GetGatewayRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/gateway/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<GetGatewayRuleRequest>;

export interface GetGatewayRuleResponse {
  /** Specify the action to perform when the associated traffic, identity, and device posture expressions either absent or evaluate to `true`. */
  action:
    | "on"
    | "off"
    | "allow"
    | "block"
    | "scan"
    | "noscan"
    | "safesearch"
    | "ytrestricted"
    | "isolate"
    | "noisolate"
    | "override"
    | "l4_override"
    | "egress"
    | "resolve"
    | "quarantine"
    | "redirect";
  /** Specify whether the rule is enabled. */
  enabled: boolean;
  /** Specify the protocol or layer to evaluate the traffic, identity, and device posture expressions. */
  filters: ("http" | "dns" | "l4" | "egress" | "dns_resolver")[];
  /** Specify the rule name. */
  name: string;
  /** Set the order of your rules. Lower values indicate higher precedence. At each processing phase, evaluate applicable rules in ascending order of this value. Refer to [Order of enforcement](http://devel */
  precedence: number;
  /** Specify the wirefilter expression used for traffic matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expression */
  traffic: string;
  /** Identify the API resource with a UUID. */
  id?: string;
  createdAt?: string;
  /** Indicate the date of deletion, if any. */
  deletedAt?: string | null;
  /** Specify the rule description. */
  description?: string;
  /** Specify the wirefilter expression used for device posture check. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expres */
  devicePosture?: string;
  /** Defines the expiration time stamp and default duration of a DNS policy. Takes precedence over the policy's `schedule` configuration, if any. This does not apply to HTTP or network policies. Settable o */
  expiration?: {
    expiresAt: string;
    duration?: number;
    expired?: boolean;
  } | null;
  /** Specify the wirefilter expression used for identity matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expressio */
  identity?: string;
  /** Indicate that this rule is shared via the Orgs API and read only. */
  readOnly?: boolean;
  /** Set settings related to this rule. Each setting is only valid for specific rule types and can only be used with the appropriate selectors. If Terraform drift is observed in these setting values, verif */
  ruleSettings?: {
    addHeaders?: Record<string, unknown> | null;
    allowChildBypass?: boolean | null;
    auditSsh?: { commandLogging?: boolean } | null;
    bisoAdminControls?: {
      copy?: "enabled" | "disabled" | "remote_only";
      dcp?: boolean;
      dd?: boolean;
      dk?: boolean;
      download?: "enabled" | "disabled" | "remote_only";
      dp?: boolean;
      du?: boolean;
      keyboard?: "enabled" | "disabled";
      paste?: "enabled" | "disabled" | "remote_only";
      printing?: "enabled" | "disabled";
      upload?: "enabled" | "disabled";
      version?: "v1" | "v2";
    };
    blockPage?: { targetUri: string; includeContext?: boolean } | null;
    blockPageEnabled?: boolean;
    blockReason?: string | null;
    bypassParentRule?: boolean | null;
    checkSession?: { duration?: string; enforce?: boolean } | null;
    dnsResolvers?: { ipv4?: unknown[]; ipv6?: unknown[] } | null;
    egress?: { ipv4?: string; ipv4Fallback?: string; ipv6?: string } | null;
    ignoreCnameCategoryMatches?: boolean;
    insecureDisableDnssecValidation?: boolean;
    ipCategories?: boolean;
    ipIndicatorFeeds?: boolean;
    l4override?: { ip?: string; port?: number } | null;
    notificationSettings?: {
      enabled?: boolean;
      includeContext?: boolean;
      msg?: string;
      supportUrl?: string;
    } | null;
    overrideHost?: string;
    overrideIps?: string[] | null;
    payloadLog?: { enabled?: boolean } | null;
    quarantine?: {
      fileTypes?: (
        | "exe"
        | "pdf"
        | "doc"
        | "docm"
        | "docx"
        | "rtf"
        | "ppt"
        | "pptx"
        | "xls"
        | "xlsm"
        | "xlsx"
        | "zip"
        | "rar"
      )[];
    } | null;
    redirect?: {
      targetUri: string;
      includeContext?: boolean;
      preservePathAndQuery?: boolean;
    } | null;
    resolveDnsInternally?: {
      fallback?: "none" | "public_dns";
      viewId?: string;
    } | null;
    resolveDnsThroughCloudflare?: boolean | null;
    untrustedCert?: { action?: "pass_through" | "block" | "error" } | null;
  };
  /** Defines the schedule for activating DNS policies. Settable only for `dns` and `dns_resolver` rules. */
  schedule?: {
    fri?: string;
    mon?: string;
    sat?: string;
    sun?: string;
    thu?: string;
    timeZone?: string;
    tue?: string;
    wed?: string;
  } | null;
  /** Indicate that this rule is sharable via the Orgs API. */
  sharable?: boolean;
  /** Provide the account tag of the account that created the rule. */
  sourceAccount?: string;
  updatedAt?: string;
  /** Indicate the version number of the rule(read-only). */
  version?: number;
  /** Indicate a warning for a misconfigured rule, if any. */
  warningStatus?: string | null;
}

export const GetGatewayRuleResponse = Schema.Struct({
  action: Schema.Literal(
    "on",
    "off",
    "allow",
    "block",
    "scan",
    "noscan",
    "safesearch",
    "ytrestricted",
    "isolate",
    "noisolate",
    "override",
    "l4_override",
    "egress",
    "resolve",
    "quarantine",
    "redirect",
  ),
  enabled: Schema.Boolean,
  filters: Schema.Array(
    Schema.Literal("http", "dns", "l4", "egress", "dns_resolver"),
  ),
  name: Schema.String,
  precedence: Schema.Number,
  traffic: Schema.String,
  id: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("deleted_at"),
  ),
  description: Schema.optional(Schema.String),
  devicePosture: Schema.optional(Schema.String).pipe(
    T.JsonName("device_posture"),
  ),
  expiration: Schema.optional(
    Schema.Union(
      Schema.Struct({
        expiresAt: Schema.String.pipe(T.JsonName("expires_at")),
        duration: Schema.optional(Schema.Number),
        expired: Schema.optional(Schema.Boolean),
      }),
      Schema.Null,
    ),
  ),
  identity: Schema.optional(Schema.String),
  readOnly: Schema.optional(Schema.Boolean).pipe(T.JsonName("read_only")),
  ruleSettings: Schema.optional(
    Schema.Struct({
      addHeaders: Schema.optional(
        Schema.Union(Schema.Struct({}), Schema.Null),
      ).pipe(T.JsonName("add_headers")),
      allowChildBypass: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("allow_child_bypass")),
      auditSsh: Schema.optional(
        Schema.Union(
          Schema.Struct({
            commandLogging: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("command_logging"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("audit_ssh")),
      bisoAdminControls: Schema.optional(
        Schema.Struct({
          copy: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dcp: Schema.optional(Schema.Boolean),
          dd: Schema.optional(Schema.Boolean),
          dk: Schema.optional(Schema.Boolean),
          download: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dp: Schema.optional(Schema.Boolean),
          du: Schema.optional(Schema.Boolean),
          keyboard: Schema.optional(Schema.Literal("enabled", "disabled")),
          paste: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          printing: Schema.optional(Schema.Literal("enabled", "disabled")),
          upload: Schema.optional(Schema.Literal("enabled", "disabled")),
          version: Schema.optional(Schema.Literal("v1", "v2")),
        }),
      ).pipe(T.JsonName("biso_admin_controls")),
      blockPage: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("block_page")),
      blockPageEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("block_page_enabled"),
      ),
      blockReason: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("block_reason")),
      bypassParentRule: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("bypass_parent_rule")),
      checkSession: Schema.optional(
        Schema.Union(
          Schema.Struct({
            duration: Schema.optional(Schema.String),
            enforce: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("check_session")),
      dnsResolvers: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.Array(Schema.Unknown)),
            ipv6: Schema.optional(Schema.Array(Schema.Unknown)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("dns_resolvers")),
      egress: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.String),
            ipv4Fallback: Schema.optional(Schema.String).pipe(
              T.JsonName("ipv4_fallback"),
            ),
            ipv6: Schema.optional(Schema.String),
          }),
          Schema.Null,
        ),
      ),
      ignoreCnameCategoryMatches: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ignore_cname_category_matches"),
      ),
      insecureDisableDnssecValidation: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("insecure_disable_dnssec_validation"),
      ),
      ipCategories: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_categories"),
      ),
      ipIndicatorFeeds: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_indicator_feeds"),
      ),
      l4override: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ip: Schema.optional(Schema.String),
            port: Schema.optional(Schema.Number),
          }),
          Schema.Null,
        ),
      ),
      notificationSettings: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            msg: Schema.optional(Schema.String),
            supportUrl: Schema.optional(Schema.String).pipe(
              T.JsonName("support_url"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("notification_settings")),
      overrideHost: Schema.optional(Schema.String).pipe(
        T.JsonName("override_host"),
      ),
      overrideIps: Schema.optional(
        Schema.Union(Schema.Array(Schema.String), Schema.Null),
      ).pipe(T.JsonName("override_ips")),
      payloadLog: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("payload_log")),
      quarantine: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fileTypes: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "exe",
                  "pdf",
                  "doc",
                  "docm",
                  "docx",
                  "rtf",
                  "ppt",
                  "pptx",
                  "xls",
                  "xlsm",
                  "xlsx",
                  "zip",
                  "rar",
                ),
              ),
            ).pipe(T.JsonName("file_types")),
          }),
          Schema.Null,
        ),
      ),
      redirect: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            preservePathAndQuery: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("preserve_path_and_query"),
            ),
          }),
          Schema.Null,
        ),
      ),
      resolveDnsInternally: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fallback: Schema.optional(Schema.Literal("none", "public_dns")),
            viewId: Schema.optional(Schema.String).pipe(T.JsonName("view_id")),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("resolve_dns_internally")),
      resolveDnsThroughCloudflare: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("resolve_dns_through_cloudflare")),
      untrustedCert: Schema.optional(
        Schema.Union(
          Schema.Struct({
            action: Schema.optional(
              Schema.Literal("pass_through", "block", "error"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("untrusted_cert")),
    }),
  ).pipe(T.JsonName("rule_settings")),
  schedule: Schema.optional(
    Schema.Union(
      Schema.Struct({
        fri: Schema.optional(Schema.String),
        mon: Schema.optional(Schema.String),
        sat: Schema.optional(Schema.String),
        sun: Schema.optional(Schema.String),
        thu: Schema.optional(Schema.String),
        timeZone: Schema.optional(Schema.String).pipe(T.JsonName("time_zone")),
        tue: Schema.optional(Schema.String),
        wed: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ),
  sharable: Schema.optional(Schema.Boolean),
  sourceAccount: Schema.optional(Schema.String).pipe(
    T.JsonName("source_account"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  version: Schema.optional(Schema.Number),
  warningStatus: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("warning_status"),
  ),
}) as unknown as Schema.Schema<GetGatewayRuleResponse>;

export const getGatewayRule: (
  input: GetGatewayRuleRequest,
) => Effect.Effect<
  GetGatewayRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetGatewayRuleRequest,
  output: GetGatewayRuleResponse,
  errors: [],
}));

export interface CreateGatewayRuleRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Specify the action to perform when the associated traffic, identity, and device posture expressions either absent or evaluate to `true`. */
  action:
    | "on"
    | "off"
    | "allow"
    | "block"
    | "scan"
    | "noscan"
    | "safesearch"
    | "ytrestricted"
    | "isolate"
    | "noisolate"
    | "override"
    | "l4_override"
    | "egress"
    | "resolve"
    | "quarantine"
    | "redirect";
  /** Body param: Specify the rule name. */
  name: string;
  /** Body param: Specify the rule description. */
  description?: string;
  /** Body param: Specify the wirefilter expression used for device posture check. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the form */
  devicePosture?: string;
  /** Body param: Specify whether the rule is enabled. */
  enabled?: boolean;
  /** Body param: Defines the expiration time stamp and default duration of a DNS policy. Takes precedence over the policy's `schedule` configuration, if any. This does not apply to HTTP or network policies */
  expiration?: { expiresAt: string; duration?: number } | null;
  /** Body param: Specify the protocol or layer to evaluate the traffic, identity, and device posture expressions. */
  filters?: ("http" | "dns" | "l4" | "egress" | "dns_resolver")[];
  /** Body param: Specify the wirefilter expression used for identity matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatt */
  identity?: string;
  /** Body param: Set the order of your rules. Lower values indicate higher precedence. At each processing phase, evaluate applicable rules in ascending order of this value. Refer to [Order of enforcement]( */
  precedence?: number;
  /** Body param: Set settings related to this rule. Each setting is only valid for specific rule types and can only be used with the appropriate selectors. If Terraform drift is observed in these setting v */
  ruleSettings?: {
    addHeaders?: Record<string, unknown> | null;
    allowChildBypass?: boolean | null;
    auditSsh?: { commandLogging?: boolean } | null;
    bisoAdminControls?: {
      copy?: "enabled" | "disabled" | "remote_only";
      dcp?: boolean;
      dd?: boolean;
      dk?: boolean;
      download?: "enabled" | "disabled" | "remote_only";
      dp?: boolean;
      du?: boolean;
      keyboard?: "enabled" | "disabled";
      paste?: "enabled" | "disabled" | "remote_only";
      printing?: "enabled" | "disabled";
      upload?: "enabled" | "disabled";
      version?: "v1" | "v2";
    };
    blockPage?: { targetUri: string; includeContext?: boolean } | null;
    blockPageEnabled?: boolean;
    blockReason?: string | null;
    bypassParentRule?: boolean | null;
    checkSession?: { duration?: string; enforce?: boolean } | null;
    dnsResolvers?: { ipv4?: unknown[]; ipv6?: unknown[] } | null;
    egress?: { ipv4?: string; ipv4Fallback?: string; ipv6?: string } | null;
    ignoreCnameCategoryMatches?: boolean;
    insecureDisableDnssecValidation?: boolean;
    ipCategories?: boolean;
    ipIndicatorFeeds?: boolean;
    l4override?: { ip?: string; port?: number } | null;
    notificationSettings?: {
      enabled?: boolean;
      includeContext?: boolean;
      msg?: string;
      supportUrl?: string;
    } | null;
    overrideHost?: string;
    overrideIps?: string[] | null;
    payloadLog?: { enabled?: boolean } | null;
    quarantine?: {
      fileTypes?: (
        | "exe"
        | "pdf"
        | "doc"
        | "docm"
        | "docx"
        | "rtf"
        | "ppt"
        | "pptx"
        | "xls"
        | "xlsm"
        | "xlsx"
        | "zip"
        | "rar"
      )[];
    } | null;
    redirect?: {
      targetUri: string;
      includeContext?: boolean;
      preservePathAndQuery?: boolean;
    } | null;
    resolveDnsInternally?: {
      fallback?: "none" | "public_dns";
      viewId?: string;
    } | null;
    resolveDnsThroughCloudflare?: boolean | null;
    untrustedCert?: { action?: "pass_through" | "block" | "error" } | null;
  };
  /** Body param: Defines the schedule for activating DNS policies. Settable only for `dns` and `dns_resolver` rules. */
  schedule?: {
    fri?: string;
    mon?: string;
    sat?: string;
    sun?: string;
    thu?: string;
    timeZone?: string;
    tue?: string;
    wed?: string;
  } | null;
  /** Body param: Specify the wirefilter expression used for traffic matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatte */
  traffic?: string;
}

export const CreateGatewayRuleRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  action: Schema.Literal(
    "on",
    "off",
    "allow",
    "block",
    "scan",
    "noscan",
    "safesearch",
    "ytrestricted",
    "isolate",
    "noisolate",
    "override",
    "l4_override",
    "egress",
    "resolve",
    "quarantine",
    "redirect",
  ),
  name: Schema.String,
  description: Schema.optional(Schema.String),
  devicePosture: Schema.optional(Schema.String).pipe(
    T.JsonName("device_posture"),
  ),
  enabled: Schema.optional(Schema.Boolean),
  expiration: Schema.optional(
    Schema.Union(
      Schema.Struct({
        expiresAt: Schema.String.pipe(T.JsonName("expires_at")),
        duration: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ),
  filters: Schema.optional(
    Schema.Array(Schema.Literal("http", "dns", "l4", "egress", "dns_resolver")),
  ),
  identity: Schema.optional(Schema.String),
  precedence: Schema.optional(Schema.Number),
  ruleSettings: Schema.optional(
    Schema.Struct({
      addHeaders: Schema.optional(
        Schema.Union(Schema.Struct({}), Schema.Null),
      ).pipe(T.JsonName("add_headers")),
      allowChildBypass: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("allow_child_bypass")),
      auditSsh: Schema.optional(
        Schema.Union(
          Schema.Struct({
            commandLogging: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("command_logging"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("audit_ssh")),
      bisoAdminControls: Schema.optional(
        Schema.Struct({
          copy: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dcp: Schema.optional(Schema.Boolean),
          dd: Schema.optional(Schema.Boolean),
          dk: Schema.optional(Schema.Boolean),
          download: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dp: Schema.optional(Schema.Boolean),
          du: Schema.optional(Schema.Boolean),
          keyboard: Schema.optional(Schema.Literal("enabled", "disabled")),
          paste: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          printing: Schema.optional(Schema.Literal("enabled", "disabled")),
          upload: Schema.optional(Schema.Literal("enabled", "disabled")),
          version: Schema.optional(Schema.Literal("v1", "v2")),
        }),
      ).pipe(T.JsonName("biso_admin_controls")),
      blockPage: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("block_page")),
      blockPageEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("block_page_enabled"),
      ),
      blockReason: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("block_reason")),
      bypassParentRule: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("bypass_parent_rule")),
      checkSession: Schema.optional(
        Schema.Union(
          Schema.Struct({
            duration: Schema.optional(Schema.String),
            enforce: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("check_session")),
      dnsResolvers: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.Array(Schema.Unknown)),
            ipv6: Schema.optional(Schema.Array(Schema.Unknown)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("dns_resolvers")),
      egress: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.String),
            ipv4Fallback: Schema.optional(Schema.String).pipe(
              T.JsonName("ipv4_fallback"),
            ),
            ipv6: Schema.optional(Schema.String),
          }),
          Schema.Null,
        ),
      ),
      ignoreCnameCategoryMatches: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ignore_cname_category_matches"),
      ),
      insecureDisableDnssecValidation: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("insecure_disable_dnssec_validation"),
      ),
      ipCategories: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_categories"),
      ),
      ipIndicatorFeeds: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_indicator_feeds"),
      ),
      l4override: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ip: Schema.optional(Schema.String),
            port: Schema.optional(Schema.Number),
          }),
          Schema.Null,
        ),
      ),
      notificationSettings: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            msg: Schema.optional(Schema.String),
            supportUrl: Schema.optional(Schema.String).pipe(
              T.JsonName("support_url"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("notification_settings")),
      overrideHost: Schema.optional(Schema.String).pipe(
        T.JsonName("override_host"),
      ),
      overrideIps: Schema.optional(
        Schema.Union(Schema.Array(Schema.String), Schema.Null),
      ).pipe(T.JsonName("override_ips")),
      payloadLog: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("payload_log")),
      quarantine: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fileTypes: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "exe",
                  "pdf",
                  "doc",
                  "docm",
                  "docx",
                  "rtf",
                  "ppt",
                  "pptx",
                  "xls",
                  "xlsm",
                  "xlsx",
                  "zip",
                  "rar",
                ),
              ),
            ).pipe(T.JsonName("file_types")),
          }),
          Schema.Null,
        ),
      ),
      redirect: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            preservePathAndQuery: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("preserve_path_and_query"),
            ),
          }),
          Schema.Null,
        ),
      ),
      resolveDnsInternally: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fallback: Schema.optional(Schema.Literal("none", "public_dns")),
            viewId: Schema.optional(Schema.String).pipe(T.JsonName("view_id")),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("resolve_dns_internally")),
      resolveDnsThroughCloudflare: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("resolve_dns_through_cloudflare")),
      untrustedCert: Schema.optional(
        Schema.Union(
          Schema.Struct({
            action: Schema.optional(
              Schema.Literal("pass_through", "block", "error"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("untrusted_cert")),
    }),
  ).pipe(T.JsonName("rule_settings")),
  schedule: Schema.optional(
    Schema.Union(
      Schema.Struct({
        fri: Schema.optional(Schema.String),
        mon: Schema.optional(Schema.String),
        sat: Schema.optional(Schema.String),
        sun: Schema.optional(Schema.String),
        thu: Schema.optional(Schema.String),
        timeZone: Schema.optional(Schema.String).pipe(T.JsonName("time_zone")),
        tue: Schema.optional(Schema.String),
        wed: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ),
  traffic: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/gateway/rules" }),
) as unknown as Schema.Schema<CreateGatewayRuleRequest>;

export interface CreateGatewayRuleResponse {
  /** Specify the action to perform when the associated traffic, identity, and device posture expressions either absent or evaluate to `true`. */
  action:
    | "on"
    | "off"
    | "allow"
    | "block"
    | "scan"
    | "noscan"
    | "safesearch"
    | "ytrestricted"
    | "isolate"
    | "noisolate"
    | "override"
    | "l4_override"
    | "egress"
    | "resolve"
    | "quarantine"
    | "redirect";
  /** Specify whether the rule is enabled. */
  enabled: boolean;
  /** Specify the protocol or layer to evaluate the traffic, identity, and device posture expressions. */
  filters: ("http" | "dns" | "l4" | "egress" | "dns_resolver")[];
  /** Specify the rule name. */
  name: string;
  /** Set the order of your rules. Lower values indicate higher precedence. At each processing phase, evaluate applicable rules in ascending order of this value. Refer to [Order of enforcement](http://devel */
  precedence: number;
  /** Specify the wirefilter expression used for traffic matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expression */
  traffic: string;
  /** Identify the API resource with a UUID. */
  id?: string;
  createdAt?: string;
  /** Indicate the date of deletion, if any. */
  deletedAt?: string | null;
  /** Specify the rule description. */
  description?: string;
  /** Specify the wirefilter expression used for device posture check. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expres */
  devicePosture?: string;
  /** Defines the expiration time stamp and default duration of a DNS policy. Takes precedence over the policy's `schedule` configuration, if any. This does not apply to HTTP or network policies. Settable o */
  expiration?: {
    expiresAt: string;
    duration?: number;
    expired?: boolean;
  } | null;
  /** Specify the wirefilter expression used for identity matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expressio */
  identity?: string;
  /** Indicate that this rule is shared via the Orgs API and read only. */
  readOnly?: boolean;
  /** Set settings related to this rule. Each setting is only valid for specific rule types and can only be used with the appropriate selectors. If Terraform drift is observed in these setting values, verif */
  ruleSettings?: {
    addHeaders?: Record<string, unknown> | null;
    allowChildBypass?: boolean | null;
    auditSsh?: { commandLogging?: boolean } | null;
    bisoAdminControls?: {
      copy?: "enabled" | "disabled" | "remote_only";
      dcp?: boolean;
      dd?: boolean;
      dk?: boolean;
      download?: "enabled" | "disabled" | "remote_only";
      dp?: boolean;
      du?: boolean;
      keyboard?: "enabled" | "disabled";
      paste?: "enabled" | "disabled" | "remote_only";
      printing?: "enabled" | "disabled";
      upload?: "enabled" | "disabled";
      version?: "v1" | "v2";
    };
    blockPage?: { targetUri: string; includeContext?: boolean } | null;
    blockPageEnabled?: boolean;
    blockReason?: string | null;
    bypassParentRule?: boolean | null;
    checkSession?: { duration?: string; enforce?: boolean } | null;
    dnsResolvers?: { ipv4?: unknown[]; ipv6?: unknown[] } | null;
    egress?: { ipv4?: string; ipv4Fallback?: string; ipv6?: string } | null;
    ignoreCnameCategoryMatches?: boolean;
    insecureDisableDnssecValidation?: boolean;
    ipCategories?: boolean;
    ipIndicatorFeeds?: boolean;
    l4override?: { ip?: string; port?: number } | null;
    notificationSettings?: {
      enabled?: boolean;
      includeContext?: boolean;
      msg?: string;
      supportUrl?: string;
    } | null;
    overrideHost?: string;
    overrideIps?: string[] | null;
    payloadLog?: { enabled?: boolean } | null;
    quarantine?: {
      fileTypes?: (
        | "exe"
        | "pdf"
        | "doc"
        | "docm"
        | "docx"
        | "rtf"
        | "ppt"
        | "pptx"
        | "xls"
        | "xlsm"
        | "xlsx"
        | "zip"
        | "rar"
      )[];
    } | null;
    redirect?: {
      targetUri: string;
      includeContext?: boolean;
      preservePathAndQuery?: boolean;
    } | null;
    resolveDnsInternally?: {
      fallback?: "none" | "public_dns";
      viewId?: string;
    } | null;
    resolveDnsThroughCloudflare?: boolean | null;
    untrustedCert?: { action?: "pass_through" | "block" | "error" } | null;
  };
  /** Defines the schedule for activating DNS policies. Settable only for `dns` and `dns_resolver` rules. */
  schedule?: {
    fri?: string;
    mon?: string;
    sat?: string;
    sun?: string;
    thu?: string;
    timeZone?: string;
    tue?: string;
    wed?: string;
  } | null;
  /** Indicate that this rule is sharable via the Orgs API. */
  sharable?: boolean;
  /** Provide the account tag of the account that created the rule. */
  sourceAccount?: string;
  updatedAt?: string;
  /** Indicate the version number of the rule(read-only). */
  version?: number;
  /** Indicate a warning for a misconfigured rule, if any. */
  warningStatus?: string | null;
}

export const CreateGatewayRuleResponse = Schema.Struct({
  action: Schema.Literal(
    "on",
    "off",
    "allow",
    "block",
    "scan",
    "noscan",
    "safesearch",
    "ytrestricted",
    "isolate",
    "noisolate",
    "override",
    "l4_override",
    "egress",
    "resolve",
    "quarantine",
    "redirect",
  ),
  enabled: Schema.Boolean,
  filters: Schema.Array(
    Schema.Literal("http", "dns", "l4", "egress", "dns_resolver"),
  ),
  name: Schema.String,
  precedence: Schema.Number,
  traffic: Schema.String,
  id: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("deleted_at"),
  ),
  description: Schema.optional(Schema.String),
  devicePosture: Schema.optional(Schema.String).pipe(
    T.JsonName("device_posture"),
  ),
  expiration: Schema.optional(
    Schema.Union(
      Schema.Struct({
        expiresAt: Schema.String.pipe(T.JsonName("expires_at")),
        duration: Schema.optional(Schema.Number),
        expired: Schema.optional(Schema.Boolean),
      }),
      Schema.Null,
    ),
  ),
  identity: Schema.optional(Schema.String),
  readOnly: Schema.optional(Schema.Boolean).pipe(T.JsonName("read_only")),
  ruleSettings: Schema.optional(
    Schema.Struct({
      addHeaders: Schema.optional(
        Schema.Union(Schema.Struct({}), Schema.Null),
      ).pipe(T.JsonName("add_headers")),
      allowChildBypass: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("allow_child_bypass")),
      auditSsh: Schema.optional(
        Schema.Union(
          Schema.Struct({
            commandLogging: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("command_logging"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("audit_ssh")),
      bisoAdminControls: Schema.optional(
        Schema.Struct({
          copy: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dcp: Schema.optional(Schema.Boolean),
          dd: Schema.optional(Schema.Boolean),
          dk: Schema.optional(Schema.Boolean),
          download: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dp: Schema.optional(Schema.Boolean),
          du: Schema.optional(Schema.Boolean),
          keyboard: Schema.optional(Schema.Literal("enabled", "disabled")),
          paste: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          printing: Schema.optional(Schema.Literal("enabled", "disabled")),
          upload: Schema.optional(Schema.Literal("enabled", "disabled")),
          version: Schema.optional(Schema.Literal("v1", "v2")),
        }),
      ).pipe(T.JsonName("biso_admin_controls")),
      blockPage: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("block_page")),
      blockPageEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("block_page_enabled"),
      ),
      blockReason: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("block_reason")),
      bypassParentRule: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("bypass_parent_rule")),
      checkSession: Schema.optional(
        Schema.Union(
          Schema.Struct({
            duration: Schema.optional(Schema.String),
            enforce: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("check_session")),
      dnsResolvers: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.Array(Schema.Unknown)),
            ipv6: Schema.optional(Schema.Array(Schema.Unknown)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("dns_resolvers")),
      egress: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.String),
            ipv4Fallback: Schema.optional(Schema.String).pipe(
              T.JsonName("ipv4_fallback"),
            ),
            ipv6: Schema.optional(Schema.String),
          }),
          Schema.Null,
        ),
      ),
      ignoreCnameCategoryMatches: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ignore_cname_category_matches"),
      ),
      insecureDisableDnssecValidation: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("insecure_disable_dnssec_validation"),
      ),
      ipCategories: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_categories"),
      ),
      ipIndicatorFeeds: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_indicator_feeds"),
      ),
      l4override: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ip: Schema.optional(Schema.String),
            port: Schema.optional(Schema.Number),
          }),
          Schema.Null,
        ),
      ),
      notificationSettings: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            msg: Schema.optional(Schema.String),
            supportUrl: Schema.optional(Schema.String).pipe(
              T.JsonName("support_url"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("notification_settings")),
      overrideHost: Schema.optional(Schema.String).pipe(
        T.JsonName("override_host"),
      ),
      overrideIps: Schema.optional(
        Schema.Union(Schema.Array(Schema.String), Schema.Null),
      ).pipe(T.JsonName("override_ips")),
      payloadLog: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("payload_log")),
      quarantine: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fileTypes: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "exe",
                  "pdf",
                  "doc",
                  "docm",
                  "docx",
                  "rtf",
                  "ppt",
                  "pptx",
                  "xls",
                  "xlsm",
                  "xlsx",
                  "zip",
                  "rar",
                ),
              ),
            ).pipe(T.JsonName("file_types")),
          }),
          Schema.Null,
        ),
      ),
      redirect: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            preservePathAndQuery: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("preserve_path_and_query"),
            ),
          }),
          Schema.Null,
        ),
      ),
      resolveDnsInternally: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fallback: Schema.optional(Schema.Literal("none", "public_dns")),
            viewId: Schema.optional(Schema.String).pipe(T.JsonName("view_id")),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("resolve_dns_internally")),
      resolveDnsThroughCloudflare: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("resolve_dns_through_cloudflare")),
      untrustedCert: Schema.optional(
        Schema.Union(
          Schema.Struct({
            action: Schema.optional(
              Schema.Literal("pass_through", "block", "error"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("untrusted_cert")),
    }),
  ).pipe(T.JsonName("rule_settings")),
  schedule: Schema.optional(
    Schema.Union(
      Schema.Struct({
        fri: Schema.optional(Schema.String),
        mon: Schema.optional(Schema.String),
        sat: Schema.optional(Schema.String),
        sun: Schema.optional(Schema.String),
        thu: Schema.optional(Schema.String),
        timeZone: Schema.optional(Schema.String).pipe(T.JsonName("time_zone")),
        tue: Schema.optional(Schema.String),
        wed: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ),
  sharable: Schema.optional(Schema.Boolean),
  sourceAccount: Schema.optional(Schema.String).pipe(
    T.JsonName("source_account"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  version: Schema.optional(Schema.Number),
  warningStatus: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("warning_status"),
  ),
}) as unknown as Schema.Schema<CreateGatewayRuleResponse>;

export const createGatewayRule: (
  input: CreateGatewayRuleRequest,
) => Effect.Effect<
  CreateGatewayRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateGatewayRuleRequest,
  output: CreateGatewayRuleResponse,
  errors: [],
}));

export interface UpdateGatewayRuleRequest {
  ruleId: string;
  /** Path param: */
  accountId: string;
  /** Body param: Specify the action to perform when the associated traffic, identity, and device posture expressions either absent or evaluate to `true`. */
  action:
    | "on"
    | "off"
    | "allow"
    | "block"
    | "scan"
    | "noscan"
    | "safesearch"
    | "ytrestricted"
    | "isolate"
    | "noisolate"
    | "override"
    | "l4_override"
    | "egress"
    | "resolve"
    | "quarantine"
    | "redirect";
  /** Body param: Specify the rule name. */
  name: string;
  /** Body param: Specify the rule description. */
  description?: string;
  /** Body param: Specify the wirefilter expression used for device posture check. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the form */
  devicePosture?: string;
  /** Body param: Specify whether the rule is enabled. */
  enabled?: boolean;
  /** Body param: Defines the expiration time stamp and default duration of a DNS policy. Takes precedence over the policy's `schedule` configuration, if any. This does not apply to HTTP or network policies */
  expiration?: { expiresAt: string; duration?: number } | null;
  /** Body param: Specify the protocol or layer to evaluate the traffic, identity, and device posture expressions. */
  filters?: ("http" | "dns" | "l4" | "egress" | "dns_resolver")[];
  /** Body param: Specify the wirefilter expression used for identity matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatt */
  identity?: string;
  /** Body param: Set the order of your rules. Lower values indicate higher precedence. At each processing phase, evaluate applicable rules in ascending order of this value. Refer to [Order of enforcement]( */
  precedence?: number;
  /** Body param: Set settings related to this rule. Each setting is only valid for specific rule types and can only be used with the appropriate selectors. If Terraform drift is observed in these setting v */
  ruleSettings?: {
    addHeaders?: Record<string, unknown> | null;
    allowChildBypass?: boolean | null;
    auditSsh?: { commandLogging?: boolean } | null;
    bisoAdminControls?: {
      copy?: "enabled" | "disabled" | "remote_only";
      dcp?: boolean;
      dd?: boolean;
      dk?: boolean;
      download?: "enabled" | "disabled" | "remote_only";
      dp?: boolean;
      du?: boolean;
      keyboard?: "enabled" | "disabled";
      paste?: "enabled" | "disabled" | "remote_only";
      printing?: "enabled" | "disabled";
      upload?: "enabled" | "disabled";
      version?: "v1" | "v2";
    };
    blockPage?: { targetUri: string; includeContext?: boolean } | null;
    blockPageEnabled?: boolean;
    blockReason?: string | null;
    bypassParentRule?: boolean | null;
    checkSession?: { duration?: string; enforce?: boolean } | null;
    dnsResolvers?: { ipv4?: unknown[]; ipv6?: unknown[] } | null;
    egress?: { ipv4?: string; ipv4Fallback?: string; ipv6?: string } | null;
    ignoreCnameCategoryMatches?: boolean;
    insecureDisableDnssecValidation?: boolean;
    ipCategories?: boolean;
    ipIndicatorFeeds?: boolean;
    l4override?: { ip?: string; port?: number } | null;
    notificationSettings?: {
      enabled?: boolean;
      includeContext?: boolean;
      msg?: string;
      supportUrl?: string;
    } | null;
    overrideHost?: string;
    overrideIps?: string[] | null;
    payloadLog?: { enabled?: boolean } | null;
    quarantine?: {
      fileTypes?: (
        | "exe"
        | "pdf"
        | "doc"
        | "docm"
        | "docx"
        | "rtf"
        | "ppt"
        | "pptx"
        | "xls"
        | "xlsm"
        | "xlsx"
        | "zip"
        | "rar"
      )[];
    } | null;
    redirect?: {
      targetUri: string;
      includeContext?: boolean;
      preservePathAndQuery?: boolean;
    } | null;
    resolveDnsInternally?: {
      fallback?: "none" | "public_dns";
      viewId?: string;
    } | null;
    resolveDnsThroughCloudflare?: boolean | null;
    untrustedCert?: { action?: "pass_through" | "block" | "error" } | null;
  };
  /** Body param: Defines the schedule for activating DNS policies. Settable only for `dns` and `dns_resolver` rules. */
  schedule?: {
    fri?: string;
    mon?: string;
    sat?: string;
    sun?: string;
    thu?: string;
    timeZone?: string;
    tue?: string;
    wed?: string;
  } | null;
  /** Body param: Specify the wirefilter expression used for traffic matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatte */
  traffic?: string;
}

export const UpdateGatewayRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  action: Schema.Literal(
    "on",
    "off",
    "allow",
    "block",
    "scan",
    "noscan",
    "safesearch",
    "ytrestricted",
    "isolate",
    "noisolate",
    "override",
    "l4_override",
    "egress",
    "resolve",
    "quarantine",
    "redirect",
  ),
  name: Schema.String,
  description: Schema.optional(Schema.String),
  devicePosture: Schema.optional(Schema.String).pipe(
    T.JsonName("device_posture"),
  ),
  enabled: Schema.optional(Schema.Boolean),
  expiration: Schema.optional(
    Schema.Union(
      Schema.Struct({
        expiresAt: Schema.String.pipe(T.JsonName("expires_at")),
        duration: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ),
  filters: Schema.optional(
    Schema.Array(Schema.Literal("http", "dns", "l4", "egress", "dns_resolver")),
  ),
  identity: Schema.optional(Schema.String),
  precedence: Schema.optional(Schema.Number),
  ruleSettings: Schema.optional(
    Schema.Struct({
      addHeaders: Schema.optional(
        Schema.Union(Schema.Struct({}), Schema.Null),
      ).pipe(T.JsonName("add_headers")),
      allowChildBypass: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("allow_child_bypass")),
      auditSsh: Schema.optional(
        Schema.Union(
          Schema.Struct({
            commandLogging: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("command_logging"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("audit_ssh")),
      bisoAdminControls: Schema.optional(
        Schema.Struct({
          copy: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dcp: Schema.optional(Schema.Boolean),
          dd: Schema.optional(Schema.Boolean),
          dk: Schema.optional(Schema.Boolean),
          download: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dp: Schema.optional(Schema.Boolean),
          du: Schema.optional(Schema.Boolean),
          keyboard: Schema.optional(Schema.Literal("enabled", "disabled")),
          paste: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          printing: Schema.optional(Schema.Literal("enabled", "disabled")),
          upload: Schema.optional(Schema.Literal("enabled", "disabled")),
          version: Schema.optional(Schema.Literal("v1", "v2")),
        }),
      ).pipe(T.JsonName("biso_admin_controls")),
      blockPage: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("block_page")),
      blockPageEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("block_page_enabled"),
      ),
      blockReason: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("block_reason")),
      bypassParentRule: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("bypass_parent_rule")),
      checkSession: Schema.optional(
        Schema.Union(
          Schema.Struct({
            duration: Schema.optional(Schema.String),
            enforce: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("check_session")),
      dnsResolvers: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.Array(Schema.Unknown)),
            ipv6: Schema.optional(Schema.Array(Schema.Unknown)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("dns_resolvers")),
      egress: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.String),
            ipv4Fallback: Schema.optional(Schema.String).pipe(
              T.JsonName("ipv4_fallback"),
            ),
            ipv6: Schema.optional(Schema.String),
          }),
          Schema.Null,
        ),
      ),
      ignoreCnameCategoryMatches: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ignore_cname_category_matches"),
      ),
      insecureDisableDnssecValidation: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("insecure_disable_dnssec_validation"),
      ),
      ipCategories: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_categories"),
      ),
      ipIndicatorFeeds: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_indicator_feeds"),
      ),
      l4override: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ip: Schema.optional(Schema.String),
            port: Schema.optional(Schema.Number),
          }),
          Schema.Null,
        ),
      ),
      notificationSettings: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            msg: Schema.optional(Schema.String),
            supportUrl: Schema.optional(Schema.String).pipe(
              T.JsonName("support_url"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("notification_settings")),
      overrideHost: Schema.optional(Schema.String).pipe(
        T.JsonName("override_host"),
      ),
      overrideIps: Schema.optional(
        Schema.Union(Schema.Array(Schema.String), Schema.Null),
      ).pipe(T.JsonName("override_ips")),
      payloadLog: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("payload_log")),
      quarantine: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fileTypes: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "exe",
                  "pdf",
                  "doc",
                  "docm",
                  "docx",
                  "rtf",
                  "ppt",
                  "pptx",
                  "xls",
                  "xlsm",
                  "xlsx",
                  "zip",
                  "rar",
                ),
              ),
            ).pipe(T.JsonName("file_types")),
          }),
          Schema.Null,
        ),
      ),
      redirect: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            preservePathAndQuery: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("preserve_path_and_query"),
            ),
          }),
          Schema.Null,
        ),
      ),
      resolveDnsInternally: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fallback: Schema.optional(Schema.Literal("none", "public_dns")),
            viewId: Schema.optional(Schema.String).pipe(T.JsonName("view_id")),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("resolve_dns_internally")),
      resolveDnsThroughCloudflare: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("resolve_dns_through_cloudflare")),
      untrustedCert: Schema.optional(
        Schema.Union(
          Schema.Struct({
            action: Schema.optional(
              Schema.Literal("pass_through", "block", "error"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("untrusted_cert")),
    }),
  ).pipe(T.JsonName("rule_settings")),
  schedule: Schema.optional(
    Schema.Union(
      Schema.Struct({
        fri: Schema.optional(Schema.String),
        mon: Schema.optional(Schema.String),
        sat: Schema.optional(Schema.String),
        sun: Schema.optional(Schema.String),
        thu: Schema.optional(Schema.String),
        timeZone: Schema.optional(Schema.String).pipe(T.JsonName("time_zone")),
        tue: Schema.optional(Schema.String),
        wed: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ),
  traffic: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/gateway/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<UpdateGatewayRuleRequest>;

export interface UpdateGatewayRuleResponse {
  /** Specify the action to perform when the associated traffic, identity, and device posture expressions either absent or evaluate to `true`. */
  action:
    | "on"
    | "off"
    | "allow"
    | "block"
    | "scan"
    | "noscan"
    | "safesearch"
    | "ytrestricted"
    | "isolate"
    | "noisolate"
    | "override"
    | "l4_override"
    | "egress"
    | "resolve"
    | "quarantine"
    | "redirect";
  /** Specify whether the rule is enabled. */
  enabled: boolean;
  /** Specify the protocol or layer to evaluate the traffic, identity, and device posture expressions. */
  filters: ("http" | "dns" | "l4" | "egress" | "dns_resolver")[];
  /** Specify the rule name. */
  name: string;
  /** Set the order of your rules. Lower values indicate higher precedence. At each processing phase, evaluate applicable rules in ascending order of this value. Refer to [Order of enforcement](http://devel */
  precedence: number;
  /** Specify the wirefilter expression used for traffic matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expression */
  traffic: string;
  /** Identify the API resource with a UUID. */
  id?: string;
  createdAt?: string;
  /** Indicate the date of deletion, if any. */
  deletedAt?: string | null;
  /** Specify the rule description. */
  description?: string;
  /** Specify the wirefilter expression used for device posture check. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expres */
  devicePosture?: string;
  /** Defines the expiration time stamp and default duration of a DNS policy. Takes precedence over the policy's `schedule` configuration, if any. This does not apply to HTTP or network policies. Settable o */
  expiration?: {
    expiresAt: string;
    duration?: number;
    expired?: boolean;
  } | null;
  /** Specify the wirefilter expression used for identity matching. The API automatically formats and sanitizes expressions before storing them. To prevent Terraform state drift, use the formatted expressio */
  identity?: string;
  /** Indicate that this rule is shared via the Orgs API and read only. */
  readOnly?: boolean;
  /** Set settings related to this rule. Each setting is only valid for specific rule types and can only be used with the appropriate selectors. If Terraform drift is observed in these setting values, verif */
  ruleSettings?: {
    addHeaders?: Record<string, unknown> | null;
    allowChildBypass?: boolean | null;
    auditSsh?: { commandLogging?: boolean } | null;
    bisoAdminControls?: {
      copy?: "enabled" | "disabled" | "remote_only";
      dcp?: boolean;
      dd?: boolean;
      dk?: boolean;
      download?: "enabled" | "disabled" | "remote_only";
      dp?: boolean;
      du?: boolean;
      keyboard?: "enabled" | "disabled";
      paste?: "enabled" | "disabled" | "remote_only";
      printing?: "enabled" | "disabled";
      upload?: "enabled" | "disabled";
      version?: "v1" | "v2";
    };
    blockPage?: { targetUri: string; includeContext?: boolean } | null;
    blockPageEnabled?: boolean;
    blockReason?: string | null;
    bypassParentRule?: boolean | null;
    checkSession?: { duration?: string; enforce?: boolean } | null;
    dnsResolvers?: { ipv4?: unknown[]; ipv6?: unknown[] } | null;
    egress?: { ipv4?: string; ipv4Fallback?: string; ipv6?: string } | null;
    ignoreCnameCategoryMatches?: boolean;
    insecureDisableDnssecValidation?: boolean;
    ipCategories?: boolean;
    ipIndicatorFeeds?: boolean;
    l4override?: { ip?: string; port?: number } | null;
    notificationSettings?: {
      enabled?: boolean;
      includeContext?: boolean;
      msg?: string;
      supportUrl?: string;
    } | null;
    overrideHost?: string;
    overrideIps?: string[] | null;
    payloadLog?: { enabled?: boolean } | null;
    quarantine?: {
      fileTypes?: (
        | "exe"
        | "pdf"
        | "doc"
        | "docm"
        | "docx"
        | "rtf"
        | "ppt"
        | "pptx"
        | "xls"
        | "xlsm"
        | "xlsx"
        | "zip"
        | "rar"
      )[];
    } | null;
    redirect?: {
      targetUri: string;
      includeContext?: boolean;
      preservePathAndQuery?: boolean;
    } | null;
    resolveDnsInternally?: {
      fallback?: "none" | "public_dns";
      viewId?: string;
    } | null;
    resolveDnsThroughCloudflare?: boolean | null;
    untrustedCert?: { action?: "pass_through" | "block" | "error" } | null;
  };
  /** Defines the schedule for activating DNS policies. Settable only for `dns` and `dns_resolver` rules. */
  schedule?: {
    fri?: string;
    mon?: string;
    sat?: string;
    sun?: string;
    thu?: string;
    timeZone?: string;
    tue?: string;
    wed?: string;
  } | null;
  /** Indicate that this rule is sharable via the Orgs API. */
  sharable?: boolean;
  /** Provide the account tag of the account that created the rule. */
  sourceAccount?: string;
  updatedAt?: string;
  /** Indicate the version number of the rule(read-only). */
  version?: number;
  /** Indicate a warning for a misconfigured rule, if any. */
  warningStatus?: string | null;
}

export const UpdateGatewayRuleResponse = Schema.Struct({
  action: Schema.Literal(
    "on",
    "off",
    "allow",
    "block",
    "scan",
    "noscan",
    "safesearch",
    "ytrestricted",
    "isolate",
    "noisolate",
    "override",
    "l4_override",
    "egress",
    "resolve",
    "quarantine",
    "redirect",
  ),
  enabled: Schema.Boolean,
  filters: Schema.Array(
    Schema.Literal("http", "dns", "l4", "egress", "dns_resolver"),
  ),
  name: Schema.String,
  precedence: Schema.Number,
  traffic: Schema.String,
  id: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("deleted_at"),
  ),
  description: Schema.optional(Schema.String),
  devicePosture: Schema.optional(Schema.String).pipe(
    T.JsonName("device_posture"),
  ),
  expiration: Schema.optional(
    Schema.Union(
      Schema.Struct({
        expiresAt: Schema.String.pipe(T.JsonName("expires_at")),
        duration: Schema.optional(Schema.Number),
        expired: Schema.optional(Schema.Boolean),
      }),
      Schema.Null,
    ),
  ),
  identity: Schema.optional(Schema.String),
  readOnly: Schema.optional(Schema.Boolean).pipe(T.JsonName("read_only")),
  ruleSettings: Schema.optional(
    Schema.Struct({
      addHeaders: Schema.optional(
        Schema.Union(Schema.Struct({}), Schema.Null),
      ).pipe(T.JsonName("add_headers")),
      allowChildBypass: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("allow_child_bypass")),
      auditSsh: Schema.optional(
        Schema.Union(
          Schema.Struct({
            commandLogging: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("command_logging"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("audit_ssh")),
      bisoAdminControls: Schema.optional(
        Schema.Struct({
          copy: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dcp: Schema.optional(Schema.Boolean),
          dd: Schema.optional(Schema.Boolean),
          dk: Schema.optional(Schema.Boolean),
          download: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          dp: Schema.optional(Schema.Boolean),
          du: Schema.optional(Schema.Boolean),
          keyboard: Schema.optional(Schema.Literal("enabled", "disabled")),
          paste: Schema.optional(
            Schema.Literal("enabled", "disabled", "remote_only"),
          ),
          printing: Schema.optional(Schema.Literal("enabled", "disabled")),
          upload: Schema.optional(Schema.Literal("enabled", "disabled")),
          version: Schema.optional(Schema.Literal("v1", "v2")),
        }),
      ).pipe(T.JsonName("biso_admin_controls")),
      blockPage: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("block_page")),
      blockPageEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("block_page_enabled"),
      ),
      blockReason: Schema.optional(
        Schema.Union(Schema.String, Schema.Null),
      ).pipe(T.JsonName("block_reason")),
      bypassParentRule: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("bypass_parent_rule")),
      checkSession: Schema.optional(
        Schema.Union(
          Schema.Struct({
            duration: Schema.optional(Schema.String),
            enforce: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("check_session")),
      dnsResolvers: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.Array(Schema.Unknown)),
            ipv6: Schema.optional(Schema.Array(Schema.Unknown)),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("dns_resolvers")),
      egress: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ipv4: Schema.optional(Schema.String),
            ipv4Fallback: Schema.optional(Schema.String).pipe(
              T.JsonName("ipv4_fallback"),
            ),
            ipv6: Schema.optional(Schema.String),
          }),
          Schema.Null,
        ),
      ),
      ignoreCnameCategoryMatches: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ignore_cname_category_matches"),
      ),
      insecureDisableDnssecValidation: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("insecure_disable_dnssec_validation"),
      ),
      ipCategories: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_categories"),
      ),
      ipIndicatorFeeds: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("ip_indicator_feeds"),
      ),
      l4override: Schema.optional(
        Schema.Union(
          Schema.Struct({
            ip: Schema.optional(Schema.String),
            port: Schema.optional(Schema.Number),
          }),
          Schema.Null,
        ),
      ),
      notificationSettings: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            msg: Schema.optional(Schema.String),
            supportUrl: Schema.optional(Schema.String).pipe(
              T.JsonName("support_url"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("notification_settings")),
      overrideHost: Schema.optional(Schema.String).pipe(
        T.JsonName("override_host"),
      ),
      overrideIps: Schema.optional(
        Schema.Union(Schema.Array(Schema.String), Schema.Null),
      ).pipe(T.JsonName("override_ips")),
      payloadLog: Schema.optional(
        Schema.Union(
          Schema.Struct({
            enabled: Schema.optional(Schema.Boolean),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("payload_log")),
      quarantine: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fileTypes: Schema.optional(
              Schema.Array(
                Schema.Literal(
                  "exe",
                  "pdf",
                  "doc",
                  "docm",
                  "docx",
                  "rtf",
                  "ppt",
                  "pptx",
                  "xls",
                  "xlsm",
                  "xlsx",
                  "zip",
                  "rar",
                ),
              ),
            ).pipe(T.JsonName("file_types")),
          }),
          Schema.Null,
        ),
      ),
      redirect: Schema.optional(
        Schema.Union(
          Schema.Struct({
            targetUri: Schema.String.pipe(T.JsonName("target_uri")),
            includeContext: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("include_context"),
            ),
            preservePathAndQuery: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("preserve_path_and_query"),
            ),
          }),
          Schema.Null,
        ),
      ),
      resolveDnsInternally: Schema.optional(
        Schema.Union(
          Schema.Struct({
            fallback: Schema.optional(Schema.Literal("none", "public_dns")),
            viewId: Schema.optional(Schema.String).pipe(T.JsonName("view_id")),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("resolve_dns_internally")),
      resolveDnsThroughCloudflare: Schema.optional(
        Schema.Union(Schema.Boolean, Schema.Null),
      ).pipe(T.JsonName("resolve_dns_through_cloudflare")),
      untrustedCert: Schema.optional(
        Schema.Union(
          Schema.Struct({
            action: Schema.optional(
              Schema.Literal("pass_through", "block", "error"),
            ),
          }),
          Schema.Null,
        ),
      ).pipe(T.JsonName("untrusted_cert")),
    }),
  ).pipe(T.JsonName("rule_settings")),
  schedule: Schema.optional(
    Schema.Union(
      Schema.Struct({
        fri: Schema.optional(Schema.String),
        mon: Schema.optional(Schema.String),
        sat: Schema.optional(Schema.String),
        sun: Schema.optional(Schema.String),
        thu: Schema.optional(Schema.String),
        timeZone: Schema.optional(Schema.String).pipe(T.JsonName("time_zone")),
        tue: Schema.optional(Schema.String),
        wed: Schema.optional(Schema.String),
      }),
      Schema.Null,
    ),
  ),
  sharable: Schema.optional(Schema.Boolean),
  sourceAccount: Schema.optional(Schema.String).pipe(
    T.JsonName("source_account"),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  version: Schema.optional(Schema.Number),
  warningStatus: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("warning_status"),
  ),
}) as unknown as Schema.Schema<UpdateGatewayRuleResponse>;

export const updateGatewayRule: (
  input: UpdateGatewayRuleRequest,
) => Effect.Effect<
  UpdateGatewayRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateGatewayRuleRequest,
  output: UpdateGatewayRuleResponse,
  errors: [],
}));

export interface DeleteGatewayRuleRequest {
  ruleId: string;
  accountId: string;
}

export const DeleteGatewayRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/gateway/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<DeleteGatewayRuleRequest>;

export type DeleteGatewayRuleResponse = unknown;

export const DeleteGatewayRuleResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteGatewayRuleResponse>;

export const deleteGatewayRule: (
  input: DeleteGatewayRuleRequest,
) => Effect.Effect<
  DeleteGatewayRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteGatewayRuleRequest,
  output: DeleteGatewayRuleResponse,
  errors: [],
}));

// =============================================================================
// IdentityProvider
// =============================================================================

export interface GetIdentityProviderRequest {
  identityProviderId: string;
}

export const GetIdentityProviderRequest = Schema.Struct({
  identityProviderId: Schema.String.pipe(T.HttpPath("identityProviderId")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/access/identity_providers/{identityProviderId}",
  }),
) as unknown as Schema.Schema<GetIdentityProviderRequest>;

export type GetIdentityProviderResponse =
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        conditionalAccessEnabled?: boolean;
        directoryId?: string;
        emailClaimName?: string;
        prompt?: "login" | "select_account" | "none";
        supportGroups?: boolean;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      accountId?: string;
      zoneId?: string;
      scimConfig?: {
        enabled?: boolean;
        identityUpdateBehavior?: "automatic" | "reauth" | "no_action";
        seatDeprovision?: boolean;
        userDeprovision?: boolean;
      };
    }
  | {
      config: {
        centrifyAccount?: string;
        centrifyAppId?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: unknown;
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        appsDomain?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        authUrl?: string;
        certsUrl?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        pkceEnabled?: boolean;
        scopes?: string[];
        tokenUrl?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        authorizationServerId?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        oktaAccount?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        oneloginAccount?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        pingEnvId?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        attributes?: string[];
        emailAttributeName?: string;
        headerAttributes?: { attributeName?: string; headerName?: string }[];
        idpPublicCerts?: string[];
        issuerUrl?: string;
        signRequest?: boolean;
        ssoTargetUrl?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    };

export const GetIdentityProviderResponse = Schema.Union(
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      conditionalAccessEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("conditional_access_enabled"),
      ),
      directoryId: Schema.optional(Schema.String).pipe(
        T.JsonName("directory_id"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      prompt: Schema.optional(
        Schema.Literal("login", "select_account", "none"),
      ),
      supportGroups: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("support_groups"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
    zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
    scimConfig: Schema.optional(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        identityUpdateBehavior: Schema.optional(
          Schema.Literal("automatic", "reauth", "no_action"),
        ).pipe(T.JsonName("identity_update_behavior")),
        seatDeprovision: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("seat_deprovision"),
        ),
        userDeprovision: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("user_deprovision"),
        ),
      }),
    ).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      centrifyAccount: Schema.optional(Schema.String).pipe(
        T.JsonName("centrify_account"),
      ),
      centrifyAppId: Schema.optional(Schema.String).pipe(
        T.JsonName("centrify_app_id"),
      ),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Unknown,
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      appsDomain: Schema.optional(Schema.String).pipe(
        T.JsonName("apps_domain"),
      ),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      authUrl: Schema.optional(Schema.String).pipe(T.JsonName("auth_url")),
      certsUrl: Schema.optional(Schema.String).pipe(T.JsonName("certs_url")),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      pkceEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("pkce_enabled"),
      ),
      scopes: Schema.optional(Schema.Array(Schema.String)),
      tokenUrl: Schema.optional(Schema.String).pipe(T.JsonName("token_url")),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      authorizationServerId: Schema.optional(Schema.String).pipe(
        T.JsonName("authorization_server_id"),
      ),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      oktaAccount: Schema.optional(Schema.String).pipe(
        T.JsonName("okta_account"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      oneloginAccount: Schema.optional(Schema.String).pipe(
        T.JsonName("onelogin_account"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      pingEnvId: Schema.optional(Schema.String).pipe(T.JsonName("ping_env_id")),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      attributes: Schema.optional(Schema.Array(Schema.String)),
      emailAttributeName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_attribute_name"),
      ),
      headerAttributes: Schema.optional(
        Schema.Array(
          Schema.Struct({
            attributeName: Schema.optional(Schema.String).pipe(
              T.JsonName("attribute_name"),
            ),
            headerName: Schema.optional(Schema.String).pipe(
              T.JsonName("header_name"),
            ),
          }),
        ),
      ).pipe(T.JsonName("header_attributes")),
      idpPublicCerts: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("idp_public_certs"),
      ),
      issuerUrl: Schema.optional(Schema.String).pipe(T.JsonName("issuer_url")),
      signRequest: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("sign_request"),
      ),
      ssoTargetUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("sso_target_url"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
) as unknown as Schema.Schema<GetIdentityProviderResponse>;

export const getIdentityProvider: (
  input: GetIdentityProviderRequest,
) => Effect.Effect<
  GetIdentityProviderResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetIdentityProviderRequest,
  output: GetIdentityProviderResponse,
  errors: [],
}));

export interface CreateIdentityProviderRequest {}

export const CreateIdentityProviderRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/access/identity_providers",
  }),
) as unknown as Schema.Schema<CreateIdentityProviderRequest>;

export type CreateIdentityProviderResponse =
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        conditionalAccessEnabled?: boolean;
        directoryId?: string;
        emailClaimName?: string;
        prompt?: "login" | "select_account" | "none";
        supportGroups?: boolean;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      accountId?: string;
      zoneId?: string;
      scimConfig?: {
        enabled?: boolean;
        identityUpdateBehavior?: "automatic" | "reauth" | "no_action";
        seatDeprovision?: boolean;
        userDeprovision?: boolean;
      };
    }
  | {
      config: {
        centrifyAccount?: string;
        centrifyAppId?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: unknown;
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        appsDomain?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        authUrl?: string;
        certsUrl?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        pkceEnabled?: boolean;
        scopes?: string[];
        tokenUrl?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        authorizationServerId?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        oktaAccount?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        oneloginAccount?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        pingEnvId?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        attributes?: string[];
        emailAttributeName?: string;
        headerAttributes?: { attributeName?: string; headerName?: string }[];
        idpPublicCerts?: string[];
        issuerUrl?: string;
        signRequest?: boolean;
        ssoTargetUrl?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    };

export const CreateIdentityProviderResponse = Schema.Union(
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      conditionalAccessEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("conditional_access_enabled"),
      ),
      directoryId: Schema.optional(Schema.String).pipe(
        T.JsonName("directory_id"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      prompt: Schema.optional(
        Schema.Literal("login", "select_account", "none"),
      ),
      supportGroups: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("support_groups"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
    zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
    scimConfig: Schema.optional(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        identityUpdateBehavior: Schema.optional(
          Schema.Literal("automatic", "reauth", "no_action"),
        ).pipe(T.JsonName("identity_update_behavior")),
        seatDeprovision: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("seat_deprovision"),
        ),
        userDeprovision: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("user_deprovision"),
        ),
      }),
    ).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      centrifyAccount: Schema.optional(Schema.String).pipe(
        T.JsonName("centrify_account"),
      ),
      centrifyAppId: Schema.optional(Schema.String).pipe(
        T.JsonName("centrify_app_id"),
      ),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Unknown,
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      appsDomain: Schema.optional(Schema.String).pipe(
        T.JsonName("apps_domain"),
      ),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      authUrl: Schema.optional(Schema.String).pipe(T.JsonName("auth_url")),
      certsUrl: Schema.optional(Schema.String).pipe(T.JsonName("certs_url")),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      pkceEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("pkce_enabled"),
      ),
      scopes: Schema.optional(Schema.Array(Schema.String)),
      tokenUrl: Schema.optional(Schema.String).pipe(T.JsonName("token_url")),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      authorizationServerId: Schema.optional(Schema.String).pipe(
        T.JsonName("authorization_server_id"),
      ),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      oktaAccount: Schema.optional(Schema.String).pipe(
        T.JsonName("okta_account"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      oneloginAccount: Schema.optional(Schema.String).pipe(
        T.JsonName("onelogin_account"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      pingEnvId: Schema.optional(Schema.String).pipe(T.JsonName("ping_env_id")),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      attributes: Schema.optional(Schema.Array(Schema.String)),
      emailAttributeName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_attribute_name"),
      ),
      headerAttributes: Schema.optional(
        Schema.Array(
          Schema.Struct({
            attributeName: Schema.optional(Schema.String).pipe(
              T.JsonName("attribute_name"),
            ),
            headerName: Schema.optional(Schema.String).pipe(
              T.JsonName("header_name"),
            ),
          }),
        ),
      ).pipe(T.JsonName("header_attributes")),
      idpPublicCerts: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("idp_public_certs"),
      ),
      issuerUrl: Schema.optional(Schema.String).pipe(T.JsonName("issuer_url")),
      signRequest: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("sign_request"),
      ),
      ssoTargetUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("sso_target_url"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
) as unknown as Schema.Schema<CreateIdentityProviderResponse>;

export const createIdentityProvider: (
  input: CreateIdentityProviderRequest,
) => Effect.Effect<
  CreateIdentityProviderResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateIdentityProviderRequest,
  output: CreateIdentityProviderResponse,
  errors: [],
}));

export interface UpdateIdentityProviderRequest {
  identityProviderId: string;
}

export const UpdateIdentityProviderRequest = Schema.Struct({
  identityProviderId: Schema.String.pipe(T.HttpPath("identityProviderId")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/{accountOrZone}/{accountOrZoneId}/access/identity_providers/{identityProviderId}",
  }),
) as unknown as Schema.Schema<UpdateIdentityProviderRequest>;

export type UpdateIdentityProviderResponse =
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        conditionalAccessEnabled?: boolean;
        directoryId?: string;
        emailClaimName?: string;
        prompt?: "login" | "select_account" | "none";
        supportGroups?: boolean;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      accountId?: string;
      zoneId?: string;
      scimConfig?: {
        enabled?: boolean;
        identityUpdateBehavior?: "automatic" | "reauth" | "no_action";
        seatDeprovision?: boolean;
        userDeprovision?: boolean;
      };
    }
  | {
      config: {
        centrifyAccount?: string;
        centrifyAppId?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: unknown;
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        appsDomain?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        authUrl?: string;
        certsUrl?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        pkceEnabled?: boolean;
        scopes?: string[];
        tokenUrl?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        authorizationServerId?: string;
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        oktaAccount?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        oneloginAccount?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        claims?: string[];
        clientId?: string;
        clientSecret?: string;
        emailClaimName?: string;
        pingEnvId?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    }
  | {
      config: {
        attributes?: string[];
        emailAttributeName?: string;
        headerAttributes?: { attributeName?: string; headerName?: string }[];
        idpPublicCerts?: string[];
        issuerUrl?: string;
        signRequest?: boolean;
        ssoTargetUrl?: string;
      };
      name: string;
      type:
        | "google"
        | "onetimepin"
        | "azureAD"
        | "saml"
        | "centrify"
        | "facebook"
        | "github"
        | "google-apps"
        | "linkedin"
        | "oidc"
        | "okta"
        | "onelogin"
        | "pingone"
        | "yandex";
      id?: string;
      scimConfig?: unknown;
    };

export const UpdateIdentityProviderResponse = Schema.Union(
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      conditionalAccessEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("conditional_access_enabled"),
      ),
      directoryId: Schema.optional(Schema.String).pipe(
        T.JsonName("directory_id"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      prompt: Schema.optional(
        Schema.Literal("login", "select_account", "none"),
      ),
      supportGroups: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("support_groups"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
    zoneId: Schema.optional(Schema.String).pipe(T.JsonName("zone_id")),
    scimConfig: Schema.optional(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        identityUpdateBehavior: Schema.optional(
          Schema.Literal("automatic", "reauth", "no_action"),
        ).pipe(T.JsonName("identity_update_behavior")),
        seatDeprovision: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("seat_deprovision"),
        ),
        userDeprovision: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("user_deprovision"),
        ),
      }),
    ).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      centrifyAccount: Schema.optional(Schema.String).pipe(
        T.JsonName("centrify_account"),
      ),
      centrifyAppId: Schema.optional(Schema.String).pipe(
        T.JsonName("centrify_app_id"),
      ),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Unknown,
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      appsDomain: Schema.optional(Schema.String).pipe(
        T.JsonName("apps_domain"),
      ),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      authUrl: Schema.optional(Schema.String).pipe(T.JsonName("auth_url")),
      certsUrl: Schema.optional(Schema.String).pipe(T.JsonName("certs_url")),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      pkceEnabled: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("pkce_enabled"),
      ),
      scopes: Schema.optional(Schema.Array(Schema.String)),
      tokenUrl: Schema.optional(Schema.String).pipe(T.JsonName("token_url")),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      authorizationServerId: Schema.optional(Schema.String).pipe(
        T.JsonName("authorization_server_id"),
      ),
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      oktaAccount: Schema.optional(Schema.String).pipe(
        T.JsonName("okta_account"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      oneloginAccount: Schema.optional(Schema.String).pipe(
        T.JsonName("onelogin_account"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      claims: Schema.optional(Schema.Array(Schema.String)),
      clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
      clientSecret: Schema.optional(Schema.String).pipe(
        T.JsonName("client_secret"),
      ),
      emailClaimName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_claim_name"),
      ),
      pingEnvId: Schema.optional(Schema.String).pipe(T.JsonName("ping_env_id")),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
  Schema.Struct({
    config: Schema.Struct({
      attributes: Schema.optional(Schema.Array(Schema.String)),
      emailAttributeName: Schema.optional(Schema.String).pipe(
        T.JsonName("email_attribute_name"),
      ),
      headerAttributes: Schema.optional(
        Schema.Array(
          Schema.Struct({
            attributeName: Schema.optional(Schema.String).pipe(
              T.JsonName("attribute_name"),
            ),
            headerName: Schema.optional(Schema.String).pipe(
              T.JsonName("header_name"),
            ),
          }),
        ),
      ).pipe(T.JsonName("header_attributes")),
      idpPublicCerts: Schema.optional(Schema.Array(Schema.String)).pipe(
        T.JsonName("idp_public_certs"),
      ),
      issuerUrl: Schema.optional(Schema.String).pipe(T.JsonName("issuer_url")),
      signRequest: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("sign_request"),
      ),
      ssoTargetUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("sso_target_url"),
      ),
    }),
    name: Schema.String,
    type: Schema.Literal(
      "google",
      "onetimepin",
      "azureAD",
      "saml",
      "centrify",
      "facebook",
      "github",
      "google-apps",
      "linkedin",
      "oidc",
      "okta",
      "onelogin",
      "pingone",
      "yandex",
    ),
    id: Schema.optional(Schema.String),
    scimConfig: Schema.optional(Schema.Unknown).pipe(T.JsonName("scim_config")),
  }),
) as unknown as Schema.Schema<UpdateIdentityProviderResponse>;

export const updateIdentityProvider: (
  input: UpdateIdentityProviderRequest,
) => Effect.Effect<
  UpdateIdentityProviderResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateIdentityProviderRequest,
  output: UpdateIdentityProviderResponse,
  errors: [],
}));

export interface DeleteIdentityProviderRequest {
  identityProviderId: string;
}

export const DeleteIdentityProviderRequest = Schema.Struct({
  identityProviderId: Schema.String.pipe(T.HttpPath("identityProviderId")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/{accountOrZone}/{accountOrZoneId}/access/identity_providers/{identityProviderId}",
  }),
) as unknown as Schema.Schema<DeleteIdentityProviderRequest>;

export interface DeleteIdentityProviderResponse {
  /** UUID. */
  id?: string;
}

export const DeleteIdentityProviderResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteIdentityProviderResponse>;

export const deleteIdentityProvider: (
  input: DeleteIdentityProviderRequest,
) => Effect.Effect<
  DeleteIdentityProviderResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteIdentityProviderRequest,
  output: DeleteIdentityProviderResponse,
  errors: [],
}));

// =============================================================================
// NetworkHostnameRoute
// =============================================================================

export interface GetNetworkHostnameRouteRequest {
  hostnameRouteId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const GetNetworkHostnameRouteRequest = Schema.Struct({
  hostnameRouteId: Schema.String.pipe(T.HttpPath("hostnameRouteId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/zerotrust/routes/hostname/{hostnameRouteId}",
  }),
) as unknown as Schema.Schema<GetNetworkHostnameRouteRequest>;

export interface GetNetworkHostnameRouteResponse {
  /** The hostname route ID. */
  id?: string;
  /** An optional description of the hostname route. */
  comment?: string;
  /** Timestamp of when the resource was created. */
  createdAt?: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
  /** The hostname of the route. */
  hostname?: string;
  /** UUID of the tunnel. */
  tunnelId?: string;
  /** A user-friendly name for a tunnel. */
  tunnelName?: string;
}

export const GetNetworkHostnameRouteResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  comment: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
  hostname: Schema.optional(Schema.String),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
  tunnelName: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_name")),
}) as unknown as Schema.Schema<GetNetworkHostnameRouteResponse>;

export const getNetworkHostnameRoute: (
  input: GetNetworkHostnameRouteRequest,
) => Effect.Effect<
  GetNetworkHostnameRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetNetworkHostnameRouteRequest,
  output: GetNetworkHostnameRouteResponse,
  errors: [],
}));

export interface CreateNetworkHostnameRouteRequest {
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: An optional description of the hostname route. */
  comment?: string;
  /** Body param: The hostname of the route. */
  hostname?: string;
  /** Body param: UUID of the tunnel. */
  tunnelId?: string;
}

export const CreateNetworkHostnameRouteRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  comment: Schema.optional(Schema.String),
  hostname: Schema.optional(Schema.String),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/zerotrust/routes/hostname",
  }),
) as unknown as Schema.Schema<CreateNetworkHostnameRouteRequest>;

export interface CreateNetworkHostnameRouteResponse {
  /** The hostname route ID. */
  id?: string;
  /** An optional description of the hostname route. */
  comment?: string;
  /** Timestamp of when the resource was created. */
  createdAt?: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
  /** The hostname of the route. */
  hostname?: string;
  /** UUID of the tunnel. */
  tunnelId?: string;
  /** A user-friendly name for a tunnel. */
  tunnelName?: string;
}

export const CreateNetworkHostnameRouteResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  comment: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
  hostname: Schema.optional(Schema.String),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
  tunnelName: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_name")),
}) as unknown as Schema.Schema<CreateNetworkHostnameRouteResponse>;

export const createNetworkHostnameRoute: (
  input: CreateNetworkHostnameRouteRequest,
) => Effect.Effect<
  CreateNetworkHostnameRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateNetworkHostnameRouteRequest,
  output: CreateNetworkHostnameRouteResponse,
  errors: [],
}));

export interface PatchNetworkHostnameRouteRequest {
  hostnameRouteId: string;
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: An optional description of the hostname route. */
  comment?: string;
  /** Body param: The hostname of the route. */
  hostname?: string;
  /** Body param: UUID of the tunnel. */
  tunnelId?: string;
}

export const PatchNetworkHostnameRouteRequest = Schema.Struct({
  hostnameRouteId: Schema.String.pipe(T.HttpPath("hostnameRouteId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  comment: Schema.optional(Schema.String),
  hostname: Schema.optional(Schema.String),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/zerotrust/routes/hostname/{hostnameRouteId}",
  }),
) as unknown as Schema.Schema<PatchNetworkHostnameRouteRequest>;

export interface PatchNetworkHostnameRouteResponse {
  /** The hostname route ID. */
  id?: string;
  /** An optional description of the hostname route. */
  comment?: string;
  /** Timestamp of when the resource was created. */
  createdAt?: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
  /** The hostname of the route. */
  hostname?: string;
  /** UUID of the tunnel. */
  tunnelId?: string;
  /** A user-friendly name for a tunnel. */
  tunnelName?: string;
}

export const PatchNetworkHostnameRouteResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  comment: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
  hostname: Schema.optional(Schema.String),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
  tunnelName: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_name")),
}) as unknown as Schema.Schema<PatchNetworkHostnameRouteResponse>;

export const patchNetworkHostnameRoute: (
  input: PatchNetworkHostnameRouteRequest,
) => Effect.Effect<
  PatchNetworkHostnameRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchNetworkHostnameRouteRequest,
  output: PatchNetworkHostnameRouteResponse,
  errors: [],
}));

export interface DeleteNetworkHostnameRouteRequest {
  hostnameRouteId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const DeleteNetworkHostnameRouteRequest = Schema.Struct({
  hostnameRouteId: Schema.String.pipe(T.HttpPath("hostnameRouteId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/zerotrust/routes/hostname/{hostnameRouteId}",
  }),
) as unknown as Schema.Schema<DeleteNetworkHostnameRouteRequest>;

export interface DeleteNetworkHostnameRouteResponse {
  /** The hostname route ID. */
  id?: string;
  /** An optional description of the hostname route. */
  comment?: string;
  /** Timestamp of when the resource was created. */
  createdAt?: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
  /** The hostname of the route. */
  hostname?: string;
  /** UUID of the tunnel. */
  tunnelId?: string;
  /** A user-friendly name for a tunnel. */
  tunnelName?: string;
}

export const DeleteNetworkHostnameRouteResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  comment: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
  hostname: Schema.optional(Schema.String),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
  tunnelName: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_name")),
}) as unknown as Schema.Schema<DeleteNetworkHostnameRouteResponse>;

export const deleteNetworkHostnameRoute: (
  input: DeleteNetworkHostnameRouteRequest,
) => Effect.Effect<
  DeleteNetworkHostnameRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteNetworkHostnameRouteRequest,
  output: DeleteNetworkHostnameRouteResponse,
  errors: [],
}));

// =============================================================================
// NetworkRoute
// =============================================================================

export interface GetNetworkRouteRequest {
  routeId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const GetNetworkRouteRequest = Schema.Struct({
  routeId: Schema.String.pipe(T.HttpPath("routeId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/teamnet/routes/{routeId}",
  }),
) as unknown as Schema.Schema<GetNetworkRouteRequest>;

export interface GetNetworkRouteResponse {
  /** UUID of the route. */
  id?: string;
  /** Optional remark describing the route. */
  comment?: string;
  /** Timestamp of when the resource was created. */
  createdAt?: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
  /** The private IPv4 or IPv6 range connected by the route, in CIDR notation. */
  network?: string;
  /** UUID of the tunnel. */
  tunnelId?: string;
  /** UUID of the virtual network. */
  virtualNetworkId?: string;
}

export const GetNetworkRouteResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  comment: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
  network: Schema.optional(Schema.String),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
  virtualNetworkId: Schema.optional(Schema.String).pipe(
    T.JsonName("virtual_network_id"),
  ),
}) as unknown as Schema.Schema<GetNetworkRouteResponse>;

export const getNetworkRoute: (
  input: GetNetworkRouteRequest,
) => Effect.Effect<
  GetNetworkRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetNetworkRouteRequest,
  output: GetNetworkRouteResponse,
  errors: [],
}));

export interface CreateNetworkRouteRequest {
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: The private IPv4 or IPv6 range connected by the route, in CIDR notation. */
  network: string;
  /** Body param: UUID of the tunnel. */
  tunnelId: string;
  /** Body param: Optional remark describing the route. */
  comment?: string;
  /** Body param: UUID of the virtual network. */
  virtualNetworkId?: string;
}

export const CreateNetworkRouteRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  network: Schema.String,
  tunnelId: Schema.String.pipe(T.JsonName("tunnel_id")),
  comment: Schema.optional(Schema.String),
  virtualNetworkId: Schema.optional(Schema.String).pipe(
    T.JsonName("virtual_network_id"),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/teamnet/routes" }),
) as unknown as Schema.Schema<CreateNetworkRouteRequest>;

export interface CreateNetworkRouteResponse {
  /** UUID of the route. */
  id?: string;
  /** Optional remark describing the route. */
  comment?: string;
  /** Timestamp of when the resource was created. */
  createdAt?: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
  /** The private IPv4 or IPv6 range connected by the route, in CIDR notation. */
  network?: string;
  /** UUID of the tunnel. */
  tunnelId?: string;
  /** UUID of the virtual network. */
  virtualNetworkId?: string;
}

export const CreateNetworkRouteResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  comment: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
  network: Schema.optional(Schema.String),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
  virtualNetworkId: Schema.optional(Schema.String).pipe(
    T.JsonName("virtual_network_id"),
  ),
}) as unknown as Schema.Schema<CreateNetworkRouteResponse>;

export const createNetworkRoute: (
  input: CreateNetworkRouteRequest,
) => Effect.Effect<
  CreateNetworkRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateNetworkRouteRequest,
  output: CreateNetworkRouteResponse,
  errors: [],
}));

export interface PatchNetworkRouteRequest {
  routeId: string;
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: Optional remark describing the route. */
  comment?: string;
  /** Body param: The private IPv4 or IPv6 range connected by the route, in CIDR notation. */
  network?: string;
  /** Body param: UUID of the tunnel. */
  tunnelId?: string;
  /** Body param: UUID of the virtual network. */
  virtualNetworkId?: string;
}

export const PatchNetworkRouteRequest = Schema.Struct({
  routeId: Schema.String.pipe(T.HttpPath("routeId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  comment: Schema.optional(Schema.String),
  network: Schema.optional(Schema.String),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
  virtualNetworkId: Schema.optional(Schema.String).pipe(
    T.JsonName("virtual_network_id"),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/teamnet/routes/{routeId}",
  }),
) as unknown as Schema.Schema<PatchNetworkRouteRequest>;

export interface PatchNetworkRouteResponse {
  /** UUID of the route. */
  id?: string;
  /** Optional remark describing the route. */
  comment?: string;
  /** Timestamp of when the resource was created. */
  createdAt?: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
  /** The private IPv4 or IPv6 range connected by the route, in CIDR notation. */
  network?: string;
  /** UUID of the tunnel. */
  tunnelId?: string;
  /** UUID of the virtual network. */
  virtualNetworkId?: string;
}

export const PatchNetworkRouteResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  comment: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
  network: Schema.optional(Schema.String),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
  virtualNetworkId: Schema.optional(Schema.String).pipe(
    T.JsonName("virtual_network_id"),
  ),
}) as unknown as Schema.Schema<PatchNetworkRouteResponse>;

export const patchNetworkRoute: (
  input: PatchNetworkRouteRequest,
) => Effect.Effect<
  PatchNetworkRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchNetworkRouteRequest,
  output: PatchNetworkRouteResponse,
  errors: [],
}));

export interface DeleteNetworkRouteRequest {
  routeId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const DeleteNetworkRouteRequest = Schema.Struct({
  routeId: Schema.String.pipe(T.HttpPath("routeId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/teamnet/routes/{routeId}",
  }),
) as unknown as Schema.Schema<DeleteNetworkRouteRequest>;

export interface DeleteNetworkRouteResponse {
  /** UUID of the route. */
  id?: string;
  /** Optional remark describing the route. */
  comment?: string;
  /** Timestamp of when the resource was created. */
  createdAt?: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
  /** The private IPv4 or IPv6 range connected by the route, in CIDR notation. */
  network?: string;
  /** UUID of the tunnel. */
  tunnelId?: string;
  /** UUID of the virtual network. */
  virtualNetworkId?: string;
}

export const DeleteNetworkRouteResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  comment: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
  network: Schema.optional(Schema.String),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
  virtualNetworkId: Schema.optional(Schema.String).pipe(
    T.JsonName("virtual_network_id"),
  ),
}) as unknown as Schema.Schema<DeleteNetworkRouteResponse>;

export const deleteNetworkRoute: (
  input: DeleteNetworkRouteRequest,
) => Effect.Effect<
  DeleteNetworkRouteResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteNetworkRouteRequest,
  output: DeleteNetworkRouteResponse,
  errors: [],
}));

// =============================================================================
// NetworkRouteIp
// =============================================================================

export interface GetNetworkRouteIpRequest {
  ip: string;
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Query param: When the virtual_network_id parameter is not provided the request filter will default search routes that are in the default virtual network for the account. If this parameter is set to fa */
  defaultVirtualNetworkFallback?: boolean;
  /** Query param: UUID of the virtual network. */
  virtualNetworkId?: string;
}

export const GetNetworkRouteIpRequest = Schema.Struct({
  ip: Schema.String.pipe(T.HttpPath("ip")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  defaultVirtualNetworkFallback: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("default_virtual_network_fallback"),
  ),
  virtualNetworkId: Schema.optional(Schema.String).pipe(
    T.HttpQuery("virtual_network_id"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/teamnet/routes/ip/{ip}",
  }),
) as unknown as Schema.Schema<GetNetworkRouteIpRequest>;

export type GetNetworkRouteIpResponse = unknown;

export const GetNetworkRouteIpResponse =
  Schema.Unknown as unknown as Schema.Schema<GetNetworkRouteIpResponse>;

export const getNetworkRouteIp: (
  input: GetNetworkRouteIpRequest,
) => Effect.Effect<
  GetNetworkRouteIpResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetNetworkRouteIpRequest,
  output: GetNetworkRouteIpResponse,
  errors: [],
}));

// =============================================================================
// NetworkRouteNetwork
// =============================================================================

export interface CreateNetworkRouteNetworkRequest {
  ipNetworkEncoded: string;
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: UUID of the tunnel. */
  tunnelId: string;
  /** Body param: Optional remark describing the route. */
  comment?: string;
  /** Body param: UUID of the virtual network. */
  virtualNetworkId?: string;
}

export const CreateNetworkRouteNetworkRequest = Schema.Struct({
  ipNetworkEncoded: Schema.String.pipe(T.HttpPath("ipNetworkEncoded")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  tunnelId: Schema.String.pipe(T.JsonName("tunnel_id")),
  comment: Schema.optional(Schema.String),
  virtualNetworkId: Schema.optional(Schema.String).pipe(
    T.JsonName("virtual_network_id"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/teamnet/routes/network/{ipNetworkEncoded}",
  }),
) as unknown as Schema.Schema<CreateNetworkRouteNetworkRequest>;

export type CreateNetworkRouteNetworkResponse = unknown;

export const CreateNetworkRouteNetworkResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateNetworkRouteNetworkResponse>;

export const createNetworkRouteNetwork: (
  input: CreateNetworkRouteNetworkRequest,
) => Effect.Effect<
  CreateNetworkRouteNetworkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateNetworkRouteNetworkRequest,
  output: CreateNetworkRouteNetworkResponse,
  errors: [],
}));

export interface PatchNetworkRouteNetworkRequest {
  ipNetworkEncoded: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const PatchNetworkRouteNetworkRequest = Schema.Struct({
  ipNetworkEncoded: Schema.String.pipe(T.HttpPath("ipNetworkEncoded")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/teamnet/routes/network/{ipNetworkEncoded}",
  }),
) as unknown as Schema.Schema<PatchNetworkRouteNetworkRequest>;

export type PatchNetworkRouteNetworkResponse = unknown;

export const PatchNetworkRouteNetworkResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchNetworkRouteNetworkResponse>;

export const patchNetworkRouteNetwork: (
  input: PatchNetworkRouteNetworkRequest,
) => Effect.Effect<
  PatchNetworkRouteNetworkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchNetworkRouteNetworkRequest,
  output: PatchNetworkRouteNetworkResponse,
  errors: [],
}));

export interface DeleteNetworkRouteNetworkRequest {
  ipNetworkEncoded: string;
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Query param: The type of tunnel. */
  tunType?:
    | "cfd_tunnel"
    | "warp_connector"
    | "warp"
    | "magic"
    | "ip_sec"
    | "gre"
    | "cni";
  /** Query param: UUID of the tunnel. */
  tunnelId?: string;
  /** Query param: UUID of the virtual network. */
  virtualNetworkId?: string;
}

export const DeleteNetworkRouteNetworkRequest = Schema.Struct({
  ipNetworkEncoded: Schema.String.pipe(T.HttpPath("ipNetworkEncoded")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  tunType: Schema.optional(
    Schema.Literal(
      "cfd_tunnel",
      "warp_connector",
      "warp",
      "magic",
      "ip_sec",
      "gre",
      "cni",
    ),
  ).pipe(T.HttpQuery("tun_type")),
  tunnelId: Schema.optional(Schema.String).pipe(T.HttpQuery("tunnel_id")),
  virtualNetworkId: Schema.optional(Schema.String).pipe(
    T.HttpQuery("virtual_network_id"),
  ),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/teamnet/routes/network/{ipNetworkEncoded}",
  }),
) as unknown as Schema.Schema<DeleteNetworkRouteNetworkRequest>;

export type DeleteNetworkRouteNetworkResponse = unknown;

export const DeleteNetworkRouteNetworkResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteNetworkRouteNetworkResponse>;

export const deleteNetworkRouteNetwork: (
  input: DeleteNetworkRouteNetworkRequest,
) => Effect.Effect<
  DeleteNetworkRouteNetworkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteNetworkRouteNetworkRequest,
  output: DeleteNetworkRouteNetworkResponse,
  errors: [],
}));

// =============================================================================
// NetworkSubnetCloudflareSource
// =============================================================================

export interface PatchNetworkSubnetCloudflareSourceRequest {
  addressFamily: "v4" | "v6";
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: An optional description of the subnet. */
  comment?: string;
  /** Body param: A user-friendly name for the subnet. */
  name?: string;
  /** Body param: The private IPv4 or IPv6 range defining the subnet, in CIDR notation. */
  network?: string;
}

export const PatchNetworkSubnetCloudflareSourceRequest = Schema.Struct({
  addressFamily: Schema.Literal("v4", "v6").pipe(T.HttpPath("addressFamily")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  comment: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  network: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/zerotrust/subnets/cloudflare_source/{addressFamily}",
  }),
) as unknown as Schema.Schema<PatchNetworkSubnetCloudflareSourceRequest>;

export interface PatchNetworkSubnetCloudflareSourceResponse {
  /** The UUID of the subnet. */
  id?: string;
  /** An optional description of the subnet. */
  comment?: string;
  /** Timestamp of when the resource was created. */
  createdAt?: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
  /** If `true`, this is the default subnet for the account. There can only be one default subnet per account. */
  isDefaultNetwork?: boolean;
  /** A user-friendly name for the subnet. */
  name?: string;
  /** The private IPv4 or IPv6 range defining the subnet, in CIDR notation. */
  network?: string;
  /** The type of subnet. */
  subnetType?: "cloudflare_source";
}

export const PatchNetworkSubnetCloudflareSourceResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  comment: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
  isDefaultNetwork: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("is_default_network"),
  ),
  name: Schema.optional(Schema.String),
  network: Schema.optional(Schema.String),
  subnetType: Schema.optional(Schema.Literal("cloudflare_source")).pipe(
    T.JsonName("subnet_type"),
  ),
}) as unknown as Schema.Schema<PatchNetworkSubnetCloudflareSourceResponse>;

export const patchNetworkSubnetCloudflareSource: (
  input: PatchNetworkSubnetCloudflareSourceRequest,
) => Effect.Effect<
  PatchNetworkSubnetCloudflareSourceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchNetworkSubnetCloudflareSourceRequest,
  output: PatchNetworkSubnetCloudflareSourceResponse,
  errors: [],
}));

// =============================================================================
// NetworkVirtualNetwork
// =============================================================================

export interface GetNetworkVirtualNetworkRequest {
  virtualNetworkId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const GetNetworkVirtualNetworkRequest = Schema.Struct({
  virtualNetworkId: Schema.String.pipe(T.HttpPath("virtualNetworkId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/teamnet/virtual_networks/{virtualNetworkId}",
  }),
) as unknown as Schema.Schema<GetNetworkVirtualNetworkRequest>;

export interface GetNetworkVirtualNetworkResponse {
  /** UUID of the virtual network. */
  id: string;
  /** Optional remark describing the virtual network. */
  comment: string;
  /** Timestamp of when the resource was created. */
  createdAt: string;
  /** If `true`, this virtual network is the default for the account. */
  isDefaultNetwork: boolean;
  /** A user-friendly name for the virtual network. */
  name: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
}

export const GetNetworkVirtualNetworkResponse = Schema.Struct({
  id: Schema.String,
  comment: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isDefaultNetwork: Schema.Boolean.pipe(T.JsonName("is_default_network")),
  name: Schema.String,
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
}) as unknown as Schema.Schema<GetNetworkVirtualNetworkResponse>;

export const getNetworkVirtualNetwork: (
  input: GetNetworkVirtualNetworkRequest,
) => Effect.Effect<
  GetNetworkVirtualNetworkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetNetworkVirtualNetworkRequest,
  output: GetNetworkVirtualNetworkResponse,
  errors: [],
}));

export interface CreateNetworkVirtualNetworkRequest {
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: A user-friendly name for the virtual network. */
  name: string;
  /** Body param: Optional remark describing the virtual network. */
  comment?: string;
  /** @deprecated Use the is_default_network property instead. */
  isDefault?: boolean;
  /** Body param: If `true`, this virtual network is the default for the account. */
  isDefaultNetwork?: boolean;
}

export const CreateNetworkVirtualNetworkRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  comment: Schema.optional(Schema.String),
  isDefault: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_default")),
  isDefaultNetwork: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("is_default_network"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/teamnet/virtual_networks",
  }),
) as unknown as Schema.Schema<CreateNetworkVirtualNetworkRequest>;

export interface CreateNetworkVirtualNetworkResponse {
  /** UUID of the virtual network. */
  id: string;
  /** Optional remark describing the virtual network. */
  comment: string;
  /** Timestamp of when the resource was created. */
  createdAt: string;
  /** If `true`, this virtual network is the default for the account. */
  isDefaultNetwork: boolean;
  /** A user-friendly name for the virtual network. */
  name: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
}

export const CreateNetworkVirtualNetworkResponse = Schema.Struct({
  id: Schema.String,
  comment: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isDefaultNetwork: Schema.Boolean.pipe(T.JsonName("is_default_network")),
  name: Schema.String,
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
}) as unknown as Schema.Schema<CreateNetworkVirtualNetworkResponse>;

export const createNetworkVirtualNetwork: (
  input: CreateNetworkVirtualNetworkRequest,
) => Effect.Effect<
  CreateNetworkVirtualNetworkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateNetworkVirtualNetworkRequest,
  output: CreateNetworkVirtualNetworkResponse,
  errors: [],
}));

export interface PatchNetworkVirtualNetworkRequest {
  virtualNetworkId: string;
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: Optional remark describing the virtual network. */
  comment?: string;
  /** Body param: If `true`, this virtual network is the default for the account. */
  isDefaultNetwork?: boolean;
  /** Body param: A user-friendly name for the virtual network. */
  name?: string;
}

export const PatchNetworkVirtualNetworkRequest = Schema.Struct({
  virtualNetworkId: Schema.String.pipe(T.HttpPath("virtualNetworkId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  comment: Schema.optional(Schema.String),
  isDefaultNetwork: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("is_default_network"),
  ),
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/teamnet/virtual_networks/{virtualNetworkId}",
  }),
) as unknown as Schema.Schema<PatchNetworkVirtualNetworkRequest>;

export interface PatchNetworkVirtualNetworkResponse {
  /** UUID of the virtual network. */
  id: string;
  /** Optional remark describing the virtual network. */
  comment: string;
  /** Timestamp of when the resource was created. */
  createdAt: string;
  /** If `true`, this virtual network is the default for the account. */
  isDefaultNetwork: boolean;
  /** A user-friendly name for the virtual network. */
  name: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
}

export const PatchNetworkVirtualNetworkResponse = Schema.Struct({
  id: Schema.String,
  comment: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isDefaultNetwork: Schema.Boolean.pipe(T.JsonName("is_default_network")),
  name: Schema.String,
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
}) as unknown as Schema.Schema<PatchNetworkVirtualNetworkResponse>;

export const patchNetworkVirtualNetwork: (
  input: PatchNetworkVirtualNetworkRequest,
) => Effect.Effect<
  PatchNetworkVirtualNetworkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchNetworkVirtualNetworkRequest,
  output: PatchNetworkVirtualNetworkResponse,
  errors: [],
}));

export interface DeleteNetworkVirtualNetworkRequest {
  virtualNetworkId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const DeleteNetworkVirtualNetworkRequest = Schema.Struct({
  virtualNetworkId: Schema.String.pipe(T.HttpPath("virtualNetworkId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/teamnet/virtual_networks/{virtualNetworkId}",
  }),
) as unknown as Schema.Schema<DeleteNetworkVirtualNetworkRequest>;

export interface DeleteNetworkVirtualNetworkResponse {
  /** UUID of the virtual network. */
  id: string;
  /** Optional remark describing the virtual network. */
  comment: string;
  /** Timestamp of when the resource was created. */
  createdAt: string;
  /** If `true`, this virtual network is the default for the account. */
  isDefaultNetwork: boolean;
  /** A user-friendly name for the virtual network. */
  name: string;
  /** Timestamp of when the resource was deleted. If `null`, the resource has not been deleted. */
  deletedAt?: string;
}

export const DeleteNetworkVirtualNetworkResponse = Schema.Struct({
  id: Schema.String,
  comment: Schema.String,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  isDefaultNetwork: Schema.Boolean.pipe(T.JsonName("is_default_network")),
  name: Schema.String,
  deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
}) as unknown as Schema.Schema<DeleteNetworkVirtualNetworkResponse>;

export const deleteNetworkVirtualNetwork: (
  input: DeleteNetworkVirtualNetworkRequest,
) => Effect.Effect<
  DeleteNetworkVirtualNetworkResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteNetworkVirtualNetworkRequest,
  output: DeleteNetworkVirtualNetworkResponse,
  errors: [],
}));

// =============================================================================
// Organization
// =============================================================================

export interface ListOrganizationsRequest {}

export const ListOrganizationsRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/access/organizations",
  }),
) as unknown as Schema.Schema<ListOrganizationsRequest>;

export interface ListOrganizationsResponse {
  /** When set to true, users can authenticate via WARP for any application in your organization. Application settings will take precedence over this value. */
  allowAuthenticateViaWarp?: boolean;
  /** The unique subdomain assigned to your Zero Trust organization. */
  authDomain?: string;
  /** When set to `true`, users skip the identity provider selection step during login. */
  autoRedirectToIdentity?: boolean;
  customPages?: { forbidden?: string; identityDenied?: string };
  /** Lock all settings as Read-Only in the Dashboard, regardless of user permission. Updates may only be made via the API or Terraform for this account when enabled. */
  isUiReadOnly?: boolean;
  loginDesign?: {
    backgroundColor?: string;
    footerText?: string;
    headerText?: string;
    logoPath?: string;
    textColor?: string;
  };
  /** The name of your Zero Trust organization. */
  name?: string;
  /** The amount of time that tokens issued for applications will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
  /** A description of the reason why the UI read only field is being toggled. */
  uiReadOnlyToggleReason?: string;
  /** The amount of time a user seat is inactive before it expires. When the user seat exceeds the set time of inactivity, the user is removed as an active seat and no longer counts against your Teams seat  */
  userSeatExpirationInactiveTime?: string;
  /** The amount of time that tokens issued for applications will be valid. Must be in the format `30m` or `2h45m`. Valid time units are: m, h. */
  warpAuthSessionDuration?: string;
}

export const ListOrganizationsResponse = Schema.Struct({
  allowAuthenticateViaWarp: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_authenticate_via_warp"),
  ),
  authDomain: Schema.optional(Schema.String).pipe(T.JsonName("auth_domain")),
  autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("auto_redirect_to_identity"),
  ),
  customPages: Schema.optional(
    Schema.Struct({
      forbidden: Schema.optional(Schema.String),
      identityDenied: Schema.optional(Schema.String).pipe(
        T.JsonName("identity_denied"),
      ),
    }),
  ).pipe(T.JsonName("custom_pages")),
  isUiReadOnly: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("is_ui_read_only"),
  ),
  loginDesign: Schema.optional(
    Schema.Struct({
      backgroundColor: Schema.optional(Schema.String).pipe(
        T.JsonName("background_color"),
      ),
      footerText: Schema.optional(Schema.String).pipe(
        T.JsonName("footer_text"),
      ),
      headerText: Schema.optional(Schema.String).pipe(
        T.JsonName("header_text"),
      ),
      logoPath: Schema.optional(Schema.String).pipe(T.JsonName("logo_path")),
      textColor: Schema.optional(Schema.String).pipe(T.JsonName("text_color")),
    }),
  ).pipe(T.JsonName("login_design")),
  name: Schema.optional(Schema.String),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
  uiReadOnlyToggleReason: Schema.optional(Schema.String).pipe(
    T.JsonName("ui_read_only_toggle_reason"),
  ),
  userSeatExpirationInactiveTime: Schema.optional(Schema.String).pipe(
    T.JsonName("user_seat_expiration_inactive_time"),
  ),
  warpAuthSessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("warp_auth_session_duration"),
  ),
}) as unknown as Schema.Schema<ListOrganizationsResponse>;

export const listOrganizations: (
  input: ListOrganizationsRequest,
) => Effect.Effect<
  ListOrganizationsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListOrganizationsRequest,
  output: ListOrganizationsResponse,
  errors: [],
}));

export interface CreateOrganizationRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: The unique subdomain assigned to your Zero Trust organization. */
  authDomain: string;
  /** Body param: The name of your Zero Trust organization. */
  name: string;
  /** Body param: When set to true, users can authenticate via WARP for any application in your organization. Application settings will take precedence over this value. */
  allowAuthenticateViaWarp?: boolean;
  /** Body param: When set to `true`, users skip the identity provider selection step during login. */
  autoRedirectToIdentity?: boolean;
  /** Body param: Lock all settings as Read-Only in the Dashboard, regardless of user permission. Updates may only be made via the API or Terraform for this account when enabled. */
  isUiReadOnly?: boolean;
  /** Body param: */
  loginDesign?: {
    backgroundColor?: string;
    footerText?: string;
    headerText?: string;
    logoPath?: string;
    textColor?: string;
  };
  /** Body param: The amount of time that tokens issued for applications will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
  /** Body param: A description of the reason why the UI read only field is being toggled. */
  uiReadOnlyToggleReason?: string;
  /** Body param: The amount of time a user seat is inactive before it expires. When the user seat exceeds the set time of inactivity, the user is removed as an active seat and no longer counts against your */
  userSeatExpirationInactiveTime?: string;
  /** Body param: The amount of time that tokens issued for applications will be valid. Must be in the format `30m` or `2h45m`. Valid time units are: m, h. */
  warpAuthSessionDuration?: string;
}

export const CreateOrganizationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  authDomain: Schema.String.pipe(T.JsonName("auth_domain")),
  name: Schema.String,
  allowAuthenticateViaWarp: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_authenticate_via_warp"),
  ),
  autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("auto_redirect_to_identity"),
  ),
  isUiReadOnly: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("is_ui_read_only"),
  ),
  loginDesign: Schema.optional(
    Schema.Struct({
      backgroundColor: Schema.optional(Schema.String).pipe(
        T.JsonName("background_color"),
      ),
      footerText: Schema.optional(Schema.String).pipe(
        T.JsonName("footer_text"),
      ),
      headerText: Schema.optional(Schema.String).pipe(
        T.JsonName("header_text"),
      ),
      logoPath: Schema.optional(Schema.String).pipe(T.JsonName("logo_path")),
      textColor: Schema.optional(Schema.String).pipe(T.JsonName("text_color")),
    }),
  ).pipe(T.JsonName("login_design")),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
  uiReadOnlyToggleReason: Schema.optional(Schema.String).pipe(
    T.JsonName("ui_read_only_toggle_reason"),
  ),
  userSeatExpirationInactiveTime: Schema.optional(Schema.String).pipe(
    T.JsonName("user_seat_expiration_inactive_time"),
  ),
  warpAuthSessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("warp_auth_session_duration"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/access/organizations",
  }),
) as unknown as Schema.Schema<CreateOrganizationRequest>;

export interface CreateOrganizationResponse {
  /** When set to true, users can authenticate via WARP for any application in your organization. Application settings will take precedence over this value. */
  allowAuthenticateViaWarp?: boolean;
  /** The unique subdomain assigned to your Zero Trust organization. */
  authDomain?: string;
  /** When set to `true`, users skip the identity provider selection step during login. */
  autoRedirectToIdentity?: boolean;
  customPages?: { forbidden?: string; identityDenied?: string };
  /** Lock all settings as Read-Only in the Dashboard, regardless of user permission. Updates may only be made via the API or Terraform for this account when enabled. */
  isUiReadOnly?: boolean;
  loginDesign?: {
    backgroundColor?: string;
    footerText?: string;
    headerText?: string;
    logoPath?: string;
    textColor?: string;
  };
  /** The name of your Zero Trust organization. */
  name?: string;
  /** The amount of time that tokens issued for applications will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
  /** A description of the reason why the UI read only field is being toggled. */
  uiReadOnlyToggleReason?: string;
  /** The amount of time a user seat is inactive before it expires. When the user seat exceeds the set time of inactivity, the user is removed as an active seat and no longer counts against your Teams seat  */
  userSeatExpirationInactiveTime?: string;
  /** The amount of time that tokens issued for applications will be valid. Must be in the format `30m` or `2h45m`. Valid time units are: m, h. */
  warpAuthSessionDuration?: string;
}

export const CreateOrganizationResponse = Schema.Struct({
  allowAuthenticateViaWarp: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_authenticate_via_warp"),
  ),
  authDomain: Schema.optional(Schema.String).pipe(T.JsonName("auth_domain")),
  autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("auto_redirect_to_identity"),
  ),
  customPages: Schema.optional(
    Schema.Struct({
      forbidden: Schema.optional(Schema.String),
      identityDenied: Schema.optional(Schema.String).pipe(
        T.JsonName("identity_denied"),
      ),
    }),
  ).pipe(T.JsonName("custom_pages")),
  isUiReadOnly: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("is_ui_read_only"),
  ),
  loginDesign: Schema.optional(
    Schema.Struct({
      backgroundColor: Schema.optional(Schema.String).pipe(
        T.JsonName("background_color"),
      ),
      footerText: Schema.optional(Schema.String).pipe(
        T.JsonName("footer_text"),
      ),
      headerText: Schema.optional(Schema.String).pipe(
        T.JsonName("header_text"),
      ),
      logoPath: Schema.optional(Schema.String).pipe(T.JsonName("logo_path")),
      textColor: Schema.optional(Schema.String).pipe(T.JsonName("text_color")),
    }),
  ).pipe(T.JsonName("login_design")),
  name: Schema.optional(Schema.String),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
  uiReadOnlyToggleReason: Schema.optional(Schema.String).pipe(
    T.JsonName("ui_read_only_toggle_reason"),
  ),
  userSeatExpirationInactiveTime: Schema.optional(Schema.String).pipe(
    T.JsonName("user_seat_expiration_inactive_time"),
  ),
  warpAuthSessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("warp_auth_session_duration"),
  ),
}) as unknown as Schema.Schema<CreateOrganizationResponse>;

export const createOrganization: (
  input: CreateOrganizationRequest,
) => Effect.Effect<
  CreateOrganizationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateOrganizationRequest,
  output: CreateOrganizationResponse,
  errors: [],
}));

export interface UpdateOrganizationRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: When set to true, users can authenticate via WARP for any application in your organization. Application settings will take precedence over this value. */
  allowAuthenticateViaWarp?: boolean;
  /** Body param: The unique subdomain assigned to your Zero Trust organization. */
  authDomain?: string;
  /** Body param: When set to `true`, users skip the identity provider selection step during login. */
  autoRedirectToIdentity?: boolean;
  /** Body param: */
  customPages?: { forbidden?: string; identityDenied?: string };
  /** Body param: Lock all settings as Read-Only in the Dashboard, regardless of user permission. Updates may only be made via the API or Terraform for this account when enabled. */
  isUiReadOnly?: boolean;
  /** Body param: */
  loginDesign?: {
    backgroundColor?: string;
    footerText?: string;
    headerText?: string;
    logoPath?: string;
    textColor?: string;
  };
  /** Body param: The name of your Zero Trust organization. */
  name?: string;
  /** Body param: The amount of time that tokens issued for applications will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
  /** Body param: A description of the reason why the UI read only field is being toggled. */
  uiReadOnlyToggleReason?: string;
  /** Body param: The amount of time a user seat is inactive before it expires. When the user seat exceeds the set time of inactivity, the user is removed as an active seat and no longer counts against your */
  userSeatExpirationInactiveTime?: string;
  /** Body param: The amount of time that tokens issued for applications will be valid. Must be in the format `30m` or `2h45m`. Valid time units are: m, h. */
  warpAuthSessionDuration?: string;
}

export const UpdateOrganizationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  allowAuthenticateViaWarp: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_authenticate_via_warp"),
  ),
  authDomain: Schema.optional(Schema.String).pipe(T.JsonName("auth_domain")),
  autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("auto_redirect_to_identity"),
  ),
  customPages: Schema.optional(
    Schema.Struct({
      forbidden: Schema.optional(Schema.String),
      identityDenied: Schema.optional(Schema.String).pipe(
        T.JsonName("identity_denied"),
      ),
    }),
  ).pipe(T.JsonName("custom_pages")),
  isUiReadOnly: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("is_ui_read_only"),
  ),
  loginDesign: Schema.optional(
    Schema.Struct({
      backgroundColor: Schema.optional(Schema.String).pipe(
        T.JsonName("background_color"),
      ),
      footerText: Schema.optional(Schema.String).pipe(
        T.JsonName("footer_text"),
      ),
      headerText: Schema.optional(Schema.String).pipe(
        T.JsonName("header_text"),
      ),
      logoPath: Schema.optional(Schema.String).pipe(T.JsonName("logo_path")),
      textColor: Schema.optional(Schema.String).pipe(T.JsonName("text_color")),
    }),
  ).pipe(T.JsonName("login_design")),
  name: Schema.optional(Schema.String),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
  uiReadOnlyToggleReason: Schema.optional(Schema.String).pipe(
    T.JsonName("ui_read_only_toggle_reason"),
  ),
  userSeatExpirationInactiveTime: Schema.optional(Schema.String).pipe(
    T.JsonName("user_seat_expiration_inactive_time"),
  ),
  warpAuthSessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("warp_auth_session_duration"),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/{accountOrZone}/{accountOrZoneId}/access/organizations",
  }),
) as unknown as Schema.Schema<UpdateOrganizationRequest>;

export interface UpdateOrganizationResponse {
  /** When set to true, users can authenticate via WARP for any application in your organization. Application settings will take precedence over this value. */
  allowAuthenticateViaWarp?: boolean;
  /** The unique subdomain assigned to your Zero Trust organization. */
  authDomain?: string;
  /** When set to `true`, users skip the identity provider selection step during login. */
  autoRedirectToIdentity?: boolean;
  customPages?: { forbidden?: string; identityDenied?: string };
  /** Lock all settings as Read-Only in the Dashboard, regardless of user permission. Updates may only be made via the API or Terraform for this account when enabled. */
  isUiReadOnly?: boolean;
  loginDesign?: {
    backgroundColor?: string;
    footerText?: string;
    headerText?: string;
    logoPath?: string;
    textColor?: string;
  };
  /** The name of your Zero Trust organization. */
  name?: string;
  /** The amount of time that tokens issued for applications will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. */
  sessionDuration?: string;
  /** A description of the reason why the UI read only field is being toggled. */
  uiReadOnlyToggleReason?: string;
  /** The amount of time a user seat is inactive before it expires. When the user seat exceeds the set time of inactivity, the user is removed as an active seat and no longer counts against your Teams seat  */
  userSeatExpirationInactiveTime?: string;
  /** The amount of time that tokens issued for applications will be valid. Must be in the format `30m` or `2h45m`. Valid time units are: m, h. */
  warpAuthSessionDuration?: string;
}

export const UpdateOrganizationResponse = Schema.Struct({
  allowAuthenticateViaWarp: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("allow_authenticate_via_warp"),
  ),
  authDomain: Schema.optional(Schema.String).pipe(T.JsonName("auth_domain")),
  autoRedirectToIdentity: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("auto_redirect_to_identity"),
  ),
  customPages: Schema.optional(
    Schema.Struct({
      forbidden: Schema.optional(Schema.String),
      identityDenied: Schema.optional(Schema.String).pipe(
        T.JsonName("identity_denied"),
      ),
    }),
  ).pipe(T.JsonName("custom_pages")),
  isUiReadOnly: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("is_ui_read_only"),
  ),
  loginDesign: Schema.optional(
    Schema.Struct({
      backgroundColor: Schema.optional(Schema.String).pipe(
        T.JsonName("background_color"),
      ),
      footerText: Schema.optional(Schema.String).pipe(
        T.JsonName("footer_text"),
      ),
      headerText: Schema.optional(Schema.String).pipe(
        T.JsonName("header_text"),
      ),
      logoPath: Schema.optional(Schema.String).pipe(T.JsonName("logo_path")),
      textColor: Schema.optional(Schema.String).pipe(T.JsonName("text_color")),
    }),
  ).pipe(T.JsonName("login_design")),
  name: Schema.optional(Schema.String),
  sessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("session_duration"),
  ),
  uiReadOnlyToggleReason: Schema.optional(Schema.String).pipe(
    T.JsonName("ui_read_only_toggle_reason"),
  ),
  userSeatExpirationInactiveTime: Schema.optional(Schema.String).pipe(
    T.JsonName("user_seat_expiration_inactive_time"),
  ),
  warpAuthSessionDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("warp_auth_session_duration"),
  ),
}) as unknown as Schema.Schema<UpdateOrganizationResponse>;

export const updateOrganization: (
  input: UpdateOrganizationRequest,
) => Effect.Effect<
  UpdateOrganizationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateOrganizationRequest,
  output: UpdateOrganizationResponse,
  errors: [],
}));

// =============================================================================
// OrganizationDoh
// =============================================================================

export interface GetOrganizationDohRequest {
  /** Identifier. */
  accountId: string;
}

export const GetOrganizationDohRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/access/organizations/doh",
  }),
) as unknown as Schema.Schema<GetOrganizationDohRequest>;

export interface GetOrganizationDohResponse {
  /** The ID of the service token. */
  id?: string;
  /** The Client ID for the service token. Access will check for this value in the `CF-Access-Client-ID` request header. */
  clientId?: string;
  /** The duration the DoH JWT is valid for. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. Note that the maximum duration for this setting is the same as the k */
  dohJwtDuration?: string;
  /** The duration for how long the service token will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. The default is 1 year in hours (8760h). */
  duration?: string;
  expiresAt?: string;
  /** The name of the service token. */
  name?: string;
}

export const GetOrganizationDohResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
  dohJwtDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("doh_jwt_duration"),
  ),
  duration: Schema.optional(Schema.String),
  expiresAt: Schema.optional(Schema.String).pipe(T.JsonName("expires_at")),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetOrganizationDohResponse>;

export const getOrganizationDoh: (
  input: GetOrganizationDohRequest,
) => Effect.Effect<
  GetOrganizationDohResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetOrganizationDohRequest,
  output: GetOrganizationDohResponse,
  errors: [],
}));

export interface PutOrganizationDohRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The duration the DoH JWT is valid for. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. Note that the maximum duration for this setting is the s */
  dohJwtDuration?: string;
  /** Body param: The uuid of the service token you want to use for DoH authentication */
  serviceTokenId?: string;
}

export const PutOrganizationDohRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  dohJwtDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("doh_jwt_duration"),
  ),
  serviceTokenId: Schema.optional(Schema.String).pipe(
    T.JsonName("service_token_id"),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/access/organizations/doh",
  }),
) as unknown as Schema.Schema<PutOrganizationDohRequest>;

export interface PutOrganizationDohResponse {
  /** The ID of the service token. */
  id?: string;
  /** The Client ID for the service token. Access will check for this value in the `CF-Access-Client-ID` request header. */
  clientId?: string;
  /** The duration the DoH JWT is valid for. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. Note that the maximum duration for this setting is the same as the k */
  dohJwtDuration?: string;
  /** The duration for how long the service token will be valid. Must be in the format `300ms` or `2h45m`. Valid time units are: ns, us (or µs), ms, s, m, h. The default is 1 year in hours (8760h). */
  duration?: string;
  expiresAt?: string;
  /** The name of the service token. */
  name?: string;
}

export const PutOrganizationDohResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  clientId: Schema.optional(Schema.String).pipe(T.JsonName("client_id")),
  dohJwtDuration: Schema.optional(Schema.String).pipe(
    T.JsonName("doh_jwt_duration"),
  ),
  duration: Schema.optional(Schema.String),
  expiresAt: Schema.optional(Schema.String).pipe(T.JsonName("expires_at")),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PutOrganizationDohResponse>;

export const putOrganizationDoh: (
  input: PutOrganizationDohRequest,
) => Effect.Effect<
  PutOrganizationDohResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutOrganizationDohRequest,
  output: PutOrganizationDohResponse,
  errors: [],
}));

// =============================================================================
// PathDexTracerouteTest
// =============================================================================

export interface NetworkPathDexTracerouteTestRequest {
  testId: string;
  /** Path param: unique identifier linked to an account */
  accountId: string;
  /** Query param: Device to filter tracroute result runs to */
  deviceId: string;
  /** Query param: Start time for aggregate metrics in ISO ms */
  from: string;
  /** Query param: Time interval for aggregate time slots. */
  interval: "minute" | "hour";
  /** Query param: End time for aggregate metrics in ISO ms */
  to: string;
}

export const NetworkPathDexTracerouteTestRequest = Schema.Struct({
  testId: Schema.String.pipe(T.HttpPath("testId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  deviceId: Schema.String.pipe(T.HttpQuery("deviceId")),
  from: Schema.String.pipe(T.HttpQuery("from")),
  interval: Schema.Literal("minute", "hour").pipe(T.HttpQuery("interval")),
  to: Schema.String.pipe(T.HttpQuery("to")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/traceroute-tests/{testId}/network-path",
  }),
) as unknown as Schema.Schema<NetworkPathDexTracerouteTestRequest>;

export type NetworkPathDexTracerouteTestResponse = unknown;

export const NetworkPathDexTracerouteTestResponse =
  Schema.Unknown as unknown as Schema.Schema<NetworkPathDexTracerouteTestResponse>;

export const networkPathDexTracerouteTest: (
  input: NetworkPathDexTracerouteTestRequest,
) => Effect.Effect<
  NetworkPathDexTracerouteTestResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: NetworkPathDexTracerouteTestRequest,
  output: NetworkPathDexTracerouteTestResponse,
  errors: [],
}));

// =============================================================================
// RiskScoring
// =============================================================================

export interface GetRiskScoringRequest {
  userId: string;
  accountId: string;
}

export const GetRiskScoringRequest = Schema.Struct({
  userId: Schema.String.pipe(T.HttpPath("userId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/zt_risk_scoring/{userId}",
  }),
) as unknown as Schema.Schema<GetRiskScoringRequest>;

export interface GetRiskScoringResponse {
  email: string;
  events: {
    id: string;
    name: string;
    riskLevel: "low" | "medium" | "high";
    timestamp: string;
    eventDetails?: unknown;
  }[];
  name: string;
  lastResetTime?: string | null;
  riskLevel?: "low" | "medium" | "high";
}

export const GetRiskScoringResponse = Schema.Struct({
  email: Schema.String,
  events: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      name: Schema.String,
      riskLevel: Schema.Literal("low", "medium", "high").pipe(
        T.JsonName("risk_level"),
      ),
      timestamp: Schema.String,
      eventDetails: Schema.optional(Schema.Unknown).pipe(
        T.JsonName("event_details"),
      ),
    }),
  ),
  name: Schema.String,
  lastResetTime: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("last_reset_time"),
  ),
  riskLevel: Schema.optional(Schema.Literal("low", "medium", "high")).pipe(
    T.JsonName("risk_level"),
  ),
}) as unknown as Schema.Schema<GetRiskScoringResponse>;

export const getRiskScoring: (
  input: GetRiskScoringRequest,
) => Effect.Effect<
  GetRiskScoringResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRiskScoringRequest,
  output: GetRiskScoringResponse,
  errors: [],
}));

export interface ResetRiskScoringRequest {
  userId: string;
  accountId: string;
}

export const ResetRiskScoringRequest = Schema.Struct({
  userId: Schema.String.pipe(T.HttpPath("userId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/zt_risk_scoring/{userId}/reset",
  }),
) as unknown as Schema.Schema<ResetRiskScoringRequest>;

export type ResetRiskScoringResponse = unknown;

export const ResetRiskScoringResponse =
  Schema.Unknown as unknown as Schema.Schema<ResetRiskScoringResponse>;

export const resetRiskScoring: (
  input: ResetRiskScoringRequest,
) => Effect.Effect<
  ResetRiskScoringResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ResetRiskScoringRequest,
  output: ResetRiskScoringResponse,
  errors: [],
}));

// =============================================================================
// RiskScoringBehaviour
// =============================================================================

export interface GetRiskScoringBehaviourRequest {
  accountId: string;
}

export const GetRiskScoringBehaviourRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/zt_risk_scoring/behaviors",
  }),
) as unknown as Schema.Schema<GetRiskScoringBehaviourRequest>;

export interface GetRiskScoringBehaviourResponse {
  behaviors: Record<string, unknown>;
}

export const GetRiskScoringBehaviourResponse = Schema.Struct({
  behaviors: Schema.Struct({}),
}) as unknown as Schema.Schema<GetRiskScoringBehaviourResponse>;

export const getRiskScoringBehaviour: (
  input: GetRiskScoringBehaviourRequest,
) => Effect.Effect<
  GetRiskScoringBehaviourResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRiskScoringBehaviourRequest,
  output: GetRiskScoringBehaviourResponse,
  errors: [],
}));

export interface PutRiskScoringBehaviourRequest {
  /** Path param: Account ID. */
  accountId: string;
  /** Body param: */
  behaviors: Record<string, unknown>;
}

export const PutRiskScoringBehaviourRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  behaviors: Schema.Struct({}),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/zt_risk_scoring/behaviors",
  }),
) as unknown as Schema.Schema<PutRiskScoringBehaviourRequest>;

export interface PutRiskScoringBehaviourResponse {
  behaviors: Record<string, unknown>;
}

export const PutRiskScoringBehaviourResponse = Schema.Struct({
  behaviors: Schema.Struct({}),
}) as unknown as Schema.Schema<PutRiskScoringBehaviourResponse>;

export const putRiskScoringBehaviour: (
  input: PutRiskScoringBehaviourRequest,
) => Effect.Effect<
  PutRiskScoringBehaviourResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutRiskScoringBehaviourRequest,
  output: PutRiskScoringBehaviourResponse,
  errors: [],
}));

// =============================================================================
// RiskScoringIntegration
// =============================================================================

export interface GetRiskScoringIntegrationRequest {
  integrationId: string;
  accountId: string;
}

export const GetRiskScoringIntegrationRequest = Schema.Struct({
  integrationId: Schema.String.pipe(T.HttpPath("integrationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/zt_risk_scoring/integrations/{integrationId}",
  }),
) as unknown as Schema.Schema<GetRiskScoringIntegrationRequest>;

export interface GetRiskScoringIntegrationResponse {
  /** The id of the integration, a UUIDv4. */
  id: string;
  /** The Cloudflare account tag. */
  accountTag: string;
  /** Whether this integration is enabled and should export changes in risk score. */
  active: boolean;
  /** When the integration was created in RFC3339 format. */
  createdAt: string;
  integrationType: "Okta";
  /** A reference ID defined by the client. Should be set to the Access-Okta IDP integration ID. Useful when the risk-score integration needs to be associated with a secondary asset and recalled using that  */
  referenceId: string;
  /** The base URL for the tenant. E.g. "https://tenant.okta.com". */
  tenantUrl: string;
  /** The URL for the Shared Signals Framework configuration, e.g. "/.well-known/sse-configuration/{integration_uuid}/". https://openid.net/specs/openid-sse-framework-1_0.html#rfc.section.6.2.1. */
  wellKnownUrl: string;
}

export const GetRiskScoringIntegrationResponse = Schema.Struct({
  id: Schema.String,
  accountTag: Schema.String.pipe(T.JsonName("account_tag")),
  active: Schema.Boolean,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  integrationType: Schema.Literal("Okta").pipe(T.JsonName("integration_type")),
  referenceId: Schema.String.pipe(T.JsonName("reference_id")),
  tenantUrl: Schema.String.pipe(T.JsonName("tenant_url")),
  wellKnownUrl: Schema.String.pipe(T.JsonName("well_known_url")),
}) as unknown as Schema.Schema<GetRiskScoringIntegrationResponse>;

export const getRiskScoringIntegration: (
  input: GetRiskScoringIntegrationRequest,
) => Effect.Effect<
  GetRiskScoringIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRiskScoringIntegrationRequest,
  output: GetRiskScoringIntegrationResponse,
  errors: [],
}));

export interface CreateRiskScoringIntegrationRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  integrationType: "Okta";
  /** Body param: The base url of the tenant, e.g. "https://tenant.okta.com". */
  tenantUrl: string;
  /** Body param: A reference id that can be supplied by the client. Currently this should be set to the Access-Okta IDP ID (a UUIDv4). https://developers.cloudflare.com/api/operations/access-identity-provi */
  referenceId?: string | null;
}

export const CreateRiskScoringIntegrationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  integrationType: Schema.Literal("Okta").pipe(T.JsonName("integration_type")),
  tenantUrl: Schema.String.pipe(T.JsonName("tenant_url")),
  referenceId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("reference_id"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/zt_risk_scoring/integrations",
  }),
) as unknown as Schema.Schema<CreateRiskScoringIntegrationRequest>;

export interface CreateRiskScoringIntegrationResponse {
  /** The id of the integration, a UUIDv4. */
  id: string;
  /** The Cloudflare account tag. */
  accountTag: string;
  /** Whether this integration is enabled and should export changes in risk score. */
  active: boolean;
  /** When the integration was created in RFC3339 format. */
  createdAt: string;
  integrationType: "Okta";
  /** A reference ID defined by the client. Should be set to the Access-Okta IDP integration ID. Useful when the risk-score integration needs to be associated with a secondary asset and recalled using that  */
  referenceId: string;
  /** The base URL for the tenant. E.g. "https://tenant.okta.com". */
  tenantUrl: string;
  /** The URL for the Shared Signals Framework configuration, e.g. "/.well-known/sse-configuration/{integration_uuid}/". https://openid.net/specs/openid-sse-framework-1_0.html#rfc.section.6.2.1. */
  wellKnownUrl: string;
}

export const CreateRiskScoringIntegrationResponse = Schema.Struct({
  id: Schema.String,
  accountTag: Schema.String.pipe(T.JsonName("account_tag")),
  active: Schema.Boolean,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  integrationType: Schema.Literal("Okta").pipe(T.JsonName("integration_type")),
  referenceId: Schema.String.pipe(T.JsonName("reference_id")),
  tenantUrl: Schema.String.pipe(T.JsonName("tenant_url")),
  wellKnownUrl: Schema.String.pipe(T.JsonName("well_known_url")),
}) as unknown as Schema.Schema<CreateRiskScoringIntegrationResponse>;

export const createRiskScoringIntegration: (
  input: CreateRiskScoringIntegrationRequest,
) => Effect.Effect<
  CreateRiskScoringIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateRiskScoringIntegrationRequest,
  output: CreateRiskScoringIntegrationResponse,
  errors: [],
}));

export interface UpdateRiskScoringIntegrationRequest {
  integrationId: string;
  /** Path param: */
  accountId: string;
  /** Body param: Whether this integration is enabled. If disabled, no risk changes will be exported to the third-party. */
  active: boolean;
  /** Body param: The base url of the tenant, e.g. "https://tenant.okta.com". */
  tenantUrl: string;
  /** Body param: A reference id that can be supplied by the client. Currently this should be set to the Access-Okta IDP ID (a UUIDv4). https://developers.cloudflare.com/api/operations/access-identity-provi */
  referenceId?: string | null;
}

export const UpdateRiskScoringIntegrationRequest = Schema.Struct({
  integrationId: Schema.String.pipe(T.HttpPath("integrationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  active: Schema.Boolean,
  tenantUrl: Schema.String.pipe(T.JsonName("tenant_url")),
  referenceId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("reference_id"),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/zt_risk_scoring/integrations/{integrationId}",
  }),
) as unknown as Schema.Schema<UpdateRiskScoringIntegrationRequest>;

export interface UpdateRiskScoringIntegrationResponse {
  /** The id of the integration, a UUIDv4. */
  id: string;
  /** The Cloudflare account tag. */
  accountTag: string;
  /** Whether this integration is enabled and should export changes in risk score. */
  active: boolean;
  /** When the integration was created in RFC3339 format. */
  createdAt: string;
  integrationType: "Okta";
  /** A reference ID defined by the client. Should be set to the Access-Okta IDP integration ID. Useful when the risk-score integration needs to be associated with a secondary asset and recalled using that  */
  referenceId: string;
  /** The base URL for the tenant. E.g. "https://tenant.okta.com". */
  tenantUrl: string;
  /** The URL for the Shared Signals Framework configuration, e.g. "/.well-known/sse-configuration/{integration_uuid}/". https://openid.net/specs/openid-sse-framework-1_0.html#rfc.section.6.2.1. */
  wellKnownUrl: string;
}

export const UpdateRiskScoringIntegrationResponse = Schema.Struct({
  id: Schema.String,
  accountTag: Schema.String.pipe(T.JsonName("account_tag")),
  active: Schema.Boolean,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  integrationType: Schema.Literal("Okta").pipe(T.JsonName("integration_type")),
  referenceId: Schema.String.pipe(T.JsonName("reference_id")),
  tenantUrl: Schema.String.pipe(T.JsonName("tenant_url")),
  wellKnownUrl: Schema.String.pipe(T.JsonName("well_known_url")),
}) as unknown as Schema.Schema<UpdateRiskScoringIntegrationResponse>;

export const updateRiskScoringIntegration: (
  input: UpdateRiskScoringIntegrationRequest,
) => Effect.Effect<
  UpdateRiskScoringIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateRiskScoringIntegrationRequest,
  output: UpdateRiskScoringIntegrationResponse,
  errors: [],
}));

export interface DeleteRiskScoringIntegrationRequest {
  integrationId: string;
  accountId: string;
}

export const DeleteRiskScoringIntegrationRequest = Schema.Struct({
  integrationId: Schema.String.pipe(T.HttpPath("integrationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/zt_risk_scoring/integrations/{integrationId}",
  }),
) as unknown as Schema.Schema<DeleteRiskScoringIntegrationRequest>;

export type DeleteRiskScoringIntegrationResponse = unknown;

export const DeleteRiskScoringIntegrationResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteRiskScoringIntegrationResponse>;

export const deleteRiskScoringIntegration: (
  input: DeleteRiskScoringIntegrationRequest,
) => Effect.Effect<
  DeleteRiskScoringIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteRiskScoringIntegrationRequest,
  output: DeleteRiskScoringIntegrationResponse,
  errors: [],
}));

// =============================================================================
// RiskScoringIntegrationReference
// =============================================================================

export interface GetRiskScoringIntegrationReferenceRequest {
  referenceId: string;
  accountId: string;
}

export const GetRiskScoringIntegrationReferenceRequest = Schema.Struct({
  referenceId: Schema.String.pipe(T.HttpPath("referenceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/zt_risk_scoring/integrations/reference_id/{referenceId}",
  }),
) as unknown as Schema.Schema<GetRiskScoringIntegrationReferenceRequest>;

export interface GetRiskScoringIntegrationReferenceResponse {
  /** The id of the integration, a UUIDv4. */
  id: string;
  /** The Cloudflare account tag. */
  accountTag: string;
  /** Whether this integration is enabled and should export changes in risk score. */
  active: boolean;
  /** When the integration was created in RFC3339 format. */
  createdAt: string;
  integrationType: "Okta";
  /** A reference ID defined by the client. Should be set to the Access-Okta IDP integration ID. Useful when the risk-score integration needs to be associated with a secondary asset and recalled using that  */
  referenceId: string;
  /** The base URL for the tenant. E.g. "https://tenant.okta.com". */
  tenantUrl: string;
  /** The URL for the Shared Signals Framework configuration, e.g. "/.well-known/sse-configuration/{integration_uuid}/". https://openid.net/specs/openid-sse-framework-1_0.html#rfc.section.6.2.1. */
  wellKnownUrl: string;
}

export const GetRiskScoringIntegrationReferenceResponse = Schema.Struct({
  id: Schema.String,
  accountTag: Schema.String.pipe(T.JsonName("account_tag")),
  active: Schema.Boolean,
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  integrationType: Schema.Literal("Okta").pipe(T.JsonName("integration_type")),
  referenceId: Schema.String.pipe(T.JsonName("reference_id")),
  tenantUrl: Schema.String.pipe(T.JsonName("tenant_url")),
  wellKnownUrl: Schema.String.pipe(T.JsonName("well_known_url")),
}) as unknown as Schema.Schema<GetRiskScoringIntegrationReferenceResponse>;

export const getRiskScoringIntegrationReference: (
  input: GetRiskScoringIntegrationReferenceRequest,
) => Effect.Effect<
  GetRiskScoringIntegrationReferenceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRiskScoringIntegrationReferenceRequest,
  output: GetRiskScoringIntegrationReferenceResponse,
  errors: [],
}));

// =============================================================================
// RiskScoringSummary
// =============================================================================

export interface GetRiskScoringSummaryRequest {
  accountId: string;
}

export const GetRiskScoringSummaryRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/zt_risk_scoring/summary",
  }),
) as unknown as Schema.Schema<GetRiskScoringSummaryRequest>;

export interface GetRiskScoringSummaryResponse {
  users: {
    email: string;
    eventCount: number;
    lastEvent: string;
    maxRiskLevel: "low" | "medium" | "high";
    name: string;
    userId: string;
  }[];
}

export const GetRiskScoringSummaryResponse = Schema.Struct({
  users: Schema.Array(
    Schema.Struct({
      email: Schema.String,
      eventCount: Schema.Number.pipe(T.JsonName("event_count")),
      lastEvent: Schema.String.pipe(T.JsonName("last_event")),
      maxRiskLevel: Schema.Literal("low", "medium", "high").pipe(
        T.JsonName("max_risk_level"),
      ),
      name: Schema.String,
      userId: Schema.String.pipe(T.JsonName("user_id")),
    }),
  ),
}) as unknown as Schema.Schema<GetRiskScoringSummaryResponse>;

export const getRiskScoringSummary: (
  input: GetRiskScoringSummaryRequest,
) => Effect.Effect<
  GetRiskScoringSummaryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRiskScoringSummaryRequest,
  output: GetRiskScoringSummaryResponse,
  errors: [],
}));

// =============================================================================
// SeedGatewayAuditSshSetting
// =============================================================================

export interface RotateSeedGatewayAuditSshSettingRequest {
  accountId: string;
}

export const RotateSeedGatewayAuditSshSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/gateway/audit_ssh_settings/rotate_seed",
  }),
) as unknown as Schema.Schema<RotateSeedGatewayAuditSshSettingRequest>;

export interface RotateSeedGatewayAuditSshSettingResponse {
  createdAt?: string;
  /** Provide the Base64-encoded HPKE public key that encrypts SSH session logs. See https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/use-cases/ssh/ssh-infrastructure-access/#en */
  publicKey?: string;
  /** Identify the seed ID. */
  seedId?: string;
  updatedAt?: string;
}

export const RotateSeedGatewayAuditSshSettingResponse = Schema.Struct({
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  publicKey: Schema.optional(Schema.String).pipe(T.JsonName("public_key")),
  seedId: Schema.optional(Schema.String).pipe(T.JsonName("seed_id")),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<RotateSeedGatewayAuditSshSettingResponse>;

export const rotateSeedGatewayAuditSshSetting: (
  input: RotateSeedGatewayAuditSshSettingRequest,
) => Effect.Effect<
  RotateSeedGatewayAuditSshSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RotateSeedGatewayAuditSshSettingRequest,
  output: RotateSeedGatewayAuditSshSettingResponse,
  errors: [],
}));

// =============================================================================
// TimeDexFleetStatus
// =============================================================================

export interface OverTimeDexFleetStatusRequest {
  /** Path param: Unique identifier for account */
  accountId: string;
  /** Query param: Time range beginning in ISO format */
  from: string;
  /** Query param: Time range end in ISO format */
  to: string;
  /** Query param: Cloudflare colo */
  colo?: string;
  /** Query param: Device-specific ID, given as UUID v4 */
  deviceId?: string;
}

export const OverTimeDexFleetStatusRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  from: Schema.String.pipe(T.HttpQuery("from")),
  to: Schema.String.pipe(T.HttpQuery("to")),
  colo: Schema.optional(Schema.String).pipe(T.HttpQuery("colo")),
  deviceId: Schema.optional(Schema.String).pipe(T.HttpQuery("device_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dex/fleet-status/over-time",
  }),
) as unknown as Schema.Schema<OverTimeDexFleetStatusRequest>;

export type OverTimeDexFleetStatusResponse = unknown;

export const OverTimeDexFleetStatusResponse =
  Schema.Unknown as unknown as Schema.Schema<OverTimeDexFleetStatusResponse>;

export const overTimeDexFleetStatus: (
  input: OverTimeDexFleetStatusRequest,
) => Effect.Effect<
  OverTimeDexFleetStatusResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: OverTimeDexFleetStatusRequest,
  output: OverTimeDexFleetStatusResponse,
  errors: [],
}));

// =============================================================================
// TokensAccessApplication
// =============================================================================

export interface RevokeTokensAccessApplicationRequest {}

export const RevokeTokensAccessApplicationRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/access/apps/{appId}/revoke_tokens",
  }),
) as unknown as Schema.Schema<RevokeTokensAccessApplicationRequest>;

export type RevokeTokensAccessApplicationResponse = unknown;

export const RevokeTokensAccessApplicationResponse =
  Schema.Unknown as unknown as Schema.Schema<RevokeTokensAccessApplicationResponse>;

export const revokeTokensAccessApplication: (
  input: RevokeTokensAccessApplicationRequest,
) => Effect.Effect<
  RevokeTokensAccessApplicationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RevokeTokensAccessApplicationRequest,
  output: RevokeTokensAccessApplicationResponse,
  errors: [],
}));

// =============================================================================
// TunnelCloudflared
// =============================================================================

export interface GetTunnelCloudflaredRequest {
  tunnelId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const GetTunnelCloudflaredRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cfd_tunnel/{tunnelId}",
  }),
) as unknown as Schema.Schema<GetTunnelCloudflaredRequest>;

export type GetTunnelCloudflaredResponse =
  | unknown
  | {
      id?: string;
      accountTag?: string;
      connections?: {
        id?: string;
        clientId?: string;
        clientVersion?: string;
        coloName?: string;
        isPendingReconnect?: boolean;
        openedAt?: string;
        originIp?: string;
        uuid?: string;
      }[];
      connsActiveAt?: string;
      connsInactiveAt?: string;
      createdAt?: string;
      deletedAt?: string;
      metadata?: unknown;
      name?: string;
      status?: "inactive" | "degraded" | "healthy" | "down";
      tunType?:
        | "cfd_tunnel"
        | "warp_connector"
        | "warp"
        | "magic"
        | "ip_sec"
        | "gre"
        | "cni";
    };

export const GetTunnelCloudflaredResponse = Schema.Union(
  Schema.Unknown,
  Schema.Struct({
    id: Schema.optional(Schema.String),
    accountTag: Schema.optional(Schema.String).pipe(T.JsonName("account_tag")),
    connections: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          clientId: Schema.optional(Schema.String).pipe(
            T.JsonName("client_id"),
          ),
          clientVersion: Schema.optional(Schema.String).pipe(
            T.JsonName("client_version"),
          ),
          coloName: Schema.optional(Schema.String).pipe(
            T.JsonName("colo_name"),
          ),
          isPendingReconnect: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("is_pending_reconnect"),
          ),
          openedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("opened_at"),
          ),
          originIp: Schema.optional(Schema.String).pipe(
            T.JsonName("origin_ip"),
          ),
          uuid: Schema.optional(Schema.String),
        }),
      ),
    ),
    connsActiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_active_at"),
    ),
    connsInactiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_inactive_at"),
    ),
    createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
    deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
    metadata: Schema.optional(Schema.Unknown),
    name: Schema.optional(Schema.String),
    status: Schema.optional(
      Schema.Literal("inactive", "degraded", "healthy", "down"),
    ),
    tunType: Schema.optional(
      Schema.Literal(
        "cfd_tunnel",
        "warp_connector",
        "warp",
        "magic",
        "ip_sec",
        "gre",
        "cni",
      ),
    ).pipe(T.JsonName("tun_type")),
  }),
) as unknown as Schema.Schema<GetTunnelCloudflaredResponse>;

export const getTunnelCloudflared: (
  input: GetTunnelCloudflaredRequest,
) => Effect.Effect<
  GetTunnelCloudflaredResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetTunnelCloudflaredRequest,
  output: GetTunnelCloudflaredResponse,
  errors: [],
}));

export interface CreateTunnelCloudflaredRequest {
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: A user-friendly name for a tunnel. */
  name: string;
  /** Body param: Indicates if this is a locally or remotely configured tunnel. If `local`, manage the tunnel using a YAML file on the origin machine. If `cloudflare`, manage the tunnel on the Zero Trust da */
  configSrc?: "local" | "cloudflare";
  /** Body param: Sets the password required to run a locally-managed tunnel. Must be at least 32 bytes and encoded as a base64 string. */
  tunnelSecret?: string;
}

export const CreateTunnelCloudflaredRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  configSrc: Schema.optional(Schema.Literal("local", "cloudflare")).pipe(
    T.JsonName("config_src"),
  ),
  tunnelSecret: Schema.optional(Schema.String).pipe(
    T.JsonName("tunnel_secret"),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/cfd_tunnel" }),
) as unknown as Schema.Schema<CreateTunnelCloudflaredRequest>;

export type CreateTunnelCloudflaredResponse =
  | unknown
  | {
      id?: string;
      accountTag?: string;
      connections?: {
        id?: string;
        clientId?: string;
        clientVersion?: string;
        coloName?: string;
        isPendingReconnect?: boolean;
        openedAt?: string;
        originIp?: string;
        uuid?: string;
      }[];
      connsActiveAt?: string;
      connsInactiveAt?: string;
      createdAt?: string;
      deletedAt?: string;
      metadata?: unknown;
      name?: string;
      status?: "inactive" | "degraded" | "healthy" | "down";
      tunType?:
        | "cfd_tunnel"
        | "warp_connector"
        | "warp"
        | "magic"
        | "ip_sec"
        | "gre"
        | "cni";
    };

export const CreateTunnelCloudflaredResponse = Schema.Union(
  Schema.Unknown,
  Schema.Struct({
    id: Schema.optional(Schema.String),
    accountTag: Schema.optional(Schema.String).pipe(T.JsonName("account_tag")),
    connections: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          clientId: Schema.optional(Schema.String).pipe(
            T.JsonName("client_id"),
          ),
          clientVersion: Schema.optional(Schema.String).pipe(
            T.JsonName("client_version"),
          ),
          coloName: Schema.optional(Schema.String).pipe(
            T.JsonName("colo_name"),
          ),
          isPendingReconnect: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("is_pending_reconnect"),
          ),
          openedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("opened_at"),
          ),
          originIp: Schema.optional(Schema.String).pipe(
            T.JsonName("origin_ip"),
          ),
          uuid: Schema.optional(Schema.String),
        }),
      ),
    ),
    connsActiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_active_at"),
    ),
    connsInactiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_inactive_at"),
    ),
    createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
    deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
    metadata: Schema.optional(Schema.Unknown),
    name: Schema.optional(Schema.String),
    status: Schema.optional(
      Schema.Literal("inactive", "degraded", "healthy", "down"),
    ),
    tunType: Schema.optional(
      Schema.Literal(
        "cfd_tunnel",
        "warp_connector",
        "warp",
        "magic",
        "ip_sec",
        "gre",
        "cni",
      ),
    ).pipe(T.JsonName("tun_type")),
  }),
) as unknown as Schema.Schema<CreateTunnelCloudflaredResponse>;

export const createTunnelCloudflared: (
  input: CreateTunnelCloudflaredRequest,
) => Effect.Effect<
  CreateTunnelCloudflaredResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateTunnelCloudflaredRequest,
  output: CreateTunnelCloudflaredResponse,
  errors: [],
}));

export interface PatchTunnelCloudflaredRequest {
  tunnelId: string;
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: A user-friendly name for a tunnel. */
  name?: string;
  /** Body param: Sets the password required to run a locally-managed tunnel. Must be at least 32 bytes and encoded as a base64 string. */
  tunnelSecret?: string;
}

export const PatchTunnelCloudflaredRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
  tunnelSecret: Schema.optional(Schema.String).pipe(
    T.JsonName("tunnel_secret"),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/cfd_tunnel/{tunnelId}",
  }),
) as unknown as Schema.Schema<PatchTunnelCloudflaredRequest>;

export type PatchTunnelCloudflaredResponse =
  | unknown
  | {
      id?: string;
      accountTag?: string;
      connections?: {
        id?: string;
        clientId?: string;
        clientVersion?: string;
        coloName?: string;
        isPendingReconnect?: boolean;
        openedAt?: string;
        originIp?: string;
        uuid?: string;
      }[];
      connsActiveAt?: string;
      connsInactiveAt?: string;
      createdAt?: string;
      deletedAt?: string;
      metadata?: unknown;
      name?: string;
      status?: "inactive" | "degraded" | "healthy" | "down";
      tunType?:
        | "cfd_tunnel"
        | "warp_connector"
        | "warp"
        | "magic"
        | "ip_sec"
        | "gre"
        | "cni";
    };

export const PatchTunnelCloudflaredResponse = Schema.Union(
  Schema.Unknown,
  Schema.Struct({
    id: Schema.optional(Schema.String),
    accountTag: Schema.optional(Schema.String).pipe(T.JsonName("account_tag")),
    connections: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          clientId: Schema.optional(Schema.String).pipe(
            T.JsonName("client_id"),
          ),
          clientVersion: Schema.optional(Schema.String).pipe(
            T.JsonName("client_version"),
          ),
          coloName: Schema.optional(Schema.String).pipe(
            T.JsonName("colo_name"),
          ),
          isPendingReconnect: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("is_pending_reconnect"),
          ),
          openedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("opened_at"),
          ),
          originIp: Schema.optional(Schema.String).pipe(
            T.JsonName("origin_ip"),
          ),
          uuid: Schema.optional(Schema.String),
        }),
      ),
    ),
    connsActiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_active_at"),
    ),
    connsInactiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_inactive_at"),
    ),
    createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
    deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
    metadata: Schema.optional(Schema.Unknown),
    name: Schema.optional(Schema.String),
    status: Schema.optional(
      Schema.Literal("inactive", "degraded", "healthy", "down"),
    ),
    tunType: Schema.optional(
      Schema.Literal(
        "cfd_tunnel",
        "warp_connector",
        "warp",
        "magic",
        "ip_sec",
        "gre",
        "cni",
      ),
    ).pipe(T.JsonName("tun_type")),
  }),
) as unknown as Schema.Schema<PatchTunnelCloudflaredResponse>;

export const patchTunnelCloudflared: (
  input: PatchTunnelCloudflaredRequest,
) => Effect.Effect<
  PatchTunnelCloudflaredResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchTunnelCloudflaredRequest,
  output: PatchTunnelCloudflaredResponse,
  errors: [],
}));

export interface DeleteTunnelCloudflaredRequest {
  tunnelId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const DeleteTunnelCloudflaredRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cfd_tunnel/{tunnelId}",
  }),
) as unknown as Schema.Schema<DeleteTunnelCloudflaredRequest>;

export type DeleteTunnelCloudflaredResponse =
  | unknown
  | {
      id?: string;
      accountTag?: string;
      connections?: {
        id?: string;
        clientId?: string;
        clientVersion?: string;
        coloName?: string;
        isPendingReconnect?: boolean;
        openedAt?: string;
        originIp?: string;
        uuid?: string;
      }[];
      connsActiveAt?: string;
      connsInactiveAt?: string;
      createdAt?: string;
      deletedAt?: string;
      metadata?: unknown;
      name?: string;
      status?: "inactive" | "degraded" | "healthy" | "down";
      tunType?:
        | "cfd_tunnel"
        | "warp_connector"
        | "warp"
        | "magic"
        | "ip_sec"
        | "gre"
        | "cni";
    };

export const DeleteTunnelCloudflaredResponse = Schema.Union(
  Schema.Unknown,
  Schema.Struct({
    id: Schema.optional(Schema.String),
    accountTag: Schema.optional(Schema.String).pipe(T.JsonName("account_tag")),
    connections: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          clientId: Schema.optional(Schema.String).pipe(
            T.JsonName("client_id"),
          ),
          clientVersion: Schema.optional(Schema.String).pipe(
            T.JsonName("client_version"),
          ),
          coloName: Schema.optional(Schema.String).pipe(
            T.JsonName("colo_name"),
          ),
          isPendingReconnect: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("is_pending_reconnect"),
          ),
          openedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("opened_at"),
          ),
          originIp: Schema.optional(Schema.String).pipe(
            T.JsonName("origin_ip"),
          ),
          uuid: Schema.optional(Schema.String),
        }),
      ),
    ),
    connsActiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_active_at"),
    ),
    connsInactiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_inactive_at"),
    ),
    createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
    deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
    metadata: Schema.optional(Schema.Unknown),
    name: Schema.optional(Schema.String),
    status: Schema.optional(
      Schema.Literal("inactive", "degraded", "healthy", "down"),
    ),
    tunType: Schema.optional(
      Schema.Literal(
        "cfd_tunnel",
        "warp_connector",
        "warp",
        "magic",
        "ip_sec",
        "gre",
        "cni",
      ),
    ).pipe(T.JsonName("tun_type")),
  }),
) as unknown as Schema.Schema<DeleteTunnelCloudflaredResponse>;

export const deleteTunnelCloudflared: (
  input: DeleteTunnelCloudflaredRequest,
) => Effect.Effect<
  DeleteTunnelCloudflaredResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteTunnelCloudflaredRequest,
  output: DeleteTunnelCloudflaredResponse,
  errors: [],
}));

// =============================================================================
// TunnelCloudflaredConfiguration
// =============================================================================

export interface GetTunnelCloudflaredConfigurationRequest {
  tunnelId: string;
  /** Identifier. */
  accountId: string;
}

export const GetTunnelCloudflaredConfigurationRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cfd_tunnel/{tunnelId}/configurations",
  }),
) as unknown as Schema.Schema<GetTunnelCloudflaredConfigurationRequest>;

export interface GetTunnelCloudflaredConfigurationResponse {
  /** Identifier. */
  accountId?: string;
  /** The tunnel configuration and ingress rules. */
  config?: {
    ingress?: {
      hostname: string;
      service: string;
      originRequest?: {
        access?: { audTag: string[]; teamName: string; required?: boolean };
        caPool?: string;
        connectTimeout?: number;
        disableChunkedEncoding?: boolean;
        http2Origin?: boolean;
        httpHostHeader?: string;
        keepAliveConnections?: number;
        keepAliveTimeout?: number;
        noHappyEyeballs?: boolean;
        noTLSVerify?: boolean;
        originServerName?: string;
        proxyType?: string;
        tcpKeepAlive?: number;
        tlsTimeout?: number;
      };
      path?: string;
    }[];
    originRequest?: {
      access?: { audTag: string[]; teamName: string; required?: boolean };
      caPool?: string;
      connectTimeout?: number;
      disableChunkedEncoding?: boolean;
      http2Origin?: boolean;
      httpHostHeader?: string;
      keepAliveConnections?: number;
      keepAliveTimeout?: number;
      noHappyEyeballs?: boolean;
      noTLSVerify?: boolean;
      originServerName?: string;
      proxyType?: string;
      tcpKeepAlive?: number;
      tlsTimeout?: number;
    };
  };
  createdAt?: string;
  /** Indicates if this is a locally or remotely configured tunnel. If `local`, manage the tunnel using a YAML file on the origin machine. If `cloudflare`, manage the tunnel's configuration on the Zero Trus */
  source?: "local" | "cloudflare";
  /** UUID of the tunnel. */
  tunnelId?: string;
  /** The version of the Tunnel Configuration. */
  version?: number;
}

export const GetTunnelCloudflaredConfigurationResponse = Schema.Struct({
  accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
  config: Schema.optional(
    Schema.Struct({
      ingress: Schema.optional(
        Schema.Array(
          Schema.Struct({
            hostname: Schema.String,
            service: Schema.String,
            originRequest: Schema.optional(
              Schema.Struct({
                access: Schema.optional(
                  Schema.Struct({
                    audTag: Schema.Array(Schema.String),
                    teamName: Schema.String,
                    required: Schema.optional(Schema.Boolean),
                  }),
                ),
                caPool: Schema.optional(Schema.String),
                connectTimeout: Schema.optional(Schema.Number),
                disableChunkedEncoding: Schema.optional(Schema.Boolean),
                http2Origin: Schema.optional(Schema.Boolean),
                httpHostHeader: Schema.optional(Schema.String),
                keepAliveConnections: Schema.optional(Schema.Number),
                keepAliveTimeout: Schema.optional(Schema.Number),
                noHappyEyeballs: Schema.optional(Schema.Boolean),
                noTLSVerify: Schema.optional(Schema.Boolean),
                originServerName: Schema.optional(Schema.String),
                proxyType: Schema.optional(Schema.String),
                tcpKeepAlive: Schema.optional(Schema.Number),
                tlsTimeout: Schema.optional(Schema.Number),
              }),
            ),
            path: Schema.optional(Schema.String),
          }),
        ),
      ),
      originRequest: Schema.optional(
        Schema.Struct({
          access: Schema.optional(
            Schema.Struct({
              audTag: Schema.Array(Schema.String),
              teamName: Schema.String,
              required: Schema.optional(Schema.Boolean),
            }),
          ),
          caPool: Schema.optional(Schema.String),
          connectTimeout: Schema.optional(Schema.Number),
          disableChunkedEncoding: Schema.optional(Schema.Boolean),
          http2Origin: Schema.optional(Schema.Boolean),
          httpHostHeader: Schema.optional(Schema.String),
          keepAliveConnections: Schema.optional(Schema.Number),
          keepAliveTimeout: Schema.optional(Schema.Number),
          noHappyEyeballs: Schema.optional(Schema.Boolean),
          noTLSVerify: Schema.optional(Schema.Boolean),
          originServerName: Schema.optional(Schema.String),
          proxyType: Schema.optional(Schema.String),
          tcpKeepAlive: Schema.optional(Schema.Number),
          tlsTimeout: Schema.optional(Schema.Number),
        }),
      ),
    }),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  source: Schema.optional(Schema.Literal("local", "cloudflare")),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
  version: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetTunnelCloudflaredConfigurationResponse>;

export const getTunnelCloudflaredConfiguration: (
  input: GetTunnelCloudflaredConfigurationRequest,
) => Effect.Effect<
  GetTunnelCloudflaredConfigurationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetTunnelCloudflaredConfigurationRequest,
  output: GetTunnelCloudflaredConfigurationResponse,
  errors: [],
}));

export interface PutTunnelCloudflaredConfigurationRequest {
  tunnelId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The tunnel configuration and ingress rules. */
  config?: {
    ingress?: {
      hostname: string;
      service: string;
      originRequest?: {
        access?: { audTag: string[]; teamName: string; required?: boolean };
        caPool?: string;
        connectTimeout?: number;
        disableChunkedEncoding?: boolean;
        http2Origin?: boolean;
        httpHostHeader?: string;
        keepAliveConnections?: number;
        keepAliveTimeout?: number;
        noHappyEyeballs?: boolean;
        noTLSVerify?: boolean;
        originServerName?: string;
        proxyType?: string;
        tcpKeepAlive?: number;
        tlsTimeout?: number;
      };
      path?: string;
    }[];
    originRequest?: {
      access?: { audTag: string[]; teamName: string; required?: boolean };
      caPool?: string;
      connectTimeout?: number;
      disableChunkedEncoding?: boolean;
      http2Origin?: boolean;
      httpHostHeader?: string;
      keepAliveConnections?: number;
      keepAliveTimeout?: number;
      noHappyEyeballs?: boolean;
      noTLSVerify?: boolean;
      originServerName?: string;
      proxyType?: string;
      tcpKeepAlive?: number;
      tlsTimeout?: number;
    };
  };
}

export const PutTunnelCloudflaredConfigurationRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  config: Schema.optional(
    Schema.Struct({
      ingress: Schema.optional(
        Schema.Array(
          Schema.Struct({
            hostname: Schema.String,
            service: Schema.String,
            originRequest: Schema.optional(
              Schema.Struct({
                access: Schema.optional(
                  Schema.Struct({
                    audTag: Schema.Array(Schema.String),
                    teamName: Schema.String,
                    required: Schema.optional(Schema.Boolean),
                  }),
                ),
                caPool: Schema.optional(Schema.String),
                connectTimeout: Schema.optional(Schema.Number),
                disableChunkedEncoding: Schema.optional(Schema.Boolean),
                http2Origin: Schema.optional(Schema.Boolean),
                httpHostHeader: Schema.optional(Schema.String),
                keepAliveConnections: Schema.optional(Schema.Number),
                keepAliveTimeout: Schema.optional(Schema.Number),
                noHappyEyeballs: Schema.optional(Schema.Boolean),
                noTLSVerify: Schema.optional(Schema.Boolean),
                originServerName: Schema.optional(Schema.String),
                proxyType: Schema.optional(Schema.String),
                tcpKeepAlive: Schema.optional(Schema.Number),
                tlsTimeout: Schema.optional(Schema.Number),
              }),
            ),
            path: Schema.optional(Schema.String),
          }),
        ),
      ),
      originRequest: Schema.optional(
        Schema.Struct({
          access: Schema.optional(
            Schema.Struct({
              audTag: Schema.Array(Schema.String),
              teamName: Schema.String,
              required: Schema.optional(Schema.Boolean),
            }),
          ),
          caPool: Schema.optional(Schema.String),
          connectTimeout: Schema.optional(Schema.Number),
          disableChunkedEncoding: Schema.optional(Schema.Boolean),
          http2Origin: Schema.optional(Schema.Boolean),
          httpHostHeader: Schema.optional(Schema.String),
          keepAliveConnections: Schema.optional(Schema.Number),
          keepAliveTimeout: Schema.optional(Schema.Number),
          noHappyEyeballs: Schema.optional(Schema.Boolean),
          noTLSVerify: Schema.optional(Schema.Boolean),
          originServerName: Schema.optional(Schema.String),
          proxyType: Schema.optional(Schema.String),
          tcpKeepAlive: Schema.optional(Schema.Number),
          tlsTimeout: Schema.optional(Schema.Number),
        }),
      ),
    }),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/cfd_tunnel/{tunnelId}/configurations",
  }),
) as unknown as Schema.Schema<PutTunnelCloudflaredConfigurationRequest>;

export interface PutTunnelCloudflaredConfigurationResponse {
  /** Identifier. */
  accountId?: string;
  /** The tunnel configuration and ingress rules. */
  config?: {
    ingress?: {
      hostname: string;
      service: string;
      originRequest?: {
        access?: { audTag: string[]; teamName: string; required?: boolean };
        caPool?: string;
        connectTimeout?: number;
        disableChunkedEncoding?: boolean;
        http2Origin?: boolean;
        httpHostHeader?: string;
        keepAliveConnections?: number;
        keepAliveTimeout?: number;
        noHappyEyeballs?: boolean;
        noTLSVerify?: boolean;
        originServerName?: string;
        proxyType?: string;
        tcpKeepAlive?: number;
        tlsTimeout?: number;
      };
      path?: string;
    }[];
    originRequest?: {
      access?: { audTag: string[]; teamName: string; required?: boolean };
      caPool?: string;
      connectTimeout?: number;
      disableChunkedEncoding?: boolean;
      http2Origin?: boolean;
      httpHostHeader?: string;
      keepAliveConnections?: number;
      keepAliveTimeout?: number;
      noHappyEyeballs?: boolean;
      noTLSVerify?: boolean;
      originServerName?: string;
      proxyType?: string;
      tcpKeepAlive?: number;
      tlsTimeout?: number;
    };
  };
  createdAt?: string;
  /** Indicates if this is a locally or remotely configured tunnel. If `local`, manage the tunnel using a YAML file on the origin machine. If `cloudflare`, manage the tunnel's configuration on the Zero Trus */
  source?: "local" | "cloudflare";
  /** UUID of the tunnel. */
  tunnelId?: string;
  /** The version of the Tunnel Configuration. */
  version?: number;
}

export const PutTunnelCloudflaredConfigurationResponse = Schema.Struct({
  accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
  config: Schema.optional(
    Schema.Struct({
      ingress: Schema.optional(
        Schema.Array(
          Schema.Struct({
            hostname: Schema.String,
            service: Schema.String,
            originRequest: Schema.optional(
              Schema.Struct({
                access: Schema.optional(
                  Schema.Struct({
                    audTag: Schema.Array(Schema.String),
                    teamName: Schema.String,
                    required: Schema.optional(Schema.Boolean),
                  }),
                ),
                caPool: Schema.optional(Schema.String),
                connectTimeout: Schema.optional(Schema.Number),
                disableChunkedEncoding: Schema.optional(Schema.Boolean),
                http2Origin: Schema.optional(Schema.Boolean),
                httpHostHeader: Schema.optional(Schema.String),
                keepAliveConnections: Schema.optional(Schema.Number),
                keepAliveTimeout: Schema.optional(Schema.Number),
                noHappyEyeballs: Schema.optional(Schema.Boolean),
                noTLSVerify: Schema.optional(Schema.Boolean),
                originServerName: Schema.optional(Schema.String),
                proxyType: Schema.optional(Schema.String),
                tcpKeepAlive: Schema.optional(Schema.Number),
                tlsTimeout: Schema.optional(Schema.Number),
              }),
            ),
            path: Schema.optional(Schema.String),
          }),
        ),
      ),
      originRequest: Schema.optional(
        Schema.Struct({
          access: Schema.optional(
            Schema.Struct({
              audTag: Schema.Array(Schema.String),
              teamName: Schema.String,
              required: Schema.optional(Schema.Boolean),
            }),
          ),
          caPool: Schema.optional(Schema.String),
          connectTimeout: Schema.optional(Schema.Number),
          disableChunkedEncoding: Schema.optional(Schema.Boolean),
          http2Origin: Schema.optional(Schema.Boolean),
          httpHostHeader: Schema.optional(Schema.String),
          keepAliveConnections: Schema.optional(Schema.Number),
          keepAliveTimeout: Schema.optional(Schema.Number),
          noHappyEyeballs: Schema.optional(Schema.Boolean),
          noTLSVerify: Schema.optional(Schema.Boolean),
          originServerName: Schema.optional(Schema.String),
          proxyType: Schema.optional(Schema.String),
          tcpKeepAlive: Schema.optional(Schema.Number),
          tlsTimeout: Schema.optional(Schema.Number),
        }),
      ),
    }),
  ),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  source: Schema.optional(Schema.Literal("local", "cloudflare")),
  tunnelId: Schema.optional(Schema.String).pipe(T.JsonName("tunnel_id")),
  version: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<PutTunnelCloudflaredConfigurationResponse>;

export const putTunnelCloudflaredConfiguration: (
  input: PutTunnelCloudflaredConfigurationRequest,
) => Effect.Effect<
  PutTunnelCloudflaredConfigurationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutTunnelCloudflaredConfigurationRequest,
  output: PutTunnelCloudflaredConfigurationResponse,
  errors: [],
}));

// =============================================================================
// TunnelCloudflaredConnection
// =============================================================================

export interface DeleteTunnelCloudflaredConnectionRequest {
  tunnelId: string;
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Query param: UUID of the Cloudflare Tunnel connector. */
  clientId?: string;
}

export const DeleteTunnelCloudflaredConnectionRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  clientId: Schema.optional(Schema.String).pipe(T.HttpQuery("client_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cfd_tunnel/{tunnelId}/connections",
  }),
) as unknown as Schema.Schema<DeleteTunnelCloudflaredConnectionRequest>;

export type DeleteTunnelCloudflaredConnectionResponse = unknown;

export const DeleteTunnelCloudflaredConnectionResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteTunnelCloudflaredConnectionResponse>;

export const deleteTunnelCloudflaredConnection: (
  input: DeleteTunnelCloudflaredConnectionRequest,
) => Effect.Effect<
  DeleteTunnelCloudflaredConnectionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteTunnelCloudflaredConnectionRequest,
  output: DeleteTunnelCloudflaredConnectionResponse,
  errors: [],
}));

// =============================================================================
// TunnelCloudflaredConnector
// =============================================================================

export interface GetTunnelCloudflaredConnectorRequest {
  tunnelId: string;
  connectorId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const GetTunnelCloudflaredConnectorRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  connectorId: Schema.String.pipe(T.HttpPath("connectorId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cfd_tunnel/{tunnelId}/connectors/{connectorId}",
  }),
) as unknown as Schema.Schema<GetTunnelCloudflaredConnectorRequest>;

export type GetTunnelCloudflaredConnectorResponse = unknown;

export const GetTunnelCloudflaredConnectorResponse =
  Schema.Unknown as unknown as Schema.Schema<GetTunnelCloudflaredConnectorResponse>;

export const getTunnelCloudflaredConnector: (
  input: GetTunnelCloudflaredConnectorRequest,
) => Effect.Effect<
  GetTunnelCloudflaredConnectorResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetTunnelCloudflaredConnectorRequest,
  output: GetTunnelCloudflaredConnectorResponse,
  errors: [],
}));

// =============================================================================
// TunnelCloudflaredManagement
// =============================================================================

export interface CreateTunnelCloudflaredManagementRequest {
  tunnelId: string;
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: */
  resources: "logs"[];
}

export const CreateTunnelCloudflaredManagementRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  resources: Schema.Array(Schema.Literal("logs")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/cfd_tunnel/{tunnelId}/management",
  }),
) as unknown as Schema.Schema<CreateTunnelCloudflaredManagementRequest>;

export type CreateTunnelCloudflaredManagementResponse = string;

export const CreateTunnelCloudflaredManagementResponse =
  Schema.String as unknown as Schema.Schema<CreateTunnelCloudflaredManagementResponse>;

export const createTunnelCloudflaredManagement: (
  input: CreateTunnelCloudflaredManagementRequest,
) => Effect.Effect<
  CreateTunnelCloudflaredManagementResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateTunnelCloudflaredManagementRequest,
  output: CreateTunnelCloudflaredManagementResponse,
  errors: [],
}));

// =============================================================================
// TunnelCloudflaredToken
// =============================================================================

export interface GetTunnelCloudflaredTokenRequest {
  tunnelId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const GetTunnelCloudflaredTokenRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cfd_tunnel/{tunnelId}/token",
  }),
) as unknown as Schema.Schema<GetTunnelCloudflaredTokenRequest>;

export type GetTunnelCloudflaredTokenResponse = string;

export const GetTunnelCloudflaredTokenResponse =
  Schema.String as unknown as Schema.Schema<GetTunnelCloudflaredTokenResponse>;

export const getTunnelCloudflaredToken: (
  input: GetTunnelCloudflaredTokenRequest,
) => Effect.Effect<
  GetTunnelCloudflaredTokenResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetTunnelCloudflaredTokenRequest,
  output: GetTunnelCloudflaredTokenResponse,
  errors: [],
}));

// =============================================================================
// TunnelWarpConnector
// =============================================================================

export interface GetTunnelWarpConnectorRequest {
  tunnelId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const GetTunnelWarpConnectorRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/warp_connector/{tunnelId}",
  }),
) as unknown as Schema.Schema<GetTunnelWarpConnectorRequest>;

export type GetTunnelWarpConnectorResponse =
  | unknown
  | {
      id?: string;
      accountTag?: string;
      connections?: {
        id?: string;
        clientId?: string;
        clientVersion?: string;
        coloName?: string;
        isPendingReconnect?: boolean;
        openedAt?: string;
        originIp?: string;
        uuid?: string;
      }[];
      connsActiveAt?: string;
      connsInactiveAt?: string;
      createdAt?: string;
      deletedAt?: string;
      metadata?: unknown;
      name?: string;
      status?: "inactive" | "degraded" | "healthy" | "down";
      tunType?:
        | "cfd_tunnel"
        | "warp_connector"
        | "warp"
        | "magic"
        | "ip_sec"
        | "gre"
        | "cni";
    };

export const GetTunnelWarpConnectorResponse = Schema.Union(
  Schema.Unknown,
  Schema.Struct({
    id: Schema.optional(Schema.String),
    accountTag: Schema.optional(Schema.String).pipe(T.JsonName("account_tag")),
    connections: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          clientId: Schema.optional(Schema.String).pipe(
            T.JsonName("client_id"),
          ),
          clientVersion: Schema.optional(Schema.String).pipe(
            T.JsonName("client_version"),
          ),
          coloName: Schema.optional(Schema.String).pipe(
            T.JsonName("colo_name"),
          ),
          isPendingReconnect: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("is_pending_reconnect"),
          ),
          openedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("opened_at"),
          ),
          originIp: Schema.optional(Schema.String).pipe(
            T.JsonName("origin_ip"),
          ),
          uuid: Schema.optional(Schema.String),
        }),
      ),
    ),
    connsActiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_active_at"),
    ),
    connsInactiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_inactive_at"),
    ),
    createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
    deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
    metadata: Schema.optional(Schema.Unknown),
    name: Schema.optional(Schema.String),
    status: Schema.optional(
      Schema.Literal("inactive", "degraded", "healthy", "down"),
    ),
    tunType: Schema.optional(
      Schema.Literal(
        "cfd_tunnel",
        "warp_connector",
        "warp",
        "magic",
        "ip_sec",
        "gre",
        "cni",
      ),
    ).pipe(T.JsonName("tun_type")),
  }),
) as unknown as Schema.Schema<GetTunnelWarpConnectorResponse>;

export const getTunnelWarpConnector: (
  input: GetTunnelWarpConnectorRequest,
) => Effect.Effect<
  GetTunnelWarpConnectorResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetTunnelWarpConnectorRequest,
  output: GetTunnelWarpConnectorResponse,
  errors: [],
}));

export interface CreateTunnelWarpConnectorRequest {
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: A user-friendly name for a tunnel. */
  name: string;
}

export const CreateTunnelWarpConnectorRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/warp_connector" }),
) as unknown as Schema.Schema<CreateTunnelWarpConnectorRequest>;

export type CreateTunnelWarpConnectorResponse =
  | unknown
  | {
      id?: string;
      accountTag?: string;
      connections?: {
        id?: string;
        clientId?: string;
        clientVersion?: string;
        coloName?: string;
        isPendingReconnect?: boolean;
        openedAt?: string;
        originIp?: string;
        uuid?: string;
      }[];
      connsActiveAt?: string;
      connsInactiveAt?: string;
      createdAt?: string;
      deletedAt?: string;
      metadata?: unknown;
      name?: string;
      status?: "inactive" | "degraded" | "healthy" | "down";
      tunType?:
        | "cfd_tunnel"
        | "warp_connector"
        | "warp"
        | "magic"
        | "ip_sec"
        | "gre"
        | "cni";
    };

export const CreateTunnelWarpConnectorResponse = Schema.Union(
  Schema.Unknown,
  Schema.Struct({
    id: Schema.optional(Schema.String),
    accountTag: Schema.optional(Schema.String).pipe(T.JsonName("account_tag")),
    connections: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          clientId: Schema.optional(Schema.String).pipe(
            T.JsonName("client_id"),
          ),
          clientVersion: Schema.optional(Schema.String).pipe(
            T.JsonName("client_version"),
          ),
          coloName: Schema.optional(Schema.String).pipe(
            T.JsonName("colo_name"),
          ),
          isPendingReconnect: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("is_pending_reconnect"),
          ),
          openedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("opened_at"),
          ),
          originIp: Schema.optional(Schema.String).pipe(
            T.JsonName("origin_ip"),
          ),
          uuid: Schema.optional(Schema.String),
        }),
      ),
    ),
    connsActiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_active_at"),
    ),
    connsInactiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_inactive_at"),
    ),
    createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
    deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
    metadata: Schema.optional(Schema.Unknown),
    name: Schema.optional(Schema.String),
    status: Schema.optional(
      Schema.Literal("inactive", "degraded", "healthy", "down"),
    ),
    tunType: Schema.optional(
      Schema.Literal(
        "cfd_tunnel",
        "warp_connector",
        "warp",
        "magic",
        "ip_sec",
        "gre",
        "cni",
      ),
    ).pipe(T.JsonName("tun_type")),
  }),
) as unknown as Schema.Schema<CreateTunnelWarpConnectorResponse>;

export const createTunnelWarpConnector: (
  input: CreateTunnelWarpConnectorRequest,
) => Effect.Effect<
  CreateTunnelWarpConnectorResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateTunnelWarpConnectorRequest,
  output: CreateTunnelWarpConnectorResponse,
  errors: [],
}));

export interface PatchTunnelWarpConnectorRequest {
  tunnelId: string;
  /** Path param: Cloudflare account ID */
  accountId: string;
  /** Body param: A user-friendly name for a tunnel. */
  name?: string;
  /** Body param: Sets the password required to run a locally-managed tunnel. Must be at least 32 bytes and encoded as a base64 string. */
  tunnelSecret?: string;
}

export const PatchTunnelWarpConnectorRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
  tunnelSecret: Schema.optional(Schema.String).pipe(
    T.JsonName("tunnel_secret"),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/warp_connector/{tunnelId}",
  }),
) as unknown as Schema.Schema<PatchTunnelWarpConnectorRequest>;

export type PatchTunnelWarpConnectorResponse =
  | unknown
  | {
      id?: string;
      accountTag?: string;
      connections?: {
        id?: string;
        clientId?: string;
        clientVersion?: string;
        coloName?: string;
        isPendingReconnect?: boolean;
        openedAt?: string;
        originIp?: string;
        uuid?: string;
      }[];
      connsActiveAt?: string;
      connsInactiveAt?: string;
      createdAt?: string;
      deletedAt?: string;
      metadata?: unknown;
      name?: string;
      status?: "inactive" | "degraded" | "healthy" | "down";
      tunType?:
        | "cfd_tunnel"
        | "warp_connector"
        | "warp"
        | "magic"
        | "ip_sec"
        | "gre"
        | "cni";
    };

export const PatchTunnelWarpConnectorResponse = Schema.Union(
  Schema.Unknown,
  Schema.Struct({
    id: Schema.optional(Schema.String),
    accountTag: Schema.optional(Schema.String).pipe(T.JsonName("account_tag")),
    connections: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          clientId: Schema.optional(Schema.String).pipe(
            T.JsonName("client_id"),
          ),
          clientVersion: Schema.optional(Schema.String).pipe(
            T.JsonName("client_version"),
          ),
          coloName: Schema.optional(Schema.String).pipe(
            T.JsonName("colo_name"),
          ),
          isPendingReconnect: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("is_pending_reconnect"),
          ),
          openedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("opened_at"),
          ),
          originIp: Schema.optional(Schema.String).pipe(
            T.JsonName("origin_ip"),
          ),
          uuid: Schema.optional(Schema.String),
        }),
      ),
    ),
    connsActiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_active_at"),
    ),
    connsInactiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_inactive_at"),
    ),
    createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
    deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
    metadata: Schema.optional(Schema.Unknown),
    name: Schema.optional(Schema.String),
    status: Schema.optional(
      Schema.Literal("inactive", "degraded", "healthy", "down"),
    ),
    tunType: Schema.optional(
      Schema.Literal(
        "cfd_tunnel",
        "warp_connector",
        "warp",
        "magic",
        "ip_sec",
        "gre",
        "cni",
      ),
    ).pipe(T.JsonName("tun_type")),
  }),
) as unknown as Schema.Schema<PatchTunnelWarpConnectorResponse>;

export const patchTunnelWarpConnector: (
  input: PatchTunnelWarpConnectorRequest,
) => Effect.Effect<
  PatchTunnelWarpConnectorResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchTunnelWarpConnectorRequest,
  output: PatchTunnelWarpConnectorResponse,
  errors: [],
}));

export interface DeleteTunnelWarpConnectorRequest {
  tunnelId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const DeleteTunnelWarpConnectorRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/warp_connector/{tunnelId}",
  }),
) as unknown as Schema.Schema<DeleteTunnelWarpConnectorRequest>;

export type DeleteTunnelWarpConnectorResponse =
  | unknown
  | {
      id?: string;
      accountTag?: string;
      connections?: {
        id?: string;
        clientId?: string;
        clientVersion?: string;
        coloName?: string;
        isPendingReconnect?: boolean;
        openedAt?: string;
        originIp?: string;
        uuid?: string;
      }[];
      connsActiveAt?: string;
      connsInactiveAt?: string;
      createdAt?: string;
      deletedAt?: string;
      metadata?: unknown;
      name?: string;
      status?: "inactive" | "degraded" | "healthy" | "down";
      tunType?:
        | "cfd_tunnel"
        | "warp_connector"
        | "warp"
        | "magic"
        | "ip_sec"
        | "gre"
        | "cni";
    };

export const DeleteTunnelWarpConnectorResponse = Schema.Union(
  Schema.Unknown,
  Schema.Struct({
    id: Schema.optional(Schema.String),
    accountTag: Schema.optional(Schema.String).pipe(T.JsonName("account_tag")),
    connections: Schema.optional(
      Schema.Array(
        Schema.Struct({
          id: Schema.optional(Schema.String),
          clientId: Schema.optional(Schema.String).pipe(
            T.JsonName("client_id"),
          ),
          clientVersion: Schema.optional(Schema.String).pipe(
            T.JsonName("client_version"),
          ),
          coloName: Schema.optional(Schema.String).pipe(
            T.JsonName("colo_name"),
          ),
          isPendingReconnect: Schema.optional(Schema.Boolean).pipe(
            T.JsonName("is_pending_reconnect"),
          ),
          openedAt: Schema.optional(Schema.String).pipe(
            T.JsonName("opened_at"),
          ),
          originIp: Schema.optional(Schema.String).pipe(
            T.JsonName("origin_ip"),
          ),
          uuid: Schema.optional(Schema.String),
        }),
      ),
    ),
    connsActiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_active_at"),
    ),
    connsInactiveAt: Schema.optional(Schema.String).pipe(
      T.JsonName("conns_inactive_at"),
    ),
    createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
    deletedAt: Schema.optional(Schema.String).pipe(T.JsonName("deleted_at")),
    metadata: Schema.optional(Schema.Unknown),
    name: Schema.optional(Schema.String),
    status: Schema.optional(
      Schema.Literal("inactive", "degraded", "healthy", "down"),
    ),
    tunType: Schema.optional(
      Schema.Literal(
        "cfd_tunnel",
        "warp_connector",
        "warp",
        "magic",
        "ip_sec",
        "gre",
        "cni",
      ),
    ).pipe(T.JsonName("tun_type")),
  }),
) as unknown as Schema.Schema<DeleteTunnelWarpConnectorResponse>;

export const deleteTunnelWarpConnector: (
  input: DeleteTunnelWarpConnectorRequest,
) => Effect.Effect<
  DeleteTunnelWarpConnectorResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteTunnelWarpConnectorRequest,
  output: DeleteTunnelWarpConnectorResponse,
  errors: [],
}));

// =============================================================================
// TunnelWarpConnectorToken
// =============================================================================

export interface GetTunnelWarpConnectorTokenRequest {
  tunnelId: string;
  /** Cloudflare account ID */
  accountId: string;
}

export const GetTunnelWarpConnectorTokenRequest = Schema.Struct({
  tunnelId: Schema.String.pipe(T.HttpPath("tunnelId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/warp_connector/{tunnelId}/token",
  }),
) as unknown as Schema.Schema<GetTunnelWarpConnectorTokenRequest>;

export type GetTunnelWarpConnectorTokenResponse = string;

export const GetTunnelWarpConnectorTokenResponse =
  Schema.String as unknown as Schema.Schema<GetTunnelWarpConnectorTokenResponse>;

export const getTunnelWarpConnectorToken: (
  input: GetTunnelWarpConnectorTokenRequest,
) => Effect.Effect<
  GetTunnelWarpConnectorTokenResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetTunnelWarpConnectorTokenRequest,
  output: GetTunnelWarpConnectorTokenResponse,
  errors: [],
}));

// =============================================================================
// UsersOrganization
// =============================================================================

export interface RevokeUsersOrganizationRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Query param: When set to `true`, all devices associated with the user will be revoked. */
  queryDevices?: boolean;
  /** Body param: The email of the user to revoke. */
  email: string;
  /** Body param: When set to `true`, all devices associated with the user will be revoked. */
  bodyDevices?: boolean;
  /** Body param: The uuid of the user to revoke. */
  userUid?: string;
  /** Body param: When set to `true`, the user will be required to re-authenticate to WARP for all Gateway policies that enforce a WARP client session duration. When `false`, the user’s WARP session will re */
  warpSessionReauth?: boolean;
}

export const RevokeUsersOrganizationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  queryDevices: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("query_devices"),
  ),
  email: Schema.String,
  bodyDevices: Schema.optional(Schema.Boolean).pipe(T.JsonName("body_devices")),
  userUid: Schema.optional(Schema.String).pipe(T.JsonName("user_uid")),
  warpSessionReauth: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("warp_session_reauth"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/access/organizations/revoke_user",
  }),
) as unknown as Schema.Schema<RevokeUsersOrganizationRequest>;

export type RevokeUsersOrganizationResponse = true | false;

export const RevokeUsersOrganizationResponse = Schema.Literal(
  true,
  false,
) as unknown as Schema.Schema<RevokeUsersOrganizationResponse>;

export const revokeUsersOrganization: (
  input: RevokeUsersOrganizationRequest,
) => Effect.Effect<
  RevokeUsersOrganizationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RevokeUsersOrganizationRequest,
  output: RevokeUsersOrganizationResponse,
  errors: [],
}));

// =============================================================================
// V2AccessInfrastructureTarget
// =============================================================================

export interface BulkDeleteV2AccessInfrastructureTargetsRequest {
  /** Path param: Account identifier */
  accountId: string;
  /** Body param: List of target IDs to bulk delete */
  targetIds: string[];
}

export const BulkDeleteV2AccessInfrastructureTargetsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  targetIds: Schema.Array(Schema.String).pipe(T.JsonName("target_ids")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/infrastructure/targets/batch_delete",
  }),
) as unknown as Schema.Schema<BulkDeleteV2AccessInfrastructureTargetsRequest>;

export type BulkDeleteV2AccessInfrastructureTargetsResponse = unknown;

export const BulkDeleteV2AccessInfrastructureTargetsResponse =
  Schema.Unknown as unknown as Schema.Schema<BulkDeleteV2AccessInfrastructureTargetsResponse>;

export const bulkDeleteV2AccessInfrastructureTargets: (
  input: BulkDeleteV2AccessInfrastructureTargetsRequest,
) => Effect.Effect<
  BulkDeleteV2AccessInfrastructureTargetsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BulkDeleteV2AccessInfrastructureTargetsRequest,
  output: BulkDeleteV2AccessInfrastructureTargetsResponse,
  errors: [],
}));
