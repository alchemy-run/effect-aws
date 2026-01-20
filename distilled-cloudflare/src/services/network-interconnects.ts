/**
 * Cloudflare NETWORK-INTERCONNECTS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service network-interconnects
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
// Cni
// =============================================================================

export interface GetCniRequest {
  cni: string;
  /** Customer account tag */
  accountId: string;
}

export const GetCniRequest = Schema.Struct({
  cni: Schema.String.pipe(T.HttpPath("cni")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/cni/cnis/{cni}" }),
) as unknown as Schema.Schema<GetCniRequest>;

export interface GetCniResponse {
  id: string;
  /** Customer account tag */
  account: string;
  /** Customer end of the point-to-point link  This should always be inside the same prefix as `p2p_ip`. */
  custIp: string;
  /** Interconnect identifier hosting this CNI */
  interconnect: string;
  magic: { conduitName: string; description: string; mtu: number };
  /** Cloudflare end of the point-to-point link */
  p2pIp: string;
  bgp?: {
    customerAsn: number;
    extraPrefixes: string[];
    md5Key?: string | null;
  };
}

export const GetCniResponse = Schema.Struct({
  id: Schema.String,
  account: Schema.String,
  custIp: Schema.String.pipe(T.JsonName("cust_ip")),
  interconnect: Schema.String,
  magic: Schema.Struct({
    conduitName: Schema.String.pipe(T.JsonName("conduit_name")),
    description: Schema.String,
    mtu: Schema.Number,
  }),
  p2pIp: Schema.String.pipe(T.JsonName("p2p_ip")),
  bgp: Schema.optional(
    Schema.Struct({
      customerAsn: Schema.Number.pipe(T.JsonName("customer_asn")),
      extraPrefixes: Schema.Array(Schema.String).pipe(
        T.JsonName("extra_prefixes"),
      ),
      md5Key: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("md5_key"),
      ),
    }),
  ),
}) as unknown as Schema.Schema<GetCniResponse>;

export const getCni: (
  input: GetCniRequest,
) => Effect.Effect<
  GetCniResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetCniRequest,
  output: GetCniResponse,
  errors: [],
}));

export interface ListCnisRequest {
  /** Path param: Customer account tag */
  accountId: string;
  /** Query param: */
  cursor?: number | null;
  /** Query param: */
  limit?: number | null;
  /** Query param: If specified, only show CNIs associated with the specified slot */
  slot?: string | null;
  /** Query param: If specified, only show cnis associated with the specified tunnel id */
  tunnelId?: string | null;
}

export const ListCnisRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cursor: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.HttpQuery("cursor"),
  ),
  limit: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.HttpQuery("limit"),
  ),
  slot: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.HttpQuery("slot"),
  ),
  tunnelId: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.HttpQuery("tunnel_id"),
  ),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/cni/cnis" }),
) as unknown as Schema.Schema<ListCnisRequest>;

export interface ListCnisResponse {
  items: {
    id: string;
    account: string;
    custIp: string;
    interconnect: string;
    magic: { conduitName: string; description: string; mtu: number };
    p2pIp: string;
    bgp?: {
      customerAsn: number;
      extraPrefixes: string[];
      md5Key?: string | null;
    };
  }[];
  next?: number | null;
}

export const ListCnisResponse = Schema.Struct({
  items: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      account: Schema.String,
      custIp: Schema.String.pipe(T.JsonName("cust_ip")),
      interconnect: Schema.String,
      magic: Schema.Struct({
        conduitName: Schema.String.pipe(T.JsonName("conduit_name")),
        description: Schema.String,
        mtu: Schema.Number,
      }),
      p2pIp: Schema.String.pipe(T.JsonName("p2p_ip")),
      bgp: Schema.optional(
        Schema.Struct({
          customerAsn: Schema.Number.pipe(T.JsonName("customer_asn")),
          extraPrefixes: Schema.Array(Schema.String).pipe(
            T.JsonName("extra_prefixes"),
          ),
          md5Key: Schema.optional(
            Schema.Union(Schema.String, Schema.Null),
          ).pipe(T.JsonName("md5_key")),
        }),
      ),
    }),
  ),
  next: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
}) as unknown as Schema.Schema<ListCnisResponse>;

export const listCnis: (
  input: ListCnisRequest,
) => Effect.Effect<
  ListCnisResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListCnisRequest,
  output: ListCnisResponse,
  errors: [],
}));

export interface CreateCniRequest {
  /** Path param: Customer account tag */
  accountId: string;
  /** Body param: Customer account tag */
  account: string;
  /** Body param: */
  interconnect: string;
  /** Body param: */
  magic: { conduitName: string; description: string; mtu: number };
  /** Body param: */
  bgp?: {
    customerAsn: number;
    extraPrefixes: string[];
    md5Key?: string | null;
  };
}

export const CreateCniRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  account: Schema.String,
  interconnect: Schema.String,
  magic: Schema.Struct({
    conduitName: Schema.String.pipe(T.JsonName("conduit_name")),
    description: Schema.String,
    mtu: Schema.Number,
  }),
  bgp: Schema.optional(
    Schema.Struct({
      customerAsn: Schema.Number.pipe(T.JsonName("customer_asn")),
      extraPrefixes: Schema.Array(Schema.String).pipe(
        T.JsonName("extra_prefixes"),
      ),
      md5Key: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("md5_key"),
      ),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/cni/cnis" }),
) as unknown as Schema.Schema<CreateCniRequest>;

export interface CreateCniResponse {
  id: string;
  /** Customer account tag */
  account: string;
  /** Customer end of the point-to-point link  This should always be inside the same prefix as `p2p_ip`. */
  custIp: string;
  /** Interconnect identifier hosting this CNI */
  interconnect: string;
  magic: { conduitName: string; description: string; mtu: number };
  /** Cloudflare end of the point-to-point link */
  p2pIp: string;
  bgp?: {
    customerAsn: number;
    extraPrefixes: string[];
    md5Key?: string | null;
  };
}

export const CreateCniResponse = Schema.Struct({
  id: Schema.String,
  account: Schema.String,
  custIp: Schema.String.pipe(T.JsonName("cust_ip")),
  interconnect: Schema.String,
  magic: Schema.Struct({
    conduitName: Schema.String.pipe(T.JsonName("conduit_name")),
    description: Schema.String,
    mtu: Schema.Number,
  }),
  p2pIp: Schema.String.pipe(T.JsonName("p2p_ip")),
  bgp: Schema.optional(
    Schema.Struct({
      customerAsn: Schema.Number.pipe(T.JsonName("customer_asn")),
      extraPrefixes: Schema.Array(Schema.String).pipe(
        T.JsonName("extra_prefixes"),
      ),
      md5Key: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("md5_key"),
      ),
    }),
  ),
}) as unknown as Schema.Schema<CreateCniResponse>;

export const createCni: (
  input: CreateCniRequest,
) => Effect.Effect<
  CreateCniResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateCniRequest,
  output: CreateCniResponse,
  errors: [],
}));

export interface UpdateCniRequest {
  cni: string;
  /** Path param: Customer account tag */
  accountId: string;
  /** Body param: */
  id: string;
  /** Body param: Customer account tag */
  account: string;
  /** Body param: Customer end of the point-to-point link  This should always be inside the same prefix as `p2p_ip`. */
  custIp: string;
  /** Body param: Interconnect identifier hosting this CNI */
  interconnect: string;
  /** Body param: */
  magic: { conduitName: string; description: string; mtu: number };
  /** Body param: Cloudflare end of the point-to-point link */
  p2pIp: string;
  /** Body param: */
  bgp?: {
    customerAsn: number;
    extraPrefixes: string[];
    md5Key?: string | null;
  };
}

export const UpdateCniRequest = Schema.Struct({
  cni: Schema.String.pipe(T.HttpPath("cni")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.String,
  account: Schema.String,
  custIp: Schema.String.pipe(T.JsonName("cust_ip")),
  interconnect: Schema.String,
  magic: Schema.Struct({
    conduitName: Schema.String.pipe(T.JsonName("conduit_name")),
    description: Schema.String,
    mtu: Schema.Number,
  }),
  p2pIp: Schema.String.pipe(T.JsonName("p2p_ip")),
  bgp: Schema.optional(
    Schema.Struct({
      customerAsn: Schema.Number.pipe(T.JsonName("customer_asn")),
      extraPrefixes: Schema.Array(Schema.String).pipe(
        T.JsonName("extra_prefixes"),
      ),
      md5Key: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("md5_key"),
      ),
    }),
  ),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/cni/cnis/{cni}" }),
) as unknown as Schema.Schema<UpdateCniRequest>;

export interface UpdateCniResponse {
  id: string;
  /** Customer account tag */
  account: string;
  /** Customer end of the point-to-point link  This should always be inside the same prefix as `p2p_ip`. */
  custIp: string;
  /** Interconnect identifier hosting this CNI */
  interconnect: string;
  magic: { conduitName: string; description: string; mtu: number };
  /** Cloudflare end of the point-to-point link */
  p2pIp: string;
  bgp?: {
    customerAsn: number;
    extraPrefixes: string[];
    md5Key?: string | null;
  };
}

export const UpdateCniResponse = Schema.Struct({
  id: Schema.String,
  account: Schema.String,
  custIp: Schema.String.pipe(T.JsonName("cust_ip")),
  interconnect: Schema.String,
  magic: Schema.Struct({
    conduitName: Schema.String.pipe(T.JsonName("conduit_name")),
    description: Schema.String,
    mtu: Schema.Number,
  }),
  p2pIp: Schema.String.pipe(T.JsonName("p2p_ip")),
  bgp: Schema.optional(
    Schema.Struct({
      customerAsn: Schema.Number.pipe(T.JsonName("customer_asn")),
      extraPrefixes: Schema.Array(Schema.String).pipe(
        T.JsonName("extra_prefixes"),
      ),
      md5Key: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
        T.JsonName("md5_key"),
      ),
    }),
  ),
}) as unknown as Schema.Schema<UpdateCniResponse>;

export const updateCni: (
  input: UpdateCniRequest,
) => Effect.Effect<
  UpdateCniResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateCniRequest,
  output: UpdateCniResponse,
  errors: [],
}));

export interface DeleteCniRequest {
  cni: string;
  /** Customer account tag */
  accountId: string;
}

export const DeleteCniRequest = Schema.Struct({
  cni: Schema.String.pipe(T.HttpPath("cni")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/cni/cnis/{cni}" }),
) as unknown as Schema.Schema<DeleteCniRequest>;

export type DeleteCniResponse = unknown;

export const DeleteCniResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteCniResponse>;

export const deleteCni: (
  input: DeleteCniRequest,
) => Effect.Effect<
  DeleteCniResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteCniRequest,
  output: DeleteCniResponse,
  errors: [],
}));

// =============================================================================
// Interconnect
// =============================================================================

export interface GetInterconnectRequest {
  icon: string;
  /** Customer account tag */
  accountId: string;
}

export const GetInterconnectRequest = Schema.Struct({
  icon: Schema.String.pipe(T.HttpPath("icon")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cni/interconnects/{icon}",
  }),
) as unknown as Schema.Schema<GetInterconnectRequest>;

export type GetInterconnectResponse =
  | {
      account: string;
      facility: { address: string[]; name: string };
      name: string;
      site: string;
      slotId: string;
      speed: string;
      type: string;
      owner?: string;
    }
  | {
      account: string;
      name: string;
      region: string;
      type: string;
      owner?: string;
      speed?:
        | "50M"
        | "100M"
        | "200M"
        | "300M"
        | "400M"
        | "500M"
        | "1G"
        | "2G"
        | "5G"
        | "10G"
        | "20G"
        | "50G";
    };

export const GetInterconnectResponse = Schema.Union(
  Schema.Struct({
    account: Schema.String,
    facility: Schema.Struct({
      address: Schema.Array(Schema.String),
      name: Schema.String,
    }),
    name: Schema.String,
    site: Schema.String,
    slotId: Schema.String.pipe(T.JsonName("slot_id")),
    speed: Schema.String,
    type: Schema.String,
    owner: Schema.optional(Schema.String),
  }),
  Schema.Struct({
    account: Schema.String,
    name: Schema.String,
    region: Schema.String,
    type: Schema.String,
    owner: Schema.optional(Schema.String),
    speed: Schema.optional(
      Schema.Literal(
        "50M",
        "100M",
        "200M",
        "300M",
        "400M",
        "500M",
        "1G",
        "2G",
        "5G",
        "10G",
        "20G",
        "50G",
      ),
    ),
  }),
) as unknown as Schema.Schema<GetInterconnectResponse>;

export const getInterconnect: (
  input: GetInterconnectRequest,
) => Effect.Effect<
  GetInterconnectResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetInterconnectRequest,
  output: GetInterconnectResponse,
  errors: [],
}));

export interface ListInterconnectsRequest {
  /** Path param: Customer account tag */
  accountId: string;
  /** Query param: */
  cursor?: number | null;
  /** Query param: */
  limit?: number | null;
  /** Query param: If specified, only show interconnects located at the given site */
  site?: string | null;
  /** Query param: If specified, only show interconnects of the given type */
  type?: string | null;
}

export const ListInterconnectsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  cursor: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.HttpQuery("cursor"),
  ),
  limit: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.HttpQuery("limit"),
  ),
  site: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.HttpQuery("site"),
  ),
  type: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.HttpQuery("type"),
  ),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/cni/interconnects" }),
) as unknown as Schema.Schema<ListInterconnectsRequest>;

export interface ListInterconnectsResponse {
  items: (
    | {
        account: string;
        facility: { address: string[]; name: string };
        name: string;
        site: string;
        slotId: string;
        speed: string;
        type: string;
        owner?: string;
      }
    | {
        account: string;
        name: string;
        region: string;
        type: string;
        owner?: string;
        speed?:
          | "50M"
          | "100M"
          | "200M"
          | "300M"
          | "400M"
          | "500M"
          | "1G"
          | "2G"
          | "5G"
          | "10G"
          | "20G"
          | "50G";
      }
  )[];
  next?: number | null;
}

export const ListInterconnectsResponse = Schema.Struct({
  items: Schema.Array(
    Schema.Union(
      Schema.Struct({
        account: Schema.String,
        facility: Schema.Struct({
          address: Schema.Array(Schema.String),
          name: Schema.String,
        }),
        name: Schema.String,
        site: Schema.String,
        slotId: Schema.String.pipe(T.JsonName("slot_id")),
        speed: Schema.String,
        type: Schema.String,
        owner: Schema.optional(Schema.String),
      }),
      Schema.Struct({
        account: Schema.String,
        name: Schema.String,
        region: Schema.String,
        type: Schema.String,
        owner: Schema.optional(Schema.String),
        speed: Schema.optional(
          Schema.Literal(
            "50M",
            "100M",
            "200M",
            "300M",
            "400M",
            "500M",
            "1G",
            "2G",
            "5G",
            "10G",
            "20G",
            "50G",
          ),
        ),
      }),
    ),
  ),
  next: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
}) as unknown as Schema.Schema<ListInterconnectsResponse>;

export const listInterconnects: (
  input: ListInterconnectsRequest,
) => Effect.Effect<
  ListInterconnectsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListInterconnectsRequest,
  output: ListInterconnectsResponse,
  errors: [],
}));

export interface CreateInterconnectRequest {}

export const CreateInterconnectRequest = Schema.Struct({}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/cni/interconnects" }),
) as unknown as Schema.Schema<CreateInterconnectRequest>;

export type CreateInterconnectResponse =
  | {
      account: string;
      facility: { address: string[]; name: string };
      name: string;
      site: string;
      slotId: string;
      speed: string;
      type: string;
      owner?: string;
    }
  | {
      account: string;
      name: string;
      region: string;
      type: string;
      owner?: string;
      speed?:
        | "50M"
        | "100M"
        | "200M"
        | "300M"
        | "400M"
        | "500M"
        | "1G"
        | "2G"
        | "5G"
        | "10G"
        | "20G"
        | "50G";
    };

export const CreateInterconnectResponse = Schema.Union(
  Schema.Struct({
    account: Schema.String,
    facility: Schema.Struct({
      address: Schema.Array(Schema.String),
      name: Schema.String,
    }),
    name: Schema.String,
    site: Schema.String,
    slotId: Schema.String.pipe(T.JsonName("slot_id")),
    speed: Schema.String,
    type: Schema.String,
    owner: Schema.optional(Schema.String),
  }),
  Schema.Struct({
    account: Schema.String,
    name: Schema.String,
    region: Schema.String,
    type: Schema.String,
    owner: Schema.optional(Schema.String),
    speed: Schema.optional(
      Schema.Literal(
        "50M",
        "100M",
        "200M",
        "300M",
        "400M",
        "500M",
        "1G",
        "2G",
        "5G",
        "10G",
        "20G",
        "50G",
      ),
    ),
  }),
) as unknown as Schema.Schema<CreateInterconnectResponse>;

export const createInterconnect: (
  input: CreateInterconnectRequest,
) => Effect.Effect<
  CreateInterconnectResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateInterconnectRequest,
  output: CreateInterconnectResponse,
  errors: [],
}));

export interface DeleteInterconnectRequest {
  icon: string;
  /** Customer account tag */
  accountId: string;
}

export const DeleteInterconnectRequest = Schema.Struct({
  icon: Schema.String.pipe(T.HttpPath("icon")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/cni/interconnects/{icon}",
  }),
) as unknown as Schema.Schema<DeleteInterconnectRequest>;

export type DeleteInterconnectResponse = unknown;

export const DeleteInterconnectResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteInterconnectResponse>;

export const deleteInterconnect: (
  input: DeleteInterconnectRequest,
) => Effect.Effect<
  DeleteInterconnectResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteInterconnectRequest,
  output: DeleteInterconnectResponse,
  errors: [],
}));

export interface StatusInterconnectRequest {
  icon: string;
  /** Customer account tag */
  accountId: string;
}

export const StatusInterconnectRequest = Schema.Struct({
  icon: Schema.String.pipe(T.HttpPath("icon")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cni/interconnects/{icon}/status",
  }),
) as unknown as Schema.Schema<StatusInterconnectRequest>;

export type StatusInterconnectResponse =
  | { state: "Pending" }
  | { state: "Down"; reason?: string | null }
  | { state: "Unhealthy"; reason?: string | null }
  | { state: "Healthy" };

export const StatusInterconnectResponse = Schema.Union(
  Schema.Struct({
    state: Schema.Literal("Pending"),
  }),
  Schema.Struct({
    state: Schema.Literal("Down"),
    reason: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
  Schema.Struct({
    state: Schema.Literal("Unhealthy"),
    reason: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  }),
  Schema.Struct({
    state: Schema.Literal("Healthy"),
  }),
) as unknown as Schema.Schema<StatusInterconnectResponse>;

export const statusInterconnect: (
  input: StatusInterconnectRequest,
) => Effect.Effect<
  StatusInterconnectResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: StatusInterconnectRequest,
  output: StatusInterconnectResponse,
  errors: [],
}));

export interface LoaInterconnectRequest {
  icon: string;
  /** Customer account tag */
  accountId: string;
}

export const LoaInterconnectRequest = Schema.Struct({
  icon: Schema.String.pipe(T.HttpPath("icon")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/cni/interconnects/{icon}/loa",
  }),
) as unknown as Schema.Schema<LoaInterconnectRequest>;

export type LoaInterconnectResponse = unknown;

export const LoaInterconnectResponse =
  Schema.Unknown as unknown as Schema.Schema<LoaInterconnectResponse>;

export const loaInterconnect: (
  input: LoaInterconnectRequest,
) => Effect.Effect<
  LoaInterconnectResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: LoaInterconnectRequest,
  output: LoaInterconnectResponse,
  errors: [],
}));

// =============================================================================
// Setting
// =============================================================================

export interface GetSettingRequest {
  /** Account tag to retrieve settings for */
  accountId: string;
}

export const GetSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/cni/settings" }),
) as unknown as Schema.Schema<GetSettingRequest>;

export interface GetSettingResponse {
  defaultAsn: number;
}

export const GetSettingResponse = Schema.Struct({
  defaultAsn: Schema.Number.pipe(T.JsonName("default_asn")),
}) as unknown as Schema.Schema<GetSettingResponse>;

export const getSetting: (
  input: GetSettingRequest,
) => Effect.Effect<
  GetSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSettingRequest,
  output: GetSettingResponse,
  errors: [],
}));

export interface PutSettingRequest {
  /** Path param: Account tag to update settings for */
  accountId: string;
  /** Body param: */
  defaultAsn?: number | null;
}

export const PutSettingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  defaultAsn: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.JsonName("default_asn"),
  ),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/cni/settings" }),
) as unknown as Schema.Schema<PutSettingRequest>;

export interface PutSettingResponse {
  defaultAsn: number;
}

export const PutSettingResponse = Schema.Struct({
  defaultAsn: Schema.Number.pipe(T.JsonName("default_asn")),
}) as unknown as Schema.Schema<PutSettingResponse>;

export const putSetting: (
  input: PutSettingRequest,
) => Effect.Effect<
  PutSettingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutSettingRequest,
  output: PutSettingResponse,
  errors: [],
}));

// =============================================================================
// Slot
// =============================================================================

export interface GetSlotRequest {
  slot: string;
  /** Customer account tag */
  accountId: string;
}

export const GetSlotRequest = Schema.Struct({
  slot: Schema.String.pipe(T.HttpPath("slot")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/cni/slots/{slot}" }),
) as unknown as Schema.Schema<GetSlotRequest>;

export interface GetSlotResponse {
  /** Slot ID */
  id: string;
  facility: { address: string[]; name: string };
  /** Whether the slot is occupied or not */
  occupied: boolean;
  site: string;
  speed: string;
  /** Customer account tag */
  account?: string;
}

export const GetSlotResponse = Schema.Struct({
  id: Schema.String,
  facility: Schema.Struct({
    address: Schema.Array(Schema.String),
    name: Schema.String,
  }),
  occupied: Schema.Boolean,
  site: Schema.String,
  speed: Schema.String,
  account: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetSlotResponse>;

export const getSlot: (
  input: GetSlotRequest,
) => Effect.Effect<
  GetSlotResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetSlotRequest,
  output: GetSlotResponse,
  errors: [],
}));

export interface ListSlotsRequest {
  /** Path param: Customer account tag */
  accountId: string;
  /** Query param: If specified, only show slots with the given text in their address field */
  addressContains?: string | null;
  /** Query param: */
  cursor?: number | null;
  /** Query param: */
  limit?: number | null;
  /** Query param: If specified, only show slots with a specific occupied/unoccupied state */
  occupied?: boolean | null;
  /** Query param: If specified, only show slots located at the given site */
  site?: string | null;
  /** Query param: If specified, only show slots that support the given speed */
  speed?: string | null;
}

export const ListSlotsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  addressContains: Schema.optional(
    Schema.Union(Schema.String, Schema.Null),
  ).pipe(T.HttpQuery("address_contains")),
  cursor: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.HttpQuery("cursor"),
  ),
  limit: Schema.optional(Schema.Union(Schema.Number, Schema.Null)).pipe(
    T.HttpQuery("limit"),
  ),
  occupied: Schema.optional(Schema.Union(Schema.Boolean, Schema.Null)).pipe(
    T.HttpQuery("occupied"),
  ),
  site: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.HttpQuery("site"),
  ),
  speed: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.HttpQuery("speed"),
  ),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/cni/slots" }),
) as unknown as Schema.Schema<ListSlotsRequest>;

export interface ListSlotsResponse {
  items: {
    id: string;
    facility: { address: string[]; name: string };
    occupied: boolean;
    site: string;
    speed: string;
    account?: string;
  }[];
  next?: number | null;
}

export const ListSlotsResponse = Schema.Struct({
  items: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      facility: Schema.Struct({
        address: Schema.Array(Schema.String),
        name: Schema.String,
      }),
      occupied: Schema.Boolean,
      site: Schema.String,
      speed: Schema.String,
      account: Schema.optional(Schema.String),
    }),
  ),
  next: Schema.optional(Schema.Union(Schema.Number, Schema.Null)),
}) as unknown as Schema.Schema<ListSlotsResponse>;

export const listSlots: (
  input: ListSlotsRequest,
) => Effect.Effect<
  ListSlotsResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListSlotsRequest,
  output: ListSlotsResponse,
  errors: [],
}));
