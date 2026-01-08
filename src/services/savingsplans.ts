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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "savingsplans",
  serviceShapeName: "AWSSavingsPlan",
});
const auth = T.AwsAuthSigv4({ name: "savingsplans" });
const ver = T.ServiceVersion("2019-06-28");
const proto = T.AwsProtocolsRestJson1();
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
  const _p0 = () => ({
    authSchemes: [
      {
        name: "sigv4",
        signingName: "savingsplans",
        signingRegion: "us-east-1",
      },
    ],
  });
  if (!(Endpoint != null) && UseFIPS === false && UseDualStack === true) {
    {
      const PartitionResult = _.partition(Region);
      if (
        Region != null &&
        PartitionResult != null &&
        PartitionResult !== false
      ) {
        if (_.getAttr(PartitionResult, "name") === "aws") {
          return e("https://savingsplans.global.api.aws", _p0(), {});
        }
        if (_.getAttr(PartitionResult, "supportsDualStack") === true) {
          return e(
            `https://savingsplans.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return err(
          "DualStack is enabled but this partition does not support DualStack",
        );
      }
    }
    if (!(Region != null)) {
      return e("https://savingsplans.global.api.aws", _p0(), {});
    }
  }
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e("https://savingsplans.amazonaws.com", _p0(), {});
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://savingsplans-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://savingsplans-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://savingsplans.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://savingsplans.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type SavingsPlanOfferingId = string;
export type Amount = string;
export type ClientToken = string;
export type SavingsPlanId = string;
export type PaginationToken = string;
export type MaxResults = number;
export type SavingsPlanArn = string;
export type UUID = string;
export type SavingsPlanRateUsageType = string;
export type SavingsPlanRateOperation = string;
export type PageSize = number;
export type SavingsPlansDuration = number;
export type SavingsPlanDescription = string;
export type SavingsPlanServiceCode = string;
export type SavingsPlanUsageType = string;
export type SavingsPlanOperation = string;
export type TagKey = string;
export type TagValue = string;
export type JsonSafeFilterValueString = string;
export type Region = string;
export type EC2InstanceFamily = string;
export type TermDurationInSeconds = number;
export type SavingsPlanRatePricePerUnit = string;

//# Schemas
export type SavingsPlanArnList = string[];
export const SavingsPlanArnList = S.Array(S.String);
export type SavingsPlanIdList = string[];
export const SavingsPlanIdList = S.Array(S.String);
export type SavingsPlanState =
  | "payment-pending"
  | "payment-failed"
  | "active"
  | "retired"
  | "queued"
  | "queued-deleted"
  | "pending-return"
  | "returned";
export const SavingsPlanState = S.Literal(
  "payment-pending",
  "payment-failed",
  "active",
  "retired",
  "queued",
  "queued-deleted",
  "pending-return",
  "returned",
);
export type SavingsPlanStateList = SavingsPlanState[];
export const SavingsPlanStateList = S.Array(SavingsPlanState);
export type UUIDs = string[];
export const UUIDs = S.Array(S.String);
export type SavingsPlanPaymentOption =
  | "All Upfront"
  | "Partial Upfront"
  | "No Upfront";
export const SavingsPlanPaymentOption = S.Literal(
  "All Upfront",
  "Partial Upfront",
  "No Upfront",
);
export type SavingsPlanPaymentOptionList = SavingsPlanPaymentOption[];
export const SavingsPlanPaymentOptionList = S.Array(SavingsPlanPaymentOption);
export type SavingsPlanType =
  | "Compute"
  | "EC2Instance"
  | "SageMaker"
  | "Database";
export const SavingsPlanType = S.Literal(
  "Compute",
  "EC2Instance",
  "SageMaker",
  "Database",
);
export type SavingsPlanTypeList = SavingsPlanType[];
export const SavingsPlanTypeList = S.Array(SavingsPlanType);
export type SavingsPlanProductType =
  | "EC2"
  | "Fargate"
  | "Lambda"
  | "SageMaker"
  | "RDS"
  | "DSQL"
  | "DynamoDB"
  | "ElastiCache"
  | "DocDB"
  | "Neptune"
  | "Timestream"
  | "Keyspaces"
  | "DMS";
export const SavingsPlanProductType = S.Literal(
  "EC2",
  "Fargate",
  "Lambda",
  "SageMaker",
  "RDS",
  "DSQL",
  "DynamoDB",
  "ElastiCache",
  "DocDB",
  "Neptune",
  "Timestream",
  "Keyspaces",
  "DMS",
);
export type SavingsPlanProductTypeList = SavingsPlanProductType[];
export const SavingsPlanProductTypeList = S.Array(SavingsPlanProductType);
export type SavingsPlanRateServiceCode =
  | "AmazonEC2"
  | "AmazonECS"
  | "AmazonEKS"
  | "AWSLambda"
  | "AmazonSageMaker"
  | "AmazonRDS"
  | "AuroraDSQL"
  | "AmazonDynamoDB"
  | "AmazonElastiCache"
  | "AmazonDocDB"
  | "AmazonNeptune"
  | "AmazonTimestream"
  | "AmazonMCS"
  | "AWSDatabaseMigrationSvc";
export const SavingsPlanRateServiceCode = S.Literal(
  "AmazonEC2",
  "AmazonECS",
  "AmazonEKS",
  "AWSLambda",
  "AmazonSageMaker",
  "AmazonRDS",
  "AuroraDSQL",
  "AmazonDynamoDB",
  "AmazonElastiCache",
  "AmazonDocDB",
  "AmazonNeptune",
  "AmazonTimestream",
  "AmazonMCS",
  "AWSDatabaseMigrationSvc",
);
export type SavingsPlanRateServiceCodeList = SavingsPlanRateServiceCode[];
export const SavingsPlanRateServiceCodeList = S.Array(
  SavingsPlanRateServiceCode,
);
export type SavingsPlanRateUsageTypeList = string[];
export const SavingsPlanRateUsageTypeList = S.Array(S.String);
export type SavingsPlanRateOperationList = string[];
export const SavingsPlanRateOperationList = S.Array(S.String);
export type DurationsList = number[];
export const DurationsList = S.Array(S.Number);
export type CurrencyCode = "CNY" | "USD" | "EUR";
export const CurrencyCode = S.Literal("CNY", "USD", "EUR");
export type CurrencyList = CurrencyCode[];
export const CurrencyList = S.Array(CurrencyCode);
export type SavingsPlanDescriptionsList = string[];
export const SavingsPlanDescriptionsList = S.Array(S.String);
export type SavingsPlanServiceCodeList = string[];
export const SavingsPlanServiceCodeList = S.Array(S.String);
export type SavingsPlanUsageTypeList = string[];
export const SavingsPlanUsageTypeList = S.Array(S.String);
export type SavingsPlanOperationList = string[];
export const SavingsPlanOperationList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteQueuedSavingsPlanRequest {
  savingsPlanId: string;
}
export const DeleteQueuedSavingsPlanRequest = S.suspend(() =>
  S.Struct({ savingsPlanId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteQueuedSavingsPlan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteQueuedSavingsPlanRequest",
}) as any as S.Schema<DeleteQueuedSavingsPlanRequest>;
export interface DeleteQueuedSavingsPlanResponse {}
export const DeleteQueuedSavingsPlanResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteQueuedSavingsPlanResponse",
}) as any as S.Schema<DeleteQueuedSavingsPlanResponse>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTagsForResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ReturnSavingsPlanRequest {
  savingsPlanId: string;
  clientToken?: string;
}
export const ReturnSavingsPlanRequest = S.suspend(() =>
  S.Struct({
    savingsPlanId: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ReturnSavingsPlan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ReturnSavingsPlanRequest",
}) as any as S.Schema<ReturnSavingsPlanRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagMap }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TagResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UntagResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type SavingsPlanRateFilterName =
  | "region"
  | "instanceType"
  | "productDescription"
  | "tenancy"
  | "productType"
  | "serviceCode"
  | "usageType"
  | "operation";
export const SavingsPlanRateFilterName = S.Literal(
  "region",
  "instanceType",
  "productDescription",
  "tenancy",
  "productType",
  "serviceCode",
  "usageType",
  "operation",
);
export type ListOfStrings = string[];
export const ListOfStrings = S.Array(S.String);
export type SavingsPlansFilterName =
  | "region"
  | "ec2-instance-family"
  | "commitment"
  | "upfront"
  | "term"
  | "savings-plan-type"
  | "payment-option"
  | "start"
  | "end"
  | "instance-family";
export const SavingsPlansFilterName = S.Literal(
  "region",
  "ec2-instance-family",
  "commitment",
  "upfront",
  "term",
  "savings-plan-type",
  "payment-option",
  "start",
  "end",
  "instance-family",
);
export type SavingsPlanRateFilterAttribute =
  | "region"
  | "instanceFamily"
  | "instanceType"
  | "productDescription"
  | "tenancy"
  | "productId";
export const SavingsPlanRateFilterAttribute = S.Literal(
  "region",
  "instanceFamily",
  "instanceType",
  "productDescription",
  "tenancy",
  "productId",
);
export type FilterValuesList = string[];
export const FilterValuesList = S.Array(S.String);
export type SavingsPlanOfferingFilterAttribute = "region" | "instanceFamily";
export const SavingsPlanOfferingFilterAttribute = S.Literal(
  "region",
  "instanceFamily",
);
export interface SavingsPlanRateFilter {
  name?: SavingsPlanRateFilterName;
  values?: string[];
}
export const SavingsPlanRateFilter = S.suspend(() =>
  S.Struct({
    name: S.optional(SavingsPlanRateFilterName),
    values: S.optional(ListOfStrings),
  }),
).annotations({
  identifier: "SavingsPlanRateFilter",
}) as any as S.Schema<SavingsPlanRateFilter>;
export type SavingsPlanRateFilterList = SavingsPlanRateFilter[];
export const SavingsPlanRateFilterList = S.Array(SavingsPlanRateFilter);
export interface SavingsPlanFilter {
  name?: SavingsPlansFilterName;
  values?: string[];
}
export const SavingsPlanFilter = S.suspend(() =>
  S.Struct({
    name: S.optional(SavingsPlansFilterName),
    values: S.optional(ListOfStrings),
  }),
).annotations({
  identifier: "SavingsPlanFilter",
}) as any as S.Schema<SavingsPlanFilter>;
export type SavingsPlanFilterList = SavingsPlanFilter[];
export const SavingsPlanFilterList = S.Array(SavingsPlanFilter);
export interface SavingsPlanOfferingRateFilterElement {
  name?: SavingsPlanRateFilterAttribute;
  values?: string[];
}
export const SavingsPlanOfferingRateFilterElement = S.suspend(() =>
  S.Struct({
    name: S.optional(SavingsPlanRateFilterAttribute),
    values: S.optional(FilterValuesList),
  }),
).annotations({
  identifier: "SavingsPlanOfferingRateFilterElement",
}) as any as S.Schema<SavingsPlanOfferingRateFilterElement>;
export type SavingsPlanOfferingRateFiltersList =
  SavingsPlanOfferingRateFilterElement[];
export const SavingsPlanOfferingRateFiltersList = S.Array(
  SavingsPlanOfferingRateFilterElement,
);
export interface SavingsPlanOfferingFilterElement {
  name?: SavingsPlanOfferingFilterAttribute;
  values?: string[];
}
export const SavingsPlanOfferingFilterElement = S.suspend(() =>
  S.Struct({
    name: S.optional(SavingsPlanOfferingFilterAttribute),
    values: S.optional(FilterValuesList),
  }),
).annotations({
  identifier: "SavingsPlanOfferingFilterElement",
}) as any as S.Schema<SavingsPlanOfferingFilterElement>;
export type SavingsPlanOfferingFiltersList = SavingsPlanOfferingFilterElement[];
export const SavingsPlanOfferingFiltersList = S.Array(
  SavingsPlanOfferingFilterElement,
);
export interface CreateSavingsPlanRequest {
  savingsPlanOfferingId: string;
  commitment: string;
  upfrontPaymentAmount?: string;
  purchaseTime?: Date;
  clientToken?: string;
  tags?: { [key: string]: string };
}
export const CreateSavingsPlanRequest = S.suspend(() =>
  S.Struct({
    savingsPlanOfferingId: S.String,
    commitment: S.String,
    upfrontPaymentAmount: S.optional(S.String),
    purchaseTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateSavingsPlan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSavingsPlanRequest",
}) as any as S.Schema<CreateSavingsPlanRequest>;
export interface DescribeSavingsPlanRatesRequest {
  savingsPlanId: string;
  filters?: SavingsPlanRateFilter[];
  nextToken?: string;
  maxResults?: number;
}
export const DescribeSavingsPlanRatesRequest = S.suspend(() =>
  S.Struct({
    savingsPlanId: S.String,
    filters: S.optional(SavingsPlanRateFilterList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeSavingsPlanRates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSavingsPlanRatesRequest",
}) as any as S.Schema<DescribeSavingsPlanRatesRequest>;
export interface DescribeSavingsPlansRequest {
  savingsPlanArns?: string[];
  savingsPlanIds?: string[];
  nextToken?: string;
  maxResults?: number;
  states?: SavingsPlanState[];
  filters?: SavingsPlanFilter[];
}
export const DescribeSavingsPlansRequest = S.suspend(() =>
  S.Struct({
    savingsPlanArns: S.optional(SavingsPlanArnList),
    savingsPlanIds: S.optional(SavingsPlanIdList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    states: S.optional(SavingsPlanStateList),
    filters: S.optional(SavingsPlanFilterList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeSavingsPlans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSavingsPlansRequest",
}) as any as S.Schema<DescribeSavingsPlansRequest>;
export interface DescribeSavingsPlansOfferingRatesRequest {
  savingsPlanOfferingIds?: string[];
  savingsPlanPaymentOptions?: SavingsPlanPaymentOption[];
  savingsPlanTypes?: SavingsPlanType[];
  products?: SavingsPlanProductType[];
  serviceCodes?: SavingsPlanRateServiceCode[];
  usageTypes?: string[];
  operations?: string[];
  filters?: SavingsPlanOfferingRateFilterElement[];
  nextToken?: string;
  maxResults?: number;
}
export const DescribeSavingsPlansOfferingRatesRequest = S.suspend(() =>
  S.Struct({
    savingsPlanOfferingIds: S.optional(UUIDs),
    savingsPlanPaymentOptions: S.optional(SavingsPlanPaymentOptionList),
    savingsPlanTypes: S.optional(SavingsPlanTypeList),
    products: S.optional(SavingsPlanProductTypeList),
    serviceCodes: S.optional(SavingsPlanRateServiceCodeList),
    usageTypes: S.optional(SavingsPlanRateUsageTypeList),
    operations: S.optional(SavingsPlanRateOperationList),
    filters: S.optional(SavingsPlanOfferingRateFiltersList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeSavingsPlansOfferingRates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSavingsPlansOfferingRatesRequest",
}) as any as S.Schema<DescribeSavingsPlansOfferingRatesRequest>;
export interface DescribeSavingsPlansOfferingsRequest {
  offeringIds?: string[];
  paymentOptions?: SavingsPlanPaymentOption[];
  productType?: SavingsPlanProductType;
  planTypes?: SavingsPlanType[];
  durations?: number[];
  currencies?: CurrencyCode[];
  descriptions?: string[];
  serviceCodes?: string[];
  usageTypes?: string[];
  operations?: string[];
  filters?: SavingsPlanOfferingFilterElement[];
  nextToken?: string;
  maxResults?: number;
}
export const DescribeSavingsPlansOfferingsRequest = S.suspend(() =>
  S.Struct({
    offeringIds: S.optional(UUIDs),
    paymentOptions: S.optional(SavingsPlanPaymentOptionList),
    productType: S.optional(SavingsPlanProductType),
    planTypes: S.optional(SavingsPlanTypeList),
    durations: S.optional(DurationsList),
    currencies: S.optional(CurrencyList),
    descriptions: S.optional(SavingsPlanDescriptionsList),
    serviceCodes: S.optional(SavingsPlanServiceCodeList),
    usageTypes: S.optional(SavingsPlanUsageTypeList),
    operations: S.optional(SavingsPlanOperationList),
    filters: S.optional(SavingsPlanOfferingFiltersList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeSavingsPlansOfferings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSavingsPlansOfferingsRequest",
}) as any as S.Schema<DescribeSavingsPlansOfferingsRequest>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ReturnSavingsPlanResponse {
  savingsPlanId?: string;
}
export const ReturnSavingsPlanResponse = S.suspend(() =>
  S.Struct({ savingsPlanId: S.optional(S.String) }),
).annotations({
  identifier: "ReturnSavingsPlanResponse",
}) as any as S.Schema<ReturnSavingsPlanResponse>;
export interface CreateSavingsPlanResponse {
  savingsPlanId?: string;
}
export const CreateSavingsPlanResponse = S.suspend(() =>
  S.Struct({ savingsPlanId: S.optional(S.String) }),
).annotations({
  identifier: "CreateSavingsPlanResponse",
}) as any as S.Schema<CreateSavingsPlanResponse>;
export type SavingsPlanRateUnit =
  | "Hrs"
  | "Lambda-GB-Second"
  | "Request"
  | "ACU-Hr"
  | "ReadRequestUnits"
  | "WriteRequestUnits"
  | "ReadCapacityUnit-Hrs"
  | "WriteCapacityUnit-Hrs"
  | "ReplicatedWriteRequestUnits"
  | "ReplicatedWriteCapacityUnit-Hrs"
  | "GB-Hours"
  | "DPU"
  | "ElastiCacheProcessingUnit"
  | "DCU-Hr"
  | "NCU-hr";
export const SavingsPlanRateUnit = S.Literal(
  "Hrs",
  "Lambda-GB-Second",
  "Request",
  "ACU-Hr",
  "ReadRequestUnits",
  "WriteRequestUnits",
  "ReadCapacityUnit-Hrs",
  "WriteCapacityUnit-Hrs",
  "ReplicatedWriteRequestUnits",
  "ReplicatedWriteCapacityUnit-Hrs",
  "GB-Hours",
  "DPU",
  "ElastiCacheProcessingUnit",
  "DCU-Hr",
  "NCU-hr",
);
export interface SavingsPlan {
  offeringId?: string;
  savingsPlanId?: string;
  savingsPlanArn?: string;
  description?: string;
  start?: string;
  end?: string;
  state?: SavingsPlanState;
  region?: string;
  ec2InstanceFamily?: string;
  savingsPlanType?: SavingsPlanType;
  paymentOption?: SavingsPlanPaymentOption;
  productTypes?: SavingsPlanProductType[];
  currency?: CurrencyCode;
  commitment?: string;
  upfrontPaymentAmount?: string;
  recurringPaymentAmount?: string;
  termDurationInSeconds?: number;
  tags?: { [key: string]: string };
  returnableUntil?: string;
}
export const SavingsPlan = S.suspend(() =>
  S.Struct({
    offeringId: S.optional(S.String),
    savingsPlanId: S.optional(S.String),
    savingsPlanArn: S.optional(S.String),
    description: S.optional(S.String),
    start: S.optional(S.String),
    end: S.optional(S.String),
    state: S.optional(SavingsPlanState),
    region: S.optional(S.String),
    ec2InstanceFamily: S.optional(S.String),
    savingsPlanType: S.optional(SavingsPlanType),
    paymentOption: S.optional(SavingsPlanPaymentOption),
    productTypes: S.optional(SavingsPlanProductTypeList),
    currency: S.optional(CurrencyCode),
    commitment: S.optional(S.String),
    upfrontPaymentAmount: S.optional(S.String),
    recurringPaymentAmount: S.optional(S.String),
    termDurationInSeconds: S.optional(S.Number),
    tags: S.optional(TagMap),
    returnableUntil: S.optional(S.String),
  }),
).annotations({ identifier: "SavingsPlan" }) as any as S.Schema<SavingsPlan>;
export type SavingsPlanList = SavingsPlan[];
export const SavingsPlanList = S.Array(SavingsPlan);
export type SavingsPlanRatePropertyKey =
  | "region"
  | "instanceType"
  | "instanceFamily"
  | "productDescription"
  | "tenancy";
export const SavingsPlanRatePropertyKey = S.Literal(
  "region",
  "instanceType",
  "instanceFamily",
  "productDescription",
  "tenancy",
);
export type SavingsPlanOfferingPropertyKey = "region" | "instanceFamily";
export const SavingsPlanOfferingPropertyKey = S.Literal(
  "region",
  "instanceFamily",
);
export interface DescribeSavingsPlansResponse {
  savingsPlans?: SavingsPlan[];
  nextToken?: string;
}
export const DescribeSavingsPlansResponse = S.suspend(() =>
  S.Struct({
    savingsPlans: S.optional(SavingsPlanList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSavingsPlansResponse",
}) as any as S.Schema<DescribeSavingsPlansResponse>;
export interface SavingsPlanRateProperty {
  name?: SavingsPlanRatePropertyKey;
  value?: string;
}
export const SavingsPlanRateProperty = S.suspend(() =>
  S.Struct({
    name: S.optional(SavingsPlanRatePropertyKey),
    value: S.optional(S.String),
  }),
).annotations({
  identifier: "SavingsPlanRateProperty",
}) as any as S.Schema<SavingsPlanRateProperty>;
export type SavingsPlanRatePropertyList = SavingsPlanRateProperty[];
export const SavingsPlanRatePropertyList = S.Array(SavingsPlanRateProperty);
export interface ParentSavingsPlanOffering {
  offeringId?: string;
  paymentOption?: SavingsPlanPaymentOption;
  planType?: SavingsPlanType;
  durationSeconds?: number;
  currency?: CurrencyCode;
  planDescription?: string;
}
export const ParentSavingsPlanOffering = S.suspend(() =>
  S.Struct({
    offeringId: S.optional(S.String),
    paymentOption: S.optional(SavingsPlanPaymentOption),
    planType: S.optional(SavingsPlanType),
    durationSeconds: S.optional(S.Number),
    currency: S.optional(CurrencyCode),
    planDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "ParentSavingsPlanOffering",
}) as any as S.Schema<ParentSavingsPlanOffering>;
export interface SavingsPlanOfferingRateProperty {
  name?: string;
  value?: string;
}
export const SavingsPlanOfferingRateProperty = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.String) }),
).annotations({
  identifier: "SavingsPlanOfferingRateProperty",
}) as any as S.Schema<SavingsPlanOfferingRateProperty>;
export type SavingsPlanOfferingRatePropertyList =
  SavingsPlanOfferingRateProperty[];
export const SavingsPlanOfferingRatePropertyList = S.Array(
  SavingsPlanOfferingRateProperty,
);
export interface SavingsPlanOfferingProperty {
  name?: SavingsPlanOfferingPropertyKey;
  value?: string;
}
export const SavingsPlanOfferingProperty = S.suspend(() =>
  S.Struct({
    name: S.optional(SavingsPlanOfferingPropertyKey),
    value: S.optional(S.String),
  }),
).annotations({
  identifier: "SavingsPlanOfferingProperty",
}) as any as S.Schema<SavingsPlanOfferingProperty>;
export type SavingsPlanOfferingPropertyList = SavingsPlanOfferingProperty[];
export const SavingsPlanOfferingPropertyList = S.Array(
  SavingsPlanOfferingProperty,
);
export interface SavingsPlanRate {
  rate?: string;
  currency?: CurrencyCode;
  unit?: SavingsPlanRateUnit;
  productType?: SavingsPlanProductType;
  serviceCode?: SavingsPlanRateServiceCode;
  usageType?: string;
  operation?: string;
  properties?: SavingsPlanRateProperty[];
}
export const SavingsPlanRate = S.suspend(() =>
  S.Struct({
    rate: S.optional(S.String),
    currency: S.optional(CurrencyCode),
    unit: S.optional(SavingsPlanRateUnit),
    productType: S.optional(SavingsPlanProductType),
    serviceCode: S.optional(SavingsPlanRateServiceCode),
    usageType: S.optional(S.String),
    operation: S.optional(S.String),
    properties: S.optional(SavingsPlanRatePropertyList),
  }),
).annotations({
  identifier: "SavingsPlanRate",
}) as any as S.Schema<SavingsPlanRate>;
export type SavingsPlanRateList = SavingsPlanRate[];
export const SavingsPlanRateList = S.Array(SavingsPlanRate);
export interface SavingsPlanOfferingRate {
  savingsPlanOffering?: ParentSavingsPlanOffering;
  rate?: string;
  unit?: SavingsPlanRateUnit;
  productType?: SavingsPlanProductType;
  serviceCode?: SavingsPlanRateServiceCode;
  usageType?: string;
  operation?: string;
  properties?: SavingsPlanOfferingRateProperty[];
}
export const SavingsPlanOfferingRate = S.suspend(() =>
  S.Struct({
    savingsPlanOffering: S.optional(ParentSavingsPlanOffering),
    rate: S.optional(S.String),
    unit: S.optional(SavingsPlanRateUnit),
    productType: S.optional(SavingsPlanProductType),
    serviceCode: S.optional(SavingsPlanRateServiceCode),
    usageType: S.optional(S.String),
    operation: S.optional(S.String),
    properties: S.optional(SavingsPlanOfferingRatePropertyList),
  }),
).annotations({
  identifier: "SavingsPlanOfferingRate",
}) as any as S.Schema<SavingsPlanOfferingRate>;
export type SavingsPlanOfferingRatesList = SavingsPlanOfferingRate[];
export const SavingsPlanOfferingRatesList = S.Array(SavingsPlanOfferingRate);
export interface SavingsPlanOffering {
  offeringId?: string;
  productTypes?: SavingsPlanProductType[];
  planType?: SavingsPlanType;
  description?: string;
  paymentOption?: SavingsPlanPaymentOption;
  durationSeconds?: number;
  currency?: CurrencyCode;
  serviceCode?: string;
  usageType?: string;
  operation?: string;
  properties?: SavingsPlanOfferingProperty[];
}
export const SavingsPlanOffering = S.suspend(() =>
  S.Struct({
    offeringId: S.optional(S.String),
    productTypes: S.optional(SavingsPlanProductTypeList),
    planType: S.optional(SavingsPlanType),
    description: S.optional(S.String),
    paymentOption: S.optional(SavingsPlanPaymentOption),
    durationSeconds: S.optional(S.Number),
    currency: S.optional(CurrencyCode),
    serviceCode: S.optional(S.String),
    usageType: S.optional(S.String),
    operation: S.optional(S.String),
    properties: S.optional(SavingsPlanOfferingPropertyList),
  }),
).annotations({
  identifier: "SavingsPlanOffering",
}) as any as S.Schema<SavingsPlanOffering>;
export type SavingsPlanOfferingsList = SavingsPlanOffering[];
export const SavingsPlanOfferingsList = S.Array(SavingsPlanOffering);
export interface DescribeSavingsPlanRatesResponse {
  savingsPlanId?: string;
  searchResults?: SavingsPlanRate[];
  nextToken?: string;
}
export const DescribeSavingsPlanRatesResponse = S.suspend(() =>
  S.Struct({
    savingsPlanId: S.optional(S.String),
    searchResults: S.optional(SavingsPlanRateList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSavingsPlanRatesResponse",
}) as any as S.Schema<DescribeSavingsPlanRatesResponse>;
export interface DescribeSavingsPlansOfferingRatesResponse {
  searchResults?: SavingsPlanOfferingRate[];
  nextToken?: string;
}
export const DescribeSavingsPlansOfferingRatesResponse = S.suspend(() =>
  S.Struct({
    searchResults: S.optional(SavingsPlanOfferingRatesList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSavingsPlansOfferingRatesResponse",
}) as any as S.Schema<DescribeSavingsPlansOfferingRatesResponse>;
export interface DescribeSavingsPlansOfferingsResponse {
  searchResults?: SavingsPlanOffering[];
  nextToken?: string;
}
export const DescribeSavingsPlansOfferingsResponse = S.suspend(() =>
  S.Struct({
    searchResults: S.optional(SavingsPlanOfferingsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSavingsPlansOfferingsResponse",
}) as any as S.Schema<DescribeSavingsPlansOfferingsResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.AwsQueryError({ code: "InternalServerException", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
  T.AwsQueryError({
    code: "ServiceQuotaExceededException",
    httpResponseCode: 402,
  }),
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the specified Savings Plan.
 */
export const returnSavingsPlan: (
  input: ReturnSavingsPlanRequest,
) => effect.Effect<
  ReturnSavingsPlanResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReturnSavingsPlanRequest,
  output: ReturnSavingsPlanResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Adds the specified tags to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a Savings Plan.
 */
export const createSavingsPlan: (
  input: CreateSavingsPlanRequest,
) => effect.Effect<
  CreateSavingsPlanResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSavingsPlanRequest,
  output: CreateSavingsPlanResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the queued purchase for the specified Savings Plan.
 */
export const deleteQueuedSavingsPlan: (
  input: DeleteQueuedSavingsPlanRequest,
) => effect.Effect<
  DeleteQueuedSavingsPlanResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQueuedSavingsPlanRequest,
  output: DeleteQueuedSavingsPlanResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Describes the specified Savings Plans.
 */
export const describeSavingsPlans: (
  input: DescribeSavingsPlansRequest,
) => effect.Effect<
  DescribeSavingsPlansResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSavingsPlansRequest,
  output: DescribeSavingsPlansResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Describes the rates for a specific, existing Savings Plan.
 */
export const describeSavingsPlanRates: (
  input: DescribeSavingsPlanRatesRequest,
) => effect.Effect<
  DescribeSavingsPlanRatesResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSavingsPlanRatesRequest,
  output: DescribeSavingsPlanRatesResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the offering rates for Savings Plans you might want to purchase.
 */
export const describeSavingsPlansOfferingRates: (
  input: DescribeSavingsPlansOfferingRatesRequest,
) => effect.Effect<
  DescribeSavingsPlansOfferingRatesResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSavingsPlansOfferingRatesRequest,
  output: DescribeSavingsPlansOfferingRatesResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Describes the offerings for the specified Savings Plans.
 */
export const describeSavingsPlansOfferings: (
  input: DescribeSavingsPlansOfferingsRequest,
) => effect.Effect<
  DescribeSavingsPlansOfferingsResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSavingsPlansOfferingsRequest,
  output: DescribeSavingsPlansOfferingsResponse,
  errors: [InternalServerException, ValidationException],
}));
