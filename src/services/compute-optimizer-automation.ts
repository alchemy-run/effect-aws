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
  sdkId: "Compute Optimizer Automation",
  serviceShapeName: "ComputeOptimizerAutomationService",
});
const auth = T.AwsAuthSigv4({ name: "aco-automation" });
const ver = T.ServiceVersion("2025-09-22");
const proto = T.AwsProtocolsAwsJson1_0();
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
              `https://aco-automation-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://aco-automation-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://aco-automation.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://aco-automation.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AccountId = string;
export type ClientToken = string;
export type RuleName = string;
export type RuleDescription = string;
export type RuleArn = string;
export type EventId = string;
export type NextToken = string;
export type RecommendedActionId = string;
export type TagKey = string;
export type TagValue = string;
export type AutomationEventFilterName = string;
export type FilterValue = string;
export type AutomationRuleFilterName = string;
export type RecommendedActionFilterName = string;
export type ResourceArn = string;
export type ResourceId = string;
export type RuleId = string;
export type StringCriteriaValue = string;
export type StepId = string;
export type SummaryDimensionKey = string;

//# Schemas
export interface GetEnrollmentConfigurationRequest {}
export const GetEnrollmentConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEnrollmentConfigurationRequest",
}) as any as S.Schema<GetEnrollmentConfigurationRequest>;
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String);
export type RuleType = "OrganizationRule" | "AccountRule" | (string & {});
export const RuleType = S.String;
export type RecommendedActionType =
  | "SnapshotAndDeleteUnattachedEbsVolume"
  | "UpgradeEbsVolumeType"
  | (string & {});
export const RecommendedActionType = S.String;
export type RecommendedActionTypeList = RecommendedActionType[];
export const RecommendedActionTypeList = S.Array(RecommendedActionType);
export type RuleStatus = "Active" | "Inactive" | (string & {});
export const RuleStatus = S.String;
export type EnrollmentStatus =
  | "Active"
  | "Inactive"
  | "Pending"
  | "Failed"
  | (string & {});
export const EnrollmentStatus = S.String;
export type OrganizationRuleMode = "AnyAllowed" | "NoneAllowed" | (string & {});
export const OrganizationRuleMode = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateAccountsRequest {
  accountIds: string[];
  clientToken?: string;
}
export const AssociateAccountsRequest = S.suspend(() =>
  S.Struct({
    accountIds: AccountIdList,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateAccountsRequest",
}) as any as S.Schema<AssociateAccountsRequest>;
export interface DeleteAutomationRuleRequest {
  ruleArn: string;
  ruleRevision: number;
  clientToken?: string;
}
export const DeleteAutomationRuleRequest = S.suspend(() =>
  S.Struct({
    ruleArn: S.String,
    ruleRevision: S.Number,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAutomationRuleRequest",
}) as any as S.Schema<DeleteAutomationRuleRequest>;
export interface DeleteAutomationRuleResponse {}
export const DeleteAutomationRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAutomationRuleResponse",
}) as any as S.Schema<DeleteAutomationRuleResponse>;
export interface DisassociateAccountsRequest {
  accountIds: string[];
  clientToken?: string;
}
export const DisassociateAccountsRequest = S.suspend(() =>
  S.Struct({
    accountIds: AccountIdList,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateAccountsRequest",
}) as any as S.Schema<DisassociateAccountsRequest>;
export interface GetAutomationEventRequest {
  eventId: string;
}
export const GetAutomationEventRequest = S.suspend(() =>
  S.Struct({ eventId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAutomationEventRequest",
}) as any as S.Schema<GetAutomationEventRequest>;
export interface GetAutomationRuleRequest {
  ruleArn: string;
}
export const GetAutomationRuleRequest = S.suspend(() =>
  S.Struct({ ruleArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAutomationRuleRequest",
}) as any as S.Schema<GetAutomationRuleRequest>;
export interface GetEnrollmentConfigurationResponse {
  status: EnrollmentStatus;
  statusReason?: string;
  organizationRuleMode?: OrganizationRuleMode;
  lastUpdatedTimestamp?: Date;
}
export const GetEnrollmentConfigurationResponse = S.suspend(() =>
  S.Struct({
    status: EnrollmentStatus,
    statusReason: S.optional(S.String),
    organizationRuleMode: S.optional(OrganizationRuleMode),
    lastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetEnrollmentConfigurationResponse",
}) as any as S.Schema<GetEnrollmentConfigurationResponse>;
export interface ListAccountsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListAccountsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAccountsRequest",
}) as any as S.Schema<ListAccountsRequest>;
export interface ListAutomationEventStepsRequest {
  eventId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAutomationEventStepsRequest = S.suspend(() =>
  S.Struct({
    eventId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAutomationEventStepsRequest",
}) as any as S.Schema<ListAutomationEventStepsRequest>;
export type FilterValues = string[];
export const FilterValues = S.Array(S.String);
export interface AutomationEventFilter {
  name: string;
  values: string[];
}
export const AutomationEventFilter = S.suspend(() =>
  S.Struct({ name: S.String, values: FilterValues }),
).annotations({
  identifier: "AutomationEventFilter",
}) as any as S.Schema<AutomationEventFilter>;
export type AutomationEventFilterList = AutomationEventFilter[];
export const AutomationEventFilterList = S.Array(AutomationEventFilter);
export interface ListAutomationEventSummariesRequest {
  filters?: AutomationEventFilter[];
  startDateInclusive?: string;
  endDateExclusive?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListAutomationEventSummariesRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(AutomationEventFilterList),
    startDateInclusive: S.optional(S.String),
    endDateExclusive: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAutomationEventSummariesRequest",
}) as any as S.Schema<ListAutomationEventSummariesRequest>;
export type OrganizationConfigurationAccountIds = string[];
export const OrganizationConfigurationAccountIds = S.Array(S.String);
export interface OrganizationScope {
  accountIds?: string[];
}
export const OrganizationScope = S.suspend(() =>
  S.Struct({ accountIds: S.optional(OrganizationConfigurationAccountIds) }),
).annotations({
  identifier: "OrganizationScope",
}) as any as S.Schema<OrganizationScope>;
export type ComparisonOperator =
  | "StringEquals"
  | "StringNotEquals"
  | "StringEqualsIgnoreCase"
  | "StringNotEqualsIgnoreCase"
  | "StringLike"
  | "StringNotLike"
  | "NumericEquals"
  | "NumericNotEquals"
  | "NumericLessThan"
  | "NumericLessThanEquals"
  | "NumericGreaterThan"
  | "NumericGreaterThanEquals"
  | (string & {});
export const ComparisonOperator = S.String;
export type StringCriteriaValues = string[];
export const StringCriteriaValues = S.Array(S.String);
export interface StringCriteriaCondition {
  comparison?: ComparisonOperator;
  values?: string[];
}
export const StringCriteriaCondition = S.suspend(() =>
  S.Struct({
    comparison: S.optional(ComparisonOperator),
    values: S.optional(StringCriteriaValues),
  }),
).annotations({
  identifier: "StringCriteriaCondition",
}) as any as S.Schema<StringCriteriaCondition>;
export type StringCriteriaConditionList = StringCriteriaCondition[];
export const StringCriteriaConditionList = S.Array(StringCriteriaCondition);
export type IntegerList = number[];
export const IntegerList = S.Array(S.Number);
export interface IntegerCriteriaCondition {
  comparison?: ComparisonOperator;
  values?: number[];
}
export const IntegerCriteriaCondition = S.suspend(() =>
  S.Struct({
    comparison: S.optional(ComparisonOperator),
    values: S.optional(IntegerList),
  }),
).annotations({
  identifier: "IntegerCriteriaCondition",
}) as any as S.Schema<IntegerCriteriaCondition>;
export type IntegerCriteriaConditionList = IntegerCriteriaCondition[];
export const IntegerCriteriaConditionList = S.Array(IntegerCriteriaCondition);
export type DoubleList = number[];
export const DoubleList = S.Array(S.Number);
export interface DoubleCriteriaCondition {
  comparison?: ComparisonOperator;
  values?: number[];
}
export const DoubleCriteriaCondition = S.suspend(() =>
  S.Struct({
    comparison: S.optional(ComparisonOperator),
    values: S.optional(DoubleList),
  }),
).annotations({
  identifier: "DoubleCriteriaCondition",
}) as any as S.Schema<DoubleCriteriaCondition>;
export type DoubleCriteriaConditionList = DoubleCriteriaCondition[];
export const DoubleCriteriaConditionList = S.Array(DoubleCriteriaCondition);
export interface ResourceTagsCriteriaCondition {
  comparison?: ComparisonOperator;
  key?: string;
  values?: string[];
}
export const ResourceTagsCriteriaCondition = S.suspend(() =>
  S.Struct({
    comparison: S.optional(ComparisonOperator),
    key: S.optional(S.String),
    values: S.optional(StringCriteriaValues),
  }),
).annotations({
  identifier: "ResourceTagsCriteriaCondition",
}) as any as S.Schema<ResourceTagsCriteriaCondition>;
export type ResourceTagsCriteriaConditionList = ResourceTagsCriteriaCondition[];
export const ResourceTagsCriteriaConditionList = S.Array(
  ResourceTagsCriteriaCondition,
);
export interface Criteria {
  region?: StringCriteriaCondition[];
  resourceArn?: StringCriteriaCondition[];
  ebsVolumeType?: StringCriteriaCondition[];
  ebsVolumeSizeInGib?: IntegerCriteriaCondition[];
  estimatedMonthlySavings?: DoubleCriteriaCondition[];
  resourceTag?: ResourceTagsCriteriaCondition[];
  lookBackPeriodInDays?: IntegerCriteriaCondition[];
  restartNeeded?: StringCriteriaCondition[];
}
export const Criteria = S.suspend(() =>
  S.Struct({
    region: S.optional(StringCriteriaConditionList),
    resourceArn: S.optional(StringCriteriaConditionList),
    ebsVolumeType: S.optional(StringCriteriaConditionList),
    ebsVolumeSizeInGib: S.optional(IntegerCriteriaConditionList),
    estimatedMonthlySavings: S.optional(DoubleCriteriaConditionList),
    resourceTag: S.optional(ResourceTagsCriteriaConditionList),
    lookBackPeriodInDays: S.optional(IntegerCriteriaConditionList),
    restartNeeded: S.optional(StringCriteriaConditionList),
  }),
).annotations({ identifier: "Criteria" }) as any as S.Schema<Criteria>;
export interface ListAutomationRulePreviewSummariesRequest {
  ruleType: RuleType;
  organizationScope?: OrganizationScope;
  recommendedActionTypes: RecommendedActionType[];
  criteria?: Criteria;
  maxResults?: number;
  nextToken?: string;
}
export const ListAutomationRulePreviewSummariesRequest = S.suspend(() =>
  S.Struct({
    ruleType: RuleType,
    organizationScope: S.optional(OrganizationScope),
    recommendedActionTypes: RecommendedActionTypeList,
    criteria: S.optional(Criteria),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAutomationRulePreviewSummariesRequest",
}) as any as S.Schema<ListAutomationRulePreviewSummariesRequest>;
export interface RecommendedActionFilter {
  name: string;
  values: string[];
}
export const RecommendedActionFilter = S.suspend(() =>
  S.Struct({ name: S.String, values: FilterValues }),
).annotations({
  identifier: "RecommendedActionFilter",
}) as any as S.Schema<RecommendedActionFilter>;
export type RecommendedActionFilterList = RecommendedActionFilter[];
export const RecommendedActionFilterList = S.Array(RecommendedActionFilter);
export interface ListRecommendedActionSummariesRequest {
  filters?: RecommendedActionFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListRecommendedActionSummariesRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(RecommendedActionFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRecommendedActionSummariesRequest",
}) as any as S.Schema<ListRecommendedActionSummariesRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface RollbackAutomationEventRequest {
  eventId: string;
  clientToken?: string;
}
export const RollbackAutomationEventRequest = S.suspend(() =>
  S.Struct({
    eventId: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RollbackAutomationEventRequest",
}) as any as S.Schema<RollbackAutomationEventRequest>;
export interface StartAutomationEventRequest {
  recommendedActionId: string;
  clientToken?: string;
}
export const StartAutomationEventRequest = S.suspend(() =>
  S.Struct({
    recommendedActionId: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartAutomationEventRequest",
}) as any as S.Schema<StartAutomationEventRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  resourceArn: string;
  ruleRevision: number;
  tags: Tag[];
  clientToken?: string;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    ruleRevision: S.Number,
    tags: TagList,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
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
  resourceArn: string;
  ruleRevision: number;
  tagKeys: string[];
  clientToken?: string;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    ruleRevision: S.Number,
    tagKeys: TagKeyList,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type RuleApplyOrder =
  | "BeforeAccountRules"
  | "AfterAccountRules"
  | (string & {});
export const RuleApplyOrder = S.String;
export interface OrganizationConfiguration {
  ruleApplyOrder?: RuleApplyOrder;
  accountIds?: string[];
}
export const OrganizationConfiguration = S.suspend(() =>
  S.Struct({
    ruleApplyOrder: S.optional(RuleApplyOrder),
    accountIds: S.optional(OrganizationConfigurationAccountIds),
  }),
).annotations({
  identifier: "OrganizationConfiguration",
}) as any as S.Schema<OrganizationConfiguration>;
export interface Schedule {
  scheduleExpression?: string;
  scheduleExpressionTimezone?: string;
  executionWindowInMinutes?: number;
}
export const Schedule = S.suspend(() =>
  S.Struct({
    scheduleExpression: S.optional(S.String),
    scheduleExpressionTimezone: S.optional(S.String),
    executionWindowInMinutes: S.optional(S.Number),
  }),
).annotations({ identifier: "Schedule" }) as any as S.Schema<Schedule>;
export interface UpdateAutomationRuleRequest {
  ruleArn: string;
  ruleRevision: number;
  name?: string;
  description?: string;
  ruleType?: RuleType;
  organizationConfiguration?: OrganizationConfiguration;
  priority?: string;
  recommendedActionTypes?: RecommendedActionType[];
  criteria?: Criteria;
  schedule?: Schedule;
  status?: RuleStatus;
  clientToken?: string;
}
export const UpdateAutomationRuleRequest = S.suspend(() =>
  S.Struct({
    ruleArn: S.String,
    ruleRevision: S.Number,
    name: S.optional(S.String),
    description: S.optional(S.String),
    ruleType: S.optional(RuleType),
    organizationConfiguration: S.optional(OrganizationConfiguration),
    priority: S.optional(S.String),
    recommendedActionTypes: S.optional(RecommendedActionTypeList),
    criteria: S.optional(Criteria),
    schedule: S.optional(Schedule),
    status: S.optional(RuleStatus),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAutomationRuleRequest",
}) as any as S.Schema<UpdateAutomationRuleRequest>;
export interface UpdateEnrollmentConfigurationRequest {
  status: EnrollmentStatus;
  clientToken?: string;
}
export const UpdateEnrollmentConfigurationRequest = S.suspend(() =>
  S.Struct({
    status: EnrollmentStatus,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEnrollmentConfigurationRequest",
}) as any as S.Schema<UpdateEnrollmentConfigurationRequest>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export type EventType =
  | "SnapshotAndDeleteUnattachedEbsVolume"
  | "UpgradeEbsVolumeType"
  | (string & {});
export const EventType = S.String;
export type EventStatus =
  | "Ready"
  | "InProgress"
  | "Complete"
  | "Failed"
  | "Cancelled"
  | "RollbackReady"
  | "RollbackInProgress"
  | "RollbackComplete"
  | "RollbackFailed"
  | (string & {});
export const EventStatus = S.String;
export type ResourceType = "EbsVolume" | (string & {});
export const ResourceType = S.String;
export interface Filter {
  name: string;
  values: string[];
}
export const Filter = S.suspend(() =>
  S.Struct({ name: S.String, values: FilterValues }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface AssociateAccountsResponse {
  accountIds?: string[];
  errors?: string[];
}
export const AssociateAccountsResponse = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIdList),
    errors: S.optional(StringList),
  }),
).annotations({
  identifier: "AssociateAccountsResponse",
}) as any as S.Schema<AssociateAccountsResponse>;
export interface DisassociateAccountsResponse {
  accountIds?: string[];
  errors?: string[];
}
export const DisassociateAccountsResponse = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIdList),
    errors: S.optional(StringList),
  }),
).annotations({
  identifier: "DisassociateAccountsResponse",
}) as any as S.Schema<DisassociateAccountsResponse>;
export interface GetAutomationRuleResponse {
  ruleArn?: string;
  ruleId?: string;
  name?: string;
  description?: string;
  ruleType?: RuleType;
  ruleRevision?: number;
  accountId?: string;
  organizationConfiguration?: OrganizationConfiguration;
  priority?: string;
  recommendedActionTypes?: RecommendedActionType[];
  criteria?: Criteria;
  schedule?: Schedule;
  status?: RuleStatus;
  tags?: Tag[];
  createdTimestamp?: Date;
  lastUpdatedTimestamp?: Date;
}
export const GetAutomationRuleResponse = S.suspend(() =>
  S.Struct({
    ruleArn: S.optional(S.String),
    ruleId: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    ruleType: S.optional(RuleType),
    ruleRevision: S.optional(S.Number),
    accountId: S.optional(S.String),
    organizationConfiguration: S.optional(OrganizationConfiguration),
    priority: S.optional(S.String),
    recommendedActionTypes: S.optional(RecommendedActionTypeList),
    criteria: S.optional(Criteria),
    schedule: S.optional(Schedule),
    status: S.optional(RuleStatus),
    tags: S.optional(TagList),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetAutomationRuleResponse",
}) as any as S.Schema<GetAutomationRuleResponse>;
export interface ListAutomationEventsRequest {
  filters?: AutomationEventFilter[];
  startTimeInclusive?: Date;
  endTimeExclusive?: Date;
  maxResults?: number;
  nextToken?: string;
}
export const ListAutomationEventsRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(AutomationEventFilterList),
    startTimeInclusive: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    endTimeExclusive: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAutomationEventsRequest",
}) as any as S.Schema<ListAutomationEventsRequest>;
export interface ListAutomationRulePreviewRequest {
  ruleType: RuleType;
  organizationScope?: OrganizationScope;
  recommendedActionTypes: RecommendedActionType[];
  criteria?: Criteria;
  maxResults?: number;
  nextToken?: string;
}
export const ListAutomationRulePreviewRequest = S.suspend(() =>
  S.Struct({
    ruleType: RuleType,
    organizationScope: S.optional(OrganizationScope),
    recommendedActionTypes: RecommendedActionTypeList,
    criteria: S.optional(Criteria),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAutomationRulePreviewRequest",
}) as any as S.Schema<ListAutomationRulePreviewRequest>;
export interface ListAutomationRulesRequest {
  filters?: Filter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListAutomationRulesRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAutomationRulesRequest",
}) as any as S.Schema<ListAutomationRulesRequest>;
export interface ListRecommendedActionsRequest {
  filters?: RecommendedActionFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListRecommendedActionsRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(RecommendedActionFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRecommendedActionsRequest",
}) as any as S.Schema<ListRecommendedActionsRequest>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RollbackAutomationEventResponse {
  eventId?: string;
  eventStatus?: EventStatus;
}
export const RollbackAutomationEventResponse = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    eventStatus: S.optional(EventStatus),
  }),
).annotations({
  identifier: "RollbackAutomationEventResponse",
}) as any as S.Schema<RollbackAutomationEventResponse>;
export interface StartAutomationEventResponse {
  recommendedActionId?: string;
  eventId?: string;
  eventStatus?: EventStatus;
}
export const StartAutomationEventResponse = S.suspend(() =>
  S.Struct({
    recommendedActionId: S.optional(S.String),
    eventId: S.optional(S.String),
    eventStatus: S.optional(EventStatus),
  }),
).annotations({
  identifier: "StartAutomationEventResponse",
}) as any as S.Schema<StartAutomationEventResponse>;
export interface UpdateAutomationRuleResponse {
  ruleArn?: string;
  ruleRevision?: number;
  name?: string;
  description?: string;
  ruleType?: RuleType;
  organizationConfiguration?: OrganizationConfiguration;
  priority?: string;
  recommendedActionTypes?: RecommendedActionType[];
  criteria?: Criteria;
  schedule?: Schedule;
  status?: RuleStatus;
  createdTimestamp?: Date;
  lastUpdatedTimestamp?: Date;
}
export const UpdateAutomationRuleResponse = S.suspend(() =>
  S.Struct({
    ruleArn: S.optional(S.String),
    ruleRevision: S.optional(S.Number),
    name: S.optional(S.String),
    description: S.optional(S.String),
    ruleType: S.optional(RuleType),
    organizationConfiguration: S.optional(OrganizationConfiguration),
    priority: S.optional(S.String),
    recommendedActionTypes: S.optional(RecommendedActionTypeList),
    criteria: S.optional(Criteria),
    schedule: S.optional(Schedule),
    status: S.optional(RuleStatus),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateAutomationRuleResponse",
}) as any as S.Schema<UpdateAutomationRuleResponse>;
export interface UpdateEnrollmentConfigurationResponse {
  status: EnrollmentStatus;
  statusReason?: string;
  lastUpdatedTimestamp: Date;
}
export const UpdateEnrollmentConfigurationResponse = S.suspend(() =>
  S.Struct({
    status: EnrollmentStatus,
    statusReason: S.optional(S.String),
    lastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "UpdateEnrollmentConfigurationResponse",
}) as any as S.Schema<UpdateEnrollmentConfigurationResponse>;
export type SavingsEstimationMode =
  | "BeforeDiscount"
  | "AfterDiscount"
  | (string & {});
export const SavingsEstimationMode = S.String;
export type StepType =
  | "CreateEbsSnapshot"
  | "DeleteEbsVolume"
  | "ModifyEbsVolume"
  | "CreateEbsVolume"
  | (string & {});
export const StepType = S.String;
export type StepStatus =
  | "Ready"
  | "InProgress"
  | "Complete"
  | "Failed"
  | (string & {});
export const StepStatus = S.String;
export interface EstimatedMonthlySavings {
  currency: string;
  beforeDiscountSavings: number;
  afterDiscountSavings: number;
  savingsEstimationMode: SavingsEstimationMode;
}
export const EstimatedMonthlySavings = S.suspend(() =>
  S.Struct({
    currency: S.String,
    beforeDiscountSavings: S.Number,
    afterDiscountSavings: S.Number,
    savingsEstimationMode: SavingsEstimationMode,
  }),
).annotations({
  identifier: "EstimatedMonthlySavings",
}) as any as S.Schema<EstimatedMonthlySavings>;
export interface AccountInfo {
  accountId: string;
  status: EnrollmentStatus;
  organizationRuleMode: OrganizationRuleMode;
  statusReason?: string;
  lastUpdatedTimestamp: Date;
}
export const AccountInfo = S.suspend(() =>
  S.Struct({
    accountId: S.String,
    status: EnrollmentStatus,
    organizationRuleMode: OrganizationRuleMode,
    statusReason: S.optional(S.String),
    lastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "AccountInfo" }) as any as S.Schema<AccountInfo>;
export type AccountInfoList = AccountInfo[];
export const AccountInfoList = S.Array(AccountInfo);
export interface AutomationEventStep {
  eventId?: string;
  stepId?: string;
  stepType?: StepType;
  stepStatus?: StepStatus;
  resourceId?: string;
  startTimestamp?: Date;
  completedTimestamp?: Date;
  estimatedMonthlySavings?: EstimatedMonthlySavings;
}
export const AutomationEventStep = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    stepId: S.optional(S.String),
    stepType: S.optional(StepType),
    stepStatus: S.optional(StepStatus),
    resourceId: S.optional(S.String),
    startTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    completedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
  }),
).annotations({
  identifier: "AutomationEventStep",
}) as any as S.Schema<AutomationEventStep>;
export type AutomationEventSteps = AutomationEventStep[];
export const AutomationEventSteps = S.Array(AutomationEventStep);
export interface CreateAutomationRuleRequest {
  name: string;
  description?: string;
  ruleType: RuleType;
  organizationConfiguration?: OrganizationConfiguration;
  priority?: string;
  recommendedActionTypes: RecommendedActionType[];
  criteria?: Criteria;
  schedule: Schedule;
  status: RuleStatus;
  tags?: Tag[];
  clientToken?: string;
}
export const CreateAutomationRuleRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    ruleType: RuleType,
    organizationConfiguration: S.optional(OrganizationConfiguration),
    priority: S.optional(S.String),
    recommendedActionTypes: RecommendedActionTypeList,
    criteria: S.optional(Criteria),
    schedule: Schedule,
    status: RuleStatus,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAutomationRuleRequest",
}) as any as S.Schema<CreateAutomationRuleRequest>;
export interface GetAutomationEventResponse {
  eventId?: string;
  eventDescription?: string;
  eventType?: EventType;
  eventStatus?: EventStatus;
  eventStatusReason?: string;
  resourceArn?: string;
  resourceId?: string;
  recommendedActionId?: string;
  accountId?: string;
  region?: string;
  ruleId?: string;
  resourceType?: ResourceType;
  createdTimestamp?: Date;
  completedTimestamp?: Date;
  estimatedMonthlySavings?: EstimatedMonthlySavings;
}
export const GetAutomationEventResponse = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    eventDescription: S.optional(S.String),
    eventType: S.optional(EventType),
    eventStatus: S.optional(EventStatus),
    eventStatusReason: S.optional(S.String),
    resourceArn: S.optional(S.String),
    resourceId: S.optional(S.String),
    recommendedActionId: S.optional(S.String),
    accountId: S.optional(S.String),
    region: S.optional(S.String),
    ruleId: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    completedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
  }),
).annotations({
  identifier: "GetAutomationEventResponse",
}) as any as S.Schema<GetAutomationEventResponse>;
export interface ListAccountsResponse {
  accounts: AccountInfo[];
  nextToken?: string;
}
export const ListAccountsResponse = S.suspend(() =>
  S.Struct({ accounts: AccountInfoList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAccountsResponse",
}) as any as S.Schema<ListAccountsResponse>;
export interface ListAutomationEventStepsResponse {
  automationEventSteps?: AutomationEventStep[];
  nextToken?: string;
}
export const ListAutomationEventStepsResponse = S.suspend(() =>
  S.Struct({
    automationEventSteps: S.optional(AutomationEventSteps),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutomationEventStepsResponse",
}) as any as S.Schema<ListAutomationEventStepsResponse>;
export interface SummaryDimension {
  key: string;
  value: string;
}
export const SummaryDimension = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({
  identifier: "SummaryDimension",
}) as any as S.Schema<SummaryDimension>;
export type SummaryDimensions = SummaryDimension[];
export const SummaryDimensions = S.Array(SummaryDimension);
export interface TimePeriod {
  startTimeInclusive?: Date;
  endTimeExclusive?: Date;
}
export const TimePeriod = S.suspend(() =>
  S.Struct({
    startTimeInclusive: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    endTimeExclusive: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "TimePeriod" }) as any as S.Schema<TimePeriod>;
export interface SummaryTotals {
  automationEventCount?: number;
  estimatedMonthlySavings?: EstimatedMonthlySavings;
}
export const SummaryTotals = S.suspend(() =>
  S.Struct({
    automationEventCount: S.optional(S.Number),
    estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
  }),
).annotations({
  identifier: "SummaryTotals",
}) as any as S.Schema<SummaryTotals>;
export interface RulePreviewTotal {
  recommendedActionCount: number;
  estimatedMonthlySavings: EstimatedMonthlySavings;
}
export const RulePreviewTotal = S.suspend(() =>
  S.Struct({
    recommendedActionCount: S.Number,
    estimatedMonthlySavings: EstimatedMonthlySavings,
  }),
).annotations({
  identifier: "RulePreviewTotal",
}) as any as S.Schema<RulePreviewTotal>;
export interface RecommendedActionTotal {
  recommendedActionCount: number;
  estimatedMonthlySavings: EstimatedMonthlySavings;
}
export const RecommendedActionTotal = S.suspend(() =>
  S.Struct({
    recommendedActionCount: S.Number,
    estimatedMonthlySavings: EstimatedMonthlySavings,
  }),
).annotations({
  identifier: "RecommendedActionTotal",
}) as any as S.Schema<RecommendedActionTotal>;
export interface AutomationEvent {
  eventId?: string;
  eventDescription?: string;
  eventType?: EventType;
  eventStatus?: EventStatus;
  eventStatusReason?: string;
  resourceArn?: string;
  resourceId?: string;
  recommendedActionId?: string;
  accountId?: string;
  region?: string;
  ruleId?: string;
  resourceType?: ResourceType;
  createdTimestamp?: Date;
  completedTimestamp?: Date;
  estimatedMonthlySavings?: EstimatedMonthlySavings;
}
export const AutomationEvent = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    eventDescription: S.optional(S.String),
    eventType: S.optional(EventType),
    eventStatus: S.optional(EventStatus),
    eventStatusReason: S.optional(S.String),
    resourceArn: S.optional(S.String),
    resourceId: S.optional(S.String),
    recommendedActionId: S.optional(S.String),
    accountId: S.optional(S.String),
    region: S.optional(S.String),
    ruleId: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    completedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
  }),
).annotations({
  identifier: "AutomationEvent",
}) as any as S.Schema<AutomationEvent>;
export type AutomationEvents = AutomationEvent[];
export const AutomationEvents = S.Array(AutomationEvent);
export interface AutomationEventSummary {
  key?: string;
  dimensions?: SummaryDimension[];
  timePeriod?: TimePeriod;
  total?: SummaryTotals;
}
export const AutomationEventSummary = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String),
    dimensions: S.optional(SummaryDimensions),
    timePeriod: S.optional(TimePeriod),
    total: S.optional(SummaryTotals),
  }),
).annotations({
  identifier: "AutomationEventSummary",
}) as any as S.Schema<AutomationEventSummary>;
export type AutomationEventSummaryList = AutomationEventSummary[];
export const AutomationEventSummaryList = S.Array(AutomationEventSummary);
export interface PreviewResultSummary {
  key: string;
  total: RulePreviewTotal;
}
export const PreviewResultSummary = S.suspend(() =>
  S.Struct({ key: S.String, total: RulePreviewTotal }),
).annotations({
  identifier: "PreviewResultSummary",
}) as any as S.Schema<PreviewResultSummary>;
export type PreviewResultSummaries = PreviewResultSummary[];
export const PreviewResultSummaries = S.Array(PreviewResultSummary);
export interface AutomationRule {
  ruleArn?: string;
  ruleId?: string;
  name?: string;
  description?: string;
  ruleType?: RuleType;
  ruleRevision?: number;
  accountId?: string;
  organizationConfiguration?: OrganizationConfiguration;
  priority?: string;
  recommendedActionTypes?: RecommendedActionType[];
  schedule?: Schedule;
  status?: RuleStatus;
  createdTimestamp?: Date;
  lastUpdatedTimestamp?: Date;
}
export const AutomationRule = S.suspend(() =>
  S.Struct({
    ruleArn: S.optional(S.String),
    ruleId: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    ruleType: S.optional(RuleType),
    ruleRevision: S.optional(S.Number),
    accountId: S.optional(S.String),
    organizationConfiguration: S.optional(OrganizationConfiguration),
    priority: S.optional(S.String),
    recommendedActionTypes: S.optional(RecommendedActionTypeList),
    schedule: S.optional(Schedule),
    status: S.optional(RuleStatus),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "AutomationRule",
}) as any as S.Schema<AutomationRule>;
export type AutomationRules = AutomationRule[];
export const AutomationRules = S.Array(AutomationRule);
export interface EbsVolumeConfiguration {
  type?: string;
  sizeInGib?: number;
  iops?: number;
  throughput?: number;
}
export const EbsVolumeConfiguration = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    sizeInGib: S.optional(S.Number),
    iops: S.optional(S.Number),
    throughput: S.optional(S.Number),
  }),
).annotations({
  identifier: "EbsVolumeConfiguration",
}) as any as S.Schema<EbsVolumeConfiguration>;
export interface EbsVolume {
  configuration?: EbsVolumeConfiguration;
}
export const EbsVolume = S.suspend(() =>
  S.Struct({ configuration: S.optional(EbsVolumeConfiguration) }),
).annotations({ identifier: "EbsVolume" }) as any as S.Schema<EbsVolume>;
export type ResourceDetails = { ebsVolume: EbsVolume };
export const ResourceDetails = S.Union(S.Struct({ ebsVolume: EbsVolume }));
export interface RecommendedAction {
  recommendedActionId?: string;
  resourceArn?: string;
  resourceId?: string;
  accountId?: string;
  region?: string;
  resourceType?: ResourceType;
  lookBackPeriodInDays?: number;
  recommendedActionType?: RecommendedActionType;
  currentResourceSummary?: string;
  currentResourceDetails?: ResourceDetails;
  recommendedResourceSummary?: string;
  recommendedResourceDetails?: ResourceDetails;
  restartNeeded?: boolean;
  estimatedMonthlySavings?: EstimatedMonthlySavings;
  resourceTags?: Tag[];
}
export const RecommendedAction = S.suspend(() =>
  S.Struct({
    recommendedActionId: S.optional(S.String),
    resourceArn: S.optional(S.String),
    resourceId: S.optional(S.String),
    accountId: S.optional(S.String),
    region: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    lookBackPeriodInDays: S.optional(S.Number),
    recommendedActionType: S.optional(RecommendedActionType),
    currentResourceSummary: S.optional(S.String),
    currentResourceDetails: S.optional(ResourceDetails),
    recommendedResourceSummary: S.optional(S.String),
    recommendedResourceDetails: S.optional(ResourceDetails),
    restartNeeded: S.optional(S.Boolean),
    estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
    resourceTags: S.optional(TagList),
  }),
).annotations({
  identifier: "RecommendedAction",
}) as any as S.Schema<RecommendedAction>;
export type RecommendedActions = RecommendedAction[];
export const RecommendedActions = S.Array(RecommendedAction);
export interface RecommendedActionSummary {
  key: string;
  total: RecommendedActionTotal;
}
export const RecommendedActionSummary = S.suspend(() =>
  S.Struct({ key: S.String, total: RecommendedActionTotal }),
).annotations({
  identifier: "RecommendedActionSummary",
}) as any as S.Schema<RecommendedActionSummary>;
export type RecommendedActionSummaries = RecommendedActionSummary[];
export const RecommendedActionSummaries = S.Array(RecommendedActionSummary);
export interface CreateAutomationRuleResponse {
  ruleArn?: string;
  ruleId?: string;
  name?: string;
  description?: string;
  ruleType?: RuleType;
  ruleRevision?: number;
  organizationConfiguration?: OrganizationConfiguration;
  priority?: string;
  recommendedActionTypes?: RecommendedActionType[];
  criteria?: Criteria;
  schedule?: Schedule;
  status?: RuleStatus;
  tags?: Tag[];
  createdTimestamp?: Date;
}
export const CreateAutomationRuleResponse = S.suspend(() =>
  S.Struct({
    ruleArn: S.optional(S.String),
    ruleId: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    ruleType: S.optional(RuleType),
    ruleRevision: S.optional(S.Number),
    organizationConfiguration: S.optional(OrganizationConfiguration),
    priority: S.optional(S.String),
    recommendedActionTypes: S.optional(RecommendedActionTypeList),
    criteria: S.optional(Criteria),
    schedule: S.optional(Schedule),
    status: S.optional(RuleStatus),
    tags: S.optional(TagList),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreateAutomationRuleResponse",
}) as any as S.Schema<CreateAutomationRuleResponse>;
export interface ListAutomationEventsResponse {
  automationEvents?: AutomationEvent[];
  nextToken?: string;
}
export const ListAutomationEventsResponse = S.suspend(() =>
  S.Struct({
    automationEvents: S.optional(AutomationEvents),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutomationEventsResponse",
}) as any as S.Schema<ListAutomationEventsResponse>;
export interface ListAutomationEventSummariesResponse {
  automationEventSummaries?: AutomationEventSummary[];
  nextToken?: string;
}
export const ListAutomationEventSummariesResponse = S.suspend(() =>
  S.Struct({
    automationEventSummaries: S.optional(AutomationEventSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutomationEventSummariesResponse",
}) as any as S.Schema<ListAutomationEventSummariesResponse>;
export interface ListAutomationRulePreviewSummariesResponse {
  previewResultSummaries?: PreviewResultSummary[];
  nextToken?: string;
}
export const ListAutomationRulePreviewSummariesResponse = S.suspend(() =>
  S.Struct({
    previewResultSummaries: S.optional(PreviewResultSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutomationRulePreviewSummariesResponse",
}) as any as S.Schema<ListAutomationRulePreviewSummariesResponse>;
export interface ListAutomationRulesResponse {
  automationRules?: AutomationRule[];
  nextToken?: string;
}
export const ListAutomationRulesResponse = S.suspend(() =>
  S.Struct({
    automationRules: S.optional(AutomationRules),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutomationRulesResponse",
}) as any as S.Schema<ListAutomationRulesResponse>;
export interface ListRecommendedActionsResponse {
  recommendedActions?: RecommendedAction[];
  nextToken?: string;
}
export const ListRecommendedActionsResponse = S.suspend(() =>
  S.Struct({
    recommendedActions: S.optional(RecommendedActions),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommendedActionsResponse",
}) as any as S.Schema<ListRecommendedActionsResponse>;
export interface ListRecommendedActionSummariesResponse {
  recommendedActionSummaries?: RecommendedActionSummary[];
  nextToken?: string;
}
export const ListRecommendedActionSummariesResponse = S.suspend(() =>
  S.Struct({
    recommendedActionSummaries: S.optional(RecommendedActionSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommendedActionSummariesResponse",
}) as any as S.Schema<ListRecommendedActionSummariesResponse>;
export interface PreviewResult {
  recommendedActionId?: string;
  resourceArn?: string;
  resourceId?: string;
  accountId?: string;
  region?: string;
  resourceType?: ResourceType;
  lookBackPeriodInDays?: number;
  recommendedActionType?: RecommendedActionType;
  currentResourceSummary?: string;
  currentResourceDetails?: ResourceDetails;
  recommendedResourceSummary?: string;
  recommendedResourceDetails?: ResourceDetails;
  restartNeeded?: boolean;
  estimatedMonthlySavings?: EstimatedMonthlySavings;
  resourceTags?: Tag[];
}
export const PreviewResult = S.suspend(() =>
  S.Struct({
    recommendedActionId: S.optional(S.String),
    resourceArn: S.optional(S.String),
    resourceId: S.optional(S.String),
    accountId: S.optional(S.String),
    region: S.optional(S.String),
    resourceType: S.optional(ResourceType),
    lookBackPeriodInDays: S.optional(S.Number),
    recommendedActionType: S.optional(RecommendedActionType),
    currentResourceSummary: S.optional(S.String),
    currentResourceDetails: S.optional(ResourceDetails),
    recommendedResourceSummary: S.optional(S.String),
    recommendedResourceDetails: S.optional(ResourceDetails),
    restartNeeded: S.optional(S.Boolean),
    estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
    resourceTags: S.optional(TagList),
  }),
).annotations({
  identifier: "PreviewResult",
}) as any as S.Schema<PreviewResult>;
export type PreviewResults = PreviewResult[];
export const PreviewResults = S.Array(PreviewResult);
export interface ListAutomationRulePreviewResponse {
  previewResults?: PreviewResult[];
  nextToken?: string;
}
export const ListAutomationRulePreviewResponse = S.suspend(() =>
  S.Struct({
    previewResults: S.optional(PreviewResults),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutomationRulePreviewResponse",
}) as any as S.Schema<ListAutomationRulePreviewResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class IdempotencyTokenInUseException extends S.TaggedError<IdempotencyTokenInUseException>()(
  "IdempotencyTokenInUseException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class IdempotentParameterMismatchException extends S.TaggedError<IdempotentParameterMismatchException>()(
  "IdempotentParameterMismatchException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class OptInRequiredException extends S.TaggedError<OptInRequiredException>()(
  "OptInRequiredException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class NotManagementAccountException extends S.TaggedError<NotManagementAccountException>()(
  "NotManagementAccountException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Disassociates member accounts from your organization's management account, removing centralized automation capabilities. Once disassociated, organization rules no longer apply to the member account, and the management account (or delegated administrator) cannot create Automation rules for that account.
 *
 * Only the management account or a delegated administrator can perform this action.
 */
export const disassociateAccounts: (
  input: DisassociateAccountsRequest,
) => effect.Effect<
  DisassociateAccountsResponse,
  | AccessDeniedException
  | ForbiddenException
  | IdempotencyTokenInUseException
  | IdempotentParameterMismatchException
  | InternalServerException
  | InvalidParameterValueException
  | NotManagementAccountException
  | OptInRequiredException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAccountsRequest,
  output: DisassociateAccountsResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    IdempotencyTokenInUseException,
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidParameterValueException,
    NotManagementAccountException,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Initiates a one-time, on-demand automation for the specified recommended action.
 *
 * Management accounts and delegated administrators can only initiate recommended actions for associated member accounts. You can associate a member account using `AssociateAccounts`.
 */
export const startAutomationEvent: (
  input: StartAutomationEventRequest,
) => effect.Effect<
  StartAutomationEventResponse,
  | AccessDeniedException
  | ForbiddenException
  | IdempotencyTokenInUseException
  | IdempotentParameterMismatchException
  | InternalServerException
  | InvalidParameterValueException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAutomationEventRequest,
  output: StartAutomationEventResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    IdempotencyTokenInUseException,
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Initiates a rollback for a completed automation event.
 *
 * Management accounts and delegated administrators can only initiate a rollback for events belonging to associated member accounts. You can associate a member account using `AssociateAccounts`.
 */
export const rollbackAutomationEvent: (
  input: RollbackAutomationEventRequest,
) => effect.Effect<
  RollbackAutomationEventResponse,
  | AccessDeniedException
  | ForbiddenException
  | IdempotencyTokenInUseException
  | IdempotentParameterMismatchException
  | InternalServerException
  | InvalidParameterValueException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RollbackAutomationEventRequest,
  output: RollbackAutomationEventResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    IdempotencyTokenInUseException,
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates an existing automation rule.
 */
export const updateAutomationRule: (
  input: UpdateAutomationRuleRequest,
) => effect.Effect<
  UpdateAutomationRuleResponse,
  | AccessDeniedException
  | ForbiddenException
  | IdempotencyTokenInUseException
  | IdempotentParameterMismatchException
  | InternalServerException
  | InvalidParameterValueException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAutomationRuleRequest,
  output: UpdateAutomationRuleResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    IdempotencyTokenInUseException,
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Adds tags to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ForbiddenException
  | IdempotencyTokenInUseException
  | IdempotentParameterMismatchException
  | InternalServerException
  | InvalidParameterValueException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    IdempotencyTokenInUseException,
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Removes tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ForbiddenException
  | IdempotencyTokenInUseException
  | IdempotentParameterMismatchException
  | InternalServerException
  | InvalidParameterValueException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    IdempotencyTokenInUseException,
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists the steps for a specific automation event. You can only list steps for events created within the past year.
 */
export const listAutomationEventSteps: {
  (
    input: ListAutomationEventStepsRequest,
  ): effect.Effect<
    ListAutomationEventStepsResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutomationEventStepsRequest,
  ) => stream.Stream<
    ListAutomationEventStepsResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutomationEventStepsRequest,
  ) => stream.Stream<
    AutomationEventStep,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutomationEventStepsRequest,
  output: ListAutomationEventStepsResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "automationEventSteps",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves details about a specific automation rule.
 */
export const getAutomationRule: (
  input: GetAutomationRuleRequest,
) => effect.Effect<
  GetAutomationRuleResponse,
  | AccessDeniedException
  | ForbiddenException
  | InternalServerException
  | InvalidParameterValueException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomationRuleRequest,
  output: GetAutomationRuleResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists the tags for a specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | ForbiddenException
  | InternalServerException
  | InvalidParameterValueException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the current enrollment configuration for Compute Optimizer Automation.
 */
export const getEnrollmentConfiguration: (
  input: GetEnrollmentConfigurationRequest,
) => effect.Effect<
  GetEnrollmentConfigurationResponse,
  | AccessDeniedException
  | ForbiddenException
  | InternalServerException
  | InvalidParameterValueException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnrollmentConfigurationRequest,
  output: GetEnrollmentConfigurationResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an existing automation rule.
 */
export const deleteAutomationRule: (
  input: DeleteAutomationRuleRequest,
) => effect.Effect<
  DeleteAutomationRuleResponse,
  | AccessDeniedException
  | ForbiddenException
  | IdempotencyTokenInUseException
  | IdempotentParameterMismatchException
  | InternalServerException
  | InvalidParameterValueException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAutomationRuleRequest,
  output: DeleteAutomationRuleResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    IdempotencyTokenInUseException,
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates your account’s Compute Optimizer Automation enrollment configuration.
 */
export const updateEnrollmentConfiguration: (
  input: UpdateEnrollmentConfigurationRequest,
) => effect.Effect<
  UpdateEnrollmentConfigurationResponse,
  | AccessDeniedException
  | ForbiddenException
  | IdempotencyTokenInUseException
  | IdempotentParameterMismatchException
  | InternalServerException
  | InvalidParameterValueException
  | NotManagementAccountException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnrollmentConfigurationRequest,
  output: UpdateEnrollmentConfigurationResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    IdempotencyTokenInUseException,
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidParameterValueException,
    NotManagementAccountException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists automation events based on specified filters. You can retrieve events that were created within the past year.
 */
export const listAutomationEvents: {
  (
    input: ListAutomationEventsRequest,
  ): effect.Effect<
    ListAutomationEventsResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutomationEventsRequest,
  ) => stream.Stream<
    ListAutomationEventsResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutomationEventsRequest,
  ) => stream.Stream<
    AutomationEvent,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutomationEventsRequest,
  output: ListAutomationEventsResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "automationEvents",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Provides a summary of automation events based on specified filters. Only events created within the past year will be included in the summary.
 */
export const listAutomationEventSummaries: {
  (
    input: ListAutomationEventSummariesRequest,
  ): effect.Effect<
    ListAutomationEventSummariesResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutomationEventSummariesRequest,
  ) => stream.Stream<
    ListAutomationEventSummariesResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutomationEventSummariesRequest,
  ) => stream.Stream<
    AutomationEventSummary,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutomationEventSummariesRequest,
  output: ListAutomationEventSummariesResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "automationEventSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a summary of the recommended actions that match your rule preview configuration and criteria.
 */
export const listAutomationRulePreviewSummaries: {
  (
    input: ListAutomationRulePreviewSummariesRequest,
  ): effect.Effect<
    ListAutomationRulePreviewSummariesResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutomationRulePreviewSummariesRequest,
  ) => stream.Stream<
    ListAutomationRulePreviewSummariesResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutomationRulePreviewSummariesRequest,
  ) => stream.Stream<
    PreviewResultSummary,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutomationRulePreviewSummariesRequest,
  output: ListAutomationRulePreviewSummariesResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "previewResultSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the automation rules that match specified filters.
 */
export const listAutomationRules: {
  (
    input: ListAutomationRulesRequest,
  ): effect.Effect<
    ListAutomationRulesResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutomationRulesRequest,
  ) => stream.Stream<
    ListAutomationRulesResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutomationRulesRequest,
  ) => stream.Stream<
    AutomationRule,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutomationRulesRequest,
  output: ListAutomationRulesResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "automationRules",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the recommended actions based that match specified filters.
 *
 * Management accounts and delegated administrators can retrieve recommended actions that include associated member accounts. You can associate a member account using `AssociateAccounts`.
 */
export const listRecommendedActions: {
  (
    input: ListRecommendedActionsRequest,
  ): effect.Effect<
    ListRecommendedActionsResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendedActionsRequest,
  ) => stream.Stream<
    ListRecommendedActionsResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendedActionsRequest,
  ) => stream.Stream<
    RecommendedAction,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecommendedActionsRequest,
  output: ListRecommendedActionsResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "recommendedActions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Provides a summary of recommended actions based on specified filters.
 *
 * Management accounts and delegated administrators can retrieve recommended actions that include associated member accounts. You can associate a member account using `AssociateAccounts`.
 */
export const listRecommendedActionSummaries: {
  (
    input: ListRecommendedActionSummariesRequest,
  ): effect.Effect<
    ListRecommendedActionSummariesResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendedActionSummariesRequest,
  ) => stream.Stream<
    ListRecommendedActionSummariesResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendedActionSummariesRequest,
  ) => stream.Stream<
    RecommendedActionSummary,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecommendedActionSummariesRequest,
  output: ListRecommendedActionSummariesResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "recommendedActionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Associates one or more member accounts with your organization's management account, enabling centralized implementation of optimization actions across those accounts. Once associated, the management account (or a delegated administrator) can apply recommended actions to the member account. When you associate a member account, its organization rule mode is automatically set to "Any allowed," which permits the management account to create Automation rules that automatically apply actions to that account. If the member account has not previously enabled the Automation feature, the association process automatically enables it.
 *
 * Only the management account or a delegated administrator can perform this action.
 */
export const associateAccounts: (
  input: AssociateAccountsRequest,
) => effect.Effect<
  AssociateAccountsResponse,
  | AccessDeniedException
  | ForbiddenException
  | IdempotencyTokenInUseException
  | IdempotentParameterMismatchException
  | InternalServerException
  | InvalidParameterValueException
  | NotManagementAccountException
  | OptInRequiredException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAccountsRequest,
  output: AssociateAccountsResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    IdempotencyTokenInUseException,
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidParameterValueException,
    NotManagementAccountException,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists the accounts in your organization that are enrolled in Compute Optimizer and whether they have enabled Automation.
 *
 * Only the management account or a delegated administrator can perform this action.
 */
export const listAccounts: {
  (
    input: ListAccountsRequest,
  ): effect.Effect<
    ListAccountsResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | NotManagementAccountException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountsRequest,
  ) => stream.Stream<
    ListAccountsResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | NotManagementAccountException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountsRequest,
  ) => stream.Stream<
    AccountInfo,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | NotManagementAccountException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountsRequest,
  output: ListAccountsResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    NotManagementAccountException,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "accounts",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves details about a specific automation event.
 */
export const getAutomationEvent: (
  input: GetAutomationEventRequest,
) => effect.Effect<
  GetAutomationEventResponse,
  | AccessDeniedException
  | ForbiddenException
  | InternalServerException
  | InvalidParameterValueException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomationEventRequest,
  output: GetAutomationEventResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns a preview of the recommended actions that match your Automation rule's configuration and criteria.
 */
export const listAutomationRulePreview: {
  (
    input: ListAutomationRulePreviewRequest,
  ): effect.Effect<
    ListAutomationRulePreviewResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutomationRulePreviewRequest,
  ) => stream.Stream<
    ListAutomationRulePreviewResponse,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutomationRulePreviewRequest,
  ) => stream.Stream<
    PreviewResult,
    | AccessDeniedException
    | ForbiddenException
    | InternalServerException
    | InvalidParameterValueException
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutomationRulePreviewRequest,
  output: ListAutomationRulePreviewResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "previewResults",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new automation rule to apply recommended actions to resources based on specified criteria.
 */
export const createAutomationRule: (
  input: CreateAutomationRuleRequest,
) => effect.Effect<
  CreateAutomationRuleResponse,
  | AccessDeniedException
  | ForbiddenException
  | IdempotencyTokenInUseException
  | IdempotentParameterMismatchException
  | InternalServerException
  | InvalidParameterValueException
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutomationRuleRequest,
  output: CreateAutomationRuleResponse,
  errors: [
    AccessDeniedException,
    ForbiddenException,
    IdempotencyTokenInUseException,
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidParameterValueException,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
