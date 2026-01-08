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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Budgets",
  serviceShapeName: "AWSBudgetServiceGateway",
});
const auth = T.AwsAuthSigv4({ name: "budgets" });
const ver = T.ServiceVersion("2016-10-20");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "eusc-de-east-1" }],
  });
  const _p1 = (_0: unknown) => ({
    authSchemes: [
      {
        name: "sigv4",
        signingRegion: `${_.getAttr(_0, "implicitGlobalRegion")}`,
      },
    ],
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            "https://budgets.us-east-1.api.aws",
            { authSchemes: [{ name: "sigv4", signingRegion: "us-east-1" }] },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://budgets.global.sc2s.sgov.gov",
            {
              authSchemes: [{ name: "sigv4", signingRegion: "us-isob-east-1" }],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-e" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://budgets.global.cloud.adc-e.uk",
            {
              authSchemes: [{ name: "sigv4", signingRegion: "eu-isoe-west-1" }],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://budgets.global.csp.hci.ic.gov",
            {
              authSchemes: [
                { name: "sigv4", signingRegion: "us-isof-south-1" },
              ],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://budgets.eusc-de-east-1.api.amazonwebservices.eu",
            _p0(),
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            "https://budgets.eusc-de-east-1.api.amazonwebservices.eu",
            _p0(),
            {},
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://budgets-fips.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p1(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://budgets-fips.${_.getAttr(PartitionResult, "dnsSuffix")}`,
              _p1(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://budgets.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p1(PartitionResult),
              {},
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://budgets.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          _p1(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AccountId = string;
export type BudgetName = string;
export type RoleArn = string;
export type ActionId = string;
export type MaxResults = number;
export type MaxResultsBudgetNotifications = number;
export type MaxResultsDescribeBudgets = number;
export type AmazonResourceName = string;
export type ResourceTagKey = string;
export type BillingViewArn = string;
export type ResourceTagValue = string;
export type NotificationThreshold = number;
export type SubscriberAddress = string | redacted.Redacted<string>;
export type ErrorMessage = string;
export type NumericValue = string;
export type UnitValue = string;
export type DimensionValue = string;
export type PolicyArn = string;
export type Role = string;
export type Group = string;
export type User = string;
export type PolicyId = string;
export type TargetId = string;
export type Region = string;
export type InstanceId = string;
export type AdjustmentPeriod = number;
export type Value = string;
export type TagKey = string;
export type CostCategoryName = string;

//# Schemas
export type NotificationType = "ACTUAL" | "FORECASTED";
export const NotificationType = S.Literal("ACTUAL", "FORECASTED");
export type ActionType =
  | "APPLY_IAM_POLICY"
  | "APPLY_SCP_POLICY"
  | "RUN_SSM_DOCUMENTS";
export const ActionType = S.Literal(
  "APPLY_IAM_POLICY",
  "APPLY_SCP_POLICY",
  "RUN_SSM_DOCUMENTS",
);
export type ApprovalModel = "AUTOMATIC" | "MANUAL";
export const ApprovalModel = S.Literal("AUTOMATIC", "MANUAL");
export type ExecutionType =
  | "APPROVE_BUDGET_ACTION"
  | "RETRY_BUDGET_ACTION"
  | "REVERSE_BUDGET_ACTION"
  | "RESET_BUDGET_ACTION";
export const ExecutionType = S.Literal(
  "APPROVE_BUDGET_ACTION",
  "RETRY_BUDGET_ACTION",
  "REVERSE_BUDGET_ACTION",
  "RESET_BUDGET_ACTION",
);
export type ResourceTagKeyList = string[];
export const ResourceTagKeyList = S.Array(S.String);
export type ComparisonOperator = "GREATER_THAN" | "LESS_THAN" | "EQUAL_TO";
export const ComparisonOperator = S.Literal(
  "GREATER_THAN",
  "LESS_THAN",
  "EQUAL_TO",
);
export type ThresholdType = "PERCENTAGE" | "ABSOLUTE_VALUE";
export const ThresholdType = S.Literal("PERCENTAGE", "ABSOLUTE_VALUE");
export type NotificationState = "OK" | "ALARM";
export const NotificationState = S.Literal("OK", "ALARM");
export interface Notification {
  NotificationType: NotificationType;
  ComparisonOperator: ComparisonOperator;
  Threshold: number;
  ThresholdType?: ThresholdType;
  NotificationState?: NotificationState;
}
export const Notification = S.suspend(() =>
  S.Struct({
    NotificationType: NotificationType,
    ComparisonOperator: ComparisonOperator,
    Threshold: S.Number,
    ThresholdType: S.optional(ThresholdType),
    NotificationState: S.optional(NotificationState),
  }),
).annotations({ identifier: "Notification" }) as any as S.Schema<Notification>;
export type SubscriptionType = "SNS" | "EMAIL";
export const SubscriptionType = S.Literal("SNS", "EMAIL");
export interface Subscriber {
  SubscriptionType: SubscriptionType;
  Address: string | redacted.Redacted<string>;
}
export const Subscriber = S.suspend(() =>
  S.Struct({ SubscriptionType: SubscriptionType, Address: SensitiveString }),
).annotations({ identifier: "Subscriber" }) as any as S.Schema<Subscriber>;
export interface CreateSubscriberRequest {
  AccountId: string;
  BudgetName: string;
  Notification: Notification;
  Subscriber: Subscriber;
}
export const CreateSubscriberRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    Notification: Notification,
    Subscriber: Subscriber,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSubscriberRequest",
}) as any as S.Schema<CreateSubscriberRequest>;
export interface CreateSubscriberResponse {}
export const CreateSubscriberResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateSubscriberResponse",
}) as any as S.Schema<CreateSubscriberResponse>;
export interface DeleteBudgetRequest {
  AccountId: string;
  BudgetName: string;
}
export const DeleteBudgetRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String, BudgetName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteBudgetRequest",
}) as any as S.Schema<DeleteBudgetRequest>;
export interface DeleteBudgetResponse {}
export const DeleteBudgetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteBudgetResponse",
}) as any as S.Schema<DeleteBudgetResponse>;
export interface DeleteBudgetActionRequest {
  AccountId: string;
  BudgetName: string;
  ActionId: string;
}
export const DeleteBudgetActionRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    ActionId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteBudgetActionRequest",
}) as any as S.Schema<DeleteBudgetActionRequest>;
export interface DeleteNotificationRequest {
  AccountId: string;
  BudgetName: string;
  Notification: Notification;
}
export const DeleteNotificationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    Notification: Notification,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteNotificationRequest",
}) as any as S.Schema<DeleteNotificationRequest>;
export interface DeleteNotificationResponse {}
export const DeleteNotificationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteNotificationResponse",
}) as any as S.Schema<DeleteNotificationResponse>;
export interface DeleteSubscriberRequest {
  AccountId: string;
  BudgetName: string;
  Notification: Notification;
  Subscriber: Subscriber;
}
export const DeleteSubscriberRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    Notification: Notification,
    Subscriber: Subscriber,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSubscriberRequest",
}) as any as S.Schema<DeleteSubscriberRequest>;
export interface DeleteSubscriberResponse {}
export const DeleteSubscriberResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSubscriberResponse",
}) as any as S.Schema<DeleteSubscriberResponse>;
export interface DescribeBudgetRequest {
  AccountId: string;
  BudgetName: string;
  ShowFilterExpression?: boolean;
}
export const DescribeBudgetRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    ShowFilterExpression: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBudgetRequest",
}) as any as S.Schema<DescribeBudgetRequest>;
export interface DescribeBudgetActionRequest {
  AccountId: string;
  BudgetName: string;
  ActionId: string;
}
export const DescribeBudgetActionRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    ActionId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBudgetActionRequest",
}) as any as S.Schema<DescribeBudgetActionRequest>;
export interface DescribeBudgetActionsForAccountRequest {
  AccountId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeBudgetActionsForAccountRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBudgetActionsForAccountRequest",
}) as any as S.Schema<DescribeBudgetActionsForAccountRequest>;
export interface DescribeBudgetActionsForBudgetRequest {
  AccountId: string;
  BudgetName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeBudgetActionsForBudgetRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBudgetActionsForBudgetRequest",
}) as any as S.Schema<DescribeBudgetActionsForBudgetRequest>;
export interface DescribeBudgetNotificationsForAccountRequest {
  AccountId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeBudgetNotificationsForAccountRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBudgetNotificationsForAccountRequest",
}) as any as S.Schema<DescribeBudgetNotificationsForAccountRequest>;
export interface TimePeriod {
  Start?: Date;
  End?: Date;
}
export const TimePeriod = S.suspend(() =>
  S.Struct({
    Start: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    End: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "TimePeriod" }) as any as S.Schema<TimePeriod>;
export interface DescribeBudgetPerformanceHistoryRequest {
  AccountId: string;
  BudgetName: string;
  TimePeriod?: TimePeriod;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeBudgetPerformanceHistoryRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    TimePeriod: S.optional(TimePeriod),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBudgetPerformanceHistoryRequest",
}) as any as S.Schema<DescribeBudgetPerformanceHistoryRequest>;
export interface DescribeBudgetsRequest {
  AccountId: string;
  MaxResults?: number;
  NextToken?: string;
  ShowFilterExpression?: boolean;
}
export const DescribeBudgetsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ShowFilterExpression: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBudgetsRequest",
}) as any as S.Schema<DescribeBudgetsRequest>;
export interface DescribeNotificationsForBudgetRequest {
  AccountId: string;
  BudgetName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeNotificationsForBudgetRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeNotificationsForBudgetRequest",
}) as any as S.Schema<DescribeNotificationsForBudgetRequest>;
export interface DescribeSubscribersForNotificationRequest {
  AccountId: string;
  BudgetName: string;
  Notification: Notification;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeSubscribersForNotificationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    Notification: Notification,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSubscribersForNotificationRequest",
}) as any as S.Schema<DescribeSubscribersForNotificationRequest>;
export interface ExecuteBudgetActionRequest {
  AccountId: string;
  BudgetName: string;
  ActionId: string;
  ExecutionType: ExecutionType;
}
export const ExecuteBudgetActionRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    ActionId: S.String,
    ExecutionType: ExecutionType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExecuteBudgetActionRequest",
}) as any as S.Schema<ExecuteBudgetActionRequest>;
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
export interface ResourceTag {
  Key: string;
  Value: string;
}
export const ResourceTag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "ResourceTag" }) as any as S.Schema<ResourceTag>;
export type ResourceTagList = ResourceTag[];
export const ResourceTagList = S.Array(ResourceTag);
export interface TagResourceRequest {
  ResourceARN: string;
  ResourceTags: ResourceTag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, ResourceTags: ResourceTagList }).pipe(
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
  ResourceTagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, ResourceTagKeys: ResourceTagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface Spend {
  Amount: string;
  Unit: string;
}
export const Spend = S.suspend(() =>
  S.Struct({ Amount: S.String, Unit: S.String }),
).annotations({ identifier: "Spend" }) as any as S.Schema<Spend>;
export type PlannedBudgetLimits = { [key: string]: Spend };
export const PlannedBudgetLimits = S.Record({ key: S.String, value: Spend });
export type DimensionValues = string[];
export const DimensionValues = S.Array(S.String);
export type CostFilters = { [key: string]: string[] };
export const CostFilters = S.Record({ key: S.String, value: DimensionValues });
export interface CostTypes {
  IncludeTax?: boolean;
  IncludeSubscription?: boolean;
  UseBlended?: boolean;
  IncludeRefund?: boolean;
  IncludeCredit?: boolean;
  IncludeUpfront?: boolean;
  IncludeRecurring?: boolean;
  IncludeOtherSubscription?: boolean;
  IncludeSupport?: boolean;
  IncludeDiscount?: boolean;
  UseAmortized?: boolean;
}
export const CostTypes = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "CostTypes" }) as any as S.Schema<CostTypes>;
export type TimeUnit =
  | "DAILY"
  | "MONTHLY"
  | "QUARTERLY"
  | "ANNUALLY"
  | "CUSTOM";
export const TimeUnit = S.Literal(
  "DAILY",
  "MONTHLY",
  "QUARTERLY",
  "ANNUALLY",
  "CUSTOM",
);
export interface CalculatedSpend {
  ActualSpend: Spend;
  ForecastedSpend?: Spend;
}
export const CalculatedSpend = S.suspend(() =>
  S.Struct({ ActualSpend: Spend, ForecastedSpend: S.optional(Spend) }),
).annotations({
  identifier: "CalculatedSpend",
}) as any as S.Schema<CalculatedSpend>;
export type BudgetType =
  | "USAGE"
  | "COST"
  | "RI_UTILIZATION"
  | "RI_COVERAGE"
  | "SAVINGS_PLANS_UTILIZATION"
  | "SAVINGS_PLANS_COVERAGE";
export const BudgetType = S.Literal(
  "USAGE",
  "COST",
  "RI_UTILIZATION",
  "RI_COVERAGE",
  "SAVINGS_PLANS_UTILIZATION",
  "SAVINGS_PLANS_COVERAGE",
);
export type AutoAdjustType = "HISTORICAL" | "FORECAST";
export const AutoAdjustType = S.Literal("HISTORICAL", "FORECAST");
export interface HistoricalOptions {
  BudgetAdjustmentPeriod: number;
  LookBackAvailablePeriods?: number;
}
export const HistoricalOptions = S.suspend(() =>
  S.Struct({
    BudgetAdjustmentPeriod: S.Number,
    LookBackAvailablePeriods: S.optional(S.Number),
  }),
).annotations({
  identifier: "HistoricalOptions",
}) as any as S.Schema<HistoricalOptions>;
export interface AutoAdjustData {
  AutoAdjustType: AutoAdjustType;
  HistoricalOptions?: HistoricalOptions;
  LastAutoAdjustTime?: Date;
}
export const AutoAdjustData = S.suspend(() =>
  S.Struct({
    AutoAdjustType: AutoAdjustType,
    HistoricalOptions: S.optional(HistoricalOptions),
    LastAutoAdjustTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "AutoAdjustData",
}) as any as S.Schema<AutoAdjustData>;
export type Dimension =
  | "AZ"
  | "INSTANCE_TYPE"
  | "LINKED_ACCOUNT"
  | "LINKED_ACCOUNT_NAME"
  | "OPERATION"
  | "PURCHASE_TYPE"
  | "REGION"
  | "SERVICE"
  | "SERVICE_CODE"
  | "USAGE_TYPE"
  | "USAGE_TYPE_GROUP"
  | "RECORD_TYPE"
  | "OPERATING_SYSTEM"
  | "TENANCY"
  | "SCOPE"
  | "PLATFORM"
  | "SUBSCRIPTION_ID"
  | "LEGAL_ENTITY_NAME"
  | "INVOICING_ENTITY"
  | "DEPLOYMENT_OPTION"
  | "DATABASE_ENGINE"
  | "CACHE_ENGINE"
  | "INSTANCE_TYPE_FAMILY"
  | "BILLING_ENTITY"
  | "RESERVATION_ID"
  | "RESOURCE_ID"
  | "RIGHTSIZING_TYPE"
  | "SAVINGS_PLANS_TYPE"
  | "SAVINGS_PLAN_ARN"
  | "PAYMENT_OPTION"
  | "RESERVATION_MODIFIED"
  | "TAG_KEY"
  | "COST_CATEGORY_NAME";
export const Dimension = S.Literal(
  "AZ",
  "INSTANCE_TYPE",
  "LINKED_ACCOUNT",
  "LINKED_ACCOUNT_NAME",
  "OPERATION",
  "PURCHASE_TYPE",
  "REGION",
  "SERVICE",
  "SERVICE_CODE",
  "USAGE_TYPE",
  "USAGE_TYPE_GROUP",
  "RECORD_TYPE",
  "OPERATING_SYSTEM",
  "TENANCY",
  "SCOPE",
  "PLATFORM",
  "SUBSCRIPTION_ID",
  "LEGAL_ENTITY_NAME",
  "INVOICING_ENTITY",
  "DEPLOYMENT_OPTION",
  "DATABASE_ENGINE",
  "CACHE_ENGINE",
  "INSTANCE_TYPE_FAMILY",
  "BILLING_ENTITY",
  "RESERVATION_ID",
  "RESOURCE_ID",
  "RIGHTSIZING_TYPE",
  "SAVINGS_PLANS_TYPE",
  "SAVINGS_PLAN_ARN",
  "PAYMENT_OPTION",
  "RESERVATION_MODIFIED",
  "TAG_KEY",
  "COST_CATEGORY_NAME",
);
export type Values = string[];
export const Values = S.Array(S.String);
export type MatchOption =
  | "EQUALS"
  | "ABSENT"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "CONTAINS"
  | "GREATER_THAN_OR_EQUAL"
  | "CASE_SENSITIVE"
  | "CASE_INSENSITIVE";
export const MatchOption = S.Literal(
  "EQUALS",
  "ABSENT",
  "STARTS_WITH",
  "ENDS_WITH",
  "CONTAINS",
  "GREATER_THAN_OR_EQUAL",
  "CASE_SENSITIVE",
  "CASE_INSENSITIVE",
);
export type MatchOptions = MatchOption[];
export const MatchOptions = S.Array(MatchOption);
export interface ExpressionDimensionValues {
  Key: Dimension;
  Values: string[];
  MatchOptions?: MatchOption[];
}
export const ExpressionDimensionValues = S.suspend(() =>
  S.Struct({
    Key: Dimension,
    Values: Values,
    MatchOptions: S.optional(MatchOptions),
  }),
).annotations({
  identifier: "ExpressionDimensionValues",
}) as any as S.Schema<ExpressionDimensionValues>;
export interface TagValues {
  Key?: string;
  Values?: string[];
  MatchOptions?: MatchOption[];
}
export const TagValues = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Values: S.optional(Values),
    MatchOptions: S.optional(MatchOptions),
  }),
).annotations({ identifier: "TagValues" }) as any as S.Schema<TagValues>;
export interface CostCategoryValues {
  Key?: string;
  Values?: string[];
  MatchOptions?: MatchOption[];
}
export const CostCategoryValues = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Values: S.optional(Values),
    MatchOptions: S.optional(MatchOptions),
  }),
).annotations({
  identifier: "CostCategoryValues",
}) as any as S.Schema<CostCategoryValues>;
export interface Expression {
  Or?: Expression[];
  And?: Expression[];
  Not?: Expression;
  Dimensions?: ExpressionDimensionValues;
  Tags?: TagValues;
  CostCategories?: CostCategoryValues;
}
export const Expression = S.suspend(() =>
  S.Struct({
    Or: S.optional(
      S.suspend(() => Expressions).annotations({ identifier: "Expressions" }),
    ),
    And: S.optional(
      S.suspend(() => Expressions).annotations({ identifier: "Expressions" }),
    ),
    Not: S.optional(
      S.suspend((): S.Schema<Expression, any> => Expression).annotations({
        identifier: "Expression",
      }),
    ),
    Dimensions: S.optional(ExpressionDimensionValues),
    Tags: S.optional(TagValues),
    CostCategories: S.optional(CostCategoryValues),
  }),
).annotations({ identifier: "Expression" }) as any as S.Schema<Expression>;
export type Metric =
  | "BlendedCost"
  | "UnblendedCost"
  | "AmortizedCost"
  | "NetUnblendedCost"
  | "NetAmortizedCost"
  | "UsageQuantity"
  | "NormalizedUsageAmount"
  | "Hours";
export const Metric = S.Literal(
  "BlendedCost",
  "UnblendedCost",
  "AmortizedCost",
  "NetUnblendedCost",
  "NetAmortizedCost",
  "UsageQuantity",
  "NormalizedUsageAmount",
  "Hours",
);
export type Metrics = Metric[];
export const Metrics = S.Array(Metric);
export type HealthStatusValue = "HEALTHY" | "UNHEALTHY";
export const HealthStatusValue = S.Literal("HEALTHY", "UNHEALTHY");
export type HealthStatusReason =
  | "BILLING_VIEW_NO_ACCESS"
  | "BILLING_VIEW_UNHEALTHY"
  | "FILTER_INVALID"
  | "MULTI_YEAR_HISTORICAL_DATA_DISABLED";
export const HealthStatusReason = S.Literal(
  "BILLING_VIEW_NO_ACCESS",
  "BILLING_VIEW_UNHEALTHY",
  "FILTER_INVALID",
  "MULTI_YEAR_HISTORICAL_DATA_DISABLED",
);
export interface HealthStatus {
  Status?: HealthStatusValue;
  StatusReason?: HealthStatusReason;
  LastUpdatedTime?: Date;
}
export const HealthStatus = S.suspend(() =>
  S.Struct({
    Status: S.optional(HealthStatusValue),
    StatusReason: S.optional(HealthStatusReason),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "HealthStatus" }) as any as S.Schema<HealthStatus>;
export interface Budget {
  BudgetName: string;
  BudgetLimit?: Spend;
  PlannedBudgetLimits?: { [key: string]: Spend };
  CostFilters?: { [key: string]: string[] };
  CostTypes?: CostTypes;
  TimeUnit: TimeUnit;
  TimePeriod?: TimePeriod;
  CalculatedSpend?: CalculatedSpend;
  BudgetType: BudgetType;
  LastUpdatedTime?: Date;
  AutoAdjustData?: AutoAdjustData;
  FilterExpression?: Expression;
  Metrics?: Metric[];
  BillingViewArn?: string;
  HealthStatus?: HealthStatus;
}
export const Budget = S.suspend(() =>
  S.Struct({
    BudgetName: S.String,
    BudgetLimit: S.optional(Spend),
    PlannedBudgetLimits: S.optional(PlannedBudgetLimits),
    CostFilters: S.optional(CostFilters),
    CostTypes: S.optional(CostTypes),
    TimeUnit: TimeUnit,
    TimePeriod: S.optional(TimePeriod),
    CalculatedSpend: S.optional(CalculatedSpend),
    BudgetType: BudgetType,
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AutoAdjustData: S.optional(AutoAdjustData),
    FilterExpression: S.optional(Expression),
    Metrics: S.optional(Metrics),
    BillingViewArn: S.optional(S.String),
    HealthStatus: S.optional(HealthStatus),
  }),
).annotations({ identifier: "Budget" }) as any as S.Schema<Budget>;
export interface UpdateBudgetRequest {
  AccountId: string;
  NewBudget: Budget;
}
export const UpdateBudgetRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String, NewBudget: Budget }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateBudgetRequest",
}) as any as S.Schema<UpdateBudgetRequest>;
export interface UpdateBudgetResponse {}
export const UpdateBudgetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateBudgetResponse",
}) as any as S.Schema<UpdateBudgetResponse>;
export interface ActionThreshold {
  ActionThresholdValue: number;
  ActionThresholdType: ThresholdType;
}
export const ActionThreshold = S.suspend(() =>
  S.Struct({
    ActionThresholdValue: S.Number,
    ActionThresholdType: ThresholdType,
  }),
).annotations({
  identifier: "ActionThreshold",
}) as any as S.Schema<ActionThreshold>;
export type Roles = string[];
export const Roles = S.Array(S.String);
export type Groups = string[];
export const Groups = S.Array(S.String);
export type Users = string[];
export const Users = S.Array(S.String);
export interface IamActionDefinition {
  PolicyArn: string;
  Roles?: string[];
  Groups?: string[];
  Users?: string[];
}
export const IamActionDefinition = S.suspend(() =>
  S.Struct({
    PolicyArn: S.String,
    Roles: S.optional(Roles),
    Groups: S.optional(Groups),
    Users: S.optional(Users),
  }),
).annotations({
  identifier: "IamActionDefinition",
}) as any as S.Schema<IamActionDefinition>;
export type TargetIds = string[];
export const TargetIds = S.Array(S.String);
export interface ScpActionDefinition {
  PolicyId: string;
  TargetIds: string[];
}
export const ScpActionDefinition = S.suspend(() =>
  S.Struct({ PolicyId: S.String, TargetIds: TargetIds }),
).annotations({
  identifier: "ScpActionDefinition",
}) as any as S.Schema<ScpActionDefinition>;
export type ActionSubType = "STOP_EC2_INSTANCES" | "STOP_RDS_INSTANCES";
export const ActionSubType = S.Literal(
  "STOP_EC2_INSTANCES",
  "STOP_RDS_INSTANCES",
);
export type InstanceIds = string[];
export const InstanceIds = S.Array(S.String);
export interface SsmActionDefinition {
  ActionSubType: ActionSubType;
  Region: string;
  InstanceIds: string[];
}
export const SsmActionDefinition = S.suspend(() =>
  S.Struct({
    ActionSubType: ActionSubType,
    Region: S.String,
    InstanceIds: InstanceIds,
  }),
).annotations({
  identifier: "SsmActionDefinition",
}) as any as S.Schema<SsmActionDefinition>;
export interface Definition {
  IamActionDefinition?: IamActionDefinition;
  ScpActionDefinition?: ScpActionDefinition;
  SsmActionDefinition?: SsmActionDefinition;
}
export const Definition = S.suspend(() =>
  S.Struct({
    IamActionDefinition: S.optional(IamActionDefinition),
    ScpActionDefinition: S.optional(ScpActionDefinition),
    SsmActionDefinition: S.optional(SsmActionDefinition),
  }),
).annotations({ identifier: "Definition" }) as any as S.Schema<Definition>;
export type Subscribers = Subscriber[];
export const Subscribers = S.Array(Subscriber);
export interface UpdateBudgetActionRequest {
  AccountId: string;
  BudgetName: string;
  ActionId: string;
  NotificationType?: NotificationType;
  ActionThreshold?: ActionThreshold;
  Definition?: Definition;
  ExecutionRoleArn?: string;
  ApprovalModel?: ApprovalModel;
  Subscribers?: Subscriber[];
}
export const UpdateBudgetActionRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    ActionId: S.String,
    NotificationType: S.optional(NotificationType),
    ActionThreshold: S.optional(ActionThreshold),
    Definition: S.optional(Definition),
    ExecutionRoleArn: S.optional(S.String),
    ApprovalModel: S.optional(ApprovalModel),
    Subscribers: S.optional(Subscribers),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateBudgetActionRequest",
}) as any as S.Schema<UpdateBudgetActionRequest>;
export interface UpdateNotificationRequest {
  AccountId: string;
  BudgetName: string;
  OldNotification: Notification;
  NewNotification: Notification;
}
export const UpdateNotificationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    OldNotification: Notification,
    NewNotification: Notification,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateNotificationRequest",
}) as any as S.Schema<UpdateNotificationRequest>;
export interface UpdateNotificationResponse {}
export const UpdateNotificationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateNotificationResponse",
}) as any as S.Schema<UpdateNotificationResponse>;
export interface UpdateSubscriberRequest {
  AccountId: string;
  BudgetName: string;
  Notification: Notification;
  OldSubscriber: Subscriber;
  NewSubscriber: Subscriber;
}
export const UpdateSubscriberRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    Notification: Notification,
    OldSubscriber: Subscriber,
    NewSubscriber: Subscriber,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSubscriberRequest",
}) as any as S.Schema<UpdateSubscriberRequest>;
export interface UpdateSubscriberResponse {}
export const UpdateSubscriberResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateSubscriberResponse",
}) as any as S.Schema<UpdateSubscriberResponse>;
export interface NotificationWithSubscribers {
  Notification: Notification;
  Subscribers: Subscriber[];
}
export const NotificationWithSubscribers = S.suspend(() =>
  S.Struct({ Notification: Notification, Subscribers: Subscribers }),
).annotations({
  identifier: "NotificationWithSubscribers",
}) as any as S.Schema<NotificationWithSubscribers>;
export type NotificationWithSubscribersList = NotificationWithSubscribers[];
export const NotificationWithSubscribersList = S.Array(
  NotificationWithSubscribers,
);
export type ActionStatus =
  | "STANDBY"
  | "PENDING"
  | "EXECUTION_IN_PROGRESS"
  | "EXECUTION_SUCCESS"
  | "EXECUTION_FAILURE"
  | "REVERSE_IN_PROGRESS"
  | "REVERSE_SUCCESS"
  | "REVERSE_FAILURE"
  | "RESET_IN_PROGRESS"
  | "RESET_FAILURE";
export const ActionStatus = S.Literal(
  "STANDBY",
  "PENDING",
  "EXECUTION_IN_PROGRESS",
  "EXECUTION_SUCCESS",
  "EXECUTION_FAILURE",
  "REVERSE_IN_PROGRESS",
  "REVERSE_SUCCESS",
  "REVERSE_FAILURE",
  "RESET_IN_PROGRESS",
  "RESET_FAILURE",
);
export interface Action {
  ActionId: string;
  BudgetName: string;
  NotificationType: NotificationType;
  ActionType: ActionType;
  ActionThreshold: ActionThreshold;
  Definition: Definition;
  ExecutionRoleArn: string;
  ApprovalModel: ApprovalModel;
  Status: ActionStatus;
  Subscribers: Subscriber[];
}
export const Action = S.suspend(() =>
  S.Struct({
    ActionId: S.String,
    BudgetName: S.String,
    NotificationType: NotificationType,
    ActionType: ActionType,
    ActionThreshold: ActionThreshold,
    Definition: Definition,
    ExecutionRoleArn: S.String,
    ApprovalModel: ApprovalModel,
    Status: ActionStatus,
    Subscribers: Subscribers,
  }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export type Actions = Action[];
export const Actions = S.Array(Action);
export type Budgets = Budget[];
export const Budgets = S.Array(Budget);
export type Notifications = Notification[];
export const Notifications = S.Array(Notification);
export type Expressions = Expression[];
export const Expressions = S.Array(
  S.suspend((): S.Schema<Expression, any> => Expression).annotations({
    identifier: "Expression",
  }),
) as any as S.Schema<Expressions>;
export interface CreateNotificationRequest {
  AccountId: string;
  BudgetName: string;
  Notification: Notification;
  Subscribers: Subscriber[];
}
export const CreateNotificationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    Notification: Notification,
    Subscribers: Subscribers,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateNotificationRequest",
}) as any as S.Schema<CreateNotificationRequest>;
export interface CreateNotificationResponse {}
export const CreateNotificationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateNotificationResponse",
}) as any as S.Schema<CreateNotificationResponse>;
export interface DescribeBudgetResponse {
  Budget?: Budget;
}
export const DescribeBudgetResponse = S.suspend(() =>
  S.Struct({ Budget: S.optional(Budget) }),
).annotations({
  identifier: "DescribeBudgetResponse",
}) as any as S.Schema<DescribeBudgetResponse>;
export interface DescribeBudgetActionResponse {
  AccountId: string;
  BudgetName: string;
  Action: Action;
}
export const DescribeBudgetActionResponse = S.suspend(() =>
  S.Struct({ AccountId: S.String, BudgetName: S.String, Action: Action }),
).annotations({
  identifier: "DescribeBudgetActionResponse",
}) as any as S.Schema<DescribeBudgetActionResponse>;
export interface DescribeBudgetActionHistoriesRequest {
  AccountId: string;
  BudgetName: string;
  ActionId: string;
  TimePeriod?: TimePeriod;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeBudgetActionHistoriesRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    ActionId: S.String,
    TimePeriod: S.optional(TimePeriod),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBudgetActionHistoriesRequest",
}) as any as S.Schema<DescribeBudgetActionHistoriesRequest>;
export interface DescribeBudgetActionsForAccountResponse {
  Actions: Action[];
  NextToken?: string;
}
export const DescribeBudgetActionsForAccountResponse = S.suspend(() =>
  S.Struct({ Actions: Actions, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeBudgetActionsForAccountResponse",
}) as any as S.Schema<DescribeBudgetActionsForAccountResponse>;
export interface DescribeBudgetActionsForBudgetResponse {
  Actions: Action[];
  NextToken?: string;
}
export const DescribeBudgetActionsForBudgetResponse = S.suspend(() =>
  S.Struct({ Actions: Actions, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeBudgetActionsForBudgetResponse",
}) as any as S.Schema<DescribeBudgetActionsForBudgetResponse>;
export interface DescribeBudgetsResponse {
  Budgets?: Budget[];
  NextToken?: string;
}
export const DescribeBudgetsResponse = S.suspend(() =>
  S.Struct({ Budgets: S.optional(Budgets), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeBudgetsResponse",
}) as any as S.Schema<DescribeBudgetsResponse>;
export interface DescribeNotificationsForBudgetResponse {
  Notifications?: Notification[];
  NextToken?: string;
}
export const DescribeNotificationsForBudgetResponse = S.suspend(() =>
  S.Struct({
    Notifications: S.optional(Notifications),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeNotificationsForBudgetResponse",
}) as any as S.Schema<DescribeNotificationsForBudgetResponse>;
export interface DescribeSubscribersForNotificationResponse {
  Subscribers?: Subscriber[];
  NextToken?: string;
}
export const DescribeSubscribersForNotificationResponse = S.suspend(() =>
  S.Struct({
    Subscribers: S.optional(Subscribers),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSubscribersForNotificationResponse",
}) as any as S.Schema<DescribeSubscribersForNotificationResponse>;
export interface ExecuteBudgetActionResponse {
  AccountId: string;
  BudgetName: string;
  ActionId: string;
  ExecutionType: ExecutionType;
}
export const ExecuteBudgetActionResponse = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    ActionId: S.String,
    ExecutionType: ExecutionType,
  }),
).annotations({
  identifier: "ExecuteBudgetActionResponse",
}) as any as S.Schema<ExecuteBudgetActionResponse>;
export interface ListTagsForResourceResponse {
  ResourceTags?: ResourceTag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ ResourceTags: S.optional(ResourceTagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateBudgetActionResponse {
  AccountId: string;
  BudgetName: string;
  OldAction: Action;
  NewAction: Action;
}
export const UpdateBudgetActionResponse = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    OldAction: Action,
    NewAction: Action,
  }),
).annotations({
  identifier: "UpdateBudgetActionResponse",
}) as any as S.Schema<UpdateBudgetActionResponse>;
export interface BudgetNotificationsForAccount {
  Notifications?: Notification[];
  BudgetName?: string;
}
export const BudgetNotificationsForAccount = S.suspend(() =>
  S.Struct({
    Notifications: S.optional(Notifications),
    BudgetName: S.optional(S.String),
  }),
).annotations({
  identifier: "BudgetNotificationsForAccount",
}) as any as S.Schema<BudgetNotificationsForAccount>;
export type BudgetNotificationsForAccountList = BudgetNotificationsForAccount[];
export const BudgetNotificationsForAccountList = S.Array(
  BudgetNotificationsForAccount,
);
export interface CreateBudgetActionRequest {
  AccountId: string;
  BudgetName: string;
  NotificationType: NotificationType;
  ActionType: ActionType;
  ActionThreshold: ActionThreshold;
  Definition: Definition;
  ExecutionRoleArn: string;
  ApprovalModel: ApprovalModel;
  Subscribers: Subscriber[];
  ResourceTags?: ResourceTag[];
}
export const CreateBudgetActionRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    BudgetName: S.String,
    NotificationType: NotificationType,
    ActionType: ActionType,
    ActionThreshold: ActionThreshold,
    Definition: Definition,
    ExecutionRoleArn: S.String,
    ApprovalModel: ApprovalModel,
    Subscribers: Subscribers,
    ResourceTags: S.optional(ResourceTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateBudgetActionRequest",
}) as any as S.Schema<CreateBudgetActionRequest>;
export interface DeleteBudgetActionResponse {
  AccountId: string;
  BudgetName: string;
  Action: Action;
}
export const DeleteBudgetActionResponse = S.suspend(() =>
  S.Struct({ AccountId: S.String, BudgetName: S.String, Action: Action }),
).annotations({
  identifier: "DeleteBudgetActionResponse",
}) as any as S.Schema<DeleteBudgetActionResponse>;
export interface DescribeBudgetNotificationsForAccountResponse {
  BudgetNotificationsForAccount?: BudgetNotificationsForAccount[];
  NextToken?: string;
}
export const DescribeBudgetNotificationsForAccountResponse = S.suspend(() =>
  S.Struct({
    BudgetNotificationsForAccount: S.optional(
      BudgetNotificationsForAccountList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeBudgetNotificationsForAccountResponse",
}) as any as S.Schema<DescribeBudgetNotificationsForAccountResponse>;
export type EventType =
  | "SYSTEM"
  | "CREATE_ACTION"
  | "DELETE_ACTION"
  | "UPDATE_ACTION"
  | "EXECUTE_ACTION";
export const EventType = S.Literal(
  "SYSTEM",
  "CREATE_ACTION",
  "DELETE_ACTION",
  "UPDATE_ACTION",
  "EXECUTE_ACTION",
);
export interface BudgetedAndActualAmounts {
  BudgetedAmount?: Spend;
  ActualAmount?: Spend;
  TimePeriod?: TimePeriod;
}
export const BudgetedAndActualAmounts = S.suspend(() =>
  S.Struct({
    BudgetedAmount: S.optional(Spend),
    ActualAmount: S.optional(Spend),
    TimePeriod: S.optional(TimePeriod),
  }),
).annotations({
  identifier: "BudgetedAndActualAmounts",
}) as any as S.Schema<BudgetedAndActualAmounts>;
export type BudgetedAndActualAmountsList = BudgetedAndActualAmounts[];
export const BudgetedAndActualAmountsList = S.Array(BudgetedAndActualAmounts);
export interface BudgetPerformanceHistory {
  BudgetName?: string;
  BudgetType?: BudgetType;
  CostFilters?: { [key: string]: string[] };
  CostTypes?: CostTypes;
  TimeUnit?: TimeUnit;
  BillingViewArn?: string;
  BudgetedAndActualAmountsList?: BudgetedAndActualAmounts[];
}
export const BudgetPerformanceHistory = S.suspend(() =>
  S.Struct({
    BudgetName: S.optional(S.String),
    BudgetType: S.optional(BudgetType),
    CostFilters: S.optional(CostFilters),
    CostTypes: S.optional(CostTypes),
    TimeUnit: S.optional(TimeUnit),
    BillingViewArn: S.optional(S.String),
    BudgetedAndActualAmountsList: S.optional(BudgetedAndActualAmountsList),
  }),
).annotations({
  identifier: "BudgetPerformanceHistory",
}) as any as S.Schema<BudgetPerformanceHistory>;
export interface CreateBudgetRequest {
  AccountId: string;
  Budget: Budget;
  NotificationsWithSubscribers?: NotificationWithSubscribers[];
  ResourceTags?: ResourceTag[];
}
export const CreateBudgetRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String,
    Budget: Budget,
    NotificationsWithSubscribers: S.optional(NotificationWithSubscribersList),
    ResourceTags: S.optional(ResourceTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateBudgetRequest",
}) as any as S.Schema<CreateBudgetRequest>;
export interface CreateBudgetResponse {}
export const CreateBudgetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateBudgetResponse",
}) as any as S.Schema<CreateBudgetResponse>;
export interface CreateBudgetActionResponse {
  AccountId: string;
  BudgetName: string;
  ActionId: string;
}
export const CreateBudgetActionResponse = S.suspend(() =>
  S.Struct({ AccountId: S.String, BudgetName: S.String, ActionId: S.String }),
).annotations({
  identifier: "CreateBudgetActionResponse",
}) as any as S.Schema<CreateBudgetActionResponse>;
export interface DescribeBudgetPerformanceHistoryResponse {
  BudgetPerformanceHistory?: BudgetPerformanceHistory;
  NextToken?: string;
}
export const DescribeBudgetPerformanceHistoryResponse = S.suspend(() =>
  S.Struct({
    BudgetPerformanceHistory: S.optional(BudgetPerformanceHistory),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeBudgetPerformanceHistoryResponse",
}) as any as S.Schema<DescribeBudgetPerformanceHistoryResponse>;
export interface ActionHistoryDetails {
  Message: string;
  Action: Action;
}
export const ActionHistoryDetails = S.suspend(() =>
  S.Struct({ Message: S.String, Action: Action }),
).annotations({
  identifier: "ActionHistoryDetails",
}) as any as S.Schema<ActionHistoryDetails>;
export interface ActionHistory {
  Timestamp: Date;
  Status: ActionStatus;
  EventType: EventType;
  ActionHistoryDetails: ActionHistoryDetails;
}
export const ActionHistory = S.suspend(() =>
  S.Struct({
    Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: ActionStatus,
    EventType: EventType,
    ActionHistoryDetails: ActionHistoryDetails,
  }),
).annotations({
  identifier: "ActionHistory",
}) as any as S.Schema<ActionHistory>;
export type ActionHistories = ActionHistory[];
export const ActionHistories = S.Array(ActionHistory);
export interface DescribeBudgetActionHistoriesResponse {
  ActionHistories: ActionHistory[];
  NextToken?: string;
}
export const DescribeBudgetActionHistoriesResponse = S.suspend(() =>
  S.Struct({
    ActionHistories: ActionHistories,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeBudgetActionHistoriesResponse",
}) as any as S.Schema<DescribeBudgetActionHistoriesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class CreationLimitExceededException extends S.TaggedError<CreationLimitExceededException>()(
  "CreationLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ExpiredNextTokenException extends S.TaggedError<ExpiredNextTokenException>()(
  "ExpiredNextTokenException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class BillingViewHealthStatusException extends S.TaggedError<BillingViewHealthStatusException>()(
  "BillingViewHealthStatusException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DuplicateRecordException extends S.TaggedError<DuplicateRecordException>()(
  "DuplicateRecordException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ResourceLockedException extends S.TaggedError<ResourceLockedException>()(
  "ResourceLockedException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Describes all of the budget actions for an account.
 */
export const describeBudgetActionsForAccount: {
  (
    input: DescribeBudgetActionsForAccountRequest,
  ): effect.Effect<
    DescribeBudgetActionsForAccountResponse,
    | AccessDeniedException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeBudgetActionsForAccountRequest,
  ) => stream.Stream<
    DescribeBudgetActionsForAccountResponse,
    | AccessDeniedException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeBudgetActionsForAccountRequest,
  ) => stream.Stream<
    Action,
    | AccessDeniedException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeBudget: (
  input: DescribeBudgetRequest,
) => effect.Effect<
  DescribeBudgetResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeBudgetActionHistories: {
  (
    input: DescribeBudgetActionHistoriesRequest,
  ): effect.Effect<
    DescribeBudgetActionHistoriesResponse,
    | AccessDeniedException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeBudgetActionHistoriesRequest,
  ) => stream.Stream<
    DescribeBudgetActionHistoriesResponse,
    | AccessDeniedException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeBudgetActionHistoriesRequest,
  ) => stream.Stream<
    ActionHistory,
    | AccessDeniedException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeBudgets: {
  (
    input: DescribeBudgetsRequest,
  ): effect.Effect<
    DescribeBudgetsResponse,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeBudgetsRequest,
  ) => stream.Stream<
    DescribeBudgetsResponse,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeBudgetsRequest,
  ) => stream.Stream<
    Budget,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Updates a notification.
 */
export const updateNotification: (
  input: UpdateNotificationRequest,
) => effect.Effect<
  UpdateNotificationResponse,
  | AccessDeniedException
  | DuplicateRecordException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createNotification: (
  input: CreateNotificationRequest,
) => effect.Effect<
  CreateNotificationResponse,
  | AccessDeniedException
  | CreationLimitExceededException
  | DuplicateRecordException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeBudgetAction: (
  input: DescribeBudgetActionRequest,
) => effect.Effect<
  DescribeBudgetActionResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBudgetActionRequest,
  output: DescribeBudgetActionResponse,
  errors: [
    AccessDeniedException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists tags associated with a budget or budget action resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBudget: (
  input: DeleteBudgetRequest,
) => effect.Effect<
  DeleteBudgetResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteNotification: (
  input: DeleteNotificationRequest,
) => effect.Effect<
  DeleteNotificationResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSubscriber: (
  input: DeleteSubscriberRequest,
) => effect.Effect<
  DeleteSubscriberResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSubscriber: (
  input: UpdateSubscriberRequest,
) => effect.Effect<
  UpdateSubscriberResponse,
  | AccessDeniedException
  | DuplicateRecordException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSubscriber: (
  input: CreateSubscriberRequest,
) => effect.Effect<
  CreateSubscriberResponse,
  | AccessDeniedException
  | CreationLimitExceededException
  | DuplicateRecordException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeBudgetActionsForBudget: {
  (
    input: DescribeBudgetActionsForBudgetRequest,
  ): effect.Effect<
    DescribeBudgetActionsForBudgetResponse,
    | AccessDeniedException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeBudgetActionsForBudgetRequest,
  ) => stream.Stream<
    DescribeBudgetActionsForBudgetResponse,
    | AccessDeniedException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeBudgetActionsForBudgetRequest,
  ) => stream.Stream<
    Action,
    | AccessDeniedException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeNotificationsForBudget: {
  (
    input: DescribeNotificationsForBudgetRequest,
  ): effect.Effect<
    DescribeNotificationsForBudgetResponse,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeNotificationsForBudgetRequest,
  ) => stream.Stream<
    DescribeNotificationsForBudgetResponse,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeNotificationsForBudgetRequest,
  ) => stream.Stream<
    Notification,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeSubscribersForNotification: {
  (
    input: DescribeSubscribersForNotificationRequest,
  ): effect.Effect<
    DescribeSubscribersForNotificationResponse,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSubscribersForNotificationRequest,
  ) => stream.Stream<
    DescribeSubscribersForNotificationResponse,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSubscribersForNotificationRequest,
  ) => stream.Stream<
    Subscriber,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeBudgetNotificationsForAccount: {
  (
    input: DescribeBudgetNotificationsForAccountRequest,
  ): effect.Effect<
    DescribeBudgetNotificationsForAccountResponse,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeBudgetNotificationsForAccountRequest,
  ) => stream.Stream<
    DescribeBudgetNotificationsForAccountResponse,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeBudgetNotificationsForAccountRequest,
  ) => stream.Stream<
    BudgetNotificationsForAccount,
    | AccessDeniedException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeBudgetPerformanceHistory: {
  (
    input: DescribeBudgetPerformanceHistoryRequest,
  ): effect.Effect<
    DescribeBudgetPerformanceHistoryResponse,
    | AccessDeniedException
    | BillingViewHealthStatusException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeBudgetPerformanceHistoryRequest,
  ) => stream.Stream<
    DescribeBudgetPerformanceHistoryResponse,
    | AccessDeniedException
    | BillingViewHealthStatusException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeBudgetPerformanceHistoryRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | BillingViewHealthStatusException
    | ExpiredNextTokenException
    | InternalErrorException
    | InvalidNextTokenException
    | InvalidParameterException
    | NotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateBudget: (
  input: UpdateBudgetRequest,
) => effect.Effect<
  UpdateBudgetResponse,
  | AccessDeniedException
  | BillingViewHealthStatusException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const executeBudgetAction: (
  input: ExecuteBudgetActionRequest,
) => effect.Effect<
  ExecuteBudgetActionResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ResourceLockedException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBudget: (
  input: CreateBudgetRequest,
) => effect.Effect<
  CreateBudgetResponse,
  | AccessDeniedException
  | BillingViewHealthStatusException
  | CreationLimitExceededException
  | DuplicateRecordException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBudgetAction: (
  input: CreateBudgetActionRequest,
) => effect.Effect<
  CreateBudgetActionResponse,
  | AccessDeniedException
  | CreationLimitExceededException
  | DuplicateRecordException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBudgetAction: (
  input: UpdateBudgetActionRequest,
) => effect.Effect<
  UpdateBudgetActionResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ResourceLockedException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBudgetAction: (
  input: DeleteBudgetActionRequest,
) => effect.Effect<
  DeleteBudgetActionResponse,
  | AccessDeniedException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ResourceLockedException
  | ThrottlingException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
