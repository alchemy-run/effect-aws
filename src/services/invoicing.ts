import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Invoicing",
  serviceShapeName: "Invoicing",
});
const auth = T.AwsAuthSigv4({ name: "invoicing" });
const ver = T.ServiceVersion("2024-12-01");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
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
                  ],
                  endpoint: {
                    url: "https://invoicing-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
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
                {
                  conditions: [],
                  endpoint: {
                    url: "https://invoicing.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
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
export const AccountIdList = S.Array(S.String);
export const ResourceTagKeyList = S.Array(S.String);
export class BatchGetInvoiceProfileRequest extends S.Class<BatchGetInvoiceProfileRequest>(
  "BatchGetInvoiceProfileRequest",
)(
  { AccountIds: AccountIdList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteInvoiceUnitRequest extends S.Class<DeleteInvoiceUnitRequest>(
  "DeleteInvoiceUnitRequest",
)(
  { InvoiceUnitArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProcurementPortalPreferenceRequest extends S.Class<DeleteProcurementPortalPreferenceRequest>(
  "DeleteProcurementPortalPreferenceRequest",
)(
  { ProcurementPortalPreferenceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetInvoicePDFRequest extends S.Class<GetInvoicePDFRequest>(
  "GetInvoicePDFRequest",
)(
  { InvoiceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetInvoiceUnitRequest extends S.Class<GetInvoiceUnitRequest>(
  "GetInvoiceUnitRequest",
)(
  {
    InvoiceUnitArn: S.String,
    AsOf: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetProcurementPortalPreferenceRequest extends S.Class<GetProcurementPortalPreferenceRequest>(
  "GetProcurementPortalPreferenceRequest",
)(
  { ProcurementPortalPreferenceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProcurementPortalPreferencesRequest extends S.Class<ListProcurementPortalPreferencesRequest>(
  "ListProcurementPortalPreferencesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const InvoiceUnitArns = S.Array(S.String);
export const SellerOfRecords = S.Array(S.String);
export class ProcurementPortalPreferenceSelector extends S.Class<ProcurementPortalPreferenceSelector>(
  "ProcurementPortalPreferenceSelector",
)({
  InvoiceUnitArns: S.optional(InvoiceUnitArns),
  SellerOfRecords: S.optional(SellerOfRecords),
}) {}
export class TestEnvPreferenceInput extends S.Class<TestEnvPreferenceInput>(
  "TestEnvPreferenceInput",
)({
  BuyerDomain: S.String,
  BuyerIdentifier: S.String,
  SupplierDomain: S.String,
  SupplierIdentifier: S.String,
  ProcurementPortalSharedSecret: S.optional(S.String),
  ProcurementPortalInstanceEndpoint: S.optional(S.String),
}) {}
export const EinvoiceDeliveryDocumentTypes = S.Array(S.String);
export const EinvoiceDeliveryAttachmentTypes = S.Array(S.String);
export class PurchaseOrderDataSource extends S.Class<PurchaseOrderDataSource>(
  "PurchaseOrderDataSource",
)({
  EinvoiceDeliveryDocumentType: S.optional(S.String),
  PurchaseOrderDataSourceType: S.optional(S.String),
}) {}
export const PurchaseOrderDataSources = S.Array(PurchaseOrderDataSource);
export class EinvoiceDeliveryPreference extends S.Class<EinvoiceDeliveryPreference>(
  "EinvoiceDeliveryPreference",
)({
  EinvoiceDeliveryDocumentTypes: EinvoiceDeliveryDocumentTypes,
  EinvoiceDeliveryAttachmentTypes: S.optional(EinvoiceDeliveryAttachmentTypes),
  Protocol: S.String,
  PurchaseOrderDataSources: PurchaseOrderDataSources,
  ConnectionTestingMethod: S.String,
  EinvoiceDeliveryActivationDate: S.Date.pipe(
    T.TimestampFormat("epoch-seconds"),
  ),
}) {}
export class Contact extends S.Class<Contact>("Contact")({
  Name: S.optional(S.String),
  Email: S.optional(S.String),
}) {}
export const Contacts = S.Array(Contact);
export class PutProcurementPortalPreferenceRequest extends S.Class<PutProcurementPortalPreferenceRequest>(
  "PutProcurementPortalPreferenceRequest",
)(
  {
    ProcurementPortalPreferenceArn: S.String,
    Selector: S.optional(ProcurementPortalPreferenceSelector),
    ProcurementPortalSharedSecret: S.optional(S.String),
    ProcurementPortalInstanceEndpoint: S.optional(S.String),
    TestEnvPreference: S.optional(TestEnvPreferenceInput),
    EinvoiceDeliveryEnabled: S.Boolean,
    EinvoiceDeliveryPreference: S.optional(EinvoiceDeliveryPreference),
    PurchaseOrderRetrievalEnabled: S.Boolean,
    Contacts: Contacts,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  Key: S.String,
  Value: S.String,
}) {}
export const ResourceTagList = S.Array(ResourceTag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, ResourceTags: ResourceTagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, ResourceTagKeys: ResourceTagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const RuleAccountIdList = S.Array(S.String);
export class InvoiceUnitRule extends S.Class<InvoiceUnitRule>(
  "InvoiceUnitRule",
)({
  LinkedAccounts: S.optional(RuleAccountIdList),
  BillSourceAccounts: S.optional(RuleAccountIdList),
}) {}
export class UpdateInvoiceUnitRequest extends S.Class<UpdateInvoiceUnitRequest>(
  "UpdateInvoiceUnitRequest",
)(
  {
    InvoiceUnitArn: S.String,
    Description: S.optional(S.String),
    TaxInheritanceDisabled: S.optional(S.Boolean),
    Rule: S.optional(InvoiceUnitRule),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProcurementPortalPreferenceStatusRequest extends S.Class<UpdateProcurementPortalPreferenceStatusRequest>(
  "UpdateProcurementPortalPreferenceStatusRequest",
)(
  {
    ProcurementPortalPreferenceArn: S.String,
    EinvoiceDeliveryPreferenceStatus: S.optional(S.String),
    EinvoiceDeliveryPreferenceStatusReason: S.optional(S.String),
    PurchaseOrderRetrievalPreferenceStatus: S.optional(S.String),
    PurchaseOrderRetrievalPreferenceStatusReason: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const InvoiceUnitNames = S.Array(S.String);
export class InvoiceSummariesSelector extends S.Class<InvoiceSummariesSelector>(
  "InvoiceSummariesSelector",
)({ ResourceType: S.String, Value: S.String }) {}
export class Filters extends S.Class<Filters>("Filters")({
  Names: S.optional(InvoiceUnitNames),
  InvoiceReceivers: S.optional(AccountIdList),
  Accounts: S.optional(AccountIdList),
  BillSourceAccounts: S.optional(AccountIdList),
}) {}
export class CreateInvoiceUnitRequest extends S.Class<CreateInvoiceUnitRequest>(
  "CreateInvoiceUnitRequest",
)(
  {
    Name: S.String,
    InvoiceReceiver: S.String,
    Description: S.optional(S.String),
    TaxInheritanceDisabled: S.optional(S.Boolean),
    Rule: InvoiceUnitRule,
    ResourceTags: S.optional(ResourceTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteInvoiceUnitResponse extends S.Class<DeleteInvoiceUnitResponse>(
  "DeleteInvoiceUnitResponse",
)({ InvoiceUnitArn: S.optional(S.String) }) {}
export class DeleteProcurementPortalPreferenceResponse extends S.Class<DeleteProcurementPortalPreferenceResponse>(
  "DeleteProcurementPortalPreferenceResponse",
)({ ProcurementPortalPreferenceArn: S.String }) {}
export class GetInvoiceUnitResponse extends S.Class<GetInvoiceUnitResponse>(
  "GetInvoiceUnitResponse",
)({
  InvoiceUnitArn: S.optional(S.String),
  InvoiceReceiver: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  TaxInheritanceDisabled: S.optional(S.Boolean),
  Rule: S.optional(InvoiceUnitRule),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListInvoiceUnitsRequest extends S.Class<ListInvoiceUnitsRequest>(
  "ListInvoiceUnitsRequest",
)(
  {
    Filters: S.optional(Filters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    AsOf: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ ResourceTags: S.optional(ResourceTagList) }) {}
export class PutProcurementPortalPreferenceResponse extends S.Class<PutProcurementPortalPreferenceResponse>(
  "PutProcurementPortalPreferenceResponse",
)({ ProcurementPortalPreferenceArn: S.String }) {}
export class UpdateInvoiceUnitResponse extends S.Class<UpdateInvoiceUnitResponse>(
  "UpdateInvoiceUnitResponse",
)({ InvoiceUnitArn: S.optional(S.String) }) {}
export class UpdateProcurementPortalPreferenceStatusResponse extends S.Class<UpdateProcurementPortalPreferenceStatusResponse>(
  "UpdateProcurementPortalPreferenceStatusResponse",
)({ ProcurementPortalPreferenceArn: S.String }) {}
export class DateInterval extends S.Class<DateInterval>("DateInterval")({
  StartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class BillingPeriod extends S.Class<BillingPeriod>("BillingPeriod")({
  Month: S.Number,
  Year: S.Number,
}) {}
export class InvoiceSummariesFilter extends S.Class<InvoiceSummariesFilter>(
  "InvoiceSummariesFilter",
)({
  TimeInterval: S.optional(DateInterval),
  BillingPeriod: S.optional(BillingPeriod),
  InvoicingEntity: S.optional(S.String),
}) {}
export class ProcurementPortalPreferenceSummary extends S.Class<ProcurementPortalPreferenceSummary>(
  "ProcurementPortalPreferenceSummary",
)({
  AwsAccountId: S.String,
  ProcurementPortalPreferenceArn: S.String,
  ProcurementPortalName: S.String,
  BuyerDomain: S.String,
  BuyerIdentifier: S.String,
  SupplierDomain: S.String,
  SupplierIdentifier: S.String,
  Selector: S.optional(ProcurementPortalPreferenceSelector),
  EinvoiceDeliveryEnabled: S.Boolean,
  PurchaseOrderRetrievalEnabled: S.Boolean,
  EinvoiceDeliveryPreferenceStatus: S.optional(S.String),
  EinvoiceDeliveryPreferenceStatusReason: S.optional(S.String),
  PurchaseOrderRetrievalPreferenceStatus: S.optional(S.String),
  PurchaseOrderRetrievalPreferenceStatusReason: S.optional(S.String),
  Version: S.Number,
  CreateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ProcurementPortalPreferenceSummaries = S.Array(
  ProcurementPortalPreferenceSummary,
);
export class CreateInvoiceUnitResponse extends S.Class<CreateInvoiceUnitResponse>(
  "CreateInvoiceUnitResponse",
)({ InvoiceUnitArn: S.optional(S.String) }) {}
export class CreateProcurementPortalPreferenceRequest extends S.Class<CreateProcurementPortalPreferenceRequest>(
  "CreateProcurementPortalPreferenceRequest",
)(
  {
    ProcurementPortalName: S.String,
    BuyerDomain: S.String,
    BuyerIdentifier: S.String,
    SupplierDomain: S.String,
    SupplierIdentifier: S.String,
    Selector: S.optional(ProcurementPortalPreferenceSelector),
    ProcurementPortalSharedSecret: S.optional(S.String),
    ProcurementPortalInstanceEndpoint: S.optional(S.String),
    TestEnvPreference: S.optional(TestEnvPreferenceInput),
    EinvoiceDeliveryEnabled: S.Boolean,
    EinvoiceDeliveryPreference: S.optional(EinvoiceDeliveryPreference),
    PurchaseOrderRetrievalEnabled: S.Boolean,
    Contacts: Contacts,
    ResourceTags: S.optional(ResourceTagList),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInvoiceSummariesRequest extends S.Class<ListInvoiceSummariesRequest>(
  "ListInvoiceSummariesRequest",
)(
  {
    Selector: InvoiceSummariesSelector,
    Filter: S.optional(InvoiceSummariesFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProcurementPortalPreferencesResponse extends S.Class<ListProcurementPortalPreferencesResponse>(
  "ListProcurementPortalPreferencesResponse",
)({
  ProcurementPortalPreferences: S.optional(
    ProcurementPortalPreferenceSummaries,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ReceiverAddress extends S.Class<ReceiverAddress>(
  "ReceiverAddress",
)({
  AddressLine1: S.optional(S.String),
  AddressLine2: S.optional(S.String),
  AddressLine3: S.optional(S.String),
  DistrictOrCounty: S.optional(S.String),
  City: S.optional(S.String),
  StateOrRegion: S.optional(S.String),
  CountryCode: S.optional(S.String),
  CompanyName: S.optional(S.String),
  PostalCode: S.optional(S.String),
}) {}
export class SupplementalDocument extends S.Class<SupplementalDocument>(
  "SupplementalDocument",
)({
  DocumentUrl: S.optional(S.String),
  DocumentUrlExpirationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const SupplementalDocuments = S.Array(SupplementalDocument);
export class TestEnvPreference extends S.Class<TestEnvPreference>(
  "TestEnvPreference",
)({
  BuyerDomain: S.String,
  BuyerIdentifier: S.String,
  SupplierDomain: S.String,
  SupplierIdentifier: S.String,
  ProcurementPortalSharedSecret: S.optional(S.String),
  ProcurementPortalInstanceEndpoint: S.optional(S.String),
  PurchaseOrderRetrievalEndpoint: S.optional(S.String),
}) {}
export class InvoiceProfile extends S.Class<InvoiceProfile>("InvoiceProfile")({
  AccountId: S.optional(S.String),
  ReceiverName: S.optional(S.String),
  ReceiverAddress: S.optional(ReceiverAddress),
  ReceiverEmail: S.optional(S.String),
  Issuer: S.optional(S.String),
  TaxRegistrationNumber: S.optional(S.String),
}) {}
export const ProfileList = S.Array(InvoiceProfile);
export class InvoicePDF extends S.Class<InvoicePDF>("InvoicePDF")({
  InvoiceId: S.optional(S.String),
  DocumentUrl: S.optional(S.String),
  DocumentUrlExpirationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  SupplementalDocuments: S.optional(SupplementalDocuments),
}) {}
export class ProcurementPortalPreference extends S.Class<ProcurementPortalPreference>(
  "ProcurementPortalPreference",
)({
  AwsAccountId: S.String,
  ProcurementPortalPreferenceArn: S.String,
  ProcurementPortalName: S.String,
  BuyerDomain: S.String,
  BuyerIdentifier: S.String,
  SupplierDomain: S.String,
  SupplierIdentifier: S.String,
  Selector: S.optional(ProcurementPortalPreferenceSelector),
  ProcurementPortalSharedSecret: S.optional(S.String),
  ProcurementPortalInstanceEndpoint: S.optional(S.String),
  PurchaseOrderRetrievalEndpoint: S.optional(S.String),
  TestEnvPreference: S.optional(TestEnvPreference),
  EinvoiceDeliveryEnabled: S.Boolean,
  EinvoiceDeliveryPreference: S.optional(EinvoiceDeliveryPreference),
  PurchaseOrderRetrievalEnabled: S.Boolean,
  Contacts: S.optional(Contacts),
  EinvoiceDeliveryPreferenceStatus: S.optional(S.String),
  EinvoiceDeliveryPreferenceStatusReason: S.optional(S.String),
  PurchaseOrderRetrievalPreferenceStatus: S.optional(S.String),
  PurchaseOrderRetrievalPreferenceStatusReason: S.optional(S.String),
  Version: S.Number,
  CreateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class InvoiceUnit extends S.Class<InvoiceUnit>("InvoiceUnit")({
  InvoiceUnitArn: S.optional(S.String),
  InvoiceReceiver: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  TaxInheritanceDisabled: S.optional(S.Boolean),
  Rule: S.optional(InvoiceUnitRule),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const InvoiceUnits = S.Array(InvoiceUnit);
export class BatchGetInvoiceProfileResponse extends S.Class<BatchGetInvoiceProfileResponse>(
  "BatchGetInvoiceProfileResponse",
)({ Profiles: S.optional(ProfileList) }) {}
export class CreateProcurementPortalPreferenceResponse extends S.Class<CreateProcurementPortalPreferenceResponse>(
  "CreateProcurementPortalPreferenceResponse",
)({ ProcurementPortalPreferenceArn: S.String }) {}
export class GetInvoicePDFResponse extends S.Class<GetInvoicePDFResponse>(
  "GetInvoicePDFResponse",
)({ InvoicePDF: S.optional(InvoicePDF) }) {}
export class GetProcurementPortalPreferenceResponse extends S.Class<GetProcurementPortalPreferenceResponse>(
  "GetProcurementPortalPreferenceResponse",
)({ ProcurementPortalPreference: ProcurementPortalPreference }) {}
export class ListInvoiceUnitsResponse extends S.Class<ListInvoiceUnitsResponse>(
  "ListInvoiceUnitsResponse",
)({
  InvoiceUnits: S.optional(InvoiceUnits),
  NextToken: S.optional(S.String),
}) {}
export class Entity extends S.Class<Entity>("Entity")({
  InvoicingEntity: S.optional(S.String),
}) {}
export class CurrencyExchangeDetails extends S.Class<CurrencyExchangeDetails>(
  "CurrencyExchangeDetails",
)({
  SourceCurrencyCode: S.optional(S.String),
  TargetCurrencyCode: S.optional(S.String),
  Rate: S.optional(S.String),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class DiscountsBreakdownAmount extends S.Class<DiscountsBreakdownAmount>(
  "DiscountsBreakdownAmount",
)({
  Description: S.optional(S.String),
  Amount: S.optional(S.String),
  Rate: S.optional(S.String),
}) {}
export const DiscountsBreakdownAmountList = S.Array(DiscountsBreakdownAmount);
export class TaxesBreakdownAmount extends S.Class<TaxesBreakdownAmount>(
  "TaxesBreakdownAmount",
)({
  Description: S.optional(S.String),
  Amount: S.optional(S.String),
  Rate: S.optional(S.String),
}) {}
export const TaxesBreakdownAmountList = S.Array(TaxesBreakdownAmount);
export class FeesBreakdownAmount extends S.Class<FeesBreakdownAmount>(
  "FeesBreakdownAmount",
)({
  Description: S.optional(S.String),
  Amount: S.optional(S.String),
  Rate: S.optional(S.String),
}) {}
export const FeesBreakdownAmountList = S.Array(FeesBreakdownAmount);
export class DiscountsBreakdown extends S.Class<DiscountsBreakdown>(
  "DiscountsBreakdown",
)({
  Breakdown: S.optional(DiscountsBreakdownAmountList),
  TotalAmount: S.optional(S.String),
}) {}
export class TaxesBreakdown extends S.Class<TaxesBreakdown>("TaxesBreakdown")({
  Breakdown: S.optional(TaxesBreakdownAmountList),
  TotalAmount: S.optional(S.String),
}) {}
export class FeesBreakdown extends S.Class<FeesBreakdown>("FeesBreakdown")({
  Breakdown: S.optional(FeesBreakdownAmountList),
  TotalAmount: S.optional(S.String),
}) {}
export class AmountBreakdown extends S.Class<AmountBreakdown>(
  "AmountBreakdown",
)({
  SubTotalAmount: S.optional(S.String),
  Discounts: S.optional(DiscountsBreakdown),
  Taxes: S.optional(TaxesBreakdown),
  Fees: S.optional(FeesBreakdown),
}) {}
export class InvoiceCurrencyAmount extends S.Class<InvoiceCurrencyAmount>(
  "InvoiceCurrencyAmount",
)({
  TotalAmount: S.optional(S.String),
  TotalAmountBeforeTax: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
  AmountBreakdown: S.optional(AmountBreakdown),
  CurrencyExchangeDetails: S.optional(CurrencyExchangeDetails),
}) {}
export class InvoiceSummary extends S.Class<InvoiceSummary>("InvoiceSummary")({
  AccountId: S.optional(S.String),
  InvoiceId: S.optional(S.String),
  IssuedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DueDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Entity: S.optional(Entity),
  BillingPeriod: S.optional(BillingPeriod),
  InvoiceType: S.optional(S.String),
  OriginalInvoiceId: S.optional(S.String),
  PurchaseOrderNumber: S.optional(S.String),
  BaseCurrencyAmount: S.optional(InvoiceCurrencyAmount),
  TaxCurrencyAmount: S.optional(InvoiceCurrencyAmount),
  PaymentCurrencyAmount: S.optional(InvoiceCurrencyAmount),
}) {}
export const InvoiceSummaries = S.Array(InvoiceSummary);
export class ListInvoiceSummariesResponse extends S.Class<ListInvoiceSummariesResponse>(
  "ListInvoiceSummariesResponse",
)({ InvoiceSummaries: InvoiceSummaries, NextToken: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
  T.AwsQueryError({ code: "InvoicingAccessDenied", httpResponseCode: 403 }),
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
  T.AwsQueryError({ code: "InvoicingInternalServer", httpResponseCode: 500 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
  T.AwsQueryError({ code: "InvoicingConflict", httpResponseCode: 409 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
  T.AwsQueryError({ code: "InvoicingResourceNotFound", httpResponseCode: 404 }),
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvoicingThrottling", httpResponseCode: 429 }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvoicingServiceQuotaExceeded",
    httpResponseCode: 402,
  }),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    resourceName: S.optional(S.String),
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
  T.AwsQueryError({ code: "InvoicingValidation", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * This creates a new invoice unit with the provided definition.
 */
export const createInvoiceUnit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInvoiceUnitRequest,
  output: CreateInvoiceUnitResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * You can update the invoice unit configuration at any time, and Amazon Web Services will use the latest configuration at the end of the month.
 */
export const updateInvoiceUnit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInvoiceUnitRequest,
  output: UpdateInvoiceUnitResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This deletes an invoice unit with the provided invoice unit ARN.
 */
export const deleteInvoiceUnit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInvoiceUnitRequest,
  output: DeleteInvoiceUnitResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This retrieves the invoice unit definition.
 */
export const getInvoiceUnit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvoiceUnitRequest,
  output: GetInvoiceUnitResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This gets the invoice profile associated with a set of accounts. The accounts must be linked accounts under the requester management account organization.
 */
export const batchGetInvoiceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetInvoiceProfileRequest,
    output: BatchGetInvoiceProfileResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a URL to download the invoice document and supplemental documents associated with an invoice. The URLs are pre-signed and have expiration time. For special cases like Brazil, where Amazon Web Services generated invoice identifiers and government provided identifiers do not match, use the Amazon Web Services generated invoice identifier when making API requests. To grant IAM permission to use this operation, the caller needs the `invoicing:GetInvoicePDF` policy action.
 */
export const getInvoicePDF = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvoicePDFRequest,
  output: GetInvoicePDFResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of procurement portal preferences associated with the Amazon Web Services account.
 */
export const listProcurementPortalPreferences =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProcurementPortalPreferencesRequest,
    output: ListProcurementPortalPreferencesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ProcurementPortalPreferences",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This fetches a list of all invoice unit definitions for a given account, as of the provided `AsOf` date.
 */
export const listInvoiceUnits = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInvoiceUnitsRequest,
    output: ListInvoiceUnitsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "InvoiceUnits",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates a procurement portal preference configuration for e-invoice delivery and purchase order retrieval. This preference defines how invoices are delivered to a procurement portal and how purchase orders are retrieved.
 */
export const createProcurementPortalPreference =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateProcurementPortalPreferenceRequest,
    output: CreateProcurementPortalPreferenceResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Adds a tag to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the status of a procurement portal preference, including the activation state of e-invoice delivery and purchase order retrieval features.
 */
export const updateProcurementPortalPreferenceStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateProcurementPortalPreferenceStatusRequest,
    output: UpdateProcurementPortalPreferenceStatusResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes an existing procurement portal preference. This action cannot be undone. Active e-invoice delivery and PO retrieval configurations will be terminated.
 */
export const deleteProcurementPortalPreference =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteProcurementPortalPreferenceRequest,
    output: DeleteProcurementPortalPreferenceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates an existing procurement portal preference configuration. This operation can modify settings for e-invoice delivery and purchase order retrieval.
 */
export const putProcurementPortalPreference =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutProcurementPortalPreferenceRequest,
    output: PutProcurementPortalPreferenceResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the details of a specific procurement portal preference configuration.
 */
export const getProcurementPortalPreference =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetProcurementPortalPreferenceRequest,
    output: GetProcurementPortalPreferenceResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves your invoice details programmatically, without line item details.
 */
export const listInvoiceSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListInvoiceSummariesRequest,
    output: ListInvoiceSummariesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "InvoiceSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
