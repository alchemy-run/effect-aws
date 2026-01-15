/**
 * Cloudflare MEMBERSHIPS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service memberships
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Membership
// =============================================================================

export interface GetMembershipRequest {
  membershipId: string;
}

export const GetMembershipRequest = Schema.Struct({
  membershipId: Schema.String.pipe(T.HttpPath("membershipId")),
}).pipe(
  T.Http({ method: "GET", path: "/memberships/{membershipId}" }),
) as unknown as Schema.Schema<GetMembershipRequest>;

export interface GetMembershipResponse {
  /** Membership identifier tag. */
  id?: string;
  account?: unknown;
  /** Enterprise only. Indicates whether or not API access is enabled specifically for this user on a given account. */
  apiAccessEnabled?: boolean | null;
  /** All access permissions for the user at the account. */
  permissions?: {
    analytics?: unknown;
    billing?: unknown;
    cachePurge?: unknown;
    dns?: unknown;
    dnsRecords?: unknown;
    lb?: unknown;
    logs?: unknown;
    organization?: unknown;
    ssl?: unknown;
    waf?: unknown;
    zoneSettings?: unknown;
    zones?: unknown;
  };
  /** Access policy for the membership */
  policies?: {
    id?: string;
    access?: "allow" | "deny";
    permissionGroups?: { id: string; meta?: { key?: string; value?: string }; name?: string }[];
    resourceGroups?: {
      id: string;
      scope: { key: string; objects: { key: string }[] }[];
      meta?: { key?: string; value?: string };
      name?: string;
    }[];
  }[];
  /** List of role names the membership has for this account. */
  roles?: string[];
  /** Status of this membership. */
  status?: "accepted" | "pending" | "rejected";
}

export const GetMembershipResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  account: Schema.optional(Schema.Unknown),
  apiAccessEnabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)).pipe(
    T.JsonName("api_access_enabled"),
  ),
  permissions: Schema.optional(
    Schema.Struct({
      analytics: Schema.optional(Schema.Unknown),
      billing: Schema.optional(Schema.Unknown),
      cachePurge: Schema.optional(Schema.Unknown).pipe(T.JsonName("cache_purge")),
      dns: Schema.optional(Schema.Unknown),
      dnsRecords: Schema.optional(Schema.Unknown).pipe(T.JsonName("dns_records")),
      lb: Schema.optional(Schema.Unknown),
      logs: Schema.optional(Schema.Unknown),
      organization: Schema.optional(Schema.Unknown),
      ssl: Schema.optional(Schema.Unknown),
      waf: Schema.optional(Schema.Unknown),
      zoneSettings: Schema.optional(Schema.Unknown).pipe(T.JsonName("zone_settings")),
      zones: Schema.optional(Schema.Unknown),
    }),
  ),
  policies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        access: Schema.optional(Schema.Literal("allow", "deny")),
        permissionGroups: Schema.optional(
          Schema.Array(
            Schema.Struct({
              id: Schema.String,
              meta: Schema.optional(
                Schema.Struct({
                  key: Schema.optional(Schema.String),
                  value: Schema.optional(Schema.String),
                }),
              ),
              name: Schema.optional(Schema.String),
            }),
          ),
        ).pipe(T.JsonName("permission_groups")),
        resourceGroups: Schema.optional(
          Schema.Array(
            Schema.Struct({
              id: Schema.String,
              scope: Schema.Array(
                Schema.Struct({
                  key: Schema.String,
                  objects: Schema.Array(
                    Schema.Struct({
                      key: Schema.String,
                    }),
                  ),
                }),
              ),
              meta: Schema.optional(
                Schema.Struct({
                  key: Schema.optional(Schema.String),
                  value: Schema.optional(Schema.String),
                }),
              ),
              name: Schema.optional(Schema.String),
            }),
          ),
        ).pipe(T.JsonName("resource_groups")),
      }),
    ),
  ),
  roles: Schema.optional(Schema.Array(Schema.String)),
  status: Schema.optional(Schema.Literal("accepted", "pending", "rejected")),
}) as unknown as Schema.Schema<GetMembershipResponse>;

export const getMembership = API.make(() => ({
  input: GetMembershipRequest,
  output: GetMembershipResponse,
  errors: [],
}));

export interface PutMembershipRequest {
  membershipId: string;
  /** Whether to accept or reject this account invitation. */
  status: "accepted" | "rejected";
}

export const PutMembershipRequest = Schema.Struct({
  membershipId: Schema.String.pipe(T.HttpPath("membershipId")),
  status: Schema.Literal("accepted", "rejected"),
}).pipe(
  T.Http({ method: "PUT", path: "/memberships/{membershipId}" }),
) as unknown as Schema.Schema<PutMembershipRequest>;

export interface PutMembershipResponse {
  /** Membership identifier tag. */
  id?: string;
  account?: unknown;
  /** Enterprise only. Indicates whether or not API access is enabled specifically for this user on a given account. */
  apiAccessEnabled?: boolean | null;
  /** All access permissions for the user at the account. */
  permissions?: {
    analytics?: unknown;
    billing?: unknown;
    cachePurge?: unknown;
    dns?: unknown;
    dnsRecords?: unknown;
    lb?: unknown;
    logs?: unknown;
    organization?: unknown;
    ssl?: unknown;
    waf?: unknown;
    zoneSettings?: unknown;
    zones?: unknown;
  };
  /** Access policy for the membership */
  policies?: {
    id?: string;
    access?: "allow" | "deny";
    permissionGroups?: { id: string; meta?: { key?: string; value?: string }; name?: string }[];
    resourceGroups?: {
      id: string;
      scope: { key: string; objects: { key: string }[] }[];
      meta?: { key?: string; value?: string };
      name?: string;
    }[];
  }[];
  /** List of role names the membership has for this account. */
  roles?: string[];
  /** Status of this membership. */
  status?: "accepted" | "pending" | "rejected";
}

export const PutMembershipResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  account: Schema.optional(Schema.Unknown),
  apiAccessEnabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)).pipe(
    T.JsonName("api_access_enabled"),
  ),
  permissions: Schema.optional(
    Schema.Struct({
      analytics: Schema.optional(Schema.Unknown),
      billing: Schema.optional(Schema.Unknown),
      cachePurge: Schema.optional(Schema.Unknown).pipe(T.JsonName("cache_purge")),
      dns: Schema.optional(Schema.Unknown),
      dnsRecords: Schema.optional(Schema.Unknown).pipe(T.JsonName("dns_records")),
      lb: Schema.optional(Schema.Unknown),
      logs: Schema.optional(Schema.Unknown),
      organization: Schema.optional(Schema.Unknown),
      ssl: Schema.optional(Schema.Unknown),
      waf: Schema.optional(Schema.Unknown),
      zoneSettings: Schema.optional(Schema.Unknown).pipe(T.JsonName("zone_settings")),
      zones: Schema.optional(Schema.Unknown),
    }),
  ),
  policies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        access: Schema.optional(Schema.Literal("allow", "deny")),
        permissionGroups: Schema.optional(
          Schema.Array(
            Schema.Struct({
              id: Schema.String,
              meta: Schema.optional(
                Schema.Struct({
                  key: Schema.optional(Schema.String),
                  value: Schema.optional(Schema.String),
                }),
              ),
              name: Schema.optional(Schema.String),
            }),
          ),
        ).pipe(T.JsonName("permission_groups")),
        resourceGroups: Schema.optional(
          Schema.Array(
            Schema.Struct({
              id: Schema.String,
              scope: Schema.Array(
                Schema.Struct({
                  key: Schema.String,
                  objects: Schema.Array(
                    Schema.Struct({
                      key: Schema.String,
                    }),
                  ),
                }),
              ),
              meta: Schema.optional(
                Schema.Struct({
                  key: Schema.optional(Schema.String),
                  value: Schema.optional(Schema.String),
                }),
              ),
              name: Schema.optional(Schema.String),
            }),
          ),
        ).pipe(T.JsonName("resource_groups")),
      }),
    ),
  ),
  roles: Schema.optional(Schema.Array(Schema.String)),
  status: Schema.optional(Schema.Literal("accepted", "pending", "rejected")),
}) as unknown as Schema.Schema<PutMembershipResponse>;

export const putMembership = API.make(() => ({
  input: PutMembershipRequest,
  output: PutMembershipResponse,
  errors: [],
}));

export interface DeleteMembershipRequest {
  membershipId: string;
}

export const DeleteMembershipRequest = Schema.Struct({
  membershipId: Schema.String.pipe(T.HttpPath("membershipId")),
}).pipe(
  T.Http({ method: "DELETE", path: "/memberships/{membershipId}" }),
) as unknown as Schema.Schema<DeleteMembershipRequest>;

export interface DeleteMembershipResponse {
  /** Membership identifier tag. */
  id?: string;
}

export const DeleteMembershipResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteMembershipResponse>;

export const deleteMembership = API.make(() => ({
  input: DeleteMembershipRequest,
  output: DeleteMembershipResponse,
  errors: [],
}));
