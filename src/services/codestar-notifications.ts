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
  sdkId: "codestar notifications",
  serviceShapeName: "CodeStarNotifications_20191015",
});
const auth = T.AwsAuthSigv4({ name: "codestar-notifications" });
const ver = T.ServiceVersion("2019-10-15");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
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
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://codestar-notifications-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://codestar-notifications-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://codestar-notifications.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://codestar-notifications.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type NotificationRuleName = string | Redacted.Redacted<string>;
export type EventTypeId = string;
export type NotificationRuleResource = string;
export type ClientRequestToken = string;
export type NotificationRuleArn = string;
export type TargetAddress = string | Redacted.Redacted<string>;
export type NextToken = string;
export type MaxResults = number;
export type TagKey = string;
export type TargetType = string;
export type TagValue = string;
export type ListEventTypesFilterValue = string;
export type ListNotificationRulesFilterValue = string;
export type ListTargetsFilterValue = string;
export type Message = string;
export type NotificationRuleCreatedBy = string;
export type ServiceName = string;
export type EventTypeName = string;
export type ResourceType = string;
export type NotificationRuleId = string;

//# Schemas
export type EventTypeIds = string[];
export const EventTypeIds = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface DeleteNotificationRuleRequest {
  Arn: string;
}
export const DeleteNotificationRuleRequest = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deleteNotificationRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteNotificationRuleRequest",
}) as any as S.Schema<DeleteNotificationRuleRequest>;
export interface DeleteTargetRequest {
  TargetAddress: string | Redacted.Redacted<string>;
  ForceUnsubscribeAll?: boolean;
}
export const DeleteTargetRequest = S.suspend(() =>
  S.Struct({
    TargetAddress: SensitiveString,
    ForceUnsubscribeAll: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deleteTarget" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTargetRequest",
}) as any as S.Schema<DeleteTargetRequest>;
export interface DeleteTargetResult {}
export const DeleteTargetResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTargetResult",
}) as any as S.Schema<DeleteTargetResult>;
export interface DescribeNotificationRuleRequest {
  Arn: string;
}
export const DescribeNotificationRuleRequest = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describeNotificationRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeNotificationRuleRequest",
}) as any as S.Schema<DescribeNotificationRuleRequest>;
export interface ListTagsForResourceRequest {
  Arn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listTagsForResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface Target {
  TargetType?: string;
  TargetAddress?: string | Redacted.Redacted<string>;
}
export const Target = S.suspend(() =>
  S.Struct({
    TargetType: S.optional(S.String),
    TargetAddress: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Target" }) as any as S.Schema<Target>;
export interface SubscribeRequest {
  Arn: string;
  Target: Target;
  ClientRequestToken?: string;
}
export const SubscribeRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Target: Target,
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/subscribe" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SubscribeRequest",
}) as any as S.Schema<SubscribeRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  Arn: string;
  Tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ Arn: S.String, Tags: Tags }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tagResource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface UnsubscribeRequest {
  Arn: string;
  TargetAddress: string | Redacted.Redacted<string>;
}
export const UnsubscribeRequest = S.suspend(() =>
  S.Struct({ Arn: S.String, TargetAddress: SensitiveString }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/unsubscribe" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UnsubscribeRequest",
}) as any as S.Schema<UnsubscribeRequest>;
export interface UntagResourceRequest {
  Arn: string;
  TagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/untagResource/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResult {}
export const UntagResourceResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResult",
}) as any as S.Schema<UntagResourceResult>;
export type Targets = Target[];
export const Targets = S.Array(Target);
export interface UpdateNotificationRuleRequest {
  Arn: string;
  Name?: string | Redacted.Redacted<string>;
  Status?: string;
  EventTypeIds?: EventTypeIds;
  Targets?: Targets;
  DetailType?: string;
}
export const UpdateNotificationRuleRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.optional(SensitiveString),
    Status: S.optional(S.String),
    EventTypeIds: S.optional(EventTypeIds),
    Targets: S.optional(Targets),
    DetailType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/updateNotificationRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNotificationRuleRequest",
}) as any as S.Schema<UpdateNotificationRuleRequest>;
export interface UpdateNotificationRuleResult {}
export const UpdateNotificationRuleResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateNotificationRuleResult",
}) as any as S.Schema<UpdateNotificationRuleResult>;
export interface ListEventTypesFilter {
  Name: string;
  Value: string;
}
export const ListEventTypesFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "ListEventTypesFilter",
}) as any as S.Schema<ListEventTypesFilter>;
export type ListEventTypesFilters = ListEventTypesFilter[];
export const ListEventTypesFilters = S.Array(ListEventTypesFilter);
export interface ListNotificationRulesFilter {
  Name: string;
  Value: string;
}
export const ListNotificationRulesFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "ListNotificationRulesFilter",
}) as any as S.Schema<ListNotificationRulesFilter>;
export type ListNotificationRulesFilters = ListNotificationRulesFilter[];
export const ListNotificationRulesFilters = S.Array(
  ListNotificationRulesFilter,
);
export interface ListTargetsFilter {
  Name: string;
  Value: string;
}
export const ListTargetsFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "ListTargetsFilter",
}) as any as S.Schema<ListTargetsFilter>;
export type ListTargetsFilters = ListTargetsFilter[];
export const ListTargetsFilters = S.Array(ListTargetsFilter);
export interface CreateNotificationRuleRequest {
  Name: string | Redacted.Redacted<string>;
  EventTypeIds: EventTypeIds;
  Resource: string;
  Targets: Targets;
  DetailType: string;
  ClientRequestToken?: string;
  Tags?: Tags;
  Status?: string;
}
export const CreateNotificationRuleRequest = S.suspend(() =>
  S.Struct({
    Name: SensitiveString,
    EventTypeIds: EventTypeIds,
    Resource: S.String,
    Targets: Targets,
    DetailType: S.String,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(Tags),
    Status: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/createNotificationRule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNotificationRuleRequest",
}) as any as S.Schema<CreateNotificationRuleRequest>;
export interface DeleteNotificationRuleResult {
  Arn?: string;
}
export const DeleteNotificationRuleResult = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteNotificationRuleResult",
}) as any as S.Schema<DeleteNotificationRuleResult>;
export interface ListEventTypesRequest {
  Filters?: ListEventTypesFilters;
  NextToken?: string;
  MaxResults?: number;
}
export const ListEventTypesRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ListEventTypesFilters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listEventTypes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventTypesRequest",
}) as any as S.Schema<ListEventTypesRequest>;
export interface ListNotificationRulesRequest {
  Filters?: ListNotificationRulesFilters;
  NextToken?: string;
  MaxResults?: number;
}
export const ListNotificationRulesRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ListNotificationRulesFilters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listNotificationRules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNotificationRulesRequest",
}) as any as S.Schema<ListNotificationRulesRequest>;
export interface ListTagsForResourceResult {
  Tags?: Tags;
}
export const ListTagsForResourceResult = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResult",
}) as any as S.Schema<ListTagsForResourceResult>;
export interface ListTargetsRequest {
  Filters?: ListTargetsFilters;
  NextToken?: string;
  MaxResults?: number;
}
export const ListTargetsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ListTargetsFilters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listTargets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTargetsRequest",
}) as any as S.Schema<ListTargetsRequest>;
export interface SubscribeResult {
  Arn?: string;
}
export const SubscribeResult = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "SubscribeResult",
}) as any as S.Schema<SubscribeResult>;
export interface TagResourceResult {
  Tags?: Tags;
}
export const TagResourceResult = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "TagResourceResult",
}) as any as S.Schema<TagResourceResult>;
export interface UnsubscribeResult {
  Arn: string;
}
export const UnsubscribeResult = S.suspend(() =>
  S.Struct({ Arn: S.String }),
).annotations({
  identifier: "UnsubscribeResult",
}) as any as S.Schema<UnsubscribeResult>;
export interface EventTypeSummary {
  EventTypeId?: string;
  ServiceName?: string;
  EventTypeName?: string;
  ResourceType?: string;
}
export const EventTypeSummary = S.suspend(() =>
  S.Struct({
    EventTypeId: S.optional(S.String),
    ServiceName: S.optional(S.String),
    EventTypeName: S.optional(S.String),
    ResourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "EventTypeSummary",
}) as any as S.Schema<EventTypeSummary>;
export type EventTypeBatch = EventTypeSummary[];
export const EventTypeBatch = S.Array(EventTypeSummary);
export interface TargetSummary {
  TargetAddress?: string | Redacted.Redacted<string>;
  TargetType?: string;
  TargetStatus?: string;
}
export const TargetSummary = S.suspend(() =>
  S.Struct({
    TargetAddress: S.optional(SensitiveString),
    TargetType: S.optional(S.String),
    TargetStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetSummary",
}) as any as S.Schema<TargetSummary>;
export type TargetsBatch = TargetSummary[];
export const TargetsBatch = S.Array(TargetSummary);
export interface CreateNotificationRuleResult {
  Arn?: string;
}
export const CreateNotificationRuleResult = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateNotificationRuleResult",
}) as any as S.Schema<CreateNotificationRuleResult>;
export interface DescribeNotificationRuleResult {
  Arn: string;
  Name?: string | Redacted.Redacted<string>;
  EventTypes?: EventTypeBatch;
  Resource?: string;
  Targets?: TargetsBatch;
  DetailType?: string;
  CreatedBy?: string;
  Status?: string;
  CreatedTimestamp?: Date;
  LastModifiedTimestamp?: Date;
  Tags?: Tags;
}
export const DescribeNotificationRuleResult = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.optional(SensitiveString),
    EventTypes: S.optional(EventTypeBatch),
    Resource: S.optional(S.String),
    Targets: S.optional(TargetsBatch),
    DetailType: S.optional(S.String),
    CreatedBy: S.optional(S.String),
    Status: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "DescribeNotificationRuleResult",
}) as any as S.Schema<DescribeNotificationRuleResult>;
export interface ListEventTypesResult {
  EventTypes?: EventTypeBatch;
  NextToken?: string;
}
export const ListEventTypesResult = S.suspend(() =>
  S.Struct({
    EventTypes: S.optional(EventTypeBatch),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEventTypesResult",
}) as any as S.Schema<ListEventTypesResult>;
export interface ListTargetsResult {
  Targets?: TargetsBatch;
  NextToken?: string;
}
export const ListTargetsResult = S.suspend(() =>
  S.Struct({
    Targets: S.optional(TargetsBatch),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTargetsResult",
}) as any as S.Schema<ListTargetsResult>;
export interface NotificationRuleSummary {
  Id?: string;
  Arn?: string;
}
export const NotificationRuleSummary = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "NotificationRuleSummary",
}) as any as S.Schema<NotificationRuleSummary>;
export type NotificationRuleBatch = NotificationRuleSummary[];
export const NotificationRuleBatch = S.Array(NotificationRuleSummary);
export interface ListNotificationRulesResult {
  NextToken?: string;
  NotificationRules?: NotificationRuleBatch;
}
export const ListNotificationRulesResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    NotificationRules: S.optional(NotificationRuleBatch),
  }),
).annotations({
  identifier: "ListNotificationRulesResult",
}) as any as S.Schema<ListNotificationRulesResult>;

//# Errors
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConfigurationException extends S.TaggedError<ConfigurationException>()(
  "ConfigurationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}

//# Operations
/**
 * Deletes a specified target for notifications.
 */
export const deleteTarget: (
  input: DeleteTargetRequest,
) => Effect.Effect<
  DeleteTargetResult,
  ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTargetRequest,
  output: DeleteTargetResult,
  errors: [ValidationException],
}));
/**
 * Removes an association between a notification rule and an Amazon Q Developer in chat applications topic so that
 * subscribers to that topic stop receiving notifications when the events described in the
 * rule are triggered.
 */
export const unsubscribe: (
  input: UnsubscribeRequest,
) => Effect.Effect<
  UnsubscribeResult,
  ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnsubscribeRequest,
  output: UnsubscribeResult,
  errors: [ValidationException],
}));
/**
 * Returns a list of the tags associated with a notification rule.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResult,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Removes the association between one or more provided tags and a notification
 * rule.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResult,
  | ConcurrentModificationException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateNotificationRule: (
  input: UpdateNotificationRuleRequest,
) => Effect.Effect<
  UpdateNotificationRuleResult,
  | ConfigurationException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNotificationRuleRequest,
  output: UpdateNotificationRuleResult,
  errors: [
    ConfigurationException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an association between a notification rule and an Amazon Q Developer in chat applications topic or Amazon Q Developer in chat applications client so that the
 * associated target can receive notifications when the events described in the rule are
 * triggered.
 */
export const subscribe: (
  input: SubscribeRequest,
) => Effect.Effect<
  SubscribeResult,
  | ConfigurationException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeNotificationRule: (
  input: DescribeNotificationRuleRequest,
) => Effect.Effect<
  DescribeNotificationRuleResult,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNotificationRuleRequest,
  output: DescribeNotificationRuleResult,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes a notification rule for a resource.
 */
export const deleteNotificationRule: (
  input: DeleteNotificationRuleRequest,
) => Effect.Effect<
  DeleteNotificationRuleResult,
  | ConcurrentModificationException
  | LimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNotificationRuleRequest,
  output: DeleteNotificationRuleResult,
  errors: [
    ConcurrentModificationException,
    LimitExceededException,
    ValidationException,
  ],
}));
/**
 * Associates a set of provided tags with a notification rule.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResult,
  | ConcurrentModificationException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listEventTypes: {
  (
    input: ListEventTypesRequest,
  ): Effect.Effect<
    ListEventTypesResult,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventTypesRequest,
  ) => Stream.Stream<
    ListEventTypesResult,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventTypesRequest,
  ) => Stream.Stream<
    EventTypeSummary,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventTypesRequest,
  output: ListEventTypesResult,
  errors: [InvalidNextTokenException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EventTypes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of the notification rules for an Amazon Web Services account.
 */
export const listNotificationRules: {
  (
    input: ListNotificationRulesRequest,
  ): Effect.Effect<
    ListNotificationRulesResult,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNotificationRulesRequest,
  ) => Stream.Stream<
    ListNotificationRulesResult,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNotificationRulesRequest,
  ) => Stream.Stream<
    NotificationRuleSummary,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTargets: {
  (
    input: ListTargetsRequest,
  ): Effect.Effect<
    ListTargetsResult,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTargetsRequest,
  ) => Stream.Stream<
    ListTargetsResult,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTargetsRequest,
  ) => Stream.Stream<
    TargetSummary,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTargetsRequest,
  output: ListTargetsResult,
  errors: [InvalidNextTokenException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Targets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a notification rule for a resource. The rule specifies the events you want
 * notifications about and the targets (such as Amazon Q Developer in chat applications topics or Amazon Q Developer in chat applications clients configured for Slack) where you want to receive
 * them.
 */
export const createNotificationRule: (
  input: CreateNotificationRuleRequest,
) => Effect.Effect<
  CreateNotificationRuleResult,
  | AccessDeniedException
  | ConcurrentModificationException
  | ConfigurationException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
