import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Invoicing",
  serviceShapeName: "Invoicing",
});
const auth = T.AwsAuthSigv4({ name: "invoicing" });
const ver = T.ServiceVersion("2024-12-01");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { UseFIPS = false, Endpoint, Region } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true) {
          return e(
            `https://invoicing-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            _p0(PartitionResult),
            {},
          );
        }
        return e(
          `https://invoicing.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          _p0(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AccountIdString = string;
export type InvoiceUnitName = string;
export type DescriptionString = string;
export type TaxInheritanceDisabledFlag = boolean;
export type BasicStringWithoutSpace = string;
export type SensitiveBasicStringWithoutSpace =
  | string
  | redacted.Redacted<string>;
export type InvoiceUnitArnString = string;
export type ProcurementPortalPreferenceArnString = string;
export type StringWithoutNewLine = string;
export type AsOfTimestamp = Date;
export type NextTokenString = string;
export type InvoiceSummariesMaxResults = number;
export type MaxResultsInteger = number;
export type MaxResults = number;
export type TagrisArn = string;
export type ResourceTagKey = string;
export type BasicString = string;
export type ResourceTagValue = string;
export type EmailString = string;
export type LastModifiedTimestamp = Date;
export type Month = number;
export type Year = number;
export type CurrencyCode = string;

//# Schemas
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String);
export type ProcurementPortalName = "SAP_BUSINESS_NETWORK" | "COUPA";
export const ProcurementPortalName = S.Literal("SAP_BUSINESS_NETWORK", "COUPA");
export type BuyerDomain = "NetworkID";
export const BuyerDomain = S.Literal("NetworkID");
export type SupplierDomain = "NetworkID";
export const SupplierDomain = S.Literal("NetworkID");
export type ResourceTagKeyList = string[];
export const ResourceTagKeyList = S.Array(S.String);
export type ProcurementPortalPreferenceStatus =
  | "PENDING_VERIFICATION"
  | "TEST_INITIALIZED"
  | "TEST_INITIALIZATION_FAILED"
  | "TEST_FAILED"
  | "ACTIVE"
  | "SUSPENDED";
export const ProcurementPortalPreferenceStatus = S.Literal(
  "PENDING_VERIFICATION",
  "TEST_INITIALIZED",
  "TEST_INITIALIZATION_FAILED",
  "TEST_FAILED",
  "ACTIVE",
  "SUSPENDED",
);
export interface BatchGetInvoiceProfileRequest {
  AccountIds: string[];
}
export const BatchGetInvoiceProfileRequest = S.suspend(() =>
  S.Struct({ AccountIds: AccountIdList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetInvoiceProfileRequest",
}) as any as S.Schema<BatchGetInvoiceProfileRequest>;
export interface DeleteInvoiceUnitRequest {
  InvoiceUnitArn: string;
}
export const DeleteInvoiceUnitRequest = S.suspend(() =>
  S.Struct({ InvoiceUnitArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteInvoiceUnitRequest",
}) as any as S.Schema<DeleteInvoiceUnitRequest>;
export interface DeleteProcurementPortalPreferenceRequest {
  ProcurementPortalPreferenceArn: string;
}
export const DeleteProcurementPortalPreferenceRequest = S.suspend(() =>
  S.Struct({ ProcurementPortalPreferenceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProcurementPortalPreferenceRequest",
}) as any as S.Schema<DeleteProcurementPortalPreferenceRequest>;
export interface GetInvoicePDFRequest {
  InvoiceId: string;
}
export const GetInvoicePDFRequest = S.suspend(() =>
  S.Struct({ InvoiceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetInvoicePDFRequest",
}) as any as S.Schema<GetInvoicePDFRequest>;
export interface GetInvoiceUnitRequest {
  InvoiceUnitArn: string;
  AsOf?: Date;
}
export const GetInvoiceUnitRequest = S.suspend(() =>
  S.Struct({
    InvoiceUnitArn: S.String,
    AsOf: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetInvoiceUnitRequest",
}) as any as S.Schema<GetInvoiceUnitRequest>;
export interface GetProcurementPortalPreferenceRequest {
  ProcurementPortalPreferenceArn: string;
}
export const GetProcurementPortalPreferenceRequest = S.suspend(() =>
  S.Struct({ ProcurementPortalPreferenceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetProcurementPortalPreferenceRequest",
}) as any as S.Schema<GetProcurementPortalPreferenceRequest>;
export interface ListProcurementPortalPreferencesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListProcurementPortalPreferencesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProcurementPortalPreferencesRequest",
}) as any as S.Schema<ListProcurementPortalPreferencesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export type InvoiceUnitArns = string[];
export const InvoiceUnitArns = S.Array(S.String);
export type SellerOfRecords = string[];
export const SellerOfRecords = S.Array(S.String);
export interface ProcurementPortalPreferenceSelector {
  InvoiceUnitArns?: string[];
  SellerOfRecords?: string[];
}
export const ProcurementPortalPreferenceSelector = S.suspend(() =>
  S.Struct({
    InvoiceUnitArns: S.optional(InvoiceUnitArns),
    SellerOfRecords: S.optional(SellerOfRecords),
  }),
).annotations({
  identifier: "ProcurementPortalPreferenceSelector",
}) as any as S.Schema<ProcurementPortalPreferenceSelector>;
export interface TestEnvPreferenceInput {
  BuyerDomain: BuyerDomain;
  BuyerIdentifier: string;
  SupplierDomain: SupplierDomain;
  SupplierIdentifier: string;
  ProcurementPortalSharedSecret?: string;
  ProcurementPortalInstanceEndpoint?: string;
}
export const TestEnvPreferenceInput = S.suspend(() =>
  S.Struct({
    BuyerDomain: BuyerDomain,
    BuyerIdentifier: S.String,
    SupplierDomain: SupplierDomain,
    SupplierIdentifier: S.String,
    ProcurementPortalSharedSecret: S.optional(S.String),
    ProcurementPortalInstanceEndpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "TestEnvPreferenceInput",
}) as any as S.Schema<TestEnvPreferenceInput>;
export type EinvoiceDeliveryDocumentType =
  | "AWS_CLOUD_INVOICE"
  | "AWS_CLOUD_CREDIT_MEMO"
  | "AWS_MARKETPLACE_INVOICE"
  | "AWS_MARKETPLACE_CREDIT_MEMO"
  | "AWS_REQUEST_FOR_PAYMENT";
export const EinvoiceDeliveryDocumentType = S.Literal(
  "AWS_CLOUD_INVOICE",
  "AWS_CLOUD_CREDIT_MEMO",
  "AWS_MARKETPLACE_INVOICE",
  "AWS_MARKETPLACE_CREDIT_MEMO",
  "AWS_REQUEST_FOR_PAYMENT",
);
export type EinvoiceDeliveryDocumentTypes = EinvoiceDeliveryDocumentType[];
export const EinvoiceDeliveryDocumentTypes = S.Array(
  EinvoiceDeliveryDocumentType,
);
export type EinvoiceDeliveryAttachmentType = "INVOICE_PDF" | "RFP_PDF";
export const EinvoiceDeliveryAttachmentType = S.Literal(
  "INVOICE_PDF",
  "RFP_PDF",
);
export type EinvoiceDeliveryAttachmentTypes = EinvoiceDeliveryAttachmentType[];
export const EinvoiceDeliveryAttachmentTypes = S.Array(
  EinvoiceDeliveryAttachmentType,
);
export type Protocol = "CXML";
export const Protocol = S.Literal("CXML");
export type PurchaseOrderDataSourceType =
  | "ASSOCIATED_PURCHASE_ORDER_REQUIRED"
  | "PURCHASE_ORDER_NOT_REQUIRED";
export const PurchaseOrderDataSourceType = S.Literal(
  "ASSOCIATED_PURCHASE_ORDER_REQUIRED",
  "PURCHASE_ORDER_NOT_REQUIRED",
);
export interface PurchaseOrderDataSource {
  EinvoiceDeliveryDocumentType?: EinvoiceDeliveryDocumentType;
  PurchaseOrderDataSourceType?: PurchaseOrderDataSourceType;
}
export const PurchaseOrderDataSource = S.suspend(() =>
  S.Struct({
    EinvoiceDeliveryDocumentType: S.optional(EinvoiceDeliveryDocumentType),
    PurchaseOrderDataSourceType: S.optional(PurchaseOrderDataSourceType),
  }),
).annotations({
  identifier: "PurchaseOrderDataSource",
}) as any as S.Schema<PurchaseOrderDataSource>;
export type PurchaseOrderDataSources = PurchaseOrderDataSource[];
export const PurchaseOrderDataSources = S.Array(PurchaseOrderDataSource);
export type ConnectionTestingMethod =
  | "PROD_ENV_DOLLAR_TEST"
  | "TEST_ENV_REPLAY_TEST";
export const ConnectionTestingMethod = S.Literal(
  "PROD_ENV_DOLLAR_TEST",
  "TEST_ENV_REPLAY_TEST",
);
export interface EinvoiceDeliveryPreference {
  EinvoiceDeliveryDocumentTypes: EinvoiceDeliveryDocumentType[];
  EinvoiceDeliveryAttachmentTypes?: EinvoiceDeliveryAttachmentType[];
  Protocol: Protocol;
  PurchaseOrderDataSources: PurchaseOrderDataSource[];
  ConnectionTestingMethod: ConnectionTestingMethod;
  EinvoiceDeliveryActivationDate: Date;
}
export const EinvoiceDeliveryPreference = S.suspend(() =>
  S.Struct({
    EinvoiceDeliveryDocumentTypes: EinvoiceDeliveryDocumentTypes,
    EinvoiceDeliveryAttachmentTypes: S.optional(
      EinvoiceDeliveryAttachmentTypes,
    ),
    Protocol: Protocol,
    PurchaseOrderDataSources: PurchaseOrderDataSources,
    ConnectionTestingMethod: ConnectionTestingMethod,
    EinvoiceDeliveryActivationDate: S.Date.pipe(
      T.TimestampFormat("epoch-seconds"),
    ),
  }),
).annotations({
  identifier: "EinvoiceDeliveryPreference",
}) as any as S.Schema<EinvoiceDeliveryPreference>;
export interface Contact {
  Name?: string;
  Email?: string;
}
export const Contact = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Email: S.optional(S.String) }),
).annotations({ identifier: "Contact" }) as any as S.Schema<Contact>;
export type Contacts = Contact[];
export const Contacts = S.Array(Contact);
export interface PutProcurementPortalPreferenceRequest {
  ProcurementPortalPreferenceArn: string;
  Selector?: ProcurementPortalPreferenceSelector;
  ProcurementPortalSharedSecret?: string | redacted.Redacted<string>;
  ProcurementPortalInstanceEndpoint?: string;
  TestEnvPreference?: TestEnvPreferenceInput;
  EinvoiceDeliveryEnabled: boolean;
  EinvoiceDeliveryPreference?: EinvoiceDeliveryPreference;
  PurchaseOrderRetrievalEnabled: boolean;
  Contacts: Contact[];
}
export const PutProcurementPortalPreferenceRequest = S.suspend(() =>
  S.Struct({
    ProcurementPortalPreferenceArn: S.String,
    Selector: S.optional(ProcurementPortalPreferenceSelector),
    ProcurementPortalSharedSecret: S.optional(SensitiveString),
    ProcurementPortalInstanceEndpoint: S.optional(S.String),
    TestEnvPreference: S.optional(TestEnvPreferenceInput),
    EinvoiceDeliveryEnabled: S.Boolean,
    EinvoiceDeliveryPreference: S.optional(EinvoiceDeliveryPreference),
    PurchaseOrderRetrievalEnabled: S.Boolean,
    Contacts: Contacts,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutProcurementPortalPreferenceRequest",
}) as any as S.Schema<PutProcurementPortalPreferenceRequest>;
export interface ResourceTag {
  Key: string;
  Value: string;
}
export const ResourceTag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "ResourceTag" }) as any as S.Schema<ResourceTag>;
export type ResourceTagList = ResourceTag[];
export const ResourceTagList = S.Array(ResourceTag);
export interface TagResourceRequest {
  ResourceArn: string;
  ResourceTags: ResourceTag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, ResourceTags: ResourceTagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  ResourceTagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, ResourceTagKeys: ResourceTagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type RuleAccountIdList = string[];
export const RuleAccountIdList = S.Array(S.String);
export interface InvoiceUnitRule {
  LinkedAccounts?: string[];
  BillSourceAccounts?: string[];
}
export const InvoiceUnitRule = S.suspend(() =>
  S.Struct({
    LinkedAccounts: S.optional(RuleAccountIdList),
    BillSourceAccounts: S.optional(RuleAccountIdList),
  }),
).annotations({
  identifier: "InvoiceUnitRule",
}) as any as S.Schema<InvoiceUnitRule>;
export interface UpdateInvoiceUnitRequest {
  InvoiceUnitArn: string;
  Description?: string;
  TaxInheritanceDisabled?: boolean;
  Rule?: InvoiceUnitRule;
}
export const UpdateInvoiceUnitRequest = S.suspend(() =>
  S.Struct({
    InvoiceUnitArn: S.String,
    Description: S.optional(S.String),
    TaxInheritanceDisabled: S.optional(S.Boolean),
    Rule: S.optional(InvoiceUnitRule),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateInvoiceUnitRequest",
}) as any as S.Schema<UpdateInvoiceUnitRequest>;
export interface UpdateProcurementPortalPreferenceStatusRequest {
  ProcurementPortalPreferenceArn: string;
  EinvoiceDeliveryPreferenceStatus?: ProcurementPortalPreferenceStatus;
  EinvoiceDeliveryPreferenceStatusReason?: string;
  PurchaseOrderRetrievalPreferenceStatus?: ProcurementPortalPreferenceStatus;
  PurchaseOrderRetrievalPreferenceStatusReason?: string;
}
export const UpdateProcurementPortalPreferenceStatusRequest = S.suspend(() =>
  S.Struct({
    ProcurementPortalPreferenceArn: S.String,
    EinvoiceDeliveryPreferenceStatus: S.optional(
      ProcurementPortalPreferenceStatus,
    ),
    EinvoiceDeliveryPreferenceStatusReason: S.optional(S.String),
    PurchaseOrderRetrievalPreferenceStatus: S.optional(
      ProcurementPortalPreferenceStatus,
    ),
    PurchaseOrderRetrievalPreferenceStatusReason: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProcurementPortalPreferenceStatusRequest",
}) as any as S.Schema<UpdateProcurementPortalPreferenceStatusRequest>;
export type ListInvoiceSummariesResourceType = "ACCOUNT_ID" | "INVOICE_ID";
export const ListInvoiceSummariesResourceType = S.Literal(
  "ACCOUNT_ID",
  "INVOICE_ID",
);
export type InvoiceUnitNames = string[];
export const InvoiceUnitNames = S.Array(S.String);
export interface InvoiceSummariesSelector {
  ResourceType: ListInvoiceSummariesResourceType;
  Value: string;
}
export const InvoiceSummariesSelector = S.suspend(() =>
  S.Struct({ ResourceType: ListInvoiceSummariesResourceType, Value: S.String }),
).annotations({
  identifier: "InvoiceSummariesSelector",
}) as any as S.Schema<InvoiceSummariesSelector>;
export interface Filters {
  Names?: string[];
  InvoiceReceivers?: string[];
  Accounts?: string[];
  BillSourceAccounts?: string[];
}
export const Filters = S.suspend(() =>
  S.Struct({
    Names: S.optional(InvoiceUnitNames),
    InvoiceReceivers: S.optional(AccountIdList),
    Accounts: S.optional(AccountIdList),
    BillSourceAccounts: S.optional(AccountIdList),
  }),
).annotations({ identifier: "Filters" }) as any as S.Schema<Filters>;
export interface CreateInvoiceUnitRequest {
  Name: string;
  InvoiceReceiver: string;
  Description?: string;
  TaxInheritanceDisabled?: boolean;
  Rule: InvoiceUnitRule;
  ResourceTags?: ResourceTag[];
}
export const CreateInvoiceUnitRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    InvoiceReceiver: S.String,
    Description: S.optional(S.String),
    TaxInheritanceDisabled: S.optional(S.Boolean),
    Rule: InvoiceUnitRule,
    ResourceTags: S.optional(ResourceTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateInvoiceUnitRequest",
}) as any as S.Schema<CreateInvoiceUnitRequest>;
export interface DeleteInvoiceUnitResponse {
  InvoiceUnitArn?: string;
}
export const DeleteInvoiceUnitResponse = S.suspend(() =>
  S.Struct({ InvoiceUnitArn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteInvoiceUnitResponse",
}) as any as S.Schema<DeleteInvoiceUnitResponse>;
export interface DeleteProcurementPortalPreferenceResponse {
  ProcurementPortalPreferenceArn: string;
}
export const DeleteProcurementPortalPreferenceResponse = S.suspend(() =>
  S.Struct({ ProcurementPortalPreferenceArn: S.String }),
).annotations({
  identifier: "DeleteProcurementPortalPreferenceResponse",
}) as any as S.Schema<DeleteProcurementPortalPreferenceResponse>;
export interface GetInvoiceUnitResponse {
  InvoiceUnitArn?: string;
  InvoiceReceiver?: string;
  Name?: string;
  Description?: string;
  TaxInheritanceDisabled?: boolean;
  Rule?: InvoiceUnitRule;
  LastModified?: Date;
}
export const GetInvoiceUnitResponse = S.suspend(() =>
  S.Struct({
    InvoiceUnitArn: S.optional(S.String),
    InvoiceReceiver: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    TaxInheritanceDisabled: S.optional(S.Boolean),
    Rule: S.optional(InvoiceUnitRule),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetInvoiceUnitResponse",
}) as any as S.Schema<GetInvoiceUnitResponse>;
export interface ListInvoiceUnitsRequest {
  Filters?: Filters;
  NextToken?: string;
  MaxResults?: number;
  AsOf?: Date;
}
export const ListInvoiceUnitsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(Filters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    AsOf: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListInvoiceUnitsRequest",
}) as any as S.Schema<ListInvoiceUnitsRequest>;
export interface ListTagsForResourceResponse {
  ResourceTags?: ResourceTag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ ResourceTags: S.optional(ResourceTagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutProcurementPortalPreferenceResponse {
  ProcurementPortalPreferenceArn: string;
}
export const PutProcurementPortalPreferenceResponse = S.suspend(() =>
  S.Struct({ ProcurementPortalPreferenceArn: S.String }),
).annotations({
  identifier: "PutProcurementPortalPreferenceResponse",
}) as any as S.Schema<PutProcurementPortalPreferenceResponse>;
export interface UpdateInvoiceUnitResponse {
  InvoiceUnitArn?: string;
}
export const UpdateInvoiceUnitResponse = S.suspend(() =>
  S.Struct({ InvoiceUnitArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateInvoiceUnitResponse",
}) as any as S.Schema<UpdateInvoiceUnitResponse>;
export interface UpdateProcurementPortalPreferenceStatusResponse {
  ProcurementPortalPreferenceArn: string;
}
export const UpdateProcurementPortalPreferenceStatusResponse = S.suspend(() =>
  S.Struct({ ProcurementPortalPreferenceArn: S.String }),
).annotations({
  identifier: "UpdateProcurementPortalPreferenceStatusResponse",
}) as any as S.Schema<UpdateProcurementPortalPreferenceStatusResponse>;
export interface DateInterval {
  StartDate: Date;
  EndDate: Date;
}
export const DateInterval = S.suspend(() =>
  S.Struct({
    StartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "DateInterval" }) as any as S.Schema<DateInterval>;
export interface BillingPeriod {
  Month: number;
  Year: number;
}
export const BillingPeriod = S.suspend(() =>
  S.Struct({ Month: S.Number, Year: S.Number }),
).annotations({
  identifier: "BillingPeriod",
}) as any as S.Schema<BillingPeriod>;
export interface InvoiceSummariesFilter {
  TimeInterval?: DateInterval;
  BillingPeriod?: BillingPeriod;
  InvoicingEntity?: string;
}
export const InvoiceSummariesFilter = S.suspend(() =>
  S.Struct({
    TimeInterval: S.optional(DateInterval),
    BillingPeriod: S.optional(BillingPeriod),
    InvoicingEntity: S.optional(S.String),
  }),
).annotations({
  identifier: "InvoiceSummariesFilter",
}) as any as S.Schema<InvoiceSummariesFilter>;
export interface ProcurementPortalPreferenceSummary {
  AwsAccountId: string;
  ProcurementPortalPreferenceArn: string;
  ProcurementPortalName: ProcurementPortalName;
  BuyerDomain: BuyerDomain;
  BuyerIdentifier: string;
  SupplierDomain: SupplierDomain;
  SupplierIdentifier: string;
  Selector?: ProcurementPortalPreferenceSelector;
  EinvoiceDeliveryEnabled: boolean;
  PurchaseOrderRetrievalEnabled: boolean;
  EinvoiceDeliveryPreferenceStatus?: ProcurementPortalPreferenceStatus;
  EinvoiceDeliveryPreferenceStatusReason?: string;
  PurchaseOrderRetrievalPreferenceStatus?: ProcurementPortalPreferenceStatus;
  PurchaseOrderRetrievalPreferenceStatusReason?: string;
  Version: number;
  CreateDate: Date;
  LastUpdateDate: Date;
}
export const ProcurementPortalPreferenceSummary = S.suspend(() =>
  S.Struct({
    AwsAccountId: S.String,
    ProcurementPortalPreferenceArn: S.String,
    ProcurementPortalName: ProcurementPortalName,
    BuyerDomain: BuyerDomain,
    BuyerIdentifier: S.String,
    SupplierDomain: SupplierDomain,
    SupplierIdentifier: S.String,
    Selector: S.optional(ProcurementPortalPreferenceSelector),
    EinvoiceDeliveryEnabled: S.Boolean,
    PurchaseOrderRetrievalEnabled: S.Boolean,
    EinvoiceDeliveryPreferenceStatus: S.optional(
      ProcurementPortalPreferenceStatus,
    ),
    EinvoiceDeliveryPreferenceStatusReason: S.optional(S.String),
    PurchaseOrderRetrievalPreferenceStatus: S.optional(
      ProcurementPortalPreferenceStatus,
    ),
    PurchaseOrderRetrievalPreferenceStatusReason: S.optional(S.String),
    Version: S.Number,
    CreateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ProcurementPortalPreferenceSummary",
}) as any as S.Schema<ProcurementPortalPreferenceSummary>;
export type ProcurementPortalPreferenceSummaries =
  ProcurementPortalPreferenceSummary[];
export const ProcurementPortalPreferenceSummaries = S.Array(
  ProcurementPortalPreferenceSummary,
);
export interface CreateInvoiceUnitResponse {
  InvoiceUnitArn?: string;
}
export const CreateInvoiceUnitResponse = S.suspend(() =>
  S.Struct({ InvoiceUnitArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateInvoiceUnitResponse",
}) as any as S.Schema<CreateInvoiceUnitResponse>;
export interface CreateProcurementPortalPreferenceRequest {
  ProcurementPortalName: ProcurementPortalName;
  BuyerDomain: BuyerDomain;
  BuyerIdentifier: string;
  SupplierDomain: SupplierDomain;
  SupplierIdentifier: string;
  Selector?: ProcurementPortalPreferenceSelector;
  ProcurementPortalSharedSecret?: string | redacted.Redacted<string>;
  ProcurementPortalInstanceEndpoint?: string;
  TestEnvPreference?: TestEnvPreferenceInput;
  EinvoiceDeliveryEnabled: boolean;
  EinvoiceDeliveryPreference?: EinvoiceDeliveryPreference;
  PurchaseOrderRetrievalEnabled: boolean;
  Contacts: Contact[];
  ResourceTags?: ResourceTag[];
  ClientToken?: string;
}
export const CreateProcurementPortalPreferenceRequest = S.suspend(() =>
  S.Struct({
    ProcurementPortalName: ProcurementPortalName,
    BuyerDomain: BuyerDomain,
    BuyerIdentifier: S.String,
    SupplierDomain: SupplierDomain,
    SupplierIdentifier: S.String,
    Selector: S.optional(ProcurementPortalPreferenceSelector),
    ProcurementPortalSharedSecret: S.optional(SensitiveString),
    ProcurementPortalInstanceEndpoint: S.optional(S.String),
    TestEnvPreference: S.optional(TestEnvPreferenceInput),
    EinvoiceDeliveryEnabled: S.Boolean,
    EinvoiceDeliveryPreference: S.optional(EinvoiceDeliveryPreference),
    PurchaseOrderRetrievalEnabled: S.Boolean,
    Contacts: Contacts,
    ResourceTags: S.optional(ResourceTagList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProcurementPortalPreferenceRequest",
}) as any as S.Schema<CreateProcurementPortalPreferenceRequest>;
export interface ListInvoiceSummariesRequest {
  Selector: InvoiceSummariesSelector;
  Filter?: InvoiceSummariesFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListInvoiceSummariesRequest = S.suspend(() =>
  S.Struct({
    Selector: InvoiceSummariesSelector,
    Filter: S.optional(InvoiceSummariesFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListInvoiceSummariesRequest",
}) as any as S.Schema<ListInvoiceSummariesRequest>;
export interface ListProcurementPortalPreferencesResponse {
  ProcurementPortalPreferences?: ProcurementPortalPreferenceSummary[];
  NextToken?: string;
}
export const ListProcurementPortalPreferencesResponse = S.suspend(() =>
  S.Struct({
    ProcurementPortalPreferences: S.optional(
      ProcurementPortalPreferenceSummaries,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProcurementPortalPreferencesResponse",
}) as any as S.Schema<ListProcurementPortalPreferencesResponse>;
export interface ReceiverAddress {
  AddressLine1?: string;
  AddressLine2?: string;
  AddressLine3?: string;
  DistrictOrCounty?: string;
  City?: string;
  StateOrRegion?: string;
  CountryCode?: string;
  CompanyName?: string;
  PostalCode?: string;
}
export const ReceiverAddress = S.suspend(() =>
  S.Struct({
    AddressLine1: S.optional(S.String),
    AddressLine2: S.optional(S.String),
    AddressLine3: S.optional(S.String),
    DistrictOrCounty: S.optional(S.String),
    City: S.optional(S.String),
    StateOrRegion: S.optional(S.String),
    CountryCode: S.optional(S.String),
    CompanyName: S.optional(S.String),
    PostalCode: S.optional(S.String),
  }),
).annotations({
  identifier: "ReceiverAddress",
}) as any as S.Schema<ReceiverAddress>;
export interface SupplementalDocument {
  DocumentUrl?: string;
  DocumentUrlExpirationDate?: Date;
}
export const SupplementalDocument = S.suspend(() =>
  S.Struct({
    DocumentUrl: S.optional(S.String),
    DocumentUrlExpirationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "SupplementalDocument",
}) as any as S.Schema<SupplementalDocument>;
export type SupplementalDocuments = SupplementalDocument[];
export const SupplementalDocuments = S.Array(SupplementalDocument);
export interface TestEnvPreference {
  BuyerDomain: BuyerDomain;
  BuyerIdentifier: string;
  SupplierDomain: SupplierDomain;
  SupplierIdentifier: string;
  ProcurementPortalSharedSecret?: string;
  ProcurementPortalInstanceEndpoint?: string;
  PurchaseOrderRetrievalEndpoint?: string;
}
export const TestEnvPreference = S.suspend(() =>
  S.Struct({
    BuyerDomain: BuyerDomain,
    BuyerIdentifier: S.String,
    SupplierDomain: SupplierDomain,
    SupplierIdentifier: S.String,
    ProcurementPortalSharedSecret: S.optional(S.String),
    ProcurementPortalInstanceEndpoint: S.optional(S.String),
    PurchaseOrderRetrievalEndpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "TestEnvPreference",
}) as any as S.Schema<TestEnvPreference>;
export interface InvoiceProfile {
  AccountId?: string;
  ReceiverName?: string;
  ReceiverAddress?: ReceiverAddress;
  ReceiverEmail?: string | redacted.Redacted<string>;
  Issuer?: string;
  TaxRegistrationNumber?: string | redacted.Redacted<string>;
}
export const InvoiceProfile = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    ReceiverName: S.optional(S.String),
    ReceiverAddress: S.optional(ReceiverAddress),
    ReceiverEmail: S.optional(SensitiveString),
    Issuer: S.optional(S.String),
    TaxRegistrationNumber: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "InvoiceProfile",
}) as any as S.Schema<InvoiceProfile>;
export type ProfileList = InvoiceProfile[];
export const ProfileList = S.Array(InvoiceProfile);
export interface InvoicePDF {
  InvoiceId?: string;
  DocumentUrl?: string;
  DocumentUrlExpirationDate?: Date;
  SupplementalDocuments?: SupplementalDocument[];
}
export const InvoicePDF = S.suspend(() =>
  S.Struct({
    InvoiceId: S.optional(S.String),
    DocumentUrl: S.optional(S.String),
    DocumentUrlExpirationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SupplementalDocuments: S.optional(SupplementalDocuments),
  }),
).annotations({ identifier: "InvoicePDF" }) as any as S.Schema<InvoicePDF>;
export interface ProcurementPortalPreference {
  AwsAccountId: string;
  ProcurementPortalPreferenceArn: string;
  ProcurementPortalName: ProcurementPortalName;
  BuyerDomain: BuyerDomain;
  BuyerIdentifier: string;
  SupplierDomain: SupplierDomain;
  SupplierIdentifier: string;
  Selector?: ProcurementPortalPreferenceSelector;
  ProcurementPortalSharedSecret?: string;
  ProcurementPortalInstanceEndpoint?: string;
  PurchaseOrderRetrievalEndpoint?: string;
  TestEnvPreference?: TestEnvPreference;
  EinvoiceDeliveryEnabled: boolean;
  EinvoiceDeliveryPreference?: EinvoiceDeliveryPreference;
  PurchaseOrderRetrievalEnabled: boolean;
  Contacts?: Contact[];
  EinvoiceDeliveryPreferenceStatus?: ProcurementPortalPreferenceStatus;
  EinvoiceDeliveryPreferenceStatusReason?: string;
  PurchaseOrderRetrievalPreferenceStatus?: ProcurementPortalPreferenceStatus;
  PurchaseOrderRetrievalPreferenceStatusReason?: string;
  Version: number;
  CreateDate: Date;
  LastUpdateDate: Date;
}
export const ProcurementPortalPreference = S.suspend(() =>
  S.Struct({
    AwsAccountId: S.String,
    ProcurementPortalPreferenceArn: S.String,
    ProcurementPortalName: ProcurementPortalName,
    BuyerDomain: BuyerDomain,
    BuyerIdentifier: S.String,
    SupplierDomain: SupplierDomain,
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
    EinvoiceDeliveryPreferenceStatus: S.optional(
      ProcurementPortalPreferenceStatus,
    ),
    EinvoiceDeliveryPreferenceStatusReason: S.optional(S.String),
    PurchaseOrderRetrievalPreferenceStatus: S.optional(
      ProcurementPortalPreferenceStatus,
    ),
    PurchaseOrderRetrievalPreferenceStatusReason: S.optional(S.String),
    Version: S.Number,
    CreateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ProcurementPortalPreference",
}) as any as S.Schema<ProcurementPortalPreference>;
export interface InvoiceUnit {
  InvoiceUnitArn?: string;
  InvoiceReceiver?: string;
  Name?: string;
  Description?: string;
  TaxInheritanceDisabled?: boolean;
  Rule?: InvoiceUnitRule;
  LastModified?: Date;
}
export const InvoiceUnit = S.suspend(() =>
  S.Struct({
    InvoiceUnitArn: S.optional(S.String),
    InvoiceReceiver: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    TaxInheritanceDisabled: S.optional(S.Boolean),
    Rule: S.optional(InvoiceUnitRule),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "InvoiceUnit" }) as any as S.Schema<InvoiceUnit>;
export type InvoiceUnits = InvoiceUnit[];
export const InvoiceUnits = S.Array(InvoiceUnit);
export interface BatchGetInvoiceProfileResponse {
  Profiles?: InvoiceProfile[];
}
export const BatchGetInvoiceProfileResponse = S.suspend(() =>
  S.Struct({ Profiles: S.optional(ProfileList) }),
).annotations({
  identifier: "BatchGetInvoiceProfileResponse",
}) as any as S.Schema<BatchGetInvoiceProfileResponse>;
export interface CreateProcurementPortalPreferenceResponse {
  ProcurementPortalPreferenceArn: string;
}
export const CreateProcurementPortalPreferenceResponse = S.suspend(() =>
  S.Struct({ ProcurementPortalPreferenceArn: S.String }),
).annotations({
  identifier: "CreateProcurementPortalPreferenceResponse",
}) as any as S.Schema<CreateProcurementPortalPreferenceResponse>;
export interface GetInvoicePDFResponse {
  InvoicePDF?: InvoicePDF;
}
export const GetInvoicePDFResponse = S.suspend(() =>
  S.Struct({ InvoicePDF: S.optional(InvoicePDF) }),
).annotations({
  identifier: "GetInvoicePDFResponse",
}) as any as S.Schema<GetInvoicePDFResponse>;
export interface GetProcurementPortalPreferenceResponse {
  ProcurementPortalPreference: ProcurementPortalPreference;
}
export const GetProcurementPortalPreferenceResponse = S.suspend(() =>
  S.Struct({ ProcurementPortalPreference: ProcurementPortalPreference }),
).annotations({
  identifier: "GetProcurementPortalPreferenceResponse",
}) as any as S.Schema<GetProcurementPortalPreferenceResponse>;
export interface ListInvoiceUnitsResponse {
  InvoiceUnits?: InvoiceUnit[];
  NextToken?: string;
}
export const ListInvoiceUnitsResponse = S.suspend(() =>
  S.Struct({
    InvoiceUnits: S.optional(InvoiceUnits),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInvoiceUnitsResponse",
}) as any as S.Schema<ListInvoiceUnitsResponse>;
export type InvoiceType = "INVOICE" | "CREDIT_MEMO";
export const InvoiceType = S.Literal("INVOICE", "CREDIT_MEMO");
export type ValidationExceptionReason =
  | "nonMemberPresent"
  | "maxAccountsExceeded"
  | "maxInvoiceUnitsExceeded"
  | "duplicateInvoiceUnit"
  | "mutualExclusionError"
  | "accountMembershipError"
  | "taxSettingsError"
  | "expiredNextToken"
  | "invalidNextToken"
  | "invalidInput"
  | "fieldValidationFailed"
  | "cannotParse"
  | "unknownOperation"
  | "other";
export const ValidationExceptionReason = S.Literal(
  "nonMemberPresent",
  "maxAccountsExceeded",
  "maxInvoiceUnitsExceeded",
  "duplicateInvoiceUnit",
  "mutualExclusionError",
  "accountMembershipError",
  "taxSettingsError",
  "expiredNextToken",
  "invalidNextToken",
  "invalidInput",
  "fieldValidationFailed",
  "cannotParse",
  "unknownOperation",
  "other",
);
export interface Entity {
  InvoicingEntity?: string;
}
export const Entity = S.suspend(() =>
  S.Struct({ InvoicingEntity: S.optional(S.String) }),
).annotations({ identifier: "Entity" }) as any as S.Schema<Entity>;
export interface CurrencyExchangeDetails {
  SourceCurrencyCode?: string;
  TargetCurrencyCode?: string;
  Rate?: string;
}
export const CurrencyExchangeDetails = S.suspend(() =>
  S.Struct({
    SourceCurrencyCode: S.optional(S.String),
    TargetCurrencyCode: S.optional(S.String),
    Rate: S.optional(S.String),
  }),
).annotations({
  identifier: "CurrencyExchangeDetails",
}) as any as S.Schema<CurrencyExchangeDetails>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface DiscountsBreakdownAmount {
  Description?: string;
  Amount?: string;
  Rate?: string;
}
export const DiscountsBreakdownAmount = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Amount: S.optional(S.String),
    Rate: S.optional(S.String),
  }),
).annotations({
  identifier: "DiscountsBreakdownAmount",
}) as any as S.Schema<DiscountsBreakdownAmount>;
export type DiscountsBreakdownAmountList = DiscountsBreakdownAmount[];
export const DiscountsBreakdownAmountList = S.Array(DiscountsBreakdownAmount);
export interface TaxesBreakdownAmount {
  Description?: string;
  Amount?: string;
  Rate?: string;
}
export const TaxesBreakdownAmount = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Amount: S.optional(S.String),
    Rate: S.optional(S.String),
  }),
).annotations({
  identifier: "TaxesBreakdownAmount",
}) as any as S.Schema<TaxesBreakdownAmount>;
export type TaxesBreakdownAmountList = TaxesBreakdownAmount[];
export const TaxesBreakdownAmountList = S.Array(TaxesBreakdownAmount);
export interface FeesBreakdownAmount {
  Description?: string;
  Amount?: string;
  Rate?: string;
}
export const FeesBreakdownAmount = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Amount: S.optional(S.String),
    Rate: S.optional(S.String),
  }),
).annotations({
  identifier: "FeesBreakdownAmount",
}) as any as S.Schema<FeesBreakdownAmount>;
export type FeesBreakdownAmountList = FeesBreakdownAmount[];
export const FeesBreakdownAmountList = S.Array(FeesBreakdownAmount);
export interface DiscountsBreakdown {
  Breakdown?: DiscountsBreakdownAmount[];
  TotalAmount?: string;
}
export const DiscountsBreakdown = S.suspend(() =>
  S.Struct({
    Breakdown: S.optional(DiscountsBreakdownAmountList),
    TotalAmount: S.optional(S.String),
  }),
).annotations({
  identifier: "DiscountsBreakdown",
}) as any as S.Schema<DiscountsBreakdown>;
export interface TaxesBreakdown {
  Breakdown?: TaxesBreakdownAmount[];
  TotalAmount?: string;
}
export const TaxesBreakdown = S.suspend(() =>
  S.Struct({
    Breakdown: S.optional(TaxesBreakdownAmountList),
    TotalAmount: S.optional(S.String),
  }),
).annotations({
  identifier: "TaxesBreakdown",
}) as any as S.Schema<TaxesBreakdown>;
export interface FeesBreakdown {
  Breakdown?: FeesBreakdownAmount[];
  TotalAmount?: string;
}
export const FeesBreakdown = S.suspend(() =>
  S.Struct({
    Breakdown: S.optional(FeesBreakdownAmountList),
    TotalAmount: S.optional(S.String),
  }),
).annotations({
  identifier: "FeesBreakdown",
}) as any as S.Schema<FeesBreakdown>;
export interface AmountBreakdown {
  SubTotalAmount?: string;
  Discounts?: DiscountsBreakdown;
  Taxes?: TaxesBreakdown;
  Fees?: FeesBreakdown;
}
export const AmountBreakdown = S.suspend(() =>
  S.Struct({
    SubTotalAmount: S.optional(S.String),
    Discounts: S.optional(DiscountsBreakdown),
    Taxes: S.optional(TaxesBreakdown),
    Fees: S.optional(FeesBreakdown),
  }),
).annotations({
  identifier: "AmountBreakdown",
}) as any as S.Schema<AmountBreakdown>;
export interface InvoiceCurrencyAmount {
  TotalAmount?: string;
  TotalAmountBeforeTax?: string;
  CurrencyCode?: string;
  AmountBreakdown?: AmountBreakdown;
  CurrencyExchangeDetails?: CurrencyExchangeDetails;
}
export const InvoiceCurrencyAmount = S.suspend(() =>
  S.Struct({
    TotalAmount: S.optional(S.String),
    TotalAmountBeforeTax: S.optional(S.String),
    CurrencyCode: S.optional(S.String),
    AmountBreakdown: S.optional(AmountBreakdown),
    CurrencyExchangeDetails: S.optional(CurrencyExchangeDetails),
  }),
).annotations({
  identifier: "InvoiceCurrencyAmount",
}) as any as S.Schema<InvoiceCurrencyAmount>;
export interface InvoiceSummary {
  AccountId?: string;
  InvoiceId?: string;
  IssuedDate?: Date;
  DueDate?: Date;
  Entity?: Entity;
  BillingPeriod?: BillingPeriod;
  InvoiceType?: InvoiceType;
  OriginalInvoiceId?: string;
  PurchaseOrderNumber?: string;
  BaseCurrencyAmount?: InvoiceCurrencyAmount;
  TaxCurrencyAmount?: InvoiceCurrencyAmount;
  PaymentCurrencyAmount?: InvoiceCurrencyAmount;
}
export const InvoiceSummary = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    InvoiceId: S.optional(S.String),
    IssuedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DueDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Entity: S.optional(Entity),
    BillingPeriod: S.optional(BillingPeriod),
    InvoiceType: S.optional(InvoiceType),
    OriginalInvoiceId: S.optional(S.String),
    PurchaseOrderNumber: S.optional(S.String),
    BaseCurrencyAmount: S.optional(InvoiceCurrencyAmount),
    TaxCurrencyAmount: S.optional(InvoiceCurrencyAmount),
    PaymentCurrencyAmount: S.optional(InvoiceCurrencyAmount),
  }),
).annotations({
  identifier: "InvoiceSummary",
}) as any as S.Schema<InvoiceSummary>;
export type InvoiceSummaries = InvoiceSummary[];
export const InvoiceSummaries = S.Array(InvoiceSummary);
export interface ListInvoiceSummariesResponse {
  InvoiceSummaries: InvoiceSummary[];
  NextToken?: string;
}
export const ListInvoiceSummariesResponse = S.suspend(() =>
  S.Struct({
    InvoiceSummaries: InvoiceSummaries,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInvoiceSummariesResponse",
}) as any as S.Schema<ListInvoiceSummariesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
  T.AwsQueryError({ code: "InvoicingAccessDenied", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
    message: S.optional(S.String),
  },
  T.AwsQueryError({ code: "InvoicingInternalServer", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
  T.AwsQueryError({ code: "InvoicingConflict", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
  T.AwsQueryError({ code: "InvoicingResourceNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvoicingThrottling", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
  T.AwsQueryError({
    code: "InvoicingServiceQuotaExceeded",
    httpResponseCode: 402,
  }),
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    resourceName: S.optional(S.String),
    reason: S.optional(ValidationExceptionReason),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
  T.AwsQueryError({ code: "InvoicingValidation", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * This creates a new invoice unit with the provided definition.
 */
export const createInvoiceUnit: (
  input: CreateInvoiceUnitRequest,
) => effect.Effect<
  CreateInvoiceUnitResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateInvoiceUnit: (
  input: UpdateInvoiceUnitRequest,
) => effect.Effect<
  UpdateInvoiceUnitResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteInvoiceUnit: (
  input: DeleteInvoiceUnitRequest,
) => effect.Effect<
  DeleteInvoiceUnitResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getInvoiceUnit: (
  input: GetInvoiceUnitRequest,
) => effect.Effect<
  GetInvoiceUnitResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetInvoiceProfile: (
  input: BatchGetInvoiceProfileRequest,
) => effect.Effect<
  BatchGetInvoiceProfileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetInvoiceProfileRequest,
  output: BatchGetInvoiceProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a URL to download the invoice document and supplemental documents associated with an invoice. The URLs are pre-signed and have expiration time. For special cases like Brazil, where Amazon Web Services generated invoice identifiers and government provided identifiers do not match, use the Amazon Web Services generated invoice identifier when making API requests. To grant IAM permission to use this operation, the caller needs the `invoicing:GetInvoicePDF` policy action.
 */
export const getInvoicePDF: (
  input: GetInvoicePDFRequest,
) => effect.Effect<
  GetInvoicePDFResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listProcurementPortalPreferences: {
  (
    input: ListProcurementPortalPreferencesRequest,
  ): effect.Effect<
    ListProcurementPortalPreferencesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProcurementPortalPreferencesRequest,
  ) => stream.Stream<
    ListProcurementPortalPreferencesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProcurementPortalPreferencesRequest,
  ) => stream.Stream<
    ProcurementPortalPreferenceSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listInvoiceUnits: {
  (
    input: ListInvoiceUnitsRequest,
  ): effect.Effect<
    ListInvoiceUnitsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvoiceUnitsRequest,
  ) => stream.Stream<
    ListInvoiceUnitsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvoiceUnitsRequest,
  ) => stream.Stream<
    InvoiceUnit,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Creates a procurement portal preference configuration for e-invoice delivery and purchase order retrieval. This preference defines how invoices are delivered to a procurement portal and how purchase orders are retrieved.
 */
export const createProcurementPortalPreference: (
  input: CreateProcurementPortalPreferenceRequest,
) => effect.Effect<
  CreateProcurementPortalPreferenceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProcurementPortalPreferenceStatus: (
  input: UpdateProcurementPortalPreferenceStatusRequest,
) => effect.Effect<
  UpdateProcurementPortalPreferenceStatusResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProcurementPortalPreference: (
  input: DeleteProcurementPortalPreferenceRequest,
) => effect.Effect<
  DeleteProcurementPortalPreferenceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putProcurementPortalPreference: (
  input: PutProcurementPortalPreferenceRequest,
) => effect.Effect<
  PutProcurementPortalPreferenceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getProcurementPortalPreference: (
  input: GetProcurementPortalPreferenceRequest,
) => effect.Effect<
  GetProcurementPortalPreferenceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listInvoiceSummaries: {
  (
    input: ListInvoiceSummariesRequest,
  ): effect.Effect<
    ListInvoiceSummariesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvoiceSummariesRequest,
  ) => stream.Stream<
    ListInvoiceSummariesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvoiceSummariesRequest,
  ) => stream.Stream<
    InvoiceSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
