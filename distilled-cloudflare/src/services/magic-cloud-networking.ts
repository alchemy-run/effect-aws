/**
 * Cloudflare MAGIC-CLOUD-NETWORKING API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service magic-cloud-networking
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
// AllCloudIntegration
// =============================================================================

export interface DiscoverAllCloudIntegrationRequest {
  accountId: string;
}

export const DiscoverAllCloudIntegrationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/magic/cloud/providers/discover",
  }),
) as unknown as Schema.Schema<DiscoverAllCloudIntegrationRequest>;

export interface DiscoverAllCloudIntegrationResponse {
  errors: {
    code:
      | "1001"
      | "1002"
      | "1003"
      | "1004"
      | "1005"
      | "1006"
      | "1007"
      | "1008"
      | "1009"
      | "1010"
      | "1011"
      | "1012"
      | "1013"
      | "1014"
      | "1015"
      | "1016"
      | "1017"
      | "2001"
      | "2002"
      | "2003"
      | "2004"
      | "2005"
      | "2006"
      | "2007"
      | "2008"
      | "2009"
      | "2010"
      | "2011"
      | "2012"
      | "2013"
      | "2014"
      | "2015"
      | "2016"
      | "2017"
      | "2018"
      | "2019"
      | "2020"
      | "2021"
      | "2022"
      | "3001"
      | "3002"
      | "3003"
      | "3004"
      | "3005"
      | "3006"
      | "3007"
      | "4001"
      | "4002"
      | "4003"
      | "4004"
      | "4005"
      | "4006"
      | "4007"
      | "4008"
      | "4009"
      | "4010"
      | "4011"
      | "4012"
      | "4013"
      | "4014"
      | "4015"
      | "4016"
      | "4017"
      | "4018"
      | "4019"
      | "4020"
      | "4021"
      | "4022"
      | "4023"
      | "5001"
      | "5002"
      | "5003"
      | "5004"
      | "102000"
      | "102001"
      | "102002"
      | "102003"
      | "102004"
      | "102005"
      | "102006"
      | "102007"
      | "102008"
      | "102009"
      | "102010"
      | "102011"
      | "102012"
      | "102013"
      | "102014"
      | "102015"
      | "102016"
      | "102017"
      | "102018"
      | "102019"
      | "102020"
      | "102021"
      | "102022"
      | "102023"
      | "102024"
      | "102025"
      | "102026"
      | "102027"
      | "102028"
      | "102029"
      | "102030"
      | "102031"
      | "102032"
      | "102033"
      | "102034"
      | "102035"
      | "102036"
      | "102037"
      | "102038"
      | "102039"
      | "102040"
      | "102041"
      | "102042"
      | "102043"
      | "102044"
      | "102045"
      | "102046"
      | "102047"
      | "102048"
      | "102049"
      | "102050"
      | "102051"
      | "102052"
      | "102053"
      | "102054"
      | "102055"
      | "102056"
      | "102057"
      | "102058"
      | "102059"
      | "102060"
      | "102061"
      | "102062"
      | "102063"
      | "102064"
      | "102065"
      | "102066"
      | "103001"
      | "103002"
      | "103003"
      | "103004"
      | "103005"
      | "103006"
      | "103007"
      | "103008";
    message: string;
    documentationUrl?: string;
    meta?: {
      l10nKey?: string;
      loggableError?: string;
      templateData?: unknown;
      traceId?: string;
    };
    source?: {
      parameter?: string;
      parameterValueIndex?: number;
      pointer?: string;
    };
  }[];
  messages: {
    code:
      | "1001"
      | "1002"
      | "1003"
      | "1004"
      | "1005"
      | "1006"
      | "1007"
      | "1008"
      | "1009"
      | "1010"
      | "1011"
      | "1012"
      | "1013"
      | "1014"
      | "1015"
      | "1016"
      | "1017"
      | "2001"
      | "2002"
      | "2003"
      | "2004"
      | "2005"
      | "2006"
      | "2007"
      | "2008"
      | "2009"
      | "2010"
      | "2011"
      | "2012"
      | "2013"
      | "2014"
      | "2015"
      | "2016"
      | "2017"
      | "2018"
      | "2019"
      | "2020"
      | "2021"
      | "2022"
      | "3001"
      | "3002"
      | "3003"
      | "3004"
      | "3005"
      | "3006"
      | "3007"
      | "4001"
      | "4002"
      | "4003"
      | "4004"
      | "4005"
      | "4006"
      | "4007"
      | "4008"
      | "4009"
      | "4010"
      | "4011"
      | "4012"
      | "4013"
      | "4014"
      | "4015"
      | "4016"
      | "4017"
      | "4018"
      | "4019"
      | "4020"
      | "4021"
      | "4022"
      | "4023"
      | "5001"
      | "5002"
      | "5003"
      | "5004"
      | "102000"
      | "102001"
      | "102002"
      | "102003"
      | "102004"
      | "102005"
      | "102006"
      | "102007"
      | "102008"
      | "102009"
      | "102010"
      | "102011"
      | "102012"
      | "102013"
      | "102014"
      | "102015"
      | "102016"
      | "102017"
      | "102018"
      | "102019"
      | "102020"
      | "102021"
      | "102022"
      | "102023"
      | "102024"
      | "102025"
      | "102026"
      | "102027"
      | "102028"
      | "102029"
      | "102030"
      | "102031"
      | "102032"
      | "102033"
      | "102034"
      | "102035"
      | "102036"
      | "102037"
      | "102038"
      | "102039"
      | "102040"
      | "102041"
      | "102042"
      | "102043"
      | "102044"
      | "102045"
      | "102046"
      | "102047"
      | "102048"
      | "102049"
      | "102050"
      | "102051"
      | "102052"
      | "102053"
      | "102054"
      | "102055"
      | "102056"
      | "102057"
      | "102058"
      | "102059"
      | "102060"
      | "102061"
      | "102062"
      | "102063"
      | "102064"
      | "102065"
      | "102066"
      | "103001"
      | "103002"
      | "103003"
      | "103004"
      | "103005"
      | "103006"
      | "103007"
      | "103008";
    message: string;
    documentationUrl?: string;
    meta?: {
      l10nKey?: string;
      loggableError?: string;
      templateData?: unknown;
      traceId?: string;
    };
    source?: {
      parameter?: string;
      parameterValueIndex?: number;
      pointer?: string;
    };
  }[];
  success: boolean;
}

export const DiscoverAllCloudIntegrationResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Literal(
        "1001",
        "1002",
        "1003",
        "1004",
        "1005",
        "1006",
        "1007",
        "1008",
        "1009",
        "1010",
        "1011",
        "1012",
        "1013",
        "1014",
        "1015",
        "1016",
        "1017",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "3001",
        "3002",
        "3003",
        "3004",
        "3005",
        "3006",
        "3007",
        "4001",
        "4002",
        "4003",
        "4004",
        "4005",
        "4006",
        "4007",
        "4008",
        "4009",
        "4010",
        "4011",
        "4012",
        "4013",
        "4014",
        "4015",
        "4016",
        "4017",
        "4018",
        "4019",
        "4020",
        "4021",
        "4022",
        "4023",
        "5001",
        "5002",
        "5003",
        "5004",
        "102000",
        "102001",
        "102002",
        "102003",
        "102004",
        "102005",
        "102006",
        "102007",
        "102008",
        "102009",
        "102010",
        "102011",
        "102012",
        "102013",
        "102014",
        "102015",
        "102016",
        "102017",
        "102018",
        "102019",
        "102020",
        "102021",
        "102022",
        "102023",
        "102024",
        "102025",
        "102026",
        "102027",
        "102028",
        "102029",
        "102030",
        "102031",
        "102032",
        "102033",
        "102034",
        "102035",
        "102036",
        "102037",
        "102038",
        "102039",
        "102040",
        "102041",
        "102042",
        "102043",
        "102044",
        "102045",
        "102046",
        "102047",
        "102048",
        "102049",
        "102050",
        "102051",
        "102052",
        "102053",
        "102054",
        "102055",
        "102056",
        "102057",
        "102058",
        "102059",
        "102060",
        "102061",
        "102062",
        "102063",
        "102064",
        "102065",
        "102066",
        "103001",
        "103002",
        "103003",
        "103004",
        "103005",
        "103006",
        "103007",
        "103008",
      ),
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      meta: Schema.optional(
        Schema.Struct({
          l10nKey: Schema.optional(Schema.String).pipe(T.JsonName("l10n_key")),
          loggableError: Schema.optional(Schema.String).pipe(
            T.JsonName("loggable_error"),
          ),
          templateData: Schema.optional(Schema.Unknown).pipe(
            T.JsonName("template_data"),
          ),
          traceId: Schema.optional(Schema.String).pipe(T.JsonName("trace_id")),
        }),
      ),
      source: Schema.optional(
        Schema.Struct({
          parameter: Schema.optional(Schema.String),
          parameterValueIndex: Schema.optional(Schema.Number).pipe(
            T.JsonName("parameter_value_index"),
          ),
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Literal(
        "1001",
        "1002",
        "1003",
        "1004",
        "1005",
        "1006",
        "1007",
        "1008",
        "1009",
        "1010",
        "1011",
        "1012",
        "1013",
        "1014",
        "1015",
        "1016",
        "1017",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "3001",
        "3002",
        "3003",
        "3004",
        "3005",
        "3006",
        "3007",
        "4001",
        "4002",
        "4003",
        "4004",
        "4005",
        "4006",
        "4007",
        "4008",
        "4009",
        "4010",
        "4011",
        "4012",
        "4013",
        "4014",
        "4015",
        "4016",
        "4017",
        "4018",
        "4019",
        "4020",
        "4021",
        "4022",
        "4023",
        "5001",
        "5002",
        "5003",
        "5004",
        "102000",
        "102001",
        "102002",
        "102003",
        "102004",
        "102005",
        "102006",
        "102007",
        "102008",
        "102009",
        "102010",
        "102011",
        "102012",
        "102013",
        "102014",
        "102015",
        "102016",
        "102017",
        "102018",
        "102019",
        "102020",
        "102021",
        "102022",
        "102023",
        "102024",
        "102025",
        "102026",
        "102027",
        "102028",
        "102029",
        "102030",
        "102031",
        "102032",
        "102033",
        "102034",
        "102035",
        "102036",
        "102037",
        "102038",
        "102039",
        "102040",
        "102041",
        "102042",
        "102043",
        "102044",
        "102045",
        "102046",
        "102047",
        "102048",
        "102049",
        "102050",
        "102051",
        "102052",
        "102053",
        "102054",
        "102055",
        "102056",
        "102057",
        "102058",
        "102059",
        "102060",
        "102061",
        "102062",
        "102063",
        "102064",
        "102065",
        "102066",
        "103001",
        "103002",
        "103003",
        "103004",
        "103005",
        "103006",
        "103007",
        "103008",
      ),
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      meta: Schema.optional(
        Schema.Struct({
          l10nKey: Schema.optional(Schema.String).pipe(T.JsonName("l10n_key")),
          loggableError: Schema.optional(Schema.String).pipe(
            T.JsonName("loggable_error"),
          ),
          templateData: Schema.optional(Schema.Unknown).pipe(
            T.JsonName("template_data"),
          ),
          traceId: Schema.optional(Schema.String).pipe(T.JsonName("trace_id")),
        }),
      ),
      source: Schema.optional(
        Schema.Struct({
          parameter: Schema.optional(Schema.String),
          parameterValueIndex: Schema.optional(Schema.Number).pipe(
            T.JsonName("parameter_value_index"),
          ),
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Boolean,
}) as unknown as Schema.Schema<DiscoverAllCloudIntegrationResponse>;

export const discoverAllCloudIntegration: (
  input: DiscoverAllCloudIntegrationRequest,
) => Effect.Effect<
  DiscoverAllCloudIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DiscoverAllCloudIntegrationRequest,
  output: DiscoverAllCloudIntegrationResponse,
  errors: [],
}));

// =============================================================================
// CatalogSync
// =============================================================================

export interface GetCatalogSyncRequest {
  syncId: string;
  accountId: string;
}

export const GetCatalogSyncRequest = Schema.Struct({
  syncId: Schema.String.pipe(T.HttpPath("syncId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/magic/cloud/catalog-syncs/{syncId}",
  }),
) as unknown as Schema.Schema<GetCatalogSyncRequest>;

export interface GetCatalogSyncResponse {
  id: string;
  description: string;
  destinationId: string;
  destinationType: "NONE" | "ZERO_TRUST_LIST";
  lastUserUpdateAt: string;
  name: string;
  policy: string;
  updateMode: "AUTO" | "MANUAL";
  errors?: Record<string, unknown>;
  includesDiscoveriesUntil?: string;
  lastAttemptedUpdateAt?: string;
  lastSuccessfulUpdateAt?: string;
}

export const GetCatalogSyncResponse = Schema.Struct({
  id: Schema.String,
  description: Schema.String,
  destinationId: Schema.String.pipe(T.JsonName("destination_id")),
  destinationType: Schema.Literal("NONE", "ZERO_TRUST_LIST").pipe(
    T.JsonName("destination_type"),
  ),
  lastUserUpdateAt: Schema.String.pipe(T.JsonName("last_user_update_at")),
  name: Schema.String,
  policy: Schema.String,
  updateMode: Schema.Literal("AUTO", "MANUAL").pipe(T.JsonName("update_mode")),
  errors: Schema.optional(Schema.Struct({})),
  includesDiscoveriesUntil: Schema.optional(Schema.String).pipe(
    T.JsonName("includes_discoveries_until"),
  ),
  lastAttemptedUpdateAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_attempted_update_at"),
  ),
  lastSuccessfulUpdateAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_successful_update_at"),
  ),
}) as unknown as Schema.Schema<GetCatalogSyncResponse>;

export const getCatalogSync: (
  input: GetCatalogSyncRequest,
) => Effect.Effect<
  GetCatalogSyncResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetCatalogSyncRequest,
  output: GetCatalogSyncResponse,
  errors: [],
}));

export interface CreateCatalogSyncRequest {
  /** Path param: */
  accountId: string;
  /** Header param: */
  forwarded?: string;
  /** Body param: */
  destinationType: "NONE" | "ZERO_TRUST_LIST";
  /** Body param: */
  name: string;
  /** Body param: */
  updateMode: "AUTO" | "MANUAL";
  /** Body param: */
  description?: string;
  /** Body param: */
  policy?: string;
}

export const CreateCatalogSyncRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  forwarded: Schema.optional(Schema.String).pipe(T.HttpHeader("forwarded")),
  destinationType: Schema.Literal("NONE", "ZERO_TRUST_LIST").pipe(
    T.JsonName("destination_type"),
  ),
  name: Schema.String,
  updateMode: Schema.Literal("AUTO", "MANUAL").pipe(T.JsonName("update_mode")),
  description: Schema.optional(Schema.String),
  policy: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/magic/cloud/catalog-syncs",
  }),
) as unknown as Schema.Schema<CreateCatalogSyncRequest>;

export interface CreateCatalogSyncResponse {
  id: string;
  description: string;
  destinationId: string;
  destinationType: "NONE" | "ZERO_TRUST_LIST";
  lastUserUpdateAt: string;
  name: string;
  policy: string;
  updateMode: "AUTO" | "MANUAL";
  errors?: Record<string, unknown>;
  includesDiscoveriesUntil?: string;
  lastAttemptedUpdateAt?: string;
  lastSuccessfulUpdateAt?: string;
}

export const CreateCatalogSyncResponse = Schema.Struct({
  id: Schema.String,
  description: Schema.String,
  destinationId: Schema.String.pipe(T.JsonName("destination_id")),
  destinationType: Schema.Literal("NONE", "ZERO_TRUST_LIST").pipe(
    T.JsonName("destination_type"),
  ),
  lastUserUpdateAt: Schema.String.pipe(T.JsonName("last_user_update_at")),
  name: Schema.String,
  policy: Schema.String,
  updateMode: Schema.Literal("AUTO", "MANUAL").pipe(T.JsonName("update_mode")),
  errors: Schema.optional(Schema.Struct({})),
  includesDiscoveriesUntil: Schema.optional(Schema.String).pipe(
    T.JsonName("includes_discoveries_until"),
  ),
  lastAttemptedUpdateAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_attempted_update_at"),
  ),
  lastSuccessfulUpdateAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_successful_update_at"),
  ),
}) as unknown as Schema.Schema<CreateCatalogSyncResponse>;

export const createCatalogSync: (
  input: CreateCatalogSyncRequest,
) => Effect.Effect<
  CreateCatalogSyncResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateCatalogSyncRequest,
  output: CreateCatalogSyncResponse,
  errors: [],
}));

export interface UpdateCatalogSyncRequest {
  syncId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  description?: string;
  /** Body param: */
  name?: string;
  /** Body param: */
  policy?: string;
  /** Body param: */
  updateMode?: "AUTO" | "MANUAL";
}

export const UpdateCatalogSyncRequest = Schema.Struct({
  syncId: Schema.String.pipe(T.HttpPath("syncId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  description: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  policy: Schema.optional(Schema.String),
  updateMode: Schema.optional(Schema.Literal("AUTO", "MANUAL")).pipe(
    T.JsonName("update_mode"),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/magic/cloud/catalog-syncs/{syncId}",
  }),
) as unknown as Schema.Schema<UpdateCatalogSyncRequest>;

export interface UpdateCatalogSyncResponse {
  id: string;
  description: string;
  destinationId: string;
  destinationType: "NONE" | "ZERO_TRUST_LIST";
  lastUserUpdateAt: string;
  name: string;
  policy: string;
  updateMode: "AUTO" | "MANUAL";
  errors?: Record<string, unknown>;
  includesDiscoveriesUntil?: string;
  lastAttemptedUpdateAt?: string;
  lastSuccessfulUpdateAt?: string;
}

export const UpdateCatalogSyncResponse = Schema.Struct({
  id: Schema.String,
  description: Schema.String,
  destinationId: Schema.String.pipe(T.JsonName("destination_id")),
  destinationType: Schema.Literal("NONE", "ZERO_TRUST_LIST").pipe(
    T.JsonName("destination_type"),
  ),
  lastUserUpdateAt: Schema.String.pipe(T.JsonName("last_user_update_at")),
  name: Schema.String,
  policy: Schema.String,
  updateMode: Schema.Literal("AUTO", "MANUAL").pipe(T.JsonName("update_mode")),
  errors: Schema.optional(Schema.Struct({})),
  includesDiscoveriesUntil: Schema.optional(Schema.String).pipe(
    T.JsonName("includes_discoveries_until"),
  ),
  lastAttemptedUpdateAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_attempted_update_at"),
  ),
  lastSuccessfulUpdateAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_successful_update_at"),
  ),
}) as unknown as Schema.Schema<UpdateCatalogSyncResponse>;

export const updateCatalogSync: (
  input: UpdateCatalogSyncRequest,
) => Effect.Effect<
  UpdateCatalogSyncResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateCatalogSyncRequest,
  output: UpdateCatalogSyncResponse,
  errors: [],
}));

export interface PatchCatalogSyncRequest {
  syncId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  description?: string;
  /** Body param: */
  name?: string;
  /** Body param: */
  policy?: string;
  /** Body param: */
  updateMode?: "AUTO" | "MANUAL";
}

export const PatchCatalogSyncRequest = Schema.Struct({
  syncId: Schema.String.pipe(T.HttpPath("syncId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  description: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  policy: Schema.optional(Schema.String),
  updateMode: Schema.optional(Schema.Literal("AUTO", "MANUAL")).pipe(
    T.JsonName("update_mode"),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/magic/cloud/catalog-syncs/{syncId}",
  }),
) as unknown as Schema.Schema<PatchCatalogSyncRequest>;

export interface PatchCatalogSyncResponse {
  id: string;
  description: string;
  destinationId: string;
  destinationType: "NONE" | "ZERO_TRUST_LIST";
  lastUserUpdateAt: string;
  name: string;
  policy: string;
  updateMode: "AUTO" | "MANUAL";
  errors?: Record<string, unknown>;
  includesDiscoveriesUntil?: string;
  lastAttemptedUpdateAt?: string;
  lastSuccessfulUpdateAt?: string;
}

export const PatchCatalogSyncResponse = Schema.Struct({
  id: Schema.String,
  description: Schema.String,
  destinationId: Schema.String.pipe(T.JsonName("destination_id")),
  destinationType: Schema.Literal("NONE", "ZERO_TRUST_LIST").pipe(
    T.JsonName("destination_type"),
  ),
  lastUserUpdateAt: Schema.String.pipe(T.JsonName("last_user_update_at")),
  name: Schema.String,
  policy: Schema.String,
  updateMode: Schema.Literal("AUTO", "MANUAL").pipe(T.JsonName("update_mode")),
  errors: Schema.optional(Schema.Struct({})),
  includesDiscoveriesUntil: Schema.optional(Schema.String).pipe(
    T.JsonName("includes_discoveries_until"),
  ),
  lastAttemptedUpdateAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_attempted_update_at"),
  ),
  lastSuccessfulUpdateAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_successful_update_at"),
  ),
}) as unknown as Schema.Schema<PatchCatalogSyncResponse>;

export const patchCatalogSync: (
  input: PatchCatalogSyncRequest,
) => Effect.Effect<
  PatchCatalogSyncResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchCatalogSyncRequest,
  output: PatchCatalogSyncResponse,
  errors: [],
}));

export interface DeleteCatalogSyncRequest {
  syncId: string;
  /** Path param: */
  accountId: string;
  /** Query param: */
  deleteDestination?: boolean;
}

export const DeleteCatalogSyncRequest = Schema.Struct({
  syncId: Schema.String.pipe(T.HttpPath("syncId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  deleteDestination: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("delete_destination"),
  ),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/magic/cloud/catalog-syncs/{syncId}",
  }),
) as unknown as Schema.Schema<DeleteCatalogSyncRequest>;

export interface DeleteCatalogSyncResponse {
  id: string;
}

export const DeleteCatalogSyncResponse = Schema.Struct({
  id: Schema.String,
}) as unknown as Schema.Schema<DeleteCatalogSyncResponse>;

export const deleteCatalogSync: (
  input: DeleteCatalogSyncRequest,
) => Effect.Effect<
  DeleteCatalogSyncResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteCatalogSyncRequest,
  output: DeleteCatalogSyncResponse,
  errors: [],
}));

export interface RefreshCatalogSyncRequest {
  syncId: string;
  accountId: string;
}

export const RefreshCatalogSyncRequest = Schema.Struct({
  syncId: Schema.String.pipe(T.HttpPath("syncId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/magic/cloud/catalog-syncs/{syncId}/refresh",
  }),
) as unknown as Schema.Schema<RefreshCatalogSyncRequest>;

export type RefreshCatalogSyncResponse = string;

export const RefreshCatalogSyncResponse =
  Schema.String as unknown as Schema.Schema<RefreshCatalogSyncResponse>;

export const refreshCatalogSync: (
  input: RefreshCatalogSyncRequest,
) => Effect.Effect<
  RefreshCatalogSyncResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: RefreshCatalogSyncRequest,
  output: RefreshCatalogSyncResponse,
  errors: [],
}));

// =============================================================================
// CloudIntegration
// =============================================================================

export interface GetCloudIntegrationRequest {
  providerId: string;
  /** Path param: */
  accountId: string;
  /** Query param: */
  status?: boolean;
}

export const GetCloudIntegrationRequest = Schema.Struct({
  providerId: Schema.String.pipe(T.HttpPath("providerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  status: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("status")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/magic/cloud/providers/{providerId}",
  }),
) as unknown as Schema.Schema<GetCloudIntegrationRequest>;

export interface GetCloudIntegrationResponse {
  id: string;
  cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
  friendlyName: string;
  lastUpdated: string;
  lifecycleState: "ACTIVE" | "PENDING_SETUP" | "RETIRED";
  state: "UNSPECIFIED" | "PENDING" | "DISCOVERING" | "FAILED" | "SUCCEEDED";
  stateV2: "UNSPECIFIED" | "PENDING" | "DISCOVERING" | "FAILED" | "SUCCEEDED";
  awsArn?: string;
  azureSubscriptionId?: string;
  azureTenantId?: string;
  description?: string;
  gcpProjectId?: string;
  gcpServiceAccountEmail?: string;
  status?: {
    discoveryProgress: { done: number; total: number; unit: string };
    discoveryProgressV2: { done: number; total: number; unit: string };
    lastDiscoveryStatus:
      | "UNSPECIFIED"
      | "PENDING"
      | "DISCOVERING"
      | "FAILED"
      | "SUCCEEDED";
    lastDiscoveryStatusV2:
      | "UNSPECIFIED"
      | "PENDING"
      | "DISCOVERING"
      | "FAILED"
      | "SUCCEEDED";
    regions: string[];
    credentialsGoodSince?: string;
    credentialsMissingSince?: string;
    credentialsRejectedSince?: string;
    discoveryMessage?: string;
    discoveryMessageV2?: string;
    inUseBy?: {
      id: string;
      clientType: "MAGIC_WAN_CLOUD_ONRAMP";
      name: string;
    }[];
    lastDiscoveryCompletedAt?: string;
    lastDiscoveryCompletedAtV2?: string;
    lastDiscoveryStartedAt?: string;
    lastDiscoveryStartedAtV2?: string;
    lastUpdated?: string;
  };
}

export const GetCloudIntegrationResponse = Schema.Struct({
  id: Schema.String,
  cloudType: Schema.Literal("AWS", "AZURE", "GOOGLE", "CLOUDFLARE").pipe(
    T.JsonName("cloud_type"),
  ),
  friendlyName: Schema.String.pipe(T.JsonName("friendly_name")),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  lifecycleState: Schema.Literal("ACTIVE", "PENDING_SETUP", "RETIRED").pipe(
    T.JsonName("lifecycle_state"),
  ),
  state: Schema.Literal(
    "UNSPECIFIED",
    "PENDING",
    "DISCOVERING",
    "FAILED",
    "SUCCEEDED",
  ),
  stateV2: Schema.Literal(
    "UNSPECIFIED",
    "PENDING",
    "DISCOVERING",
    "FAILED",
    "SUCCEEDED",
  ).pipe(T.JsonName("state_v2")),
  awsArn: Schema.optional(Schema.String).pipe(T.JsonName("aws_arn")),
  azureSubscriptionId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_subscription_id"),
  ),
  azureTenantId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_tenant_id"),
  ),
  description: Schema.optional(Schema.String),
  gcpProjectId: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_project_id"),
  ),
  gcpServiceAccountEmail: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_service_account_email"),
  ),
  status: Schema.optional(
    Schema.Struct({
      discoveryProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
        unit: Schema.String,
      }).pipe(T.JsonName("discovery_progress")),
      discoveryProgressV2: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
        unit: Schema.String,
      }).pipe(T.JsonName("discovery_progress_v2")),
      lastDiscoveryStatus: Schema.Literal(
        "UNSPECIFIED",
        "PENDING",
        "DISCOVERING",
        "FAILED",
        "SUCCEEDED",
      ).pipe(T.JsonName("last_discovery_status")),
      lastDiscoveryStatusV2: Schema.Literal(
        "UNSPECIFIED",
        "PENDING",
        "DISCOVERING",
        "FAILED",
        "SUCCEEDED",
      ).pipe(T.JsonName("last_discovery_status_v2")),
      regions: Schema.Array(Schema.String),
      credentialsGoodSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_good_since"),
      ),
      credentialsMissingSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_missing_since"),
      ),
      credentialsRejectedSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_rejected_since"),
      ),
      discoveryMessage: Schema.optional(Schema.String).pipe(
        T.JsonName("discovery_message"),
      ),
      discoveryMessageV2: Schema.optional(Schema.String).pipe(
        T.JsonName("discovery_message_v2"),
      ),
      inUseBy: Schema.optional(
        Schema.Array(
          Schema.Struct({
            id: Schema.String,
            clientType: Schema.Literal("MAGIC_WAN_CLOUD_ONRAMP").pipe(
              T.JsonName("client_type"),
            ),
            name: Schema.String,
          }),
        ),
      ).pipe(T.JsonName("in_use_by")),
      lastDiscoveryCompletedAt: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_completed_at"),
      ),
      lastDiscoveryCompletedAtV2: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_completed_at_v2"),
      ),
      lastDiscoveryStartedAt: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_started_at"),
      ),
      lastDiscoveryStartedAtV2: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_started_at_v2"),
      ),
      lastUpdated: Schema.optional(Schema.String).pipe(
        T.JsonName("last_updated"),
      ),
    }),
  ),
}) as unknown as Schema.Schema<GetCloudIntegrationResponse>;

export const getCloudIntegration: (
  input: GetCloudIntegrationRequest,
) => Effect.Effect<
  GetCloudIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetCloudIntegrationRequest,
  output: GetCloudIntegrationResponse,
  errors: [],
}));

export interface CreateCloudIntegrationRequest {
  /** Path param: */
  accountId: string;
  /** Header param: */
  forwarded?: string;
  /** Body param: */
  cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
  /** Body param: */
  friendlyName: string;
  /** Body param: */
  description?: string;
}

export const CreateCloudIntegrationRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  forwarded: Schema.optional(Schema.String).pipe(T.HttpHeader("forwarded")),
  cloudType: Schema.Literal("AWS", "AZURE", "GOOGLE", "CLOUDFLARE").pipe(
    T.JsonName("cloud_type"),
  ),
  friendlyName: Schema.String.pipe(T.JsonName("friendly_name")),
  description: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/magic/cloud/providers",
  }),
) as unknown as Schema.Schema<CreateCloudIntegrationRequest>;

export interface CreateCloudIntegrationResponse {
  id: string;
  cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
  friendlyName: string;
  lastUpdated: string;
  lifecycleState: "ACTIVE" | "PENDING_SETUP" | "RETIRED";
  state: "UNSPECIFIED" | "PENDING" | "DISCOVERING" | "FAILED" | "SUCCEEDED";
  stateV2: "UNSPECIFIED" | "PENDING" | "DISCOVERING" | "FAILED" | "SUCCEEDED";
  awsArn?: string;
  azureSubscriptionId?: string;
  azureTenantId?: string;
  description?: string;
  gcpProjectId?: string;
  gcpServiceAccountEmail?: string;
  status?: {
    discoveryProgress: { done: number; total: number; unit: string };
    discoveryProgressV2: { done: number; total: number; unit: string };
    lastDiscoveryStatus:
      | "UNSPECIFIED"
      | "PENDING"
      | "DISCOVERING"
      | "FAILED"
      | "SUCCEEDED";
    lastDiscoveryStatusV2:
      | "UNSPECIFIED"
      | "PENDING"
      | "DISCOVERING"
      | "FAILED"
      | "SUCCEEDED";
    regions: string[];
    credentialsGoodSince?: string;
    credentialsMissingSince?: string;
    credentialsRejectedSince?: string;
    discoveryMessage?: string;
    discoveryMessageV2?: string;
    inUseBy?: {
      id: string;
      clientType: "MAGIC_WAN_CLOUD_ONRAMP";
      name: string;
    }[];
    lastDiscoveryCompletedAt?: string;
    lastDiscoveryCompletedAtV2?: string;
    lastDiscoveryStartedAt?: string;
    lastDiscoveryStartedAtV2?: string;
    lastUpdated?: string;
  };
}

export const CreateCloudIntegrationResponse = Schema.Struct({
  id: Schema.String,
  cloudType: Schema.Literal("AWS", "AZURE", "GOOGLE", "CLOUDFLARE").pipe(
    T.JsonName("cloud_type"),
  ),
  friendlyName: Schema.String.pipe(T.JsonName("friendly_name")),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  lifecycleState: Schema.Literal("ACTIVE", "PENDING_SETUP", "RETIRED").pipe(
    T.JsonName("lifecycle_state"),
  ),
  state: Schema.Literal(
    "UNSPECIFIED",
    "PENDING",
    "DISCOVERING",
    "FAILED",
    "SUCCEEDED",
  ),
  stateV2: Schema.Literal(
    "UNSPECIFIED",
    "PENDING",
    "DISCOVERING",
    "FAILED",
    "SUCCEEDED",
  ).pipe(T.JsonName("state_v2")),
  awsArn: Schema.optional(Schema.String).pipe(T.JsonName("aws_arn")),
  azureSubscriptionId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_subscription_id"),
  ),
  azureTenantId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_tenant_id"),
  ),
  description: Schema.optional(Schema.String),
  gcpProjectId: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_project_id"),
  ),
  gcpServiceAccountEmail: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_service_account_email"),
  ),
  status: Schema.optional(
    Schema.Struct({
      discoveryProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
        unit: Schema.String,
      }).pipe(T.JsonName("discovery_progress")),
      discoveryProgressV2: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
        unit: Schema.String,
      }).pipe(T.JsonName("discovery_progress_v2")),
      lastDiscoveryStatus: Schema.Literal(
        "UNSPECIFIED",
        "PENDING",
        "DISCOVERING",
        "FAILED",
        "SUCCEEDED",
      ).pipe(T.JsonName("last_discovery_status")),
      lastDiscoveryStatusV2: Schema.Literal(
        "UNSPECIFIED",
        "PENDING",
        "DISCOVERING",
        "FAILED",
        "SUCCEEDED",
      ).pipe(T.JsonName("last_discovery_status_v2")),
      regions: Schema.Array(Schema.String),
      credentialsGoodSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_good_since"),
      ),
      credentialsMissingSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_missing_since"),
      ),
      credentialsRejectedSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_rejected_since"),
      ),
      discoveryMessage: Schema.optional(Schema.String).pipe(
        T.JsonName("discovery_message"),
      ),
      discoveryMessageV2: Schema.optional(Schema.String).pipe(
        T.JsonName("discovery_message_v2"),
      ),
      inUseBy: Schema.optional(
        Schema.Array(
          Schema.Struct({
            id: Schema.String,
            clientType: Schema.Literal("MAGIC_WAN_CLOUD_ONRAMP").pipe(
              T.JsonName("client_type"),
            ),
            name: Schema.String,
          }),
        ),
      ).pipe(T.JsonName("in_use_by")),
      lastDiscoveryCompletedAt: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_completed_at"),
      ),
      lastDiscoveryCompletedAtV2: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_completed_at_v2"),
      ),
      lastDiscoveryStartedAt: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_started_at"),
      ),
      lastDiscoveryStartedAtV2: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_started_at_v2"),
      ),
      lastUpdated: Schema.optional(Schema.String).pipe(
        T.JsonName("last_updated"),
      ),
    }),
  ),
}) as unknown as Schema.Schema<CreateCloudIntegrationResponse>;

export const createCloudIntegration: (
  input: CreateCloudIntegrationRequest,
) => Effect.Effect<
  CreateCloudIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateCloudIntegrationRequest,
  output: CreateCloudIntegrationResponse,
  errors: [],
}));

export interface UpdateCloudIntegrationRequest {
  providerId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  awsArn?: string;
  /** Body param: */
  azureSubscriptionId?: string;
  /** Body param: */
  azureTenantId?: string;
  /** Body param: */
  description?: string;
  /** Body param: */
  friendlyName?: string;
  /** Body param: */
  gcpProjectId?: string;
  /** Body param: */
  gcpServiceAccountEmail?: string;
}

export const UpdateCloudIntegrationRequest = Schema.Struct({
  providerId: Schema.String.pipe(T.HttpPath("providerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  awsArn: Schema.optional(Schema.String).pipe(T.JsonName("aws_arn")),
  azureSubscriptionId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_subscription_id"),
  ),
  azureTenantId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_tenant_id"),
  ),
  description: Schema.optional(Schema.String),
  friendlyName: Schema.optional(Schema.String).pipe(
    T.JsonName("friendly_name"),
  ),
  gcpProjectId: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_project_id"),
  ),
  gcpServiceAccountEmail: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_service_account_email"),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/magic/cloud/providers/{providerId}",
  }),
) as unknown as Schema.Schema<UpdateCloudIntegrationRequest>;

export interface UpdateCloudIntegrationResponse {
  id: string;
  cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
  friendlyName: string;
  lastUpdated: string;
  lifecycleState: "ACTIVE" | "PENDING_SETUP" | "RETIRED";
  state: "UNSPECIFIED" | "PENDING" | "DISCOVERING" | "FAILED" | "SUCCEEDED";
  stateV2: "UNSPECIFIED" | "PENDING" | "DISCOVERING" | "FAILED" | "SUCCEEDED";
  awsArn?: string;
  azureSubscriptionId?: string;
  azureTenantId?: string;
  description?: string;
  gcpProjectId?: string;
  gcpServiceAccountEmail?: string;
  status?: {
    discoveryProgress: { done: number; total: number; unit: string };
    discoveryProgressV2: { done: number; total: number; unit: string };
    lastDiscoveryStatus:
      | "UNSPECIFIED"
      | "PENDING"
      | "DISCOVERING"
      | "FAILED"
      | "SUCCEEDED";
    lastDiscoveryStatusV2:
      | "UNSPECIFIED"
      | "PENDING"
      | "DISCOVERING"
      | "FAILED"
      | "SUCCEEDED";
    regions: string[];
    credentialsGoodSince?: string;
    credentialsMissingSince?: string;
    credentialsRejectedSince?: string;
    discoveryMessage?: string;
    discoveryMessageV2?: string;
    inUseBy?: {
      id: string;
      clientType: "MAGIC_WAN_CLOUD_ONRAMP";
      name: string;
    }[];
    lastDiscoveryCompletedAt?: string;
    lastDiscoveryCompletedAtV2?: string;
    lastDiscoveryStartedAt?: string;
    lastDiscoveryStartedAtV2?: string;
    lastUpdated?: string;
  };
}

export const UpdateCloudIntegrationResponse = Schema.Struct({
  id: Schema.String,
  cloudType: Schema.Literal("AWS", "AZURE", "GOOGLE", "CLOUDFLARE").pipe(
    T.JsonName("cloud_type"),
  ),
  friendlyName: Schema.String.pipe(T.JsonName("friendly_name")),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  lifecycleState: Schema.Literal("ACTIVE", "PENDING_SETUP", "RETIRED").pipe(
    T.JsonName("lifecycle_state"),
  ),
  state: Schema.Literal(
    "UNSPECIFIED",
    "PENDING",
    "DISCOVERING",
    "FAILED",
    "SUCCEEDED",
  ),
  stateV2: Schema.Literal(
    "UNSPECIFIED",
    "PENDING",
    "DISCOVERING",
    "FAILED",
    "SUCCEEDED",
  ).pipe(T.JsonName("state_v2")),
  awsArn: Schema.optional(Schema.String).pipe(T.JsonName("aws_arn")),
  azureSubscriptionId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_subscription_id"),
  ),
  azureTenantId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_tenant_id"),
  ),
  description: Schema.optional(Schema.String),
  gcpProjectId: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_project_id"),
  ),
  gcpServiceAccountEmail: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_service_account_email"),
  ),
  status: Schema.optional(
    Schema.Struct({
      discoveryProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
        unit: Schema.String,
      }).pipe(T.JsonName("discovery_progress")),
      discoveryProgressV2: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
        unit: Schema.String,
      }).pipe(T.JsonName("discovery_progress_v2")),
      lastDiscoveryStatus: Schema.Literal(
        "UNSPECIFIED",
        "PENDING",
        "DISCOVERING",
        "FAILED",
        "SUCCEEDED",
      ).pipe(T.JsonName("last_discovery_status")),
      lastDiscoveryStatusV2: Schema.Literal(
        "UNSPECIFIED",
        "PENDING",
        "DISCOVERING",
        "FAILED",
        "SUCCEEDED",
      ).pipe(T.JsonName("last_discovery_status_v2")),
      regions: Schema.Array(Schema.String),
      credentialsGoodSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_good_since"),
      ),
      credentialsMissingSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_missing_since"),
      ),
      credentialsRejectedSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_rejected_since"),
      ),
      discoveryMessage: Schema.optional(Schema.String).pipe(
        T.JsonName("discovery_message"),
      ),
      discoveryMessageV2: Schema.optional(Schema.String).pipe(
        T.JsonName("discovery_message_v2"),
      ),
      inUseBy: Schema.optional(
        Schema.Array(
          Schema.Struct({
            id: Schema.String,
            clientType: Schema.Literal("MAGIC_WAN_CLOUD_ONRAMP").pipe(
              T.JsonName("client_type"),
            ),
            name: Schema.String,
          }),
        ),
      ).pipe(T.JsonName("in_use_by")),
      lastDiscoveryCompletedAt: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_completed_at"),
      ),
      lastDiscoveryCompletedAtV2: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_completed_at_v2"),
      ),
      lastDiscoveryStartedAt: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_started_at"),
      ),
      lastDiscoveryStartedAtV2: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_started_at_v2"),
      ),
      lastUpdated: Schema.optional(Schema.String).pipe(
        T.JsonName("last_updated"),
      ),
    }),
  ),
}) as unknown as Schema.Schema<UpdateCloudIntegrationResponse>;

export const updateCloudIntegration: (
  input: UpdateCloudIntegrationRequest,
) => Effect.Effect<
  UpdateCloudIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateCloudIntegrationRequest,
  output: UpdateCloudIntegrationResponse,
  errors: [],
}));

export interface PatchCloudIntegrationRequest {
  providerId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  awsArn?: string;
  /** Body param: */
  azureSubscriptionId?: string;
  /** Body param: */
  azureTenantId?: string;
  /** Body param: */
  description?: string;
  /** Body param: */
  friendlyName?: string;
  /** Body param: */
  gcpProjectId?: string;
  /** Body param: */
  gcpServiceAccountEmail?: string;
}

export const PatchCloudIntegrationRequest = Schema.Struct({
  providerId: Schema.String.pipe(T.HttpPath("providerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  awsArn: Schema.optional(Schema.String).pipe(T.JsonName("aws_arn")),
  azureSubscriptionId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_subscription_id"),
  ),
  azureTenantId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_tenant_id"),
  ),
  description: Schema.optional(Schema.String),
  friendlyName: Schema.optional(Schema.String).pipe(
    T.JsonName("friendly_name"),
  ),
  gcpProjectId: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_project_id"),
  ),
  gcpServiceAccountEmail: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_service_account_email"),
  ),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/magic/cloud/providers/{providerId}",
  }),
) as unknown as Schema.Schema<PatchCloudIntegrationRequest>;

export interface PatchCloudIntegrationResponse {
  id: string;
  cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
  friendlyName: string;
  lastUpdated: string;
  lifecycleState: "ACTIVE" | "PENDING_SETUP" | "RETIRED";
  state: "UNSPECIFIED" | "PENDING" | "DISCOVERING" | "FAILED" | "SUCCEEDED";
  stateV2: "UNSPECIFIED" | "PENDING" | "DISCOVERING" | "FAILED" | "SUCCEEDED";
  awsArn?: string;
  azureSubscriptionId?: string;
  azureTenantId?: string;
  description?: string;
  gcpProjectId?: string;
  gcpServiceAccountEmail?: string;
  status?: {
    discoveryProgress: { done: number; total: number; unit: string };
    discoveryProgressV2: { done: number; total: number; unit: string };
    lastDiscoveryStatus:
      | "UNSPECIFIED"
      | "PENDING"
      | "DISCOVERING"
      | "FAILED"
      | "SUCCEEDED";
    lastDiscoveryStatusV2:
      | "UNSPECIFIED"
      | "PENDING"
      | "DISCOVERING"
      | "FAILED"
      | "SUCCEEDED";
    regions: string[];
    credentialsGoodSince?: string;
    credentialsMissingSince?: string;
    credentialsRejectedSince?: string;
    discoveryMessage?: string;
    discoveryMessageV2?: string;
    inUseBy?: {
      id: string;
      clientType: "MAGIC_WAN_CLOUD_ONRAMP";
      name: string;
    }[];
    lastDiscoveryCompletedAt?: string;
    lastDiscoveryCompletedAtV2?: string;
    lastDiscoveryStartedAt?: string;
    lastDiscoveryStartedAtV2?: string;
    lastUpdated?: string;
  };
}

export const PatchCloudIntegrationResponse = Schema.Struct({
  id: Schema.String,
  cloudType: Schema.Literal("AWS", "AZURE", "GOOGLE", "CLOUDFLARE").pipe(
    T.JsonName("cloud_type"),
  ),
  friendlyName: Schema.String.pipe(T.JsonName("friendly_name")),
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  lifecycleState: Schema.Literal("ACTIVE", "PENDING_SETUP", "RETIRED").pipe(
    T.JsonName("lifecycle_state"),
  ),
  state: Schema.Literal(
    "UNSPECIFIED",
    "PENDING",
    "DISCOVERING",
    "FAILED",
    "SUCCEEDED",
  ),
  stateV2: Schema.Literal(
    "UNSPECIFIED",
    "PENDING",
    "DISCOVERING",
    "FAILED",
    "SUCCEEDED",
  ).pipe(T.JsonName("state_v2")),
  awsArn: Schema.optional(Schema.String).pipe(T.JsonName("aws_arn")),
  azureSubscriptionId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_subscription_id"),
  ),
  azureTenantId: Schema.optional(Schema.String).pipe(
    T.JsonName("azure_tenant_id"),
  ),
  description: Schema.optional(Schema.String),
  gcpProjectId: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_project_id"),
  ),
  gcpServiceAccountEmail: Schema.optional(Schema.String).pipe(
    T.JsonName("gcp_service_account_email"),
  ),
  status: Schema.optional(
    Schema.Struct({
      discoveryProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
        unit: Schema.String,
      }).pipe(T.JsonName("discovery_progress")),
      discoveryProgressV2: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
        unit: Schema.String,
      }).pipe(T.JsonName("discovery_progress_v2")),
      lastDiscoveryStatus: Schema.Literal(
        "UNSPECIFIED",
        "PENDING",
        "DISCOVERING",
        "FAILED",
        "SUCCEEDED",
      ).pipe(T.JsonName("last_discovery_status")),
      lastDiscoveryStatusV2: Schema.Literal(
        "UNSPECIFIED",
        "PENDING",
        "DISCOVERING",
        "FAILED",
        "SUCCEEDED",
      ).pipe(T.JsonName("last_discovery_status_v2")),
      regions: Schema.Array(Schema.String),
      credentialsGoodSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_good_since"),
      ),
      credentialsMissingSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_missing_since"),
      ),
      credentialsRejectedSince: Schema.optional(Schema.String).pipe(
        T.JsonName("credentials_rejected_since"),
      ),
      discoveryMessage: Schema.optional(Schema.String).pipe(
        T.JsonName("discovery_message"),
      ),
      discoveryMessageV2: Schema.optional(Schema.String).pipe(
        T.JsonName("discovery_message_v2"),
      ),
      inUseBy: Schema.optional(
        Schema.Array(
          Schema.Struct({
            id: Schema.String,
            clientType: Schema.Literal("MAGIC_WAN_CLOUD_ONRAMP").pipe(
              T.JsonName("client_type"),
            ),
            name: Schema.String,
          }),
        ),
      ).pipe(T.JsonName("in_use_by")),
      lastDiscoveryCompletedAt: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_completed_at"),
      ),
      lastDiscoveryCompletedAtV2: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_completed_at_v2"),
      ),
      lastDiscoveryStartedAt: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_started_at"),
      ),
      lastDiscoveryStartedAtV2: Schema.optional(Schema.String).pipe(
        T.JsonName("last_discovery_started_at_v2"),
      ),
      lastUpdated: Schema.optional(Schema.String).pipe(
        T.JsonName("last_updated"),
      ),
    }),
  ),
}) as unknown as Schema.Schema<PatchCloudIntegrationResponse>;

export const patchCloudIntegration: (
  input: PatchCloudIntegrationRequest,
) => Effect.Effect<
  PatchCloudIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchCloudIntegrationRequest,
  output: PatchCloudIntegrationResponse,
  errors: [],
}));

export interface DeleteCloudIntegrationRequest {
  providerId: string;
  accountId: string;
}

export const DeleteCloudIntegrationRequest = Schema.Struct({
  providerId: Schema.String.pipe(T.HttpPath("providerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/magic/cloud/providers/{providerId}",
  }),
) as unknown as Schema.Schema<DeleteCloudIntegrationRequest>;

export interface DeleteCloudIntegrationResponse {
  id: string;
}

export const DeleteCloudIntegrationResponse = Schema.Struct({
  id: Schema.String,
}) as unknown as Schema.Schema<DeleteCloudIntegrationResponse>;

export const deleteCloudIntegration: (
  input: DeleteCloudIntegrationRequest,
) => Effect.Effect<
  DeleteCloudIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteCloudIntegrationRequest,
  output: DeleteCloudIntegrationResponse,
  errors: [],
}));

export interface DiscoverCloudIntegrationRequest {
  providerId: string;
  /** Path param: */
  accountId: string;
  /** Query param: */
  v2?: boolean;
}

export const DiscoverCloudIntegrationRequest = Schema.Struct({
  providerId: Schema.String.pipe(T.HttpPath("providerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  v2: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("v2")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/magic/cloud/providers/{providerId}/discover",
  }),
) as unknown as Schema.Schema<DiscoverCloudIntegrationRequest>;

export interface DiscoverCloudIntegrationResponse {
  errors: {
    code:
      | "1001"
      | "1002"
      | "1003"
      | "1004"
      | "1005"
      | "1006"
      | "1007"
      | "1008"
      | "1009"
      | "1010"
      | "1011"
      | "1012"
      | "1013"
      | "1014"
      | "1015"
      | "1016"
      | "1017"
      | "2001"
      | "2002"
      | "2003"
      | "2004"
      | "2005"
      | "2006"
      | "2007"
      | "2008"
      | "2009"
      | "2010"
      | "2011"
      | "2012"
      | "2013"
      | "2014"
      | "2015"
      | "2016"
      | "2017"
      | "2018"
      | "2019"
      | "2020"
      | "2021"
      | "2022"
      | "3001"
      | "3002"
      | "3003"
      | "3004"
      | "3005"
      | "3006"
      | "3007"
      | "4001"
      | "4002"
      | "4003"
      | "4004"
      | "4005"
      | "4006"
      | "4007"
      | "4008"
      | "4009"
      | "4010"
      | "4011"
      | "4012"
      | "4013"
      | "4014"
      | "4015"
      | "4016"
      | "4017"
      | "4018"
      | "4019"
      | "4020"
      | "4021"
      | "4022"
      | "4023"
      | "5001"
      | "5002"
      | "5003"
      | "5004"
      | "102000"
      | "102001"
      | "102002"
      | "102003"
      | "102004"
      | "102005"
      | "102006"
      | "102007"
      | "102008"
      | "102009"
      | "102010"
      | "102011"
      | "102012"
      | "102013"
      | "102014"
      | "102015"
      | "102016"
      | "102017"
      | "102018"
      | "102019"
      | "102020"
      | "102021"
      | "102022"
      | "102023"
      | "102024"
      | "102025"
      | "102026"
      | "102027"
      | "102028"
      | "102029"
      | "102030"
      | "102031"
      | "102032"
      | "102033"
      | "102034"
      | "102035"
      | "102036"
      | "102037"
      | "102038"
      | "102039"
      | "102040"
      | "102041"
      | "102042"
      | "102043"
      | "102044"
      | "102045"
      | "102046"
      | "102047"
      | "102048"
      | "102049"
      | "102050"
      | "102051"
      | "102052"
      | "102053"
      | "102054"
      | "102055"
      | "102056"
      | "102057"
      | "102058"
      | "102059"
      | "102060"
      | "102061"
      | "102062"
      | "102063"
      | "102064"
      | "102065"
      | "102066"
      | "103001"
      | "103002"
      | "103003"
      | "103004"
      | "103005"
      | "103006"
      | "103007"
      | "103008";
    message: string;
    documentationUrl?: string;
    meta?: {
      l10nKey?: string;
      loggableError?: string;
      templateData?: unknown;
      traceId?: string;
    };
    source?: {
      parameter?: string;
      parameterValueIndex?: number;
      pointer?: string;
    };
  }[];
  messages: {
    code:
      | "1001"
      | "1002"
      | "1003"
      | "1004"
      | "1005"
      | "1006"
      | "1007"
      | "1008"
      | "1009"
      | "1010"
      | "1011"
      | "1012"
      | "1013"
      | "1014"
      | "1015"
      | "1016"
      | "1017"
      | "2001"
      | "2002"
      | "2003"
      | "2004"
      | "2005"
      | "2006"
      | "2007"
      | "2008"
      | "2009"
      | "2010"
      | "2011"
      | "2012"
      | "2013"
      | "2014"
      | "2015"
      | "2016"
      | "2017"
      | "2018"
      | "2019"
      | "2020"
      | "2021"
      | "2022"
      | "3001"
      | "3002"
      | "3003"
      | "3004"
      | "3005"
      | "3006"
      | "3007"
      | "4001"
      | "4002"
      | "4003"
      | "4004"
      | "4005"
      | "4006"
      | "4007"
      | "4008"
      | "4009"
      | "4010"
      | "4011"
      | "4012"
      | "4013"
      | "4014"
      | "4015"
      | "4016"
      | "4017"
      | "4018"
      | "4019"
      | "4020"
      | "4021"
      | "4022"
      | "4023"
      | "5001"
      | "5002"
      | "5003"
      | "5004"
      | "102000"
      | "102001"
      | "102002"
      | "102003"
      | "102004"
      | "102005"
      | "102006"
      | "102007"
      | "102008"
      | "102009"
      | "102010"
      | "102011"
      | "102012"
      | "102013"
      | "102014"
      | "102015"
      | "102016"
      | "102017"
      | "102018"
      | "102019"
      | "102020"
      | "102021"
      | "102022"
      | "102023"
      | "102024"
      | "102025"
      | "102026"
      | "102027"
      | "102028"
      | "102029"
      | "102030"
      | "102031"
      | "102032"
      | "102033"
      | "102034"
      | "102035"
      | "102036"
      | "102037"
      | "102038"
      | "102039"
      | "102040"
      | "102041"
      | "102042"
      | "102043"
      | "102044"
      | "102045"
      | "102046"
      | "102047"
      | "102048"
      | "102049"
      | "102050"
      | "102051"
      | "102052"
      | "102053"
      | "102054"
      | "102055"
      | "102056"
      | "102057"
      | "102058"
      | "102059"
      | "102060"
      | "102061"
      | "102062"
      | "102063"
      | "102064"
      | "102065"
      | "102066"
      | "103001"
      | "103002"
      | "103003"
      | "103004"
      | "103005"
      | "103006"
      | "103007"
      | "103008";
    message: string;
    documentationUrl?: string;
    meta?: {
      l10nKey?: string;
      loggableError?: string;
      templateData?: unknown;
      traceId?: string;
    };
    source?: {
      parameter?: string;
      parameterValueIndex?: number;
      pointer?: string;
    };
  }[];
  success: boolean;
}

export const DiscoverCloudIntegrationResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Literal(
        "1001",
        "1002",
        "1003",
        "1004",
        "1005",
        "1006",
        "1007",
        "1008",
        "1009",
        "1010",
        "1011",
        "1012",
        "1013",
        "1014",
        "1015",
        "1016",
        "1017",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "3001",
        "3002",
        "3003",
        "3004",
        "3005",
        "3006",
        "3007",
        "4001",
        "4002",
        "4003",
        "4004",
        "4005",
        "4006",
        "4007",
        "4008",
        "4009",
        "4010",
        "4011",
        "4012",
        "4013",
        "4014",
        "4015",
        "4016",
        "4017",
        "4018",
        "4019",
        "4020",
        "4021",
        "4022",
        "4023",
        "5001",
        "5002",
        "5003",
        "5004",
        "102000",
        "102001",
        "102002",
        "102003",
        "102004",
        "102005",
        "102006",
        "102007",
        "102008",
        "102009",
        "102010",
        "102011",
        "102012",
        "102013",
        "102014",
        "102015",
        "102016",
        "102017",
        "102018",
        "102019",
        "102020",
        "102021",
        "102022",
        "102023",
        "102024",
        "102025",
        "102026",
        "102027",
        "102028",
        "102029",
        "102030",
        "102031",
        "102032",
        "102033",
        "102034",
        "102035",
        "102036",
        "102037",
        "102038",
        "102039",
        "102040",
        "102041",
        "102042",
        "102043",
        "102044",
        "102045",
        "102046",
        "102047",
        "102048",
        "102049",
        "102050",
        "102051",
        "102052",
        "102053",
        "102054",
        "102055",
        "102056",
        "102057",
        "102058",
        "102059",
        "102060",
        "102061",
        "102062",
        "102063",
        "102064",
        "102065",
        "102066",
        "103001",
        "103002",
        "103003",
        "103004",
        "103005",
        "103006",
        "103007",
        "103008",
      ),
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      meta: Schema.optional(
        Schema.Struct({
          l10nKey: Schema.optional(Schema.String).pipe(T.JsonName("l10n_key")),
          loggableError: Schema.optional(Schema.String).pipe(
            T.JsonName("loggable_error"),
          ),
          templateData: Schema.optional(Schema.Unknown).pipe(
            T.JsonName("template_data"),
          ),
          traceId: Schema.optional(Schema.String).pipe(T.JsonName("trace_id")),
        }),
      ),
      source: Schema.optional(
        Schema.Struct({
          parameter: Schema.optional(Schema.String),
          parameterValueIndex: Schema.optional(Schema.Number).pipe(
            T.JsonName("parameter_value_index"),
          ),
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Literal(
        "1001",
        "1002",
        "1003",
        "1004",
        "1005",
        "1006",
        "1007",
        "1008",
        "1009",
        "1010",
        "1011",
        "1012",
        "1013",
        "1014",
        "1015",
        "1016",
        "1017",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "3001",
        "3002",
        "3003",
        "3004",
        "3005",
        "3006",
        "3007",
        "4001",
        "4002",
        "4003",
        "4004",
        "4005",
        "4006",
        "4007",
        "4008",
        "4009",
        "4010",
        "4011",
        "4012",
        "4013",
        "4014",
        "4015",
        "4016",
        "4017",
        "4018",
        "4019",
        "4020",
        "4021",
        "4022",
        "4023",
        "5001",
        "5002",
        "5003",
        "5004",
        "102000",
        "102001",
        "102002",
        "102003",
        "102004",
        "102005",
        "102006",
        "102007",
        "102008",
        "102009",
        "102010",
        "102011",
        "102012",
        "102013",
        "102014",
        "102015",
        "102016",
        "102017",
        "102018",
        "102019",
        "102020",
        "102021",
        "102022",
        "102023",
        "102024",
        "102025",
        "102026",
        "102027",
        "102028",
        "102029",
        "102030",
        "102031",
        "102032",
        "102033",
        "102034",
        "102035",
        "102036",
        "102037",
        "102038",
        "102039",
        "102040",
        "102041",
        "102042",
        "102043",
        "102044",
        "102045",
        "102046",
        "102047",
        "102048",
        "102049",
        "102050",
        "102051",
        "102052",
        "102053",
        "102054",
        "102055",
        "102056",
        "102057",
        "102058",
        "102059",
        "102060",
        "102061",
        "102062",
        "102063",
        "102064",
        "102065",
        "102066",
        "103001",
        "103002",
        "103003",
        "103004",
        "103005",
        "103006",
        "103007",
        "103008",
      ),
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      meta: Schema.optional(
        Schema.Struct({
          l10nKey: Schema.optional(Schema.String).pipe(T.JsonName("l10n_key")),
          loggableError: Schema.optional(Schema.String).pipe(
            T.JsonName("loggable_error"),
          ),
          templateData: Schema.optional(Schema.Unknown).pipe(
            T.JsonName("template_data"),
          ),
          traceId: Schema.optional(Schema.String).pipe(T.JsonName("trace_id")),
        }),
      ),
      source: Schema.optional(
        Schema.Struct({
          parameter: Schema.optional(Schema.String),
          parameterValueIndex: Schema.optional(Schema.Number).pipe(
            T.JsonName("parameter_value_index"),
          ),
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Boolean,
}) as unknown as Schema.Schema<DiscoverCloudIntegrationResponse>;

export const discoverCloudIntegration: (
  input: DiscoverCloudIntegrationRequest,
) => Effect.Effect<
  DiscoverCloudIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DiscoverCloudIntegrationRequest,
  output: DiscoverCloudIntegrationResponse,
  errors: [],
}));

// =============================================================================
// OnRamp
// =============================================================================

export interface GetOnRampRequest {
  onrampId: string;
  /** Path param: */
  accountId: string;
  /** Query param: */
  plannedResources?: boolean;
  /** Query param: */
  postApplyResources?: boolean;
  /** Query param: */
  status?: boolean;
  /** Query param: */
  vpcs?: boolean;
}

export const GetOnRampRequest = Schema.Struct({
  onrampId: Schema.String.pipe(T.HttpPath("onrampId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  plannedResources: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("planned_resources"),
  ),
  postApplyResources: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("post_apply_resources"),
  ),
  status: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("status")),
  vpcs: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("vpcs")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/magic/cloud/onramps/{onrampId}",
  }),
) as unknown as Schema.Schema<GetOnRampRequest>;

export interface GetOnRampResponse {
  id: string;
  cloudType: "AWS" | "AZURE" | "GOOGLE";
  installRoutesInCloud: boolean;
  installRoutesInMagicWan: boolean;
  name: string;
  type: "OnrampTypeSingle" | "OnrampTypeHub";
  updatedAt: string;
  attachedHubs?: string[];
  attachedVpcs?: string[];
  description?: string;
  hub?: string;
  lastAppliedAt?: string;
  lastExportedAt?: string;
  lastPlannedAt?: string;
  manageHubToHubAttachments?: boolean;
  manageVpcToHubAttachments?: boolean;
  plannedMonthlyCostEstimate?: {
    currency: string;
    currentMonthlyCost: number;
    diff: number;
    proposedMonthlyCost: number;
  };
  plannedResources?: {
    diff: {
      diff: string;
      leftDescription: string;
      leftYaml: string;
      rightDescription: string;
      rightYaml: string;
    };
    keysRequireReplace: string[];
    monthlyCostEstimateDiff: {
      currency: string;
      currentMonthlyCost: number;
      diff: number;
      proposedMonthlyCost: number;
    };
    plannedAction: "no_op" | "create" | "update" | "replace" | "destroy";
    resource: {
      id: string;
      cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
      detail: string;
      name: string;
      resourceType:
        | "aws_customer_gateway"
        | "aws_egress_only_internet_gateway"
        | "aws_internet_gateway"
        | "aws_instance"
        | "aws_network_interface"
        | "aws_route"
        | "aws_route_table"
        | "aws_route_table_association"
        | "aws_subnet"
        | "aws_vpc"
        | "aws_vpc_ipv4_cidr_block_association"
        | "aws_vpn_connection"
        | "aws_vpn_connection_route"
        | "aws_vpn_gateway"
        | "aws_security_group"
        | "aws_vpc_security_group_ingress_rule"
        | "aws_vpc_security_group_egress_rule"
        | "aws_ec2_managed_prefix_list"
        | "aws_ec2_transit_gateway"
        | "aws_ec2_transit_gateway_prefix_list_reference"
        | "aws_ec2_transit_gateway_vpc_attachment"
        | "azurerm_application_security_group"
        | "azurerm_lb"
        | "azurerm_lb_backend_address_pool"
        | "azurerm_lb_nat_pool"
        | "azurerm_lb_nat_rule"
        | "azurerm_lb_rule"
        | "azurerm_local_network_gateway"
        | "azurerm_network_interface"
        | "azurerm_network_interface_application_security_group_association"
        | "azurerm_network_interface_backend_address_pool_association"
        | "azurerm_network_interface_security_group_association"
        | "azurerm_network_security_group"
        | "azurerm_public_ip"
        | "azurerm_route"
        | "azurerm_route_table"
        | "azurerm_subnet"
        | "azurerm_subnet_route_table_association"
        | "azurerm_virtual_machine"
        | "azurerm_virtual_network_gateway_connection"
        | "azurerm_virtual_network"
        | "azurerm_virtual_network_gateway"
        | "google_compute_network"
        | "google_compute_subnetwork"
        | "google_compute_vpn_gateway"
        | "google_compute_vpn_tunnel"
        | "google_compute_route"
        | "google_compute_address"
        | "google_compute_global_address"
        | "google_compute_router"
        | "google_compute_interconnect_attachment"
        | "google_compute_ha_vpn_gateway"
        | "google_compute_forwarding_rule"
        | "google_compute_network_firewall_policy"
        | "google_compute_network_firewall_policy_rule"
        | "cloudflare_static_route"
        | "cloudflare_ipsec_tunnel";
      title: string;
    };
  }[];
  plannedResourcesUnavailable?: boolean;
  postApplyMonthlyCostEstimate?: { currency: string; monthlyCost: number };
  postApplyResources?: Record<string, unknown>;
  postApplyResourcesUnavailable?: boolean;
  region?: string;
  status?: {
    applyProgress: { done: number; total: number };
    lifecycleState:
      | "OnrampNeedsApply"
      | "OnrampPendingPlan"
      | "OnrampPlanning"
      | "OnrampPlanFailed"
      | "OnrampPendingApproval"
      | "OnrampPendingApply"
      | "OnrampApplying"
      | "OnrampApplyFailed"
      | "OnrampActive"
      | "OnrampPendingDestroy"
      | "OnrampDestroying"
      | "OnrampDestroyFailed";
    planProgress: { done: number; total: number };
    routes: string[];
    tunnels: string[];
    lifecycleErrors?: Record<string, unknown>;
  };
  vpc?: string;
  vpcsById?: Record<string, unknown>;
  /** The list of vpc IDs for which resource details failed to generate. */
  vpcsByIdUnavailable?: string[];
}

export const GetOnRampResponse = Schema.Struct({
  id: Schema.String,
  cloudType: Schema.Literal("AWS", "AZURE", "GOOGLE").pipe(
    T.JsonName("cloud_type"),
  ),
  installRoutesInCloud: Schema.Boolean.pipe(
    T.JsonName("install_routes_in_cloud"),
  ),
  installRoutesInMagicWan: Schema.Boolean.pipe(
    T.JsonName("install_routes_in_magic_wan"),
  ),
  name: Schema.String,
  type: Schema.Literal("OnrampTypeSingle", "OnrampTypeHub"),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  attachedHubs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_hubs"),
  ),
  attachedVpcs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_vpcs"),
  ),
  description: Schema.optional(Schema.String),
  hub: Schema.optional(Schema.String),
  lastAppliedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_applied_at"),
  ),
  lastExportedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_exported_at"),
  ),
  lastPlannedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_planned_at"),
  ),
  manageHubToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_hub_to_hub_attachments"),
  ),
  manageVpcToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_vpc_to_hub_attachments"),
  ),
  plannedMonthlyCostEstimate: Schema.optional(
    Schema.Struct({
      currency: Schema.String,
      currentMonthlyCost: Schema.Number.pipe(
        T.JsonName("current_monthly_cost"),
      ),
      diff: Schema.Number,
      proposedMonthlyCost: Schema.Number.pipe(
        T.JsonName("proposed_monthly_cost"),
      ),
    }),
  ).pipe(T.JsonName("planned_monthly_cost_estimate")),
  plannedResources: Schema.optional(
    Schema.Array(
      Schema.Struct({
        diff: Schema.Struct({
          diff: Schema.String,
          leftDescription: Schema.String.pipe(T.JsonName("left_description")),
          leftYaml: Schema.String.pipe(T.JsonName("left_yaml")),
          rightDescription: Schema.String.pipe(T.JsonName("right_description")),
          rightYaml: Schema.String.pipe(T.JsonName("right_yaml")),
        }),
        keysRequireReplace: Schema.Array(Schema.String).pipe(
          T.JsonName("keys_require_replace"),
        ),
        monthlyCostEstimateDiff: Schema.Struct({
          currency: Schema.String,
          currentMonthlyCost: Schema.Number.pipe(
            T.JsonName("current_monthly_cost"),
          ),
          diff: Schema.Number,
          proposedMonthlyCost: Schema.Number.pipe(
            T.JsonName("proposed_monthly_cost"),
          ),
        }).pipe(T.JsonName("monthly_cost_estimate_diff")),
        plannedAction: Schema.Literal(
          "no_op",
          "create",
          "update",
          "replace",
          "destroy",
        ).pipe(T.JsonName("planned_action")),
        resource: Schema.Struct({
          id: Schema.String,
          cloudType: Schema.Literal(
            "AWS",
            "AZURE",
            "GOOGLE",
            "CLOUDFLARE",
          ).pipe(T.JsonName("cloud_type")),
          detail: Schema.String,
          name: Schema.String,
          resourceType: Schema.Literal(
            "aws_customer_gateway",
            "aws_egress_only_internet_gateway",
            "aws_internet_gateway",
            "aws_instance",
            "aws_network_interface",
            "aws_route",
            "aws_route_table",
            "aws_route_table_association",
            "aws_subnet",
            "aws_vpc",
            "aws_vpc_ipv4_cidr_block_association",
            "aws_vpn_connection",
            "aws_vpn_connection_route",
            "aws_vpn_gateway",
            "aws_security_group",
            "aws_vpc_security_group_ingress_rule",
            "aws_vpc_security_group_egress_rule",
            "aws_ec2_managed_prefix_list",
            "aws_ec2_transit_gateway",
            "aws_ec2_transit_gateway_prefix_list_reference",
            "aws_ec2_transit_gateway_vpc_attachment",
            "azurerm_application_security_group",
            "azurerm_lb",
            "azurerm_lb_backend_address_pool",
            "azurerm_lb_nat_pool",
            "azurerm_lb_nat_rule",
            "azurerm_lb_rule",
            "azurerm_local_network_gateway",
            "azurerm_network_interface",
            "azurerm_network_interface_application_security_group_association",
            "azurerm_network_interface_backend_address_pool_association",
            "azurerm_network_interface_security_group_association",
            "azurerm_network_security_group",
            "azurerm_public_ip",
            "azurerm_route",
            "azurerm_route_table",
            "azurerm_subnet",
            "azurerm_subnet_route_table_association",
            "azurerm_virtual_machine",
            "azurerm_virtual_network_gateway_connection",
            "azurerm_virtual_network",
            "azurerm_virtual_network_gateway",
            "google_compute_network",
            "google_compute_subnetwork",
            "google_compute_vpn_gateway",
            "google_compute_vpn_tunnel",
            "google_compute_route",
            "google_compute_address",
            "google_compute_global_address",
            "google_compute_router",
            "google_compute_interconnect_attachment",
            "google_compute_ha_vpn_gateway",
            "google_compute_forwarding_rule",
            "google_compute_network_firewall_policy",
            "google_compute_network_firewall_policy_rule",
            "cloudflare_static_route",
            "cloudflare_ipsec_tunnel",
          ).pipe(T.JsonName("resource_type")),
          title: Schema.String,
        }),
      }),
    ),
  ).pipe(T.JsonName("planned_resources")),
  plannedResourcesUnavailable: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("planned_resources_unavailable"),
  ),
  postApplyMonthlyCostEstimate: Schema.optional(
    Schema.Struct({
      currency: Schema.String,
      monthlyCost: Schema.Number.pipe(T.JsonName("monthly_cost")),
    }),
  ).pipe(T.JsonName("post_apply_monthly_cost_estimate")),
  postApplyResources: Schema.optional(Schema.Struct({})).pipe(
    T.JsonName("post_apply_resources"),
  ),
  postApplyResourcesUnavailable: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("post_apply_resources_unavailable"),
  ),
  region: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Struct({
      applyProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
      }).pipe(T.JsonName("apply_progress")),
      lifecycleState: Schema.Literal(
        "OnrampNeedsApply",
        "OnrampPendingPlan",
        "OnrampPlanning",
        "OnrampPlanFailed",
        "OnrampPendingApproval",
        "OnrampPendingApply",
        "OnrampApplying",
        "OnrampApplyFailed",
        "OnrampActive",
        "OnrampPendingDestroy",
        "OnrampDestroying",
        "OnrampDestroyFailed",
      ).pipe(T.JsonName("lifecycle_state")),
      planProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
      }).pipe(T.JsonName("plan_progress")),
      routes: Schema.Array(Schema.String),
      tunnels: Schema.Array(Schema.String),
      lifecycleErrors: Schema.optional(Schema.Struct({})).pipe(
        T.JsonName("lifecycle_errors"),
      ),
    }),
  ),
  vpc: Schema.optional(Schema.String),
  vpcsById: Schema.optional(Schema.Struct({})).pipe(T.JsonName("vpcs_by_id")),
  vpcsByIdUnavailable: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("vpcs_by_id_unavailable"),
  ),
}) as unknown as Schema.Schema<GetOnRampResponse>;

export const getOnRamp: (
  input: GetOnRampRequest,
) => Effect.Effect<
  GetOnRampResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetOnRampRequest,
  output: GetOnRampResponse,
  errors: [],
}));

export interface CreateOnRampRequest {
  /** Path param: */
  accountId: string;
  /** Header param: */
  forwarded?: string;
  /** Body param: */
  cloudType: "AWS" | "AZURE" | "GOOGLE";
  /** Body param: */
  installRoutesInCloud: boolean;
  /** Body param: */
  installRoutesInMagicWan: boolean;
  /** Body param: */
  name: string;
  /** Body param: */
  type: "OnrampTypeSingle" | "OnrampTypeHub";
  /** Body param: */
  adoptedHubId?: string;
  /** Body param: */
  attachedHubs?: string[];
  /** Body param: */
  attachedVpcs?: string[];
  /** Body param: */
  description?: string;
  /** Body param: */
  hubProviderId?: string;
  /** Body param: */
  manageHubToHubAttachments?: boolean;
  /** Body param: */
  manageVpcToHubAttachments?: boolean;
  /** Body param: */
  region?: string;
  /** Body param: */
  vpc?: string;
}

export const CreateOnRampRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  forwarded: Schema.optional(Schema.String).pipe(T.HttpHeader("forwarded")),
  cloudType: Schema.Literal("AWS", "AZURE", "GOOGLE").pipe(
    T.JsonName("cloud_type"),
  ),
  installRoutesInCloud: Schema.Boolean.pipe(
    T.JsonName("install_routes_in_cloud"),
  ),
  installRoutesInMagicWan: Schema.Boolean.pipe(
    T.JsonName("install_routes_in_magic_wan"),
  ),
  name: Schema.String,
  type: Schema.Literal("OnrampTypeSingle", "OnrampTypeHub"),
  adoptedHubId: Schema.optional(Schema.String).pipe(
    T.JsonName("adopted_hub_id"),
  ),
  attachedHubs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_hubs"),
  ),
  attachedVpcs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_vpcs"),
  ),
  description: Schema.optional(Schema.String),
  hubProviderId: Schema.optional(Schema.String).pipe(
    T.JsonName("hub_provider_id"),
  ),
  manageHubToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_hub_to_hub_attachments"),
  ),
  manageVpcToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_vpc_to_hub_attachments"),
  ),
  region: Schema.optional(Schema.String),
  vpc: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/magic/cloud/onramps",
  }),
) as unknown as Schema.Schema<CreateOnRampRequest>;

export interface CreateOnRampResponse {
  id: string;
  cloudType: "AWS" | "AZURE" | "GOOGLE";
  installRoutesInCloud: boolean;
  installRoutesInMagicWan: boolean;
  name: string;
  type: "OnrampTypeSingle" | "OnrampTypeHub";
  updatedAt: string;
  attachedHubs?: string[];
  attachedVpcs?: string[];
  description?: string;
  hub?: string;
  lastAppliedAt?: string;
  lastExportedAt?: string;
  lastPlannedAt?: string;
  manageHubToHubAttachments?: boolean;
  manageVpcToHubAttachments?: boolean;
  plannedMonthlyCostEstimate?: {
    currency: string;
    currentMonthlyCost: number;
    diff: number;
    proposedMonthlyCost: number;
  };
  plannedResources?: {
    diff: {
      diff: string;
      leftDescription: string;
      leftYaml: string;
      rightDescription: string;
      rightYaml: string;
    };
    keysRequireReplace: string[];
    monthlyCostEstimateDiff: {
      currency: string;
      currentMonthlyCost: number;
      diff: number;
      proposedMonthlyCost: number;
    };
    plannedAction: "no_op" | "create" | "update" | "replace" | "destroy";
    resource: {
      id: string;
      cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
      detail: string;
      name: string;
      resourceType:
        | "aws_customer_gateway"
        | "aws_egress_only_internet_gateway"
        | "aws_internet_gateway"
        | "aws_instance"
        | "aws_network_interface"
        | "aws_route"
        | "aws_route_table"
        | "aws_route_table_association"
        | "aws_subnet"
        | "aws_vpc"
        | "aws_vpc_ipv4_cidr_block_association"
        | "aws_vpn_connection"
        | "aws_vpn_connection_route"
        | "aws_vpn_gateway"
        | "aws_security_group"
        | "aws_vpc_security_group_ingress_rule"
        | "aws_vpc_security_group_egress_rule"
        | "aws_ec2_managed_prefix_list"
        | "aws_ec2_transit_gateway"
        | "aws_ec2_transit_gateway_prefix_list_reference"
        | "aws_ec2_transit_gateway_vpc_attachment"
        | "azurerm_application_security_group"
        | "azurerm_lb"
        | "azurerm_lb_backend_address_pool"
        | "azurerm_lb_nat_pool"
        | "azurerm_lb_nat_rule"
        | "azurerm_lb_rule"
        | "azurerm_local_network_gateway"
        | "azurerm_network_interface"
        | "azurerm_network_interface_application_security_group_association"
        | "azurerm_network_interface_backend_address_pool_association"
        | "azurerm_network_interface_security_group_association"
        | "azurerm_network_security_group"
        | "azurerm_public_ip"
        | "azurerm_route"
        | "azurerm_route_table"
        | "azurerm_subnet"
        | "azurerm_subnet_route_table_association"
        | "azurerm_virtual_machine"
        | "azurerm_virtual_network_gateway_connection"
        | "azurerm_virtual_network"
        | "azurerm_virtual_network_gateway"
        | "google_compute_network"
        | "google_compute_subnetwork"
        | "google_compute_vpn_gateway"
        | "google_compute_vpn_tunnel"
        | "google_compute_route"
        | "google_compute_address"
        | "google_compute_global_address"
        | "google_compute_router"
        | "google_compute_interconnect_attachment"
        | "google_compute_ha_vpn_gateway"
        | "google_compute_forwarding_rule"
        | "google_compute_network_firewall_policy"
        | "google_compute_network_firewall_policy_rule"
        | "cloudflare_static_route"
        | "cloudflare_ipsec_tunnel";
      title: string;
    };
  }[];
  plannedResourcesUnavailable?: boolean;
  postApplyMonthlyCostEstimate?: { currency: string; monthlyCost: number };
  postApplyResources?: Record<string, unknown>;
  postApplyResourcesUnavailable?: boolean;
  region?: string;
  status?: {
    applyProgress: { done: number; total: number };
    lifecycleState:
      | "OnrampNeedsApply"
      | "OnrampPendingPlan"
      | "OnrampPlanning"
      | "OnrampPlanFailed"
      | "OnrampPendingApproval"
      | "OnrampPendingApply"
      | "OnrampApplying"
      | "OnrampApplyFailed"
      | "OnrampActive"
      | "OnrampPendingDestroy"
      | "OnrampDestroying"
      | "OnrampDestroyFailed";
    planProgress: { done: number; total: number };
    routes: string[];
    tunnels: string[];
    lifecycleErrors?: Record<string, unknown>;
  };
  vpc?: string;
  vpcsById?: Record<string, unknown>;
  /** The list of vpc IDs for which resource details failed to generate. */
  vpcsByIdUnavailable?: string[];
}

export const CreateOnRampResponse = Schema.Struct({
  id: Schema.String,
  cloudType: Schema.Literal("AWS", "AZURE", "GOOGLE").pipe(
    T.JsonName("cloud_type"),
  ),
  installRoutesInCloud: Schema.Boolean.pipe(
    T.JsonName("install_routes_in_cloud"),
  ),
  installRoutesInMagicWan: Schema.Boolean.pipe(
    T.JsonName("install_routes_in_magic_wan"),
  ),
  name: Schema.String,
  type: Schema.Literal("OnrampTypeSingle", "OnrampTypeHub"),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  attachedHubs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_hubs"),
  ),
  attachedVpcs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_vpcs"),
  ),
  description: Schema.optional(Schema.String),
  hub: Schema.optional(Schema.String),
  lastAppliedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_applied_at"),
  ),
  lastExportedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_exported_at"),
  ),
  lastPlannedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_planned_at"),
  ),
  manageHubToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_hub_to_hub_attachments"),
  ),
  manageVpcToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_vpc_to_hub_attachments"),
  ),
  plannedMonthlyCostEstimate: Schema.optional(
    Schema.Struct({
      currency: Schema.String,
      currentMonthlyCost: Schema.Number.pipe(
        T.JsonName("current_monthly_cost"),
      ),
      diff: Schema.Number,
      proposedMonthlyCost: Schema.Number.pipe(
        T.JsonName("proposed_monthly_cost"),
      ),
    }),
  ).pipe(T.JsonName("planned_monthly_cost_estimate")),
  plannedResources: Schema.optional(
    Schema.Array(
      Schema.Struct({
        diff: Schema.Struct({
          diff: Schema.String,
          leftDescription: Schema.String.pipe(T.JsonName("left_description")),
          leftYaml: Schema.String.pipe(T.JsonName("left_yaml")),
          rightDescription: Schema.String.pipe(T.JsonName("right_description")),
          rightYaml: Schema.String.pipe(T.JsonName("right_yaml")),
        }),
        keysRequireReplace: Schema.Array(Schema.String).pipe(
          T.JsonName("keys_require_replace"),
        ),
        monthlyCostEstimateDiff: Schema.Struct({
          currency: Schema.String,
          currentMonthlyCost: Schema.Number.pipe(
            T.JsonName("current_monthly_cost"),
          ),
          diff: Schema.Number,
          proposedMonthlyCost: Schema.Number.pipe(
            T.JsonName("proposed_monthly_cost"),
          ),
        }).pipe(T.JsonName("monthly_cost_estimate_diff")),
        plannedAction: Schema.Literal(
          "no_op",
          "create",
          "update",
          "replace",
          "destroy",
        ).pipe(T.JsonName("planned_action")),
        resource: Schema.Struct({
          id: Schema.String,
          cloudType: Schema.Literal(
            "AWS",
            "AZURE",
            "GOOGLE",
            "CLOUDFLARE",
          ).pipe(T.JsonName("cloud_type")),
          detail: Schema.String,
          name: Schema.String,
          resourceType: Schema.Literal(
            "aws_customer_gateway",
            "aws_egress_only_internet_gateway",
            "aws_internet_gateway",
            "aws_instance",
            "aws_network_interface",
            "aws_route",
            "aws_route_table",
            "aws_route_table_association",
            "aws_subnet",
            "aws_vpc",
            "aws_vpc_ipv4_cidr_block_association",
            "aws_vpn_connection",
            "aws_vpn_connection_route",
            "aws_vpn_gateway",
            "aws_security_group",
            "aws_vpc_security_group_ingress_rule",
            "aws_vpc_security_group_egress_rule",
            "aws_ec2_managed_prefix_list",
            "aws_ec2_transit_gateway",
            "aws_ec2_transit_gateway_prefix_list_reference",
            "aws_ec2_transit_gateway_vpc_attachment",
            "azurerm_application_security_group",
            "azurerm_lb",
            "azurerm_lb_backend_address_pool",
            "azurerm_lb_nat_pool",
            "azurerm_lb_nat_rule",
            "azurerm_lb_rule",
            "azurerm_local_network_gateway",
            "azurerm_network_interface",
            "azurerm_network_interface_application_security_group_association",
            "azurerm_network_interface_backend_address_pool_association",
            "azurerm_network_interface_security_group_association",
            "azurerm_network_security_group",
            "azurerm_public_ip",
            "azurerm_route",
            "azurerm_route_table",
            "azurerm_subnet",
            "azurerm_subnet_route_table_association",
            "azurerm_virtual_machine",
            "azurerm_virtual_network_gateway_connection",
            "azurerm_virtual_network",
            "azurerm_virtual_network_gateway",
            "google_compute_network",
            "google_compute_subnetwork",
            "google_compute_vpn_gateway",
            "google_compute_vpn_tunnel",
            "google_compute_route",
            "google_compute_address",
            "google_compute_global_address",
            "google_compute_router",
            "google_compute_interconnect_attachment",
            "google_compute_ha_vpn_gateway",
            "google_compute_forwarding_rule",
            "google_compute_network_firewall_policy",
            "google_compute_network_firewall_policy_rule",
            "cloudflare_static_route",
            "cloudflare_ipsec_tunnel",
          ).pipe(T.JsonName("resource_type")),
          title: Schema.String,
        }),
      }),
    ),
  ).pipe(T.JsonName("planned_resources")),
  plannedResourcesUnavailable: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("planned_resources_unavailable"),
  ),
  postApplyMonthlyCostEstimate: Schema.optional(
    Schema.Struct({
      currency: Schema.String,
      monthlyCost: Schema.Number.pipe(T.JsonName("monthly_cost")),
    }),
  ).pipe(T.JsonName("post_apply_monthly_cost_estimate")),
  postApplyResources: Schema.optional(Schema.Struct({})).pipe(
    T.JsonName("post_apply_resources"),
  ),
  postApplyResourcesUnavailable: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("post_apply_resources_unavailable"),
  ),
  region: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Struct({
      applyProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
      }).pipe(T.JsonName("apply_progress")),
      lifecycleState: Schema.Literal(
        "OnrampNeedsApply",
        "OnrampPendingPlan",
        "OnrampPlanning",
        "OnrampPlanFailed",
        "OnrampPendingApproval",
        "OnrampPendingApply",
        "OnrampApplying",
        "OnrampApplyFailed",
        "OnrampActive",
        "OnrampPendingDestroy",
        "OnrampDestroying",
        "OnrampDestroyFailed",
      ).pipe(T.JsonName("lifecycle_state")),
      planProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
      }).pipe(T.JsonName("plan_progress")),
      routes: Schema.Array(Schema.String),
      tunnels: Schema.Array(Schema.String),
      lifecycleErrors: Schema.optional(Schema.Struct({})).pipe(
        T.JsonName("lifecycle_errors"),
      ),
    }),
  ),
  vpc: Schema.optional(Schema.String),
  vpcsById: Schema.optional(Schema.Struct({})).pipe(T.JsonName("vpcs_by_id")),
  vpcsByIdUnavailable: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("vpcs_by_id_unavailable"),
  ),
}) as unknown as Schema.Schema<CreateOnRampResponse>;

export const createOnRamp: (
  input: CreateOnRampRequest,
) => Effect.Effect<
  CreateOnRampResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateOnRampRequest,
  output: CreateOnRampResponse,
  errors: [],
}));

export interface UpdateOnRampRequest {
  onrampId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  attachedHubs?: string[];
  /** Body param: */
  attachedVpcs?: string[];
  /** Body param: */
  description?: string;
  /** Body param: */
  installRoutesInCloud?: boolean;
  /** Body param: */
  installRoutesInMagicWan?: boolean;
  /** Body param: */
  manageHubToHubAttachments?: boolean;
  /** Body param: */
  manageVpcToHubAttachments?: boolean;
  /** Body param: */
  name?: string;
  /** Body param: */
  vpc?: string;
}

export const UpdateOnRampRequest = Schema.Struct({
  onrampId: Schema.String.pipe(T.HttpPath("onrampId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  attachedHubs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_hubs"),
  ),
  attachedVpcs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_vpcs"),
  ),
  description: Schema.optional(Schema.String),
  installRoutesInCloud: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("install_routes_in_cloud"),
  ),
  installRoutesInMagicWan: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("install_routes_in_magic_wan"),
  ),
  manageHubToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_hub_to_hub_attachments"),
  ),
  manageVpcToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_vpc_to_hub_attachments"),
  ),
  name: Schema.optional(Schema.String),
  vpc: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/magic/cloud/onramps/{onrampId}",
  }),
) as unknown as Schema.Schema<UpdateOnRampRequest>;

export interface UpdateOnRampResponse {
  id: string;
  cloudType: "AWS" | "AZURE" | "GOOGLE";
  installRoutesInCloud: boolean;
  installRoutesInMagicWan: boolean;
  name: string;
  type: "OnrampTypeSingle" | "OnrampTypeHub";
  updatedAt: string;
  attachedHubs?: string[];
  attachedVpcs?: string[];
  description?: string;
  hub?: string;
  lastAppliedAt?: string;
  lastExportedAt?: string;
  lastPlannedAt?: string;
  manageHubToHubAttachments?: boolean;
  manageVpcToHubAttachments?: boolean;
  plannedMonthlyCostEstimate?: {
    currency: string;
    currentMonthlyCost: number;
    diff: number;
    proposedMonthlyCost: number;
  };
  plannedResources?: {
    diff: {
      diff: string;
      leftDescription: string;
      leftYaml: string;
      rightDescription: string;
      rightYaml: string;
    };
    keysRequireReplace: string[];
    monthlyCostEstimateDiff: {
      currency: string;
      currentMonthlyCost: number;
      diff: number;
      proposedMonthlyCost: number;
    };
    plannedAction: "no_op" | "create" | "update" | "replace" | "destroy";
    resource: {
      id: string;
      cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
      detail: string;
      name: string;
      resourceType:
        | "aws_customer_gateway"
        | "aws_egress_only_internet_gateway"
        | "aws_internet_gateway"
        | "aws_instance"
        | "aws_network_interface"
        | "aws_route"
        | "aws_route_table"
        | "aws_route_table_association"
        | "aws_subnet"
        | "aws_vpc"
        | "aws_vpc_ipv4_cidr_block_association"
        | "aws_vpn_connection"
        | "aws_vpn_connection_route"
        | "aws_vpn_gateway"
        | "aws_security_group"
        | "aws_vpc_security_group_ingress_rule"
        | "aws_vpc_security_group_egress_rule"
        | "aws_ec2_managed_prefix_list"
        | "aws_ec2_transit_gateway"
        | "aws_ec2_transit_gateway_prefix_list_reference"
        | "aws_ec2_transit_gateway_vpc_attachment"
        | "azurerm_application_security_group"
        | "azurerm_lb"
        | "azurerm_lb_backend_address_pool"
        | "azurerm_lb_nat_pool"
        | "azurerm_lb_nat_rule"
        | "azurerm_lb_rule"
        | "azurerm_local_network_gateway"
        | "azurerm_network_interface"
        | "azurerm_network_interface_application_security_group_association"
        | "azurerm_network_interface_backend_address_pool_association"
        | "azurerm_network_interface_security_group_association"
        | "azurerm_network_security_group"
        | "azurerm_public_ip"
        | "azurerm_route"
        | "azurerm_route_table"
        | "azurerm_subnet"
        | "azurerm_subnet_route_table_association"
        | "azurerm_virtual_machine"
        | "azurerm_virtual_network_gateway_connection"
        | "azurerm_virtual_network"
        | "azurerm_virtual_network_gateway"
        | "google_compute_network"
        | "google_compute_subnetwork"
        | "google_compute_vpn_gateway"
        | "google_compute_vpn_tunnel"
        | "google_compute_route"
        | "google_compute_address"
        | "google_compute_global_address"
        | "google_compute_router"
        | "google_compute_interconnect_attachment"
        | "google_compute_ha_vpn_gateway"
        | "google_compute_forwarding_rule"
        | "google_compute_network_firewall_policy"
        | "google_compute_network_firewall_policy_rule"
        | "cloudflare_static_route"
        | "cloudflare_ipsec_tunnel";
      title: string;
    };
  }[];
  plannedResourcesUnavailable?: boolean;
  postApplyMonthlyCostEstimate?: { currency: string; monthlyCost: number };
  postApplyResources?: Record<string, unknown>;
  postApplyResourcesUnavailable?: boolean;
  region?: string;
  status?: {
    applyProgress: { done: number; total: number };
    lifecycleState:
      | "OnrampNeedsApply"
      | "OnrampPendingPlan"
      | "OnrampPlanning"
      | "OnrampPlanFailed"
      | "OnrampPendingApproval"
      | "OnrampPendingApply"
      | "OnrampApplying"
      | "OnrampApplyFailed"
      | "OnrampActive"
      | "OnrampPendingDestroy"
      | "OnrampDestroying"
      | "OnrampDestroyFailed";
    planProgress: { done: number; total: number };
    routes: string[];
    tunnels: string[];
    lifecycleErrors?: Record<string, unknown>;
  };
  vpc?: string;
  vpcsById?: Record<string, unknown>;
  /** The list of vpc IDs for which resource details failed to generate. */
  vpcsByIdUnavailable?: string[];
}

export const UpdateOnRampResponse = Schema.Struct({
  id: Schema.String,
  cloudType: Schema.Literal("AWS", "AZURE", "GOOGLE").pipe(
    T.JsonName("cloud_type"),
  ),
  installRoutesInCloud: Schema.Boolean.pipe(
    T.JsonName("install_routes_in_cloud"),
  ),
  installRoutesInMagicWan: Schema.Boolean.pipe(
    T.JsonName("install_routes_in_magic_wan"),
  ),
  name: Schema.String,
  type: Schema.Literal("OnrampTypeSingle", "OnrampTypeHub"),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  attachedHubs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_hubs"),
  ),
  attachedVpcs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_vpcs"),
  ),
  description: Schema.optional(Schema.String),
  hub: Schema.optional(Schema.String),
  lastAppliedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_applied_at"),
  ),
  lastExportedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_exported_at"),
  ),
  lastPlannedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_planned_at"),
  ),
  manageHubToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_hub_to_hub_attachments"),
  ),
  manageVpcToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_vpc_to_hub_attachments"),
  ),
  plannedMonthlyCostEstimate: Schema.optional(
    Schema.Struct({
      currency: Schema.String,
      currentMonthlyCost: Schema.Number.pipe(
        T.JsonName("current_monthly_cost"),
      ),
      diff: Schema.Number,
      proposedMonthlyCost: Schema.Number.pipe(
        T.JsonName("proposed_monthly_cost"),
      ),
    }),
  ).pipe(T.JsonName("planned_monthly_cost_estimate")),
  plannedResources: Schema.optional(
    Schema.Array(
      Schema.Struct({
        diff: Schema.Struct({
          diff: Schema.String,
          leftDescription: Schema.String.pipe(T.JsonName("left_description")),
          leftYaml: Schema.String.pipe(T.JsonName("left_yaml")),
          rightDescription: Schema.String.pipe(T.JsonName("right_description")),
          rightYaml: Schema.String.pipe(T.JsonName("right_yaml")),
        }),
        keysRequireReplace: Schema.Array(Schema.String).pipe(
          T.JsonName("keys_require_replace"),
        ),
        monthlyCostEstimateDiff: Schema.Struct({
          currency: Schema.String,
          currentMonthlyCost: Schema.Number.pipe(
            T.JsonName("current_monthly_cost"),
          ),
          diff: Schema.Number,
          proposedMonthlyCost: Schema.Number.pipe(
            T.JsonName("proposed_monthly_cost"),
          ),
        }).pipe(T.JsonName("monthly_cost_estimate_diff")),
        plannedAction: Schema.Literal(
          "no_op",
          "create",
          "update",
          "replace",
          "destroy",
        ).pipe(T.JsonName("planned_action")),
        resource: Schema.Struct({
          id: Schema.String,
          cloudType: Schema.Literal(
            "AWS",
            "AZURE",
            "GOOGLE",
            "CLOUDFLARE",
          ).pipe(T.JsonName("cloud_type")),
          detail: Schema.String,
          name: Schema.String,
          resourceType: Schema.Literal(
            "aws_customer_gateway",
            "aws_egress_only_internet_gateway",
            "aws_internet_gateway",
            "aws_instance",
            "aws_network_interface",
            "aws_route",
            "aws_route_table",
            "aws_route_table_association",
            "aws_subnet",
            "aws_vpc",
            "aws_vpc_ipv4_cidr_block_association",
            "aws_vpn_connection",
            "aws_vpn_connection_route",
            "aws_vpn_gateway",
            "aws_security_group",
            "aws_vpc_security_group_ingress_rule",
            "aws_vpc_security_group_egress_rule",
            "aws_ec2_managed_prefix_list",
            "aws_ec2_transit_gateway",
            "aws_ec2_transit_gateway_prefix_list_reference",
            "aws_ec2_transit_gateway_vpc_attachment",
            "azurerm_application_security_group",
            "azurerm_lb",
            "azurerm_lb_backend_address_pool",
            "azurerm_lb_nat_pool",
            "azurerm_lb_nat_rule",
            "azurerm_lb_rule",
            "azurerm_local_network_gateway",
            "azurerm_network_interface",
            "azurerm_network_interface_application_security_group_association",
            "azurerm_network_interface_backend_address_pool_association",
            "azurerm_network_interface_security_group_association",
            "azurerm_network_security_group",
            "azurerm_public_ip",
            "azurerm_route",
            "azurerm_route_table",
            "azurerm_subnet",
            "azurerm_subnet_route_table_association",
            "azurerm_virtual_machine",
            "azurerm_virtual_network_gateway_connection",
            "azurerm_virtual_network",
            "azurerm_virtual_network_gateway",
            "google_compute_network",
            "google_compute_subnetwork",
            "google_compute_vpn_gateway",
            "google_compute_vpn_tunnel",
            "google_compute_route",
            "google_compute_address",
            "google_compute_global_address",
            "google_compute_router",
            "google_compute_interconnect_attachment",
            "google_compute_ha_vpn_gateway",
            "google_compute_forwarding_rule",
            "google_compute_network_firewall_policy",
            "google_compute_network_firewall_policy_rule",
            "cloudflare_static_route",
            "cloudflare_ipsec_tunnel",
          ).pipe(T.JsonName("resource_type")),
          title: Schema.String,
        }),
      }),
    ),
  ).pipe(T.JsonName("planned_resources")),
  plannedResourcesUnavailable: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("planned_resources_unavailable"),
  ),
  postApplyMonthlyCostEstimate: Schema.optional(
    Schema.Struct({
      currency: Schema.String,
      monthlyCost: Schema.Number.pipe(T.JsonName("monthly_cost")),
    }),
  ).pipe(T.JsonName("post_apply_monthly_cost_estimate")),
  postApplyResources: Schema.optional(Schema.Struct({})).pipe(
    T.JsonName("post_apply_resources"),
  ),
  postApplyResourcesUnavailable: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("post_apply_resources_unavailable"),
  ),
  region: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Struct({
      applyProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
      }).pipe(T.JsonName("apply_progress")),
      lifecycleState: Schema.Literal(
        "OnrampNeedsApply",
        "OnrampPendingPlan",
        "OnrampPlanning",
        "OnrampPlanFailed",
        "OnrampPendingApproval",
        "OnrampPendingApply",
        "OnrampApplying",
        "OnrampApplyFailed",
        "OnrampActive",
        "OnrampPendingDestroy",
        "OnrampDestroying",
        "OnrampDestroyFailed",
      ).pipe(T.JsonName("lifecycle_state")),
      planProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
      }).pipe(T.JsonName("plan_progress")),
      routes: Schema.Array(Schema.String),
      tunnels: Schema.Array(Schema.String),
      lifecycleErrors: Schema.optional(Schema.Struct({})).pipe(
        T.JsonName("lifecycle_errors"),
      ),
    }),
  ),
  vpc: Schema.optional(Schema.String),
  vpcsById: Schema.optional(Schema.Struct({})).pipe(T.JsonName("vpcs_by_id")),
  vpcsByIdUnavailable: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("vpcs_by_id_unavailable"),
  ),
}) as unknown as Schema.Schema<UpdateOnRampResponse>;

export const updateOnRamp: (
  input: UpdateOnRampRequest,
) => Effect.Effect<
  UpdateOnRampResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateOnRampRequest,
  output: UpdateOnRampResponse,
  errors: [],
}));

export interface PatchOnRampRequest {
  onrampId: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  attachedHubs?: string[];
  /** Body param: */
  attachedVpcs?: string[];
  /** Body param: */
  description?: string;
  /** Body param: */
  installRoutesInCloud?: boolean;
  /** Body param: */
  installRoutesInMagicWan?: boolean;
  /** Body param: */
  manageHubToHubAttachments?: boolean;
  /** Body param: */
  manageVpcToHubAttachments?: boolean;
  /** Body param: */
  name?: string;
  /** Body param: */
  vpc?: string;
}

export const PatchOnRampRequest = Schema.Struct({
  onrampId: Schema.String.pipe(T.HttpPath("onrampId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  attachedHubs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_hubs"),
  ),
  attachedVpcs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_vpcs"),
  ),
  description: Schema.optional(Schema.String),
  installRoutesInCloud: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("install_routes_in_cloud"),
  ),
  installRoutesInMagicWan: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("install_routes_in_magic_wan"),
  ),
  manageHubToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_hub_to_hub_attachments"),
  ),
  manageVpcToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_vpc_to_hub_attachments"),
  ),
  name: Schema.optional(Schema.String),
  vpc: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/magic/cloud/onramps/{onrampId}",
  }),
) as unknown as Schema.Schema<PatchOnRampRequest>;

export interface PatchOnRampResponse {
  id: string;
  cloudType: "AWS" | "AZURE" | "GOOGLE";
  installRoutesInCloud: boolean;
  installRoutesInMagicWan: boolean;
  name: string;
  type: "OnrampTypeSingle" | "OnrampTypeHub";
  updatedAt: string;
  attachedHubs?: string[];
  attachedVpcs?: string[];
  description?: string;
  hub?: string;
  lastAppliedAt?: string;
  lastExportedAt?: string;
  lastPlannedAt?: string;
  manageHubToHubAttachments?: boolean;
  manageVpcToHubAttachments?: boolean;
  plannedMonthlyCostEstimate?: {
    currency: string;
    currentMonthlyCost: number;
    diff: number;
    proposedMonthlyCost: number;
  };
  plannedResources?: {
    diff: {
      diff: string;
      leftDescription: string;
      leftYaml: string;
      rightDescription: string;
      rightYaml: string;
    };
    keysRequireReplace: string[];
    monthlyCostEstimateDiff: {
      currency: string;
      currentMonthlyCost: number;
      diff: number;
      proposedMonthlyCost: number;
    };
    plannedAction: "no_op" | "create" | "update" | "replace" | "destroy";
    resource: {
      id: string;
      cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
      detail: string;
      name: string;
      resourceType:
        | "aws_customer_gateway"
        | "aws_egress_only_internet_gateway"
        | "aws_internet_gateway"
        | "aws_instance"
        | "aws_network_interface"
        | "aws_route"
        | "aws_route_table"
        | "aws_route_table_association"
        | "aws_subnet"
        | "aws_vpc"
        | "aws_vpc_ipv4_cidr_block_association"
        | "aws_vpn_connection"
        | "aws_vpn_connection_route"
        | "aws_vpn_gateway"
        | "aws_security_group"
        | "aws_vpc_security_group_ingress_rule"
        | "aws_vpc_security_group_egress_rule"
        | "aws_ec2_managed_prefix_list"
        | "aws_ec2_transit_gateway"
        | "aws_ec2_transit_gateway_prefix_list_reference"
        | "aws_ec2_transit_gateway_vpc_attachment"
        | "azurerm_application_security_group"
        | "azurerm_lb"
        | "azurerm_lb_backend_address_pool"
        | "azurerm_lb_nat_pool"
        | "azurerm_lb_nat_rule"
        | "azurerm_lb_rule"
        | "azurerm_local_network_gateway"
        | "azurerm_network_interface"
        | "azurerm_network_interface_application_security_group_association"
        | "azurerm_network_interface_backend_address_pool_association"
        | "azurerm_network_interface_security_group_association"
        | "azurerm_network_security_group"
        | "azurerm_public_ip"
        | "azurerm_route"
        | "azurerm_route_table"
        | "azurerm_subnet"
        | "azurerm_subnet_route_table_association"
        | "azurerm_virtual_machine"
        | "azurerm_virtual_network_gateway_connection"
        | "azurerm_virtual_network"
        | "azurerm_virtual_network_gateway"
        | "google_compute_network"
        | "google_compute_subnetwork"
        | "google_compute_vpn_gateway"
        | "google_compute_vpn_tunnel"
        | "google_compute_route"
        | "google_compute_address"
        | "google_compute_global_address"
        | "google_compute_router"
        | "google_compute_interconnect_attachment"
        | "google_compute_ha_vpn_gateway"
        | "google_compute_forwarding_rule"
        | "google_compute_network_firewall_policy"
        | "google_compute_network_firewall_policy_rule"
        | "cloudflare_static_route"
        | "cloudflare_ipsec_tunnel";
      title: string;
    };
  }[];
  plannedResourcesUnavailable?: boolean;
  postApplyMonthlyCostEstimate?: { currency: string; monthlyCost: number };
  postApplyResources?: Record<string, unknown>;
  postApplyResourcesUnavailable?: boolean;
  region?: string;
  status?: {
    applyProgress: { done: number; total: number };
    lifecycleState:
      | "OnrampNeedsApply"
      | "OnrampPendingPlan"
      | "OnrampPlanning"
      | "OnrampPlanFailed"
      | "OnrampPendingApproval"
      | "OnrampPendingApply"
      | "OnrampApplying"
      | "OnrampApplyFailed"
      | "OnrampActive"
      | "OnrampPendingDestroy"
      | "OnrampDestroying"
      | "OnrampDestroyFailed";
    planProgress: { done: number; total: number };
    routes: string[];
    tunnels: string[];
    lifecycleErrors?: Record<string, unknown>;
  };
  vpc?: string;
  vpcsById?: Record<string, unknown>;
  /** The list of vpc IDs for which resource details failed to generate. */
  vpcsByIdUnavailable?: string[];
}

export const PatchOnRampResponse = Schema.Struct({
  id: Schema.String,
  cloudType: Schema.Literal("AWS", "AZURE", "GOOGLE").pipe(
    T.JsonName("cloud_type"),
  ),
  installRoutesInCloud: Schema.Boolean.pipe(
    T.JsonName("install_routes_in_cloud"),
  ),
  installRoutesInMagicWan: Schema.Boolean.pipe(
    T.JsonName("install_routes_in_magic_wan"),
  ),
  name: Schema.String,
  type: Schema.Literal("OnrampTypeSingle", "OnrampTypeHub"),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  attachedHubs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_hubs"),
  ),
  attachedVpcs: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("attached_vpcs"),
  ),
  description: Schema.optional(Schema.String),
  hub: Schema.optional(Schema.String),
  lastAppliedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_applied_at"),
  ),
  lastExportedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_exported_at"),
  ),
  lastPlannedAt: Schema.optional(Schema.String).pipe(
    T.JsonName("last_planned_at"),
  ),
  manageHubToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_hub_to_hub_attachments"),
  ),
  manageVpcToHubAttachments: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("manage_vpc_to_hub_attachments"),
  ),
  plannedMonthlyCostEstimate: Schema.optional(
    Schema.Struct({
      currency: Schema.String,
      currentMonthlyCost: Schema.Number.pipe(
        T.JsonName("current_monthly_cost"),
      ),
      diff: Schema.Number,
      proposedMonthlyCost: Schema.Number.pipe(
        T.JsonName("proposed_monthly_cost"),
      ),
    }),
  ).pipe(T.JsonName("planned_monthly_cost_estimate")),
  plannedResources: Schema.optional(
    Schema.Array(
      Schema.Struct({
        diff: Schema.Struct({
          diff: Schema.String,
          leftDescription: Schema.String.pipe(T.JsonName("left_description")),
          leftYaml: Schema.String.pipe(T.JsonName("left_yaml")),
          rightDescription: Schema.String.pipe(T.JsonName("right_description")),
          rightYaml: Schema.String.pipe(T.JsonName("right_yaml")),
        }),
        keysRequireReplace: Schema.Array(Schema.String).pipe(
          T.JsonName("keys_require_replace"),
        ),
        monthlyCostEstimateDiff: Schema.Struct({
          currency: Schema.String,
          currentMonthlyCost: Schema.Number.pipe(
            T.JsonName("current_monthly_cost"),
          ),
          diff: Schema.Number,
          proposedMonthlyCost: Schema.Number.pipe(
            T.JsonName("proposed_monthly_cost"),
          ),
        }).pipe(T.JsonName("monthly_cost_estimate_diff")),
        plannedAction: Schema.Literal(
          "no_op",
          "create",
          "update",
          "replace",
          "destroy",
        ).pipe(T.JsonName("planned_action")),
        resource: Schema.Struct({
          id: Schema.String,
          cloudType: Schema.Literal(
            "AWS",
            "AZURE",
            "GOOGLE",
            "CLOUDFLARE",
          ).pipe(T.JsonName("cloud_type")),
          detail: Schema.String,
          name: Schema.String,
          resourceType: Schema.Literal(
            "aws_customer_gateway",
            "aws_egress_only_internet_gateway",
            "aws_internet_gateway",
            "aws_instance",
            "aws_network_interface",
            "aws_route",
            "aws_route_table",
            "aws_route_table_association",
            "aws_subnet",
            "aws_vpc",
            "aws_vpc_ipv4_cidr_block_association",
            "aws_vpn_connection",
            "aws_vpn_connection_route",
            "aws_vpn_gateway",
            "aws_security_group",
            "aws_vpc_security_group_ingress_rule",
            "aws_vpc_security_group_egress_rule",
            "aws_ec2_managed_prefix_list",
            "aws_ec2_transit_gateway",
            "aws_ec2_transit_gateway_prefix_list_reference",
            "aws_ec2_transit_gateway_vpc_attachment",
            "azurerm_application_security_group",
            "azurerm_lb",
            "azurerm_lb_backend_address_pool",
            "azurerm_lb_nat_pool",
            "azurerm_lb_nat_rule",
            "azurerm_lb_rule",
            "azurerm_local_network_gateway",
            "azurerm_network_interface",
            "azurerm_network_interface_application_security_group_association",
            "azurerm_network_interface_backend_address_pool_association",
            "azurerm_network_interface_security_group_association",
            "azurerm_network_security_group",
            "azurerm_public_ip",
            "azurerm_route",
            "azurerm_route_table",
            "azurerm_subnet",
            "azurerm_subnet_route_table_association",
            "azurerm_virtual_machine",
            "azurerm_virtual_network_gateway_connection",
            "azurerm_virtual_network",
            "azurerm_virtual_network_gateway",
            "google_compute_network",
            "google_compute_subnetwork",
            "google_compute_vpn_gateway",
            "google_compute_vpn_tunnel",
            "google_compute_route",
            "google_compute_address",
            "google_compute_global_address",
            "google_compute_router",
            "google_compute_interconnect_attachment",
            "google_compute_ha_vpn_gateway",
            "google_compute_forwarding_rule",
            "google_compute_network_firewall_policy",
            "google_compute_network_firewall_policy_rule",
            "cloudflare_static_route",
            "cloudflare_ipsec_tunnel",
          ).pipe(T.JsonName("resource_type")),
          title: Schema.String,
        }),
      }),
    ),
  ).pipe(T.JsonName("planned_resources")),
  plannedResourcesUnavailable: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("planned_resources_unavailable"),
  ),
  postApplyMonthlyCostEstimate: Schema.optional(
    Schema.Struct({
      currency: Schema.String,
      monthlyCost: Schema.Number.pipe(T.JsonName("monthly_cost")),
    }),
  ).pipe(T.JsonName("post_apply_monthly_cost_estimate")),
  postApplyResources: Schema.optional(Schema.Struct({})).pipe(
    T.JsonName("post_apply_resources"),
  ),
  postApplyResourcesUnavailable: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("post_apply_resources_unavailable"),
  ),
  region: Schema.optional(Schema.String),
  status: Schema.optional(
    Schema.Struct({
      applyProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
      }).pipe(T.JsonName("apply_progress")),
      lifecycleState: Schema.Literal(
        "OnrampNeedsApply",
        "OnrampPendingPlan",
        "OnrampPlanning",
        "OnrampPlanFailed",
        "OnrampPendingApproval",
        "OnrampPendingApply",
        "OnrampApplying",
        "OnrampApplyFailed",
        "OnrampActive",
        "OnrampPendingDestroy",
        "OnrampDestroying",
        "OnrampDestroyFailed",
      ).pipe(T.JsonName("lifecycle_state")),
      planProgress: Schema.Struct({
        done: Schema.Number,
        total: Schema.Number,
      }).pipe(T.JsonName("plan_progress")),
      routes: Schema.Array(Schema.String),
      tunnels: Schema.Array(Schema.String),
      lifecycleErrors: Schema.optional(Schema.Struct({})).pipe(
        T.JsonName("lifecycle_errors"),
      ),
    }),
  ),
  vpc: Schema.optional(Schema.String),
  vpcsById: Schema.optional(Schema.Struct({})).pipe(T.JsonName("vpcs_by_id")),
  vpcsByIdUnavailable: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.JsonName("vpcs_by_id_unavailable"),
  ),
}) as unknown as Schema.Schema<PatchOnRampResponse>;

export const patchOnRamp: (
  input: PatchOnRampRequest,
) => Effect.Effect<
  PatchOnRampResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchOnRampRequest,
  output: PatchOnRampResponse,
  errors: [],
}));

export interface DeleteOnRampRequest {
  onrampId: string;
  /** Path param: */
  accountId: string;
  /** Query param: */
  destroy?: boolean;
  /** Query param: */
  force?: boolean;
}

export const DeleteOnRampRequest = Schema.Struct({
  onrampId: Schema.String.pipe(T.HttpPath("onrampId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  destroy: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("destroy")),
  force: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("force")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/magic/cloud/onramps/{onrampId}",
  }),
) as unknown as Schema.Schema<DeleteOnRampRequest>;

export interface DeleteOnRampResponse {
  id: string;
}

export const DeleteOnRampResponse = Schema.Struct({
  id: Schema.String,
}) as unknown as Schema.Schema<DeleteOnRampResponse>;

export const deleteOnRamp: (
  input: DeleteOnRampRequest,
) => Effect.Effect<
  DeleteOnRampResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteOnRampRequest,
  output: DeleteOnRampResponse,
  errors: [],
}));

export interface ApplyOnRampRequest {
  onrampId: string;
  accountId: string;
}

export const ApplyOnRampRequest = Schema.Struct({
  onrampId: Schema.String.pipe(T.HttpPath("onrampId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/magic/cloud/onramps/{onrampId}/apply",
  }),
) as unknown as Schema.Schema<ApplyOnRampRequest>;

export interface ApplyOnRampResponse {
  errors: {
    code:
      | "1001"
      | "1002"
      | "1003"
      | "1004"
      | "1005"
      | "1006"
      | "1007"
      | "1008"
      | "1009"
      | "1010"
      | "1011"
      | "1012"
      | "1013"
      | "1014"
      | "1015"
      | "1016"
      | "1017"
      | "2001"
      | "2002"
      | "2003"
      | "2004"
      | "2005"
      | "2006"
      | "2007"
      | "2008"
      | "2009"
      | "2010"
      | "2011"
      | "2012"
      | "2013"
      | "2014"
      | "2015"
      | "2016"
      | "2017"
      | "2018"
      | "2019"
      | "2020"
      | "2021"
      | "2022"
      | "3001"
      | "3002"
      | "3003"
      | "3004"
      | "3005"
      | "3006"
      | "3007"
      | "4001"
      | "4002"
      | "4003"
      | "4004"
      | "4005"
      | "4006"
      | "4007"
      | "4008"
      | "4009"
      | "4010"
      | "4011"
      | "4012"
      | "4013"
      | "4014"
      | "4015"
      | "4016"
      | "4017"
      | "4018"
      | "4019"
      | "4020"
      | "4021"
      | "4022"
      | "4023"
      | "5001"
      | "5002"
      | "5003"
      | "5004"
      | "102000"
      | "102001"
      | "102002"
      | "102003"
      | "102004"
      | "102005"
      | "102006"
      | "102007"
      | "102008"
      | "102009"
      | "102010"
      | "102011"
      | "102012"
      | "102013"
      | "102014"
      | "102015"
      | "102016"
      | "102017"
      | "102018"
      | "102019"
      | "102020"
      | "102021"
      | "102022"
      | "102023"
      | "102024"
      | "102025"
      | "102026"
      | "102027"
      | "102028"
      | "102029"
      | "102030"
      | "102031"
      | "102032"
      | "102033"
      | "102034"
      | "102035"
      | "102036"
      | "102037"
      | "102038"
      | "102039"
      | "102040"
      | "102041"
      | "102042"
      | "102043"
      | "102044"
      | "102045"
      | "102046"
      | "102047"
      | "102048"
      | "102049"
      | "102050"
      | "102051"
      | "102052"
      | "102053"
      | "102054"
      | "102055"
      | "102056"
      | "102057"
      | "102058"
      | "102059"
      | "102060"
      | "102061"
      | "102062"
      | "102063"
      | "102064"
      | "102065"
      | "102066"
      | "103001"
      | "103002"
      | "103003"
      | "103004"
      | "103005"
      | "103006"
      | "103007"
      | "103008";
    message: string;
    documentationUrl?: string;
    meta?: {
      l10nKey?: string;
      loggableError?: string;
      templateData?: unknown;
      traceId?: string;
    };
    source?: {
      parameter?: string;
      parameterValueIndex?: number;
      pointer?: string;
    };
  }[];
  messages: {
    code:
      | "1001"
      | "1002"
      | "1003"
      | "1004"
      | "1005"
      | "1006"
      | "1007"
      | "1008"
      | "1009"
      | "1010"
      | "1011"
      | "1012"
      | "1013"
      | "1014"
      | "1015"
      | "1016"
      | "1017"
      | "2001"
      | "2002"
      | "2003"
      | "2004"
      | "2005"
      | "2006"
      | "2007"
      | "2008"
      | "2009"
      | "2010"
      | "2011"
      | "2012"
      | "2013"
      | "2014"
      | "2015"
      | "2016"
      | "2017"
      | "2018"
      | "2019"
      | "2020"
      | "2021"
      | "2022"
      | "3001"
      | "3002"
      | "3003"
      | "3004"
      | "3005"
      | "3006"
      | "3007"
      | "4001"
      | "4002"
      | "4003"
      | "4004"
      | "4005"
      | "4006"
      | "4007"
      | "4008"
      | "4009"
      | "4010"
      | "4011"
      | "4012"
      | "4013"
      | "4014"
      | "4015"
      | "4016"
      | "4017"
      | "4018"
      | "4019"
      | "4020"
      | "4021"
      | "4022"
      | "4023"
      | "5001"
      | "5002"
      | "5003"
      | "5004"
      | "102000"
      | "102001"
      | "102002"
      | "102003"
      | "102004"
      | "102005"
      | "102006"
      | "102007"
      | "102008"
      | "102009"
      | "102010"
      | "102011"
      | "102012"
      | "102013"
      | "102014"
      | "102015"
      | "102016"
      | "102017"
      | "102018"
      | "102019"
      | "102020"
      | "102021"
      | "102022"
      | "102023"
      | "102024"
      | "102025"
      | "102026"
      | "102027"
      | "102028"
      | "102029"
      | "102030"
      | "102031"
      | "102032"
      | "102033"
      | "102034"
      | "102035"
      | "102036"
      | "102037"
      | "102038"
      | "102039"
      | "102040"
      | "102041"
      | "102042"
      | "102043"
      | "102044"
      | "102045"
      | "102046"
      | "102047"
      | "102048"
      | "102049"
      | "102050"
      | "102051"
      | "102052"
      | "102053"
      | "102054"
      | "102055"
      | "102056"
      | "102057"
      | "102058"
      | "102059"
      | "102060"
      | "102061"
      | "102062"
      | "102063"
      | "102064"
      | "102065"
      | "102066"
      | "103001"
      | "103002"
      | "103003"
      | "103004"
      | "103005"
      | "103006"
      | "103007"
      | "103008";
    message: string;
    documentationUrl?: string;
    meta?: {
      l10nKey?: string;
      loggableError?: string;
      templateData?: unknown;
      traceId?: string;
    };
    source?: {
      parameter?: string;
      parameterValueIndex?: number;
      pointer?: string;
    };
  }[];
  success: boolean;
}

export const ApplyOnRampResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Literal(
        "1001",
        "1002",
        "1003",
        "1004",
        "1005",
        "1006",
        "1007",
        "1008",
        "1009",
        "1010",
        "1011",
        "1012",
        "1013",
        "1014",
        "1015",
        "1016",
        "1017",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "3001",
        "3002",
        "3003",
        "3004",
        "3005",
        "3006",
        "3007",
        "4001",
        "4002",
        "4003",
        "4004",
        "4005",
        "4006",
        "4007",
        "4008",
        "4009",
        "4010",
        "4011",
        "4012",
        "4013",
        "4014",
        "4015",
        "4016",
        "4017",
        "4018",
        "4019",
        "4020",
        "4021",
        "4022",
        "4023",
        "5001",
        "5002",
        "5003",
        "5004",
        "102000",
        "102001",
        "102002",
        "102003",
        "102004",
        "102005",
        "102006",
        "102007",
        "102008",
        "102009",
        "102010",
        "102011",
        "102012",
        "102013",
        "102014",
        "102015",
        "102016",
        "102017",
        "102018",
        "102019",
        "102020",
        "102021",
        "102022",
        "102023",
        "102024",
        "102025",
        "102026",
        "102027",
        "102028",
        "102029",
        "102030",
        "102031",
        "102032",
        "102033",
        "102034",
        "102035",
        "102036",
        "102037",
        "102038",
        "102039",
        "102040",
        "102041",
        "102042",
        "102043",
        "102044",
        "102045",
        "102046",
        "102047",
        "102048",
        "102049",
        "102050",
        "102051",
        "102052",
        "102053",
        "102054",
        "102055",
        "102056",
        "102057",
        "102058",
        "102059",
        "102060",
        "102061",
        "102062",
        "102063",
        "102064",
        "102065",
        "102066",
        "103001",
        "103002",
        "103003",
        "103004",
        "103005",
        "103006",
        "103007",
        "103008",
      ),
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      meta: Schema.optional(
        Schema.Struct({
          l10nKey: Schema.optional(Schema.String).pipe(T.JsonName("l10n_key")),
          loggableError: Schema.optional(Schema.String).pipe(
            T.JsonName("loggable_error"),
          ),
          templateData: Schema.optional(Schema.Unknown).pipe(
            T.JsonName("template_data"),
          ),
          traceId: Schema.optional(Schema.String).pipe(T.JsonName("trace_id")),
        }),
      ),
      source: Schema.optional(
        Schema.Struct({
          parameter: Schema.optional(Schema.String),
          parameterValueIndex: Schema.optional(Schema.Number).pipe(
            T.JsonName("parameter_value_index"),
          ),
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Literal(
        "1001",
        "1002",
        "1003",
        "1004",
        "1005",
        "1006",
        "1007",
        "1008",
        "1009",
        "1010",
        "1011",
        "1012",
        "1013",
        "1014",
        "1015",
        "1016",
        "1017",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "3001",
        "3002",
        "3003",
        "3004",
        "3005",
        "3006",
        "3007",
        "4001",
        "4002",
        "4003",
        "4004",
        "4005",
        "4006",
        "4007",
        "4008",
        "4009",
        "4010",
        "4011",
        "4012",
        "4013",
        "4014",
        "4015",
        "4016",
        "4017",
        "4018",
        "4019",
        "4020",
        "4021",
        "4022",
        "4023",
        "5001",
        "5002",
        "5003",
        "5004",
        "102000",
        "102001",
        "102002",
        "102003",
        "102004",
        "102005",
        "102006",
        "102007",
        "102008",
        "102009",
        "102010",
        "102011",
        "102012",
        "102013",
        "102014",
        "102015",
        "102016",
        "102017",
        "102018",
        "102019",
        "102020",
        "102021",
        "102022",
        "102023",
        "102024",
        "102025",
        "102026",
        "102027",
        "102028",
        "102029",
        "102030",
        "102031",
        "102032",
        "102033",
        "102034",
        "102035",
        "102036",
        "102037",
        "102038",
        "102039",
        "102040",
        "102041",
        "102042",
        "102043",
        "102044",
        "102045",
        "102046",
        "102047",
        "102048",
        "102049",
        "102050",
        "102051",
        "102052",
        "102053",
        "102054",
        "102055",
        "102056",
        "102057",
        "102058",
        "102059",
        "102060",
        "102061",
        "102062",
        "102063",
        "102064",
        "102065",
        "102066",
        "103001",
        "103002",
        "103003",
        "103004",
        "103005",
        "103006",
        "103007",
        "103008",
      ),
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      meta: Schema.optional(
        Schema.Struct({
          l10nKey: Schema.optional(Schema.String).pipe(T.JsonName("l10n_key")),
          loggableError: Schema.optional(Schema.String).pipe(
            T.JsonName("loggable_error"),
          ),
          templateData: Schema.optional(Schema.Unknown).pipe(
            T.JsonName("template_data"),
          ),
          traceId: Schema.optional(Schema.String).pipe(T.JsonName("trace_id")),
        }),
      ),
      source: Schema.optional(
        Schema.Struct({
          parameter: Schema.optional(Schema.String),
          parameterValueIndex: Schema.optional(Schema.Number).pipe(
            T.JsonName("parameter_value_index"),
          ),
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Boolean,
}) as unknown as Schema.Schema<ApplyOnRampResponse>;

export const applyOnRamp: (
  input: ApplyOnRampRequest,
) => Effect.Effect<
  ApplyOnRampResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ApplyOnRampRequest,
  output: ApplyOnRampResponse,
  errors: [],
}));

export interface ExportOnRampRequest {
  onrampId: string;
  accountId: string;
}

export const ExportOnRampRequest = Schema.Struct({
  onrampId: Schema.String.pipe(T.HttpPath("onrampId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/magic/cloud/onramps/{onrampId}/export",
  }),
) as unknown as Schema.Schema<ExportOnRampRequest>;

export type ExportOnRampResponse = unknown;

export const ExportOnRampResponse =
  Schema.Unknown as unknown as Schema.Schema<ExportOnRampResponse>;

export const exportOnRamp: (
  input: ExportOnRampRequest,
) => Effect.Effect<
  ExportOnRampResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ExportOnRampRequest,
  output: ExportOnRampResponse,
  errors: [],
}));

export interface PlanOnRampRequest {
  onrampId: string;
  accountId: string;
}

export const PlanOnRampRequest = Schema.Struct({
  onrampId: Schema.String.pipe(T.HttpPath("onrampId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/magic/cloud/onramps/{onrampId}/plan",
  }),
) as unknown as Schema.Schema<PlanOnRampRequest>;

export interface PlanOnRampResponse {
  errors: {
    code:
      | "1001"
      | "1002"
      | "1003"
      | "1004"
      | "1005"
      | "1006"
      | "1007"
      | "1008"
      | "1009"
      | "1010"
      | "1011"
      | "1012"
      | "1013"
      | "1014"
      | "1015"
      | "1016"
      | "1017"
      | "2001"
      | "2002"
      | "2003"
      | "2004"
      | "2005"
      | "2006"
      | "2007"
      | "2008"
      | "2009"
      | "2010"
      | "2011"
      | "2012"
      | "2013"
      | "2014"
      | "2015"
      | "2016"
      | "2017"
      | "2018"
      | "2019"
      | "2020"
      | "2021"
      | "2022"
      | "3001"
      | "3002"
      | "3003"
      | "3004"
      | "3005"
      | "3006"
      | "3007"
      | "4001"
      | "4002"
      | "4003"
      | "4004"
      | "4005"
      | "4006"
      | "4007"
      | "4008"
      | "4009"
      | "4010"
      | "4011"
      | "4012"
      | "4013"
      | "4014"
      | "4015"
      | "4016"
      | "4017"
      | "4018"
      | "4019"
      | "4020"
      | "4021"
      | "4022"
      | "4023"
      | "5001"
      | "5002"
      | "5003"
      | "5004"
      | "102000"
      | "102001"
      | "102002"
      | "102003"
      | "102004"
      | "102005"
      | "102006"
      | "102007"
      | "102008"
      | "102009"
      | "102010"
      | "102011"
      | "102012"
      | "102013"
      | "102014"
      | "102015"
      | "102016"
      | "102017"
      | "102018"
      | "102019"
      | "102020"
      | "102021"
      | "102022"
      | "102023"
      | "102024"
      | "102025"
      | "102026"
      | "102027"
      | "102028"
      | "102029"
      | "102030"
      | "102031"
      | "102032"
      | "102033"
      | "102034"
      | "102035"
      | "102036"
      | "102037"
      | "102038"
      | "102039"
      | "102040"
      | "102041"
      | "102042"
      | "102043"
      | "102044"
      | "102045"
      | "102046"
      | "102047"
      | "102048"
      | "102049"
      | "102050"
      | "102051"
      | "102052"
      | "102053"
      | "102054"
      | "102055"
      | "102056"
      | "102057"
      | "102058"
      | "102059"
      | "102060"
      | "102061"
      | "102062"
      | "102063"
      | "102064"
      | "102065"
      | "102066"
      | "103001"
      | "103002"
      | "103003"
      | "103004"
      | "103005"
      | "103006"
      | "103007"
      | "103008";
    message: string;
    documentationUrl?: string;
    meta?: {
      l10nKey?: string;
      loggableError?: string;
      templateData?: unknown;
      traceId?: string;
    };
    source?: {
      parameter?: string;
      parameterValueIndex?: number;
      pointer?: string;
    };
  }[];
  messages: {
    code:
      | "1001"
      | "1002"
      | "1003"
      | "1004"
      | "1005"
      | "1006"
      | "1007"
      | "1008"
      | "1009"
      | "1010"
      | "1011"
      | "1012"
      | "1013"
      | "1014"
      | "1015"
      | "1016"
      | "1017"
      | "2001"
      | "2002"
      | "2003"
      | "2004"
      | "2005"
      | "2006"
      | "2007"
      | "2008"
      | "2009"
      | "2010"
      | "2011"
      | "2012"
      | "2013"
      | "2014"
      | "2015"
      | "2016"
      | "2017"
      | "2018"
      | "2019"
      | "2020"
      | "2021"
      | "2022"
      | "3001"
      | "3002"
      | "3003"
      | "3004"
      | "3005"
      | "3006"
      | "3007"
      | "4001"
      | "4002"
      | "4003"
      | "4004"
      | "4005"
      | "4006"
      | "4007"
      | "4008"
      | "4009"
      | "4010"
      | "4011"
      | "4012"
      | "4013"
      | "4014"
      | "4015"
      | "4016"
      | "4017"
      | "4018"
      | "4019"
      | "4020"
      | "4021"
      | "4022"
      | "4023"
      | "5001"
      | "5002"
      | "5003"
      | "5004"
      | "102000"
      | "102001"
      | "102002"
      | "102003"
      | "102004"
      | "102005"
      | "102006"
      | "102007"
      | "102008"
      | "102009"
      | "102010"
      | "102011"
      | "102012"
      | "102013"
      | "102014"
      | "102015"
      | "102016"
      | "102017"
      | "102018"
      | "102019"
      | "102020"
      | "102021"
      | "102022"
      | "102023"
      | "102024"
      | "102025"
      | "102026"
      | "102027"
      | "102028"
      | "102029"
      | "102030"
      | "102031"
      | "102032"
      | "102033"
      | "102034"
      | "102035"
      | "102036"
      | "102037"
      | "102038"
      | "102039"
      | "102040"
      | "102041"
      | "102042"
      | "102043"
      | "102044"
      | "102045"
      | "102046"
      | "102047"
      | "102048"
      | "102049"
      | "102050"
      | "102051"
      | "102052"
      | "102053"
      | "102054"
      | "102055"
      | "102056"
      | "102057"
      | "102058"
      | "102059"
      | "102060"
      | "102061"
      | "102062"
      | "102063"
      | "102064"
      | "102065"
      | "102066"
      | "103001"
      | "103002"
      | "103003"
      | "103004"
      | "103005"
      | "103006"
      | "103007"
      | "103008";
    message: string;
    documentationUrl?: string;
    meta?: {
      l10nKey?: string;
      loggableError?: string;
      templateData?: unknown;
      traceId?: string;
    };
    source?: {
      parameter?: string;
      parameterValueIndex?: number;
      pointer?: string;
    };
  }[];
  success: boolean;
}

export const PlanOnRampResponse = Schema.Struct({
  errors: Schema.Array(
    Schema.Struct({
      code: Schema.Literal(
        "1001",
        "1002",
        "1003",
        "1004",
        "1005",
        "1006",
        "1007",
        "1008",
        "1009",
        "1010",
        "1011",
        "1012",
        "1013",
        "1014",
        "1015",
        "1016",
        "1017",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "3001",
        "3002",
        "3003",
        "3004",
        "3005",
        "3006",
        "3007",
        "4001",
        "4002",
        "4003",
        "4004",
        "4005",
        "4006",
        "4007",
        "4008",
        "4009",
        "4010",
        "4011",
        "4012",
        "4013",
        "4014",
        "4015",
        "4016",
        "4017",
        "4018",
        "4019",
        "4020",
        "4021",
        "4022",
        "4023",
        "5001",
        "5002",
        "5003",
        "5004",
        "102000",
        "102001",
        "102002",
        "102003",
        "102004",
        "102005",
        "102006",
        "102007",
        "102008",
        "102009",
        "102010",
        "102011",
        "102012",
        "102013",
        "102014",
        "102015",
        "102016",
        "102017",
        "102018",
        "102019",
        "102020",
        "102021",
        "102022",
        "102023",
        "102024",
        "102025",
        "102026",
        "102027",
        "102028",
        "102029",
        "102030",
        "102031",
        "102032",
        "102033",
        "102034",
        "102035",
        "102036",
        "102037",
        "102038",
        "102039",
        "102040",
        "102041",
        "102042",
        "102043",
        "102044",
        "102045",
        "102046",
        "102047",
        "102048",
        "102049",
        "102050",
        "102051",
        "102052",
        "102053",
        "102054",
        "102055",
        "102056",
        "102057",
        "102058",
        "102059",
        "102060",
        "102061",
        "102062",
        "102063",
        "102064",
        "102065",
        "102066",
        "103001",
        "103002",
        "103003",
        "103004",
        "103005",
        "103006",
        "103007",
        "103008",
      ),
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      meta: Schema.optional(
        Schema.Struct({
          l10nKey: Schema.optional(Schema.String).pipe(T.JsonName("l10n_key")),
          loggableError: Schema.optional(Schema.String).pipe(
            T.JsonName("loggable_error"),
          ),
          templateData: Schema.optional(Schema.Unknown).pipe(
            T.JsonName("template_data"),
          ),
          traceId: Schema.optional(Schema.String).pipe(T.JsonName("trace_id")),
        }),
      ),
      source: Schema.optional(
        Schema.Struct({
          parameter: Schema.optional(Schema.String),
          parameterValueIndex: Schema.optional(Schema.Number).pipe(
            T.JsonName("parameter_value_index"),
          ),
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  messages: Schema.Array(
    Schema.Struct({
      code: Schema.Literal(
        "1001",
        "1002",
        "1003",
        "1004",
        "1005",
        "1006",
        "1007",
        "1008",
        "1009",
        "1010",
        "1011",
        "1012",
        "1013",
        "1014",
        "1015",
        "1016",
        "1017",
        "2001",
        "2002",
        "2003",
        "2004",
        "2005",
        "2006",
        "2007",
        "2008",
        "2009",
        "2010",
        "2011",
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "3001",
        "3002",
        "3003",
        "3004",
        "3005",
        "3006",
        "3007",
        "4001",
        "4002",
        "4003",
        "4004",
        "4005",
        "4006",
        "4007",
        "4008",
        "4009",
        "4010",
        "4011",
        "4012",
        "4013",
        "4014",
        "4015",
        "4016",
        "4017",
        "4018",
        "4019",
        "4020",
        "4021",
        "4022",
        "4023",
        "5001",
        "5002",
        "5003",
        "5004",
        "102000",
        "102001",
        "102002",
        "102003",
        "102004",
        "102005",
        "102006",
        "102007",
        "102008",
        "102009",
        "102010",
        "102011",
        "102012",
        "102013",
        "102014",
        "102015",
        "102016",
        "102017",
        "102018",
        "102019",
        "102020",
        "102021",
        "102022",
        "102023",
        "102024",
        "102025",
        "102026",
        "102027",
        "102028",
        "102029",
        "102030",
        "102031",
        "102032",
        "102033",
        "102034",
        "102035",
        "102036",
        "102037",
        "102038",
        "102039",
        "102040",
        "102041",
        "102042",
        "102043",
        "102044",
        "102045",
        "102046",
        "102047",
        "102048",
        "102049",
        "102050",
        "102051",
        "102052",
        "102053",
        "102054",
        "102055",
        "102056",
        "102057",
        "102058",
        "102059",
        "102060",
        "102061",
        "102062",
        "102063",
        "102064",
        "102065",
        "102066",
        "103001",
        "103002",
        "103003",
        "103004",
        "103005",
        "103006",
        "103007",
        "103008",
      ),
      message: Schema.String,
      documentationUrl: Schema.optional(Schema.String).pipe(
        T.JsonName("documentation_url"),
      ),
      meta: Schema.optional(
        Schema.Struct({
          l10nKey: Schema.optional(Schema.String).pipe(T.JsonName("l10n_key")),
          loggableError: Schema.optional(Schema.String).pipe(
            T.JsonName("loggable_error"),
          ),
          templateData: Schema.optional(Schema.Unknown).pipe(
            T.JsonName("template_data"),
          ),
          traceId: Schema.optional(Schema.String).pipe(T.JsonName("trace_id")),
        }),
      ),
      source: Schema.optional(
        Schema.Struct({
          parameter: Schema.optional(Schema.String),
          parameterValueIndex: Schema.optional(Schema.Number).pipe(
            T.JsonName("parameter_value_index"),
          ),
          pointer: Schema.optional(Schema.String),
        }),
      ),
    }),
  ),
  success: Schema.Boolean,
}) as unknown as Schema.Schema<PlanOnRampResponse>;

export const planOnRamp: (
  input: PlanOnRampRequest,
) => Effect.Effect<
  PlanOnRampResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PlanOnRampRequest,
  output: PlanOnRampResponse,
  errors: [],
}));

// =============================================================================
// OnRampAddressSpace
// =============================================================================

export interface ListOnRampAddressSpacesRequest {
  accountId: string;
}

export const ListOnRampAddressSpacesRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/magic/cloud/onramps/magic_wan_address_space",
  }),
) as unknown as Schema.Schema<ListOnRampAddressSpacesRequest>;

export interface ListOnRampAddressSpacesResponse {
  prefixes: string[];
}

export const ListOnRampAddressSpacesResponse = Schema.Struct({
  prefixes: Schema.Array(Schema.String),
}) as unknown as Schema.Schema<ListOnRampAddressSpacesResponse>;

export const listOnRampAddressSpaces: (
  input: ListOnRampAddressSpacesRequest,
) => Effect.Effect<
  ListOnRampAddressSpacesResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ListOnRampAddressSpacesRequest,
  output: ListOnRampAddressSpacesResponse,
  errors: [],
}));

export interface PutOnRampAddressSpaceRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  prefixes: string[];
}

export const PutOnRampAddressSpaceRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  prefixes: Schema.Array(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/magic/cloud/onramps/magic_wan_address_space",
  }),
) as unknown as Schema.Schema<PutOnRampAddressSpaceRequest>;

export interface PutOnRampAddressSpaceResponse {
  prefixes: string[];
}

export const PutOnRampAddressSpaceResponse = Schema.Struct({
  prefixes: Schema.Array(Schema.String),
}) as unknown as Schema.Schema<PutOnRampAddressSpaceResponse>;

export const putOnRampAddressSpace: (
  input: PutOnRampAddressSpaceRequest,
) => Effect.Effect<
  PutOnRampAddressSpaceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutOnRampAddressSpaceRequest,
  output: PutOnRampAddressSpaceResponse,
  errors: [],
}));

export interface PatchOnRampAddressSpaceRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  prefixes: string[];
}

export const PatchOnRampAddressSpaceRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  prefixes: Schema.Array(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/magic/cloud/onramps/magic_wan_address_space",
  }),
) as unknown as Schema.Schema<PatchOnRampAddressSpaceRequest>;

export interface PatchOnRampAddressSpaceResponse {
  prefixes: string[];
}

export const PatchOnRampAddressSpaceResponse = Schema.Struct({
  prefixes: Schema.Array(Schema.String),
}) as unknown as Schema.Schema<PatchOnRampAddressSpaceResponse>;

export const patchOnRampAddressSpace: (
  input: PatchOnRampAddressSpaceRequest,
) => Effect.Effect<
  PatchOnRampAddressSpaceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchOnRampAddressSpaceRequest,
  output: PatchOnRampAddressSpaceResponse,
  errors: [],
}));

// =============================================================================
// PreviewResource
// =============================================================================

export interface PolicyPreviewResourceRequest {
  /** Path param: */
  accountId: string;
  /** Body param: */
  policy: string;
}

export const PolicyPreviewResourceRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  policy: Schema.String,
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/magic/cloud/resources/policy-preview",
  }),
) as unknown as Schema.Schema<PolicyPreviewResourceRequest>;

export type PolicyPreviewResourceResponse = string;

export const PolicyPreviewResourceResponse =
  Schema.String as unknown as Schema.Schema<PolicyPreviewResourceResponse>;

export const policyPreviewResource: (
  input: PolicyPreviewResourceRequest,
) => Effect.Effect<
  PolicyPreviewResourceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PolicyPreviewResourceRequest,
  output: PolicyPreviewResourceResponse,
  errors: [],
}));

// =============================================================================
// Resource
// =============================================================================

export interface GetResourceRequest {
  resourceId: string;
  /** Path param: */
  accountId: string;
  /** Query param: */
  v2?: boolean;
}

export const GetResourceRequest = Schema.Struct({
  resourceId: Schema.String.pipe(T.HttpPath("resourceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  v2: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("v2")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/magic/cloud/resources/{resourceId}",
  }),
) as unknown as Schema.Schema<GetResourceRequest>;

export interface GetResourceResponse {
  id: string;
  accountId: string;
  cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
  config: Record<string, unknown>;
  deploymentProvider: string;
  managed: boolean;
  monthlyCostEstimate: { currency: string; monthlyCost: number };
  name: string;
  nativeId: string;
  observations: Record<string, unknown>;
  providerIds: string[];
  providerNamesById: Record<string, unknown>;
  region: string;
  resourceGroup: string;
  resourceType:
    | "aws_customer_gateway"
    | "aws_egress_only_internet_gateway"
    | "aws_internet_gateway"
    | "aws_instance"
    | "aws_network_interface"
    | "aws_route"
    | "aws_route_table"
    | "aws_route_table_association"
    | "aws_subnet"
    | "aws_vpc"
    | "aws_vpc_ipv4_cidr_block_association"
    | "aws_vpn_connection"
    | "aws_vpn_connection_route"
    | "aws_vpn_gateway"
    | "aws_security_group"
    | "aws_vpc_security_group_ingress_rule"
    | "aws_vpc_security_group_egress_rule"
    | "aws_ec2_managed_prefix_list"
    | "aws_ec2_transit_gateway"
    | "aws_ec2_transit_gateway_prefix_list_reference"
    | "aws_ec2_transit_gateway_vpc_attachment"
    | "azurerm_application_security_group"
    | "azurerm_lb"
    | "azurerm_lb_backend_address_pool"
    | "azurerm_lb_nat_pool"
    | "azurerm_lb_nat_rule"
    | "azurerm_lb_rule"
    | "azurerm_local_network_gateway"
    | "azurerm_network_interface"
    | "azurerm_network_interface_application_security_group_association"
    | "azurerm_network_interface_backend_address_pool_association"
    | "azurerm_network_interface_security_group_association"
    | "azurerm_network_security_group"
    | "azurerm_public_ip"
    | "azurerm_route"
    | "azurerm_route_table"
    | "azurerm_subnet"
    | "azurerm_subnet_route_table_association"
    | "azurerm_virtual_machine"
    | "azurerm_virtual_network_gateway_connection"
    | "azurerm_virtual_network"
    | "azurerm_virtual_network_gateway"
    | "google_compute_network"
    | "google_compute_subnetwork"
    | "google_compute_vpn_gateway"
    | "google_compute_vpn_tunnel"
    | "google_compute_route"
    | "google_compute_address"
    | "google_compute_global_address"
    | "google_compute_router"
    | "google_compute_interconnect_attachment"
    | "google_compute_ha_vpn_gateway"
    | "google_compute_forwarding_rule"
    | "google_compute_network_firewall_policy"
    | "google_compute_network_firewall_policy_rule"
    | "cloudflare_static_route"
    | "cloudflare_ipsec_tunnel";
  sections: {
    hiddenItems: {
      helpText?: string;
      name?: string;
      value?:
        | { itemType: string; string: string }
        | { itemType: string; yaml: string }
        | {
            itemType: string;
            yamlDiff: {
              diff: string;
              leftDescription: string;
              leftYaml: string;
              rightDescription: string;
              rightYaml: string;
            };
          }
        | {
            itemType: string;
            resourcePreview: {
              id: string;
              cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
              detail: string;
              name: string;
              resourceType:
                | "aws_customer_gateway"
                | "aws_egress_only_internet_gateway"
                | "aws_internet_gateway"
                | "aws_instance"
                | "aws_network_interface"
                | "aws_route"
                | "aws_route_table"
                | "aws_route_table_association"
                | "aws_subnet"
                | "aws_vpc"
                | "aws_vpc_ipv4_cidr_block_association"
                | "aws_vpn_connection"
                | "aws_vpn_connection_route"
                | "aws_vpn_gateway"
                | "aws_security_group"
                | "aws_vpc_security_group_ingress_rule"
                | "aws_vpc_security_group_egress_rule"
                | "aws_ec2_managed_prefix_list"
                | "aws_ec2_transit_gateway"
                | "aws_ec2_transit_gateway_prefix_list_reference"
                | "aws_ec2_transit_gateway_vpc_attachment"
                | "azurerm_application_security_group"
                | "azurerm_lb"
                | "azurerm_lb_backend_address_pool"
                | "azurerm_lb_nat_pool"
                | "azurerm_lb_nat_rule"
                | "azurerm_lb_rule"
                | "azurerm_local_network_gateway"
                | "azurerm_network_interface"
                | "azurerm_network_interface_application_security_group_association"
                | "azurerm_network_interface_backend_address_pool_association"
                | "azurerm_network_interface_security_group_association"
                | "azurerm_network_security_group"
                | "azurerm_public_ip"
                | "azurerm_route"
                | "azurerm_route_table"
                | "azurerm_subnet"
                | "azurerm_subnet_route_table_association"
                | "azurerm_virtual_machine"
                | "azurerm_virtual_network_gateway_connection"
                | "azurerm_virtual_network"
                | "azurerm_virtual_network_gateway"
                | "google_compute_network"
                | "google_compute_subnetwork"
                | "google_compute_vpn_gateway"
                | "google_compute_vpn_tunnel"
                | "google_compute_route"
                | "google_compute_address"
                | "google_compute_global_address"
                | "google_compute_router"
                | "google_compute_interconnect_attachment"
                | "google_compute_ha_vpn_gateway"
                | "google_compute_forwarding_rule"
                | "google_compute_network_firewall_policy"
                | "google_compute_network_firewall_policy_rule"
                | "cloudflare_static_route"
                | "cloudflare_ipsec_tunnel";
              title: string;
            };
          }
        | {
            itemType: string;
            list: (
              | { itemType: string; string: string }
              | {
                  itemType: string;
                  resourcePreview: {
                    id: string;
                    cloudType: unknown;
                    detail: string;
                    name: string;
                    resourceType: unknown;
                    title: string;
                  };
                }
            )[];
          };
    }[];
    name: string;
    visibleItems: {
      helpText?: string;
      name?: string;
      value?:
        | { itemType: string; string: string }
        | { itemType: string; yaml: string }
        | {
            itemType: string;
            yamlDiff: {
              diff: string;
              leftDescription: string;
              leftYaml: string;
              rightDescription: string;
              rightYaml: string;
            };
          }
        | {
            itemType: string;
            resourcePreview: {
              id: string;
              cloudType: "AWS" | "AZURE" | "GOOGLE" | "CLOUDFLARE";
              detail: string;
              name: string;
              resourceType:
                | "aws_customer_gateway"
                | "aws_egress_only_internet_gateway"
                | "aws_internet_gateway"
                | "aws_instance"
                | "aws_network_interface"
                | "aws_route"
                | "aws_route_table"
                | "aws_route_table_association"
                | "aws_subnet"
                | "aws_vpc"
                | "aws_vpc_ipv4_cidr_block_association"
                | "aws_vpn_connection"
                | "aws_vpn_connection_route"
                | "aws_vpn_gateway"
                | "aws_security_group"
                | "aws_vpc_security_group_ingress_rule"
                | "aws_vpc_security_group_egress_rule"
                | "aws_ec2_managed_prefix_list"
                | "aws_ec2_transit_gateway"
                | "aws_ec2_transit_gateway_prefix_list_reference"
                | "aws_ec2_transit_gateway_vpc_attachment"
                | "azurerm_application_security_group"
                | "azurerm_lb"
                | "azurerm_lb_backend_address_pool"
                | "azurerm_lb_nat_pool"
                | "azurerm_lb_nat_rule"
                | "azurerm_lb_rule"
                | "azurerm_local_network_gateway"
                | "azurerm_network_interface"
                | "azurerm_network_interface_application_security_group_association"
                | "azurerm_network_interface_backend_address_pool_association"
                | "azurerm_network_interface_security_group_association"
                | "azurerm_network_security_group"
                | "azurerm_public_ip"
                | "azurerm_route"
                | "azurerm_route_table"
                | "azurerm_subnet"
                | "azurerm_subnet_route_table_association"
                | "azurerm_virtual_machine"
                | "azurerm_virtual_network_gateway_connection"
                | "azurerm_virtual_network"
                | "azurerm_virtual_network_gateway"
                | "google_compute_network"
                | "google_compute_subnetwork"
                | "google_compute_vpn_gateway"
                | "google_compute_vpn_tunnel"
                | "google_compute_route"
                | "google_compute_address"
                | "google_compute_global_address"
                | "google_compute_router"
                | "google_compute_interconnect_attachment"
                | "google_compute_ha_vpn_gateway"
                | "google_compute_forwarding_rule"
                | "google_compute_network_firewall_policy"
                | "google_compute_network_firewall_policy_rule"
                | "cloudflare_static_route"
                | "cloudflare_ipsec_tunnel";
              title: string;
            };
          }
        | {
            itemType: string;
            list: (
              | { itemType: string; string: string }
              | {
                  itemType: string;
                  resourcePreview: {
                    id: string;
                    cloudType: unknown;
                    detail: string;
                    name: string;
                    resourceType: unknown;
                    title: string;
                  };
                }
            )[];
          };
    }[];
    helpText?: string;
  }[];
  state: Record<string, unknown>;
  tags: Record<string, unknown>;
  updatedAt: string;
  url: string;
  managedBy?: {
    id: string;
    clientType: "MAGIC_WAN_CLOUD_ONRAMP";
    name: string;
  }[];
}

export const GetResourceResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.String.pipe(T.JsonName("account_id")),
  cloudType: Schema.Literal("AWS", "AZURE", "GOOGLE", "CLOUDFLARE").pipe(
    T.JsonName("cloud_type"),
  ),
  config: Schema.Struct({}),
  deploymentProvider: Schema.String.pipe(T.JsonName("deployment_provider")),
  managed: Schema.Boolean,
  monthlyCostEstimate: Schema.Struct({
    currency: Schema.String,
    monthlyCost: Schema.Number.pipe(T.JsonName("monthly_cost")),
  }).pipe(T.JsonName("monthly_cost_estimate")),
  name: Schema.String,
  nativeId: Schema.String.pipe(T.JsonName("native_id")),
  observations: Schema.Struct({}),
  providerIds: Schema.Array(Schema.String).pipe(T.JsonName("provider_ids")),
  providerNamesById: Schema.Struct({}).pipe(T.JsonName("provider_names_by_id")),
  region: Schema.String,
  resourceGroup: Schema.String.pipe(T.JsonName("resource_group")),
  resourceType: Schema.Literal(
    "aws_customer_gateway",
    "aws_egress_only_internet_gateway",
    "aws_internet_gateway",
    "aws_instance",
    "aws_network_interface",
    "aws_route",
    "aws_route_table",
    "aws_route_table_association",
    "aws_subnet",
    "aws_vpc",
    "aws_vpc_ipv4_cidr_block_association",
    "aws_vpn_connection",
    "aws_vpn_connection_route",
    "aws_vpn_gateway",
    "aws_security_group",
    "aws_vpc_security_group_ingress_rule",
    "aws_vpc_security_group_egress_rule",
    "aws_ec2_managed_prefix_list",
    "aws_ec2_transit_gateway",
    "aws_ec2_transit_gateway_prefix_list_reference",
    "aws_ec2_transit_gateway_vpc_attachment",
    "azurerm_application_security_group",
    "azurerm_lb",
    "azurerm_lb_backend_address_pool",
    "azurerm_lb_nat_pool",
    "azurerm_lb_nat_rule",
    "azurerm_lb_rule",
    "azurerm_local_network_gateway",
    "azurerm_network_interface",
    "azurerm_network_interface_application_security_group_association",
    "azurerm_network_interface_backend_address_pool_association",
    "azurerm_network_interface_security_group_association",
    "azurerm_network_security_group",
    "azurerm_public_ip",
    "azurerm_route",
    "azurerm_route_table",
    "azurerm_subnet",
    "azurerm_subnet_route_table_association",
    "azurerm_virtual_machine",
    "azurerm_virtual_network_gateway_connection",
    "azurerm_virtual_network",
    "azurerm_virtual_network_gateway",
    "google_compute_network",
    "google_compute_subnetwork",
    "google_compute_vpn_gateway",
    "google_compute_vpn_tunnel",
    "google_compute_route",
    "google_compute_address",
    "google_compute_global_address",
    "google_compute_router",
    "google_compute_interconnect_attachment",
    "google_compute_ha_vpn_gateway",
    "google_compute_forwarding_rule",
    "google_compute_network_firewall_policy",
    "google_compute_network_firewall_policy_rule",
    "cloudflare_static_route",
    "cloudflare_ipsec_tunnel",
  ).pipe(T.JsonName("resource_type")),
  sections: Schema.Array(
    Schema.Struct({
      hiddenItems: Schema.Array(
        Schema.Struct({
          helpText: Schema.optional(Schema.String),
          name: Schema.optional(Schema.String),
          value: Schema.optional(
            Schema.Union(
              Schema.Struct({
                itemType: Schema.String.pipe(T.JsonName("item_type")),
                string: Schema.String,
              }),
              Schema.Struct({
                itemType: Schema.String.pipe(T.JsonName("item_type")),
                yaml: Schema.String,
              }),
              Schema.Struct({
                itemType: Schema.String.pipe(T.JsonName("item_type")),
                yamlDiff: Schema.Struct({
                  diff: Schema.String,
                  leftDescription: Schema.String.pipe(
                    T.JsonName("left_description"),
                  ),
                  leftYaml: Schema.String.pipe(T.JsonName("left_yaml")),
                  rightDescription: Schema.String.pipe(
                    T.JsonName("right_description"),
                  ),
                  rightYaml: Schema.String.pipe(T.JsonName("right_yaml")),
                }).pipe(T.JsonName("yaml_diff")),
              }),
              Schema.Struct({
                itemType: Schema.String.pipe(T.JsonName("item_type")),
                resourcePreview: Schema.Struct({
                  id: Schema.String,
                  cloudType: Schema.Literal(
                    "AWS",
                    "AZURE",
                    "GOOGLE",
                    "CLOUDFLARE",
                  ).pipe(T.JsonName("cloud_type")),
                  detail: Schema.String,
                  name: Schema.String,
                  resourceType: Schema.Literal(
                    "aws_customer_gateway",
                    "aws_egress_only_internet_gateway",
                    "aws_internet_gateway",
                    "aws_instance",
                    "aws_network_interface",
                    "aws_route",
                    "aws_route_table",
                    "aws_route_table_association",
                    "aws_subnet",
                    "aws_vpc",
                    "aws_vpc_ipv4_cidr_block_association",
                    "aws_vpn_connection",
                    "aws_vpn_connection_route",
                    "aws_vpn_gateway",
                    "aws_security_group",
                    "aws_vpc_security_group_ingress_rule",
                    "aws_vpc_security_group_egress_rule",
                    "aws_ec2_managed_prefix_list",
                    "aws_ec2_transit_gateway",
                    "aws_ec2_transit_gateway_prefix_list_reference",
                    "aws_ec2_transit_gateway_vpc_attachment",
                    "azurerm_application_security_group",
                    "azurerm_lb",
                    "azurerm_lb_backend_address_pool",
                    "azurerm_lb_nat_pool",
                    "azurerm_lb_nat_rule",
                    "azurerm_lb_rule",
                    "azurerm_local_network_gateway",
                    "azurerm_network_interface",
                    "azurerm_network_interface_application_security_group_association",
                    "azurerm_network_interface_backend_address_pool_association",
                    "azurerm_network_interface_security_group_association",
                    "azurerm_network_security_group",
                    "azurerm_public_ip",
                    "azurerm_route",
                    "azurerm_route_table",
                    "azurerm_subnet",
                    "azurerm_subnet_route_table_association",
                    "azurerm_virtual_machine",
                    "azurerm_virtual_network_gateway_connection",
                    "azurerm_virtual_network",
                    "azurerm_virtual_network_gateway",
                    "google_compute_network",
                    "google_compute_subnetwork",
                    "google_compute_vpn_gateway",
                    "google_compute_vpn_tunnel",
                    "google_compute_route",
                    "google_compute_address",
                    "google_compute_global_address",
                    "google_compute_router",
                    "google_compute_interconnect_attachment",
                    "google_compute_ha_vpn_gateway",
                    "google_compute_forwarding_rule",
                    "google_compute_network_firewall_policy",
                    "google_compute_network_firewall_policy_rule",
                    "cloudflare_static_route",
                    "cloudflare_ipsec_tunnel",
                  ).pipe(T.JsonName("resource_type")),
                  title: Schema.String,
                }).pipe(T.JsonName("resource_preview")),
              }),
              Schema.Struct({
                itemType: Schema.String.pipe(T.JsonName("item_type")),
                list: Schema.Array(
                  Schema.Union(
                    Schema.Struct({
                      itemType: Schema.String.pipe(T.JsonName("item_type")),
                      string: Schema.String,
                    }),
                    Schema.Struct({
                      itemType: Schema.String.pipe(T.JsonName("item_type")),
                      resourcePreview: Schema.Struct({
                        id: Schema.String,
                        cloudType: Schema.Literal(
                          "AWS",
                          "AZURE",
                          "GOOGLE",
                          "CLOUDFLARE",
                        ).pipe(T.JsonName("cloud_type")),
                        detail: Schema.String,
                        name: Schema.String,
                        resourceType: Schema.Literal(
                          "aws_customer_gateway",
                          "aws_egress_only_internet_gateway",
                          "aws_internet_gateway",
                          "aws_instance",
                          "aws_network_interface",
                          "aws_route",
                          "aws_route_table",
                          "aws_route_table_association",
                          "aws_subnet",
                          "aws_vpc",
                          "aws_vpc_ipv4_cidr_block_association",
                          "aws_vpn_connection",
                          "aws_vpn_connection_route",
                          "aws_vpn_gateway",
                          "aws_security_group",
                          "aws_vpc_security_group_ingress_rule",
                          "aws_vpc_security_group_egress_rule",
                          "aws_ec2_managed_prefix_list",
                          "aws_ec2_transit_gateway",
                          "aws_ec2_transit_gateway_prefix_list_reference",
                          "aws_ec2_transit_gateway_vpc_attachment",
                          "azurerm_application_security_group",
                          "azurerm_lb",
                          "azurerm_lb_backend_address_pool",
                          "azurerm_lb_nat_pool",
                          "azurerm_lb_nat_rule",
                          "azurerm_lb_rule",
                          "azurerm_local_network_gateway",
                          "azurerm_network_interface",
                          "azurerm_network_interface_application_security_group_association",
                          "azurerm_network_interface_backend_address_pool_association",
                          "azurerm_network_interface_security_group_association",
                          "azurerm_network_security_group",
                          "azurerm_public_ip",
                          "azurerm_route",
                          "azurerm_route_table",
                          "azurerm_subnet",
                          "azurerm_subnet_route_table_association",
                          "azurerm_virtual_machine",
                          "azurerm_virtual_network_gateway_connection",
                          "azurerm_virtual_network",
                          "azurerm_virtual_network_gateway",
                          "google_compute_network",
                          "google_compute_subnetwork",
                          "google_compute_vpn_gateway",
                          "google_compute_vpn_tunnel",
                          "google_compute_route",
                          "google_compute_address",
                          "google_compute_global_address",
                          "google_compute_router",
                          "google_compute_interconnect_attachment",
                          "google_compute_ha_vpn_gateway",
                          "google_compute_forwarding_rule",
                          "google_compute_network_firewall_policy",
                          "google_compute_network_firewall_policy_rule",
                          "cloudflare_static_route",
                          "cloudflare_ipsec_tunnel",
                        ).pipe(T.JsonName("resource_type")),
                        title: Schema.String,
                      }).pipe(T.JsonName("resource_preview")),
                    }),
                  ),
                ),
              }),
            ),
          ),
        }),
      ).pipe(T.JsonName("hidden_items")),
      name: Schema.String,
      visibleItems: Schema.Array(
        Schema.Struct({
          helpText: Schema.optional(Schema.String),
          name: Schema.optional(Schema.String),
          value: Schema.optional(
            Schema.Union(
              Schema.Struct({
                itemType: Schema.String.pipe(T.JsonName("item_type")),
                string: Schema.String,
              }),
              Schema.Struct({
                itemType: Schema.String.pipe(T.JsonName("item_type")),
                yaml: Schema.String,
              }),
              Schema.Struct({
                itemType: Schema.String.pipe(T.JsonName("item_type")),
                yamlDiff: Schema.Struct({
                  diff: Schema.String,
                  leftDescription: Schema.String.pipe(
                    T.JsonName("left_description"),
                  ),
                  leftYaml: Schema.String.pipe(T.JsonName("left_yaml")),
                  rightDescription: Schema.String.pipe(
                    T.JsonName("right_description"),
                  ),
                  rightYaml: Schema.String.pipe(T.JsonName("right_yaml")),
                }).pipe(T.JsonName("yaml_diff")),
              }),
              Schema.Struct({
                itemType: Schema.String.pipe(T.JsonName("item_type")),
                resourcePreview: Schema.Struct({
                  id: Schema.String,
                  cloudType: Schema.Literal(
                    "AWS",
                    "AZURE",
                    "GOOGLE",
                    "CLOUDFLARE",
                  ).pipe(T.JsonName("cloud_type")),
                  detail: Schema.String,
                  name: Schema.String,
                  resourceType: Schema.Literal(
                    "aws_customer_gateway",
                    "aws_egress_only_internet_gateway",
                    "aws_internet_gateway",
                    "aws_instance",
                    "aws_network_interface",
                    "aws_route",
                    "aws_route_table",
                    "aws_route_table_association",
                    "aws_subnet",
                    "aws_vpc",
                    "aws_vpc_ipv4_cidr_block_association",
                    "aws_vpn_connection",
                    "aws_vpn_connection_route",
                    "aws_vpn_gateway",
                    "aws_security_group",
                    "aws_vpc_security_group_ingress_rule",
                    "aws_vpc_security_group_egress_rule",
                    "aws_ec2_managed_prefix_list",
                    "aws_ec2_transit_gateway",
                    "aws_ec2_transit_gateway_prefix_list_reference",
                    "aws_ec2_transit_gateway_vpc_attachment",
                    "azurerm_application_security_group",
                    "azurerm_lb",
                    "azurerm_lb_backend_address_pool",
                    "azurerm_lb_nat_pool",
                    "azurerm_lb_nat_rule",
                    "azurerm_lb_rule",
                    "azurerm_local_network_gateway",
                    "azurerm_network_interface",
                    "azurerm_network_interface_application_security_group_association",
                    "azurerm_network_interface_backend_address_pool_association",
                    "azurerm_network_interface_security_group_association",
                    "azurerm_network_security_group",
                    "azurerm_public_ip",
                    "azurerm_route",
                    "azurerm_route_table",
                    "azurerm_subnet",
                    "azurerm_subnet_route_table_association",
                    "azurerm_virtual_machine",
                    "azurerm_virtual_network_gateway_connection",
                    "azurerm_virtual_network",
                    "azurerm_virtual_network_gateway",
                    "google_compute_network",
                    "google_compute_subnetwork",
                    "google_compute_vpn_gateway",
                    "google_compute_vpn_tunnel",
                    "google_compute_route",
                    "google_compute_address",
                    "google_compute_global_address",
                    "google_compute_router",
                    "google_compute_interconnect_attachment",
                    "google_compute_ha_vpn_gateway",
                    "google_compute_forwarding_rule",
                    "google_compute_network_firewall_policy",
                    "google_compute_network_firewall_policy_rule",
                    "cloudflare_static_route",
                    "cloudflare_ipsec_tunnel",
                  ).pipe(T.JsonName("resource_type")),
                  title: Schema.String,
                }).pipe(T.JsonName("resource_preview")),
              }),
              Schema.Struct({
                itemType: Schema.String.pipe(T.JsonName("item_type")),
                list: Schema.Array(
                  Schema.Union(
                    Schema.Struct({
                      itemType: Schema.String.pipe(T.JsonName("item_type")),
                      string: Schema.String,
                    }),
                    Schema.Struct({
                      itemType: Schema.String.pipe(T.JsonName("item_type")),
                      resourcePreview: Schema.Struct({
                        id: Schema.String,
                        cloudType: Schema.Literal(
                          "AWS",
                          "AZURE",
                          "GOOGLE",
                          "CLOUDFLARE",
                        ).pipe(T.JsonName("cloud_type")),
                        detail: Schema.String,
                        name: Schema.String,
                        resourceType: Schema.Literal(
                          "aws_customer_gateway",
                          "aws_egress_only_internet_gateway",
                          "aws_internet_gateway",
                          "aws_instance",
                          "aws_network_interface",
                          "aws_route",
                          "aws_route_table",
                          "aws_route_table_association",
                          "aws_subnet",
                          "aws_vpc",
                          "aws_vpc_ipv4_cidr_block_association",
                          "aws_vpn_connection",
                          "aws_vpn_connection_route",
                          "aws_vpn_gateway",
                          "aws_security_group",
                          "aws_vpc_security_group_ingress_rule",
                          "aws_vpc_security_group_egress_rule",
                          "aws_ec2_managed_prefix_list",
                          "aws_ec2_transit_gateway",
                          "aws_ec2_transit_gateway_prefix_list_reference",
                          "aws_ec2_transit_gateway_vpc_attachment",
                          "azurerm_application_security_group",
                          "azurerm_lb",
                          "azurerm_lb_backend_address_pool",
                          "azurerm_lb_nat_pool",
                          "azurerm_lb_nat_rule",
                          "azurerm_lb_rule",
                          "azurerm_local_network_gateway",
                          "azurerm_network_interface",
                          "azurerm_network_interface_application_security_group_association",
                          "azurerm_network_interface_backend_address_pool_association",
                          "azurerm_network_interface_security_group_association",
                          "azurerm_network_security_group",
                          "azurerm_public_ip",
                          "azurerm_route",
                          "azurerm_route_table",
                          "azurerm_subnet",
                          "azurerm_subnet_route_table_association",
                          "azurerm_virtual_machine",
                          "azurerm_virtual_network_gateway_connection",
                          "azurerm_virtual_network",
                          "azurerm_virtual_network_gateway",
                          "google_compute_network",
                          "google_compute_subnetwork",
                          "google_compute_vpn_gateway",
                          "google_compute_vpn_tunnel",
                          "google_compute_route",
                          "google_compute_address",
                          "google_compute_global_address",
                          "google_compute_router",
                          "google_compute_interconnect_attachment",
                          "google_compute_ha_vpn_gateway",
                          "google_compute_forwarding_rule",
                          "google_compute_network_firewall_policy",
                          "google_compute_network_firewall_policy_rule",
                          "cloudflare_static_route",
                          "cloudflare_ipsec_tunnel",
                        ).pipe(T.JsonName("resource_type")),
                        title: Schema.String,
                      }).pipe(T.JsonName("resource_preview")),
                    }),
                  ),
                ),
              }),
            ),
          ),
        }),
      ).pipe(T.JsonName("visible_items")),
      helpText: Schema.optional(Schema.String).pipe(T.JsonName("help_text")),
    }),
  ),
  state: Schema.Struct({}),
  tags: Schema.Struct({}),
  updatedAt: Schema.String.pipe(T.JsonName("updated_at")),
  url: Schema.String,
  managedBy: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        clientType: Schema.Literal("MAGIC_WAN_CLOUD_ONRAMP").pipe(
          T.JsonName("client_type"),
        ),
        name: Schema.String,
      }),
    ),
  ).pipe(T.JsonName("managed_by")),
}) as unknown as Schema.Schema<GetResourceResponse>;

export const getResource: (
  input: GetResourceRequest,
) => Effect.Effect<
  GetResourceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetResourceRequest,
  output: GetResourceResponse,
  errors: [],
}));

export interface ExportResourceRequest {
  /** Path param: */
  accountId: string;
  /** Query param: */
  desc?: boolean;
  /** Query param: One of ["id", "resource_type", "region"]. */
  orderBy?: string;
  /** Query param: */
  providerId?: string;
  /** Query param: */
  region?: string;
  /** Query param: */
  resourceGroup?: string;
  /** Query param: */
  resourceId?: string[];
  /** Query param: */
  resourceType?: (
    | "aws_customer_gateway"
    | "aws_egress_only_internet_gateway"
    | "aws_internet_gateway"
    | "aws_instance"
    | "aws_network_interface"
    | "aws_route"
    | "aws_route_table"
    | "aws_route_table_association"
    | "aws_subnet"
    | "aws_vpc"
    | "aws_vpc_ipv4_cidr_block_association"
    | "aws_vpn_connection"
    | "aws_vpn_connection_route"
    | "aws_vpn_gateway"
    | "aws_security_group"
    | "aws_vpc_security_group_ingress_rule"
    | "aws_vpc_security_group_egress_rule"
    | "aws_ec2_managed_prefix_list"
    | "aws_ec2_transit_gateway"
    | "aws_ec2_transit_gateway_prefix_list_reference"
    | "aws_ec2_transit_gateway_vpc_attachment"
    | "azurerm_application_security_group"
    | "azurerm_lb"
    | "azurerm_lb_backend_address_pool"
    | "azurerm_lb_nat_pool"
    | "azurerm_lb_nat_rule"
    | "azurerm_lb_rule"
    | "azurerm_local_network_gateway"
    | "azurerm_network_interface"
    | "azurerm_network_interface_application_security_group_association"
    | "azurerm_network_interface_backend_address_pool_association"
    | "azurerm_network_interface_security_group_association"
    | "azurerm_network_security_group"
    | "azurerm_public_ip"
    | "azurerm_route"
    | "azurerm_route_table"
    | "azurerm_subnet"
    | "azurerm_subnet_route_table_association"
    | "azurerm_virtual_machine"
    | "azurerm_virtual_network_gateway_connection"
    | "azurerm_virtual_network"
    | "azurerm_virtual_network_gateway"
    | "google_compute_network"
    | "google_compute_subnetwork"
    | "google_compute_vpn_gateway"
    | "google_compute_vpn_tunnel"
    | "google_compute_route"
    | "google_compute_address"
    | "google_compute_global_address"
    | "google_compute_router"
    | "google_compute_interconnect_attachment"
    | "google_compute_ha_vpn_gateway"
    | "google_compute_forwarding_rule"
    | "google_compute_network_firewall_policy"
    | "google_compute_network_firewall_policy_rule"
    | "cloudflare_static_route"
    | "cloudflare_ipsec_tunnel"
  )[];
  /** Query param: */
  search?: string[];
  /** Query param: */
  v2?: boolean;
}

export const ExportResourceRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  desc: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("desc")),
  orderBy: Schema.optional(Schema.String).pipe(T.HttpQuery("order_by")),
  providerId: Schema.optional(Schema.String).pipe(T.HttpQuery("provider_id")),
  region: Schema.optional(Schema.String).pipe(T.HttpQuery("region")),
  resourceGroup: Schema.optional(Schema.String).pipe(
    T.HttpQuery("resource_group"),
  ),
  resourceId: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("resource_id"),
  ),
  resourceType: Schema.optional(
    Schema.Array(
      Schema.Literal(
        "aws_customer_gateway",
        "aws_egress_only_internet_gateway",
        "aws_internet_gateway",
        "aws_instance",
        "aws_network_interface",
        "aws_route",
        "aws_route_table",
        "aws_route_table_association",
        "aws_subnet",
        "aws_vpc",
        "aws_vpc_ipv4_cidr_block_association",
        "aws_vpn_connection",
        "aws_vpn_connection_route",
        "aws_vpn_gateway",
        "aws_security_group",
        "aws_vpc_security_group_ingress_rule",
        "aws_vpc_security_group_egress_rule",
        "aws_ec2_managed_prefix_list",
        "aws_ec2_transit_gateway",
        "aws_ec2_transit_gateway_prefix_list_reference",
        "aws_ec2_transit_gateway_vpc_attachment",
        "azurerm_application_security_group",
        "azurerm_lb",
        "azurerm_lb_backend_address_pool",
        "azurerm_lb_nat_pool",
        "azurerm_lb_nat_rule",
        "azurerm_lb_rule",
        "azurerm_local_network_gateway",
        "azurerm_network_interface",
        "azurerm_network_interface_application_security_group_association",
        "azurerm_network_interface_backend_address_pool_association",
        "azurerm_network_interface_security_group_association",
        "azurerm_network_security_group",
        "azurerm_public_ip",
        "azurerm_route",
        "azurerm_route_table",
        "azurerm_subnet",
        "azurerm_subnet_route_table_association",
        "azurerm_virtual_machine",
        "azurerm_virtual_network_gateway_connection",
        "azurerm_virtual_network",
        "azurerm_virtual_network_gateway",
        "google_compute_network",
        "google_compute_subnetwork",
        "google_compute_vpn_gateway",
        "google_compute_vpn_tunnel",
        "google_compute_route",
        "google_compute_address",
        "google_compute_global_address",
        "google_compute_router",
        "google_compute_interconnect_attachment",
        "google_compute_ha_vpn_gateway",
        "google_compute_forwarding_rule",
        "google_compute_network_firewall_policy",
        "google_compute_network_firewall_policy_rule",
        "cloudflare_static_route",
        "cloudflare_ipsec_tunnel",
      ),
    ),
  ).pipe(T.HttpQuery("resource_type")),
  search: Schema.optional(Schema.Array(Schema.String)).pipe(
    T.HttpQuery("search"),
  ),
  v2: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("v2")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/magic/cloud/resources/export",
  }),
) as unknown as Schema.Schema<ExportResourceRequest>;

export type ExportResourceResponse = unknown;

export const ExportResourceResponse =
  Schema.Unknown as unknown as Schema.Schema<ExportResourceResponse>;

export const exportResource: (
  input: ExportResourceRequest,
) => Effect.Effect<
  ExportResourceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: ExportResourceRequest,
  output: ExportResourceResponse,
  errors: [],
}));

// =============================================================================
// SetupCloudIntegration
// =============================================================================

export interface InitialSetupCloudIntegrationRequest {
  providerId: string;
  accountId: string;
}

export const InitialSetupCloudIntegrationRequest = Schema.Struct({
  providerId: Schema.String.pipe(T.HttpPath("providerId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/magic/cloud/providers/{providerId}/initial_setup",
  }),
) as unknown as Schema.Schema<InitialSetupCloudIntegrationRequest>;

export type InitialSetupCloudIntegrationResponse =
  | { awsTrustPolicy: string; itemType: string }
  | {
      azureConsentUrl: string;
      integrationIdentityTag: string;
      itemType: string;
      tagCliCommand: string;
    }
  | { integrationIdentityTag: string; itemType: string; tagCliCommand: string };

export const InitialSetupCloudIntegrationResponse = Schema.Union(
  Schema.Struct({
    awsTrustPolicy: Schema.String.pipe(T.JsonName("aws_trust_policy")),
    itemType: Schema.String.pipe(T.JsonName("item_type")),
  }),
  Schema.Struct({
    azureConsentUrl: Schema.String.pipe(T.JsonName("azure_consent_url")),
    integrationIdentityTag: Schema.String.pipe(
      T.JsonName("integration_identity_tag"),
    ),
    itemType: Schema.String.pipe(T.JsonName("item_type")),
    tagCliCommand: Schema.String.pipe(T.JsonName("tag_cli_command")),
  }),
  Schema.Struct({
    integrationIdentityTag: Schema.String.pipe(
      T.JsonName("integration_identity_tag"),
    ),
    itemType: Schema.String.pipe(T.JsonName("item_type")),
    tagCliCommand: Schema.String.pipe(T.JsonName("tag_cli_command")),
  }),
) as unknown as Schema.Schema<InitialSetupCloudIntegrationResponse>;

export const initialSetupCloudIntegration: (
  input: InitialSetupCloudIntegrationRequest,
) => Effect.Effect<
  InitialSetupCloudIntegrationResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: InitialSetupCloudIntegrationRequest,
  output: InitialSetupCloudIntegrationResponse,
  errors: [],
}));
