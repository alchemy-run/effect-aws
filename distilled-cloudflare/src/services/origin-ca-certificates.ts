/**
 * Cloudflare ORIGIN-CA-CERTIFICATES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service origin-ca-certificates
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// OriginCACertificate
// =============================================================================

export interface GetOriginCACertificateRequest {
  certificateId: string;
}

export const GetOriginCACertificateRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
}).pipe(
  T.Http({ method: "GET", path: "/certificates/{certificateId}" }),
) as unknown as Schema.Schema<GetOriginCACertificateRequest>;

export interface GetOriginCACertificateResponse {
  /** The Certificate Signing Request (CSR). Must be newline-encoded. */
  csr: string;
  /** Array of hostnames or wildcard names (e.g., \ .example.com) bound to the certificate. */
  hostnames: string[];
  /** Signature type desired on certificate ("origin-rsa" (rsa), "origin-ecc" (ecdsa), or "keyless-certificate" (for Keyless SSL servers). */
  requestType: "origin-rsa" | "origin-ecc" | "keyless-certificate";
  /** The number of days for which the certificate should be valid. */
  requestedValidity: "7" | "30" | "90" | "365" | "730" | "1095" | "5475";
  /** Identifier. */
  id?: string;
  /** The Origin CA certificate. Will be newline-encoded. */
  certificate?: string;
  /** When the certificate will expire. */
  expiresOn?: string;
}

export const GetOriginCACertificateResponse = Schema.Struct({
  csr: Schema.String,
  hostnames: Schema.Array(Schema.String),
  requestType: Schema.Literal("origin-rsa", "origin-ecc", "keyless-certificate").pipe(
    T.JsonName("request_type"),
  ),
  requestedValidity: Schema.Literal("7", "30", "90", "365", "730", "1095", "5475").pipe(
    T.JsonName("requested_validity"),
  ),
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
}) as unknown as Schema.Schema<GetOriginCACertificateResponse>;

export const getOriginCACertificate = API.make(() => ({
  input: GetOriginCACertificateRequest,
  output: GetOriginCACertificateResponse,
  errors: [],
}));

export interface CreateOriginCACertificateRequest {
  /** The Certificate Signing Request (CSR). Must be newline-encoded. */
  csr?: string;
  /** Array of hostnames or wildcard names (e.g., \ .example.com) bound to the certificate. */
  hostnames?: string[];
  /** Signature type desired on certificate ("origin-rsa" (rsa), "origin-ecc" (ecdsa), or "keyless-certificate" (for Keyless SSL servers). */
  requestType?: "origin-rsa" | "origin-ecc" | "keyless-certificate";
  /** The number of days for which the certificate should be valid. */
  requestedValidity?: "7" | "30" | "90" | "365" | "730" | "1095" | "5475";
}

export const CreateOriginCACertificateRequest = Schema.Struct({
  csr: Schema.optional(Schema.String),
  hostnames: Schema.optional(Schema.Array(Schema.String)),
  requestType: Schema.optional(
    Schema.Literal("origin-rsa", "origin-ecc", "keyless-certificate"),
  ).pipe(T.JsonName("request_type")),
  requestedValidity: Schema.optional(
    Schema.Literal("7", "30", "90", "365", "730", "1095", "5475"),
  ).pipe(T.JsonName("requested_validity")),
}).pipe(
  T.Http({ method: "POST", path: "/certificates" }),
) as unknown as Schema.Schema<CreateOriginCACertificateRequest>;

export interface CreateOriginCACertificateResponse {
  /** The Certificate Signing Request (CSR). Must be newline-encoded. */
  csr: string;
  /** Array of hostnames or wildcard names (e.g., \ .example.com) bound to the certificate. */
  hostnames: string[];
  /** Signature type desired on certificate ("origin-rsa" (rsa), "origin-ecc" (ecdsa), or "keyless-certificate" (for Keyless SSL servers). */
  requestType: "origin-rsa" | "origin-ecc" | "keyless-certificate";
  /** The number of days for which the certificate should be valid. */
  requestedValidity: "7" | "30" | "90" | "365" | "730" | "1095" | "5475";
  /** Identifier. */
  id?: string;
  /** The Origin CA certificate. Will be newline-encoded. */
  certificate?: string;
  /** When the certificate will expire. */
  expiresOn?: string;
}

export const CreateOriginCACertificateResponse = Schema.Struct({
  csr: Schema.String,
  hostnames: Schema.Array(Schema.String),
  requestType: Schema.Literal("origin-rsa", "origin-ecc", "keyless-certificate").pipe(
    T.JsonName("request_type"),
  ),
  requestedValidity: Schema.Literal("7", "30", "90", "365", "730", "1095", "5475").pipe(
    T.JsonName("requested_validity"),
  ),
  id: Schema.optional(Schema.String),
  certificate: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
}) as unknown as Schema.Schema<CreateOriginCACertificateResponse>;

export const createOriginCACertificate = API.make(() => ({
  input: CreateOriginCACertificateRequest,
  output: CreateOriginCACertificateResponse,
  errors: [],
}));

export interface DeleteOriginCACertificateRequest {
  certificateId: string;
}

export const DeleteOriginCACertificateRequest = Schema.Struct({
  certificateId: Schema.String.pipe(T.HttpPath("certificateId")),
}).pipe(
  T.Http({ method: "DELETE", path: "/certificates/{certificateId}" }),
) as unknown as Schema.Schema<DeleteOriginCACertificateRequest>;

export interface DeleteOriginCACertificateResponse {
  /** Identifier. */
  id?: string;
  /** When the certificate was revoked. */
  revokedAt?: string;
}

export const DeleteOriginCACertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  revokedAt: Schema.optional(Schema.String).pipe(T.JsonName("revoked_at")),
}) as unknown as Schema.Schema<DeleteOriginCACertificateResponse>;

export const deleteOriginCACertificate = API.make(() => ({
  input: DeleteOriginCACertificateRequest,
  output: DeleteOriginCACertificateResponse,
  errors: [],
}));
