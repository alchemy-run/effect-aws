/**
 * Cloudflare ACCOUNTS API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service accounts
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Account
// =============================================================================

export interface GetAccountRequest {
  /** Account identifier tag. */
  accountId: string;
}

export const GetAccountRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}" }),
) as unknown as Schema.Schema<GetAccountRequest>;

export interface GetAccountResponse {
  /** Identifier */
  id: string;
  /** Account name */
  name: string;
  type: "standard" | "enterprise";
  /** Timestamp for the creation of the account */
  createdOn?: string;
  /** Account settings */
  settings?: { abuseContactEmail?: string; enforceTwofactor?: boolean };
}

export const GetAccountResponse = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  type: Schema.Literal("standard", "enterprise"),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  settings: Schema.optional(
    Schema.Struct({
      abuseContactEmail: Schema.optional(Schema.String).pipe(T.JsonName("abuse_contact_email")),
      enforceTwofactor: Schema.optional(Schema.Boolean).pipe(T.JsonName("enforce_twofactor")),
    }),
  ),
}) as unknown as Schema.Schema<GetAccountResponse>;

export const getAccount = API.make(() => ({
  input: GetAccountRequest,
  output: GetAccountResponse,
  errors: [],
}));

export interface CreateAccountRequest {
  /** Account name */
  name: string;
  type?: "standard" | "enterprise";
  /** information related to the tenant unit, and optionally, an id of the unit to create the account on. see https://developers.cloudflare.com/tenant/how-to/manage-accounts/ */
  unit?: { id?: string };
}

export const CreateAccountRequest = Schema.Struct({
  name: Schema.String,
  type: Schema.optional(Schema.Literal("standard", "enterprise")),
  unit: Schema.optional(
    Schema.Struct({
      id: Schema.optional(Schema.String),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts" }),
) as unknown as Schema.Schema<CreateAccountRequest>;

export interface CreateAccountResponse {
  /** Identifier */
  id: string;
  /** Account name */
  name: string;
  type: "standard" | "enterprise";
  /** Timestamp for the creation of the account */
  createdOn?: string;
  /** Account settings */
  settings?: { abuseContactEmail?: string; enforceTwofactor?: boolean };
}

export const CreateAccountResponse = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  type: Schema.Literal("standard", "enterprise"),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  settings: Schema.optional(
    Schema.Struct({
      abuseContactEmail: Schema.optional(Schema.String).pipe(T.JsonName("abuse_contact_email")),
      enforceTwofactor: Schema.optional(Schema.Boolean).pipe(T.JsonName("enforce_twofactor")),
    }),
  ),
}) as unknown as Schema.Schema<CreateAccountResponse>;

export const createAccount = API.make(() => ({
  input: CreateAccountRequest,
  output: CreateAccountResponse,
  errors: [],
}));

export interface UpdateAccountRequest {
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Identifier */
  id: string;
  /** Body param: Account name */
  name: string;
  /** Body param: */
  type: "standard" | "enterprise";
  /** Body param: Account settings */
  settings?: { abuseContactEmail?: string; enforceTwofactor?: boolean };
}

export const UpdateAccountRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.String,
  name: Schema.String,
  type: Schema.Literal("standard", "enterprise"),
  settings: Schema.optional(
    Schema.Struct({
      abuseContactEmail: Schema.optional(Schema.String).pipe(T.JsonName("abuse_contact_email")),
      enforceTwofactor: Schema.optional(Schema.Boolean).pipe(T.JsonName("enforce_twofactor")),
    }),
  ),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}" }),
) as unknown as Schema.Schema<UpdateAccountRequest>;

export interface UpdateAccountResponse {
  /** Identifier */
  id: string;
  /** Account name */
  name: string;
  type: "standard" | "enterprise";
  /** Timestamp for the creation of the account */
  createdOn?: string;
  /** Account settings */
  settings?: { abuseContactEmail?: string; enforceTwofactor?: boolean };
}

export const UpdateAccountResponse = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  type: Schema.Literal("standard", "enterprise"),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  settings: Schema.optional(
    Schema.Struct({
      abuseContactEmail: Schema.optional(Schema.String).pipe(T.JsonName("abuse_contact_email")),
      enforceTwofactor: Schema.optional(Schema.Boolean).pipe(T.JsonName("enforce_twofactor")),
    }),
  ),
}) as unknown as Schema.Schema<UpdateAccountResponse>;

export const updateAccount = API.make(() => ({
  input: UpdateAccountRequest,
  output: UpdateAccountResponse,
  errors: [],
}));

export interface DeleteAccountRequest {
  /** The account ID of the account to be deleted */
  accountId: string;
}

export const DeleteAccountRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}" }),
) as unknown as Schema.Schema<DeleteAccountRequest>;

export type DeleteAccountResponse = unknown;

export const DeleteAccountResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteAccountResponse>;

export const deleteAccount = API.make(() => ({
  input: DeleteAccountRequest,
  output: DeleteAccountResponse,
  errors: [],
}));

// =============================================================================
// Member
// =============================================================================

export interface GetMemberRequest {
  memberId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const GetMemberRequest = Schema.Struct({
  memberId: Schema.String.pipe(T.HttpPath("memberId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/members/{memberId}" }),
) as unknown as Schema.Schema<GetMemberRequest>;

export type GetMemberResponse = unknown;

export const GetMemberResponse = Schema.Unknown as unknown as Schema.Schema<GetMemberResponse>;

export const getMember = API.make(() => ({
  input: GetMemberRequest,
  output: GetMemberResponse,
  errors: [],
}));

export interface CreateMemberRequest {}

export const CreateMemberRequest = Schema.Struct({}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/members" }),
) as unknown as Schema.Schema<CreateMemberRequest>;

export type CreateMemberResponse = unknown;

export const CreateMemberResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateMemberResponse>;

export const createMember = API.make(() => ({
  input: CreateMemberRequest,
  output: CreateMemberResponse,
  errors: [],
}));

export interface UpdateMemberRequest {
  memberId: string;
}

export const UpdateMemberRequest = Schema.Struct({
  memberId: Schema.String.pipe(T.HttpPath("memberId")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/members/{memberId}" }),
) as unknown as Schema.Schema<UpdateMemberRequest>;

export type UpdateMemberResponse = unknown;

export const UpdateMemberResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateMemberResponse>;

export const updateMember = API.make(() => ({
  input: UpdateMemberRequest,
  output: UpdateMemberResponse,
  errors: [],
}));

export interface DeleteMemberRequest {
  memberId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const DeleteMemberRequest = Schema.Struct({
  memberId: Schema.String.pipe(T.HttpPath("memberId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/members/{memberId}" }),
) as unknown as Schema.Schema<DeleteMemberRequest>;

export type DeleteMemberResponse = unknown;

export const DeleteMemberResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteMemberResponse>;

export const deleteMember = API.make(() => ({
  input: DeleteMemberRequest,
  output: DeleteMemberResponse,
  errors: [],
}));

// =============================================================================
// Role
// =============================================================================

export interface GetRoleRequest {
  roleId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const GetRoleRequest = Schema.Struct({
  roleId: Schema.String.pipe(T.HttpPath("roleId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/roles/{roleId}" }),
) as unknown as Schema.Schema<GetRoleRequest>;

export type GetRoleResponse = unknown;

export const GetRoleResponse = Schema.Unknown as unknown as Schema.Schema<GetRoleResponse>;

export const getRole = API.make(() => ({
  input: GetRoleRequest,
  output: GetRoleResponse,
  errors: [],
}));

// =============================================================================
// Subscription
// =============================================================================

export interface CreateSubscriptionRequest {
  /** Path param: Identifier */
  accountId: string;
  /** Body param: How often the subscription is renewed automatically. */
  frequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  /** Body param: The rate plan applied to the subscription. */
  ratePlan?: unknown;
}

export const CreateSubscriptionRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  frequency: Schema.optional(Schema.Literal("weekly", "monthly", "quarterly", "yearly")),
  ratePlan: Schema.optional(Schema.Unknown).pipe(T.JsonName("rate_plan")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/subscriptions" }),
) as unknown as Schema.Schema<CreateSubscriptionRequest>;

export type CreateSubscriptionResponse = unknown;

export const CreateSubscriptionResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateSubscriptionResponse>;

export const createSubscription = API.make(() => ({
  input: CreateSubscriptionRequest,
  output: CreateSubscriptionResponse,
  errors: [],
}));

export interface UpdateSubscriptionRequest {
  subscriptionIdentifier: string;
  /** Path param: Identifier */
  accountId: string;
  /** Body param: How often the subscription is renewed automatically. */
  frequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  /** Body param: The rate plan applied to the subscription. */
  ratePlan?: unknown;
}

export const UpdateSubscriptionRequest = Schema.Struct({
  subscriptionIdentifier: Schema.String.pipe(T.HttpPath("subscriptionIdentifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  frequency: Schema.optional(Schema.Literal("weekly", "monthly", "quarterly", "yearly")),
  ratePlan: Schema.optional(Schema.Unknown).pipe(T.JsonName("rate_plan")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/subscriptions/{subscriptionIdentifier}" }),
) as unknown as Schema.Schema<UpdateSubscriptionRequest>;

export type UpdateSubscriptionResponse = unknown;

export const UpdateSubscriptionResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateSubscriptionResponse>;

export const updateSubscription = API.make(() => ({
  input: UpdateSubscriptionRequest,
  output: UpdateSubscriptionResponse,
  errors: [],
}));

export interface DeleteSubscriptionRequest {
  subscriptionIdentifier: string;
  /** Identifier */
  accountId: string;
}

export const DeleteSubscriptionRequest = Schema.Struct({
  subscriptionIdentifier: Schema.String.pipe(T.HttpPath("subscriptionIdentifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/subscriptions/{subscriptionIdentifier}",
  }),
) as unknown as Schema.Schema<DeleteSubscriptionRequest>;

export interface DeleteSubscriptionResponse {
  /** Subscription identifier tag. */
  subscriptionId?: string;
}

export const DeleteSubscriptionResponse = Schema.Struct({
  subscriptionId: Schema.optional(Schema.String).pipe(T.JsonName("subscription_id")),
}) as unknown as Schema.Schema<DeleteSubscriptionResponse>;

export const deleteSubscription = API.make(() => ({
  input: DeleteSubscriptionRequest,
  output: DeleteSubscriptionResponse,
  errors: [],
}));

// =============================================================================
// Token
// =============================================================================

export interface GetTokenRequest {
  tokenId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const GetTokenRequest = Schema.Struct({
  tokenId: Schema.String.pipe(T.HttpPath("tokenId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/tokens/{tokenId}" }),
) as unknown as Schema.Schema<GetTokenRequest>;

export type GetTokenResponse = unknown;

export const GetTokenResponse = Schema.Unknown as unknown as Schema.Schema<GetTokenResponse>;

export const getToken = API.make(() => ({
  input: GetTokenRequest,
  output: GetTokenResponse,
  errors: [],
}));

export interface CreateTokenRequest {
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Token name. */
  name: string;
  /** Body param: List of access policies assigned to the token. */
  policies: unknown[];
  /** Body param: */
  condition?: { requestIp?: { in?: string[]; notIn?: string[] } };
  /** Body param: The expiration time on or after which the JWT MUST NOT be accepted for processing. */
  expiresOn?: string;
  /** Body param: The time before which the token MUST NOT be accepted for processing. */
  notBefore?: string;
}

export const CreateTokenRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  policies: Schema.Array(Schema.Unknown),
  condition: Schema.optional(
    Schema.Struct({
      requestIp: Schema.optional(
        Schema.Struct({
          in: Schema.optional(Schema.Array(Schema.String)),
          notIn: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("not_in")),
        }),
      ).pipe(T.JsonName("request_ip")),
    }),
  ),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  notBefore: Schema.optional(Schema.String).pipe(T.JsonName("not_before")),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/tokens" }),
) as unknown as Schema.Schema<CreateTokenRequest>;

export interface CreateTokenResponse {
  /** Token identifier tag. */
  id?: string;
  condition?: { requestIp?: { in?: string[]; notIn?: string[] } };
  /** The expiration time on or after which the JWT MUST NOT be accepted for processing. */
  expiresOn?: string;
  /** The time on which the token was created. */
  issuedOn?: string;
  /** Last time the token was used. */
  lastUsedOn?: string;
  /** Last time the token was modified. */
  modifiedOn?: string;
  /** Token name. */
  name?: string;
  /** The time before which the token MUST NOT be accepted for processing. */
  notBefore?: string;
  /** List of access policies assigned to the token. */
  policies?: unknown[];
  /** Status of the token. */
  status?: "active" | "disabled" | "expired";
  /** The token value. */
  value?: string;
}

export const CreateTokenResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  condition: Schema.optional(
    Schema.Struct({
      requestIp: Schema.optional(
        Schema.Struct({
          in: Schema.optional(Schema.Array(Schema.String)),
          notIn: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("not_in")),
        }),
      ).pipe(T.JsonName("request_ip")),
    }),
  ),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  issuedOn: Schema.optional(Schema.String).pipe(T.JsonName("issued_on")),
  lastUsedOn: Schema.optional(Schema.String).pipe(T.JsonName("last_used_on")),
  modifiedOn: Schema.optional(Schema.String).pipe(T.JsonName("modified_on")),
  name: Schema.optional(Schema.String),
  notBefore: Schema.optional(Schema.String).pipe(T.JsonName("not_before")),
  policies: Schema.optional(Schema.Array(Schema.Unknown)),
  status: Schema.optional(Schema.Literal("active", "disabled", "expired")),
  value: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateTokenResponse>;

export const createToken = API.make(() => ({
  input: CreateTokenRequest,
  output: CreateTokenResponse,
  errors: [],
}));

export interface UpdateTokenRequest {
  tokenId: string;
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: Token name. */
  name: string;
  /** Body param: List of access policies assigned to the token. */
  policies: unknown[];
  /** Body param: */
  condition?: { requestIp?: { in?: string[]; notIn?: string[] } };
  /** Body param: The expiration time on or after which the JWT MUST NOT be accepted for processing. */
  expiresOn?: string;
  /** Body param: The time before which the token MUST NOT be accepted for processing. */
  notBefore?: string;
  /** Body param: Status of the token. */
  status?: "active" | "disabled" | "expired";
}

export const UpdateTokenRequest = Schema.Struct({
  tokenId: Schema.String.pipe(T.HttpPath("tokenId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.String,
  policies: Schema.Array(Schema.Unknown),
  condition: Schema.optional(
    Schema.Struct({
      requestIp: Schema.optional(
        Schema.Struct({
          in: Schema.optional(Schema.Array(Schema.String)),
          notIn: Schema.optional(Schema.Array(Schema.String)).pipe(T.JsonName("not_in")),
        }),
      ).pipe(T.JsonName("request_ip")),
    }),
  ),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  notBefore: Schema.optional(Schema.String).pipe(T.JsonName("not_before")),
  status: Schema.optional(Schema.Literal("active", "disabled", "expired")),
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/tokens/{tokenId}" }),
) as unknown as Schema.Schema<UpdateTokenRequest>;

export type UpdateTokenResponse = unknown;

export const UpdateTokenResponse = Schema.Unknown as unknown as Schema.Schema<UpdateTokenResponse>;

export const updateToken = API.make(() => ({
  input: UpdateTokenRequest,
  output: UpdateTokenResponse,
  errors: [],
}));

export interface DeleteTokenRequest {
  tokenId: string;
  /** Account identifier tag. */
  accountId: string;
}

export const DeleteTokenRequest = Schema.Struct({
  tokenId: Schema.String.pipe(T.HttpPath("tokenId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/tokens/{tokenId}" }),
) as unknown as Schema.Schema<DeleteTokenRequest>;

export type DeleteTokenResponse = unknown;

export const DeleteTokenResponse = Schema.Unknown as unknown as Schema.Schema<DeleteTokenResponse>;

export const deleteToken = API.make(() => ({
  input: DeleteTokenRequest,
  output: DeleteTokenResponse,
  errors: [],
}));

export interface VerifyTokenRequest {
  /** Account identifier tag. */
  accountId: string;
}

export const VerifyTokenRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/tokens/verify" }),
) as unknown as Schema.Schema<VerifyTokenRequest>;

export interface VerifyTokenResponse {
  /** Token identifier tag. */
  id: string;
  /** Status of the token. */
  status: "active" | "disabled" | "expired";
  /** The expiration time on or after which the JWT MUST NOT be accepted for processing. */
  expiresOn?: string;
  /** The time before which the token MUST NOT be accepted for processing. */
  notBefore?: string;
}

export const VerifyTokenResponse = Schema.Struct({
  id: Schema.String,
  status: Schema.Literal("active", "disabled", "expired"),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  notBefore: Schema.optional(Schema.String).pipe(T.JsonName("not_before")),
}) as unknown as Schema.Schema<VerifyTokenResponse>;

export const verifyToken = API.make(() => ({
  input: VerifyTokenRequest,
  output: VerifyTokenResponse,
  errors: [],
}));

// =============================================================================
// TokenPermissionGroup
// =============================================================================

export interface GetTokenPermissionGroupRequest {
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Query param: Filter by the name of the permission group. The value must be URL-encoded. */
  name?: string;
  /** Query param: Filter by the scope of the permission group. The value must be URL-encoded. */
  scope?: string;
}

export const GetTokenPermissionGroupRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  name: Schema.optional(Schema.String).pipe(T.HttpQuery("name")),
  scope: Schema.optional(Schema.String).pipe(T.HttpQuery("scope")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/tokens/permission_groups" }),
) as unknown as Schema.Schema<GetTokenPermissionGroupRequest>;

export type GetTokenPermissionGroupResponse = {
  id?: string;
  name?: string;
  scopes?: (
    | "com.cloudflare.api.account"
    | "com.cloudflare.api.account.zone"
    | "com.cloudflare.api.user"
    | "com.cloudflare.edge.r2.bucket"
  )[];
}[];

export const GetTokenPermissionGroupResponse = Schema.Array(
  Schema.Struct({
    id: Schema.optional(Schema.String),
    name: Schema.optional(Schema.String),
    scopes: Schema.optional(
      Schema.Array(
        Schema.Literal(
          "com.cloudflare.api.account",
          "com.cloudflare.api.account.zone",
          "com.cloudflare.api.user",
          "com.cloudflare.edge.r2.bucket",
        ),
      ),
    ),
  }),
) as unknown as Schema.Schema<GetTokenPermissionGroupResponse>;

export const getTokenPermissionGroup = API.make(() => ({
  input: GetTokenPermissionGroupRequest,
  output: GetTokenPermissionGroupResponse,
  errors: [],
}));

// =============================================================================
// TokenValue
// =============================================================================

export interface PutTokenValueRequest {
  tokenId: string;
  /** Path param: Account identifier tag. */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const PutTokenValueRequest = Schema.Struct({
  tokenId: Schema.String.pipe(T.HttpPath("tokenId")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/tokens/{tokenId}/value" }),
) as unknown as Schema.Schema<PutTokenValueRequest>;

export type PutTokenValueResponse = unknown;

export const PutTokenValueResponse =
  Schema.Unknown as unknown as Schema.Schema<PutTokenValueResponse>;

export const putTokenValue = API.make(() => ({
  input: PutTokenValueRequest,
  output: PutTokenValueResponse,
  errors: [],
}));
