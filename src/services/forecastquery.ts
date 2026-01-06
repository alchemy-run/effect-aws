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
  sdkId: "forecastquery",
  serviceShapeName: "AmazonForecastRuntime",
});
const auth = T.AwsAuthSigv4({ name: "forecast" });
const ver = T.ServiceVersion("2018-06-26");
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
                        url: "https://forecastquery-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://forecastquery-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://forecastquery.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://forecastquery.{Region}.{PartitionResult#dnsSuffix}",
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
export type Arn = string;
export type DateTime = string;
export type NextToken = string;
export type LongArn = string;
export type AttributeName = string;
export type AttributeValue = string;
export type Statistic = string;
export type Timestamp = string;
export type Double = number;
export type ErrorMessage = string;

//# Schemas
export type Filters = { [key: string]: string };
export const Filters = S.Record({ key: S.String, value: S.String });
export interface QueryWhatIfForecastRequest {
  WhatIfForecastArn: string;
  StartDate?: string;
  EndDate?: string;
  Filters: Filters;
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
  Filters: Filters;
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
export type Predictions = { [key: string]: TimeSeries };
export const Predictions = S.Record({ key: S.String, value: TimeSeries });
export interface Forecast {
  Predictions?: Predictions;
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
) => Effect.Effect<
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
) => Effect.Effect<
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
