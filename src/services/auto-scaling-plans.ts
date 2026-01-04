import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Auto Scaling Plans",
  serviceShapeName: "AnyScaleScalingPlannerFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "autoscaling-plans" });
const ver = T.ServiceVersion("2018-01-06");
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
                        url: "https://autoscaling-plans-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          argv: [{ ref: "Region" }, "us-gov-east-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://autoscaling-plans.us-gov-east-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://autoscaling-plans.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://autoscaling-plans-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://autoscaling-plans.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://autoscaling-plans.{Region}.{PartitionResult#dnsSuffix}",
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
export const ScalingPlanNames = S.Array(S.String);
export const TagValues = S.Array(S.String);
export class TagFilter extends S.Class<TagFilter>("TagFilter")({
  Key: S.optional(S.String),
  Values: S.optional(TagValues),
}) {}
export const TagFilters = S.Array(TagFilter);
export class ApplicationSource extends S.Class<ApplicationSource>(
  "ApplicationSource",
)({
  CloudFormationStackARN: S.optional(S.String),
  TagFilters: S.optional(TagFilters),
}) {}
export const ApplicationSources = S.Array(ApplicationSource);
export class DeleteScalingPlanRequest extends S.Class<DeleteScalingPlanRequest>(
  "DeleteScalingPlanRequest",
)(
  { ScalingPlanName: S.String, ScalingPlanVersion: S.Number },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScalingPlanResponse extends S.Class<DeleteScalingPlanResponse>(
  "DeleteScalingPlanResponse",
)({}) {}
export class DescribeScalingPlanResourcesRequest extends S.Class<DescribeScalingPlanResourcesRequest>(
  "DescribeScalingPlanResourcesRequest",
)(
  {
    ScalingPlanName: S.String,
    ScalingPlanVersion: S.Number,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeScalingPlansRequest extends S.Class<DescribeScalingPlansRequest>(
  "DescribeScalingPlansRequest",
)(
  {
    ScalingPlanNames: S.optional(ScalingPlanNames),
    ScalingPlanVersion: S.optional(S.Number),
    ApplicationSources: S.optional(ApplicationSources),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetScalingPlanResourceForecastDataRequest extends S.Class<GetScalingPlanResourceForecastDataRequest>(
  "GetScalingPlanResourceForecastDataRequest",
)(
  {
    ScalingPlanName: S.String,
    ScalingPlanVersion: S.Number,
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    ForecastDataType: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PredefinedScalingMetricSpecification extends S.Class<PredefinedScalingMetricSpecification>(
  "PredefinedScalingMetricSpecification",
)({
  PredefinedScalingMetricType: S.String,
  ResourceLabel: S.optional(S.String),
}) {}
export class MetricDimension extends S.Class<MetricDimension>(
  "MetricDimension",
)({ Name: S.String, Value: S.String }) {}
export const MetricDimensions = S.Array(MetricDimension);
export class CustomizedScalingMetricSpecification extends S.Class<CustomizedScalingMetricSpecification>(
  "CustomizedScalingMetricSpecification",
)({
  MetricName: S.String,
  Namespace: S.String,
  Dimensions: S.optional(MetricDimensions),
  Statistic: S.String,
  Unit: S.optional(S.String),
}) {}
export class TargetTrackingConfiguration extends S.Class<TargetTrackingConfiguration>(
  "TargetTrackingConfiguration",
)({
  PredefinedScalingMetricSpecification: S.optional(
    PredefinedScalingMetricSpecification,
  ),
  CustomizedScalingMetricSpecification: S.optional(
    CustomizedScalingMetricSpecification,
  ),
  TargetValue: S.Number,
  DisableScaleIn: S.optional(S.Boolean),
  ScaleOutCooldown: S.optional(S.Number),
  ScaleInCooldown: S.optional(S.Number),
  EstimatedInstanceWarmup: S.optional(S.Number),
}) {}
export const TargetTrackingConfigurations = S.Array(
  TargetTrackingConfiguration,
);
export class PredefinedLoadMetricSpecification extends S.Class<PredefinedLoadMetricSpecification>(
  "PredefinedLoadMetricSpecification",
)({
  PredefinedLoadMetricType: S.String,
  ResourceLabel: S.optional(S.String),
}) {}
export class CustomizedLoadMetricSpecification extends S.Class<CustomizedLoadMetricSpecification>(
  "CustomizedLoadMetricSpecification",
)({
  MetricName: S.String,
  Namespace: S.String,
  Dimensions: S.optional(MetricDimensions),
  Statistic: S.String,
  Unit: S.optional(S.String),
}) {}
export class ScalingInstruction extends S.Class<ScalingInstruction>(
  "ScalingInstruction",
)({
  ServiceNamespace: S.String,
  ResourceId: S.String,
  ScalableDimension: S.String,
  MinCapacity: S.Number,
  MaxCapacity: S.Number,
  TargetTrackingConfigurations: TargetTrackingConfigurations,
  PredefinedLoadMetricSpecification: S.optional(
    PredefinedLoadMetricSpecification,
  ),
  CustomizedLoadMetricSpecification: S.optional(
    CustomizedLoadMetricSpecification,
  ),
  ScheduledActionBufferTime: S.optional(S.Number),
  PredictiveScalingMaxCapacityBehavior: S.optional(S.String),
  PredictiveScalingMaxCapacityBuffer: S.optional(S.Number),
  PredictiveScalingMode: S.optional(S.String),
  ScalingPolicyUpdateBehavior: S.optional(S.String),
  DisableDynamicScaling: S.optional(S.Boolean),
}) {}
export const ScalingInstructions = S.Array(ScalingInstruction);
export class UpdateScalingPlanRequest extends S.Class<UpdateScalingPlanRequest>(
  "UpdateScalingPlanRequest",
)(
  {
    ScalingPlanName: S.String,
    ScalingPlanVersion: S.Number,
    ApplicationSource: S.optional(ApplicationSource),
    ScalingInstructions: S.optional(ScalingInstructions),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateScalingPlanResponse extends S.Class<UpdateScalingPlanResponse>(
  "UpdateScalingPlanResponse",
)({}) {}
export class ScalingPlan extends S.Class<ScalingPlan>("ScalingPlan")({
  ScalingPlanName: S.String,
  ScalingPlanVersion: S.Number,
  ApplicationSource: ApplicationSource,
  ScalingInstructions: ScalingInstructions,
  StatusCode: S.String,
  StatusMessage: S.optional(S.String),
  StatusStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ScalingPlans = S.Array(ScalingPlan);
export class Datapoint extends S.Class<Datapoint>("Datapoint")({
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Value: S.optional(S.Number),
}) {}
export const Datapoints = S.Array(Datapoint);
export class DescribeScalingPlansResponse extends S.Class<DescribeScalingPlansResponse>(
  "DescribeScalingPlansResponse",
)({
  ScalingPlans: S.optional(ScalingPlans),
  NextToken: S.optional(S.String),
}) {}
export class GetScalingPlanResourceForecastDataResponse extends S.Class<GetScalingPlanResourceForecastDataResponse>(
  "GetScalingPlanResourceForecastDataResponse",
)({ Datapoints: Datapoints }) {}
export class ScalingPolicy extends S.Class<ScalingPolicy>("ScalingPolicy")({
  PolicyName: S.String,
  PolicyType: S.String,
  TargetTrackingConfiguration: S.optional(TargetTrackingConfiguration),
}) {}
export const ScalingPolicies = S.Array(ScalingPolicy);
export class ScalingPlanResource extends S.Class<ScalingPlanResource>(
  "ScalingPlanResource",
)({
  ScalingPlanName: S.String,
  ScalingPlanVersion: S.Number,
  ServiceNamespace: S.String,
  ResourceId: S.String,
  ScalableDimension: S.String,
  ScalingPolicies: S.optional(ScalingPolicies),
  ScalingStatusCode: S.String,
  ScalingStatusMessage: S.optional(S.String),
}) {}
export const ScalingPlanResources = S.Array(ScalingPlanResource);
export class CreateScalingPlanRequest extends S.Class<CreateScalingPlanRequest>(
  "CreateScalingPlanRequest",
)(
  {
    ScalingPlanName: S.String,
    ApplicationSource: ApplicationSource,
    ScalingInstructions: ScalingInstructions,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeScalingPlanResourcesResponse extends S.Class<DescribeScalingPlanResourcesResponse>(
  "DescribeScalingPlanResourcesResponse",
)({
  ScalingPlanResources: S.optional(ScalingPlanResources),
  NextToken: S.optional(S.String),
}) {}
export class CreateScalingPlanResponse extends S.Class<CreateScalingPlanResponse>(
  "CreateScalingPlanResponse",
)({ ScalingPlanVersion: S.Number }) {}

//# Errors
export class ConcurrentUpdateException extends S.TaggedError<ConcurrentUpdateException>()(
  "ConcurrentUpdateException",
  {},
  T.AwsQueryError({ code: "ConcurrentUpdateException", httpResponseCode: 500 }),
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  {},
  T.AwsQueryError({ code: "InternalServiceException", httpResponseCode: 500 }),
) {}
export class ObjectNotFoundException extends S.TaggedError<ObjectNotFoundException>()(
  "ObjectNotFoundException",
  {},
  T.AwsQueryError({ code: "ObjectNotFoundException", httpResponseCode: 400 }),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  {},
  T.AwsQueryError({ code: "InvalidNextTokenException", httpResponseCode: 400 }),
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceededException", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * Deletes the specified scaling plan.
 *
 * Deleting a scaling plan deletes the underlying ScalingInstruction for
 * all of the scalable resources that are covered by the plan.
 *
 * If the plan has launched resources or has scaling activities in progress, you must
 * delete those resources separately.
 */
export const deleteScalingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScalingPlanRequest,
  output: DeleteScalingPlanResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    ObjectNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves the forecast data for a scalable resource.
 *
 * Capacity forecasts are represented as predicted values, or data points, that are
 * calculated using historical data points from a specified CloudWatch load metric. Data points are
 * available for up to 56 days.
 */
export const getScalingPlanResourceForecastData =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetScalingPlanResourceForecastDataRequest,
    output: GetScalingPlanResourceForecastDataResponse,
    errors: [InternalServiceException, ValidationException],
  }));
/**
 * Updates the specified scaling plan.
 *
 * You cannot update a scaling plan if it is in the process of being created, updated, or
 * deleted.
 */
export const updateScalingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateScalingPlanRequest,
  output: UpdateScalingPlanResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    ObjectNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the scalable resources in the specified scaling plan.
 */
export const describeScalingPlanResources =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeScalingPlanResourcesRequest,
    output: DescribeScalingPlanResourcesResponse,
    errors: [
      ConcurrentUpdateException,
      InternalServiceException,
      InvalidNextTokenException,
      ValidationException,
    ],
  }));
/**
 * Describes one or more of your scaling plans.
 */
export const describeScalingPlans = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeScalingPlansRequest,
    output: DescribeScalingPlansResponse,
    errors: [
      ConcurrentUpdateException,
      InternalServiceException,
      InvalidNextTokenException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a scaling plan.
 */
export const createScalingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScalingPlanRequest,
  output: CreateScalingPlanResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    LimitExceededException,
    ValidationException,
  ],
}));
