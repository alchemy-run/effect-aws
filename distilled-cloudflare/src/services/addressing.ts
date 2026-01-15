/**
 * Cloudflare ADDRESSING API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service addressing
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// AddressMap
// =============================================================================

export interface GetAddressMapRequest {
  addressMapId: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const GetAddressMapRequest = Schema.Struct({
  addressMapId: Schema.String.pipe(T.HttpPath("addressMapId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/addressing/address_maps/{addressMapId}" }),
) as unknown as Schema.Schema<GetAddressMapRequest>;

export interface GetAddressMapResponse {
  /** Identifier of an Address Map. */
  id?: string;
  /** If set to false, then the Address Map cannot be deleted via API. This is true for Cloudflare-managed maps. */
  canDelete?: boolean;
  /** If set to false, then the IPs on the Address Map cannot be modified via the API. This is true for Cloudflare-managed maps. */
  canModifyIps?: boolean;
  createdAt?: string;
  /** If you have legacy TLS clients which do not send the TLS server name indicator, then you can specify one default SNI on the map. If Cloudflare receives a TLS handshake from a client without an SNI, it */
  defaultSni?: string | null;
  /** An optional description field which may be used to describe the types of IPs or zones on the map. */
  description?: string | null;
  /** Whether the Address Map is enabled or not. Cloudflare's DNS will not respond with IP addresses on an Address Map until the map is enabled. */
  enabled?: boolean | null;
  /** The set of IPs on the Address Map. */
  ips?: unknown;
  /** Zones and Accounts which will be assigned IPs on this Address Map. A zone membership will take priority over an account membership. */
  memberships?: {
    canDelete?: boolean;
    createdAt?: string;
    identifier?: string;
    kind?: "zone" | "account";
  }[];
  modifiedAt?: string;
}

export const GetAddressMapResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  canDelete: Schema.optional(Schema.Boolean).pipe(T.JsonName("can_delete")),
  canModifyIps: Schema.optional(Schema.Boolean).pipe(T.JsonName("can_modify_ips")),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  defaultSni: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("default_sni"),
  ),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  ips: Schema.optional(Schema.Unknown),
  memberships: Schema.optional(
    Schema.Array(
      Schema.Struct({
        canDelete: Schema.optional(Schema.Boolean).pipe(T.JsonName("can_delete")),
        createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
        identifier: Schema.optional(Schema.String),
        kind: Schema.optional(Schema.Literal("zone", "account")),
      }),
    ),
  ),
  modifiedAt: Schema.optional(Schema.String).pipe(T.JsonName("modified_at")),
}) as unknown as Schema.Schema<GetAddressMapResponse>;

export const getAddressMap = API.make(() => ({
  input: GetAddressMapRequest,
  output: GetAddressMapResponse,
  errors: [],
}));

export interface CreateAddressMapRequest {
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: An optional description field which may be used to describe the types of IPs or zones on the map. */
  description?: string | null;
  /** Body param: Whether the Address Map is enabled or not. Cloudflare's DNS will not respond with IP addresses on an Address Map until the map is enabled. */
  enabled?: boolean | null;
  /** Body param: */
  ips?: string[];
  /** Body param: Zones and Accounts which will be assigned IPs on this Address Map. A zone membership will take priority over an account membership. */
  memberships?: { identifier?: string; kind?: "zone" | "account" }[];
}

export const CreateAddressMapRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  ips: Schema.optional(Schema.Array(Schema.String)),
  memberships: Schema.optional(
    Schema.Array(
      Schema.Struct({
        identifier: Schema.optional(Schema.String),
        kind: Schema.optional(Schema.Literal("zone", "account")),
      }),
    ),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/addressing/address_maps" }),
) as unknown as Schema.Schema<CreateAddressMapRequest>;

export interface CreateAddressMapResponse {
  /** Identifier of an Address Map. */
  id?: string;
  /** If set to false, then the Address Map cannot be deleted via API. This is true for Cloudflare-managed maps. */
  canDelete?: boolean;
  /** If set to false, then the IPs on the Address Map cannot be modified via the API. This is true for Cloudflare-managed maps. */
  canModifyIps?: boolean;
  createdAt?: string;
  /** If you have legacy TLS clients which do not send the TLS server name indicator, then you can specify one default SNI on the map. If Cloudflare receives a TLS handshake from a client without an SNI, it */
  defaultSni?: string | null;
  /** An optional description field which may be used to describe the types of IPs or zones on the map. */
  description?: string | null;
  /** Whether the Address Map is enabled or not. Cloudflare's DNS will not respond with IP addresses on an Address Map until the map is enabled. */
  enabled?: boolean | null;
  /** The set of IPs on the Address Map. */
  ips?: unknown;
  /** Zones and Accounts which will be assigned IPs on this Address Map. A zone membership will take priority over an account membership. */
  memberships?: {
    canDelete?: boolean;
    createdAt?: string;
    identifier?: string;
    kind?: "zone" | "account";
  }[];
  modifiedAt?: string;
}

export const CreateAddressMapResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  canDelete: Schema.optional(Schema.Boolean).pipe(T.JsonName("can_delete")),
  canModifyIps: Schema.optional(Schema.Boolean).pipe(T.JsonName("can_modify_ips")),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  defaultSni: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("default_sni"),
  ),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  ips: Schema.optional(Schema.Unknown),
  memberships: Schema.optional(
    Schema.Array(
      Schema.Struct({
        canDelete: Schema.optional(Schema.Boolean).pipe(T.JsonName("can_delete")),
        createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
        identifier: Schema.optional(Schema.String),
        kind: Schema.optional(Schema.Literal("zone", "account")),
      }),
    ),
  ),
  modifiedAt: Schema.optional(Schema.String).pipe(T.JsonName("modified_at")),
}) as unknown as Schema.Schema<CreateAddressMapResponse>;

export const createAddressMap = API.make(() => ({
  input: CreateAddressMapRequest,
  output: CreateAddressMapResponse,
  errors: [],
}));

export interface PatchAddressMapRequest {
  addressMapId: string;
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: If you have legacy TLS clients which do not send the TLS server name indicator, then you can specify one default SNI on the map. If Cloudflare receives a TLS handshake from a client withou */
  defaultSni?: string | null;
  /** Body param: An optional description field which may be used to describe the types of IPs or zones on the map. */
  description?: string | null;
  /** Body param: Whether the Address Map is enabled or not. Cloudflare's DNS will not respond with IP addresses on an Address Map until the map is enabled. */
  enabled?: boolean | null;
}

export const PatchAddressMapRequest = Schema.Struct({
  addressMapId: Schema.String.pipe(T.HttpPath("addressMapId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  defaultSni: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("default_sni"),
  ),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/addressing/address_maps/{addressMapId}",
  }),
) as unknown as Schema.Schema<PatchAddressMapRequest>;

export interface PatchAddressMapResponse {
  /** Identifier of an Address Map. */
  id?: string;
  /** If set to false, then the Address Map cannot be deleted via API. This is true for Cloudflare-managed maps. */
  canDelete?: boolean;
  /** If set to false, then the IPs on the Address Map cannot be modified via the API. This is true for Cloudflare-managed maps. */
  canModifyIps?: boolean;
  createdAt?: string;
  /** If you have legacy TLS clients which do not send the TLS server name indicator, then you can specify one default SNI on the map. If Cloudflare receives a TLS handshake from a client without an SNI, it */
  defaultSni?: string | null;
  /** An optional description field which may be used to describe the types of IPs or zones on the map. */
  description?: string | null;
  /** Whether the Address Map is enabled or not. Cloudflare's DNS will not respond with IP addresses on an Address Map until the map is enabled. */
  enabled?: boolean | null;
  modifiedAt?: string;
}

export const PatchAddressMapResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  canDelete: Schema.optional(Schema.Boolean).pipe(T.JsonName("can_delete")),
  canModifyIps: Schema.optional(Schema.Boolean).pipe(T.JsonName("can_modify_ips")),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  defaultSni: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("default_sni"),
  ),
  description: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  enabled: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  modifiedAt: Schema.optional(Schema.String).pipe(T.JsonName("modified_at")),
}) as unknown as Schema.Schema<PatchAddressMapResponse>;

export const patchAddressMap = API.make(() => ({
  input: PatchAddressMapRequest,
  output: PatchAddressMapResponse,
  errors: [],
}));

export interface DeleteAddressMapRequest {
  addressMapId: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const DeleteAddressMapRequest = Schema.Struct({
  addressMapId: Schema.String.pipe(T.HttpPath("addressMapId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/addressing/address_maps/{addressMapId}",
  }),
) as unknown as Schema.Schema<DeleteAddressMapRequest>;

export interface DeleteAddressMapResponse {
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
  resultInfo?: { count?: number; page?: number; perPage?: number; totalCount?: number };
}

export const DeleteAddressMapResponse = Schema.Struct({
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
  resultInfo: Schema.optional(
    Schema.Struct({
      count: Schema.optional(Schema.Number),
      page: Schema.optional(Schema.Number),
      perPage: Schema.optional(Schema.Number).pipe(T.JsonName("per_page")),
      totalCount: Schema.optional(Schema.Number).pipe(T.JsonName("total_count")),
    }),
  ).pipe(T.JsonName("result_info")),
}) as unknown as Schema.Schema<DeleteAddressMapResponse>;

export const deleteAddressMap = API.make(() => ({
  input: DeleteAddressMapRequest,
  output: DeleteAddressMapResponse,
  errors: [],
}));

// =============================================================================
// AddressMapAccount
// =============================================================================

export interface PutAddressMapAccountRequest {
  addressMapId: string;
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const PutAddressMapAccountRequest = Schema.Struct({
  addressMapId: Schema.String.pipe(T.HttpPath("addressMapId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/addressing/address_maps/{addressMapId}/accounts/{account_id}",
  }),
) as unknown as Schema.Schema<PutAddressMapAccountRequest>;

export interface PutAddressMapAccountResponse {
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
  resultInfo?: { count?: number; page?: number; perPage?: number; totalCount?: number };
}

export const PutAddressMapAccountResponse = Schema.Struct({
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
  resultInfo: Schema.optional(
    Schema.Struct({
      count: Schema.optional(Schema.Number),
      page: Schema.optional(Schema.Number),
      perPage: Schema.optional(Schema.Number).pipe(T.JsonName("per_page")),
      totalCount: Schema.optional(Schema.Number).pipe(T.JsonName("total_count")),
    }),
  ).pipe(T.JsonName("result_info")),
}) as unknown as Schema.Schema<PutAddressMapAccountResponse>;

export const putAddressMapAccount = API.make(() => ({
  input: PutAddressMapAccountRequest,
  output: PutAddressMapAccountResponse,
  errors: [],
}));

export interface DeleteAddressMapAccountRequest {
  addressMapId: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const DeleteAddressMapAccountRequest = Schema.Struct({
  addressMapId: Schema.String.pipe(T.HttpPath("addressMapId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/addressing/address_maps/{addressMapId}/accounts/{account_id}",
  }),
) as unknown as Schema.Schema<DeleteAddressMapAccountRequest>;

export interface DeleteAddressMapAccountResponse {
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
  resultInfo?: { count?: number; page?: number; perPage?: number; totalCount?: number };
}

export const DeleteAddressMapAccountResponse = Schema.Struct({
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
  resultInfo: Schema.optional(
    Schema.Struct({
      count: Schema.optional(Schema.Number),
      page: Schema.optional(Schema.Number),
      perPage: Schema.optional(Schema.Number).pipe(T.JsonName("per_page")),
      totalCount: Schema.optional(Schema.Number).pipe(T.JsonName("total_count")),
    }),
  ).pipe(T.JsonName("result_info")),
}) as unknown as Schema.Schema<DeleteAddressMapAccountResponse>;

export const deleteAddressMapAccount = API.make(() => ({
  input: DeleteAddressMapAccountRequest,
  output: DeleteAddressMapAccountResponse,
  errors: [],
}));

// =============================================================================
// AddressMapIp
// =============================================================================

export interface PutAddressMapIpRequest {
  addressMapId: string;
  ipAddress: string;
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const PutAddressMapIpRequest = Schema.Struct({
  addressMapId: Schema.String.pipe(T.HttpPath("addressMapId")),
  ipAddress: Schema.String.pipe(T.HttpPath("ipAddress")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/addressing/address_maps/{addressMapId}/ips/{ipAddress}",
  }),
) as unknown as Schema.Schema<PutAddressMapIpRequest>;

export interface PutAddressMapIpResponse {
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
  resultInfo?: { count?: number; page?: number; perPage?: number; totalCount?: number };
}

export const PutAddressMapIpResponse = Schema.Struct({
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
  resultInfo: Schema.optional(
    Schema.Struct({
      count: Schema.optional(Schema.Number),
      page: Schema.optional(Schema.Number),
      perPage: Schema.optional(Schema.Number).pipe(T.JsonName("per_page")),
      totalCount: Schema.optional(Schema.Number).pipe(T.JsonName("total_count")),
    }),
  ).pipe(T.JsonName("result_info")),
}) as unknown as Schema.Schema<PutAddressMapIpResponse>;

export const putAddressMapIp = API.make(() => ({
  input: PutAddressMapIpRequest,
  output: PutAddressMapIpResponse,
  errors: [],
}));

export interface DeleteAddressMapIpRequest {
  addressMapId: string;
  ipAddress: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const DeleteAddressMapIpRequest = Schema.Struct({
  addressMapId: Schema.String.pipe(T.HttpPath("addressMapId")),
  ipAddress: Schema.String.pipe(T.HttpPath("ipAddress")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/addressing/address_maps/{addressMapId}/ips/{ipAddress}",
  }),
) as unknown as Schema.Schema<DeleteAddressMapIpRequest>;

export interface DeleteAddressMapIpResponse {
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
  resultInfo?: { count?: number; page?: number; perPage?: number; totalCount?: number };
}

export const DeleteAddressMapIpResponse = Schema.Struct({
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
  resultInfo: Schema.optional(
    Schema.Struct({
      count: Schema.optional(Schema.Number),
      page: Schema.optional(Schema.Number),
      perPage: Schema.optional(Schema.Number).pipe(T.JsonName("per_page")),
      totalCount: Schema.optional(Schema.Number).pipe(T.JsonName("total_count")),
    }),
  ).pipe(T.JsonName("result_info")),
}) as unknown as Schema.Schema<DeleteAddressMapIpResponse>;

export const deleteAddressMapIp = API.make(() => ({
  input: DeleteAddressMapIpRequest,
  output: DeleteAddressMapIpResponse,
  errors: [],
}));

// =============================================================================
// AddressMapZone
// =============================================================================

export interface PutAddressMapZoneRequest {
  addressMapId: string;
  /** Path param: Identifier of a zone. */
  zoneId: string;
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const PutAddressMapZoneRequest = Schema.Struct({
  addressMapId: Schema.String.pipe(T.HttpPath("addressMapId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/addressing/address_maps/{addressMapId}/zones/{zone_id}",
  }),
) as unknown as Schema.Schema<PutAddressMapZoneRequest>;

export interface PutAddressMapZoneResponse {
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
  resultInfo?: { count?: number; page?: number; perPage?: number; totalCount?: number };
}

export const PutAddressMapZoneResponse = Schema.Struct({
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
  resultInfo: Schema.optional(
    Schema.Struct({
      count: Schema.optional(Schema.Number),
      page: Schema.optional(Schema.Number),
      perPage: Schema.optional(Schema.Number).pipe(T.JsonName("per_page")),
      totalCount: Schema.optional(Schema.Number).pipe(T.JsonName("total_count")),
    }),
  ).pipe(T.JsonName("result_info")),
}) as unknown as Schema.Schema<PutAddressMapZoneResponse>;

export const putAddressMapZone = API.make(() => ({
  input: PutAddressMapZoneRequest,
  output: PutAddressMapZoneResponse,
  errors: [],
}));

export interface DeleteAddressMapZoneRequest {
  addressMapId: string;
  /** Identifier of a zone. */
  zoneId: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const DeleteAddressMapZoneRequest = Schema.Struct({
  addressMapId: Schema.String.pipe(T.HttpPath("addressMapId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/addressing/address_maps/{addressMapId}/zones/{zone_id}",
  }),
) as unknown as Schema.Schema<DeleteAddressMapZoneRequest>;

export interface DeleteAddressMapZoneResponse {
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
  resultInfo?: { count?: number; page?: number; perPage?: number; totalCount?: number };
}

export const DeleteAddressMapZoneResponse = Schema.Struct({
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
  resultInfo: Schema.optional(
    Schema.Struct({
      count: Schema.optional(Schema.Number),
      page: Schema.optional(Schema.Number),
      perPage: Schema.optional(Schema.Number).pipe(T.JsonName("per_page")),
      totalCount: Schema.optional(Schema.Number).pipe(T.JsonName("total_count")),
    }),
  ).pipe(T.JsonName("result_info")),
}) as unknown as Schema.Schema<DeleteAddressMapZoneResponse>;

export const deleteAddressMapZone = API.make(() => ({
  input: DeleteAddressMapZoneRequest,
  output: DeleteAddressMapZoneResponse,
  errors: [],
}));

// =============================================================================
// LoaDocument
// =============================================================================

export interface GetLoaDocumentRequest {
  loaDocumentId: string | null;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const GetLoaDocumentRequest = Schema.Struct({
  loaDocumentId: Schema.Union(Schema.String, Schema.Null).pipe(T.HttpPath("loaDocumentId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/addressing/loa_documents/{loaDocumentId}/download",
  }),
) as unknown as Schema.Schema<GetLoaDocumentRequest>;

export type GetLoaDocumentResponse = unknown;

export const GetLoaDocumentResponse =
  Schema.Unknown as unknown as Schema.Schema<GetLoaDocumentResponse>;

export const getLoaDocument = API.make(() => ({
  input: GetLoaDocumentRequest,
  output: GetLoaDocumentResponse,
  errors: [],
}));

export interface CreateLoaDocumentRequest {
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: LOA document to upload. */
  loaDocument: string;
}

export const CreateLoaDocumentRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  loaDocument: Schema.String.pipe(T.JsonName("loa_document")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/addressing/loa_documents" }),
) as unknown as Schema.Schema<CreateLoaDocumentRequest>;

export interface CreateLoaDocumentResponse {
  /** Identifier for the uploaded LOA document. */
  id?: string | null;
  /** Identifier of a Cloudflare account. */
  accountId?: string;
  created?: string;
  /** Name of LOA document. Max file size 10MB, and supported filetype is pdf. */
  filename?: string;
  /** File size of the uploaded LOA document. */
  sizeBytes?: number;
  /** Whether the LOA has been verified by Cloudflare staff. */
  verified?: boolean;
  /** Timestamp of the moment the LOA was marked as validated. */
  verifiedAt?: string | null;
}

export const CreateLoaDocumentResponse = Schema.Struct({
  id: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
  created: Schema.optional(Schema.String),
  filename: Schema.optional(Schema.String),
  sizeBytes: Schema.optional(Schema.Number).pipe(T.JsonName("size_bytes")),
  verified: Schema.optional(Schema.Boolean),
  verifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("verified_at"),
  ),
}) as unknown as Schema.Schema<CreateLoaDocumentResponse>;

export const createLoaDocument = API.make(() => ({
  input: CreateLoaDocumentRequest,
  output: CreateLoaDocumentResponse,
  errors: [],
}));

// =============================================================================
// Prefix
// =============================================================================

export interface GetPrefixRequest {
  prefixId: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const GetPrefixRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/addressing/prefixes/{prefixId}" }),
) as unknown as Schema.Schema<GetPrefixRequest>;

export interface GetPrefixResponse {
  /** Identifier of an IP Prefix. */
  id?: string;
  /** Identifier of a Cloudflare account. */
  accountId?: string;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  advertised?: boolean | null;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  advertisedModifiedAt?: string | null;
  /** Approval state of the prefix (P = pending, V = active). */
  approved?: string;
  /** Autonomous System Number (ASN) the prefix will be advertised under. */
  asn?: number | null;
  /** IP Prefix in Classless Inter-Domain Routing format. */
  cidr?: string;
  createdAt?: string;
  /** Description of the prefix. */
  description?: string;
  /** Identifier for the uploaded LOA document. */
  loaDocumentId?: string | null;
  modifiedAt?: string;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  onDemandEnabled?: boolean;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  onDemandLocked?: boolean;
}

export const GetPrefixResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
  advertised: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  advertisedModifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("advertised_modified_at"),
  ),
  approved: Schema.optional(Schema.String),
  asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  cidr: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  description: Schema.optional(Schema.String),
  loaDocumentId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("loa_document_id"),
  ),
  modifiedAt: Schema.optional(Schema.String).pipe(T.JsonName("modified_at")),
  onDemandEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_enabled")),
  onDemandLocked: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_locked")),
}) as unknown as Schema.Schema<GetPrefixResponse>;

export const getPrefix = API.make(() => ({
  input: GetPrefixRequest,
  output: GetPrefixResponse,
  errors: [],
}));

export interface CreatePrefixRequest {
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: Autonomous System Number (ASN) the prefix will be advertised under. */
  asn: number | null;
  /** Body param: IP Prefix in Classless Inter-Domain Routing format. */
  cidr: string;
  /** Body param: Identifier for the uploaded LOA document. */
  loaDocumentId: string | null;
}

export const CreatePrefixRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  asn: Schema.Union(Schema.Number, Schema.Null),
  cidr: Schema.String,
  loaDocumentId: Schema.Union(Schema.String, Schema.Null).pipe(T.JsonName("loa_document_id")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/addressing/prefixes" }),
) as unknown as Schema.Schema<CreatePrefixRequest>;

export interface CreatePrefixResponse {
  /** Identifier of an IP Prefix. */
  id?: string;
  /** Identifier of a Cloudflare account. */
  accountId?: string;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  advertised?: boolean | null;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  advertisedModifiedAt?: string | null;
  /** Approval state of the prefix (P = pending, V = active). */
  approved?: string;
  /** Autonomous System Number (ASN) the prefix will be advertised under. */
  asn?: number | null;
  /** IP Prefix in Classless Inter-Domain Routing format. */
  cidr?: string;
  createdAt?: string;
  /** Description of the prefix. */
  description?: string;
  /** Identifier for the uploaded LOA document. */
  loaDocumentId?: string | null;
  modifiedAt?: string;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  onDemandEnabled?: boolean;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  onDemandLocked?: boolean;
}

export const CreatePrefixResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
  advertised: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  advertisedModifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("advertised_modified_at"),
  ),
  approved: Schema.optional(Schema.String),
  asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  cidr: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  description: Schema.optional(Schema.String),
  loaDocumentId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("loa_document_id"),
  ),
  modifiedAt: Schema.optional(Schema.String).pipe(T.JsonName("modified_at")),
  onDemandEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_enabled")),
  onDemandLocked: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_locked")),
}) as unknown as Schema.Schema<CreatePrefixResponse>;

export const createPrefix = API.make(() => ({
  input: CreatePrefixRequest,
  output: CreatePrefixResponse,
  errors: [],
}));

export interface PatchPrefixRequest {
  prefixId: string;
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: Description of the prefix. */
  description: string;
}

export const PatchPrefixRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  description: Schema.String,
}).pipe(
  T.Http({ method: "PATCH", path: "/accounts/{account_id}/addressing/prefixes/{prefixId}" }),
) as unknown as Schema.Schema<PatchPrefixRequest>;

export interface PatchPrefixResponse {
  /** Identifier of an IP Prefix. */
  id?: string;
  /** Identifier of a Cloudflare account. */
  accountId?: string;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  advertised?: boolean | null;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  advertisedModifiedAt?: string | null;
  /** Approval state of the prefix (P = pending, V = active). */
  approved?: string;
  /** Autonomous System Number (ASN) the prefix will be advertised under. */
  asn?: number | null;
  /** IP Prefix in Classless Inter-Domain Routing format. */
  cidr?: string;
  createdAt?: string;
  /** Description of the prefix. */
  description?: string;
  /** Identifier for the uploaded LOA document. */
  loaDocumentId?: string | null;
  modifiedAt?: string;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  onDemandEnabled?: boolean;
  /** @deprecated Prefer the [BGP Prefixes API](https://developers.cloudflare.com/api/resources/addressing/subresources/prefixes/subresources/bgp_prefixes/) instead, which allows for advertising multiple BG */
  onDemandLocked?: boolean;
}

export const PatchPrefixResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
  advertised: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
  advertisedModifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("advertised_modified_at"),
  ),
  approved: Schema.optional(Schema.String),
  asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  cidr: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  description: Schema.optional(Schema.String),
  loaDocumentId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("loa_document_id"),
  ),
  modifiedAt: Schema.optional(Schema.String).pipe(T.JsonName("modified_at")),
  onDemandEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_enabled")),
  onDemandLocked: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_locked")),
}) as unknown as Schema.Schema<PatchPrefixResponse>;

export const patchPrefix = API.make(() => ({
  input: PatchPrefixRequest,
  output: PatchPrefixResponse,
  errors: [],
}));

export interface DeletePrefixRequest {
  prefixId: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const DeletePrefixRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/addressing/prefixes/{prefixId}" }),
) as unknown as Schema.Schema<DeletePrefixRequest>;

export interface DeletePrefixResponse {
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
  resultInfo?: { count?: number; page?: number; perPage?: number; totalCount?: number };
}

export const DeletePrefixResponse = Schema.Struct({
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
  resultInfo: Schema.optional(
    Schema.Struct({
      count: Schema.optional(Schema.Number),
      page: Schema.optional(Schema.Number),
      perPage: Schema.optional(Schema.Number).pipe(T.JsonName("per_page")),
      totalCount: Schema.optional(Schema.Number).pipe(T.JsonName("total_count")),
    }),
  ).pipe(T.JsonName("result_info")),
}) as unknown as Schema.Schema<DeletePrefixResponse>;

export const deletePrefix = API.make(() => ({
  input: DeletePrefixRequest,
  output: DeletePrefixResponse,
  errors: [],
}));

// =============================================================================
// PrefixAdvertisementStatus
// =============================================================================

export interface GetPrefixAdvertisementStatusRequest {
  prefixId: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const GetPrefixAdvertisementStatusRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/addressing/prefixes/{prefixId}/bgp/status",
  }),
) as unknown as Schema.Schema<GetPrefixAdvertisementStatusRequest>;

export interface GetPrefixAdvertisementStatusResponse {
  /** Advertisement status of the prefix. If `true`, the BGP route for the prefix is advertised to the Internet. If `false`, the BGP route is withdrawn. */
  advertised?: boolean;
  /** Last time the advertisement status was changed. This field is only not 'null' if on demand is enabled. */
  advertisedModifiedAt?: string | null;
}

export const GetPrefixAdvertisementStatusResponse = Schema.Struct({
  advertised: Schema.optional(Schema.Boolean),
  advertisedModifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("advertised_modified_at"),
  ),
}) as unknown as Schema.Schema<GetPrefixAdvertisementStatusResponse>;

export const getPrefixAdvertisementStatus = API.make(() => ({
  input: GetPrefixAdvertisementStatusRequest,
  output: GetPrefixAdvertisementStatusResponse,
  errors: [],
}));

export interface PatchPrefixAdvertisementStatusRequest {
  prefixId: string;
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: Advertisement status of the prefix. If `true`, the BGP route for the prefix is advertised to the Internet. If `false`, the BGP route is withdrawn. */
  advertised: boolean;
}

export const PatchPrefixAdvertisementStatusRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  advertised: Schema.Boolean,
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/addressing/prefixes/{prefixId}/bgp/status",
  }),
) as unknown as Schema.Schema<PatchPrefixAdvertisementStatusRequest>;

export interface PatchPrefixAdvertisementStatusResponse {
  /** Advertisement status of the prefix. If `true`, the BGP route for the prefix is advertised to the Internet. If `false`, the BGP route is withdrawn. */
  advertised?: boolean;
  /** Last time the advertisement status was changed. This field is only not 'null' if on demand is enabled. */
  advertisedModifiedAt?: string | null;
}

export const PatchPrefixAdvertisementStatusResponse = Schema.Struct({
  advertised: Schema.optional(Schema.Boolean),
  advertisedModifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("advertised_modified_at"),
  ),
}) as unknown as Schema.Schema<PatchPrefixAdvertisementStatusResponse>;

export const patchPrefixAdvertisementStatus = API.make(() => ({
  input: PatchPrefixAdvertisementStatusRequest,
  output: PatchPrefixAdvertisementStatusResponse,
  errors: [],
}));

// =============================================================================
// PrefixBgpPrefix
// =============================================================================

export interface GetPrefixBgpPrefixRequest {
  prefixId: string;
  bgpPrefixId: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const GetPrefixBgpPrefixRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  bgpPrefixId: Schema.String.pipe(T.HttpPath("bgpPrefixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/addressing/prefixes/{prefixId}/bgp/prefixes/{bgpPrefixId}",
  }),
) as unknown as Schema.Schema<GetPrefixBgpPrefixRequest>;

export interface GetPrefixBgpPrefixResponse {
  /** Identifier of BGP Prefix. */
  id?: string;
  /** Autonomous System Number (ASN) the prefix will be advertised under. */
  asn?: number | null;
  /** Number of times to prepend the Cloudflare ASN to the BGP AS-Path attribute */
  asnPrependCount?: number;
  /** Determines if Cloudflare advertises a BYOIP BGP prefix even when there is no matching BGP prefix in the Magic routing table. When true, Cloudflare will automatically withdraw the BGP prefix when there */
  autoAdvertiseWithdraw?: boolean;
  bgpSignalOpts?: { enabled?: boolean; modifiedAt?: string | null };
  /** IP Prefix in Classless Inter-Domain Routing format. */
  cidr?: string;
  createdAt?: string;
  modifiedAt?: string;
  onDemand?: {
    advertised?: boolean | null;
    advertisedModifiedAt?: string | null;
    onDemandEnabled?: boolean;
    onDemandLocked?: boolean;
  };
}

export const GetPrefixBgpPrefixResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  asnPrependCount: Schema.optional(Schema.Number).pipe(T.JsonName("asn_prepend_count")),
  autoAdvertiseWithdraw: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("auto_advertise_withdraw"),
  ),
  bgpSignalOpts: Schema.optional(
    Schema.Struct({
      enabled: Schema.optional(Schema.Boolean),
      modifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("modified_at"),
      ),
    }),
  ).pipe(T.JsonName("bgp_signal_opts")),
  cidr: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  modifiedAt: Schema.optional(Schema.String).pipe(T.JsonName("modified_at")),
  onDemand: Schema.optional(
    Schema.Struct({
      advertised: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
      advertisedModifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("advertised_modified_at"),
      ),
      onDemandEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_enabled")),
      onDemandLocked: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_locked")),
    }),
  ).pipe(T.JsonName("on_demand")),
}) as unknown as Schema.Schema<GetPrefixBgpPrefixResponse>;

export const getPrefixBgpPrefix = API.make(() => ({
  input: GetPrefixBgpPrefixRequest,
  output: GetPrefixBgpPrefixResponse,
  errors: [],
}));

export interface CreatePrefixBgpPrefixRequest {
  prefixId: string;
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: IP Prefix in Classless Inter-Domain Routing format. */
  cidr?: string;
}

export const CreatePrefixBgpPrefixRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cidr: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/addressing/prefixes/{prefixId}/bgp/prefixes",
  }),
) as unknown as Schema.Schema<CreatePrefixBgpPrefixRequest>;

export interface CreatePrefixBgpPrefixResponse {
  /** Identifier of BGP Prefix. */
  id?: string;
  /** Autonomous System Number (ASN) the prefix will be advertised under. */
  asn?: number | null;
  /** Number of times to prepend the Cloudflare ASN to the BGP AS-Path attribute */
  asnPrependCount?: number;
  /** Determines if Cloudflare advertises a BYOIP BGP prefix even when there is no matching BGP prefix in the Magic routing table. When true, Cloudflare will automatically withdraw the BGP prefix when there */
  autoAdvertiseWithdraw?: boolean;
  bgpSignalOpts?: { enabled?: boolean; modifiedAt?: string | null };
  /** IP Prefix in Classless Inter-Domain Routing format. */
  cidr?: string;
  createdAt?: string;
  modifiedAt?: string;
  onDemand?: {
    advertised?: boolean | null;
    advertisedModifiedAt?: string | null;
    onDemandEnabled?: boolean;
    onDemandLocked?: boolean;
  };
}

export const CreatePrefixBgpPrefixResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  asnPrependCount: Schema.optional(Schema.Number).pipe(T.JsonName("asn_prepend_count")),
  autoAdvertiseWithdraw: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("auto_advertise_withdraw"),
  ),
  bgpSignalOpts: Schema.optional(
    Schema.Struct({
      enabled: Schema.optional(Schema.Boolean),
      modifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("modified_at"),
      ),
    }),
  ).pipe(T.JsonName("bgp_signal_opts")),
  cidr: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  modifiedAt: Schema.optional(Schema.String).pipe(T.JsonName("modified_at")),
  onDemand: Schema.optional(
    Schema.Struct({
      advertised: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
      advertisedModifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("advertised_modified_at"),
      ),
      onDemandEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_enabled")),
      onDemandLocked: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_locked")),
    }),
  ).pipe(T.JsonName("on_demand")),
}) as unknown as Schema.Schema<CreatePrefixBgpPrefixResponse>;

export const createPrefixBgpPrefix = API.make(() => ({
  input: CreatePrefixBgpPrefixRequest,
  output: CreatePrefixBgpPrefixResponse,
  errors: [],
}));

export interface PatchPrefixBgpPrefixRequest {
  prefixId: string;
  bgpPrefixId: string;
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: Number of times to prepend the Cloudflare ASN to the BGP AS-Path attribute */
  asnPrependCount?: number;
  /** Body param: Determines if Cloudflare advertises a BYOIP BGP prefix even when there is no matching BGP prefix in the Magic routing table. When true, Cloudflare will automatically withdraw the BGP prefi */
  autoAdvertiseWithdraw?: boolean;
  /** Body param: */
  onDemand?: { advertised?: boolean };
}

export const PatchPrefixBgpPrefixRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  bgpPrefixId: Schema.String.pipe(T.HttpPath("bgpPrefixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  asnPrependCount: Schema.optional(Schema.Number).pipe(T.JsonName("asn_prepend_count")),
  autoAdvertiseWithdraw: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("auto_advertise_withdraw"),
  ),
  onDemand: Schema.optional(
    Schema.Struct({
      advertised: Schema.optional(Schema.Boolean),
    }),
  ).pipe(T.JsonName("on_demand")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/addressing/prefixes/{prefixId}/bgp/prefixes/{bgpPrefixId}",
  }),
) as unknown as Schema.Schema<PatchPrefixBgpPrefixRequest>;

export interface PatchPrefixBgpPrefixResponse {
  /** Identifier of BGP Prefix. */
  id?: string;
  /** Autonomous System Number (ASN) the prefix will be advertised under. */
  asn?: number | null;
  /** Number of times to prepend the Cloudflare ASN to the BGP AS-Path attribute */
  asnPrependCount?: number;
  /** Determines if Cloudflare advertises a BYOIP BGP prefix even when there is no matching BGP prefix in the Magic routing table. When true, Cloudflare will automatically withdraw the BGP prefix when there */
  autoAdvertiseWithdraw?: boolean;
  bgpSignalOpts?: { enabled?: boolean; modifiedAt?: string | null };
  /** IP Prefix in Classless Inter-Domain Routing format. */
  cidr?: string;
  createdAt?: string;
  modifiedAt?: string;
  onDemand?: {
    advertised?: boolean | null;
    advertisedModifiedAt?: string | null;
    onDemandEnabled?: boolean;
    onDemandLocked?: boolean;
  };
}

export const PatchPrefixBgpPrefixResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  asn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
  asnPrependCount: Schema.optional(Schema.Number).pipe(T.JsonName("asn_prepend_count")),
  autoAdvertiseWithdraw: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("auto_advertise_withdraw"),
  ),
  bgpSignalOpts: Schema.optional(
    Schema.Struct({
      enabled: Schema.optional(Schema.Boolean),
      modifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("modified_at"),
      ),
    }),
  ).pipe(T.JsonName("bgp_signal_opts")),
  cidr: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  modifiedAt: Schema.optional(Schema.String).pipe(T.JsonName("modified_at")),
  onDemand: Schema.optional(
    Schema.Struct({
      advertised: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)),
      advertisedModifiedAt: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("advertised_modified_at"),
      ),
      onDemandEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_enabled")),
      onDemandLocked: Schema.optional(Schema.Boolean).pipe(T.JsonName("on_demand_locked")),
    }),
  ).pipe(T.JsonName("on_demand")),
}) as unknown as Schema.Schema<PatchPrefixBgpPrefixResponse>;

export const patchPrefixBgpPrefix = API.make(() => ({
  input: PatchPrefixBgpPrefixRequest,
  output: PatchPrefixBgpPrefixResponse,
  errors: [],
}));

// =============================================================================
// PrefixDelegation
// =============================================================================

export interface CreatePrefixDelegationRequest {
  prefixId: string;
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: IP Prefix in Classless Inter-Domain Routing format. */
  cidr: string;
  /** Body param: Account identifier for the account to which prefix is being delegated. */
  delegatedAccountId: string;
}

export const CreatePrefixDelegationRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cidr: Schema.String,
  delegatedAccountId: Schema.String.pipe(T.JsonName("delegated_account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/addressing/prefixes/{prefixId}/delegations",
  }),
) as unknown as Schema.Schema<CreatePrefixDelegationRequest>;

export interface CreatePrefixDelegationResponse {
  /** Identifier of a Delegation. */
  id?: string;
  /** IP Prefix in Classless Inter-Domain Routing format. */
  cidr?: string;
  createdAt?: string;
  /** Account identifier for the account to which prefix is being delegated. */
  delegatedAccountId?: string;
  modifiedAt?: string;
  /** Identifier of an IP Prefix. */
  parentPrefixId?: string;
}

export const CreatePrefixDelegationResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  cidr: Schema.optional(Schema.String),
  createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
  delegatedAccountId: Schema.optional(Schema.String).pipe(T.JsonName("delegated_account_id")),
  modifiedAt: Schema.optional(Schema.String).pipe(T.JsonName("modified_at")),
  parentPrefixId: Schema.optional(Schema.String).pipe(T.JsonName("parent_prefix_id")),
}) as unknown as Schema.Schema<CreatePrefixDelegationResponse>;

export const createPrefixDelegation = API.make(() => ({
  input: CreatePrefixDelegationRequest,
  output: CreatePrefixDelegationResponse,
  errors: [],
}));

export interface DeletePrefixDelegationRequest {
  prefixId: string;
  delegationId: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const DeletePrefixDelegationRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  delegationId: Schema.String.pipe(T.HttpPath("delegationId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/addressing/prefixes/{prefixId}/delegations/{delegationId}",
  }),
) as unknown as Schema.Schema<DeletePrefixDelegationRequest>;

export interface DeletePrefixDelegationResponse {
  /** Identifier of a Delegation. */
  id?: string;
}

export const DeletePrefixDelegationResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeletePrefixDelegationResponse>;

export const deletePrefixDelegation = API.make(() => ({
  input: DeletePrefixDelegationRequest,
  output: DeletePrefixDelegationResponse,
  errors: [],
}));

// =============================================================================
// PrefixServiceBinding
// =============================================================================

export interface GetPrefixServiceBindingRequest {
  prefixId: string;
  bindingId: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const GetPrefixServiceBindingRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  bindingId: Schema.String.pipe(T.HttpPath("bindingId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/addressing/prefixes/{prefixId}/bindings/{bindingId}",
  }),
) as unknown as Schema.Schema<GetPrefixServiceBindingRequest>;

export interface GetPrefixServiceBindingResponse {
  /** Identifier of a Service Binding. */
  id?: string;
  /** IP Prefix in Classless Inter-Domain Routing format. */
  cidr?: string;
  /** Status of a Service Binding's deployment to the Cloudflare network */
  provisioning?: { state?: "provisioning" | "active" };
  /** Identifier of a Service on the Cloudflare network. Available services and their IDs may be found in the  List Services  endpoint. */
  serviceId?: string;
  /** Name of a service running on the Cloudflare network */
  serviceName?: string;
}

export const GetPrefixServiceBindingResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  cidr: Schema.optional(Schema.String),
  provisioning: Schema.optional(
    Schema.Struct({
      state: Schema.optional(Schema.Literal("provisioning", "active")),
    }),
  ),
  serviceId: Schema.optional(Schema.String).pipe(T.JsonName("service_id")),
  serviceName: Schema.optional(Schema.String).pipe(T.JsonName("service_name")),
}) as unknown as Schema.Schema<GetPrefixServiceBindingResponse>;

export const getPrefixServiceBinding = API.make(() => ({
  input: GetPrefixServiceBindingRequest,
  output: GetPrefixServiceBindingResponse,
  errors: [],
}));

export interface CreatePrefixServiceBindingRequest {
  prefixId: string;
  /** Path param: Identifier of a Cloudflare account. */
  accountId: string;
  /** Body param: IP Prefix in Classless Inter-Domain Routing format. */
  cidr?: string;
  /** Body param: Identifier of a Service on the Cloudflare network. Available services and their IDs may be found in the  List Services  endpoint. */
  serviceId?: string;
}

export const CreatePrefixServiceBindingRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cidr: Schema.optional(Schema.String),
  serviceId: Schema.optional(Schema.String).pipe(T.JsonName("service_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/addressing/prefixes/{prefixId}/bindings",
  }),
) as unknown as Schema.Schema<CreatePrefixServiceBindingRequest>;

export interface CreatePrefixServiceBindingResponse {
  /** Identifier of a Service Binding. */
  id?: string;
  /** IP Prefix in Classless Inter-Domain Routing format. */
  cidr?: string;
  /** Status of a Service Binding's deployment to the Cloudflare network */
  provisioning?: { state?: "provisioning" | "active" };
  /** Identifier of a Service on the Cloudflare network. Available services and their IDs may be found in the  List Services  endpoint. */
  serviceId?: string;
  /** Name of a service running on the Cloudflare network */
  serviceName?: string;
}

export const CreatePrefixServiceBindingResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  cidr: Schema.optional(Schema.String),
  provisioning: Schema.optional(
    Schema.Struct({
      state: Schema.optional(Schema.Literal("provisioning", "active")),
    }),
  ),
  serviceId: Schema.optional(Schema.String).pipe(T.JsonName("service_id")),
  serviceName: Schema.optional(Schema.String).pipe(T.JsonName("service_name")),
}) as unknown as Schema.Schema<CreatePrefixServiceBindingResponse>;

export const createPrefixServiceBinding = API.make(() => ({
  input: CreatePrefixServiceBindingRequest,
  output: CreatePrefixServiceBindingResponse,
  errors: [],
}));

export interface DeletePrefixServiceBindingRequest {
  prefixId: string;
  bindingId: string;
  /** Identifier of a Cloudflare account. */
  accountId: string;
}

export const DeletePrefixServiceBindingRequest = Schema.Struct({
  prefixId: Schema.String.pipe(T.HttpPath("prefixId")),
  bindingId: Schema.String.pipe(T.HttpPath("bindingId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/addressing/prefixes/{prefixId}/bindings/{bindingId}",
  }),
) as unknown as Schema.Schema<DeletePrefixServiceBindingRequest>;

export interface DeletePrefixServiceBindingResponse {
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

export const DeletePrefixServiceBindingResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<DeletePrefixServiceBindingResponse>;

export const deletePrefixServiceBinding = API.make(() => ({
  input: DeletePrefixServiceBindingRequest,
  output: DeletePrefixServiceBindingResponse,
  errors: [],
}));

// =============================================================================
// RegionalHostname
// =============================================================================

export interface GetRegionalHostnameRequest {
  hostname: string;
  /** Identifier. */
  zoneId: string;
}

export const GetRegionalHostnameRequest = Schema.Struct({
  hostname: Schema.String.pipe(T.HttpPath("hostname")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/addressing/regional_hostnames/{hostname}" }),
) as unknown as Schema.Schema<GetRegionalHostnameRequest>;

export interface GetRegionalHostnameResponse {
  /** When the regional hostname was created */
  createdOn: string;
  /** DNS hostname to be regionalized, must be a subdomain of the zone. Wildcards are supported for one level, e.g ` .example.com` */
  hostname: string;
  /** Identifying key for the region */
  regionKey: string;
  /** Configure which routing method to use for the regional hostname */
  routing?: string;
}

export const GetRegionalHostnameResponse = Schema.Struct({
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  hostname: Schema.String,
  regionKey: Schema.String.pipe(T.JsonName("region_key")),
  routing: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetRegionalHostnameResponse>;

export const getRegionalHostname = API.make(() => ({
  input: GetRegionalHostnameRequest,
  output: GetRegionalHostnameResponse,
  errors: [],
}));

export interface CreateRegionalHostnameRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: DNS hostname to be regionalized, must be a subdomain of the zone. Wildcards are supported for one level, e.g ` .example.com` */
  hostname: string;
  /** Body param: Identifying key for the region */
  regionKey: string;
  /** Body param: Configure which routing method to use for the regional hostname */
  routing?: string;
}

export const CreateRegionalHostnameRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  hostname: Schema.String,
  regionKey: Schema.String.pipe(T.JsonName("region_key")),
  routing: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/addressing/regional_hostnames" }),
) as unknown as Schema.Schema<CreateRegionalHostnameRequest>;

export interface CreateRegionalHostnameResponse {
  /** When the regional hostname was created */
  createdOn: string;
  /** DNS hostname to be regionalized, must be a subdomain of the zone. Wildcards are supported for one level, e.g ` .example.com` */
  hostname: string;
  /** Identifying key for the region */
  regionKey: string;
  /** Configure which routing method to use for the regional hostname */
  routing?: string;
}

export const CreateRegionalHostnameResponse = Schema.Struct({
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  hostname: Schema.String,
  regionKey: Schema.String.pipe(T.JsonName("region_key")),
  routing: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateRegionalHostnameResponse>;

export const createRegionalHostname = API.make(() => ({
  input: CreateRegionalHostnameRequest,
  output: CreateRegionalHostnameResponse,
  errors: [],
}));

export interface PatchRegionalHostnameRequest {
  hostname: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Identifying key for the region */
  regionKey: string;
}

export const PatchRegionalHostnameRequest = Schema.Struct({
  hostname: Schema.String.pipe(T.HttpPath("hostname")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  regionKey: Schema.String.pipe(T.JsonName("region_key")),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/addressing/regional_hostnames/{hostname}" }),
) as unknown as Schema.Schema<PatchRegionalHostnameRequest>;

export interface PatchRegionalHostnameResponse {
  /** When the regional hostname was created */
  createdOn: string;
  /** DNS hostname to be regionalized, must be a subdomain of the zone. Wildcards are supported for one level, e.g ` .example.com` */
  hostname: string;
  /** Identifying key for the region */
  regionKey: string;
  /** Configure which routing method to use for the regional hostname */
  routing?: string;
}

export const PatchRegionalHostnameResponse = Schema.Struct({
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  hostname: Schema.String,
  regionKey: Schema.String.pipe(T.JsonName("region_key")),
  routing: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PatchRegionalHostnameResponse>;

export const patchRegionalHostname = API.make(() => ({
  input: PatchRegionalHostnameRequest,
  output: PatchRegionalHostnameResponse,
  errors: [],
}));

export interface DeleteRegionalHostnameRequest {
  hostname: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteRegionalHostnameRequest = Schema.Struct({
  hostname: Schema.String.pipe(T.HttpPath("hostname")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/addressing/regional_hostnames/{hostname}" }),
) as unknown as Schema.Schema<DeleteRegionalHostnameRequest>;

export interface DeleteRegionalHostnameResponse {
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

export const DeleteRegionalHostnameResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<DeleteRegionalHostnameResponse>;

export const deleteRegionalHostname = API.make(() => ({
  input: DeleteRegionalHostnameRequest,
  output: DeleteRegionalHostnameResponse,
  errors: [],
}));
