import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({ sdkId: "Account", serviceShapeName: "Account" });
const auth = T.AwsAuthSigv4({ name: "account" });
const ver = T.ServiceVersion("2021-02-01");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = (_0: unknown) => ({
    authSchemes: [
      {
        name: "sigv4",
        signingRegion: `${_.getAttr(_0, "implicitGlobalRegion")}`,
      },
    ],
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://account-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p0(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://account-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
              _p0(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://account.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p0(PartitionResult),
              {},
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://account.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          _p0(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AccountName = string | Redacted.Redacted<string>;
export type AccountId = string;
export type Name = string | Redacted.Redacted<string>;
export type Title = string | Redacted.Redacted<string>;
export type EmailAddress = string | Redacted.Redacted<string>;
export type PhoneNumber = string | Redacted.Redacted<string>;
export type AlternateContactType = string;
export type PrimaryEmailAddress = string | Redacted.Redacted<string>;
export type Otp = string | Redacted.Redacted<string>;
export type RegionName = string;
export type RegionOptStatus = string;
export type FullName = string | Redacted.Redacted<string>;
export type AddressLine = string | Redacted.Redacted<string>;
export type City = string | Redacted.Redacted<string>;
export type StateOrRegion = string | Redacted.Redacted<string>;
export type DistrictOrCounty = string | Redacted.Redacted<string>;
export type PostalCode = string | Redacted.Redacted<string>;
export type CountryCode = string | Redacted.Redacted<string>;
export type ContactInformationPhoneNumber = string | Redacted.Redacted<string>;
export type CompanyName = string | Redacted.Redacted<string>;
export type WebsiteUrl = string | Redacted.Redacted<string>;
export type AwsAccountState = string;
export type PrimaryEmailUpdateStatus = string;
export type SensitiveString = string | Redacted.Redacted<string>;
export type ValidationExceptionReason = string;

//# Schemas
export type RegionOptStatusList = string[];
export const RegionOptStatusList = S.Array(S.String);
export interface PutAccountNameRequest {
  AccountName: string | Redacted.Redacted<string>;
  AccountId?: string;
}
export const PutAccountNameRequest = S.suspend(() =>
  S.Struct({
    AccountName: SensitiveString,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/putAccountName" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAccountNameRequest",
}) as any as S.Schema<PutAccountNameRequest>;
export interface PutAccountNameResponse {}
export const PutAccountNameResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "PutAccountNameResponse" },
) as any as S.Schema<PutAccountNameResponse>;
export interface GetAccountInformationRequest {
  AccountId?: string;
}
export const GetAccountInformationRequest = S.suspend(() =>
  S.Struct({ AccountId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getAccountInformation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountInformationRequest",
}) as any as S.Schema<GetAccountInformationRequest>;
export interface PutAlternateContactRequest {
  Name: string | Redacted.Redacted<string>;
  Title: string | Redacted.Redacted<string>;
  EmailAddress: string | Redacted.Redacted<string>;
  PhoneNumber: string | Redacted.Redacted<string>;
  AlternateContactType: string;
  AccountId?: string;
}
export const PutAlternateContactRequest = S.suspend(() =>
  S.Struct({
    Name: SensitiveString,
    Title: SensitiveString,
    EmailAddress: SensitiveString,
    PhoneNumber: SensitiveString,
    AlternateContactType: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/putAlternateContact" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAlternateContactRequest",
}) as any as S.Schema<PutAlternateContactRequest>;
export interface PutAlternateContactResponse {}
export const PutAlternateContactResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutAlternateContactResponse",
}) as any as S.Schema<PutAlternateContactResponse>;
export interface GetAlternateContactRequest {
  AlternateContactType: string;
  AccountId?: string;
}
export const GetAlternateContactRequest = S.suspend(() =>
  S.Struct({
    AlternateContactType: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getAlternateContact" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAlternateContactRequest",
}) as any as S.Schema<GetAlternateContactRequest>;
export interface DeleteAlternateContactRequest {
  AlternateContactType: string;
  AccountId?: string;
}
export const DeleteAlternateContactRequest = S.suspend(() =>
  S.Struct({
    AlternateContactType: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deleteAlternateContact" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAlternateContactRequest",
}) as any as S.Schema<DeleteAlternateContactRequest>;
export interface DeleteAlternateContactResponse {}
export const DeleteAlternateContactResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAlternateContactResponse",
}) as any as S.Schema<DeleteAlternateContactResponse>;
export interface GetGovCloudAccountInformationRequest {
  StandardAccountId?: string;
}
export const GetGovCloudAccountInformationRequest = S.suspend(() =>
  S.Struct({ StandardAccountId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getGovCloudAccountInformation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGovCloudAccountInformationRequest",
}) as any as S.Schema<GetGovCloudAccountInformationRequest>;
export interface GetContactInformationRequest {
  AccountId?: string;
}
export const GetContactInformationRequest = S.suspend(() =>
  S.Struct({ AccountId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getContactInformation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContactInformationRequest",
}) as any as S.Schema<GetContactInformationRequest>;
export interface AcceptPrimaryEmailUpdateRequest {
  AccountId: string;
  PrimaryEmail: string | Redacted.Redacted<string>;
  Otp: string | Redacted.Redacted<string>;
}
export const AcceptPrimaryEmailUpdateRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    PrimaryEmail: SensitiveString,
    Otp: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/acceptPrimaryEmailUpdate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptPrimaryEmailUpdateRequest",
}) as any as S.Schema<AcceptPrimaryEmailUpdateRequest>;
export interface GetPrimaryEmailRequest {
  AccountId: string;
}
export const GetPrimaryEmailRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getPrimaryEmail" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPrimaryEmailRequest",
}) as any as S.Schema<GetPrimaryEmailRequest>;
export interface StartPrimaryEmailUpdateRequest {
  AccountId: string;
  PrimaryEmail: string | Redacted.Redacted<string>;
}
export const StartPrimaryEmailUpdateRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String, PrimaryEmail: SensitiveString }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/startPrimaryEmailUpdate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartPrimaryEmailUpdateRequest",
}) as any as S.Schema<StartPrimaryEmailUpdateRequest>;
export interface DisableRegionRequest {
  AccountId?: string;
  RegionName: string;
}
export const DisableRegionRequest = S.suspend(() =>
  S.Struct({ AccountId: S.optional(S.String), RegionName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/disableRegion" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableRegionRequest",
}) as any as S.Schema<DisableRegionRequest>;
export interface DisableRegionResponse {}
export const DisableRegionResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DisableRegionResponse",
}) as any as S.Schema<DisableRegionResponse>;
export interface EnableRegionRequest {
  AccountId?: string;
  RegionName: string;
}
export const EnableRegionRequest = S.suspend(() =>
  S.Struct({ AccountId: S.optional(S.String), RegionName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/enableRegion" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableRegionRequest",
}) as any as S.Schema<EnableRegionRequest>;
export interface EnableRegionResponse {}
export const EnableRegionResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "EnableRegionResponse",
}) as any as S.Schema<EnableRegionResponse>;
export interface GetRegionOptStatusRequest {
  AccountId?: string;
  RegionName: string;
}
export const GetRegionOptStatusRequest = S.suspend(() =>
  S.Struct({ AccountId: S.optional(S.String), RegionName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getRegionOptStatus" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRegionOptStatusRequest",
}) as any as S.Schema<GetRegionOptStatusRequest>;
export interface ListRegionsRequest {
  AccountId?: string;
  MaxResults?: number;
  NextToken?: string;
  RegionOptStatusContains?: RegionOptStatusList;
}
export const ListRegionsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    RegionOptStatusContains: S.optional(RegionOptStatusList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listRegions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRegionsRequest",
}) as any as S.Schema<ListRegionsRequest>;
export interface ContactInformation {
  FullName: string | Redacted.Redacted<string>;
  AddressLine1: string | Redacted.Redacted<string>;
  AddressLine2?: string | Redacted.Redacted<string>;
  AddressLine3?: string | Redacted.Redacted<string>;
  City: string | Redacted.Redacted<string>;
  StateOrRegion?: string | Redacted.Redacted<string>;
  DistrictOrCounty?: string | Redacted.Redacted<string>;
  PostalCode: string | Redacted.Redacted<string>;
  CountryCode: string | Redacted.Redacted<string>;
  PhoneNumber: string | Redacted.Redacted<string>;
  CompanyName?: string | Redacted.Redacted<string>;
  WebsiteUrl?: string | Redacted.Redacted<string>;
}
export const ContactInformation = S.suspend(() =>
  S.Struct({
    FullName: SensitiveString,
    AddressLine1: SensitiveString,
    AddressLine2: S.optional(SensitiveString),
    AddressLine3: S.optional(SensitiveString),
    City: SensitiveString,
    StateOrRegion: S.optional(SensitiveString),
    DistrictOrCounty: S.optional(SensitiveString),
    PostalCode: SensitiveString,
    CountryCode: SensitiveString,
    PhoneNumber: SensitiveString,
    CompanyName: S.optional(SensitiveString),
    WebsiteUrl: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ContactInformation",
}) as any as S.Schema<ContactInformation>;
export interface GetAccountInformationResponse {
  AccountId?: string;
  AccountName?: string | Redacted.Redacted<string>;
  AccountCreatedDate?: Date;
}
export const GetAccountInformationResponse = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    AccountName: S.optional(SensitiveString),
    AccountCreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetAccountInformationResponse",
}) as any as S.Schema<GetAccountInformationResponse>;
export interface GetGovCloudAccountInformationResponse {
  GovCloudAccountId: string;
  AccountState: string;
}
export const GetGovCloudAccountInformationResponse = S.suspend(() =>
  S.Struct({ GovCloudAccountId: S.String, AccountState: S.String }),
).annotations({
  identifier: "GetGovCloudAccountInformationResponse",
}) as any as S.Schema<GetGovCloudAccountInformationResponse>;
export interface PutContactInformationRequest {
  ContactInformation: ContactInformation;
  AccountId?: string;
}
export const PutContactInformationRequest = S.suspend(() =>
  S.Struct({
    ContactInformation: ContactInformation,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/putContactInformation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutContactInformationRequest",
}) as any as S.Schema<PutContactInformationRequest>;
export interface PutContactInformationResponse {}
export const PutContactInformationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutContactInformationResponse",
}) as any as S.Schema<PutContactInformationResponse>;
export interface GetContactInformationResponse {
  ContactInformation?: ContactInformation;
}
export const GetContactInformationResponse = S.suspend(() =>
  S.Struct({ ContactInformation: S.optional(ContactInformation) }),
).annotations({
  identifier: "GetContactInformationResponse",
}) as any as S.Schema<GetContactInformationResponse>;
export interface AcceptPrimaryEmailUpdateResponse {
  Status?: string;
}
export const AcceptPrimaryEmailUpdateResponse = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({
  identifier: "AcceptPrimaryEmailUpdateResponse",
}) as any as S.Schema<AcceptPrimaryEmailUpdateResponse>;
export interface GetPrimaryEmailResponse {
  PrimaryEmail?: string | Redacted.Redacted<string>;
}
export const GetPrimaryEmailResponse = S.suspend(() =>
  S.Struct({ PrimaryEmail: S.optional(SensitiveString) }),
).annotations({
  identifier: "GetPrimaryEmailResponse",
}) as any as S.Schema<GetPrimaryEmailResponse>;
export interface StartPrimaryEmailUpdateResponse {
  Status?: string;
}
export const StartPrimaryEmailUpdateResponse = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({
  identifier: "StartPrimaryEmailUpdateResponse",
}) as any as S.Schema<StartPrimaryEmailUpdateResponse>;
export interface GetRegionOptStatusResponse {
  RegionName?: string;
  RegionOptStatus?: string;
}
export const GetRegionOptStatusResponse = S.suspend(() =>
  S.Struct({
    RegionName: S.optional(S.String),
    RegionOptStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRegionOptStatusResponse",
}) as any as S.Schema<GetRegionOptStatusResponse>;
export interface AlternateContact {
  Name?: string | Redacted.Redacted<string>;
  Title?: string | Redacted.Redacted<string>;
  EmailAddress?: string | Redacted.Redacted<string>;
  PhoneNumber?: string | Redacted.Redacted<string>;
  AlternateContactType?: string;
}
export const AlternateContact = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    Title: S.optional(SensitiveString),
    EmailAddress: S.optional(SensitiveString),
    PhoneNumber: S.optional(SensitiveString),
    AlternateContactType: S.optional(S.String),
  }),
).annotations({
  identifier: "AlternateContact",
}) as any as S.Schema<AlternateContact>;
export interface Region {
  RegionName?: string;
  RegionOptStatus?: string;
}
export const Region = S.suspend(() =>
  S.Struct({
    RegionName: S.optional(S.String),
    RegionOptStatus: S.optional(S.String),
  }),
).annotations({ identifier: "Region" }) as any as S.Schema<Region>;
export type RegionOptList = Region[];
export const RegionOptList = S.Array(Region);
export interface GetAlternateContactResponse {
  AlternateContact?: AlternateContact;
}
export const GetAlternateContactResponse = S.suspend(() =>
  S.Struct({ AlternateContact: S.optional(AlternateContact) }),
).annotations({
  identifier: "GetAlternateContactResponse",
}) as any as S.Schema<GetAlternateContactResponse>;
export interface ListRegionsResponse {
  NextToken?: string;
  Regions?: RegionOptList;
}
export const ListRegionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Regions: S.optional(RegionOptList),
  }),
).annotations({
  identifier: "ListRegionsResponse",
}) as any as S.Schema<ListRegionsResponse>;
export interface ValidationExceptionField {
  name: string;
  message: string | Redacted.Redacted<string>;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: SensitiveString }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    message: S.String,
    errorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    errorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    errorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withConflictError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {
    message: S.String,
    errorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    errorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withBadRequestError) {}
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  {
    message: S.String,
    errorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: SensitiveString,
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Updates the account name of the specified account. To use this API, IAM principals must have the `account:PutAccountName` IAM permission.
 */
export const putAccountName: (
  input: PutAccountNameRequest,
) => Effect.Effect<
  PutAccountNameResponse,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountNameRequest,
  output: PutAccountNameResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Retrieves the specified alternate contact attached to an Amazon Web Services account.
 *
 * For complete details about how to use the alternate contact operations, see Update the alternate contacts for your Amazon Web Services account.
 *
 * Before you can update the alternate contact information for an Amazon Web Services account that is managed by Organizations, you must first enable integration between Amazon Web Services Account Management and Organizations. For more information, see Enable trusted access for Amazon Web Services Account Management.
 */
export const getAlternateContact: (
  input: GetAlternateContactRequest,
) => Effect.Effect<
  GetAlternateContactResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAlternateContactRequest,
  output: GetAlternateContactResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Lists all the Regions for a given account and their respective opt-in statuses. Optionally, this list can be filtered by the `region-opt-status-contains` parameter.
 */
export const listRegions: {
  (
    input: ListRegionsRequest,
  ): Effect.Effect<
    ListRegionsResponse,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListRegionsRequest,
  ) => Stream.Stream<
    ListRegionsResponse,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListRegionsRequest,
  ) => Stream.Stream<
    Region,
    | AccessDeniedException
    | InternalServerException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRegionsRequest,
  output: ListRegionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    TooManyRequestsException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Regions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves information about the specified account including its account name, account ID, and account creation date and time. To use this API, an IAM user or role must have the `account:GetAccountInformation` IAM permission.
 */
export const getAccountInformation: (
  input: GetAccountInformationRequest,
) => Effect.Effect<
  GetAccountInformationResponse,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountInformationRequest,
  output: GetAccountInformationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Updates the primary contact information of an Amazon Web Services account.
 *
 * For complete details about how to use the primary contact operations, see Update the primary contact for your Amazon Web Services account.
 */
export const putContactInformation: (
  input: PutContactInformationRequest,
) => Effect.Effect<
  PutContactInformationResponse,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutContactInformationRequest,
  output: PutContactInformationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Retrieves the opt-in status of a particular Region.
 */
export const getRegionOptStatus: (
  input: GetRegionOptStatusRequest,
) => Effect.Effect<
  GetRegionOptStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegionOptStatusRequest,
  output: GetRegionOptStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Modifies the specified alternate contact attached to an Amazon Web Services account.
 *
 * For complete details about how to use the alternate contact operations, see Update the alternate contacts for your Amazon Web Services account.
 *
 * Before you can update the alternate contact information for an Amazon Web Services account that is managed by Organizations, you must first enable integration between Amazon Web Services Account Management and Organizations. For more information, see Enable trusted access for Amazon Web Services Account Management.
 */
export const putAlternateContact: (
  input: PutAlternateContactRequest,
) => Effect.Effect<
  PutAlternateContactResponse,
  | AccessDeniedException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAlternateContactRequest,
  output: PutAlternateContactResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Disables (opts-out) a particular Region for an account.
 *
 * The act of disabling a Region will remove all IAM access to any resources that reside in that Region.
 */
export const disableRegion: (
  input: DisableRegionRequest,
) => Effect.Effect<
  DisableRegionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableRegionRequest,
  output: DisableRegionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Enables (opts-in) a particular Region for an account.
 */
export const enableRegion: (
  input: EnableRegionRequest,
) => Effect.Effect<
  EnableRegionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableRegionRequest,
  output: EnableRegionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Accepts the request that originated from StartPrimaryEmailUpdate to update the primary email address (also known as the root user email address) for the specified account.
 */
export const acceptPrimaryEmailUpdate: (
  input: AcceptPrimaryEmailUpdateRequest,
) => Effect.Effect<
  AcceptPrimaryEmailUpdateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptPrimaryEmailUpdateRequest,
  output: AcceptPrimaryEmailUpdateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Retrieves the primary contact information of an Amazon Web Services account.
 *
 * For complete details about how to use the primary contact operations, see Update the primary contact for your Amazon Web Services account.
 */
export const getContactInformation: (
  input: GetContactInformationRequest,
) => Effect.Effect<
  GetContactInformationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContactInformationRequest,
  output: GetContactInformationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Retrieves the primary email address for the specified account.
 */
export const getPrimaryEmail: (
  input: GetPrimaryEmailRequest,
) => Effect.Effect<
  GetPrimaryEmailResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPrimaryEmailRequest,
  output: GetPrimaryEmailResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified alternate contact from an Amazon Web Services account.
 *
 * For complete details about how to use the alternate contact operations, see Update the alternate contacts for your Amazon Web Services account.
 *
 * Before you can update the alternate contact information for an Amazon Web Services account that is managed by Organizations, you must first enable integration between Amazon Web Services Account Management and Organizations. For more information, see Enable trusted access for Amazon Web Services Account Management.
 */
export const deleteAlternateContact: (
  input: DeleteAlternateContactRequest,
) => Effect.Effect<
  DeleteAlternateContactResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAlternateContactRequest,
  output: DeleteAlternateContactResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Starts the process to update the primary email address for the specified account.
 */
export const startPrimaryEmailUpdate: (
  input: StartPrimaryEmailUpdateRequest,
) => Effect.Effect<
  StartPrimaryEmailUpdateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartPrimaryEmailUpdateRequest,
  output: StartPrimaryEmailUpdateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the GovCloud account linked to the specified standard account (if it exists) including the GovCloud account ID and state. To use this API, an IAM user or role must have the `account:GetGovCloudAccountInformation` IAM permission.
 */
export const getGovCloudAccountInformation: (
  input: GetGovCloudAccountInformationRequest,
) => Effect.Effect<
  GetGovCloudAccountInformationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ResourceUnavailableException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGovCloudAccountInformationRequest,
  output: GetGovCloudAccountInformationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
