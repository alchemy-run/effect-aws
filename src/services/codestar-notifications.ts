import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "codestar notifications",
  serviceShapeName: "CodeStarNotifications_20191015",
});
const auth = T.AwsAuthSigv4({ name: "codestar-notifications" });
const ver = T.ServiceVersion("2019-10-15");
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
                        url: "https://codestar-notifications-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://codestar-notifications-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://codestar-notifications.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://codestar-notifications.{Region}.{PartitionResult#dnsSuffix}",
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
export const EventTypeIds = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class DeleteNotificationRuleRequest extends S.Class<DeleteNotificationRuleRequest>(
  "DeleteNotificationRuleRequest",
)(
  { Arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/deleteNotificationRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTargetRequest extends S.Class<DeleteTargetRequest>(
  "DeleteTargetRequest",
)(
  { TargetAddress: S.String, ForceUnsubscribeAll: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "POST", uri: "/deleteTarget" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTargetResult extends S.Class<DeleteTargetResult>(
  "DeleteTargetResult",
)({}) {}
export class DescribeNotificationRuleRequest extends S.Class<DescribeNotificationRuleRequest>(
  "DescribeNotificationRuleRequest",
)(
  { Arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/describeNotificationRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { Arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/listTagsForResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Target extends S.Class<Target>("Target")({
  TargetType: S.optional(S.String),
  TargetAddress: S.optional(S.String),
}) {}
export class SubscribeRequest extends S.Class<SubscribeRequest>(
  "SubscribeRequest",
)(
  { Arn: S.String, Target: Target, ClientRequestToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/subscribe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { Arn: S.String, Tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tagResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UnsubscribeRequest extends S.Class<UnsubscribeRequest>(
  "UnsubscribeRequest",
)(
  { Arn: S.String, TargetAddress: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/unsubscribe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/untagResource/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResult extends S.Class<UntagResourceResult>(
  "UntagResourceResult",
)({}) {}
export const Targets = S.Array(Target);
export class UpdateNotificationRuleRequest extends S.Class<UpdateNotificationRuleRequest>(
  "UpdateNotificationRuleRequest",
)(
  {
    Arn: S.String,
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    EventTypeIds: S.optional(EventTypeIds),
    Targets: S.optional(Targets),
    DetailType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/updateNotificationRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNotificationRuleResult extends S.Class<UpdateNotificationRuleResult>(
  "UpdateNotificationRuleResult",
)({}) {}
export class ListEventTypesFilter extends S.Class<ListEventTypesFilter>(
  "ListEventTypesFilter",
)({ Name: S.String, Value: S.String }) {}
export const ListEventTypesFilters = S.Array(ListEventTypesFilter);
export class ListNotificationRulesFilter extends S.Class<ListNotificationRulesFilter>(
  "ListNotificationRulesFilter",
)({ Name: S.String, Value: S.String }) {}
export const ListNotificationRulesFilters = S.Array(
  ListNotificationRulesFilter,
);
export class ListTargetsFilter extends S.Class<ListTargetsFilter>(
  "ListTargetsFilter",
)({ Name: S.String, Value: S.String }) {}
export const ListTargetsFilters = S.Array(ListTargetsFilter);
export class CreateNotificationRuleRequest extends S.Class<CreateNotificationRuleRequest>(
  "CreateNotificationRuleRequest",
)(
  {
    Name: S.String,
    EventTypeIds: EventTypeIds,
    Resource: S.String,
    Targets: Targets,
    DetailType: S.String,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(Tags),
    Status: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/createNotificationRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNotificationRuleResult extends S.Class<DeleteNotificationRuleResult>(
  "DeleteNotificationRuleResult",
)({ Arn: S.optional(S.String) }) {}
export class ListEventTypesRequest extends S.Class<ListEventTypesRequest>(
  "ListEventTypesRequest",
)(
  {
    Filters: S.optional(ListEventTypesFilters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listEventTypes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNotificationRulesRequest extends S.Class<ListNotificationRulesRequest>(
  "ListNotificationRulesRequest",
)(
  {
    Filters: S.optional(ListNotificationRulesFilters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listNotificationRules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResult extends S.Class<ListTagsForResourceResult>(
  "ListTagsForResourceResult",
)({ Tags: S.optional(Tags) }) {}
export class ListTargetsRequest extends S.Class<ListTargetsRequest>(
  "ListTargetsRequest",
)(
  {
    Filters: S.optional(ListTargetsFilters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listTargets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SubscribeResult extends S.Class<SubscribeResult>(
  "SubscribeResult",
)({ Arn: S.optional(S.String) }) {}
export class TagResourceResult extends S.Class<TagResourceResult>(
  "TagResourceResult",
)({ Tags: S.optional(Tags) }) {}
export class UnsubscribeResult extends S.Class<UnsubscribeResult>(
  "UnsubscribeResult",
)({ Arn: S.String }) {}
export class EventTypeSummary extends S.Class<EventTypeSummary>(
  "EventTypeSummary",
)({
  EventTypeId: S.optional(S.String),
  ServiceName: S.optional(S.String),
  EventTypeName: S.optional(S.String),
  ResourceType: S.optional(S.String),
}) {}
export const EventTypeBatch = S.Array(EventTypeSummary);
export class TargetSummary extends S.Class<TargetSummary>("TargetSummary")({
  TargetAddress: S.optional(S.String),
  TargetType: S.optional(S.String),
  TargetStatus: S.optional(S.String),
}) {}
export const TargetsBatch = S.Array(TargetSummary);
export class CreateNotificationRuleResult extends S.Class<CreateNotificationRuleResult>(
  "CreateNotificationRuleResult",
)({ Arn: S.optional(S.String) }) {}
export class DescribeNotificationRuleResult extends S.Class<DescribeNotificationRuleResult>(
  "DescribeNotificationRuleResult",
)({
  Arn: S.String,
  Name: S.optional(S.String),
  EventTypes: S.optional(EventTypeBatch),
  Resource: S.optional(S.String),
  Targets: S.optional(TargetsBatch),
  DetailType: S.optional(S.String),
  CreatedBy: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Tags: S.optional(Tags),
}) {}
export class ListEventTypesResult extends S.Class<ListEventTypesResult>(
  "ListEventTypesResult",
)({
  EventTypes: S.optional(EventTypeBatch),
  NextToken: S.optional(S.String),
}) {}
export class ListTargetsResult extends S.Class<ListTargetsResult>(
  "ListTargetsResult",
)({ Targets: S.optional(TargetsBatch), NextToken: S.optional(S.String) }) {}
export class NotificationRuleSummary extends S.Class<NotificationRuleSummary>(
  "NotificationRuleSummary",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export const NotificationRuleBatch = S.Array(NotificationRuleSummary);
export class ListNotificationRulesResult extends S.Class<ListNotificationRulesResult>(
  "ListNotificationRulesResult",
)({
  NextToken: S.optional(S.String),
  NotificationRules: S.optional(NotificationRuleBatch),
}) {}

//# Errors
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
) {}
export class ConfigurationException extends S.TaggedError<ConfigurationException>()(
  "ConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a specified target for notifications.
 */
export const deleteTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTargetRequest,
  output: DeleteTargetResult,
  errors: [ValidationException],
}));
/**
 * Removes an association between a notification rule and an Amazon Q Developer in chat applications topic so that
 * subscribers to that topic stop receiving notifications when the events described in the
 * rule are triggered.
 */
export const unsubscribe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnsubscribeRequest,
  output: UnsubscribeResult,
  errors: [ValidationException],
}));
/**
 * Returns a list of the tags associated with a notification rule.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Removes the association between one or more provided tags and a notification
 * rule.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResult,
  errors: [
    ConcurrentModificationException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a notification rule for a resource. You can change the events that trigger the
 * notification rule, the status of the rule, and the targets that receive the
 * notifications.
 *
 * To add or remove tags for a notification rule, you must use TagResource and UntagResource.
 */
export const updateNotificationRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateNotificationRuleRequest,
    output: UpdateNotificationRuleResult,
    errors: [
      ConfigurationException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an association between a notification rule and an Amazon Q Developer in chat applications topic or Amazon Q Developer in chat applications client so that the
 * associated target can receive notifications when the events described in the rule are
 * triggered.
 */
export const subscribe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubscribeRequest,
  output: SubscribeResult,
  errors: [
    ConfigurationException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specified notification rule.
 */
export const describeNotificationRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeNotificationRuleRequest,
    output: DescribeNotificationRuleResult,
    errors: [ResourceNotFoundException, ValidationException],
  }),
);
/**
 * Deletes a notification rule for a resource.
 */
export const deleteNotificationRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteNotificationRuleRequest,
    output: DeleteNotificationRuleResult,
    errors: [
      ConcurrentModificationException,
      LimitExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Associates a set of provided tags with a notification rule.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResult,
  errors: [
    ConcurrentModificationException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about the event types available for configuring notifications.
 */
export const listEventTypes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEventTypesRequest,
    output: ListEventTypesResult,
    errors: [InvalidNextTokenException, ValidationException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "EventTypes",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns a list of the notification rules for an Amazon Web Services account.
 */
export const listNotificationRules =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListNotificationRulesRequest,
    output: ListNotificationRulesResult,
    errors: [InvalidNextTokenException, ValidationException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "NotificationRules",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of the notification rule targets for an Amazon Web Services account.
 */
export const listTargets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTargetsRequest,
    output: ListTargetsResult,
    errors: [InvalidNextTokenException, ValidationException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Targets",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates a notification rule for a resource. The rule specifies the events you want
 * notifications about and the targets (such as Amazon Q Developer in chat applications topics or Amazon Q Developer in chat applications clients configured for Slack) where you want to receive
 * them.
 */
export const createNotificationRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateNotificationRuleRequest,
    output: CreateNotificationRuleResult,
    errors: [
      AccessDeniedException,
      ConcurrentModificationException,
      ConfigurationException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ValidationException,
    ],
  }),
);
