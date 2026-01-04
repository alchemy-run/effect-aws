import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://swf.amazonaws.com/doc/2015-07-20/");
const svc = T.AwsApiService({
  sdkId: "SFN",
  serviceShapeName: "AWSStepFunctions",
});
const auth = T.AwsAuthSigv4({ name: "states" });
const ver = T.ServiceVersion("2016-11-23");
const proto = T.AwsProtocolsAwsJson1_0();
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
                        url: "https://states-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://states.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://states-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://states.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://states.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class DeleteActivityInput extends S.Class<DeleteActivityInput>(
  "DeleteActivityInput",
)(
  { activityArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteActivityOutput extends S.Class<DeleteActivityOutput>(
  "DeleteActivityOutput",
)({}, ns) {}
export class DeleteStateMachineInput extends S.Class<DeleteStateMachineInput>(
  "DeleteStateMachineInput",
)(
  { stateMachineArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStateMachineOutput extends S.Class<DeleteStateMachineOutput>(
  "DeleteStateMachineOutput",
)({}, ns) {}
export class DeleteStateMachineAliasInput extends S.Class<DeleteStateMachineAliasInput>(
  "DeleteStateMachineAliasInput",
)(
  { stateMachineAliasArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStateMachineAliasOutput extends S.Class<DeleteStateMachineAliasOutput>(
  "DeleteStateMachineAliasOutput",
)({}, ns) {}
export class DeleteStateMachineVersionInput extends S.Class<DeleteStateMachineVersionInput>(
  "DeleteStateMachineVersionInput",
)(
  { stateMachineVersionArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStateMachineVersionOutput extends S.Class<DeleteStateMachineVersionOutput>(
  "DeleteStateMachineVersionOutput",
)({}, ns) {}
export class DescribeActivityInput extends S.Class<DescribeActivityInput>(
  "DescribeActivityInput",
)(
  { activityArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExecutionInput extends S.Class<DescribeExecutionInput>(
  "DescribeExecutionInput",
)(
  { executionArn: S.String, includedData: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMapRunInput extends S.Class<DescribeMapRunInput>(
  "DescribeMapRunInput",
)(
  { mapRunArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStateMachineInput extends S.Class<DescribeStateMachineInput>(
  "DescribeStateMachineInput",
)(
  { stateMachineArn: S.String, includedData: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStateMachineAliasInput extends S.Class<DescribeStateMachineAliasInput>(
  "DescribeStateMachineAliasInput",
)(
  { stateMachineAliasArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStateMachineForExecutionInput extends S.Class<DescribeStateMachineForExecutionInput>(
  "DescribeStateMachineForExecutionInput",
)(
  { executionArn: S.String, includedData: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetActivityTaskInput extends S.Class<GetActivityTaskInput>(
  "GetActivityTaskInput",
)(
  { activityArn: S.String, workerName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetExecutionHistoryInput extends S.Class<GetExecutionHistoryInput>(
  "GetExecutionHistoryInput",
)(
  {
    executionArn: S.String,
    maxResults: S.optional(S.Number),
    reverseOrder: S.optional(S.Boolean),
    nextToken: S.optional(S.String),
    includeExecutionData: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListActivitiesInput extends S.Class<ListActivitiesInput>(
  "ListActivitiesInput",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListExecutionsInput extends S.Class<ListExecutionsInput>(
  "ListExecutionsInput",
)(
  {
    stateMachineArn: S.optional(S.String),
    statusFilter: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    mapRunArn: S.optional(S.String),
    redriveFilter: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMapRunsInput extends S.Class<ListMapRunsInput>(
  "ListMapRunsInput",
)(
  {
    executionArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStateMachineAliasesInput extends S.Class<ListStateMachineAliasesInput>(
  "ListStateMachineAliasesInput",
)(
  {
    stateMachineArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStateMachinesInput extends S.Class<ListStateMachinesInput>(
  "ListStateMachinesInput",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStateMachineVersionsInput extends S.Class<ListStateMachineVersionsInput>(
  "ListStateMachineVersionsInput",
)(
  {
    stateMachineArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { resourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PublishStateMachineVersionInput extends S.Class<PublishStateMachineVersionInput>(
  "PublishStateMachineVersionInput",
)(
  {
    stateMachineArn: S.String,
    revisionId: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RedriveExecutionInput extends S.Class<RedriveExecutionInput>(
  "RedriveExecutionInput",
)(
  { executionArn: S.String, clientToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendTaskFailureInput extends S.Class<SendTaskFailureInput>(
  "SendTaskFailureInput",
)(
  {
    taskToken: S.String,
    error: S.optional(S.String),
    cause: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendTaskFailureOutput extends S.Class<SendTaskFailureOutput>(
  "SendTaskFailureOutput",
)({}, ns) {}
export class SendTaskHeartbeatInput extends S.Class<SendTaskHeartbeatInput>(
  "SendTaskHeartbeatInput",
)(
  { taskToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendTaskHeartbeatOutput extends S.Class<SendTaskHeartbeatOutput>(
  "SendTaskHeartbeatOutput",
)({}, ns) {}
export class SendTaskSuccessInput extends S.Class<SendTaskSuccessInput>(
  "SendTaskSuccessInput",
)(
  { taskToken: S.String, output: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendTaskSuccessOutput extends S.Class<SendTaskSuccessOutput>(
  "SendTaskSuccessOutput",
)({}, ns) {}
export class StartExecutionInput extends S.Class<StartExecutionInput>(
  "StartExecutionInput",
)(
  {
    stateMachineArn: S.String,
    name: S.optional(S.String),
    input: S.optional(S.String),
    traceHeader: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartSyncExecutionInput extends S.Class<StartSyncExecutionInput>(
  "StartSyncExecutionInput",
)(
  {
    stateMachineArn: S.String,
    name: S.optional(S.String),
    input: S.optional(S.String),
    traceHeader: S.optional(S.String),
    includedData: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopExecutionInput extends S.Class<StopExecutionInput>(
  "StopExecutionInput",
)(
  {
    executionArn: S.String,
    error: S.optional(S.String),
    cause: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}, ns) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { resourceArn: S.String, tagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}, ns) {}
export class UpdateMapRunInput extends S.Class<UpdateMapRunInput>(
  "UpdateMapRunInput",
)(
  {
    mapRunArn: S.String,
    maxConcurrency: S.optional(S.Number),
    toleratedFailurePercentage: S.optional(S.Number),
    toleratedFailureCount: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateMapRunOutput extends S.Class<UpdateMapRunOutput>(
  "UpdateMapRunOutput",
)({}, ns) {}
export class CloudWatchLogsLogGroup extends S.Class<CloudWatchLogsLogGroup>(
  "CloudWatchLogsLogGroup",
)({ logGroupArn: S.optional(S.String) }) {}
export class LogDestination extends S.Class<LogDestination>("LogDestination")({
  cloudWatchLogsLogGroup: S.optional(CloudWatchLogsLogGroup),
}) {}
export const LogDestinationList = S.Array(LogDestination);
export class LoggingConfiguration extends S.Class<LoggingConfiguration>(
  "LoggingConfiguration",
)({
  level: S.optional(S.String),
  includeExecutionData: S.optional(S.Boolean),
  destinations: S.optional(LogDestinationList),
}) {}
export class TracingConfiguration extends S.Class<TracingConfiguration>(
  "TracingConfiguration",
)({ enabled: S.optional(S.Boolean) }) {}
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({
  kmsKeyId: S.optional(S.String),
  kmsDataKeyReusePeriodSeconds: S.optional(S.Number),
  type: S.String,
}) {}
export class UpdateStateMachineInput extends S.Class<UpdateStateMachineInput>(
  "UpdateStateMachineInput",
)(
  {
    stateMachineArn: S.String,
    definition: S.optional(S.String),
    roleArn: S.optional(S.String),
    loggingConfiguration: S.optional(LoggingConfiguration),
    tracingConfiguration: S.optional(TracingConfiguration),
    publish: S.optional(S.Boolean),
    versionDescription: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RoutingConfigurationListItem extends S.Class<RoutingConfigurationListItem>(
  "RoutingConfigurationListItem",
)({ stateMachineVersionArn: S.String, weight: S.Number }) {}
export const RoutingConfigurationList = S.Array(RoutingConfigurationListItem);
export class UpdateStateMachineAliasInput extends S.Class<UpdateStateMachineAliasInput>(
  "UpdateStateMachineAliasInput",
)(
  {
    stateMachineAliasArn: S.String,
    description: S.optional(S.String),
    routingConfiguration: S.optional(RoutingConfigurationList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ValidateStateMachineDefinitionInput extends S.Class<ValidateStateMachineDefinitionInput>(
  "ValidateStateMachineDefinitionInput",
)(
  {
    definition: S.String,
    type: S.optional(S.String),
    severity: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TestStateConfiguration extends S.Class<TestStateConfiguration>(
  "TestStateConfiguration",
)({
  retrierRetryCount: S.optional(S.Number),
  errorCausedByState: S.optional(S.String),
  mapIterationFailureCount: S.optional(S.Number),
  mapItemReaderData: S.optional(S.String),
}) {}
export class CreateActivityInput extends S.Class<CreateActivityInput>(
  "CreateActivityInput",
)(
  {
    name: S.String,
    tags: S.optional(TagList),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateStateMachineAliasInput extends S.Class<CreateStateMachineAliasInput>(
  "CreateStateMachineAliasInput",
)(
  {
    description: S.optional(S.String),
    name: S.String,
    routingConfiguration: RoutingConfigurationList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeActivityOutput extends S.Class<DescribeActivityOutput>(
  "DescribeActivityOutput",
)(
  {
    activityArn: S.String,
    name: S.String,
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  },
  ns,
) {}
export class DescribeStateMachineAliasOutput extends S.Class<DescribeStateMachineAliasOutput>(
  "DescribeStateMachineAliasOutput",
)(
  {
    stateMachineAliasArn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    routingConfiguration: S.optional(RoutingConfigurationList),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export const VariableNameList = S.Array(S.String);
export const VariableReferences = S.Record({
  key: S.String,
  value: VariableNameList,
});
export class DescribeStateMachineForExecutionOutput extends S.Class<DescribeStateMachineForExecutionOutput>(
  "DescribeStateMachineForExecutionOutput",
)(
  {
    stateMachineArn: S.String,
    name: S.String,
    definition: S.String,
    roleArn: S.String,
    updateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    loggingConfiguration: S.optional(LoggingConfiguration),
    tracingConfiguration: S.optional(TracingConfiguration),
    mapRunArn: S.optional(S.String),
    label: S.optional(S.String),
    revisionId: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    variableReferences: S.optional(VariableReferences),
  },
  ns,
) {}
export class GetActivityTaskOutput extends S.Class<GetActivityTaskOutput>(
  "GetActivityTaskOutput",
)({ taskToken: S.optional(S.String), input: S.optional(S.String) }, ns) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: S.optional(TagList) }, ns) {}
export class PublishStateMachineVersionOutput extends S.Class<PublishStateMachineVersionOutput>(
  "PublishStateMachineVersionOutput",
)(
  {
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    stateMachineVersionArn: S.String,
  },
  ns,
) {}
export class RedriveExecutionOutput extends S.Class<RedriveExecutionOutput>(
  "RedriveExecutionOutput",
)({ redriveDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }, ns) {}
export class StartExecutionOutput extends S.Class<StartExecutionOutput>(
  "StartExecutionOutput",
)(
  {
    executionArn: S.String,
    startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  ns,
) {}
export class StopExecutionOutput extends S.Class<StopExecutionOutput>(
  "StopExecutionOutput",
)({ stopDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }, ns) {}
export class UpdateStateMachineOutput extends S.Class<UpdateStateMachineOutput>(
  "UpdateStateMachineOutput",
)(
  {
    updateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    revisionId: S.optional(S.String),
    stateMachineVersionArn: S.optional(S.String),
  },
  ns,
) {}
export class UpdateStateMachineAliasOutput extends S.Class<UpdateStateMachineAliasOutput>(
  "UpdateStateMachineAliasOutput",
)({ updateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }, ns) {}
export class MockErrorOutput extends S.Class<MockErrorOutput>(
  "MockErrorOutput",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class CloudWatchEventsExecutionDataDetails extends S.Class<CloudWatchEventsExecutionDataDetails>(
  "CloudWatchEventsExecutionDataDetails",
)({ included: S.optional(S.Boolean) }) {}
export class MapRunItemCounts extends S.Class<MapRunItemCounts>(
  "MapRunItemCounts",
)({
  pending: S.Number,
  running: S.Number,
  succeeded: S.Number,
  failed: S.Number,
  timedOut: S.Number,
  aborted: S.Number,
  total: S.Number,
  resultsWritten: S.Number,
  failuresNotRedrivable: S.optional(S.Number),
  pendingRedrive: S.optional(S.Number),
}) {}
export class MapRunExecutionCounts extends S.Class<MapRunExecutionCounts>(
  "MapRunExecutionCounts",
)({
  pending: S.Number,
  running: S.Number,
  succeeded: S.Number,
  failed: S.Number,
  timedOut: S.Number,
  aborted: S.Number,
  total: S.Number,
  resultsWritten: S.Number,
  failuresNotRedrivable: S.optional(S.Number),
  pendingRedrive: S.optional(S.Number),
}) {}
export class ActivityListItem extends S.Class<ActivityListItem>(
  "ActivityListItem",
)({
  activityArn: S.String,
  name: S.String,
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ActivityList = S.Array(ActivityListItem);
export class ExecutionListItem extends S.Class<ExecutionListItem>(
  "ExecutionListItem",
)({
  executionArn: S.String,
  stateMachineArn: S.String,
  name: S.String,
  status: S.String,
  startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  stopDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  mapRunArn: S.optional(S.String),
  itemCount: S.optional(S.Number),
  stateMachineVersionArn: S.optional(S.String),
  stateMachineAliasArn: S.optional(S.String),
  redriveCount: S.optional(S.Number),
  redriveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ExecutionList = S.Array(ExecutionListItem);
export class MapRunListItem extends S.Class<MapRunListItem>("MapRunListItem")({
  executionArn: S.String,
  mapRunArn: S.String,
  stateMachineArn: S.String,
  startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  stopDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const MapRunList = S.Array(MapRunListItem);
export class StateMachineAliasListItem extends S.Class<StateMachineAliasListItem>(
  "StateMachineAliasListItem",
)({
  stateMachineAliasArn: S.String,
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const StateMachineAliasList = S.Array(StateMachineAliasListItem);
export class StateMachineListItem extends S.Class<StateMachineListItem>(
  "StateMachineListItem",
)({
  stateMachineArn: S.String,
  name: S.String,
  type: S.String,
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const StateMachineList = S.Array(StateMachineListItem);
export class StateMachineVersionListItem extends S.Class<StateMachineVersionListItem>(
  "StateMachineVersionListItem",
)({
  stateMachineVersionArn: S.String,
  creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const StateMachineVersionList = S.Array(StateMachineVersionListItem);
export class BillingDetails extends S.Class<BillingDetails>("BillingDetails")({
  billedMemoryUsedInMB: S.optional(S.Number),
  billedDurationInMilliseconds: S.optional(S.Number),
}) {}
export class MockInput extends S.Class<MockInput>("MockInput")({
  result: S.optional(S.String),
  errorOutput: S.optional(MockErrorOutput),
  fieldValidationMode: S.optional(S.String),
}) {}
export class ValidateStateMachineDefinitionDiagnostic extends S.Class<ValidateStateMachineDefinitionDiagnostic>(
  "ValidateStateMachineDefinitionDiagnostic",
)({
  severity: S.String,
  code: S.String,
  message: S.String,
  location: S.optional(S.String),
}) {}
export const ValidateStateMachineDefinitionDiagnosticList = S.Array(
  ValidateStateMachineDefinitionDiagnostic,
);
export class CreateActivityOutput extends S.Class<CreateActivityOutput>(
  "CreateActivityOutput",
)(
  {
    activityArn: S.String,
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  ns,
) {}
export class CreateStateMachineAliasOutput extends S.Class<CreateStateMachineAliasOutput>(
  "CreateStateMachineAliasOutput",
)(
  {
    stateMachineAliasArn: S.String,
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  ns,
) {}
export class DescribeExecutionOutput extends S.Class<DescribeExecutionOutput>(
  "DescribeExecutionOutput",
)(
  {
    executionArn: S.String,
    stateMachineArn: S.String,
    name: S.optional(S.String),
    status: S.String,
    startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    stopDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    input: S.optional(S.String),
    inputDetails: S.optional(CloudWatchEventsExecutionDataDetails),
    output: S.optional(S.String),
    outputDetails: S.optional(CloudWatchEventsExecutionDataDetails),
    traceHeader: S.optional(S.String),
    mapRunArn: S.optional(S.String),
    error: S.optional(S.String),
    cause: S.optional(S.String),
    stateMachineVersionArn: S.optional(S.String),
    stateMachineAliasArn: S.optional(S.String),
    redriveCount: S.optional(S.Number),
    redriveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    redriveStatus: S.optional(S.String),
    redriveStatusReason: S.optional(S.String),
  },
  ns,
) {}
export class DescribeMapRunOutput extends S.Class<DescribeMapRunOutput>(
  "DescribeMapRunOutput",
)(
  {
    mapRunArn: S.String,
    executionArn: S.String,
    status: S.String,
    startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    stopDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    maxConcurrency: S.Number,
    toleratedFailurePercentage: S.Number,
    toleratedFailureCount: S.Number,
    itemCounts: MapRunItemCounts,
    executionCounts: MapRunExecutionCounts,
    redriveCount: S.optional(S.Number),
    redriveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class DescribeStateMachineOutput extends S.Class<DescribeStateMachineOutput>(
  "DescribeStateMachineOutput",
)(
  {
    stateMachineArn: S.String,
    name: S.String,
    status: S.optional(S.String),
    definition: S.String,
    roleArn: S.String,
    type: S.String,
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    loggingConfiguration: S.optional(LoggingConfiguration),
    tracingConfiguration: S.optional(TracingConfiguration),
    label: S.optional(S.String),
    revisionId: S.optional(S.String),
    description: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
    variableReferences: S.optional(VariableReferences),
  },
  ns,
) {}
export class ListActivitiesOutput extends S.Class<ListActivitiesOutput>(
  "ListActivitiesOutput",
)({ activities: ActivityList, nextToken: S.optional(S.String) }, ns) {}
export class ListExecutionsOutput extends S.Class<ListExecutionsOutput>(
  "ListExecutionsOutput",
)({ executions: ExecutionList, nextToken: S.optional(S.String) }, ns) {}
export class ListMapRunsOutput extends S.Class<ListMapRunsOutput>(
  "ListMapRunsOutput",
)({ mapRuns: MapRunList, nextToken: S.optional(S.String) }, ns) {}
export class ListStateMachineAliasesOutput extends S.Class<ListStateMachineAliasesOutput>(
  "ListStateMachineAliasesOutput",
)(
  {
    stateMachineAliases: StateMachineAliasList,
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStateMachinesOutput extends S.Class<ListStateMachinesOutput>(
  "ListStateMachinesOutput",
)({ stateMachines: StateMachineList, nextToken: S.optional(S.String) }, ns) {}
export class ListStateMachineVersionsOutput extends S.Class<ListStateMachineVersionsOutput>(
  "ListStateMachineVersionsOutput",
)(
  {
    stateMachineVersions: StateMachineVersionList,
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class StartSyncExecutionOutput extends S.Class<StartSyncExecutionOutput>(
  "StartSyncExecutionOutput",
)(
  {
    executionArn: S.String,
    stateMachineArn: S.optional(S.String),
    name: S.optional(S.String),
    startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    stopDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    error: S.optional(S.String),
    cause: S.optional(S.String),
    input: S.optional(S.String),
    inputDetails: S.optional(CloudWatchEventsExecutionDataDetails),
    output: S.optional(S.String),
    outputDetails: S.optional(CloudWatchEventsExecutionDataDetails),
    traceHeader: S.optional(S.String),
    billingDetails: S.optional(BillingDetails),
  },
  ns,
) {}
export class TestStateInput extends S.Class<TestStateInput>("TestStateInput")(
  {
    definition: S.String,
    roleArn: S.optional(S.String),
    input: S.optional(S.String),
    inspectionLevel: S.optional(S.String),
    revealSecrets: S.optional(S.Boolean),
    variables: S.optional(S.String),
    stateName: S.optional(S.String),
    mock: S.optional(MockInput),
    context: S.optional(S.String),
    stateConfiguration: S.optional(TestStateConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ValidateStateMachineDefinitionOutput extends S.Class<ValidateStateMachineDefinitionOutput>(
  "ValidateStateMachineDefinitionOutput",
)(
  {
    result: S.String,
    diagnostics: ValidateStateMachineDefinitionDiagnosticList,
    truncated: S.optional(S.Boolean),
  },
  ns,
) {}
export class ActivityFailedEventDetails extends S.Class<ActivityFailedEventDetails>(
  "ActivityFailedEventDetails",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class ActivityScheduleFailedEventDetails extends S.Class<ActivityScheduleFailedEventDetails>(
  "ActivityScheduleFailedEventDetails",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class ActivityStartedEventDetails extends S.Class<ActivityStartedEventDetails>(
  "ActivityStartedEventDetails",
)({ workerName: S.optional(S.String) }) {}
export class HistoryEventExecutionDataDetails extends S.Class<HistoryEventExecutionDataDetails>(
  "HistoryEventExecutionDataDetails",
)({ truncated: S.optional(S.Boolean) }) {}
export class ActivitySucceededEventDetails extends S.Class<ActivitySucceededEventDetails>(
  "ActivitySucceededEventDetails",
)({
  output: S.optional(S.String),
  outputDetails: S.optional(HistoryEventExecutionDataDetails),
}) {}
export class ActivityTimedOutEventDetails extends S.Class<ActivityTimedOutEventDetails>(
  "ActivityTimedOutEventDetails",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class TaskFailedEventDetails extends S.Class<TaskFailedEventDetails>(
  "TaskFailedEventDetails",
)({
  resourceType: S.String,
  resource: S.String,
  error: S.optional(S.String),
  cause: S.optional(S.String),
}) {}
export class TaskStartFailedEventDetails extends S.Class<TaskStartFailedEventDetails>(
  "TaskStartFailedEventDetails",
)({
  resourceType: S.String,
  resource: S.String,
  error: S.optional(S.String),
  cause: S.optional(S.String),
}) {}
export class TaskStartedEventDetails extends S.Class<TaskStartedEventDetails>(
  "TaskStartedEventDetails",
)({ resourceType: S.String, resource: S.String }) {}
export class TaskSubmitFailedEventDetails extends S.Class<TaskSubmitFailedEventDetails>(
  "TaskSubmitFailedEventDetails",
)({
  resourceType: S.String,
  resource: S.String,
  error: S.optional(S.String),
  cause: S.optional(S.String),
}) {}
export class TaskSubmittedEventDetails extends S.Class<TaskSubmittedEventDetails>(
  "TaskSubmittedEventDetails",
)({
  resourceType: S.String,
  resource: S.String,
  output: S.optional(S.String),
  outputDetails: S.optional(HistoryEventExecutionDataDetails),
}) {}
export class TaskSucceededEventDetails extends S.Class<TaskSucceededEventDetails>(
  "TaskSucceededEventDetails",
)({
  resourceType: S.String,
  resource: S.String,
  output: S.optional(S.String),
  outputDetails: S.optional(HistoryEventExecutionDataDetails),
}) {}
export class TaskTimedOutEventDetails extends S.Class<TaskTimedOutEventDetails>(
  "TaskTimedOutEventDetails",
)({
  resourceType: S.String,
  resource: S.String,
  error: S.optional(S.String),
  cause: S.optional(S.String),
}) {}
export class ExecutionFailedEventDetails extends S.Class<ExecutionFailedEventDetails>(
  "ExecutionFailedEventDetails",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class ExecutionStartedEventDetails extends S.Class<ExecutionStartedEventDetails>(
  "ExecutionStartedEventDetails",
)({
  input: S.optional(S.String),
  inputDetails: S.optional(HistoryEventExecutionDataDetails),
  roleArn: S.optional(S.String),
  stateMachineAliasArn: S.optional(S.String),
  stateMachineVersionArn: S.optional(S.String),
}) {}
export class ExecutionSucceededEventDetails extends S.Class<ExecutionSucceededEventDetails>(
  "ExecutionSucceededEventDetails",
)({
  output: S.optional(S.String),
  outputDetails: S.optional(HistoryEventExecutionDataDetails),
}) {}
export class ExecutionAbortedEventDetails extends S.Class<ExecutionAbortedEventDetails>(
  "ExecutionAbortedEventDetails",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class ExecutionTimedOutEventDetails extends S.Class<ExecutionTimedOutEventDetails>(
  "ExecutionTimedOutEventDetails",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class ExecutionRedrivenEventDetails extends S.Class<ExecutionRedrivenEventDetails>(
  "ExecutionRedrivenEventDetails",
)({ redriveCount: S.optional(S.Number) }) {}
export class MapStateStartedEventDetails extends S.Class<MapStateStartedEventDetails>(
  "MapStateStartedEventDetails",
)({ length: S.optional(S.Number) }) {}
export class MapIterationEventDetails extends S.Class<MapIterationEventDetails>(
  "MapIterationEventDetails",
)({ name: S.optional(S.String), index: S.optional(S.Number) }) {}
export class LambdaFunctionFailedEventDetails extends S.Class<LambdaFunctionFailedEventDetails>(
  "LambdaFunctionFailedEventDetails",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class LambdaFunctionScheduleFailedEventDetails extends S.Class<LambdaFunctionScheduleFailedEventDetails>(
  "LambdaFunctionScheduleFailedEventDetails",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class TaskCredentials extends S.Class<TaskCredentials>(
  "TaskCredentials",
)({ roleArn: S.optional(S.String) }) {}
export class LambdaFunctionScheduledEventDetails extends S.Class<LambdaFunctionScheduledEventDetails>(
  "LambdaFunctionScheduledEventDetails",
)({
  resource: S.String,
  input: S.optional(S.String),
  inputDetails: S.optional(HistoryEventExecutionDataDetails),
  timeoutInSeconds: S.optional(S.Number),
  taskCredentials: S.optional(TaskCredentials),
}) {}
export class LambdaFunctionStartFailedEventDetails extends S.Class<LambdaFunctionStartFailedEventDetails>(
  "LambdaFunctionStartFailedEventDetails",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class LambdaFunctionSucceededEventDetails extends S.Class<LambdaFunctionSucceededEventDetails>(
  "LambdaFunctionSucceededEventDetails",
)({
  output: S.optional(S.String),
  outputDetails: S.optional(HistoryEventExecutionDataDetails),
}) {}
export class LambdaFunctionTimedOutEventDetails extends S.Class<LambdaFunctionTimedOutEventDetails>(
  "LambdaFunctionTimedOutEventDetails",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class StateEnteredEventDetails extends S.Class<StateEnteredEventDetails>(
  "StateEnteredEventDetails",
)({
  name: S.String,
  input: S.optional(S.String),
  inputDetails: S.optional(HistoryEventExecutionDataDetails),
}) {}
export class MapRunStartedEventDetails extends S.Class<MapRunStartedEventDetails>(
  "MapRunStartedEventDetails",
)({ mapRunArn: S.optional(S.String) }) {}
export class MapRunFailedEventDetails extends S.Class<MapRunFailedEventDetails>(
  "MapRunFailedEventDetails",
)({ error: S.optional(S.String), cause: S.optional(S.String) }) {}
export class MapRunRedrivenEventDetails extends S.Class<MapRunRedrivenEventDetails>(
  "MapRunRedrivenEventDetails",
)({ mapRunArn: S.optional(S.String), redriveCount: S.optional(S.Number) }) {}
export class EvaluationFailedEventDetails extends S.Class<EvaluationFailedEventDetails>(
  "EvaluationFailedEventDetails",
)({
  error: S.optional(S.String),
  cause: S.optional(S.String),
  location: S.optional(S.String),
  state: S.String,
}) {}
export const AssignedVariables = S.Record({ key: S.String, value: S.String });
export class AssignedVariablesDetails extends S.Class<AssignedVariablesDetails>(
  "AssignedVariablesDetails",
)({ truncated: S.optional(S.Boolean) }) {}
export class CreateStateMachineInput extends S.Class<CreateStateMachineInput>(
  "CreateStateMachineInput",
)(
  {
    name: S.String,
    definition: S.String,
    roleArn: S.String,
    type: S.optional(S.String),
    loggingConfiguration: S.optional(LoggingConfiguration),
    tags: S.optional(TagList),
    tracingConfiguration: S.optional(TracingConfiguration),
    publish: S.optional(S.Boolean),
    versionDescription: S.optional(S.String),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ActivityScheduledEventDetails extends S.Class<ActivityScheduledEventDetails>(
  "ActivityScheduledEventDetails",
)({
  resource: S.String,
  input: S.optional(S.String),
  inputDetails: S.optional(HistoryEventExecutionDataDetails),
  timeoutInSeconds: S.optional(S.Number),
  heartbeatInSeconds: S.optional(S.Number),
}) {}
export class TaskScheduledEventDetails extends S.Class<TaskScheduledEventDetails>(
  "TaskScheduledEventDetails",
)({
  resourceType: S.String,
  resource: S.String,
  region: S.String,
  parameters: S.String,
  timeoutInSeconds: S.optional(S.Number),
  heartbeatInSeconds: S.optional(S.Number),
  taskCredentials: S.optional(TaskCredentials),
}) {}
export class StateExitedEventDetails extends S.Class<StateExitedEventDetails>(
  "StateExitedEventDetails",
)({
  name: S.String,
  output: S.optional(S.String),
  outputDetails: S.optional(HistoryEventExecutionDataDetails),
  assignedVariables: S.optional(AssignedVariables),
  assignedVariablesDetails: S.optional(AssignedVariablesDetails),
}) {}
export class HistoryEvent extends S.Class<HistoryEvent>("HistoryEvent")({
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  type: S.String,
  id: S.Number,
  previousEventId: S.optional(S.Number),
  activityFailedEventDetails: S.optional(ActivityFailedEventDetails),
  activityScheduleFailedEventDetails: S.optional(
    ActivityScheduleFailedEventDetails,
  ),
  activityScheduledEventDetails: S.optional(ActivityScheduledEventDetails),
  activityStartedEventDetails: S.optional(ActivityStartedEventDetails),
  activitySucceededEventDetails: S.optional(ActivitySucceededEventDetails),
  activityTimedOutEventDetails: S.optional(ActivityTimedOutEventDetails),
  taskFailedEventDetails: S.optional(TaskFailedEventDetails),
  taskScheduledEventDetails: S.optional(TaskScheduledEventDetails),
  taskStartFailedEventDetails: S.optional(TaskStartFailedEventDetails),
  taskStartedEventDetails: S.optional(TaskStartedEventDetails),
  taskSubmitFailedEventDetails: S.optional(TaskSubmitFailedEventDetails),
  taskSubmittedEventDetails: S.optional(TaskSubmittedEventDetails),
  taskSucceededEventDetails: S.optional(TaskSucceededEventDetails),
  taskTimedOutEventDetails: S.optional(TaskTimedOutEventDetails),
  executionFailedEventDetails: S.optional(ExecutionFailedEventDetails),
  executionStartedEventDetails: S.optional(ExecutionStartedEventDetails),
  executionSucceededEventDetails: S.optional(ExecutionSucceededEventDetails),
  executionAbortedEventDetails: S.optional(ExecutionAbortedEventDetails),
  executionTimedOutEventDetails: S.optional(ExecutionTimedOutEventDetails),
  executionRedrivenEventDetails: S.optional(ExecutionRedrivenEventDetails),
  mapStateStartedEventDetails: S.optional(MapStateStartedEventDetails),
  mapIterationStartedEventDetails: S.optional(MapIterationEventDetails),
  mapIterationSucceededEventDetails: S.optional(MapIterationEventDetails),
  mapIterationFailedEventDetails: S.optional(MapIterationEventDetails),
  mapIterationAbortedEventDetails: S.optional(MapIterationEventDetails),
  lambdaFunctionFailedEventDetails: S.optional(
    LambdaFunctionFailedEventDetails,
  ),
  lambdaFunctionScheduleFailedEventDetails: S.optional(
    LambdaFunctionScheduleFailedEventDetails,
  ),
  lambdaFunctionScheduledEventDetails: S.optional(
    LambdaFunctionScheduledEventDetails,
  ),
  lambdaFunctionStartFailedEventDetails: S.optional(
    LambdaFunctionStartFailedEventDetails,
  ),
  lambdaFunctionSucceededEventDetails: S.optional(
    LambdaFunctionSucceededEventDetails,
  ),
  lambdaFunctionTimedOutEventDetails: S.optional(
    LambdaFunctionTimedOutEventDetails,
  ),
  stateEnteredEventDetails: S.optional(StateEnteredEventDetails),
  stateExitedEventDetails: S.optional(StateExitedEventDetails),
  mapRunStartedEventDetails: S.optional(MapRunStartedEventDetails),
  mapRunFailedEventDetails: S.optional(MapRunFailedEventDetails),
  mapRunRedrivenEventDetails: S.optional(MapRunRedrivenEventDetails),
  evaluationFailedEventDetails: S.optional(EvaluationFailedEventDetails),
}) {}
export const HistoryEventList = S.Array(HistoryEvent);
export class CreateStateMachineOutput extends S.Class<CreateStateMachineOutput>(
  "CreateStateMachineOutput",
)(
  {
    stateMachineArn: S.String,
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    stateMachineVersionArn: S.optional(S.String),
  },
  ns,
) {}
export class GetExecutionHistoryOutput extends S.Class<GetExecutionHistoryOutput>(
  "GetExecutionHistoryOutput",
)({ events: HistoryEventList, nextToken: S.optional(S.String) }, ns) {}
export class InspectionDataRequest extends S.Class<InspectionDataRequest>(
  "InspectionDataRequest",
)({
  protocol: S.optional(S.String),
  method: S.optional(S.String),
  url: S.optional(S.String),
  headers: S.optional(S.String),
  body: S.optional(S.String),
}) {}
export class InspectionDataResponse extends S.Class<InspectionDataResponse>(
  "InspectionDataResponse",
)({
  protocol: S.optional(S.String),
  statusCode: S.optional(S.String),
  statusMessage: S.optional(S.String),
  headers: S.optional(S.String),
  body: S.optional(S.String),
}) {}
export class InspectionErrorDetails extends S.Class<InspectionErrorDetails>(
  "InspectionErrorDetails",
)({
  catchIndex: S.optional(S.Number),
  retryIndex: S.optional(S.Number),
  retryBackoffIntervalSeconds: S.optional(S.Number),
}) {}
export class InspectionData extends S.Class<InspectionData>("InspectionData")({
  input: S.optional(S.String),
  afterArguments: S.optional(S.String),
  afterInputPath: S.optional(S.String),
  afterParameters: S.optional(S.String),
  result: S.optional(S.String),
  afterResultSelector: S.optional(S.String),
  afterResultPath: S.optional(S.String),
  request: S.optional(InspectionDataRequest),
  response: S.optional(InspectionDataResponse),
  variables: S.optional(S.String),
  errorDetails: S.optional(InspectionErrorDetails),
  afterItemsPath: S.optional(S.String),
  afterItemSelector: S.optional(S.String),
  afterItemBatcher: S.optional(S.String),
  afterItemsPointer: S.optional(S.String),
  toleratedFailureCount: S.optional(S.Number),
  toleratedFailurePercentage: S.optional(S.Number),
  maxConcurrency: S.optional(S.Number),
}) {}
export class TestStateOutput extends S.Class<TestStateOutput>(
  "TestStateOutput",
)(
  {
    output: S.optional(S.String),
    error: S.optional(S.String),
    cause: S.optional(S.String),
    inspectionData: S.optional(InspectionData),
    nextState: S.optional(S.String),
    status: S.optional(S.String),
  },
  ns,
) {}

//# Errors
export class InvalidArn extends S.TaggedError<InvalidArn>()("InvalidArn", {}) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class InvalidToken extends S.TaggedError<InvalidToken>()(
  "InvalidToken",
  {},
) {}
export class ResourceNotFound extends S.TaggedError<ResourceNotFound>()(
  "ResourceNotFound",
  {},
) {}
export class ActivityDoesNotExist extends S.TaggedError<ActivityDoesNotExist>()(
  "ActivityDoesNotExist",
  {},
) {}
export class ExecutionDoesNotExist extends S.TaggedError<ExecutionDoesNotExist>()(
  "ExecutionDoesNotExist",
  {},
) {}
export class TaskDoesNotExist extends S.TaggedError<TaskDoesNotExist>()(
  "TaskDoesNotExist",
  { message: S.optional(S.String) },
) {}
export class InvalidOutput extends S.TaggedError<InvalidOutput>()(
  "InvalidOutput",
  { message: S.optional(S.String) },
) {}
export class KmsAccessDeniedException extends S.TaggedError<KmsAccessDeniedException>()(
  "KmsAccessDeniedException",
  {},
) {}
export class KmsInvalidStateException extends S.TaggedError<KmsInvalidStateException>()(
  "KmsInvalidStateException",
  {},
) {}
export class KmsThrottlingException extends S.TaggedError<KmsThrottlingException>()(
  "KmsThrottlingException",
  {},
) {}
export class ActivityWorkerLimitExceeded extends S.TaggedError<ActivityWorkerLimitExceeded>()(
  "ActivityWorkerLimitExceeded",
  { message: S.optional(S.String) },
) {}
export class StateMachineDoesNotExist extends S.TaggedError<StateMachineDoesNotExist>()(
  "StateMachineDoesNotExist",
  {},
) {}
export class StateMachineDeleting extends S.TaggedError<StateMachineDeleting>()(
  "StateMachineDeleting",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class ExecutionLimitExceeded extends S.TaggedError<ExecutionLimitExceeded>()(
  "ExecutionLimitExceeded",
  { message: S.optional(S.String) },
) {}
export class TaskTimedOut extends S.TaggedError<TaskTimedOut>()(
  "TaskTimedOut",
  {},
) {}
export class ExecutionAlreadyExists extends S.TaggedError<ExecutionAlreadyExists>()(
  "ExecutionAlreadyExists",
  { message: S.optional(S.String) },
) {}
export class InvalidExecutionInput extends S.TaggedError<InvalidExecutionInput>()(
  "InvalidExecutionInput",
  {},
) {}
export class InvalidName extends S.TaggedError<InvalidName>()(
  "InvalidName",
  {},
) {}
export class StateMachineTypeNotSupported extends S.TaggedError<StateMachineTypeNotSupported>()(
  "StateMachineTypeNotSupported",
  {},
) {}
export class TooManyTags extends S.TaggedError<TooManyTags>()("TooManyTags", {
  message: S.optional(S.String),
  resourceName: S.optional(S.String),
}) {}
export class InvalidDefinition extends S.TaggedError<InvalidDefinition>()(
  "InvalidDefinition",
  { message: S.optional(S.String) },
) {}
export class ActivityAlreadyExists extends S.TaggedError<ActivityAlreadyExists>()(
  "ActivityAlreadyExists",
  { message: S.optional(S.String) },
) {}
export class ExecutionNotRedrivable extends S.TaggedError<ExecutionNotRedrivable>()(
  "ExecutionNotRedrivable",
  { message: S.optional(S.String) },
) {}
export class InvalidEncryptionConfiguration extends S.TaggedError<InvalidEncryptionConfiguration>()(
  "InvalidEncryptionConfiguration",
  { message: S.optional(S.String) },
) {}
export class ActivityLimitExceeded extends S.TaggedError<ActivityLimitExceeded>()(
  "ActivityLimitExceeded",
  { message: S.optional(S.String) },
) {}
export class InvalidLoggingConfiguration extends S.TaggedError<InvalidLoggingConfiguration>()(
  "InvalidLoggingConfiguration",
  {},
) {}
export class InvalidTracingConfiguration extends S.TaggedError<InvalidTracingConfiguration>()(
  "InvalidTracingConfiguration",
  {},
) {}
export class MissingRequiredParameter extends S.TaggedError<MissingRequiredParameter>()(
  "MissingRequiredParameter",
  { message: S.optional(S.String) },
) {}
export class StateMachineAlreadyExists extends S.TaggedError<StateMachineAlreadyExists>()(
  "StateMachineAlreadyExists",
  { message: S.optional(S.String) },
) {}
export class StateMachineLimitExceeded extends S.TaggedError<StateMachineLimitExceeded>()(
  "StateMachineLimitExceeded",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a state machine version. After
 * you delete a version, you can't call StartExecution using that version's ARN
 * or use the version with a state machine alias.
 *
 * Deleting a state machine version won't terminate its in-progress executions.
 *
 * You can't delete a state machine version currently referenced by one or more aliases. Before you delete a version, you must either delete the aliases or update them to point to another state machine version.
 *
 * **Related operations:**
 *
 * - PublishStateMachineVersion
 *
 * - ListStateMachineVersions
 */
export const deleteStateMachineVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteStateMachineVersionInput,
    output: DeleteStateMachineVersionOutput,
    errors: [ConflictException, InvalidArn, ValidationException],
  }),
);
/**
 * Remove a tag from a Step Functions resource
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [InvalidArn, ResourceNotFound],
}));
/**
 * Updates an in-progress Map Run's configuration to include changes to the settings that control maximum concurrency and Map Run failure.
 */
export const updateMapRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMapRunInput,
  output: UpdateMapRunOutput,
  errors: [InvalidArn, ResourceNotFound, ValidationException],
}));
/**
 * Deletes an activity.
 */
export const deleteActivity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteActivityInput,
  output: DeleteActivityOutput,
  errors: [InvalidArn],
}));
/**
 * Deletes a state machine. This is an asynchronous operation. It sets the state machine's
 * status to `DELETING` and begins the deletion process. A state machine is deleted only when all its executions are completed. On the next state transition, the state machine's executions are terminated.
 *
 * A qualified state machine ARN can either refer to a *Distributed Map state* defined within a state machine, a version ARN, or an alias ARN.
 *
 * The following are some examples of qualified and unqualified state machine ARNs:
 *
 * - The following qualified state machine ARN refers to a *Distributed Map state* with a label `mapStateLabel` in a state machine named `myStateMachine`.
 *
 * `arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel`
 *
 * If you provide a qualified state machine ARN that refers to a *Distributed Map state*, the request fails with `ValidationException`.
 *
 * - The following unqualified state machine ARN refers to a state machine named `myStateMachine`.
 *
 * `arn:partition:states:region:account-id:stateMachine:myStateMachine`
 *
 * This API action also deletes all versions and aliases associated with a state machine.
 *
 * For `EXPRESS` state machines, the deletion happens eventually (usually in
 * less than a minute). Running executions may emit logs after `DeleteStateMachine`
 * API is called.
 */
export const deleteStateMachine = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStateMachineInput,
  output: DeleteStateMachineOutput,
  errors: [InvalidArn, ValidationException],
}));
/**
 * Deletes a state machine alias.
 *
 * After you delete a state machine alias, you can't use it to start executions. When you
 * delete a state machine alias, Step Functions doesn't delete the state machine versions
 * that alias references.
 *
 * **Related operations:**
 *
 * - CreateStateMachineAlias
 *
 * - DescribeStateMachineAlias
 *
 * - ListStateMachineAliases
 *
 * - UpdateStateMachineAlias
 */
export const deleteStateMachineAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteStateMachineAliasInput,
    output: DeleteStateMachineAliasOutput,
    errors: [
      ConflictException,
      InvalidArn,
      ResourceNotFound,
      ValidationException,
    ],
  }),
);
/**
 * Returns details about a state machine alias.
 *
 * **Related operations:**
 *
 * - CreateStateMachineAlias
 *
 * - ListStateMachineAliases
 *
 * - UpdateStateMachineAlias
 *
 * - DeleteStateMachineAlias
 */
export const describeStateMachineAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStateMachineAliasInput,
    output: DescribeStateMachineAliasOutput,
    errors: [InvalidArn, ResourceNotFound, ValidationException],
  }),
);
/**
 * List tags for a given resource.
 *
 * Tags may only contain Unicode letters, digits, white space, or these symbols: `_ . : / = + - @`.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [InvalidArn, ResourceNotFound],
}));
/**
 * Describes an activity.
 *
 * This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.
 */
export const describeActivity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeActivityInput,
  output: DescribeActivityOutput,
  errors: [ActivityDoesNotExist, InvalidArn],
}));
/**
 * Provides information about a state machine execution, such as the state machine associated with the execution, the execution input and output, and relevant execution metadata. If you've redriven an execution, you can use this API action to return information about the redrives of that execution. In addition, you can use this API action to return the Map Run Amazon Resource Name (ARN) if the execution was dispatched by a Map Run.
 *
 * If you specify a version or alias ARN when you call the StartExecution
 * API action, `DescribeExecution` returns that ARN.
 *
 * This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.
 *
 * Executions of an `EXPRESS` state machine aren't supported by `DescribeExecution` unless a Map Run dispatched them.
 */
export const describeExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExecutionInput,
  output: DescribeExecutionOutput,
  errors: [
    ExecutionDoesNotExist,
    InvalidArn,
    KmsAccessDeniedException,
    KmsInvalidStateException,
    KmsThrottlingException,
  ],
}));
/**
 * Provides information about a Map Run's configuration, progress, and results. If you've redriven a Map Run, this API action also returns information about the redrives of that Map Run. For more information, see Examining Map Run in the *Step Functions Developer Guide*.
 */
export const describeMapRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMapRunInput,
  output: DescribeMapRunOutput,
  errors: [InvalidArn, ResourceNotFound],
}));
/**
 * Provides information about a state machine's definition, its execution role ARN, and
 * configuration. If a Map Run dispatched the execution, this action returns the Map Run
 * Amazon Resource Name (ARN) in the response. The state machine returned is the state machine associated with the
 * Map Run.
 *
 * This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.
 *
 * This API action is not supported by `EXPRESS` state machines.
 */
export const describeStateMachineForExecution =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeStateMachineForExecutionInput,
    output: DescribeStateMachineForExecutionOutput,
    errors: [
      ExecutionDoesNotExist,
      InvalidArn,
      KmsAccessDeniedException,
      KmsInvalidStateException,
      KmsThrottlingException,
    ],
  }));
/**
 * Used by workers to retrieve a task (with the specified activity ARN) which has been
 * scheduled for execution by a running state machine. This initiates a long poll, where the
 * service holds the HTTP connection open and responds as soon as a task becomes available (i.e.
 * an execution of a task of this type is needed.) The maximum time the service holds on to the
 * request before responding is 60 seconds. If no task is available within 60 seconds, the poll
 * returns a `taskToken` with a null string.
 *
 * This API action isn't logged in CloudTrail.
 *
 * Workers should set their client side socket timeout to at least 65 seconds (5 seconds
 * higher than the maximum time the service may hold the poll request).
 *
 * Polling with `GetActivityTask` can cause latency in some implementations. See
 * Avoid
 * Latency When Polling for Activity Tasks in the Step Functions Developer Guide.
 */
export const getActivityTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetActivityTaskInput,
  output: GetActivityTaskOutput,
  errors: [
    ActivityDoesNotExist,
    ActivityWorkerLimitExceeded,
    InvalidArn,
    KmsAccessDeniedException,
    KmsInvalidStateException,
    KmsThrottlingException,
  ],
}));
/**
 * Lists the existing activities.
 *
 * If `nextToken` is returned, there are more results available. The value of `nextToken` is a unique pagination token for each page.
 * Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an *HTTP 400 InvalidToken* error.
 *
 * This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.
 */
export const listActivities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListActivitiesInput,
  output: ListActivitiesOutput,
  errors: [InvalidToken],
}));
/**
 * Lists all Map Runs that were started by a given state machine execution. Use this API action to obtain Map Run ARNs, and then call `DescribeMapRun` to obtain more information, if needed.
 */
export const listMapRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMapRunsInput,
  output: ListMapRunsOutput,
  errors: [ExecutionDoesNotExist, InvalidArn, InvalidToken],
}));
/**
 * Lists aliases for a specified state machine ARN. Results are sorted by time, with the most recently created aliases listed first.
 *
 * To list aliases that reference a state machine version, you can specify the version ARN in the `stateMachineArn` parameter.
 *
 * If `nextToken` is returned, there are more results available. The value of `nextToken` is a unique pagination token for each page.
 * Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an *HTTP 400 InvalidToken* error.
 *
 * **Related operations:**
 *
 * - CreateStateMachineAlias
 *
 * - DescribeStateMachineAlias
 *
 * - UpdateStateMachineAlias
 *
 * - DeleteStateMachineAlias
 */
export const listStateMachineAliases = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListStateMachineAliasesInput,
    output: ListStateMachineAliasesOutput,
    errors: [
      InvalidArn,
      InvalidToken,
      ResourceNotFound,
      StateMachineDeleting,
      StateMachineDoesNotExist,
    ],
  }),
);
/**
 * Lists the existing state machines.
 *
 * If `nextToken` is returned, there are more results available. The value of `nextToken` is a unique pagination token for each page.
 * Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an *HTTP 400 InvalidToken* error.
 *
 * This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.
 */
export const listStateMachines = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStateMachinesInput,
  output: ListStateMachinesOutput,
  errors: [InvalidToken],
}));
/**
 * Lists versions for the specified state machine Amazon Resource Name (ARN).
 *
 * The results are sorted in descending order of the version creation time.
 *
 * If `nextToken` is returned, there are more results available. The value of `nextToken` is a unique pagination token for each page.
 * Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an *HTTP 400 InvalidToken* error.
 *
 * **Related operations:**
 *
 * - PublishStateMachineVersion
 *
 * - DeleteStateMachineVersion
 */
export const listStateMachineVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListStateMachineVersionsInput,
    output: ListStateMachineVersionsOutput,
    errors: [InvalidArn, InvalidToken, ValidationException],
  }),
);
/**
 * Creates a version from the
 * current revision of a state machine. Use versions to create immutable snapshots of your state
 * machine. You can start executions from versions either directly or with an alias. To create an
 * alias, use CreateStateMachineAlias.
 *
 * You can publish up to 1000 versions for each state machine. You must manually delete unused versions using the DeleteStateMachineVersion API action.
 *
 * `PublishStateMachineVersion` is an idempotent API. It doesn't create a
 * duplicate state machine version if it already exists for the current revision. Step Functions bases `PublishStateMachineVersion`'s idempotency check on the
 * `stateMachineArn`, `name`, and `revisionId` parameters.
 * Requests with the same parameters return a successful idempotent response. If you don't
 * specify a `revisionId`, Step Functions checks for a previously published
 * version of the state machine's current revision.
 *
 * **Related operations:**
 *
 * - DeleteStateMachineVersion
 *
 * - ListStateMachineVersions
 */
export const publishStateMachineVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PublishStateMachineVersionInput,
    output: PublishStateMachineVersionOutput,
    errors: [
      ConflictException,
      InvalidArn,
      ServiceQuotaExceededException,
      StateMachineDeleting,
      StateMachineDoesNotExist,
      ValidationException,
    ],
  }),
);
/**
 * Used by activity workers, Task states using the callback
 * pattern, and optionally Task states using the job run pattern to report that the task identified by the `taskToken` failed.
 *
 * For an execution with encryption enabled, Step Functions will encrypt the error and cause fields using the KMS key for the execution role.
 *
 * A caller can mark a task as fail without using any KMS permissions in the execution role if the caller provides a null value for both `error` and `cause` fields because no data needs to be encrypted.
 */
export const sendTaskFailure = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendTaskFailureInput,
  output: SendTaskFailureOutput,
  errors: [
    InvalidToken,
    KmsAccessDeniedException,
    KmsInvalidStateException,
    KmsThrottlingException,
    TaskDoesNotExist,
    TaskTimedOut,
  ],
}));
/**
 * Used by activity workers and Task states using the callback
 * pattern, and optionally Task states using the job run pattern to report to Step Functions that the task represented by the specified
 * `taskToken` is still making progress. This action resets the
 * `Heartbeat` clock. The `Heartbeat` threshold is specified in the state
 * machine's Amazon States Language definition (`HeartbeatSeconds`). This action does not in itself
 * create an event in the execution history. However, if the task times out, the execution
 * history contains an `ActivityTimedOut` entry for activities, or a
 * `TaskTimedOut` entry for tasks using the job run or
 * callback
 * pattern.
 *
 * The `Timeout` of a task, defined in the state machine's Amazon States Language definition, is
 * its maximum allowed duration, regardless of the number of SendTaskHeartbeat requests received. Use `HeartbeatSeconds` to configure the timeout interval
 * for heartbeats.
 */
export const sendTaskHeartbeat = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendTaskHeartbeatInput,
  output: SendTaskHeartbeatOutput,
  errors: [InvalidToken, TaskDoesNotExist, TaskTimedOut],
}));
/**
 * Used by activity workers, Task states using the callback
 * pattern, and optionally Task states using the job run pattern to report that the task identified by the `taskToken` completed
 * successfully.
 */
export const sendTaskSuccess = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendTaskSuccessInput,
  output: SendTaskSuccessOutput,
  errors: [
    InvalidOutput,
    InvalidToken,
    KmsAccessDeniedException,
    KmsInvalidStateException,
    KmsThrottlingException,
    TaskDoesNotExist,
    TaskTimedOut,
  ],
}));
/**
 * Starts a Synchronous Express state machine execution. `StartSyncExecution`
 * is not available for `STANDARD` workflows.
 *
 * `StartSyncExecution` will return a `200 OK` response, even if your
 * execution fails, because the status code in the API response doesn't reflect function
 * errors. Error codes are reserved for errors that prevent your execution from running, such
 * as permissions errors, limit errors, or issues with your state machine code and
 * configuration.
 *
 * This API action isn't logged in CloudTrail.
 */
export const startSyncExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSyncExecutionInput,
  output: StartSyncExecutionOutput,
  errors: [
    InvalidArn,
    InvalidExecutionInput,
    InvalidName,
    KmsAccessDeniedException,
    KmsInvalidStateException,
    KmsThrottlingException,
    StateMachineDeleting,
    StateMachineDoesNotExist,
    StateMachineTypeNotSupported,
  ],
}));
/**
 * Stops an execution.
 *
 * This API action is not supported by `EXPRESS` state machines.
 *
 * For an execution with encryption enabled, Step Functions will encrypt the error and cause fields using the KMS key for the execution role.
 *
 * A caller can stop an execution without using any KMS permissions in the execution role if the caller provides a null value for both `error` and `cause` fields because no data needs to be encrypted.
 */
export const stopExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopExecutionInput,
  output: StopExecutionOutput,
  errors: [
    ExecutionDoesNotExist,
    InvalidArn,
    KmsAccessDeniedException,
    KmsInvalidStateException,
    KmsThrottlingException,
    ValidationException,
  ],
}));
/**
 * Add a tag to a Step Functions resource.
 *
 * An array of key-value pairs. For more information, see Using
 * Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User
 * Guide, and Controlling Access Using IAM
 * Tags.
 *
 * Tags may only contain Unicode letters, digits, white space, or these symbols: `_ . : / = + - @`.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [InvalidArn, ResourceNotFound, TooManyTags],
}));
/**
 * Updates the configuration of an existing state machine alias by modifying its `description` or `routingConfiguration`.
 *
 * You must specify at least one of the `description` or `routingConfiguration` parameters to update a state machine alias.
 *
 * `UpdateStateMachineAlias` is an idempotent API. Step Functions bases the
 * idempotency check on the `stateMachineAliasArn`, `description`, and
 * `routingConfiguration` parameters. Requests with the same parameters return an
 * idempotent response.
 *
 * This operation is eventually consistent. All StartExecution requests
 * made within a few seconds use the latest alias configuration. Executions started immediately
 * after calling `UpdateStateMachineAlias` may use the previous routing
 * configuration.
 *
 * **Related operations:**
 *
 * - CreateStateMachineAlias
 *
 * - DescribeStateMachineAlias
 *
 * - ListStateMachineAliases
 *
 * - DeleteStateMachineAlias
 */
export const updateStateMachineAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateStateMachineAliasInput,
    output: UpdateStateMachineAliasOutput,
    errors: [
      ConflictException,
      InvalidArn,
      ResourceNotFound,
      StateMachineDeleting,
      ValidationException,
    ],
  }),
);
/**
 * Validates the syntax of a state machine definition specified in Amazon States Language (ASL), a
 * JSON-based, structured language.
 *
 * You can validate that a state machine definition is correct without creating a state
 * machine resource.
 *
 * Suggested uses for `ValidateStateMachineDefinition`:
 *
 * - Integrate automated checks into your code review or Continuous Integration
 * (CI) process to check state machine definitions before starting
 * deployments.
 *
 * - Run validation from a Git pre-commit hook to verify the definition before
 * committing to your source repository.
 *
 * Validation will look for problems in your state machine definition and return a
 * **result** and a list of diagnostic
 * elements.
 *
 * The **result** value will be `OK` when your
 * workflow definition can be successfully created or updated. Note the result can be
 * `OK` even when diagnostic warnings are present in the response. The
 * **result** value will be `FAIL` when the
 * workflow definition contains errors that would prevent you from creating or updating
 * your state machine.
 *
 * The list of ValidateStateMachineDefinitionDiagnostic data elements can contain zero or more **WARNING** and/or **ERROR** elements.
 *
 * The **ValidateStateMachineDefinition API** might add
 * new diagnostics in the future, adjust diagnostic codes, or change the message
 * wording. Your automated processes should only rely on the value of the **result** field value (OK, FAIL). Do **not** rely on the exact order, count, or
 * wording of diagnostic messages.
 */
export const validateStateMachineDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ValidateStateMachineDefinitionInput,
    output: ValidateStateMachineDefinitionOutput,
    errors: [ValidationException],
  }));
/**
 * Creates an alias for a state machine that points to one or two versions of the same state machine. You can set your application to call StartExecution with an alias and update the version the alias uses without changing the client's code.
 *
 * You can also map an alias to split StartExecution requests between two
 * versions of a state machine. To do this, add a second `RoutingConfig` object in the
 * `routingConfiguration` parameter. You must also specify the percentage of
 * execution run requests each version should receive in both `RoutingConfig` objects.
 * Step Functions randomly chooses which version runs a given execution based on the
 * percentage you specify.
 *
 * To create an alias that points to a single version, specify a single
 * `RoutingConfig` object with a `weight` set to 100.
 *
 * You can create up to 100 aliases for each state machine. You must delete unused aliases using the DeleteStateMachineAlias API action.
 *
 * `CreateStateMachineAlias` is an idempotent API. Step Functions bases the
 * idempotency check on the `stateMachineArn`, `description`,
 * `name`, and `routingConfiguration` parameters. Requests that contain
 * the same values for these parameters return a successful idempotent response without creating
 * a duplicate resource.
 *
 * **Related operations:**
 *
 * - DescribeStateMachineAlias
 *
 * - ListStateMachineAliases
 *
 * - UpdateStateMachineAlias
 *
 * - DeleteStateMachineAlias
 */
export const createStateMachineAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateStateMachineAliasInput,
    output: CreateStateMachineAliasOutput,
    errors: [
      ConflictException,
      InvalidArn,
      InvalidName,
      ResourceNotFound,
      ServiceQuotaExceededException,
      StateMachineDeleting,
      ValidationException,
    ],
  }),
);
/**
 * Provides information about a state machine's definition, its IAM role Amazon Resource Name (ARN), and configuration.
 *
 * A qualified state machine ARN can either refer to a *Distributed Map state* defined within a state machine, a version ARN, or an alias ARN.
 *
 * The following are some examples of qualified and unqualified state machine ARNs:
 *
 * - The following qualified state machine ARN refers to a *Distributed Map state* with a label `mapStateLabel` in a state machine named `myStateMachine`.
 *
 * `arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel`
 *
 * If you provide a qualified state machine ARN that refers to a *Distributed Map state*, the request fails with `ValidationException`.
 *
 * - The following qualified state machine ARN refers to an alias named `PROD`.
 *
 * `arn::states:::stateMachine:`
 *
 * If you provide a qualified state machine ARN that refers to a version ARN or an alias ARN, the request starts execution for that version or alias.
 *
 * - The following unqualified state machine ARN refers to a state machine named `myStateMachine`.
 *
 * `arn::states:::stateMachine:`
 *
 * This API action returns the details for a state machine version if the
 * `stateMachineArn` you specify is a state machine version ARN.
 *
 * This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.
 */
export const describeStateMachine = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStateMachineInput,
    output: DescribeStateMachineOutput,
    errors: [
      InvalidArn,
      KmsAccessDeniedException,
      KmsInvalidStateException,
      KmsThrottlingException,
      StateMachineDoesNotExist,
    ],
  }),
);
/**
 * Lists all executions of a state machine or a Map Run. You can list all executions related to a state machine by specifying a state machine Amazon Resource Name (ARN), or those related to a Map Run by specifying a Map Run ARN. Using this API action, you can also list all redriven executions.
 *
 * You can also provide a state machine alias ARN or version ARN to list the executions associated with a specific alias or version.
 *
 * Results are
 * sorted by time, with the most recent execution first.
 *
 * If `nextToken` is returned, there are more results available. The value of `nextToken` is a unique pagination token for each page.
 * Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an *HTTP 400 InvalidToken* error.
 *
 * This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.
 *
 * This API action is not supported by `EXPRESS` state machines.
 */
export const listExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExecutionsInput,
  output: ListExecutionsOutput,
  errors: [
    InvalidArn,
    InvalidToken,
    ResourceNotFound,
    StateMachineDoesNotExist,
    StateMachineTypeNotSupported,
    ValidationException,
  ],
}));
/**
 * Restarts unsuccessful executions of Standard workflows that didn't complete successfully in the last 14 days. These include failed, aborted, or timed out executions. When you redrive an execution, it continues the failed execution from the unsuccessful step and uses the same input. Step Functions preserves the results and execution history of the successful steps, and doesn't rerun these steps when you redrive an execution. Redriven executions use the same state machine definition and execution ARN as the original execution attempt.
 *
 * For workflows that include an Inline Map or Parallel state, `RedriveExecution` API action reschedules and redrives only the iterations and branches that failed or aborted.
 *
 * To redrive a workflow that includes a Distributed Map state whose Map Run failed, you must redrive the parent workflow. The parent workflow redrives all the unsuccessful states, including a failed Map Run. If a Map Run was not started in the original execution attempt, the redriven parent workflow starts the Map Run.
 *
 * This API action is not supported by `EXPRESS` state machines.
 *
 * However, you can restart the unsuccessful executions of Express child workflows in a Distributed Map by redriving its Map Run. When you redrive a Map Run, the Express child workflows are rerun using the StartExecution API action. For more information, see Redriving Map Runs.
 *
 * You can redrive executions if your original execution meets the following conditions:
 *
 * - The execution status isn't `SUCCEEDED`.
 *
 * - Your workflow execution has not exceeded the redrivable period of 14 days. Redrivable period refers to the time during which you can redrive a given execution. This period starts from the day a state machine completes its execution.
 *
 * - The workflow execution has not exceeded the maximum open time of one year. For more information about state machine quotas, see Quotas related to state machine executions.
 *
 * - The execution event history count is less than 24,999. Redriven executions append their event history to the existing event history. Make sure your workflow execution contains less than 24,999 events to accommodate the `ExecutionRedriven` history event and at least one other history event.
 */
export const redriveExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RedriveExecutionInput,
  output: RedriveExecutionOutput,
  errors: [
    ExecutionDoesNotExist,
    ExecutionLimitExceeded,
    ExecutionNotRedrivable,
    InvalidArn,
    ValidationException,
  ],
}));
/**
 * Starts a state machine execution.
 *
 * A qualified state machine ARN can either refer to a *Distributed Map state* defined within a state machine, a version ARN, or an alias ARN.
 *
 * The following are some examples of qualified and unqualified state machine ARNs:
 *
 * - The following qualified state machine ARN refers to a *Distributed Map state* with a label `mapStateLabel` in a state machine named `myStateMachine`.
 *
 * `arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel`
 *
 * If you provide a qualified state machine ARN that refers to a *Distributed Map state*, the request fails with `ValidationException`.
 *
 * - The following qualified state machine ARN refers to an alias named `PROD`.
 *
 * `arn::states:::stateMachine:`
 *
 * If you provide a qualified state machine ARN that refers to a version ARN or an alias ARN, the request starts execution for that version or alias.
 *
 * - The following unqualified state machine ARN refers to a state machine named `myStateMachine`.
 *
 * `arn::states:::stateMachine:`
 *
 * If you start an execution with an unqualified state machine ARN, Step Functions uses the latest revision of the state machine for the execution.
 *
 * To start executions of a state machine version, call
 * `StartExecution` and provide the version ARN or the ARN of an alias that points to the version.
 *
 * `StartExecution` is idempotent for `STANDARD` workflows. For a
 * `STANDARD` workflow, if you call `StartExecution` with the same name
 * and input as a running execution, the call succeeds and return the same response as the
 * original request. If the execution is closed or if the input is different, it returns a
 * `400 ExecutionAlreadyExists` error. You can reuse names after 90 days.
 *
 * `StartExecution` isn't idempotent for `EXPRESS` workflows.
 */
export const startExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExecutionInput,
  output: StartExecutionOutput,
  errors: [
    ExecutionAlreadyExists,
    ExecutionLimitExceeded,
    InvalidArn,
    InvalidExecutionInput,
    InvalidName,
    KmsAccessDeniedException,
    KmsInvalidStateException,
    KmsThrottlingException,
    StateMachineDeleting,
    StateMachineDoesNotExist,
    ValidationException,
  ],
}));
/**
 * Creates an activity. An activity is a task that you write in any programming language and
 * host on any machine that has access to Step Functions. Activities must poll Step Functions using the
 * `GetActivityTask` API action and respond using `SendTask*` API
 * actions. This function lets Step Functions know the existence of your activity and returns an
 * identifier for use in a state machine and when polling from the activity.
 *
 * This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.
 *
 * `CreateActivity` is an idempotent API. Subsequent requests won’t create a
 * duplicate resource if it was already created. `CreateActivity`'s idempotency
 * check is based on the activity `name`. If a following request has different
 * `tags` values, Step Functions will ignore these differences and treat it as an
 * idempotent request of the previous. In this case, `tags` will not be updated,
 * even if they are different.
 */
export const createActivity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateActivityInput,
  output: CreateActivityOutput,
  errors: [
    ActivityAlreadyExists,
    ActivityLimitExceeded,
    InvalidEncryptionConfiguration,
    InvalidName,
    KmsAccessDeniedException,
    KmsThrottlingException,
    TooManyTags,
  ],
}));
/**
 * Returns the history of the specified execution as a list of events. By default, the
 * results are returned in ascending order of the `timeStamp` of the events. Use the
 * `reverseOrder` parameter to get the latest events first.
 *
 * If `nextToken` is returned, there are more results available. The value of `nextToken` is a unique pagination token for each page.
 * Make the call again using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an *HTTP 400 InvalidToken* error.
 *
 * This API action is not supported by `EXPRESS` state machines.
 */
export const getExecutionHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExecutionHistoryInput,
  output: GetExecutionHistoryOutput,
  errors: [
    ExecutionDoesNotExist,
    InvalidArn,
    InvalidToken,
    KmsAccessDeniedException,
    KmsInvalidStateException,
    KmsThrottlingException,
  ],
}));
/**
 * Accepts the definition of a single state and executes it. You can test a state without creating a state machine or updating an existing state machine. Using this API, you can test the following:
 *
 * - A state's input and output processing data flow
 *
 * - An Amazon Web Services service integration request and response
 *
 * - An HTTP Task request and response
 *
 * You can call this API on only one state at a time. The states that you can test include the following:
 *
 * - All Task types except Activity
 *
 * - Pass
 *
 * - Wait
 *
 * - Choice
 *
 * - Succeed
 *
 * - Fail
 *
 * The `TestState` API assumes an IAM role which must contain the required IAM permissions for the resources your state is accessing. For information about the permissions a state might need, see IAM permissions to test a state.
 *
 * The `TestState` API can run for up to five minutes. If the execution of a state exceeds this duration, it fails with the `States.Timeout` error.
 *
 * `TestState` only supports the following when a mock is specified: Activity tasks, `.sync` or `.waitForTaskToken`
 * service integration patterns, Parallel, or Map states.
 */
export const testState = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestStateInput,
  output: TestStateOutput,
  errors: [
    InvalidArn,
    InvalidDefinition,
    InvalidExecutionInput,
    ValidationException,
  ],
}));
/**
 * Updates an existing state machine by modifying its `definition`,
 * `roleArn`, `loggingConfiguration`, or `EncryptionConfiguration`. Running executions will continue
 * to use the previous `definition` and `roleArn`. You must include at
 * least one of `definition` or `roleArn` or you will receive a
 * `MissingRequiredParameter` error.
 *
 * A qualified state machine ARN refers to a *Distributed Map state* defined within a state machine. For example, the qualified state machine ARN `arn:partition:states:region:account-id:stateMachine:stateMachineName/mapStateLabel` refers to a *Distributed Map state* with a label `mapStateLabel` in the state machine named `stateMachineName`.
 *
 * A qualified state machine ARN can either refer to a *Distributed Map state* defined within a state machine, a version ARN, or an alias ARN.
 *
 * The following are some examples of qualified and unqualified state machine ARNs:
 *
 * - The following qualified state machine ARN refers to a *Distributed Map state* with a label `mapStateLabel` in a state machine named `myStateMachine`.
 *
 * `arn:partition:states:region:account-id:stateMachine:myStateMachine/mapStateLabel`
 *
 * If you provide a qualified state machine ARN that refers to a *Distributed Map state*, the request fails with `ValidationException`.
 *
 * - The following qualified state machine ARN refers to an alias named `PROD`.
 *
 * `arn::states:::stateMachine:`
 *
 * If you provide a qualified state machine ARN that refers to a version ARN or an alias ARN, the request starts execution for that version or alias.
 *
 * - The following unqualified state machine ARN refers to a state machine named `myStateMachine`.
 *
 * `arn::states:::stateMachine:`
 *
 * After you update your state machine, you can set the `publish` parameter to
 * `true` in the same action to publish a new version. This
 * way, you can opt-in to strict versioning of your state machine.
 *
 * Step Functions assigns monotonically increasing integers for state machine versions, starting at version number 1.
 *
 * All `StartExecution` calls within a few seconds use the updated
 * `definition` and `roleArn`. Executions started immediately after you
 * call `UpdateStateMachine` may use the previous state machine
 * `definition` and `roleArn`.
 */
export const updateStateMachine = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStateMachineInput,
  output: UpdateStateMachineOutput,
  errors: [
    ConflictException,
    InvalidArn,
    InvalidDefinition,
    InvalidEncryptionConfiguration,
    InvalidLoggingConfiguration,
    InvalidTracingConfiguration,
    KmsAccessDeniedException,
    KmsThrottlingException,
    MissingRequiredParameter,
    ServiceQuotaExceededException,
    StateMachineDeleting,
    StateMachineDoesNotExist,
    ValidationException,
  ],
}));
/**
 * Creates a state machine. A state machine consists of a collection of states that can do
 * work (`Task` states), determine to which states to transition next
 * (`Choice` states), stop an execution with an error (`Fail` states),
 * and so on. State machines are specified using a JSON-based, structured language. For more
 * information, see Amazon States
 * Language in the Step Functions User Guide.
 *
 * If you set the `publish` parameter of this API action to `true`, it
 * publishes version `1` as the first revision of the state machine.
 *
 * For additional control over security, you can encrypt your data using a **customer-managed key** for Step Functions state machines. You can configure a symmetric KMS key and data key reuse period when creating or updating a **State Machine**. The execution history and state machine definition will be encrypted with the key applied to the State Machine.
 *
 * This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.
 *
 * `CreateStateMachine` is an idempotent API. Subsequent requests won’t create a
 * duplicate resource if it was already created. `CreateStateMachine`'s idempotency
 * check is based on the state machine `name`, `definition`,
 * `type`, `LoggingConfiguration`,
 * `TracingConfiguration`, and `EncryptionConfiguration` The check is also based on the `publish` and `versionDescription` parameters. If a following request has a different
 * `roleArn` or `tags`, Step Functions will ignore these differences and treat
 * it as an idempotent request of the previous. In this case, `roleArn` and
 * `tags` will not be updated, even if they are different.
 */
export const createStateMachine = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStateMachineInput,
  output: CreateStateMachineOutput,
  errors: [
    ConflictException,
    InvalidArn,
    InvalidDefinition,
    InvalidEncryptionConfiguration,
    InvalidLoggingConfiguration,
    InvalidName,
    InvalidTracingConfiguration,
    KmsAccessDeniedException,
    KmsThrottlingException,
    StateMachineAlreadyExists,
    StateMachineDeleting,
    StateMachineLimitExceeded,
    StateMachineTypeNotSupported,
    TooManyTags,
    ValidationException,
  ],
}));
