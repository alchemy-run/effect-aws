/**
 * Cloudflare ABUSE-REPORTS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service abuse-reports
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
// AbuseReport
// =============================================================================

export interface CreateAbuseReportRequest {
  reportType: string;
}

export const CreateAbuseReportRequest = Schema.Struct({
  reportType: Schema.String.pipe(T.HttpPath("reportType")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/abuse-reports/{reportType}",
  }),
) as unknown as Schema.Schema<CreateAbuseReportRequest>;

export type CreateAbuseReportResponse = string;

export const CreateAbuseReportResponse =
  Schema.String as unknown as Schema.Schema<CreateAbuseReportResponse>;

export const createAbuseReport: (
  input: CreateAbuseReportRequest,
) => Effect.Effect<
  CreateAbuseReportResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAbuseReportRequest,
  output: CreateAbuseReportResponse,
  errors: [],
}));
