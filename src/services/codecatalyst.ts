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

//# Newtypes
export type AccessTokenName = string;
export type AccessTokenId = string;
export type NameString = string;
export type SpaceDescription = string;
export type ProjectDisplayName = string;
export type ProjectDescription = string;
export type ClientToken = string;
export type InstanceType = string;
export type InactivityTimeoutMinutes = number;
export type Uuid = string;
export type SourceRepositoryNameString = string;
export type SourceRepositoryDescriptionString = string;
export type SourceRepositoryBranchString = string;
export type FilterKey = string;
export type ComparisonOperator = string;
export type DevEnvironmentSessionType = string;
export type AccessTokenSecret = string | Redacted.Redacted<string>;
export type RegionString = string;
export type DevEnvironmentStatus = string;
export type StatusReason = string;
export type SourceRepositoryBranchRefString = string;
export type WorkflowRunMode = string;
export type WorkflowStatus = string;
export type WorkflowRunStatus = string;
export type OperationType = string;
export type SourceRepositoryIdString = string;
export type UserType = string;
export type SensitiveString = string | Redacted.Redacted<string>;

//# Schemas
export interface VerifySessionRequest {}
export const VerifySessionRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "VerifySessionRequest",
}) as any as S.Schema<VerifySessionRequest>;
export interface WorkflowSortCriteria {}
export const WorkflowSortCriteria = S.suspend(() => S.Struct({})).annotations({
  identifier: "WorkflowSortCriteria",
}) as any as S.Schema<WorkflowSortCriteria>;
export type WorkflowSortCriteriaList = WorkflowSortCriteria[];
export const WorkflowSortCriteriaList = S.Array(WorkflowSortCriteria);
export interface WorkflowRunSortCriteria {}
export const WorkflowRunSortCriteria = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "WorkflowRunSortCriteria",
}) as any as S.Schema<WorkflowRunSortCriteria>;
export type WorkflowRunSortCriteriaList = WorkflowRunSortCriteria[];
export const WorkflowRunSortCriteriaList = S.Array(WorkflowRunSortCriteria);
export interface GetUserDetailsRequest {
  id?: string;
  userName?: string;
}
export const GetUserDetailsRequest = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String).pipe(T.HttpQuery("id")),
    userName: S.optional(S.String).pipe(T.HttpQuery("userName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/userDetails" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUserDetailsRequest",
}) as any as S.Schema<GetUserDetailsRequest>;
export interface VerifySessionResponse {
  identity?: string;
}
export const VerifySessionResponse = S.suspend(() =>
  S.Struct({ identity: S.optional(S.String) }),
).annotations({
  identifier: "VerifySessionResponse",
}) as any as S.Schema<VerifySessionResponse>;
export interface CreateAccessTokenRequest {
  name: string;
  expiresTime?: Date;
}
export const CreateAccessTokenRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    expiresTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/accessTokens" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAccessTokenRequest",
}) as any as S.Schema<CreateAccessTokenRequest>;
export interface DeleteAccessTokenRequest {
  id: string;
}
export const DeleteAccessTokenRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/accessTokens/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAccessTokenRequest",
}) as any as S.Schema<DeleteAccessTokenRequest>;
export interface DeleteAccessTokenResponse {}
export const DeleteAccessTokenResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccessTokenResponse",
}) as any as S.Schema<DeleteAccessTokenResponse>;
export interface ListAccessTokensRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListAccessTokensRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/accessTokens" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccessTokensRequest",
}) as any as S.Schema<ListAccessTokensRequest>;
export interface GetSpaceRequest {
  name: string;
}
export const GetSpaceRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/spaces/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSpaceRequest",
}) as any as S.Schema<GetSpaceRequest>;
export interface UpdateSpaceRequest {
  name: string;
  description?: string;
}
export const UpdateSpaceRequest = S.suspend(() =>
  S.Struct({
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v1/spaces/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSpaceRequest",
}) as any as S.Schema<UpdateSpaceRequest>;
export interface DeleteSpaceRequest {
  name: string;
}
export const DeleteSpaceRequest = S.suspend(() =>
  S.Struct({ name: S.String.pipe(T.HttpLabel("name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/spaces/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSpaceRequest",
}) as any as S.Schema<DeleteSpaceRequest>;
export interface ListSpacesRequest {
  nextToken?: string;
}
export const ListSpacesRequest = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/spaces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSpacesRequest",
}) as any as S.Schema<ListSpacesRequest>;
export interface ListEventLogsRequest {
  spaceName: string;
  startTime: Date;
  endTime: Date;
  eventName?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListEventLogsRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
    eventName: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/spaces/{spaceName}/eventLogs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventLogsRequest",
}) as any as S.Schema<ListEventLogsRequest>;
export interface CreateProjectRequest {
  spaceName: string;
  displayName: string;
  description?: string;
}
export const CreateProjectRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    displayName: S.String,
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/spaces/{spaceName}/projects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProjectRequest",
}) as any as S.Schema<CreateProjectRequest>;
export interface GetProjectRequest {
  spaceName: string;
  name: string;
}
export const GetProjectRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/spaces/{spaceName}/projects/{name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProjectRequest",
}) as any as S.Schema<GetProjectRequest>;
export interface UpdateProjectRequest {
  spaceName: string;
  name: string;
  description?: string;
}
export const UpdateProjectRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v1/spaces/{spaceName}/projects/{name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProjectRequest",
}) as any as S.Schema<UpdateProjectRequest>;
export interface DeleteProjectRequest {
  spaceName: string;
  name: string;
}
export const DeleteProjectRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/spaces/{spaceName}/projects/{name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProjectRequest",
}) as any as S.Schema<DeleteProjectRequest>;
export interface GetDevEnvironmentRequest {
  spaceName: string;
  projectName: string;
  id: string;
}
export const GetDevEnvironmentRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDevEnvironmentRequest",
}) as any as S.Schema<GetDevEnvironmentRequest>;
export interface IdeConfiguration {
  runtime?: string;
  name?: string;
}
export const IdeConfiguration = S.suspend(() =>
  S.Struct({ runtime: S.optional(S.String), name: S.optional(S.String) }),
).annotations({
  identifier: "IdeConfiguration",
}) as any as S.Schema<IdeConfiguration>;
export type IdeConfigurationList = IdeConfiguration[];
export const IdeConfigurationList = S.Array(IdeConfiguration);
export interface UpdateDevEnvironmentRequest {
  spaceName: string;
  projectName: string;
  id: string;
  alias?: string;
  ides?: IdeConfigurationList;
  instanceType?: string;
  inactivityTimeoutMinutes?: number;
  clientToken?: string;
}
export const UpdateDevEnvironmentRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
    alias: S.optional(S.String),
    ides: S.optional(IdeConfigurationList),
    instanceType: S.optional(S.String),
    inactivityTimeoutMinutes: S.optional(S.Number),
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateDevEnvironmentRequest",
}) as any as S.Schema<UpdateDevEnvironmentRequest>;
export interface DeleteDevEnvironmentRequest {
  spaceName: string;
  projectName: string;
  id: string;
}
export const DeleteDevEnvironmentRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteDevEnvironmentRequest",
}) as any as S.Schema<DeleteDevEnvironmentRequest>;
export interface ListDevEnvironmentSessionsRequest {
  spaceName: string;
  projectName: string;
  devEnvironmentId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDevEnvironmentSessionsRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    devEnvironmentId: S.String.pipe(T.HttpLabel("devEnvironmentId")),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDevEnvironmentSessionsRequest",
}) as any as S.Schema<ListDevEnvironmentSessionsRequest>;
export interface StartDevEnvironmentRequest {
  spaceName: string;
  projectName: string;
  id: string;
  ides?: IdeConfigurationList;
  instanceType?: string;
  inactivityTimeoutMinutes?: number;
}
export const StartDevEnvironmentRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
    ides: S.optional(IdeConfigurationList),
    instanceType: S.optional(S.String),
    inactivityTimeoutMinutes: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartDevEnvironmentRequest",
}) as any as S.Schema<StartDevEnvironmentRequest>;
export interface StopDevEnvironmentRequest {
  spaceName: string;
  projectName: string;
  id: string;
}
export const StopDevEnvironmentRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopDevEnvironmentRequest",
}) as any as S.Schema<StopDevEnvironmentRequest>;
export interface StopDevEnvironmentSessionRequest {
  spaceName: string;
  projectName: string;
  id: string;
  sessionId: string;
}
export const StopDevEnvironmentSessionRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopDevEnvironmentSessionRequest",
}) as any as S.Schema<StopDevEnvironmentSessionRequest>;
export interface CreateSourceRepositoryRequest {
  spaceName: string;
  projectName: string;
  name: string;
  description?: string;
}
export const CreateSourceRepositoryRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    name: S.String.pipe(T.HttpLabel("name")),
    description: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateSourceRepositoryRequest",
}) as any as S.Schema<CreateSourceRepositoryRequest>;
export interface GetSourceRepositoryRequest {
  spaceName: string;
  projectName: string;
  name: string;
}
export const GetSourceRepositoryRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSourceRepositoryRequest",
}) as any as S.Schema<GetSourceRepositoryRequest>;
export interface DeleteSourceRepositoryRequest {
  spaceName: string;
  projectName: string;
  name: string;
}
export const DeleteSourceRepositoryRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteSourceRepositoryRequest",
}) as any as S.Schema<DeleteSourceRepositoryRequest>;
export interface ListSourceRepositoriesRequest {
  spaceName: string;
  projectName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSourceRepositoriesRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListSourceRepositoriesRequest",
}) as any as S.Schema<ListSourceRepositoriesRequest>;
export interface GetSourceRepositoryCloneUrlsRequest {
  spaceName: string;
  projectName: string;
  sourceRepositoryName: string;
}
export const GetSourceRepositoryCloneUrlsRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    sourceRepositoryName: S.String.pipe(T.HttpLabel("sourceRepositoryName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSourceRepositoryCloneUrlsRequest",
}) as any as S.Schema<GetSourceRepositoryCloneUrlsRequest>;
export interface CreateSourceRepositoryBranchRequest {
  spaceName: string;
  projectName: string;
  sourceRepositoryName: string;
  name: string;
  headCommitId?: string;
}
export const CreateSourceRepositoryBranchRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    sourceRepositoryName: S.String.pipe(T.HttpLabel("sourceRepositoryName")),
    name: S.String.pipe(T.HttpLabel("name")),
    headCommitId: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateSourceRepositoryBranchRequest",
}) as any as S.Schema<CreateSourceRepositoryBranchRequest>;
export interface ListSourceRepositoryBranchesRequest {
  spaceName: string;
  projectName: string;
  sourceRepositoryName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSourceRepositoryBranchesRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    sourceRepositoryName: S.String.pipe(T.HttpLabel("sourceRepositoryName")),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListSourceRepositoryBranchesRequest",
}) as any as S.Schema<ListSourceRepositoryBranchesRequest>;
export interface GetWorkflowRequest {
  spaceName: string;
  id: string;
  projectName: string;
}
export const GetWorkflowRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    id: S.String.pipe(T.HttpLabel("id")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetWorkflowRequest",
}) as any as S.Schema<GetWorkflowRequest>;
export interface ListWorkflowsRequest {
  spaceName: string;
  projectName: string;
  nextToken?: string;
  maxResults?: number;
  sortBy?: WorkflowSortCriteriaList;
}
export const ListWorkflowsRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortBy: S.optional(WorkflowSortCriteriaList),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListWorkflowsRequest",
}) as any as S.Schema<ListWorkflowsRequest>;
export interface StartWorkflowRunRequest {
  spaceName: string;
  projectName: string;
  workflowId: string;
  clientToken?: string;
}
export const StartWorkflowRunRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartWorkflowRunRequest",
}) as any as S.Schema<StartWorkflowRunRequest>;
export interface GetWorkflowRunRequest {
  spaceName: string;
  id: string;
  projectName: string;
}
export const GetWorkflowRunRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    id: S.String.pipe(T.HttpLabel("id")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetWorkflowRunRequest",
}) as any as S.Schema<GetWorkflowRunRequest>;
export interface ListWorkflowRunsRequest {
  spaceName: string;
  workflowId?: string;
  projectName: string;
  nextToken?: string;
  maxResults?: number;
  sortBy?: WorkflowRunSortCriteriaList;
}
export const ListWorkflowRunsRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    workflowId: S.optional(S.String).pipe(T.HttpQuery("workflowId")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    sortBy: S.optional(WorkflowRunSortCriteriaList),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListWorkflowRunsRequest",
}) as any as S.Schema<ListWorkflowRunsRequest>;
export interface GetSubscriptionRequest {
  spaceName: string;
}
export const GetSubscriptionRequest = S.suspend(() =>
  S.Struct({ spaceName: S.String.pipe(T.HttpLabel("spaceName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/spaces/{spaceName}/subscription" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSubscriptionRequest",
}) as any as S.Schema<GetSubscriptionRequest>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface Filter {
  key: string;
  values: StringList;
  comparisonOperator?: string;
}
export const Filter = S.suspend(() =>
  S.Struct({
    key: S.String,
    values: StringList,
    comparisonOperator: S.optional(S.String),
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface ProjectListFilter {
  key: string;
  values: StringList;
  comparisonOperator?: string;
}
export const ProjectListFilter = S.suspend(() =>
  S.Struct({
    key: S.String,
    values: StringList,
    comparisonOperator: S.optional(S.String),
  }),
).annotations({
  identifier: "ProjectListFilter",
}) as any as S.Schema<ProjectListFilter>;
export type ProjectListFilters = ProjectListFilter[];
export const ProjectListFilters = S.Array(ProjectListFilter);
export interface RepositoryInput {
  repositoryName: string;
  branchName?: string;
}
export const RepositoryInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String, branchName: S.optional(S.String) }),
).annotations({
  identifier: "RepositoryInput",
}) as any as S.Schema<RepositoryInput>;
export type RepositoriesInput = RepositoryInput[];
export const RepositoriesInput = S.Array(RepositoryInput);
export interface PersistentStorageConfiguration {
  sizeInGiB: number;
}
export const PersistentStorageConfiguration = S.suspend(() =>
  S.Struct({ sizeInGiB: S.Number }),
).annotations({
  identifier: "PersistentStorageConfiguration",
}) as any as S.Schema<PersistentStorageConfiguration>;
export interface WorkflowRunStatusReason {}
export const WorkflowRunStatusReason = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "WorkflowRunStatusReason",
}) as any as S.Schema<WorkflowRunStatusReason>;
export type WorkflowRunStatusReasons = WorkflowRunStatusReason[];
export const WorkflowRunStatusReasons = S.Array(WorkflowRunStatusReason);
export type ExecuteCommandSessionConfigurationArguments = string[];
export const ExecuteCommandSessionConfigurationArguments = S.Array(S.String);
export interface CreateAccessTokenResponse {
  secret: string | Redacted.Redacted<string>;
  name: string;
  expiresTime: Date;
  accessTokenId: string;
}
export const CreateAccessTokenResponse = S.suspend(() =>
  S.Struct({
    secret: SensitiveString,
    name: S.String,
    expiresTime: S.Date.pipe(T.TimestampFormat("date-time")),
    accessTokenId: S.String,
  }),
).annotations({
  identifier: "CreateAccessTokenResponse",
}) as any as S.Schema<CreateAccessTokenResponse>;
export interface GetSpaceResponse {
  name: string;
  regionName: string;
  displayName?: string;
  description?: string;
}
export const GetSpaceResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    regionName: S.String,
    displayName: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSpaceResponse",
}) as any as S.Schema<GetSpaceResponse>;
export interface UpdateSpaceResponse {
  name?: string;
  displayName?: string;
  description?: string;
}
export const UpdateSpaceResponse = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateSpaceResponse",
}) as any as S.Schema<UpdateSpaceResponse>;
export interface DeleteSpaceResponse {
  name: string;
  displayName?: string;
}
export const DeleteSpaceResponse = S.suspend(() =>
  S.Struct({ name: S.String, displayName: S.optional(S.String) }),
).annotations({
  identifier: "DeleteSpaceResponse",
}) as any as S.Schema<DeleteSpaceResponse>;
export interface ListDevEnvironmentsRequest {
  spaceName: string;
  projectName?: string;
  filters?: Filters;
  nextToken?: string;
  maxResults?: number;
}
export const ListDevEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.optional(S.String),
    filters: S.optional(Filters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/spaces/{spaceName}/devEnvironments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDevEnvironmentsRequest",
}) as any as S.Schema<ListDevEnvironmentsRequest>;
export interface CreateProjectResponse {
  spaceName?: string;
  name: string;
  displayName?: string;
  description?: string;
}
export const CreateProjectResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.optional(S.String),
    name: S.String,
    displayName: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateProjectResponse",
}) as any as S.Schema<CreateProjectResponse>;
export interface GetProjectResponse {
  spaceName?: string;
  name: string;
  displayName?: string;
  description?: string;
}
export const GetProjectResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.optional(S.String),
    name: S.String,
    displayName: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "GetProjectResponse",
}) as any as S.Schema<GetProjectResponse>;
export interface UpdateProjectResponse {
  spaceName?: string;
  name?: string;
  displayName?: string;
  description?: string;
}
export const UpdateProjectResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.optional(S.String),
    name: S.optional(S.String),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateProjectResponse",
}) as any as S.Schema<UpdateProjectResponse>;
export interface DeleteProjectResponse {
  spaceName: string;
  name: string;
  displayName?: string;
}
export const DeleteProjectResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.String,
    name: S.String,
    displayName: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteProjectResponse",
}) as any as S.Schema<DeleteProjectResponse>;
export interface ListProjectsRequest {
  spaceName: string;
  nextToken?: string;
  maxResults?: number;
  filters?: ProjectListFilters;
}
export const ListProjectsRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(ProjectListFilters),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/spaces/{spaceName}/projects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProjectsRequest",
}) as any as S.Schema<ListProjectsRequest>;
export interface CreateDevEnvironmentRequest {
  spaceName: string;
  projectName: string;
  repositories?: RepositoriesInput;
  clientToken?: string;
  alias?: string;
  ides?: IdeConfigurationList;
  instanceType: string;
  inactivityTimeoutMinutes?: number;
  persistentStorage: PersistentStorageConfiguration;
  vpcConnectionName?: string;
}
export const CreateDevEnvironmentRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateDevEnvironmentRequest",
}) as any as S.Schema<CreateDevEnvironmentRequest>;
export interface UpdateDevEnvironmentResponse {
  id: string;
  spaceName: string;
  projectName: string;
  alias?: string;
  ides?: IdeConfigurationList;
  instanceType?: string;
  inactivityTimeoutMinutes?: number;
  clientToken?: string;
}
export const UpdateDevEnvironmentResponse = S.suspend(() =>
  S.Struct({
    id: S.String,
    spaceName: S.String,
    projectName: S.String,
    alias: S.optional(S.String),
    ides: S.optional(IdeConfigurationList),
    instanceType: S.optional(S.String),
    inactivityTimeoutMinutes: S.optional(S.Number),
    clientToken: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateDevEnvironmentResponse",
}) as any as S.Schema<UpdateDevEnvironmentResponse>;
export interface DeleteDevEnvironmentResponse {
  spaceName: string;
  projectName: string;
  id: string;
}
export const DeleteDevEnvironmentResponse = S.suspend(() =>
  S.Struct({ spaceName: S.String, projectName: S.String, id: S.String }),
).annotations({
  identifier: "DeleteDevEnvironmentResponse",
}) as any as S.Schema<DeleteDevEnvironmentResponse>;
export interface StartDevEnvironmentResponse {
  spaceName: string;
  projectName: string;
  id: string;
  status: string;
}
export const StartDevEnvironmentResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.String,
    projectName: S.String,
    id: S.String,
    status: S.String,
  }),
).annotations({
  identifier: "StartDevEnvironmentResponse",
}) as any as S.Schema<StartDevEnvironmentResponse>;
export interface StopDevEnvironmentResponse {
  spaceName: string;
  projectName: string;
  id: string;
  status: string;
}
export const StopDevEnvironmentResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.String,
    projectName: S.String,
    id: S.String,
    status: S.String,
  }),
).annotations({
  identifier: "StopDevEnvironmentResponse",
}) as any as S.Schema<StopDevEnvironmentResponse>;
export interface StopDevEnvironmentSessionResponse {
  spaceName: string;
  projectName: string;
  id: string;
  sessionId: string;
}
export const StopDevEnvironmentSessionResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.String,
    projectName: S.String,
    id: S.String,
    sessionId: S.String,
  }),
).annotations({
  identifier: "StopDevEnvironmentSessionResponse",
}) as any as S.Schema<StopDevEnvironmentSessionResponse>;
export interface CreateSourceRepositoryResponse {
  spaceName: string;
  projectName: string;
  name: string;
  description?: string;
}
export const CreateSourceRepositoryResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.String,
    projectName: S.String,
    name: S.String,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateSourceRepositoryResponse",
}) as any as S.Schema<CreateSourceRepositoryResponse>;
export interface GetSourceRepositoryResponse {
  spaceName: string;
  projectName: string;
  name: string;
  description?: string;
  lastUpdatedTime: Date;
  createdTime: Date;
}
export const GetSourceRepositoryResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.String,
    projectName: S.String,
    name: S.String,
    description: S.optional(S.String),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetSourceRepositoryResponse",
}) as any as S.Schema<GetSourceRepositoryResponse>;
export interface DeleteSourceRepositoryResponse {
  spaceName: string;
  projectName: string;
  name: string;
}
export const DeleteSourceRepositoryResponse = S.suspend(() =>
  S.Struct({ spaceName: S.String, projectName: S.String, name: S.String }),
).annotations({
  identifier: "DeleteSourceRepositoryResponse",
}) as any as S.Schema<DeleteSourceRepositoryResponse>;
export interface GetSourceRepositoryCloneUrlsResponse {
  https: string;
}
export const GetSourceRepositoryCloneUrlsResponse = S.suspend(() =>
  S.Struct({ https: S.String }),
).annotations({
  identifier: "GetSourceRepositoryCloneUrlsResponse",
}) as any as S.Schema<GetSourceRepositoryCloneUrlsResponse>;
export interface CreateSourceRepositoryBranchResponse {
  ref?: string;
  name?: string;
  lastUpdatedTime?: Date;
  headCommitId?: string;
}
export const CreateSourceRepositoryBranchResponse = S.suspend(() =>
  S.Struct({
    ref: S.optional(S.String),
    name: S.optional(S.String),
    lastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    headCommitId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateSourceRepositoryBranchResponse",
}) as any as S.Schema<CreateSourceRepositoryBranchResponse>;
export interface StartWorkflowRunResponse {
  spaceName: string;
  projectName: string;
  id: string;
  workflowId: string;
}
export const StartWorkflowRunResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.String,
    projectName: S.String,
    id: S.String,
    workflowId: S.String,
  }),
).annotations({
  identifier: "StartWorkflowRunResponse",
}) as any as S.Schema<StartWorkflowRunResponse>;
export interface GetWorkflowRunResponse {
  spaceName: string;
  projectName: string;
  id: string;
  workflowId: string;
  status: string;
  statusReasons?: WorkflowRunStatusReasons;
  startTime: Date;
  endTime?: Date;
  lastUpdatedTime: Date;
}
export const GetWorkflowRunResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.String,
    projectName: S.String,
    id: S.String,
    workflowId: S.String,
    status: S.String,
    statusReasons: S.optional(WorkflowRunStatusReasons),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetWorkflowRunResponse",
}) as any as S.Schema<GetWorkflowRunResponse>;
export interface GetSubscriptionResponse {
  subscriptionType?: string;
  awsAccountName?: string;
  pendingSubscriptionType?: string;
  pendingSubscriptionStartTime?: Date;
}
export const GetSubscriptionResponse = S.suspend(() =>
  S.Struct({
    subscriptionType: S.optional(S.String),
    awsAccountName: S.optional(S.String),
    pendingSubscriptionType: S.optional(S.String),
    pendingSubscriptionStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "GetSubscriptionResponse",
}) as any as S.Schema<GetSubscriptionResponse>;
export interface ExecuteCommandSessionConfiguration {
  command: string;
  arguments?: ExecuteCommandSessionConfigurationArguments;
}
export const ExecuteCommandSessionConfiguration = S.suspend(() =>
  S.Struct({
    command: S.String,
    arguments: S.optional(ExecuteCommandSessionConfigurationArguments),
  }),
).annotations({
  identifier: "ExecuteCommandSessionConfiguration",
}) as any as S.Schema<ExecuteCommandSessionConfiguration>;
export interface EmailAddress {
  email?: string;
  verified?: boolean;
}
export const EmailAddress = S.suspend(() =>
  S.Struct({ email: S.optional(S.String), verified: S.optional(S.Boolean) }),
).annotations({ identifier: "EmailAddress" }) as any as S.Schema<EmailAddress>;
export interface AccessTokenSummary {
  id: string;
  name: string;
  expiresTime?: Date;
}
export const AccessTokenSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    expiresTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "AccessTokenSummary",
}) as any as S.Schema<AccessTokenSummary>;
export type AccessTokenSummaries = AccessTokenSummary[];
export const AccessTokenSummaries = S.Array(AccessTokenSummary);
export interface SpaceSummary {
  name: string;
  regionName: string;
  displayName?: string;
  description?: string;
}
export const SpaceSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    regionName: S.String,
    displayName: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({ identifier: "SpaceSummary" }) as any as S.Schema<SpaceSummary>;
export type SpaceSummaries = SpaceSummary[];
export const SpaceSummaries = S.Array(SpaceSummary);
export interface DevEnvironmentRepositorySummary {
  repositoryName: string;
  branchName?: string;
}
export const DevEnvironmentRepositorySummary = S.suspend(() =>
  S.Struct({ repositoryName: S.String, branchName: S.optional(S.String) }),
).annotations({
  identifier: "DevEnvironmentRepositorySummary",
}) as any as S.Schema<DevEnvironmentRepositorySummary>;
export type DevEnvironmentRepositorySummaries =
  DevEnvironmentRepositorySummary[];
export const DevEnvironmentRepositorySummaries = S.Array(
  DevEnvironmentRepositorySummary,
);
export interface Ide {
  runtime?: string;
  name?: string;
}
export const Ide = S.suspend(() =>
  S.Struct({ runtime: S.optional(S.String), name: S.optional(S.String) }),
).annotations({ identifier: "Ide" }) as any as S.Schema<Ide>;
export type Ides = Ide[];
export const Ides = S.Array(Ide);
export interface PersistentStorage {
  sizeInGiB: number;
}
export const PersistentStorage = S.suspend(() =>
  S.Struct({ sizeInGiB: S.Number }),
).annotations({
  identifier: "PersistentStorage",
}) as any as S.Schema<PersistentStorage>;
export interface DevEnvironmentSessionSummary {
  spaceName: string;
  projectName: string;
  devEnvironmentId: string;
  startedTime: Date;
  id: string;
}
export const DevEnvironmentSessionSummary = S.suspend(() =>
  S.Struct({
    spaceName: S.String,
    projectName: S.String,
    devEnvironmentId: S.String,
    startedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    id: S.String,
  }),
).annotations({
  identifier: "DevEnvironmentSessionSummary",
}) as any as S.Schema<DevEnvironmentSessionSummary>;
export type DevEnvironmentSessionsSummaryList = DevEnvironmentSessionSummary[];
export const DevEnvironmentSessionsSummaryList = S.Array(
  DevEnvironmentSessionSummary,
);
export interface DevEnvironmentSessionConfiguration {
  sessionType: string;
  executeCommandSessionConfiguration?: ExecuteCommandSessionConfiguration;
}
export const DevEnvironmentSessionConfiguration = S.suspend(() =>
  S.Struct({
    sessionType: S.String,
    executeCommandSessionConfiguration: S.optional(
      ExecuteCommandSessionConfiguration,
    ),
  }),
).annotations({
  identifier: "DevEnvironmentSessionConfiguration",
}) as any as S.Schema<DevEnvironmentSessionConfiguration>;
export interface ListSourceRepositoriesItem {
  id: string;
  name: string;
  description?: string;
  lastUpdatedTime: Date;
  createdTime: Date;
}
export const ListSourceRepositoriesItem = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    description: S.optional(S.String),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListSourceRepositoriesItem",
}) as any as S.Schema<ListSourceRepositoriesItem>;
export type ListSourceRepositoriesItems = ListSourceRepositoriesItem[];
export const ListSourceRepositoriesItems = S.Array(ListSourceRepositoriesItem);
export interface ListSourceRepositoryBranchesItem {
  ref?: string;
  name?: string;
  lastUpdatedTime?: Date;
  headCommitId?: string;
}
export const ListSourceRepositoryBranchesItem = S.suspend(() =>
  S.Struct({
    ref: S.optional(S.String),
    name: S.optional(S.String),
    lastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    headCommitId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSourceRepositoryBranchesItem",
}) as any as S.Schema<ListSourceRepositoryBranchesItem>;
export type ListSourceRepositoryBranchesItems =
  ListSourceRepositoryBranchesItem[];
export const ListSourceRepositoryBranchesItems = S.Array(
  ListSourceRepositoryBranchesItem,
);
export interface WorkflowDefinition {
  path: string;
}
export const WorkflowDefinition = S.suspend(() =>
  S.Struct({ path: S.String }),
).annotations({
  identifier: "WorkflowDefinition",
}) as any as S.Schema<WorkflowDefinition>;
export interface WorkflowRunSummary {
  id: string;
  workflowId: string;
  workflowName: string;
  status: string;
  statusReasons?: WorkflowRunStatusReasons;
  startTime: Date;
  endTime?: Date;
  lastUpdatedTime: Date;
}
export const WorkflowRunSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    workflowId: S.String,
    workflowName: S.String,
    status: S.String,
    statusReasons: S.optional(WorkflowRunStatusReasons),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "WorkflowRunSummary",
}) as any as S.Schema<WorkflowRunSummary>;
export type WorkflowRunSummaries = WorkflowRunSummary[];
export const WorkflowRunSummaries = S.Array(WorkflowRunSummary);
export interface GetUserDetailsResponse {
  userId?: string;
  userName?: string;
  displayName?: string;
  primaryEmail?: EmailAddress;
  version?: string;
}
export const GetUserDetailsResponse = S.suspend(() =>
  S.Struct({
    userId: S.optional(S.String),
    userName: S.optional(S.String),
    displayName: S.optional(S.String),
    primaryEmail: S.optional(EmailAddress),
    version: S.optional(S.String),
  }),
).annotations({
  identifier: "GetUserDetailsResponse",
}) as any as S.Schema<GetUserDetailsResponse>;
export interface ListAccessTokensResponse {
  items: AccessTokenSummaries;
  nextToken?: string;
}
export const ListAccessTokensResponse = S.suspend(() =>
  S.Struct({ items: AccessTokenSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAccessTokensResponse",
}) as any as S.Schema<ListAccessTokensResponse>;
export interface ListSpacesResponse {
  nextToken?: string;
  items?: SpaceSummaries;
}
export const ListSpacesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: S.optional(SpaceSummaries),
  }),
).annotations({
  identifier: "ListSpacesResponse",
}) as any as S.Schema<ListSpacesResponse>;
export interface CreateDevEnvironmentResponse {
  spaceName: string;
  projectName: string;
  id: string;
  vpcConnectionName?: string;
}
export const CreateDevEnvironmentResponse = S.suspend(() =>
  S.Struct({
    spaceName: S.String,
    projectName: S.String,
    id: S.String,
    vpcConnectionName: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateDevEnvironmentResponse",
}) as any as S.Schema<CreateDevEnvironmentResponse>;
export interface GetDevEnvironmentResponse {
  spaceName: string;
  projectName: string;
  id: string;
  lastUpdatedTime: Date;
  creatorId: string;
  status: string;
  statusReason?: string;
  repositories: DevEnvironmentRepositorySummaries;
  alias?: string;
  ides?: Ides;
  instanceType: string;
  inactivityTimeoutMinutes: number;
  persistentStorage: PersistentStorage;
  vpcConnectionName?: string;
}
export const GetDevEnvironmentResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetDevEnvironmentResponse",
}) as any as S.Schema<GetDevEnvironmentResponse>;
export interface ListDevEnvironmentSessionsResponse {
  items: DevEnvironmentSessionsSummaryList;
  nextToken?: string;
}
export const ListDevEnvironmentSessionsResponse = S.suspend(() =>
  S.Struct({
    items: DevEnvironmentSessionsSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDevEnvironmentSessionsResponse",
}) as any as S.Schema<ListDevEnvironmentSessionsResponse>;
export interface StartDevEnvironmentSessionRequest {
  spaceName: string;
  projectName: string;
  id: string;
  sessionConfiguration: DevEnvironmentSessionConfiguration;
}
export const StartDevEnvironmentSessionRequest = S.suspend(() =>
  S.Struct({
    spaceName: S.String.pipe(T.HttpLabel("spaceName")),
    projectName: S.String.pipe(T.HttpLabel("projectName")),
    id: S.String.pipe(T.HttpLabel("id")),
    sessionConfiguration: DevEnvironmentSessionConfiguration,
  }).pipe(
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
  ),
).annotations({
  identifier: "StartDevEnvironmentSessionRequest",
}) as any as S.Schema<StartDevEnvironmentSessionRequest>;
export interface ListSourceRepositoriesResponse {
  items?: ListSourceRepositoriesItems;
  nextToken?: string;
}
export const ListSourceRepositoriesResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(ListSourceRepositoriesItems),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSourceRepositoriesResponse",
}) as any as S.Schema<ListSourceRepositoriesResponse>;
export interface ListSourceRepositoryBranchesResponse {
  nextToken?: string;
  items: ListSourceRepositoryBranchesItems;
}
export const ListSourceRepositoryBranchesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: ListSourceRepositoryBranchesItems,
  }),
).annotations({
  identifier: "ListSourceRepositoryBranchesResponse",
}) as any as S.Schema<ListSourceRepositoryBranchesResponse>;
export interface GetWorkflowResponse {
  spaceName: string;
  projectName: string;
  id: string;
  name: string;
  sourceRepositoryName?: string;
  sourceBranchName?: string;
  definition: WorkflowDefinition;
  createdTime: Date;
  lastUpdatedTime: Date;
  runMode: string;
  status: string;
}
export const GetWorkflowResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetWorkflowResponse",
}) as any as S.Schema<GetWorkflowResponse>;
export interface ListWorkflowRunsResponse {
  nextToken?: string;
  items?: WorkflowRunSummaries;
}
export const ListWorkflowRunsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: S.optional(WorkflowRunSummaries),
  }),
).annotations({
  identifier: "ListWorkflowRunsResponse",
}) as any as S.Schema<ListWorkflowRunsResponse>;
export interface UserIdentity {
  userType: string;
  principalId: string;
  userName?: string;
  awsAccountId?: string;
}
export const UserIdentity = S.suspend(() =>
  S.Struct({
    userType: S.String,
    principalId: S.String,
    userName: S.optional(S.String),
    awsAccountId: S.optional(S.String),
  }),
).annotations({ identifier: "UserIdentity" }) as any as S.Schema<UserIdentity>;
export interface ProjectInformation {
  name?: string;
  projectId?: string;
}
export const ProjectInformation = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), projectId: S.optional(S.String) }),
).annotations({
  identifier: "ProjectInformation",
}) as any as S.Schema<ProjectInformation>;
export interface EventPayload {
  contentType?: string;
  data?: string;
}
export const EventPayload = S.suspend(() =>
  S.Struct({ contentType: S.optional(S.String), data: S.optional(S.String) }),
).annotations({ identifier: "EventPayload" }) as any as S.Schema<EventPayload>;
export interface WorkflowDefinitionSummary {
  path: string;
}
export const WorkflowDefinitionSummary = S.suspend(() =>
  S.Struct({ path: S.String }),
).annotations({
  identifier: "WorkflowDefinitionSummary",
}) as any as S.Schema<WorkflowDefinitionSummary>;
export interface DevEnvironmentSummary {
  spaceName?: string;
  projectName?: string;
  id: string;
  lastUpdatedTime: Date;
  creatorId: string;
  status: string;
  statusReason?: string;
  repositories: DevEnvironmentRepositorySummaries;
  alias?: string;
  ides?: Ides;
  instanceType: string;
  inactivityTimeoutMinutes: number;
  persistentStorage: PersistentStorage;
  vpcConnectionName?: string;
}
export const DevEnvironmentSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DevEnvironmentSummary",
}) as any as S.Schema<DevEnvironmentSummary>;
export type DevEnvironmentSummaryList = DevEnvironmentSummary[];
export const DevEnvironmentSummaryList = S.Array(DevEnvironmentSummary);
export interface EventLogEntry {
  id: string;
  eventName: string;
  eventType: string;
  eventCategory: string;
  eventSource: string;
  eventTime: Date;
  operationType: string;
  userIdentity: UserIdentity;
  projectInformation?: ProjectInformation;
  requestId?: string;
  requestPayload?: EventPayload;
  responsePayload?: EventPayload;
  errorCode?: string;
  sourceIpAddress?: string;
  userAgent?: string;
}
export const EventLogEntry = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "EventLogEntry",
}) as any as S.Schema<EventLogEntry>;
export type EventLogEntries = EventLogEntry[];
export const EventLogEntries = S.Array(EventLogEntry);
export interface ProjectSummary {
  name: string;
  displayName?: string;
  description?: string;
}
export const ProjectSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    displayName: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "ProjectSummary",
}) as any as S.Schema<ProjectSummary>;
export type ProjectSummaries = ProjectSummary[];
export const ProjectSummaries = S.Array(ProjectSummary);
export interface WorkflowSummary {
  id: string;
  name: string;
  sourceRepositoryName: string;
  sourceBranchName: string;
  definition: WorkflowDefinitionSummary;
  createdTime: Date;
  lastUpdatedTime: Date;
  runMode: string;
  status: string;
}
export const WorkflowSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    sourceRepositoryName: S.String,
    sourceBranchName: S.String,
    definition: WorkflowDefinitionSummary,
    createdTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    runMode: S.String,
    status: S.String,
  }),
).annotations({
  identifier: "WorkflowSummary",
}) as any as S.Schema<WorkflowSummary>;
export type WorkflowSummaries = WorkflowSummary[];
export const WorkflowSummaries = S.Array(WorkflowSummary);
export interface ListDevEnvironmentsResponse {
  items: DevEnvironmentSummaryList;
  nextToken?: string;
}
export const ListDevEnvironmentsResponse = S.suspend(() =>
  S.Struct({
    items: DevEnvironmentSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDevEnvironmentsResponse",
}) as any as S.Schema<ListDevEnvironmentsResponse>;
export interface ListEventLogsResponse {
  nextToken?: string;
  items: EventLogEntries;
}
export const ListEventLogsResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), items: EventLogEntries }),
).annotations({
  identifier: "ListEventLogsResponse",
}) as any as S.Schema<ListEventLogsResponse>;
export interface ListProjectsResponse {
  nextToken?: string;
  items?: ProjectSummaries;
}
export const ListProjectsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: S.optional(ProjectSummaries),
  }),
).annotations({
  identifier: "ListProjectsResponse",
}) as any as S.Schema<ListProjectsResponse>;
export interface ListWorkflowsResponse {
  nextToken?: string;
  items?: WorkflowSummaries;
}
export const ListWorkflowsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: S.optional(WorkflowSummaries),
  }),
).annotations({
  identifier: "ListWorkflowsResponse",
}) as any as S.Schema<ListWorkflowsResponse>;
export interface DevEnvironmentAccessDetails {
  streamUrl: string | Redacted.Redacted<string>;
  tokenValue: string | Redacted.Redacted<string>;
}
export const DevEnvironmentAccessDetails = S.suspend(() =>
  S.Struct({ streamUrl: SensitiveString, tokenValue: SensitiveString }),
).annotations({
  identifier: "DevEnvironmentAccessDetails",
}) as any as S.Schema<DevEnvironmentAccessDetails>;
export interface StartDevEnvironmentSessionResponse {
  accessDetails: DevEnvironmentAccessDetails;
  sessionId?: string;
  spaceName: string;
  projectName: string;
  id: string;
}
export const StartDevEnvironmentSessionResponse = S.suspend(() =>
  S.Struct({
    accessDetails: DevEnvironmentAccessDetails,
    sessionId: S.optional(S.String),
    spaceName: S.String,
    projectName: S.String,
    id: S.String,
  }),
).annotations({
  identifier: "StartDevEnvironmentSessionResponse",
}) as any as S.Schema<StartDevEnvironmentSessionResponse>;

//# Errors

//# Operations
/**
 * Verifies whether the calling user has a valid Amazon CodeCatalyst login and session. If successful, this returns the ID of the user in Amazon CodeCatalyst.
 */
export const verifySession: (
  input: VerifySessionRequest,
) => Effect.Effect<
  VerifySessionResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifySessionRequest,
  output: VerifySessionResponse,
  errors: [],
}));
/**
 * Deletes a specified personal access token (PAT). A personal access token can only be deleted by the user who created it.
 */
export const deleteAccessToken: (
  input: DeleteAccessTokenRequest,
) => Effect.Effect<
  DeleteAccessTokenResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAccessToken: (
  input: CreateAccessTokenRequest,
) => Effect.Effect<
  CreateAccessTokenResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessTokenRequest,
  output: CreateAccessTokenResponse,
  errors: [],
}));
/**
 * Returns information about an space.
 */
export const getSpace: (
  input: GetSpaceRequest,
) => Effect.Effect<
  GetSpaceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSpaceRequest,
  output: GetSpaceResponse,
  errors: [],
}));
/**
 * Changes one or more values for a space.
 */
export const updateSpace: (
  input: UpdateSpaceRequest,
) => Effect.Effect<
  UpdateSpaceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSpaceRequest,
  output: UpdateSpaceResponse,
  errors: [],
}));
/**
 * Deletes a space.
 *
 * Deleting a space cannot be undone. Additionally, since space names must be unique across Amazon CodeCatalyst, you cannot reuse names of deleted spaces.
 */
export const deleteSpace: (
  input: DeleteSpaceRequest,
) => Effect.Effect<
  DeleteSpaceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSpaceRequest,
  output: DeleteSpaceResponse,
  errors: [],
}));
/**
 * Creates a project in a specified space.
 */
export const createProject: (
  input: CreateProjectRequest,
) => Effect.Effect<
  CreateProjectResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectRequest,
  output: CreateProjectResponse,
  errors: [],
}));
/**
 * Returns information about a project.
 */
export const getProject: (
  input: GetProjectRequest,
) => Effect.Effect<
  GetProjectResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProjectRequest,
  output: GetProjectResponse,
  errors: [],
}));
/**
 * Changes one or more values for a project.
 */
export const updateProject: (
  input: UpdateProjectRequest,
) => Effect.Effect<
  UpdateProjectResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectRequest,
  output: UpdateProjectResponse,
  errors: [],
}));
/**
 * Deletes a project in a space.
 */
export const deleteProject: (
  input: DeleteProjectRequest,
) => Effect.Effect<
  DeleteProjectResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResponse,
  errors: [],
}));
/**
 * Changes one or more values for a Dev Environment. Updating certain values of the Dev Environment will cause a restart.
 */
export const updateDevEnvironment: (
  input: UpdateDevEnvironmentRequest,
) => Effect.Effect<
  UpdateDevEnvironmentResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDevEnvironmentRequest,
  output: UpdateDevEnvironmentResponse,
  errors: [],
}));
/**
 * Deletes a Dev Environment.
 */
export const deleteDevEnvironment: (
  input: DeleteDevEnvironmentRequest,
) => Effect.Effect<
  DeleteDevEnvironmentResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDevEnvironmentRequest,
  output: DeleteDevEnvironmentResponse,
  errors: [],
}));
/**
 * Starts a specified Dev Environment and puts it into an active state.
 */
export const startDevEnvironment: (
  input: StartDevEnvironmentRequest,
) => Effect.Effect<
  StartDevEnvironmentResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDevEnvironmentRequest,
  output: StartDevEnvironmentResponse,
  errors: [],
}));
/**
 * Pauses a specified Dev Environment and places it in a non-running state. Stopped Dev Environments do not consume compute minutes.
 */
export const stopDevEnvironment: (
  input: StopDevEnvironmentRequest,
) => Effect.Effect<
  StopDevEnvironmentResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDevEnvironmentRequest,
  output: StopDevEnvironmentResponse,
  errors: [],
}));
/**
 * Stops a session for a specified Dev Environment.
 */
export const stopDevEnvironmentSession: (
  input: StopDevEnvironmentSessionRequest,
) => Effect.Effect<
  StopDevEnvironmentSessionResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDevEnvironmentSessionRequest,
  output: StopDevEnvironmentSessionResponse,
  errors: [],
}));
/**
 * Creates an empty Git-based source repository in a specified project. The repository is
 * created with an initial empty commit with a default branch named `main`.
 */
export const createSourceRepository: (
  input: CreateSourceRepositoryRequest,
) => Effect.Effect<
  CreateSourceRepositoryResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSourceRepositoryRequest,
  output: CreateSourceRepositoryResponse,
  errors: [],
}));
/**
 * Returns information about a source repository.
 */
export const getSourceRepository: (
  input: GetSourceRepositoryRequest,
) => Effect.Effect<
  GetSourceRepositoryResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSourceRepositoryRequest,
  output: GetSourceRepositoryResponse,
  errors: [],
}));
/**
 * Deletes a source repository in Amazon CodeCatalyst. You cannot use this API to delete a linked repository. It can only be used to delete a Amazon CodeCatalyst source repository.
 */
export const deleteSourceRepository: (
  input: DeleteSourceRepositoryRequest,
) => Effect.Effect<
  DeleteSourceRepositoryResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSourceRepositoryRequest,
  output: DeleteSourceRepositoryResponse,
  errors: [],
}));
/**
 * Returns information about the URLs that can be used with a Git client to clone a source
 * repository.
 */
export const getSourceRepositoryCloneUrls: (
  input: GetSourceRepositoryCloneUrlsRequest,
) => Effect.Effect<
  GetSourceRepositoryCloneUrlsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSourceRepositoryCloneUrlsRequest,
  output: GetSourceRepositoryCloneUrlsResponse,
  errors: [],
}));
/**
 * Creates a branch in a specified source repository in Amazon CodeCatalyst.
 *
 * This API only creates a branch in a source repository hosted in Amazon CodeCatalyst. You cannot use this API to create a branch in a linked repository.
 */
export const createSourceRepositoryBranch: (
  input: CreateSourceRepositoryBranchRequest,
) => Effect.Effect<
  CreateSourceRepositoryBranchResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSourceRepositoryBranchRequest,
  output: CreateSourceRepositoryBranchResponse,
  errors: [],
}));
/**
 * Begins a run of a specified workflow.
 */
export const startWorkflowRun: (
  input: StartWorkflowRunRequest,
) => Effect.Effect<
  StartWorkflowRunResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartWorkflowRunRequest,
  output: StartWorkflowRunResponse,
  errors: [],
}));
/**
 * Returns information about a specified run of a workflow.
 */
export const getWorkflowRun: (
  input: GetWorkflowRunRequest,
) => Effect.Effect<
  GetWorkflowRunResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRunRequest,
  output: GetWorkflowRunResponse,
  errors: [],
}));
/**
 * Returns information about the Amazon Web Services account used for billing purposes
 * and the billing plan for the space.
 */
export const getSubscription: (
  input: GetSubscriptionRequest,
) => Effect.Effect<
  GetSubscriptionResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSubscriptionRequest,
  output: GetSubscriptionResponse,
  errors: [],
}));
/**
 * Returns information about a user.
 */
export const getUserDetails: (
  input: GetUserDetailsRequest,
) => Effect.Effect<
  GetUserDetailsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserDetailsRequest,
  output: GetUserDetailsResponse,
  errors: [],
}));
/**
 * Lists all personal access tokens (PATs) associated with the user who calls the API. You can only list PATs associated with your Amazon Web Services Builder ID.
 */
export const listAccessTokens: {
  (
    input: ListAccessTokensRequest,
  ): Effect.Effect<
    ListAccessTokensResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessTokensRequest,
  ) => Stream.Stream<
    ListAccessTokensResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessTokensRequest,
  ) => Stream.Stream<
    AccessTokenSummary,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessTokensRequest,
  output: ListAccessTokensResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of spaces.
 */
export const listSpaces: {
  (
    input: ListSpacesRequest,
  ): Effect.Effect<
    ListSpacesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSpacesRequest,
  ) => Stream.Stream<
    ListSpacesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSpacesRequest,
  ) => Stream.Stream<
    SpaceSummary,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSpacesRequest,
  output: ListSpacesResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
  } as const,
}));
/**
 * Creates a Dev Environment in Amazon CodeCatalyst, a cloud-based development environment that you can use to quickly work on the code stored
 * in the source repositories of your project.
 *
 * When created in the Amazon CodeCatalyst console, by default a Dev Environment is configured to have a 2 core processor, 4GB of RAM, and 16GB of persistent storage. None of these
 * defaults apply to a Dev Environment created programmatically.
 */
export const createDevEnvironment: (
  input: CreateDevEnvironmentRequest,
) => Effect.Effect<
  CreateDevEnvironmentResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDevEnvironmentRequest,
  output: CreateDevEnvironmentResponse,
  errors: [],
}));
/**
 * Returns information about a Dev Environment for a source repository in a project. Dev Environments are specific to the user who creates them.
 */
export const getDevEnvironment: (
  input: GetDevEnvironmentRequest,
) => Effect.Effect<
  GetDevEnvironmentResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDevEnvironmentRequest,
  output: GetDevEnvironmentResponse,
  errors: [],
}));
/**
 * Retrieves a list of active sessions for a Dev Environment in a project.
 */
export const listDevEnvironmentSessions: {
  (
    input: ListDevEnvironmentSessionsRequest,
  ): Effect.Effect<
    ListDevEnvironmentSessionsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevEnvironmentSessionsRequest,
  ) => Stream.Stream<
    ListDevEnvironmentSessionsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDevEnvironmentSessionsRequest,
  ) => Stream.Stream<
    DevEnvironmentSessionSummary,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDevEnvironmentSessionsRequest,
  output: ListDevEnvironmentSessionsResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of source repositories in a project.
 */
export const listSourceRepositories: {
  (
    input: ListSourceRepositoriesRequest,
  ): Effect.Effect<
    ListSourceRepositoriesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSourceRepositoriesRequest,
  ) => Stream.Stream<
    ListSourceRepositoriesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSourceRepositoriesRequest,
  ) => Stream.Stream<
    ListSourceRepositoriesItem,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSourceRepositoriesRequest,
  output: ListSourceRepositoriesResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of branches in a specified source repository.
 */
export const listSourceRepositoryBranches: {
  (
    input: ListSourceRepositoryBranchesRequest,
  ): Effect.Effect<
    ListSourceRepositoryBranchesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSourceRepositoryBranchesRequest,
  ) => Stream.Stream<
    ListSourceRepositoryBranchesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSourceRepositoryBranchesRequest,
  ) => Stream.Stream<
    ListSourceRepositoryBranchesItem,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSourceRepositoryBranchesRequest,
  output: ListSourceRepositoryBranchesResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a workflow.
 */
export const getWorkflow: (
  input: GetWorkflowRequest,
) => Effect.Effect<
  GetWorkflowResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRequest,
  output: GetWorkflowResponse,
  errors: [],
}));
/**
 * Retrieves a list of workflow runs of a specified workflow.
 */
export const listWorkflowRuns: {
  (
    input: ListWorkflowRunsRequest,
  ): Effect.Effect<
    ListWorkflowRunsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkflowRunsRequest,
  ) => Stream.Stream<
    ListWorkflowRunsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkflowRunsRequest,
  ) => Stream.Stream<
    WorkflowRunSummary,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkflowRunsRequest,
  output: ListWorkflowRunsResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of Dev Environments in a project.
 */
export const listDevEnvironments: {
  (
    input: ListDevEnvironmentsRequest,
  ): Effect.Effect<
    ListDevEnvironmentsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevEnvironmentsRequest,
  ) => Stream.Stream<
    ListDevEnvironmentsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDevEnvironmentsRequest,
  ) => Stream.Stream<
    DevEnvironmentSummary,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDevEnvironmentsRequest,
  output: ListDevEnvironmentsResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
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
export const listEventLogs: {
  (
    input: ListEventLogsRequest,
  ): Effect.Effect<
    ListEventLogsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventLogsRequest,
  ) => Stream.Stream<
    ListEventLogsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventLogsRequest,
  ) => Stream.Stream<
    EventLogEntry,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventLogsRequest,
  output: ListEventLogsResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of projects.
 */
export const listProjects: {
  (
    input: ListProjectsRequest,
  ): Effect.Effect<
    ListProjectsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProjectsRequest,
  ) => Stream.Stream<
    ListProjectsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProjectsRequest,
  ) => Stream.Stream<
    ProjectSummary,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProjectsRequest,
  output: ListProjectsResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of workflows in a specified project.
 */
export const listWorkflows: {
  (
    input: ListWorkflowsRequest,
  ): Effect.Effect<
    ListWorkflowsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkflowsRequest,
  ) => Stream.Stream<
    ListWorkflowsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkflowsRequest,
  ) => Stream.Stream<
    WorkflowSummary,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkflowsRequest,
  output: ListWorkflowsResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts a session for a specified Dev Environment.
 */
export const startDevEnvironmentSession: (
  input: StartDevEnvironmentSessionRequest,
) => Effect.Effect<
  StartDevEnvironmentSessionResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDevEnvironmentSessionRequest,
  output: StartDevEnvironmentSessionResponse,
  errors: [],
}));
