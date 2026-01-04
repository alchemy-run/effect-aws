import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "SageMaker Metrics",
  serviceShapeName: "SageMakerMetricsService",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2022-09-30");
const proto = T.AwsProtocolsRestJson1();
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
                        url: "https://metrics.sagemaker-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://metrics-fips.sagemaker.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://metrics.sagemaker-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://metrics.sagemaker.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://metrics.sagemaker.{Region}.{PartitionResult#dnsSuffix}",
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

//# Schemas
export class MetricQuery extends S.Class<MetricQuery>("MetricQuery")({
  MetricName: S.String,
  ResourceArn: S.String,
  MetricStat: S.String,
  Period: S.String,
  XAxisType: S.String,
  Start: S.optional(S.Number),
  End: S.optional(S.Number),
}) {}
export const MetricQueryList = S.Array(MetricQuery);
export class RawMetricData extends S.Class<RawMetricData>("RawMetricData")({
  MetricName: S.String,
  Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Step: S.optional(S.Number),
  Value: S.Number,
}) {}
export const RawMetricDataList = S.Array(RawMetricData);
export class BatchGetMetricsRequest extends S.Class<BatchGetMetricsRequest>(
  "BatchGetMetricsRequest",
)(
  { MetricQueries: MetricQueryList },
  T.all(
    T.Http({ method: "POST", uri: "/BatchGetMetrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchPutMetricsRequest extends S.Class<BatchPutMetricsRequest>(
  "BatchPutMetricsRequest",
)(
  { TrialComponentName: S.String, MetricData: RawMetricDataList },
  T.all(
    T.Http({ method: "PUT", uri: "/BatchPutMetrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const XAxisValues = S.Array(S.Number);
export const MetricValues = S.Array(S.Number);
export class MetricQueryResult extends S.Class<MetricQueryResult>(
  "MetricQueryResult",
)({
  Status: S.String,
  Message: S.optional(S.String),
  XAxisValues: XAxisValues,
  MetricValues: MetricValues,
}) {}
export const MetricQueryResultList = S.Array(MetricQueryResult);
export class BatchPutMetricsError extends S.Class<BatchPutMetricsError>(
  "BatchPutMetricsError",
)({ Code: S.optional(S.String), MetricIndex: S.optional(S.Number) }) {}
export const BatchPutMetricsErrorList = S.Array(BatchPutMetricsError);
export class BatchGetMetricsResponse extends S.Class<BatchGetMetricsResponse>(
  "BatchGetMetricsResponse",
)({ MetricQueryResults: S.optional(MetricQueryResultList) }) {}
export class BatchPutMetricsResponse extends S.Class<BatchPutMetricsResponse>(
  "BatchPutMetricsResponse",
)({ Errors: S.optional(BatchPutMetricsErrorList) }) {}

//# Errors

//# Operations
/**
 * Used to retrieve training metrics from SageMaker.
 */
export const batchGetMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetMetricsRequest,
  output: BatchGetMetricsResponse,
  errors: [],
}));
/**
 * Used to ingest training metrics into SageMaker. These metrics can be visualized in SageMaker Studio.
 */
export const batchPutMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutMetricsRequest,
  output: BatchPutMetricsResponse,
  errors: [],
}));
