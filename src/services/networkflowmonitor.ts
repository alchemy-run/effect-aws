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
const svc = T.AwsApiService({
  sdkId: "NetworkFlowMonitor",
  serviceShapeName: "NetworkFlowMonitor",
});
const auth = T.AwsAuthSigv4({ name: "networkflowmonitor" });
const ver = T.ServiceVersion("2023-04-19");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseFIPS = false, Endpoint, Region } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true) {
          return e(
            `https://networkflowmonitor-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return e(
          `https://networkflowmonitor.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type TagKey = string;
export type ResourceName = string;
export type UuidString = string;
export type MaxResults = number;
export type Limit = number;
export type ScopeId = string;
export type TagValue = string;
export type AwsRegion = string;
export type MonitorArn = string;
export type Iso8601Timestamp = Date;
export type InstanceId = string;
export type VpcId = string;
export type AvailabilityZone = string;
export type SubnetId = string;
export type InstanceArn = string;
export type SubnetArn = string;
export type VpcArn = string;
export type AccountId = string;
export type Component = string;
export type ComponentType = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type MonitorStatus =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "ERROR"
  | "DELETING";
export const MonitorStatus = S.Literal(
  "PENDING",
  "ACTIVE",
  "INACTIVE",
  "ERROR",
  "DELETING",
);
export type MonitorMetric =
  | "ROUND_TRIP_TIME"
  | "TIMEOUTS"
  | "RETRANSMISSIONS"
  | "DATA_TRANSFERRED";
export const MonitorMetric = S.Literal(
  "ROUND_TRIP_TIME",
  "TIMEOUTS",
  "RETRANSMISSIONS",
  "DATA_TRANSFERRED",
);
export type DestinationCategory =
  | "INTRA_AZ"
  | "INTER_AZ"
  | "INTER_VPC"
  | "UNCLASSIFIED"
  | "AMAZON_S3"
  | "AMAZON_DYNAMODB"
  | "INTER_REGION";
export const DestinationCategory = S.Literal(
  "INTRA_AZ",
  "INTER_AZ",
  "INTER_VPC",
  "UNCLASSIFIED",
  "AMAZON_S3",
  "AMAZON_DYNAMODB",
  "INTER_REGION",
);
export type WorkloadInsightsMetric =
  | "TIMEOUTS"
  | "RETRANSMISSIONS"
  | "DATA_TRANSFERRED";
export const WorkloadInsightsMetric = S.Literal(
  "TIMEOUTS",
  "RETRANSMISSIONS",
  "DATA_TRANSFERRED",
);
export interface ListTagsForResourceInput {
  resourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface GetMonitorInput {
  monitorName: string;
}
export const GetMonitorInput = S.suspend(() =>
  S.Struct({ monitorName: S.String.pipe(T.HttpLabel("monitorName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/monitors/{monitorName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMonitorInput",
}) as any as S.Schema<GetMonitorInput>;
export type MonitorLocalResourceType =
  | "AWS::EC2::VPC"
  | "AWS::AvailabilityZone"
  | "AWS::EC2::Subnet"
  | "AWS::Region"
  | "AWS::EKS::Cluster";
export const MonitorLocalResourceType = S.Literal(
  "AWS::EC2::VPC",
  "AWS::AvailabilityZone",
  "AWS::EC2::Subnet",
  "AWS::Region",
  "AWS::EKS::Cluster",
);
export interface MonitorLocalResource {
  type: MonitorLocalResourceType;
  identifier: string;
}
export const MonitorLocalResource = S.suspend(() =>
  S.Struct({ type: MonitorLocalResourceType, identifier: S.String }),
).annotations({
  identifier: "MonitorLocalResource",
}) as any as S.Schema<MonitorLocalResource>;
export type MonitorLocalResources = MonitorLocalResource[];
export const MonitorLocalResources = S.Array(MonitorLocalResource);
export type MonitorRemoteResourceType =
  | "AWS::EC2::VPC"
  | "AWS::AvailabilityZone"
  | "AWS::EC2::Subnet"
  | "AWS::AWSService"
  | "AWS::Region";
export const MonitorRemoteResourceType = S.Literal(
  "AWS::EC2::VPC",
  "AWS::AvailabilityZone",
  "AWS::EC2::Subnet",
  "AWS::AWSService",
  "AWS::Region",
);
export interface MonitorRemoteResource {
  type: MonitorRemoteResourceType;
  identifier: string;
}
export const MonitorRemoteResource = S.suspend(() =>
  S.Struct({ type: MonitorRemoteResourceType, identifier: S.String }),
).annotations({
  identifier: "MonitorRemoteResource",
}) as any as S.Schema<MonitorRemoteResource>;
export type MonitorRemoteResources = MonitorRemoteResource[];
export const MonitorRemoteResources = S.Array(MonitorRemoteResource);
export interface UpdateMonitorInput {
  monitorName: string;
  localResourcesToAdd?: MonitorLocalResource[];
  localResourcesToRemove?: MonitorLocalResource[];
  remoteResourcesToAdd?: MonitorRemoteResource[];
  remoteResourcesToRemove?: MonitorRemoteResource[];
  clientToken?: string;
}
export const UpdateMonitorInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    localResourcesToAdd: S.optional(MonitorLocalResources),
    localResourcesToRemove: S.optional(MonitorLocalResources),
    remoteResourcesToAdd: S.optional(MonitorRemoteResources),
    remoteResourcesToRemove: S.optional(MonitorRemoteResources),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/monitors/{monitorName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMonitorInput",
}) as any as S.Schema<UpdateMonitorInput>;
export interface DeleteMonitorInput {
  monitorName: string;
}
export const DeleteMonitorInput = S.suspend(() =>
  S.Struct({ monitorName: S.String.pipe(T.HttpLabel("monitorName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/monitors/{monitorName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMonitorInput",
}) as any as S.Schema<DeleteMonitorInput>;
export interface DeleteMonitorOutput {}
export const DeleteMonitorOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteMonitorOutput",
}) as any as S.Schema<DeleteMonitorOutput>;
export interface ListMonitorsInput {
  nextToken?: string;
  maxResults?: number;
  monitorStatus?: MonitorStatus;
}
export const ListMonitorsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    monitorStatus: S.optional(MonitorStatus).pipe(T.HttpQuery("monitorStatus")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/monitors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMonitorsInput",
}) as any as S.Schema<ListMonitorsInput>;
export interface GetQueryResultsMonitorTopContributorsInput {
  monitorName: string;
  queryId: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetQueryResultsMonitorTopContributorsInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetQueryResultsMonitorTopContributorsInput",
}) as any as S.Schema<GetQueryResultsMonitorTopContributorsInput>;
export interface GetQueryStatusMonitorTopContributorsInput {
  monitorName: string;
  queryId: string;
}
export const GetQueryStatusMonitorTopContributorsInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetQueryStatusMonitorTopContributorsInput",
}) as any as S.Schema<GetQueryStatusMonitorTopContributorsInput>;
export interface StartQueryMonitorTopContributorsInput {
  monitorName: string;
  startTime: Date;
  endTime: Date;
  metricName: MonitorMetric;
  destinationCategory: DestinationCategory;
  limit?: number;
}
export const StartQueryMonitorTopContributorsInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
    metricName: MonitorMetric,
    destinationCategory: DestinationCategory,
    limit: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartQueryMonitorTopContributorsInput",
}) as any as S.Schema<StartQueryMonitorTopContributorsInput>;
export interface StopQueryMonitorTopContributorsInput {
  monitorName: string;
  queryId: string;
}
export const StopQueryMonitorTopContributorsInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String.pipe(T.HttpLabel("monitorName")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopQueryMonitorTopContributorsInput",
}) as any as S.Schema<StopQueryMonitorTopContributorsInput>;
export interface StopQueryMonitorTopContributorsOutput {}
export const StopQueryMonitorTopContributorsOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopQueryMonitorTopContributorsOutput",
}) as any as S.Schema<StopQueryMonitorTopContributorsOutput>;
export interface GetScopeInput {
  scopeId: string;
}
export const GetScopeInput = S.suspend(() =>
  S.Struct({ scopeId: S.String.pipe(T.HttpLabel("scopeId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/scopes/{scopeId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetScopeInput",
}) as any as S.Schema<GetScopeInput>;
export type TargetId = { accountId: string };
export const TargetId = S.Union(S.Struct({ accountId: S.String }));
export type TargetType = "ACCOUNT";
export const TargetType = S.Literal("ACCOUNT");
export interface TargetIdentifier {
  targetId: TargetId;
  targetType: TargetType;
}
export const TargetIdentifier = S.suspend(() =>
  S.Struct({ targetId: TargetId, targetType: TargetType }),
).annotations({
  identifier: "TargetIdentifier",
}) as any as S.Schema<TargetIdentifier>;
export interface TargetResource {
  targetIdentifier: TargetIdentifier;
  region: string;
}
export const TargetResource = S.suspend(() =>
  S.Struct({ targetIdentifier: TargetIdentifier, region: S.String }),
).annotations({
  identifier: "TargetResource",
}) as any as S.Schema<TargetResource>;
export type TargetResourceList = TargetResource[];
export const TargetResourceList = S.Array(TargetResource);
export interface UpdateScopeInput {
  scopeId: string;
  resourcesToAdd?: TargetResource[];
  resourcesToDelete?: TargetResource[];
}
export const UpdateScopeInput = S.suspend(() =>
  S.Struct({
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    resourcesToAdd: S.optional(TargetResourceList),
    resourcesToDelete: S.optional(TargetResourceList),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/scopes/{scopeId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateScopeInput",
}) as any as S.Schema<UpdateScopeInput>;
export interface DeleteScopeInput {
  scopeId: string;
}
export const DeleteScopeInput = S.suspend(() =>
  S.Struct({ scopeId: S.String.pipe(T.HttpLabel("scopeId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/scopes/{scopeId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteScopeInput",
}) as any as S.Schema<DeleteScopeInput>;
export interface DeleteScopeOutput {}
export const DeleteScopeOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteScopeOutput",
}) as any as S.Schema<DeleteScopeOutput>;
export interface ListScopesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListScopesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/scopes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListScopesInput",
}) as any as S.Schema<ListScopesInput>;
export interface GetQueryResultsWorkloadInsightsTopContributorsInput {
  scopeId: string;
  queryId: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetQueryResultsWorkloadInsightsTopContributorsInput = S.suspend(
  () =>
    S.Struct({
      scopeId: S.String.pipe(T.HttpLabel("scopeId")),
      queryId: S.String.pipe(T.HttpLabel("queryId")),
      nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
      maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    }).pipe(
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
    ),
).annotations({
  identifier: "GetQueryResultsWorkloadInsightsTopContributorsInput",
}) as any as S.Schema<GetQueryResultsWorkloadInsightsTopContributorsInput>;
export interface GetQueryResultsWorkloadInsightsTopContributorsDataInput {
  scopeId: string;
  queryId: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetQueryResultsWorkloadInsightsTopContributorsDataInput =
  S.suspend(() =>
    S.Struct({
      scopeId: S.String.pipe(T.HttpLabel("scopeId")),
      queryId: S.String.pipe(T.HttpLabel("queryId")),
      nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
      maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    }).pipe(
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
    ),
  ).annotations({
    identifier: "GetQueryResultsWorkloadInsightsTopContributorsDataInput",
  }) as any as S.Schema<GetQueryResultsWorkloadInsightsTopContributorsDataInput>;
export interface GetQueryStatusWorkloadInsightsTopContributorsInput {
  scopeId: string;
  queryId: string;
}
export const GetQueryStatusWorkloadInsightsTopContributorsInput = S.suspend(
  () =>
    S.Struct({
      scopeId: S.String.pipe(T.HttpLabel("scopeId")),
      queryId: S.String.pipe(T.HttpLabel("queryId")),
    }).pipe(
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
    ),
).annotations({
  identifier: "GetQueryStatusWorkloadInsightsTopContributorsInput",
}) as any as S.Schema<GetQueryStatusWorkloadInsightsTopContributorsInput>;
export interface GetQueryStatusWorkloadInsightsTopContributorsDataInput {
  scopeId: string;
  queryId: string;
}
export const GetQueryStatusWorkloadInsightsTopContributorsDataInput = S.suspend(
  () =>
    S.Struct({
      scopeId: S.String.pipe(T.HttpLabel("scopeId")),
      queryId: S.String.pipe(T.HttpLabel("queryId")),
    }).pipe(
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
    ),
).annotations({
  identifier: "GetQueryStatusWorkloadInsightsTopContributorsDataInput",
}) as any as S.Schema<GetQueryStatusWorkloadInsightsTopContributorsDataInput>;
export interface StartQueryWorkloadInsightsTopContributorsInput {
  scopeId: string;
  startTime: Date;
  endTime: Date;
  metricName: WorkloadInsightsMetric;
  destinationCategory: DestinationCategory;
  limit?: number;
}
export const StartQueryWorkloadInsightsTopContributorsInput = S.suspend(() =>
  S.Struct({
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
    metricName: WorkloadInsightsMetric,
    destinationCategory: DestinationCategory,
    limit: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartQueryWorkloadInsightsTopContributorsInput",
}) as any as S.Schema<StartQueryWorkloadInsightsTopContributorsInput>;
export interface StartQueryWorkloadInsightsTopContributorsDataInput {
  scopeId: string;
  startTime: Date;
  endTime: Date;
  metricName: WorkloadInsightsMetric;
  destinationCategory: DestinationCategory;
}
export const StartQueryWorkloadInsightsTopContributorsDataInput = S.suspend(
  () =>
    S.Struct({
      scopeId: S.String.pipe(T.HttpLabel("scopeId")),
      startTime: S.Date.pipe(T.TimestampFormat("date-time")),
      endTime: S.Date.pipe(T.TimestampFormat("date-time")),
      metricName: WorkloadInsightsMetric,
      destinationCategory: DestinationCategory,
    }).pipe(
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
    ),
).annotations({
  identifier: "StartQueryWorkloadInsightsTopContributorsDataInput",
}) as any as S.Schema<StartQueryWorkloadInsightsTopContributorsDataInput>;
export interface StopQueryWorkloadInsightsTopContributorsInput {
  scopeId: string;
  queryId: string;
}
export const StopQueryWorkloadInsightsTopContributorsInput = S.suspend(() =>
  S.Struct({
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopQueryWorkloadInsightsTopContributorsInput",
}) as any as S.Schema<StopQueryWorkloadInsightsTopContributorsInput>;
export interface StopQueryWorkloadInsightsTopContributorsOutput {}
export const StopQueryWorkloadInsightsTopContributorsOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopQueryWorkloadInsightsTopContributorsOutput",
}) as any as S.Schema<StopQueryWorkloadInsightsTopContributorsOutput>;
export interface StopQueryWorkloadInsightsTopContributorsDataInput {
  scopeId: string;
  queryId: string;
}
export const StopQueryWorkloadInsightsTopContributorsDataInput = S.suspend(() =>
  S.Struct({
    scopeId: S.String.pipe(T.HttpLabel("scopeId")),
    queryId: S.String.pipe(T.HttpLabel("queryId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopQueryWorkloadInsightsTopContributorsDataInput",
}) as any as S.Schema<StopQueryWorkloadInsightsTopContributorsDataInput>;
export interface StopQueryWorkloadInsightsTopContributorsDataOutput {}
export const StopQueryWorkloadInsightsTopContributorsDataOutput = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "StopQueryWorkloadInsightsTopContributorsDataOutput",
}) as any as S.Schema<StopQueryWorkloadInsightsTopContributorsDataOutput>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export type MetricUnit =
  | "Seconds"
  | "Microseconds"
  | "Milliseconds"
  | "Bytes"
  | "Kilobytes"
  | "Megabytes"
  | "Gigabytes"
  | "Terabytes"
  | "Bits"
  | "Kilobits"
  | "Megabits"
  | "Gigabits"
  | "Terabits"
  | "Percent"
  | "Count"
  | "Bytes/Second"
  | "Kilobytes/Second"
  | "Megabytes/Second"
  | "Gigabytes/Second"
  | "Terabytes/Second"
  | "Bits/Second"
  | "Kilobits/Second"
  | "Megabits/Second"
  | "Gigabits/Second"
  | "Terabits/Second"
  | "Count/Second"
  | "None";
export const MetricUnit = S.Literal(
  "Seconds",
  "Microseconds",
  "Milliseconds",
  "Bytes",
  "Kilobytes",
  "Megabytes",
  "Gigabytes",
  "Terabytes",
  "Bits",
  "Kilobits",
  "Megabits",
  "Gigabits",
  "Terabits",
  "Percent",
  "Count",
  "Bytes/Second",
  "Kilobytes/Second",
  "Megabytes/Second",
  "Gigabytes/Second",
  "Terabytes/Second",
  "Bits/Second",
  "Kilobits/Second",
  "Megabits/Second",
  "Gigabits/Second",
  "Terabits/Second",
  "Count/Second",
  "None",
);
export type QueryStatus =
  | "QUEUED"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED";
export const QueryStatus = S.Literal(
  "QUEUED",
  "RUNNING",
  "SUCCEEDED",
  "FAILED",
  "CANCELED",
);
export type ScopeStatus =
  | "SUCCEEDED"
  | "IN_PROGRESS"
  | "FAILED"
  | "DEACTIVATING"
  | "DEACTIVATED";
export const ScopeStatus = S.Literal(
  "SUCCEEDED",
  "IN_PROGRESS",
  "FAILED",
  "DEACTIVATING",
  "DEACTIVATED",
);
export interface ListTagsForResourceOutput {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface CreateMonitorInput {
  monitorName: string;
  localResources: MonitorLocalResource[];
  remoteResources?: MonitorRemoteResource[];
  scopeArn: string;
  clientToken?: string;
  tags?: { [key: string]: string };
}
export const CreateMonitorInput = S.suspend(() =>
  S.Struct({
    monitorName: S.String,
    localResources: MonitorLocalResources,
    remoteResources: S.optional(MonitorRemoteResources),
    scopeArn: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/monitors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMonitorInput",
}) as any as S.Schema<CreateMonitorInput>;
export interface GetMonitorOutput {
  monitorArn: string;
  monitorName: string;
  monitorStatus: MonitorStatus;
  localResources: MonitorLocalResource[];
  remoteResources: MonitorRemoteResource[];
  createdAt: Date;
  modifiedAt: Date;
  tags?: { [key: string]: string };
}
export const GetMonitorOutput = S.suspend(() =>
  S.Struct({
    monitorArn: S.String,
    monitorName: S.String,
    monitorStatus: MonitorStatus,
    localResources: MonitorLocalResources,
    remoteResources: MonitorRemoteResources,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetMonitorOutput",
}) as any as S.Schema<GetMonitorOutput>;
export interface UpdateMonitorOutput {
  monitorArn: string;
  monitorName: string;
  monitorStatus: MonitorStatus;
  localResources: MonitorLocalResource[];
  remoteResources: MonitorRemoteResource[];
  createdAt: Date;
  modifiedAt: Date;
  tags?: { [key: string]: string };
}
export const UpdateMonitorOutput = S.suspend(() =>
  S.Struct({
    monitorArn: S.String,
    monitorName: S.String,
    monitorStatus: MonitorStatus,
    localResources: MonitorLocalResources,
    remoteResources: MonitorRemoteResources,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "UpdateMonitorOutput",
}) as any as S.Schema<UpdateMonitorOutput>;
export interface GetQueryStatusMonitorTopContributorsOutput {
  status: QueryStatus;
}
export const GetQueryStatusMonitorTopContributorsOutput = S.suspend(() =>
  S.Struct({ status: QueryStatus }),
).annotations({
  identifier: "GetQueryStatusMonitorTopContributorsOutput",
}) as any as S.Schema<GetQueryStatusMonitorTopContributorsOutput>;
export interface StartQueryMonitorTopContributorsOutput {
  queryId: string;
}
export const StartQueryMonitorTopContributorsOutput = S.suspend(() =>
  S.Struct({ queryId: S.String }),
).annotations({
  identifier: "StartQueryMonitorTopContributorsOutput",
}) as any as S.Schema<StartQueryMonitorTopContributorsOutput>;
export interface GetScopeOutput {
  scopeId: string;
  status: ScopeStatus;
  scopeArn: string;
  targets: TargetResource[];
  tags?: { [key: string]: string };
}
export const GetScopeOutput = S.suspend(() =>
  S.Struct({
    scopeId: S.String,
    status: ScopeStatus,
    scopeArn: S.String,
    targets: TargetResourceList,
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetScopeOutput",
}) as any as S.Schema<GetScopeOutput>;
export interface UpdateScopeOutput {
  scopeId: string;
  status: ScopeStatus;
  scopeArn: string;
  tags?: { [key: string]: string };
}
export const UpdateScopeOutput = S.suspend(() =>
  S.Struct({
    scopeId: S.String,
    status: ScopeStatus,
    scopeArn: S.String,
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "UpdateScopeOutput",
}) as any as S.Schema<UpdateScopeOutput>;
export interface GetQueryStatusWorkloadInsightsTopContributorsOutput {
  status: QueryStatus;
}
export const GetQueryStatusWorkloadInsightsTopContributorsOutput = S.suspend(
  () => S.Struct({ status: QueryStatus }),
).annotations({
  identifier: "GetQueryStatusWorkloadInsightsTopContributorsOutput",
}) as any as S.Schema<GetQueryStatusWorkloadInsightsTopContributorsOutput>;
export interface GetQueryStatusWorkloadInsightsTopContributorsDataOutput {
  status: QueryStatus;
}
export const GetQueryStatusWorkloadInsightsTopContributorsDataOutput =
  S.suspend(() => S.Struct({ status: QueryStatus })).annotations({
    identifier: "GetQueryStatusWorkloadInsightsTopContributorsDataOutput",
  }) as any as S.Schema<GetQueryStatusWorkloadInsightsTopContributorsDataOutput>;
export interface StartQueryWorkloadInsightsTopContributorsOutput {
  queryId: string;
}
export const StartQueryWorkloadInsightsTopContributorsOutput = S.suspend(() =>
  S.Struct({ queryId: S.String }),
).annotations({
  identifier: "StartQueryWorkloadInsightsTopContributorsOutput",
}) as any as S.Schema<StartQueryWorkloadInsightsTopContributorsOutput>;
export interface StartQueryWorkloadInsightsTopContributorsDataOutput {
  queryId: string;
}
export const StartQueryWorkloadInsightsTopContributorsDataOutput = S.suspend(
  () => S.Struct({ queryId: S.String }),
).annotations({
  identifier: "StartQueryWorkloadInsightsTopContributorsDataOutput",
}) as any as S.Schema<StartQueryWorkloadInsightsTopContributorsDataOutput>;
export type WorkloadInsightsTopContributorsTimestampsList = Date[];
export const WorkloadInsightsTopContributorsTimestampsList = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export type WorkloadInsightsTopContributorsValuesList = number[];
export const WorkloadInsightsTopContributorsValuesList = S.Array(S.Number);
export interface MonitorSummary {
  monitorArn: string;
  monitorName: string;
  monitorStatus: MonitorStatus;
}
export const MonitorSummary = S.suspend(() =>
  S.Struct({
    monitorArn: S.String,
    monitorName: S.String,
    monitorStatus: MonitorStatus,
  }),
).annotations({
  identifier: "MonitorSummary",
}) as any as S.Schema<MonitorSummary>;
export type MonitorList = MonitorSummary[];
export const MonitorList = S.Array(MonitorSummary);
export interface ScopeSummary {
  scopeId: string;
  status: ScopeStatus;
  scopeArn: string;
}
export const ScopeSummary = S.suspend(() =>
  S.Struct({ scopeId: S.String, status: ScopeStatus, scopeArn: S.String }),
).annotations({ identifier: "ScopeSummary" }) as any as S.Schema<ScopeSummary>;
export type ScopeSummaryList = ScopeSummary[];
export const ScopeSummaryList = S.Array(ScopeSummary);
export interface WorkloadInsightsTopContributorsRow {
  accountId?: string;
  localSubnetId?: string;
  localAz?: string;
  localVpcId?: string;
  localRegion?: string;
  remoteIdentifier?: string;
  value?: number;
  localSubnetArn?: string;
  localVpcArn?: string;
}
export const WorkloadInsightsTopContributorsRow = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    localSubnetId: S.optional(S.String),
    localAz: S.optional(S.String),
    localVpcId: S.optional(S.String),
    localRegion: S.optional(S.String),
    remoteIdentifier: S.optional(S.String),
    value: S.optional(S.Number),
    localSubnetArn: S.optional(S.String),
    localVpcArn: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkloadInsightsTopContributorsRow",
}) as any as S.Schema<WorkloadInsightsTopContributorsRow>;
export type WorkloadInsightsTopContributorsRowList =
  WorkloadInsightsTopContributorsRow[];
export const WorkloadInsightsTopContributorsRowList = S.Array(
  WorkloadInsightsTopContributorsRow,
);
export interface WorkloadInsightsTopContributorsDataPoint {
  timestamps: Date[];
  values: number[];
  label: string;
}
export const WorkloadInsightsTopContributorsDataPoint = S.suspend(() =>
  S.Struct({
    timestamps: WorkloadInsightsTopContributorsTimestampsList,
    values: WorkloadInsightsTopContributorsValuesList,
    label: S.String,
  }),
).annotations({
  identifier: "WorkloadInsightsTopContributorsDataPoint",
}) as any as S.Schema<WorkloadInsightsTopContributorsDataPoint>;
export type WorkloadInsightsTopContributorsDataPoints =
  WorkloadInsightsTopContributorsDataPoint[];
export const WorkloadInsightsTopContributorsDataPoints = S.Array(
  WorkloadInsightsTopContributorsDataPoint,
);
export interface CreateMonitorOutput {
  monitorArn: string;
  monitorName: string;
  monitorStatus: MonitorStatus;
  localResources: MonitorLocalResource[];
  remoteResources: MonitorRemoteResource[];
  createdAt: Date;
  modifiedAt: Date;
  tags?: { [key: string]: string };
}
export const CreateMonitorOutput = S.suspend(() =>
  S.Struct({
    monitorArn: S.String,
    monitorName: S.String,
    monitorStatus: MonitorStatus,
    localResources: MonitorLocalResources,
    remoteResources: MonitorRemoteResources,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    modifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateMonitorOutput",
}) as any as S.Schema<CreateMonitorOutput>;
export interface ListMonitorsOutput {
  monitors: MonitorSummary[];
  nextToken?: string;
}
export const ListMonitorsOutput = S.suspend(() =>
  S.Struct({ monitors: MonitorList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListMonitorsOutput",
}) as any as S.Schema<ListMonitorsOutput>;
export interface ListScopesOutput {
  scopes: ScopeSummary[];
  nextToken?: string;
}
export const ListScopesOutput = S.suspend(() =>
  S.Struct({ scopes: ScopeSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListScopesOutput",
}) as any as S.Schema<ListScopesOutput>;
export interface GetQueryResultsWorkloadInsightsTopContributorsOutput {
  topContributors?: WorkloadInsightsTopContributorsRow[];
  nextToken?: string;
}
export const GetQueryResultsWorkloadInsightsTopContributorsOutput = S.suspend(
  () =>
    S.Struct({
      topContributors: S.optional(WorkloadInsightsTopContributorsRowList),
      nextToken: S.optional(S.String),
    }),
).annotations({
  identifier: "GetQueryResultsWorkloadInsightsTopContributorsOutput",
}) as any as S.Schema<GetQueryResultsWorkloadInsightsTopContributorsOutput>;
export interface GetQueryResultsWorkloadInsightsTopContributorsDataOutput {
  unit: MetricUnit;
  datapoints: WorkloadInsightsTopContributorsDataPoint[];
  nextToken?: string;
}
export const GetQueryResultsWorkloadInsightsTopContributorsDataOutput =
  S.suspend(() =>
    S.Struct({
      unit: MetricUnit,
      datapoints: WorkloadInsightsTopContributorsDataPoints,
      nextToken: S.optional(S.String),
    }),
  ).annotations({
    identifier: "GetQueryResultsWorkloadInsightsTopContributorsDataOutput",
  }) as any as S.Schema<GetQueryResultsWorkloadInsightsTopContributorsDataOutput>;
export interface TraversedComponent {
  componentId?: string;
  componentType?: string;
  componentArn?: string;
  serviceName?: string;
}
export const TraversedComponent = S.suspend(() =>
  S.Struct({
    componentId: S.optional(S.String),
    componentType: S.optional(S.String),
    componentArn: S.optional(S.String),
    serviceName: S.optional(S.String),
  }),
).annotations({
  identifier: "TraversedComponent",
}) as any as S.Schema<TraversedComponent>;
export type TraversedConstructsList = TraversedComponent[];
export const TraversedConstructsList = S.Array(TraversedComponent);
export interface KubernetesMetadata {
  localServiceName?: string;
  localPodName?: string;
  localPodNamespace?: string;
  remoteServiceName?: string;
  remotePodName?: string;
  remotePodNamespace?: string;
}
export const KubernetesMetadata = S.suspend(() =>
  S.Struct({
    localServiceName: S.optional(S.String),
    localPodName: S.optional(S.String),
    localPodNamespace: S.optional(S.String),
    remoteServiceName: S.optional(S.String),
    remotePodName: S.optional(S.String),
    remotePodNamespace: S.optional(S.String),
  }),
).annotations({
  identifier: "KubernetesMetadata",
}) as any as S.Schema<KubernetesMetadata>;
export interface MonitorTopContributorsRow {
  localIp?: string;
  snatIp?: string;
  localInstanceId?: string;
  localVpcId?: string;
  localRegion?: string;
  localAz?: string;
  localSubnetId?: string;
  targetPort?: number;
  destinationCategory?: DestinationCategory;
  remoteVpcId?: string;
  remoteRegion?: string;
  remoteAz?: string;
  remoteSubnetId?: string;
  remoteInstanceId?: string;
  remoteIp?: string;
  dnatIp?: string;
  value?: number;
  traversedConstructs?: TraversedComponent[];
  kubernetesMetadata?: KubernetesMetadata;
  localInstanceArn?: string;
  localSubnetArn?: string;
  localVpcArn?: string;
  remoteInstanceArn?: string;
  remoteSubnetArn?: string;
  remoteVpcArn?: string;
}
export const MonitorTopContributorsRow = S.suspend(() =>
  S.Struct({
    localIp: S.optional(S.String),
    snatIp: S.optional(S.String),
    localInstanceId: S.optional(S.String),
    localVpcId: S.optional(S.String),
    localRegion: S.optional(S.String),
    localAz: S.optional(S.String),
    localSubnetId: S.optional(S.String),
    targetPort: S.optional(S.Number),
    destinationCategory: S.optional(DestinationCategory),
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
  }),
).annotations({
  identifier: "MonitorTopContributorsRow",
}) as any as S.Schema<MonitorTopContributorsRow>;
export type MonitorTopContributorsRowList = MonitorTopContributorsRow[];
export const MonitorTopContributorsRowList = S.Array(MonitorTopContributorsRow);
export interface GetQueryResultsMonitorTopContributorsOutput {
  unit?: MetricUnit;
  topContributors?: MonitorTopContributorsRow[];
  nextToken?: string;
}
export const GetQueryResultsMonitorTopContributorsOutput = S.suspend(() =>
  S.Struct({
    unit: S.optional(MetricUnit),
    topContributors: S.optional(MonitorTopContributorsRowList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetQueryResultsMonitorTopContributorsOutput",
}) as any as S.Schema<GetQueryResultsMonitorTopContributorsOutput>;
export interface CreateScopeInput {
  targets: TargetResource[];
  clientToken?: string;
  tags?: { [key: string]: string };
}
export const CreateScopeInput = S.suspend(() =>
  S.Struct({
    targets: TargetResourceList,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/scopes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateScopeInput",
}) as any as S.Schema<CreateScopeInput>;
export interface CreateScopeOutput {
  scopeId: string;
  status: ScopeStatus;
  scopeArn: string;
  tags?: { [key: string]: string };
}
export const CreateScopeOutput = S.suspend(() =>
  S.Struct({
    scopeId: S.String,
    status: ScopeStatus,
    scopeArn: S.String,
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateScopeOutput",
}) as any as S.Schema<CreateScopeOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * List all monitors in an account. Optionally, you can list only monitors that have a specific status, by using the `STATUS` parameter.
 */
export const listMonitors: {
  (
    input: ListMonitorsInput,
  ): effect.Effect<
    ListMonitorsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMonitorsInput,
  ) => stream.Stream<
    ListMonitorsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMonitorsInput,
  ) => stream.Stream<
    MonitorSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMonitorsInput,
  output: ListMonitorsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "monitors",
    pageSize: "maxResults",
  } as const,
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
export const createScope: (
  input: CreateScopeInput,
) => effect.Effect<
  CreateScopeOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listScopes: {
  (
    input: ListScopesInput,
  ): effect.Effect<
    ListScopesOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListScopesInput,
  ) => stream.Stream<
    ListScopesOutput,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListScopesInput,
  ) => stream.Stream<
    ScopeSummary,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListScopesInput,
  output: ListScopesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "scopes",
    pageSize: "maxResults",
  } as const,
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
export const getQueryResultsWorkloadInsightsTopContributors: {
  (
    input: GetQueryResultsWorkloadInsightsTopContributorsInput,
  ): effect.Effect<
    GetQueryResultsWorkloadInsightsTopContributorsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetQueryResultsWorkloadInsightsTopContributorsInput,
  ) => stream.Stream<
    GetQueryResultsWorkloadInsightsTopContributorsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetQueryResultsWorkloadInsightsTopContributorsInput,
  ) => stream.Stream<
    WorkloadInsightsTopContributorsRow,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "topContributors",
    pageSize: "maxResults",
  } as const,
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
export const getQueryResultsWorkloadInsightsTopContributorsData: {
  (
    input: GetQueryResultsWorkloadInsightsTopContributorsDataInput,
  ): effect.Effect<
    GetQueryResultsWorkloadInsightsTopContributorsDataOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetQueryResultsWorkloadInsightsTopContributorsDataInput,
  ) => stream.Stream<
    GetQueryResultsWorkloadInsightsTopContributorsDataOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetQueryResultsWorkloadInsightsTopContributorsDataInput,
  ) => stream.Stream<
    WorkloadInsightsTopContributorsDataPoint,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "datapoints",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Update a scope to add or remove resources that you want to be available for Network Flow Monitor to generate metrics for, when you have active agents on those resources sending metrics reports to the Network Flow Monitor backend.
 */
export const updateScope: (
  input: UpdateScopeInput,
) => effect.Effect<
  UpdateScopeOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMonitor: (
  input: DeleteMonitorInput,
) => effect.Effect<
  DeleteMonitorOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteScope: (
  input: DeleteScopeInput,
) => effect.Effect<
  DeleteScopeOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => effect.Effect<
  ListTagsForResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateMonitor: (
  input: UpdateMonitorInput,
) => effect.Effect<
  UpdateMonitorOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getScope: (
  input: GetScopeInput,
) => effect.Effect<
  GetScopeOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMonitor: (
  input: GetMonitorInput,
) => effect.Effect<
  GetMonitorOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQueryStatusMonitorTopContributors: (
  input: GetQueryStatusMonitorTopContributorsInput,
) => effect.Effect<
  GetQueryStatusMonitorTopContributorsOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startQueryMonitorTopContributors: (
  input: StartQueryMonitorTopContributorsInput,
) => effect.Effect<
  StartQueryMonitorTopContributorsOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQueryStatusWorkloadInsightsTopContributors: (
  input: GetQueryStatusWorkloadInsightsTopContributorsInput,
) => effect.Effect<
  GetQueryStatusWorkloadInsightsTopContributorsOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQueryStatusWorkloadInsightsTopContributorsData: (
  input: GetQueryStatusWorkloadInsightsTopContributorsDataInput,
) => effect.Effect<
  GetQueryStatusWorkloadInsightsTopContributorsDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startQueryWorkloadInsightsTopContributors: (
  input: StartQueryWorkloadInsightsTopContributorsInput,
) => effect.Effect<
  StartQueryWorkloadInsightsTopContributorsOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startQueryWorkloadInsightsTopContributorsData: (
  input: StartQueryWorkloadInsightsTopContributorsDataInput,
) => effect.Effect<
  StartQueryWorkloadInsightsTopContributorsDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopQueryMonitorTopContributors: (
  input: StopQueryMonitorTopContributorsInput,
) => effect.Effect<
  StopQueryMonitorTopContributorsOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopQueryWorkloadInsightsTopContributors: (
  input: StopQueryWorkloadInsightsTopContributorsInput,
) => effect.Effect<
  StopQueryWorkloadInsightsTopContributorsOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopQueryWorkloadInsightsTopContributorsData: (
  input: StopQueryWorkloadInsightsTopContributorsDataInput,
) => effect.Effect<
  StopQueryWorkloadInsightsTopContributorsDataOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createMonitor: (
  input: CreateMonitorInput,
) => effect.Effect<
  CreateMonitorOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQueryResultsMonitorTopContributors: {
  (
    input: GetQueryResultsMonitorTopContributorsInput,
  ): effect.Effect<
    GetQueryResultsMonitorTopContributorsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetQueryResultsMonitorTopContributorsInput,
  ) => stream.Stream<
    GetQueryResultsMonitorTopContributorsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetQueryResultsMonitorTopContributorsInput,
  ) => stream.Stream<
    MonitorTopContributorsRow,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "topContributors",
    pageSize: "maxResults",
  } as const,
}));
