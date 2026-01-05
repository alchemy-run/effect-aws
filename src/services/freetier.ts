import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export class GetAccountPlanStateRequest extends S.Class<GetAccountPlanStateRequest>(
  "GetAccountPlanStateRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FilterActivityStatuses = S.Array(S.String);
export class GetAccountActivityRequest extends S.Class<GetAccountActivityRequest>(
  "GetAccountActivityRequest",
)(
  { activityId: S.String, languageCode: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccountActivitiesRequest extends S.Class<ListAccountActivitiesRequest>(
  "ListAccountActivitiesRequest",
)(
  {
    filterActivityStatuses: S.optional(FilterActivityStatuses),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    languageCode: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpgradeAccountPlanRequest extends S.Class<UpgradeAccountPlanRequest>(
  "UpgradeAccountPlanRequest",
)(
  { accountPlanType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export type Expressions = Expression[];
export const Expressions = S.Array(
  S.suspend((): S.Schema<Expression, any> => Expression),
) as any as S.Schema<Expressions>;
export class MonetaryAmount extends S.Class<MonetaryAmount>("MonetaryAmount")({
  amount: S.Number,
  unit: S.String,
}) {}
export const Values = S.Array(S.String);
export const MatchOptions = S.Array(S.String);
export class GetAccountPlanStateResponse extends S.Class<GetAccountPlanStateResponse>(
  "GetAccountPlanStateResponse",
)({
  accountId: S.String,
  accountPlanType: S.String,
  accountPlanStatus: S.String,
  accountPlanRemainingCredits: S.optional(MonetaryAmount),
  accountPlanExpirationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class UpgradeAccountPlanResponse extends S.Class<UpgradeAccountPlanResponse>(
  "UpgradeAccountPlanResponse",
)({
  accountId: S.String,
  accountPlanType: S.String,
  accountPlanStatus: S.String,
}) {}
export class DimensionValues extends S.Class<DimensionValues>(
  "DimensionValues",
)({ Key: S.String, Values: Values, MatchOptions: MatchOptions }) {}
export const ActivityReward = S.Union(S.Struct({ credit: MonetaryAmount }));
export class Expression extends S.Class<Expression>("Expression")({
  Or: S.optional(S.suspend(() => Expressions)),
  And: S.optional(S.suspend(() => Expressions)),
  Not: S.optional(S.suspend((): S.Schema<Expression, any> => Expression)),
  Dimensions: S.optional(DimensionValues),
}) {}
export class ActivitySummary extends S.Class<ActivitySummary>(
  "ActivitySummary",
)({
  activityId: S.String,
  title: S.String,
  reward: ActivityReward,
  status: S.String,
}) {}
export const Activities = S.Array(ActivitySummary);
export class GetAccountActivityResponse extends S.Class<GetAccountActivityResponse>(
  "GetAccountActivityResponse",
)({
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
}) {}
export class GetFreeTierUsageRequest extends S.Class<GetFreeTierUsageRequest>(
  "GetFreeTierUsageRequest",
)(
  {
    filter: S.optional(Expression),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccountActivitiesResponse extends S.Class<ListAccountActivitiesResponse>(
  "ListAccountActivitiesResponse",
)({ activities: Activities, nextToken: S.optional(S.String) }) {}
export class FreeTierUsage extends S.Class<FreeTierUsage>("FreeTierUsage")({
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
}) {}
export const FreeTierUsages = S.Array(FreeTierUsage);
export class GetFreeTierUsageResponse extends S.Class<GetFreeTierUsageResponse>(
  "GetFreeTierUsageResponse",
)({ freeTierUsages: FreeTierUsages, nextToken: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}

//# Operations
/**
 * Returns a list of activities that are available. This operation supports pagination and filtering by status.
 */
export const listAccountActivities =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getAccountPlanState = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const upgradeAccountPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAccountActivity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFreeTierUsage = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetFreeTierUsageRequest,
    output: GetFreeTierUsageResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "freeTierUsages",
      pageSize: "maxResults",
    } as const,
  }),
);
