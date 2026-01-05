import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Nova Act",
  serviceShapeName: "AmazonNovaAgentsDataPlane",
});
const auth = T.AwsAuthSigv4({ name: "nova-act" });
const ver = T.ServiceVersion("2025-08-22");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                            url: "https://nova-act-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "booleanEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://nova-act-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                            url: "https://nova-act.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://nova-act.{Region}.{PartitionResult#dnsSuffix}",
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
export class ListActsRequest extends S.Class<ListActsRequest>(
  "ListActsRequest",
)(
  {
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.optional(S.String).pipe(T.HttpQuery("workflowRunId")),
    sessionId: S.optional(S.String).pipe(T.HttpQuery("sessionId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortOrder: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workflow-definitions/{workflowDefinitionName}/acts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListModelsRequest extends S.Class<ListModelsRequest>(
  "ListModelsRequest",
)(
  {
    clientCompatibilityVersion: S.Number.pipe(
      T.HttpQuery("clientCompatibilityVersion"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/models" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSessionRequest extends S.Class<CreateSessionRequest>(
  "CreateSessionRequest",
)(
  {
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/workflow-definitions/{workflowDefinitionName}/workflow-runs/{workflowRunId}/sessions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSessionsRequest extends S.Class<ListSessionsRequest>(
  "ListSessionsRequest",
)(
  {
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortOrder: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workflow-definitions/{workflowDefinitionName}/workflow-runs/{workflowRunId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowDefinitionRequest extends S.Class<GetWorkflowDefinitionRequest>(
  "GetWorkflowDefinitionRequest",
)(
  {
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workflow-definitions/{workflowDefinitionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkflowDefinitionRequest extends S.Class<DeleteWorkflowDefinitionRequest>(
  "DeleteWorkflowDefinitionRequest",
)(
  {
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workflow-definitions/{workflowDefinitionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkflowDefinitionsRequest extends S.Class<ListWorkflowDefinitionsRequest>(
  "ListWorkflowDefinitionsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortOrder: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workflow-definitions" }),
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
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workflow-definitions/{workflowDefinitionName}/workflow-runs/{workflowRunId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkflowRunRequest extends S.Class<UpdateWorkflowRunRequest>(
  "UpdateWorkflowRunRequest",
)(
  {
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    status: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/workflow-definitions/{workflowDefinitionName}/workflow-runs/{workflowRunId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkflowRunResponse extends S.Class<UpdateWorkflowRunResponse>(
  "UpdateWorkflowRunResponse",
)({}) {}
export class DeleteWorkflowRunRequest extends S.Class<DeleteWorkflowRunRequest>(
  "DeleteWorkflowRunRequest",
)(
  {
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workflow-definitions/{workflowDefinitionName}/workflow-runs/{workflowRunId}",
    }),
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
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortOrder: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workflow-definitions/{workflowDefinitionName}/workflow-runs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ActError extends S.Class<ActError>("ActError")({
  message: S.String,
  type: S.optional(S.String),
}) {}
export class WorkflowExportConfig extends S.Class<WorkflowExportConfig>(
  "WorkflowExportConfig",
)({ s3BucketName: S.String, s3KeyPrefix: S.optional(S.String) }) {}
export class ClientInfo extends S.Class<ClientInfo>("ClientInfo")({
  compatibilityVersion: S.Number,
  sdkVersion: S.optional(S.String),
}) {}
export class UpdateActRequest extends S.Class<UpdateActRequest>(
  "UpdateActRequest",
)(
  {
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    actId: S.String.pipe(T.HttpLabel("actId")),
    status: S.String,
    error: S.optional(ActError),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/workflow-definitions/{workflowDefinitionName}/workflow-runs/{workflowRunId}/sessions/{sessionId}/acts/{actId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateActResponse extends S.Class<UpdateActResponse>(
  "UpdateActResponse",
)({}) {}
export class CreateSessionResponse extends S.Class<CreateSessionResponse>(
  "CreateSessionResponse",
)({ sessionId: S.String }) {}
export class CreateWorkflowDefinitionRequest extends S.Class<CreateWorkflowDefinitionRequest>(
  "CreateWorkflowDefinitionRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    exportConfig: S.optional(WorkflowExportConfig),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/workflow-definitions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowDefinitionResponse extends S.Class<GetWorkflowDefinitionResponse>(
  "GetWorkflowDefinitionResponse",
)({
  name: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  description: S.optional(S.String),
  exportConfig: S.optional(WorkflowExportConfig),
  status: S.String,
}) {}
export class DeleteWorkflowDefinitionResponse extends S.Class<DeleteWorkflowDefinitionResponse>(
  "DeleteWorkflowDefinitionResponse",
)({ status: S.String }) {}
export class CreateWorkflowRunRequest extends S.Class<CreateWorkflowRunRequest>(
  "CreateWorkflowRunRequest",
)(
  {
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    modelId: S.String,
    clientToken: S.optional(S.String),
    logGroupName: S.optional(S.String),
    clientInfo: ClientInfo,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/workflow-definitions/{workflowDefinitionName}/workflow-runs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowRunResponse extends S.Class<GetWorkflowRunResponse>(
  "GetWorkflowRunResponse",
)({
  workflowRunArn: S.String,
  workflowRunId: S.String,
  status: S.String,
  startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  modelId: S.String,
  logGroupName: S.optional(S.String),
}) {}
export class DeleteWorkflowRunResponse extends S.Class<DeleteWorkflowRunResponse>(
  "DeleteWorkflowRunResponse",
)({ status: S.String }) {}
export const ToolInputSchema = S.Union(S.Struct({ json: S.Any }));
export const CallResultContent = S.Union(S.Struct({ text: S.String }));
export const CallResultContents = S.Array(CallResultContent);
export const ModelIdList = S.Array(S.String);
export class ToolSpec extends S.Class<ToolSpec>("ToolSpec")({
  name: S.String,
  description: S.String,
  inputSchema: ToolInputSchema,
}) {}
export const ToolSpecs = S.Array(ToolSpec);
export class CallResult extends S.Class<CallResult>("CallResult")({
  callId: S.optional(S.String),
  content: CallResultContents,
}) {}
export const CallResults = S.Array(CallResult);
export class ModelAlias extends S.Class<ModelAlias>("ModelAlias")({
  aliasName: S.String,
  latestModelId: S.String,
  resolvedModelId: S.optional(S.String),
}) {}
export const ModelAliases = S.Array(ModelAlias);
export class CompatibilityInformation extends S.Class<CompatibilityInformation>(
  "CompatibilityInformation",
)({
  clientCompatibilityVersion: S.Number,
  supportedModelIds: ModelIdList,
  message: S.optional(S.String),
}) {}
export class SessionSummary extends S.Class<SessionSummary>("SessionSummary")({
  sessionId: S.String,
}) {}
export const SessionSummaries = S.Array(SessionSummary);
export class WorkflowDefinitionSummary extends S.Class<WorkflowDefinitionSummary>(
  "WorkflowDefinitionSummary",
)({
  workflowDefinitionArn: S.String,
  workflowDefinitionName: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export const WorkflowDefinitionSummaries = S.Array(WorkflowDefinitionSummary);
export class TraceLocation extends S.Class<TraceLocation>("TraceLocation")({
  locationType: S.String,
  location: S.String,
}) {}
export class WorkflowRunSummary extends S.Class<WorkflowRunSummary>(
  "WorkflowRunSummary",
)({
  workflowRunArn: S.String,
  workflowRunId: S.String,
  status: S.String,
  startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  traceLocation: S.optional(TraceLocation),
}) {}
export const WorkflowRunSummaries = S.Array(WorkflowRunSummary);
export class CreateActRequest extends S.Class<CreateActRequest>(
  "CreateActRequest",
)(
  {
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    task: S.String,
    toolSpecs: S.optional(ToolSpecs),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/workflow-definitions/{workflowDefinitionName}/workflow-runs/{workflowRunId}/sessions/{sessionId}/acts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeActStepRequest extends S.Class<InvokeActStepRequest>(
  "InvokeActStepRequest",
)(
  {
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    actId: S.String.pipe(T.HttpLabel("actId")),
    callResults: CallResults,
    previousStepId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/workflow-definitions/{workflowDefinitionName}/workflow-runs/{workflowRunId}/sessions/{sessionId}/acts/{actId}/invoke-step/",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSessionsResponse extends S.Class<ListSessionsResponse>(
  "ListSessionsResponse",
)({ sessionSummaries: SessionSummaries, nextToken: S.optional(S.String) }) {}
export class CreateWorkflowDefinitionResponse extends S.Class<CreateWorkflowDefinitionResponse>(
  "CreateWorkflowDefinitionResponse",
)({ status: S.String }) {}
export class ListWorkflowDefinitionsResponse extends S.Class<ListWorkflowDefinitionsResponse>(
  "ListWorkflowDefinitionsResponse",
)({
  workflowDefinitionSummaries: WorkflowDefinitionSummaries,
  nextToken: S.optional(S.String),
}) {}
export class CreateWorkflowRunResponse extends S.Class<CreateWorkflowRunResponse>(
  "CreateWorkflowRunResponse",
)({ workflowRunId: S.String, status: S.String }) {}
export class ListWorkflowRunsResponse extends S.Class<ListWorkflowRunsResponse>(
  "ListWorkflowRunsResponse",
)({
  workflowRunSummaries: WorkflowRunSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ModelLifecycle extends S.Class<ModelLifecycle>("ModelLifecycle")({
  status: S.String,
}) {}
export class ActSummary extends S.Class<ActSummary>("ActSummary")({
  workflowRunId: S.String,
  sessionId: S.String,
  actId: S.String,
  status: S.String,
  startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  traceLocation: S.optional(TraceLocation),
}) {}
export const ActSummaries = S.Array(ActSummary);
export class ModelSummary extends S.Class<ModelSummary>("ModelSummary")({
  modelId: S.String,
  modelLifecycle: ModelLifecycle,
  minimumCompatibilityVersion: S.Number,
}) {}
export const ModelSummaries = S.Array(ModelSummary);
export class CreateActResponse extends S.Class<CreateActResponse>(
  "CreateActResponse",
)({ actId: S.String, status: S.String }) {}
export class ListActsResponse extends S.Class<ListActsResponse>(
  "ListActsResponse",
)({ actSummaries: ActSummaries, nextToken: S.optional(S.String) }) {}
export class ListModelsResponse extends S.Class<ListModelsResponse>(
  "ListModelsResponse",
)({
  modelSummaries: ModelSummaries,
  modelAliases: ModelAliases,
  compatibilityInformation: CompatibilityInformation,
}) {}
export class Call extends S.Class<Call>("Call")({
  callId: S.String,
  input: S.Any,
  name: S.String,
}) {}
export const Calls = S.Array(Call);
export class InvokeActStepResponse extends S.Class<InvokeActStepResponse>(
  "InvokeActStepResponse",
)({ calls: Calls, stepId: S.String }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
    reason: S.optional(S.String),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Lists all available AI models that can be used for workflow execution, including their status and compatibility information.
 */
export const listModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListModelsRequest,
  output: ListModelsResponse,
  errors: [AccessDeniedException, InternalServerException, ThrottlingException],
}));
/**
 * Lists all workflow definitions in your account with optional filtering and pagination.
 */
export const listWorkflowDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListWorkflowDefinitionsRequest,
    output: ListWorkflowDefinitionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Terminates and cleans up a workflow run, stopping all associated acts and sessions.
 */
export const deleteWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkflowRunRequest,
  output: DeleteWorkflowRunResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing act's configuration, status, or error information.
 */
export const updateAct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateActRequest,
  output: UpdateActResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new session context within a workflow run to manage conversation state and acts.
 */
export const createSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSessionRequest,
  output: CreateSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a workflow definition and all associated resources. This operation cannot be undone.
 */
export const deleteWorkflowDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWorkflowDefinitionRequest,
    output: DeleteWorkflowDefinitionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the current state, configuration, and execution details of a workflow run.
 */
export const getWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRunRequest,
  output: GetWorkflowRunResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all sessions within a specific workflow run.
 */
export const listSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSessionsRequest,
  output: ListSessionsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new execution instance of a workflow definition with specified parameters.
 */
export const createWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkflowRunRequest,
  output: CreateWorkflowRunResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration or state of an active workflow run.
 */
export const updateWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkflowRunRequest,
  output: UpdateWorkflowRunResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all workflow runs for a specific workflow definition with optional filtering and pagination.
 */
export const listWorkflowRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWorkflowRunsRequest,
  output: ListWorkflowRunsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new AI task (act) within a session that can interact with tools and perform specific actions.
 */
export const createAct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateActRequest,
  output: CreateActResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all acts within a specific session with their current status and execution details.
 */
export const listActs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListActsRequest,
  output: ListActsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the details and configuration of a specific workflow definition.
 */
export const getWorkflowDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWorkflowDefinitionRequest,
    output: GetWorkflowDefinitionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new workflow definition template that can be used to execute multiple workflow runs.
 */
export const createWorkflowDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWorkflowDefinitionRequest,
    output: CreateWorkflowDefinitionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Executes the next step of an act, processing tool call results and returning new tool calls if needed.
 */
export const invokeActStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeActStepRequest,
  output: InvokeActStepResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
