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
  sdkId: "BCM Recommended Actions",
  serviceShapeName: "AWSBillingAndCostManagementRecommendedActions",
});
const auth = T.AwsAuthSigv4({ name: "bcm-recommended-actions" });
const ver = T.ServiceVersion("2024-11-14");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { UseFIPS = false, Endpoint, Region } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = (_0: unknown) => ({
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true) {
          return e(
            `https://bcm-recommended-actions-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            _p0(PartitionResult),
            {},
          );
        }
        return e(
          `https://bcm-recommended-actions.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          _p0(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type MaxResults = number;
export type NextToken = string;
export type FilterValue = string;
export type AccountId = string;
export type NextStep = string;

//# Schemas
export type FilterName = "FEATURE" | "SEVERITY" | "TYPE" | (string & {});
export const FilterName = S.String;
export type MatchOption = "EQUALS" | "NOT_EQUALS" | (string & {});
export const MatchOption = S.String;
export type FilterValues = string[];
export const FilterValues = S.Array(S.String);
export interface ActionFilter {
  key: FilterName;
  matchOption: MatchOption;
  values: string[];
}
export const ActionFilter = S.suspend(() =>
  S.Struct({ key: FilterName, matchOption: MatchOption, values: FilterValues }),
).annotations({ identifier: "ActionFilter" }) as any as S.Schema<ActionFilter>;
export type ActionFilterList = ActionFilter[];
export const ActionFilterList = S.Array(ActionFilter);
export interface RequestFilter {
  actions?: ActionFilter[];
}
export const RequestFilter = S.suspend(() =>
  S.Struct({ actions: S.optional(ActionFilterList) }),
).annotations({
  identifier: "RequestFilter",
}) as any as S.Schema<RequestFilter>;
export interface ListRecommendedActionsRequest {
  filter?: RequestFilter;
  maxResults?: number;
  nextToken?: string;
}
export const ListRecommendedActionsRequest = S.suspend(() =>
  S.Struct({
    filter: S.optional(RequestFilter),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRecommendedActionsRequest",
}) as any as S.Schema<ListRecommendedActionsRequest>;
export type ActionType =
  | "ADD_ALTERNATE_BILLING_CONTACT"
  | "CREATE_ANOMALY_MONITOR"
  | "CREATE_BUDGET"
  | "ENABLE_COST_OPTIMIZATION_HUB"
  | "MIGRATE_TO_GRANULAR_PERMISSIONS"
  | "PAYMENTS_DUE"
  | "PAYMENTS_PAST_DUE"
  | "REVIEW_ANOMALIES"
  | "REVIEW_BUDGET_ALERTS"
  | "REVIEW_BUDGETS_EXCEEDED"
  | "REVIEW_EXPIRING_RI"
  | "REVIEW_EXPIRING_SP"
  | "REVIEW_FREETIER_USAGE_ALERTS"
  | "REVIEW_FREETIER_CREDITS_REMAINING"
  | "REVIEW_FREETIER_DAYS_REMAINING"
  | "REVIEW_SAVINGS_OPPORTUNITY_RECOMMENDATIONS"
  | "UPDATE_EXPIRED_PAYMENT_METHOD"
  | "UPDATE_INVALID_PAYMENT_METHOD"
  | "UPDATE_TAX_EXEMPTION_CERTIFICATE"
  | "UPDATE_TAX_REGISTRATION_NUMBER"
  | (string & {});
export const ActionType = S.String;
export type Severity = "INFO" | "WARNING" | "CRITICAL" | (string & {});
export const Severity = S.String;
export type Feature =
  | "ACCOUNT"
  | "BUDGETS"
  | "COST_ANOMALY_DETECTION"
  | "COST_OPTIMIZATION_HUB"
  | "FREE_TIER"
  | "IAM"
  | "PAYMENTS"
  | "RESERVATIONS"
  | "SAVINGS_PLANS"
  | "TAX_SETTINGS"
  | (string & {});
export const Feature = S.String;
export type NextSteps = string[];
export const NextSteps = S.Array(S.String);
export type Context = { [key: string]: string | undefined };
export const Context = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface RecommendedAction {
  id?: string;
  type?: ActionType;
  accountId?: string;
  severity?: Severity;
  feature?: Feature;
  context?: { [key: string]: string | undefined };
  nextSteps?: string[];
  lastUpdatedTimeStamp?: string;
}
export const RecommendedAction = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    type: S.optional(ActionType),
    accountId: S.optional(S.String),
    severity: S.optional(Severity),
    feature: S.optional(Feature),
    context: S.optional(Context),
    nextSteps: S.optional(NextSteps),
    lastUpdatedTimeStamp: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommendedAction",
}) as any as S.Schema<RecommendedAction>;
export type RecommendedActions = RecommendedAction[];
export const RecommendedActions = S.Array(RecommendedAction);
export interface ListRecommendedActionsResponse {
  recommendedActions: RecommendedAction[];
  nextToken?: string;
}
export const ListRecommendedActionsResponse = S.suspend(() =>
  S.Struct({
    recommendedActions: RecommendedActions,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommendedActionsResponse",
}) as any as S.Schema<ListRecommendedActionsResponse>;
export type ValidationExceptionReason =
  | "unknownOperation"
  | "cannotParse"
  | "fieldValidationFailed"
  | "other"
  | (string & {});
export const ValidationExceptionReason = S.String;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
  T.AwsQueryError({
    code: "BCMRecommendedActionsAccessDenied",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.AwsQueryError({
    code: "BCMRecommendedActionsInternalServer",
    httpResponseCode: 500,
  }),
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.AwsQueryError({
    code: "BCMRecommendedActionsThrottling",
    httpResponseCode: 429,
  }),
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: ValidationExceptionReason,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
  T.AwsQueryError({
    code: "BCMRecommendedActionsValidation",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of recommended actions that match the filter criteria.
 */
export const listRecommendedActions: {
  (
    input: ListRecommendedActionsRequest,
  ): effect.Effect<
    ListRecommendedActionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendedActionsRequest,
  ) => stream.Stream<
    ListRecommendedActionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendedActionsRequest,
  ) => stream.Stream<
    RecommendedAction,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecommendedActionsRequest,
  output: ListRecommendedActionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "recommendedActions",
    pageSize: "maxResults",
  } as const,
}));
