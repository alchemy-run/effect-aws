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
const ns = T.XmlNamespace("http://cloudtrail.amazonaws.com/doc/2013-11-01/");
const svc = T.AwsApiService({
  sdkId: "CloudTrail",
  serviceShapeName: "CloudTrail_20131101",
});
const auth = T.AwsAuthSigv4({ name: "cloudtrail" });
const ver = T.ServiceVersion("2013-11-01");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://cloudtrail-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (Region === "us-gov-east-1") {
              return e("https://cloudtrail.us-gov-east-1.amazonaws.com");
            }
            if (Region === "us-gov-west-1") {
              return e("https://cloudtrail.us-gov-west-1.amazonaws.com");
            }
            return e(
              `https://cloudtrail-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://cloudtrail.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cloudtrail.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type EventDataStoreArn = string;
export type UUID = string;
export type AccountId = string;
export type ChannelName = string;
export type Source = string;
export type DashboardName = string;
export type TerminationProtectionEnabled = boolean;
export type EventDataStoreName = string;
export type RetentionPeriod = number;
export type EventDataStoreKmsKeyId = string;
export type ChannelArn = string;
export type DashboardArn = string;
export type ResourceArn = string;
export type QueryAlias = string;
export type RefreshId = string;
export type FederationRoleArn = string;
export type Prompt = string;
export type PaginationToken = string;
export type MaxQueryResults = number;
export type ListChannelsMaxResultsCount = number;
export type ListDashboardsMaxResultsCount = number;
export type ListEventDataStoresMaxResultsCount = number;
export type ListImportFailuresMaxResultsCount = number;
export type ListImportsMaxResultsCount = number;
export type ListInsightsDataMaxResultsCount = number;
export type EventSource = string;
export type EventName = string;
export type ErrorCode = string;
export type InsightsMetricPeriod = number;
export type InsightsMetricMaxResults = number;
export type InsightsMetricNextToken = string;
export type ListQueriesMaxResultsCount = number;
export type MaxResults = number;
export type NextToken = string;
export type ResourcePolicy = string;
export type SearchSampleQueriesSearchPhrase = string;
export type SearchSampleQueriesMaxResults = number;
export type QueryStatement = string;
export type DeliveryS3Uri = string;
export type QueryParameter = string;
export type TagKey = string;
export type TagValue = string;
export type Location = string;
export type TimeOfDay = string;
export type SelectorName = string;
export type ListInsightsDataDimensionValue = string;
export type LookupAttributeValue = string;
export type OperatorTargetListMember = string;
export type QueryParameterKey = string;
export type QueryParameterValue = string;
export type ErrorMessage = string;
export type RefreshScheduleFrequencyValue = number;
export type ViewPropertiesKey = string;
export type ViewPropertiesValue = string;
export type SelectorField = string;
export type OperatorValue = string;
export type PartitionKeyName = string;
export type PartitionKeyType = string;
export type QueryResultKey = string;
export type QueryResultValue = string;
export type ByteBuffer = Uint8Array;
export type SampleQueryName = string;
export type SampleQueryDescription = string;
export type SampleQuerySQL = string;
export type SampleQueryRelevance = number;

//# Schemas
export type BillingMode =
  | "EXTENDABLE_RETENTION_PRICING"
  | "FIXED_RETENTION_PRICING"
  | (string & {});
export const BillingMode = S.String;
export type TrailNameList = string[];
export const TrailNameList = S.Array(S.String);
export type EventDataStoreList = string[];
export const EventDataStoreList = S.Array(S.String);
export type DashboardType = "MANAGED" | "CUSTOM" | (string & {});
export const DashboardType = S.String;
export type ImportStatus =
  | "INITIALIZING"
  | "IN_PROGRESS"
  | "FAILED"
  | "STOPPED"
  | "COMPLETED"
  | (string & {});
export const ImportStatus = S.String;
export type ListInsightsDataType = "InsightsEvents" | (string & {});
export const ListInsightsDataType = S.String;
export type InsightType =
  | "ApiCallRateInsight"
  | "ApiErrorRateInsight"
  | (string & {});
export const InsightType = S.String;
export type InsightsMetricDataType =
  | "FillWithZeros"
  | "NonZeroData"
  | (string & {});
export const InsightsMetricDataType = S.String;
export type QueryStatus =
  | "QUEUED"
  | "RUNNING"
  | "FINISHED"
  | "FAILED"
  | "CANCELLED"
  | "TIMED_OUT"
  | (string & {});
export const QueryStatus = S.String;
export type ResourceIdList = string[];
export const ResourceIdList = S.Array(S.String);
export type EventCategory = "insight" | (string & {});
export const EventCategory = S.String;
export type MaxEventSize = "Standard" | "Large" | (string & {});
export const MaxEventSize = S.String;
export type ImportDestinations = string[];
export const ImportDestinations = S.Array(S.String);
export type QueryParameters = string[];
export const QueryParameters = S.Array(S.String);
export interface CancelQueryRequest {
  EventDataStore?: string;
  QueryId: string;
  EventDataStoreOwnerAccountId?: string;
}
export const CancelQueryRequest = S.suspend(() =>
  S.Struct({
    EventDataStore: S.optional(S.String),
    QueryId: S.String,
    EventDataStoreOwnerAccountId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelQueryRequest",
}) as any as S.Schema<CancelQueryRequest>;
export interface Tag {
  Key: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagsList = Tag[];
export const TagsList = S.Array(Tag);
export interface CreateTrailRequest {
  Name: string;
  S3BucketName: string;
  S3KeyPrefix?: string;
  SnsTopicName?: string;
  IncludeGlobalServiceEvents?: boolean;
  IsMultiRegionTrail?: boolean;
  EnableLogFileValidation?: boolean;
  CloudWatchLogsLogGroupArn?: string;
  CloudWatchLogsRoleArn?: string;
  KmsKeyId?: string;
  IsOrganizationTrail?: boolean;
  TagsList?: Tag[];
}
export const CreateTrailRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    S3BucketName: S.String,
    S3KeyPrefix: S.optional(S.String),
    SnsTopicName: S.optional(S.String),
    IncludeGlobalServiceEvents: S.optional(S.Boolean),
    IsMultiRegionTrail: S.optional(S.Boolean),
    EnableLogFileValidation: S.optional(S.Boolean),
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    CloudWatchLogsRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    IsOrganizationTrail: S.optional(S.Boolean),
    TagsList: S.optional(TagsList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTrailRequest",
}) as any as S.Schema<CreateTrailRequest>;
export interface DeleteChannelRequest {
  Channel: string;
}
export const DeleteChannelRequest = S.suspend(() =>
  S.Struct({ Channel: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelRequest",
}) as any as S.Schema<DeleteChannelRequest>;
export interface DeleteChannelResponse {}
export const DeleteChannelResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteChannelResponse",
}) as any as S.Schema<DeleteChannelResponse>;
export interface DeleteDashboardRequest {
  DashboardId: string;
}
export const DeleteDashboardRequest = S.suspend(() =>
  S.Struct({ DashboardId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDashboardRequest",
}) as any as S.Schema<DeleteDashboardRequest>;
export interface DeleteDashboardResponse {}
export const DeleteDashboardResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDashboardResponse",
}) as any as S.Schema<DeleteDashboardResponse>;
export interface DeleteEventDataStoreRequest {
  EventDataStore: string;
}
export const DeleteEventDataStoreRequest = S.suspend(() =>
  S.Struct({ EventDataStore: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventDataStoreRequest",
}) as any as S.Schema<DeleteEventDataStoreRequest>;
export interface DeleteEventDataStoreResponse {}
export const DeleteEventDataStoreResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteEventDataStoreResponse",
}) as any as S.Schema<DeleteEventDataStoreResponse>;
export interface DeleteResourcePolicyRequest {
  ResourceArn: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteTrailRequest {
  Name: string;
}
export const DeleteTrailRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTrailRequest",
}) as any as S.Schema<DeleteTrailRequest>;
export interface DeleteTrailResponse {}
export const DeleteTrailResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTrailResponse",
}) as any as S.Schema<DeleteTrailResponse>;
export interface DeregisterOrganizationDelegatedAdminRequest {
  DelegatedAdminAccountId: string;
}
export const DeregisterOrganizationDelegatedAdminRequest = S.suspend(() =>
  S.Struct({ DelegatedAdminAccountId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterOrganizationDelegatedAdminRequest",
}) as any as S.Schema<DeregisterOrganizationDelegatedAdminRequest>;
export interface DeregisterOrganizationDelegatedAdminResponse {}
export const DeregisterOrganizationDelegatedAdminResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterOrganizationDelegatedAdminResponse",
}) as any as S.Schema<DeregisterOrganizationDelegatedAdminResponse>;
export interface DescribeQueryRequest {
  EventDataStore?: string;
  QueryId?: string;
  QueryAlias?: string;
  RefreshId?: string;
  EventDataStoreOwnerAccountId?: string;
}
export const DescribeQueryRequest = S.suspend(() =>
  S.Struct({
    EventDataStore: S.optional(S.String),
    QueryId: S.optional(S.String),
    QueryAlias: S.optional(S.String),
    RefreshId: S.optional(S.String),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeQueryRequest",
}) as any as S.Schema<DescribeQueryRequest>;
export interface DescribeTrailsRequest {
  trailNameList?: string[];
  includeShadowTrails?: boolean;
}
export const DescribeTrailsRequest = S.suspend(() =>
  S.Struct({
    trailNameList: S.optional(TrailNameList),
    includeShadowTrails: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTrailsRequest",
}) as any as S.Schema<DescribeTrailsRequest>;
export interface DisableFederationRequest {
  EventDataStore: string;
}
export const DisableFederationRequest = S.suspend(() =>
  S.Struct({ EventDataStore: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableFederationRequest",
}) as any as S.Schema<DisableFederationRequest>;
export interface EnableFederationRequest {
  EventDataStore: string;
  FederationRoleArn: string;
}
export const EnableFederationRequest = S.suspend(() =>
  S.Struct({ EventDataStore: S.String, FederationRoleArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableFederationRequest",
}) as any as S.Schema<EnableFederationRequest>;
export interface GenerateQueryRequest {
  EventDataStores: string[];
  Prompt: string;
}
export const GenerateQueryRequest = S.suspend(() =>
  S.Struct({ EventDataStores: EventDataStoreList, Prompt: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateQueryRequest",
}) as any as S.Schema<GenerateQueryRequest>;
export interface GetChannelRequest {
  Channel: string;
}
export const GetChannelRequest = S.suspend(() =>
  S.Struct({ Channel: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChannelRequest",
}) as any as S.Schema<GetChannelRequest>;
export interface GetDashboardRequest {
  DashboardId: string;
}
export const GetDashboardRequest = S.suspend(() =>
  S.Struct({ DashboardId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDashboardRequest",
}) as any as S.Schema<GetDashboardRequest>;
export interface GetEventConfigurationRequest {
  TrailName?: string;
  EventDataStore?: string;
}
export const GetEventConfigurationRequest = S.suspend(() =>
  S.Struct({
    TrailName: S.optional(S.String),
    EventDataStore: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventConfigurationRequest",
}) as any as S.Schema<GetEventConfigurationRequest>;
export interface GetEventDataStoreRequest {
  EventDataStore: string;
}
export const GetEventDataStoreRequest = S.suspend(() =>
  S.Struct({ EventDataStore: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventDataStoreRequest",
}) as any as S.Schema<GetEventDataStoreRequest>;
export interface GetEventSelectorsRequest {
  TrailName: string;
}
export const GetEventSelectorsRequest = S.suspend(() =>
  S.Struct({ TrailName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventSelectorsRequest",
}) as any as S.Schema<GetEventSelectorsRequest>;
export interface GetImportRequest {
  ImportId: string;
}
export const GetImportRequest = S.suspend(() =>
  S.Struct({ ImportId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetImportRequest",
}) as any as S.Schema<GetImportRequest>;
export interface GetInsightSelectorsRequest {
  TrailName?: string;
  EventDataStore?: string;
}
export const GetInsightSelectorsRequest = S.suspend(() =>
  S.Struct({
    TrailName: S.optional(S.String),
    EventDataStore: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInsightSelectorsRequest",
}) as any as S.Schema<GetInsightSelectorsRequest>;
export interface GetQueryResultsRequest {
  EventDataStore?: string;
  QueryId: string;
  NextToken?: string;
  MaxQueryResults?: number;
  EventDataStoreOwnerAccountId?: string;
}
export const GetQueryResultsRequest = S.suspend(() =>
  S.Struct({
    EventDataStore: S.optional(S.String),
    QueryId: S.String,
    NextToken: S.optional(S.String),
    MaxQueryResults: S.optional(S.Number),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQueryResultsRequest",
}) as any as S.Schema<GetQueryResultsRequest>;
export interface GetResourcePolicyRequest {
  ResourceArn: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface GetTrailRequest {
  Name: string;
}
export const GetTrailRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrailRequest",
}) as any as S.Schema<GetTrailRequest>;
export interface GetTrailStatusRequest {
  Name: string;
}
export const GetTrailStatusRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrailStatusRequest",
}) as any as S.Schema<GetTrailStatusRequest>;
export interface ListChannelsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListChannelsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelsRequest",
}) as any as S.Schema<ListChannelsRequest>;
export interface ListDashboardsRequest {
  NamePrefix?: string;
  Type?: DashboardType;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDashboardsRequest = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String),
    Type: S.optional(DashboardType),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDashboardsRequest",
}) as any as S.Schema<ListDashboardsRequest>;
export interface ListEventDataStoresRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListEventDataStoresRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventDataStoresRequest",
}) as any as S.Schema<ListEventDataStoresRequest>;
export interface ListImportFailuresRequest {
  ImportId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListImportFailuresRequest = S.suspend(() =>
  S.Struct({
    ImportId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListImportFailuresRequest",
}) as any as S.Schema<ListImportFailuresRequest>;
export interface ListImportsRequest {
  MaxResults?: number;
  Destination?: string;
  ImportStatus?: ImportStatus;
  NextToken?: string;
}
export const ListImportsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    Destination: S.optional(S.String),
    ImportStatus: S.optional(ImportStatus),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListImportsRequest",
}) as any as S.Schema<ListImportsRequest>;
export interface ListInsightsMetricDataRequest {
  TrailName?: string;
  EventSource: string;
  EventName: string;
  InsightType: InsightType;
  ErrorCode?: string;
  StartTime?: Date;
  EndTime?: Date;
  Period?: number;
  DataType?: InsightsMetricDataType;
  MaxResults?: number;
  NextToken?: string;
}
export const ListInsightsMetricDataRequest = S.suspend(() =>
  S.Struct({
    TrailName: S.optional(S.String),
    EventSource: S.String,
    EventName: S.String,
    InsightType: InsightType,
    ErrorCode: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Period: S.optional(S.Number),
    DataType: S.optional(InsightsMetricDataType),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInsightsMetricDataRequest",
}) as any as S.Schema<ListInsightsMetricDataRequest>;
export interface ListPublicKeysRequest {
  StartTime?: Date;
  EndTime?: Date;
  NextToken?: string;
}
export const ListPublicKeysRequest = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPublicKeysRequest",
}) as any as S.Schema<ListPublicKeysRequest>;
export interface ListQueriesRequest {
  EventDataStore: string;
  NextToken?: string;
  MaxResults?: number;
  StartTime?: Date;
  EndTime?: Date;
  QueryStatus?: QueryStatus;
}
export const ListQueriesRequest = S.suspend(() =>
  S.Struct({
    EventDataStore: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    QueryStatus: S.optional(QueryStatus),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListQueriesRequest",
}) as any as S.Schema<ListQueriesRequest>;
export interface ListTagsRequest {
  ResourceIdList: string[];
  NextToken?: string;
}
export const ListTagsRequest = S.suspend(() =>
  S.Struct({
    ResourceIdList: ResourceIdList,
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsRequest",
}) as any as S.Schema<ListTagsRequest>;
export interface ListTrailsRequest {
  NextToken?: string;
}
export const ListTrailsRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrailsRequest",
}) as any as S.Schema<ListTrailsRequest>;
export interface PutResourcePolicyRequest {
  ResourceArn: string;
  ResourcePolicy: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, ResourcePolicy: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface RegisterOrganizationDelegatedAdminRequest {
  MemberAccountId: string;
}
export const RegisterOrganizationDelegatedAdminRequest = S.suspend(() =>
  S.Struct({ MemberAccountId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterOrganizationDelegatedAdminRequest",
}) as any as S.Schema<RegisterOrganizationDelegatedAdminRequest>;
export interface RegisterOrganizationDelegatedAdminResponse {}
export const RegisterOrganizationDelegatedAdminResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RegisterOrganizationDelegatedAdminResponse",
}) as any as S.Schema<RegisterOrganizationDelegatedAdminResponse>;
export interface RemoveTagsRequest {
  ResourceId: string;
  TagsList: Tag[];
}
export const RemoveTagsRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String, TagsList: TagsList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveTagsRequest",
}) as any as S.Schema<RemoveTagsRequest>;
export interface RemoveTagsResponse {}
export const RemoveTagsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTagsResponse",
}) as any as S.Schema<RemoveTagsResponse>;
export interface RestoreEventDataStoreRequest {
  EventDataStore: string;
}
export const RestoreEventDataStoreRequest = S.suspend(() =>
  S.Struct({ EventDataStore: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RestoreEventDataStoreRequest",
}) as any as S.Schema<RestoreEventDataStoreRequest>;
export interface SearchSampleQueriesRequest {
  SearchPhrase: string;
  MaxResults?: number;
  NextToken?: string;
}
export const SearchSampleQueriesRequest = S.suspend(() =>
  S.Struct({
    SearchPhrase: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchSampleQueriesRequest",
}) as any as S.Schema<SearchSampleQueriesRequest>;
export interface StartEventDataStoreIngestionRequest {
  EventDataStore: string;
}
export const StartEventDataStoreIngestionRequest = S.suspend(() =>
  S.Struct({ EventDataStore: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartEventDataStoreIngestionRequest",
}) as any as S.Schema<StartEventDataStoreIngestionRequest>;
export interface StartEventDataStoreIngestionResponse {}
export const StartEventDataStoreIngestionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StartEventDataStoreIngestionResponse",
}) as any as S.Schema<StartEventDataStoreIngestionResponse>;
export interface StartLoggingRequest {
  Name: string;
}
export const StartLoggingRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartLoggingRequest",
}) as any as S.Schema<StartLoggingRequest>;
export interface StartLoggingResponse {}
export const StartLoggingResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StartLoggingResponse",
}) as any as S.Schema<StartLoggingResponse>;
export interface StartQueryRequest {
  QueryStatement?: string;
  DeliveryS3Uri?: string;
  QueryAlias?: string;
  QueryParameters?: string[];
  EventDataStoreOwnerAccountId?: string;
}
export const StartQueryRequest = S.suspend(() =>
  S.Struct({
    QueryStatement: S.optional(S.String),
    DeliveryS3Uri: S.optional(S.String),
    QueryAlias: S.optional(S.String),
    QueryParameters: S.optional(QueryParameters),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartQueryRequest",
}) as any as S.Schema<StartQueryRequest>;
export interface StopEventDataStoreIngestionRequest {
  EventDataStore: string;
}
export const StopEventDataStoreIngestionRequest = S.suspend(() =>
  S.Struct({ EventDataStore: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopEventDataStoreIngestionRequest",
}) as any as S.Schema<StopEventDataStoreIngestionRequest>;
export interface StopEventDataStoreIngestionResponse {}
export const StopEventDataStoreIngestionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StopEventDataStoreIngestionResponse",
}) as any as S.Schema<StopEventDataStoreIngestionResponse>;
export interface StopImportRequest {
  ImportId: string;
}
export const StopImportRequest = S.suspend(() =>
  S.Struct({ ImportId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopImportRequest",
}) as any as S.Schema<StopImportRequest>;
export interface StopLoggingRequest {
  Name: string;
}
export const StopLoggingRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopLoggingRequest",
}) as any as S.Schema<StopLoggingRequest>;
export interface StopLoggingResponse {}
export const StopLoggingResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StopLoggingResponse",
}) as any as S.Schema<StopLoggingResponse>;
export type DestinationType =
  | "EVENT_DATA_STORE"
  | "AWS_SERVICE"
  | (string & {});
export const DestinationType = S.String;
export interface Destination {
  Type: DestinationType;
  Location: string;
}
export const Destination = S.suspend(() =>
  S.Struct({ Type: DestinationType, Location: S.String }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export type Destinations = Destination[];
export const Destinations = S.Array(Destination);
export interface UpdateChannelRequest {
  Channel: string;
  Destinations?: Destination[];
  Name?: string;
}
export const UpdateChannelRequest = S.suspend(() =>
  S.Struct({
    Channel: S.String,
    Destinations: S.optional(Destinations),
    Name: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelRequest",
}) as any as S.Schema<UpdateChannelRequest>;
export type ViewPropertiesMap = { [key: string]: string | undefined };
export const ViewPropertiesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface RequestWidget {
  QueryStatement: string;
  QueryParameters?: string[];
  ViewProperties: { [key: string]: string | undefined };
}
export const RequestWidget = S.suspend(() =>
  S.Struct({
    QueryStatement: S.String,
    QueryParameters: S.optional(QueryParameters),
    ViewProperties: ViewPropertiesMap,
  }),
).annotations({
  identifier: "RequestWidget",
}) as any as S.Schema<RequestWidget>;
export type RequestWidgetList = RequestWidget[];
export const RequestWidgetList = S.Array(RequestWidget);
export type RefreshScheduleFrequencyUnit = "HOURS" | "DAYS" | (string & {});
export const RefreshScheduleFrequencyUnit = S.String;
export interface RefreshScheduleFrequency {
  Unit?: RefreshScheduleFrequencyUnit;
  Value?: number;
}
export const RefreshScheduleFrequency = S.suspend(() =>
  S.Struct({
    Unit: S.optional(RefreshScheduleFrequencyUnit),
    Value: S.optional(S.Number),
  }),
).annotations({
  identifier: "RefreshScheduleFrequency",
}) as any as S.Schema<RefreshScheduleFrequency>;
export type RefreshScheduleStatus = "ENABLED" | "DISABLED" | (string & {});
export const RefreshScheduleStatus = S.String;
export interface RefreshSchedule {
  Frequency?: RefreshScheduleFrequency;
  Status?: RefreshScheduleStatus;
  TimeOfDay?: string;
}
export const RefreshSchedule = S.suspend(() =>
  S.Struct({
    Frequency: S.optional(RefreshScheduleFrequency),
    Status: S.optional(RefreshScheduleStatus),
    TimeOfDay: S.optional(S.String),
  }),
).annotations({
  identifier: "RefreshSchedule",
}) as any as S.Schema<RefreshSchedule>;
export interface UpdateDashboardRequest {
  DashboardId: string;
  Widgets?: RequestWidget[];
  RefreshSchedule?: RefreshSchedule;
  TerminationProtectionEnabled?: boolean;
}
export const UpdateDashboardRequest = S.suspend(() =>
  S.Struct({
    DashboardId: S.String,
    Widgets: S.optional(RequestWidgetList),
    RefreshSchedule: S.optional(RefreshSchedule),
    TerminationProtectionEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDashboardRequest",
}) as any as S.Schema<UpdateDashboardRequest>;
export type Operator = string[];
export const Operator = S.Array(S.String);
export interface AdvancedFieldSelector {
  Field: string;
  Equals?: string[];
  StartsWith?: string[];
  EndsWith?: string[];
  NotEquals?: string[];
  NotStartsWith?: string[];
  NotEndsWith?: string[];
}
export const AdvancedFieldSelector = S.suspend(() =>
  S.Struct({
    Field: S.String,
    Equals: S.optional(Operator),
    StartsWith: S.optional(Operator),
    EndsWith: S.optional(Operator),
    NotEquals: S.optional(Operator),
    NotStartsWith: S.optional(Operator),
    NotEndsWith: S.optional(Operator),
  }),
).annotations({
  identifier: "AdvancedFieldSelector",
}) as any as S.Schema<AdvancedFieldSelector>;
export type AdvancedFieldSelectors = AdvancedFieldSelector[];
export const AdvancedFieldSelectors = S.Array(AdvancedFieldSelector);
export interface AdvancedEventSelector {
  Name?: string;
  FieldSelectors: AdvancedFieldSelector[];
}
export const AdvancedEventSelector = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    FieldSelectors: AdvancedFieldSelectors,
  }),
).annotations({
  identifier: "AdvancedEventSelector",
}) as any as S.Schema<AdvancedEventSelector>;
export type AdvancedEventSelectors = AdvancedEventSelector[];
export const AdvancedEventSelectors = S.Array(AdvancedEventSelector);
export interface UpdateEventDataStoreRequest {
  EventDataStore: string;
  Name?: string;
  AdvancedEventSelectors?: AdvancedEventSelector[];
  MultiRegionEnabled?: boolean;
  OrganizationEnabled?: boolean;
  RetentionPeriod?: number;
  TerminationProtectionEnabled?: boolean;
  KmsKeyId?: string;
  BillingMode?: BillingMode;
}
export const UpdateEventDataStoreRequest = S.suspend(() =>
  S.Struct({
    EventDataStore: S.String,
    Name: S.optional(S.String),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    BillingMode: S.optional(BillingMode),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEventDataStoreRequest",
}) as any as S.Schema<UpdateEventDataStoreRequest>;
export interface UpdateTrailRequest {
  Name: string;
  S3BucketName?: string;
  S3KeyPrefix?: string;
  SnsTopicName?: string;
  IncludeGlobalServiceEvents?: boolean;
  IsMultiRegionTrail?: boolean;
  EnableLogFileValidation?: boolean;
  CloudWatchLogsLogGroupArn?: string;
  CloudWatchLogsRoleArn?: string;
  KmsKeyId?: string;
  IsOrganizationTrail?: boolean;
}
export const UpdateTrailRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    S3BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    SnsTopicName: S.optional(S.String),
    IncludeGlobalServiceEvents: S.optional(S.Boolean),
    IsMultiRegionTrail: S.optional(S.Boolean),
    EnableLogFileValidation: S.optional(S.Boolean),
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    CloudWatchLogsRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    IsOrganizationTrail: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTrailRequest",
}) as any as S.Schema<UpdateTrailRequest>;
export type ListInsightsDataDimensionKey =
  | "EventId"
  | "EventName"
  | "EventSource"
  | (string & {});
export const ListInsightsDataDimensionKey = S.String;
export type LookupAttributeKey =
  | "EventId"
  | "EventName"
  | "ReadOnly"
  | "Username"
  | "ResourceType"
  | "ResourceName"
  | "EventSource"
  | "AccessKeyId"
  | (string & {});
export const LookupAttributeKey = S.String;
export type Type = "TagContext" | "RequestContext" | (string & {});
export const Type = S.String;
export type OperatorTargetList = string[];
export const OperatorTargetList = S.Array(S.String);
export type Template =
  | "API_ACTIVITY"
  | "RESOURCE_ACCESS"
  | "USER_ACTIONS"
  | (string & {});
export const Template = S.String;
export type Templates = Template[];
export const Templates = S.Array(Template);
export type EventCategoryAggregation = "Data" | (string & {});
export const EventCategoryAggregation = S.String;
export type ReadWriteType = "ReadOnly" | "WriteOnly" | "All" | (string & {});
export const ReadWriteType = S.String;
export type ExcludeManagementEventSources = string[];
export const ExcludeManagementEventSources = S.Array(S.String);
export type SourceEventCategory = "Management" | "Data" | (string & {});
export const SourceEventCategory = S.String;
export type SourceEventCategories = SourceEventCategory[];
export const SourceEventCategories = S.Array(SourceEventCategory);
export type DeliveryStatus =
  | "SUCCESS"
  | "FAILED"
  | "FAILED_SIGNING_FILE"
  | "PENDING"
  | "RESOURCE_NOT_FOUND"
  | "ACCESS_DENIED"
  | "ACCESS_DENIED_SIGNING_FILE"
  | "CANCELLED"
  | "UNKNOWN"
  | (string & {});
export const DeliveryStatus = S.String;
export type FederationStatus =
  | "ENABLING"
  | "ENABLED"
  | "DISABLING"
  | "DISABLED"
  | (string & {});
export const FederationStatus = S.String;
export type DashboardStatus =
  | "CREATING"
  | "CREATED"
  | "UPDATING"
  | "UPDATED"
  | "DELETING"
  | (string & {});
export const DashboardStatus = S.String;
export type EventDataStoreStatus =
  | "CREATED"
  | "ENABLED"
  | "PENDING_DELETION"
  | "STARTING_INGESTION"
  | "STOPPING_INGESTION"
  | "STOPPED_INGESTION"
  | (string & {});
export const EventDataStoreStatus = S.String;
export type ListInsightsDataDimensions = {
  [key in ListInsightsDataDimensionKey]?: string;
};
export const ListInsightsDataDimensions = S.partial(
  S.Record({
    key: ListInsightsDataDimensionKey,
    value: S.UndefinedOr(S.String),
  }),
);
export type Timestamps = Date[];
export const Timestamps = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export type InsightsMetricValues = number[];
export const InsightsMetricValues = S.Array(S.Number);
export interface LookupAttribute {
  AttributeKey: LookupAttributeKey;
  AttributeValue: string;
}
export const LookupAttribute = S.suspend(() =>
  S.Struct({ AttributeKey: LookupAttributeKey, AttributeValue: S.String }),
).annotations({
  identifier: "LookupAttribute",
}) as any as S.Schema<LookupAttribute>;
export type LookupAttributesList = LookupAttribute[];
export const LookupAttributesList = S.Array(LookupAttribute);
export interface ContextKeySelector {
  Type: Type;
  Equals: string[];
}
export const ContextKeySelector = S.suspend(() =>
  S.Struct({ Type: Type, Equals: OperatorTargetList }),
).annotations({
  identifier: "ContextKeySelector",
}) as any as S.Schema<ContextKeySelector>;
export type ContextKeySelectors = ContextKeySelector[];
export const ContextKeySelectors = S.Array(ContextKeySelector);
export interface AggregationConfiguration {
  Templates: Template[];
  EventCategory: EventCategoryAggregation;
}
export const AggregationConfiguration = S.suspend(() =>
  S.Struct({ Templates: Templates, EventCategory: EventCategoryAggregation }),
).annotations({
  identifier: "AggregationConfiguration",
}) as any as S.Schema<AggregationConfiguration>;
export type AggregationConfigurations = AggregationConfiguration[];
export const AggregationConfigurations = S.Array(AggregationConfiguration);
export interface InsightSelector {
  InsightType?: InsightType;
  EventCategories?: SourceEventCategory[];
}
export const InsightSelector = S.suspend(() =>
  S.Struct({
    InsightType: S.optional(InsightType),
    EventCategories: S.optional(SourceEventCategories),
  }),
).annotations({
  identifier: "InsightSelector",
}) as any as S.Schema<InsightSelector>;
export type InsightSelectors = InsightSelector[];
export const InsightSelectors = S.Array(InsightSelector);
export type QueryParameterValues = { [key: string]: string | undefined };
export const QueryParameterValues = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type DataResourceValues = string[];
export const DataResourceValues = S.Array(S.String);
export interface AddTagsRequest {
  ResourceId: string;
  TagsList: Tag[];
}
export const AddTagsRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String, TagsList: TagsList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddTagsRequest",
}) as any as S.Schema<AddTagsRequest>;
export interface AddTagsResponse {}
export const AddTagsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddTagsResponse",
}) as any as S.Schema<AddTagsResponse>;
export interface CancelQueryResponse {
  QueryId: string;
  QueryStatus: QueryStatus;
  EventDataStoreOwnerAccountId?: string;
}
export const CancelQueryResponse = S.suspend(() =>
  S.Struct({
    QueryId: S.String,
    QueryStatus: QueryStatus,
    EventDataStoreOwnerAccountId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CancelQueryResponse",
}) as any as S.Schema<CancelQueryResponse>;
export interface CreateChannelRequest {
  Name: string;
  Source: string;
  Destinations: Destination[];
  Tags?: Tag[];
}
export const CreateChannelRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Source: S.String,
    Destinations: Destinations,
    Tags: S.optional(TagsList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelRequest",
}) as any as S.Schema<CreateChannelRequest>;
export interface CreateTrailResponse {
  Name?: string;
  S3BucketName?: string;
  S3KeyPrefix?: string;
  SnsTopicName?: string;
  SnsTopicARN?: string;
  IncludeGlobalServiceEvents?: boolean;
  IsMultiRegionTrail?: boolean;
  TrailARN?: string;
  LogFileValidationEnabled?: boolean;
  CloudWatchLogsLogGroupArn?: string;
  CloudWatchLogsRoleArn?: string;
  KmsKeyId?: string;
  IsOrganizationTrail?: boolean;
}
export const CreateTrailResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    SnsTopicName: S.optional(S.String),
    SnsTopicARN: S.optional(S.String),
    IncludeGlobalServiceEvents: S.optional(S.Boolean),
    IsMultiRegionTrail: S.optional(S.Boolean),
    TrailARN: S.optional(S.String),
    LogFileValidationEnabled: S.optional(S.Boolean),
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    CloudWatchLogsRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    IsOrganizationTrail: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "CreateTrailResponse",
}) as any as S.Schema<CreateTrailResponse>;
export interface DisableFederationResponse {
  EventDataStoreArn?: string;
  FederationStatus?: FederationStatus;
}
export const DisableFederationResponse = S.suspend(() =>
  S.Struct({
    EventDataStoreArn: S.optional(S.String),
    FederationStatus: S.optional(FederationStatus),
  }).pipe(ns),
).annotations({
  identifier: "DisableFederationResponse",
}) as any as S.Schema<DisableFederationResponse>;
export interface EnableFederationResponse {
  EventDataStoreArn?: string;
  FederationStatus?: FederationStatus;
  FederationRoleArn?: string;
}
export const EnableFederationResponse = S.suspend(() =>
  S.Struct({
    EventDataStoreArn: S.optional(S.String),
    FederationStatus: S.optional(FederationStatus),
    FederationRoleArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "EnableFederationResponse",
}) as any as S.Schema<EnableFederationResponse>;
export interface GenerateQueryResponse {
  QueryStatement?: string;
  QueryAlias?: string;
  EventDataStoreOwnerAccountId?: string;
}
export const GenerateQueryResponse = S.suspend(() =>
  S.Struct({
    QueryStatement: S.optional(S.String),
    QueryAlias: S.optional(S.String),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GenerateQueryResponse",
}) as any as S.Schema<GenerateQueryResponse>;
export interface GetEventConfigurationResponse {
  TrailARN?: string;
  EventDataStoreArn?: string;
  MaxEventSize?: MaxEventSize;
  ContextKeySelectors?: ContextKeySelector[];
  AggregationConfigurations?: AggregationConfiguration[];
}
export const GetEventConfigurationResponse = S.suspend(() =>
  S.Struct({
    TrailARN: S.optional(S.String),
    EventDataStoreArn: S.optional(S.String),
    MaxEventSize: S.optional(MaxEventSize),
    ContextKeySelectors: S.optional(ContextKeySelectors),
    AggregationConfigurations: S.optional(AggregationConfigurations),
  }).pipe(ns),
).annotations({
  identifier: "GetEventConfigurationResponse",
}) as any as S.Schema<GetEventConfigurationResponse>;
export interface DataResource {
  Type?: string;
  Values?: string[];
}
export const DataResource = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Values: S.optional(DataResourceValues),
  }),
).annotations({ identifier: "DataResource" }) as any as S.Schema<DataResource>;
export type DataResources = DataResource[];
export const DataResources = S.Array(DataResource);
export interface EventSelector {
  ReadWriteType?: ReadWriteType;
  IncludeManagementEvents?: boolean;
  DataResources?: DataResource[];
  ExcludeManagementEventSources?: string[];
}
export const EventSelector = S.suspend(() =>
  S.Struct({
    ReadWriteType: S.optional(ReadWriteType),
    IncludeManagementEvents: S.optional(S.Boolean),
    DataResources: S.optional(DataResources),
    ExcludeManagementEventSources: S.optional(ExcludeManagementEventSources),
  }),
).annotations({
  identifier: "EventSelector",
}) as any as S.Schema<EventSelector>;
export type EventSelectors = EventSelector[];
export const EventSelectors = S.Array(EventSelector);
export interface GetEventSelectorsResponse {
  TrailARN?: string;
  EventSelectors?: EventSelector[];
  AdvancedEventSelectors?: AdvancedEventSelector[];
}
export const GetEventSelectorsResponse = S.suspend(() =>
  S.Struct({
    TrailARN: S.optional(S.String),
    EventSelectors: S.optional(EventSelectors),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
  }).pipe(ns),
).annotations({
  identifier: "GetEventSelectorsResponse",
}) as any as S.Schema<GetEventSelectorsResponse>;
export interface GetInsightSelectorsResponse {
  TrailARN?: string;
  InsightSelectors?: InsightSelector[];
  EventDataStoreArn?: string;
  InsightsDestination?: string;
}
export const GetInsightSelectorsResponse = S.suspend(() =>
  S.Struct({
    TrailARN: S.optional(S.String),
    InsightSelectors: S.optional(InsightSelectors),
    EventDataStoreArn: S.optional(S.String),
    InsightsDestination: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetInsightSelectorsResponse",
}) as any as S.Schema<GetInsightSelectorsResponse>;
export interface GetResourcePolicyResponse {
  ResourceArn?: string;
  ResourcePolicy?: string;
  DelegatedAdminResourcePolicy?: string;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ResourcePolicy: S.optional(S.String),
    DelegatedAdminResourcePolicy: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface Trail {
  Name?: string;
  S3BucketName?: string;
  S3KeyPrefix?: string;
  SnsTopicName?: string;
  SnsTopicARN?: string;
  IncludeGlobalServiceEvents?: boolean;
  IsMultiRegionTrail?: boolean;
  HomeRegion?: string;
  TrailARN?: string;
  LogFileValidationEnabled?: boolean;
  CloudWatchLogsLogGroupArn?: string;
  CloudWatchLogsRoleArn?: string;
  KmsKeyId?: string;
  HasCustomEventSelectors?: boolean;
  HasInsightSelectors?: boolean;
  IsOrganizationTrail?: boolean;
}
export const Trail = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    SnsTopicName: S.optional(S.String),
    SnsTopicARN: S.optional(S.String),
    IncludeGlobalServiceEvents: S.optional(S.Boolean),
    IsMultiRegionTrail: S.optional(S.Boolean),
    HomeRegion: S.optional(S.String),
    TrailARN: S.optional(S.String),
    LogFileValidationEnabled: S.optional(S.Boolean),
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    CloudWatchLogsRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    HasCustomEventSelectors: S.optional(S.Boolean),
    HasInsightSelectors: S.optional(S.Boolean),
    IsOrganizationTrail: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Trail" }) as any as S.Schema<Trail>;
export interface GetTrailResponse {
  Trail?: Trail;
}
export const GetTrailResponse = S.suspend(() =>
  S.Struct({ Trail: S.optional(Trail) }).pipe(ns),
).annotations({
  identifier: "GetTrailResponse",
}) as any as S.Schema<GetTrailResponse>;
export interface GetTrailStatusResponse {
  IsLogging?: boolean;
  LatestDeliveryError?: string;
  LatestNotificationError?: string;
  LatestDeliveryTime?: Date;
  LatestNotificationTime?: Date;
  StartLoggingTime?: Date;
  StopLoggingTime?: Date;
  LatestCloudWatchLogsDeliveryError?: string;
  LatestCloudWatchLogsDeliveryTime?: Date;
  LatestDigestDeliveryTime?: Date;
  LatestDigestDeliveryError?: string;
  LatestDeliveryAttemptTime?: string;
  LatestNotificationAttemptTime?: string;
  LatestNotificationAttemptSucceeded?: string;
  LatestDeliveryAttemptSucceeded?: string;
  TimeLoggingStarted?: string;
  TimeLoggingStopped?: string;
}
export const GetTrailStatusResponse = S.suspend(() =>
  S.Struct({
    IsLogging: S.optional(S.Boolean),
    LatestDeliveryError: S.optional(S.String),
    LatestNotificationError: S.optional(S.String),
    LatestDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestNotificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StartLoggingTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StopLoggingTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestCloudWatchLogsDeliveryError: S.optional(S.String),
    LatestCloudWatchLogsDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestDigestDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestDigestDeliveryError: S.optional(S.String),
    LatestDeliveryAttemptTime: S.optional(S.String),
    LatestNotificationAttemptTime: S.optional(S.String),
    LatestNotificationAttemptSucceeded: S.optional(S.String),
    LatestDeliveryAttemptSucceeded: S.optional(S.String),
    TimeLoggingStarted: S.optional(S.String),
    TimeLoggingStopped: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetTrailStatusResponse",
}) as any as S.Schema<GetTrailStatusResponse>;
export interface ListInsightsDataRequest {
  InsightSource: string;
  DataType: ListInsightsDataType;
  Dimensions?: { [key: string]: string | undefined };
  StartTime?: Date;
  EndTime?: Date;
  MaxResults?: number;
  NextToken?: string;
}
export const ListInsightsDataRequest = S.suspend(() =>
  S.Struct({
    InsightSource: S.String,
    DataType: ListInsightsDataType,
    Dimensions: S.optional(ListInsightsDataDimensions),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInsightsDataRequest",
}) as any as S.Schema<ListInsightsDataRequest>;
export interface ListInsightsMetricDataResponse {
  TrailARN?: string;
  EventSource?: string;
  EventName?: string;
  InsightType?: InsightType;
  ErrorCode?: string;
  Timestamps?: Date[];
  Values?: number[];
  NextToken?: string;
}
export const ListInsightsMetricDataResponse = S.suspend(() =>
  S.Struct({
    TrailARN: S.optional(S.String),
    EventSource: S.optional(S.String),
    EventName: S.optional(S.String),
    InsightType: S.optional(InsightType),
    ErrorCode: S.optional(S.String),
    Timestamps: S.optional(Timestamps),
    Values: S.optional(InsightsMetricValues),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInsightsMetricDataResponse",
}) as any as S.Schema<ListInsightsMetricDataResponse>;
export interface LookupEventsRequest {
  LookupAttributes?: LookupAttribute[];
  StartTime?: Date;
  EndTime?: Date;
  EventCategory?: EventCategory;
  MaxResults?: number;
  NextToken?: string;
}
export const LookupEventsRequest = S.suspend(() =>
  S.Struct({
    LookupAttributes: S.optional(LookupAttributesList),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventCategory: S.optional(EventCategory),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "LookupEventsRequest",
}) as any as S.Schema<LookupEventsRequest>;
export interface PutEventConfigurationRequest {
  TrailName?: string;
  EventDataStore?: string;
  MaxEventSize?: MaxEventSize;
  ContextKeySelectors?: ContextKeySelector[];
  AggregationConfigurations?: AggregationConfiguration[];
}
export const PutEventConfigurationRequest = S.suspend(() =>
  S.Struct({
    TrailName: S.optional(S.String),
    EventDataStore: S.optional(S.String),
    MaxEventSize: S.optional(MaxEventSize),
    ContextKeySelectors: S.optional(ContextKeySelectors),
    AggregationConfigurations: S.optional(AggregationConfigurations),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEventConfigurationRequest",
}) as any as S.Schema<PutEventConfigurationRequest>;
export interface PutInsightSelectorsRequest {
  TrailName?: string;
  InsightSelectors: InsightSelector[];
  EventDataStore?: string;
  InsightsDestination?: string;
}
export const PutInsightSelectorsRequest = S.suspend(() =>
  S.Struct({
    TrailName: S.optional(S.String),
    InsightSelectors: InsightSelectors,
    EventDataStore: S.optional(S.String),
    InsightsDestination: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutInsightSelectorsRequest",
}) as any as S.Schema<PutInsightSelectorsRequest>;
export interface PutResourcePolicyResponse {
  ResourceArn?: string;
  ResourcePolicy?: string;
  DelegatedAdminResourcePolicy?: string;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ResourcePolicy: S.optional(S.String),
    DelegatedAdminResourcePolicy: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface RestoreEventDataStoreResponse {
  EventDataStoreArn?: string;
  Name?: string;
  Status?: EventDataStoreStatus;
  AdvancedEventSelectors?: AdvancedEventSelector[];
  MultiRegionEnabled?: boolean;
  OrganizationEnabled?: boolean;
  RetentionPeriod?: number;
  TerminationProtectionEnabled?: boolean;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  KmsKeyId?: string;
  BillingMode?: BillingMode;
}
export const RestoreEventDataStoreResponse = S.suspend(() =>
  S.Struct({
    EventDataStoreArn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(EventDataStoreStatus),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KmsKeyId: S.optional(S.String),
    BillingMode: S.optional(BillingMode),
  }).pipe(ns),
).annotations({
  identifier: "RestoreEventDataStoreResponse",
}) as any as S.Schema<RestoreEventDataStoreResponse>;
export interface StartDashboardRefreshRequest {
  DashboardId: string;
  QueryParameterValues?: { [key: string]: string | undefined };
}
export const StartDashboardRefreshRequest = S.suspend(() =>
  S.Struct({
    DashboardId: S.String,
    QueryParameterValues: S.optional(QueryParameterValues),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDashboardRefreshRequest",
}) as any as S.Schema<StartDashboardRefreshRequest>;
export interface StartQueryResponse {
  QueryId?: string;
  EventDataStoreOwnerAccountId?: string;
}
export const StartQueryResponse = S.suspend(() =>
  S.Struct({
    QueryId: S.optional(S.String),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "StartQueryResponse",
}) as any as S.Schema<StartQueryResponse>;
export interface S3ImportSource {
  S3LocationUri: string;
  S3BucketRegion: string;
  S3BucketAccessRoleArn: string;
}
export const S3ImportSource = S.suspend(() =>
  S.Struct({
    S3LocationUri: S.String,
    S3BucketRegion: S.String,
    S3BucketAccessRoleArn: S.String,
  }),
).annotations({
  identifier: "S3ImportSource",
}) as any as S.Schema<S3ImportSource>;
export interface ImportSource {
  S3: S3ImportSource;
}
export const ImportSource = S.suspend(() =>
  S.Struct({ S3: S3ImportSource }),
).annotations({ identifier: "ImportSource" }) as any as S.Schema<ImportSource>;
export interface ImportStatistics {
  PrefixesFound?: number;
  PrefixesCompleted?: number;
  FilesCompleted?: number;
  EventsCompleted?: number;
  FailedEntries?: number;
}
export const ImportStatistics = S.suspend(() =>
  S.Struct({
    PrefixesFound: S.optional(S.Number),
    PrefixesCompleted: S.optional(S.Number),
    FilesCompleted: S.optional(S.Number),
    EventsCompleted: S.optional(S.Number),
    FailedEntries: S.optional(S.Number),
  }),
).annotations({
  identifier: "ImportStatistics",
}) as any as S.Schema<ImportStatistics>;
export interface StopImportResponse {
  ImportId?: string;
  ImportSource?: ImportSource;
  Destinations?: string[];
  ImportStatus?: ImportStatus;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  StartEventTime?: Date;
  EndEventTime?: Date;
  ImportStatistics?: ImportStatistics;
}
export const StopImportResponse = S.suspend(() =>
  S.Struct({
    ImportId: S.optional(S.String),
    ImportSource: S.optional(ImportSource),
    Destinations: S.optional(ImportDestinations),
    ImportStatus: S.optional(ImportStatus),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StartEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ImportStatistics: S.optional(ImportStatistics),
  }).pipe(ns),
).annotations({
  identifier: "StopImportResponse",
}) as any as S.Schema<StopImportResponse>;
export interface UpdateChannelResponse {
  ChannelArn?: string;
  Name?: string;
  Source?: string;
  Destinations?: Destination[];
}
export const UpdateChannelResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    Name: S.optional(S.String),
    Source: S.optional(S.String),
    Destinations: S.optional(Destinations),
  }).pipe(ns),
).annotations({
  identifier: "UpdateChannelResponse",
}) as any as S.Schema<UpdateChannelResponse>;
export interface Widget {
  QueryAlias?: string;
  QueryStatement?: string;
  QueryParameters?: string[];
  ViewProperties?: { [key: string]: string | undefined };
}
export const Widget = S.suspend(() =>
  S.Struct({
    QueryAlias: S.optional(S.String),
    QueryStatement: S.optional(S.String),
    QueryParameters: S.optional(QueryParameters),
    ViewProperties: S.optional(ViewPropertiesMap),
  }),
).annotations({ identifier: "Widget" }) as any as S.Schema<Widget>;
export type WidgetList = Widget[];
export const WidgetList = S.Array(Widget);
export interface UpdateDashboardResponse {
  DashboardArn?: string;
  Name?: string;
  Type?: DashboardType;
  Widgets?: Widget[];
  RefreshSchedule?: RefreshSchedule;
  TerminationProtectionEnabled?: boolean;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
}
export const UpdateDashboardResponse = S.suspend(() =>
  S.Struct({
    DashboardArn: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(DashboardType),
    Widgets: S.optional(WidgetList),
    RefreshSchedule: S.optional(RefreshSchedule),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "UpdateDashboardResponse",
}) as any as S.Schema<UpdateDashboardResponse>;
export interface UpdateEventDataStoreResponse {
  EventDataStoreArn?: string;
  Name?: string;
  Status?: EventDataStoreStatus;
  AdvancedEventSelectors?: AdvancedEventSelector[];
  MultiRegionEnabled?: boolean;
  OrganizationEnabled?: boolean;
  RetentionPeriod?: number;
  TerminationProtectionEnabled?: boolean;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  KmsKeyId?: string;
  BillingMode?: BillingMode;
  FederationStatus?: FederationStatus;
  FederationRoleArn?: string;
}
export const UpdateEventDataStoreResponse = S.suspend(() =>
  S.Struct({
    EventDataStoreArn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(EventDataStoreStatus),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KmsKeyId: S.optional(S.String),
    BillingMode: S.optional(BillingMode),
    FederationStatus: S.optional(FederationStatus),
    FederationRoleArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateEventDataStoreResponse",
}) as any as S.Schema<UpdateEventDataStoreResponse>;
export interface UpdateTrailResponse {
  Name?: string;
  S3BucketName?: string;
  S3KeyPrefix?: string;
  SnsTopicName?: string;
  SnsTopicARN?: string;
  IncludeGlobalServiceEvents?: boolean;
  IsMultiRegionTrail?: boolean;
  TrailARN?: string;
  LogFileValidationEnabled?: boolean;
  CloudWatchLogsLogGroupArn?: string;
  CloudWatchLogsRoleArn?: string;
  KmsKeyId?: string;
  IsOrganizationTrail?: boolean;
}
export const UpdateTrailResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    SnsTopicName: S.optional(S.String),
    SnsTopicARN: S.optional(S.String),
    IncludeGlobalServiceEvents: S.optional(S.Boolean),
    IsMultiRegionTrail: S.optional(S.Boolean),
    TrailARN: S.optional(S.String),
    LogFileValidationEnabled: S.optional(S.Boolean),
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    CloudWatchLogsRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    IsOrganizationTrail: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "UpdateTrailResponse",
}) as any as S.Schema<UpdateTrailResponse>;
export type ImportFailureStatus =
  | "FAILED"
  | "RETRY"
  | "SUCCEEDED"
  | (string & {});
export const ImportFailureStatus = S.String;
export interface QueryStatisticsForDescribeQuery {
  EventsMatched?: number;
  EventsScanned?: number;
  BytesScanned?: number;
  ExecutionTimeInMillis?: number;
  CreationTime?: Date;
}
export const QueryStatisticsForDescribeQuery = S.suspend(() =>
  S.Struct({
    EventsMatched: S.optional(S.Number),
    EventsScanned: S.optional(S.Number),
    BytesScanned: S.optional(S.Number),
    ExecutionTimeInMillis: S.optional(S.Number),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "QueryStatisticsForDescribeQuery",
}) as any as S.Schema<QueryStatisticsForDescribeQuery>;
export type TrailList = Trail[];
export const TrailList = S.Array(Trail);
export interface SourceConfig {
  ApplyToAllRegions?: boolean;
  AdvancedEventSelectors?: AdvancedEventSelector[];
}
export const SourceConfig = S.suspend(() =>
  S.Struct({
    ApplyToAllRegions: S.optional(S.Boolean),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
  }),
).annotations({ identifier: "SourceConfig" }) as any as S.Schema<SourceConfig>;
export interface IngestionStatus {
  LatestIngestionSuccessTime?: Date;
  LatestIngestionSuccessEventID?: string;
  LatestIngestionErrorCode?: string;
  LatestIngestionAttemptTime?: Date;
  LatestIngestionAttemptEventID?: string;
}
export const IngestionStatus = S.suspend(() =>
  S.Struct({
    LatestIngestionSuccessTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestIngestionSuccessEventID: S.optional(S.String),
    LatestIngestionErrorCode: S.optional(S.String),
    LatestIngestionAttemptTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestIngestionAttemptEventID: S.optional(S.String),
  }),
).annotations({
  identifier: "IngestionStatus",
}) as any as S.Schema<IngestionStatus>;
export interface PartitionKey {
  Name: string;
  Type: string;
}
export const PartitionKey = S.suspend(() =>
  S.Struct({ Name: S.String, Type: S.String }),
).annotations({ identifier: "PartitionKey" }) as any as S.Schema<PartitionKey>;
export type PartitionKeyList = PartitionKey[];
export const PartitionKeyList = S.Array(PartitionKey);
export interface QueryStatistics {
  ResultsCount?: number;
  TotalResultsCount?: number;
  BytesScanned?: number;
}
export const QueryStatistics = S.suspend(() =>
  S.Struct({
    ResultsCount: S.optional(S.Number),
    TotalResultsCount: S.optional(S.Number),
    BytesScanned: S.optional(S.Number),
  }),
).annotations({
  identifier: "QueryStatistics",
}) as any as S.Schema<QueryStatistics>;
export type QueryResultColumn = { [key: string]: string | undefined };
export const QueryResultColumn = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type QueryResultRow = { [key: string]: string | undefined }[];
export const QueryResultRow = S.Array(QueryResultColumn);
export type QueryResultRows = { [key: string]: string | undefined }[][];
export const QueryResultRows = S.Array(QueryResultRow);
export interface Channel {
  ChannelArn?: string;
  Name?: string;
}
export const Channel = S.suspend(() =>
  S.Struct({ ChannelArn: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({ identifier: "Channel" }) as any as S.Schema<Channel>;
export type Channels = Channel[];
export const Channels = S.Array(Channel);
export interface DashboardDetail {
  DashboardArn?: string;
  Type?: DashboardType;
}
export const DashboardDetail = S.suspend(() =>
  S.Struct({
    DashboardArn: S.optional(S.String),
    Type: S.optional(DashboardType),
  }),
).annotations({
  identifier: "DashboardDetail",
}) as any as S.Schema<DashboardDetail>;
export type Dashboards = DashboardDetail[];
export const Dashboards = S.Array(DashboardDetail);
export interface EventDataStore {
  EventDataStoreArn?: string;
  Name?: string;
  TerminationProtectionEnabled?: boolean;
  Status?: EventDataStoreStatus;
  AdvancedEventSelectors?: AdvancedEventSelector[];
  MultiRegionEnabled?: boolean;
  OrganizationEnabled?: boolean;
  RetentionPeriod?: number;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
}
export const EventDataStore = S.suspend(() =>
  S.Struct({
    EventDataStoreArn: S.optional(S.String),
    Name: S.optional(S.String),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    Status: S.optional(EventDataStoreStatus),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "EventDataStore",
}) as any as S.Schema<EventDataStore>;
export type EventDataStores = EventDataStore[];
export const EventDataStores = S.Array(EventDataStore);
export interface ImportFailureListItem {
  Location?: string;
  Status?: ImportFailureStatus;
  ErrorType?: string;
  ErrorMessage?: string;
  LastUpdatedTime?: Date;
}
export const ImportFailureListItem = S.suspend(() =>
  S.Struct({
    Location: S.optional(S.String),
    Status: S.optional(ImportFailureStatus),
    ErrorType: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ImportFailureListItem",
}) as any as S.Schema<ImportFailureListItem>;
export type ImportFailureList = ImportFailureListItem[];
export const ImportFailureList = S.Array(ImportFailureListItem);
export interface ImportsListItem {
  ImportId?: string;
  ImportStatus?: ImportStatus;
  Destinations?: string[];
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
}
export const ImportsListItem = S.suspend(() =>
  S.Struct({
    ImportId: S.optional(S.String),
    ImportStatus: S.optional(ImportStatus),
    Destinations: S.optional(ImportDestinations),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ImportsListItem",
}) as any as S.Schema<ImportsListItem>;
export type ImportsList = ImportsListItem[];
export const ImportsList = S.Array(ImportsListItem);
export interface PublicKey {
  Value?: Uint8Array;
  ValidityStartTime?: Date;
  ValidityEndTime?: Date;
  Fingerprint?: string;
}
export const PublicKey = S.suspend(() =>
  S.Struct({
    Value: S.optional(T.Blob),
    ValidityStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ValidityEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Fingerprint: S.optional(S.String),
  }),
).annotations({ identifier: "PublicKey" }) as any as S.Schema<PublicKey>;
export type PublicKeyList = PublicKey[];
export const PublicKeyList = S.Array(PublicKey);
export interface Query {
  QueryId?: string;
  QueryStatus?: QueryStatus;
  CreationTime?: Date;
}
export const Query = S.suspend(() =>
  S.Struct({
    QueryId: S.optional(S.String),
    QueryStatus: S.optional(QueryStatus),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Query" }) as any as S.Schema<Query>;
export type Queries = Query[];
export const Queries = S.Array(Query);
export interface ResourceTag {
  ResourceId?: string;
  TagsList?: Tag[];
}
export const ResourceTag = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String),
    TagsList: S.optional(TagsList),
  }),
).annotations({ identifier: "ResourceTag" }) as any as S.Schema<ResourceTag>;
export type ResourceTagList = ResourceTag[];
export const ResourceTagList = S.Array(ResourceTag);
export interface TrailInfo {
  TrailARN?: string;
  Name?: string;
  HomeRegion?: string;
}
export const TrailInfo = S.suspend(() =>
  S.Struct({
    TrailARN: S.optional(S.String),
    Name: S.optional(S.String),
    HomeRegion: S.optional(S.String),
  }),
).annotations({ identifier: "TrailInfo" }) as any as S.Schema<TrailInfo>;
export type Trails = TrailInfo[];
export const Trails = S.Array(TrailInfo);
export interface SearchSampleQueriesSearchResult {
  Name?: string;
  Description?: string;
  SQL?: string;
  Relevance?: number;
}
export const SearchSampleQueriesSearchResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    SQL: S.optional(S.String),
    Relevance: S.optional(S.Number),
  }),
).annotations({
  identifier: "SearchSampleQueriesSearchResult",
}) as any as S.Schema<SearchSampleQueriesSearchResult>;
export type SearchSampleQueriesSearchResults =
  SearchSampleQueriesSearchResult[];
export const SearchSampleQueriesSearchResults = S.Array(
  SearchSampleQueriesSearchResult,
);
export interface CreateChannelResponse {
  ChannelArn?: string;
  Name?: string;
  Source?: string;
  Destinations?: Destination[];
  Tags?: Tag[];
}
export const CreateChannelResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    Name: S.optional(S.String),
    Source: S.optional(S.String),
    Destinations: S.optional(Destinations),
    Tags: S.optional(TagsList),
  }).pipe(ns),
).annotations({
  identifier: "CreateChannelResponse",
}) as any as S.Schema<CreateChannelResponse>;
export interface CreateDashboardRequest {
  Name: string;
  RefreshSchedule?: RefreshSchedule;
  TagsList?: Tag[];
  TerminationProtectionEnabled?: boolean;
  Widgets?: RequestWidget[];
}
export const CreateDashboardRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    RefreshSchedule: S.optional(RefreshSchedule),
    TagsList: S.optional(TagsList),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    Widgets: S.optional(RequestWidgetList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDashboardRequest",
}) as any as S.Schema<CreateDashboardRequest>;
export interface CreateEventDataStoreRequest {
  Name: string;
  AdvancedEventSelectors?: AdvancedEventSelector[];
  MultiRegionEnabled?: boolean;
  OrganizationEnabled?: boolean;
  RetentionPeriod?: number;
  TerminationProtectionEnabled?: boolean;
  TagsList?: Tag[];
  KmsKeyId?: string;
  StartIngestion?: boolean;
  BillingMode?: BillingMode;
}
export const CreateEventDataStoreRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    TagsList: S.optional(TagsList),
    KmsKeyId: S.optional(S.String),
    StartIngestion: S.optional(S.Boolean),
    BillingMode: S.optional(BillingMode),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEventDataStoreRequest",
}) as any as S.Schema<CreateEventDataStoreRequest>;
export interface DescribeQueryResponse {
  QueryId?: string;
  QueryString?: string;
  QueryStatus?: QueryStatus;
  QueryStatistics?: QueryStatisticsForDescribeQuery;
  ErrorMessage?: string;
  DeliveryS3Uri?: string;
  DeliveryStatus?: DeliveryStatus;
  Prompt?: string;
  EventDataStoreOwnerAccountId?: string;
}
export const DescribeQueryResponse = S.suspend(() =>
  S.Struct({
    QueryId: S.optional(S.String),
    QueryString: S.optional(S.String),
    QueryStatus: S.optional(QueryStatus),
    QueryStatistics: S.optional(QueryStatisticsForDescribeQuery),
    ErrorMessage: S.optional(S.String),
    DeliveryS3Uri: S.optional(S.String),
    DeliveryStatus: S.optional(DeliveryStatus),
    Prompt: S.optional(S.String),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeQueryResponse",
}) as any as S.Schema<DescribeQueryResponse>;
export interface DescribeTrailsResponse {
  trailList?: Trail[];
}
export const DescribeTrailsResponse = S.suspend(() =>
  S.Struct({ trailList: S.optional(TrailList) }).pipe(ns),
).annotations({
  identifier: "DescribeTrailsResponse",
}) as any as S.Schema<DescribeTrailsResponse>;
export interface GetChannelResponse {
  ChannelArn?: string;
  Name?: string;
  Source?: string;
  SourceConfig?: SourceConfig;
  Destinations?: Destination[];
  IngestionStatus?: IngestionStatus;
}
export const GetChannelResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    Name: S.optional(S.String),
    Source: S.optional(S.String),
    SourceConfig: S.optional(SourceConfig),
    Destinations: S.optional(Destinations),
    IngestionStatus: S.optional(IngestionStatus),
  }).pipe(ns),
).annotations({
  identifier: "GetChannelResponse",
}) as any as S.Schema<GetChannelResponse>;
export interface GetDashboardResponse {
  DashboardArn?: string;
  Type?: DashboardType;
  Status?: DashboardStatus;
  Widgets?: Widget[];
  RefreshSchedule?: RefreshSchedule;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  LastRefreshId?: string;
  LastRefreshFailureReason?: string;
  TerminationProtectionEnabled?: boolean;
}
export const GetDashboardResponse = S.suspend(() =>
  S.Struct({
    DashboardArn: S.optional(S.String),
    Type: S.optional(DashboardType),
    Status: S.optional(DashboardStatus),
    Widgets: S.optional(WidgetList),
    RefreshSchedule: S.optional(RefreshSchedule),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastRefreshId: S.optional(S.String),
    LastRefreshFailureReason: S.optional(S.String),
    TerminationProtectionEnabled: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "GetDashboardResponse",
}) as any as S.Schema<GetDashboardResponse>;
export interface GetEventDataStoreResponse {
  EventDataStoreArn?: string;
  Name?: string;
  Status?: EventDataStoreStatus;
  AdvancedEventSelectors?: AdvancedEventSelector[];
  MultiRegionEnabled?: boolean;
  OrganizationEnabled?: boolean;
  RetentionPeriod?: number;
  TerminationProtectionEnabled?: boolean;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  KmsKeyId?: string;
  BillingMode?: BillingMode;
  FederationStatus?: FederationStatus;
  FederationRoleArn?: string;
  PartitionKeys?: PartitionKey[];
}
export const GetEventDataStoreResponse = S.suspend(() =>
  S.Struct({
    EventDataStoreArn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(EventDataStoreStatus),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KmsKeyId: S.optional(S.String),
    BillingMode: S.optional(BillingMode),
    FederationStatus: S.optional(FederationStatus),
    FederationRoleArn: S.optional(S.String),
    PartitionKeys: S.optional(PartitionKeyList),
  }).pipe(ns),
).annotations({
  identifier: "GetEventDataStoreResponse",
}) as any as S.Schema<GetEventDataStoreResponse>;
export interface GetImportResponse {
  ImportId?: string;
  Destinations?: string[];
  ImportSource?: ImportSource;
  StartEventTime?: Date;
  EndEventTime?: Date;
  ImportStatus?: ImportStatus;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  ImportStatistics?: ImportStatistics;
}
export const GetImportResponse = S.suspend(() =>
  S.Struct({
    ImportId: S.optional(S.String),
    Destinations: S.optional(ImportDestinations),
    ImportSource: S.optional(ImportSource),
    StartEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ImportStatus: S.optional(ImportStatus),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ImportStatistics: S.optional(ImportStatistics),
  }).pipe(ns),
).annotations({
  identifier: "GetImportResponse",
}) as any as S.Schema<GetImportResponse>;
export interface GetQueryResultsResponse {
  QueryStatus?: QueryStatus;
  QueryStatistics?: QueryStatistics;
  QueryResultRows?: { [key: string]: string | undefined }[][];
  NextToken?: string;
  ErrorMessage?: string;
}
export const GetQueryResultsResponse = S.suspend(() =>
  S.Struct({
    QueryStatus: S.optional(QueryStatus),
    QueryStatistics: S.optional(QueryStatistics),
    QueryResultRows: S.optional(QueryResultRows),
    NextToken: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetQueryResultsResponse",
}) as any as S.Schema<GetQueryResultsResponse>;
export interface ListChannelsResponse {
  Channels?: Channel[];
  NextToken?: string;
}
export const ListChannelsResponse = S.suspend(() =>
  S.Struct({
    Channels: S.optional(Channels),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListChannelsResponse",
}) as any as S.Schema<ListChannelsResponse>;
export interface ListDashboardsResponse {
  Dashboards?: DashboardDetail[];
  NextToken?: string;
}
export const ListDashboardsResponse = S.suspend(() =>
  S.Struct({
    Dashboards: S.optional(Dashboards),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDashboardsResponse",
}) as any as S.Schema<ListDashboardsResponse>;
export interface ListEventDataStoresResponse {
  EventDataStores?: EventDataStore[];
  NextToken?: string;
}
export const ListEventDataStoresResponse = S.suspend(() =>
  S.Struct({
    EventDataStores: S.optional(EventDataStores),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListEventDataStoresResponse",
}) as any as S.Schema<ListEventDataStoresResponse>;
export interface ListImportFailuresResponse {
  Failures?: ImportFailureListItem[];
  NextToken?: string;
}
export const ListImportFailuresResponse = S.suspend(() =>
  S.Struct({
    Failures: S.optional(ImportFailureList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListImportFailuresResponse",
}) as any as S.Schema<ListImportFailuresResponse>;
export interface ListImportsResponse {
  Imports?: ImportsListItem[];
  NextToken?: string;
}
export const ListImportsResponse = S.suspend(() =>
  S.Struct({
    Imports: S.optional(ImportsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListImportsResponse",
}) as any as S.Schema<ListImportsResponse>;
export interface ListPublicKeysResponse {
  PublicKeyList?: PublicKey[];
  NextToken?: string;
}
export const ListPublicKeysResponse = S.suspend(() =>
  S.Struct({
    PublicKeyList: S.optional(PublicKeyList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPublicKeysResponse",
}) as any as S.Schema<ListPublicKeysResponse>;
export interface ListQueriesResponse {
  Queries?: Query[];
  NextToken?: string;
}
export const ListQueriesResponse = S.suspend(() =>
  S.Struct({
    Queries: S.optional(Queries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListQueriesResponse",
}) as any as S.Schema<ListQueriesResponse>;
export interface ListTagsResponse {
  ResourceTagList?: ResourceTag[];
  NextToken?: string;
}
export const ListTagsResponse = S.suspend(() =>
  S.Struct({
    ResourceTagList: S.optional(ResourceTagList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTagsResponse",
}) as any as S.Schema<ListTagsResponse>;
export interface ListTrailsResponse {
  Trails?: TrailInfo[];
  NextToken?: string;
}
export const ListTrailsResponse = S.suspend(() =>
  S.Struct({
    Trails: S.optional(Trails),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTrailsResponse",
}) as any as S.Schema<ListTrailsResponse>;
export interface Resource {
  ResourceType?: string;
  ResourceName?: string;
}
export const Resource = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    ResourceName: S.optional(S.String),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type ResourceList = Resource[];
export const ResourceList = S.Array(Resource);
export interface Event {
  EventId?: string;
  EventName?: string;
  ReadOnly?: string;
  AccessKeyId?: string;
  EventTime?: Date;
  EventSource?: string;
  Username?: string;
  Resources?: Resource[];
  CloudTrailEvent?: string;
}
export const Event = S.suspend(() =>
  S.Struct({
    EventId: S.optional(S.String),
    EventName: S.optional(S.String),
    ReadOnly: S.optional(S.String),
    AccessKeyId: S.optional(S.String),
    EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventSource: S.optional(S.String),
    Username: S.optional(S.String),
    Resources: S.optional(ResourceList),
    CloudTrailEvent: S.optional(S.String),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type EventsList = Event[];
export const EventsList = S.Array(Event);
export interface LookupEventsResponse {
  Events?: Event[];
  NextToken?: string;
}
export const LookupEventsResponse = S.suspend(() =>
  S.Struct({
    Events: S.optional(EventsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "LookupEventsResponse",
}) as any as S.Schema<LookupEventsResponse>;
export interface PutEventConfigurationResponse {
  TrailARN?: string;
  EventDataStoreArn?: string;
  MaxEventSize?: MaxEventSize;
  ContextKeySelectors?: ContextKeySelector[];
  AggregationConfigurations?: AggregationConfiguration[];
}
export const PutEventConfigurationResponse = S.suspend(() =>
  S.Struct({
    TrailARN: S.optional(S.String),
    EventDataStoreArn: S.optional(S.String),
    MaxEventSize: S.optional(MaxEventSize),
    ContextKeySelectors: S.optional(ContextKeySelectors),
    AggregationConfigurations: S.optional(AggregationConfigurations),
  }).pipe(ns),
).annotations({
  identifier: "PutEventConfigurationResponse",
}) as any as S.Schema<PutEventConfigurationResponse>;
export interface PutEventSelectorsRequest {
  TrailName: string;
  EventSelectors?: EventSelector[];
  AdvancedEventSelectors?: AdvancedEventSelector[];
}
export const PutEventSelectorsRequest = S.suspend(() =>
  S.Struct({
    TrailName: S.String,
    EventSelectors: S.optional(EventSelectors),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEventSelectorsRequest",
}) as any as S.Schema<PutEventSelectorsRequest>;
export interface PutInsightSelectorsResponse {
  TrailARN?: string;
  InsightSelectors?: InsightSelector[];
  EventDataStoreArn?: string;
  InsightsDestination?: string;
}
export const PutInsightSelectorsResponse = S.suspend(() =>
  S.Struct({
    TrailARN: S.optional(S.String),
    InsightSelectors: S.optional(InsightSelectors),
    EventDataStoreArn: S.optional(S.String),
    InsightsDestination: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PutInsightSelectorsResponse",
}) as any as S.Schema<PutInsightSelectorsResponse>;
export interface SearchSampleQueriesResponse {
  SearchResults?: SearchSampleQueriesSearchResult[];
  NextToken?: string;
}
export const SearchSampleQueriesResponse = S.suspend(() =>
  S.Struct({
    SearchResults: S.optional(SearchSampleQueriesSearchResults),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "SearchSampleQueriesResponse",
}) as any as S.Schema<SearchSampleQueriesResponse>;
export interface StartDashboardRefreshResponse {
  RefreshId?: string;
}
export const StartDashboardRefreshResponse = S.suspend(() =>
  S.Struct({ RefreshId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartDashboardRefreshResponse",
}) as any as S.Schema<StartDashboardRefreshResponse>;
export interface StartImportRequest {
  Destinations?: string[];
  ImportSource?: ImportSource;
  StartEventTime?: Date;
  EndEventTime?: Date;
  ImportId?: string;
}
export const StartImportRequest = S.suspend(() =>
  S.Struct({
    Destinations: S.optional(ImportDestinations),
    ImportSource: S.optional(ImportSource),
    StartEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ImportId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartImportRequest",
}) as any as S.Schema<StartImportRequest>;
export interface CreateDashboardResponse {
  DashboardArn?: string;
  Name?: string;
  Type?: DashboardType;
  Widgets?: Widget[];
  TagsList?: Tag[];
  RefreshSchedule?: RefreshSchedule;
  TerminationProtectionEnabled?: boolean;
}
export const CreateDashboardResponse = S.suspend(() =>
  S.Struct({
    DashboardArn: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(DashboardType),
    Widgets: S.optional(WidgetList),
    TagsList: S.optional(TagsList),
    RefreshSchedule: S.optional(RefreshSchedule),
    TerminationProtectionEnabled: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "CreateDashboardResponse",
}) as any as S.Schema<CreateDashboardResponse>;
export interface CreateEventDataStoreResponse {
  EventDataStoreArn?: string;
  Name?: string;
  Status?: EventDataStoreStatus;
  AdvancedEventSelectors?: AdvancedEventSelector[];
  MultiRegionEnabled?: boolean;
  OrganizationEnabled?: boolean;
  RetentionPeriod?: number;
  TerminationProtectionEnabled?: boolean;
  TagsList?: Tag[];
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  KmsKeyId?: string;
  BillingMode?: BillingMode;
}
export const CreateEventDataStoreResponse = S.suspend(() =>
  S.Struct({
    EventDataStoreArn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(EventDataStoreStatus),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    TagsList: S.optional(TagsList),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KmsKeyId: S.optional(S.String),
    BillingMode: S.optional(BillingMode),
  }).pipe(ns),
).annotations({
  identifier: "CreateEventDataStoreResponse",
}) as any as S.Schema<CreateEventDataStoreResponse>;
export interface PutEventSelectorsResponse {
  TrailARN?: string;
  EventSelectors?: EventSelector[];
  AdvancedEventSelectors?: AdvancedEventSelector[];
}
export const PutEventSelectorsResponse = S.suspend(() =>
  S.Struct({
    TrailARN: S.optional(S.String),
    EventSelectors: S.optional(EventSelectors),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
  }).pipe(ns),
).annotations({
  identifier: "PutEventSelectorsResponse",
}) as any as S.Schema<PutEventSelectorsResponse>;
export interface StartImportResponse {
  ImportId?: string;
  Destinations?: string[];
  ImportSource?: ImportSource;
  StartEventTime?: Date;
  EndEventTime?: Date;
  ImportStatus?: ImportStatus;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
}
export const StartImportResponse = S.suspend(() =>
  S.Struct({
    ImportId: S.optional(S.String),
    Destinations: S.optional(ImportDestinations),
    ImportSource: S.optional(ImportSource),
    StartEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ImportStatus: S.optional(ImportStatus),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "StartImportResponse",
}) as any as S.Schema<StartImportResponse>;
export interface ListInsightsDataResponse {
  Events?: Event[];
  NextToken?: string;
}
export const ListInsightsDataResponse = S.suspend(() =>
  S.Struct({
    Events: S.optional(EventsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInsightsDataResponse",
}) as any as S.Schema<ListInsightsDataResponse>;

//# Errors
export class ChannelARNInvalidException extends S.TaggedError<ChannelARNInvalidException>()(
  "ChannelARNInvalidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChannelARNInvalid", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConflictException", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class ChannelExistsForEDSException extends S.TaggedError<ChannelExistsForEDSException>()(
  "ChannelExistsForEDSException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChannelExistsForEDS", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CloudTrailARNInvalidException extends S.TaggedError<CloudTrailARNInvalidException>()(
  "CloudTrailARNInvalidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "CloudTrailARNInvalid", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class AccountNotFoundException extends S.TaggedError<AccountNotFoundException>()(
  "AccountNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccountNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class CloudTrailAccessNotEnabledException extends S.TaggedError<CloudTrailAccessNotEnabledException>()(
  "CloudTrailAccessNotEnabledException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CloudTrailAccessNotEnabled",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ChannelNotFoundException extends S.TaggedError<ChannelNotFoundException>()(
  "ChannelNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChannelNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EventDataStoreARNInvalidException extends S.TaggedError<EventDataStoreARNInvalidException>()(
  "EventDataStoreARNInvalidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "EventDataStoreARNInvalid", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientDependencyServiceAccessPermissionException extends S.TaggedError<InsufficientDependencyServiceAccessPermissionException>()(
  "InsufficientDependencyServiceAccessPermissionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientDependencyServiceAccessPermission",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class AccountNotRegisteredException extends S.TaggedError<AccountNotRegisteredException>()(
  "AccountNotRegisteredException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccountNotRegistered", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceAccessDenied", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class InvalidTrailNameException extends S.TaggedError<InvalidTrailNameException>()(
  "InvalidTrailNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTrailName", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsightNotEnabledException extends S.TaggedError<InsightNotEnabledException>()(
  "InsightNotEnabledException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InsightNotEnabled", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class OperationNotPermittedException extends S.TaggedError<OperationNotPermittedException>()(
  "OperationNotPermittedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "OperationNotPermitted", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidParameter", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ImportNotFoundException extends S.TaggedError<ImportNotFoundException>()(
  "ImportNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ImportNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ChannelAlreadyExistsException extends S.TaggedError<ChannelAlreadyExistsException>()(
  "ChannelAlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChannelAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EventDataStoreNotFoundException extends S.TaggedError<EventDataStoreNotFoundException>()(
  "EventDataStoreNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "EventDataStoreNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class AccountRegisteredException extends S.TaggedError<AccountRegisteredException>()(
  "AccountRegisteredException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccountRegistered", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CloudTrailInvalidClientTokenIdException extends S.TaggedError<CloudTrailInvalidClientTokenIdException>()(
  "CloudTrailInvalidClientTokenIdException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CloudTrailInvalidClientTokenId",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnsupportedOperation", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EventDataStoreFederationEnabledException extends S.TaggedError<EventDataStoreFederationEnabledException>()(
  "EventDataStoreFederationEnabledException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventDataStoreFederationEnabled",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidHomeRegionException extends S.TaggedError<InvalidHomeRegionException>()(
  "InvalidHomeRegionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidHomeRegion", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConcurrentModification", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class NoManagementAccountSLRExistsException extends S.TaggedError<NoManagementAccountSLRExistsException>()(
  "NoManagementAccountSLRExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NoManagementAccountSLRExists",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class InvalidParameterCombinationException extends S.TaggedError<InvalidParameterCombinationException>()(
  "InvalidParameterCombinationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidParameterCombinationError",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ResourceARNNotValidException extends S.TaggedError<ResourceARNNotValidException>()(
  "ResourceARNNotValidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceARNNotValid", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidNextToken", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidMaxResultsException extends S.TaggedError<InvalidMaxResultsException>()(
  "InvalidMaxResultsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidMaxResults", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidTimeRangeException extends S.TaggedError<InvalidTimeRangeException>()(
  "InvalidTimeRangeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTimeRange", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidEventCategoryException extends S.TaggedError<InvalidEventCategoryException>()(
  "InvalidEventCategoryException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidEventCategory", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientEncryptionPolicyException extends S.TaggedError<InsufficientEncryptionPolicyException>()(
  "InsufficientEncryptionPolicyException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientEncryptionPolicy",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InactiveEventDataStoreException extends S.TaggedError<InactiveEventDataStoreException>()(
  "InactiveEventDataStoreException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InactiveEventDataStore", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EventDataStoreMaxLimitExceededException extends S.TaggedError<EventDataStoreMaxLimitExceededException>()(
  "EventDataStoreMaxLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventDataStoreMaxLimitExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class EventDataStoreAlreadyExistsException extends S.TaggedError<EventDataStoreAlreadyExistsException>()(
  "EventDataStoreAlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventDataStoreAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class GenerateResponseException extends S.TaggedError<GenerateResponseException>()(
  "GenerateResponseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "GenerateResponse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidEventDataStoreCategoryException extends S.TaggedError<InvalidEventDataStoreCategoryException>()(
  "InvalidEventDataStoreCategoryException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidEventDataStoreCategory",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CannotDelegateManagementAccountException extends S.TaggedError<CannotDelegateManagementAccountException>()(
  "CannotDelegateManagementAccountException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CannotDelegateManagementAccount",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TrailNotFoundException extends S.TaggedError<TrailNotFoundException>()(
  "TrailNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TrailNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class NotOrganizationManagementAccountException extends S.TaggedError<NotOrganizationManagementAccountException>()(
  "NotOrganizationManagementAccountException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NotOrganizationManagementAccount",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class ChannelMaxLimitExceededException extends S.TaggedError<ChannelMaxLimitExceededException>()(
  "ChannelMaxLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChannelMaxLimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CloudWatchLogsDeliveryUnavailableException extends S.TaggedError<CloudWatchLogsDeliveryUnavailableException>()(
  "CloudWatchLogsDeliveryUnavailableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CloudWatchLogsDeliveryUnavailable",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class EventDataStoreHasOngoingImportException extends S.TaggedError<EventDataStoreHasOngoingImportException>()(
  "EventDataStoreHasOngoingImportException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventDataStoreHasOngoingImport",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ThrottlingException", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class ResourcePolicyNotFoundException extends S.TaggedError<ResourcePolicyNotFoundException>()(
  "ResourcePolicyNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourcePolicyNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidTokenException extends S.TaggedError<InvalidTokenException>()(
  "InvalidTokenException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidToken", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidLookupAttributesException extends S.TaggedError<InvalidLookupAttributesException>()(
  "InvalidLookupAttributesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidLookupAttributes", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidEventSelectorsException extends S.TaggedError<InvalidEventSelectorsException>()(
  "InvalidEventSelectorsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidEventSelectors", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientS3BucketPolicyException extends S.TaggedError<InsufficientS3BucketPolicyException>()(
  "InsufficientS3BucketPolicyException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientS3BucketPolicy",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class AccountHasOngoingImportException extends S.TaggedError<AccountHasOngoingImportException>()(
  "AccountHasOngoingImportException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccountHasOngoingImport", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidQueryStatementException extends S.TaggedError<InvalidQueryStatementException>()(
  "InvalidQueryStatementException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidQueryStatement", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidEventDataStoreStatusException extends S.TaggedError<InvalidEventDataStoreStatusException>()(
  "InvalidEventDataStoreStatusException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidEventDataStoreStatus",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class NotOrganizationMasterAccountException extends S.TaggedError<NotOrganizationMasterAccountException>()(
  "NotOrganizationMasterAccountException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NotOrganizationMasterAccount",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DelegatedAdminAccountLimitExceededException extends S.TaggedError<DelegatedAdminAccountLimitExceededException>()(
  "DelegatedAdminAccountLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DelegatedAdminAccountLimitExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ResourcePolicyNotValidException extends S.TaggedError<ResourcePolicyNotValidException>()(
  "ResourcePolicyNotValidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourcePolicyNotValid", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class OrganizationNotInAllFeaturesModeException extends S.TaggedError<OrganizationNotInAllFeaturesModeException>()(
  "OrganizationNotInAllFeaturesModeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OrganizationNotInAllFeaturesMode",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidSourceException extends S.TaggedError<InvalidSourceException>()(
  "InvalidSourceException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSource", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidTagParameterException extends S.TaggedError<InvalidTagParameterException>()(
  "InvalidTagParameterException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTagParameter", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InactiveQueryException extends S.TaggedError<InactiveQueryException>()(
  "InactiveQueryException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InactiveQuery", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class QueryIdNotFoundException extends S.TaggedError<QueryIdNotFoundException>()(
  "QueryIdNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "QueryIdNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidDateRangeException extends S.TaggedError<InvalidDateRangeException>()(
  "InvalidDateRangeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDateRange", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientIAMAccessPermissionException extends S.TaggedError<InsufficientIAMAccessPermissionException>()(
  "InsufficientIAMAccessPermissionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientIAMAccessPermission",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ServiceQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EventDataStoreTerminationProtectedException extends S.TaggedError<EventDataStoreTerminationProtectedException>()(
  "EventDataStoreTerminationProtectedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventDataStoreTerminationProtectedException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ResourceTypeNotSupportedException extends S.TaggedError<ResourceTypeNotSupportedException>()(
  "ResourceTypeNotSupportedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceTypeNotSupported", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidInsightSelectorsException extends S.TaggedError<InvalidInsightSelectorsException>()(
  "InvalidInsightSelectorsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidInsightSelectors", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InsufficientSnsTopicPolicyException extends S.TaggedError<InsufficientSnsTopicPolicyException>()(
  "InsufficientSnsTopicPolicyException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientSnsTopicPolicy",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class OrganizationsNotInUseException extends S.TaggedError<OrganizationsNotInUseException>()(
  "OrganizationsNotInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "OrganizationsNotInUse", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidKmsKeyIdException extends S.TaggedError<InvalidKmsKeyIdException>()(
  "InvalidKmsKeyIdException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidKmsKeyId", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidS3BucketNameException extends S.TaggedError<InvalidS3BucketNameException>()(
  "InvalidS3BucketNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidS3BucketName", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidQueryStatusException extends S.TaggedError<InvalidQueryStatusException>()(
  "InvalidQueryStatusException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidQueryStatus", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidImportSourceException extends S.TaggedError<InvalidImportSourceException>()(
  "InvalidImportSourceException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidImportSource", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TagsLimitExceededException extends S.TaggedError<TagsLimitExceededException>()(
  "TagsLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagsLimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class KmsException extends S.TaggedError<KmsException>()(
  "KmsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "KmsException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidCloudWatchLogsLogGroupArnException extends S.TaggedError<InvalidCloudWatchLogsLogGroupArnException>()(
  "InvalidCloudWatchLogsLogGroupArnException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCloudWatchLogsLogGroupArn",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidS3PrefixException extends S.TaggedError<InvalidS3PrefixException>()(
  "InvalidS3PrefixException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidS3Prefix", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class S3BucketDoesNotExistException extends S.TaggedError<S3BucketDoesNotExistException>()(
  "S3BucketDoesNotExistException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "S3BucketDoesNotExist", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidCloudWatchLogsRoleArnException extends S.TaggedError<InvalidCloudWatchLogsRoleArnException>()(
  "InvalidCloudWatchLogsRoleArnException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCloudWatchLogsRoleArn",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class MaxConcurrentQueriesException extends S.TaggedError<MaxConcurrentQueriesException>()(
  "MaxConcurrentQueriesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "MaxConcurrentQueries", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class KmsKeyNotFoundException extends S.TaggedError<KmsKeyNotFoundException>()(
  "KmsKeyNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "KmsKeyNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidSnsTopicNameException extends S.TaggedError<InvalidSnsTopicNameException>()(
  "InvalidSnsTopicNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSnsTopicName", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class KmsKeyDisabledException extends S.TaggedError<KmsKeyDisabledException>()(
  "KmsKeyDisabledException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "KmsKeyDisabled", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TrailNotProvidedException extends S.TaggedError<TrailNotProvidedException>()(
  "TrailNotProvidedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TrailNotProvided", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class MaximumNumberOfTrailsExceededException extends S.TaggedError<MaximumNumberOfTrailsExceededException>()(
  "MaximumNumberOfTrailsExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "MaximumNumberOfTrailsExceeded",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class TrailAlreadyExistsException extends S.TaggedError<TrailAlreadyExistsException>()(
  "TrailAlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TrailAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes the specified dashboard. You cannot delete a dashboard that has termination protection enabled.
 */
export const deleteDashboard: (
  input: DeleteDashboardRequest,
) => effect.Effect<
  DeleteDashboardResponse,
  | ConflictException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDashboardRequest,
  output: DeleteDashboardResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Lists the channels in the current account, and their source names.
 */
export const listChannels: {
  (
    input: ListChannelsRequest,
  ): effect.Effect<
    ListChannelsResponse,
    | InvalidNextTokenException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelsRequest,
  ) => stream.Stream<
    ListChannelsResponse,
    | InvalidNextTokenException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidNextTokenException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelsRequest,
  output: ListChannelsResponse,
  errors: [
    InvalidNextTokenException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about all event data stores in the account, in the current
 * Region.
 */
export const listEventDataStores: {
  (
    input: ListEventDataStoresRequest,
  ): effect.Effect<
    ListEventDataStoresResponse,
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventDataStoresRequest,
  ) => stream.Stream<
    ListEventDataStoresResponse,
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventDataStoresRequest,
  ) => stream.Stream<
    unknown,
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventDataStoresRequest,
  output: ListEventDataStoresResponse,
  errors: [
    InvalidMaxResultsException,
    InvalidNextTokenException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the specified dashboard.
 */
export const getDashboard: (
  input: GetDashboardRequest,
) => effect.Effect<
  GetDashboardResponse,
  ResourceNotFoundException | UnsupportedOperationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDashboardRequest,
  output: GetDashboardResponse,
  errors: [ResourceNotFoundException, UnsupportedOperationException],
}));
/**
 * Returns information about all dashboards in the account, in the current Region.
 */
export const listDashboards: (
  input: ListDashboardsRequest,
) => effect.Effect<
  ListDashboardsResponse,
  UnsupportedOperationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDashboardsRequest,
  output: ListDashboardsResponse,
  errors: [UnsupportedOperationException],
}));
/**
 * Returns Insights metrics data for trails that have enabled Insights. The request must include the `EventSource`,
 * `EventName`, and `InsightType` parameters.
 *
 * If the `InsightType` is set to `ApiErrorRateInsight`, the request must also include the `ErrorCode` parameter.
 *
 * The following are the available time periods for `ListInsightsMetricData`. Each cutoff is inclusive.
 *
 * - Data points with a period of 60 seconds (1-minute) are available for 15 days.
 *
 * - Data points with a period of 300 seconds (5-minute) are available for 63 days.
 *
 * - Data points with a period of 3600 seconds (1 hour) are available for 90 days.
 *
 * To use `ListInsightsMetricData` operation, you must have the following permissions:
 *
 * - If `ListInsightsMetricData` is invoked with `TrailName` parameter, access to the `ListInsightsMetricData` API operation is linked to the `cloudtrail:LookupEvents` action and `cloudtrail:ListInsightsData`. To use this operation,
 * you must have permissions to perform the `cloudtrail:LookupEvents` and `cloudtrail:ListInsightsData` action on the specific trail.
 *
 * - If `ListInsightsMetricData` is invoked without `TrailName` parameter, access to the `ListInsightsMetricData` API operation is linked to the `cloudtrail:LookupEvents` action only. To use this operation,
 * you must have permissions to perform the `cloudtrail:LookupEvents` action.
 */
export const listInsightsMetricData: {
  (
    input: ListInsightsMetricDataRequest,
  ): effect.Effect<
    ListInsightsMetricDataResponse,
    | InvalidParameterException
    | InvalidTrailNameException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInsightsMetricDataRequest,
  ) => stream.Stream<
    ListInsightsMetricDataResponse,
    | InvalidParameterException
    | InvalidTrailNameException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInsightsMetricDataRequest,
  ) => stream.Stream<
    unknown,
    | InvalidParameterException
    | InvalidTrailNameException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInsightsMetricDataRequest,
  output: ListInsightsMetricDataResponse,
  errors: [
    InvalidParameterException,
    InvalidTrailNameException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists trails that are in the current account.
 */
export const listTrails: {
  (
    input: ListTrailsRequest,
  ): effect.Effect<
    ListTrailsResponse,
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrailsRequest,
  ) => stream.Stream<
    ListTrailsResponse,
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrailsRequest,
  ) => stream.Stream<
    TrailInfo,
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTrailsRequest,
  output: ListTrailsResponse,
  errors: [OperationNotPermittedException, UnsupportedOperationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Trails",
  } as const,
}));
/**
 * Searches sample queries and returns a list of sample queries that are sorted by relevance.
 * To search for sample queries, provide a natural language `SearchPhrase` in English.
 */
export const searchSampleQueries: (
  input: SearchSampleQueriesRequest,
) => effect.Effect<
  SearchSampleQueriesResponse,
  | InvalidParameterException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchSampleQueriesRequest,
  output: SearchSampleQueriesResponse,
  errors: [
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Stops a specified import.
 */
export const stopImport: (
  input: StopImportRequest,
) => effect.Effect<
  StopImportResponse,
  | ImportNotFoundException
  | InvalidParameterException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopImportRequest,
  output: StopImportResponse,
  errors: [
    ImportNotFoundException,
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes a channel.
 */
export const deleteChannel: (
  input: DeleteChannelRequest,
) => effect.Effect<
  DeleteChannelResponse,
  | ChannelARNInvalidException
  | ChannelNotFoundException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelRequest,
  output: DeleteChannelResponse,
  errors: [
    ChannelARNInvalidException,
    ChannelNotFoundException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns information about a specific channel.
 */
export const getChannel: (
  input: GetChannelRequest,
) => effect.Effect<
  GetChannelResponse,
  | ChannelARNInvalidException
  | ChannelNotFoundException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelRequest,
  output: GetChannelResponse,
  errors: [
    ChannelARNInvalidException,
    ChannelNotFoundException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns information about a specific import.
 */
export const getImport: (
  input: GetImportRequest,
) => effect.Effect<
  GetImportResponse,
  | ImportNotFoundException
  | InvalidParameterException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportRequest,
  output: GetImportResponse,
  errors: [
    ImportNotFoundException,
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Generates a query from a natural language prompt. This operation uses generative artificial intelligence
 * (generative AI) to produce a ready-to-use SQL query from the prompt.
 *
 * The prompt can be a question or a statement about the event data
 * in your event data store. For example, you can enter prompts like "What are my
 * top errors in the past month?" and “Give me a list of users that used SNS.”
 *
 * The prompt must be in English. For information about limitations, permissions, and supported Regions, see
 * Create CloudTrail Lake queries from natural language prompts
 * in the *CloudTrail * user guide.
 *
 * Do not include any personally identifying, confidential, or sensitive information
 * in your prompts.
 *
 * This feature uses generative AI large language models (LLMs); we recommend double-checking the
 * LLM response.
 */
export const generateQuery: (
  input: GenerateQueryRequest,
) => effect.Effect<
  GenerateQueryResponse,
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | GenerateResponseException
  | InactiveEventDataStoreException
  | InvalidParameterException
  | NoManagementAccountSLRExistsException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateQueryRequest,
  output: GenerateQueryResponse,
  errors: [
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    GenerateResponseException,
    InactiveEventDataStoreException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns settings information for a specified trail.
 */
export const getTrail: (
  input: GetTrailRequest,
) => effect.Effect<
  GetTrailResponse,
  | CloudTrailARNInvalidException
  | InvalidTrailNameException
  | OperationNotPermittedException
  | TrailNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrailRequest,
  output: GetTrailResponse,
  errors: [
    CloudTrailARNInvalidException,
    InvalidTrailNameException,
    OperationNotPermittedException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves settings for one or more trails associated with the current Region for your
 * account.
 */
export const describeTrails: (
  input: DescribeTrailsRequest,
) => effect.Effect<
  DescribeTrailsResponse,
  | CloudTrailARNInvalidException
  | InvalidTrailNameException
  | NoManagementAccountSLRExistsException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTrailsRequest,
  output: DescribeTrailsResponse,
  errors: [
    CloudTrailARNInvalidException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns information about an event data store specified as either an ARN or the ID
 * portion of the ARN.
 */
export const getEventDataStore: (
  input: GetEventDataStoreRequest,
) => effect.Effect<
  GetEventDataStoreResponse,
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InvalidParameterException
  | NoManagementAccountSLRExistsException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventDataStoreRequest,
  output: GetEventDataStoreResponse,
  errors: [
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns a list of failures for the specified import.
 */
export const listImportFailures: {
  (
    input: ListImportFailuresRequest,
  ): effect.Effect<
    ListImportFailuresResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportFailuresRequest,
  ) => stream.Stream<
    ListImportFailuresResponse,
    | InvalidNextTokenException
    | InvalidParameterException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListImportFailuresRequest,
  ) => stream.Stream<
    ImportFailureListItem,
    | InvalidNextTokenException
    | InvalidParameterException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImportFailuresRequest,
  output: ListImportFailuresResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Failures",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information on all imports, or a select set of imports by
 * `ImportStatus` or `Destination`.
 */
export const listImports: {
  (
    input: ListImportsRequest,
  ): effect.Effect<
    ListImportsResponse,
    | EventDataStoreARNInvalidException
    | InvalidNextTokenException
    | InvalidParameterException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportsRequest,
  ) => stream.Stream<
    ListImportsResponse,
    | EventDataStoreARNInvalidException
    | InvalidNextTokenException
    | InvalidParameterException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListImportsRequest,
  ) => stream.Stream<
    ImportsListItem,
    | EventDataStoreARNInvalidException
    | InvalidNextTokenException
    | InvalidParameterException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImportsRequest,
  output: ListImportsResponse,
  errors: [
    EventDataStoreARNInvalidException,
    InvalidNextTokenException,
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Imports",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates a channel specified by a required channel ARN or UUID.
 */
export const updateChannel: (
  input: UpdateChannelRequest,
) => effect.Effect<
  UpdateChannelResponse,
  | ChannelAlreadyExistsException
  | ChannelARNInvalidException
  | ChannelNotFoundException
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InvalidEventDataStoreCategoryException
  | InvalidParameterException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelRequest,
  output: UpdateChannelResponse,
  errors: [
    ChannelAlreadyExistsException,
    ChannelARNInvalidException,
    ChannelNotFoundException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidEventDataStoreCategoryException,
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns a JSON-formatted list of information about the specified trail. Fields include
 * information on delivery errors, Amazon SNS and Amazon S3 errors, and start
 * and stop logging times for each trail. This operation returns trail status from a single
 * Region. To return trail status from all Regions, you must call the operation on each
 * Region.
 */
export const getTrailStatus: (
  input: GetTrailStatusRequest,
) => effect.Effect<
  GetTrailStatusResponse,
  | CloudTrailARNInvalidException
  | InvalidTrailNameException
  | OperationNotPermittedException
  | TrailNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrailStatusRequest,
  output: GetTrailStatusResponse,
  errors: [
    CloudTrailARNInvalidException,
    InvalidTrailNameException,
    OperationNotPermittedException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Describes the settings for the event selectors that you configured for your trail. The
 * information returned for your event selectors includes the following:
 *
 * - If your event selector includes read-only events, write-only events, or all
 * events. This applies to management events, data events, and network activity events.
 *
 * - If your event selector includes management events.
 *
 * - If your event selector includes network activity events, the event sources
 * for which you are logging network activity events.
 *
 * - If your event selector includes data events, the resources on which you are
 * logging data events.
 *
 * For more information about logging management, data, and network activity events, see the following topics
 * in the *CloudTrail User Guide*:
 *
 * - Logging management events
 *
 * - Logging data events
 *
 * - Logging network activity events
 */
export const getEventSelectors: (
  input: GetEventSelectorsRequest,
) => effect.Effect<
  GetEventSelectorsResponse,
  | CloudTrailARNInvalidException
  | InvalidTrailNameException
  | NoManagementAccountSLRExistsException
  | OperationNotPermittedException
  | TrailNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventSelectorsRequest,
  output: GetEventSelectorsResponse,
  errors: [
    CloudTrailARNInvalidException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Describes the settings for the Insights event selectors that you configured for your
 * trail or event data store. `GetInsightSelectors` shows if CloudTrail Insights logging is enabled
 * and which Insights types are configured with corresponding event categories. If you run
 * `GetInsightSelectors` on a trail or event data store that does not have Insights events enabled,
 * the operation throws the exception `InsightNotEnabledException`
 *
 * Specify either the `EventDataStore` parameter to get Insights event selectors for an event data store,
 * or the `TrailName` parameter to the get Insights event selectors for a trail. You cannot specify these parameters together.
 *
 * For more information, see Working with CloudTrail Insights in the *CloudTrail User Guide*.
 */
export const getInsightSelectors: (
  input: GetInsightSelectorsRequest,
) => effect.Effect<
  GetInsightSelectorsResponse,
  | CloudTrailARNInvalidException
  | InsightNotEnabledException
  | InvalidParameterCombinationException
  | InvalidParameterException
  | InvalidTrailNameException
  | NoManagementAccountSLRExistsException
  | OperationNotPermittedException
  | ThrottlingException
  | TrailNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightSelectorsRequest,
  output: GetInsightSelectorsResponse,
  errors: [
    CloudTrailARNInvalidException,
    InsightNotEnabledException,
    InvalidParameterCombinationException,
    InvalidParameterException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns Insights events generated on a trail that logs data events. You can list Insights events that occurred in a Region within the last 90 days.
 *
 * ListInsightsData supports the following Dimensions for Insights events:
 *
 * - Event ID
 *
 * - Event name
 *
 * - Event source
 *
 * All dimensions are optional. The default number of results returned is 50, with a
 * maximum of 50 possible. The response includes a token that you can use to get the next page
 * of results.
 *
 * The rate of ListInsightsData requests is limited to two per second, per account, per Region. If
 * this limit is exceeded, a throttling error occurs.
 */
export const listInsightsData: {
  (
    input: ListInsightsDataRequest,
  ): effect.Effect<
    ListInsightsDataResponse,
    | InvalidParameterException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInsightsDataRequest,
  ) => stream.Stream<
    ListInsightsDataResponse,
    | InvalidParameterException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInsightsDataRequest,
  ) => stream.Stream<
    Event,
    | InvalidParameterException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInsightsDataRequest,
  output: ListInsightsDataResponse,
  errors: [
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Events",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns all public keys whose private keys were used to sign the digest files within the
 * specified time range. The public key is needed to validate digest files that were signed
 * with its corresponding private key.
 *
 * CloudTrail uses different private and public key pairs per Region. Each digest
 * file is signed with a private key unique to its Region. When you validate a digest file
 * from a specific Region, you must look in the same Region for its corresponding public
 * key.
 */
export const listPublicKeys: {
  (
    input: ListPublicKeysRequest,
  ): effect.Effect<
    ListPublicKeysResponse,
    | InvalidTimeRangeException
    | InvalidTokenException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPublicKeysRequest,
  ) => stream.Stream<
    ListPublicKeysResponse,
    | InvalidTimeRangeException
    | InvalidTokenException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPublicKeysRequest,
  ) => stream.Stream<
    PublicKey,
    | InvalidTimeRangeException
    | InvalidTokenException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPublicKeysRequest,
  output: ListPublicKeysResponse,
  errors: [
    InvalidTimeRangeException,
    InvalidTokenException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PublicKeyList",
  } as const,
}));
/**
 * Looks up management events or CloudTrail Insights events that are captured by CloudTrail.
 * You can look up events that occurred in a Region within the last 90 days.
 *
 * `LookupEvents` returns recent Insights events for trails that enable Insights. To view Insights events for an event data store, you can run queries on your
 * Insights event data store, and you can also view the Lake dashboard for Insights.
 *
 * Lookup supports the following attributes for management events:
 *
 * - Amazon Web Services access key
 *
 * - Event ID
 *
 * - Event name
 *
 * - Event source
 *
 * - Read only
 *
 * - Resource name
 *
 * - Resource type
 *
 * - User name
 *
 * Lookup supports the following attributes for Insights events:
 *
 * - Event ID
 *
 * - Event name
 *
 * - Event source
 *
 * All attributes are optional. The default number of results returned is 50, with a
 * maximum of 50 possible. The response includes a token that you can use to get the next page
 * of results.
 *
 * The rate of lookup requests is limited to two per second, per account, per Region. If
 * this limit is exceeded, a throttling error occurs.
 */
export const lookupEvents: {
  (
    input: LookupEventsRequest,
  ): effect.Effect<
    LookupEventsResponse,
    | InvalidEventCategoryException
    | InvalidLookupAttributesException
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidTimeRangeException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: LookupEventsRequest,
  ) => stream.Stream<
    LookupEventsResponse,
    | InvalidEventCategoryException
    | InvalidLookupAttributesException
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidTimeRangeException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: LookupEventsRequest,
  ) => stream.Stream<
    Event,
    | InvalidEventCategoryException
    | InvalidLookupAttributesException
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidTimeRangeException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: LookupEventsRequest,
  output: LookupEventsResponse,
  errors: [
    InvalidEventCategoryException,
    InvalidLookupAttributesException,
    InvalidMaxResultsException,
    InvalidNextTokenException,
    InvalidTimeRangeException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Events",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Starts the recording of Amazon Web Services API calls and log file delivery for a trail.
 * For a trail that is enabled in all Regions, this operation must be called from the Region
 * in which the trail was created. This operation cannot be called on the shadow trails
 * (replicated trails in other Regions) of a trail that is enabled in all Regions.
 */
export const startLogging: (
  input: StartLoggingRequest,
) => effect.Effect<
  StartLoggingResponse,
  | CloudTrailARNInvalidException
  | ConflictException
  | InsufficientDependencyServiceAccessPermissionException
  | InvalidHomeRegionException
  | InvalidTrailNameException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | ThrottlingException
  | TrailNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartLoggingRequest,
  output: StartLoggingResponse,
  errors: [
    CloudTrailARNInvalidException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidHomeRegionException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns metadata about a query, including query run time in milliseconds, number of
 * events scanned and matched, and query status. If the query results were delivered to an S3 bucket,
 * the response also provides the S3 URI and the delivery status.
 *
 * You must specify either `QueryId` or `QueryAlias`. Specifying the `QueryAlias` parameter
 * returns information about the last query run for the alias. You can provide
 * `RefreshId` along with `QueryAlias` to view the query results
 * of a dashboard query for the specified `RefreshId`.
 */
export const describeQuery: (
  input: DescribeQueryRequest,
) => effect.Effect<
  DescribeQueryResponse,
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InvalidParameterException
  | NoManagementAccountSLRExistsException
  | OperationNotPermittedException
  | QueryIdNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeQueryRequest,
  output: DescribeQueryResponse,
  errors: [
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    QueryIdNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates the event configuration settings for the specified event data store or trail. This operation supports updating the maximum event size, adding or modifying context key selectors for event data store, and configuring aggregation settings for the trail.
 */
export const putEventConfiguration: (
  input: PutEventConfigurationRequest,
) => effect.Effect<
  PutEventConfigurationResponse,
  | CloudTrailARNInvalidException
  | ConflictException
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InsufficientDependencyServiceAccessPermissionException
  | InsufficientIAMAccessPermissionException
  | InvalidEventDataStoreCategoryException
  | InvalidEventDataStoreStatusException
  | InvalidHomeRegionException
  | InvalidParameterCombinationException
  | InvalidParameterException
  | InvalidTrailNameException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | ThrottlingException
  | TrailNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEventConfigurationRequest,
  output: PutEventConfigurationResponse,
  errors: [
    CloudTrailARNInvalidException,
    ConflictException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientDependencyServiceAccessPermissionException,
    InsufficientIAMAccessPermissionException,
    InvalidEventDataStoreCategoryException,
    InvalidEventDataStoreStatusException,
    InvalidHomeRegionException,
    InvalidParameterCombinationException,
    InvalidParameterException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Starts a refresh of the specified dashboard.
 *
 * Each time a dashboard is refreshed, CloudTrail runs queries to populate the dashboard's widgets. CloudTrail must be granted permissions to run the `StartQuery` operation on your behalf. To provide permissions, run the `PutResourcePolicy` operation to attach a resource-based policy to each event data store. For more information,
 * see Example: Allow CloudTrail to run queries to populate a dashboard in the *CloudTrail User Guide*.
 */
export const startDashboardRefresh: (
  input: StartDashboardRefreshRequest,
) => effect.Effect<
  StartDashboardRefreshResponse,
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDashboardRefreshRequest,
  output: StartDashboardRefreshResponse,
  errors: [
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a custom dashboard or the Highlights dashboard.
 *
 * - **Custom dashboards** - Custom dashboards allow you to query
 * events in any event data store type. You can add up to 10 widgets to a custom dashboard. You can manually refresh a custom dashboard, or you can set a refresh schedule.
 *
 * - **Highlights dashboard** - You can create
 * the Highlights dashboard to see a summary of key user activities and API usage across all your event data stores.
 * CloudTrail Lake manages the Highlights dashboard and refreshes the dashboard every 6 hours. To create the Highlights dashboard, you must set and enable a refresh schedule.
 *
 * CloudTrail runs queries to populate the dashboard's widgets during a manual or scheduled refresh. CloudTrail must be granted permissions to run the `StartQuery` operation on your behalf. To provide permissions, run the `PutResourcePolicy` operation to attach a resource-based policy to each event data store. For more information,
 * see Example: Allow CloudTrail to run queries to populate a dashboard in the *CloudTrail User Guide*.
 *
 * To set a refresh schedule, CloudTrail must be granted permissions to run the `StartDashboardRefresh` operation to refresh the dashboard on your behalf. To provide permissions, run the `PutResourcePolicy` operation to attach a resource-based policy to the dashboard. For more information,
 * see
 * Resource-based policy example for a dashboard in the *CloudTrail User Guide*.
 *
 * For more information about dashboards, see CloudTrail Lake dashboards in the *CloudTrail User Guide*.
 */
export const createDashboard: (
  input: CreateDashboardRequest,
) => effect.Effect<
  CreateDashboardResponse,
  | ConflictException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InsufficientEncryptionPolicyException
  | InvalidQueryStatementException
  | InvalidTagParameterException
  | ServiceQuotaExceededException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDashboardRequest,
  output: CreateDashboardResponse,
  errors: [
    ConflictException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientEncryptionPolicyException,
    InvalidQueryStatementException,
    InvalidTagParameterException,
    ServiceQuotaExceededException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves the current event configuration settings for the specified event data store or trail. The response includes maximum event size configuration, the context key selectors configured for the event data store, and any aggregation settings configured for the trail.
 */
export const getEventConfiguration: (
  input: GetEventConfigurationRequest,
) => effect.Effect<
  GetEventConfigurationResponse,
  | CloudTrailARNInvalidException
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InvalidEventDataStoreCategoryException
  | InvalidEventDataStoreStatusException
  | InvalidParameterCombinationException
  | InvalidParameterException
  | InvalidTrailNameException
  | NoManagementAccountSLRExistsException
  | OperationNotPermittedException
  | TrailNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventConfigurationRequest,
  output: GetEventConfigurationResponse,
  errors: [
    CloudTrailARNInvalidException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InvalidEventDataStoreCategoryException,
    InvalidEventDataStoreStatusException,
    InvalidParameterCombinationException,
    InvalidParameterException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Starts the ingestion of live events on an event data store specified as either an ARN or the ID portion of the ARN. To start ingestion, the event data store `Status` must be `STOPPED_INGESTION`
 * and the `eventCategory` must be `Management`, `Data`, `NetworkActivity`, or `ConfigurationItem`.
 */
export const startEventDataStoreIngestion: (
  input: StartEventDataStoreIngestionRequest,
) => effect.Effect<
  StartEventDataStoreIngestionResponse,
  | ConflictException
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InsufficientDependencyServiceAccessPermissionException
  | InvalidEventDataStoreCategoryException
  | InvalidEventDataStoreStatusException
  | InvalidParameterException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartEventDataStoreIngestionRequest,
  output: StartEventDataStoreIngestionResponse,
  errors: [
    ConflictException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidEventDataStoreCategoryException,
    InvalidEventDataStoreStatusException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Stops the ingestion of live events on an event data store specified as either an ARN or the ID portion of the ARN. To stop ingestion, the event data store `Status` must be `ENABLED`
 * and the `eventCategory` must be `Management`, `Data`, `NetworkActivity`, or `ConfigurationItem`.
 */
export const stopEventDataStoreIngestion: (
  input: StopEventDataStoreIngestionRequest,
) => effect.Effect<
  StopEventDataStoreIngestionResponse,
  | ConflictException
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InsufficientDependencyServiceAccessPermissionException
  | InvalidEventDataStoreCategoryException
  | InvalidEventDataStoreStatusException
  | InvalidParameterException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopEventDataStoreIngestionRequest,
  output: StopEventDataStoreIngestionResponse,
  errors: [
    ConflictException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidEventDataStoreCategoryException,
    InvalidEventDataStoreStatusException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Suspends the recording of Amazon Web Services API calls and log file delivery for the
 * specified trail. Under most circumstances, there is no need to use this action. You can
 * update a trail without stopping it first. This action is the only way to stop recording.
 * For a trail enabled in all Regions, this operation must be called from the Region in which
 * the trail was created, or an `InvalidHomeRegionException` will occur. This
 * operation cannot be called on the shadow trails (replicated trails in other Regions) of a
 * trail enabled in all Regions.
 */
export const stopLogging: (
  input: StopLoggingRequest,
) => effect.Effect<
  StopLoggingResponse,
  | CloudTrailARNInvalidException
  | ConflictException
  | InsufficientDependencyServiceAccessPermissionException
  | InvalidHomeRegionException
  | InvalidTrailNameException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | ThrottlingException
  | TrailNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopLoggingRequest,
  output: StopLoggingResponse,
  errors: [
    CloudTrailARNInvalidException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidHomeRegionException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes a trail. This operation must be called from the Region in which the trail was
 * created. `DeleteTrail` cannot be called on the shadow trails (replicated trails
 * in other Regions) of a trail that is enabled in all Regions.
 *
 * While deleting a CloudTrail trail is an irreversible action, CloudTrail does not
 * delete log files in the Amazon S3 bucket for that trail, the Amazon S3 bucket itself, or the
 * CloudWatchlog group to which the trail delivers events. Deleting a multi-Region trail
 * will stop logging of events in all Amazon Web Services Regions enabled in your Amazon Web Services account. Deleting a
 * single-Region trail will stop logging of events in that Region only. It will not stop
 * logging of events in other Regions even if the trails in those other Regions have
 * identical names to the deleted trail.
 *
 * For information about account closure and deletion of CloudTrail trails, see https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-account-closure.html.
 */
export const deleteTrail: (
  input: DeleteTrailRequest,
) => effect.Effect<
  DeleteTrailResponse,
  | CloudTrailARNInvalidException
  | ConflictException
  | InsufficientDependencyServiceAccessPermissionException
  | InvalidHomeRegionException
  | InvalidTrailNameException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | ThrottlingException
  | TrailNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrailRequest,
  output: DeleteTrailResponse,
  errors: [
    CloudTrailARNInvalidException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidHomeRegionException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Configures event selectors (also referred to as *basic event selectors*) or advanced event selectors for your trail. You can use
 * either `AdvancedEventSelectors` or `EventSelectors`, but not both. If
 * you apply `AdvancedEventSelectors` to a trail, any existing
 * `EventSelectors` are overwritten.
 *
 * You can use `AdvancedEventSelectors` to
 * log management events, data events for all resource types, and network activity events.
 *
 * You can use `EventSelectors` to log management events and data events for the following resource types:
 *
 * - `AWS::DynamoDB::Table`
 *
 * - `AWS::Lambda::Function`
 *
 * - `AWS::S3::Object`
 *
 * You can't use `EventSelectors` to log network activity events.
 *
 * If you want your trail to log Insights events, be sure the event selector or advanced event selector enables
 * logging of the Insights event types you want configured for your trail. For more information about logging Insights events, see Working with CloudTrail Insights in the *CloudTrail User Guide*.
 * By default, trails created without specific event selectors are configured to
 * log all read and write management events, and no data events or network activity events.
 *
 * When an event occurs in your account, CloudTrail evaluates the event selectors or
 * advanced event selectors in all trails. For each trail, if the event matches any event
 * selector, the trail processes and logs the event. If the event doesn't match any event
 * selector, the trail doesn't log the event.
 *
 * Example
 *
 * - You create an event selector for a trail and specify that you want to log write-only
 * events.
 *
 * - The EC2 `GetConsoleOutput` and `RunInstances` API operations
 * occur in your account.
 *
 * - CloudTrail evaluates whether the events match your event selectors.
 *
 * - The `RunInstances` is a write-only event and it matches your event
 * selector. The trail logs the event.
 *
 * - The `GetConsoleOutput` is a read-only event that doesn't match your
 * event selector. The trail doesn't log the event.
 *
 * The `PutEventSelectors` operation must be called from the Region in which the
 * trail was created; otherwise, an `InvalidHomeRegionException` exception is
 * thrown.
 *
 * You can configure up to five event selectors for each trail.
 *
 * You can add advanced event selectors, and conditions for your advanced event selectors,
 * up to a maximum of 500 values for all conditions and selectors on a trail. For more information, see
 * Logging management events, Logging
 * data events, Logging
 * network activity events, and Quotas in CloudTrail in the CloudTrail User
 * Guide.
 */
export const putEventSelectors: (
  input: PutEventSelectorsRequest,
) => effect.Effect<
  PutEventSelectorsResponse,
  | CloudTrailARNInvalidException
  | ConflictException
  | InsufficientDependencyServiceAccessPermissionException
  | InvalidEventSelectorsException
  | InvalidHomeRegionException
  | InvalidTrailNameException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | ThrottlingException
  | TrailNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEventSelectorsRequest,
  output: PutEventSelectorsResponse,
  errors: [
    CloudTrailARNInvalidException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidEventSelectorsException,
    InvalidHomeRegionException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Gets event data results of a query. You must specify the `QueryID` value
 * returned by the `StartQuery` operation.
 */
export const getQueryResults: {
  (
    input: GetQueryResultsRequest,
  ): effect.Effect<
    GetQueryResultsResponse,
    | EventDataStoreARNInvalidException
    | EventDataStoreNotFoundException
    | InactiveEventDataStoreException
    | InsufficientEncryptionPolicyException
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidParameterException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | QueryIdNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetQueryResultsRequest,
  ) => stream.Stream<
    GetQueryResultsResponse,
    | EventDataStoreARNInvalidException
    | EventDataStoreNotFoundException
    | InactiveEventDataStoreException
    | InsufficientEncryptionPolicyException
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidParameterException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | QueryIdNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetQueryResultsRequest,
  ) => stream.Stream<
    unknown,
    | EventDataStoreARNInvalidException
    | EventDataStoreNotFoundException
    | InactiveEventDataStoreException
    | InsufficientEncryptionPolicyException
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidParameterException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | QueryIdNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetQueryResultsRequest,
  output: GetQueryResultsResponse,
  errors: [
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientEncryptionPolicyException,
    InvalidMaxResultsException,
    InvalidNextTokenException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    QueryIdNotFoundException,
    UnsupportedOperationException,
  ],
  pagination: { inputToken: "NextToken", outputToken: "NextToken" } as const,
}));
/**
 * Cancels a query if the query is not in a terminated state, such as
 * `CANCELLED`, `FAILED`, `TIMED_OUT`, or
 * `FINISHED`. You must specify an ARN value for `EventDataStore`.
 * The ID of the query that you want to cancel is also required. When you run
 * `CancelQuery`, the query status might show as `CANCELLED` even if
 * the operation is not yet finished.
 */
export const cancelQuery: (
  input: CancelQueryRequest,
) => effect.Effect<
  CancelQueryResponse,
  | ConflictException
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InactiveQueryException
  | InvalidParameterException
  | NoManagementAccountSLRExistsException
  | OperationNotPermittedException
  | QueryIdNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelQueryRequest,
  output: CancelQueryResponse,
  errors: [
    ConflictException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InactiveQueryException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    QueryIdNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates the specified dashboard.
 *
 * To set a refresh schedule, CloudTrail must be granted permissions to run the `StartDashboardRefresh` operation to refresh the dashboard on your behalf. To provide permissions, run the `PutResourcePolicy` operation to attach a resource-based policy to the dashboard. For more information,
 * see
 * Resource-based policy example for a dashboard in the *CloudTrail User Guide*.
 *
 * CloudTrail runs queries to populate the dashboard's widgets during a manual or scheduled refresh. CloudTrail must be granted permissions to run the `StartQuery` operation on your behalf. To provide permissions, run the `PutResourcePolicy` operation to attach a resource-based policy to each event data store. For more information,
 * see Example: Allow CloudTrail to run queries to populate a dashboard in the *CloudTrail User Guide*.
 */
export const updateDashboard: (
  input: UpdateDashboardRequest,
) => effect.Effect<
  UpdateDashboardResponse,
  | ConflictException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InsufficientEncryptionPolicyException
  | InvalidQueryStatementException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDashboardRequest,
  output: UpdateDashboardResponse,
  errors: [
    ConflictException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientEncryptionPolicyException,
    InvalidQueryStatementException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UnsupportedOperationException,
  ],
}));
/**
 * Disables the event data store specified by `EventDataStore`, which accepts an
 * event data store ARN. After you run `DeleteEventDataStore`, the event data store
 * enters a `PENDING_DELETION` state, and is automatically deleted after a wait
 * period of seven days. `TerminationProtectionEnabled` must be set to
 * `False` on the event data store and the `FederationStatus` must be `DISABLED`.
 * You cannot delete an event data store if `TerminationProtectionEnabled`
 * is `True` or the `FederationStatus` is `ENABLED`.
 *
 * After you run `DeleteEventDataStore` on an event data store, you cannot run
 * `ListQueries`, `DescribeQuery`, or `GetQueryResults` on
 * queries that are using an event data store in a `PENDING_DELETION` state. An
 * event data store in the `PENDING_DELETION` state does not incur costs.
 */
export const deleteEventDataStore: (
  input: DeleteEventDataStoreRequest,
) => effect.Effect<
  DeleteEventDataStoreResponse,
  | ChannelExistsForEDSException
  | ConflictException
  | EventDataStoreARNInvalidException
  | EventDataStoreFederationEnabledException
  | EventDataStoreHasOngoingImportException
  | EventDataStoreNotFoundException
  | EventDataStoreTerminationProtectedException
  | InactiveEventDataStoreException
  | InsufficientDependencyServiceAccessPermissionException
  | InvalidParameterException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventDataStoreRequest,
  output: DeleteEventDataStoreResponse,
  errors: [
    ChannelExistsForEDSException,
    ConflictException,
    EventDataStoreARNInvalidException,
    EventDataStoreFederationEnabledException,
    EventDataStoreHasOngoingImportException,
    EventDataStoreNotFoundException,
    EventDataStoreTerminationProtectedException,
    InactiveEventDataStoreException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves the JSON text of the resource-based policy document attached to the CloudTrail event data store, dashboard, or channel.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => effect.Effect<
  GetResourcePolicyResponse,
  | OperationNotPermittedException
  | ResourceARNNotValidException
  | ResourceNotFoundException
  | ResourcePolicyNotFoundException
  | ResourceTypeNotSupportedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    OperationNotPermittedException,
    ResourceARNNotValidException,
    ResourceNotFoundException,
    ResourcePolicyNotFoundException,
    ResourceTypeNotSupportedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Attaches a resource-based permission policy to a CloudTrail event data store, dashboard, or channel. For more information about resource-based policies, see
 * CloudTrail resource-based policy examples
 * in the *CloudTrail User Guide*.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResponse,
  | ConflictException
  | OperationNotPermittedException
  | ResourceARNNotValidException
  | ResourceNotFoundException
  | ResourcePolicyNotValidException
  | ResourceTypeNotSupportedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    ConflictException,
    OperationNotPermittedException,
    ResourceARNNotValidException,
    ResourceNotFoundException,
    ResourcePolicyNotValidException,
    ResourceTypeNotSupportedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes the resource-based policy attached to the CloudTrail event data store, dashboard, or channel.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | ConflictException
  | OperationNotPermittedException
  | ResourceARNNotValidException
  | ResourceNotFoundException
  | ResourcePolicyNotFoundException
  | ResourceTypeNotSupportedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    ConflictException,
    OperationNotPermittedException,
    ResourceARNNotValidException,
    ResourceNotFoundException,
    ResourcePolicyNotFoundException,
    ResourceTypeNotSupportedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Lists the tags for the specified trails, event data stores, dashboards, or channels in the current Region.
 */
export const listTags: {
  (
    input: ListTagsRequest,
  ): effect.Effect<
    ListTagsResponse,
    | ChannelARNInvalidException
    | CloudTrailARNInvalidException
    | EventDataStoreARNInvalidException
    | EventDataStoreNotFoundException
    | InactiveEventDataStoreException
    | InvalidTokenException
    | InvalidTrailNameException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | ResourceNotFoundException
    | ResourceTypeNotSupportedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsRequest,
  ) => stream.Stream<
    ListTagsResponse,
    | ChannelARNInvalidException
    | CloudTrailARNInvalidException
    | EventDataStoreARNInvalidException
    | EventDataStoreNotFoundException
    | InactiveEventDataStoreException
    | InvalidTokenException
    | InvalidTrailNameException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | ResourceNotFoundException
    | ResourceTypeNotSupportedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsRequest,
  ) => stream.Stream<
    ResourceTag,
    | ChannelARNInvalidException
    | CloudTrailARNInvalidException
    | EventDataStoreARNInvalidException
    | EventDataStoreNotFoundException
    | InactiveEventDataStoreException
    | InvalidTokenException
    | InvalidTrailNameException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | ResourceNotFoundException
    | ResourceTypeNotSupportedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    ChannelARNInvalidException,
    CloudTrailARNInvalidException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidTokenException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    ResourceNotFoundException,
    ResourceTypeNotSupportedException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceTagList",
  } as const,
}));
/**
 * Removes the specified tags from a trail, event data store, dashboard, or channel.
 */
export const removeTags: (
  input: RemoveTagsRequest,
) => effect.Effect<
  RemoveTagsResponse,
  | ChannelARNInvalidException
  | ChannelNotFoundException
  | CloudTrailARNInvalidException
  | ConflictException
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InvalidTagParameterException
  | InvalidTrailNameException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | ResourceTypeNotSupportedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsRequest,
  output: RemoveTagsResponse,
  errors: [
    ChannelARNInvalidException,
    ChannelNotFoundException,
    CloudTrailARNInvalidException,
    ConflictException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidTagParameterException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ResourceNotFoundException,
    ResourceTypeNotSupportedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Removes CloudTrail delegated administrator permissions from a member account in
 * an organization.
 */
export const deregisterOrganizationDelegatedAdmin: (
  input: DeregisterOrganizationDelegatedAdminRequest,
) => effect.Effect<
  DeregisterOrganizationDelegatedAdminResponse,
  | AccountNotFoundException
  | AccountNotRegisteredException
  | CloudTrailAccessNotEnabledException
  | ConflictException
  | InsufficientDependencyServiceAccessPermissionException
  | InvalidParameterException
  | NotOrganizationManagementAccountException
  | OperationNotPermittedException
  | OrganizationNotInAllFeaturesModeException
  | OrganizationsNotInUseException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterOrganizationDelegatedAdminRequest,
  output: DeregisterOrganizationDelegatedAdminResponse,
  errors: [
    AccountNotFoundException,
    AccountNotRegisteredException,
    CloudTrailAccessNotEnabledException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidParameterException,
    NotOrganizationManagementAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns a list of queries and query statuses for the past seven days. You must specify
 * an ARN value for `EventDataStore`. Optionally, to shorten the list of results,
 * you can specify a time range, formatted as timestamps, by adding `StartTime` and
 * `EndTime` parameters, and a `QueryStatus` value. Valid values for
 * `QueryStatus` include `QUEUED`, `RUNNING`,
 * `FINISHED`, `FAILED`, `TIMED_OUT`, or
 * `CANCELLED`.
 */
export const listQueries: {
  (
    input: ListQueriesRequest,
  ): effect.Effect<
    ListQueriesResponse,
    | EventDataStoreARNInvalidException
    | EventDataStoreNotFoundException
    | InactiveEventDataStoreException
    | InvalidDateRangeException
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidQueryStatusException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueriesRequest,
  ) => stream.Stream<
    ListQueriesResponse,
    | EventDataStoreARNInvalidException
    | EventDataStoreNotFoundException
    | InactiveEventDataStoreException
    | InvalidDateRangeException
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidQueryStatusException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueriesRequest,
  ) => stream.Stream<
    unknown,
    | EventDataStoreARNInvalidException
    | EventDataStoreNotFoundException
    | InactiveEventDataStoreException
    | InvalidDateRangeException
    | InvalidMaxResultsException
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidQueryStatusException
    | NoManagementAccountSLRExistsException
    | OperationNotPermittedException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQueriesRequest,
  output: ListQueriesResponse,
  errors: [
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidDateRangeException,
    InvalidMaxResultsException,
    InvalidNextTokenException,
    InvalidParameterException,
    InvalidQueryStatusException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Starts an import of logged trail events from a source S3 bucket to a destination event
 * data store. By default, CloudTrail only imports events contained in the S3 bucket's
 * `CloudTrail` prefix and the prefixes inside the `CloudTrail` prefix, and does not check prefixes for other Amazon Web Services
 * services. If you want to import CloudTrail events contained in another prefix, you
 * must include the prefix in the `S3LocationUri`. For more considerations about
 * importing trail events, see Considerations for copying trail events in the *CloudTrail User Guide*.
 *
 * When you start a new import, the `Destinations` and
 * `ImportSource` parameters are required. Before starting a new import, disable
 * any access control lists (ACLs) attached to the source S3 bucket. For more information
 * about disabling ACLs, see Controlling ownership of
 * objects and disabling ACLs for your bucket.
 *
 * When you retry an import, the `ImportID` parameter is required.
 *
 * If the destination event data store is for an organization, you must use the
 * management account to import trail events. You cannot use the delegated administrator
 * account for the organization.
 */
export const startImport: (
  input: StartImportRequest,
) => effect.Effect<
  StartImportResponse,
  | AccountHasOngoingImportException
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | ImportNotFoundException
  | InactiveEventDataStoreException
  | InsufficientEncryptionPolicyException
  | InvalidEventDataStoreCategoryException
  | InvalidEventDataStoreStatusException
  | InvalidImportSourceException
  | InvalidParameterException
  | OperationNotPermittedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportRequest,
  output: StartImportResponse,
  errors: [
    AccountHasOngoingImportException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    ImportNotFoundException,
    InactiveEventDataStoreException,
    InsufficientEncryptionPolicyException,
    InvalidEventDataStoreCategoryException,
    InvalidEventDataStoreStatusException,
    InvalidImportSourceException,
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Enables Lake query federation on the specified event data store. Federating an event data store lets you view the metadata associated with the event data store in the Glue
 * Data Catalog and run
 * SQL queries against your event data using Amazon Athena. The table metadata stored in the Glue Data Catalog
 * lets the Athena query engine know how to find, read, and process the data that you want to query.
 *
 * When you enable Lake query federation, CloudTrail
 * creates a managed database named `aws:cloudtrail` (if the database doesn't already exist) and a managed federated table in
 * the Glue Data Catalog. The event data store ID is used for the table name. CloudTrail registers the role ARN and event data store in
 * Lake Formation, the service responsible for allowing fine-grained access control
 * of the federated resources in the Glue Data Catalog.
 *
 * For more information about Lake query federation, see Federate an event data store.
 */
export const enableFederation: (
  input: EnableFederationRequest,
) => effect.Effect<
  EnableFederationResponse,
  | AccessDeniedException
  | CloudTrailAccessNotEnabledException
  | ConcurrentModificationException
  | EventDataStoreARNInvalidException
  | EventDataStoreFederationEnabledException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InsufficientDependencyServiceAccessPermissionException
  | InvalidParameterException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | OrganizationNotInAllFeaturesModeException
  | OrganizationsNotInUseException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableFederationRequest,
  output: EnableFederationResponse,
  errors: [
    AccessDeniedException,
    CloudTrailAccessNotEnabledException,
    ConcurrentModificationException,
    EventDataStoreARNInvalidException,
    EventDataStoreFederationEnabledException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    UnsupportedOperationException,
  ],
}));
/**
 * Disables Lake query federation on the specified event data store. When you disable federation, CloudTrail disables
 * the integration with Glue, Lake Formation, and Amazon Athena.
 * After disabling Lake query federation, you can no longer query your event data in Amazon Athena.
 *
 * No CloudTrail Lake data is deleted when you disable federation and you can continue to run queries in CloudTrail Lake.
 */
export const disableFederation: (
  input: DisableFederationRequest,
) => effect.Effect<
  DisableFederationResponse,
  | AccessDeniedException
  | CloudTrailAccessNotEnabledException
  | ConcurrentModificationException
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InsufficientDependencyServiceAccessPermissionException
  | InvalidParameterException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | OrganizationNotInAllFeaturesModeException
  | OrganizationsNotInUseException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableFederationRequest,
  output: DisableFederationResponse,
  errors: [
    AccessDeniedException,
    CloudTrailAccessNotEnabledException,
    ConcurrentModificationException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    UnsupportedOperationException,
  ],
}));
/**
 * Restores a deleted event data store specified by `EventDataStore`, which
 * accepts an event data store ARN. You can only restore a deleted event data store within the
 * seven-day wait period after deletion. Restoring an event data store can take several
 * minutes, depending on the size of the event data store.
 */
export const restoreEventDataStore: (
  input: RestoreEventDataStoreRequest,
) => effect.Effect<
  RestoreEventDataStoreResponse,
  | CloudTrailAccessNotEnabledException
  | EventDataStoreARNInvalidException
  | EventDataStoreMaxLimitExceededException
  | EventDataStoreNotFoundException
  | InsufficientDependencyServiceAccessPermissionException
  | InvalidEventDataStoreStatusException
  | InvalidParameterException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | OrganizationNotInAllFeaturesModeException
  | OrganizationsNotInUseException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreEventDataStoreRequest,
  output: RestoreEventDataStoreResponse,
  errors: [
    CloudTrailAccessNotEnabledException,
    EventDataStoreARNInvalidException,
    EventDataStoreMaxLimitExceededException,
    EventDataStoreNotFoundException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidEventDataStoreStatusException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    UnsupportedOperationException,
  ],
}));
/**
 * Registers an organization’s member account as the CloudTrail delegated administrator.
 */
export const registerOrganizationDelegatedAdmin: (
  input: RegisterOrganizationDelegatedAdminRequest,
) => effect.Effect<
  RegisterOrganizationDelegatedAdminResponse,
  | AccountNotFoundException
  | AccountRegisteredException
  | CannotDelegateManagementAccountException
  | CloudTrailAccessNotEnabledException
  | ConflictException
  | DelegatedAdminAccountLimitExceededException
  | InsufficientDependencyServiceAccessPermissionException
  | InsufficientIAMAccessPermissionException
  | InvalidParameterException
  | NotOrganizationManagementAccountException
  | OperationNotPermittedException
  | OrganizationNotInAllFeaturesModeException
  | OrganizationsNotInUseException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterOrganizationDelegatedAdminRequest,
  output: RegisterOrganizationDelegatedAdminResponse,
  errors: [
    AccountNotFoundException,
    AccountRegisteredException,
    CannotDelegateManagementAccountException,
    CloudTrailAccessNotEnabledException,
    ConflictException,
    DelegatedAdminAccountLimitExceededException,
    InsufficientDependencyServiceAccessPermissionException,
    InsufficientIAMAccessPermissionException,
    InvalidParameterException,
    NotOrganizationManagementAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a channel for CloudTrail to ingest events from a partner or external source.
 * After you create a channel, a CloudTrail Lake event data store can log events
 * from the partner or source that you specify.
 */
export const createChannel: (
  input: CreateChannelRequest,
) => effect.Effect<
  CreateChannelResponse,
  | ChannelAlreadyExistsException
  | ChannelMaxLimitExceededException
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InvalidEventDataStoreCategoryException
  | InvalidParameterException
  | InvalidSourceException
  | InvalidTagParameterException
  | OperationNotPermittedException
  | TagsLimitExceededException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelRequest,
  output: CreateChannelResponse,
  errors: [
    ChannelAlreadyExistsException,
    ChannelMaxLimitExceededException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidEventDataStoreCategoryException,
    InvalidParameterException,
    InvalidSourceException,
    InvalidTagParameterException,
    OperationNotPermittedException,
    TagsLimitExceededException,
    UnsupportedOperationException,
  ],
}));
/**
 * Adds one or more tags to a trail, event data store, dashboard, or channel, up to a limit of 50. Overwrites an
 * existing tag's value when a new value is specified for an existing tag key. Tag key names
 * must be unique; you cannot have two keys with the same name but different
 * values. If you specify a key without a value, the tag will be created with the specified
 * key and a value of null. You can tag a trail or event data store that applies to all
 * Amazon Web Services Regions only from the Region in which the trail or event data store
 * was created (also known as its home Region).
 */
export const addTags: (
  input: AddTagsRequest,
) => effect.Effect<
  AddTagsResponse,
  | ChannelARNInvalidException
  | ChannelNotFoundException
  | CloudTrailARNInvalidException
  | ConflictException
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InvalidTagParameterException
  | InvalidTrailNameException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | ResourceNotFoundException
  | ResourceTypeNotSupportedException
  | TagsLimitExceededException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsRequest,
  output: AddTagsResponse,
  errors: [
    ChannelARNInvalidException,
    ChannelNotFoundException,
    CloudTrailARNInvalidException,
    ConflictException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidTagParameterException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ResourceNotFoundException,
    ResourceTypeNotSupportedException,
    TagsLimitExceededException,
    UnsupportedOperationException,
  ],
}));
/**
 * Lets you enable Insights event logging on specific event categories by specifying the Insights selectors that you
 * want to enable on an existing trail or event data store. You also use `PutInsightSelectors` to turn
 * off Insights event logging, by passing an empty list of Insights types. The valid Insights
 * event types are `ApiErrorRateInsight` and
 * `ApiCallRateInsight`, and valid EventCategories are `Management` and `Data`.
 *
 * Insights on data events are not supported on event data stores. For event data stores, you can only enable Insights on management events.
 *
 * To enable Insights on an event data store, you must specify the ARNs (or ID suffix of the ARNs) for the source event data store (`EventDataStore`) and the destination event data store (`InsightsDestination`). The source event data store logs management events and enables Insights.
 * The destination event data store logs Insights events based upon the management event activity of the source event data store. The source and destination event data stores must belong to the same Amazon Web Services account.
 *
 * To log Insights events for a trail, you must specify the name (`TrailName`) of the CloudTrail trail for which you want to change or add Insights
 * selectors.
 *
 * - For Management events Insights: To log CloudTrail Insights on the API call rate, the trail or event data store must log `write` management events.
 * To log CloudTrail Insights on the API error rate, the trail or event data store must log `read` or `write` management events.
 *
 * - For Data events Insights: To log CloudTrail Insights on the API call rate or API error rate, the trail must log `read` or `write` data events. Data events Insights are not supported on event data store.
 *
 * To log CloudTrail Insights events on API call volume, the trail or event data store
 * must log `write` management events. To log CloudTrail
 * Insights events on API error rate, the trail or event data store must log `read` or
 * `write` management events. You can call `GetEventSelectors` on a trail
 * to check whether the trail logs management events. You can call `GetEventDataStore` on an
 * event data store to check whether the event data store logs management events.
 *
 * For more information, see Working with CloudTrail Insights in the *CloudTrail User Guide*.
 */
export const putInsightSelectors: (
  input: PutInsightSelectorsRequest,
) => effect.Effect<
  PutInsightSelectorsResponse,
  | CloudTrailARNInvalidException
  | InsufficientEncryptionPolicyException
  | InsufficientS3BucketPolicyException
  | InvalidHomeRegionException
  | InvalidInsightSelectorsException
  | InvalidParameterCombinationException
  | InvalidParameterException
  | InvalidTrailNameException
  | KmsException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | S3BucketDoesNotExistException
  | ThrottlingException
  | TrailNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutInsightSelectorsRequest,
  output: PutInsightSelectorsResponse,
  errors: [
    CloudTrailARNInvalidException,
    InsufficientEncryptionPolicyException,
    InsufficientS3BucketPolicyException,
    InvalidHomeRegionException,
    InvalidInsightSelectorsException,
    InvalidParameterCombinationException,
    InvalidParameterException,
    InvalidTrailNameException,
    KmsException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    S3BucketDoesNotExistException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Starts a CloudTrail Lake query. Use the `QueryStatement`
 * parameter to provide your SQL query, enclosed in single quotation marks. Use the optional
 * `DeliveryS3Uri` parameter to deliver the query results to an S3
 * bucket.
 *
 * `StartQuery` requires you specify either the `QueryStatement` parameter, or a `QueryAlias` and any `QueryParameters`. In the current release,
 * the `QueryAlias` and `QueryParameters` parameters are used only for the queries that populate the CloudTrail Lake dashboards.
 */
export const startQuery: (
  input: StartQueryRequest,
) => effect.Effect<
  StartQueryResponse,
  | EventDataStoreARNInvalidException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InsufficientEncryptionPolicyException
  | InsufficientS3BucketPolicyException
  | InvalidParameterException
  | InvalidQueryStatementException
  | InvalidS3BucketNameException
  | InvalidS3PrefixException
  | MaxConcurrentQueriesException
  | NoManagementAccountSLRExistsException
  | OperationNotPermittedException
  | S3BucketDoesNotExistException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartQueryRequest,
  output: StartQueryResponse,
  errors: [
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientEncryptionPolicyException,
    InsufficientS3BucketPolicyException,
    InvalidParameterException,
    InvalidQueryStatementException,
    InvalidS3BucketNameException,
    InvalidS3PrefixException,
    MaxConcurrentQueriesException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    S3BucketDoesNotExistException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a new event data store.
 */
export const createEventDataStore: (
  input: CreateEventDataStoreRequest,
) => effect.Effect<
  CreateEventDataStoreResponse,
  | CloudTrailAccessNotEnabledException
  | ConflictException
  | EventDataStoreAlreadyExistsException
  | EventDataStoreMaxLimitExceededException
  | InsufficientDependencyServiceAccessPermissionException
  | InsufficientEncryptionPolicyException
  | InvalidEventSelectorsException
  | InvalidKmsKeyIdException
  | InvalidParameterException
  | InvalidTagParameterException
  | KmsException
  | KmsKeyNotFoundException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | OrganizationNotInAllFeaturesModeException
  | OrganizationsNotInUseException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventDataStoreRequest,
  output: CreateEventDataStoreResponse,
  errors: [
    CloudTrailAccessNotEnabledException,
    ConflictException,
    EventDataStoreAlreadyExistsException,
    EventDataStoreMaxLimitExceededException,
    InsufficientDependencyServiceAccessPermissionException,
    InsufficientEncryptionPolicyException,
    InvalidEventSelectorsException,
    InvalidKmsKeyIdException,
    InvalidParameterException,
    InvalidTagParameterException,
    KmsException,
    KmsKeyNotFoundException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    ThrottlingException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates an event data store. The required `EventDataStore` value is an ARN or
 * the ID portion of the ARN. Other parameters are optional, but at least one optional
 * parameter must be specified, or CloudTrail throws an error.
 * `RetentionPeriod` is in days, and valid values are integers between 7 and
 * 3653 if the `BillingMode` is set to `EXTENDABLE_RETENTION_PRICING`, or between 7 and 2557 if `BillingMode` is set to `FIXED_RETENTION_PRICING`. By default, `TerminationProtection` is enabled.
 *
 * For event data stores for CloudTrail events, `AdvancedEventSelectors`
 * includes or excludes management, data, or network activity events in your event data store. For more
 * information about `AdvancedEventSelectors`, see AdvancedEventSelectors.
 *
 * For event data stores for CloudTrail Insights events, Config configuration items, Audit Manager evidence, or non-Amazon Web Services events,
 * `AdvancedEventSelectors` includes events of that type in your event data store.
 */
export const updateEventDataStore: (
  input: UpdateEventDataStoreRequest,
) => effect.Effect<
  UpdateEventDataStoreResponse,
  | CloudTrailAccessNotEnabledException
  | ConflictException
  | EventDataStoreAlreadyExistsException
  | EventDataStoreARNInvalidException
  | EventDataStoreHasOngoingImportException
  | EventDataStoreNotFoundException
  | InactiveEventDataStoreException
  | InsufficientDependencyServiceAccessPermissionException
  | InsufficientEncryptionPolicyException
  | InvalidEventSelectorsException
  | InvalidInsightSelectorsException
  | InvalidKmsKeyIdException
  | InvalidParameterException
  | KmsException
  | KmsKeyNotFoundException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | OrganizationNotInAllFeaturesModeException
  | OrganizationsNotInUseException
  | ThrottlingException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventDataStoreRequest,
  output: UpdateEventDataStoreResponse,
  errors: [
    CloudTrailAccessNotEnabledException,
    ConflictException,
    EventDataStoreAlreadyExistsException,
    EventDataStoreARNInvalidException,
    EventDataStoreHasOngoingImportException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientDependencyServiceAccessPermissionException,
    InsufficientEncryptionPolicyException,
    InvalidEventSelectorsException,
    InvalidInsightSelectorsException,
    InvalidKmsKeyIdException,
    InvalidParameterException,
    KmsException,
    KmsKeyNotFoundException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    ThrottlingException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates trail settings that control what events you are logging, and how to handle log
 * files. Changes to a trail do not require stopping the CloudTrail service. Use this
 * action to designate an existing bucket for log delivery. If the existing bucket has
 * previously been a target for CloudTrail log files, an IAM policy
 * exists for the bucket. `UpdateTrail` must be called from the Region in which the
 * trail was created; otherwise, an `InvalidHomeRegionException` is thrown.
 */
export const updateTrail: (
  input: UpdateTrailRequest,
) => effect.Effect<
  UpdateTrailResponse,
  | CloudTrailAccessNotEnabledException
  | CloudTrailARNInvalidException
  | CloudTrailInvalidClientTokenIdException
  | CloudWatchLogsDeliveryUnavailableException
  | ConflictException
  | InsufficientDependencyServiceAccessPermissionException
  | InsufficientEncryptionPolicyException
  | InsufficientS3BucketPolicyException
  | InsufficientSnsTopicPolicyException
  | InvalidCloudWatchLogsLogGroupArnException
  | InvalidCloudWatchLogsRoleArnException
  | InvalidEventSelectorsException
  | InvalidHomeRegionException
  | InvalidKmsKeyIdException
  | InvalidParameterCombinationException
  | InvalidParameterException
  | InvalidS3BucketNameException
  | InvalidS3PrefixException
  | InvalidSnsTopicNameException
  | InvalidTrailNameException
  | KmsException
  | KmsKeyDisabledException
  | KmsKeyNotFoundException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | OrganizationNotInAllFeaturesModeException
  | OrganizationsNotInUseException
  | S3BucketDoesNotExistException
  | ThrottlingException
  | TrailNotFoundException
  | TrailNotProvidedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrailRequest,
  output: UpdateTrailResponse,
  errors: [
    CloudTrailAccessNotEnabledException,
    CloudTrailARNInvalidException,
    CloudTrailInvalidClientTokenIdException,
    CloudWatchLogsDeliveryUnavailableException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InsufficientEncryptionPolicyException,
    InsufficientS3BucketPolicyException,
    InsufficientSnsTopicPolicyException,
    InvalidCloudWatchLogsLogGroupArnException,
    InvalidCloudWatchLogsRoleArnException,
    InvalidEventSelectorsException,
    InvalidHomeRegionException,
    InvalidKmsKeyIdException,
    InvalidParameterCombinationException,
    InvalidParameterException,
    InvalidS3BucketNameException,
    InvalidS3PrefixException,
    InvalidSnsTopicNameException,
    InvalidTrailNameException,
    KmsException,
    KmsKeyDisabledException,
    KmsKeyNotFoundException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    S3BucketDoesNotExistException,
    ThrottlingException,
    TrailNotFoundException,
    TrailNotProvidedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a trail that specifies the settings for delivery of log data to an Amazon S3 bucket.
 */
export const createTrail: (
  input: CreateTrailRequest,
) => effect.Effect<
  CreateTrailResponse,
  | CloudTrailAccessNotEnabledException
  | CloudTrailInvalidClientTokenIdException
  | CloudWatchLogsDeliveryUnavailableException
  | ConflictException
  | InsufficientDependencyServiceAccessPermissionException
  | InsufficientEncryptionPolicyException
  | InsufficientS3BucketPolicyException
  | InsufficientSnsTopicPolicyException
  | InvalidCloudWatchLogsLogGroupArnException
  | InvalidCloudWatchLogsRoleArnException
  | InvalidKmsKeyIdException
  | InvalidParameterCombinationException
  | InvalidParameterException
  | InvalidS3BucketNameException
  | InvalidS3PrefixException
  | InvalidSnsTopicNameException
  | InvalidTagParameterException
  | InvalidTrailNameException
  | KmsException
  | KmsKeyDisabledException
  | KmsKeyNotFoundException
  | MaximumNumberOfTrailsExceededException
  | NoManagementAccountSLRExistsException
  | NotOrganizationMasterAccountException
  | OperationNotPermittedException
  | OrganizationNotInAllFeaturesModeException
  | OrganizationsNotInUseException
  | S3BucketDoesNotExistException
  | TagsLimitExceededException
  | ThrottlingException
  | TrailAlreadyExistsException
  | TrailNotProvidedException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrailRequest,
  output: CreateTrailResponse,
  errors: [
    CloudTrailAccessNotEnabledException,
    CloudTrailInvalidClientTokenIdException,
    CloudWatchLogsDeliveryUnavailableException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InsufficientEncryptionPolicyException,
    InsufficientS3BucketPolicyException,
    InsufficientSnsTopicPolicyException,
    InvalidCloudWatchLogsLogGroupArnException,
    InvalidCloudWatchLogsRoleArnException,
    InvalidKmsKeyIdException,
    InvalidParameterCombinationException,
    InvalidParameterException,
    InvalidS3BucketNameException,
    InvalidS3PrefixException,
    InvalidSnsTopicNameException,
    InvalidTagParameterException,
    InvalidTrailNameException,
    KmsException,
    KmsKeyDisabledException,
    KmsKeyNotFoundException,
    MaximumNumberOfTrailsExceededException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    S3BucketDoesNotExistException,
    TagsLimitExceededException,
    ThrottlingException,
    TrailAlreadyExistsException,
    TrailNotProvidedException,
    UnsupportedOperationException,
  ],
}));
