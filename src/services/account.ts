import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "Account", serviceShapeName: "Account" });
const auth = T.AwsAuthSigv4({ name: "account" });
const ver = T.ServiceVersion("2021-02-01");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    UseDualStack: {
      builtIn: "AWS::UseDualStack",
      required: true,
      default: false,
      documentation:
        "When true, use the dual-stack endpoint. If the configured endpoint does not support dual-stack, dispatching the request MAY return an error.",
      type: "boolean",
    },
    UseFIPS: {
      builtIn: "AWS::UseFIPS",
      required: true,
      default: false,
      documentation:
        "When true, send this request to the FIPS-compliant regional endpoint. If the configured endpoint does not have a FIPS compliant endpoint, dispatching the request will return an error.",
      type: "boolean",
    },
    Endpoint: {
      builtIn: "SDK::Endpoint",
      required: false,
      documentation: "Override the endpoint used to send this request",
      type: "string",
    },
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
  },
  rules: [
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }],
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          error:
            "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          rules: [
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              error:
                "Invalid Configuration: Dualstack and custom endpoint are not supported",
              type: "error",
            },
            {
              conditions: [],
              endpoint: {
                url: { ref: "Endpoint" },
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
          ],
          type: "tree",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      rules: [
        {
          conditions: [{ fn: "isSet", argv: [{ ref: "Region" }] }],
          rules: [
            {
              conditions: [
                {
                  fn: "aws.partition",
                  argv: [{ ref: "Region" }],
                  assign: "PartitionResult",
                },
              ],
              rules: [
                {
                  conditions: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "booleanEquals",
                          argv: [
                            true,
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                          ],
                        },
                        {
                          fn: "booleanEquals",
                          argv: [
                            true,
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsDualStack",
                              ],
                            },
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://account-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
                            headers: {},
                          },
                          type: "endpoint",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      error:
                        "FIPS and DualStack are enabled, but this partition does not support one or both",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "booleanEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://account-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
                            headers: {},
                          },
                          type: "endpoint",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "booleanEquals",
                          argv: [
                            true,
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsDualStack",
                              ],
                            },
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://account.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
                            headers: {},
                          },
                          type: "endpoint",
                        },
                      ],
                      type: "tree",
                    },
                    {
                      conditions: [],
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://account.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingRegion:
                            "{PartitionResult#implicitGlobalRegion}",
                        },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
              ],
              type: "tree",
            },
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export const RegionOptStatusList = S.Array(S.String);
export class PutAccountNameRequest extends S.Class<PutAccountNameRequest>(
  "PutAccountNameRequest",
)(
  { AccountName: S.String, AccountId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/putAccountName" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutAccountNameResponse extends S.Class<PutAccountNameResponse>(
  "PutAccountNameResponse",
)({}) {}
export class GetAccountInformationRequest extends S.Class<GetAccountInformationRequest>(
  "GetAccountInformationRequest",
)(
  { AccountId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/getAccountInformation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutAlternateContactRequest extends S.Class<PutAlternateContactRequest>(
  "PutAlternateContactRequest",
)(
  {
    Name: S.String,
    Title: S.String,
    EmailAddress: S.String,
    PhoneNumber: S.String,
    AlternateContactType: S.String,
    AccountId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/putAlternateContact" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutAlternateContactResponse extends S.Class<PutAlternateContactResponse>(
  "PutAlternateContactResponse",
)({}) {}
export class GetAlternateContactRequest extends S.Class<GetAlternateContactRequest>(
  "GetAlternateContactRequest",
)(
  { AlternateContactType: S.String, AccountId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/getAlternateContact" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAlternateContactRequest extends S.Class<DeleteAlternateContactRequest>(
  "DeleteAlternateContactRequest",
)(
  { AlternateContactType: S.String, AccountId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/deleteAlternateContact" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAlternateContactResponse extends S.Class<DeleteAlternateContactResponse>(
  "DeleteAlternateContactResponse",
)({}) {}
export class GetGovCloudAccountInformationRequest extends S.Class<GetGovCloudAccountInformationRequest>(
  "GetGovCloudAccountInformationRequest",
)(
  { StandardAccountId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/getGovCloudAccountInformation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContactInformationRequest extends S.Class<GetContactInformationRequest>(
  "GetContactInformationRequest",
)(
  { AccountId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/getContactInformation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptPrimaryEmailUpdateRequest extends S.Class<AcceptPrimaryEmailUpdateRequest>(
  "AcceptPrimaryEmailUpdateRequest",
)(
  { AccountId: S.String, PrimaryEmail: S.String, Otp: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/acceptPrimaryEmailUpdate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPrimaryEmailRequest extends S.Class<GetPrimaryEmailRequest>(
  "GetPrimaryEmailRequest",
)(
  { AccountId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/getPrimaryEmail" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartPrimaryEmailUpdateRequest extends S.Class<StartPrimaryEmailUpdateRequest>(
  "StartPrimaryEmailUpdateRequest",
)(
  { AccountId: S.String, PrimaryEmail: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/startPrimaryEmailUpdate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableRegionRequest extends S.Class<DisableRegionRequest>(
  "DisableRegionRequest",
)(
  { AccountId: S.optional(S.String), RegionName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/disableRegion" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableRegionResponse extends S.Class<DisableRegionResponse>(
  "DisableRegionResponse",
)({}) {}
export class EnableRegionRequest extends S.Class<EnableRegionRequest>(
  "EnableRegionRequest",
)(
  { AccountId: S.optional(S.String), RegionName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/enableRegion" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableRegionResponse extends S.Class<EnableRegionResponse>(
  "EnableRegionResponse",
)({}) {}
export class GetRegionOptStatusRequest extends S.Class<GetRegionOptStatusRequest>(
  "GetRegionOptStatusRequest",
)(
  { AccountId: S.optional(S.String), RegionName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/getRegionOptStatus" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRegionsRequest extends S.Class<ListRegionsRequest>(
  "ListRegionsRequest",
)(
  {
    AccountId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    RegionOptStatusContains: S.optional(RegionOptStatusList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listRegions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ContactInformation extends S.Class<ContactInformation>(
  "ContactInformation",
)({
  FullName: S.String,
  AddressLine1: S.String,
  AddressLine2: S.optional(S.String),
  AddressLine3: S.optional(S.String),
  City: S.String,
  StateOrRegion: S.optional(S.String),
  DistrictOrCounty: S.optional(S.String),
  PostalCode: S.String,
  CountryCode: S.String,
  PhoneNumber: S.String,
  CompanyName: S.optional(S.String),
  WebsiteUrl: S.optional(S.String),
}) {}
export class GetAccountInformationResponse extends S.Class<GetAccountInformationResponse>(
  "GetAccountInformationResponse",
)({
  AccountId: S.optional(S.String),
  AccountName: S.optional(S.String),
  AccountCreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetGovCloudAccountInformationResponse extends S.Class<GetGovCloudAccountInformationResponse>(
  "GetGovCloudAccountInformationResponse",
)({ GovCloudAccountId: S.String, AccountState: S.String }) {}
export class PutContactInformationRequest extends S.Class<PutContactInformationRequest>(
  "PutContactInformationRequest",
)(
  { ContactInformation: ContactInformation, AccountId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/putContactInformation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutContactInformationResponse extends S.Class<PutContactInformationResponse>(
  "PutContactInformationResponse",
)({}) {}
export class GetContactInformationResponse extends S.Class<GetContactInformationResponse>(
  "GetContactInformationResponse",
)({ ContactInformation: S.optional(ContactInformation) }) {}
export class AcceptPrimaryEmailUpdateResponse extends S.Class<AcceptPrimaryEmailUpdateResponse>(
  "AcceptPrimaryEmailUpdateResponse",
)({ Status: S.optional(S.String) }) {}
export class GetPrimaryEmailResponse extends S.Class<GetPrimaryEmailResponse>(
  "GetPrimaryEmailResponse",
)({ PrimaryEmail: S.optional(S.String) }) {}
export class StartPrimaryEmailUpdateResponse extends S.Class<StartPrimaryEmailUpdateResponse>(
  "StartPrimaryEmailUpdateResponse",
)({ Status: S.optional(S.String) }) {}
export class GetRegionOptStatusResponse extends S.Class<GetRegionOptStatusResponse>(
  "GetRegionOptStatusResponse",
)({
  RegionName: S.optional(S.String),
  RegionOptStatus: S.optional(S.String),
}) {}
export class AlternateContact extends S.Class<AlternateContact>(
  "AlternateContact",
)({
  Name: S.optional(S.String),
  Title: S.optional(S.String),
  EmailAddress: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
  AlternateContactType: S.optional(S.String),
}) {}
export class Region extends S.Class<Region>("Region")({
  RegionName: S.optional(S.String),
  RegionOptStatus: S.optional(S.String),
}) {}
export const RegionOptList = S.Array(Region);
export class GetAlternateContactResponse extends S.Class<GetAlternateContactResponse>(
  "GetAlternateContactResponse",
)({ AlternateContact: S.optional(AlternateContact) }) {}
export class ListRegionsResponse extends S.Class<ListRegionsResponse>(
  "ListRegionsResponse",
)({ NextToken: S.optional(S.String), Regions: S.optional(RegionOptList) }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    message: S.String,
    errorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    errorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    errorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {
    message: S.String,
    errorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    errorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
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
    message: S.String,
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Updates the account name of the specified account. To use this API, IAM principals must have the `account:PutAccountName` IAM permission.
 */
export const putAccountName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAlternateContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listRegions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Retrieves information about the specified account including its account name, account ID, and account creation date and time. To use this API, an IAM user or role must have the `account:GetAccountInformation` IAM permission.
 */
export const getAccountInformation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAccountInformationRequest,
    output: GetAccountInformationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the primary contact information of an Amazon Web Services account.
 *
 * For complete details about how to use the primary contact operations, see Update the primary contact for your Amazon Web Services account.
 */
export const putContactInformation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutContactInformationRequest,
    output: PutContactInformationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the opt-in status of a particular Region.
 */
export const getRegionOptStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putAlternateContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disableRegion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const enableRegion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const acceptPrimaryEmailUpdate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves the primary contact information of an Amazon Web Services account.
 *
 * For complete details about how to use the primary contact operations, see Update the primary contact for your Amazon Web Services account.
 */
export const getContactInformation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetContactInformationRequest,
    output: GetContactInformationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the primary email address for the specified account.
 */
export const getPrimaryEmail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAlternateContact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAlternateContactRequest,
    output: DeleteAlternateContactResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Starts the process to update the primary email address for the specified account.
 */
export const startPrimaryEmailUpdate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves information about the GovCloud account linked to the specified standard account (if it exists) including the GovCloud account ID and state. To use this API, an IAM user or role must have the `account:GetGovCloudAccountInformation` IAM permission.
 */
export const getGovCloudAccountInformation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
