/**
 * Cloudflare HYPERDRIVE API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service hyperdrive
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Config
// =============================================================================

export interface GetConfigRequest {
  hyperdriveId: string;
  /** Define configurations using a unique string identifier. */
  accountId: string;
}

export const GetConfigRequest = Schema.Struct({
  hyperdriveId: Schema.String.pipe(T.HttpPath("hyperdriveId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/hyperdrive/configs/{hyperdriveId}" }),
) as unknown as Schema.Schema<GetConfigRequest>;

export type GetConfigResponse = unknown;

export const GetConfigResponse = Schema.Unknown as unknown as Schema.Schema<GetConfigResponse>;

export const getConfig = API.make(() => ({
  input: GetConfigRequest,
  output: GetConfigResponse,
  errors: [],
}));

export interface CreateConfigRequest {
  /** Path param: Define configurations using a unique string identifier. */
  accountId: string;
  /** Body param: */
  name: string;
  /** Body param: */
  origin:
    | {
        database: string;
        host: string;
        password: string;
        port: number;
        scheme: "postgres" | "postgresql" | "mysql";
        user: string;
      }
    | {
        accessClientId: string;
        accessClientSecret: string;
        database: string;
        host: string;
        password: string;
        scheme: "postgres" | "postgresql" | "mysql";
        user: string;
      };
  /** Body param: */
  caching?:
    | { disabled?: boolean }
    | { disabled?: boolean; maxAge?: number; staleWhileRevalidate?: number };
  /** Body param: */
  mtls?: { caCertificateId?: string; mtlsCertificateId?: string; sslmode?: string };
  /** Body param: The (soft) maximum number of connections the Hyperdrive is allowed to make to the origin database. */
  originConnectionLimit?: number;
}

export const CreateConfigRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  origin: Schema.Union(
    Schema.Struct({
      database: Schema.String,
      host: Schema.String,
      password: Schema.String,
      port: Schema.Number,
      scheme: Schema.Literal("postgres", "postgresql", "mysql"),
      user: Schema.String,
    }),
    Schema.Struct({
      accessClientId: Schema.String.pipe(T.JsonName("access_client_id")),
      accessClientSecret: Schema.String.pipe(T.JsonName("access_client_secret")),
      database: Schema.String,
      host: Schema.String,
      password: Schema.String,
      scheme: Schema.Literal("postgres", "postgresql", "mysql"),
      user: Schema.String,
    }),
  ),
  caching: Schema.optional(
    Schema.Union(
      Schema.Struct({
        disabled: Schema.optional(Schema.Boolean),
      }),
      Schema.Struct({
        disabled: Schema.optional(Schema.Boolean),
        maxAge: Schema.optional(Schema.Number).pipe(T.JsonName("max_age")),
        staleWhileRevalidate: Schema.optional(Schema.Number).pipe(
          T.JsonName("stale_while_revalidate"),
        ),
      }),
    ),
  ),
  mtls: Schema.optional(
    Schema.Struct({
      caCertificateId: Schema.optional(Schema.String).pipe(T.JsonName("ca_certificate_id")),
      mtlsCertificateId: Schema.optional(Schema.String).pipe(T.JsonName("mtls_certificate_id")),
      sslmode: Schema.optional(Schema.String),
    }),
  ),
  originConnectionLimit: Schema.optional(Schema.Number).pipe(T.JsonName("origin_connection_limit")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/hyperdrive/configs" }),
) as unknown as Schema.Schema<CreateConfigRequest>;

export type CreateConfigResponse = unknown;

export const CreateConfigResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateConfigResponse>;

export const createConfig = API.make(() => ({
  input: CreateConfigRequest,
  output: CreateConfigResponse,
  errors: [],
}));

export interface UpdateConfigRequest {
  hyperdriveId: string;
  /** Path param: Define configurations using a unique string identifier. */
  accountId: string;
  /** Body param: */
  name: string;
  /** Body param: */
  origin:
    | {
        database: string;
        host: string;
        password: string;
        port: number;
        scheme: "postgres" | "postgresql" | "mysql";
        user: string;
      }
    | {
        accessClientId: string;
        accessClientSecret: string;
        database: string;
        host: string;
        password: string;
        scheme: "postgres" | "postgresql" | "mysql";
        user: string;
      };
  /** Body param: */
  caching?:
    | { disabled?: boolean }
    | { disabled?: boolean; maxAge?: number; staleWhileRevalidate?: number };
  /** Body param: */
  mtls?: { caCertificateId?: string; mtlsCertificateId?: string; sslmode?: string };
  /** Body param: The (soft) maximum number of connections the Hyperdrive is allowed to make to the origin database. */
  originConnectionLimit?: number;
}

export const UpdateConfigRequest = Schema.Struct({
  hyperdriveId: Schema.String.pipe(T.HttpPath("hyperdriveId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  origin: Schema.Union(
    Schema.Struct({
      database: Schema.String,
      host: Schema.String,
      password: Schema.String,
      port: Schema.Number,
      scheme: Schema.Literal("postgres", "postgresql", "mysql"),
      user: Schema.String,
    }),
    Schema.Struct({
      accessClientId: Schema.String.pipe(T.JsonName("access_client_id")),
      accessClientSecret: Schema.String.pipe(T.JsonName("access_client_secret")),
      database: Schema.String,
      host: Schema.String,
      password: Schema.String,
      scheme: Schema.Literal("postgres", "postgresql", "mysql"),
      user: Schema.String,
    }),
  ),
  caching: Schema.optional(
    Schema.Union(
      Schema.Struct({
        disabled: Schema.optional(Schema.Boolean),
      }),
      Schema.Struct({
        disabled: Schema.optional(Schema.Boolean),
        maxAge: Schema.optional(Schema.Number).pipe(T.JsonName("max_age")),
        staleWhileRevalidate: Schema.optional(Schema.Number).pipe(
          T.JsonName("stale_while_revalidate"),
        ),
      }),
    ),
  ),
  mtls: Schema.optional(
    Schema.Struct({
      caCertificateId: Schema.optional(Schema.String).pipe(T.JsonName("ca_certificate_id")),
      mtlsCertificateId: Schema.optional(Schema.String).pipe(T.JsonName("mtls_certificate_id")),
      sslmode: Schema.optional(Schema.String),
    }),
  ),
  originConnectionLimit: Schema.optional(Schema.Number).pipe(T.JsonName("origin_connection_limit")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/hyperdrive/configs/{hyperdriveId}" }),
) as unknown as Schema.Schema<UpdateConfigRequest>;

export type UpdateConfigResponse = unknown;

export const UpdateConfigResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateConfigResponse>;

export const updateConfig = API.make(() => ({
  input: UpdateConfigRequest,
  output: UpdateConfigResponse,
  errors: [],
}));

export interface PatchConfigRequest {
  hyperdriveId: string;
  /** Path param: Define configurations using a unique string identifier. */
  accountId: string;
  /** Body param: */
  caching?:
    | { disabled?: boolean }
    | { disabled?: boolean; maxAge?: number; staleWhileRevalidate?: number };
  /** Body param: */
  mtls?: { caCertificateId?: string; mtlsCertificateId?: string; sslmode?: string };
  /** Body param: */
  name?: string;
  /** Body param: */
  origin?:
    | {
        database?: string;
        password?: string;
        scheme?: "postgres" | "postgresql" | "mysql";
        user?: string;
      }
    | { host: string; port: number }
    | { accessClientId: string; accessClientSecret: string; host: string };
  /** Body param: The (soft) maximum number of connections the Hyperdrive is allowed to make to the origin database. */
  originConnectionLimit?: number;
}

export const PatchConfigRequest = Schema.Struct({
  hyperdriveId: Schema.String.pipe(T.HttpPath("hyperdriveId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  caching: Schema.optional(
    Schema.Union(
      Schema.Struct({
        disabled: Schema.optional(Schema.Boolean),
      }),
      Schema.Struct({
        disabled: Schema.optional(Schema.Boolean),
        maxAge: Schema.optional(Schema.Number).pipe(T.JsonName("max_age")),
        staleWhileRevalidate: Schema.optional(Schema.Number).pipe(
          T.JsonName("stale_while_revalidate"),
        ),
      }),
    ),
  ),
  mtls: Schema.optional(
    Schema.Struct({
      caCertificateId: Schema.optional(Schema.String).pipe(T.JsonName("ca_certificate_id")),
      mtlsCertificateId: Schema.optional(Schema.String).pipe(T.JsonName("mtls_certificate_id")),
      sslmode: Schema.optional(Schema.String),
    }),
  ),
  name: Schema.optional(Schema.String),
  origin: Schema.optional(
    Schema.Union(
      Schema.Struct({
        database: Schema.optional(Schema.String),
        password: Schema.optional(Schema.String),
        scheme: Schema.optional(Schema.Literal("postgres", "postgresql", "mysql")),
        user: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        host: Schema.String,
        port: Schema.Number,
      }),
      Schema.Struct({
        accessClientId: Schema.String.pipe(T.JsonName("access_client_id")),
        accessClientSecret: Schema.String.pipe(T.JsonName("access_client_secret")),
        host: Schema.String,
      }),
    ),
  ),
  originConnectionLimit: Schema.optional(Schema.Number).pipe(T.JsonName("origin_connection_limit")),
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/hyperdrive/configs/{hyperdriveId}" }),
) as unknown as Schema.Schema<PatchConfigRequest>;

export type PatchConfigResponse = unknown;

export const PatchConfigResponse = Schema.Unknown as unknown as Schema.Schema<PatchConfigResponse>;

export const patchConfig = API.make(() => ({
  input: PatchConfigRequest,
  output: PatchConfigResponse,
  errors: [],
}));

export interface DeleteConfigRequest {
  hyperdriveId: string;
  /** Define configurations using a unique string identifier. */
  accountId: string;
}

export const DeleteConfigRequest = Schema.Struct({
  hyperdriveId: Schema.String.pipe(T.HttpPath("hyperdriveId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/hyperdrive/configs/{hyperdriveId}" }),
) as unknown as Schema.Schema<DeleteConfigRequest>;

export type DeleteConfigResponse = unknown;

export const DeleteConfigResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteConfigResponse>;

export const deleteConfig = API.make(() => ({
  input: DeleteConfigRequest,
  output: DeleteConfigResponse,
  errors: [],
}));
