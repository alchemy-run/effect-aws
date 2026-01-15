/**
 * Cloudflare HEALTHCHECKS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service healthchecks
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Healthcheck
// =============================================================================

export interface GetHealthcheckRequest {
  healthcheckId: string;
  /** Identifier */
  zoneId: string;
}

export const GetHealthcheckRequest = Schema.Struct({
  healthcheckId: Schema.String.pipe(T.HttpPath("healthcheckId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/healthchecks/{healthcheckId}" }),
) as unknown as Schema.Schema<GetHealthcheckRequest>;

export interface GetHealthcheckResponse {
  /** Identifier */
  id?: string;
  /** The hostname or IP address of the origin server to run health checks on. */
  address?: string;
  /** A list of regions from which to run health checks. Null means Cloudflare will pick a default region. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "IN"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
      )[]
    | null;
  /** The number of consecutive fails required from a health check before changing the health to unhealthy. */
  consecutiveFails?: number;
  /** The number of consecutive successes required from a health check before changing the health to healthy. */
  consecutiveSuccesses?: number;
  createdOn?: string;
  /** A human-readable description of the health check. */
  description?: string;
  /** The current failure reason if status is unhealthy. */
  failureReason?: string;
  /** Parameters specific to an HTTP or HTTPS health check. */
  httpConfig?: {
    allowInsecure?: boolean;
    expectedBody?: string;
    expectedCodes?: string[] | null;
    followRedirects?: boolean;
    header?: Record<string, unknown> | null;
    method?: "GET" | "HEAD";
    path?: string;
    port?: number;
  } | null;
  /** The interval between each health check. Shorter intervals may give quicker notifications if the origin status changes, but will increase load on the origin as we check from multiple locations. */
  interval?: number;
  modifiedOn?: string;
  /** A short name to identify the health check. Only alphanumeric characters, hyphens and underscores are allowed. */
  name?: string;
  /** The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** The current status of the origin server according to the health check. */
  status?: "unknown" | "healthy" | "unhealthy" | "suspended";
  /** If suspended, no health checks are sent to the origin. */
  suspended?: boolean;
  /** Parameters specific to TCP health check. */
  tcpConfig?: { method?: "connection_established"; port?: number } | null;
  /** The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** The protocol to use for the health check. Currently supported protocols are 'HTTP', 'HTTPS' and 'TCP'. */
  type?: string;
}

export const GetHealthcheckResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  address: Schema.optional(Schema.String),
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "IN",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  consecutiveFails: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_fails")),
  consecutiveSuccesses: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_successes")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  failureReason: Schema.optional(Schema.String).pipe(T.JsonName("failure_reason")),
  httpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
        expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
        expectedCodes: Schema.optional(Schema.Union(Schema.Array(Schema.String), Schema.Null)).pipe(
          T.JsonName("expected_codes"),
        ),
        followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
        header: Schema.optional(Schema.Union(Schema.Struct({}), Schema.Null)),
        method: Schema.optional(Schema.Literal("GET", "HEAD")),
        path: Schema.optional(Schema.String),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("http_config")),
  interval: Schema.optional(Schema.Number),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  retries: Schema.optional(Schema.Number),
  status: Schema.optional(Schema.Literal("unknown", "healthy", "unhealthy", "suspended")),
  suspended: Schema.optional(Schema.Boolean),
  tcpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        method: Schema.optional(Schema.Literal("connection_established")),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("tcp_config")),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetHealthcheckResponse>;

export const getHealthcheck = API.make(() => ({
  input: GetHealthcheckRequest,
  output: GetHealthcheckResponse,
  errors: [],
}));

export interface CreateHealthcheckRequest {
  /** Path param: Identifier */
  zoneId: string;
  /** Body param: The hostname or IP address of the origin server to run health checks on. */
  address: string;
  /** Body param: A short name to identify the health check. Only alphanumeric characters, hyphens and underscores are allowed. */
  name: string;
  /** Body param: A list of regions from which to run health checks. Null means Cloudflare will pick a default region. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "IN"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
      )[]
    | null;
  /** Body param: The number of consecutive fails required from a health check before changing the health to unhealthy. */
  consecutiveFails?: number;
  /** Body param: The number of consecutive successes required from a health check before changing the health to healthy. */
  consecutiveSuccesses?: number;
  /** Body param: A human-readable description of the health check. */
  description?: string;
  /** Body param: Parameters specific to an HTTP or HTTPS health check. */
  httpConfig?: {
    allowInsecure?: boolean;
    expectedBody?: string;
    expectedCodes?: string[] | null;
    followRedirects?: boolean;
    header?: Record<string, unknown> | null;
    method?: "GET" | "HEAD";
    path?: string;
    port?: number;
  } | null;
  /** Body param: The interval between each health check. Shorter intervals may give quicker notifications if the origin status changes, but will increase load on the origin as we check from multiple locati */
  interval?: number;
  /** Body param: The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** Body param: If suspended, no health checks are sent to the origin. */
  suspended?: boolean;
  /** Body param: Parameters specific to TCP health check. */
  tcpConfig?: { method?: "connection_established"; port?: number } | null;
  /** Body param: The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** Body param: The protocol to use for the health check. Currently supported protocols are 'HTTP', 'HTTPS' and 'TCP'. */
  type?: string;
}

export const CreateHealthcheckRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  address: Schema.String,
  name: Schema.String,
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "IN",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  consecutiveFails: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_fails")),
  consecutiveSuccesses: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_successes")),
  description: Schema.optional(Schema.String),
  httpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
        expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
        expectedCodes: Schema.optional(Schema.Union(Schema.Array(Schema.String), Schema.Null)).pipe(
          T.JsonName("expected_codes"),
        ),
        followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
        header: Schema.optional(Schema.Union(Schema.Struct({}), Schema.Null)),
        method: Schema.optional(Schema.Literal("GET", "HEAD")),
        path: Schema.optional(Schema.String),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("http_config")),
  interval: Schema.optional(Schema.Number),
  retries: Schema.optional(Schema.Number),
  suspended: Schema.optional(Schema.Boolean),
  tcpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        method: Schema.optional(Schema.Literal("connection_established")),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("tcp_config")),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/healthchecks" }),
) as unknown as Schema.Schema<CreateHealthcheckRequest>;

export interface CreateHealthcheckResponse {
  /** Identifier */
  id?: string;
  /** The hostname or IP address of the origin server to run health checks on. */
  address?: string;
  /** A list of regions from which to run health checks. Null means Cloudflare will pick a default region. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "IN"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
      )[]
    | null;
  /** The number of consecutive fails required from a health check before changing the health to unhealthy. */
  consecutiveFails?: number;
  /** The number of consecutive successes required from a health check before changing the health to healthy. */
  consecutiveSuccesses?: number;
  createdOn?: string;
  /** A human-readable description of the health check. */
  description?: string;
  /** The current failure reason if status is unhealthy. */
  failureReason?: string;
  /** Parameters specific to an HTTP or HTTPS health check. */
  httpConfig?: {
    allowInsecure?: boolean;
    expectedBody?: string;
    expectedCodes?: string[] | null;
    followRedirects?: boolean;
    header?: Record<string, unknown> | null;
    method?: "GET" | "HEAD";
    path?: string;
    port?: number;
  } | null;
  /** The interval between each health check. Shorter intervals may give quicker notifications if the origin status changes, but will increase load on the origin as we check from multiple locations. */
  interval?: number;
  modifiedOn?: string;
  /** A short name to identify the health check. Only alphanumeric characters, hyphens and underscores are allowed. */
  name?: string;
  /** The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** The current status of the origin server according to the health check. */
  status?: "unknown" | "healthy" | "unhealthy" | "suspended";
  /** If suspended, no health checks are sent to the origin. */
  suspended?: boolean;
  /** Parameters specific to TCP health check. */
  tcpConfig?: { method?: "connection_established"; port?: number } | null;
  /** The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** The protocol to use for the health check. Currently supported protocols are 'HTTP', 'HTTPS' and 'TCP'. */
  type?: string;
}

export const CreateHealthcheckResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  address: Schema.optional(Schema.String),
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "IN",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  consecutiveFails: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_fails")),
  consecutiveSuccesses: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_successes")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  failureReason: Schema.optional(Schema.String).pipe(T.JsonName("failure_reason")),
  httpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
        expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
        expectedCodes: Schema.optional(Schema.Union(Schema.Array(Schema.String), Schema.Null)).pipe(
          T.JsonName("expected_codes"),
        ),
        followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
        header: Schema.optional(Schema.Union(Schema.Struct({}), Schema.Null)),
        method: Schema.optional(Schema.Literal("GET", "HEAD")),
        path: Schema.optional(Schema.String),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("http_config")),
  interval: Schema.optional(Schema.Number),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  retries: Schema.optional(Schema.Number),
  status: Schema.optional(Schema.Literal("unknown", "healthy", "unhealthy", "suspended")),
  suspended: Schema.optional(Schema.Boolean),
  tcpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        method: Schema.optional(Schema.Literal("connection_established")),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("tcp_config")),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateHealthcheckResponse>;

export const createHealthcheck = API.make(() => ({
  input: CreateHealthcheckRequest,
  output: CreateHealthcheckResponse,
  errors: [],
}));

export interface UpdateHealthcheckRequest {
  healthcheckId: string;
  /** Path param: Identifier */
  zoneId: string;
  /** Body param: The hostname or IP address of the origin server to run health checks on. */
  address: string;
  /** Body param: A short name to identify the health check. Only alphanumeric characters, hyphens and underscores are allowed. */
  name: string;
  /** Body param: A list of regions from which to run health checks. Null means Cloudflare will pick a default region. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "IN"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
      )[]
    | null;
  /** Body param: The number of consecutive fails required from a health check before changing the health to unhealthy. */
  consecutiveFails?: number;
  /** Body param: The number of consecutive successes required from a health check before changing the health to healthy. */
  consecutiveSuccesses?: number;
  /** Body param: A human-readable description of the health check. */
  description?: string;
  /** Body param: Parameters specific to an HTTP or HTTPS health check. */
  httpConfig?: {
    allowInsecure?: boolean;
    expectedBody?: string;
    expectedCodes?: string[] | null;
    followRedirects?: boolean;
    header?: Record<string, unknown> | null;
    method?: "GET" | "HEAD";
    path?: string;
    port?: number;
  } | null;
  /** Body param: The interval between each health check. Shorter intervals may give quicker notifications if the origin status changes, but will increase load on the origin as we check from multiple locati */
  interval?: number;
  /** Body param: The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** Body param: If suspended, no health checks are sent to the origin. */
  suspended?: boolean;
  /** Body param: Parameters specific to TCP health check. */
  tcpConfig?: { method?: "connection_established"; port?: number } | null;
  /** Body param: The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** Body param: The protocol to use for the health check. Currently supported protocols are 'HTTP', 'HTTPS' and 'TCP'. */
  type?: string;
}

export const UpdateHealthcheckRequest = Schema.Struct({
  healthcheckId: Schema.String.pipe(T.HttpPath("healthcheckId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  address: Schema.String,
  name: Schema.String,
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "IN",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  consecutiveFails: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_fails")),
  consecutiveSuccesses: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_successes")),
  description: Schema.optional(Schema.String),
  httpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
        expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
        expectedCodes: Schema.optional(Schema.Union(Schema.Array(Schema.String), Schema.Null)).pipe(
          T.JsonName("expected_codes"),
        ),
        followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
        header: Schema.optional(Schema.Union(Schema.Struct({}), Schema.Null)),
        method: Schema.optional(Schema.Literal("GET", "HEAD")),
        path: Schema.optional(Schema.String),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("http_config")),
  interval: Schema.optional(Schema.Number),
  retries: Schema.optional(Schema.Number),
  suspended: Schema.optional(Schema.Boolean),
  tcpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        method: Schema.optional(Schema.Literal("connection_established")),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("tcp_config")),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/healthchecks/{healthcheckId}" }),
) as unknown as Schema.Schema<UpdateHealthcheckRequest>;

export interface UpdateHealthcheckResponse {
  /** Identifier */
  id?: string;
  /** The hostname or IP address of the origin server to run health checks on. */
  address?: string;
  /** A list of regions from which to run health checks. Null means Cloudflare will pick a default region. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "IN"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
      )[]
    | null;
  /** The number of consecutive fails required from a health check before changing the health to unhealthy. */
  consecutiveFails?: number;
  /** The number of consecutive successes required from a health check before changing the health to healthy. */
  consecutiveSuccesses?: number;
  createdOn?: string;
  /** A human-readable description of the health check. */
  description?: string;
  /** The current failure reason if status is unhealthy. */
  failureReason?: string;
  /** Parameters specific to an HTTP or HTTPS health check. */
  httpConfig?: {
    allowInsecure?: boolean;
    expectedBody?: string;
    expectedCodes?: string[] | null;
    followRedirects?: boolean;
    header?: Record<string, unknown> | null;
    method?: "GET" | "HEAD";
    path?: string;
    port?: number;
  } | null;
  /** The interval between each health check. Shorter intervals may give quicker notifications if the origin status changes, but will increase load on the origin as we check from multiple locations. */
  interval?: number;
  modifiedOn?: string;
  /** A short name to identify the health check. Only alphanumeric characters, hyphens and underscores are allowed. */
  name?: string;
  /** The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** The current status of the origin server according to the health check. */
  status?: "unknown" | "healthy" | "unhealthy" | "suspended";
  /** If suspended, no health checks are sent to the origin. */
  suspended?: boolean;
  /** Parameters specific to TCP health check. */
  tcpConfig?: { method?: "connection_established"; port?: number } | null;
  /** The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** The protocol to use for the health check. Currently supported protocols are 'HTTP', 'HTTPS' and 'TCP'. */
  type?: string;
}

export const UpdateHealthcheckResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  address: Schema.optional(Schema.String),
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "IN",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  consecutiveFails: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_fails")),
  consecutiveSuccesses: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_successes")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  failureReason: Schema.optional(Schema.String).pipe(T.JsonName("failure_reason")),
  httpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
        expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
        expectedCodes: Schema.optional(Schema.Union(Schema.Array(Schema.String), Schema.Null)).pipe(
          T.JsonName("expected_codes"),
        ),
        followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
        header: Schema.optional(Schema.Union(Schema.Struct({}), Schema.Null)),
        method: Schema.optional(Schema.Literal("GET", "HEAD")),
        path: Schema.optional(Schema.String),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("http_config")),
  interval: Schema.optional(Schema.Number),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  retries: Schema.optional(Schema.Number),
  status: Schema.optional(Schema.Literal("unknown", "healthy", "unhealthy", "suspended")),
  suspended: Schema.optional(Schema.Boolean),
  tcpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        method: Schema.optional(Schema.Literal("connection_established")),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("tcp_config")),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateHealthcheckResponse>;

export const updateHealthcheck = API.make(() => ({
  input: UpdateHealthcheckRequest,
  output: UpdateHealthcheckResponse,
  errors: [],
}));

export interface PatchHealthcheckRequest {
  healthcheckId: string;
  /** Path param: Identifier */
  zoneId: string;
  /** Body param: The hostname or IP address of the origin server to run health checks on. */
  address: string;
  /** Body param: A short name to identify the health check. Only alphanumeric characters, hyphens and underscores are allowed. */
  name: string;
  /** Body param: A list of regions from which to run health checks. Null means Cloudflare will pick a default region. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "IN"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
      )[]
    | null;
  /** Body param: The number of consecutive fails required from a health check before changing the health to unhealthy. */
  consecutiveFails?: number;
  /** Body param: The number of consecutive successes required from a health check before changing the health to healthy. */
  consecutiveSuccesses?: number;
  /** Body param: A human-readable description of the health check. */
  description?: string;
  /** Body param: Parameters specific to an HTTP or HTTPS health check. */
  httpConfig?: {
    allowInsecure?: boolean;
    expectedBody?: string;
    expectedCodes?: string[] | null;
    followRedirects?: boolean;
    header?: Record<string, unknown> | null;
    method?: "GET" | "HEAD";
    path?: string;
    port?: number;
  } | null;
  /** Body param: The interval between each health check. Shorter intervals may give quicker notifications if the origin status changes, but will increase load on the origin as we check from multiple locati */
  interval?: number;
  /** Body param: The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** Body param: If suspended, no health checks are sent to the origin. */
  suspended?: boolean;
  /** Body param: Parameters specific to TCP health check. */
  tcpConfig?: { method?: "connection_established"; port?: number } | null;
  /** Body param: The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** Body param: The protocol to use for the health check. Currently supported protocols are 'HTTP', 'HTTPS' and 'TCP'. */
  type?: string;
}

export const PatchHealthcheckRequest = Schema.Struct({
  healthcheckId: Schema.String.pipe(T.HttpPath("healthcheckId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  address: Schema.String,
  name: Schema.String,
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "IN",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  consecutiveFails: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_fails")),
  consecutiveSuccesses: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_successes")),
  description: Schema.optional(Schema.String),
  httpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
        expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
        expectedCodes: Schema.optional(Schema.Union(Schema.Array(Schema.String), Schema.Null)).pipe(
          T.JsonName("expected_codes"),
        ),
        followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
        header: Schema.optional(Schema.Union(Schema.Struct({}), Schema.Null)),
        method: Schema.optional(Schema.Literal("GET", "HEAD")),
        path: Schema.optional(Schema.String),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("http_config")),
  interval: Schema.optional(Schema.Number),
  retries: Schema.optional(Schema.Number),
  suspended: Schema.optional(Schema.Boolean),
  tcpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        method: Schema.optional(Schema.Literal("connection_established")),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("tcp_config")),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/healthchecks/{healthcheckId}" }),
) as unknown as Schema.Schema<PatchHealthcheckRequest>;

export interface PatchHealthcheckResponse {
  /** Identifier */
  id?: string;
  /** The hostname or IP address of the origin server to run health checks on. */
  address?: string;
  /** A list of regions from which to run health checks. Null means Cloudflare will pick a default region. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "IN"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
      )[]
    | null;
  /** The number of consecutive fails required from a health check before changing the health to unhealthy. */
  consecutiveFails?: number;
  /** The number of consecutive successes required from a health check before changing the health to healthy. */
  consecutiveSuccesses?: number;
  createdOn?: string;
  /** A human-readable description of the health check. */
  description?: string;
  /** The current failure reason if status is unhealthy. */
  failureReason?: string;
  /** Parameters specific to an HTTP or HTTPS health check. */
  httpConfig?: {
    allowInsecure?: boolean;
    expectedBody?: string;
    expectedCodes?: string[] | null;
    followRedirects?: boolean;
    header?: Record<string, unknown> | null;
    method?: "GET" | "HEAD";
    path?: string;
    port?: number;
  } | null;
  /** The interval between each health check. Shorter intervals may give quicker notifications if the origin status changes, but will increase load on the origin as we check from multiple locations. */
  interval?: number;
  modifiedOn?: string;
  /** A short name to identify the health check. Only alphanumeric characters, hyphens and underscores are allowed. */
  name?: string;
  /** The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** The current status of the origin server according to the health check. */
  status?: "unknown" | "healthy" | "unhealthy" | "suspended";
  /** If suspended, no health checks are sent to the origin. */
  suspended?: boolean;
  /** Parameters specific to TCP health check. */
  tcpConfig?: { method?: "connection_established"; port?: number } | null;
  /** The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** The protocol to use for the health check. Currently supported protocols are 'HTTP', 'HTTPS' and 'TCP'. */
  type?: string;
}

export const PatchHealthcheckResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  address: Schema.optional(Schema.String),
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "IN",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  consecutiveFails: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_fails")),
  consecutiveSuccesses: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_successes")),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  description: Schema.optional(Schema.String),
  failureReason: Schema.optional(Schema.String).pipe(T.JsonName("failure_reason")),
  httpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        allowInsecure: Schema.optional(Schema.Boolean).pipe(T.JsonName("allow_insecure")),
        expectedBody: Schema.optional(Schema.String).pipe(T.JsonName("expected_body")),
        expectedCodes: Schema.optional(Schema.Union(Schema.Array(Schema.String), Schema.Null)).pipe(
          T.JsonName("expected_codes"),
        ),
        followRedirects: Schema.optional(Schema.Boolean).pipe(T.JsonName("follow_redirects")),
        header: Schema.optional(Schema.Union(Schema.Struct({}), Schema.Null)),
        method: Schema.optional(Schema.Literal("GET", "HEAD")),
        path: Schema.optional(Schema.String),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("http_config")),
  interval: Schema.optional(Schema.Number),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  retries: Schema.optional(Schema.Number),
  status: Schema.optional(Schema.Literal("unknown", "healthy", "unhealthy", "suspended")),
  suspended: Schema.optional(Schema.Boolean),
  tcpConfig: Schema.optional(
    Schema.Union(
      Schema.Struct({
        method: Schema.optional(Schema.Literal("connection_established")),
        port: Schema.optional(Schema.Number),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("tcp_config")),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PatchHealthcheckResponse>;

export const patchHealthcheck = API.make(() => ({
  input: PatchHealthcheckRequest,
  output: PatchHealthcheckResponse,
  errors: [],
}));

export interface DeleteHealthcheckRequest {
  healthcheckId: string;
  /** Identifier */
  zoneId: string;
}

export const DeleteHealthcheckRequest = Schema.Struct({
  healthcheckId: Schema.String.pipe(T.HttpPath("healthcheckId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/healthchecks/{healthcheckId}" }),
) as unknown as Schema.Schema<DeleteHealthcheckRequest>;

export interface DeleteHealthcheckResponse {
  /** Identifier */
  id?: string;
}

export const DeleteHealthcheckResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteHealthcheckResponse>;

export const deleteHealthcheck = API.make(() => ({
  input: DeleteHealthcheckRequest,
  output: DeleteHealthcheckResponse,
  errors: [],
}));

// =============================================================================
// Preview
// =============================================================================

export interface GetPreviewRequest {
  healthcheckId: string;
  /** Identifier */
  zoneId: string;
}

export const GetPreviewRequest = Schema.Struct({
  healthcheckId: Schema.String.pipe(T.HttpPath("healthcheckId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/healthchecks/preview/{healthcheckId}" }),
) as unknown as Schema.Schema<GetPreviewRequest>;

export type GetPreviewResponse = unknown;

export const GetPreviewResponse = Schema.Unknown as unknown as Schema.Schema<GetPreviewResponse>;

export const getPreview = API.make(() => ({
  input: GetPreviewRequest,
  output: GetPreviewResponse,
  errors: [],
}));

export interface CreatePreviewRequest {
  /** Path param: Identifier */
  zoneId: string;
  /** Body param: The hostname or IP address of the origin server to run health checks on. */
  address: string;
  /** Body param: A short name to identify the health check. Only alphanumeric characters, hyphens and underscores are allowed. */
  name: string;
  /** Body param: A list of regions from which to run health checks. Null means Cloudflare will pick a default region. */
  checkRegions?:
    | (
        | "WNAM"
        | "ENAM"
        | "WEU"
        | "EEU"
        | "NSAM"
        | "SSAM"
        | "OC"
        | "ME"
        | "NAF"
        | "SAF"
        | "IN"
        | "SEAS"
        | "NEAS"
        | "ALL_REGIONS"
      )[]
    | null;
  /** Body param: The number of consecutive fails required from a health check before changing the health to unhealthy. */
  consecutiveFails?: number;
  /** Body param: The number of consecutive successes required from a health check before changing the health to healthy. */
  consecutiveSuccesses?: number;
  /** Body param: A human-readable description of the health check. */
  description?: string;
  /** Body param: Parameters specific to an HTTP or HTTPS health check. */
  httpConfig?: unknown | null;
  /** Body param: The interval between each health check. Shorter intervals may give quicker notifications if the origin status changes, but will increase load on the origin as we check from multiple locati */
  interval?: number;
  /** Body param: The number of retries to attempt in case of a timeout before marking the origin as unhealthy. Retries are attempted immediately. */
  retries?: number;
  /** Body param: If suspended, no health checks are sent to the origin. */
  suspended?: boolean;
  /** Body param: Parameters specific to TCP health check. */
  tcpConfig?: unknown | null;
  /** Body param: The timeout (in seconds) before marking the health check as failed. */
  timeout?: number;
  /** Body param: The protocol to use for the health check. Currently supported protocols are 'HTTP', 'HTTPS' and 'TCP'. */
  type?: string;
}

export const CreatePreviewRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  address: Schema.String,
  name: Schema.String,
  checkRegions: Schema.optional(
    Schema.Union(
      Schema.Array(
        Schema.Literal(
          "WNAM",
          "ENAM",
          "WEU",
          "EEU",
          "NSAM",
          "SSAM",
          "OC",
          "ME",
          "NAF",
          "SAF",
          "IN",
          "SEAS",
          "NEAS",
          "ALL_REGIONS",
        ),
      ),
      Schema.Null,
    ),
  ).pipe(T.JsonName("check_regions")),
  consecutiveFails: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_fails")),
  consecutiveSuccesses: Schema.optional(Schema.Number).pipe(T.JsonName("consecutive_successes")),
  description: Schema.optional(Schema.String),
  httpConfig: Schema.optional(Schema.Union(Schema.Unknown, Schema.Null)).pipe(
    T.JsonName("http_config"),
  ),
  interval: Schema.optional(Schema.Number),
  retries: Schema.optional(Schema.Number),
  suspended: Schema.optional(Schema.Boolean),
  tcpConfig: Schema.optional(Schema.Union(Schema.Unknown, Schema.Null)).pipe(
    T.JsonName("tcp_config"),
  ),
  timeout: Schema.optional(Schema.Number),
  type: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/healthchecks/preview" }),
) as unknown as Schema.Schema<CreatePreviewRequest>;

export type CreatePreviewResponse = unknown;

export const CreatePreviewResponse =
  Schema.Unknown as unknown as Schema.Schema<CreatePreviewResponse>;

export const createPreview = API.make(() => ({
  input: CreatePreviewRequest,
  output: CreatePreviewResponse,
  errors: [],
}));

export interface DeletePreviewRequest {
  healthcheckId: string;
  /** Identifier */
  zoneId: string;
}

export const DeletePreviewRequest = Schema.Struct({
  healthcheckId: Schema.String.pipe(T.HttpPath("healthcheckId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/healthchecks/preview/{healthcheckId}" }),
) as unknown as Schema.Schema<DeletePreviewRequest>;

export interface DeletePreviewResponse {
  /** Identifier */
  id?: string;
}

export const DeletePreviewResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeletePreviewResponse>;

export const deletePreview = API.make(() => ({
  input: DeletePreviewRequest,
  output: DeletePreviewResponse,
  errors: [],
}));
