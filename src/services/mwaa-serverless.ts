import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "MWAA Serverless",
  serviceShapeName: "AmazonMWAAServerless",
});
const auth = T.AwsAuthSigv4({ name: "airflow-serverless" });
const ver = T.ServiceVersion("2024-07-26");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      rules: [
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
                  ],
                  endpoint: {
                    url: "https://airflow-serverless-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://airflow-serverless.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeys = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class GetTaskInstanceRequest extends S.Class<GetTaskInstanceRequest>(
  "GetTaskInstanceRequest",
)(
  {
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    TaskInstanceId: S.String.pipe(T.HttpLabel("TaskInstanceId")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workflows/{WorkflowArn}/runs/{RunId}/tasks/{TaskInstanceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTaskInstancesRequest extends S.Class<ListTaskInstancesRequest>(
  "ListTaskInstancesRequest",
)(
  {
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workflows/{WorkflowArn}/runs/{RunId}/tasks",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowRequest extends S.Class<GetWorkflowRequest>(
  "GetWorkflowRequest",
)(
  {
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    WorkflowVersion: S.optional(S.String).pipe(T.HttpQuery("workflowVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workflows/{WorkflowArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DefinitionS3Location extends S.Class<DefinitionS3Location>(
  "DefinitionS3Location",
)({ Bucket: S.String, ObjectKey: S.String, VersionId: S.optional(S.String) }) {}
export class LoggingConfiguration extends S.Class<LoggingConfiguration>(
  "LoggingConfiguration",
)({ LogGroupName: S.String }) {}
export const SecurityGroupIds = S.Array(S.String);
export const SubnetIds = S.Array(S.String);
export class NetworkConfiguration extends S.Class<NetworkConfiguration>(
  "NetworkConfiguration",
)({
  SecurityGroupIds: S.optional(SecurityGroupIds),
  SubnetIds: S.optional(SubnetIds),
}) {}
export class UpdateWorkflowRequest extends S.Class<UpdateWorkflowRequest>(
  "UpdateWorkflowRequest",
)(
  {
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    DefinitionS3Location: DefinitionS3Location,
    RoleArn: S.String,
    Description: S.optional(S.String),
    LoggingConfiguration: S.optional(LoggingConfiguration),
    EngineVersion: S.optional(S.Number),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    TriggerMode: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/workflows/{WorkflowArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkflowRequest extends S.Class<DeleteWorkflowRequest>(
  "DeleteWorkflowRequest",
)(
  {
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    WorkflowVersion: S.optional(S.String).pipe(T.HttpQuery("workflowVersion")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/workflows/{WorkflowArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkflowsRequest extends S.Class<ListWorkflowsRequest>(
  "ListWorkflowsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workflows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowRunRequest extends S.Class<GetWorkflowRunRequest>(
  "GetWorkflowRunRequest",
)(
  {
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workflows/{WorkflowArn}/runs/{RunId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopWorkflowRunRequest extends S.Class<StopWorkflowRunRequest>(
  "StopWorkflowRunRequest",
)(
  {
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/workflows/{WorkflowArn}/runs/{RunId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkflowRunsRequest extends S.Class<ListWorkflowRunsRequest>(
  "ListWorkflowRunsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    WorkflowVersion: S.optional(S.String).pipe(T.HttpQuery("workflowVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workflows/{WorkflowArn}/runs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkflowVersionsRequest extends S.Class<ListWorkflowVersionsRequest>(
  "ListWorkflowVersionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workflows/{WorkflowArn}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({ Type: S.String, KmsKeyId: S.optional(S.String) }) {}
export const WarningMessages = S.Array(S.String);
export const ObjectMap = S.Record({ key: S.String, value: S.Any });
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class CreateWorkflowRequest extends S.Class<CreateWorkflowRequest>(
  "CreateWorkflowRequest",
)(
  {
    Name: S.String,
    ClientToken: S.optional(S.String),
    DefinitionS3Location: DefinitionS3Location,
    RoleArn: S.String,
    Description: S.optional(S.String),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    LoggingConfiguration: S.optional(LoggingConfiguration),
    EngineVersion: S.optional(S.Number),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    Tags: S.optional(Tags),
    TriggerMode: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workflows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkflowResponse extends S.Class<UpdateWorkflowResponse>(
  "UpdateWorkflowResponse",
)({
  WorkflowArn: S.String,
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  WorkflowVersion: S.optional(S.String),
  Warnings: S.optional(WarningMessages),
}) {}
export class DeleteWorkflowResponse extends S.Class<DeleteWorkflowResponse>(
  "DeleteWorkflowResponse",
)({ WorkflowArn: S.String, WorkflowVersion: S.optional(S.String) }) {}
export class StartWorkflowRunRequest extends S.Class<StartWorkflowRunRequest>(
  "StartWorkflowRunRequest",
)(
  {
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    ClientToken: S.optional(S.String),
    OverrideParameters: S.optional(ObjectMap),
    WorkflowVersion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workflows/{WorkflowArn}/runs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopWorkflowRunResponse extends S.Class<StopWorkflowRunResponse>(
  "StopWorkflowRunResponse",
)({
  WorkflowArn: S.optional(S.String),
  WorkflowVersion: S.optional(S.String),
  RunId: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const TaskInstanceIds = S.Array(S.String);
export const GenericMap = S.Record({ key: S.String, value: S.String });
export class TaskInstanceSummary extends S.Class<TaskInstanceSummary>(
  "TaskInstanceSummary",
)({
  WorkflowArn: S.optional(S.String),
  WorkflowVersion: S.optional(S.String),
  RunId: S.optional(S.String),
  TaskInstanceId: S.optional(S.String),
  Status: S.optional(S.String),
  DurationInSeconds: S.optional(S.Number),
  OperatorName: S.optional(S.String),
}) {}
export const TaskInstanceSummaries = S.Array(TaskInstanceSummary);
export class ScheduleConfiguration extends S.Class<ScheduleConfiguration>(
  "ScheduleConfiguration",
)({ CronExpression: S.optional(S.String) }) {}
export class WorkflowSummary extends S.Class<WorkflowSummary>(
  "WorkflowSummary",
)({
  WorkflowArn: S.String,
  WorkflowVersion: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  WorkflowStatus: S.optional(S.String),
  TriggerMode: S.optional(S.String),
}) {}
export const WorkflowSummaries = S.Array(WorkflowSummary);
export class WorkflowRunDetail extends S.Class<WorkflowRunDetail>(
  "WorkflowRunDetail",
)({
  WorkflowArn: S.optional(S.String),
  WorkflowVersion: S.optional(S.String),
  RunId: S.optional(S.String),
  RunType: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Duration: S.optional(S.Number),
  ErrorMessage: S.optional(S.String),
  TaskInstances: S.optional(TaskInstanceIds),
  RunState: S.optional(S.String),
}) {}
export class WorkflowVersionSummary extends S.Class<WorkflowVersionSummary>(
  "WorkflowVersionSummary",
)({
  WorkflowVersion: S.String,
  WorkflowArn: S.String,
  IsLatestVersion: S.optional(S.Boolean),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DefinitionS3Location: S.optional(DefinitionS3Location),
  ScheduleConfiguration: S.optional(ScheduleConfiguration),
  TriggerMode: S.optional(S.String),
}) {}
export const WorkflowVersionSummaries = S.Array(WorkflowVersionSummary);
export class GetTaskInstanceResponse extends S.Class<GetTaskInstanceResponse>(
  "GetTaskInstanceResponse",
)({
  WorkflowArn: S.String,
  RunId: S.String,
  TaskInstanceId: S.String,
  WorkflowVersion: S.optional(S.String),
  Status: S.optional(S.String),
  DurationInSeconds: S.optional(S.Number),
  OperatorName: S.optional(S.String),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  AttemptNumber: S.optional(S.Number),
  ErrorMessage: S.optional(S.String),
  TaskId: S.optional(S.String),
  LogStream: S.optional(S.String),
  Xcom: S.optional(GenericMap),
}) {}
export class ListTaskInstancesResponse extends S.Class<ListTaskInstancesResponse>(
  "ListTaskInstancesResponse",
)({
  TaskInstances: S.optional(TaskInstanceSummaries),
  NextToken: S.optional(S.String),
}) {}
export class CreateWorkflowResponse extends S.Class<CreateWorkflowResponse>(
  "CreateWorkflowResponse",
)({
  WorkflowArn: S.String,
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  RevisionId: S.optional(S.String),
  WorkflowStatus: S.optional(S.String),
  WorkflowVersion: S.optional(S.String),
  IsLatestVersion: S.optional(S.Boolean),
  Warnings: S.optional(WarningMessages),
}) {}
export class GetWorkflowResponse extends S.Class<GetWorkflowResponse>(
  "GetWorkflowResponse",
)({
  WorkflowArn: S.String,
  WorkflowVersion: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  LoggingConfiguration: S.optional(LoggingConfiguration),
  EngineVersion: S.optional(S.Number),
  WorkflowStatus: S.optional(S.String),
  DefinitionS3Location: S.optional(DefinitionS3Location),
  ScheduleConfiguration: S.optional(ScheduleConfiguration),
  RoleArn: S.optional(S.String),
  NetworkConfiguration: S.optional(NetworkConfiguration),
  TriggerMode: S.optional(S.String),
  WorkflowDefinition: S.optional(S.String),
}) {}
export class ListWorkflowsResponse extends S.Class<ListWorkflowsResponse>(
  "ListWorkflowsResponse",
)({ Workflows: WorkflowSummaries, NextToken: S.optional(S.String) }) {}
export class StartWorkflowRunResponse extends S.Class<StartWorkflowRunResponse>(
  "StartWorkflowRunResponse",
)({
  RunId: S.optional(S.String),
  Status: S.optional(S.String),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetWorkflowRunResponse extends S.Class<GetWorkflowRunResponse>(
  "GetWorkflowRunResponse",
)({
  WorkflowArn: S.optional(S.String),
  WorkflowVersion: S.optional(S.String),
  RunId: S.optional(S.String),
  RunType: S.optional(S.String),
  OverrideParameters: S.optional(ObjectMap),
  RunDetail: S.optional(WorkflowRunDetail),
}) {}
export class ListWorkflowVersionsResponse extends S.Class<ListWorkflowVersionsResponse>(
  "ListWorkflowVersionsResponse",
)({
  WorkflowVersions: S.optional(WorkflowVersionSummaries),
  NextToken: S.optional(S.String),
}) {}
export class RunDetailSummary extends S.Class<RunDetailSummary>(
  "RunDetailSummary",
)({
  Status: S.optional(S.String),
  CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class WorkflowRunSummary extends S.Class<WorkflowRunSummary>(
  "WorkflowRunSummary",
)({
  RunId: S.optional(S.String),
  WorkflowArn: S.optional(S.String),
  WorkflowVersion: S.optional(S.String),
  RunType: S.optional(S.String),
  RunDetailSummary: S.optional(RunDetailSummary),
}) {}
export const WorkflowRunSummaries = S.Array(WorkflowRunSummary);
export class ListWorkflowRunsResponse extends S.Class<ListWorkflowRunsResponse>(
  "ListWorkflowRunsResponse",
)({
  WorkflowRuns: S.optional(WorkflowRunSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ Name: S.String, Message: S.String }) {}
export const ValidationExceptionFields = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
) {}
export class OperationTimeoutException extends S.TaggedError<OperationTimeoutException>()(
  "OperationTimeoutException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    ServiceCode: S.String,
    QuotaCode: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    ServiceCode: S.String,
    QuotaCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.String,
    FieldList: S.optional(ValidationExceptionFields),
  },
) {}

//# Operations
/**
 * Lists all runs for a specified workflow, with optional pagination and filtering support.
 */
export const listWorkflowRuns = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkflowRunsRequest,
    output: ListWorkflowRunsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      OperationTimeoutException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "WorkflowRuns",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates a new workflow in Amazon Managed Workflows for Apache Airflow Serverless. This operation initializes a workflow with the specified configuration including the workflow definition, execution role, and optional settings for encryption, logging, and networking. You must provide the workflow definition as a YAML file stored in Amazon S3 that defines the DAG structure using supported Amazon Web Services operators. Amazon Managed Workflows for Apache Airflow Serverless automatically creates the first version of the workflow and sets up the necessary execution environment with multi-tenant isolation and security controls.
 */
export const createWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkflowRequest,
  output: CreateWorkflowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    OperationTimeoutException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves detailed information about a specific task instance within a workflow run. Task instances represent individual tasks that are executed as part of a workflow in the Amazon Managed Workflows for Apache Airflow Serverless environment. Each task instance runs in an isolated ECS container with dedicated resources and security boundaries. The service tracks task execution state, retry attempts, and provides detailed timing and error information for troubleshooting and monitoring purposes.
 */
export const getTaskInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTaskInstanceRequest,
  output: GetTaskInstanceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    OperationTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves detailed information about a workflow, including its configuration, status, and metadata.
 */
export const getWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRequest,
  output: GetWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    OperationTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing workflow with new configuration settings. This operation allows you to modify the workflow definition, role, and other settings. When you update a workflow, Amazon Managed Workflows for Apache Airflow Serverless automatically creates a new version with the updated configuration and disables scheduling on all previous versions to ensure only one version is actively scheduled at a time. The update operation maintains workflow history while providing a clean transition to the new configuration.
 */
export const updateWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkflowRequest,
  output: UpdateWorkflowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    OperationTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a new execution of a workflow. This operation creates a workflow run that executes the tasks that are defined in the workflow. Amazon Managed Workflows for Apache Airflow Serverless schedules the workflow execution across its managed Airflow environment, automatically scaling ECS worker tasks based on the workload. The service handles task isolation, dependency resolution, and provides comprehensive monitoring and logging throughout the execution lifecycle.
 */
export const startWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartWorkflowRunRequest,
  output: StartWorkflowRunResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    OperationTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves detailed information about a specific workflow run, including its status, execution details, and task instances.
 */
export const getWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRunRequest,
  output: GetWorkflowRunResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    OperationTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a workflow and all its versions. This operation permanently removes the workflow and cannot be undone. Amazon Managed Workflows for Apache Airflow Serverless ensures that all associated resources are properly cleaned up, including stopping any running executions, removing scheduled triggers, and cleaning up execution history. The deletion process respects the multi-tenant isolation boundaries and ensures that no residual data or configurations remain that could affect other customers or workflows.
 */
export const deleteWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkflowRequest,
  output: DeleteWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    OperationTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops a running workflow execution. This operation terminates all running tasks and prevents new tasks from starting. Amazon Managed Workflows for Apache Airflow Serverless gracefully shuts down the workflow execution by stopping task scheduling and terminating active ECS worker containers. The operation transitions the workflow run to a `STOPPING` state and then to `STOPPED` once all cleanup is complete. In-flight tasks may complete or be terminated depending on their current execution state.
 */
export const stopWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopWorkflowRunRequest,
  output: StopWorkflowRunResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    OperationTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all tags that are associated with a specified Amazon Managed Workflows for Apache Airflow Serverless resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    OperationTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds tags to an Amazon Managed Workflows for Apache Airflow Serverless resource. Tags are key-value pairs that help you organize and categorize your resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    OperationTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all task instances for a specific workflow run, with optional pagination support.
 */
export const listTaskInstances = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTaskInstancesRequest,
    output: ListTaskInstancesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      OperationTimeoutException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TaskInstances",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all workflows in your account, with optional pagination support. This operation returns summary information for workflows, showing only the most recently created version of each workflow. Amazon Managed Workflows for Apache Airflow Serverless maintains workflow metadata in a highly available, distributed storage system that enables efficient querying and filtering. The service implements proper access controls to ensure you can only view workflows that you have permissions to access, supporting both individual and team-based workflow management scenarios.
 */
export const listWorkflows = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkflowsRequest,
    output: ListWorkflowsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      OperationTimeoutException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Workflows",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all versions of a specified workflow, with optional pagination support.
 */
export const listWorkflowVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkflowVersionsRequest,
    output: ListWorkflowVersionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      OperationTimeoutException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "WorkflowVersions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Removes tags from an Amazon Managed Workflows for Apache Airflow Serverless resource. This operation removes the specified tags from the resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    OperationTimeoutException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
