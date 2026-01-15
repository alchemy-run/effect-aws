/**
 * Cloudflare CERTIFICATE-AUTHORITIES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service certificate-authorities
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// HostnameAssociation
// =============================================================================

export interface GetHostnameAssociationRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: The UUID to match against for a certificate that was uploaded to the mTLS Certificate Management endpoint. If no mtls_certificate_id is given, the results will be the hostnames associated */
  mtlsCertificateId?: string;
}

export const GetHostnameAssociationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  mtlsCertificateId: Schema.optional(Schema.String).pipe(T.HttpQuery("mtls_certificate_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/certificate_authorities/hostname_associations" }),
) as unknown as Schema.Schema<GetHostnameAssociationRequest>;

export interface GetHostnameAssociationResponse {
  hostnames?: string[];
}

export const GetHostnameAssociationResponse = Schema.Struct({
  hostnames: Schema.optional(Schema.Array(Schema.String)),
}) as unknown as Schema.Schema<GetHostnameAssociationResponse>;

export const getHostnameAssociation = API.make(() => ({
  input: GetHostnameAssociationRequest,
  output: GetHostnameAssociationResponse,
  errors: [],
}));

export interface PutHostnameAssociationRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: */
  hostnames?: string[];
  /** Body param: The UUID for a certificate that was uploaded to the mTLS Certificate Management endpoint. If no mtls_certificate_id is given, the hostnames will be associated to your active Cloudflare Man */
  mtlsCertificateId?: string;
}

export const PutHostnameAssociationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  hostnames: Schema.optional(Schema.Array(Schema.String)),
  mtlsCertificateId: Schema.optional(Schema.String).pipe(T.JsonName("mtls_certificate_id")),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/certificate_authorities/hostname_associations" }),
) as unknown as Schema.Schema<PutHostnameAssociationRequest>;

export interface PutHostnameAssociationResponse {
  hostnames?: string[];
}

export const PutHostnameAssociationResponse = Schema.Struct({
  hostnames: Schema.optional(Schema.Array(Schema.String)),
}) as unknown as Schema.Schema<PutHostnameAssociationResponse>;

export const putHostnameAssociation = API.make(() => ({
  input: PutHostnameAssociationRequest,
  output: PutHostnameAssociationResponse,
  errors: [],
}));
