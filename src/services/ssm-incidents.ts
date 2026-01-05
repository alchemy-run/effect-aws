import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "SSM Incidents",
  serviceShapeName: "SSMIncidents",
});
const auth = T.AwsAuthSigv4({ name: "ssm-incidents" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
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
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
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
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
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
                        url: "https://ssm-incidents-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://ssm-incidents-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
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
                        url: "https://ssm-incidents.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://ssm-incidents.{Region}.{PartitionResult#dnsSuffix}",
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
});

//# Schemas
export const FindingIdList = S.Array(S.String);
export const EngagementSet = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BatchGetIncidentFindingsInput extends S.Class<BatchGetIncidentFindingsInput>(
  "BatchGetIncidentFindingsInput",
)(
  { incidentRecordArn: S.String, findingIds: FindingIdList },
  T.all(
    T.Http({ method: "POST", uri: "/batchGetIncidentFindings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIncidentRecordInput extends S.Class<DeleteIncidentRecordInput>(
  "DeleteIncidentRecordInput",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/deleteIncidentRecord" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIncidentRecordOutput extends S.Class<DeleteIncidentRecordOutput>(
  "DeleteIncidentRecordOutput",
)({}) {}
export class DeleteReplicationSetInput extends S.Class<DeleteReplicationSetInput>(
  "DeleteReplicationSetInput",
)(
  { arn: S.String.pipe(T.HttpQuery("arn")) },
  T.all(
    T.Http({ method: "POST", uri: "/deleteReplicationSet" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReplicationSetOutput extends S.Class<DeleteReplicationSetOutput>(
  "DeleteReplicationSetOutput",
)({}) {}
export class DeleteResourcePolicyInput extends S.Class<DeleteResourcePolicyInput>(
  "DeleteResourcePolicyInput",
)(
  { resourceArn: S.String, policyId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/deleteResourcePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyOutput extends S.Class<DeleteResourcePolicyOutput>(
  "DeleteResourcePolicyOutput",
)({}) {}
export class DeleteResponsePlanInput extends S.Class<DeleteResponsePlanInput>(
  "DeleteResponsePlanInput",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/deleteResponsePlan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResponsePlanOutput extends S.Class<DeleteResponsePlanOutput>(
  "DeleteResponsePlanOutput",
)({}) {}
export class DeleteTimelineEventInput extends S.Class<DeleteTimelineEventInput>(
  "DeleteTimelineEventInput",
)(
  { incidentRecordArn: S.String, eventId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/deleteTimelineEvent" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTimelineEventOutput extends S.Class<DeleteTimelineEventOutput>(
  "DeleteTimelineEventOutput",
)({}) {}
export class GetIncidentRecordInput extends S.Class<GetIncidentRecordInput>(
  "GetIncidentRecordInput",
)(
  { arn: S.String.pipe(T.HttpQuery("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/getIncidentRecord" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReplicationSetInput extends S.Class<GetReplicationSetInput>(
  "GetReplicationSetInput",
)(
  { arn: S.String.pipe(T.HttpQuery("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/getReplicationSet" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePoliciesInput extends S.Class<GetResourcePoliciesInput>(
  "GetResourcePoliciesInput",
)(
  {
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/getResourcePolicies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResponsePlanInput extends S.Class<GetResponsePlanInput>(
  "GetResponsePlanInput",
)(
  { arn: S.String.pipe(T.HttpQuery("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/getResponsePlan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTimelineEventInput extends S.Class<GetTimelineEventInput>(
  "GetTimelineEventInput",
)(
  {
    incidentRecordArn: S.String.pipe(T.HttpQuery("incidentRecordArn")),
    eventId: S.String.pipe(T.HttpQuery("eventId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/getTimelineEvent" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIncidentFindingsInput extends S.Class<ListIncidentFindingsInput>(
  "ListIncidentFindingsInput",
)(
  {
    incidentRecordArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listIncidentFindings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRelatedItemsInput extends S.Class<ListRelatedItemsInput>(
  "ListRelatedItemsInput",
)(
  {
    incidentRecordArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listRelatedItems" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReplicationSetsInput extends S.Class<ListReplicationSetsInput>(
  "ListReplicationSetsInput",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/listReplicationSets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResponsePlansInput extends S.Class<ListResponsePlansInput>(
  "ListResponsePlansInput",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/listResponsePlans" }),
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
export const StringList = S.Array(S.String);
export const IntegerList = S.Array(S.Number);
export const AttributeValueList = S.Union(
  S.Struct({ stringValues: StringList }),
  S.Struct({ integerValues: IntegerList }),
);
export const Condition = S.Union(
  S.Struct({ before: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
  S.Struct({ after: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
  S.Struct({ equals: AttributeValueList }),
);
export class Filter extends S.Class<Filter>("Filter")({
  key: S.String,
  condition: Condition,
}) {}
export const FilterList = S.Array(Filter);
export class ListTimelineEventsInput extends S.Class<ListTimelineEventsInput>(
  "ListTimelineEventsInput",
)(
  {
    incidentRecordArn: S.String,
    filters: S.optional(FilterList),
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listTimelineEvents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePolicyInput extends S.Class<PutResourcePolicyInput>(
  "PutResourcePolicyInput",
)(
  { resourceArn: S.String, policy: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/putResourcePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
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
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
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
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateDeletionProtectionInput extends S.Class<UpdateDeletionProtectionInput>(
  "UpdateDeletionProtectionInput",
)(
  {
    arn: S.String,
    deletionProtected: S.Boolean,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/updateDeletionProtection" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDeletionProtectionOutput extends S.Class<UpdateDeletionProtectionOutput>(
  "UpdateDeletionProtectionOutput",
)({}) {}
export const EventReference = S.Union(
  S.Struct({ resource: S.String }),
  S.Struct({ relatedItemId: S.String }),
);
export const EventReferenceList = S.Array(EventReference);
export class UpdateTimelineEventInput extends S.Class<UpdateTimelineEventInput>(
  "UpdateTimelineEventInput",
)(
  {
    clientToken: S.optional(S.String),
    incidentRecordArn: S.String,
    eventId: S.String,
    eventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    eventType: S.optional(S.String),
    eventData: S.optional(S.String),
    eventReferences: S.optional(EventReferenceList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/updateTimelineEvent" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTimelineEventOutput extends S.Class<UpdateTimelineEventOutput>(
  "UpdateTimelineEventOutput",
)({}) {}
export class EmptyChatChannel extends S.Class<EmptyChatChannel>(
  "EmptyChatChannel",
)({}) {}
export const ChatbotSnsConfigurationSet = S.Array(S.String);
export const NotificationTargetItem = S.Union(
  S.Struct({ snsTopicArn: S.String }),
);
export const NotificationTargetSet = S.Array(NotificationTargetItem);
export class IncidentTemplate extends S.Class<IncidentTemplate>(
  "IncidentTemplate",
)({
  title: S.String,
  impact: S.Number,
  summary: S.optional(S.String),
  dedupeString: S.optional(S.String),
  notificationTargets: S.optional(NotificationTargetSet),
  incidentTags: S.optional(TagMap),
}) {}
export const ChatChannel = S.Union(
  S.Struct({ empty: EmptyChatChannel }),
  S.Struct({ chatbotSns: ChatbotSnsConfigurationSet }),
);
export const ReplicationSetArnList = S.Array(S.String);
export class TriggerDetails extends S.Class<TriggerDetails>("TriggerDetails")({
  source: S.String,
  triggerArn: S.optional(S.String),
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  rawData: S.optional(S.String),
}) {}
export class PagerDutyIncidentDetail extends S.Class<PagerDutyIncidentDetail>(
  "PagerDutyIncidentDetail",
)({
  id: S.String,
  autoResolve: S.optional(S.Boolean),
  secretId: S.optional(S.String),
}) {}
export const ItemValue = S.Union(
  S.Struct({ arn: S.String }),
  S.Struct({ url: S.String }),
  S.Struct({ metricDefinition: S.String }),
  S.Struct({ pagerDutyIncidentDetail: PagerDutyIncidentDetail }),
);
export class ItemIdentifier extends S.Class<ItemIdentifier>("ItemIdentifier")({
  value: ItemValue,
  type: S.String,
}) {}
export class RelatedItem extends S.Class<RelatedItem>("RelatedItem")({
  identifier: ItemIdentifier,
  title: S.optional(S.String),
  generatedId: S.optional(S.String),
}) {}
export const RelatedItemsUpdate = S.Union(
  S.Struct({ itemToAdd: RelatedItem }),
  S.Struct({ itemToRemove: ItemIdentifier }),
);
export const TagMapUpdate = S.Record({ key: S.String, value: S.String });
export class CreateTimelineEventInput extends S.Class<CreateTimelineEventInput>(
  "CreateTimelineEventInput",
)(
  {
    clientToken: S.optional(S.String),
    incidentRecordArn: S.String,
    eventTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    eventType: S.String,
    eventData: S.String,
    eventReferences: S.optional(EventReferenceList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/createTimelineEvent" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SsmParameterValues = S.Array(S.String);
export const SsmParameters = S.Record({
  key: S.String,
  value: SsmParameterValues,
});
export const DynamicSsmParameterValue = S.Union(
  S.Struct({ variable: S.String }),
);
export const DynamicSsmParameters = S.Record({
  key: S.String,
  value: DynamicSsmParameterValue,
});
export class SsmAutomation extends S.Class<SsmAutomation>("SsmAutomation")({
  roleArn: S.String,
  documentName: S.String,
  documentVersion: S.optional(S.String),
  targetAccount: S.optional(S.String),
  parameters: S.optional(SsmParameters),
  dynamicParameters: S.optional(DynamicSsmParameters),
}) {}
export const Action = S.Union(S.Struct({ ssmAutomation: SsmAutomation }));
export const ActionsList = S.Array(Action);
export class PagerDutyIncidentConfiguration extends S.Class<PagerDutyIncidentConfiguration>(
  "PagerDutyIncidentConfiguration",
)({ serviceId: S.String }) {}
export class PagerDutyConfiguration extends S.Class<PagerDutyConfiguration>(
  "PagerDutyConfiguration",
)({
  name: S.String,
  secretId: S.String,
  pagerDutyIncidentConfiguration: PagerDutyIncidentConfiguration,
}) {}
export const Integration = S.Union(
  S.Struct({ pagerDutyConfiguration: PagerDutyConfiguration }),
);
export const Integrations = S.Array(Integration);
export class GetResponsePlanOutput extends S.Class<GetResponsePlanOutput>(
  "GetResponsePlanOutput",
)({
  arn: S.String,
  name: S.String,
  displayName: S.optional(S.String),
  incidentTemplate: IncidentTemplate,
  chatChannel: S.optional(ChatChannel),
  engagements: S.optional(EngagementSet),
  actions: S.optional(ActionsList),
  integrations: S.optional(Integrations),
}) {}
export const RelatedItemList = S.Array(RelatedItem);
export class ListRelatedItemsOutput extends S.Class<ListRelatedItemsOutput>(
  "ListRelatedItemsOutput",
)({ relatedItems: RelatedItemList, nextToken: S.optional(S.String) }) {}
export class ListReplicationSetsOutput extends S.Class<ListReplicationSetsOutput>(
  "ListReplicationSetsOutput",
)({
  replicationSetArns: ReplicationSetArnList,
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: TagMap }) {}
export class PutResourcePolicyOutput extends S.Class<PutResourcePolicyOutput>(
  "PutResourcePolicyOutput",
)({ policyId: S.String }) {}
export class UpdateIncidentRecordInput extends S.Class<UpdateIncidentRecordInput>(
  "UpdateIncidentRecordInput",
)(
  {
    clientToken: S.optional(S.String),
    arn: S.String,
    title: S.optional(S.String),
    summary: S.optional(S.String),
    impact: S.optional(S.Number),
    status: S.optional(S.String),
    chatChannel: S.optional(ChatChannel),
    notificationTargets: S.optional(NotificationTargetSet),
  },
  T.all(
    T.Http({ method: "POST", uri: "/updateIncidentRecord" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateIncidentRecordOutput extends S.Class<UpdateIncidentRecordOutput>(
  "UpdateIncidentRecordOutput",
)({}) {}
export class UpdateRelatedItemsInput extends S.Class<UpdateRelatedItemsInput>(
  "UpdateRelatedItemsInput",
)(
  {
    clientToken: S.optional(S.String),
    incidentRecordArn: S.String,
    relatedItemsUpdate: RelatedItemsUpdate,
  },
  T.all(
    T.Http({ method: "POST", uri: "/updateRelatedItems" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRelatedItemsOutput extends S.Class<UpdateRelatedItemsOutput>(
  "UpdateRelatedItemsOutput",
)({}) {}
export class UpdateResponsePlanInput extends S.Class<UpdateResponsePlanInput>(
  "UpdateResponsePlanInput",
)(
  {
    clientToken: S.optional(S.String),
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/updateResponsePlan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateResponsePlanOutput extends S.Class<UpdateResponsePlanOutput>(
  "UpdateResponsePlanOutput",
)({}) {}
export class RegionMapInputValue extends S.Class<RegionMapInputValue>(
  "RegionMapInputValue",
)({ sseKmsKeyId: S.optional(S.String) }) {}
export class AddRegionAction extends S.Class<AddRegionAction>(
  "AddRegionAction",
)({ regionName: S.String, sseKmsKeyId: S.optional(S.String) }) {}
export class DeleteRegionAction extends S.Class<DeleteRegionAction>(
  "DeleteRegionAction",
)({ regionName: S.String }) {}
export class BatchGetIncidentFindingsError extends S.Class<BatchGetIncidentFindingsError>(
  "BatchGetIncidentFindingsError",
)({ findingId: S.String, code: S.String, message: S.String }) {}
export const BatchGetIncidentFindingsErrorList = S.Array(
  BatchGetIncidentFindingsError,
);
export const RegionMapInput = S.Record({
  key: S.String,
  value: RegionMapInputValue,
});
export class ResourcePolicy extends S.Class<ResourcePolicy>("ResourcePolicy")({
  policyDocument: S.String,
  policyId: S.String,
  ramResourceShareRegion: S.String,
}) {}
export const ResourcePolicyList = S.Array(ResourcePolicy);
export class TimelineEvent extends S.Class<TimelineEvent>("TimelineEvent")({
  incidentRecordArn: S.String,
  eventId: S.String,
  eventTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  eventUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  eventType: S.String,
  eventData: S.String,
  eventReferences: S.optional(EventReferenceList),
}) {}
export class FindingSummary extends S.Class<FindingSummary>("FindingSummary")({
  id: S.String,
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const FindingSummaryList = S.Array(FindingSummary);
export class ResponsePlanSummary extends S.Class<ResponsePlanSummary>(
  "ResponsePlanSummary",
)({ arn: S.String, name: S.String, displayName: S.optional(S.String) }) {}
export const ResponsePlanSummaryList = S.Array(ResponsePlanSummary);
export class EventSummary extends S.Class<EventSummary>("EventSummary")({
  incidentRecordArn: S.String,
  eventId: S.String,
  eventTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  eventUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  eventType: S.String,
  eventReferences: S.optional(EventReferenceList),
}) {}
export const EventSummaryList = S.Array(EventSummary);
export const UpdateReplicationSetAction = S.Union(
  S.Struct({ addRegionAction: AddRegionAction }),
  S.Struct({ deleteRegionAction: DeleteRegionAction }),
);
export const UpdateActionList = S.Array(UpdateReplicationSetAction);
export class CreateReplicationSetInput extends S.Class<CreateReplicationSetInput>(
  "CreateReplicationSetInput",
)(
  {
    regions: RegionMapInput,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/createReplicationSet" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTimelineEventOutput extends S.Class<CreateTimelineEventOutput>(
  "CreateTimelineEventOutput",
)({ incidentRecordArn: S.String, eventId: S.String }) {}
export class GetResourcePoliciesOutput extends S.Class<GetResourcePoliciesOutput>(
  "GetResourcePoliciesOutput",
)({ resourcePolicies: ResourcePolicyList, nextToken: S.optional(S.String) }) {}
export class GetTimelineEventOutput extends S.Class<GetTimelineEventOutput>(
  "GetTimelineEventOutput",
)({ event: TimelineEvent }) {}
export class ListIncidentFindingsOutput extends S.Class<ListIncidentFindingsOutput>(
  "ListIncidentFindingsOutput",
)({ findings: FindingSummaryList, nextToken: S.optional(S.String) }) {}
export class ListResponsePlansOutput extends S.Class<ListResponsePlansOutput>(
  "ListResponsePlansOutput",
)({
  responsePlanSummaries: ResponsePlanSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListTimelineEventsOutput extends S.Class<ListTimelineEventsOutput>(
  "ListTimelineEventsOutput",
)({ eventSummaries: EventSummaryList, nextToken: S.optional(S.String) }) {}
export class UpdateReplicationSetInput extends S.Class<UpdateReplicationSetInput>(
  "UpdateReplicationSetInput",
)(
  {
    arn: S.String,
    actions: UpdateActionList,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/updateReplicationSet" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateReplicationSetOutput extends S.Class<UpdateReplicationSetOutput>(
  "UpdateReplicationSetOutput",
)({}) {}
export const AutomationExecution = S.Union(
  S.Struct({ ssmExecutionArn: S.String }),
);
export const AutomationExecutionSet = S.Array(AutomationExecution);
export class IncidentRecordSource extends S.Class<IncidentRecordSource>(
  "IncidentRecordSource",
)({
  createdBy: S.String,
  invokedBy: S.optional(S.String),
  resourceArn: S.optional(S.String),
  source: S.String,
}) {}
export class IncidentRecord extends S.Class<IncidentRecord>("IncidentRecord")({
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
}) {}
export class CodeDeployDeployment extends S.Class<CodeDeployDeployment>(
  "CodeDeployDeployment",
)({
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  deploymentGroupArn: S.String,
  deploymentId: S.String,
}) {}
export class CloudFormationStackUpdate extends S.Class<CloudFormationStackUpdate>(
  "CloudFormationStackUpdate",
)({
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  stackArn: S.String,
}) {}
export class RegionInfo extends S.Class<RegionInfo>("RegionInfo")({
  sseKmsKeyId: S.optional(S.String),
  status: S.String,
  statusMessage: S.optional(S.String),
  statusUpdateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class CreateReplicationSetOutput extends S.Class<CreateReplicationSetOutput>(
  "CreateReplicationSetOutput",
)({ arn: S.String }) {}
export class GetIncidentRecordOutput extends S.Class<GetIncidentRecordOutput>(
  "GetIncidentRecordOutput",
)({ incidentRecord: IncidentRecord }) {}
export class ListIncidentRecordsInput extends S.Class<ListIncidentRecordsInput>(
  "ListIncidentRecordsInput",
)(
  {
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listIncidentRecords" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FindingDetails = S.Union(
  S.Struct({ codeDeployDeployment: CodeDeployDeployment }),
  S.Struct({ cloudFormationStackUpdate: CloudFormationStackUpdate }),
);
export const RegionInfoMap = S.Record({ key: S.String, value: RegionInfo });
export class Finding extends S.Class<Finding>("Finding")({
  id: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  details: S.optional(FindingDetails),
}) {}
export const FindingList = S.Array(Finding);
export class ReplicationSet extends S.Class<ReplicationSet>("ReplicationSet")({
  arn: S.optional(S.String),
  regionMap: RegionInfoMap,
  status: S.String,
  deletionProtected: S.Boolean,
  createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  createdBy: S.String,
  lastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedBy: S.String,
}) {}
export class BatchGetIncidentFindingsOutput extends S.Class<BatchGetIncidentFindingsOutput>(
  "BatchGetIncidentFindingsOutput",
)({ findings: FindingList, errors: BatchGetIncidentFindingsErrorList }) {}
export class CreateResponsePlanInput extends S.Class<CreateResponsePlanInput>(
  "CreateResponsePlanInput",
)(
  {
    clientToken: S.optional(S.String),
    name: S.String,
    displayName: S.optional(S.String),
    incidentTemplate: IncidentTemplate,
    chatChannel: S.optional(ChatChannel),
    engagements: S.optional(EngagementSet),
    actions: S.optional(ActionsList),
    tags: S.optional(TagMap),
    integrations: S.optional(Integrations),
  },
  T.all(
    T.Http({ method: "POST", uri: "/createResponsePlan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReplicationSetOutput extends S.Class<GetReplicationSetOutput>(
  "GetReplicationSetOutput",
)({ replicationSet: ReplicationSet }) {}
export class StartIncidentInput extends S.Class<StartIncidentInput>(
  "StartIncidentInput",
)(
  {
    clientToken: S.optional(S.String),
    responsePlanArn: S.String,
    title: S.optional(S.String),
    impact: S.optional(S.Number),
    triggerDetails: S.optional(TriggerDetails),
    relatedItems: S.optional(RelatedItemList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/startIncident" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IncidentRecordSummary extends S.Class<IncidentRecordSummary>(
  "IncidentRecordSummary",
)({
  arn: S.String,
  title: S.String,
  status: S.String,
  impact: S.Number,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  resolvedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  incidentRecordSource: IncidentRecordSource,
}) {}
export const IncidentRecordSummaryList = S.Array(IncidentRecordSummary);
export class CreateResponsePlanOutput extends S.Class<CreateResponsePlanOutput>(
  "CreateResponsePlanOutput",
)({ arn: S.String }) {}
export class ListIncidentRecordsOutput extends S.Class<ListIncidentRecordsOutput>(
  "ListIncidentRecordsOutput",
)({
  incidentRecordSummaries: IncidentRecordSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class StartIncidentOutput extends S.Class<StartIncidentOutput>(
  "StartIncidentOutput",
)({ incidentRecordArn: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceIdentifier: S.optional(S.String),
    resourceType: S.optional(S.String),
    retryAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String, serviceCode: S.String, quotaCode: S.String },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceIdentifier: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceIdentifier: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}

//# Operations
/**
 * Delete an incident record from Incident Manager.
 */
export const deleteIncidentRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIncidentRecordInput,
    output: DeleteIncidentRecordOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieve your Incident Manager replication set.
 */
export const getReplicationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResourcePolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listResponsePlans = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists timeline events for the specified incident record.
 */
export const listTimelineEvents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * List all related items for an incident record.
 */
export const listRelatedItems = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists details about the replication set configured in your account.
 */
export const listReplicationSets =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteResponsePlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTimelineEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTimelineEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listIncidentFindings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateIncidentRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Add or delete Regions from your replication set.
 */
export const updateReplicationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves the details of the specified response plan.
 */
export const getResponsePlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteReplicationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteReplicationSetInput,
    output: DeleteReplicationSetOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the resource policy that Resource Access Manager uses to share your Incident Manager
 * resource.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyInput,
    output: DeleteResourcePolicyOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Update deletion protection to either allow or deny deletion of the final Region in a
 * replication set.
 */
export const updateDeletionProtection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDeletionProtectionInput,
    output: UpdateDeletionProtectionOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Add or remove related items from the related items tab of an incident record.
 */
export const updateRelatedItems = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateResponsePlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTimelineEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTimelineEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getIncidentRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetIncidentFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetIncidentFindingsInput,
    output: BatchGetIncidentFindingsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * A replication set replicates and encrypts your data to the provided Regions with the
 * provided KMS key.
 */
export const createReplicationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a response plan that automates the initial response to incidents. A response plan
 * engages contacts, starts chat channel collaboration, and initiates runbooks at the beginning
 * of an incident.
 */
export const createResponsePlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listIncidentRecords =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startIncident = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
