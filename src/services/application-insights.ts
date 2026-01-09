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
  sdkId: "Application Insights",
  serviceShapeName: "EC2WindowsBarleyService",
});
const auth = T.AwsAuthSigv4({ name: "applicationinsights" });
const ver = T.ServiceVersion("2018-11-25");
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
              `https://applicationinsights-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://applicationinsights-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://applicationinsights.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://applicationinsights.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceGroupName = string;
export type ComponentName = string;
export type OpsCenterEnabled = boolean;
export type CWEMonitorEnabled = boolean;
export type OpsItemSNSTopicArn = string;
export type SNSNotificationArn = string;
export type AutoConfigEnabled = boolean;
export type AutoCreate = boolean;
export type AttachMissingPermission = boolean;
export type CustomComponentName = string;
export type ResourceARN = string;
export type LogPatternSetName = string;
export type LogPatternName = string;
export type LogPatternRegex = string;
export type LogPatternRank = number;
export type AccountId = string;
export type WorkloadName = string;
export type ObservationId = string;
export type ProblemId = string;
export type WorkloadId = string;
export type MaxEntities = number;
export type PaginationToken = string;
export type StartTime = Date;
export type EndTime = Date;
export type AmazonResourceName = string;
export type TagKey = string;
export type RemoveSNSTopic = boolean;
export type Monitor = boolean;
export type ComponentConfiguration = string;
export type TagValue = string;
export type ErrorMsg = string;
export type Remarks = string;
export type LifeCycle = string;
export type ResourceType = string;
export type SourceType = string;
export type SourceARN = string;
export type LogGroup = string;
export type LineTime = Date;
export type LogText = string;
export type MetricNamespace = string;
export type MetricName = string;
export type Unit = string;
export type Value = number;
export type CloudWatchEventId = string;
export type CloudWatchEventDetailType = string;
export type HealthEventArn = string;
export type HealthService = string;
export type HealthEventTypeCode = string;
export type HealthEventTypeCategory = string;
export type HealthEventDescription = string;
export type CodeDeployDeploymentId = string;
export type CodeDeployDeploymentGroup = string;
export type CodeDeployState = string;
export type CodeDeployApplication = string;
export type CodeDeployInstanceGroupId = string;
export type Ec2State = string;
export type RdsEventCategories = string;
export type RdsEventMessage = string;
export type S3EventName = string;
export type StatesExecutionArn = string;
export type StatesArn = string;
export type StatesStatus = string;
export type StatesInput = string;
export type EbsEvent = string;
export type EbsResult = string;
export type EbsCause = string;
export type EbsRequestId = string;
export type XRayFaultPercent = number;
export type XRayThrottlePercent = number;
export type XRayErrorPercent = number;
export type XRayRequestCount = number;
export type XRayRequestAverageLatency = number;
export type XRayNodeName = string;
export type XRayNodeType = string;
export type Title = string;
export type ShortName = string;
export type Insights = string;
export type AffectedResource = string;
export type RecurringCount = number;
export type LastRecurrenceTime = Date;
export type ConfigurationEventMonitoredResourceARN = string;
export type ConfigurationEventTime = Date;
export type ConfigurationEventDetail = string;
export type ConfigurationEventResourceName = string;
export type MissingWorkloadConfig = boolean;
export type ExceptionMessage = string;
export type MetaDataKey = string;
export type MetaDataValue = string;

//# Schemas
export type GroupingType = "ACCOUNT_BASED" | (string & {});
export const GroupingType = S.String;
export type ResourceList = string[];
export const ResourceList = S.Array(S.String);
export type Tier =
  | "CUSTOM"
  | "DEFAULT"
  | "DOT_NET_CORE"
  | "DOT_NET_WORKER"
  | "DOT_NET_WEB_TIER"
  | "DOT_NET_WEB"
  | "SQL_SERVER"
  | "SQL_SERVER_ALWAYSON_AVAILABILITY_GROUP"
  | "MYSQL"
  | "POSTGRESQL"
  | "JAVA_JMX"
  | "ORACLE"
  | "SAP_HANA_MULTI_NODE"
  | "SAP_HANA_SINGLE_NODE"
  | "SAP_HANA_HIGH_AVAILABILITY"
  | "SAP_ASE_SINGLE_NODE"
  | "SAP_ASE_HIGH_AVAILABILITY"
  | "SQL_SERVER_FAILOVER_CLUSTER_INSTANCE"
  | "SHAREPOINT"
  | "ACTIVE_DIRECTORY"
  | "SAP_NETWEAVER_STANDARD"
  | "SAP_NETWEAVER_DISTRIBUTED"
  | "SAP_NETWEAVER_HIGH_AVAILABILITY"
  | (string & {});
export const Tier = S.String;
export type RecommendationType =
  | "INFRA_ONLY"
  | "WORKLOAD_ONLY"
  | "ALL"
  | (string & {});
export const RecommendationType = S.String;
export type ConfigurationEventStatus =
  | "INFO"
  | "WARN"
  | "ERROR"
  | (string & {});
export const ConfigurationEventStatus = S.String;
export type Visibility = "IGNORED" | "VISIBLE" | (string & {});
export const Visibility = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type UpdateStatus = "RESOLVED" | (string & {});
export const UpdateStatus = S.String;
export interface CreateComponentRequest {
  ResourceGroupName: string;
  ComponentName: string;
  ResourceList: string[];
}
export const CreateComponentRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    ResourceList: ResourceList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateComponentRequest",
}) as any as S.Schema<CreateComponentRequest>;
export interface CreateComponentResponse {}
export const CreateComponentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateComponentResponse",
}) as any as S.Schema<CreateComponentResponse>;
export interface CreateLogPatternRequest {
  ResourceGroupName: string;
  PatternSetName: string;
  PatternName: string;
  Pattern: string;
  Rank: number;
}
export const CreateLogPatternRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
    Pattern: S.String,
    Rank: S.Number,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLogPatternRequest",
}) as any as S.Schema<CreateLogPatternRequest>;
export interface DeleteApplicationRequest {
  ResourceGroupName: string;
}
export const DeleteApplicationRequest = S.suspend(() =>
  S.Struct({ ResourceGroupName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteApplicationRequest",
}) as any as S.Schema<DeleteApplicationRequest>;
export interface DeleteApplicationResponse {}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface DeleteComponentRequest {
  ResourceGroupName: string;
  ComponentName: string;
}
export const DeleteComponentRequest = S.suspend(() =>
  S.Struct({ ResourceGroupName: S.String, ComponentName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteComponentRequest",
}) as any as S.Schema<DeleteComponentRequest>;
export interface DeleteComponentResponse {}
export const DeleteComponentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteComponentResponse",
}) as any as S.Schema<DeleteComponentResponse>;
export interface DeleteLogPatternRequest {
  ResourceGroupName: string;
  PatternSetName: string;
  PatternName: string;
}
export const DeleteLogPatternRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteLogPatternRequest",
}) as any as S.Schema<DeleteLogPatternRequest>;
export interface DeleteLogPatternResponse {}
export const DeleteLogPatternResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLogPatternResponse",
}) as any as S.Schema<DeleteLogPatternResponse>;
export interface DescribeApplicationRequest {
  ResourceGroupName: string;
  AccountId?: string;
}
export const DescribeApplicationRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeApplicationRequest",
}) as any as S.Schema<DescribeApplicationRequest>;
export interface DescribeComponentRequest {
  ResourceGroupName: string;
  ComponentName: string;
  AccountId?: string;
}
export const DescribeComponentRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeComponentRequest",
}) as any as S.Schema<DescribeComponentRequest>;
export interface DescribeComponentConfigurationRequest {
  ResourceGroupName: string;
  ComponentName: string;
  AccountId?: string;
}
export const DescribeComponentConfigurationRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeComponentConfigurationRequest",
}) as any as S.Schema<DescribeComponentConfigurationRequest>;
export interface DescribeComponentConfigurationRecommendationRequest {
  ResourceGroupName: string;
  ComponentName: string;
  Tier: Tier;
  WorkloadName?: string;
  RecommendationType?: RecommendationType;
}
export const DescribeComponentConfigurationRecommendationRequest = S.suspend(
  () =>
    S.Struct({
      ResourceGroupName: S.String,
      ComponentName: S.String,
      Tier: Tier,
      WorkloadName: S.optional(S.String),
      RecommendationType: S.optional(RecommendationType),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "DescribeComponentConfigurationRecommendationRequest",
}) as any as S.Schema<DescribeComponentConfigurationRecommendationRequest>;
export interface DescribeLogPatternRequest {
  ResourceGroupName: string;
  PatternSetName: string;
  PatternName: string;
  AccountId?: string;
}
export const DescribeLogPatternRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLogPatternRequest",
}) as any as S.Schema<DescribeLogPatternRequest>;
export interface DescribeObservationRequest {
  ObservationId: string;
  AccountId?: string;
}
export const DescribeObservationRequest = S.suspend(() =>
  S.Struct({ ObservationId: S.String, AccountId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeObservationRequest",
}) as any as S.Schema<DescribeObservationRequest>;
export interface DescribeProblemRequest {
  ProblemId: string;
  AccountId?: string;
}
export const DescribeProblemRequest = S.suspend(() =>
  S.Struct({ ProblemId: S.String, AccountId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProblemRequest",
}) as any as S.Schema<DescribeProblemRequest>;
export interface DescribeProblemObservationsRequest {
  ProblemId: string;
  AccountId?: string;
}
export const DescribeProblemObservationsRequest = S.suspend(() =>
  S.Struct({ ProblemId: S.String, AccountId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProblemObservationsRequest",
}) as any as S.Schema<DescribeProblemObservationsRequest>;
export interface DescribeWorkloadRequest {
  ResourceGroupName: string;
  ComponentName: string;
  WorkloadId: string;
  AccountId?: string;
}
export const DescribeWorkloadRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadId: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeWorkloadRequest",
}) as any as S.Schema<DescribeWorkloadRequest>;
export interface ListApplicationsRequest {
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListApplicationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListApplicationsRequest",
}) as any as S.Schema<ListApplicationsRequest>;
export interface ListComponentsRequest {
  ResourceGroupName: string;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListComponentsRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListComponentsRequest",
}) as any as S.Schema<ListComponentsRequest>;
export interface ListConfigurationHistoryRequest {
  ResourceGroupName?: string;
  StartTime?: Date;
  EndTime?: Date;
  EventStatus?: ConfigurationEventStatus;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListConfigurationHistoryRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventStatus: S.optional(ConfigurationEventStatus),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListConfigurationHistoryRequest",
}) as any as S.Schema<ListConfigurationHistoryRequest>;
export interface ListLogPatternsRequest {
  ResourceGroupName: string;
  PatternSetName?: string;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListLogPatternsRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    PatternSetName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLogPatternsRequest",
}) as any as S.Schema<ListLogPatternsRequest>;
export interface ListLogPatternSetsRequest {
  ResourceGroupName: string;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListLogPatternSetsRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLogPatternSetsRequest",
}) as any as S.Schema<ListLogPatternSetsRequest>;
export interface ListProblemsRequest {
  AccountId?: string;
  ResourceGroupName?: string;
  StartTime?: Date;
  EndTime?: Date;
  MaxResults?: number;
  NextToken?: string;
  ComponentName?: string;
  Visibility?: Visibility;
}
export const ListProblemsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    ResourceGroupName: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ComponentName: S.optional(S.String),
    Visibility: S.optional(Visibility),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProblemsRequest",
}) as any as S.Schema<ListProblemsRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListWorkloadsRequest {
  ResourceGroupName: string;
  ComponentName: string;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListWorkloadsRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWorkloadsRequest",
}) as any as S.Schema<ListWorkloadsRequest>;
export interface RemoveWorkloadRequest {
  ResourceGroupName: string;
  ComponentName: string;
  WorkloadId: string;
}
export const RemoveWorkloadRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RemoveWorkloadRequest",
}) as any as S.Schema<RemoveWorkloadRequest>;
export interface RemoveWorkloadResponse {}
export const RemoveWorkloadResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "RemoveWorkloadResponse" },
) as any as S.Schema<RemoveWorkloadResponse>;
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
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
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
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateApplicationRequest {
  ResourceGroupName: string;
  OpsCenterEnabled?: boolean;
  CWEMonitorEnabled?: boolean;
  OpsItemSNSTopicArn?: string;
  SNSNotificationArn?: string;
  RemoveSNSTopic?: boolean;
  AutoConfigEnabled?: boolean;
  AttachMissingPermission?: boolean;
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    OpsCenterEnabled: S.optional(S.Boolean),
    CWEMonitorEnabled: S.optional(S.Boolean),
    OpsItemSNSTopicArn: S.optional(S.String),
    SNSNotificationArn: S.optional(S.String),
    RemoveSNSTopic: S.optional(S.Boolean),
    AutoConfigEnabled: S.optional(S.Boolean),
    AttachMissingPermission: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateApplicationRequest",
}) as any as S.Schema<UpdateApplicationRequest>;
export interface UpdateComponentRequest {
  ResourceGroupName: string;
  ComponentName: string;
  NewComponentName?: string;
  ResourceList?: string[];
}
export const UpdateComponentRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    NewComponentName: S.optional(S.String),
    ResourceList: S.optional(ResourceList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateComponentRequest",
}) as any as S.Schema<UpdateComponentRequest>;
export interface UpdateComponentResponse {}
export const UpdateComponentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateComponentResponse",
}) as any as S.Schema<UpdateComponentResponse>;
export interface UpdateComponentConfigurationRequest {
  ResourceGroupName: string;
  ComponentName: string;
  Monitor?: boolean;
  Tier?: Tier;
  ComponentConfiguration?: string;
  AutoConfigEnabled?: boolean;
}
export const UpdateComponentConfigurationRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    Monitor: S.optional(S.Boolean),
    Tier: S.optional(Tier),
    ComponentConfiguration: S.optional(S.String),
    AutoConfigEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateComponentConfigurationRequest",
}) as any as S.Schema<UpdateComponentConfigurationRequest>;
export interface UpdateComponentConfigurationResponse {}
export const UpdateComponentConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateComponentConfigurationResponse",
}) as any as S.Schema<UpdateComponentConfigurationResponse>;
export interface UpdateLogPatternRequest {
  ResourceGroupName: string;
  PatternSetName: string;
  PatternName: string;
  Pattern?: string;
  Rank?: number;
}
export const UpdateLogPatternRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
    Pattern: S.optional(S.String),
    Rank: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLogPatternRequest",
}) as any as S.Schema<UpdateLogPatternRequest>;
export interface UpdateProblemRequest {
  ProblemId: string;
  UpdateStatus?: UpdateStatus;
  Visibility?: Visibility;
}
export const UpdateProblemRequest = S.suspend(() =>
  S.Struct({
    ProblemId: S.String,
    UpdateStatus: S.optional(UpdateStatus),
    Visibility: S.optional(Visibility),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProblemRequest",
}) as any as S.Schema<UpdateProblemRequest>;
export interface UpdateProblemResponse {}
export const UpdateProblemResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateProblemResponse",
}) as any as S.Schema<UpdateProblemResponse>;
export interface WorkloadConfiguration {
  WorkloadName?: string;
  Tier?: Tier;
  Configuration?: string;
}
export const WorkloadConfiguration = S.suspend(() =>
  S.Struct({
    WorkloadName: S.optional(S.String),
    Tier: S.optional(Tier),
    Configuration: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkloadConfiguration",
}) as any as S.Schema<WorkloadConfiguration>;
export interface UpdateWorkloadRequest {
  ResourceGroupName: string;
  ComponentName: string;
  WorkloadId?: string;
  WorkloadConfiguration: WorkloadConfiguration;
}
export const UpdateWorkloadRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadId: S.optional(S.String),
    WorkloadConfiguration: WorkloadConfiguration,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateWorkloadRequest",
}) as any as S.Schema<UpdateWorkloadRequest>;
export type DiscoveryType =
  | "RESOURCE_GROUP_BASED"
  | "ACCOUNT_BASED"
  | (string & {});
export const DiscoveryType = S.String;
export interface ApplicationInfo {
  AccountId?: string;
  ResourceGroupName?: string;
  LifeCycle?: string;
  OpsItemSNSTopicArn?: string;
  SNSNotificationArn?: string;
  OpsCenterEnabled?: boolean;
  CWEMonitorEnabled?: boolean;
  Remarks?: string;
  AutoConfigEnabled?: boolean;
  DiscoveryType?: DiscoveryType;
  AttachMissingPermission?: boolean;
}
export const ApplicationInfo = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    ResourceGroupName: S.optional(S.String),
    LifeCycle: S.optional(S.String),
    OpsItemSNSTopicArn: S.optional(S.String),
    SNSNotificationArn: S.optional(S.String),
    OpsCenterEnabled: S.optional(S.Boolean),
    CWEMonitorEnabled: S.optional(S.Boolean),
    Remarks: S.optional(S.String),
    AutoConfigEnabled: S.optional(S.Boolean),
    DiscoveryType: S.optional(DiscoveryType),
    AttachMissingPermission: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ApplicationInfo",
}) as any as S.Schema<ApplicationInfo>;
export type ApplicationInfoList = ApplicationInfo[];
export const ApplicationInfoList = S.Array(ApplicationInfo);
export type OsType = "WINDOWS" | "LINUX" | (string & {});
export const OsType = S.String;
export type WorkloadMetaData = { [key: string]: string | undefined };
export const WorkloadMetaData = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type DetectedWorkload = {
  [key in Tier]?: { [key: string]: string | undefined };
};
export const DetectedWorkload = S.partial(
  S.Record({ key: Tier, value: S.UndefinedOr(WorkloadMetaData) }),
);
export interface ApplicationComponent {
  ComponentName?: string;
  ComponentRemarks?: string;
  ResourceType?: string;
  OsType?: OsType;
  Tier?: Tier;
  Monitor?: boolean;
  DetectedWorkload?: {
    [key: string]: { [key: string]: string | undefined } | undefined;
  };
}
export const ApplicationComponent = S.suspend(() =>
  S.Struct({
    ComponentName: S.optional(S.String),
    ComponentRemarks: S.optional(S.String),
    ResourceType: S.optional(S.String),
    OsType: S.optional(OsType),
    Tier: S.optional(Tier),
    Monitor: S.optional(S.Boolean),
    DetectedWorkload: S.optional(DetectedWorkload),
  }),
).annotations({
  identifier: "ApplicationComponent",
}) as any as S.Schema<ApplicationComponent>;
export type ApplicationComponentList = ApplicationComponent[];
export const ApplicationComponentList = S.Array(ApplicationComponent);
export interface LogPattern {
  PatternSetName?: string;
  PatternName?: string;
  Pattern?: string;
  Rank?: number;
}
export const LogPattern = S.suspend(() =>
  S.Struct({
    PatternSetName: S.optional(S.String),
    PatternName: S.optional(S.String),
    Pattern: S.optional(S.String),
    Rank: S.optional(S.Number),
  }),
).annotations({ identifier: "LogPattern" }) as any as S.Schema<LogPattern>;
export type LogPatternList = LogPattern[];
export const LogPatternList = S.Array(LogPattern);
export type LogPatternSetList = string[];
export const LogPatternSetList = S.Array(S.String);
export type Status =
  | "IGNORE"
  | "RESOLVED"
  | "PENDING"
  | "RECURRING"
  | "RECOVERING"
  | (string & {});
export const Status = S.String;
export type SeverityLevel =
  | "Informative"
  | "Low"
  | "Medium"
  | "High"
  | (string & {});
export const SeverityLevel = S.String;
export type FeedbackKey = "INSIGHTS_FEEDBACK" | (string & {});
export const FeedbackKey = S.String;
export type FeedbackValue =
  | "NOT_SPECIFIED"
  | "USEFUL"
  | "NOT_USEFUL"
  | (string & {});
export const FeedbackValue = S.String;
export type Feedback = { [key in FeedbackKey]?: FeedbackValue };
export const Feedback = S.partial(
  S.Record({ key: FeedbackKey, value: S.UndefinedOr(FeedbackValue) }),
);
export type ResolutionMethod =
  | "MANUAL"
  | "AUTOMATIC"
  | "UNRESOLVED"
  | (string & {});
export const ResolutionMethod = S.String;
export interface Problem {
  Id?: string;
  Title?: string;
  ShortName?: string;
  Insights?: string;
  Status?: Status;
  AffectedResource?: string;
  StartTime?: Date;
  EndTime?: Date;
  SeverityLevel?: SeverityLevel;
  AccountId?: string;
  ResourceGroupName?: string;
  Feedback?: { [key: string]: FeedbackValue | undefined };
  RecurringCount?: number;
  LastRecurrenceTime?: Date;
  Visibility?: Visibility;
  ResolutionMethod?: ResolutionMethod;
}
export const Problem = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Title: S.optional(S.String),
    ShortName: S.optional(S.String),
    Insights: S.optional(S.String),
    Status: S.optional(Status),
    AffectedResource: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SeverityLevel: S.optional(SeverityLevel),
    AccountId: S.optional(S.String),
    ResourceGroupName: S.optional(S.String),
    Feedback: S.optional(Feedback),
    RecurringCount: S.optional(S.Number),
    LastRecurrenceTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Visibility: S.optional(Visibility),
    ResolutionMethod: S.optional(ResolutionMethod),
  }),
).annotations({ identifier: "Problem" }) as any as S.Schema<Problem>;
export type ProblemList = Problem[];
export const ProblemList = S.Array(Problem);
export interface AddWorkloadRequest {
  ResourceGroupName: string;
  ComponentName: string;
  WorkloadConfiguration: WorkloadConfiguration;
}
export const AddWorkloadRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadConfiguration: WorkloadConfiguration,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AddWorkloadRequest",
}) as any as S.Schema<AddWorkloadRequest>;
export interface CreateApplicationRequest {
  ResourceGroupName?: string;
  OpsCenterEnabled?: boolean;
  CWEMonitorEnabled?: boolean;
  OpsItemSNSTopicArn?: string;
  SNSNotificationArn?: string;
  Tags?: Tag[];
  AutoConfigEnabled?: boolean;
  AutoCreate?: boolean;
  GroupingType?: GroupingType;
  AttachMissingPermission?: boolean;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    OpsCenterEnabled: S.optional(S.Boolean),
    CWEMonitorEnabled: S.optional(S.Boolean),
    OpsItemSNSTopicArn: S.optional(S.String),
    SNSNotificationArn: S.optional(S.String),
    Tags: S.optional(TagList),
    AutoConfigEnabled: S.optional(S.Boolean),
    AutoCreate: S.optional(S.Boolean),
    GroupingType: S.optional(GroupingType),
    AttachMissingPermission: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface DescribeComponentConfigurationResponse {
  Monitor?: boolean;
  Tier?: Tier;
  ComponentConfiguration?: string;
}
export const DescribeComponentConfigurationResponse = S.suspend(() =>
  S.Struct({
    Monitor: S.optional(S.Boolean),
    Tier: S.optional(Tier),
    ComponentConfiguration: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeComponentConfigurationResponse",
}) as any as S.Schema<DescribeComponentConfigurationResponse>;
export interface DescribeComponentConfigurationRecommendationResponse {
  ComponentConfiguration?: string;
}
export const DescribeComponentConfigurationRecommendationResponse = S.suspend(
  () => S.Struct({ ComponentConfiguration: S.optional(S.String) }),
).annotations({
  identifier: "DescribeComponentConfigurationRecommendationResponse",
}) as any as S.Schema<DescribeComponentConfigurationRecommendationResponse>;
export interface DescribeLogPatternResponse {
  ResourceGroupName?: string;
  AccountId?: string;
  LogPattern?: LogPattern;
}
export const DescribeLogPatternResponse = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    AccountId: S.optional(S.String),
    LogPattern: S.optional(LogPattern),
  }),
).annotations({
  identifier: "DescribeLogPatternResponse",
}) as any as S.Schema<DescribeLogPatternResponse>;
export interface DescribeWorkloadResponse {
  WorkloadId?: string;
  WorkloadRemarks?: string;
  WorkloadConfiguration?: WorkloadConfiguration;
}
export const DescribeWorkloadResponse = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadRemarks: S.optional(S.String),
    WorkloadConfiguration: S.optional(WorkloadConfiguration),
  }),
).annotations({
  identifier: "DescribeWorkloadResponse",
}) as any as S.Schema<DescribeWorkloadResponse>;
export interface ListApplicationsResponse {
  ApplicationInfoList?: ApplicationInfo[];
  NextToken?: string;
}
export const ListApplicationsResponse = S.suspend(() =>
  S.Struct({
    ApplicationInfoList: S.optional(ApplicationInfoList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationsResponse",
}) as any as S.Schema<ListApplicationsResponse>;
export interface ListComponentsResponse {
  ApplicationComponentList?: ApplicationComponent[];
  NextToken?: string;
}
export const ListComponentsResponse = S.suspend(() =>
  S.Struct({
    ApplicationComponentList: S.optional(ApplicationComponentList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListComponentsResponse",
}) as any as S.Schema<ListComponentsResponse>;
export interface ListLogPatternsResponse {
  ResourceGroupName?: string;
  AccountId?: string;
  LogPatterns?: LogPattern[];
  NextToken?: string;
}
export const ListLogPatternsResponse = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    AccountId: S.optional(S.String),
    LogPatterns: S.optional(LogPatternList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLogPatternsResponse",
}) as any as S.Schema<ListLogPatternsResponse>;
export interface ListLogPatternSetsResponse {
  ResourceGroupName?: string;
  AccountId?: string;
  LogPatternSets?: string[];
  NextToken?: string;
}
export const ListLogPatternSetsResponse = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    AccountId: S.optional(S.String),
    LogPatternSets: S.optional(LogPatternSetList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLogPatternSetsResponse",
}) as any as S.Schema<ListLogPatternSetsResponse>;
export interface ListProblemsResponse {
  ProblemList?: Problem[];
  NextToken?: string;
  ResourceGroupName?: string;
  AccountId?: string;
}
export const ListProblemsResponse = S.suspend(() =>
  S.Struct({
    ProblemList: S.optional(ProblemList),
    NextToken: S.optional(S.String),
    ResourceGroupName: S.optional(S.String),
    AccountId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProblemsResponse",
}) as any as S.Schema<ListProblemsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateApplicationResponse {
  ApplicationInfo?: ApplicationInfo;
}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({ ApplicationInfo: S.optional(ApplicationInfo) }),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;
export interface UpdateLogPatternResponse {
  ResourceGroupName?: string;
  LogPattern?: LogPattern;
}
export const UpdateLogPatternResponse = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    LogPattern: S.optional(LogPattern),
  }),
).annotations({
  identifier: "UpdateLogPatternResponse",
}) as any as S.Schema<UpdateLogPatternResponse>;
export interface UpdateWorkloadResponse {
  WorkloadId?: string;
  WorkloadConfiguration?: WorkloadConfiguration;
}
export const UpdateWorkloadResponse = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadConfiguration: S.optional(WorkloadConfiguration),
  }),
).annotations({
  identifier: "UpdateWorkloadResponse",
}) as any as S.Schema<UpdateWorkloadResponse>;
export type LogFilter = "ERROR" | "WARN" | "INFO" | (string & {});
export const LogFilter = S.String;
export type CloudWatchEventSource =
  | "EC2"
  | "CODE_DEPLOY"
  | "HEALTH"
  | "RDS"
  | (string & {});
export const CloudWatchEventSource = S.String;
export interface Observation {
  Id?: string;
  StartTime?: Date;
  EndTime?: Date;
  SourceType?: string;
  SourceARN?: string;
  LogGroup?: string;
  LineTime?: Date;
  LogText?: string;
  LogFilter?: LogFilter;
  MetricNamespace?: string;
  MetricName?: string;
  Unit?: string;
  Value?: number;
  CloudWatchEventId?: string;
  CloudWatchEventSource?: CloudWatchEventSource;
  CloudWatchEventDetailType?: string;
  HealthEventArn?: string;
  HealthService?: string;
  HealthEventTypeCode?: string;
  HealthEventTypeCategory?: string;
  HealthEventDescription?: string;
  CodeDeployDeploymentId?: string;
  CodeDeployDeploymentGroup?: string;
  CodeDeployState?: string;
  CodeDeployApplication?: string;
  CodeDeployInstanceGroupId?: string;
  Ec2State?: string;
  RdsEventCategories?: string;
  RdsEventMessage?: string;
  S3EventName?: string;
  StatesExecutionArn?: string;
  StatesArn?: string;
  StatesStatus?: string;
  StatesInput?: string;
  EbsEvent?: string;
  EbsResult?: string;
  EbsCause?: string;
  EbsRequestId?: string;
  XRayFaultPercent?: number;
  XRayThrottlePercent?: number;
  XRayErrorPercent?: number;
  XRayRequestCount?: number;
  XRayRequestAverageLatency?: number;
  XRayNodeName?: string;
  XRayNodeType?: string;
}
export const Observation = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SourceType: S.optional(S.String),
    SourceARN: S.optional(S.String),
    LogGroup: S.optional(S.String),
    LineTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LogText: S.optional(S.String),
    LogFilter: S.optional(LogFilter),
    MetricNamespace: S.optional(S.String),
    MetricName: S.optional(S.String),
    Unit: S.optional(S.String),
    Value: S.optional(S.Number),
    CloudWatchEventId: S.optional(S.String),
    CloudWatchEventSource: S.optional(CloudWatchEventSource),
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
  }),
).annotations({ identifier: "Observation" }) as any as S.Schema<Observation>;
export type ObservationList = Observation[];
export const ObservationList = S.Array(Observation);
export type ConfigurationEventResourceType =
  | "CLOUDWATCH_ALARM"
  | "CLOUDWATCH_LOG"
  | "CLOUDFORMATION"
  | "SSM_ASSOCIATION"
  | (string & {});
export const ConfigurationEventResourceType = S.String;
export interface RelatedObservations {
  ObservationList?: Observation[];
}
export const RelatedObservations = S.suspend(() =>
  S.Struct({ ObservationList: S.optional(ObservationList) }),
).annotations({
  identifier: "RelatedObservations",
}) as any as S.Schema<RelatedObservations>;
export interface ConfigurationEvent {
  ResourceGroupName?: string;
  AccountId?: string;
  MonitoredResourceARN?: string;
  EventStatus?: ConfigurationEventStatus;
  EventResourceType?: ConfigurationEventResourceType;
  EventTime?: Date;
  EventDetail?: string;
  EventResourceName?: string;
}
export const ConfigurationEvent = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    AccountId: S.optional(S.String),
    MonitoredResourceARN: S.optional(S.String),
    EventStatus: S.optional(ConfigurationEventStatus),
    EventResourceType: S.optional(ConfigurationEventResourceType),
    EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventDetail: S.optional(S.String),
    EventResourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigurationEvent",
}) as any as S.Schema<ConfigurationEvent>;
export type ConfigurationEventList = ConfigurationEvent[];
export const ConfigurationEventList = S.Array(ConfigurationEvent);
export interface Workload {
  WorkloadId?: string;
  ComponentName?: string;
  WorkloadName?: string;
  Tier?: Tier;
  WorkloadRemarks?: string;
  MissingWorkloadConfig?: boolean;
}
export const Workload = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    ComponentName: S.optional(S.String),
    WorkloadName: S.optional(S.String),
    Tier: S.optional(Tier),
    WorkloadRemarks: S.optional(S.String),
    MissingWorkloadConfig: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Workload" }) as any as S.Schema<Workload>;
export type WorkloadList = Workload[];
export const WorkloadList = S.Array(Workload);
export interface AddWorkloadResponse {
  WorkloadId?: string;
  WorkloadConfiguration?: WorkloadConfiguration;
}
export const AddWorkloadResponse = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadConfiguration: S.optional(WorkloadConfiguration),
  }),
).annotations({
  identifier: "AddWorkloadResponse",
}) as any as S.Schema<AddWorkloadResponse>;
export interface CreateApplicationResponse {
  ApplicationInfo?: ApplicationInfo;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({ ApplicationInfo: S.optional(ApplicationInfo) }),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface CreateLogPatternResponse {
  LogPattern?: LogPattern;
  ResourceGroupName?: string;
}
export const CreateLogPatternResponse = S.suspend(() =>
  S.Struct({
    LogPattern: S.optional(LogPattern),
    ResourceGroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateLogPatternResponse",
}) as any as S.Schema<CreateLogPatternResponse>;
export interface DescribeApplicationResponse {
  ApplicationInfo?: ApplicationInfo;
}
export const DescribeApplicationResponse = S.suspend(() =>
  S.Struct({ ApplicationInfo: S.optional(ApplicationInfo) }),
).annotations({
  identifier: "DescribeApplicationResponse",
}) as any as S.Schema<DescribeApplicationResponse>;
export interface DescribeObservationResponse {
  Observation?: Observation;
}
export const DescribeObservationResponse = S.suspend(() =>
  S.Struct({ Observation: S.optional(Observation) }),
).annotations({
  identifier: "DescribeObservationResponse",
}) as any as S.Schema<DescribeObservationResponse>;
export interface DescribeProblemObservationsResponse {
  RelatedObservations?: RelatedObservations;
}
export const DescribeProblemObservationsResponse = S.suspend(() =>
  S.Struct({ RelatedObservations: S.optional(RelatedObservations) }),
).annotations({
  identifier: "DescribeProblemObservationsResponse",
}) as any as S.Schema<DescribeProblemObservationsResponse>;
export interface ListConfigurationHistoryResponse {
  EventList?: ConfigurationEvent[];
  NextToken?: string;
}
export const ListConfigurationHistoryResponse = S.suspend(() =>
  S.Struct({
    EventList: S.optional(ConfigurationEventList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfigurationHistoryResponse",
}) as any as S.Schema<ListConfigurationHistoryResponse>;
export interface ListWorkloadsResponse {
  WorkloadList?: Workload[];
  NextToken?: string;
}
export const ListWorkloadsResponse = S.suspend(() =>
  S.Struct({
    WorkloadList: S.optional(WorkloadList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkloadsResponse",
}) as any as S.Schema<ListWorkloadsResponse>;
export interface DescribeProblemResponse {
  Problem?: Problem;
  SNSNotificationArn?: string;
}
export const DescribeProblemResponse = S.suspend(() =>
  S.Struct({
    Problem: S.optional(Problem),
    SNSNotificationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeProblemResponse",
}) as any as S.Schema<DescribeProblemResponse>;
export interface DescribeComponentResponse {
  ApplicationComponent?: ApplicationComponent;
  ResourceList?: string[];
}
export const DescribeComponentResponse = S.suspend(() =>
  S.Struct({
    ApplicationComponent: S.optional(ApplicationComponent),
    ResourceList: S.optional(ResourceList),
  }),
).annotations({
  identifier: "DescribeComponentResponse",
}) as any as S.Schema<DescribeComponentResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServerException", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "BadRequestException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceInUseException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessDeniedException", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class TagsAlreadyExistException extends S.TaggedError<TagsAlreadyExistException>()(
  "TagsAlreadyExistException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists the IDs of the applications that you are monitoring.
 */
export const listApplications: {
  (
    input: ListApplicationsRequest,
  ): effect.Effect<
    ListApplicationsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsRequest,
  ) => stream.Stream<
    ListApplicationsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
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
export const listConfigurationHistory: {
  (
    input: ListConfigurationHistoryRequest,
  ): effect.Effect<
    ListConfigurationHistoryResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationHistoryRequest,
  ) => stream.Stream<
    ListConfigurationHistoryResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationHistoryRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listWorkloads: {
  (
    input: ListWorkloadsRequest,
  ): effect.Effect<
    ListWorkloadsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkloadsRequest,
  ) => stream.Stream<
    ListWorkloadsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkloadsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | ResourceNotFoundException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLogPattern: (
  input: UpdateLogPatternRequest,
) => effect.Effect<
  UpdateLogPatternResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateComponent: (
  input: UpdateComponentRequest,
) => effect.Effect<
  UpdateComponentResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateComponentConfiguration: (
  input: UpdateComponentConfigurationRequest,
) => effect.Effect<
  UpdateComponentConfigurationResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addWorkload: (
  input: AddWorkloadRequest,
) => effect.Effect<
  AddWorkloadResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApplication: (
  input: UpdateApplicationRequest,
) => effect.Effect<
  UpdateApplicationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWorkload: (
  input: UpdateWorkloadRequest,
) => effect.Effect<
  UpdateWorkloadResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteComponent: (
  input: DeleteComponentRequest,
) => effect.Effect<
  DeleteComponentResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeWorkload: (
  input: RemoveWorkloadRequest,
) => effect.Effect<
  RemoveWorkloadResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProblem: (
  input: UpdateProblemRequest,
) => effect.Effect<
  UpdateProblemResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteLogPattern: (
  input: DeleteLogPatternRequest,
) => effect.Effect<
  DeleteLogPatternResponse,
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Removes the specified application from monitoring. Does not delete the
 * application.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => effect.Effect<
  DeleteApplicationResponse,
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeComponentConfiguration: (
  input: DescribeComponentConfigurationRequest,
) => effect.Effect<
  DescribeComponentConfigurationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeComponentConfigurationRecommendation: (
  input: DescribeComponentConfigurationRecommendationRequest,
) => effect.Effect<
  DescribeComponentConfigurationRecommendationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeLogPattern: (
  input: DescribeLogPatternRequest,
) => effect.Effect<
  DescribeLogPatternResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeWorkload: (
  input: DescribeWorkloadRequest,
) => effect.Effect<
  DescribeWorkloadResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listComponents: {
  (
    input: ListComponentsRequest,
  ): effect.Effect<
    ListComponentsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComponentsRequest,
  ) => stream.Stream<
    ListComponentsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComponentsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the log patterns in the specific log `LogPatternSet`.
 */
export const listLogPatterns: {
  (
    input: ListLogPatternsRequest,
  ): effect.Effect<
    ListLogPatternsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLogPatternsRequest,
  ) => stream.Stream<
    ListLogPatternsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLogPatternsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the log pattern sets in the specific application.
 */
export const listLogPatternSets: {
  (
    input: ListLogPatternSetsRequest,
  ): effect.Effect<
    ListLogPatternSetsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLogPatternSetsRequest,
  ) => stream.Stream<
    ListLogPatternSetsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLogPatternSetsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the problems with your application.
 */
export const listProblems: {
  (
    input: ListProblemsRequest,
  ): effect.Effect<
    ListProblemsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProblemsRequest,
  ) => stream.Stream<
    ListProblemsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProblemsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Retrieve a list of the tags (keys and values) that are associated with a specified
 * application. A *tag* is a label that you optionally define and associate
 * with an application. Each tag consists of a required *tag key* and an
 * optional associated *tag value*. A tag key is a general label that acts
 * as a category for more specific tag values. A tag value acts as a descriptor within a tag
 * key.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Creates a custom component by grouping similar standalone instances to monitor.
 */
export const createComponent: (
  input: CreateComponentRequest,
) => effect.Effect<
  CreateComponentResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLogPattern: (
  input: CreateLogPatternRequest,
) => effect.Effect<
  CreateLogPatternResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeApplication: (
  input: DescribeApplicationRequest,
) => effect.Effect<
  DescribeApplicationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeObservation: (
  input: DescribeObservationRequest,
) => effect.Effect<
  DescribeObservationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeProblemObservations: (
  input: DescribeProblemObservationsRequest,
) => effect.Effect<
  DescribeProblemObservationsResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProblemObservationsRequest,
  output: DescribeProblemObservationsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes an application problem.
 */
export const describeProblem: (
  input: DescribeProblemRequest,
) => effect.Effect<
  DescribeProblemResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApplication: (
  input: CreateApplicationRequest,
) => effect.Effect<
  CreateApplicationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | TagsAlreadyExistException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeComponent: (
  input: DescribeComponentRequest,
) => effect.Effect<
  DescribeComponentResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeComponentRequest,
  output: DescribeComponentResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
