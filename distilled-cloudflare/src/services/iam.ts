/**
 * Cloudflare IAM API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service iam
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// PermissionGroup
// =============================================================================

export interface GetPermissionGroupRequest {
  permissionGroupId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const GetPermissionGroupRequest = Schema.Struct({
  permissionGroupId: Schema.String.pipe(T.HttpPath("permissionGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/iam/permission_groups/{permissionGroupId}",
  }),
) as unknown as Schema.Schema<GetPermissionGroupRequest>;

export interface GetPermissionGroupResponse {
  /** Identifier of the permission group. */
  id: string;
  /** Attributes associated to the permission group. */
  meta?: { key?: string; value?: string };
  /** Name of the permission group. */
  name?: string;
}

export const GetPermissionGroupResponse = Schema.Struct({
  id: Schema.String,
  meta: Schema.optional(
    Schema.Struct({
      key: Schema.optional(Schema.String),
      value: Schema.optional(Schema.String),
    }),
  ),
  name: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetPermissionGroupResponse>;

export const getPermissionGroup = API.make(() => ({
  input: GetPermissionGroupRequest,
  output: GetPermissionGroupResponse,
  errors: [],
}));

// =============================================================================
// ResourceGroup
// =============================================================================

export interface GetResourceGroupRequest {
  resourceGroupId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const GetResourceGroupRequest = Schema.Struct({
  resourceGroupId: Schema.String.pipe(T.HttpPath("resourceGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/iam/resource_groups/{resourceGroupId}" }),
) as unknown as Schema.Schema<GetResourceGroupRequest>;

export interface GetResourceGroupResponse {
  /** Identifier of the resource group. */
  id: string;
  /** The scope associated to the resource group */
  scope: { key: string; objects: { key: string }[] }[];
  /** Attributes associated to the resource group. */
  meta?: { key?: string; value?: string };
  /** Name of the resource group. */
  name?: string;
}

export const GetResourceGroupResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<GetResourceGroupResponse>;

export const getResourceGroup = API.make(() => ({
  input: GetResourceGroupRequest,
  output: GetResourceGroupResponse,
  errors: [],
}));

export interface CreateResourceGroupRequest {
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Name of the resource group */
  name: string;
  /** Body param: A scope is a combination of scope objects which provides additional context. */
  scope: { key: string; objects: { key: string }[] };
}

export const CreateResourceGroupRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  scope: Schema.Struct({
    key: Schema.String,
    objects: Schema.Array(
      Schema.Struct({
        key: Schema.String,
      }),
    ),
  }),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/iam/resource_groups" }),
) as unknown as Schema.Schema<CreateResourceGroupRequest>;

export interface CreateResourceGroupResponse {
  /** Identifier of the group. */
  id?: string;
  /** Attributes associated to the resource group. */
  meta?: unknown;
  /** A scope is a combination of scope objects which provides additional context. */
  scope?: { key: string; objects: { key: string }[] };
}

export const CreateResourceGroupResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  meta: Schema.optional(Schema.Unknown),
  scope: Schema.optional(
    Schema.Struct({
      key: Schema.String,
      objects: Schema.Array(
        Schema.Struct({
          key: Schema.String,
        }),
      ),
    }),
  ),
}) as unknown as Schema.Schema<CreateResourceGroupResponse>;

export const createResourceGroup = API.make(() => ({
  input: CreateResourceGroupRequest,
  output: CreateResourceGroupResponse,
  errors: [],
}));

export interface UpdateResourceGroupRequest {
  resourceGroupId: string;
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Name of the resource group */
  name?: string;
  /** Body param: A scope is a combination of scope objects which provides additional context. */
  scope?: { key: string; objects: { key: string }[] };
}

export const UpdateResourceGroupRequest = Schema.Struct({
  resourceGroupId: Schema.String.pipe(T.HttpPath("resourceGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
  scope: Schema.optional(
    Schema.Struct({
      key: Schema.String,
      objects: Schema.Array(
        Schema.Struct({
          key: Schema.String,
        }),
      ),
    }),
  ),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/iam/resource_groups/{resourceGroupId}" }),
) as unknown as Schema.Schema<UpdateResourceGroupRequest>;

export interface UpdateResourceGroupResponse {
  /** Identifier of the resource group. */
  id: string;
  /** The scope associated to the resource group */
  scope: { key: string; objects: { key: string }[] }[];
  /** Attributes associated to the resource group. */
  meta?: { key?: string; value?: string };
  /** Name of the resource group. */
  name?: string;
}

export const UpdateResourceGroupResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<UpdateResourceGroupResponse>;

export const updateResourceGroup = API.make(() => ({
  input: UpdateResourceGroupRequest,
  output: UpdateResourceGroupResponse,
  errors: [],
}));

export interface DeleteResourceGroupRequest {
  resourceGroupId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const DeleteResourceGroupRequest = Schema.Struct({
  resourceGroupId: Schema.String.pipe(T.HttpPath("resourceGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/iam/resource_groups/{resourceGroupId}",
  }),
) as unknown as Schema.Schema<DeleteResourceGroupRequest>;

export type DeleteResourceGroupResponse = unknown;

export const DeleteResourceGroupResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteResourceGroupResponse>;

export const deleteResourceGroup = API.make(() => ({
  input: DeleteResourceGroupRequest,
  output: DeleteResourceGroupResponse,
  errors: [],
}));

// =============================================================================
// UserGroup
// =============================================================================

export interface GetUserGroupRequest {
  userGroupId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const GetUserGroupRequest = Schema.Struct({
  userGroupId: Schema.String.pipe(T.HttpPath("userGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/iam/user_groups/{userGroupId}" }),
) as unknown as Schema.Schema<GetUserGroupRequest>;

export interface GetUserGroupResponse {
  /** User Group identifier tag. */
  id: string;
  /** Timestamp for the creation of the user group */
  createdOn: string;
  /** Last time the user group was modified. */
  modifiedOn: string;
  /** Name of the user group. */
  name: string;
  /** Policies attached to the User group */
  policies?: {
    id?: string;
    access?: "allow" | "deny";
    permissionGroups?: { id: string }[];
    resourceGroups?: { id: string }[];
  }[];
}

export const GetUserGroupResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  policies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        access: Schema.optional(Schema.Literal("allow", "deny")),
        permissionGroups: Schema.optional(
          Schema.Array(
            Schema.Struct({
              id: Schema.String,
            }),
          ),
        ).pipe(T.JsonName("permission_groups")),
        resourceGroups: Schema.optional(
          Schema.Array(
            Schema.Struct({
              id: Schema.String,
            }),
          ),
        ).pipe(T.JsonName("resource_groups")),
      }),
    ),
  ),
}) as unknown as Schema.Schema<GetUserGroupResponse>;

export const getUserGroup = API.make(() => ({
  input: GetUserGroupRequest,
  output: GetUserGroupResponse,
  errors: [],
}));

export interface CreateUserGroupRequest {
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Name of the User group. */
  name: string;
  /** Body param: Policies attached to the User group */
  policies: {
    access: "allow" | "deny";
    permissionGroups: { id: string }[];
    resourceGroups: { id: string }[];
  }[];
}

export const CreateUserGroupRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  policies: Schema.Array(
    Schema.Struct({
      access: Schema.Literal("allow", "deny"),
      permissionGroups: Schema.Array(
        Schema.Struct({
          id: Schema.String,
        }),
      ).pipe(T.JsonName("permission_groups")),
      resourceGroups: Schema.Array(
        Schema.Struct({
          id: Schema.String,
        }),
      ).pipe(T.JsonName("resource_groups")),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/iam/user_groups" }),
) as unknown as Schema.Schema<CreateUserGroupRequest>;

export interface CreateUserGroupResponse {
  /** User Group identifier tag. */
  id: string;
  /** Timestamp for the creation of the user group */
  createdOn: string;
  /** Last time the user group was modified. */
  modifiedOn: string;
  /** Name of the user group. */
  name: string;
  /** Policies attached to the User group */
  policies?: {
    id?: string;
    access?: "allow" | "deny";
    permissionGroups?: { id: string }[];
    resourceGroups?: { id: string }[];
  }[];
}

export const CreateUserGroupResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  policies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        access: Schema.optional(Schema.Literal("allow", "deny")),
        permissionGroups: Schema.optional(
          Schema.Array(
            Schema.Struct({
              id: Schema.String,
            }),
          ),
        ).pipe(T.JsonName("permission_groups")),
        resourceGroups: Schema.optional(
          Schema.Array(
            Schema.Struct({
              id: Schema.String,
            }),
          ),
        ).pipe(T.JsonName("resource_groups")),
      }),
    ),
  ),
}) as unknown as Schema.Schema<CreateUserGroupResponse>;

export const createUserGroup = API.make(() => ({
  input: CreateUserGroupRequest,
  output: CreateUserGroupResponse,
  errors: [],
}));

export interface UpdateUserGroupRequest {
  userGroupId: string;
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Name of the User group. */
  name?: string;
  /** Body param: Policies attached to the User group */
  policies?: {
    id: string;
    access: "allow" | "deny";
    permissionGroups: { id: string }[];
    resourceGroups: { id: string }[];
  }[];
}

export const UpdateUserGroupRequest = Schema.Struct({
  userGroupId: Schema.String.pipe(T.HttpPath("userGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String),
  policies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.String,
        access: Schema.Literal("allow", "deny"),
        permissionGroups: Schema.Array(
          Schema.Struct({
            id: Schema.String,
          }),
        ).pipe(T.JsonName("permission_groups")),
        resourceGroups: Schema.Array(
          Schema.Struct({
            id: Schema.String,
          }),
        ).pipe(T.JsonName("resource_groups")),
      }),
    ),
  ),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/iam/user_groups/{userGroupId}" }),
) as unknown as Schema.Schema<UpdateUserGroupRequest>;

export interface UpdateUserGroupResponse {
  /** User Group identifier tag. */
  id: string;
  /** Timestamp for the creation of the user group */
  createdOn: string;
  /** Last time the user group was modified. */
  modifiedOn: string;
  /** Name of the user group. */
  name: string;
  /** Policies attached to the User group */
  policies?: {
    id?: string;
    access?: "allow" | "deny";
    permissionGroups?: { id: string }[];
    resourceGroups?: { id: string }[];
  }[];
}

export const UpdateUserGroupResponse = Schema.Struct({
  id: Schema.String,
  createdOn: Schema.String.pipe(T.JsonName("created_on")),
  modifiedOn: Schema.String.pipe(T.JsonName("modified_on")),
  name: Schema.String,
  policies: Schema.optional(
    Schema.Array(
      Schema.Struct({
        id: Schema.optional(Schema.String),
        access: Schema.optional(Schema.Literal("allow", "deny")),
        permissionGroups: Schema.optional(
          Schema.Array(
            Schema.Struct({
              id: Schema.String,
            }),
          ),
        ).pipe(T.JsonName("permission_groups")),
        resourceGroups: Schema.optional(
          Schema.Array(
            Schema.Struct({
              id: Schema.String,
            }),
          ),
        ).pipe(T.JsonName("resource_groups")),
      }),
    ),
  ),
}) as unknown as Schema.Schema<UpdateUserGroupResponse>;

export const updateUserGroup = API.make(() => ({
  input: UpdateUserGroupRequest,
  output: UpdateUserGroupResponse,
  errors: [],
}));

export interface DeleteUserGroupRequest {
  userGroupId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const DeleteUserGroupRequest = Schema.Struct({
  userGroupId: Schema.String.pipe(T.HttpPath("userGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/iam/user_groups/{userGroupId}" }),
) as unknown as Schema.Schema<DeleteUserGroupRequest>;

export type DeleteUserGroupResponse = unknown;

export const DeleteUserGroupResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteUserGroupResponse>;

export const deleteUserGroup = API.make(() => ({
  input: DeleteUserGroupRequest,
  output: DeleteUserGroupResponse,
  errors: [],
}));

// =============================================================================
// UserGroupMember
// =============================================================================

export interface CreateUserGroupMemberRequest {
  userGroupId: string;
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: */
  body: { id: string }[];
}

export const CreateUserGroupMemberRequest = Schema.Struct({
  userGroupId: Schema.String.pipe(T.HttpPath("userGroupId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Array(
    Schema.Struct({
      id: Schema.String,
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/iam/user_groups/{userGroupId}/members" }),
) as unknown as Schema.Schema<CreateUserGroupMemberRequest>;

export interface CreateUserGroupMemberResponse {
  /** Account member identifier. */
  id: string;
  /** The contact email address of the user. */
  email?: string;
  /** The member's status in the account. */
  status?: "accepted" | "pending";
}

export const CreateUserGroupMemberResponse = Schema.Struct({
  id: Schema.String,
  email: Schema.optional(Schema.String),
  status: Schema.optional(Schema.Literal("accepted", "pending")),
}) as unknown as Schema.Schema<CreateUserGroupMemberResponse>;

export const createUserGroupMember = API.make(() => ({
  input: CreateUserGroupMemberRequest,
  output: CreateUserGroupMemberResponse,
  errors: [],
}));

export interface DeleteUserGroupMemberRequest {
  userGroupId: string;
  memberId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const DeleteUserGroupMemberRequest = Schema.Struct({
  userGroupId: Schema.String.pipe(T.HttpPath("userGroupId")),
  memberId: Schema.String.pipe(T.HttpPath("memberId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/iam/user_groups/{userGroupId}/members/{memberId}",
  }),
) as unknown as Schema.Schema<DeleteUserGroupMemberRequest>;

export interface DeleteUserGroupMemberResponse {
  /** Account member identifier. */
  id: string;
  /** The contact email address of the user. */
  email?: string;
  /** The member's status in the account. */
  status?: "accepted" | "pending";
}

export const DeleteUserGroupMemberResponse = Schema.Struct({
  id: Schema.String,
  email: Schema.optional(Schema.String),
  status: Schema.optional(Schema.Literal("accepted", "pending")),
}) as unknown as Schema.Schema<DeleteUserGroupMemberResponse>;

export const deleteUserGroupMember = API.make(() => ({
  input: DeleteUserGroupMemberRequest,
  output: DeleteUserGroupMemberResponse,
  errors: [],
}));
