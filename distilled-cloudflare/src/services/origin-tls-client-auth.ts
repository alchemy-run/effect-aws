/**
 * Cloudflare ORIGIN-TLS-CLIENT-AUTH API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service origin-tls-client-auth
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
// Hostname
// =============================================================================

export interface GetHostnameRequest {
  hostname: string;
  /** Identifier. */
  zoneId: string;
}

export const GetHostnameRequest = Schema.Struct({
  hostname: Schema.String.pipe(T.HttpPath("hostname")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/origin_tls_client_auth/hostnames/{hostname}",
  }),
) as unknown as Schema.Schema<GetHostnameRequest>;

export interface GetHostnameResponse {
  /** Identifier. */
  certId?: string;
  /** Status of the certificate or the association. */
  certStatus?:
    | "initializing"
    | "pending_deployment"
    | "pending_deletion"
    | "active"
    | "deleted"
    | "deployment_timed_out"
    | "deletion_timed_out";
  /** The time when the certificate was updated. */
  certUpdatedAt?: string;
  /** The time when the certificate was uploaded. */
  certUploadedOn?: string;
  /** The hostname certificate. */
  certificate?: string;
  /** The time when the certificate was created. */
  createdAt?: string;
  /** Indicates whether hostname-level authenticated origin pulls is enabled. A null value voids the association. */
  enabled?: boolean | null;
  /** The date when the certificate expires. */
  expiresOn?: string;
  /** The hostname on the origin for which the client certificate uploaded will be used. */
  hostname?: string;
  /** The certificate authority that issued the certificate. */
  issuer?: string;
  /** The serial number on the uploaded certificate. */
  serialNumber?: string;
  /** The type of hash used for the certificate. */
  signature?: string;
  /** Status of the certificate or the association. */
  status?:
    | "initializing"
    | "pending_deployment"
    | "pending_deletion"
    | "active"
    | "deleted"
    | "deployment_timed_out"
    | "deletion_timed_out";
  /** The time when the certificate was updated. */
  updatedAt?: string;
}

export const GetHostnameResponse = Schema.Struct({
  certId: Schema.optional(Schema.String).pipe(T.JsonName("cert_id")),
  certStatus: Schema.optional(
    Schema.Literal(
      "initializing",
      "pending_deployment",
      "pending_deletion",
      "active",
      "deleted",
      "deployment_timed_out",
      "deletion_timed_out",
    ),
  ).pipe(T.JsonName("cert_status")),
  certUpdatedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("cert_updated_at"),
  ),
  certUploadedOn: Schema.optional(Schema.String).pipe(
    T.JsonName("cert_uploaded_on"),
  ),
  certificate: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  hostname: Schema.optional(Schema.String),
  issuer: Schema.optional(Schema.String),
  serialNumber: Schema.optional(Schema.String).pipe(
    T.JsonName("serial_number"),
  ),
  signature: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Literal(
      "initializing",
      "pending_deployment",
      "pending_deletion",
      "active",
      "deleted",
      "deployment_timed_out",
      "deletion_timed_out",
    ),
  ),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
}) as unknown as Schema.Schema<GetHostnameResponse>;

export const getHostname: (
  input: GetHostnameRequest,
) => Effect.Effect<
  GetHostnameResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHostnameRequest,
  output: GetHostnameResponse,
  errors: [],
}));

// =============================================================================
// HostnameCertificate
// =============================================================================

export interface GetHostnameCertificateRequest {
  certificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const GetHostnameCertificateRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/origin_tls_client_auth/hostnames/certificates/{certificateId}",
  }),
) as unknown as Schema.Schema<GetHostnameCertificateRequest>;

export interface GetHostnameCertificateResponse {
  /** Identifier. */
  id?: string;
  /** The hostname certificate. */
  certificate?: string;
  /** The date when the certificate expires. */
  expiresOn?: string;
  /** The certificate authority that issued the certificate. */
  issuer?: string;
  /** The serial number on the uploaded certificate. */
  serialNumber?: string;
  /** The type of hash used for the certificate. */
  signature?: string;
  /** Status of the certificate or the association. */
  status?:
    | "initializing"
    | "pending_deployment"
    | "pending_deletion"
    | "active"
    | "deleted"
    | "deployment_timed_out"
    | "deletion_timed_out";
  /** The time when the certificate was uploaded. */
  uploadedOn?: string;
}

export const GetHostnameCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  issuer: Schema.optional(Schema.String),
  serialNumber: Schema.optional(Schema.String).pipe(
    T.JsonName("serial_number"),
  ),
  signature: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Literal(
      "initializing",
      "pending_deployment",
      "pending_deletion",
      "active",
      "deleted",
      "deployment_timed_out",
      "deletion_timed_out",
    ),
  ),
  uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
}) as unknown as Schema.Schema<GetHostnameCertificateResponse>;

export const getHostnameCertificate: (
  input: GetHostnameCertificateRequest,
) => Effect.Effect<
  GetHostnameCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetHostnameCertificateRequest,
  output: GetHostnameCertificateResponse,
  errors: [],
}));

export interface CreateHostnameCertificateRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: The hostname certificate. */
  certificate: string;
  /** Body param: The hostname certificate's private key. */
  privateKey: string;
}

export const CreateHostnameCertificateRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  certificate: Schema.String,
  privateKey: Schema.String.pipe(T.JsonName("private_key")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/zones/{zone_id}/origin_tls_client_auth/hostnames/certificates",
  }),
) as unknown as Schema.Schema<CreateHostnameCertificateRequest>;

export interface CreateHostnameCertificateResponse {
  /** Identifier. */
  id?: string;
  /** The hostname certificate. */
  certificate?: string;
  /** The date when the certificate expires. */
  expiresOn?: string;
  /** The certificate authority that issued the certificate. */
  issuer?: string;
  /** The serial number on the uploaded certificate. */
  serialNumber?: string;
  /** The type of hash used for the certificate. */
  signature?: string;
  /** Status of the certificate or the association. */
  status?:
    | "initializing"
    | "pending_deployment"
    | "pending_deletion"
    | "active"
    | "deleted"
    | "deployment_timed_out"
    | "deletion_timed_out";
  /** The time when the certificate was uploaded. */
  uploadedOn?: string;
}

export const CreateHostnameCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  issuer: Schema.optional(Schema.String),
  serialNumber: Schema.optional(Schema.String).pipe(
    T.JsonName("serial_number"),
  ),
  signature: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Literal(
      "initializing",
      "pending_deployment",
      "pending_deletion",
      "active",
      "deleted",
      "deployment_timed_out",
      "deletion_timed_out",
    ),
  ),
  uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
}) as unknown as Schema.Schema<CreateHostnameCertificateResponse>;

export const createHostnameCertificate: (
  input: CreateHostnameCertificateRequest,
) => Effect.Effect<
  CreateHostnameCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateHostnameCertificateRequest,
  output: CreateHostnameCertificateResponse,
  errors: [],
}));

export interface DeleteHostnameCertificateRequest {
  certificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteHostnameCertificateRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/origin_tls_client_auth/hostnames/certificates/{certificateId}",
  }),
) as unknown as Schema.Schema<DeleteHostnameCertificateRequest>;

export interface DeleteHostnameCertificateResponse {
  /** Identifier. */
  id?: string;
  /** The hostname certificate. */
  certificate?: string;
  /** The date when the certificate expires. */
  expiresOn?: string;
  /** The certificate authority that issued the certificate. */
  issuer?: string;
  /** The serial number on the uploaded certificate. */
  serialNumber?: string;
  /** The type of hash used for the certificate. */
  signature?: string;
  /** Status of the certificate or the association. */
  status?:
    | "initializing"
    | "pending_deployment"
    | "pending_deletion"
    | "active"
    | "deleted"
    | "deployment_timed_out"
    | "deletion_timed_out";
  /** The time when the certificate was uploaded. */
  uploadedOn?: string;
}

export const DeleteHostnameCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  issuer: Schema.optional(Schema.String),
  serialNumber: Schema.optional(Schema.String).pipe(
    T.JsonName("serial_number"),
  ),
  signature: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Literal(
      "initializing",
      "pending_deployment",
      "pending_deletion",
      "active",
      "deleted",
      "deployment_timed_out",
      "deletion_timed_out",
    ),
  ),
  uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
}) as unknown as Schema.Schema<DeleteHostnameCertificateResponse>;

export const deleteHostnameCertificate: (
  input: DeleteHostnameCertificateRequest,
) => Effect.Effect<
  DeleteHostnameCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteHostnameCertificateRequest,
  output: DeleteHostnameCertificateResponse,
  errors: [],
}));

// =============================================================================
// OriginTlsClientAuth
// =============================================================================

export interface GetOriginTlsClientAuthRequest {
  certificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const GetOriginTlsClientAuthRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/origin_tls_client_auth/{certificateId}",
  }),
) as unknown as Schema.Schema<GetOriginTlsClientAuthRequest>;

export interface GetOriginTlsClientAuthResponse {
  /** Identifier. */
  id?: string;
  /** The zone's leaf certificate. */
  certificate?: string;
  /** Indicates whether zone-level authenticated origin pulls is enabled. */
  enabled?: boolean;
  /** The zone's private key. */
  privateKey?: string;
}

export const GetOriginTlsClientAuthResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  privateKey: Schema.optional(Schema.String).pipe(T.JsonName("private_key")),
}) as unknown as Schema.Schema<GetOriginTlsClientAuthResponse>;

export const getOriginTlsClientAuth: (
  input: GetOriginTlsClientAuthRequest,
) => Effect.Effect<
  GetOriginTlsClientAuthResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetOriginTlsClientAuthRequest,
  output: GetOriginTlsClientAuthResponse,
  errors: [],
}));

export interface CreateOriginTlsClientAuthRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: The zone's leaf certificate. */
  certificate: string;
  /** Body param: The zone's private key. */
  privateKey: string;
}

export const CreateOriginTlsClientAuthRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  certificate: Schema.String,
  privateKey: Schema.String.pipe(T.JsonName("private_key")),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/origin_tls_client_auth" }),
) as unknown as Schema.Schema<CreateOriginTlsClientAuthRequest>;

export interface CreateOriginTlsClientAuthResponse {
  /** Identifier. */
  id?: string;
  /** The zone's leaf certificate. */
  certificate?: string;
  /** Indicates whether zone-level authenticated origin pulls is enabled. */
  enabled?: boolean;
  /** The zone's private key. */
  privateKey?: string;
}

export const CreateOriginTlsClientAuthResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  privateKey: Schema.optional(Schema.String).pipe(T.JsonName("private_key")),
}) as unknown as Schema.Schema<CreateOriginTlsClientAuthResponse>;

export const createOriginTlsClientAuth: (
  input: CreateOriginTlsClientAuthRequest,
) => Effect.Effect<
  CreateOriginTlsClientAuthResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateOriginTlsClientAuthRequest,
  output: CreateOriginTlsClientAuthResponse,
  errors: [],
}));

export interface DeleteOriginTlsClientAuthRequest {
  certificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteOriginTlsClientAuthRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/origin_tls_client_auth/{certificateId}",
  }),
) as unknown as Schema.Schema<DeleteOriginTlsClientAuthRequest>;

export interface DeleteOriginTlsClientAuthResponse {
  /** Identifier. */
  id?: string;
  /** The zone's leaf certificate. */
  certificate?: string;
  /** Indicates whether zone-level authenticated origin pulls is enabled. */
  enabled?: boolean;
  /** The zone's private key. */
  privateKey?: string;
}

export const DeleteOriginTlsClientAuthResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  enabled: Schema.optional(Schema.Boolean),
  privateKey: Schema.optional(Schema.String).pipe(T.JsonName("private_key")),
}) as unknown as Schema.Schema<DeleteOriginTlsClientAuthResponse>;

export const deleteOriginTlsClientAuth: (
  input: DeleteOriginTlsClientAuthRequest,
) => Effect.Effect<
  DeleteOriginTlsClientAuthResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteOriginTlsClientAuthRequest,
  output: DeleteOriginTlsClientAuthResponse,
  errors: [],
}));

// =============================================================================
// Setting
// =============================================================================

export interface GetSettingRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetSettingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/origin_tls_client_auth/settings",
  }),
) as unknown as Schema.Schema<GetSettingRequest>;

export interface GetSettingResponse {
  /** Indicates whether zone-level authenticated origin pulls is enabled. */
  enabled?: boolean;
}

export const GetSettingResponse = Schema.Struct({
  enabled: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<GetSettingResponse>;

export const getSetting: (
  input: GetSettingRequest,
) => Effect.Effect<
  GetSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSettingRequest,
  output: GetSettingResponse,
  errors: [],
}));

export interface PutSettingRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Indicates whether zone-level authenticated origin pulls is enabled. */
  enabled: boolean;
}

export const PutSettingRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  enabled: Schema.Boolean,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/zones/{zone_id}/origin_tls_client_auth/settings",
  }),
) as unknown as Schema.Schema<PutSettingRequest>;

export interface PutSettingResponse {
  /** Indicates whether zone-level authenticated origin pulls is enabled. */
  enabled?: boolean;
}

export const PutSettingResponse = Schema.Struct({
  enabled: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<PutSettingResponse>;

export const putSetting: (
  input: PutSettingRequest,
) => Effect.Effect<
  PutSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutSettingRequest,
  output: PutSettingResponse,
  errors: [],
}));
