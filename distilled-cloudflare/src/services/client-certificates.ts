/**
 * Cloudflare CLIENT-CERTIFICATES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service client-certificates
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
// ClientCertificate
// =============================================================================

export interface GetClientCertificateRequest {
  clientCertificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const GetClientCertificateRequest = Schema.Struct({
  clientCertificateId: Schema.String.pipe(T.HttpPath("clientCertificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/client_certificates/{clientCertificateId}",
  }),
) as unknown as Schema.Schema<GetClientCertificateRequest>;

export interface GetClientCertificateResponse {
  /** Identifier. */
  id?: string;
  /** The Client Certificate PEM */
  certificate?: string;
  /** Certificate Authority used to issue the Client Certificate */
  certificateAuthority?: { id?: string; name?: string };
  /** Common Name of the Client Certificate */
  commonName?: string;
  /** Country, provided by the CSR */
  country?: string;
  /** The Certificate Signing Request (CSR). Must be newline-encoded. */
  csr?: string;
  /** Date that the Client Certificate expires */
  expiresOn?: string;
  /** Unique identifier of the Client Certificate */
  fingerprintSha256?: string;
  /** Date that the Client Certificate was issued by the Certificate Authority */
  issuedOn?: string;
  /** Location, provided by the CSR */
  location?: string;
  /** Organization, provided by the CSR */
  organization?: string;
  /** Organizational Unit, provided by the CSR */
  organizationalUnit?: string;
  /** The serial number on the created Client Certificate. */
  serialNumber?: string;
  /** The type of hash used for the Client Certificate.. */
  signature?: string;
  /** Subject Key Identifier */
  ski?: string;
  /** State, provided by the CSR */
  state?: string;
  /** Client Certificates may be active or revoked, and the pending_reactivation or pending_revocation represent in-progress asynchronous transitions */
  status?: "active" | "pending_reactivation" | "pending_revocation" | "revoked";
  /** The number of days the Client Certificate will be valid after the issued_on date */
  validityDays?: number;
}

export const GetClientCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  certificateAuthority: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      name: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("certificate_authority")),
  commonName: Schema.optional(Schema.String).pipe(T.JsonName("common_name")),
  country: Schema.optional(Schema.String),
  csr: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprintSha256: Schema.optional(Schema.String).pipe(
    T.JsonName("fingerprint_sha256"),
  ),
  issuedOn: Schema.optional(Schema.String).pipe(T.JsonName("issued_on")),
  location: Schema.optional(Schema.String),
  organization: Schema.optional(Schema.String),
  organizationalUnit: Schema.optional(Schema.String).pipe(
    T.JsonName("organizational_unit"),
  ),
  serialNumber: Schema.optional(Schema.String).pipe(
    T.JsonName("serial_number"),
  ),
  signature: Schema.optional(Schema.String),
  ski: Schema.optional(Schema.String),
  state: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Literal(
      "active",
      "pending_reactivation",
      "pending_revocation",
      "revoked",
    ),
  ),
  validityDays: Schema.optional(Schema.Number).pipe(
    T.JsonName("validity_days"),
  ),
}) as unknown as Schema.Schema<GetClientCertificateResponse>;

export const getClientCertificate: (
  input: GetClientCertificateRequest,
) => Effect.Effect<
  GetClientCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetClientCertificateRequest,
  output: GetClientCertificateResponse,
  errors: [],
}));

export interface CreateClientCertificateRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: The Certificate Signing Request (CSR). Must be newline-encoded. */
  csr: string;
  /** Body param: The number of days the Client Certificate will be valid after the issued_on date */
  validityDays: number;
}

export const CreateClientCertificateRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  csr: Schema.String,
  validityDays: Schema.Number.pipe(T.JsonName("validity_days")),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/client_certificates" }),
) as unknown as Schema.Schema<CreateClientCertificateRequest>;

export interface CreateClientCertificateResponse {
  /** Identifier. */
  id?: string;
  /** The Client Certificate PEM */
  certificate?: string;
  /** Certificate Authority used to issue the Client Certificate */
  certificateAuthority?: { id?: string; name?: string };
  /** Common Name of the Client Certificate */
  commonName?: string;
  /** Country, provided by the CSR */
  country?: string;
  /** The Certificate Signing Request (CSR). Must be newline-encoded. */
  csr?: string;
  /** Date that the Client Certificate expires */
  expiresOn?: string;
  /** Unique identifier of the Client Certificate */
  fingerprintSha256?: string;
  /** Date that the Client Certificate was issued by the Certificate Authority */
  issuedOn?: string;
  /** Location, provided by the CSR */
  location?: string;
  /** Organization, provided by the CSR */
  organization?: string;
  /** Organizational Unit, provided by the CSR */
  organizationalUnit?: string;
  /** The serial number on the created Client Certificate. */
  serialNumber?: string;
  /** The type of hash used for the Client Certificate.. */
  signature?: string;
  /** Subject Key Identifier */
  ski?: string;
  /** State, provided by the CSR */
  state?: string;
  /** Client Certificates may be active or revoked, and the pending_reactivation or pending_revocation represent in-progress asynchronous transitions */
  status?: "active" | "pending_reactivation" | "pending_revocation" | "revoked";
  /** The number of days the Client Certificate will be valid after the issued_on date */
  validityDays?: number;
}

export const CreateClientCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  certificateAuthority: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      name: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("certificate_authority")),
  commonName: Schema.optional(Schema.String).pipe(T.JsonName("common_name")),
  country: Schema.optional(Schema.String),
  csr: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprintSha256: Schema.optional(Schema.String).pipe(
    T.JsonName("fingerprint_sha256"),
  ),
  issuedOn: Schema.optional(Schema.String).pipe(T.JsonName("issued_on")),
  location: Schema.optional(Schema.String),
  organization: Schema.optional(Schema.String),
  organizationalUnit: Schema.optional(Schema.String).pipe(
    T.JsonName("organizational_unit"),
  ),
  serialNumber: Schema.optional(Schema.String).pipe(
    T.JsonName("serial_number"),
  ),
  signature: Schema.optional(Schema.String),
  ski: Schema.optional(Schema.String),
  state: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Literal(
      "active",
      "pending_reactivation",
      "pending_revocation",
      "revoked",
    ),
  ),
  validityDays: Schema.optional(Schema.Number).pipe(
    T.JsonName("validity_days"),
  ),
}) as unknown as Schema.Schema<CreateClientCertificateResponse>;

export const createClientCertificate: (
  input: CreateClientCertificateRequest,
) => Effect.Effect<
  CreateClientCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateClientCertificateRequest,
  output: CreateClientCertificateResponse,
  errors: [],
}));

export interface PatchClientCertificateRequest {
  clientCertificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const PatchClientCertificateRequest = Schema.Struct({
  clientCertificateId: Schema.String.pipe(T.HttpPath("clientCertificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/zones/{zone_id}/client_certificates/{clientCertificateId}",
  }),
) as unknown as Schema.Schema<PatchClientCertificateRequest>;

export interface PatchClientCertificateResponse {
  /** Identifier. */
  id?: string;
  /** The Client Certificate PEM */
  certificate?: string;
  /** Certificate Authority used to issue the Client Certificate */
  certificateAuthority?: { id?: string; name?: string };
  /** Common Name of the Client Certificate */
  commonName?: string;
  /** Country, provided by the CSR */
  country?: string;
  /** The Certificate Signing Request (CSR). Must be newline-encoded. */
  csr?: string;
  /** Date that the Client Certificate expires */
  expiresOn?: string;
  /** Unique identifier of the Client Certificate */
  fingerprintSha256?: string;
  /** Date that the Client Certificate was issued by the Certificate Authority */
  issuedOn?: string;
  /** Location, provided by the CSR */
  location?: string;
  /** Organization, provided by the CSR */
  organization?: string;
  /** Organizational Unit, provided by the CSR */
  organizationalUnit?: string;
  /** The serial number on the created Client Certificate. */
  serialNumber?: string;
  /** The type of hash used for the Client Certificate.. */
  signature?: string;
  /** Subject Key Identifier */
  ski?: string;
  /** State, provided by the CSR */
  state?: string;
  /** Client Certificates may be active or revoked, and the pending_reactivation or pending_revocation represent in-progress asynchronous transitions */
  status?: "active" | "pending_reactivation" | "pending_revocation" | "revoked";
  /** The number of days the Client Certificate will be valid after the issued_on date */
  validityDays?: number;
}

export const PatchClientCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  certificateAuthority: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      name: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("certificate_authority")),
  commonName: Schema.optional(Schema.String).pipe(T.JsonName("common_name")),
  country: Schema.optional(Schema.String),
  csr: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprintSha256: Schema.optional(Schema.String).pipe(
    T.JsonName("fingerprint_sha256"),
  ),
  issuedOn: Schema.optional(Schema.String).pipe(T.JsonName("issued_on")),
  location: Schema.optional(Schema.String),
  organization: Schema.optional(Schema.String),
  organizationalUnit: Schema.optional(Schema.String).pipe(
    T.JsonName("organizational_unit"),
  ),
  serialNumber: Schema.optional(Schema.String).pipe(
    T.JsonName("serial_number"),
  ),
  signature: Schema.optional(Schema.String),
  ski: Schema.optional(Schema.String),
  state: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Literal(
      "active",
      "pending_reactivation",
      "pending_revocation",
      "revoked",
    ),
  ),
  validityDays: Schema.optional(Schema.Number).pipe(
    T.JsonName("validity_days"),
  ),
}) as unknown as Schema.Schema<PatchClientCertificateResponse>;

export const patchClientCertificate: (
  input: PatchClientCertificateRequest,
) => Effect.Effect<
  PatchClientCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchClientCertificateRequest,
  output: PatchClientCertificateResponse,
  errors: [],
}));

export interface DeleteClientCertificateRequest {
  clientCertificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteClientCertificateRequest = Schema.Struct({
  clientCertificateId: Schema.String.pipe(T.HttpPath("clientCertificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/client_certificates/{clientCertificateId}",
  }),
) as unknown as Schema.Schema<DeleteClientCertificateRequest>;

export interface DeleteClientCertificateResponse {
  /** Identifier. */
  id?: string;
  /** The Client Certificate PEM */
  certificate?: string;
  /** Certificate Authority used to issue the Client Certificate */
  certificateAuthority?: { id?: string; name?: string };
  /** Common Name of the Client Certificate */
  commonName?: string;
  /** Country, provided by the CSR */
  country?: string;
  /** The Certificate Signing Request (CSR). Must be newline-encoded. */
  csr?: string;
  /** Date that the Client Certificate expires */
  expiresOn?: string;
  /** Unique identifier of the Client Certificate */
  fingerprintSha256?: string;
  /** Date that the Client Certificate was issued by the Certificate Authority */
  issuedOn?: string;
  /** Location, provided by the CSR */
  location?: string;
  /** Organization, provided by the CSR */
  organization?: string;
  /** Organizational Unit, provided by the CSR */
  organizationalUnit?: string;
  /** The serial number on the created Client Certificate. */
  serialNumber?: string;
  /** The type of hash used for the Client Certificate.. */
  signature?: string;
  /** Subject Key Identifier */
  ski?: string;
  /** State, provided by the CSR */
  state?: string;
  /** Client Certificates may be active or revoked, and the pending_reactivation or pending_revocation represent in-progress asynchronous transitions */
  status?: "active" | "pending_reactivation" | "pending_revocation" | "revoked";
  /** The number of days the Client Certificate will be valid after the issued_on date */
  validityDays?: number;
}

export const DeleteClientCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  certificateAuthority: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
      name: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("certificate_authority")),
  commonName: Schema.optional(Schema.String).pipe(T.JsonName("common_name")),
  country: Schema.optional(Schema.String),
  csr: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  fingerprintSha256: Schema.optional(Schema.String).pipe(
    T.JsonName("fingerprint_sha256"),
  ),
  issuedOn: Schema.optional(Schema.String).pipe(T.JsonName("issued_on")),
  location: Schema.optional(Schema.String),
  organization: Schema.optional(Schema.String),
  organizationalUnit: Schema.optional(Schema.String).pipe(
    T.JsonName("organizational_unit"),
  ),
  serialNumber: Schema.optional(Schema.String).pipe(
    T.JsonName("serial_number"),
  ),
  signature: Schema.optional(Schema.String),
  ski: Schema.optional(Schema.String),
  state: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Literal(
      "active",
      "pending_reactivation",
      "pending_revocation",
      "revoked",
    ),
  ),
  validityDays: Schema.optional(Schema.Number).pipe(
    T.JsonName("validity_days"),
  ),
}) as unknown as Schema.Schema<DeleteClientCertificateResponse>;

export const deleteClientCertificate: (
  input: DeleteClientCertificateRequest,
) => Effect.Effect<
  DeleteClientCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteClientCertificateRequest,
  output: DeleteClientCertificateResponse,
  errors: [],
}));
