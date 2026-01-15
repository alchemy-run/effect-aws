/**
 * Cloudflare KEYLESS-CERTIFICATES API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service keyless-certificates
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// KeylessCertificate
// =============================================================================

export interface GetKeylessCertificateRequest {
  keylessCertificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const GetKeylessCertificateRequest = Schema.Struct({
  keylessCertificateId: Schema.String.pipe(T.HttpPath("keylessCertificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/keyless_certificates/{keylessCertificateId}" }),
) as unknown as Schema.Schema<GetKeylessCertificateRequest>;

export interface GetKeylessCertificateResponse {
  /** Keyless certificate identifier tag. */
  id: string;
  /** When the Keyless SSL was created. */
  createdOn: string;
  /** Whether or not the Keyless SSL is on or off. */
  enabled: boolean;
  /** The keyless SSL name. */
  host: string;
  /** When the Keyless SSL was last modified. */
  modifiedOn: string;
  /** The keyless SSL name. */
  name: string;
  /** Available permissions for the Keyless SSL for the current user requesting the item. */
  permissions: string[];
  /** The keyless SSL port used to communicate between Cloudflare and the client's Keyless SSL server. */
  port: number;
  /** Status of the Keyless SSL. */
  status: "active" | "deleted";
  /** Configuration for using Keyless SSL through a Cloudflare Tunnel */
  tunnel?: { privateIp: string; vnetId: string };
}

export const GetKeylessCertificateResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  enabled: Schema.Boolean,
  host: Schema.String,
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  permissions: Schema.Array(Schema.String),
  port: Schema.Number,
  status: Schema.Literal("active", "deleted"),
  tunnel: Schema.optional(
    Schema.Struct({
      privateIp: Schema.String.pipe(T.JsonName("private_ip")),
      vnetId: Schema.String.pipe(T.JsonName("vnet_id")),
    }),
  ),
}) as unknown as Schema.Schema<GetKeylessCertificateResponse>;

export const getKeylessCertificate = API.make(() => ({
  input: GetKeylessCertificateRequest,
  output: GetKeylessCertificateResponse,
  errors: [],
}));

export interface CreateKeylessCertificateRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: The zone's SSL certificate or SSL certificate and intermediate(s). */
  certificate: string;
  /** Body param: The keyless SSL name. */
  host: string;
  /** Body param: The keyless SSL port used to communicate between Cloudflare and the client's Keyless SSL server. */
  port: number;
  /** Body param: A ubiquitous bundle has the highest probability of being verified everywhere, even by clients using outdated or unusual trust stores. An optimal bundle uses the shortest chain and newest i */
  bundleMethod?: "ubiquitous" | "optimal" | "force";
  /** Body param: The keyless SSL name. */
  name?: string;
  /** Body param: Configuration for using Keyless SSL through a Cloudflare Tunnel */
  tunnel?: { privateIp: string; vnetId: string };
}

export const CreateKeylessCertificateRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  certificate: Schema.String,
  host: Schema.String,
  port: Schema.Number,
  bundleMethod: Schema.optional(Schema.Literal("ubiquitous", "optimal", "force")).pipe(
    T.JsonName("bundle_method"),
  ),
  name: Schema.optional(Schema.String),
  tunnel: Schema.optional(
    Schema.Struct({
      privateIp: Schema.String.pipe(T.JsonName("private_ip")),
      vnetId: Schema.String.pipe(T.JsonName("vnet_id")),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/keyless_certificates" }),
) as unknown as Schema.Schema<CreateKeylessCertificateRequest>;

export interface CreateKeylessCertificateResponse {
  /** Keyless certificate identifier tag. */
  id: string;
  /** When the Keyless SSL was created. */
  createdOn: string;
  /** Whether or not the Keyless SSL is on or off. */
  enabled: boolean;
  /** The keyless SSL name. */
  host: string;
  /** When the Keyless SSL was last modified. */
  modifiedOn: string;
  /** The keyless SSL name. */
  name: string;
  /** Available permissions for the Keyless SSL for the current user requesting the item. */
  permissions: string[];
  /** The keyless SSL port used to communicate between Cloudflare and the client's Keyless SSL server. */
  port: number;
  /** Status of the Keyless SSL. */
  status: "active" | "deleted";
  /** Configuration for using Keyless SSL through a Cloudflare Tunnel */
  tunnel?: { privateIp: string; vnetId: string };
}

export const CreateKeylessCertificateResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  enabled: Schema.Boolean,
  host: Schema.String,
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  permissions: Schema.Array(Schema.String),
  port: Schema.Number,
  status: Schema.Literal("active", "deleted"),
  tunnel: Schema.optional(
    Schema.Struct({
      privateIp: Schema.String.pipe(T.JsonName("private_ip")),
      vnetId: Schema.String.pipe(T.JsonName("vnet_id")),
    }),
  ),
}) as unknown as Schema.Schema<CreateKeylessCertificateResponse>;

export const createKeylessCertificate = API.make(() => ({
  input: CreateKeylessCertificateRequest,
  output: CreateKeylessCertificateResponse,
  errors: [],
}));

export interface PatchKeylessCertificateRequest {
  keylessCertificateId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** @deprecated Body param: Whether or not the Keyless SSL is on or off. */
  enabled?: boolean;
  /** Body param: The keyless SSL name. */
  host?: string;
  /** Body param: The keyless SSL name. */
  name?: string;
  /** Body param: The keyless SSL port used to communicate between Cloudflare and the client's Keyless SSL server. */
  port?: number;
  /** Body param: Configuration for using Keyless SSL through a Cloudflare Tunnel */
  tunnel?: { privateIp: string; vnetId: string };
}

export const PatchKeylessCertificateRequest = Schema.Struct({
  keylessCertificateId: Schema.String.pipe(T.HttpPath("keylessCertificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  enabled: Schema.optional(Schema.Boolean),
  host: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  port: Schema.optional(Schema.Number),
  tunnel: Schema.optional(
    Schema.Struct({
      privateIp: Schema.String.pipe(T.JsonName("private_ip")),
      vnetId: Schema.String.pipe(T.JsonName("vnet_id")),
    }),
  ),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/keyless_certificates/{keylessCertificateId}" }),
) as unknown as Schema.Schema<PatchKeylessCertificateRequest>;

export interface PatchKeylessCertificateResponse {
  /** Keyless certificate identifier tag. */
  id: string;
  /** When the Keyless SSL was created. */
  createdOn: string;
  /** Whether or not the Keyless SSL is on or off. */
  enabled: boolean;
  /** The keyless SSL name. */
  host: string;
  /** When the Keyless SSL was last modified. */
  modifiedOn: string;
  /** The keyless SSL name. */
  name: string;
  /** Available permissions for the Keyless SSL for the current user requesting the item. */
  permissions: string[];
  /** The keyless SSL port used to communicate between Cloudflare and the client's Keyless SSL server. */
  port: number;
  /** Status of the Keyless SSL. */
  status: "active" | "deleted";
  /** Configuration for using Keyless SSL through a Cloudflare Tunnel */
  tunnel?: { privateIp: string; vnetId: string };
}

export const PatchKeylessCertificateResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  enabled: Schema.Boolean,
  host: Schema.String,
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  permissions: Schema.Array(Schema.String),
  port: Schema.Number,
  status: Schema.Literal("active", "deleted"),
  tunnel: Schema.optional(
    Schema.Struct({
      privateIp: Schema.String.pipe(T.JsonName("private_ip")),
      vnetId: Schema.String.pipe(T.JsonName("vnet_id")),
    }),
  ),
}) as unknown as Schema.Schema<PatchKeylessCertificateResponse>;

export const patchKeylessCertificate = API.make(() => ({
  input: PatchKeylessCertificateRequest,
  output: PatchKeylessCertificateResponse,
  errors: [],
}));

export interface DeleteKeylessCertificateRequest {
  keylessCertificateId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteKeylessCertificateRequest = Schema.Struct({
  keylessCertificateId: Schema.String.pipe(T.HttpPath("keylessCertificateId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/keyless_certificates/{keylessCertificateId}",
  }),
) as unknown as Schema.Schema<DeleteKeylessCertificateRequest>;

export interface DeleteKeylessCertificateResponse {
  /** Identifier. */
  id?: string;
}

export const DeleteKeylessCertificateResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteKeylessCertificateResponse>;

export const deleteKeylessCertificate = API.make(() => ({
  input: DeleteKeylessCertificateRequest,
  output: DeleteKeylessCertificateResponse,
  errors: [],
}));
