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

//# Newtypes
export type TaggableResourceArn = string;
export type TagKey = string;
export type WorkflowArn = string;
export type IdString = string;
export type NameString = string;
export type IdempotencyTokenString = string;
export type RoleARN = string;
export type DescriptionString = string;
export type GenericString = string;
export type WorkflowVersion = string;
export type VersionId = string;
export type TagValue = string;
export type SecurityGroupString = string;
export type SubnetString = string;
export type ErrorMessage = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface GetTaskInstanceRequest {
  WorkflowArn: string;
  TaskInstanceId: string;
  RunId: string;
}
export const GetTaskInstanceRequest = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    TaskInstanceId: S.String.pipe(T.HttpLabel("TaskInstanceId")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTaskInstanceRequest",
}) as any as S.Schema<GetTaskInstanceRequest>;
export interface ListTaskInstancesRequest {
  WorkflowArn: string;
  RunId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTaskInstancesRequest = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListTaskInstancesRequest",
}) as any as S.Schema<ListTaskInstancesRequest>;
export interface GetWorkflowRequest {
  WorkflowArn: string;
  WorkflowVersion?: string;
}
export const GetWorkflowRequest = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    WorkflowVersion: S.optional(S.String).pipe(T.HttpQuery("workflowVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workflows/{WorkflowArn}" }),
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
export interface DefinitionS3Location {
  Bucket: string;
  ObjectKey: string;
  VersionId?: string;
}
export const DefinitionS3Location = S.suspend(() =>
  S.Struct({
    Bucket: S.String,
    ObjectKey: S.String,
    VersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "DefinitionS3Location",
}) as any as S.Schema<DefinitionS3Location>;
export interface LoggingConfiguration {
  LogGroupName: string;
}
export const LoggingConfiguration = S.suspend(() =>
  S.Struct({ LogGroupName: S.String }),
).annotations({
  identifier: "LoggingConfiguration",
}) as any as S.Schema<LoggingConfiguration>;
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export interface NetworkConfiguration {
  SecurityGroupIds?: SecurityGroupIds;
  SubnetIds?: SubnetIds;
}
export const NetworkConfiguration = S.suspend(() =>
  S.Struct({
    SecurityGroupIds: S.optional(SecurityGroupIds),
    SubnetIds: S.optional(SubnetIds),
  }),
).annotations({
  identifier: "NetworkConfiguration",
}) as any as S.Schema<NetworkConfiguration>;
export interface UpdateWorkflowRequest {
  WorkflowArn: string;
  DefinitionS3Location: DefinitionS3Location;
  RoleArn: string;
  Description?: string;
  LoggingConfiguration?: LoggingConfiguration;
  EngineVersion?: number;
  NetworkConfiguration?: NetworkConfiguration;
  TriggerMode?: string;
}
export const UpdateWorkflowRequest = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    DefinitionS3Location: DefinitionS3Location,
    RoleArn: S.String,
    Description: S.optional(S.String),
    LoggingConfiguration: S.optional(LoggingConfiguration),
    EngineVersion: S.optional(S.Number),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    TriggerMode: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/workflows/{WorkflowArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWorkflowRequest",
}) as any as S.Schema<UpdateWorkflowRequest>;
export interface DeleteWorkflowRequest {
  WorkflowArn: string;
  WorkflowVersion?: string;
}
export const DeleteWorkflowRequest = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    WorkflowVersion: S.optional(S.String).pipe(T.HttpQuery("workflowVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/workflows/{WorkflowArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWorkflowRequest",
}) as any as S.Schema<DeleteWorkflowRequest>;
export interface ListWorkflowsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListWorkflowsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workflows" }),
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
export interface GetWorkflowRunRequest {
  WorkflowArn: string;
  RunId: string;
}
export const GetWorkflowRunRequest = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workflows/{WorkflowArn}/runs/{RunId}" }),
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
export interface StopWorkflowRunRequest {
  WorkflowArn: string;
  RunId: string;
}
export const StopWorkflowRunRequest = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/workflows/{WorkflowArn}/runs/{RunId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopWorkflowRunRequest",
}) as any as S.Schema<StopWorkflowRunRequest>;
export interface ListWorkflowRunsRequest {
  MaxResults?: number;
  NextToken?: string;
  WorkflowArn: string;
  WorkflowVersion?: string;
}
export const ListWorkflowRunsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    WorkflowVersion: S.optional(S.String).pipe(T.HttpQuery("workflowVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workflows/{WorkflowArn}/runs" }),
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
export interface ListWorkflowVersionsRequest {
  MaxResults?: number;
  NextToken?: string;
  WorkflowArn: string;
}
export const ListWorkflowVersionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workflows/{WorkflowArn}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkflowVersionsRequest",
}) as any as S.Schema<ListWorkflowVersionsRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface EncryptionConfiguration {
  Type: string;
  KmsKeyId?: string;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({ Type: S.String, KmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export type WarningMessages = string[];
export const WarningMessages = S.Array(S.String);
export type ObjectMap = { [key: string]: any };
export const ObjectMap = S.Record({ key: S.String, value: S.Any });
export interface ListTagsForResourceResponse {
  Tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface CreateWorkflowRequest {
  Name: string;
  ClientToken?: string;
  DefinitionS3Location: DefinitionS3Location;
  RoleArn: string;
  Description?: string;
  EncryptionConfiguration?: EncryptionConfiguration;
  LoggingConfiguration?: LoggingConfiguration;
  EngineVersion?: number;
  NetworkConfiguration?: NetworkConfiguration;
  Tags?: Tags;
  TriggerMode?: string;
}
export const CreateWorkflowRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workflows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWorkflowRequest",
}) as any as S.Schema<CreateWorkflowRequest>;
export interface UpdateWorkflowResponse {
  WorkflowArn: string;
  ModifiedAt?: Date;
  WorkflowVersion?: string;
  Warnings?: WarningMessages;
}
export const UpdateWorkflowResponse = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.String,
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    WorkflowVersion: S.optional(S.String),
    Warnings: S.optional(WarningMessages),
  }),
).annotations({
  identifier: "UpdateWorkflowResponse",
}) as any as S.Schema<UpdateWorkflowResponse>;
export interface DeleteWorkflowResponse {
  WorkflowArn: string;
  WorkflowVersion?: string;
}
export const DeleteWorkflowResponse = S.suspend(() =>
  S.Struct({ WorkflowArn: S.String, WorkflowVersion: S.optional(S.String) }),
).annotations({
  identifier: "DeleteWorkflowResponse",
}) as any as S.Schema<DeleteWorkflowResponse>;
export interface StartWorkflowRunRequest {
  WorkflowArn: string;
  ClientToken?: string;
  OverrideParameters?: ObjectMap;
  WorkflowVersion?: string;
}
export const StartWorkflowRunRequest = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.String.pipe(T.HttpLabel("WorkflowArn")),
    ClientToken: S.optional(S.String),
    OverrideParameters: S.optional(ObjectMap),
    WorkflowVersion: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workflows/{WorkflowArn}/runs" }),
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
export interface StopWorkflowRunResponse {
  WorkflowArn?: string;
  WorkflowVersion?: string;
  RunId?: string;
  Status?: string;
}
export const StopWorkflowRunResponse = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.optional(S.String),
    WorkflowVersion: S.optional(S.String),
    RunId: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "StopWorkflowRunResponse",
}) as any as S.Schema<StopWorkflowRunResponse>;
export type TaskInstanceIds = string[];
export const TaskInstanceIds = S.Array(S.String);
export type GenericMap = { [key: string]: string };
export const GenericMap = S.Record({ key: S.String, value: S.String });
export interface TaskInstanceSummary {
  WorkflowArn?: string;
  WorkflowVersion?: string;
  RunId?: string;
  TaskInstanceId?: string;
  Status?: string;
  DurationInSeconds?: number;
  OperatorName?: string;
}
export const TaskInstanceSummary = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.optional(S.String),
    WorkflowVersion: S.optional(S.String),
    RunId: S.optional(S.String),
    TaskInstanceId: S.optional(S.String),
    Status: S.optional(S.String),
    DurationInSeconds: S.optional(S.Number),
    OperatorName: S.optional(S.String),
  }),
).annotations({
  identifier: "TaskInstanceSummary",
}) as any as S.Schema<TaskInstanceSummary>;
export type TaskInstanceSummaries = TaskInstanceSummary[];
export const TaskInstanceSummaries = S.Array(TaskInstanceSummary);
export interface ScheduleConfiguration {
  CronExpression?: string;
}
export const ScheduleConfiguration = S.suspend(() =>
  S.Struct({ CronExpression: S.optional(S.String) }),
).annotations({
  identifier: "ScheduleConfiguration",
}) as any as S.Schema<ScheduleConfiguration>;
export interface WorkflowSummary {
  WorkflowArn: string;
  WorkflowVersion?: string;
  Name?: string;
  Description?: string;
  CreatedAt?: Date;
  ModifiedAt?: Date;
  WorkflowStatus?: string;
  TriggerMode?: string;
}
export const WorkflowSummary = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.String,
    WorkflowVersion: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    WorkflowStatus: S.optional(S.String),
    TriggerMode: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkflowSummary",
}) as any as S.Schema<WorkflowSummary>;
export type WorkflowSummaries = WorkflowSummary[];
export const WorkflowSummaries = S.Array(WorkflowSummary);
export interface WorkflowRunDetail {
  WorkflowArn?: string;
  WorkflowVersion?: string;
  RunId?: string;
  RunType?: string;
  StartedOn?: Date;
  CreatedAt?: Date;
  CompletedOn?: Date;
  ModifiedAt?: Date;
  Duration?: number;
  ErrorMessage?: string;
  TaskInstances?: TaskInstanceIds;
  RunState?: string;
}
export const WorkflowRunDetail = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "WorkflowRunDetail",
}) as any as S.Schema<WorkflowRunDetail>;
export interface WorkflowVersionSummary {
  WorkflowVersion: string;
  WorkflowArn: string;
  IsLatestVersion?: boolean;
  CreatedAt?: Date;
  ModifiedAt?: Date;
  DefinitionS3Location?: DefinitionS3Location;
  ScheduleConfiguration?: ScheduleConfiguration;
  TriggerMode?: string;
}
export const WorkflowVersionSummary = S.suspend(() =>
  S.Struct({
    WorkflowVersion: S.String,
    WorkflowArn: S.String,
    IsLatestVersion: S.optional(S.Boolean),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DefinitionS3Location: S.optional(DefinitionS3Location),
    ScheduleConfiguration: S.optional(ScheduleConfiguration),
    TriggerMode: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkflowVersionSummary",
}) as any as S.Schema<WorkflowVersionSummary>;
export type WorkflowVersionSummaries = WorkflowVersionSummary[];
export const WorkflowVersionSummaries = S.Array(WorkflowVersionSummary);
export interface GetTaskInstanceResponse {
  WorkflowArn: string;
  RunId: string;
  TaskInstanceId: string;
  WorkflowVersion?: string;
  Status?: string;
  DurationInSeconds?: number;
  OperatorName?: string;
  ModifiedAt?: Date;
  EndedAt?: Date;
  StartedAt?: Date;
  AttemptNumber?: number;
  ErrorMessage?: string;
  TaskId?: string;
  LogStream?: string;
  Xcom?: GenericMap;
}
export const GetTaskInstanceResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetTaskInstanceResponse",
}) as any as S.Schema<GetTaskInstanceResponse>;
export interface ListTaskInstancesResponse {
  TaskInstances?: TaskInstanceSummaries;
  NextToken?: string;
}
export const ListTaskInstancesResponse = S.suspend(() =>
  S.Struct({
    TaskInstances: S.optional(TaskInstanceSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTaskInstancesResponse",
}) as any as S.Schema<ListTaskInstancesResponse>;
export interface CreateWorkflowResponse {
  WorkflowArn: string;
  CreatedAt?: Date;
  RevisionId?: string;
  WorkflowStatus?: string;
  WorkflowVersion?: string;
  IsLatestVersion?: boolean;
  Warnings?: WarningMessages;
}
export const CreateWorkflowResponse = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.String,
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    RevisionId: S.optional(S.String),
    WorkflowStatus: S.optional(S.String),
    WorkflowVersion: S.optional(S.String),
    IsLatestVersion: S.optional(S.Boolean),
    Warnings: S.optional(WarningMessages),
  }),
).annotations({
  identifier: "CreateWorkflowResponse",
}) as any as S.Schema<CreateWorkflowResponse>;
export interface GetWorkflowResponse {
  WorkflowArn: string;
  WorkflowVersion?: string;
  Name?: string;
  Description?: string;
  CreatedAt?: Date;
  ModifiedAt?: Date;
  EncryptionConfiguration?: EncryptionConfiguration;
  LoggingConfiguration?: LoggingConfiguration;
  EngineVersion?: number;
  WorkflowStatus?: string;
  DefinitionS3Location?: DefinitionS3Location;
  ScheduleConfiguration?: ScheduleConfiguration;
  RoleArn?: string;
  NetworkConfiguration?: NetworkConfiguration;
  TriggerMode?: string;
  WorkflowDefinition?: string;
}
export const GetWorkflowResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetWorkflowResponse",
}) as any as S.Schema<GetWorkflowResponse>;
export interface ListWorkflowsResponse {
  Workflows: WorkflowSummaries;
  NextToken?: string;
}
export const ListWorkflowsResponse = S.suspend(() =>
  S.Struct({ Workflows: WorkflowSummaries, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListWorkflowsResponse",
}) as any as S.Schema<ListWorkflowsResponse>;
export interface StartWorkflowRunResponse {
  RunId?: string;
  Status?: string;
  StartedAt?: Date;
}
export const StartWorkflowRunResponse = S.suspend(() =>
  S.Struct({
    RunId: S.optional(S.String),
    Status: S.optional(S.String),
    StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StartWorkflowRunResponse",
}) as any as S.Schema<StartWorkflowRunResponse>;
export interface GetWorkflowRunResponse {
  WorkflowArn?: string;
  WorkflowVersion?: string;
  RunId?: string;
  RunType?: string;
  OverrideParameters?: ObjectMap;
  RunDetail?: WorkflowRunDetail;
}
export const GetWorkflowRunResponse = S.suspend(() =>
  S.Struct({
    WorkflowArn: S.optional(S.String),
    WorkflowVersion: S.optional(S.String),
    RunId: S.optional(S.String),
    RunType: S.optional(S.String),
    OverrideParameters: S.optional(ObjectMap),
    RunDetail: S.optional(WorkflowRunDetail),
  }),
).annotations({
  identifier: "GetWorkflowRunResponse",
}) as any as S.Schema<GetWorkflowRunResponse>;
export interface ListWorkflowVersionsResponse {
  WorkflowVersions?: WorkflowVersionSummaries;
  NextToken?: string;
}
export const ListWorkflowVersionsResponse = S.suspend(() =>
  S.Struct({
    WorkflowVersions: S.optional(WorkflowVersionSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkflowVersionsResponse",
}) as any as S.Schema<ListWorkflowVersionsResponse>;
export interface RunDetailSummary {
  Status?: string;
  CreatedOn?: Date;
  StartedAt?: Date;
  EndedAt?: Date;
}
export const RunDetailSummary = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "RunDetailSummary",
}) as any as S.Schema<RunDetailSummary>;
export interface WorkflowRunSummary {
  RunId?: string;
  WorkflowArn?: string;
  WorkflowVersion?: string;
  RunType?: string;
  RunDetailSummary?: RunDetailSummary;
}
export const WorkflowRunSummary = S.suspend(() =>
  S.Struct({
    RunId: S.optional(S.String),
    WorkflowArn: S.optional(S.String),
    WorkflowVersion: S.optional(S.String),
    RunType: S.optional(S.String),
    RunDetailSummary: S.optional(RunDetailSummary),
  }),
).annotations({
  identifier: "WorkflowRunSummary",
}) as any as S.Schema<WorkflowRunSummary>;
export type WorkflowRunSummaries = WorkflowRunSummary[];
export const WorkflowRunSummaries = S.Array(WorkflowRunSummary);
export interface ListWorkflowRunsResponse {
  WorkflowRuns?: WorkflowRunSummaries;
  NextToken?: string;
}
export const ListWorkflowRunsResponse = S.suspend(() =>
  S.Struct({
    WorkflowRuns: S.optional(WorkflowRunSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkflowRunsResponse",
}) as any as S.Schema<ListWorkflowRunsResponse>;
export interface ValidationExceptionField {
  Name: string;
  Message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ Name: S.String, Message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFields = ValidationExceptionField[];
export const ValidationExceptionFields = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withConflictError) {}
export class OperationTimeoutException extends S.TaggedError<OperationTimeoutException>()(
  "OperationTimeoutException",
  { Message: S.optional(S.String) },
).pipe(C.withTimeoutError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    ServiceCode: S.String,
    QuotaCode: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    ServiceCode: S.String,
    QuotaCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.String,
    FieldList: S.optional(ValidationExceptionFields),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists all runs for a specified workflow, with optional pagination and filtering support.
 */
export const listWorkflowRuns: {
  (
    input: ListWorkflowRunsRequest,
  ): Effect.Effect<
    ListWorkflowRunsResponse,
    | AccessDeniedException
    | InternalServerException
    | OperationTimeoutException
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
    | InternalServerException
    | OperationTimeoutException
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
    | InternalServerException
    | OperationTimeoutException
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
}));
/**
 * Creates a new workflow in Amazon Managed Workflows for Apache Airflow Serverless. This operation initializes a workflow with the specified configuration including the workflow definition, execution role, and optional settings for encryption, logging, and networking. You must provide the workflow definition as a YAML file stored in Amazon S3 that defines the DAG structure using supported Amazon Web Services operators. Amazon Managed Workflows for Apache Airflow Serverless automatically creates the first version of the workflow and sets up the necessary execution environment with multi-tenant isolation and security controls.
 */
export const createWorkflow: (
  input: CreateWorkflowRequest,
) => Effect.Effect<
  CreateWorkflowResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | OperationTimeoutException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTaskInstance: (
  input: GetTaskInstanceRequest,
) => Effect.Effect<
  GetTaskInstanceResponse,
  | AccessDeniedException
  | InternalServerException
  | OperationTimeoutException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWorkflow: (
  input: GetWorkflowRequest,
) => Effect.Effect<
  GetWorkflowResponse,
  | AccessDeniedException
  | InternalServerException
  | OperationTimeoutException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWorkflow: (
  input: UpdateWorkflowRequest,
) => Effect.Effect<
  UpdateWorkflowResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | OperationTimeoutException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startWorkflowRun: (
  input: StartWorkflowRunRequest,
) => Effect.Effect<
  StartWorkflowRunResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | OperationTimeoutException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWorkflowRun: (
  input: GetWorkflowRunRequest,
) => Effect.Effect<
  GetWorkflowRunResponse,
  | AccessDeniedException
  | InternalServerException
  | OperationTimeoutException
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
export const deleteWorkflow: (
  input: DeleteWorkflowRequest,
) => Effect.Effect<
  DeleteWorkflowResponse,
  | AccessDeniedException
  | InternalServerException
  | OperationTimeoutException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopWorkflowRun: (
  input: StopWorkflowRunRequest,
) => Effect.Effect<
  StopWorkflowRunResponse,
  | AccessDeniedException
  | InternalServerException
  | OperationTimeoutException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | OperationTimeoutException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | OperationTimeoutException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTaskInstances: {
  (
    input: ListTaskInstancesRequest,
  ): Effect.Effect<
    ListTaskInstancesResponse,
    | AccessDeniedException
    | InternalServerException
    | OperationTimeoutException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTaskInstancesRequest,
  ) => Stream.Stream<
    ListTaskInstancesResponse,
    | AccessDeniedException
    | InternalServerException
    | OperationTimeoutException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTaskInstancesRequest,
  ) => Stream.Stream<
    TaskInstanceSummary,
    | AccessDeniedException
    | InternalServerException
    | OperationTimeoutException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all workflows in your account, with optional pagination support. This operation returns summary information for workflows, showing only the most recently created version of each workflow. Amazon Managed Workflows for Apache Airflow Serverless maintains workflow metadata in a highly available, distributed storage system that enables efficient querying and filtering. The service implements proper access controls to ensure you can only view workflows that you have permissions to access, supporting both individual and team-based workflow management scenarios.
 */
export const listWorkflows: {
  (
    input: ListWorkflowsRequest,
  ): Effect.Effect<
    ListWorkflowsResponse,
    | AccessDeniedException
    | InternalServerException
    | OperationTimeoutException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkflowsRequest,
  ) => Stream.Stream<
    ListWorkflowsResponse,
    | AccessDeniedException
    | InternalServerException
    | OperationTimeoutException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkflowsRequest,
  ) => Stream.Stream<
    WorkflowSummary,
    | AccessDeniedException
    | InternalServerException
    | OperationTimeoutException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all versions of a specified workflow, with optional pagination support.
 */
export const listWorkflowVersions: {
  (
    input: ListWorkflowVersionsRequest,
  ): Effect.Effect<
    ListWorkflowVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | OperationTimeoutException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkflowVersionsRequest,
  ) => Stream.Stream<
    ListWorkflowVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | OperationTimeoutException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkflowVersionsRequest,
  ) => Stream.Stream<
    WorkflowVersionSummary,
    | AccessDeniedException
    | InternalServerException
    | OperationTimeoutException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | OperationTimeoutException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
