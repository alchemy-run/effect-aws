import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://swf.amazonaws.com/doc/2012-01-25");
const svc = T.AwsApiService({
  sdkId: "SWF",
  serviceShapeName: "SimpleWorkflowService",
});
const auth = T.AwsAuthSigv4({ name: "swf" });
const ver = T.ServiceVersion("2012-01-25");
const proto = T.AwsProtocolsAwsJson1_0();
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
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://swf.{Region}.{PartitionResult#dnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://swf-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                            url: "https://swf-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                            url: "https://swf-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                            url: "https://swf.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://swf.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagList = S.Array(S.String);
export const ResourceTagKeyList = S.Array(S.String);
export class ExecutionTimeFilter extends S.Class<ExecutionTimeFilter>(
  "ExecutionTimeFilter",
)({
  oldestDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  latestDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class WorkflowTypeFilter extends S.Class<WorkflowTypeFilter>(
  "WorkflowTypeFilter",
)({ name: S.String, version: S.optional(S.String) }) {}
export class TagFilter extends S.Class<TagFilter>("TagFilter")({
  tag: S.String,
}) {}
export class WorkflowExecutionFilter extends S.Class<WorkflowExecutionFilter>(
  "WorkflowExecutionFilter",
)({ workflowId: S.String }) {}
export class CountOpenWorkflowExecutionsInput extends S.Class<CountOpenWorkflowExecutionsInput>(
  "CountOpenWorkflowExecutionsInput",
)(
  {
    domain: S.String,
    startTimeFilter: ExecutionTimeFilter,
    typeFilter: S.optional(WorkflowTypeFilter),
    tagFilter: S.optional(TagFilter),
    executionFilter: S.optional(WorkflowExecutionFilter),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TaskList extends S.Class<TaskList>("TaskList")({
  name: S.String,
}) {}
export class CountPendingDecisionTasksInput extends S.Class<CountPendingDecisionTasksInput>(
  "CountPendingDecisionTasksInput",
)(
  { domain: S.String, taskList: TaskList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ActivityType extends S.Class<ActivityType>("ActivityType")({
  name: S.String,
  version: S.String,
}) {}
export class DeprecateActivityTypeInput extends S.Class<DeprecateActivityTypeInput>(
  "DeprecateActivityTypeInput",
)(
  { domain: S.String, activityType: ActivityType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeprecateActivityTypeResponse extends S.Class<DeprecateActivityTypeResponse>(
  "DeprecateActivityTypeResponse",
)({}, ns) {}
export class DeprecateDomainInput extends S.Class<DeprecateDomainInput>(
  "DeprecateDomainInput",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeprecateDomainResponse extends S.Class<DeprecateDomainResponse>(
  "DeprecateDomainResponse",
)({}, ns) {}
export class WorkflowType extends S.Class<WorkflowType>("WorkflowType")({
  name: S.String,
  version: S.String,
}) {}
export class DeprecateWorkflowTypeInput extends S.Class<DeprecateWorkflowTypeInput>(
  "DeprecateWorkflowTypeInput",
)(
  { domain: S.String, workflowType: WorkflowType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeprecateWorkflowTypeResponse extends S.Class<DeprecateWorkflowTypeResponse>(
  "DeprecateWorkflowTypeResponse",
)({}, ns) {}
export class DescribeActivityTypeInput extends S.Class<DescribeActivityTypeInput>(
  "DescribeActivityTypeInput",
)(
  { domain: S.String, activityType: ActivityType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDomainInput extends S.Class<DescribeDomainInput>(
  "DescribeDomainInput",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeWorkflowTypeInput extends S.Class<DescribeWorkflowTypeInput>(
  "DescribeWorkflowTypeInput",
)(
  { domain: S.String, workflowType: WorkflowType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class WorkflowExecution extends S.Class<WorkflowExecution>(
  "WorkflowExecution",
)({ workflowId: S.String, runId: S.String }) {}
export class GetWorkflowExecutionHistoryInput extends S.Class<GetWorkflowExecutionHistoryInput>(
  "GetWorkflowExecutionHistoryInput",
)(
  {
    domain: S.String,
    execution: WorkflowExecution,
    nextPageToken: S.optional(S.String),
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListActivityTypesInput extends S.Class<ListActivityTypesInput>(
  "ListActivityTypesInput",
)(
  {
    domain: S.String,
    name: S.optional(S.String),
    registrationStatus: S.String,
    nextPageToken: S.optional(S.String),
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CloseStatusFilter extends S.Class<CloseStatusFilter>(
  "CloseStatusFilter",
)({ status: S.String }) {}
export class ListClosedWorkflowExecutionsInput extends S.Class<ListClosedWorkflowExecutionsInput>(
  "ListClosedWorkflowExecutionsInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDomainsInput extends S.Class<ListDomainsInput>(
  "ListDomainsInput",
)(
  {
    nextPageToken: S.optional(S.String),
    registrationStatus: S.String,
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOpenWorkflowExecutionsInput extends S.Class<ListOpenWorkflowExecutionsInput>(
  "ListOpenWorkflowExecutionsInput",
)(
  {
    domain: S.String,
    startTimeFilter: ExecutionTimeFilter,
    typeFilter: S.optional(WorkflowTypeFilter),
    tagFilter: S.optional(TagFilter),
    nextPageToken: S.optional(S.String),
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
    executionFilter: S.optional(WorkflowExecutionFilter),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { resourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWorkflowTypesInput extends S.Class<ListWorkflowTypesInput>(
  "ListWorkflowTypesInput",
)(
  {
    domain: S.String,
    name: S.optional(S.String),
    registrationStatus: S.String,
    nextPageToken: S.optional(S.String),
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PollForActivityTaskInput extends S.Class<PollForActivityTaskInput>(
  "PollForActivityTaskInput",
)(
  { domain: S.String, taskList: TaskList, identity: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PollForDecisionTaskInput extends S.Class<PollForDecisionTaskInput>(
  "PollForDecisionTaskInput",
)(
  {
    domain: S.String,
    taskList: TaskList,
    identity: S.optional(S.String),
    nextPageToken: S.optional(S.String),
    maximumPageSize: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
    startAtPreviousStartedEvent: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RecordActivityTaskHeartbeatInput extends S.Class<RecordActivityTaskHeartbeatInput>(
  "RecordActivityTaskHeartbeatInput",
)(
  { taskToken: S.String, details: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterActivityTypeInput extends S.Class<RegisterActivityTypeInput>(
  "RegisterActivityTypeInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterActivityTypeResponse extends S.Class<RegisterActivityTypeResponse>(
  "RegisterActivityTypeResponse",
)({}, ns) {}
export class RegisterWorkflowTypeInput extends S.Class<RegisterWorkflowTypeInput>(
  "RegisterWorkflowTypeInput",
)(
  {
    domain: S.String,
    name: S.String,
    version: S.String,
    description: S.optional(S.String),
    defaultTaskStartToCloseTimeout: S.optional(S.String),
    defaultExecutionStartToCloseTimeout: S.optional(S.String),
    defaultTaskList: S.optional(TaskList),
    defaultTaskPriority: S.optional(S.String),
    defaultChildPolicy: S.optional(S.String),
    defaultLambdaRole: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterWorkflowTypeResponse extends S.Class<RegisterWorkflowTypeResponse>(
  "RegisterWorkflowTypeResponse",
)({}, ns) {}
export class RequestCancelWorkflowExecutionInput extends S.Class<RequestCancelWorkflowExecutionInput>(
  "RequestCancelWorkflowExecutionInput",
)(
  { domain: S.String, workflowId: S.String, runId: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RequestCancelWorkflowExecutionResponse extends S.Class<RequestCancelWorkflowExecutionResponse>(
  "RequestCancelWorkflowExecutionResponse",
)({}, ns) {}
export class RespondActivityTaskCanceledInput extends S.Class<RespondActivityTaskCanceledInput>(
  "RespondActivityTaskCanceledInput",
)(
  { taskToken: S.String, details: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RespondActivityTaskCanceledResponse extends S.Class<RespondActivityTaskCanceledResponse>(
  "RespondActivityTaskCanceledResponse",
)({}, ns) {}
export class RespondActivityTaskCompletedInput extends S.Class<RespondActivityTaskCompletedInput>(
  "RespondActivityTaskCompletedInput",
)(
  { taskToken: S.String, result: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RespondActivityTaskCompletedResponse extends S.Class<RespondActivityTaskCompletedResponse>(
  "RespondActivityTaskCompletedResponse",
)({}, ns) {}
export class RespondActivityTaskFailedInput extends S.Class<RespondActivityTaskFailedInput>(
  "RespondActivityTaskFailedInput",
)(
  {
    taskToken: S.String,
    reason: S.optional(S.String),
    details: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RespondActivityTaskFailedResponse extends S.Class<RespondActivityTaskFailedResponse>(
  "RespondActivityTaskFailedResponse",
)({}, ns) {}
export class SignalWorkflowExecutionInput extends S.Class<SignalWorkflowExecutionInput>(
  "SignalWorkflowExecutionInput",
)(
  {
    domain: S.String,
    workflowId: S.String,
    runId: S.optional(S.String),
    signalName: S.String,
    input: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SignalWorkflowExecutionResponse extends S.Class<SignalWorkflowExecutionResponse>(
  "SignalWorkflowExecutionResponse",
)({}, ns) {}
export class StartWorkflowExecutionInput extends S.Class<StartWorkflowExecutionInput>(
  "StartWorkflowExecutionInput",
)(
  {
    domain: S.String,
    workflowId: S.String,
    workflowType: WorkflowType,
    taskList: S.optional(TaskList),
    taskPriority: S.optional(S.String),
    input: S.optional(S.String),
    executionStartToCloseTimeout: S.optional(S.String),
    tagList: S.optional(TagList),
    taskStartToCloseTimeout: S.optional(S.String),
    childPolicy: S.optional(S.String),
    lambdaRole: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  key: S.String,
  value: S.optional(S.String),
}) {}
export const ResourceTagList = S.Array(ResourceTag);
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String, tags: ResourceTagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class TerminateWorkflowExecutionInput extends S.Class<TerminateWorkflowExecutionInput>(
  "TerminateWorkflowExecutionInput",
)(
  {
    domain: S.String,
    workflowId: S.String,
    runId: S.optional(S.String),
    reason: S.optional(S.String),
    details: S.optional(S.String),
    childPolicy: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TerminateWorkflowExecutionResponse extends S.Class<TerminateWorkflowExecutionResponse>(
  "TerminateWorkflowExecutionResponse",
)({}, ns) {}
export class UndeprecateActivityTypeInput extends S.Class<UndeprecateActivityTypeInput>(
  "UndeprecateActivityTypeInput",
)(
  { domain: S.String, activityType: ActivityType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UndeprecateActivityTypeResponse extends S.Class<UndeprecateActivityTypeResponse>(
  "UndeprecateActivityTypeResponse",
)({}, ns) {}
export class UndeprecateDomainInput extends S.Class<UndeprecateDomainInput>(
  "UndeprecateDomainInput",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UndeprecateDomainResponse extends S.Class<UndeprecateDomainResponse>(
  "UndeprecateDomainResponse",
)({}, ns) {}
export class UndeprecateWorkflowTypeInput extends S.Class<UndeprecateWorkflowTypeInput>(
  "UndeprecateWorkflowTypeInput",
)(
  { domain: S.String, workflowType: WorkflowType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UndeprecateWorkflowTypeResponse extends S.Class<UndeprecateWorkflowTypeResponse>(
  "UndeprecateWorkflowTypeResponse",
)({}, ns) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { resourceArn: S.String, tagKeys: ResourceTagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class ActivityTypeInfo extends S.Class<ActivityTypeInfo>(
  "ActivityTypeInfo",
)({
  activityType: ActivityType,
  status: S.String,
  description: S.optional(S.String),
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  deprecationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ActivityTypeInfoList = S.Array(ActivityTypeInfo);
export class DomainInfo extends S.Class<DomainInfo>("DomainInfo")({
  name: S.String,
  status: S.String,
  description: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const DomainInfoList = S.Array(DomainInfo);
export class WorkflowTypeInfo extends S.Class<WorkflowTypeInfo>(
  "WorkflowTypeInfo",
)({
  workflowType: WorkflowType,
  status: S.String,
  description: S.optional(S.String),
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  deprecationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const WorkflowTypeInfoList = S.Array(WorkflowTypeInfo);
export class CountClosedWorkflowExecutionsInput extends S.Class<CountClosedWorkflowExecutionsInput>(
  "CountClosedWorkflowExecutionsInput",
)(
  {
    domain: S.String,
    startTimeFilter: S.optional(ExecutionTimeFilter),
    closeTimeFilter: S.optional(ExecutionTimeFilter),
    executionFilter: S.optional(WorkflowExecutionFilter),
    typeFilter: S.optional(WorkflowTypeFilter),
    tagFilter: S.optional(TagFilter),
    closeStatusFilter: S.optional(CloseStatusFilter),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class WorkflowExecutionCount extends S.Class<WorkflowExecutionCount>(
  "WorkflowExecutionCount",
)({ count: S.Number, truncated: S.optional(S.Boolean) }, ns) {}
export class CountPendingActivityTasksInput extends S.Class<CountPendingActivityTasksInput>(
  "CountPendingActivityTasksInput",
)(
  { domain: S.String, taskList: TaskList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PendingTaskCount extends S.Class<PendingTaskCount>(
  "PendingTaskCount",
)({ count: S.Number, truncated: S.optional(S.Boolean) }, ns) {}
export class DeleteActivityTypeInput extends S.Class<DeleteActivityTypeInput>(
  "DeleteActivityTypeInput",
)(
  { domain: S.String, activityType: ActivityType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteActivityTypeResponse extends S.Class<DeleteActivityTypeResponse>(
  "DeleteActivityTypeResponse",
)({}, ns) {}
export class DeleteWorkflowTypeInput extends S.Class<DeleteWorkflowTypeInput>(
  "DeleteWorkflowTypeInput",
)(
  { domain: S.String, workflowType: WorkflowType },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWorkflowTypeResponse extends S.Class<DeleteWorkflowTypeResponse>(
  "DeleteWorkflowTypeResponse",
)({}, ns) {}
export class DescribeWorkflowExecutionInput extends S.Class<DescribeWorkflowExecutionInput>(
  "DescribeWorkflowExecutionInput",
)(
  { domain: S.String, execution: WorkflowExecution },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ActivityTypeInfos extends S.Class<ActivityTypeInfos>(
  "ActivityTypeInfos",
)(
  { typeInfos: ActivityTypeInfoList, nextPageToken: S.optional(S.String) },
  ns,
) {}
export class DomainInfos extends S.Class<DomainInfos>("DomainInfos")(
  { domainInfos: DomainInfoList, nextPageToken: S.optional(S.String) },
  ns,
) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: S.optional(ResourceTagList) }, ns) {}
export class WorkflowTypeInfos extends S.Class<WorkflowTypeInfos>(
  "WorkflowTypeInfos",
)(
  { typeInfos: WorkflowTypeInfoList, nextPageToken: S.optional(S.String) },
  ns,
) {}
export class ActivityTask extends S.Class<ActivityTask>("ActivityTask")(
  {
    taskToken: S.String,
    activityId: S.String,
    startedEventId: S.Number,
    workflowExecution: WorkflowExecution,
    activityType: ActivityType,
    input: S.optional(S.String),
  },
  ns,
) {}
export class WorkflowExecutionStartedEventAttributes extends S.Class<WorkflowExecutionStartedEventAttributes>(
  "WorkflowExecutionStartedEventAttributes",
)({
  input: S.optional(S.String),
  executionStartToCloseTimeout: S.optional(S.String),
  taskStartToCloseTimeout: S.optional(S.String),
  childPolicy: S.String,
  taskList: TaskList,
  taskPriority: S.optional(S.String),
  workflowType: WorkflowType,
  tagList: S.optional(TagList),
  continuedExecutionRunId: S.optional(S.String),
  parentWorkflowExecution: S.optional(WorkflowExecution),
  parentInitiatedEventId: S.optional(S.Number),
  lambdaRole: S.optional(S.String),
}) {}
export class WorkflowExecutionCompletedEventAttributes extends S.Class<WorkflowExecutionCompletedEventAttributes>(
  "WorkflowExecutionCompletedEventAttributes",
)({ result: S.optional(S.String), decisionTaskCompletedEventId: S.Number }) {}
export class CompleteWorkflowExecutionFailedEventAttributes extends S.Class<CompleteWorkflowExecutionFailedEventAttributes>(
  "CompleteWorkflowExecutionFailedEventAttributes",
)({ cause: S.String, decisionTaskCompletedEventId: S.Number }) {}
export class WorkflowExecutionFailedEventAttributes extends S.Class<WorkflowExecutionFailedEventAttributes>(
  "WorkflowExecutionFailedEventAttributes",
)({
  reason: S.optional(S.String),
  details: S.optional(S.String),
  decisionTaskCompletedEventId: S.Number,
}) {}
export class FailWorkflowExecutionFailedEventAttributes extends S.Class<FailWorkflowExecutionFailedEventAttributes>(
  "FailWorkflowExecutionFailedEventAttributes",
)({ cause: S.String, decisionTaskCompletedEventId: S.Number }) {}
export class WorkflowExecutionTimedOutEventAttributes extends S.Class<WorkflowExecutionTimedOutEventAttributes>(
  "WorkflowExecutionTimedOutEventAttributes",
)({ timeoutType: S.String, childPolicy: S.String }) {}
export class WorkflowExecutionCanceledEventAttributes extends S.Class<WorkflowExecutionCanceledEventAttributes>(
  "WorkflowExecutionCanceledEventAttributes",
)({ details: S.optional(S.String), decisionTaskCompletedEventId: S.Number }) {}
export class CancelWorkflowExecutionFailedEventAttributes extends S.Class<CancelWorkflowExecutionFailedEventAttributes>(
  "CancelWorkflowExecutionFailedEventAttributes",
)({ cause: S.String, decisionTaskCompletedEventId: S.Number }) {}
export class WorkflowExecutionContinuedAsNewEventAttributes extends S.Class<WorkflowExecutionContinuedAsNewEventAttributes>(
  "WorkflowExecutionContinuedAsNewEventAttributes",
)({
  input: S.optional(S.String),
  decisionTaskCompletedEventId: S.Number,
  newExecutionRunId: S.String,
  executionStartToCloseTimeout: S.optional(S.String),
  taskList: TaskList,
  taskPriority: S.optional(S.String),
  taskStartToCloseTimeout: S.optional(S.String),
  childPolicy: S.String,
  tagList: S.optional(TagList),
  workflowType: WorkflowType,
  lambdaRole: S.optional(S.String),
}) {}
export class ContinueAsNewWorkflowExecutionFailedEventAttributes extends S.Class<ContinueAsNewWorkflowExecutionFailedEventAttributes>(
  "ContinueAsNewWorkflowExecutionFailedEventAttributes",
)({ cause: S.String, decisionTaskCompletedEventId: S.Number }) {}
export class WorkflowExecutionTerminatedEventAttributes extends S.Class<WorkflowExecutionTerminatedEventAttributes>(
  "WorkflowExecutionTerminatedEventAttributes",
)({
  reason: S.optional(S.String),
  details: S.optional(S.String),
  childPolicy: S.String,
  cause: S.optional(S.String),
}) {}
export class WorkflowExecutionCancelRequestedEventAttributes extends S.Class<WorkflowExecutionCancelRequestedEventAttributes>(
  "WorkflowExecutionCancelRequestedEventAttributes",
)({
  externalWorkflowExecution: S.optional(WorkflowExecution),
  externalInitiatedEventId: S.optional(S.Number),
  cause: S.optional(S.String),
}) {}
export class DecisionTaskScheduledEventAttributes extends S.Class<DecisionTaskScheduledEventAttributes>(
  "DecisionTaskScheduledEventAttributes",
)({
  taskList: TaskList,
  taskPriority: S.optional(S.String),
  startToCloseTimeout: S.optional(S.String),
  scheduleToStartTimeout: S.optional(S.String),
}) {}
export class DecisionTaskStartedEventAttributes extends S.Class<DecisionTaskStartedEventAttributes>(
  "DecisionTaskStartedEventAttributes",
)({ identity: S.optional(S.String), scheduledEventId: S.Number }) {}
export class DecisionTaskCompletedEventAttributes extends S.Class<DecisionTaskCompletedEventAttributes>(
  "DecisionTaskCompletedEventAttributes",
)({
  executionContext: S.optional(S.String),
  scheduledEventId: S.Number,
  startedEventId: S.Number,
  taskList: S.optional(TaskList),
  taskListScheduleToStartTimeout: S.optional(S.String),
}) {}
export class DecisionTaskTimedOutEventAttributes extends S.Class<DecisionTaskTimedOutEventAttributes>(
  "DecisionTaskTimedOutEventAttributes",
)({
  timeoutType: S.String,
  scheduledEventId: S.Number,
  startedEventId: S.Number,
}) {}
export class ActivityTaskScheduledEventAttributes extends S.Class<ActivityTaskScheduledEventAttributes>(
  "ActivityTaskScheduledEventAttributes",
)({
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
}) {}
export class ActivityTaskStartedEventAttributes extends S.Class<ActivityTaskStartedEventAttributes>(
  "ActivityTaskStartedEventAttributes",
)({ identity: S.optional(S.String), scheduledEventId: S.Number }) {}
export class ActivityTaskCompletedEventAttributes extends S.Class<ActivityTaskCompletedEventAttributes>(
  "ActivityTaskCompletedEventAttributes",
)({
  result: S.optional(S.String),
  scheduledEventId: S.Number,
  startedEventId: S.Number,
}) {}
export class ActivityTaskFailedEventAttributes extends S.Class<ActivityTaskFailedEventAttributes>(
  "ActivityTaskFailedEventAttributes",
)({
  reason: S.optional(S.String),
  details: S.optional(S.String),
  scheduledEventId: S.Number,
  startedEventId: S.Number,
}) {}
export class ActivityTaskTimedOutEventAttributes extends S.Class<ActivityTaskTimedOutEventAttributes>(
  "ActivityTaskTimedOutEventAttributes",
)({
  timeoutType: S.String,
  scheduledEventId: S.Number,
  startedEventId: S.Number,
  details: S.optional(S.String),
}) {}
export class ActivityTaskCanceledEventAttributes extends S.Class<ActivityTaskCanceledEventAttributes>(
  "ActivityTaskCanceledEventAttributes",
)({
  details: S.optional(S.String),
  scheduledEventId: S.Number,
  startedEventId: S.Number,
  latestCancelRequestedEventId: S.optional(S.Number),
}) {}
export class ActivityTaskCancelRequestedEventAttributes extends S.Class<ActivityTaskCancelRequestedEventAttributes>(
  "ActivityTaskCancelRequestedEventAttributes",
)({ decisionTaskCompletedEventId: S.Number, activityId: S.String }) {}
export class WorkflowExecutionSignaledEventAttributes extends S.Class<WorkflowExecutionSignaledEventAttributes>(
  "WorkflowExecutionSignaledEventAttributes",
)({
  signalName: S.String,
  input: S.optional(S.String),
  externalWorkflowExecution: S.optional(WorkflowExecution),
  externalInitiatedEventId: S.optional(S.Number),
}) {}
export class MarkerRecordedEventAttributes extends S.Class<MarkerRecordedEventAttributes>(
  "MarkerRecordedEventAttributes",
)({
  markerName: S.String,
  details: S.optional(S.String),
  decisionTaskCompletedEventId: S.Number,
}) {}
export class RecordMarkerFailedEventAttributes extends S.Class<RecordMarkerFailedEventAttributes>(
  "RecordMarkerFailedEventAttributes",
)({
  markerName: S.String,
  cause: S.String,
  decisionTaskCompletedEventId: S.Number,
}) {}
export class TimerStartedEventAttributes extends S.Class<TimerStartedEventAttributes>(
  "TimerStartedEventAttributes",
)({
  timerId: S.String,
  control: S.optional(S.String),
  startToFireTimeout: S.String,
  decisionTaskCompletedEventId: S.Number,
}) {}
export class TimerFiredEventAttributes extends S.Class<TimerFiredEventAttributes>(
  "TimerFiredEventAttributes",
)({ timerId: S.String, startedEventId: S.Number }) {}
export class TimerCanceledEventAttributes extends S.Class<TimerCanceledEventAttributes>(
  "TimerCanceledEventAttributes",
)({
  timerId: S.String,
  startedEventId: S.Number,
  decisionTaskCompletedEventId: S.Number,
}) {}
export class StartChildWorkflowExecutionInitiatedEventAttributes extends S.Class<StartChildWorkflowExecutionInitiatedEventAttributes>(
  "StartChildWorkflowExecutionInitiatedEventAttributes",
)({
  workflowId: S.String,
  workflowType: WorkflowType,
  control: S.optional(S.String),
  input: S.optional(S.String),
  executionStartToCloseTimeout: S.optional(S.String),
  taskList: TaskList,
  taskPriority: S.optional(S.String),
  decisionTaskCompletedEventId: S.Number,
  childPolicy: S.String,
  taskStartToCloseTimeout: S.optional(S.String),
  tagList: S.optional(TagList),
  lambdaRole: S.optional(S.String),
}) {}
export class ChildWorkflowExecutionStartedEventAttributes extends S.Class<ChildWorkflowExecutionStartedEventAttributes>(
  "ChildWorkflowExecutionStartedEventAttributes",
)({
  workflowExecution: WorkflowExecution,
  workflowType: WorkflowType,
  initiatedEventId: S.Number,
}) {}
export class ChildWorkflowExecutionCompletedEventAttributes extends S.Class<ChildWorkflowExecutionCompletedEventAttributes>(
  "ChildWorkflowExecutionCompletedEventAttributes",
)({
  workflowExecution: WorkflowExecution,
  workflowType: WorkflowType,
  result: S.optional(S.String),
  initiatedEventId: S.Number,
  startedEventId: S.Number,
}) {}
export class ChildWorkflowExecutionFailedEventAttributes extends S.Class<ChildWorkflowExecutionFailedEventAttributes>(
  "ChildWorkflowExecutionFailedEventAttributes",
)({
  workflowExecution: WorkflowExecution,
  workflowType: WorkflowType,
  reason: S.optional(S.String),
  details: S.optional(S.String),
  initiatedEventId: S.Number,
  startedEventId: S.Number,
}) {}
export class ChildWorkflowExecutionTimedOutEventAttributes extends S.Class<ChildWorkflowExecutionTimedOutEventAttributes>(
  "ChildWorkflowExecutionTimedOutEventAttributes",
)({
  workflowExecution: WorkflowExecution,
  workflowType: WorkflowType,
  timeoutType: S.String,
  initiatedEventId: S.Number,
  startedEventId: S.Number,
}) {}
export class ChildWorkflowExecutionCanceledEventAttributes extends S.Class<ChildWorkflowExecutionCanceledEventAttributes>(
  "ChildWorkflowExecutionCanceledEventAttributes",
)({
  workflowExecution: WorkflowExecution,
  workflowType: WorkflowType,
  details: S.optional(S.String),
  initiatedEventId: S.Number,
  startedEventId: S.Number,
}) {}
export class ChildWorkflowExecutionTerminatedEventAttributes extends S.Class<ChildWorkflowExecutionTerminatedEventAttributes>(
  "ChildWorkflowExecutionTerminatedEventAttributes",
)({
  workflowExecution: WorkflowExecution,
  workflowType: WorkflowType,
  initiatedEventId: S.Number,
  startedEventId: S.Number,
}) {}
export class SignalExternalWorkflowExecutionInitiatedEventAttributes extends S.Class<SignalExternalWorkflowExecutionInitiatedEventAttributes>(
  "SignalExternalWorkflowExecutionInitiatedEventAttributes",
)({
  workflowId: S.String,
  runId: S.optional(S.String),
  signalName: S.String,
  input: S.optional(S.String),
  decisionTaskCompletedEventId: S.Number,
  control: S.optional(S.String),
}) {}
export class ExternalWorkflowExecutionSignaledEventAttributes extends S.Class<ExternalWorkflowExecutionSignaledEventAttributes>(
  "ExternalWorkflowExecutionSignaledEventAttributes",
)({ workflowExecution: WorkflowExecution, initiatedEventId: S.Number }) {}
export class SignalExternalWorkflowExecutionFailedEventAttributes extends S.Class<SignalExternalWorkflowExecutionFailedEventAttributes>(
  "SignalExternalWorkflowExecutionFailedEventAttributes",
)({
  workflowId: S.String,
  runId: S.optional(S.String),
  cause: S.String,
  initiatedEventId: S.Number,
  decisionTaskCompletedEventId: S.Number,
  control: S.optional(S.String),
}) {}
export class ExternalWorkflowExecutionCancelRequestedEventAttributes extends S.Class<ExternalWorkflowExecutionCancelRequestedEventAttributes>(
  "ExternalWorkflowExecutionCancelRequestedEventAttributes",
)({ workflowExecution: WorkflowExecution, initiatedEventId: S.Number }) {}
export class RequestCancelExternalWorkflowExecutionInitiatedEventAttributes extends S.Class<RequestCancelExternalWorkflowExecutionInitiatedEventAttributes>(
  "RequestCancelExternalWorkflowExecutionInitiatedEventAttributes",
)({
  workflowId: S.String,
  runId: S.optional(S.String),
  decisionTaskCompletedEventId: S.Number,
  control: S.optional(S.String),
}) {}
export class RequestCancelExternalWorkflowExecutionFailedEventAttributes extends S.Class<RequestCancelExternalWorkflowExecutionFailedEventAttributes>(
  "RequestCancelExternalWorkflowExecutionFailedEventAttributes",
)({
  workflowId: S.String,
  runId: S.optional(S.String),
  cause: S.String,
  initiatedEventId: S.Number,
  decisionTaskCompletedEventId: S.Number,
  control: S.optional(S.String),
}) {}
export class ScheduleActivityTaskFailedEventAttributes extends S.Class<ScheduleActivityTaskFailedEventAttributes>(
  "ScheduleActivityTaskFailedEventAttributes",
)({
  activityType: ActivityType,
  activityId: S.String,
  cause: S.String,
  decisionTaskCompletedEventId: S.Number,
}) {}
export class RequestCancelActivityTaskFailedEventAttributes extends S.Class<RequestCancelActivityTaskFailedEventAttributes>(
  "RequestCancelActivityTaskFailedEventAttributes",
)({
  activityId: S.String,
  cause: S.String,
  decisionTaskCompletedEventId: S.Number,
}) {}
export class StartTimerFailedEventAttributes extends S.Class<StartTimerFailedEventAttributes>(
  "StartTimerFailedEventAttributes",
)({
  timerId: S.String,
  cause: S.String,
  decisionTaskCompletedEventId: S.Number,
}) {}
export class CancelTimerFailedEventAttributes extends S.Class<CancelTimerFailedEventAttributes>(
  "CancelTimerFailedEventAttributes",
)({
  timerId: S.String,
  cause: S.String,
  decisionTaskCompletedEventId: S.Number,
}) {}
export class StartChildWorkflowExecutionFailedEventAttributes extends S.Class<StartChildWorkflowExecutionFailedEventAttributes>(
  "StartChildWorkflowExecutionFailedEventAttributes",
)({
  workflowType: WorkflowType,
  cause: S.String,
  workflowId: S.String,
  initiatedEventId: S.Number,
  decisionTaskCompletedEventId: S.Number,
  control: S.optional(S.String),
}) {}
export class LambdaFunctionScheduledEventAttributes extends S.Class<LambdaFunctionScheduledEventAttributes>(
  "LambdaFunctionScheduledEventAttributes",
)({
  id: S.String,
  name: S.String,
  control: S.optional(S.String),
  input: S.optional(S.String),
  startToCloseTimeout: S.optional(S.String),
  decisionTaskCompletedEventId: S.Number,
}) {}
export class LambdaFunctionStartedEventAttributes extends S.Class<LambdaFunctionStartedEventAttributes>(
  "LambdaFunctionStartedEventAttributes",
)({ scheduledEventId: S.Number }) {}
export class LambdaFunctionCompletedEventAttributes extends S.Class<LambdaFunctionCompletedEventAttributes>(
  "LambdaFunctionCompletedEventAttributes",
)({
  scheduledEventId: S.Number,
  startedEventId: S.Number,
  result: S.optional(S.String),
}) {}
export class LambdaFunctionFailedEventAttributes extends S.Class<LambdaFunctionFailedEventAttributes>(
  "LambdaFunctionFailedEventAttributes",
)({
  scheduledEventId: S.Number,
  startedEventId: S.Number,
  reason: S.optional(S.String),
  details: S.optional(S.String),
}) {}
export class LambdaFunctionTimedOutEventAttributes extends S.Class<LambdaFunctionTimedOutEventAttributes>(
  "LambdaFunctionTimedOutEventAttributes",
)({
  scheduledEventId: S.Number,
  startedEventId: S.Number,
  timeoutType: S.optional(S.String),
}) {}
export class ScheduleLambdaFunctionFailedEventAttributes extends S.Class<ScheduleLambdaFunctionFailedEventAttributes>(
  "ScheduleLambdaFunctionFailedEventAttributes",
)({
  id: S.String,
  name: S.String,
  cause: S.String,
  decisionTaskCompletedEventId: S.Number,
}) {}
export class StartLambdaFunctionFailedEventAttributes extends S.Class<StartLambdaFunctionFailedEventAttributes>(
  "StartLambdaFunctionFailedEventAttributes",
)({
  scheduledEventId: S.optional(S.Number),
  cause: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export class HistoryEvent extends S.Class<HistoryEvent>("HistoryEvent")({
  eventTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  eventType: S.String,
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
  startTimerFailedEventAttributes: S.optional(StartTimerFailedEventAttributes),
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
}) {}
export const HistoryEventList = S.Array(HistoryEvent);
export class DecisionTask extends S.Class<DecisionTask>("DecisionTask")(
  {
    taskToken: S.String,
    startedEventId: S.Number,
    workflowExecution: WorkflowExecution,
    workflowType: WorkflowType,
    events: HistoryEventList,
    nextPageToken: S.optional(S.String),
    previousStartedEventId: S.optional(S.Number),
  },
  ns,
) {}
export class ActivityTaskStatus extends S.Class<ActivityTaskStatus>(
  "ActivityTaskStatus",
)({ cancelRequested: S.Boolean }, ns) {}
export class RegisterDomainInput extends S.Class<RegisterDomainInput>(
  "RegisterDomainInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    workflowExecutionRetentionPeriodInDays: S.String,
    tags: S.optional(ResourceTagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterDomainResponse extends S.Class<RegisterDomainResponse>(
  "RegisterDomainResponse",
)({}, ns) {}
export class Run extends S.Class<Run>("Run")(
  { runId: S.optional(S.String) },
  ns,
) {}
export class ScheduleActivityTaskDecisionAttributes extends S.Class<ScheduleActivityTaskDecisionAttributes>(
  "ScheduleActivityTaskDecisionAttributes",
)({
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
}) {}
export class RequestCancelActivityTaskDecisionAttributes extends S.Class<RequestCancelActivityTaskDecisionAttributes>(
  "RequestCancelActivityTaskDecisionAttributes",
)({ activityId: S.String }) {}
export class CompleteWorkflowExecutionDecisionAttributes extends S.Class<CompleteWorkflowExecutionDecisionAttributes>(
  "CompleteWorkflowExecutionDecisionAttributes",
)({ result: S.optional(S.String) }) {}
export class FailWorkflowExecutionDecisionAttributes extends S.Class<FailWorkflowExecutionDecisionAttributes>(
  "FailWorkflowExecutionDecisionAttributes",
)({ reason: S.optional(S.String), details: S.optional(S.String) }) {}
export class CancelWorkflowExecutionDecisionAttributes extends S.Class<CancelWorkflowExecutionDecisionAttributes>(
  "CancelWorkflowExecutionDecisionAttributes",
)({ details: S.optional(S.String) }) {}
export class ContinueAsNewWorkflowExecutionDecisionAttributes extends S.Class<ContinueAsNewWorkflowExecutionDecisionAttributes>(
  "ContinueAsNewWorkflowExecutionDecisionAttributes",
)({
  input: S.optional(S.String),
  executionStartToCloseTimeout: S.optional(S.String),
  taskList: S.optional(TaskList),
  taskPriority: S.optional(S.String),
  taskStartToCloseTimeout: S.optional(S.String),
  childPolicy: S.optional(S.String),
  tagList: S.optional(TagList),
  workflowTypeVersion: S.optional(S.String),
  lambdaRole: S.optional(S.String),
}) {}
export class RecordMarkerDecisionAttributes extends S.Class<RecordMarkerDecisionAttributes>(
  "RecordMarkerDecisionAttributes",
)({ markerName: S.String, details: S.optional(S.String) }) {}
export class StartTimerDecisionAttributes extends S.Class<StartTimerDecisionAttributes>(
  "StartTimerDecisionAttributes",
)({
  timerId: S.String,
  control: S.optional(S.String),
  startToFireTimeout: S.String,
}) {}
export class CancelTimerDecisionAttributes extends S.Class<CancelTimerDecisionAttributes>(
  "CancelTimerDecisionAttributes",
)({ timerId: S.String }) {}
export class SignalExternalWorkflowExecutionDecisionAttributes extends S.Class<SignalExternalWorkflowExecutionDecisionAttributes>(
  "SignalExternalWorkflowExecutionDecisionAttributes",
)({
  workflowId: S.String,
  runId: S.optional(S.String),
  signalName: S.String,
  input: S.optional(S.String),
  control: S.optional(S.String),
}) {}
export class RequestCancelExternalWorkflowExecutionDecisionAttributes extends S.Class<RequestCancelExternalWorkflowExecutionDecisionAttributes>(
  "RequestCancelExternalWorkflowExecutionDecisionAttributes",
)({
  workflowId: S.String,
  runId: S.optional(S.String),
  control: S.optional(S.String),
}) {}
export class StartChildWorkflowExecutionDecisionAttributes extends S.Class<StartChildWorkflowExecutionDecisionAttributes>(
  "StartChildWorkflowExecutionDecisionAttributes",
)({
  workflowType: WorkflowType,
  workflowId: S.String,
  control: S.optional(S.String),
  input: S.optional(S.String),
  executionStartToCloseTimeout: S.optional(S.String),
  taskList: S.optional(TaskList),
  taskPriority: S.optional(S.String),
  taskStartToCloseTimeout: S.optional(S.String),
  childPolicy: S.optional(S.String),
  tagList: S.optional(TagList),
  lambdaRole: S.optional(S.String),
}) {}
export class ScheduleLambdaFunctionDecisionAttributes extends S.Class<ScheduleLambdaFunctionDecisionAttributes>(
  "ScheduleLambdaFunctionDecisionAttributes",
)({
  id: S.String,
  name: S.String,
  control: S.optional(S.String),
  input: S.optional(S.String),
  startToCloseTimeout: S.optional(S.String),
}) {}
export class ActivityTypeConfiguration extends S.Class<ActivityTypeConfiguration>(
  "ActivityTypeConfiguration",
)({
  defaultTaskStartToCloseTimeout: S.optional(S.String),
  defaultTaskHeartbeatTimeout: S.optional(S.String),
  defaultTaskList: S.optional(TaskList),
  defaultTaskPriority: S.optional(S.String),
  defaultTaskScheduleToStartTimeout: S.optional(S.String),
  defaultTaskScheduleToCloseTimeout: S.optional(S.String),
}) {}
export class DomainConfiguration extends S.Class<DomainConfiguration>(
  "DomainConfiguration",
)({ workflowExecutionRetentionPeriodInDays: S.String }) {}
export class WorkflowTypeConfiguration extends S.Class<WorkflowTypeConfiguration>(
  "WorkflowTypeConfiguration",
)({
  defaultTaskStartToCloseTimeout: S.optional(S.String),
  defaultExecutionStartToCloseTimeout: S.optional(S.String),
  defaultTaskList: S.optional(TaskList),
  defaultTaskPriority: S.optional(S.String),
  defaultChildPolicy: S.optional(S.String),
  defaultLambdaRole: S.optional(S.String),
}) {}
export class WorkflowExecutionInfo extends S.Class<WorkflowExecutionInfo>(
  "WorkflowExecutionInfo",
)({
  execution: WorkflowExecution,
  workflowType: WorkflowType,
  startTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  closeTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  executionStatus: S.String,
  closeStatus: S.optional(S.String),
  parent: S.optional(WorkflowExecution),
  tagList: S.optional(TagList),
  cancelRequested: S.optional(S.Boolean),
}) {}
export const WorkflowExecutionInfoList = S.Array(WorkflowExecutionInfo);
export class Decision extends S.Class<Decision>("Decision")({
  decisionType: S.String,
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
}) {}
export const DecisionList = S.Array(Decision);
export class ActivityTypeDetail extends S.Class<ActivityTypeDetail>(
  "ActivityTypeDetail",
)(
  { typeInfo: ActivityTypeInfo, configuration: ActivityTypeConfiguration },
  ns,
) {}
export class DomainDetail extends S.Class<DomainDetail>("DomainDetail")(
  { domainInfo: DomainInfo, configuration: DomainConfiguration },
  ns,
) {}
export class WorkflowTypeDetail extends S.Class<WorkflowTypeDetail>(
  "WorkflowTypeDetail",
)(
  { typeInfo: WorkflowTypeInfo, configuration: WorkflowTypeConfiguration },
  ns,
) {}
export class WorkflowExecutionInfos extends S.Class<WorkflowExecutionInfos>(
  "WorkflowExecutionInfos",
)(
  {
    executionInfos: WorkflowExecutionInfoList,
    nextPageToken: S.optional(S.String),
  },
  ns,
) {}
export class RespondDecisionTaskCompletedInput extends S.Class<RespondDecisionTaskCompletedInput>(
  "RespondDecisionTaskCompletedInput",
)(
  {
    taskToken: S.String,
    decisions: S.optional(DecisionList),
    executionContext: S.optional(S.String),
    taskList: S.optional(TaskList),
    taskListScheduleToStartTimeout: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RespondDecisionTaskCompletedResponse extends S.Class<RespondDecisionTaskCompletedResponse>(
  "RespondDecisionTaskCompletedResponse",
)({}, ns) {}
export class WorkflowExecutionConfiguration extends S.Class<WorkflowExecutionConfiguration>(
  "WorkflowExecutionConfiguration",
)({
  taskStartToCloseTimeout: S.String,
  executionStartToCloseTimeout: S.String,
  taskList: TaskList,
  taskPriority: S.optional(S.String),
  childPolicy: S.String,
  lambdaRole: S.optional(S.String),
}) {}
export class WorkflowExecutionOpenCounts extends S.Class<WorkflowExecutionOpenCounts>(
  "WorkflowExecutionOpenCounts",
)({
  openActivityTasks: S.Number,
  openDecisionTasks: S.Number,
  openTimers: S.Number,
  openChildWorkflowExecutions: S.Number,
  openLambdaFunctions: S.optional(S.Number),
}) {}
export class WorkflowExecutionDetail extends S.Class<WorkflowExecutionDetail>(
  "WorkflowExecutionDetail",
)(
  {
    executionInfo: WorkflowExecutionInfo,
    executionConfiguration: WorkflowExecutionConfiguration,
    openCounts: WorkflowExecutionOpenCounts,
    latestActivityTaskTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    latestExecutionContext: S.optional(S.String),
  },
  ns,
) {}
export class History extends S.Class<History>("History")(
  { events: HistoryEventList, nextPageToken: S.optional(S.String) },
  ns,
) {}

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
) {}
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
export const listDomains = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDomainsInput,
    output: DomainInfos,
    errors: [OperationNotPermittedFault],
    pagination: {
      inputToken: "nextPageToken",
      outputToken: "nextPageToken",
      items: "domainInfos",
      pageSize: "maximumPageSize",
    } as const,
  }),
);
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
export const deprecateDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeActivityType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeActivityTypeInput,
    output: ActivityTypeDetail,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
  }),
);
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
export const describeDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeWorkflowType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeWorkflowTypeInput,
    output: WorkflowTypeDetail,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
  }),
);
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
export const listClosedWorkflowExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const registerActivityType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterActivityTypeInput,
    output: RegisterActivityTypeResponse,
    errors: [
      LimitExceededFault,
      OperationNotPermittedFault,
      TypeAlreadyExistsFault,
      UnknownResourceFault,
    ],
  }),
);
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
export const respondDecisionTaskCompleted =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteActivityType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deprecateWorkflowType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeprecateWorkflowTypeInput,
    output: DeprecateWorkflowTypeResponse,
    errors: [
      OperationNotPermittedFault,
      TypeDeprecatedFault,
      UnknownResourceFault,
    ],
  }),
);
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
export const listActivityTypes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListActivityTypesInput,
    output: ActivityTypeInfos,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
    pagination: {
      inputToken: "nextPageToken",
      outputToken: "nextPageToken",
      items: "typeInfos",
      pageSize: "maximumPageSize",
    } as const,
  }),
);
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
export const listWorkflowTypes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkflowTypesInput,
    output: WorkflowTypeInfos,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
    pagination: {
      inputToken: "nextPageToken",
      outputToken: "nextPageToken",
      items: "typeInfos",
      pageSize: "maximumPageSize",
    } as const,
  }),
);
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
export const recordActivityTaskHeartbeat = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RecordActivityTaskHeartbeatInput,
    output: ActivityTaskStatus,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
  }),
);
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
export const undeprecateDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listOpenWorkflowExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const requestCancelWorkflowExecution =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const respondActivityTaskCanceled = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RespondActivityTaskCanceledInput,
    output: RespondActivityTaskCanceledResponse,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
  }),
);
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
export const respondActivityTaskCompleted =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const respondActivityTaskFailed = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RespondActivityTaskFailedInput,
    output: RespondActivityTaskFailedResponse,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
  }),
);
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
export const signalWorkflowExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SignalWorkflowExecutionInput,
    output: SignalWorkflowExecutionResponse,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
  }),
);
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
export const terminateWorkflowExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TerminateWorkflowExecutionInput,
    output: TerminateWorkflowExecutionResponse,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
  }),
);
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
export const countClosedWorkflowExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const countOpenWorkflowExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CountOpenWorkflowExecutionsInput,
    output: WorkflowExecutionCount,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
  }),
);
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
export const countPendingActivityTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CountPendingActivityTasksInput,
    output: PendingTaskCount,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
  }),
);
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
export const countPendingDecisionTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CountPendingDecisionTasksInput,
    output: PendingTaskCount,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
  }),
);
/**
 * Remove a tag from a Amazon SWF domain.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const pollForActivityTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const pollForDecisionTask =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deprecateActivityType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeprecateActivityTypeInput,
    output: DeprecateActivityTypeResponse,
    errors: [
      OperationNotPermittedFault,
      TypeDeprecatedFault,
      UnknownResourceFault,
    ],
  }),
);
/**
 * Add a tag to a Amazon SWF domain.
 *
 * Amazon SWF supports a maximum of 50 tags per resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const undeprecateActivityType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UndeprecateActivityTypeInput,
    output: UndeprecateActivityTypeResponse,
    errors: [
      OperationNotPermittedFault,
      TypeAlreadyExistsFault,
      UnknownResourceFault,
    ],
  }),
);
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
export const undeprecateWorkflowType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UndeprecateWorkflowTypeInput,
    output: UndeprecateWorkflowTypeResponse,
    errors: [
      OperationNotPermittedFault,
      TypeAlreadyExistsFault,
      UnknownResourceFault,
    ],
  }),
);
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
export const registerWorkflowType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterWorkflowTypeInput,
    output: RegisterWorkflowTypeResponse,
    errors: [
      LimitExceededFault,
      OperationNotPermittedFault,
      TypeAlreadyExistsFault,
      UnknownResourceFault,
    ],
  }),
);
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
export const deleteWorkflowType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const registerDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeWorkflowExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeWorkflowExecutionInput,
    output: WorkflowExecutionDetail,
    errors: [OperationNotPermittedFault, UnknownResourceFault],
  }),
);
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
export const getWorkflowExecutionHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startWorkflowExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
