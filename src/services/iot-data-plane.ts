import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "IoT Data Plane",
  serviceShapeName: "IotMoonrakerService",
});
const auth = T.AwsAuthSigv4({ name: "iotdata" });
const ver = T.ServiceVersion("2015-05-28");
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
                        url: "https://data-ats.iot-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "ca-central-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://data.iot-fips.ca-central-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-east-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://data.iot-fips.us-east-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-east-2"],
                        },
                      ],
                      endpoint: {
                        url: "https://data.iot-fips.us-east-2.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://data.iot-fips.us-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-west-2"],
                        },
                      ],
                      endpoint: {
                        url: "https://data.iot-fips.us-west-2.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-east-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://data.iot-fips.us-gov-east-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://data.iot-fips.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://data-ats.iot-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://data-ats.iot.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                { fn: "stringEquals", argv: [{ ref: "Region" }, "cn-north-1"] },
              ],
              endpoint: {
                url: "https://data.ats.iot.cn-north-1.amazonaws.com.cn",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://data-ats.iot.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws-cn",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://data-ats.iot.{Region}.amazonaws.com.cn",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws-us-gov",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://data-ats.iot.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://data-ats.iot.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteConnectionRequest extends S.Class<DeleteConnectionRequest>(
  "DeleteConnectionRequest",
)(
  {
    clientId: S.String.pipe(T.HttpLabel("clientId")),
    cleanSession: S.optional(S.Boolean).pipe(T.HttpQuery("cleanSession")),
    preventWillMessage: S.optional(S.Boolean).pipe(
      T.HttpQuery("preventWillMessage"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/connections/{clientId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectionResponse extends S.Class<DeleteConnectionResponse>(
  "DeleteConnectionResponse",
)({}) {}
export class DeleteThingShadowRequest extends S.Class<DeleteThingShadowRequest>(
  "DeleteThingShadowRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    shadowName: S.optional(S.String).pipe(T.HttpQuery("name")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/things/{thingName}/shadow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRetainedMessageRequest extends S.Class<GetRetainedMessageRequest>(
  "GetRetainedMessageRequest",
)(
  { topic: S.String.pipe(T.HttpLabel("topic")) },
  T.all(
    T.Http({ method: "GET", uri: "/retainedMessage/{topic}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetThingShadowRequest extends S.Class<GetThingShadowRequest>(
  "GetThingShadowRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    shadowName: S.optional(S.String).pipe(T.HttpQuery("name")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/things/{thingName}/shadow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNamedShadowsForThingRequest extends S.Class<ListNamedShadowsForThingRequest>(
  "ListNamedShadowsForThingRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api/things/shadow/ListNamedShadowsForThing/{thingName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRetainedMessagesRequest extends S.Class<ListRetainedMessagesRequest>(
  "ListRetainedMessagesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/retainedMessage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublishRequest extends S.Class<PublishRequest>("PublishRequest")(
  {
    topic: S.String.pipe(T.HttpLabel("topic")),
    qos: S.optional(S.Number).pipe(T.HttpQuery("qos")),
    retain: S.optional(S.Boolean).pipe(T.HttpQuery("retain")),
    payload: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    userProperties: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-mqtt5-user-properties"),
    ),
    payloadFormatIndicator: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-mqtt5-payload-format-indicator"),
    ),
    contentType: S.optional(S.String).pipe(T.HttpQuery("contentType")),
    responseTopic: S.optional(S.String).pipe(T.HttpQuery("responseTopic")),
    correlationData: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-mqtt5-correlation-data"),
    ),
    messageExpiry: S.optional(S.Number).pipe(T.HttpQuery("messageExpiry")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/topics/{topic}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublishResponse extends S.Class<PublishResponse>(
  "PublishResponse",
)({}) {}
export class UpdateThingShadowRequest extends S.Class<UpdateThingShadowRequest>(
  "UpdateThingShadowRequest",
)(
  {
    thingName: S.String.pipe(T.HttpLabel("thingName")),
    shadowName: S.optional(S.String).pipe(T.HttpQuery("name")),
    payload: T.StreamingInput.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/things/{thingName}/shadow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const NamedShadowList = S.Array(S.String);
export class DeleteThingShadowResponse extends S.Class<DeleteThingShadowResponse>(
  "DeleteThingShadowResponse",
)({ payload: T.StreamingOutput.pipe(T.HttpPayload()) }) {}
export class GetRetainedMessageResponse extends S.Class<GetRetainedMessageResponse>(
  "GetRetainedMessageResponse",
)({
  topic: S.optional(S.String),
  payload: S.optional(T.Blob),
  qos: S.optional(S.Number),
  lastModifiedTime: S.optional(S.Number),
  userProperties: S.optional(T.Blob),
}) {}
export class GetThingShadowResponse extends S.Class<GetThingShadowResponse>(
  "GetThingShadowResponse",
)({ payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }) {}
export class ListNamedShadowsForThingResponse extends S.Class<ListNamedShadowsForThingResponse>(
  "ListNamedShadowsForThingResponse",
)({
  results: S.optional(NamedShadowList),
  nextToken: S.optional(S.String),
  timestamp: S.optional(S.Number),
}) {}
export class UpdateThingShadowResponse extends S.Class<UpdateThingShadowResponse>(
  "UpdateThingShadowResponse",
)({ payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }) {}
export class RetainedMessageSummary extends S.Class<RetainedMessageSummary>(
  "RetainedMessageSummary",
)({
  topic: S.optional(S.String),
  payloadSize: S.optional(S.Number),
  qos: S.optional(S.Number),
  lastModifiedTime: S.optional(S.Number),
}) {}
export const RetainedMessageList = S.Array(RetainedMessageSummary);
export class ListRetainedMessagesResponse extends S.Class<ListRetainedMessagesResponse>(
  "ListRetainedMessagesResponse",
)({
  retainedTopics: S.optional(RetainedMessageList),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { message: S.optional(S.String) },
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class MethodNotAllowedException extends S.TaggedError<MethodNotAllowedException>()(
  "MethodNotAllowedException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class RequestEntityTooLargeException extends S.TaggedError<RequestEntityTooLargeException>()(
  "RequestEntityTooLargeException",
  { message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
) {}
export class UnsupportedDocumentEncodingException extends S.TaggedError<UnsupportedDocumentEncodingException>()(
  "UnsupportedDocumentEncodingException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Disconnects a connected MQTT client from Amazon Web Services IoT Core. When you disconnect a client, Amazon Web Services IoT Core closes the client's network connection and optionally cleans the session state.
 */
export const deleteConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: DeleteConnectionResponse,
  errors: [
    ForbiddenException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Publishes an MQTT message.
 *
 * Requires permission to access the Publish action.
 *
 * For more information about MQTT messages, see
 * MQTT Protocol in the
 * IoT Developer Guide.
 *
 * For more information about messaging costs, see Amazon Web Services IoT Core
 * pricing - Messaging.
 */
export const publish = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishRequest,
  output: PublishResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the details of a single retained message for the specified topic.
 *
 * This action returns the message payload of the retained message, which can
 * incur messaging costs. To list only the topic names of the retained messages, call
 * ListRetainedMessages.
 *
 * Requires permission to access the GetRetainedMessage action.
 *
 * For more information about messaging costs, see Amazon Web Services IoT Core
 * pricing - Messaging.
 */
export const getRetainedMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRetainedMessageRequest,
  output: GetRetainedMessageResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the shadows for the specified thing.
 *
 * Requires permission to access the ListNamedShadowsForThing action.
 */
export const listNamedShadowsForThing = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListNamedShadowsForThingRequest,
    output: ListNamedShadowsForThingResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      MethodNotAllowedException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists summary information about the retained messages stored for the account.
 *
 * This action returns only the topic names of the retained messages. It doesn't
 * return any message payloads. Although this action doesn't return a message payload,
 * it can still incur messaging costs.
 *
 * To get the message payload of a retained message, call
 * GetRetainedMessage
 * with the topic name of the retained message.
 *
 * Requires permission to access the ListRetainedMessages action.
 *
 * For more information about messaging costs, see Amazon Web Services IoT Core
 * pricing - Messaging.
 */
export const listRetainedMessages =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRetainedMessagesRequest,
    output: ListRetainedMessagesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      MethodNotAllowedException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "retainedTopics",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Deletes the shadow for the specified thing.
 *
 * Requires permission to access the DeleteThingShadow action.
 *
 * For more information, see DeleteThingShadow in the IoT Developer Guide.
 */
export const deleteThingShadow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThingShadowRequest,
  output: DeleteThingShadowResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    UnsupportedDocumentEncodingException,
  ],
}));
/**
 * Gets the shadow for the specified thing.
 *
 * Requires permission to access the GetThingShadow action.
 *
 * For more information, see GetThingShadow in the
 * IoT Developer Guide.
 */
export const getThingShadow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetThingShadowRequest,
  output: GetThingShadowResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    UnsupportedDocumentEncodingException,
  ],
}));
/**
 * Updates the shadow for the specified thing.
 *
 * Requires permission to access the UpdateThingShadow action.
 *
 * For more information, see UpdateThingShadow in the
 * IoT Developer Guide.
 */
export const updateThingShadow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThingShadowRequest,
  output: UpdateThingShadowResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidRequestException,
    MethodNotAllowedException,
    RequestEntityTooLargeException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    UnsupportedDocumentEncodingException,
  ],
}));
