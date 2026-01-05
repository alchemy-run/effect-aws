import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "CodeGuruProfiler",
  serviceShapeName: "CodeGuruProfiler",
});
const auth = T.AwsAuthSigv4({ name: "codeguru-profiler" });
const ver = T.ServiceVersion("2019-07-18");
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
                        url: "https://codeguru-profiler-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://codeguru-profiler-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://codeguru-profiler.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://codeguru-profiler.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const Principals = S.Array(S.String);
export class GetFindingsReportAccountSummaryRequest extends S.Class<GetFindingsReportAccountSummaryRequest>(
  "GetFindingsReportAccountSummaryRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    dailyReportsOnly: S.optional(S.Boolean).pipe(
      T.HttpQuery("dailyReportsOnly"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/internal/findingsReports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export class DescribeProfilingGroupRequest extends S.Class<DescribeProfilingGroupRequest>(
  "DescribeProfilingGroupRequest",
)(
  { profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")) },
  T.all(
    T.Http({ method: "GET", uri: "/profilingGroups/{profilingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AgentOrchestrationConfig extends S.Class<AgentOrchestrationConfig>(
  "AgentOrchestrationConfig",
)({ profilingEnabled: S.Boolean }) {}
export class UpdateProfilingGroupRequest extends S.Class<UpdateProfilingGroupRequest>(
  "UpdateProfilingGroupRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    agentOrchestrationConfig: AgentOrchestrationConfig,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/profilingGroups/{profilingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProfilingGroupRequest extends S.Class<DeleteProfilingGroupRequest>(
  "DeleteProfilingGroupRequest",
)(
  { profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/profilingGroups/{profilingGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProfilingGroupResponse extends S.Class<DeleteProfilingGroupResponse>(
  "DeleteProfilingGroupResponse",
)({}) {}
export class ListProfilingGroupsRequest extends S.Class<ListProfilingGroupsRequest>(
  "ListProfilingGroupsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    includeDescription: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeDescription"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/profilingGroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNotificationConfigurationRequest extends S.Class<GetNotificationConfigurationRequest>(
  "GetNotificationConfigurationRequest",
)(
  { profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/profilingGroups/{profilingGroupName}/notificationConfiguration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPolicyRequest extends S.Class<GetPolicyRequest>(
  "GetPolicyRequest",
)(
  { profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/profilingGroups/{profilingGroupName}/policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProfileRequest extends S.Class<GetProfileRequest>(
  "GetProfileRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("startTime"),
    ),
    period: S.optional(S.String).pipe(T.HttpQuery("period")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("endTime"),
    ),
    maxDepth: S.optional(S.Number).pipe(T.HttpQuery("maxDepth")),
    accept: S.optional(S.String).pipe(T.HttpHeader("Accept")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/profilingGroups/{profilingGroupName}/profile",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecommendationsRequest extends S.Class<GetRecommendationsRequest>(
  "GetRecommendationsRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.HttpQuery("endTime"),
    ),
    locale: S.optional(S.String).pipe(T.HttpQuery("locale")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/internal/profilingGroups/{profilingGroupName}/recommendations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFindingsReportsRequest extends S.Class<ListFindingsReportsRequest>(
  "ListFindingsReportsRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.HttpQuery("endTime"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    dailyReportsOnly: S.optional(S.Boolean).pipe(
      T.HttpQuery("dailyReportsOnly"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/internal/profilingGroups/{profilingGroupName}/findingsReports",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProfileTimesRequest extends S.Class<ListProfileTimesRequest>(
  "ListProfileTimesRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.HttpQuery("endTime"),
    ),
    period: S.String.pipe(T.HttpQuery("period")),
    orderBy: S.optional(S.String).pipe(T.HttpQuery("orderBy")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/profilingGroups/{profilingGroupName}/profileTimes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PostAgentProfileRequest extends S.Class<PostAgentProfileRequest>(
  "PostAgentProfileRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    agentProfile: T.StreamingInput.pipe(T.HttpPayload()),
    profileToken: S.optional(S.String).pipe(T.HttpQuery("profileToken")),
    contentType: S.String.pipe(T.HttpHeader("Content-Type")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/profilingGroups/{profilingGroupName}/agentProfile",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PostAgentProfileResponse extends S.Class<PostAgentProfileResponse>(
  "PostAgentProfileResponse",
)({}) {}
export class PutPermissionRequest extends S.Class<PutPermissionRequest>(
  "PutPermissionRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    actionGroup: S.String.pipe(T.HttpLabel("actionGroup")),
    principals: Principals,
    revisionId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/profilingGroups/{profilingGroupName}/policy/{actionGroup}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveNotificationChannelRequest extends S.Class<RemoveNotificationChannelRequest>(
  "RemoveNotificationChannelRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    channelId: S.String.pipe(T.HttpLabel("channelId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/profilingGroups/{profilingGroupName}/notificationConfiguration/{channelId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemovePermissionRequest extends S.Class<RemovePermissionRequest>(
  "RemovePermissionRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    actionGroup: S.String.pipe(T.HttpLabel("actionGroup")),
    revisionId: S.String.pipe(T.HttpQuery("revisionId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/profilingGroups/{profilingGroupName}/policy/{actionGroup}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SubmitFeedbackRequest extends S.Class<SubmitFeedbackRequest>(
  "SubmitFeedbackRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    anomalyInstanceId: S.String.pipe(T.HttpLabel("anomalyInstanceId")),
    type: S.String,
    comment: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/internal/profilingGroups/{profilingGroupName}/anomalies/{anomalyInstanceId}/feedback",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SubmitFeedbackResponse extends S.Class<SubmitFeedbackResponse>(
  "SubmitFeedbackResponse",
)({}) {}
export const EventPublishers = S.Array(S.String);
export const ThreadStates = S.Array(S.String);
export const TagsMap = S.Record({ key: S.String, value: S.String });
export const ProfilingGroupNames = S.Array(S.String);
export class AggregatedProfileTime extends S.Class<AggregatedProfileTime>(
  "AggregatedProfileTime",
)({
  start: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  period: S.optional(S.String),
}) {}
export class ProfilingStatus extends S.Class<ProfilingStatus>(
  "ProfilingStatus",
)({
  latestAgentProfileReportedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  latestAggregatedProfile: S.optional(AggregatedProfileTime),
  latestAgentOrchestratedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class ProfilingGroupDescription extends S.Class<ProfilingGroupDescription>(
  "ProfilingGroupDescription",
)({
  name: S.optional(S.String),
  agentOrchestrationConfig: S.optional(AgentOrchestrationConfig),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  profilingStatus: S.optional(ProfilingStatus),
  computePlatform: S.optional(S.String),
  tags: S.optional(TagsMap),
}) {}
export const ProfilingGroupDescriptions = S.Array(ProfilingGroupDescription);
export class Channel extends S.Class<Channel>("Channel")({
  id: S.optional(S.String),
  uri: S.String,
  eventPublishers: EventPublishers,
}) {}
export const Channels = S.Array(Channel);
export class FrameMetric extends S.Class<FrameMetric>("FrameMetric")({
  frameName: S.String,
  type: S.String,
  threadStates: ThreadStates,
}) {}
export const FrameMetrics = S.Array(FrameMetric);
export const Metadata = S.Record({ key: S.String, value: S.String });
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagsMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export class CreateProfilingGroupRequest extends S.Class<CreateProfilingGroupRequest>(
  "CreateProfilingGroupRequest",
)(
  {
    profilingGroupName: S.String,
    computePlatform: S.optional(S.String),
    clientToken: S.String.pipe(T.HttpQuery("clientToken")),
    agentOrchestrationConfig: S.optional(AgentOrchestrationConfig),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/profilingGroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProfilingGroupResponse extends S.Class<UpdateProfilingGroupResponse>(
  "UpdateProfilingGroupResponse",
)({ profilingGroup: ProfilingGroupDescription.pipe(T.HttpPayload()) }) {}
export class ListProfilingGroupsResponse extends S.Class<ListProfilingGroupsResponse>(
  "ListProfilingGroupsResponse",
)({
  profilingGroupNames: ProfilingGroupNames,
  profilingGroups: S.optional(ProfilingGroupDescriptions),
  nextToken: S.optional(S.String),
}) {}
export class AddNotificationChannelsRequest extends S.Class<AddNotificationChannelsRequest>(
  "AddNotificationChannelsRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    channels: Channels,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/profilingGroups/{profilingGroupName}/notificationConfiguration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetFrameMetricDataRequest extends S.Class<BatchGetFrameMetricDataRequest>(
  "BatchGetFrameMetricDataRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("endTime"),
    ),
    period: S.optional(S.String).pipe(T.HttpQuery("period")),
    targetResolution: S.optional(S.String).pipe(
      T.HttpQuery("targetResolution"),
    ),
    frameMetrics: S.optional(FrameMetrics),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/profilingGroups/{profilingGroupName}/frames/-/metrics",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ConfigureAgentRequest extends S.Class<ConfigureAgentRequest>(
  "ConfigureAgentRequest",
)(
  {
    profilingGroupName: S.String.pipe(T.HttpLabel("profilingGroupName")),
    fleetInstanceId: S.optional(S.String),
    metadata: S.optional(Metadata),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/profilingGroups/{profilingGroupName}/configureAgent",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPolicyResponse extends S.Class<GetPolicyResponse>(
  "GetPolicyResponse",
)({ policy: S.String, revisionId: S.String }) {}
export class GetProfileResponse extends S.Class<GetProfileResponse>(
  "GetProfileResponse",
)({
  profile: T.StreamingOutput.pipe(T.HttpPayload()),
  contentType: S.String.pipe(T.HttpHeader("Content-Type")),
  contentEncoding: S.optional(S.String).pipe(T.HttpHeader("Content-Encoding")),
}) {}
export class FindingsReportSummary extends S.Class<FindingsReportSummary>(
  "FindingsReportSummary",
)({
  id: S.optional(S.String),
  profilingGroupName: S.optional(S.String),
  profileStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  profileEndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  totalNumberOfFindings: S.optional(S.Number),
}) {}
export const FindingsReportSummaries = S.Array(FindingsReportSummary);
export class ListFindingsReportsResponse extends S.Class<ListFindingsReportsResponse>(
  "ListFindingsReportsResponse",
)({
  findingsReportSummaries: FindingsReportSummaries,
  nextToken: S.optional(S.String),
}) {}
export class PutPermissionResponse extends S.Class<PutPermissionResponse>(
  "PutPermissionResponse",
)({ policy: S.String, revisionId: S.String }) {}
export class NotificationConfiguration extends S.Class<NotificationConfiguration>(
  "NotificationConfiguration",
)({ channels: S.optional(Channels) }) {}
export class RemoveNotificationChannelResponse extends S.Class<RemoveNotificationChannelResponse>(
  "RemoveNotificationChannelResponse",
)({ notificationConfiguration: S.optional(NotificationConfiguration) }) {}
export class RemovePermissionResponse extends S.Class<RemovePermissionResponse>(
  "RemovePermissionResponse",
)({ policy: S.String, revisionId: S.String }) {}
export class ProfileTime extends S.Class<ProfileTime>("ProfileTime")({
  start: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ProfileTimes = S.Array(ProfileTime);
export const TargetFrame = S.Array(S.String);
export const TargetFrames = S.Array(TargetFrame);
export const Strings = S.Array(S.String);
export class GetFindingsReportAccountSummaryResponse extends S.Class<GetFindingsReportAccountSummaryResponse>(
  "GetFindingsReportAccountSummaryResponse",
)({
  reportSummaries: FindingsReportSummaries,
  nextToken: S.optional(S.String),
}) {}
export class CreateProfilingGroupResponse extends S.Class<CreateProfilingGroupResponse>(
  "CreateProfilingGroupResponse",
)({ profilingGroup: ProfilingGroupDescription.pipe(T.HttpPayload()) }) {}
export class AddNotificationChannelsResponse extends S.Class<AddNotificationChannelsResponse>(
  "AddNotificationChannelsResponse",
)({ notificationConfiguration: S.optional(NotificationConfiguration) }) {}
export class GetNotificationConfigurationResponse extends S.Class<GetNotificationConfigurationResponse>(
  "GetNotificationConfigurationResponse",
)({ notificationConfiguration: NotificationConfiguration }) {}
export class ListProfileTimesResponse extends S.Class<ListProfileTimesResponse>(
  "ListProfileTimesResponse",
)({ profileTimes: ProfileTimes, nextToken: S.optional(S.String) }) {}
export const FrameMetricValues = S.Array(S.Number);
export class Pattern extends S.Class<Pattern>("Pattern")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  resolutionSteps: S.optional(S.String),
  targetFrames: S.optional(TargetFrames),
  thresholdPercent: S.optional(S.Number),
  countersToAggregate: S.optional(Strings),
}) {}
export class Match extends S.Class<Match>("Match")({
  targetFramesIndex: S.optional(S.Number),
  frameAddress: S.optional(S.String),
  thresholdBreachValue: S.optional(S.Number),
}) {}
export const Matches = S.Array(Match);
export class Metric extends S.Class<Metric>("Metric")({
  frameName: S.String,
  type: S.String,
  threadStates: Strings,
}) {}
export class TimestampStructure extends S.Class<TimestampStructure>(
  "TimestampStructure",
)({ value: S.Date.pipe(T.TimestampFormat("date-time")) }) {}
export const ListOfTimestamps = S.Array(TimestampStructure);
export const UnprocessedEndTimeMap = S.Record({
  key: S.String,
  value: ListOfTimestamps,
});
export class FrameMetricDatum extends S.Class<FrameMetricDatum>(
  "FrameMetricDatum",
)({ frameMetric: FrameMetric, values: FrameMetricValues }) {}
export const FrameMetricData = S.Array(FrameMetricDatum);
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
  allMatchesCount: S.Number,
  allMatchesSum: S.Number,
  pattern: Pattern,
  topMatches: Matches,
  startTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const Recommendations = S.Array(Recommendation);
export class UserFeedback extends S.Class<UserFeedback>("UserFeedback")({
  type: S.String,
}) {}
export class BatchGetFrameMetricDataResponse extends S.Class<BatchGetFrameMetricDataResponse>(
  "BatchGetFrameMetricDataResponse",
)({
  startTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.Date.pipe(T.TimestampFormat("date-time")),
  resolution: S.String,
  endTimes: ListOfTimestamps,
  unprocessedEndTimes: UnprocessedEndTimeMap,
  frameMetricData: FrameMetricData,
}) {}
export const AgentParameters = S.Record({ key: S.String, value: S.String });
export class AnomalyInstance extends S.Class<AnomalyInstance>(
  "AnomalyInstance",
)({
  id: S.String,
  startTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  userFeedback: S.optional(UserFeedback),
}) {}
export const AnomalyInstances = S.Array(AnomalyInstance);
export class AgentConfiguration extends S.Class<AgentConfiguration>(
  "AgentConfiguration",
)({
  shouldProfile: S.Boolean,
  periodInSeconds: S.Number,
  agentParameters: S.optional(AgentParameters),
}) {}
export class Anomaly extends S.Class<Anomaly>("Anomaly")({
  metric: Metric,
  reason: S.String,
  instances: AnomalyInstances,
}) {}
export const Anomalies = S.Array(Anomaly);
export class DescribeProfilingGroupResponse extends S.Class<DescribeProfilingGroupResponse>(
  "DescribeProfilingGroupResponse",
)({ profilingGroup: ProfilingGroupDescription.pipe(T.HttpPayload()) }) {}
export class ConfigureAgentResponse extends S.Class<ConfigureAgentResponse>(
  "ConfigureAgentResponse",
)({ configuration: AgentConfiguration.pipe(T.HttpPayload()) }) {}
export class GetRecommendationsResponse extends S.Class<GetRecommendationsResponse>(
  "GetRecommendationsResponse",
)({
  profilingGroupName: S.String,
  profileStartTime: S.Date.pipe(T.TimestampFormat("date-time")),
  profileEndTime: S.Date.pipe(T.TimestampFormat("date-time")),
  recommendations: Recommendations,
  anomalies: Anomalies,
}) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
  T.Retryable(),
) {}

//# Operations
/**
 * Returns a list of profiling groups. The profiling groups are returned as
 *
 * `ProfilingGroupDescription`
 *
 * objects.
 */
export const listProfilingGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProfilingGroupsRequest,
  output: ListProfilingGroupsResponse,
  errors: [InternalServerException, ThrottlingException],
}));
/**
 * Returns the JSON-formatted resource-based policy on a profiling group.
 */
export const getPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Use to remove one or more tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a profiling group.
 */
export const createProfilingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProfilingGroupRequest,
    output: CreateProfilingGroupResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns the time series of values for a requested list
 * of frame metrics from a time period.
 */
export const batchGetFrameMetricData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetFrameMetricDataRequest,
    output: BatchGetFrameMetricDataResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Get the current configuration for anomaly notifications for a profiling group.
 */
export const getNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetNotificationConfigurationRequest,
    output: GetNotificationConfigurationResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the start times of the available aggregated profiles of a profiling group
 * for an aggregation period within the specified time range.
 */
export const listProfileTimes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProfileTimesRequest,
  output: ListProfileTimesResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a profiling group.
 */
export const deleteProfilingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProfilingGroupRequest,
    output: DeleteProfilingGroupResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the aggregated profile of a profiling group for a specified time range.
 * Amazon CodeGuru Profiler collects posted agent profiles for a profiling group
 * into aggregated profiles.
 *
 * Because aggregated profiles expire over time `GetProfile` is not idempotent.
 *
 * Specify the time range for the requested aggregated profile using 1 or 2 of the following parameters: `startTime`,
 * `endTime`, `period`. The maximum time range allowed is 7 days. If you specify all 3 parameters,
 * an exception is thrown. If you specify only `period`, the latest aggregated profile is returned.
 *
 * Aggregated profiles are available with aggregation periods of 5 minutes, 1 hour, and 1 day, aligned to
 * UTC. The aggregation period of an aggregated profile determines how long it is retained. For more
 * information, see
 * `AggregatedProfileTime`
 * . The aggregated profile's aggregation period determines how long
 * it is retained by CodeGuru Profiler.
 *
 * - If the aggregation period is 5 minutes, the aggregated profile is retained for 15 days.
 *
 * - If the aggregation period is 1 hour, the aggregated profile is retained for 60 days.
 *
 * - If the aggregation period is 1 day, the aggregated profile is retained for 3 years.
 *
 * There are two use cases for calling `GetProfile`.
 *
 * - If you want to return an aggregated profile that already exists, use
 *
 * `ListProfileTimes`
 * to
 * view the time ranges of existing aggregated profiles. Use them in a `GetProfile` request to return a specific,
 * existing aggregated profile.
 *
 * - If you want to return an aggregated profile for a time range that doesn't align with an existing aggregated profile,
 * then CodeGuru Profiler makes a best effort to combine existing aggregated profiles from the requested time
 * range and return them as one aggregated profile.
 *
 * If aggregated profiles do not exist for the full time range requested, then
 * aggregated profiles for a smaller time range are returned. For example, if the
 * requested time range is from 00:00 to 00:20, and the existing aggregated profiles are
 * from 00:15 and 00:25, then the aggregated profiles from 00:15 to 00:20 are returned.
 */
export const getProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileRequest,
  output: GetProfileResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List the available reports for a given profiling group and time range.
 */
export const listFindingsReports = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFindingsReportsRequest,
  output: ListFindingsReportsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds permissions to a profiling group's resource-based policy
 * that are provided using an action group. If a profiling group doesn't have
 * a resource-based policy, one is created for it using the permissions in the action group and
 * the roles and users in the `principals` parameter.
 *
 * The one supported action group that can be added is `agentPermission`
 * which grants `ConfigureAgent` and `PostAgent` permissions. For
 * more information, see Resource-based
 * policies in CodeGuru Profiler in the Amazon CodeGuru Profiler User
 * Guide,
 * `ConfigureAgent`
 * , and
 * `PostAgentProfile`
 * .
 *
 * The first time you call `PutPermission` on a profiling group, do not specify a `revisionId` because
 * it doesn't have a resource-based policy. Subsequent calls must provide a `revisionId` to specify
 * which revision of the resource-based policy to add the permissions to.
 *
 * The response contains the profiling group's JSON-formatted resource policy.
 */
export const putPermission = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPermissionRequest,
  output: PutPermissionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Remove one anomaly notifications channel for a profiling group.
 */
export const removeNotificationChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveNotificationChannelRequest,
    output: RemoveNotificationChannelResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Removes permissions from a profiling group's resource-based policy that are provided
 * using an action group. The one supported action group that can be removed is
 * `agentPermission` which grants `ConfigureAgent` and
 * `PostAgent` permissions. For more information, see Resource-based policies in CodeGuru Profiler in the Amazon
 * CodeGuru Profiler User Guide,
 * `ConfigureAgent`
 * , and
 * `PostAgentProfile`
 * .
 */
export const removePermission = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemovePermissionRequest,
  output: RemovePermissionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Submits profiling data to an aggregated profile of a profiling group. To get an
 * aggregated profile that is created with this profiling data, use
 *
 * `GetProfile`
 * .
 */
export const postAgentProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PostAgentProfileRequest,
  output: PostAgentProfileResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends feedback to CodeGuru Profiler about whether the anomaly detected by the analysis is
 * useful or not.
 */
export const submitFeedback = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitFeedbackRequest,
  output: SubmitFeedbackResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the tags that are assigned to a specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Use to assign one or more tags to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a profiling group.
 */
export const updateProfilingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProfilingGroupRequest,
    output: UpdateProfilingGroupResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of
 *
 * `FindingsReportSummary`
 *
 * objects that contain analysis results for all profiling groups in your AWS account.
 */
export const getFindingsReportAccountSummary =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetFindingsReportAccountSummaryRequest,
    output: GetFindingsReportAccountSummaryResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
  }));
/**
 * Add up to 2 anomaly notifications channels for a profiling group.
 */
export const addNotificationChannels = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddNotificationChannelsRequest,
    output: AddNotificationChannelsResponse,
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
/**
 * Returns a
 * `ProfilingGroupDescription`
 *
 * object that contains information about the requested profiling group.
 */
export const describeProfilingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeProfilingGroupRequest,
    output: DescribeProfilingGroupResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Used by profiler agents to report their current state and to receive remote
 * configuration updates. For example, `ConfigureAgent` can be used
 * to tell an agent whether to profile or not and for how long to return profiling data.
 */
export const configureAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfigureAgentRequest,
  output: ConfigureAgentResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of
 *
 * `Recommendation`
 *
 * objects that contain recommendations for a profiling group for a given time period. A list of
 *
 * `Anomaly`
 *
 * objects that contains details about anomalies detected in the profiling group for the same time period is also
 * returned.
 */
export const getRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecommendationsRequest,
  output: GetRecommendationsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
