/**
 * Cloudflare BILLING API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service billing
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// Profile
// =============================================================================

export interface GetProfileRequest {
  /** Identifier */
  accountId: string;
}

export const GetProfileRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/billing/profile" }),
) as unknown as Schema.Schema<GetProfileRequest>;

export interface GetProfileResponse {
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

export const GetProfileResponse = Schema.Struct({
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
}) as unknown as Schema.Schema<GetProfileResponse>;

export const getProfile = API.make(() => ({
  input: GetProfileRequest,
  output: GetProfileResponse,
  errors: [],
}));
