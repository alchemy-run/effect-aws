/**
 * Cloudflare PAGE-SHIELD API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service page-shield
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Connection
// =============================================================================

export interface GetConnectionRequest {
  connectionId: string;
  /** Identifier */
  zoneId: string;
}

export const GetConnectionRequest = Schema.Struct({
  connectionId: Schema.String.pipe(T.HttpPath("connectionId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/page_shield/connections/{connectionId}" }),
) as unknown as Schema.Schema<GetConnectionRequest>;

export type GetConnectionResponse = unknown;

export const GetConnectionResponse =
  Schema.Unknown as unknown as Schema.Schema<GetConnectionResponse>;

export const getConnection = API.make(() => ({
  input: GetConnectionRequest,
  output: GetConnectionResponse,
  errors: [],
}));

// =============================================================================
// Cooky
// =============================================================================

export interface GetCookyRequest {
  cookieId: string;
  /** Identifier */
  zoneId: string;
}

export const GetCookyRequest = Schema.Struct({
  cookieId: Schema.String.pipe(T.HttpPath("cookieId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/page_shield/cookies/{cookieId}" }),
) as unknown as Schema.Schema<GetCookyRequest>;

export type GetCookyResponse = unknown;

export const GetCookyResponse = Schema.Unknown as unknown as Schema.Schema<GetCookyResponse>;

export const getCooky = API.make(() => ({
  input: GetCookyRequest,
  output: GetCookyResponse,
  errors: [],
}));

// =============================================================================
// PageShield
// =============================================================================

export interface GetPageShieldRequest {
  /** Identifier */
  zoneId: string;
}

export const GetPageShieldRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/page_shield" }),
) as unknown as Schema.Schema<GetPageShieldRequest>;

export type GetPageShieldResponse = unknown;

export const GetPageShieldResponse =
  Schema.Unknown as unknown as Schema.Schema<GetPageShieldResponse>;

export const getPageShield = API.make(() => ({
  input: GetPageShieldRequest,
  output: GetPageShieldResponse,
  errors: [],
}));

export interface PutPageShieldRequest {
  /** Path param: Identifier */
  zoneId: string;
  /** Body param: When true, indicates that Page Shield is enabled. */
  enabled?: boolean;
  /** Body param: When true, CSP reports will be sent to https://csp-reporting.cloudflare.com/cdn-cgi/script_monitor/report */
  useCloudflareReportingEndpoint?: boolean;
  /** Body param: When true, the paths associated with connections URLs will also be analyzed. */
  useConnectionUrlPath?: boolean;
}

export const PutPageShieldRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  enabled: Schema.optional(Schema.Boolean),
  useCloudflareReportingEndpoint: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("use_cloudflare_reporting_endpoint"),
  ),
  useConnectionUrlPath: Schema.optional(Schema.Boolean).pipe(T.JsonName("use_connection_url_path")),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/page_shield" }),
) as unknown as Schema.Schema<PutPageShieldRequest>;

export interface PutPageShieldResponse {
  /** When true, indicates that Page Shield is enabled. */
  enabled: boolean;
  /** The timestamp of when Page Shield was last updated. */
  updatedAt: string;
  /** When true, CSP reports will be sent to https://csp-reporting.cloudflare.com/cdn-cgi/script_monitor/report */
  useCloudflareReportingEndpoint: boolean;
  /** When true, the paths associated with connections URLs will also be analyzed. */
  useConnectionUrlPath: boolean;
}

export const PutPageShieldResponse = Schema.Struct({
  enabled: Schema.Boolean,
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  useCloudflareReportingEndpoint: Schema.Boolean.pipe(
    T.JsonName("use_cloudflare_reporting_endpoint"),
  ),
  useConnectionUrlPath: Schema.Boolean.pipe(T.JsonName("use_connection_url_path")),
}) as unknown as Schema.Schema<PutPageShieldResponse>;

export const putPageShield = API.make(() => ({
  input: PutPageShieldRequest,
  output: PutPageShieldResponse,
  errors: [],
}));

// =============================================================================
// Policy
// =============================================================================

export interface GetPolicyRequest {
  policyId: string;
  /** Identifier */
  zoneId: string;
}

export const GetPolicyRequest = Schema.Struct({
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/page_shield/policies/{policyId}" }),
) as unknown as Schema.Schema<GetPolicyRequest>;

export type GetPolicyResponse = unknown;

export const GetPolicyResponse = Schema.Unknown as unknown as Schema.Schema<GetPolicyResponse>;

export const getPolicy = API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [],
}));

export interface CreatePolicyRequest {
  /** Path param: Identifier */
  zoneId: string;
  /** Body param: The action to take if the expression matches */
  action: "allow" | "log";
  /** Body param: A description for the policy */
  description: string;
  /** Body param: Whether the policy is enabled */
  enabled: boolean;
  /** Body param: The expression which must match for the policy to be applied, using the Cloudflare Firewall rule expression syntax */
  expression: string;
  /** Body param: The policy which will be applied */
  value: string;
}

export const CreatePolicyRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  action: Schema.Literal("allow", "log"),
  description: Schema.String,
  enabled: Schema.Boolean,
  expression: Schema.String,
  value: Schema.String,
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/page_shield/policies" }),
) as unknown as Schema.Schema<CreatePolicyRequest>;

export type CreatePolicyResponse = unknown;

export const CreatePolicyResponse =
  Schema.Unknown as unknown as Schema.Schema<CreatePolicyResponse>;

export const createPolicy = API.make(() => ({
  input: CreatePolicyRequest,
  output: CreatePolicyResponse,
  errors: [],
}));

export interface UpdatePolicyRequest {
  policyId: string;
  /** Path param: Identifier */
  zoneId: string;
  /** Body param: The action to take if the expression matches */
  action?: "allow" | "log";
  /** Body param: A description for the policy */
  description?: string;
  /** Body param: Whether the policy is enabled */
  enabled?: boolean;
  /** Body param: The expression which must match for the policy to be applied, using the Cloudflare Firewall rule expression syntax */
  expression?: string;
  /** Body param: The policy which will be applied */
  value?: string;
}

export const UpdatePolicyRequest = Schema.Struct({
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  action: Schema.optional(Schema.Literal("allow", "log")),
  description: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  expression: Schema.optional(Schema.String),
  value: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/page_shield/policies/{policyId}" }),
) as unknown as Schema.Schema<UpdatePolicyRequest>;

export type UpdatePolicyResponse = unknown;

export const UpdatePolicyResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdatePolicyResponse>;

export const updatePolicy = API.make(() => ({
  input: UpdatePolicyRequest,
  output: UpdatePolicyResponse,
  errors: [],
}));

export interface DeletePolicyRequest {
  policyId: string;
  /** Identifier */
  zoneId: string;
}

export const DeletePolicyRequest = Schema.Struct({
  policyId: Schema.String.pipe(T.HttpPath("policyId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/page_shield/policies/{policyId}" }),
) as unknown as Schema.Schema<DeletePolicyRequest>;

export type DeletePolicyResponse = unknown;

export const DeletePolicyResponse =
  Schema.Unknown as unknown as Schema.Schema<DeletePolicyResponse>;

export const deletePolicy = API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [],
}));

// =============================================================================
// Script
// =============================================================================

export interface GetScriptRequest {
  scriptId: string;
  /** Identifier */
  zoneId: string;
}

export const GetScriptRequest = Schema.Struct({
  scriptId: Schema.String.pipe(T.HttpPath("scriptId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/page_shield/scripts/{scriptId}" }),
) as unknown as Schema.Schema<GetScriptRequest>;

export type GetScriptResponse = unknown;

export const GetScriptResponse = Schema.Unknown as unknown as Schema.Schema<GetScriptResponse>;

export const getScript = API.make(() => ({
  input: GetScriptRequest,
  output: GetScriptResponse,
  errors: [],
}));
