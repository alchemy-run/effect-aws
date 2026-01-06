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

//# Newtypes
export type WorkflowDefinitionName = string;
export type UuidString = string;
export type Task = string | Redacted.Redacted<string>;
export type ClientToken = string;
export type MaxResults = number;
export type NextToken = string;
export type WorkflowDescription = string | Redacted.Redacted<string>;
export type ModelId = string;
export type CloudWatchLogGroupName = string;
export type ToolName = string;
export type ToolDescription = string | Redacted.Redacted<string>;
export type CallId = string;
export type SensitiveString = string | Redacted.Redacted<string>;
export type S3BucketName = string;
export type S3KeyPrefix = string;
export type NonBlankString = string;
export type WorkflowDefinitionArn = string;
export type WorkflowRunArn = string;

//# Schemas
export interface ListActsRequest {
  workflowDefinitionName: string;
  workflowRunId?: string;
  sessionId?: string;
  maxResults?: number;
  nextToken?: string;
  sortOrder?: string;
}
export const ListActsRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.optional(S.String).pipe(T.HttpQuery("workflowRunId")),
    sessionId: S.optional(S.String).pipe(T.HttpQuery("sessionId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortOrder: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListActsRequest",
}) as any as S.Schema<ListActsRequest>;
export interface ListModelsRequest {
  clientCompatibilityVersion: number;
}
export const ListModelsRequest = S.suspend(() =>
  S.Struct({
    clientCompatibilityVersion: S.Number.pipe(
      T.HttpQuery("clientCompatibilityVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListModelsRequest",
}) as any as S.Schema<ListModelsRequest>;
export interface CreateSessionRequest {
  workflowDefinitionName: string;
  workflowRunId: string;
  clientToken?: string;
}
export const CreateSessionRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateSessionRequest",
}) as any as S.Schema<CreateSessionRequest>;
export interface ListSessionsRequest {
  workflowDefinitionName: string;
  workflowRunId: string;
  maxResults?: number;
  nextToken?: string;
  sortOrder?: string;
}
export const ListSessionsRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortOrder: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListSessionsRequest",
}) as any as S.Schema<ListSessionsRequest>;
export interface GetWorkflowDefinitionRequest {
  workflowDefinitionName: string;
}
export const GetWorkflowDefinitionRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetWorkflowDefinitionRequest",
}) as any as S.Schema<GetWorkflowDefinitionRequest>;
export interface DeleteWorkflowDefinitionRequest {
  workflowDefinitionName: string;
}
export const DeleteWorkflowDefinitionRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteWorkflowDefinitionRequest",
}) as any as S.Schema<DeleteWorkflowDefinitionRequest>;
export interface ListWorkflowDefinitionsRequest {
  maxResults?: number;
  nextToken?: string;
  sortOrder?: string;
}
export const ListWorkflowDefinitionsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortOrder: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workflow-definitions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkflowDefinitionsRequest",
}) as any as S.Schema<ListWorkflowDefinitionsRequest>;
export interface GetWorkflowRunRequest {
  workflowDefinitionName: string;
  workflowRunId: string;
}
export const GetWorkflowRunRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetWorkflowRunRequest",
}) as any as S.Schema<GetWorkflowRunRequest>;
export interface UpdateWorkflowRunRequest {
  workflowDefinitionName: string;
  workflowRunId: string;
  status: string;
}
export const UpdateWorkflowRunRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    status: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateWorkflowRunRequest",
}) as any as S.Schema<UpdateWorkflowRunRequest>;
export interface UpdateWorkflowRunResponse {}
export const UpdateWorkflowRunResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateWorkflowRunResponse",
}) as any as S.Schema<UpdateWorkflowRunResponse>;
export interface DeleteWorkflowRunRequest {
  workflowDefinitionName: string;
  workflowRunId: string;
}
export const DeleteWorkflowRunRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteWorkflowRunRequest",
}) as any as S.Schema<DeleteWorkflowRunRequest>;
export interface ListWorkflowRunsRequest {
  workflowDefinitionName: string;
  maxResults?: number;
  nextToken?: string;
  sortOrder?: string;
}
export const ListWorkflowRunsRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortOrder: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListWorkflowRunsRequest",
}) as any as S.Schema<ListWorkflowRunsRequest>;
export interface ActError {
  message: string | Redacted.Redacted<string>;
  type?: string;
}
export const ActError = S.suspend(() =>
  S.Struct({ message: SensitiveString, type: S.optional(S.String) }),
).annotations({ identifier: "ActError" }) as any as S.Schema<ActError>;
export interface WorkflowExportConfig {
  s3BucketName: string;
  s3KeyPrefix?: string;
}
export const WorkflowExportConfig = S.suspend(() =>
  S.Struct({ s3BucketName: S.String, s3KeyPrefix: S.optional(S.String) }),
).annotations({
  identifier: "WorkflowExportConfig",
}) as any as S.Schema<WorkflowExportConfig>;
export interface ClientInfo {
  compatibilityVersion: number;
  sdkVersion?: string;
}
export const ClientInfo = S.suspend(() =>
  S.Struct({
    compatibilityVersion: S.Number,
    sdkVersion: S.optional(S.String),
  }),
).annotations({ identifier: "ClientInfo" }) as any as S.Schema<ClientInfo>;
export interface UpdateActRequest {
  workflowDefinitionName: string;
  workflowRunId: string;
  sessionId: string;
  actId: string;
  status: string;
  error?: ActError;
}
export const UpdateActRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    actId: S.String.pipe(T.HttpLabel("actId")),
    status: S.String,
    error: S.optional(ActError),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateActRequest",
}) as any as S.Schema<UpdateActRequest>;
export interface UpdateActResponse {}
export const UpdateActResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateActResponse",
}) as any as S.Schema<UpdateActResponse>;
export interface CreateSessionResponse {
  sessionId: string;
}
export const CreateSessionResponse = S.suspend(() =>
  S.Struct({ sessionId: S.String }),
).annotations({
  identifier: "CreateSessionResponse",
}) as any as S.Schema<CreateSessionResponse>;
export interface CreateWorkflowDefinitionRequest {
  name: string;
  description?: string | Redacted.Redacted<string>;
  exportConfig?: WorkflowExportConfig;
  clientToken?: string;
}
export const CreateWorkflowDefinitionRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    exportConfig: S.optional(WorkflowExportConfig),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/workflow-definitions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWorkflowDefinitionRequest",
}) as any as S.Schema<CreateWorkflowDefinitionRequest>;
export interface GetWorkflowDefinitionResponse {
  name: string;
  arn: string;
  createdAt: Date;
  description?: string | Redacted.Redacted<string>;
  exportConfig?: WorkflowExportConfig;
  status: string;
}
export const GetWorkflowDefinitionResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    description: S.optional(SensitiveString),
    exportConfig: S.optional(WorkflowExportConfig),
    status: S.String,
  }),
).annotations({
  identifier: "GetWorkflowDefinitionResponse",
}) as any as S.Schema<GetWorkflowDefinitionResponse>;
export interface DeleteWorkflowDefinitionResponse {
  status: string;
}
export const DeleteWorkflowDefinitionResponse = S.suspend(() =>
  S.Struct({ status: S.String }),
).annotations({
  identifier: "DeleteWorkflowDefinitionResponse",
}) as any as S.Schema<DeleteWorkflowDefinitionResponse>;
export interface CreateWorkflowRunRequest {
  workflowDefinitionName: string;
  modelId: string;
  clientToken?: string;
  logGroupName?: string;
  clientInfo: ClientInfo;
}
export const CreateWorkflowRunRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    modelId: S.String,
    clientToken: S.optional(S.String),
    logGroupName: S.optional(S.String),
    clientInfo: ClientInfo,
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateWorkflowRunRequest",
}) as any as S.Schema<CreateWorkflowRunRequest>;
export interface GetWorkflowRunResponse {
  workflowRunArn: string;
  workflowRunId: string;
  status: string;
  startedAt: Date;
  endedAt?: Date;
  modelId: string;
  logGroupName?: string;
}
export const GetWorkflowRunResponse = S.suspend(() =>
  S.Struct({
    workflowRunArn: S.String,
    workflowRunId: S.String,
    status: S.String,
    startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    modelId: S.String,
    logGroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "GetWorkflowRunResponse",
}) as any as S.Schema<GetWorkflowRunResponse>;
export interface DeleteWorkflowRunResponse {
  status: string;
}
export const DeleteWorkflowRunResponse = S.suspend(() =>
  S.Struct({ status: S.String }),
).annotations({
  identifier: "DeleteWorkflowRunResponse",
}) as any as S.Schema<DeleteWorkflowRunResponse>;
export type ToolInputSchema = { json: any };
export const ToolInputSchema = S.Union(S.Struct({ json: S.Any }));
export type CallResultContent = { text: string };
export const CallResultContent = S.Union(S.Struct({ text: S.String }));
export type CallResultContents = (typeof CallResultContent)["Type"][];
export const CallResultContents = S.Array(CallResultContent);
export type ModelIdList = string[];
export const ModelIdList = S.Array(S.String);
export interface ToolSpec {
  name: string;
  description: string | Redacted.Redacted<string>;
  inputSchema: (typeof ToolInputSchema)["Type"];
}
export const ToolSpec = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: SensitiveString,
    inputSchema: ToolInputSchema,
  }),
).annotations({ identifier: "ToolSpec" }) as any as S.Schema<ToolSpec>;
export type ToolSpecs = ToolSpec[];
export const ToolSpecs = S.Array(ToolSpec);
export interface CallResult {
  callId?: string;
  content: CallResultContents;
}
export const CallResult = S.suspend(() =>
  S.Struct({ callId: S.optional(S.String), content: CallResultContents }),
).annotations({ identifier: "CallResult" }) as any as S.Schema<CallResult>;
export type CallResults = CallResult[];
export const CallResults = S.Array(CallResult);
export interface ModelAlias {
  aliasName: string;
  latestModelId: string;
  resolvedModelId?: string;
}
export const ModelAlias = S.suspend(() =>
  S.Struct({
    aliasName: S.String,
    latestModelId: S.String,
    resolvedModelId: S.optional(S.String),
  }),
).annotations({ identifier: "ModelAlias" }) as any as S.Schema<ModelAlias>;
export type ModelAliases = ModelAlias[];
export const ModelAliases = S.Array(ModelAlias);
export interface CompatibilityInformation {
  clientCompatibilityVersion: number;
  supportedModelIds: ModelIdList;
  message?: string;
}
export const CompatibilityInformation = S.suspend(() =>
  S.Struct({
    clientCompatibilityVersion: S.Number,
    supportedModelIds: ModelIdList,
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "CompatibilityInformation",
}) as any as S.Schema<CompatibilityInformation>;
export interface SessionSummary {
  sessionId: string;
}
export const SessionSummary = S.suspend(() =>
  S.Struct({ sessionId: S.String }),
).annotations({
  identifier: "SessionSummary",
}) as any as S.Schema<SessionSummary>;
export type SessionSummaries = SessionSummary[];
export const SessionSummaries = S.Array(SessionSummary);
export interface WorkflowDefinitionSummary {
  workflowDefinitionArn: string;
  workflowDefinitionName: string;
  createdAt: Date;
  status: string;
}
export const WorkflowDefinitionSummary = S.suspend(() =>
  S.Struct({
    workflowDefinitionArn: S.String,
    workflowDefinitionName: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "WorkflowDefinitionSummary",
}) as any as S.Schema<WorkflowDefinitionSummary>;
export type WorkflowDefinitionSummaries = WorkflowDefinitionSummary[];
export const WorkflowDefinitionSummaries = S.Array(WorkflowDefinitionSummary);
export interface TraceLocation {
  locationType: string;
  location: string;
}
export const TraceLocation = S.suspend(() =>
  S.Struct({ locationType: S.String, location: S.String }),
).annotations({
  identifier: "TraceLocation",
}) as any as S.Schema<TraceLocation>;
export interface WorkflowRunSummary {
  workflowRunArn: string;
  workflowRunId: string;
  status: string;
  startedAt: Date;
  endedAt?: Date;
  traceLocation?: TraceLocation;
}
export const WorkflowRunSummary = S.suspend(() =>
  S.Struct({
    workflowRunArn: S.String,
    workflowRunId: S.String,
    status: S.String,
    startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    traceLocation: S.optional(TraceLocation),
  }),
).annotations({
  identifier: "WorkflowRunSummary",
}) as any as S.Schema<WorkflowRunSummary>;
export type WorkflowRunSummaries = WorkflowRunSummary[];
export const WorkflowRunSummaries = S.Array(WorkflowRunSummary);
export interface CreateActRequest {
  workflowDefinitionName: string;
  workflowRunId: string;
  sessionId: string;
  task: string | Redacted.Redacted<string>;
  toolSpecs?: ToolSpecs;
  clientToken?: string;
}
export const CreateActRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    task: SensitiveString,
    toolSpecs: S.optional(ToolSpecs),
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateActRequest",
}) as any as S.Schema<CreateActRequest>;
export interface InvokeActStepRequest {
  workflowDefinitionName: string;
  workflowRunId: string;
  sessionId: string;
  actId: string;
  callResults: CallResults;
  previousStepId?: string;
}
export const InvokeActStepRequest = S.suspend(() =>
  S.Struct({
    workflowDefinitionName: S.String.pipe(
      T.HttpLabel("workflowDefinitionName"),
    ),
    workflowRunId: S.String.pipe(T.HttpLabel("workflowRunId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    actId: S.String.pipe(T.HttpLabel("actId")),
    callResults: CallResults,
    previousStepId: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "InvokeActStepRequest",
}) as any as S.Schema<InvokeActStepRequest>;
export interface ListSessionsResponse {
  sessionSummaries: SessionSummaries;
  nextToken?: string;
}
export const ListSessionsResponse = S.suspend(() =>
  S.Struct({
    sessionSummaries: SessionSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSessionsResponse",
}) as any as S.Schema<ListSessionsResponse>;
export interface CreateWorkflowDefinitionResponse {
  status: string;
}
export const CreateWorkflowDefinitionResponse = S.suspend(() =>
  S.Struct({ status: S.String }),
).annotations({
  identifier: "CreateWorkflowDefinitionResponse",
}) as any as S.Schema<CreateWorkflowDefinitionResponse>;
export interface ListWorkflowDefinitionsResponse {
  workflowDefinitionSummaries: WorkflowDefinitionSummaries;
  nextToken?: string;
}
export const ListWorkflowDefinitionsResponse = S.suspend(() =>
  S.Struct({
    workflowDefinitionSummaries: WorkflowDefinitionSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkflowDefinitionsResponse",
}) as any as S.Schema<ListWorkflowDefinitionsResponse>;
export interface CreateWorkflowRunResponse {
  workflowRunId: string;
  status: string;
}
export const CreateWorkflowRunResponse = S.suspend(() =>
  S.Struct({ workflowRunId: S.String, status: S.String }),
).annotations({
  identifier: "CreateWorkflowRunResponse",
}) as any as S.Schema<CreateWorkflowRunResponse>;
export interface ListWorkflowRunsResponse {
  workflowRunSummaries: WorkflowRunSummaries;
  nextToken?: string;
}
export const ListWorkflowRunsResponse = S.suspend(() =>
  S.Struct({
    workflowRunSummaries: WorkflowRunSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkflowRunsResponse",
}) as any as S.Schema<ListWorkflowRunsResponse>;
export interface ModelLifecycle {
  status: string;
}
export const ModelLifecycle = S.suspend(() =>
  S.Struct({ status: S.String }),
).annotations({
  identifier: "ModelLifecycle",
}) as any as S.Schema<ModelLifecycle>;
export interface ActSummary {
  workflowRunId: string;
  sessionId: string;
  actId: string;
  status: string;
  startedAt: Date;
  endedAt?: Date;
  traceLocation?: TraceLocation;
}
export const ActSummary = S.suspend(() =>
  S.Struct({
    workflowRunId: S.String,
    sessionId: S.String,
    actId: S.String,
    status: S.String,
    startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    traceLocation: S.optional(TraceLocation),
  }),
).annotations({ identifier: "ActSummary" }) as any as S.Schema<ActSummary>;
export type ActSummaries = ActSummary[];
export const ActSummaries = S.Array(ActSummary);
export interface ModelSummary {
  modelId: string;
  modelLifecycle: ModelLifecycle;
  minimumCompatibilityVersion: number;
}
export const ModelSummary = S.suspend(() =>
  S.Struct({
    modelId: S.String,
    modelLifecycle: ModelLifecycle,
    minimumCompatibilityVersion: S.Number,
  }),
).annotations({ identifier: "ModelSummary" }) as any as S.Schema<ModelSummary>;
export type ModelSummaries = ModelSummary[];
export const ModelSummaries = S.Array(ModelSummary);
export interface CreateActResponse {
  actId: string;
  status: string;
}
export const CreateActResponse = S.suspend(() =>
  S.Struct({ actId: S.String, status: S.String }),
).annotations({
  identifier: "CreateActResponse",
}) as any as S.Schema<CreateActResponse>;
export interface ListActsResponse {
  actSummaries: ActSummaries;
  nextToken?: string;
}
export const ListActsResponse = S.suspend(() =>
  S.Struct({ actSummaries: ActSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListActsResponse",
}) as any as S.Schema<ListActsResponse>;
export interface ListModelsResponse {
  modelSummaries: ModelSummaries;
  modelAliases: ModelAliases;
  compatibilityInformation: CompatibilityInformation;
}
export const ListModelsResponse = S.suspend(() =>
  S.Struct({
    modelSummaries: ModelSummaries,
    modelAliases: ModelAliases,
    compatibilityInformation: CompatibilityInformation,
  }),
).annotations({
  identifier: "ListModelsResponse",
}) as any as S.Schema<ListModelsResponse>;
export interface Call {
  callId: string;
  input: any;
  name: string;
}
export const Call = S.suspend(() =>
  S.Struct({ callId: S.String, input: S.Any, name: S.String }),
).annotations({ identifier: "Call" }) as any as S.Schema<Call>;
export type Calls = Call[];
export const Calls = S.Array(Call);
export interface InvokeActStepResponse {
  calls: Calls;
  stepId: string;
}
export const InvokeActStepResponse = S.suspend(() =>
  S.Struct({ calls: Calls, stepId: S.String }),
).annotations({
  identifier: "InvokeActStepResponse",
}) as any as S.Schema<InvokeActStepResponse>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
    reason: S.optional(S.String),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists all available AI models that can be used for workflow execution, including their status and compatibility information.
 */
export const listModels: (
  input: ListModelsRequest,
) => Effect.Effect<
  ListModelsResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListModelsRequest,
  output: ListModelsResponse,
  errors: [AccessDeniedException, InternalServerException, ThrottlingException],
}));
/**
 * Lists all workflow definitions in your account with optional filtering and pagination.
 */
export const listWorkflowDefinitions: {
  (
    input: ListWorkflowDefinitionsRequest,
  ): Effect.Effect<
    ListWorkflowDefinitionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkflowDefinitionsRequest,
  ) => Stream.Stream<
    ListWorkflowDefinitionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkflowDefinitionsRequest,
  ) => Stream.Stream<
    WorkflowDefinitionSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkflowDefinitionsRequest,
  output: ListWorkflowDefinitionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "workflowDefinitionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Terminates and cleans up a workflow run, stopping all associated acts and sessions.
 */
export const deleteWorkflowRun: (
  input: DeleteWorkflowRunRequest,
) => Effect.Effect<
  DeleteWorkflowRunResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAct: (
  input: UpdateActRequest,
) => Effect.Effect<
  UpdateActResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSession: (
  input: CreateSessionRequest,
) => Effect.Effect<
  CreateSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWorkflowDefinition: (
  input: DeleteWorkflowDefinitionRequest,
) => Effect.Effect<
  DeleteWorkflowDefinitionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves the current state, configuration, and execution details of a workflow run.
 */
export const getWorkflowRun: (
  input: GetWorkflowRunRequest,
) => Effect.Effect<
  GetWorkflowRunResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSessions: {
  (
    input: ListSessionsRequest,
  ): Effect.Effect<
    ListSessionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionsRequest,
  ) => Stream.Stream<
    ListSessionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionsRequest,
  ) => Stream.Stream<
    SessionSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "sessionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new execution instance of a workflow definition with specified parameters.
 */
export const createWorkflowRun: (
  input: CreateWorkflowRunRequest,
) => Effect.Effect<
  CreateWorkflowRunResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWorkflowRun: (
  input: UpdateWorkflowRunRequest,
) => Effect.Effect<
  UpdateWorkflowRunResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listWorkflowRuns: {
  (
    input: ListWorkflowRunsRequest,
  ): Effect.Effect<
    ListWorkflowRunsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkflowRunsRequest,
  ) => Stream.Stream<
    ListWorkflowRunsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkflowRunsRequest,
  ) => Stream.Stream<
    WorkflowRunSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "workflowRunSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new AI task (act) within a session that can interact with tools and perform specific actions.
 */
export const createAct: (
  input: CreateActRequest,
) => Effect.Effect<
  CreateActResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listActs: {
  (
    input: ListActsRequest,
  ): Effect.Effect<
    ListActsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListActsRequest,
  ) => Stream.Stream<
    ListActsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListActsRequest,
  ) => Stream.Stream<
    ActSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "actSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the details and configuration of a specific workflow definition.
 */
export const getWorkflowDefinition: (
  input: GetWorkflowDefinitionRequest,
) => Effect.Effect<
  GetWorkflowDefinitionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowDefinitionRequest,
  output: GetWorkflowDefinitionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new workflow definition template that can be used to execute multiple workflow runs.
 */
export const createWorkflowDefinition: (
  input: CreateWorkflowDefinitionRequest,
) => Effect.Effect<
  CreateWorkflowDefinitionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Executes the next step of an act, processing tool call results and returning new tool calls if needed.
 */
export const invokeActStep: (
  input: InvokeActStepRequest,
) => Effect.Effect<
  InvokeActStepResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
