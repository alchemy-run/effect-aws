/**
 * Cloudflare CUSTOM-NAMESERVERS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service custom-nameservers
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// CustomNameserver
// =============================================================================

export interface CreateCustomNameserverRequest {
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: The FQDN of the name server. */
  nsName: string;
  /** Body param: The number of the set that this name server belongs to. */
  nsSet?: number;
}

export const CreateCustomNameserverRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  nsName: Schema.String.pipe(T.JsonName("ns_name")),
  nsSet: Schema.optional(Schema.Number).pipe(T.JsonName("ns_set")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/custom_ns" }),
) as unknown as Schema.Schema<CreateCustomNameserverRequest>;

export interface CreateCustomNameserverResponse {
  /** A and AAAA records associated with the nameserver. */
  dnsRecords: { type?: "A" | "AAAA"; value?: string }[];
  /** The FQDN of the name server. */
  nsName: string;
  /** @deprecated Verification status of the nameserver. */
  status: "moved" | "pending" | "verified";
  /** Identifier. */
  zoneTag: string;
  /** The number of the set that this name server belongs to. */
  nsSet?: number;
}

export const CreateCustomNameserverResponse = Schema.Struct({
  dnsRecords: Schema.Array(
    Schema.Struct({
      type: Schema.optional(Schema.Literal("A", "AAAA")),
      value: Schema.optional(Schema.String),
    }),
  ).pipe(T.JsonName("dns_records")),
  nsName: Schema.String.pipe(T.JsonName("ns_name")),
  status: Schema.Literal("moved", "pending", "verified"),
  zoneTag: Schema.String.pipe(T.JsonName("zone_tag")),
  nsSet: Schema.optional(Schema.Number).pipe(T.JsonName("ns_set")),
}) as unknown as Schema.Schema<CreateCustomNameserverResponse>;

export const createCustomNameserver = API.make(() => ({
  input: CreateCustomNameserverRequest,
  output: CreateCustomNameserverResponse,
  errors: [],
}));
