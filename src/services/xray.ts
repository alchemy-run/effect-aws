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
const svc = T.AwsApiService({ sdkId: "XRay", serviceShapeName: "AWSXRay" });
const auth = T.AwsAuthSigv4({ name: "xray" });
const ver = T.ServiceVersion("2016-04-12");
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
              `https://xray-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://xray-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://xray.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://xray.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type TraceId = string;
export type RetrievalToken = string;
export type GroupName = string;
export type FilterExpression = string;
export type GroupARN = string;
export type PolicyName = string;
export type PolicyRevisionId = string;
export type GetGroupsNextToken = string;
export type InsightId = string;
export type GetInsightEventsMaxResults = number;
export type Token = string;
export type GetInsightSummariesMaxResults = number;
export type EntitySelectorExpression = string;
export type NullableInteger = number;
export type ResourcePolicyNextToken = string;
export type AmazonResourceName = string;
export type EncryptionKeyId = string;
export type PolicyDocument = string;
export type EC2InstanceId = string;
export type Hostname = string;
export type ResourceARN = string;
export type TraceSegmentDocument = string;
export type TagKey = string;
export type TagValue = string;
export type RuleName = string;
export type Priority = number;
export type FixedRate = number;
export type ReservoirSize = number;
export type ServiceName = string;
export type ServiceType = string;
export type Host = string;
export type HTTPMethod = string;
export type URLPath = string;
export type Version = number;
export type ClientID = string;
export type RequestCount = number;
export type SampledCount = number;
export type BorrowCount = number;
export type AnomalyCount = number;
export type TotalCount = number;
export type SampledAnomalyCount = number;
export type NullableDouble = number;
export type ErrorMessage = string;
export type AttributeKey = string;
export type AttributeValue = string;
export type MaxRate = number;
export type CooldownWindowMinutes = number;
export type InsightSummaryText = string;
export type EventSummaryText = string;
export type Integer = number;
export type NullableLong = number;
export type SegmentId = string;
export type SegmentDocument = string;
export type Double = number;
export type SpanId = string;
export type SpanDocument = string;
export type AnnotationKey = string;

//# Schemas
export interface GetEncryptionConfigRequest {}
export const GetEncryptionConfigRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/EncryptionConfig" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEncryptionConfigRequest",
}) as any as S.Schema<GetEncryptionConfigRequest>;
export interface GetTraceSegmentDestinationRequest {}
export const GetTraceSegmentDestinationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTraceSegmentDestination" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTraceSegmentDestinationRequest",
}) as any as S.Schema<GetTraceSegmentDestinationRequest>;
export type TraceIdList = string[];
export const TraceIdList = S.Array(S.String);
export type InsightStateList = string[];
export const InsightStateList = S.Array(S.String);
export type TraceSegmentDocumentList = string[];
export const TraceSegmentDocumentList = S.Array(S.String);
export type TraceIdListForRetrieval = string[];
export const TraceIdListForRetrieval = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface BatchGetTracesRequest {
  TraceIds: TraceIdList;
  NextToken?: string;
}
export const BatchGetTracesRequest = S.suspend(() =>
  S.Struct({ TraceIds: TraceIdList, NextToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/Traces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetTracesRequest",
}) as any as S.Schema<BatchGetTracesRequest>;
export interface CancelTraceRetrievalRequest {
  RetrievalToken: string;
}
export const CancelTraceRetrievalRequest = S.suspend(() =>
  S.Struct({ RetrievalToken: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CancelTraceRetrieval" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelTraceRetrievalRequest",
}) as any as S.Schema<CancelTraceRetrievalRequest>;
export interface CancelTraceRetrievalResult {}
export const CancelTraceRetrievalResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelTraceRetrievalResult",
}) as any as S.Schema<CancelTraceRetrievalResult>;
export interface DeleteGroupRequest {
  GroupName?: string;
  GroupARN?: string;
}
export const DeleteGroupRequest = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    GroupARN: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGroupRequest",
}) as any as S.Schema<DeleteGroupRequest>;
export interface DeleteGroupResult {}
export const DeleteGroupResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteGroupResult",
}) as any as S.Schema<DeleteGroupResult>;
export interface DeleteResourcePolicyRequest {
  PolicyName: string;
  PolicyRevisionId?: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyName: S.String,
    PolicyRevisionId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteResourcePolicy" }),
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
export interface DeleteResourcePolicyResult {}
export const DeleteResourcePolicyResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourcePolicyResult",
}) as any as S.Schema<DeleteResourcePolicyResult>;
export interface DeleteSamplingRuleRequest {
  RuleName?: string;
  RuleARN?: string;
}
export const DeleteSamplingRuleRequest = S.suspend(() =>
  S.Struct({
    RuleName: S.optional(S.String),
    RuleARN: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteSamplingRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSamplingRuleRequest",
}) as any as S.Schema<DeleteSamplingRuleRequest>;
export interface GetGroupRequest {
  GroupName?: string;
  GroupARN?: string;
}
export const GetGroupRequest = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    GroupARN: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGroupRequest",
}) as any as S.Schema<GetGroupRequest>;
export interface GetGroupsRequest {
  NextToken?: string;
}
export const GetGroupsRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/Groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGroupsRequest",
}) as any as S.Schema<GetGroupsRequest>;
export interface GetIndexingRulesRequest {
  NextToken?: string;
}
export const GetIndexingRulesRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetIndexingRules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIndexingRulesRequest",
}) as any as S.Schema<GetIndexingRulesRequest>;
export interface GetInsightRequest {
  InsightId: string;
}
export const GetInsightRequest = S.suspend(() =>
  S.Struct({ InsightId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/Insight" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInsightRequest",
}) as any as S.Schema<GetInsightRequest>;
export interface GetInsightEventsRequest {
  InsightId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetInsightEventsRequest = S.suspend(() =>
  S.Struct({
    InsightId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/InsightEvents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInsightEventsRequest",
}) as any as S.Schema<GetInsightEventsRequest>;
export interface GetInsightImpactGraphRequest {
  InsightId: string;
  StartTime: Date;
  EndTime: Date;
  NextToken?: string;
}
export const GetInsightImpactGraphRequest = S.suspend(() =>
  S.Struct({
    InsightId: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/InsightImpactGraph" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInsightImpactGraphRequest",
}) as any as S.Schema<GetInsightImpactGraphRequest>;
export interface GetInsightSummariesRequest {
  States?: InsightStateList;
  GroupARN?: string;
  GroupName?: string;
  StartTime: Date;
  EndTime: Date;
  MaxResults?: number;
  NextToken?: string;
}
export const GetInsightSummariesRequest = S.suspend(() =>
  S.Struct({
    States: S.optional(InsightStateList),
    GroupARN: S.optional(S.String),
    GroupName: S.optional(S.String),
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/InsightSummaries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInsightSummariesRequest",
}) as any as S.Schema<GetInsightSummariesRequest>;
export interface GetRetrievedTracesGraphRequest {
  RetrievalToken: string;
  NextToken?: string;
}
export const GetRetrievedTracesGraphRequest = S.suspend(() =>
  S.Struct({ RetrievalToken: S.String, NextToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetRetrievedTracesGraph" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRetrievedTracesGraphRequest",
}) as any as S.Schema<GetRetrievedTracesGraphRequest>;
export interface GetSamplingRulesRequest {
  NextToken?: string;
}
export const GetSamplingRulesRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetSamplingRules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSamplingRulesRequest",
}) as any as S.Schema<GetSamplingRulesRequest>;
export interface GetSamplingStatisticSummariesRequest {
  NextToken?: string;
}
export const GetSamplingStatisticSummariesRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/SamplingStatisticSummaries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSamplingStatisticSummariesRequest",
}) as any as S.Schema<GetSamplingStatisticSummariesRequest>;
export interface GetServiceGraphRequest {
  StartTime: Date;
  EndTime: Date;
  GroupName?: string;
  GroupARN?: string;
  NextToken?: string;
}
export const GetServiceGraphRequest = S.suspend(() =>
  S.Struct({
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    GroupName: S.optional(S.String),
    GroupARN: S.optional(S.String),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ServiceGraph" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServiceGraphRequest",
}) as any as S.Schema<GetServiceGraphRequest>;
export interface GetTimeSeriesServiceStatisticsRequest {
  StartTime: Date;
  EndTime: Date;
  GroupName?: string;
  GroupARN?: string;
  EntitySelectorExpression?: string;
  Period?: number;
  ForecastStatistics?: boolean;
  NextToken?: string;
}
export const GetTimeSeriesServiceStatisticsRequest = S.suspend(() =>
  S.Struct({
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    GroupName: S.optional(S.String),
    GroupARN: S.optional(S.String),
    EntitySelectorExpression: S.optional(S.String),
    Period: S.optional(S.Number),
    ForecastStatistics: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TimeSeriesServiceStatistics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTimeSeriesServiceStatisticsRequest",
}) as any as S.Schema<GetTimeSeriesServiceStatisticsRequest>;
export interface GetTraceGraphRequest {
  TraceIds: TraceIdList;
  NextToken?: string;
}
export const GetTraceGraphRequest = S.suspend(() =>
  S.Struct({ TraceIds: TraceIdList, NextToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TraceGraph" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTraceGraphRequest",
}) as any as S.Schema<GetTraceGraphRequest>;
export interface GetTraceSegmentDestinationResult {
  Destination?: string;
  Status?: string;
}
export const GetTraceSegmentDestinationResult = S.suspend(() =>
  S.Struct({ Destination: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "GetTraceSegmentDestinationResult",
}) as any as S.Schema<GetTraceSegmentDestinationResult>;
export interface ListResourcePoliciesRequest {
  NextToken?: string;
}
export const ListResourcePoliciesRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListResourcePolicies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourcePoliciesRequest",
}) as any as S.Schema<ListResourcePoliciesRequest>;
export interface ListRetrievedTracesRequest {
  RetrievalToken: string;
  TraceFormat?: string;
  NextToken?: string;
}
export const ListRetrievedTracesRequest = S.suspend(() =>
  S.Struct({
    RetrievalToken: S.String,
    TraceFormat: S.optional(S.String),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListRetrievedTraces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRetrievedTracesRequest",
}) as any as S.Schema<ListRetrievedTracesRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
  NextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, NextToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTagsForResource" }),
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
export interface PutEncryptionConfigRequest {
  KeyId?: string;
  Type: string;
}
export const PutEncryptionConfigRequest = S.suspend(() =>
  S.Struct({ KeyId: S.optional(S.String), Type: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutEncryptionConfig" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEncryptionConfigRequest",
}) as any as S.Schema<PutEncryptionConfigRequest>;
export interface PutResourcePolicyRequest {
  PolicyName: string;
  PolicyDocument: string;
  PolicyRevisionId?: string;
  BypassPolicyLockoutCheck?: boolean;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyName: S.String,
    PolicyDocument: S.String,
    PolicyRevisionId: S.optional(S.String),
    BypassPolicyLockoutCheck: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutResourcePolicy" }),
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
export interface PutTraceSegmentsRequest {
  TraceSegmentDocuments: TraceSegmentDocumentList;
}
export const PutTraceSegmentsRequest = S.suspend(() =>
  S.Struct({ TraceSegmentDocuments: TraceSegmentDocumentList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TraceSegments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTraceSegmentsRequest",
}) as any as S.Schema<PutTraceSegmentsRequest>;
export interface StartTraceRetrievalRequest {
  TraceIds: TraceIdListForRetrieval;
  StartTime: Date;
  EndTime: Date;
}
export const StartTraceRetrievalRequest = S.suspend(() =>
  S.Struct({
    TraceIds: TraceIdListForRetrieval,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartTraceRetrieval" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartTraceRetrievalRequest",
}) as any as S.Schema<StartTraceRetrievalRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TagResource" }),
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
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UntagResource" }),
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
export interface InsightsConfiguration {
  InsightsEnabled?: boolean;
  NotificationsEnabled?: boolean;
}
export const InsightsConfiguration = S.suspend(() =>
  S.Struct({
    InsightsEnabled: S.optional(S.Boolean),
    NotificationsEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "InsightsConfiguration",
}) as any as S.Schema<InsightsConfiguration>;
export interface UpdateGroupRequest {
  GroupName?: string;
  GroupARN?: string;
  FilterExpression?: string;
  InsightsConfiguration?: InsightsConfiguration;
}
export const UpdateGroupRequest = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    GroupARN: S.optional(S.String),
    FilterExpression: S.optional(S.String),
    InsightsConfiguration: S.optional(InsightsConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGroupRequest",
}) as any as S.Schema<UpdateGroupRequest>;
export interface UpdateTraceSegmentDestinationRequest {
  Destination?: string;
}
export const UpdateTraceSegmentDestinationRequest = S.suspend(() =>
  S.Struct({ Destination: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateTraceSegmentDestination" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTraceSegmentDestinationRequest",
}) as any as S.Schema<UpdateTraceSegmentDestinationRequest>;
export type UnprocessedTraceIdList = string[];
export const UnprocessedTraceIdList = S.Array(S.String);
export interface EncryptionConfig {
  KeyId?: string;
  Status?: string;
  Type?: string;
}
export const EncryptionConfig = S.suspend(() =>
  S.Struct({
    KeyId: S.optional(S.String),
    Status: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "EncryptionConfig",
}) as any as S.Schema<EncryptionConfig>;
export type AttributeMap = { [key: string]: string };
export const AttributeMap = S.Record({ key: S.String, value: S.String });
export interface SamplingRateBoost {
  MaxRate: number;
  CooldownWindowMinutes: number;
}
export const SamplingRateBoost = S.suspend(() =>
  S.Struct({ MaxRate: S.Number, CooldownWindowMinutes: S.Number }),
).annotations({
  identifier: "SamplingRateBoost",
}) as any as S.Schema<SamplingRateBoost>;
export interface SamplingRule {
  RuleName?: string;
  RuleARN?: string;
  ResourceARN: string;
  Priority: number;
  FixedRate: number;
  ReservoirSize: number;
  ServiceName: string;
  ServiceType: string;
  Host: string;
  HTTPMethod: string;
  URLPath: string;
  Version: number;
  Attributes?: AttributeMap;
  SamplingRateBoost?: SamplingRateBoost;
}
export const SamplingRule = S.suspend(() =>
  S.Struct({
    RuleName: S.optional(S.String),
    RuleARN: S.optional(S.String),
    ResourceARN: S.String,
    Priority: S.Number,
    FixedRate: S.Number,
    ReservoirSize: S.Number,
    ServiceName: S.String,
    ServiceType: S.String,
    Host: S.String,
    HTTPMethod: S.String,
    URLPath: S.String,
    Version: S.Number,
    Attributes: S.optional(AttributeMap),
    SamplingRateBoost: S.optional(SamplingRateBoost),
  }),
).annotations({ identifier: "SamplingRule" }) as any as S.Schema<SamplingRule>;
export interface SamplingRuleRecord {
  SamplingRule?: SamplingRule;
  CreatedAt?: Date;
  ModifiedAt?: Date;
}
export const SamplingRuleRecord = S.suspend(() =>
  S.Struct({
    SamplingRule: S.optional(SamplingRule),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SamplingRuleRecord",
}) as any as S.Schema<SamplingRuleRecord>;
export type SamplingRuleRecordList = SamplingRuleRecord[];
export const SamplingRuleRecordList = S.Array(SamplingRuleRecord);
export interface SamplingStatisticsDocument {
  RuleName: string;
  ClientID: string;
  Timestamp: Date;
  RequestCount: number;
  SampledCount: number;
  BorrowCount?: number;
}
export const SamplingStatisticsDocument = S.suspend(() =>
  S.Struct({
    RuleName: S.String,
    ClientID: S.String,
    Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    RequestCount: S.Number,
    SampledCount: S.Number,
    BorrowCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "SamplingStatisticsDocument",
}) as any as S.Schema<SamplingStatisticsDocument>;
export type SamplingStatisticsDocumentList = SamplingStatisticsDocument[];
export const SamplingStatisticsDocumentList = S.Array(
  SamplingStatisticsDocument,
);
export interface SamplingBoostStatisticsDocument {
  RuleName: string;
  ServiceName: string;
  Timestamp: Date;
  AnomalyCount: number;
  TotalCount: number;
  SampledAnomalyCount: number;
}
export const SamplingBoostStatisticsDocument = S.suspend(() =>
  S.Struct({
    RuleName: S.String,
    ServiceName: S.String,
    Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    AnomalyCount: S.Number,
    TotalCount: S.Number,
    SampledAnomalyCount: S.Number,
  }),
).annotations({
  identifier: "SamplingBoostStatisticsDocument",
}) as any as S.Schema<SamplingBoostStatisticsDocument>;
export type SamplingBoostStatisticsDocumentList =
  SamplingBoostStatisticsDocument[];
export const SamplingBoostStatisticsDocumentList = S.Array(
  SamplingBoostStatisticsDocument,
);
export interface SamplingStrategy {
  Name?: string;
  Value?: number;
}
export const SamplingStrategy = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.Number) }),
).annotations({
  identifier: "SamplingStrategy",
}) as any as S.Schema<SamplingStrategy>;
export interface SamplingRuleUpdate {
  RuleName?: string;
  RuleARN?: string;
  ResourceARN?: string;
  Priority?: number;
  FixedRate?: number;
  ReservoirSize?: number;
  Host?: string;
  ServiceName?: string;
  ServiceType?: string;
  HTTPMethod?: string;
  URLPath?: string;
  Attributes?: AttributeMap;
  SamplingRateBoost?: SamplingRateBoost;
}
export const SamplingRuleUpdate = S.suspend(() =>
  S.Struct({
    RuleName: S.optional(S.String),
    RuleARN: S.optional(S.String),
    ResourceARN: S.optional(S.String),
    Priority: S.optional(S.Number),
    FixedRate: S.optional(S.Number),
    ReservoirSize: S.optional(S.Number),
    Host: S.optional(S.String),
    ServiceName: S.optional(S.String),
    ServiceType: S.optional(S.String),
    HTTPMethod: S.optional(S.String),
    URLPath: S.optional(S.String),
    Attributes: S.optional(AttributeMap),
    SamplingRateBoost: S.optional(SamplingRateBoost),
  }),
).annotations({
  identifier: "SamplingRuleUpdate",
}) as any as S.Schema<SamplingRuleUpdate>;
export interface CreateGroupRequest {
  GroupName: string;
  FilterExpression?: string;
  InsightsConfiguration?: InsightsConfiguration;
  Tags?: TagList;
}
export const CreateGroupRequest = S.suspend(() =>
  S.Struct({
    GroupName: S.String,
    FilterExpression: S.optional(S.String),
    InsightsConfiguration: S.optional(InsightsConfiguration),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGroupRequest",
}) as any as S.Schema<CreateGroupRequest>;
export interface GetEncryptionConfigResult {
  EncryptionConfig?: EncryptionConfig;
}
export const GetEncryptionConfigResult = S.suspend(() =>
  S.Struct({ EncryptionConfig: S.optional(EncryptionConfig) }),
).annotations({
  identifier: "GetEncryptionConfigResult",
}) as any as S.Schema<GetEncryptionConfigResult>;
export interface GetSamplingRulesResult {
  SamplingRuleRecords?: SamplingRuleRecordList;
  NextToken?: string;
}
export const GetSamplingRulesResult = S.suspend(() =>
  S.Struct({
    SamplingRuleRecords: S.optional(SamplingRuleRecordList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSamplingRulesResult",
}) as any as S.Schema<GetSamplingRulesResult>;
export interface GetSamplingTargetsRequest {
  SamplingStatisticsDocuments: SamplingStatisticsDocumentList;
  SamplingBoostStatisticsDocuments?: SamplingBoostStatisticsDocumentList;
}
export const GetSamplingTargetsRequest = S.suspend(() =>
  S.Struct({
    SamplingStatisticsDocuments: SamplingStatisticsDocumentList,
    SamplingBoostStatisticsDocuments: S.optional(
      SamplingBoostStatisticsDocumentList,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/SamplingTargets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSamplingTargetsRequest",
}) as any as S.Schema<GetSamplingTargetsRequest>;
export type ServiceNames = string[];
export const ServiceNames = S.Array(S.String);
export interface ErrorStatistics {
  ThrottleCount?: number;
  OtherCount?: number;
  TotalCount?: number;
}
export const ErrorStatistics = S.suspend(() =>
  S.Struct({
    ThrottleCount: S.optional(S.Number),
    OtherCount: S.optional(S.Number),
    TotalCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ErrorStatistics",
}) as any as S.Schema<ErrorStatistics>;
export interface FaultStatistics {
  OtherCount?: number;
  TotalCount?: number;
}
export const FaultStatistics = S.suspend(() =>
  S.Struct({
    OtherCount: S.optional(S.Number),
    TotalCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "FaultStatistics",
}) as any as S.Schema<FaultStatistics>;
export interface EdgeStatistics {
  OkCount?: number;
  ErrorStatistics?: ErrorStatistics;
  FaultStatistics?: FaultStatistics;
  TotalCount?: number;
  TotalResponseTime?: number;
}
export const EdgeStatistics = S.suspend(() =>
  S.Struct({
    OkCount: S.optional(S.Number),
    ErrorStatistics: S.optional(ErrorStatistics),
    FaultStatistics: S.optional(FaultStatistics),
    TotalCount: S.optional(S.Number),
    TotalResponseTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "EdgeStatistics",
}) as any as S.Schema<EdgeStatistics>;
export interface HistogramEntry {
  Value?: number;
  Count?: number;
}
export const HistogramEntry = S.suspend(() =>
  S.Struct({ Value: S.optional(S.Number), Count: S.optional(S.Number) }),
).annotations({
  identifier: "HistogramEntry",
}) as any as S.Schema<HistogramEntry>;
export type Histogram = HistogramEntry[];
export const Histogram = S.Array(HistogramEntry);
export type AliasNames = string[];
export const AliasNames = S.Array(S.String);
export interface Alias {
  Name?: string;
  Names?: AliasNames;
  Type?: string;
}
export const Alias = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Names: S.optional(AliasNames),
    Type: S.optional(S.String),
  }),
).annotations({ identifier: "Alias" }) as any as S.Schema<Alias>;
export type AliasList = Alias[];
export const AliasList = S.Array(Alias);
export interface Edge {
  ReferenceId?: number;
  StartTime?: Date;
  EndTime?: Date;
  SummaryStatistics?: EdgeStatistics;
  ResponseTimeHistogram?: Histogram;
  Aliases?: AliasList;
  EdgeType?: string;
  ReceivedEventAgeHistogram?: Histogram;
}
export const Edge = S.suspend(() =>
  S.Struct({
    ReferenceId: S.optional(S.Number),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SummaryStatistics: S.optional(EdgeStatistics),
    ResponseTimeHistogram: S.optional(Histogram),
    Aliases: S.optional(AliasList),
    EdgeType: S.optional(S.String),
    ReceivedEventAgeHistogram: S.optional(Histogram),
  }),
).annotations({ identifier: "Edge" }) as any as S.Schema<Edge>;
export type EdgeList = Edge[];
export const EdgeList = S.Array(Edge);
export interface ServiceStatistics {
  OkCount?: number;
  ErrorStatistics?: ErrorStatistics;
  FaultStatistics?: FaultStatistics;
  TotalCount?: number;
  TotalResponseTime?: number;
}
export const ServiceStatistics = S.suspend(() =>
  S.Struct({
    OkCount: S.optional(S.Number),
    ErrorStatistics: S.optional(ErrorStatistics),
    FaultStatistics: S.optional(FaultStatistics),
    TotalCount: S.optional(S.Number),
    TotalResponseTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServiceStatistics",
}) as any as S.Schema<ServiceStatistics>;
export interface Service {
  ReferenceId?: number;
  Name?: string;
  Names?: ServiceNames;
  Root?: boolean;
  AccountId?: string;
  Type?: string;
  State?: string;
  StartTime?: Date;
  EndTime?: Date;
  Edges?: EdgeList;
  SummaryStatistics?: ServiceStatistics;
  DurationHistogram?: Histogram;
  ResponseTimeHistogram?: Histogram;
}
export const Service = S.suspend(() =>
  S.Struct({
    ReferenceId: S.optional(S.Number),
    Name: S.optional(S.String),
    Names: S.optional(ServiceNames),
    Root: S.optional(S.Boolean),
    AccountId: S.optional(S.String),
    Type: S.optional(S.String),
    State: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Edges: S.optional(EdgeList),
    SummaryStatistics: S.optional(ServiceStatistics),
    DurationHistogram: S.optional(Histogram),
    ResponseTimeHistogram: S.optional(Histogram),
  }),
).annotations({ identifier: "Service" }) as any as S.Schema<Service>;
export type ServiceList = Service[];
export const ServiceList = S.Array(Service);
export interface GetTraceGraphResult {
  Services?: ServiceList;
  NextToken?: string;
}
export const GetTraceGraphResult = S.suspend(() =>
  S.Struct({
    Services: S.optional(ServiceList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTraceGraphResult",
}) as any as S.Schema<GetTraceGraphResult>;
export interface GetTraceSummariesRequest {
  StartTime: Date;
  EndTime: Date;
  TimeRangeType?: string;
  Sampling?: boolean;
  SamplingStrategy?: SamplingStrategy;
  FilterExpression?: string;
  NextToken?: string;
}
export const GetTraceSummariesRequest = S.suspend(() =>
  S.Struct({
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    TimeRangeType: S.optional(S.String),
    Sampling: S.optional(S.Boolean),
    SamplingStrategy: S.optional(SamplingStrategy),
    FilterExpression: S.optional(S.String),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TraceSummaries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTraceSummariesRequest",
}) as any as S.Schema<GetTraceSummariesRequest>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
  NextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutEncryptionConfigResult {
  EncryptionConfig?: EncryptionConfig;
}
export const PutEncryptionConfigResult = S.suspend(() =>
  S.Struct({ EncryptionConfig: S.optional(EncryptionConfig) }),
).annotations({
  identifier: "PutEncryptionConfigResult",
}) as any as S.Schema<PutEncryptionConfigResult>;
export interface ResourcePolicy {
  PolicyName?: string;
  PolicyDocument?: string;
  PolicyRevisionId?: string;
  LastUpdatedTime?: Date;
}
export const ResourcePolicy = S.suspend(() =>
  S.Struct({
    PolicyName: S.optional(S.String),
    PolicyDocument: S.optional(S.String),
    PolicyRevisionId: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ResourcePolicy",
}) as any as S.Schema<ResourcePolicy>;
export interface PutResourcePolicyResult {
  ResourcePolicy?: ResourcePolicy;
}
export const PutResourcePolicyResult = S.suspend(() =>
  S.Struct({ ResourcePolicy: S.optional(ResourcePolicy) }),
).annotations({
  identifier: "PutResourcePolicyResult",
}) as any as S.Schema<PutResourcePolicyResult>;
export interface StartTraceRetrievalResult {
  RetrievalToken?: string;
}
export const StartTraceRetrievalResult = S.suspend(() =>
  S.Struct({ RetrievalToken: S.optional(S.String) }),
).annotations({
  identifier: "StartTraceRetrievalResult",
}) as any as S.Schema<StartTraceRetrievalResult>;
export interface Group {
  GroupName?: string;
  GroupARN?: string;
  FilterExpression?: string;
  InsightsConfiguration?: InsightsConfiguration;
}
export const Group = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    GroupARN: S.optional(S.String),
    FilterExpression: S.optional(S.String),
    InsightsConfiguration: S.optional(InsightsConfiguration),
  }),
).annotations({ identifier: "Group" }) as any as S.Schema<Group>;
export interface UpdateGroupResult {
  Group?: Group;
}
export const UpdateGroupResult = S.suspend(() =>
  S.Struct({ Group: S.optional(Group) }),
).annotations({
  identifier: "UpdateGroupResult",
}) as any as S.Schema<UpdateGroupResult>;
export interface UpdateSamplingRuleRequest {
  SamplingRuleUpdate: SamplingRuleUpdate;
}
export const UpdateSamplingRuleRequest = S.suspend(() =>
  S.Struct({ SamplingRuleUpdate: SamplingRuleUpdate }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateSamplingRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSamplingRuleRequest",
}) as any as S.Schema<UpdateSamplingRuleRequest>;
export interface UpdateTraceSegmentDestinationResult {
  Destination?: string;
  Status?: string;
}
export const UpdateTraceSegmentDestinationResult = S.suspend(() =>
  S.Struct({ Destination: S.optional(S.String), Status: S.optional(S.String) }),
).annotations({
  identifier: "UpdateTraceSegmentDestinationResult",
}) as any as S.Schema<UpdateTraceSegmentDestinationResult>;
export type InsightCategoryList = string[];
export const InsightCategoryList = S.Array(S.String);
export interface BackendConnectionErrors {
  TimeoutCount?: number;
  ConnectionRefusedCount?: number;
  HTTPCode4XXCount?: number;
  HTTPCode5XXCount?: number;
  UnknownHostCount?: number;
  OtherCount?: number;
}
export const BackendConnectionErrors = S.suspend(() =>
  S.Struct({
    TimeoutCount: S.optional(S.Number),
    ConnectionRefusedCount: S.optional(S.Number),
    HTTPCode4XXCount: S.optional(S.Number),
    HTTPCode5XXCount: S.optional(S.Number),
    UnknownHostCount: S.optional(S.Number),
    OtherCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "BackendConnectionErrors",
}) as any as S.Schema<BackendConnectionErrors>;
export interface ProbabilisticRuleValueUpdate {
  DesiredSamplingPercentage: number;
}
export const ProbabilisticRuleValueUpdate = S.suspend(() =>
  S.Struct({ DesiredSamplingPercentage: S.Number }),
).annotations({
  identifier: "ProbabilisticRuleValueUpdate",
}) as any as S.Schema<ProbabilisticRuleValueUpdate>;
export interface GroupSummary {
  GroupName?: string;
  GroupARN?: string;
  FilterExpression?: string;
  InsightsConfiguration?: InsightsConfiguration;
}
export const GroupSummary = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    GroupARN: S.optional(S.String),
    FilterExpression: S.optional(S.String),
    InsightsConfiguration: S.optional(InsightsConfiguration),
  }),
).annotations({ identifier: "GroupSummary" }) as any as S.Schema<GroupSummary>;
export type GroupSummaryList = GroupSummary[];
export const GroupSummaryList = S.Array(GroupSummary);
export interface RequestImpactStatistics {
  FaultCount?: number;
  OkCount?: number;
  TotalCount?: number;
}
export const RequestImpactStatistics = S.suspend(() =>
  S.Struct({
    FaultCount: S.optional(S.Number),
    OkCount: S.optional(S.Number),
    TotalCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "RequestImpactStatistics",
}) as any as S.Schema<RequestImpactStatistics>;
export interface ServiceId {
  Name?: string;
  Names?: ServiceNames;
  AccountId?: string;
  Type?: string;
}
export const ServiceId = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Names: S.optional(ServiceNames),
    AccountId: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({ identifier: "ServiceId" }) as any as S.Schema<ServiceId>;
export interface AnomalousService {
  ServiceId?: ServiceId;
}
export const AnomalousService = S.suspend(() =>
  S.Struct({ ServiceId: S.optional(ServiceId) }),
).annotations({
  identifier: "AnomalousService",
}) as any as S.Schema<AnomalousService>;
export type AnomalousServiceList = AnomalousService[];
export const AnomalousServiceList = S.Array(AnomalousService);
export interface InsightEvent {
  Summary?: string;
  EventTime?: Date;
  ClientRequestImpactStatistics?: RequestImpactStatistics;
  RootCauseServiceRequestImpactStatistics?: RequestImpactStatistics;
  TopAnomalousServices?: AnomalousServiceList;
}
export const InsightEvent = S.suspend(() =>
  S.Struct({
    Summary: S.optional(S.String),
    EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ClientRequestImpactStatistics: S.optional(RequestImpactStatistics),
    RootCauseServiceRequestImpactStatistics: S.optional(
      RequestImpactStatistics,
    ),
    TopAnomalousServices: S.optional(AnomalousServiceList),
  }),
).annotations({ identifier: "InsightEvent" }) as any as S.Schema<InsightEvent>;
export type InsightEventList = InsightEvent[];
export const InsightEventList = S.Array(InsightEvent);
export interface InsightSummary {
  InsightId?: string;
  GroupARN?: string;
  GroupName?: string;
  RootCauseServiceId?: ServiceId;
  Categories?: InsightCategoryList;
  State?: string;
  StartTime?: Date;
  EndTime?: Date;
  Summary?: string;
  ClientRequestImpactStatistics?: RequestImpactStatistics;
  RootCauseServiceRequestImpactStatistics?: RequestImpactStatistics;
  TopAnomalousServices?: AnomalousServiceList;
  LastUpdateTime?: Date;
}
export const InsightSummary = S.suspend(() =>
  S.Struct({
    InsightId: S.optional(S.String),
    GroupARN: S.optional(S.String),
    GroupName: S.optional(S.String),
    RootCauseServiceId: S.optional(ServiceId),
    Categories: S.optional(InsightCategoryList),
    State: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Summary: S.optional(S.String),
    ClientRequestImpactStatistics: S.optional(RequestImpactStatistics),
    RootCauseServiceRequestImpactStatistics: S.optional(
      RequestImpactStatistics,
    ),
    TopAnomalousServices: S.optional(AnomalousServiceList),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "InsightSummary",
}) as any as S.Schema<InsightSummary>;
export type InsightSummaryList = InsightSummary[];
export const InsightSummaryList = S.Array(InsightSummary);
export interface SamplingStatisticSummary {
  RuleName?: string;
  Timestamp?: Date;
  RequestCount?: number;
  BorrowCount?: number;
  SampledCount?: number;
}
export const SamplingStatisticSummary = S.suspend(() =>
  S.Struct({
    RuleName: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RequestCount: S.optional(S.Number),
    BorrowCount: S.optional(S.Number),
    SampledCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "SamplingStatisticSummary",
}) as any as S.Schema<SamplingStatisticSummary>;
export type SamplingStatisticSummaryList = SamplingStatisticSummary[];
export const SamplingStatisticSummaryList = S.Array(SamplingStatisticSummary);
export type ResourcePolicyList = ResourcePolicy[];
export const ResourcePolicyList = S.Array(ResourcePolicy);
export interface TelemetryRecord {
  Timestamp: Date;
  SegmentsReceivedCount?: number;
  SegmentsSentCount?: number;
  SegmentsSpilloverCount?: number;
  SegmentsRejectedCount?: number;
  BackendConnectionErrors?: BackendConnectionErrors;
}
export const TelemetryRecord = S.suspend(() =>
  S.Struct({
    Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    SegmentsReceivedCount: S.optional(S.Number),
    SegmentsSentCount: S.optional(S.Number),
    SegmentsSpilloverCount: S.optional(S.Number),
    SegmentsRejectedCount: S.optional(S.Number),
    BackendConnectionErrors: S.optional(BackendConnectionErrors),
  }),
).annotations({
  identifier: "TelemetryRecord",
}) as any as S.Schema<TelemetryRecord>;
export type TelemetryRecordList = TelemetryRecord[];
export const TelemetryRecordList = S.Array(TelemetryRecord);
export interface UnprocessedTraceSegment {
  Id?: string;
  ErrorCode?: string;
  Message?: string;
}
export const UnprocessedTraceSegment = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedTraceSegment",
}) as any as S.Schema<UnprocessedTraceSegment>;
export type UnprocessedTraceSegmentList = UnprocessedTraceSegment[];
export const UnprocessedTraceSegmentList = S.Array(UnprocessedTraceSegment);
export type IndexingRuleValueUpdate = {
  Probabilistic: ProbabilisticRuleValueUpdate;
};
export const IndexingRuleValueUpdate = S.Union(
  S.Struct({ Probabilistic: ProbabilisticRuleValueUpdate }),
);
export interface CreateGroupResult {
  Group?: Group;
}
export const CreateGroupResult = S.suspend(() =>
  S.Struct({ Group: S.optional(Group) }),
).annotations({
  identifier: "CreateGroupResult",
}) as any as S.Schema<CreateGroupResult>;
export interface CreateSamplingRuleRequest {
  SamplingRule: SamplingRule;
  Tags?: TagList;
}
export const CreateSamplingRuleRequest = S.suspend(() =>
  S.Struct({ SamplingRule: SamplingRule, Tags: S.optional(TagList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateSamplingRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSamplingRuleRequest",
}) as any as S.Schema<CreateSamplingRuleRequest>;
export interface DeleteSamplingRuleResult {
  SamplingRuleRecord?: SamplingRuleRecord;
}
export const DeleteSamplingRuleResult = S.suspend(() =>
  S.Struct({ SamplingRuleRecord: S.optional(SamplingRuleRecord) }),
).annotations({
  identifier: "DeleteSamplingRuleResult",
}) as any as S.Schema<DeleteSamplingRuleResult>;
export interface GetGroupResult {
  Group?: Group;
}
export const GetGroupResult = S.suspend(() =>
  S.Struct({ Group: S.optional(Group) }),
).annotations({
  identifier: "GetGroupResult",
}) as any as S.Schema<GetGroupResult>;
export interface GetGroupsResult {
  Groups?: GroupSummaryList;
  NextToken?: string;
}
export const GetGroupsResult = S.suspend(() =>
  S.Struct({
    Groups: S.optional(GroupSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetGroupsResult",
}) as any as S.Schema<GetGroupsResult>;
export interface GetInsightEventsResult {
  InsightEvents?: InsightEventList;
  NextToken?: string;
}
export const GetInsightEventsResult = S.suspend(() =>
  S.Struct({
    InsightEvents: S.optional(InsightEventList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetInsightEventsResult",
}) as any as S.Schema<GetInsightEventsResult>;
export interface GetInsightSummariesResult {
  InsightSummaries?: InsightSummaryList;
  NextToken?: string;
}
export const GetInsightSummariesResult = S.suspend(() =>
  S.Struct({
    InsightSummaries: S.optional(InsightSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetInsightSummariesResult",
}) as any as S.Schema<GetInsightSummariesResult>;
export interface GetSamplingStatisticSummariesResult {
  SamplingStatisticSummaries?: SamplingStatisticSummaryList;
  NextToken?: string;
}
export const GetSamplingStatisticSummariesResult = S.suspend(() =>
  S.Struct({
    SamplingStatisticSummaries: S.optional(SamplingStatisticSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSamplingStatisticSummariesResult",
}) as any as S.Schema<GetSamplingStatisticSummariesResult>;
export interface ListResourcePoliciesResult {
  ResourcePolicies?: ResourcePolicyList;
  NextToken?: string;
}
export const ListResourcePoliciesResult = S.suspend(() =>
  S.Struct({
    ResourcePolicies: S.optional(ResourcePolicyList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourcePoliciesResult",
}) as any as S.Schema<ListResourcePoliciesResult>;
export interface PutTelemetryRecordsRequest {
  TelemetryRecords: TelemetryRecordList;
  EC2InstanceId?: string;
  Hostname?: string;
  ResourceARN?: string;
}
export const PutTelemetryRecordsRequest = S.suspend(() =>
  S.Struct({
    TelemetryRecords: TelemetryRecordList,
    EC2InstanceId: S.optional(S.String),
    Hostname: S.optional(S.String),
    ResourceARN: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TelemetryRecords" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTelemetryRecordsRequest",
}) as any as S.Schema<PutTelemetryRecordsRequest>;
export interface PutTelemetryRecordsResult {}
export const PutTelemetryRecordsResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutTelemetryRecordsResult",
}) as any as S.Schema<PutTelemetryRecordsResult>;
export interface PutTraceSegmentsResult {
  UnprocessedTraceSegments?: UnprocessedTraceSegmentList;
}
export const PutTraceSegmentsResult = S.suspend(() =>
  S.Struct({
    UnprocessedTraceSegments: S.optional(UnprocessedTraceSegmentList),
  }),
).annotations({
  identifier: "PutTraceSegmentsResult",
}) as any as S.Schema<PutTraceSegmentsResult>;
export interface UpdateIndexingRuleRequest {
  Name: string;
  Rule: (typeof IndexingRuleValueUpdate)["Type"];
}
export const UpdateIndexingRuleRequest = S.suspend(() =>
  S.Struct({ Name: S.String, Rule: IndexingRuleValueUpdate }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateIndexingRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIndexingRuleRequest",
}) as any as S.Schema<UpdateIndexingRuleRequest>;
export interface UpdateSamplingRuleResult {
  SamplingRuleRecord?: SamplingRuleRecord;
}
export const UpdateSamplingRuleResult = S.suspend(() =>
  S.Struct({ SamplingRuleRecord: S.optional(SamplingRuleRecord) }),
).annotations({
  identifier: "UpdateSamplingRuleResult",
}) as any as S.Schema<UpdateSamplingRuleResult>;
export interface Segment {
  Id?: string;
  Document?: string;
}
export const Segment = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Document: S.optional(S.String) }),
).annotations({ identifier: "Segment" }) as any as S.Schema<Segment>;
export type SegmentList = Segment[];
export const SegmentList = S.Array(Segment);
export interface InsightImpactGraphEdge {
  ReferenceId?: number;
}
export const InsightImpactGraphEdge = S.suspend(() =>
  S.Struct({ ReferenceId: S.optional(S.Number) }),
).annotations({
  identifier: "InsightImpactGraphEdge",
}) as any as S.Schema<InsightImpactGraphEdge>;
export type InsightImpactGraphEdgeList = InsightImpactGraphEdge[];
export const InsightImpactGraphEdgeList = S.Array(InsightImpactGraphEdge);
export interface GraphLink {
  ReferenceType?: string;
  SourceTraceId?: string;
  DestinationTraceIds?: TraceIdList;
}
export const GraphLink = S.suspend(() =>
  S.Struct({
    ReferenceType: S.optional(S.String),
    SourceTraceId: S.optional(S.String),
    DestinationTraceIds: S.optional(TraceIdList),
  }),
).annotations({ identifier: "GraphLink" }) as any as S.Schema<GraphLink>;
export type LinksList = GraphLink[];
export const LinksList = S.Array(GraphLink);
export interface ForecastStatistics {
  FaultCountHigh?: number;
  FaultCountLow?: number;
}
export const ForecastStatistics = S.suspend(() =>
  S.Struct({
    FaultCountHigh: S.optional(S.Number),
    FaultCountLow: S.optional(S.Number),
  }),
).annotations({
  identifier: "ForecastStatistics",
}) as any as S.Schema<ForecastStatistics>;
export type ServiceIds = ServiceId[];
export const ServiceIds = S.Array(ServiceId);
export interface Span {
  Id?: string;
  Document?: string;
}
export const Span = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Document: S.optional(S.String) }),
).annotations({ identifier: "Span" }) as any as S.Schema<Span>;
export type SpanList = Span[];
export const SpanList = S.Array(Span);
export interface Trace {
  Id?: string;
  Duration?: number;
  LimitExceeded?: boolean;
  Segments?: SegmentList;
}
export const Trace = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Duration: S.optional(S.Number),
    LimitExceeded: S.optional(S.Boolean),
    Segments: S.optional(SegmentList),
  }),
).annotations({ identifier: "Trace" }) as any as S.Schema<Trace>;
export type TraceList = Trace[];
export const TraceList = S.Array(Trace);
export interface Insight {
  InsightId?: string;
  GroupARN?: string;
  GroupName?: string;
  RootCauseServiceId?: ServiceId;
  Categories?: InsightCategoryList;
  State?: string;
  StartTime?: Date;
  EndTime?: Date;
  Summary?: string;
  ClientRequestImpactStatistics?: RequestImpactStatistics;
  RootCauseServiceRequestImpactStatistics?: RequestImpactStatistics;
  TopAnomalousServices?: AnomalousServiceList;
}
export const Insight = S.suspend(() =>
  S.Struct({
    InsightId: S.optional(S.String),
    GroupARN: S.optional(S.String),
    GroupName: S.optional(S.String),
    RootCauseServiceId: S.optional(ServiceId),
    Categories: S.optional(InsightCategoryList),
    State: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Summary: S.optional(S.String),
    ClientRequestImpactStatistics: S.optional(RequestImpactStatistics),
    RootCauseServiceRequestImpactStatistics: S.optional(
      RequestImpactStatistics,
    ),
    TopAnomalousServices: S.optional(AnomalousServiceList),
  }),
).annotations({ identifier: "Insight" }) as any as S.Schema<Insight>;
export interface InsightImpactGraphService {
  ReferenceId?: number;
  Type?: string;
  Name?: string;
  Names?: ServiceNames;
  AccountId?: string;
  Edges?: InsightImpactGraphEdgeList;
}
export const InsightImpactGraphService = S.suspend(() =>
  S.Struct({
    ReferenceId: S.optional(S.Number),
    Type: S.optional(S.String),
    Name: S.optional(S.String),
    Names: S.optional(ServiceNames),
    AccountId: S.optional(S.String),
    Edges: S.optional(InsightImpactGraphEdgeList),
  }),
).annotations({
  identifier: "InsightImpactGraphService",
}) as any as S.Schema<InsightImpactGraphService>;
export type InsightImpactGraphServiceList = InsightImpactGraphService[];
export const InsightImpactGraphServiceList = S.Array(InsightImpactGraphService);
export interface RetrievedService {
  Service?: Service;
  Links?: LinksList;
}
export const RetrievedService = S.suspend(() =>
  S.Struct({ Service: S.optional(Service), Links: S.optional(LinksList) }),
).annotations({
  identifier: "RetrievedService",
}) as any as S.Schema<RetrievedService>;
export type RetrievedServicesList = RetrievedService[];
export const RetrievedServicesList = S.Array(RetrievedService);
export interface UnprocessedStatistics {
  RuleName?: string;
  ErrorCode?: string;
  Message?: string;
}
export const UnprocessedStatistics = S.suspend(() =>
  S.Struct({
    RuleName: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedStatistics",
}) as any as S.Schema<UnprocessedStatistics>;
export type UnprocessedStatisticsList = UnprocessedStatistics[];
export const UnprocessedStatisticsList = S.Array(UnprocessedStatistics);
export interface TimeSeriesServiceStatistics {
  Timestamp?: Date;
  EdgeSummaryStatistics?: EdgeStatistics;
  ServiceSummaryStatistics?: ServiceStatistics;
  ServiceForecastStatistics?: ForecastStatistics;
  ResponseTimeHistogram?: Histogram;
}
export const TimeSeriesServiceStatistics = S.suspend(() =>
  S.Struct({
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EdgeSummaryStatistics: S.optional(EdgeStatistics),
    ServiceSummaryStatistics: S.optional(ServiceStatistics),
    ServiceForecastStatistics: S.optional(ForecastStatistics),
    ResponseTimeHistogram: S.optional(Histogram),
  }),
).annotations({
  identifier: "TimeSeriesServiceStatistics",
}) as any as S.Schema<TimeSeriesServiceStatistics>;
export type TimeSeriesServiceStatisticsList = TimeSeriesServiceStatistics[];
export const TimeSeriesServiceStatisticsList = S.Array(
  TimeSeriesServiceStatistics,
);
export interface RetrievedTrace {
  Id?: string;
  Duration?: number;
  Spans?: SpanList;
}
export const RetrievedTrace = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Duration: S.optional(S.Number),
    Spans: S.optional(SpanList),
  }),
).annotations({
  identifier: "RetrievedTrace",
}) as any as S.Schema<RetrievedTrace>;
export type TraceSpanList = RetrievedTrace[];
export const TraceSpanList = S.Array(RetrievedTrace);
export interface ProbabilisticRuleValue {
  DesiredSamplingPercentage: number;
  ActualSamplingPercentage?: number;
}
export const ProbabilisticRuleValue = S.suspend(() =>
  S.Struct({
    DesiredSamplingPercentage: S.Number,
    ActualSamplingPercentage: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProbabilisticRuleValue",
}) as any as S.Schema<ProbabilisticRuleValue>;
export interface BatchGetTracesResult {
  Traces?: TraceList;
  UnprocessedTraceIds?: UnprocessedTraceIdList;
  NextToken?: string;
}
export const BatchGetTracesResult = S.suspend(() =>
  S.Struct({
    Traces: S.optional(TraceList),
    UnprocessedTraceIds: S.optional(UnprocessedTraceIdList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetTracesResult",
}) as any as S.Schema<BatchGetTracesResult>;
export interface CreateSamplingRuleResult {
  SamplingRuleRecord?: SamplingRuleRecord;
}
export const CreateSamplingRuleResult = S.suspend(() =>
  S.Struct({ SamplingRuleRecord: S.optional(SamplingRuleRecord) }),
).annotations({
  identifier: "CreateSamplingRuleResult",
}) as any as S.Schema<CreateSamplingRuleResult>;
export interface GetInsightResult {
  Insight?: Insight;
}
export const GetInsightResult = S.suspend(() =>
  S.Struct({ Insight: S.optional(Insight) }),
).annotations({
  identifier: "GetInsightResult",
}) as any as S.Schema<GetInsightResult>;
export interface GetInsightImpactGraphResult {
  InsightId?: string;
  StartTime?: Date;
  EndTime?: Date;
  ServiceGraphStartTime?: Date;
  ServiceGraphEndTime?: Date;
  Services?: InsightImpactGraphServiceList;
  NextToken?: string;
}
export const GetInsightImpactGraphResult = S.suspend(() =>
  S.Struct({
    InsightId: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ServiceGraphStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ServiceGraphEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Services: S.optional(InsightImpactGraphServiceList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetInsightImpactGraphResult",
}) as any as S.Schema<GetInsightImpactGraphResult>;
export interface GetRetrievedTracesGraphResult {
  RetrievalStatus?: string;
  Services?: RetrievedServicesList;
  NextToken?: string;
}
export const GetRetrievedTracesGraphResult = S.suspend(() =>
  S.Struct({
    RetrievalStatus: S.optional(S.String),
    Services: S.optional(RetrievedServicesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRetrievedTracesGraphResult",
}) as any as S.Schema<GetRetrievedTracesGraphResult>;
export interface GetTimeSeriesServiceStatisticsResult {
  TimeSeriesServiceStatistics?: TimeSeriesServiceStatisticsList;
  ContainsOldGroupVersions?: boolean;
  NextToken?: string;
}
export const GetTimeSeriesServiceStatisticsResult = S.suspend(() =>
  S.Struct({
    TimeSeriesServiceStatistics: S.optional(TimeSeriesServiceStatisticsList),
    ContainsOldGroupVersions: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTimeSeriesServiceStatisticsResult",
}) as any as S.Schema<GetTimeSeriesServiceStatisticsResult>;
export interface ListRetrievedTracesResult {
  RetrievalStatus?: string;
  TraceFormat?: string;
  Traces?: TraceSpanList;
  NextToken?: string;
}
export const ListRetrievedTracesResult = S.suspend(() =>
  S.Struct({
    RetrievalStatus: S.optional(S.String),
    TraceFormat: S.optional(S.String),
    Traces: S.optional(TraceSpanList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRetrievedTracesResult",
}) as any as S.Schema<ListRetrievedTracesResult>;
export type IndexingRuleValue = { Probabilistic: ProbabilisticRuleValue };
export const IndexingRuleValue = S.Union(
  S.Struct({ Probabilistic: ProbabilisticRuleValue }),
);
export interface IndexingRule {
  Name?: string;
  ModifiedAt?: Date;
  Rule?: (typeof IndexingRuleValue)["Type"];
}
export const IndexingRule = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Rule: S.optional(IndexingRuleValue),
  }),
).annotations({ identifier: "IndexingRule" }) as any as S.Schema<IndexingRule>;
export interface UpdateIndexingRuleResult {
  IndexingRule?: IndexingRule;
}
export const UpdateIndexingRuleResult = S.suspend(() =>
  S.Struct({ IndexingRule: S.optional(IndexingRule) }),
).annotations({
  identifier: "UpdateIndexingRuleResult",
}) as any as S.Schema<UpdateIndexingRuleResult>;
export interface SamplingBoost {
  BoostRate: number;
  BoostRateTTL: Date;
}
export const SamplingBoost = S.suspend(() =>
  S.Struct({
    BoostRate: S.Number,
    BoostRateTTL: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "SamplingBoost",
}) as any as S.Schema<SamplingBoost>;
export interface Http {
  HttpURL?: string;
  HttpStatus?: number;
  HttpMethod?: string;
  UserAgent?: string;
  ClientIp?: string;
}
export const Http = S.suspend(() =>
  S.Struct({
    HttpURL: S.optional(S.String),
    HttpStatus: S.optional(S.Number),
    HttpMethod: S.optional(S.String),
    UserAgent: S.optional(S.String),
    ClientIp: S.optional(S.String),
  }),
).annotations({ identifier: "Http" }) as any as S.Schema<Http>;
export interface TraceUser {
  UserName?: string;
  ServiceIds?: ServiceIds;
}
export const TraceUser = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    ServiceIds: S.optional(ServiceIds),
  }),
).annotations({ identifier: "TraceUser" }) as any as S.Schema<TraceUser>;
export type TraceUsers = TraceUser[];
export const TraceUsers = S.Array(TraceUser);
export interface ResourceARNDetail {
  ARN?: string;
}
export const ResourceARNDetail = S.suspend(() =>
  S.Struct({ ARN: S.optional(S.String) }),
).annotations({
  identifier: "ResourceARNDetail",
}) as any as S.Schema<ResourceARNDetail>;
export type TraceResourceARNs = ResourceARNDetail[];
export const TraceResourceARNs = S.Array(ResourceARNDetail);
export interface InstanceIdDetail {
  Id?: string;
}
export const InstanceIdDetail = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "InstanceIdDetail",
}) as any as S.Schema<InstanceIdDetail>;
export type TraceInstanceIds = InstanceIdDetail[];
export const TraceInstanceIds = S.Array(InstanceIdDetail);
export interface AvailabilityZoneDetail {
  Name?: string;
}
export const AvailabilityZoneDetail = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "AvailabilityZoneDetail",
}) as any as S.Schema<AvailabilityZoneDetail>;
export type TraceAvailabilityZones = AvailabilityZoneDetail[];
export const TraceAvailabilityZones = S.Array(AvailabilityZoneDetail);
export type IndexingRuleList = IndexingRule[];
export const IndexingRuleList = S.Array(IndexingRule);
export interface SamplingTargetDocument {
  RuleName?: string;
  FixedRate?: number;
  ReservoirQuota?: number;
  ReservoirQuotaTTL?: Date;
  Interval?: number;
  SamplingBoost?: SamplingBoost;
}
export const SamplingTargetDocument = S.suspend(() =>
  S.Struct({
    RuleName: S.optional(S.String),
    FixedRate: S.optional(S.Number),
    ReservoirQuota: S.optional(S.Number),
    ReservoirQuotaTTL: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Interval: S.optional(S.Number),
    SamplingBoost: S.optional(SamplingBoost),
  }),
).annotations({
  identifier: "SamplingTargetDocument",
}) as any as S.Schema<SamplingTargetDocument>;
export type SamplingTargetDocumentList = SamplingTargetDocument[];
export const SamplingTargetDocumentList = S.Array(SamplingTargetDocument);
export interface GetIndexingRulesResult {
  IndexingRules?: IndexingRuleList;
  NextToken?: string;
}
export const GetIndexingRulesResult = S.suspend(() =>
  S.Struct({
    IndexingRules: S.optional(IndexingRuleList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetIndexingRulesResult",
}) as any as S.Schema<GetIndexingRulesResult>;
export interface GetSamplingTargetsResult {
  SamplingTargetDocuments?: SamplingTargetDocumentList;
  LastRuleModification?: Date;
  UnprocessedStatistics?: UnprocessedStatisticsList;
  UnprocessedBoostStatistics?: UnprocessedStatisticsList;
}
export const GetSamplingTargetsResult = S.suspend(() =>
  S.Struct({
    SamplingTargetDocuments: S.optional(SamplingTargetDocumentList),
    LastRuleModification: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UnprocessedStatistics: S.optional(UnprocessedStatisticsList),
    UnprocessedBoostStatistics: S.optional(UnprocessedStatisticsList),
  }),
).annotations({
  identifier: "GetSamplingTargetsResult",
}) as any as S.Schema<GetSamplingTargetsResult>;
export interface GetServiceGraphResult {
  StartTime?: Date;
  EndTime?: Date;
  Services?: ServiceList;
  ContainsOldGroupVersions?: boolean;
  NextToken?: string;
}
export const GetServiceGraphResult = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Services: S.optional(ServiceList),
    ContainsOldGroupVersions: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetServiceGraphResult",
}) as any as S.Schema<GetServiceGraphResult>;
export type AnnotationValue =
  | { NumberValue: number }
  | { BooleanValue: boolean }
  | { StringValue: string };
export const AnnotationValue = S.Union(
  S.Struct({ NumberValue: S.Number }),
  S.Struct({ BooleanValue: S.Boolean }),
  S.Struct({ StringValue: S.String }),
);
export interface RootCauseException {
  Name?: string;
  Message?: string;
}
export const RootCauseException = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "RootCauseException",
}) as any as S.Schema<RootCauseException>;
export type RootCauseExceptions = RootCauseException[];
export const RootCauseExceptions = S.Array(RootCauseException);
export interface ErrorRootCauseEntity {
  Name?: string;
  Exceptions?: RootCauseExceptions;
  Remote?: boolean;
}
export const ErrorRootCauseEntity = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Exceptions: S.optional(RootCauseExceptions),
    Remote: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ErrorRootCauseEntity",
}) as any as S.Schema<ErrorRootCauseEntity>;
export type ErrorRootCauseEntityPath = ErrorRootCauseEntity[];
export const ErrorRootCauseEntityPath = S.Array(ErrorRootCauseEntity);
export interface ResponseTimeRootCauseEntity {
  Name?: string;
  Coverage?: number;
  Remote?: boolean;
}
export const ResponseTimeRootCauseEntity = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Coverage: S.optional(S.Number),
    Remote: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResponseTimeRootCauseEntity",
}) as any as S.Schema<ResponseTimeRootCauseEntity>;
export type ResponseTimeRootCauseEntityPath = ResponseTimeRootCauseEntity[];
export const ResponseTimeRootCauseEntityPath = S.Array(
  ResponseTimeRootCauseEntity,
);
export interface ValueWithServiceIds {
  AnnotationValue?: (typeof AnnotationValue)["Type"];
  ServiceIds?: ServiceIds;
}
export const ValueWithServiceIds = S.suspend(() =>
  S.Struct({
    AnnotationValue: S.optional(AnnotationValue),
    ServiceIds: S.optional(ServiceIds),
  }),
).annotations({
  identifier: "ValueWithServiceIds",
}) as any as S.Schema<ValueWithServiceIds>;
export type ValuesWithServiceIds = ValueWithServiceIds[];
export const ValuesWithServiceIds = S.Array(ValueWithServiceIds);
export interface ErrorRootCauseService {
  Name?: string;
  Names?: ServiceNames;
  Type?: string;
  AccountId?: string;
  EntityPath?: ErrorRootCauseEntityPath;
  Inferred?: boolean;
}
export const ErrorRootCauseService = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Names: S.optional(ServiceNames),
    Type: S.optional(S.String),
    AccountId: S.optional(S.String),
    EntityPath: S.optional(ErrorRootCauseEntityPath),
    Inferred: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ErrorRootCauseService",
}) as any as S.Schema<ErrorRootCauseService>;
export type ErrorRootCauseServices = ErrorRootCauseService[];
export const ErrorRootCauseServices = S.Array(ErrorRootCauseService);
export interface ResponseTimeRootCauseService {
  Name?: string;
  Names?: ServiceNames;
  Type?: string;
  AccountId?: string;
  EntityPath?: ResponseTimeRootCauseEntityPath;
  Inferred?: boolean;
}
export const ResponseTimeRootCauseService = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Names: S.optional(ServiceNames),
    Type: S.optional(S.String),
    AccountId: S.optional(S.String),
    EntityPath: S.optional(ResponseTimeRootCauseEntityPath),
    Inferred: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResponseTimeRootCauseService",
}) as any as S.Schema<ResponseTimeRootCauseService>;
export type ResponseTimeRootCauseServices = ResponseTimeRootCauseService[];
export const ResponseTimeRootCauseServices = S.Array(
  ResponseTimeRootCauseService,
);
export type Annotations = { [key: string]: ValuesWithServiceIds };
export const Annotations = S.Record({
  key: S.String,
  value: ValuesWithServiceIds,
});
export interface ErrorRootCause {
  Services?: ErrorRootCauseServices;
  ClientImpacting?: boolean;
}
export const ErrorRootCause = S.suspend(() =>
  S.Struct({
    Services: S.optional(ErrorRootCauseServices),
    ClientImpacting: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ErrorRootCause",
}) as any as S.Schema<ErrorRootCause>;
export type ErrorRootCauses = ErrorRootCause[];
export const ErrorRootCauses = S.Array(ErrorRootCause);
export interface ResponseTimeRootCause {
  Services?: ResponseTimeRootCauseServices;
  ClientImpacting?: boolean;
}
export const ResponseTimeRootCause = S.suspend(() =>
  S.Struct({
    Services: S.optional(ResponseTimeRootCauseServices),
    ClientImpacting: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResponseTimeRootCause",
}) as any as S.Schema<ResponseTimeRootCause>;
export type ResponseTimeRootCauses = ResponseTimeRootCause[];
export const ResponseTimeRootCauses = S.Array(ResponseTimeRootCause);
export interface FaultRootCauseEntity {
  Name?: string;
  Exceptions?: RootCauseExceptions;
  Remote?: boolean;
}
export const FaultRootCauseEntity = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Exceptions: S.optional(RootCauseExceptions),
    Remote: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FaultRootCauseEntity",
}) as any as S.Schema<FaultRootCauseEntity>;
export type FaultRootCauseEntityPath = FaultRootCauseEntity[];
export const FaultRootCauseEntityPath = S.Array(FaultRootCauseEntity);
export interface FaultRootCauseService {
  Name?: string;
  Names?: ServiceNames;
  Type?: string;
  AccountId?: string;
  EntityPath?: FaultRootCauseEntityPath;
  Inferred?: boolean;
}
export const FaultRootCauseService = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Names: S.optional(ServiceNames),
    Type: S.optional(S.String),
    AccountId: S.optional(S.String),
    EntityPath: S.optional(FaultRootCauseEntityPath),
    Inferred: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FaultRootCauseService",
}) as any as S.Schema<FaultRootCauseService>;
export type FaultRootCauseServices = FaultRootCauseService[];
export const FaultRootCauseServices = S.Array(FaultRootCauseService);
export interface FaultRootCause {
  Services?: FaultRootCauseServices;
  ClientImpacting?: boolean;
}
export const FaultRootCause = S.suspend(() =>
  S.Struct({
    Services: S.optional(FaultRootCauseServices),
    ClientImpacting: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FaultRootCause",
}) as any as S.Schema<FaultRootCause>;
export type FaultRootCauses = FaultRootCause[];
export const FaultRootCauses = S.Array(FaultRootCause);
export interface TraceSummary {
  Id?: string;
  StartTime?: Date;
  Duration?: number;
  ResponseTime?: number;
  HasFault?: boolean;
  HasError?: boolean;
  HasThrottle?: boolean;
  IsPartial?: boolean;
  Http?: Http;
  Annotations?: Annotations;
  Users?: TraceUsers;
  ServiceIds?: ServiceIds;
  ResourceARNs?: TraceResourceARNs;
  InstanceIds?: TraceInstanceIds;
  AvailabilityZones?: TraceAvailabilityZones;
  EntryPoint?: ServiceId;
  FaultRootCauses?: FaultRootCauses;
  ErrorRootCauses?: ErrorRootCauses;
  ResponseTimeRootCauses?: ResponseTimeRootCauses;
  Revision?: number;
  MatchedEventTime?: Date;
}
export const TraceSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Duration: S.optional(S.Number),
    ResponseTime: S.optional(S.Number),
    HasFault: S.optional(S.Boolean),
    HasError: S.optional(S.Boolean),
    HasThrottle: S.optional(S.Boolean),
    IsPartial: S.optional(S.Boolean),
    Http: S.optional(Http),
    Annotations: S.optional(Annotations),
    Users: S.optional(TraceUsers),
    ServiceIds: S.optional(ServiceIds),
    ResourceARNs: S.optional(TraceResourceARNs),
    InstanceIds: S.optional(TraceInstanceIds),
    AvailabilityZones: S.optional(TraceAvailabilityZones),
    EntryPoint: S.optional(ServiceId),
    FaultRootCauses: S.optional(FaultRootCauses),
    ErrorRootCauses: S.optional(ErrorRootCauses),
    ResponseTimeRootCauses: S.optional(ResponseTimeRootCauses),
    Revision: S.optional(S.Number),
    MatchedEventTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "TraceSummary" }) as any as S.Schema<TraceSummary>;
export type TraceSummaryList = TraceSummary[];
export const TraceSummaryList = S.Array(TraceSummary);
export interface GetTraceSummariesResult {
  TraceSummaries?: TraceSummaryList;
  ApproximateTime?: Date;
  TracesProcessedCount?: number;
  NextToken?: string;
}
export const GetTraceSummariesResult = S.suspend(() =>
  S.Struct({
    TraceSummaries: S.optional(TraceSummaryList),
    ApproximateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TracesProcessedCount: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTraceSummariesResult",
}) as any as S.Schema<GetTraceSummariesResult>;

//# Errors
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
) {}
export class InvalidPolicyRevisionIdException extends S.TaggedError<InvalidPolicyRevisionIdException>()(
  "InvalidPolicyRevisionIdException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottledException extends S.TaggedError<ThrottledException>()(
  "ThrottledException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class LockoutPreventionException extends S.TaggedError<LockoutPreventionException>()(
  "LockoutPreventionException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MalformedPolicyDocumentException extends S.TaggedError<MalformedPolicyDocumentException>()(
  "MalformedPolicyDocumentException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RuleLimitExceededException extends S.TaggedError<RuleLimitExceededException>()(
  "RuleLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class PolicyCountLimitExceededException extends S.TaggedError<PolicyCountLimitExceededException>()(
  "PolicyCountLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PolicySizeLimitExceededException extends S.TaggedError<PolicySizeLimitExceededException>()(
  "PolicySizeLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes a resource policy from the target Amazon Web Services account.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => Effect.Effect<
  DeleteResourcePolicyResult,
  | InvalidPolicyRevisionIdException
  | InvalidRequestException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResult,
  errors: [
    InvalidPolicyRevisionIdException,
    InvalidRequestException,
    ThrottledException,
  ],
}));
/**
 * Deletes a sampling rule.
 */
export const deleteSamplingRule: (
  input: DeleteSamplingRuleRequest,
) => Effect.Effect<
  DeleteSamplingRuleResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSamplingRuleRequest,
  output: DeleteSamplingRuleResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves group resource details.
 */
export const getGroup: (
  input: GetGroupRequest,
) => Effect.Effect<
  GetGroupResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupRequest,
  output: GetGroupResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves all active group details.
 */
export const getGroups: {
  (
    input: GetGroupsRequest,
  ): Effect.Effect<
    GetGroupsResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetGroupsRequest,
  ) => Stream.Stream<
    GetGroupsResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetGroupsRequest,
  ) => Stream.Stream<
    GroupSummary,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetGroupsRequest,
  output: GetGroupsResult,
  errors: [InvalidRequestException, ThrottledException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Groups",
  } as const,
}));
/**
 * X-Ray reevaluates insights periodically until they're resolved, and records each intermediate state as an
 * event. You can review an insight's events in the Impact Timeline on the Inspect page in the X-Ray
 * console.
 */
export const getInsightEvents: {
  (
    input: GetInsightEventsRequest,
  ): Effect.Effect<
    GetInsightEventsResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetInsightEventsRequest,
  ) => Stream.Stream<
    GetInsightEventsResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetInsightEventsRequest,
  ) => Stream.Stream<
    unknown,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetInsightEventsRequest,
  output: GetInsightEventsResult,
  errors: [InvalidRequestException, ThrottledException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the summaries of all insights in the specified group matching the provided filter values.
 */
export const getInsightSummaries: {
  (
    input: GetInsightSummariesRequest,
  ): Effect.Effect<
    GetInsightSummariesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetInsightSummariesRequest,
  ) => Stream.Stream<
    GetInsightSummariesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetInsightSummariesRequest,
  ) => Stream.Stream<
    unknown,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetInsightSummariesRequest,
  output: GetInsightSummariesResult,
  errors: [InvalidRequestException, ThrottledException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves information about recent sampling results for all sampling rules.
 */
export const getSamplingStatisticSummaries: {
  (
    input: GetSamplingStatisticSummariesRequest,
  ): Effect.Effect<
    GetSamplingStatisticSummariesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSamplingStatisticSummariesRequest,
  ) => Stream.Stream<
    GetSamplingStatisticSummariesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSamplingStatisticSummariesRequest,
  ) => Stream.Stream<
    SamplingStatisticSummary,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetSamplingStatisticSummariesRequest,
  output: GetSamplingStatisticSummariesResult,
  errors: [InvalidRequestException, ThrottledException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SamplingStatisticSummaries",
  } as const,
}));
/**
 * Returns the list of resource policies in the target Amazon Web Services account.
 */
export const listResourcePolicies: {
  (
    input: ListResourcePoliciesRequest,
  ): Effect.Effect<
    ListResourcePoliciesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourcePoliciesRequest,
  ) => Stream.Stream<
    ListResourcePoliciesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourcePoliciesRequest,
  ) => Stream.Stream<
    ResourcePolicy,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourcePoliciesRequest,
  output: ListResourcePoliciesResult,
  errors: [InvalidRequestException, ThrottledException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourcePolicies",
  } as const,
}));
/**
 * Used by the Amazon Web Services X-Ray daemon to upload telemetry.
 */
export const putTelemetryRecords: (
  input: PutTelemetryRecordsRequest,
) => Effect.Effect<
  PutTelemetryRecordsResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTelemetryRecordsRequest,
  output: PutTelemetryRecordsResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Uploads segment documents to Amazon Web Services X-Ray.
 * A segment document can be a completed segment, an in-progress segment, or an array of
 * subsegments.
 *
 * Segments must include the following fields. For the full segment document schema, see
 * Amazon Web Services X-Ray
 * Segment Documents in the *Amazon Web Services X-Ray Developer Guide*.
 *
 * **Required segment document fields**
 *
 * - `name` - The name of the service that handled the request.
 *
 * - `id` - A 64-bit identifier for the segment, unique among segments in the same trace, in 16
 * hexadecimal digits.
 *
 * - `trace_id` - A unique identifier that connects all segments and subsegments originating from
 * a single client request.
 *
 * - `start_time` - Time the segment or subsegment was created, in floating point seconds in
 * epoch time, accurate to milliseconds. For example, `1480615200.010` or
 * `1.480615200010E9`.
 *
 * - `end_time` - Time the segment or subsegment was closed. For example,
 * `1480615200.090` or `1.480615200090E9`. Specify either an `end_time` or
 * `in_progress`.
 *
 * - `in_progress` - Set to `true` instead of specifying an `end_time` to
 * record that a segment has been started, but is not complete. Send an in-progress segment when your application
 * receives a request that will take a long time to serve, to trace that the request was received. When the
 * response is sent, send the complete segment to overwrite the in-progress segment.
 *
 * A `trace_id` consists of three numbers separated by hyphens. For example,
 * 1-58406520-a006649127e371903a2de979. For trace IDs created by an X-Ray SDK, or by Amazon Web Services services
 * integrated with X-Ray, a trace ID includes:
 *
 * **Trace ID Format**
 *
 * - The version number, for instance, `1`.
 *
 * - The time of the original request, in Unix epoch time, in 8 hexadecimal digits. For
 * example, 10:00AM December 2nd, 2016 PST in epoch time is `1480615200` seconds,
 * or `58406520` in hexadecimal.
 *
 * - A 96-bit identifier for the trace, globally unique, in 24 hexadecimal
 * digits.
 *
 * Trace IDs created via OpenTelemetry have a different format based on the
 * W3C Trace Context specification.
 * A W3C trace ID must be formatted in the X-Ray trace ID format when sending to X-Ray. For example, a W3C
 * trace ID `4efaaf4d1e8720b39541901950019ee5` should be formatted as
 * `1-4efaaf4d-1e8720b39541901950019ee5` when sending to X-Ray. While X-Ray trace IDs include
 * the original request timestamp in Unix epoch time, this is not required or validated.
 */
export const putTraceSegments: (
  input: PutTraceSegmentsRequest,
) => Effect.Effect<
  PutTraceSegmentsResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTraceSegmentsRequest,
  output: PutTraceSegmentsResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Modifies a sampling rule's configuration.
 */
export const updateSamplingRule: (
  input: UpdateSamplingRuleRequest,
) => Effect.Effect<
  UpdateSamplingRuleResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSamplingRuleRequest,
  output: UpdateSamplingRuleResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Returns a list of tags that are applied to the specified Amazon Web Services X-Ray group or sampling rule.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): Effect.Effect<
    ListTagsForResourceResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    ListTagsForResourceResponse,
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    Tag,
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tags",
  } as const,
}));
/**
 * Initiates a trace retrieval process using the specified time range and for the given trace IDs in the Transaction Search generated CloudWatch log group. For more information, see Transaction Search.
 *
 * API returns a `RetrievalToken`, which can be used with `ListRetrievedTraces` or `GetRetrievedTracesGraph` to fetch results. Retrievals will time out after 60 minutes. To execute long time ranges, consider segmenting into multiple retrievals.
 *
 * If you are using CloudWatch cross-account observability, you can use this operation in a monitoring account to retrieve data from a linked source account, as long as both accounts have transaction search enabled.
 *
 * For retrieving data from X-Ray directly as opposed to the Transaction-Search Log group, see BatchGetTraces.
 */
export const startTraceRetrieval: (
  input: StartTraceRetrievalRequest,
) => Effect.Effect<
  StartTraceRetrievalResult,
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTraceRetrievalRequest,
  output: StartTraceRetrievalResult,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
}));
/**
 * Removes tags from an Amazon Web Services X-Ray group or sampling rule. You cannot edit or delete system
 * tags (those with an `aws:` prefix).
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
}));
/**
 * Retrieves the current encryption configuration for X-Ray data.
 */
export const getEncryptionConfig: (
  input: GetEncryptionConfigRequest,
) => Effect.Effect<
  GetEncryptionConfigResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEncryptionConfigRequest,
  output: GetEncryptionConfigResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves all sampling rules.
 */
export const getSamplingRules: {
  (
    input: GetSamplingRulesRequest,
  ): Effect.Effect<
    GetSamplingRulesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSamplingRulesRequest,
  ) => Stream.Stream<
    GetSamplingRulesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSamplingRulesRequest,
  ) => Stream.Stream<
    SamplingRuleRecord,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetSamplingRulesRequest,
  output: GetSamplingRulesResult,
  errors: [InvalidRequestException, ThrottledException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SamplingRuleRecords",
  } as const,
}));
/**
 * Retrieves a service graph for one or more specific trace IDs.
 */
export const getTraceGraph: {
  (
    input: GetTraceGraphRequest,
  ): Effect.Effect<
    GetTraceGraphResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetTraceGraphRequest,
  ) => Stream.Stream<
    GetTraceGraphResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetTraceGraphRequest,
  ) => Stream.Stream<
    Service,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetTraceGraphRequest,
  output: GetTraceGraphResult,
  errors: [InvalidRequestException, ThrottledException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Services",
  } as const,
}));
/**
 * Updates the encryption configuration for X-Ray data.
 */
export const putEncryptionConfig: (
  input: PutEncryptionConfigRequest,
) => Effect.Effect<
  PutEncryptionConfigResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEncryptionConfigRequest,
  output: PutEncryptionConfigResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Updates a group resource.
 */
export const updateGroup: (
  input: UpdateGroupRequest,
) => Effect.Effect<
  UpdateGroupResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupRequest,
  output: UpdateGroupResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Modifies the destination of data sent to `PutTraceSegments`. The Transaction Search feature requires the CloudWatchLogs destination. For more information, see Transaction Search.
 */
export const updateTraceSegmentDestination: (
  input: UpdateTraceSegmentDestinationRequest,
) => Effect.Effect<
  UpdateTraceSegmentDestinationResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTraceSegmentDestinationRequest,
  output: UpdateTraceSegmentDestinationResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Deletes a group resource.
 */
export const deleteGroup: (
  input: DeleteGroupRequest,
) => Effect.Effect<
  DeleteGroupResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves the current destination of data sent to `PutTraceSegments` and *OpenTelemetry protocol (OTLP)* endpoint. The Transaction Search feature requires a CloudWatchLogs destination. For more information, see Transaction Search and OpenTelemetry.
 */
export const getTraceSegmentDestination: (
  input: GetTraceSegmentDestinationRequest,
) => Effect.Effect<
  GetTraceSegmentDestinationResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTraceSegmentDestinationRequest,
  output: GetTraceSegmentDestinationResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Cancels an ongoing trace retrieval job initiated by `StartTraceRetrieval` using the provided `RetrievalToken`. A successful cancellation will return an HTTP 200 response.
 */
export const cancelTraceRetrieval: (
  input: CancelTraceRetrievalRequest,
) => Effect.Effect<
  CancelTraceRetrievalResult,
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelTraceRetrievalRequest,
  output: CancelTraceRetrievalResult,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
}));
/**
 * Creates a group resource with a name and a filter expression.
 */
export const createGroup: (
  input: CreateGroupRequest,
) => Effect.Effect<
  CreateGroupResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * You cannot find traces through this API if Transaction Search is enabled since trace is not indexed in X-Ray.
 *
 * Retrieves a list of traces specified by ID. Each trace is a collection of segment
 * documents that originates from a single request. Use `GetTraceSummaries` to get a
 * list of trace IDs.
 */
export const batchGetTraces: {
  (
    input: BatchGetTracesRequest,
  ): Effect.Effect<
    BatchGetTracesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: BatchGetTracesRequest,
  ) => Stream.Stream<
    BatchGetTracesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: BatchGetTracesRequest,
  ) => Stream.Stream<
    Trace,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: BatchGetTracesRequest,
  output: BatchGetTracesResult,
  errors: [InvalidRequestException, ThrottledException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Traces",
  } as const,
}));
/**
 * Retrieves the summary information of an insight. This includes impact to clients and
 * root cause services, the top anomalous services, the category, the state of the insight,
 * and the start and end time of the insight.
 */
export const getInsight: (
  input: GetInsightRequest,
) => Effect.Effect<
  GetInsightResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightRequest,
  output: GetInsightResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves a service graph structure filtered by the specified insight. The service graph is limited to only
 * structural information. For a complete service graph, use this API with the GetServiceGraph API.
 */
export const getInsightImpactGraph: (
  input: GetInsightImpactGraphRequest,
) => Effect.Effect<
  GetInsightImpactGraphResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightImpactGraphRequest,
  output: GetInsightImpactGraphResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves a service graph for traces based on the specified `RetrievalToken` from the CloudWatch log group generated by Transaction Search. This API does not initiate a retrieval job. You must first execute `StartTraceRetrieval` to obtain the required `RetrievalToken`.
 *
 * The trace graph describes services that process incoming requests and any downstream services they call, which may include Amazon Web Services resources, external APIs, or databases.
 *
 * The response is empty until the `RetrievalStatus` is *COMPLETE*. Retry the request after the status changes from *RUNNING* or *SCHEDULED* to *COMPLETE* to access the full service graph.
 *
 * When CloudWatch log is the destination, this API can support cross-account observability and service graph retrieval across linked accounts.
 *
 * For retrieving graphs from X-Ray directly as opposed to the Transaction-Search Log group, see GetTraceGraph.
 */
export const getRetrievedTracesGraph: (
  input: GetRetrievedTracesGraphRequest,
) => Effect.Effect<
  GetRetrievedTracesGraphResult,
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRetrievedTracesGraphRequest,
  output: GetRetrievedTracesGraphResult,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
}));
/**
 * Get an aggregation of service statistics defined by a specific time
 * range.
 */
export const getTimeSeriesServiceStatistics: {
  (
    input: GetTimeSeriesServiceStatisticsRequest,
  ): Effect.Effect<
    GetTimeSeriesServiceStatisticsResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetTimeSeriesServiceStatisticsRequest,
  ) => Stream.Stream<
    GetTimeSeriesServiceStatisticsResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetTimeSeriesServiceStatisticsRequest,
  ) => Stream.Stream<
    TimeSeriesServiceStatistics,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetTimeSeriesServiceStatisticsRequest,
  output: GetTimeSeriesServiceStatisticsResult,
  errors: [InvalidRequestException, ThrottledException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TimeSeriesServiceStatistics",
  } as const,
}));
/**
 * Retrieves a list of traces for a given `RetrievalToken` from the CloudWatch log group generated by Transaction Search. For information on what each trace returns, see BatchGetTraces.
 *
 * This API does not initiate a retrieval process. To start a trace retrieval, use `StartTraceRetrieval`, which generates the required `RetrievalToken`.
 *
 * When the `RetrievalStatus` is not *COMPLETE*, the API will return an empty response. Retry the request once the retrieval has completed to access the full list of traces.
 *
 * For cross-account observability, this API can retrieve traces from linked accounts when CloudWatch log is set as the destination across relevant accounts. For more details, see CloudWatch cross-account observability.
 *
 * For retrieving data from X-Ray directly as opposed to the Transaction Search generated log group, see BatchGetTraces.
 */
export const listRetrievedTraces: (
  input: ListRetrievedTracesRequest,
) => Effect.Effect<
  ListRetrievedTracesResult,
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRetrievedTracesRequest,
  output: ListRetrievedTracesResult,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
}));
/**
 * Modifies an indexing rule’s configuration.
 *
 * Indexing rules are used for determining the sampling rate for spans indexed from CloudWatch Logs. For more information, see Transaction Search.
 */
export const updateIndexingRule: (
  input: UpdateIndexingRuleRequest,
) => Effect.Effect<
  UpdateIndexingRuleResult,
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIndexingRuleRequest,
  output: UpdateIndexingRuleResult,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
  ],
}));
/**
 * Applies tags to an existing Amazon Web Services X-Ray group or sampling rule.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottledException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottledException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a rule to control sampling behavior for instrumented applications. Services
 * retrieve rules with GetSamplingRules, and evaluate each rule in ascending
 * order of *priority* for each request. If a rule matches, the service
 * records a trace, borrowing it from the reservoir size. After 10 seconds, the service
 * reports back to X-Ray with GetSamplingTargets to get updated versions of
 * each in-use rule. The updated rule contains a trace quota that the service can use instead
 * of borrowing from the reservoir.
 */
export const createSamplingRule: (
  input: CreateSamplingRuleRequest,
) => Effect.Effect<
  CreateSamplingRuleResult,
  | InvalidRequestException
  | RuleLimitExceededException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSamplingRuleRequest,
  output: CreateSamplingRuleResult,
  errors: [
    InvalidRequestException,
    RuleLimitExceededException,
    ThrottledException,
  ],
}));
/**
 * Retrieves all indexing rules.
 *
 * Indexing rules are used to determine the server-side sampling rate for spans ingested through the CloudWatchLogs destination and indexed by X-Ray. For more information, see Transaction Search.
 */
export const getIndexingRules: (
  input: GetIndexingRulesRequest,
) => Effect.Effect<
  GetIndexingRulesResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIndexingRulesRequest,
  output: GetIndexingRulesResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Requests a sampling quota for rules that the service is using to sample requests.
 */
export const getSamplingTargets: (
  input: GetSamplingTargetsRequest,
) => Effect.Effect<
  GetSamplingTargetsResult,
  InvalidRequestException | ThrottledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSamplingTargetsRequest,
  output: GetSamplingTargetsResult,
  errors: [InvalidRequestException, ThrottledException],
}));
/**
 * Retrieves a document that describes services that process incoming requests, and
 * downstream services that they call as a result. Root services process incoming requests and
 * make calls to downstream services. Root services are applications that use the Amazon Web Services X-Ray SDK.
 * Downstream services can be other applications, Amazon Web Services resources, HTTP web APIs, or SQL
 * databases.
 */
export const getServiceGraph: {
  (
    input: GetServiceGraphRequest,
  ): Effect.Effect<
    GetServiceGraphResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetServiceGraphRequest,
  ) => Stream.Stream<
    GetServiceGraphResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetServiceGraphRequest,
  ) => Stream.Stream<
    Service,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetServiceGraphRequest,
  output: GetServiceGraphResult,
  errors: [InvalidRequestException, ThrottledException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Services",
  } as const,
}));
/**
 * Sets the resource policy to grant one or more Amazon Web Services services and accounts permissions to
 * access X-Ray. Each resource policy will be associated with a specific Amazon Web Services account.
 * Each Amazon Web Services account can have a maximum of 5 resource policies, and each policy name must be
 * unique within that account. The maximum size of each resource policy is 5KB.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => Effect.Effect<
  PutResourcePolicyResult,
  | InvalidPolicyRevisionIdException
  | LockoutPreventionException
  | MalformedPolicyDocumentException
  | PolicyCountLimitExceededException
  | PolicySizeLimitExceededException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResult,
  errors: [
    InvalidPolicyRevisionIdException,
    LockoutPreventionException,
    MalformedPolicyDocumentException,
    PolicyCountLimitExceededException,
    PolicySizeLimitExceededException,
    ThrottledException,
  ],
}));
/**
 * Retrieves IDs and annotations for traces available for a specified time frame using an
 * optional filter. To get the full traces, pass the trace IDs to
 * `BatchGetTraces`.
 *
 * A filter expression can target traced requests that hit specific service nodes or
 * edges, have errors, or come from a known user. For example, the following filter expression
 * targets traces that pass through `api.example.com`:
 *
 * `service("api.example.com")`
 *
 * This filter expression finds traces that have an annotation named `account`
 * with the value `12345`:
 *
 * `annotation.account = "12345"`
 *
 * For a full list of indexed fields and keywords that you can use in filter expressions,
 * see Use filter
 * expressions in the *Amazon Web Services X-Ray Developer Guide*.
 */
export const getTraceSummaries: {
  (
    input: GetTraceSummariesRequest,
  ): Effect.Effect<
    GetTraceSummariesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetTraceSummariesRequest,
  ) => Stream.Stream<
    GetTraceSummariesResult,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetTraceSummariesRequest,
  ) => Stream.Stream<
    TraceSummary,
    InvalidRequestException | ThrottledException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetTraceSummariesRequest,
  output: GetTraceSummariesResult,
  errors: [InvalidRequestException, ThrottledException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TraceSummaries",
  } as const,
}));
