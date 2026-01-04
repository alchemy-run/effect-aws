import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Application Signals",
  serviceShapeName: "ApplicationSignals",
});
const auth = T.AwsAuthSigv4({ name: "application-signals" });
const ver = T.ServiceVersion("2024-04-15");
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
                    url: "https://application-signals-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://application-signals.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
export class DeleteGroupingConfigurationRequest extends S.Class<DeleteGroupingConfigurationRequest>(
  "DeleteGroupingConfigurationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGroupingConfigurationOutput extends S.Class<DeleteGroupingConfigurationOutput>(
  "DeleteGroupingConfigurationOutput",
)({}) {}
export class StartDiscoveryInput extends S.Class<StartDiscoveryInput>(
  "StartDiscoveryInput",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/start-discovery" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDiscoveryOutput extends S.Class<StartDiscoveryOutput>(
  "StartDiscoveryOutput",
)({}) {}
export const ServiceLevelObjectiveIds = S.Array(S.String);
export const Auditors = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BatchGetServiceLevelObjectiveBudgetReportInput extends S.Class<BatchGetServiceLevelObjectiveBudgetReportInput>(
  "BatchGetServiceLevelObjectiveBudgetReportInput",
)(
  {
    Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    SloIds: ServiceLevelObjectiveIds,
  },
  T.all(
    T.Http({ method: "POST", uri: "/budget-report" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Attributes = S.Record({ key: S.String, value: S.String });
export class ListEntityEventsInput extends S.Class<ListEntityEventsInput>(
  "ListEntityEventsInput",
)(
  {
    Entity: Attributes,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupingAttributeDefinitionsInput extends S.Class<ListGroupingAttributeDefinitionsInput>(
  "ListGroupingAttributeDefinitionsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    AwsAccountId: S.optional(S.String).pipe(T.HttpQuery("AwsAccountId")),
    IncludeLinkedAccounts: S.optional(S.Boolean).pipe(
      T.HttpQuery("IncludeLinkedAccounts"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/grouping-attribute-definitions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceDependenciesInput extends S.Class<ListServiceDependenciesInput>(
  "ListServiceDependenciesInput",
)(
  {
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("StartTime"),
    ),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("EndTime"),
    ),
    KeyAttributes: Attributes,
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/service-dependencies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceDependentsInput extends S.Class<ListServiceDependentsInput>(
  "ListServiceDependentsInput",
)(
  {
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("StartTime"),
    ),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("EndTime"),
    ),
    KeyAttributes: Attributes,
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/service-dependents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceLevelObjectiveExclusionWindowsInput extends S.Class<ListServiceLevelObjectiveExclusionWindowsInput>(
  "ListServiceLevelObjectiveExclusionWindowsInput",
)(
  {
    Id: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/slo/{Id}/exclusion-windows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceOperationsInput extends S.Class<ListServiceOperationsInput>(
  "ListServiceOperationsInput",
)(
  {
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("StartTime"),
    ),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("EndTime"),
    ),
    KeyAttributes: Attributes,
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/service-operations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServicesInput extends S.Class<ListServicesInput>(
  "ListServicesInput",
)(
  {
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("StartTime"),
    ),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("EndTime"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    IncludeLinkedAccounts: S.optional(S.Boolean).pipe(
      T.HttpQuery("IncludeLinkedAccounts"),
    ),
    AwsAccountId: S.optional(S.String).pipe(T.HttpQuery("AwsAccountId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/services" }),
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
  { ResourceArn: S.String.pipe(T.HttpQuery("ResourceArn")) },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/untag-resource" }),
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
export const AttributeFilterValues = S.Array(S.String);
export const GroupingSourceKeyStringList = S.Array(S.String);
export class AttributeFilter extends S.Class<AttributeFilter>(
  "AttributeFilter",
)({
  AttributeFilterName: S.String,
  AttributeFilterValues: AttributeFilterValues,
}) {}
export const AttributeFilters = S.Array(AttributeFilter);
export class GroupingAttributeDefinition extends S.Class<GroupingAttributeDefinition>(
  "GroupingAttributeDefinition",
)({
  GroupingName: S.String,
  GroupingSourceKeys: S.optional(GroupingSourceKeyStringList),
  DefaultGroupingValue: S.optional(S.String),
}) {}
export const GroupingAttributeDefinitions = S.Array(
  GroupingAttributeDefinition,
);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class GetServiceInput extends S.Class<GetServiceInput>(
  "GetServiceInput",
)(
  {
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("StartTime"),
    ),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("EndTime"),
    ),
    KeyAttributes: Attributes,
  },
  T.all(
    T.Http({ method: "POST", uri: "/service" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupingAttributeDefinitionsOutput extends S.Class<ListGroupingAttributeDefinitionsOutput>(
  "ListGroupingAttributeDefinitionsOutput",
)({
  GroupingAttributeDefinitions: GroupingAttributeDefinitions,
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NextToken: S.optional(S.String),
}) {}
export class Window extends S.Class<Window>("Window")({
  DurationUnit: S.String,
  Duration: S.Number,
}) {}
export class RecurrenceRule extends S.Class<RecurrenceRule>("RecurrenceRule")({
  Expression: S.String,
}) {}
export class ExclusionWindow extends S.Class<ExclusionWindow>(
  "ExclusionWindow",
)({
  Window: Window,
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RecurrenceRule: S.optional(RecurrenceRule),
  Reason: S.optional(S.String),
}) {}
export const ExclusionWindows = S.Array(ExclusionWindow);
export class ListServiceLevelObjectiveExclusionWindowsOutput extends S.Class<ListServiceLevelObjectiveExclusionWindowsOutput>(
  "ListServiceLevelObjectiveExclusionWindowsOutput",
)({ ExclusionWindows: ExclusionWindows, NextToken: S.optional(S.String) }) {}
export class ListServiceStatesInput extends S.Class<ListServiceStatesInput>(
  "ListServiceStatesInput",
)(
  {
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    IncludeLinkedAccounts: S.optional(S.Boolean),
    AwsAccountId: S.optional(S.String),
    AttributeFilters: S.optional(AttributeFilters),
  },
  T.all(
    T.Http({ method: "POST", uri: "/service/states" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class PutGroupingConfigurationInput extends S.Class<PutGroupingConfigurationInput>(
  "PutGroupingConfigurationInput",
)(
  { GroupingAttributeDefinitions: GroupingAttributeDefinitions },
  T.all(
    T.Http({ method: "PUT", uri: "/grouping-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/tag-resource" }),
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
export class ServiceLevelObjectiveBudgetReportError extends S.Class<ServiceLevelObjectiveBudgetReportError>(
  "ServiceLevelObjectiveBudgetReportError",
)({
  Name: S.String,
  Arn: S.String,
  ErrorCode: S.String,
  ErrorMessage: S.String,
}) {}
export const ServiceLevelObjectiveBudgetReportErrors = S.Array(
  ServiceLevelObjectiveBudgetReportError,
);
export const LogGroupReferences = S.Array(Attributes);
export class ChangeEvent extends S.Class<ChangeEvent>("ChangeEvent")({
  Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  AccountId: S.String,
  Region: S.String,
  Entity: Attributes,
  ChangeEventType: S.String,
  EventId: S.String,
  UserName: S.optional(S.String),
  EventName: S.optional(S.String),
}) {}
export const ChangeEvents = S.Array(ChangeEvent);
export class Dimension extends S.Class<Dimension>("Dimension")({
  Name: S.String,
  Value: S.String,
}) {}
export const Dimensions = S.Array(Dimension);
export class MetricReference extends S.Class<MetricReference>(
  "MetricReference",
)({
  Namespace: S.String,
  MetricType: S.String,
  Dimensions: S.optional(Dimensions),
  MetricName: S.String,
  AccountId: S.optional(S.String),
}) {}
export const MetricReferences = S.Array(MetricReference);
export class ServiceDependent extends S.Class<ServiceDependent>(
  "ServiceDependent",
)({
  OperationName: S.optional(S.String),
  DependentKeyAttributes: Attributes,
  DependentOperationName: S.optional(S.String),
  MetricReferences: MetricReferences,
}) {}
export const ServiceDependents = S.Array(ServiceDependent);
export class ServiceOperation extends S.Class<ServiceOperation>(
  "ServiceOperation",
)({ Name: S.String, MetricReferences: MetricReferences }) {}
export const ServiceOperations = S.Array(ServiceOperation);
export class ServiceEntity extends S.Class<ServiceEntity>("ServiceEntity")({
  Type: S.optional(S.String),
  Name: S.optional(S.String),
  Environment: S.optional(S.String),
  AwsAccountId: S.optional(S.String),
}) {}
export class ServiceLevelObjectiveEntity extends S.Class<ServiceLevelObjectiveEntity>(
  "ServiceLevelObjectiveEntity",
)({ SloName: S.optional(S.String), SloArn: S.optional(S.String) }) {}
export class ServiceOperationEntity extends S.Class<ServiceOperationEntity>(
  "ServiceOperationEntity",
)({
  Service: S.optional(ServiceEntity),
  Operation: S.optional(S.String),
  MetricType: S.optional(S.String),
}) {}
export class CanaryEntity extends S.Class<CanaryEntity>("CanaryEntity")({
  CanaryName: S.String,
}) {}
export class BatchUpdateExclusionWindowsInput extends S.Class<BatchUpdateExclusionWindowsInput>(
  "BatchUpdateExclusionWindowsInput",
)(
  {
    SloIds: ServiceLevelObjectiveIds,
    AddExclusionWindows: S.optional(ExclusionWindows),
    RemoveExclusionWindows: S.optional(ExclusionWindows),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/exclusion-windows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEntityEventsOutput extends S.Class<ListEntityEventsOutput>(
  "ListEntityEventsOutput",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ChangeEvents: ChangeEvents,
  NextToken: S.optional(S.String),
}) {}
export class ListServiceDependentsOutput extends S.Class<ListServiceDependentsOutput>(
  "ListServiceDependentsOutput",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ServiceDependents: ServiceDependents,
  NextToken: S.optional(S.String),
}) {}
export class ListServiceOperationsOutput extends S.Class<ListServiceOperationsOutput>(
  "ListServiceOperationsOutput",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ServiceOperations: ServiceOperations,
  NextToken: S.optional(S.String),
}) {}
export const AuditTargetEntity = S.Union(
  S.Struct({ Service: ServiceEntity }),
  S.Struct({ Slo: ServiceLevelObjectiveEntity }),
  S.Struct({ ServiceOperation: ServiceOperationEntity }),
  S.Struct({ Canary: CanaryEntity }),
);
export const AttributeMap = S.Record({ key: S.String, value: S.String });
export const AttributeMaps = S.Array(AttributeMap);
export class ServiceGroup extends S.Class<ServiceGroup>("ServiceGroup")({
  GroupName: S.String,
  GroupValue: S.String,
  GroupSource: S.String,
  GroupIdentifier: S.String,
}) {}
export const ServiceGroups = S.Array(ServiceGroup);
export const LatestChangeEvents = S.Array(ChangeEvent);
export class Service extends S.Class<Service>("Service")({
  KeyAttributes: Attributes,
  AttributeMaps: S.optional(AttributeMaps),
  ServiceGroups: S.optional(ServiceGroups),
  MetricReferences: MetricReferences,
  LogGroupReferences: S.optional(LogGroupReferences),
}) {}
export class AuditTarget extends S.Class<AuditTarget>("AuditTarget")({
  Type: S.String,
  Data: AuditTargetEntity,
}) {}
export const AuditTargets = S.Array(AuditTarget);
export class ServiceSummary extends S.Class<ServiceSummary>("ServiceSummary")({
  KeyAttributes: Attributes,
  AttributeMaps: S.optional(AttributeMaps),
  MetricReferences: MetricReferences,
  ServiceGroups: S.optional(ServiceGroups),
}) {}
export const ServiceSummaries = S.Array(ServiceSummary);
export class ServiceState extends S.Class<ServiceState>("ServiceState")({
  AttributeFilters: S.optional(AttributeFilters),
  Service: Attributes,
  LatestChangeEvents: LatestChangeEvents,
}) {}
export const ServiceStates = S.Array(ServiceState);
export class GroupingConfiguration extends S.Class<GroupingConfiguration>(
  "GroupingConfiguration",
)({
  GroupingAttributeDefinitions: GroupingAttributeDefinitions,
  UpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class GetServiceOutput extends S.Class<GetServiceOutput>(
  "GetServiceOutput",
)({
  Service: Service,
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LogGroupReferences: S.optional(LogGroupReferences),
}) {}
export class ListAuditFindingsInput extends S.Class<ListAuditFindingsInput>(
  "ListAuditFindingsInput",
)(
  {
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("StartTime"),
    ),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("EndTime"),
    ),
    Auditors: S.optional(Auditors),
    AuditTargets: AuditTargets,
    DetailLevel: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/auditFindings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServicesOutput extends S.Class<ListServicesOutput>(
  "ListServicesOutput",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ServiceSummaries: ServiceSummaries,
  NextToken: S.optional(S.String),
}) {}
export class ListServiceStatesOutput extends S.Class<ListServiceStatesOutput>(
  "ListServiceStatesOutput",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ServiceStates: ServiceStates,
  NextToken: S.optional(S.String),
}) {}
export class PutGroupingConfigurationOutput extends S.Class<PutGroupingConfigurationOutput>(
  "PutGroupingConfigurationOutput",
)({ GroupingConfiguration: GroupingConfiguration }) {}
export class DependencyConfig extends S.Class<DependencyConfig>(
  "DependencyConfig",
)({ DependencyKeyAttributes: Attributes, DependencyOperationName: S.String }) {}
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
export const MonitoredRequestCountMetricDataQueries = S.Union(
  S.Struct({ GoodCountMetric: MetricDataQueries }),
  S.Struct({ BadCountMetric: MetricDataQueries }),
);
export class RollingInterval extends S.Class<RollingInterval>(
  "RollingInterval",
)({ DurationUnit: S.String, Duration: S.Number }) {}
export class CalendarInterval extends S.Class<CalendarInterval>(
  "CalendarInterval",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  DurationUnit: S.String,
  Duration: S.Number,
}) {}
export class BatchUpdateExclusionWindowsError extends S.Class<BatchUpdateExclusionWindowsError>(
  "BatchUpdateExclusionWindowsError",
)({ SloId: S.String, ErrorCode: S.String, ErrorMessage: S.String }) {}
export const BatchUpdateExclusionWindowsErrors = S.Array(
  BatchUpdateExclusionWindowsError,
);
export class ServiceDependency extends S.Class<ServiceDependency>(
  "ServiceDependency",
)({
  OperationName: S.String,
  DependencyKeyAttributes: Attributes,
  DependencyOperationName: S.String,
  MetricReferences: MetricReferences,
}) {}
export const ServiceDependencies = S.Array(ServiceDependency);
export class RequestBasedServiceLevelIndicatorMetric extends S.Class<RequestBasedServiceLevelIndicatorMetric>(
  "RequestBasedServiceLevelIndicatorMetric",
)({
  KeyAttributes: S.optional(Attributes),
  OperationName: S.optional(S.String),
  MetricType: S.optional(S.String),
  TotalRequestCountMetric: MetricDataQueries,
  MonitoredRequestCountMetric: MonitoredRequestCountMetricDataQueries,
  DependencyConfig: S.optional(DependencyConfig),
}) {}
export const Interval = S.Union(
  S.Struct({ RollingInterval: RollingInterval }),
  S.Struct({ CalendarInterval: CalendarInterval }),
);
export class BatchUpdateExclusionWindowsOutput extends S.Class<BatchUpdateExclusionWindowsOutput>(
  "BatchUpdateExclusionWindowsOutput",
)({
  SloIds: ServiceLevelObjectiveIds,
  Errors: BatchUpdateExclusionWindowsErrors,
}) {}
export class ListServiceDependenciesOutput extends S.Class<ListServiceDependenciesOutput>(
  "ListServiceDependenciesOutput",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ServiceDependencies: ServiceDependencies,
  NextToken: S.optional(S.String),
}) {}
export class RequestBasedServiceLevelIndicator extends S.Class<RequestBasedServiceLevelIndicator>(
  "RequestBasedServiceLevelIndicator",
)({
  RequestBasedSliMetric: RequestBasedServiceLevelIndicatorMetric,
  MetricThreshold: S.optional(S.Number),
  ComparisonOperator: S.optional(S.String),
}) {}
export class Goal extends S.Class<Goal>("Goal")({
  Interval: S.optional(Interval),
  AttainmentGoal: S.optional(S.Number),
  WarningThreshold: S.optional(S.Number),
}) {}
export class MetricGraph extends S.Class<MetricGraph>("MetricGraph")({
  MetricDataQueries: S.optional(MetricDataQueries),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ServiceLevelIndicatorMetric extends S.Class<ServiceLevelIndicatorMetric>(
  "ServiceLevelIndicatorMetric",
)({
  KeyAttributes: S.optional(Attributes),
  OperationName: S.optional(S.String),
  MetricType: S.optional(S.String),
  MetricDataQueries: MetricDataQueries,
  DependencyConfig: S.optional(DependencyConfig),
}) {}
export const DataMap = S.Record({ key: S.String, value: S.String });
export class Node extends S.Class<Node>("Node")({
  KeyAttributes: Attributes,
  Name: S.String,
  NodeId: S.String,
  Operation: S.optional(S.String),
  Type: S.optional(S.String),
  Duration: S.optional(S.Number),
  Status: S.optional(S.String),
}) {}
export const Nodes = S.Array(Node);
export class Edge extends S.Class<Edge>("Edge")({
  SourceNodeId: S.optional(S.String),
  DestinationNodeId: S.optional(S.String),
  Duration: S.optional(S.Number),
  ConnectionType: S.optional(S.String),
}) {}
export const Edges = S.Array(Edge);
export class ServiceLevelIndicator extends S.Class<ServiceLevelIndicator>(
  "ServiceLevelIndicator",
)({
  SliMetric: ServiceLevelIndicatorMetric,
  MetricThreshold: S.Number,
  ComparisonOperator: S.String,
}) {}
export class AuditorResult extends S.Class<AuditorResult>("AuditorResult")({
  Auditor: S.optional(S.String),
  Description: S.optional(S.String),
  Data: S.optional(DataMap),
  Severity: S.optional(S.String),
}) {}
export const AuditorResults = S.Array(AuditorResult);
export class DependencyGraph extends S.Class<DependencyGraph>(
  "DependencyGraph",
)({ Nodes: S.optional(Nodes), Edges: S.optional(Edges) }) {}
export class ServiceLevelObjectiveBudgetReport extends S.Class<ServiceLevelObjectiveBudgetReport>(
  "ServiceLevelObjectiveBudgetReport",
)({
  Arn: S.String,
  Name: S.String,
  EvaluationType: S.optional(S.String),
  BudgetStatus: S.String,
  Attainment: S.optional(S.Number),
  TotalBudgetSeconds: S.optional(S.Number),
  BudgetSecondsRemaining: S.optional(S.Number),
  TotalBudgetRequests: S.optional(S.Number),
  BudgetRequestsRemaining: S.optional(S.Number),
  Sli: S.optional(ServiceLevelIndicator),
  RequestBasedSli: S.optional(RequestBasedServiceLevelIndicator),
  Goal: S.optional(Goal),
}) {}
export const ServiceLevelObjectiveBudgetReports = S.Array(
  ServiceLevelObjectiveBudgetReport,
);
export class AuditFinding extends S.Class<AuditFinding>("AuditFinding")({
  KeyAttributes: Attributes,
  AuditorResults: S.optional(AuditorResults),
  Operation: S.optional(S.String),
  MetricGraph: S.optional(MetricGraph),
  DependencyGraph: S.optional(DependencyGraph),
  Type: S.optional(S.String),
}) {}
export const AuditFindings = S.Array(AuditFinding);
export class BatchGetServiceLevelObjectiveBudgetReportOutput extends S.Class<BatchGetServiceLevelObjectiveBudgetReportOutput>(
  "BatchGetServiceLevelObjectiveBudgetReportOutput",
)({
  Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Reports: ServiceLevelObjectiveBudgetReports,
  Errors: ServiceLevelObjectiveBudgetReportErrors,
}) {}
export class ListAuditFindingsOutput extends S.Class<ListAuditFindingsOutput>(
  "ListAuditFindingsOutput",
)({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AuditFindings: AuditFindings,
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
  T.AwsQueryError({ code: "AccessDenied", httpResponseCode: 403 }),
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
  T.AwsQueryError({ code: "ValidationError", httpResponseCode: 400 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String },
) {}

//# Operations
/**
 * Enables this Amazon Web Services account to be able to use CloudWatch Application Signals by creating the *AWSServiceRoleForCloudWatchApplicationSignals* service-linked role. This service- linked role has the following permissions:
 *
 * - `xray:GetServiceGraph`
 *
 * - `logs:StartQuery`
 *
 * - `logs:GetQueryResults`
 *
 * - `cloudwatch:GetMetricData`
 *
 * - `cloudwatch:ListMetrics`
 *
 * - `tag:GetResources`
 *
 * - `autoscaling:DescribeAutoScalingGroups`
 *
 * A service-linked CloudTrail event channel is created to process CloudTrail events and return change event information. This includes last deployment time, userName, eventName, and other event metadata.
 *
 * After completing this step, you still need to instrument your Java and Python applications to send data to Application Signals. For more information, see Enabling Application Signals.
 */
export const startDiscovery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDiscoveryInput,
  output: StartDiscoveryOutput,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Deletes the grouping configuration for this account. This removes all custom grouping attribute definitions that were previously configured.
 */
export const deleteGroupingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteGroupingConfigurationRequest,
    output: DeleteGroupingConfigurationOutput,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
  }),
);
/**
 * Returns the current grouping configuration for this account, including all custom grouping attribute definitions that have been configured. These definitions determine how services are logically grouped based on telemetry attributes, Amazon Web Services tags, or predefined mappings.
 */
export const listGroupingAttributeDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListGroupingAttributeDefinitionsInput,
    output: ListGroupingAttributeDefinitionsOutput,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
  }));
/**
 * Retrieves all exclusion windows configured for a specific SLO.
 */
export const listServiceLevelObjectiveExclusionWindows =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListServiceLevelObjectiveExclusionWindowsInput,
    output: ListServiceLevelObjectiveExclusionWindowsOutput,
    errors: [
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Displays the tags associated with a CloudWatch resource. Tags can be assigned to service level objectives.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException, ThrottlingException],
}));
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, ThrottlingException],
}));
/**
 * Returns a list of change events for a specific entity, such as deployments, configuration changes, or other state-changing activities. This operation helps track the history of changes that may have affected service performance.
 */
export const listEntityEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEntityEventsInput,
  output: ListEntityEventsOutput,
  errors: [ThrottlingException, ValidationException],
}));
/**
 * Returns the list of dependents that invoked the specified service during the provided time range. Dependents include other services, CloudWatch Synthetics canaries, and clients that are instrumented with CloudWatch RUM app monitors.
 */
export const listServiceDependents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListServiceDependentsInput,
    output: ListServiceDependentsOutput,
    errors: [ThrottlingException, ValidationException],
  }),
);
/**
 * Returns a list of the *operations* of this service that have been discovered by Application Signals. Only the operations that were invoked during the specified time range are returned.
 */
export const listServiceOperations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListServiceOperationsInput,
    output: ListServiceOperationsOutput,
    errors: [ThrottlingException, ValidationException],
  }),
);
/**
 * Assigns one or more tags (key-value pairs) to the specified CloudWatch resource, such as a service level objective.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters.
 *
 * You can use the `TagResource` action with an alarm that already has tags. If you specify a new tag key for the alarm, this tag is appended to the list of tags associated with the alarm. If you specify a tag key that is already associated with the alarm, the new tag value that you specify replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a CloudWatch resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Returns information about a service discovered by Application Signals.
 */
export const getService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceInput,
  output: GetServiceOutput,
  errors: [ThrottlingException, ValidationException],
}));
/**
 * Returns a list of services that have been discovered by Application Signals. A service represents a minimum logical and transactional unit that completes a business function. Services are discovered through Application Signals instrumentation.
 */
export const listServices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServicesInput,
  output: ListServicesOutput,
  errors: [ThrottlingException, ValidationException],
}));
/**
 * Returns information about the last deployment and other change states of services. This API provides visibility into recent changes that may have affected service performance, helping with troubleshooting and change correlation.
 */
export const listServiceStates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServiceStatesInput,
  output: ListServiceStatesOutput,
  errors: [ThrottlingException, ValidationException],
}));
/**
 * Creates or updates the grouping configuration for this account. This operation allows you to define custom grouping attributes that determine how services are logically grouped based on telemetry attributes, Amazon Web Services tags, or predefined mappings. These grouping attributes can then be used to organize and filter services in the Application Signals console and APIs.
 */
export const putGroupingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutGroupingConfigurationInput,
    output: PutGroupingConfigurationOutput,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
  }),
);
/**
 * Add or remove time window exclusions for one or more Service Level Objectives (SLOs).
 */
export const batchUpdateExclusionWindows = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchUpdateExclusionWindowsInput,
    output: BatchUpdateExclusionWindowsOutput,
    errors: [
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of service dependencies of the service that you specify. A dependency is an infrastructure component that an operation of this service connects with. Dependencies can include Amazon Web Services services, Amazon Web Services resources, and third-party services.
 */
export const listServiceDependencies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListServiceDependenciesInput,
    output: ListServiceDependenciesOutput,
    errors: [ThrottlingException, ValidationException],
  }),
);
/**
 * Use this operation to retrieve one or more *service level objective (SLO) budget reports*.
 *
 * An *error budget* is the amount of time or requests in an unhealthy state that your service can accumulate during an interval before your overall SLO budget health is breached and the SLO is considered to be unmet. For example, an SLO with a threshold of 99.95% and a monthly interval translates to an error budget of 21.9 minutes of downtime in a 30-day month.
 *
 * Budget reports include a health indicator, the attainment value, and remaining budget.
 *
 * For more information about SLO error budgets, see SLO concepts.
 */
export const batchGetServiceLevelObjectiveBudgetReport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetServiceLevelObjectiveBudgetReportInput,
    output: BatchGetServiceLevelObjectiveBudgetReportOutput,
    errors: [ThrottlingException, ValidationException],
  }));
/**
 * Returns a list of audit findings that provide automated analysis of service behavior and root cause analysis. These findings help identify the most significant observations about your services, including performance issues, anomalies, and potential problems. The findings are generated using heuristic algorithms based on established troubleshooting patterns.
 */
export const listAuditFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAuditFindingsInput,
  output: ListAuditFindingsOutput,
  errors: [ThrottlingException, ValidationException],
}));
