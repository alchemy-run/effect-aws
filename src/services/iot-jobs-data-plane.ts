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
  sdkId: "IoT Jobs Data Plane",
  serviceShapeName: "IotLaserThingJobManagerExternalService",
});
const auth = T.AwsAuthSigv4({ name: "iot-jobs-data" });
const ver = T.ServiceVersion("2017-09-29");
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
              `https://data.jobs.iot-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://data.jobs.iot-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://data.jobs.iot.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://data.jobs.iot.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DescribeJobExecutionJobId = string;
export type ThingName = string;
export type IncludeJobDocument = boolean;
export type ExecutionNumber = number;
export type TargetArn = string;
export type CommandArn = string;
export type CommandExecutionTimeoutInSeconds = number;
export type ClientRequestTokenV2 = string;
export type StepTimeoutInMinutes = number;
export type JobId = string;
export type ExpectedVersion = number;
export type IncludeExecutionState = boolean;
export type CommandParameterName = string;
export type DetailsKey = string;
export type DetailsValue = string;
export type JobDocument = string;
export type StringParameterValue = string;
export type BooleanParameterValue = boolean;
export type IntegerParameterValue = number;
export type LongParameterValue = number;
export type DoubleParameterValue = number;
export type BinaryParameterValue = Uint8Array;
export type UnsignedLongParameterValue = string;
export type QueuedAt = number;
export type StartedAt = number;
export type LastUpdatedAt = number;
export type ApproximateSecondsBeforeTimedOut = number;
export type VersionNumber = number;
export type errorMessage = string;
export type CommandExecutionId = string;
export type resourceId = string;
export type BinaryBlob = Uint8Array;

//# Schemas
export type JobExecutionStatus =
  | "QUEUED"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "TIMED_OUT"
  | "REJECTED"
  | "REMOVED"
  | "CANCELED";
export const JobExecutionStatus = S.Literal(
  "QUEUED",
  "IN_PROGRESS",
  "SUCCEEDED",
  "FAILED",
  "TIMED_OUT",
  "REJECTED",
  "REMOVED",
  "CANCELED",
);
export interface DescribeJobExecutionRequest {
  jobId: string;
  thingName: string;
  includeJobDocument?: boolean;
  executionNumber?: number;
}
export const DescribeJobExecutionRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    includeJobDocument: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeJobDocument"),
    ),
    executionNumber: S.optional(S.Number).pipe(T.HttpQuery("executionNumber")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/things/{thingName}/jobs/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobExecutionRequest",
}) as any as S.Schema<DescribeJobExecutionRequest>;
export interface GetPendingJobExecutionsRequest {
  thingName: string;
}
export const GetPendingJobExecutionsRequest = S.suspend(() =>
  S.Struct({ thingName: S.String.pipe(T.HttpLabel("thingName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/things/{thingName}/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPendingJobExecutionsRequest",
}) as any as S.Schema<GetPendingJobExecutionsRequest>;
export type DetailsMap = { [key: string]: string };
export const DetailsMap = S.Record({ key: S.String, value: S.String });
export interface UpdateJobExecutionRequest {
  jobId: string;
  thingName: string;
  status: JobExecutionStatus;
  statusDetails?: { [key: string]: string };
  stepTimeoutInMinutes?: number;
  expectedVersion?: number;
  includeJobExecutionState?: boolean;
  includeJobDocument?: boolean;
  executionNumber?: number;
}
export const UpdateJobExecutionRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    status: JobExecutionStatus,
    statusDetails: S.optional(DetailsMap),
    stepTimeoutInMinutes: S.optional(S.Number),
    expectedVersion: S.optional(S.Number),
    includeJobExecutionState: S.optional(S.Boolean),
    includeJobDocument: S.optional(S.Boolean),
    executionNumber: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/things/{thingName}/jobs/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateJobExecutionRequest",
}) as any as S.Schema<UpdateJobExecutionRequest>;
export interface StartNextPendingJobExecutionRequest {
  thingName: string;
  statusDetails?: { [key: string]: string };
  stepTimeoutInMinutes?: number;
}
export const StartNextPendingJobExecutionRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    statusDetails: S.optional(DetailsMap),
    stepTimeoutInMinutes: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/things/{thingName}/jobs/$next" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartNextPendingJobExecutionRequest",
}) as any as S.Schema<StartNextPendingJobExecutionRequest>;
export interface CommandParameterValue {
  S?: string;
  B?: boolean;
  I?: number;
  L?: number;
  D?: number;
  BIN?: Uint8Array;
  UL?: string;
}
export const CommandParameterValue = S.suspend(() =>
  S.Struct({
    S: S.optional(S.String),
    B: S.optional(S.Boolean),
    I: S.optional(S.Number),
    L: S.optional(S.Number),
    D: S.optional(S.Number),
    BIN: S.optional(T.Blob),
    UL: S.optional(S.String),
  }),
).annotations({
  identifier: "CommandParameterValue",
}) as any as S.Schema<CommandParameterValue>;
export interface JobExecution {
  jobId?: string;
  thingName?: string;
  status?: JobExecutionStatus;
  statusDetails?: { [key: string]: string };
  queuedAt?: number;
  startedAt?: number;
  lastUpdatedAt?: number;
  approximateSecondsBeforeTimedOut?: number;
  versionNumber?: number;
  executionNumber?: number;
  jobDocument?: string;
}
export const JobExecution = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    thingName: S.optional(S.String),
    status: S.optional(JobExecutionStatus),
    statusDetails: S.optional(DetailsMap),
    queuedAt: S.optional(S.Number),
    startedAt: S.optional(S.Number),
    lastUpdatedAt: S.optional(S.Number),
    approximateSecondsBeforeTimedOut: S.optional(S.Number),
    versionNumber: S.optional(S.Number),
    executionNumber: S.optional(S.Number),
    jobDocument: S.optional(S.String),
  }),
).annotations({ identifier: "JobExecution" }) as any as S.Schema<JobExecution>;
export interface JobExecutionSummary {
  jobId?: string;
  queuedAt?: number;
  startedAt?: number;
  lastUpdatedAt?: number;
  versionNumber?: number;
  executionNumber?: number;
}
export const JobExecutionSummary = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    queuedAt: S.optional(S.Number),
    startedAt: S.optional(S.Number),
    lastUpdatedAt: S.optional(S.Number),
    versionNumber: S.optional(S.Number),
    executionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "JobExecutionSummary",
}) as any as S.Schema<JobExecutionSummary>;
export type JobExecutionSummaryList = JobExecutionSummary[];
export const JobExecutionSummaryList = S.Array(JobExecutionSummary);
export type CommandExecutionParameterMap = {
  [key: string]: CommandParameterValue;
};
export const CommandExecutionParameterMap = S.Record({
  key: S.String,
  value: CommandParameterValue,
});
export interface JobExecutionState {
  status?: JobExecutionStatus;
  statusDetails?: { [key: string]: string };
  versionNumber?: number;
}
export const JobExecutionState = S.suspend(() =>
  S.Struct({
    status: S.optional(JobExecutionStatus),
    statusDetails: S.optional(DetailsMap),
    versionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "JobExecutionState",
}) as any as S.Schema<JobExecutionState>;
export interface DescribeJobExecutionResponse {
  execution?: JobExecution;
}
export const DescribeJobExecutionResponse = S.suspend(() =>
  S.Struct({ execution: S.optional(JobExecution) }),
).annotations({
  identifier: "DescribeJobExecutionResponse",
}) as any as S.Schema<DescribeJobExecutionResponse>;
export interface GetPendingJobExecutionsResponse {
  inProgressJobs?: JobExecutionSummary[];
  queuedJobs?: JobExecutionSummary[];
}
export const GetPendingJobExecutionsResponse = S.suspend(() =>
  S.Struct({
    inProgressJobs: S.optional(JobExecutionSummaryList),
    queuedJobs: S.optional(JobExecutionSummaryList),
  }),
).annotations({
  identifier: "GetPendingJobExecutionsResponse",
}) as any as S.Schema<GetPendingJobExecutionsResponse>;
export interface StartCommandExecutionRequest {
  targetArn: string;
  commandArn: string;
  parameters?: { [key: string]: CommandParameterValue };
  executionTimeoutSeconds?: number;
  clientToken?: string;
}
export const StartCommandExecutionRequest = S.suspend(() =>
  S.Struct({
    targetArn: S.String,
    commandArn: S.String,
    parameters: S.optional(CommandExecutionParameterMap),
    executionTimeoutSeconds: S.optional(S.Number),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/command-executions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartCommandExecutionRequest",
}) as any as S.Schema<StartCommandExecutionRequest>;
export interface StartNextPendingJobExecutionResponse {
  execution?: JobExecution;
}
export const StartNextPendingJobExecutionResponse = S.suspend(() =>
  S.Struct({ execution: S.optional(JobExecution) }),
).annotations({
  identifier: "StartNextPendingJobExecutionResponse",
}) as any as S.Schema<StartNextPendingJobExecutionResponse>;
export interface UpdateJobExecutionResponse {
  executionState?: JobExecutionState;
  jobDocument?: string;
}
export const UpdateJobExecutionResponse = S.suspend(() =>
  S.Struct({
    executionState: S.optional(JobExecutionState),
    jobDocument: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateJobExecutionResponse",
}) as any as S.Schema<UpdateJobExecutionResponse>;
export interface StartCommandExecutionResponse {
  executionId?: string;
}
export const StartCommandExecutionResponse = S.suspend(() =>
  S.Struct({ executionId: S.optional(S.String) }),
).annotations({
  identifier: "StartCommandExecutionResponse",
}) as any as S.Schema<StartCommandExecutionResponse>;

//# Errors
export class CertificateValidationException extends S.TaggedError<CertificateValidationException>()(
  "CertificateValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String), resourceId: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidStateTransitionException extends S.TaggedError<InvalidStateTransitionException>()(
  "InvalidStateTransitionException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class TerminalStateException extends S.TaggedError<TerminalStateException>()(
  "TerminalStateException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String), payload: S.optional(T.Blob) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Updates the status of a job execution.
 *
 * Requires permission to access the UpdateJobExecution action.
 */
export const updateJobExecution: (
  input: UpdateJobExecutionRequest,
) => effect.Effect<
  UpdateJobExecutionResponse,
  | CertificateValidationException
  | InvalidRequestException
  | InvalidStateTransitionException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobExecutionRequest,
  output: UpdateJobExecutionResponse,
  errors: [
    CertificateValidationException,
    InvalidRequestException,
    InvalidStateTransitionException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Gets the list of all jobs for a thing that are not in a terminal status.
 *
 * Requires permission to access the GetPendingJobExecutions action.
 */
export const getPendingJobExecutions: (
  input: GetPendingJobExecutionsRequest,
) => effect.Effect<
  GetPendingJobExecutionsResponse,
  | CertificateValidationException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPendingJobExecutionsRequest,
  output: GetPendingJobExecutionsResponse,
  errors: [
    CertificateValidationException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Gets and starts the next pending (status IN_PROGRESS or QUEUED) job execution for a
 * thing.
 *
 * Requires permission to access the StartNextPendingJobExecution action.
 */
export const startNextPendingJobExecution: (
  input: StartNextPendingJobExecutionRequest,
) => effect.Effect<
  StartNextPendingJobExecutionResponse,
  | CertificateValidationException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartNextPendingJobExecutionRequest,
  output: StartNextPendingJobExecutionResponse,
  errors: [
    CertificateValidationException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Gets details of a job execution.
 *
 * Requires permission to access the DescribeJobExecution action.
 */
export const describeJobExecution: (
  input: DescribeJobExecutionRequest,
) => effect.Effect<
  DescribeJobExecutionResponse,
  | CertificateValidationException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | TerminalStateException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobExecutionRequest,
  output: DescribeJobExecutionResponse,
  errors: [
    CertificateValidationException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    TerminalStateException,
    ThrottlingException,
  ],
}));
/**
 * Using the command created with the `CreateCommand` API, start a command
 * execution on a specific device.
 */
export const startCommandExecution: (
  input: StartCommandExecutionRequest,
) => effect.Effect<
  StartCommandExecutionResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCommandExecutionRequest,
  output: StartCommandExecutionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
