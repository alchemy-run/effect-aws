/**
 * Cloudflare DIAGNOSTICS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service diagnostics
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// EndpointHealthcheck
// =============================================================================

export interface GetEndpointHealthcheckRequest {
  id: string;
  /** Identifier */
  accountId: string;
}

export const GetEndpointHealthcheckRequest = Schema.Struct({
  id: Schema.String.pipe(T.HttpPath("id")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/diagnostics/endpoint-healthchecks/{id}" }),
) as unknown as Schema.Schema<GetEndpointHealthcheckRequest>;

export interface GetEndpointHealthcheckResponse {
  /** type of check to perform */
  checkType: "icmp";
  /** the IP address of the host to perform checks against */
  endpoint: string;
  /** UUID. */
  id?: string;
  /** Optional name associated with this check */
  name?: string;
}

export const GetEndpointHealthcheckResponse = Schema.Struct({
  checkType: Schema.Literal("icmp").pipe(T.JsonName("check_type")),
  endpoint: Schema.String,
  id: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetEndpointHealthcheckResponse>;

export const getEndpointHealthcheck = API.make(() => ({
  input: GetEndpointHealthcheckRequest,
  output: GetEndpointHealthcheckResponse,
  errors: [],
}));

export interface ListEndpointHealthchecksRequest {
  /** Identifier */
  accountId: string;
}

export const ListEndpointHealthchecksRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/diagnostics/endpoint-healthchecks" }),
) as unknown as Schema.Schema<ListEndpointHealthchecksRequest>;

export interface ListEndpointHealthchecksResponse {
  /** type of check to perform */
  checkType: "icmp";
  /** the IP address of the host to perform checks against */
  endpoint: string;
  /** UUID. */
  id?: string;
  /** Optional name associated with this check */
  name?: string;
}

export const ListEndpointHealthchecksResponse = Schema.Struct({
  checkType: Schema.Literal("icmp").pipe(T.JsonName("check_type")),
  endpoint: Schema.String,
  id: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<ListEndpointHealthchecksResponse>;

export const listEndpointHealthchecks = API.make(() => ({
  input: ListEndpointHealthchecksRequest,
  output: ListEndpointHealthchecksResponse,
  errors: [],
}));

export interface CreateEndpointHealthcheckRequest {
  /** Path param: Identifier */
  accountId: string;
  /** Body param: type of check to perform */
  checkType: "icmp";
  /** Body param: the IP address of the host to perform checks against */
  endpoint: string;
  /** Body param: Optional name associated with this check */
  name?: string;
}

export const CreateEndpointHealthcheckRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  checkType: Schema.Literal("icmp").pipe(T.JsonName("check_type")),
  endpoint: Schema.String,
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/diagnostics/endpoint-healthchecks" }),
) as unknown as Schema.Schema<CreateEndpointHealthcheckRequest>;

export interface CreateEndpointHealthcheckResponse {
  /** type of check to perform */
  checkType: "icmp";
  /** the IP address of the host to perform checks against */
  endpoint: string;
  /** UUID. */
  id?: string;
  /** Optional name associated with this check */
  name?: string;
}

export const CreateEndpointHealthcheckResponse = Schema.Struct({
  checkType: Schema.Literal("icmp").pipe(T.JsonName("check_type")),
  endpoint: Schema.String,
  id: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateEndpointHealthcheckResponse>;

export const createEndpointHealthcheck = API.make(() => ({
  input: CreateEndpointHealthcheckRequest,
  output: CreateEndpointHealthcheckResponse,
  errors: [],
}));

export interface UpdateEndpointHealthcheckRequest {
  id: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: type of check to perform */
  checkType: "icmp";
  /** Body param: the IP address of the host to perform checks against */
  endpoint: string;
  /** Body param: Optional name associated with this check */
  name?: string;
}

export const UpdateEndpointHealthcheckRequest = Schema.Struct({
  id: Schema.String.pipe(T.HttpPath("id")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  checkType: Schema.Literal("icmp").pipe(T.JsonName("check_type")),
  endpoint: Schema.String,
  name: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/diagnostics/endpoint-healthchecks/{id}" }),
) as unknown as Schema.Schema<UpdateEndpointHealthcheckRequest>;

export interface UpdateEndpointHealthcheckResponse {
  /** type of check to perform */
  checkType: "icmp";
  /** the IP address of the host to perform checks against */
  endpoint: string;
  /** UUID. */
  id?: string;
  /** Optional name associated with this check */
  name?: string;
}

export const UpdateEndpointHealthcheckResponse = Schema.Struct({
  checkType: Schema.Literal("icmp").pipe(T.JsonName("check_type")),
  endpoint: Schema.String,
  id: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateEndpointHealthcheckResponse>;

export const updateEndpointHealthcheck = API.make(() => ({
  input: UpdateEndpointHealthcheckRequest,
  output: UpdateEndpointHealthcheckResponse,
  errors: [],
}));

export interface DeleteEndpointHealthcheckRequest {
  id: string;
  /** Identifier */
  accountId: string;
}

export const DeleteEndpointHealthcheckRequest = Schema.Struct({
  id: Schema.String.pipe(T.HttpPath("id")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/diagnostics/endpoint-healthchecks/{id}",
  }),
) as unknown as Schema.Schema<DeleteEndpointHealthcheckRequest>;

export interface DeleteEndpointHealthcheckResponse {
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

export const DeleteEndpointHealthcheckResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Number,
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(T.JsonName("documentation_url")),
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
      documentationUrl: Schema.optional(Schema.String).pipe(T.JsonName("documentation_url")),
      source: Schema.optional(
        Schema.Struct({
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<DeleteEndpointHealthcheckResponse>;

export const deleteEndpointHealthcheck = API.make(() => ({
  input: DeleteEndpointHealthcheckRequest,
  output: DeleteEndpointHealthcheckResponse,
  errors: [],
}));
