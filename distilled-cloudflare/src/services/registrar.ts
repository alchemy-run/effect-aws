/**
 * Cloudflare REGISTRAR API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service registrar
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Domain
// =============================================================================

export interface GetDomainRequest {
  domainName: string;
  /** Identifier */
  accountId: string;
}

export const GetDomainRequest = Schema.Struct({
  domainName: Schema.String.pipe(T.HttpPath("domainName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/registrar/domains/{domainName}" }),
) as unknown as Schema.Schema<GetDomainRequest>;

export type GetDomainResponse = unknown;

export const GetDomainResponse = Schema.Unknown as unknown as Schema.Schema<GetDomainResponse>;

export const getDomain = API.make(() => ({
  input: GetDomainRequest,
  output: GetDomainResponse,
  errors: [],
}));

export interface PutDomainRequest {
  domainName: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: Auto-renew controls whether subscription is automatically renewed upon domain expiration. */
  autoRenew?: boolean;
  /** Body param: Shows whether a registrar lock is in place for a domain. */
  locked?: boolean;
  /** Body param: Privacy option controls redacting WHOIS information. */
  privacy?: boolean;
}

export const PutDomainRequest = Schema.Struct({
  domainName: Schema.String.pipe(T.HttpPath("domainName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  autoRenew: Schema.optional(Schema.Boolean).pipe(T.JsonName("auto_renew")),
  locked: Schema.optional(Schema.Boolean),
  privacy: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/registrar/domains/{domainName}" }),
) as unknown as Schema.Schema<PutDomainRequest>;

export type PutDomainResponse = unknown;

export const PutDomainResponse = Schema.Unknown as unknown as Schema.Schema<PutDomainResponse>;

export const putDomain = API.make(() => ({
  input: PutDomainRequest,
  output: PutDomainResponse,
  errors: [],
}));
