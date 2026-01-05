import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "NetworkFlowMonitor",
  serviceShapeName: "NetworkFlowMonitor",
});
const auth = T.AwsAuthSigv4({ name: "networkflowmonitor" });
const ver = T.ServiceVersion("2023-04-19");
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
                    url: "https://networkflowmonitor-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://networkflowmonitor.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
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
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
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
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class GetMonitorInput extends S.Class<GetMonitorInput>(
  "GetMonitorInput",
)(
  { monitorName: S.String.pipe(T.HttpLabel("monitorName")) },
  T.all(
    T.Http({ method: "GET", uri: "/monitors/{monitorName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MonitorLocalResource extends S.Class<MonitorLocalResource>(
  "MonitorLocalResource",
)({ type: S.String, identifier: S.String }) {}
export const MonitorLocalResources = S.Array(MonitorLocalResource);
export class MonitorRemoteResource extends S.Class<MonitorRemoteResource>(
  "MonitorRemoteResource",
)({ type: S.String, identifier: S.String }) {}
export const MonitorRemoteResources = S.Array(MonitorRemoteResource);
export class UpdateMonitorInput extends S.Class<UpdateMonitorInput>(
  "UpdateMonitorInput",
)(
  {
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    localResourcesToAdd: S.optional(MonitorLocalResources),
    localResourcesToRemove: S.optional(MonitorLocalResources),
    remoteResourcesToAdd: S.optional(MonitorRemoteResources),
    remoteResourcesToRemove: S.optional(MonitorRemoteResources),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/monitors/{monitorName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMonitorInput extends S.Class<DeleteMonitorInput>(
  "DeleteMonitorInput",
)(
  { monitorName: S.String.pipe(T.HttpLabel("monitorName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/monitors/{monitorName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMonitorOutput extends S.Class<DeleteMonitorOutput>(
  "DeleteMonitorOutput",
)({}) {}
export class ListMonitorsInput extends S.Class<ListMonitorsInput>(
  "ListMonitorsInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    monitorStatus: S.optional(S.String).pipe(T.HttpQuery("monitorStatus")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/monitors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueryResultsMonitorTopContributorsInput extends S.Class<GetQueryResultsMonitorTopContributorsInput>(
  "GetQueryResultsMonitorTopContributorsInput",
)(
  {
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/monitors/{monitorName}/topContributorsQueries/{queryId}/results",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueryStatusMonitorTopContributorsInput extends S.Class<GetQueryStatusMonitorTopContributorsInput>(
  "GetQueryStatusMonitorTopContributorsInput",
)(
  {
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/monitors/{monitorName}/topContributorsQueries/{queryId}/status",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartQueryMonitorTopContributorsInput extends S.Class<StartQueryMonitorTopContributorsInput>(
  "StartQueryMonitorTopContributorsInput",
)(
  {
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
    metricName: S.String,
    destinationCategory: S.String,
    limit: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/monitors/{monitorName}/topContributorsQueries",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopQueryMonitorTopContributorsInput extends S.Class<StopQueryMonitorTopContributorsInput>(
  "StopQueryMonitorTopContributorsInput",
)(
  {
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/monitors/{monitorName}/topContributorsQueries/{queryId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopQueryMonitorTopContributorsOutput extends S.Class<StopQueryMonitorTopContributorsOutput>(
  "StopQueryMonitorTopContributorsOutput",
)({}) {}
export class GetScopeInput extends S.Class<GetScopeInput>("GetScopeInput")(
  { scopeId: S.String.pipe(T.HttpLabel("scopeId")) },
  T.all(
    T.Http({ method: "GET", uri: "/scopes/{scopeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TargetId = S.Union(S.Struct({ accountId: S.String }));
export class TargetIdentifier extends S.Class<TargetIdentifier>(
  "TargetIdentifier",
)({ targetId: TargetId, targetType: S.String }) {}
export class TargetResource extends S.Class<TargetResource>("TargetResource")({
  targetIdentifier: TargetIdentifier,
  region: S.String,
}) {}
export const TargetResourceList = S.Array(TargetResource);
export class UpdateScopeInput extends S.Class<UpdateScopeInput>(
  "UpdateScopeInput",
)(
  {
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    resourcesToAdd: S.optional(TargetResourceList),
    resourcesToDelete: S.optional(TargetResourceList),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/scopes/{scopeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScopeInput extends S.Class<DeleteScopeInput>(
  "DeleteScopeInput",
)(
  { scopeId: S.String.pipe(T.HttpLabel("scopeId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/scopes/{scopeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScopeOutput extends S.Class<DeleteScopeOutput>(
  "DeleteScopeOutput",
)({}) {}
export class ListScopesInput extends S.Class<ListScopesInput>(
  "ListScopesInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/scopes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueryResultsWorkloadInsightsTopContributorsInput extends S.Class<GetQueryResultsWorkloadInsightsTopContributorsInput>(
  "GetQueryResultsWorkloadInsightsTopContributorsInput",
)(
  {
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workloadInsights/{scopeId}/topContributorsQueries/{queryId}/results",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueryResultsWorkloadInsightsTopContributorsDataInput extends S.Class<GetQueryResultsWorkloadInsightsTopContributorsDataInput>(
  "GetQueryResultsWorkloadInsightsTopContributorsDataInput",
)(
  {
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workloadInsights/{scopeId}/topContributorsDataQueries/{queryId}/results",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueryStatusWorkloadInsightsTopContributorsInput extends S.Class<GetQueryStatusWorkloadInsightsTopContributorsInput>(
  "GetQueryStatusWorkloadInsightsTopContributorsInput",
)(
  {
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workloadInsights/{scopeId}/topContributorsQueries/{queryId}/status",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueryStatusWorkloadInsightsTopContributorsDataInput extends S.Class<GetQueryStatusWorkloadInsightsTopContributorsDataInput>(
  "GetQueryStatusWorkloadInsightsTopContributorsDataInput",
)(
  {
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workloadInsights/{scopeId}/topContributorsDataQueries/{queryId}/status",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartQueryWorkloadInsightsTopContributorsInput extends S.Class<StartQueryWorkloadInsightsTopContributorsInput>(
  "StartQueryWorkloadInsightsTopContributorsInput",
)(
  {
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
    metricName: S.String,
    destinationCategory: S.String,
    limit: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workloadInsights/{scopeId}/topContributorsQueries",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartQueryWorkloadInsightsTopContributorsDataInput extends S.Class<StartQueryWorkloadInsightsTopContributorsDataInput>(
  "StartQueryWorkloadInsightsTopContributorsDataInput",
)(
  {
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
    metricName: S.String,
    destinationCategory: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workloadInsights/{scopeId}/topContributorsDataQueries",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopQueryWorkloadInsightsTopContributorsInput extends S.Class<StopQueryWorkloadInsightsTopContributorsInput>(
  "StopQueryWorkloadInsightsTopContributorsInput",
)(
  {
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workloadInsights/{scopeId}/topContributorsQueries/{queryId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopQueryWorkloadInsightsTopContributorsOutput extends S.Class<StopQueryWorkloadInsightsTopContributorsOutput>(
  "StopQueryWorkloadInsightsTopContributorsOutput",
)({}) {}
export class StopQueryWorkloadInsightsTopContributorsDataInput extends S.Class<StopQueryWorkloadInsightsTopContributorsDataInput>(
  "StopQueryWorkloadInsightsTopContributorsDataInput",
)(
  {
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workloadInsights/{scopeId}/topContributorsDataQueries/{queryId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopQueryWorkloadInsightsTopContributorsDataOutput extends S.Class<StopQueryWorkloadInsightsTopContributorsDataOutput>(
  "StopQueryWorkloadInsightsTopContributorsDataOutput",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: S.optional(TagMap) }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
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
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class CreateMonitorInput extends S.Class<CreateMonitorInput>(
  "CreateMonitorInput",
)(
  {
    monitorName: S.String,
    localResources: MonitorLocalResources,
    remoteResources: S.optional(MonitorRemoteResources),
    scopeArn: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/monitors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMonitorOutput extends S.Class<GetMonitorOutput>(
  "GetMonitorOutput",
)({
  monitorArn: S.String,
  monitorName: S.String,
  monitorStatus: S.String,
  localResources: MonitorLocalResources,
  remoteResources: MonitorRemoteResources,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
}) {}
export class UpdateMonitorOutput extends S.Class<UpdateMonitorOutput>(
  "UpdateMonitorOutput",
)({
  monitorArn: S.String,
  monitorName: S.String,
  monitorStatus: S.String,
  localResources: MonitorLocalResources,
  remoteResources: MonitorRemoteResources,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
}) {}
export class GetQueryStatusMonitorTopContributorsOutput extends S.Class<GetQueryStatusMonitorTopContributorsOutput>(
  "GetQueryStatusMonitorTopContributorsOutput",
)({ status: S.String }) {}
export class StartQueryMonitorTopContributorsOutput extends S.Class<StartQueryMonitorTopContributorsOutput>(
  "StartQueryMonitorTopContributorsOutput",
)({ queryId: S.String }) {}
export class GetScopeOutput extends S.Class<GetScopeOutput>("GetScopeOutput")({
  scopeId: S.String,
  status: S.String,
  scopeArn: S.String,
  targets: TargetResourceList,
  tags: S.optional(TagMap),
}) {}
export class UpdateScopeOutput extends S.Class<UpdateScopeOutput>(
  "UpdateScopeOutput",
)({
  scopeId: S.String,
  status: S.String,
  scopeArn: S.String,
  tags: S.optional(TagMap),
}) {}
export class GetQueryStatusWorkloadInsightsTopContributorsOutput extends S.Class<GetQueryStatusWorkloadInsightsTopContributorsOutput>(
  "GetQueryStatusWorkloadInsightsTopContributorsOutput",
)({ status: S.String }) {}
export class GetQueryStatusWorkloadInsightsTopContributorsDataOutput extends S.Class<GetQueryStatusWorkloadInsightsTopContributorsDataOutput>(
  "GetQueryStatusWorkloadInsightsTopContributorsDataOutput",
)({ status: S.String }) {}
export class StartQueryWorkloadInsightsTopContributorsOutput extends S.Class<StartQueryWorkloadInsightsTopContributorsOutput>(
  "StartQueryWorkloadInsightsTopContributorsOutput",
)({ queryId: S.String }) {}
export class StartQueryWorkloadInsightsTopContributorsDataOutput extends S.Class<StartQueryWorkloadInsightsTopContributorsDataOutput>(
  "StartQueryWorkloadInsightsTopContributorsDataOutput",
)({ queryId: S.String }) {}
export const WorkloadInsightsTopContributorsTimestampsList = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export const WorkloadInsightsTopContributorsValuesList = S.Array(S.Number);
export class MonitorSummary extends S.Class<MonitorSummary>("MonitorSummary")({
  monitorArn: S.String,
  monitorName: S.String,
  monitorStatus: S.String,
}) {}
export const MonitorList = S.Array(MonitorSummary);
export class ScopeSummary extends S.Class<ScopeSummary>("ScopeSummary")({
  scopeId: S.String,
  status: S.String,
  scopeArn: S.String,
}) {}
export const ScopeSummaryList = S.Array(ScopeSummary);
export class WorkloadInsightsTopContributorsRow extends S.Class<WorkloadInsightsTopContributorsRow>(
  "WorkloadInsightsTopContributorsRow",
)({
  accountId: S.optional(S.String),
  localSubnetId: S.optional(S.String),
  localAz: S.optional(S.String),
  localVpcId: S.optional(S.String),
  localRegion: S.optional(S.String),
  remoteIdentifier: S.optional(S.String),
  value: S.optional(S.Number),
  localSubnetArn: S.optional(S.String),
  localVpcArn: S.optional(S.String),
}) {}
export const WorkloadInsightsTopContributorsRowList = S.Array(
  WorkloadInsightsTopContributorsRow,
);
export class WorkloadInsightsTopContributorsDataPoint extends S.Class<WorkloadInsightsTopContributorsDataPoint>(
  "WorkloadInsightsTopContributorsDataPoint",
)({
  timestamps: WorkloadInsightsTopContributorsTimestampsList,
  values: WorkloadInsightsTopContributorsValuesList,
  label: S.String,
}) {}
export const WorkloadInsightsTopContributorsDataPoints = S.Array(
  WorkloadInsightsTopContributorsDataPoint,
);
export class CreateMonitorOutput extends S.Class<CreateMonitorOutput>(
  "CreateMonitorOutput",
)({
  monitorArn: S.String,
  monitorName: S.String,
  monitorStatus: S.String,
  localResources: MonitorLocalResources,
  remoteResources: MonitorRemoteResources,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
}) {}
export class ListMonitorsOutput extends S.Class<ListMonitorsOutput>(
  "ListMonitorsOutput",
)({ monitors: MonitorList, nextToken: S.optional(S.String) }) {}
export class ListScopesOutput extends S.Class<ListScopesOutput>(
  "ListScopesOutput",
)({ scopes: ScopeSummaryList, nextToken: S.optional(S.String) }) {}
export class GetQueryResultsWorkloadInsightsTopContributorsOutput extends S.Class<GetQueryResultsWorkloadInsightsTopContributorsOutput>(
  "GetQueryResultsWorkloadInsightsTopContributorsOutput",
)({
  topContributors: S.optional(WorkloadInsightsTopContributorsRowList),
  nextToken: S.optional(S.String),
}) {}
export class GetQueryResultsWorkloadInsightsTopContributorsDataOutput extends S.Class<GetQueryResultsWorkloadInsightsTopContributorsDataOutput>(
  "GetQueryResultsWorkloadInsightsTopContributorsDataOutput",
)({
  unit: S.String,
  datapoints: WorkloadInsightsTopContributorsDataPoints,
  nextToken: S.optional(S.String),
}) {}
export class TraversedComponent extends S.Class<TraversedComponent>(
  "TraversedComponent",
)({
  componentId: S.optional(S.String),
  componentType: S.optional(S.String),
  componentArn: S.optional(S.String),
  serviceName: S.optional(S.String),
}) {}
export const TraversedConstructsList = S.Array(TraversedComponent);
export class KubernetesMetadata extends S.Class<KubernetesMetadata>(
  "KubernetesMetadata",
)({
  localServiceName: S.optional(S.String),
  localPodName: S.optional(S.String),
  localPodNamespace: S.optional(S.String),
  remoteServiceName: S.optional(S.String),
  remotePodName: S.optional(S.String),
  remotePodNamespace: S.optional(S.String),
}) {}
export class MonitorTopContributorsRow extends S.Class<MonitorTopContributorsRow>(
  "MonitorTopContributorsRow",
)({
  localIp: S.optional(S.String),
  snatIp: S.optional(S.String),
  localInstanceId: S.optional(S.String),
  localVpcId: S.optional(S.String),
  localRegion: S.optional(S.String),
  localAz: S.optional(S.String),
  localSubnetId: S.optional(S.String),
  targetPort: S.optional(S.Number),
  destinationCategory: S.optional(S.String),
  remoteVpcId: S.optional(S.String),
  remoteRegion: S.optional(S.String),
  remoteAz: S.optional(S.String),
  remoteSubnetId: S.optional(S.String),
  remoteInstanceId: S.optional(S.String),
  remoteIp: S.optional(S.String),
  dnatIp: S.optional(S.String),
  value: S.optional(S.Number),
  traversedConstructs: S.optional(TraversedConstructsList),
  kubernetesMetadata: S.optional(KubernetesMetadata),
  localInstanceArn: S.optional(S.String),
  localSubnetArn: S.optional(S.String),
  localVpcArn: S.optional(S.String),
  remoteInstanceArn: S.optional(S.String),
  remoteSubnetArn: S.optional(S.String),
  remoteVpcArn: S.optional(S.String),
}) {}
export const MonitorTopContributorsRowList = S.Array(MonitorTopContributorsRow);
export class GetQueryResultsMonitorTopContributorsOutput extends S.Class<GetQueryResultsMonitorTopContributorsOutput>(
  "GetQueryResultsMonitorTopContributorsOutput",
)({
  unit: S.optional(S.String),
  topContributors: S.optional(MonitorTopContributorsRowList),
  nextToken: S.optional(S.String),
}) {}
export class CreateScopeInput extends S.Class<CreateScopeInput>(
  "CreateScopeInput",
)(
  {
    targets: TargetResourceList,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/scopes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateScopeOutput extends S.Class<CreateScopeOutput>(
  "CreateScopeOutput",
)({
  scopeId: S.String,
  status: S.String,
  scopeArn: S.String,
  tags: S.optional(TagMap),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * List all monitors in an account. Optionally, you can list only monitors that have a specific status, by using the `STATUS` parameter.
 */
export const listMonitors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMonitorsInput,
  output: ListMonitorsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * In Network Flow Monitor, you specify a scope for the service to generate metrics for. By using the scope, Network Flow Monitor can generate a topology of all the resources to measure performance metrics for. When you create a scope, you enable permissions for Network Flow Monitor.
 *
 * A scope is a Region-account pair or multiple Region-account pairs. Network Flow Monitor uses your scope to determine all the resources (the topology) where Network Flow Monitor will gather network flow performance metrics for you. To provide performance metrics, Network Flow Monitor uses the data that is sent by the Network Flow Monitor agents you install on the resources.
 *
 * To define the Region-account pairs for your scope, the Network Flow Monitor API uses the following constucts, which allow for future flexibility in defining scopes:
 *
 * - *Targets*, which are arrays of targetResources.
 *
 * - *Target resources*, which are Region-targetIdentifier pairs.
 *
 * - *Target identifiers*, made up of a targetID (currently always an account ID) and a targetType (currently always an account).
 */
export const createScope = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScopeInput,
  output: CreateScopeOutput,
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
 * List all the scopes for an account.
 */
export const listScopes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListScopesInput,
  output: ListScopesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Return the data for a query with the Network Flow Monitor query interface. You specify the query that you want to return results for by providing a query ID and a monitor name.
 *
 * This query returns the top contributors for a scope for workload insights. Workload insights provide a high level view of network flow performance data collected by agents. To return the data for the top contributors, see `GetQueryResultsWorkloadInsightsTopContributorsData`.
 *
 * Create a query ID for this call by calling the corresponding API call to start the query, `StartQueryWorkloadInsightsTopContributors`. Use the scope ID that was returned for your account by `CreateScope`.
 *
 * Top contributors in Network Flow Monitor are network flows with the highest values for a specific metric type. Top contributors can be across all workload insights, for a given scope, or for a specific monitor. Use the applicable call for the top contributors that you want to be returned.
 */
export const getQueryResultsWorkloadInsightsTopContributors =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetQueryResultsWorkloadInsightsTopContributorsInput,
    output: GetQueryResultsWorkloadInsightsTopContributorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Return the data for a query with the Network Flow Monitor query interface. Specify the query that you want to return results for by providing a query ID and a scope ID.
 *
 * This query returns the data for top contributors for workload insights for a specific scope. Workload insights provide a high level view of network flow performance data collected by agents for a scope. To return just the top contributors, see `GetQueryResultsWorkloadInsightsTopContributors`.
 *
 * Create a query ID for this call by calling the corresponding API call to start the query, `StartQueryWorkloadInsightsTopContributorsData`. Use the scope ID that was returned for your account by `CreateScope`.
 *
 * Top contributors in Network Flow Monitor are network flows with the highest values for a specific metric type. Top contributors can be across all workload insights, for a given scope, or for a specific monitor. Use the applicable call for the top contributors that you want to be returned.
 *
 * The top contributor network flows overall are for a specific metric type, for example, the number of retransmissions.
 */
export const getQueryResultsWorkloadInsightsTopContributorsData =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetQueryResultsWorkloadInsightsTopContributorsDataInput,
    output: GetQueryResultsWorkloadInsightsTopContributorsDataOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Update a scope to add or remove resources that you want to be available for Network Flow Monitor to generate metrics for, when you have active agents on those resources sending metrics reports to the Network Flow Monitor backend.
 */
export const updateScope = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateScopeInput,
  output: UpdateScopeOutput,
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
 * Deletes a monitor in Network Flow Monitor.
 */
export const deleteMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMonitorInput,
  output: DeleteMonitorOutput,
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
 * Deletes a scope that has been defined.
 */
export const deleteScope = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScopeInput,
  output: DeleteScopeOutput,
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
 * Returns all the tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
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
 * Adds a tag to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
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
 * Update a monitor to add or remove local or remote resources.
 */
export const updateMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMonitorInput,
  output: UpdateMonitorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a scope, including the name, status, tags, and target details. The scope in Network Flow Monitor is an account.
 */
export const getScope = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetScopeInput,
  output: GetScopeOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
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
 * Gets information about a monitor in Network Flow Monitor based on a monitor name. The information returned includes the Amazon Resource Name (ARN), create time, modified time, resources included in the monitor, and status information.
 */
export const getMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMonitorInput,
  output: GetMonitorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the current status of a query for the Network Flow Monitor query interface, for a specified query ID and monitor. This call returns the query status for the top contributors for a monitor.
 *
 * When you create a query, use this call to check the status of the query to make sure that it has has `SUCCEEDED` before you review the results. Use the same query ID that you used for the corresponding API call to start (create) the query, `StartQueryMonitorTopContributors`.
 *
 * When you run a query, use this call to check the status of the query to make sure that the query has `SUCCEEDED` before you review the results.
 */
export const getQueryStatusMonitorTopContributors =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetQueryStatusMonitorTopContributorsInput,
    output: GetQueryStatusMonitorTopContributorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Create a query that you can use with the Network Flow Monitor query interface to return the top contributors for a monitor. Specify the monitor that you want to create the query for.
 *
 * The call returns a query ID that you can use with GetQueryResultsMonitorTopContributors to run the query and return the top contributors for a specific monitor.
 *
 * Top contributors in Network Flow Monitor are network flows with the highest values for a specific metric type. Top contributors can be across all workload insights, for a given scope, or for a specific monitor. Use the applicable APIs for the top contributors that you want to be returned.
 */
export const startQueryMonitorTopContributors =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartQueryMonitorTopContributorsInput,
    output: StartQueryMonitorTopContributorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Return the data for a query with the Network Flow Monitor query interface. Specify the query that you want to return results for by providing a query ID and a monitor name. This query returns the top contributors for workload insights.
 *
 * When you start a query, use this call to check the status of the query to make sure that it has has `SUCCEEDED` before you review the results. Use the same query ID that you used for the corresponding API call to start the query, `StartQueryWorkloadInsightsTopContributors`.
 *
 * Top contributors in Network Flow Monitor are network flows with the highest values for a specific metric type. Top contributors can be across all workload insights, for a given scope, or for a specific monitor. Use the applicable call for the top contributors that you want to be returned.
 */
export const getQueryStatusWorkloadInsightsTopContributors =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetQueryStatusWorkloadInsightsTopContributorsInput,
    output: GetQueryStatusWorkloadInsightsTopContributorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns the current status of a query for the Network Flow Monitor query interface, for a specified query ID and monitor. This call returns the query status for the top contributors data for workload insights.
 *
 * When you start a query, use this call to check the status of the query to make sure that it has has `SUCCEEDED` before you review the results. Use the same query ID that you used for the corresponding API call to start the query, `StartQueryWorkloadInsightsTopContributorsData`.
 *
 * Top contributors in Network Flow Monitor are network flows with the highest values for a specific metric type. Top contributors can be across all workload insights, for a given scope, or for a specific monitor. Use the applicable call for the top contributors that you want to be returned.
 *
 * The top contributor network flows overall are for a specific metric type, for example, the number of retransmissions.
 */
export const getQueryStatusWorkloadInsightsTopContributorsData =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetQueryStatusWorkloadInsightsTopContributorsDataInput,
    output: GetQueryStatusWorkloadInsightsTopContributorsDataOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Create a query with the Network Flow Monitor query interface that you can run to return workload insights top contributors. Specify the scope that you want to create a query for.
 *
 * The call returns a query ID that you can use with GetQueryResultsWorkloadInsightsTopContributors to run the query and return the top contributors for the workload insights for a scope.
 *
 * Top contributors in Network Flow Monitor are network flows with the highest values for a specific metric type. Top contributors can be across all workload insights, for a given scope, or for a specific monitor. Use the applicable APIs for the top contributors that you want to be returned.
 */
export const startQueryWorkloadInsightsTopContributors =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartQueryWorkloadInsightsTopContributorsInput,
    output: StartQueryWorkloadInsightsTopContributorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Create a query with the Network Flow Monitor query interface that you can run to return data for workload insights top contributors. Specify the scope that you want to create a query for.
 *
 * The call returns a query ID that you can use with GetQueryResultsWorkloadInsightsTopContributorsData to run the query and return the data for the top contributors for the workload insights for a scope.
 *
 * Top contributors in Network Flow Monitor are network flows with the highest values for a specific metric type. Top contributors can be across all workload insights, for a given scope, or for a specific monitor. Use the applicable call for the top contributors that you want to be returned.
 */
export const startQueryWorkloadInsightsTopContributorsData =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartQueryWorkloadInsightsTopContributorsDataInput,
    output: StartQueryWorkloadInsightsTopContributorsDataOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Stop a top contributors query for a monitor. Specify the query that you want to stop by providing a query ID and a monitor name.
 *
 * Top contributors in Network Flow Monitor are network flows with the highest values for a specific metric type. Top contributors can be across all workload insights, for a given scope, or for a specific monitor. Use the applicable call for the top contributors that you want to be returned.
 */
export const stopQueryMonitorTopContributors =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopQueryMonitorTopContributorsInput,
    output: StopQueryMonitorTopContributorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Stop a top contributors query for workload insights. Specify the query that you want to stop by providing a query ID and a scope ID.
 *
 * Top contributors in Network Flow Monitor are network flows with the highest values for a specific metric type. Top contributors can be across all workload insights, for a given scope, or for a specific monitor. Use the applicable call for the top contributors that you want to be returned.
 */
export const stopQueryWorkloadInsightsTopContributors =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopQueryWorkloadInsightsTopContributorsInput,
    output: StopQueryWorkloadInsightsTopContributorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Stop a top contributors data query for workload insights. Specify the query that you want to stop by providing a query ID and a scope ID.
 *
 * Top contributors in Network Flow Monitor are network flows with the highest values for a specific metric type. Top contributors can be across all workload insights, for a given scope, or for a specific monitor. Use the applicable call for the top contributors that you want to be returned.
 */
export const stopQueryWorkloadInsightsTopContributorsData =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopQueryWorkloadInsightsTopContributorsDataInput,
    output: StopQueryWorkloadInsightsTopContributorsDataOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Create a monitor for specific network flows between local and remote resources, so that you can monitor network performance for one or several of your workloads. For each monitor, Network Flow Monitor publishes detailed end-to-end performance metrics and a network health indicator (NHI) that informs you whether there were Amazon Web Services network issues for one or more of the network flows tracked by a monitor, during a time period that you choose.
 */
export const createMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMonitorInput,
  output: CreateMonitorOutput,
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
 * Return the data for a query with the Network Flow Monitor query interface. You specify the query that you want to return results for by providing a query ID and a monitor name. This query returns the top contributors for a specific monitor.
 *
 * Create a query ID for this call by calling the corresponding API call to start the query, `StartQueryMonitorTopContributors`. Use the scope ID that was returned for your account by `CreateScope`.
 *
 * Top contributors in Network Flow Monitor are network flows with the highest values for a specific metric type. Top contributors can be across all workload insights, for a given scope, or for a specific monitor. Use the applicable call for the top contributors that you want to be returned.
 */
export const getQueryResultsMonitorTopContributors =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetQueryResultsMonitorTopContributorsInput,
    output: GetQueryResultsMonitorTopContributorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
