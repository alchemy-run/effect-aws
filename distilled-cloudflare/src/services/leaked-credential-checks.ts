/**
 * Cloudflare LEAKED-CREDENTIAL-CHECKS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service leaked-credential-checks
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
// Detection
// =============================================================================

export interface CreateDetectionRequest {
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: Defines ehe ruleset expression to use in matching the password in a request. */
  password?: string;
  /** Body param: Defines the ruleset expression to use in matching the username in a request. */
  username?: string;
}

export const CreateDetectionRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  password: Schema.optional(Schema.String),
  username: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "POST",
    path: "/zones/{zone_id}/leaked-credential-checks/detections",
  }),
) as unknown as Schema.Schema<CreateDetectionRequest>;

export interface CreateDetectionResponse {
  /** Defines the unique ID for this custom detection. */
  id?: string;
  /** Defines ehe ruleset expression to use in matching the password in a request. */
  password?: string;
  /** Defines the ruleset expression to use in matching the username in a request. */
  username?: string;
}

export const CreateDetectionResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  password: Schema.optional(Schema.String),
  username: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateDetectionResponse>;

export const createDetection: (
  input: CreateDetectionRequest,
) => Effect.Effect<
  CreateDetectionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateDetectionRequest,
  output: CreateDetectionResponse,
  errors: [],
}));

export interface UpdateDetectionRequest {
  detectionId: string;
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: Defines ehe ruleset expression to use in matching the password in a request. */
  password?: string;
  /** Body param: Defines the ruleset expression to use in matching the username in a request. */
  username?: string;
}

export const UpdateDetectionRequest = Schema.Struct({
  detectionId: Schema.String.pipe(T.HttpPath("detectionId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  password: Schema.optional(Schema.String),
  username: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/zones/{zone_id}/leaked-credential-checks/detections/{detectionId}",
  }),
) as unknown as Schema.Schema<UpdateDetectionRequest>;

export interface UpdateDetectionResponse {
  /** Defines the unique ID for this custom detection. */
  id?: string;
  /** Defines ehe ruleset expression to use in matching the password in a request. */
  password?: string;
  /** Defines the ruleset expression to use in matching the username in a request. */
  username?: string;
}

export const UpdateDetectionResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  password: Schema.optional(Schema.String),
  username: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateDetectionResponse>;

export const updateDetection: (
  input: UpdateDetectionRequest,
) => Effect.Effect<
  UpdateDetectionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateDetectionRequest,
  output: UpdateDetectionResponse,
  errors: [],
}));

export interface DeleteDetectionRequest {
  detectionId: string;
  /** Defines an identifier. */
  zoneId: string;
}

export const DeleteDetectionRequest = Schema.Struct({
  detectionId: Schema.String.pipe(T.HttpPath("detectionId")),
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/zones/{zone_id}/leaked-credential-checks/detections/{detectionId}",
  }),
) as unknown as Schema.Schema<DeleteDetectionRequest>;

export type DeleteDetectionResponse = unknown;

export const DeleteDetectionResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteDetectionResponse>;

export const deleteDetection: (
  input: DeleteDetectionRequest,
) => Effect.Effect<
  DeleteDetectionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteDetectionRequest,
  output: DeleteDetectionResponse,
  errors: [],
}));

// =============================================================================
// LeakedCredentialCheck
// =============================================================================

export interface GetLeakedCredentialCheckRequest {
  /** Defines an identifier. */
  zoneId: string;
}

export const GetLeakedCredentialCheckRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
}).pipe(
  T.Http({ method: "GET", path: "/zones/{zone_id}/leaked-credential-checks" }),
) as unknown as Schema.Schema<GetLeakedCredentialCheckRequest>;

export interface GetLeakedCredentialCheckResponse {
  /** Determines whether or not Leaked Credential Checks are enabled. */
  enabled?: boolean;
}

export const GetLeakedCredentialCheckResponse = Schema.Struct({
  enabled: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<GetLeakedCredentialCheckResponse>;

export const getLeakedCredentialCheck: (
  input: GetLeakedCredentialCheckRequest,
) => Effect.Effect<
  GetLeakedCredentialCheckResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetLeakedCredentialCheckRequest,
  output: GetLeakedCredentialCheckResponse,
  errors: [],
}));

export interface CreateLeakedCredentialCheckRequest {
  /** Path param: Defines an identifier. */
  zoneId: string;
  /** Body param: Determines whether or not Leaked Credential Checks are enabled. */
  enabled?: boolean;
}

export const CreateLeakedCredentialCheckRequest = Schema.Struct({
  zoneId: Schema.String.pipe(T.HttpPath("zone_id")),
  enabled: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({ method: "POST", path: "/zones/{zone_id}/leaked-credential-checks" }),
) as unknown as Schema.Schema<CreateLeakedCredentialCheckRequest>;

export interface CreateLeakedCredentialCheckResponse {
  /** Determines whether or not Leaked Credential Checks are enabled. */
  enabled?: boolean;
}

export const CreateLeakedCredentialCheckResponse = Schema.Struct({
  enabled: Schema.optional(Schema.Boolean),
}) as unknown as Schema.Schema<CreateLeakedCredentialCheckResponse>;

export const createLeakedCredentialCheck: (
  input: CreateLeakedCredentialCheckRequest,
) => Effect.Effect<
  CreateLeakedCredentialCheckResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateLeakedCredentialCheckRequest,
  output: CreateLeakedCredentialCheckResponse,
  errors: [],
}));
