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
  sdkId: "forecastquery",
  serviceShapeName: "AmazonForecastRuntime",
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
              `https://forecastquery-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://forecastquery-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://forecastquery.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://forecastquery.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type NextToken = string;
export type LongArn = string;
export type AttributeName = string;
export type AttributeValue = string;
export type Statistic = string;
export type ErrorMessage = string;

//# Schemas
export type Filters = { [key: string]: string | undefined };
export const Filters = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface QueryWhatIfForecastRequest {
  WhatIfForecastArn: string;
  StartDate?: string;
  EndDate?: string;
  Filters: { [key: string]: string | undefined };
  NextToken?: string;
}
export const QueryWhatIfForecastRequest = S.suspend(() =>
  S.Struct({
    WhatIfForecastArn: S.String,
    StartDate: S.optional(S.String),
    EndDate: S.optional(S.String),
    Filters: Filters,
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "QueryWhatIfForecastRequest",
}) as any as S.Schema<QueryWhatIfForecastRequest>;
export interface QueryForecastRequest {
  ForecastArn: string;
  StartDate?: string;
  EndDate?: string;
  Filters: { [key: string]: string | undefined };
  NextToken?: string;
}
export const QueryForecastRequest = S.suspend(() =>
  S.Struct({
    ForecastArn: S.String,
    StartDate: S.optional(S.String),
    EndDate: S.optional(S.String),
    Filters: Filters,
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "QueryForecastRequest",
}) as any as S.Schema<QueryForecastRequest>;
export interface DataPoint {
  Timestamp?: string;
  Value?: number;
}
export const DataPoint = S.suspend(() =>
  S.Struct({ Timestamp: S.optional(S.String), Value: S.optional(S.Number) }),
).annotations({ identifier: "DataPoint" }) as any as S.Schema<DataPoint>;
export type TimeSeries = DataPoint[];
export const TimeSeries = S.Array(DataPoint);
export type Predictions = { [key: string]: DataPoint[] | undefined };
export const Predictions = S.Record({
  key: S.String,
  value: S.UndefinedOr(TimeSeries),
});
export interface Forecast {
  Predictions?: { [key: string]: DataPoint[] | undefined };
}
export const Forecast = S.suspend(() =>
  S.Struct({ Predictions: S.optional(Predictions) }),
).annotations({ identifier: "Forecast" }) as any as S.Schema<Forecast>;
export interface QueryForecastResponse {
  Forecast?: Forecast;
}
export const QueryForecastResponse = S.suspend(() =>
  S.Struct({ Forecast: S.optional(Forecast) }),
).annotations({
  identifier: "QueryForecastResponse",
}) as any as S.Schema<QueryForecastResponse>;
export interface QueryWhatIfForecastResponse {
  Forecast?: Forecast;
}
export const QueryWhatIfForecastResponse = S.suspend(() =>
  S.Struct({ Forecast: S.optional(Forecast) }),
).annotations({
  identifier: "QueryWhatIfForecastResponse",
}) as any as S.Schema<QueryWhatIfForecastResponse>;

//# Errors
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Retrieves a forecast for a single item, filtered by the supplied criteria.
 *
 * The criteria is a key-value pair. The key is either `item_id` (or the
 * equivalent non-timestamp, non-target field) from the `TARGET_TIME_SERIES` dataset,
 * or one of the forecast dimensions specified as part of the `FeaturizationConfig`
 * object.
 *
 * By default, `QueryForecast` returns the complete date range for the filtered
 * forecast. You can request a specific date range.
 *
 * To get the full forecast, use the CreateForecastExportJob operation.
 *
 * The forecasts generated by Amazon Forecast are in the same timezone as the dataset that was
 * used to create the predictor.
 */
export const queryForecast: (
  input: QueryForecastRequest,
) => effect.Effect<
  QueryForecastResponse,
  | InvalidInputException
  | InvalidNextTokenException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: QueryForecastRequest,
  output: QueryForecastResponse,
  errors: [
    InvalidInputException,
    InvalidNextTokenException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves a what-if forecast.
 */
export const queryWhatIfForecast: (
  input: QueryWhatIfForecastRequest,
) => effect.Effect<
  QueryWhatIfForecastResponse,
  | InvalidInputException
  | InvalidNextTokenException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: QueryWhatIfForecastRequest,
  output: QueryWhatIfForecastResponse,
  errors: [
    InvalidInputException,
    InvalidNextTokenException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
