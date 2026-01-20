/**
 * Cloudflare SECURITY-TXT API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service security-txt
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
// SecurityTXT
// =============================================================================

export interface GetSecurityTXTRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetSecurityTXTRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/security-center/securitytxt",
  }),
) as unknown as Schema.Schema<GetSecurityTXTRequest>;

export interface GetSecurityTXTResponse {
  acknowledgments?: string[];
  canonical?: string[];
  contact?: string[];
  enabled?: boolean;
  encryption?: string[];
  expires?: string;
  hiring?: string[];
  policy?: string[];
  preferredLanguages?: string;
}

export const GetSecurityTXTResponse = Schema.Struct({
  acknowledgments: Schema.optional(Schema.Array(Schema.String)),
  canonical: Schema.optional(Schema.Array(Schema.String)),
  contact: Schema.optional(Schema.Array(Schema.String)),
  enabled: Schema.optional(Schema.Boolean),
  encryption: Schema.optional(Schema.Array(Schema.String)),
  expires: Schema.optional(Schema.String),
  hiring: Schema.optional(Schema.Array(Schema.String)),
  policy: Schema.optional(Schema.Array(Schema.String)),
  preferredLanguages: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetSecurityTXTResponse>;

export const getSecurityTXT: (
  input: GetSecurityTXTRequest,
) => Effect.Effect<
  GetSecurityTXTResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSecurityTXTRequest,
  output: GetSecurityTXTResponse,
  errors: [],
}));

export interface PutSecurityTXTRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: */
  acknowledgments?: string[];
  /** Body param: */
  canonical?: string[];
  /** Body param: */
  contact?: string[];
  /** Body param: */
  enabled?: boolean;
  /** Body param: */
  encryption?: string[];
  /** Body param: */
  expires?: string;
  /** Body param: */
  hiring?: string[];
  /** Body param: */
  policy?: string[];
  /** Body param: */
  preferredLanguages?: string;
}

export const PutSecurityTXTRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  acknowledgments: Schema.optional(Schema.Array(Schema.String)),
  canonical: Schema.optional(Schema.Array(Schema.String)),
  contact: Schema.optional(Schema.Array(Schema.String)),
  enabled: Schema.optional(Schema.Boolean),
  encryption: Schema.optional(Schema.Array(Schema.String)),
  expires: Schema.optional(Schema.String),
  hiring: Schema.optional(Schema.Array(Schema.String)),
  policy: Schema.optional(Schema.Array(Schema.String)),
  preferredLanguages: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/zones/{zone_id}/security-center/securitytxt",
  }),
) as unknown as Schema.Schema<PutSecurityTXTRequest>;

export interface PutSecurityTXTResponse {
  errors: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  messages: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  /** Whether the API call was successful. */
  success: true;
}

export const PutSecurityTXTResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<PutSecurityTXTResponse>;

export const putSecurityTXT: (
  input: PutSecurityTXTRequest,
) => Effect.Effect<
  PutSecurityTXTResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutSecurityTXTRequest,
  output: PutSecurityTXTResponse,
  errors: [],
}));

export interface DeleteSecurityTXTRequest {
  /** Identifier. */
  zoneId: string;
}

export const DeleteSecurityTXTRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/security-center/securitytxt",
  }),
) as unknown as Schema.Schema<DeleteSecurityTXTRequest>;

export interface DeleteSecurityTXTResponse {
  errors: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  messages: {
    code: number;
    message: string;
    documentationUrl?: string;
    source?: { pointer?: string };
  }[];
  /** Whether the API call was successful. */
  success: true;
}

export const DeleteSecurityTXTResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<DeleteSecurityTXTResponse>;

export const deleteSecurityTXT: (
  input: DeleteSecurityTXTRequest,
) => Effect.Effect<
  DeleteSecurityTXTResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteSecurityTXTRequest,
  output: DeleteSecurityTXTResponse,
  errors: [],
}));
