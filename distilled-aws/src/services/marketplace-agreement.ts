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
  sdkId: "Marketplace Agreement",
  serviceShapeName: "AWSMPCommerceService_v20200301",
});
const auth = T.AwsAuthSigv4({ name: "aws-marketplace" });
const ver = T.ServiceVersion("2020-03-01");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
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
              `https://agreement-marketplace-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://agreement-marketplace-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://agreement-marketplace.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://agreement-marketplace.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceId = string;
export type MaxResults = number;
export type NextToken = string;
export type Catalog = string;
export type FilterName = string;
export type FilterValue = string;
export type SortBy = string;
export type AgreementType = string;
export type AWSAccountId = string;
export type CurrencyCode = string;
export type BoundedString = string;
export type OfferId = string;
export type OfferSetId = string;
export type AgreementResourceType = string;
export type UnversionedTermType = string;
export type PositiveIntegerWithDefaultValueOne = number;
export type ISO8601Duration = string;
export type ZeroValueInteger = number;
export type RequestId = string;
export type ExceptionMessage = string;

//# Schemas
export interface DescribeAgreementInput {
  agreementId: string;
}
export const DescribeAgreementInput = S.suspend(() =>
  S.Struct({ agreementId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAgreementInput",
}) as any as S.Schema<DescribeAgreementInput>;
export interface GetAgreementTermsInput {
  agreementId: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetAgreementTermsInput = S.suspend(() =>
  S.Struct({
    agreementId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAgreementTermsInput",
}) as any as S.Schema<GetAgreementTermsInput>;
export type FilterValueList = string[];
export const FilterValueList = S.Array(S.String);
export type SortOrder = "ASCENDING" | "DESCENDING" | (string & {});
export const SortOrder = S.String;
export type AgreementStatus =
  | "ACTIVE"
  | "ARCHIVED"
  | "CANCELLED"
  | "EXPIRED"
  | "RENEWED"
  | "REPLACED"
  | "ROLLED_BACK"
  | "SUPERSEDED"
  | "TERMINATED"
  | (string & {});
export const AgreementStatus = S.String;
export interface Filter {
  name?: string;
  values?: string[];
}
export const Filter = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), values: S.optional(FilterValueList) }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface Sort {
  sortBy?: string;
  sortOrder?: SortOrder;
}
export const Sort = S.suspend(() =>
  S.Struct({ sortBy: S.optional(S.String), sortOrder: S.optional(SortOrder) }),
).annotations({ identifier: "Sort" }) as any as S.Schema<Sort>;
export interface SearchAgreementsInput {
  catalog?: string;
  filters?: Filter[];
  sort?: Sort;
  maxResults?: number;
  nextToken?: string;
}
export const SearchAgreementsInput = S.suspend(() =>
  S.Struct({
    catalog: S.optional(S.String),
    filters: S.optional(FilterList),
    sort: S.optional(Sort),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SearchAgreementsInput",
}) as any as S.Schema<SearchAgreementsInput>;
export interface Acceptor {
  accountId?: string;
}
export const Acceptor = S.suspend(() =>
  S.Struct({ accountId: S.optional(S.String) }),
).annotations({ identifier: "Acceptor" }) as any as S.Schema<Acceptor>;
export interface Proposer {
  accountId?: string;
}
export const Proposer = S.suspend(() =>
  S.Struct({ accountId: S.optional(S.String) }),
).annotations({ identifier: "Proposer" }) as any as S.Schema<Proposer>;
export interface EstimatedCharges {
  currencyCode?: string;
  agreementValue?: string;
}
export const EstimatedCharges = S.suspend(() =>
  S.Struct({
    currencyCode: S.optional(S.String),
    agreementValue: S.optional(S.String),
  }),
).annotations({
  identifier: "EstimatedCharges",
}) as any as S.Schema<EstimatedCharges>;
export interface Resource {
  id?: string;
  type?: string;
}
export const Resource = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), type: S.optional(S.String) }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type Resources = Resource[];
export const Resources = S.Array(Resource);
export interface SupportTerm {
  type?: string;
  refundPolicy?: string;
}
export const SupportTerm = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), refundPolicy: S.optional(S.String) }),
).annotations({ identifier: "SupportTerm" }) as any as S.Schema<SupportTerm>;
export interface ByolPricingTerm {
  type?: string;
}
export const ByolPricingTerm = S.suspend(() =>
  S.Struct({ type: S.optional(S.String) }),
).annotations({
  identifier: "ByolPricingTerm",
}) as any as S.Schema<ByolPricingTerm>;
export interface RecurringPaymentTerm {
  type?: string;
  currencyCode?: string;
  billingPeriod?: string;
  price?: string;
}
export const RecurringPaymentTerm = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    currencyCode: S.optional(S.String),
    billingPeriod: S.optional(S.String),
    price: S.optional(S.String),
  }),
).annotations({
  identifier: "RecurringPaymentTerm",
}) as any as S.Schema<RecurringPaymentTerm>;
export interface ValidityTerm {
  type?: string;
  agreementDuration?: string;
  agreementStartDate?: Date;
  agreementEndDate?: Date;
}
export const ValidityTerm = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    agreementDuration: S.optional(S.String),
    agreementStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    agreementEndDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "ValidityTerm" }) as any as S.Schema<ValidityTerm>;
export interface GrantItem {
  dimensionKey?: string;
  maxQuantity?: number;
}
export const GrantItem = S.suspend(() =>
  S.Struct({
    dimensionKey: S.optional(S.String),
    maxQuantity: S.optional(S.Number),
  }),
).annotations({ identifier: "GrantItem" }) as any as S.Schema<GrantItem>;
export type GrantList = GrantItem[];
export const GrantList = S.Array(GrantItem);
export interface FixedUpfrontPricingTerm {
  type?: string;
  currencyCode?: string;
  duration?: string;
  price?: string;
  grants?: GrantItem[];
}
export const FixedUpfrontPricingTerm = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    currencyCode: S.optional(S.String),
    duration: S.optional(S.String),
    price: S.optional(S.String),
    grants: S.optional(GrantList),
  }),
).annotations({
  identifier: "FixedUpfrontPricingTerm",
}) as any as S.Schema<FixedUpfrontPricingTerm>;
export type PaymentRequestApprovalStrategy =
  | "AUTO_APPROVE_ON_EXPIRATION"
  | "WAIT_FOR_APPROVAL"
  | (string & {});
export const PaymentRequestApprovalStrategy = S.String;
export interface ProposalSummary {
  resources?: Resource[];
  offerId?: string;
  offerSetId?: string;
}
export const ProposalSummary = S.suspend(() =>
  S.Struct({
    resources: S.optional(Resources),
    offerId: S.optional(S.String),
    offerSetId: S.optional(S.String),
  }),
).annotations({
  identifier: "ProposalSummary",
}) as any as S.Schema<ProposalSummary>;
export interface AgreementViewSummary {
  agreementId?: string;
  acceptanceTime?: Date;
  startTime?: Date;
  endTime?: Date;
  agreementType?: string;
  acceptor?: Acceptor;
  proposer?: Proposer;
  proposalSummary?: ProposalSummary;
  status?: AgreementStatus;
}
export const AgreementViewSummary = S.suspend(() =>
  S.Struct({
    agreementId: S.optional(S.String),
    acceptanceTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    agreementType: S.optional(S.String),
    acceptor: S.optional(Acceptor),
    proposer: S.optional(Proposer),
    proposalSummary: S.optional(ProposalSummary),
    status: S.optional(AgreementStatus),
  }),
).annotations({
  identifier: "AgreementViewSummary",
}) as any as S.Schema<AgreementViewSummary>;
export type AgreementViewSummaryList = AgreementViewSummary[];
export const AgreementViewSummaryList = S.Array(AgreementViewSummary);
export interface DocumentItem {
  type?: string;
  url?: string;
  version?: string;
}
export const DocumentItem = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    url: S.optional(S.String),
    version: S.optional(S.String),
  }),
).annotations({ identifier: "DocumentItem" }) as any as S.Schema<DocumentItem>;
export type DocumentList = DocumentItem[];
export const DocumentList = S.Array(DocumentItem);
export interface RenewalTermConfiguration {
  enableAutoRenew: boolean;
}
export const RenewalTermConfiguration = S.suspend(() =>
  S.Struct({ enableAutoRenew: S.Boolean }),
).annotations({
  identifier: "RenewalTermConfiguration",
}) as any as S.Schema<RenewalTermConfiguration>;
export interface ScheduleItem {
  chargeDate?: Date;
  chargeAmount?: string;
}
export const ScheduleItem = S.suspend(() =>
  S.Struct({
    chargeDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    chargeAmount: S.optional(S.String),
  }),
).annotations({ identifier: "ScheduleItem" }) as any as S.Schema<ScheduleItem>;
export type ScheduleList = ScheduleItem[];
export const ScheduleList = S.Array(ScheduleItem);
export interface VariablePaymentTermConfiguration {
  paymentRequestApprovalStrategy: PaymentRequestApprovalStrategy;
  expirationDuration?: string;
}
export const VariablePaymentTermConfiguration = S.suspend(() =>
  S.Struct({
    paymentRequestApprovalStrategy: PaymentRequestApprovalStrategy,
    expirationDuration: S.optional(S.String),
  }),
).annotations({
  identifier: "VariablePaymentTermConfiguration",
}) as any as S.Schema<VariablePaymentTermConfiguration>;
export interface DescribeAgreementOutput {
  agreementId?: string;
  acceptor?: Acceptor;
  proposer?: Proposer;
  startTime?: Date;
  endTime?: Date;
  acceptanceTime?: Date;
  agreementType?: string;
  estimatedCharges?: EstimatedCharges;
  proposalSummary?: ProposalSummary;
  status?: AgreementStatus;
}
export const DescribeAgreementOutput = S.suspend(() =>
  S.Struct({
    agreementId: S.optional(S.String),
    acceptor: S.optional(Acceptor),
    proposer: S.optional(Proposer),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    acceptanceTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    agreementType: S.optional(S.String),
    estimatedCharges: S.optional(EstimatedCharges),
    proposalSummary: S.optional(ProposalSummary),
    status: S.optional(AgreementStatus),
  }),
).annotations({
  identifier: "DescribeAgreementOutput",
}) as any as S.Schema<DescribeAgreementOutput>;
export interface SearchAgreementsOutput {
  agreementViewSummaries?: AgreementViewSummary[];
  nextToken?: string;
}
export const SearchAgreementsOutput = S.suspend(() =>
  S.Struct({
    agreementViewSummaries: S.optional(AgreementViewSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchAgreementsOutput",
}) as any as S.Schema<SearchAgreementsOutput>;
export interface LegalTerm {
  type?: string;
  documents?: DocumentItem[];
}
export const LegalTerm = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), documents: S.optional(DocumentList) }),
).annotations({ identifier: "LegalTerm" }) as any as S.Schema<LegalTerm>;
export interface RenewalTerm {
  type?: string;
  configuration?: RenewalTermConfiguration;
}
export const RenewalTerm = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    configuration: S.optional(RenewalTermConfiguration),
  }),
).annotations({ identifier: "RenewalTerm" }) as any as S.Schema<RenewalTerm>;
export interface PaymentScheduleTerm {
  type?: string;
  currencyCode?: string;
  schedule?: ScheduleItem[];
}
export const PaymentScheduleTerm = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    currencyCode: S.optional(S.String),
    schedule: S.optional(ScheduleList),
  }),
).annotations({
  identifier: "PaymentScheduleTerm",
}) as any as S.Schema<PaymentScheduleTerm>;
export interface FreeTrialPricingTerm {
  type?: string;
  duration?: string;
  grants?: GrantItem[];
}
export const FreeTrialPricingTerm = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    duration: S.optional(S.String),
    grants: S.optional(GrantList),
  }),
).annotations({
  identifier: "FreeTrialPricingTerm",
}) as any as S.Schema<FreeTrialPricingTerm>;
export interface VariablePaymentTerm {
  type?: string;
  currencyCode?: string;
  maxTotalChargeAmount?: string;
  configuration?: VariablePaymentTermConfiguration;
}
export const VariablePaymentTerm = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    currencyCode: S.optional(S.String),
    maxTotalChargeAmount: S.optional(S.String),
    configuration: S.optional(VariablePaymentTermConfiguration),
  }),
).annotations({
  identifier: "VariablePaymentTerm",
}) as any as S.Schema<VariablePaymentTerm>;
export interface RateCardItem {
  dimensionKey?: string;
  price?: string;
}
export const RateCardItem = S.suspend(() =>
  S.Struct({ dimensionKey: S.optional(S.String), price: S.optional(S.String) }),
).annotations({ identifier: "RateCardItem" }) as any as S.Schema<RateCardItem>;
export type RateCardList = RateCardItem[];
export const RateCardList = S.Array(RateCardItem);
export interface Selector {
  type?: string;
  value?: string;
}
export const Selector = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "Selector" }) as any as S.Schema<Selector>;
export interface Constraints {
  multipleDimensionSelection?: string;
  quantityConfiguration?: string;
}
export const Constraints = S.suspend(() =>
  S.Struct({
    multipleDimensionSelection: S.optional(S.String),
    quantityConfiguration: S.optional(S.String),
  }),
).annotations({ identifier: "Constraints" }) as any as S.Schema<Constraints>;
export interface Dimension {
  dimensionKey: string;
  dimensionValue: number;
}
export const Dimension = S.suspend(() =>
  S.Struct({ dimensionKey: S.String, dimensionValue: S.Number }),
).annotations({ identifier: "Dimension" }) as any as S.Schema<Dimension>;
export type DimensionList = Dimension[];
export const DimensionList = S.Array(Dimension);
export interface UsageBasedRateCardItem {
  rateCard?: RateCardItem[];
}
export const UsageBasedRateCardItem = S.suspend(() =>
  S.Struct({ rateCard: S.optional(RateCardList) }),
).annotations({
  identifier: "UsageBasedRateCardItem",
}) as any as S.Schema<UsageBasedRateCardItem>;
export type UsageBasedRateCardList = UsageBasedRateCardItem[];
export const UsageBasedRateCardList = S.Array(UsageBasedRateCardItem);
export interface ConfigurableUpfrontRateCardItem {
  selector?: Selector;
  constraints?: Constraints;
  rateCard?: RateCardItem[];
}
export const ConfigurableUpfrontRateCardItem = S.suspend(() =>
  S.Struct({
    selector: S.optional(Selector),
    constraints: S.optional(Constraints),
    rateCard: S.optional(RateCardList),
  }),
).annotations({
  identifier: "ConfigurableUpfrontRateCardItem",
}) as any as S.Schema<ConfigurableUpfrontRateCardItem>;
export type ConfigurableUpfrontRateCardList = ConfigurableUpfrontRateCardItem[];
export const ConfigurableUpfrontRateCardList = S.Array(
  ConfigurableUpfrontRateCardItem,
);
export interface ConfigurableUpfrontPricingTermConfiguration {
  selectorValue: string;
  dimensions: Dimension[];
}
export const ConfigurableUpfrontPricingTermConfiguration = S.suspend(() =>
  S.Struct({ selectorValue: S.String, dimensions: DimensionList }),
).annotations({
  identifier: "ConfigurableUpfrontPricingTermConfiguration",
}) as any as S.Schema<ConfigurableUpfrontPricingTermConfiguration>;
export interface UsageBasedPricingTerm {
  type?: string;
  currencyCode?: string;
  rateCards?: UsageBasedRateCardItem[];
}
export const UsageBasedPricingTerm = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    currencyCode: S.optional(S.String),
    rateCards: S.optional(UsageBasedRateCardList),
  }),
).annotations({
  identifier: "UsageBasedPricingTerm",
}) as any as S.Schema<UsageBasedPricingTerm>;
export interface ConfigurableUpfrontPricingTerm {
  type?: string;
  currencyCode?: string;
  rateCards?: ConfigurableUpfrontRateCardItem[];
  configuration?: ConfigurableUpfrontPricingTermConfiguration;
}
export const ConfigurableUpfrontPricingTerm = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    currencyCode: S.optional(S.String),
    rateCards: S.optional(ConfigurableUpfrontRateCardList),
    configuration: S.optional(ConfigurableUpfrontPricingTermConfiguration),
  }),
).annotations({
  identifier: "ConfigurableUpfrontPricingTerm",
}) as any as S.Schema<ConfigurableUpfrontPricingTerm>;
export type AcceptedTerm =
  | {
      legalTerm: LegalTerm;
      supportTerm?: never;
      renewalTerm?: never;
      usageBasedPricingTerm?: never;
      configurableUpfrontPricingTerm?: never;
      byolPricingTerm?: never;
      recurringPaymentTerm?: never;
      validityTerm?: never;
      paymentScheduleTerm?: never;
      freeTrialPricingTerm?: never;
      fixedUpfrontPricingTerm?: never;
      variablePaymentTerm?: never;
    }
  | {
      legalTerm?: never;
      supportTerm: SupportTerm;
      renewalTerm?: never;
      usageBasedPricingTerm?: never;
      configurableUpfrontPricingTerm?: never;
      byolPricingTerm?: never;
      recurringPaymentTerm?: never;
      validityTerm?: never;
      paymentScheduleTerm?: never;
      freeTrialPricingTerm?: never;
      fixedUpfrontPricingTerm?: never;
      variablePaymentTerm?: never;
    }
  | {
      legalTerm?: never;
      supportTerm?: never;
      renewalTerm: RenewalTerm;
      usageBasedPricingTerm?: never;
      configurableUpfrontPricingTerm?: never;
      byolPricingTerm?: never;
      recurringPaymentTerm?: never;
      validityTerm?: never;
      paymentScheduleTerm?: never;
      freeTrialPricingTerm?: never;
      fixedUpfrontPricingTerm?: never;
      variablePaymentTerm?: never;
    }
  | {
      legalTerm?: never;
      supportTerm?: never;
      renewalTerm?: never;
      usageBasedPricingTerm: UsageBasedPricingTerm;
      configurableUpfrontPricingTerm?: never;
      byolPricingTerm?: never;
      recurringPaymentTerm?: never;
      validityTerm?: never;
      paymentScheduleTerm?: never;
      freeTrialPricingTerm?: never;
      fixedUpfrontPricingTerm?: never;
      variablePaymentTerm?: never;
    }
  | {
      legalTerm?: never;
      supportTerm?: never;
      renewalTerm?: never;
      usageBasedPricingTerm?: never;
      configurableUpfrontPricingTerm: ConfigurableUpfrontPricingTerm;
      byolPricingTerm?: never;
      recurringPaymentTerm?: never;
      validityTerm?: never;
      paymentScheduleTerm?: never;
      freeTrialPricingTerm?: never;
      fixedUpfrontPricingTerm?: never;
      variablePaymentTerm?: never;
    }
  | {
      legalTerm?: never;
      supportTerm?: never;
      renewalTerm?: never;
      usageBasedPricingTerm?: never;
      configurableUpfrontPricingTerm?: never;
      byolPricingTerm: ByolPricingTerm;
      recurringPaymentTerm?: never;
      validityTerm?: never;
      paymentScheduleTerm?: never;
      freeTrialPricingTerm?: never;
      fixedUpfrontPricingTerm?: never;
      variablePaymentTerm?: never;
    }
  | {
      legalTerm?: never;
      supportTerm?: never;
      renewalTerm?: never;
      usageBasedPricingTerm?: never;
      configurableUpfrontPricingTerm?: never;
      byolPricingTerm?: never;
      recurringPaymentTerm: RecurringPaymentTerm;
      validityTerm?: never;
      paymentScheduleTerm?: never;
      freeTrialPricingTerm?: never;
      fixedUpfrontPricingTerm?: never;
      variablePaymentTerm?: never;
    }
  | {
      legalTerm?: never;
      supportTerm?: never;
      renewalTerm?: never;
      usageBasedPricingTerm?: never;
      configurableUpfrontPricingTerm?: never;
      byolPricingTerm?: never;
      recurringPaymentTerm?: never;
      validityTerm: ValidityTerm;
      paymentScheduleTerm?: never;
      freeTrialPricingTerm?: never;
      fixedUpfrontPricingTerm?: never;
      variablePaymentTerm?: never;
    }
  | {
      legalTerm?: never;
      supportTerm?: never;
      renewalTerm?: never;
      usageBasedPricingTerm?: never;
      configurableUpfrontPricingTerm?: never;
      byolPricingTerm?: never;
      recurringPaymentTerm?: never;
      validityTerm?: never;
      paymentScheduleTerm: PaymentScheduleTerm;
      freeTrialPricingTerm?: never;
      fixedUpfrontPricingTerm?: never;
      variablePaymentTerm?: never;
    }
  | {
      legalTerm?: never;
      supportTerm?: never;
      renewalTerm?: never;
      usageBasedPricingTerm?: never;
      configurableUpfrontPricingTerm?: never;
      byolPricingTerm?: never;
      recurringPaymentTerm?: never;
      validityTerm?: never;
      paymentScheduleTerm?: never;
      freeTrialPricingTerm: FreeTrialPricingTerm;
      fixedUpfrontPricingTerm?: never;
      variablePaymentTerm?: never;
    }
  | {
      legalTerm?: never;
      supportTerm?: never;
      renewalTerm?: never;
      usageBasedPricingTerm?: never;
      configurableUpfrontPricingTerm?: never;
      byolPricingTerm?: never;
      recurringPaymentTerm?: never;
      validityTerm?: never;
      paymentScheduleTerm?: never;
      freeTrialPricingTerm?: never;
      fixedUpfrontPricingTerm: FixedUpfrontPricingTerm;
      variablePaymentTerm?: never;
    }
  | {
      legalTerm?: never;
      supportTerm?: never;
      renewalTerm?: never;
      usageBasedPricingTerm?: never;
      configurableUpfrontPricingTerm?: never;
      byolPricingTerm?: never;
      recurringPaymentTerm?: never;
      validityTerm?: never;
      paymentScheduleTerm?: never;
      freeTrialPricingTerm?: never;
      fixedUpfrontPricingTerm?: never;
      variablePaymentTerm: VariablePaymentTerm;
    };
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
export type AcceptedTermList = AcceptedTerm[];
export const AcceptedTermList = S.Array(AcceptedTerm);
export interface GetAgreementTermsOutput {
  acceptedTerms?: AcceptedTerm[];
  nextToken?: string;
}
export const GetAgreementTermsOutput = S.suspend(() =>
  S.Struct({
    acceptedTerms: S.optional(AcceptedTermList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAgreementTermsOutput",
}) as any as S.Schema<GetAgreementTermsOutput>;
export type ResourceType = "Agreement" | (string & {});
export const ResourceType = S.String;
export type ValidationExceptionReason =
  | "INVALID_AGREEMENT_ID"
  | "MISSING_AGREEMENT_ID"
  | "INVALID_CATALOG"
  | "INVALID_FILTER_NAME"
  | "INVALID_FILTER_VALUES"
  | "INVALID_SORT_BY"
  | "INVALID_SORT_ORDER"
  | "INVALID_NEXT_TOKEN"
  | "INVALID_MAX_RESULTS"
  | "UNSUPPORTED_FILTERS"
  | "OTHER"
  | (string & {});
export const ValidationExceptionReason = S.String;
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

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { requestId: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { requestId: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    requestId: S.optional(S.String),
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(ResourceType),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { requestId: S.optional(S.String), message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    requestId: S.optional(S.String),
    message: S.optional(S.String),
    reason: S.optional(ValidationExceptionReason),
    fields: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

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
export const searchAgreements: {
  (
    input: SearchAgreementsInput,
  ): effect.Effect<
    SearchAgreementsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchAgreementsInput,
  ) => stream.Stream<
    SearchAgreementsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchAgreementsInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
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
export const getAgreementTerms: {
  (
    input: GetAgreementTermsInput,
  ): effect.Effect<
    GetAgreementTermsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAgreementTermsInput,
  ) => stream.Stream<
    GetAgreementTermsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAgreementTermsInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Provides details about an agreement, such as the proposer, acceptor, start date, and end date.
 */
export const describeAgreement: (
  input: DescribeAgreementInput,
) => effect.Effect<
  DescribeAgreementOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
