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
  sdkId: "Personalize Runtime",
  serviceShapeName: "AmazonPersonalizeRuntime",
});
const auth = T.AwsAuthSigv4({ name: "personalize" });
const ver = T.ServiceVersion("2018-05-22");
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
                        url: "https://personalize-runtime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://personalize-runtime-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://personalize-runtime.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://personalize-runtime.{Region}.{PartitionResult#dnsSuffix}",
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
export type Arn = string;
export type UserID = string;
export type NumResults = number;
export type ItemID = string;
export type FilterAttributeName = string;
export type FilterAttributeValue = string | Redacted.Redacted<string>;
export type AttributeName = string;
export type AttributeValue = string | Redacted.Redacted<string>;
export type DatasetType = string;
export type ColumnName = string;
export type Name = string;
export type PercentPromotedItems = number;
export type RecommendationID = string;
export type ActionID = string;
export type Score = number;
export type Reason = string;
export type ErrorMessage = string;
export type ColumnValue = string;

//# Schemas
export type InputList = string[];
export const InputList = S.Array(S.String);
export type ColumnNamesList = string[];
export const ColumnNamesList = S.Array(S.String);
export type FilterValues = {
  [key: string]: string | Redacted.Redacted<string>;
};
export const FilterValues = S.Record({ key: S.String, value: SensitiveString });
export type Context = { [key: string]: string | Redacted.Redacted<string> };
export const Context = S.Record({ key: S.String, value: SensitiveString });
export type MetadataColumns = { [key: string]: ColumnNamesList };
export const MetadataColumns = S.Record({
  key: S.String,
  value: ColumnNamesList,
});
export interface Promotion {
  name?: string;
  percentPromotedItems?: number;
  filterArn?: string;
  filterValues?: FilterValues;
}
export const Promotion = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    percentPromotedItems: S.optional(S.Number),
    filterArn: S.optional(S.String),
    filterValues: S.optional(FilterValues),
  }),
).annotations({ identifier: "Promotion" }) as any as S.Schema<Promotion>;
export type PromotionList = Promotion[];
export const PromotionList = S.Array(Promotion);
export interface GetActionRecommendationsRequest {
  campaignArn?: string;
  userId?: string;
  numResults?: number;
  filterArn?: string;
  filterValues?: FilterValues;
}
export const GetActionRecommendationsRequest = S.suspend(() =>
  S.Struct({
    campaignArn: S.optional(S.String),
    userId: S.optional(S.String),
    numResults: S.optional(S.Number),
    filterArn: S.optional(S.String),
    filterValues: S.optional(FilterValues),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/action-recommendations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetActionRecommendationsRequest",
}) as any as S.Schema<GetActionRecommendationsRequest>;
export interface GetPersonalizedRankingRequest {
  campaignArn: string;
  inputList: InputList;
  userId: string;
  context?: Context;
  filterArn?: string;
  filterValues?: FilterValues;
  metadataColumns?: MetadataColumns;
}
export const GetPersonalizedRankingRequest = S.suspend(() =>
  S.Struct({
    campaignArn: S.String,
    inputList: InputList,
    userId: S.String,
    context: S.optional(Context),
    filterArn: S.optional(S.String),
    filterValues: S.optional(FilterValues),
    metadataColumns: S.optional(MetadataColumns),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/personalize-ranking" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPersonalizedRankingRequest",
}) as any as S.Schema<GetPersonalizedRankingRequest>;
export interface GetRecommendationsRequest {
  campaignArn?: string;
  itemId?: string;
  userId?: string;
  numResults?: number;
  context?: Context;
  filterArn?: string;
  filterValues?: FilterValues;
  recommenderArn?: string;
  promotions?: PromotionList;
  metadataColumns?: MetadataColumns;
}
export const GetRecommendationsRequest = S.suspend(() =>
  S.Struct({
    campaignArn: S.optional(S.String),
    itemId: S.optional(S.String),
    userId: S.optional(S.String),
    numResults: S.optional(S.Number),
    context: S.optional(Context),
    filterArn: S.optional(S.String),
    filterValues: S.optional(FilterValues),
    recommenderArn: S.optional(S.String),
    promotions: S.optional(PromotionList),
    metadataColumns: S.optional(MetadataColumns),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/recommendations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecommendationsRequest",
}) as any as S.Schema<GetRecommendationsRequest>;
export type Metadata = { [key: string]: string };
export const Metadata = S.Record({ key: S.String, value: S.String });
export type ReasonList = string[];
export const ReasonList = S.Array(S.String);
export interface PredictedItem {
  itemId?: string;
  score?: number;
  promotionName?: string;
  metadata?: Metadata;
  reason?: ReasonList;
}
export const PredictedItem = S.suspend(() =>
  S.Struct({
    itemId: S.optional(S.String),
    score: S.optional(S.Number),
    promotionName: S.optional(S.String),
    metadata: S.optional(Metadata),
    reason: S.optional(ReasonList),
  }),
).annotations({
  identifier: "PredictedItem",
}) as any as S.Schema<PredictedItem>;
export type ItemList = PredictedItem[];
export const ItemList = S.Array(PredictedItem);
export interface GetRecommendationsResponse {
  itemList?: ItemList;
  recommendationId?: string;
}
export const GetRecommendationsResponse = S.suspend(() =>
  S.Struct({
    itemList: S.optional(ItemList),
    recommendationId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRecommendationsResponse",
}) as any as S.Schema<GetRecommendationsResponse>;
export interface PredictedAction {
  actionId?: string;
  score?: number;
}
export const PredictedAction = S.suspend(() =>
  S.Struct({ actionId: S.optional(S.String), score: S.optional(S.Number) }),
).annotations({
  identifier: "PredictedAction",
}) as any as S.Schema<PredictedAction>;
export type ActionList = PredictedAction[];
export const ActionList = S.Array(PredictedAction);
export interface GetActionRecommendationsResponse {
  actionList?: ActionList;
  recommendationId?: string;
}
export const GetActionRecommendationsResponse = S.suspend(() =>
  S.Struct({
    actionList: S.optional(ActionList),
    recommendationId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetActionRecommendationsResponse",
}) as any as S.Schema<GetActionRecommendationsResponse>;
export interface GetPersonalizedRankingResponse {
  personalizedRanking?: ItemList;
  recommendationId?: string;
}
export const GetPersonalizedRankingResponse = S.suspend(() =>
  S.Struct({
    personalizedRanking: S.optional(ItemList),
    recommendationId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPersonalizedRankingResponse",
}) as any as S.Schema<GetPersonalizedRankingResponse>;

//# Errors
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of recommended items. For campaigns, the campaign's Amazon Resource Name (ARN) is required and the required user and item input depends on the recipe type used to
 * create the solution backing the campaign as follows:
 *
 * - USER_PERSONALIZATION - `userId` required, `itemId` not used
 *
 * - RELATED_ITEMS - `itemId` required, `userId` not used
 *
 * Campaigns that are backed by a solution created using a recipe of type
 * PERSONALIZED_RANKING use the API.
 *
 * For recommenders, the recommender's ARN is required and the required item and user input depends on the use case (domain-based recipe) backing the recommender.
 * For information on use case requirements see Choosing recommender use cases.
 */
export const getRecommendations: (
  input: GetRecommendationsRequest,
) => Effect.Effect<
  GetRecommendationsResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecommendationsRequest,
  output: GetRecommendationsResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Returns a list of recommended actions in sorted in descending order by prediction score.
 * Use the `GetActionRecommendations` API if you have a custom
 * campaign that deploys a solution version trained with a PERSONALIZED_ACTIONS recipe.
 *
 * For more information about PERSONALIZED_ACTIONS recipes, see PERSONALIZED_ACTIONS recipes.
 * For more information about getting action recommendations, see Getting action recommendations.
 */
export const getActionRecommendations: (
  input: GetActionRecommendationsRequest,
) => Effect.Effect<
  GetActionRecommendationsResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetActionRecommendationsRequest,
  output: GetActionRecommendationsResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Re-ranks a list of recommended items for the given user. The first item in the list is
 * deemed the most likely item to be of interest to the user.
 *
 * The solution backing the campaign must have been created using a recipe of type
 * PERSONALIZED_RANKING.
 */
export const getPersonalizedRanking: (
  input: GetPersonalizedRankingRequest,
) => Effect.Effect<
  GetPersonalizedRankingResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPersonalizedRankingRequest,
  output: GetPersonalizedRankingResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
