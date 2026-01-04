import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Compute Optimizer Automation",
  serviceShapeName: "ComputeOptimizerAutomationService",
});
const auth = T.AwsAuthSigv4({ name: "aco-automation" });
const ver = T.ServiceVersion("2025-09-22");
const proto = T.AwsProtocolsAwsJson1_0();
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://aco-automation-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://aco-automation-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://aco-automation.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://aco-automation.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetEnrollmentConfigurationRequest extends S.Class<GetEnrollmentConfigurationRequest>(
  "GetEnrollmentConfigurationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const AccountIdList = S.Array(S.String);
export const RecommendedActionTypeList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateAccountsRequest extends S.Class<AssociateAccountsRequest>(
  "AssociateAccountsRequest",
)(
  { accountIds: AccountIdList, clientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAutomationRuleRequest extends S.Class<DeleteAutomationRuleRequest>(
  "DeleteAutomationRuleRequest",
)(
  {
    ruleArn: S.String,
    ruleRevision: S.Number,
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAutomationRuleResponse extends S.Class<DeleteAutomationRuleResponse>(
  "DeleteAutomationRuleResponse",
)({}) {}
export class DisassociateAccountsRequest extends S.Class<DisassociateAccountsRequest>(
  "DisassociateAccountsRequest",
)(
  { accountIds: AccountIdList, clientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAutomationEventRequest extends S.Class<GetAutomationEventRequest>(
  "GetAutomationEventRequest",
)(
  { eventId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAutomationRuleRequest extends S.Class<GetAutomationRuleRequest>(
  "GetAutomationRuleRequest",
)(
  { ruleArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEnrollmentConfigurationResponse extends S.Class<GetEnrollmentConfigurationResponse>(
  "GetEnrollmentConfigurationResponse",
)({
  status: S.String,
  statusReason: S.optional(S.String),
  organizationRuleMode: S.optional(S.String),
  lastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ListAccountsRequest extends S.Class<ListAccountsRequest>(
  "ListAccountsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAutomationEventStepsRequest extends S.Class<ListAutomationEventStepsRequest>(
  "ListAutomationEventStepsRequest",
)(
  {
    eventId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FilterValues = S.Array(S.String);
export class AutomationEventFilter extends S.Class<AutomationEventFilter>(
  "AutomationEventFilter",
)({ name: S.String, values: FilterValues }) {}
export const AutomationEventFilterList = S.Array(AutomationEventFilter);
export class ListAutomationEventSummariesRequest extends S.Class<ListAutomationEventSummariesRequest>(
  "ListAutomationEventSummariesRequest",
)(
  {
    filters: S.optional(AutomationEventFilterList),
    startDateInclusive: S.optional(S.String),
    endDateExclusive: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const OrganizationConfigurationAccountIds = S.Array(S.String);
export class OrganizationScope extends S.Class<OrganizationScope>(
  "OrganizationScope",
)({ accountIds: S.optional(OrganizationConfigurationAccountIds) }) {}
export const StringCriteriaValues = S.Array(S.String);
export class StringCriteriaCondition extends S.Class<StringCriteriaCondition>(
  "StringCriteriaCondition",
)({
  comparison: S.optional(S.String),
  values: S.optional(StringCriteriaValues),
}) {}
export const StringCriteriaConditionList = S.Array(StringCriteriaCondition);
export const IntegerList = S.Array(S.Number);
export class IntegerCriteriaCondition extends S.Class<IntegerCriteriaCondition>(
  "IntegerCriteriaCondition",
)({ comparison: S.optional(S.String), values: S.optional(IntegerList) }) {}
export const IntegerCriteriaConditionList = S.Array(IntegerCriteriaCondition);
export const DoubleList = S.Array(S.Number);
export class DoubleCriteriaCondition extends S.Class<DoubleCriteriaCondition>(
  "DoubleCriteriaCondition",
)({ comparison: S.optional(S.String), values: S.optional(DoubleList) }) {}
export const DoubleCriteriaConditionList = S.Array(DoubleCriteriaCondition);
export class ResourceTagsCriteriaCondition extends S.Class<ResourceTagsCriteriaCondition>(
  "ResourceTagsCriteriaCondition",
)({
  comparison: S.optional(S.String),
  key: S.optional(S.String),
  values: S.optional(StringCriteriaValues),
}) {}
export const ResourceTagsCriteriaConditionList = S.Array(
  ResourceTagsCriteriaCondition,
);
export class Criteria extends S.Class<Criteria>("Criteria")({
  region: S.optional(StringCriteriaConditionList),
  resourceArn: S.optional(StringCriteriaConditionList),
  ebsVolumeType: S.optional(StringCriteriaConditionList),
  ebsVolumeSizeInGib: S.optional(IntegerCriteriaConditionList),
  estimatedMonthlySavings: S.optional(DoubleCriteriaConditionList),
  resourceTag: S.optional(ResourceTagsCriteriaConditionList),
  lookBackPeriodInDays: S.optional(IntegerCriteriaConditionList),
  restartNeeded: S.optional(StringCriteriaConditionList),
}) {}
export class ListAutomationRulePreviewSummariesRequest extends S.Class<ListAutomationRulePreviewSummariesRequest>(
  "ListAutomationRulePreviewSummariesRequest",
)(
  {
    ruleType: S.String,
    organizationScope: S.optional(OrganizationScope),
    recommendedActionTypes: RecommendedActionTypeList,
    criteria: S.optional(Criteria),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RecommendedActionFilter extends S.Class<RecommendedActionFilter>(
  "RecommendedActionFilter",
)({ name: S.String, values: FilterValues }) {}
export const RecommendedActionFilterList = S.Array(RecommendedActionFilter);
export class ListRecommendedActionSummariesRequest extends S.Class<ListRecommendedActionSummariesRequest>(
  "ListRecommendedActionSummariesRequest",
)(
  {
    filters: S.optional(RecommendedActionFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RollbackAutomationEventRequest extends S.Class<RollbackAutomationEventRequest>(
  "RollbackAutomationEventRequest",
)(
  { eventId: S.String, clientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartAutomationEventRequest extends S.Class<StartAutomationEventRequest>(
  "StartAutomationEventRequest",
)(
  { recommendedActionId: S.String, clientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    resourceArn: S.String,
    ruleRevision: S.Number,
    tags: TagList,
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String,
    ruleRevision: S.Number,
    tagKeys: TagKeyList,
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class OrganizationConfiguration extends S.Class<OrganizationConfiguration>(
  "OrganizationConfiguration",
)({
  ruleApplyOrder: S.optional(S.String),
  accountIds: S.optional(OrganizationConfigurationAccountIds),
}) {}
export class Schedule extends S.Class<Schedule>("Schedule")({
  scheduleExpression: S.optional(S.String),
  scheduleExpressionTimezone: S.optional(S.String),
  executionWindowInMinutes: S.optional(S.Number),
}) {}
export class UpdateAutomationRuleRequest extends S.Class<UpdateAutomationRuleRequest>(
  "UpdateAutomationRuleRequest",
)(
  {
    ruleArn: S.String,
    ruleRevision: S.Number,
    name: S.optional(S.String),
    description: S.optional(S.String),
    ruleType: S.optional(S.String),
    organizationConfiguration: S.optional(OrganizationConfiguration),
    priority: S.optional(S.String),
    recommendedActionTypes: S.optional(RecommendedActionTypeList),
    criteria: S.optional(Criteria),
    schedule: S.optional(Schedule),
    status: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEnrollmentConfigurationRequest extends S.Class<UpdateEnrollmentConfigurationRequest>(
  "UpdateEnrollmentConfigurationRequest",
)(
  { status: S.String, clientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const StringList = S.Array(S.String);
export class Filter extends S.Class<Filter>("Filter")({
  name: S.String,
  values: FilterValues,
}) {}
export const FilterList = S.Array(Filter);
export class AssociateAccountsResponse extends S.Class<AssociateAccountsResponse>(
  "AssociateAccountsResponse",
)({ accountIds: S.optional(AccountIdList), errors: S.optional(StringList) }) {}
export class DisassociateAccountsResponse extends S.Class<DisassociateAccountsResponse>(
  "DisassociateAccountsResponse",
)({ accountIds: S.optional(AccountIdList), errors: S.optional(StringList) }) {}
export class GetAutomationRuleResponse extends S.Class<GetAutomationRuleResponse>(
  "GetAutomationRuleResponse",
)({
  ruleArn: S.optional(S.String),
  ruleId: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  ruleType: S.optional(S.String),
  ruleRevision: S.optional(S.Number),
  accountId: S.optional(S.String),
  organizationConfiguration: S.optional(OrganizationConfiguration),
  priority: S.optional(S.String),
  recommendedActionTypes: S.optional(RecommendedActionTypeList),
  criteria: S.optional(Criteria),
  schedule: S.optional(Schedule),
  status: S.optional(S.String),
  tags: S.optional(TagList),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ListAutomationEventsRequest extends S.Class<ListAutomationEventsRequest>(
  "ListAutomationEventsRequest",
)(
  {
    filters: S.optional(AutomationEventFilterList),
    startTimeInclusive: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    endTimeExclusive: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAutomationRulePreviewRequest extends S.Class<ListAutomationRulePreviewRequest>(
  "ListAutomationRulePreviewRequest",
)(
  {
    ruleType: S.String,
    organizationScope: S.optional(OrganizationScope),
    recommendedActionTypes: RecommendedActionTypeList,
    criteria: S.optional(Criteria),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAutomationRulesRequest extends S.Class<ListAutomationRulesRequest>(
  "ListAutomationRulesRequest",
)(
  {
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRecommendedActionsRequest extends S.Class<ListRecommendedActionsRequest>(
  "ListRecommendedActionsRequest",
)(
  {
    filters: S.optional(RecommendedActionFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class RollbackAutomationEventResponse extends S.Class<RollbackAutomationEventResponse>(
  "RollbackAutomationEventResponse",
)({ eventId: S.optional(S.String), eventStatus: S.optional(S.String) }) {}
export class StartAutomationEventResponse extends S.Class<StartAutomationEventResponse>(
  "StartAutomationEventResponse",
)({
  recommendedActionId: S.optional(S.String),
  eventId: S.optional(S.String),
  eventStatus: S.optional(S.String),
}) {}
export class UpdateAutomationRuleResponse extends S.Class<UpdateAutomationRuleResponse>(
  "UpdateAutomationRuleResponse",
)({
  ruleArn: S.optional(S.String),
  ruleRevision: S.optional(S.Number),
  name: S.optional(S.String),
  description: S.optional(S.String),
  ruleType: S.optional(S.String),
  organizationConfiguration: S.optional(OrganizationConfiguration),
  priority: S.optional(S.String),
  recommendedActionTypes: S.optional(RecommendedActionTypeList),
  criteria: S.optional(Criteria),
  schedule: S.optional(Schedule),
  status: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class UpdateEnrollmentConfigurationResponse extends S.Class<UpdateEnrollmentConfigurationResponse>(
  "UpdateEnrollmentConfigurationResponse",
)({
  status: S.String,
  statusReason: S.optional(S.String),
  lastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class EstimatedMonthlySavings extends S.Class<EstimatedMonthlySavings>(
  "EstimatedMonthlySavings",
)({
  currency: S.String,
  beforeDiscountSavings: S.Number,
  afterDiscountSavings: S.Number,
  savingsEstimationMode: S.String,
}) {}
export class AccountInfo extends S.Class<AccountInfo>("AccountInfo")({
  accountId: S.String,
  status: S.String,
  organizationRuleMode: S.String,
  statusReason: S.optional(S.String),
  lastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const AccountInfoList = S.Array(AccountInfo);
export class AutomationEventStep extends S.Class<AutomationEventStep>(
  "AutomationEventStep",
)({
  eventId: S.optional(S.String),
  stepId: S.optional(S.String),
  stepType: S.optional(S.String),
  stepStatus: S.optional(S.String),
  resourceId: S.optional(S.String),
  startTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
}) {}
export const AutomationEventSteps = S.Array(AutomationEventStep);
export class CreateAutomationRuleRequest extends S.Class<CreateAutomationRuleRequest>(
  "CreateAutomationRuleRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    ruleType: S.String,
    organizationConfiguration: S.optional(OrganizationConfiguration),
    priority: S.optional(S.String),
    recommendedActionTypes: RecommendedActionTypeList,
    criteria: S.optional(Criteria),
    schedule: Schedule,
    status: S.String,
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAutomationEventResponse extends S.Class<GetAutomationEventResponse>(
  "GetAutomationEventResponse",
)({
  eventId: S.optional(S.String),
  eventDescription: S.optional(S.String),
  eventType: S.optional(S.String),
  eventStatus: S.optional(S.String),
  eventStatusReason: S.optional(S.String),
  resourceArn: S.optional(S.String),
  resourceId: S.optional(S.String),
  recommendedActionId: S.optional(S.String),
  accountId: S.optional(S.String),
  region: S.optional(S.String),
  ruleId: S.optional(S.String),
  resourceType: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
}) {}
export class ListAccountsResponse extends S.Class<ListAccountsResponse>(
  "ListAccountsResponse",
)({ accounts: AccountInfoList, nextToken: S.optional(S.String) }) {}
export class ListAutomationEventStepsResponse extends S.Class<ListAutomationEventStepsResponse>(
  "ListAutomationEventStepsResponse",
)({
  automationEventSteps: S.optional(AutomationEventSteps),
  nextToken: S.optional(S.String),
}) {}
export class SummaryDimension extends S.Class<SummaryDimension>(
  "SummaryDimension",
)({ key: S.String, value: S.String }) {}
export const SummaryDimensions = S.Array(SummaryDimension);
export class TimePeriod extends S.Class<TimePeriod>("TimePeriod")({
  startTimeInclusive: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  endTimeExclusive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class SummaryTotals extends S.Class<SummaryTotals>("SummaryTotals")({
  automationEventCount: S.optional(S.Number),
  estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
}) {}
export class RulePreviewTotal extends S.Class<RulePreviewTotal>(
  "RulePreviewTotal",
)({
  recommendedActionCount: S.Number,
  estimatedMonthlySavings: EstimatedMonthlySavings,
}) {}
export class RecommendedActionTotal extends S.Class<RecommendedActionTotal>(
  "RecommendedActionTotal",
)({
  recommendedActionCount: S.Number,
  estimatedMonthlySavings: EstimatedMonthlySavings,
}) {}
export class AutomationEvent extends S.Class<AutomationEvent>(
  "AutomationEvent",
)({
  eventId: S.optional(S.String),
  eventDescription: S.optional(S.String),
  eventType: S.optional(S.String),
  eventStatus: S.optional(S.String),
  eventStatusReason: S.optional(S.String),
  resourceArn: S.optional(S.String),
  resourceId: S.optional(S.String),
  recommendedActionId: S.optional(S.String),
  accountId: S.optional(S.String),
  region: S.optional(S.String),
  ruleId: S.optional(S.String),
  resourceType: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
}) {}
export const AutomationEvents = S.Array(AutomationEvent);
export class AutomationEventSummary extends S.Class<AutomationEventSummary>(
  "AutomationEventSummary",
)({
  key: S.optional(S.String),
  dimensions: S.optional(SummaryDimensions),
  timePeriod: S.optional(TimePeriod),
  total: S.optional(SummaryTotals),
}) {}
export const AutomationEventSummaryList = S.Array(AutomationEventSummary);
export class PreviewResultSummary extends S.Class<PreviewResultSummary>(
  "PreviewResultSummary",
)({ key: S.String, total: RulePreviewTotal }) {}
export const PreviewResultSummaries = S.Array(PreviewResultSummary);
export class AutomationRule extends S.Class<AutomationRule>("AutomationRule")({
  ruleArn: S.optional(S.String),
  ruleId: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  ruleType: S.optional(S.String),
  ruleRevision: S.optional(S.Number),
  accountId: S.optional(S.String),
  organizationConfiguration: S.optional(OrganizationConfiguration),
  priority: S.optional(S.String),
  recommendedActionTypes: S.optional(RecommendedActionTypeList),
  schedule: S.optional(Schedule),
  status: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const AutomationRules = S.Array(AutomationRule);
export class EbsVolumeConfiguration extends S.Class<EbsVolumeConfiguration>(
  "EbsVolumeConfiguration",
)({
  type: S.optional(S.String),
  sizeInGib: S.optional(S.Number),
  iops: S.optional(S.Number),
  throughput: S.optional(S.Number),
}) {}
export class EbsVolume extends S.Class<EbsVolume>("EbsVolume")({
  configuration: S.optional(EbsVolumeConfiguration),
}) {}
export const ResourceDetails = S.Union(S.Struct({ ebsVolume: EbsVolume }));
export class RecommendedAction extends S.Class<RecommendedAction>(
  "RecommendedAction",
)({
  recommendedActionId: S.optional(S.String),
  resourceArn: S.optional(S.String),
  resourceId: S.optional(S.String),
  accountId: S.optional(S.String),
  region: S.optional(S.String),
  resourceType: S.optional(S.String),
  lookBackPeriodInDays: S.optional(S.Number),
  recommendedActionType: S.optional(S.String),
  currentResourceSummary: S.optional(S.String),
  currentResourceDetails: S.optional(ResourceDetails),
  recommendedResourceSummary: S.optional(S.String),
  recommendedResourceDetails: S.optional(ResourceDetails),
  restartNeeded: S.optional(S.Boolean),
  estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
  resourceTags: S.optional(TagList),
}) {}
export const RecommendedActions = S.Array(RecommendedAction);
export class RecommendedActionSummary extends S.Class<RecommendedActionSummary>(
  "RecommendedActionSummary",
)({ key: S.String, total: RecommendedActionTotal }) {}
export const RecommendedActionSummaries = S.Array(RecommendedActionSummary);
export class CreateAutomationRuleResponse extends S.Class<CreateAutomationRuleResponse>(
  "CreateAutomationRuleResponse",
)({
  ruleArn: S.optional(S.String),
  ruleId: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  ruleType: S.optional(S.String),
  ruleRevision: S.optional(S.Number),
  organizationConfiguration: S.optional(OrganizationConfiguration),
  priority: S.optional(S.String),
  recommendedActionTypes: S.optional(RecommendedActionTypeList),
  criteria: S.optional(Criteria),
  schedule: S.optional(Schedule),
  status: S.optional(S.String),
  tags: S.optional(TagList),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListAutomationEventsResponse extends S.Class<ListAutomationEventsResponse>(
  "ListAutomationEventsResponse",
)({
  automationEvents: S.optional(AutomationEvents),
  nextToken: S.optional(S.String),
}) {}
export class ListAutomationEventSummariesResponse extends S.Class<ListAutomationEventSummariesResponse>(
  "ListAutomationEventSummariesResponse",
)({
  automationEventSummaries: S.optional(AutomationEventSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListAutomationRulePreviewSummariesResponse extends S.Class<ListAutomationRulePreviewSummariesResponse>(
  "ListAutomationRulePreviewSummariesResponse",
)({
  previewResultSummaries: S.optional(PreviewResultSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListAutomationRulesResponse extends S.Class<ListAutomationRulesResponse>(
  "ListAutomationRulesResponse",
)({
  automationRules: S.optional(AutomationRules),
  nextToken: S.optional(S.String),
}) {}
export class ListRecommendedActionsResponse extends S.Class<ListRecommendedActionsResponse>(
  "ListRecommendedActionsResponse",
)({
  recommendedActions: S.optional(RecommendedActions),
  nextToken: S.optional(S.String),
}) {}
export class ListRecommendedActionSummariesResponse extends S.Class<ListRecommendedActionSummariesResponse>(
  "ListRecommendedActionSummariesResponse",
)({
  recommendedActionSummaries: S.optional(RecommendedActionSummaries),
  nextToken: S.optional(S.String),
}) {}
export class PreviewResult extends S.Class<PreviewResult>("PreviewResult")({
  recommendedActionId: S.optional(S.String),
  resourceArn: S.optional(S.String),
  resourceId: S.optional(S.String),
  accountId: S.optional(S.String),
  region: S.optional(S.String),
  resourceType: S.optional(S.String),
  lookBackPeriodInDays: S.optional(S.Number),
  recommendedActionType: S.optional(S.String),
  currentResourceSummary: S.optional(S.String),
  currentResourceDetails: S.optional(ResourceDetails),
  recommendedResourceSummary: S.optional(S.String),
  recommendedResourceDetails: S.optional(ResourceDetails),
  restartNeeded: S.optional(S.Boolean),
  estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
  resourceTags: S.optional(TagList),
}) {}
export const PreviewResults = S.Array(PreviewResult);
export class ListAutomationRulePreviewResponse extends S.Class<ListAutomationRulePreviewResponse>(
  "ListAutomationRulePreviewResponse",
)({
  previewResults: S.optional(PreviewResults),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {},
) {}
export class IdempotencyTokenInUseException extends S.TaggedError<IdempotencyTokenInUseException>()(
  "IdempotencyTokenInUseException",
  {},
) {}
export class IdempotentParameterMismatchException extends S.TaggedError<IdempotentParameterMismatchException>()(
  "IdempotentParameterMismatchException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  {},
) {}
export class OptInRequiredException extends S.TaggedError<OptInRequiredException>()(
  "OptInRequiredException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class NotManagementAccountException extends S.TaggedError<NotManagementAccountException>()(
  "NotManagementAccountException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Adds tags to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an existing automation rule.
 */
export const updateAutomationRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates your account’s Compute Optimizer Automation enrollment configuration.
 */
export const updateEnrollmentConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Associates one or more member accounts with your organization's management account, enabling centralized implementation of optimization actions across those accounts. Once associated, the management account (or a delegated administrator) can apply recommended actions to the member account. When you associate a member account, its organization rule mode is automatically set to "Any allowed," which permits the management account to create Automation rules that automatically apply actions to that account. If the member account has not previously enabled the Automation feature, the association process automatically enables it.
 *
 * Only the management account or a delegated administrator can perform this action.
 */
export const associateAccounts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an existing automation rule.
 */
export const deleteAutomationRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Disassociates member accounts from your organization's management account, removing centralized automation capabilities. Once disassociated, organization rules no longer apply to the member account, and the management account (or delegated administrator) cannot create Automation rules for that account.
 *
 * Only the management account or a delegated administrator can perform this action.
 */
export const disassociateAccounts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves details about a specific automation event.
 */
export const getAutomationEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves details about a specific automation rule.
 */
export const getAutomationRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the current enrollment configuration for Compute Optimizer Automation.
 */
export const getEnrollmentConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists the accounts in your organization that are enrolled in Compute Optimizer and whether they have enabled Automation.
 *
 * Only the management account or a delegated administrator can perform this action.
 */
export const listAccounts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the steps for a specific automation event. You can only list steps for events created within the past year.
 */
export const listAutomationEventSteps = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists the tags for a specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Initiates a rollback for a completed automation event.
 *
 * Management accounts and delegated administrators can only initiate a rollback for events belonging to associated member accounts. You can associate a member account using `AssociateAccounts`.
 */
export const rollbackAutomationEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Initiates a one-time, on-demand automation for the specified recommended action.
 *
 * Management accounts and delegated administrators can only initiate recommended actions for associated member accounts. You can associate a member account using `AssociateAccounts`.
 */
export const startAutomationEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a new automation rule to apply recommended actions to resources based on specified criteria.
 */
export const createAutomationRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists automation events based on specified filters. You can retrieve events that were created within the past year.
 */
export const listAutomationEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Provides a summary of automation events based on specified filters. Only events created within the past year will be included in the summary.
 */
export const listAutomationEventSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
  }));
/**
 * Returns a summary of the recommended actions that match your rule preview configuration and criteria.
 */
export const listAutomationRulePreviewSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
  }));
/**
 * Lists the automation rules that match specified filters.
 */
export const listAutomationRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the recommended actions based that match specified filters.
 *
 * Management accounts and delegated administrators can retrieve recommended actions that include associated member accounts. You can associate a member account using `AssociateAccounts`.
 */
export const listRecommendedActions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Provides a summary of recommended actions based on specified filters.
 *
 * Management accounts and delegated administrators can retrieve recommended actions that include associated member accounts. You can associate a member account using `AssociateAccounts`.
 */
export const listRecommendedActionSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
  }));
/**
 * Returns a preview of the recommended actions that match your Automation rule's configuration and criteria.
 */
export const listAutomationRulePreview = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
