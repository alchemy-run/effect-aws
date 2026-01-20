/**
 * Cloudflare SSL API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service ssl
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
// Analyze
// =============================================================================

export interface CreateAnalyzeRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: A ubiquitous bundle has the highest probability of being verified everywhere, even by clients using outdated or unusual trust stores. An optimal bundle uses the shortest chain and newest i */
  bundleMethod?: "ubiquitous" | "optimal" | "force";
  /** Body param: The zone's SSL certificate or certificate and the intermediate(s). */
  certificate?: string;
}

export const CreateAnalyzeRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  bundleMethod: Schema.optional(
    Schema.Literal("ubiquitous", "optimal", "force"),
  ).pipe(T.JsonName("bundle_method")),
  certificate: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/ssl/analyze" }),
) as unknown as Schema.Schema<CreateAnalyzeRequest>;

export type CreateAnalyzeResponse = unknown;

export const CreateAnalyzeResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateAnalyzeResponse>;

export const createAnalyze: (
  input: CreateAnalyzeRequest,
) => Effect.Effect<
  CreateAnalyzeResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateAnalyzeRequest,
  output: CreateAnalyzeResponse,
  errors: [],
}));

// =============================================================================
// CertificatePack
// =============================================================================

export interface GetCertificatePackRequest {
  certificatePackId: string;
  /** Identifier. */
  zoneId: string;
}

export const GetCertificatePackRequest = Schema.Struct({
  certificatePackId: Schema.String.pipe(T.HttpPath("certificatePackId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/ssl/certificate_packs/{certificatePackId}",
  }),
) as unknown as Schema.Schema<GetCertificatePackRequest>;

export type GetCertificatePackResponse = unknown;

export const GetCertificatePackResponse =
  Schema.Unknown as unknown as Schema.Schema<GetCertificatePackResponse>;

export const getCertificatePack: (
  input: GetCertificatePackRequest,
) => Effect.Effect<
  GetCertificatePackResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetCertificatePackRequest,
  output: GetCertificatePackResponse,
  errors: [],
}));

export interface CreateCertificatePackRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Certificate Authority selected for the order. For information on any certificate authority specific details or restrictions [see this page for more details.](https://developers.cloudflare. */
  certificateAuthority: "google" | "lets_encrypt" | "ssl_com";
  /** Body param: Comma separated list of valid host names for the certificate packs. Must contain the zone apex, may not contain more than 50 hosts, and may not be empty. */
  hosts: string[];
  /** Body param: Type of certificate pack. */
  type: "advanced";
  /** Body param: Validation Method selected for the order. */
  validationMethod: "txt" | "http" | "email";
  /** Body param: Validity Days selected for the order. */
  validityDays: "14" | "30" | "90" | "365";
  /** Body param: Whether or not to add Cloudflare Branding for the order. This will add a subdomain of sni.cloudflaressl.com as the Common Name if set to true. */
  cloudflareBranding?: boolean;
}

export const CreateCertificatePackRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  certificateAuthority: Schema.Literal(
    "google",
    "lets_encrypt",
    "ssl_com",
  ).pipe(T.JsonName("certificate_authority")),
  hosts: Schema.Array(Schema.String),
  type: Schema.Literal("advanced"),
  validationMethod: Schema.Literal("txt", "http", "email").pipe(
    T.JsonName("validation_method"),
  ),
  validityDays: Schema.Literal("14", "30", "90", "365").pipe(
    T.JsonName("validity_days"),
  ),
  cloudflareBranding: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("cloudflare_branding"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/zones/{zone_id}/ssl/certificate_packs/order",
  }),
) as unknown as Schema.Schema<CreateCertificatePackRequest>;

export interface CreateCertificatePackResponse {
  /** Identifier. */
  id?: string;
  /** Certificate Authority selected for the order. For information on any certificate authority specific details or restrictions [see this page for more details.](https://developers.cloudflare.com/ssl/refe */
  certificateAuthority?: "google" | "lets_encrypt" | "ssl_com";
  /** Whether or not to add Cloudflare Branding for the order. This will add a subdomain of sni.cloudflaressl.com as the Common Name if set to true. */
  cloudflareBranding?: boolean;
  /** Comma separated list of valid host names for the certificate packs. Must contain the zone apex, may not contain more than 50 hosts, and may not be empty. */
  hosts?: string[];
  /** Status of certificate pack. */
  status?:
    | "initializing"
    | "pending_validation"
    | "deleted"
    | "pending_issuance"
    | "pending_deployment"
    | "pending_deletion"
    | "pending_expiration"
    | "expired"
    | "active"
    | "initializing_timed_out"
    | "validation_timed_out"
    | "issuance_timed_out"
    | "deployment_timed_out"
    | "deletion_timed_out"
    | "pending_cleanup"
    | "staging_deployment"
    | "staging_active"
    | "deactivating"
    | "inactive"
    | "backup_issued"
    | "holding_deployment";
  /** Type of certificate pack. */
  type?:
    | "mh_custom"
    | "managed_hostname"
    | "sni_custom"
    | "universal"
    | "advanced"
    | "total_tls"
    | "keyless"
    | "legacy_custom";
  /** Domain validation errors that have been received by the certificate authority (CA). */
  validationErrors?: { message?: string }[];
  /** Validation Method selected for the order. */
  validationMethod?: "txt" | "http" | "email";
  /** Certificates' validation records. Only present when certificate pack is in "pending_validation" status */
  validationRecords?: {
    emails?: string[];
    httpBody?: string;
    httpUrl?: string;
    txtName?: string;
    txtValue?: string;
  }[];
  /** Validity Days selected for the order. */
  validityDays?: "14" | "30" | "90" | "365";
}

export const CreateCertificatePackResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificateAuthority: Schema.optional(
    Schema.Literal("google", "lets_encrypt", "ssl_com"),
  ).pipe(T.JsonName("certificate_authority")),
  cloudflareBranding: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("cloudflare_branding"),
  ),
  hosts: Schema.optional(Schema.Array(Schema.String)),
  status: Schema.optional(
    Schema.Literal(
      "initializing",
      "pending_validation",
      "deleted",
      "pending_issuance",
      "pending_deployment",
      "pending_deletion",
      "pending_expiration",
      "expired",
      "active",
      "initializing_timed_out",
      "validation_timed_out",
      "issuance_timed_out",
      "deployment_timed_out",
      "deletion_timed_out",
      "pending_cleanup",
      "staging_deployment",
      "staging_active",
      "deactivating",
      "inactive",
      "backup_issued",
      "holding_deployment",
    ),
  ),
  type: Schema.optional(
    Schema.Literal(
      "mh_custom",
      "managed_hostname",
      "sni_custom",
      "universal",
      "advanced",
      "total_tls",
      "keyless",
      "legacy_custom",
    ),
  ),
  validationErrors: Schema.optional(
    Schema.Array(
      Schema.Struct({
        message: Schema.optional(Schema.String),
      }),
    ),
  ).pipe(T.JsonName("validation_errors")),
  validationMethod: Schema.optional(
    Schema.Literal("txt", "http", "email"),
  ).pipe(T.JsonName("validation_method")),
  validationRecords: Schema.optional(
    Schema.Array(
      Schema.Struct({
        emails: Schema.optional(Schema.Array(Schema.String)),
        httpBody: Schema.optional(Schema.String).pipe(T.JsonName("http_body")),
        httpUrl: Schema.optional(Schema.String).pipe(T.JsonName("http_url")),
        txtName: Schema.optional(Schema.String).pipe(T.JsonName("txt_name")),
        txtValue: Schema.optional(Schema.String).pipe(T.JsonName("txt_value")),
      }),
    ),
  ).pipe(T.JsonName("validation_records")),
  validityDays: Schema.optional(Schema.Literal("14", "30", "90", "365")).pipe(
    T.JsonName("validity_days"),
  ),
}) as unknown as Schema.Schema<CreateCertificatePackResponse>;

export const createCertificatePack: (
  input: CreateCertificatePackRequest,
) => Effect.Effect<
  CreateCertificatePackResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateCertificatePackRequest,
  output: CreateCertificatePackResponse,
  errors: [],
}));

export interface PatchCertificatePackRequest {
  certificatePackId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Whether or not to add Cloudflare Branding for the order. This will add a subdomain of sni.cloudflaressl.com as the Common Name if set to true. */
  cloudflareBranding?: boolean;
}

export const PatchCertificatePackRequest = Schema.Struct({
  certificatePackId: Schema.String.pipe(T.HttpPath("certificatePackId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  cloudflareBranding: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("cloudflare_branding"),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/zones/{zone_id}/ssl/certificate_packs/{certificatePackId}",
  }),
) as unknown as Schema.Schema<PatchCertificatePackRequest>;

export interface PatchCertificatePackResponse {
  /** Identifier. */
  id?: string;
  /** Certificate Authority selected for the order. For information on any certificate authority specific details or restrictions [see this page for more details.](https://developers.cloudflare.com/ssl/refe */
  certificateAuthority?: "google" | "lets_encrypt" | "ssl_com";
  /** Whether or not to add Cloudflare Branding for the order. This will add a subdomain of sni.cloudflaressl.com as the Common Name if set to true. */
  cloudflareBranding?: boolean;
  /** Comma separated list of valid host names for the certificate packs. Must contain the zone apex, may not contain more than 50 hosts, and may not be empty. */
  hosts?: string[];
  /** Status of certificate pack. */
  status?:
    | "initializing"
    | "pending_validation"
    | "deleted"
    | "pending_issuance"
    | "pending_deployment"
    | "pending_deletion"
    | "pending_expiration"
    | "expired"
    | "active"
    | "initializing_timed_out"
    | "validation_timed_out"
    | "issuance_timed_out"
    | "deployment_timed_out"
    | "deletion_timed_out"
    | "pending_cleanup"
    | "staging_deployment"
    | "staging_active"
    | "deactivating"
    | "inactive"
    | "backup_issued"
    | "holding_deployment";
  /** Type of certificate pack. */
  type?:
    | "mh_custom"
    | "managed_hostname"
    | "sni_custom"
    | "universal"
    | "advanced"
    | "total_tls"
    | "keyless"
    | "legacy_custom";
  /** Domain validation errors that have been received by the certificate authority (CA). */
  validationErrors?: { message?: string }[];
  /** Validation Method selected for the order. */
  validationMethod?: "txt" | "http" | "email";
  /** Certificates' validation records. Only present when certificate pack is in "pending_validation" status */
  validationRecords?: {
    emails?: string[];
    httpBody?: string;
    httpUrl?: string;
    txtName?: string;
    txtValue?: string;
  }[];
  /** Validity Days selected for the order. */
  validityDays?: "14" | "30" | "90" | "365";
}

export const PatchCertificatePackResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificateAuthority: Schema.optional(
    Schema.Literal("google", "lets_encrypt", "ssl_com"),
  ).pipe(T.JsonName("certificate_authority")),
  cloudflareBranding: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("cloudflare_branding"),
  ),
  hosts: Schema.optional(Schema.Array(Schema.String)),
  status: Schema.optional(
    Schema.Literal(
      "initializing",
      "pending_validation",
      "deleted",
      "pending_issuance",
      "pending_deployment",
      "pending_deletion",
      "pending_expiration",
      "expired",
      "active",
      "initializing_timed_out",
      "validation_timed_out",
      "issuance_timed_out",
      "deployment_timed_out",
      "deletion_timed_out",
      "pending_cleanup",
      "staging_deployment",
      "staging_active",
      "deactivating",
      "inactive",
      "backup_issued",
      "holding_deployment",
    ),
  ),
  type: Schema.optional(
    Schema.Literal(
      "mh_custom",
      "managed_hostname",
      "sni_custom",
      "universal",
      "advanced",
      "total_tls",
      "keyless",
      "legacy_custom",
    ),
  ),
  validationErrors: Schema.optional(
    Schema.Array(
      Schema.Struct({
        message: Schema.optional(Schema.String),
      }),
    ),
  ).pipe(T.JsonName("validation_errors")),
  validationMethod: Schema.optional(
    Schema.Literal("txt", "http", "email"),
  ).pipe(T.JsonName("validation_method")),
  validationRecords: Schema.optional(
    Schema.Array(
      Schema.Struct({
        emails: Schema.optional(Schema.Array(Schema.String)),
        httpBody: Schema.optional(Schema.String).pipe(T.JsonName("http_body")),
        httpUrl: Schema.optional(Schema.String).pipe(T.JsonName("http_url")),
        txtName: Schema.optional(Schema.String).pipe(T.JsonName("txt_name")),
        txtValue: Schema.optional(Schema.String).pipe(T.JsonName("txt_value")),
      }),
    ),
  ).pipe(T.JsonName("validation_records")),
  validityDays: Schema.optional(Schema.Literal("14", "30", "90", "365")).pipe(
    T.JsonName("validity_days"),
  ),
}) as unknown as Schema.Schema<PatchCertificatePackResponse>;

export const patchCertificatePack: (
  input: PatchCertificatePackRequest,
) => Effect.Effect<
  PatchCertificatePackResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchCertificatePackRequest,
  output: PatchCertificatePackResponse,
  errors: [],
}));

export interface DeleteCertificatePackRequest {
  certificatePackId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteCertificatePackRequest = Schema.Struct({
  certificatePackId: Schema.String.pipe(T.HttpPath("certificatePackId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/ssl/certificate_packs/{certificatePackId}",
  }),
) as unknown as Schema.Schema<DeleteCertificatePackRequest>;

export interface DeleteCertificatePackResponse {
  /** Identifier. */
  id?: string;
}

export const DeleteCertificatePackResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteCertificatePackResponse>;

export const deleteCertificatePack: (
  input: DeleteCertificatePackRequest,
) => Effect.Effect<
  DeleteCertificatePackResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteCertificatePackRequest,
  output: DeleteCertificatePackResponse,
  errors: [],
}));

// =============================================================================
// CertificatePackQuota
// =============================================================================

export interface GetCertificatePackQuotaRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetCertificatePackQuotaRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/ssl/certificate_packs/quota",
  }),
) as unknown as Schema.Schema<GetCertificatePackQuotaRequest>;

export interface GetCertificatePackQuotaResponse {
  advanced?: { allocated?: number; used?: number };
}

export const GetCertificatePackQuotaResponse = Schema.Struct({
  advanced: Schema.optional(
    Schema.Struct({
      allocated: Schema.optional(Schema.Number),
      used: Schema.optional(Schema.Number),
    }),
  ),
}) as unknown as Schema.Schema<GetCertificatePackQuotaResponse>;

export const getCertificatePackQuota: (
  input: GetCertificatePackQuotaRequest,
) => Effect.Effect<
  GetCertificatePackQuotaResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetCertificatePackQuotaRequest,
  output: GetCertificatePackQuotaResponse,
  errors: [],
}));

// =============================================================================
// Recommendation
// =============================================================================

export interface GetRecommendationRequest {
  zoneId: string;
}

export const GetRecommendationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/ssl/recommendation" }),
) as unknown as Schema.Schema<GetRecommendationRequest>;

export interface GetRecommendationResponse {
  id: string;
  /** Whether this setting can be updated or not. */
  editable: boolean;
  /** Last time this setting was modified. */
  modifiedOn: string;
  /** Current setting of the automatic SSL/TLS. */
  value: "auto" | "custom";
  /** Next time this zone will be scanned by the Automatic SSL/TLS. */
  nextScheduledScan?: string | null;
}

export const GetRecommendationResponse = Schema.Struct({
  id: Schema.String,
  editable: Schema.Boolean,
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  value: Schema.Literal("auto", "custom"),
  nextScheduledScan: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.JsonName("next_scheduled_scan")),
}) as unknown as Schema.Schema<GetRecommendationResponse>;

export const getRecommendation: (
  input: GetRecommendationRequest,
) => Effect.Effect<
  GetRecommendationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRecommendationRequest,
  output: GetRecommendationResponse,
  errors: [],
}));

// =============================================================================
// UniversalSetting
// =============================================================================

export interface GetUniversalSettingRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetUniversalSettingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/ssl/universal/settings" }),
) as unknown as Schema.Schema<GetUniversalSettingRequest>;

export interface GetUniversalSettingResponse {
  /** Disabling Universal SSL removes any currently active Universal SSL certificates for your zone from the edge and prevents any future Universal SSL certificates from being ordered. If there are no advan */
  enabled?: boolean;
}

export const GetUniversalSettingResponse = Schema.Struct({
  enabled: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<GetUniversalSettingResponse>;

export const getUniversalSetting: (
  input: GetUniversalSettingRequest,
) => Effect.Effect<
  GetUniversalSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetUniversalSettingRequest,
  output: GetUniversalSettingResponse,
  errors: [],
}));

export interface PatchUniversalSettingRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Disabling Universal SSL removes any currently active Universal SSL certificates for your zone from the edge and prevents any future Universal SSL certificates from being ordered. If there  */
  enabled?: boolean;
}

export const PatchUniversalSettingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  enabled: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/ssl/universal/settings" }),
) as unknown as Schema.Schema<PatchUniversalSettingRequest>;

export interface PatchUniversalSettingResponse {
  /** Disabling Universal SSL removes any currently active Universal SSL certificates for your zone from the edge and prevents any future Universal SSL certificates from being ordered. If there are no advan */
  enabled?: boolean;
}

export const PatchUniversalSettingResponse = Schema.Struct({
  enabled: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<PatchUniversalSettingResponse>;

export const patchUniversalSetting: (
  input: PatchUniversalSettingRequest,
) => Effect.Effect<
  PatchUniversalSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchUniversalSettingRequest,
  output: PatchUniversalSettingResponse,
  errors: [],
}));

// =============================================================================
// Verification
// =============================================================================

export interface GetVerificationRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: Immediately retry SSL Verification. */
  retry?: true;
}

export const GetVerificationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  retry: Schema.optional(Schema.Literal(true)).pipe(T.HttpQuery("retry")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/ssl/verification" }),
) as unknown as Schema.Schema<GetVerificationRequest>;

export type GetVerificationResponse = {
  certificateStatus:
    | "initializing"
    | "authorizing"
    | "active"
    | "expired"
    | "issuing"
    | "timing_out"
    | "pending_deployment";
  brandCheck?: boolean;
  certPackUuid?: string;
  signature?: "ECDSAWithSHA256" | "SHA1WithRSA" | "SHA256WithRSA";
  validationMethod?: "http" | "cname" | "txt";
  verificationInfo?: {
    recordName?: "record_name" | "http_url" | "cname" | "txt_name";
    recordTarget?: "record_value" | "http_body" | "cname_target" | "txt_value";
  };
  verificationStatus?: boolean;
  verificationType?: "cname" | "meta tag";
}[];

export const GetVerificationResponse = Schema.Array(
  Schema.Struct({
    certificateStatus: Schema.Literal(
      "initializing",
      "authorizing",
      "active",
      "expired",
      "issuing",
      "timing_out",
      "pending_deployment",
    ).pipe(T.JsonName("certificate_status")),
    brandCheck: Schema.optional(Schema.Boolean).pipe(T.JsonName("brand_check")),
    certPackUuid: Schema.optional(Schema.String).pipe(
      T.JsonName("cert_pack_uuid"),
    ),
    signature: Schema.optional(
      Schema.Literal("ECDSAWithSHA256", "SHA1WithRSA", "SHA256WithRSA"),
    ),
    validationMethod: Schema.optional(
      Schema.Literal("http", "cname", "txt"),
    ).pipe(T.JsonName("validation_method")),
    verificationInfo: Schema.optional(
      Schema.Struct({
        recordName: Schema.optional(
          Schema.Literal("record_name", "http_url", "cname", "txt_name"),
        ).pipe(T.JsonName("record_name")),
        recordTarget: Schema.optional(
          Schema.Literal(
            "record_value",
            "http_body",
            "cname_target",
            "txt_value",
          ),
        ).pipe(T.JsonName("record_target")),
      }),
    ).pipe(T.JsonName("verification_info")),
    verificationStatus: Schema.optional(Schema.Boolean).pipe(
      T.JsonName("verification_status"),
    ),
    verificationType: Schema.optional(Schema.Literal("cname", "meta tag")).pipe(
      T.JsonName("verification_type"),
    ),
  }),
) as unknown as Schema.Schema<GetVerificationResponse>;

export const getVerification: (
  input: GetVerificationRequest,
) => Effect.Effect<
  GetVerificationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetVerificationRequest,
  output: GetVerificationResponse,
  errors: [],
}));

export interface PatchVerificationRequest {
  certificatePackId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Desired validation method. */
  validationMethod: "http" | "cname" | "txt" | "email";
}

export const PatchVerificationRequest = Schema.Struct({
  certificatePackId: Schema.String.pipe(T.HttpPath("certificatePackId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  validationMethod: Schema.Literal("http", "cname", "txt", "email").pipe(
    T.JsonName("validation_method"),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/zones/{zone_id}/ssl/verification/{certificatePackId}",
  }),
) as unknown as Schema.Schema<PatchVerificationRequest>;

export interface PatchVerificationResponse {
  /** Result status. */
  status?: string;
  /** Desired validation method. */
  validationMethod?: "http" | "cname" | "txt" | "email";
}

export const PatchVerificationResponse = Schema.Struct({
  status: Schema.optional(Schema.String),
  validationMethod: Schema.optional(
    Schema.Literal("http", "cname", "txt", "email"),
  ).pipe(T.JsonName("validation_method")),
}) as unknown as Schema.Schema<PatchVerificationResponse>;

export const patchVerification: (
  input: PatchVerificationRequest,
) => Effect.Effect<
  PatchVerificationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchVerificationRequest,
  output: PatchVerificationResponse,
  errors: [],
}));
