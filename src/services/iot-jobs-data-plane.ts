import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "IoT Jobs Data Plane",
  serviceShapeName: "IotLaserThingJobManagerExternalService",
});
const auth = T.AwsAuthSigv4({ name: "iot-jobs-data" });
const ver = T.ServiceVersion("2017-09-29");
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
                        url: "https://data.jobs.iot-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://data.jobs.iot-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://data.jobs.iot.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://data.jobs.iot.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeJobExecutionRequest extends S.Class<DescribeJobExecutionRequest>(
  "DescribeJobExecutionRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    thingName: S.String.pipe(T.HttpLabel()),
    includeJobDocument: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeJobDocument"),
    ),
    executionNumber: S.optional(S.Number).pipe(T.HttpQuery("executionNumber")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/things/{thingName}/jobs/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPendingJobExecutionsRequest extends S.Class<GetPendingJobExecutionsRequest>(
  "GetPendingJobExecutionsRequest",
)(
  { thingName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/things/{thingName}/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const DetailsMap = S.Record({ key: S.String, value: S.String });
export class UpdateJobExecutionRequest extends S.Class<UpdateJobExecutionRequest>(
  "UpdateJobExecutionRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    thingName: S.String.pipe(T.HttpLabel()),
    status: S.String,
    statusDetails: S.optional(DetailsMap),
    stepTimeoutInMinutes: S.optional(S.Number),
    expectedVersion: S.optional(S.Number),
    includeJobExecutionState: S.optional(S.Boolean),
    includeJobDocument: S.optional(S.Boolean),
    executionNumber: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/things/{thingName}/jobs/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartNextPendingJobExecutionRequest extends S.Class<StartNextPendingJobExecutionRequest>(
  "StartNextPendingJobExecutionRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel()),
    statusDetails: S.optional(DetailsMap),
    stepTimeoutInMinutes: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/things/{thingName}/jobs/$next" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CommandParameterValue extends S.Class<CommandParameterValue>(
  "CommandParameterValue",
)({
  S: S.optional(S.String),
  B: S.optional(S.Boolean),
  I: S.optional(S.Number),
  L: S.optional(S.Number),
  D: S.optional(S.Number),
  BIN: S.optional(T.Blob),
  UL: S.optional(S.String),
}) {}
export class JobExecution extends S.Class<JobExecution>("JobExecution")({
  jobId: S.optional(S.String),
  thingName: S.optional(S.String),
  status: S.optional(S.String),
  statusDetails: S.optional(DetailsMap),
  queuedAt: S.optional(S.Number),
  startedAt: S.optional(S.Number),
  lastUpdatedAt: S.optional(S.Number),
  approximateSecondsBeforeTimedOut: S.optional(S.Number),
  versionNumber: S.optional(S.Number),
  executionNumber: S.optional(S.Number),
  jobDocument: S.optional(S.String),
}) {}
export class JobExecutionSummary extends S.Class<JobExecutionSummary>(
  "JobExecutionSummary",
)({
  jobId: S.optional(S.String),
  queuedAt: S.optional(S.Number),
  startedAt: S.optional(S.Number),
  lastUpdatedAt: S.optional(S.Number),
  versionNumber: S.optional(S.Number),
  executionNumber: S.optional(S.Number),
}) {}
export const JobExecutionSummaryList = S.Array(JobExecutionSummary);
export const CommandExecutionParameterMap = S.Record({
  key: S.String,
  value: CommandParameterValue,
});
export class JobExecutionState extends S.Class<JobExecutionState>(
  "JobExecutionState",
)({
  status: S.optional(S.String),
  statusDetails: S.optional(DetailsMap),
  versionNumber: S.optional(S.Number),
}) {}
export class DescribeJobExecutionResponse extends S.Class<DescribeJobExecutionResponse>(
  "DescribeJobExecutionResponse",
)({ execution: S.optional(JobExecution) }) {}
export class GetPendingJobExecutionsResponse extends S.Class<GetPendingJobExecutionsResponse>(
  "GetPendingJobExecutionsResponse",
)({
  inProgressJobs: S.optional(JobExecutionSummaryList),
  queuedJobs: S.optional(JobExecutionSummaryList),
}) {}
export class StartCommandExecutionRequest extends S.Class<StartCommandExecutionRequest>(
  "StartCommandExecutionRequest",
)(
  {
    targetArn: S.String,
    commandArn: S.String,
    parameters: S.optional(CommandExecutionParameterMap),
    executionTimeoutSeconds: S.optional(S.Number),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/command-executions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartNextPendingJobExecutionResponse extends S.Class<StartNextPendingJobExecutionResponse>(
  "StartNextPendingJobExecutionResponse",
)({ execution: S.optional(JobExecution) }) {}
export class UpdateJobExecutionResponse extends S.Class<UpdateJobExecutionResponse>(
  "UpdateJobExecutionResponse",
)({
  executionState: S.optional(JobExecutionState),
  jobDocument: S.optional(S.String),
}) {}
export class StartCommandExecutionResponse extends S.Class<StartCommandExecutionResponse>(
  "StartCommandExecutionResponse",
)({ executionId: S.optional(S.String) }) {}

//# Errors
export class CertificateValidationException extends S.TaggedError<CertificateValidationException>()(
  "CertificateValidationException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class InvalidStateTransitionException extends S.TaggedError<InvalidStateTransitionException>()(
  "InvalidStateTransitionException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String), resourceId: S.optional(S.String) },
) {}
export class TerminalStateException extends S.TaggedError<TerminalStateException>()(
  "TerminalStateException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Gets and starts the next pending (status IN_PROGRESS or QUEUED) job execution for a
 * thing.
 *
 * Requires permission to access the StartNextPendingJobExecution action.
 */
export const startNextPendingJobExecution =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the status of a job execution.
 *
 * Requires permission to access the UpdateJobExecution action.
 */
export const updateJobExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPendingJobExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPendingJobExecutionsRequest,
    output: GetPendingJobExecutionsResponse,
    errors: [
      CertificateValidationException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets details of a job execution.
 *
 * Requires permission to access the DescribeJobExecution action.
 */
export const describeJobExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Using the command created with the `CreateCommand` API, start a command
 * execution on a specific device.
 */
export const startCommandExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
