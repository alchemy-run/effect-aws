import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "TaxSettings",
  serviceShapeName: "TaxSettings",
});
const auth = T.AwsAuthSigv4({ name: "tax" });
const ver = T.ServiceVersion("2018-05-10");
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
                            url: "https://tax-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
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
                            url: "https://tax-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
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
                            url: "https://tax.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://tax.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
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
export class GetTaxExemptionTypesRequest extends S.Class<GetTaxExemptionTypesRequest>(
  "GetTaxExemptionTypesRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/GetTaxExemptionTypes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTaxInheritanceRequest extends S.Class<GetTaxInheritanceRequest>(
  "GetTaxInheritanceRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/GetTaxInheritance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AccountIds = S.Array(S.String);
export class BatchDeleteTaxRegistrationRequest extends S.Class<BatchDeleteTaxRegistrationRequest>(
  "BatchDeleteTaxRegistrationRequest",
)(
  { accountIds: AccountIds },
  T.all(
    T.Http({ method: "POST", uri: "/BatchDeleteTaxRegistration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetTaxExemptionsRequest extends S.Class<BatchGetTaxExemptionsRequest>(
  "BatchGetTaxExemptionsRequest",
)(
  { accountIds: AccountIds },
  T.all(
    T.Http({ method: "POST", uri: "/BatchGetTaxExemptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSupplementalTaxRegistrationRequest extends S.Class<DeleteSupplementalTaxRegistrationRequest>(
  "DeleteSupplementalTaxRegistrationRequest",
)(
  { authorityId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteSupplementalTaxRegistration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSupplementalTaxRegistrationResponse extends S.Class<DeleteSupplementalTaxRegistrationResponse>(
  "DeleteSupplementalTaxRegistrationResponse",
)({}) {}
export class DeleteTaxRegistrationRequest extends S.Class<DeleteTaxRegistrationRequest>(
  "DeleteTaxRegistrationRequest",
)(
  { accountId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteTaxRegistration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTaxRegistrationResponse extends S.Class<DeleteTaxRegistrationResponse>(
  "DeleteTaxRegistrationResponse",
)({}) {}
export class GetTaxInheritanceResponse extends S.Class<GetTaxInheritanceResponse>(
  "GetTaxInheritanceResponse",
)({ heritageStatus: S.optional(S.String) }) {}
export class GetTaxRegistrationRequest extends S.Class<GetTaxRegistrationRequest>(
  "GetTaxRegistrationRequest",
)(
  { accountId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/GetTaxRegistration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSupplementalTaxRegistrationsRequest extends S.Class<ListSupplementalTaxRegistrationsRequest>(
  "ListSupplementalTaxRegistrationsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListSupplementalTaxRegistrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTaxExemptionsRequest extends S.Class<ListTaxExemptionsRequest>(
  "ListTaxExemptionsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListTaxExemptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTaxRegistrationsRequest extends S.Class<ListTaxRegistrationsRequest>(
  "ListTaxRegistrationsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListTaxRegistrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTaxInheritanceRequest extends S.Class<PutTaxInheritanceRequest>(
  "PutTaxInheritanceRequest",
)(
  { heritageStatus: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/PutTaxInheritance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTaxInheritanceResponse extends S.Class<PutTaxInheritanceResponse>(
  "PutTaxInheritanceResponse",
)({}) {}
export class Address extends S.Class<Address>("Address")({
  addressLine1: S.String,
  addressLine2: S.optional(S.String),
  addressLine3: S.optional(S.String),
  districtOrCounty: S.optional(S.String),
  city: S.String,
  stateOrRegion: S.optional(S.String),
  postalCode: S.String,
  countryCode: S.String,
}) {}
export const MalaysiaServiceTaxCodesList = S.Array(S.String);
export class MalaysiaAdditionalInfo extends S.Class<MalaysiaAdditionalInfo>(
  "MalaysiaAdditionalInfo",
)({
  serviceTaxCodes: S.optional(MalaysiaServiceTaxCodesList),
  taxInformationNumber: S.optional(S.String),
  businessRegistrationNumber: S.optional(S.String),
}) {}
export class IsraelAdditionalInfo extends S.Class<IsraelAdditionalInfo>(
  "IsraelAdditionalInfo",
)({ dealerType: S.String, customerType: S.String }) {}
export class EstoniaAdditionalInfo extends S.Class<EstoniaAdditionalInfo>(
  "EstoniaAdditionalInfo",
)({ registryCommercialCode: S.String }) {}
export class CanadaAdditionalInfo extends S.Class<CanadaAdditionalInfo>(
  "CanadaAdditionalInfo",
)({
  provincialSalesTaxId: S.optional(S.String),
  canadaQuebecSalesTaxNumber: S.optional(S.String),
  canadaRetailSalesTaxNumber: S.optional(S.String),
  isResellerAccount: S.optional(S.Boolean),
}) {}
export class SpainAdditionalInfo extends S.Class<SpainAdditionalInfo>(
  "SpainAdditionalInfo",
)({ registrationType: S.String }) {}
export class KenyaAdditionalInfo extends S.Class<KenyaAdditionalInfo>(
  "KenyaAdditionalInfo",
)({ personType: S.String }) {}
export class SouthKoreaAdditionalInfo extends S.Class<SouthKoreaAdditionalInfo>(
  "SouthKoreaAdditionalInfo",
)({
  businessRepresentativeName: S.String,
  lineOfBusiness: S.String,
  itemOfBusiness: S.String,
}) {}
export class TurkeyAdditionalInfo extends S.Class<TurkeyAdditionalInfo>(
  "TurkeyAdditionalInfo",
)({
  taxOffice: S.optional(S.String),
  kepEmailId: S.optional(S.String),
  secondaryTaxId: S.optional(S.String),
  industries: S.optional(S.String),
}) {}
export class GeorgiaAdditionalInfo extends S.Class<GeorgiaAdditionalInfo>(
  "GeorgiaAdditionalInfo",
)({ personType: S.String }) {}
export class ItalyAdditionalInfo extends S.Class<ItalyAdditionalInfo>(
  "ItalyAdditionalInfo",
)({
  sdiAccountId: S.optional(S.String),
  cigNumber: S.optional(S.String),
  cupNumber: S.optional(S.String),
  taxCode: S.optional(S.String),
}) {}
export class RomaniaAdditionalInfo extends S.Class<RomaniaAdditionalInfo>(
  "RomaniaAdditionalInfo",
)({ taxRegistrationNumberType: S.String }) {}
export class UkraineAdditionalInfo extends S.Class<UkraineAdditionalInfo>(
  "UkraineAdditionalInfo",
)({ ukraineTrnType: S.String }) {}
export class PolandAdditionalInfo extends S.Class<PolandAdditionalInfo>(
  "PolandAdditionalInfo",
)({
  individualRegistrationNumber: S.optional(S.String),
  isGroupVatEnabled: S.optional(S.Boolean),
}) {}
export class SaudiArabiaAdditionalInfo extends S.Class<SaudiArabiaAdditionalInfo>(
  "SaudiArabiaAdditionalInfo",
)({ taxRegistrationNumberType: S.optional(S.String) }) {}
export class IndonesiaAdditionalInfo extends S.Class<IndonesiaAdditionalInfo>(
  "IndonesiaAdditionalInfo",
)({
  taxRegistrationNumberType: S.optional(S.String),
  ppnExceptionDesignationCode: S.optional(S.String),
  decisionNumber: S.optional(S.String),
}) {}
export class VietnamAdditionalInfo extends S.Class<VietnamAdditionalInfo>(
  "VietnamAdditionalInfo",
)({
  enterpriseIdentificationNumber: S.optional(S.String),
  electronicTransactionCodeNumber: S.optional(S.String),
  paymentVoucherNumber: S.optional(S.String),
  paymentVoucherNumberDate: S.optional(S.String),
}) {}
export class EgyptAdditionalInfo extends S.Class<EgyptAdditionalInfo>(
  "EgyptAdditionalInfo",
)({
  uniqueIdentificationNumber: S.optional(S.String),
  uniqueIdentificationNumberExpirationDate: S.optional(S.String),
}) {}
export class GreeceAdditionalInfo extends S.Class<GreeceAdditionalInfo>(
  "GreeceAdditionalInfo",
)({ contractingAuthorityCode: S.optional(S.String) }) {}
export class UzbekistanAdditionalInfo extends S.Class<UzbekistanAdditionalInfo>(
  "UzbekistanAdditionalInfo",
)({
  taxRegistrationNumberType: S.optional(S.String),
  vatRegistrationNumber: S.optional(S.String),
}) {}
export class AdditionalInfoRequest extends S.Class<AdditionalInfoRequest>(
  "AdditionalInfoRequest",
)({
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
}) {}
export class SourceS3Location extends S.Class<SourceS3Location>(
  "SourceS3Location",
)({ bucket: S.String, key: S.String }) {}
export class TaxRegistrationDocFile extends S.Class<TaxRegistrationDocFile>(
  "TaxRegistrationDocFile",
)({ fileName: S.String, fileContent: T.Blob }) {}
export class TaxRegistrationDocument extends S.Class<TaxRegistrationDocument>(
  "TaxRegistrationDocument",
)({
  s3Location: S.optional(SourceS3Location),
  file: S.optional(TaxRegistrationDocFile),
}) {}
export const TaxRegistrationDocuments = S.Array(TaxRegistrationDocument);
export class VerificationDetails extends S.Class<VerificationDetails>(
  "VerificationDetails",
)({
  dateOfBirth: S.optional(S.String),
  taxRegistrationDocuments: S.optional(TaxRegistrationDocuments),
}) {}
export class TaxRegistrationEntry extends S.Class<TaxRegistrationEntry>(
  "TaxRegistrationEntry",
)({
  registrationId: S.String,
  registrationType: S.String,
  legalName: S.optional(S.String),
  legalAddress: S.optional(Address),
  sector: S.optional(S.String),
  additionalTaxInformation: S.optional(AdditionalInfoRequest),
  verificationDetails: S.optional(VerificationDetails),
  certifiedEmailId: S.optional(S.String),
}) {}
export class PutTaxRegistrationRequest extends S.Class<PutTaxRegistrationRequest>(
  "PutTaxRegistrationRequest",
)(
  {
    accountId: S.optional(S.String),
    taxRegistrationEntry: TaxRegistrationEntry,
  },
  T.all(
    T.Http({ method: "POST", uri: "/PutTaxRegistration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Authority extends S.Class<Authority>("Authority")({
  country: S.String,
  state: S.optional(S.String),
}) {}
export const Authorities = S.Array(Authority);
export class TaxExemptionType extends S.Class<TaxExemptionType>(
  "TaxExemptionType",
)({
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  applicableJurisdictions: S.optional(Authorities),
}) {}
export const TaxExemptionTypes = S.Array(TaxExemptionType);
export class DestinationS3Location extends S.Class<DestinationS3Location>(
  "DestinationS3Location",
)({ bucket: S.String, prefix: S.optional(S.String) }) {}
export class TaxDocumentMetadata extends S.Class<TaxDocumentMetadata>(
  "TaxDocumentMetadata",
)({ taxDocumentAccessToken: S.String, taxDocumentName: S.String }) {}
export class SupplementalTaxRegistrationEntry extends S.Class<SupplementalTaxRegistrationEntry>(
  "SupplementalTaxRegistrationEntry",
)({
  registrationId: S.String,
  registrationType: S.String,
  legalName: S.String,
  address: Address,
}) {}
export class ExemptionCertificate extends S.Class<ExemptionCertificate>(
  "ExemptionCertificate",
)({ documentName: S.String, documentFile: T.Blob }) {}
export class GetTaxExemptionTypesResponse extends S.Class<GetTaxExemptionTypesResponse>(
  "GetTaxExemptionTypesResponse",
)({ taxExemptionTypes: S.optional(TaxExemptionTypes) }) {}
export class GetTaxRegistrationDocumentRequest extends S.Class<GetTaxRegistrationDocumentRequest>(
  "GetTaxRegistrationDocumentRequest",
)(
  {
    destinationS3Location: S.optional(DestinationS3Location),
    taxDocumentMetadata: TaxDocumentMetadata,
  },
  T.all(
    T.Http({ method: "POST", uri: "/GetTaxRegistrationDocument" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TaxExemption extends S.Class<TaxExemption>("TaxExemption")({
  authority: Authority,
  taxExemptionType: TaxExemptionType,
  effectiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  systemEffectiveDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
}) {}
export const TaxExemptions = S.Array(TaxExemption);
export class TaxExemptionDetails extends S.Class<TaxExemptionDetails>(
  "TaxExemptionDetails",
)({
  taxExemptions: S.optional(TaxExemptions),
  heritageObtainedDetails: S.optional(S.Boolean),
  heritageObtainedParentEntity: S.optional(S.String),
  heritageObtainedReason: S.optional(S.String),
}) {}
export const TaxExemptionDetailsMap = S.Record({
  key: S.String,
  value: TaxExemptionDetails,
});
export class ListTaxExemptionsResponse extends S.Class<ListTaxExemptionsResponse>(
  "ListTaxExemptionsResponse",
)({
  nextToken: S.optional(S.String),
  taxExemptionDetailsMap: S.optional(TaxExemptionDetailsMap),
}) {}
export class PutSupplementalTaxRegistrationRequest extends S.Class<PutSupplementalTaxRegistrationRequest>(
  "PutSupplementalTaxRegistrationRequest",
)(
  { taxRegistrationEntry: SupplementalTaxRegistrationEntry },
  T.all(
    T.Http({ method: "POST", uri: "/PutSupplementalTaxRegistration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTaxExemptionRequest extends S.Class<PutTaxExemptionRequest>(
  "PutTaxExemptionRequest",
)(
  {
    accountIds: AccountIds,
    authority: Authority,
    exemptionType: S.String,
    exemptionCertificate: ExemptionCertificate,
  },
  T.all(
    T.Http({ method: "POST", uri: "/PutTaxExemption" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutTaxRegistrationResponse extends S.Class<PutTaxRegistrationResponse>(
  "PutTaxRegistrationResponse",
)({ status: S.optional(S.String) }) {}
export const TaxDocumentMetadatas = S.Array(TaxDocumentMetadata);
export class BatchDeleteTaxRegistrationError extends S.Class<BatchDeleteTaxRegistrationError>(
  "BatchDeleteTaxRegistrationError",
)({ accountId: S.String, message: S.String, code: S.optional(S.String) }) {}
export const BatchDeleteTaxRegistrationErrors = S.Array(
  BatchDeleteTaxRegistrationError,
);
export class SupplementalTaxRegistration extends S.Class<SupplementalTaxRegistration>(
  "SupplementalTaxRegistration",
)({
  registrationId: S.String,
  registrationType: S.String,
  legalName: S.String,
  address: Address,
  authorityId: S.String,
  status: S.String,
}) {}
export const SupplementalTaxRegistrationList = S.Array(
  SupplementalTaxRegistration,
);
export class BatchDeleteTaxRegistrationResponse extends S.Class<BatchDeleteTaxRegistrationResponse>(
  "BatchDeleteTaxRegistrationResponse",
)({ errors: BatchDeleteTaxRegistrationErrors }) {}
export class GetTaxRegistrationDocumentResponse extends S.Class<GetTaxRegistrationDocumentResponse>(
  "GetTaxRegistrationDocumentResponse",
)({
  destinationFilePath: S.optional(S.String),
  presignedS3Url: S.optional(S.String),
}) {}
export class ListSupplementalTaxRegistrationsResponse extends S.Class<ListSupplementalTaxRegistrationsResponse>(
  "ListSupplementalTaxRegistrationsResponse",
)({
  taxRegistrations: SupplementalTaxRegistrationList,
  nextToken: S.optional(S.String),
}) {}
export class PutSupplementalTaxRegistrationResponse extends S.Class<PutSupplementalTaxRegistrationResponse>(
  "PutSupplementalTaxRegistrationResponse",
)({ authorityId: S.String, status: S.String }) {}
export class PutTaxExemptionResponse extends S.Class<PutTaxExemptionResponse>(
  "PutTaxExemptionResponse",
)({ caseId: S.optional(S.String) }) {}
export class TaxInheritanceDetails extends S.Class<TaxInheritanceDetails>(
  "TaxInheritanceDetails",
)({
  parentEntityId: S.optional(S.String),
  inheritanceObtainedReason: S.optional(S.String),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class BrazilAdditionalInfo extends S.Class<BrazilAdditionalInfo>(
  "BrazilAdditionalInfo",
)({ ccmCode: S.optional(S.String), legalNatureCode: S.optional(S.String) }) {}
export class IndiaAdditionalInfo extends S.Class<IndiaAdditionalInfo>(
  "IndiaAdditionalInfo",
)({ pan: S.optional(S.String) }) {}
export class Jurisdiction extends S.Class<Jurisdiction>("Jurisdiction")({
  stateOrRegion: S.optional(S.String),
  countryCode: S.String,
}) {}
export const AddressRoleMap = S.Record({ key: S.String, value: Jurisdiction });
export class AdditionalInfoResponse extends S.Class<AdditionalInfoResponse>(
  "AdditionalInfoResponse",
)({
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
}) {}
export class TaxRegistrationWithJurisdiction extends S.Class<TaxRegistrationWithJurisdiction>(
  "TaxRegistrationWithJurisdiction",
)({
  registrationId: S.String,
  registrationType: S.String,
  legalName: S.String,
  status: S.String,
  sector: S.optional(S.String),
  taxDocumentMetadatas: S.optional(TaxDocumentMetadatas),
  certifiedEmailId: S.optional(S.String),
  additionalTaxInformation: S.optional(AdditionalInfoResponse),
  jurisdiction: Jurisdiction,
}) {}
export class AccountMetaData extends S.Class<AccountMetaData>(
  "AccountMetaData",
)({
  accountName: S.optional(S.String),
  seller: S.optional(S.String),
  address: S.optional(Address),
  addressType: S.optional(S.String),
  addressRoleMap: S.optional(AddressRoleMap),
}) {}
export class TaxRegistration extends S.Class<TaxRegistration>(
  "TaxRegistration",
)({
  registrationId: S.String,
  registrationType: S.String,
  legalName: S.String,
  status: S.String,
  sector: S.optional(S.String),
  taxDocumentMetadatas: S.optional(TaxDocumentMetadatas),
  certifiedEmailId: S.optional(S.String),
  additionalTaxInformation: S.optional(AdditionalInfoResponse),
  legalAddress: Address,
}) {}
export class AccountDetails extends S.Class<AccountDetails>("AccountDetails")({
  accountId: S.optional(S.String),
  taxRegistration: S.optional(TaxRegistrationWithJurisdiction),
  taxInheritanceDetails: S.optional(TaxInheritanceDetails),
  accountMetaData: S.optional(AccountMetaData),
}) {}
export const AccountDetailsList = S.Array(AccountDetails);
export class BatchGetTaxExemptionsResponse extends S.Class<BatchGetTaxExemptionsResponse>(
  "BatchGetTaxExemptionsResponse",
)({
  taxExemptionDetailsMap: S.optional(TaxExemptionDetailsMap),
  failedAccounts: S.optional(AccountIds),
}) {}
export class BatchPutTaxRegistrationRequest extends S.Class<BatchPutTaxRegistrationRequest>(
  "BatchPutTaxRegistrationRequest",
)(
  { accountIds: AccountIds, taxRegistrationEntry: TaxRegistrationEntry },
  T.all(
    T.Http({ method: "POST", uri: "/BatchPutTaxRegistration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTaxRegistrationResponse extends S.Class<GetTaxRegistrationResponse>(
  "GetTaxRegistrationResponse",
)({ taxRegistration: S.optional(TaxRegistration) }) {}
export class ListTaxRegistrationsResponse extends S.Class<ListTaxRegistrationsResponse>(
  "ListTaxRegistrationsResponse",
)({ accountDetails: AccountDetailsList, nextToken: S.optional(S.String) }) {}
export class BatchPutTaxRegistrationError extends S.Class<BatchPutTaxRegistrationError>(
  "BatchPutTaxRegistrationError",
)({ accountId: S.String, message: S.String, code: S.optional(S.String) }) {}
export const BatchPutTaxRegistrationErrors = S.Array(
  BatchPutTaxRegistrationError,
);
export class BatchPutTaxRegistrationResponse extends S.Class<BatchPutTaxRegistrationResponse>(
  "BatchPutTaxRegistrationResponse",
)({ status: S.optional(S.String), errors: BatchPutTaxRegistrationErrors }) {}

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, errorCode: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String, errorCode: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, errorCode: S.String },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    errorCode: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}
export class AttachmentUploadException extends S.TaggedError<AttachmentUploadException>()(
  "AttachmentUploadException",
  { message: S.String },
) {}
export class CaseCreationLimitExceededException extends S.TaggedError<CaseCreationLimitExceededException>()(
  "CaseCreationLimitExceededException",
  { message: S.String },
) {}

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
export const putTaxRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDeleteTaxRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteTaxRegistrationRequest,
    output: BatchDeleteTaxRegistrationResponse,
    errors: [ConflictException, InternalServerException, ValidationException],
  }),
);
/**
 * The get account tax inheritance status.
 */
export const getTaxInheritance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTaxRegistrationDocument = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTaxRegistrationDocumentRequest,
    output: GetTaxRegistrationDocumentResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Retrieves supplemental tax registrations for a single account.
 */
export const listSupplementalTaxRegistrations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putSupplementalTaxRegistration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutSupplementalTaxRegistrationRequest,
    output: PutSupplementalTaxRegistrationResponse,
    errors: [ConflictException, InternalServerException, ValidationException],
  }));
/**
 * Retrieves the tax exemption of accounts listed in a consolidated billing family. The IAM action is `tax:GetExemptions`.
 */
export const listTaxExemptions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Deletes tax registration for a single account.
 *
 * This API operation can't be used to delete your tax registration in Brazil. Use the Payment preferences page in the Billing and Cost Management console instead.
 */
export const deleteTaxRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTaxRegistrationRequest,
    output: DeleteTaxRegistrationResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * The updated tax inheritance status.
 */
export const putTaxInheritance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSupplementalTaxRegistration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTaxExemptionTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTaxExemptionTypesRequest,
    output: GetTaxExemptionTypesResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Get the active tax exemptions for a given list of accounts. The IAM action is `tax:GetExemptions`.
 */
export const batchGetTaxExemptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetTaxExemptionsRequest,
    output: BatchGetTaxExemptionsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves tax registration for a single account.
 */
export const getTaxRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTaxRegistrations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putTaxExemption = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchPutTaxRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchPutTaxRegistrationRequest,
    output: BatchPutTaxRegistrationResponse,
    errors: [ConflictException, InternalServerException, ValidationException],
  }),
);
