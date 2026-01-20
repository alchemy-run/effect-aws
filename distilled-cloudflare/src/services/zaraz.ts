/**
 * Cloudflare ZARAZ API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service zaraz
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
// Config
// =============================================================================

export interface GetConfigRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetConfigRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/settings/zaraz/config" }),
) as unknown as Schema.Schema<GetConfigRequest>;

export interface GetConfigResponse {
  /** Data layer compatibility mode enabled. */
  dataLayer: boolean;
  /** The key for Zaraz debug mode. */
  debugKey: string;
  /** General Zaraz settings. */
  settings: {
    autoInjectScript: boolean;
    contextEnricher?: { escapedWorkerName: string; workerTag: string };
    cookieDomain?: string;
    ecommerce?: boolean;
    eventsApiPath?: string;
    hideExternalReferer?: boolean;
    hideIPAddress?: boolean;
    hideQueryParams?: boolean;
    hideUserAgent?: boolean;
    initPath?: string;
    injectIframes?: boolean;
    mcRootPath?: string;
    scriptPath?: string;
    trackPath?: string;
  };
  /** Tools set up under Zaraz configuration, where key is the alpha-numeric tool ID and value is the tool configuration object. */
  tools: Record<string, unknown>;
  /** Triggers set up under Zaraz configuration, where key is the trigger alpha-numeric ID and value is the trigger configuration. */
  triggers: Record<string, unknown>;
  /** Variables set up under Zaraz configuration, where key is the variable alpha-numeric ID and value is the variable configuration. Values of variables of type secret are not included. */
  variables: Record<string, unknown>;
  /** Zaraz internal version of the config. */
  zarazVersion: number;
  /** Cloudflare Monitoring settings. */
  analytics?: {
    defaultPurpose?: string;
    enabled?: boolean;
    sessionExpTime?: number;
  };
  /** Consent management configuration. */
  consent?: {
    enabled: boolean;
    buttonTextTranslations?: unknown;
    companyEmail?: string;
    companyName?: string;
    companyStreetAddress?: string;
    consentModalIntroHTML?: string;
    consentModalIntroHTMLWithTranslations?: Record<string, unknown>;
    cookieName?: string;
    customCSS?: string;
    customIntroDisclaimerDismissed?: boolean;
    defaultLanguage?: string;
    hideModal?: boolean;
    purposes?: Record<string, unknown>;
    purposesWithTranslations?: Record<string, unknown>;
    tcfCompliant?: boolean;
  };
  /** Single Page Application support enabled. */
  historyChange?: boolean;
}

export const GetConfigResponse = Schema.Struct({
  dataLayer: Schema.Boolean,
  debugKey: Schema.String,
  settings: Schema.Struct({
    autoInjectScript: Schema.Boolean,
    contextEnricher: Schema.optional(
      Schema.Struct({
        escapedWorkerName: Schema.String,
        workerTag: Schema.String,
      }),
    ),
    cookieDomain: Schema.optional(Schema.String),
    ecommerce: Schema.optional(Schema.Boolean),
    eventsApiPath: Schema.optional(Schema.String),
    hideExternalReferer: Schema.optional(Schema.Boolean),
    hideIPAddress: Schema.optional(Schema.Boolean),
    hideQueryParams: Schema.optional(Schema.Boolean),
    hideUserAgent: Schema.optional(Schema.Boolean),
    initPath: Schema.optional(Schema.String),
    injectIframes: Schema.optional(Schema.Boolean),
    mcRootPath: Schema.optional(Schema.String),
    scriptPath: Schema.optional(Schema.String),
    trackPath: Schema.optional(Schema.String),
  }),
  tools: Schema.Struct({}),
  triggers: Schema.Struct({}),
  variables: Schema.Struct({}),
  zarazVersion: Schema.Number,
  analytics: Schema.optional(
    Schema.Struct({
      defaultPurpose: Schema.optional(Schema.String),
      enabled: Schema.optional(Schema.Boolean),
      sessionExpTime: Schema.optional(Schema.Number),
    }),
  ),
  consent: Schema.optional(
    Schema.Struct({
      enabled: Schema.Boolean,
      buttonTextTranslations: Schema.optional(Schema.Unknown),
      companyEmail: Schema.optional(Schema.String),
      companyName: Schema.optional(Schema.String),
      companyStreetAddress: Schema.optional(Schema.String),
      consentModalIntroHTML: Schema.optional(Schema.String),
      consentModalIntroHTMLWithTranslations: Schema.optional(Schema.Struct({})),
      cookieName: Schema.optional(Schema.String),
      customCSS: Schema.optional(Schema.String),
      customIntroDisclaimerDismissed: Schema.optional(Schema.Boolean),
      defaultLanguage: Schema.optional(Schema.String),
      hideModal: Schema.optional(Schema.Boolean),
      purposes: Schema.optional(Schema.Struct({})),
      purposesWithTranslations: Schema.optional(Schema.Struct({})),
      tcfCompliant: Schema.optional(Schema.Boolean),
    }),
  ),
  historyChange: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<GetConfigResponse>;

export const getConfig: (
  input: GetConfigRequest,
) => Effect.Effect<
  GetConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetConfigRequest,
  output: GetConfigResponse,
  errors: [],
}));

export interface PutConfigRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Data layer compatibility mode enabled. */
  dataLayer: boolean;
  /** Body param: The key for Zaraz debug mode. */
  debugKey: string;
  /** Body param: General Zaraz settings. */
  settings: {
    autoInjectScript: boolean;
    contextEnricher?: { escapedWorkerName: string; workerTag: string };
    cookieDomain?: string;
    ecommerce?: boolean;
    eventsApiPath?: string;
    hideExternalReferer?: boolean;
    hideIPAddress?: boolean;
    hideQueryParams?: boolean;
    hideUserAgent?: boolean;
    initPath?: string;
    injectIframes?: boolean;
    mcRootPath?: string;
    scriptPath?: string;
    trackPath?: string;
  };
  /** Body param: Tools set up under Zaraz configuration, where key is the alpha-numeric tool ID and value is the tool configuration object. */
  tools: Record<string, unknown>;
  /** Body param: Triggers set up under Zaraz configuration, where key is the trigger alpha-numeric ID and value is the trigger configuration. */
  triggers: Record<string, unknown>;
  /** Body param: Variables set up under Zaraz configuration, where key is the variable alpha-numeric ID and value is the variable configuration. Values of variables of type secret are not included. */
  variables: Record<string, unknown>;
  /** Body param: Zaraz internal version of the config. */
  zarazVersion: number;
  /** Body param: Cloudflare Monitoring settings. */
  analytics?: {
    defaultPurpose?: string;
    enabled?: boolean;
    sessionExpTime?: number;
  };
  /** Body param: Consent management configuration. */
  consent?: {
    enabled: boolean;
    buttonTextTranslations?: unknown;
    companyEmail?: string;
    companyName?: string;
    companyStreetAddress?: string;
    consentModalIntroHTML?: string;
    consentModalIntroHTMLWithTranslations?: Record<string, unknown>;
    cookieName?: string;
    customCSS?: string;
    customIntroDisclaimerDismissed?: boolean;
    defaultLanguage?: string;
    hideModal?: boolean;
    purposes?: Record<string, unknown>;
    purposesWithTranslations?: Record<string, unknown>;
    tcfCompliant?: boolean;
  };
  /** Body param: Single Page Application support enabled. */
  historyChange?: boolean;
}

export const PutConfigRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  dataLayer: Schema.Boolean,
  debugKey: Schema.String,
  settings: Schema.Struct({
    autoInjectScript: Schema.Boolean,
    contextEnricher: Schema.optional(
      Schema.Struct({
        escapedWorkerName: Schema.String,
        workerTag: Schema.String,
      }),
    ),
    cookieDomain: Schema.optional(Schema.String),
    ecommerce: Schema.optional(Schema.Boolean),
    eventsApiPath: Schema.optional(Schema.String),
    hideExternalReferer: Schema.optional(Schema.Boolean),
    hideIPAddress: Schema.optional(Schema.Boolean),
    hideQueryParams: Schema.optional(Schema.Boolean),
    hideUserAgent: Schema.optional(Schema.Boolean),
    initPath: Schema.optional(Schema.String),
    injectIframes: Schema.optional(Schema.Boolean),
    mcRootPath: Schema.optional(Schema.String),
    scriptPath: Schema.optional(Schema.String),
    trackPath: Schema.optional(Schema.String),
  }),
  tools: Schema.Struct({}),
  triggers: Schema.Struct({}),
  variables: Schema.Struct({}),
  zarazVersion: Schema.Number,
  analytics: Schema.optional(
    Schema.Struct({
      defaultPurpose: Schema.optional(Schema.String),
      enabled: Schema.optional(Schema.Boolean),
      sessionExpTime: Schema.optional(Schema.Number),
    }),
  ),
  consent: Schema.optional(
    Schema.Struct({
      enabled: Schema.Boolean,
      buttonTextTranslations: Schema.optional(Schema.Unknown),
      companyEmail: Schema.optional(Schema.String),
      companyName: Schema.optional(Schema.String),
      companyStreetAddress: Schema.optional(Schema.String),
      consentModalIntroHTML: Schema.optional(Schema.String),
      consentModalIntroHTMLWithTranslations: Schema.optional(Schema.Struct({})),
      cookieName: Schema.optional(Schema.String),
      customCSS: Schema.optional(Schema.String),
      customIntroDisclaimerDismissed: Schema.optional(Schema.Boolean),
      defaultLanguage: Schema.optional(Schema.String),
      hideModal: Schema.optional(Schema.Boolean),
      purposes: Schema.optional(Schema.Struct({})),
      purposesWithTranslations: Schema.optional(Schema.Struct({})),
      tcfCompliant: Schema.optional(Schema.Boolean),
    }),
  ),
  historyChange: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/settings/zaraz/config" }),
) as unknown as Schema.Schema<PutConfigRequest>;

export interface PutConfigResponse {
  /** Data layer compatibility mode enabled. */
  dataLayer: boolean;
  /** The key for Zaraz debug mode. */
  debugKey: string;
  /** General Zaraz settings. */
  settings: {
    autoInjectScript: boolean;
    contextEnricher?: { escapedWorkerName: string; workerTag: string };
    cookieDomain?: string;
    ecommerce?: boolean;
    eventsApiPath?: string;
    hideExternalReferer?: boolean;
    hideIPAddress?: boolean;
    hideQueryParams?: boolean;
    hideUserAgent?: boolean;
    initPath?: string;
    injectIframes?: boolean;
    mcRootPath?: string;
    scriptPath?: string;
    trackPath?: string;
  };
  /** Tools set up under Zaraz configuration, where key is the alpha-numeric tool ID and value is the tool configuration object. */
  tools: Record<string, unknown>;
  /** Triggers set up under Zaraz configuration, where key is the trigger alpha-numeric ID and value is the trigger configuration. */
  triggers: Record<string, unknown>;
  /** Variables set up under Zaraz configuration, where key is the variable alpha-numeric ID and value is the variable configuration. Values of variables of type secret are not included. */
  variables: Record<string, unknown>;
  /** Zaraz internal version of the config. */
  zarazVersion: number;
  /** Cloudflare Monitoring settings. */
  analytics?: {
    defaultPurpose?: string;
    enabled?: boolean;
    sessionExpTime?: number;
  };
  /** Consent management configuration. */
  consent?: {
    enabled: boolean;
    buttonTextTranslations?: unknown;
    companyEmail?: string;
    companyName?: string;
    companyStreetAddress?: string;
    consentModalIntroHTML?: string;
    consentModalIntroHTMLWithTranslations?: Record<string, unknown>;
    cookieName?: string;
    customCSS?: string;
    customIntroDisclaimerDismissed?: boolean;
    defaultLanguage?: string;
    hideModal?: boolean;
    purposes?: Record<string, unknown>;
    purposesWithTranslations?: Record<string, unknown>;
    tcfCompliant?: boolean;
  };
  /** Single Page Application support enabled. */
  historyChange?: boolean;
}

export const PutConfigResponse = Schema.Struct({
  dataLayer: Schema.Boolean,
  debugKey: Schema.String,
  settings: Schema.Struct({
    autoInjectScript: Schema.Boolean,
    contextEnricher: Schema.optional(
      Schema.Struct({
        escapedWorkerName: Schema.String,
        workerTag: Schema.String,
      }),
    ),
    cookieDomain: Schema.optional(Schema.String),
    ecommerce: Schema.optional(Schema.Boolean),
    eventsApiPath: Schema.optional(Schema.String),
    hideExternalReferer: Schema.optional(Schema.Boolean),
    hideIPAddress: Schema.optional(Schema.Boolean),
    hideQueryParams: Schema.optional(Schema.Boolean),
    hideUserAgent: Schema.optional(Schema.Boolean),
    initPath: Schema.optional(Schema.String),
    injectIframes: Schema.optional(Schema.Boolean),
    mcRootPath: Schema.optional(Schema.String),
    scriptPath: Schema.optional(Schema.String),
    trackPath: Schema.optional(Schema.String),
  }),
  tools: Schema.Struct({}),
  triggers: Schema.Struct({}),
  variables: Schema.Struct({}),
  zarazVersion: Schema.Number,
  analytics: Schema.optional(
    Schema.Struct({
      defaultPurpose: Schema.optional(Schema.String),
      enabled: Schema.optional(Schema.Boolean),
      sessionExpTime: Schema.optional(Schema.Number),
    }),
  ),
  consent: Schema.optional(
    Schema.Struct({
      enabled: Schema.Boolean,
      buttonTextTranslations: Schema.optional(Schema.Unknown),
      companyEmail: Schema.optional(Schema.String),
      companyName: Schema.optional(Schema.String),
      companyStreetAddress: Schema.optional(Schema.String),
      consentModalIntroHTML: Schema.optional(Schema.String),
      consentModalIntroHTMLWithTranslations: Schema.optional(Schema.Struct({})),
      cookieName: Schema.optional(Schema.String),
      customCSS: Schema.optional(Schema.String),
      customIntroDisclaimerDismissed: Schema.optional(Schema.Boolean),
      defaultLanguage: Schema.optional(Schema.String),
      hideModal: Schema.optional(Schema.Boolean),
      purposes: Schema.optional(Schema.Struct({})),
      purposesWithTranslations: Schema.optional(Schema.Struct({})),
      tcfCompliant: Schema.optional(Schema.Boolean),
    }),
  ),
  historyChange: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<PutConfigResponse>;

export const putConfig: (
  input: PutConfigRequest,
) => Effect.Effect<
  PutConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutConfigRequest,
  output: PutConfigResponse,
  errors: [],
}));

// =============================================================================
// Default
// =============================================================================

export interface GetDefaultRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetDefaultRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/settings/zaraz/default" }),
) as unknown as Schema.Schema<GetDefaultRequest>;

export type GetDefaultResponse = unknown;

export const GetDefaultResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDefaultResponse>;

export const getDefault: (
  input: GetDefaultRequest,
) => Effect.Effect<
  GetDefaultResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDefaultRequest,
  output: GetDefaultResponse,
  errors: [],
}));

// =============================================================================
// Export
// =============================================================================

export interface GetExportRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetExportRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/settings/zaraz/export" }),
) as unknown as Schema.Schema<GetExportRequest>;

export type GetExportResponse = unknown;

export const GetExportResponse =
  Schema.Unknown as unknown as Schema.Schema<GetExportResponse>;

export const getExport: (
  input: GetExportRequest,
) => Effect.Effect<
  GetExportResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetExportRequest,
  output: GetExportResponse,
  errors: [],
}));

// =============================================================================
// History
// =============================================================================

export interface PutHistoryRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: ID of the Zaraz configuration to restore. */
  body: number;
}

export const PutHistoryRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  body: Schema.Number,
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/settings/zaraz/history" }),
) as unknown as Schema.Schema<PutHistoryRequest>;

export type PutHistoryResponse = unknown;

export const PutHistoryResponse =
  Schema.Unknown as unknown as Schema.Schema<PutHistoryResponse>;

export const putHistory: (
  input: PutHistoryRequest,
) => Effect.Effect<
  PutHistoryResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutHistoryRequest,
  output: PutHistoryResponse,
  errors: [],
}));

// =============================================================================
// HistoryConfig
// =============================================================================

export interface GetHistoryConfigRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: Comma separated list of Zaraz configuration IDs */
  ids: number[];
}

export const GetHistoryConfigRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  ids: Schema.Array(Schema.Number).pipe(T.HttpQuery("ids")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/settings/zaraz/history/configs",
  }),
) as unknown as Schema.Schema<GetHistoryConfigRequest>;

export type GetHistoryConfigResponse = Record<string, unknown>;

export const GetHistoryConfigResponse = Schema.Struct(
  {},
) as unknown as Schema.Schema<GetHistoryConfigResponse>;

export const getHistoryConfig: (
  input: GetHistoryConfigRequest,
) => Effect.Effect<
  GetHistoryConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHistoryConfigRequest,
  output: GetHistoryConfigResponse,
  errors: [],
}));

// =============================================================================
// Publish
// =============================================================================

export interface CreatePublishRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Zaraz configuration description. */
  body?: string;
}

export const CreatePublishRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  body: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/settings/zaraz/publish" }),
) as unknown as Schema.Schema<CreatePublishRequest>;

export type CreatePublishResponse = string;

export const CreatePublishResponse =
  Schema.String as unknown as Schema.Schema<CreatePublishResponse>;

export const createPublish: (
  input: CreatePublishRequest,
) => Effect.Effect<
  CreatePublishResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreatePublishRequest,
  output: CreatePublishResponse,
  errors: [],
}));

// =============================================================================
// Workflow
// =============================================================================

export interface GetWorkflowRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetWorkflowRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/settings/zaraz/workflow" }),
) as unknown as Schema.Schema<GetWorkflowRequest>;

export type GetWorkflowResponse = "realtime" | "preview";

export const GetWorkflowResponse = Schema.Literal(
  "realtime",
  "preview",
) as unknown as Schema.Schema<GetWorkflowResponse>;

export const getWorkflow: (
  input: GetWorkflowRequest,
) => Effect.Effect<
  GetWorkflowResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetWorkflowRequest,
  output: GetWorkflowResponse,
  errors: [],
}));

// =============================================================================
// Zaraz
// =============================================================================

export interface PutZarazRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Zaraz workflow */
  workflow: "realtime" | "preview";
}

export const PutZarazRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  workflow: Schema.Literal("realtime", "preview"),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/settings/zaraz/workflow" }),
) as unknown as Schema.Schema<PutZarazRequest>;

export type PutZarazResponse = unknown;

export const PutZarazResponse =
  Schema.Unknown as unknown as Schema.Schema<PutZarazResponse>;

export const putZaraz: (
  input: PutZarazRequest,
) => Effect.Effect<
  PutZarazResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutZarazRequest,
  output: PutZarazResponse,
  errors: [],
}));
