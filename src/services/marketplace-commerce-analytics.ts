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
                        url: "https://marketplacecommerceanalytics-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://marketplacecommerceanalytics-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://marketplacecommerceanalytics.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://marketplacecommerceanalytics.{Region}.{PartitionResult#dnsSuffix}",
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
