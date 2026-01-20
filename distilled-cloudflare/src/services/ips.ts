/**
 * Cloudflare IPS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service ips
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
// IP
// =============================================================================

export interface ListIPsRequest {}

export const ListIPsRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/ips" }),
) as unknown as Schema.Schema<ListIPsRequest>;

export type ListIPsResponse =
  | { etag?: string; ipv4Cidrs?: string[]; ipv6Cidrs?: string[] }
  | {
      etag?: string;
      ipv4Cidrs?: string[];
      ipv6Cidrs?: string[];
      jdcloudCidrs?: string[];
    };

export const ListIPsResponse = Schema.Union(
  Schema.Struct({
    etag: Schema.optional(Schema.String),
    ipv4Cidrs: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("ipv4_cidrs"),
    ),
    ipv6Cidrs: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("ipv6_cidrs"),
    ),
  }),
  Schema.Struct({
    etag: Schema.optional(Schema.String),
    ipv4Cidrs: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("ipv4_cidrs"),
    ),
    ipv6Cidrs: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("ipv6_cidrs"),
    ),
    jdcloudCidrs: Schema.optional(Schema.Array(Schema.String)).pipe(
      T.JsonName("jdcloud_cidrs"),
    ),
  }),
) as unknown as Schema.Schema<ListIPsResponse>;

export const listIPs: (
  input: ListIPsRequest,
) => Effect.Effect<
  ListIPsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListIPsRequest,
  output: ListIPsResponse,
  errors: [],
}));
