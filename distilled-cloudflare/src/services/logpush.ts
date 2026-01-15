/**
 * Cloudflare LOGPUSH API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service logpush
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// DatasetField
// =============================================================================

export interface GetDatasetFieldRequest {
  datasetId:
    | "access_requests"
    | "audit_logs"
    | "audit_logs_v2"
    | "biso_user_actions"
    | "casb_findings"
    | "device_posture_results"
    | "dlp_forensic_copies"
    | "dns_firewall_logs"
    | "dns_logs"
    | "email_security_alerts"
    | "firewall_events"
    | "gateway_dns"
    | "gateway_http"
    | "gateway_network"
    | "http_requests"
    | "magic_ids_detections"
    | "nel_reports"
    | "network_analytics_logs"
    | "page_shield_events"
    | "sinkhole_http_logs"
    | "spectrum_events"
    | "ssh_logs"
    | "workers_trace_events"
    | "zaraz_events"
    | "zero_trust_network_sessions"
    | null;
}

export const GetDatasetFieldRequest = Schema.Struct({
  datasetId: Schema.Union(
    Schema.Literal("access_requests"),
    Schema.Literal("audit_logs"),
    Schema.Literal("audit_logs_v2"),
    Schema.Literal("biso_user_actions"),
    Schema.Literal("casb_findings"),
    Schema.Literal("device_posture_results"),
    Schema.Literal("dlp_forensic_copies"),
    Schema.Literal("dns_firewall_logs"),
    Schema.Literal("dns_logs"),
    Schema.Literal("email_security_alerts"),
    Schema.Literal("firewall_events"),
    Schema.Literal("gateway_dns"),
    Schema.Literal("gateway_http"),
    Schema.Literal("gateway_network"),
    Schema.Literal("http_requests"),
    Schema.Literal("magic_ids_detections"),
    Schema.Literal("nel_reports"),
    Schema.Literal("network_analytics_logs"),
    Schema.Literal("page_shield_events"),
    Schema.Literal("sinkhole_http_logs"),
    Schema.Literal("spectrum_events"),
    Schema.Literal("ssh_logs"),
    Schema.Literal("workers_trace_events"),
    Schema.Literal("zaraz_events"),
    Schema.Literal("zero_trust_network_sessions"),
    Schema.Null,
  ).pipe(T.HttpPath("datasetId")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/{accountOrZone}/{accountOrZoneId}/logpush/datasets/{datasetId}/fields",
  }),
) as unknown as Schema.Schema<GetDatasetFieldRequest>;

export type GetDatasetFieldResponse = unknown;

export const GetDatasetFieldResponse =
  Schema.Unknown as unknown as Schema.Schema<GetDatasetFieldResponse>;

export const getDatasetField = API.make(() => ({
  input: GetDatasetFieldRequest,
  output: GetDatasetFieldResponse,
  errors: [],
}));

// =============================================================================
// Edge
// =============================================================================

export interface CreateEdgeRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Comma-separated list of fields. */
  fields?: string;
  /** Body param: Filters to drill down into specific events. */
  filter?: string;
  /** Body param: The sample parameter is the sample rate of the records set by the client: "sample": 1 is 100% of records "sample": 10 is 10% and so on. */
  sample?: number;
}

export const CreateEdgeRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  fields: Schema.optional(Schema.String),
  filter: Schema.optional(Schema.String),
  sample: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/logpush/edge/jobs" }),
) as unknown as Schema.Schema<CreateEdgeRequest>;

export type CreateEdgeResponse = unknown;

export const CreateEdgeResponse = Schema.Unknown as unknown as Schema.Schema<CreateEdgeResponse>;

export const createEdge = API.make(() => ({
  input: CreateEdgeRequest,
  output: CreateEdgeResponse,
  errors: [],
}));

// =============================================================================
// ExistsValidate
// =============================================================================

export interface DestinationExistsValidateRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Uniquely identifies a resource (such as an s3 bucket) where data. will be pushed. Additional configuration parameters supported by the destination may be included. */
  destinationConf: string;
}

export const DestinationExistsValidateRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  destinationConf: Schema.String.pipe(T.JsonName("destination_conf")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/logpush/validate/destination/exists",
  }),
) as unknown as Schema.Schema<DestinationExistsValidateRequest>;

export type DestinationExistsValidateResponse = unknown;

export const DestinationExistsValidateResponse =
  Schema.Unknown as unknown as Schema.Schema<DestinationExistsValidateResponse>;

export const destinationExistsValidate = API.make(() => ({
  input: DestinationExistsValidateRequest,
  output: DestinationExistsValidateResponse,
  errors: [],
}));

// =============================================================================
// Job
// =============================================================================

export interface GetJobRequest {
  jobId: number;
}

export const GetJobRequest = Schema.Struct({
  jobId: Schema.Number.pipe(T.HttpPath("jobId")),
}).pipe(
  T.Http({ method: "GET", path: "/{accountOrZone}/{accountOrZoneId}/logpush/jobs/{jobId}" }),
) as unknown as Schema.Schema<GetJobRequest>;

export type GetJobResponse = unknown;

export const GetJobResponse = Schema.Unknown as unknown as Schema.Schema<GetJobResponse>;

export const getJob = API.make(() => ({
  input: GetJobRequest,
  output: GetJobResponse,
  errors: [],
}));

export interface CreateJobRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Uniquely identifies a resource (such as an s3 bucket) where data. will be pushed. Additional configuration parameters supported by the destination may be included. */
  destinationConf: string;
  /** Body param: Name of the dataset. A list of supported datasets can be found on the [Developer Docs](https://developers.cloudflare.com/logs/reference/log-fields/). */
  dataset?:
    | "access_requests"
    | "audit_logs"
    | "audit_logs_v2"
    | "biso_user_actions"
    | "casb_findings"
    | "device_posture_results"
    | "dlp_forensic_copies"
    | "dns_firewall_logs"
    | "dns_logs"
    | "email_security_alerts"
    | "firewall_events"
    | "gateway_dns"
    | "gateway_http"
    | "gateway_network"
    | "http_requests"
    | "magic_ids_detections"
    | "nel_reports"
    | "network_analytics_logs"
    | "page_shield_events"
    | "sinkhole_http_logs"
    | "spectrum_events"
    | "ssh_logs"
    | "workers_trace_events"
    | "zaraz_events"
    | "zero_trust_network_sessions"
    | null;
  /** Body param: Flag that indicates if the job is enabled. */
  enabled?: boolean;
  /** Body param: The filters to select the events to include and/or remove from your logs. For more information, refer to [Filters](https://developers.cloudflare.com/logs/reference/filters/). */
  filter?: string | null;
  /** @deprecated Body param: This field is deprecated. Please use `max_upload_ ` parameters instead. . The frequency at which Cloudflare sends batches of logs to your destination. Setting frequency to high */
  frequency?: "high" | "low" | null;
  /** Body param: The kind parameter (optional) is used to differentiate between Logpush and Edge Log Delivery jobs (when supported by the dataset). */
  kind?: "" | "edge";
  /** @deprecated Body param: This field is deprecated. Use `output_options` instead. Configuration string. It specifies things like requested fields and timestamp formats. If migrating from the logpull api */
  logpullOptions?: string | null;
  /** Body param: The maximum uncompressed file size of a batch of logs. This setting value must be between `5 MB` and `1 GB`, or `0` to disable it. Note that you cannot set a minimum file size; this means  */
  maxUploadBytes?: "0" | number | null;
  /** Body param: The maximum interval in seconds for log batches. This setting must be between 30 and 300 seconds (5 minutes), or `0` to disable it. Note that you cannot specify a minimum interval for log  */
  maxUploadIntervalSeconds?: "0" | number | null;
  /** Body param: The maximum number of log lines per batch. This setting must be between 1000 and 1,000,000 lines, or `0` to disable it. Note that you cannot specify a minimum number of log lines per batch */
  maxUploadRecords?: "0" | number | null;
  /** Body param: Optional human readable job name. Not unique. Cloudflare suggests. that you set this to a meaningful string, like the domain name, to make it easier to identify your job. */
  name?: string | null;
  /** Body param: The structured replacement for `logpull_options`. When including this field, the `logpull_option` field will be ignored. */
  outputOptions?: {
    batchPrefix?: string | null;
    batchSuffix?: string | null;
    "CVE-2021-44228"?: boolean | null;
    fieldDelimiter?: string | null;
    fieldNames?: string[];
    outputType?: "ndjson" | "csv";
    recordDelimiter?: string | null;
    recordPrefix?: string | null;
    recordSuffix?: string | null;
    recordTemplate?: string | null;
    sampleRate?: number | null;
    timestampFormat?: "unixnano" | "unix" | "rfc3339";
  } | null;
  /** Body param: Ownership challenge token to prove destination ownership. */
  ownershipChallenge?: string;
}

export const CreateJobRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  destinationConf: Schema.String.pipe(T.JsonName("destination_conf")),
  dataset: Schema.optional(
    Schema.Union(
      Schema.Literal("access_requests"),
      Schema.Literal("audit_logs"),
      Schema.Literal("audit_logs_v2"),
      Schema.Literal("biso_user_actions"),
      Schema.Literal("casb_findings"),
      Schema.Literal("device_posture_results"),
      Schema.Literal("dlp_forensic_copies"),
      Schema.Literal("dns_firewall_logs"),
      Schema.Literal("dns_logs"),
      Schema.Literal("email_security_alerts"),
      Schema.Literal("firewall_events"),
      Schema.Literal("gateway_dns"),
      Schema.Literal("gateway_http"),
      Schema.Literal("gateway_network"),
      Schema.Literal("http_requests"),
      Schema.Literal("magic_ids_detections"),
      Schema.Literal("nel_reports"),
      Schema.Literal("network_analytics_logs"),
      Schema.Literal("page_shield_events"),
      Schema.Literal("sinkhole_http_logs"),
      Schema.Literal("spectrum_events"),
      Schema.Literal("ssh_logs"),
      Schema.Literal("workers_trace_events"),
      Schema.Literal("zaraz_events"),
      Schema.Literal("zero_trust_network_sessions"),
      Schema.Null,
    ),
  ),
  enabled: Schema.optional(Schema.Boolean),
  filter: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  frequency: Schema.optional(
    Schema.Union(Schema.Literal("high"), Schema.Literal("low"), Schema.Null),
  ),
  kind: Schema.optional(Schema.Literal("", "edge")),
  logpullOptions: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("logpull_options"),
  ),
  maxUploadBytes: Schema.optional(
    Schema.Union(Schema.Literal("0"), Schema.Number, Schema.Null),
  ).pipe(T.JsonName("max_upload_bytes")),
  maxUploadIntervalSeconds: Schema.optional(
    Schema.Union(Schema.Literal("0"), Schema.Number, Schema.Null),
  ).pipe(T.JsonName("max_upload_interval_seconds")),
  maxUploadRecords: Schema.optional(
    Schema.Union(Schema.Literal("0"), Schema.Number, Schema.Null),
  ).pipe(T.JsonName("max_upload_records")),
  name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  outputOptions: Schema.optional(
    Schema.Union(
      Schema.Struct({
        batchPrefix: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("batch_prefix"),
        ),
        batchSuffix: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("batch_suffix"),
        ),
        "CVE-2021-44228": Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
        fieldDelimiter: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("field_delimiter"),
        ),
        fieldNames: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("field_names")),
        outputType: Schema.optional(Schema.Literal("ndjson", "csv")).pipe(
          T.JsonName("output_type"),
        ),
        recordDelimiter: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("record_delimiter"),
        ),
        recordPrefix: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("record_prefix"),
        ),
        recordSuffix: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("record_suffix"),
        ),
        recordTemplate: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("record_template"),
        ),
        sampleRate: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
          T.JsonName("sample_rate"),
        ),
        timestampFormat: Schema.optional(Schema.Literal("unixnano", "unix", "rfc3339")).pipe(
          T.JsonName("timestamp_format"),
        ),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("output_options")),
  ownershipChallenge: Schema.optional(Schema.String).pipe(T.JsonName("ownership_challenge")),
}).pipe(
  T.Http({ method: "POST", path: "/{accountOrZone}/{accountOrZoneId}/logpush/jobs" }),
) as unknown as Schema.Schema<CreateJobRequest>;

export type CreateJobResponse = unknown;

export const CreateJobResponse = Schema.Unknown as unknown as Schema.Schema<CreateJobResponse>;

export const createJob = API.make(() => ({
  input: CreateJobRequest,
  output: CreateJobResponse,
  errors: [],
}));

export interface UpdateJobRequest {
  jobId: number;
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Uniquely identifies a resource (such as an s3 bucket) where data. will be pushed. Additional configuration parameters supported by the destination may be included. */
  destinationConf?: string;
  /** Body param: Flag that indicates if the job is enabled. */
  enabled?: boolean;
  /** Body param: The filters to select the events to include and/or remove from your logs. For more information, refer to [Filters](https://developers.cloudflare.com/logs/reference/filters/). */
  filter?: string | null;
  /** @deprecated Body param: This field is deprecated. Please use `max_upload_ ` parameters instead. . The frequency at which Cloudflare sends batches of logs to your destination. Setting frequency to high */
  frequency?: "high" | "low" | null;
  /** Body param: The kind parameter (optional) is used to differentiate between Logpush and Edge Log Delivery jobs (when supported by the dataset). */
  kind?: "" | "edge";
  /** @deprecated Body param: This field is deprecated. Use `output_options` instead. Configuration string. It specifies things like requested fields and timestamp formats. If migrating from the logpull api */
  logpullOptions?: string | null;
  /** Body param: The maximum uncompressed file size of a batch of logs. This setting value must be between `5 MB` and `1 GB`, or `0` to disable it. Note that you cannot set a minimum file size; this means  */
  maxUploadBytes?: "0" | number | null;
  /** Body param: The maximum interval in seconds for log batches. This setting must be between 30 and 300 seconds (5 minutes), or `0` to disable it. Note that you cannot specify a minimum interval for log  */
  maxUploadIntervalSeconds?: "0" | number | null;
  /** Body param: The maximum number of log lines per batch. This setting must be between 1000 and 1,000,000 lines, or `0` to disable it. Note that you cannot specify a minimum number of log lines per batch */
  maxUploadRecords?: "0" | number | null;
  /** Body param: Optional human readable job name. Not unique. Cloudflare suggests. that you set this to a meaningful string, like the domain name, to make it easier to identify your job. */
  name?: string | null;
  /** Body param: The structured replacement for `logpull_options`. When including this field, the `logpull_option` field will be ignored. */
  outputOptions?: {
    batchPrefix?: string | null;
    batchSuffix?: string | null;
    "CVE-2021-44228"?: boolean | null;
    fieldDelimiter?: string | null;
    fieldNames?: string[];
    outputType?: "ndjson" | "csv";
    recordDelimiter?: string | null;
    recordPrefix?: string | null;
    recordSuffix?: string | null;
    recordTemplate?: string | null;
    sampleRate?: number | null;
    timestampFormat?: "unixnano" | "unix" | "rfc3339";
  } | null;
  /** Body param: Ownership challenge token to prove destination ownership. */
  ownershipChallenge?: string;
}

export const UpdateJobRequest = Schema.Struct({
  jobId: Schema.Number.pipe(T.HttpPath("jobId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  destinationConf: Schema.optional(Schema.String).pipe(T.JsonName("destination_conf")),
  enabled: Schema.optional(Schema.Boolean),
  filter: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  frequency: Schema.optional(
    Schema.Union(Schema.Literal("high"), Schema.Literal("low"), Schema.Null),
  ),
  kind: Schema.optional(Schema.Literal("", "edge")),
  logpullOptions: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("logpull_options"),
  ),
  maxUploadBytes: Schema.optional(
    Schema.Union(Schema.Literal("0"), Schema.Number, Schema.Null),
  ).pipe(T.JsonName("max_upload_bytes")),
  maxUploadIntervalSeconds: Schema.optional(
    Schema.Union(Schema.Literal("0"), Schema.Number, Schema.Null),
  ).pipe(T.JsonName("max_upload_interval_seconds")),
  maxUploadRecords: Schema.optional(
    Schema.Union(Schema.Literal("0"), Schema.Number, Schema.Null),
  ).pipe(T.JsonName("max_upload_records")),
  name: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  outputOptions: Schema.optional(
    Schema.Union(
      Schema.Struct({
        batchPrefix: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("batch_prefix"),
        ),
        batchSuffix: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("batch_suffix"),
        ),
        "CVE-2021-44228": Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
        fieldDelimiter: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("field_delimiter"),
        ),
        fieldNames: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("field_names")),
        outputType: Schema.optional(Schema.Literal("ndjson", "csv")).pipe(
          T.JsonName("output_type"),
        ),
        recordDelimiter: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("record_delimiter"),
        ),
        recordPrefix: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("record_prefix"),
        ),
        recordSuffix: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("record_suffix"),
        ),
        recordTemplate: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
          T.JsonName("record_template"),
        ),
        sampleRate: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
          T.JsonName("sample_rate"),
        ),
        timestampFormat: Schema.optional(Schema.Literal("unixnano", "unix", "rfc3339")).pipe(
          T.JsonName("timestamp_format"),
        ),
      }),
      Schema.Null,
    ),
  ).pipe(T.JsonName("output_options")),
  ownershipChallenge: Schema.optional(Schema.String).pipe(T.JsonName("ownership_challenge")),
}).pipe(
  T.Http({ method: "PUT", path: "/{accountOrZone}/{accountOrZoneId}/logpush/jobs/{jobId}" }),
) as unknown as Schema.Schema<UpdateJobRequest>;

export type UpdateJobResponse = unknown;

export const UpdateJobResponse = Schema.Unknown as unknown as Schema.Schema<UpdateJobResponse>;

export const updateJob = API.make(() => ({
  input: UpdateJobRequest,
  output: UpdateJobResponse,
  errors: [],
}));

export interface DeleteJobRequest {
  jobId: number;
}

export const DeleteJobRequest = Schema.Struct({
  jobId: Schema.Number.pipe(T.HttpPath("jobId")),
}).pipe(
  T.Http({ method: "DELETE", path: "/{accountOrZone}/{accountOrZoneId}/logpush/jobs/{jobId}" }),
) as unknown as Schema.Schema<DeleteJobRequest>;

export interface DeleteJobResponse {
  /** Unique id of the job. */
  id?: number;
}

export const DeleteJobResponse = Schema.Struct({
  id: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<DeleteJobResponse>;

export const deleteJob = API.make(() => ({
  input: DeleteJobRequest,
  output: DeleteJobResponse,
  errors: [],
}));

// =============================================================================
// Ownership
// =============================================================================

export interface CreateOwnershipRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Uniquely identifies a resource (such as an s3 bucket) where data. will be pushed. Additional configuration parameters supported by the destination may be included. */
  destinationConf: string;
}

export const CreateOwnershipRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  destinationConf: Schema.String.pipe(T.JsonName("destination_conf")),
}).pipe(
  T.Http({ method: "POST", path: "/{accountOrZone}/{accountOrZoneId}/logpush/ownership" }),
) as unknown as Schema.Schema<CreateOwnershipRequest>;

export type CreateOwnershipResponse = unknown;

export const CreateOwnershipResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateOwnershipResponse>;

export const createOwnership = API.make(() => ({
  input: CreateOwnershipRequest,
  output: CreateOwnershipResponse,
  errors: [],
}));

export interface ValidateOwnershipRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Uniquely identifies a resource (such as an s3 bucket) where data. will be pushed. Additional configuration parameters supported by the destination may be included. */
  destinationConf: string;
  /** Body param: Ownership challenge token to prove destination ownership. */
  ownershipChallenge: string;
}

export const ValidateOwnershipRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  destinationConf: Schema.String.pipe(T.JsonName("destination_conf")),
  ownershipChallenge: Schema.String.pipe(T.JsonName("ownership_challenge")),
}).pipe(
  T.Http({ method: "POST", path: "/{accountOrZone}/{accountOrZoneId}/logpush/ownership/validate" }),
) as unknown as Schema.Schema<ValidateOwnershipRequest>;

export type ValidateOwnershipResponse = unknown;

export const ValidateOwnershipResponse =
  Schema.Unknown as unknown as Schema.Schema<ValidateOwnershipResponse>;

export const validateOwnership = API.make(() => ({
  input: ValidateOwnershipRequest,
  output: ValidateOwnershipResponse,
  errors: [],
}));

// =============================================================================
// Validate
// =============================================================================

export interface DestinationValidateRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** Body param: Uniquely identifies a resource (such as an s3 bucket) where data. will be pushed. Additional configuration parameters supported by the destination may be included. */
  destinationConf: string;
}

export const DestinationValidateRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  destinationConf: Schema.String.pipe(T.JsonName("destination_conf")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/{accountOrZone}/{accountOrZoneId}/logpush/validate/destination",
  }),
) as unknown as Schema.Schema<DestinationValidateRequest>;

export type DestinationValidateResponse = unknown;

export const DestinationValidateResponse =
  Schema.Unknown as unknown as Schema.Schema<DestinationValidateResponse>;

export const destinationValidate = API.make(() => ({
  input: DestinationValidateRequest,
  output: DestinationValidateResponse,
  errors: [],
}));

export interface OriginValidateRequest {
  /** Path param: The Account ID to use for this endpoint. Mutually exclusive with the Zone ID. */
  accountId?: string;
  /** Path param: The Zone ID to use for this endpoint. Mutually exclusive with the Account ID. */
  zoneId?: string;
  /** @deprecated Body param: This field is deprecated. Use `output_options` instead. Configuration string. It specifies things like requested fields and timestamp formats. If migrating from the logpull api */
  logpullOptions: string | null;
}

export const OriginValidateRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  logpullOptions: Schema.Union(Schema.String, Schema.Null).pipe(T.JsonName("logpull_options")),
}).pipe(
  T.Http({ method: "POST", path: "/{accountOrZone}/{accountOrZoneId}/logpush/validate/origin" }),
) as unknown as Schema.Schema<OriginValidateRequest>;

export type OriginValidateResponse = unknown;

export const OriginValidateResponse =
  Schema.Unknown as unknown as Schema.Schema<OriginValidateResponse>;

export const originValidate = API.make(() => ({
  input: OriginValidateRequest,
  output: OriginValidateResponse,
  errors: [],
}));
