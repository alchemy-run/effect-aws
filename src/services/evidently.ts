import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Evidently",
  serviceShapeName: "Evidently",
});
const auth = T.AwsAuthSigv4({ name: "evidently" });
const ver = T.ServiceVersion("2021-02-01");
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
                        url: "https://evidently-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://evidently-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://evidently.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://evidently.{Region}.{PartitionResult#dnsSuffix}",
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
export const MetricNameList = S.Array(S.String);
export const TreatmentNameList = S.Array(S.String);
export const ExperimentResultRequestTypeList = S.Array(S.String);
export const ExperimentReportNameList = S.Array(S.String);
export const VariationNameList = S.Array(S.String);
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
export class TestSegmentPatternRequest extends S.Class<TestSegmentPatternRequest>(
  "TestSegmentPatternRequest",
)(
  { pattern: S.String, payload: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/test-segment-pattern" }),
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
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export class GetProjectRequest extends S.Class<GetProjectRequest>(
  "GetProjectRequest",
)(
  { project: S.String.pipe(T.HttpLabel("project")) },
  T.all(
    T.Http({ method: "GET", uri: "/projects/{project}" }),
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
  { project: S.String.pipe(T.HttpLabel("project")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/projects/{project}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProjectResponse extends S.Class<DeleteProjectResponse>(
  "DeleteProjectResponse",
)({}) {}
export class ListProjectsRequest extends S.Class<ListProjectsRequest>(
  "ListProjectsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/projects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EvaluateFeatureRequest extends S.Class<EvaluateFeatureRequest>(
  "EvaluateFeatureRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    feature: S.String.pipe(T.HttpLabel("feature")),
    entityId: S.String,
    evaluationContext: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/projects/{project}/evaluations/{feature}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ProjectAppConfigResourceConfig extends S.Class<ProjectAppConfigResourceConfig>(
  "ProjectAppConfigResourceConfig",
)({
  applicationId: S.optional(S.String),
  environmentId: S.optional(S.String),
}) {}
export class UpdateProjectRequest extends S.Class<UpdateProjectRequest>(
  "UpdateProjectRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    appConfigResource: S.optional(ProjectAppConfigResourceConfig),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/projects/{project}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExperimentRequest extends S.Class<GetExperimentRequest>(
  "GetExperimentRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/projects/{project}/experiments/{experiment}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TreatmentConfig extends S.Class<TreatmentConfig>(
  "TreatmentConfig",
)({
  name: S.String,
  description: S.optional(S.String),
  feature: S.String,
  variation: S.String,
}) {}
export const TreatmentConfigList = S.Array(TreatmentConfig);
export class MetricDefinitionConfig extends S.Class<MetricDefinitionConfig>(
  "MetricDefinitionConfig",
)({
  name: S.String,
  entityIdKey: S.String,
  valueKey: S.String,
  eventPattern: S.optional(S.String),
  unitLabel: S.optional(S.String),
}) {}
export class MetricGoalConfig extends S.Class<MetricGoalConfig>(
  "MetricGoalConfig",
)({
  metricDefinition: MetricDefinitionConfig,
  desiredChange: S.optional(S.String),
}) {}
export const MetricGoalConfigList = S.Array(MetricGoalConfig);
export const TreatmentToWeightMap = S.Record({
  key: S.String,
  value: S.Number,
});
export class OnlineAbConfig extends S.Class<OnlineAbConfig>("OnlineAbConfig")({
  controlTreatmentName: S.optional(S.String),
  treatmentWeights: S.optional(TreatmentToWeightMap),
}) {}
export class UpdateExperimentRequest extends S.Class<UpdateExperimentRequest>(
  "UpdateExperimentRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
    description: S.optional(S.String),
    treatments: S.optional(TreatmentConfigList),
    metricGoals: S.optional(MetricGoalConfigList),
    randomizationSalt: S.optional(S.String),
    samplingRate: S.optional(S.Number),
    segment: S.optional(S.String),
    removeSegment: S.optional(S.Boolean),
    onlineAbConfig: S.optional(OnlineAbConfig),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/projects/{project}/experiments/{experiment}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteExperimentRequest extends S.Class<DeleteExperimentRequest>(
  "DeleteExperimentRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/projects/{project}/experiments/{experiment}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteExperimentResponse extends S.Class<DeleteExperimentResponse>(
  "DeleteExperimentResponse",
)({}) {}
export class ListExperimentsRequest extends S.Class<ListExperimentsRequest>(
  "ListExperimentsRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/projects/{project}/experiments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExperimentResultsRequest extends S.Class<GetExperimentResultsRequest>(
  "GetExperimentResultsRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    metricNames: MetricNameList,
    treatmentNames: TreatmentNameList,
    baseStat: S.optional(S.String),
    resultStats: S.optional(ExperimentResultRequestTypeList),
    reportNames: S.optional(ExperimentReportNameList),
    period: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/projects/{project}/experiments/{experiment}/results",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartExperimentRequest extends S.Class<StartExperimentRequest>(
  "StartExperimentRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
    analysisCompleteTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/projects/{project}/experiments/{experiment}/start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopExperimentRequest extends S.Class<StopExperimentRequest>(
  "StopExperimentRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
    desiredState: S.optional(S.String),
    reason: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/projects/{project}/experiments/{experiment}/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFeatureRequest extends S.Class<GetFeatureRequest>(
  "GetFeatureRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    feature: S.String.pipe(T.HttpLabel("feature")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/projects/{project}/features/{feature}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const VariableValue = S.Union(
  S.Struct({ boolValue: S.Boolean }),
  S.Struct({ stringValue: S.String }),
  S.Struct({ longValue: S.Number }),
  S.Struct({ doubleValue: S.Number }),
);
export class VariationConfig extends S.Class<VariationConfig>(
  "VariationConfig",
)({ name: S.String, value: VariableValue }) {}
export const VariationConfigsList = S.Array(VariationConfig);
export const EntityOverrideMap = S.Record({ key: S.String, value: S.String });
export class UpdateFeatureRequest extends S.Class<UpdateFeatureRequest>(
  "UpdateFeatureRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    feature: S.String.pipe(T.HttpLabel("feature")),
    evaluationStrategy: S.optional(S.String),
    description: S.optional(S.String),
    addOrUpdateVariations: S.optional(VariationConfigsList),
    removeVariations: S.optional(VariationNameList),
    defaultVariation: S.optional(S.String),
    entityOverrides: S.optional(EntityOverrideMap),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/projects/{project}/features/{feature}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFeatureRequest extends S.Class<DeleteFeatureRequest>(
  "DeleteFeatureRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    feature: S.String.pipe(T.HttpLabel("feature")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/projects/{project}/features/{feature}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFeatureResponse extends S.Class<DeleteFeatureResponse>(
  "DeleteFeatureResponse",
)({}) {}
export class ListFeaturesRequest extends S.Class<ListFeaturesRequest>(
  "ListFeaturesRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/projects/{project}/features" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLaunchRequest extends S.Class<GetLaunchRequest>(
  "GetLaunchRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    launch: S.String.pipe(T.HttpLabel("launch")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/projects/{project}/launches/{launch}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LaunchGroupConfig extends S.Class<LaunchGroupConfig>(
  "LaunchGroupConfig",
)({
  name: S.String,
  description: S.optional(S.String),
  feature: S.String,
  variation: S.String,
}) {}
export const LaunchGroupConfigList = S.Array(LaunchGroupConfig);
export class MetricMonitorConfig extends S.Class<MetricMonitorConfig>(
  "MetricMonitorConfig",
)({ metricDefinition: MetricDefinitionConfig }) {}
export const MetricMonitorConfigList = S.Array(MetricMonitorConfig);
export const GroupToWeightMap = S.Record({ key: S.String, value: S.Number });
export class SegmentOverride extends S.Class<SegmentOverride>(
  "SegmentOverride",
)({
  segment: S.String,
  evaluationOrder: S.Number,
  weights: GroupToWeightMap,
}) {}
export const SegmentOverridesList = S.Array(SegmentOverride);
export class ScheduledSplitConfig extends S.Class<ScheduledSplitConfig>(
  "ScheduledSplitConfig",
)({
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  groupWeights: GroupToWeightMap,
  segmentOverrides: S.optional(SegmentOverridesList),
}) {}
export const ScheduledSplitConfigList = S.Array(ScheduledSplitConfig);
export class ScheduledSplitsLaunchConfig extends S.Class<ScheduledSplitsLaunchConfig>(
  "ScheduledSplitsLaunchConfig",
)({ steps: ScheduledSplitConfigList }) {}
export class UpdateLaunchRequest extends S.Class<UpdateLaunchRequest>(
  "UpdateLaunchRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    launch: S.String.pipe(T.HttpLabel("launch")),
    description: S.optional(S.String),
    groups: S.optional(LaunchGroupConfigList),
    metricMonitors: S.optional(MetricMonitorConfigList),
    randomizationSalt: S.optional(S.String),
    scheduledSplitsConfig: S.optional(ScheduledSplitsLaunchConfig),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/projects/{project}/launches/{launch}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLaunchRequest extends S.Class<DeleteLaunchRequest>(
  "DeleteLaunchRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    launch: S.String.pipe(T.HttpLabel("launch")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/projects/{project}/launches/{launch}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLaunchResponse extends S.Class<DeleteLaunchResponse>(
  "DeleteLaunchResponse",
)({}) {}
export class ListLaunchesRequest extends S.Class<ListLaunchesRequest>(
  "ListLaunchesRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/projects/{project}/launches" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartLaunchRequest extends S.Class<StartLaunchRequest>(
  "StartLaunchRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    launch: S.String.pipe(T.HttpLabel("launch")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/projects/{project}/launches/{launch}/start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopLaunchRequest extends S.Class<StopLaunchRequest>(
  "StopLaunchRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    launch: S.String.pipe(T.HttpLabel("launch")),
    desiredState: S.optional(S.String),
    reason: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/projects/{project}/launches/{launch}/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateSegmentRequest extends S.Class<CreateSegmentRequest>(
  "CreateSegmentRequest",
)(
  {
    name: S.String,
    pattern: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/segments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSegmentRequest extends S.Class<GetSegmentRequest>(
  "GetSegmentRequest",
)(
  { segment: S.String.pipe(T.HttpLabel("segment")) },
  T.all(
    T.Http({ method: "GET", uri: "/segments/{segment}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSegmentRequest extends S.Class<DeleteSegmentRequest>(
  "DeleteSegmentRequest",
)(
  { segment: S.String.pipe(T.HttpLabel("segment")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/segments/{segment}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSegmentResponse extends S.Class<DeleteSegmentResponse>(
  "DeleteSegmentResponse",
)({}) {}
export class ListSegmentsRequest extends S.Class<ListSegmentsRequest>(
  "ListSegmentsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/segments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSegmentReferencesRequest extends S.Class<ListSegmentReferencesRequest>(
  "ListSegmentReferencesRequest",
)(
  {
    segment: S.String.pipe(T.HttpLabel("segment")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    type: S.String.pipe(T.HttpQuery("type")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/segments/{segment}/references" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3DestinationConfig extends S.Class<S3DestinationConfig>(
  "S3DestinationConfig",
)({ bucket: S.optional(S.String), prefix: S.optional(S.String) }) {}
export class CloudWatchLogsDestinationConfig extends S.Class<CloudWatchLogsDestinationConfig>(
  "CloudWatchLogsDestinationConfig",
)({ logGroup: S.optional(S.String) }) {}
export class ProjectDataDeliveryConfig extends S.Class<ProjectDataDeliveryConfig>(
  "ProjectDataDeliveryConfig",
)({
  s3Destination: S.optional(S3DestinationConfig),
  cloudWatchLogs: S.optional(CloudWatchLogsDestinationConfig),
}) {}
export class EvaluationRequest extends S.Class<EvaluationRequest>(
  "EvaluationRequest",
)({
  feature: S.String,
  entityId: S.String,
  evaluationContext: S.optional(S.String),
}) {}
export const EvaluationRequestsList = S.Array(EvaluationRequest);
export class Event extends S.Class<Event>("Event")({
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  type: S.String,
  data: S.String,
}) {}
export const EventList = S.Array(Event);
export class ExperimentSchedule extends S.Class<ExperimentSchedule>(
  "ExperimentSchedule",
)({
  analysisCompleteTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ExperimentExecution extends S.Class<ExperimentExecution>(
  "ExperimentExecution",
)({
  startedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const FeatureToVariationMap = S.Record({
  key: S.String,
  value: S.String,
});
export class Treatment extends S.Class<Treatment>("Treatment")({
  name: S.String,
  description: S.optional(S.String),
  featureVariations: S.optional(FeatureToVariationMap),
}) {}
export const TreatmentList = S.Array(Treatment);
export class MetricDefinition extends S.Class<MetricDefinition>(
  "MetricDefinition",
)({
  name: S.optional(S.String),
  entityIdKey: S.optional(S.String),
  valueKey: S.optional(S.String),
  eventPattern: S.optional(S.String),
  unitLabel: S.optional(S.String),
}) {}
export class MetricGoal extends S.Class<MetricGoal>("MetricGoal")({
  metricDefinition: MetricDefinition,
  desiredChange: S.optional(S.String),
}) {}
export const MetricGoalsList = S.Array(MetricGoal);
export class OnlineAbDefinition extends S.Class<OnlineAbDefinition>(
  "OnlineAbDefinition",
)({
  controlTreatmentName: S.optional(S.String),
  treatmentWeights: S.optional(TreatmentToWeightMap),
}) {}
export class Experiment extends S.Class<Experiment>("Experiment")({
  arn: S.String,
  name: S.String,
  project: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  description: S.optional(S.String),
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  schedule: S.optional(ExperimentSchedule),
  execution: S.optional(ExperimentExecution),
  treatments: S.optional(TreatmentList),
  metricGoals: S.optional(MetricGoalsList),
  randomizationSalt: S.optional(S.String),
  samplingRate: S.optional(S.Number),
  segment: S.optional(S.String),
  type: S.String,
  onlineAbDefinition: S.optional(OnlineAbDefinition),
  tags: S.optional(TagMap),
}) {}
export const ExperimentList = S.Array(Experiment);
export const TimestampList = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export class LaunchExecution extends S.Class<LaunchExecution>(
  "LaunchExecution",
)({
  startedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class LaunchGroup extends S.Class<LaunchGroup>("LaunchGroup")({
  name: S.String,
  description: S.optional(S.String),
  featureVariations: FeatureToVariationMap,
}) {}
export const LaunchGroupList = S.Array(LaunchGroup);
export class MetricMonitor extends S.Class<MetricMonitor>("MetricMonitor")({
  metricDefinition: MetricDefinition,
}) {}
export const MetricMonitorList = S.Array(MetricMonitor);
export class ScheduledSplit extends S.Class<ScheduledSplit>("ScheduledSplit")({
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  groupWeights: S.optional(GroupToWeightMap),
  segmentOverrides: S.optional(SegmentOverridesList),
}) {}
export const ScheduledStepList = S.Array(ScheduledSplit);
export class ScheduledSplitsLaunchDefinition extends S.Class<ScheduledSplitsLaunchDefinition>(
  "ScheduledSplitsLaunchDefinition",
)({ steps: S.optional(ScheduledStepList) }) {}
export class Launch extends S.Class<Launch>("Launch")({
  arn: S.String,
  name: S.String,
  project: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  description: S.optional(S.String),
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  execution: S.optional(LaunchExecution),
  groups: S.optional(LaunchGroupList),
  metricMonitors: S.optional(MetricMonitorList),
  randomizationSalt: S.optional(S.String),
  type: S.String,
  scheduledSplitsDefinition: S.optional(ScheduledSplitsLaunchDefinition),
  tags: S.optional(TagMap),
}) {}
export const LaunchesList = S.Array(Launch);
export class Segment extends S.Class<Segment>("Segment")({
  arn: S.String,
  name: S.String,
  pattern: S.String,
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  description: S.optional(S.String),
  experimentCount: S.optional(S.Number),
  launchCount: S.optional(S.Number),
  tags: S.optional(TagMap),
}) {}
export const SegmentList = S.Array(Segment);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
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
export class TestSegmentPatternResponse extends S.Class<TestSegmentPatternResponse>(
  "TestSegmentPatternResponse",
)({ match: S.Boolean }) {}
export class CreateProjectRequest extends S.Class<CreateProjectRequest>(
  "CreateProjectRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    dataDelivery: S.optional(ProjectDataDeliveryConfig),
    appConfigResource: S.optional(ProjectAppConfigResourceConfig),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/projects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchEvaluateFeatureRequest extends S.Class<BatchEvaluateFeatureRequest>(
  "BatchEvaluateFeatureRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    requests: EvaluationRequestsList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/projects/{project}/evaluations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EvaluateFeatureResponse extends S.Class<EvaluateFeatureResponse>(
  "EvaluateFeatureResponse",
)({
  variation: S.optional(S.String),
  value: S.optional(VariableValue),
  reason: S.optional(S.String),
  details: S.optional(S.String),
}) {}
export class PutProjectEventsRequest extends S.Class<PutProjectEventsRequest>(
  "PutProjectEventsRequest",
)(
  { project: S.String.pipe(T.HttpLabel("project")), events: EventList },
  T.all(
    T.Http({ method: "POST", uri: "/events/projects/{project}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3Destination extends S.Class<S3Destination>("S3Destination")({
  bucket: S.optional(S.String),
  prefix: S.optional(S.String),
}) {}
export class CloudWatchLogsDestination extends S.Class<CloudWatchLogsDestination>(
  "CloudWatchLogsDestination",
)({ logGroup: S.optional(S.String) }) {}
export class ProjectDataDelivery extends S.Class<ProjectDataDelivery>(
  "ProjectDataDelivery",
)({
  s3Destination: S.optional(S3Destination),
  cloudWatchLogs: S.optional(CloudWatchLogsDestination),
}) {}
export class ProjectAppConfigResource extends S.Class<ProjectAppConfigResource>(
  "ProjectAppConfigResource",
)({
  applicationId: S.String,
  environmentId: S.String,
  configurationProfileId: S.String,
}) {}
export class Project extends S.Class<Project>("Project")({
  arn: S.String,
  name: S.String,
  status: S.String,
  description: S.optional(S.String),
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  featureCount: S.optional(S.Number),
  launchCount: S.optional(S.Number),
  activeLaunchCount: S.optional(S.Number),
  experimentCount: S.optional(S.Number),
  activeExperimentCount: S.optional(S.Number),
  dataDelivery: S.optional(ProjectDataDelivery),
  appConfigResource: S.optional(ProjectAppConfigResource),
  tags: S.optional(TagMap),
}) {}
export class UpdateProjectResponse extends S.Class<UpdateProjectResponse>(
  "UpdateProjectResponse",
)({ project: Project }) {}
export class UpdateProjectDataDeliveryRequest extends S.Class<UpdateProjectDataDeliveryRequest>(
  "UpdateProjectDataDeliveryRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    s3Destination: S.optional(S3DestinationConfig),
    cloudWatchLogs: S.optional(CloudWatchLogsDestinationConfig),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/projects/{project}/data-delivery" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateExperimentResponse extends S.Class<UpdateExperimentResponse>(
  "UpdateExperimentResponse",
)({ experiment: Experiment }) {}
export class ListExperimentsResponse extends S.Class<ListExperimentsResponse>(
  "ListExperimentsResponse",
)({
  experiments: S.optional(ExperimentList),
  nextToken: S.optional(S.String),
}) {}
export class StartExperimentResponse extends S.Class<StartExperimentResponse>(
  "StartExperimentResponse",
)({
  startedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class StopExperimentResponse extends S.Class<StopExperimentResponse>(
  "StopExperimentResponse",
)({ endedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))) }) {}
export class Variation extends S.Class<Variation>("Variation")({
  name: S.optional(S.String),
  value: S.optional(VariableValue),
}) {}
export const VariationsList = S.Array(Variation);
export class EvaluationRule extends S.Class<EvaluationRule>("EvaluationRule")({
  name: S.optional(S.String),
  type: S.String,
}) {}
export const EvaluationRulesList = S.Array(EvaluationRule);
export class Feature extends S.Class<Feature>("Feature")({
  arn: S.String,
  name: S.String,
  project: S.optional(S.String),
  status: S.String,
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  description: S.optional(S.String),
  evaluationStrategy: S.String,
  valueType: S.String,
  variations: VariationsList,
  defaultVariation: S.optional(S.String),
  evaluationRules: S.optional(EvaluationRulesList),
  tags: S.optional(TagMap),
  entityOverrides: S.optional(EntityOverrideMap),
}) {}
export class UpdateFeatureResponse extends S.Class<UpdateFeatureResponse>(
  "UpdateFeatureResponse",
)({ feature: Feature }) {}
export class UpdateLaunchResponse extends S.Class<UpdateLaunchResponse>(
  "UpdateLaunchResponse",
)({ launch: Launch }) {}
export class ListLaunchesResponse extends S.Class<ListLaunchesResponse>(
  "ListLaunchesResponse",
)({ launches: S.optional(LaunchesList), nextToken: S.optional(S.String) }) {}
export class StartLaunchResponse extends S.Class<StartLaunchResponse>(
  "StartLaunchResponse",
)({ launch: Launch }) {}
export class StopLaunchResponse extends S.Class<StopLaunchResponse>(
  "StopLaunchResponse",
)({ endedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))) }) {}
export class GetSegmentResponse extends S.Class<GetSegmentResponse>(
  "GetSegmentResponse",
)({ segment: Segment }) {}
export class ListSegmentsResponse extends S.Class<ListSegmentsResponse>(
  "ListSegmentsResponse",
)({ segments: S.optional(SegmentList), nextToken: S.optional(S.String) }) {}
export const DoubleValueList = S.Array(S.Number);
export class ProjectSummary extends S.Class<ProjectSummary>("ProjectSummary")({
  arn: S.String,
  name: S.String,
  status: S.String,
  description: S.optional(S.String),
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  featureCount: S.optional(S.Number),
  launchCount: S.optional(S.Number),
  activeLaunchCount: S.optional(S.Number),
  experimentCount: S.optional(S.Number),
  activeExperimentCount: S.optional(S.Number),
  tags: S.optional(TagMap),
}) {}
export const ProjectSummariesList = S.Array(ProjectSummary);
export class ExperimentResultsData extends S.Class<ExperimentResultsData>(
  "ExperimentResultsData",
)({
  metricName: S.optional(S.String),
  treatmentName: S.optional(S.String),
  resultStat: S.optional(S.String),
  values: S.optional(DoubleValueList),
}) {}
export const ExperimentResultsDataList = S.Array(ExperimentResultsData);
export class ExperimentReport extends S.Class<ExperimentReport>(
  "ExperimentReport",
)({
  metricName: S.optional(S.String),
  treatmentName: S.optional(S.String),
  reportName: S.optional(S.String),
  content: S.optional(S.String),
}) {}
export const ExperimentReportList = S.Array(ExperimentReport);
export class FeatureSummary extends S.Class<FeatureSummary>("FeatureSummary")({
  arn: S.String,
  name: S.String,
  project: S.optional(S.String),
  status: S.String,
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  evaluationStrategy: S.String,
  evaluationRules: S.optional(EvaluationRulesList),
  defaultVariation: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const FeatureSummariesList = S.Array(FeatureSummary);
export class RefResource extends S.Class<RefResource>("RefResource")({
  name: S.String,
  type: S.String,
  arn: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.String),
  endTime: S.optional(S.String),
  lastUpdatedOn: S.optional(S.String),
}) {}
export const RefResourceList = S.Array(RefResource);
export class CreateProjectResponse extends S.Class<CreateProjectResponse>(
  "CreateProjectResponse",
)({ project: Project }) {}
export class ListProjectsResponse extends S.Class<ListProjectsResponse>(
  "ListProjectsResponse",
)({
  projects: S.optional(ProjectSummariesList),
  nextToken: S.optional(S.String),
}) {}
export class UpdateProjectDataDeliveryResponse extends S.Class<UpdateProjectDataDeliveryResponse>(
  "UpdateProjectDataDeliveryResponse",
)({ project: Project }) {}
export class CreateExperimentRequest extends S.Class<CreateExperimentRequest>(
  "CreateExperimentRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    name: S.String,
    description: S.optional(S.String),
    treatments: TreatmentConfigList,
    metricGoals: MetricGoalConfigList,
    randomizationSalt: S.optional(S.String),
    samplingRate: S.optional(S.Number),
    onlineAbConfig: S.optional(OnlineAbConfig),
    segment: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/projects/{project}/experiments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExperimentResultsResponse extends S.Class<GetExperimentResultsResponse>(
  "GetExperimentResultsResponse",
)({
  resultsData: S.optional(ExperimentResultsDataList),
  reports: S.optional(ExperimentReportList),
  timestamps: S.optional(TimestampList),
  details: S.optional(S.String),
}) {}
export class CreateFeatureRequest extends S.Class<CreateFeatureRequest>(
  "CreateFeatureRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    name: S.String,
    evaluationStrategy: S.optional(S.String),
    description: S.optional(S.String),
    variations: VariationConfigsList,
    defaultVariation: S.optional(S.String),
    tags: S.optional(TagMap),
    entityOverrides: S.optional(EntityOverrideMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/projects/{project}/features" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFeaturesResponse extends S.Class<ListFeaturesResponse>(
  "ListFeaturesResponse",
)({
  features: S.optional(FeatureSummariesList),
  nextToken: S.optional(S.String),
}) {}
export class CreateSegmentResponse extends S.Class<CreateSegmentResponse>(
  "CreateSegmentResponse",
)({ segment: Segment }) {}
export class ListSegmentReferencesResponse extends S.Class<ListSegmentReferencesResponse>(
  "ListSegmentReferencesResponse",
)({
  referencedBy: S.optional(RefResourceList),
  nextToken: S.optional(S.String),
}) {}
export class EvaluationResult extends S.Class<EvaluationResult>(
  "EvaluationResult",
)({
  project: S.optional(S.String),
  feature: S.String,
  variation: S.optional(S.String),
  value: S.optional(VariableValue),
  entityId: S.String,
  reason: S.optional(S.String),
  details: S.optional(S.String),
}) {}
export const EvaluationResultsList = S.Array(EvaluationResult);
export class PutProjectEventsResultEntry extends S.Class<PutProjectEventsResultEntry>(
  "PutProjectEventsResultEntry",
)({
  eventId: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const PutProjectEventsResultEntryList = S.Array(
  PutProjectEventsResultEntry,
);
export class BatchEvaluateFeatureResponse extends S.Class<BatchEvaluateFeatureResponse>(
  "BatchEvaluateFeatureResponse",
)({ results: S.optional(EvaluationResultsList) }) {}
export class PutProjectEventsResponse extends S.Class<PutProjectEventsResponse>(
  "PutProjectEventsResponse",
)({
  failedEventCount: S.optional(S.Number),
  eventResults: S.optional(PutProjectEventsResultEntryList),
}) {}
export class CreateExperimentResponse extends S.Class<CreateExperimentResponse>(
  "CreateExperimentResponse",
)({ experiment: Experiment }) {}
export class CreateFeatureResponse extends S.Class<CreateFeatureResponse>(
  "CreateFeatureResponse",
)({ feature: S.optional(Feature) }) {}
export class GetFeatureResponse extends S.Class<GetFeatureResponse>(
  "GetFeatureResponse",
)({ feature: Feature }) {}
export class CreateLaunchRequest extends S.Class<CreateLaunchRequest>(
  "CreateLaunchRequest",
)(
  {
    project: S.String.pipe(T.HttpLabel("project")),
    name: S.String,
    description: S.optional(S.String),
    scheduledSplitsConfig: S.optional(ScheduledSplitsLaunchConfig),
    metricMonitors: S.optional(MetricMonitorConfigList),
    groups: LaunchGroupConfigList,
    randomizationSalt: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/projects/{project}/launches" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class GetProjectResponse extends S.Class<GetProjectResponse>(
  "GetProjectResponse",
)({ project: Project }) {}
export class GetExperimentResponse extends S.Class<GetExperimentResponse>(
  "GetExperimentResponse",
)({ experiment: S.optional(Experiment) }) {}
export class CreateLaunchResponse extends S.Class<CreateLaunchResponse>(
  "CreateLaunchResponse",
)({ launch: Launch }) {}
export class GetLaunchResponse extends S.Class<GetLaunchResponse>(
  "GetLaunchResponse",
)({ launch: S.optional(Launch) }) {}

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the details about one launch. You must already know the
 * project name. To retrieve a list of projects in your account, use ListProjects.
 */
export const getProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProjectRequest,
  output: GetProjectResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the details about one experiment. You must already know the
 * experiment name. To retrieve a list of experiments in your account, use ListExperiments.
 */
export const getExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExperimentRequest,
  output: GetExperimentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a *launch* of a given feature. Before you create a launch, you
 * must create the feature to use for the launch.
 *
 * You can use a launch to safely validate new features by serving them to a specified
 * percentage of your users while you roll out the feature. You can monitor the performance of
 * the new feature to help you decide when to ramp up traffic to more users. This helps you
 * reduce risk and identify unintended consequences before you fully launch the feature.
 *
 * Don't use this operation to update an existing launch. Instead, use
 * UpdateLaunch.
 */
export const createLaunch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLaunchRequest,
  output: CreateLaunchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns the details about one launch. You must already know the
 * launch name. To retrieve a list of launches in your account, use ListLaunches.
 */
export const getLaunch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLaunchRequest,
  output: GetLaunchResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns configuration details about all the launches in the specified project.
 */
export const listLaunches = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLaunchesRequest,
    output: ListLaunchesResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "launches",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Use this operation to find which experiments or launches are using a specified segment.
 */
export const listSegmentReferences =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSegmentReferencesRequest,
    output: ListSegmentReferencesResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "referencedBy",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Deletes an Evidently project. Before you can delete a project, you must delete all the
 * features that the project contains. To delete a feature, use DeleteFeature.
 */
export const deleteProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation assigns a feature variation to one given user session. You pass in an
 * `entityID` that represents the user. Evidently then checks the evaluation rules
 * and assigns the variation.
 *
 * The first rules that are evaluated are the override rules. If the user's
 * `entityID` matches an override rule, the user is served the variation specified
 * by that rule.
 *
 * If there is a current launch with this feature that uses segment overrides, and
 * if the user session's `evaluationContext` matches a segment rule defined in a
 * segment override, the configuration in the segment overrides is used. For more information
 * about segments, see CreateSegment
 * and
 * Use segments to focus your
 * audience.
 *
 * If there is a launch with no segment overrides, the user might be assigned to a variation in
 * the launch. The chance of this depends on the percentage of users that are allocated to that
 * launch. If the user is enrolled in the launch, the variation they are served depends on the
 * allocation of the various feature variations used for the launch.
 *
 * If the user is not assigned to a launch, and there is an ongoing experiment for this feature, the user might
 * be assigned to a variation in the experiment. The chance of this
 * depends on the percentage of users that are allocated to that experiment.
 *
 * If the experiment uses a segment, then only
 * user sessions with `evaluationContext` values that match the segment rule are used in the experiment.
 *
 * If the user is enrolled in the experiment,
 * the variation they are served depends on the allocation of the various feature variations used for the experiment.
 *
 * If the user is not assigned to a launch or experiment, they are served the default variation.
 */
export const evaluateFeature = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EvaluateFeatureRequest,
  output: EvaluateFeatureResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an Evidently experiment.
 *
 * Don't use this operation to update an experiment's tag. Instead, use
 * TagResource.
 */
export const updateExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateExperimentRequest,
  output: UpdateExperimentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns configuration details about all the experiments in the specified project.
 */
export const listExperiments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListExperimentsRequest,
    output: ListExperimentsResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "experiments",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Updates a launch of a given feature.
 *
 * Don't use this operation to update the tags of an existing launch. Instead, use
 * TagResource.
 */
export const updateLaunch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLaunchRequest,
  output: UpdateLaunchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Stops a launch that is currently running. After you stop a launch, you will not be able to resume it or restart it.
 * Also, it
 * will not be evaluated as a rule for traffic allocation, and the traffic that was allocated to the launch
 * will instead be available to the feature's experiment, if there is one. Otherwise, all traffic
 * will be served the default variation after the launch is stopped.
 */
export const stopLaunch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopLaunchRequest,
  output: StopLaunchResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the specified segment. Specify the segment you want to view
 * by specifying its ARN.
 */
export const getSegment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSegmentRequest,
  output: GetSegmentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Displays the tags associated with an Evidently resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified CloudWatch Evidently resource. Projects,
 * features, launches, and experiments can be tagged.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope user
 * permissions by granting a user
 * permission to access or change only resources with certain tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters.
 *
 * You can use the `TagResource` action with a resource that already has tags.
 * If you specify a new tag key for the resource,
 * this tag is appended to the list of tags associated
 * with the alarm. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces
 * the previous value for that tag.
 *
 * You can associate as many as 50 tags with a resource.
 *
 * For more information, see Tagging Amazon Web Services resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes an Evidently feature.
 */
export const deleteFeature = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFeatureRequest,
  output: DeleteFeatureResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an Evidently launch. The feature used for the launch is not deleted.
 *
 * To stop a launch without deleting it, use StopLaunch.
 */
export const deleteLaunch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLaunchRequest,
  output: DeleteLaunchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a segment. You can't delete a segment that is being used in a launch or experiment, even if that
 * launch or experiment is not currently running.
 */
export const deleteSegment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSegmentRequest,
  output: DeleteSegmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of audience segments that you have created in your account in this Region.
 */
export const listSegments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSegmentsRequest,
    output: ListSegmentsResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "segments",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Use this operation to test a rules pattern that you plan to use to create an audience segment.
 * For more information about segments, see CreateSegment.
 */
export const testSegmentPattern = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestSegmentPatternRequest,
  output: TestSegmentPatternResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Returns configuration details about all the projects in the current Region in your
 * account.
 */
export const listProjects = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListProjectsRequest,
    output: ListProjectsResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "projects",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves the results of a running or completed experiment. No results are available until
 * there have been 100 events for each variation and at least 10 minutes have passed since the start of the experiment.
 * To increase the statistical power, Evidently performs an additional offline p-value analysis at the end of the experiment.
 * Offline p-value analysis can detect statistical significance in some cases where the anytime p-values used during
 * the experiment do not find statistical significance.
 *
 * Experiment
 * results are available up to 63 days after the start of the experiment. They are not available after that because
 * of CloudWatch data retention policies.
 */
export const getExperimentResults = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetExperimentResultsRequest,
    output: GetExperimentResultsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns configuration details about all the features in the specified project.
 */
export const listFeatures = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFeaturesRequest,
    output: ListFeaturesResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "features",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a project, which is the logical object in Evidently that can contain features, launches, and
 * experiments. Use projects to group similar features together.
 *
 * To update an existing project, use UpdateProject.
 */
export const createProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectRequest,
  output: CreateProjectResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * This operation assigns feature variation to user sessions. For each user session, you pass
 * in an `entityID` that represents the user. Evidently then checks the evaluation
 * rules and assigns the variation.
 *
 * The first rules that are evaluated are the override rules. If the user's
 * `entityID` matches an override rule, the user is served the variation specified
 * by that rule.
 *
 * Next, if there is a launch of the feature, the user might be assigned to a variation in
 * the launch. The chance of this depends on the percentage of users that are allocated to that
 * launch. If the user is enrolled in the launch, the variation they are served depends on the
 * allocation of the various feature variations used for the launch.
 *
 * If the user is not assigned to a launch, and there is an ongoing experiment for this feature, the user might
 * be assigned to a variation in the experiment. The chance of this
 * depends on the percentage of users that are allocated to that experiment. If the user is enrolled in the experiment,
 * the variation they are served depends on the allocation of the various feature variations used for the experiment.
 *
 * If the user is not assigned to a launch or experiment, they are served the default variation.
 */
export const batchEvaluateFeature = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchEvaluateFeatureRequest,
    output: BatchEvaluateFeatureResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Sends performance events to Evidently. These events can be used to evaluate a launch or
 * an experiment.
 */
export const putProjectEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutProjectEventsRequest,
  output: PutProjectEventsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Evidently *experiment*. Before you create an experiment,
 * you must create the feature to use for the experiment.
 *
 * An experiment helps you make feature design
 * decisions based on evidence and data. An experiment can test as
 * many as five variations at once. Evidently collects experiment data and analyzes it by statistical methods, and provides
 * clear recommendations about which variations perform better.
 *
 * You can optionally specify a `segment` to have the experiment consider only certain audience
 * types in the experiment, such as using only user sessions from a certain location or who use a certain internet browser.
 *
 * Don't use this operation to update an existing experiment. Instead, use
 * UpdateExperiment.
 */
export const createExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExperimentRequest,
  output: CreateExperimentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an Evidently *feature* that you want to launch or test. You can define up to
 * five variations of a feature, and use these variations in your launches and experiments. A feature must be created in
 * a project. For information about creating a project, see CreateProject.
 *
 * Don't use this operation to update an existing feature. Instead, use
 * UpdateFeature.
 */
export const createFeature = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFeatureRequest,
  output: CreateFeatureResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns the details about one feature. You must already know the feature name. To
 * retrieve a list of features in your account, use ListFeatures.
 */
export const getFeature = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFeatureRequest,
  output: GetFeatureResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the data storage options for this project. If you store evaluation events, you an
 * keep them and analyze them on your own. If you choose not to store evaluation events,
 * Evidently deletes them after using them to produce metrics and other experiment results that
 * you can view.
 *
 * You can't specify both `cloudWatchLogs` and `s3Destination` in the same operation.
 */
export const updateProjectDataDelivery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProjectDataDeliveryRequest,
    output: UpdateProjectDataDeliveryResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Use this operation to define a *segment* of your audience. A segment
 * is a portion of your audience that share one or more characteristics. Examples could be Chrome browser users,
 * users in Europe, or Firefox browser users in Europe who also fit other criteria that your application collects,
 * such as age.
 *
 * Using a segment in an experiment limits that experiment to evaluate only the users who match the segment
 * criteria. Using one or more segments in a launch allows you to define different traffic splits for the different
 * audience segments.
 *
 * For more information about segment pattern syntax, see
 *
 * Segment rule pattern syntax.
 *
 * The pattern that you define for a segment is matched against the value of `evaluationContext`, which
 * is passed into Evidently in the EvaluateFeature operation,
 * when Evidently assigns a feature variation to a user.
 */
export const createSegment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSegmentRequest,
  output: CreateSegmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Updates the description of an existing project.
 *
 * To create a new project, use CreateProject.
 *
 * Don't use this operation to update the data storage options of a project. Instead, use
 * UpdateProjectDataDelivery.
 *
 * Don't use this operation to update the tags of a project. Instead, use
 * TagResource.
 */
export const updateProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectRequest,
  output: UpdateProjectResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Starts an existing experiment. To create an experiment,
 * use CreateExperiment.
 */
export const startExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExperimentRequest,
  output: StartExperimentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops an experiment that is currently running. If you stop an experiment, you can't
 * resume it or restart it.
 */
export const stopExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopExperimentRequest,
  output: StopExperimentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing feature.
 *
 * You can't use this operation to update the tags of an existing feature. Instead, use
 * TagResource.
 */
export const updateFeature = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFeatureRequest,
  output: UpdateFeatureResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Starts an existing launch. To create a launch,
 * use CreateLaunch.
 */
export const startLaunch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartLaunchRequest,
  output: StartLaunchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an Evidently experiment. The feature used for the experiment is not deleted.
 *
 * To stop an experiment without deleting it, use StopExperiment.
 */
export const deleteExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExperimentRequest,
  output: DeleteExperimentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
