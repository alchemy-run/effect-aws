/**
 * Cloudflare MTLS-CERTIFICATES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service mtls-certificates
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// MtlsCertificate
// =============================================================================

export interface GetMtlsCertificateRequest {
  mtlsCertificateId: string;
  /** Identifier. */
  accountId: string;
}

export const GetMtlsCertificateRequest = Schema.Struct({
  mtlsCertificateId: Schema.String.pipe(T.HttpPath("mtlsCertificateId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/mtls_certificates/{mtlsCertificateId}" }),
) as unknown as Schema.Schema<GetMtlsCertificateRequest>;

export interface GetMtlsCertificateResponse {
  /** Identifier. */
  id?: string;
  /** Indicates whether the certificate is a CA or leaf certificate. */
  ca?: boolean;
  /** The uploaded root CA certificate. */
  certificates?: string;
  /** When the certificate expires. */
  expiresOn?: string;
  /** The certificate authority that issued the certificate. */
  issuer?: string;
  /** Optional unique name for the certificate. Only used for human readability. */
  name?: string;
  /** The certificate serial number. */
  serialNumber?: string;
  /** The type of hash used for the certificate. */
  signature?: string;
  /** This is the time the certificate was uploaded. */
  uploadedOn?: string;
}

export const GetMtlsCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  ca: Schema.optional(Schema.Boolean),
  certificates: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  issuer: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  serialNumber: Schema.optional(Schema.String).pipe(T.JsonName("serial_number")),
  signature: Schema.optional(Schema.String),
  uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
}) as unknown as Schema.Schema<GetMtlsCertificateResponse>;

export const getMtlsCertificate = API.make(() => ({
  input: GetMtlsCertificateRequest,
  output: GetMtlsCertificateResponse,
  errors: [],
}));

export interface CreateMtlsCertificateRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Indicates whether the certificate is a CA or leaf certificate. */
  ca: boolean;
  /** Body param: The uploaded root CA certificate. */
  certificates: string;
  /** Body param: Optional unique name for the certificate. Only used for human readability. */
  name?: string;
  /** Body param: The private key for the certificate. This field is only needed for specific use cases such as using a custom certificate with Zero Trust's block page. */
  privateKey?: string;
}

export const CreateMtlsCertificateRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  ca: Schema.Boolean,
  certificates: Schema.String,
  name: Schema.optional(Schema.String),
  privateKey: Schema.optional(Schema.String).pipe(T.JsonName("private_key")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/mtls_certificates" }),
) as unknown as Schema.Schema<CreateMtlsCertificateRequest>;

export interface CreateMtlsCertificateResponse {
  /** Identifier. */
  id?: string;
  /** Indicates whether the certificate is a CA or leaf certificate. */
  ca?: boolean;
  /** The uploaded root CA certificate. */
  certificates?: string;
  /** When the certificate expires. */
  expiresOn?: string;
  /** The certificate authority that issued the certificate. */
  issuer?: string;
  /** Optional unique name for the certificate. Only used for human readability. */
  name?: string;
  /** The certificate serial number. */
  serialNumber?: string;
  /** The type of hash used for the certificate. */
  signature?: string;
  /** This is the time the certificate was updated. */
  updatedAt?: string;
  /** This is the time the certificate was uploaded. */
  uploadedOn?: string;
}

export const CreateMtlsCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  ca: Schema.optional(Schema.Boolean),
  certificates: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  issuer: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  serialNumber: Schema.optional(Schema.String).pipe(T.JsonName("serial_number")),
  signature: Schema.optional(Schema.String),
  updatedAt: Schema.optional(Schema.String).pipe(T.JsonName("updated_at")),
  uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
}) as unknown as Schema.Schema<CreateMtlsCertificateResponse>;

export const createMtlsCertificate = API.make(() => ({
  input: CreateMtlsCertificateRequest,
  output: CreateMtlsCertificateResponse,
  errors: [],
}));

export interface DeleteMtlsCertificateRequest {
  mtlsCertificateId: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteMtlsCertificateRequest = Schema.Struct({
  mtlsCertificateId: Schema.String.pipe(T.HttpPath("mtlsCertificateId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/mtls_certificates/{mtlsCertificateId}",
  }),
) as unknown as Schema.Schema<DeleteMtlsCertificateRequest>;

export interface DeleteMtlsCertificateResponse {
  /** Identifier. */
  id?: string;
  /** Indicates whether the certificate is a CA or leaf certificate. */
  ca?: boolean;
  /** The uploaded root CA certificate. */
  certificates?: string;
  /** When the certificate expires. */
  expiresOn?: string;
  /** The certificate authority that issued the certificate. */
  issuer?: string;
  /** Optional unique name for the certificate. Only used for human readability. */
  name?: string;
  /** The certificate serial number. */
  serialNumber?: string;
  /** The type of hash used for the certificate. */
  signature?: string;
  /** This is the time the certificate was uploaded. */
  uploadedOn?: string;
}

export const DeleteMtlsCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  ca: Schema.optional(Schema.Boolean),
  certificates: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  issuer: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  serialNumber: Schema.optional(Schema.String).pipe(T.JsonName("serial_number")),
  signature: Schema.optional(Schema.String),
  uploadedOn: Schema.optional(Schema.String).pipe(T.JsonName("uploaded_on")),
}) as unknown as Schema.Schema<DeleteMtlsCertificateResponse>;

export const deleteMtlsCertificate = API.make(() => ({
  input: DeleteMtlsCertificateRequest,
  output: DeleteMtlsCertificateResponse,
  errors: [],
}));
