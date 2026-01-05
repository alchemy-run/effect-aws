import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Marketplace Agreement",
  serviceShapeName: "AWSMPCommerceService_v20200301",
});
const auth = T.AwsAuthSigv4({ name: "aws-marketplace" });
const ver = T.ServiceVersion("2020-03-01");
const proto = T.AwsProtocolsAwsJson1_0();
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://agreement-marketplace-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://agreement-marketplace-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://agreement-marketplace.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://agreement-marketplace.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeAgreementInput extends S.Class<DescribeAgreementInput>(
  "DescribeAgreementInput",
)(
  { agreementId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAgreementTermsInput extends S.Class<GetAgreementTermsInput>(
  "GetAgreementTermsInput",
)(
  {
    agreementId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FilterValueList = S.Array(S.String);
export class Filter extends S.Class<Filter>("Filter")({
  name: S.optional(S.String),
  values: S.optional(FilterValueList),
}) {}
export const FilterList = S.Array(Filter);
export class Sort extends S.Class<Sort>("Sort")({
  sortBy: S.optional(S.String),
  sortOrder: S.optional(S.String),
}) {}
export class SearchAgreementsInput extends S.Class<SearchAgreementsInput>(
  "SearchAgreementsInput",
)(
  {
    catalog: S.optional(S.String),
    filters: S.optional(FilterList),
    sort: S.optional(Sort),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Acceptor extends S.Class<Acceptor>("Acceptor")({
  accountId: S.optional(S.String),
}) {}
export class Proposer extends S.Class<Proposer>("Proposer")({
  accountId: S.optional(S.String),
}) {}
export class EstimatedCharges extends S.Class<EstimatedCharges>(
  "EstimatedCharges",
)({
  currencyCode: S.optional(S.String),
  agreementValue: S.optional(S.String),
}) {}
export class Resource extends S.Class<Resource>("Resource")({
  id: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const Resources = S.Array(Resource);
export class SupportTerm extends S.Class<SupportTerm>("SupportTerm")({
  type: S.optional(S.String),
  refundPolicy: S.optional(S.String),
}) {}
export class ByolPricingTerm extends S.Class<ByolPricingTerm>(
  "ByolPricingTerm",
)({ type: S.optional(S.String) }) {}
export class RecurringPaymentTerm extends S.Class<RecurringPaymentTerm>(
  "RecurringPaymentTerm",
)({
  type: S.optional(S.String),
  currencyCode: S.optional(S.String),
  billingPeriod: S.optional(S.String),
  price: S.optional(S.String),
}) {}
export class ValidityTerm extends S.Class<ValidityTerm>("ValidityTerm")({
  type: S.optional(S.String),
  agreementDuration: S.optional(S.String),
  agreementStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  agreementEndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GrantItem extends S.Class<GrantItem>("GrantItem")({
  dimensionKey: S.optional(S.String),
  maxQuantity: S.optional(S.Number),
}) {}
export const GrantList = S.Array(GrantItem);
export class FixedUpfrontPricingTerm extends S.Class<FixedUpfrontPricingTerm>(
  "FixedUpfrontPricingTerm",
)({
  type: S.optional(S.String),
  currencyCode: S.optional(S.String),
  duration: S.optional(S.String),
  price: S.optional(S.String),
  grants: S.optional(GrantList),
}) {}
export class ProposalSummary extends S.Class<ProposalSummary>(
  "ProposalSummary",
)({
  resources: S.optional(Resources),
  offerId: S.optional(S.String),
  offerSetId: S.optional(S.String),
}) {}
export class AgreementViewSummary extends S.Class<AgreementViewSummary>(
  "AgreementViewSummary",
)({
  agreementId: S.optional(S.String),
  acceptanceTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  agreementType: S.optional(S.String),
  acceptor: S.optional(Acceptor),
  proposer: S.optional(Proposer),
  proposalSummary: S.optional(ProposalSummary),
  status: S.optional(S.String),
}) {}
export const AgreementViewSummaryList = S.Array(AgreementViewSummary);
export class DocumentItem extends S.Class<DocumentItem>("DocumentItem")({
  type: S.optional(S.String),
  url: S.optional(S.String),
  version: S.optional(S.String),
}) {}
export const DocumentList = S.Array(DocumentItem);
export class RenewalTermConfiguration extends S.Class<RenewalTermConfiguration>(
  "RenewalTermConfiguration",
)({ enableAutoRenew: S.Boolean }) {}
export class ScheduleItem extends S.Class<ScheduleItem>("ScheduleItem")({
  chargeDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  chargeAmount: S.optional(S.String),
}) {}
export const ScheduleList = S.Array(ScheduleItem);
export class VariablePaymentTermConfiguration extends S.Class<VariablePaymentTermConfiguration>(
  "VariablePaymentTermConfiguration",
)({
  paymentRequestApprovalStrategy: S.String,
  expirationDuration: S.optional(S.String),
}) {}
export class DescribeAgreementOutput extends S.Class<DescribeAgreementOutput>(
  "DescribeAgreementOutput",
)({
  agreementId: S.optional(S.String),
  acceptor: S.optional(Acceptor),
  proposer: S.optional(Proposer),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  acceptanceTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  agreementType: S.optional(S.String),
  estimatedCharges: S.optional(EstimatedCharges),
  proposalSummary: S.optional(ProposalSummary),
  status: S.optional(S.String),
}) {}
export class SearchAgreementsOutput extends S.Class<SearchAgreementsOutput>(
  "SearchAgreementsOutput",
)({
  agreementViewSummaries: S.optional(AgreementViewSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class LegalTerm extends S.Class<LegalTerm>("LegalTerm")({
  type: S.optional(S.String),
  documents: S.optional(DocumentList),
}) {}
export class RenewalTerm extends S.Class<RenewalTerm>("RenewalTerm")({
  type: S.optional(S.String),
  configuration: S.optional(RenewalTermConfiguration),
}) {}
export class PaymentScheduleTerm extends S.Class<PaymentScheduleTerm>(
  "PaymentScheduleTerm",
)({
  type: S.optional(S.String),
  currencyCode: S.optional(S.String),
  schedule: S.optional(ScheduleList),
}) {}
export class FreeTrialPricingTerm extends S.Class<FreeTrialPricingTerm>(
  "FreeTrialPricingTerm",
)({
  type: S.optional(S.String),
  duration: S.optional(S.String),
  grants: S.optional(GrantList),
}) {}
export class VariablePaymentTerm extends S.Class<VariablePaymentTerm>(
  "VariablePaymentTerm",
)({
  type: S.optional(S.String),
  currencyCode: S.optional(S.String),
  maxTotalChargeAmount: S.optional(S.String),
  configuration: S.optional(VariablePaymentTermConfiguration),
}) {}
export class RateCardItem extends S.Class<RateCardItem>("RateCardItem")({
  dimensionKey: S.optional(S.String),
  price: S.optional(S.String),
}) {}
export const RateCardList = S.Array(RateCardItem);
export class Selector extends S.Class<Selector>("Selector")({
  type: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export class Constraints extends S.Class<Constraints>("Constraints")({
  multipleDimensionSelection: S.optional(S.String),
  quantityConfiguration: S.optional(S.String),
}) {}
export class Dimension extends S.Class<Dimension>("Dimension")({
  dimensionKey: S.String,
  dimensionValue: S.Number,
}) {}
export const DimensionList = S.Array(Dimension);
export class UsageBasedRateCardItem extends S.Class<UsageBasedRateCardItem>(
  "UsageBasedRateCardItem",
)({ rateCard: S.optional(RateCardList) }) {}
export const UsageBasedRateCardList = S.Array(UsageBasedRateCardItem);
export class ConfigurableUpfrontRateCardItem extends S.Class<ConfigurableUpfrontRateCardItem>(
  "ConfigurableUpfrontRateCardItem",
)({
  selector: S.optional(Selector),
  constraints: S.optional(Constraints),
  rateCard: S.optional(RateCardList),
}) {}
export const ConfigurableUpfrontRateCardList = S.Array(
  ConfigurableUpfrontRateCardItem,
);
export class ConfigurableUpfrontPricingTermConfiguration extends S.Class<ConfigurableUpfrontPricingTermConfiguration>(
  "ConfigurableUpfrontPricingTermConfiguration",
)({ selectorValue: S.String, dimensions: DimensionList }) {}
export class UsageBasedPricingTerm extends S.Class<UsageBasedPricingTerm>(
  "UsageBasedPricingTerm",
)({
  type: S.optional(S.String),
  currencyCode: S.optional(S.String),
  rateCards: S.optional(UsageBasedRateCardList),
}) {}
export class ConfigurableUpfrontPricingTerm extends S.Class<ConfigurableUpfrontPricingTerm>(
  "ConfigurableUpfrontPricingTerm",
)({
  type: S.optional(S.String),
  currencyCode: S.optional(S.String),
  rateCards: S.optional(ConfigurableUpfrontRateCardList),
  configuration: S.optional(ConfigurableUpfrontPricingTermConfiguration),
}) {}
export const AcceptedTerm = S.Union(
  S.Struct({ legalTerm: LegalTerm }),
  S.Struct({ supportTerm: SupportTerm }),
  S.Struct({ renewalTerm: RenewalTerm }),
  S.Struct({ usageBasedPricingTerm: UsageBasedPricingTerm }),
  S.Struct({ configurableUpfrontPricingTerm: ConfigurableUpfrontPricingTerm }),
  S.Struct({ byolPricingTerm: ByolPricingTerm }),
  S.Struct({ recurringPaymentTerm: RecurringPaymentTerm }),
  S.Struct({ validityTerm: ValidityTerm }),
  S.Struct({ paymentScheduleTerm: PaymentScheduleTerm }),
  S.Struct({ freeTrialPricingTerm: FreeTrialPricingTerm }),
  S.Struct({ fixedUpfrontPricingTerm: FixedUpfrontPricingTerm }),
  S.Struct({ variablePaymentTerm: VariablePaymentTerm }),
);
export const AcceptedTermList = S.Array(AcceptedTerm);
export class GetAgreementTermsOutput extends S.Class<GetAgreementTermsOutput>(
  "GetAgreementTermsOutput",
)({
  acceptedTerms: S.optional(AcceptedTermList),
  nextToken: S.optional(S.String),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { requestId: S.optional(S.String), message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { requestId: S.optional(S.String), message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    requestId: S.optional(S.String),
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { requestId: S.optional(S.String), message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    requestId: S.optional(S.String),
    message: S.optional(S.String),
    reason: S.optional(S.String),
    fields: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Searches across all agreements that a proposer has in AWS Marketplace. The search returns a list of agreements with basic agreement information.
 *
 * The following filter combinations are supported when the `PartyType` is `Proposer`:
 *
 * - `AgreementType`
 *
 * - `AgreementType` + `EndTime`
 *
 * - `AgreementType` + `ResourceType`
 *
 * - `AgreementType` + `ResourceType` + `EndTime`
 *
 * - `AgreementType` + `ResourceType` + `Status`
 *
 * - `AgreementType` + `ResourceType` + `Status` + `EndTime`
 *
 * - `AgreementType` + `ResourceId`
 *
 * - `AgreementType` + `ResourceId` + `EndTime`
 *
 * - `AgreementType` + `ResourceId` + `Status`
 *
 * - `AgreementType` + `ResourceId` + `Status` + `EndTime`
 *
 * - `AgreementType` + `AcceptorAccountId`
 *
 * - `AgreementType` + `AcceptorAccountId` + `EndTime`
 *
 * - `AgreementType` + `AcceptorAccountId` + `Status`
 *
 * - `AgreementType` + `AcceptorAccountId` + `Status` + `EndTime`
 *
 * - `AgreementType` + `AcceptorAccountId` + `OfferId`
 *
 * - `AgreementType` + `AcceptorAccountId` + `OfferId` + `Status`
 *
 * - `AgreementType` + `AcceptorAccountId` + `OfferId` + `EndTime`
 *
 * - `AgreementType` + `AcceptorAccountId` + `OfferId` + `Status` + `EndTime`
 *
 * - `AgreementType` + `AcceptorAccountId` + `ResourceId`
 *
 * - `AgreementType` + `AcceptorAccountId` + `ResourceId` + `Status`
 *
 * - `AgreementType` + `AcceptorAccountId` + `ResourceId` + `EndTime`
 *
 * - `AgreementType` + `AcceptorAccountId` + `ResourceId` + `Status` + `EndTime`
 *
 * - `AgreementType` + `AcceptorAccountId` + `ResourceType`
 *
 * - `AgreementType` + `AcceptorAccountId` + `ResourceType` + `EndTime`
 *
 * - `AgreementType` + `AcceptorAccountId` + `ResourceType` + `Status`
 *
 * - `AgreementType` + `AcceptorAccountId` + `ResourceType` + `Status` + `EndTime`
 *
 * - `AgreementType` + `Status`
 *
 * - `AgreementType` + `Status` + `EndTime`
 *
 * - `AgreementType` + `OfferId`
 *
 * - `AgreementType` + `OfferId` + `EndTime`
 *
 * - `AgreementType` + `OfferId` + `Status`
 *
 * - `AgreementType` + `OfferId` + `Status` + `EndTime`
 *
 * - `AgreementType` + `OfferSetId`
 *
 * - `AgreementType` + `OfferSetId` + `EndTime`
 *
 * - `AgreementType` + `OfferSetId` + `Status`
 *
 * - `AgreementType` + `OfferSetId` + `Status` + `EndTime`
 *
 * To filter by `EndTime`, you can use either `BeforeEndTime` or `AfterEndTime`. Only `EndTime` is supported for sorting.
 */
export const searchAgreements = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchAgreementsInput,
    output: SearchAgreementsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Obtains details about the terms in an agreement that you participated in as proposer or acceptor.
 *
 * The details include:
 *
 * - `TermType` – The type of term, such as `LegalTerm`, `RenewalTerm`, or `ConfigurableUpfrontPricingTerm`.
 *
 * - `TermID` – The ID of the particular term, which is common between offer and agreement.
 *
 * - `TermPayload` – The key information contained in the term, such as the EULA for `LegalTerm` or pricing and dimensions for various pricing terms, such as `ConfigurableUpfrontPricingTerm` or `UsageBasedPricingTerm`.
 *
 * - `Configuration` – The buyer/acceptor's selection at the time of agreement creation, such as the number of units purchased for a dimension or setting the `EnableAutoRenew` flag.
 */
export const getAgreementTerms = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetAgreementTermsInput,
    output: GetAgreementTermsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Provides details about an agreement, such as the proposer, acceptor, start date, and end date.
 */
export const describeAgreement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAgreementInput,
  output: DescribeAgreementOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
