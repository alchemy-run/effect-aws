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
  sdkId: "SageMaker Metrics",
  serviceShapeName: "SageMakerMetricsService",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2022-09-30");
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
              `https://metrics.sagemaker-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws") {
              return e(
                `https://metrics-fips.sagemaker.${Region}.amazonaws.com`,
              );
            }
            return e(
              `https://metrics.sagemaker-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://metrics.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://metrics.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ExperimentEntityName = string;
export type MetricName = string;
export type SageMakerResourceArn = string;
export type Long = number;
export type Step = number;
export type Double = number;
export type Message = string;
export type Integer = number;

//# Schemas
export interface MetricQuery {
  MetricName: string;
  ResourceArn: string;
  MetricStat: string;
  Period: string;
  XAxisType: string;
  Start?: number;
  End?: number;
}
export const MetricQuery = S.suspend(() =>
  S.Struct({
    MetricName: S.String,
    ResourceArn: S.String,
    MetricStat: S.String,
    Period: S.String,
    XAxisType: S.String,
    Start: S.optional(S.Number),
    End: S.optional(S.Number),
  }),
).annotations({ identifier: "MetricQuery" }) as any as S.Schema<MetricQuery>;
export type MetricQueryList = MetricQuery[];
export const MetricQueryList = S.Array(MetricQuery);
export interface RawMetricData {
  MetricName: string;
  Timestamp: Date;
  Step?: number;
  Value: number;
}
export const RawMetricData = S.suspend(() =>
  S.Struct({
    MetricName: S.String,
    Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Step: S.optional(S.Number),
    Value: S.Number,
  }),
).annotations({
  identifier: "RawMetricData",
}) as any as S.Schema<RawMetricData>;
export type RawMetricDataList = RawMetricData[];
export const RawMetricDataList = S.Array(RawMetricData);
export interface BatchGetMetricsRequest {
  MetricQueries: MetricQueryList;
}
export const BatchGetMetricsRequest = S.suspend(() =>
  S.Struct({ MetricQueries: MetricQueryList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchGetMetrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetMetricsRequest",
}) as any as S.Schema<BatchGetMetricsRequest>;
export interface BatchPutMetricsRequest {
  TrialComponentName: string;
  MetricData: RawMetricDataList;
}
export const BatchPutMetricsRequest = S.suspend(() =>
  S.Struct({
    TrialComponentName: S.String,
    MetricData: RawMetricDataList,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/BatchPutMetrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchPutMetricsRequest",
}) as any as S.Schema<BatchPutMetricsRequest>;
export type XAxisValues = number[];
export const XAxisValues = S.Array(S.Number);
export type MetricValues = number[];
export const MetricValues = S.Array(S.Number);
export interface MetricQueryResult {
  Status: string;
  Message?: string;
  XAxisValues: XAxisValues;
  MetricValues: MetricValues;
}
export const MetricQueryResult = S.suspend(() =>
  S.Struct({
    Status: S.String,
    Message: S.optional(S.String),
    XAxisValues: XAxisValues,
    MetricValues: MetricValues,
  }),
).annotations({
  identifier: "MetricQueryResult",
}) as any as S.Schema<MetricQueryResult>;
export type MetricQueryResultList = MetricQueryResult[];
export const MetricQueryResultList = S.Array(MetricQueryResult);
export interface BatchPutMetricsError {
  Code?: string;
  MetricIndex?: number;
}
export const BatchPutMetricsError = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), MetricIndex: S.optional(S.Number) }),
).annotations({
  identifier: "BatchPutMetricsError",
}) as any as S.Schema<BatchPutMetricsError>;
export type BatchPutMetricsErrorList = BatchPutMetricsError[];
export const BatchPutMetricsErrorList = S.Array(BatchPutMetricsError);
export interface BatchGetMetricsResponse {
  MetricQueryResults?: MetricQueryResultList;
}
export const BatchGetMetricsResponse = S.suspend(() =>
  S.Struct({ MetricQueryResults: S.optional(MetricQueryResultList) }),
).annotations({
  identifier: "BatchGetMetricsResponse",
}) as any as S.Schema<BatchGetMetricsResponse>;
export interface BatchPutMetricsResponse {
  Errors?: BatchPutMetricsErrorList;
}
export const BatchPutMetricsResponse = S.suspend(() =>
  S.Struct({ Errors: S.optional(BatchPutMetricsErrorList) }),
).annotations({
  identifier: "BatchPutMetricsResponse",
}) as any as S.Schema<BatchPutMetricsResponse>;

//# Errors

//# Operations
/**
 * Used to retrieve training metrics from SageMaker.
 */
export const batchGetMetrics: (
  input: BatchGetMetricsRequest,
) => Effect.Effect<
  BatchGetMetricsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetMetricsRequest,
  output: BatchGetMetricsResponse,
  errors: [],
}));
/**
 * Used to ingest training metrics into SageMaker. These metrics can be visualized in SageMaker Studio.
 */
export const batchPutMetrics: (
  input: BatchPutMetricsRequest,
) => Effect.Effect<
  BatchPutMetricsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutMetricsRequest,
  output: BatchPutMetricsResponse,
  errors: [],
}));
