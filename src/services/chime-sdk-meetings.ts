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
  sdkId: "Chime SDK Meetings",
  serviceShapeName: "ChimeMeetingsSDKService",
});
const auth = T.AwsAuthSigv4({ name: "chime" });
const ver = T.ServiceVersion("2021-07-15");
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
              `https://meetings-chime-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://meetings-chime-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://meetings-chime.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://meetings-chime.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type GuidString = string;
export type ExternalUserId = string | Redacted.Redacted<string>;
export type ClientRequestToken = string | Redacted.Redacted<string>;
export type MediaRegion = string;
export type ExternalMeetingId = string | Redacted.Redacted<string>;
export type PrimaryMeetingId = string;
export type TenantId = string;
export type ResultMax = number;
export type AmazonResourceName = string;
export type TagKey = string;
export type Arn = string | Redacted.Redacted<string>;
export type TagValue = string;
export type AttendeeMax = number;
export type TranscribePiiEntityTypes = string;
export type TranscribeLanguageModelName = string;
export type TranscribeLanguageOptions = string;
export type TranscribeVocabularyNamesOrFilterNamesString = string;
export type JoinTokenString = string | Redacted.Redacted<string>;
export type RetryAfterSeconds = string;

//# Schemas
export type TenantIdList = string[];
export const TenantIdList = S.Array(S.String);
export interface AttendeeCapabilities {
  Audio: string;
  Video: string;
  Content: string;
}
export const AttendeeCapabilities = S.suspend(() =>
  S.Struct({ Audio: S.String, Video: S.String, Content: S.String }),
).annotations({
  identifier: "AttendeeCapabilities",
}) as any as S.Schema<AttendeeCapabilities>;
export interface CreateAttendeeRequestItem {
  ExternalUserId: string | Redacted.Redacted<string>;
  Capabilities?: AttendeeCapabilities;
}
export const CreateAttendeeRequestItem = S.suspend(() =>
  S.Struct({
    ExternalUserId: SensitiveString,
    Capabilities: S.optional(AttendeeCapabilities),
  }),
).annotations({
  identifier: "CreateAttendeeRequestItem",
}) as any as S.Schema<CreateAttendeeRequestItem>;
export type CreateMeetingWithAttendeesRequestItemList =
  CreateAttendeeRequestItem[];
export const CreateMeetingWithAttendeesRequestItemList = S.Array(
  CreateAttendeeRequestItem,
);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CreateAttendeeRequest {
  MeetingId: string;
  ExternalUserId: string | Redacted.Redacted<string>;
  Capabilities?: AttendeeCapabilities;
}
export const CreateAttendeeRequest = S.suspend(() =>
  S.Struct({
    MeetingId: S.String.pipe(T.HttpLabel("MeetingId")),
    ExternalUserId: SensitiveString,
    Capabilities: S.optional(AttendeeCapabilities),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/meetings/{MeetingId}/attendees" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAttendeeRequest",
}) as any as S.Schema<CreateAttendeeRequest>;
export interface AudioFeatures {
  EchoReduction?: string;
}
export const AudioFeatures = S.suspend(() =>
  S.Struct({ EchoReduction: S.optional(S.String) }),
).annotations({
  identifier: "AudioFeatures",
}) as any as S.Schema<AudioFeatures>;
export interface VideoFeatures {
  MaxResolution?: string;
}
export const VideoFeatures = S.suspend(() =>
  S.Struct({ MaxResolution: S.optional(S.String) }),
).annotations({
  identifier: "VideoFeatures",
}) as any as S.Schema<VideoFeatures>;
export interface ContentFeatures {
  MaxResolution?: string;
}
export const ContentFeatures = S.suspend(() =>
  S.Struct({ MaxResolution: S.optional(S.String) }),
).annotations({
  identifier: "ContentFeatures",
}) as any as S.Schema<ContentFeatures>;
export interface AttendeeFeatures {
  MaxCount?: number;
}
export const AttendeeFeatures = S.suspend(() =>
  S.Struct({ MaxCount: S.optional(S.Number) }),
).annotations({
  identifier: "AttendeeFeatures",
}) as any as S.Schema<AttendeeFeatures>;
export interface MeetingFeaturesConfiguration {
  Audio?: AudioFeatures;
  Video?: VideoFeatures;
  Content?: ContentFeatures;
  Attendee?: AttendeeFeatures;
}
export const MeetingFeaturesConfiguration = S.suspend(() =>
  S.Struct({
    Audio: S.optional(AudioFeatures),
    Video: S.optional(VideoFeatures),
    Content: S.optional(ContentFeatures),
    Attendee: S.optional(AttendeeFeatures),
  }),
).annotations({
  identifier: "MeetingFeaturesConfiguration",
}) as any as S.Schema<MeetingFeaturesConfiguration>;
export interface NotificationsConfiguration {
  LambdaFunctionArn?: string | Redacted.Redacted<string>;
  SnsTopicArn?: string | Redacted.Redacted<string>;
  SqsQueueArn?: string | Redacted.Redacted<string>;
}
export const NotificationsConfiguration = S.suspend(() =>
  S.Struct({
    LambdaFunctionArn: S.optional(SensitiveString),
    SnsTopicArn: S.optional(SensitiveString),
    SqsQueueArn: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "NotificationsConfiguration",
}) as any as S.Schema<NotificationsConfiguration>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateMeetingWithAttendeesRequest {
  ClientRequestToken: string | Redacted.Redacted<string>;
  MediaRegion: string;
  MeetingHostId?: string | Redacted.Redacted<string>;
  ExternalMeetingId: string | Redacted.Redacted<string>;
  MeetingFeatures?: MeetingFeaturesConfiguration;
  NotificationsConfiguration?: NotificationsConfiguration;
  Attendees: CreateMeetingWithAttendeesRequestItemList;
  PrimaryMeetingId?: string;
  TenantIds?: TenantIdList;
  Tags?: TagList;
  MediaPlacementNetworkType?: string;
}
export const CreateMeetingWithAttendeesRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: SensitiveString,
    MediaRegion: S.String,
    MeetingHostId: S.optional(SensitiveString),
    ExternalMeetingId: SensitiveString,
    MeetingFeatures: S.optional(MeetingFeaturesConfiguration),
    NotificationsConfiguration: S.optional(NotificationsConfiguration),
    Attendees: CreateMeetingWithAttendeesRequestItemList,
    PrimaryMeetingId: S.optional(S.String),
    TenantIds: S.optional(TenantIdList),
    Tags: S.optional(TagList),
    MediaPlacementNetworkType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/meetings?operation=create-attendees" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMeetingWithAttendeesRequest",
}) as any as S.Schema<CreateMeetingWithAttendeesRequest>;
export interface DeleteAttendeeRequest {
  MeetingId: string;
  AttendeeId: string;
}
export const DeleteAttendeeRequest = S.suspend(() =>
  S.Struct({
    MeetingId: S.String.pipe(T.HttpLabel("MeetingId")),
    AttendeeId: S.String.pipe(T.HttpLabel("AttendeeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/meetings/{MeetingId}/attendees/{AttendeeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAttendeeRequest",
}) as any as S.Schema<DeleteAttendeeRequest>;
export interface DeleteAttendeeResponse {}
export const DeleteAttendeeResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteAttendeeResponse" },
) as any as S.Schema<DeleteAttendeeResponse>;
export interface DeleteMeetingRequest {
  MeetingId: string;
}
export const DeleteMeetingRequest = S.suspend(() =>
  S.Struct({ MeetingId: S.String.pipe(T.HttpLabel("MeetingId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/meetings/{MeetingId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMeetingRequest",
}) as any as S.Schema<DeleteMeetingRequest>;
export interface DeleteMeetingResponse {}
export const DeleteMeetingResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteMeetingResponse",
}) as any as S.Schema<DeleteMeetingResponse>;
export interface GetAttendeeRequest {
  MeetingId: string;
  AttendeeId: string;
}
export const GetAttendeeRequest = S.suspend(() =>
  S.Struct({
    MeetingId: S.String.pipe(T.HttpLabel("MeetingId")),
    AttendeeId: S.String.pipe(T.HttpLabel("AttendeeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/meetings/{MeetingId}/attendees/{AttendeeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAttendeeRequest",
}) as any as S.Schema<GetAttendeeRequest>;
export interface GetMeetingRequest {
  MeetingId: string;
}
export const GetMeetingRequest = S.suspend(() =>
  S.Struct({ MeetingId: S.String.pipe(T.HttpLabel("MeetingId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/meetings/{MeetingId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMeetingRequest",
}) as any as S.Schema<GetMeetingRequest>;
export interface ListAttendeesRequest {
  MeetingId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAttendeesRequest = S.suspend(() =>
  S.Struct({
    MeetingId: S.String.pipe(T.HttpLabel("MeetingId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/meetings/{MeetingId}/attendees" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAttendeesRequest",
}) as any as S.Schema<ListAttendeesRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String.pipe(T.HttpQuery("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags" }),
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
export interface StopMeetingTranscriptionRequest {
  MeetingId: string;
}
export const StopMeetingTranscriptionRequest = S.suspend(() =>
  S.Struct({ MeetingId: S.String.pipe(T.HttpLabel("MeetingId")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/meetings/{MeetingId}/transcription?operation=stop",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopMeetingTranscriptionRequest",
}) as any as S.Schema<StopMeetingTranscriptionRequest>;
export interface StopMeetingTranscriptionResponse {}
export const StopMeetingTranscriptionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopMeetingTranscriptionResponse",
}) as any as S.Schema<StopMeetingTranscriptionResponse>;
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags?operation=tag-resource" }),
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
  ResourceARN: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags?operation=untag-resource" }),
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
export interface UpdateAttendeeCapabilitiesRequest {
  MeetingId: string;
  AttendeeId: string;
  Capabilities: AttendeeCapabilities;
}
export const UpdateAttendeeCapabilitiesRequest = S.suspend(() =>
  S.Struct({
    MeetingId: S.String.pipe(T.HttpLabel("MeetingId")),
    AttendeeId: S.String.pipe(T.HttpLabel("AttendeeId")),
    Capabilities: AttendeeCapabilities,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/meetings/{MeetingId}/attendees/{AttendeeId}/capabilities",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAttendeeCapabilitiesRequest",
}) as any as S.Schema<UpdateAttendeeCapabilitiesRequest>;
export type CreateAttendeeRequestItemList = CreateAttendeeRequestItem[];
export const CreateAttendeeRequestItemList = S.Array(CreateAttendeeRequestItem);
export interface AttendeeIdItem {
  AttendeeId: string;
}
export const AttendeeIdItem = S.suspend(() =>
  S.Struct({ AttendeeId: S.String }),
).annotations({
  identifier: "AttendeeIdItem",
}) as any as S.Schema<AttendeeIdItem>;
export type AttendeeIdsList = AttendeeIdItem[];
export const AttendeeIdsList = S.Array(AttendeeIdItem);
export interface Attendee {
  ExternalUserId?: string | Redacted.Redacted<string>;
  AttendeeId?: string;
  JoinToken?: string | Redacted.Redacted<string>;
  Capabilities?: AttendeeCapabilities;
}
export const Attendee = S.suspend(() =>
  S.Struct({
    ExternalUserId: S.optional(SensitiveString),
    AttendeeId: S.optional(S.String),
    JoinToken: S.optional(SensitiveString),
    Capabilities: S.optional(AttendeeCapabilities),
  }),
).annotations({ identifier: "Attendee" }) as any as S.Schema<Attendee>;
export type AttendeeList = Attendee[];
export const AttendeeList = S.Array(Attendee);
export interface BatchCreateAttendeeRequest {
  MeetingId: string;
  Attendees: CreateAttendeeRequestItemList;
}
export const BatchCreateAttendeeRequest = S.suspend(() =>
  S.Struct({
    MeetingId: S.String.pipe(T.HttpLabel("MeetingId")),
    Attendees: CreateAttendeeRequestItemList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/meetings/{MeetingId}/attendees?operation=batch-create",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchCreateAttendeeRequest",
}) as any as S.Schema<BatchCreateAttendeeRequest>;
export interface BatchUpdateAttendeeCapabilitiesExceptRequest {
  MeetingId: string;
  ExcludedAttendeeIds: AttendeeIdsList;
  Capabilities: AttendeeCapabilities;
}
export const BatchUpdateAttendeeCapabilitiesExceptRequest = S.suspend(() =>
  S.Struct({
    MeetingId: S.String.pipe(T.HttpLabel("MeetingId")),
    ExcludedAttendeeIds: AttendeeIdsList,
    Capabilities: AttendeeCapabilities,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/meetings/{MeetingId}/attendees/capabilities?operation=batch-update-except",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateAttendeeCapabilitiesExceptRequest",
}) as any as S.Schema<BatchUpdateAttendeeCapabilitiesExceptRequest>;
export interface BatchUpdateAttendeeCapabilitiesExceptResponse {}
export const BatchUpdateAttendeeCapabilitiesExceptResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "BatchUpdateAttendeeCapabilitiesExceptResponse",
}) as any as S.Schema<BatchUpdateAttendeeCapabilitiesExceptResponse>;
export interface GetAttendeeResponse {
  Attendee?: Attendee;
}
export const GetAttendeeResponse = S.suspend(() =>
  S.Struct({ Attendee: S.optional(Attendee) }),
).annotations({
  identifier: "GetAttendeeResponse",
}) as any as S.Schema<GetAttendeeResponse>;
export interface MediaPlacement {
  AudioHostUrl?: string;
  AudioFallbackUrl?: string;
  SignalingUrl?: string;
  TurnControlUrl?: string;
  ScreenDataUrl?: string;
  ScreenViewingUrl?: string;
  ScreenSharingUrl?: string;
  EventIngestionUrl?: string;
}
export const MediaPlacement = S.suspend(() =>
  S.Struct({
    AudioHostUrl: S.optional(S.String),
    AudioFallbackUrl: S.optional(S.String),
    SignalingUrl: S.optional(S.String),
    TurnControlUrl: S.optional(S.String),
    ScreenDataUrl: S.optional(S.String),
    ScreenViewingUrl: S.optional(S.String),
    ScreenSharingUrl: S.optional(S.String),
    EventIngestionUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "MediaPlacement",
}) as any as S.Schema<MediaPlacement>;
export interface Meeting {
  MeetingId?: string;
  MeetingHostId?: string | Redacted.Redacted<string>;
  ExternalMeetingId?: string | Redacted.Redacted<string>;
  MediaRegion?: string;
  MediaPlacement?: MediaPlacement;
  MeetingFeatures?: MeetingFeaturesConfiguration;
  PrimaryMeetingId?: string;
  TenantIds?: TenantIdList;
  MeetingArn?: string;
}
export const Meeting = S.suspend(() =>
  S.Struct({
    MeetingId: S.optional(S.String),
    MeetingHostId: S.optional(SensitiveString),
    ExternalMeetingId: S.optional(SensitiveString),
    MediaRegion: S.optional(S.String),
    MediaPlacement: S.optional(MediaPlacement),
    MeetingFeatures: S.optional(MeetingFeaturesConfiguration),
    PrimaryMeetingId: S.optional(S.String),
    TenantIds: S.optional(TenantIdList),
    MeetingArn: S.optional(S.String),
  }),
).annotations({ identifier: "Meeting" }) as any as S.Schema<Meeting>;
export interface GetMeetingResponse {
  Meeting?: Meeting;
}
export const GetMeetingResponse = S.suspend(() =>
  S.Struct({ Meeting: S.optional(Meeting) }),
).annotations({
  identifier: "GetMeetingResponse",
}) as any as S.Schema<GetMeetingResponse>;
export interface ListAttendeesResponse {
  Attendees?: AttendeeList;
  NextToken?: string;
}
export const ListAttendeesResponse = S.suspend(() =>
  S.Struct({
    Attendees: S.optional(AttendeeList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAttendeesResponse",
}) as any as S.Schema<ListAttendeesResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateAttendeeCapabilitiesResponse {
  Attendee?: Attendee;
}
export const UpdateAttendeeCapabilitiesResponse = S.suspend(() =>
  S.Struct({ Attendee: S.optional(Attendee) }),
).annotations({
  identifier: "UpdateAttendeeCapabilitiesResponse",
}) as any as S.Schema<UpdateAttendeeCapabilitiesResponse>;
export interface EngineTranscribeSettings {
  LanguageCode?: string;
  VocabularyFilterMethod?: string;
  VocabularyFilterName?: string;
  VocabularyName?: string;
  Region?: string;
  EnablePartialResultsStabilization?: boolean;
  PartialResultsStability?: string;
  ContentIdentificationType?: string;
  ContentRedactionType?: string;
  PiiEntityTypes?: string;
  LanguageModelName?: string;
  IdentifyLanguage?: boolean;
  LanguageOptions?: string;
  PreferredLanguage?: string;
  VocabularyNames?: string;
  VocabularyFilterNames?: string;
}
export const EngineTranscribeSettings = S.suspend(() =>
  S.Struct({
    LanguageCode: S.optional(S.String),
    VocabularyFilterMethod: S.optional(S.String),
    VocabularyFilterName: S.optional(S.String),
    VocabularyName: S.optional(S.String),
    Region: S.optional(S.String),
    EnablePartialResultsStabilization: S.optional(S.Boolean),
    PartialResultsStability: S.optional(S.String),
    ContentIdentificationType: S.optional(S.String),
    ContentRedactionType: S.optional(S.String),
    PiiEntityTypes: S.optional(S.String),
    LanguageModelName: S.optional(S.String),
    IdentifyLanguage: S.optional(S.Boolean),
    LanguageOptions: S.optional(S.String),
    PreferredLanguage: S.optional(S.String),
    VocabularyNames: S.optional(S.String),
    VocabularyFilterNames: S.optional(S.String),
  }),
).annotations({
  identifier: "EngineTranscribeSettings",
}) as any as S.Schema<EngineTranscribeSettings>;
export interface EngineTranscribeMedicalSettings {
  LanguageCode: string;
  Specialty: string;
  Type: string;
  VocabularyName?: string;
  Region?: string;
  ContentIdentificationType?: string;
}
export const EngineTranscribeMedicalSettings = S.suspend(() =>
  S.Struct({
    LanguageCode: S.String,
    Specialty: S.String,
    Type: S.String,
    VocabularyName: S.optional(S.String),
    Region: S.optional(S.String),
    ContentIdentificationType: S.optional(S.String),
  }),
).annotations({
  identifier: "EngineTranscribeMedicalSettings",
}) as any as S.Schema<EngineTranscribeMedicalSettings>;
export interface CreateAttendeeError {
  ExternalUserId?: string | Redacted.Redacted<string>;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const CreateAttendeeError = S.suspend(() =>
  S.Struct({
    ExternalUserId: S.optional(SensitiveString),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAttendeeError",
}) as any as S.Schema<CreateAttendeeError>;
export type BatchCreateAttendeeErrorList = CreateAttendeeError[];
export const BatchCreateAttendeeErrorList = S.Array(CreateAttendeeError);
export interface TranscriptionConfiguration {
  EngineTranscribeSettings?: EngineTranscribeSettings;
  EngineTranscribeMedicalSettings?: EngineTranscribeMedicalSettings;
}
export const TranscriptionConfiguration = S.suspend(() =>
  S.Struct({
    EngineTranscribeSettings: S.optional(EngineTranscribeSettings),
    EngineTranscribeMedicalSettings: S.optional(
      EngineTranscribeMedicalSettings,
    ),
  }),
).annotations({
  identifier: "TranscriptionConfiguration",
}) as any as S.Schema<TranscriptionConfiguration>;
export interface BatchCreateAttendeeResponse {
  Attendees?: AttendeeList;
  Errors?: BatchCreateAttendeeErrorList;
}
export const BatchCreateAttendeeResponse = S.suspend(() =>
  S.Struct({
    Attendees: S.optional(AttendeeList),
    Errors: S.optional(BatchCreateAttendeeErrorList),
  }),
).annotations({
  identifier: "BatchCreateAttendeeResponse",
}) as any as S.Schema<BatchCreateAttendeeResponse>;
export interface CreateAttendeeResponse {
  Attendee?: Attendee;
}
export const CreateAttendeeResponse = S.suspend(() =>
  S.Struct({ Attendee: S.optional(Attendee) }),
).annotations({
  identifier: "CreateAttendeeResponse",
}) as any as S.Schema<CreateAttendeeResponse>;
export interface CreateMeetingRequest {
  ClientRequestToken: string | Redacted.Redacted<string>;
  MediaRegion: string;
  MeetingHostId?: string | Redacted.Redacted<string>;
  ExternalMeetingId: string | Redacted.Redacted<string>;
  NotificationsConfiguration?: NotificationsConfiguration;
  MeetingFeatures?: MeetingFeaturesConfiguration;
  PrimaryMeetingId?: string;
  TenantIds?: TenantIdList;
  Tags?: TagList;
  MediaPlacementNetworkType?: string;
}
export const CreateMeetingRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: SensitiveString,
    MediaRegion: S.String,
    MeetingHostId: S.optional(SensitiveString),
    ExternalMeetingId: SensitiveString,
    NotificationsConfiguration: S.optional(NotificationsConfiguration),
    MeetingFeatures: S.optional(MeetingFeaturesConfiguration),
    PrimaryMeetingId: S.optional(S.String),
    TenantIds: S.optional(TenantIdList),
    Tags: S.optional(TagList),
    MediaPlacementNetworkType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/meetings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMeetingRequest",
}) as any as S.Schema<CreateMeetingRequest>;
export interface StartMeetingTranscriptionRequest {
  MeetingId: string;
  TranscriptionConfiguration: TranscriptionConfiguration;
}
export const StartMeetingTranscriptionRequest = S.suspend(() =>
  S.Struct({
    MeetingId: S.String.pipe(T.HttpLabel("MeetingId")),
    TranscriptionConfiguration: TranscriptionConfiguration,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/meetings/{MeetingId}/transcription?operation=start",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMeetingTranscriptionRequest",
}) as any as S.Schema<StartMeetingTranscriptionRequest>;
export interface StartMeetingTranscriptionResponse {}
export const StartMeetingTranscriptionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartMeetingTranscriptionResponse",
}) as any as S.Schema<StartMeetingTranscriptionResponse>;
export interface CreateMeetingResponse {
  Meeting?: Meeting;
}
export const CreateMeetingResponse = S.suspend(() =>
  S.Struct({ Meeting: S.optional(Meeting) }),
).annotations({
  identifier: "CreateMeetingResponse",
}) as any as S.Schema<CreateMeetingResponse>;
export interface CreateMeetingWithAttendeesResponse {
  Meeting?: Meeting;
  Attendees?: AttendeeList;
  Errors?: BatchCreateAttendeeErrorList;
}
export const CreateMeetingWithAttendeesResponse = S.suspend(() =>
  S.Struct({
    Meeting: S.optional(Meeting),
    Attendees: S.optional(AttendeeList),
    Errors: S.optional(BatchCreateAttendeeErrorList),
  }),
).annotations({
  identifier: "CreateMeetingWithAttendeesResponse",
}) as any as S.Schema<CreateMeetingWithAttendeesResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
    ResourceName: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
    RetryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(C.withThrottlingError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(C.withAuthError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
    ResourceName: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes an attendee from the specified Amazon Chime SDK meeting and deletes their
 * `JoinToken`. Attendees are automatically deleted when a Amazon Chime SDK meeting is deleted. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK
 * in the *Amazon Chime Developer Guide*.
 */
export const deleteAttendee: (
  input: DeleteAttendeeRequest,
) => Effect.Effect<
  DeleteAttendeeResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAttendeeRequest,
  output: DeleteAttendeeResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * The resource that supports tags.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ForbiddenException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | TooManyTagsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    TooManyTagsException,
    UnauthorizedException,
  ],
}));
/**
 * The capabilities that you want to update.
 *
 * You use the capabilities with a set of values that control what the capabilities can do, such as `SendReceive` data. For more information about those values, see
 * .
 *
 * When using capabilities, be aware of these corner cases:
 *
 * - If you specify `MeetingFeatures:Video:MaxResolution:None` when you create a meeting, all API requests
 * that include `SendReceive`, `Send`, or `Receive` for `AttendeeCapabilities:Video` will be rejected with `ValidationError 400`.
 *
 * - If you specify `MeetingFeatures:Content:MaxResolution:None` when you create a meeting, all API requests that include `SendReceive`, `Send`, or
 * `Receive` for `AttendeeCapabilities:Content` will be rejected with `ValidationError 400`.
 *
 * - You can't set `content` capabilities to `SendReceive` or `Receive` unless you also set `video` capabilities to `SendReceive`
 * or `Receive`. If you don't set the `video` capability to receive, the response will contain an HTTP 400 Bad Request status code. However, you can set your `video` capability
 * to receive and you set your `content` capability to not receive.
 *
 * - If meeting features is defined as `Video:MaxResolution:None` but
 * `Content:MaxResolution` is defined as something other than
 * `None` and attendee capabilities are not defined in the API
 * request, then the default attendee video capability is set to
 * `Receive` and attendee content capability is set to
 * `SendReceive`. This is because content `SendReceive`
 * requires video to be at least `Receive`.
 *
 * - When you change an `audio` capability from `None` or `Receive` to `Send` or `SendReceive` ,
 * and if the attendee left their microphone unmuted, audio will flow from the attendee to the other meeting participants.
 *
 * - When you change a `video` or `content` capability from `None` or `Receive` to `Send` or `SendReceive` ,
 * and if the attendee turned on their video or content streams, remote attendees can receive those streams, but only after media renegotiation between the client and the Amazon Chime back-end server.
 */
export const updateAttendeeCapabilities: (
  input: UpdateAttendeeCapabilitiesRequest,
) => Effect.Effect<
  UpdateAttendeeCapabilitiesResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAttendeeCapabilitiesRequest,
  output: UpdateAttendeeCapabilitiesResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the Amazon Chime SDK attendee details for a specified meeting ID and attendee ID. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK
 * in the *Amazon Chime Developer Guide*.
 */
export const getAttendee: (
  input: GetAttendeeRequest,
) => Effect.Effect<
  GetAttendeeResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAttendeeRequest,
  output: GetAttendeeResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets the Amazon Chime SDK meeting details for the specified meeting ID. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK
 * in the *Amazon Chime Developer Guide*.
 */
export const getMeeting: (
  input: GetMeetingRequest,
) => Effect.Effect<
  GetMeetingResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMeetingRequest,
  output: GetMeetingResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the attendees for the specified Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK
 * in the *Amazon Chime Developer Guide*.
 */
export const listAttendees: {
  (
    input: ListAttendeesRequest,
  ): Effect.Effect<
    ListAttendeesResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttendeesRequest,
  ) => Stream.Stream<
    ListAttendeesResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttendeesRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottlingException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAttendeesRequest,
  output: ListAttendeesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes the specified Amazon Chime SDK meeting. The operation deletes all attendees, disconnects all clients, and prevents new clients from
 * joining the meeting. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK in the
 * *Amazon Chime Developer Guide*.
 */
export const deleteMeeting: (
  input: DeleteMeetingRequest,
) => Effect.Effect<
  DeleteMeetingResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMeetingRequest,
  output: DeleteMeetingResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Updates `AttendeeCapabilities` except the capabilities listed in an `ExcludedAttendeeIds` table.
 *
 * You use the capabilities with a set of values that control what the capabilities can do, such as `SendReceive` data. For more information about those values, see
 * .
 *
 * When using capabilities, be aware of these corner cases:
 *
 * - If you specify `MeetingFeatures:Video:MaxResolution:None` when you create a meeting, all API requests
 * that include `SendReceive`, `Send`, or `Receive` for `AttendeeCapabilities:Video` will be rejected with `ValidationError 400`.
 *
 * - If you specify `MeetingFeatures:Content:MaxResolution:None` when you create a meeting, all API requests that include `SendReceive`, `Send`, or
 * `Receive` for `AttendeeCapabilities:Content` will be rejected with `ValidationError 400`.
 *
 * - You can't set `content` capabilities to `SendReceive` or `Receive` unless you also set `video` capabilities to `SendReceive`
 * or `Receive`. If you don't set the `video` capability to receive, the response will contain an HTTP 400 Bad Request status code. However, you can set your `video` capability
 * to receive and you set your `content` capability to not receive.
 *
 * - If meeting features is defined as `Video:MaxResolution:None` but
 * `Content:MaxResolution` is defined as something other than
 * `None` and attendee capabilities are not defined in the API
 * request, then the default attendee video capability is set to
 * `Receive` and attendee content capability is set to
 * `SendReceive`. This is because content `SendReceive`
 * requires video to be at least `Receive`.
 *
 * - When you change an `audio` capability from `None` or `Receive` to `Send` or `SendReceive` ,
 * and if the attendee left their microphone unmuted, audio will flow from the attendee to the other meeting participants.
 *
 * - When you change a `video` or `content` capability from `None` or `Receive` to `Send` or `SendReceive` ,
 * and if the attendee turned on their video or content streams, remote attendees can receive those streams, but only after media renegotiation between the client and the Amazon Chime back-end server.
 */
export const batchUpdateAttendeeCapabilitiesExcept: (
  input: BatchUpdateAttendeeCapabilitiesExceptRequest,
) => Effect.Effect<
  BatchUpdateAttendeeCapabilitiesExceptResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateAttendeeCapabilitiesExceptRequest,
  output: BatchUpdateAttendeeCapabilitiesExceptResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new Amazon Chime SDK meeting in the specified media Region with no initial attendees. For more information about specifying media Regions, see
 * Available Regions and
 * Using meeting Regions, both
 * in the *Amazon Chime SDK Developer Guide*. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK
 * in the
 * *Amazon Chime SDK Developer Guide*.
 *
 * If you use this API in conjuction with the and APIs, and you don't specify the
 * `MeetingFeatures.Content.MaxResolution` or `MeetingFeatures.Video.MaxResolution` parameters, the following defaults are used:
 *
 * - Content.MaxResolution: FHD
 *
 * - Video.MaxResolution: HD
 */
export const createMeeting: (
  input: CreateMeetingRequest,
) => Effect.Effect<
  CreateMeetingResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | LimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMeetingRequest,
  output: CreateMeetingResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    LimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new Amazon Chime SDK meeting in the specified media Region, with attendees. For more information about specifying media Regions, see
 * Available Regions and
 * Using meeting Regions, both
 * in the *Amazon Chime SDK Developer Guide*. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK
 * in the
 * *Amazon Chime SDK Developer Guide*.
 *
 * If you use this API in conjuction with the and APIs, and you don't specify the
 * `MeetingFeatures.Content.MaxResolution` or `MeetingFeatures.Video.MaxResolution` parameters, the following defaults are used:
 *
 * - Content.MaxResolution: FHD
 *
 * - Video.MaxResolution: HD
 */
export const createMeetingWithAttendees: (
  input: CreateMeetingWithAttendeesRequest,
) => Effect.Effect<
  CreateMeetingWithAttendeesResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | LimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMeetingWithAttendeesRequest,
  output: CreateMeetingWithAttendeesResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    LimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a list of the tags available for the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | ForbiddenException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Removes the specified tags from the specified resources. When you specify a tag key, the action removes both that key and its associated value. The operation succeeds even if you
 * attempt to remove tags from a resource that were already removed. Note the following:
 *
 * - To remove tags from a resource, you need the necessary permissions for the service that the resource belongs to as well as permissions for removing tags. For more information,
 * see the documentation for the service whose resource you want to untag.
 *
 * - You can only tag resources that are located in the specified Amazon Web Services Region for the calling Amazon Web Services account.
 *
 * **Minimum permissions**
 *
 * In addition to the `tag:UntagResources` permission required by this operation, you must also have the remove tags permission defined by the service that created the resource.
 * For example, to remove the tags from an Amazon EC2 instance using the `UntagResources` operation, you must have both of the following permissions:
 *
 * `tag:UntagResource`
 *
 * `ChimeSDKMeetings:DeleteTags`
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ForbiddenException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Starts transcription for the specified `meetingId`. For more information, refer to
 * Using Amazon Chime SDK live transcription
 * in the *Amazon Chime SDK Developer Guide*.
 *
 * If you specify an invalid configuration, a `TranscriptFailed` event will be sent with the contents of the `BadRequestException` generated by Amazon Transcribe.
 * For more information on each parameter and which combinations are valid, refer to the
 * StartStreamTranscription API in the
 * *Amazon Transcribe Developer Guide*.
 *
 * By default, Amazon Transcribe may use and store audio content processed by the service to develop and improve Amazon Web Services AI/ML services as
 * further described in section 50 of the Amazon Web Services Service Terms. Using Amazon Transcribe
 * may be subject to federal and state laws or regulations regarding the recording or interception of electronic communications. It is your and your end users’
 * responsibility to comply with all applicable laws regarding the recording, including properly notifying all participants in a recorded session or communication
 * that the session or communication is being recorded, and obtaining all necessary consents. You can opt out from Amazon Web Services using audio content to develop and
 * improve AWS AI/ML services by configuring an AI services opt out policy using Amazon Web Services Organizations.
 */
export const startMeetingTranscription: (
  input: StartMeetingTranscriptionRequest,
) => Effect.Effect<
  StartMeetingTranscriptionResponse,
  | BadRequestException
  | ForbiddenException
  | LimitExceededException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMeetingTranscriptionRequest,
  output: StartMeetingTranscriptionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    LimitExceededException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    UnprocessableEntityException,
  ],
}));
/**
 * Stops transcription for the specified `meetingId`. For more information, refer to
 * Using Amazon Chime SDK live transcription
 * in the *Amazon Chime SDK Developer Guide*.
 *
 * By default, Amazon Transcribe may use and store audio content processed by the service to develop and improve Amazon Web Services AI/ML services as
 * further described in section 50 of the Amazon Web Services Service Terms. Using Amazon Transcribe
 * may be subject to federal and state laws or regulations regarding the recording or interception of electronic communications. It is your and your end users’
 * responsibility to comply with all applicable laws regarding the recording, including properly notifying all participants in a recorded session or communication
 * that the session or communication is being recorded, and obtaining all necessary consents. You can opt out from Amazon Web Services using audio content to develop and
 * improve Amazon Web Services AI/ML services by configuring an AI services opt out policy using Amazon Web Services Organizations.
 */
export const stopMeetingTranscription: (
  input: StopMeetingTranscriptionRequest,
) => Effect.Effect<
  StopMeetingTranscriptionResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopMeetingTranscriptionRequest,
  output: StopMeetingTranscriptionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    UnprocessableEntityException,
  ],
}));
/**
 * Creates up to 100 attendees for an active Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK in the *Amazon Chime Developer Guide*.
 */
export const batchCreateAttendee: (
  input: BatchCreateAttendeeRequest,
) => Effect.Effect<
  BatchCreateAttendeeResponse,
  | BadRequestException
  | ForbiddenException
  | LimitExceededException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateAttendeeRequest,
  output: BatchCreateAttendeeResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    LimitExceededException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    UnprocessableEntityException,
  ],
}));
/**
 * Creates a new attendee for an active Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK
 * in the
 * *Amazon Chime Developer Guide*.
 */
export const createAttendee: (
  input: CreateAttendeeRequest,
) => Effect.Effect<
  CreateAttendeeResponse,
  | BadRequestException
  | ForbiddenException
  | LimitExceededException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottlingException
  | UnauthorizedException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAttendeeRequest,
  output: CreateAttendeeResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    LimitExceededException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedException,
    UnprocessableEntityException,
  ],
}));
