import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({ sdkId: "RUM", serviceShapeName: "RUM" });
const auth = T.AwsAuthSigv4({ name: "rum" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
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
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://rum-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://rum-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://rum.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://rum.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type AppMonitorId = string;
export type Alias = string;
export type TagKey = string;
export type AppMonitorName = string;
export type AppMonitorDomain = string;
export type MaxResultsInteger = number;
export type MetricDestination = string;
export type DestinationArn = string;
export type MetricDefinitionId = string;
export type AppMonitorPlatform = string;
export type PolicyRevisionId = string;
export type MaxQueryResults = number;
export type Token = string;
export type IamRoleArn = string;
export type JsonValue = string;
export type TagValue = string;
export type IdentityPoolId = string;
export type Url = string;
export type SessionSampleRate = number;
export type Telemetry = string;
export type CustomEventsStatus = string;
export type MetricName = string;
export type ValueKey = string;
export type UnitLabel = string;
export type EventPattern = string;
export type Namespace = string;
export type QueryTimestamp = number;
export type QueryFilterKey = string;
export type QueryFilterValue = string;
export type DeobfuscationStatus = string;
export type DeobfuscationS3Uri = string;
export type DimensionKey = string;
export type DimensionName = string;
export type ISOTimestampString = string;
export type StateEnum = string;
export type EventData = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type AppMonitorDomainList = string[];
export const AppMonitorDomainList = S.Array(S.String);
export type MetricDefinitionIds = string[];
export const MetricDefinitionIds = S.Array(S.String);
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface GetAppMonitorRequest {
  Name: string;
}
export const GetAppMonitorRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/appmonitor/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAppMonitorRequest",
}) as any as S.Schema<GetAppMonitorRequest>;
export interface DeleteAppMonitorRequest {
  Name: string;
}
export const DeleteAppMonitorRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/appmonitor/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppMonitorRequest",
}) as any as S.Schema<DeleteAppMonitorRequest>;
export interface DeleteAppMonitorResponse {}
export const DeleteAppMonitorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAppMonitorResponse",
}) as any as S.Schema<DeleteAppMonitorResponse>;
export interface ListAppMonitorsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListAppMonitorsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/appmonitors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppMonitorsRequest",
}) as any as S.Schema<ListAppMonitorsRequest>;
export interface BatchDeleteRumMetricDefinitionsRequest {
  AppMonitorName: string;
  Destination: string;
  DestinationArn?: string;
  MetricDefinitionIds: MetricDefinitionIds;
}
export const BatchDeleteRumMetricDefinitionsRequest = S.suspend(() =>
  S.Struct({
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String.pipe(T.HttpQuery("destination")),
    DestinationArn: S.optional(S.String).pipe(T.HttpQuery("destinationArn")),
    MetricDefinitionIds: MetricDefinitionIds.pipe(
      T.HttpQuery("metricDefinitionIds"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/rummetrics/{AppMonitorName}/metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteRumMetricDefinitionsRequest",
}) as any as S.Schema<BatchDeleteRumMetricDefinitionsRequest>;
export interface BatchGetRumMetricDefinitionsRequest {
  AppMonitorName: string;
  Destination: string;
  DestinationArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const BatchGetRumMetricDefinitionsRequest = S.suspend(() =>
  S.Struct({
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String.pipe(T.HttpQuery("destination")),
    DestinationArn: S.optional(S.String).pipe(T.HttpQuery("destinationArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/rummetrics/{AppMonitorName}/metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetRumMetricDefinitionsRequest",
}) as any as S.Schema<BatchGetRumMetricDefinitionsRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export type Pages = string[];
export const Pages = S.Array(S.String);
export type FavoritePages = string[];
export const FavoritePages = S.Array(S.String);
export type Telemetries = string[];
export const Telemetries = S.Array(S.String);
export interface AppMonitorConfiguration {
  IdentityPoolId?: string;
  ExcludedPages?: Pages;
  IncludedPages?: Pages;
  FavoritePages?: FavoritePages;
  SessionSampleRate?: number;
  GuestRoleArn?: string;
  AllowCookies?: boolean;
  Telemetries?: Telemetries;
  EnableXRay?: boolean;
}
export const AppMonitorConfiguration = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.optional(S.String),
    ExcludedPages: S.optional(Pages),
    IncludedPages: S.optional(Pages),
    FavoritePages: S.optional(FavoritePages),
    SessionSampleRate: S.optional(S.Number),
    GuestRoleArn: S.optional(S.String),
    AllowCookies: S.optional(S.Boolean),
    Telemetries: S.optional(Telemetries),
    EnableXRay: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AppMonitorConfiguration",
}) as any as S.Schema<AppMonitorConfiguration>;
export interface CustomEvents {
  Status?: string;
}
export const CustomEvents = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({ identifier: "CustomEvents" }) as any as S.Schema<CustomEvents>;
export interface JavaScriptSourceMaps {
  Status: string;
  S3Uri?: string;
}
export const JavaScriptSourceMaps = S.suspend(() =>
  S.Struct({ Status: S.String, S3Uri: S.optional(S.String) }),
).annotations({
  identifier: "JavaScriptSourceMaps",
}) as any as S.Schema<JavaScriptSourceMaps>;
export interface DeobfuscationConfiguration {
  JavaScriptSourceMaps?: JavaScriptSourceMaps;
}
export const DeobfuscationConfiguration = S.suspend(() =>
  S.Struct({ JavaScriptSourceMaps: S.optional(JavaScriptSourceMaps) }),
).annotations({
  identifier: "DeobfuscationConfiguration",
}) as any as S.Schema<DeobfuscationConfiguration>;
export interface CreateAppMonitorRequest {
  Name: string;
  Domain?: string;
  DomainList?: AppMonitorDomainList;
  Tags?: TagMap;
  AppMonitorConfiguration?: AppMonitorConfiguration;
  CwLogEnabled?: boolean;
  CustomEvents?: CustomEvents;
  DeobfuscationConfiguration?: DeobfuscationConfiguration;
  Platform?: string;
}
export const CreateAppMonitorRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Domain: S.optional(S.String),
    DomainList: S.optional(AppMonitorDomainList),
    Tags: S.optional(TagMap),
    AppMonitorConfiguration: S.optional(AppMonitorConfiguration),
    CwLogEnabled: S.optional(S.Boolean),
    CustomEvents: S.optional(CustomEvents),
    DeobfuscationConfiguration: S.optional(DeobfuscationConfiguration),
    Platform: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/appmonitor" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppMonitorRequest",
}) as any as S.Schema<CreateAppMonitorRequest>;
export interface DeleteResourcePolicyRequest {
  Name: string;
  PolicyRevisionId?: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    PolicyRevisionId: S.optional(S.String).pipe(
      T.HttpQuery("policyRevisionId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/appmonitor/{Name}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteRumMetricsDestinationRequest {
  AppMonitorName: string;
  Destination: string;
  DestinationArn?: string;
}
export const DeleteRumMetricsDestinationRequest = S.suspend(() =>
  S.Struct({
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String.pipe(T.HttpQuery("destination")),
    DestinationArn: S.optional(S.String).pipe(T.HttpQuery("destinationArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/rummetrics/{AppMonitorName}/metricsdestination",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRumMetricsDestinationRequest",
}) as any as S.Schema<DeleteRumMetricsDestinationRequest>;
export interface DeleteRumMetricsDestinationResponse {}
export const DeleteRumMetricsDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRumMetricsDestinationResponse",
}) as any as S.Schema<DeleteRumMetricsDestinationResponse>;
export interface GetResourcePolicyRequest {
  Name: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/appmonitor/{Name}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface ListRumMetricsDestinationsRequest {
  AppMonitorName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListRumMetricsDestinationsRequest = S.suspend(() =>
  S.Struct({
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/rummetrics/{AppMonitorName}/metricsdestination",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRumMetricsDestinationsRequest",
}) as any as S.Schema<ListRumMetricsDestinationsRequest>;
export interface PutResourcePolicyRequest {
  Name: string;
  PolicyDocument: string;
  PolicyRevisionId?: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    PolicyDocument: S.String,
    PolicyRevisionId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/appmonitor/{Name}/policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface PutRumMetricsDestinationRequest {
  AppMonitorName: string;
  Destination: string;
  DestinationArn?: string;
  IamRoleArn?: string;
}
export const PutRumMetricsDestinationRequest = S.suspend(() =>
  S.Struct({
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String,
    DestinationArn: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/rummetrics/{AppMonitorName}/metricsdestination",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRumMetricsDestinationRequest",
}) as any as S.Schema<PutRumMetricsDestinationRequest>;
export interface PutRumMetricsDestinationResponse {}
export const PutRumMetricsDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutRumMetricsDestinationResponse",
}) as any as S.Schema<PutRumMetricsDestinationResponse>;
export type DimensionKeysMap = { [key: string]: string };
export const DimensionKeysMap = S.Record({ key: S.String, value: S.String });
export interface MetricDefinitionRequest {
  Name: string;
  ValueKey?: string;
  UnitLabel?: string;
  DimensionKeys?: DimensionKeysMap;
  EventPattern?: string;
  Namespace?: string;
}
export const MetricDefinitionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ValueKey: S.optional(S.String),
    UnitLabel: S.optional(S.String),
    DimensionKeys: S.optional(DimensionKeysMap),
    EventPattern: S.optional(S.String),
    Namespace: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricDefinitionRequest",
}) as any as S.Schema<MetricDefinitionRequest>;
export interface UpdateRumMetricDefinitionRequest {
  AppMonitorName: string;
  Destination: string;
  DestinationArn?: string;
  MetricDefinition: MetricDefinitionRequest;
  MetricDefinitionId: string;
}
export const UpdateRumMetricDefinitionRequest = S.suspend(() =>
  S.Struct({
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String,
    DestinationArn: S.optional(S.String),
    MetricDefinition: MetricDefinitionRequest,
    MetricDefinitionId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/rummetrics/{AppMonitorName}/metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRumMetricDefinitionRequest",
}) as any as S.Schema<UpdateRumMetricDefinitionRequest>;
export interface UpdateRumMetricDefinitionResponse {}
export const UpdateRumMetricDefinitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateRumMetricDefinitionResponse",
}) as any as S.Schema<UpdateRumMetricDefinitionResponse>;
export type QueryFilterValueList = string[];
export const QueryFilterValueList = S.Array(S.String);
export interface AppMonitorDetails {
  name?: string;
  id?: string;
  version?: string;
}
export const AppMonitorDetails = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    id: S.optional(S.String),
    version: S.optional(S.String),
  }),
).annotations({
  identifier: "AppMonitorDetails",
}) as any as S.Schema<AppMonitorDetails>;
export interface UserDetails {
  userId?: string;
  sessionId?: string;
}
export const UserDetails = S.suspend(() =>
  S.Struct({ userId: S.optional(S.String), sessionId: S.optional(S.String) }),
).annotations({ identifier: "UserDetails" }) as any as S.Schema<UserDetails>;
export interface RumEvent {
  id: string;
  timestamp: Date;
  type: string;
  metadata?: string;
  details: string;
}
export const RumEvent = S.suspend(() =>
  S.Struct({
    id: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    type: S.String,
    metadata: S.optional(S.String),
    details: S.String,
  }),
).annotations({ identifier: "RumEvent" }) as any as S.Schema<RumEvent>;
export type RumEventList = RumEvent[];
export const RumEventList = S.Array(RumEvent);
export interface TimeRange {
  After: number;
  Before?: number;
}
export const TimeRange = S.suspend(() =>
  S.Struct({ After: S.Number, Before: S.optional(S.Number) }),
).annotations({ identifier: "TimeRange" }) as any as S.Schema<TimeRange>;
export interface QueryFilter {
  Name?: string;
  Values?: QueryFilterValueList;
}
export const QueryFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Values: S.optional(QueryFilterValueList),
  }),
).annotations({ identifier: "QueryFilter" }) as any as S.Schema<QueryFilter>;
export type QueryFilters = QueryFilter[];
export const QueryFilters = S.Array(QueryFilter);
export interface ListTagsForResourceResponse {
  ResourceArn: string;
  Tags: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutRumEventsRequest {
  Id: string;
  BatchId: string;
  AppMonitorDetails: AppMonitorDetails;
  UserDetails: UserDetails;
  RumEvents: RumEventList;
  Alias?: string;
}
export const PutRumEventsRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    BatchId: S.String,
    AppMonitorDetails: AppMonitorDetails,
    UserDetails: UserDetails,
    RumEvents: RumEventList,
    Alias: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/appmonitors/{Id}/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRumEventsRequest",
}) as any as S.Schema<PutRumEventsRequest>;
export interface PutRumEventsResponse {}
export const PutRumEventsResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutRumEventsResponse",
}) as any as S.Schema<PutRumEventsResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface CreateAppMonitorResponse {
  Id?: string;
}
export const CreateAppMonitorResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "CreateAppMonitorResponse",
}) as any as S.Schema<CreateAppMonitorResponse>;
export interface DeleteResourcePolicyResponse {
  PolicyRevisionId?: string;
}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({ PolicyRevisionId: S.optional(S.String) }),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface GetAppMonitorDataRequest {
  Name: string;
  TimeRange: TimeRange;
  Filters?: QueryFilters;
  MaxResults?: number;
  NextToken?: string;
}
export const GetAppMonitorDataRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    TimeRange: TimeRange,
    Filters: S.optional(QueryFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/appmonitor/{Name}/data" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAppMonitorDataRequest",
}) as any as S.Schema<GetAppMonitorDataRequest>;
export interface GetResourcePolicyResponse {
  PolicyDocument?: string;
  PolicyRevisionId?: string;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    PolicyDocument: S.optional(S.String),
    PolicyRevisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface PutResourcePolicyResponse {
  PolicyDocument?: string;
  PolicyRevisionId?: string;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    PolicyDocument: S.optional(S.String),
    PolicyRevisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface AppMonitorSummary {
  Name?: string;
  Id?: string;
  Created?: string;
  LastModified?: string;
  State?: string;
  Platform?: string;
}
export const AppMonitorSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Created: S.optional(S.String),
    LastModified: S.optional(S.String),
    State: S.optional(S.String),
    Platform: S.optional(S.String),
  }),
).annotations({
  identifier: "AppMonitorSummary",
}) as any as S.Schema<AppMonitorSummary>;
export type AppMonitorSummaryList = AppMonitorSummary[];
export const AppMonitorSummaryList = S.Array(AppMonitorSummary);
export type MetricDefinitionsRequest = MetricDefinitionRequest[];
export const MetricDefinitionsRequest = S.Array(MetricDefinitionRequest);
export interface BatchDeleteRumMetricDefinitionsError {
  MetricDefinitionId: string;
  ErrorCode: string;
  ErrorMessage: string;
}
export const BatchDeleteRumMetricDefinitionsError = S.suspend(() =>
  S.Struct({
    MetricDefinitionId: S.String,
    ErrorCode: S.String,
    ErrorMessage: S.String,
  }),
).annotations({
  identifier: "BatchDeleteRumMetricDefinitionsError",
}) as any as S.Schema<BatchDeleteRumMetricDefinitionsError>;
export type BatchDeleteRumMetricDefinitionsErrors =
  BatchDeleteRumMetricDefinitionsError[];
export const BatchDeleteRumMetricDefinitionsErrors = S.Array(
  BatchDeleteRumMetricDefinitionsError,
);
export interface MetricDefinition {
  MetricDefinitionId: string;
  Name: string;
  ValueKey?: string;
  UnitLabel?: string;
  DimensionKeys?: DimensionKeysMap;
  EventPattern?: string;
  Namespace?: string;
}
export const MetricDefinition = S.suspend(() =>
  S.Struct({
    MetricDefinitionId: S.String,
    Name: S.String,
    ValueKey: S.optional(S.String),
    UnitLabel: S.optional(S.String),
    DimensionKeys: S.optional(DimensionKeysMap),
    EventPattern: S.optional(S.String),
    Namespace: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricDefinition",
}) as any as S.Schema<MetricDefinition>;
export type MetricDefinitions = MetricDefinition[];
export const MetricDefinitions = S.Array(MetricDefinition);
export type EventDataList = string[];
export const EventDataList = S.Array(S.String);
export interface MetricDestinationSummary {
  Destination?: string;
  DestinationArn?: string;
  IamRoleArn?: string;
}
export const MetricDestinationSummary = S.suspend(() =>
  S.Struct({
    Destination: S.optional(S.String),
    DestinationArn: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricDestinationSummary",
}) as any as S.Schema<MetricDestinationSummary>;
export type MetricDestinationSummaryList = MetricDestinationSummary[];
export const MetricDestinationSummaryList = S.Array(MetricDestinationSummary);
export interface UpdateAppMonitorRequest {
  Name: string;
  Domain?: string;
  DomainList?: AppMonitorDomainList;
  AppMonitorConfiguration?: AppMonitorConfiguration;
  CwLogEnabled?: boolean;
  CustomEvents?: CustomEvents;
  DeobfuscationConfiguration?: DeobfuscationConfiguration;
}
export const UpdateAppMonitorRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Domain: S.optional(S.String),
    DomainList: S.optional(AppMonitorDomainList),
    AppMonitorConfiguration: S.optional(AppMonitorConfiguration),
    CwLogEnabled: S.optional(S.Boolean),
    CustomEvents: S.optional(CustomEvents),
    DeobfuscationConfiguration: S.optional(DeobfuscationConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/appmonitor/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAppMonitorRequest",
}) as any as S.Schema<UpdateAppMonitorRequest>;
export interface UpdateAppMonitorResponse {}
export const UpdateAppMonitorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAppMonitorResponse",
}) as any as S.Schema<UpdateAppMonitorResponse>;
export interface ListAppMonitorsResponse {
  NextToken?: string;
  AppMonitorSummaries?: AppMonitorSummaryList;
}
export const ListAppMonitorsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    AppMonitorSummaries: S.optional(AppMonitorSummaryList),
  }),
).annotations({
  identifier: "ListAppMonitorsResponse",
}) as any as S.Schema<ListAppMonitorsResponse>;
export interface BatchCreateRumMetricDefinitionsRequest {
  AppMonitorName: string;
  Destination: string;
  DestinationArn?: string;
  MetricDefinitions: MetricDefinitionsRequest;
}
export const BatchCreateRumMetricDefinitionsRequest = S.suspend(() =>
  S.Struct({
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String,
    DestinationArn: S.optional(S.String),
    MetricDefinitions: MetricDefinitionsRequest,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/rummetrics/{AppMonitorName}/metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchCreateRumMetricDefinitionsRequest",
}) as any as S.Schema<BatchCreateRumMetricDefinitionsRequest>;
export interface BatchDeleteRumMetricDefinitionsResponse {
  Errors: BatchDeleteRumMetricDefinitionsErrors;
  MetricDefinitionIds?: MetricDefinitionIds;
}
export const BatchDeleteRumMetricDefinitionsResponse = S.suspend(() =>
  S.Struct({
    Errors: BatchDeleteRumMetricDefinitionsErrors,
    MetricDefinitionIds: S.optional(MetricDefinitionIds),
  }),
).annotations({
  identifier: "BatchDeleteRumMetricDefinitionsResponse",
}) as any as S.Schema<BatchDeleteRumMetricDefinitionsResponse>;
export interface BatchGetRumMetricDefinitionsResponse {
  MetricDefinitions?: MetricDefinitions;
  NextToken?: string;
}
export const BatchGetRumMetricDefinitionsResponse = S.suspend(() =>
  S.Struct({
    MetricDefinitions: S.optional(MetricDefinitions),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetRumMetricDefinitionsResponse",
}) as any as S.Schema<BatchGetRumMetricDefinitionsResponse>;
export interface GetAppMonitorDataResponse {
  Events?: EventDataList;
  NextToken?: string;
}
export const GetAppMonitorDataResponse = S.suspend(() =>
  S.Struct({
    Events: S.optional(EventDataList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAppMonitorDataResponse",
}) as any as S.Schema<GetAppMonitorDataResponse>;
export interface ListRumMetricsDestinationsResponse {
  Destinations?: MetricDestinationSummaryList;
  NextToken?: string;
}
export const ListRumMetricsDestinationsResponse = S.suspend(() =>
  S.Struct({
    Destinations: S.optional(MetricDestinationSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRumMetricsDestinationsResponse",
}) as any as S.Schema<ListRumMetricsDestinationsResponse>;
export interface CwLog {
  CwLogEnabled?: boolean;
  CwLogGroup?: string;
}
export const CwLog = S.suspend(() =>
  S.Struct({
    CwLogEnabled: S.optional(S.Boolean),
    CwLogGroup: S.optional(S.String),
  }),
).annotations({ identifier: "CwLog" }) as any as S.Schema<CwLog>;
export interface DataStorage {
  CwLog?: CwLog;
}
export const DataStorage = S.suspend(() =>
  S.Struct({ CwLog: S.optional(CwLog) }),
).annotations({ identifier: "DataStorage" }) as any as S.Schema<DataStorage>;
export interface AppMonitor {
  Name?: string;
  Domain?: string;
  DomainList?: AppMonitorDomainList;
  Id?: string;
  Created?: string;
  LastModified?: string;
  Tags?: TagMap;
  State?: string;
  AppMonitorConfiguration?: AppMonitorConfiguration;
  DataStorage?: DataStorage;
  CustomEvents?: CustomEvents;
  DeobfuscationConfiguration?: DeobfuscationConfiguration;
  Platform?: string;
}
export const AppMonitor = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Domain: S.optional(S.String),
    DomainList: S.optional(AppMonitorDomainList),
    Id: S.optional(S.String),
    Created: S.optional(S.String),
    LastModified: S.optional(S.String),
    Tags: S.optional(TagMap),
    State: S.optional(S.String),
    AppMonitorConfiguration: S.optional(AppMonitorConfiguration),
    DataStorage: S.optional(DataStorage),
    CustomEvents: S.optional(CustomEvents),
    DeobfuscationConfiguration: S.optional(DeobfuscationConfiguration),
    Platform: S.optional(S.String),
  }),
).annotations({ identifier: "AppMonitor" }) as any as S.Schema<AppMonitor>;
export interface BatchCreateRumMetricDefinitionsError {
  MetricDefinition: MetricDefinitionRequest;
  ErrorCode: string;
  ErrorMessage: string;
}
export const BatchCreateRumMetricDefinitionsError = S.suspend(() =>
  S.Struct({
    MetricDefinition: MetricDefinitionRequest,
    ErrorCode: S.String,
    ErrorMessage: S.String,
  }),
).annotations({
  identifier: "BatchCreateRumMetricDefinitionsError",
}) as any as S.Schema<BatchCreateRumMetricDefinitionsError>;
export type BatchCreateRumMetricDefinitionsErrors =
  BatchCreateRumMetricDefinitionsError[];
export const BatchCreateRumMetricDefinitionsErrors = S.Array(
  BatchCreateRumMetricDefinitionsError,
);
export interface GetAppMonitorResponse {
  AppMonitor?: AppMonitor;
}
export const GetAppMonitorResponse = S.suspend(() =>
  S.Struct({ AppMonitor: S.optional(AppMonitor) }),
).annotations({
  identifier: "GetAppMonitorResponse",
}) as any as S.Schema<GetAppMonitorResponse>;
export interface BatchCreateRumMetricDefinitionsResponse {
  Errors: BatchCreateRumMetricDefinitionsErrors;
  MetricDefinitions?: MetricDefinitions;
}
export const BatchCreateRumMetricDefinitionsResponse = S.suspend(() =>
  S.Struct({
    Errors: BatchCreateRumMetricDefinitionsErrors,
    MetricDefinitions: S.optional(MetricDefinitions),
  }),
).annotations({
  identifier: "BatchCreateRumMetricDefinitionsResponse",
}) as any as S.Schema<BatchCreateRumMetricDefinitionsResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceName: S.String,
    resourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceName: S.String,
    resourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class InvalidPolicyRevisionIdException extends S.TaggedError<InvalidPolicyRevisionIdException>()(
  "InvalidPolicyRevisionIdException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class PolicyNotFoundException extends S.TaggedError<PolicyNotFoundException>()(
  "PolicyNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class MalformedPolicyDocumentException extends S.TaggedError<MalformedPolicyDocumentException>()(
  "MalformedPolicyDocumentException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class PolicySizeLimitExceededException extends S.TaggedError<PolicySizeLimitExceededException>()(
  "PolicySizeLimitExceededException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing app monitor. This immediately stops the collection of data.
 */
export const deleteAppMonitor: (
  input: DeleteAppMonitorRequest,
) => Effect.Effect<
  DeleteAppMonitorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppMonitorRequest,
  output: DeleteAppMonitorResponse,
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
 * Retrieves the list of metrics and dimensions that a RUM app monitor is sending to a single destination.
 */
export const batchGetRumMetricDefinitions: {
  (
    input: BatchGetRumMetricDefinitionsRequest,
  ): Effect.Effect<
    BatchGetRumMetricDefinitionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: BatchGetRumMetricDefinitionsRequest,
  ) => Stream.Stream<
    BatchGetRumMetricDefinitionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: BatchGetRumMetricDefinitionsRequest,
  ) => Stream.Stream<
    MetricDefinition,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: BatchGetRumMetricDefinitionsRequest,
  output: BatchGetRumMetricDefinitionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "MetricDefinitions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of destinations that you have created to receive RUM extended metrics, for the specified app monitor.
 *
 * For more information about extended metrics, see AddRumMetrics.
 */
export const listRumMetricsDestinations: {
  (
    input: ListRumMetricsDestinationsRequest,
  ): Effect.Effect<
    ListRumMetricsDestinationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRumMetricsDestinationsRequest,
  ) => Stream.Stream<
    ListRumMetricsDestinationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRumMetricsDestinationsRequest,
  ) => Stream.Stream<
    MetricDestinationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRumMetricsDestinationsRequest,
  output: ListRumMetricsDestinationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Destinations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Displays the tags associated with a CloudWatch RUM resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified CloudWatch RUM resource. Currently, the only resources that can be tagged app monitors.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters.
 *
 * You can use the `TagResource` action with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the alarm. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a resource.
 *
 * For more information, see Tagging Amazon Web Services resources.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a Amazon CloudWatch RUM app monitor, which collects telemetry data from your application and sends that data to RUM. The data includes performance and reliability information such as page load time, client-side errors, and user behavior.
 *
 * You use this operation only to create a new app monitor. To update an existing app monitor, use UpdateAppMonitor instead.
 *
 * After you create an app monitor, sign in to the CloudWatch RUM console to get the JavaScript code snippet to add to your web application. For more information, see How do I find a code snippet that I've already generated?
 */
export const createAppMonitor: (
  input: CreateAppMonitorRequest,
) => Effect.Effect<
  CreateAppMonitorResponse,
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
  input: CreateAppMonitorRequest,
  output: CreateAppMonitorResponse,
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
 * Use this operation to retrieve information about a resource-based policy that is attached to an app monitor.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => Effect.Effect<
  GetResourcePolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | PolicyNotFoundException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    PolicyNotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the Amazon CloudWatch RUM app monitors in the account.
 */
export const listAppMonitors: {
  (
    input: ListAppMonitorsRequest,
  ): Effect.Effect<
    ListAppMonitorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppMonitorsRequest,
  ) => Stream.Stream<
    ListAppMonitorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppMonitorsRequest,
  ) => Stream.Stream<
    AppMonitorSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppMonitorsRequest,
  output: ListAppMonitorsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AppMonitorSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Removes the specified metrics from being sent to an extended metrics destination.
 *
 * If some metric definition IDs specified in a `BatchDeleteRumMetricDefinitions` operations are not valid, those metric definitions fail and return errors, but all valid metric definition IDs in the same operation are still deleted.
 *
 * The maximum number of metric definitions that you can specify in one `BatchDeleteRumMetricDefinitions` operation is 200.
 */
export const batchDeleteRumMetricDefinitions: (
  input: BatchDeleteRumMetricDefinitionsRequest,
) => Effect.Effect<
  BatchDeleteRumMetricDefinitionsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteRumMetricDefinitionsRequest,
  output: BatchDeleteRumMetricDefinitionsResponse,
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
 * Retrieves the raw performance events that RUM has collected from your web application, so that you can do your own processing or analysis of this data.
 */
export const getAppMonitorData: {
  (
    input: GetAppMonitorDataRequest,
  ): Effect.Effect<
    GetAppMonitorDataResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAppMonitorDataRequest,
  ) => Stream.Stream<
    GetAppMonitorDataResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAppMonitorDataRequest,
  ) => Stream.Stream<
    EventData,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetAppMonitorDataRequest,
  output: GetAppMonitorDataResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Events",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Sends telemetry events about your application performance and user behavior to CloudWatch RUM. The code snippet that RUM generates for you to add to your application includes `PutRumEvents` operations to send this data to RUM.
 *
 * Each `PutRumEvents` operation can send a batch of events from one user session.
 */
export const putRumEvents: (
  input: PutRumEventsRequest,
) => Effect.Effect<
  PutRumEventsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRumEventsRequest,
  output: PutRumEventsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a destination for CloudWatch RUM extended metrics, so that the specified app monitor stops sending extended metrics to that destination.
 */
export const deleteRumMetricsDestination: (
  input: DeleteRumMetricsDestinationRequest,
) => Effect.Effect<
  DeleteRumMetricsDestinationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRumMetricsDestinationRequest,
  output: DeleteRumMetricsDestinationResponse,
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
 * Creates or updates a destination to receive extended metrics from CloudWatch RUM. You can send extended metrics to CloudWatch or to a CloudWatch Evidently experiment.
 *
 * For more information about extended metrics, see BatchCreateRumMetricDefinitions.
 */
export const putRumMetricsDestination: (
  input: PutRumMetricsDestinationRequest,
) => Effect.Effect<
  PutRumMetricsDestinationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRumMetricsDestinationRequest,
  output: PutRumMetricsDestinationResponse,
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
 * Updates the configuration of an existing app monitor. When you use this operation, only the parts of the app monitor configuration that you specify in this operation are changed. For any parameters that you omit, the existing values are kept.
 *
 * You can't use this operation to change the tags of an existing app monitor. To change the tags of an existing app monitor, use TagResource.
 *
 * To create a new app monitor, use CreateAppMonitor.
 *
 * After you update an app monitor, sign in to the CloudWatch RUM console to get the updated JavaScript code snippet to add to your web application. For more information, see How do I find a code snippet that I've already generated?
 */
export const updateAppMonitor: (
  input: UpdateAppMonitorRequest,
) => Effect.Effect<
  UpdateAppMonitorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppMonitorRequest,
  output: UpdateAppMonitorResponse,
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
 * Modifies one existing metric definition for CloudWatch RUM extended metrics. For more information about extended metrics, see BatchCreateRumMetricsDefinitions.
 */
export const updateRumMetricDefinition: (
  input: UpdateRumMetricDefinitionRequest,
) => Effect.Effect<
  UpdateRumMetricDefinitionResponse,
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
  input: UpdateRumMetricDefinitionRequest,
  output: UpdateRumMetricDefinitionResponse,
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
 * Removes the association of a resource-based policy from an app monitor.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => Effect.Effect<
  DeleteResourcePolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidPolicyRevisionIdException
  | PolicyNotFoundException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidPolicyRevisionIdException,
    PolicyNotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the complete configuration information for one app monitor.
 */
export const getAppMonitor: (
  input: GetAppMonitorRequest,
) => Effect.Effect<
  GetAppMonitorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppMonitorRequest,
  output: GetAppMonitorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Specifies the extended metrics and custom metrics that you want a CloudWatch RUM app monitor to send to a destination. Valid destinations include CloudWatch and Evidently.
 *
 * By default, RUM app monitors send some metrics to CloudWatch. These default metrics are listed in CloudWatch metrics that you can collect with CloudWatch RUM.
 *
 * In addition to these default metrics, you can choose to send extended metrics, custom metrics, or both.
 *
 * - Extended metrics let you send metrics with additional dimensions that aren't included in the default metrics. You can also send extended metrics to both Evidently and CloudWatch. The valid dimension names for the additional dimensions for extended metrics are `BrowserName`, `CountryCode`, `DeviceType`, `FileType`, `OSName`, and `PageId`. For more information, see Extended metrics that you can send to CloudWatch and CloudWatch Evidently.
 *
 * - Custom metrics are metrics that you define. You can send custom metrics to CloudWatch. CloudWatch Evidently, or both. With custom metrics, you can use any metric name and namespace. To derive the metrics, you can use any custom events, built-in events, custom attributes, or default attributes.
 *
 * You can't send custom metrics to the `AWS/RUM` namespace. You must send custom metrics to a custom namespace that you define. The namespace that you use can't start with `AWS/`. CloudWatch RUM prepends `RUM/CustomMetrics/` to the custom namespace that you define, so the final namespace for your metrics in CloudWatch is `RUM/CustomMetrics/*your-custom-namespace* `.
 *
 * The maximum number of metric definitions that you can specify in one `BatchCreateRumMetricDefinitions` operation is 200.
 *
 * The maximum number of metric definitions that one destination can contain is 2000.
 *
 * Extended metrics sent to CloudWatch and RUM custom metrics are charged as CloudWatch custom metrics. Each combination of additional dimension name and dimension value counts as a custom metric. For more information, see Amazon CloudWatch Pricing.
 *
 * You must have already created a destination for the metrics before you send them. For more information, see PutRumMetricsDestination.
 *
 * If some metric definitions specified in a `BatchCreateRumMetricDefinitions` operations are not valid, those metric definitions fail and return errors, but all valid metric definitions in the same operation still succeed.
 */
export const batchCreateRumMetricDefinitions: (
  input: BatchCreateRumMetricDefinitionsRequest,
) => Effect.Effect<
  BatchCreateRumMetricDefinitionsResponse,
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
  input: BatchCreateRumMetricDefinitionsRequest,
  output: BatchCreateRumMetricDefinitionsResponse,
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
 * Use this operation to assign a resource-based policy to a CloudWatch RUM app monitor to control access to it. Each app monitor can have one resource-based policy. The maximum size of the policy is 4 KB. To learn more about using resource policies with RUM, see Using resource-based policies with CloudWatch RUM.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => Effect.Effect<
  PutResourcePolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidPolicyRevisionIdException
  | MalformedPolicyDocumentException
  | PolicySizeLimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidPolicyRevisionIdException,
    MalformedPolicyDocumentException,
    PolicySizeLimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
