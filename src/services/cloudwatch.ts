import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://monitoring.amazonaws.com/doc/2010-08-01/");
const svc = T.AwsApiService({
  sdkId: "CloudWatch",
  serviceShapeName: "GraniteServiceVersion20100801",
});
const auth = T.AwsAuthSigv4({ name: "monitoring" });
const ver = T.ServiceVersion("2010-08-01");
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
                    url: "https://monitoring.{Region}.{PartitionResult#dnsSuffix}",
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://monitoring.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                            url: "https://monitoring-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                            url: "https://monitoring-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                            url: "https://monitoring.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://monitoring.{Region}.{PartitionResult#dnsSuffix}",
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
export const AlarmNames = S.Array(S.String);
export const DashboardNames = S.Array(S.String);
export const InsightRuleNames = S.Array(S.String);
export const AlarmTypes = S.Array(S.String);
export const AnomalyDetectorTypes = S.Array(S.String);
export const InsightRuleMetricList = S.Array(S.String);
export const Statistics = S.Array(S.String);
export const ExtendedStatistics = S.Array(S.String);
export const ResourceList = S.Array(S.String);
export const MetricStreamNames = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeleteAlarmsInput extends S.Class<DeleteAlarmsInput>(
  "DeleteAlarmsInput",
)(
  { AlarmNames: AlarmNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAlarmsResponse extends S.Class<DeleteAlarmsResponse>(
  "DeleteAlarmsResponse",
)({}, ns) {}
export class DeleteDashboardsInput extends S.Class<DeleteDashboardsInput>(
  "DeleteDashboardsInput",
)(
  { DashboardNames: DashboardNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDashboardsOutput extends S.Class<DeleteDashboardsOutput>(
  "DeleteDashboardsOutput",
)({}, ns) {}
export class DeleteInsightRulesInput extends S.Class<DeleteInsightRulesInput>(
  "DeleteInsightRulesInput",
)(
  { RuleNames: InsightRuleNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMetricStreamInput extends S.Class<DeleteMetricStreamInput>(
  "DeleteMetricStreamInput",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMetricStreamOutput extends S.Class<DeleteMetricStreamOutput>(
  "DeleteMetricStreamOutput",
)({}, ns) {}
export class DescribeAlarmContributorsInput extends S.Class<DescribeAlarmContributorsInput>(
  "DescribeAlarmContributorsInput",
)(
  { AlarmName: S.String, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAlarmHistoryInput extends S.Class<DescribeAlarmHistoryInput>(
  "DescribeAlarmHistoryInput",
)(
  {
    AlarmName: S.optional(S.String),
    AlarmContributorId: S.optional(S.String),
    AlarmTypes: S.optional(AlarmTypes),
    HistoryItemType: S.optional(S.String),
    StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ScanBy: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAlarmsInput extends S.Class<DescribeAlarmsInput>(
  "DescribeAlarmsInput",
)(
  {
    AlarmNames: S.optional(AlarmNames),
    AlarmNamePrefix: S.optional(S.String),
    AlarmTypes: S.optional(AlarmTypes),
    ChildrenOfAlarmName: S.optional(S.String),
    ParentsOfAlarmName: S.optional(S.String),
    StateValue: S.optional(S.String),
    ActionPrefix: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Dimension extends S.Class<Dimension>("Dimension")({
  Name: S.String,
  Value: S.String,
}) {}
export const Dimensions = S.Array(Dimension);
export class DescribeAlarmsForMetricInput extends S.Class<DescribeAlarmsForMetricInput>(
  "DescribeAlarmsForMetricInput",
)(
  {
    MetricName: S.String,
    Namespace: S.String,
    Statistic: S.optional(S.String),
    ExtendedStatistic: S.optional(S.String),
    Dimensions: S.optional(Dimensions),
    Period: S.optional(S.Number),
    Unit: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAnomalyDetectorsInput extends S.Class<DescribeAnomalyDetectorsInput>(
  "DescribeAnomalyDetectorsInput",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Namespace: S.optional(S.String),
    MetricName: S.optional(S.String),
    Dimensions: S.optional(Dimensions),
    AnomalyDetectorTypes: S.optional(AnomalyDetectorTypes),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInsightRulesInput extends S.Class<DescribeInsightRulesInput>(
  "DescribeInsightRulesInput",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableAlarmActionsInput extends S.Class<DisableAlarmActionsInput>(
  "DisableAlarmActionsInput",
)(
  { AlarmNames: AlarmNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableAlarmActionsResponse extends S.Class<DisableAlarmActionsResponse>(
  "DisableAlarmActionsResponse",
)({}, ns) {}
export class DisableInsightRulesInput extends S.Class<DisableInsightRulesInput>(
  "DisableInsightRulesInput",
)(
  { RuleNames: InsightRuleNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableAlarmActionsInput extends S.Class<EnableAlarmActionsInput>(
  "EnableAlarmActionsInput",
)(
  { AlarmNames: AlarmNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableAlarmActionsResponse extends S.Class<EnableAlarmActionsResponse>(
  "EnableAlarmActionsResponse",
)({}, ns) {}
export class EnableInsightRulesInput extends S.Class<EnableInsightRulesInput>(
  "EnableInsightRulesInput",
)(
  { RuleNames: InsightRuleNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDashboardInput extends S.Class<GetDashboardInput>(
  "GetDashboardInput",
)(
  { DashboardName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetInsightRuleReportInput extends S.Class<GetInsightRuleReportInput>(
  "GetInsightRuleReportInput",
)(
  {
    RuleName: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Period: S.Number,
    MaxContributorCount: S.optional(S.Number),
    Metrics: S.optional(InsightRuleMetricList),
    OrderBy: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMetricStatisticsInput extends S.Class<GetMetricStatisticsInput>(
  "GetMetricStatisticsInput",
)(
  {
    Namespace: S.String,
    MetricName: S.String,
    Dimensions: S.optional(Dimensions),
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Period: S.Number,
    Statistics: S.optional(Statistics),
    ExtendedStatistics: S.optional(ExtendedStatistics),
    Unit: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMetricStreamInput extends S.Class<GetMetricStreamInput>(
  "GetMetricStreamInput",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMetricWidgetImageInput extends S.Class<GetMetricWidgetImageInput>(
  "GetMetricWidgetImageInput",
)(
  { MetricWidget: S.String, OutputFormat: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDashboardsInput extends S.Class<ListDashboardsInput>(
  "ListDashboardsInput",
)(
  {
    DashboardNamePrefix: S.optional(S.String),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListManagedInsightRulesInput extends S.Class<ListManagedInsightRulesInput>(
  "ListManagedInsightRulesInput",
)(
  {
    ResourceARN: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMetricStreamsInput extends S.Class<ListMetricStreamsInput>(
  "ListMetricStreamsInput",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { ResourceARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDashboardInput extends S.Class<PutDashboardInput>(
  "PutDashboardInput",
)(
  { DashboardName: S.String, DashboardBody: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class PutInsightRuleInput extends S.Class<PutInsightRuleInput>(
  "PutInsightRuleInput",
)(
  {
    RuleName: S.String,
    RuleState: S.optional(S.String),
    RuleDefinition: S.String,
    Tags: S.optional(TagList),
    ApplyOnTransformedLogs: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutInsightRuleOutput extends S.Class<PutInsightRuleOutput>(
  "PutInsightRuleOutput",
)({}, ns) {}
export class Metric extends S.Class<Metric>("Metric")({
  Namespace: S.optional(S.String),
  MetricName: S.optional(S.String),
  Dimensions: S.optional(Dimensions),
}) {}
export class MetricStat extends S.Class<MetricStat>("MetricStat")({
  Metric: Metric,
  Period: S.Number,
  Stat: S.String,
  Unit: S.optional(S.String),
}) {}
export class MetricDataQuery extends S.Class<MetricDataQuery>(
  "MetricDataQuery",
)({
  Id: S.String,
  MetricStat: S.optional(MetricStat),
  Expression: S.optional(S.String),
  Label: S.optional(S.String),
  ReturnData: S.optional(S.Boolean),
  Period: S.optional(S.Number),
  AccountId: S.optional(S.String),
}) {}
export const MetricDataQueries = S.Array(MetricDataQuery);
export class PutMetricAlarmInput extends S.Class<PutMetricAlarmInput>(
  "PutMetricAlarmInput",
)(
  {
    AlarmName: S.String,
    AlarmDescription: S.optional(S.String),
    ActionsEnabled: S.optional(S.Boolean),
    OKActions: S.optional(ResourceList),
    AlarmActions: S.optional(ResourceList),
    InsufficientDataActions: S.optional(ResourceList),
    MetricName: S.optional(S.String),
    Namespace: S.optional(S.String),
    Statistic: S.optional(S.String),
    ExtendedStatistic: S.optional(S.String),
    Dimensions: S.optional(Dimensions),
    Period: S.optional(S.Number),
    Unit: S.optional(S.String),
    EvaluationPeriods: S.Number,
    DatapointsToAlarm: S.optional(S.Number),
    Threshold: S.optional(S.Number),
    ComparisonOperator: S.String,
    TreatMissingData: S.optional(S.String),
    EvaluateLowSampleCountPercentile: S.optional(S.String),
    Metrics: S.optional(MetricDataQueries),
    Tags: S.optional(TagList),
    ThresholdMetricId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutMetricAlarmResponse extends S.Class<PutMetricAlarmResponse>(
  "PutMetricAlarmResponse",
)({}, ns) {}
export class SetAlarmStateInput extends S.Class<SetAlarmStateInput>(
  "SetAlarmStateInput",
)(
  {
    AlarmName: S.String,
    StateValue: S.String,
    StateReason: S.String,
    StateReasonData: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetAlarmStateResponse extends S.Class<SetAlarmStateResponse>(
  "SetAlarmStateResponse",
)({}, ns) {}
export class StartMetricStreamsInput extends S.Class<StartMetricStreamsInput>(
  "StartMetricStreamsInput",
)(
  { Names: MetricStreamNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMetricStreamsOutput extends S.Class<StartMetricStreamsOutput>(
  "StartMetricStreamsOutput",
)({}, ns) {}
export class StopMetricStreamsInput extends S.Class<StopMetricStreamsInput>(
  "StopMetricStreamsInput",
)(
  { Names: MetricStreamNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopMetricStreamsOutput extends S.Class<StopMetricStreamsOutput>(
  "StopMetricStreamsOutput",
)({}, ns) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}, ns) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}, ns) {}
export const Values = S.Array(S.Number);
export const Counts = S.Array(S.Number);
export const MetricStreamFilterMetricNames = S.Array(S.String);
export const MetricStreamStatisticsAdditionalStatistics = S.Array(S.String);
export class SingleMetricAnomalyDetector extends S.Class<SingleMetricAnomalyDetector>(
  "SingleMetricAnomalyDetector",
)({
  AccountId: S.optional(S.String),
  Namespace: S.optional(S.String),
  MetricName: S.optional(S.String),
  Dimensions: S.optional(Dimensions),
  Stat: S.optional(S.String),
}) {}
export class MetricMathAnomalyDetector extends S.Class<MetricMathAnomalyDetector>(
  "MetricMathAnomalyDetector",
)({ MetricDataQueries: S.optional(MetricDataQueries) }) {}
export const InsightRuleContributorKeyLabels = S.Array(S.String);
export class LabelOptions extends S.Class<LabelOptions>("LabelOptions")({
  Timezone: S.optional(S.String),
}) {}
export class DimensionFilter extends S.Class<DimensionFilter>(
  "DimensionFilter",
)({ Name: S.String, Value: S.optional(S.String) }) {}
export const DimensionFilters = S.Array(DimensionFilter);
export class MetricCharacteristics extends S.Class<MetricCharacteristics>(
  "MetricCharacteristics",
)({ PeriodicSpikes: S.optional(S.Boolean) }) {}
export class ManagedRule extends S.Class<ManagedRule>("ManagedRule")({
  TemplateName: S.String,
  ResourceARN: S.String,
  Tags: S.optional(TagList),
}) {}
export const ManagedRules = S.Array(ManagedRule);
export class MetricStreamFilter extends S.Class<MetricStreamFilter>(
  "MetricStreamFilter",
)({
  Namespace: S.optional(S.String),
  MetricNames: S.optional(MetricStreamFilterMetricNames),
}) {}
export const MetricStreamFilters = S.Array(MetricStreamFilter);
export class DeleteAnomalyDetectorInput extends S.Class<DeleteAnomalyDetectorInput>(
  "DeleteAnomalyDetectorInput",
)(
  {
    Namespace: S.optional(S.String),
    MetricName: S.optional(S.String),
    Dimensions: S.optional(Dimensions),
    Stat: S.optional(S.String),
    SingleMetricAnomalyDetector: S.optional(SingleMetricAnomalyDetector),
    MetricMathAnomalyDetector: S.optional(MetricMathAnomalyDetector),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAnomalyDetectorOutput extends S.Class<DeleteAnomalyDetectorOutput>(
  "DeleteAnomalyDetectorOutput",
)({}, ns) {}
export class MetricAlarm extends S.Class<MetricAlarm>("MetricAlarm")({
  AlarmName: S.optional(S.String),
  AlarmArn: S.optional(S.String),
  AlarmDescription: S.optional(S.String),
  AlarmConfigurationUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ActionsEnabled: S.optional(S.Boolean),
  OKActions: S.optional(ResourceList),
  AlarmActions: S.optional(ResourceList),
  InsufficientDataActions: S.optional(ResourceList),
  StateValue: S.optional(S.String),
  StateReason: S.optional(S.String),
  StateReasonData: S.optional(S.String),
  StateUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  MetricName: S.optional(S.String),
  Namespace: S.optional(S.String),
  Statistic: S.optional(S.String),
  ExtendedStatistic: S.optional(S.String),
  Dimensions: S.optional(Dimensions),
  Period: S.optional(S.Number),
  Unit: S.optional(S.String),
  EvaluationPeriods: S.optional(S.Number),
  DatapointsToAlarm: S.optional(S.Number),
  Threshold: S.optional(S.Number),
  ComparisonOperator: S.optional(S.String),
  TreatMissingData: S.optional(S.String),
  EvaluateLowSampleCountPercentile: S.optional(S.String),
  Metrics: S.optional(MetricDataQueries),
  ThresholdMetricId: S.optional(S.String),
  EvaluationState: S.optional(S.String),
  StateTransitionedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const MetricAlarms = S.Array(MetricAlarm);
export class DescribeAlarmsForMetricOutput extends S.Class<DescribeAlarmsForMetricOutput>(
  "DescribeAlarmsForMetricOutput",
)({ MetricAlarms: S.optional(MetricAlarms) }, ns) {}
export class PartialFailure extends S.Class<PartialFailure>("PartialFailure")({
  FailureResource: S.optional(S.String),
  ExceptionType: S.optional(S.String),
  FailureCode: S.optional(S.String),
  FailureDescription: S.optional(S.String),
}) {}
export const BatchFailures = S.Array(PartialFailure);
export class DisableInsightRulesOutput extends S.Class<DisableInsightRulesOutput>(
  "DisableInsightRulesOutput",
)({ Failures: S.optional(BatchFailures) }, ns) {}
export class EnableInsightRulesOutput extends S.Class<EnableInsightRulesOutput>(
  "EnableInsightRulesOutput",
)({ Failures: S.optional(BatchFailures) }, ns) {}
export class GetDashboardOutput extends S.Class<GetDashboardOutput>(
  "GetDashboardOutput",
)(
  {
    DashboardArn: S.optional(S.String),
    DashboardBody: S.optional(S.String),
    DashboardName: S.optional(S.String),
  },
  ns,
) {}
export class MetricStreamStatisticsMetric extends S.Class<MetricStreamStatisticsMetric>(
  "MetricStreamStatisticsMetric",
)({ Namespace: S.String, MetricName: S.String }) {}
export const MetricStreamStatisticsIncludeMetrics = S.Array(
  MetricStreamStatisticsMetric,
);
export class MetricStreamStatisticsConfiguration extends S.Class<MetricStreamStatisticsConfiguration>(
  "MetricStreamStatisticsConfiguration",
)({
  IncludeMetrics: MetricStreamStatisticsIncludeMetrics,
  AdditionalStatistics: MetricStreamStatisticsAdditionalStatistics,
}) {}
export const MetricStreamStatisticsConfigurations = S.Array(
  MetricStreamStatisticsConfiguration,
);
export class GetMetricStreamOutput extends S.Class<GetMetricStreamOutput>(
  "GetMetricStreamOutput",
)(
  {
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    IncludeFilters: S.optional(MetricStreamFilters),
    ExcludeFilters: S.optional(MetricStreamFilters),
    FirehoseArn: S.optional(S.String),
    RoleArn: S.optional(S.String),
    State: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    OutputFormat: S.optional(S.String),
    StatisticsConfigurations: S.optional(MetricStreamStatisticsConfigurations),
    IncludeLinkedAccountsMetrics: S.optional(S.Boolean),
  },
  ns,
) {}
export class GetMetricWidgetImageOutput extends S.Class<GetMetricWidgetImageOutput>(
  "GetMetricWidgetImageOutput",
)({ MetricWidgetImage: S.optional(T.Blob) }, ns) {}
export class ListMetricsInput extends S.Class<ListMetricsInput>(
  "ListMetricsInput",
)(
  {
    Namespace: S.optional(S.String),
    MetricName: S.optional(S.String),
    Dimensions: S.optional(DimensionFilters),
    NextToken: S.optional(S.String),
    RecentlyActive: S.optional(S.String),
    IncludeLinkedAccounts: S.optional(S.Boolean),
    OwningAccount: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: S.optional(TagList) }, ns) {}
export class PutCompositeAlarmInput extends S.Class<PutCompositeAlarmInput>(
  "PutCompositeAlarmInput",
)(
  {
    ActionsEnabled: S.optional(S.Boolean),
    AlarmActions: S.optional(ResourceList),
    AlarmDescription: S.optional(S.String),
    AlarmName: S.String,
    AlarmRule: S.String,
    InsufficientDataActions: S.optional(ResourceList),
    OKActions: S.optional(ResourceList),
    Tags: S.optional(TagList),
    ActionsSuppressor: S.optional(S.String),
    ActionsSuppressorWaitPeriod: S.optional(S.Number),
    ActionsSuppressorExtensionPeriod: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutCompositeAlarmResponse extends S.Class<PutCompositeAlarmResponse>(
  "PutCompositeAlarmResponse",
)({}, ns) {}
export class PutManagedInsightRulesInput extends S.Class<PutManagedInsightRulesInput>(
  "PutManagedInsightRulesInput",
)(
  { ManagedRules: ManagedRules },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const InsightRuleContributorKeys = S.Array(S.String);
export class Range extends S.Class<Range>("Range")({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const AnomalyDetectorExcludedTimeRanges = S.Array(Range);
export class StatisticSet extends S.Class<StatisticSet>("StatisticSet")({
  SampleCount: S.Number,
  Sum: S.Number,
  Minimum: S.Number,
  Maximum: S.Number,
}) {}
export const ContributorAttributes = S.Record({
  key: S.String,
  value: S.String,
});
export class AlarmHistoryItem extends S.Class<AlarmHistoryItem>(
  "AlarmHistoryItem",
)({
  AlarmName: S.optional(S.String),
  AlarmContributorId: S.optional(S.String),
  AlarmType: S.optional(S.String),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HistoryItemType: S.optional(S.String),
  HistorySummary: S.optional(S.String),
  HistoryData: S.optional(S.String),
  AlarmContributorAttributes: S.optional(ContributorAttributes),
}) {}
export const AlarmHistoryItems = S.Array(AlarmHistoryItem);
export class CompositeAlarm extends S.Class<CompositeAlarm>("CompositeAlarm")({
  ActionsEnabled: S.optional(S.Boolean),
  AlarmActions: S.optional(ResourceList),
  AlarmArn: S.optional(S.String),
  AlarmConfigurationUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AlarmDescription: S.optional(S.String),
  AlarmName: S.optional(S.String),
  AlarmRule: S.optional(S.String),
  InsufficientDataActions: S.optional(ResourceList),
  OKActions: S.optional(ResourceList),
  StateReason: S.optional(S.String),
  StateReasonData: S.optional(S.String),
  StateUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  StateValue: S.optional(S.String),
  StateTransitionedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ActionsSuppressedBy: S.optional(S.String),
  ActionsSuppressedReason: S.optional(S.String),
  ActionsSuppressor: S.optional(S.String),
  ActionsSuppressorWaitPeriod: S.optional(S.Number),
  ActionsSuppressorExtensionPeriod: S.optional(S.Number),
}) {}
export const CompositeAlarms = S.Array(CompositeAlarm);
export class AnomalyDetectorConfiguration extends S.Class<AnomalyDetectorConfiguration>(
  "AnomalyDetectorConfiguration",
)({
  ExcludedTimeRanges: S.optional(AnomalyDetectorExcludedTimeRanges),
  MetricTimezone: S.optional(S.String),
}) {}
export class AnomalyDetector extends S.Class<AnomalyDetector>(
  "AnomalyDetector",
)({
  Namespace: S.optional(S.String),
  MetricName: S.optional(S.String),
  Dimensions: S.optional(Dimensions),
  Stat: S.optional(S.String),
  Configuration: S.optional(AnomalyDetectorConfiguration),
  StateValue: S.optional(S.String),
  MetricCharacteristics: S.optional(MetricCharacteristics),
  SingleMetricAnomalyDetector: S.optional(SingleMetricAnomalyDetector),
  MetricMathAnomalyDetector: S.optional(MetricMathAnomalyDetector),
}) {}
export const AnomalyDetectors = S.Array(AnomalyDetector);
export class InsightRule extends S.Class<InsightRule>("InsightRule")({
  Name: S.String,
  State: S.String,
  Schema: S.String,
  Definition: S.String,
  ManagedRule: S.optional(S.Boolean),
  ApplyOnTransformedLogs: S.optional(S.Boolean),
}) {}
export const InsightRules = S.Array(InsightRule);
export class InsightRuleMetricDatapoint extends S.Class<InsightRuleMetricDatapoint>(
  "InsightRuleMetricDatapoint",
)({
  Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UniqueContributors: S.optional(S.Number),
  MaxContributorValue: S.optional(S.Number),
  SampleCount: S.optional(S.Number),
  Average: S.optional(S.Number),
  Sum: S.optional(S.Number),
  Minimum: S.optional(S.Number),
  Maximum: S.optional(S.Number),
}) {}
export const InsightRuleMetricDatapoints = S.Array(InsightRuleMetricDatapoint);
export class DashboardEntry extends S.Class<DashboardEntry>("DashboardEntry")({
  DashboardName: S.optional(S.String),
  DashboardArn: S.optional(S.String),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Size: S.optional(S.Number),
}) {}
export const DashboardEntries = S.Array(DashboardEntry);
export const Metrics = S.Array(Metric);
export const OwningAccounts = S.Array(S.String);
export class MetricStreamEntry extends S.Class<MetricStreamEntry>(
  "MetricStreamEntry",
)({
  Arn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Name: S.optional(S.String),
  FirehoseArn: S.optional(S.String),
  State: S.optional(S.String),
  OutputFormat: S.optional(S.String),
}) {}
export const MetricStreamEntries = S.Array(MetricStreamEntry);
export class DashboardValidationMessage extends S.Class<DashboardValidationMessage>(
  "DashboardValidationMessage",
)({ DataPath: S.optional(S.String), Message: S.optional(S.String) }) {}
export const DashboardValidationMessages = S.Array(DashboardValidationMessage);
export class MetricDatum extends S.Class<MetricDatum>("MetricDatum")({
  MetricName: S.String,
  Dimensions: S.optional(Dimensions),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Value: S.optional(S.Number),
  StatisticValues: S.optional(StatisticSet),
  Values: S.optional(Values),
  Counts: S.optional(Counts),
  Unit: S.optional(S.String),
  StorageResolution: S.optional(S.Number),
}) {}
export const MetricData = S.Array(MetricDatum);
export const EntityKeyAttributesMap = S.Record({
  key: S.String,
  value: S.String,
});
export const EntityAttributesMap = S.Record({ key: S.String, value: S.String });
export class DeleteInsightRulesOutput extends S.Class<DeleteInsightRulesOutput>(
  "DeleteInsightRulesOutput",
)({ Failures: S.optional(BatchFailures) }, ns) {}
export class DescribeAlarmHistoryOutput extends S.Class<DescribeAlarmHistoryOutput>(
  "DescribeAlarmHistoryOutput",
)(
  {
    AlarmHistoryItems: S.optional(AlarmHistoryItems),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeAlarmsOutput extends S.Class<DescribeAlarmsOutput>(
  "DescribeAlarmsOutput",
)(
  {
    CompositeAlarms: S.optional(CompositeAlarms),
    MetricAlarms: S.optional(MetricAlarms),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeAnomalyDetectorsOutput extends S.Class<DescribeAnomalyDetectorsOutput>(
  "DescribeAnomalyDetectorsOutput",
)(
  {
    AnomalyDetectors: S.optional(AnomalyDetectors),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeInsightRulesOutput extends S.Class<DescribeInsightRulesOutput>(
  "DescribeInsightRulesOutput",
)(
  { NextToken: S.optional(S.String), InsightRules: S.optional(InsightRules) },
  ns,
) {}
export class ListDashboardsOutput extends S.Class<ListDashboardsOutput>(
  "ListDashboardsOutput",
)(
  {
    DashboardEntries: S.optional(DashboardEntries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListMetricsOutput extends S.Class<ListMetricsOutput>(
  "ListMetricsOutput",
)(
  {
    Metrics: S.optional(Metrics),
    NextToken: S.optional(S.String),
    OwningAccounts: S.optional(OwningAccounts),
  },
  ns,
) {}
export class ListMetricStreamsOutput extends S.Class<ListMetricStreamsOutput>(
  "ListMetricStreamsOutput",
)(
  { NextToken: S.optional(S.String), Entries: S.optional(MetricStreamEntries) },
  ns,
) {}
export class PutAnomalyDetectorInput extends S.Class<PutAnomalyDetectorInput>(
  "PutAnomalyDetectorInput",
)(
  {
    Namespace: S.optional(S.String),
    MetricName: S.optional(S.String),
    Dimensions: S.optional(Dimensions),
    Stat: S.optional(S.String),
    Configuration: S.optional(AnomalyDetectorConfiguration),
    MetricCharacteristics: S.optional(MetricCharacteristics),
    SingleMetricAnomalyDetector: S.optional(SingleMetricAnomalyDetector),
    MetricMathAnomalyDetector: S.optional(MetricMathAnomalyDetector),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutAnomalyDetectorOutput extends S.Class<PutAnomalyDetectorOutput>(
  "PutAnomalyDetectorOutput",
)({}, ns) {}
export class PutDashboardOutput extends S.Class<PutDashboardOutput>(
  "PutDashboardOutput",
)(
  { DashboardValidationMessages: S.optional(DashboardValidationMessages) },
  ns,
) {}
export class PutManagedInsightRulesOutput extends S.Class<PutManagedInsightRulesOutput>(
  "PutManagedInsightRulesOutput",
)({ Failures: S.optional(BatchFailures) }, ns) {}
export class PutMetricStreamInput extends S.Class<PutMetricStreamInput>(
  "PutMetricStreamInput",
)(
  {
    Name: S.String,
    IncludeFilters: S.optional(MetricStreamFilters),
    ExcludeFilters: S.optional(MetricStreamFilters),
    FirehoseArn: S.String,
    RoleArn: S.String,
    OutputFormat: S.String,
    Tags: S.optional(TagList),
    StatisticsConfigurations: S.optional(MetricStreamStatisticsConfigurations),
    IncludeLinkedAccountsMetrics: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InsightRuleContributorDatapoint extends S.Class<InsightRuleContributorDatapoint>(
  "InsightRuleContributorDatapoint",
)({
  Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ApproximateValue: S.Number,
}) {}
export const InsightRuleContributorDatapoints = S.Array(
  InsightRuleContributorDatapoint,
);
export const DatapointValueMap = S.Record({ key: S.String, value: S.Number });
export class ManagedRuleState extends S.Class<ManagedRuleState>(
  "ManagedRuleState",
)({ RuleName: S.String, State: S.String }) {}
export class Entity extends S.Class<Entity>("Entity")({
  KeyAttributes: S.optional(EntityKeyAttributesMap),
  Attributes: S.optional(EntityAttributesMap),
}) {}
export class AlarmContributor extends S.Class<AlarmContributor>(
  "AlarmContributor",
)({
  ContributorId: S.String,
  ContributorAttributes: ContributorAttributes,
  StateReason: S.String,
  StateTransitionedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const AlarmContributors = S.Array(AlarmContributor);
export class InsightRuleContributor extends S.Class<InsightRuleContributor>(
  "InsightRuleContributor",
)({
  Keys: InsightRuleContributorKeys,
  ApproximateAggregateValue: S.Number,
  Datapoints: InsightRuleContributorDatapoints,
}) {}
export const InsightRuleContributors = S.Array(InsightRuleContributor);
export class Datapoint extends S.Class<Datapoint>("Datapoint")({
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SampleCount: S.optional(S.Number),
  Average: S.optional(S.Number),
  Sum: S.optional(S.Number),
  Minimum: S.optional(S.Number),
  Maximum: S.optional(S.Number),
  Unit: S.optional(S.String),
  ExtendedStatistics: S.optional(DatapointValueMap),
}) {}
export const Datapoints = S.Array(Datapoint);
export class ManagedRuleDescription extends S.Class<ManagedRuleDescription>(
  "ManagedRuleDescription",
)({
  TemplateName: S.optional(S.String),
  ResourceARN: S.optional(S.String),
  RuleState: S.optional(ManagedRuleState),
}) {}
export const ManagedRuleDescriptions = S.Array(ManagedRuleDescription);
export class EntityMetricData extends S.Class<EntityMetricData>(
  "EntityMetricData",
)({ Entity: S.optional(Entity), MetricData: S.optional(MetricData) }) {}
export const EntityMetricDataList = S.Array(EntityMetricData);
export class DescribeAlarmContributorsOutput extends S.Class<DescribeAlarmContributorsOutput>(
  "DescribeAlarmContributorsOutput",
)(
  { AlarmContributors: AlarmContributors, NextToken: S.optional(S.String) },
  ns,
) {}
export class GetInsightRuleReportOutput extends S.Class<GetInsightRuleReportOutput>(
  "GetInsightRuleReportOutput",
)(
  {
    KeyLabels: S.optional(InsightRuleContributorKeyLabels),
    AggregationStatistic: S.optional(S.String),
    AggregateValue: S.optional(S.Number),
    ApproximateUniqueCount: S.optional(S.Number),
    Contributors: S.optional(InsightRuleContributors),
    MetricDatapoints: S.optional(InsightRuleMetricDatapoints),
  },
  ns,
) {}
export class GetMetricDataInput extends S.Class<GetMetricDataInput>(
  "GetMetricDataInput",
)(
  {
    MetricDataQueries: MetricDataQueries,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    NextToken: S.optional(S.String),
    ScanBy: S.optional(S.String),
    MaxDatapoints: S.optional(S.Number),
    LabelOptions: S.optional(LabelOptions),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMetricStatisticsOutput extends S.Class<GetMetricStatisticsOutput>(
  "GetMetricStatisticsOutput",
)({ Label: S.optional(S.String), Datapoints: S.optional(Datapoints) }, ns) {}
export class ListManagedInsightRulesOutput extends S.Class<ListManagedInsightRulesOutput>(
  "ListManagedInsightRulesOutput",
)(
  {
    ManagedRules: S.optional(ManagedRuleDescriptions),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class PutMetricDataInput extends S.Class<PutMetricDataInput>(
  "PutMetricDataInput",
)(
  {
    Namespace: S.String,
    MetricData: S.optional(MetricData),
    EntityMetricData: S.optional(EntityMetricDataList),
    StrictEntityValidation: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutMetricDataResponse extends S.Class<PutMetricDataResponse>(
  "PutMetricDataResponse",
)({}, ns) {}
export class PutMetricStreamOutput extends S.Class<PutMetricStreamOutput>(
  "PutMetricStreamOutput",
)({ Arn: S.optional(S.String) }, ns) {}
export const Timestamps = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export const DatapointValues = S.Array(S.Number);
export class MessageData extends S.Class<MessageData>("MessageData")({
  Code: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const MetricDataResultMessages = S.Array(MessageData);
export class MetricDataResult extends S.Class<MetricDataResult>(
  "MetricDataResult",
)({
  Id: S.optional(S.String),
  Label: S.optional(S.String),
  Timestamps: S.optional(Timestamps),
  Values: S.optional(DatapointValues),
  StatusCode: S.optional(S.String),
  Messages: S.optional(MetricDataResultMessages),
}) {}
export const MetricDataResults = S.Array(MetricDataResult);
export class GetMetricDataOutput extends S.Class<GetMetricDataOutput>(
  "GetMetricDataOutput",
)(
  {
    MetricDataResults: S.optional(MetricDataResults),
    NextToken: S.optional(S.String),
    Messages: S.optional(MetricDataResultMessages),
  },
  ns,
) {}

//# Errors
export class InternalServiceFault extends S.TaggedError<InternalServiceFault>()(
  "InternalServiceFault",
  {},
  T.AwsQueryError({ code: "InternalServiceError", httpResponseCode: 500 }),
) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  {},
  T.AwsQueryError({ code: "InvalidParameterValue", httpResponseCode: 400 }),
) {}
export class MissingRequiredParameterException extends S.TaggedError<MissingRequiredParameterException>()(
  "MissingRequiredParameterException",
  {},
  T.AwsQueryError({ code: "MissingParameter", httpResponseCode: 400 }),
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  {},
  T.AwsQueryError({
    code: "ConcurrentModificationException",
    httpResponseCode: 429,
  }),
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ResourceNotFound extends S.TaggedError<ResourceNotFound>()(
  "ResourceNotFound",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFound", httpResponseCode: 404 }),
) {}
export class DashboardNotFoundError extends S.TaggedError<DashboardNotFoundError>()(
  "DashboardNotFoundError",
  {},
  T.AwsQueryError({ code: "ResourceNotFound", httpResponseCode: 404 }),
) {}
export class InvalidParameterCombinationException extends S.TaggedError<InvalidParameterCombinationException>()(
  "InvalidParameterCombinationException",
  {},
  T.AwsQueryError({
    code: "InvalidParameterCombination",
    httpResponseCode: 400,
  }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
) {}
export class LimitExceededFault extends S.TaggedError<LimitExceededFault>()(
  "LimitExceededFault",
  {},
  T.AwsQueryError({ code: "LimitExceeded", httpResponseCode: 400 }),
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
  T.AwsQueryError({ code: "LimitExceededException", httpResponseCode: 400 }),
) {}
export class InvalidFormatFault extends S.TaggedError<InvalidFormatFault>()(
  "InvalidFormatFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidFormat", httpResponseCode: 400 }),
) {}
export class InvalidNextToken extends S.TaggedError<InvalidNextToken>()(
  "InvalidNextToken",
  {},
  T.AwsQueryError({ code: "InvalidNextToken", httpResponseCode: 400 }),
) {}
export class DashboardInvalidInputError extends S.TaggedError<DashboardInvalidInputError>()(
  "DashboardInvalidInputError",
  {
    message: S.optional(S.String),
    dashboardValidationMessages: S.optional(DashboardValidationMessages),
  },
  T.AwsQueryError({ code: "InvalidParameterInput", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * Disables the actions for the specified alarms. When an alarm's actions are
 * disabled, the alarm actions do not execute when the alarm state changes.
 */
export const disableAlarmActions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableAlarmActionsInput,
  output: DisableAlarmActionsResponse,
  errors: [],
}));
/**
 * Enables the actions for the specified alarms.
 */
export const enableAlarmActions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableAlarmActionsInput,
  output: EnableAlarmActionsResponse,
  errors: [],
}));
/**
 * Stops the streaming of metrics for one or more of your metric streams.
 */
export const stopMetricStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopMetricStreamsInput,
  output: StopMetricStreamsOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterValueException,
    MissingRequiredParameterException,
  ],
}));
/**
 * Deletes the specified alarms. You can delete up to 100 alarms in one operation.
 * However, this total can include no more than one composite alarm. For example, you could
 * delete 99 metric alarms and one composite alarms with one operation, but you can't
 * delete two composite alarms with one operation.
 *
 * If you specify any incorrect alarm names, the alarms you specify with correct names are still deleted. Other syntax errors might result
 * in no alarms being deleted. To confirm that alarms were deleted successfully, you can use the
 * DescribeAlarms operation after using `DeleteAlarms`.
 *
 * It is possible to create a loop or cycle of composite alarms, where composite
 * alarm A depends on composite alarm B, and composite alarm B also depends on
 * composite alarm A. In this scenario, you can't delete any composite alarm that is
 * part of the cycle because there is always still a composite alarm that depends on
 * that alarm that you want to delete.
 *
 * To get out of such a situation, you must break the cycle by changing the rule of
 * one of the composite alarms in the cycle to remove a dependency that creates the
 * cycle. The simplest change to make to break a cycle is to change the
 * `AlarmRule` of one of the alarms to `false`.
 *
 * Additionally, the evaluation of composite alarms stops if CloudWatch
 * detects a cycle in the evaluation path.
 */
export const deleteAlarms = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAlarmsInput,
  output: DeleteAlarmsResponse,
  errors: [ResourceNotFound],
}));
/**
 * Permanently deletes the metric stream that you specify.
 */
export const deleteMetricStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMetricStreamInput,
  output: DeleteMetricStreamOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterValueException,
    MissingRequiredParameterException,
  ],
}));
/**
 * Retrieves the alarms for the specified metric. To filter the results, specify a
 * statistic, period, or unit.
 *
 * This operation retrieves only standard alarms that are based on the specified
 * metric. It does not return alarms based on math expressions that use the specified
 * metric, or composite alarms that use the specified metric.
 */
export const describeAlarmsForMetric = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAlarmsForMetricInput,
    output: DescribeAlarmsForMetricOutput,
    errors: [],
  }),
);
/**
 * Disables the specified Contributor Insights rules. When rules are disabled, they do
 * not analyze log groups and do not incur costs.
 */
export const disableInsightRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableInsightRulesInput,
  output: DisableInsightRulesOutput,
  errors: [InvalidParameterValueException, MissingRequiredParameterException],
}));
/**
 * Displays the details of the dashboard that you specify.
 *
 * To copy an existing dashboard, use `GetDashboard`, and then use the data
 * returned within `DashboardBody` as the template for the new dashboard when
 * you call `PutDashboard` to create the copy.
 */
export const getDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDashboardInput,
  output: GetDashboardOutput,
  errors: [
    DashboardNotFoundError,
    InternalServiceFault,
    InvalidParameterValueException,
  ],
}));
/**
 * Returns information about the metric stream that you specify.
 */
export const getMetricStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetricStreamInput,
  output: GetMetricStreamOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    MissingRequiredParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * You can use the `GetMetricWidgetImage` API to retrieve a snapshot graph
 * of one or more Amazon CloudWatch metrics as a bitmap image. You can then embed this
 * image into your services and products, such as wiki pages, reports, and documents. You
 * could also retrieve images regularly, such as every minute, and create your own custom
 * live dashboard.
 *
 * The graph you retrieve can include all CloudWatch metric graph features, including
 * metric math and horizontal and vertical annotations.
 *
 * There is a limit of 20 transactions per second for this API. Each
 * `GetMetricWidgetImage` action has the following limits:
 *
 * - As many as 100 metrics in the graph.
 *
 * - Up to 100 KB uncompressed payload.
 */
export const getMetricWidgetImage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMetricWidgetImageInput,
    output: GetMetricWidgetImageOutput,
    errors: [],
  }),
);
/**
 * Displays the tags associated with a CloudWatch resource. Currently, alarms and
 * Contributor Insights rules support tagging.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterValueException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates or updates a *composite alarm*. When you create a composite
 * alarm, you specify a rule expression for the alarm that takes into account the alarm
 * states of other alarms that you have created. The composite alarm goes into ALARM state
 * only if all conditions of the rule are met.
 *
 * The alarms specified in a composite alarm's rule expression can include metric alarms
 * and other composite alarms. The rule expression of a composite alarm can include as many
 * as 100 underlying alarms. Any single alarm can be included in the rule expressions of as
 * many as 150 composite alarms.
 *
 * Using composite alarms can reduce alarm noise. You can create multiple metric alarms,
 * and also create a composite alarm and set up alerts only for the composite alarm. For
 * example, you could create a composite alarm that goes into ALARM state only when more
 * than one of the underlying metric alarms are in ALARM state.
 *
 * Composite alarms can take the following actions:
 *
 * - Notify Amazon SNS topics.
 *
 * - Invoke Lambda functions.
 *
 * - Create OpsItems in Systems Manager Ops Center.
 *
 * - Create incidents in Systems Manager Incident Manager.
 *
 * It is possible to create a loop or cycle of composite alarms, where composite
 * alarm A depends on composite alarm B, and composite alarm B also depends on
 * composite alarm A. In this scenario, you can't delete any composite alarm that is
 * part of the cycle because there is always still a composite alarm that depends on
 * that alarm that you want to delete.
 *
 * To get out of such a situation, you must break the cycle by changing the rule of
 * one of the composite alarms in the cycle to remove a dependency that creates the
 * cycle. The simplest change to make to break a cycle is to change the
 * `AlarmRule` of one of the alarms to `false`.
 *
 * Additionally, the evaluation of composite alarms stops if CloudWatch detects a
 * cycle in the evaluation path.
 *
 * When this operation creates an alarm, the alarm state is immediately set to
 * `INSUFFICIENT_DATA`. The alarm is then evaluated and its state is set
 * appropriately. Any actions associated with the new state are then executed. For a
 * composite alarm, this initial time after creation is the only time that the alarm can be
 * in `INSUFFICIENT_DATA` state.
 *
 * When you update an existing alarm, its state is left unchanged, but the update
 * completely overwrites the previous configuration of the alarm.
 *
 * To use this operation, you must be signed on with the
 * `cloudwatch:PutCompositeAlarm` permission that is scoped to
 * `*`. You can't create a composite alarms if your
 * `cloudwatch:PutCompositeAlarm` permission has a narrower scope.
 *
 * If you are an IAM user, you must have
 * `iam:CreateServiceLinkedRole` to create a composite alarm that has
 * Systems Manager OpsItem actions.
 */
export const putCompositeAlarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutCompositeAlarmInput,
  output: PutCompositeAlarmResponse,
  errors: [LimitExceededFault],
}));
/**
 * Creates a Contributor Insights rule. Rules evaluate log events in a CloudWatch Logs
 * log group, enabling you to find contributor data for the log events in that log group.
 * For more information, see Using Contributor
 * Insights to Analyze High-Cardinality Data.
 *
 * If you create a rule, delete it, and then re-create it with the same name, historical
 * data from the first time the rule was created might not be available.
 */
export const putInsightRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutInsightRuleInput,
  output: PutInsightRuleOutput,
  errors: [
    InvalidParameterValueException,
    LimitExceededException,
    MissingRequiredParameterException,
  ],
}));
/**
 * Creates or updates an alarm and associates it with the specified metric, metric
 * math expression, anomaly detection model, or Metrics Insights query. For more
 * information about using a Metrics Insights query for an alarm, see Create
 * alarms on Metrics Insights queries.
 *
 * Alarms based on anomaly detection models cannot have Auto Scaling actions.
 *
 * When this operation creates an alarm, the alarm state is immediately set to
 * `INSUFFICIENT_DATA`. The alarm is then evaluated and its state is set
 * appropriately. Any actions associated with the new state are then executed.
 *
 * When you update an existing alarm, its state is left unchanged, but the update
 * completely overwrites the previous configuration of the alarm.
 *
 * If you are an IAM user, you must have Amazon EC2 permissions for
 * some alarm operations:
 *
 * - The `iam:CreateServiceLinkedRole` permission for all alarms with
 * EC2 actions
 *
 * - The `iam:CreateServiceLinkedRole` permissions to create an alarm
 * with Systems Manager OpsItem or response plan actions.
 *
 * The first time you create an alarm in the Amazon Web Services Management Console, the CLI, or by using the PutMetricAlarm API, CloudWatch creates the necessary
 * service-linked role for you. The service-linked roles are called
 * `AWSServiceRoleForCloudWatchEvents` and
 * `AWSServiceRoleForCloudWatchAlarms_ActionSSM`. For more information, see
 * Amazon Web Services service-linked role.
 *
 * Each `PutMetricAlarm` action has a maximum uncompressed payload of 120
 * KB.
 *
 * **Cross-account alarms**
 *
 * You can set an alarm on metrics in the current account, or in another account. To
 * create a cross-account alarm that watches a metric in a different account, you must have
 * completed the following pre-requisites:
 *
 * - The account where the metrics are located (the sharing
 * account) must already have a sharing role named **CloudWatch-CrossAccountSharingRole**. If it does not
 * already have this role, you must create it using the instructions in **Set up a sharing account** in Cross-account cross-Region CloudWatch console. The policy
 * for that role must grant access to the ID of the account where you are creating
 * the alarm.
 *
 * - The account where you are creating the alarm (the monitoring
 * account) must already have a service-linked role named **AWSServiceRoleForCloudWatchCrossAccount** to allow
 * CloudWatch to assume the sharing role in the sharing account. If it
 * does not, you must create it following the directions in **Set up a monitoring account** in Cross-account cross-Region CloudWatch console.
 */
export const putMetricAlarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMetricAlarmInput,
  output: PutMetricAlarmResponse,
  errors: [LimitExceededFault],
}));
/**
 * Temporarily sets the state of an alarm for testing purposes. When the updated state
 * differs from the previous value, the action configured for the appropriate state is
 * invoked. For example, if your alarm is configured to send an Amazon SNS message when an
 * alarm is triggered, temporarily changing the alarm state to `ALARM` sends an
 * SNS message.
 *
 * Metric alarms returns to their actual state quickly, often within seconds. Because
 * the metric alarm state change happens quickly, it is typically only visible in the
 * alarm's **History** tab in the Amazon CloudWatch console or
 * through DescribeAlarmHistory.
 *
 * If you use `SetAlarmState` on a composite alarm, the composite alarm is
 * not guaranteed to return to its actual state. It returns to its actual state only once
 * any of its children alarms change state. It is also reevaluated if you update its
 * configuration.
 *
 * If an alarm triggers EC2 Auto Scaling policies or application Auto Scaling
 * policies, you must include information in the `StateReasonData` parameter to
 * enable the policy to take the correct action.
 */
export const setAlarmState = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetAlarmStateInput,
  output: SetAlarmStateResponse,
  errors: [InvalidFormatFault, ResourceNotFound],
}));
/**
 * Starts the streaming of metrics for one or more of your metric streams.
 */
export const startMetricStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMetricStreamsInput,
  output: StartMetricStreamsOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterValueException,
    MissingRequiredParameterException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified CloudWatch resource.
 * Currently, the only CloudWatch resources that can be tagged are alarms and Contributor
 * Insights rules.
 *
 * Tags can help you organize and categorize your resources. You can also use them to
 * scope user permissions by granting a user permission to access or change only resources
 * with certain tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted
 * strictly as strings of characters.
 *
 * You can use the `TagResource` action with an alarm that already has tags.
 * If you specify a new tag key for the alarm, this tag is appended to the list of tags
 * associated with the alarm. If you specify a tag key that is already associated with the
 * alarm, the new tag value that you specify replaces the previous value for that
 * tag.
 *
 * You can associate as many as 50 tags with a CloudWatch resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    ConcurrentModificationException,
    ConflictException,
    InternalServiceFault,
    InvalidParameterValueException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    ConcurrentModificationException,
    ConflictException,
    InternalServiceFault,
    InvalidParameterValueException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified anomaly detection model from your account. For more information
 * about how to delete an anomaly detection model, see Deleting an anomaly detection model in the CloudWatch User
 * Guide.
 */
export const deleteAnomalyDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAnomalyDetectorInput,
    output: DeleteAnomalyDetectorOutput,
    errors: [
      InternalServiceFault,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
      MissingRequiredParameterException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes all dashboards that you specify. You can specify up to 100 dashboards to
 * delete. If there is an error during this call, no dashboards are deleted.
 */
export const deleteDashboards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDashboardsInput,
  output: DeleteDashboardsOutput,
  errors: [
    ConflictException,
    DashboardNotFoundError,
    InternalServiceFault,
    InvalidParameterValueException,
  ],
}));
/**
 * Permanently deletes the specified Contributor Insights rules.
 *
 * If you create a rule, delete it, and then re-create it with the same name, historical
 * data from the first time the rule was created might not be available.
 */
export const deleteInsightRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInsightRulesInput,
  output: DeleteInsightRulesOutput,
  errors: [InvalidParameterValueException, MissingRequiredParameterException],
}));
/**
 * Retrieves the specified alarms. You can filter the results by specifying a prefix
 * for the alarm name, the alarm state, or a prefix for any action.
 *
 * To use this operation and return information about composite alarms, you must be
 * signed on with the `cloudwatch:DescribeAlarms` permission that is scoped to
 * `*`. You can't return information about composite alarms if your
 * `cloudwatch:DescribeAlarms` permission has a narrower scope.
 */
export const describeAlarms = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAlarmsInput,
  output: DescribeAlarmsOutput,
  errors: [InvalidNextToken],
}));
/**
 * Lists the anomaly detection models that you have created in your account. For single
 * metric anomaly detectors, you can list all of the models in your account or filter the
 * results to only the models that are related to a certain namespace, metric name, or
 * metric dimension. For metric math anomaly detectors, you can list them by adding
 * `METRIC_MATH` to the `AnomalyDetectorTypes` array. This will
 * return all metric math anomaly detectors in your account.
 */
export const describeAnomalyDetectors = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAnomalyDetectorsInput,
    output: DescribeAnomalyDetectorsOutput,
    errors: [
      InternalServiceFault,
      InvalidNextToken,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }),
);
/**
 * Returns a list of all the Contributor Insights rules in your account.
 *
 * For more information about Contributor Insights, see Using Contributor
 * Insights to Analyze High-Cardinality Data.
 */
export const describeInsightRules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInsightRulesInput,
    output: DescribeInsightRulesOutput,
    errors: [InvalidNextToken],
  }),
);
/**
 * Enables the specified Contributor Insights rules. When rules are enabled, they
 * immediately begin analyzing log data.
 */
export const enableInsightRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableInsightRulesInput,
  output: EnableInsightRulesOutput,
  errors: [
    InvalidParameterValueException,
    LimitExceededException,
    MissingRequiredParameterException,
  ],
}));
/**
 * Returns a list of the dashboards for your account. If you include
 * `DashboardNamePrefix`, only those dashboards with names starting with the
 * prefix are listed. Otherwise, all dashboards in your account are listed.
 *
 * `ListDashboards` returns up to 1000 results on one page. If there are
 * more than 1000 dashboards, you can call `ListDashboards` again and include
 * the value you received for `NextToken` in the first call, to receive the next
 * 1000 results.
 */
export const listDashboards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDashboardsInput,
  output: ListDashboardsOutput,
  errors: [InternalServiceFault, InvalidParameterValueException],
}));
/**
 * List the specified metrics. You can use the returned metrics with GetMetricData or GetMetricStatistics to get statistical data.
 *
 * Up to 500 results are returned for any one call. To retrieve additional results,
 * use the returned token with subsequent calls.
 *
 * After you create a metric, allow up to 15 minutes for the metric to appear. To see
 * metric statistics sooner, use GetMetricData or GetMetricStatistics.
 *
 * If you are using CloudWatch cross-account observability, you can use this
 * operation in a monitoring account and view metrics from the linked source accounts. For
 * more information, see CloudWatch cross-account observability.
 *
 * `ListMetrics` doesn't return information about metrics if those metrics
 * haven't reported data in the past two weeks. To retrieve those metrics, use GetMetricData or GetMetricStatistics.
 */
export const listMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMetricsInput,
  output: ListMetricsOutput,
  errors: [InternalServiceFault, InvalidParameterValueException],
}));
/**
 * Returns a list of metric streams in this account.
 */
export const listMetricStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMetricStreamsInput,
  output: ListMetricStreamsOutput,
  errors: [
    InternalServiceFault,
    InvalidNextToken,
    InvalidParameterValueException,
    MissingRequiredParameterException,
  ],
}));
/**
 * Creates an anomaly detection model for a CloudWatch metric. You can use the model to
 * display a band of expected normal values when the metric is graphed.
 *
 * If you have enabled unified cross-account observability, and this account is a
 * monitoring account, the metric can be in the same account or a source account. You can
 * specify the account ID in the object you specify in the
 * `SingleMetricAnomalyDetector` parameter.
 *
 * For more information, see CloudWatch Anomaly Detection.
 */
export const putAnomalyDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAnomalyDetectorInput,
  output: PutAnomalyDetectorOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingRequiredParameterException,
  ],
}));
/**
 * Creates a managed Contributor Insights rule for a specified Amazon Web Services
 * resource. When you enable a managed rule, you create a Contributor Insights rule that
 * collects data from Amazon Web Services services. You cannot edit these rules with
 * `PutInsightRule`. The rules can be enabled, disabled, and deleted using
 * `EnableInsightRules`, `DisableInsightRules`, and
 * `DeleteInsightRules`. If a previously created managed rule is currently
 * disabled, a subsequent call to this API will re-enable it. Use
 * `ListManagedInsightRules` to describe all available rules.
 */
export const putManagedInsightRules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutManagedInsightRulesInput,
    output: PutManagedInsightRulesOutput,
    errors: [InvalidParameterValueException, MissingRequiredParameterException],
  }),
);
/**
 * Returns the information of the current alarm contributors that are in `ALARM` state. This operation returns details about the individual time series that contribute to the alarm's state.
 */
export const describeAlarmContributors = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAlarmContributorsInput,
    output: DescribeAlarmContributorsOutput,
    errors: [InvalidNextToken, ResourceNotFoundException],
  }),
);
/**
 * Retrieves the history for the specified alarm. You can filter the results by date
 * range or item type. If an alarm name is not specified, the histories for either all
 * metric alarms or all composite alarms are returned.
 *
 * CloudWatch retains the history of an alarm even if you delete the alarm.
 *
 * To use this operation and return information about a composite alarm, you must be
 * signed on with the `cloudwatch:DescribeAlarmHistory` permission that is
 * scoped to `*`. You can't return information about composite alarms if your
 * `cloudwatch:DescribeAlarmHistory` permission has a narrower scope.
 */
export const describeAlarmHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAlarmHistoryInput,
    output: DescribeAlarmHistoryOutput,
    errors: [InvalidNextToken],
  }),
);
/**
 * This operation returns the time series data collected by a Contributor Insights rule.
 * The data includes the identity and number of contributors to the log group.
 *
 * You can also optionally return one or more statistics about each data point in the
 * time series. These statistics can include the following:
 *
 * - `UniqueContributors` -- the number of unique contributors for each
 * data point.
 *
 * - `MaxContributorValue` -- the value of the top contributor for each
 * data point. The identity of the contributor might change for each data point in
 * the graph.
 *
 * If this rule aggregates by COUNT, the top contributor for each data point is
 * the contributor with the most occurrences in that period. If the rule aggregates
 * by SUM, the top contributor is the contributor with the highest sum in the log
 * field specified by the rule's `Value`, during that period.
 *
 * - `SampleCount` -- the number of data points matched by the
 * rule.
 *
 * - `Sum` -- the sum of the values from all contributors during the
 * time period represented by that data point.
 *
 * - `Minimum` -- the minimum value from a single observation during the
 * time period represented by that data point.
 *
 * - `Maximum` -- the maximum value from a single observation during the
 * time period represented by that data point.
 *
 * - `Average` -- the average value from all contributors during the
 * time period represented by that data point.
 */
export const getInsightRuleReport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetInsightRuleReportInput,
    output: GetInsightRuleReportOutput,
    errors: [
      InvalidParameterValueException,
      MissingRequiredParameterException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets statistics for the specified metric.
 *
 * The maximum number of data points returned from a single call is 1,440. If you
 * request more than 1,440 data points, CloudWatch returns an error. To reduce the number
 * of data points, you can narrow the specified time range and make multiple requests
 * across adjacent time ranges, or you can increase the specified period. Data points are
 * not returned in chronological order.
 *
 * CloudWatch aggregates data points based on the length of the period that you
 * specify. For example, if you request statistics with a one-hour period, CloudWatch
 * aggregates all data points with time stamps that fall within each one-hour period.
 * Therefore, the number of values aggregated by CloudWatch is larger than the number of
 * data points returned.
 *
 * CloudWatch needs raw data points to calculate percentile statistics. If you publish
 * data using a statistic set instead, you can only retrieve percentile statistics for this
 * data if one of the following conditions is true:
 *
 * - The SampleCount value of the statistic set is 1.
 *
 * - The Min and the Max values of the statistic set are equal.
 *
 * Percentile statistics are not available for metrics when any of the metric values
 * are negative numbers.
 *
 * Amazon CloudWatch retains metric data as follows:
 *
 * - Data points with a period of less than 60 seconds are available for 3
 * hours. These data points are high-resolution metrics and are available only for
 * custom metrics that have been defined with a `StorageResolution` of
 * 1.
 *
 * - Data points with a period of 60 seconds (1-minute) are available for 15
 * days.
 *
 * - Data points with a period of 300 seconds (5-minute) are available for 63
 * days.
 *
 * - Data points with a period of 3600 seconds (1 hour) are available for 455
 * days (15 months).
 *
 * Data points that are initially published with a shorter period are aggregated
 * together for long-term storage. For example, if you collect data using a period of 1
 * minute, the data remains available for 15 days with 1-minute resolution. After 15 days,
 * this data is still available, but is aggregated and retrievable only with a resolution
 * of 5 minutes. After 63 days, the data is further aggregated and is available with a
 * resolution of 1 hour.
 *
 * CloudWatch started retaining 5-minute and 1-hour metric data as of July 9,
 * 2016.
 *
 * For information about metrics and dimensions supported by Amazon Web Services
 * services, see the Amazon CloudWatch
 * Metrics and Dimensions Reference in the Amazon CloudWatch User
 * Guide.
 */
export const getMetricStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetricStatisticsInput,
  output: GetMetricStatisticsOutput,
  errors: [
    InternalServiceFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    MissingRequiredParameterException,
  ],
}));
/**
 * Returns a list that contains the number of managed Contributor Insights rules in your
 * account.
 */
export const listManagedInsightRules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListManagedInsightRulesInput,
    output: ListManagedInsightRulesOutput,
    errors: [
      InvalidNextToken,
      InvalidParameterValueException,
      MissingRequiredParameterException,
    ],
  }),
);
/**
 * Creates a dashboard if it does not already exist, or updates an existing dashboard.
 * If you update a dashboard, the entire contents are replaced with what you specify
 * here.
 *
 * All dashboards in your account are global, not region-specific.
 *
 * A simple way to create a dashboard using `PutDashboard` is to copy an
 * existing dashboard. To copy an existing dashboard using the console, you can load the
 * dashboard and then use the View/edit source command in the Actions menu to display the
 * JSON block for that dashboard. Another way to copy a dashboard is to use
 * `GetDashboard`, and then use the data returned within
 * `DashboardBody` as the template for the new dashboard when you call
 * `PutDashboard`.
 *
 * When you create a dashboard with `PutDashboard`, a good practice is to
 * add a text widget at the top of the dashboard with a message that the dashboard was
 * created by script and should not be changed in the console. This message could also
 * point console users to the location of the `DashboardBody` script or the
 * CloudFormation template used to create the dashboard.
 */
export const putDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDashboardInput,
  output: PutDashboardOutput,
  errors: [ConflictException, DashboardInvalidInputError, InternalServiceFault],
}));
/**
 * Publishes metric data to Amazon CloudWatch. CloudWatch associates the data with the
 * specified metric. If the specified metric does not exist, CloudWatch creates the metric.
 * When CloudWatch creates a metric, it can take up to fifteen minutes for the metric to
 * appear in calls to ListMetrics.
 *
 * You can publish metrics with associated entity data (so that related telemetry can be
 * found and viewed together), or publish metric data by itself. To send entity data with
 * your metrics, use the `EntityMetricData` parameter. To send metrics without
 * entity data, use the `MetricData` parameter. The
 * `EntityMetricData` structure includes `MetricData` structures
 * for the metric data.
 *
 * You can publish either individual values in the `Value` field, or arrays of
 * values and the number of times each value occurred during the period by using the
 * `Values` and `Counts` fields in the `MetricData`
 * structure. Using the `Values` and `Counts` method enables you to
 * publish up to 150 values per metric with one `PutMetricData` request, and
 * supports retrieving percentile statistics on this data.
 *
 * Each `PutMetricData` request is limited to 1 MB in size for HTTP POST
 * requests. You can send a payload compressed by gzip. Each request is also limited to no
 * more than 1000 different metrics (across both the `MetricData` and
 * `EntityMetricData` properties).
 *
 * Although the `Value` parameter accepts numbers of type `Double`,
 * CloudWatch rejects values that are either too small or too large. Values must be in the
 * range of -2^360 to 2^360. In addition, special values (for example, NaN, +Infinity,
 * -Infinity) are not supported.
 *
 * You can use up to 30 dimensions per metric to further clarify what data the metric
 * collects. Each dimension consists of a Name and Value pair. For more information about
 * specifying dimensions, see Publishing
 * Metrics in the *Amazon CloudWatch User Guide*.
 *
 * You specify the time stamp to be associated with each data point. You can specify time
 * stamps that are as much as two weeks before the current date, and as much as 2 hours
 * after the current day and time.
 *
 * Data points with time stamps from 24 hours ago or longer can take at least 48 hours to
 * become available for GetMetricData or GetMetricStatistics from the time they are submitted. Data points with time
 * stamps between 3 and 24 hours ago can take as much as 2 hours to become available for
 * GetMetricData or GetMetricStatistics.
 *
 * CloudWatch needs raw data points to calculate percentile statistics. If you publish
 * data using a statistic set instead, you can only retrieve percentile statistics for this
 * data if one of the following conditions is true:
 *
 * - The `SampleCount` value of the statistic set is 1 and
 * `Min`, `Max`, and `Sum` are all
 * equal.
 *
 * - The `Min` and `Max` are equal, and `Sum`
 * is equal to `Min` multiplied by `SampleCount`.
 */
export const putMetricData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMetricDataInput,
  output: PutMetricDataResponse,
  errors: [
    InternalServiceFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    MissingRequiredParameterException,
  ],
}));
/**
 * Creates or updates a metric stream. Metric streams can automatically stream CloudWatch
 * metrics to Amazon Web Services destinations, including Amazon S3, and to many third-party
 * solutions.
 *
 * For more information, see Using
 * Metric Streams.
 *
 * To create a metric stream, you must be signed in to an account that has the
 * `iam:PassRole` permission and either the
 * `CloudWatchFullAccess` policy or the
 * `cloudwatch:PutMetricStream` permission.
 *
 * When you create or update a metric stream, you choose one of the following:
 *
 * - Stream metrics from all metric namespaces in the account.
 *
 * - Stream metrics from all metric namespaces in the account, except for the
 * namespaces that you list in `ExcludeFilters`.
 *
 * - Stream metrics from only the metric namespaces that you list in
 * `IncludeFilters`.
 *
 * By default, a metric stream always sends the `MAX`, `MIN`,
 * `SUM`, and `SAMPLECOUNT` statistics for each metric that is
 * streamed. You can use the `StatisticsConfigurations` parameter to have the
 * metric stream send additional statistics in the stream. Streaming additional statistics
 * incurs additional costs. For more information, see Amazon CloudWatch Pricing.
 *
 * When you use `PutMetricStream` to create a new metric stream, the stream is
 * created in the `running` state. If you use it to update an existing stream,
 * the state of the stream is not changed.
 *
 * If you are using CloudWatch cross-account observability and you create a metric
 * stream in a monitoring account, you can choose whether to include metrics from source
 * accounts in the stream. For more information, see CloudWatch cross-account observability.
 */
export const putMetricStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMetricStreamInput,
  output: PutMetricStreamOutput,
  errors: [
    ConcurrentModificationException,
    InternalServiceFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    MissingRequiredParameterException,
  ],
}));
/**
 * You can use the `GetMetricData` API to retrieve CloudWatch metric
 * values. The operation can also include a CloudWatch Metrics Insights query, and
 * one or more metric math functions.
 *
 * A `GetMetricData` operation that does not include a query can retrieve
 * as many as 500 different metrics in a single request, with a total of as many as 100,800
 * data points. You can also optionally perform metric math expressions on the values of
 * the returned statistics, to create new time series that represent new insights into your
 * data. For example, using Lambda metrics, you could divide the Errors metric by the
 * Invocations metric to get an error rate time series. For more information about metric
 * math expressions, see Metric Math Syntax and Functions in the Amazon CloudWatch User
 * Guide.
 *
 * If you include a Metrics Insights query, each `GetMetricData` operation can
 * include only one query. But the same `GetMetricData` operation can also
 * retrieve other metrics. Metrics Insights queries can query only the most recent three
 * hours of metric data. For more information about Metrics Insights, see Query your metrics with CloudWatch Metrics Insights.
 *
 * Calls to the `GetMetricData` API have a different pricing structure than
 * calls to `GetMetricStatistics`. For more information about pricing, see
 * Amazon CloudWatch
 * Pricing.
 *
 * Amazon CloudWatch retains metric data as follows:
 *
 * - Data points with a period of less than 60 seconds are available for 3
 * hours. These data points are high-resolution metrics and are available only for
 * custom metrics that have been defined with a `StorageResolution` of
 * 1.
 *
 * - Data points with a period of 60 seconds (1-minute) are available for 15
 * days.
 *
 * - Data points with a period of 300 seconds (5-minute) are available for 63
 * days.
 *
 * - Data points with a period of 3600 seconds (1 hour) are available for 455
 * days (15 months).
 *
 * Data points that are initially published with a shorter period are aggregated
 * together for long-term storage. For example, if you collect data using a period of 1
 * minute, the data remains available for 15 days with 1-minute resolution. After 15 days,
 * this data is still available, but is aggregated and retrievable only with a resolution
 * of 5 minutes. After 63 days, the data is further aggregated and is available with a
 * resolution of 1 hour.
 *
 * If you omit `Unit` in your request, all data that was collected with any
 * unit is returned, along with the corresponding units that were specified when the data
 * was reported to CloudWatch. If you specify a unit, the operation returns only data that
 * was collected with that unit specified. If you specify a unit that does not match the
 * data collected, the results of the operation are null. CloudWatch does not perform unit
 * conversions.
 *
 * Using Metrics Insights queries with metric
 * math
 *
 * You can't mix a Metric Insights query and metric math syntax in the same expression,
 * but you can reference results from a Metrics Insights query within other Metric math
 * expressions. A Metrics Insights query without a GROUP
 * BY clause returns a single time-series (TS), and can be used as input for
 * a metric math expression that expects a single time series. A Metrics Insights query
 * with a **GROUP BY** clause returns an array of time-series
 * (TS[]), and can be used as input for a metric math expression that expects an array of
 * time series.
 */
export const getMetricData = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetricDataInput,
  output: GetMetricDataOutput,
  errors: [InvalidNextToken],
}));
