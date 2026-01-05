import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Application Insights",
  serviceShapeName: "EC2WindowsBarleyService",
});
const auth = T.AwsAuthSigv4({ name: "applicationinsights" });
const ver = T.ServiceVersion("2018-11-25");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://applicationinsights-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://applicationinsights-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://applicationinsights.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://applicationinsights.{Region}.{PartitionResult#dnsSuffix}",
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
export const ResourceList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CreateComponentRequest extends S.Class<CreateComponentRequest>(
  "CreateComponentRequest",
)(
  {
    ResourceGroupName: S.String,
    ComponentName: S.String,
    ResourceList: ResourceList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateComponentResponse extends S.Class<CreateComponentResponse>(
  "CreateComponentResponse",
)({}) {}
export class CreateLogPatternRequest extends S.Class<CreateLogPatternRequest>(
  "CreateLogPatternRequest",
)(
  {
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
    Pattern: S.String,
    Rank: S.Number,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationRequest extends S.Class<DeleteApplicationRequest>(
  "DeleteApplicationRequest",
)(
  { ResourceGroupName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({}) {}
export class DeleteComponentRequest extends S.Class<DeleteComponentRequest>(
  "DeleteComponentRequest",
)(
  { ResourceGroupName: S.String, ComponentName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteComponentResponse extends S.Class<DeleteComponentResponse>(
  "DeleteComponentResponse",
)({}) {}
export class DeleteLogPatternRequest extends S.Class<DeleteLogPatternRequest>(
  "DeleteLogPatternRequest",
)(
  {
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLogPatternResponse extends S.Class<DeleteLogPatternResponse>(
  "DeleteLogPatternResponse",
)({}) {}
export class DescribeApplicationRequest extends S.Class<DescribeApplicationRequest>(
  "DescribeApplicationRequest",
)(
  { ResourceGroupName: S.String, AccountId: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeComponentRequest extends S.Class<DescribeComponentRequest>(
  "DescribeComponentRequest",
)(
  {
    ResourceGroupName: S.String,
    ComponentName: S.String,
    AccountId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeComponentConfigurationRequest extends S.Class<DescribeComponentConfigurationRequest>(
  "DescribeComponentConfigurationRequest",
)(
  {
    ResourceGroupName: S.String,
    ComponentName: S.String,
    AccountId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeComponentConfigurationRecommendationRequest extends S.Class<DescribeComponentConfigurationRecommendationRequest>(
  "DescribeComponentConfigurationRecommendationRequest",
)(
  {
    ResourceGroupName: S.String,
    ComponentName: S.String,
    Tier: S.String,
    WorkloadName: S.optional(S.String),
    RecommendationType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLogPatternRequest extends S.Class<DescribeLogPatternRequest>(
  "DescribeLogPatternRequest",
)(
  {
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
    AccountId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeObservationRequest extends S.Class<DescribeObservationRequest>(
  "DescribeObservationRequest",
)(
  { ObservationId: S.String, AccountId: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProblemRequest extends S.Class<DescribeProblemRequest>(
  "DescribeProblemRequest",
)(
  { ProblemId: S.String, AccountId: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProblemObservationsRequest extends S.Class<DescribeProblemObservationsRequest>(
  "DescribeProblemObservationsRequest",
)(
  { ProblemId: S.String, AccountId: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeWorkloadRequest extends S.Class<DescribeWorkloadRequest>(
  "DescribeWorkloadRequest",
)(
  {
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadId: S.String,
    AccountId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListComponentsRequest extends S.Class<ListComponentsRequest>(
  "ListComponentsRequest",
)(
  {
    ResourceGroupName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConfigurationHistoryRequest extends S.Class<ListConfigurationHistoryRequest>(
  "ListConfigurationHistoryRequest",
)(
  {
    ResourceGroupName: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventStatus: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLogPatternsRequest extends S.Class<ListLogPatternsRequest>(
  "ListLogPatternsRequest",
)(
  {
    ResourceGroupName: S.String,
    PatternSetName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLogPatternSetsRequest extends S.Class<ListLogPatternSetsRequest>(
  "ListLogPatternSetsRequest",
)(
  {
    ResourceGroupName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProblemsRequest extends S.Class<ListProblemsRequest>(
  "ListProblemsRequest",
)(
  {
    AccountId: S.optional(S.String),
    ResourceGroupName: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ComponentName: S.optional(S.String),
    Visibility: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWorkloadsRequest extends S.Class<ListWorkloadsRequest>(
  "ListWorkloadsRequest",
)(
  {
    ResourceGroupName: S.String,
    ComponentName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveWorkloadRequest extends S.Class<RemoveWorkloadRequest>(
  "RemoveWorkloadRequest",
)(
  {
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveWorkloadResponse extends S.Class<RemoveWorkloadResponse>(
  "RemoveWorkloadResponse",
)({}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    ResourceGroupName: S.String,
    OpsCenterEnabled: S.optional(S.Boolean),
    CWEMonitorEnabled: S.optional(S.Boolean),
    OpsItemSNSTopicArn: S.optional(S.String),
    SNSNotificationArn: S.optional(S.String),
    RemoveSNSTopic: S.optional(S.Boolean),
    AutoConfigEnabled: S.optional(S.Boolean),
    AttachMissingPermission: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateComponentRequest extends S.Class<UpdateComponentRequest>(
  "UpdateComponentRequest",
)(
  {
    ResourceGroupName: S.String,
    ComponentName: S.String,
    NewComponentName: S.optional(S.String),
    ResourceList: S.optional(ResourceList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateComponentResponse extends S.Class<UpdateComponentResponse>(
  "UpdateComponentResponse",
)({}) {}
export class UpdateComponentConfigurationRequest extends S.Class<UpdateComponentConfigurationRequest>(
  "UpdateComponentConfigurationRequest",
)(
  {
    ResourceGroupName: S.String,
    ComponentName: S.String,
    Monitor: S.optional(S.Boolean),
    Tier: S.optional(S.String),
    ComponentConfiguration: S.optional(S.String),
    AutoConfigEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateComponentConfigurationResponse extends S.Class<UpdateComponentConfigurationResponse>(
  "UpdateComponentConfigurationResponse",
)({}) {}
export class UpdateLogPatternRequest extends S.Class<UpdateLogPatternRequest>(
  "UpdateLogPatternRequest",
)(
  {
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
    Pattern: S.optional(S.String),
    Rank: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProblemRequest extends S.Class<UpdateProblemRequest>(
  "UpdateProblemRequest",
)(
  {
    ProblemId: S.String,
    UpdateStatus: S.optional(S.String),
    Visibility: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProblemResponse extends S.Class<UpdateProblemResponse>(
  "UpdateProblemResponse",
)({}) {}
export class WorkloadConfiguration extends S.Class<WorkloadConfiguration>(
  "WorkloadConfiguration",
)({
  WorkloadName: S.optional(S.String),
  Tier: S.optional(S.String),
  Configuration: S.optional(S.String),
}) {}
export class UpdateWorkloadRequest extends S.Class<UpdateWorkloadRequest>(
  "UpdateWorkloadRequest",
)(
  {
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadId: S.optional(S.String),
    WorkloadConfiguration: WorkloadConfiguration,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ApplicationInfo extends S.Class<ApplicationInfo>(
  "ApplicationInfo",
)({
  AccountId: S.optional(S.String),
  ResourceGroupName: S.optional(S.String),
  LifeCycle: S.optional(S.String),
  OpsItemSNSTopicArn: S.optional(S.String),
  SNSNotificationArn: S.optional(S.String),
  OpsCenterEnabled: S.optional(S.Boolean),
  CWEMonitorEnabled: S.optional(S.Boolean),
  Remarks: S.optional(S.String),
  AutoConfigEnabled: S.optional(S.Boolean),
  DiscoveryType: S.optional(S.String),
  AttachMissingPermission: S.optional(S.Boolean),
}) {}
export const ApplicationInfoList = S.Array(ApplicationInfo);
export const WorkloadMetaData = S.Record({ key: S.String, value: S.String });
export const DetectedWorkload = S.Record({
  key: S.String,
  value: WorkloadMetaData,
});
export class ApplicationComponent extends S.Class<ApplicationComponent>(
  "ApplicationComponent",
)({
  ComponentName: S.optional(S.String),
  ComponentRemarks: S.optional(S.String),
  ResourceType: S.optional(S.String),
  OsType: S.optional(S.String),
  Tier: S.optional(S.String),
  Monitor: S.optional(S.Boolean),
  DetectedWorkload: S.optional(DetectedWorkload),
}) {}
export const ApplicationComponentList = S.Array(ApplicationComponent);
export class LogPattern extends S.Class<LogPattern>("LogPattern")({
  PatternSetName: S.optional(S.String),
  PatternName: S.optional(S.String),
  Pattern: S.optional(S.String),
  Rank: S.optional(S.Number),
}) {}
export const LogPatternList = S.Array(LogPattern);
export const LogPatternSetList = S.Array(S.String);
export const Feedback = S.Record({ key: S.String, value: S.String });
export class Problem extends S.Class<Problem>("Problem")({
  Id: S.optional(S.String),
  Title: S.optional(S.String),
  ShortName: S.optional(S.String),
  Insights: S.optional(S.String),
  Status: S.optional(S.String),
  AffectedResource: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SeverityLevel: S.optional(S.String),
  AccountId: S.optional(S.String),
  ResourceGroupName: S.optional(S.String),
  Feedback: S.optional(Feedback),
  RecurringCount: S.optional(S.Number),
  LastRecurrenceTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Visibility: S.optional(S.String),
  ResolutionMethod: S.optional(S.String),
}) {}
export const ProblemList = S.Array(Problem);
export class AddWorkloadRequest extends S.Class<AddWorkloadRequest>(
  "AddWorkloadRequest",
)(
  {
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadConfiguration: WorkloadConfiguration,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    ResourceGroupName: S.optional(S.String),
    OpsCenterEnabled: S.optional(S.Boolean),
    CWEMonitorEnabled: S.optional(S.Boolean),
    OpsItemSNSTopicArn: S.optional(S.String),
    SNSNotificationArn: S.optional(S.String),
    Tags: S.optional(TagList),
    AutoConfigEnabled: S.optional(S.Boolean),
    AutoCreate: S.optional(S.Boolean),
    GroupingType: S.optional(S.String),
    AttachMissingPermission: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeComponentConfigurationResponse extends S.Class<DescribeComponentConfigurationResponse>(
  "DescribeComponentConfigurationResponse",
)({
  Monitor: S.optional(S.Boolean),
  Tier: S.optional(S.String),
  ComponentConfiguration: S.optional(S.String),
}) {}
export class DescribeComponentConfigurationRecommendationResponse extends S.Class<DescribeComponentConfigurationRecommendationResponse>(
  "DescribeComponentConfigurationRecommendationResponse",
)({ ComponentConfiguration: S.optional(S.String) }) {}
export class DescribeLogPatternResponse extends S.Class<DescribeLogPatternResponse>(
  "DescribeLogPatternResponse",
)({
  ResourceGroupName: S.optional(S.String),
  AccountId: S.optional(S.String),
  LogPattern: S.optional(LogPattern),
}) {}
export class DescribeWorkloadResponse extends S.Class<DescribeWorkloadResponse>(
  "DescribeWorkloadResponse",
)({
  WorkloadId: S.optional(S.String),
  WorkloadRemarks: S.optional(S.String),
  WorkloadConfiguration: S.optional(WorkloadConfiguration),
}) {}
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)({
  ApplicationInfoList: S.optional(ApplicationInfoList),
  NextToken: S.optional(S.String),
}) {}
export class ListComponentsResponse extends S.Class<ListComponentsResponse>(
  "ListComponentsResponse",
)({
  ApplicationComponentList: S.optional(ApplicationComponentList),
  NextToken: S.optional(S.String),
}) {}
export class ListLogPatternsResponse extends S.Class<ListLogPatternsResponse>(
  "ListLogPatternsResponse",
)({
  ResourceGroupName: S.optional(S.String),
  AccountId: S.optional(S.String),
  LogPatterns: S.optional(LogPatternList),
  NextToken: S.optional(S.String),
}) {}
export class ListLogPatternSetsResponse extends S.Class<ListLogPatternSetsResponse>(
  "ListLogPatternSetsResponse",
)({
  ResourceGroupName: S.optional(S.String),
  AccountId: S.optional(S.String),
  LogPatternSets: S.optional(LogPatternSetList),
  NextToken: S.optional(S.String),
}) {}
export class ListProblemsResponse extends S.Class<ListProblemsResponse>(
  "ListProblemsResponse",
)({
  ProblemList: S.optional(ProblemList),
  NextToken: S.optional(S.String),
  ResourceGroupName: S.optional(S.String),
  AccountId: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)({ ApplicationInfo: S.optional(ApplicationInfo) }) {}
export class UpdateLogPatternResponse extends S.Class<UpdateLogPatternResponse>(
  "UpdateLogPatternResponse",
)({
  ResourceGroupName: S.optional(S.String),
  LogPattern: S.optional(LogPattern),
}) {}
export class UpdateWorkloadResponse extends S.Class<UpdateWorkloadResponse>(
  "UpdateWorkloadResponse",
)({
  WorkloadId: S.optional(S.String),
  WorkloadConfiguration: S.optional(WorkloadConfiguration),
}) {}
export class Observation extends S.Class<Observation>("Observation")({
  Id: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SourceType: S.optional(S.String),
  SourceARN: S.optional(S.String),
  LogGroup: S.optional(S.String),
  LineTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LogText: S.optional(S.String),
  LogFilter: S.optional(S.String),
  MetricNamespace: S.optional(S.String),
  MetricName: S.optional(S.String),
  Unit: S.optional(S.String),
  Value: S.optional(S.Number),
  CloudWatchEventId: S.optional(S.String),
  CloudWatchEventSource: S.optional(S.String),
  CloudWatchEventDetailType: S.optional(S.String),
  HealthEventArn: S.optional(S.String),
  HealthService: S.optional(S.String),
  HealthEventTypeCode: S.optional(S.String),
  HealthEventTypeCategory: S.optional(S.String),
  HealthEventDescription: S.optional(S.String),
  CodeDeployDeploymentId: S.optional(S.String),
  CodeDeployDeploymentGroup: S.optional(S.String),
  CodeDeployState: S.optional(S.String),
  CodeDeployApplication: S.optional(S.String),
  CodeDeployInstanceGroupId: S.optional(S.String),
  Ec2State: S.optional(S.String),
  RdsEventCategories: S.optional(S.String),
  RdsEventMessage: S.optional(S.String),
  S3EventName: S.optional(S.String),
  StatesExecutionArn: S.optional(S.String),
  StatesArn: S.optional(S.String),
  StatesStatus: S.optional(S.String),
  StatesInput: S.optional(S.String),
  EbsEvent: S.optional(S.String),
  EbsResult: S.optional(S.String),
  EbsCause: S.optional(S.String),
  EbsRequestId: S.optional(S.String),
  XRayFaultPercent: S.optional(S.Number),
  XRayThrottlePercent: S.optional(S.Number),
  XRayErrorPercent: S.optional(S.Number),
  XRayRequestCount: S.optional(S.Number),
  XRayRequestAverageLatency: S.optional(S.Number),
  XRayNodeName: S.optional(S.String),
  XRayNodeType: S.optional(S.String),
}) {}
export const ObservationList = S.Array(Observation);
export class RelatedObservations extends S.Class<RelatedObservations>(
  "RelatedObservations",
)({ ObservationList: S.optional(ObservationList) }) {}
export class ConfigurationEvent extends S.Class<ConfigurationEvent>(
  "ConfigurationEvent",
)({
  ResourceGroupName: S.optional(S.String),
  AccountId: S.optional(S.String),
  MonitoredResourceARN: S.optional(S.String),
  EventStatus: S.optional(S.String),
  EventResourceType: S.optional(S.String),
  EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EventDetail: S.optional(S.String),
  EventResourceName: S.optional(S.String),
}) {}
export const ConfigurationEventList = S.Array(ConfigurationEvent);
export class Workload extends S.Class<Workload>("Workload")({
  WorkloadId: S.optional(S.String),
  ComponentName: S.optional(S.String),
  WorkloadName: S.optional(S.String),
  Tier: S.optional(S.String),
  WorkloadRemarks: S.optional(S.String),
  MissingWorkloadConfig: S.optional(S.Boolean),
}) {}
export const WorkloadList = S.Array(Workload);
export class AddWorkloadResponse extends S.Class<AddWorkloadResponse>(
  "AddWorkloadResponse",
)({
  WorkloadId: S.optional(S.String),
  WorkloadConfiguration: S.optional(WorkloadConfiguration),
}) {}
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)({ ApplicationInfo: S.optional(ApplicationInfo) }) {}
export class CreateLogPatternResponse extends S.Class<CreateLogPatternResponse>(
  "CreateLogPatternResponse",
)({
  LogPattern: S.optional(LogPattern),
  ResourceGroupName: S.optional(S.String),
}) {}
export class DescribeApplicationResponse extends S.Class<DescribeApplicationResponse>(
  "DescribeApplicationResponse",
)({ ApplicationInfo: S.optional(ApplicationInfo) }) {}
export class DescribeObservationResponse extends S.Class<DescribeObservationResponse>(
  "DescribeObservationResponse",
)({ Observation: S.optional(Observation) }) {}
export class DescribeProblemObservationsResponse extends S.Class<DescribeProblemObservationsResponse>(
  "DescribeProblemObservationsResponse",
)({ RelatedObservations: S.optional(RelatedObservations) }) {}
export class ListConfigurationHistoryResponse extends S.Class<ListConfigurationHistoryResponse>(
  "ListConfigurationHistoryResponse",
)({
  EventList: S.optional(ConfigurationEventList),
  NextToken: S.optional(S.String),
}) {}
export class ListWorkloadsResponse extends S.Class<ListWorkloadsResponse>(
  "ListWorkloadsResponse",
)({
  WorkloadList: S.optional(WorkloadList),
  NextToken: S.optional(S.String),
}) {}
export class DescribeProblemResponse extends S.Class<DescribeProblemResponse>(
  "DescribeProblemResponse",
)({ Problem: S.optional(Problem), SNSNotificationArn: S.optional(S.String) }) {}
export class DescribeComponentResponse extends S.Class<DescribeComponentResponse>(
  "DescribeComponentResponse",
)({
  ApplicationComponent: S.optional(ApplicationComponent),
  ResourceList: S.optional(ResourceList),
}) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServerException", httpResponseCode: 500 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "BadRequestException", httpResponseCode: 400 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceInUseException", httpResponseCode: 400 }),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessDeniedException", httpResponseCode: 403 }),
) {}
export class TagsAlreadyExistException extends S.TaggedError<TagsAlreadyExistException>()(
  "TagsAlreadyExistException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the IDs of the applications that you are monitoring.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListApplicationsRequest,
    output: ListApplicationsResponse,
    errors: [InternalServerException, ValidationException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the INFO, WARN, and ERROR events for periodic configuration updates performed by
 * Application Insights. Examples of events represented are:
 *
 * - INFO: creating a new alarm or updating an alarm threshold.
 *
 * - WARN: alarm not created due to insufficient data points used to predict
 * thresholds.
 *
 * - ERROR: alarm not created due to permission errors or exceeding quotas.
 */
export const listConfigurationHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListConfigurationHistoryRequest,
    output: ListConfigurationHistoryResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the workloads that are configured on a given component.
 */
export const listWorkloads = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkloadsRequest,
    output: ListWorkloadsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Add one or more tags (keys and values) to a specified application. A
 * *tag* is a label that you optionally define and associate with an
 * application. Tags can help you categorize and manage application in different ways, such as
 * by purpose, owner, environment, or other criteria.
 *
 * Each tag consists of a required *tag key* and an associated
 * *tag value*, both of which you define. A tag key is a general label
 * that acts as a category for more specific tag values. A tag value acts as a descriptor
 * within a tag key.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ResourceNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Adds a log pattern to a `LogPatternSet`.
 */
export const updateLogPattern = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLogPatternRequest,
  output: UpdateLogPatternResponse,
  errors: [
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the custom component name and/or the list of resources that make up the
 * component.
 */
export const updateComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateComponentRequest,
  output: UpdateComponentResponse,
  errors: [
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the monitoring configurations for the component. The configuration input
 * parameter is an escaped JSON of the configuration and should match the schema of what is
 * returned by `DescribeComponentConfigurationRecommendation`.
 */
export const updateComponentConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateComponentConfigurationRequest,
    output: UpdateComponentConfigurationResponse,
    errors: [
      InternalServerException,
      ResourceInUseException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Adds a workload to a component. Each component can have at most five workloads.
 */
export const addWorkload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddWorkloadRequest,
  output: AddWorkloadResponse,
  errors: [
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the application.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds a workload to a component. Each component can have at most five workloads.
 */
export const updateWorkload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkloadRequest,
  output: UpdateWorkloadResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Ungroups a custom component. When you ungroup custom components, all applicable monitors
 * that are set up for the component are removed and the instances revert to their standalone
 * status.
 */
export const deleteComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteComponentRequest,
  output: DeleteComponentResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Remove workload from a component.
 */
export const removeWorkload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveWorkloadRequest,
  output: RemoveWorkloadResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the visibility of the problem or specifies the problem as
 * `RESOLVED`.
 */
export const updateProblem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProblemRequest,
  output: UpdateProblemResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes the specified log pattern from a `LogPatternSet`.
 */
export const deleteLogPattern = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLogPatternRequest,
  output: DeleteLogPatternResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Remove one or more tags (keys and values) from a specified application.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Removes the specified application from monitoring. Does not delete the
 * application.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the monitoring configuration of the component.
 */
export const describeComponentConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeComponentConfigurationRequest,
    output: DescribeComponentConfigurationResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Describes the recommended monitoring configuration of the component.
 */
export const describeComponentConfigurationRecommendation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeComponentConfigurationRecommendationRequest,
    output: DescribeComponentConfigurationRecommendationResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Describe a specific log pattern from a `LogPatternSet`.
 */
export const describeLogPattern = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLogPatternRequest,
  output: DescribeLogPatternResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes a workload and its configuration.
 */
export const describeWorkload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkloadRequest,
  output: DescribeWorkloadResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the auto-grouped, standalone, and custom components of the application.
 */
export const listComponents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListComponentsRequest,
    output: ListComponentsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the log patterns in the specific log `LogPatternSet`.
 */
export const listLogPatterns = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLogPatternsRequest,
    output: ListLogPatternsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the log pattern sets in the specific application.
 */
export const listLogPatternSets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLogPatternSetsRequest,
    output: ListLogPatternSetsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the problems with your application.
 */
export const listProblems = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListProblemsRequest,
    output: ListProblemsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieve a list of the tags (keys and values) that are associated with a specified
 * application. A *tag* is a label that you optionally define and associate
 * with an application. Each tag consists of a required *tag key* and an
 * optional associated *tag value*. A tag key is a general label that acts
 * as a category for more specific tag values. A tag value acts as a descriptor within a tag
 * key.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Creates a custom component by grouping similar standalone instances to monitor.
 */
export const createComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateComponentRequest,
  output: CreateComponentResponse,
  errors: [
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds an log pattern to a `LogPatternSet`.
 */
export const createLogPattern = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLogPatternRequest,
  output: CreateLogPatternResponse,
  errors: [
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the application.
 */
export const describeApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationRequest,
  output: DescribeApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes an anomaly or error with the application.
 */
export const describeObservation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeObservationRequest,
  output: DescribeObservationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the anomalies or errors associated with the problem.
 */
export const describeProblemObservations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeProblemObservationsRequest,
    output: DescribeProblemObservationsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Describes an application problem.
 */
export const describeProblem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProblemRequest,
  output: DescribeProblemResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds an application that is created from a resource group.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    TagsAlreadyExistException,
    ValidationException,
  ],
}));
/**
 * Describes a component and lists the resources that are grouped together in a
 * component.
 */
export const describeComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeComponentRequest,
  output: DescribeComponentResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
