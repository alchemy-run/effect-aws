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
  sdkId: "Marketplace Commerce Analytics",
  serviceShapeName: "MarketplaceCommerceAnalytics20150701",
});
const auth = T.AwsAuthSigv4({ name: "marketplacecommerceanalytics" });
const ver = T.ServiceVersion("2015-07-01");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://marketplacecommerceanalytics-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://marketplacecommerceanalytics-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://marketplacecommerceanalytics.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://marketplacecommerceanalytics.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DataSetPublicationDate = Date;
export type RoleNameArn = string;
export type DestinationS3BucketName = string;
export type DestinationS3Prefix = string;
export type SnsTopicArn = string;
export type FromDate = Date;
export type OptionalKey = string;
export type OptionalValue = string;
export type DataSetRequestId = string;
export type ExceptionMessage = string;

//# Schemas
export type DataSetType =
  | "customer_subscriber_hourly_monthly_subscriptions"
  | "customer_subscriber_annual_subscriptions"
  | "daily_business_usage_by_instance_type"
  | "daily_business_fees"
  | "daily_business_free_trial_conversions"
  | "daily_business_new_instances"
  | "daily_business_new_product_subscribers"
  | "daily_business_canceled_product_subscribers"
  | "monthly_revenue_billing_and_revenue_data"
  | "monthly_revenue_annual_subscriptions"
  | "monthly_revenue_field_demonstration_usage"
  | "monthly_revenue_flexible_payment_schedule"
  | "disbursed_amount_by_product"
  | "disbursed_amount_by_product_with_uncollected_funds"
  | "disbursed_amount_by_instance_hours"
  | "disbursed_amount_by_customer_geo"
  | "disbursed_amount_by_age_of_uncollected_funds"
  | "disbursed_amount_by_age_of_disbursed_funds"
  | "disbursed_amount_by_age_of_past_due_funds"
  | "disbursed_amount_by_uncollected_funds_breakdown"
  | "customer_profile_by_industry"
  | "customer_profile_by_revenue"
  | "customer_profile_by_geography"
  | "sales_compensation_billed_revenue"
  | "us_sales_and_use_tax_records";
export const DataSetType = S.Literal(
  "customer_subscriber_hourly_monthly_subscriptions",
  "customer_subscriber_annual_subscriptions",
  "daily_business_usage_by_instance_type",
  "daily_business_fees",
  "daily_business_free_trial_conversions",
  "daily_business_new_instances",
  "daily_business_new_product_subscribers",
  "daily_business_canceled_product_subscribers",
  "monthly_revenue_billing_and_revenue_data",
  "monthly_revenue_annual_subscriptions",
  "monthly_revenue_field_demonstration_usage",
  "monthly_revenue_flexible_payment_schedule",
  "disbursed_amount_by_product",
  "disbursed_amount_by_product_with_uncollected_funds",
  "disbursed_amount_by_instance_hours",
  "disbursed_amount_by_customer_geo",
  "disbursed_amount_by_age_of_uncollected_funds",
  "disbursed_amount_by_age_of_disbursed_funds",
  "disbursed_amount_by_age_of_past_due_funds",
  "disbursed_amount_by_uncollected_funds_breakdown",
  "customer_profile_by_industry",
  "customer_profile_by_revenue",
  "customer_profile_by_geography",
  "sales_compensation_billed_revenue",
  "us_sales_and_use_tax_records",
);
export type SupportDataSetType =
  | "customer_support_contacts_data"
  | "test_customer_support_contacts_data";
export const SupportDataSetType = S.Literal(
  "customer_support_contacts_data",
  "test_customer_support_contacts_data",
);
export type CustomerDefinedValues = { [key: string]: string };
export const CustomerDefinedValues = S.Record({
  key: S.String,
  value: S.String,
});
export interface StartSupportDataExportRequest {
  dataSetType: SupportDataSetType;
  fromDate: Date;
  roleNameArn: string;
  destinationS3BucketName: string;
  destinationS3Prefix?: string;
  snsTopicArn: string;
  customerDefinedValues?: { [key: string]: string };
}
export const StartSupportDataExportRequest = S.suspend(() =>
  S.Struct({
    dataSetType: SupportDataSetType,
    fromDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    roleNameArn: S.String,
    destinationS3BucketName: S.String,
    destinationS3Prefix: S.optional(S.String),
    snsTopicArn: S.String,
    customerDefinedValues: S.optional(CustomerDefinedValues),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartSupportDataExportRequest",
}) as any as S.Schema<StartSupportDataExportRequest>;
export interface GenerateDataSetRequest {
  dataSetType: DataSetType;
  dataSetPublicationDate: Date;
  roleNameArn: string;
  destinationS3BucketName: string;
  destinationS3Prefix?: string;
  snsTopicArn: string;
  customerDefinedValues?: { [key: string]: string };
}
export const GenerateDataSetRequest = S.suspend(() =>
  S.Struct({
    dataSetType: DataSetType,
    dataSetPublicationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    roleNameArn: S.String,
    destinationS3BucketName: S.String,
    destinationS3Prefix: S.optional(S.String),
    snsTopicArn: S.String,
    customerDefinedValues: S.optional(CustomerDefinedValues),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GenerateDataSetRequest",
}) as any as S.Schema<GenerateDataSetRequest>;
export interface StartSupportDataExportResult {
  dataSetRequestId?: string;
}
export const StartSupportDataExportResult = S.suspend(() =>
  S.Struct({ dataSetRequestId: S.optional(S.String) }),
).annotations({
  identifier: "StartSupportDataExportResult",
}) as any as S.Schema<StartSupportDataExportResult>;
export interface GenerateDataSetResult {
  dataSetRequestId?: string;
}
export const GenerateDataSetResult = S.suspend(() =>
  S.Struct({ dataSetRequestId: S.optional(S.String) }),
).annotations({
  identifier: "GenerateDataSetResult",
}) as any as S.Schema<GenerateDataSetResult>;

//# Errors
export class MarketplaceCommerceAnalyticsException extends S.TaggedError<MarketplaceCommerceAnalyticsException>()(
  "MarketplaceCommerceAnalyticsException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * *This target has been deprecated.* Given a data set type and a from date, asynchronously publishes the requested customer support data
 * to the specified S3 bucket and notifies the specified SNS topic once the data is available. Returns a unique request
 * identifier that can be used to correlate requests with notifications from the SNS topic.
 * Data sets will be published in comma-separated values (CSV) format with the file name {data_set_type}_YYYY-MM-DD'T'HH-mm-ss'Z'.csv.
 * If a file with the same name already exists (e.g. if the same data set is requested twice), the original file will
 * be overwritten by the new file.
 * Requires a Role with an attached permissions policy providing Allow permissions for the following actions:
 * s3:PutObject, s3:GetBucketLocation, sns:GetTopicAttributes, sns:Publish, iam:GetRolePolicy.
 */
export const startSupportDataExport: (
  input: StartSupportDataExportRequest,
) => effect.Effect<
  StartSupportDataExportResult,
  MarketplaceCommerceAnalyticsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSupportDataExportRequest,
  output: StartSupportDataExportResult,
  errors: [MarketplaceCommerceAnalyticsException],
}));
/**
 * Given a data set type and data set publication date, asynchronously publishes the requested data set to the specified
 * S3 bucket and notifies the specified SNS topic once the data is available. Returns a unique request identifier that
 * can be used to correlate requests with notifications from the SNS topic.
 * Data sets will be published in comma-separated values (CSV) format with the file name {data_set_type}_YYYY-MM-DD.csv.
 * If a file with the same name already exists (e.g. if the same data set is requested twice), the original file will
 * be overwritten by the new file.
 * Requires a Role with an attached permissions policy providing Allow permissions for the following actions:
 * s3:PutObject, s3:GetBucketLocation, sns:GetTopicAttributes, sns:Publish, iam:GetRolePolicy.
 */
export const generateDataSet: (
  input: GenerateDataSetRequest,
) => effect.Effect<
  GenerateDataSetResult,
  MarketplaceCommerceAnalyticsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateDataSetRequest,
  output: GenerateDataSetResult,
  errors: [MarketplaceCommerceAnalyticsException],
}));
