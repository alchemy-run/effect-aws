/**
 * Cloudflare WORKFLOWS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service workflows
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
// Instance
// =============================================================================

export interface GetInstanceRequest {
  workflowName: string;
  instanceId: string;
  accountId: string;
}

export const GetInstanceRequest = Schema.Struct({
  workflowName: Schema.String.pipe(T.HttpPath("workflowName")),
  instanceId: Schema.String.pipe(T.HttpPath("instanceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workflows/{workflowName}/instances/{instanceId}",
  }),
) as unknown as Schema.Schema<GetInstanceRequest>;

export interface GetInstanceResponse {
  end: string | null;
  error: { message: string; name: string } | null;
  output: string | number;
  params: unknown;
  queued: string;
  start: string | null;
  status:
    | "queued"
    | "running"
    | "paused"
    | "errored"
    | "terminated"
    | "complete"
    | "waitingForPause"
    | "waiting";
  steps: (
    | {
        attempts: {
          end: string | null;
          error: { message: string; name: string } | null;
          start: string;
          success: boolean | null;
        }[];
        config: {
          retries: {
            delay: number;
            limit: number;
            backoff?: "constant" | "linear" | "exponential";
          };
          timeout: number;
        };
        end: string | null;
        name: string;
        output: unknown;
        start: string;
        success: boolean | null;
        type: "step";
      }
    | {
        end: string;
        error: { message: string; name: string } | null;
        finished: boolean;
        name: string;
        start: string;
        type: "sleep";
      }
    | { trigger: { source: string }; type: "termination" }
    | {
        end: string;
        error: { message: string; name: string } | null;
        finished: boolean;
        name: string;
        output: string | number | boolean;
        start: string;
        type: "waitForEvent";
      }
  )[];
  success: boolean | null;
  trigger: { source: "unknown" | "api" | "binding" | "event" | "cron" };
  versionId: string;
}

export const GetInstanceResponse = Schema.Struct({
  end: Schema.Union(Schema.String, Schema.Null),
  error: Schema.Union(
    Schema.Struct({
      message: Schema.String,
      name: Schema.String,
    }),
    Schema.Null,
  ),
  output: Schema.Union(Schema.String, Schema.Number),
  params: Schema.Unknown,
  queued: Schema.String,
  start: Schema.Union(Schema.String, Schema.Null),
  status: Schema.Literal(
    "queued",
    "running",
    "paused",
    "errored",
    "terminated",
    "complete",
    "waitingForPause",
    "waiting",
  ),
  steps: Schema.Array(
    Schema.Union(
      Schema.Struct({
        attempts: Schema.Array(
          Schema.Struct({
            end: Schema.Union(Schema.String, Schema.Null),
            error: Schema.Union(
              Schema.Struct({
                message: Schema.String,
                name: Schema.String,
              }),
              Schema.Null,
            ),
            start: Schema.String,
            success: Schema.Union(Schema.Boolean, Schema.Null),
          }),
        ),
        config: Schema.Struct({
          retries: Schema.Struct({
            delay: Schema.Number,
            limit: Schema.Number,
            backoff: Schema.optional(
              Schema.Literal("constant", "linear", "exponential"),
            ),
          }),
          timeout: Schema.Number,
        }),
        end: Schema.Union(Schema.String, Schema.Null),
        name: Schema.String,
        output: Schema.Unknown,
        start: Schema.String,
        success: Schema.Union(Schema.Boolean, Schema.Null),
        type: Schema.Literal("step"),
      }),
      Schema.Struct({
        end: Schema.String,
        error: Schema.Union(
          Schema.Struct({
            message: Schema.String,
            name: Schema.String,
          }),
          Schema.Null,
        ),
        finished: Schema.Boolean,
        name: Schema.String,
        start: Schema.String,
        type: Schema.Literal("sleep"),
      }),
      Schema.Struct({
        trigger: Schema.Struct({
          source: Schema.String,
        }),
        type: Schema.Literal("termination"),
      }),
      Schema.Struct({
        end: Schema.String,
        error: Schema.Union(
          Schema.Struct({
            message: Schema.String,
            name: Schema.String,
          }),
          Schema.Null,
        ),
        finished: Schema.Boolean,
        name: Schema.String,
        output: Schema.Union(Schema.String, Schema.Number, Schema.Boolean),
        start: Schema.String,
        type: Schema.Literal("waitForEvent"),
      }),
    ),
  ),
  success: Schema.Union(Schema.Boolean, Schema.Null),
  trigger: Schema.Struct({
    source: Schema.Literal("unknown", "api", "binding", "event", "cron"),
  }),
  versionId: Schema.String,
}) as unknown as Schema.Schema<GetInstanceResponse>;

export const getInstance: (
  input: GetInstanceRequest,
) => Effect.Effect<
  GetInstanceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetInstanceRequest,
  output: GetInstanceResponse,
  errors: [],
}));

export interface CreateInstanceRequest {
  workflowName: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  instanceId?: string;
  /** Body param: */
  instanceRetention?: unknown;
  /** Body param: */
  params?: unknown;
}

export const CreateInstanceRequest = Schema.Struct({
  workflowName: Schema.String.pipe(T.HttpPath("workflowName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  instanceId: Schema.optional(Schema.String).pipe(T.JsonName("instance_id")),
  instanceRetention: Schema.optional(Schema.Unknown).pipe(
    T.JsonName("instance_retention"),
  ),
  params: Schema.optional(Schema.Unknown),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/workflows/{workflowName}/instances",
  }),
) as unknown as Schema.Schema<CreateInstanceRequest>;

export interface CreateInstanceResponse {
  id: string;
  status:
    | "queued"
    | "running"
    | "paused"
    | "errored"
    | "terminated"
    | "complete"
    | "waitingForPause"
    | "waiting";
  versionId: string;
  workflowId: string;
}

export const CreateInstanceResponse = Schema.Struct({
  id: Schema.String,
  status: Schema.Literal(
    "queued",
    "running",
    "paused",
    "errored",
    "terminated",
    "complete",
    "waitingForPause",
    "waiting",
  ),
  versionId: Schema.String.pipe(T.JsonName("version_id")),
  workflowId: Schema.String.pipe(T.JsonName("workflow_id")),
}) as unknown as Schema.Schema<CreateInstanceResponse>;

export const createInstance: (
  input: CreateInstanceRequest,
) => Effect.Effect<
  CreateInstanceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateInstanceRequest,
  output: CreateInstanceResponse,
  errors: [],
}));

// =============================================================================
// InstanceEvent
// =============================================================================

export interface CreateInstanceEventRequest {
  workflowName: string;
  instanceId: string;
  eventType: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  body?: unknown;
}

export const CreateInstanceEventRequest = Schema.Struct({
  workflowName: Schema.String.pipe(T.HttpPath("workflowName")),
  instanceId: Schema.String.pipe(T.HttpPath("instanceId")),
  eventType: Schema.String.pipe(T.HttpPath("eventType")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.optional(Schema.Unknown),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/workflows/{workflowName}/instances/{instanceId}/events/{eventType}",
  }),
) as unknown as Schema.Schema<CreateInstanceEventRequest>;

export type CreateInstanceEventResponse = unknown;

export const CreateInstanceEventResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateInstanceEventResponse>;

export const createInstanceEvent: (
  input: CreateInstanceEventRequest,
) => Effect.Effect<
  CreateInstanceEventResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateInstanceEventRequest,
  output: CreateInstanceEventResponse,
  errors: [],
}));

// =============================================================================
// InstanceStatus
// =============================================================================

export interface PatchInstanceStatusRequest {
  workflowName: string;
  instanceId: string;
  /** Path param: */
  accountId: string;
  /** Body param: Apply action to instance. */
  status: "resume" | "pause" | "terminate";
}

export const PatchInstanceStatusRequest = Schema.Struct({
  workflowName: Schema.String.pipe(T.HttpPath("workflowName")),
  instanceId: Schema.String.pipe(T.HttpPath("instanceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  status: Schema.Literal("resume", "pause", "terminate"),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/workflows/{workflowName}/instances/{instanceId}/status",
  }),
) as unknown as Schema.Schema<PatchInstanceStatusRequest>;

export interface PatchInstanceStatusResponse {
  status:
    | "queued"
    | "running"
    | "paused"
    | "errored"
    | "terminated"
    | "complete"
    | "waitingForPause"
    | "waiting";
  /** Accepts ISO 8601 with no timezone offsets and in UTC. */
  timestamp: string;
}

export const PatchInstanceStatusResponse = Schema.Struct({
  status: Schema.Literal(
    "queued",
    "running",
    "paused",
    "errored",
    "terminated",
    "complete",
    "waitingForPause",
    "waiting",
  ),
  timestamp: Schema.String,
}) as unknown as Schema.Schema<PatchInstanceStatusResponse>;

export const patchInstanceStatus: (
  input: PatchInstanceStatusRequest,
) => Effect.Effect<
  PatchInstanceStatusResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PatchInstanceStatusRequest,
  output: PatchInstanceStatusResponse,
  errors: [],
}));

// =============================================================================
// Version
// =============================================================================

export interface GetVersionRequest {
  workflowName: string;
  versionId: string;
  accountId: string;
}

export const GetVersionRequest = Schema.Struct({
  workflowName: Schema.String.pipe(T.HttpPath("workflowName")),
  versionId: Schema.String.pipe(T.HttpPath("versionId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workflows/{workflowName}/versions/{versionId}",
  }),
) as unknown as Schema.Schema<GetVersionRequest>;

export interface GetVersionResponse {
  id: string;
  className: string;
  createdOn: string;
  modifiedOn: string;
  workflowId: string;
}

export const GetVersionResponse = Schema.Struct({
  id: Schema.String,
  className: Schema.String.pipe(T.JsonName("class_name")),
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  workflowId: Schema.String.pipe(T.JsonName("workflow_id")),
}) as unknown as Schema.Schema<GetVersionResponse>;

export const getVersion: (
  input: GetVersionRequest,
) => Effect.Effect<
  GetVersionResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetVersionRequest,
  output: GetVersionResponse,
  errors: [],
}));

// =============================================================================
// Workflow
// =============================================================================

export interface GetWorkflowRequest {
  workflowName: string;
  accountId: string;
}

export const GetWorkflowRequest = Schema.Struct({
  workflowName: Schema.String.pipe(T.HttpPath("workflowName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/workflows/{workflowName}",
  }),
) as unknown as Schema.Schema<GetWorkflowRequest>;

export interface GetWorkflowResponse {
  id: string;
  className: string;
  createdOn: string;
  instances: {
    complete?: number;
    errored?: number;
    paused?: number;
    queued?: number;
    running?: number;
    terminated?: number;
    waiting?: number;
    waitingForPause?: number;
  };
  modifiedOn: string;
  name: string;
  scriptName: string;
  triggeredOn: string | null;
}

export const GetWorkflowResponse = Schema.Struct({
  id: Schema.String,
  className: Schema.String.pipe(T.JsonName("class_name")),
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  instances: Schema.Struct({
    complete: Schema.optional(Schema.Number),
    errored: Schema.optional(Schema.Number),
    paused: Schema.optional(Schema.Number),
    queued: Schema.optional(Schema.Number),
    running: Schema.optional(Schema.Number),
    terminated: Schema.optional(Schema.Number),
    waiting: Schema.optional(Schema.Number),
    waitingForPause: Schema.optional(Schema.Number),
  }),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  scriptName: Schema.String.pipe(T.JsonName("script_name")),
  triggeredOn: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("triggered_on"),
  ),
}) as unknown as Schema.Schema<GetWorkflowResponse>;

export const getWorkflow: (
  input: GetWorkflowRequest,
) => Effect.Effect<
  GetWorkflowResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetWorkflowRequest,
  output: GetWorkflowResponse,
  errors: [],
}));

export interface PutWorkflowRequest {
  workflowName: string;
  /** Path param: */
  accountId: string;
  /** Body param: */
  className: string;
  /** Body param: */
  scriptName: string;
}

export const PutWorkflowRequest = Schema.Struct({
  workflowName: Schema.String.pipe(T.HttpPath("workflowName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  className: Schema.String.pipe(T.JsonName("class_name")),
  scriptName: Schema.String.pipe(T.JsonName("script_name")),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/workflows/{workflowName}",
  }),
) as unknown as Schema.Schema<PutWorkflowRequest>;

export interface PutWorkflowResponse {
  id: string;
  className: string;
  createdOn: string;
  isDeleted: number;
  modifiedOn: string;
  name: string;
  scriptName: string;
  terminatorRunning: number;
  triggeredOn: string | null;
  versionId: string;
}

export const PutWorkflowResponse = Schema.Struct({
  id: Schema.String,
  className: Schema.String.pipe(T.JsonName("class_name")),
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  isDeleted: Schema.Number.pipe(T.JsonName("is_deleted")),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  scriptName: Schema.String.pipe(T.JsonName("script_name")),
  terminatorRunning: Schema.Number.pipe(T.JsonName("terminator_running")),
  triggeredOn: Schema.Union(Schema.String, Schema.Null).pipe(
    T.JsonName("triggered_on"),
  ),
  versionId: Schema.String.pipe(T.JsonName("version_id")),
}) as unknown as Schema.Schema<PutWorkflowResponse>;

export const putWorkflow: (
  input: PutWorkflowRequest,
) => Effect.Effect<
  PutWorkflowResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: PutWorkflowRequest,
  output: PutWorkflowResponse,
  errors: [],
}));

export interface DeleteWorkflowRequest {
  workflowName: string;
  accountId: string;
}

export const DeleteWorkflowRequest = Schema.Struct({
  workflowName: Schema.String.pipe(T.HttpPath("workflowName")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/workflows/{workflowName}",
  }),
) as unknown as Schema.Schema<DeleteWorkflowRequest>;

export interface DeleteWorkflowResponse {
  status: "ok";
  success: boolean | null;
}

export const DeleteWorkflowResponse = Schema.Struct({
  status: Schema.Literal("ok"),
  success: Schema.Union(Schema.Boolean, Schema.Null),
}) as unknown as Schema.Schema<DeleteWorkflowResponse>;

export const deleteWorkflow: (
  input: DeleteWorkflowRequest,
) => Effect.Effect<
  DeleteWorkflowResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteWorkflowRequest,
  output: DeleteWorkflowResponse,
  errors: [],
}));
