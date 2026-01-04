import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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

//# Schemas
export const FilterValues = S.Array(S.String);
export class ActionFilter extends S.Class<ActionFilter>("ActionFilter")({
  key: S.String,
  matchOption: S.String,
  values: FilterValues,
}) {}
export const ActionFilterList = S.Array(ActionFilter);
export class RequestFilter extends S.Class<RequestFilter>("RequestFilter")({
  actions: S.optional(ActionFilterList),
}) {}
export class ListRecommendedActionsRequest extends S.Class<ListRecommendedActionsRequest>(
  "ListRecommendedActionsRequest",
)(
  {
    filter: S.optional(RequestFilter),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const NextSteps = S.Array(S.String);
export const Context = S.Record({ key: S.String, value: S.String });
export class RecommendedAction extends S.Class<RecommendedAction>(
  "RecommendedAction",
)({
  id: S.optional(S.String),
  type: S.optional(S.String),
  accountId: S.optional(S.String),
  severity: S.optional(S.String),
  feature: S.optional(S.String),
  context: S.optional(Context),
  nextSteps: S.optional(NextSteps),
  lastUpdatedTimeStamp: S.optional(S.String),
}) {}
export const RecommendedActions = S.Array(RecommendedAction);
export class ListRecommendedActionsResponse extends S.Class<ListRecommendedActionsResponse>(
  "ListRecommendedActionsResponse",
)({
  recommendedActions: RecommendedActions,
  nextToken: S.optional(S.String),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
  T.AwsQueryError({
    code: "BCMRecommendedActionsAccessDenied",
    httpResponseCode: 403,
  }),
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.AwsQueryError({
    code: "BCMRecommendedActionsInternalServer",
    httpResponseCode: 500,
  }),
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.AwsQueryError({
    code: "BCMRecommendedActionsThrottling",
    httpResponseCode: 429,
  }),
) {}
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
) {}

//# Operations
/**
 * Returns a list of recommended actions that match the filter criteria.
 */
export const listRecommendedActions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRecommendedActionsRequest,
    output: ListRecommendedActionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
