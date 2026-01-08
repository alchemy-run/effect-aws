import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
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
export type RoleNameArn = string;
export type DestinationS3BucketName = string;
export type DestinationS3Prefix = string;
export type SnsTopicArn = string;
export type OptionalKey = string;
export type OptionalValue = string;
export type DataSetRequestId = string;
export type ExceptionMessage = string;

//# Schemas
export type CustomerDefinedValues = { [key: string]: string };
export const CustomerDefinedValues = S.Record({
  key: S.String,
  value: S.String,
});
export interface StartSupportDataExportRequest {
  dataSetType: string;
  fromDate: Date;
  roleNameArn: string;
  destinationS3BucketName: string;
  destinationS3Prefix?: string;
  snsTopicArn: string;
  customerDefinedValues?: CustomerDefinedValues;
}
export const StartSupportDataExportRequest = S.suspend(() =>
  S.Struct({
    dataSetType: S.String,
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
  dataSetType: string;
  dataSetPublicationDate: Date;
  roleNameArn: string;
  destinationS3BucketName: string;
  destinationS3Prefix?: string;
  snsTopicArn: string;
  customerDefinedValues?: CustomerDefinedValues;
}
export const GenerateDataSetRequest = S.suspend(() =>
  S.Struct({
    dataSetType: S.String,
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
) => Effect.Effect<
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
) => Effect.Effect<
  GenerateDataSetResult,
  MarketplaceCommerceAnalyticsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateDataSetRequest,
  output: GenerateDataSetResult,
  errors: [MarketplaceCommerceAnalyticsException],
}));
