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
  sdkId: "Auto Scaling Plans",
  serviceShapeName: "AnyScaleScalingPlannerFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "autoscaling-plans" });
const ver = T.ServiceVersion("2018-01-06");
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
              `https://autoscaling-plans-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (Region === "us-gov-east-1") {
              return e("https://autoscaling-plans.us-gov-east-1.amazonaws.com");
            }
            if (Region === "us-gov-west-1") {
              return e("https://autoscaling-plans.us-gov-west-1.amazonaws.com");
            }
            return e(
              `https://autoscaling-plans-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://autoscaling-plans.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://autoscaling-plans.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ScalingPlanName = string;
export type ScalingPlanVersion = number;
export type MaxResults = number;
export type NextToken = string;
export type XmlString = string;
export type ResourceIdMaxLen1600 = string;
export type ResourceCapacity = number;
export type ScheduledActionBufferTime = number;
export type ErrorMessage = string;
export type XmlStringMaxLen128 = string;
export type XmlStringMaxLen256 = string;
export type MetricScale = number;
export type Cooldown = number;
export type ResourceLabel = string;
export type MetricName = string;
export type MetricNamespace = string;
export type MetricUnit = string;
export type MetricDimensionName = string;
export type MetricDimensionValue = string;
export type PolicyName = string;

//# Schemas
export type ScalingPlanNames = string[];
export const ScalingPlanNames = S.Array(S.String);
export type TagValues = string[];
export const TagValues = S.Array(S.String);
export interface TagFilter {
  Key?: string;
  Values?: TagValues;
}
export const TagFilter = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Values: S.optional(TagValues) }),
).annotations({ identifier: "TagFilter" }) as any as S.Schema<TagFilter>;
export type TagFilters = TagFilter[];
export const TagFilters = S.Array(TagFilter);
export interface ApplicationSource {
  CloudFormationStackARN?: string;
  TagFilters?: TagFilters;
}
export const ApplicationSource = S.suspend(() =>
  S.Struct({
    CloudFormationStackARN: S.optional(S.String),
    TagFilters: S.optional(TagFilters),
  }),
).annotations({
  identifier: "ApplicationSource",
}) as any as S.Schema<ApplicationSource>;
export type ApplicationSources = ApplicationSource[];
export const ApplicationSources = S.Array(ApplicationSource);
export interface DeleteScalingPlanRequest {
  ScalingPlanName: string;
  ScalingPlanVersion: number;
}
export const DeleteScalingPlanRequest = S.suspend(() =>
  S.Struct({ ScalingPlanName: S.String, ScalingPlanVersion: S.Number }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteScalingPlanRequest",
}) as any as S.Schema<DeleteScalingPlanRequest>;
export interface DeleteScalingPlanResponse {}
export const DeleteScalingPlanResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteScalingPlanResponse",
}) as any as S.Schema<DeleteScalingPlanResponse>;
export interface DescribeScalingPlanResourcesRequest {
  ScalingPlanName: string;
  ScalingPlanVersion: number;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeScalingPlanResourcesRequest = S.suspend(() =>
  S.Struct({
    ScalingPlanName: S.String,
    ScalingPlanVersion: S.Number,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeScalingPlanResourcesRequest",
}) as any as S.Schema<DescribeScalingPlanResourcesRequest>;
export interface DescribeScalingPlansRequest {
  ScalingPlanNames?: ScalingPlanNames;
  ScalingPlanVersion?: number;
  ApplicationSources?: ApplicationSources;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeScalingPlansRequest = S.suspend(() =>
  S.Struct({
    ScalingPlanNames: S.optional(ScalingPlanNames),
    ScalingPlanVersion: S.optional(S.Number),
    ApplicationSources: S.optional(ApplicationSources),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeScalingPlansRequest",
}) as any as S.Schema<DescribeScalingPlansRequest>;
export interface GetScalingPlanResourceForecastDataRequest {
  ScalingPlanName: string;
  ScalingPlanVersion: number;
  ServiceNamespace: string;
  ResourceId: string;
  ScalableDimension: string;
  ForecastDataType: string;
  StartTime: Date;
  EndTime: Date;
}
export const GetScalingPlanResourceForecastDataRequest = S.suspend(() =>
  S.Struct({
    ScalingPlanName: S.String,
    ScalingPlanVersion: S.Number,
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    ForecastDataType: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetScalingPlanResourceForecastDataRequest",
}) as any as S.Schema<GetScalingPlanResourceForecastDataRequest>;
export interface PredefinedScalingMetricSpecification {
  PredefinedScalingMetricType: string;
  ResourceLabel?: string;
}
export const PredefinedScalingMetricSpecification = S.suspend(() =>
  S.Struct({
    PredefinedScalingMetricType: S.String,
    ResourceLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "PredefinedScalingMetricSpecification",
}) as any as S.Schema<PredefinedScalingMetricSpecification>;
export interface MetricDimension {
  Name: string;
  Value: string;
}
export const MetricDimension = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "MetricDimension",
}) as any as S.Schema<MetricDimension>;
export type MetricDimensions = MetricDimension[];
export const MetricDimensions = S.Array(MetricDimension);
export interface CustomizedScalingMetricSpecification {
  MetricName: string;
  Namespace: string;
  Dimensions?: MetricDimensions;
  Statistic: string;
  Unit?: string;
}
export const CustomizedScalingMetricSpecification = S.suspend(() =>
  S.Struct({
    MetricName: S.String,
    Namespace: S.String,
    Dimensions: S.optional(MetricDimensions),
    Statistic: S.String,
    Unit: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomizedScalingMetricSpecification",
}) as any as S.Schema<CustomizedScalingMetricSpecification>;
export interface TargetTrackingConfiguration {
  PredefinedScalingMetricSpecification?: PredefinedScalingMetricSpecification;
  CustomizedScalingMetricSpecification?: CustomizedScalingMetricSpecification;
  TargetValue: number;
  DisableScaleIn?: boolean;
  ScaleOutCooldown?: number;
  ScaleInCooldown?: number;
  EstimatedInstanceWarmup?: number;
}
export const TargetTrackingConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "TargetTrackingConfiguration",
}) as any as S.Schema<TargetTrackingConfiguration>;
export type TargetTrackingConfigurations = TargetTrackingConfiguration[];
export const TargetTrackingConfigurations = S.Array(
  TargetTrackingConfiguration,
);
export interface PredefinedLoadMetricSpecification {
  PredefinedLoadMetricType: string;
  ResourceLabel?: string;
}
export const PredefinedLoadMetricSpecification = S.suspend(() =>
  S.Struct({
    PredefinedLoadMetricType: S.String,
    ResourceLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "PredefinedLoadMetricSpecification",
}) as any as S.Schema<PredefinedLoadMetricSpecification>;
export interface CustomizedLoadMetricSpecification {
  MetricName: string;
  Namespace: string;
  Dimensions?: MetricDimensions;
  Statistic: string;
  Unit?: string;
}
export const CustomizedLoadMetricSpecification = S.suspend(() =>
  S.Struct({
    MetricName: S.String,
    Namespace: S.String,
    Dimensions: S.optional(MetricDimensions),
    Statistic: S.String,
    Unit: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomizedLoadMetricSpecification",
}) as any as S.Schema<CustomizedLoadMetricSpecification>;
export interface ScalingInstruction {
  ServiceNamespace: string;
  ResourceId: string;
  ScalableDimension: string;
  MinCapacity: number;
  MaxCapacity: number;
  TargetTrackingConfigurations: TargetTrackingConfigurations;
  PredefinedLoadMetricSpecification?: PredefinedLoadMetricSpecification;
  CustomizedLoadMetricSpecification?: CustomizedLoadMetricSpecification;
  ScheduledActionBufferTime?: number;
  PredictiveScalingMaxCapacityBehavior?: string;
  PredictiveScalingMaxCapacityBuffer?: number;
  PredictiveScalingMode?: string;
  ScalingPolicyUpdateBehavior?: string;
  DisableDynamicScaling?: boolean;
}
export const ScalingInstruction = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ScalingInstruction",
}) as any as S.Schema<ScalingInstruction>;
export type ScalingInstructions = ScalingInstruction[];
export const ScalingInstructions = S.Array(ScalingInstruction);
export interface UpdateScalingPlanRequest {
  ScalingPlanName: string;
  ScalingPlanVersion: number;
  ApplicationSource?: ApplicationSource;
  ScalingInstructions?: ScalingInstructions;
}
export const UpdateScalingPlanRequest = S.suspend(() =>
  S.Struct({
    ScalingPlanName: S.String,
    ScalingPlanVersion: S.Number,
    ApplicationSource: S.optional(ApplicationSource),
    ScalingInstructions: S.optional(ScalingInstructions),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateScalingPlanRequest",
}) as any as S.Schema<UpdateScalingPlanRequest>;
export interface UpdateScalingPlanResponse {}
export const UpdateScalingPlanResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateScalingPlanResponse",
}) as any as S.Schema<UpdateScalingPlanResponse>;
export interface ScalingPlan {
  ScalingPlanName: string;
  ScalingPlanVersion: number;
  ApplicationSource: ApplicationSource;
  ScalingInstructions: ScalingInstructions;
  StatusCode: string;
  StatusMessage?: string;
  StatusStartTime?: Date;
  CreationTime?: Date;
}
export const ScalingPlan = S.suspend(() =>
  S.Struct({
    ScalingPlanName: S.String,
    ScalingPlanVersion: S.Number,
    ApplicationSource: ApplicationSource,
    ScalingInstructions: ScalingInstructions,
    StatusCode: S.String,
    StatusMessage: S.optional(S.String),
    StatusStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "ScalingPlan" }) as any as S.Schema<ScalingPlan>;
export type ScalingPlans = ScalingPlan[];
export const ScalingPlans = S.Array(ScalingPlan);
export interface Datapoint {
  Timestamp?: Date;
  Value?: number;
}
export const Datapoint = S.suspend(() =>
  S.Struct({
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Value: S.optional(S.Number),
  }),
).annotations({ identifier: "Datapoint" }) as any as S.Schema<Datapoint>;
export type Datapoints = Datapoint[];
export const Datapoints = S.Array(Datapoint);
export interface DescribeScalingPlansResponse {
  ScalingPlans?: ScalingPlans;
  NextToken?: string;
}
export const DescribeScalingPlansResponse = S.suspend(() =>
  S.Struct({
    ScalingPlans: S.optional(ScalingPlans),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeScalingPlansResponse",
}) as any as S.Schema<DescribeScalingPlansResponse>;
export interface GetScalingPlanResourceForecastDataResponse {
  Datapoints: Datapoints;
}
export const GetScalingPlanResourceForecastDataResponse = S.suspend(() =>
  S.Struct({ Datapoints: Datapoints }),
).annotations({
  identifier: "GetScalingPlanResourceForecastDataResponse",
}) as any as S.Schema<GetScalingPlanResourceForecastDataResponse>;
export interface ScalingPolicy {
  PolicyName: string;
  PolicyType: string;
  TargetTrackingConfiguration?: TargetTrackingConfiguration;
}
export const ScalingPolicy = S.suspend(() =>
  S.Struct({
    PolicyName: S.String,
    PolicyType: S.String,
    TargetTrackingConfiguration: S.optional(TargetTrackingConfiguration),
  }),
).annotations({
  identifier: "ScalingPolicy",
}) as any as S.Schema<ScalingPolicy>;
export type ScalingPolicies = ScalingPolicy[];
export const ScalingPolicies = S.Array(ScalingPolicy);
export interface ScalingPlanResource {
  ScalingPlanName: string;
  ScalingPlanVersion: number;
  ServiceNamespace: string;
  ResourceId: string;
  ScalableDimension: string;
  ScalingPolicies?: ScalingPolicies;
  ScalingStatusCode: string;
  ScalingStatusMessage?: string;
}
export const ScalingPlanResource = S.suspend(() =>
  S.Struct({
    ScalingPlanName: S.String,
    ScalingPlanVersion: S.Number,
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    ScalingPolicies: S.optional(ScalingPolicies),
    ScalingStatusCode: S.String,
    ScalingStatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ScalingPlanResource",
}) as any as S.Schema<ScalingPlanResource>;
export type ScalingPlanResources = ScalingPlanResource[];
export const ScalingPlanResources = S.Array(ScalingPlanResource);
export interface CreateScalingPlanRequest {
  ScalingPlanName: string;
  ApplicationSource: ApplicationSource;
  ScalingInstructions: ScalingInstructions;
}
export const CreateScalingPlanRequest = S.suspend(() =>
  S.Struct({
    ScalingPlanName: S.String,
    ApplicationSource: ApplicationSource,
    ScalingInstructions: ScalingInstructions,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateScalingPlanRequest",
}) as any as S.Schema<CreateScalingPlanRequest>;
export interface DescribeScalingPlanResourcesResponse {
  ScalingPlanResources?: ScalingPlanResources;
  NextToken?: string;
}
export const DescribeScalingPlanResourcesResponse = S.suspend(() =>
  S.Struct({
    ScalingPlanResources: S.optional(ScalingPlanResources),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeScalingPlanResourcesResponse",
}) as any as S.Schema<DescribeScalingPlanResourcesResponse>;
export interface CreateScalingPlanResponse {
  ScalingPlanVersion: number;
}
export const CreateScalingPlanResponse = S.suspend(() =>
  S.Struct({ ScalingPlanVersion: S.Number }),
).annotations({
  identifier: "CreateScalingPlanResponse",
}) as any as S.Schema<CreateScalingPlanResponse>;

//# Errors
export class ConcurrentUpdateException extends S.TaggedError<ConcurrentUpdateException>()(
  "ConcurrentUpdateException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConcurrentUpdateException", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServiceException", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class ObjectNotFoundException extends S.TaggedError<ObjectNotFoundException>()(
  "ObjectNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ObjectNotFoundException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidNextTokenException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceededException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Retrieves the forecast data for a scalable resource.
 *
 * Capacity forecasts are represented as predicted values, or data points, that are
 * calculated using historical data points from a specified CloudWatch load metric. Data points are
 * available for up to 56 days.
 */
export const getScalingPlanResourceForecastData: (
  input: GetScalingPlanResourceForecastDataRequest,
) => Effect.Effect<
  GetScalingPlanResourceForecastDataResponse,
  InternalServiceException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateScalingPlan: (
  input: UpdateScalingPlanRequest,
) => Effect.Effect<
  UpdateScalingPlanResponse,
  | ConcurrentUpdateException
  | InternalServiceException
  | ObjectNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeScalingPlanResources: (
  input: DescribeScalingPlanResourcesRequest,
) => Effect.Effect<
  DescribeScalingPlanResourcesResponse,
  | ConcurrentUpdateException
  | InternalServiceException
  | InvalidNextTokenException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specified scaling plan.
 *
 * Deleting a scaling plan deletes the underlying ScalingInstruction for
 * all of the scalable resources that are covered by the plan.
 *
 * If the plan has launched resources or has scaling activities in progress, you must
 * delete those resources separately.
 */
export const deleteScalingPlan: (
  input: DeleteScalingPlanRequest,
) => Effect.Effect<
  DeleteScalingPlanResponse,
  | ConcurrentUpdateException
  | InternalServiceException
  | ObjectNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Describes one or more of your scaling plans.
 */
export const describeScalingPlans: (
  input: DescribeScalingPlansRequest,
) => Effect.Effect<
  DescribeScalingPlansResponse,
  | ConcurrentUpdateException
  | InternalServiceException
  | InvalidNextTokenException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeScalingPlansRequest,
  output: DescribeScalingPlansResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    InvalidNextTokenException,
    ValidationException,
  ],
}));
/**
 * Creates a scaling plan.
 */
export const createScalingPlan: (
  input: CreateScalingPlanRequest,
) => Effect.Effect<
  CreateScalingPlanResponse,
  | ConcurrentUpdateException
  | InternalServiceException
  | LimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScalingPlanRequest,
  output: CreateScalingPlanResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    LimitExceededException,
    ValidationException,
  ],
}));
