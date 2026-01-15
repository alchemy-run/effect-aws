/**
 * Cloudflare CUSTOM-HOSTNAMES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service custom-hostnames
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// CertificatePackCertificate
// =============================================================================

export interface PutCertificatePackCertificateRequest {
  customHostnameId: string;
  certificatePackId: string;
  certificateId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: If a custom uploaded certificate is used. */
  customCertificate: string;
  /** Body param: The key for a custom uploaded certificate. */
  customKey: string;
}

export const PutCertificatePackCertificateRequest = Schema.Struct({
  customHostnameId: Schema.String.pipe(T.HttpPath("customHostnameId")),
  certificatePackId: Schema.String.pipe(T.HttpPath("certificatePackId")),
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  customCertificate: Schema.String.pipe(T.JsonName("custom_certificate")),
  customKey: Schema.String.pipe(T.JsonName("custom_key")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/zones/{zone_id}/custom_hostnames/{customHostnameId}/certificate_pack/{certificatePackId}/certificates/{certificateId}",
  }),
) as unknown as Schema.Schema<PutCertificatePackCertificateRequest>;

export interface PutCertificatePackCertificateResponse {
  /** Identifier. */
  id: string;
  /** The custom hostname that will point to your hostname via CNAME. */
  hostname: string;
  ssl: {
    id?: string;
    bundleMethod?: "ubiquitous" | "optimal" | "force";
    certificateAuthority?: "google" | "lets_encrypt" | "ssl_com" | "digicert";
    customCertificate?: string;
    customCsrId?: string;
    customKey?: string;
    expiresOn?: string;
    hosts?: string[];
    issuer?: string;
    method?: "http" | "txt" | "email";
    serialNumber?: string;
    settings?: {
      ciphers?: string[];
      earlyHints?: "on" | "off";
      http2?: "on" | "off";
      minTlsVersion?: "1.0" | "1.1" | "1.2" | "1.3";
      tls_1_3?: "on" | "off";
    };
    signature?: string;
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
    type?: "dv";
    uploadedOn?: string;
    validationErrors?: { message?: string }[];
    validationRecords?: {
      emails?: string[];
      httpBody?: string;
      httpUrl?: string;
      txtName?: string;
      txtValue?: string;
    }[];
    wildcard?: boolean;
  };
  /** This is the time the hostname was created. */
  createdAt?: string;
  /** Unique key/value metadata for this hostname. These are per-hostname (customer) settings. */
  customMetadata?: Record<string, unknown>;
  /** a valid hostname that’s been added to your DNS zone as an A, AAAA, or CNAME record. */
  customOriginServer?: string;
  /** A hostname that will be sent to your custom origin server as SNI for TLS handshake. This can be a valid subdomain of the zone or custom origin server name or the string ':request_host_header:' which w */
  customOriginSni?: string;
  /** This is a record which can be placed to activate a hostname. */
  ownershipVerification?: { name?: string; type?: "txt"; value?: string };
  /** This presents the token to be served by the given http url to activate a hostname. */
  ownershipVerificationHttp?: { httpBody?: string; httpUrl?: string };
  /** Status of the hostname's activation. */
  status?:
    | "active"
    | "pending"
    | "active_redeploying"
    | "moved"
    | "pending_deletion"
    | "deleted"
    | "pending_blocked"
    | "pending_migration"
    | "pending_provisioned"
    | "test_pending"
    | "test_active"
    | "test_active_apex"
    | "test_blocked"
    | "test_failed"
    | "provisioned"
    | "blocked";
  /** These are errors that were encountered while trying to activate a hostname. */
  verificationErrors?: string[];
}

export const PutCertificatePackCertificateResponse = Schema.Struct({
  id: Schema.String,
  hostname: Schema.String,
  ssl: Schema.Struct({
    id: Schema.optional(Schema.String),
    bundleMethod: Schema.optional(Schema.Literal("ubiquitous", "optimal", "force")).pipe(
      T.JsonName("bundle_method"),
    ),
    certificateAuthority: Schema.optional(
      Schema.Literal("google", "lets_encrypt", "ssl_com", "digicert"),
    ).pipe(T.JsonName("certificate_authority")),
    customCertificate: Schema.optional(Schema.String).pipe(T.JsonName("custom_certificate")),
    customCsrId: Schema.optional(Schema.String).pipe(T.JsonName("custom_csr_id")),
    customKey: Schema.optional(Schema.String).pipe(T.JsonName("custom_key")),
    expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
    hosts: Schema.optional(Schema.Array(Schema.String)),
    issuer: Schema.optional(Schema.String),
    method: Schema.optional(Schema.Literal("http", "txt", "email")),
    serialNumber: Schema.optional(Schema.String).pipe(T.JsonName("serial_number")),
    settings: Schema.optional(
      Schema.Struct({
        ciphers: Schema.optional(Schema.Array(Schema.String)),
        earlyHints: Schema.optional(Schema.Literal("on", "off")).pipe(T.JsonName("early_hints")),
        http2: Schema.optional(Schema.Literal("on", "off")),
        minTlsVersion: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")).pipe(
          T.JsonName("min_tls_version"),
        ),
        tls_1_3: Schema.optional(Schema.Literal("on", "off")),
      }),
    ),
    signature: Schema.optional(Schema.String),
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
    type: Schema.optional(Schema.Literal("dv")),
    uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
    validationErrors: Schema.optional(
      Schema.Array(
        Schema.Struct({
          message: Schema.optional(Schema.String),
        }),
      ),
    ).pipe(T.JsonName("validation_errors")),
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
    wildcard: Schema.optional(Schema.Boolean),
  }),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  customMetadata: Schema.optional(Schema.Struct({})).pipe(T.JsonName("custom_metadata")),
  customOriginServer: Schema.optional(Schema.String).pipe(T.JsonName("custom_origin_server")),
  customOriginSni: Schema.optional(Schema.String).pipe(T.JsonName("custom_origin_sni")),
  ownershipVerification: Schema.optional(
    Schema.Struct({
      name: Schema.optional(Schema.String),
      type: Schema.optional(Schema.Literal("txt")),
      value: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("ownership_verification")),
  ownershipVerificationHttp: Schema.optional(
    Schema.Struct({
      httpBody: Schema.optional(Schema.String).pipe(T.JsonName("http_body")),
      httpUrl: Schema.optional(Schema.String).pipe(T.JsonName("http_url")),
    }),
  ).pipe(T.JsonName("ownership_verification_http")),
  status: Schema.optional(
    Schema.Literal(
      "active",
      "pending",
      "active_redeploying",
      "moved",
      "pending_deletion",
      "deleted",
      "pending_blocked",
      "pending_migration",
      "pending_provisioned",
      "test_pending",
      "test_active",
      "test_active_apex",
      "test_blocked",
      "test_failed",
      "provisioned",
      "blocked",
    ),
  ),
  verificationErrors: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("verification_errors"),
  ),
}) as unknown as Schema.Schema<PutCertificatePackCertificateResponse>;

export const putCertificatePackCertificate = API.make(() => ({
  input: PutCertificatePackCertificateRequest,
  output: PutCertificatePackCertificateResponse,
  errors: [],
}));

export interface DeleteCertificatePackCertificateRequest {
  customHostnameId: string;
  certificatePackId: string;
  certificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteCertificatePackCertificateRequest = Schema.Struct({
  customHostnameId: Schema.String.pipe(T.HttpPath("customHostnameId")),
  certificatePackId: Schema.String.pipe(T.HttpPath("certificatePackId")),
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/custom_hostnames/{customHostnameId}/certificate_pack/{certificatePackId}/certificates/{certificateId}",
  }),
) as unknown as Schema.Schema<DeleteCertificatePackCertificateRequest>;

export interface DeleteCertificatePackCertificateResponse {
  /** Identifier. */
  id?: string;
}

export const DeleteCertificatePackCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteCertificatePackCertificateResponse>;

export const deleteCertificatePackCertificate = API.make(() => ({
  input: DeleteCertificatePackCertificateRequest,
  output: DeleteCertificatePackCertificateResponse,
  errors: [],
}));

// =============================================================================
// CustomHostname
// =============================================================================

export interface GetCustomHostnameRequest {
  customHostnameId: string;
  /** Identifier. */
  zoneId: string;
}

export const GetCustomHostnameRequest = Schema.Struct({
  customHostnameId: Schema.String.pipe(T.HttpPath("customHostnameId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/custom_hostnames/{customHostnameId}" }),
) as unknown as Schema.Schema<GetCustomHostnameRequest>;

export interface GetCustomHostnameResponse {
  /** Identifier. */
  id: string;
  /** The custom hostname that will point to your hostname via CNAME. */
  hostname: string;
  ssl: {
    id?: string;
    bundleMethod?: "ubiquitous" | "optimal" | "force";
    certificateAuthority?: "google" | "lets_encrypt" | "ssl_com" | "digicert";
    customCertificate?: string;
    customCsrId?: string;
    customKey?: string;
    expiresOn?: string;
    hosts?: string[];
    issuer?: string;
    method?: "http" | "txt" | "email";
    serialNumber?: string;
    settings?: {
      ciphers?: string[];
      earlyHints?: "on" | "off";
      http2?: "on" | "off";
      minTlsVersion?: "1.0" | "1.1" | "1.2" | "1.3";
      tls_1_3?: "on" | "off";
    };
    signature?: string;
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
    type?: "dv";
    uploadedOn?: string;
    validationErrors?: { message?: string }[];
    validationRecords?: {
      emails?: string[];
      httpBody?: string;
      httpUrl?: string;
      txtName?: string;
      txtValue?: string;
    }[];
    wildcard?: boolean;
  };
  /** This is the time the hostname was created. */
  createdAt?: string;
  /** Unique key/value metadata for this hostname. These are per-hostname (customer) settings. */
  customMetadata?: Record<string, unknown>;
  /** a valid hostname that’s been added to your DNS zone as an A, AAAA, or CNAME record. */
  customOriginServer?: string;
  /** A hostname that will be sent to your custom origin server as SNI for TLS handshake. This can be a valid subdomain of the zone or custom origin server name or the string ':request_host_header:' which w */
  customOriginSni?: string;
  /** This is a record which can be placed to activate a hostname. */
  ownershipVerification?: { name?: string; type?: "txt"; value?: string };
  /** This presents the token to be served by the given http url to activate a hostname. */
  ownershipVerificationHttp?: { httpBody?: string; httpUrl?: string };
  /** Status of the hostname's activation. */
  status?:
    | "active"
    | "pending"
    | "active_redeploying"
    | "moved"
    | "pending_deletion"
    | "deleted"
    | "pending_blocked"
    | "pending_migration"
    | "pending_provisioned"
    | "test_pending"
    | "test_active"
    | "test_active_apex"
    | "test_blocked"
    | "test_failed"
    | "provisioned"
    | "blocked";
  /** These are errors that were encountered while trying to activate a hostname. */
  verificationErrors?: string[];
}

export const GetCustomHostnameResponse = Schema.Struct({
  id: Schema.String,
  hostname: Schema.String,
  ssl: Schema.Struct({
    id: Schema.optional(Schema.String),
    bundleMethod: Schema.optional(Schema.Literal("ubiquitous", "optimal", "force")).pipe(
      T.JsonName("bundle_method"),
    ),
    certificateAuthority: Schema.optional(
      Schema.Literal("google", "lets_encrypt", "ssl_com", "digicert"),
    ).pipe(T.JsonName("certificate_authority")),
    customCertificate: Schema.optional(Schema.String).pipe(T.JsonName("custom_certificate")),
    customCsrId: Schema.optional(Schema.String).pipe(T.JsonName("custom_csr_id")),
    customKey: Schema.optional(Schema.String).pipe(T.JsonName("custom_key")),
    expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
    hosts: Schema.optional(Schema.Array(Schema.String)),
    issuer: Schema.optional(Schema.String),
    method: Schema.optional(Schema.Literal("http", "txt", "email")),
    serialNumber: Schema.optional(Schema.String).pipe(T.JsonName("serial_number")),
    settings: Schema.optional(
      Schema.Struct({
        ciphers: Schema.optional(Schema.Array(Schema.String)),
        earlyHints: Schema.optional(Schema.Literal("on", "off")).pipe(T.JsonName("early_hints")),
        http2: Schema.optional(Schema.Literal("on", "off")),
        minTlsVersion: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")).pipe(
          T.JsonName("min_tls_version"),
        ),
        tls_1_3: Schema.optional(Schema.Literal("on", "off")),
      }),
    ),
    signature: Schema.optional(Schema.String),
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
    type: Schema.optional(Schema.Literal("dv")),
    uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
    validationErrors: Schema.optional(
      Schema.Array(
        Schema.Struct({
          message: Schema.optional(Schema.String),
        }),
      ),
    ).pipe(T.JsonName("validation_errors")),
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
    wildcard: Schema.optional(Schema.Boolean),
  }),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  customMetadata: Schema.optional(Schema.Struct({})).pipe(T.JsonName("custom_metadata")),
  customOriginServer: Schema.optional(Schema.String).pipe(T.JsonName("custom_origin_server")),
  customOriginSni: Schema.optional(Schema.String).pipe(T.JsonName("custom_origin_sni")),
  ownershipVerification: Schema.optional(
    Schema.Struct({
      name: Schema.optional(Schema.String),
      type: Schema.optional(Schema.Literal("txt")),
      value: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("ownership_verification")),
  ownershipVerificationHttp: Schema.optional(
    Schema.Struct({
      httpBody: Schema.optional(Schema.String).pipe(T.JsonName("http_body")),
      httpUrl: Schema.optional(Schema.String).pipe(T.JsonName("http_url")),
    }),
  ).pipe(T.JsonName("ownership_verification_http")),
  status: Schema.optional(
    Schema.Literal(
      "active",
      "pending",
      "active_redeploying",
      "moved",
      "pending_deletion",
      "deleted",
      "pending_blocked",
      "pending_migration",
      "pending_provisioned",
      "test_pending",
      "test_active",
      "test_active_apex",
      "test_blocked",
      "test_failed",
      "provisioned",
      "blocked",
    ),
  ),
  verificationErrors: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("verification_errors"),
  ),
}) as unknown as Schema.Schema<GetCustomHostnameResponse>;

export const getCustomHostname = API.make(() => ({
  input: GetCustomHostnameRequest,
  output: GetCustomHostnameResponse,
  errors: [],
}));

export interface CreateCustomHostnameRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: The custom hostname that will point to your hostname via CNAME. */
  hostname: string;
  /** Body param: SSL properties used when creating the custom hostname. */
  ssl: {
    bundleMethod?: "ubiquitous" | "optimal" | "force";
    certificateAuthority?: "google" | "lets_encrypt" | "ssl_com" | "digicert";
    cloudflareBranding?: boolean;
    customCertBundle?: { customCertificate: string; customKey: string }[];
    customCertificate?: string;
    customKey?: string;
    method?: "http" | "txt" | "email";
    settings?: {
      ciphers?: string[];
      earlyHints?: "on" | "off";
      http2?: "on" | "off";
      minTlsVersion?: "1.0" | "1.1" | "1.2" | "1.3";
      tls_1_3?: "on" | "off";
    };
    type?: "dv";
    wildcard?: boolean;
  };
  /** Body param: Unique key/value metadata for this hostname. These are per-hostname (customer) settings. */
  customMetadata?: Record<string, unknown>;
}

export const CreateCustomHostnameRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  hostname: Schema.String,
  ssl: Schema.Struct({
    bundleMethod: Schema.optional(Schema.Literal("ubiquitous", "optimal", "force")).pipe(
      T.JsonName("bundle_method"),
    ),
    certificateAuthority: Schema.optional(
      Schema.Literal("google", "lets_encrypt", "ssl_com", "digicert"),
    ).pipe(T.JsonName("certificate_authority")),
    cloudflareBranding: Schema.optional(Schema.Boolean).pipe(T.JsonName("cloudflare_branding")),
    customCertBundle: Schema.optional(
      Schema.Array(
        Schema.Struct({
          customCertificate: Schema.String.pipe(T.JsonName("custom_certificate")),
          customKey: Schema.String.pipe(T.JsonName("custom_key")),
        }),
      ),
    ).pipe(T.JsonName("custom_cert_bundle")),
    customCertificate: Schema.optional(Schema.String).pipe(T.JsonName("custom_certificate")),
    customKey: Schema.optional(Schema.String).pipe(T.JsonName("custom_key")),
    method: Schema.optional(Schema.Literal("http", "txt", "email")),
    settings: Schema.optional(
      Schema.Struct({
        ciphers: Schema.optional(Schema.Array(Schema.String)),
        earlyHints: Schema.optional(Schema.Literal("on", "off")).pipe(T.JsonName("early_hints")),
        http2: Schema.optional(Schema.Literal("on", "off")),
        minTlsVersion: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")).pipe(
          T.JsonName("min_tls_version"),
        ),
        tls_1_3: Schema.optional(Schema.Literal("on", "off")),
      }),
    ),
    type: Schema.optional(Schema.Literal("dv")),
    wildcard: Schema.optional(Schema.Boolean),
  }),
  customMetadata: Schema.optional(Schema.Struct({})).pipe(T.JsonName("custom_metadata")),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/custom_hostnames" }),
) as unknown as Schema.Schema<CreateCustomHostnameRequest>;

export interface CreateCustomHostnameResponse {
  /** Identifier. */
  id: string;
  /** The custom hostname that will point to your hostname via CNAME. */
  hostname: string;
  ssl: {
    id?: string;
    bundleMethod?: "ubiquitous" | "optimal" | "force";
    certificateAuthority?: "google" | "lets_encrypt" | "ssl_com" | "digicert";
    customCertificate?: string;
    customCsrId?: string;
    customKey?: string;
    expiresOn?: string;
    hosts?: string[];
    issuer?: string;
    method?: "http" | "txt" | "email";
    serialNumber?: string;
    settings?: {
      ciphers?: string[];
      earlyHints?: "on" | "off";
      http2?: "on" | "off";
      minTlsVersion?: "1.0" | "1.1" | "1.2" | "1.3";
      tls_1_3?: "on" | "off";
    };
    signature?: string;
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
    type?: "dv";
    uploadedOn?: string;
    validationErrors?: { message?: string }[];
    validationRecords?: {
      emails?: string[];
      httpBody?: string;
      httpUrl?: string;
      txtName?: string;
      txtValue?: string;
    }[];
    wildcard?: boolean;
  };
  /** This is the time the hostname was created. */
  createdAt?: string;
  /** Unique key/value metadata for this hostname. These are per-hostname (customer) settings. */
  customMetadata?: Record<string, unknown>;
  /** a valid hostname that’s been added to your DNS zone as an A, AAAA, or CNAME record. */
  customOriginServer?: string;
  /** A hostname that will be sent to your custom origin server as SNI for TLS handshake. This can be a valid subdomain of the zone or custom origin server name or the string ':request_host_header:' which w */
  customOriginSni?: string;
  /** This is a record which can be placed to activate a hostname. */
  ownershipVerification?: { name?: string; type?: "txt"; value?: string };
  /** This presents the token to be served by the given http url to activate a hostname. */
  ownershipVerificationHttp?: { httpBody?: string; httpUrl?: string };
  /** Status of the hostname's activation. */
  status?:
    | "active"
    | "pending"
    | "active_redeploying"
    | "moved"
    | "pending_deletion"
    | "deleted"
    | "pending_blocked"
    | "pending_migration"
    | "pending_provisioned"
    | "test_pending"
    | "test_active"
    | "test_active_apex"
    | "test_blocked"
    | "test_failed"
    | "provisioned"
    | "blocked";
  /** These are errors that were encountered while trying to activate a hostname. */
  verificationErrors?: string[];
}

export const CreateCustomHostnameResponse = Schema.Struct({
  id: Schema.String,
  hostname: Schema.String,
  ssl: Schema.Struct({
    id: Schema.optional(Schema.String),
    bundleMethod: Schema.optional(Schema.Literal("ubiquitous", "optimal", "force")).pipe(
      T.JsonName("bundle_method"),
    ),
    certificateAuthority: Schema.optional(
      Schema.Literal("google", "lets_encrypt", "ssl_com", "digicert"),
    ).pipe(T.JsonName("certificate_authority")),
    customCertificate: Schema.optional(Schema.String).pipe(T.JsonName("custom_certificate")),
    customCsrId: Schema.optional(Schema.String).pipe(T.JsonName("custom_csr_id")),
    customKey: Schema.optional(Schema.String).pipe(T.JsonName("custom_key")),
    expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
    hosts: Schema.optional(Schema.Array(Schema.String)),
    issuer: Schema.optional(Schema.String),
    method: Schema.optional(Schema.Literal("http", "txt", "email")),
    serialNumber: Schema.optional(Schema.String).pipe(T.JsonName("serial_number")),
    settings: Schema.optional(
      Schema.Struct({
        ciphers: Schema.optional(Schema.Array(Schema.String)),
        earlyHints: Schema.optional(Schema.Literal("on", "off")).pipe(T.JsonName("early_hints")),
        http2: Schema.optional(Schema.Literal("on", "off")),
        minTlsVersion: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")).pipe(
          T.JsonName("min_tls_version"),
        ),
        tls_1_3: Schema.optional(Schema.Literal("on", "off")),
      }),
    ),
    signature: Schema.optional(Schema.String),
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
    type: Schema.optional(Schema.Literal("dv")),
    uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
    validationErrors: Schema.optional(
      Schema.Array(
        Schema.Struct({
          message: Schema.optional(Schema.String),
        }),
      ),
    ).pipe(T.JsonName("validation_errors")),
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
    wildcard: Schema.optional(Schema.Boolean),
  }),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  customMetadata: Schema.optional(Schema.Struct({})).pipe(T.JsonName("custom_metadata")),
  customOriginServer: Schema.optional(Schema.String).pipe(T.JsonName("custom_origin_server")),
  customOriginSni: Schema.optional(Schema.String).pipe(T.JsonName("custom_origin_sni")),
  ownershipVerification: Schema.optional(
    Schema.Struct({
      name: Schema.optional(Schema.String),
      type: Schema.optional(Schema.Literal("txt")),
      value: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("ownership_verification")),
  ownershipVerificationHttp: Schema.optional(
    Schema.Struct({
      httpBody: Schema.optional(Schema.String).pipe(T.JsonName("http_body")),
      httpUrl: Schema.optional(Schema.String).pipe(T.JsonName("http_url")),
    }),
  ).pipe(T.JsonName("ownership_verification_http")),
  status: Schema.optional(
    Schema.Literal(
      "active",
      "pending",
      "active_redeploying",
      "moved",
      "pending_deletion",
      "deleted",
      "pending_blocked",
      "pending_migration",
      "pending_provisioned",
      "test_pending",
      "test_active",
      "test_active_apex",
      "test_blocked",
      "test_failed",
      "provisioned",
      "blocked",
    ),
  ),
  verificationErrors: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("verification_errors"),
  ),
}) as unknown as Schema.Schema<CreateCustomHostnameResponse>;

export const createCustomHostname = API.make(() => ({
  input: CreateCustomHostnameRequest,
  output: CreateCustomHostnameResponse,
  errors: [],
}));

export interface PatchCustomHostnameRequest {
  customHostnameId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Unique key/value metadata for this hostname. These are per-hostname (customer) settings. */
  customMetadata?: Record<string, unknown>;
  /** Body param: a valid hostname that’s been added to your DNS zone as an A, AAAA, or CNAME record. */
  customOriginServer?: string;
  /** Body param: A hostname that will be sent to your custom origin server as SNI for TLS handshake. This can be a valid subdomain of the zone or custom origin server name or the string ':request_host_head */
  customOriginSni?: string;
  /** Body param: SSL properties used when creating the custom hostname. */
  ssl?: {
    bundleMethod?: "ubiquitous" | "optimal" | "force";
    certificateAuthority?: "google" | "lets_encrypt" | "ssl_com" | "digicert";
    cloudflareBranding?: boolean;
    customCertBundle?: { customCertificate: string; customKey: string }[];
    customCertificate?: string;
    customKey?: string;
    method?: "http" | "txt" | "email";
    settings?: {
      ciphers?: string[];
      earlyHints?: "on" | "off";
      http2?: "on" | "off";
      minTlsVersion?: "1.0" | "1.1" | "1.2" | "1.3";
      tls_1_3?: "on" | "off";
    };
    type?: "dv";
    wildcard?: boolean;
  };
}

export const PatchCustomHostnameRequest = Schema.Struct({
  customHostnameId: Schema.String.pipe(T.HttpPath("customHostnameId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  customMetadata: Schema.optional(Schema.Struct({})).pipe(T.JsonName("custom_metadata")),
  customOriginServer: Schema.optional(Schema.String).pipe(T.JsonName("custom_origin_server")),
  customOriginSni: Schema.optional(Schema.String).pipe(T.JsonName("custom_origin_sni")),
  ssl: Schema.optional(
    Schema.Struct({
      bundleMethod: Schema.optional(Schema.Literal("ubiquitous", "optimal", "force")).pipe(
        T.JsonName("bundle_method"),
      ),
      certificateAuthority: Schema.optional(
        Schema.Literal("google", "lets_encrypt", "ssl_com", "digicert"),
      ).pipe(T.JsonName("certificate_authority")),
      cloudflareBranding: Schema.optional(Schema.Boolean).pipe(T.JsonName("cloudflare_branding")),
      customCertBundle: Schema.optional(
        Schema.Array(
          Schema.Struct({
            customCertificate: Schema.String.pipe(T.JsonName("custom_certificate")),
            customKey: Schema.String.pipe(T.JsonName("custom_key")),
          }),
        ),
      ).pipe(T.JsonName("custom_cert_bundle")),
      customCertificate: Schema.optional(Schema.String).pipe(T.JsonName("custom_certificate")),
      customKey: Schema.optional(Schema.String).pipe(T.JsonName("custom_key")),
      method: Schema.optional(Schema.Literal("http", "txt", "email")),
      settings: Schema.optional(
        Schema.Struct({
          ciphers: Schema.optional(Schema.Array(Schema.String)),
          earlyHints: Schema.optional(Schema.Literal("on", "off")).pipe(T.JsonName("early_hints")),
          http2: Schema.optional(Schema.Literal("on", "off")),
          minTlsVersion: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")).pipe(
            T.JsonName("min_tls_version"),
          ),
          tls_1_3: Schema.optional(Schema.Literal("on", "off")),
        }),
      ),
      type: Schema.optional(Schema.Literal("dv")),
      wildcard: Schema.optional(Schema.Boolean),
    }),
  ),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/custom_hostnames/{customHostnameId}" }),
) as unknown as Schema.Schema<PatchCustomHostnameRequest>;

export interface PatchCustomHostnameResponse {
  /** Identifier. */
  id: string;
  /** The custom hostname that will point to your hostname via CNAME. */
  hostname: string;
  ssl: {
    id?: string;
    bundleMethod?: "ubiquitous" | "optimal" | "force";
    certificateAuthority?: "google" | "lets_encrypt" | "ssl_com" | "digicert";
    customCertificate?: string;
    customCsrId?: string;
    customKey?: string;
    expiresOn?: string;
    hosts?: string[];
    issuer?: string;
    method?: "http" | "txt" | "email";
    serialNumber?: string;
    settings?: {
      ciphers?: string[];
      earlyHints?: "on" | "off";
      http2?: "on" | "off";
      minTlsVersion?: "1.0" | "1.1" | "1.2" | "1.3";
      tls_1_3?: "on" | "off";
    };
    signature?: string;
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
    type?: "dv";
    uploadedOn?: string;
    validationErrors?: { message?: string }[];
    validationRecords?: {
      emails?: string[];
      httpBody?: string;
      httpUrl?: string;
      txtName?: string;
      txtValue?: string;
    }[];
    wildcard?: boolean;
  };
  /** This is the time the hostname was created. */
  createdAt?: string;
  /** Unique key/value metadata for this hostname. These are per-hostname (customer) settings. */
  customMetadata?: Record<string, unknown>;
  /** a valid hostname that’s been added to your DNS zone as an A, AAAA, or CNAME record. */
  customOriginServer?: string;
  /** A hostname that will be sent to your custom origin server as SNI for TLS handshake. This can be a valid subdomain of the zone or custom origin server name or the string ':request_host_header:' which w */
  customOriginSni?: string;
  /** This is a record which can be placed to activate a hostname. */
  ownershipVerification?: { name?: string; type?: "txt"; value?: string };
  /** This presents the token to be served by the given http url to activate a hostname. */
  ownershipVerificationHttp?: { httpBody?: string; httpUrl?: string };
  /** Status of the hostname's activation. */
  status?:
    | "active"
    | "pending"
    | "active_redeploying"
    | "moved"
    | "pending_deletion"
    | "deleted"
    | "pending_blocked"
    | "pending_migration"
    | "pending_provisioned"
    | "test_pending"
    | "test_active"
    | "test_active_apex"
    | "test_blocked"
    | "test_failed"
    | "provisioned"
    | "blocked";
  /** These are errors that were encountered while trying to activate a hostname. */
  verificationErrors?: string[];
}

export const PatchCustomHostnameResponse = Schema.Struct({
  id: Schema.String,
  hostname: Schema.String,
  ssl: Schema.Struct({
    id: Schema.optional(Schema.String),
    bundleMethod: Schema.optional(Schema.Literal("ubiquitous", "optimal", "force")).pipe(
      T.JsonName("bundle_method"),
    ),
    certificateAuthority: Schema.optional(
      Schema.Literal("google", "lets_encrypt", "ssl_com", "digicert"),
    ).pipe(T.JsonName("certificate_authority")),
    customCertificate: Schema.optional(Schema.String).pipe(T.JsonName("custom_certificate")),
    customCsrId: Schema.optional(Schema.String).pipe(T.JsonName("custom_csr_id")),
    customKey: Schema.optional(Schema.String).pipe(T.JsonName("custom_key")),
    expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
    hosts: Schema.optional(Schema.Array(Schema.String)),
    issuer: Schema.optional(Schema.String),
    method: Schema.optional(Schema.Literal("http", "txt", "email")),
    serialNumber: Schema.optional(Schema.String).pipe(T.JsonName("serial_number")),
    settings: Schema.optional(
      Schema.Struct({
        ciphers: Schema.optional(Schema.Array(Schema.String)),
        earlyHints: Schema.optional(Schema.Literal("on", "off")).pipe(T.JsonName("early_hints")),
        http2: Schema.optional(Schema.Literal("on", "off")),
        minTlsVersion: Schema.optional(Schema.Literal("1.0", "1.1", "1.2", "1.3")).pipe(
          T.JsonName("min_tls_version"),
        ),
        tls_1_3: Schema.optional(Schema.Literal("on", "off")),
      }),
    ),
    signature: Schema.optional(Schema.String),
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
    type: Schema.optional(Schema.Literal("dv")),
    uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
    validationErrors: Schema.optional(
      Schema.Array(
        Schema.Struct({
          message: Schema.optional(Schema.String),
        }),
      ),
    ).pipe(T.JsonName("validation_errors")),
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
    wildcard: Schema.optional(Schema.Boolean),
  }),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  customMetadata: Schema.optional(Schema.Struct({})).pipe(T.JsonName("custom_metadata")),
  customOriginServer: Schema.optional(Schema.String).pipe(T.JsonName("custom_origin_server")),
  customOriginSni: Schema.optional(Schema.String).pipe(T.JsonName("custom_origin_sni")),
  ownershipVerification: Schema.optional(
    Schema.Struct({
      name: Schema.optional(Schema.String),
      type: Schema.optional(Schema.Literal("txt")),
      value: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("ownership_verification")),
  ownershipVerificationHttp: Schema.optional(
    Schema.Struct({
      httpBody: Schema.optional(Schema.String).pipe(T.JsonName("http_body")),
      httpUrl: Schema.optional(Schema.String).pipe(T.JsonName("http_url")),
    }),
  ).pipe(T.JsonName("ownership_verification_http")),
  status: Schema.optional(
    Schema.Literal(
      "active",
      "pending",
      "active_redeploying",
      "moved",
      "pending_deletion",
      "deleted",
      "pending_blocked",
      "pending_migration",
      "pending_provisioned",
      "test_pending",
      "test_active",
      "test_active_apex",
      "test_blocked",
      "test_failed",
      "provisioned",
      "blocked",
    ),
  ),
  verificationErrors: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("verification_errors"),
  ),
}) as unknown as Schema.Schema<PatchCustomHostnameResponse>;

export const patchCustomHostname = API.make(() => ({
  input: PatchCustomHostnameRequest,
  output: PatchCustomHostnameResponse,
  errors: [],
}));

export interface DeleteCustomHostnameRequest {
  customHostnameId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteCustomHostnameRequest = Schema.Struct({
  customHostnameId: Schema.String.pipe(T.HttpPath("customHostnameId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/custom_hostnames/{customHostnameId}" }),
) as unknown as Schema.Schema<DeleteCustomHostnameRequest>;

export interface DeleteCustomHostnameResponse {
  /** Identifier. */
  id?: string;
}

export const DeleteCustomHostnameResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteCustomHostnameResponse>;

export const deleteCustomHostname = API.make(() => ({
  input: DeleteCustomHostnameRequest,
  output: DeleteCustomHostnameResponse,
  errors: [],
}));

// =============================================================================
// FallbackOrigin
// =============================================================================

export interface GetFallbackOriginRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetFallbackOriginRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/custom_hostnames/fallback_origin" }),
) as unknown as Schema.Schema<GetFallbackOriginRequest>;

export interface GetFallbackOriginResponse {
  /** This is the time the fallback origin was created. */
  createdAt?: string;
  /** These are errors that were encountered while trying to activate a fallback origin. */
  errors?: string[];
  /** Your origin hostname that requests to your custom hostnames will be sent to. */
  origin?: string;
  /** Status of the fallback origin's activation. */
  status?:
    | "initializing"
    | "pending_deployment"
    | "pending_deletion"
    | "active"
    | "deployment_timed_out"
    | "deletion_timed_out";
  /** This is the time the fallback origin was updated. */
  updatedAt?: string;
}

export const GetFallbackOriginResponse = Schema.Struct({
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  errors: Schema.optional(Schema.Array(Schema.String)),
  origin: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Literal(
      "initializing",
      "pending_deployment",
      "pending_deletion",
      "active",
      "deployment_timed_out",
      "deletion_timed_out",
    ),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<GetFallbackOriginResponse>;

export const getFallbackOrigin = API.make(() => ({
  input: GetFallbackOriginRequest,
  output: GetFallbackOriginResponse,
  errors: [],
}));

export interface PutFallbackOriginRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Your origin hostname that requests to your custom hostnames will be sent to. */
  origin: string;
}

export const PutFallbackOriginRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  origin: Schema.String,
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/custom_hostnames/fallback_origin" }),
) as unknown as Schema.Schema<PutFallbackOriginRequest>;

export interface PutFallbackOriginResponse {
  /** This is the time the fallback origin was created. */
  createdAt?: string;
  /** These are errors that were encountered while trying to activate a fallback origin. */
  errors?: string[];
  /** Your origin hostname that requests to your custom hostnames will be sent to. */
  origin?: string;
  /** Status of the fallback origin's activation. */
  status?:
    | "initializing"
    | "pending_deployment"
    | "pending_deletion"
    | "active"
    | "deployment_timed_out"
    | "deletion_timed_out";
  /** This is the time the fallback origin was updated. */
  updatedAt?: string;
}

export const PutFallbackOriginResponse = Schema.Struct({
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  errors: Schema.optional(Schema.Array(Schema.String)),
  origin: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Literal(
      "initializing",
      "pending_deployment",
      "pending_deletion",
      "active",
      "deployment_timed_out",
      "deletion_timed_out",
    ),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<PutFallbackOriginResponse>;

export const putFallbackOrigin = API.make(() => ({
  input: PutFallbackOriginRequest,
  output: PutFallbackOriginResponse,
  errors: [],
}));

export interface DeleteFallbackOriginRequest {
  /** Identifier. */
  zoneId: string;
}

export const DeleteFallbackOriginRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/custom_hostnames/fallback_origin" }),
) as unknown as Schema.Schema<DeleteFallbackOriginRequest>;

export interface DeleteFallbackOriginResponse {
  /** This is the time the fallback origin was created. */
  createdAt?: string;
  /** These are errors that were encountered while trying to activate a fallback origin. */
  errors?: string[];
  /** Your origin hostname that requests to your custom hostnames will be sent to. */
  origin?: string;
  /** Status of the fallback origin's activation. */
  status?:
    | "initializing"
    | "pending_deployment"
    | "pending_deletion"
    | "active"
    | "deployment_timed_out"
    | "deletion_timed_out";
  /** This is the time the fallback origin was updated. */
  updatedAt?: string;
}

export const DeleteFallbackOriginResponse = Schema.Struct({
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  errors: Schema.optional(Schema.Array(Schema.String)),
  origin: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Literal(
      "initializing",
      "pending_deployment",
      "pending_deletion",
      "active",
      "deployment_timed_out",
      "deletion_timed_out",
    ),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<DeleteFallbackOriginResponse>;

export const deleteFallbackOrigin = API.make(() => ({
  input: DeleteFallbackOriginRequest,
  output: DeleteFallbackOriginResponse,
  errors: [],
}));
