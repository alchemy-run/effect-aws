import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "CodeCatalyst",
  serviceShapeName: "CodeCatalyst",
});
const auth = T.AwsAuthSigv4({ name: "CodeCatalyst" });
const ver = T.ServiceVersion("2022-09-28");
const proto = T.AwsProtocolsRestJson1();
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
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
      endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
      type: "endpoint",
    },
    {
      conditions: [
        { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Region" }] }] },
        { fn: "aws.partition", argv: ["us-west-2"], assign: "PartitionResult" },
      ],
      rules: [
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
                    false,
                  ],
                },
              ],
              error: "Partition does not support FIPS.",
              type: "error",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://codecatalyst-fips.global.{PartitionResult#dualStackDnsSuffix}",
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
          endpoint: {
            url: "https://codecatalyst.global.{PartitionResult#dualStackDnsSuffix}",
            properties: {},
            headers: {},
          },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [
        { fn: "isSet", argv: [{ ref: "Region" }] },
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
                    false,
                  ],
                },
              ],
              error: "Partition does not support FIPS.",
              type: "error",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://codecatalyst-fips.global.{PartitionResult#dualStackDnsSuffix}",
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
          endpoint: {
            url: "https://codecatalyst.global.{PartitionResult#dualStackDnsSuffix}",
            properties: {},
            headers: {},
          },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export class VerifySessionRequest extends S.Class<VerifySessionRequest>(
  "VerifySessionRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class WorkflowSortCriteria extends S.Class<WorkflowSortCriteria>(
  "WorkflowSortCriteria",
)({}) {}
export const WorkflowSortCriteriaList = S.Array(WorkflowSortCriteria);
export class WorkflowRunSortCriteria extends S.Class<WorkflowRunSortCriteria>(
  "WorkflowRunSortCriteria",
)({}) {}
export const WorkflowRunSortCriteriaList = S.Array(WorkflowRunSortCriteria);
export class GetUserDetailsRequest extends S.Class<GetUserDetailsRequest>(
  "GetUserDetailsRequest",
)(
  {
    id: S.optional(S.String).pipe(T.HttpQuery("id")),
    userName: S.optional(S.String).pipe(T.HttpQuery("userName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/userDetails" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VerifySessionResponse extends S.Class<VerifySessionResponse>(
  "VerifySessionResponse",
)({ identity: S.optional(S.String) }) {}
export class CreateAccessTokenRequest extends S.Class<CreateAccessTokenRequest>(
  "CreateAccessTokenRequest",
)(
  {
    name: S.String,
    expiresTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/accessTokens" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessTokenRequest extends S.Class<DeleteAccessTokenRequest>(
  "DeleteAccessTokenRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/accessTokens/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessTokenResponse extends S.Class<DeleteAccessTokenResponse>(
  "DeleteAccessTokenResponse",
)({}) {}
export class ListAccessTokensRequest extends S.Class<ListAccessTokensRequest>(
  "ListAccessTokensRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/accessTokens" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSpaceRequest extends S.Class<GetSpaceRequest>(
  "GetSpaceRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/spaces/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSpaceRequest extends S.Class<UpdateSpaceRequest>(
  "UpdateSpaceRequest",
)(
  {
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v1/spaces/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSpaceRequest extends S.Class<DeleteSpaceRequest>(
  "DeleteSpaceRequest",
)(
  { name: S.String.pipe(T.HttpLabel("name")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/spaces/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSpacesRequest extends S.Class<ListSpacesRequest>(
  "ListSpacesRequest",
)(
  { nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/spaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEventLogsRequest extends S.Class<ListEventLogsRequest>(
  "ListEventLogsRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
    eventName: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/spaces/{spaceName}/eventLogs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProjectRequest extends S.Class<CreateProjectRequest>(
  "CreateProjectRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    displayName: S.String,
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/spaces/{spaceName}/projects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProjectRequest extends S.Class<GetProjectRequest>(
  "GetProjectRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/spaces/{spaceName}/projects/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProjectRequest extends S.Class<UpdateProjectRequest>(
  "UpdateProjectRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v1/spaces/{spaceName}/projects/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProjectRequest extends S.Class<DeleteProjectRequest>(
  "DeleteProjectRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/spaces/{spaceName}/projects/{name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDevEnvironmentRequest extends S.Class<GetDevEnvironmentRequest>(
  "GetDevEnvironmentRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/devEnvironments/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IdeConfiguration extends S.Class<IdeConfiguration>(
  "IdeConfiguration",
)({ runtime: S.optional(S.String), name: S.optional(S.String) }) {}
export const IdeConfigurationList = S.Array(IdeConfiguration);
export class UpdateDevEnvironmentRequest extends S.Class<UpdateDevEnvironmentRequest>(
  "UpdateDevEnvironmentRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
    alias: S.optional(S.String),
    ides: S.optional(IdeConfigurationList),
    instanceType: S.optional(S.String),
    inactivityTimeoutMinutes: S.optional(S.Number),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/devEnvironments/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDevEnvironmentRequest extends S.Class<DeleteDevEnvironmentRequest>(
  "DeleteDevEnvironmentRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/devEnvironments/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDevEnvironmentSessionsRequest extends S.Class<ListDevEnvironmentSessionsRequest>(
  "ListDevEnvironmentSessionsRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    devEnvironmentId: S.String.pipe(T.HttpLabel("devEnvironmentId")),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/devEnvironments/{devEnvironmentId}/sessions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDevEnvironmentRequest extends S.Class<StartDevEnvironmentRequest>(
  "StartDevEnvironmentRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
    ides: S.optional(IdeConfigurationList),
    instanceType: S.optional(S.String),
    inactivityTimeoutMinutes: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/devEnvironments/{id}/start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopDevEnvironmentRequest extends S.Class<StopDevEnvironmentRequest>(
  "StopDevEnvironmentRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/devEnvironments/{id}/stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopDevEnvironmentSessionRequest extends S.Class<StopDevEnvironmentSessionRequest>(
  "StopDevEnvironmentSessionRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/devEnvironments/{id}/session/{sessionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSourceRepositoryRequest extends S.Class<CreateSourceRepositoryRequest>(
  "CreateSourceRepositoryRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/sourceRepositories/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSourceRepositoryRequest extends S.Class<GetSourceRepositoryRequest>(
  "GetSourceRepositoryRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/sourceRepositories/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSourceRepositoryRequest extends S.Class<DeleteSourceRepositoryRequest>(
  "DeleteSourceRepositoryRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    name: S.String.pipe(T.HttpLabel("name")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/sourceRepositories/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSourceRepositoriesRequest extends S.Class<ListSourceRepositoriesRequest>(
  "ListSourceRepositoriesRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/sourceRepositories",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSourceRepositoryCloneUrlsRequest extends S.Class<GetSourceRepositoryCloneUrlsRequest>(
  "GetSourceRepositoryCloneUrlsRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    sourceRepositoryName: S.String.pipe(T.HttpLabel("sourceRepositoryName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/sourceRepositories/{sourceRepositoryName}/cloneUrls",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSourceRepositoryBranchRequest extends S.Class<CreateSourceRepositoryBranchRequest>(
  "CreateSourceRepositoryBranchRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    sourceRepositoryName: S.String.pipe(T.HttpLabel("sourceRepositoryName")),
    name: S.String.pipe(T.HttpLabel("name")),
    headCommitId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/sourceRepositories/{sourceRepositoryName}/branches/{name}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSourceRepositoryBranchesRequest extends S.Class<ListSourceRepositoryBranchesRequest>(
  "ListSourceRepositoryBranchesRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    sourceRepositoryName: S.String.pipe(T.HttpLabel("sourceRepositoryName")),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/sourceRepositories/{sourceRepositoryName}/branches",
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
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    id: S.String.pipe(T.HttpLabel("id")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/workflows/{id}",
    }),
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
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortBy: S.optional(WorkflowSortCriteriaList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/workflows",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartWorkflowRunRequest extends S.Class<StartWorkflowRunRequest>(
  "StartWorkflowRunRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/workflowRuns",
    }),
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
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    id: S.String.pipe(T.HttpLabel("id")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/workflowRuns/{id}",
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
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    workflowId: S.optional(S.String).pipe(T.HttpQuery("workflowId")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortBy: S.optional(WorkflowRunSortCriteriaList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/workflowRuns",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSubscriptionRequest extends S.Class<GetSubscriptionRequest>(
  "GetSubscriptionRequest",
)(
  { spaceName: S.String.pipe(T.HttpLabel("spaceName")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/spaces/{spaceName}/subscription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StringList = S.Array(S.String);
export class Filter extends S.Class<Filter>("Filter")({
  key: S.String,
  values: StringList,
  comparisonOperator: S.optional(S.String),
}) {}
export const Filters = S.Array(Filter);
export class ProjectListFilter extends S.Class<ProjectListFilter>(
  "ProjectListFilter",
)({
  key: S.String,
  values: StringList,
  comparisonOperator: S.optional(S.String),
}) {}
export const ProjectListFilters = S.Array(ProjectListFilter);
export class RepositoryInput extends S.Class<RepositoryInput>(
  "RepositoryInput",
)({ repositoryName: S.String, branchName: S.optional(S.String) }) {}
export const RepositoriesInput = S.Array(RepositoryInput);
export class PersistentStorageConfiguration extends S.Class<PersistentStorageConfiguration>(
  "PersistentStorageConfiguration",
)({ sizeInGiB: S.Number }) {}
export class WorkflowRunStatusReason extends S.Class<WorkflowRunStatusReason>(
  "WorkflowRunStatusReason",
)({}) {}
export const WorkflowRunStatusReasons = S.Array(WorkflowRunStatusReason);
export const ExecuteCommandSessionConfigurationArguments = S.Array(S.String);
export class CreateAccessTokenResponse extends S.Class<CreateAccessTokenResponse>(
  "CreateAccessTokenResponse",
)({
  secret: S.String,
  name: S.String,
  expiresTime: S.Date.pipe(T.TimestampFormat("date-time")),
  accessTokenId: S.String,
}) {}
export class GetSpaceResponse extends S.Class<GetSpaceResponse>(
  "GetSpaceResponse",
)({
  name: S.String,
  regionName: S.String,
  displayName: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class UpdateSpaceResponse extends S.Class<UpdateSpaceResponse>(
  "UpdateSpaceResponse",
)({
  name: S.optional(S.String),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class DeleteSpaceResponse extends S.Class<DeleteSpaceResponse>(
  "DeleteSpaceResponse",
)({ name: S.String, displayName: S.optional(S.String) }) {}
export class ListDevEnvironmentsRequest extends S.Class<ListDevEnvironmentsRequest>(
  "ListDevEnvironmentsRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.optional(S.String),
    filters: S.optional(Filters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/spaces/{spaceName}/devEnvironments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProjectResponse extends S.Class<CreateProjectResponse>(
  "CreateProjectResponse",
)({
  spaceName: S.optional(S.String),
  name: S.String,
  displayName: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class GetProjectResponse extends S.Class<GetProjectResponse>(
  "GetProjectResponse",
)({
  spaceName: S.optional(S.String),
  name: S.String,
  displayName: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class UpdateProjectResponse extends S.Class<UpdateProjectResponse>(
  "UpdateProjectResponse",
)({
  spaceName: S.optional(S.String),
  name: S.optional(S.String),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class DeleteProjectResponse extends S.Class<DeleteProjectResponse>(
  "DeleteProjectResponse",
)({ spaceName: S.String, name: S.String, displayName: S.optional(S.String) }) {}
export class ListProjectsRequest extends S.Class<ListProjectsRequest>(
  "ListProjectsRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(ProjectListFilters),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/spaces/{spaceName}/projects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDevEnvironmentRequest extends S.Class<CreateDevEnvironmentRequest>(
  "CreateDevEnvironmentRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    repositories: S.optional(RepositoriesInput),
    clientToken: S.optional(S.String),
    alias: S.optional(S.String),
    ides: S.optional(IdeConfigurationList),
    instanceType: S.String,
    inactivityTimeoutMinutes: S.optional(S.Number),
    persistentStorage: PersistentStorageConfiguration,
    vpcConnectionName: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/devEnvironments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDevEnvironmentResponse extends S.Class<UpdateDevEnvironmentResponse>(
  "UpdateDevEnvironmentResponse",
)({
  id: S.String,
  spaceName: S.String,
  projectName: S.String,
  alias: S.optional(S.String),
  ides: S.optional(IdeConfigurationList),
  instanceType: S.optional(S.String),
  inactivityTimeoutMinutes: S.optional(S.Number),
  clientToken: S.optional(S.String),
}) {}
export class DeleteDevEnvironmentResponse extends S.Class<DeleteDevEnvironmentResponse>(
  "DeleteDevEnvironmentResponse",
)({ spaceName: S.String, projectName: S.String, id: S.String }) {}
export class StartDevEnvironmentResponse extends S.Class<StartDevEnvironmentResponse>(
  "StartDevEnvironmentResponse",
)({
  spaceName: S.String,
  projectName: S.String,
  id: S.String,
  status: S.String,
}) {}
export class StopDevEnvironmentResponse extends S.Class<StopDevEnvironmentResponse>(
  "StopDevEnvironmentResponse",
)({
  spaceName: S.String,
  projectName: S.String,
  id: S.String,
  status: S.String,
}) {}
export class StopDevEnvironmentSessionResponse extends S.Class<StopDevEnvironmentSessionResponse>(
  "StopDevEnvironmentSessionResponse",
)({
  spaceName: S.String,
  projectName: S.String,
  id: S.String,
  sessionId: S.String,
}) {}
export class CreateSourceRepositoryResponse extends S.Class<CreateSourceRepositoryResponse>(
  "CreateSourceRepositoryResponse",
)({
  spaceName: S.String,
  projectName: S.String,
  name: S.String,
  description: S.optional(S.String),
}) {}
export class GetSourceRepositoryResponse extends S.Class<GetSourceRepositoryResponse>(
  "GetSourceRepositoryResponse",
)({
  spaceName: S.String,
  projectName: S.String,
  name: S.String,
  description: S.optional(S.String),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class DeleteSourceRepositoryResponse extends S.Class<DeleteSourceRepositoryResponse>(
  "DeleteSourceRepositoryResponse",
)({ spaceName: S.String, projectName: S.String, name: S.String }) {}
export class GetSourceRepositoryCloneUrlsResponse extends S.Class<GetSourceRepositoryCloneUrlsResponse>(
  "GetSourceRepositoryCloneUrlsResponse",
)({ https: S.String }) {}
export class CreateSourceRepositoryBranchResponse extends S.Class<CreateSourceRepositoryBranchResponse>(
  "CreateSourceRepositoryBranchResponse",
)({
  ref: S.optional(S.String),
  name: S.optional(S.String),
  lastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  headCommitId: S.optional(S.String),
}) {}
export class StartWorkflowRunResponse extends S.Class<StartWorkflowRunResponse>(
  "StartWorkflowRunResponse",
)({
  spaceName: S.String,
  projectName: S.String,
  id: S.String,
  workflowId: S.String,
}) {}
export class GetWorkflowRunResponse extends S.Class<GetWorkflowRunResponse>(
  "GetWorkflowRunResponse",
)({
  spaceName: S.String,
  projectName: S.String,
  id: S.String,
  workflowId: S.String,
  status: S.String,
  statusReasons: S.optional(WorkflowRunStatusReasons),
  startTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetSubscriptionResponse extends S.Class<GetSubscriptionResponse>(
  "GetSubscriptionResponse",
)({
  subscriptionType: S.optional(S.String),
  awsAccountName: S.optional(S.String),
  pendingSubscriptionType: S.optional(S.String),
  pendingSubscriptionStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class ExecuteCommandSessionConfiguration extends S.Class<ExecuteCommandSessionConfiguration>(
  "ExecuteCommandSessionConfiguration",
)({
  command: S.String,
  arguments: S.optional(ExecuteCommandSessionConfigurationArguments),
}) {}
export class EmailAddress extends S.Class<EmailAddress>("EmailAddress")({
  email: S.optional(S.String),
  verified: S.optional(S.Boolean),
}) {}
export class AccessTokenSummary extends S.Class<AccessTokenSummary>(
  "AccessTokenSummary",
)({
  id: S.String,
  name: S.String,
  expiresTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const AccessTokenSummaries = S.Array(AccessTokenSummary);
export class SpaceSummary extends S.Class<SpaceSummary>("SpaceSummary")({
  name: S.String,
  regionName: S.String,
  displayName: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export const SpaceSummaries = S.Array(SpaceSummary);
export class DevEnvironmentRepositorySummary extends S.Class<DevEnvironmentRepositorySummary>(
  "DevEnvironmentRepositorySummary",
)({ repositoryName: S.String, branchName: S.optional(S.String) }) {}
export const DevEnvironmentRepositorySummaries = S.Array(
  DevEnvironmentRepositorySummary,
);
export class Ide extends S.Class<Ide>("Ide")({
  runtime: S.optional(S.String),
  name: S.optional(S.String),
}) {}
export const Ides = S.Array(Ide);
export class PersistentStorage extends S.Class<PersistentStorage>(
  "PersistentStorage",
)({ sizeInGiB: S.Number }) {}
export class DevEnvironmentSessionSummary extends S.Class<DevEnvironmentSessionSummary>(
  "DevEnvironmentSessionSummary",
)({
  spaceName: S.String,
  projectName: S.String,
  devEnvironmentId: S.String,
  startedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  id: S.String,
}) {}
export const DevEnvironmentSessionsSummaryList = S.Array(
  DevEnvironmentSessionSummary,
);
export class DevEnvironmentSessionConfiguration extends S.Class<DevEnvironmentSessionConfiguration>(
  "DevEnvironmentSessionConfiguration",
)({
  sessionType: S.String,
  executeCommandSessionConfiguration: S.optional(
    ExecuteCommandSessionConfiguration,
  ),
}) {}
export class ListSourceRepositoriesItem extends S.Class<ListSourceRepositoriesItem>(
  "ListSourceRepositoriesItem",
)({
  id: S.String,
  name: S.String,
  description: S.optional(S.String),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListSourceRepositoriesItems = S.Array(ListSourceRepositoriesItem);
export class ListSourceRepositoryBranchesItem extends S.Class<ListSourceRepositoryBranchesItem>(
  "ListSourceRepositoryBranchesItem",
)({
  ref: S.optional(S.String),
  name: S.optional(S.String),
  lastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  headCommitId: S.optional(S.String),
}) {}
export const ListSourceRepositoryBranchesItems = S.Array(
  ListSourceRepositoryBranchesItem,
);
export class WorkflowDefinition extends S.Class<WorkflowDefinition>(
  "WorkflowDefinition",
)({ path: S.String }) {}
export class WorkflowRunSummary extends S.Class<WorkflowRunSummary>(
  "WorkflowRunSummary",
)({
  id: S.String,
  workflowId: S.String,
  workflowName: S.String,
  status: S.String,
  statusReasons: S.optional(WorkflowRunStatusReasons),
  startTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const WorkflowRunSummaries = S.Array(WorkflowRunSummary);
export class GetUserDetailsResponse extends S.Class<GetUserDetailsResponse>(
  "GetUserDetailsResponse",
)({
  userId: S.optional(S.String),
  userName: S.optional(S.String),
  displayName: S.optional(S.String),
  primaryEmail: S.optional(EmailAddress),
  version: S.optional(S.String),
}) {}
export class ListAccessTokensResponse extends S.Class<ListAccessTokensResponse>(
  "ListAccessTokensResponse",
)({ items: AccessTokenSummaries, nextToken: S.optional(S.String) }) {}
export class ListSpacesResponse extends S.Class<ListSpacesResponse>(
  "ListSpacesResponse",
)({ nextToken: S.optional(S.String), items: S.optional(SpaceSummaries) }) {}
export class CreateDevEnvironmentResponse extends S.Class<CreateDevEnvironmentResponse>(
  "CreateDevEnvironmentResponse",
)({
  spaceName: S.String,
  projectName: S.String,
  id: S.String,
  vpcConnectionName: S.optional(S.String),
}) {}
export class GetDevEnvironmentResponse extends S.Class<GetDevEnvironmentResponse>(
  "GetDevEnvironmentResponse",
)({
  spaceName: S.String,
  projectName: S.String,
  id: S.String,
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  creatorId: S.String,
  status: S.String,
  statusReason: S.optional(S.String),
  repositories: DevEnvironmentRepositorySummaries,
  alias: S.optional(S.String),
  ides: S.optional(Ides),
  instanceType: S.String,
  inactivityTimeoutMinutes: S.Number,
  persistentStorage: PersistentStorage,
  vpcConnectionName: S.optional(S.String),
}) {}
export class ListDevEnvironmentSessionsResponse extends S.Class<ListDevEnvironmentSessionsResponse>(
  "ListDevEnvironmentSessionsResponse",
)({
  items: DevEnvironmentSessionsSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class StartDevEnvironmentSessionRequest extends S.Class<StartDevEnvironmentSessionRequest>(
  "StartDevEnvironmentSessionRequest",
)(
  {
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
    sessionConfiguration: DevEnvironmentSessionConfiguration,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/spaces/{spaceName}/projects/{projectName}/devEnvironments/{id}/session",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSourceRepositoriesResponse extends S.Class<ListSourceRepositoriesResponse>(
  "ListSourceRepositoriesResponse",
)({
  items: S.optional(ListSourceRepositoriesItems),
  nextToken: S.optional(S.String),
}) {}
export class ListSourceRepositoryBranchesResponse extends S.Class<ListSourceRepositoryBranchesResponse>(
  "ListSourceRepositoryBranchesResponse",
)({
  nextToken: S.optional(S.String),
  items: ListSourceRepositoryBranchesItems,
}) {}
export class GetWorkflowResponse extends S.Class<GetWorkflowResponse>(
  "GetWorkflowResponse",
)({
  spaceName: S.String,
  projectName: S.String,
  id: S.String,
  name: S.String,
  sourceRepositoryName: S.optional(S.String),
  sourceBranchName: S.optional(S.String),
  definition: WorkflowDefinition,
  createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  runMode: S.String,
  status: S.String,
}) {}
export class ListWorkflowRunsResponse extends S.Class<ListWorkflowRunsResponse>(
  "ListWorkflowRunsResponse",
)({
  nextToken: S.optional(S.String),
  items: S.optional(WorkflowRunSummaries),
}) {}
export class UserIdentity extends S.Class<UserIdentity>("UserIdentity")({
  userType: S.String,
  principalId: S.String,
  userName: S.optional(S.String),
  awsAccountId: S.optional(S.String),
}) {}
export class ProjectInformation extends S.Class<ProjectInformation>(
  "ProjectInformation",
)({ name: S.optional(S.String), projectId: S.optional(S.String) }) {}
export class EventPayload extends S.Class<EventPayload>("EventPayload")({
  contentType: S.optional(S.String),
  data: S.optional(S.String),
}) {}
export class WorkflowDefinitionSummary extends S.Class<WorkflowDefinitionSummary>(
  "WorkflowDefinitionSummary",
)({ path: S.String }) {}
export class DevEnvironmentSummary extends S.Class<DevEnvironmentSummary>(
  "DevEnvironmentSummary",
)({
  spaceName: S.optional(S.String),
  projectName: S.optional(S.String),
  id: S.String,
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  creatorId: S.String,
  status: S.String,
  statusReason: S.optional(S.String),
  repositories: DevEnvironmentRepositorySummaries,
  alias: S.optional(S.String),
  ides: S.optional(Ides),
  instanceType: S.String,
  inactivityTimeoutMinutes: S.Number,
  persistentStorage: PersistentStorage,
  vpcConnectionName: S.optional(S.String),
}) {}
export const DevEnvironmentSummaryList = S.Array(DevEnvironmentSummary);
export class EventLogEntry extends S.Class<EventLogEntry>("EventLogEntry")({
  id: S.String,
  eventName: S.String,
  eventType: S.String,
  eventCategory: S.String,
  eventSource: S.String,
  eventTime: S.Date.pipe(T.TimestampFormat("date-time")),
  operationType: S.String,
  userIdentity: UserIdentity,
  projectInformation: S.optional(ProjectInformation),
  requestId: S.optional(S.String),
  requestPayload: S.optional(EventPayload),
  responsePayload: S.optional(EventPayload),
  errorCode: S.optional(S.String),
  sourceIpAddress: S.optional(S.String),
  userAgent: S.optional(S.String),
}) {}
export const EventLogEntries = S.Array(EventLogEntry);
export class ProjectSummary extends S.Class<ProjectSummary>("ProjectSummary")({
  name: S.String,
  displayName: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export const ProjectSummaries = S.Array(ProjectSummary);
export class WorkflowSummary extends S.Class<WorkflowSummary>(
  "WorkflowSummary",
)({
  id: S.String,
  name: S.String,
  sourceRepositoryName: S.String,
  sourceBranchName: S.String,
  definition: WorkflowDefinitionSummary,
  createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  runMode: S.String,
  status: S.String,
}) {}
export const WorkflowSummaries = S.Array(WorkflowSummary);
export class ListDevEnvironmentsResponse extends S.Class<ListDevEnvironmentsResponse>(
  "ListDevEnvironmentsResponse",
)({ items: DevEnvironmentSummaryList, nextToken: S.optional(S.String) }) {}
export class ListEventLogsResponse extends S.Class<ListEventLogsResponse>(
  "ListEventLogsResponse",
)({ nextToken: S.optional(S.String), items: EventLogEntries }) {}
export class ListProjectsResponse extends S.Class<ListProjectsResponse>(
  "ListProjectsResponse",
)({ nextToken: S.optional(S.String), items: S.optional(ProjectSummaries) }) {}
export class ListWorkflowsResponse extends S.Class<ListWorkflowsResponse>(
  "ListWorkflowsResponse",
)({ nextToken: S.optional(S.String), items: S.optional(WorkflowSummaries) }) {}
export class DevEnvironmentAccessDetails extends S.Class<DevEnvironmentAccessDetails>(
  "DevEnvironmentAccessDetails",
)({ streamUrl: S.String, tokenValue: S.String }) {}
export class StartDevEnvironmentSessionResponse extends S.Class<StartDevEnvironmentSessionResponse>(
  "StartDevEnvironmentSessionResponse",
)({
  accessDetails: DevEnvironmentAccessDetails,
  sessionId: S.optional(S.String),
  spaceName: S.String,
  projectName: S.String,
  id: S.String,
}) {}

//# Errors

//# Operations
/**
 * Verifies whether the calling user has a valid Amazon CodeCatalyst login and session. If successful, this returns the ID of the user in Amazon CodeCatalyst.
 */
export const verifySession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifySessionRequest,
  output: VerifySessionResponse,
  errors: [],
}));
/**
 * Deletes a specified personal access token (PAT). A personal access token can only be deleted by the user who created it.
 */
export const deleteAccessToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessTokenRequest,
  output: DeleteAccessTokenResponse,
  errors: [],
}));
/**
 * Creates a personal access token (PAT) for the current user. A personal access token (PAT) is similar to a password.
 * It is associated with your user identity for use across all spaces and projects in Amazon CodeCatalyst. You use PATs to access CodeCatalyst
 * from resources that include integrated development environments (IDEs) and Git-based source repositories.
 * PATs represent you in Amazon CodeCatalyst and you can manage them in your user settings.For more information, see
 * Managing personal access tokens in Amazon CodeCatalyst.
 */
export const createAccessToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessTokenRequest,
  output: CreateAccessTokenResponse,
  errors: [],
}));
/**
 * Returns information about an space.
 */
export const getSpace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSpaceRequest,
  output: GetSpaceResponse,
  errors: [],
}));
/**
 * Changes one or more values for a space.
 */
export const updateSpace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSpaceRequest,
  output: UpdateSpaceResponse,
  errors: [],
}));
/**
 * Deletes a space.
 *
 * Deleting a space cannot be undone. Additionally, since space names must be unique across Amazon CodeCatalyst, you cannot reuse names of deleted spaces.
 */
export const deleteSpace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSpaceRequest,
  output: DeleteSpaceResponse,
  errors: [],
}));
/**
 * Creates a project in a specified space.
 */
export const createProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectRequest,
  output: CreateProjectResponse,
  errors: [],
}));
/**
 * Returns information about a project.
 */
export const getProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProjectRequest,
  output: GetProjectResponse,
  errors: [],
}));
/**
 * Changes one or more values for a project.
 */
export const updateProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectRequest,
  output: UpdateProjectResponse,
  errors: [],
}));
/**
 * Deletes a project in a space.
 */
export const deleteProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResponse,
  errors: [],
}));
/**
 * Changes one or more values for a Dev Environment. Updating certain values of the Dev Environment will cause a restart.
 */
export const updateDevEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDevEnvironmentRequest,
    output: UpdateDevEnvironmentResponse,
    errors: [],
  }),
);
/**
 * Deletes a Dev Environment.
 */
export const deleteDevEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDevEnvironmentRequest,
    output: DeleteDevEnvironmentResponse,
    errors: [],
  }),
);
/**
 * Starts a specified Dev Environment and puts it into an active state.
 */
export const startDevEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDevEnvironmentRequest,
  output: StartDevEnvironmentResponse,
  errors: [],
}));
/**
 * Pauses a specified Dev Environment and places it in a non-running state. Stopped Dev Environments do not consume compute minutes.
 */
export const stopDevEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDevEnvironmentRequest,
  output: StopDevEnvironmentResponse,
  errors: [],
}));
/**
 * Stops a session for a specified Dev Environment.
 */
export const stopDevEnvironmentSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopDevEnvironmentSessionRequest,
    output: StopDevEnvironmentSessionResponse,
    errors: [],
  }),
);
/**
 * Creates an empty Git-based source repository in a specified project. The repository is
 * created with an initial empty commit with a default branch named `main`.
 */
export const createSourceRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSourceRepositoryRequest,
    output: CreateSourceRepositoryResponse,
    errors: [],
  }),
);
/**
 * Returns information about a source repository.
 */
export const getSourceRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSourceRepositoryRequest,
  output: GetSourceRepositoryResponse,
  errors: [],
}));
/**
 * Deletes a source repository in Amazon CodeCatalyst. You cannot use this API to delete a linked repository. It can only be used to delete a Amazon CodeCatalyst source repository.
 */
export const deleteSourceRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSourceRepositoryRequest,
    output: DeleteSourceRepositoryResponse,
    errors: [],
  }),
);
/**
 * Returns information about the URLs that can be used with a Git client to clone a source
 * repository.
 */
export const getSourceRepositoryCloneUrls =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSourceRepositoryCloneUrlsRequest,
    output: GetSourceRepositoryCloneUrlsResponse,
    errors: [],
  }));
/**
 * Creates a branch in a specified source repository in Amazon CodeCatalyst.
 *
 * This API only creates a branch in a source repository hosted in Amazon CodeCatalyst. You cannot use this API to create a branch in a linked repository.
 */
export const createSourceRepositoryBranch =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateSourceRepositoryBranchRequest,
    output: CreateSourceRepositoryBranchResponse,
    errors: [],
  }));
/**
 * Begins a run of a specified workflow.
 */
export const startWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartWorkflowRunRequest,
  output: StartWorkflowRunResponse,
  errors: [],
}));
/**
 * Returns information about a specified run of a workflow.
 */
export const getWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRunRequest,
  output: GetWorkflowRunResponse,
  errors: [],
}));
/**
 * Returns information about the Amazon Web Services account used for billing purposes
 * and the billing plan for the space.
 */
export const getSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSubscriptionRequest,
  output: GetSubscriptionResponse,
  errors: [],
}));
/**
 * Returns information about a user.
 */
export const getUserDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserDetailsRequest,
  output: GetUserDetailsResponse,
  errors: [],
}));
/**
 * Lists all personal access tokens (PATs) associated with the user who calls the API. You can only list PATs associated with your Amazon Web Services Builder ID.
 */
export const listAccessTokens = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccessTokensRequest,
  output: ListAccessTokensResponse,
  errors: [],
}));
/**
 * Retrieves a list of spaces.
 */
export const listSpaces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSpacesRequest,
  output: ListSpacesResponse,
  errors: [],
}));
/**
 * Creates a Dev Environment in Amazon CodeCatalyst, a cloud-based development environment that you can use to quickly work on the code stored
 * in the source repositories of your project.
 *
 * When created in the Amazon CodeCatalyst console, by default a Dev Environment is configured to have a 2 core processor, 4GB of RAM, and 16GB of persistent storage. None of these
 * defaults apply to a Dev Environment created programmatically.
 */
export const createDevEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDevEnvironmentRequest,
    output: CreateDevEnvironmentResponse,
    errors: [],
  }),
);
/**
 * Returns information about a Dev Environment for a source repository in a project. Dev Environments are specific to the user who creates them.
 */
export const getDevEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDevEnvironmentRequest,
  output: GetDevEnvironmentResponse,
  errors: [],
}));
/**
 * Retrieves a list of active sessions for a Dev Environment in a project.
 */
export const listDevEnvironmentSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDevEnvironmentSessionsRequest,
    output: ListDevEnvironmentSessionsResponse,
    errors: [],
  }),
);
/**
 * Retrieves a list of source repositories in a project.
 */
export const listSourceRepositories = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSourceRepositoriesRequest,
    output: ListSourceRepositoriesResponse,
    errors: [],
  }),
);
/**
 * Retrieves a list of branches in a specified source repository.
 */
export const listSourceRepositoryBranches =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListSourceRepositoryBranchesRequest,
    output: ListSourceRepositoryBranchesResponse,
    errors: [],
  }));
/**
 * Returns information about a workflow.
 */
export const getWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRequest,
  output: GetWorkflowResponse,
  errors: [],
}));
/**
 * Retrieves a list of workflow runs of a specified workflow.
 */
export const listWorkflowRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWorkflowRunsRequest,
  output: ListWorkflowRunsResponse,
  errors: [],
}));
/**
 * Retrieves a list of Dev Environments in a project.
 */
export const listDevEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDevEnvironmentsRequest,
  output: ListDevEnvironmentsResponse,
  errors: [],
}));
/**
 * Retrieves a list of events that occurred during a specific time in a space. You can
 * use these events to audit user and system activity in a space. For more information, see
 * Monitoring in the *Amazon CodeCatalyst User Guide*.
 *
 * ListEventLogs guarantees events for the last 30 days in a given space. You can also
 * view and retrieve a list of management events over the last 90 days for Amazon CodeCatalyst in the
 * CloudTrail console by viewing Event history, or by creating a trail to create
 * and maintain a record of events that extends past 90 days. For more information, see Working with CloudTrail Event History and Working with
 * CloudTrail trails.
 */
export const listEventLogs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEventLogsRequest,
  output: ListEventLogsResponse,
  errors: [],
}));
/**
 * Retrieves a list of projects.
 */
export const listProjects = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProjectsRequest,
  output: ListProjectsResponse,
  errors: [],
}));
/**
 * Retrieves a list of workflows in a specified project.
 */
export const listWorkflows = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWorkflowsRequest,
  output: ListWorkflowsResponse,
  errors: [],
}));
/**
 * Starts a session for a specified Dev Environment.
 */
export const startDevEnvironmentSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartDevEnvironmentSessionRequest,
    output: StartDevEnvironmentSessionResponse,
    errors: [],
  }),
);
