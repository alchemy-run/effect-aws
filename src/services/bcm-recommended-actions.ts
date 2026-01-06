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
  sdkId: "BCM Recommended Actions",
  serviceShapeName: "AWSBillingAndCostManagementRecommendedActions",
});
const auth = T.AwsAuthSigv4({ name: "bcm-recommended-actions" });
const ver = T.ServiceVersion("2024-11-14");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
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
                  ],
                  endpoint: {
                    url: "https://bcm-recommended-actions-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
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
                {
                  conditions: [],
                  endpoint: {
                    url: "https://bcm-recommended-actions.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
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

//# Newtypes
export type MaxResults = number;
export type NextToken = string;
export type FilterValue = string;
export type AccountId = string;
export type NextStep = string;

//# Schemas
export type FilterValues = string[];
export const FilterValues = S.Array(S.String);
export interface ActionFilter {
  key: string;
  matchOption: string;
  values: FilterValues;
}
export const ActionFilter = S.suspend(() =>
  S.Struct({ key: S.String, matchOption: S.String, values: FilterValues }),
).annotations({ identifier: "ActionFilter" }) as any as S.Schema<ActionFilter>;
export type ActionFilterList = ActionFilter[];
export const ActionFilterList = S.Array(ActionFilter);
export interface RequestFilter {
  actions?: ActionFilterList;
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
export type NextSteps = string[];
export const NextSteps = S.Array(S.String);
export type Context = { [key: string]: string };
export const Context = S.Record({ key: S.String, value: S.String });
export interface RecommendedAction {
  id?: string;
  type?: string;
  accountId?: string;
  severity?: string;
  feature?: string;
  context?: Context;
  nextSteps?: NextSteps;
  lastUpdatedTimeStamp?: string;
}
export const RecommendedAction = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    type: S.optional(S.String),
    accountId: S.optional(S.String),
    severity: S.optional(S.String),
    feature: S.optional(S.String),
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
  recommendedActions: RecommendedActions;
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
    reason: S.String,
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
