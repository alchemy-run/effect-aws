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
export type Step = number;
export type Message = string;

//# Schemas
export type MetricStatistic =
  | "Min"
  | "Max"
  | "Avg"
  | "Count"
  | "StdDev"
  | "Last";
export const MetricStatistic = S.Literal(
  "Min",
  "Max",
  "Avg",
  "Count",
  "StdDev",
  "Last",
);
export type Period = "OneMinute" | "FiveMinute" | "OneHour" | "IterationNumber";
export const Period = S.Literal(
  "OneMinute",
  "FiveMinute",
  "OneHour",
  "IterationNumber",
);
export type XAxisType = "IterationNumber" | "Timestamp";
export const XAxisType = S.Literal("IterationNumber", "Timestamp");
export interface MetricQuery {
  MetricName?: string;
  ResourceArn?: string;
  MetricStat?: MetricStatistic;
  Period?: Period;
  XAxisType?: XAxisType;
  Start?: number;
  End?: number;
}
export const MetricQuery = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    MetricStat: S.optional(MetricStatistic),
    Period: S.optional(Period),
    XAxisType: S.optional(XAxisType),
    Start: S.optional(S.Number),
    End: S.optional(S.Number),
  }),
).annotations({ identifier: "MetricQuery" }) as any as S.Schema<MetricQuery>;
export type MetricQueryList = MetricQuery[];
export const MetricQueryList = S.Array(MetricQuery);
export interface RawMetricData {
  MetricName?: string;
  Timestamp?: Date;
  Step?: number;
  Value?: number;
}
export const RawMetricData = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Step: S.optional(S.Number),
    Value: S.optional(S.Number),
  }),
).annotations({
  identifier: "RawMetricData",
}) as any as S.Schema<RawMetricData>;
export type RawMetricDataList = RawMetricData[];
export const RawMetricDataList = S.Array(RawMetricData);
export interface BatchGetMetricsRequest {
  MetricQueries?: MetricQuery[];
}
export const BatchGetMetricsRequest = S.suspend(() =>
  S.Struct({ MetricQueries: S.optional(MetricQueryList) }).pipe(
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
  TrialComponentName?: string;
  MetricData?: RawMetricData[];
}
export const BatchPutMetricsRequest = S.suspend(() =>
  S.Struct({
    TrialComponentName: S.optional(S.String),
    MetricData: S.optional(RawMetricDataList),
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
export type MetricQueryResultStatus =
  | "Complete"
  | "Truncated"
  | "InternalError"
  | "ValidationError";
export const MetricQueryResultStatus = S.Literal(
  "Complete",
  "Truncated",
  "InternalError",
  "ValidationError",
);
export type XAxisValues = number[];
export const XAxisValues = S.Array(S.Number);
export type MetricValues = number[];
export const MetricValues = S.Array(S.Number);
export type PutMetricsErrorCode =
  | "METRIC_LIMIT_EXCEEDED"
  | "INTERNAL_ERROR"
  | "VALIDATION_ERROR"
  | "CONFLICT_ERROR";
export const PutMetricsErrorCode = S.Literal(
  "METRIC_LIMIT_EXCEEDED",
  "INTERNAL_ERROR",
  "VALIDATION_ERROR",
  "CONFLICT_ERROR",
);
export interface MetricQueryResult {
  Status?: MetricQueryResultStatus;
  Message?: string;
  XAxisValues?: number[];
  MetricValues?: number[];
}
export const MetricQueryResult = S.suspend(() =>
  S.Struct({
    Status: S.optional(MetricQueryResultStatus),
    Message: S.optional(S.String),
    XAxisValues: S.optional(XAxisValues),
    MetricValues: S.optional(MetricValues),
  }),
).annotations({
  identifier: "MetricQueryResult",
}) as any as S.Schema<MetricQueryResult>;
export type MetricQueryResultList = MetricQueryResult[];
export const MetricQueryResultList = S.Array(MetricQueryResult);
export interface BatchPutMetricsError {
  Code?: PutMetricsErrorCode;
  MetricIndex?: number;
}
export const BatchPutMetricsError = S.suspend(() =>
  S.Struct({
    Code: S.optional(PutMetricsErrorCode),
    MetricIndex: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchPutMetricsError",
}) as any as S.Schema<BatchPutMetricsError>;
export type BatchPutMetricsErrorList = BatchPutMetricsError[];
export const BatchPutMetricsErrorList = S.Array(BatchPutMetricsError);
export interface BatchGetMetricsResponse {
  MetricQueryResults?: (MetricQueryResult & {
    Status: MetricQueryResultStatus;
    XAxisValues: XAxisValues;
    MetricValues: MetricValues;
  })[];
}
export const BatchGetMetricsResponse = S.suspend(() =>
  S.Struct({ MetricQueryResults: S.optional(MetricQueryResultList) }),
).annotations({
  identifier: "BatchGetMetricsResponse",
}) as any as S.Schema<BatchGetMetricsResponse>;
export interface BatchPutMetricsResponse {
  Errors?: BatchPutMetricsError[];
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
) => effect.Effect<
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
) => effect.Effect<
  BatchPutMetricsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutMetricsRequest,
  output: BatchPutMetricsResponse,
  errors: [],
}));
