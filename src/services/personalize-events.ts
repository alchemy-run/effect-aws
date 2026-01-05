import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export const ActionImpression = S.Array(S.String);
export const Impression = S.Array(S.String);
export class ActionInteraction extends S.Class<ActionInteraction>(
  "ActionInteraction",
)({
  actionId: S.String,
  userId: S.optional(S.String),
  sessionId: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  eventType: S.String,
  eventId: S.optional(S.String),
  recommendationId: S.optional(S.String),
  impression: S.optional(ActionImpression),
  properties: S.optional(S.String),
}) {}
export const ActionInteractionsList = S.Array(ActionInteraction);
export class Action extends S.Class<Action>("Action")({
  actionId: S.String,
  properties: S.optional(S.String),
}) {}
export const ActionList = S.Array(Action);
export class Item extends S.Class<Item>("Item")({
  itemId: S.String,
  properties: S.optional(S.String),
}) {}
export const ItemList = S.Array(Item);
export class User extends S.Class<User>("User")({
  userId: S.String,
  properties: S.optional(S.String),
}) {}
export const UserList = S.Array(User);
export class PutActionInteractionsRequest extends S.Class<PutActionInteractionsRequest>(
  "PutActionInteractionsRequest",
)(
  { trackingId: S.String, actionInteractions: ActionInteractionsList },
  T.all(
    T.Http({ method: "POST", uri: "/action-interactions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutActionInteractionsResponse extends S.Class<PutActionInteractionsResponse>(
  "PutActionInteractionsResponse",
)({}) {}
export class PutActionsRequest extends S.Class<PutActionsRequest>(
  "PutActionsRequest",
)(
  { datasetArn: S.String, actions: ActionList },
  T.all(
    T.Http({ method: "POST", uri: "/actions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutActionsResponse extends S.Class<PutActionsResponse>(
  "PutActionsResponse",
)({}) {}
export class PutItemsRequest extends S.Class<PutItemsRequest>(
  "PutItemsRequest",
)(
  { datasetArn: S.String, items: ItemList },
  T.all(
    T.Http({ method: "POST", uri: "/items" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutItemsResponse extends S.Class<PutItemsResponse>(
  "PutItemsResponse",
)({}) {}
export class PutUsersRequest extends S.Class<PutUsersRequest>(
  "PutUsersRequest",
)(
  { datasetArn: S.String, users: UserList },
  T.all(
    T.Http({ method: "POST", uri: "/users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutUsersResponse extends S.Class<PutUsersResponse>(
  "PutUsersResponse",
)({}) {}
export class MetricAttribution extends S.Class<MetricAttribution>(
  "MetricAttribution",
)({ eventAttributionSource: S.String }) {}
export class Event extends S.Class<Event>("Event")({
  eventId: S.optional(S.String),
  eventType: S.String,
  eventValue: S.optional(S.Number),
  itemId: S.optional(S.String),
  properties: S.optional(S.String),
  sentAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  recommendationId: S.optional(S.String),
  impression: S.optional(Impression),
  metricAttribution: S.optional(MetricAttribution),
}) {}
export const EventList = S.Array(Event);
export class PutEventsRequest extends S.Class<PutEventsRequest>(
  "PutEventsRequest",
)(
  {
    trackingId: S.String,
    userId: S.optional(S.String),
    sessionId: S.String,
    eventList: EventList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutEventsResponse extends S.Class<PutEventsResponse>(
  "PutEventsResponse",
)({}) {}

//# Errors
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Records item interaction event data. For more information see
 * Recording item interaction events.
 */
export const putEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putActionInteractions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutActionInteractionsRequest,
    output: PutActionInteractionsResponse,
    errors: [
      InvalidInputException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Adds one or more actions to an Actions dataset. For more information see
 * Importing actions individually.
 */
export const putActions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putItems = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutUsersRequest,
  output: PutUsersResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
