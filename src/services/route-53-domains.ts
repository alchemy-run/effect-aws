import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace(
  "https://route53domains.amazonaws.com/doc/2014-05-15/",
);
const svc = T.AwsApiService({
  sdkId: "Route 53 Domains",
  serviceShapeName: "Route53Domains_v20140515",
});
const auth = T.AwsAuthSigv4({ name: "route53domains" });
const ver = T.ServiceVersion("2014-05-15");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
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
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
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
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
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
                        url: "https://route53domains-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
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
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://route53domains-fips.{Region}.{PartitionResult#dnsSuffix}",
                        properties: {},
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
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
                        url: "https://route53domains.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
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
                url: "https://route53domains.{Region}.{PartitionResult#dnsSuffix}",
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
      error: "Invalid Configuration: Missing Region",
      type: "error",
    },
  ],
});

//# Schemas
export const TagKeyList = S.Array(S.String);
export const OperationStatusList = S.Array(S.String);
export const OperationTypeList = S.Array(S.String);
export class AcceptDomainTransferFromAnotherAwsAccountRequest extends S.Class<AcceptDomainTransferFromAnotherAwsAccountRequest>(
  "AcceptDomainTransferFromAnotherAwsAccountRequest",
)(
  { DomainName: S.String, Password: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelDomainTransferToAnotherAwsAccountRequest extends S.Class<CancelDomainTransferToAnotherAwsAccountRequest>(
  "CancelDomainTransferToAnotherAwsAccountRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CheckDomainAvailabilityRequest extends S.Class<CheckDomainAvailabilityRequest>(
  "CheckDomainAvailabilityRequest",
)(
  { DomainName: S.String, IdnLangCode: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CheckDomainTransferabilityRequest extends S.Class<CheckDomainTransferabilityRequest>(
  "CheckDomainTransferabilityRequest",
)(
  { DomainName: S.String, AuthCode: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDomainRequest extends S.Class<DeleteDomainRequest>(
  "DeleteDomainRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTagsForDomainRequest extends S.Class<DeleteTagsForDomainRequest>(
  "DeleteTagsForDomainRequest",
)(
  { DomainName: S.String, TagsToDelete: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTagsForDomainResponse extends S.Class<DeleteTagsForDomainResponse>(
  "DeleteTagsForDomainResponse",
)({}, ns) {}
export class DisableDomainAutoRenewRequest extends S.Class<DisableDomainAutoRenewRequest>(
  "DisableDomainAutoRenewRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableDomainAutoRenewResponse extends S.Class<DisableDomainAutoRenewResponse>(
  "DisableDomainAutoRenewResponse",
)({}, ns) {}
export class DisableDomainTransferLockRequest extends S.Class<DisableDomainTransferLockRequest>(
  "DisableDomainTransferLockRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateDelegationSignerFromDomainRequest extends S.Class<DisassociateDelegationSignerFromDomainRequest>(
  "DisassociateDelegationSignerFromDomainRequest",
)(
  { DomainName: S.String, Id: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableDomainAutoRenewRequest extends S.Class<EnableDomainAutoRenewRequest>(
  "EnableDomainAutoRenewRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableDomainAutoRenewResponse extends S.Class<EnableDomainAutoRenewResponse>(
  "EnableDomainAutoRenewResponse",
)({}, ns) {}
export class EnableDomainTransferLockRequest extends S.Class<EnableDomainTransferLockRequest>(
  "EnableDomainTransferLockRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetContactReachabilityStatusRequest extends S.Class<GetContactReachabilityStatusRequest>(
  "GetContactReachabilityStatusRequest",
)(
  { domainName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDomainDetailRequest extends S.Class<GetDomainDetailRequest>(
  "GetDomainDetailRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDomainSuggestionsRequest extends S.Class<GetDomainSuggestionsRequest>(
  "GetDomainSuggestionsRequest",
)(
  { DomainName: S.String, SuggestionCount: S.Number, OnlyAvailable: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOperationDetailRequest extends S.Class<GetOperationDetailRequest>(
  "GetOperationDetailRequest",
)(
  { OperationId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOperationsRequest extends S.Class<ListOperationsRequest>(
  "ListOperationsRequest",
)(
  {
    SubmittedSince: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Status: S.optional(OperationStatusList),
    Type: S.optional(OperationTypeList),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPricesRequest extends S.Class<ListPricesRequest>(
  "ListPricesRequest",
)(
  {
    Tld: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForDomainRequest extends S.Class<ListTagsForDomainRequest>(
  "ListTagsForDomainRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PushDomainRequest extends S.Class<PushDomainRequest>(
  "PushDomainRequest",
)(
  { DomainName: S.String, Target: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PushDomainResponse extends S.Class<PushDomainResponse>(
  "PushDomainResponse",
)({}, ns) {}
export class RejectDomainTransferFromAnotherAwsAccountRequest extends S.Class<RejectDomainTransferFromAnotherAwsAccountRequest>(
  "RejectDomainTransferFromAnotherAwsAccountRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RenewDomainRequest extends S.Class<RenewDomainRequest>(
  "RenewDomainRequest",
)(
  {
    DomainName: S.String,
    DurationInYears: S.optional(S.Number),
    CurrentExpiryYear: S.Number,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResendContactReachabilityEmailRequest extends S.Class<ResendContactReachabilityEmailRequest>(
  "ResendContactReachabilityEmailRequest",
)(
  { domainName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResendOperationAuthorizationRequest extends S.Class<ResendOperationAuthorizationRequest>(
  "ResendOperationAuthorizationRequest",
)(
  { OperationId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResendOperationAuthorizationResponse extends S.Class<ResendOperationAuthorizationResponse>(
  "ResendOperationAuthorizationResponse",
)({}, ns) {}
export class RetrieveDomainAuthCodeRequest extends S.Class<RetrieveDomainAuthCodeRequest>(
  "RetrieveDomainAuthCodeRequest",
)(
  { DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TransferDomainToAnotherAwsAccountRequest extends S.Class<TransferDomainToAnotherAwsAccountRequest>(
  "TransferDomainToAnotherAwsAccountRequest",
)(
  { DomainName: S.String, AccountId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDomainContactPrivacyRequest extends S.Class<UpdateDomainContactPrivacyRequest>(
  "UpdateDomainContactPrivacyRequest",
)(
  {
    DomainName: S.String,
    AdminPrivacy: S.optional(S.Boolean),
    RegistrantPrivacy: S.optional(S.Boolean),
    TechPrivacy: S.optional(S.Boolean),
    BillingPrivacy: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const GlueIpList = S.Array(S.String);
export class Nameserver extends S.Class<Nameserver>("Nameserver")({
  Name: S.String,
  GlueIps: S.optional(GlueIpList),
}) {}
export const NameserverList = S.Array(Nameserver);
export class UpdateDomainNameserversRequest extends S.Class<UpdateDomainNameserversRequest>(
  "UpdateDomainNameserversRequest",
)(
  {
    DomainName: S.String,
    FIAuthKey: S.optional(S.String),
    Nameservers: NameserverList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ViewBillingRequest extends S.Class<ViewBillingRequest>(
  "ViewBillingRequest",
)(
  {
    Start: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    End: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Values = S.Array(S.String);
export class DnssecSigningAttributes extends S.Class<DnssecSigningAttributes>(
  "DnssecSigningAttributes",
)({
  Algorithm: S.optional(S.Number),
  Flags: S.optional(S.Number),
  PublicKey: S.optional(S.String),
}) {}
export const DomainStatusList = S.Array(S.String);
export class FilterCondition extends S.Class<FilterCondition>(
  "FilterCondition",
)({ Name: S.String, Operator: S.String, Values: Values }) {}
export const FilterConditions = S.Array(FilterCondition);
export class SortCondition extends S.Class<SortCondition>("SortCondition")({
  Name: S.String,
  SortOrder: S.String,
}) {}
export class Consent extends S.Class<Consent>("Consent")({
  MaxPrice: S.Number,
  Currency: S.String,
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class AcceptDomainTransferFromAnotherAwsAccountResponse extends S.Class<AcceptDomainTransferFromAnotherAwsAccountResponse>(
  "AcceptDomainTransferFromAnotherAwsAccountResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class AssociateDelegationSignerToDomainRequest extends S.Class<AssociateDelegationSignerToDomainRequest>(
  "AssociateDelegationSignerToDomainRequest",
)(
  { DomainName: S.String, SigningAttributes: DnssecSigningAttributes },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelDomainTransferToAnotherAwsAccountResponse extends S.Class<CancelDomainTransferToAnotherAwsAccountResponse>(
  "CancelDomainTransferToAnotherAwsAccountResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class CheckDomainAvailabilityResponse extends S.Class<CheckDomainAvailabilityResponse>(
  "CheckDomainAvailabilityResponse",
)({ Availability: S.optional(S.String) }, ns) {}
export class DeleteDomainResponse extends S.Class<DeleteDomainResponse>(
  "DeleteDomainResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class DisableDomainTransferLockResponse extends S.Class<DisableDomainTransferLockResponse>(
  "DisableDomainTransferLockResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class DisassociateDelegationSignerFromDomainResponse extends S.Class<DisassociateDelegationSignerFromDomainResponse>(
  "DisassociateDelegationSignerFromDomainResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class EnableDomainTransferLockResponse extends S.Class<EnableDomainTransferLockResponse>(
  "EnableDomainTransferLockResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class GetContactReachabilityStatusResponse extends S.Class<GetContactReachabilityStatusResponse>(
  "GetContactReachabilityStatusResponse",
)({ domainName: S.optional(S.String), status: S.optional(S.String) }, ns) {}
export class GetOperationDetailResponse extends S.Class<GetOperationDetailResponse>(
  "GetOperationDetailResponse",
)(
  {
    OperationId: S.optional(S.String),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    DomainName: S.optional(S.String),
    Type: S.optional(S.String),
    SubmittedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StatusFlag: S.optional(S.String),
  },
  ns,
) {}
export class ListDomainsRequest extends S.Class<ListDomainsRequest>(
  "ListDomainsRequest",
)(
  {
    FilterConditions: S.optional(FilterConditions),
    SortCondition: S.optional(SortCondition),
    Marker: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForDomainResponse extends S.Class<ListTagsForDomainResponse>(
  "ListTagsForDomainResponse",
)({ TagList: S.optional(TagList) }, ns) {}
export class RejectDomainTransferFromAnotherAwsAccountResponse extends S.Class<RejectDomainTransferFromAnotherAwsAccountResponse>(
  "RejectDomainTransferFromAnotherAwsAccountResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class RenewDomainResponse extends S.Class<RenewDomainResponse>(
  "RenewDomainResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class ResendContactReachabilityEmailResponse extends S.Class<ResendContactReachabilityEmailResponse>(
  "ResendContactReachabilityEmailResponse",
)(
  {
    domainName: S.optional(S.String),
    emailAddress: S.optional(S.String),
    isAlreadyVerified: S.optional(S.Boolean),
  },
  ns,
) {}
export class RetrieveDomainAuthCodeResponse extends S.Class<RetrieveDomainAuthCodeResponse>(
  "RetrieveDomainAuthCodeResponse",
)({ AuthCode: S.optional(S.String) }, ns) {}
export class ExtraParam extends S.Class<ExtraParam>("ExtraParam")({
  Name: S.String,
  Value: S.String,
}) {}
export const ExtraParamList = S.Array(ExtraParam);
export class ContactDetail extends S.Class<ContactDetail>("ContactDetail")({
  FirstName: S.optional(S.String),
  LastName: S.optional(S.String),
  ContactType: S.optional(S.String),
  OrganizationName: S.optional(S.String),
  AddressLine1: S.optional(S.String),
  AddressLine2: S.optional(S.String),
  City: S.optional(S.String),
  State: S.optional(S.String),
  CountryCode: S.optional(S.String),
  ZipCode: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
  Email: S.optional(S.String),
  Fax: S.optional(S.String),
  ExtraParams: S.optional(ExtraParamList),
}) {}
export class TransferDomainRequest extends S.Class<TransferDomainRequest>(
  "TransferDomainRequest",
)(
  {
    DomainName: S.String,
    IdnLangCode: S.optional(S.String),
    DurationInYears: S.Number,
    Nameservers: S.optional(NameserverList),
    AuthCode: S.optional(S.String),
    AutoRenew: S.optional(S.Boolean),
    AdminContact: ContactDetail,
    RegistrantContact: ContactDetail,
    TechContact: ContactDetail,
    PrivacyProtectAdminContact: S.optional(S.Boolean),
    PrivacyProtectRegistrantContact: S.optional(S.Boolean),
    PrivacyProtectTechContact: S.optional(S.Boolean),
    BillingContact: S.optional(ContactDetail),
    PrivacyProtectBillingContact: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TransferDomainToAnotherAwsAccountResponse extends S.Class<TransferDomainToAnotherAwsAccountResponse>(
  "TransferDomainToAnotherAwsAccountResponse",
)({ OperationId: S.optional(S.String), Password: S.optional(S.String) }, ns) {}
export class UpdateDomainContactRequest extends S.Class<UpdateDomainContactRequest>(
  "UpdateDomainContactRequest",
)(
  {
    DomainName: S.String,
    AdminContact: S.optional(ContactDetail),
    RegistrantContact: S.optional(ContactDetail),
    TechContact: S.optional(ContactDetail),
    Consent: S.optional(Consent),
    BillingContact: S.optional(ContactDetail),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDomainContactPrivacyResponse extends S.Class<UpdateDomainContactPrivacyResponse>(
  "UpdateDomainContactPrivacyResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class UpdateDomainNameserversResponse extends S.Class<UpdateDomainNameserversResponse>(
  "UpdateDomainNameserversResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class UpdateTagsForDomainRequest extends S.Class<UpdateTagsForDomainRequest>(
  "UpdateTagsForDomainRequest",
)(
  { DomainName: S.String, TagsToUpdate: S.optional(TagList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTagsForDomainResponse extends S.Class<UpdateTagsForDomainResponse>(
  "UpdateTagsForDomainResponse",
)({}, ns) {}
export class DomainTransferability extends S.Class<DomainTransferability>(
  "DomainTransferability",
)({ Transferable: S.optional(S.String) }) {}
export class DnssecKey extends S.Class<DnssecKey>("DnssecKey")({
  Algorithm: S.optional(S.Number),
  Flags: S.optional(S.Number),
  PublicKey: S.optional(S.String),
  DigestType: S.optional(S.Number),
  Digest: S.optional(S.String),
  KeyTag: S.optional(S.Number),
  Id: S.optional(S.String),
}) {}
export const DnssecKeyList = S.Array(DnssecKey);
export class DomainSuggestion extends S.Class<DomainSuggestion>(
  "DomainSuggestion",
)({ DomainName: S.optional(S.String), Availability: S.optional(S.String) }) {}
export const DomainSuggestionsList = S.Array(DomainSuggestion);
export class OperationSummary extends S.Class<OperationSummary>(
  "OperationSummary",
)({
  OperationId: S.optional(S.String),
  Status: S.optional(S.String),
  Type: S.optional(S.String),
  SubmittedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DomainName: S.optional(S.String),
  Message: S.optional(S.String),
  StatusFlag: S.optional(S.String),
  LastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OperationSummaryList = S.Array(OperationSummary);
export class BillingRecord extends S.Class<BillingRecord>("BillingRecord")({
  DomainName: S.optional(S.String),
  Operation: S.optional(S.String),
  InvoiceId: S.optional(S.String),
  BillDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Price: S.optional(S.Number),
}) {}
export const BillingRecords = S.Array(BillingRecord);
export class AssociateDelegationSignerToDomainResponse extends S.Class<AssociateDelegationSignerToDomainResponse>(
  "AssociateDelegationSignerToDomainResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class CheckDomainTransferabilityResponse extends S.Class<CheckDomainTransferabilityResponse>(
  "CheckDomainTransferabilityResponse",
)(
  {
    Transferability: S.optional(DomainTransferability),
    Message: S.optional(S.String),
  },
  ns,
) {}
export class GetDomainDetailResponse extends S.Class<GetDomainDetailResponse>(
  "GetDomainDetailResponse",
)(
  {
    DomainName: S.optional(S.String),
    Nameservers: S.optional(NameserverList),
    AutoRenew: S.optional(S.Boolean),
    AdminContact: S.optional(ContactDetail),
    RegistrantContact: S.optional(ContactDetail),
    TechContact: S.optional(ContactDetail),
    AdminPrivacy: S.optional(S.Boolean),
    RegistrantPrivacy: S.optional(S.Boolean),
    TechPrivacy: S.optional(S.Boolean),
    RegistrarName: S.optional(S.String),
    WhoIsServer: S.optional(S.String),
    RegistrarUrl: S.optional(S.String),
    AbuseContactEmail: S.optional(S.String),
    AbuseContactPhone: S.optional(S.String),
    RegistryDomainId: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Reseller: S.optional(S.String),
    DnsSec: S.optional(S.String),
    StatusList: S.optional(DomainStatusList),
    DnssecKeys: S.optional(DnssecKeyList),
    BillingContact: S.optional(ContactDetail),
    BillingPrivacy: S.optional(S.Boolean),
  },
  ns,
) {}
export class GetDomainSuggestionsResponse extends S.Class<GetDomainSuggestionsResponse>(
  "GetDomainSuggestionsResponse",
)({ SuggestionsList: S.optional(DomainSuggestionsList) }, ns) {}
export class ListOperationsResponse extends S.Class<ListOperationsResponse>(
  "ListOperationsResponse",
)(
  {
    Operations: S.optional(OperationSummaryList),
    NextPageMarker: S.optional(S.String),
  },
  ns,
) {}
export class RegisterDomainRequest extends S.Class<RegisterDomainRequest>(
  "RegisterDomainRequest",
)(
  {
    DomainName: S.String,
    IdnLangCode: S.optional(S.String),
    DurationInYears: S.Number,
    AutoRenew: S.optional(S.Boolean),
    AdminContact: ContactDetail,
    RegistrantContact: ContactDetail,
    TechContact: ContactDetail,
    PrivacyProtectAdminContact: S.optional(S.Boolean),
    PrivacyProtectRegistrantContact: S.optional(S.Boolean),
    PrivacyProtectTechContact: S.optional(S.Boolean),
    BillingContact: S.optional(ContactDetail),
    PrivacyProtectBillingContact: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TransferDomainResponse extends S.Class<TransferDomainResponse>(
  "TransferDomainResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class UpdateDomainContactResponse extends S.Class<UpdateDomainContactResponse>(
  "UpdateDomainContactResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class ViewBillingResponse extends S.Class<ViewBillingResponse>(
  "ViewBillingResponse",
)(
  {
    NextPageMarker: S.optional(S.String),
    BillingRecords: S.optional(BillingRecords),
  },
  ns,
) {}
export class PriceWithCurrency extends S.Class<PriceWithCurrency>(
  "PriceWithCurrency",
)({ Price: S.Number, Currency: S.String }) {}
export class DomainSummary extends S.Class<DomainSummary>("DomainSummary")({
  DomainName: S.optional(S.String),
  AutoRenew: S.optional(S.Boolean),
  TransferLock: S.optional(S.Boolean),
  Expiry: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DomainSummaryList = S.Array(DomainSummary);
export class DomainPrice extends S.Class<DomainPrice>("DomainPrice")({
  Name: S.optional(S.String),
  RegistrationPrice: S.optional(PriceWithCurrency),
  TransferPrice: S.optional(PriceWithCurrency),
  RenewalPrice: S.optional(PriceWithCurrency),
  ChangeOwnershipPrice: S.optional(PriceWithCurrency),
  RestorationPrice: S.optional(PriceWithCurrency),
}) {}
export const DomainPriceList = S.Array(DomainPrice);
export class ListDomainsResponse extends S.Class<ListDomainsResponse>(
  "ListDomainsResponse",
)(
  {
    Domains: S.optional(DomainSummaryList),
    NextPageMarker: S.optional(S.String),
  },
  ns,
) {}
export class ListPricesResponse extends S.Class<ListPricesResponse>(
  "ListPricesResponse",
)(
  { Prices: S.optional(DomainPriceList), NextPageMarker: S.optional(S.String) },
  ns,
) {}
export class RegisterDomainResponse extends S.Class<RegisterDomainResponse>(
  "RegisterDomainResponse",
)({ OperationId: S.optional(S.String) }, ns) {}

//# Errors
export class InvalidInput extends S.TaggedError<InvalidInput>()(
  "InvalidInput",
  { message: S.optional(S.String) },
) {}
export class DomainLimitExceeded extends S.TaggedError<DomainLimitExceeded>()(
  "DomainLimitExceeded",
  { message: S.optional(S.String) },
) {}
export class DuplicateRequest extends S.TaggedError<DuplicateRequest>()(
  "DuplicateRequest",
  { requestId: S.optional(S.String), message: S.optional(S.String) },
) {}
export class OperationLimitExceeded extends S.TaggedError<OperationLimitExceeded>()(
  "OperationLimitExceeded",
  { message: S.optional(S.String) },
) {}
export class UnsupportedTLD extends S.TaggedError<UnsupportedTLD>()(
  "UnsupportedTLD",
  { message: S.optional(S.String) },
) {}
export class TLDRulesViolation extends S.TaggedError<TLDRulesViolation>()(
  "TLDRulesViolation",
  { message: S.optional(S.String) },
) {}
export class DnssecLimitExceeded extends S.TaggedError<DnssecLimitExceeded>()(
  "DnssecLimitExceeded",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * This operation returns the current status of an operation that is not
 * completed.
 */
export const getOperationDetail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOperationDetailRequest,
  output: GetOperationDetailResponse,
  errors: [InvalidInput],
}));
/**
 * Resend the form of authorization email for this operation.
 */
export const resendOperationAuthorization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ResendOperationAuthorizationRequest,
    output: ResendOperationAuthorizationResponse,
    errors: [InvalidInput],
  }));
/**
 * Returns information about all of the operations that return an operation ID and that
 * have ever been performed on domains that were registered by the current account.
 *
 * This command runs only in the us-east-1 Region.
 */
export const listOperations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOperationsRequest,
  output: ListOperationsResponse,
  errors: [InvalidInput],
}));
/**
 * This operation returns the authorization code for the domain. To transfer a domain to
 * another registrar, you provide this value to the new registrar.
 */
export const retrieveDomainAuthCode = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RetrieveDomainAuthCodeRequest,
    output: RetrieveDomainAuthCodeResponse,
    errors: [InvalidInput, UnsupportedTLD],
  }),
);
/**
 * Returns all the domain-related billing records for the current Amazon Web Services account for a specified period
 */
export const viewBilling = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ViewBillingRequest,
  output: ViewBillingResponse,
  errors: [InvalidInput],
}));
/**
 * Transfers a domain from the current Amazon Web Services account to another Amazon Web Services account. Note the following:
 *
 * - The Amazon Web Services account that you're transferring the domain to must
 * accept the transfer. If the other account doesn't accept the transfer within 3
 * days, we cancel the transfer. See AcceptDomainTransferFromAnotherAwsAccount.
 *
 * - You can cancel the transfer before the other account accepts it. See CancelDomainTransferToAnotherAwsAccount.
 *
 * - The other account can reject the transfer. See RejectDomainTransferFromAnotherAwsAccount.
 *
 * When you transfer a domain from one Amazon Web Services account to another, Route
 * 53 doesn't transfer the hosted zone that is associated with the domain. DNS
 * resolution isn't affected if the domain and the hosted zone are owned by separate
 * accounts, so transferring the hosted zone is optional. For information about
 * transferring the hosted zone to another Amazon Web Services account, see Migrating a
 * Hosted Zone to a Different Amazon Web Services Account in the
 * *Amazon Route 53 Developer Guide*.
 *
 * Use either ListOperations or GetOperationDetail to determine whether the operation succeeded. GetOperationDetail provides additional information, for example,
 * `Domain Transfer from Aws Account 111122223333 has been cancelled`.
 */
export const transferDomainToAnotherAwsAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: TransferDomainToAnotherAwsAccountRequest,
    output: TransferDomainToAnotherAwsAccountResponse,
    errors: [
      DuplicateRequest,
      InvalidInput,
      OperationLimitExceeded,
      UnsupportedTLD,
    ],
  }));
/**
 * This operation configures Amazon Route 53 to automatically renew the specified domain
 * before the domain registration expires. The cost of renewing your domain registration is
 * billed to your Amazon Web Services account.
 *
 * The period during which you can renew a domain name varies by TLD. For a list of TLDs
 * and their renewal policies, see Domains That You Can
 * Register with Amazon Route 53 in the Amazon Route 53 Developer
 * Guide. Route 53 requires that you renew before the end of the renewal
 * period so we can complete processing before the deadline.
 */
export const enableDomainAutoRenew = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: EnableDomainAutoRenewRequest,
    output: EnableDomainAutoRenewResponse,
    errors: [InvalidInput, TLDRulesViolation, UnsupportedTLD],
  }),
);
/**
 * For operations that require confirmation that the email address for the registrant
 * contact is valid, such as registering a new domain, this operation returns information
 * about whether the registrant contact has responded.
 *
 * If you want us to resend the email, use the
 * `ResendContactReachabilityEmail` operation.
 */
export const getContactReachabilityStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetContactReachabilityStatusRequest,
    output: GetContactReachabilityStatusResponse,
    errors: [InvalidInput, OperationLimitExceeded, UnsupportedTLD],
  }));
/**
 * This operation returns all of the tags that are associated with the specified
 * domain.
 *
 * All tag operations are eventually consistent; subsequent operations might not
 * immediately represent all issued operations.
 */
export const listTagsForDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForDomainRequest,
  output: ListTagsForDomainResponse,
  errors: [InvalidInput, OperationLimitExceeded, UnsupportedTLD],
}));
/**
 * Rejects the transfer of a domain from another Amazon Web Services account to the
 * current Amazon Web Services account. You initiate a transfer betweenAmazon Web Services accounts using TransferDomainToAnotherAwsAccount.
 *
 * Use either ListOperations or GetOperationDetail to determine whether the operation succeeded. GetOperationDetail provides additional information, for example,
 * `Domain Transfer from Aws Account 111122223333 has been cancelled`.
 */
export const rejectDomainTransferFromAnotherAwsAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RejectDomainTransferFromAnotherAwsAccountRequest,
    output: RejectDomainTransferFromAnotherAwsAccountResponse,
    errors: [InvalidInput, OperationLimitExceeded, UnsupportedTLD],
  }));
/**
 * For operations that require confirmation that the email address for the registrant
 * contact is valid, such as registering a new domain, this operation resends the
 * confirmation email to the current email address for the registrant contact.
 */
export const resendContactReachabilityEmail =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ResendContactReachabilityEmailRequest,
    output: ResendContactReachabilityEmailResponse,
    errors: [InvalidInput, OperationLimitExceeded, UnsupportedTLD],
  }));
/**
 * This operation adds or updates tags for a specified domain.
 *
 * All tag operations are eventually consistent; subsequent operations might not
 * immediately represent all issued operations.
 */
export const updateTagsForDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTagsForDomainRequest,
  output: UpdateTagsForDomainResponse,
  errors: [InvalidInput, OperationLimitExceeded, UnsupportedTLD],
}));
/**
 * Moves a domain from Amazon Web Services to another registrar.
 *
 * Supported actions:
 *
 * - Changes the IPS tags of a .uk domain, and pushes it to transit. Transit means
 * that the domain is ready to be transferred to another registrar.
 */
export const pushDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PushDomainRequest,
  output: PushDomainResponse,
  errors: [InvalidInput, OperationLimitExceeded, UnsupportedTLD],
}));
/**
 * Cancels the transfer of a domain from the current Amazon Web Services account to
 * another Amazon Web Services account. You initiate a transfer betweenAmazon Web Services accounts using TransferDomainToAnotherAwsAccount.
 *
 * You must cancel the transfer before the other Amazon Web Services account accepts
 * the transfer using AcceptDomainTransferFromAnotherAwsAccount.
 *
 * Use either ListOperations or GetOperationDetail to determine whether the operation succeeded. GetOperationDetail provides additional information, for example,
 * `Domain Transfer from Aws Account 111122223333 has been cancelled`.
 */
export const cancelDomainTransferToAnotherAwsAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelDomainTransferToAnotherAwsAccountRequest,
    output: CancelDomainTransferToAnotherAwsAccountResponse,
    errors: [InvalidInput, OperationLimitExceeded, UnsupportedTLD],
  }));
/**
 * Accepts the transfer of a domain from another Amazon Web Services account to the
 * currentAmazon Web Services account. You initiate a transfer between Amazon Web Services accounts using TransferDomainToAnotherAwsAccount.
 *
 * If you use the CLI command at accept-domain-transfer-from-another-aws-account, use JSON format as input
 * instead of text because otherwise CLI will throw an error from domain
 * transfer input that includes single quotes.
 *
 * Use either ListOperations or GetOperationDetail to determine whether the operation succeeded. GetOperationDetail provides additional information, for example,
 * `Domain Transfer from Aws Account 111122223333 has been cancelled`.
 */
export const acceptDomainTransferFromAnotherAwsAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AcceptDomainTransferFromAnotherAwsAccountRequest,
    output: AcceptDomainTransferFromAnotherAwsAccountResponse,
    errors: [
      DomainLimitExceeded,
      InvalidInput,
      OperationLimitExceeded,
      UnsupportedTLD,
    ],
  }));
/**
 * This operation disables automatic renewal of domain registration for the specified
 * domain.
 */
export const disableDomainAutoRenew = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisableDomainAutoRenewRequest,
    output: DisableDomainAutoRenewResponse,
    errors: [InvalidInput, UnsupportedTLD],
  }),
);
/**
 * This operation checks the availability of one domain name. Note that if the
 * availability status of a domain is pending, you must submit another request to determine
 * the availability of the domain name.
 */
export const checkDomainAvailability = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CheckDomainAvailabilityRequest,
    output: CheckDomainAvailabilityResponse,
    errors: [InvalidInput, UnsupportedTLD],
  }),
);
/**
 * Checks whether a domain name can be transferred to Amazon Route 53.
 */
export const checkDomainTransferability = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CheckDomainTransferabilityRequest,
    output: CheckDomainTransferabilityResponse,
    errors: [InvalidInput, UnsupportedTLD],
  }),
);
/**
 * This operation deletes the specified tags for a domain.
 *
 * All tag operations are eventually consistent; subsequent operations might not
 * immediately represent all issued operations.
 */
export const deleteTagsForDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsForDomainRequest,
  output: DeleteTagsForDomainResponse,
  errors: [InvalidInput, OperationLimitExceeded, UnsupportedTLD],
}));
/**
 * This operation returns detailed information about a specified domain that is
 * associated with the current Amazon Web Services account. Contact information for the
 * domain is also returned as part of the output.
 */
export const getDomainDetail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainDetailRequest,
  output: GetDomainDetailResponse,
  errors: [InvalidInput, UnsupportedTLD],
}));
/**
 * The GetDomainSuggestions operation returns a list of suggested domain names.
 */
export const getDomainSuggestions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDomainSuggestionsRequest,
    output: GetDomainSuggestionsResponse,
    errors: [InvalidInput, UnsupportedTLD],
  }),
);
/**
 * This operation deletes the specified domain. This action is permanent. For more
 * information, see Deleting a domain name
 * registration.
 *
 * To transfer the domain registration to another registrar, use the transfer process
 * that’s provided by the registrar to which you want to transfer the registration.
 * Otherwise, the following apply:
 *
 * - You can’t get a refund for the cost of a deleted domain registration.
 *
 * - The registry for the top-level domain might hold the domain name for a brief
 * time before releasing it for other users to register (varies by registry).
 *
 * - When the registration has been deleted, we'll send you a confirmation to the
 * registrant contact. The email will come from
 * `noreply@domainnameverification.net` or
 * `noreply@registrar.amazon.com`.
 */
export const deleteDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResponse,
  errors: [DuplicateRequest, InvalidInput, TLDRulesViolation, UnsupportedTLD],
}));
/**
 * Transfers a domain from another registrar to Amazon Route 53.
 *
 * For more information about transferring domains, see the following topics:
 *
 * - For transfer requirements, a detailed procedure, and information about viewing
 * the status of a domain that you're transferring to Route 53, see Transferring Registration for a Domain to Amazon Route 53 in the
 * *Amazon Route 53 Developer Guide*.
 *
 * - For information about how to transfer a domain from one Amazon Web Services account to another, see TransferDomainToAnotherAwsAccount.
 *
 * - For information about how to transfer a domain to another domain registrar,
 * see Transferring a Domain from Amazon Route 53 to Another Registrar in
 * the *Amazon Route 53 Developer Guide*.
 *
 * During the transfer of any country code top-level domains (ccTLDs) to Route 53, except for .cc and .tv,
 * updates to the owner contact are ignored and the owner contact data from the registry is used.
 * You can
 * update the owner contact after the transfer is complete. For more information, see
 * UpdateDomainContact.
 *
 * If the registrar for your domain is also the DNS service provider for the domain, we
 * highly recommend that you transfer your DNS service to Route 53 or to another DNS
 * service provider before you transfer your registration. Some registrars provide free DNS
 * service when you purchase a domain registration. When you transfer the registration, the
 * previous registrar will not renew your domain registration and could end your DNS
 * service at any time.
 *
 * If the registrar for your domain is also the DNS service provider for the domain
 * and you don't transfer DNS service to another provider, your website, email, and the
 * web applications associated with the domain might become unavailable.
 *
 * If the transfer is successful, this method returns an operation ID that you can use to
 * track the progress and completion of the action. If the transfer doesn't complete
 * successfully, the domain registrant will be notified by email.
 */
export const transferDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TransferDomainRequest,
  output: TransferDomainResponse,
  errors: [
    DomainLimitExceeded,
    DuplicateRequest,
    InvalidInput,
    OperationLimitExceeded,
    TLDRulesViolation,
    UnsupportedTLD,
  ],
}));
/**
 * This operation updates the contact information for a particular domain. You must
 * specify information for at least one contact: registrant, administrator, or
 * technical.
 *
 * If the update is successful, this method returns an operation ID that you can use to
 * track the progress and completion of the operation. If the request is not completed
 * successfully, the domain registrant will be notified by email.
 */
export const updateDomainContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainContactRequest,
  output: UpdateDomainContactResponse,
  errors: [
    DuplicateRequest,
    InvalidInput,
    OperationLimitExceeded,
    TLDRulesViolation,
    UnsupportedTLD,
  ],
}));
/**
 * This operation removes the transfer lock on the domain (specifically the
 * `clientTransferProhibited` status) to allow domain transfers. We
 * recommend you refrain from performing this action unless you intend to transfer the
 * domain to a different registrar. Successful submission returns an operation ID that you
 * can use to track the progress and completion of the action. If the request is not
 * completed successfully, the domain registrant will be notified by email.
 */
export const disableDomainTransferLock = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisableDomainTransferLockRequest,
    output: DisableDomainTransferLockResponse,
    errors: [
      DuplicateRequest,
      InvalidInput,
      OperationLimitExceeded,
      TLDRulesViolation,
      UnsupportedTLD,
    ],
  }),
);
/**
 * Deletes a delegation signer (DS) record in the registry zone for this domain
 * name.
 */
export const disassociateDelegationSignerFromDomain =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateDelegationSignerFromDomainRequest,
    output: DisassociateDelegationSignerFromDomainResponse,
    errors: [
      DuplicateRequest,
      InvalidInput,
      OperationLimitExceeded,
      TLDRulesViolation,
      UnsupportedTLD,
    ],
  }));
/**
 * This operation sets the transfer lock on the domain (specifically the
 * `clientTransferProhibited` status) to prevent domain transfers.
 * Successful submission returns an operation ID that you can use to track the progress and
 * completion of the action. If the request is not completed successfully, the domain
 * registrant will be notified by email.
 */
export const enableDomainTransferLock = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: EnableDomainTransferLockRequest,
    output: EnableDomainTransferLockResponse,
    errors: [
      DuplicateRequest,
      InvalidInput,
      OperationLimitExceeded,
      TLDRulesViolation,
      UnsupportedTLD,
    ],
  }),
);
/**
 * This operation renews a domain for the specified number of years. The cost of renewing
 * your domain is billed to your Amazon Web Services account.
 *
 * We recommend that you renew your domain several weeks before the expiration date. Some
 * TLD registries delete domains before the expiration date if you haven't renewed far
 * enough in advance. For more information about renewing domain registration, see Renewing
 * Registration for a Domain in the Amazon Route 53 Developer
 * Guide.
 */
export const renewDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RenewDomainRequest,
  output: RenewDomainResponse,
  errors: [
    DuplicateRequest,
    InvalidInput,
    OperationLimitExceeded,
    TLDRulesViolation,
    UnsupportedTLD,
  ],
}));
/**
 * This operation updates the specified domain contact's privacy setting. When privacy
 * protection is enabled, your contact information is replaced with contact information for
 * the registrar or with the phrase "REDACTED FOR PRIVACY", or "On behalf of owner."
 *
 * While some domains may allow different privacy settings per contact, we recommend
 * specifying the same privacy setting for all contacts.
 *
 * This operation affects only the contact information for the specified contact type
 * (administrative, registrant, or technical). If the request succeeds, Amazon Route 53
 * returns an operation ID that you can use with GetOperationDetail to track the progress and completion of the action. If
 * the request doesn't complete successfully, the domain registrant will be notified by
 * email.
 *
 * By disabling the privacy service via API, you consent to the publication of the
 * contact information provided for this domain via the public WHOIS database. You
 * certify that you are the registrant of this domain name and have the authority to
 * make this decision. You may withdraw your consent at any time by enabling privacy
 * protection using either `UpdateDomainContactPrivacy` or the Route 53
 * console. Enabling privacy protection removes the contact information provided for
 * this domain from the WHOIS database. For more information on our privacy practices,
 * see https://aws.amazon.com/privacy/.
 */
export const updateDomainContactPrivacy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDomainContactPrivacyRequest,
    output: UpdateDomainContactPrivacyResponse,
    errors: [
      DuplicateRequest,
      InvalidInput,
      OperationLimitExceeded,
      TLDRulesViolation,
      UnsupportedTLD,
    ],
  }),
);
/**
 * This operation replaces the current set of name servers for the domain with the
 * specified set of name servers. If you use Amazon Route 53 as your DNS service, specify
 * the four name servers in the delegation set for the hosted zone for the domain.
 *
 * If successful, this operation returns an operation ID that you can use to track the
 * progress and completion of the action. If the request is not completed successfully, the
 * domain registrant will be notified by email.
 */
export const updateDomainNameservers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDomainNameserversRequest,
    output: UpdateDomainNameserversResponse,
    errors: [
      DuplicateRequest,
      InvalidInput,
      OperationLimitExceeded,
      TLDRulesViolation,
      UnsupportedTLD,
    ],
  }),
);
/**
 * Creates a delegation signer (DS) record in the registry zone for this domain
 * name.
 *
 * Note that creating DS record at the registry impacts DNSSEC validation of your DNS
 * records. This action may render your domain name unavailable on the internet if the
 * steps are completed in the wrong order, or with incorrect timing. For more information
 * about DNSSEC signing, see Configuring DNSSEC
 * signing in the Route 53 developer
 * guide.
 */
export const associateDelegationSignerToDomain =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateDelegationSignerToDomainRequest,
    output: AssociateDelegationSignerToDomainResponse,
    errors: [
      DnssecLimitExceeded,
      DuplicateRequest,
      InvalidInput,
      OperationLimitExceeded,
      TLDRulesViolation,
      UnsupportedTLD,
    ],
  }));
/**
 * This operation returns all the domain names registered with Amazon Route 53 for the
 * current Amazon Web Services account if no filtering conditions are used.
 */
export const listDomains = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDomainsRequest,
  output: ListDomainsResponse,
  errors: [InvalidInput],
}));
/**
 * Lists the following prices for either all the TLDs supported by Route 53, or
 * the specified TLD:
 *
 * - Registration
 *
 * - Transfer
 *
 * - Owner change
 *
 * - Domain renewal
 *
 * - Domain restoration
 */
export const listPrices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPricesRequest,
  output: ListPricesResponse,
  errors: [InvalidInput, UnsupportedTLD],
}));
/**
 * This operation registers a domain. For some top-level domains (TLDs), this operation
 * requires extra parameters.
 *
 * When you register a domain, Amazon Route 53 does the following:
 *
 * - Creates a Route 53 hosted zone that has the same name as the domain. Route 53
 * assigns four name servers to your hosted zone and automatically updates your
 * domain registration with the names of these name servers.
 *
 * - Enables auto renew, so your domain registration will renew automatically each
 * year. We'll notify you in advance of the renewal date so you can choose whether
 * to renew the registration.
 *
 * - Optionally enables privacy protection, so WHOIS queries return contact for the registrar
 * or the phrase "REDACTED FOR PRIVACY", or "On behalf of owner."
 * If you don't enable privacy protection, WHOIS queries return the information
 * that you entered for the administrative, registrant, and technical
 * contacts.
 *
 * While some domains may allow different privacy settings per contact, we recommend
 * specifying the same privacy setting for all contacts.
 *
 * - If registration is successful, returns an operation ID that you can use to
 * track the progress and completion of the action. If the request is not completed
 * successfully, the domain registrant is notified by email.
 *
 * - Charges your Amazon Web Services account an amount based on the top-level
 * domain. For more information, see Amazon Route 53 Pricing.
 */
export const registerDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterDomainRequest,
  output: RegisterDomainResponse,
  errors: [
    DomainLimitExceeded,
    DuplicateRequest,
    InvalidInput,
    OperationLimitExceeded,
    TLDRulesViolation,
    UnsupportedTLD,
  ],
}));
