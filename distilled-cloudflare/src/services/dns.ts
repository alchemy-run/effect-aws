/**
 * Cloudflare DNS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service dns
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
// AnalyticReport
// =============================================================================

export interface GetAnalyticReportRequest {
  /** Path param: Identifier. */
  zoneId: string;
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
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  dimensions: Schema.optional(Schema.String).pipe(T.HttpQuery("dimensions")),
  filters: Schema.optional(Schema.String).pipe(T.HttpQuery("filters")),
  limit: Schema.optional(Schema.Number).pipe(T.HttpQuery("limit")),
  metrics: Schema.optional(Schema.String).pipe(T.HttpQuery("metrics")),
  since: Schema.optional(Schema.String).pipe(T.HttpQuery("since")),
  sort: Schema.optional(Schema.String).pipe(T.HttpQuery("sort")),
  until: Schema.optional(Schema.String).pipe(T.HttpQuery("until")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/dns_analytics/report" }),
) as unknown as Schema.Schema<GetAnalyticReportRequest>;

export interface GetAnalyticReportResponse {
  /** Array with one row per combination of dimension values. */
  data: { dimensions: string[]; metrics: number[] }[];
  /** Number of seconds between current time and last processed event, in another words how many seconds of data could be missing. */
  dataLag: number;
  /** Maximum results for each metric (object mapping metric names to values). Currently always an empty object. */
  max: unknown;
  /** Minimum results for each metric (object mapping metric names to values). Currently always an empty object. */
  min: unknown;
  query: {
    dimensions: string[];
    limit: number;
    metrics: string[];
    since: string;
    until: string;
    filters?: string;
    sort?: string[];
  };
  /** Total number of rows in the result. */
  rows: number;
  /** Total results for metrics across all data (object mapping metric names to values). */
  totals: unknown;
}

export const GetAnalyticReportResponse = Schema.Struct({
  data: Schema.Array(
    Schema.Struct({
      dimensions: Schema.Array(Schema.String),
      metrics: Schema.Array(Schema.Number),
    }),
  ),
  dataLag: Schema.Number.pipe(T.JsonName("data_lag")),
  max: Schema.Unknown,
  min: Schema.Unknown,
  query: Schema.Struct({
    dimensions: Schema.Array(Schema.String),
    limit: Schema.Number,
    metrics: Schema.Array(Schema.String),
    since: Schema.String,
    until: Schema.String,
    filters: Schema.optional(Schema.String),
    sort: Schema.optional(Schema.Array(Schema.String)),
  }),
  rows: Schema.Number,
  totals: Schema.Unknown,
}) as unknown as Schema.Schema<GetAnalyticReportResponse>;

export const getAnalyticReport: (
  input: GetAnalyticReportRequest,
) => Effect.Effect<
  GetAnalyticReportResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAnalyticReportRequest,
  output: GetAnalyticReportResponse,
  errors: [],
}));

// =============================================================================
// AnalyticReportBytime
// =============================================================================

export interface GetAnalyticReportBytimeRequest {
  /** Path param: Identifier. */
  zoneId: string;
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
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
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
    path: "/zones/{zone_id}/dns_analytics/report/bytime",
  }),
) as unknown as Schema.Schema<GetAnalyticReportBytimeRequest>;

export interface GetAnalyticReportBytimeResponse {
  /** Array with one row per combination of dimension values. */
  data: { dimensions: string[]; metrics: number[][] }[];
  /** Number of seconds between current time and last processed event, in another words how many seconds of data could be missing. */
  dataLag: number;
  /** Maximum results for each metric (object mapping metric names to values). Currently always an empty object. */
  max: unknown;
  /** Minimum results for each metric (object mapping metric names to values). Currently always an empty object. */
  min: unknown;
  query: {
    dimensions: string[];
    limit: number;
    metrics: string[];
    since: string;
    timeDelta:
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
    until: string;
    filters?: string;
    sort?: string[];
  };
  /** Total number of rows in the result. */
  rows: number;
  /** Array of time intervals in the response data. Each interval is represented as an array containing two values: the start time, and the end time. */
  timeIntervals: string[][];
  /** Total results for metrics across all data (object mapping metric names to values). */
  totals: unknown;
}

export const GetAnalyticReportBytimeResponse = Schema.Struct({
  data: Schema.Array(
    Schema.Struct({
      dimensions: Schema.Array(Schema.String),
      metrics: Schema.Array(Schema.Array(Schema.Number)),
    }),
  ),
  dataLag: Schema.Number.pipe(T.JsonName("data_lag")),
  max: Schema.Unknown,
  min: Schema.Unknown,
  query: Schema.Struct({
    dimensions: Schema.Array(Schema.String),
    limit: Schema.Number,
    metrics: Schema.Array(Schema.String),
    since: Schema.String,
    timeDelta: Schema.Literal(
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
    ).pipe(T.JsonName("time_delta")),
    until: Schema.String,
    filters: Schema.optional(Schema.String),
    sort: Schema.optional(Schema.Array(Schema.String)),
  }),
  rows: Schema.Number,
  timeIntervals: Schema.Array(Schema.Array(Schema.String)).pipe(
    T.JsonName("time_intervals"),
  ),
  totals: Schema.Unknown,
}) as unknown as Schema.Schema<GetAnalyticReportBytimeResponse>;

export const getAnalyticReportBytime: (
  input: GetAnalyticReportBytimeRequest,
) => Effect.Effect<
  GetAnalyticReportBytimeResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetAnalyticReportBytimeRequest,
  output: GetAnalyticReportBytimeResponse,
  errors: [],
}));

// =============================================================================
// Dnssec
// =============================================================================

export interface GetDnssecRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetDnssecRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/dnssec" }),
) as unknown as Schema.Schema<GetDnssecRequest>;

export interface GetDnssecResponse {
  /** Algorithm key code. */
  algorithm?: string | null;
  /** Digest hash. */
  digest?: string | null;
  /** Type of digest algorithm. */
  digestAlgorithm?: string | null;
  /** Coded type for digest algorithm. */
  digestType?: string | null;
  /** If true, multi-signer DNSSEC is enabled on the zone, allowing multiple providers to serve a DNSSEC-signed zone at the same time. This is required for DNSKEY records (except those automatically generat */
  dnssecMultiSigner?: boolean;
  /** If true, allows Cloudflare to transfer in a DNSSEC-signed zone including signatures from an external provider, without requiring Cloudflare to sign any records on the fly.  Note that this feature has  */
  dnssecPresigned?: boolean;
  /** If true, enables the use of NSEC3 together with DNSSEC on the zone. Combined with setting dnssec_presigned to true, this enables the use of NSEC3 records when transferring in from an external provider */
  dnssecUseNsec3?: boolean;
  /** Full DS record. */
  ds?: string | null;
  /** Flag for DNSSEC record. */
  flags?: number | null;
  /** Code for key tag. */
  keyTag?: number | null;
  /** Algorithm key type. */
  keyType?: string | null;
  /** When DNSSEC was last modified. */
  modifiedOn?: string | null;
  /** Public key for DS record. */
  publicKey?: string | null;
  /** Status of DNSSEC, based on user-desired state and presence of necessary records. */
  status?: "active" | "pending" | "disabled" | "pending-disabled" | "error";
}

export const GetDnssecResponse = Schema.Struct({
  algorithm: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  digest: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  digestAlgorithm: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("digest_algorithm")),
  digestType: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("digest_type"),
  ),
  dnssecMultiSigner: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("dnssec_multi_signer"),
  ),
  dnssecPresigned: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("dnssec_presigned"),
  ),
  dnssecUseNsec3: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("dnssec_use_nsec3"),
  ),
  ds: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  flags: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  keyTag: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.JsonName("key_tag"),
  ),
  keyType: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("key_type"),
  ),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
  publicKey: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("public_key"),
  ),
  status: Schema.optional(
    Schema.Literal(
      "active",
      "pending",
      "disabled",
      "pending-disabled",
      "error",
    ),
  ),
}) as unknown as Schema.Schema<GetDnssecResponse>;

export const getDnssec: (
  input: GetDnssecRequest,
) => Effect.Effect<
  GetDnssecResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetDnssecRequest,
  output: GetDnssecResponse,
  errors: [],
}));

export interface PatchDnssecRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: If true, multi-signer DNSSEC is enabled on the zone, allowing multiple providers to serve a DNSSEC-signed zone at the same time. This is required for DNSKEY records (except those automatic */
  dnssecMultiSigner?: boolean;
  /** Body param: If true, allows Cloudflare to transfer in a DNSSEC-signed zone including signatures from an external provider, without requiring Cloudflare to sign any records on the fly.  Note that this  */
  dnssecPresigned?: boolean;
  /** Body param: If true, enables the use of NSEC3 together with DNSSEC on the zone. Combined with setting dnssec_presigned to true, this enables the use of NSEC3 records when transferring in from an exter */
  dnssecUseNsec3?: boolean;
  /** Body param: Status of DNSSEC, based on user-desired state and presence of necessary records. */
  status?: "active" | "disabled";
}

export const PatchDnssecRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  dnssecMultiSigner: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("dnssec_multi_signer"),
  ),
  dnssecPresigned: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("dnssec_presigned"),
  ),
  dnssecUseNsec3: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("dnssec_use_nsec3"),
  ),
  status: Schema.optional(Schema.Literal("active", "disabled")),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/dnssec" }),
) as unknown as Schema.Schema<PatchDnssecRequest>;

export interface PatchDnssecResponse {
  /** Algorithm key code. */
  algorithm?: string | null;
  /** Digest hash. */
  digest?: string | null;
  /** Type of digest algorithm. */
  digestAlgorithm?: string | null;
  /** Coded type for digest algorithm. */
  digestType?: string | null;
  /** If true, multi-signer DNSSEC is enabled on the zone, allowing multiple providers to serve a DNSSEC-signed zone at the same time. This is required for DNSKEY records (except those automatically generat */
  dnssecMultiSigner?: boolean;
  /** If true, allows Cloudflare to transfer in a DNSSEC-signed zone including signatures from an external provider, without requiring Cloudflare to sign any records on the fly.  Note that this feature has  */
  dnssecPresigned?: boolean;
  /** If true, enables the use of NSEC3 together with DNSSEC on the zone. Combined with setting dnssec_presigned to true, this enables the use of NSEC3 records when transferring in from an external provider */
  dnssecUseNsec3?: boolean;
  /** Full DS record. */
  ds?: string | null;
  /** Flag for DNSSEC record. */
  flags?: number | null;
  /** Code for key tag. */
  keyTag?: number | null;
  /** Algorithm key type. */
  keyType?: string | null;
  /** When DNSSEC was last modified. */
  modifiedOn?: string | null;
  /** Public key for DS record. */
  publicKey?: string | null;
  /** Status of DNSSEC, based on user-desired state and presence of necessary records. */
  status?: "active" | "pending" | "disabled" | "pending-disabled" | "error";
}

export const PatchDnssecResponse = Schema.Struct({
  algorithm: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  digest: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  digestAlgorithm: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("digest_algorithm")),
  digestType: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("digest_type"),
  ),
  dnssecMultiSigner: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("dnssec_multi_signer"),
  ),
  dnssecPresigned: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("dnssec_presigned"),
  ),
  dnssecUseNsec3: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("dnssec_use_nsec3"),
  ),
  ds: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  flags: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  keyTag: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.JsonName("key_tag"),
  ),
  keyType: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("key_type"),
  ),
  modifiedOn: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("modified_on"),
  ),
  publicKey: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("public_key"),
  ),
  status: Schema.optional(
    Schema.Literal(
      "active",
      "pending",
      "disabled",
      "pending-disabled",
      "error",
    ),
  ),
}) as unknown as Schema.Schema<PatchDnssecResponse>;

export const patchDnssec: (
  input: PatchDnssecRequest,
) => Effect.Effect<
  PatchDnssecResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchDnssecRequest,
  output: PatchDnssecResponse,
  errors: [],
}));

export interface DeleteDnssecRequest {
  /** Identifier. */
  zoneId: string;
}

export const DeleteDnssecRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/dnssec" }),
) as unknown as Schema.Schema<DeleteDnssecRequest>;

export type DeleteDnssecResponse = string;

export const DeleteDnssecResponse =
  Schema.String as unknown as Schema.Schema<DeleteDnssecResponse>;

export const deleteDnssec: (
  input: DeleteDnssecRequest,
) => Effect.Effect<
  DeleteDnssecResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDnssecRequest,
  output: DeleteDnssecResponse,
  errors: [],
}));

// =============================================================================
// NotifyZoneTransferOutgoing
// =============================================================================

export interface ForceNotifyZoneTransferOutgoingRequest {
  /** Path param: */
  zoneId: string;
  /** Body param: */
  body: unknown;
}

export const ForceNotifyZoneTransferOutgoingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "POST",
    path: "/zones/{zone_id}/secondary_dns/outgoing/force_notify",
  }),
) as unknown as Schema.Schema<ForceNotifyZoneTransferOutgoingRequest>;

export type ForceNotifyZoneTransferOutgoingResponse = string;

export const ForceNotifyZoneTransferOutgoingResponse =
  Schema.String as unknown as Schema.Schema<ForceNotifyZoneTransferOutgoingResponse>;

export const forceNotifyZoneTransferOutgoing: (
  input: ForceNotifyZoneTransferOutgoingRequest,
) => Effect.Effect<
  ForceNotifyZoneTransferOutgoingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ForceNotifyZoneTransferOutgoingRequest,
  output: ForceNotifyZoneTransferOutgoingResponse,
  errors: [],
}));

// =============================================================================
// Record
// =============================================================================

export interface GetRecordRequest {
  dnsRecordId: string;
  /** Identifier. */
  zoneId: string;
}

export const GetRecordRequest = Schema.Struct({
  dnsRecordId: Schema.String.pipe(T.HttpPath("dnsRecordId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/dns_records/{dnsRecordId}" }),
) as unknown as Schema.Schema<GetRecordRequest>;

export type GetRecordResponse =
  | {
      id: string;
      createdOn: string;
      meta: unknown;
      modifiedOn: string;
      proxiable: boolean;
      commentModifiedOn?: string;
      tagsModifiedOn?: string;
    }
  | {
      id: string;
      comment: string;
      content: string;
      createdOn: string;
      meta: unknown;
      modifiedOn: string;
      name: string;
      proxiable: boolean;
      proxied: boolean;
      settings: { ipv4Only?: boolean; ipv6Only?: boolean };
      tags: string[];
      ttl: number;
      type: "OPENPGPKEY";
      commentModifiedOn?: string;
      tagsModifiedOn?: string;
    };

export const GetRecordResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    meta: Schema.Unknown,
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    proxiable: Schema.Boolean,
    commentModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("comment_modified_on"),
    ),
    tagsModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("tags_modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    comment: Schema.String,
    content: Schema.String,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    meta: Schema.Unknown,
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    name: Schema.String,
    proxiable: Schema.Boolean,
    proxied: Schema.Boolean,
    settings: Schema.Struct({
      ipv4Only: Schema.optional(Schema.Boolean).pipe(T.JsonName("ipv4_only")),
      ipv6Only: Schema.optional(Schema.Boolean).pipe(T.JsonName("ipv6_only")),
    }),
    tags: Schema.Array(Schema.String),
    ttl: Schema.Number,
    type: Schema.Literal("OPENPGPKEY"),
    commentModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("comment_modified_on"),
    ),
    tagsModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("tags_modified_on"),
    ),
  }),
) as unknown as Schema.Schema<GetRecordResponse>;

export const getRecord: (
  input: GetRecordRequest,
) => Effect.Effect<
  GetRecordResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRecordRequest,
  output: GetRecordResponse,
  errors: [],
}));

export interface CreateRecordRequest {}

export const CreateRecordRequest = Schema.Struct({}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/dns_records" }),
) as unknown as Schema.Schema<CreateRecordRequest>;

export type CreateRecordResponse =
  | {
      id: string;
      createdOn: string;
      meta: unknown;
      modifiedOn: string;
      proxiable: boolean;
      commentModifiedOn?: string;
      tagsModifiedOn?: string;
    }
  | {
      id: string;
      comment: string;
      content: string;
      createdOn: string;
      meta: unknown;
      modifiedOn: string;
      name: string;
      proxiable: boolean;
      proxied: boolean;
      settings: { ipv4Only?: boolean; ipv6Only?: boolean };
      tags: string[];
      ttl: number;
      type: "OPENPGPKEY";
      commentModifiedOn?: string;
      tagsModifiedOn?: string;
    };

export const CreateRecordResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    meta: Schema.Unknown,
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    proxiable: Schema.Boolean,
    commentModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("comment_modified_on"),
    ),
    tagsModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("tags_modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    comment: Schema.String,
    content: Schema.String,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    meta: Schema.Unknown,
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    name: Schema.String,
    proxiable: Schema.Boolean,
    proxied: Schema.Boolean,
    settings: Schema.Struct({
      ipv4Only: Schema.optional(Schema.Boolean).pipe(T.JsonName("ipv4_only")),
      ipv6Only: Schema.optional(Schema.Boolean).pipe(T.JsonName("ipv6_only")),
    }),
    tags: Schema.Array(Schema.String),
    ttl: Schema.Number,
    type: Schema.Literal("OPENPGPKEY"),
    commentModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("comment_modified_on"),
    ),
    tagsModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("tags_modified_on"),
    ),
  }),
) as unknown as Schema.Schema<CreateRecordResponse>;

export const createRecord: (
  input: CreateRecordRequest,
) => Effect.Effect<
  CreateRecordResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateRecordRequest,
  output: CreateRecordResponse,
  errors: [],
}));

export interface UpdateRecordRequest {
  dnsRecordId: string;
}

export const UpdateRecordRequest = Schema.Struct({
  dnsRecordId: Schema.String.pipe(T.HttpPath("dnsRecordId")),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/dns_records/{dnsRecordId}" }),
) as unknown as Schema.Schema<UpdateRecordRequest>;

export type UpdateRecordResponse =
  | {
      id: string;
      createdOn: string;
      meta: unknown;
      modifiedOn: string;
      proxiable: boolean;
      commentModifiedOn?: string;
      tagsModifiedOn?: string;
    }
  | {
      id: string;
      comment: string;
      content: string;
      createdOn: string;
      meta: unknown;
      modifiedOn: string;
      name: string;
      proxiable: boolean;
      proxied: boolean;
      settings: { ipv4Only?: boolean; ipv6Only?: boolean };
      tags: string[];
      ttl: number;
      type: "OPENPGPKEY";
      commentModifiedOn?: string;
      tagsModifiedOn?: string;
    };

export const UpdateRecordResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    meta: Schema.Unknown,
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    proxiable: Schema.Boolean,
    commentModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("comment_modified_on"),
    ),
    tagsModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("tags_modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    comment: Schema.String,
    content: Schema.String,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    meta: Schema.Unknown,
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    name: Schema.String,
    proxiable: Schema.Boolean,
    proxied: Schema.Boolean,
    settings: Schema.Struct({
      ipv4Only: Schema.optional(Schema.Boolean).pipe(T.JsonName("ipv4_only")),
      ipv6Only: Schema.optional(Schema.Boolean).pipe(T.JsonName("ipv6_only")),
    }),
    tags: Schema.Array(Schema.String),
    ttl: Schema.Number,
    type: Schema.Literal("OPENPGPKEY"),
    commentModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("comment_modified_on"),
    ),
    tagsModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("tags_modified_on"),
    ),
  }),
) as unknown as Schema.Schema<UpdateRecordResponse>;

export const updateRecord: (
  input: UpdateRecordRequest,
) => Effect.Effect<
  UpdateRecordResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateRecordRequest,
  output: UpdateRecordResponse,
  errors: [],
}));

export interface PatchRecordRequest {
  dnsRecordId: string;
}

export const PatchRecordRequest = Schema.Struct({
  dnsRecordId: Schema.String.pipe(T.HttpPath("dnsRecordId")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/zones/{zone_id}/dns_records/{dnsRecordId}",
  }),
) as unknown as Schema.Schema<PatchRecordRequest>;

export type PatchRecordResponse =
  | {
      id: string;
      createdOn: string;
      meta: unknown;
      modifiedOn: string;
      proxiable: boolean;
      commentModifiedOn?: string;
      tagsModifiedOn?: string;
    }
  | {
      id: string;
      comment: string;
      content: string;
      createdOn: string;
      meta: unknown;
      modifiedOn: string;
      name: string;
      proxiable: boolean;
      proxied: boolean;
      settings: { ipv4Only?: boolean; ipv6Only?: boolean };
      tags: string[];
      ttl: number;
      type: "OPENPGPKEY";
      commentModifiedOn?: string;
      tagsModifiedOn?: string;
    };

export const PatchRecordResponse = Schema.Union(
  Schema.Struct({
    id: Schema.String,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    meta: Schema.Unknown,
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    proxiable: Schema.Boolean,
    commentModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("comment_modified_on"),
    ),
    tagsModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("tags_modified_on"),
    ),
  }),
  Schema.Struct({
    id: Schema.String,
    comment: Schema.String,
    content: Schema.String,
    createdOn: Schema.String.pipe(T.JsonName("created_on")),
    meta: Schema.Unknown,
    modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
    name: Schema.String,
    proxiable: Schema.Boolean,
    proxied: Schema.Boolean,
    settings: Schema.Struct({
      ipv4Only: Schema.optional(Schema.Boolean).pipe(T.JsonName("ipv4_only")),
      ipv6Only: Schema.optional(Schema.Boolean).pipe(T.JsonName("ipv6_only")),
    }),
    tags: Schema.Array(Schema.String),
    ttl: Schema.Number,
    type: Schema.Literal("OPENPGPKEY"),
    commentModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("comment_modified_on"),
    ),
    tagsModifiedOn: Schema.optional(Schema.String).pipe(
      T.JsonName("tags_modified_on"),
    ),
  }),
) as unknown as Schema.Schema<PatchRecordResponse>;

export const patchRecord: (
  input: PatchRecordRequest,
) => Effect.Effect<
  PatchRecordResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchRecordRequest,
  output: PatchRecordResponse,
  errors: [],
}));

export interface DeleteRecordRequest {
  dnsRecordId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteRecordRequest = Schema.Struct({
  dnsRecordId: Schema.String.pipe(T.HttpPath("dnsRecordId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/dns_records/{dnsRecordId}",
  }),
) as unknown as Schema.Schema<DeleteRecordRequest>;

export interface DeleteRecordResponse {
  /** Identifier. */
  id?: string;
}

export const DeleteRecordResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteRecordResponse>;

export const deleteRecord: (
  input: DeleteRecordRequest,
) => Effect.Effect<
  DeleteRecordResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteRecordRequest,
  output: DeleteRecordResponse,
  errors: [],
}));

export interface BatchRecordRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: */
  deletes?: { id: string }[];
  /** Body param: */
  patches?: (
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "A";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "AAAA";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CNAME";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: {
          flattenCname?: boolean;
          ipv4Only?: boolean;
          ipv6Only?: boolean;
        };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "MX";
        comment?: string;
        content?: string;
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NS";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        id: string;
        comment: string;
        content: string;
        createdOn: string;
        meta: unknown;
        modifiedOn: string;
        name: string;
        proxiable: boolean;
        proxied: boolean;
        settings: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags: string[];
        ttl: number;
        type: "OPENPGPKEY";
        commentModifiedOn?: string;
        tagsModifiedOn?: string;
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "PTR";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TXT";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CAA";
        comment?: string;
        data?: { flags?: number; tag?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CERT";
        comment?: string;
        data?: {
          algorithm?: number;
          certificate?: string;
          keyTag?: number;
          type?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DNSKEY";
        comment?: string;
        data?: {
          algorithm?: number;
          flags?: number;
          protocol?: number;
          publicKey?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DS";
        comment?: string;
        data?: {
          algorithm?: number;
          digest?: string;
          digestType?: number;
          keyTag?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "HTTPS";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "LOC";
        comment?: string;
        data?: {
          altitude?: number;
          latDegrees?: number;
          latDirection?: "N" | "S";
          latMinutes?: number;
          latSeconds?: number;
          longDegrees?: number;
          longDirection?: "E" | "W";
          longMinutes?: number;
          longSeconds?: number;
          precisionHorz?: number;
          precisionVert?: number;
          size?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NAPTR";
        comment?: string;
        data?: {
          flags?: string;
          order?: number;
          preference?: number;
          regex?: string;
          replacement?: string;
          service?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SMIMEA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SRV";
        comment?: string;
        data?: {
          port?: number;
          priority?: number;
          target?: string;
          weight?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SSHFP";
        comment?: string;
        data?: { algorithm?: number; fingerprint?: string; type?: number };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SVCB";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TLSA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "URI";
        comment?: string;
        data?: { target?: string; weight?: number };
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
  )[];
  /** Body param: */
  posts?: (
    | {
        name: string;
        ttl: number;
        type: "A";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "AAAA";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "CNAME";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: {
          flattenCname?: boolean;
          ipv4Only?: boolean;
          ipv6Only?: boolean;
        };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "MX";
        comment?: string;
        content?: string;
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "NS";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "OPENPGPKEY";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "PTR";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "TXT";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "CAA";
        comment?: string;
        data?: { flags?: number; tag?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "CERT";
        comment?: string;
        data?: {
          algorithm?: number;
          certificate?: string;
          keyTag?: number;
          type?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "DNSKEY";
        comment?: string;
        data?: {
          algorithm?: number;
          flags?: number;
          protocol?: number;
          publicKey?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "DS";
        comment?: string;
        data?: {
          algorithm?: number;
          digest?: string;
          digestType?: number;
          keyTag?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "HTTPS";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "LOC";
        comment?: string;
        data?: {
          altitude?: number;
          latDegrees?: number;
          latDirection?: "N" | "S";
          latMinutes?: number;
          latSeconds?: number;
          longDegrees?: number;
          longDirection?: "E" | "W";
          longMinutes?: number;
          longSeconds?: number;
          precisionHorz?: number;
          precisionVert?: number;
          size?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "NAPTR";
        comment?: string;
        data?: {
          flags?: string;
          order?: number;
          preference?: number;
          regex?: string;
          replacement?: string;
          service?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "SMIMEA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "SRV";
        comment?: string;
        data?: {
          port?: number;
          priority?: number;
          target?: string;
          weight?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "SSHFP";
        comment?: string;
        data?: { algorithm?: number; fingerprint?: string; type?: number };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "SVCB";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "TLSA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "URI";
        comment?: string;
        data?: { target?: string; weight?: number };
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
  )[];
  /** Body param: */
  puts?: (
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "A";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "AAAA";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CNAME";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: {
          flattenCname?: boolean;
          ipv4Only?: boolean;
          ipv6Only?: boolean;
        };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "MX";
        comment?: string;
        content?: string;
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NS";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        id: string;
        comment: string;
        content: string;
        createdOn: string;
        meta: unknown;
        modifiedOn: string;
        name: string;
        proxiable: boolean;
        proxied: boolean;
        settings: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags: string[];
        ttl: number;
        type: "OPENPGPKEY";
        commentModifiedOn?: string;
        tagsModifiedOn?: string;
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "PTR";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TXT";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CAA";
        comment?: string;
        data?: { flags?: number; tag?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CERT";
        comment?: string;
        data?: {
          algorithm?: number;
          certificate?: string;
          keyTag?: number;
          type?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DNSKEY";
        comment?: string;
        data?: {
          algorithm?: number;
          flags?: number;
          protocol?: number;
          publicKey?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DS";
        comment?: string;
        data?: {
          algorithm?: number;
          digest?: string;
          digestType?: number;
          keyTag?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "HTTPS";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "LOC";
        comment?: string;
        data?: {
          altitude?: number;
          latDegrees?: number;
          latDirection?: "N" | "S";
          latMinutes?: number;
          latSeconds?: number;
          longDegrees?: number;
          longDirection?: "E" | "W";
          longMinutes?: number;
          longSeconds?: number;
          precisionHorz?: number;
          precisionVert?: number;
          size?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NAPTR";
        comment?: string;
        data?: {
          flags?: string;
          order?: number;
          preference?: number;
          regex?: string;
          replacement?: string;
          service?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SMIMEA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SRV";
        comment?: string;
        data?: {
          port?: number;
          priority?: number;
          target?: string;
          weight?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SSHFP";
        comment?: string;
        data?: { algorithm?: number; fingerprint?: string; type?: number };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SVCB";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TLSA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "URI";
        comment?: string;
        data?: { target?: string; weight?: number };
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
  )[];
}

export const BatchRecordRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  deletes: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
      }),
    ),
  ),
  patches: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("A"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("AAAA"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CNAME"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              flattenCname: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("flatten_cname"),
              ),
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("MX"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NS"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          id: Schema.String,
          comment: Schema.String,
          content: Schema.String,
          createdOn: Schema.String.pipe(T.JsonName("created_on")),
          meta: Schema.Unknown,
          modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
          name: Schema.String,
          proxiable: Schema.Boolean,
          proxied: Schema.Boolean,
          settings: Schema.Struct({
            ipv4Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv4_only"),
            ),
            ipv6Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv6_only"),
            ),
          }),
          tags: Schema.Array(Schema.String),
          ttl: Schema.Number,
          type: Schema.Literal("OPENPGPKEY"),
          commentModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("comment_modified_on"),
          ),
          tagsModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("tags_modified_on"),
          ),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("PTR"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TXT"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CAA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.Number),
              tag: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CERT"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              certificate: Schema.optional(Schema.String),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DNSKEY"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              flags: Schema.optional(Schema.Number),
              protocol: Schema.optional(Schema.Number),
              publicKey: Schema.optional(Schema.String).pipe(
                T.JsonName("public_key"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              digest: Schema.optional(Schema.String),
              digestType: Schema.optional(Schema.Number).pipe(
                T.JsonName("digest_type"),
              ),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("HTTPS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("LOC"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              altitude: Schema.optional(Schema.Number),
              latDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_degrees"),
              ),
              latDirection: Schema.optional(Schema.Literal("N", "S")).pipe(
                T.JsonName("lat_direction"),
              ),
              latMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_minutes"),
              ),
              latSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_seconds"),
              ),
              longDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_degrees"),
              ),
              longDirection: Schema.optional(Schema.Literal("E", "W")).pipe(
                T.JsonName("long_direction"),
              ),
              longMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_minutes"),
              ),
              longSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_seconds"),
              ),
              precisionHorz: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_horz"),
              ),
              precisionVert: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_vert"),
              ),
              size: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NAPTR"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.String),
              order: Schema.optional(Schema.Number),
              preference: Schema.optional(Schema.Number),
              regex: Schema.optional(Schema.String),
              replacement: Schema.optional(Schema.String),
              service: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SMIMEA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SRV"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              port: Schema.optional(Schema.Number),
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SSHFP"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              fingerprint: Schema.optional(Schema.String),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SVCB"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TLSA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("URI"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
      ),
    ),
  ),
  posts: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("A"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("AAAA"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CNAME"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              flattenCname: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("flatten_cname"),
              ),
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("MX"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NS"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("OPENPGPKEY"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("PTR"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TXT"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CAA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.Number),
              tag: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CERT"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              certificate: Schema.optional(Schema.String),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DNSKEY"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              flags: Schema.optional(Schema.Number),
              protocol: Schema.optional(Schema.Number),
              publicKey: Schema.optional(Schema.String).pipe(
                T.JsonName("public_key"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              digest: Schema.optional(Schema.String),
              digestType: Schema.optional(Schema.Number).pipe(
                T.JsonName("digest_type"),
              ),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("HTTPS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("LOC"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              altitude: Schema.optional(Schema.Number),
              latDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_degrees"),
              ),
              latDirection: Schema.optional(Schema.Literal("N", "S")).pipe(
                T.JsonName("lat_direction"),
              ),
              latMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_minutes"),
              ),
              latSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_seconds"),
              ),
              longDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_degrees"),
              ),
              longDirection: Schema.optional(Schema.Literal("E", "W")).pipe(
                T.JsonName("long_direction"),
              ),
              longMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_minutes"),
              ),
              longSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_seconds"),
              ),
              precisionHorz: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_horz"),
              ),
              precisionVert: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_vert"),
              ),
              size: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NAPTR"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.String),
              order: Schema.optional(Schema.Number),
              preference: Schema.optional(Schema.Number),
              regex: Schema.optional(Schema.String),
              replacement: Schema.optional(Schema.String),
              service: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SMIMEA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SRV"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              port: Schema.optional(Schema.Number),
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SSHFP"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              fingerprint: Schema.optional(Schema.String),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SVCB"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TLSA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("URI"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
      ),
    ),
  ),
  puts: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("A"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("AAAA"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CNAME"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              flattenCname: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("flatten_cname"),
              ),
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("MX"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NS"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          id: Schema.String,
          comment: Schema.String,
          content: Schema.String,
          createdOn: Schema.String.pipe(T.JsonName("created_on")),
          meta: Schema.Unknown,
          modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
          name: Schema.String,
          proxiable: Schema.Boolean,
          proxied: Schema.Boolean,
          settings: Schema.Struct({
            ipv4Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv4_only"),
            ),
            ipv6Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv6_only"),
            ),
          }),
          tags: Schema.Array(Schema.String),
          ttl: Schema.Number,
          type: Schema.Literal("OPENPGPKEY"),
          commentModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("comment_modified_on"),
          ),
          tagsModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("tags_modified_on"),
          ),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("PTR"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TXT"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CAA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.Number),
              tag: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CERT"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              certificate: Schema.optional(Schema.String),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DNSKEY"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              flags: Schema.optional(Schema.Number),
              protocol: Schema.optional(Schema.Number),
              publicKey: Schema.optional(Schema.String).pipe(
                T.JsonName("public_key"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              digest: Schema.optional(Schema.String),
              digestType: Schema.optional(Schema.Number).pipe(
                T.JsonName("digest_type"),
              ),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("HTTPS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("LOC"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              altitude: Schema.optional(Schema.Number),
              latDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_degrees"),
              ),
              latDirection: Schema.optional(Schema.Literal("N", "S")).pipe(
                T.JsonName("lat_direction"),
              ),
              latMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_minutes"),
              ),
              latSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_seconds"),
              ),
              longDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_degrees"),
              ),
              longDirection: Schema.optional(Schema.Literal("E", "W")).pipe(
                T.JsonName("long_direction"),
              ),
              longMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_minutes"),
              ),
              longSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_seconds"),
              ),
              precisionHorz: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_horz"),
              ),
              precisionVert: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_vert"),
              ),
              size: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NAPTR"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.String),
              order: Schema.optional(Schema.Number),
              preference: Schema.optional(Schema.Number),
              regex: Schema.optional(Schema.String),
              replacement: Schema.optional(Schema.String),
              service: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SMIMEA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SRV"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              port: Schema.optional(Schema.Number),
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SSHFP"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              fingerprint: Schema.optional(Schema.String),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SVCB"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TLSA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("URI"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
      ),
    ),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/dns_records/batch" }),
) as unknown as Schema.Schema<BatchRecordRequest>;

export interface BatchRecordResponse {
  deletes?: (
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "A";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "AAAA";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CNAME";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: {
          flattenCname?: boolean;
          ipv4Only?: boolean;
          ipv6Only?: boolean;
        };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "MX";
        comment?: string;
        content?: string;
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NS";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        id: string;
        comment: string;
        content: string;
        createdOn: string;
        meta: unknown;
        modifiedOn: string;
        name: string;
        proxiable: boolean;
        proxied: boolean;
        settings: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags: string[];
        ttl: number;
        type: "OPENPGPKEY";
        commentModifiedOn?: string;
        tagsModifiedOn?: string;
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "PTR";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TXT";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CAA";
        comment?: string;
        data?: { flags?: number; tag?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CERT";
        comment?: string;
        data?: {
          algorithm?: number;
          certificate?: string;
          keyTag?: number;
          type?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DNSKEY";
        comment?: string;
        data?: {
          algorithm?: number;
          flags?: number;
          protocol?: number;
          publicKey?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DS";
        comment?: string;
        data?: {
          algorithm?: number;
          digest?: string;
          digestType?: number;
          keyTag?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "HTTPS";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "LOC";
        comment?: string;
        data?: {
          altitude?: number;
          latDegrees?: number;
          latDirection?: "N" | "S";
          latMinutes?: number;
          latSeconds?: number;
          longDegrees?: number;
          longDirection?: "E" | "W";
          longMinutes?: number;
          longSeconds?: number;
          precisionHorz?: number;
          precisionVert?: number;
          size?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NAPTR";
        comment?: string;
        data?: {
          flags?: string;
          order?: number;
          preference?: number;
          regex?: string;
          replacement?: string;
          service?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SMIMEA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SRV";
        comment?: string;
        data?: {
          port?: number;
          priority?: number;
          target?: string;
          weight?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SSHFP";
        comment?: string;
        data?: { algorithm?: number; fingerprint?: string; type?: number };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SVCB";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TLSA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "URI";
        comment?: string;
        data?: { target?: string; weight?: number };
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
  )[];
  patches?: (
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "A";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "AAAA";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CNAME";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: {
          flattenCname?: boolean;
          ipv4Only?: boolean;
          ipv6Only?: boolean;
        };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "MX";
        comment?: string;
        content?: string;
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NS";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        id: string;
        comment: string;
        content: string;
        createdOn: string;
        meta: unknown;
        modifiedOn: string;
        name: string;
        proxiable: boolean;
        proxied: boolean;
        settings: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags: string[];
        ttl: number;
        type: "OPENPGPKEY";
        commentModifiedOn?: string;
        tagsModifiedOn?: string;
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "PTR";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TXT";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CAA";
        comment?: string;
        data?: { flags?: number; tag?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CERT";
        comment?: string;
        data?: {
          algorithm?: number;
          certificate?: string;
          keyTag?: number;
          type?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DNSKEY";
        comment?: string;
        data?: {
          algorithm?: number;
          flags?: number;
          protocol?: number;
          publicKey?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DS";
        comment?: string;
        data?: {
          algorithm?: number;
          digest?: string;
          digestType?: number;
          keyTag?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "HTTPS";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "LOC";
        comment?: string;
        data?: {
          altitude?: number;
          latDegrees?: number;
          latDirection?: "N" | "S";
          latMinutes?: number;
          latSeconds?: number;
          longDegrees?: number;
          longDirection?: "E" | "W";
          longMinutes?: number;
          longSeconds?: number;
          precisionHorz?: number;
          precisionVert?: number;
          size?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NAPTR";
        comment?: string;
        data?: {
          flags?: string;
          order?: number;
          preference?: number;
          regex?: string;
          replacement?: string;
          service?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SMIMEA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SRV";
        comment?: string;
        data?: {
          port?: number;
          priority?: number;
          target?: string;
          weight?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SSHFP";
        comment?: string;
        data?: { algorithm?: number; fingerprint?: string; type?: number };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SVCB";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TLSA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "URI";
        comment?: string;
        data?: { target?: string; weight?: number };
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
  )[];
  posts?: (
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "A";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "AAAA";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CNAME";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: {
          flattenCname?: boolean;
          ipv4Only?: boolean;
          ipv6Only?: boolean;
        };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "MX";
        comment?: string;
        content?: string;
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NS";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        id: string;
        comment: string;
        content: string;
        createdOn: string;
        meta: unknown;
        modifiedOn: string;
        name: string;
        proxiable: boolean;
        proxied: boolean;
        settings: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags: string[];
        ttl: number;
        type: "OPENPGPKEY";
        commentModifiedOn?: string;
        tagsModifiedOn?: string;
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "PTR";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TXT";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CAA";
        comment?: string;
        data?: { flags?: number; tag?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CERT";
        comment?: string;
        data?: {
          algorithm?: number;
          certificate?: string;
          keyTag?: number;
          type?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DNSKEY";
        comment?: string;
        data?: {
          algorithm?: number;
          flags?: number;
          protocol?: number;
          publicKey?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DS";
        comment?: string;
        data?: {
          algorithm?: number;
          digest?: string;
          digestType?: number;
          keyTag?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "HTTPS";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "LOC";
        comment?: string;
        data?: {
          altitude?: number;
          latDegrees?: number;
          latDirection?: "N" | "S";
          latMinutes?: number;
          latSeconds?: number;
          longDegrees?: number;
          longDirection?: "E" | "W";
          longMinutes?: number;
          longSeconds?: number;
          precisionHorz?: number;
          precisionVert?: number;
          size?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NAPTR";
        comment?: string;
        data?: {
          flags?: string;
          order?: number;
          preference?: number;
          regex?: string;
          replacement?: string;
          service?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SMIMEA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SRV";
        comment?: string;
        data?: {
          port?: number;
          priority?: number;
          target?: string;
          weight?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SSHFP";
        comment?: string;
        data?: { algorithm?: number; fingerprint?: string; type?: number };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SVCB";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TLSA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "URI";
        comment?: string;
        data?: { target?: string; weight?: number };
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
  )[];
  puts?: (
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "A";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "AAAA";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CNAME";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: {
          flattenCname?: boolean;
          ipv4Only?: boolean;
          ipv6Only?: boolean;
        };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "MX";
        comment?: string;
        content?: string;
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NS";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        id: string;
        comment: string;
        content: string;
        createdOn: string;
        meta: unknown;
        modifiedOn: string;
        name: string;
        proxiable: boolean;
        proxied: boolean;
        settings: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags: string[];
        ttl: number;
        type: "OPENPGPKEY";
        commentModifiedOn?: string;
        tagsModifiedOn?: string;
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "PTR";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TXT";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CAA";
        comment?: string;
        data?: { flags?: number; tag?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CERT";
        comment?: string;
        data?: {
          algorithm?: number;
          certificate?: string;
          keyTag?: number;
          type?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DNSKEY";
        comment?: string;
        data?: {
          algorithm?: number;
          flags?: number;
          protocol?: number;
          publicKey?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DS";
        comment?: string;
        data?: {
          algorithm?: number;
          digest?: string;
          digestType?: number;
          keyTag?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "HTTPS";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "LOC";
        comment?: string;
        data?: {
          altitude?: number;
          latDegrees?: number;
          latDirection?: "N" | "S";
          latMinutes?: number;
          latSeconds?: number;
          longDegrees?: number;
          longDirection?: "E" | "W";
          longMinutes?: number;
          longSeconds?: number;
          precisionHorz?: number;
          precisionVert?: number;
          size?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NAPTR";
        comment?: string;
        data?: {
          flags?: string;
          order?: number;
          preference?: number;
          regex?: string;
          replacement?: string;
          service?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SMIMEA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SRV";
        comment?: string;
        data?: {
          port?: number;
          priority?: number;
          target?: string;
          weight?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SSHFP";
        comment?: string;
        data?: { algorithm?: number; fingerprint?: string; type?: number };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SVCB";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TLSA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "URI";
        comment?: string;
        data?: { target?: string; weight?: number };
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
  )[];
}

export const BatchRecordResponse = Schema.Struct({
  deletes: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("A"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("AAAA"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CNAME"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              flattenCname: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("flatten_cname"),
              ),
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("MX"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NS"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          id: Schema.String,
          comment: Schema.String,
          content: Schema.String,
          createdOn: Schema.String.pipe(T.JsonName("created_on")),
          meta: Schema.Unknown,
          modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
          name: Schema.String,
          proxiable: Schema.Boolean,
          proxied: Schema.Boolean,
          settings: Schema.Struct({
            ipv4Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv4_only"),
            ),
            ipv6Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv6_only"),
            ),
          }),
          tags: Schema.Array(Schema.String),
          ttl: Schema.Number,
          type: Schema.Literal("OPENPGPKEY"),
          commentModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("comment_modified_on"),
          ),
          tagsModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("tags_modified_on"),
          ),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("PTR"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TXT"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CAA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.Number),
              tag: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CERT"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              certificate: Schema.optional(Schema.String),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DNSKEY"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              flags: Schema.optional(Schema.Number),
              protocol: Schema.optional(Schema.Number),
              publicKey: Schema.optional(Schema.String).pipe(
                T.JsonName("public_key"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              digest: Schema.optional(Schema.String),
              digestType: Schema.optional(Schema.Number).pipe(
                T.JsonName("digest_type"),
              ),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("HTTPS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("LOC"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              altitude: Schema.optional(Schema.Number),
              latDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_degrees"),
              ),
              latDirection: Schema.optional(Schema.Literal("N", "S")).pipe(
                T.JsonName("lat_direction"),
              ),
              latMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_minutes"),
              ),
              latSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_seconds"),
              ),
              longDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_degrees"),
              ),
              longDirection: Schema.optional(Schema.Literal("E", "W")).pipe(
                T.JsonName("long_direction"),
              ),
              longMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_minutes"),
              ),
              longSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_seconds"),
              ),
              precisionHorz: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_horz"),
              ),
              precisionVert: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_vert"),
              ),
              size: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NAPTR"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.String),
              order: Schema.optional(Schema.Number),
              preference: Schema.optional(Schema.Number),
              regex: Schema.optional(Schema.String),
              replacement: Schema.optional(Schema.String),
              service: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SMIMEA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SRV"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              port: Schema.optional(Schema.Number),
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SSHFP"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              fingerprint: Schema.optional(Schema.String),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SVCB"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TLSA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("URI"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
      ),
    ),
  ),
  patches: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("A"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("AAAA"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CNAME"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              flattenCname: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("flatten_cname"),
              ),
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("MX"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NS"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          id: Schema.String,
          comment: Schema.String,
          content: Schema.String,
          createdOn: Schema.String.pipe(T.JsonName("created_on")),
          meta: Schema.Unknown,
          modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
          name: Schema.String,
          proxiable: Schema.Boolean,
          proxied: Schema.Boolean,
          settings: Schema.Struct({
            ipv4Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv4_only"),
            ),
            ipv6Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv6_only"),
            ),
          }),
          tags: Schema.Array(Schema.String),
          ttl: Schema.Number,
          type: Schema.Literal("OPENPGPKEY"),
          commentModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("comment_modified_on"),
          ),
          tagsModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("tags_modified_on"),
          ),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("PTR"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TXT"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CAA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.Number),
              tag: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CERT"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              certificate: Schema.optional(Schema.String),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DNSKEY"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              flags: Schema.optional(Schema.Number),
              protocol: Schema.optional(Schema.Number),
              publicKey: Schema.optional(Schema.String).pipe(
                T.JsonName("public_key"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              digest: Schema.optional(Schema.String),
              digestType: Schema.optional(Schema.Number).pipe(
                T.JsonName("digest_type"),
              ),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("HTTPS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("LOC"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              altitude: Schema.optional(Schema.Number),
              latDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_degrees"),
              ),
              latDirection: Schema.optional(Schema.Literal("N", "S")).pipe(
                T.JsonName("lat_direction"),
              ),
              latMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_minutes"),
              ),
              latSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_seconds"),
              ),
              longDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_degrees"),
              ),
              longDirection: Schema.optional(Schema.Literal("E", "W")).pipe(
                T.JsonName("long_direction"),
              ),
              longMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_minutes"),
              ),
              longSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_seconds"),
              ),
              precisionHorz: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_horz"),
              ),
              precisionVert: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_vert"),
              ),
              size: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NAPTR"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.String),
              order: Schema.optional(Schema.Number),
              preference: Schema.optional(Schema.Number),
              regex: Schema.optional(Schema.String),
              replacement: Schema.optional(Schema.String),
              service: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SMIMEA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SRV"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              port: Schema.optional(Schema.Number),
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SSHFP"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              fingerprint: Schema.optional(Schema.String),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SVCB"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TLSA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("URI"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
      ),
    ),
  ),
  posts: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("A"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("AAAA"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CNAME"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              flattenCname: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("flatten_cname"),
              ),
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("MX"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NS"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          id: Schema.String,
          comment: Schema.String,
          content: Schema.String,
          createdOn: Schema.String.pipe(T.JsonName("created_on")),
          meta: Schema.Unknown,
          modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
          name: Schema.String,
          proxiable: Schema.Boolean,
          proxied: Schema.Boolean,
          settings: Schema.Struct({
            ipv4Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv4_only"),
            ),
            ipv6Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv6_only"),
            ),
          }),
          tags: Schema.Array(Schema.String),
          ttl: Schema.Number,
          type: Schema.Literal("OPENPGPKEY"),
          commentModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("comment_modified_on"),
          ),
          tagsModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("tags_modified_on"),
          ),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("PTR"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TXT"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CAA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.Number),
              tag: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CERT"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              certificate: Schema.optional(Schema.String),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DNSKEY"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              flags: Schema.optional(Schema.Number),
              protocol: Schema.optional(Schema.Number),
              publicKey: Schema.optional(Schema.String).pipe(
                T.JsonName("public_key"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              digest: Schema.optional(Schema.String),
              digestType: Schema.optional(Schema.Number).pipe(
                T.JsonName("digest_type"),
              ),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("HTTPS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("LOC"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              altitude: Schema.optional(Schema.Number),
              latDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_degrees"),
              ),
              latDirection: Schema.optional(Schema.Literal("N", "S")).pipe(
                T.JsonName("lat_direction"),
              ),
              latMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_minutes"),
              ),
              latSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_seconds"),
              ),
              longDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_degrees"),
              ),
              longDirection: Schema.optional(Schema.Literal("E", "W")).pipe(
                T.JsonName("long_direction"),
              ),
              longMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_minutes"),
              ),
              longSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_seconds"),
              ),
              precisionHorz: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_horz"),
              ),
              precisionVert: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_vert"),
              ),
              size: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NAPTR"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.String),
              order: Schema.optional(Schema.Number),
              preference: Schema.optional(Schema.Number),
              regex: Schema.optional(Schema.String),
              replacement: Schema.optional(Schema.String),
              service: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SMIMEA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SRV"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              port: Schema.optional(Schema.Number),
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SSHFP"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              fingerprint: Schema.optional(Schema.String),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SVCB"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TLSA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("URI"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
      ),
    ),
  ),
  puts: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("A"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("AAAA"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CNAME"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              flattenCname: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("flatten_cname"),
              ),
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("MX"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NS"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          id: Schema.String,
          comment: Schema.String,
          content: Schema.String,
          createdOn: Schema.String.pipe(T.JsonName("created_on")),
          meta: Schema.Unknown,
          modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
          name: Schema.String,
          proxiable: Schema.Boolean,
          proxied: Schema.Boolean,
          settings: Schema.Struct({
            ipv4Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv4_only"),
            ),
            ipv6Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv6_only"),
            ),
          }),
          tags: Schema.Array(Schema.String),
          ttl: Schema.Number,
          type: Schema.Literal("OPENPGPKEY"),
          commentModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("comment_modified_on"),
          ),
          tagsModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("tags_modified_on"),
          ),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("PTR"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TXT"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CAA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.Number),
              tag: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CERT"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              certificate: Schema.optional(Schema.String),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DNSKEY"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              flags: Schema.optional(Schema.Number),
              protocol: Schema.optional(Schema.Number),
              publicKey: Schema.optional(Schema.String).pipe(
                T.JsonName("public_key"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              digest: Schema.optional(Schema.String),
              digestType: Schema.optional(Schema.Number).pipe(
                T.JsonName("digest_type"),
              ),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("HTTPS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("LOC"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              altitude: Schema.optional(Schema.Number),
              latDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_degrees"),
              ),
              latDirection: Schema.optional(Schema.Literal("N", "S")).pipe(
                T.JsonName("lat_direction"),
              ),
              latMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_minutes"),
              ),
              latSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_seconds"),
              ),
              longDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_degrees"),
              ),
              longDirection: Schema.optional(Schema.Literal("E", "W")).pipe(
                T.JsonName("long_direction"),
              ),
              longMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_minutes"),
              ),
              longSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_seconds"),
              ),
              precisionHorz: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_horz"),
              ),
              precisionVert: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_vert"),
              ),
              size: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NAPTR"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.String),
              order: Schema.optional(Schema.Number),
              preference: Schema.optional(Schema.Number),
              regex: Schema.optional(Schema.String),
              replacement: Schema.optional(Schema.String),
              service: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SMIMEA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SRV"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              port: Schema.optional(Schema.Number),
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SSHFP"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              fingerprint: Schema.optional(Schema.String),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SVCB"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TLSA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("URI"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
      ),
    ),
  ),
}) as unknown as Schema.Schema<BatchRecordResponse>;

export const batchRecord: (
  input: BatchRecordRequest,
) => Effect.Effect<
  BatchRecordResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: BatchRecordRequest,
  output: BatchRecordResponse,
  errors: [],
}));

export interface ExportRecordRequest {
  /** Identifier. */
  zoneId: string;
}

export const ExportRecordRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/dns_records/export" }),
) as unknown as Schema.Schema<ExportRecordRequest>;

export type ExportRecordResponse = unknown;

export const ExportRecordResponse =
  Schema.Unknown as unknown as Schema.Schema<ExportRecordResponse>;

export const exportRecord: (
  input: ExportRecordRequest,
) => Effect.Effect<
  ExportRecordResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ExportRecordRequest,
  output: ExportRecordResponse,
  errors: [],
}));

export interface ImportRecordRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: BIND config to import.    Tip:  When using cURL, a file can be uploaded using `--form 'file=@bind_config.txt'`. */
  file: string;
  /** Body param: Whether or not proxiable records should receive the performance and security benefits of Cloudflare.  The value should be either `true` or `false`. */
  proxied?: string;
}

export const ImportRecordRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  file: Schema.String,
  proxied: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/dns_records/import" }),
) as unknown as Schema.Schema<ImportRecordRequest>;

export interface ImportRecordResponse {
  /** Number of DNS records added. */
  recsAdded?: number;
  /** Total number of DNS records parsed. */
  totalRecordsParsed?: number;
}

export const ImportRecordResponse = Schema.Struct({
  recsAdded: Schema.optional(Schema.Number).pipe(T.JsonName("recs_added")),
  totalRecordsParsed: Schema.optional(Schema.Number).pipe(
    T.JsonName("total_records_parsed"),
  ),
}) as unknown as Schema.Schema<ImportRecordResponse>;

export const importRecord: (
  input: ImportRecordRequest,
) => Effect.Effect<
  ImportRecordResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ImportRecordRequest,
  output: ImportRecordResponse,
  errors: [],
}));

export interface ScanRecordRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: */
  body: unknown;
}

export const ScanRecordRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/dns_records/scan" }),
) as unknown as Schema.Schema<ScanRecordRequest>;

export interface ScanRecordResponse {
  /** Number of DNS records added. */
  recsAdded?: number;
  /** Total number of DNS records parsed. */
  totalRecordsParsed?: number;
}

export const ScanRecordResponse = Schema.Struct({
  recsAdded: Schema.optional(Schema.Number).pipe(T.JsonName("recs_added")),
  totalRecordsParsed: Schema.optional(Schema.Number).pipe(
    T.JsonName("total_records_parsed"),
  ),
}) as unknown as Schema.Schema<ScanRecordResponse>;

export const scanRecord: (
  input: ScanRecordRequest,
) => Effect.Effect<
  ScanRecordResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ScanRecordRequest,
  output: ScanRecordResponse,
  errors: [],
}));

// =============================================================================
// ReviewRecord
// =============================================================================

export interface ScanReviewRecordRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: */
  accepts?: (
    | {
        name: string;
        ttl: number;
        type: "A";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "AAAA";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "CNAME";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: {
          flattenCname?: boolean;
          ipv4Only?: boolean;
          ipv6Only?: boolean;
        };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "MX";
        comment?: string;
        content?: string;
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "NS";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "OPENPGPKEY";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "PTR";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "TXT";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "CAA";
        comment?: string;
        data?: { flags?: number; tag?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "CERT";
        comment?: string;
        data?: {
          algorithm?: number;
          certificate?: string;
          keyTag?: number;
          type?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "DNSKEY";
        comment?: string;
        data?: {
          algorithm?: number;
          flags?: number;
          protocol?: number;
          publicKey?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "DS";
        comment?: string;
        data?: {
          algorithm?: number;
          digest?: string;
          digestType?: number;
          keyTag?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "HTTPS";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "LOC";
        comment?: string;
        data?: {
          altitude?: number;
          latDegrees?: number;
          latDirection?: "N" | "S";
          latMinutes?: number;
          latSeconds?: number;
          longDegrees?: number;
          longDirection?: "E" | "W";
          longMinutes?: number;
          longSeconds?: number;
          precisionHorz?: number;
          precisionVert?: number;
          size?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "NAPTR";
        comment?: string;
        data?: {
          flags?: string;
          order?: number;
          preference?: number;
          regex?: string;
          replacement?: string;
          service?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "SMIMEA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "SRV";
        comment?: string;
        data?: {
          port?: number;
          priority?: number;
          target?: string;
          weight?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "SSHFP";
        comment?: string;
        data?: { algorithm?: number; fingerprint?: string; type?: number };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "SVCB";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "TLSA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        name: string;
        ttl: number;
        type: "URI";
        comment?: string;
        data?: { target?: string; weight?: number };
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
  )[];
  /** Body param: */
  rejects?: { id: string }[];
}

export const ScanReviewRecordRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  accepts: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("A"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("AAAA"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CNAME"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              flattenCname: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("flatten_cname"),
              ),
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("MX"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NS"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("OPENPGPKEY"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("PTR"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TXT"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CAA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.Number),
              tag: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CERT"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              certificate: Schema.optional(Schema.String),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DNSKEY"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              flags: Schema.optional(Schema.Number),
              protocol: Schema.optional(Schema.Number),
              publicKey: Schema.optional(Schema.String).pipe(
                T.JsonName("public_key"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              digest: Schema.optional(Schema.String),
              digestType: Schema.optional(Schema.Number).pipe(
                T.JsonName("digest_type"),
              ),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("HTTPS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("LOC"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              altitude: Schema.optional(Schema.Number),
              latDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_degrees"),
              ),
              latDirection: Schema.optional(Schema.Literal("N", "S")).pipe(
                T.JsonName("lat_direction"),
              ),
              latMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_minutes"),
              ),
              latSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_seconds"),
              ),
              longDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_degrees"),
              ),
              longDirection: Schema.optional(Schema.Literal("E", "W")).pipe(
                T.JsonName("long_direction"),
              ),
              longMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_minutes"),
              ),
              longSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_seconds"),
              ),
              precisionHorz: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_horz"),
              ),
              precisionVert: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_vert"),
              ),
              size: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NAPTR"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.String),
              order: Schema.optional(Schema.Number),
              preference: Schema.optional(Schema.Number),
              regex: Schema.optional(Schema.String),
              replacement: Schema.optional(Schema.String),
              service: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SMIMEA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SRV"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              port: Schema.optional(Schema.Number),
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SSHFP"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              fingerprint: Schema.optional(Schema.String),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SVCB"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TLSA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("URI"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
      ),
    ),
  ),
  rejects: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
      }),
    ),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/dns_records/scan/review" }),
) as unknown as Schema.Schema<ScanReviewRecordRequest>;

export interface ScanReviewRecordResponse {
  accepts?: (
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "A";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "AAAA";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CNAME";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: {
          flattenCname?: boolean;
          ipv4Only?: boolean;
          ipv6Only?: boolean;
        };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "MX";
        comment?: string;
        content?: string;
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NS";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        id: string;
        comment: string;
        content: string;
        createdOn: string;
        meta: unknown;
        modifiedOn: string;
        name: string;
        proxiable: boolean;
        proxied: boolean;
        settings: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags: string[];
        ttl: number;
        type: "OPENPGPKEY";
        commentModifiedOn?: string;
        tagsModifiedOn?: string;
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "PTR";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TXT";
        comment?: string;
        content?: string;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CAA";
        comment?: string;
        data?: { flags?: number; tag?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "CERT";
        comment?: string;
        data?: {
          algorithm?: number;
          certificate?: string;
          keyTag?: number;
          type?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DNSKEY";
        comment?: string;
        data?: {
          algorithm?: number;
          flags?: number;
          protocol?: number;
          publicKey?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "DS";
        comment?: string;
        data?: {
          algorithm?: number;
          digest?: string;
          digestType?: number;
          keyTag?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "HTTPS";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "LOC";
        comment?: string;
        data?: {
          altitude?: number;
          latDegrees?: number;
          latDirection?: "N" | "S";
          latMinutes?: number;
          latSeconds?: number;
          longDegrees?: number;
          longDirection?: "E" | "W";
          longMinutes?: number;
          longSeconds?: number;
          precisionHorz?: number;
          precisionVert?: number;
          size?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "NAPTR";
        comment?: string;
        data?: {
          flags?: string;
          order?: number;
          preference?: number;
          regex?: string;
          replacement?: string;
          service?: string;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SMIMEA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SRV";
        comment?: string;
        data?: {
          port?: number;
          priority?: number;
          target?: string;
          weight?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SSHFP";
        comment?: string;
        data?: { algorithm?: number; fingerprint?: string; type?: number };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "SVCB";
        comment?: string;
        data?: { priority?: number; target?: string; value?: string };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "TLSA";
        comment?: string;
        data?: {
          certificate?: string;
          matchingType?: number;
          selector?: number;
          usage?: number;
        };
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
    | {
        zoneId: string;
        name: string;
        ttl: number;
        type: "URI";
        comment?: string;
        data?: { target?: string; weight?: number };
        priority?: number;
        proxied?: boolean;
        settings?: { ipv4Only?: boolean; ipv6Only?: boolean };
        tags?: string[];
      }
  )[];
  rejects?: string[];
}

export const ScanReviewRecordResponse = Schema.Struct({
  accepts: Schema.optional(
    Schema.Array(
      Schema.Union(
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("A"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("AAAA"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CNAME"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              flattenCname: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("flatten_cname"),
              ),
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("MX"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NS"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          id: Schema.String,
          comment: Schema.String,
          content: Schema.String,
          createdOn: Schema.String.pipe(T.JsonName("created_on")),
          meta: Schema.Unknown,
          modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
          name: Schema.String,
          proxiable: Schema.Boolean,
          proxied: Schema.Boolean,
          settings: Schema.Struct({
            ipv4Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv4_only"),
            ),
            ipv6Only: Schema.optional(Schema.Boolean).pipe(
              T.JsonName("ipv6_only"),
            ),
          }),
          tags: Schema.Array(Schema.String),
          ttl: Schema.Number,
          type: Schema.Literal("OPENPGPKEY"),
          commentModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("comment_modified_on"),
          ),
          tagsModifiedOn: Schema.optional(Schema.String).pipe(
            T.JsonName("tags_modified_on"),
          ),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("PTR"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TXT"),
          comment: Schema.optional(Schema.String),
          content: Schema.optional(Schema.String),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CAA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.Number),
              tag: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("CERT"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              certificate: Schema.optional(Schema.String),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DNSKEY"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              flags: Schema.optional(Schema.Number),
              protocol: Schema.optional(Schema.Number),
              publicKey: Schema.optional(Schema.String).pipe(
                T.JsonName("public_key"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("DS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              digest: Schema.optional(Schema.String),
              digestType: Schema.optional(Schema.Number).pipe(
                T.JsonName("digest_type"),
              ),
              keyTag: Schema.optional(Schema.Number).pipe(
                T.JsonName("key_tag"),
              ),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("HTTPS"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("LOC"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              altitude: Schema.optional(Schema.Number),
              latDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_degrees"),
              ),
              latDirection: Schema.optional(Schema.Literal("N", "S")).pipe(
                T.JsonName("lat_direction"),
              ),
              latMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_minutes"),
              ),
              latSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("lat_seconds"),
              ),
              longDegrees: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_degrees"),
              ),
              longDirection: Schema.optional(Schema.Literal("E", "W")).pipe(
                T.JsonName("long_direction"),
              ),
              longMinutes: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_minutes"),
              ),
              longSeconds: Schema.optional(Schema.Number).pipe(
                T.JsonName("long_seconds"),
              ),
              precisionHorz: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_horz"),
              ),
              precisionVert: Schema.optional(Schema.Number).pipe(
                T.JsonName("precision_vert"),
              ),
              size: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("NAPTR"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              flags: Schema.optional(Schema.String),
              order: Schema.optional(Schema.Number),
              preference: Schema.optional(Schema.Number),
              regex: Schema.optional(Schema.String),
              replacement: Schema.optional(Schema.String),
              service: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SMIMEA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SRV"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              port: Schema.optional(Schema.Number),
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SSHFP"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              algorithm: Schema.optional(Schema.Number),
              fingerprint: Schema.optional(Schema.String),
              type: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("SVCB"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              priority: Schema.optional(Schema.Number),
              target: Schema.optional(Schema.String),
              value: Schema.optional(Schema.String),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("TLSA"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              certificate: Schema.optional(Schema.String),
              matchingType: Schema.optional(Schema.Number).pipe(
                T.JsonName("matching_type"),
              ),
              selector: Schema.optional(Schema.Number),
              usage: Schema.optional(Schema.Number),
            }),
          ),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
        Schema.Struct({
          zoneId: Schema.String.pipe(T.JsonName("zone_id")),
          name: Schema.String,
          ttl: Schema.Number,
          type: Schema.Literal("URI"),
          comment: Schema.optional(Schema.String),
          data: Schema.optional(
            Schema.Struct({
              target: Schema.optional(Schema.String),
              weight: Schema.optional(Schema.Number),
            }),
          ),
          priority: Schema.optional(Schema.Number),
          proxied: Schema.optional(Schema.Boolean),
          settings: Schema.optional(
            Schema.Struct({
              ipv4Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv4_only"),
              ),
              ipv6Only: Schema.optional(Schema.Boolean).pipe(
                T.JsonName("ipv6_only"),
              ),
            }),
          ),
          tags: Schema.optional(Schema.Array(Schema.String)),
        }),
      ),
    ),
  ),
  rejects: Schema.optional(Schema.Array(Schema.String)),
}) as unknown as Schema.Schema<ScanReviewRecordResponse>;

export const scanReviewRecord: (
  input: ScanReviewRecordRequest,
) => Effect.Effect<
  ScanReviewRecordResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ScanReviewRecordRequest,
  output: ScanReviewRecordResponse,
  errors: [],
}));

// =============================================================================
// SettingAccount
// =============================================================================

export interface GetSettingAccountRequest {
  /** Identifier. */
  accountId: string;
}

export const GetSettingAccountRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/dns_settings" }),
) as unknown as Schema.Schema<GetSettingAccountRequest>;

export interface GetSettingAccountResponse {
  zoneDefaults: {
    flattenAllCnames: boolean;
    foundationDns: boolean;
    internalDns: { referenceZoneId?: string };
    multiProvider: boolean;
    nameservers: {
      type?:
        | "cloudflare.standard"
        | "cloudflare.standard.random"
        | "custom.account"
        | "custom.tenant";
    };
    nsTtl: number;
    secondaryOverrides: boolean;
    soa: {
      expire?: number;
      minTtl?: number;
      mname?: string | null;
      refresh?: number;
      retry?: number;
      rname?: string;
      ttl?: number;
    };
    zoneMode: "standard" | "cdn_only" | "dns_only";
  };
}

export const GetSettingAccountResponse = Schema.Struct({
  zoneDefaults: Schema.Struct({
    flattenAllCnames: Schema.Boolean.pipe(T.JsonName("flatten_all_cnames")),
    foundationDns: Schema.Boolean.pipe(T.JsonName("foundation_dns")),
    internalDns: Schema.Struct({
      referenceZoneId: Schema.optional(Schema.String).pipe(
        T.JsonName("reference_zone_id"),
      ),
    }).pipe(T.JsonName("internal_dns")),
    multiProvider: Schema.Boolean.pipe(T.JsonName("multi_provider")),
    nameservers: Schema.Struct({
      type: Schema.optional(
        Schema.Literal(
          "cloudflare.standard",
          "cloudflare.standard.random",
          "custom.account",
          "custom.tenant",
        ),
      ),
    }),
    nsTtl: Schema.Number.pipe(T.JsonName("ns_ttl")),
    secondaryOverrides: Schema.Boolean.pipe(T.JsonName("secondary_overrides")),
    soa: Schema.Struct({
      expire: Schema.optional(Schema.Number),
      minTtl: Schema.optional(Schema.Number).pipe(T.JsonName("min_ttl")),
      mname: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      refresh: Schema.optional(Schema.Number),
      retry: Schema.optional(Schema.Number),
      rname: Schema.optional(Schema.String),
      ttl: Schema.optional(Schema.Number),
    }),
    zoneMode: Schema.Literal("standard", "cdn_only", "dns_only").pipe(
      T.JsonName("zone_mode"),
    ),
  }).pipe(T.JsonName("zone_defaults")),
}) as unknown as Schema.Schema<GetSettingAccountResponse>;

export const getSettingAccount: (
  input: GetSettingAccountRequest,
) => Effect.Effect<
  GetSettingAccountResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSettingAccountRequest,
  output: GetSettingAccountResponse,
  errors: [],
}));

export interface PatchSettingAccountRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  zoneDefaults?: {
    flattenAllCnames?: boolean;
    foundationDns?: boolean;
    internalDns?: { referenceZoneId?: string };
    multiProvider?: boolean;
    nameservers?: {
      type?:
        | "cloudflare.standard"
        | "cloudflare.standard.random"
        | "custom.account"
        | "custom.tenant";
    };
    nsTtl?: number;
    secondaryOverrides?: boolean;
    soa?: {
      expire?: number;
      minTtl?: number;
      mname?: string | null;
      refresh?: number;
      retry?: number;
      rname?: string;
      ttl?: number;
    };
    zoneMode?: "standard" | "cdn_only" | "dns_only";
  };
}

export const PatchSettingAccountRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneDefaults: Schema.optional(
    Schema.Struct({
      flattenAllCnames: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("flatten_all_cnames"),
      ),
      foundationDns: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("foundation_dns"),
      ),
      internalDns: Schema.optional(
        Schema.Struct({
          referenceZoneId: Schema.optional(Schema.String).pipe(
            T.JsonName("reference_zone_id"),
          ),
        }),
      ).pipe(T.JsonName("internal_dns")),
      multiProvider: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("multi_provider"),
      ),
      nameservers: Schema.optional(
        Schema.Struct({
          type: Schema.optional(
            Schema.Literal(
              "cloudflare.standard",
              "cloudflare.standard.random",
              "custom.account",
              "custom.tenant",
            ),
          ),
        }),
      ),
      nsTtl: Schema.optional(Schema.Number).pipe(T.JsonName("ns_ttl")),
      secondaryOverrides: Schema.optional(Schema.Boolean).pipe(
        T.JsonName("secondary_overrides"),
      ),
      soa: Schema.optional(
        Schema.Struct({
          expire: Schema.optional(Schema.Number),
          minTtl: Schema.optional(Schema.Number).pipe(T.JsonName("min_ttl")),
          mname: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
          refresh: Schema.optional(Schema.Number),
          retry: Schema.optional(Schema.Number),
          rname: Schema.optional(Schema.String),
          ttl: Schema.optional(Schema.Number),
        }),
      ),
      zoneMode: Schema.optional(
        Schema.Literal("standard", "cdn_only", "dns_only"),
      ).pipe(T.JsonName("zone_mode")),
    }),
  ).pipe(T.JsonName("zone_defaults")),
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/dns_settings" }),
) as unknown as Schema.Schema<PatchSettingAccountRequest>;

export interface PatchSettingAccountResponse {
  zoneDefaults: {
    flattenAllCnames: boolean;
    foundationDns: boolean;
    internalDns: { referenceZoneId?: string };
    multiProvider: boolean;
    nameservers: {
      type?:
        | "cloudflare.standard"
        | "cloudflare.standard.random"
        | "custom.account"
        | "custom.tenant";
    };
    nsTtl: number;
    secondaryOverrides: boolean;
    soa: {
      expire?: number;
      minTtl?: number;
      mname?: string | null;
      refresh?: number;
      retry?: number;
      rname?: string;
      ttl?: number;
    };
    zoneMode: "standard" | "cdn_only" | "dns_only";
  };
}

export const PatchSettingAccountResponse = Schema.Struct({
  zoneDefaults: Schema.Struct({
    flattenAllCnames: Schema.Boolean.pipe(T.JsonName("flatten_all_cnames")),
    foundationDns: Schema.Boolean.pipe(T.JsonName("foundation_dns")),
    internalDns: Schema.Struct({
      referenceZoneId: Schema.optional(Schema.String).pipe(
        T.JsonName("reference_zone_id"),
      ),
    }).pipe(T.JsonName("internal_dns")),
    multiProvider: Schema.Boolean.pipe(T.JsonName("multi_provider")),
    nameservers: Schema.Struct({
      type: Schema.optional(
        Schema.Literal(
          "cloudflare.standard",
          "cloudflare.standard.random",
          "custom.account",
          "custom.tenant",
        ),
      ),
    }),
    nsTtl: Schema.Number.pipe(T.JsonName("ns_ttl")),
    secondaryOverrides: Schema.Boolean.pipe(T.JsonName("secondary_overrides")),
    soa: Schema.Struct({
      expire: Schema.optional(Schema.Number),
      minTtl: Schema.optional(Schema.Number).pipe(T.JsonName("min_ttl")),
      mname: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      refresh: Schema.optional(Schema.Number),
      retry: Schema.optional(Schema.Number),
      rname: Schema.optional(Schema.String),
      ttl: Schema.optional(Schema.Number),
    }),
    zoneMode: Schema.Literal("standard", "cdn_only", "dns_only").pipe(
      T.JsonName("zone_mode"),
    ),
  }).pipe(T.JsonName("zone_defaults")),
}) as unknown as Schema.Schema<PatchSettingAccountResponse>;

export const patchSettingAccount: (
  input: PatchSettingAccountRequest,
) => Effect.Effect<
  PatchSettingAccountResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchSettingAccountRequest,
  output: PatchSettingAccountResponse,
  errors: [],
}));

// =============================================================================
// SettingAccountView
// =============================================================================

export interface GetSettingAccountViewRequest {
  viewId: string;
  /** Identifier. */
  accountId: string;
}

export const GetSettingAccountViewRequest = Schema.Struct({
  viewId: Schema.String.pipe(T.HttpPath("viewId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/dns_settings/views/{viewId}",
  }),
) as unknown as Schema.Schema<GetSettingAccountViewRequest>;

export interface GetSettingAccountViewResponse {
  /** Identifier. */
  id: string;
  /** When the view was created. */
  createdTime: string;
  /** When the view was last modified. */
  modifiedTime: string;
  /** The name of the view. */
  name: string;
  /** The list of zones linked to this view. */
  zones: string[];
}

export const GetSettingAccountViewResponse = Schema.Struct({
  id: Schema.String,
  createdTime: Schema.String.pipe(T.JsonName("created_time")),
  modifiedTime: Schema.String.pipe(T.JsonName("modified_time")),
  name: Schema.String,
  zones: Schema.Array(Schema.String),
}) as unknown as Schema.Schema<GetSettingAccountViewResponse>;

export const getSettingAccountView: (
  input: GetSettingAccountViewRequest,
) => Effect.Effect<
  GetSettingAccountViewResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSettingAccountViewRequest,
  output: GetSettingAccountViewResponse,
  errors: [],
}));

export interface CreateSettingAccountViewRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The name of the view. */
  name: string;
  /** Body param: The list of zones linked to this view. */
  zones: string[];
}

export const CreateSettingAccountViewRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  zones: Schema.Array(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/dns_settings/views" }),
) as unknown as Schema.Schema<CreateSettingAccountViewRequest>;

export interface CreateSettingAccountViewResponse {
  /** Identifier. */
  id: string;
  /** When the view was created. */
  createdTime: string;
  /** When the view was last modified. */
  modifiedTime: string;
  /** The name of the view. */
  name: string;
  /** The list of zones linked to this view. */
  zones: string[];
}

export const CreateSettingAccountViewResponse = Schema.Struct({
  id: Schema.String,
  createdTime: Schema.String.pipe(T.JsonName("created_time")),
  modifiedTime: Schema.String.pipe(T.JsonName("modified_time")),
  name: Schema.String,
  zones: Schema.Array(Schema.String),
}) as unknown as Schema.Schema<CreateSettingAccountViewResponse>;

export const createSettingAccountView: (
  input: CreateSettingAccountViewRequest,
) => Effect.Effect<
  CreateSettingAccountViewResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateSettingAccountViewRequest,
  output: CreateSettingAccountViewResponse,
  errors: [],
}));

export interface PatchSettingAccountViewRequest {
  viewId: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The name of the view. */
  name?: string;
  /** Body param: The list of zones linked to this view. */
  zones?: string[];
}

export const PatchSettingAccountViewRequest = Schema.Struct({
  viewId: Schema.String.pipe(T.HttpPath("viewId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
  zones: Schema.optional(Schema.Array(Schema.String)),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/dns_settings/views/{viewId}",
  }),
) as unknown as Schema.Schema<PatchSettingAccountViewRequest>;

export interface PatchSettingAccountViewResponse {
  /** Identifier. */
  id: string;
  /** When the view was created. */
  createdTime: string;
  /** When the view was last modified. */
  modifiedTime: string;
  /** The name of the view. */
  name: string;
  /** The list of zones linked to this view. */
  zones: string[];
}

export const PatchSettingAccountViewResponse = Schema.Struct({
  id: Schema.String,
  createdTime: Schema.String.pipe(T.JsonName("created_time")),
  modifiedTime: Schema.String.pipe(T.JsonName("modified_time")),
  name: Schema.String,
  zones: Schema.Array(Schema.String),
}) as unknown as Schema.Schema<PatchSettingAccountViewResponse>;

export const patchSettingAccountView: (
  input: PatchSettingAccountViewRequest,
) => Effect.Effect<
  PatchSettingAccountViewResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchSettingAccountViewRequest,
  output: PatchSettingAccountViewResponse,
  errors: [],
}));

export interface DeleteSettingAccountViewRequest {
  viewId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteSettingAccountViewRequest = Schema.Struct({
  viewId: Schema.String.pipe(T.HttpPath("viewId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/dns_settings/views/{viewId}",
  }),
) as unknown as Schema.Schema<DeleteSettingAccountViewRequest>;

export interface DeleteSettingAccountViewResponse {
  /** Identifier. */
  id?: string;
}

export const DeleteSettingAccountViewResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteSettingAccountViewResponse>;

export const deleteSettingAccountView: (
  input: DeleteSettingAccountViewRequest,
) => Effect.Effect<
  DeleteSettingAccountViewResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteSettingAccountViewRequest,
  output: DeleteSettingAccountViewResponse,
  errors: [],
}));

// =============================================================================
// SettingZone
// =============================================================================

export interface GetSettingZoneRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetSettingZoneRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/dns_settings" }),
) as unknown as Schema.Schema<GetSettingZoneRequest>;

export interface GetSettingZoneResponse {
  /** Whether to flatten all CNAME records in the zone. Note that, due to DNS limitations, a CNAME record at the zone apex will always be flattened. */
  flattenAllCnames: boolean;
  /** Whether to enable Foundation DNS Advanced Nameservers on the zone. */
  foundationDns: boolean;
  /** Settings for this internal zone. */
  internalDns: { referenceZoneId?: string };
  /** Whether to enable multi-provider DNS, which causes Cloudflare to activate the zone even when non-Cloudflare NS records exist, and to respect NS records at the zone apex during outbound zone transfers. */
  multiProvider: boolean;
  /** Settings determining the nameservers through which the zone should be available. */
  nameservers: {
    type:
      | "cloudflare.standard"
      | "custom.account"
      | "custom.tenant"
      | "custom.zone";
    nsSet?: number;
  };
  /** The time to live (TTL) of the zone's nameserver (NS) records. */
  nsTtl: number;
  /** Allows a Secondary DNS zone to use (proxied) override records and CNAME flattening at the zone apex. */
  secondaryOverrides: boolean;
  /** Components of the zone's SOA record. */
  soa: {
    expire?: number;
    minTtl?: number;
    mname?: string | null;
    refresh?: number;
    retry?: number;
    rname?: string;
    ttl?: number;
  };
  /** Whether the zone mode is a regular or CDN/DNS only zone. */
  zoneMode: "standard" | "cdn_only" | "dns_only";
}

export const GetSettingZoneResponse = Schema.Struct({
  flattenAllCnames: Schema.Boolean.pipe(T.JsonName("flatten_all_cnames")),
  foundationDns: Schema.Boolean.pipe(T.JsonName("foundation_dns")),
  internalDns: Schema.Struct({
    referenceZoneId: Schema.optional(Schema.String).pipe(
      T.JsonName("reference_zone_id"),
    ),
  }).pipe(T.JsonName("internal_dns")),
  multiProvider: Schema.Boolean.pipe(T.JsonName("multi_provider")),
  nameservers: Schema.Struct({
    type: Schema.Literal(
      "cloudflare.standard",
      "custom.account",
      "custom.tenant",
      "custom.zone",
    ),
    nsSet: Schema.optional(Schema.Number).pipe(T.JsonName("ns_set")),
  }),
  nsTtl: Schema.Number.pipe(T.JsonName("ns_ttl")),
  secondaryOverrides: Schema.Boolean.pipe(T.JsonName("secondary_overrides")),
  soa: Schema.Struct({
    expire: Schema.optional(Schema.Number),
    minTtl: Schema.optional(Schema.Number).pipe(T.JsonName("min_ttl")),
    mname: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    refresh: Schema.optional(Schema.Number),
    retry: Schema.optional(Schema.Number),
    rname: Schema.optional(Schema.String),
    ttl: Schema.optional(Schema.Number),
  }),
  zoneMode: Schema.Literal("standard", "cdn_only", "dns_only").pipe(
    T.JsonName("zone_mode"),
  ),
}) as unknown as Schema.Schema<GetSettingZoneResponse>;

export const getSettingZone: (
  input: GetSettingZoneRequest,
) => Effect.Effect<
  GetSettingZoneResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSettingZoneRequest,
  output: GetSettingZoneResponse,
  errors: [],
}));

export interface PatchSettingZoneRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Whether to flatten all CNAME records in the zone. Note that, due to DNS limitations, a CNAME record at the zone apex will always be flattened. */
  flattenAllCnames?: boolean;
  /** Body param: Whether to enable Foundation DNS Advanced Nameservers on the zone. */
  foundationDns?: boolean;
  /** Body param: Settings for this internal zone. */
  internalDns?: { referenceZoneId?: string };
  /** Body param: Whether to enable multi-provider DNS, which causes Cloudflare to activate the zone even when non-Cloudflare NS records exist, and to respect NS records at the zone apex during outbound zon */
  multiProvider?: boolean;
  /** Body param: Settings determining the nameservers through which the zone should be available. */
  nameservers?: {
    nsSet?: number;
    type?:
      | "cloudflare.standard"
      | "custom.account"
      | "custom.tenant"
      | "custom.zone";
  };
  /** Body param: The time to live (TTL) of the zone's nameserver (NS) records. */
  nsTtl?: number;
  /** Body param: Allows a Secondary DNS zone to use (proxied) override records and CNAME flattening at the zone apex. */
  secondaryOverrides?: boolean;
  /** Body param: Components of the zone's SOA record. */
  soa?: {
    expire?: number;
    minTtl?: number;
    mname?: string | null;
    refresh?: number;
    retry?: number;
    rname?: string;
    ttl?: number;
  };
  /** Body param: Whether the zone mode is a regular or CDN/DNS only zone. */
  zoneMode?: "standard" | "cdn_only" | "dns_only";
}

export const PatchSettingZoneRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  flattenAllCnames: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("flatten_all_cnames"),
  ),
  foundationDns: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("foundation_dns"),
  ),
  internalDns: Schema.optional(
    Schema.Struct({
      referenceZoneId: Schema.optional(Schema.String).pipe(
        T.JsonName("reference_zone_id"),
      ),
    }),
  ).pipe(T.JsonName("internal_dns")),
  multiProvider: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("multi_provider"),
  ),
  nameservers: Schema.optional(
    Schema.Struct({
      nsSet: Schema.optional(Schema.Number).pipe(T.JsonName("ns_set")),
      type: Schema.optional(
        Schema.Literal(
          "cloudflare.standard",
          "custom.account",
          "custom.tenant",
          "custom.zone",
        ),
      ),
    }),
  ),
  nsTtl: Schema.optional(Schema.Number).pipe(T.JsonName("ns_ttl")),
  secondaryOverrides: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("secondary_overrides"),
  ),
  soa: Schema.optional(
    Schema.Struct({
      expire: Schema.optional(Schema.Number),
      minTtl: Schema.optional(Schema.Number).pipe(T.JsonName("min_ttl")),
      mname: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
      refresh: Schema.optional(Schema.Number),
      retry: Schema.optional(Schema.Number),
      rname: Schema.optional(Schema.String),
      ttl: Schema.optional(Schema.Number),
    }),
  ),
  zoneMode: Schema.optional(
    Schema.Literal("standard", "cdn_only", "dns_only"),
  ).pipe(T.JsonName("zone_mode")),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/dns_settings" }),
) as unknown as Schema.Schema<PatchSettingZoneRequest>;

export interface PatchSettingZoneResponse {
  /** Whether to flatten all CNAME records in the zone. Note that, due to DNS limitations, a CNAME record at the zone apex will always be flattened. */
  flattenAllCnames: boolean;
  /** Whether to enable Foundation DNS Advanced Nameservers on the zone. */
  foundationDns: boolean;
  /** Settings for this internal zone. */
  internalDns: { referenceZoneId?: string };
  /** Whether to enable multi-provider DNS, which causes Cloudflare to activate the zone even when non-Cloudflare NS records exist, and to respect NS records at the zone apex during outbound zone transfers. */
  multiProvider: boolean;
  /** Settings determining the nameservers through which the zone should be available. */
  nameservers: {
    type:
      | "cloudflare.standard"
      | "custom.account"
      | "custom.tenant"
      | "custom.zone";
    nsSet?: number;
  };
  /** The time to live (TTL) of the zone's nameserver (NS) records. */
  nsTtl: number;
  /** Allows a Secondary DNS zone to use (proxied) override records and CNAME flattening at the zone apex. */
  secondaryOverrides: boolean;
  /** Components of the zone's SOA record. */
  soa: {
    expire?: number;
    minTtl?: number;
    mname?: string | null;
    refresh?: number;
    retry?: number;
    rname?: string;
    ttl?: number;
  };
  /** Whether the zone mode is a regular or CDN/DNS only zone. */
  zoneMode: "standard" | "cdn_only" | "dns_only";
}

export const PatchSettingZoneResponse = Schema.Struct({
  flattenAllCnames: Schema.Boolean.pipe(T.JsonName("flatten_all_cnames")),
  foundationDns: Schema.Boolean.pipe(T.JsonName("foundation_dns")),
  internalDns: Schema.Struct({
    referenceZoneId: Schema.optional(Schema.String).pipe(
      T.JsonName("reference_zone_id"),
    ),
  }).pipe(T.JsonName("internal_dns")),
  multiProvider: Schema.Boolean.pipe(T.JsonName("multi_provider")),
  nameservers: Schema.Struct({
    type: Schema.Literal(
      "cloudflare.standard",
      "custom.account",
      "custom.tenant",
      "custom.zone",
    ),
    nsSet: Schema.optional(Schema.Number).pipe(T.JsonName("ns_set")),
  }),
  nsTtl: Schema.Number.pipe(T.JsonName("ns_ttl")),
  secondaryOverrides: Schema.Boolean.pipe(T.JsonName("secondary_overrides")),
  soa: Schema.Struct({
    expire: Schema.optional(Schema.Number),
    minTtl: Schema.optional(Schema.Number).pipe(T.JsonName("min_ttl")),
    mname: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
    refresh: Schema.optional(Schema.Number),
    retry: Schema.optional(Schema.Number),
    rname: Schema.optional(Schema.String),
    ttl: Schema.optional(Schema.Number),
  }),
  zoneMode: Schema.Literal("standard", "cdn_only", "dns_only").pipe(
    T.JsonName("zone_mode"),
  ),
}) as unknown as Schema.Schema<PatchSettingZoneResponse>;

export const patchSettingZone: (
  input: PatchSettingZoneRequest,
) => Effect.Effect<
  PatchSettingZoneResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchSettingZoneRequest,
  output: PatchSettingZoneResponse,
  errors: [],
}));

// =============================================================================
// TriggerRecord
// =============================================================================

export interface ScanTriggerRecordRequest {
  /** Identifier. */
  zoneId: string;
}

export const ScanTriggerRecordRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/dns_records/scan/trigger" }),
) as unknown as Schema.Schema<ScanTriggerRecordRequest>;

export interface ScanTriggerRecordResponse {
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

export const ScanTriggerRecordResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<ScanTriggerRecordResponse>;

export const scanTriggerRecord: (
  input: ScanTriggerRecordRequest,
) => Effect.Effect<
  ScanTriggerRecordResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ScanTriggerRecordRequest,
  output: ScanTriggerRecordResponse,
  errors: [],
}));

// =============================================================================
// ZoneTransferAcl
// =============================================================================

export interface GetZoneTransferAclRequest {
  aclId: string;
  accountId: string;
}

export const GetZoneTransferAclRequest = Schema.Struct({
  aclId: Schema.String.pipe(T.HttpPath("aclId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/secondary_dns/acls/{aclId}",
  }),
) as unknown as Schema.Schema<GetZoneTransferAclRequest>;

export interface GetZoneTransferAclResponse {
  id: string;
  /** Allowed IPv4/IPv6 address range of primary or secondary nameservers. This will be applied for the entire account. The IP range is used to allow additional NOTIFY IPs for secondary zones and IPs Cloudf */
  ipRange: string;
  /** The name of the acl. */
  name: string;
}

export const GetZoneTransferAclResponse = Schema.Struct({
  id: Schema.String,
  ipRange: Schema.String.pipe(T.JsonName("ip_range")),
  name: Schema.String,
}) as unknown as Schema.Schema<GetZoneTransferAclResponse>;

export const getZoneTransferAcl: (
  input: GetZoneTransferAclRequest,
) => Effect.Effect<
  GetZoneTransferAclResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetZoneTransferAclRequest,
  output: GetZoneTransferAclResponse,
  errors: [],
}));

export interface CreateZoneTransferAclRequest {
  /** Path param: */
  accountId: string;
  /** Body param: Allowed IPv4/IPv6 address range of primary or secondary nameservers. This will be applied for the entire account. The IP range is used to allow additional NOTIFY IPs for secondary zones an */
  ipRange: string;
  /** Body param: The name of the acl. */
  name: string;
}

export const CreateZoneTransferAclRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  ipRange: Schema.String.pipe(T.JsonName("ip_range")),
  name: Schema.String,
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/secondary_dns/acls" }),
) as unknown as Schema.Schema<CreateZoneTransferAclRequest>;

export interface CreateZoneTransferAclResponse {
  id: string;
  /** Allowed IPv4/IPv6 address range of primary or secondary nameservers. This will be applied for the entire account. The IP range is used to allow additional NOTIFY IPs for secondary zones and IPs Cloudf */
  ipRange: string;
  /** The name of the acl. */
  name: string;
}

export const CreateZoneTransferAclResponse = Schema.Struct({
  id: Schema.String,
  ipRange: Schema.String.pipe(T.JsonName("ip_range")),
  name: Schema.String,
}) as unknown as Schema.Schema<CreateZoneTransferAclResponse>;

export const createZoneTransferAcl: (
  input: CreateZoneTransferAclRequest,
) => Effect.Effect<
  CreateZoneTransferAclResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateZoneTransferAclRequest,
  output: CreateZoneTransferAclResponse,
  errors: [],
}));

export interface UpdateZoneTransferAclRequest {
  aclId: string;
  /** Path param: */
  accountId: string;
  /** Body param: Allowed IPv4/IPv6 address range of primary or secondary nameservers. This will be applied for the entire account. The IP range is used to allow additional NOTIFY IPs for secondary zones an */
  ipRange: string;
  /** Body param: The name of the acl. */
  name: string;
}

export const UpdateZoneTransferAclRequest = Schema.Struct({
  aclId: Schema.String.pipe(T.HttpPath("aclId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  ipRange: Schema.String.pipe(T.JsonName("ip_range")),
  name: Schema.String,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/secondary_dns/acls/{aclId}",
  }),
) as unknown as Schema.Schema<UpdateZoneTransferAclRequest>;

export interface UpdateZoneTransferAclResponse {
  id: string;
  /** Allowed IPv4/IPv6 address range of primary or secondary nameservers. This will be applied for the entire account. The IP range is used to allow additional NOTIFY IPs for secondary zones and IPs Cloudf */
  ipRange: string;
  /** The name of the acl. */
  name: string;
}

export const UpdateZoneTransferAclResponse = Schema.Struct({
  id: Schema.String,
  ipRange: Schema.String.pipe(T.JsonName("ip_range")),
  name: Schema.String,
}) as unknown as Schema.Schema<UpdateZoneTransferAclResponse>;

export const updateZoneTransferAcl: (
  input: UpdateZoneTransferAclRequest,
) => Effect.Effect<
  UpdateZoneTransferAclResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateZoneTransferAclRequest,
  output: UpdateZoneTransferAclResponse,
  errors: [],
}));

export interface DeleteZoneTransferAclRequest {
  aclId: string;
  accountId: string;
}

export const DeleteZoneTransferAclRequest = Schema.Struct({
  aclId: Schema.String.pipe(T.HttpPath("aclId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/secondary_dns/acls/{aclId}",
  }),
) as unknown as Schema.Schema<DeleteZoneTransferAclRequest>;

export interface DeleteZoneTransferAclResponse {
  id?: string;
}

export const DeleteZoneTransferAclResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteZoneTransferAclResponse>;

export const deleteZoneTransferAcl: (
  input: DeleteZoneTransferAclRequest,
) => Effect.Effect<
  DeleteZoneTransferAclResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteZoneTransferAclRequest,
  output: DeleteZoneTransferAclResponse,
  errors: [],
}));

// =============================================================================
// ZoneTransferForceAxfr
// =============================================================================

export interface CreateZoneTransferForceAxfrRequest {
  /** Path param: */
  zoneId: string;
  /** Body param: */
  body: unknown;
}

export const CreateZoneTransferForceAxfrRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/secondary_dns/force_axfr" }),
) as unknown as Schema.Schema<CreateZoneTransferForceAxfrRequest>;

export type CreateZoneTransferForceAxfrResponse = string;

export const CreateZoneTransferForceAxfrResponse =
  Schema.String as unknown as Schema.Schema<CreateZoneTransferForceAxfrResponse>;

export const createZoneTransferForceAxfr: (
  input: CreateZoneTransferForceAxfrRequest,
) => Effect.Effect<
  CreateZoneTransferForceAxfrResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateZoneTransferForceAxfrRequest,
  output: CreateZoneTransferForceAxfrResponse,
  errors: [],
}));

// =============================================================================
// ZoneTransferIncoming
// =============================================================================

export interface GetZoneTransferIncomingRequest {
  zoneId: string;
}

export const GetZoneTransferIncomingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/secondary_dns/incoming" }),
) as unknown as Schema.Schema<GetZoneTransferIncomingRequest>;

export interface GetZoneTransferIncomingResponse {
  id?: string;
  /** How often should a secondary zone auto refresh regardless of DNS NOTIFY. Not applicable for primary zones. */
  autoRefreshSeconds?: number;
  /** The time for a specific event. */
  checkedTime?: string;
  /** The time for a specific event. */
  createdTime?: string;
  /** The time for a specific event. */
  modifiedTime?: string;
  /** Zone name. */
  name?: string;
  /** A list of peer tags. */
  peers?: string[];
  /** The serial number of the SOA for the given zone. */
  soaSerial?: number;
}

export const GetZoneTransferIncomingResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  autoRefreshSeconds: Schema.optional(Schema.Number).pipe(
    T.JsonName("auto_refresh_seconds"),
  ),
  checkedTime: Schema.optional(Schema.String).pipe(T.JsonName("checked_time")),
  createdTime: Schema.optional(Schema.String).pipe(T.JsonName("created_time")),
  modifiedTime: Schema.optional(Schema.String).pipe(
    T.JsonName("modified_time"),
  ),
  name: Schema.optional(Schema.String),
  peers: Schema.optional(Schema.Array(Schema.String)),
  soaSerial: Schema.optional(Schema.Number).pipe(T.JsonName("soa_serial")),
}) as unknown as Schema.Schema<GetZoneTransferIncomingResponse>;

export const getZoneTransferIncoming: (
  input: GetZoneTransferIncomingRequest,
) => Effect.Effect<
  GetZoneTransferIncomingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetZoneTransferIncomingRequest,
  output: GetZoneTransferIncomingResponse,
  errors: [],
}));

export interface CreateZoneTransferIncomingRequest {
  /** Path param: */
  zoneId: string;
  /** Body param: How often should a secondary zone auto refresh regardless of DNS NOTIFY. Not applicable for primary zones. */
  autoRefreshSeconds: number;
  /** Body param: Zone name. */
  name: string;
  /** Body param: A list of peer tags. */
  peers: string[];
}

export const CreateZoneTransferIncomingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  autoRefreshSeconds: Schema.Number.pipe(T.JsonName("auto_refresh_seconds")),
  name: Schema.String,
  peers: Schema.Array(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/secondary_dns/incoming" }),
) as unknown as Schema.Schema<CreateZoneTransferIncomingRequest>;

export interface CreateZoneTransferIncomingResponse {
  id?: string;
  /** How often should a secondary zone auto refresh regardless of DNS NOTIFY. Not applicable for primary zones. */
  autoRefreshSeconds?: number;
  /** The time for a specific event. */
  checkedTime?: string;
  /** The time for a specific event. */
  createdTime?: string;
  /** The time for a specific event. */
  modifiedTime?: string;
  /** Zone name. */
  name?: string;
  /** A list of peer tags. */
  peers?: string[];
  /** The serial number of the SOA for the given zone. */
  soaSerial?: number;
}

export const CreateZoneTransferIncomingResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  autoRefreshSeconds: Schema.optional(Schema.Number).pipe(
    T.JsonName("auto_refresh_seconds"),
  ),
  checkedTime: Schema.optional(Schema.String).pipe(T.JsonName("checked_time")),
  createdTime: Schema.optional(Schema.String).pipe(T.JsonName("created_time")),
  modifiedTime: Schema.optional(Schema.String).pipe(
    T.JsonName("modified_time"),
  ),
  name: Schema.optional(Schema.String),
  peers: Schema.optional(Schema.Array(Schema.String)),
  soaSerial: Schema.optional(Schema.Number).pipe(T.JsonName("soa_serial")),
}) as unknown as Schema.Schema<CreateZoneTransferIncomingResponse>;

export const createZoneTransferIncoming: (
  input: CreateZoneTransferIncomingRequest,
) => Effect.Effect<
  CreateZoneTransferIncomingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateZoneTransferIncomingRequest,
  output: CreateZoneTransferIncomingResponse,
  errors: [],
}));

export interface UpdateZoneTransferIncomingRequest {
  /** Path param: */
  zoneId: string;
  /** Body param: How often should a secondary zone auto refresh regardless of DNS NOTIFY. Not applicable for primary zones. */
  autoRefreshSeconds: number;
  /** Body param: Zone name. */
  name: string;
  /** Body param: A list of peer tags. */
  peers: string[];
}

export const UpdateZoneTransferIncomingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  autoRefreshSeconds: Schema.Number.pipe(T.JsonName("auto_refresh_seconds")),
  name: Schema.String,
  peers: Schema.Array(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/secondary_dns/incoming" }),
) as unknown as Schema.Schema<UpdateZoneTransferIncomingRequest>;

export interface UpdateZoneTransferIncomingResponse {
  id?: string;
  /** How often should a secondary zone auto refresh regardless of DNS NOTIFY. Not applicable for primary zones. */
  autoRefreshSeconds?: number;
  /** The time for a specific event. */
  checkedTime?: string;
  /** The time for a specific event. */
  createdTime?: string;
  /** The time for a specific event. */
  modifiedTime?: string;
  /** Zone name. */
  name?: string;
  /** A list of peer tags. */
  peers?: string[];
  /** The serial number of the SOA for the given zone. */
  soaSerial?: number;
}

export const UpdateZoneTransferIncomingResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  autoRefreshSeconds: Schema.optional(Schema.Number).pipe(
    T.JsonName("auto_refresh_seconds"),
  ),
  checkedTime: Schema.optional(Schema.String).pipe(T.JsonName("checked_time")),
  createdTime: Schema.optional(Schema.String).pipe(T.JsonName("created_time")),
  modifiedTime: Schema.optional(Schema.String).pipe(
    T.JsonName("modified_time"),
  ),
  name: Schema.optional(Schema.String),
  peers: Schema.optional(Schema.Array(Schema.String)),
  soaSerial: Schema.optional(Schema.Number).pipe(T.JsonName("soa_serial")),
}) as unknown as Schema.Schema<UpdateZoneTransferIncomingResponse>;

export const updateZoneTransferIncoming: (
  input: UpdateZoneTransferIncomingRequest,
) => Effect.Effect<
  UpdateZoneTransferIncomingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateZoneTransferIncomingRequest,
  output: UpdateZoneTransferIncomingResponse,
  errors: [],
}));

export interface DeleteZoneTransferIncomingRequest {
  zoneId: string;
}

export const DeleteZoneTransferIncomingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/secondary_dns/incoming" }),
) as unknown as Schema.Schema<DeleteZoneTransferIncomingRequest>;

export interface DeleteZoneTransferIncomingResponse {
  id?: string;
}

export const DeleteZoneTransferIncomingResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteZoneTransferIncomingResponse>;

export const deleteZoneTransferIncoming: (
  input: DeleteZoneTransferIncomingRequest,
) => Effect.Effect<
  DeleteZoneTransferIncomingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteZoneTransferIncomingRequest,
  output: DeleteZoneTransferIncomingResponse,
  errors: [],
}));

// =============================================================================
// ZoneTransferOutgoing
// =============================================================================

export interface GetZoneTransferOutgoingRequest {
  zoneId: string;
}

export const GetZoneTransferOutgoingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/secondary_dns/outgoing" }),
) as unknown as Schema.Schema<GetZoneTransferOutgoingRequest>;

export interface GetZoneTransferOutgoingResponse {
  id?: string;
  /** The time for a specific event. */
  checkedTime?: string;
  /** The time for a specific event. */
  createdTime?: string;
  /** The time for a specific event. */
  lastTransferredTime?: string;
  /** Zone name. */
  name?: string;
  /** A list of peer tags. */
  peers?: string[];
  /** The serial number of the SOA for the given zone. */
  soaSerial?: number;
}

export const GetZoneTransferOutgoingResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  checkedTime: Schema.optional(Schema.String).pipe(T.JsonName("checked_time")),
  createdTime: Schema.optional(Schema.String).pipe(T.JsonName("created_time")),
  lastTransferredTime: Schema.optional(Schema.String).pipe(
    T.JsonName("last_transferred_time"),
  ),
  name: Schema.optional(Schema.String),
  peers: Schema.optional(Schema.Array(Schema.String)),
  soaSerial: Schema.optional(Schema.Number).pipe(T.JsonName("soa_serial")),
}) as unknown as Schema.Schema<GetZoneTransferOutgoingResponse>;

export const getZoneTransferOutgoing: (
  input: GetZoneTransferOutgoingRequest,
) => Effect.Effect<
  GetZoneTransferOutgoingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetZoneTransferOutgoingRequest,
  output: GetZoneTransferOutgoingResponse,
  errors: [],
}));

export interface CreateZoneTransferOutgoingRequest {
  /** Path param: */
  zoneId: string;
  /** Body param: Zone name. */
  name: string;
  /** Body param: A list of peer tags. */
  peers: string[];
}

export const CreateZoneTransferOutgoingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  name: Schema.String,
  peers: Schema.Array(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/secondary_dns/outgoing" }),
) as unknown as Schema.Schema<CreateZoneTransferOutgoingRequest>;

export interface CreateZoneTransferOutgoingResponse {
  id?: string;
  /** The time for a specific event. */
  checkedTime?: string;
  /** The time for a specific event. */
  createdTime?: string;
  /** The time for a specific event. */
  lastTransferredTime?: string;
  /** Zone name. */
  name?: string;
  /** A list of peer tags. */
  peers?: string[];
  /** The serial number of the SOA for the given zone. */
  soaSerial?: number;
}

export const CreateZoneTransferOutgoingResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  checkedTime: Schema.optional(Schema.String).pipe(T.JsonName("checked_time")),
  createdTime: Schema.optional(Schema.String).pipe(T.JsonName("created_time")),
  lastTransferredTime: Schema.optional(Schema.String).pipe(
    T.JsonName("last_transferred_time"),
  ),
  name: Schema.optional(Schema.String),
  peers: Schema.optional(Schema.Array(Schema.String)),
  soaSerial: Schema.optional(Schema.Number).pipe(T.JsonName("soa_serial")),
}) as unknown as Schema.Schema<CreateZoneTransferOutgoingResponse>;

export const createZoneTransferOutgoing: (
  input: CreateZoneTransferOutgoingRequest,
) => Effect.Effect<
  CreateZoneTransferOutgoingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateZoneTransferOutgoingRequest,
  output: CreateZoneTransferOutgoingResponse,
  errors: [],
}));

export interface UpdateZoneTransferOutgoingRequest {
  /** Path param: */
  zoneId: string;
  /** Body param: Zone name. */
  name: string;
  /** Body param: A list of peer tags. */
  peers: string[];
}

export const UpdateZoneTransferOutgoingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  name: Schema.String,
  peers: Schema.Array(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/secondary_dns/outgoing" }),
) as unknown as Schema.Schema<UpdateZoneTransferOutgoingRequest>;

export interface UpdateZoneTransferOutgoingResponse {
  id?: string;
  /** The time for a specific event. */
  checkedTime?: string;
  /** The time for a specific event. */
  createdTime?: string;
  /** The time for a specific event. */
  lastTransferredTime?: string;
  /** Zone name. */
  name?: string;
  /** A list of peer tags. */
  peers?: string[];
  /** The serial number of the SOA for the given zone. */
  soaSerial?: number;
}

export const UpdateZoneTransferOutgoingResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  checkedTime: Schema.optional(Schema.String).pipe(T.JsonName("checked_time")),
  createdTime: Schema.optional(Schema.String).pipe(T.JsonName("created_time")),
  lastTransferredTime: Schema.optional(Schema.String).pipe(
    T.JsonName("last_transferred_time"),
  ),
  name: Schema.optional(Schema.String),
  peers: Schema.optional(Schema.Array(Schema.String)),
  soaSerial: Schema.optional(Schema.Number).pipe(T.JsonName("soa_serial")),
}) as unknown as Schema.Schema<UpdateZoneTransferOutgoingResponse>;

export const updateZoneTransferOutgoing: (
  input: UpdateZoneTransferOutgoingRequest,
) => Effect.Effect<
  UpdateZoneTransferOutgoingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateZoneTransferOutgoingRequest,
  output: UpdateZoneTransferOutgoingResponse,
  errors: [],
}));

export interface DeleteZoneTransferOutgoingRequest {
  zoneId: string;
}

export const DeleteZoneTransferOutgoingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/secondary_dns/outgoing" }),
) as unknown as Schema.Schema<DeleteZoneTransferOutgoingRequest>;

export interface DeleteZoneTransferOutgoingResponse {
  id?: string;
}

export const DeleteZoneTransferOutgoingResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteZoneTransferOutgoingResponse>;

export const deleteZoneTransferOutgoing: (
  input: DeleteZoneTransferOutgoingRequest,
) => Effect.Effect<
  DeleteZoneTransferOutgoingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteZoneTransferOutgoingRequest,
  output: DeleteZoneTransferOutgoingResponse,
  errors: [],
}));

export interface EnableZoneTransferOutgoingRequest {
  /** Path param: */
  zoneId: string;
  /** Body param: */
  body: unknown;
}

export const EnableZoneTransferOutgoingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "POST",
    path: "/zones/{zone_id}/secondary_dns/outgoing/enable",
  }),
) as unknown as Schema.Schema<EnableZoneTransferOutgoingRequest>;

export type EnableZoneTransferOutgoingResponse = string;

export const EnableZoneTransferOutgoingResponse =
  Schema.String as unknown as Schema.Schema<EnableZoneTransferOutgoingResponse>;

export const enableZoneTransferOutgoing: (
  input: EnableZoneTransferOutgoingRequest,
) => Effect.Effect<
  EnableZoneTransferOutgoingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: EnableZoneTransferOutgoingRequest,
  output: EnableZoneTransferOutgoingResponse,
  errors: [],
}));

export interface DisableZoneTransferOutgoingRequest {
  /** Path param: */
  zoneId: string;
  /** Body param: */
  body: unknown;
}

export const DisableZoneTransferOutgoingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "POST",
    path: "/zones/{zone_id}/secondary_dns/outgoing/disable",
  }),
) as unknown as Schema.Schema<DisableZoneTransferOutgoingRequest>;

export type DisableZoneTransferOutgoingResponse = string;

export const DisableZoneTransferOutgoingResponse =
  Schema.String as unknown as Schema.Schema<DisableZoneTransferOutgoingResponse>;

export const disableZoneTransferOutgoing: (
  input: DisableZoneTransferOutgoingRequest,
) => Effect.Effect<
  DisableZoneTransferOutgoingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DisableZoneTransferOutgoingRequest,
  output: DisableZoneTransferOutgoingResponse,
  errors: [],
}));

// =============================================================================
// ZoneTransferOutgoingStatus
// =============================================================================

export interface GetZoneTransferOutgoingStatusRequest {
  zoneId: string;
}

export const GetZoneTransferOutgoingStatusRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/secondary_dns/outgoing/status",
  }),
) as unknown as Schema.Schema<GetZoneTransferOutgoingStatusRequest>;

export type GetZoneTransferOutgoingStatusResponse = unknown;

export const GetZoneTransferOutgoingStatusResponse =
  Schema.Unknown as unknown as Schema.Schema<GetZoneTransferOutgoingStatusResponse>;

export const getZoneTransferOutgoingStatus: (
  input: GetZoneTransferOutgoingStatusRequest,
) => Effect.Effect<
  GetZoneTransferOutgoingStatusResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetZoneTransferOutgoingStatusRequest,
  output: GetZoneTransferOutgoingStatusResponse,
  errors: [],
}));

// =============================================================================
// ZoneTransferPeer
// =============================================================================

export interface GetZoneTransferPeerRequest {
  peerId: string;
  accountId: string;
}

export const GetZoneTransferPeerRequest = Schema.Struct({
  peerId: Schema.String.pipe(T.HttpPath("peerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/secondary_dns/peers/{peerId}",
  }),
) as unknown as Schema.Schema<GetZoneTransferPeerRequest>;

export interface GetZoneTransferPeerResponse {
  id: string;
  /** The name of the peer. */
  name: string;
  /** IPv4/IPv6 address of primary or secondary nameserver, depending on what zone this peer is linked to. For primary zones this IP defines the IP of the secondary nameserver Cloudflare will NOTIFY upon zo */
  ip?: string;
  /** Enable IXFR transfer protocol, default is AXFR. Only applicable to secondary zones. */
  ixfrEnable?: boolean;
  /** DNS port of primary or secondary nameserver, depending on what zone this peer is linked to. */
  port?: number;
  /** TSIG authentication will be used for zone transfer if configured. */
  tsigId?: string;
}

export const GetZoneTransferPeerResponse = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  ip: Schema.optional(Schema.String),
  ixfrEnable: Schema.optional(Schema.Boolean).pipe(T.JsonName("ixfr_enable")),
  port: Schema.optional(Schema.Number),
  tsigId: Schema.optional(Schema.String).pipe(T.JsonName("tsig_id")),
}) as unknown as Schema.Schema<GetZoneTransferPeerResponse>;

export const getZoneTransferPeer: (
  input: GetZoneTransferPeerRequest,
) => Effect.Effect<
  GetZoneTransferPeerResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetZoneTransferPeerRequest,
  output: GetZoneTransferPeerResponse,
  errors: [],
}));

export interface CreateZoneTransferPeerRequest {
  /** Path param: */
  accountId: string;
  /** Body param: The name of the peer. */
  name: string;
}

export const CreateZoneTransferPeerRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/secondary_dns/peers",
  }),
) as unknown as Schema.Schema<CreateZoneTransferPeerRequest>;

export interface CreateZoneTransferPeerResponse {
  id: string;
  /** The name of the peer. */
  name: string;
  /** IPv4/IPv6 address of primary or secondary nameserver, depending on what zone this peer is linked to. For primary zones this IP defines the IP of the secondary nameserver Cloudflare will NOTIFY upon zo */
  ip?: string;
  /** Enable IXFR transfer protocol, default is AXFR. Only applicable to secondary zones. */
  ixfrEnable?: boolean;
  /** DNS port of primary or secondary nameserver, depending on what zone this peer is linked to. */
  port?: number;
  /** TSIG authentication will be used for zone transfer if configured. */
  tsigId?: string;
}

export const CreateZoneTransferPeerResponse = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  ip: Schema.optional(Schema.String),
  ixfrEnable: Schema.optional(Schema.Boolean).pipe(T.JsonName("ixfr_enable")),
  port: Schema.optional(Schema.Number),
  tsigId: Schema.optional(Schema.String).pipe(T.JsonName("tsig_id")),
}) as unknown as Schema.Schema<CreateZoneTransferPeerResponse>;

export const createZoneTransferPeer: (
  input: CreateZoneTransferPeerRequest,
) => Effect.Effect<
  CreateZoneTransferPeerResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateZoneTransferPeerRequest,
  output: CreateZoneTransferPeerResponse,
  errors: [],
}));

export interface UpdateZoneTransferPeerRequest {
  peerId: string;
  /** Path param: */
  accountId: string;
  /** Body param: The name of the peer. */
  name: string;
  /** Body param: IPv4/IPv6 address of primary or secondary nameserver, depending on what zone this peer is linked to. For primary zones this IP defines the IP of the secondary nameserver Cloudflare will NO */
  ip?: string;
  /** Body param: Enable IXFR transfer protocol, default is AXFR. Only applicable to secondary zones. */
  ixfrEnable?: boolean;
  /** Body param: DNS port of primary or secondary nameserver, depending on what zone this peer is linked to. */
  port?: number;
  /** Body param: TSIG authentication will be used for zone transfer if configured. */
  tsigId?: string;
}

export const UpdateZoneTransferPeerRequest = Schema.Struct({
  peerId: Schema.String.pipe(T.HttpPath("peerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  ip: Schema.optional(Schema.String),
  ixfrEnable: Schema.optional(Schema.Boolean).pipe(T.JsonName("ixfr_enable")),
  port: Schema.optional(Schema.Number),
  tsigId: Schema.optional(Schema.String).pipe(T.JsonName("tsig_id")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/secondary_dns/peers/{peerId}",
  }),
) as unknown as Schema.Schema<UpdateZoneTransferPeerRequest>;

export interface UpdateZoneTransferPeerResponse {
  id: string;
  /** The name of the peer. */
  name: string;
  /** IPv4/IPv6 address of primary or secondary nameserver, depending on what zone this peer is linked to. For primary zones this IP defines the IP of the secondary nameserver Cloudflare will NOTIFY upon zo */
  ip?: string;
  /** Enable IXFR transfer protocol, default is AXFR. Only applicable to secondary zones. */
  ixfrEnable?: boolean;
  /** DNS port of primary or secondary nameserver, depending on what zone this peer is linked to. */
  port?: number;
  /** TSIG authentication will be used for zone transfer if configured. */
  tsigId?: string;
}

export const UpdateZoneTransferPeerResponse = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  ip: Schema.optional(Schema.String),
  ixfrEnable: Schema.optional(Schema.Boolean).pipe(T.JsonName("ixfr_enable")),
  port: Schema.optional(Schema.Number),
  tsigId: Schema.optional(Schema.String).pipe(T.JsonName("tsig_id")),
}) as unknown as Schema.Schema<UpdateZoneTransferPeerResponse>;

export const updateZoneTransferPeer: (
  input: UpdateZoneTransferPeerRequest,
) => Effect.Effect<
  UpdateZoneTransferPeerResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateZoneTransferPeerRequest,
  output: UpdateZoneTransferPeerResponse,
  errors: [],
}));

export interface DeleteZoneTransferPeerRequest {
  peerId: string;
  accountId: string;
}

export const DeleteZoneTransferPeerRequest = Schema.Struct({
  peerId: Schema.String.pipe(T.HttpPath("peerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/secondary_dns/peers/{peerId}",
  }),
) as unknown as Schema.Schema<DeleteZoneTransferPeerRequest>;

export interface DeleteZoneTransferPeerResponse {
  id?: string;
}

export const DeleteZoneTransferPeerResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteZoneTransferPeerResponse>;

export const deleteZoneTransferPeer: (
  input: DeleteZoneTransferPeerRequest,
) => Effect.Effect<
  DeleteZoneTransferPeerResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteZoneTransferPeerRequest,
  output: DeleteZoneTransferPeerResponse,
  errors: [],
}));

// =============================================================================
// ZoneTransferTsig
// =============================================================================

export interface GetZoneTransferTsigRequest {
  tsigId: string;
  accountId: string;
}

export const GetZoneTransferTsigRequest = Schema.Struct({
  tsigId: Schema.String.pipe(T.HttpPath("tsigId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/secondary_dns/tsigs/{tsigId}",
  }),
) as unknown as Schema.Schema<GetZoneTransferTsigRequest>;

export interface GetZoneTransferTsigResponse {
  id: string;
  /** TSIG algorithm. */
  algo: string;
  /** TSIG key name. */
  name: string;
  /** TSIG secret. */
  secret: string;
}

export const GetZoneTransferTsigResponse = Schema.Struct({
  id: Schema.String,
  algo: Schema.String,
  name: Schema.String,
  secret: Schema.String,
}) as unknown as Schema.Schema<GetZoneTransferTsigResponse>;

export const getZoneTransferTsig: (
  input: GetZoneTransferTsigRequest,
) => Effect.Effect<
  GetZoneTransferTsigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetZoneTransferTsigRequest,
  output: GetZoneTransferTsigResponse,
  errors: [],
}));

export interface CreateZoneTransferTsigRequest {
  /** Path param: */
  accountId: string;
  /** Body param: TSIG algorithm. */
  algo: string;
  /** Body param: TSIG key name. */
  name: string;
  /** Body param: TSIG secret. */
  secret: string;
}

export const CreateZoneTransferTsigRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  algo: Schema.String,
  name: Schema.String,
  secret: Schema.String,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/secondary_dns/tsigs",
  }),
) as unknown as Schema.Schema<CreateZoneTransferTsigRequest>;

export interface CreateZoneTransferTsigResponse {
  id: string;
  /** TSIG algorithm. */
  algo: string;
  /** TSIG key name. */
  name: string;
  /** TSIG secret. */
  secret: string;
}

export const CreateZoneTransferTsigResponse = Schema.Struct({
  id: Schema.String,
  algo: Schema.String,
  name: Schema.String,
  secret: Schema.String,
}) as unknown as Schema.Schema<CreateZoneTransferTsigResponse>;

export const createZoneTransferTsig: (
  input: CreateZoneTransferTsigRequest,
) => Effect.Effect<
  CreateZoneTransferTsigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateZoneTransferTsigRequest,
  output: CreateZoneTransferTsigResponse,
  errors: [],
}));

export interface UpdateZoneTransferTsigRequest {
  tsigId: string;
  /** Path param: */
  accountId: string;
  /** Body param: TSIG algorithm. */
  algo: string;
  /** Body param: TSIG key name. */
  name: string;
  /** Body param: TSIG secret. */
  secret: string;
}

export const UpdateZoneTransferTsigRequest = Schema.Struct({
  tsigId: Schema.String.pipe(T.HttpPath("tsigId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  algo: Schema.String,
  name: Schema.String,
  secret: Schema.String,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/secondary_dns/tsigs/{tsigId}",
  }),
) as unknown as Schema.Schema<UpdateZoneTransferTsigRequest>;

export interface UpdateZoneTransferTsigResponse {
  id: string;
  /** TSIG algorithm. */
  algo: string;
  /** TSIG key name. */
  name: string;
  /** TSIG secret. */
  secret: string;
}

export const UpdateZoneTransferTsigResponse = Schema.Struct({
  id: Schema.String,
  algo: Schema.String,
  name: Schema.String,
  secret: Schema.String,
}) as unknown as Schema.Schema<UpdateZoneTransferTsigResponse>;

export const updateZoneTransferTsig: (
  input: UpdateZoneTransferTsigRequest,
) => Effect.Effect<
  UpdateZoneTransferTsigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateZoneTransferTsigRequest,
  output: UpdateZoneTransferTsigResponse,
  errors: [],
}));

export interface DeleteZoneTransferTsigRequest {
  tsigId: string;
  accountId: string;
}

export const DeleteZoneTransferTsigRequest = Schema.Struct({
  tsigId: Schema.String.pipe(T.HttpPath("tsigId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/secondary_dns/tsigs/{tsigId}",
  }),
) as unknown as Schema.Schema<DeleteZoneTransferTsigRequest>;

export interface DeleteZoneTransferTsigResponse {
  id?: string;
}

export const DeleteZoneTransferTsigResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteZoneTransferTsigResponse>;

export const deleteZoneTransferTsig: (
  input: DeleteZoneTransferTsigRequest,
) => Effect.Effect<
  DeleteZoneTransferTsigResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteZoneTransferTsigRequest,
  output: DeleteZoneTransferTsigResponse,
  errors: [],
}));
