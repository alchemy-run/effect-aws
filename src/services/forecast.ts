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
  sdkId: "forecast",
  serviceShapeName: "AmazonForecast",
});
const auth = T.AwsAuthSigv4({ name: "forecast" });
const ver = T.ServiceVersion("2018-06-26");
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
              `https://forecast-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://forecast-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://forecast.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://forecast.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Name = string;
export type ForecastType = string;
export type Frequency = string;
export type Arn = string;
export type TimestampFormat = string;
export type TimeZone = string;
export type UseGeolocationForTimeZone = boolean;
export type GeolocationFormat = string;
export type Format = string;
export type LocalDateTime = string;
export type LongArn = string;
export type NextToken = string;
export type MaxResults = number;
export type TagKey = string | redacted.Redacted<string>;
export type KMSKeyArn = string;
export type TagValue = string | redacted.Redacted<string>;
export type DayOfMonth = number;
export type Hour = number;
export type ParameterKey = string;
export type ParameterValue = string;
export type ErrorMessage = string;
export type Status = string;
export type Message = string;
export type EvaluationState = string;
export type S3Path = string;
export type Value = string;
export type AttributeValue = string;
export type Detail = string;
export type MetricName = string;

//# Schemas
export type ForecastTypes = string[];
export const ForecastTypes = S.Array(S.String);
export type ForecastDimensions = string[];
export const ForecastDimensions = S.Array(S.String);
export type OptimizationMetric =
  | "WAPE"
  | "RMSE"
  | "AverageWeightedQuantileLoss"
  | "MASE"
  | "MAPE"
  | (string & {});
export const OptimizationMetric = S.String;
export type Domain =
  | "RETAIL"
  | "CUSTOM"
  | "INVENTORY_PLANNING"
  | "EC2_CAPACITY"
  | "WORK_FORCE"
  | "WEB_TRAFFIC"
  | "METRICS"
  | (string & {});
export const Domain = S.String;
export type DatasetType =
  | "TARGET_TIME_SERIES"
  | "RELATED_TIME_SERIES"
  | "ITEM_METADATA"
  | (string & {});
export const DatasetType = S.String;
export type ArnList = string[];
export const ArnList = S.Array(S.String);
export type ImportMode = "FULL" | "INCREMENTAL" | (string & {});
export const ImportMode = S.String;
export type AutoMLOverrideStrategy =
  | "LatencyOptimized"
  | "AccuracyOptimized"
  | (string & {});
export const AutoMLOverrideStrategy = S.String;
export type WhatIfForecastArnListForExport = string[];
export const WhatIfForecastArnListForExport = S.Array(S.String);
export type TagKeys = string | redacted.Redacted<string>[];
export const TagKeys = S.Array(SensitiveString);
export interface Tag {
  Key: string | redacted.Redacted<string>;
  Value: string | redacted.Redacted<string>;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: SensitiveString, Value: SensitiveString }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateDatasetGroupRequest {
  DatasetGroupName: string;
  Domain: Domain;
  DatasetArns?: string[];
  Tags?: Tag[];
}
export const CreateDatasetGroupRequest = S.suspend(() =>
  S.Struct({
    DatasetGroupName: S.String,
    Domain: Domain,
    DatasetArns: S.optional(ArnList),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDatasetGroupRequest",
}) as any as S.Schema<CreateDatasetGroupRequest>;
export interface S3Config {
  Path: string;
  RoleArn: string;
  KMSKeyArn?: string;
}
export const S3Config = S.suspend(() =>
  S.Struct({
    Path: S.String,
    RoleArn: S.String,
    KMSKeyArn: S.optional(S.String),
  }),
).annotations({ identifier: "S3Config" }) as any as S.Schema<S3Config>;
export interface DataDestination {
  S3Config: S3Config;
}
export const DataDestination = S.suspend(() =>
  S.Struct({ S3Config: S3Config }),
).annotations({
  identifier: "DataDestination",
}) as any as S.Schema<DataDestination>;
export interface CreateForecastExportJobRequest {
  ForecastExportJobName: string;
  ForecastArn: string;
  Destination: DataDestination;
  Tags?: Tag[];
  Format?: string;
}
export const CreateForecastExportJobRequest = S.suspend(() =>
  S.Struct({
    ForecastExportJobName: S.String,
    ForecastArn: S.String,
    Destination: DataDestination,
    Tags: S.optional(Tags),
    Format: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateForecastExportJobRequest",
}) as any as S.Schema<CreateForecastExportJobRequest>;
export interface CreateMonitorRequest {
  MonitorName: string;
  ResourceArn: string;
  Tags?: Tag[];
}
export const CreateMonitorRequest = S.suspend(() =>
  S.Struct({
    MonitorName: S.String,
    ResourceArn: S.String,
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateMonitorRequest",
}) as any as S.Schema<CreateMonitorRequest>;
export interface CreatePredictorBacktestExportJobRequest {
  PredictorBacktestExportJobName: string;
  PredictorArn: string;
  Destination: DataDestination;
  Tags?: Tag[];
  Format?: string;
}
export const CreatePredictorBacktestExportJobRequest = S.suspend(() =>
  S.Struct({
    PredictorBacktestExportJobName: S.String,
    PredictorArn: S.String,
    Destination: DataDestination,
    Tags: S.optional(Tags),
    Format: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePredictorBacktestExportJobRequest",
}) as any as S.Schema<CreatePredictorBacktestExportJobRequest>;
export interface DataSource {
  S3Config: S3Config;
}
export const DataSource = S.suspend(() =>
  S.Struct({ S3Config: S3Config }),
).annotations({ identifier: "DataSource" }) as any as S.Schema<DataSource>;
export type AttributeType =
  | "string"
  | "integer"
  | "float"
  | "timestamp"
  | "geolocation"
  | (string & {});
export const AttributeType = S.String;
export interface SchemaAttribute {
  AttributeName?: string;
  AttributeType?: AttributeType;
}
export const SchemaAttribute = S.suspend(() =>
  S.Struct({
    AttributeName: S.optional(S.String),
    AttributeType: S.optional(AttributeType),
  }),
).annotations({
  identifier: "SchemaAttribute",
}) as any as S.Schema<SchemaAttribute>;
export type SchemaAttributes = SchemaAttribute[];
export const SchemaAttributes = S.Array(SchemaAttribute);
export interface Schema {
  Attributes?: SchemaAttribute[];
}
export const Schema = S.suspend(() =>
  S.Struct({ Attributes: S.optional(SchemaAttributes) }),
).annotations({ identifier: "Schema" }) as any as S.Schema<Schema>;
export interface TimeSeriesIdentifiers {
  DataSource?: DataSource;
  Schema?: Schema;
  Format?: string;
}
export const TimeSeriesIdentifiers = S.suspend(() =>
  S.Struct({
    DataSource: S.optional(DataSource),
    Schema: S.optional(Schema),
    Format: S.optional(S.String),
  }),
).annotations({
  identifier: "TimeSeriesIdentifiers",
}) as any as S.Schema<TimeSeriesIdentifiers>;
export interface TimeSeriesSelector {
  TimeSeriesIdentifiers?: TimeSeriesIdentifiers;
}
export const TimeSeriesSelector = S.suspend(() =>
  S.Struct({ TimeSeriesIdentifiers: S.optional(TimeSeriesIdentifiers) }),
).annotations({
  identifier: "TimeSeriesSelector",
}) as any as S.Schema<TimeSeriesSelector>;
export interface CreateWhatIfAnalysisRequest {
  WhatIfAnalysisName: string;
  ForecastArn: string;
  TimeSeriesSelector?: TimeSeriesSelector;
  Tags?: Tag[];
}
export const CreateWhatIfAnalysisRequest = S.suspend(() =>
  S.Struct({
    WhatIfAnalysisName: S.String,
    ForecastArn: S.String,
    TimeSeriesSelector: S.optional(TimeSeriesSelector),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateWhatIfAnalysisRequest",
}) as any as S.Schema<CreateWhatIfAnalysisRequest>;
export interface CreateWhatIfForecastExportRequest {
  WhatIfForecastExportName: string;
  WhatIfForecastArns: string[];
  Destination: DataDestination;
  Tags?: Tag[];
  Format?: string;
}
export const CreateWhatIfForecastExportRequest = S.suspend(() =>
  S.Struct({
    WhatIfForecastExportName: S.String,
    WhatIfForecastArns: WhatIfForecastArnListForExport,
    Destination: DataDestination,
    Tags: S.optional(Tags),
    Format: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateWhatIfForecastExportRequest",
}) as any as S.Schema<CreateWhatIfForecastExportRequest>;
export interface DeleteDatasetRequest {
  DatasetArn: string;
}
export const DeleteDatasetRequest = S.suspend(() =>
  S.Struct({ DatasetArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDatasetRequest",
}) as any as S.Schema<DeleteDatasetRequest>;
export interface DeleteDatasetResponse {}
export const DeleteDatasetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteDatasetResponse",
}) as any as S.Schema<DeleteDatasetResponse>;
export interface DeleteDatasetGroupRequest {
  DatasetGroupArn: string;
}
export const DeleteDatasetGroupRequest = S.suspend(() =>
  S.Struct({ DatasetGroupArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDatasetGroupRequest",
}) as any as S.Schema<DeleteDatasetGroupRequest>;
export interface DeleteDatasetGroupResponse {}
export const DeleteDatasetGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDatasetGroupResponse",
}) as any as S.Schema<DeleteDatasetGroupResponse>;
export interface DeleteDatasetImportJobRequest {
  DatasetImportJobArn: string;
}
export const DeleteDatasetImportJobRequest = S.suspend(() =>
  S.Struct({ DatasetImportJobArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDatasetImportJobRequest",
}) as any as S.Schema<DeleteDatasetImportJobRequest>;
export interface DeleteDatasetImportJobResponse {}
export const DeleteDatasetImportJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDatasetImportJobResponse",
}) as any as S.Schema<DeleteDatasetImportJobResponse>;
export interface DeleteExplainabilityRequest {
  ExplainabilityArn: string;
}
export const DeleteExplainabilityRequest = S.suspend(() =>
  S.Struct({ ExplainabilityArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteExplainabilityRequest",
}) as any as S.Schema<DeleteExplainabilityRequest>;
export interface DeleteExplainabilityResponse {}
export const DeleteExplainabilityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteExplainabilityResponse",
}) as any as S.Schema<DeleteExplainabilityResponse>;
export interface DeleteExplainabilityExportRequest {
  ExplainabilityExportArn: string;
}
export const DeleteExplainabilityExportRequest = S.suspend(() =>
  S.Struct({ ExplainabilityExportArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteExplainabilityExportRequest",
}) as any as S.Schema<DeleteExplainabilityExportRequest>;
export interface DeleteExplainabilityExportResponse {}
export const DeleteExplainabilityExportResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteExplainabilityExportResponse",
}) as any as S.Schema<DeleteExplainabilityExportResponse>;
export interface DeleteForecastRequest {
  ForecastArn: string;
}
export const DeleteForecastRequest = S.suspend(() =>
  S.Struct({ ForecastArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteForecastRequest",
}) as any as S.Schema<DeleteForecastRequest>;
export interface DeleteForecastResponse {}
export const DeleteForecastResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteForecastResponse" },
) as any as S.Schema<DeleteForecastResponse>;
export interface DeleteForecastExportJobRequest {
  ForecastExportJobArn: string;
}
export const DeleteForecastExportJobRequest = S.suspend(() =>
  S.Struct({ ForecastExportJobArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteForecastExportJobRequest",
}) as any as S.Schema<DeleteForecastExportJobRequest>;
export interface DeleteForecastExportJobResponse {}
export const DeleteForecastExportJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteForecastExportJobResponse",
}) as any as S.Schema<DeleteForecastExportJobResponse>;
export interface DeleteMonitorRequest {
  MonitorArn: string;
}
export const DeleteMonitorRequest = S.suspend(() =>
  S.Struct({ MonitorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteMonitorRequest",
}) as any as S.Schema<DeleteMonitorRequest>;
export interface DeleteMonitorResponse {}
export const DeleteMonitorResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteMonitorResponse",
}) as any as S.Schema<DeleteMonitorResponse>;
export interface DeletePredictorRequest {
  PredictorArn: string;
}
export const DeletePredictorRequest = S.suspend(() =>
  S.Struct({ PredictorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePredictorRequest",
}) as any as S.Schema<DeletePredictorRequest>;
export interface DeletePredictorResponse {}
export const DeletePredictorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePredictorResponse",
}) as any as S.Schema<DeletePredictorResponse>;
export interface DeletePredictorBacktestExportJobRequest {
  PredictorBacktestExportJobArn: string;
}
export const DeletePredictorBacktestExportJobRequest = S.suspend(() =>
  S.Struct({ PredictorBacktestExportJobArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePredictorBacktestExportJobRequest",
}) as any as S.Schema<DeletePredictorBacktestExportJobRequest>;
export interface DeletePredictorBacktestExportJobResponse {}
export const DeletePredictorBacktestExportJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePredictorBacktestExportJobResponse",
}) as any as S.Schema<DeletePredictorBacktestExportJobResponse>;
export interface DeleteResourceTreeRequest {
  ResourceArn: string;
}
export const DeleteResourceTreeRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResourceTreeRequest",
}) as any as S.Schema<DeleteResourceTreeRequest>;
export interface DeleteResourceTreeResponse {}
export const DeleteResourceTreeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourceTreeResponse",
}) as any as S.Schema<DeleteResourceTreeResponse>;
export interface DeleteWhatIfAnalysisRequest {
  WhatIfAnalysisArn: string;
}
export const DeleteWhatIfAnalysisRequest = S.suspend(() =>
  S.Struct({ WhatIfAnalysisArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteWhatIfAnalysisRequest",
}) as any as S.Schema<DeleteWhatIfAnalysisRequest>;
export interface DeleteWhatIfAnalysisResponse {}
export const DeleteWhatIfAnalysisResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWhatIfAnalysisResponse",
}) as any as S.Schema<DeleteWhatIfAnalysisResponse>;
export interface DeleteWhatIfForecastRequest {
  WhatIfForecastArn: string;
}
export const DeleteWhatIfForecastRequest = S.suspend(() =>
  S.Struct({ WhatIfForecastArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteWhatIfForecastRequest",
}) as any as S.Schema<DeleteWhatIfForecastRequest>;
export interface DeleteWhatIfForecastResponse {}
export const DeleteWhatIfForecastResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWhatIfForecastResponse",
}) as any as S.Schema<DeleteWhatIfForecastResponse>;
export interface DeleteWhatIfForecastExportRequest {
  WhatIfForecastExportArn: string;
}
export const DeleteWhatIfForecastExportRequest = S.suspend(() =>
  S.Struct({ WhatIfForecastExportArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteWhatIfForecastExportRequest",
}) as any as S.Schema<DeleteWhatIfForecastExportRequest>;
export interface DeleteWhatIfForecastExportResponse {}
export const DeleteWhatIfForecastExportResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWhatIfForecastExportResponse",
}) as any as S.Schema<DeleteWhatIfForecastExportResponse>;
export interface DescribeAutoPredictorRequest {
  PredictorArn: string;
}
export const DescribeAutoPredictorRequest = S.suspend(() =>
  S.Struct({ PredictorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAutoPredictorRequest",
}) as any as S.Schema<DescribeAutoPredictorRequest>;
export interface DescribeDatasetRequest {
  DatasetArn: string;
}
export const DescribeDatasetRequest = S.suspend(() =>
  S.Struct({ DatasetArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDatasetRequest",
}) as any as S.Schema<DescribeDatasetRequest>;
export interface DescribeDatasetGroupRequest {
  DatasetGroupArn: string;
}
export const DescribeDatasetGroupRequest = S.suspend(() =>
  S.Struct({ DatasetGroupArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDatasetGroupRequest",
}) as any as S.Schema<DescribeDatasetGroupRequest>;
export interface DescribeDatasetImportJobRequest {
  DatasetImportJobArn: string;
}
export const DescribeDatasetImportJobRequest = S.suspend(() =>
  S.Struct({ DatasetImportJobArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDatasetImportJobRequest",
}) as any as S.Schema<DescribeDatasetImportJobRequest>;
export interface DescribeExplainabilityRequest {
  ExplainabilityArn: string;
}
export const DescribeExplainabilityRequest = S.suspend(() =>
  S.Struct({ ExplainabilityArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeExplainabilityRequest",
}) as any as S.Schema<DescribeExplainabilityRequest>;
export interface DescribeExplainabilityExportRequest {
  ExplainabilityExportArn: string;
}
export const DescribeExplainabilityExportRequest = S.suspend(() =>
  S.Struct({ ExplainabilityExportArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeExplainabilityExportRequest",
}) as any as S.Schema<DescribeExplainabilityExportRequest>;
export interface DescribeForecastRequest {
  ForecastArn: string;
}
export const DescribeForecastRequest = S.suspend(() =>
  S.Struct({ ForecastArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeForecastRequest",
}) as any as S.Schema<DescribeForecastRequest>;
export interface DescribeForecastExportJobRequest {
  ForecastExportJobArn: string;
}
export const DescribeForecastExportJobRequest = S.suspend(() =>
  S.Struct({ ForecastExportJobArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeForecastExportJobRequest",
}) as any as S.Schema<DescribeForecastExportJobRequest>;
export interface DescribeMonitorRequest {
  MonitorArn: string;
}
export const DescribeMonitorRequest = S.suspend(() =>
  S.Struct({ MonitorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeMonitorRequest",
}) as any as S.Schema<DescribeMonitorRequest>;
export interface DescribePredictorRequest {
  PredictorArn: string;
}
export const DescribePredictorRequest = S.suspend(() =>
  S.Struct({ PredictorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribePredictorRequest",
}) as any as S.Schema<DescribePredictorRequest>;
export interface DescribePredictorBacktestExportJobRequest {
  PredictorBacktestExportJobArn: string;
}
export const DescribePredictorBacktestExportJobRequest = S.suspend(() =>
  S.Struct({ PredictorBacktestExportJobArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribePredictorBacktestExportJobRequest",
}) as any as S.Schema<DescribePredictorBacktestExportJobRequest>;
export interface DescribeWhatIfAnalysisRequest {
  WhatIfAnalysisArn: string;
}
export const DescribeWhatIfAnalysisRequest = S.suspend(() =>
  S.Struct({ WhatIfAnalysisArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeWhatIfAnalysisRequest",
}) as any as S.Schema<DescribeWhatIfAnalysisRequest>;
export interface DescribeWhatIfForecastRequest {
  WhatIfForecastArn: string;
}
export const DescribeWhatIfForecastRequest = S.suspend(() =>
  S.Struct({ WhatIfForecastArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeWhatIfForecastRequest",
}) as any as S.Schema<DescribeWhatIfForecastRequest>;
export interface DescribeWhatIfForecastExportRequest {
  WhatIfForecastExportArn: string;
}
export const DescribeWhatIfForecastExportRequest = S.suspend(() =>
  S.Struct({ WhatIfForecastExportArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeWhatIfForecastExportRequest",
}) as any as S.Schema<DescribeWhatIfForecastExportRequest>;
export interface GetAccuracyMetricsRequest {
  PredictorArn: string;
}
export const GetAccuracyMetricsRequest = S.suspend(() =>
  S.Struct({ PredictorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAccuracyMetricsRequest",
}) as any as S.Schema<GetAccuracyMetricsRequest>;
export interface ListDatasetGroupsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListDatasetGroupsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDatasetGroupsRequest",
}) as any as S.Schema<ListDatasetGroupsRequest>;
export interface ListDatasetsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListDatasetsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDatasetsRequest",
}) as any as S.Schema<ListDatasetsRequest>;
export type FilterConditionString = "IS" | "IS_NOT" | (string & {});
export const FilterConditionString = S.String;
export interface Filter {
  Key: string;
  Value: string;
  Condition: FilterConditionString;
}
export const Filter = S.suspend(() =>
  S.Struct({
    Key: S.String,
    Value: S.String,
    Condition: FilterConditionString,
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface ListExplainabilitiesRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListExplainabilitiesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListExplainabilitiesRequest",
}) as any as S.Schema<ListExplainabilitiesRequest>;
export interface ListExplainabilityExportsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListExplainabilityExportsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListExplainabilityExportsRequest",
}) as any as S.Schema<ListExplainabilityExportsRequest>;
export interface ListForecastExportJobsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListForecastExportJobsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListForecastExportJobsRequest",
}) as any as S.Schema<ListForecastExportJobsRequest>;
export interface ListForecastsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListForecastsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListForecastsRequest",
}) as any as S.Schema<ListForecastsRequest>;
export interface ListMonitorEvaluationsRequest {
  NextToken?: string;
  MaxResults?: number;
  MonitorArn: string;
  Filters?: Filter[];
}
export const ListMonitorEvaluationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    MonitorArn: S.String,
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMonitorEvaluationsRequest",
}) as any as S.Schema<ListMonitorEvaluationsRequest>;
export interface ListMonitorsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListMonitorsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMonitorsRequest",
}) as any as S.Schema<ListMonitorsRequest>;
export interface ListPredictorBacktestExportJobsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListPredictorBacktestExportJobsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPredictorBacktestExportJobsRequest",
}) as any as S.Schema<ListPredictorBacktestExportJobsRequest>;
export interface ListPredictorsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListPredictorsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPredictorsRequest",
}) as any as S.Schema<ListPredictorsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListWhatIfAnalysesRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListWhatIfAnalysesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWhatIfAnalysesRequest",
}) as any as S.Schema<ListWhatIfAnalysesRequest>;
export interface ListWhatIfForecastExportsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListWhatIfForecastExportsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWhatIfForecastExportsRequest",
}) as any as S.Schema<ListWhatIfForecastExportsRequest>;
export interface ListWhatIfForecastsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListWhatIfForecastsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWhatIfForecastsRequest",
}) as any as S.Schema<ListWhatIfForecastsRequest>;
export interface ResumeResourceRequest {
  ResourceArn: string;
}
export const ResumeResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ResumeResourceRequest",
}) as any as S.Schema<ResumeResourceRequest>;
export interface ResumeResourceResponse {}
export const ResumeResourceResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "ResumeResourceResponse" },
) as any as S.Schema<ResumeResourceResponse>;
export interface StopResourceRequest {
  ResourceArn: string;
}
export const StopResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopResourceRequest",
}) as any as S.Schema<StopResourceRequest>;
export interface StopResourceResponse {}
export const StopResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopResourceResponse",
}) as any as S.Schema<StopResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: Tags }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string | redacted.Redacted<string>[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeys }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateDatasetGroupRequest {
  DatasetGroupArn: string;
  DatasetArns: string[];
}
export const UpdateDatasetGroupRequest = S.suspend(() =>
  S.Struct({ DatasetGroupArn: S.String, DatasetArns: ArnList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDatasetGroupRequest",
}) as any as S.Schema<UpdateDatasetGroupRequest>;
export interface UpdateDatasetGroupResponse {}
export const UpdateDatasetGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDatasetGroupResponse",
}) as any as S.Schema<UpdateDatasetGroupResponse>;
export type Month =
  | "JANUARY"
  | "FEBRUARY"
  | "MARCH"
  | "APRIL"
  | "MAY"
  | "JUNE"
  | "JULY"
  | "AUGUST"
  | "SEPTEMBER"
  | "OCTOBER"
  | "NOVEMBER"
  | "DECEMBER"
  | (string & {});
export const Month = S.String;
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY"
  | (string & {});
export const DayOfWeek = S.String;
export type TimeSeriesGranularity = "ALL" | "SPECIFIC" | (string & {});
export const TimeSeriesGranularity = S.String;
export type TimePointGranularity = "ALL" | "SPECIFIC" | (string & {});
export const TimePointGranularity = S.String;
export interface EncryptionConfig {
  RoleArn: string;
  KMSKeyArn: string;
}
export const EncryptionConfig = S.suspend(() =>
  S.Struct({ RoleArn: S.String, KMSKeyArn: S.String }),
).annotations({
  identifier: "EncryptionConfig",
}) as any as S.Schema<EncryptionConfig>;
export interface MonitorConfig {
  MonitorName: string;
}
export const MonitorConfig = S.suspend(() =>
  S.Struct({ MonitorName: S.String }),
).annotations({
  identifier: "MonitorConfig",
}) as any as S.Schema<MonitorConfig>;
export interface TimeAlignmentBoundary {
  Month?: Month;
  DayOfMonth?: number;
  DayOfWeek?: DayOfWeek;
  Hour?: number;
}
export const TimeAlignmentBoundary = S.suspend(() =>
  S.Struct({
    Month: S.optional(Month),
    DayOfMonth: S.optional(S.Number),
    DayOfWeek: S.optional(DayOfWeek),
    Hour: S.optional(S.Number),
  }),
).annotations({
  identifier: "TimeAlignmentBoundary",
}) as any as S.Schema<TimeAlignmentBoundary>;
export interface ExplainabilityConfig {
  TimeSeriesGranularity: TimeSeriesGranularity;
  TimePointGranularity: TimePointGranularity;
}
export const ExplainabilityConfig = S.suspend(() =>
  S.Struct({
    TimeSeriesGranularity: TimeSeriesGranularity,
    TimePointGranularity: TimePointGranularity,
  }),
).annotations({
  identifier: "ExplainabilityConfig",
}) as any as S.Schema<ExplainabilityConfig>;
export type TrainingParameters = { [key: string]: string | undefined };
export const TrainingParameters = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface EvaluationParameters {
  NumberOfBacktestWindows?: number;
  BackTestWindowOffset?: number;
}
export const EvaluationParameters = S.suspend(() =>
  S.Struct({
    NumberOfBacktestWindows: S.optional(S.Number),
    BackTestWindowOffset: S.optional(S.Number),
  }),
).annotations({
  identifier: "EvaluationParameters",
}) as any as S.Schema<EvaluationParameters>;
export interface TimeSeriesReplacementsDataSource {
  S3Config: S3Config;
  Schema: Schema;
  Format?: string;
  TimestampFormat?: string;
}
export const TimeSeriesReplacementsDataSource = S.suspend(() =>
  S.Struct({
    S3Config: S3Config,
    Schema: Schema,
    Format: S.optional(S.String),
    TimestampFormat: S.optional(S.String),
  }),
).annotations({
  identifier: "TimeSeriesReplacementsDataSource",
}) as any as S.Schema<TimeSeriesReplacementsDataSource>;
export type LongArnList = string[];
export const LongArnList = S.Array(S.String);
export type Operation =
  | "ADD"
  | "SUBTRACT"
  | "MULTIPLY"
  | "DIVIDE"
  | (string & {});
export const Operation = S.String;
export type Condition =
  | "EQUALS"
  | "NOT_EQUALS"
  | "LESS_THAN"
  | "GREATER_THAN"
  | (string & {});
export const Condition = S.String;
export interface CreateDatasetGroupResponse {
  DatasetGroupArn?: string;
}
export const CreateDatasetGroupResponse = S.suspend(() =>
  S.Struct({ DatasetGroupArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateDatasetGroupResponse",
}) as any as S.Schema<CreateDatasetGroupResponse>;
export interface CreateExplainabilityRequest {
  ExplainabilityName: string;
  ResourceArn: string;
  ExplainabilityConfig: ExplainabilityConfig;
  DataSource?: DataSource;
  Schema?: Schema;
  EnableVisualization?: boolean;
  StartDateTime?: string;
  EndDateTime?: string;
  Tags?: Tag[];
}
export const CreateExplainabilityRequest = S.suspend(() =>
  S.Struct({
    ExplainabilityName: S.String,
    ResourceArn: S.String,
    ExplainabilityConfig: ExplainabilityConfig,
    DataSource: S.optional(DataSource),
    Schema: S.optional(Schema),
    EnableVisualization: S.optional(S.Boolean),
    StartDateTime: S.optional(S.String),
    EndDateTime: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateExplainabilityRequest",
}) as any as S.Schema<CreateExplainabilityRequest>;
export interface CreateExplainabilityExportRequest {
  ExplainabilityExportName: string;
  ExplainabilityArn: string;
  Destination: DataDestination;
  Tags?: Tag[];
  Format?: string;
}
export const CreateExplainabilityExportRequest = S.suspend(() =>
  S.Struct({
    ExplainabilityExportName: S.String,
    ExplainabilityArn: S.String,
    Destination: DataDestination,
    Tags: S.optional(Tags),
    Format: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateExplainabilityExportRequest",
}) as any as S.Schema<CreateExplainabilityExportRequest>;
export interface CreateForecastExportJobResponse {
  ForecastExportJobArn?: string;
}
export const CreateForecastExportJobResponse = S.suspend(() =>
  S.Struct({ ForecastExportJobArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateForecastExportJobResponse",
}) as any as S.Schema<CreateForecastExportJobResponse>;
export interface CreateMonitorResponse {
  MonitorArn?: string;
}
export const CreateMonitorResponse = S.suspend(() =>
  S.Struct({ MonitorArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateMonitorResponse",
}) as any as S.Schema<CreateMonitorResponse>;
export interface CreatePredictorBacktestExportJobResponse {
  PredictorBacktestExportJobArn?: string;
}
export const CreatePredictorBacktestExportJobResponse = S.suspend(() =>
  S.Struct({ PredictorBacktestExportJobArn: S.optional(S.String) }),
).annotations({
  identifier: "CreatePredictorBacktestExportJobResponse",
}) as any as S.Schema<CreatePredictorBacktestExportJobResponse>;
export interface CreateWhatIfAnalysisResponse {
  WhatIfAnalysisArn?: string;
}
export const CreateWhatIfAnalysisResponse = S.suspend(() =>
  S.Struct({ WhatIfAnalysisArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateWhatIfAnalysisResponse",
}) as any as S.Schema<CreateWhatIfAnalysisResponse>;
export interface CreateWhatIfForecastExportResponse {
  WhatIfForecastExportArn?: string;
}
export const CreateWhatIfForecastExportResponse = S.suspend(() =>
  S.Struct({ WhatIfForecastExportArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateWhatIfForecastExportResponse",
}) as any as S.Schema<CreateWhatIfForecastExportResponse>;
export interface DescribeDatasetResponse {
  DatasetArn?: string;
  DatasetName?: string;
  Domain?: Domain;
  DatasetType?: DatasetType;
  DataFrequency?: string;
  Schema?: Schema;
  EncryptionConfig?: EncryptionConfig;
  Status?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const DescribeDatasetResponse = S.suspend(() =>
  S.Struct({
    DatasetArn: S.optional(S.String),
    DatasetName: S.optional(S.String),
    Domain: S.optional(Domain),
    DatasetType: S.optional(DatasetType),
    DataFrequency: S.optional(S.String),
    Schema: S.optional(Schema),
    EncryptionConfig: S.optional(EncryptionConfig),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeDatasetResponse",
}) as any as S.Schema<DescribeDatasetResponse>;
export interface DescribeDatasetGroupResponse {
  DatasetGroupName?: string;
  DatasetGroupArn?: string;
  DatasetArns?: string[];
  Domain?: Domain;
  Status?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const DescribeDatasetGroupResponse = S.suspend(() =>
  S.Struct({
    DatasetGroupName: S.optional(S.String),
    DatasetGroupArn: S.optional(S.String),
    DatasetArns: S.optional(ArnList),
    Domain: S.optional(Domain),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeDatasetGroupResponse",
}) as any as S.Schema<DescribeDatasetGroupResponse>;
export interface DescribeExplainabilityResponse {
  ExplainabilityArn?: string;
  ExplainabilityName?: string;
  ResourceArn?: string;
  ExplainabilityConfig?: ExplainabilityConfig;
  EnableVisualization?: boolean;
  DataSource?: DataSource;
  Schema?: Schema;
  StartDateTime?: string;
  EndDateTime?: string;
  EstimatedTimeRemainingInMinutes?: number;
  Message?: string;
  Status?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const DescribeExplainabilityResponse = S.suspend(() =>
  S.Struct({
    ExplainabilityArn: S.optional(S.String),
    ExplainabilityName: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    ExplainabilityConfig: S.optional(ExplainabilityConfig),
    EnableVisualization: S.optional(S.Boolean),
    DataSource: S.optional(DataSource),
    Schema: S.optional(Schema),
    StartDateTime: S.optional(S.String),
    EndDateTime: S.optional(S.String),
    EstimatedTimeRemainingInMinutes: S.optional(S.Number),
    Message: S.optional(S.String),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeExplainabilityResponse",
}) as any as S.Schema<DescribeExplainabilityResponse>;
export interface DescribeExplainabilityExportResponse {
  ExplainabilityExportArn?: string;
  ExplainabilityExportName?: string;
  ExplainabilityArn?: string;
  Destination?: DataDestination;
  Message?: string;
  Status?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
  Format?: string;
}
export const DescribeExplainabilityExportResponse = S.suspend(() =>
  S.Struct({
    ExplainabilityExportArn: S.optional(S.String),
    ExplainabilityExportName: S.optional(S.String),
    ExplainabilityArn: S.optional(S.String),
    Destination: S.optional(DataDestination),
    Message: S.optional(S.String),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Format: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeExplainabilityExportResponse",
}) as any as S.Schema<DescribeExplainabilityExportResponse>;
export interface DescribeForecastResponse {
  ForecastArn?: string;
  ForecastName?: string;
  ForecastTypes?: string[];
  PredictorArn?: string;
  DatasetGroupArn?: string;
  EstimatedTimeRemainingInMinutes?: number;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
  TimeSeriesSelector?: TimeSeriesSelector;
}
export const DescribeForecastResponse = S.suspend(() =>
  S.Struct({
    ForecastArn: S.optional(S.String),
    ForecastName: S.optional(S.String),
    ForecastTypes: S.optional(ForecastTypes),
    PredictorArn: S.optional(S.String),
    DatasetGroupArn: S.optional(S.String),
    EstimatedTimeRemainingInMinutes: S.optional(S.Number),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TimeSeriesSelector: S.optional(TimeSeriesSelector),
  }),
).annotations({
  identifier: "DescribeForecastResponse",
}) as any as S.Schema<DescribeForecastResponse>;
export interface DescribeForecastExportJobResponse {
  ForecastExportJobArn?: string;
  ForecastExportJobName?: string;
  ForecastArn?: string;
  Destination?: DataDestination;
  Message?: string;
  Status?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
  Format?: string;
}
export const DescribeForecastExportJobResponse = S.suspend(() =>
  S.Struct({
    ForecastExportJobArn: S.optional(S.String),
    ForecastExportJobName: S.optional(S.String),
    ForecastArn: S.optional(S.String),
    Destination: S.optional(DataDestination),
    Message: S.optional(S.String),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Format: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeForecastExportJobResponse",
}) as any as S.Schema<DescribeForecastExportJobResponse>;
export interface DescribePredictorBacktestExportJobResponse {
  PredictorBacktestExportJobArn?: string;
  PredictorBacktestExportJobName?: string;
  PredictorArn?: string;
  Destination?: DataDestination;
  Message?: string;
  Status?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
  Format?: string;
}
export const DescribePredictorBacktestExportJobResponse = S.suspend(() =>
  S.Struct({
    PredictorBacktestExportJobArn: S.optional(S.String),
    PredictorBacktestExportJobName: S.optional(S.String),
    PredictorArn: S.optional(S.String),
    Destination: S.optional(DataDestination),
    Message: S.optional(S.String),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Format: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribePredictorBacktestExportJobResponse",
}) as any as S.Schema<DescribePredictorBacktestExportJobResponse>;
export interface DescribeWhatIfAnalysisResponse {
  WhatIfAnalysisName?: string;
  WhatIfAnalysisArn?: string;
  ForecastArn?: string;
  EstimatedTimeRemainingInMinutes?: number;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
  TimeSeriesSelector?: TimeSeriesSelector;
}
export const DescribeWhatIfAnalysisResponse = S.suspend(() =>
  S.Struct({
    WhatIfAnalysisName: S.optional(S.String),
    WhatIfAnalysisArn: S.optional(S.String),
    ForecastArn: S.optional(S.String),
    EstimatedTimeRemainingInMinutes: S.optional(S.Number),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TimeSeriesSelector: S.optional(TimeSeriesSelector),
  }),
).annotations({
  identifier: "DescribeWhatIfAnalysisResponse",
}) as any as S.Schema<DescribeWhatIfAnalysisResponse>;
export interface Action {
  AttributeName: string;
  Operation: Operation;
  Value: number;
}
export const Action = S.suspend(() =>
  S.Struct({ AttributeName: S.String, Operation: Operation, Value: S.Number }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export interface TimeSeriesCondition {
  AttributeName: string;
  AttributeValue: string;
  Condition: Condition;
}
export const TimeSeriesCondition = S.suspend(() =>
  S.Struct({
    AttributeName: S.String,
    AttributeValue: S.String,
    Condition: Condition,
  }),
).annotations({
  identifier: "TimeSeriesCondition",
}) as any as S.Schema<TimeSeriesCondition>;
export type TimeSeriesConditions = TimeSeriesCondition[];
export const TimeSeriesConditions = S.Array(TimeSeriesCondition);
export interface TimeSeriesTransformation {
  Action?: Action;
  TimeSeriesConditions?: TimeSeriesCondition[];
}
export const TimeSeriesTransformation = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
    TimeSeriesConditions: S.optional(TimeSeriesConditions),
  }),
).annotations({
  identifier: "TimeSeriesTransformation",
}) as any as S.Schema<TimeSeriesTransformation>;
export type TimeSeriesTransformations = TimeSeriesTransformation[];
export const TimeSeriesTransformations = S.Array(TimeSeriesTransformation);
export interface DescribeWhatIfForecastResponse {
  WhatIfForecastName?: string;
  WhatIfForecastArn?: string;
  WhatIfAnalysisArn?: string;
  EstimatedTimeRemainingInMinutes?: number;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
  TimeSeriesTransformations?: TimeSeriesTransformation[];
  TimeSeriesReplacementsDataSource?: TimeSeriesReplacementsDataSource;
  ForecastTypes?: string[];
}
export const DescribeWhatIfForecastResponse = S.suspend(() =>
  S.Struct({
    WhatIfForecastName: S.optional(S.String),
    WhatIfForecastArn: S.optional(S.String),
    WhatIfAnalysisArn: S.optional(S.String),
    EstimatedTimeRemainingInMinutes: S.optional(S.Number),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TimeSeriesTransformations: S.optional(TimeSeriesTransformations),
    TimeSeriesReplacementsDataSource: S.optional(
      TimeSeriesReplacementsDataSource,
    ),
    ForecastTypes: S.optional(ForecastTypes),
  }),
).annotations({
  identifier: "DescribeWhatIfForecastResponse",
}) as any as S.Schema<DescribeWhatIfForecastResponse>;
export interface DescribeWhatIfForecastExportResponse {
  WhatIfForecastExportArn?: string;
  WhatIfForecastExportName?: string;
  WhatIfForecastArns?: string[];
  Destination?: DataDestination;
  Message?: string;
  Status?: string;
  CreationTime?: Date;
  EstimatedTimeRemainingInMinutes?: number;
  LastModificationTime?: Date;
  Format?: string;
}
export const DescribeWhatIfForecastExportResponse = S.suspend(() =>
  S.Struct({
    WhatIfForecastExportArn: S.optional(S.String),
    WhatIfForecastExportName: S.optional(S.String),
    WhatIfForecastArns: S.optional(LongArnList),
    Destination: S.optional(DataDestination),
    Message: S.optional(S.String),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EstimatedTimeRemainingInMinutes: S.optional(S.Number),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Format: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeWhatIfForecastExportResponse",
}) as any as S.Schema<DescribeWhatIfForecastExportResponse>;
export interface ListDatasetImportJobsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListDatasetImportJobsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDatasetImportJobsRequest",
}) as any as S.Schema<ListDatasetImportJobsRequest>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface SupplementaryFeature {
  Name: string;
  Value: string;
}
export const SupplementaryFeature = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "SupplementaryFeature",
}) as any as S.Schema<SupplementaryFeature>;
export type SupplementaryFeatures = SupplementaryFeature[];
export const SupplementaryFeatures = S.Array(SupplementaryFeature);
export type State = "Active" | "Deleted" | (string & {});
export const State = S.String;
export type Values = string[];
export const Values = S.Array(S.String);
export type ScalingType =
  | "Auto"
  | "Linear"
  | "Logarithmic"
  | "ReverseLogarithmic"
  | (string & {});
export const ScalingType = S.String;
export type FeaturizationMethodName = "filling" | (string & {});
export const FeaturizationMethodName = S.String;
export interface InputDataConfig {
  DatasetGroupArn: string;
  SupplementaryFeatures?: SupplementaryFeature[];
}
export const InputDataConfig = S.suspend(() =>
  S.Struct({
    DatasetGroupArn: S.String,
    SupplementaryFeatures: S.optional(SupplementaryFeatures),
  }),
).annotations({
  identifier: "InputDataConfig",
}) as any as S.Schema<InputDataConfig>;
export interface ReferencePredictorSummary {
  Arn?: string;
  State?: State;
}
export const ReferencePredictorSummary = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), State: S.optional(State) }),
).annotations({
  identifier: "ReferencePredictorSummary",
}) as any as S.Schema<ReferencePredictorSummary>;
export interface ExplainabilityInfo {
  ExplainabilityArn?: string;
  Status?: string;
}
export const ExplainabilityInfo = S.suspend(() =>
  S.Struct({
    ExplainabilityArn: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "ExplainabilityInfo",
}) as any as S.Schema<ExplainabilityInfo>;
export interface MonitorInfo {
  MonitorArn?: string;
  Status?: string;
}
export const MonitorInfo = S.suspend(() =>
  S.Struct({ MonitorArn: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({ identifier: "MonitorInfo" }) as any as S.Schema<MonitorInfo>;
export interface DatasetGroupSummary {
  DatasetGroupArn?: string;
  DatasetGroupName?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const DatasetGroupSummary = S.suspend(() =>
  S.Struct({
    DatasetGroupArn: S.optional(S.String),
    DatasetGroupName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DatasetGroupSummary",
}) as any as S.Schema<DatasetGroupSummary>;
export type DatasetGroups = DatasetGroupSummary[];
export const DatasetGroups = S.Array(DatasetGroupSummary);
export interface DatasetSummary {
  DatasetArn?: string;
  DatasetName?: string;
  DatasetType?: DatasetType;
  Domain?: Domain;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const DatasetSummary = S.suspend(() =>
  S.Struct({
    DatasetArn: S.optional(S.String),
    DatasetName: S.optional(S.String),
    DatasetType: S.optional(DatasetType),
    Domain: S.optional(Domain),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DatasetSummary",
}) as any as S.Schema<DatasetSummary>;
export type Datasets = DatasetSummary[];
export const Datasets = S.Array(DatasetSummary);
export interface ExplainabilitySummary {
  ExplainabilityArn?: string;
  ExplainabilityName?: string;
  ResourceArn?: string;
  ExplainabilityConfig?: ExplainabilityConfig;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const ExplainabilitySummary = S.suspend(() =>
  S.Struct({
    ExplainabilityArn: S.optional(S.String),
    ExplainabilityName: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    ExplainabilityConfig: S.optional(ExplainabilityConfig),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ExplainabilitySummary",
}) as any as S.Schema<ExplainabilitySummary>;
export type Explainabilities = ExplainabilitySummary[];
export const Explainabilities = S.Array(ExplainabilitySummary);
export interface ExplainabilityExportSummary {
  ExplainabilityExportArn?: string;
  ExplainabilityExportName?: string;
  Destination?: DataDestination;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const ExplainabilityExportSummary = S.suspend(() =>
  S.Struct({
    ExplainabilityExportArn: S.optional(S.String),
    ExplainabilityExportName: S.optional(S.String),
    Destination: S.optional(DataDestination),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ExplainabilityExportSummary",
}) as any as S.Schema<ExplainabilityExportSummary>;
export type ExplainabilityExports = ExplainabilityExportSummary[];
export const ExplainabilityExports = S.Array(ExplainabilityExportSummary);
export interface ForecastExportJobSummary {
  ForecastExportJobArn?: string;
  ForecastExportJobName?: string;
  Destination?: DataDestination;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const ForecastExportJobSummary = S.suspend(() =>
  S.Struct({
    ForecastExportJobArn: S.optional(S.String),
    ForecastExportJobName: S.optional(S.String),
    Destination: S.optional(DataDestination),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ForecastExportJobSummary",
}) as any as S.Schema<ForecastExportJobSummary>;
export type ForecastExportJobs = ForecastExportJobSummary[];
export const ForecastExportJobs = S.Array(ForecastExportJobSummary);
export interface ForecastSummary {
  ForecastArn?: string;
  ForecastName?: string;
  PredictorArn?: string;
  CreatedUsingAutoPredictor?: boolean;
  DatasetGroupArn?: string;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const ForecastSummary = S.suspend(() =>
  S.Struct({
    ForecastArn: S.optional(S.String),
    ForecastName: S.optional(S.String),
    PredictorArn: S.optional(S.String),
    CreatedUsingAutoPredictor: S.optional(S.Boolean),
    DatasetGroupArn: S.optional(S.String),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ForecastSummary",
}) as any as S.Schema<ForecastSummary>;
export type Forecasts = ForecastSummary[];
export const Forecasts = S.Array(ForecastSummary);
export interface MonitorSummary {
  MonitorArn?: string;
  MonitorName?: string;
  ResourceArn?: string;
  Status?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const MonitorSummary = S.suspend(() =>
  S.Struct({
    MonitorArn: S.optional(S.String),
    MonitorName: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "MonitorSummary",
}) as any as S.Schema<MonitorSummary>;
export type Monitors = MonitorSummary[];
export const Monitors = S.Array(MonitorSummary);
export interface PredictorBacktestExportJobSummary {
  PredictorBacktestExportJobArn?: string;
  PredictorBacktestExportJobName?: string;
  Destination?: DataDestination;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const PredictorBacktestExportJobSummary = S.suspend(() =>
  S.Struct({
    PredictorBacktestExportJobArn: S.optional(S.String),
    PredictorBacktestExportJobName: S.optional(S.String),
    Destination: S.optional(DataDestination),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PredictorBacktestExportJobSummary",
}) as any as S.Schema<PredictorBacktestExportJobSummary>;
export type PredictorBacktestExportJobs = PredictorBacktestExportJobSummary[];
export const PredictorBacktestExportJobs = S.Array(
  PredictorBacktestExportJobSummary,
);
export interface PredictorSummary {
  PredictorArn?: string;
  PredictorName?: string;
  DatasetGroupArn?: string;
  IsAutoPredictor?: boolean;
  ReferencePredictorSummary?: ReferencePredictorSummary;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const PredictorSummary = S.suspend(() =>
  S.Struct({
    PredictorArn: S.optional(S.String),
    PredictorName: S.optional(S.String),
    DatasetGroupArn: S.optional(S.String),
    IsAutoPredictor: S.optional(S.Boolean),
    ReferencePredictorSummary: S.optional(ReferencePredictorSummary),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PredictorSummary",
}) as any as S.Schema<PredictorSummary>;
export type Predictors = PredictorSummary[];
export const Predictors = S.Array(PredictorSummary);
export interface WhatIfAnalysisSummary {
  WhatIfAnalysisArn?: string;
  WhatIfAnalysisName?: string;
  ForecastArn?: string;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const WhatIfAnalysisSummary = S.suspend(() =>
  S.Struct({
    WhatIfAnalysisArn: S.optional(S.String),
    WhatIfAnalysisName: S.optional(S.String),
    ForecastArn: S.optional(S.String),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "WhatIfAnalysisSummary",
}) as any as S.Schema<WhatIfAnalysisSummary>;
export type WhatIfAnalyses = WhatIfAnalysisSummary[];
export const WhatIfAnalyses = S.Array(WhatIfAnalysisSummary);
export interface WhatIfForecastExportSummary {
  WhatIfForecastExportArn?: string;
  WhatIfForecastArns?: string[];
  WhatIfForecastExportName?: string;
  Destination?: DataDestination;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const WhatIfForecastExportSummary = S.suspend(() =>
  S.Struct({
    WhatIfForecastExportArn: S.optional(S.String),
    WhatIfForecastArns: S.optional(WhatIfForecastArnListForExport),
    WhatIfForecastExportName: S.optional(S.String),
    Destination: S.optional(DataDestination),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "WhatIfForecastExportSummary",
}) as any as S.Schema<WhatIfForecastExportSummary>;
export type WhatIfForecastExports = WhatIfForecastExportSummary[];
export const WhatIfForecastExports = S.Array(WhatIfForecastExportSummary);
export interface WhatIfForecastSummary {
  WhatIfForecastArn?: string;
  WhatIfForecastName?: string;
  WhatIfAnalysisArn?: string;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
}
export const WhatIfForecastSummary = S.suspend(() =>
  S.Struct({
    WhatIfForecastArn: S.optional(S.String),
    WhatIfForecastName: S.optional(S.String),
    WhatIfAnalysisArn: S.optional(S.String),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "WhatIfForecastSummary",
}) as any as S.Schema<WhatIfForecastSummary>;
export type WhatIfForecasts = WhatIfForecastSummary[];
export const WhatIfForecasts = S.Array(WhatIfForecastSummary);
export type Transformations = { [key: string]: string | undefined };
export const Transformations = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type Configuration = { [key: string]: string[] | undefined };
export const Configuration = S.Record({
  key: S.String,
  value: S.UndefinedOr(Values),
});
export interface CategoricalParameterRange {
  Name: string;
  Values: string[];
}
export const CategoricalParameterRange = S.suspend(() =>
  S.Struct({ Name: S.String, Values: Values }),
).annotations({
  identifier: "CategoricalParameterRange",
}) as any as S.Schema<CategoricalParameterRange>;
export type CategoricalParameterRanges = CategoricalParameterRange[];
export const CategoricalParameterRanges = S.Array(CategoricalParameterRange);
export interface ContinuousParameterRange {
  Name: string;
  MaxValue: number;
  MinValue: number;
  ScalingType?: ScalingType;
}
export const ContinuousParameterRange = S.suspend(() =>
  S.Struct({
    Name: S.String,
    MaxValue: S.Number,
    MinValue: S.Number,
    ScalingType: S.optional(ScalingType),
  }),
).annotations({
  identifier: "ContinuousParameterRange",
}) as any as S.Schema<ContinuousParameterRange>;
export type ContinuousParameterRanges = ContinuousParameterRange[];
export const ContinuousParameterRanges = S.Array(ContinuousParameterRange);
export interface IntegerParameterRange {
  Name: string;
  MaxValue: number;
  MinValue: number;
  ScalingType?: ScalingType;
}
export const IntegerParameterRange = S.suspend(() =>
  S.Struct({
    Name: S.String,
    MaxValue: S.Number,
    MinValue: S.Number,
    ScalingType: S.optional(ScalingType),
  }),
).annotations({
  identifier: "IntegerParameterRange",
}) as any as S.Schema<IntegerParameterRange>;
export type IntegerParameterRanges = IntegerParameterRange[];
export const IntegerParameterRanges = S.Array(IntegerParameterRange);
export type EvaluationType = "SUMMARY" | "COMPUTED" | (string & {});
export const EvaluationType = S.String;
export interface CreateDatasetRequest {
  DatasetName: string;
  Domain: Domain;
  DatasetType: DatasetType;
  DataFrequency?: string;
  Schema: Schema;
  EncryptionConfig?: EncryptionConfig;
  Tags?: Tag[];
}
export const CreateDatasetRequest = S.suspend(() =>
  S.Struct({
    DatasetName: S.String,
    Domain: Domain,
    DatasetType: DatasetType,
    DataFrequency: S.optional(S.String),
    Schema: Schema,
    EncryptionConfig: S.optional(EncryptionConfig),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDatasetRequest",
}) as any as S.Schema<CreateDatasetRequest>;
export interface CreateDatasetImportJobRequest {
  DatasetImportJobName: string;
  DatasetArn: string;
  DataSource: DataSource;
  TimestampFormat?: string;
  TimeZone?: string;
  UseGeolocationForTimeZone?: boolean;
  GeolocationFormat?: string;
  Tags?: Tag[];
  Format?: string;
  ImportMode?: ImportMode;
}
export const CreateDatasetImportJobRequest = S.suspend(() =>
  S.Struct({
    DatasetImportJobName: S.String,
    DatasetArn: S.String,
    DataSource: DataSource,
    TimestampFormat: S.optional(S.String),
    TimeZone: S.optional(S.String),
    UseGeolocationForTimeZone: S.optional(S.Boolean),
    GeolocationFormat: S.optional(S.String),
    Tags: S.optional(Tags),
    Format: S.optional(S.String),
    ImportMode: S.optional(ImportMode),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDatasetImportJobRequest",
}) as any as S.Schema<CreateDatasetImportJobRequest>;
export interface CreateExplainabilityResponse {
  ExplainabilityArn?: string;
}
export const CreateExplainabilityResponse = S.suspend(() =>
  S.Struct({ ExplainabilityArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateExplainabilityResponse",
}) as any as S.Schema<CreateExplainabilityResponse>;
export interface CreateExplainabilityExportResponse {
  ExplainabilityExportArn?: string;
}
export const CreateExplainabilityExportResponse = S.suspend(() =>
  S.Struct({ ExplainabilityExportArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateExplainabilityExportResponse",
}) as any as S.Schema<CreateExplainabilityExportResponse>;
export interface CreateForecastRequest {
  ForecastName: string;
  PredictorArn: string;
  ForecastTypes?: string[];
  Tags?: Tag[];
  TimeSeriesSelector?: TimeSeriesSelector;
}
export const CreateForecastRequest = S.suspend(() =>
  S.Struct({
    ForecastName: S.String,
    PredictorArn: S.String,
    ForecastTypes: S.optional(ForecastTypes),
    Tags: S.optional(Tags),
    TimeSeriesSelector: S.optional(TimeSeriesSelector),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateForecastRequest",
}) as any as S.Schema<CreateForecastRequest>;
export interface CreateWhatIfForecastRequest {
  WhatIfForecastName: string;
  WhatIfAnalysisArn: string;
  TimeSeriesTransformations?: TimeSeriesTransformation[];
  TimeSeriesReplacementsDataSource?: TimeSeriesReplacementsDataSource;
  Tags?: Tag[];
}
export const CreateWhatIfForecastRequest = S.suspend(() =>
  S.Struct({
    WhatIfForecastName: S.String,
    WhatIfAnalysisArn: S.String,
    TimeSeriesTransformations: S.optional(TimeSeriesTransformations),
    TimeSeriesReplacementsDataSource: S.optional(
      TimeSeriesReplacementsDataSource,
    ),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateWhatIfForecastRequest",
}) as any as S.Schema<CreateWhatIfForecastRequest>;
export interface AttributeConfig {
  AttributeName: string;
  Transformations: { [key: string]: string | undefined };
}
export const AttributeConfig = S.suspend(() =>
  S.Struct({ AttributeName: S.String, Transformations: Transformations }),
).annotations({
  identifier: "AttributeConfig",
}) as any as S.Schema<AttributeConfig>;
export type AttributeConfigs = AttributeConfig[];
export const AttributeConfigs = S.Array(AttributeConfig);
export interface AdditionalDataset {
  Name: string;
  Configuration?: { [key: string]: string[] | undefined };
}
export const AdditionalDataset = S.suspend(() =>
  S.Struct({ Name: S.String, Configuration: S.optional(Configuration) }),
).annotations({
  identifier: "AdditionalDataset",
}) as any as S.Schema<AdditionalDataset>;
export type AdditionalDatasets = AdditionalDataset[];
export const AdditionalDatasets = S.Array(AdditionalDataset);
export interface DataConfig {
  DatasetGroupArn: string;
  AttributeConfigs?: AttributeConfig[];
  AdditionalDatasets?: AdditionalDataset[];
}
export const DataConfig = S.suspend(() =>
  S.Struct({
    DatasetGroupArn: S.String,
    AttributeConfigs: S.optional(AttributeConfigs),
    AdditionalDatasets: S.optional(AdditionalDatasets),
  }),
).annotations({ identifier: "DataConfig" }) as any as S.Schema<DataConfig>;
export interface DescribeAutoPredictorResponse {
  PredictorArn?: string;
  PredictorName?: string;
  ForecastHorizon?: number;
  ForecastTypes?: string[];
  ForecastFrequency?: string;
  ForecastDimensions?: string[];
  DatasetImportJobArns?: string[];
  DataConfig?: DataConfig;
  EncryptionConfig?: EncryptionConfig;
  ReferencePredictorSummary?: ReferencePredictorSummary;
  EstimatedTimeRemainingInMinutes?: number;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
  OptimizationMetric?: OptimizationMetric;
  ExplainabilityInfo?: ExplainabilityInfo;
  MonitorInfo?: MonitorInfo;
  TimeAlignmentBoundary?: TimeAlignmentBoundary;
}
export const DescribeAutoPredictorResponse = S.suspend(() =>
  S.Struct({
    PredictorArn: S.optional(S.String),
    PredictorName: S.optional(S.String),
    ForecastHorizon: S.optional(S.Number),
    ForecastTypes: S.optional(ForecastTypes),
    ForecastFrequency: S.optional(S.String),
    ForecastDimensions: S.optional(ForecastDimensions),
    DatasetImportJobArns: S.optional(ArnList),
    DataConfig: S.optional(DataConfig),
    EncryptionConfig: S.optional(EncryptionConfig),
    ReferencePredictorSummary: S.optional(ReferencePredictorSummary),
    EstimatedTimeRemainingInMinutes: S.optional(S.Number),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    OptimizationMetric: S.optional(OptimizationMetric),
    ExplainabilityInfo: S.optional(ExplainabilityInfo),
    MonitorInfo: S.optional(MonitorInfo),
    TimeAlignmentBoundary: S.optional(TimeAlignmentBoundary),
  }),
).annotations({
  identifier: "DescribeAutoPredictorResponse",
}) as any as S.Schema<DescribeAutoPredictorResponse>;
export interface ListDatasetGroupsResponse {
  DatasetGroups?: DatasetGroupSummary[];
  NextToken?: string;
}
export const ListDatasetGroupsResponse = S.suspend(() =>
  S.Struct({
    DatasetGroups: S.optional(DatasetGroups),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatasetGroupsResponse",
}) as any as S.Schema<ListDatasetGroupsResponse>;
export interface ListDatasetsResponse {
  Datasets?: DatasetSummary[];
  NextToken?: string;
}
export const ListDatasetsResponse = S.suspend(() =>
  S.Struct({ Datasets: S.optional(Datasets), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDatasetsResponse",
}) as any as S.Schema<ListDatasetsResponse>;
export interface ListExplainabilitiesResponse {
  Explainabilities?: ExplainabilitySummary[];
  NextToken?: string;
}
export const ListExplainabilitiesResponse = S.suspend(() =>
  S.Struct({
    Explainabilities: S.optional(Explainabilities),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExplainabilitiesResponse",
}) as any as S.Schema<ListExplainabilitiesResponse>;
export interface ListExplainabilityExportsResponse {
  ExplainabilityExports?: ExplainabilityExportSummary[];
  NextToken?: string;
}
export const ListExplainabilityExportsResponse = S.suspend(() =>
  S.Struct({
    ExplainabilityExports: S.optional(ExplainabilityExports),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExplainabilityExportsResponse",
}) as any as S.Schema<ListExplainabilityExportsResponse>;
export interface ListForecastExportJobsResponse {
  ForecastExportJobs?: ForecastExportJobSummary[];
  NextToken?: string;
}
export const ListForecastExportJobsResponse = S.suspend(() =>
  S.Struct({
    ForecastExportJobs: S.optional(ForecastExportJobs),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListForecastExportJobsResponse",
}) as any as S.Schema<ListForecastExportJobsResponse>;
export interface ListForecastsResponse {
  Forecasts?: ForecastSummary[];
  NextToken?: string;
}
export const ListForecastsResponse = S.suspend(() =>
  S.Struct({
    Forecasts: S.optional(Forecasts),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListForecastsResponse",
}) as any as S.Schema<ListForecastsResponse>;
export interface ListMonitorsResponse {
  Monitors?: MonitorSummary[];
  NextToken?: string;
}
export const ListMonitorsResponse = S.suspend(() =>
  S.Struct({ Monitors: S.optional(Monitors), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListMonitorsResponse",
}) as any as S.Schema<ListMonitorsResponse>;
export interface ListPredictorBacktestExportJobsResponse {
  PredictorBacktestExportJobs?: PredictorBacktestExportJobSummary[];
  NextToken?: string;
}
export const ListPredictorBacktestExportJobsResponse = S.suspend(() =>
  S.Struct({
    PredictorBacktestExportJobs: S.optional(PredictorBacktestExportJobs),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPredictorBacktestExportJobsResponse",
}) as any as S.Schema<ListPredictorBacktestExportJobsResponse>;
export interface ListPredictorsResponse {
  Predictors?: PredictorSummary[];
  NextToken?: string;
}
export const ListPredictorsResponse = S.suspend(() =>
  S.Struct({
    Predictors: S.optional(Predictors),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPredictorsResponse",
}) as any as S.Schema<ListPredictorsResponse>;
export interface ListWhatIfAnalysesResponse {
  WhatIfAnalyses?: WhatIfAnalysisSummary[];
  NextToken?: string;
}
export const ListWhatIfAnalysesResponse = S.suspend(() =>
  S.Struct({
    WhatIfAnalyses: S.optional(WhatIfAnalyses),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWhatIfAnalysesResponse",
}) as any as S.Schema<ListWhatIfAnalysesResponse>;
export interface ListWhatIfForecastExportsResponse {
  WhatIfForecastExports?: WhatIfForecastExportSummary[];
  NextToken?: string;
}
export const ListWhatIfForecastExportsResponse = S.suspend(() =>
  S.Struct({
    WhatIfForecastExports: S.optional(WhatIfForecastExports),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWhatIfForecastExportsResponse",
}) as any as S.Schema<ListWhatIfForecastExportsResponse>;
export interface ListWhatIfForecastsResponse {
  WhatIfForecasts?: WhatIfForecastSummary[];
  NextToken?: string;
}
export const ListWhatIfForecastsResponse = S.suspend(() =>
  S.Struct({
    WhatIfForecasts: S.optional(WhatIfForecasts),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWhatIfForecastsResponse",
}) as any as S.Schema<ListWhatIfForecastsResponse>;
export interface ParameterRanges {
  CategoricalParameterRanges?: CategoricalParameterRange[];
  ContinuousParameterRanges?: ContinuousParameterRange[];
  IntegerParameterRanges?: IntegerParameterRange[];
}
export const ParameterRanges = S.suspend(() =>
  S.Struct({
    CategoricalParameterRanges: S.optional(CategoricalParameterRanges),
    ContinuousParameterRanges: S.optional(ContinuousParameterRanges),
    IntegerParameterRanges: S.optional(IntegerParameterRanges),
  }),
).annotations({
  identifier: "ParameterRanges",
}) as any as S.Schema<ParameterRanges>;
export interface Statistics {
  Count?: number;
  CountDistinct?: number;
  CountNull?: number;
  CountNan?: number;
  Min?: string;
  Max?: string;
  Avg?: number;
  Stddev?: number;
  CountLong?: number;
  CountDistinctLong?: number;
  CountNullLong?: number;
  CountNanLong?: number;
}
export const Statistics = S.suspend(() =>
  S.Struct({
    Count: S.optional(S.Number),
    CountDistinct: S.optional(S.Number),
    CountNull: S.optional(S.Number),
    CountNan: S.optional(S.Number),
    Min: S.optional(S.String),
    Max: S.optional(S.String),
    Avg: S.optional(S.Number),
    Stddev: S.optional(S.Number),
    CountLong: S.optional(S.Number),
    CountDistinctLong: S.optional(S.Number),
    CountNullLong: S.optional(S.Number),
    CountNanLong: S.optional(S.Number),
  }),
).annotations({ identifier: "Statistics" }) as any as S.Schema<Statistics>;
export interface PredictorEvent {
  Detail?: string;
  Datetime?: Date;
}
export const PredictorEvent = S.suspend(() =>
  S.Struct({
    Detail: S.optional(S.String),
    Datetime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "PredictorEvent",
}) as any as S.Schema<PredictorEvent>;
export interface MonitorDataSource {
  DatasetImportJobArn?: string;
  ForecastArn?: string;
  PredictorArn?: string;
}
export const MonitorDataSource = S.suspend(() =>
  S.Struct({
    DatasetImportJobArn: S.optional(S.String),
    ForecastArn: S.optional(S.String),
    PredictorArn: S.optional(S.String),
  }),
).annotations({
  identifier: "MonitorDataSource",
}) as any as S.Schema<MonitorDataSource>;
export interface MetricResult {
  MetricName?: string;
  MetricValue?: number;
}
export const MetricResult = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    MetricValue: S.optional(S.Number),
  }),
).annotations({ identifier: "MetricResult" }) as any as S.Schema<MetricResult>;
export type MetricResults = MetricResult[];
export const MetricResults = S.Array(MetricResult);
export type FeaturizationMethodParameters = {
  [key: string]: string | undefined;
};
export const FeaturizationMethodParameters = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface HyperParameterTuningJobConfig {
  ParameterRanges?: ParameterRanges;
}
export const HyperParameterTuningJobConfig = S.suspend(() =>
  S.Struct({ ParameterRanges: S.optional(ParameterRanges) }),
).annotations({
  identifier: "HyperParameterTuningJobConfig",
}) as any as S.Schema<HyperParameterTuningJobConfig>;
export type FieldStatistics = { [key: string]: Statistics | undefined };
export const FieldStatistics = S.Record({
  key: S.String,
  value: S.UndefinedOr(Statistics),
});
export interface DatasetImportJobSummary {
  DatasetImportJobArn?: string;
  DatasetImportJobName?: string;
  DataSource?: DataSource;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
  ImportMode?: ImportMode;
}
export const DatasetImportJobSummary = S.suspend(() =>
  S.Struct({
    DatasetImportJobArn: S.optional(S.String),
    DatasetImportJobName: S.optional(S.String),
    DataSource: S.optional(DataSource),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ImportMode: S.optional(ImportMode),
  }),
).annotations({
  identifier: "DatasetImportJobSummary",
}) as any as S.Schema<DatasetImportJobSummary>;
export type DatasetImportJobs = DatasetImportJobSummary[];
export const DatasetImportJobs = S.Array(DatasetImportJobSummary);
export interface PredictorMonitorEvaluation {
  ResourceArn?: string;
  MonitorArn?: string;
  EvaluationTime?: Date;
  EvaluationState?: string;
  WindowStartDatetime?: Date;
  WindowEndDatetime?: Date;
  PredictorEvent?: PredictorEvent;
  MonitorDataSource?: MonitorDataSource;
  MetricResults?: MetricResult[];
  NumItemsEvaluated?: number;
  Message?: string;
}
export const PredictorMonitorEvaluation = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    MonitorArn: S.optional(S.String),
    EvaluationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EvaluationState: S.optional(S.String),
    WindowStartDatetime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    WindowEndDatetime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PredictorEvent: S.optional(PredictorEvent),
    MonitorDataSource: S.optional(MonitorDataSource),
    MetricResults: S.optional(MetricResults),
    NumItemsEvaluated: S.optional(S.Number),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "PredictorMonitorEvaluation",
}) as any as S.Schema<PredictorMonitorEvaluation>;
export type PredictorMonitorEvaluations = PredictorMonitorEvaluation[];
export const PredictorMonitorEvaluations = S.Array(PredictorMonitorEvaluation);
export interface FeaturizationMethod {
  FeaturizationMethodName: FeaturizationMethodName;
  FeaturizationMethodParameters?: { [key: string]: string | undefined };
}
export const FeaturizationMethod = S.suspend(() =>
  S.Struct({
    FeaturizationMethodName: FeaturizationMethodName,
    FeaturizationMethodParameters: S.optional(FeaturizationMethodParameters),
  }),
).annotations({
  identifier: "FeaturizationMethod",
}) as any as S.Schema<FeaturizationMethod>;
export type FeaturizationPipeline = FeaturizationMethod[];
export const FeaturizationPipeline = S.Array(FeaturizationMethod);
export interface BaselineMetric {
  Name?: string;
  Value?: number;
}
export const BaselineMetric = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.Number) }),
).annotations({
  identifier: "BaselineMetric",
}) as any as S.Schema<BaselineMetric>;
export type BaselineMetrics = BaselineMetric[];
export const BaselineMetrics = S.Array(BaselineMetric);
export interface TestWindowSummary {
  TestWindowStart?: Date;
  TestWindowEnd?: Date;
  Status?: string;
  Message?: string;
}
export const TestWindowSummary = S.suspend(() =>
  S.Struct({
    TestWindowStart: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TestWindowEnd: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "TestWindowSummary",
}) as any as S.Schema<TestWindowSummary>;
export type TestWindowDetails = TestWindowSummary[];
export const TestWindowDetails = S.Array(TestWindowSummary);
export interface CreateAutoPredictorRequest {
  PredictorName: string;
  ForecastHorizon?: number;
  ForecastTypes?: string[];
  ForecastDimensions?: string[];
  ForecastFrequency?: string;
  DataConfig?: DataConfig;
  EncryptionConfig?: EncryptionConfig;
  ReferencePredictorArn?: string;
  OptimizationMetric?: OptimizationMetric;
  ExplainPredictor?: boolean;
  Tags?: Tag[];
  MonitorConfig?: MonitorConfig;
  TimeAlignmentBoundary?: TimeAlignmentBoundary;
}
export const CreateAutoPredictorRequest = S.suspend(() =>
  S.Struct({
    PredictorName: S.String,
    ForecastHorizon: S.optional(S.Number),
    ForecastTypes: S.optional(ForecastTypes),
    ForecastDimensions: S.optional(ForecastDimensions),
    ForecastFrequency: S.optional(S.String),
    DataConfig: S.optional(DataConfig),
    EncryptionConfig: S.optional(EncryptionConfig),
    ReferencePredictorArn: S.optional(S.String),
    OptimizationMetric: S.optional(OptimizationMetric),
    ExplainPredictor: S.optional(S.Boolean),
    Tags: S.optional(Tags),
    MonitorConfig: S.optional(MonitorConfig),
    TimeAlignmentBoundary: S.optional(TimeAlignmentBoundary),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAutoPredictorRequest",
}) as any as S.Schema<CreateAutoPredictorRequest>;
export interface CreateDatasetResponse {
  DatasetArn?: string;
}
export const CreateDatasetResponse = S.suspend(() =>
  S.Struct({ DatasetArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateDatasetResponse",
}) as any as S.Schema<CreateDatasetResponse>;
export interface CreateDatasetImportJobResponse {
  DatasetImportJobArn?: string;
}
export const CreateDatasetImportJobResponse = S.suspend(() =>
  S.Struct({ DatasetImportJobArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateDatasetImportJobResponse",
}) as any as S.Schema<CreateDatasetImportJobResponse>;
export interface CreateForecastResponse {
  ForecastArn?: string;
}
export const CreateForecastResponse = S.suspend(() =>
  S.Struct({ ForecastArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateForecastResponse",
}) as any as S.Schema<CreateForecastResponse>;
export interface CreateWhatIfForecastResponse {
  WhatIfForecastArn?: string;
}
export const CreateWhatIfForecastResponse = S.suspend(() =>
  S.Struct({ WhatIfForecastArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateWhatIfForecastResponse",
}) as any as S.Schema<CreateWhatIfForecastResponse>;
export interface DescribeDatasetImportJobResponse {
  DatasetImportJobName?: string;
  DatasetImportJobArn?: string;
  DatasetArn?: string;
  TimestampFormat?: string;
  TimeZone?: string;
  UseGeolocationForTimeZone?: boolean;
  GeolocationFormat?: string;
  DataSource?: DataSource;
  EstimatedTimeRemainingInMinutes?: number;
  FieldStatistics?: { [key: string]: Statistics | undefined };
  DataSize?: number;
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
  Format?: string;
  ImportMode?: ImportMode;
}
export const DescribeDatasetImportJobResponse = S.suspend(() =>
  S.Struct({
    DatasetImportJobName: S.optional(S.String),
    DatasetImportJobArn: S.optional(S.String),
    DatasetArn: S.optional(S.String),
    TimestampFormat: S.optional(S.String),
    TimeZone: S.optional(S.String),
    UseGeolocationForTimeZone: S.optional(S.Boolean),
    GeolocationFormat: S.optional(S.String),
    DataSource: S.optional(DataSource),
    EstimatedTimeRemainingInMinutes: S.optional(S.Number),
    FieldStatistics: S.optional(FieldStatistics),
    DataSize: S.optional(S.Number),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Format: S.optional(S.String),
    ImportMode: S.optional(ImportMode),
  }),
).annotations({
  identifier: "DescribeDatasetImportJobResponse",
}) as any as S.Schema<DescribeDatasetImportJobResponse>;
export interface ListDatasetImportJobsResponse {
  DatasetImportJobs?: DatasetImportJobSummary[];
  NextToken?: string;
}
export const ListDatasetImportJobsResponse = S.suspend(() =>
  S.Struct({
    DatasetImportJobs: S.optional(DatasetImportJobs),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatasetImportJobsResponse",
}) as any as S.Schema<ListDatasetImportJobsResponse>;
export interface ListMonitorEvaluationsResponse {
  NextToken?: string;
  PredictorMonitorEvaluations?: PredictorMonitorEvaluation[];
}
export const ListMonitorEvaluationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PredictorMonitorEvaluations: S.optional(PredictorMonitorEvaluations),
  }),
).annotations({
  identifier: "ListMonitorEvaluationsResponse",
}) as any as S.Schema<ListMonitorEvaluationsResponse>;
export interface Featurization {
  AttributeName: string;
  FeaturizationPipeline?: FeaturizationMethod[];
}
export const Featurization = S.suspend(() =>
  S.Struct({
    AttributeName: S.String,
    FeaturizationPipeline: S.optional(FeaturizationPipeline),
  }),
).annotations({
  identifier: "Featurization",
}) as any as S.Schema<Featurization>;
export type Featurizations = Featurization[];
export const Featurizations = S.Array(Featurization);
export interface PredictorBaseline {
  BaselineMetrics?: BaselineMetric[];
}
export const PredictorBaseline = S.suspend(() =>
  S.Struct({ BaselineMetrics: S.optional(BaselineMetrics) }),
).annotations({
  identifier: "PredictorBaseline",
}) as any as S.Schema<PredictorBaseline>;
export interface PredictorExecution {
  AlgorithmArn?: string;
  TestWindows?: TestWindowSummary[];
}
export const PredictorExecution = S.suspend(() =>
  S.Struct({
    AlgorithmArn: S.optional(S.String),
    TestWindows: S.optional(TestWindowDetails),
  }),
).annotations({
  identifier: "PredictorExecution",
}) as any as S.Schema<PredictorExecution>;
export type PredictorExecutions = PredictorExecution[];
export const PredictorExecutions = S.Array(PredictorExecution);
export interface WeightedQuantileLoss {
  Quantile?: number;
  LossValue?: number;
}
export const WeightedQuantileLoss = S.suspend(() =>
  S.Struct({ Quantile: S.optional(S.Number), LossValue: S.optional(S.Number) }),
).annotations({
  identifier: "WeightedQuantileLoss",
}) as any as S.Schema<WeightedQuantileLoss>;
export type WeightedQuantileLosses = WeightedQuantileLoss[];
export const WeightedQuantileLosses = S.Array(WeightedQuantileLoss);
export interface ErrorMetric {
  ForecastType?: string;
  WAPE?: number;
  RMSE?: number;
  MASE?: number;
  MAPE?: number;
}
export const ErrorMetric = S.suspend(() =>
  S.Struct({
    ForecastType: S.optional(S.String),
    WAPE: S.optional(S.Number),
    RMSE: S.optional(S.Number),
    MASE: S.optional(S.Number),
    MAPE: S.optional(S.Number),
  }),
).annotations({ identifier: "ErrorMetric" }) as any as S.Schema<ErrorMetric>;
export type ErrorMetrics = ErrorMetric[];
export const ErrorMetrics = S.Array(ErrorMetric);
export interface FeaturizationConfig {
  ForecastFrequency: string;
  ForecastDimensions?: string[];
  Featurizations?: Featurization[];
}
export const FeaturizationConfig = S.suspend(() =>
  S.Struct({
    ForecastFrequency: S.String,
    ForecastDimensions: S.optional(ForecastDimensions),
    Featurizations: S.optional(Featurizations),
  }),
).annotations({
  identifier: "FeaturizationConfig",
}) as any as S.Schema<FeaturizationConfig>;
export interface Baseline {
  PredictorBaseline?: PredictorBaseline;
}
export const Baseline = S.suspend(() =>
  S.Struct({ PredictorBaseline: S.optional(PredictorBaseline) }),
).annotations({ identifier: "Baseline" }) as any as S.Schema<Baseline>;
export interface PredictorExecutionDetails {
  PredictorExecutions?: PredictorExecution[];
}
export const PredictorExecutionDetails = S.suspend(() =>
  S.Struct({ PredictorExecutions: S.optional(PredictorExecutions) }),
).annotations({
  identifier: "PredictorExecutionDetails",
}) as any as S.Schema<PredictorExecutionDetails>;
export interface Metrics {
  RMSE?: number;
  WeightedQuantileLosses?: WeightedQuantileLoss[];
  ErrorMetrics?: ErrorMetric[];
  AverageWeightedQuantileLoss?: number;
}
export const Metrics = S.suspend(() =>
  S.Struct({
    RMSE: S.optional(S.Number),
    WeightedQuantileLosses: S.optional(WeightedQuantileLosses),
    ErrorMetrics: S.optional(ErrorMetrics),
    AverageWeightedQuantileLoss: S.optional(S.Number),
  }),
).annotations({ identifier: "Metrics" }) as any as S.Schema<Metrics>;
export interface CreateAutoPredictorResponse {
  PredictorArn?: string;
}
export const CreateAutoPredictorResponse = S.suspend(() =>
  S.Struct({ PredictorArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateAutoPredictorResponse",
}) as any as S.Schema<CreateAutoPredictorResponse>;
export interface CreatePredictorRequest {
  PredictorName: string;
  AlgorithmArn?: string;
  ForecastHorizon: number;
  ForecastTypes?: string[];
  PerformAutoML?: boolean;
  AutoMLOverrideStrategy?: AutoMLOverrideStrategy;
  PerformHPO?: boolean;
  TrainingParameters?: { [key: string]: string | undefined };
  EvaluationParameters?: EvaluationParameters;
  HPOConfig?: HyperParameterTuningJobConfig;
  InputDataConfig: InputDataConfig;
  FeaturizationConfig: FeaturizationConfig;
  EncryptionConfig?: EncryptionConfig;
  Tags?: Tag[];
  OptimizationMetric?: OptimizationMetric;
}
export const CreatePredictorRequest = S.suspend(() =>
  S.Struct({
    PredictorName: S.String,
    AlgorithmArn: S.optional(S.String),
    ForecastHorizon: S.Number,
    ForecastTypes: S.optional(ForecastTypes),
    PerformAutoML: S.optional(S.Boolean),
    AutoMLOverrideStrategy: S.optional(AutoMLOverrideStrategy),
    PerformHPO: S.optional(S.Boolean),
    TrainingParameters: S.optional(TrainingParameters),
    EvaluationParameters: S.optional(EvaluationParameters),
    HPOConfig: S.optional(HyperParameterTuningJobConfig),
    InputDataConfig: InputDataConfig,
    FeaturizationConfig: FeaturizationConfig,
    EncryptionConfig: S.optional(EncryptionConfig),
    Tags: S.optional(Tags),
    OptimizationMetric: S.optional(OptimizationMetric),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePredictorRequest",
}) as any as S.Schema<CreatePredictorRequest>;
export interface DescribeMonitorResponse {
  MonitorName?: string;
  MonitorArn?: string;
  ResourceArn?: string;
  Status?: string;
  LastEvaluationTime?: Date;
  LastEvaluationState?: string;
  Baseline?: Baseline;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
  EstimatedEvaluationTimeRemainingInMinutes?: number;
}
export const DescribeMonitorResponse = S.suspend(() =>
  S.Struct({
    MonitorName: S.optional(S.String),
    MonitorArn: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    Status: S.optional(S.String),
    LastEvaluationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastEvaluationState: S.optional(S.String),
    Baseline: S.optional(Baseline),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EstimatedEvaluationTimeRemainingInMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "DescribeMonitorResponse",
}) as any as S.Schema<DescribeMonitorResponse>;
export interface DescribePredictorResponse {
  PredictorArn?: string;
  PredictorName?: string;
  AlgorithmArn?: string;
  AutoMLAlgorithmArns?: string[];
  ForecastHorizon?: number;
  ForecastTypes?: string[];
  PerformAutoML?: boolean;
  AutoMLOverrideStrategy?: AutoMLOverrideStrategy;
  PerformHPO?: boolean;
  TrainingParameters?: { [key: string]: string | undefined };
  EvaluationParameters?: EvaluationParameters;
  HPOConfig?: HyperParameterTuningJobConfig;
  InputDataConfig?: InputDataConfig;
  FeaturizationConfig?: FeaturizationConfig;
  EncryptionConfig?: EncryptionConfig;
  PredictorExecutionDetails?: PredictorExecutionDetails;
  EstimatedTimeRemainingInMinutes?: number;
  IsAutoPredictor?: boolean;
  DatasetImportJobArns?: string[];
  Status?: string;
  Message?: string;
  CreationTime?: Date;
  LastModificationTime?: Date;
  OptimizationMetric?: OptimizationMetric;
}
export const DescribePredictorResponse = S.suspend(() =>
  S.Struct({
    PredictorArn: S.optional(S.String),
    PredictorName: S.optional(S.String),
    AlgorithmArn: S.optional(S.String),
    AutoMLAlgorithmArns: S.optional(ArnList),
    ForecastHorizon: S.optional(S.Number),
    ForecastTypes: S.optional(ForecastTypes),
    PerformAutoML: S.optional(S.Boolean),
    AutoMLOverrideStrategy: S.optional(AutoMLOverrideStrategy),
    PerformHPO: S.optional(S.Boolean),
    TrainingParameters: S.optional(TrainingParameters),
    EvaluationParameters: S.optional(EvaluationParameters),
    HPOConfig: S.optional(HyperParameterTuningJobConfig),
    InputDataConfig: S.optional(InputDataConfig),
    FeaturizationConfig: S.optional(FeaturizationConfig),
    EncryptionConfig: S.optional(EncryptionConfig),
    PredictorExecutionDetails: S.optional(PredictorExecutionDetails),
    EstimatedTimeRemainingInMinutes: S.optional(S.Number),
    IsAutoPredictor: S.optional(S.Boolean),
    DatasetImportJobArns: S.optional(ArnList),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    OptimizationMetric: S.optional(OptimizationMetric),
  }),
).annotations({
  identifier: "DescribePredictorResponse",
}) as any as S.Schema<DescribePredictorResponse>;
export interface WindowSummary {
  TestWindowStart?: Date;
  TestWindowEnd?: Date;
  ItemCount?: number;
  EvaluationType?: EvaluationType;
  Metrics?: Metrics;
}
export const WindowSummary = S.suspend(() =>
  S.Struct({
    TestWindowStart: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TestWindowEnd: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ItemCount: S.optional(S.Number),
    EvaluationType: S.optional(EvaluationType),
    Metrics: S.optional(Metrics),
  }),
).annotations({
  identifier: "WindowSummary",
}) as any as S.Schema<WindowSummary>;
export type TestWindows = WindowSummary[];
export const TestWindows = S.Array(WindowSummary);
export interface EvaluationResult {
  AlgorithmArn?: string;
  TestWindows?: WindowSummary[];
}
export const EvaluationResult = S.suspend(() =>
  S.Struct({
    AlgorithmArn: S.optional(S.String),
    TestWindows: S.optional(TestWindows),
  }),
).annotations({
  identifier: "EvaluationResult",
}) as any as S.Schema<EvaluationResult>;
export type PredictorEvaluationResults = EvaluationResult[];
export const PredictorEvaluationResults = S.Array(EvaluationResult);
export interface CreatePredictorResponse {
  PredictorArn?: string;
}
export const CreatePredictorResponse = S.suspend(() =>
  S.Struct({ PredictorArn: S.optional(S.String) }),
).annotations({
  identifier: "CreatePredictorResponse",
}) as any as S.Schema<CreatePredictorResponse>;
export interface GetAccuracyMetricsResponse {
  PredictorEvaluationResults?: EvaluationResult[];
  IsAutoPredictor?: boolean;
  AutoMLOverrideStrategy?: AutoMLOverrideStrategy;
  OptimizationMetric?: OptimizationMetric;
}
export const GetAccuracyMetricsResponse = S.suspend(() =>
  S.Struct({
    PredictorEvaluationResults: S.optional(PredictorEvaluationResults),
    IsAutoPredictor: S.optional(S.Boolean),
    AutoMLOverrideStrategy: S.optional(AutoMLOverrideStrategy),
    OptimizationMetric: S.optional(OptimizationMetric),
  }),
).annotations({
  identifier: "GetAccuracyMetricsResponse",
}) as any as S.Schema<GetAccuracyMetricsResponse>;

//# Errors
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Describes an Amazon Forecast dataset created using the CreateDataset operation.
 *
 * In addition to listing the parameters specified in the `CreateDataset` request,
 * this operation includes the following dataset properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 */
export const describeDataset: (
  input: DescribeDatasetRequest,
) => effect.Effect<
  DescribeDatasetResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Resumes a stopped monitor resource.
 */
export const resumeResource: (
  input: ResumeResourceRequest,
) => effect.Effect<
  ResumeResourceResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeResourceRequest,
  output: ResumeResourceResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a dataset group created using the CreateDatasetGroup operation.
 * You can only delete dataset groups that have a status of `ACTIVE`,
 * `CREATE_FAILED`, or `UPDATE_FAILED`. To get the status, use the DescribeDatasetGroup operation.
 *
 * This operation deletes only the dataset group, not the datasets in the group.
 */
export const deleteDatasetGroup: (
  input: DeleteDatasetGroupRequest,
) => effect.Effect<
  DeleteDatasetGroupResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetGroupRequest,
  output: DeleteDatasetGroupResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a dataset import job created using the CreateDatasetImportJob
 * operation. You can delete only dataset import jobs that have a status of `ACTIVE`
 * or `CREATE_FAILED`. To get the status, use the DescribeDatasetImportJob
 * operation.
 */
export const deleteDatasetImportJob: (
  input: DeleteDatasetImportJobRequest,
) => effect.Effect<
  DeleteDatasetImportJobResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetImportJobRequest,
  output: DeleteDatasetImportJobResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an Explainability resource.
 *
 * You can delete only predictor that have a status of `ACTIVE` or
 * `CREATE_FAILED`. To get the status, use the DescribeExplainability operation.
 */
export const deleteExplainability: (
  input: DeleteExplainabilityRequest,
) => effect.Effect<
  DeleteExplainabilityResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExplainabilityRequest,
  output: DeleteExplainabilityResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an Explainability export.
 */
export const deleteExplainabilityExport: (
  input: DeleteExplainabilityExportRequest,
) => effect.Effect<
  DeleteExplainabilityExportResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExplainabilityExportRequest,
  output: DeleteExplainabilityExportResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a forecast created using the CreateForecast operation. You can
 * delete only forecasts that have a status of `ACTIVE` or `CREATE_FAILED`.
 * To get the status, use the DescribeForecast operation.
 *
 * You can't delete a forecast while it is being exported. After a forecast is deleted, you
 * can no longer query the forecast.
 */
export const deleteForecast: (
  input: DeleteForecastRequest,
) => effect.Effect<
  DeleteForecastResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteForecastRequest,
  output: DeleteForecastResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a forecast export job created using the CreateForecastExportJob
 * operation. You can delete only export jobs that have a status of `ACTIVE` or
 * `CREATE_FAILED`. To get the status, use the DescribeForecastExportJob operation.
 */
export const deleteForecastExportJob: (
  input: DeleteForecastExportJobRequest,
) => effect.Effect<
  DeleteForecastExportJobResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteForecastExportJobRequest,
  output: DeleteForecastExportJobResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a monitor resource. You can only delete a monitor resource with a status of `ACTIVE`, `ACTIVE_STOPPED`, `CREATE_FAILED`, or `CREATE_STOPPED`.
 */
export const deleteMonitor: (
  input: DeleteMonitorRequest,
) => effect.Effect<
  DeleteMonitorResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMonitorRequest,
  output: DeleteMonitorResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a predictor created using the DescribePredictor or CreatePredictor operations. You can delete only predictor that have a status of
 * `ACTIVE` or `CREATE_FAILED`. To get the status, use the DescribePredictor operation.
 */
export const deletePredictor: (
  input: DeletePredictorRequest,
) => effect.Effect<
  DeletePredictorResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePredictorRequest,
  output: DeletePredictorResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a predictor backtest export job.
 */
export const deletePredictorBacktestExportJob: (
  input: DeletePredictorBacktestExportJobRequest,
) => effect.Effect<
  DeletePredictorBacktestExportJobResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePredictorBacktestExportJobRequest,
  output: DeletePredictorBacktestExportJobResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an entire resource tree. This operation will delete the parent resource and
 * its child resources.
 *
 * Child resources are resources that were created from another resource. For example,
 * when a forecast is generated from a predictor, the forecast is the child resource and
 * the predictor is the parent resource.
 *
 * Amazon Forecast resources possess the following parent-child resource hierarchies:
 *
 * - **Dataset**: dataset import jobs
 *
 * - **Dataset Group**: predictors, predictor backtest
 * export jobs, forecasts, forecast export jobs
 *
 * - **Predictor**: predictor backtest export jobs,
 * forecasts, forecast export jobs
 *
 * - **Forecast**: forecast export jobs
 *
 * `DeleteResourceTree` will only delete Amazon Forecast resources, and will not
 * delete datasets or exported files stored in Amazon S3.
 */
export const deleteResourceTree: (
  input: DeleteResourceTreeRequest,
) => effect.Effect<
  DeleteResourceTreeResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceTreeRequest,
  output: DeleteResourceTreeResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a what-if analysis created using the CreateWhatIfAnalysis
 * operation. You can delete only what-if analyses that have a status of `ACTIVE` or `CREATE_FAILED`. To get the status, use the DescribeWhatIfAnalysis operation.
 *
 * You can't delete a what-if analysis while any of its forecasts are being exported.
 */
export const deleteWhatIfAnalysis: (
  input: DeleteWhatIfAnalysisRequest,
) => effect.Effect<
  DeleteWhatIfAnalysisResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWhatIfAnalysisRequest,
  output: DeleteWhatIfAnalysisResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a what-if forecast created using the CreateWhatIfForecast
 * operation. You can delete only what-if forecasts that have a status of `ACTIVE` or `CREATE_FAILED`. To get the status, use the DescribeWhatIfForecast operation.
 *
 * You can't delete a what-if forecast while it is being exported. After a what-if forecast is deleted, you can no longer query the what-if analysis.
 */
export const deleteWhatIfForecast: (
  input: DeleteWhatIfForecastRequest,
) => effect.Effect<
  DeleteWhatIfForecastResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWhatIfForecastRequest,
  output: DeleteWhatIfForecastResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a what-if forecast export created using the CreateWhatIfForecastExport
 * operation. You can delete only what-if forecast exports that have a status of `ACTIVE` or `CREATE_FAILED`. To get the status, use the DescribeWhatIfForecastExport operation.
 */
export const deleteWhatIfForecastExport: (
  input: DeleteWhatIfForecastExportRequest,
) => effect.Effect<
  DeleteWhatIfForecastExportResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWhatIfForecastExportRequest,
  output: DeleteWhatIfForecastExportResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Replaces the datasets in a dataset group with the specified datasets.
 *
 * The `Status` of the dataset group must be `ACTIVE` before you can
 * use the dataset group to create a predictor. Use the DescribeDatasetGroup
 * operation to get the status.
 */
export const updateDatasetGroup: (
  input: UpdateDatasetGroupRequest,
) => effect.Effect<
  UpdateDatasetGroupResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatasetGroupRequest,
  output: UpdateDatasetGroupResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes a dataset group created using the CreateDatasetGroup
 * operation.
 *
 * In addition to listing the parameters provided in the `CreateDatasetGroup`
 * request, this operation includes the following properties:
 *
 * - `DatasetArns` - The datasets belonging to the group.
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 */
export const describeDatasetGroup: (
  input: DescribeDatasetGroupRequest,
) => effect.Effect<
  DescribeDatasetGroupResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetGroupRequest,
  output: DescribeDatasetGroupResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes an Explainability resource created using the CreateExplainability operation.
 */
export const describeExplainability: (
  input: DescribeExplainabilityRequest,
) => effect.Effect<
  DescribeExplainabilityResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExplainabilityRequest,
  output: DescribeExplainabilityResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes an Explainability export created using the CreateExplainabilityExport operation.
 */
export const describeExplainabilityExport: (
  input: DescribeExplainabilityExportRequest,
) => effect.Effect<
  DescribeExplainabilityExportResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExplainabilityExportRequest,
  output: DescribeExplainabilityExportResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a forecast created using the CreateForecast operation.
 *
 * In addition to listing the properties provided in the `CreateForecast` request,
 * this operation lists the following properties:
 *
 * - `DatasetGroupArn` - The dataset group that provided the training
 * data.
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 *
 * - `Message` - If an error occurred, information about the error.
 */
export const describeForecast: (
  input: DescribeForecastRequest,
) => effect.Effect<
  DescribeForecastResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeForecastRequest,
  output: DescribeForecastResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a forecast export job created using the CreateForecastExportJob operation.
 *
 * In addition to listing the properties provided by the user in the
 * `CreateForecastExportJob` request, this operation lists the following
 * properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 *
 * - `Message` - If an error occurred, information about the error.
 */
export const describeForecastExportJob: (
  input: DescribeForecastExportJobRequest,
) => effect.Effect<
  DescribeForecastExportJobResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeForecastExportJobRequest,
  output: DescribeForecastExportJobResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a predictor backtest export job created using the CreatePredictorBacktestExportJob operation.
 *
 * In addition to listing the properties provided by the user in the
 * `CreatePredictorBacktestExportJob` request, this operation lists the
 * following properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 *
 * - `Message` (if an error occurred)
 */
export const describePredictorBacktestExportJob: (
  input: DescribePredictorBacktestExportJobRequest,
) => effect.Effect<
  DescribePredictorBacktestExportJobResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePredictorBacktestExportJobRequest,
  output: DescribePredictorBacktestExportJobResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the what-if analysis created using the CreateWhatIfAnalysis operation.
 *
 * In addition to listing the properties provided in the `CreateWhatIfAnalysis` request, this operation lists the following properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Message` - If an error occurred, information about the error.
 *
 * - `Status`
 */
export const describeWhatIfAnalysis: (
  input: DescribeWhatIfAnalysisRequest,
) => effect.Effect<
  DescribeWhatIfAnalysisResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWhatIfAnalysisRequest,
  output: DescribeWhatIfAnalysisResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the what-if forecast created using the CreateWhatIfForecast operation.
 *
 * In addition to listing the properties provided in the `CreateWhatIfForecast` request, this operation lists the following properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Message` - If an error occurred, information about the error.
 *
 * - `Status`
 */
export const describeWhatIfForecast: (
  input: DescribeWhatIfForecastRequest,
) => effect.Effect<
  DescribeWhatIfForecastResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWhatIfForecastRequest,
  output: DescribeWhatIfForecastResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the what-if forecast export created using the CreateWhatIfForecastExport operation.
 *
 * In addition to listing the properties provided in the `CreateWhatIfForecastExport` request, this operation lists the following properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Message` - If an error occurred, information about the error.
 *
 * - `Status`
 */
export const describeWhatIfForecastExport: (
  input: DescribeWhatIfForecastExportRequest,
) => effect.Effect<
  DescribeWhatIfForecastExportResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWhatIfForecastExportRequest,
  output: DescribeWhatIfForecastExportResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Lists the tags for an Amazon Forecast resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Deletes the specified tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Deletes an Amazon Forecast dataset that was created using the CreateDataset operation. You can
 * only delete datasets that have a status of `ACTIVE` or `CREATE_FAILED`.
 * To get the status use the DescribeDataset operation.
 *
 * Forecast does not automatically update any dataset groups that contain the deleted dataset.
 * In order to update the dataset group, use the UpdateDatasetGroup operation,
 * omitting the deleted dataset's ARN.
 */
export const deleteDataset: (
  input: DeleteDatasetRequest,
) => effect.Effect<
  DeleteDatasetResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes a predictor created using the CreateAutoPredictor operation.
 */
export const describeAutoPredictor: (
  input: DescribeAutoPredictorRequest,
) => effect.Effect<
  DescribeAutoPredictorResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAutoPredictorRequest,
  output: DescribeAutoPredictorResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Stops a resource.
 *
 * The resource undergoes the following states: `CREATE_STOPPING` and
 * `CREATE_STOPPED`. You cannot resume a resource once it has been
 * stopped.
 *
 * This operation can be applied to the following resources (and their corresponding child
 * resources):
 *
 * - Dataset Import Job
 *
 * - Predictor Job
 *
 * - Forecast Job
 *
 * - Forecast Export Job
 *
 * - Predictor Backtest Export Job
 *
 * - Explainability Job
 *
 * - Explainability Export Job
 */
export const stopResource: (
  input: StopResourceRequest,
) => effect.Effect<
  StopResourceResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopResourceRequest,
  output: StopResourceResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates the specified tags to a resource with the specified `resourceArn`.
 * If existing tags on a resource are not specified in the request parameters, they are not
 * changed. When a resource is deleted, the tags associated with that resource are also
 * deleted.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes a dataset import job created using the CreateDatasetImportJob
 * operation.
 *
 * In addition to listing the parameters provided in the `CreateDatasetImportJob`
 * request, this operation includes the following properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `DataSize`
 *
 * - `FieldStatistics`
 *
 * - `Status`
 *
 * - `Message` - If an error occurred, information about the error.
 */
export const describeDatasetImportJob: (
  input: DescribeDatasetImportJobRequest,
) => effect.Effect<
  DescribeDatasetImportJobResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetImportJobRequest,
  output: DescribeDatasetImportJobResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Returns a list of dataset groups created using the CreateDatasetGroup operation.
 * For each dataset group, this operation returns a summary of its properties, including its
 * Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the
 * dataset group ARN with the DescribeDatasetGroup
 * operation.
 */
export const listDatasetGroups: {
  (
    input: ListDatasetGroupsRequest,
  ): effect.Effect<
    ListDatasetGroupsResponse,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetGroupsRequest,
  ) => stream.Stream<
    ListDatasetGroupsResponse,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetGroupsRequest,
  ) => stream.Stream<
    DatasetGroupSummary,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetGroupsRequest,
  output: ListDatasetGroupsResponse,
  errors: [InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DatasetGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of dataset import jobs created using the CreateDatasetImportJob
 * operation. For each import job, this operation returns a summary of its properties, including
 * its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the
 * ARN with the DescribeDatasetImportJob
 * operation. You can filter the list by providing an array of Filter objects.
 */
export const listDatasetImportJobs: {
  (
    input: ListDatasetImportJobsRequest,
  ): effect.Effect<
    ListDatasetImportJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetImportJobsRequest,
  ) => stream.Stream<
    ListDatasetImportJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetImportJobsRequest,
  ) => stream.Stream<
    DatasetImportJobSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetImportJobsRequest,
  output: ListDatasetImportJobsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DatasetImportJobs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of the monitoring evaluation results and predictor events collected by
 * the monitor resource during different windows of time.
 *
 * For information about monitoring see predictor-monitoring. For
 * more information about retrieving monitoring results see Viewing Monitoring Results.
 */
export const listMonitorEvaluations: {
  (
    input: ListMonitorEvaluationsRequest,
  ): effect.Effect<
    ListMonitorEvaluationsResponse,
    | InvalidInputException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMonitorEvaluationsRequest,
  ) => stream.Stream<
    ListMonitorEvaluationsResponse,
    | InvalidInputException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMonitorEvaluationsRequest,
  ) => stream.Stream<
    PredictorMonitorEvaluation,
    | InvalidInputException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMonitorEvaluationsRequest,
  output: ListMonitorEvaluationsResponse,
  errors: [
    InvalidInputException,
    InvalidNextTokenException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PredictorMonitorEvaluations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of datasets created using the CreateDataset operation. For each
 * dataset, a summary of its properties, including its Amazon Resource Name (ARN), is returned.
 * To retrieve the complete set of properties, use the ARN with the DescribeDataset operation.
 */
export const listDatasets: {
  (
    input: ListDatasetsRequest,
  ): effect.Effect<
    ListDatasetsResponse,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetsRequest,
  ) => stream.Stream<
    ListDatasetsResponse,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetsRequest,
  ) => stream.Stream<
    DatasetSummary,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Datasets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of Explainability resources created using the CreateExplainability operation. This operation returns a summary for
 * each Explainability. You can filter the list using an array of Filter
 * objects.
 *
 * To retrieve the complete set of properties for a particular Explainability resource,
 * use the ARN with the DescribeExplainability operation.
 */
export const listExplainabilities: {
  (
    input: ListExplainabilitiesRequest,
  ): effect.Effect<
    ListExplainabilitiesResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExplainabilitiesRequest,
  ) => stream.Stream<
    ListExplainabilitiesResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExplainabilitiesRequest,
  ) => stream.Stream<
    ExplainabilitySummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExplainabilitiesRequest,
  output: ListExplainabilitiesResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Explainabilities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of Explainability exports created using the CreateExplainabilityExport operation. This operation returns a summary
 * for each Explainability export. You can filter the list using an array of Filter objects.
 *
 * To retrieve the complete set of properties for a particular Explainability export, use
 * the ARN with the DescribeExplainability operation.
 */
export const listExplainabilityExports: {
  (
    input: ListExplainabilityExportsRequest,
  ): effect.Effect<
    ListExplainabilityExportsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExplainabilityExportsRequest,
  ) => stream.Stream<
    ListExplainabilityExportsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExplainabilityExportsRequest,
  ) => stream.Stream<
    ExplainabilityExportSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExplainabilityExportsRequest,
  output: ListExplainabilityExportsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ExplainabilityExports",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of forecast export jobs created using the CreateForecastExportJob operation. For each forecast export job, this operation
 * returns a summary of its properties, including its Amazon Resource Name (ARN). To retrieve the
 * complete set of properties, use the ARN with the DescribeForecastExportJob
 * operation. You can filter the list using an array of Filter objects.
 */
export const listForecastExportJobs: {
  (
    input: ListForecastExportJobsRequest,
  ): effect.Effect<
    ListForecastExportJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListForecastExportJobsRequest,
  ) => stream.Stream<
    ListForecastExportJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListForecastExportJobsRequest,
  ) => stream.Stream<
    ForecastExportJobSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListForecastExportJobsRequest,
  output: ListForecastExportJobsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ForecastExportJobs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of forecasts created using the CreateForecast operation.
 * For each forecast, this operation returns a summary of its properties, including its Amazon
 * Resource Name (ARN). To retrieve the complete set of properties, specify the ARN with the
 * DescribeForecast operation. You can filter the list using an array of
 * Filter objects.
 */
export const listForecasts: {
  (
    input: ListForecastsRequest,
  ): effect.Effect<
    ListForecastsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListForecastsRequest,
  ) => stream.Stream<
    ListForecastsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListForecastsRequest,
  ) => stream.Stream<
    ForecastSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListForecastsRequest,
  output: ListForecastsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Forecasts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of monitors created with the CreateMonitor operation and CreateAutoPredictor operation. For each monitor resource, this operation returns of a summary of its properties, including its Amazon Resource Name (ARN). You
 * can retrieve a complete set of properties of a monitor resource by specify the monitor's ARN in the DescribeMonitor operation.
 */
export const listMonitors: {
  (
    input: ListMonitorsRequest,
  ): effect.Effect<
    ListMonitorsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMonitorsRequest,
  ) => stream.Stream<
    ListMonitorsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMonitorsRequest,
  ) => stream.Stream<
    MonitorSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMonitorsRequest,
  output: ListMonitorsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Monitors",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of predictor backtest export jobs created using the CreatePredictorBacktestExportJob operation. This operation returns a
 * summary for each backtest export job. You can filter the list using an array of Filter objects.
 *
 * To retrieve the complete set of properties for a particular backtest export job, use
 * the ARN with the DescribePredictorBacktestExportJob operation.
 */
export const listPredictorBacktestExportJobs: {
  (
    input: ListPredictorBacktestExportJobsRequest,
  ): effect.Effect<
    ListPredictorBacktestExportJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPredictorBacktestExportJobsRequest,
  ) => stream.Stream<
    ListPredictorBacktestExportJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPredictorBacktestExportJobsRequest,
  ) => stream.Stream<
    PredictorBacktestExportJobSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPredictorBacktestExportJobsRequest,
  output: ListPredictorBacktestExportJobsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PredictorBacktestExportJobs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of predictors created using the CreateAutoPredictor or
 * CreatePredictor operations. For each predictor, this operation returns a
 * summary of its properties, including its Amazon Resource Name (ARN).
 *
 * You can retrieve the complete set of properties by using the ARN with the DescribeAutoPredictor and DescribePredictor operations. You
 * can filter the list using an array of Filter objects.
 */
export const listPredictors: {
  (
    input: ListPredictorsRequest,
  ): effect.Effect<
    ListPredictorsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPredictorsRequest,
  ) => stream.Stream<
    ListPredictorsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPredictorsRequest,
  ) => stream.Stream<
    PredictorSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPredictorsRequest,
  output: ListPredictorsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Predictors",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of what-if analyses created using the CreateWhatIfAnalysis operation. For each what-if analysis, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if analysis ARN with the DescribeWhatIfAnalysis operation.
 */
export const listWhatIfAnalyses: {
  (
    input: ListWhatIfAnalysesRequest,
  ): effect.Effect<
    ListWhatIfAnalysesResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWhatIfAnalysesRequest,
  ) => stream.Stream<
    ListWhatIfAnalysesResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWhatIfAnalysesRequest,
  ) => stream.Stream<
    WhatIfAnalysisSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWhatIfAnalysesRequest,
  output: ListWhatIfAnalysesResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "WhatIfAnalyses",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of what-if forecast exports created using the CreateWhatIfForecastExport operation. For each what-if forecast export, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if forecast export ARN with the DescribeWhatIfForecastExport operation.
 */
export const listWhatIfForecastExports: {
  (
    input: ListWhatIfForecastExportsRequest,
  ): effect.Effect<
    ListWhatIfForecastExportsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWhatIfForecastExportsRequest,
  ) => stream.Stream<
    ListWhatIfForecastExportsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWhatIfForecastExportsRequest,
  ) => stream.Stream<
    WhatIfForecastExportSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWhatIfForecastExportsRequest,
  output: ListWhatIfForecastExportsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "WhatIfForecastExports",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of what-if forecasts created using the CreateWhatIfForecast operation. For each what-if forecast, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if forecast ARN with the DescribeWhatIfForecast operation.
 */
export const listWhatIfForecasts: {
  (
    input: ListWhatIfForecastsRequest,
  ): effect.Effect<
    ListWhatIfForecastsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWhatIfForecastsRequest,
  ) => stream.Stream<
    ListWhatIfForecastsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWhatIfForecastsRequest,
  ) => stream.Stream<
    WhatIfForecastSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWhatIfForecastsRequest,
  output: ListWhatIfForecastsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "WhatIfForecasts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a dataset group, which holds a collection of related datasets. You can add
 * datasets to the dataset group when you create the dataset group, or later by using the UpdateDatasetGroup operation.
 *
 * After creating a dataset group and adding datasets, you use the dataset group when you
 * create a predictor. For more information, see Dataset groups.
 *
 * To get a list of all your datasets groups, use the ListDatasetGroups
 * operation.
 *
 * The `Status` of a dataset group must be `ACTIVE` before you can
 * use the dataset group to create a predictor. To get the status, use the DescribeDatasetGroup operation.
 */
export const createDatasetGroup: (
  input: CreateDatasetGroupRequest,
) => effect.Effect<
  CreateDatasetGroupResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetGroupRequest,
  output: CreateDatasetGroupResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Exports a forecast created by the CreateForecast operation to your
 * Amazon Simple Storage Service (Amazon S3) bucket. The forecast file name will match the following conventions:
 *
 * __
 *
 * where the component is in Java SimpleDateFormat
 * (yyyy-MM-ddTHH-mm-ssZ).
 *
 * You must specify a DataDestination object that includes an Identity and Access Management
 * (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see
 * aws-forecast-iam-roles.
 *
 * For more information, see howitworks-forecast.
 *
 * To get a list of all your forecast export jobs, use the ListForecastExportJobs operation.
 *
 * The `Status` of the forecast export job must be `ACTIVE` before
 * you can access the forecast in your Amazon S3 bucket. To get the status, use the DescribeForecastExportJob operation.
 */
export const createForecastExportJob: (
  input: CreateForecastExportJobRequest,
) => effect.Effect<
  CreateForecastExportJobResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateForecastExportJobRequest,
  output: CreateForecastExportJobResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a predictor monitor resource for an existing auto predictor. Predictor monitoring allows you to see how your predictor's performance changes over time.
 * For more information, see Predictor Monitoring.
 */
export const createMonitor: (
  input: CreateMonitorRequest,
) => effect.Effect<
  CreateMonitorResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMonitorRequest,
  output: CreateMonitorResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Exports backtest forecasts and accuracy metrics generated by the CreateAutoPredictor or CreatePredictor operations. Two
 * folders containing CSV or Parquet files are exported to your specified S3 bucket.
 *
 * The export file names will match the following conventions:
 *
 * `__.csv`
 *
 * The component is in Java SimpleDate format
 * (yyyy-MM-ddTHH-mm-ssZ).
 *
 * You must specify a DataDestination object that includes an Amazon S3
 * bucket and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3
 * bucket. For more information, see aws-forecast-iam-roles.
 *
 * The `Status` of the export job must be `ACTIVE` before you
 * can access the export in your Amazon S3 bucket. To get the status, use the DescribePredictorBacktestExportJob operation.
 */
export const createPredictorBacktestExportJob: (
  input: CreatePredictorBacktestExportJobRequest,
) => effect.Effect<
  CreatePredictorBacktestExportJobResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePredictorBacktestExportJobRequest,
  output: CreatePredictorBacktestExportJobResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * What-if analysis is a scenario modeling technique where you make a hypothetical change to a time series and
 * compare the forecasts generated by these changes against the baseline, unchanged time series. It is important to
 * remember that the purpose of a what-if analysis is to understand how a forecast can change given different
 * modifications to the baseline time series.
 *
 * For example, imagine you are a clothing retailer who is considering an end of season sale
 * to clear space for new styles. After creating a baseline forecast, you can use a what-if
 * analysis to investigate how different sales tactics might affect your goals.
 *
 * You could create a scenario where everything is given a 25% markdown, and another where
 * everything is given a fixed dollar markdown. You could create a scenario where the sale lasts for one week and
 * another where the sale lasts for one month.
 * With a what-if analysis, you can compare many different scenarios against each other.
 *
 * Note that a what-if analysis is meant to display what the forecasting model has learned and how it will behave in the scenarios that you are evaluating. Do not blindly use the results of the what-if analysis to make business decisions. For instance, forecasts might not be accurate for novel scenarios where there is no reference available to determine whether a forecast is good.
 *
 * The TimeSeriesSelector object defines the items that you want in the what-if analysis.
 */
export const createWhatIfAnalysis: (
  input: CreateWhatIfAnalysisRequest,
) => effect.Effect<
  CreateWhatIfAnalysisResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWhatIfAnalysisRequest,
  output: CreateWhatIfAnalysisResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Exports a forecast created by the CreateWhatIfForecast operation to your
 * Amazon Simple Storage Service (Amazon S3) bucket. The forecast file name will match the following conventions:
 *
 * `≈__`
 *
 * The component is in Java SimpleDateFormat
 * (yyyy-MM-ddTHH-mm-ssZ).
 *
 * You must specify a DataDestination object that includes an Identity and Access Management
 * (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see
 * aws-forecast-iam-roles.
 *
 * For more information, see howitworks-forecast.
 *
 * To get a list of all your what-if forecast export jobs, use the ListWhatIfForecastExports
 * operation.
 *
 * The `Status` of the forecast export job must be `ACTIVE` before
 * you can access the forecast in your Amazon S3 bucket. To get the status, use the DescribeWhatIfForecastExport operation.
 */
export const createWhatIfForecastExport: (
  input: CreateWhatIfForecastExportRequest,
) => effect.Effect<
  CreateWhatIfForecastExportResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWhatIfForecastExportRequest,
  output: CreateWhatIfForecastExportResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Explainability is only available for Forecasts and Predictors generated from an
 * AutoPredictor (CreateAutoPredictor)
 *
 * Creates an Amazon Forecast Explainability.
 *
 * Explainability helps you better understand how the attributes in your datasets impact
 * forecast. Amazon Forecast uses a metric called Impact scores to quantify the relative
 * impact of each attribute and determine whether they increase or decrease forecast
 * values.
 *
 * To enable Forecast Explainability, your predictor must include at least one of the
 * following: related time series, item metadata, or additional datasets like Holidays and
 * the Weather Index.
 *
 * CreateExplainability accepts either a Predictor ARN or Forecast ARN. To receive
 * aggregated Impact scores for all time series and time points in your datasets, provide a
 * Predictor ARN. To receive Impact scores for specific time series and time points,
 * provide a Forecast ARN.
 *
 * **CreateExplainability with a Predictor ARN**
 *
 * You can only have one Explainability resource per predictor. If you already
 * enabled `ExplainPredictor` in CreateAutoPredictor, that
 * predictor already has an Explainability resource.
 *
 * The following parameters are required when providing a Predictor ARN:
 *
 * - `ExplainabilityName` - A unique name for the Explainability.
 *
 * - `ResourceArn` - The Arn of the predictor.
 *
 * - `TimePointGranularity` - Must be set to “ALL”.
 *
 * - `TimeSeriesGranularity` - Must be set to “ALL”.
 *
 * Do not specify a value for the following parameters:
 *
 * - `DataSource` - Only valid when TimeSeriesGranularity is
 * “SPECIFIC”.
 *
 * - `Schema` - Only valid when TimeSeriesGranularity is
 * “SPECIFIC”.
 *
 * - `StartDateTime` - Only valid when TimePointGranularity is
 * “SPECIFIC”.
 *
 * - `EndDateTime` - Only valid when TimePointGranularity is
 * “SPECIFIC”.
 *
 * **CreateExplainability with a Forecast ARN**
 *
 * You can specify a maximum of 50 time series and 500 time points.
 *
 * The following parameters are required when providing a Predictor ARN:
 *
 * - `ExplainabilityName` - A unique name for the Explainability.
 *
 * - `ResourceArn` - The Arn of the forecast.
 *
 * - `TimePointGranularity` - Either “ALL” or “SPECIFIC”.
 *
 * - `TimeSeriesGranularity` - Either “ALL” or “SPECIFIC”.
 *
 * If you set TimeSeriesGranularity to “SPECIFIC”, you must also provide the
 * following:
 *
 * - `DataSource` - The S3 location of the CSV file specifying your time
 * series.
 *
 * - `Schema` - The Schema defines the attributes and attribute types
 * listed in the Data Source.
 *
 * If you set TimePointGranularity to “SPECIFIC”, you must also provide the
 * following:
 *
 * - `StartDateTime` - The first timestamp in the range of time
 * points.
 *
 * - `EndDateTime` - The last timestamp in the range of time
 * points.
 */
export const createExplainability: (
  input: CreateExplainabilityRequest,
) => effect.Effect<
  CreateExplainabilityResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExplainabilityRequest,
  output: CreateExplainabilityResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Exports an Explainability resource created by the CreateExplainability operation. Exported files are exported to an Amazon Simple Storage Service (Amazon
 * S3) bucket.
 *
 * You must specify a DataDestination object that includes an Amazon S3
 * bucket and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3
 * bucket. For more information, see aws-forecast-iam-roles.
 *
 * The `Status` of the export job must be `ACTIVE` before you
 * can access the export in your Amazon S3 bucket. To get the status, use the DescribeExplainabilityExport operation.
 */
export const createExplainabilityExport: (
  input: CreateExplainabilityExportRequest,
) => effect.Effect<
  CreateExplainabilityExportResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExplainabilityExportRequest,
  output: CreateExplainabilityExportResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an Amazon Forecast dataset. The information about the dataset that you provide helps
 * Forecast understand how to consume the data for model training. This includes the
 * following:
 *
 * -
 * `DataFrequency`
 * - How frequently your historical
 * time-series data is collected.
 *
 * -
 * `Domain`
 * and
 *
 * `DatasetType`
 * - Each dataset has an associated dataset
 * domain and a type within the domain. Amazon Forecast provides a list of predefined domains and
 * types within each domain. For each unique dataset domain and type within the domain,
 * Amazon Forecast requires your data to include a minimum set of predefined fields.
 *
 * -
 * `Schema`
 * - A schema specifies the fields in the dataset,
 * including the field name and data type.
 *
 * After creating a dataset, you import your training data into it and add the dataset to a
 * dataset group. You use the dataset group to create a predictor. For more information, see
 * Importing datasets.
 *
 * To get a list of all your datasets, use the ListDatasets operation.
 *
 * For example Forecast datasets, see the Amazon Forecast Sample GitHub
 * repository.
 *
 * The `Status` of a dataset must be `ACTIVE` before you can import
 * training data. Use the DescribeDataset operation to get
 * the status.
 */
export const createDataset: (
  input: CreateDatasetRequest,
) => effect.Effect<
  CreateDatasetResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Imports your training data to an Amazon Forecast dataset. You provide the location of your
 * training data in an Amazon Simple Storage Service (Amazon S3) bucket and the Amazon Resource Name (ARN) of the dataset
 * that you want to import the data to.
 *
 * You must specify a DataSource object that includes an
 * Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data, as Amazon Forecast makes a copy
 * of your data and processes it in an internal Amazon Web Services system. For more information, see Set up
 * permissions.
 *
 * The training data must be in CSV or Parquet format. The delimiter must be a comma (,).
 *
 * You can specify the path to a specific file, the S3 bucket, or to a folder in the S3
 * bucket. For the latter two cases, Amazon Forecast imports all files up to the limit of 10,000
 * files.
 *
 * Because dataset imports are not aggregated, your most recent dataset import is the one
 * that is used when training a predictor or generating a forecast. Make sure that your most
 * recent dataset import contains all of the data you want to model off of, and not just the new
 * data collected since the previous import.
 *
 * To get a list of all your dataset import jobs, filtered by specified criteria, use the
 * ListDatasetImportJobs operation.
 */
export const createDatasetImportJob: (
  input: CreateDatasetImportJobRequest,
) => effect.Effect<
  CreateDatasetImportJobResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetImportJobRequest,
  output: CreateDatasetImportJobResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a forecast for each item in the `TARGET_TIME_SERIES` dataset that was
 * used to train the predictor. This is known as inference. To retrieve the forecast for a single
 * item at low latency, use the operation. To
 * export the complete forecast into your Amazon Simple Storage Service (Amazon S3) bucket, use the CreateForecastExportJob operation.
 *
 * The range of the forecast is determined by the `ForecastHorizon` value, which
 * you specify in the CreatePredictor request. When you query a forecast, you
 * can request a specific date range within the forecast.
 *
 * To get a list of all your forecasts, use the ListForecasts
 * operation.
 *
 * The forecasts generated by Amazon Forecast are in the same time zone as the dataset that was
 * used to create the predictor.
 *
 * For more information, see howitworks-forecast.
 *
 * The `Status` of the forecast must be `ACTIVE` before you can query
 * or export the forecast. Use the DescribeForecast operation to get the
 * status.
 *
 * By default, a forecast includes predictions for every item (`item_id`) in the dataset group that was used to train the predictor.
 * However, you can use the `TimeSeriesSelector` object to generate a forecast on a subset of time series. Forecast creation is skipped for any time series that you specify that are not in the input dataset. The forecast export file will not contain these time series or their forecasted values.
 */
export const createForecast: (
  input: CreateForecastRequest,
) => effect.Effect<
  CreateForecastResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateForecastRequest,
  output: CreateForecastResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * A what-if forecast is a forecast that is created from a modified version of the baseline forecast. Each
 * what-if forecast incorporates either a replacement dataset or a set of transformations to the original dataset.
 */
export const createWhatIfForecast: (
  input: CreateWhatIfForecastRequest,
) => effect.Effect<
  CreateWhatIfForecastResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWhatIfForecastRequest,
  output: CreateWhatIfForecastResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an Amazon Forecast predictor.
 *
 * Amazon Forecast creates predictors with AutoPredictor, which involves applying the
 * optimal combination of algorithms to each time series in your datasets. You can use
 * CreateAutoPredictor to create new predictors or upgrade/retrain
 * existing predictors.
 *
 * **Creating new predictors**
 *
 * The following parameters are required when creating a new predictor:
 *
 * - `PredictorName` - A unique name for the predictor.
 *
 * - `DatasetGroupArn` - The ARN of the dataset group used to train the
 * predictor.
 *
 * - `ForecastFrequency` - The granularity of your forecasts (hourly,
 * daily, weekly, etc).
 *
 * - `ForecastHorizon` - The number of time-steps that the model
 * predicts. The forecast horizon is also called the prediction length.
 *
 * When creating a new predictor, do not specify a value for
 * `ReferencePredictorArn`.
 *
 * **Upgrading and retraining predictors**
 *
 * The following parameters are required when retraining or upgrading a predictor:
 *
 * - `PredictorName` - A unique name for the predictor.
 *
 * - `ReferencePredictorArn` - The ARN of the predictor to retrain or
 * upgrade.
 *
 * When upgrading or retraining a predictor, only specify values for the
 * `ReferencePredictorArn` and `PredictorName`.
 */
export const createAutoPredictor: (
  input: CreateAutoPredictorRequest,
) => effect.Effect<
  CreateAutoPredictorResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutoPredictorRequest,
  output: CreateAutoPredictorResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes a monitor resource. In addition to listing the properties provided in the CreateMonitor request, this operation lists the following properties:
 *
 * - `Baseline`
 *
 * - `CreationTime`
 *
 * - `LastEvaluationTime`
 *
 * - `LastEvaluationState`
 *
 * - `LastModificationTime`
 *
 * - `Message`
 *
 * - `Status`
 */
export const describeMonitor: (
  input: DescribeMonitorRequest,
) => effect.Effect<
  DescribeMonitorResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMonitorRequest,
  output: DescribeMonitorResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * This operation is only valid for legacy predictors created with CreatePredictor. If you
 * are not using a legacy predictor, use DescribeAutoPredictor.
 *
 * Describes a predictor created using the CreatePredictor
 * operation.
 *
 * In addition to listing the properties provided in the `CreatePredictor`
 * request, this operation lists the following properties:
 *
 * - `DatasetImportJobArns` - The dataset import jobs used to import training
 * data.
 *
 * - `AutoMLAlgorithmArns` - If AutoML is performed, the algorithms that were
 * evaluated.
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 *
 * - `Message` - If an error occurred, information about the error.
 */
export const describePredictor: (
  input: DescribePredictorRequest,
) => effect.Effect<
  DescribePredictorResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePredictorRequest,
  output: DescribePredictorResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * This operation creates a legacy predictor that does not include all the predictor
 * functionalities provided by Amazon Forecast. To create a predictor that is compatible with all
 * aspects of Forecast, use CreateAutoPredictor.
 *
 * Creates an Amazon Forecast predictor.
 *
 * In the request, provide a dataset group and either specify an algorithm or let Amazon Forecast
 * choose an algorithm for you using AutoML. If you specify an algorithm, you also can override
 * algorithm-specific hyperparameters.
 *
 * Amazon Forecast uses the algorithm to train a predictor using the latest version of the datasets
 * in the specified dataset group. You can then generate a forecast using the CreateForecast operation.
 *
 * To see the evaluation metrics, use the GetAccuracyMetrics operation.
 *
 * You can specify a featurization configuration to fill and aggregate the data fields in the
 * `TARGET_TIME_SERIES` dataset to improve model training. For more information, see
 * FeaturizationConfig.
 *
 * For RELATED_TIME_SERIES datasets, `CreatePredictor` verifies that the
 * `DataFrequency` specified when the dataset was created matches the
 * `ForecastFrequency`. TARGET_TIME_SERIES datasets don't have this restriction.
 * Amazon Forecast also verifies the delimiter and timestamp format. For more information, see howitworks-datasets-groups.
 *
 * By default, predictors are trained and evaluated at the 0.1 (P10), 0.5 (P50), and 0.9
 * (P90) quantiles. You can choose custom forecast types to train and evaluate your predictor by
 * setting the `ForecastTypes`.
 *
 * **AutoML**
 *
 * If you want Amazon Forecast to evaluate each algorithm and choose the one that minimizes the
 * `objective function`, set `PerformAutoML` to `true`. The
 * `objective function` is defined as the mean of the weighted losses over the
 * forecast types. By default, these are the p10, p50, and p90 quantile losses. For more
 * information, see EvaluationResult.
 *
 * When AutoML is enabled, the following properties are disallowed:
 *
 * - `AlgorithmArn`
 *
 * - `HPOConfig`
 *
 * - `PerformHPO`
 *
 * - `TrainingParameters`
 *
 * To get a list of all of your predictors, use the ListPredictors
 * operation.
 *
 * Before you can use the predictor to create a forecast, the `Status` of the
 * predictor must be `ACTIVE`, signifying that training has completed. To get the
 * status, use the DescribePredictor operation.
 */
export const createPredictor: (
  input: CreatePredictorRequest,
) => effect.Effect<
  CreatePredictorResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePredictorRequest,
  output: CreatePredictorResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Provides metrics on the accuracy of the models that were trained by the CreatePredictor operation. Use metrics to see how well the model performed and
 * to decide whether to use the predictor to generate a forecast. For more information, see
 * Predictor
 * Metrics.
 *
 * This operation generates metrics for each backtest window that was evaluated. The number
 * of backtest windows (`NumberOfBacktestWindows`) is specified using the EvaluationParameters object, which is optionally included in the
 * `CreatePredictor` request. If `NumberOfBacktestWindows` isn't
 * specified, the number defaults to one.
 *
 * The parameters of the `filling` method determine which items contribute to the
 * metrics. If you want all items to contribute, specify `zero`. If you want only
 * those items that have complete data in the range being evaluated to contribute, specify
 * `nan`. For more information, see FeaturizationMethod.
 *
 * Before you can get accuracy metrics, the `Status` of the predictor must be
 * `ACTIVE`, signifying that training has completed. To get the status, use the
 * DescribePredictor operation.
 */
export const getAccuracyMetrics: (
  input: GetAccuracyMetricsRequest,
) => effect.Effect<
  GetAccuracyMetricsResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccuracyMetricsRequest,
  output: GetAccuracyMetricsResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
