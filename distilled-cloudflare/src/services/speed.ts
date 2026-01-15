/**
 * Cloudflare SPEED API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service speed
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Availability
// =============================================================================

export interface ListAvailabilitiesRequest {
  /** Identifier. */
  zoneId: string;
}

export const ListAvailabilitiesRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/speed_api/availabilities" }),
) as unknown as Schema.Schema<ListAvailabilitiesRequest>;

export interface ListAvailabilitiesResponse {
  quota?: {
    plan?: string;
    quotasPerPlan?: {
      value?: { business?: number; enterprise?: number; free?: number; pro?: number };
    };
    remainingSchedules?: number;
    remainingTests?: number;
    scheduleQuotasPerPlan?: {
      value?: { business?: number; enterprise?: number; free?: number; pro?: number };
    };
  };
  regions?: unknown[];
  /** Available regions. */
  regionsPerPlan?: {
    business?: unknown[];
    enterprise?: unknown[];
    free?: unknown[];
    pro?: unknown[];
  };
}

export const ListAvailabilitiesResponse = Schema.Struct({
  quota: Schema.optional(
    Schema.Struct({
      plan: Schema.optional(Schema.String),
      quotasPerPlan: Schema.optional(
        Schema.Struct({
          value: Schema.optional(
            Schema.Struct({
              business: Schema.optional(Schema.Number),
              enterprise: Schema.optional(Schema.Number),
              free: Schema.optional(Schema.Number),
              pro: Schema.optional(Schema.Number),
            }),
          ),
        }),
      ),
      remainingSchedules: Schema.optional(Schema.Number),
      remainingTests: Schema.optional(Schema.Number),
      scheduleQuotasPerPlan: Schema.optional(
        Schema.Struct({
          value: Schema.optional(
            Schema.Struct({
              business: Schema.optional(Schema.Number),
              enterprise: Schema.optional(Schema.Number),
              free: Schema.optional(Schema.Number),
              pro: Schema.optional(Schema.Number),
            }),
          ),
        }),
      ),
    }),
  ),
  regions: Schema.optional(Schema.Array(Schema.Unknown)),
  regionsPerPlan: Schema.optional(
    Schema.Struct({
      business: Schema.optional(Schema.Array(Schema.Unknown)),
      enterprise: Schema.optional(Schema.Array(Schema.Unknown)),
      free: Schema.optional(Schema.Array(Schema.Unknown)),
      pro: Schema.optional(Schema.Array(Schema.Unknown)),
    }),
  ),
}) as unknown as Schema.Schema<ListAvailabilitiesResponse>;

export const listAvailabilities = API.make(() => ({
  input: ListAvailabilitiesRequest,
  output: ListAvailabilitiesResponse,
  errors: [],
}));

// =============================================================================
// Page
// =============================================================================

export interface TrendPageRequest {
  url: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: The type of device. */
  deviceType: "DESKTOP" | "MOBILE";
  /** Query param: A comma-separated list of metrics to include in the results. */
  metrics: string;
  /** Query param: A test region. */
  region:
    | "asia-east1"
    | "asia-northeast1"
    | "asia-northeast2"
    | "asia-south1"
    | "asia-southeast1"
    | "australia-southeast1"
    | "europe-north1"
    | "europe-southwest1"
    | "europe-west1"
    | "europe-west2"
    | "europe-west3"
    | "europe-west4"
    | "europe-west8"
    | "europe-west9"
    | "me-west1"
    | "southamerica-east1"
    | "us-central1"
    | "us-east1"
    | "us-east4"
    | "us-south1"
    | "us-west1";
  /** Query param: */
  start: string;
  /** Query param: The timezone of the start and end timestamps. */
  tz: string;
  /** Query param: */
  end?: string;
}

export const TrendPageRequest = Schema.Struct({
  url: Schema.String.pipe(T.HttpPath("url")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  deviceType: Schema.Literal("DESKTOP", "MOBILE").pipe(T.HttpQuery("deviceType")),
  metrics: Schema.String.pipe(T.HttpQuery("metrics")),
  region: Schema.Literal(
    "asia-east1",
    "asia-northeast1",
    "asia-northeast2",
    "asia-south1",
    "asia-southeast1",
    "australia-southeast1",
    "europe-north1",
    "europe-southwest1",
    "europe-west1",
    "europe-west2",
    "europe-west3",
    "europe-west4",
    "europe-west8",
    "europe-west9",
    "me-west1",
    "southamerica-east1",
    "us-central1",
    "us-east1",
    "us-east4",
    "us-south1",
    "us-west1",
  ).pipe(T.HttpQuery("region")),
  start: Schema.String.pipe(T.HttpQuery("start")),
  tz: Schema.String.pipe(T.HttpQuery("tz")),
  end: Schema.optional(Schema.String).pipe(T.HttpQuery("end")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/speed_api/pages/{url}/trend" }),
) as unknown as Schema.Schema<TrendPageRequest>;

export type TrendPageResponse = unknown;

export const TrendPageResponse = Schema.Unknown as unknown as Schema.Schema<TrendPageResponse>;

export const trendPage = API.make(() => ({
  input: TrendPageRequest,
  output: TrendPageResponse,
  errors: [],
}));

// =============================================================================
// PageTest
// =============================================================================

export interface GetPageTestRequest {
  url: string;
  testId: string;
  /** Identifier. */
  zoneId: string;
}

export const GetPageTestRequest = Schema.Struct({
  url: Schema.String.pipe(T.HttpPath("url")),
  testId: Schema.String.pipe(T.HttpPath("testId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/speed_api/pages/{url}/tests/{testId}" }),
) as unknown as Schema.Schema<GetPageTestRequest>;

export interface GetPageTestResponse {
  /** UUID. */
  id?: string;
  date?: string;
  /** The Lighthouse report. */
  desktopReport?: unknown;
  /** The Lighthouse report. */
  mobileReport?: unknown;
  /** A test region with a label. */
  region?: unknown;
  /** The frequency of the test. */
  scheduleFrequency?: "DAILY" | "WEEKLY";
  /** A URL. */
  url?: string;
}

export const GetPageTestResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  date: Schema.optional(Schema.String),
  desktopReport: Schema.optional(Schema.Unknown),
  mobileReport: Schema.optional(Schema.Unknown),
  region: Schema.optional(Schema.Unknown),
  scheduleFrequency: Schema.optional(Schema.Literal("DAILY", "WEEKLY")),
  url: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetPageTestResponse>;

export const getPageTest = API.make(() => ({
  input: GetPageTestRequest,
  output: GetPageTestResponse,
  errors: [],
}));

export interface CreatePageTestRequest {
  url: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: A test region. */
  region?:
    | "asia-east1"
    | "asia-northeast1"
    | "asia-northeast2"
    | "asia-south1"
    | "asia-southeast1"
    | "australia-southeast1"
    | "europe-north1"
    | "europe-southwest1"
    | "europe-west1"
    | "europe-west2"
    | "europe-west3"
    | "europe-west4"
    | "europe-west8"
    | "europe-west9"
    | "me-west1"
    | "southamerica-east1"
    | "us-central1"
    | "us-east1"
    | "us-east4"
    | "us-south1"
    | "us-west1";
}

export const CreatePageTestRequest = Schema.Struct({
  url: Schema.String.pipe(T.HttpPath("url")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  region: Schema.optional(
    Schema.Literal(
      "asia-east1",
      "asia-northeast1",
      "asia-northeast2",
      "asia-south1",
      "asia-southeast1",
      "australia-southeast1",
      "europe-north1",
      "europe-southwest1",
      "europe-west1",
      "europe-west2",
      "europe-west3",
      "europe-west4",
      "europe-west8",
      "europe-west9",
      "me-west1",
      "southamerica-east1",
      "us-central1",
      "us-east1",
      "us-east4",
      "us-south1",
      "us-west1",
    ),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/speed_api/pages/{url}/tests" }),
) as unknown as Schema.Schema<CreatePageTestRequest>;

export interface CreatePageTestResponse {
  /** UUID. */
  id?: string;
  date?: string;
  /** The Lighthouse report. */
  desktopReport?: unknown;
  /** The Lighthouse report. */
  mobileReport?: unknown;
  /** A test region with a label. */
  region?: unknown;
  /** The frequency of the test. */
  scheduleFrequency?: "DAILY" | "WEEKLY";
  /** A URL. */
  url?: string;
}

export const CreatePageTestResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  date: Schema.optional(Schema.String),
  desktopReport: Schema.optional(Schema.Unknown),
  mobileReport: Schema.optional(Schema.Unknown),
  region: Schema.optional(Schema.Unknown),
  scheduleFrequency: Schema.optional(Schema.Literal("DAILY", "WEEKLY")),
  url: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreatePageTestResponse>;

export const createPageTest = API.make(() => ({
  input: CreatePageTestRequest,
  output: CreatePageTestResponse,
  errors: [],
}));

export interface DeletePageTestRequest {
  url: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: A test region. */
  region?:
    | "asia-east1"
    | "asia-northeast1"
    | "asia-northeast2"
    | "asia-south1"
    | "asia-southeast1"
    | "australia-southeast1"
    | "europe-north1"
    | "europe-southwest1"
    | "europe-west1"
    | "europe-west2"
    | "europe-west3"
    | "europe-west4"
    | "europe-west8"
    | "europe-west9"
    | "me-west1"
    | "southamerica-east1"
    | "us-central1"
    | "us-east1"
    | "us-east4"
    | "us-south1"
    | "us-west1";
}

export const DeletePageTestRequest = Schema.Struct({
  url: Schema.String.pipe(T.HttpPath("url")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  region: Schema.optional(
    Schema.Literal(
      "asia-east1",
      "asia-northeast1",
      "asia-northeast2",
      "asia-south1",
      "asia-southeast1",
      "australia-southeast1",
      "europe-north1",
      "europe-southwest1",
      "europe-west1",
      "europe-west2",
      "europe-west3",
      "europe-west4",
      "europe-west8",
      "europe-west9",
      "me-west1",
      "southamerica-east1",
      "us-central1",
      "us-east1",
      "us-east4",
      "us-south1",
      "us-west1",
    ),
  ).pipe(T.HttpQuery("region")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/speed_api/pages/{url}/tests" }),
) as unknown as Schema.Schema<DeletePageTestRequest>;

export interface DeletePageTestResponse {
  /** Number of items affected. */
  count?: number;
}

export const DeletePageTestResponse = Schema.Struct({
  count: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<DeletePageTestResponse>;

export const deletePageTest = API.make(() => ({
  input: DeletePageTestRequest,
  output: DeletePageTestResponse,
  errors: [],
}));

// =============================================================================
// Schedule
// =============================================================================

export interface GetScheduleRequest {
  url: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: A test region. */
  region?:
    | "asia-east1"
    | "asia-northeast1"
    | "asia-northeast2"
    | "asia-south1"
    | "asia-southeast1"
    | "australia-southeast1"
    | "europe-north1"
    | "europe-southwest1"
    | "europe-west1"
    | "europe-west2"
    | "europe-west3"
    | "europe-west4"
    | "europe-west8"
    | "europe-west9"
    | "me-west1"
    | "southamerica-east1"
    | "us-central1"
    | "us-east1"
    | "us-east4"
    | "us-south1"
    | "us-west1";
}

export const GetScheduleRequest = Schema.Struct({
  url: Schema.String.pipe(T.HttpPath("url")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  region: Schema.optional(
    Schema.Literal(
      "asia-east1",
      "asia-northeast1",
      "asia-northeast2",
      "asia-south1",
      "asia-southeast1",
      "australia-southeast1",
      "europe-north1",
      "europe-southwest1",
      "europe-west1",
      "europe-west2",
      "europe-west3",
      "europe-west4",
      "europe-west8",
      "europe-west9",
      "me-west1",
      "southamerica-east1",
      "us-central1",
      "us-east1",
      "us-east4",
      "us-south1",
      "us-west1",
    ),
  ).pipe(T.HttpQuery("region")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/speed_api/schedule/{url}" }),
) as unknown as Schema.Schema<GetScheduleRequest>;

export interface GetScheduleResponse {
  /** The frequency of the test. */
  frequency?: "DAILY" | "WEEKLY";
  /** A test region. */
  region?:
    | "asia-east1"
    | "asia-northeast1"
    | "asia-northeast2"
    | "asia-south1"
    | "asia-southeast1"
    | "australia-southeast1"
    | "europe-north1"
    | "europe-southwest1"
    | "europe-west1"
    | "europe-west2"
    | "europe-west3"
    | "europe-west4"
    | "europe-west8"
    | "europe-west9"
    | "me-west1"
    | "southamerica-east1"
    | "us-central1"
    | "us-east1"
    | "us-east4"
    | "us-south1"
    | "us-west1";
  /** A URL. */
  url?: string;
}

export const GetScheduleResponse = Schema.Struct({
  frequency: Schema.optional(Schema.Literal("DAILY", "WEEKLY")),
  region: Schema.optional(
    Schema.Literal(
      "asia-east1",
      "asia-northeast1",
      "asia-northeast2",
      "asia-south1",
      "asia-southeast1",
      "australia-southeast1",
      "europe-north1",
      "europe-southwest1",
      "europe-west1",
      "europe-west2",
      "europe-west3",
      "europe-west4",
      "europe-west8",
      "europe-west9",
      "me-west1",
      "southamerica-east1",
      "us-central1",
      "us-east1",
      "us-east4",
      "us-south1",
      "us-west1",
    ),
  ),
  url: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetScheduleResponse>;

export const getSchedule = API.make(() => ({
  input: GetScheduleRequest,
  output: GetScheduleResponse,
  errors: [],
}));

export interface CreateScheduleRequest {
  url: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: A test region. */
  region?:
    | "asia-east1"
    | "asia-northeast1"
    | "asia-northeast2"
    | "asia-south1"
    | "asia-southeast1"
    | "australia-southeast1"
    | "europe-north1"
    | "europe-southwest1"
    | "europe-west1"
    | "europe-west2"
    | "europe-west3"
    | "europe-west4"
    | "europe-west8"
    | "europe-west9"
    | "me-west1"
    | "southamerica-east1"
    | "us-central1"
    | "us-east1"
    | "us-east4"
    | "us-south1"
    | "us-west1";
}

export const CreateScheduleRequest = Schema.Struct({
  url: Schema.String.pipe(T.HttpPath("url")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  region: Schema.optional(
    Schema.Literal(
      "asia-east1",
      "asia-northeast1",
      "asia-northeast2",
      "asia-south1",
      "asia-southeast1",
      "australia-southeast1",
      "europe-north1",
      "europe-southwest1",
      "europe-west1",
      "europe-west2",
      "europe-west3",
      "europe-west4",
      "europe-west8",
      "europe-west9",
      "me-west1",
      "southamerica-east1",
      "us-central1",
      "us-east1",
      "us-east4",
      "us-south1",
      "us-west1",
    ),
  ).pipe(T.HttpQuery("region")),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/speed_api/schedule/{url}" }),
) as unknown as Schema.Schema<CreateScheduleRequest>;

export interface CreateScheduleResponse {
  /** The test schedule. */
  schedule?: {
    frequency?: "DAILY" | "WEEKLY";
    region?:
      | "asia-east1"
      | "asia-northeast1"
      | "asia-northeast2"
      | "asia-south1"
      | "asia-southeast1"
      | "australia-southeast1"
      | "europe-north1"
      | "europe-southwest1"
      | "europe-west1"
      | "europe-west2"
      | "europe-west3"
      | "europe-west4"
      | "europe-west8"
      | "europe-west9"
      | "me-west1"
      | "southamerica-east1"
      | "us-central1"
      | "us-east1"
      | "us-east4"
      | "us-south1"
      | "us-west1";
    url?: string;
  };
  test?: unknown;
}

export const CreateScheduleResponse = Schema.Struct({
  schedule: Schema.optional(
    Schema.Struct({
      frequency: Schema.optional(Schema.Literal("DAILY", "WEEKLY")),
      region: Schema.optional(
        Schema.Literal(
          "asia-east1",
          "asia-northeast1",
          "asia-northeast2",
          "asia-south1",
          "asia-southeast1",
          "australia-southeast1",
          "europe-north1",
          "europe-southwest1",
          "europe-west1",
          "europe-west2",
          "europe-west3",
          "europe-west4",
          "europe-west8",
          "europe-west9",
          "me-west1",
          "southamerica-east1",
          "us-central1",
          "us-east1",
          "us-east4",
          "us-south1",
          "us-west1",
        ),
      ),
      url: Schema.optional(Schema.String),
    }),
  ),
  test: Schema.optional(Schema.Unknown),
}) as unknown as Schema.Schema<CreateScheduleResponse>;

export const createSchedule = API.make(() => ({
  input: CreateScheduleRequest,
  output: CreateScheduleResponse,
  errors: [],
}));

export interface DeleteScheduleRequest {
  url: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: A test region. */
  region?:
    | "asia-east1"
    | "asia-northeast1"
    | "asia-northeast2"
    | "asia-south1"
    | "asia-southeast1"
    | "australia-southeast1"
    | "europe-north1"
    | "europe-southwest1"
    | "europe-west1"
    | "europe-west2"
    | "europe-west3"
    | "europe-west4"
    | "europe-west8"
    | "europe-west9"
    | "me-west1"
    | "southamerica-east1"
    | "us-central1"
    | "us-east1"
    | "us-east4"
    | "us-south1"
    | "us-west1";
}

export const DeleteScheduleRequest = Schema.Struct({
  url: Schema.String.pipe(T.HttpPath("url")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  region: Schema.optional(
    Schema.Literal(
      "asia-east1",
      "asia-northeast1",
      "asia-northeast2",
      "asia-south1",
      "asia-southeast1",
      "australia-southeast1",
      "europe-north1",
      "europe-southwest1",
      "europe-west1",
      "europe-west2",
      "europe-west3",
      "europe-west4",
      "europe-west8",
      "europe-west9",
      "me-west1",
      "southamerica-east1",
      "us-central1",
      "us-east1",
      "us-east4",
      "us-south1",
      "us-west1",
    ),
  ).pipe(T.HttpQuery("region")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/speed_api/schedule/{url}" }),
) as unknown as Schema.Schema<DeleteScheduleRequest>;

export interface DeleteScheduleResponse {
  /** Number of items affected. */
  count?: number;
}

export const DeleteScheduleResponse = Schema.Struct({
  count: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<DeleteScheduleResponse>;

export const deleteSchedule = API.make(() => ({
  input: DeleteScheduleRequest,
  output: DeleteScheduleResponse,
  errors: [],
}));
