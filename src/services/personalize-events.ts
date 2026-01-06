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
  sdkId: "Personalize Events",
  serviceShapeName: "AmazonPersonalizeEvents",
});
const auth = T.AwsAuthSigv4({ name: "personalize" });
const ver = T.ServiceVersion("2018-03-22");
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
                        url: "https://personalize-events-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://personalize-events-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://personalize-events.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://personalize-events.{Region}.{PartitionResult#dnsSuffix}",
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
export type StringType = string;
export type Arn = string;
export type UserId = string | Redacted.Redacted<string>;
export type ActionId = string | Redacted.Redacted<string>;
export type RecommendationId = string;
export type SynthesizedJsonActionInteractionProperties =
  | string
  | Redacted.Redacted<string>;
export type SynthesizedJsonActionProperties =
  | string
  | Redacted.Redacted<string>;
export type FloatType = number;
export type ItemId = string | Redacted.Redacted<string>;
export type SynthesizedJsonEventPropertiesJSON =
  | string
  | Redacted.Redacted<string>;
export type SynthesizedJsonItemProperties = string | Redacted.Redacted<string>;
export type SynthesizedJsonUserProperties = string | Redacted.Redacted<string>;
export type EventAttributionSource = string;
export type ErrorMessage = string;

//# Schemas
export type ActionImpression = string | Redacted.Redacted<string>[];
export const ActionImpression = S.Array(SensitiveString);
export type Impression = string | Redacted.Redacted<string>[];
export const Impression = S.Array(SensitiveString);
export interface ActionInteraction {
  actionId: string | Redacted.Redacted<string>;
  userId?: string | Redacted.Redacted<string>;
  sessionId: string;
  timestamp: Date;
  eventType: string;
  eventId?: string;
  recommendationId?: string;
  impression?: ActionImpression;
  properties?: string | Redacted.Redacted<string>;
}
export const ActionInteraction = S.suspend(() =>
  S.Struct({
    actionId: SensitiveString,
    userId: S.optional(SensitiveString),
    sessionId: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    eventType: S.String,
    eventId: S.optional(S.String),
    recommendationId: S.optional(S.String),
    impression: S.optional(ActionImpression),
    properties: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ActionInteraction",
}) as any as S.Schema<ActionInteraction>;
export type ActionInteractionsList = ActionInteraction[];
export const ActionInteractionsList = S.Array(ActionInteraction);
export interface Action {
  actionId: string;
  properties?: string | Redacted.Redacted<string>;
}
export const Action = S.suspend(() =>
  S.Struct({ actionId: S.String, properties: S.optional(SensitiveString) }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export type ActionList = Action[];
export const ActionList = S.Array(Action);
export interface Item {
  itemId: string;
  properties?: string | Redacted.Redacted<string>;
}
export const Item = S.suspend(() =>
  S.Struct({ itemId: S.String, properties: S.optional(SensitiveString) }),
).annotations({ identifier: "Item" }) as any as S.Schema<Item>;
export type ItemList = Item[];
export const ItemList = S.Array(Item);
export interface User {
  userId: string;
  properties?: string | Redacted.Redacted<string>;
}
export const User = S.suspend(() =>
  S.Struct({ userId: S.String, properties: S.optional(SensitiveString) }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type UserList = User[];
export const UserList = S.Array(User);
export interface PutActionInteractionsRequest {
  trackingId: string;
  actionInteractions: ActionInteractionsList;
}
export const PutActionInteractionsRequest = S.suspend(() =>
  S.Struct({
    trackingId: S.String,
    actionInteractions: ActionInteractionsList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/action-interactions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutActionInteractionsRequest",
}) as any as S.Schema<PutActionInteractionsRequest>;
export interface PutActionInteractionsResponse {}
export const PutActionInteractionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutActionInteractionsResponse",
}) as any as S.Schema<PutActionInteractionsResponse>;
export interface PutActionsRequest {
  datasetArn: string;
  actions: ActionList;
}
export const PutActionsRequest = S.suspend(() =>
  S.Struct({ datasetArn: S.String, actions: ActionList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/actions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutActionsRequest",
}) as any as S.Schema<PutActionsRequest>;
export interface PutActionsResponse {}
export const PutActionsResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutActionsResponse",
}) as any as S.Schema<PutActionsResponse>;
export interface PutItemsRequest {
  datasetArn: string;
  items: ItemList;
}
export const PutItemsRequest = S.suspend(() =>
  S.Struct({ datasetArn: S.String, items: ItemList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/items" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutItemsRequest",
}) as any as S.Schema<PutItemsRequest>;
export interface PutItemsResponse {}
export const PutItemsResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutItemsResponse",
}) as any as S.Schema<PutItemsResponse>;
export interface PutUsersRequest {
  datasetArn: string;
  users: UserList;
}
export const PutUsersRequest = S.suspend(() =>
  S.Struct({ datasetArn: S.String, users: UserList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutUsersRequest",
}) as any as S.Schema<PutUsersRequest>;
export interface PutUsersResponse {}
export const PutUsersResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutUsersResponse",
}) as any as S.Schema<PutUsersResponse>;
export interface MetricAttribution {
  eventAttributionSource: string;
}
export const MetricAttribution = S.suspend(() =>
  S.Struct({ eventAttributionSource: S.String }),
).annotations({
  identifier: "MetricAttribution",
}) as any as S.Schema<MetricAttribution>;
export interface Event {
  eventId?: string;
  eventType: string;
  eventValue?: number;
  itemId?: string | Redacted.Redacted<string>;
  properties?: string | Redacted.Redacted<string>;
  sentAt: Date;
  recommendationId?: string;
  impression?: Impression;
  metricAttribution?: MetricAttribution;
}
export const Event = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    eventType: S.String,
    eventValue: S.optional(S.Number),
    itemId: S.optional(SensitiveString),
    properties: S.optional(SensitiveString),
    sentAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    recommendationId: S.optional(S.String),
    impression: S.optional(Impression),
    metricAttribution: S.optional(MetricAttribution),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type EventList = Event[];
export const EventList = S.Array(Event);
export interface PutEventsRequest {
  trackingId: string;
  userId?: string | Redacted.Redacted<string>;
  sessionId: string;
  eventList: EventList;
}
export const PutEventsRequest = S.suspend(() =>
  S.Struct({
    trackingId: S.String,
    userId: S.optional(SensitiveString),
    sessionId: S.String,
    eventList: EventList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/events" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEventsRequest",
}) as any as S.Schema<PutEventsRequest>;
export interface PutEventsResponse {}
export const PutEventsResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutEventsResponse",
}) as any as S.Schema<PutEventsResponse>;

//# Errors
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Records item interaction event data. For more information see
 * Recording item interaction events.
 */
export const putEvents: (
  input: PutEventsRequest,
) => Effect.Effect<
  PutEventsResponse,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEventsRequest,
  output: PutEventsResponse,
  errors: [InvalidInputException],
}));
/**
 * Records action interaction event data. An *action interaction* event is an interaction between a user and an *action*.
 * For example, a user taking an action, such a enrolling in a membership program or downloading your app.
 *
 * For more information about recording action interactions, see Recording action interaction events.
 * For more information about actions in an Actions dataset, see Actions dataset.
 */
export const putActionInteractions: (
  input: PutActionInteractionsRequest,
) => Effect.Effect<
  PutActionInteractionsResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutActionInteractionsRequest,
  output: PutActionInteractionsResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds one or more actions to an Actions dataset. For more information see
 * Importing actions individually.
 */
export const putActions: (
  input: PutActionsRequest,
) => Effect.Effect<
  PutActionsResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutActionsRequest,
  output: PutActionsResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds one or more items to an Items dataset. For more information see
 * Importing items individually.
 */
export const putItems: (
  input: PutItemsRequest,
) => Effect.Effect<
  PutItemsResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutItemsRequest,
  output: PutItemsResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds one or more users to a Users dataset. For more information see
 * Importing users individually.
 */
export const putUsers: (
  input: PutUsersRequest,
) => Effect.Effect<
  PutUsersResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutUsersRequest,
  output: PutUsersResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
