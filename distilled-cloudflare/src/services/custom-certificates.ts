/**
 * Cloudflare CUSTOM-CERTIFICATES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service custom-certificates
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
// CustomCertificate
// =============================================================================

export interface GetCustomCertificateRequest {
  customCertificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const GetCustomCertificateRequest = Schema.Struct({
  customCertificateId: Schema.String.pipe(T.HttpPath("customCertificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/custom_certificates/{customCertificateId}",
  }),
) as unknown as Schema.Schema<GetCustomCertificateRequest>;

export interface GetCustomCertificateResponse {
  /** Identifier. */
  id: string;
  /** A ubiquitous bundle has the highest probability of being verified everywhere, even by clients using outdated or unusual trust stores. An optimal bundle uses the shortest chain and newest intermediates */
  bundleMethod: "ubiquitous" | "optimal" | "force";
  /** When the certificate from the authority expires. */
  expiresOn: string;
  hosts: string[];
  /** The certificate authority that issued the certificate. */
  issuer: string;
  /** When the certificate was last modified. */
  modifiedOn: string;
  /** The order/priority in which the certificate will be used in a request. The higher priority will break ties across overlapping 'legacy_custom' certificates, but 'legacy_custom' certificates will always */
  priority: number;
  /** The type of hash used for the certificate. */
  signature: string;
  /** Status of the zone's custom SSL. */
  status: "active" | "expired" | "deleted" | "pending" | "initializing";
  /** When the certificate was uploaded to Cloudflare. */
  uploadedOn: string;
  /** Identifier. */
  zoneId: string;
  /** Specify the region where your private key can be held locally for optimal TLS performance. HTTPS connections to any excluded data center will still be fully encrypted, but will incur some latency whil */
  geoRestrictions?: { label?: "us" | "eu" | "highest_security" };
  keylessServer?: unknown;
  /** Specify the policy that determines the region where your private key will be held locally. HTTPS connections to any excluded data center will still be fully encrypted, but will incur some latency whil */
  policy?: string;
}

export const GetCustomCertificateResponse = Schema.Struct({
  id: Schema.String,
  bundleMethod: Schema.Literal("ubiquitous", "optimal", "force").pipe(
    T.JsonName("bundle_method"),
  ),
  expiresOn: Schema.String.pipe(T.JsonName("expires_on")),
  hosts: Schema.Array(Schema.String),
  issuer: Schema.String,
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  priority: Schema.Number,
  signature: Schema.String,
  status: Schema.Literal(
    "active",
    "expired",
    "deleted",
    "pending",
    "initializing",
  ),
  uploadedOn: Schema.String.pipe(T.JsonName("uploaded_on")),
  zoneId: Schema.String.pipe(T.JsonName("zone_id")),
  geoRestrictions: Schema.optional(
    Schema.Struct({
      label: Schema.optional(Schema.Literal("us", "eu", "highest_security")),
    }),
  ).pipe(T.JsonName("geo_restrictions")),
  keylessServer: Schema.optional(Schema.Unknown).pipe(
    T.JsonName("keyless_server"),
  ),
  policy: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetCustomCertificateResponse>;

export const getCustomCertificate: (
  input: GetCustomCertificateRequest,
) => Effect.Effect<
  GetCustomCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetCustomCertificateRequest,
  output: GetCustomCertificateResponse,
  errors: [],
}));

export interface CreateCustomCertificateRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: The zone's SSL certificate or certificate and the intermediate(s). */
  certificate: string;
  /** Body param: The zone's private key. */
  privateKey: string;
  /** Body param: A ubiquitous bundle has the highest probability of being verified everywhere, even by clients using outdated or unusual trust stores. An optimal bundle uses the shortest chain and newest i */
  bundleMethod?: "ubiquitous" | "optimal" | "force";
  /** Body param: Specify the region where your private key can be held locally for optimal TLS performance. HTTPS connections to any excluded data center will still be fully encrypted, but will incur some  */
  geoRestrictions?: { label?: "us" | "eu" | "highest_security" };
  /** Body param: Specify the policy that determines the region where your private key will be held locally. HTTPS connections to any excluded data center will still be fully encrypted, but will incur some  */
  policy?: string;
  /** Body param: The type 'legacy_custom' enables support for legacy clients which do not include SNI in the TLS handshake. */
  type?: "legacy_custom" | "sni_custom";
}

export const CreateCustomCertificateRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  certificate: Schema.String,
  privateKey: Schema.String.pipe(T.JsonName("private_key")),
  bundleMethod: Schema.optional(
    Schema.Literal("ubiquitous", "optimal", "force"),
  ).pipe(T.JsonName("bundle_method")),
  geoRestrictions: Schema.optional(
    Schema.Struct({
      label: Schema.optional(Schema.Literal("us", "eu", "highest_security")),
    }),
  ).pipe(T.JsonName("geo_restrictions")),
  policy: Schema.optional(Schema.String),
  type: Schema.optional(Schema.Literal("legacy_custom", "sni_custom")),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/custom_certificates" }),
) as unknown as Schema.Schema<CreateCustomCertificateRequest>;

export interface CreateCustomCertificateResponse {
  /** Identifier. */
  id: string;
  /** A ubiquitous bundle has the highest probability of being verified everywhere, even by clients using outdated or unusual trust stores. An optimal bundle uses the shortest chain and newest intermediates */
  bundleMethod: "ubiquitous" | "optimal" | "force";
  /** When the certificate from the authority expires. */
  expiresOn: string;
  hosts: string[];
  /** The certificate authority that issued the certificate. */
  issuer: string;
  /** When the certificate was last modified. */
  modifiedOn: string;
  /** The order/priority in which the certificate will be used in a request. The higher priority will break ties across overlapping 'legacy_custom' certificates, but 'legacy_custom' certificates will always */
  priority: number;
  /** The type of hash used for the certificate. */
  signature: string;
  /** Status of the zone's custom SSL. */
  status: "active" | "expired" | "deleted" | "pending" | "initializing";
  /** When the certificate was uploaded to Cloudflare. */
  uploadedOn: string;
  /** Identifier. */
  zoneId: string;
  /** Specify the region where your private key can be held locally for optimal TLS performance. HTTPS connections to any excluded data center will still be fully encrypted, but will incur some latency whil */
  geoRestrictions?: { label?: "us" | "eu" | "highest_security" };
  keylessServer?: unknown;
  /** Specify the policy that determines the region where your private key will be held locally. HTTPS connections to any excluded data center will still be fully encrypted, but will incur some latency whil */
  policy?: string;
}

export const CreateCustomCertificateResponse = Schema.Struct({
  id: Schema.String,
  bundleMethod: Schema.Literal("ubiquitous", "optimal", "force").pipe(
    T.JsonName("bundle_method"),
  ),
  expiresOn: Schema.String.pipe(T.JsonName("expires_on")),
  hosts: Schema.Array(Schema.String),
  issuer: Schema.String,
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  priority: Schema.Number,
  signature: Schema.String,
  status: Schema.Literal(
    "active",
    "expired",
    "deleted",
    "pending",
    "initializing",
  ),
  uploadedOn: Schema.String.pipe(T.JsonName("uploaded_on")),
  zoneId: Schema.String.pipe(T.JsonName("zone_id")),
  geoRestrictions: Schema.optional(
    Schema.Struct({
      label: Schema.optional(Schema.Literal("us", "eu", "highest_security")),
    }),
  ).pipe(T.JsonName("geo_restrictions")),
  keylessServer: Schema.optional(Schema.Unknown).pipe(
    T.JsonName("keyless_server"),
  ),
  policy: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateCustomCertificateResponse>;

export const createCustomCertificate: (
  input: CreateCustomCertificateRequest,
) => Effect.Effect<
  CreateCustomCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateCustomCertificateRequest,
  output: CreateCustomCertificateResponse,
  errors: [],
}));

export interface PatchCustomCertificateRequest {
  customCertificateId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: A ubiquitous bundle has the highest probability of being verified everywhere, even by clients using outdated or unusual trust stores. An optimal bundle uses the shortest chain and newest i */
  bundleMethod?: "ubiquitous" | "optimal" | "force";
  /** Body param: The zone's SSL certificate or certificate and the intermediate(s). */
  certificate?: string;
  /** Body param: Specify the region where your private key can be held locally for optimal TLS performance. HTTPS connections to any excluded data center will still be fully encrypted, but will incur some  */
  geoRestrictions?: { label?: "us" | "eu" | "highest_security" };
  /** Body param: Specify the policy that determines the region where your private key will be held locally. HTTPS connections to any excluded data center will still be fully encrypted, but will incur some  */
  policy?: string;
  /** Body param: The zone's private key. */
  privateKey?: string;
}

export const PatchCustomCertificateRequest = Schema.Struct({
  customCertificateId: Schema.String.pipe(T.HttpPath("customCertificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  bundleMethod: Schema.optional(
    Schema.Literal("ubiquitous", "optimal", "force"),
  ).pipe(T.JsonName("bundle_method")),
  certificate: Schema.optional(Schema.String),
  geoRestrictions: Schema.optional(
    Schema.Struct({
      label: Schema.optional(Schema.Literal("us", "eu", "highest_security")),
    }),
  ).pipe(T.JsonName("geo_restrictions")),
  policy: Schema.optional(Schema.String),
  privateKey: Schema.optional(Schema.String).pipe(T.JsonName("private_key")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/zones/{zone_id}/custom_certificates/{customCertificateId}",
  }),
) as unknown as Schema.Schema<PatchCustomCertificateRequest>;

export interface PatchCustomCertificateResponse {
  /** Identifier. */
  id: string;
  /** A ubiquitous bundle has the highest probability of being verified everywhere, even by clients using outdated or unusual trust stores. An optimal bundle uses the shortest chain and newest intermediates */
  bundleMethod: "ubiquitous" | "optimal" | "force";
  /** When the certificate from the authority expires. */
  expiresOn: string;
  hosts: string[];
  /** The certificate authority that issued the certificate. */
  issuer: string;
  /** When the certificate was last modified. */
  modifiedOn: string;
  /** The order/priority in which the certificate will be used in a request. The higher priority will break ties across overlapping 'legacy_custom' certificates, but 'legacy_custom' certificates will always */
  priority: number;
  /** The type of hash used for the certificate. */
  signature: string;
  /** Status of the zone's custom SSL. */
  status: "active" | "expired" | "deleted" | "pending" | "initializing";
  /** When the certificate was uploaded to Cloudflare. */
  uploadedOn: string;
  /** Identifier. */
  zoneId: string;
  /** Specify the region where your private key can be held locally for optimal TLS performance. HTTPS connections to any excluded data center will still be fully encrypted, but will incur some latency whil */
  geoRestrictions?: { label?: "us" | "eu" | "highest_security" };
  keylessServer?: unknown;
  /** Specify the policy that determines the region where your private key will be held locally. HTTPS connections to any excluded data center will still be fully encrypted, but will incur some latency whil */
  policy?: string;
}

export const PatchCustomCertificateResponse = Schema.Struct({
  id: Schema.String,
  bundleMethod: Schema.Literal("ubiquitous", "optimal", "force").pipe(
    T.JsonName("bundle_method"),
  ),
  expiresOn: Schema.String.pipe(T.JsonName("expires_on")),
  hosts: Schema.Array(Schema.String),
  issuer: Schema.String,
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  priority: Schema.Number,
  signature: Schema.String,
  status: Schema.Literal(
    "active",
    "expired",
    "deleted",
    "pending",
    "initializing",
  ),
  uploadedOn: Schema.String.pipe(T.JsonName("uploaded_on")),
  zoneId: Schema.String.pipe(T.JsonName("zone_id")),
  geoRestrictions: Schema.optional(
    Schema.Struct({
      label: Schema.optional(Schema.Literal("us", "eu", "highest_security")),
    }),
  ).pipe(T.JsonName("geo_restrictions")),
  keylessServer: Schema.optional(Schema.Unknown).pipe(
    T.JsonName("keyless_server"),
  ),
  policy: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PatchCustomCertificateResponse>;

export const patchCustomCertificate: (
  input: PatchCustomCertificateRequest,
) => Effect.Effect<
  PatchCustomCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchCustomCertificateRequest,
  output: PatchCustomCertificateResponse,
  errors: [],
}));

export interface DeleteCustomCertificateRequest {
  customCertificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteCustomCertificateRequest = Schema.Struct({
  customCertificateId: Schema.String.pipe(T.HttpPath("customCertificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/custom_certificates/{customCertificateId}",
  }),
) as unknown as Schema.Schema<DeleteCustomCertificateRequest>;

export interface DeleteCustomCertificateResponse {
  /** Identifier. */
  id?: string;
}

export const DeleteCustomCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteCustomCertificateResponse>;

export const deleteCustomCertificate: (
  input: DeleteCustomCertificateRequest,
) => Effect.Effect<
  DeleteCustomCertificateResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteCustomCertificateRequest,
  output: DeleteCustomCertificateResponse,
  errors: [],
}));
