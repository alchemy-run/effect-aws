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
  sdkId: "ivschat",
  serviceShapeName: "AmazonInteractiveVideoServiceChat",
});
const auth = T.AwsAuthSigv4({ name: "ivschat" });
const ver = T.ServiceVersion("2020-07-14");
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
              `https://ivschat-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://ivschat-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ivschat.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ivschat.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type RoomIdentifier = string;
export type UserID = string | Redacted.Redacted<string>;
export type ChatTokenCapability = string;
export type SessionDurationInMinutes = number;
export type LoggingConfigurationName = string;
export type RoomName = string;
export type RoomMaxMessageRatePerSecond = number;
export type RoomMaxMessageLength = number;
export type LoggingConfigurationIdentifier = string;
export type MessageID = string;
export type Reason = string;
export type PaginationToken = string;
export type MaxLoggingConfigurationResults = number;
export type MaxRoomResults = number;
export type LambdaArn = string;
export type ResourceArn = string;
export type EventName = string;
export type TagKey = string;
export type TagValue = string;
export type FallbackResult = string;
export type ErrorMessage = string;
export type ID = string;
export type LoggingConfigurationArn = string;
export type LoggingConfigurationID = string;
export type LoggingConfigurationState = string;
export type RoomArn = string;
export type RoomID = string;
export type UpdateLoggingConfigurationState = string;
export type BucketName = string;
export type LogGroupName = string;
export type DeliveryStreamName = string;
export type ChatToken = string | Redacted.Redacted<string>;
export type ResourceId = string;
export type ResourceType = string;
export type CreateLoggingConfigurationState = string;
export type ValidationExceptionReason = string;
export type Limit = number;
export type FieldName = string;

//# Schemas
export type ChatTokenCapabilities = string[];
export const ChatTokenCapabilities = S.Array(S.String);
export type LoggingConfigurationIdentifierList = string[];
export const LoggingConfigurationIdentifierList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteLoggingConfigurationRequest {
  identifier: string;
}
export const DeleteLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteLoggingConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLoggingConfigurationRequest",
}) as any as S.Schema<DeleteLoggingConfigurationRequest>;
export interface DeleteLoggingConfigurationResponse {}
export const DeleteLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLoggingConfigurationResponse",
}) as any as S.Schema<DeleteLoggingConfigurationResponse>;
export interface DeleteMessageRequest {
  roomIdentifier: string;
  id: string;
  reason?: string;
}
export const DeleteMessageRequest = S.suspend(() =>
  S.Struct({
    roomIdentifier: S.String,
    id: S.String,
    reason: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteMessage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMessageRequest",
}) as any as S.Schema<DeleteMessageRequest>;
export interface DeleteRoomRequest {
  identifier: string;
}
export const DeleteRoomRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteRoom" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRoomRequest",
}) as any as S.Schema<DeleteRoomRequest>;
export interface DeleteRoomResponse {}
export const DeleteRoomResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteRoomResponse",
}) as any as S.Schema<DeleteRoomResponse>;
export interface DisconnectUserRequest {
  roomIdentifier: string;
  userId: string | Redacted.Redacted<string>;
  reason?: string;
}
export const DisconnectUserRequest = S.suspend(() =>
  S.Struct({
    roomIdentifier: S.String,
    userId: SensitiveString,
    reason: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DisconnectUser" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisconnectUserRequest",
}) as any as S.Schema<DisconnectUserRequest>;
export interface DisconnectUserResponse {}
export const DisconnectUserResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DisconnectUserResponse" },
) as any as S.Schema<DisconnectUserResponse>;
export interface GetLoggingConfigurationRequest {
  identifier: string;
}
export const GetLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetLoggingConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLoggingConfigurationRequest",
}) as any as S.Schema<GetLoggingConfigurationRequest>;
export interface GetRoomRequest {
  identifier: string;
}
export const GetRoomRequest = S.suspend(() =>
  S.Struct({ identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetRoom" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRoomRequest",
}) as any as S.Schema<GetRoomRequest>;
export interface ListLoggingConfigurationsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListLoggingConfigurationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListLoggingConfigurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLoggingConfigurationsRequest",
}) as any as S.Schema<ListLoggingConfigurationsRequest>;
export interface ListRoomsRequest {
  name?: string;
  nextToken?: string;
  maxResults?: number;
  messageReviewHandlerUri?: string;
  loggingConfigurationIdentifier?: string;
}
export const ListRoomsRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    messageReviewHandlerUri: S.optional(S.String),
    loggingConfigurationIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListRooms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRoomsRequest",
}) as any as S.Schema<ListRoomsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface S3DestinationConfiguration {
  bucketName: string;
}
export const S3DestinationConfiguration = S.suspend(() =>
  S.Struct({ bucketName: S.String }),
).annotations({
  identifier: "S3DestinationConfiguration",
}) as any as S.Schema<S3DestinationConfiguration>;
export interface CloudWatchLogsDestinationConfiguration {
  logGroupName: string;
}
export const CloudWatchLogsDestinationConfiguration = S.suspend(() =>
  S.Struct({ logGroupName: S.String }),
).annotations({
  identifier: "CloudWatchLogsDestinationConfiguration",
}) as any as S.Schema<CloudWatchLogsDestinationConfiguration>;
export interface FirehoseDestinationConfiguration {
  deliveryStreamName: string;
}
export const FirehoseDestinationConfiguration = S.suspend(() =>
  S.Struct({ deliveryStreamName: S.String }),
).annotations({
  identifier: "FirehoseDestinationConfiguration",
}) as any as S.Schema<FirehoseDestinationConfiguration>;
export type DestinationConfiguration =
  | { s3: S3DestinationConfiguration }
  | { cloudWatchLogs: CloudWatchLogsDestinationConfiguration }
  | { firehose: FirehoseDestinationConfiguration };
export const DestinationConfiguration = S.Union(
  S.Struct({ s3: S3DestinationConfiguration }),
  S.Struct({ cloudWatchLogs: CloudWatchLogsDestinationConfiguration }),
  S.Struct({ firehose: FirehoseDestinationConfiguration }),
);
export interface UpdateLoggingConfigurationRequest {
  identifier: string;
  name?: string;
  destinationConfiguration?: (typeof DestinationConfiguration)["Type"];
}
export const UpdateLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    name: S.optional(S.String),
    destinationConfiguration: S.optional(DestinationConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateLoggingConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLoggingConfigurationRequest",
}) as any as S.Schema<UpdateLoggingConfigurationRequest>;
export interface MessageReviewHandler {
  uri?: string;
  fallbackResult?: string;
}
export const MessageReviewHandler = S.suspend(() =>
  S.Struct({ uri: S.optional(S.String), fallbackResult: S.optional(S.String) }),
).annotations({
  identifier: "MessageReviewHandler",
}) as any as S.Schema<MessageReviewHandler>;
export interface UpdateRoomRequest {
  identifier: string;
  name?: string;
  maximumMessageRatePerSecond?: number;
  maximumMessageLength?: number;
  messageReviewHandler?: MessageReviewHandler;
  loggingConfigurationIdentifiers?: LoggingConfigurationIdentifierList;
}
export const UpdateRoomRequest = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    name: S.optional(S.String),
    maximumMessageRatePerSecond: S.optional(S.Number),
    maximumMessageLength: S.optional(S.Number),
    messageReviewHandler: S.optional(MessageReviewHandler),
    loggingConfigurationIdentifiers: S.optional(
      LoggingConfigurationIdentifierList,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateRoom" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRoomRequest",
}) as any as S.Schema<UpdateRoomRequest>;
export type ChatTokenAttributes = { [key: string]: string };
export const ChatTokenAttributes = S.Record({ key: S.String, value: S.String });
export type EventAttributes = { [key: string]: string };
export const EventAttributes = S.Record({ key: S.String, value: S.String });
export interface CreateChatTokenRequest {
  roomIdentifier: string;
  userId: string | Redacted.Redacted<string>;
  capabilities?: ChatTokenCapabilities;
  sessionDurationInMinutes?: number;
  attributes?: ChatTokenAttributes;
}
export const CreateChatTokenRequest = S.suspend(() =>
  S.Struct({
    roomIdentifier: S.String,
    userId: SensitiveString,
    capabilities: S.optional(ChatTokenCapabilities),
    sessionDurationInMinutes: S.optional(S.Number),
    attributes: S.optional(ChatTokenAttributes),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateChatToken" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChatTokenRequest",
}) as any as S.Schema<CreateChatTokenRequest>;
export interface CreateRoomRequest {
  name?: string;
  maximumMessageRatePerSecond?: number;
  maximumMessageLength?: number;
  messageReviewHandler?: MessageReviewHandler;
  tags?: Tags;
  loggingConfigurationIdentifiers?: LoggingConfigurationIdentifierList;
}
export const CreateRoomRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    maximumMessageRatePerSecond: S.optional(S.Number),
    maximumMessageLength: S.optional(S.Number),
    messageReviewHandler: S.optional(MessageReviewHandler),
    tags: S.optional(Tags),
    loggingConfigurationIdentifiers: S.optional(
      LoggingConfigurationIdentifierList,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateRoom" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRoomRequest",
}) as any as S.Schema<CreateRoomRequest>;
export interface DeleteMessageResponse {
  id?: string;
}
export const DeleteMessageResponse = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }),
).annotations({
  identifier: "DeleteMessageResponse",
}) as any as S.Schema<DeleteMessageResponse>;
export interface GetLoggingConfigurationResponse {
  arn?: string;
  id?: string;
  createTime?: Date;
  updateTime?: Date;
  name?: string;
  destinationConfiguration?: (typeof DestinationConfiguration)["Type"];
  state?: string;
  tags?: Tags;
}
export const GetLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: S.optional(S.String),
    destinationConfiguration: S.optional(DestinationConfiguration),
    state: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "GetLoggingConfigurationResponse",
}) as any as S.Schema<GetLoggingConfigurationResponse>;
export interface GetRoomResponse {
  arn?: string;
  id?: string;
  name?: string;
  createTime?: Date;
  updateTime?: Date;
  maximumMessageRatePerSecond?: number;
  maximumMessageLength?: number;
  messageReviewHandler?: MessageReviewHandler;
  tags?: Tags;
  loggingConfigurationIdentifiers?: LoggingConfigurationIdentifierList;
}
export const GetRoomResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetRoomResponse",
}) as any as S.Schema<GetRoomResponse>;
export interface ListTagsForResourceResponse {
  tags: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: Tags }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface SendEventRequest {
  roomIdentifier: string;
  eventName: string;
  attributes?: EventAttributes;
}
export const SendEventRequest = S.suspend(() =>
  S.Struct({
    roomIdentifier: S.String,
    eventName: S.String,
    attributes: S.optional(EventAttributes),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/SendEvent" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendEventRequest",
}) as any as S.Schema<SendEventRequest>;
export interface UpdateLoggingConfigurationResponse {
  arn?: string;
  id?: string;
  createTime?: Date;
  updateTime?: Date;
  name?: string;
  destinationConfiguration?: (typeof DestinationConfiguration)["Type"];
  state?: string;
  tags?: Tags;
}
export const UpdateLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: S.optional(S.String),
    destinationConfiguration: S.optional(DestinationConfiguration),
    state: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "UpdateLoggingConfigurationResponse",
}) as any as S.Schema<UpdateLoggingConfigurationResponse>;
export interface UpdateRoomResponse {
  arn?: string;
  id?: string;
  name?: string;
  createTime?: Date;
  updateTime?: Date;
  maximumMessageRatePerSecond?: number;
  maximumMessageLength?: number;
  messageReviewHandler?: MessageReviewHandler;
  tags?: Tags;
  loggingConfigurationIdentifiers?: LoggingConfigurationIdentifierList;
}
export const UpdateRoomResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "UpdateRoomResponse",
}) as any as S.Schema<UpdateRoomResponse>;
export interface LoggingConfigurationSummary {
  arn?: string;
  id?: string;
  createTime?: Date;
  updateTime?: Date;
  name?: string;
  destinationConfiguration?: (typeof DestinationConfiguration)["Type"];
  state?: string;
  tags?: Tags;
}
export const LoggingConfigurationSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: S.optional(S.String),
    destinationConfiguration: S.optional(DestinationConfiguration),
    state: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "LoggingConfigurationSummary",
}) as any as S.Schema<LoggingConfigurationSummary>;
export type LoggingConfigurationList = LoggingConfigurationSummary[];
export const LoggingConfigurationList = S.Array(LoggingConfigurationSummary);
export interface RoomSummary {
  arn?: string;
  id?: string;
  name?: string;
  messageReviewHandler?: MessageReviewHandler;
  createTime?: Date;
  updateTime?: Date;
  tags?: Tags;
  loggingConfigurationIdentifiers?: LoggingConfigurationIdentifierList;
}
export const RoomSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "RoomSummary" }) as any as S.Schema<RoomSummary>;
export type RoomList = RoomSummary[];
export const RoomList = S.Array(RoomSummary);
export interface CreateChatTokenResponse {
  token?: string | Redacted.Redacted<string>;
  tokenExpirationTime?: Date;
  sessionExpirationTime?: Date;
}
export const CreateChatTokenResponse = S.suspend(() =>
  S.Struct({
    token: S.optional(SensitiveString),
    tokenExpirationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    sessionExpirationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "CreateChatTokenResponse",
}) as any as S.Schema<CreateChatTokenResponse>;
export interface CreateLoggingConfigurationRequest {
  name?: string;
  destinationConfiguration: (typeof DestinationConfiguration)["Type"];
  tags?: Tags;
}
export const CreateLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    destinationConfiguration: DestinationConfiguration,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateLoggingConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLoggingConfigurationRequest",
}) as any as S.Schema<CreateLoggingConfigurationRequest>;
export interface CreateRoomResponse {
  arn?: string;
  id?: string;
  name?: string;
  createTime?: Date;
  updateTime?: Date;
  maximumMessageRatePerSecond?: number;
  maximumMessageLength?: number;
  messageReviewHandler?: MessageReviewHandler;
  tags?: Tags;
  loggingConfigurationIdentifiers?: LoggingConfigurationIdentifierList;
}
export const CreateRoomResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "CreateRoomResponse",
}) as any as S.Schema<CreateRoomResponse>;
export interface ListLoggingConfigurationsResponse {
  loggingConfigurations: LoggingConfigurationList;
  nextToken?: string;
}
export const ListLoggingConfigurationsResponse = S.suspend(() =>
  S.Struct({
    loggingConfigurations: LoggingConfigurationList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLoggingConfigurationsResponse",
}) as any as S.Schema<ListLoggingConfigurationsResponse>;
export interface ListRoomsResponse {
  rooms: RoomList;
  nextToken?: string;
}
export const ListRoomsResponse = S.suspend(() =>
  S.Struct({ rooms: RoomList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListRoomsResponse",
}) as any as S.Schema<ListRoomsResponse>;
export interface SendEventResponse {
  id?: string;
}
export const SendEventResponse = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }),
).annotations({
  identifier: "SendEventResponse",
}) as any as S.Schema<SendEventResponse>;
export interface CreateLoggingConfigurationResponse {
  arn?: string;
  id?: string;
  createTime?: Date;
  updateTime?: Date;
  name?: string;
  destinationConfiguration?: (typeof DestinationConfiguration)["Type"];
  state?: string;
  tags?: Tags;
}
export const CreateLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    createTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    name: S.optional(S.String),
    destinationConfiguration: S.optional(DestinationConfiguration),
    state: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "CreateLoggingConfigurationResponse",
}) as any as S.Schema<CreateLoggingConfigurationResponse>;
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
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class PendingVerification extends S.TaggedError<PendingVerification>()(
  "PendingVerification",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    limit: S.Number,
  },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    limit: S.Number,
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Gets the specified logging configuration.
 */
export const getLoggingConfiguration: (
  input: GetLoggingConfigurationRequest,
) => Effect.Effect<
  GetLoggingConfigurationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoggingConfigurationRequest,
  output: GetLoggingConfigurationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets summary information about all your logging configurations in the AWS region where
 * the API request is processed.
 */
export const listLoggingConfigurations: {
  (
    input: ListLoggingConfigurationsRequest,
  ): Effect.Effect<
    ListLoggingConfigurationsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLoggingConfigurationsRequest,
  ) => Stream.Stream<
    ListLoggingConfigurationsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLoggingConfigurationsRequest,
  ) => Stream.Stream<
    unknown,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listRooms: {
  (
    input: ListRoomsRequest,
  ): Effect.Effect<
    ListRoomsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRoomsRequest,
  ) => Stream.Stream<
    ListRoomsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRoomsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateLoggingConfiguration: (
  input: UpdateLoggingConfigurationRequest,
) => Effect.Effect<
  UpdateLoggingConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLoggingConfigurationRequest,
  output: UpdateLoggingConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a room’s configuration.
 */
export const updateRoom: (
  input: UpdateRoomRequest,
) => Effect.Effect<
  UpdateRoomResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRoom: (
  input: DeleteRoomRequest,
) => Effect.Effect<
  DeleteRoomResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createChatToken: (
  input: CreateChatTokenRequest,
) => Effect.Effect<
  CreateChatTokenResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteLoggingConfiguration: (
  input: DeleteLoggingConfigurationRequest,
) => Effect.Effect<
  DeleteLoggingConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLoggingConfigurationRequest,
  output: DeleteLoggingConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the specified room.
 */
export const getRoom: (
  input: GetRoomRequest,
) => Effect.Effect<
  GetRoomResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const sendEvent: (
  input: SendEventRequest,
) => Effect.Effect<
  SendEventResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRoom: (
  input: CreateRoomRequest,
) => Effect.Effect<
  CreateRoomResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disconnectUser: (
  input: DisconnectUserRequest,
) => Effect.Effect<
  DisconnectUserResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMessage: (
  input: DeleteMessageRequest,
) => Effect.Effect<
  DeleteMessageResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLoggingConfiguration: (
  input: CreateLoggingConfigurationRequest,
) => Effect.Effect<
  CreateLoggingConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
