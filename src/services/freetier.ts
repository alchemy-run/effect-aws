import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
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
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
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
              ],
              rules: [
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
                          endpoint: {
                            url: "https://freetier-fips.{Region}.api.aws",
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
                  conditions: [],
                  endpoint: {
                    url: "https://freetier.us-east-1.api.aws",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingName: "freetier",
                          signingRegion: "us-east-1",
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
              conditions: [
                {
                  fn: "booleanEquals",
                  argv: [
                    true,
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "supportsDualStack"],
                    },
                  ],
                },
              ],
              rules: [
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
                          endpoint: {
                            url: "https://freetier-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    {
                      fn: "stringEquals",
                      argv: [{ ref: "Region" }, "aws-cn-global"],
                    },
                  ],
                  endpoint: {
                    url: "https://freetier.cn-northwest-1.api.amazonwebservices.com.cn",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingName: "freetier",
                          signingRegion: "cn-northwest-1",
                        },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://freetier.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
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
                        url: "https://freetier-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                {
                  fn: "stringEquals",
                  argv: [{ ref: "Region" }, "aws-cn-global"],
                },
              ],
              endpoint: {
                url: "https://freetier.cn-northwest-1.api.amazonwebservices.com.cn",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "freetier",
                      signingRegion: "cn-northwest-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://freetier.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type ActivityId = string;
export type AccountId = string;
export type MaxResults = number;
export type NextPageToken = string;
export type GenericDouble = number;
export type GenericString = string;
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
export type FilterActivityStatuses = string[];
export const FilterActivityStatuses = S.Array(S.String);
export interface GetAccountActivityRequest {
  activityId: string;
  languageCode?: string;
}
export const GetAccountActivityRequest = S.suspend(() =>
  S.Struct({ activityId: S.String, languageCode: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAccountActivityRequest",
}) as any as S.Schema<GetAccountActivityRequest>;
export interface ListAccountActivitiesRequest {
  filterActivityStatuses?: FilterActivityStatuses;
  nextToken?: string;
  maxResults?: number;
  languageCode?: string;
}
export const ListAccountActivitiesRequest = S.suspend(() =>
  S.Struct({
    filterActivityStatuses: S.optional(FilterActivityStatuses),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    languageCode: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAccountActivitiesRequest",
}) as any as S.Schema<ListAccountActivitiesRequest>;
export interface UpgradeAccountPlanRequest {
  accountPlanType: string;
}
export const UpgradeAccountPlanRequest = S.suspend(() =>
  S.Struct({ accountPlanType: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpgradeAccountPlanRequest",
}) as any as S.Schema<UpgradeAccountPlanRequest>;
export type Expressions = Expression[];
export const Expressions = S.Array(
  S.suspend((): S.Schema<Expression, any> => Expression).annotations({
    identifier: "Expression",
  }),
) as any as S.Schema<Expressions>;
export interface MonetaryAmount {
  amount: number;
  unit: string;
}
export const MonetaryAmount = S.suspend(() =>
  S.Struct({ amount: S.Number, unit: S.String }),
).annotations({
  identifier: "MonetaryAmount",
}) as any as S.Schema<MonetaryAmount>;
export type Values = string[];
export const Values = S.Array(S.String);
export type MatchOptions = string[];
export const MatchOptions = S.Array(S.String);
export interface GetAccountPlanStateResponse {
  accountId: string;
  accountPlanType: string;
  accountPlanStatus: string;
  accountPlanRemainingCredits?: MonetaryAmount;
  accountPlanExpirationDate?: Date;
}
export const GetAccountPlanStateResponse = S.suspend(() =>
  S.Struct({
    accountId: S.String,
    accountPlanType: S.String,
    accountPlanStatus: S.String,
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
  accountPlanType: string;
  accountPlanStatus: string;
}
export const UpgradeAccountPlanResponse = S.suspend(() =>
  S.Struct({
    accountId: S.String,
    accountPlanType: S.String,
    accountPlanStatus: S.String,
  }),
).annotations({
  identifier: "UpgradeAccountPlanResponse",
}) as any as S.Schema<UpgradeAccountPlanResponse>;
export interface DimensionValues {
  Key: string;
  Values: Values;
  MatchOptions: MatchOptions;
}
export const DimensionValues = S.suspend(() =>
  S.Struct({ Key: S.String, Values: Values, MatchOptions: MatchOptions }),
).annotations({
  identifier: "DimensionValues",
}) as any as S.Schema<DimensionValues>;
export type ActivityReward = { credit: MonetaryAmount };
export const ActivityReward = S.Union(S.Struct({ credit: MonetaryAmount }));
export interface Expression {
  Or?: Expressions;
  And?: Expressions;
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
  reward: (typeof ActivityReward)["Type"];
  status: string;
}
export const ActivitySummary = S.suspend(() =>
  S.Struct({
    activityId: S.String,
    title: S.String,
    reward: ActivityReward,
    status: S.String,
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
  status: string;
  instructionsUrl: string;
  reward: (typeof ActivityReward)["Type"];
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
    status: S.String,
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
  activities: Activities;
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
  freeTierUsages: FreeTierUsages;
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
  ): Effect.Effect<
    ListAccountActivitiesResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountActivitiesRequest,
  ) => Stream.Stream<
    ListAccountActivitiesResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountActivitiesRequest,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    GetFreeTierUsageResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetFreeTierUsageRequest,
  ) => Stream.Stream<
    GetFreeTierUsageResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetFreeTierUsageRequest,
  ) => Stream.Stream<
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
