/**
 * Cloudflare API-GATEWAY API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service api-gateway
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Configuration
// =============================================================================

export interface GetConfigurationRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: Requests information about certain properties. */
  properties?: "auth_id_characteristics"[];
}

export const GetConfigurationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  properties: Schema.optional(Schema.Array(Schema.Literal("auth_id_characteristics"))).pipe(
    T.HttpQuery("properties"),
  ),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/api_gateway/configuration" }),
) as unknown as Schema.Schema<GetConfigurationRequest>;

export interface GetConfigurationResponse {
  authIdCharacteristics: (
    | { name: string; type: "header" | "cookie" }
    | { name: string; type: "jwt" }
  )[];
}

export const GetConfigurationResponse = Schema.Struct({
  authIdCharacteristics: Schema.Array(
    Schema.Union(
      Schema.Struct({
        name: Schema.String,
        type: Schema.Literal("header", "cookie"),
      }),
      Schema.Struct({
        name: Schema.String,
        type: Schema.Literal("jwt"),
      }),
    ),
  ).pipe(T.JsonName("auth_id_characteristics")),
}) as unknown as Schema.Schema<GetConfigurationResponse>;

export const getConfiguration = API.make(() => ({
  input: GetConfigurationRequest,
  output: GetConfigurationResponse,
  errors: [],
}));

export interface PutConfigurationRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: */
  authIdCharacteristics: (
    | { name: string; type: "header" | "cookie" }
    | { name: string; type: "jwt" }
  )[];
}

export const PutConfigurationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  authIdCharacteristics: Schema.Array(
    Schema.Union(
      Schema.Struct({
        name: Schema.String,
        type: Schema.Literal("header", "cookie"),
      }),
      Schema.Struct({
        name: Schema.String,
        type: Schema.Literal("jwt"),
      }),
    ),
  ).pipe(T.JsonName("auth_id_characteristics")),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/api_gateway/configuration" }),
) as unknown as Schema.Schema<PutConfigurationRequest>;

export interface PutConfigurationResponse {
  errors: unknown;
  messages: unknown;
  /** Whether the API call was successful. */
  success: true;
}

export const PutConfigurationResponse = Schema.Struct({
  errors: Schema.Unknown,
  messages: Schema.Unknown,
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<PutConfigurationResponse>;

export const putConfiguration = API.make(() => ({
  input: PutConfigurationRequest,
  output: PutConfigurationResponse,
  errors: [],
}));

// =============================================================================
// Discovery
// =============================================================================

export interface GetDiscoveryRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetDiscoveryRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/api_gateway/discovery" }),
) as unknown as Schema.Schema<GetDiscoveryRequest>;

export interface GetDiscoveryResponse {
  schemas: unknown[];
  timestamp: string;
}

export const GetDiscoveryResponse = Schema.Struct({
  schemas: Schema.Array(Schema.Unknown),
  timestamp: Schema.String,
}) as unknown as Schema.Schema<GetDiscoveryResponse>;

export const getDiscovery = API.make(() => ({
  input: GetDiscoveryRequest,
  output: GetDiscoveryResponse,
  errors: [],
}));

// =============================================================================
// DiscoveryOperation
// =============================================================================

export interface PatchDiscoveryOperationRequest {
  operationId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Mark state of operation in API Discovery  - `review` - Mark operation as for review - `ignored` - Mark operation as ignored */
  state?: "review" | "ignored";
}

export const PatchDiscoveryOperationRequest = Schema.Struct({
  operationId: Schema.String.pipe(T.HttpPath("operationId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  state: Schema.optional(Schema.Literal("review", "ignored")),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/zones/{zone_id}/api_gateway/discovery/operations/{operationId}",
  }),
) as unknown as Schema.Schema<PatchDiscoveryOperationRequest>;

export interface PatchDiscoveryOperationResponse {
  /** State of operation in API Discovery  - `review` - Operation is not saved into API Shield Endpoint Management - `saved` - Operation is saved into API Shield Endpoint Management - `ignored` - Operation  */
  state?: "review" | "saved" | "ignored";
}

export const PatchDiscoveryOperationResponse = Schema.Struct({
  state: Schema.optional(Schema.Literal("review", "saved", "ignored")),
}) as unknown as Schema.Schema<PatchDiscoveryOperationResponse>;

export const patchDiscoveryOperation = API.make(() => ({
  input: PatchDiscoveryOperationRequest,
  output: PatchDiscoveryOperationResponse,
  errors: [],
}));

export interface BulkPatchDiscoveryOperationsRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: */
  body: Record<string, unknown>;
}

export const BulkPatchDiscoveryOperationsRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  body: Schema.Struct({}),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/api_gateway/discovery/operations" }),
) as unknown as Schema.Schema<BulkPatchDiscoveryOperationsRequest>;

export type BulkPatchDiscoveryOperationsResponse = Record<string, unknown>;

export const BulkPatchDiscoveryOperationsResponse = Schema.Struct(
  {},
) as unknown as Schema.Schema<BulkPatchDiscoveryOperationsResponse>;

export const bulkPatchDiscoveryOperations = API.make(() => ({
  input: BulkPatchDiscoveryOperationsRequest,
  output: BulkPatchDiscoveryOperationsResponse,
  errors: [],
}));

// =============================================================================
// ExpressionTemplateFallthrough
// =============================================================================

export interface CreateExpressionTemplateFallthroughRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: List of hosts to be targeted in the expression */
  hosts: string[];
}

export const CreateExpressionTemplateFallthroughRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  hosts: Schema.Array(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/api_gateway/expression-template/fallthrough" }),
) as unknown as Schema.Schema<CreateExpressionTemplateFallthroughRequest>;

export interface CreateExpressionTemplateFallthroughResponse {
  /** WAF Expression for fallthrough */
  expression: string;
  /** Title for the expression */
  title: string;
}

export const CreateExpressionTemplateFallthroughResponse = Schema.Struct({
  expression: Schema.String,
  title: Schema.String,
}) as unknown as Schema.Schema<CreateExpressionTemplateFallthroughResponse>;

export const createExpressionTemplateFallthrough = API.make(() => ({
  input: CreateExpressionTemplateFallthroughRequest,
  output: CreateExpressionTemplateFallthroughResponse,
  errors: [],
}));

// =============================================================================
// Operation
// =============================================================================

export interface GetOperationRequest {
  operationId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: Add feature(s) to the results. The feature name that is given here corresponds to the resulting feature object. Have a look at the top-level object description for more details on the spe */
  feature?: ("thresholds" | "parameter_schemas" | "schema_info")[];
}

export const GetOperationRequest = Schema.Struct({
  operationId: Schema.String.pipe(T.HttpPath("operationId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  feature: Schema.optional(
    Schema.Array(Schema.Literal("thresholds", "parameter_schemas", "schema_info")),
  ).pipe(T.HttpQuery("feature")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/api_gateway/operations/{operationId}" }),
) as unknown as Schema.Schema<GetOperationRequest>;

export interface GetOperationResponse {
  /** The endpoint which can contain path parameter templates in curly braces, each will be replaced from left to right with {varN}, starting with {var1}, during insertion. This will further be Cloudflare-n */
  endpoint: string;
  /** RFC3986-compliant host. */
  host: string;
  lastUpdated: string;
  /** The HTTP method used to access the endpoint. */
  method: "GET" | "POST" | "HEAD" | "OPTIONS" | "PUT" | "DELETE" | "CONNECT" | "PATCH" | "TRACE";
  /** UUID. */
  operationId: string;
  features?:
    | {
        thresholds?: {
          authIdTokens?: number;
          dataPoints?: number;
          lastUpdated?: string;
          p50?: number;
          p90?: number;
          p99?: number;
          periodSeconds?: number;
          requests?: number;
          suggestedThreshold?: number;
        };
      }
    | {
        parameterSchemas: {
          lastUpdated?: string;
          parameterSchemas?: { parameters?: unknown[]; responses?: null };
        };
      }
    | { apiRouting?: { lastUpdated?: string; route?: string } }
    | {
        confidenceIntervals?: {
          lastUpdated?: string;
          suggestedThreshold?: {
            confidenceIntervals?: {
              p90?: { lower?: number; upper?: number };
              p95?: { lower?: number; upper?: number };
              p99?: { lower?: number; upper?: number };
            };
            mean?: number;
          };
        };
      }
    | {
        schemaInfo?: {
          activeSchema?: { id?: string; createdAt?: string; isLearned?: boolean; name?: string };
          learnedAvailable?: boolean;
          mitigationAction?: "none" | "log" | "block" | null;
        };
      };
}

export const GetOperationResponse = Schema.Struct({
  endpoint: Schema.String,
  host: Schema.String,
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  method: Schema.Literal(
    "GET",
    "POST",
    "HEAD",
    "OPTIONS",
    "PUT",
    "DELETE",
    "CONNECT",
    "PATCH",
    "TRACE",
  ),
  operationId: Schema.String.pipe(T.JsonName("operation_id")),
  features: Schema.optional(
    Schema.Union(
      Schema.Struct({
        thresholds: Schema.optional(
          Schema.Struct({
            authIdTokens: Schema.optional(Schema.Number).pipe(T.JsonName("auth_id_tokens")),
            dataPoints: Schema.optional(Schema.Number).pipe(T.JsonName("data_points")),
            lastUpdated: Schema.optional(Schema.String).pipe(T.JsonName("last_updated")),
            p50: Schema.optional(Schema.Number),
            p90: Schema.optional(Schema.Number),
            p99: Schema.optional(Schema.Number),
            periodSeconds: Schema.optional(Schema.Number).pipe(T.JsonName("period_seconds")),
            requests: Schema.optional(Schema.Number),
            suggestedThreshold: Schema.optional(Schema.Number).pipe(
              T.JsonName("suggested_threshold"),
            ),
          }),
        ),
      }),
      Schema.Struct({
        parameterSchemas: Schema.Struct({
          lastUpdated: Schema.optional(Schema.String).pipe(T.JsonName("last_updated")),
          parameterSchemas: Schema.optional(
            Schema.Struct({
              parameters: Schema.optional(Schema.Array(Schema.Unknown)),
              responses: Schema.optional(Schema.Null),
            }),
          ).pipe(T.JsonName("parameter_schemas")),
        }).pipe(T.JsonName("parameter_schemas")),
      }),
      Schema.Struct({
        apiRouting: Schema.optional(
          Schema.Struct({
            lastUpdated: Schema.optional(Schema.String).pipe(T.JsonName("last_updated")),
            route: Schema.optional(Schema.String),
          }),
        ).pipe(T.JsonName("api_routing")),
      }),
      Schema.Struct({
        confidenceIntervals: Schema.optional(
          Schema.Struct({
            lastUpdated: Schema.optional(Schema.String).pipe(T.JsonName("last_updated")),
            suggestedThreshold: Schema.optional(
              Schema.Struct({
                confidenceIntervals: Schema.optional(
                  Schema.Struct({
                    p90: Schema.optional(
                      Schema.Struct({
                        lower: Schema.optional(Schema.Number),
                        upper: Schema.optional(Schema.Number),
                      }),
                    ),
                    p95: Schema.optional(
                      Schema.Struct({
                        lower: Schema.optional(Schema.Number),
                        upper: Schema.optional(Schema.Number),
                      }),
                    ),
                    p99: Schema.optional(
                      Schema.Struct({
                        lower: Schema.optional(Schema.Number),
                        upper: Schema.optional(Schema.Number),
                      }),
                    ),
                  }),
                ).pipe(T.JsonName("confidence_intervals")),
                mean: Schema.optional(Schema.Number),
              }),
            ).pipe(T.JsonName("suggested_threshold")),
          }),
        ).pipe(T.JsonName("confidence_intervals")),
      }),
      Schema.Struct({
        schemaInfo: Schema.optional(
          Schema.Struct({
            activeSchema: Schema.optional(
              Schema.Struct({
                id: Schema.optional(Schema.String),
                createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
                isLearned: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_learned")),
                name: Schema.optional(Schema.String),
              }),
            ).pipe(T.JsonName("active_schema")),
            learnedAvailable: Schema.optional(Schema.Boolean).pipe(T.JsonName("learned_available")),
            mitigationAction: Schema.optional(
              Schema.Union(
                Schema.Literal("none"),
                Schema.Literal("log"),
                Schema.Literal("block"),
                Schema.Null,
              ),
            ).pipe(T.JsonName("mitigation_action")),
          }),
        ).pipe(T.JsonName("schema_info")),
      }),
    ),
  ),
}) as unknown as Schema.Schema<GetOperationResponse>;

export const getOperation = API.make(() => ({
  input: GetOperationRequest,
  output: GetOperationResponse,
  errors: [],
}));

export interface CreateOperationRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: The endpoint which can contain path parameter templates in curly braces, each will be replaced from left to right with {varN}, starting with {var1}, during insertion. This will further be  */
  endpoint: string;
  /** Body param: RFC3986-compliant host. */
  host: string;
  /** Body param: The HTTP method used to access the endpoint. */
  method: "GET" | "POST" | "HEAD" | "OPTIONS" | "PUT" | "DELETE" | "CONNECT" | "PATCH" | "TRACE";
}

export const CreateOperationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  endpoint: Schema.String.pipe(T.HttpPath("endpoint")),
  host: Schema.String,
  method: Schema.Literal(
    "GET",
    "POST",
    "HEAD",
    "OPTIONS",
    "PUT",
    "DELETE",
    "CONNECT",
    "PATCH",
    "TRACE",
  ),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/api_gateway/operations/item" }),
) as unknown as Schema.Schema<CreateOperationRequest>;

export interface CreateOperationResponse {
  /** The endpoint which can contain path parameter templates in curly braces, each will be replaced from left to right with {varN}, starting with {var1}, during insertion. This will further be Cloudflare-n */
  endpoint: string;
  /** RFC3986-compliant host. */
  host: string;
  lastUpdated: string;
  /** The HTTP method used to access the endpoint. */
  method: "GET" | "POST" | "HEAD" | "OPTIONS" | "PUT" | "DELETE" | "CONNECT" | "PATCH" | "TRACE";
  /** UUID. */
  operationId: string;
  features?:
    | {
        thresholds?: {
          authIdTokens?: number;
          dataPoints?: number;
          lastUpdated?: string;
          p50?: number;
          p90?: number;
          p99?: number;
          periodSeconds?: number;
          requests?: number;
          suggestedThreshold?: number;
        };
      }
    | {
        parameterSchemas: {
          lastUpdated?: string;
          parameterSchemas?: { parameters?: unknown[]; responses?: null };
        };
      }
    | { apiRouting?: { lastUpdated?: string; route?: string } }
    | {
        confidenceIntervals?: {
          lastUpdated?: string;
          suggestedThreshold?: {
            confidenceIntervals?: {
              p90?: { lower?: number; upper?: number };
              p95?: { lower?: number; upper?: number };
              p99?: { lower?: number; upper?: number };
            };
            mean?: number;
          };
        };
      }
    | {
        schemaInfo?: {
          activeSchema?: { id?: string; createdAt?: string; isLearned?: boolean; name?: string };
          learnedAvailable?: boolean;
          mitigationAction?: "none" | "log" | "block" | null;
        };
      };
}

export const CreateOperationResponse = Schema.Struct({
  endpoint: Schema.String,
  host: Schema.String,
  lastUpdated: Schema.String.pipe(T.JsonName("last_updated")),
  method: Schema.Literal(
    "GET",
    "POST",
    "HEAD",
    "OPTIONS",
    "PUT",
    "DELETE",
    "CONNECT",
    "PATCH",
    "TRACE",
  ),
  operationId: Schema.String.pipe(T.JsonName("operation_id")),
  features: Schema.optional(
    Schema.Union(
      Schema.Struct({
        thresholds: Schema.optional(
          Schema.Struct({
            authIdTokens: Schema.optional(Schema.Number).pipe(T.JsonName("auth_id_tokens")),
            dataPoints: Schema.optional(Schema.Number).pipe(T.JsonName("data_points")),
            lastUpdated: Schema.optional(Schema.String).pipe(T.JsonName("last_updated")),
            p50: Schema.optional(Schema.Number),
            p90: Schema.optional(Schema.Number),
            p99: Schema.optional(Schema.Number),
            periodSeconds: Schema.optional(Schema.Number).pipe(T.JsonName("period_seconds")),
            requests: Schema.optional(Schema.Number),
            suggestedThreshold: Schema.optional(Schema.Number).pipe(
              T.JsonName("suggested_threshold"),
            ),
          }),
        ),
      }),
      Schema.Struct({
        parameterSchemas: Schema.Struct({
          lastUpdated: Schema.optional(Schema.String).pipe(T.JsonName("last_updated")),
          parameterSchemas: Schema.optional(
            Schema.Struct({
              parameters: Schema.optional(Schema.Array(Schema.Unknown)),
              responses: Schema.optional(Schema.Null),
            }),
          ).pipe(T.JsonName("parameter_schemas")),
        }).pipe(T.JsonName("parameter_schemas")),
      }),
      Schema.Struct({
        apiRouting: Schema.optional(
          Schema.Struct({
            lastUpdated: Schema.optional(Schema.String).pipe(T.JsonName("last_updated")),
            route: Schema.optional(Schema.String),
          }),
        ).pipe(T.JsonName("api_routing")),
      }),
      Schema.Struct({
        confidenceIntervals: Schema.optional(
          Schema.Struct({
            lastUpdated: Schema.optional(Schema.String).pipe(T.JsonName("last_updated")),
            suggestedThreshold: Schema.optional(
              Schema.Struct({
                confidenceIntervals: Schema.optional(
                  Schema.Struct({
                    p90: Schema.optional(
                      Schema.Struct({
                        lower: Schema.optional(Schema.Number),
                        upper: Schema.optional(Schema.Number),
                      }),
                    ),
                    p95: Schema.optional(
                      Schema.Struct({
                        lower: Schema.optional(Schema.Number),
                        upper: Schema.optional(Schema.Number),
                      }),
                    ),
                    p99: Schema.optional(
                      Schema.Struct({
                        lower: Schema.optional(Schema.Number),
                        upper: Schema.optional(Schema.Number),
                      }),
                    ),
                  }),
                ).pipe(T.JsonName("confidence_intervals")),
                mean: Schema.optional(Schema.Number),
              }),
            ).pipe(T.JsonName("suggested_threshold")),
          }),
        ).pipe(T.JsonName("confidence_intervals")),
      }),
      Schema.Struct({
        schemaInfo: Schema.optional(
          Schema.Struct({
            activeSchema: Schema.optional(
              Schema.Struct({
                id: Schema.optional(Schema.String),
                createdAt: Schema.optional(Schema.String).pipe(T.JsonName("created_at")),
                isLearned: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_learned")),
                name: Schema.optional(Schema.String),
              }),
            ).pipe(T.JsonName("active_schema")),
            learnedAvailable: Schema.optional(Schema.Boolean).pipe(T.JsonName("learned_available")),
            mitigationAction: Schema.optional(
              Schema.Union(
                Schema.Literal("none"),
                Schema.Literal("log"),
                Schema.Literal("block"),
                Schema.Null,
              ),
            ).pipe(T.JsonName("mitigation_action")),
          }),
        ).pipe(T.JsonName("schema_info")),
      }),
    ),
  ),
}) as unknown as Schema.Schema<CreateOperationResponse>;

export const createOperation = API.make(() => ({
  input: CreateOperationRequest,
  output: CreateOperationResponse,
  errors: [],
}));

export interface DeleteOperationRequest {
  operationId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteOperationRequest = Schema.Struct({
  operationId: Schema.String.pipe(T.HttpPath("operationId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/api_gateway/operations/{operationId}" }),
) as unknown as Schema.Schema<DeleteOperationRequest>;

export interface DeleteOperationResponse {
  errors: unknown;
  messages: unknown;
  /** Whether the API call was successful. */
  success: true;
}

export const DeleteOperationResponse = Schema.Struct({
  errors: Schema.Unknown,
  messages: Schema.Unknown,
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<DeleteOperationResponse>;

export const deleteOperation = API.make(() => ({
  input: DeleteOperationRequest,
  output: DeleteOperationResponse,
  errors: [],
}));

export interface BulkDeleteOperationsRequest {
  /** Identifier. */
  zoneId: string;
}

export const BulkDeleteOperationsRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/api_gateway/operations" }),
) as unknown as Schema.Schema<BulkDeleteOperationsRequest>;

export interface BulkDeleteOperationsResponse {
  errors: unknown;
  messages: unknown;
  /** Whether the API call was successful. */
  success: true;
}

export const BulkDeleteOperationsResponse = Schema.Struct({
  errors: Schema.Unknown,
  messages: Schema.Unknown,
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<BulkDeleteOperationsResponse>;

export const bulkDeleteOperations = API.make(() => ({
  input: BulkDeleteOperationsRequest,
  output: BulkDeleteOperationsResponse,
  errors: [],
}));

// =============================================================================
// OperationSchemaValidation
// =============================================================================

export interface GetOperationSchemaValidationRequest {
  operationId: string;
  /** Identifier. */
  zoneId: string;
}

export const GetOperationSchemaValidationRequest = Schema.Struct({
  operationId: Schema.String.pipe(T.HttpPath("operationId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/zones/{zone_id}/api_gateway/operations/{operationId}/schema_validation",
  }),
) as unknown as Schema.Schema<GetOperationSchemaValidationRequest>;

export interface GetOperationSchemaValidationResponse {
  /** When set, this applies a mitigation action to this operation  - `log` log request when request does not conform to schema for this operation - `block` deny access to the site when request does not con */
  mitigationAction?: "log" | "block" | "none" | null;
  /** UUID. */
  operationId?: string;
}

export const GetOperationSchemaValidationResponse = Schema.Struct({
  mitigationAction: Schema.optional(
    Schema.Union(
      Schema.Literal("log"),
      Schema.Literal("block"),
      Schema.Literal("none"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("mitigation_action")),
  operationId: Schema.optional(Schema.String).pipe(T.JsonName("operation_id")),
}) as unknown as Schema.Schema<GetOperationSchemaValidationResponse>;

export const getOperationSchemaValidation = API.make(() => ({
  input: GetOperationSchemaValidationRequest,
  output: GetOperationSchemaValidationResponse,
  errors: [],
}));

export interface PutOperationSchemaValidationRequest {
  operationId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: When set, this applies a mitigation action to this operation  - `log` log request when request does not conform to schema for this operation - `block` deny access to the site when request  */
  mitigationAction?: "log" | "block" | "none" | null;
}

export const PutOperationSchemaValidationRequest = Schema.Struct({
  operationId: Schema.String.pipe(T.HttpPath("operationId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  mitigationAction: Schema.optional(
    Schema.Union(
      Schema.Literal("log"),
      Schema.Literal("block"),
      Schema.Literal("none"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("mitigation_action")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/zones/{zone_id}/api_gateway/operations/{operationId}/schema_validation",
  }),
) as unknown as Schema.Schema<PutOperationSchemaValidationRequest>;

export interface PutOperationSchemaValidationResponse {
  /** When set, this applies a mitigation action to this operation  - `log` log request when request does not conform to schema for this operation - `block` deny access to the site when request does not con */
  mitigationAction?: "log" | "block" | "none" | null;
  /** UUID. */
  operationId?: string;
}

export const PutOperationSchemaValidationResponse = Schema.Struct({
  mitigationAction: Schema.optional(
    Schema.Union(
      Schema.Literal("log"),
      Schema.Literal("block"),
      Schema.Literal("none"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("mitigation_action")),
  operationId: Schema.optional(Schema.String).pipe(T.JsonName("operation_id")),
}) as unknown as Schema.Schema<PutOperationSchemaValidationResponse>;

export const putOperationSchemaValidation = API.make(() => ({
  input: PutOperationSchemaValidationRequest,
  output: PutOperationSchemaValidationResponse,
  errors: [],
}));

export interface PatchOperationSchemaValidationRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: */
  settingsMultipleRequest: unknown;
}

export const PatchOperationSchemaValidationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  settingsMultipleRequest: Schema.Unknown.pipe(T.JsonName("settings_multiple_request")),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/api_gateway/operations/schema_validation" }),
) as unknown as Schema.Schema<PatchOperationSchemaValidationRequest>;

export type PatchOperationSchemaValidationResponse = Record<string, unknown>;

export const PatchOperationSchemaValidationResponse = Schema.Struct(
  {},
) as unknown as Schema.Schema<PatchOperationSchemaValidationResponse>;

export const patchOperationSchemaValidation = API.make(() => ({
  input: PatchOperationSchemaValidationRequest,
  output: PatchOperationSchemaValidationResponse,
  errors: [],
}));

// =============================================================================
// Schema
// =============================================================================

export interface ListSchemasRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: Add feature(s) to the results. The feature name that is given here corresponds to the resulting feature object. Have a look at the top-level object description for more details on the spe */
  feature?: ("thresholds" | "parameter_schemas" | "schema_info")[];
  /** Query param: Receive schema only for the given host(s). */
  host?: string[];
}

export const ListSchemasRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  feature: Schema.optional(
    Schema.Array(Schema.Literal("thresholds", "parameter_schemas", "schema_info")),
  ).pipe(T.HttpQuery("feature")),
  host: Schema.optional(Schema.Array(Schema.String)).pipe(T.HttpQuery("host")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/api_gateway/schemas" }),
) as unknown as Schema.Schema<ListSchemasRequest>;

export interface ListSchemasResponse {
  schemas?: unknown[];
  timestamp?: string;
}

export const ListSchemasResponse = Schema.Struct({
  schemas: Schema.optional(Schema.Array(Schema.Unknown)),
  timestamp: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<ListSchemasResponse>;

export const listSchemas = API.make(() => ({
  input: ListSchemasRequest,
  output: ListSchemasResponse,
  errors: [],
}));

// =============================================================================
// SettingSchemaValidation
// =============================================================================

export interface GetSettingSchemaValidationRequest {
  /** Identifier. */
  zoneId: string;
}

export const GetSettingSchemaValidationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/api_gateway/settings/schema_validation" }),
) as unknown as Schema.Schema<GetSettingSchemaValidationRequest>;

export type GetSettingSchemaValidationResponse = unknown;

export const GetSettingSchemaValidationResponse =
  Schema.Unknown as unknown as Schema.Schema<GetSettingSchemaValidationResponse>;

export const getSettingSchemaValidation = API.make(() => ({
  input: GetSettingSchemaValidationRequest,
  output: GetSettingSchemaValidationResponse,
  errors: [],
}));

export interface PutSettingSchemaValidationRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: The default mitigation action used when there is no mitigation action defined on the operation  Mitigation actions are as follows:  - `log` - log request when request does not conform to s */
  validationDefaultMitigationAction: "none" | "log" | "block";
  /** Body param: When set, this overrides both zone level and operation level mitigation actions.  - `none` will skip running schema validation entirely for the request - `null` indicates that no override  */
  validationOverrideMitigationAction?: "none" | "disable_override" | null;
}

export const PutSettingSchemaValidationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  validationDefaultMitigationAction: Schema.Literal("none", "log", "block").pipe(
    T.JsonName("validation_default_mitigation_action"),
  ),
  validationOverrideMitigationAction: Schema.optional(
    Schema.Union(Schema.Literal("none"), Schema.Literal("disable_override"), Schema.Null),
  ).pipe(T.JsonName("validation_override_mitigation_action")),
}).pipe(
  T.Http({ method: "PUT", path: "/zones/{zone_id}/api_gateway/settings/schema_validation" }),
) as unknown as Schema.Schema<PutSettingSchemaValidationRequest>;

export type PutSettingSchemaValidationResponse = unknown;

export const PutSettingSchemaValidationResponse =
  Schema.Unknown as unknown as Schema.Schema<PutSettingSchemaValidationResponse>;

export const putSettingSchemaValidation = API.make(() => ({
  input: PutSettingSchemaValidationRequest,
  output: PutSettingSchemaValidationResponse,
  errors: [],
}));

export interface PatchSettingSchemaValidationRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: The default mitigation action used when there is no mitigation action defined on the operation Mitigation actions are as follows:  - `log` - log request when request does not conform to sc */
  validationDefaultMitigationAction?: "none" | "log" | "block" | null;
  /** Body param: When set, this overrides both zone level and operation level mitigation actions.  - `none` will skip running schema validation entirely for the request  To clear any override, use the spec */
  validationOverrideMitigationAction?: "none" | "disable_override" | null;
}

export const PatchSettingSchemaValidationRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  validationDefaultMitigationAction: Schema.optional(
    Schema.Union(
      Schema.Literal("none"),
      Schema.Literal("log"),
      Schema.Literal("block"),
      Schema.Null,
    ),
  ).pipe(T.JsonName("validation_default_mitigation_action")),
  validationOverrideMitigationAction: Schema.optional(
    Schema.Union(Schema.Literal("none"), Schema.Literal("disable_override"), Schema.Null),
  ).pipe(T.JsonName("validation_override_mitigation_action")),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/api_gateway/settings/schema_validation" }),
) as unknown as Schema.Schema<PatchSettingSchemaValidationRequest>;

export type PatchSettingSchemaValidationResponse = unknown;

export const PatchSettingSchemaValidationResponse =
  Schema.Unknown as unknown as Schema.Schema<PatchSettingSchemaValidationResponse>;

export const patchSettingSchemaValidation = API.make(() => ({
  input: PatchSettingSchemaValidationRequest,
  output: PatchSettingSchemaValidationResponse,
  errors: [],
}));

// =============================================================================
// UserSchema
// =============================================================================

export interface GetUserSchemaRequest {
  schemaId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Query param: Omit the source-files of schemas and only retrieve their meta-data. */
  omitSource?: boolean;
}

export const GetUserSchemaRequest = Schema.Struct({
  schemaId: Schema.String.pipe(T.HttpPath("schemaId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  omitSource: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("omit_source")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/api_gateway/user_schemas/{schemaId}" }),
) as unknown as Schema.Schema<GetUserSchemaRequest>;

export interface GetUserSchemaResponse {
  createdAt: string;
  /** Kind of schema */
  kind: "openapi_v3";
  /** Name of the schema */
  name: string;
  /** UUID. */
  schemaId: string;
  /** Source of the schema */
  source?: string;
  /** Flag whether schema is enabled for validation. */
  validationEnabled?: boolean;
}

export const GetUserSchemaResponse = Schema.Struct({
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  kind: Schema.Literal("openapi_v3"),
  name: Schema.String,
  schemaId: Schema.String.pipe(T.JsonName("schema_id")),
  source: Schema.optional(Schema.String),
  validationEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("validation_enabled")),
}) as unknown as Schema.Schema<GetUserSchemaResponse>;

export const getUserSchema = API.make(() => ({
  input: GetUserSchemaRequest,
  output: GetUserSchemaResponse,
  errors: [],
}));

export interface CreateUserSchemaRequest {
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Schema file bytes */
  file: unknown;
  /** Body param: Kind of schema */
  kind: "openapi_v3";
  /** Body param: Name of the schema */
  name?: string;
  /** Body param: Flag whether schema is enabled for validation. */
  validationEnabled?: true | false;
}

export const CreateUserSchemaRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  file: Schema.Unknown,
  kind: Schema.Literal("openapi_v3"),
  name: Schema.optional(Schema.String),
  validationEnabled: Schema.optional(Schema.Literal(true, false)).pipe(
    T.JsonName("validation_enabled"),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/api_gateway/user_schemas" }),
) as unknown as Schema.Schema<CreateUserSchemaRequest>;

export interface CreateUserSchemaResponse {
  schema: {
    createdAt: string;
    kind: "openapi_v3";
    name: string;
    schemaId: string;
    source?: string;
    validationEnabled?: boolean;
  };
  uploadDetails?: { warnings?: { code: number; locations?: string[]; message?: string }[] };
}

export const CreateUserSchemaResponse = Schema.Struct({
  schema: Schema.Struct({
    createdAt: Schema.String.pipe(T.JsonName("created_at")),
    kind: Schema.Literal("openapi_v3"),
    name: Schema.String,
    schemaId: Schema.String.pipe(T.JsonName("schema_id")),
    source: Schema.optional(Schema.String),
    validationEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("validation_enabled")),
  }),
  uploadDetails: Schema.optional(
    Schema.Struct({
      warnings: Schema.optional(
        Schema.Array(
          Schema.Struct({
            code: Schema.Number,
            locations: Schema.optional(Schema.Array(Schema.String)),
            message: Schema.optional(Schema.String),
          }),
        ),
      ),
    }),
  ).pipe(T.JsonName("upload_details")),
}) as unknown as Schema.Schema<CreateUserSchemaResponse>;

export const createUserSchema = API.make(() => ({
  input: CreateUserSchemaRequest,
  output: CreateUserSchemaResponse,
  errors: [],
}));

export interface PatchUserSchemaRequest {
  schemaId: string;
  /** Path param: Identifier. */
  zoneId: string;
  /** Body param: Flag whether schema is enabled for validation. */
  validationEnabled?: true;
}

export const PatchUserSchemaRequest = Schema.Struct({
  schemaId: Schema.String.pipe(T.HttpPath("schemaId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  validationEnabled: Schema.optional(Schema.Literal(true)).pipe(T.JsonName("validation_enabled")),
}).pipe(
  T.Http({ method: "PATCH", path: "/zones/{zone_id}/api_gateway/user_schemas/{schemaId}" }),
) as unknown as Schema.Schema<PatchUserSchemaRequest>;

export interface PatchUserSchemaResponse {
  createdAt: string;
  /** Kind of schema */
  kind: "openapi_v3";
  /** Name of the schema */
  name: string;
  /** UUID. */
  schemaId: string;
  /** Source of the schema */
  source?: string;
  /** Flag whether schema is enabled for validation. */
  validationEnabled?: boolean;
}

export const PatchUserSchemaResponse = Schema.Struct({
  createdAt: Schema.String.pipe(T.JsonName("created_at")),
  kind: Schema.Literal("openapi_v3"),
  name: Schema.String,
  schemaId: Schema.String.pipe(T.JsonName("schema_id")),
  source: Schema.optional(Schema.String),
  validationEnabled: Schema.optional(Schema.Boolean).pipe(T.JsonName("validation_enabled")),
}) as unknown as Schema.Schema<PatchUserSchemaResponse>;

export const patchUserSchema = API.make(() => ({
  input: PatchUserSchemaRequest,
  output: PatchUserSchemaResponse,
  errors: [],
}));

export interface DeleteUserSchemaRequest {
  schemaId: string;
  /** Identifier. */
  zoneId: string;
}

export const DeleteUserSchemaRequest = Schema.Struct({
  schemaId: Schema.String.pipe(T.HttpPath("schemaId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/zones/{zone_id}/api_gateway/user_schemas/{schemaId}" }),
) as unknown as Schema.Schema<DeleteUserSchemaRequest>;

export interface DeleteUserSchemaResponse {
  errors: unknown;
  messages: unknown;
  /** Whether the API call was successful. */
  success: true;
}

export const DeleteUserSchemaResponse = Schema.Struct({
  errors: Schema.Unknown,
  messages: Schema.Unknown,
  success: Schema.Literal(true),
}) as unknown as Schema.Schema<DeleteUserSchemaResponse>;

export const deleteUserSchema = API.make(() => ({
  input: DeleteUserSchemaRequest,
  output: DeleteUserSchemaResponse,
  errors: [],
}));
