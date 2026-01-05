import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Budgets",
  serviceShapeName: "AWSBudgetServiceGateway",
});
const auth = T.AwsAuthSigv4({ name: "budgets" });
const ver = T.ServiceVersion("2016-10-20");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://budgets.us-east-1.api.aws",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso-b",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://budgets.global.sc2s.sgov.gov",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-isob-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso-e",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://budgets.global.cloud.adc-e.uk",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "eu-isoe-west-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-iso-f",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://budgets.global.csp.hci.ic.gov",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "us-isof-south-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-eusc",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://budgets.eusc-de-east-1.api.amazonwebservices.eu",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "eusc-de-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-eusc",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://budgets.eusc-de-east-1.api.amazonwebservices.eu",
                    properties: {
                      authSchemes: [
                        { name: "sigv4", signingRegion: "eusc-de-east-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                          endpoint: {
                            url: "https://budgets-fips.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
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
                          endpoint: {
                            url: "https://budgets-fips.{PartitionResult#dnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
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
                          endpoint: {
                            url: "https://budgets.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    url: "https://budgets.{PartitionResult#dnsSuffix}",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingRegion:
                            "{PartitionResult#implicitGlobalRegion}",
                        },
                      ],
                    },
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
export const ResourceTagKeyList = S.Array(S.String);
export class Notification extends S.Class<Notification>("Notification")({
  NotificationType: S.String,
  ComparisonOperator: S.String,
  Threshold: S.Number,
  ThresholdType: S.optional(S.String),
  NotificationState: S.optional(S.String),
}) {}
export class Subscriber extends S.Class<Subscriber>("Subscriber")({
  SubscriptionType: S.String,
  Address: S.String,
}) {}
export class CreateSubscriberRequest extends S.Class<CreateSubscriberRequest>(
  "CreateSubscriberRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    Notification: Notification,
    Subscriber: Subscriber,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSubscriberResponse extends S.Class<CreateSubscriberResponse>(
  "CreateSubscriberResponse",
)({}) {}
export class DeleteBudgetRequest extends S.Class<DeleteBudgetRequest>(
  "DeleteBudgetRequest",
)(
  { AccountId: S.String, BudgetName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBudgetResponse extends S.Class<DeleteBudgetResponse>(
  "DeleteBudgetResponse",
)({}) {}
export class DeleteBudgetActionRequest extends S.Class<DeleteBudgetActionRequest>(
  "DeleteBudgetActionRequest",
)(
  { AccountId: S.String, BudgetName: S.String, ActionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNotificationRequest extends S.Class<DeleteNotificationRequest>(
  "DeleteNotificationRequest",
)(
  { AccountId: S.String, BudgetName: S.String, Notification: Notification },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNotificationResponse extends S.Class<DeleteNotificationResponse>(
  "DeleteNotificationResponse",
)({}) {}
export class DeleteSubscriberRequest extends S.Class<DeleteSubscriberRequest>(
  "DeleteSubscriberRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    Notification: Notification,
    Subscriber: Subscriber,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSubscriberResponse extends S.Class<DeleteSubscriberResponse>(
  "DeleteSubscriberResponse",
)({}) {}
export class DescribeBudgetRequest extends S.Class<DescribeBudgetRequest>(
  "DescribeBudgetRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    ShowFilterExpression: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBudgetActionRequest extends S.Class<DescribeBudgetActionRequest>(
  "DescribeBudgetActionRequest",
)(
  { AccountId: S.String, BudgetName: S.String, ActionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBudgetActionsForAccountRequest extends S.Class<DescribeBudgetActionsForAccountRequest>(
  "DescribeBudgetActionsForAccountRequest",
)(
  {
    AccountId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBudgetActionsForBudgetRequest extends S.Class<DescribeBudgetActionsForBudgetRequest>(
  "DescribeBudgetActionsForBudgetRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBudgetNotificationsForAccountRequest extends S.Class<DescribeBudgetNotificationsForAccountRequest>(
  "DescribeBudgetNotificationsForAccountRequest",
)(
  {
    AccountId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TimePeriod extends S.Class<TimePeriod>("TimePeriod")({
  Start: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  End: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeBudgetPerformanceHistoryRequest extends S.Class<DescribeBudgetPerformanceHistoryRequest>(
  "DescribeBudgetPerformanceHistoryRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    TimePeriod: S.optional(TimePeriod),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBudgetsRequest extends S.Class<DescribeBudgetsRequest>(
  "DescribeBudgetsRequest",
)(
  {
    AccountId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ShowFilterExpression: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeNotificationsForBudgetRequest extends S.Class<DescribeNotificationsForBudgetRequest>(
  "DescribeNotificationsForBudgetRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSubscribersForNotificationRequest extends S.Class<DescribeSubscribersForNotificationRequest>(
  "DescribeSubscribersForNotificationRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    Notification: Notification,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExecuteBudgetActionRequest extends S.Class<ExecuteBudgetActionRequest>(
  "ExecuteBudgetActionRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    ActionId: S.String,
    ExecutionType: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  Key: S.String,
  Value: S.String,
}) {}
export const ResourceTagList = S.Array(ResourceTag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, ResourceTags: ResourceTagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, ResourceTagKeys: ResourceTagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class Spend extends S.Class<Spend>("Spend")({
  Amount: S.String,
  Unit: S.String,
}) {}
export const PlannedBudgetLimits = S.Record({ key: S.String, value: Spend });
export const DimensionValues = S.Array(S.String);
export const CostFilters = S.Record({ key: S.String, value: DimensionValues });
export class CostTypes extends S.Class<CostTypes>("CostTypes")({
  IncludeTax: S.optional(S.Boolean),
  IncludeSubscription: S.optional(S.Boolean),
  UseBlended: S.optional(S.Boolean),
  IncludeRefund: S.optional(S.Boolean),
  IncludeCredit: S.optional(S.Boolean),
  IncludeUpfront: S.optional(S.Boolean),
  IncludeRecurring: S.optional(S.Boolean),
  IncludeOtherSubscription: S.optional(S.Boolean),
  IncludeSupport: S.optional(S.Boolean),
  IncludeDiscount: S.optional(S.Boolean),
  UseAmortized: S.optional(S.Boolean),
}) {}
export class CalculatedSpend extends S.Class<CalculatedSpend>(
  "CalculatedSpend",
)({ ActualSpend: Spend, ForecastedSpend: S.optional(Spend) }) {}
export class HistoricalOptions extends S.Class<HistoricalOptions>(
  "HistoricalOptions",
)({
  BudgetAdjustmentPeriod: S.Number,
  LookBackAvailablePeriods: S.optional(S.Number),
}) {}
export class AutoAdjustData extends S.Class<AutoAdjustData>("AutoAdjustData")({
  AutoAdjustType: S.String,
  HistoricalOptions: S.optional(HistoricalOptions),
  LastAutoAdjustTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const Values = S.Array(S.String);
export const MatchOptions = S.Array(S.String);
export class ExpressionDimensionValues extends S.Class<ExpressionDimensionValues>(
  "ExpressionDimensionValues",
)({ Key: S.String, Values: Values, MatchOptions: S.optional(MatchOptions) }) {}
export class TagValues extends S.Class<TagValues>("TagValues")({
  Key: S.optional(S.String),
  Values: S.optional(Values),
  MatchOptions: S.optional(MatchOptions),
}) {}
export class CostCategoryValues extends S.Class<CostCategoryValues>(
  "CostCategoryValues",
)({
  Key: S.optional(S.String),
  Values: S.optional(Values),
  MatchOptions: S.optional(MatchOptions),
}) {}
export class Expression extends S.Class<Expression>("Expression")({
  Or: S.optional(S.suspend(() => Expressions)),
  And: S.optional(S.suspend(() => Expressions)),
  Not: S.optional(S.suspend((): S.Schema<Expression, any> => Expression)),
  Dimensions: S.optional(ExpressionDimensionValues),
  Tags: S.optional(TagValues),
  CostCategories: S.optional(CostCategoryValues),
}) {}
export const Metrics = S.Array(S.String);
export class HealthStatus extends S.Class<HealthStatus>("HealthStatus")({
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class Budget extends S.Class<Budget>("Budget")({
  BudgetName: S.String,
  BudgetLimit: S.optional(Spend),
  PlannedBudgetLimits: S.optional(PlannedBudgetLimits),
  CostFilters: S.optional(CostFilters),
  CostTypes: S.optional(CostTypes),
  TimeUnit: S.String,
  TimePeriod: S.optional(TimePeriod),
  CalculatedSpend: S.optional(CalculatedSpend),
  BudgetType: S.String,
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AutoAdjustData: S.optional(AutoAdjustData),
  FilterExpression: S.optional(Expression),
  Metrics: S.optional(Metrics),
  BillingViewArn: S.optional(S.String),
  HealthStatus: S.optional(HealthStatus),
}) {}
export class UpdateBudgetRequest extends S.Class<UpdateBudgetRequest>(
  "UpdateBudgetRequest",
)(
  { AccountId: S.String, NewBudget: Budget },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateBudgetResponse extends S.Class<UpdateBudgetResponse>(
  "UpdateBudgetResponse",
)({}) {}
export class ActionThreshold extends S.Class<ActionThreshold>(
  "ActionThreshold",
)({ ActionThresholdValue: S.Number, ActionThresholdType: S.String }) {}
export const Roles = S.Array(S.String);
export const Groups = S.Array(S.String);
export const Users = S.Array(S.String);
export class IamActionDefinition extends S.Class<IamActionDefinition>(
  "IamActionDefinition",
)({
  PolicyArn: S.String,
  Roles: S.optional(Roles),
  Groups: S.optional(Groups),
  Users: S.optional(Users),
}) {}
export const TargetIds = S.Array(S.String);
export class ScpActionDefinition extends S.Class<ScpActionDefinition>(
  "ScpActionDefinition",
)({ PolicyId: S.String, TargetIds: TargetIds }) {}
export const InstanceIds = S.Array(S.String);
export class SsmActionDefinition extends S.Class<SsmActionDefinition>(
  "SsmActionDefinition",
)({ ActionSubType: S.String, Region: S.String, InstanceIds: InstanceIds }) {}
export class Definition extends S.Class<Definition>("Definition")({
  IamActionDefinition: S.optional(IamActionDefinition),
  ScpActionDefinition: S.optional(ScpActionDefinition),
  SsmActionDefinition: S.optional(SsmActionDefinition),
}) {}
export const Subscribers = S.Array(Subscriber);
export class UpdateBudgetActionRequest extends S.Class<UpdateBudgetActionRequest>(
  "UpdateBudgetActionRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    ActionId: S.String,
    NotificationType: S.optional(S.String),
    ActionThreshold: S.optional(ActionThreshold),
    Definition: S.optional(Definition),
    ExecutionRoleArn: S.optional(S.String),
    ApprovalModel: S.optional(S.String),
    Subscribers: S.optional(Subscribers),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateNotificationRequest extends S.Class<UpdateNotificationRequest>(
  "UpdateNotificationRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    OldNotification: Notification,
    NewNotification: Notification,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateNotificationResponse extends S.Class<UpdateNotificationResponse>(
  "UpdateNotificationResponse",
)({}) {}
export class UpdateSubscriberRequest extends S.Class<UpdateSubscriberRequest>(
  "UpdateSubscriberRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    Notification: Notification,
    OldSubscriber: Subscriber,
    NewSubscriber: Subscriber,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSubscriberResponse extends S.Class<UpdateSubscriberResponse>(
  "UpdateSubscriberResponse",
)({}) {}
export class NotificationWithSubscribers extends S.Class<NotificationWithSubscribers>(
  "NotificationWithSubscribers",
)({ Notification: Notification, Subscribers: Subscribers }) {}
export const NotificationWithSubscribersList = S.Array(
  NotificationWithSubscribers,
);
export class Action extends S.Class<Action>("Action")({
  ActionId: S.String,
  BudgetName: S.String,
  NotificationType: S.String,
  ActionType: S.String,
  ActionThreshold: ActionThreshold,
  Definition: Definition,
  ExecutionRoleArn: S.String,
  ApprovalModel: S.String,
  Status: S.String,
  Subscribers: Subscribers,
}) {}
export const Actions = S.Array(Action);
export const Budgets = S.Array(Budget);
export const Notifications = S.Array(Notification);
export type Expressions = Expression[];
export const Expressions = S.Array(
  S.suspend((): S.Schema<Expression, any> => Expression),
) as any as S.Schema<Expressions>;
export class CreateNotificationRequest extends S.Class<CreateNotificationRequest>(
  "CreateNotificationRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    Notification: Notification,
    Subscribers: Subscribers,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateNotificationResponse extends S.Class<CreateNotificationResponse>(
  "CreateNotificationResponse",
)({}) {}
export class DescribeBudgetResponse extends S.Class<DescribeBudgetResponse>(
  "DescribeBudgetResponse",
)({ Budget: S.optional(Budget) }) {}
export class DescribeBudgetActionResponse extends S.Class<DescribeBudgetActionResponse>(
  "DescribeBudgetActionResponse",
)({ AccountId: S.String, BudgetName: S.String, Action: Action }) {}
export class DescribeBudgetActionHistoriesRequest extends S.Class<DescribeBudgetActionHistoriesRequest>(
  "DescribeBudgetActionHistoriesRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    ActionId: S.String,
    TimePeriod: S.optional(TimePeriod),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBudgetActionsForAccountResponse extends S.Class<DescribeBudgetActionsForAccountResponse>(
  "DescribeBudgetActionsForAccountResponse",
)({ Actions: Actions, NextToken: S.optional(S.String) }) {}
export class DescribeBudgetActionsForBudgetResponse extends S.Class<DescribeBudgetActionsForBudgetResponse>(
  "DescribeBudgetActionsForBudgetResponse",
)({ Actions: Actions, NextToken: S.optional(S.String) }) {}
export class DescribeBudgetsResponse extends S.Class<DescribeBudgetsResponse>(
  "DescribeBudgetsResponse",
)({ Budgets: S.optional(Budgets), NextToken: S.optional(S.String) }) {}
export class DescribeNotificationsForBudgetResponse extends S.Class<DescribeNotificationsForBudgetResponse>(
  "DescribeNotificationsForBudgetResponse",
)({
  Notifications: S.optional(Notifications),
  NextToken: S.optional(S.String),
}) {}
export class DescribeSubscribersForNotificationResponse extends S.Class<DescribeSubscribersForNotificationResponse>(
  "DescribeSubscribersForNotificationResponse",
)({ Subscribers: S.optional(Subscribers), NextToken: S.optional(S.String) }) {}
export class ExecuteBudgetActionResponse extends S.Class<ExecuteBudgetActionResponse>(
  "ExecuteBudgetActionResponse",
)({
  AccountId: S.String,
  BudgetName: S.String,
  ActionId: S.String,
  ExecutionType: S.String,
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ ResourceTags: S.optional(ResourceTagList) }) {}
export class UpdateBudgetActionResponse extends S.Class<UpdateBudgetActionResponse>(
  "UpdateBudgetActionResponse",
)({
  AccountId: S.String,
  BudgetName: S.String,
  OldAction: Action,
  NewAction: Action,
}) {}
export class BudgetNotificationsForAccount extends S.Class<BudgetNotificationsForAccount>(
  "BudgetNotificationsForAccount",
)({
  Notifications: S.optional(Notifications),
  BudgetName: S.optional(S.String),
}) {}
export const BudgetNotificationsForAccountList = S.Array(
  BudgetNotificationsForAccount,
);
export class CreateBudgetActionRequest extends S.Class<CreateBudgetActionRequest>(
  "CreateBudgetActionRequest",
)(
  {
    AccountId: S.String,
    BudgetName: S.String,
    NotificationType: S.String,
    ActionType: S.String,
    ActionThreshold: ActionThreshold,
    Definition: Definition,
    ExecutionRoleArn: S.String,
    ApprovalModel: S.String,
    Subscribers: Subscribers,
    ResourceTags: S.optional(ResourceTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBudgetActionResponse extends S.Class<DeleteBudgetActionResponse>(
  "DeleteBudgetActionResponse",
)({ AccountId: S.String, BudgetName: S.String, Action: Action }) {}
export class DescribeBudgetNotificationsForAccountResponse extends S.Class<DescribeBudgetNotificationsForAccountResponse>(
  "DescribeBudgetNotificationsForAccountResponse",
)({
  BudgetNotificationsForAccount: S.optional(BudgetNotificationsForAccountList),
  NextToken: S.optional(S.String),
}) {}
export class BudgetedAndActualAmounts extends S.Class<BudgetedAndActualAmounts>(
  "BudgetedAndActualAmounts",
)({
  BudgetedAmount: S.optional(Spend),
  ActualAmount: S.optional(Spend),
  TimePeriod: S.optional(TimePeriod),
}) {}
export const BudgetedAndActualAmountsList = S.Array(BudgetedAndActualAmounts);
export class BudgetPerformanceHistory extends S.Class<BudgetPerformanceHistory>(
  "BudgetPerformanceHistory",
)({
  BudgetName: S.optional(S.String),
  BudgetType: S.optional(S.String),
  CostFilters: S.optional(CostFilters),
  CostTypes: S.optional(CostTypes),
  TimeUnit: S.optional(S.String),
  BillingViewArn: S.optional(S.String),
  BudgetedAndActualAmountsList: S.optional(BudgetedAndActualAmountsList),
}) {}
export class CreateBudgetRequest extends S.Class<CreateBudgetRequest>(
  "CreateBudgetRequest",
)(
  {
    AccountId: S.String,
    Budget: Budget,
    NotificationsWithSubscribers: S.optional(NotificationWithSubscribersList),
    ResourceTags: S.optional(ResourceTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBudgetResponse extends S.Class<CreateBudgetResponse>(
  "CreateBudgetResponse",
)({}) {}
export class CreateBudgetActionResponse extends S.Class<CreateBudgetActionResponse>(
  "CreateBudgetActionResponse",
)({ AccountId: S.String, BudgetName: S.String, ActionId: S.String }) {}
export class DescribeBudgetPerformanceHistoryResponse extends S.Class<DescribeBudgetPerformanceHistoryResponse>(
  "DescribeBudgetPerformanceHistoryResponse",
)({
  BudgetPerformanceHistory: S.optional(BudgetPerformanceHistory),
  NextToken: S.optional(S.String),
}) {}
export class ActionHistoryDetails extends S.Class<ActionHistoryDetails>(
  "ActionHistoryDetails",
)({ Message: S.String, Action: Action }) {}
export class ActionHistory extends S.Class<ActionHistory>("ActionHistory")({
  Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Status: S.String,
  EventType: S.String,
  ActionHistoryDetails: ActionHistoryDetails,
}) {}
export const ActionHistories = S.Array(ActionHistory);
export class DescribeBudgetActionHistoriesResponse extends S.Class<DescribeBudgetActionHistoriesResponse>(
  "DescribeBudgetActionHistoriesResponse",
)({ ActionHistories: ActionHistories, NextToken: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class CreationLimitExceededException extends S.TaggedError<CreationLimitExceededException>()(
  "CreationLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ExpiredNextTokenException extends S.TaggedError<ExpiredNextTokenException>()(
  "ExpiredNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class BillingViewHealthStatusException extends S.TaggedError<BillingViewHealthStatusException>()(
  "BillingViewHealthStatusException",
  { Message: S.optional(S.String) },
) {}
export class DuplicateRecordException extends S.TaggedError<DuplicateRecordException>()(
  "DuplicateRecordException",
  { Message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ResourceLockedException extends S.TaggedError<ResourceLockedException>()(
  "ResourceLockedException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Describes all of the budget actions for an account.
 */
export const describeBudgetActionsForAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeBudgetActionsForAccountRequest,
    output: DescribeBudgetActionsForAccountResponse,
    errors: [
      AccessDeniedException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Actions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Describes a budget.
 *
 * The Request Syntax section shows the `BudgetLimit` syntax. For
 * `PlannedBudgetLimits`, see the Examples section.
 */
export const describeBudget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBudgetRequest,
  output: DescribeBudgetResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes a budget action history detail.
 */
export const describeBudgetActionHistories =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeBudgetActionHistoriesRequest,
    output: DescribeBudgetActionHistoriesResponse,
    errors: [
      AccessDeniedException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      NotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ActionHistories",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the budgets that are associated with an account.
 *
 * The Request Syntax section shows the `BudgetLimit` syntax. For
 * `PlannedBudgetLimits`, see the Examples section.
 */
export const describeBudgets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeBudgetsRequest,
    output: DescribeBudgetsResponse,
    errors: [
      AccessDeniedException,
      ExpiredNextTokenException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      NotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Budgets",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Updates a notification.
 */
export const updateNotification = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNotificationRequest,
  output: UpdateNotificationResponse,
  errors: [
    AccessDeniedException,
    DuplicateRecordException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a notification. You must create the budget before you create the associated notification.
 */
export const createNotification = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNotificationRequest,
  output: CreateNotificationResponse,
  errors: [
    AccessDeniedException,
    CreationLimitExceededException,
    DuplicateRecordException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes a budget action detail.
 */
export const describeBudgetAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeBudgetActionRequest,
    output: DescribeBudgetActionResponse,
    errors: [
      AccessDeniedException,
      InternalErrorException,
      InvalidParameterException,
      NotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists tags associated with a budget or budget action resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a budget. You can delete your budget at any time.
 *
 * Deleting a budget also deletes the notifications and subscribers that are associated with that budget.
 */
export const deleteBudget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBudgetRequest,
  output: DeleteBudgetResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a notification.
 *
 * Deleting a notification also deletes the subscribers that are associated with the notification.
 */
export const deleteNotification = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNotificationRequest,
  output: DeleteNotificationResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a subscriber.
 *
 * Deleting the last subscriber to a notification also deletes the notification.
 */
export const deleteSubscriber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubscriberRequest,
  output: DeleteSubscriberResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes tags associated with a budget or budget action resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a subscriber.
 */
export const updateSubscriber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSubscriberRequest,
  output: UpdateSubscriberResponse,
  errors: [
    AccessDeniedException,
    DuplicateRecordException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a subscriber. You must create the associated budget and notification before you create the subscriber.
 */
export const createSubscriber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubscriberRequest,
  output: CreateSubscriberResponse,
  errors: [
    AccessDeniedException,
    CreationLimitExceededException,
    DuplicateRecordException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes all of the budget actions for a budget.
 */
export const describeBudgetActionsForBudget =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeBudgetActionsForBudgetRequest,
    output: DescribeBudgetActionsForBudgetResponse,
    errors: [
      AccessDeniedException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      NotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Actions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the notifications that are associated with a budget.
 */
export const describeNotificationsForBudget =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeNotificationsForBudgetRequest,
    output: DescribeNotificationsForBudgetResponse,
    errors: [
      AccessDeniedException,
      ExpiredNextTokenException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      NotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Notifications",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the subscribers that are associated with a notification.
 */
export const describeSubscribersForNotification =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeSubscribersForNotificationRequest,
    output: DescribeSubscribersForNotificationResponse,
    errors: [
      AccessDeniedException,
      ExpiredNextTokenException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      NotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Subscribers",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the budget names and notifications that are associated with an account.
 */
export const describeBudgetNotificationsForAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeBudgetNotificationsForAccountRequest,
    output: DescribeBudgetNotificationsForAccountResponse,
    errors: [
      AccessDeniedException,
      ExpiredNextTokenException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      NotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "BudgetNotificationsForAccount",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Describes the history for `DAILY`, `MONTHLY`, and `QUARTERLY` budgets. Budget history isn't available for `ANNUAL` budgets.
 */
export const describeBudgetPerformanceHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeBudgetPerformanceHistoryRequest,
    output: DescribeBudgetPerformanceHistoryResponse,
    errors: [
      AccessDeniedException,
      BillingViewHealthStatusException,
      ExpiredNextTokenException,
      InternalErrorException,
      InvalidNextTokenException,
      InvalidParameterException,
      NotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Updates a budget. You can change every part of a budget except for the `budgetName` and the `calculatedSpend`. When you modify a budget, the `calculatedSpend` drops to zero until Amazon Web Services has new usage data to use for forecasting.
 *
 * Only one of `BudgetLimit` or `PlannedBudgetLimits` can be present in
 * the syntax at one time. Use the syntax that matches your case. The Request Syntax
 * section shows the `BudgetLimit` syntax. For `PlannedBudgetLimits`,
 * see the Examples section.
 *
 * Similarly, only one set of filter and metric selections can be present in the syntax
 * at one time. Either `FilterExpression` and `Metrics` or
 * `CostFilters` and `CostTypes`, not both or a different
 * combination. We recommend using `FilterExpression` and `Metrics`
 * as they provide more flexible and powerful filtering capabilities. The Request Syntax
 * section shows the `FilterExpression`/`Metrics` syntax.
 */
export const updateBudget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBudgetRequest,
  output: UpdateBudgetResponse,
  errors: [
    AccessDeniedException,
    BillingViewHealthStatusException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Executes a budget action.
 */
export const executeBudgetAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteBudgetActionRequest,
  output: ExecuteBudgetActionResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ResourceLockedException,
    ThrottlingException,
  ],
}));
/**
 * Creates tags for a budget or budget action resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates a budget and, if included, notifications and subscribers.
 *
 * Only one of `BudgetLimit` or `PlannedBudgetLimits` can be present in
 * the syntax at one time. Use the syntax that matches your use case. The Request Syntax
 * section shows the `BudgetLimit` syntax. For `PlannedBudgetLimits`,
 * see the Examples section.
 *
 * Similarly, only one set of filter and metric selections can be present in the syntax
 * at one time. Either `FilterExpression` and `Metrics` or
 * `CostFilters` and `CostTypes`, not both or a different
 * combination. We recommend using `FilterExpression` and `Metrics`
 * as they provide more flexible and powerful filtering capabilities. The Request Syntax
 * section shows the `FilterExpression`/`Metrics` syntax.
 */
export const createBudget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBudgetRequest,
  output: CreateBudgetResponse,
  errors: [
    AccessDeniedException,
    BillingViewHealthStatusException,
    CreationLimitExceededException,
    DuplicateRecordException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates a budget action.
 */
export const createBudgetAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBudgetActionRequest,
  output: CreateBudgetActionResponse,
  errors: [
    AccessDeniedException,
    CreationLimitExceededException,
    DuplicateRecordException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Updates a budget action.
 */
export const updateBudgetAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBudgetActionRequest,
  output: UpdateBudgetActionResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ResourceLockedException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a budget action.
 */
export const deleteBudgetAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBudgetActionRequest,
  output: DeleteBudgetActionResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ResourceLockedException,
    ThrottlingException,
  ],
}));
