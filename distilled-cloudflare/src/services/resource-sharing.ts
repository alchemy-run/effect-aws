/**
 * Cloudflare RESOURCE-SHARING API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service resource-sharing
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
// Recipient
// =============================================================================

export interface GetRecipientRequest {
  shareId: string;
  recipientId: string;
  /** Path param: Account identifier. */
  accountId: string;
  /** Query param: Include resources in the response. */
  includeResources?: boolean;
}

export const GetRecipientRequest = Schema.Struct({
  shareId: Schema.String.pipe(T.HttpPath("shareId")),
  recipientId: Schema.String.pipe(T.HttpPath("recipientId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  includeResources: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("include_resources"),
  ),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/shares/{shareId}/recipients/{recipientId}",
  }),
) as unknown as Schema.Schema<GetRecipientRequest>;

export interface GetRecipientResponse {
  /** Share Recipient identifier tag. */
  id: string;
  /** Account identifier. */
  accountId: string;
  /** Share Recipient association status. */
  associationStatus:
    | "associating"
    | "associated"
    | "disassociating"
    | "disassociated";
  /** When the share was created. */
  created: string;
  /** When the share was modified. */
  modified: string;
  /** Share Recipient status message. */
  statusMessage: string;
  resources?: { error: string; resourceId: string; resourceVersion: number }[];
}

export const GetRecipientResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.String.pipe(T.JsonName("account_id")),
  associationStatus: Schema.Literal(
    "associating",
    "associated",
    "disassociating",
    "disassociated",
  ).pipe(T.JsonName("association_status")),
  created: Schema.String,
  modified: Schema.String,
  statusMessage: Schema.String.pipe(T.JsonName("status_message")),
  resources: Schema.optional(
    Schema.Array(
      Schema.Struct({
        error: Schema.String,
        resourceId: Schema.String.pipe(T.JsonName("resource_id")),
        resourceVersion: Schema.Number.pipe(T.JsonName("resource_version")),
      }),
    ),
  ),
}) as unknown as Schema.Schema<GetRecipientResponse>;

export const getRecipient: (
  input: GetRecipientRequest,
) => Effect.Effect<
  GetRecipientResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetRecipientRequest,
  output: GetRecipientResponse,
  errors: [],
}));

export interface CreateRecipientRequest {
  shareId: string;
  /** Path param: Account identifier. */
  pathAccountId: string;
  /** Body param: Account identifier. */
  bodyAccountId?: string;
  /** Body param: Organization identifier. */
  organizationId?: string;
}

export const CreateRecipientRequest = Schema.Struct({
  shareId: Schema.String.pipe(T.HttpPath("shareId")),
  pathAccountId: Schema.String.pipe(T.HttpPath("path_account_id")),
  bodyAccountId: Schema.optional(Schema.String).pipe(
    T.JsonName("body_account_id"),
  ),
  organizationId: Schema.optional(Schema.String).pipe(
    T.JsonName("organization_id"),
  ),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{path_account_id}/shares/{shareId}/recipients",
  }),
) as unknown as Schema.Schema<CreateRecipientRequest>;

export interface CreateRecipientResponse {
  /** Share Recipient identifier tag. */
  id: string;
  /** Account identifier. */
  accountId: string;
  /** Share Recipient association status. */
  associationStatus:
    | "associating"
    | "associated"
    | "disassociating"
    | "disassociated";
  /** When the share was created. */
  created: string;
  /** When the share was modified. */
  modified: string;
  /** Share Recipient status message. */
  statusMessage: string;
  resources?: { error: string; resourceId: string; resourceVersion: number }[];
}

export const CreateRecipientResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.String.pipe(T.JsonName("account_id")),
  associationStatus: Schema.Literal(
    "associating",
    "associated",
    "disassociating",
    "disassociated",
  ).pipe(T.JsonName("association_status")),
  created: Schema.String,
  modified: Schema.String,
  statusMessage: Schema.String.pipe(T.JsonName("status_message")),
  resources: Schema.optional(
    Schema.Array(
      Schema.Struct({
        error: Schema.String,
        resourceId: Schema.String.pipe(T.JsonName("resource_id")),
        resourceVersion: Schema.Number.pipe(T.JsonName("resource_version")),
      }),
    ),
  ),
}) as unknown as Schema.Schema<CreateRecipientResponse>;

export const createRecipient: (
  input: CreateRecipientRequest,
) => Effect.Effect<
  CreateRecipientResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateRecipientRequest,
  output: CreateRecipientResponse,
  errors: [],
}));

export interface DeleteRecipientRequest {
  shareId: string;
  recipientId: string;
  /** Account identifier. */
  accountId: string;
}

export const DeleteRecipientRequest = Schema.Struct({
  shareId: Schema.String.pipe(T.HttpPath("shareId")),
  recipientId: Schema.String.pipe(T.HttpPath("recipientId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/shares/{shareId}/recipients/{recipientId}",
  }),
) as unknown as Schema.Schema<DeleteRecipientRequest>;

export interface DeleteRecipientResponse {
  /** Share Recipient identifier tag. */
  id: string;
  /** Account identifier. */
  accountId: string;
  /** Share Recipient association status. */
  associationStatus:
    | "associating"
    | "associated"
    | "disassociating"
    | "disassociated";
  /** When the share was created. */
  created: string;
  /** When the share was modified. */
  modified: string;
  /** Share Recipient status message. */
  statusMessage: string;
  resources?: { error: string; resourceId: string; resourceVersion: number }[];
}

export const DeleteRecipientResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.String.pipe(T.JsonName("account_id")),
  associationStatus: Schema.Literal(
    "associating",
    "associated",
    "disassociating",
    "disassociated",
  ).pipe(T.JsonName("association_status")),
  created: Schema.String,
  modified: Schema.String,
  statusMessage: Schema.String.pipe(T.JsonName("status_message")),
  resources: Schema.optional(
    Schema.Array(
      Schema.Struct({
        error: Schema.String,
        resourceId: Schema.String.pipe(T.JsonName("resource_id")),
        resourceVersion: Schema.Number.pipe(T.JsonName("resource_version")),
      }),
    ),
  ),
}) as unknown as Schema.Schema<DeleteRecipientResponse>;

export const deleteRecipient: (
  input: DeleteRecipientRequest,
) => Effect.Effect<
  DeleteRecipientResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteRecipientRequest,
  output: DeleteRecipientResponse,
  errors: [],
}));

// =============================================================================
// Resource
// =============================================================================

export interface GetResourceRequest {
  shareId: string;
  resourceId: string;
  /** Account identifier. */
  accountId: string;
}

export const GetResourceRequest = Schema.Struct({
  shareId: Schema.String.pipe(T.HttpPath("shareId")),
  resourceId: Schema.String.pipe(T.HttpPath("resourceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/shares/{shareId}/resources/{resourceId}",
  }),
) as unknown as Schema.Schema<GetResourceRequest>;

export interface GetResourceResponse {
  /** Share Resource identifier. */
  id: string;
  /** When the share was created. */
  created: string;
  /** Resource Metadata. */
  meta: unknown;
  /** When the share was modified. */
  modified: string;
  /** Account identifier. */
  resourceAccountId: string;
  /** Share Resource identifier. */
  resourceId: string;
  /** Resource Type. */
  resourceType:
    | "custom-ruleset"
    | "widget"
    | "gateway-policy"
    | "gateway-destination-ip"
    | "gateway-block-page-settings"
    | "gateway-extended-email-matching";
  /** Resource Version. */
  resourceVersion: number;
  /** Resource Status. */
  status: "active" | "deleting" | "deleted";
}

export const GetResourceResponse = Schema.Struct({
  id: Schema.String,
  created: Schema.String,
  meta: Schema.Unknown,
  modified: Schema.String,
  resourceAccountId: Schema.String.pipe(T.JsonName("resource_account_id")),
  resourceId: Schema.String.pipe(T.JsonName("resource_id")),
  resourceType: Schema.Literal(
    "custom-ruleset",
    "widget",
    "gateway-policy",
    "gateway-destination-ip",
    "gateway-block-page-settings",
    "gateway-extended-email-matching",
  ).pipe(T.JsonName("resource_type")),
  resourceVersion: Schema.Number.pipe(T.JsonName("resource_version")),
  status: Schema.Literal("active", "deleting", "deleted"),
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

export interface CreateResourceRequest {
  shareId: string;
  /** Path param: Account identifier. */
  accountId: string;
  /** Body param: Resource Metadata. */
  meta: unknown;
  /** Body param: Account identifier. */
  resourceAccountId: string;
  /** Body param: Share Resource identifier. */
  resourceId: string;
  /** Body param: Resource Type. */
  resourceType:
    | "custom-ruleset"
    | "widget"
    | "gateway-policy"
    | "gateway-destination-ip"
    | "gateway-block-page-settings"
    | "gateway-extended-email-matching";
}

export const CreateResourceRequest = Schema.Struct({
  shareId: Schema.String.pipe(T.HttpPath("shareId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  meta: Schema.Unknown,
  resourceAccountId: Schema.String.pipe(T.JsonName("resource_account_id")),
  resourceId: Schema.String.pipe(T.JsonName("resource_id")),
  resourceType: Schema.Literal(
    "custom-ruleset",
    "widget",
    "gateway-policy",
    "gateway-destination-ip",
    "gateway-block-page-settings",
    "gateway-extended-email-matching",
  ).pipe(T.JsonName("resource_type")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/shares/{shareId}/resources",
  }),
) as unknown as Schema.Schema<CreateResourceRequest>;

export interface CreateResourceResponse {
  /** Share Resource identifier. */
  id: string;
  /** When the share was created. */
  created: string;
  /** Resource Metadata. */
  meta: unknown;
  /** When the share was modified. */
  modified: string;
  /** Account identifier. */
  resourceAccountId: string;
  /** Share Resource identifier. */
  resourceId: string;
  /** Resource Type. */
  resourceType:
    | "custom-ruleset"
    | "widget"
    | "gateway-policy"
    | "gateway-destination-ip"
    | "gateway-block-page-settings"
    | "gateway-extended-email-matching";
  /** Resource Version. */
  resourceVersion: number;
  /** Resource Status. */
  status: "active" | "deleting" | "deleted";
}

export const CreateResourceResponse = Schema.Struct({
  id: Schema.String,
  created: Schema.String,
  meta: Schema.Unknown,
  modified: Schema.String,
  resourceAccountId: Schema.String.pipe(T.JsonName("resource_account_id")),
  resourceId: Schema.String.pipe(T.JsonName("resource_id")),
  resourceType: Schema.Literal(
    "custom-ruleset",
    "widget",
    "gateway-policy",
    "gateway-destination-ip",
    "gateway-block-page-settings",
    "gateway-extended-email-matching",
  ).pipe(T.JsonName("resource_type")),
  resourceVersion: Schema.Number.pipe(T.JsonName("resource_version")),
  status: Schema.Literal("active", "deleting", "deleted"),
}) as unknown as Schema.Schema<CreateResourceResponse>;

export const createResource: (
  input: CreateResourceRequest,
) => Effect.Effect<
  CreateResourceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateResourceRequest,
  output: CreateResourceResponse,
  errors: [],
}));

export interface UpdateResourceRequest {
  shareId: string;
  resourceId: string;
  /** Path param: Account identifier. */
  accountId: string;
  /** Body param: Resource Metadata. */
  meta: unknown;
}

export const UpdateResourceRequest = Schema.Struct({
  shareId: Schema.String.pipe(T.HttpPath("shareId")),
  resourceId: Schema.String.pipe(T.HttpPath("resourceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  meta: Schema.Unknown,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/shares/{shareId}/resources/{resourceId}",
  }),
) as unknown as Schema.Schema<UpdateResourceRequest>;

export interface UpdateResourceResponse {
  /** Share Resource identifier. */
  id: string;
  /** When the share was created. */
  created: string;
  /** Resource Metadata. */
  meta: unknown;
  /** When the share was modified. */
  modified: string;
  /** Account identifier. */
  resourceAccountId: string;
  /** Share Resource identifier. */
  resourceId: string;
  /** Resource Type. */
  resourceType:
    | "custom-ruleset"
    | "widget"
    | "gateway-policy"
    | "gateway-destination-ip"
    | "gateway-block-page-settings"
    | "gateway-extended-email-matching";
  /** Resource Version. */
  resourceVersion: number;
  /** Resource Status. */
  status: "active" | "deleting" | "deleted";
}

export const UpdateResourceResponse = Schema.Struct({
  id: Schema.String,
  created: Schema.String,
  meta: Schema.Unknown,
  modified: Schema.String,
  resourceAccountId: Schema.String.pipe(T.JsonName("resource_account_id")),
  resourceId: Schema.String.pipe(T.JsonName("resource_id")),
  resourceType: Schema.Literal(
    "custom-ruleset",
    "widget",
    "gateway-policy",
    "gateway-destination-ip",
    "gateway-block-page-settings",
    "gateway-extended-email-matching",
  ).pipe(T.JsonName("resource_type")),
  resourceVersion: Schema.Number.pipe(T.JsonName("resource_version")),
  status: Schema.Literal("active", "deleting", "deleted"),
}) as unknown as Schema.Schema<UpdateResourceResponse>;

export const updateResource: (
  input: UpdateResourceRequest,
) => Effect.Effect<
  UpdateResourceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateResourceRequest,
  output: UpdateResourceResponse,
  errors: [],
}));

export interface DeleteResourceRequest {
  shareId: string;
  resourceId: string;
  /** Account identifier. */
  accountId: string;
}

export const DeleteResourceRequest = Schema.Struct({
  shareId: Schema.String.pipe(T.HttpPath("shareId")),
  resourceId: Schema.String.pipe(T.HttpPath("resourceId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/shares/{shareId}/resources/{resourceId}",
  }),
) as unknown as Schema.Schema<DeleteResourceRequest>;

export interface DeleteResourceResponse {
  /** Share Resource identifier. */
  id: string;
  /** When the share was created. */
  created: string;
  /** Resource Metadata. */
  meta: unknown;
  /** When the share was modified. */
  modified: string;
  /** Account identifier. */
  resourceAccountId: string;
  /** Share Resource identifier. */
  resourceId: string;
  /** Resource Type. */
  resourceType:
    | "custom-ruleset"
    | "widget"
    | "gateway-policy"
    | "gateway-destination-ip"
    | "gateway-block-page-settings"
    | "gateway-extended-email-matching";
  /** Resource Version. */
  resourceVersion: number;
  /** Resource Status. */
  status: "active" | "deleting" | "deleted";
}

export const DeleteResourceResponse = Schema.Struct({
  id: Schema.String,
  created: Schema.String,
  meta: Schema.Unknown,
  modified: Schema.String,
  resourceAccountId: Schema.String.pipe(T.JsonName("resource_account_id")),
  resourceId: Schema.String.pipe(T.JsonName("resource_id")),
  resourceType: Schema.Literal(
    "custom-ruleset",
    "widget",
    "gateway-policy",
    "gateway-destination-ip",
    "gateway-block-page-settings",
    "gateway-extended-email-matching",
  ).pipe(T.JsonName("resource_type")),
  resourceVersion: Schema.Number.pipe(T.JsonName("resource_version")),
  status: Schema.Literal("active", "deleting", "deleted"),
}) as unknown as Schema.Schema<DeleteResourceResponse>;

export const deleteResource: (
  input: DeleteResourceRequest,
) => Effect.Effect<
  DeleteResourceResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteResourceRequest,
  output: DeleteResourceResponse,
  errors: [],
}));

// =============================================================================
// ResourceSharing
// =============================================================================

export interface GetResourceSharingRequest {
  shareId: string;
  /** Path param: Account identifier. */
  accountId: string;
  /** Query param: Include recipient counts in the response. */
  includeRecipientCounts?: boolean;
  /** Query param: Include resources in the response. */
  includeResources?: boolean;
}

export const GetResourceSharingRequest = Schema.Struct({
  shareId: Schema.String.pipe(T.HttpPath("shareId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  includeRecipientCounts: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("include_recipient_counts"),
  ),
  includeResources: Schema.optional(Schema.Boolean).pipe(
    T.HttpQuery("include_resources"),
  ),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/shares/{shareId}" }),
) as unknown as Schema.Schema<GetResourceSharingRequest>;

export interface GetResourceSharingResponse {
  /** Share identifier tag. */
  id: string;
  /** Account identifier. */
  accountId: string;
  /** The display name of an account. */
  accountName: string;
  /** When the share was created. */
  created: string;
  /** When the share was modified. */
  modified: string;
  /** The name of the share. */
  name: string;
  /** Organization identifier. */
  organizationId: string;
  status: "active" | "deleting" | "deleted";
  targetType: "account" | "organization";
  /** The number of recipients in the 'associated' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  associatedRecipientCount?: number;
  /** The number of recipients in the 'associating' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  associatingRecipientCount?: number;
  /** The number of recipients in the 'disassociated' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  disassociatedRecipientCount?: number;
  /** The number of recipients in the 'disassociating' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  disassociatingRecipientCount?: number;
  kind?: "sent" | "received";
  /** A list of resources that are part of the share. This field is only included when requested via the 'include_resources' parameter. */
  resources?: {
    id: string;
    created: string;
    meta: unknown;
    modified: string;
    resourceAccountId: string;
    resourceId: string;
    resourceType:
      | "custom-ruleset"
      | "widget"
      | "gateway-policy"
      | "gateway-destination-ip"
      | "gateway-block-page-settings"
      | "gateway-extended-email-matching";
    resourceVersion: number;
    status: "active" | "deleting" | "deleted";
  }[];
}

export const GetResourceSharingResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.String.pipe(T.JsonName("account_id")),
  accountName: Schema.String.pipe(T.JsonName("account_name")),
  created: Schema.String,
  modified: Schema.String,
  name: Schema.String,
  organizationId: Schema.String.pipe(T.JsonName("organization_id")),
  status: Schema.Literal("active", "deleting", "deleted"),
  targetType: Schema.Literal("account", "organization").pipe(
    T.JsonName("target_type"),
  ),
  associatedRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("associated_recipient_count"),
  ),
  associatingRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("associating_recipient_count"),
  ),
  disassociatedRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("disassociated_recipient_count"),
  ),
  disassociatingRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("disassociating_recipient_count"),
  ),
  kind: Schema.optional(Schema.Literal("sent", "received")),
  resources: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        created: Schema.String,
        meta: Schema.Unknown,
        modified: Schema.String,
        resourceAccountId: Schema.String.pipe(
          T.JsonName("resource_account_id"),
        ),
        resourceId: Schema.String.pipe(T.JsonName("resource_id")),
        resourceType: Schema.Literal(
          "custom-ruleset",
          "widget",
          "gateway-policy",
          "gateway-destination-ip",
          "gateway-block-page-settings",
          "gateway-extended-email-matching",
        ).pipe(T.JsonName("resource_type")),
        resourceVersion: Schema.Number.pipe(T.JsonName("resource_version")),
        status: Schema.Literal("active", "deleting", "deleted"),
      }),
    ),
  ),
}) as unknown as Schema.Schema<GetResourceSharingResponse>;

export const getResourceSharing: (
  input: GetResourceSharingRequest,
) => Effect.Effect<
  GetResourceSharingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: GetResourceSharingRequest,
  output: GetResourceSharingResponse,
  errors: [],
}));

export interface CreateResourceSharingRequest {
  /** Path param: Account identifier. */
  accountId: string;
  /** Body param: The name of the share. */
  name: string;
  /** Body param: */
  recipients: { accountId?: string; organizationId?: string }[];
  /** Body param: */
  resources: {
    meta: unknown;
    resourceAccountId: string;
    resourceId: string;
    resourceType:
      | "custom-ruleset"
      | "widget"
      | "gateway-policy"
      | "gateway-destination-ip"
      | "gateway-block-page-settings"
      | "gateway-extended-email-matching";
  }[];
}

export const CreateResourceSharingRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  recipients: Schema.Array(
    Schema.Struct({
      accountId: Schema.optional(Schema.String).pipe(T.JsonName("account_id")),
      organizationId: Schema.optional(Schema.String).pipe(
        T.JsonName("organization_id"),
      ),
    }),
  ),
  resources: Schema.Array(
    Schema.Struct({
      meta: Schema.Unknown,
      resourceAccountId: Schema.String.pipe(T.JsonName("resource_account_id")),
      resourceId: Schema.String.pipe(T.JsonName("resource_id")),
      resourceType: Schema.Literal(
        "custom-ruleset",
        "widget",
        "gateway-policy",
        "gateway-destination-ip",
        "gateway-block-page-settings",
        "gateway-extended-email-matching",
      ).pipe(T.JsonName("resource_type")),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/shares" }),
) as unknown as Schema.Schema<CreateResourceSharingRequest>;

export interface CreateResourceSharingResponse {
  /** Share identifier tag. */
  id: string;
  /** Account identifier. */
  accountId: string;
  /** The display name of an account. */
  accountName: string;
  /** When the share was created. */
  created: string;
  /** When the share was modified. */
  modified: string;
  /** The name of the share. */
  name: string;
  /** Organization identifier. */
  organizationId: string;
  status: "active" | "deleting" | "deleted";
  targetType: "account" | "organization";
  /** The number of recipients in the 'associated' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  associatedRecipientCount?: number;
  /** The number of recipients in the 'associating' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  associatingRecipientCount?: number;
  /** The number of recipients in the 'disassociated' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  disassociatedRecipientCount?: number;
  /** The number of recipients in the 'disassociating' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  disassociatingRecipientCount?: number;
  kind?: "sent" | "received";
  /** A list of resources that are part of the share. This field is only included when requested via the 'include_resources' parameter. */
  resources?: {
    id: string;
    created: string;
    meta: unknown;
    modified: string;
    resourceAccountId: string;
    resourceId: string;
    resourceType:
      | "custom-ruleset"
      | "widget"
      | "gateway-policy"
      | "gateway-destination-ip"
      | "gateway-block-page-settings"
      | "gateway-extended-email-matching";
    resourceVersion: number;
    status: "active" | "deleting" | "deleted";
  }[];
}

export const CreateResourceSharingResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.String.pipe(T.JsonName("account_id")),
  accountName: Schema.String.pipe(T.JsonName("account_name")),
  created: Schema.String,
  modified: Schema.String,
  name: Schema.String,
  organizationId: Schema.String.pipe(T.JsonName("organization_id")),
  status: Schema.Literal("active", "deleting", "deleted"),
  targetType: Schema.Literal("account", "organization").pipe(
    T.JsonName("target_type"),
  ),
  associatedRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("associated_recipient_count"),
  ),
  associatingRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("associating_recipient_count"),
  ),
  disassociatedRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("disassociated_recipient_count"),
  ),
  disassociatingRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("disassociating_recipient_count"),
  ),
  kind: Schema.optional(Schema.Literal("sent", "received")),
  resources: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        created: Schema.String,
        meta: Schema.Unknown,
        modified: Schema.String,
        resourceAccountId: Schema.String.pipe(
          T.JsonName("resource_account_id"),
        ),
        resourceId: Schema.String.pipe(T.JsonName("resource_id")),
        resourceType: Schema.Literal(
          "custom-ruleset",
          "widget",
          "gateway-policy",
          "gateway-destination-ip",
          "gateway-block-page-settings",
          "gateway-extended-email-matching",
        ).pipe(T.JsonName("resource_type")),
        resourceVersion: Schema.Number.pipe(T.JsonName("resource_version")),
        status: Schema.Literal("active", "deleting", "deleted"),
      }),
    ),
  ),
}) as unknown as Schema.Schema<CreateResourceSharingResponse>;

export const createResourceSharing: (
  input: CreateResourceSharingRequest,
) => Effect.Effect<
  CreateResourceSharingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: CreateResourceSharingRequest,
  output: CreateResourceSharingResponse,
  errors: [],
}));

export interface UpdateResourceSharingRequest {
  shareId: string;
  /** Path param: Account identifier. */
  accountId: string;
  /** Body param: The name of the share. */
  name: string;
}

export const UpdateResourceSharingRequest = Schema.Struct({
  shareId: Schema.String.pipe(T.HttpPath("shareId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/shares/{shareId}" }),
) as unknown as Schema.Schema<UpdateResourceSharingRequest>;

export interface UpdateResourceSharingResponse {
  /** Share identifier tag. */
  id: string;
  /** Account identifier. */
  accountId: string;
  /** The display name of an account. */
  accountName: string;
  /** When the share was created. */
  created: string;
  /** When the share was modified. */
  modified: string;
  /** The name of the share. */
  name: string;
  /** Organization identifier. */
  organizationId: string;
  status: "active" | "deleting" | "deleted";
  targetType: "account" | "organization";
  /** The number of recipients in the 'associated' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  associatedRecipientCount?: number;
  /** The number of recipients in the 'associating' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  associatingRecipientCount?: number;
  /** The number of recipients in the 'disassociated' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  disassociatedRecipientCount?: number;
  /** The number of recipients in the 'disassociating' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  disassociatingRecipientCount?: number;
  kind?: "sent" | "received";
  /** A list of resources that are part of the share. This field is only included when requested via the 'include_resources' parameter. */
  resources?: {
    id: string;
    created: string;
    meta: unknown;
    modified: string;
    resourceAccountId: string;
    resourceId: string;
    resourceType:
      | "custom-ruleset"
      | "widget"
      | "gateway-policy"
      | "gateway-destination-ip"
      | "gateway-block-page-settings"
      | "gateway-extended-email-matching";
    resourceVersion: number;
    status: "active" | "deleting" | "deleted";
  }[];
}

export const UpdateResourceSharingResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.String.pipe(T.JsonName("account_id")),
  accountName: Schema.String.pipe(T.JsonName("account_name")),
  created: Schema.String,
  modified: Schema.String,
  name: Schema.String,
  organizationId: Schema.String.pipe(T.JsonName("organization_id")),
  status: Schema.Literal("active", "deleting", "deleted"),
  targetType: Schema.Literal("account", "organization").pipe(
    T.JsonName("target_type"),
  ),
  associatedRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("associated_recipient_count"),
  ),
  associatingRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("associating_recipient_count"),
  ),
  disassociatedRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("disassociated_recipient_count"),
  ),
  disassociatingRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("disassociating_recipient_count"),
  ),
  kind: Schema.optional(Schema.Literal("sent", "received")),
  resources: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        created: Schema.String,
        meta: Schema.Unknown,
        modified: Schema.String,
        resourceAccountId: Schema.String.pipe(
          T.JsonName("resource_account_id"),
        ),
        resourceId: Schema.String.pipe(T.JsonName("resource_id")),
        resourceType: Schema.Literal(
          "custom-ruleset",
          "widget",
          "gateway-policy",
          "gateway-destination-ip",
          "gateway-block-page-settings",
          "gateway-extended-email-matching",
        ).pipe(T.JsonName("resource_type")),
        resourceVersion: Schema.Number.pipe(T.JsonName("resource_version")),
        status: Schema.Literal("active", "deleting", "deleted"),
      }),
    ),
  ),
}) as unknown as Schema.Schema<UpdateResourceSharingResponse>;

export const updateResourceSharing: (
  input: UpdateResourceSharingRequest,
) => Effect.Effect<
  UpdateResourceSharingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: UpdateResourceSharingRequest,
  output: UpdateResourceSharingResponse,
  errors: [],
}));

export interface DeleteResourceSharingRequest {
  shareId: string;
  /** Account identifier. */
  accountId: string;
}

export const DeleteResourceSharingRequest = Schema.Struct({
  shareId: Schema.String.pipe(T.HttpPath("shareId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/shares/{shareId}" }),
) as unknown as Schema.Schema<DeleteResourceSharingRequest>;

export interface DeleteResourceSharingResponse {
  /** Share identifier tag. */
  id: string;
  /** Account identifier. */
  accountId: string;
  /** The display name of an account. */
  accountName: string;
  /** When the share was created. */
  created: string;
  /** When the share was modified. */
  modified: string;
  /** The name of the share. */
  name: string;
  /** Organization identifier. */
  organizationId: string;
  status: "active" | "deleting" | "deleted";
  targetType: "account" | "organization";
  /** The number of recipients in the 'associated' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  associatedRecipientCount?: number;
  /** The number of recipients in the 'associating' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  associatingRecipientCount?: number;
  /** The number of recipients in the 'disassociated' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  disassociatedRecipientCount?: number;
  /** The number of recipients in the 'disassociating' state. This field is only included when requested via the 'include_recipient_counts' parameter. */
  disassociatingRecipientCount?: number;
  kind?: "sent" | "received";
  /** A list of resources that are part of the share. This field is only included when requested via the 'include_resources' parameter. */
  resources?: {
    id: string;
    created: string;
    meta: unknown;
    modified: string;
    resourceAccountId: string;
    resourceId: string;
    resourceType:
      | "custom-ruleset"
      | "widget"
      | "gateway-policy"
      | "gateway-destination-ip"
      | "gateway-block-page-settings"
      | "gateway-extended-email-matching";
    resourceVersion: number;
    status: "active" | "deleting" | "deleted";
  }[];
}

export const DeleteResourceSharingResponse = Schema.Struct({
  id: Schema.String,
  accountId: Schema.String.pipe(T.JsonName("account_id")),
  accountName: Schema.String.pipe(T.JsonName("account_name")),
  created: Schema.String,
  modified: Schema.String,
  name: Schema.String,
  organizationId: Schema.String.pipe(T.JsonName("organization_id")),
  status: Schema.Literal("active", "deleting", "deleted"),
  targetType: Schema.Literal("account", "organization").pipe(
    T.JsonName("target_type"),
  ),
  associatedRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("associated_recipient_count"),
  ),
  associatingRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("associating_recipient_count"),
  ),
  disassociatedRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("disassociated_recipient_count"),
  ),
  disassociatingRecipientCount: Schema.optional(Schema.Number).pipe(
    T.JsonName("disassociating_recipient_count"),
  ),
  kind: Schema.optional(Schema.Literal("sent", "received")),
  resources: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        created: Schema.String,
        meta: Schema.Unknown,
        modified: Schema.String,
        resourceAccountId: Schema.String.pipe(
          T.JsonName("resource_account_id"),
        ),
        resourceId: Schema.String.pipe(T.JsonName("resource_id")),
        resourceType: Schema.Literal(
          "custom-ruleset",
          "widget",
          "gateway-policy",
          "gateway-destination-ip",
          "gateway-block-page-settings",
          "gateway-extended-email-matching",
        ).pipe(T.JsonName("resource_type")),
        resourceVersion: Schema.Number.pipe(T.JsonName("resource_version")),
        status: Schema.Literal("active", "deleting", "deleted"),
      }),
    ),
  ),
}) as unknown as Schema.Schema<DeleteResourceSharingResponse>;

export const deleteResourceSharing: (
  input: DeleteResourceSharingRequest,
) => Effect.Effect<
  DeleteResourceSharingResponse,
  CommonErrors,
  ApiToken | HttpClient.HttpClient
> = API.make(() => ({
  input: DeleteResourceSharingRequest,
  output: DeleteResourceSharingResponse,
  errors: [],
}));
