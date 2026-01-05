import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ivschat",
  serviceShapeName: "AmazonInteractiveVideoServiceChat",
});
const auth = T.AwsAuthSigv4({ name: "ivschat" });
const ver = T.ServiceVersion("2020-07-14");
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
                        url: "https://ivschat-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://ivschat-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://ivschat.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://ivschat.{Region}.{PartitionResult#dnsSuffix}",
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
export const ChatTokenCapabilities = S.Array(S.String);
export const LoggingConfigurationIdentifierList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeleteLoggingConfigurationRequest extends S.Class<DeleteLoggingConfigurationRequest>(
  "DeleteLoggingConfigurationRequest",
)(
  { identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteLoggingConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLoggingConfigurationResponse extends S.Class<DeleteLoggingConfigurationResponse>(
  "DeleteLoggingConfigurationResponse",
)({}) {}
export class DeleteMessageRequest extends S.Class<DeleteMessageRequest>(
  "DeleteMessageRequest",
)(
  { roomIdentifier: S.String, id: S.String, reason: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteMessage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRoomRequest extends S.Class<DeleteRoomRequest>(
  "DeleteRoomRequest",
)(
  { identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteRoom" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRoomResponse extends S.Class<DeleteRoomResponse>(
  "DeleteRoomResponse",
)({}) {}
export class DisconnectUserRequest extends S.Class<DisconnectUserRequest>(
  "DisconnectUserRequest",
)(
  { roomIdentifier: S.String, userId: S.String, reason: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/DisconnectUser" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisconnectUserResponse extends S.Class<DisconnectUserResponse>(
  "DisconnectUserResponse",
)({}) {}
export class GetLoggingConfigurationRequest extends S.Class<GetLoggingConfigurationRequest>(
  "GetLoggingConfigurationRequest",
)(
  { identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetLoggingConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRoomRequest extends S.Class<GetRoomRequest>("GetRoomRequest")(
  { identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetRoom" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLoggingConfigurationsRequest extends S.Class<ListLoggingConfigurationsRequest>(
  "ListLoggingConfigurationsRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/ListLoggingConfigurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRoomsRequest extends S.Class<ListRoomsRequest>(
  "ListRoomsRequest",
)(
  {
    name: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    messageReviewHandlerUri: S.optional(S.String),
    loggingConfigurationIdentifier: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListRooms" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class S3DestinationConfiguration extends S.Class<S3DestinationConfiguration>(
  "S3DestinationConfiguration",
)({ bucketName: S.String }) {}
export class CloudWatchLogsDestinationConfiguration extends S.Class<CloudWatchLogsDestinationConfiguration>(
  "CloudWatchLogsDestinationConfiguration",
)({ logGroupName: S.String }) {}
export class FirehoseDestinationConfiguration extends S.Class<FirehoseDestinationConfiguration>(
  "FirehoseDestinationConfiguration",
)({ deliveryStreamName: S.String }) {}
export const DestinationConfiguration = S.Union(
  S.Struct({ s3: S3DestinationConfiguration }),
  S.Struct({ cloudWatchLogs: CloudWatchLogsDestinationConfiguration }),
  S.Struct({ firehose: FirehoseDestinationConfiguration }),
);
export class UpdateLoggingConfigurationRequest extends S.Class<UpdateLoggingConfigurationRequest>(
  "UpdateLoggingConfigurationRequest",
)(
  {
    identifier: S.String,
    name: S.optional(S.String),
    destinationConfiguration: S.optional(DestinationConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateLoggingConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MessageReviewHandler extends S.Class<MessageReviewHandler>(
  "MessageReviewHandler",
)({ uri: S.optional(S.String), fallbackResult: S.optional(S.String) }) {}
export class UpdateRoomRequest extends S.Class<UpdateRoomRequest>(
  "UpdateRoomRequest",
)(
  {
    identifier: S.String,
    name: S.optional(S.String),
    maximumMessageRatePerSecond: S.optional(S.Number),
    maximumMessageLength: S.optional(S.Number),
    messageReviewHandler: S.optional(MessageReviewHandler),
    loggingConfigurationIdentifiers: S.optional(
      LoggingConfigurationIdentifierList,
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateRoom" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ChatTokenAttributes = S.Record({ key: S.String, value: S.String });
export const EventAttributes = S.Record({ key: S.String, value: S.String });
export class CreateChatTokenRequest extends S.Class<CreateChatTokenRequest>(
  "CreateChatTokenRequest",
)(
  {
    roomIdentifier: S.String,
    userId: S.String,
    capabilities: S.optional(ChatTokenCapabilities),
    sessionDurationInMinutes: S.optional(S.Number),
    attributes: S.optional(ChatTokenAttributes),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateChatToken" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRoomRequest extends S.Class<CreateRoomRequest>(
  "CreateRoomRequest",
)(
  {
    name: S.optional(S.String),
    maximumMessageRatePerSecond: S.optional(S.Number),
    maximumMessageLength: S.optional(S.Number),
    messageReviewHandler: S.optional(MessageReviewHandler),
    tags: S.optional(Tags),
    loggingConfigurationIdentifiers: S.optional(
      LoggingConfigurationIdentifierList,
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateRoom" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMessageResponse extends S.Class<DeleteMessageResponse>(
  "DeleteMessageResponse",
)({ id: S.optional(S.String) }) {}
export class GetLoggingConfigurationResponse extends S.Class<GetLoggingConfigurationResponse>(
  "GetLoggingConfigurationResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.optional(S.String),
  destinationConfiguration: S.optional(DestinationConfiguration),
  state: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class GetRoomResponse extends S.Class<GetRoomResponse>(
  "GetRoomResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  maximumMessageRatePerSecond: S.optional(S.Number),
  maximumMessageLength: S.optional(S.Number),
  messageReviewHandler: S.optional(MessageReviewHandler),
  tags: S.optional(Tags),
  loggingConfigurationIdentifiers: S.optional(
    LoggingConfigurationIdentifierList,
  ),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: Tags }) {}
export class SendEventRequest extends S.Class<SendEventRequest>(
  "SendEventRequest",
)(
  {
    roomIdentifier: S.String,
    eventName: S.String,
    attributes: S.optional(EventAttributes),
  },
  T.all(
    T.Http({ method: "POST", uri: "/SendEvent" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLoggingConfigurationResponse extends S.Class<UpdateLoggingConfigurationResponse>(
  "UpdateLoggingConfigurationResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.optional(S.String),
  destinationConfiguration: S.optional(DestinationConfiguration),
  state: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class UpdateRoomResponse extends S.Class<UpdateRoomResponse>(
  "UpdateRoomResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  maximumMessageRatePerSecond: S.optional(S.Number),
  maximumMessageLength: S.optional(S.Number),
  messageReviewHandler: S.optional(MessageReviewHandler),
  tags: S.optional(Tags),
  loggingConfigurationIdentifiers: S.optional(
    LoggingConfigurationIdentifierList,
  ),
}) {}
export class LoggingConfigurationSummary extends S.Class<LoggingConfigurationSummary>(
  "LoggingConfigurationSummary",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.optional(S.String),
  destinationConfiguration: S.optional(DestinationConfiguration),
  state: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export const LoggingConfigurationList = S.Array(LoggingConfigurationSummary);
export class RoomSummary extends S.Class<RoomSummary>("RoomSummary")({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  messageReviewHandler: S.optional(MessageReviewHandler),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(Tags),
  loggingConfigurationIdentifiers: S.optional(
    LoggingConfigurationIdentifierList,
  ),
}) {}
export const RoomList = S.Array(RoomSummary);
export class CreateChatTokenResponse extends S.Class<CreateChatTokenResponse>(
  "CreateChatTokenResponse",
)({
  token: S.optional(S.String),
  tokenExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  sessionExpirationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class CreateLoggingConfigurationRequest extends S.Class<CreateLoggingConfigurationRequest>(
  "CreateLoggingConfigurationRequest",
)(
  {
    name: S.optional(S.String),
    destinationConfiguration: DestinationConfiguration,
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateLoggingConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRoomResponse extends S.Class<CreateRoomResponse>(
  "CreateRoomResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  maximumMessageRatePerSecond: S.optional(S.Number),
  maximumMessageLength: S.optional(S.Number),
  messageReviewHandler: S.optional(MessageReviewHandler),
  tags: S.optional(Tags),
  loggingConfigurationIdentifiers: S.optional(
    LoggingConfigurationIdentifierList,
  ),
}) {}
export class ListLoggingConfigurationsResponse extends S.Class<ListLoggingConfigurationsResponse>(
  "ListLoggingConfigurationsResponse",
)({
  loggingConfigurations: LoggingConfigurationList,
  nextToken: S.optional(S.String),
}) {}
export class ListRoomsResponse extends S.Class<ListRoomsResponse>(
  "ListRoomsResponse",
)({ rooms: RoomList, nextToken: S.optional(S.String) }) {}
export class SendEventResponse extends S.Class<SendEventResponse>(
  "SendEventResponse",
)({ id: S.optional(S.String) }) {}
export class CreateLoggingConfigurationResponse extends S.Class<CreateLoggingConfigurationResponse>(
  "CreateLoggingConfigurationResponse",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  name: S.optional(S.String),
  destinationConfiguration: S.optional(DestinationConfiguration),
  state: S.optional(S.String),
  tags: S.optional(Tags),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class PendingVerification extends S.TaggedError<PendingVerification>()(
  "PendingVerification",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    limit: S.Number,
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    limit: S.Number,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Gets the specified logging configuration.
 */
export const getLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLoggingConfigurationRequest,
    output: GetLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Gets summary information about all your logging configurations in the AWS region where
 * the API request is processed.
 */
export const listLoggingConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLoggingConfigurationsRequest,
    output: ListLoggingConfigurationsResponse,
    errors: [AccessDeniedException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets summary information about all your rooms in the AWS region where the API request is
 * processed. Results are sorted in descending order of `updateTime`.
 */
export const listRooms = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRoomsRequest,
  output: ListRoomsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a specified logging configuration.
 */
export const updateLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLoggingConfigurationRequest,
    output: UpdateLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      PendingVerification,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a room’s configuration.
 */
export const updateRoom = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRoomRequest,
  output: UpdateRoomResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified room.
 */
export const deleteRoom = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRoomRequest,
  output: DeleteRoomResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an encrypted token that is used by a chat participant to establish an individual
 * WebSocket chat connection to a room. When the token is used to connect to chat, the
 * connection is valid for the session duration specified in the request. The token becomes
 * invalid at the token-expiration timestamp included in the response.
 *
 * Use the `capabilities` field to permit an end user to send messages or
 * moderate a room.
 *
 * The `attributes` field securely attaches structured data to the chat session; the data is
 * included within each message sent by the end user and received by other participants in the
 * room. Common use cases for attributes include passing end-user profile data like an icon,
 * display name, colors, badges, and other display features.
 *
 * Encryption keys are owned by Amazon IVS Chat and never used directly by your
 * application.
 */
export const createChatToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChatTokenRequest,
  output: CreateChatTokenResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified logging configuration.
 */
export const deleteLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLoggingConfigurationRequest,
    output: DeleteLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      PendingVerification,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the specified room.
 */
export const getRoom = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRoomRequest,
  output: GetRoomResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds or updates tags for the AWS resource with the specified ARN.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes tags from the resource with the specified ARN.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information about AWS tags for the specified ARN.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Sends an event to a room. Use this within your application’s business logic to send
 * events to clients of a room; e.g., to notify clients to change the way the chat UI is
 * rendered.
 */
export const sendEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendEventRequest,
  output: SendEventResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a room that allows clients to connect and pass messages.
 */
export const createRoom = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRoomRequest,
  output: CreateRoomResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Disconnects all connections using a specified user ID from a room. This replicates the
 *
 * DisconnectUser WebSocket operation in the Amazon IVS Chat Messaging API.
 */
export const disconnectUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisconnectUserRequest,
  output: DisconnectUserResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends an event to a specific room which directs clients to delete a specific message;
 * that is, unrender it from view and delete it from the client’s chat history. This event’s
 * `EventName` is `aws:DELETE_MESSAGE`. This replicates the
 * DeleteMessage WebSocket operation in the Amazon IVS Chat Messaging API.
 */
export const deleteMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMessageRequest,
  output: DeleteMessageResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a logging configuration that allows clients to store and record sent
 * messages.
 */
export const createLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLoggingConfigurationRequest,
    output: CreateLoggingConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      PendingVerification,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
