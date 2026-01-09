import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "ConnectParticipant",
  serviceShapeName: "AmazonConnectParticipantServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "execute-api" });
const ver = T.ServiceVersion("2018-09-07");
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
              `https://participant.connect-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://participant.connect.${Region}.amazonaws.com`);
            }
            return e(
              `https://participant.connect-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://participant.connect.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://participant.connect.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type SessionId = string;
export type ParticipantToken = string;
export type ArtifactId = string;
export type NonEmptyClientToken = string;
export type ViewToken = string;
export type ClientToken = string;
export type URLExpiryInSeconds = number;
export type RedirectURI = string;
export type ContactId = string;
export type MaxResults = number;
export type NextToken = string;
export type ChatContentType = string;
export type ChatContent = string;
export type ContentType = string;
export type AttachmentSizeInBytes = number;
export type AttachmentName = string;
export type ChatItemId = string;
export type Instant = string;
export type MostRecent = number;
export type Message = string;
export type PreSignedAttachmentUrl = string;
export type ISO8601Datetime = string;
export type AuthenticationUrl = string;
export type PreSignedConnectionUrl = string;
export type ViewId = string;
export type ARN = string;
export type ViewName = string | redacted.Redacted<string>;
export type ViewVersion = number;
export type UploadMetadataUrl = string;
export type Reason = string;
export type AttendeeId = string;
export type JoinToken = string | redacted.Redacted<string>;
export type GuidString = string;
export type ViewInputSchema = string | redacted.Redacted<string>;
export type ViewTemplate = string | redacted.Redacted<string>;
export type ViewAction = string | redacted.Redacted<string>;
export type UploadMetadataSignedHeadersKey = string;
export type UploadMetadataSignedHeadersValue = string;
export type ParticipantId = string;
export type DisplayName = string;
export type URI = string;
export type ResourceId = string;

//# Schemas
export type AttachmentIdList = string[];
export const AttachmentIdList = S.Array(S.String);
export type ConnectionType =
  | "WEBSOCKET"
  | "CONNECTION_CREDENTIALS"
  | "WEBRTC_CONNECTION"
  | (string & {});
export const ConnectionType = S.String;
export type ConnectionTypeList = ConnectionType[];
export const ConnectionTypeList = S.Array(ConnectionType);
export type ScanDirection = "FORWARD" | "BACKWARD" | (string & {});
export const ScanDirection = S.String;
export type SortKey = "DESCENDING" | "ASCENDING" | (string & {});
export const SortKey = S.String;
export interface CancelParticipantAuthenticationRequest {
  SessionId: string;
  ConnectionToken: string;
}
export const CancelParticipantAuthenticationRequest = S.suspend(() =>
  S.Struct({
    SessionId: S.String,
    ConnectionToken: S.String.pipe(T.HttpHeader("X-Amz-Bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/participant/cancel-authentication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelParticipantAuthenticationRequest",
}) as any as S.Schema<CancelParticipantAuthenticationRequest>;
export interface CancelParticipantAuthenticationResponse {}
export const CancelParticipantAuthenticationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelParticipantAuthenticationResponse",
}) as any as S.Schema<CancelParticipantAuthenticationResponse>;
export interface CompleteAttachmentUploadRequest {
  AttachmentIds: string[];
  ClientToken: string;
  ConnectionToken: string;
}
export const CompleteAttachmentUploadRequest = S.suspend(() =>
  S.Struct({
    AttachmentIds: AttachmentIdList,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    ConnectionToken: S.String.pipe(T.HttpHeader("X-Amz-Bearer")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/participant/complete-attachment-upload",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CompleteAttachmentUploadRequest",
}) as any as S.Schema<CompleteAttachmentUploadRequest>;
export interface CompleteAttachmentUploadResponse {}
export const CompleteAttachmentUploadResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CompleteAttachmentUploadResponse",
}) as any as S.Schema<CompleteAttachmentUploadResponse>;
export interface CreateParticipantConnectionRequest {
  Type?: ConnectionType[];
  ParticipantToken: string;
  ConnectParticipant?: boolean;
}
export const CreateParticipantConnectionRequest = S.suspend(() =>
  S.Struct({
    Type: S.optional(ConnectionTypeList),
    ParticipantToken: S.String.pipe(T.HttpHeader("X-Amz-Bearer")),
    ConnectParticipant: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/participant/connection" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateParticipantConnectionRequest",
}) as any as S.Schema<CreateParticipantConnectionRequest>;
export interface DescribeViewRequest {
  ViewToken: string;
  ConnectionToken: string;
}
export const DescribeViewRequest = S.suspend(() =>
  S.Struct({
    ViewToken: S.String.pipe(T.HttpLabel("ViewToken")),
    ConnectionToken: S.String.pipe(T.HttpHeader("X-Amz-Bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/participant/views/{ViewToken}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeViewRequest",
}) as any as S.Schema<DescribeViewRequest>;
export interface DisconnectParticipantRequest {
  ClientToken?: string;
  ConnectionToken: string;
}
export const DisconnectParticipantRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ConnectionToken: S.String.pipe(T.HttpHeader("X-Amz-Bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/participant/disconnect" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisconnectParticipantRequest",
}) as any as S.Schema<DisconnectParticipantRequest>;
export interface DisconnectParticipantResponse {}
export const DisconnectParticipantResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisconnectParticipantResponse",
}) as any as S.Schema<DisconnectParticipantResponse>;
export interface GetAttachmentRequest {
  AttachmentId: string;
  ConnectionToken: string;
  UrlExpiryInSeconds?: number;
}
export const GetAttachmentRequest = S.suspend(() =>
  S.Struct({
    AttachmentId: S.String,
    ConnectionToken: S.String.pipe(T.HttpHeader("X-Amz-Bearer")),
    UrlExpiryInSeconds: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/participant/attachment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAttachmentRequest",
}) as any as S.Schema<GetAttachmentRequest>;
export interface GetAuthenticationUrlRequest {
  SessionId: string;
  RedirectUri: string;
  ConnectionToken: string;
}
export const GetAuthenticationUrlRequest = S.suspend(() =>
  S.Struct({
    SessionId: S.String,
    RedirectUri: S.String,
    ConnectionToken: S.String.pipe(T.HttpHeader("X-Amz-Bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/participant/authentication-url" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAuthenticationUrlRequest",
}) as any as S.Schema<GetAuthenticationUrlRequest>;
export interface SendEventRequest {
  ContentType: string;
  Content?: string;
  ClientToken?: string;
  ConnectionToken: string;
}
export const SendEventRequest = S.suspend(() =>
  S.Struct({
    ContentType: S.String,
    Content: S.optional(S.String),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ConnectionToken: S.String.pipe(T.HttpHeader("X-Amz-Bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/participant/event" }),
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
export interface SendMessageRequest {
  ContentType: string;
  Content: string;
  ClientToken?: string;
  ConnectionToken: string;
}
export const SendMessageRequest = S.suspend(() =>
  S.Struct({
    ContentType: S.String,
    Content: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ConnectionToken: S.String.pipe(T.HttpHeader("X-Amz-Bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/participant/message" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendMessageRequest",
}) as any as S.Schema<SendMessageRequest>;
export interface StartAttachmentUploadRequest {
  ContentType: string;
  AttachmentSizeInBytes: number;
  AttachmentName: string;
  ClientToken: string;
  ConnectionToken: string;
}
export const StartAttachmentUploadRequest = S.suspend(() =>
  S.Struct({
    ContentType: S.String,
    AttachmentSizeInBytes: S.Number,
    AttachmentName: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    ConnectionToken: S.String.pipe(T.HttpHeader("X-Amz-Bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/participant/start-attachment-upload" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAttachmentUploadRequest",
}) as any as S.Schema<StartAttachmentUploadRequest>;
export interface StartPosition {
  Id?: string;
  AbsoluteTime?: string;
  MostRecent?: number;
}
export const StartPosition = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    AbsoluteTime: S.optional(S.String),
    MostRecent: S.optional(S.Number),
  }),
).annotations({
  identifier: "StartPosition",
}) as any as S.Schema<StartPosition>;
export interface GetAttachmentResponse {
  Url?: string;
  UrlExpiry?: string;
  AttachmentSizeInBytes: number;
}
export const GetAttachmentResponse = S.suspend(() =>
  S.Struct({
    Url: S.optional(S.String),
    UrlExpiry: S.optional(S.String),
    AttachmentSizeInBytes: S.Number,
  }),
).annotations({
  identifier: "GetAttachmentResponse",
}) as any as S.Schema<GetAttachmentResponse>;
export interface GetAuthenticationUrlResponse {
  AuthenticationUrl?: string;
}
export const GetAuthenticationUrlResponse = S.suspend(() =>
  S.Struct({ AuthenticationUrl: S.optional(S.String) }),
).annotations({
  identifier: "GetAuthenticationUrlResponse",
}) as any as S.Schema<GetAuthenticationUrlResponse>;
export interface GetTranscriptRequest {
  ContactId?: string;
  MaxResults?: number;
  NextToken?: string;
  ScanDirection?: ScanDirection;
  SortOrder?: SortKey;
  StartPosition?: StartPosition;
  ConnectionToken: string;
}
export const GetTranscriptRequest = S.suspend(() =>
  S.Struct({
    ContactId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ScanDirection: S.optional(ScanDirection),
    SortOrder: S.optional(SortKey),
    StartPosition: S.optional(StartPosition),
    ConnectionToken: S.String.pipe(T.HttpHeader("X-Amz-Bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/participant/transcript" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTranscriptRequest",
}) as any as S.Schema<GetTranscriptRequest>;
export interface SendEventResponse {
  Id?: string;
  AbsoluteTime?: string;
}
export const SendEventResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), AbsoluteTime: S.optional(S.String) }),
).annotations({
  identifier: "SendEventResponse",
}) as any as S.Schema<SendEventResponse>;
export type MessageProcessingStatus =
  | "PROCESSING"
  | "FAILED"
  | "REJECTED"
  | (string & {});
export const MessageProcessingStatus = S.String;
export interface Websocket {
  Url?: string;
  ConnectionExpiry?: string;
}
export const Websocket = S.suspend(() =>
  S.Struct({
    Url: S.optional(S.String),
    ConnectionExpiry: S.optional(S.String),
  }),
).annotations({ identifier: "Websocket" }) as any as S.Schema<Websocket>;
export interface ConnectionCredentials {
  ConnectionToken?: string;
  Expiry?: string;
}
export const ConnectionCredentials = S.suspend(() =>
  S.Struct({
    ConnectionToken: S.optional(S.String),
    Expiry: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectionCredentials",
}) as any as S.Schema<ConnectionCredentials>;
export interface MessageProcessingMetadata {
  MessageProcessingStatus?: MessageProcessingStatus;
}
export const MessageProcessingMetadata = S.suspend(() =>
  S.Struct({ MessageProcessingStatus: S.optional(MessageProcessingStatus) }),
).annotations({
  identifier: "MessageProcessingMetadata",
}) as any as S.Schema<MessageProcessingMetadata>;
export type ViewActions = string | redacted.Redacted<string>[];
export const ViewActions = S.Array(SensitiveString);
export interface SendMessageResponse {
  Id?: string;
  AbsoluteTime?: string;
  MessageMetadata?: MessageProcessingMetadata;
}
export const SendMessageResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    AbsoluteTime: S.optional(S.String),
    MessageMetadata: S.optional(MessageProcessingMetadata),
  }),
).annotations({
  identifier: "SendMessageResponse",
}) as any as S.Schema<SendMessageResponse>;
export interface Attendee {
  AttendeeId?: string;
  JoinToken?: string | redacted.Redacted<string>;
}
export const Attendee = S.suspend(() =>
  S.Struct({
    AttendeeId: S.optional(S.String),
    JoinToken: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Attendee" }) as any as S.Schema<Attendee>;
export interface ViewContent {
  InputSchema?: string | redacted.Redacted<string>;
  Template?: string | redacted.Redacted<string>;
  Actions?: string | redacted.Redacted<string>[];
}
export const ViewContent = S.suspend(() =>
  S.Struct({
    InputSchema: S.optional(SensitiveString),
    Template: S.optional(SensitiveString),
    Actions: S.optional(ViewActions),
  }),
).annotations({ identifier: "ViewContent" }) as any as S.Schema<ViewContent>;
export type ChatItemType =
  | "TYPING"
  | "PARTICIPANT_JOINED"
  | "PARTICIPANT_LEFT"
  | "CHAT_ENDED"
  | "TRANSFER_SUCCEEDED"
  | "TRANSFER_FAILED"
  | "MESSAGE"
  | "EVENT"
  | "ATTACHMENT"
  | "CONNECTION_ACK"
  | "MESSAGE_DELIVERED"
  | "MESSAGE_READ"
  | (string & {});
export const ChatItemType = S.String;
export type ParticipantRole =
  | "AGENT"
  | "CUSTOMER"
  | "SYSTEM"
  | "CUSTOM_BOT"
  | "SUPERVISOR"
  | (string & {});
export const ParticipantRole = S.String;
export type UploadMetadataSignedHeaders = { [key: string]: string | undefined };
export const UploadMetadataSignedHeaders = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface View {
  Id?: string;
  Arn?: string;
  Name?: string | redacted.Redacted<string>;
  Version?: number;
  Content?: ViewContent;
}
export const View = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Version: S.optional(S.Number),
    Content: S.optional(ViewContent),
  }),
).annotations({ identifier: "View" }) as any as S.Schema<View>;
export interface UploadMetadata {
  Url?: string;
  UrlExpiry?: string;
  HeadersToInclude?: { [key: string]: string | undefined };
}
export const UploadMetadata = S.suspend(() =>
  S.Struct({
    Url: S.optional(S.String),
    UrlExpiry: S.optional(S.String),
    HeadersToInclude: S.optional(UploadMetadataSignedHeaders),
  }),
).annotations({
  identifier: "UploadMetadata",
}) as any as S.Schema<UploadMetadata>;
export interface WebRTCMediaPlacement {
  AudioHostUrl?: string;
  AudioFallbackUrl?: string;
  SignalingUrl?: string;
  EventIngestionUrl?: string;
}
export const WebRTCMediaPlacement = S.suspend(() =>
  S.Struct({
    AudioHostUrl: S.optional(S.String),
    AudioFallbackUrl: S.optional(S.String),
    SignalingUrl: S.optional(S.String),
    EventIngestionUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "WebRTCMediaPlacement",
}) as any as S.Schema<WebRTCMediaPlacement>;
export type ArtifactStatus =
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | (string & {});
export const ArtifactStatus = S.String;
export type MeetingFeatureStatus = "AVAILABLE" | "UNAVAILABLE" | (string & {});
export const MeetingFeatureStatus = S.String;
export interface DescribeViewResponse {
  View?: View;
}
export const DescribeViewResponse = S.suspend(() =>
  S.Struct({ View: S.optional(View) }),
).annotations({
  identifier: "DescribeViewResponse",
}) as any as S.Schema<DescribeViewResponse>;
export interface StartAttachmentUploadResponse {
  AttachmentId?: string;
  UploadMetadata?: UploadMetadata;
}
export const StartAttachmentUploadResponse = S.suspend(() =>
  S.Struct({
    AttachmentId: S.optional(S.String),
    UploadMetadata: S.optional(UploadMetadata),
  }),
).annotations({
  identifier: "StartAttachmentUploadResponse",
}) as any as S.Schema<StartAttachmentUploadResponse>;
export interface AttachmentItem {
  ContentType?: string;
  AttachmentId?: string;
  AttachmentName?: string;
  Status?: ArtifactStatus;
}
export const AttachmentItem = S.suspend(() =>
  S.Struct({
    ContentType: S.optional(S.String),
    AttachmentId: S.optional(S.String),
    AttachmentName: S.optional(S.String),
    Status: S.optional(ArtifactStatus),
  }),
).annotations({
  identifier: "AttachmentItem",
}) as any as S.Schema<AttachmentItem>;
export type Attachments = AttachmentItem[];
export const Attachments = S.Array(AttachmentItem);
export interface AudioFeatures {
  EchoReduction?: MeetingFeatureStatus;
}
export const AudioFeatures = S.suspend(() =>
  S.Struct({ EchoReduction: S.optional(MeetingFeatureStatus) }),
).annotations({
  identifier: "AudioFeatures",
}) as any as S.Schema<AudioFeatures>;
export type ResourceType =
  | "CONTACT"
  | "CONTACT_FLOW"
  | "INSTANCE"
  | "PARTICIPANT"
  | "HIERARCHY_LEVEL"
  | "HIERARCHY_GROUP"
  | "USER"
  | "PHONE_NUMBER"
  | (string & {});
export const ResourceType = S.String;
export interface MeetingFeaturesConfiguration {
  Audio?: AudioFeatures;
}
export const MeetingFeaturesConfiguration = S.suspend(() =>
  S.Struct({ Audio: S.optional(AudioFeatures) }),
).annotations({
  identifier: "MeetingFeaturesConfiguration",
}) as any as S.Schema<MeetingFeaturesConfiguration>;
export interface Receipt {
  DeliveredTimestamp?: string;
  ReadTimestamp?: string;
  RecipientParticipantId?: string;
}
export const Receipt = S.suspend(() =>
  S.Struct({
    DeliveredTimestamp: S.optional(S.String),
    ReadTimestamp: S.optional(S.String),
    RecipientParticipantId: S.optional(S.String),
  }),
).annotations({ identifier: "Receipt" }) as any as S.Schema<Receipt>;
export type Receipts = Receipt[];
export const Receipts = S.Array(Receipt);
export interface WebRTCMeeting {
  MediaPlacement?: WebRTCMediaPlacement;
  MeetingFeatures?: MeetingFeaturesConfiguration;
  MeetingId?: string;
}
export const WebRTCMeeting = S.suspend(() =>
  S.Struct({
    MediaPlacement: S.optional(WebRTCMediaPlacement),
    MeetingFeatures: S.optional(MeetingFeaturesConfiguration),
    MeetingId: S.optional(S.String),
  }),
).annotations({
  identifier: "WebRTCMeeting",
}) as any as S.Schema<WebRTCMeeting>;
export interface MessageMetadata {
  MessageId?: string;
  Receipts?: Receipt[];
  MessageProcessingStatus?: MessageProcessingStatus;
}
export const MessageMetadata = S.suspend(() =>
  S.Struct({
    MessageId: S.optional(S.String),
    Receipts: S.optional(Receipts),
    MessageProcessingStatus: S.optional(MessageProcessingStatus),
  }),
).annotations({
  identifier: "MessageMetadata",
}) as any as S.Schema<MessageMetadata>;
export interface WebRTCConnection {
  Attendee?: Attendee;
  Meeting?: WebRTCMeeting;
}
export const WebRTCConnection = S.suspend(() =>
  S.Struct({
    Attendee: S.optional(Attendee),
    Meeting: S.optional(WebRTCMeeting),
  }),
).annotations({
  identifier: "WebRTCConnection",
}) as any as S.Schema<WebRTCConnection>;
export interface Item {
  AbsoluteTime?: string;
  Content?: string;
  ContentType?: string;
  Id?: string;
  Type?: ChatItemType;
  ParticipantId?: string;
  DisplayName?: string;
  ParticipantRole?: ParticipantRole;
  Attachments?: AttachmentItem[];
  MessageMetadata?: MessageMetadata;
  RelatedContactId?: string;
  ContactId?: string;
}
export const Item = S.suspend(() =>
  S.Struct({
    AbsoluteTime: S.optional(S.String),
    Content: S.optional(S.String),
    ContentType: S.optional(S.String),
    Id: S.optional(S.String),
    Type: S.optional(ChatItemType),
    ParticipantId: S.optional(S.String),
    DisplayName: S.optional(S.String),
    ParticipantRole: S.optional(ParticipantRole),
    Attachments: S.optional(Attachments),
    MessageMetadata: S.optional(MessageMetadata),
    RelatedContactId: S.optional(S.String),
    ContactId: S.optional(S.String),
  }),
).annotations({ identifier: "Item" }) as any as S.Schema<Item>;
export type Transcript = Item[];
export const Transcript = S.Array(Item);
export interface CreateParticipantConnectionResponse {
  Websocket?: Websocket;
  ConnectionCredentials?: ConnectionCredentials;
  WebRTCConnection?: WebRTCConnection;
}
export const CreateParticipantConnectionResponse = S.suspend(() =>
  S.Struct({
    Websocket: S.optional(Websocket),
    ConnectionCredentials: S.optional(ConnectionCredentials),
    WebRTCConnection: S.optional(WebRTCConnection),
  }),
).annotations({
  identifier: "CreateParticipantConnectionResponse",
}) as any as S.Schema<CreateParticipantConnectionResponse>;
export interface GetTranscriptResponse {
  InitialContactId?: string;
  Transcript?: Item[];
  NextToken?: string;
}
export const GetTranscriptResponse = S.suspend(() =>
  S.Struct({
    InitialContactId: S.optional(S.String),
    Transcript: S.optional(Transcript),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTranscriptResponse",
}) as any as S.Schema<GetTranscriptResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(ResourceType),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Cancels the authentication session. The opted out branch of the Authenticate Customer
 * flow block will be taken.
 *
 * The current supported channel is chat. This API is not supported for Apple
 * Messages for Business, WhatsApp, or SMS chats.
 *
 * `ConnectionToken` is used for invoking this API instead of
 * `ParticipantToken`.
 *
 * The Amazon Connect Participant Service APIs do not use Signature Version 4
 * authentication.
 */
export const cancelParticipantAuthentication: (
  input: CancelParticipantAuthenticationRequest,
) => effect.Effect<
  CancelParticipantAuthenticationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelParticipantAuthenticationRequest,
  output: CancelParticipantAuthenticationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the view for the specified view token.
 *
 * For security recommendations, see Amazon Connect Chat security best practices.
 */
export const describeView: (
  input: DescribeViewRequest,
) => effect.Effect<
  DescribeViewResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeViewRequest,
  output: DescribeViewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The `application/vnd.amazonaws.connect.event.connection.acknowledged`
 * ContentType is no longer maintained since December 31, 2024. This event has been
 * migrated to the CreateParticipantConnection API using the
 * `ConnectParticipant` field.
 *
 * Sends an event. Message receipts are not supported when there are more than two active
 * participants in the chat. Using the SendEvent API for message receipts when a supervisor
 * is barged-in will result in a conflict exception.
 *
 * For security recommendations, see Amazon Connect Chat security best practices.
 *
 * `ConnectionToken` is used for invoking this API instead of
 * `ParticipantToken`.
 *
 * The Amazon Connect Participant Service APIs do not use Signature Version 4
 * authentication.
 */
export const sendEvent: (
  input: SendEventRequest,
) => effect.Effect<
  SendEventResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendEventRequest,
  output: SendEventResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends a message.
 *
 * For security recommendations, see Amazon Connect Chat security best practices.
 *
 * `ConnectionToken` is used for invoking this API instead of
 * `ParticipantToken`.
 *
 * The Amazon Connect Participant Service APIs do not use Signature Version 4
 * authentication.
 */
export const sendMessage: (
  input: SendMessageRequest,
) => effect.Effect<
  SendMessageResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendMessageRequest,
  output: SendMessageResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides a pre-signed URL for download of a completed attachment. This is an
 * asynchronous API for use with active contacts.
 *
 * For security recommendations, see Amazon Connect Chat security best practices.
 *
 * - The participant role `CUSTOM_BOT` is not permitted to access
 * attachments customers may upload. An `AccessDeniedException` can
 * indicate that the participant may be a CUSTOM_BOT, and it doesn't have
 * access to attachments.
 *
 * - `ConnectionToken` is used for invoking this API instead of
 * `ParticipantToken`.
 *
 * The Amazon Connect Participant Service APIs do not use Signature Version 4
 * authentication.
 */
export const getAttachment: (
  input: GetAttachmentRequest,
) => effect.Effect<
  GetAttachmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAttachmentRequest,
  output: GetAttachmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the AuthenticationUrl for the current authentication session for the
 * AuthenticateCustomer flow block.
 *
 * For security recommendations, see Amazon Connect Chat security best practices.
 *
 * - This API can only be called within one minute of receiving the
 * authenticationInitiated event.
 *
 * - The current supported channel is chat. This API is not supported for Apple
 * Messages for Business, WhatsApp, or SMS chats.
 *
 * `ConnectionToken` is used for invoking this API instead of
 * `ParticipantToken`.
 *
 * The Amazon Connect Participant Service APIs do not use Signature Version 4
 * authentication.
 */
export const getAuthenticationUrl: (
  input: GetAuthenticationUrlRequest,
) => effect.Effect<
  GetAuthenticationUrlResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAuthenticationUrlRequest,
  output: GetAuthenticationUrlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disconnects a participant.
 *
 * For security recommendations, see Amazon Connect Chat security best practices.
 *
 * `ConnectionToken` is used for invoking this API instead of
 * `ParticipantToken`.
 *
 * The Amazon Connect Participant Service APIs do not use Signature Version 4
 * authentication.
 */
export const disconnectParticipant: (
  input: DisconnectParticipantRequest,
) => effect.Effect<
  DisconnectParticipantResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisconnectParticipantRequest,
  output: DisconnectParticipantResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Allows you to confirm that the attachment has been uploaded using the pre-signed URL
 * provided in StartAttachmentUpload API. A conflict exception is thrown when an attachment
 * with that identifier is already being uploaded.
 *
 * For security recommendations, see Amazon Connect Chat security best practices.
 *
 * `ConnectionToken` is used for invoking this API instead of
 * `ParticipantToken`.
 *
 * The Amazon Connect Participant Service APIs do not use Signature Version 4
 * authentication.
 */
export const completeAttachmentUpload: (
  input: CompleteAttachmentUploadRequest,
) => effect.Effect<
  CompleteAttachmentUploadResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompleteAttachmentUploadRequest,
  output: CompleteAttachmentUploadResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides a pre-signed Amazon S3 URL in response for uploading the file directly to
 * S3.
 *
 * For security recommendations, see Amazon Connect Chat security best practices.
 *
 * `ConnectionToken` is used for invoking this API instead of
 * `ParticipantToken`.
 *
 * The Amazon Connect Participant Service APIs do not use Signature Version 4
 * authentication.
 */
export const startAttachmentUpload: (
  input: StartAttachmentUploadRequest,
) => effect.Effect<
  StartAttachmentUploadResponse,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAttachmentUploadRequest,
  output: StartAttachmentUploadResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates the participant's connection.
 *
 * For security recommendations, see Amazon Connect Chat security best practices.
 *
 * For WebRTC security recommendations, see Amazon Connect WebRTC security best practices.
 *
 * `ParticipantToken` is used for invoking this API instead of
 * `ConnectionToken`.
 *
 * The participant token is valid for the lifetime of the participant – until they are
 * part of a contact. For WebRTC participants, if they leave or are disconnected for 60
 * seconds, a new participant needs to be created using the CreateParticipant API.
 *
 * **For `WEBSOCKET` Type**:
 *
 * The response URL for has a connect expiry timeout of 100s. Clients must manually
 * connect to the returned websocket URL and subscribe to the desired topic.
 *
 * For chat, you need to publish the following on the established websocket
 * connection:
 *
 * `{"topic":"aws/subscribe","content":{"topics":["aws/chat"]}}`
 *
 * Upon websocket URL expiry, as specified in the response ConnectionExpiry parameter,
 * clients need to call this API again to obtain a new websocket URL and perform the same
 * steps as before.
 *
 * The expiry time for the connection token is different than the
 * `ChatDurationInMinutes`. Expiry time for the connection token is 1
 * day.
 *
 * **For `WEBRTC_CONNECTION` Type**:
 *
 * The response includes connection data required for the client application to join the
 * call using the Amazon Chime SDK client libraries. The WebRTCConnection response contains
 * Meeting and Attendee information needed to establish the media connection.
 *
 * The attendee join token in WebRTCConnection response is valid for the lifetime of the
 * participant in the call. If a participant leaves or is disconnected for 60 seconds,
 * their participant credentials will no longer be valid, and a new participant will need
 * to be created to rejoin the call.
 *
 * **Message streaming support**: This API can also be used
 * together with the StartContactStreaming API to create a participant connection for chat
 * contacts that are not using a websocket. For more information about message streaming,
 * Enable real-time chat
 * message streaming in the Amazon Connect Administrator
 * Guide.
 *
 * **Multi-user web, in-app, video calling support**:
 *
 * For WebRTC calls, this API is used in conjunction with the CreateParticipant API to
 * enable multi-party calling. The StartWebRTCContact API creates the initial contact and
 * routes it to an agent, while CreateParticipant adds additional participants to the
 * ongoing call. For more information about multi-party WebRTC calls, see Enable multi-user web, in-app, and video calling in the Amazon Connect
 * Administrator Guide.
 *
 * **Feature specifications**: For information about feature
 * specifications, such as the allowed number of open websocket connections per participant
 * or maximum number of WebRTC participants, see Feature specifications in the Amazon Connect Administrator
 * Guide.
 *
 * The Amazon Connect Participant Service APIs do not use Signature Version 4
 * authentication.
 */
export const createParticipantConnection: (
  input: CreateParticipantConnectionRequest,
) => effect.Effect<
  CreateParticipantConnectionResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateParticipantConnectionRequest,
  output: CreateParticipantConnectionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a transcript of the session, including details about any attachments. For
 * information about accessing past chat contact transcripts for a persistent chat, see
 * Enable persistent chat.
 *
 * For security recommendations, see Amazon Connect Chat security best practices.
 *
 * If you have a process that consumes events in the transcript of an chat that has
 * ended, note that chat transcripts contain the following event content types if the event
 * has occurred during the chat session:
 *
 * - `application/vnd.amazonaws.connect.event.participant.invited`
 *
 * - `application/vnd.amazonaws.connect.event.participant.joined`
 *
 * - `application/vnd.amazonaws.connect.event.participant.left`
 *
 * - `application/vnd.amazonaws.connect.event.chat.ended`
 *
 * - `application/vnd.amazonaws.connect.event.transfer.succeeded`
 *
 * - `application/vnd.amazonaws.connect.event.transfer.failed`
 *
 * `ConnectionToken` is used for invoking this API instead of
 * `ParticipantToken`.
 *
 * The Amazon Connect Participant Service APIs do not use Signature Version 4
 * authentication.
 */
export const getTranscript: {
  (
    input: GetTranscriptRequest,
  ): effect.Effect<
    GetTranscriptResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetTranscriptRequest,
  ) => stream.Stream<
    GetTranscriptResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetTranscriptRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetTranscriptRequest,
  output: GetTranscriptResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
