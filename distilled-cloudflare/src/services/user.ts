/**
 * Cloudflare USER API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service user
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// BillingProfile
// =============================================================================

export interface GetBillingProfileRequest {}

export const GetBillingProfileRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/user/billing/profile" }),
) as unknown as Schema.Schema<GetBillingProfileRequest>;

export interface GetBillingProfileResponse {
  /** Billing item identifier tag. */
  id?: string;
  accountType?: string;
  address?: string;
  address2?: string;
  balance?: string;
  cardExpiryMonth?: number;
  cardExpiryYear?: number;
  cardNumber?: string;
  city?: string;
  company?: string;
  country?: string;
  createdOn?: string;
  deviceData?: string;
  editedOn?: string;
  enterpriseBillingEmail?: string;
  enterprisePrimaryEmail?: string;
  firstName?: string;
  isPartner?: boolean;
  lastName?: string;
  nextBillDate?: string;
  paymentAddress?: string;
  paymentAddress2?: string;
  paymentCity?: string;
  paymentCountry?: string;
  paymentEmail?: string;
  paymentFirstName?: string;
  paymentGateway?: string;
  paymentLastName?: string;
  paymentNonce?: string;
  paymentState?: string;
  paymentZipcode?: string;
  primaryEmail?: string;
  state?: string;
  taxIdType?: string;
  telephone?: string;
  useLegacy?: boolean;
  validationCode?: string;
  vat?: string;
  zipcode?: string;
}

export const GetBillingProfileResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  accountType: Schema.optional(Schema.String).pipe(T.JsonName("account_type")),
  address: Schema.optional(Schema.String),
  address2: Schema.optional(Schema.String),
  balance: Schema.optional(Schema.String),
  cardExpiryMonth: Schema.optional(Schema.Number).pipe(T.JsonName("card_expiry_month")),
  cardExpiryYear: Schema.optional(Schema.Number).pipe(T.JsonName("card_expiry_year")),
  cardNumber: Schema.optional(Schema.String).pipe(T.JsonName("card_number")),
  city: Schema.optional(Schema.String),
  company: Schema.optional(Schema.String),
  country: Schema.optional(Schema.String),
  createdOn: Schema.optional(Schema.String).pipe(T.JsonName("created_on")),
  deviceData: Schema.optional(Schema.String).pipe(T.JsonName("device_data")),
  editedOn: Schema.optional(Schema.String).pipe(T.JsonName("edited_on")),
  enterpriseBillingEmail: Schema.optional(Schema.String).pipe(
    T.JsonName("enterprise_billing_email"),
  ),
  enterprisePrimaryEmail: Schema.optional(Schema.String).pipe(
    T.JsonName("enterprise_primary_email"),
  ),
  firstName: Schema.optional(Schema.String).pipe(T.JsonName("first_name")),
  isPartner: Schema.optional(Schema.Boolean).pipe(T.JsonName("is_partner")),
  lastName: Schema.optional(Schema.String).pipe(T.JsonName("last_name")),
  nextBillDate: Schema.optional(Schema.String).pipe(T.JsonName("next_bill_date")),
  paymentAddress: Schema.optional(Schema.String).pipe(T.JsonName("payment_address")),
  paymentAddress2: Schema.optional(Schema.String).pipe(T.JsonName("payment_address2")),
  paymentCity: Schema.optional(Schema.String).pipe(T.JsonName("payment_city")),
  paymentCountry: Schema.optional(Schema.String).pipe(T.JsonName("payment_country")),
  paymentEmail: Schema.optional(Schema.String).pipe(T.JsonName("payment_email")),
  paymentFirstName: Schema.optional(Schema.String).pipe(T.JsonName("payment_first_name")),
  paymentGateway: Schema.optional(Schema.String).pipe(T.JsonName("payment_gateway")),
  paymentLastName: Schema.optional(Schema.String).pipe(T.JsonName("payment_last_name")),
  paymentNonce: Schema.optional(Schema.String).pipe(T.JsonName("payment_nonce")),
  paymentState: Schema.optional(Schema.String).pipe(T.JsonName("payment_state")),
  paymentZipcode: Schema.optional(Schema.String).pipe(T.JsonName("payment_zipcode")),
  primaryEmail: Schema.optional(Schema.String).pipe(T.JsonName("primary_email")),
  state: Schema.optional(Schema.String),
  taxIdType: Schema.optional(Schema.String).pipe(T.JsonName("tax_id_type")),
  telephone: Schema.optional(Schema.String),
  useLegacy: Schema.optional(Schema.Boolean).pipe(T.JsonName("use_legacy")),
  validationCode: Schema.optional(Schema.String).pipe(T.JsonName("validation_code")),
  vat: Schema.optional(Schema.String),
  zipcode: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetBillingProfileResponse>;

export const getBillingProfile = API.make(() => ({
  input: GetBillingProfileRequest,
  output: GetBillingProfileResponse,
  errors: [],
}));

// =============================================================================
// Invite
// =============================================================================

export interface GetInviteRequest {
  inviteId: string;
}

export const GetInviteRequest = Schema.Struct({
  inviteId: Schema.String.pipe(T.HttpPath("inviteId")),
}).pipe(
  T.Http({ method: "GET", path: "/user/invites/{inviteId}" }),
) as unknown as Schema.Schema<GetInviteRequest>;

export interface GetInviteResponse {
  /** ID of the user to add to the organization. */
  invitedMemberId: string | null;
  /** ID of the organization the user will be added to. */
  organizationId: string;
  /** Invite identifier tag. */
  id?: string;
  /** When the invite is no longer active. */
  expiresOn?: string;
  /** The email address of the user who created the invite. */
  invitedBy?: string;
  /** Email address of the user to add to the organization. */
  invitedMemberEmail?: string;
  /** When the invite was sent. */
  invitedOn?: string;
  organizationIsEnforcingTwofactor?: boolean;
  /** Organization name. */
  organizationName?: string;
  /** List of role names the membership has for this account. */
  roles?: string[];
  /** Current status of the invitation. */
  status?: "pending" | "accepted" | "rejected" | "expired";
}

export const GetInviteResponse = Schema.Struct({
  invitedMemberId: Schema.Union(Schema.String, Schema.Null).pipe(T.JsonName("invited_member_id")),
  organizationId: Schema.String.pipe(T.JsonName("organization_id")),
  id: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  invitedBy: Schema.optional(Schema.String).pipe(T.JsonName("invited_by")),
  invitedMemberEmail: Schema.optional(Schema.String).pipe(T.JsonName("invited_member_email")),
  invitedOn: Schema.optional(Schema.String).pipe(T.JsonName("invited_on")),
  organizationIsEnforcingTwofactor: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("organization_is_enforcing_twofactor"),
  ),
  organizationName: Schema.optional(Schema.String).pipe(T.JsonName("organization_name")),
  roles: Schema.optional(Schema.Array(Schema.String)),
  status: Schema.optional(Schema.Literal("pending", "accepted", "rejected", "expired")),
}) as unknown as Schema.Schema<GetInviteResponse>;

export const getInvite = API.make(() => ({
  input: GetInviteRequest,
  output: GetInviteResponse,
  errors: [],
}));

export interface PatchInviteRequest {
  inviteId: string;
  /** Status of your response to the invitation (rejected or accepted). */
  status: "accepted" | "rejected";
}

export const PatchInviteRequest = Schema.Struct({
  inviteId: Schema.String.pipe(T.HttpPath("inviteId")),
  status: Schema.Literal("accepted", "rejected"),
}).pipe(
  T.Http({ method: "PATCH", path: "/user/invites/{inviteId}" }),
) as unknown as Schema.Schema<PatchInviteRequest>;

export interface PatchInviteResponse {
  /** ID of the user to add to the organization. */
  invitedMemberId: string | null;
  /** ID of the organization the user will be added to. */
  organizationId: string;
  /** Invite identifier tag. */
  id?: string;
  /** When the invite is no longer active. */
  expiresOn?: string;
  /** The email address of the user who created the invite. */
  invitedBy?: string;
  /** Email address of the user to add to the organization. */
  invitedMemberEmail?: string;
  /** When the invite was sent. */
  invitedOn?: string;
  organizationIsEnforcingTwofactor?: boolean;
  /** Organization name. */
  organizationName?: string;
  /** List of role names the membership has for this account. */
  roles?: string[];
  /** Current status of the invitation. */
  status?: "pending" | "accepted" | "rejected" | "expired";
}

export const PatchInviteResponse = Schema.Struct({
  invitedMemberId: Schema.Union(Schema.String, Schema.Null).pipe(T.JsonName("invited_member_id")),
  organizationId: Schema.String.pipe(T.JsonName("organization_id")),
  id: Schema.optional(Schema.String),
  expiresOn: Schema.optional(Schema.String).pipe(T.JsonName("expires_on")),
  invitedBy: Schema.optional(Schema.String).pipe(T.JsonName("invited_by")),
  invitedMemberEmail: Schema.optional(Schema.String).pipe(T.JsonName("invited_member_email")),
  invitedOn: Schema.optional(Schema.String).pipe(T.JsonName("invited_on")),
  organizationIsEnforcingTwofactor: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("organization_is_enforcing_twofactor"),
  ),
  organizationName: Schema.optional(Schema.String).pipe(T.JsonName("organization_name")),
  roles: Schema.optional(Schema.Array(Schema.String)),
  status: Schema.optional(Schema.Literal("pending", "accepted", "rejected", "expired")),
}) as unknown as Schema.Schema<PatchInviteResponse>;

export const patchInvite = API.make(() => ({
  input: PatchInviteRequest,
  output: PatchInviteResponse,
  errors: [],
}));

// =============================================================================
// Organization
// =============================================================================

export interface GetOrganizationRequest {
  organizationId: string;
}

export const GetOrganizationRequest = Schema.Struct({
  organizationId: Schema.String.pipe(T.HttpPath("organizationId")),
}).pipe(
  T.Http({ method: "GET", path: "/user/organizations/{organizationId}" }),
) as unknown as Schema.Schema<GetOrganizationRequest>;

export type GetOrganizationResponse = unknown;

export const GetOrganizationResponse =
  Schema.Unknown as unknown as Schema.Schema<GetOrganizationResponse>;

export const getOrganization = API.make(() => ({
  input: GetOrganizationRequest,
  output: GetOrganizationResponse,
  errors: [],
}));

export interface DeleteOrganizationRequest {
  organizationId: string;
}

export const DeleteOrganizationRequest = Schema.Struct({
  organizationId: Schema.String.pipe(T.HttpPath("organizationId")),
}).pipe(
  T.Http({ method: "DELETE", path: "/user/organizations/{organizationId}" }),
) as unknown as Schema.Schema<DeleteOrganizationRequest>;

export interface DeleteOrganizationResponse {
  /** Identifier */
  id?: string;
}

export const DeleteOrganizationResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<DeleteOrganizationResponse>;

export const deleteOrganization = API.make(() => ({
  input: DeleteOrganizationRequest,
  output: DeleteOrganizationResponse,
  errors: [],
}));

// =============================================================================
// Subscription
// =============================================================================

export interface PutSubscriptionRequest {
  identifier: string;
  /** How often the subscription is renewed automatically. */
  frequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  /** The rate plan applied to the subscription. */
  ratePlan?: unknown;
}

export const PutSubscriptionRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  frequency: Schema.optional(Schema.Literal("weekly", "monthly", "quarterly", "yearly")),
  ratePlan: Schema.optional(Schema.Unknown).pipe(T.JsonName("rate_plan")),
}).pipe(
  T.Http({ method: "PUT", path: "/user/subscriptions/{identifier}" }),
) as unknown as Schema.Schema<PutSubscriptionRequest>;

export type PutSubscriptionResponse = string | null;

export const PutSubscriptionResponse = Schema.Union(
  Schema.String,
  Schema.Null,
) as unknown as Schema.Schema<PutSubscriptionResponse>;

export const putSubscription = API.make(() => ({
  input: PutSubscriptionRequest,
  output: PutSubscriptionResponse,
  errors: [],
}));

export interface DeleteSubscriptionRequest {
  identifier: string;
}

export const DeleteSubscriptionRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
}).pipe(
  T.Http({ method: "DELETE", path: "/user/subscriptions/{identifier}" }),
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
}

export const GetTokenRequest = Schema.Struct({
  tokenId: Schema.String.pipe(T.HttpPath("tokenId")),
}).pipe(
  T.Http({ method: "GET", path: "/user/tokens/{tokenId}" }),
) as unknown as Schema.Schema<GetTokenRequest>;

export type GetTokenResponse = unknown;

export const GetTokenResponse = Schema.Unknown as unknown as Schema.Schema<GetTokenResponse>;

export const getToken = API.make(() => ({
  input: GetTokenRequest,
  output: GetTokenResponse,
  errors: [],
}));

export interface CreateTokenRequest {
  /** Token name. */
  name: string;
  /** List of access policies assigned to the token. */
  policies: unknown[];
  condition?: { requestIp?: { in?: string[]; notIn?: string[] } };
  /** The expiration time on or after which the JWT MUST NOT be accepted for processing. */
  expiresOn?: string;
  /** The time before which the token MUST NOT be accepted for processing. */
  notBefore?: string;
}

export const CreateTokenRequest = Schema.Struct({
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
  T.Http({ method: "POST", path: "/user/tokens" }),
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
  /** Token name. */
  name: string;
  /** List of access policies assigned to the token. */
  policies: unknown[];
  condition?: { requestIp?: { in?: string[]; notIn?: string[] } };
  /** The expiration time on or after which the JWT MUST NOT be accepted for processing. */
  expiresOn?: string;
  /** The time before which the token MUST NOT be accepted for processing. */
  notBefore?: string;
  /** Status of the token. */
  status?: "active" | "disabled" | "expired";
}

export const UpdateTokenRequest = Schema.Struct({
  tokenId: Schema.String.pipe(T.HttpPath("tokenId")),
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
  T.Http({ method: "PUT", path: "/user/tokens/{tokenId}" }),
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
}

export const DeleteTokenRequest = Schema.Struct({
  tokenId: Schema.String.pipe(T.HttpPath("tokenId")),
}).pipe(
  T.Http({ method: "DELETE", path: "/user/tokens/{tokenId}" }),
) as unknown as Schema.Schema<DeleteTokenRequest>;

export type DeleteTokenResponse = unknown;

export const DeleteTokenResponse = Schema.Unknown as unknown as Schema.Schema<DeleteTokenResponse>;

export const deleteToken = API.make(() => ({
  input: DeleteTokenRequest,
  output: DeleteTokenResponse,
  errors: [],
}));

export interface VerifyTokenRequest {}

export const VerifyTokenRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/user/tokens/verify" }),
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
// TokenValue
// =============================================================================

export interface PutTokenValueRequest {
  tokenId: string;
}

export const PutTokenValueRequest = Schema.Struct({
  tokenId: Schema.String.pipe(T.HttpPath("tokenId")),
}).pipe(
  T.Http({ method: "PUT", path: "/user/tokens/{tokenId}/value" }),
) as unknown as Schema.Schema<PutTokenValueRequest>;

export type PutTokenValueResponse = unknown;

export const PutTokenValueResponse =
  Schema.Unknown as unknown as Schema.Schema<PutTokenValueResponse>;

export const putTokenValue = API.make(() => ({
  input: PutTokenValueRequest,
  output: PutTokenValueResponse,
  errors: [],
}));

// =============================================================================
// User
// =============================================================================

export interface GetUserRequest {}

export const GetUserRequest = Schema.Struct({}).pipe(
  T.Http({ method: "GET", path: "/user" }),
) as unknown as Schema.Schema<GetUserRequest>;

export interface GetUserResponse {
  /** Identifier of the user. */
  id?: string;
  /** Lists the betas that the user is participating in. */
  betas?: string[];
  /** The country in which the user lives. */
  country?: string | null;
  /** User's first name */
  firstName?: string | null;
  /** Indicates whether user has any business zones */
  hasBusinessZones?: boolean;
  /** Indicates whether user has any enterprise zones */
  hasEnterpriseZones?: boolean;
  /** Indicates whether user has any pro zones */
  hasProZones?: boolean;
  /** User's last name */
  lastName?: string | null;
  organizations?: unknown[];
  /** Indicates whether user has been suspended */
  suspended?: boolean;
  /** User's telephone number */
  telephone?: string | null;
  /** Indicates whether two-factor authentication is enabled for the user account. Does not apply to API authentication. */
  twoFactorAuthenticationEnabled?: boolean;
  /** Indicates whether two-factor authentication is required by one of the accounts that the user is a member of. */
  twoFactorAuthenticationLocked?: boolean;
  /** The zipcode or postal code where the user lives. */
  zipcode?: string | null;
}

export const GetUserResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  betas: Schema.optional(Schema.Array(Schema.String)),
  country: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  firstName: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("first_name"),
  ),
  hasBusinessZones: Schema.optional(Schema.Boolean).pipe(T.JsonName("has_business_zones")),
  hasEnterpriseZones: Schema.optional(Schema.Boolean).pipe(T.JsonName("has_enterprise_zones")),
  hasProZones: Schema.optional(Schema.Boolean).pipe(T.JsonName("has_pro_zones")),
  lastName: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(T.JsonName("last_name")),
  organizations: Schema.optional(Schema.Array(Schema.Unknown)),
  suspended: Schema.optional(Schema.Boolean),
  telephone: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  twoFactorAuthenticationEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("two_factor_authentication_enabled"),
  ),
  twoFactorAuthenticationLocked: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("two_factor_authentication_locked"),
  ),
  zipcode: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<GetUserResponse>;

export const getUser = API.make(() => ({
  input: GetUserRequest,
  output: GetUserResponse,
  errors: [],
}));

export interface PatchUserRequest {
  /** The country in which the user lives. */
  country?: string | null;
  /** User's first name */
  firstName?: string | null;
  /** User's last name */
  lastName?: string | null;
  /** User's telephone number */
  telephone?: string | null;
  /** The zipcode or postal code where the user lives. */
  zipcode?: string | null;
}

export const PatchUserRequest = Schema.Struct({
  country: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  firstName: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("first_name"),
  ),
  lastName: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(T.JsonName("last_name")),
  telephone: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  zipcode: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}).pipe(T.Http({ method: "PATCH", path: "/user" })) as unknown as Schema.Schema<PatchUserRequest>;

export interface PatchUserResponse {
  /** Identifier of the user. */
  id?: string;
  /** Lists the betas that the user is participating in. */
  betas?: string[];
  /** The country in which the user lives. */
  country?: string | null;
  /** User's first name */
  firstName?: string | null;
  /** Indicates whether user has any business zones */
  hasBusinessZones?: boolean;
  /** Indicates whether user has any enterprise zones */
  hasEnterpriseZones?: boolean;
  /** Indicates whether user has any pro zones */
  hasProZones?: boolean;
  /** User's last name */
  lastName?: string | null;
  organizations?: unknown[];
  /** Indicates whether user has been suspended */
  suspended?: boolean;
  /** User's telephone number */
  telephone?: string | null;
  /** Indicates whether two-factor authentication is enabled for the user account. Does not apply to API authentication. */
  twoFactorAuthenticationEnabled?: boolean;
  /** Indicates whether two-factor authentication is required by one of the accounts that the user is a member of. */
  twoFactorAuthenticationLocked?: boolean;
  /** The zipcode or postal code where the user lives. */
  zipcode?: string | null;
}

export const PatchUserResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  betas: Schema.optional(Schema.Array(Schema.String)),
  country: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  firstName: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(
    T.JsonName("first_name"),
  ),
  hasBusinessZones: Schema.optional(Schema.Boolean).pipe(T.JsonName("has_business_zones")),
  hasEnterpriseZones: Schema.optional(Schema.Boolean).pipe(T.JsonName("has_enterprise_zones")),
  hasProZones: Schema.optional(Schema.Boolean).pipe(T.JsonName("has_pro_zones")),
  lastName: Schema.optional(Schema.Union(Schema.String, Schema.Null)).pipe(T.JsonName("last_name")),
  organizations: Schema.optional(Schema.Array(Schema.Unknown)),
  suspended: Schema.optional(Schema.Boolean),
  telephone: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
  twoFactorAuthenticationEnabled: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("two_factor_authentication_enabled"),
  ),
  twoFactorAuthenticationLocked: Schema.optional(Schema.Boolean).pipe(
    T.JsonName("two_factor_authentication_locked"),
  ),
  zipcode: Schema.optional(Schema.Union(Schema.String, Schema.Null)),
}) as unknown as Schema.Schema<PatchUserResponse>;

export const patchUser = API.make(() => ({
  input: PatchUserRequest,
  output: PatchUserResponse,
  errors: [],
}));
