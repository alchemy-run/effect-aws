/**
 * Cloudflare BOTNET-FEED API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service botnet-feed
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// ConfigAsn
// =============================================================================

export interface GetConfigAsnRequest {
  /** Identifier. */
  accountId: string;
}

export const GetConfigAsnRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/botnet_feed/configs/asn" }),
) as unknown as Schema.Schema<GetConfigAsnRequest>;

export interface GetConfigAsnResponse {
  asn?: number;
}

export const GetConfigAsnResponse = Schema.Struct({
  asn: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetConfigAsnResponse>;

export const getConfigAsn = API.make(() => ({
  input: GetConfigAsnRequest,
  output: GetConfigAsnResponse,
  errors: [],
}));

export interface DeleteConfigAsnRequest {
  asnId: number;
  /** Identifier. */
  accountId: string;
}

export const DeleteConfigAsnRequest = Schema.Struct({
  asnId: Schema.Number.pipe(T.HttpPath("asnId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/botnet_feed/configs/asn/{asnId}" }),
) as unknown as Schema.Schema<DeleteConfigAsnRequest>;

export interface DeleteConfigAsnResponse {
  asn?: number;
}

export const DeleteConfigAsnResponse = Schema.Struct({
  asn: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<DeleteConfigAsnResponse>;

export const deleteConfigAsn = API.make(() => ({
  input: DeleteConfigAsnRequest,
  output: DeleteConfigAsnResponse,
  errors: [],
}));

// =============================================================================
// ReportAsn
// =============================================================================

export interface DayReportAsnRequest {
  asnId: number;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: */
  date?: string;
}

export const DayReportAsnRequest = Schema.Struct({
  asnId: Schema.Number.pipe(T.HttpPath("asnId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  date: Schema.optional(Schema.String).pipe(T.HttpQuery("date")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/botnet_feed/asn/{asnId}/day_report" }),
) as unknown as Schema.Schema<DayReportAsnRequest>;

export interface DayReportAsnResponse {
  cidr?: string;
  date?: string;
  offenseCount?: number;
}

export const DayReportAsnResponse = Schema.Struct({
  cidr: Schema.optional(Schema.String),
  date: Schema.optional(Schema.String),
  offenseCount: Schema.optional(Schema.Number).pipe(T.JsonName("offense_count")),
}) as unknown as Schema.Schema<DayReportAsnResponse>;

export const dayReportAsn = API.make(() => ({
  input: DayReportAsnRequest,
  output: DayReportAsnResponse,
  errors: [],
}));

export interface FullReportAsnRequest {
  asnId: number;
  /** Identifier. */
  accountId: string;
}

export const FullReportAsnRequest = Schema.Struct({
  asnId: Schema.Number.pipe(T.HttpPath("asnId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/botnet_feed/asn/{asnId}/full_report" }),
) as unknown as Schema.Schema<FullReportAsnRequest>;

export interface FullReportAsnResponse {
  cidr?: string;
  date?: string;
  offenseCount?: number;
}

export const FullReportAsnResponse = Schema.Struct({
  cidr: Schema.optional(Schema.String),
  date: Schema.optional(Schema.String),
  offenseCount: Schema.optional(Schema.Number).pipe(T.JsonName("offense_count")),
}) as unknown as Schema.Schema<FullReportAsnResponse>;

export const fullReportAsn = API.make(() => ({
  input: FullReportAsnRequest,
  output: FullReportAsnResponse,
  errors: [],
}));
