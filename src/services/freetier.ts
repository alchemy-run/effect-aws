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
  sdkId: "FreeTier",
  serviceShapeName: "AWSFreeTierService",
});
const auth = T.AwsAuthSigv4({ name: "freetier" });
const ver = T.ServiceVersion("2023-09-07");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = () => ({
    authSchemes: [
      {
        name: "sigv4",
        signingName: "freetier",
        signingRegion: "cn-northwest-1",
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
        if (_.getAttr(PartitionResult, "name") === "aws") {
          if (UseFIPS === true) {
            if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
              return e(`https://freetier-fips.${Region}.api.aws`);
            }
            return err(
              "FIPS is enabled but this partition does not support FIPS",
            );
          }
          return e(
            "https://freetier.us-east-1.api.aws",
            {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "freetier",
                  signingRegion: "us-east-1",
                },
              ],
            },
            {},
          );
        }
        if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
          if (UseFIPS === true) {
            if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
              return e(
                `https://freetier-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              );
            }
            return err(
              "FIPS is enabled but this partition does not support FIPS",
            );
          }
          if (Region === "aws-cn-global") {
            return e(
              "https://freetier.cn-northwest-1.api.amazonwebservices.com.cn",
              _p0(),
              {},
            );
          }
          return e(
            `https://freetier.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://freetier-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (Region === "aws-cn-global") {
          return e(
            "https://freetier.cn-northwest-1.api.amazonwebservices.com.cn",
            _p0(),
            {},
          );
        }
        return e(
          `https://freetier.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ActivityId = string;
export type AccountId = string;
export type MaxResults = number;
export type NextPageToken = string;
export type Value = string;

//# Schemas
export interface GetAccountPlanStateRequest {}
export const GetAccountPlanStateRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAccountPlanStateRequest",
}) as any as S.Schema<GetAccountPlanStateRequest>;
export type LanguageCode =
  | "en-US"
  | "en-GB"
  | "id-ID"
  | "de-DE"
  | "es-ES"
  | "fr-FR"
  | "ja-JP"
  | "it-IT"
  | "pt-PT"
  | "ko-KR"
  | "zh-CN"
  | "zh-TW"
  | "tr-TR"
  | (string & {});
export const LanguageCode = S.String;
export type AccountPlanType = "FREE" | "PAID" | (string & {});
export const AccountPlanType = S.String;
export type AccountPlanStatus =
  | "NOT_STARTED"
  | "ACTIVE"
  | "EXPIRED"
  | (string & {});
export const AccountPlanStatus = S.String;
export type ActivityStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "EXPIRING"
  | (string & {});
export const ActivityStatus = S.String;
export type FilterActivityStatuses = ActivityStatus[];
export const FilterActivityStatuses = S.Array(ActivityStatus);
export interface GetAccountActivityRequest {
  activityId: string;
  languageCode?: LanguageCode;
}
export const GetAccountActivityRequest = S.suspend(() =>
  S.Struct({
    activityId: S.String,
    languageCode: S.optional(LanguageCode),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAccountActivityRequest",
}) as any as S.Schema<GetAccountActivityRequest>;
export interface ListAccountActivitiesRequest {
  filterActivityStatuses?: ActivityStatus[];
  nextToken?: string;
  maxResults?: number;
  languageCode?: LanguageCode;
}
export const ListAccountActivitiesRequest = S.suspend(() =>
  S.Struct({
    filterActivityStatuses: S.optional(FilterActivityStatuses),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    languageCode: S.optional(LanguageCode),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAccountActivitiesRequest",
}) as any as S.Schema<ListAccountActivitiesRequest>;
export interface UpgradeAccountPlanRequest {
  accountPlanType: AccountPlanType;
}
export const UpgradeAccountPlanRequest = S.suspend(() =>
  S.Struct({ accountPlanType: AccountPlanType }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpgradeAccountPlanRequest",
}) as any as S.Schema<UpgradeAccountPlanRequest>;
export type CurrencyCode = "USD" | (string & {});
export const CurrencyCode = S.String;
export type Expressions = Expression[];
export const Expressions = S.Array(
  S.suspend((): S.Schema<Expression, any> => Expression).annotations({
    identifier: "Expression",
  }),
) as any as S.Schema<Expressions>;
export interface MonetaryAmount {
  amount: number;
  unit: CurrencyCode;
}
export const MonetaryAmount = S.suspend(() =>
  S.Struct({ amount: S.Number, unit: CurrencyCode }),
).annotations({
  identifier: "MonetaryAmount",
}) as any as S.Schema<MonetaryAmount>;
export type Dimension =
  | "SERVICE"
  | "OPERATION"
  | "USAGE_TYPE"
  | "REGION"
  | "FREE_TIER_TYPE"
  | "DESCRIPTION"
  | "USAGE_PERCENTAGE"
  | (string & {});
export const Dimension = S.String;
export type Values = string[];
export const Values = S.Array(S.String);
export type MatchOption =
  | "EQUALS"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "CONTAINS"
  | "GREATER_THAN_OR_EQUAL"
  | (string & {});
export const MatchOption = S.String;
export type MatchOptions = MatchOption[];
export const MatchOptions = S.Array(MatchOption);
export interface GetAccountPlanStateResponse {
  accountId: string;
  accountPlanType: AccountPlanType;
  accountPlanStatus: AccountPlanStatus;
  accountPlanRemainingCredits?: MonetaryAmount;
  accountPlanExpirationDate?: Date;
}
export const GetAccountPlanStateResponse = S.suspend(() =>
  S.Struct({
    accountId: S.String,
    accountPlanType: AccountPlanType,
    accountPlanStatus: AccountPlanStatus,
    accountPlanRemainingCredits: S.optional(MonetaryAmount),
    accountPlanExpirationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "GetAccountPlanStateResponse",
}) as any as S.Schema<GetAccountPlanStateResponse>;
export interface UpgradeAccountPlanResponse {
  accountId: string;
  accountPlanType: AccountPlanType;
  accountPlanStatus: AccountPlanStatus;
}
export const UpgradeAccountPlanResponse = S.suspend(() =>
  S.Struct({
    accountId: S.String,
    accountPlanType: AccountPlanType,
    accountPlanStatus: AccountPlanStatus,
  }),
).annotations({
  identifier: "UpgradeAccountPlanResponse",
}) as any as S.Schema<UpgradeAccountPlanResponse>;
export interface DimensionValues {
  Key: Dimension;
  Values: string[];
  MatchOptions: MatchOption[];
}
export const DimensionValues = S.suspend(() =>
  S.Struct({ Key: Dimension, Values: Values, MatchOptions: MatchOptions }),
).annotations({
  identifier: "DimensionValues",
}) as any as S.Schema<DimensionValues>;
export type ActivityReward = { credit: MonetaryAmount };
export const ActivityReward = S.Union(S.Struct({ credit: MonetaryAmount }));
export interface Expression {
  Or?: Expression[];
  And?: Expression[];
  Not?: Expression;
  Dimensions?: DimensionValues;
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
    Dimensions: S.optional(DimensionValues),
  }),
).annotations({ identifier: "Expression" }) as any as S.Schema<Expression>;
export interface ActivitySummary {
  activityId: string;
  title: string;
  reward: ActivityReward;
  status: ActivityStatus;
}
export const ActivitySummary = S.suspend(() =>
  S.Struct({
    activityId: S.String,
    title: S.String,
    reward: ActivityReward,
    status: ActivityStatus,
  }),
).annotations({
  identifier: "ActivitySummary",
}) as any as S.Schema<ActivitySummary>;
export type Activities = ActivitySummary[];
export const Activities = S.Array(ActivitySummary);
export interface GetAccountActivityResponse {
  activityId: string;
  title: string;
  description: string;
  status: ActivityStatus;
  instructionsUrl: string;
  reward: ActivityReward;
  estimatedTimeToCompleteInMinutes?: number;
  expiresAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}
export const GetAccountActivityResponse = S.suspend(() =>
  S.Struct({
    activityId: S.String,
    title: S.String,
    description: S.String,
    status: ActivityStatus,
    instructionsUrl: S.String,
    reward: ActivityReward,
    estimatedTimeToCompleteInMinutes: S.optional(S.Number),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    completedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetAccountActivityResponse",
}) as any as S.Schema<GetAccountActivityResponse>;
export interface GetFreeTierUsageRequest {
  filter?: Expression;
  maxResults?: number;
  nextToken?: string;
}
export const GetFreeTierUsageRequest = S.suspend(() =>
  S.Struct({
    filter: S.optional(Expression),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetFreeTierUsageRequest",
}) as any as S.Schema<GetFreeTierUsageRequest>;
export interface ListAccountActivitiesResponse {
  activities: ActivitySummary[];
  nextToken?: string;
}
export const ListAccountActivitiesResponse = S.suspend(() =>
  S.Struct({ activities: Activities, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAccountActivitiesResponse",
}) as any as S.Schema<ListAccountActivitiesResponse>;
export interface FreeTierUsage {
  service?: string;
  operation?: string;
  usageType?: string;
  region?: string;
  actualUsageAmount?: number;
  forecastedUsageAmount?: number;
  limit?: number;
  unit?: string;
  description?: string;
  freeTierType?: string;
}
export const FreeTierUsage = S.suspend(() =>
  S.Struct({
    service: S.optional(S.String),
    operation: S.optional(S.String),
    usageType: S.optional(S.String),
    region: S.optional(S.String),
    actualUsageAmount: S.optional(S.Number),
    forecastedUsageAmount: S.optional(S.Number),
    limit: S.optional(S.Number),
    unit: S.optional(S.String),
    description: S.optional(S.String),
    freeTierType: S.optional(S.String),
  }),
).annotations({
  identifier: "FreeTierUsage",
}) as any as S.Schema<FreeTierUsage>;
export type FreeTierUsages = FreeTierUsage[];
export const FreeTierUsages = S.Array(FreeTierUsage);
export interface GetFreeTierUsageResponse {
  freeTierUsages: FreeTierUsage[];
  nextToken?: string;
}
export const GetFreeTierUsageResponse = S.suspend(() =>
  S.Struct({ freeTierUsages: FreeTierUsages, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "GetFreeTierUsageResponse",
}) as any as S.Schema<GetFreeTierUsageResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of activities that are available. This operation supports pagination and filtering by status.
 */
export const listAccountActivities: {
  (
    input: ListAccountActivitiesRequest,
  ): effect.Effect<
    ListAccountActivitiesResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountActivitiesRequest,
  ) => stream.Stream<
    ListAccountActivitiesResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountActivitiesRequest,
  ) => stream.Stream<
    ActivitySummary,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountActivitiesRequest,
  output: ListAccountActivitiesResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "activities",
    pageSize: "maxResults",
  } as const,
}));
/**
 * This returns all of the information related to the state of the account plan related to Free Tier.
 */
export const getAccountPlanState: (
  input: GetAccountPlanStateRequest,
) => effect.Effect<
  GetAccountPlanStateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountPlanStateRequest,
  output: GetAccountPlanStateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The account plan type for the Amazon Web Services account.
 */
export const upgradeAccountPlan: (
  input: UpgradeAccountPlanRequest,
) => effect.Effect<
  UpgradeAccountPlanResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpgradeAccountPlanRequest,
  output: UpgradeAccountPlanResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a specific activity record that is available to the customer.
 */
export const getAccountActivity: (
  input: GetAccountActivityRequest,
) => effect.Effect<
  GetAccountActivityResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountActivityRequest,
  output: GetAccountActivityResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all Free Tier usage objects that match your filters.
 */
export const getFreeTierUsage: {
  (
    input: GetFreeTierUsageRequest,
  ): effect.Effect<
    GetFreeTierUsageResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetFreeTierUsageRequest,
  ) => stream.Stream<
    GetFreeTierUsageResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetFreeTierUsageRequest,
  ) => stream.Stream<
    FreeTierUsage,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetFreeTierUsageRequest,
  output: GetFreeTierUsageResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "freeTierUsages",
    pageSize: "maxResults",
  } as const,
}));
