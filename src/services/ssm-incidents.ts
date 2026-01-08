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
  sdkId: "SSM Incidents",
  serviceShapeName: "SSMIncidents",
});
const auth = T.AwsAuthSigv4({ name: "ssm-incidents" });
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
              `https://ssm-incidents-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://ssm-incidents-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ssm-incidents.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ssm-incidents.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type FindingId = string;
export type ClientToken = string;
export type ResponsePlanName = string;
export type ResponsePlanDisplayName = string;
export type SsmContactsArn = string;
export type TimelineEventType = string;
export type EventData = string;
export type PolicyId = string;
export type UUID = string;
export type MaxResults = number;
export type NextToken = string;
export type TimelineEventSort = string;
export type SortOrder = string;
export type Policy = string;
export type IncidentTitle = string;
export type Impact = number;
export type TagKey = string;
export type IncidentSummary = string;
export type IncidentRecordStatus = string;
export type DedupeString = string;
export type RegionName = string;
export type TagValue = string;
export type SnsArn = string;
export type GeneratedId = string;
export type IncidentSource = string;
export type RawData = string;
export type ExceptionMessage = string;
export type SseKmsKey = string;
export type RoleArn = string;
export type SsmTargetAccount = string;
export type ItemType = string;
export type ReplicationSetStatus = string;
export type Url = string;
export type MetricDefinition = string;
export type ResourceType = string;
export type ServicePrincipal = string;
export type VariableType = string;
export type RegionStatus = string;
export type ServiceCode = string;

//# Schemas
export type FindingIdList = string[];
export const FindingIdList = S.Array(S.String);
export type EngagementSet = string[];
export const EngagementSet = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface BatchGetIncidentFindingsInput {
  incidentRecordArn: string;
  findingIds: string[];
}
export const BatchGetIncidentFindingsInput = S.suspend(() =>
  S.Struct({ incidentRecordArn: S.String, findingIds: FindingIdList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/batchGetIncidentFindings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetIncidentFindingsInput",
}) as any as S.Schema<BatchGetIncidentFindingsInput>;
export interface DeleteIncidentRecordInput {
  arn: string;
}
export const DeleteIncidentRecordInput = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deleteIncidentRecord" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIncidentRecordInput",
}) as any as S.Schema<DeleteIncidentRecordInput>;
export interface DeleteIncidentRecordOutput {}
export const DeleteIncidentRecordOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIncidentRecordOutput",
}) as any as S.Schema<DeleteIncidentRecordOutput>;
export interface DeleteReplicationSetInput {
  arn: string;
}
export const DeleteReplicationSetInput = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpQuery("arn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deleteReplicationSet" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReplicationSetInput",
}) as any as S.Schema<DeleteReplicationSetInput>;
export interface DeleteReplicationSetOutput {}
export const DeleteReplicationSetOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteReplicationSetOutput",
}) as any as S.Schema<DeleteReplicationSetOutput>;
export interface DeleteResourcePolicyInput {
  resourceArn: string;
  policyId: string;
}
export const DeleteResourcePolicyInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, policyId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deleteResourcePolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourcePolicyInput",
}) as any as S.Schema<DeleteResourcePolicyInput>;
export interface DeleteResourcePolicyOutput {}
export const DeleteResourcePolicyOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourcePolicyOutput",
}) as any as S.Schema<DeleteResourcePolicyOutput>;
export interface DeleteResponsePlanInput {
  arn: string;
}
export const DeleteResponsePlanInput = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deleteResponsePlan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResponsePlanInput",
}) as any as S.Schema<DeleteResponsePlanInput>;
export interface DeleteResponsePlanOutput {}
export const DeleteResponsePlanOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResponsePlanOutput",
}) as any as S.Schema<DeleteResponsePlanOutput>;
export interface DeleteTimelineEventInput {
  incidentRecordArn: string;
  eventId: string;
}
export const DeleteTimelineEventInput = S.suspend(() =>
  S.Struct({ incidentRecordArn: S.String, eventId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deleteTimelineEvent" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTimelineEventInput",
}) as any as S.Schema<DeleteTimelineEventInput>;
export interface DeleteTimelineEventOutput {}
export const DeleteTimelineEventOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTimelineEventOutput",
}) as any as S.Schema<DeleteTimelineEventOutput>;
export interface GetIncidentRecordInput {
  arn: string;
}
export const GetIncidentRecordInput = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpQuery("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/getIncidentRecord" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIncidentRecordInput",
}) as any as S.Schema<GetIncidentRecordInput>;
export interface GetReplicationSetInput {
  arn: string;
}
export const GetReplicationSetInput = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpQuery("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/getReplicationSet" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReplicationSetInput",
}) as any as S.Schema<GetReplicationSetInput>;
export interface GetResourcePoliciesInput {
  resourceArn: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetResourcePoliciesInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getResourcePolicies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePoliciesInput",
}) as any as S.Schema<GetResourcePoliciesInput>;
export interface GetResponsePlanInput {
  arn: string;
}
export const GetResponsePlanInput = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpQuery("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/getResponsePlan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResponsePlanInput",
}) as any as S.Schema<GetResponsePlanInput>;
export interface GetTimelineEventInput {
  incidentRecordArn: string;
  eventId: string;
}
export const GetTimelineEventInput = S.suspend(() =>
  S.Struct({
    incidentRecordArn: S.String.pipe(T.HttpQuery("incidentRecordArn")),
    eventId: S.String.pipe(T.HttpQuery("eventId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/getTimelineEvent" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTimelineEventInput",
}) as any as S.Schema<GetTimelineEventInput>;
export interface ListIncidentFindingsInput {
  incidentRecordArn: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListIncidentFindingsInput = S.suspend(() =>
  S.Struct({
    incidentRecordArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listIncidentFindings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIncidentFindingsInput",
}) as any as S.Schema<ListIncidentFindingsInput>;
export interface ListRelatedItemsInput {
  incidentRecordArn: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListRelatedItemsInput = S.suspend(() =>
  S.Struct({
    incidentRecordArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listRelatedItems" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRelatedItemsInput",
}) as any as S.Schema<ListRelatedItemsInput>;
export interface ListReplicationSetsInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListReplicationSetsInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listReplicationSets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReplicationSetsInput",
}) as any as S.Schema<ListReplicationSetsInput>;
export interface ListResponsePlansInput {
  maxResults?: number;
  nextToken?: string;
}
export const ListResponsePlansInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listResponsePlans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResponsePlansInput",
}) as any as S.Schema<ListResponsePlansInput>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export type IntegerList = number[];
export const IntegerList = S.Array(S.Number);
export type AttributeValueList =
  | { stringValues: string[] }
  | { integerValues: number[] };
export const AttributeValueList = S.Union(
  S.Struct({ stringValues: StringList }),
  S.Struct({ integerValues: IntegerList }),
);
export type Condition =
  | { before: Date }
  | { after: Date }
  | { equals: AttributeValueList };
export const Condition = S.Union(
  S.Struct({ before: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
  S.Struct({ after: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
  S.Struct({ equals: AttributeValueList }),
);
export interface Filter {
  key: string;
  condition: Condition;
}
export const Filter = S.suspend(() =>
  S.Struct({ key: S.String, condition: Condition }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface ListTimelineEventsInput {
  incidentRecordArn: string;
  filters?: Filter[];
  sortBy?: string;
  sortOrder?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListTimelineEventsInput = S.suspend(() =>
  S.Struct({
    incidentRecordArn: S.String,
    filters: S.optional(FilterList),
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listTimelineEvents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTimelineEventsInput",
}) as any as S.Schema<ListTimelineEventsInput>;
export interface PutResourcePolicyInput {
  resourceArn: string;
  policy: string;
}
export const PutResourcePolicyInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, policy: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/putResourcePolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourcePolicyInput",
}) as any as S.Schema<PutResourcePolicyInput>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
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
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateDeletionProtectionInput {
  arn: string;
  deletionProtected: boolean;
  clientToken?: string;
}
export const UpdateDeletionProtectionInput = S.suspend(() =>
  S.Struct({
    arn: S.String,
    deletionProtected: S.Boolean,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/updateDeletionProtection" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDeletionProtectionInput",
}) as any as S.Schema<UpdateDeletionProtectionInput>;
export interface UpdateDeletionProtectionOutput {}
export const UpdateDeletionProtectionOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDeletionProtectionOutput",
}) as any as S.Schema<UpdateDeletionProtectionOutput>;
export type EventReference = { resource: string } | { relatedItemId: string };
export const EventReference = S.Union(
  S.Struct({ resource: S.String }),
  S.Struct({ relatedItemId: S.String }),
);
export type EventReferenceList = EventReference[];
export const EventReferenceList = S.Array(EventReference);
export interface UpdateTimelineEventInput {
  clientToken?: string;
  incidentRecordArn: string;
  eventId: string;
  eventTime?: Date;
  eventType?: string;
  eventData?: string;
  eventReferences?: EventReference[];
}
export const UpdateTimelineEventInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    incidentRecordArn: S.String,
    eventId: S.String,
    eventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    eventType: S.optional(S.String),
    eventData: S.optional(S.String),
    eventReferences: S.optional(EventReferenceList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/updateTimelineEvent" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTimelineEventInput",
}) as any as S.Schema<UpdateTimelineEventInput>;
export interface UpdateTimelineEventOutput {}
export const UpdateTimelineEventOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateTimelineEventOutput",
}) as any as S.Schema<UpdateTimelineEventOutput>;
export interface EmptyChatChannel {}
export const EmptyChatChannel = S.suspend(() => S.Struct({})).annotations({
  identifier: "EmptyChatChannel",
}) as any as S.Schema<EmptyChatChannel>;
export type ChatbotSnsConfigurationSet = string[];
export const ChatbotSnsConfigurationSet = S.Array(S.String);
export type NotificationTargetItem = { snsTopicArn: string };
export const NotificationTargetItem = S.Union(
  S.Struct({ snsTopicArn: S.String }),
);
export type NotificationTargetSet = NotificationTargetItem[];
export const NotificationTargetSet = S.Array(NotificationTargetItem);
export interface IncidentTemplate {
  title: string;
  impact: number;
  summary?: string;
  dedupeString?: string;
  notificationTargets?: NotificationTargetItem[];
  incidentTags?: { [key: string]: string };
}
export const IncidentTemplate = S.suspend(() =>
  S.Struct({
    title: S.String,
    impact: S.Number,
    summary: S.optional(S.String),
    dedupeString: S.optional(S.String),
    notificationTargets: S.optional(NotificationTargetSet),
    incidentTags: S.optional(TagMap),
  }),
).annotations({
  identifier: "IncidentTemplate",
}) as any as S.Schema<IncidentTemplate>;
export type ChatChannel =
  | { empty: EmptyChatChannel }
  | { chatbotSns: string[] };
export const ChatChannel = S.Union(
  S.Struct({ empty: EmptyChatChannel }),
  S.Struct({ chatbotSns: ChatbotSnsConfigurationSet }),
);
export type ReplicationSetArnList = string[];
export const ReplicationSetArnList = S.Array(S.String);
export interface TriggerDetails {
  source: string;
  triggerArn?: string;
  timestamp: Date;
  rawData?: string;
}
export const TriggerDetails = S.suspend(() =>
  S.Struct({
    source: S.String,
    triggerArn: S.optional(S.String),
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    rawData: S.optional(S.String),
  }),
).annotations({
  identifier: "TriggerDetails",
}) as any as S.Schema<TriggerDetails>;
export interface PagerDutyIncidentDetail {
  id: string;
  autoResolve?: boolean;
  secretId?: string;
}
export const PagerDutyIncidentDetail = S.suspend(() =>
  S.Struct({
    id: S.String,
    autoResolve: S.optional(S.Boolean),
    secretId: S.optional(S.String),
  }),
).annotations({
  identifier: "PagerDutyIncidentDetail",
}) as any as S.Schema<PagerDutyIncidentDetail>;
export type ItemValue =
  | { arn: string }
  | { url: string }
  | { metricDefinition: string }
  | { pagerDutyIncidentDetail: PagerDutyIncidentDetail };
export const ItemValue = S.Union(
  S.Struct({ arn: S.String }),
  S.Struct({ url: S.String }),
  S.Struct({ metricDefinition: S.String }),
  S.Struct({ pagerDutyIncidentDetail: PagerDutyIncidentDetail }),
);
export interface ItemIdentifier {
  value: ItemValue;
  type: string;
}
export const ItemIdentifier = S.suspend(() =>
  S.Struct({ value: ItemValue, type: S.String }),
).annotations({
  identifier: "ItemIdentifier",
}) as any as S.Schema<ItemIdentifier>;
export interface RelatedItem {
  identifier: ItemIdentifier;
  title?: string;
  generatedId?: string;
}
export const RelatedItem = S.suspend(() =>
  S.Struct({
    identifier: ItemIdentifier,
    title: S.optional(S.String),
    generatedId: S.optional(S.String),
  }),
).annotations({ identifier: "RelatedItem" }) as any as S.Schema<RelatedItem>;
export type RelatedItemsUpdate =
  | { itemToAdd: RelatedItem }
  | { itemToRemove: ItemIdentifier };
export const RelatedItemsUpdate = S.Union(
  S.Struct({ itemToAdd: RelatedItem }),
  S.Struct({ itemToRemove: ItemIdentifier }),
);
export type TagMapUpdate = { [key: string]: string };
export const TagMapUpdate = S.Record({ key: S.String, value: S.String });
export interface CreateTimelineEventInput {
  clientToken?: string;
  incidentRecordArn: string;
  eventTime: Date;
  eventType: string;
  eventData: string;
  eventReferences?: EventReference[];
}
export const CreateTimelineEventInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    incidentRecordArn: S.String,
    eventTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    eventType: S.String,
    eventData: S.String,
    eventReferences: S.optional(EventReferenceList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/createTimelineEvent" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTimelineEventInput",
}) as any as S.Schema<CreateTimelineEventInput>;
export type SsmParameterValues = string[];
export const SsmParameterValues = S.Array(S.String);
export type SsmParameters = { [key: string]: string[] };
export const SsmParameters = S.Record({
  key: S.String,
  value: SsmParameterValues,
});
export type DynamicSsmParameterValue = { variable: string };
export const DynamicSsmParameterValue = S.Union(
  S.Struct({ variable: S.String }),
);
export type DynamicSsmParameters = { [key: string]: DynamicSsmParameterValue };
export const DynamicSsmParameters = S.Record({
  key: S.String,
  value: DynamicSsmParameterValue,
});
export interface SsmAutomation {
  roleArn: string;
  documentName: string;
  documentVersion?: string;
  targetAccount?: string;
  parameters?: { [key: string]: string[] };
  dynamicParameters?: { [key: string]: DynamicSsmParameterValue };
}
export const SsmAutomation = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    documentName: S.String,
    documentVersion: S.optional(S.String),
    targetAccount: S.optional(S.String),
    parameters: S.optional(SsmParameters),
    dynamicParameters: S.optional(DynamicSsmParameters),
  }),
).annotations({
  identifier: "SsmAutomation",
}) as any as S.Schema<SsmAutomation>;
export type Action = { ssmAutomation: SsmAutomation };
export const Action = S.Union(S.Struct({ ssmAutomation: SsmAutomation }));
export type ActionsList = Action[];
export const ActionsList = S.Array(Action);
export interface PagerDutyIncidentConfiguration {
  serviceId: string;
}
export const PagerDutyIncidentConfiguration = S.suspend(() =>
  S.Struct({ serviceId: S.String }),
).annotations({
  identifier: "PagerDutyIncidentConfiguration",
}) as any as S.Schema<PagerDutyIncidentConfiguration>;
export interface PagerDutyConfiguration {
  name: string;
  secretId: string;
  pagerDutyIncidentConfiguration: PagerDutyIncidentConfiguration;
}
export const PagerDutyConfiguration = S.suspend(() =>
  S.Struct({
    name: S.String,
    secretId: S.String,
    pagerDutyIncidentConfiguration: PagerDutyIncidentConfiguration,
  }),
).annotations({
  identifier: "PagerDutyConfiguration",
}) as any as S.Schema<PagerDutyConfiguration>;
export type Integration = { pagerDutyConfiguration: PagerDutyConfiguration };
export const Integration = S.Union(
  S.Struct({ pagerDutyConfiguration: PagerDutyConfiguration }),
);
export type Integrations = Integration[];
export const Integrations = S.Array(Integration);
export interface GetResponsePlanOutput {
  arn: string;
  name: string;
  displayName?: string;
  incidentTemplate: IncidentTemplate;
  chatChannel?: ChatChannel;
  engagements?: string[];
  actions?: Action[];
  integrations?: Integration[];
}
export const GetResponsePlanOutput = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    displayName: S.optional(S.String),
    incidentTemplate: IncidentTemplate,
    chatChannel: S.optional(ChatChannel),
    engagements: S.optional(EngagementSet),
    actions: S.optional(ActionsList),
    integrations: S.optional(Integrations),
  }),
).annotations({
  identifier: "GetResponsePlanOutput",
}) as any as S.Schema<GetResponsePlanOutput>;
export type RelatedItemList = RelatedItem[];
export const RelatedItemList = S.Array(RelatedItem);
export interface ListRelatedItemsOutput {
  relatedItems: RelatedItem[];
  nextToken?: string;
}
export const ListRelatedItemsOutput = S.suspend(() =>
  S.Struct({ relatedItems: RelatedItemList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListRelatedItemsOutput",
}) as any as S.Schema<ListRelatedItemsOutput>;
export interface ListReplicationSetsOutput {
  replicationSetArns: string[];
  nextToken?: string;
}
export const ListReplicationSetsOutput = S.suspend(() =>
  S.Struct({
    replicationSetArns: ReplicationSetArnList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListReplicationSetsOutput",
}) as any as S.Schema<ListReplicationSetsOutput>;
export interface ListTagsForResourceResponse {
  tags: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutResourcePolicyOutput {
  policyId: string;
}
export const PutResourcePolicyOutput = S.suspend(() =>
  S.Struct({ policyId: S.String }),
).annotations({
  identifier: "PutResourcePolicyOutput",
}) as any as S.Schema<PutResourcePolicyOutput>;
export interface UpdateIncidentRecordInput {
  clientToken?: string;
  arn: string;
  title?: string;
  summary?: string;
  impact?: number;
  status?: string;
  chatChannel?: ChatChannel;
  notificationTargets?: NotificationTargetItem[];
}
export const UpdateIncidentRecordInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    arn: S.String,
    title: S.optional(S.String),
    summary: S.optional(S.String),
    impact: S.optional(S.Number),
    status: S.optional(S.String),
    chatChannel: S.optional(ChatChannel),
    notificationTargets: S.optional(NotificationTargetSet),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/updateIncidentRecord" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIncidentRecordInput",
}) as any as S.Schema<UpdateIncidentRecordInput>;
export interface UpdateIncidentRecordOutput {}
export const UpdateIncidentRecordOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateIncidentRecordOutput",
}) as any as S.Schema<UpdateIncidentRecordOutput>;
export interface UpdateRelatedItemsInput {
  clientToken?: string;
  incidentRecordArn: string;
  relatedItemsUpdate: RelatedItemsUpdate;
}
export const UpdateRelatedItemsInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    incidentRecordArn: S.String,
    relatedItemsUpdate: RelatedItemsUpdate,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/updateRelatedItems" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRelatedItemsInput",
}) as any as S.Schema<UpdateRelatedItemsInput>;
export interface UpdateRelatedItemsOutput {}
export const UpdateRelatedItemsOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateRelatedItemsOutput",
}) as any as S.Schema<UpdateRelatedItemsOutput>;
export interface UpdateResponsePlanInput {
  clientToken?: string;
  arn: string;
  displayName?: string;
  incidentTemplateTitle?: string;
  incidentTemplateImpact?: number;
  incidentTemplateSummary?: string;
  incidentTemplateDedupeString?: string;
  incidentTemplateNotificationTargets?: NotificationTargetItem[];
  chatChannel?: ChatChannel;
  engagements?: string[];
  actions?: Action[];
  incidentTemplateTags?: { [key: string]: string };
  integrations?: Integration[];
}
export const UpdateResponsePlanInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    arn: S.String,
    displayName: S.optional(S.String),
    incidentTemplateTitle: S.optional(S.String),
    incidentTemplateImpact: S.optional(S.Number),
    incidentTemplateSummary: S.optional(S.String),
    incidentTemplateDedupeString: S.optional(S.String),
    incidentTemplateNotificationTargets: S.optional(NotificationTargetSet),
    chatChannel: S.optional(ChatChannel),
    engagements: S.optional(EngagementSet),
    actions: S.optional(ActionsList),
    incidentTemplateTags: S.optional(TagMapUpdate),
    integrations: S.optional(Integrations),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/updateResponsePlan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResponsePlanInput",
}) as any as S.Schema<UpdateResponsePlanInput>;
export interface UpdateResponsePlanOutput {}
export const UpdateResponsePlanOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateResponsePlanOutput",
}) as any as S.Schema<UpdateResponsePlanOutput>;
export interface RegionMapInputValue {
  sseKmsKeyId?: string;
}
export const RegionMapInputValue = S.suspend(() =>
  S.Struct({ sseKmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "RegionMapInputValue",
}) as any as S.Schema<RegionMapInputValue>;
export interface AddRegionAction {
  regionName: string;
  sseKmsKeyId?: string;
}
export const AddRegionAction = S.suspend(() =>
  S.Struct({ regionName: S.String, sseKmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "AddRegionAction",
}) as any as S.Schema<AddRegionAction>;
export interface DeleteRegionAction {
  regionName: string;
}
export const DeleteRegionAction = S.suspend(() =>
  S.Struct({ regionName: S.String }),
).annotations({
  identifier: "DeleteRegionAction",
}) as any as S.Schema<DeleteRegionAction>;
export interface BatchGetIncidentFindingsError {
  findingId: string;
  code: string;
  message: string;
}
export const BatchGetIncidentFindingsError = S.suspend(() =>
  S.Struct({ findingId: S.String, code: S.String, message: S.String }),
).annotations({
  identifier: "BatchGetIncidentFindingsError",
}) as any as S.Schema<BatchGetIncidentFindingsError>;
export type BatchGetIncidentFindingsErrorList = BatchGetIncidentFindingsError[];
export const BatchGetIncidentFindingsErrorList = S.Array(
  BatchGetIncidentFindingsError,
);
export type RegionMapInput = { [key: string]: RegionMapInputValue };
export const RegionMapInput = S.Record({
  key: S.String,
  value: RegionMapInputValue,
});
export interface ResourcePolicy {
  policyDocument: string;
  policyId: string;
  ramResourceShareRegion: string;
}
export const ResourcePolicy = S.suspend(() =>
  S.Struct({
    policyDocument: S.String,
    policyId: S.String,
    ramResourceShareRegion: S.String,
  }),
).annotations({
  identifier: "ResourcePolicy",
}) as any as S.Schema<ResourcePolicy>;
export type ResourcePolicyList = ResourcePolicy[];
export const ResourcePolicyList = S.Array(ResourcePolicy);
export interface TimelineEvent {
  incidentRecordArn: string;
  eventId: string;
  eventTime: Date;
  eventUpdatedTime: Date;
  eventType: string;
  eventData: string;
  eventReferences?: EventReference[];
}
export const TimelineEvent = S.suspend(() =>
  S.Struct({
    incidentRecordArn: S.String,
    eventId: S.String,
    eventTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    eventUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    eventType: S.String,
    eventData: S.String,
    eventReferences: S.optional(EventReferenceList),
  }),
).annotations({
  identifier: "TimelineEvent",
}) as any as S.Schema<TimelineEvent>;
export interface FindingSummary {
  id: string;
  lastModifiedTime: Date;
}
export const FindingSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "FindingSummary",
}) as any as S.Schema<FindingSummary>;
export type FindingSummaryList = FindingSummary[];
export const FindingSummaryList = S.Array(FindingSummary);
export interface ResponsePlanSummary {
  arn: string;
  name: string;
  displayName?: string;
}
export const ResponsePlanSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    displayName: S.optional(S.String),
  }),
).annotations({
  identifier: "ResponsePlanSummary",
}) as any as S.Schema<ResponsePlanSummary>;
export type ResponsePlanSummaryList = ResponsePlanSummary[];
export const ResponsePlanSummaryList = S.Array(ResponsePlanSummary);
export interface EventSummary {
  incidentRecordArn: string;
  eventId: string;
  eventTime: Date;
  eventUpdatedTime: Date;
  eventType: string;
  eventReferences?: EventReference[];
}
export const EventSummary = S.suspend(() =>
  S.Struct({
    incidentRecordArn: S.String,
    eventId: S.String,
    eventTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    eventUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    eventType: S.String,
    eventReferences: S.optional(EventReferenceList),
  }),
).annotations({ identifier: "EventSummary" }) as any as S.Schema<EventSummary>;
export type EventSummaryList = EventSummary[];
export const EventSummaryList = S.Array(EventSummary);
export type UpdateReplicationSetAction =
  | { addRegionAction: AddRegionAction }
  | { deleteRegionAction: DeleteRegionAction };
export const UpdateReplicationSetAction = S.Union(
  S.Struct({ addRegionAction: AddRegionAction }),
  S.Struct({ deleteRegionAction: DeleteRegionAction }),
);
export type UpdateActionList = UpdateReplicationSetAction[];
export const UpdateActionList = S.Array(UpdateReplicationSetAction);
export interface CreateReplicationSetInput {
  regions: { [key: string]: RegionMapInputValue };
  clientToken?: string;
  tags?: { [key: string]: string };
}
export const CreateReplicationSetInput = S.suspend(() =>
  S.Struct({
    regions: RegionMapInput,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/createReplicationSet" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateReplicationSetInput",
}) as any as S.Schema<CreateReplicationSetInput>;
export interface CreateTimelineEventOutput {
  incidentRecordArn: string;
  eventId: string;
}
export const CreateTimelineEventOutput = S.suspend(() =>
  S.Struct({ incidentRecordArn: S.String, eventId: S.String }),
).annotations({
  identifier: "CreateTimelineEventOutput",
}) as any as S.Schema<CreateTimelineEventOutput>;
export interface GetResourcePoliciesOutput {
  resourcePolicies: ResourcePolicy[];
  nextToken?: string;
}
export const GetResourcePoliciesOutput = S.suspend(() =>
  S.Struct({
    resourcePolicies: ResourcePolicyList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourcePoliciesOutput",
}) as any as S.Schema<GetResourcePoliciesOutput>;
export interface GetTimelineEventOutput {
  event: TimelineEvent;
}
export const GetTimelineEventOutput = S.suspend(() =>
  S.Struct({ event: TimelineEvent }),
).annotations({
  identifier: "GetTimelineEventOutput",
}) as any as S.Schema<GetTimelineEventOutput>;
export interface ListIncidentFindingsOutput {
  findings: FindingSummary[];
  nextToken?: string;
}
export const ListIncidentFindingsOutput = S.suspend(() =>
  S.Struct({ findings: FindingSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListIncidentFindingsOutput",
}) as any as S.Schema<ListIncidentFindingsOutput>;
export interface ListResponsePlansOutput {
  responsePlanSummaries: ResponsePlanSummary[];
  nextToken?: string;
}
export const ListResponsePlansOutput = S.suspend(() =>
  S.Struct({
    responsePlanSummaries: ResponsePlanSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResponsePlansOutput",
}) as any as S.Schema<ListResponsePlansOutput>;
export interface ListTimelineEventsOutput {
  eventSummaries: EventSummary[];
  nextToken?: string;
}
export const ListTimelineEventsOutput = S.suspend(() =>
  S.Struct({
    eventSummaries: EventSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTimelineEventsOutput",
}) as any as S.Schema<ListTimelineEventsOutput>;
export interface UpdateReplicationSetInput {
  arn: string;
  actions: UpdateReplicationSetAction[];
  clientToken?: string;
}
export const UpdateReplicationSetInput = S.suspend(() =>
  S.Struct({
    arn: S.String,
    actions: UpdateActionList,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/updateReplicationSet" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateReplicationSetInput",
}) as any as S.Schema<UpdateReplicationSetInput>;
export interface UpdateReplicationSetOutput {}
export const UpdateReplicationSetOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateReplicationSetOutput",
}) as any as S.Schema<UpdateReplicationSetOutput>;
export type AutomationExecution = { ssmExecutionArn: string };
export const AutomationExecution = S.Union(
  S.Struct({ ssmExecutionArn: S.String }),
);
export type AutomationExecutionSet = AutomationExecution[];
export const AutomationExecutionSet = S.Array(AutomationExecution);
export interface IncidentRecordSource {
  createdBy: string;
  invokedBy?: string;
  resourceArn?: string;
  source: string;
}
export const IncidentRecordSource = S.suspend(() =>
  S.Struct({
    createdBy: S.String,
    invokedBy: S.optional(S.String),
    resourceArn: S.optional(S.String),
    source: S.String,
  }),
).annotations({
  identifier: "IncidentRecordSource",
}) as any as S.Schema<IncidentRecordSource>;
export interface IncidentRecord {
  arn: string;
  title: string;
  summary?: string;
  status: string;
  impact: number;
  creationTime: Date;
  resolvedTime?: Date;
  lastModifiedTime: Date;
  lastModifiedBy: string;
  automationExecutions?: AutomationExecution[];
  incidentRecordSource: IncidentRecordSource;
  dedupeString: string;
  chatChannel?: ChatChannel;
  notificationTargets?: NotificationTargetItem[];
}
export const IncidentRecord = S.suspend(() =>
  S.Struct({
    arn: S.String,
    title: S.String,
    summary: S.optional(S.String),
    status: S.String,
    impact: S.Number,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    resolvedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedBy: S.String,
    automationExecutions: S.optional(AutomationExecutionSet),
    incidentRecordSource: IncidentRecordSource,
    dedupeString: S.String,
    chatChannel: S.optional(ChatChannel),
    notificationTargets: S.optional(NotificationTargetSet),
  }),
).annotations({
  identifier: "IncidentRecord",
}) as any as S.Schema<IncidentRecord>;
export interface CodeDeployDeployment {
  startTime: Date;
  endTime?: Date;
  deploymentGroupArn: string;
  deploymentId: string;
}
export const CodeDeployDeployment = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    deploymentGroupArn: S.String,
    deploymentId: S.String,
  }),
).annotations({
  identifier: "CodeDeployDeployment",
}) as any as S.Schema<CodeDeployDeployment>;
export interface CloudFormationStackUpdate {
  startTime: Date;
  endTime?: Date;
  stackArn: string;
}
export const CloudFormationStackUpdate = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stackArn: S.String,
  }),
).annotations({
  identifier: "CloudFormationStackUpdate",
}) as any as S.Schema<CloudFormationStackUpdate>;
export interface RegionInfo {
  sseKmsKeyId?: string;
  status: string;
  statusMessage?: string;
  statusUpdateDateTime: Date;
}
export const RegionInfo = S.suspend(() =>
  S.Struct({
    sseKmsKeyId: S.optional(S.String),
    status: S.String,
    statusMessage: S.optional(S.String),
    statusUpdateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "RegionInfo" }) as any as S.Schema<RegionInfo>;
export interface CreateReplicationSetOutput {
  arn: string;
}
export const CreateReplicationSetOutput = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "CreateReplicationSetOutput",
}) as any as S.Schema<CreateReplicationSetOutput>;
export interface GetIncidentRecordOutput {
  incidentRecord: IncidentRecord;
}
export const GetIncidentRecordOutput = S.suspend(() =>
  S.Struct({ incidentRecord: IncidentRecord }),
).annotations({
  identifier: "GetIncidentRecordOutput",
}) as any as S.Schema<GetIncidentRecordOutput>;
export interface ListIncidentRecordsInput {
  filters?: Filter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListIncidentRecordsInput = S.suspend(() =>
  S.Struct({
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listIncidentRecords" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIncidentRecordsInput",
}) as any as S.Schema<ListIncidentRecordsInput>;
export type FindingDetails =
  | { codeDeployDeployment: CodeDeployDeployment }
  | { cloudFormationStackUpdate: CloudFormationStackUpdate };
export const FindingDetails = S.Union(
  S.Struct({ codeDeployDeployment: CodeDeployDeployment }),
  S.Struct({ cloudFormationStackUpdate: CloudFormationStackUpdate }),
);
export type RegionInfoMap = { [key: string]: RegionInfo };
export const RegionInfoMap = S.Record({ key: S.String, value: RegionInfo });
export interface Finding {
  id: string;
  creationTime: Date;
  lastModifiedTime: Date;
  details?: FindingDetails;
}
export const Finding = S.suspend(() =>
  S.Struct({
    id: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    details: S.optional(FindingDetails),
  }),
).annotations({ identifier: "Finding" }) as any as S.Schema<Finding>;
export type FindingList = Finding[];
export const FindingList = S.Array(Finding);
export interface ReplicationSet {
  arn?: string;
  regionMap: { [key: string]: RegionInfo };
  status: string;
  deletionProtected: boolean;
  createdTime: Date;
  createdBy: string;
  lastModifiedTime: Date;
  lastModifiedBy: string;
}
export const ReplicationSet = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    regionMap: RegionInfoMap,
    status: S.String,
    deletionProtected: S.Boolean,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    createdBy: S.String,
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedBy: S.String,
  }),
).annotations({
  identifier: "ReplicationSet",
}) as any as S.Schema<ReplicationSet>;
export interface BatchGetIncidentFindingsOutput {
  findings: Finding[];
  errors: BatchGetIncidentFindingsError[];
}
export const BatchGetIncidentFindingsOutput = S.suspend(() =>
  S.Struct({
    findings: FindingList,
    errors: BatchGetIncidentFindingsErrorList,
  }),
).annotations({
  identifier: "BatchGetIncidentFindingsOutput",
}) as any as S.Schema<BatchGetIncidentFindingsOutput>;
export interface CreateResponsePlanInput {
  clientToken?: string;
  name: string;
  displayName?: string;
  incidentTemplate: IncidentTemplate;
  chatChannel?: ChatChannel;
  engagements?: string[];
  actions?: Action[];
  tags?: { [key: string]: string };
  integrations?: Integration[];
}
export const CreateResponsePlanInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    name: S.String,
    displayName: S.optional(S.String),
    incidentTemplate: IncidentTemplate,
    chatChannel: S.optional(ChatChannel),
    engagements: S.optional(EngagementSet),
    actions: S.optional(ActionsList),
    tags: S.optional(TagMap),
    integrations: S.optional(Integrations),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/createResponsePlan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResponsePlanInput",
}) as any as S.Schema<CreateResponsePlanInput>;
export interface GetReplicationSetOutput {
  replicationSet: ReplicationSet;
}
export const GetReplicationSetOutput = S.suspend(() =>
  S.Struct({ replicationSet: ReplicationSet }),
).annotations({
  identifier: "GetReplicationSetOutput",
}) as any as S.Schema<GetReplicationSetOutput>;
export interface StartIncidentInput {
  clientToken?: string;
  responsePlanArn: string;
  title?: string;
  impact?: number;
  triggerDetails?: TriggerDetails;
  relatedItems?: RelatedItem[];
}
export const StartIncidentInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    responsePlanArn: S.String,
    title: S.optional(S.String),
    impact: S.optional(S.Number),
    triggerDetails: S.optional(TriggerDetails),
    relatedItems: S.optional(RelatedItemList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/startIncident" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartIncidentInput",
}) as any as S.Schema<StartIncidentInput>;
export interface IncidentRecordSummary {
  arn: string;
  title: string;
  status: string;
  impact: number;
  creationTime: Date;
  resolvedTime?: Date;
  incidentRecordSource: IncidentRecordSource;
}
export const IncidentRecordSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    title: S.String,
    status: S.String,
    impact: S.Number,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    resolvedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    incidentRecordSource: IncidentRecordSource,
  }),
).annotations({
  identifier: "IncidentRecordSummary",
}) as any as S.Schema<IncidentRecordSummary>;
export type IncidentRecordSummaryList = IncidentRecordSummary[];
export const IncidentRecordSummaryList = S.Array(IncidentRecordSummary);
export interface CreateResponsePlanOutput {
  arn: string;
}
export const CreateResponsePlanOutput = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "CreateResponsePlanOutput",
}) as any as S.Schema<CreateResponsePlanOutput>;
export interface ListIncidentRecordsOutput {
  incidentRecordSummaries: IncidentRecordSummary[];
  nextToken?: string;
}
export const ListIncidentRecordsOutput = S.suspend(() =>
  S.Struct({
    incidentRecordSummaries: IncidentRecordSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIncidentRecordsOutput",
}) as any as S.Schema<ListIncidentRecordsOutput>;
export interface StartIncidentOutput {
  incidentRecordArn: string;
}
export const StartIncidentOutput = S.suspend(() =>
  S.Struct({ incidentRecordArn: S.String }),
).annotations({
  identifier: "StartIncidentOutput",
}) as any as S.Schema<StartIncidentOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceIdentifier: S.optional(S.String),
    resourceType: S.optional(S.String),
    retryAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String, serviceCode: S.String, quotaCode: S.String },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceIdentifier: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceIdentifier: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Delete an incident record from Incident Manager.
 */
export const deleteIncidentRecord: (
  input: DeleteIncidentRecordInput,
) => effect.Effect<
  DeleteIncidentRecordOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIncidentRecordInput,
  output: DeleteIncidentRecordOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieve your Incident Manager replication set.
 */
export const getReplicationSet: (
  input: GetReplicationSetInput,
) => effect.Effect<
  GetReplicationSetOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReplicationSetInput,
  output: GetReplicationSetOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a tag to a response plan.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
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
  input: TagResourceRequest,
  output: TagResourceResponse,
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
 * Retrieves the resource policies attached to the specified response plan.
 */
export const getResourcePolicies: {
  (
    input: GetResourcePoliciesInput,
  ): effect.Effect<
    GetResourcePoliciesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourcePoliciesInput,
  ) => stream.Stream<
    GetResourcePoliciesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourcePoliciesInput,
  ) => stream.Stream<
    ResourcePolicy,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourcePoliciesInput,
  output: GetResourcePoliciesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "resourcePolicies",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all response plans in your account.
 */
export const listResponsePlans: {
  (
    input: ListResponsePlansInput,
  ): effect.Effect<
    ListResponsePlansOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResponsePlansInput,
  ) => stream.Stream<
    ListResponsePlansOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResponsePlansInput,
  ) => stream.Stream<
    ResponsePlanSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResponsePlansInput,
  output: ListResponsePlansOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "responsePlanSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists timeline events for the specified incident record.
 */
export const listTimelineEvents: {
  (
    input: ListTimelineEventsInput,
  ): effect.Effect<
    ListTimelineEventsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTimelineEventsInput,
  ) => stream.Stream<
    ListTimelineEventsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTimelineEventsInput,
  ) => stream.Stream<
    EventSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTimelineEventsInput,
  output: ListTimelineEventsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "eventSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List all related items for an incident record.
 */
export const listRelatedItems: {
  (
    input: ListRelatedItemsInput,
  ): effect.Effect<
    ListRelatedItemsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRelatedItemsInput,
  ) => stream.Stream<
    ListRelatedItemsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRelatedItemsInput,
  ) => stream.Stream<
    RelatedItem,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRelatedItemsInput,
  output: ListRelatedItemsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "relatedItems",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists details about the replication set configured in your account.
 */
export const listReplicationSets: {
  (
    input: ListReplicationSetsInput,
  ): effect.Effect<
    ListReplicationSetsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReplicationSetsInput,
  ) => stream.Stream<
    ListReplicationSetsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReplicationSetsInput,
  ) => stream.Stream<
    Arn,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReplicationSetsInput,
  output: ListReplicationSetsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "replicationSetArns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes the specified response plan. Deleting a response plan stops all linked CloudWatch alarms and EventBridge events from creating an incident with this response
 * plan.
 */
export const deleteResponsePlan: (
  input: DeleteResponsePlanInput,
) => effect.Effect<
  DeleteResponsePlanOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResponsePlanInput,
  output: DeleteResponsePlanOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a timeline event from an incident.
 */
export const deleteTimelineEvent: (
  input: DeleteTimelineEventInput,
) => effect.Effect<
  DeleteTimelineEventOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTimelineEventInput,
  output: DeleteTimelineEventOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a timeline event based on its ID and incident record.
 */
export const getTimelineEvent: (
  input: GetTimelineEventInput,
) => effect.Effect<
  GetTimelineEventOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTimelineEventInput,
  output: GetTimelineEventOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of the IDs of findings, plus their last modified times, that have been
 * identified for a specified incident. A finding represents a recent application environment
 * change made by an CloudFormation stack creation or update or an CodeDeploy
 * deployment that can be investigated as a potential cause of the incident.
 */
export const listIncidentFindings: {
  (
    input: ListIncidentFindingsInput,
  ): effect.Effect<
    ListIncidentFindingsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIncidentFindingsInput,
  ) => stream.Stream<
    ListIncidentFindingsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIncidentFindingsInput,
  ) => stream.Stream<
    FindingSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIncidentFindingsInput,
  output: ListIncidentFindingsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "findings",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Update the details of an incident record. You can use this operation to update an incident
 * record from the defined chat channel. For more information about using actions in chat
 * channels, see Interacting through chat.
 */
export const updateIncidentRecord: (
  input: UpdateIncidentRecordInput,
) => effect.Effect<
  UpdateIncidentRecordOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIncidentRecordInput,
  output: UpdateIncidentRecordOutput,
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
 * Add or delete Regions from your replication set.
 */
export const updateReplicationSet: (
  input: UpdateReplicationSetInput,
) => effect.Effect<
  UpdateReplicationSetOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReplicationSetInput,
  output: UpdateReplicationSetOutput,
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
 * Retrieves the details of the specified response plan.
 */
export const getResponsePlan: (
  input: GetResponsePlanInput,
) => effect.Effect<
  GetResponsePlanOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResponsePlanInput,
  output: GetResponsePlanOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags that are attached to the specified response plan or incident.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a resource policy to the specified response plan. The resource policy is used to
 * share the response plan using Resource Access Manager (RAM). For more
 * information about cross-account sharing, see Cross-Region and cross-account incident management.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyInput,
) => effect.Effect<
  PutResourcePolicyOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyInput,
  output: PutResourcePolicyOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes all Regions in your replication set. Deleting the replication set deletes all
 * Incident Manager data.
 */
export const deleteReplicationSet: (
  input: DeleteReplicationSetInput,
) => effect.Effect<
  DeleteReplicationSetOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReplicationSetInput,
  output: DeleteReplicationSetOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the resource policy that Resource Access Manager uses to share your Incident Manager
 * resource.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyInput,
) => effect.Effect<
  DeleteResourcePolicyOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyInput,
  output: DeleteResourcePolicyOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update deletion protection to either allow or deny deletion of the final Region in a
 * replication set.
 */
export const updateDeletionProtection: (
  input: UpdateDeletionProtectionInput,
) => effect.Effect<
  UpdateDeletionProtectionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDeletionProtectionInput,
  output: UpdateDeletionProtectionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Add or remove related items from the related items tab of an incident record.
 */
export const updateRelatedItems: (
  input: UpdateRelatedItemsInput,
) => effect.Effect<
  UpdateRelatedItemsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRelatedItemsInput,
  output: UpdateRelatedItemsOutput,
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
 * Updates the specified response plan.
 */
export const updateResponsePlan: (
  input: UpdateResponsePlanInput,
) => effect.Effect<
  UpdateResponsePlanOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResponsePlanInput,
  output: UpdateResponsePlanOutput,
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
 * Removes a tag from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
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
 * Updates a timeline event. You can update events of type `Custom Event`.
 */
export const updateTimelineEvent: (
  input: UpdateTimelineEventInput,
) => effect.Effect<
  UpdateTimelineEventOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTimelineEventInput,
  output: UpdateTimelineEventOutput,
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
 * Creates a custom timeline event on the incident details page of an incident record.
 * Incident Manager automatically creates timeline events that mark key moments during an incident.
 * You can create custom timeline events to mark important events that Incident Manager can detect
 * automatically.
 */
export const createTimelineEvent: (
  input: CreateTimelineEventInput,
) => effect.Effect<
  CreateTimelineEventOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTimelineEventInput,
  output: CreateTimelineEventOutput,
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
 * Returns the details for the specified incident record.
 */
export const getIncidentRecord: (
  input: GetIncidentRecordInput,
) => effect.Effect<
  GetIncidentRecordOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIncidentRecordInput,
  output: GetIncidentRecordOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about all specified findings for an incident, including descriptive details about each finding. A finding
 * represents a recent application environment change made by an CodeDeploy
 * deployment or an CloudFormation stack creation or update that can be investigated as a
 * potential cause of the incident.
 */
export const batchGetIncidentFindings: (
  input: BatchGetIncidentFindingsInput,
) => effect.Effect<
  BatchGetIncidentFindingsOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetIncidentFindingsInput,
  output: BatchGetIncidentFindingsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * A replication set replicates and encrypts your data to the provided Regions with the
 * provided KMS key.
 */
export const createReplicationSet: (
  input: CreateReplicationSetInput,
) => effect.Effect<
  CreateReplicationSetOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReplicationSetInput,
  output: CreateReplicationSetOutput,
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
 * Creates a response plan that automates the initial response to incidents. A response plan
 * engages contacts, starts chat channel collaboration, and initiates runbooks at the beginning
 * of an incident.
 */
export const createResponsePlan: (
  input: CreateResponsePlanInput,
) => effect.Effect<
  CreateResponsePlanOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResponsePlanInput,
  output: CreateResponsePlanOutput,
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
 * Lists all incident records in your account. Use this command to retrieve the Amazon
 * Resource Name (ARN) of the incident record you want to update.
 */
export const listIncidentRecords: {
  (
    input: ListIncidentRecordsInput,
  ): effect.Effect<
    ListIncidentRecordsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIncidentRecordsInput,
  ) => stream.Stream<
    ListIncidentRecordsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIncidentRecordsInput,
  ) => stream.Stream<
    IncidentRecordSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIncidentRecordsInput,
  output: ListIncidentRecordsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "incidentRecordSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Used to start an incident from CloudWatch alarms, EventBridge events, or
 * manually.
 */
export const startIncident: (
  input: StartIncidentInput,
) => effect.Effect<
  StartIncidentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartIncidentInput,
  output: StartIncidentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
