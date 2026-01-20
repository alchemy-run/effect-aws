/**
 * Cloudflare SECURITY-CENTER API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service security-center
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
// Insight
// =============================================================================

export interface DismissInsightRequest {
  issueId: string;
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: */
  dismiss?: boolean;
}

export const DismissInsightRequest = Schema.Struct({
  issueId: Schema.String.pipe(T.HttpPath("issueId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  dismiss: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/{accountOrZone}/{accountOrZoneId}/security-center/insights/{issueId}/dismiss",
  }),
) as unknown as Schema.Schema<DismissInsightRequest>;

export interface DismissInsightResponse {
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
}

export const DismissInsightResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<DismissInsightResponse>;

export const dismissInsight: (
  input: DismissInsightRequest,
) => Effect.Effect<
  DismissInsightResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DismissInsightRequest,
  output: DismissInsightResponse,
  errors: [],
}));

// =============================================================================
// InsightClass
// =============================================================================

export interface GetInsightClassRequest {}

export const GetInsightClassRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/security-center/insights/class",
  }),
) as unknown as Schema.Schema<GetInsightClassRequest>;

export type GetInsightClassResponse = { count?: number; value?: string }[];

export const GetInsightClassResponse = Schema.Array(
  Schema.Struct({
    count: Schema.optional(Schema.Number),
    value: Schema.optional(Schema.String),
  }),
) as unknown as Schema.Schema<GetInsightClassResponse>;

export const getInsightClass: (
  input: GetInsightClassRequest,
) => Effect.Effect<
  GetInsightClassResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetInsightClassRequest,
  output: GetInsightClassResponse,
  errors: [],
}));

// =============================================================================
// InsightSeverity
// =============================================================================

export interface GetInsightSeverityRequest {}

export const GetInsightSeverityRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/security-center/insights/severity",
  }),
) as unknown as Schema.Schema<GetInsightSeverityRequest>;

export type GetInsightSeverityResponse = { count?: number; value?: string }[];

export const GetInsightSeverityResponse = Schema.Array(
  Schema.Struct({
    count: Schema.optional(Schema.Number),
    value: Schema.optional(Schema.String),
  }),
) as unknown as Schema.Schema<GetInsightSeverityResponse>;

export const getInsightSeverity: (
  input: GetInsightSeverityRequest,
) => Effect.Effect<
  GetInsightSeverityResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetInsightSeverityRequest,
  output: GetInsightSeverityResponse,
  errors: [],
}));

// =============================================================================
// InsightType
// =============================================================================

export interface GetInsightTypeRequest {}

export const GetInsightTypeRequest = Schema.Struct({}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/security-center/insights/type",
  }),
) as unknown as Schema.Schema<GetInsightTypeRequest>;

export type GetInsightTypeResponse = { count?: number; value?: string }[];

export const GetInsightTypeResponse = Schema.Array(
  Schema.Struct({
    count: Schema.optional(Schema.Number),
    value: Schema.optional(Schema.String),
  }),
) as unknown as Schema.Schema<GetInsightTypeResponse>;

export const getInsightType: (
  input: GetInsightTypeRequest,
) => Effect.Effect<
  GetInsightTypeResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetInsightTypeRequest,
  output: GetInsightTypeResponse,
  errors: [],
}));
