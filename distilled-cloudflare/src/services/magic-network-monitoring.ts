/**
 * Cloudflare MAGIC-NETWORK-MONITORING API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service magic-network-monitoring
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
  accountId: string;
}

export const GetConfigRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/mnm/config" }),
) as unknown as Schema.Schema<GetConfigRequest>;

export interface GetConfigResponse {
  /** Fallback sampling rate of flow messages being sent in packets per second. This should match the packet sampling rate configured on the router. */
  defaultSampling: number;
  /** The account name. */
  name: string;
  routerIps: string[];
  warpDevices: { id: string; name: string; routerIp: string }[];
}

export const GetConfigResponse = Schema.Struct({
  defaultSampling: Schema.Number.pipe(T.JsonName("default_sampling")),
  name: Schema.String,
  routerIps: Schema.Array(Schema.String).pipe(T.JsonName("router_ips")),
  warpDevices: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      name: Schema.String,
      routerIp: Schema.String.pipe(T.JsonName("router_ip")),
    }),
  ).pipe(T.JsonName("warp_devices")),
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

export interface CreateConfigRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Fallback sampling rate of flow messages being sent in packets per second. This should match the packet sampling rate configured on the router. */
  defaultSampling: number;
  /** Body param: The account name. */
  name: string;
  /** Body param: */
  routerIps?: string[];
  /** Body param: */
  warpDevices?: { id: string; name: string; routerIp: string }[];
}

export const CreateConfigRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  defaultSampling: Schema.Number.pipe(T.JsonName("default_sampling")),
  name: Schema.String,
  routerIps: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("router_ips"),
  ),
  warpDevices: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        name: Schema.String,
        routerIp: Schema.String.pipe(T.JsonName("router_ip")),
      }),
    ),
  ).pipe(T.JsonName("warp_devices")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/mnm/config" }),
) as unknown as Schema.Schema<CreateConfigRequest>;

export interface CreateConfigResponse {
  /** Fallback sampling rate of flow messages being sent in packets per second. This should match the packet sampling rate configured on the router. */
  defaultSampling: number;
  /** The account name. */
  name: string;
  routerIps: string[];
  warpDevices: { id: string; name: string; routerIp: string }[];
}

export const CreateConfigResponse = Schema.Struct({
  defaultSampling: Schema.Number.pipe(T.JsonName("default_sampling")),
  name: Schema.String,
  routerIps: Schema.Array(Schema.String).pipe(T.JsonName("router_ips")),
  warpDevices: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      name: Schema.String,
      routerIp: Schema.String.pipe(T.JsonName("router_ip")),
    }),
  ).pipe(T.JsonName("warp_devices")),
}) as unknown as Schema.Schema<CreateConfigResponse>;

export const createConfig: (
  input: CreateConfigRequest,
) => Effect.Effect<
  CreateConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateConfigRequest,
  output: CreateConfigResponse,
  errors: [],
}));

export interface UpdateConfigRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Fallback sampling rate of flow messages being sent in packets per second. This should match the packet sampling rate configured on the router. */
  defaultSampling: number;
  /** Body param: The account name. */
  name: string;
  /** Body param: */
  routerIps?: string[];
  /** Body param: */
  warpDevices?: { id: string; name: string; routerIp: string }[];
}

export const UpdateConfigRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  defaultSampling: Schema.Number.pipe(T.JsonName("default_sampling")),
  name: Schema.String,
  routerIps: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("router_ips"),
  ),
  warpDevices: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        name: Schema.String,
        routerIp: Schema.String.pipe(T.JsonName("router_ip")),
      }),
    ),
  ).pipe(T.JsonName("warp_devices")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/mnm/config" }),
) as unknown as Schema.Schema<UpdateConfigRequest>;

export interface UpdateConfigResponse {
  /** Fallback sampling rate of flow messages being sent in packets per second. This should match the packet sampling rate configured on the router. */
  defaultSampling: number;
  /** The account name. */
  name: string;
  routerIps: string[];
  warpDevices: { id: string; name: string; routerIp: string }[];
}

export const UpdateConfigResponse = Schema.Struct({
  defaultSampling: Schema.Number.pipe(T.JsonName("default_sampling")),
  name: Schema.String,
  routerIps: Schema.Array(Schema.String).pipe(T.JsonName("router_ips")),
  warpDevices: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      name: Schema.String,
      routerIp: Schema.String.pipe(T.JsonName("router_ip")),
    }),
  ).pipe(T.JsonName("warp_devices")),
}) as unknown as Schema.Schema<UpdateConfigResponse>;

export const updateConfig: (
  input: UpdateConfigRequest,
) => Effect.Effect<
  UpdateConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateConfigRequest,
  output: UpdateConfigResponse,
  errors: [],
}));

export interface PatchConfigRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Fallback sampling rate of flow messages being sent in packets per second. This should match the packet sampling rate configured on the router. */
  defaultSampling?: number;
  /** Body param: The account name. */
  name?: string;
  /** Body param: */
  routerIps?: string[];
  /** Body param: */
  warpDevices?: { id: string; name: string; routerIp: string }[];
}

export const PatchConfigRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  defaultSampling: Schema.optional(Schema.Number).pipe(
    T.JsonName("default_sampling"),
  ),
  name: Schema.optional(Schema.String),
  routerIps: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("router_ips"),
  ),
  warpDevices: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        name: Schema.String,
        routerIp: Schema.String.pipe(T.JsonName("router_ip")),
      }),
    ),
  ).pipe(T.JsonName("warp_devices")),
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/mnm/config" }),
) as unknown as Schema.Schema<PatchConfigRequest>;

export interface PatchConfigResponse {
  /** Fallback sampling rate of flow messages being sent in packets per second. This should match the packet sampling rate configured on the router. */
  defaultSampling: number;
  /** The account name. */
  name: string;
  routerIps: string[];
  warpDevices: { id: string; name: string; routerIp: string }[];
}

export const PatchConfigResponse = Schema.Struct({
  defaultSampling: Schema.Number.pipe(T.JsonName("default_sampling")),
  name: Schema.String,
  routerIps: Schema.Array(Schema.String).pipe(T.JsonName("router_ips")),
  warpDevices: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      name: Schema.String,
      routerIp: Schema.String.pipe(T.JsonName("router_ip")),
    }),
  ).pipe(T.JsonName("warp_devices")),
}) as unknown as Schema.Schema<PatchConfigResponse>;

export const patchConfig: (
  input: PatchConfigRequest,
) => Effect.Effect<
  PatchConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchConfigRequest,
  output: PatchConfigResponse,
  errors: [],
}));

export interface DeleteConfigRequest {
  accountId: string;
}

export const DeleteConfigRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/mnm/config" }),
) as unknown as Schema.Schema<DeleteConfigRequest>;

export interface DeleteConfigResponse {
  /** Fallback sampling rate of flow messages being sent in packets per second. This should match the packet sampling rate configured on the router. */
  defaultSampling: number;
  /** The account name. */
  name: string;
  routerIps: string[];
  warpDevices: { id: string; name: string; routerIp: string }[];
}

export const DeleteConfigResponse = Schema.Struct({
  defaultSampling: Schema.Number.pipe(T.JsonName("default_sampling")),
  name: Schema.String,
  routerIps: Schema.Array(Schema.String).pipe(T.JsonName("router_ips")),
  warpDevices: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      name: Schema.String,
      routerIp: Schema.String.pipe(T.JsonName("router_ip")),
    }),
  ).pipe(T.JsonName("warp_devices")),
}) as unknown as Schema.Schema<DeleteConfigResponse>;

export const deleteConfig: (
  input: DeleteConfigRequest,
) => Effect.Effect<
  DeleteConfigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteConfigRequest,
  output: DeleteConfigResponse,
  errors: [],
}));

// =============================================================================
// ConfigFull
// =============================================================================

export interface GetConfigFullRequest {
  accountId: string;
}

export const GetConfigFullRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/mnm/config/full" }),
) as unknown as Schema.Schema<GetConfigFullRequest>;

export type GetConfigFullResponse = unknown;

export const GetConfigFullResponse =
  Schema.Unknown as unknown as Schema.Schema<GetConfigFullResponse>;

export const getConfigFull: (
  input: GetConfigFullRequest,
) => Effect.Effect<
  GetConfigFullResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetConfigFullRequest,
  output: GetConfigFullResponse,
  errors: [],
}));

// =============================================================================
// Rule
// =============================================================================

export interface GetRuleRequest {
  ruleId: string;
  accountId: string;
}

export const GetRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/mnm/rules/{ruleId}" }),
) as unknown as Schema.Schema<GetRuleRequest>;

export type GetRuleResponse = unknown;

export const GetRuleResponse =
  Schema.Unknown as unknown as Schema.Schema<GetRuleResponse>;

export const getRule: (
  input: GetRuleRequest,
) => Effect.Effect<
  GetRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRuleRequest,
  output: GetRuleResponse,
  errors: [],
}));

export interface CreateRuleRequest {
  /** Path param: */
  accountId: string;
  /** Body param: The amount of time that the rule threshold must be exceeded to send an alert notification. The final value must be equivalent to one of the following 8 values ["1m","5m","10m","15m","20m", */
  duration: "1m" | "5m" | "10m" | "15m" | "20m" | "30m" | "45m" | "60m";
  /** Body param: The name of the rule. Must be unique. Supports characters A-Z, a-z, 0-9, underscore (\_), dash (-), period (.), and tilde (~). You can’t have a space in the rule name. Max 256 characters. */
  name: string;
  /** Body param: Toggle on if you would like Cloudflare to automatically advertise the IP Prefixes within the rule via Magic Transit when the rule is triggered. Only available for users of Magic Transit. */
  automaticAdvertisement?: boolean | null;
  /** Body param: The number of bits per second for the rule. When this value is exceeded for the set duration, an alert notification is sent. Minimum of 1 and no maximum. */
  bandwidth?: number;
  /** Body param: The number of packets per second for the rule. When this value is exceeded for the set duration, an alert notification is sent. Minimum of 1 and no maximum. */
  packetThreshold?: number;
  /** Body param: */
  prefixes?: string[];
}

export const CreateRuleRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  duration: Schema.Literal(
    "1m",
    "5m",
    "10m",
    "15m",
    "20m",
    "30m",
    "45m",
    "60m",
  ),
  name: Schema.String,
  automaticAdvertisement: Schema.optional(
    Schema.Union(Schema.Boolean, Schema.Null),
  ).pipe(T.JsonName("automatic_advertisement")),
  bandwidth: Schema.optional(Schema.Number),
  packetThreshold: Schema.optional(Schema.Number).pipe(
    T.JsonName("packet_threshold"),
  ),
  prefixes: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/mnm/rules" }),
) as unknown as Schema.Schema<CreateRuleRequest>;

export type CreateRuleResponse = unknown;

export const CreateRuleResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateRuleResponse>;

export const createRule: (
  input: CreateRuleRequest,
) => Effect.Effect<
  CreateRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateRuleRequest,
  output: CreateRuleResponse,
  errors: [],
}));

export interface UpdateRuleRequest {
  /** Path param: */
  accountId: string;
  /** Body param: The amount of time that the rule threshold must be exceeded to send an alert notification. The final value must be equivalent to one of the following 8 values ["1m","5m","10m","15m","20m", */
  duration: "1m" | "5m" | "10m" | "15m" | "20m" | "30m" | "45m" | "60m";
  /** Body param: The name of the rule. Must be unique. Supports characters A-Z, a-z, 0-9, underscore (\_), dash (-), period (.), and tilde (~). You can’t have a space in the rule name. Max 256 characters. */
  name: string;
  /** Body param: The id of the rule. Must be unique. */
  id?: string;
  /** Body param: Toggle on if you would like Cloudflare to automatically advertise the IP Prefixes within the rule via Magic Transit when the rule is triggered. Only available for users of Magic Transit. */
  automaticAdvertisement?: boolean | null;
  /** Body param: The number of bits per second for the rule. When this value is exceeded for the set duration, an alert notification is sent. Minimum of 1 and no maximum. */
  bandwidth?: number;
  /** Body param: The number of packets per second for the rule. When this value is exceeded for the set duration, an alert notification is sent. Minimum of 1 and no maximum. */
  packetThreshold?: number;
  /** Body param: */
  prefixes?: string[];
}

export const UpdateRuleRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  duration: Schema.Literal(
    "1m",
    "5m",
    "10m",
    "15m",
    "20m",
    "30m",
    "45m",
    "60m",
  ),
  name: Schema.String,
  id: Schema.optional(Schema.String),
  automaticAdvertisement: Schema.optional(
    Schema.Union(Schema.Boolean, Schema.Null),
  ).pipe(T.JsonName("automatic_advertisement")),
  bandwidth: Schema.optional(Schema.Number),
  packetThreshold: Schema.optional(Schema.Number).pipe(
    T.JsonName("packet_threshold"),
  ),
  prefixes: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/mnm/rules" }),
) as unknown as Schema.Schema<UpdateRuleRequest>;

export type UpdateRuleResponse = unknown;

export const UpdateRuleResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateRuleResponse>;

export const updateRule: (
  input: UpdateRuleRequest,
) => Effect.Effect<
  UpdateRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateRuleRequest,
  output: UpdateRuleResponse,
  errors: [],
}));

export interface PatchRuleRequest {
  ruleId: string;
  /** Path param: */
  accountId: string;
  /** Body param: Toggle on if you would like Cloudflare to automatically advertise the IP Prefixes within the rule via Magic Transit when the rule is triggered. Only available for users of Magic Transit. */
  automaticAdvertisement?: boolean | null;
  /** Body param: The number of bits per second for the rule. When this value is exceeded for the set duration, an alert notification is sent. Minimum of 1 and no maximum. */
  bandwidth?: number;
  /** Body param: The amount of time that the rule threshold must be exceeded to send an alert notification. The final value must be equivalent to one of the following 8 values ["1m","5m","10m","15m","20m", */
  duration?: "1m" | "5m" | "10m" | "15m" | "20m" | "30m" | "45m" | "60m";
  /** Body param: The name of the rule. Must be unique. Supports characters A-Z, a-z, 0-9, underscore (\_), dash (-), period (.), and tilde (~). You can’t have a space in the rule name. Max 256 characters. */
  name?: string;
  /** Body param: The number of packets per second for the rule. When this value is exceeded for the set duration, an alert notification is sent. Minimum of 1 and no maximum. */
  packetThreshold?: number;
  /** Body param: */
  prefixes?: string[];
}

export const PatchRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  automaticAdvertisement: Schema.optional(
    Schema.Union(Schema.Boolean, Schema.Null),
  ).pipe(T.JsonName("automatic_advertisement")),
  bandwidth: Schema.optional(Schema.Number),
  duration: Schema.optional(
    Schema.Literal("1m", "5m", "10m", "15m", "20m", "30m", "45m", "60m"),
  ),
  name: Schema.optional(Schema.String),
  packetThreshold: Schema.optional(Schema.Number).pipe(
    T.JsonName("packet_threshold"),
  ),
  prefixes: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/mnm/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<PatchRuleRequest>;

export type PatchRuleResponse = unknown;

export const PatchRuleResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchRuleResponse>;

export const patchRule: (
  input: PatchRuleRequest,
) => Effect.Effect<
  PatchRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchRuleRequest,
  output: PatchRuleResponse,
  errors: [],
}));

export interface DeleteRuleRequest {
  ruleId: string;
  accountId: string;
}

export const DeleteRuleRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/mnm/rules/{ruleId}",
  }),
) as unknown as Schema.Schema<DeleteRuleRequest>;

export type DeleteRuleResponse = unknown;

export const DeleteRuleResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteRuleResponse>;

export const deleteRule: (
  input: DeleteRuleRequest,
) => Effect.Effect<
  DeleteRuleResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResponse,
  errors: [],
}));

// =============================================================================
// RuleAdvertisement
// =============================================================================

export interface PatchRuleAdvertisementRequest {
  ruleId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const PatchRuleAdvertisementRequest = Schema.Struct({
  ruleId: Schema.String.pipe(T.HttpPath("ruleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/mnm/rules/{ruleId}/advertisement",
  }),
) as unknown as Schema.Schema<PatchRuleAdvertisementRequest>;

export type PatchRuleAdvertisementResponse = unknown;

export const PatchRuleAdvertisementResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchRuleAdvertisementResponse>;

export const patchRuleAdvertisement: (
  input: PatchRuleAdvertisementRequest,
) => Effect.Effect<
  PatchRuleAdvertisementResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchRuleAdvertisementRequest,
  output: PatchRuleAdvertisementResponse,
  errors: [],
}));

// =============================================================================
// VpcFlowToken
// =============================================================================

export interface CreateVpcFlowTokenRequest {
  accountId: string;
}

export const CreateVpcFlowTokenRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/mnm/vpc-flows/token",
  }),
) as unknown as Schema.Schema<CreateVpcFlowTokenRequest>;

export type CreateVpcFlowTokenResponse = string;

export const CreateVpcFlowTokenResponse =
  Schema.String as unknown as Schema.Schema<CreateVpcFlowTokenResponse>;

export const createVpcFlowToken: (
  input: CreateVpcFlowTokenRequest,
) => Effect.Effect<
  CreateVpcFlowTokenResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateVpcFlowTokenRequest,
  output: CreateVpcFlowTokenResponse,
  errors: [],
}));
