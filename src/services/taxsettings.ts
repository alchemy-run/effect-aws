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
  sdkId: "TaxSettings",
  serviceShapeName: "TaxSettings",
});
const auth = T.AwsAuthSigv4({ name: "tax" });
const ver = T.ServiceVersion("2018-05-10");
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
              `https://tax-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
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
              `https://tax-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
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
              `https://tax.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p0(PartitionResult),
              {},
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://tax.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          _p0(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AccountId = string;
export type MaxResults = number;
export type PaginationTokenString = string;
export type RegistrationId = string;
export type LegalName = string;
export type CertifiedEmailId = string;
export type DisplayName = string;
export type S3BucketName = string;
export type S3Prefix = string;
export type TaxDocumentAccessToken = string;
export type TaxDocumentName = string;
export type CountryCode = string;
export type State = string;
export type ExemptionDocumentName = string;
export type ExemptionFileBlob = Uint8Array;
export type ErrorMessage = string | redacted.Redacted<string>;
export type ErrorCode = string;
export type AddressLine1 = string;
export type AddressLine2 = string;
export type AddressLine3 = string;
export type District = string;
export type City = string;
export type PostalCode = string;
export type DateOfBirth = string;
export type TaxInformationNumber = string;
export type BusinessRegistrationNumber = string;
export type RegistryCommercialCode = string;
export type CanadaProvincialSalesTaxIdString = string;
export type CanadaQuebecSalesTaxNumberString = string;
export type CanadaRetailSalesTaxNumberString = string;
export type BusinessRepresentativeName = string;
export type LineOfBusiness = string;
export type ItemOfBusiness = string;
export type TaxOffice = string;
export type KepEmailId = string;
export type SecondaryTaxId = string;
export type SdiAccountId = string;
export type CigNumber = string;
export type CupNumber = string;
export type TaxCode = string;
export type IndividualRegistrationNumber = string;
export type PpnExceptionDesignationCode = string;
export type DecisionNumber = string;
export type EnterpriseIdentificationNumber = string;
export type ElectronicTransactionCodeNumber = string;
export type PaymentVoucherNumber = string;
export type DateString = string;
export type UniqueIdentificationNumber = string;
export type ContractingAuthorityCode = string;
export type VatRegistrationNumber = string;
export type DestinationFilePath = string;
export type Url = string;
export type InheritanceObtainedReason = string;
export type AccountName = string;
export type Seller = string;
export type S3Key = string;
export type FileBlob = Uint8Array;
export type FieldName = string;
export type CcmCode = string;
export type LegalNatureCode = string;
export type Pan = string;

//# Schemas
export interface GetTaxExemptionTypesRequest {}
export const GetTaxExemptionTypesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTaxExemptionTypes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTaxExemptionTypesRequest",
}) as any as S.Schema<GetTaxExemptionTypesRequest>;
export interface GetTaxInheritanceRequest {}
export const GetTaxInheritanceRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTaxInheritance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTaxInheritanceRequest",
}) as any as S.Schema<GetTaxInheritanceRequest>;
export type AccountIds = string[];
export const AccountIds = S.Array(S.String);
export type HeritageStatus = "OptIn" | "OptOut";
export const HeritageStatus = S.Literal("OptIn", "OptOut");
export interface BatchDeleteTaxRegistrationRequest {
  accountIds: string[];
}
export const BatchDeleteTaxRegistrationRequest = S.suspend(() =>
  S.Struct({ accountIds: AccountIds }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchDeleteTaxRegistration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteTaxRegistrationRequest",
}) as any as S.Schema<BatchDeleteTaxRegistrationRequest>;
export interface BatchGetTaxExemptionsRequest {
  accountIds: string[];
}
export const BatchGetTaxExemptionsRequest = S.suspend(() =>
  S.Struct({ accountIds: AccountIds }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchGetTaxExemptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetTaxExemptionsRequest",
}) as any as S.Schema<BatchGetTaxExemptionsRequest>;
export interface DeleteSupplementalTaxRegistrationRequest {
  authorityId: string;
}
export const DeleteSupplementalTaxRegistrationRequest = S.suspend(() =>
  S.Struct({ authorityId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteSupplementalTaxRegistration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSupplementalTaxRegistrationRequest",
}) as any as S.Schema<DeleteSupplementalTaxRegistrationRequest>;
export interface DeleteSupplementalTaxRegistrationResponse {}
export const DeleteSupplementalTaxRegistrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSupplementalTaxRegistrationResponse",
}) as any as S.Schema<DeleteSupplementalTaxRegistrationResponse>;
export interface DeleteTaxRegistrationRequest {
  accountId?: string;
}
export const DeleteTaxRegistrationRequest = S.suspend(() =>
  S.Struct({ accountId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteTaxRegistration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTaxRegistrationRequest",
}) as any as S.Schema<DeleteTaxRegistrationRequest>;
export interface DeleteTaxRegistrationResponse {}
export const DeleteTaxRegistrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTaxRegistrationResponse",
}) as any as S.Schema<DeleteTaxRegistrationResponse>;
export interface GetTaxInheritanceResponse {
  heritageStatus?: HeritageStatus;
}
export const GetTaxInheritanceResponse = S.suspend(() =>
  S.Struct({ heritageStatus: S.optional(HeritageStatus) }),
).annotations({
  identifier: "GetTaxInheritanceResponse",
}) as any as S.Schema<GetTaxInheritanceResponse>;
export interface GetTaxRegistrationRequest {
  accountId?: string;
}
export const GetTaxRegistrationRequest = S.suspend(() =>
  S.Struct({ accountId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTaxRegistration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTaxRegistrationRequest",
}) as any as S.Schema<GetTaxRegistrationRequest>;
export interface ListSupplementalTaxRegistrationsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListSupplementalTaxRegistrationsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListSupplementalTaxRegistrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSupplementalTaxRegistrationsRequest",
}) as any as S.Schema<ListSupplementalTaxRegistrationsRequest>;
export interface ListTaxExemptionsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListTaxExemptionsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTaxExemptions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTaxExemptionsRequest",
}) as any as S.Schema<ListTaxExemptionsRequest>;
export interface ListTaxRegistrationsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListTaxRegistrationsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTaxRegistrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTaxRegistrationsRequest",
}) as any as S.Schema<ListTaxRegistrationsRequest>;
export interface PutTaxInheritanceRequest {
  heritageStatus?: HeritageStatus;
}
export const PutTaxInheritanceRequest = S.suspend(() =>
  S.Struct({ heritageStatus: S.optional(HeritageStatus) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutTaxInheritance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTaxInheritanceRequest",
}) as any as S.Schema<PutTaxInheritanceRequest>;
export interface PutTaxInheritanceResponse {}
export const PutTaxInheritanceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutTaxInheritanceResponse",
}) as any as S.Schema<PutTaxInheritanceResponse>;
export type TaxRegistrationType =
  | "VAT"
  | "GST"
  | "CPF"
  | "CNPJ"
  | "SST"
  | "TIN"
  | "NRIC";
export const TaxRegistrationType = S.Literal(
  "VAT",
  "GST",
  "CPF",
  "CNPJ",
  "SST",
  "TIN",
  "NRIC",
);
export interface Address {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  districtOrCounty?: string;
  city: string;
  stateOrRegion?: string;
  postalCode: string;
  countryCode: string;
}
export const Address = S.suspend(() =>
  S.Struct({
    addressLine1: S.String,
    addressLine2: S.optional(S.String),
    addressLine3: S.optional(S.String),
    districtOrCounty: S.optional(S.String),
    city: S.String,
    stateOrRegion: S.optional(S.String),
    postalCode: S.String,
    countryCode: S.String,
  }),
).annotations({ identifier: "Address" }) as any as S.Schema<Address>;
export type Sector = "Business" | "Individual" | "Government";
export const Sector = S.Literal("Business", "Individual", "Government");
export type MalaysiaServiceTaxCode =
  | "Consultancy"
  | "Digital Service And Electronic Medium"
  | "IT Services"
  | "Training Or Coaching";
export const MalaysiaServiceTaxCode = S.Literal(
  "Consultancy",
  "Digital Service And Electronic Medium",
  "IT Services",
  "Training Or Coaching",
);
export type MalaysiaServiceTaxCodesList = MalaysiaServiceTaxCode[];
export const MalaysiaServiceTaxCodesList = S.Array(MalaysiaServiceTaxCode);
export interface MalaysiaAdditionalInfo {
  serviceTaxCodes?: MalaysiaServiceTaxCode[];
  taxInformationNumber?: string;
  businessRegistrationNumber?: string;
}
export const MalaysiaAdditionalInfo = S.suspend(() =>
  S.Struct({
    serviceTaxCodes: S.optional(MalaysiaServiceTaxCodesList),
    taxInformationNumber: S.optional(S.String),
    businessRegistrationNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "MalaysiaAdditionalInfo",
}) as any as S.Schema<MalaysiaAdditionalInfo>;
export type IsraelDealerType = "Authorized" | "Non-authorized";
export const IsraelDealerType = S.Literal("Authorized", "Non-authorized");
export type IsraelCustomerType = "Business" | "Individual";
export const IsraelCustomerType = S.Literal("Business", "Individual");
export interface IsraelAdditionalInfo {
  dealerType: IsraelDealerType;
  customerType: IsraelCustomerType;
}
export const IsraelAdditionalInfo = S.suspend(() =>
  S.Struct({ dealerType: IsraelDealerType, customerType: IsraelCustomerType }),
).annotations({
  identifier: "IsraelAdditionalInfo",
}) as any as S.Schema<IsraelAdditionalInfo>;
export interface EstoniaAdditionalInfo {
  registryCommercialCode: string;
}
export const EstoniaAdditionalInfo = S.suspend(() =>
  S.Struct({ registryCommercialCode: S.String }),
).annotations({
  identifier: "EstoniaAdditionalInfo",
}) as any as S.Schema<EstoniaAdditionalInfo>;
export interface CanadaAdditionalInfo {
  provincialSalesTaxId?: string;
  canadaQuebecSalesTaxNumber?: string;
  canadaRetailSalesTaxNumber?: string;
  isResellerAccount?: boolean;
}
export const CanadaAdditionalInfo = S.suspend(() =>
  S.Struct({
    provincialSalesTaxId: S.optional(S.String),
    canadaQuebecSalesTaxNumber: S.optional(S.String),
    canadaRetailSalesTaxNumber: S.optional(S.String),
    isResellerAccount: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CanadaAdditionalInfo",
}) as any as S.Schema<CanadaAdditionalInfo>;
export type RegistrationType = "Intra-EU" | "Local";
export const RegistrationType = S.Literal("Intra-EU", "Local");
export interface SpainAdditionalInfo {
  registrationType: RegistrationType;
}
export const SpainAdditionalInfo = S.suspend(() =>
  S.Struct({ registrationType: RegistrationType }),
).annotations({
  identifier: "SpainAdditionalInfo",
}) as any as S.Schema<SpainAdditionalInfo>;
export type PersonType = "Legal Person" | "Physical Person" | "Business";
export const PersonType = S.Literal(
  "Legal Person",
  "Physical Person",
  "Business",
);
export interface KenyaAdditionalInfo {
  personType: PersonType;
}
export const KenyaAdditionalInfo = S.suspend(() =>
  S.Struct({ personType: PersonType }),
).annotations({
  identifier: "KenyaAdditionalInfo",
}) as any as S.Schema<KenyaAdditionalInfo>;
export interface SouthKoreaAdditionalInfo {
  businessRepresentativeName: string;
  lineOfBusiness: string;
  itemOfBusiness: string;
}
export const SouthKoreaAdditionalInfo = S.suspend(() =>
  S.Struct({
    businessRepresentativeName: S.String,
    lineOfBusiness: S.String,
    itemOfBusiness: S.String,
  }),
).annotations({
  identifier: "SouthKoreaAdditionalInfo",
}) as any as S.Schema<SouthKoreaAdditionalInfo>;
export type Industries =
  | "CirculatingOrg"
  | "ProfessionalOrg"
  | "Banks"
  | "Insurance"
  | "PensionAndBenefitFunds"
  | "DevelopmentAgencies";
export const Industries = S.Literal(
  "CirculatingOrg",
  "ProfessionalOrg",
  "Banks",
  "Insurance",
  "PensionAndBenefitFunds",
  "DevelopmentAgencies",
);
export interface TurkeyAdditionalInfo {
  taxOffice?: string;
  kepEmailId?: string;
  secondaryTaxId?: string;
  industries?: Industries;
}
export const TurkeyAdditionalInfo = S.suspend(() =>
  S.Struct({
    taxOffice: S.optional(S.String),
    kepEmailId: S.optional(S.String),
    secondaryTaxId: S.optional(S.String),
    industries: S.optional(Industries),
  }),
).annotations({
  identifier: "TurkeyAdditionalInfo",
}) as any as S.Schema<TurkeyAdditionalInfo>;
export interface GeorgiaAdditionalInfo {
  personType: PersonType;
}
export const GeorgiaAdditionalInfo = S.suspend(() =>
  S.Struct({ personType: PersonType }),
).annotations({
  identifier: "GeorgiaAdditionalInfo",
}) as any as S.Schema<GeorgiaAdditionalInfo>;
export interface ItalyAdditionalInfo {
  sdiAccountId?: string;
  cigNumber?: string;
  cupNumber?: string;
  taxCode?: string;
}
export const ItalyAdditionalInfo = S.suspend(() =>
  S.Struct({
    sdiAccountId: S.optional(S.String),
    cigNumber: S.optional(S.String),
    cupNumber: S.optional(S.String),
    taxCode: S.optional(S.String),
  }),
).annotations({
  identifier: "ItalyAdditionalInfo",
}) as any as S.Schema<ItalyAdditionalInfo>;
export type TaxRegistrationNumberType =
  | "TaxRegistrationNumber"
  | "LocalRegistrationNumber";
export const TaxRegistrationNumberType = S.Literal(
  "TaxRegistrationNumber",
  "LocalRegistrationNumber",
);
export interface RomaniaAdditionalInfo {
  taxRegistrationNumberType: TaxRegistrationNumberType;
}
export const RomaniaAdditionalInfo = S.suspend(() =>
  S.Struct({ taxRegistrationNumberType: TaxRegistrationNumberType }),
).annotations({
  identifier: "RomaniaAdditionalInfo",
}) as any as S.Schema<RomaniaAdditionalInfo>;
export type UkraineTrnType = "Business" | "Individual";
export const UkraineTrnType = S.Literal("Business", "Individual");
export interface UkraineAdditionalInfo {
  ukraineTrnType: UkraineTrnType;
}
export const UkraineAdditionalInfo = S.suspend(() =>
  S.Struct({ ukraineTrnType: UkraineTrnType }),
).annotations({
  identifier: "UkraineAdditionalInfo",
}) as any as S.Schema<UkraineAdditionalInfo>;
export interface PolandAdditionalInfo {
  individualRegistrationNumber?: string;
  isGroupVatEnabled?: boolean;
}
export const PolandAdditionalInfo = S.suspend(() =>
  S.Struct({
    individualRegistrationNumber: S.optional(S.String),
    isGroupVatEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PolandAdditionalInfo",
}) as any as S.Schema<PolandAdditionalInfo>;
export type SaudiArabiaTaxRegistrationNumberType =
  | "TaxRegistrationNumber"
  | "TaxIdentificationNumber"
  | "CommercialRegistrationNumber";
export const SaudiArabiaTaxRegistrationNumberType = S.Literal(
  "TaxRegistrationNumber",
  "TaxIdentificationNumber",
  "CommercialRegistrationNumber",
);
export interface SaudiArabiaAdditionalInfo {
  taxRegistrationNumberType?: SaudiArabiaTaxRegistrationNumberType;
}
export const SaudiArabiaAdditionalInfo = S.suspend(() =>
  S.Struct({
    taxRegistrationNumberType: S.optional(SaudiArabiaTaxRegistrationNumberType),
  }),
).annotations({
  identifier: "SaudiArabiaAdditionalInfo",
}) as any as S.Schema<SaudiArabiaAdditionalInfo>;
export type IndonesiaTaxRegistrationNumberType =
  | "NIK"
  | "PassportNumber"
  | "NPWP"
  | "NITKU";
export const IndonesiaTaxRegistrationNumberType = S.Literal(
  "NIK",
  "PassportNumber",
  "NPWP",
  "NITKU",
);
export interface IndonesiaAdditionalInfo {
  taxRegistrationNumberType?: IndonesiaTaxRegistrationNumberType;
  ppnExceptionDesignationCode?: string;
  decisionNumber?: string;
}
export const IndonesiaAdditionalInfo = S.suspend(() =>
  S.Struct({
    taxRegistrationNumberType: S.optional(IndonesiaTaxRegistrationNumberType),
    ppnExceptionDesignationCode: S.optional(S.String),
    decisionNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "IndonesiaAdditionalInfo",
}) as any as S.Schema<IndonesiaAdditionalInfo>;
export interface VietnamAdditionalInfo {
  enterpriseIdentificationNumber?: string;
  electronicTransactionCodeNumber?: string;
  paymentVoucherNumber?: string;
  paymentVoucherNumberDate?: string;
}
export const VietnamAdditionalInfo = S.suspend(() =>
  S.Struct({
    enterpriseIdentificationNumber: S.optional(S.String),
    electronicTransactionCodeNumber: S.optional(S.String),
    paymentVoucherNumber: S.optional(S.String),
    paymentVoucherNumberDate: S.optional(S.String),
  }),
).annotations({
  identifier: "VietnamAdditionalInfo",
}) as any as S.Schema<VietnamAdditionalInfo>;
export interface EgyptAdditionalInfo {
  uniqueIdentificationNumber?: string;
  uniqueIdentificationNumberExpirationDate?: string;
}
export const EgyptAdditionalInfo = S.suspend(() =>
  S.Struct({
    uniqueIdentificationNumber: S.optional(S.String),
    uniqueIdentificationNumberExpirationDate: S.optional(S.String),
  }),
).annotations({
  identifier: "EgyptAdditionalInfo",
}) as any as S.Schema<EgyptAdditionalInfo>;
export interface GreeceAdditionalInfo {
  contractingAuthorityCode?: string;
}
export const GreeceAdditionalInfo = S.suspend(() =>
  S.Struct({ contractingAuthorityCode: S.optional(S.String) }),
).annotations({
  identifier: "GreeceAdditionalInfo",
}) as any as S.Schema<GreeceAdditionalInfo>;
export type UzbekistanTaxRegistrationNumberType = "Business" | "Individual";
export const UzbekistanTaxRegistrationNumberType = S.Literal(
  "Business",
  "Individual",
);
export interface UzbekistanAdditionalInfo {
  taxRegistrationNumberType?: UzbekistanTaxRegistrationNumberType;
  vatRegistrationNumber?: string;
}
export const UzbekistanAdditionalInfo = S.suspend(() =>
  S.Struct({
    taxRegistrationNumberType: S.optional(UzbekistanTaxRegistrationNumberType),
    vatRegistrationNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "UzbekistanAdditionalInfo",
}) as any as S.Schema<UzbekistanAdditionalInfo>;
export interface AdditionalInfoRequest {
  malaysiaAdditionalInfo?: MalaysiaAdditionalInfo;
  israelAdditionalInfo?: IsraelAdditionalInfo;
  estoniaAdditionalInfo?: EstoniaAdditionalInfo;
  canadaAdditionalInfo?: CanadaAdditionalInfo;
  spainAdditionalInfo?: SpainAdditionalInfo;
  kenyaAdditionalInfo?: KenyaAdditionalInfo;
  southKoreaAdditionalInfo?: SouthKoreaAdditionalInfo;
  turkeyAdditionalInfo?: TurkeyAdditionalInfo;
  georgiaAdditionalInfo?: GeorgiaAdditionalInfo;
  italyAdditionalInfo?: ItalyAdditionalInfo;
  romaniaAdditionalInfo?: RomaniaAdditionalInfo;
  ukraineAdditionalInfo?: UkraineAdditionalInfo;
  polandAdditionalInfo?: PolandAdditionalInfo;
  saudiArabiaAdditionalInfo?: SaudiArabiaAdditionalInfo;
  indonesiaAdditionalInfo?: IndonesiaAdditionalInfo;
  vietnamAdditionalInfo?: VietnamAdditionalInfo;
  egyptAdditionalInfo?: EgyptAdditionalInfo;
  greeceAdditionalInfo?: GreeceAdditionalInfo;
  uzbekistanAdditionalInfo?: UzbekistanAdditionalInfo;
}
export const AdditionalInfoRequest = S.suspend(() =>
  S.Struct({
    malaysiaAdditionalInfo: S.optional(MalaysiaAdditionalInfo),
    israelAdditionalInfo: S.optional(IsraelAdditionalInfo),
    estoniaAdditionalInfo: S.optional(EstoniaAdditionalInfo),
    canadaAdditionalInfo: S.optional(CanadaAdditionalInfo),
    spainAdditionalInfo: S.optional(SpainAdditionalInfo),
    kenyaAdditionalInfo: S.optional(KenyaAdditionalInfo),
    southKoreaAdditionalInfo: S.optional(SouthKoreaAdditionalInfo),
    turkeyAdditionalInfo: S.optional(TurkeyAdditionalInfo),
    georgiaAdditionalInfo: S.optional(GeorgiaAdditionalInfo),
    italyAdditionalInfo: S.optional(ItalyAdditionalInfo),
    romaniaAdditionalInfo: S.optional(RomaniaAdditionalInfo),
    ukraineAdditionalInfo: S.optional(UkraineAdditionalInfo),
    polandAdditionalInfo: S.optional(PolandAdditionalInfo),
    saudiArabiaAdditionalInfo: S.optional(SaudiArabiaAdditionalInfo),
    indonesiaAdditionalInfo: S.optional(IndonesiaAdditionalInfo),
    vietnamAdditionalInfo: S.optional(VietnamAdditionalInfo),
    egyptAdditionalInfo: S.optional(EgyptAdditionalInfo),
    greeceAdditionalInfo: S.optional(GreeceAdditionalInfo),
    uzbekistanAdditionalInfo: S.optional(UzbekistanAdditionalInfo),
  }),
).annotations({
  identifier: "AdditionalInfoRequest",
}) as any as S.Schema<AdditionalInfoRequest>;
export interface SourceS3Location {
  bucket: string;
  key: string;
}
export const SourceS3Location = S.suspend(() =>
  S.Struct({ bucket: S.String, key: S.String }),
).annotations({
  identifier: "SourceS3Location",
}) as any as S.Schema<SourceS3Location>;
export interface TaxRegistrationDocFile {
  fileName: string;
  fileContent: Uint8Array;
}
export const TaxRegistrationDocFile = S.suspend(() =>
  S.Struct({ fileName: S.String, fileContent: T.Blob }),
).annotations({
  identifier: "TaxRegistrationDocFile",
}) as any as S.Schema<TaxRegistrationDocFile>;
export interface TaxRegistrationDocument {
  s3Location?: SourceS3Location;
  file?: TaxRegistrationDocFile;
}
export const TaxRegistrationDocument = S.suspend(() =>
  S.Struct({
    s3Location: S.optional(SourceS3Location),
    file: S.optional(TaxRegistrationDocFile),
  }),
).annotations({
  identifier: "TaxRegistrationDocument",
}) as any as S.Schema<TaxRegistrationDocument>;
export type TaxRegistrationDocuments = TaxRegistrationDocument[];
export const TaxRegistrationDocuments = S.Array(TaxRegistrationDocument);
export interface VerificationDetails {
  dateOfBirth?: string;
  taxRegistrationDocuments?: TaxRegistrationDocument[];
}
export const VerificationDetails = S.suspend(() =>
  S.Struct({
    dateOfBirth: S.optional(S.String),
    taxRegistrationDocuments: S.optional(TaxRegistrationDocuments),
  }),
).annotations({
  identifier: "VerificationDetails",
}) as any as S.Schema<VerificationDetails>;
export interface TaxRegistrationEntry {
  registrationId: string;
  registrationType: TaxRegistrationType;
  legalName?: string;
  legalAddress?: Address;
  sector?: Sector;
  additionalTaxInformation?: AdditionalInfoRequest;
  verificationDetails?: VerificationDetails;
  certifiedEmailId?: string;
}
export const TaxRegistrationEntry = S.suspend(() =>
  S.Struct({
    registrationId: S.String,
    registrationType: TaxRegistrationType,
    legalName: S.optional(S.String),
    legalAddress: S.optional(Address),
    sector: S.optional(Sector),
    additionalTaxInformation: S.optional(AdditionalInfoRequest),
    verificationDetails: S.optional(VerificationDetails),
    certifiedEmailId: S.optional(S.String),
  }),
).annotations({
  identifier: "TaxRegistrationEntry",
}) as any as S.Schema<TaxRegistrationEntry>;
export interface PutTaxRegistrationRequest {
  accountId?: string;
  taxRegistrationEntry: TaxRegistrationEntry;
}
export const PutTaxRegistrationRequest = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    taxRegistrationEntry: TaxRegistrationEntry,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutTaxRegistration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTaxRegistrationRequest",
}) as any as S.Schema<PutTaxRegistrationRequest>;
export interface Authority {
  country: string;
  state?: string;
}
export const Authority = S.suspend(() =>
  S.Struct({ country: S.String, state: S.optional(S.String) }),
).annotations({ identifier: "Authority" }) as any as S.Schema<Authority>;
export type Authorities = Authority[];
export const Authorities = S.Array(Authority);
export type SupplementalTaxRegistrationType = "VAT";
export const SupplementalTaxRegistrationType = S.Literal("VAT");
export interface TaxExemptionType {
  displayName?: string;
  description?: string;
  applicableJurisdictions?: Authority[];
}
export const TaxExemptionType = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    applicableJurisdictions: S.optional(Authorities),
  }),
).annotations({
  identifier: "TaxExemptionType",
}) as any as S.Schema<TaxExemptionType>;
export type TaxExemptionTypes = TaxExemptionType[];
export const TaxExemptionTypes = S.Array(TaxExemptionType);
export interface DestinationS3Location {
  bucket: string;
  prefix?: string;
}
export const DestinationS3Location = S.suspend(() =>
  S.Struct({ bucket: S.String, prefix: S.optional(S.String) }),
).annotations({
  identifier: "DestinationS3Location",
}) as any as S.Schema<DestinationS3Location>;
export interface TaxDocumentMetadata {
  taxDocumentAccessToken: string;
  taxDocumentName: string;
}
export const TaxDocumentMetadata = S.suspend(() =>
  S.Struct({ taxDocumentAccessToken: S.String, taxDocumentName: S.String }),
).annotations({
  identifier: "TaxDocumentMetadata",
}) as any as S.Schema<TaxDocumentMetadata>;
export interface SupplementalTaxRegistrationEntry {
  registrationId: string;
  registrationType: SupplementalTaxRegistrationType;
  legalName: string;
  address: Address;
}
export const SupplementalTaxRegistrationEntry = S.suspend(() =>
  S.Struct({
    registrationId: S.String,
    registrationType: SupplementalTaxRegistrationType,
    legalName: S.String,
    address: Address,
  }),
).annotations({
  identifier: "SupplementalTaxRegistrationEntry",
}) as any as S.Schema<SupplementalTaxRegistrationEntry>;
export interface ExemptionCertificate {
  documentName: string;
  documentFile: Uint8Array;
}
export const ExemptionCertificate = S.suspend(() =>
  S.Struct({ documentName: S.String, documentFile: T.Blob }),
).annotations({
  identifier: "ExemptionCertificate",
}) as any as S.Schema<ExemptionCertificate>;
export type TaxRegistrationStatus =
  | "Verified"
  | "Pending"
  | "Deleted"
  | "Rejected";
export const TaxRegistrationStatus = S.Literal(
  "Verified",
  "Pending",
  "Deleted",
  "Rejected",
);
export interface GetTaxExemptionTypesResponse {
  taxExemptionTypes?: TaxExemptionType[];
}
export const GetTaxExemptionTypesResponse = S.suspend(() =>
  S.Struct({ taxExemptionTypes: S.optional(TaxExemptionTypes) }),
).annotations({
  identifier: "GetTaxExemptionTypesResponse",
}) as any as S.Schema<GetTaxExemptionTypesResponse>;
export interface GetTaxRegistrationDocumentRequest {
  destinationS3Location?: DestinationS3Location;
  taxDocumentMetadata: TaxDocumentMetadata;
}
export const GetTaxRegistrationDocumentRequest = S.suspend(() =>
  S.Struct({
    destinationS3Location: S.optional(DestinationS3Location),
    taxDocumentMetadata: TaxDocumentMetadata,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTaxRegistrationDocument" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTaxRegistrationDocumentRequest",
}) as any as S.Schema<GetTaxRegistrationDocumentRequest>;
export type EntityExemptionAccountStatus =
  | "None"
  | "Valid"
  | "Expired"
  | "Pending";
export const EntityExemptionAccountStatus = S.Literal(
  "None",
  "Valid",
  "Expired",
  "Pending",
);
export interface TaxExemption {
  authority: Authority;
  taxExemptionType: TaxExemptionType;
  effectiveDate?: Date;
  expirationDate?: Date;
  systemEffectiveDate?: Date;
  status?: EntityExemptionAccountStatus;
}
export const TaxExemption = S.suspend(() =>
  S.Struct({
    authority: Authority,
    taxExemptionType: TaxExemptionType,
    effectiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    systemEffectiveDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(EntityExemptionAccountStatus),
  }),
).annotations({ identifier: "TaxExemption" }) as any as S.Schema<TaxExemption>;
export type TaxExemptions = TaxExemption[];
export const TaxExemptions = S.Array(TaxExemption);
export interface TaxExemptionDetails {
  taxExemptions?: TaxExemption[];
  heritageObtainedDetails?: boolean;
  heritageObtainedParentEntity?: string;
  heritageObtainedReason?: string;
}
export const TaxExemptionDetails = S.suspend(() =>
  S.Struct({
    taxExemptions: S.optional(TaxExemptions),
    heritageObtainedDetails: S.optional(S.Boolean),
    heritageObtainedParentEntity: S.optional(S.String),
    heritageObtainedReason: S.optional(S.String),
  }),
).annotations({
  identifier: "TaxExemptionDetails",
}) as any as S.Schema<TaxExemptionDetails>;
export type TaxExemptionDetailsMap = { [key: string]: TaxExemptionDetails };
export const TaxExemptionDetailsMap = S.Record({
  key: S.String,
  value: TaxExemptionDetails,
});
export interface ListTaxExemptionsResponse {
  nextToken?: string;
  taxExemptionDetailsMap?: { [key: string]: TaxExemptionDetails };
}
export const ListTaxExemptionsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    taxExemptionDetailsMap: S.optional(TaxExemptionDetailsMap),
  }),
).annotations({
  identifier: "ListTaxExemptionsResponse",
}) as any as S.Schema<ListTaxExemptionsResponse>;
export interface PutSupplementalTaxRegistrationRequest {
  taxRegistrationEntry: SupplementalTaxRegistrationEntry;
}
export const PutSupplementalTaxRegistrationRequest = S.suspend(() =>
  S.Struct({ taxRegistrationEntry: SupplementalTaxRegistrationEntry }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutSupplementalTaxRegistration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutSupplementalTaxRegistrationRequest",
}) as any as S.Schema<PutSupplementalTaxRegistrationRequest>;
export interface PutTaxExemptionRequest {
  accountIds: string[];
  authority: Authority;
  exemptionType: string;
  exemptionCertificate: ExemptionCertificate;
}
export const PutTaxExemptionRequest = S.suspend(() =>
  S.Struct({
    accountIds: AccountIds,
    authority: Authority,
    exemptionType: S.String,
    exemptionCertificate: ExemptionCertificate,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutTaxExemption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTaxExemptionRequest",
}) as any as S.Schema<PutTaxExemptionRequest>;
export interface PutTaxRegistrationResponse {
  status?: TaxRegistrationStatus;
}
export const PutTaxRegistrationResponse = S.suspend(() =>
  S.Struct({ status: S.optional(TaxRegistrationStatus) }),
).annotations({
  identifier: "PutTaxRegistrationResponse",
}) as any as S.Schema<PutTaxRegistrationResponse>;
export type TaxDocumentMetadatas = TaxDocumentMetadata[];
export const TaxDocumentMetadatas = S.Array(TaxDocumentMetadata);
export interface BatchDeleteTaxRegistrationError {
  accountId: string;
  message: string | redacted.Redacted<string>;
  code?: string;
}
export const BatchDeleteTaxRegistrationError = S.suspend(() =>
  S.Struct({
    accountId: S.String,
    message: SensitiveString,
    code: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchDeleteTaxRegistrationError",
}) as any as S.Schema<BatchDeleteTaxRegistrationError>;
export type BatchDeleteTaxRegistrationErrors =
  BatchDeleteTaxRegistrationError[];
export const BatchDeleteTaxRegistrationErrors = S.Array(
  BatchDeleteTaxRegistrationError,
);
export interface SupplementalTaxRegistration {
  registrationId: string;
  registrationType: SupplementalTaxRegistrationType;
  legalName: string;
  address: Address;
  authorityId: string;
  status: TaxRegistrationStatus;
}
export const SupplementalTaxRegistration = S.suspend(() =>
  S.Struct({
    registrationId: S.String,
    registrationType: SupplementalTaxRegistrationType,
    legalName: S.String,
    address: Address,
    authorityId: S.String,
    status: TaxRegistrationStatus,
  }),
).annotations({
  identifier: "SupplementalTaxRegistration",
}) as any as S.Schema<SupplementalTaxRegistration>;
export type SupplementalTaxRegistrationList = SupplementalTaxRegistration[];
export const SupplementalTaxRegistrationList = S.Array(
  SupplementalTaxRegistration,
);
export type ValidationExceptionErrorCode =
  | "MalformedToken"
  | "ExpiredToken"
  | "InvalidToken"
  | "FieldValidationFailed"
  | "MissingInput";
export const ValidationExceptionErrorCode = S.Literal(
  "MalformedToken",
  "ExpiredToken",
  "InvalidToken",
  "FieldValidationFailed",
  "MissingInput",
);
export type AddressRoleType =
  | "TaxAddress"
  | "BillingAddress"
  | "ContactAddress";
export const AddressRoleType = S.Literal(
  "TaxAddress",
  "BillingAddress",
  "ContactAddress",
);
export interface BatchDeleteTaxRegistrationResponse {
  errors: BatchDeleteTaxRegistrationError[];
}
export const BatchDeleteTaxRegistrationResponse = S.suspend(() =>
  S.Struct({ errors: BatchDeleteTaxRegistrationErrors }),
).annotations({
  identifier: "BatchDeleteTaxRegistrationResponse",
}) as any as S.Schema<BatchDeleteTaxRegistrationResponse>;
export interface GetTaxRegistrationDocumentResponse {
  destinationFilePath?: string;
  presignedS3Url?: string;
}
export const GetTaxRegistrationDocumentResponse = S.suspend(() =>
  S.Struct({
    destinationFilePath: S.optional(S.String),
    presignedS3Url: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTaxRegistrationDocumentResponse",
}) as any as S.Schema<GetTaxRegistrationDocumentResponse>;
export interface ListSupplementalTaxRegistrationsResponse {
  taxRegistrations: SupplementalTaxRegistration[];
  nextToken?: string;
}
export const ListSupplementalTaxRegistrationsResponse = S.suspend(() =>
  S.Struct({
    taxRegistrations: SupplementalTaxRegistrationList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSupplementalTaxRegistrationsResponse",
}) as any as S.Schema<ListSupplementalTaxRegistrationsResponse>;
export interface PutSupplementalTaxRegistrationResponse {
  authorityId: string;
  status: TaxRegistrationStatus;
}
export const PutSupplementalTaxRegistrationResponse = S.suspend(() =>
  S.Struct({ authorityId: S.String, status: TaxRegistrationStatus }),
).annotations({
  identifier: "PutSupplementalTaxRegistrationResponse",
}) as any as S.Schema<PutSupplementalTaxRegistrationResponse>;
export interface PutTaxExemptionResponse {
  caseId?: string;
}
export const PutTaxExemptionResponse = S.suspend(() =>
  S.Struct({ caseId: S.optional(S.String) }),
).annotations({
  identifier: "PutTaxExemptionResponse",
}) as any as S.Schema<PutTaxExemptionResponse>;
export interface TaxInheritanceDetails {
  parentEntityId?: string;
  inheritanceObtainedReason?: string;
}
export const TaxInheritanceDetails = S.suspend(() =>
  S.Struct({
    parentEntityId: S.optional(S.String),
    inheritanceObtainedReason: S.optional(S.String),
  }),
).annotations({
  identifier: "TaxInheritanceDetails",
}) as any as S.Schema<TaxInheritanceDetails>;
export interface ValidationExceptionField {
  name: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface BrazilAdditionalInfo {
  ccmCode?: string;
  legalNatureCode?: string;
}
export const BrazilAdditionalInfo = S.suspend(() =>
  S.Struct({
    ccmCode: S.optional(S.String),
    legalNatureCode: S.optional(S.String),
  }),
).annotations({
  identifier: "BrazilAdditionalInfo",
}) as any as S.Schema<BrazilAdditionalInfo>;
export interface IndiaAdditionalInfo {
  pan?: string;
}
export const IndiaAdditionalInfo = S.suspend(() =>
  S.Struct({ pan: S.optional(S.String) }),
).annotations({
  identifier: "IndiaAdditionalInfo",
}) as any as S.Schema<IndiaAdditionalInfo>;
export interface Jurisdiction {
  stateOrRegion?: string;
  countryCode: string;
}
export const Jurisdiction = S.suspend(() =>
  S.Struct({ stateOrRegion: S.optional(S.String), countryCode: S.String }),
).annotations({ identifier: "Jurisdiction" }) as any as S.Schema<Jurisdiction>;
export type AddressRoleMap = { [key in AddressRoleType]?: Jurisdiction };
export const AddressRoleMap = S.partial(
  S.Record({ key: AddressRoleType, value: Jurisdiction }),
);
export interface AdditionalInfoResponse {
  malaysiaAdditionalInfo?: MalaysiaAdditionalInfo;
  israelAdditionalInfo?: IsraelAdditionalInfo;
  estoniaAdditionalInfo?: EstoniaAdditionalInfo;
  canadaAdditionalInfo?: CanadaAdditionalInfo;
  brazilAdditionalInfo?: BrazilAdditionalInfo;
  spainAdditionalInfo?: SpainAdditionalInfo;
  kenyaAdditionalInfo?: KenyaAdditionalInfo;
  southKoreaAdditionalInfo?: SouthKoreaAdditionalInfo;
  turkeyAdditionalInfo?: TurkeyAdditionalInfo;
  georgiaAdditionalInfo?: GeorgiaAdditionalInfo;
  italyAdditionalInfo?: ItalyAdditionalInfo;
  romaniaAdditionalInfo?: RomaniaAdditionalInfo;
  ukraineAdditionalInfo?: UkraineAdditionalInfo;
  polandAdditionalInfo?: PolandAdditionalInfo;
  saudiArabiaAdditionalInfo?: SaudiArabiaAdditionalInfo;
  indiaAdditionalInfo?: IndiaAdditionalInfo;
  indonesiaAdditionalInfo?: IndonesiaAdditionalInfo;
  vietnamAdditionalInfo?: VietnamAdditionalInfo;
  egyptAdditionalInfo?: EgyptAdditionalInfo;
  greeceAdditionalInfo?: GreeceAdditionalInfo;
  uzbekistanAdditionalInfo?: UzbekistanAdditionalInfo;
}
export const AdditionalInfoResponse = S.suspend(() =>
  S.Struct({
    malaysiaAdditionalInfo: S.optional(MalaysiaAdditionalInfo),
    israelAdditionalInfo: S.optional(IsraelAdditionalInfo),
    estoniaAdditionalInfo: S.optional(EstoniaAdditionalInfo),
    canadaAdditionalInfo: S.optional(CanadaAdditionalInfo),
    brazilAdditionalInfo: S.optional(BrazilAdditionalInfo),
    spainAdditionalInfo: S.optional(SpainAdditionalInfo),
    kenyaAdditionalInfo: S.optional(KenyaAdditionalInfo),
    southKoreaAdditionalInfo: S.optional(SouthKoreaAdditionalInfo),
    turkeyAdditionalInfo: S.optional(TurkeyAdditionalInfo),
    georgiaAdditionalInfo: S.optional(GeorgiaAdditionalInfo),
    italyAdditionalInfo: S.optional(ItalyAdditionalInfo),
    romaniaAdditionalInfo: S.optional(RomaniaAdditionalInfo),
    ukraineAdditionalInfo: S.optional(UkraineAdditionalInfo),
    polandAdditionalInfo: S.optional(PolandAdditionalInfo),
    saudiArabiaAdditionalInfo: S.optional(SaudiArabiaAdditionalInfo),
    indiaAdditionalInfo: S.optional(IndiaAdditionalInfo),
    indonesiaAdditionalInfo: S.optional(IndonesiaAdditionalInfo),
    vietnamAdditionalInfo: S.optional(VietnamAdditionalInfo),
    egyptAdditionalInfo: S.optional(EgyptAdditionalInfo),
    greeceAdditionalInfo: S.optional(GreeceAdditionalInfo),
    uzbekistanAdditionalInfo: S.optional(UzbekistanAdditionalInfo),
  }),
).annotations({
  identifier: "AdditionalInfoResponse",
}) as any as S.Schema<AdditionalInfoResponse>;
export interface TaxRegistrationWithJurisdiction {
  registrationId: string;
  registrationType: TaxRegistrationType;
  legalName: string;
  status: TaxRegistrationStatus;
  sector?: Sector;
  taxDocumentMetadatas?: TaxDocumentMetadata[];
  certifiedEmailId?: string;
  additionalTaxInformation?: AdditionalInfoResponse;
  jurisdiction: Jurisdiction;
}
export const TaxRegistrationWithJurisdiction = S.suspend(() =>
  S.Struct({
    registrationId: S.String,
    registrationType: TaxRegistrationType,
    legalName: S.String,
    status: TaxRegistrationStatus,
    sector: S.optional(Sector),
    taxDocumentMetadatas: S.optional(TaxDocumentMetadatas),
    certifiedEmailId: S.optional(S.String),
    additionalTaxInformation: S.optional(AdditionalInfoResponse),
    jurisdiction: Jurisdiction,
  }),
).annotations({
  identifier: "TaxRegistrationWithJurisdiction",
}) as any as S.Schema<TaxRegistrationWithJurisdiction>;
export interface AccountMetaData {
  accountName?: string;
  seller?: string;
  address?: Address;
  addressType?: AddressRoleType;
  addressRoleMap?: { [key: string]: Jurisdiction };
}
export const AccountMetaData = S.suspend(() =>
  S.Struct({
    accountName: S.optional(S.String),
    seller: S.optional(S.String),
    address: S.optional(Address),
    addressType: S.optional(AddressRoleType),
    addressRoleMap: S.optional(AddressRoleMap),
  }),
).annotations({
  identifier: "AccountMetaData",
}) as any as S.Schema<AccountMetaData>;
export interface TaxRegistration {
  registrationId: string;
  registrationType: TaxRegistrationType;
  legalName: string;
  status: TaxRegistrationStatus;
  sector?: Sector;
  taxDocumentMetadatas?: TaxDocumentMetadata[];
  certifiedEmailId?: string;
  additionalTaxInformation?: AdditionalInfoResponse;
  legalAddress: Address;
}
export const TaxRegistration = S.suspend(() =>
  S.Struct({
    registrationId: S.String,
    registrationType: TaxRegistrationType,
    legalName: S.String,
    status: TaxRegistrationStatus,
    sector: S.optional(Sector),
    taxDocumentMetadatas: S.optional(TaxDocumentMetadatas),
    certifiedEmailId: S.optional(S.String),
    additionalTaxInformation: S.optional(AdditionalInfoResponse),
    legalAddress: Address,
  }),
).annotations({
  identifier: "TaxRegistration",
}) as any as S.Schema<TaxRegistration>;
export interface AccountDetails {
  accountId?: string;
  taxRegistration?: TaxRegistrationWithJurisdiction;
  taxInheritanceDetails?: TaxInheritanceDetails;
  accountMetaData?: AccountMetaData;
}
export const AccountDetails = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    taxRegistration: S.optional(TaxRegistrationWithJurisdiction),
    taxInheritanceDetails: S.optional(TaxInheritanceDetails),
    accountMetaData: S.optional(AccountMetaData),
  }),
).annotations({
  identifier: "AccountDetails",
}) as any as S.Schema<AccountDetails>;
export type AccountDetailsList = AccountDetails[];
export const AccountDetailsList = S.Array(AccountDetails);
export interface BatchGetTaxExemptionsResponse {
  taxExemptionDetailsMap?: { [key: string]: TaxExemptionDetails };
  failedAccounts?: string[];
}
export const BatchGetTaxExemptionsResponse = S.suspend(() =>
  S.Struct({
    taxExemptionDetailsMap: S.optional(TaxExemptionDetailsMap),
    failedAccounts: S.optional(AccountIds),
  }),
).annotations({
  identifier: "BatchGetTaxExemptionsResponse",
}) as any as S.Schema<BatchGetTaxExemptionsResponse>;
export interface BatchPutTaxRegistrationRequest {
  accountIds: string[];
  taxRegistrationEntry: TaxRegistrationEntry;
}
export const BatchPutTaxRegistrationRequest = S.suspend(() =>
  S.Struct({
    accountIds: AccountIds,
    taxRegistrationEntry: TaxRegistrationEntry,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchPutTaxRegistration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchPutTaxRegistrationRequest",
}) as any as S.Schema<BatchPutTaxRegistrationRequest>;
export interface GetTaxRegistrationResponse {
  taxRegistration?: TaxRegistration;
}
export const GetTaxRegistrationResponse = S.suspend(() =>
  S.Struct({ taxRegistration: S.optional(TaxRegistration) }),
).annotations({
  identifier: "GetTaxRegistrationResponse",
}) as any as S.Schema<GetTaxRegistrationResponse>;
export interface ListTaxRegistrationsResponse {
  accountDetails: AccountDetails[];
  nextToken?: string;
}
export const ListTaxRegistrationsResponse = S.suspend(() =>
  S.Struct({
    accountDetails: AccountDetailsList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTaxRegistrationsResponse",
}) as any as S.Schema<ListTaxRegistrationsResponse>;
export interface BatchPutTaxRegistrationError {
  accountId: string;
  message: string | redacted.Redacted<string>;
  code?: string;
}
export const BatchPutTaxRegistrationError = S.suspend(() =>
  S.Struct({
    accountId: S.String,
    message: SensitiveString,
    code: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchPutTaxRegistrationError",
}) as any as S.Schema<BatchPutTaxRegistrationError>;
export type BatchPutTaxRegistrationErrors = BatchPutTaxRegistrationError[];
export const BatchPutTaxRegistrationErrors = S.Array(
  BatchPutTaxRegistrationError,
);
export interface BatchPutTaxRegistrationResponse {
  status?: TaxRegistrationStatus;
  errors: BatchPutTaxRegistrationError[];
}
export const BatchPutTaxRegistrationResponse = S.suspend(() =>
  S.Struct({
    status: S.optional(TaxRegistrationStatus),
    errors: BatchPutTaxRegistrationErrors,
  }),
).annotations({
  identifier: "BatchPutTaxRegistrationResponse",
}) as any as S.Schema<BatchPutTaxRegistrationResponse>;

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: SensitiveString, errorCode: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: SensitiveString, errorCode: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: SensitiveString, errorCode: S.String },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: SensitiveString },
).pipe(C.withAuthError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: SensitiveString,
    errorCode: ValidationExceptionErrorCode,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class AttachmentUploadException extends S.TaggedError<AttachmentUploadException>()(
  "AttachmentUploadException",
  { message: SensitiveString },
).pipe(C.withBadRequestError) {}
export class CaseCreationLimitExceededException extends S.TaggedError<CaseCreationLimitExceededException>()(
  "CaseCreationLimitExceededException",
  { message: SensitiveString },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Adds or updates tax registration for a single account. You can't set a TRN if there's a pending TRN. You'll need to delete the pending TRN first.
 *
 * To call this API operation for specific countries, see the following country-specific
 * requirements.
 *
 * **Bangladesh**
 *
 * - You must specify the tax registration certificate document in the
 * `taxRegistrationDocuments` field of the `VerificationDetails`
 * object.
 *
 * **Brazil**
 *
 * - You must complete the tax registration process in the Payment preferences page in the Billing and Cost Management console. After your TRN and billing address are verified, you can call this API operation.
 *
 * - For Amazon Web Services accounts created through Organizations, you can call this API operation when you don't have a billing address.
 *
 * **Georgia**
 *
 * - The valid `personType` values are `Physical Person` and `Business`.
 *
 * **Indonesia**
 *
 * - `PutTaxRegistration`: The use of this operation to submit tax information is subject to the Amazon Web Services service terms. By submitting, you’re providing consent for Amazon Web Services to validate NIK, NPWP, and NITKU data, provided by you with the Directorate General of Taxes of Indonesia in accordance with the Minister of Finance Regulation (PMK) Number 112/PMK.03/2022.
 *
 * - `BatchPutTaxRegistration`: The use of this operation to submit tax information is subject to the Amazon Web Services service terms. By submitting, you’re providing consent for Amazon Web Services to validate NIK, NPWP, and NITKU data, provided by you with the Directorate General of Taxes of Indonesia in accordance with the Minister of Finance Regulation (PMK) Number 112/PMK.03/2022, through our third-party partner PT Achilles Advanced Management (OnlinePajak).
 *
 * - You must specify the `taxRegistrationNumberType` in the `indonesiaAdditionalInfo` field of the `additionalTaxInformation` object.
 *
 * - If you specify `decisionNumber`, you must specify the `ppnExceptionDesignationCode` in the `indonesiaAdditionalInfo` field of the `additionalTaxInformation` object. If the `taxRegistrationNumberType` is set to NPWP or NITKU, valid values for `ppnExceptionDesignationCode` are either `01`, `02`, `03`, `07`, or `08`.
 *
 * For other `taxRegistrationNumberType` values, `ppnExceptionDesignationCode` must be either `01`, `07`, or `08`.
 *
 * - If `ppnExceptionDesignationCode` is `07`, you must specify the `decisionNumber` in the `indonesiaAdditionalInfo` field of the `additionalTaxInformation` object.
 *
 * **Kenya**
 *
 * - You must specify the `personType` in the `kenyaAdditionalInfo`
 * field of the `additionalTaxInformation` object.
 *
 * - If the `personType` is `Physical Person`, you must specify the
 * tax registration certificate document in the `taxRegistrationDocuments` field
 * of the `VerificationDetails` object.
 *
 * **Malaysia**
 *
 * - The sector valid values are `Business` and `Individual`.
 *
 * - `RegistrationType` valid values are `NRIC` for individual, and TIN and sales and service tax (SST) for Business.
 *
 * - For individual, you can specify the `taxInformationNumber` in `MalaysiaAdditionalInfo` with NRIC type, and a valid `MyKad` or NRIC number.
 *
 * - For business, you must specify a `businessRegistrationNumber` in `MalaysiaAdditionalInfo` with a TIN type and tax identification number.
 *
 * - For business resellers, you must specify a `businessRegistrationNumber` and `taxInformationNumber` in `MalaysiaAdditionalInfo` with a sales and service tax (SST) type and a valid SST number.
 *
 * - For business resellers with service codes, you must specify `businessRegistrationNumber`, `taxInformationNumber`, and distinct `serviceTaxCodes` in `MalaysiaAdditionalInfo` with a SST type and valid sales and service tax (SST) number. By using this API operation, Amazon Web Services registers your self-declaration that you’re an authorized business reseller registered with the Royal Malaysia Customs Department (RMCD), and have a valid SST number.
 *
 * - Amazon Web Services reserves the right to seek additional information and/or take other actions to
 * support your self-declaration as appropriate.
 *
 * - Amazon Web Services is currently registered under the following service tax codes. You must include
 * at least one of the service tax codes in the service tax code strings to declare yourself
 * as an authorized registered business reseller.
 *
 * Taxable service and service tax codes:
 *
 * Consultancy - 9907061674
 *
 * Training or coaching service - 9907071685
 *
 * IT service - 9907101676
 *
 * Digital services and electronic medium - 9907121690
 *
 * **Nepal**
 *
 * - The sector valid values are `Business` and `Individual`.
 *
 * **Saudi Arabia**
 *
 * - For `address`, you must specify `addressLine3`.
 *
 * **South Korea**
 *
 * - You must specify the `certifiedEmailId` and `legalName` in the
 * `TaxRegistrationEntry` object. Use Korean characters for
 * `legalName`.
 *
 * - You must specify the `businessRepresentativeName`,
 * `itemOfBusiness`, and `lineOfBusiness` in the
 * `southKoreaAdditionalInfo` field of the `additionalTaxInformation`
 * object. Use Korean characters for these fields.
 *
 * - You must specify the tax registration certificate document in the
 * `taxRegistrationDocuments` field of the `VerificationDetails`
 * object.
 *
 * - For the `address` object, use Korean characters for `addressLine1`, `addressLine2`
 * `city`, `postalCode`, and `stateOrRegion`.
 *
 * **Spain**
 *
 * - You must specify the `registrationType` in the
 * `spainAdditionalInfo` field of the `additionalTaxInformation`
 * object.
 *
 * - If the `registrationType` is `Local`, you must specify the tax
 * registration certificate document in the `taxRegistrationDocuments` field of
 * the `VerificationDetails` object.
 *
 * **Turkey**
 *
 * - You must specify the `sector` in the `taxRegistrationEntry` object.
 *
 * - If your `sector` is `Business`, `Individual`, or
 * `Government`:
 *
 * - Specify the `taxOffice`. If your
 * `sector` is `Individual`, don't enter this value.
 *
 * - (Optional) Specify the `kepEmailId`. If your
 * `sector` is `Individual`, don't enter this value.
 *
 * - **Note:** In the **Tax Settings** page of the Billing console, `Government` appears as **Public institutions**
 *
 * - If your `sector` is `Business` and you're subject to KDV tax,
 * you must specify your industry in the `industries` field.
 *
 * - For `address`, you must specify `districtOrCounty`.
 *
 * **Ukraine**
 *
 * - The sector valid values are `Business` and `Individual`.
 */
export const putTaxRegistration: (
  input: PutTaxRegistrationRequest,
) => effect.Effect<
  PutTaxRegistrationResponse,
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTaxRegistrationRequest,
  output: PutTaxRegistrationResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Deletes tax registration for multiple accounts in batch. This can be used to delete tax
 * registrations for up to five accounts in one batch.
 *
 * This API operation can't be used to delete your tax registration in Brazil. Use the Payment preferences page in the Billing and Cost Management console instead.
 */
export const batchDeleteTaxRegistration: (
  input: BatchDeleteTaxRegistrationRequest,
) => effect.Effect<
  BatchDeleteTaxRegistrationResponse,
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteTaxRegistrationRequest,
  output: BatchDeleteTaxRegistrationResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * The get account tax inheritance status.
 */
export const getTaxInheritance: (
  input: GetTaxInheritanceRequest,
) => effect.Effect<
  GetTaxInheritanceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTaxInheritanceRequest,
  output: GetTaxInheritanceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Downloads your tax documents to the Amazon S3 bucket that you specify in your
 * request.
 */
export const getTaxRegistrationDocument: (
  input: GetTaxRegistrationDocumentRequest,
) => effect.Effect<
  GetTaxRegistrationDocumentResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTaxRegistrationDocumentRequest,
  output: GetTaxRegistrationDocumentResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Retrieves supplemental tax registrations for a single account.
 */
export const listSupplementalTaxRegistrations: {
  (
    input: ListSupplementalTaxRegistrationsRequest,
  ): effect.Effect<
    ListSupplementalTaxRegistrationsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSupplementalTaxRegistrationsRequest,
  ) => stream.Stream<
    ListSupplementalTaxRegistrationsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSupplementalTaxRegistrationsRequest,
  ) => stream.Stream<
    SupplementalTaxRegistration,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSupplementalTaxRegistrationsRequest,
  output: ListSupplementalTaxRegistrationsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "taxRegistrations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Stores supplemental tax registration for a single account.
 */
export const putSupplementalTaxRegistration: (
  input: PutSupplementalTaxRegistrationRequest,
) => effect.Effect<
  PutSupplementalTaxRegistrationResponse,
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSupplementalTaxRegistrationRequest,
  output: PutSupplementalTaxRegistrationResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Retrieves the tax exemption of accounts listed in a consolidated billing family. The IAM action is `tax:GetExemptions`.
 */
export const listTaxExemptions: {
  (
    input: ListTaxExemptionsRequest,
  ): effect.Effect<
    ListTaxExemptionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTaxExemptionsRequest,
  ) => stream.Stream<
    ListTaxExemptionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTaxExemptionsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTaxExemptionsRequest,
  output: ListTaxExemptionsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "taxExemptionDetailsMap",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes tax registration for a single account.
 *
 * This API operation can't be used to delete your tax registration in Brazil. Use the Payment preferences page in the Billing and Cost Management console instead.
 */
export const deleteTaxRegistration: (
  input: DeleteTaxRegistrationRequest,
) => effect.Effect<
  DeleteTaxRegistrationResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTaxRegistrationRequest,
  output: DeleteTaxRegistrationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * The updated tax inheritance status.
 */
export const putTaxInheritance: (
  input: PutTaxInheritanceRequest,
) => effect.Effect<
  PutTaxInheritanceResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTaxInheritanceRequest,
  output: PutTaxInheritanceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a supplemental tax registration for a single account.
 */
export const deleteSupplementalTaxRegistration: (
  input: DeleteSupplementalTaxRegistrationRequest,
) => effect.Effect<
  DeleteSupplementalTaxRegistrationResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSupplementalTaxRegistrationRequest,
  output: DeleteSupplementalTaxRegistrationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Get supported tax exemption types. The IAM action is `tax:GetExemptions`.
 */
export const getTaxExemptionTypes: (
  input: GetTaxExemptionTypesRequest,
) => effect.Effect<
  GetTaxExemptionTypesResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTaxExemptionTypesRequest,
  output: GetTaxExemptionTypesResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Get the active tax exemptions for a given list of accounts. The IAM action is `tax:GetExemptions`.
 */
export const batchGetTaxExemptions: (
  input: BatchGetTaxExemptionsRequest,
) => effect.Effect<
  BatchGetTaxExemptionsResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetTaxExemptionsRequest,
  output: BatchGetTaxExemptionsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves tax registration for a single account.
 */
export const getTaxRegistration: (
  input: GetTaxRegistrationRequest,
) => effect.Effect<
  GetTaxRegistrationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTaxRegistrationRequest,
  output: GetTaxRegistrationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves the tax registration of accounts listed in a consolidated billing family. This
 * can be used to retrieve up to 100 accounts' tax registrations in one call (default 50).
 */
export const listTaxRegistrations: {
  (
    input: ListTaxRegistrationsRequest,
  ): effect.Effect<
    ListTaxRegistrationsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTaxRegistrationsRequest,
  ) => stream.Stream<
    ListTaxRegistrationsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTaxRegistrationsRequest,
  ) => stream.Stream<
    AccountDetails,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTaxRegistrationsRequest,
  output: ListTaxRegistrationsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "accountDetails",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds the tax exemption for a single account or all accounts listed in a consolidated billing family. The IAM action is `tax:UpdateExemptions`.
 */
export const putTaxExemption: (
  input: PutTaxExemptionRequest,
) => effect.Effect<
  PutTaxExemptionResponse,
  | AccessDeniedException
  | AttachmentUploadException
  | CaseCreationLimitExceededException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTaxExemptionRequest,
  output: PutTaxExemptionResponse,
  errors: [
    AccessDeniedException,
    AttachmentUploadException,
    CaseCreationLimitExceededException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds or updates tax registration for multiple accounts in batch. This can be used to add
 * or update tax registrations for up to five accounts in one batch. You can't set a TRN if there's a pending TRN. You'll need to delete the pending TRN first.
 *
 * To call this API operation for specific countries, see the following country-specific
 * requirements.
 *
 * **Bangladesh**
 *
 * - You must specify the tax registration certificate document in the
 * `taxRegistrationDocuments` field of the `VerificationDetails`
 * object.
 *
 * **Brazil**
 *
 * - You must complete the tax registration process in the Payment preferences page in the Billing and Cost Management console. After your TRN and billing address are verified, you can call this API operation.
 *
 * - For Amazon Web Services accounts created through Organizations, you can call this API operation when you don't have a billing address.
 *
 * **Georgia**
 *
 * - The valid `personType` values are `Physical Person` and `Business`.
 *
 * **Indonesia**
 *
 * - `PutTaxRegistration`: The use of this operation to submit tax information is subject to the Amazon Web Services service terms. By submitting, you’re providing consent for Amazon Web Services to validate NIK, NPWP, and NITKU data, provided by you with the Directorate General of Taxes of Indonesia in accordance with the Minister of Finance Regulation (PMK) Number 112/PMK.03/2022.
 *
 * - `BatchPutTaxRegistration`: The use of this operation to submit tax information is subject to the Amazon Web Services service terms. By submitting, you’re providing consent for Amazon Web Services to validate NIK, NPWP, and NITKU data, provided by you with the Directorate General of Taxes of Indonesia in accordance with the Minister of Finance Regulation (PMK) Number 112/PMK.03/2022, through our third-party partner PT Achilles Advanced Management (OnlinePajak).
 *
 * - You must specify the `taxRegistrationNumberType` in the `indonesiaAdditionalInfo` field of the `additionalTaxInformation` object.
 *
 * - If you specify `decisionNumber`, you must specify the `ppnExceptionDesignationCode` in the `indonesiaAdditionalInfo` field of the `additionalTaxInformation` object. If the `taxRegistrationNumberType` is set to NPWP or NITKU, valid values for `ppnExceptionDesignationCode` are either `01`, `02`, `03`, `07`, or `08`.
 *
 * For other `taxRegistrationNumberType` values, `ppnExceptionDesignationCode` must be either `01`, `07`, or `08`.
 *
 * - If `ppnExceptionDesignationCode` is `07`, you must specify the `decisionNumber` in the `indonesiaAdditionalInfo` field of the `additionalTaxInformation` object.
 *
 * **Kenya**
 *
 * - You must specify the `personType` in the `kenyaAdditionalInfo`
 * field of the `additionalTaxInformation` object.
 *
 * - If the `personType` is `Physical Person`, you must specify the
 * tax registration certificate document in the `taxRegistrationDocuments` field
 * of the `VerificationDetails` object.
 *
 * **Malaysia**
 *
 * - The sector valid values are `Business` and `Individual`.
 *
 * - `RegistrationType` valid values are `NRIC` for individual, and TIN and sales and service tax (SST) for Business.
 *
 * - For individual, you can specify the `taxInformationNumber` in `MalaysiaAdditionalInfo` with NRIC type, and a valid `MyKad` or NRIC number.
 *
 * - For business, you must specify a `businessRegistrationNumber` in `MalaysiaAdditionalInfo` with a TIN type and tax identification number.
 *
 * - For business resellers, you must specify a `businessRegistrationNumber` and `taxInformationNumber` in `MalaysiaAdditionalInfo` with a sales and service tax (SST) type and a valid SST number.
 *
 * - For business resellers with service codes, you must specify `businessRegistrationNumber`, `taxInformationNumber`, and distinct `serviceTaxCodes` in `MalaysiaAdditionalInfo` with a SST type and valid sales and service tax (SST) number. By using this API operation, Amazon Web Services registers your self-declaration that you’re an authorized business reseller registered with the Royal Malaysia Customs Department (RMCD), and have a valid SST number.
 *
 * - Amazon Web Services reserves the right to seek additional information and/or take other actions to
 * support your self-declaration as appropriate.
 *
 * - Amazon Web Services is currently registered under the following service tax codes. You must include
 * at least one of the service tax codes in the service tax code strings to declare yourself
 * as an authorized registered business reseller.
 *
 * Taxable service and service tax codes:
 *
 * Consultancy - 9907061674
 *
 * Training or coaching service - 9907071685
 *
 * IT service - 9907101676
 *
 * Digital services and electronic medium - 9907121690
 *
 * **Nepal**
 *
 * - The sector valid values are `Business` and `Individual`.
 *
 * **Saudi Arabia**
 *
 * - For `address`, you must specify `addressLine3`.
 *
 * **South Korea**
 *
 * - You must specify the `certifiedEmailId` and `legalName` in the
 * `TaxRegistrationEntry` object. Use Korean characters for
 * `legalName`.
 *
 * - You must specify the `businessRepresentativeName`,
 * `itemOfBusiness`, and `lineOfBusiness` in the
 * `southKoreaAdditionalInfo` field of the `additionalTaxInformation`
 * object. Use Korean characters for these fields.
 *
 * - You must specify the tax registration certificate document in the
 * `taxRegistrationDocuments` field of the `VerificationDetails`
 * object.
 *
 * - For the `address` object, use Korean characters for `addressLine1`, `addressLine2`
 * `city`, `postalCode`, and `stateOrRegion`.
 *
 * **Spain**
 *
 * - You must specify the `registrationType` in the
 * `spainAdditionalInfo` field of the `additionalTaxInformation`
 * object.
 *
 * - If the `registrationType` is `Local`, you must specify the tax
 * registration certificate document in the `taxRegistrationDocuments` field of
 * the `VerificationDetails` object.
 *
 * **Turkey**
 *
 * - You must specify the `sector` in the `taxRegistrationEntry` object.
 *
 * - If your `sector` is `Business`, `Individual`, or
 * `Government`:
 *
 * - Specify the `taxOffice`. If your
 * `sector` is `Individual`, don't enter this value.
 *
 * - (Optional) Specify the `kepEmailId`. If your
 * `sector` is `Individual`, don't enter this value.
 *
 * - **Note:** In the **Tax Settings** page of the Billing console, `Government` appears as **Public institutions**
 *
 * - If your `sector` is `Business` and you're subject to KDV tax,
 * you must specify your industry in the `industries` field.
 *
 * - For `address`, you must specify `districtOrCounty`.
 *
 * **Ukraine**
 *
 * - The sector valid values are `Business` and `Individual`.
 */
export const batchPutTaxRegistration: (
  input: BatchPutTaxRegistrationRequest,
) => effect.Effect<
  BatchPutTaxRegistrationResponse,
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutTaxRegistrationRequest,
  output: BatchPutTaxRegistrationResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
