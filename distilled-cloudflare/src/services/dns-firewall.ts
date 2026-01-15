/**
 * Cloudflare DNS-FIREWALL API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service dns-firewall
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// AnalyticReport
// =============================================================================

export interface GetAnalyticReportRequest {
  dnsFirewallId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: A comma-separated list of dimensions to group results by. */
  dimensions?: string;
  /** Query param: Segmentation filter in 'attribute operator value' format. */
  filters?: string;
  /** Query param: Limit number of returned metrics. */
  limit?: number;
  /** Query param: A comma-separated list of metrics to query. */
  metrics?: string;
  /** Query param: Start date and time of requesting data period in ISO 8601 format. */
  since?: string;
  /** Query param: A comma-separated list of dimensions to sort by, where each dimension may be prefixed by - (descending) or + (ascending). */
  sort?: string;
  /** Query param: End date and time of requesting data period in ISO 8601 format. */
  until?: string;
}

export const GetAnalyticReportRequest = Schema.Struct({
  dnsFirewallId: Schema.String.pipe(T.HttpPath("dnsFirewallId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  dimensions: Schema.optional(Schema.String).pipe(T.HttpQuery("dimensions")),
  filters: Schema.optional(Schema.String).pipe(T.HttpQuery("filters")),
  limit: Schema.optional(Schema.Number).pipe(T.HttpQuery("limit")),
  metrics: Schema.optional(Schema.String).pipe(T.HttpQuery("metrics")),
  since: Schema.optional(Schema.String).pipe(T.HttpQuery("since")),
  sort: Schema.optional(Schema.String).pipe(T.HttpQuery("sort")),
  until: Schema.optional(Schema.String).pipe(T.HttpQuery("until")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dns_firewall/{dnsFirewallId}/dns_analytics/report",
  }),
) as unknown as Schema.Schema<GetAnalyticReportRequest>;

export type GetAnalyticReportResponse = unknown;

export const GetAnalyticReportResponse =
  Schema.Unknown as unknown as Schema.Schema<GetAnalyticReportResponse>;

export const getAnalyticReport = API.make(() => ({
  input: GetAnalyticReportRequest,
  output: GetAnalyticReportResponse,
  errors: [],
}));

// =============================================================================
// AnalyticReportBytime
// =============================================================================

export interface GetAnalyticReportBytimeRequest {
  dnsFirewallId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: A comma-separated list of dimensions to group results by. */
  dimensions?: string;
  /** Query param: Segmentation filter in 'attribute operator value' format. */
  filters?: string;
  /** Query param: Limit number of returned metrics. */
  limit?: number;
  /** Query param: A comma-separated list of metrics to query. */
  metrics?: string;
  /** Query param: Start date and time of requesting data period in ISO 8601 format. */
  since?: string;
  /** Query param: A comma-separated list of dimensions to sort by, where each dimension may be prefixed by - (descending) or + (ascending). */
  sort?: string;
  /** Query param: Unit of time to group data by. */
  timeDelta?:
    | "all"
    | "auto"
    | "year"
    | "quarter"
    | "month"
    | "week"
    | "day"
    | "hour"
    | "dekaminute"
    | "minute";
  /** Query param: End date and time of requesting data period in ISO 8601 format. */
  until?: string;
}

export const GetAnalyticReportBytimeRequest = Schema.Struct({
  dnsFirewallId: Schema.String.pipe(T.HttpPath("dnsFirewallId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  dimensions: Schema.optional(Schema.String).pipe(T.HttpQuery("dimensions")),
  filters: Schema.optional(Schema.String).pipe(T.HttpQuery("filters")),
  limit: Schema.optional(Schema.Number).pipe(T.HttpQuery("limit")),
  metrics: Schema.optional(Schema.String).pipe(T.HttpQuery("metrics")),
  since: Schema.optional(Schema.String).pipe(T.HttpQuery("since")),
  sort: Schema.optional(Schema.String).pipe(T.HttpQuery("sort")),
  timeDelta: Schema.optional(
    Schema.Literal(
      "all",
      "auto",
      "year",
      "quarter",
      "month",
      "week",
      "day",
      "hour",
      "dekaminute",
      "minute",
    ),
  ).pipe(T.HttpQuery("time_delta")),
  until: Schema.optional(Schema.String).pipe(T.HttpQuery("until")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dns_firewall/{dnsFirewallId}/dns_analytics/report/bytime",
  }),
) as unknown as Schema.Schema<GetAnalyticReportBytimeRequest>;

export type GetAnalyticReportBytimeResponse = unknown;

export const GetAnalyticReportBytimeResponse =
  Schema.Unknown as unknown as Schema.Schema<GetAnalyticReportBytimeResponse>;

export const getAnalyticReportBytime = API.make(() => ({
  input: GetAnalyticReportBytimeRequest,
  output: GetAnalyticReportBytimeResponse,
  errors: [],
}));

// =============================================================================
// DnsFirewall
// =============================================================================

export interface GetDnsFirewallRequest {
  dnsFirewallId: string;
  /** Identifier. */
  accountId: string;
}

export const GetDnsFirewallRequest = Schema.Struct({
  dnsFirewallId: Schema.String.pipe(T.HttpPath("dnsFirewallId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/dns_firewall/{dnsFirewallId}" }),
) as unknown as Schema.Schema<GetDnsFirewallRequest>;

export interface GetDnsFirewallResponse {
  /** Identifier. */
  id: string;
  /** Whether to refuse to answer queries for the ANY type */
  deprecateAnyRequests: boolean;
  dnsFirewallIps: string[];
  /** Whether to forward client IP (resolver) subnet if no EDNS Client Subnet is sent */
  ecsFallback: boolean;
  /** By default, Cloudflare attempts to cache responses for as long as indicated by the TTL received from upstream nameservers. This setting sets an upper bound on this duration. For caching purposes, high */
  maximumCacheTtl: number;
  /** By default, Cloudflare attempts to cache responses for as long as indicated by the TTL received from upstream nameservers. This setting sets a lower bound on this duration. For caching purposes, lower */
  minimumCacheTtl: number;
  /** Last modification of DNS Firewall cluster */
  modifiedOn: string;
  /** DNS Firewall cluster name */
  name: string;
  /** This setting controls how long DNS Firewall should cache negative responses (e.g., NXDOMAIN) from the upstream servers.  This setting does not affect the TTL value in the DNS response Cloudflare retur */
  negativeCacheTtl: number | null;
  /** Ratelimit in queries per second per datacenter (applies to DNS queries sent to the upstream nameservers configured on the cluster) */
  ratelimit: number | null;
  /** Number of retries for fetching DNS responses from upstream nameservers (not counting the initial attempt) */
  retries: number;
  upstreamIps: string[];
  /** Attack mitigation settings */
  attackMitigation?: { enabled?: boolean; onlyWhenUpstreamUnhealthy?: boolean } | null;
}

export const GetDnsFirewallResponse = Schema.Struct({
  id: Schema.String,
  deprecateAnyRequests: Schema.Boolean.pipe(T.JsonName("deprecate_any_requests")),
  dnsFirewallIps: Schema.Array(Schema.String).pipe(T.JsonName("dns_firewall_ips")),
  ecsFallback: Schema.Boolean.pipe(T.JsonName("ecs_fallback")),
  maximumCacheTtl: Schema.Number.pipe(T.JsonName("maximum_cache_ttl")),
  minimumCacheTtl: Schema.Number.pipe(T.JsonName("minimum_cache_ttl")),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  negativeCacheTtl: Schema.Union(Schema.Number, Schema.Null).pipe(T.JsonName("negative_cache_ttl")),
  ratelimit: Schema.Union(Schema.Number, Schema.Null),
  retries: Schema.Number,
  upstreamIps: Schema.Array(Schema.String).pipe(T.JsonName("upstream_ips")),
  attackMitigation: Schema.optional(
    Schema.Union(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        onlyWhenUpstreamUnhealthy: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("only_when_upstream_unhealthy"),
        ),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("attack_mitigation")),
}) as unknown as Schema.Schema<GetDnsFirewallResponse>;

export const getDnsFirewall = API.make(() => ({
  input: GetDnsFirewallRequest,
  output: GetDnsFirewallResponse,
  errors: [],
}));

export interface CreateDnsFirewallRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: DNS Firewall cluster name */
  name: string;
  /** Body param: */
  upstreamIps: string[];
  /** Body param: Attack mitigation settings */
  attackMitigation?: { enabled?: boolean; onlyWhenUpstreamUnhealthy?: boolean } | null;
  /** Body param: Whether to refuse to answer queries for the ANY type */
  deprecateAnyRequests?: boolean;
  /** Body param: Whether to forward client IP (resolver) subnet if no EDNS Client Subnet is sent */
  ecsFallback?: boolean;
  /** Body param: By default, Cloudflare attempts to cache responses for as long as indicated by the TTL received from upstream nameservers. This setting sets an upper bound on this duration. For caching pu */
  maximumCacheTtl?: number;
  /** Body param: By default, Cloudflare attempts to cache responses for as long as indicated by the TTL received from upstream nameservers. This setting sets a lower bound on this duration. For caching pur */
  minimumCacheTtl?: number;
  /** Body param: This setting controls how long DNS Firewall should cache negative responses (e.g., NXDOMAIN) from the upstream servers.  This setting does not affect the TTL value in the DNS response Clou */
  negativeCacheTtl?: number | null;
  /** Body param: Ratelimit in queries per second per datacenter (applies to DNS queries sent to the upstream nameservers configured on the cluster) */
  ratelimit?: number | null;
  /** Body param: Number of retries for fetching DNS responses from upstream nameservers (not counting the initial attempt) */
  retries?: number;
}

export const CreateDnsFirewallRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  upstreamIps: Schema.Array(Schema.String).pipe(T.JsonName("upstream_ips")),
  attackMitigation: Schema.optional(
    Schema.Union(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        onlyWhenUpstreamUnhealthy: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("only_when_upstream_unhealthy"),
        ),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("attack_mitigation")),
  deprecateAnyRequests: Schema.optional(Schema.Boolean).pipe(T.JsonName("deprecate_any_requests")),
  ecsFallback: Schema.optional(Schema.Boolean).pipe(T.JsonName("ecs_fallback")),
  maximumCacheTtl: Schema.optional(Schema.Number).pipe(T.JsonName("maximum_cache_ttl")),
  minimumCacheTtl: Schema.optional(Schema.Number).pipe(T.JsonName("minimum_cache_ttl")),
  negativeCacheTtl: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.JsonName("negative_cache_ttl"),
  ),
  ratelimit: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  retries: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/dns_firewall" }),
) as unknown as Schema.Schema<CreateDnsFirewallRequest>;

export interface CreateDnsFirewallResponse {
  /** Identifier. */
  id: string;
  /** Whether to refuse to answer queries for the ANY type */
  deprecateAnyRequests: boolean;
  dnsFirewallIps: string[];
  /** Whether to forward client IP (resolver) subnet if no EDNS Client Subnet is sent */
  ecsFallback: boolean;
  /** By default, Cloudflare attempts to cache responses for as long as indicated by the TTL received from upstream nameservers. This setting sets an upper bound on this duration. For caching purposes, high */
  maximumCacheTtl: number;
  /** By default, Cloudflare attempts to cache responses for as long as indicated by the TTL received from upstream nameservers. This setting sets a lower bound on this duration. For caching purposes, lower */
  minimumCacheTtl: number;
  /** Last modification of DNS Firewall cluster */
  modifiedOn: string;
  /** DNS Firewall cluster name */
  name: string;
  /** This setting controls how long DNS Firewall should cache negative responses (e.g., NXDOMAIN) from the upstream servers.  This setting does not affect the TTL value in the DNS response Cloudflare retur */
  negativeCacheTtl: number | null;
  /** Ratelimit in queries per second per datacenter (applies to DNS queries sent to the upstream nameservers configured on the cluster) */
  ratelimit: number | null;
  /** Number of retries for fetching DNS responses from upstream nameservers (not counting the initial attempt) */
  retries: number;
  upstreamIps: string[];
  /** Attack mitigation settings */
  attackMitigation?: { enabled?: boolean; onlyWhenUpstreamUnhealthy?: boolean } | null;
}

export const CreateDnsFirewallResponse = Schema.Struct({
  id: Schema.String,
  deprecateAnyRequests: Schema.Boolean.pipe(T.JsonName("deprecate_any_requests")),
  dnsFirewallIps: Schema.Array(Schema.String).pipe(T.JsonName("dns_firewall_ips")),
  ecsFallback: Schema.Boolean.pipe(T.JsonName("ecs_fallback")),
  maximumCacheTtl: Schema.Number.pipe(T.JsonName("maximum_cache_ttl")),
  minimumCacheTtl: Schema.Number.pipe(T.JsonName("minimum_cache_ttl")),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  negativeCacheTtl: Schema.Union(Schema.Number, Schema.Null).pipe(T.JsonName("negative_cache_ttl")),
  ratelimit: Schema.Union(Schema.Number, Schema.Null),
  retries: Schema.Number,
  upstreamIps: Schema.Array(Schema.String).pipe(T.JsonName("upstream_ips")),
  attackMitigation: Schema.optional(
    Schema.Union(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        onlyWhenUpstreamUnhealthy: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("only_when_upstream_unhealthy"),
        ),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("attack_mitigation")),
}) as unknown as Schema.Schema<CreateDnsFirewallResponse>;

export const createDnsFirewall = API.make(() => ({
  input: CreateDnsFirewallRequest,
  output: CreateDnsFirewallResponse,
  errors: [],
}));

export interface PatchDnsFirewallRequest {
  dnsFirewallId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Attack mitigation settings */
  attackMitigation?: { enabled?: boolean; onlyWhenUpstreamUnhealthy?: boolean } | null;
  /** Body param: Whether to refuse to answer queries for the ANY type */
  deprecateAnyRequests?: boolean;
  /** Body param: Whether to forward client IP (resolver) subnet if no EDNS Client Subnet is sent */
  ecsFallback?: boolean;
  /** Body param: By default, Cloudflare attempts to cache responses for as long as indicated by the TTL received from upstream nameservers. This setting sets an upper bound on this duration. For caching pu */
  maximumCacheTtl?: number;
  /** Body param: By default, Cloudflare attempts to cache responses for as long as indicated by the TTL received from upstream nameservers. This setting sets a lower bound on this duration. For caching pur */
  minimumCacheTtl?: number;
  /** Body param: DNS Firewall cluster name */
  name?: string;
  /** Body param: This setting controls how long DNS Firewall should cache negative responses (e.g., NXDOMAIN) from the upstream servers.  This setting does not affect the TTL value in the DNS response Clou */
  negativeCacheTtl?: number | null;
  /** Body param: Ratelimit in queries per second per datacenter (applies to DNS queries sent to the upstream nameservers configured on the cluster) */
  ratelimit?: number | null;
  /** Body param: Number of retries for fetching DNS responses from upstream nameservers (not counting the initial attempt) */
  retries?: number;
  /** Body param: */
  upstreamIps?: string[];
}

export const PatchDnsFirewallRequest = Schema.Struct({
  dnsFirewallId: Schema.String.pipe(T.HttpPath("dnsFirewallId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  attackMitigation: Schema.optional(
    Schema.Union(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        onlyWhenUpstreamUnhealthy: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("only_when_upstream_unhealthy"),
        ),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("attack_mitigation")),
  deprecateAnyRequests: Schema.optional(Schema.Boolean).pipe(T.JsonName("deprecate_any_requests")),
  ecsFallback: Schema.optional(Schema.Boolean).pipe(T.JsonName("ecs_fallback")),
  maximumCacheTtl: Schema.optional(Schema.Number).pipe(T.JsonName("maximum_cache_ttl")),
  minimumCacheTtl: Schema.optional(Schema.Number).pipe(T.JsonName("minimum_cache_ttl")),
  name: Schema.optional(Schema.String),
  negativeCacheTtl: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.JsonName("negative_cache_ttl"),
  ),
  ratelimit: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  retries: Schema.optional(Schema.Number),
  upstreamIps: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("upstream_ips")),
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/dns_firewall/{dnsFirewallId}" }),
) as unknown as Schema.Schema<PatchDnsFirewallRequest>;

export interface PatchDnsFirewallResponse {
  /** Identifier. */
  id: string;
  /** Whether to refuse to answer queries for the ANY type */
  deprecateAnyRequests: boolean;
  dnsFirewallIps: string[];
  /** Whether to forward client IP (resolver) subnet if no EDNS Client Subnet is sent */
  ecsFallback: boolean;
  /** By default, Cloudflare attempts to cache responses for as long as indicated by the TTL received from upstream nameservers. This setting sets an upper bound on this duration. For caching purposes, high */
  maximumCacheTtl: number;
  /** By default, Cloudflare attempts to cache responses for as long as indicated by the TTL received from upstream nameservers. This setting sets a lower bound on this duration. For caching purposes, lower */
  minimumCacheTtl: number;
  /** Last modification of DNS Firewall cluster */
  modifiedOn: string;
  /** DNS Firewall cluster name */
  name: string;
  /** This setting controls how long DNS Firewall should cache negative responses (e.g., NXDOMAIN) from the upstream servers.  This setting does not affect the TTL value in the DNS response Cloudflare retur */
  negativeCacheTtl: number | null;
  /** Ratelimit in queries per second per datacenter (applies to DNS queries sent to the upstream nameservers configured on the cluster) */
  ratelimit: number | null;
  /** Number of retries for fetching DNS responses from upstream nameservers (not counting the initial attempt) */
  retries: number;
  upstreamIps: string[];
  /** Attack mitigation settings */
  attackMitigation?: { enabled?: boolean; onlyWhenUpstreamUnhealthy?: boolean } | null;
}

export const PatchDnsFirewallResponse = Schema.Struct({
  id: Schema.String,
  deprecateAnyRequests: Schema.Boolean.pipe(T.JsonName("deprecate_any_requests")),
  dnsFirewallIps: Schema.Array(Schema.String).pipe(T.JsonName("dns_firewall_ips")),
  ecsFallback: Schema.Boolean.pipe(T.JsonName("ecs_fallback")),
  maximumCacheTtl: Schema.Number.pipe(T.JsonName("maximum_cache_ttl")),
  minimumCacheTtl: Schema.Number.pipe(T.JsonName("minimum_cache_ttl")),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  negativeCacheTtl: Schema.Union(Schema.Number, Schema.Null).pipe(T.JsonName("negative_cache_ttl")),
  ratelimit: Schema.Union(Schema.Number, Schema.Null),
  retries: Schema.Number,
  upstreamIps: Schema.Array(Schema.String).pipe(T.JsonName("upstream_ips")),
  attackMitigation: Schema.optional(
    Schema.Union(
      Schema.Struct({
        enabled: Schema.optional(Schema.Boolean),
        onlyWhenUpstreamUnhealthy: Schema.optional(Schema.Boolean).pipe(
          T.JsonName("only_when_upstream_unhealthy"),
        ),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("attack_mitigation")),
}) as unknown as Schema.Schema<PatchDnsFirewallResponse>;

export const patchDnsFirewall = API.make(() => ({
  input: PatchDnsFirewallRequest,
  output: PatchDnsFirewallResponse,
  errors: [],
}));

export interface DeleteDnsFirewallRequest {
  dnsFirewallId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteDnsFirewallRequest = Schema.Struct({
  dnsFirewallId: Schema.String.pipe(T.HttpPath("dnsFirewallId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/dns_firewall/{dnsFirewallId}" }),
) as unknown as Schema.Schema<DeleteDnsFirewallRequest>;

export interface DeleteDnsFirewallResponse {
  /** Identifier. */
  id?: string;
}

export const DeleteDnsFirewallResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteDnsFirewallResponse>;

export const deleteDnsFirewall = API.make(() => ({
  input: DeleteDnsFirewallRequest,
  output: DeleteDnsFirewallResponse,
  errors: [],
}));

// =============================================================================
// ReverseDn
// =============================================================================

export interface GetReverseDnRequest {
  dnsFirewallId: string;
  /** Identifier. */
  accountId: string;
}

export const GetReverseDnRequest = Schema.Struct({
  dnsFirewallId: Schema.String.pipe(T.HttpPath("dnsFirewallId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dns_firewall/{dnsFirewallId}/reverse_dns",
  }),
) as unknown as Schema.Schema<GetReverseDnRequest>;

export interface GetReverseDnResponse {
  /** Map of cluster IP addresses to PTR record contents */
  ptr: Record<string, unknown>;
}

export const GetReverseDnResponse = Schema.Struct({
  ptr: Schema.Struct({}),
}) as unknown as Schema.Schema<GetReverseDnResponse>;

export const getReverseDn = API.make(() => ({
  input: GetReverseDnRequest,
  output: GetReverseDnResponse,
  errors: [],
}));

export interface PatchReverseDnRequest {
  dnsFirewallId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Map of cluster IP addresses to PTR record contents */
  ptr?: Record<string, unknown>;
}

export const PatchReverseDnRequest = Schema.Struct({
  dnsFirewallId: Schema.String.pipe(T.HttpPath("dnsFirewallId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  ptr: Schema.optional(Schema.Struct({})),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/dns_firewall/{dnsFirewallId}/reverse_dns",
  }),
) as unknown as Schema.Schema<PatchReverseDnRequest>;

export interface PatchReverseDnResponse {
  /** Map of cluster IP addresses to PTR record contents */
  ptr: Record<string, unknown>;
}

export const PatchReverseDnResponse = Schema.Struct({
  ptr: Schema.Struct({}),
}) as unknown as Schema.Schema<PatchReverseDnResponse>;

export const patchReverseDn = API.make(() => ({
  input: PatchReverseDnRequest,
  output: PatchReverseDnResponse,
  errors: [],
}));
