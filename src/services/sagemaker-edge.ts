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
  sdkId: "Sagemaker Edge",
  serviceShapeName: "AmazonSageMakerEdge",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2020-09-23");
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
              `https://edge.sagemaker-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://edge.sagemaker-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://edge.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://edge.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DeviceName = string;
export type DeviceFleetName = string;
export type Version = string;
export type Dimension = string;
export type Metric = string;
export type Value = number;
export type ModelName = string;
export type EntityName = string;
export type DeviceRegistration = string;
export type CacheTTLSeconds = string;
export type ErrorMessage = string;
export type S3Uri = string;
export type ChecksumString = string;

//# Schemas
export interface GetDeploymentsRequest {
  DeviceName: string;
  DeviceFleetName: string;
}
export const GetDeploymentsRequest = S.suspend(() =>
  S.Struct({ DeviceName: S.String, DeviceFleetName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetDeployments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeploymentsRequest",
}) as any as S.Schema<GetDeploymentsRequest>;
export interface GetDeviceRegistrationRequest {
  DeviceName: string;
  DeviceFleetName: string;
}
export const GetDeviceRegistrationRequest = S.suspend(() =>
  S.Struct({ DeviceName: S.String, DeviceFleetName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetDeviceRegistration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeviceRegistrationRequest",
}) as any as S.Schema<GetDeviceRegistrationRequest>;
export interface EdgeMetric {
  Dimension?: string;
  MetricName?: string;
  Value?: number;
  Timestamp?: Date;
}
export const EdgeMetric = S.suspend(() =>
  S.Struct({
    Dimension: S.optional(S.String),
    MetricName: S.optional(S.String),
    Value: S.optional(S.Number),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "EdgeMetric" }) as any as S.Schema<EdgeMetric>;
export type EdgeMetrics = EdgeMetric[];
export const EdgeMetrics = S.Array(EdgeMetric);
export interface Model {
  ModelName?: string;
  ModelVersion?: string;
  LatestSampleTime?: Date;
  LatestInference?: Date;
  ModelMetrics?: EdgeMetrics;
}
export const Model = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelVersion: S.optional(S.String),
    LatestSampleTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestInference: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ModelMetrics: S.optional(EdgeMetrics),
  }),
).annotations({ identifier: "Model" }) as any as S.Schema<Model>;
export type Models = Model[];
export const Models = S.Array(Model);
export interface GetDeviceRegistrationResult {
  DeviceRegistration?: string;
  CacheTTL?: string;
}
export const GetDeviceRegistrationResult = S.suspend(() =>
  S.Struct({
    DeviceRegistration: S.optional(S.String),
    CacheTTL: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDeviceRegistrationResult",
}) as any as S.Schema<GetDeviceRegistrationResult>;
export interface DeploymentModel {
  ModelHandle?: string;
  ModelName?: string;
  ModelVersion?: string;
  DesiredState?: string;
  State?: string;
  Status?: string;
  StatusReason?: string;
  RollbackFailureReason?: string;
}
export const DeploymentModel = S.suspend(() =>
  S.Struct({
    ModelHandle: S.optional(S.String),
    ModelName: S.optional(S.String),
    ModelVersion: S.optional(S.String),
    DesiredState: S.optional(S.String),
    State: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    RollbackFailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "DeploymentModel",
}) as any as S.Schema<DeploymentModel>;
export type DeploymentModels = DeploymentModel[];
export const DeploymentModels = S.Array(DeploymentModel);
export interface DeploymentResult {
  DeploymentName?: string;
  DeploymentStatus?: string;
  DeploymentStatusMessage?: string;
  DeploymentStartTime?: Date;
  DeploymentEndTime?: Date;
  DeploymentModels?: DeploymentModels;
}
export const DeploymentResult = S.suspend(() =>
  S.Struct({
    DeploymentName: S.optional(S.String),
    DeploymentStatus: S.optional(S.String),
    DeploymentStatusMessage: S.optional(S.String),
    DeploymentStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DeploymentEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DeploymentModels: S.optional(DeploymentModels),
  }),
).annotations({
  identifier: "DeploymentResult",
}) as any as S.Schema<DeploymentResult>;
export interface SendHeartbeatRequest {
  AgentMetrics?: EdgeMetrics;
  Models?: Models;
  AgentVersion: string;
  DeviceName: string;
  DeviceFleetName: string;
  DeploymentResult?: DeploymentResult;
}
export const SendHeartbeatRequest = S.suspend(() =>
  S.Struct({
    AgentMetrics: S.optional(EdgeMetrics),
    Models: S.optional(Models),
    AgentVersion: S.String,
    DeviceName: S.String,
    DeviceFleetName: S.String,
    DeploymentResult: S.optional(DeploymentResult),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/SendHeartbeat" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendHeartbeatRequest",
}) as any as S.Schema<SendHeartbeatRequest>;
export interface SendHeartbeatResponse {}
export const SendHeartbeatResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "SendHeartbeatResponse",
}) as any as S.Schema<SendHeartbeatResponse>;
export interface Checksum {
  Type?: string;
  Sum?: string;
}
export const Checksum = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Sum: S.optional(S.String) }),
).annotations({ identifier: "Checksum" }) as any as S.Schema<Checksum>;
export interface Definition {
  ModelHandle?: string;
  S3Url?: string;
  Checksum?: Checksum;
  State?: string;
}
export const Definition = S.suspend(() =>
  S.Struct({
    ModelHandle: S.optional(S.String),
    S3Url: S.optional(S.String),
    Checksum: S.optional(Checksum),
    State: S.optional(S.String),
  }),
).annotations({ identifier: "Definition" }) as any as S.Schema<Definition>;
export type Definitions = Definition[];
export const Definitions = S.Array(Definition);
export interface EdgeDeployment {
  DeploymentName?: string;
  Type?: string;
  FailureHandlingPolicy?: string;
  Definitions?: Definitions;
}
export const EdgeDeployment = S.suspend(() =>
  S.Struct({
    DeploymentName: S.optional(S.String),
    Type: S.optional(S.String),
    FailureHandlingPolicy: S.optional(S.String),
    Definitions: S.optional(Definitions),
  }),
).annotations({
  identifier: "EdgeDeployment",
}) as any as S.Schema<EdgeDeployment>;
export type EdgeDeployments = EdgeDeployment[];
export const EdgeDeployments = S.Array(EdgeDeployment);
export interface GetDeploymentsResult {
  Deployments?: EdgeDeployments;
}
export const GetDeploymentsResult = S.suspend(() =>
  S.Struct({ Deployments: S.optional(EdgeDeployments) }),
).annotations({
  identifier: "GetDeploymentsResult",
}) as any as S.Schema<GetDeploymentsResult>;

//# Errors
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Use to check if a device is registered with SageMaker Edge Manager.
 */
export const getDeviceRegistration: (
  input: GetDeviceRegistrationRequest,
) => Effect.Effect<
  GetDeviceRegistrationResult,
  InternalServiceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceRegistrationRequest,
  output: GetDeviceRegistrationResult,
  errors: [InternalServiceException],
}));
/**
 * Use to get the current status of devices registered on SageMaker Edge Manager.
 */
export const sendHeartbeat: (
  input: SendHeartbeatRequest,
) => Effect.Effect<
  SendHeartbeatResponse,
  InternalServiceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendHeartbeatRequest,
  output: SendHeartbeatResponse,
  errors: [InternalServiceException],
}));
/**
 * Use to get the active deployments from a device.
 */
export const getDeployments: (
  input: GetDeploymentsRequest,
) => Effect.Effect<
  GetDeploymentsResult,
  InternalServiceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentsRequest,
  output: GetDeploymentsResult,
  errors: [InternalServiceException],
}));
