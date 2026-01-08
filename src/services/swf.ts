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
const ns = T.XmlNamespace("http://swf.amazonaws.com/doc/2012-01-25");
const svc = T.AwsApiService({
  sdkId: "SWF",
  serviceShapeName: "SimpleWorkflowService",
});
const auth = T.AwsAuthSigv4({ name: "swf" });
const ver = T.ServiceVersion("2012-01-25");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
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
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://swf.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://swf-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://swf-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://swf-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://swf.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://swf.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DomainName = string;
export type PageToken = string;
export type PageSize = number;
export type ReverseOrder = boolean;
export type Name = string;
export type Arn = string;
export type Identity = string;
export type StartAtPreviousStartedEvent = boolean;
export type TaskToken = string;
export type LimitedData = string;
export type Version = string;
export type Description = string;
export type DurationInSecondsOptional = string;
export type TaskPriority = string;
export type DurationInDays = string;
export type WorkflowId = string;
export type WorkflowRunIdOptional = string;
export type Data = string;
export type FailureReason = string;
export type SignalName = string;
export type Tag = string;
export type TerminateReason = string;
export type ResourceTagKey = string;
export type VersionOptional = string;
export type WorkflowRunId = string;
export type ResourceTagValue = string;
export type Count = number;
export type Truncated = boolean;
export type ErrorMessage = string;
export type ActivityId = string;
export type EventId = number;
export type Canceled = boolean;
export type MarkerName = string;
export type TimerId = string;
export type DurationInSeconds = string;
export type FunctionId = string;
export type FunctionName = string;
export type FunctionInput = string;
export type CauseMessage = string;
export type OpenDecisionTasksCount = number;

//# Schemas
export type RegistrationStatus = "REGISTERED" | "DEPRECATED";
export const RegistrationStatus = S.Literal("REGISTERED", "DEPRECATED");
export type ChildPolicy = "TERMINATE" | "REQUEST_CANCEL" | "ABANDON";
export const ChildPolicy = S.Literal("TERMINATE", "REQUEST_CANCEL", "ABANDON");
export type TagList = string[];
export const TagList = S.Array(S.String);
export type ResourceTagKeyList = string[];
export const ResourceTagKeyList = S.Array(S.String);
export interface ExecutionTimeFilter {
  oldestDate: Date;
  latestDate?: Date;
}
export const ExecutionTimeFilter = S.suspend(() =>
  S.Struct({
    oldestDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    latestDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ExecutionTimeFilter",
}) as any as S.Schema<ExecutionTimeFilter>;
export interface WorkflowTypeFilter {
  name: string;
  version?: string;
}
export const WorkflowTypeFilter = S.suspend(() =>
  S.Struct({ name: S.String, version: S.optional(S.String) }),
).annotations({
  identifier: "WorkflowTypeFilter",
}) as any as S.Schema<WorkflowTypeFilter>;
export interface TagFilter {
  tag: string;
}
export const TagFilter = S.suspend(() =>
  S.Struct({ tag: S.String }),
).annotations({ identifier: "TagFilter" }) as any as S.Schema<TagFilter>;
export interface WorkflowExecutionFilter {
  workflowId: string;
}
export const WorkflowExecutionFilter = S.suspend(() =>
  S.Struct({ workflowId: S.String }),
).annotations({
  identifier: "WorkflowExecutionFilter",
}) as any as S.Schema<WorkflowExecutionFilter>;
export interface CountOpenWorkflowExecutionsInput {
  domain: string;
  startTimeFilter: ExecutionTimeFilter;
  typeFilter?: WorkflowTypeFilter;
  tagFilter?: TagFilter;
  executionFilter?: WorkflowExecutionFilter;
}
export const CountOpenWorkflowExecutionsInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    startTimeFilter: ExecutionTimeFilter,
    typeFilter: S.optional(WorkflowTypeFilter),
    tagFilter: S.optional(TagFilter),
    executionFilter: S.optional(WorkflowExecutionFilter),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CountOpenWorkflowExecutionsInput",
}) as any as S.Schema<CountOpenWorkflowExecutionsInput>;
export interface TaskList {
  name: string;
}
export const TaskList = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({ identifier: "TaskList" }) as any as S.Schema<TaskList>;
export interface CountPendingDecisionTasksInput {
  domain: string;
  taskList: TaskList;
}
export const CountPendingDecisionTasksInput = S.suspend(() =>
  S.Struct({ domain: S.String, taskList: TaskList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CountPendingDecisionTasksInput",
}) as any as S.Schema<CountPendingDecisionTasksInput>;
export interface ActivityType {
  name: string;
  version: string;
}
export const ActivityType = S.suspend(() =>
  S.Struct({ name: S.String, version: S.String }),
).annotations({ identifier: "ActivityType" }) as any as S.Schema<ActivityType>;
export interface DeprecateActivityTypeInput {
  domain: string;
  activityType: ActivityType;
}
export const DeprecateActivityTypeInput = S.suspend(() =>
  S.Struct({ domain: S.String, activityType: ActivityType }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeprecateActivityTypeInput",
}) as any as S.Schema<DeprecateActivityTypeInput>;
export interface DeprecateActivityTypeResponse {}
export const DeprecateActivityTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeprecateActivityTypeResponse",
}) as any as S.Schema<DeprecateActivityTypeResponse>;
export interface DeprecateDomainInput {
  name: string;
}
export const DeprecateDomainInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeprecateDomainInput",
}) as any as S.Schema<DeprecateDomainInput>;
export interface DeprecateDomainResponse {}
export const DeprecateDomainResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeprecateDomainResponse",
}) as any as S.Schema<DeprecateDomainResponse>;
export interface WorkflowType {
  name: string;
  version: string;
}
export const WorkflowType = S.suspend(() =>
  S.Struct({ name: S.String, version: S.String }),
).annotations({ identifier: "WorkflowType" }) as any as S.Schema<WorkflowType>;
export interface DeprecateWorkflowTypeInput {
  domain: string;
  workflowType: WorkflowType;
}
export const DeprecateWorkflowTypeInput = S.suspend(() =>
  S.Struct({ domain: S.String, workflowType: WorkflowType }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeprecateWorkflowTypeInput",
}) as any as S.Schema<DeprecateWorkflowTypeInput>;
export interface DeprecateWorkflowTypeResponse {}
export const DeprecateWorkflowTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeprecateWorkflowTypeResponse",
}) as any as S.Schema<DeprecateWorkflowTypeResponse>;
export interface DescribeActivityTypeInput {
  domain: string;
  activityType: ActivityType;
}
export const DescribeActivityTypeInput = S.suspend(() =>
  S.Struct({ domain: S.String, activityType: ActivityType }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeActivityTypeInput",
}) as any as S.Schema<DescribeActivityTypeInput>;
export interface DescribeDomainInput {
  name: string;
}
export const DescribeDomainInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDomainInput",
}) as any as S.Schema<DescribeDomainInput>;
export interface DescribeWorkflowTypeInput {
  domain: string;
  workflowType: WorkflowType;
}
export const DescribeWorkflowTypeInput = S.suspend(() =>
  S.Struct({ domain: S.String, workflowType: WorkflowType }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeWorkflowTypeInput",
}) as any as S.Schema<DescribeWorkflowTypeInput>;
export interface WorkflowExecution {
  workflowId: string;
  runId: string;
}
export const WorkflowExecution = S.suspend(() =>
  S.Struct({ workflowId: S.String, runId: S.String }),
).annotations({
  identifier: "WorkflowExecution",
}) as any as S.Schema<WorkflowExecution>;
export interface GetWorkflowExecutionHistoryInput {
  domain: string;
  execution: WorkflowExecution;
  nextPageToken?: string;
  maximumPageSize?: number;
  reverseOrder?: boolean;
}
export const GetWorkflowExecutionHistoryInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    execution: WorkflowExecution,
    nextPageToken: S.optional(S.String),
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkflowExecutionHistoryInput",
}) as any as S.Schema<GetWorkflowExecutionHistoryInput>;
export interface ListActivityTypesInput {
  domain: string;
  name?: string;
  registrationStatus: RegistrationStatus;
  nextPageToken?: string;
  maximumPageSize?: number;
  reverseOrder?: boolean;
}
export const ListActivityTypesInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    name: S.optional(S.String),
    registrationStatus: RegistrationStatus,
    nextPageToken: S.optional(S.String),
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListActivityTypesInput",
}) as any as S.Schema<ListActivityTypesInput>;
export type CloseStatus =
  | "COMPLETED"
  | "FAILED"
  | "CANCELED"
  | "TERMINATED"
  | "CONTINUED_AS_NEW"
  | "TIMED_OUT";
export const CloseStatus = S.Literal(
  "COMPLETED",
  "FAILED",
  "CANCELED",
  "TERMINATED",
  "CONTINUED_AS_NEW",
  "TIMED_OUT",
);
export interface CloseStatusFilter {
  status: CloseStatus;
}
export const CloseStatusFilter = S.suspend(() =>
  S.Struct({ status: CloseStatus }),
).annotations({
  identifier: "CloseStatusFilter",
}) as any as S.Schema<CloseStatusFilter>;
export interface ListClosedWorkflowExecutionsInput {
  domain: string;
  startTimeFilter?: ExecutionTimeFilter;
  closeTimeFilter?: ExecutionTimeFilter;
  executionFilter?: WorkflowExecutionFilter;
  closeStatusFilter?: CloseStatusFilter;
  typeFilter?: WorkflowTypeFilter;
  tagFilter?: TagFilter;
  nextPageToken?: string;
  maximumPageSize?: number;
  reverseOrder?: boolean;
}
export const ListClosedWorkflowExecutionsInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    startTimeFilter: S.optional(ExecutionTimeFilter),
    closeTimeFilter: S.optional(ExecutionTimeFilter),
    executionFilter: S.optional(WorkflowExecutionFilter),
    closeStatusFilter: S.optional(CloseStatusFilter),
    typeFilter: S.optional(WorkflowTypeFilter),
    tagFilter: S.optional(TagFilter),
    nextPageToken: S.optional(S.String),
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClosedWorkflowExecutionsInput",
}) as any as S.Schema<ListClosedWorkflowExecutionsInput>;
export interface ListDomainsInput {
  nextPageToken?: string;
  registrationStatus: RegistrationStatus;
  maximumPageSize?: number;
  reverseOrder?: boolean;
}
export const ListDomainsInput = S.suspend(() =>
  S.Struct({
    nextPageToken: S.optional(S.String),
    registrationStatus: RegistrationStatus,
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainsInput",
}) as any as S.Schema<ListDomainsInput>;
export interface ListOpenWorkflowExecutionsInput {
  domain: string;
  startTimeFilter: ExecutionTimeFilter;
  typeFilter?: WorkflowTypeFilter;
  tagFilter?: TagFilter;
  nextPageToken?: string;
  maximumPageSize?: number;
  reverseOrder?: boolean;
  executionFilter?: WorkflowExecutionFilter;
}
export const ListOpenWorkflowExecutionsInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    startTimeFilter: ExecutionTimeFilter,
    typeFilter: S.optional(WorkflowTypeFilter),
    tagFilter: S.optional(TagFilter),
    nextPageToken: S.optional(S.String),
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
    executionFilter: S.optional(WorkflowExecutionFilter),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOpenWorkflowExecutionsInput",
}) as any as S.Schema<ListOpenWorkflowExecutionsInput>;
export interface ListTagsForResourceInput {
  resourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface ListWorkflowTypesInput {
  domain: string;
  name?: string;
  registrationStatus: RegistrationStatus;
  nextPageToken?: string;
  maximumPageSize?: number;
  reverseOrder?: boolean;
}
export const ListWorkflowTypesInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    name: S.optional(S.String),
    registrationStatus: RegistrationStatus,
    nextPageToken: S.optional(S.String),
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkflowTypesInput",
}) as any as S.Schema<ListWorkflowTypesInput>;
export interface PollForActivityTaskInput {
  domain: string;
  taskList: TaskList;
  identity?: string;
}
export const PollForActivityTaskInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    taskList: TaskList,
    identity: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PollForActivityTaskInput",
}) as any as S.Schema<PollForActivityTaskInput>;
export interface PollForDecisionTaskInput {
  domain: string;
  taskList: TaskList;
  identity?: string;
  nextPageToken?: string;
  maximumPageSize?: number;
  reverseOrder?: boolean;
  startAtPreviousStartedEvent?: boolean;
}
export const PollForDecisionTaskInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    taskList: TaskList,
    identity: S.optional(S.String),
    nextPageToken: S.optional(S.String),
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
    startAtPreviousStartedEvent: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PollForDecisionTaskInput",
}) as any as S.Schema<PollForDecisionTaskInput>;
export interface RecordActivityTaskHeartbeatInput {
  taskToken: string;
  details?: string;
}
export const RecordActivityTaskHeartbeatInput = S.suspend(() =>
  S.Struct({ taskToken: S.String, details: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RecordActivityTaskHeartbeatInput",
}) as any as S.Schema<RecordActivityTaskHeartbeatInput>;
export interface RegisterActivityTypeInput {
  domain: string;
  name: string;
  version: string;
  description?: string;
  defaultTaskStartToCloseTimeout?: string;
  defaultTaskHeartbeatTimeout?: string;
  defaultTaskList?: TaskList;
  defaultTaskPriority?: string;
  defaultTaskScheduleToStartTimeout?: string;
  defaultTaskScheduleToCloseTimeout?: string;
}
export const RegisterActivityTypeInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    name: S.String,
    version: S.String,
    description: S.optional(S.String),
    defaultTaskStartToCloseTimeout: S.optional(S.String),
    defaultTaskHeartbeatTimeout: S.optional(S.String),
    defaultTaskList: S.optional(TaskList),
    defaultTaskPriority: S.optional(S.String),
    defaultTaskScheduleToStartTimeout: S.optional(S.String),
    defaultTaskScheduleToCloseTimeout: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterActivityTypeInput",
}) as any as S.Schema<RegisterActivityTypeInput>;
export interface RegisterActivityTypeResponse {}
export const RegisterActivityTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RegisterActivityTypeResponse",
}) as any as S.Schema<RegisterActivityTypeResponse>;
export interface RegisterWorkflowTypeInput {
  domain: string;
  name: string;
  version: string;
  description?: string;
  defaultTaskStartToCloseTimeout?: string;
  defaultExecutionStartToCloseTimeout?: string;
  defaultTaskList?: TaskList;
  defaultTaskPriority?: string;
  defaultChildPolicy?: ChildPolicy;
  defaultLambdaRole?: string;
}
export const RegisterWorkflowTypeInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    name: S.String,
    version: S.String,
    description: S.optional(S.String),
    defaultTaskStartToCloseTimeout: S.optional(S.String),
    defaultExecutionStartToCloseTimeout: S.optional(S.String),
    defaultTaskList: S.optional(TaskList),
    defaultTaskPriority: S.optional(S.String),
    defaultChildPolicy: S.optional(ChildPolicy),
    defaultLambdaRole: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterWorkflowTypeInput",
}) as any as S.Schema<RegisterWorkflowTypeInput>;
export interface RegisterWorkflowTypeResponse {}
export const RegisterWorkflowTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RegisterWorkflowTypeResponse",
}) as any as S.Schema<RegisterWorkflowTypeResponse>;
export interface RequestCancelWorkflowExecutionInput {
  domain: string;
  workflowId: string;
  runId?: string;
}
export const RequestCancelWorkflowExecutionInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    workflowId: S.String,
    runId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RequestCancelWorkflowExecutionInput",
}) as any as S.Schema<RequestCancelWorkflowExecutionInput>;
export interface RequestCancelWorkflowExecutionResponse {}
export const RequestCancelWorkflowExecutionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RequestCancelWorkflowExecutionResponse",
}) as any as S.Schema<RequestCancelWorkflowExecutionResponse>;
export interface RespondActivityTaskCanceledInput {
  taskToken: string;
  details?: string;
}
export const RespondActivityTaskCanceledInput = S.suspend(() =>
  S.Struct({ taskToken: S.String, details: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RespondActivityTaskCanceledInput",
}) as any as S.Schema<RespondActivityTaskCanceledInput>;
export interface RespondActivityTaskCanceledResponse {}
export const RespondActivityTaskCanceledResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RespondActivityTaskCanceledResponse",
}) as any as S.Schema<RespondActivityTaskCanceledResponse>;
export interface RespondActivityTaskCompletedInput {
  taskToken: string;
  result?: string;
}
export const RespondActivityTaskCompletedInput = S.suspend(() =>
  S.Struct({ taskToken: S.String, result: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RespondActivityTaskCompletedInput",
}) as any as S.Schema<RespondActivityTaskCompletedInput>;
export interface RespondActivityTaskCompletedResponse {}
export const RespondActivityTaskCompletedResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RespondActivityTaskCompletedResponse",
}) as any as S.Schema<RespondActivityTaskCompletedResponse>;
export interface RespondActivityTaskFailedInput {
  taskToken: string;
  reason?: string;
  details?: string;
}
export const RespondActivityTaskFailedInput = S.suspend(() =>
  S.Struct({
    taskToken: S.String,
    reason: S.optional(S.String),
    details: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RespondActivityTaskFailedInput",
}) as any as S.Schema<RespondActivityTaskFailedInput>;
export interface RespondActivityTaskFailedResponse {}
export const RespondActivityTaskFailedResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RespondActivityTaskFailedResponse",
}) as any as S.Schema<RespondActivityTaskFailedResponse>;
export interface SignalWorkflowExecutionInput {
  domain: string;
  workflowId: string;
  runId?: string;
  signalName: string;
  input?: string;
}
export const SignalWorkflowExecutionInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    workflowId: S.String,
    runId: S.optional(S.String),
    signalName: S.String,
    input: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SignalWorkflowExecutionInput",
}) as any as S.Schema<SignalWorkflowExecutionInput>;
export interface SignalWorkflowExecutionResponse {}
export const SignalWorkflowExecutionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SignalWorkflowExecutionResponse",
}) as any as S.Schema<SignalWorkflowExecutionResponse>;
export interface StartWorkflowExecutionInput {
  domain: string;
  workflowId: string;
  workflowType: WorkflowType;
  taskList?: TaskList;
  taskPriority?: string;
  input?: string;
  executionStartToCloseTimeout?: string;
  tagList?: string[];
  taskStartToCloseTimeout?: string;
  childPolicy?: ChildPolicy;
  lambdaRole?: string;
}
export const StartWorkflowExecutionInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    workflowId: S.String,
    workflowType: WorkflowType,
    taskList: S.optional(TaskList),
    taskPriority: S.optional(S.String),
    input: S.optional(S.String),
    executionStartToCloseTimeout: S.optional(S.String),
    tagList: S.optional(TagList),
    taskStartToCloseTimeout: S.optional(S.String),
    childPolicy: S.optional(ChildPolicy),
    lambdaRole: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartWorkflowExecutionInput",
}) as any as S.Schema<StartWorkflowExecutionInput>;
export interface ResourceTag {
  key: string;
  value?: string;
}
export const ResourceTag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.optional(S.String) }),
).annotations({ identifier: "ResourceTag" }) as any as S.Schema<ResourceTag>;
export type ResourceTagList = ResourceTag[];
export const ResourceTagList = S.Array(ResourceTag);
export interface TagResourceInput {
  resourceArn: string;
  tags: ResourceTag[];
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: ResourceTagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface TerminateWorkflowExecutionInput {
  domain: string;
  workflowId: string;
  runId?: string;
  reason?: string;
  details?: string;
  childPolicy?: ChildPolicy;
}
export const TerminateWorkflowExecutionInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    workflowId: S.String,
    runId: S.optional(S.String),
    reason: S.optional(S.String),
    details: S.optional(S.String),
    childPolicy: S.optional(ChildPolicy),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TerminateWorkflowExecutionInput",
}) as any as S.Schema<TerminateWorkflowExecutionInput>;
export interface TerminateWorkflowExecutionResponse {}
export const TerminateWorkflowExecutionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TerminateWorkflowExecutionResponse",
}) as any as S.Schema<TerminateWorkflowExecutionResponse>;
export interface UndeprecateActivityTypeInput {
  domain: string;
  activityType: ActivityType;
}
export const UndeprecateActivityTypeInput = S.suspend(() =>
  S.Struct({ domain: S.String, activityType: ActivityType }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UndeprecateActivityTypeInput",
}) as any as S.Schema<UndeprecateActivityTypeInput>;
export interface UndeprecateActivityTypeResponse {}
export const UndeprecateActivityTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UndeprecateActivityTypeResponse",
}) as any as S.Schema<UndeprecateActivityTypeResponse>;
export interface UndeprecateDomainInput {
  name: string;
}
export const UndeprecateDomainInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UndeprecateDomainInput",
}) as any as S.Schema<UndeprecateDomainInput>;
export interface UndeprecateDomainResponse {}
export const UndeprecateDomainResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UndeprecateDomainResponse",
}) as any as S.Schema<UndeprecateDomainResponse>;
export interface UndeprecateWorkflowTypeInput {
  domain: string;
  workflowType: WorkflowType;
}
export const UndeprecateWorkflowTypeInput = S.suspend(() =>
  S.Struct({ domain: S.String, workflowType: WorkflowType }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UndeprecateWorkflowTypeInput",
}) as any as S.Schema<UndeprecateWorkflowTypeInput>;
export interface UndeprecateWorkflowTypeResponse {}
export const UndeprecateWorkflowTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UndeprecateWorkflowTypeResponse",
}) as any as S.Schema<UndeprecateWorkflowTypeResponse>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: ResourceTagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type DecisionType =
  | "ScheduleActivityTask"
  | "RequestCancelActivityTask"
  | "CompleteWorkflowExecution"
  | "FailWorkflowExecution"
  | "CancelWorkflowExecution"
  | "ContinueAsNewWorkflowExecution"
  | "RecordMarker"
  | "StartTimer"
  | "CancelTimer"
  | "SignalExternalWorkflowExecution"
  | "RequestCancelExternalWorkflowExecution"
  | "StartChildWorkflowExecution"
  | "ScheduleLambdaFunction";
export const DecisionType = S.Literal(
  "ScheduleActivityTask",
  "RequestCancelActivityTask",
  "CompleteWorkflowExecution",
  "FailWorkflowExecution",
  "CancelWorkflowExecution",
  "ContinueAsNewWorkflowExecution",
  "RecordMarker",
  "StartTimer",
  "CancelTimer",
  "SignalExternalWorkflowExecution",
  "RequestCancelExternalWorkflowExecution",
  "StartChildWorkflowExecution",
  "ScheduleLambdaFunction",
);
export interface ActivityTypeInfo {
  activityType: ActivityType;
  status: RegistrationStatus;
  description?: string;
  creationDate: Date;
  deprecationDate?: Date;
}
export const ActivityTypeInfo = S.suspend(() =>
  S.Struct({
    activityType: ActivityType,
    status: RegistrationStatus,
    description: S.optional(S.String),
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    deprecationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ActivityTypeInfo",
}) as any as S.Schema<ActivityTypeInfo>;
export type ActivityTypeInfoList = ActivityTypeInfo[];
export const ActivityTypeInfoList = S.Array(ActivityTypeInfo);
export interface DomainInfo {
  name: string;
  status: RegistrationStatus;
  description?: string;
  arn?: string;
}
export const DomainInfo = S.suspend(() =>
  S.Struct({
    name: S.String,
    status: RegistrationStatus,
    description: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "DomainInfo" }) as any as S.Schema<DomainInfo>;
export type DomainInfoList = DomainInfo[];
export const DomainInfoList = S.Array(DomainInfo);
export interface WorkflowTypeInfo {
  workflowType: WorkflowType;
  status: RegistrationStatus;
  description?: string;
  creationDate: Date;
  deprecationDate?: Date;
}
export const WorkflowTypeInfo = S.suspend(() =>
  S.Struct({
    workflowType: WorkflowType,
    status: RegistrationStatus,
    description: S.optional(S.String),
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    deprecationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "WorkflowTypeInfo",
}) as any as S.Schema<WorkflowTypeInfo>;
export type WorkflowTypeInfoList = WorkflowTypeInfo[];
export const WorkflowTypeInfoList = S.Array(WorkflowTypeInfo);
export interface CountClosedWorkflowExecutionsInput {
  domain: string;
  startTimeFilter?: ExecutionTimeFilter;
  closeTimeFilter?: ExecutionTimeFilter;
  executionFilter?: WorkflowExecutionFilter;
  typeFilter?: WorkflowTypeFilter;
  tagFilter?: TagFilter;
  closeStatusFilter?: CloseStatusFilter;
}
export const CountClosedWorkflowExecutionsInput = S.suspend(() =>
  S.Struct({
    domain: S.String,
    startTimeFilter: S.optional(ExecutionTimeFilter),
    closeTimeFilter: S.optional(ExecutionTimeFilter),
    executionFilter: S.optional(WorkflowExecutionFilter),
    typeFilter: S.optional(WorkflowTypeFilter),
    tagFilter: S.optional(TagFilter),
    closeStatusFilter: S.optional(CloseStatusFilter),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CountClosedWorkflowExecutionsInput",
}) as any as S.Schema<CountClosedWorkflowExecutionsInput>;
export interface WorkflowExecutionCount {
  count: number;
  truncated?: boolean;
}
export const WorkflowExecutionCount = S.suspend(() =>
  S.Struct({ count: S.Number, truncated: S.optional(S.Boolean) }).pipe(ns),
).annotations({
  identifier: "WorkflowExecutionCount",
}) as any as S.Schema<WorkflowExecutionCount>;
export interface CountPendingActivityTasksInput {
  domain: string;
  taskList: TaskList;
}
export const CountPendingActivityTasksInput = S.suspend(() =>
  S.Struct({ domain: S.String, taskList: TaskList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CountPendingActivityTasksInput",
}) as any as S.Schema<CountPendingActivityTasksInput>;
export interface PendingTaskCount {
  count: number;
  truncated?: boolean;
}
export const PendingTaskCount = S.suspend(() =>
  S.Struct({ count: S.Number, truncated: S.optional(S.Boolean) }).pipe(ns),
).annotations({
  identifier: "PendingTaskCount",
}) as any as S.Schema<PendingTaskCount>;
export interface DeleteActivityTypeInput {
  domain: string;
  activityType: ActivityType;
}
export const DeleteActivityTypeInput = S.suspend(() =>
  S.Struct({ domain: S.String, activityType: ActivityType }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteActivityTypeInput",
}) as any as S.Schema<DeleteActivityTypeInput>;
export interface DeleteActivityTypeResponse {}
export const DeleteActivityTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteActivityTypeResponse",
}) as any as S.Schema<DeleteActivityTypeResponse>;
export interface DeleteWorkflowTypeInput {
  domain: string;
  workflowType: WorkflowType;
}
export const DeleteWorkflowTypeInput = S.suspend(() =>
  S.Struct({ domain: S.String, workflowType: WorkflowType }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWorkflowTypeInput",
}) as any as S.Schema<DeleteWorkflowTypeInput>;
export interface DeleteWorkflowTypeResponse {}
export const DeleteWorkflowTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteWorkflowTypeResponse",
}) as any as S.Schema<DeleteWorkflowTypeResponse>;
export interface DescribeWorkflowExecutionInput {
  domain: string;
  execution: WorkflowExecution;
}
export const DescribeWorkflowExecutionInput = S.suspend(() =>
  S.Struct({ domain: S.String, execution: WorkflowExecution }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeWorkflowExecutionInput",
}) as any as S.Schema<DescribeWorkflowExecutionInput>;
export interface ActivityTypeInfos {
  typeInfos: ActivityTypeInfo[];
  nextPageToken?: string;
}
export const ActivityTypeInfos = S.suspend(() =>
  S.Struct({
    typeInfos: ActivityTypeInfoList,
    nextPageToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ActivityTypeInfos",
}) as any as S.Schema<ActivityTypeInfos>;
export interface DomainInfos {
  domainInfos: DomainInfo[];
  nextPageToken?: string;
}
export const DomainInfos = S.suspend(() =>
  S.Struct({
    domainInfos: DomainInfoList,
    nextPageToken: S.optional(S.String),
  }).pipe(ns),
).annotations({ identifier: "DomainInfos" }) as any as S.Schema<DomainInfos>;
export interface ListTagsForResourceOutput {
  tags?: ResourceTag[];
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: S.optional(ResourceTagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface WorkflowTypeInfos {
  typeInfos: WorkflowTypeInfo[];
  nextPageToken?: string;
}
export const WorkflowTypeInfos = S.suspend(() =>
  S.Struct({
    typeInfos: WorkflowTypeInfoList,
    nextPageToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "WorkflowTypeInfos",
}) as any as S.Schema<WorkflowTypeInfos>;
export interface ActivityTask {
  taskToken: string;
  activityId: string;
  startedEventId: number;
  workflowExecution: WorkflowExecution;
  activityType: ActivityType;
  input?: string;
}
export const ActivityTask = S.suspend(() =>
  S.Struct({
    taskToken: S.String,
    activityId: S.String,
    startedEventId: S.Number,
    workflowExecution: WorkflowExecution,
    activityType: ActivityType,
    input: S.optional(S.String),
  }).pipe(ns),
).annotations({ identifier: "ActivityTask" }) as any as S.Schema<ActivityTask>;
export type EventType =
  | "WorkflowExecutionStarted"
  | "WorkflowExecutionCancelRequested"
  | "WorkflowExecutionCompleted"
  | "CompleteWorkflowExecutionFailed"
  | "WorkflowExecutionFailed"
  | "FailWorkflowExecutionFailed"
  | "WorkflowExecutionTimedOut"
  | "WorkflowExecutionCanceled"
  | "CancelWorkflowExecutionFailed"
  | "WorkflowExecutionContinuedAsNew"
  | "ContinueAsNewWorkflowExecutionFailed"
  | "WorkflowExecutionTerminated"
  | "DecisionTaskScheduled"
  | "DecisionTaskStarted"
  | "DecisionTaskCompleted"
  | "DecisionTaskTimedOut"
  | "ActivityTaskScheduled"
  | "ScheduleActivityTaskFailed"
  | "ActivityTaskStarted"
  | "ActivityTaskCompleted"
  | "ActivityTaskFailed"
  | "ActivityTaskTimedOut"
  | "ActivityTaskCanceled"
  | "ActivityTaskCancelRequested"
  | "RequestCancelActivityTaskFailed"
  | "WorkflowExecutionSignaled"
  | "MarkerRecorded"
  | "RecordMarkerFailed"
  | "TimerStarted"
  | "StartTimerFailed"
  | "TimerFired"
  | "TimerCanceled"
  | "CancelTimerFailed"
  | "StartChildWorkflowExecutionInitiated"
  | "StartChildWorkflowExecutionFailed"
  | "ChildWorkflowExecutionStarted"
  | "ChildWorkflowExecutionCompleted"
  | "ChildWorkflowExecutionFailed"
  | "ChildWorkflowExecutionTimedOut"
  | "ChildWorkflowExecutionCanceled"
  | "ChildWorkflowExecutionTerminated"
  | "SignalExternalWorkflowExecutionInitiated"
  | "SignalExternalWorkflowExecutionFailed"
  | "ExternalWorkflowExecutionSignaled"
  | "RequestCancelExternalWorkflowExecutionInitiated"
  | "RequestCancelExternalWorkflowExecutionFailed"
  | "ExternalWorkflowExecutionCancelRequested"
  | "LambdaFunctionScheduled"
  | "LambdaFunctionStarted"
  | "LambdaFunctionCompleted"
  | "LambdaFunctionFailed"
  | "LambdaFunctionTimedOut"
  | "ScheduleLambdaFunctionFailed"
  | "StartLambdaFunctionFailed";
export const EventType = S.Literal(
  "WorkflowExecutionStarted",
  "WorkflowExecutionCancelRequested",
  "WorkflowExecutionCompleted",
  "CompleteWorkflowExecutionFailed",
  "WorkflowExecutionFailed",
  "FailWorkflowExecutionFailed",
  "WorkflowExecutionTimedOut",
  "WorkflowExecutionCanceled",
  "CancelWorkflowExecutionFailed",
  "WorkflowExecutionContinuedAsNew",
  "ContinueAsNewWorkflowExecutionFailed",
  "WorkflowExecutionTerminated",
  "DecisionTaskScheduled",
  "DecisionTaskStarted",
  "DecisionTaskCompleted",
  "DecisionTaskTimedOut",
  "ActivityTaskScheduled",
  "ScheduleActivityTaskFailed",
  "ActivityTaskStarted",
  "ActivityTaskCompleted",
  "ActivityTaskFailed",
  "ActivityTaskTimedOut",
  "ActivityTaskCanceled",
  "ActivityTaskCancelRequested",
  "RequestCancelActivityTaskFailed",
  "WorkflowExecutionSignaled",
  "MarkerRecorded",
  "RecordMarkerFailed",
  "TimerStarted",
  "StartTimerFailed",
  "TimerFired",
  "TimerCanceled",
  "CancelTimerFailed",
  "StartChildWorkflowExecutionInitiated",
  "StartChildWorkflowExecutionFailed",
  "ChildWorkflowExecutionStarted",
  "ChildWorkflowExecutionCompleted",
  "ChildWorkflowExecutionFailed",
  "ChildWorkflowExecutionTimedOut",
  "ChildWorkflowExecutionCanceled",
  "ChildWorkflowExecutionTerminated",
  "SignalExternalWorkflowExecutionInitiated",
  "SignalExternalWorkflowExecutionFailed",
  "ExternalWorkflowExecutionSignaled",
  "RequestCancelExternalWorkflowExecutionInitiated",
  "RequestCancelExternalWorkflowExecutionFailed",
  "ExternalWorkflowExecutionCancelRequested",
  "LambdaFunctionScheduled",
  "LambdaFunctionStarted",
  "LambdaFunctionCompleted",
  "LambdaFunctionFailed",
  "LambdaFunctionTimedOut",
  "ScheduleLambdaFunctionFailed",
  "StartLambdaFunctionFailed",
);
export interface WorkflowExecutionStartedEventAttributes {
  input?: string;
  executionStartToCloseTimeout?: string;
  taskStartToCloseTimeout?: string;
  childPolicy: ChildPolicy;
  taskList: TaskList;
  taskPriority?: string;
  workflowType: WorkflowType;
  tagList?: string[];
  continuedExecutionRunId?: string;
  parentWorkflowExecution?: WorkflowExecution;
  parentInitiatedEventId?: number;
  lambdaRole?: string;
}
export const WorkflowExecutionStartedEventAttributes = S.suspend(() =>
  S.Struct({
    input: S.optional(S.String),
    executionStartToCloseTimeout: S.optional(S.String),
    taskStartToCloseTimeout: S.optional(S.String),
    childPolicy: ChildPolicy,
    taskList: TaskList,
    taskPriority: S.optional(S.String),
    workflowType: WorkflowType,
    tagList: S.optional(TagList),
    continuedExecutionRunId: S.optional(S.String),
    parentWorkflowExecution: S.optional(WorkflowExecution),
    parentInitiatedEventId: S.optional(S.Number),
    lambdaRole: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkflowExecutionStartedEventAttributes",
}) as any as S.Schema<WorkflowExecutionStartedEventAttributes>;
export interface WorkflowExecutionCompletedEventAttributes {
  result?: string;
  decisionTaskCompletedEventId: number;
}
export const WorkflowExecutionCompletedEventAttributes = S.suspend(() =>
  S.Struct({
    result: S.optional(S.String),
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "WorkflowExecutionCompletedEventAttributes",
}) as any as S.Schema<WorkflowExecutionCompletedEventAttributes>;
export type CompleteWorkflowExecutionFailedCause =
  | "UNHANDLED_DECISION"
  | "OPERATION_NOT_PERMITTED";
export const CompleteWorkflowExecutionFailedCause = S.Literal(
  "UNHANDLED_DECISION",
  "OPERATION_NOT_PERMITTED",
);
export interface CompleteWorkflowExecutionFailedEventAttributes {
  cause: CompleteWorkflowExecutionFailedCause;
  decisionTaskCompletedEventId: number;
}
export const CompleteWorkflowExecutionFailedEventAttributes = S.suspend(() =>
  S.Struct({
    cause: CompleteWorkflowExecutionFailedCause,
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "CompleteWorkflowExecutionFailedEventAttributes",
}) as any as S.Schema<CompleteWorkflowExecutionFailedEventAttributes>;
export interface WorkflowExecutionFailedEventAttributes {
  reason?: string;
  details?: string;
  decisionTaskCompletedEventId: number;
}
export const WorkflowExecutionFailedEventAttributes = S.suspend(() =>
  S.Struct({
    reason: S.optional(S.String),
    details: S.optional(S.String),
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "WorkflowExecutionFailedEventAttributes",
}) as any as S.Schema<WorkflowExecutionFailedEventAttributes>;
export type FailWorkflowExecutionFailedCause =
  | "UNHANDLED_DECISION"
  | "OPERATION_NOT_PERMITTED";
export const FailWorkflowExecutionFailedCause = S.Literal(
  "UNHANDLED_DECISION",
  "OPERATION_NOT_PERMITTED",
);
export interface FailWorkflowExecutionFailedEventAttributes {
  cause: FailWorkflowExecutionFailedCause;
  decisionTaskCompletedEventId: number;
}
export const FailWorkflowExecutionFailedEventAttributes = S.suspend(() =>
  S.Struct({
    cause: FailWorkflowExecutionFailedCause,
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "FailWorkflowExecutionFailedEventAttributes",
}) as any as S.Schema<FailWorkflowExecutionFailedEventAttributes>;
export type WorkflowExecutionTimeoutType = "START_TO_CLOSE";
export const WorkflowExecutionTimeoutType = S.Literal("START_TO_CLOSE");
export interface WorkflowExecutionTimedOutEventAttributes {
  timeoutType: WorkflowExecutionTimeoutType;
  childPolicy: ChildPolicy;
}
export const WorkflowExecutionTimedOutEventAttributes = S.suspend(() =>
  S.Struct({
    timeoutType: WorkflowExecutionTimeoutType,
    childPolicy: ChildPolicy,
  }),
).annotations({
  identifier: "WorkflowExecutionTimedOutEventAttributes",
}) as any as S.Schema<WorkflowExecutionTimedOutEventAttributes>;
export interface WorkflowExecutionCanceledEventAttributes {
  details?: string;
  decisionTaskCompletedEventId: number;
}
export const WorkflowExecutionCanceledEventAttributes = S.suspend(() =>
  S.Struct({
    details: S.optional(S.String),
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "WorkflowExecutionCanceledEventAttributes",
}) as any as S.Schema<WorkflowExecutionCanceledEventAttributes>;
export type CancelWorkflowExecutionFailedCause =
  | "UNHANDLED_DECISION"
  | "OPERATION_NOT_PERMITTED";
export const CancelWorkflowExecutionFailedCause = S.Literal(
  "UNHANDLED_DECISION",
  "OPERATION_NOT_PERMITTED",
);
export interface CancelWorkflowExecutionFailedEventAttributes {
  cause: CancelWorkflowExecutionFailedCause;
  decisionTaskCompletedEventId: number;
}
export const CancelWorkflowExecutionFailedEventAttributes = S.suspend(() =>
  S.Struct({
    cause: CancelWorkflowExecutionFailedCause,
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "CancelWorkflowExecutionFailedEventAttributes",
}) as any as S.Schema<CancelWorkflowExecutionFailedEventAttributes>;
export interface WorkflowExecutionContinuedAsNewEventAttributes {
  input?: string;
  decisionTaskCompletedEventId: number;
  newExecutionRunId: string;
  executionStartToCloseTimeout?: string;
  taskList: TaskList;
  taskPriority?: string;
  taskStartToCloseTimeout?: string;
  childPolicy: ChildPolicy;
  tagList?: string[];
  workflowType: WorkflowType;
  lambdaRole?: string;
}
export const WorkflowExecutionContinuedAsNewEventAttributes = S.suspend(() =>
  S.Struct({
    input: S.optional(S.String),
    decisionTaskCompletedEventId: S.Number,
    newExecutionRunId: S.String,
    executionStartToCloseTimeout: S.optional(S.String),
    taskList: TaskList,
    taskPriority: S.optional(S.String),
    taskStartToCloseTimeout: S.optional(S.String),
    childPolicy: ChildPolicy,
    tagList: S.optional(TagList),
    workflowType: WorkflowType,
    lambdaRole: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkflowExecutionContinuedAsNewEventAttributes",
}) as any as S.Schema<WorkflowExecutionContinuedAsNewEventAttributes>;
export type ContinueAsNewWorkflowExecutionFailedCause =
  | "UNHANDLED_DECISION"
  | "WORKFLOW_TYPE_DEPRECATED"
  | "WORKFLOW_TYPE_DOES_NOT_EXIST"
  | "DEFAULT_EXECUTION_START_TO_CLOSE_TIMEOUT_UNDEFINED"
  | "DEFAULT_TASK_START_TO_CLOSE_TIMEOUT_UNDEFINED"
  | "DEFAULT_TASK_LIST_UNDEFINED"
  | "DEFAULT_CHILD_POLICY_UNDEFINED"
  | "CONTINUE_AS_NEW_WORKFLOW_EXECUTION_RATE_EXCEEDED"
  | "OPERATION_NOT_PERMITTED";
export const ContinueAsNewWorkflowExecutionFailedCause = S.Literal(
  "UNHANDLED_DECISION",
  "WORKFLOW_TYPE_DEPRECATED",
  "WORKFLOW_TYPE_DOES_NOT_EXIST",
  "DEFAULT_EXECUTION_START_TO_CLOSE_TIMEOUT_UNDEFINED",
  "DEFAULT_TASK_START_TO_CLOSE_TIMEOUT_UNDEFINED",
  "DEFAULT_TASK_LIST_UNDEFINED",
  "DEFAULT_CHILD_POLICY_UNDEFINED",
  "CONTINUE_AS_NEW_WORKFLOW_EXECUTION_RATE_EXCEEDED",
  "OPERATION_NOT_PERMITTED",
);
export interface ContinueAsNewWorkflowExecutionFailedEventAttributes {
  cause: ContinueAsNewWorkflowExecutionFailedCause;
  decisionTaskCompletedEventId: number;
}
export const ContinueAsNewWorkflowExecutionFailedEventAttributes = S.suspend(
  () =>
    S.Struct({
      cause: ContinueAsNewWorkflowExecutionFailedCause,
      decisionTaskCompletedEventId: S.Number,
    }),
).annotations({
  identifier: "ContinueAsNewWorkflowExecutionFailedEventAttributes",
}) as any as S.Schema<ContinueAsNewWorkflowExecutionFailedEventAttributes>;
export type WorkflowExecutionTerminatedCause =
  | "CHILD_POLICY_APPLIED"
  | "EVENT_LIMIT_EXCEEDED"
  | "OPERATOR_INITIATED";
export const WorkflowExecutionTerminatedCause = S.Literal(
  "CHILD_POLICY_APPLIED",
  "EVENT_LIMIT_EXCEEDED",
  "OPERATOR_INITIATED",
);
export interface WorkflowExecutionTerminatedEventAttributes {
  reason?: string;
  details?: string;
  childPolicy: ChildPolicy;
  cause?: WorkflowExecutionTerminatedCause;
}
export const WorkflowExecutionTerminatedEventAttributes = S.suspend(() =>
  S.Struct({
    reason: S.optional(S.String),
    details: S.optional(S.String),
    childPolicy: ChildPolicy,
    cause: S.optional(WorkflowExecutionTerminatedCause),
  }),
).annotations({
  identifier: "WorkflowExecutionTerminatedEventAttributes",
}) as any as S.Schema<WorkflowExecutionTerminatedEventAttributes>;
export type WorkflowExecutionCancelRequestedCause = "CHILD_POLICY_APPLIED";
export const WorkflowExecutionCancelRequestedCause = S.Literal(
  "CHILD_POLICY_APPLIED",
);
export interface WorkflowExecutionCancelRequestedEventAttributes {
  externalWorkflowExecution?: WorkflowExecution;
  externalInitiatedEventId?: number;
  cause?: WorkflowExecutionCancelRequestedCause;
}
export const WorkflowExecutionCancelRequestedEventAttributes = S.suspend(() =>
  S.Struct({
    externalWorkflowExecution: S.optional(WorkflowExecution),
    externalInitiatedEventId: S.optional(S.Number),
    cause: S.optional(WorkflowExecutionCancelRequestedCause),
  }),
).annotations({
  identifier: "WorkflowExecutionCancelRequestedEventAttributes",
}) as any as S.Schema<WorkflowExecutionCancelRequestedEventAttributes>;
export interface DecisionTaskScheduledEventAttributes {
  taskList: TaskList;
  taskPriority?: string;
  startToCloseTimeout?: string;
  scheduleToStartTimeout?: string;
}
export const DecisionTaskScheduledEventAttributes = S.suspend(() =>
  S.Struct({
    taskList: TaskList,
    taskPriority: S.optional(S.String),
    startToCloseTimeout: S.optional(S.String),
    scheduleToStartTimeout: S.optional(S.String),
  }),
).annotations({
  identifier: "DecisionTaskScheduledEventAttributes",
}) as any as S.Schema<DecisionTaskScheduledEventAttributes>;
export interface DecisionTaskStartedEventAttributes {
  identity?: string;
  scheduledEventId: number;
}
export const DecisionTaskStartedEventAttributes = S.suspend(() =>
  S.Struct({ identity: S.optional(S.String), scheduledEventId: S.Number }),
).annotations({
  identifier: "DecisionTaskStartedEventAttributes",
}) as any as S.Schema<DecisionTaskStartedEventAttributes>;
export interface DecisionTaskCompletedEventAttributes {
  executionContext?: string;
  scheduledEventId: number;
  startedEventId: number;
  taskList?: TaskList;
  taskListScheduleToStartTimeout?: string;
}
export const DecisionTaskCompletedEventAttributes = S.suspend(() =>
  S.Struct({
    executionContext: S.optional(S.String),
    scheduledEventId: S.Number,
    startedEventId: S.Number,
    taskList: S.optional(TaskList),
    taskListScheduleToStartTimeout: S.optional(S.String),
  }),
).annotations({
  identifier: "DecisionTaskCompletedEventAttributes",
}) as any as S.Schema<DecisionTaskCompletedEventAttributes>;
export type DecisionTaskTimeoutType = "START_TO_CLOSE" | "SCHEDULE_TO_START";
export const DecisionTaskTimeoutType = S.Literal(
  "START_TO_CLOSE",
  "SCHEDULE_TO_START",
);
export interface DecisionTaskTimedOutEventAttributes {
  timeoutType: DecisionTaskTimeoutType;
  scheduledEventId: number;
  startedEventId: number;
}
export const DecisionTaskTimedOutEventAttributes = S.suspend(() =>
  S.Struct({
    timeoutType: DecisionTaskTimeoutType,
    scheduledEventId: S.Number,
    startedEventId: S.Number,
  }),
).annotations({
  identifier: "DecisionTaskTimedOutEventAttributes",
}) as any as S.Schema<DecisionTaskTimedOutEventAttributes>;
export interface ActivityTaskScheduledEventAttributes {
  activityType: ActivityType;
  activityId: string;
  input?: string;
  control?: string;
  scheduleToStartTimeout?: string;
  scheduleToCloseTimeout?: string;
  startToCloseTimeout?: string;
  taskList: TaskList;
  taskPriority?: string;
  decisionTaskCompletedEventId: number;
  heartbeatTimeout?: string;
}
export const ActivityTaskScheduledEventAttributes = S.suspend(() =>
  S.Struct({
    activityType: ActivityType,
    activityId: S.String,
    input: S.optional(S.String),
    control: S.optional(S.String),
    scheduleToStartTimeout: S.optional(S.String),
    scheduleToCloseTimeout: S.optional(S.String),
    startToCloseTimeout: S.optional(S.String),
    taskList: TaskList,
    taskPriority: S.optional(S.String),
    decisionTaskCompletedEventId: S.Number,
    heartbeatTimeout: S.optional(S.String),
  }),
).annotations({
  identifier: "ActivityTaskScheduledEventAttributes",
}) as any as S.Schema<ActivityTaskScheduledEventAttributes>;
export interface ActivityTaskStartedEventAttributes {
  identity?: string;
  scheduledEventId: number;
}
export const ActivityTaskStartedEventAttributes = S.suspend(() =>
  S.Struct({ identity: S.optional(S.String), scheduledEventId: S.Number }),
).annotations({
  identifier: "ActivityTaskStartedEventAttributes",
}) as any as S.Schema<ActivityTaskStartedEventAttributes>;
export interface ActivityTaskCompletedEventAttributes {
  result?: string;
  scheduledEventId: number;
  startedEventId: number;
}
export const ActivityTaskCompletedEventAttributes = S.suspend(() =>
  S.Struct({
    result: S.optional(S.String),
    scheduledEventId: S.Number,
    startedEventId: S.Number,
  }),
).annotations({
  identifier: "ActivityTaskCompletedEventAttributes",
}) as any as S.Schema<ActivityTaskCompletedEventAttributes>;
export interface ActivityTaskFailedEventAttributes {
  reason?: string;
  details?: string;
  scheduledEventId: number;
  startedEventId: number;
}
export const ActivityTaskFailedEventAttributes = S.suspend(() =>
  S.Struct({
    reason: S.optional(S.String),
    details: S.optional(S.String),
    scheduledEventId: S.Number,
    startedEventId: S.Number,
  }),
).annotations({
  identifier: "ActivityTaskFailedEventAttributes",
}) as any as S.Schema<ActivityTaskFailedEventAttributes>;
export type ActivityTaskTimeoutType =
  | "START_TO_CLOSE"
  | "SCHEDULE_TO_START"
  | "SCHEDULE_TO_CLOSE"
  | "HEARTBEAT";
export const ActivityTaskTimeoutType = S.Literal(
  "START_TO_CLOSE",
  "SCHEDULE_TO_START",
  "SCHEDULE_TO_CLOSE",
  "HEARTBEAT",
);
export interface ActivityTaskTimedOutEventAttributes {
  timeoutType: ActivityTaskTimeoutType;
  scheduledEventId: number;
  startedEventId: number;
  details?: string;
}
export const ActivityTaskTimedOutEventAttributes = S.suspend(() =>
  S.Struct({
    timeoutType: ActivityTaskTimeoutType,
    scheduledEventId: S.Number,
    startedEventId: S.Number,
    details: S.optional(S.String),
  }),
).annotations({
  identifier: "ActivityTaskTimedOutEventAttributes",
}) as any as S.Schema<ActivityTaskTimedOutEventAttributes>;
export interface ActivityTaskCanceledEventAttributes {
  details?: string;
  scheduledEventId: number;
  startedEventId: number;
  latestCancelRequestedEventId?: number;
}
export const ActivityTaskCanceledEventAttributes = S.suspend(() =>
  S.Struct({
    details: S.optional(S.String),
    scheduledEventId: S.Number,
    startedEventId: S.Number,
    latestCancelRequestedEventId: S.optional(S.Number),
  }),
).annotations({
  identifier: "ActivityTaskCanceledEventAttributes",
}) as any as S.Schema<ActivityTaskCanceledEventAttributes>;
export interface ActivityTaskCancelRequestedEventAttributes {
  decisionTaskCompletedEventId: number;
  activityId: string;
}
export const ActivityTaskCancelRequestedEventAttributes = S.suspend(() =>
  S.Struct({ decisionTaskCompletedEventId: S.Number, activityId: S.String }),
).annotations({
  identifier: "ActivityTaskCancelRequestedEventAttributes",
}) as any as S.Schema<ActivityTaskCancelRequestedEventAttributes>;
export interface WorkflowExecutionSignaledEventAttributes {
  signalName: string;
  input?: string;
  externalWorkflowExecution?: WorkflowExecution;
  externalInitiatedEventId?: number;
}
export const WorkflowExecutionSignaledEventAttributes = S.suspend(() =>
  S.Struct({
    signalName: S.String,
    input: S.optional(S.String),
    externalWorkflowExecution: S.optional(WorkflowExecution),
    externalInitiatedEventId: S.optional(S.Number),
  }),
).annotations({
  identifier: "WorkflowExecutionSignaledEventAttributes",
}) as any as S.Schema<WorkflowExecutionSignaledEventAttributes>;
export interface MarkerRecordedEventAttributes {
  markerName: string;
  details?: string;
  decisionTaskCompletedEventId: number;
}
export const MarkerRecordedEventAttributes = S.suspend(() =>
  S.Struct({
    markerName: S.String,
    details: S.optional(S.String),
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "MarkerRecordedEventAttributes",
}) as any as S.Schema<MarkerRecordedEventAttributes>;
export type RecordMarkerFailedCause = "OPERATION_NOT_PERMITTED";
export const RecordMarkerFailedCause = S.Literal("OPERATION_NOT_PERMITTED");
export interface RecordMarkerFailedEventAttributes {
  markerName: string;
  cause: RecordMarkerFailedCause;
  decisionTaskCompletedEventId: number;
}
export const RecordMarkerFailedEventAttributes = S.suspend(() =>
  S.Struct({
    markerName: S.String,
    cause: RecordMarkerFailedCause,
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "RecordMarkerFailedEventAttributes",
}) as any as S.Schema<RecordMarkerFailedEventAttributes>;
export interface TimerStartedEventAttributes {
  timerId: string;
  control?: string;
  startToFireTimeout: string;
  decisionTaskCompletedEventId: number;
}
export const TimerStartedEventAttributes = S.suspend(() =>
  S.Struct({
    timerId: S.String,
    control: S.optional(S.String),
    startToFireTimeout: S.String,
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "TimerStartedEventAttributes",
}) as any as S.Schema<TimerStartedEventAttributes>;
export interface TimerFiredEventAttributes {
  timerId: string;
  startedEventId: number;
}
export const TimerFiredEventAttributes = S.suspend(() =>
  S.Struct({ timerId: S.String, startedEventId: S.Number }),
).annotations({
  identifier: "TimerFiredEventAttributes",
}) as any as S.Schema<TimerFiredEventAttributes>;
export interface TimerCanceledEventAttributes {
  timerId: string;
  startedEventId: number;
  decisionTaskCompletedEventId: number;
}
export const TimerCanceledEventAttributes = S.suspend(() =>
  S.Struct({
    timerId: S.String,
    startedEventId: S.Number,
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "TimerCanceledEventAttributes",
}) as any as S.Schema<TimerCanceledEventAttributes>;
export interface StartChildWorkflowExecutionInitiatedEventAttributes {
  workflowId: string;
  workflowType: WorkflowType;
  control?: string;
  input?: string;
  executionStartToCloseTimeout?: string;
  taskList: TaskList;
  taskPriority?: string;
  decisionTaskCompletedEventId: number;
  childPolicy: ChildPolicy;
  taskStartToCloseTimeout?: string;
  tagList?: string[];
  lambdaRole?: string;
}
export const StartChildWorkflowExecutionInitiatedEventAttributes = S.suspend(
  () =>
    S.Struct({
      workflowId: S.String,
      workflowType: WorkflowType,
      control: S.optional(S.String),
      input: S.optional(S.String),
      executionStartToCloseTimeout: S.optional(S.String),
      taskList: TaskList,
      taskPriority: S.optional(S.String),
      decisionTaskCompletedEventId: S.Number,
      childPolicy: ChildPolicy,
      taskStartToCloseTimeout: S.optional(S.String),
      tagList: S.optional(TagList),
      lambdaRole: S.optional(S.String),
    }),
).annotations({
  identifier: "StartChildWorkflowExecutionInitiatedEventAttributes",
}) as any as S.Schema<StartChildWorkflowExecutionInitiatedEventAttributes>;
export interface ChildWorkflowExecutionStartedEventAttributes {
  workflowExecution: WorkflowExecution;
  workflowType: WorkflowType;
  initiatedEventId: number;
}
export const ChildWorkflowExecutionStartedEventAttributes = S.suspend(() =>
  S.Struct({
    workflowExecution: WorkflowExecution,
    workflowType: WorkflowType,
    initiatedEventId: S.Number,
  }),
).annotations({
  identifier: "ChildWorkflowExecutionStartedEventAttributes",
}) as any as S.Schema<ChildWorkflowExecutionStartedEventAttributes>;
export interface ChildWorkflowExecutionCompletedEventAttributes {
  workflowExecution: WorkflowExecution;
  workflowType: WorkflowType;
  result?: string;
  initiatedEventId: number;
  startedEventId: number;
}
export const ChildWorkflowExecutionCompletedEventAttributes = S.suspend(() =>
  S.Struct({
    workflowExecution: WorkflowExecution,
    workflowType: WorkflowType,
    result: S.optional(S.String),
    initiatedEventId: S.Number,
    startedEventId: S.Number,
  }),
).annotations({
  identifier: "ChildWorkflowExecutionCompletedEventAttributes",
}) as any as S.Schema<ChildWorkflowExecutionCompletedEventAttributes>;
export interface ChildWorkflowExecutionFailedEventAttributes {
  workflowExecution: WorkflowExecution;
  workflowType: WorkflowType;
  reason?: string;
  details?: string;
  initiatedEventId: number;
  startedEventId: number;
}
export const ChildWorkflowExecutionFailedEventAttributes = S.suspend(() =>
  S.Struct({
    workflowExecution: WorkflowExecution,
    workflowType: WorkflowType,
    reason: S.optional(S.String),
    details: S.optional(S.String),
    initiatedEventId: S.Number,
    startedEventId: S.Number,
  }),
).annotations({
  identifier: "ChildWorkflowExecutionFailedEventAttributes",
}) as any as S.Schema<ChildWorkflowExecutionFailedEventAttributes>;
export interface ChildWorkflowExecutionTimedOutEventAttributes {
  workflowExecution: WorkflowExecution;
  workflowType: WorkflowType;
  timeoutType: WorkflowExecutionTimeoutType;
  initiatedEventId: number;
  startedEventId: number;
}
export const ChildWorkflowExecutionTimedOutEventAttributes = S.suspend(() =>
  S.Struct({
    workflowExecution: WorkflowExecution,
    workflowType: WorkflowType,
    timeoutType: WorkflowExecutionTimeoutType,
    initiatedEventId: S.Number,
    startedEventId: S.Number,
  }),
).annotations({
  identifier: "ChildWorkflowExecutionTimedOutEventAttributes",
}) as any as S.Schema<ChildWorkflowExecutionTimedOutEventAttributes>;
export interface ChildWorkflowExecutionCanceledEventAttributes {
  workflowExecution: WorkflowExecution;
  workflowType: WorkflowType;
  details?: string;
  initiatedEventId: number;
  startedEventId: number;
}
export const ChildWorkflowExecutionCanceledEventAttributes = S.suspend(() =>
  S.Struct({
    workflowExecution: WorkflowExecution,
    workflowType: WorkflowType,
    details: S.optional(S.String),
    initiatedEventId: S.Number,
    startedEventId: S.Number,
  }),
).annotations({
  identifier: "ChildWorkflowExecutionCanceledEventAttributes",
}) as any as S.Schema<ChildWorkflowExecutionCanceledEventAttributes>;
export interface ChildWorkflowExecutionTerminatedEventAttributes {
  workflowExecution: WorkflowExecution;
  workflowType: WorkflowType;
  initiatedEventId: number;
  startedEventId: number;
}
export const ChildWorkflowExecutionTerminatedEventAttributes = S.suspend(() =>
  S.Struct({
    workflowExecution: WorkflowExecution,
    workflowType: WorkflowType,
    initiatedEventId: S.Number,
    startedEventId: S.Number,
  }),
).annotations({
  identifier: "ChildWorkflowExecutionTerminatedEventAttributes",
}) as any as S.Schema<ChildWorkflowExecutionTerminatedEventAttributes>;
export interface SignalExternalWorkflowExecutionInitiatedEventAttributes {
  workflowId: string;
  runId?: string;
  signalName: string;
  input?: string;
  decisionTaskCompletedEventId: number;
  control?: string;
}
export const SignalExternalWorkflowExecutionInitiatedEventAttributes =
  S.suspend(() =>
    S.Struct({
      workflowId: S.String,
      runId: S.optional(S.String),
      signalName: S.String,
      input: S.optional(S.String),
      decisionTaskCompletedEventId: S.Number,
      control: S.optional(S.String),
    }),
  ).annotations({
    identifier: "SignalExternalWorkflowExecutionInitiatedEventAttributes",
  }) as any as S.Schema<SignalExternalWorkflowExecutionInitiatedEventAttributes>;
export interface ExternalWorkflowExecutionSignaledEventAttributes {
  workflowExecution: WorkflowExecution;
  initiatedEventId: number;
}
export const ExternalWorkflowExecutionSignaledEventAttributes = S.suspend(() =>
  S.Struct({
    workflowExecution: WorkflowExecution,
    initiatedEventId: S.Number,
  }),
).annotations({
  identifier: "ExternalWorkflowExecutionSignaledEventAttributes",
}) as any as S.Schema<ExternalWorkflowExecutionSignaledEventAttributes>;
export type SignalExternalWorkflowExecutionFailedCause =
  | "UNKNOWN_EXTERNAL_WORKFLOW_EXECUTION"
  | "SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_RATE_EXCEEDED"
  | "OPERATION_NOT_PERMITTED";
export const SignalExternalWorkflowExecutionFailedCause = S.Literal(
  "UNKNOWN_EXTERNAL_WORKFLOW_EXECUTION",
  "SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_RATE_EXCEEDED",
  "OPERATION_NOT_PERMITTED",
);
export interface SignalExternalWorkflowExecutionFailedEventAttributes {
  workflowId: string;
  runId?: string;
  cause: SignalExternalWorkflowExecutionFailedCause;
  initiatedEventId: number;
  decisionTaskCompletedEventId: number;
  control?: string;
}
export const SignalExternalWorkflowExecutionFailedEventAttributes = S.suspend(
  () =>
    S.Struct({
      workflowId: S.String,
      runId: S.optional(S.String),
      cause: SignalExternalWorkflowExecutionFailedCause,
      initiatedEventId: S.Number,
      decisionTaskCompletedEventId: S.Number,
      control: S.optional(S.String),
    }),
).annotations({
  identifier: "SignalExternalWorkflowExecutionFailedEventAttributes",
}) as any as S.Schema<SignalExternalWorkflowExecutionFailedEventAttributes>;
export interface ExternalWorkflowExecutionCancelRequestedEventAttributes {
  workflowExecution: WorkflowExecution;
  initiatedEventId: number;
}
export const ExternalWorkflowExecutionCancelRequestedEventAttributes =
  S.suspend(() =>
    S.Struct({
      workflowExecution: WorkflowExecution,
      initiatedEventId: S.Number,
    }),
  ).annotations({
    identifier: "ExternalWorkflowExecutionCancelRequestedEventAttributes",
  }) as any as S.Schema<ExternalWorkflowExecutionCancelRequestedEventAttributes>;
export interface RequestCancelExternalWorkflowExecutionInitiatedEventAttributes {
  workflowId: string;
  runId?: string;
  decisionTaskCompletedEventId: number;
  control?: string;
}
export const RequestCancelExternalWorkflowExecutionInitiatedEventAttributes =
  S.suspend(() =>
    S.Struct({
      workflowId: S.String,
      runId: S.optional(S.String),
      decisionTaskCompletedEventId: S.Number,
      control: S.optional(S.String),
    }),
  ).annotations({
    identifier:
      "RequestCancelExternalWorkflowExecutionInitiatedEventAttributes",
  }) as any as S.Schema<RequestCancelExternalWorkflowExecutionInitiatedEventAttributes>;
export type RequestCancelExternalWorkflowExecutionFailedCause =
  | "UNKNOWN_EXTERNAL_WORKFLOW_EXECUTION"
  | "REQUEST_CANCEL_EXTERNAL_WORKFLOW_EXECUTION_RATE_EXCEEDED"
  | "OPERATION_NOT_PERMITTED";
export const RequestCancelExternalWorkflowExecutionFailedCause = S.Literal(
  "UNKNOWN_EXTERNAL_WORKFLOW_EXECUTION",
  "REQUEST_CANCEL_EXTERNAL_WORKFLOW_EXECUTION_RATE_EXCEEDED",
  "OPERATION_NOT_PERMITTED",
);
export interface RequestCancelExternalWorkflowExecutionFailedEventAttributes {
  workflowId: string;
  runId?: string;
  cause: RequestCancelExternalWorkflowExecutionFailedCause;
  initiatedEventId: number;
  decisionTaskCompletedEventId: number;
  control?: string;
}
export const RequestCancelExternalWorkflowExecutionFailedEventAttributes =
  S.suspend(() =>
    S.Struct({
      workflowId: S.String,
      runId: S.optional(S.String),
      cause: RequestCancelExternalWorkflowExecutionFailedCause,
      initiatedEventId: S.Number,
      decisionTaskCompletedEventId: S.Number,
      control: S.optional(S.String),
    }),
  ).annotations({
    identifier: "RequestCancelExternalWorkflowExecutionFailedEventAttributes",
  }) as any as S.Schema<RequestCancelExternalWorkflowExecutionFailedEventAttributes>;
export type ScheduleActivityTaskFailedCause =
  | "ACTIVITY_TYPE_DEPRECATED"
  | "ACTIVITY_TYPE_DOES_NOT_EXIST"
  | "ACTIVITY_ID_ALREADY_IN_USE"
  | "OPEN_ACTIVITIES_LIMIT_EXCEEDED"
  | "ACTIVITY_CREATION_RATE_EXCEEDED"
  | "DEFAULT_SCHEDULE_TO_CLOSE_TIMEOUT_UNDEFINED"
  | "DEFAULT_TASK_LIST_UNDEFINED"
  | "DEFAULT_SCHEDULE_TO_START_TIMEOUT_UNDEFINED"
  | "DEFAULT_START_TO_CLOSE_TIMEOUT_UNDEFINED"
  | "DEFAULT_HEARTBEAT_TIMEOUT_UNDEFINED"
  | "OPERATION_NOT_PERMITTED";
export const ScheduleActivityTaskFailedCause = S.Literal(
  "ACTIVITY_TYPE_DEPRECATED",
  "ACTIVITY_TYPE_DOES_NOT_EXIST",
  "ACTIVITY_ID_ALREADY_IN_USE",
  "OPEN_ACTIVITIES_LIMIT_EXCEEDED",
  "ACTIVITY_CREATION_RATE_EXCEEDED",
  "DEFAULT_SCHEDULE_TO_CLOSE_TIMEOUT_UNDEFINED",
  "DEFAULT_TASK_LIST_UNDEFINED",
  "DEFAULT_SCHEDULE_TO_START_TIMEOUT_UNDEFINED",
  "DEFAULT_START_TO_CLOSE_TIMEOUT_UNDEFINED",
  "DEFAULT_HEARTBEAT_TIMEOUT_UNDEFINED",
  "OPERATION_NOT_PERMITTED",
);
export interface ScheduleActivityTaskFailedEventAttributes {
  activityType: ActivityType;
  activityId: string;
  cause: ScheduleActivityTaskFailedCause;
  decisionTaskCompletedEventId: number;
}
export const ScheduleActivityTaskFailedEventAttributes = S.suspend(() =>
  S.Struct({
    activityType: ActivityType,
    activityId: S.String,
    cause: ScheduleActivityTaskFailedCause,
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "ScheduleActivityTaskFailedEventAttributes",
}) as any as S.Schema<ScheduleActivityTaskFailedEventAttributes>;
export type RequestCancelActivityTaskFailedCause =
  | "ACTIVITY_ID_UNKNOWN"
  | "OPERATION_NOT_PERMITTED";
export const RequestCancelActivityTaskFailedCause = S.Literal(
  "ACTIVITY_ID_UNKNOWN",
  "OPERATION_NOT_PERMITTED",
);
export interface RequestCancelActivityTaskFailedEventAttributes {
  activityId: string;
  cause: RequestCancelActivityTaskFailedCause;
  decisionTaskCompletedEventId: number;
}
export const RequestCancelActivityTaskFailedEventAttributes = S.suspend(() =>
  S.Struct({
    activityId: S.String,
    cause: RequestCancelActivityTaskFailedCause,
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "RequestCancelActivityTaskFailedEventAttributes",
}) as any as S.Schema<RequestCancelActivityTaskFailedEventAttributes>;
export type StartTimerFailedCause =
  | "TIMER_ID_ALREADY_IN_USE"
  | "OPEN_TIMERS_LIMIT_EXCEEDED"
  | "TIMER_CREATION_RATE_EXCEEDED"
  | "OPERATION_NOT_PERMITTED";
export const StartTimerFailedCause = S.Literal(
  "TIMER_ID_ALREADY_IN_USE",
  "OPEN_TIMERS_LIMIT_EXCEEDED",
  "TIMER_CREATION_RATE_EXCEEDED",
  "OPERATION_NOT_PERMITTED",
);
export interface StartTimerFailedEventAttributes {
  timerId: string;
  cause: StartTimerFailedCause;
  decisionTaskCompletedEventId: number;
}
export const StartTimerFailedEventAttributes = S.suspend(() =>
  S.Struct({
    timerId: S.String,
    cause: StartTimerFailedCause,
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "StartTimerFailedEventAttributes",
}) as any as S.Schema<StartTimerFailedEventAttributes>;
export type CancelTimerFailedCause =
  | "TIMER_ID_UNKNOWN"
  | "OPERATION_NOT_PERMITTED";
export const CancelTimerFailedCause = S.Literal(
  "TIMER_ID_UNKNOWN",
  "OPERATION_NOT_PERMITTED",
);
export interface CancelTimerFailedEventAttributes {
  timerId: string;
  cause: CancelTimerFailedCause;
  decisionTaskCompletedEventId: number;
}
export const CancelTimerFailedEventAttributes = S.suspend(() =>
  S.Struct({
    timerId: S.String,
    cause: CancelTimerFailedCause,
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "CancelTimerFailedEventAttributes",
}) as any as S.Schema<CancelTimerFailedEventAttributes>;
export type StartChildWorkflowExecutionFailedCause =
  | "WORKFLOW_TYPE_DOES_NOT_EXIST"
  | "WORKFLOW_TYPE_DEPRECATED"
  | "OPEN_CHILDREN_LIMIT_EXCEEDED"
  | "OPEN_WORKFLOWS_LIMIT_EXCEEDED"
  | "CHILD_CREATION_RATE_EXCEEDED"
  | "WORKFLOW_ALREADY_RUNNING"
  | "DEFAULT_EXECUTION_START_TO_CLOSE_TIMEOUT_UNDEFINED"
  | "DEFAULT_TASK_LIST_UNDEFINED"
  | "DEFAULT_TASK_START_TO_CLOSE_TIMEOUT_UNDEFINED"
  | "DEFAULT_CHILD_POLICY_UNDEFINED"
  | "OPERATION_NOT_PERMITTED";
export const StartChildWorkflowExecutionFailedCause = S.Literal(
  "WORKFLOW_TYPE_DOES_NOT_EXIST",
  "WORKFLOW_TYPE_DEPRECATED",
  "OPEN_CHILDREN_LIMIT_EXCEEDED",
  "OPEN_WORKFLOWS_LIMIT_EXCEEDED",
  "CHILD_CREATION_RATE_EXCEEDED",
  "WORKFLOW_ALREADY_RUNNING",
  "DEFAULT_EXECUTION_START_TO_CLOSE_TIMEOUT_UNDEFINED",
  "DEFAULT_TASK_LIST_UNDEFINED",
  "DEFAULT_TASK_START_TO_CLOSE_TIMEOUT_UNDEFINED",
  "DEFAULT_CHILD_POLICY_UNDEFINED",
  "OPERATION_NOT_PERMITTED",
);
export interface StartChildWorkflowExecutionFailedEventAttributes {
  workflowType: WorkflowType;
  cause: StartChildWorkflowExecutionFailedCause;
  workflowId: string;
  initiatedEventId: number;
  decisionTaskCompletedEventId: number;
  control?: string;
}
export const StartChildWorkflowExecutionFailedEventAttributes = S.suspend(() =>
  S.Struct({
    workflowType: WorkflowType,
    cause: StartChildWorkflowExecutionFailedCause,
    workflowId: S.String,
    initiatedEventId: S.Number,
    decisionTaskCompletedEventId: S.Number,
    control: S.optional(S.String),
  }),
).annotations({
  identifier: "StartChildWorkflowExecutionFailedEventAttributes",
}) as any as S.Schema<StartChildWorkflowExecutionFailedEventAttributes>;
export interface LambdaFunctionScheduledEventAttributes {
  id: string;
  name: string;
  control?: string;
  input?: string;
  startToCloseTimeout?: string;
  decisionTaskCompletedEventId: number;
}
export const LambdaFunctionScheduledEventAttributes = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    control: S.optional(S.String),
    input: S.optional(S.String),
    startToCloseTimeout: S.optional(S.String),
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "LambdaFunctionScheduledEventAttributes",
}) as any as S.Schema<LambdaFunctionScheduledEventAttributes>;
export interface LambdaFunctionStartedEventAttributes {
  scheduledEventId: number;
}
export const LambdaFunctionStartedEventAttributes = S.suspend(() =>
  S.Struct({ scheduledEventId: S.Number }),
).annotations({
  identifier: "LambdaFunctionStartedEventAttributes",
}) as any as S.Schema<LambdaFunctionStartedEventAttributes>;
export interface LambdaFunctionCompletedEventAttributes {
  scheduledEventId: number;
  startedEventId: number;
  result?: string;
}
export const LambdaFunctionCompletedEventAttributes = S.suspend(() =>
  S.Struct({
    scheduledEventId: S.Number,
    startedEventId: S.Number,
    result: S.optional(S.String),
  }),
).annotations({
  identifier: "LambdaFunctionCompletedEventAttributes",
}) as any as S.Schema<LambdaFunctionCompletedEventAttributes>;
export interface LambdaFunctionFailedEventAttributes {
  scheduledEventId: number;
  startedEventId: number;
  reason?: string;
  details?: string;
}
export const LambdaFunctionFailedEventAttributes = S.suspend(() =>
  S.Struct({
    scheduledEventId: S.Number,
    startedEventId: S.Number,
    reason: S.optional(S.String),
    details: S.optional(S.String),
  }),
).annotations({
  identifier: "LambdaFunctionFailedEventAttributes",
}) as any as S.Schema<LambdaFunctionFailedEventAttributes>;
export type LambdaFunctionTimeoutType = "START_TO_CLOSE";
export const LambdaFunctionTimeoutType = S.Literal("START_TO_CLOSE");
export interface LambdaFunctionTimedOutEventAttributes {
  scheduledEventId: number;
  startedEventId: number;
  timeoutType?: LambdaFunctionTimeoutType;
}
export const LambdaFunctionTimedOutEventAttributes = S.suspend(() =>
  S.Struct({
    scheduledEventId: S.Number,
    startedEventId: S.Number,
    timeoutType: S.optional(LambdaFunctionTimeoutType),
  }),
).annotations({
  identifier: "LambdaFunctionTimedOutEventAttributes",
}) as any as S.Schema<LambdaFunctionTimedOutEventAttributes>;
export type ScheduleLambdaFunctionFailedCause =
  | "ID_ALREADY_IN_USE"
  | "OPEN_LAMBDA_FUNCTIONS_LIMIT_EXCEEDED"
  | "LAMBDA_FUNCTION_CREATION_RATE_EXCEEDED"
  | "LAMBDA_SERVICE_NOT_AVAILABLE_IN_REGION";
export const ScheduleLambdaFunctionFailedCause = S.Literal(
  "ID_ALREADY_IN_USE",
  "OPEN_LAMBDA_FUNCTIONS_LIMIT_EXCEEDED",
  "LAMBDA_FUNCTION_CREATION_RATE_EXCEEDED",
  "LAMBDA_SERVICE_NOT_AVAILABLE_IN_REGION",
);
export interface ScheduleLambdaFunctionFailedEventAttributes {
  id: string;
  name: string;
  cause: ScheduleLambdaFunctionFailedCause;
  decisionTaskCompletedEventId: number;
}
export const ScheduleLambdaFunctionFailedEventAttributes = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    cause: ScheduleLambdaFunctionFailedCause,
    decisionTaskCompletedEventId: S.Number,
  }),
).annotations({
  identifier: "ScheduleLambdaFunctionFailedEventAttributes",
}) as any as S.Schema<ScheduleLambdaFunctionFailedEventAttributes>;
export type StartLambdaFunctionFailedCause = "ASSUME_ROLE_FAILED";
export const StartLambdaFunctionFailedCause = S.Literal("ASSUME_ROLE_FAILED");
export interface StartLambdaFunctionFailedEventAttributes {
  scheduledEventId?: number;
  cause?: StartLambdaFunctionFailedCause;
  message?: string;
}
export const StartLambdaFunctionFailedEventAttributes = S.suspend(() =>
  S.Struct({
    scheduledEventId: S.optional(S.Number),
    cause: S.optional(StartLambdaFunctionFailedCause),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "StartLambdaFunctionFailedEventAttributes",
}) as any as S.Schema<StartLambdaFunctionFailedEventAttributes>;
export interface HistoryEvent {
  eventTimestamp: Date;
  eventType: EventType;
  eventId: number;
  workflowExecutionStartedEventAttributes?: WorkflowExecutionStartedEventAttributes;
  workflowExecutionCompletedEventAttributes?: WorkflowExecutionCompletedEventAttributes;
  completeWorkflowExecutionFailedEventAttributes?: CompleteWorkflowExecutionFailedEventAttributes;
  workflowExecutionFailedEventAttributes?: WorkflowExecutionFailedEventAttributes;
  failWorkflowExecutionFailedEventAttributes?: FailWorkflowExecutionFailedEventAttributes;
  workflowExecutionTimedOutEventAttributes?: WorkflowExecutionTimedOutEventAttributes;
  workflowExecutionCanceledEventAttributes?: WorkflowExecutionCanceledEventAttributes;
  cancelWorkflowExecutionFailedEventAttributes?: CancelWorkflowExecutionFailedEventAttributes;
  workflowExecutionContinuedAsNewEventAttributes?: WorkflowExecutionContinuedAsNewEventAttributes;
  continueAsNewWorkflowExecutionFailedEventAttributes?: ContinueAsNewWorkflowExecutionFailedEventAttributes;
  workflowExecutionTerminatedEventAttributes?: WorkflowExecutionTerminatedEventAttributes;
  workflowExecutionCancelRequestedEventAttributes?: WorkflowExecutionCancelRequestedEventAttributes;
  decisionTaskScheduledEventAttributes?: DecisionTaskScheduledEventAttributes;
  decisionTaskStartedEventAttributes?: DecisionTaskStartedEventAttributes;
  decisionTaskCompletedEventAttributes?: DecisionTaskCompletedEventAttributes;
  decisionTaskTimedOutEventAttributes?: DecisionTaskTimedOutEventAttributes;
  activityTaskScheduledEventAttributes?: ActivityTaskScheduledEventAttributes;
  activityTaskStartedEventAttributes?: ActivityTaskStartedEventAttributes;
  activityTaskCompletedEventAttributes?: ActivityTaskCompletedEventAttributes;
  activityTaskFailedEventAttributes?: ActivityTaskFailedEventAttributes;
  activityTaskTimedOutEventAttributes?: ActivityTaskTimedOutEventAttributes;
  activityTaskCanceledEventAttributes?: ActivityTaskCanceledEventAttributes;
  activityTaskCancelRequestedEventAttributes?: ActivityTaskCancelRequestedEventAttributes;
  workflowExecutionSignaledEventAttributes?: WorkflowExecutionSignaledEventAttributes;
  markerRecordedEventAttributes?: MarkerRecordedEventAttributes;
  recordMarkerFailedEventAttributes?: RecordMarkerFailedEventAttributes;
  timerStartedEventAttributes?: TimerStartedEventAttributes;
  timerFiredEventAttributes?: TimerFiredEventAttributes;
  timerCanceledEventAttributes?: TimerCanceledEventAttributes;
  startChildWorkflowExecutionInitiatedEventAttributes?: StartChildWorkflowExecutionInitiatedEventAttributes;
  childWorkflowExecutionStartedEventAttributes?: ChildWorkflowExecutionStartedEventAttributes;
  childWorkflowExecutionCompletedEventAttributes?: ChildWorkflowExecutionCompletedEventAttributes;
  childWorkflowExecutionFailedEventAttributes?: ChildWorkflowExecutionFailedEventAttributes;
  childWorkflowExecutionTimedOutEventAttributes?: ChildWorkflowExecutionTimedOutEventAttributes;
  childWorkflowExecutionCanceledEventAttributes?: ChildWorkflowExecutionCanceledEventAttributes;
  childWorkflowExecutionTerminatedEventAttributes?: ChildWorkflowExecutionTerminatedEventAttributes;
  signalExternalWorkflowExecutionInitiatedEventAttributes?: SignalExternalWorkflowExecutionInitiatedEventAttributes;
  externalWorkflowExecutionSignaledEventAttributes?: ExternalWorkflowExecutionSignaledEventAttributes;
  signalExternalWorkflowExecutionFailedEventAttributes?: SignalExternalWorkflowExecutionFailedEventAttributes;
  externalWorkflowExecutionCancelRequestedEventAttributes?: ExternalWorkflowExecutionCancelRequestedEventAttributes;
  requestCancelExternalWorkflowExecutionInitiatedEventAttributes?: RequestCancelExternalWorkflowExecutionInitiatedEventAttributes;
  requestCancelExternalWorkflowExecutionFailedEventAttributes?: RequestCancelExternalWorkflowExecutionFailedEventAttributes;
  scheduleActivityTaskFailedEventAttributes?: ScheduleActivityTaskFailedEventAttributes;
  requestCancelActivityTaskFailedEventAttributes?: RequestCancelActivityTaskFailedEventAttributes;
  startTimerFailedEventAttributes?: StartTimerFailedEventAttributes;
  cancelTimerFailedEventAttributes?: CancelTimerFailedEventAttributes;
  startChildWorkflowExecutionFailedEventAttributes?: StartChildWorkflowExecutionFailedEventAttributes;
  lambdaFunctionScheduledEventAttributes?: LambdaFunctionScheduledEventAttributes;
  lambdaFunctionStartedEventAttributes?: LambdaFunctionStartedEventAttributes;
  lambdaFunctionCompletedEventAttributes?: LambdaFunctionCompletedEventAttributes;
  lambdaFunctionFailedEventAttributes?: LambdaFunctionFailedEventAttributes;
  lambdaFunctionTimedOutEventAttributes?: LambdaFunctionTimedOutEventAttributes;
  scheduleLambdaFunctionFailedEventAttributes?: ScheduleLambdaFunctionFailedEventAttributes;
  startLambdaFunctionFailedEventAttributes?: StartLambdaFunctionFailedEventAttributes;
}
export const HistoryEvent = S.suspend(() =>
  S.Struct({
    eventTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    eventType: EventType,
    eventId: S.Number,
    workflowExecutionStartedEventAttributes: S.optional(
      WorkflowExecutionStartedEventAttributes,
    ),
    workflowExecutionCompletedEventAttributes: S.optional(
      WorkflowExecutionCompletedEventAttributes,
    ),
    completeWorkflowExecutionFailedEventAttributes: S.optional(
      CompleteWorkflowExecutionFailedEventAttributes,
    ),
    workflowExecutionFailedEventAttributes: S.optional(
      WorkflowExecutionFailedEventAttributes,
    ),
    failWorkflowExecutionFailedEventAttributes: S.optional(
      FailWorkflowExecutionFailedEventAttributes,
    ),
    workflowExecutionTimedOutEventAttributes: S.optional(
      WorkflowExecutionTimedOutEventAttributes,
    ),
    workflowExecutionCanceledEventAttributes: S.optional(
      WorkflowExecutionCanceledEventAttributes,
    ),
    cancelWorkflowExecutionFailedEventAttributes: S.optional(
      CancelWorkflowExecutionFailedEventAttributes,
    ),
    workflowExecutionContinuedAsNewEventAttributes: S.optional(
      WorkflowExecutionContinuedAsNewEventAttributes,
    ),
    continueAsNewWorkflowExecutionFailedEventAttributes: S.optional(
      ContinueAsNewWorkflowExecutionFailedEventAttributes,
    ),
    workflowExecutionTerminatedEventAttributes: S.optional(
      WorkflowExecutionTerminatedEventAttributes,
    ),
    workflowExecutionCancelRequestedEventAttributes: S.optional(
      WorkflowExecutionCancelRequestedEventAttributes,
    ),
    decisionTaskScheduledEventAttributes: S.optional(
      DecisionTaskScheduledEventAttributes,
    ),
    decisionTaskStartedEventAttributes: S.optional(
      DecisionTaskStartedEventAttributes,
    ),
    decisionTaskCompletedEventAttributes: S.optional(
      DecisionTaskCompletedEventAttributes,
    ),
    decisionTaskTimedOutEventAttributes: S.optional(
      DecisionTaskTimedOutEventAttributes,
    ),
    activityTaskScheduledEventAttributes: S.optional(
      ActivityTaskScheduledEventAttributes,
    ),
    activityTaskStartedEventAttributes: S.optional(
      ActivityTaskStartedEventAttributes,
    ),
    activityTaskCompletedEventAttributes: S.optional(
      ActivityTaskCompletedEventAttributes,
    ),
    activityTaskFailedEventAttributes: S.optional(
      ActivityTaskFailedEventAttributes,
    ),
    activityTaskTimedOutEventAttributes: S.optional(
      ActivityTaskTimedOutEventAttributes,
    ),
    activityTaskCanceledEventAttributes: S.optional(
      ActivityTaskCanceledEventAttributes,
    ),
    activityTaskCancelRequestedEventAttributes: S.optional(
      ActivityTaskCancelRequestedEventAttributes,
    ),
    workflowExecutionSignaledEventAttributes: S.optional(
      WorkflowExecutionSignaledEventAttributes,
    ),
    markerRecordedEventAttributes: S.optional(MarkerRecordedEventAttributes),
    recordMarkerFailedEventAttributes: S.optional(
      RecordMarkerFailedEventAttributes,
    ),
    timerStartedEventAttributes: S.optional(TimerStartedEventAttributes),
    timerFiredEventAttributes: S.optional(TimerFiredEventAttributes),
    timerCanceledEventAttributes: S.optional(TimerCanceledEventAttributes),
    startChildWorkflowExecutionInitiatedEventAttributes: S.optional(
      StartChildWorkflowExecutionInitiatedEventAttributes,
    ),
    childWorkflowExecutionStartedEventAttributes: S.optional(
      ChildWorkflowExecutionStartedEventAttributes,
    ),
    childWorkflowExecutionCompletedEventAttributes: S.optional(
      ChildWorkflowExecutionCompletedEventAttributes,
    ),
    childWorkflowExecutionFailedEventAttributes: S.optional(
      ChildWorkflowExecutionFailedEventAttributes,
    ),
    childWorkflowExecutionTimedOutEventAttributes: S.optional(
      ChildWorkflowExecutionTimedOutEventAttributes,
    ),
    childWorkflowExecutionCanceledEventAttributes: S.optional(
      ChildWorkflowExecutionCanceledEventAttributes,
    ),
    childWorkflowExecutionTerminatedEventAttributes: S.optional(
      ChildWorkflowExecutionTerminatedEventAttributes,
    ),
    signalExternalWorkflowExecutionInitiatedEventAttributes: S.optional(
      SignalExternalWorkflowExecutionInitiatedEventAttributes,
    ),
    externalWorkflowExecutionSignaledEventAttributes: S.optional(
      ExternalWorkflowExecutionSignaledEventAttributes,
    ),
    signalExternalWorkflowExecutionFailedEventAttributes: S.optional(
      SignalExternalWorkflowExecutionFailedEventAttributes,
    ),
    externalWorkflowExecutionCancelRequestedEventAttributes: S.optional(
      ExternalWorkflowExecutionCancelRequestedEventAttributes,
    ),
    requestCancelExternalWorkflowExecutionInitiatedEventAttributes: S.optional(
      RequestCancelExternalWorkflowExecutionInitiatedEventAttributes,
    ),
    requestCancelExternalWorkflowExecutionFailedEventAttributes: S.optional(
      RequestCancelExternalWorkflowExecutionFailedEventAttributes,
    ),
    scheduleActivityTaskFailedEventAttributes: S.optional(
      ScheduleActivityTaskFailedEventAttributes,
    ),
    requestCancelActivityTaskFailedEventAttributes: S.optional(
      RequestCancelActivityTaskFailedEventAttributes,
    ),
    startTimerFailedEventAttributes: S.optional(
      StartTimerFailedEventAttributes,
    ),
    cancelTimerFailedEventAttributes: S.optional(
      CancelTimerFailedEventAttributes,
    ),
    startChildWorkflowExecutionFailedEventAttributes: S.optional(
      StartChildWorkflowExecutionFailedEventAttributes,
    ),
    lambdaFunctionScheduledEventAttributes: S.optional(
      LambdaFunctionScheduledEventAttributes,
    ),
    lambdaFunctionStartedEventAttributes: S.optional(
      LambdaFunctionStartedEventAttributes,
    ),
    lambdaFunctionCompletedEventAttributes: S.optional(
      LambdaFunctionCompletedEventAttributes,
    ),
    lambdaFunctionFailedEventAttributes: S.optional(
      LambdaFunctionFailedEventAttributes,
    ),
    lambdaFunctionTimedOutEventAttributes: S.optional(
      LambdaFunctionTimedOutEventAttributes,
    ),
    scheduleLambdaFunctionFailedEventAttributes: S.optional(
      ScheduleLambdaFunctionFailedEventAttributes,
    ),
    startLambdaFunctionFailedEventAttributes: S.optional(
      StartLambdaFunctionFailedEventAttributes,
    ),
  }),
).annotations({ identifier: "HistoryEvent" }) as any as S.Schema<HistoryEvent>;
export type HistoryEventList = HistoryEvent[];
export const HistoryEventList = S.Array(HistoryEvent);
export interface DecisionTask {
  taskToken: string;
  startedEventId: number;
  workflowExecution: WorkflowExecution;
  workflowType: WorkflowType;
  events: HistoryEvent[];
  nextPageToken?: string;
  previousStartedEventId?: number;
}
export const DecisionTask = S.suspend(() =>
  S.Struct({
    taskToken: S.String,
    startedEventId: S.Number,
    workflowExecution: WorkflowExecution,
    workflowType: WorkflowType,
    events: HistoryEventList,
    nextPageToken: S.optional(S.String),
    previousStartedEventId: S.optional(S.Number),
  }).pipe(ns),
).annotations({ identifier: "DecisionTask" }) as any as S.Schema<DecisionTask>;
export interface ActivityTaskStatus {
  cancelRequested: boolean;
}
export const ActivityTaskStatus = S.suspend(() =>
  S.Struct({ cancelRequested: S.Boolean }).pipe(ns),
).annotations({
  identifier: "ActivityTaskStatus",
}) as any as S.Schema<ActivityTaskStatus>;
export interface RegisterDomainInput {
  name: string;
  description?: string;
  workflowExecutionRetentionPeriodInDays: string;
  tags?: ResourceTag[];
}
export const RegisterDomainInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    workflowExecutionRetentionPeriodInDays: S.String,
    tags: S.optional(ResourceTagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterDomainInput",
}) as any as S.Schema<RegisterDomainInput>;
export interface RegisterDomainResponse {}
export const RegisterDomainResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RegisterDomainResponse",
}) as any as S.Schema<RegisterDomainResponse>;
export interface Run {
  runId?: string;
}
export const Run = S.suspend(() =>
  S.Struct({ runId: S.optional(S.String) }).pipe(ns),
).annotations({ identifier: "Run" }) as any as S.Schema<Run>;
export type ExecutionStatus = "OPEN" | "CLOSED";
export const ExecutionStatus = S.Literal("OPEN", "CLOSED");
export interface ScheduleActivityTaskDecisionAttributes {
  activityType: ActivityType;
  activityId: string;
  control?: string;
  input?: string;
  scheduleToCloseTimeout?: string;
  taskList?: TaskList;
  taskPriority?: string;
  scheduleToStartTimeout?: string;
  startToCloseTimeout?: string;
  heartbeatTimeout?: string;
}
export const ScheduleActivityTaskDecisionAttributes = S.suspend(() =>
  S.Struct({
    activityType: ActivityType,
    activityId: S.String,
    control: S.optional(S.String),
    input: S.optional(S.String),
    scheduleToCloseTimeout: S.optional(S.String),
    taskList: S.optional(TaskList),
    taskPriority: S.optional(S.String),
    scheduleToStartTimeout: S.optional(S.String),
    startToCloseTimeout: S.optional(S.String),
    heartbeatTimeout: S.optional(S.String),
  }),
).annotations({
  identifier: "ScheduleActivityTaskDecisionAttributes",
}) as any as S.Schema<ScheduleActivityTaskDecisionAttributes>;
export interface RequestCancelActivityTaskDecisionAttributes {
  activityId: string;
}
export const RequestCancelActivityTaskDecisionAttributes = S.suspend(() =>
  S.Struct({ activityId: S.String }),
).annotations({
  identifier: "RequestCancelActivityTaskDecisionAttributes",
}) as any as S.Schema<RequestCancelActivityTaskDecisionAttributes>;
export interface CompleteWorkflowExecutionDecisionAttributes {
  result?: string;
}
export const CompleteWorkflowExecutionDecisionAttributes = S.suspend(() =>
  S.Struct({ result: S.optional(S.String) }),
).annotations({
  identifier: "CompleteWorkflowExecutionDecisionAttributes",
}) as any as S.Schema<CompleteWorkflowExecutionDecisionAttributes>;
export interface FailWorkflowExecutionDecisionAttributes {
  reason?: string;
  details?: string;
}
export const FailWorkflowExecutionDecisionAttributes = S.suspend(() =>
  S.Struct({ reason: S.optional(S.String), details: S.optional(S.String) }),
).annotations({
  identifier: "FailWorkflowExecutionDecisionAttributes",
}) as any as S.Schema<FailWorkflowExecutionDecisionAttributes>;
export interface CancelWorkflowExecutionDecisionAttributes {
  details?: string;
}
export const CancelWorkflowExecutionDecisionAttributes = S.suspend(() =>
  S.Struct({ details: S.optional(S.String) }),
).annotations({
  identifier: "CancelWorkflowExecutionDecisionAttributes",
}) as any as S.Schema<CancelWorkflowExecutionDecisionAttributes>;
export interface ContinueAsNewWorkflowExecutionDecisionAttributes {
  input?: string;
  executionStartToCloseTimeout?: string;
  taskList?: TaskList;
  taskPriority?: string;
  taskStartToCloseTimeout?: string;
  childPolicy?: ChildPolicy;
  tagList?: string[];
  workflowTypeVersion?: string;
  lambdaRole?: string;
}
export const ContinueAsNewWorkflowExecutionDecisionAttributes = S.suspend(() =>
  S.Struct({
    input: S.optional(S.String),
    executionStartToCloseTimeout: S.optional(S.String),
    taskList: S.optional(TaskList),
    taskPriority: S.optional(S.String),
    taskStartToCloseTimeout: S.optional(S.String),
    childPolicy: S.optional(ChildPolicy),
    tagList: S.optional(TagList),
    workflowTypeVersion: S.optional(S.String),
    lambdaRole: S.optional(S.String),
  }),
).annotations({
  identifier: "ContinueAsNewWorkflowExecutionDecisionAttributes",
}) as any as S.Schema<ContinueAsNewWorkflowExecutionDecisionAttributes>;
export interface RecordMarkerDecisionAttributes {
  markerName: string;
  details?: string;
}
export const RecordMarkerDecisionAttributes = S.suspend(() =>
  S.Struct({ markerName: S.String, details: S.optional(S.String) }),
).annotations({
  identifier: "RecordMarkerDecisionAttributes",
}) as any as S.Schema<RecordMarkerDecisionAttributes>;
export interface StartTimerDecisionAttributes {
  timerId: string;
  control?: string;
  startToFireTimeout: string;
}
export const StartTimerDecisionAttributes = S.suspend(() =>
  S.Struct({
    timerId: S.String,
    control: S.optional(S.String),
    startToFireTimeout: S.String,
  }),
).annotations({
  identifier: "StartTimerDecisionAttributes",
}) as any as S.Schema<StartTimerDecisionAttributes>;
export interface CancelTimerDecisionAttributes {
  timerId: string;
}
export const CancelTimerDecisionAttributes = S.suspend(() =>
  S.Struct({ timerId: S.String }),
).annotations({
  identifier: "CancelTimerDecisionAttributes",
}) as any as S.Schema<CancelTimerDecisionAttributes>;
export interface SignalExternalWorkflowExecutionDecisionAttributes {
  workflowId: string;
  runId?: string;
  signalName: string;
  input?: string;
  control?: string;
}
export const SignalExternalWorkflowExecutionDecisionAttributes = S.suspend(() =>
  S.Struct({
    workflowId: S.String,
    runId: S.optional(S.String),
    signalName: S.String,
    input: S.optional(S.String),
    control: S.optional(S.String),
  }),
).annotations({
  identifier: "SignalExternalWorkflowExecutionDecisionAttributes",
}) as any as S.Schema<SignalExternalWorkflowExecutionDecisionAttributes>;
export interface RequestCancelExternalWorkflowExecutionDecisionAttributes {
  workflowId: string;
  runId?: string;
  control?: string;
}
export const RequestCancelExternalWorkflowExecutionDecisionAttributes =
  S.suspend(() =>
    S.Struct({
      workflowId: S.String,
      runId: S.optional(S.String),
      control: S.optional(S.String),
    }),
  ).annotations({
    identifier: "RequestCancelExternalWorkflowExecutionDecisionAttributes",
  }) as any as S.Schema<RequestCancelExternalWorkflowExecutionDecisionAttributes>;
export interface StartChildWorkflowExecutionDecisionAttributes {
  workflowType: WorkflowType;
  workflowId: string;
  control?: string;
  input?: string;
  executionStartToCloseTimeout?: string;
  taskList?: TaskList;
  taskPriority?: string;
  taskStartToCloseTimeout?: string;
  childPolicy?: ChildPolicy;
  tagList?: string[];
  lambdaRole?: string;
}
export const StartChildWorkflowExecutionDecisionAttributes = S.suspend(() =>
  S.Struct({
    workflowType: WorkflowType,
    workflowId: S.String,
    control: S.optional(S.String),
    input: S.optional(S.String),
    executionStartToCloseTimeout: S.optional(S.String),
    taskList: S.optional(TaskList),
    taskPriority: S.optional(S.String),
    taskStartToCloseTimeout: S.optional(S.String),
    childPolicy: S.optional(ChildPolicy),
    tagList: S.optional(TagList),
    lambdaRole: S.optional(S.String),
  }),
).annotations({
  identifier: "StartChildWorkflowExecutionDecisionAttributes",
}) as any as S.Schema<StartChildWorkflowExecutionDecisionAttributes>;
export interface ScheduleLambdaFunctionDecisionAttributes {
  id: string;
  name: string;
  control?: string;
  input?: string;
  startToCloseTimeout?: string;
}
export const ScheduleLambdaFunctionDecisionAttributes = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    control: S.optional(S.String),
    input: S.optional(S.String),
    startToCloseTimeout: S.optional(S.String),
  }),
).annotations({
  identifier: "ScheduleLambdaFunctionDecisionAttributes",
}) as any as S.Schema<ScheduleLambdaFunctionDecisionAttributes>;
export interface ActivityTypeConfiguration {
  defaultTaskStartToCloseTimeout?: string;
  defaultTaskHeartbeatTimeout?: string;
  defaultTaskList?: TaskList;
  defaultTaskPriority?: string;
  defaultTaskScheduleToStartTimeout?: string;
  defaultTaskScheduleToCloseTimeout?: string;
}
export const ActivityTypeConfiguration = S.suspend(() =>
  S.Struct({
    defaultTaskStartToCloseTimeout: S.optional(S.String),
    defaultTaskHeartbeatTimeout: S.optional(S.String),
    defaultTaskList: S.optional(TaskList),
    defaultTaskPriority: S.optional(S.String),
    defaultTaskScheduleToStartTimeout: S.optional(S.String),
    defaultTaskScheduleToCloseTimeout: S.optional(S.String),
  }),
).annotations({
  identifier: "ActivityTypeConfiguration",
}) as any as S.Schema<ActivityTypeConfiguration>;
export interface DomainConfiguration {
  workflowExecutionRetentionPeriodInDays: string;
}
export const DomainConfiguration = S.suspend(() =>
  S.Struct({ workflowExecutionRetentionPeriodInDays: S.String }),
).annotations({
  identifier: "DomainConfiguration",
}) as any as S.Schema<DomainConfiguration>;
export interface WorkflowTypeConfiguration {
  defaultTaskStartToCloseTimeout?: string;
  defaultExecutionStartToCloseTimeout?: string;
  defaultTaskList?: TaskList;
  defaultTaskPriority?: string;
  defaultChildPolicy?: ChildPolicy;
  defaultLambdaRole?: string;
}
export const WorkflowTypeConfiguration = S.suspend(() =>
  S.Struct({
    defaultTaskStartToCloseTimeout: S.optional(S.String),
    defaultExecutionStartToCloseTimeout: S.optional(S.String),
    defaultTaskList: S.optional(TaskList),
    defaultTaskPriority: S.optional(S.String),
    defaultChildPolicy: S.optional(ChildPolicy),
    defaultLambdaRole: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkflowTypeConfiguration",
}) as any as S.Schema<WorkflowTypeConfiguration>;
export interface WorkflowExecutionInfo {
  execution: WorkflowExecution;
  workflowType: WorkflowType;
  startTimestamp: Date;
  closeTimestamp?: Date;
  executionStatus: ExecutionStatus;
  closeStatus?: CloseStatus;
  parent?: WorkflowExecution;
  tagList?: string[];
  cancelRequested?: boolean;
}
export const WorkflowExecutionInfo = S.suspend(() =>
  S.Struct({
    execution: WorkflowExecution,
    workflowType: WorkflowType,
    startTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    closeTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    executionStatus: ExecutionStatus,
    closeStatus: S.optional(CloseStatus),
    parent: S.optional(WorkflowExecution),
    tagList: S.optional(TagList),
    cancelRequested: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "WorkflowExecutionInfo",
}) as any as S.Schema<WorkflowExecutionInfo>;
export type WorkflowExecutionInfoList = WorkflowExecutionInfo[];
export const WorkflowExecutionInfoList = S.Array(WorkflowExecutionInfo);
export interface Decision {
  decisionType: DecisionType;
  scheduleActivityTaskDecisionAttributes?: ScheduleActivityTaskDecisionAttributes;
  requestCancelActivityTaskDecisionAttributes?: RequestCancelActivityTaskDecisionAttributes;
  completeWorkflowExecutionDecisionAttributes?: CompleteWorkflowExecutionDecisionAttributes;
  failWorkflowExecutionDecisionAttributes?: FailWorkflowExecutionDecisionAttributes;
  cancelWorkflowExecutionDecisionAttributes?: CancelWorkflowExecutionDecisionAttributes;
  continueAsNewWorkflowExecutionDecisionAttributes?: ContinueAsNewWorkflowExecutionDecisionAttributes;
  recordMarkerDecisionAttributes?: RecordMarkerDecisionAttributes;
  startTimerDecisionAttributes?: StartTimerDecisionAttributes;
  cancelTimerDecisionAttributes?: CancelTimerDecisionAttributes;
  signalExternalWorkflowExecutionDecisionAttributes?: SignalExternalWorkflowExecutionDecisionAttributes;
  requestCancelExternalWorkflowExecutionDecisionAttributes?: RequestCancelExternalWorkflowExecutionDecisionAttributes;
  startChildWorkflowExecutionDecisionAttributes?: StartChildWorkflowExecutionDecisionAttributes;
  scheduleLambdaFunctionDecisionAttributes?: ScheduleLambdaFunctionDecisionAttributes;
}
export const Decision = S.suspend(() =>
  S.Struct({
    decisionType: DecisionType,
    scheduleActivityTaskDecisionAttributes: S.optional(
      ScheduleActivityTaskDecisionAttributes,
    ),
    requestCancelActivityTaskDecisionAttributes: S.optional(
      RequestCancelActivityTaskDecisionAttributes,
    ),
    completeWorkflowExecutionDecisionAttributes: S.optional(
      CompleteWorkflowExecutionDecisionAttributes,
    ),
    failWorkflowExecutionDecisionAttributes: S.optional(
      FailWorkflowExecutionDecisionAttributes,
    ),
    cancelWorkflowExecutionDecisionAttributes: S.optional(
      CancelWorkflowExecutionDecisionAttributes,
    ),
    continueAsNewWorkflowExecutionDecisionAttributes: S.optional(
      ContinueAsNewWorkflowExecutionDecisionAttributes,
    ),
    recordMarkerDecisionAttributes: S.optional(RecordMarkerDecisionAttributes),
    startTimerDecisionAttributes: S.optional(StartTimerDecisionAttributes),
    cancelTimerDecisionAttributes: S.optional(CancelTimerDecisionAttributes),
    signalExternalWorkflowExecutionDecisionAttributes: S.optional(
      SignalExternalWorkflowExecutionDecisionAttributes,
    ),
    requestCancelExternalWorkflowExecutionDecisionAttributes: S.optional(
      RequestCancelExternalWorkflowExecutionDecisionAttributes,
    ),
    startChildWorkflowExecutionDecisionAttributes: S.optional(
      StartChildWorkflowExecutionDecisionAttributes,
    ),
    scheduleLambdaFunctionDecisionAttributes: S.optional(
      ScheduleLambdaFunctionDecisionAttributes,
    ),
  }),
).annotations({ identifier: "Decision" }) as any as S.Schema<Decision>;
export type DecisionList = Decision[];
export const DecisionList = S.Array(Decision);
export interface ActivityTypeDetail {
  typeInfo: ActivityTypeInfo;
  configuration: ActivityTypeConfiguration;
}
export const ActivityTypeDetail = S.suspend(() =>
  S.Struct({
    typeInfo: ActivityTypeInfo,
    configuration: ActivityTypeConfiguration,
  }).pipe(ns),
).annotations({
  identifier: "ActivityTypeDetail",
}) as any as S.Schema<ActivityTypeDetail>;
export interface DomainDetail {
  domainInfo: DomainInfo;
  configuration: DomainConfiguration;
}
export const DomainDetail = S.suspend(() =>
  S.Struct({ domainInfo: DomainInfo, configuration: DomainConfiguration }).pipe(
    ns,
  ),
).annotations({ identifier: "DomainDetail" }) as any as S.Schema<DomainDetail>;
export interface WorkflowTypeDetail {
  typeInfo: WorkflowTypeInfo;
  configuration: WorkflowTypeConfiguration;
}
export const WorkflowTypeDetail = S.suspend(() =>
  S.Struct({
    typeInfo: WorkflowTypeInfo,
    configuration: WorkflowTypeConfiguration,
  }).pipe(ns),
).annotations({
  identifier: "WorkflowTypeDetail",
}) as any as S.Schema<WorkflowTypeDetail>;
export interface WorkflowExecutionInfos {
  executionInfos: WorkflowExecutionInfo[];
  nextPageToken?: string;
}
export const WorkflowExecutionInfos = S.suspend(() =>
  S.Struct({
    executionInfos: WorkflowExecutionInfoList,
    nextPageToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "WorkflowExecutionInfos",
}) as any as S.Schema<WorkflowExecutionInfos>;
export interface RespondDecisionTaskCompletedInput {
  taskToken: string;
  decisions?: Decision[];
  executionContext?: string;
  taskList?: TaskList;
  taskListScheduleToStartTimeout?: string;
}
export const RespondDecisionTaskCompletedInput = S.suspend(() =>
  S.Struct({
    taskToken: S.String,
    decisions: S.optional(DecisionList),
    executionContext: S.optional(S.String),
    taskList: S.optional(TaskList),
    taskListScheduleToStartTimeout: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RespondDecisionTaskCompletedInput",
}) as any as S.Schema<RespondDecisionTaskCompletedInput>;
export interface RespondDecisionTaskCompletedResponse {}
export const RespondDecisionTaskCompletedResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RespondDecisionTaskCompletedResponse",
}) as any as S.Schema<RespondDecisionTaskCompletedResponse>;
export interface WorkflowExecutionConfiguration {
  taskStartToCloseTimeout: string;
  executionStartToCloseTimeout: string;
  taskList: TaskList;
  taskPriority?: string;
  childPolicy: ChildPolicy;
  lambdaRole?: string;
}
export const WorkflowExecutionConfiguration = S.suspend(() =>
  S.Struct({
    taskStartToCloseTimeout: S.String,
    executionStartToCloseTimeout: S.String,
    taskList: TaskList,
    taskPriority: S.optional(S.String),
    childPolicy: ChildPolicy,
    lambdaRole: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkflowExecutionConfiguration",
}) as any as S.Schema<WorkflowExecutionConfiguration>;
export interface WorkflowExecutionOpenCounts {
  openActivityTasks: number;
  openDecisionTasks: number;
  openTimers: number;
  openChildWorkflowExecutions: number;
  openLambdaFunctions?: number;
}
export const WorkflowExecutionOpenCounts = S.suspend(() =>
  S.Struct({
    openActivityTasks: S.Number,
    openDecisionTasks: S.Number,
    openTimers: S.Number,
    openChildWorkflowExecutions: S.Number,
    openLambdaFunctions: S.optional(S.Number),
  }),
).annotations({
  identifier: "WorkflowExecutionOpenCounts",
}) as any as S.Schema<WorkflowExecutionOpenCounts>;
export interface WorkflowExecutionDetail {
  executionInfo: WorkflowExecutionInfo;
  executionConfiguration: WorkflowExecutionConfiguration;
  openCounts: WorkflowExecutionOpenCounts;
  latestActivityTaskTimestamp?: Date;
  latestExecutionContext?: string;
}
export const WorkflowExecutionDetail = S.suspend(() =>
  S.Struct({
    executionInfo: WorkflowExecutionInfo,
    executionConfiguration: WorkflowExecutionConfiguration,
    openCounts: WorkflowExecutionOpenCounts,
    latestActivityTaskTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    latestExecutionContext: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "WorkflowExecutionDetail",
}) as any as S.Schema<WorkflowExecutionDetail>;
export interface History {
  events: HistoryEvent[];
  nextPageToken?: string;
}
export const History = S.suspend(() =>
  S.Struct({
    events: HistoryEventList,
    nextPageToken: S.optional(S.String),
  }).pipe(ns),
).annotations({ identifier: "History" }) as any as S.Schema<History>;

//# Errors
export class OperationNotPermittedFault extends S.TaggedError<OperationNotPermittedFault>()(
  "OperationNotPermittedFault",
  { message: S.optional(S.String) },
) {}
export class DomainDeprecatedFault extends S.TaggedError<DomainDeprecatedFault>()(
  "DomainDeprecatedFault",
  { message: S.optional(S.String) },
) {}
export class LimitExceededFault extends S.TaggedError<LimitExceededFault>()(
  "LimitExceededFault",
  { message: S.optional(S.String) },
) {}
export class DomainAlreadyExistsFault extends S.TaggedError<DomainAlreadyExistsFault>()(
  "DomainAlreadyExistsFault",
  { message: S.optional(S.String) },
) {}
export class TypeDeprecatedFault extends S.TaggedError<TypeDeprecatedFault>()(
  "TypeDeprecatedFault",
  { message: S.optional(S.String) },
) {}
export class UnknownResourceFault extends S.TaggedError<UnknownResourceFault>()(
  "UnknownResourceFault",
  { message: S.optional(S.String) },
) {}
export class TypeAlreadyExistsFault extends S.TaggedError<TypeAlreadyExistsFault>()(
  "TypeAlreadyExistsFault",
  { message: S.optional(S.String) },
) {}
export class DefaultUndefinedFault extends S.TaggedError<DefaultUndefinedFault>()(
  "DefaultUndefinedFault",
  { message: S.optional(S.String) },
) {}
export class TypeNotDeprecatedFault extends S.TaggedError<TypeNotDeprecatedFault>()(
  "TypeNotDeprecatedFault",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsFault extends S.TaggedError<TooManyTagsFault>()(
  "TooManyTagsFault",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class WorkflowExecutionAlreadyStartedFault extends S.TaggedError<WorkflowExecutionAlreadyStartedFault>()(
  "WorkflowExecutionAlreadyStartedFault",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns the list of domains registered in the account. The results may be split into
 * multiple pages. To retrieve subsequent pages, make the call again using the nextPageToken
 * returned by the initial call.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains. The element must be set to
 * `arn:aws:swf::AccountID:domain/*`, where *AccountID* is
 * the account ID, with no dashes.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const listDomains: {
  (
    input: ListDomainsInput,
  ): effect.Effect<
    DomainInfos,
    OperationNotPermittedFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainsInput,
  ) => stream.Stream<
    DomainInfos,
    OperationNotPermittedFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainsInput,
  ) => stream.Stream<
    DomainInfo,
    OperationNotPermittedFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDomainsInput,
  output: DomainInfos,
  errors: [OperationNotPermittedFault],
  pagination: {
    inputToken: "nextPageToken",
    outputToken: "nextPageToken",
    items: "domainInfos",
    pageSize: "maximumPageSize",
  } as const,
}));
/**
 * Deprecates the specified domain. After a domain has been deprecated it cannot be used
 * to create new workflow executions or register new types. However, you can still use visibility
 * actions on this domain. Deprecating a domain also deprecates all activity and workflow types
 * registered in the domain. Executions that were started before the domain was deprecated
 * continues to run.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const deprecateDomain: (
  input: DeprecateDomainInput,
) => effect.Effect<
  DeprecateDomainResponse,
  | DomainDeprecatedFault
  | OperationNotPermittedFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeprecateDomainInput,
  output: DeprecateDomainResponse,
  errors: [
    DomainDeprecatedFault,
    OperationNotPermittedFault,
    UnknownResourceFault,
  ],
}));
/**
 * Returns information about the specified activity type. This includes configuration
 * settings provided when the type was registered and other general information about the
 * type.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `activityType.name`: String constraint. The key is
 * `swf:activityType.name`.
 *
 * - `activityType.version`: String constraint. The key is
 * `swf:activityType.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const describeActivityType: (
  input: DescribeActivityTypeInput,
) => effect.Effect<
  ActivityTypeDetail,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeActivityTypeInput,
  output: ActivityTypeDetail,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Returns information about the specified domain, including description and
 * status.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const describeDomain: (
  input: DescribeDomainInput,
) => effect.Effect<
  DomainDetail,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainInput,
  output: DomainDetail,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Returns information about the specified *workflow type*. This
 * includes configuration settings specified when the type was registered and other information
 * such as creation date, current status, etc.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `workflowType.name`: String constraint. The key is
 * `swf:workflowType.name`.
 *
 * - `workflowType.version`: String constraint. The key is
 * `swf:workflowType.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const describeWorkflowType: (
  input: DescribeWorkflowTypeInput,
) => effect.Effect<
  WorkflowTypeDetail,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkflowTypeInput,
  output: WorkflowTypeDetail,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Returns a list of closed workflow executions in the specified domain that meet the
 * filtering criteria. The results may be split into multiple pages. To retrieve subsequent
 * pages, make the call again using the nextPageToken returned by the initial call.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `tagFilter.tag`: String constraint. The key is
 * `swf:tagFilter.tag`.
 *
 * - `typeFilter.name`: String constraint. The key is
 * `swf:typeFilter.name`.
 *
 * - `typeFilter.version`: String constraint. The key is
 * `swf:typeFilter.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const listClosedWorkflowExecutions: {
  (
    input: ListClosedWorkflowExecutionsInput,
  ): effect.Effect<
    WorkflowExecutionInfos,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClosedWorkflowExecutionsInput,
  ) => stream.Stream<
    WorkflowExecutionInfos,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClosedWorkflowExecutionsInput,
  ) => stream.Stream<
    WorkflowExecutionInfo,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClosedWorkflowExecutionsInput,
  output: WorkflowExecutionInfos,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
  pagination: {
    inputToken: "nextPageToken",
    outputToken: "nextPageToken",
    items: "executionInfos",
    pageSize: "maximumPageSize",
  } as const,
}));
/**
 * Registers a new *activity type* along with its configuration
 * settings in the specified domain.
 *
 * A `TypeAlreadyExists` fault is returned if the type already exists in the
 * domain. You cannot change any configuration settings of the type after its registration, and
 * it must be registered as a new version.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `defaultTaskList.name`: String constraint. The key is
 * `swf:defaultTaskList.name`.
 *
 * - `name`: String constraint. The key is `swf:name`.
 *
 * - `version`: String constraint. The key is
 * `swf:version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const registerActivityType: (
  input: RegisterActivityTypeInput,
) => effect.Effect<
  RegisterActivityTypeResponse,
  | LimitExceededFault
  | OperationNotPermittedFault
  | TypeAlreadyExistsFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterActivityTypeInput,
  output: RegisterActivityTypeResponse,
  errors: [
    LimitExceededFault,
    OperationNotPermittedFault,
    TypeAlreadyExistsFault,
    UnknownResourceFault,
  ],
}));
/**
 * Used by deciders to tell the service that the DecisionTask identified
 * by the `taskToken` has successfully completed. The `decisions` argument
 * specifies the list of decisions made while processing the task.
 *
 * A `DecisionTaskCompleted` event is added to the workflow history. The
 * `executionContext` specified is attached to the event in the workflow execution
 * history.
 *
 * **Access Control**
 *
 * If an IAM policy grants permission to use `RespondDecisionTaskCompleted`, it
 * can express permissions for the list of decisions in the `decisions` parameter.
 * Each of the decisions has one or more parameters, much like a regular API call. To allow for
 * policies to be as readable as possible, you can express permissions on decisions as if they
 * were actual API calls, including applying conditions to some parameters. For more information,
 * see Using
 * IAM to Manage Access to Amazon SWF Workflows in the
 * *Amazon SWF Developer Guide*.
 */
export const respondDecisionTaskCompleted: (
  input: RespondDecisionTaskCompletedInput,
) => effect.Effect<
  RespondDecisionTaskCompletedResponse,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RespondDecisionTaskCompletedInput,
  output: RespondDecisionTaskCompletedResponse,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Deletes the specified *activity type*.
 *
 * Note: Prior to deletion, activity types must first be **deprecated**.
 *
 * After an activity type has been deleted, you cannot schedule new activities of that type. Activities that started before the type was deleted will continue to run.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `activityType.name`: String constraint. The key is
 * `swf:activityType.name`.
 *
 * - `activityType.version`: String constraint. The key is
 * `swf:activityType.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const deleteActivityType: (
  input: DeleteActivityTypeInput,
) => effect.Effect<
  DeleteActivityTypeResponse,
  | OperationNotPermittedFault
  | TypeNotDeprecatedFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteActivityTypeInput,
  output: DeleteActivityTypeResponse,
  errors: [
    OperationNotPermittedFault,
    TypeNotDeprecatedFault,
    UnknownResourceFault,
  ],
}));
/**
 * Deprecates the specified *workflow type*. After a workflow type has
 * been deprecated, you cannot create new executions of that type. Executions that were started
 * before the type was deprecated continues to run. A deprecated workflow type may still be used
 * when calling visibility actions.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `workflowType.name`: String constraint. The key is
 * `swf:workflowType.name`.
 *
 * - `workflowType.version`: String constraint. The key is
 * `swf:workflowType.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const deprecateWorkflowType: (
  input: DeprecateWorkflowTypeInput,
) => effect.Effect<
  DeprecateWorkflowTypeResponse,
  | OperationNotPermittedFault
  | TypeDeprecatedFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeprecateWorkflowTypeInput,
  output: DeprecateWorkflowTypeResponse,
  errors: [
    OperationNotPermittedFault,
    TypeDeprecatedFault,
    UnknownResourceFault,
  ],
}));
/**
 * Returns information about all activities registered in the specified domain that match
 * the specified name and registration status. The result includes information like creation
 * date, current status of the activity, etc. The results may be split into multiple pages. To
 * retrieve subsequent pages, make the call again using the `nextPageToken` returned
 * by the initial call.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const listActivityTypes: {
  (
    input: ListActivityTypesInput,
  ): effect.Effect<
    ActivityTypeInfos,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListActivityTypesInput,
  ) => stream.Stream<
    ActivityTypeInfos,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListActivityTypesInput,
  ) => stream.Stream<
    ActivityTypeInfo,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListActivityTypesInput,
  output: ActivityTypeInfos,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
  pagination: {
    inputToken: "nextPageToken",
    outputToken: "nextPageToken",
    items: "typeInfos",
    pageSize: "maximumPageSize",
  } as const,
}));
/**
 * Returns information about workflow types in the specified domain. The results may be
 * split into multiple pages that can be retrieved by making the call repeatedly.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const listWorkflowTypes: {
  (
    input: ListWorkflowTypesInput,
  ): effect.Effect<
    WorkflowTypeInfos,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkflowTypesInput,
  ) => stream.Stream<
    WorkflowTypeInfos,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkflowTypesInput,
  ) => stream.Stream<
    WorkflowTypeInfo,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkflowTypesInput,
  output: WorkflowTypeInfos,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
  pagination: {
    inputToken: "nextPageToken",
    outputToken: "nextPageToken",
    items: "typeInfos",
    pageSize: "maximumPageSize",
  } as const,
}));
/**
 * Used by activity workers to report to the service that the ActivityTask represented by the specified `taskToken` is still making progress. The worker
 * can also specify details of the progress, for example percent complete, using the
 * `details` parameter. This action can also be used by the worker as a mechanism to
 * check if cancellation is being requested for the activity task. If a cancellation is being
 * attempted for the specified task, then the boolean `cancelRequested` flag returned
 * by the service is set to `true`.
 *
 * This action resets the `taskHeartbeatTimeout` clock. The
 * `taskHeartbeatTimeout` is specified in RegisterActivityType.
 *
 * This action doesn't in itself create an event in the workflow execution history.
 * However, if the task times out, the workflow execution history contains a
 * `ActivityTaskTimedOut` event that contains the information from the last
 * heartbeat generated by the activity worker.
 *
 * The `taskStartToCloseTimeout` of an activity type is the maximum duration
 * of an activity task, regardless of the number of RecordActivityTaskHeartbeat requests received. The `taskStartToCloseTimeout` is also specified in RegisterActivityType.
 *
 * This operation is only useful for long-lived activities to report liveliness of the
 * task and to determine if a cancellation is being attempted.
 *
 * If the `cancelRequested` flag returns `true`, a cancellation is
 * being attempted. If the worker can cancel the activity, it should respond with RespondActivityTaskCanceled. Otherwise, it should ignore the cancellation
 * request.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const recordActivityTaskHeartbeat: (
  input: RecordActivityTaskHeartbeatInput,
) => effect.Effect<
  ActivityTaskStatus,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RecordActivityTaskHeartbeatInput,
  output: ActivityTaskStatus,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Undeprecates a previously deprecated domain. After a domain has been undeprecated it can be used
 * to create new workflow executions or register new types.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const undeprecateDomain: (
  input: UndeprecateDomainInput,
) => effect.Effect<
  UndeprecateDomainResponse,
  | DomainAlreadyExistsFault
  | OperationNotPermittedFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UndeprecateDomainInput,
  output: UndeprecateDomainResponse,
  errors: [
    DomainAlreadyExistsFault,
    OperationNotPermittedFault,
    UnknownResourceFault,
  ],
}));
/**
 * Returns a list of open workflow executions in the specified domain that meet the
 * filtering criteria. The results may be split into multiple pages. To retrieve subsequent
 * pages, make the call again using the nextPageToken returned by the initial call.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `tagFilter.tag`: String constraint. The key is
 * `swf:tagFilter.tag`.
 *
 * - `typeFilter.name`: String constraint. The key is
 * `swf:typeFilter.name`.
 *
 * - `typeFilter.version`: String constraint. The key is
 * `swf:typeFilter.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const listOpenWorkflowExecutions: {
  (
    input: ListOpenWorkflowExecutionsInput,
  ): effect.Effect<
    WorkflowExecutionInfos,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOpenWorkflowExecutionsInput,
  ) => stream.Stream<
    WorkflowExecutionInfos,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOpenWorkflowExecutionsInput,
  ) => stream.Stream<
    WorkflowExecutionInfo,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOpenWorkflowExecutionsInput,
  output: WorkflowExecutionInfos,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
  pagination: {
    inputToken: "nextPageToken",
    outputToken: "nextPageToken",
    items: "executionInfos",
    pageSize: "maximumPageSize",
  } as const,
}));
/**
 * Records a `WorkflowExecutionCancelRequested` event in the currently running
 * workflow execution identified by the given domain, workflowId, and runId. This logically
 * requests the cancellation of the workflow execution as a whole. It is up to the decider to
 * take appropriate actions when it receives an execution history with this event.
 *
 * If the runId isn't specified, the `WorkflowExecutionCancelRequested` event
 * is recorded in the history of the current open workflow execution with the specified
 * workflowId in the domain.
 *
 * Because this action allows the workflow to properly clean up and gracefully close, it
 * should be used instead of TerminateWorkflowExecution when
 * possible.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const requestCancelWorkflowExecution: (
  input: RequestCancelWorkflowExecutionInput,
) => effect.Effect<
  RequestCancelWorkflowExecutionResponse,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RequestCancelWorkflowExecutionInput,
  output: RequestCancelWorkflowExecutionResponse,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Used by workers to tell the service that the ActivityTask identified
 * by the `taskToken` was successfully canceled. Additional `details` can
 * be provided using the `details` argument.
 *
 * These `details` (if provided) appear in the
 * `ActivityTaskCanceled` event added to the workflow history.
 *
 * Only use this operation if the `canceled` flag of a RecordActivityTaskHeartbeat request returns `true` and if the
 * activity can be safely undone or abandoned.
 *
 * A task is considered open from the time that it is scheduled until it is closed.
 * Therefore a task is reported as open while a worker is processing it. A task is closed after
 * it has been specified in a call to RespondActivityTaskCompleted,
 * RespondActivityTaskCanceled, RespondActivityTaskFailed, or the task has
 * timed
 * out.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const respondActivityTaskCanceled: (
  input: RespondActivityTaskCanceledInput,
) => effect.Effect<
  RespondActivityTaskCanceledResponse,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RespondActivityTaskCanceledInput,
  output: RespondActivityTaskCanceledResponse,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Used by workers to tell the service that the ActivityTask identified
 * by the `taskToken` completed successfully with a `result` (if provided).
 * The `result` appears in the `ActivityTaskCompleted` event in the
 * workflow history.
 *
 * If the requested task doesn't complete successfully, use RespondActivityTaskFailed instead. If the worker finds that the task is
 * canceled through the `canceled` flag returned by RecordActivityTaskHeartbeat, it should cancel the task, clean up and then call
 * RespondActivityTaskCanceled.
 *
 * A task is considered open from the time that it is scheduled until it is closed.
 * Therefore a task is reported as open while a worker is processing it. A task is closed after
 * it has been specified in a call to RespondActivityTaskCompleted, RespondActivityTaskCanceled, RespondActivityTaskFailed, or the
 * task has timed
 * out.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const respondActivityTaskCompleted: (
  input: RespondActivityTaskCompletedInput,
) => effect.Effect<
  RespondActivityTaskCompletedResponse,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RespondActivityTaskCompletedInput,
  output: RespondActivityTaskCompletedResponse,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Used by workers to tell the service that the ActivityTask identified
 * by the `taskToken` has failed with `reason` (if specified). The
 * `reason` and `details` appear in the `ActivityTaskFailed`
 * event added to the workflow history.
 *
 * A task is considered open from the time that it is scheduled until it is closed.
 * Therefore a task is reported as open while a worker is processing it. A task is closed after
 * it has been specified in a call to RespondActivityTaskCompleted, RespondActivityTaskCanceled, RespondActivityTaskFailed, or the task has timed
 * out.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const respondActivityTaskFailed: (
  input: RespondActivityTaskFailedInput,
) => effect.Effect<
  RespondActivityTaskFailedResponse,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RespondActivityTaskFailedInput,
  output: RespondActivityTaskFailedResponse,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Records a `WorkflowExecutionSignaled` event in the workflow execution
 * history and creates a decision task for the workflow execution identified by the given domain,
 * workflowId and runId. The event is recorded with the specified user defined signalName and
 * input (if provided).
 *
 * If a runId isn't specified, then the `WorkflowExecutionSignaled` event is
 * recorded in the history of the current open workflow with the matching workflowId in the
 * domain.
 *
 * If the specified workflow execution isn't open, this method fails with
 * `UnknownResource`.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const signalWorkflowExecution: (
  input: SignalWorkflowExecutionInput,
) => effect.Effect<
  SignalWorkflowExecutionResponse,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SignalWorkflowExecutionInput,
  output: SignalWorkflowExecutionResponse,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Records a `WorkflowExecutionTerminated` event and forces closure of the
 * workflow execution identified by the given domain, runId, and workflowId. The child policy,
 * registered with the workflow type or specified when starting this execution, is applied to any
 * open child workflow executions of this workflow execution.
 *
 * If the identified workflow execution was in progress, it is terminated
 * immediately.
 *
 * If a runId isn't specified, then the `WorkflowExecutionTerminated` event
 * is recorded in the history of the current open workflow with the matching workflowId in the
 * domain.
 *
 * You should consider using RequestCancelWorkflowExecution action
 * instead because it allows the workflow to gracefully close while TerminateWorkflowExecution doesn't.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const terminateWorkflowExecution: (
  input: TerminateWorkflowExecutionInput,
) => effect.Effect<
  TerminateWorkflowExecutionResponse,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateWorkflowExecutionInput,
  output: TerminateWorkflowExecutionResponse,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Returns the number of closed workflow executions within the given domain that meet the
 * specified filtering criteria.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `tagFilter.tag`: String constraint. The key is
 * `swf:tagFilter.tag`.
 *
 * - `typeFilter.name`: String constraint. The key is
 * `swf:typeFilter.name`.
 *
 * - `typeFilter.version`: String constraint. The key is
 * `swf:typeFilter.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const countClosedWorkflowExecutions: (
  input: CountClosedWorkflowExecutionsInput,
) => effect.Effect<
  WorkflowExecutionCount,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CountClosedWorkflowExecutionsInput,
  output: WorkflowExecutionCount,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Returns the number of open workflow executions within the given domain that meet the
 * specified filtering criteria.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `tagFilter.tag`: String constraint. The key is
 * `swf:tagFilter.tag`.
 *
 * - `typeFilter.name`: String constraint. The key is
 * `swf:typeFilter.name`.
 *
 * - `typeFilter.version`: String constraint. The key is
 * `swf:typeFilter.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const countOpenWorkflowExecutions: (
  input: CountOpenWorkflowExecutionsInput,
) => effect.Effect<
  WorkflowExecutionCount,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CountOpenWorkflowExecutionsInput,
  output: WorkflowExecutionCount,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Returns the estimated number of activity tasks in the specified task list. The count
 * returned is an approximation and isn't guaranteed to be exact. If you specify a task list that
 * no activity task was ever scheduled in then `0` is returned.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the `taskList.name` parameter by using a
 * `Condition` element with the `swf:taskList.name` key to allow the
 * action to access only certain task lists.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const countPendingActivityTasks: (
  input: CountPendingActivityTasksInput,
) => effect.Effect<
  PendingTaskCount,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CountPendingActivityTasksInput,
  output: PendingTaskCount,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Returns the estimated number of decision tasks in the specified task list. The count
 * returned is an approximation and isn't guaranteed to be exact. If you specify a task list that
 * no decision task was ever scheduled in then `0` is returned.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the `taskList.name` parameter by using a
 * `Condition` element with the `swf:taskList.name` key to allow the
 * action to access only certain task lists.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const countPendingDecisionTasks: (
  input: CountPendingDecisionTasksInput,
) => effect.Effect<
  PendingTaskCount,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CountPendingDecisionTasksInput,
  output: PendingTaskCount,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Remove a tag from a Amazon SWF domain.
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceResponse,
  | LimitExceededFault
  | OperationNotPermittedFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
  errors: [
    LimitExceededFault,
    OperationNotPermittedFault,
    UnknownResourceFault,
  ],
}));
/**
 * List tags for a given domain.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => effect.Effect<
  ListTagsForResourceOutput,
  | LimitExceededFault
  | OperationNotPermittedFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    LimitExceededFault,
    OperationNotPermittedFault,
    UnknownResourceFault,
  ],
}));
/**
 * Used by workers to get an ActivityTask from the specified activity
 * `taskList`. This initiates a long poll, where the service holds the HTTP
 * connection open and responds as soon as a task becomes available. The maximum time the service
 * holds on to the request before responding is 60 seconds. If no task is available within 60
 * seconds, the poll returns an empty result. An empty result, in this context, means that an
 * ActivityTask is returned, but that the value of taskToken is an empty string. If a task is
 * returned, the worker should use its type to identify and process it correctly.
 *
 * Workers should set their client side socket timeout to at least 70 seconds (10
 * seconds higher than the maximum time service may hold the poll request).
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the `taskList.name` parameter by using a
 * `Condition` element with the `swf:taskList.name` key to allow the
 * action to access only certain task lists.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const pollForActivityTask: (
  input: PollForActivityTaskInput,
) => effect.Effect<
  ActivityTask,
  | LimitExceededFault
  | OperationNotPermittedFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PollForActivityTaskInput,
  output: ActivityTask,
  errors: [
    LimitExceededFault,
    OperationNotPermittedFault,
    UnknownResourceFault,
  ],
}));
/**
 * Used by deciders to get a DecisionTask from the specified decision
 * `taskList`. A decision task may be returned for any open workflow execution that
 * is using the specified task list. The task includes a paginated view of the history of the
 * workflow execution. The decider should use the workflow type and the history to determine how
 * to properly handle the task.
 *
 * This action initiates a long poll, where the service holds the HTTP connection open and
 * responds as soon a task becomes available. If no decision task is available in the specified
 * task list before the timeout of 60 seconds expires, an empty result is returned. An empty
 * result, in this context, means that a DecisionTask is returned, but that the value of
 * taskToken is an empty string.
 *
 * Deciders should set their client side socket timeout to at least 70 seconds (10
 * seconds higher than the timeout).
 *
 * Because the number of workflow history events for a single workflow execution might
 * be very large, the result returned might be split up across a number of pages. To retrieve
 * subsequent pages, make additional calls to `PollForDecisionTask` using the
 * `nextPageToken` returned by the initial call. Note that you do
 * *not* call `GetWorkflowExecutionHistory` with this
 * `nextPageToken`. Instead, call `PollForDecisionTask`
 * again.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the `taskList.name` parameter by using a
 * `Condition` element with the `swf:taskList.name` key to allow the
 * action to access only certain task lists.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const pollForDecisionTask: {
  (
    input: PollForDecisionTaskInput,
  ): effect.Effect<
    DecisionTask,
    | LimitExceededFault
    | OperationNotPermittedFault
    | UnknownResourceFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: PollForDecisionTaskInput,
  ) => stream.Stream<
    DecisionTask,
    | LimitExceededFault
    | OperationNotPermittedFault
    | UnknownResourceFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: PollForDecisionTaskInput,
  ) => stream.Stream<
    HistoryEvent,
    | LimitExceededFault
    | OperationNotPermittedFault
    | UnknownResourceFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: PollForDecisionTaskInput,
  output: DecisionTask,
  errors: [
    LimitExceededFault,
    OperationNotPermittedFault,
    UnknownResourceFault,
  ],
  pagination: {
    inputToken: "nextPageToken",
    outputToken: "nextPageToken",
    items: "events",
    pageSize: "maximumPageSize",
  } as const,
}));
/**
 * Deprecates the specified *activity type*. After an activity type has
 * been deprecated, you cannot create new tasks of that activity type. Tasks of this type that
 * were scheduled before the type was deprecated continue to run.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `activityType.name`: String constraint. The key is
 * `swf:activityType.name`.
 *
 * - `activityType.version`: String constraint. The key is
 * `swf:activityType.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const deprecateActivityType: (
  input: DeprecateActivityTypeInput,
) => effect.Effect<
  DeprecateActivityTypeResponse,
  | OperationNotPermittedFault
  | TypeDeprecatedFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeprecateActivityTypeInput,
  output: DeprecateActivityTypeResponse,
  errors: [
    OperationNotPermittedFault,
    TypeDeprecatedFault,
    UnknownResourceFault,
  ],
}));
/**
 * Add a tag to a Amazon SWF domain.
 *
 * Amazon SWF supports a maximum of 50 tags per resource.
 */
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceResponse,
  | LimitExceededFault
  | OperationNotPermittedFault
  | TooManyTagsFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
  errors: [
    LimitExceededFault,
    OperationNotPermittedFault,
    TooManyTagsFault,
    UnknownResourceFault,
  ],
}));
/**
 * Undeprecates a previously deprecated *activity type*. After an activity type has
 * been undeprecated, you can create new tasks of that activity type.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `activityType.name`: String constraint. The key is
 * `swf:activityType.name`.
 *
 * - `activityType.version`: String constraint. The key is
 * `swf:activityType.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const undeprecateActivityType: (
  input: UndeprecateActivityTypeInput,
) => effect.Effect<
  UndeprecateActivityTypeResponse,
  | OperationNotPermittedFault
  | TypeAlreadyExistsFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UndeprecateActivityTypeInput,
  output: UndeprecateActivityTypeResponse,
  errors: [
    OperationNotPermittedFault,
    TypeAlreadyExistsFault,
    UnknownResourceFault,
  ],
}));
/**
 * Undeprecates a previously deprecated *workflow type*. After a workflow type has
 * been undeprecated, you can create new executions of that type.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `workflowType.name`: String constraint. The key is
 * `swf:workflowType.name`.
 *
 * - `workflowType.version`: String constraint. The key is
 * `swf:workflowType.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const undeprecateWorkflowType: (
  input: UndeprecateWorkflowTypeInput,
) => effect.Effect<
  UndeprecateWorkflowTypeResponse,
  | OperationNotPermittedFault
  | TypeAlreadyExistsFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UndeprecateWorkflowTypeInput,
  output: UndeprecateWorkflowTypeResponse,
  errors: [
    OperationNotPermittedFault,
    TypeAlreadyExistsFault,
    UnknownResourceFault,
  ],
}));
/**
 * Registers a new *workflow type* and its configuration settings in
 * the specified domain.
 *
 * The retention period for the workflow history is set by the RegisterDomain action.
 *
 * If the type already exists, then a `TypeAlreadyExists` fault is returned.
 * You cannot change the configuration settings of a workflow type once it is registered and it
 * must be registered as a new version.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `defaultTaskList.name`: String constraint. The key is
 * `swf:defaultTaskList.name`.
 *
 * - `name`: String constraint. The key is `swf:name`.
 *
 * - `version`: String constraint. The key is
 * `swf:version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const registerWorkflowType: (
  input: RegisterWorkflowTypeInput,
) => effect.Effect<
  RegisterWorkflowTypeResponse,
  | LimitExceededFault
  | OperationNotPermittedFault
  | TypeAlreadyExistsFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterWorkflowTypeInput,
  output: RegisterWorkflowTypeResponse,
  errors: [
    LimitExceededFault,
    OperationNotPermittedFault,
    TypeAlreadyExistsFault,
    UnknownResourceFault,
  ],
}));
/**
 * Deletes the specified *workflow type*.
 *
 * Note: Prior to deletion, workflow types must first be **deprecated**.
 *
 * After a workflow type has been deleted, you cannot create new executions of that type. Executions that
 * started before the type was deleted will continue to run.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `workflowType.name`: String constraint. The key is
 * `swf:workflowType.name`.
 *
 * - `workflowType.version`: String constraint. The key is
 * `swf:workflowType.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const deleteWorkflowType: (
  input: DeleteWorkflowTypeInput,
) => effect.Effect<
  DeleteWorkflowTypeResponse,
  | OperationNotPermittedFault
  | TypeNotDeprecatedFault
  | UnknownResourceFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkflowTypeInput,
  output: DeleteWorkflowTypeResponse,
  errors: [
    OperationNotPermittedFault,
    TypeNotDeprecatedFault,
    UnknownResourceFault,
  ],
}));
/**
 * Registers a new domain.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - You cannot use an IAM policy to control domain access for this action. The name of
 * the domain being registered is available as the resource of this action.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const registerDomain: (
  input: RegisterDomainInput,
) => effect.Effect<
  RegisterDomainResponse,
  | DomainAlreadyExistsFault
  | LimitExceededFault
  | OperationNotPermittedFault
  | TooManyTagsFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterDomainInput,
  output: RegisterDomainResponse,
  errors: [
    DomainAlreadyExistsFault,
    LimitExceededFault,
    OperationNotPermittedFault,
    TooManyTagsFault,
  ],
}));
/**
 * Returns information about the specified workflow execution including its type and some
 * statistics.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const describeWorkflowExecution: (
  input: DescribeWorkflowExecutionInput,
) => effect.Effect<
  WorkflowExecutionDetail,
  OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkflowExecutionInput,
  output: WorkflowExecutionDetail,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
}));
/**
 * Returns the history of the specified workflow execution. The results may be split into
 * multiple pages. To retrieve subsequent pages, make the call again using the
 * `nextPageToken` returned by the initial call.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * exactly reflect recent updates and changes.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - You cannot use an IAM policy to constrain this action's parameters.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const getWorkflowExecutionHistory: {
  (
    input: GetWorkflowExecutionHistoryInput,
  ): effect.Effect<
    History,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetWorkflowExecutionHistoryInput,
  ) => stream.Stream<
    History,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetWorkflowExecutionHistoryInput,
  ) => stream.Stream<
    HistoryEvent,
    OperationNotPermittedFault | UnknownResourceFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetWorkflowExecutionHistoryInput,
  output: History,
  errors: [OperationNotPermittedFault, UnknownResourceFault],
  pagination: {
    inputToken: "nextPageToken",
    outputToken: "nextPageToken",
    items: "events",
    pageSize: "maximumPageSize",
  } as const,
}));
/**
 * Starts an execution of the workflow type in the specified domain using the provided
 * `workflowId` and input data.
 *
 * This action returns the newly started workflow execution.
 *
 * **Access Control**
 *
 * You can use IAM policies to control this action's access to Amazon SWF resources as
 * follows:
 *
 * - Use a `Resource` element with the domain name to limit the action to
 * only specified domains.
 *
 * - Use an `Action` element to allow or deny permission to call this
 * action.
 *
 * - Constrain the following parameters by using a `Condition` element with
 * the appropriate keys.
 *
 * - `tagList.member.0`: The key is `swf:tagList.member.0`.
 *
 * - `tagList.member.1`: The key is `swf:tagList.member.1`.
 *
 * - `tagList.member.2`: The key is `swf:tagList.member.2`.
 *
 * - `tagList.member.3`: The key is `swf:tagList.member.3`.
 *
 * - `tagList.member.4`: The key is `swf:tagList.member.4`.
 *
 * - `taskList`: String constraint. The key is
 * `swf:taskList.name`.
 *
 * - `workflowType.name`: String constraint. The key is
 * `swf:workflowType.name`.
 *
 * - `workflowType.version`: String constraint. The key is
 * `swf:workflowType.version`.
 *
 * If the caller doesn't have sufficient permissions to invoke the action, or the
 * parameter values fall outside the specified constraints, the action fails. The associated
 * event attribute's `cause` parameter is set to `OPERATION_NOT_PERMITTED`.
 * For details and example IAM policies, see Using IAM to Manage Access to Amazon SWF
 * Workflows in the *Amazon SWF Developer Guide*.
 */
export const startWorkflowExecution: (
  input: StartWorkflowExecutionInput,
) => effect.Effect<
  Run,
  | DefaultUndefinedFault
  | LimitExceededFault
  | OperationNotPermittedFault
  | TypeDeprecatedFault
  | UnknownResourceFault
  | WorkflowExecutionAlreadyStartedFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartWorkflowExecutionInput,
  output: Run,
  errors: [
    DefaultUndefinedFault,
    LimitExceededFault,
    OperationNotPermittedFault,
    TypeDeprecatedFault,
    UnknownResourceFault,
    WorkflowExecutionAlreadyStartedFault,
  ],
}));
