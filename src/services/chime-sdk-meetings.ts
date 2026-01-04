import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Chime SDK Meetings",
  serviceShapeName: "ChimeMeetingsSDKService",
});
const auth = T.AwsAuthSigv4({ name: "chime" });
const ver = T.ServiceVersion("2021-07-15");
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
                        url: "https://meetings-chime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://meetings-chime-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://meetings-chime.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://meetings-chime.{Region}.{PartitionResult#dnsSuffix}",
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
export const TenantIdList = S.Array(S.String);
export class AttendeeCapabilities extends S.Class<AttendeeCapabilities>(
  "AttendeeCapabilities",
)({ Audio: S.String, Video: S.String, Content: S.String }) {}
export class CreateAttendeeRequestItem extends S.Class<CreateAttendeeRequestItem>(
  "CreateAttendeeRequestItem",
)({
  ExternalUserId: S.String,
  Capabilities: S.optional(AttendeeCapabilities),
}) {}
export const CreateMeetingWithAttendeesRequestItemList = S.Array(
  CreateAttendeeRequestItem,
);
export const TagKeyList = S.Array(S.String);
export class CreateAttendeeRequest extends S.Class<CreateAttendeeRequest>(
  "CreateAttendeeRequest",
)(
  {
    MeetingId: S.String.pipe(T.HttpLabel()),
    ExternalUserId: S.String,
    Capabilities: S.optional(AttendeeCapabilities),
  },
  T.all(
    T.Http({ method: "POST", uri: "/meetings/{MeetingId}/attendees" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AudioFeatures extends S.Class<AudioFeatures>("AudioFeatures")({
  EchoReduction: S.optional(S.String),
}) {}
export class VideoFeatures extends S.Class<VideoFeatures>("VideoFeatures")({
  MaxResolution: S.optional(S.String),
}) {}
export class ContentFeatures extends S.Class<ContentFeatures>(
  "ContentFeatures",
)({ MaxResolution: S.optional(S.String) }) {}
export class AttendeeFeatures extends S.Class<AttendeeFeatures>(
  "AttendeeFeatures",
)({ MaxCount: S.optional(S.Number) }) {}
export class MeetingFeaturesConfiguration extends S.Class<MeetingFeaturesConfiguration>(
  "MeetingFeaturesConfiguration",
)({
  Audio: S.optional(AudioFeatures),
  Video: S.optional(VideoFeatures),
  Content: S.optional(ContentFeatures),
  Attendee: S.optional(AttendeeFeatures),
}) {}
export class NotificationsConfiguration extends S.Class<NotificationsConfiguration>(
  "NotificationsConfiguration",
)({
  LambdaFunctionArn: S.optional(S.String),
  SnsTopicArn: S.optional(S.String),
  SqsQueueArn: S.optional(S.String),
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateMeetingWithAttendeesRequest extends S.Class<CreateMeetingWithAttendeesRequest>(
  "CreateMeetingWithAttendeesRequest",
)(
  {
    ClientRequestToken: S.String,
    MediaRegion: S.String,
    MeetingHostId: S.optional(S.String),
    ExternalMeetingId: S.String,
    MeetingFeatures: S.optional(MeetingFeaturesConfiguration),
    NotificationsConfiguration: S.optional(NotificationsConfiguration),
    Attendees: CreateMeetingWithAttendeesRequestItemList,
    PrimaryMeetingId: S.optional(S.String),
    TenantIds: S.optional(TenantIdList),
    Tags: S.optional(TagList),
    MediaPlacementNetworkType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/meetings?operation=create-attendees" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAttendeeRequest extends S.Class<DeleteAttendeeRequest>(
  "DeleteAttendeeRequest",
)(
  {
    MeetingId: S.String.pipe(T.HttpLabel()),
    AttendeeId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteAttendeeResponse extends S.Class<DeleteAttendeeResponse>(
  "DeleteAttendeeResponse",
)({}) {}
export class DeleteMeetingRequest extends S.Class<DeleteMeetingRequest>(
  "DeleteMeetingRequest",
)(
  { MeetingId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/meetings/{MeetingId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMeetingResponse extends S.Class<DeleteMeetingResponse>(
  "DeleteMeetingResponse",
)({}) {}
export class GetAttendeeRequest extends S.Class<GetAttendeeRequest>(
  "GetAttendeeRequest",
)(
  {
    MeetingId: S.String.pipe(T.HttpLabel()),
    AttendeeId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetMeetingRequest extends S.Class<GetMeetingRequest>(
  "GetMeetingRequest",
)(
  { MeetingId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/meetings/{MeetingId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAttendeesRequest extends S.Class<ListAttendeesRequest>(
  "ListAttendeesRequest",
)(
  {
    MeetingId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/meetings/{MeetingId}/attendees" }),
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
  { ResourceARN: S.String.pipe(T.HttpQuery("arn")) },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class StopMeetingTranscriptionRequest extends S.Class<StopMeetingTranscriptionRequest>(
  "StopMeetingTranscriptionRequest",
)(
  { MeetingId: S.String.pipe(T.HttpLabel()) },
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
) {}
export class StopMeetingTranscriptionResponse extends S.Class<StopMeetingTranscriptionResponse>(
  "StopMeetingTranscriptionResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/tags?operation=tag-resource" }),
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
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/tags?operation=untag-resource" }),
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
export class UpdateAttendeeCapabilitiesRequest extends S.Class<UpdateAttendeeCapabilitiesRequest>(
  "UpdateAttendeeCapabilitiesRequest",
)(
  {
    MeetingId: S.String.pipe(T.HttpLabel()),
    AttendeeId: S.String.pipe(T.HttpLabel()),
    Capabilities: AttendeeCapabilities,
  },
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
) {}
export const CreateAttendeeRequestItemList = S.Array(CreateAttendeeRequestItem);
export class AttendeeIdItem extends S.Class<AttendeeIdItem>("AttendeeIdItem")({
  AttendeeId: S.String,
}) {}
export const AttendeeIdsList = S.Array(AttendeeIdItem);
export class Attendee extends S.Class<Attendee>("Attendee")({
  ExternalUserId: S.optional(S.String),
  AttendeeId: S.optional(S.String),
  JoinToken: S.optional(S.String),
  Capabilities: S.optional(AttendeeCapabilities),
}) {}
export const AttendeeList = S.Array(Attendee);
export class BatchCreateAttendeeRequest extends S.Class<BatchCreateAttendeeRequest>(
  "BatchCreateAttendeeRequest",
)(
  {
    MeetingId: S.String.pipe(T.HttpLabel()),
    Attendees: CreateAttendeeRequestItemList,
  },
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
) {}
export class BatchUpdateAttendeeCapabilitiesExceptRequest extends S.Class<BatchUpdateAttendeeCapabilitiesExceptRequest>(
  "BatchUpdateAttendeeCapabilitiesExceptRequest",
)(
  {
    MeetingId: S.String.pipe(T.HttpLabel()),
    ExcludedAttendeeIds: AttendeeIdsList,
    Capabilities: AttendeeCapabilities,
  },
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
) {}
export class BatchUpdateAttendeeCapabilitiesExceptResponse extends S.Class<BatchUpdateAttendeeCapabilitiesExceptResponse>(
  "BatchUpdateAttendeeCapabilitiesExceptResponse",
)({}) {}
export class GetAttendeeResponse extends S.Class<GetAttendeeResponse>(
  "GetAttendeeResponse",
)({ Attendee: S.optional(Attendee) }) {}
export class MediaPlacement extends S.Class<MediaPlacement>("MediaPlacement")({
  AudioHostUrl: S.optional(S.String),
  AudioFallbackUrl: S.optional(S.String),
  SignalingUrl: S.optional(S.String),
  TurnControlUrl: S.optional(S.String),
  ScreenDataUrl: S.optional(S.String),
  ScreenViewingUrl: S.optional(S.String),
  ScreenSharingUrl: S.optional(S.String),
  EventIngestionUrl: S.optional(S.String),
}) {}
export class Meeting extends S.Class<Meeting>("Meeting")({
  MeetingId: S.optional(S.String),
  MeetingHostId: S.optional(S.String),
  ExternalMeetingId: S.optional(S.String),
  MediaRegion: S.optional(S.String),
  MediaPlacement: S.optional(MediaPlacement),
  MeetingFeatures: S.optional(MeetingFeaturesConfiguration),
  PrimaryMeetingId: S.optional(S.String),
  TenantIds: S.optional(TenantIdList),
  MeetingArn: S.optional(S.String),
}) {}
export class GetMeetingResponse extends S.Class<GetMeetingResponse>(
  "GetMeetingResponse",
)({ Meeting: S.optional(Meeting) }) {}
export class ListAttendeesResponse extends S.Class<ListAttendeesResponse>(
  "ListAttendeesResponse",
)({ Attendees: S.optional(AttendeeList), NextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class UpdateAttendeeCapabilitiesResponse extends S.Class<UpdateAttendeeCapabilitiesResponse>(
  "UpdateAttendeeCapabilitiesResponse",
)({ Attendee: S.optional(Attendee) }) {}
export class EngineTranscribeSettings extends S.Class<EngineTranscribeSettings>(
  "EngineTranscribeSettings",
)({
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
}) {}
export class EngineTranscribeMedicalSettings extends S.Class<EngineTranscribeMedicalSettings>(
  "EngineTranscribeMedicalSettings",
)({
  LanguageCode: S.String,
  Specialty: S.String,
  Type: S.String,
  VocabularyName: S.optional(S.String),
  Region: S.optional(S.String),
  ContentIdentificationType: S.optional(S.String),
}) {}
export class CreateAttendeeError extends S.Class<CreateAttendeeError>(
  "CreateAttendeeError",
)({
  ExternalUserId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const BatchCreateAttendeeErrorList = S.Array(CreateAttendeeError);
export class TranscriptionConfiguration extends S.Class<TranscriptionConfiguration>(
  "TranscriptionConfiguration",
)({
  EngineTranscribeSettings: S.optional(EngineTranscribeSettings),
  EngineTranscribeMedicalSettings: S.optional(EngineTranscribeMedicalSettings),
}) {}
export class BatchCreateAttendeeResponse extends S.Class<BatchCreateAttendeeResponse>(
  "BatchCreateAttendeeResponse",
)({
  Attendees: S.optional(AttendeeList),
  Errors: S.optional(BatchCreateAttendeeErrorList),
}) {}
export class CreateAttendeeResponse extends S.Class<CreateAttendeeResponse>(
  "CreateAttendeeResponse",
)({ Attendee: S.optional(Attendee) }) {}
export class CreateMeetingRequest extends S.Class<CreateMeetingRequest>(
  "CreateMeetingRequest",
)(
  {
    ClientRequestToken: S.String,
    MediaRegion: S.String,
    MeetingHostId: S.optional(S.String),
    ExternalMeetingId: S.String,
    NotificationsConfiguration: S.optional(NotificationsConfiguration),
    MeetingFeatures: S.optional(MeetingFeaturesConfiguration),
    PrimaryMeetingId: S.optional(S.String),
    TenantIds: S.optional(TenantIdList),
    Tags: S.optional(TagList),
    MediaPlacementNetworkType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/meetings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMeetingTranscriptionRequest extends S.Class<StartMeetingTranscriptionRequest>(
  "StartMeetingTranscriptionRequest",
)(
  {
    MeetingId: S.String.pipe(T.HttpLabel()),
    TranscriptionConfiguration: TranscriptionConfiguration,
  },
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
) {}
export class StartMeetingTranscriptionResponse extends S.Class<StartMeetingTranscriptionResponse>(
  "StartMeetingTranscriptionResponse",
)({}) {}
export class CreateMeetingResponse extends S.Class<CreateMeetingResponse>(
  "CreateMeetingResponse",
)({ Meeting: S.optional(Meeting) }) {}
export class CreateMeetingWithAttendeesResponse extends S.Class<CreateMeetingWithAttendeesResponse>(
  "CreateMeetingWithAttendeesResponse",
)({
  Meeting: S.optional(Meeting),
  Attendees: S.optional(AttendeeList),
  Errors: S.optional(BatchCreateAttendeeErrorList),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
    ResourceName: S.optional(S.String),
  },
) {}

//# Operations
/**
 * Lists the attendees for the specified Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK
 * in the *Amazon Chime Developer Guide*.
 */
export const listAttendees = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a list of the tags available for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAttendeeCapabilities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates up to 100 attendees for an active Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK in the *Amazon Chime Developer Guide*.
 */
export const batchCreateAttendee = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchUpdateAttendeeCapabilitiesExcept =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new attendee for an active Amazon Chime SDK meeting. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK
 * in the
 * *Amazon Chime Developer Guide*.
 */
export const createAttendee = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Deletes an attendee from the specified Amazon Chime SDK meeting and deletes their
 * `JoinToken`. Attendees are automatically deleted when a Amazon Chime SDK meeting is deleted. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK
 * in the *Amazon Chime Developer Guide*.
 */
export const deleteAttendee = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specified Amazon Chime SDK meeting. The operation deletes all attendees, disconnects all clients, and prevents new clients from
 * joining the meeting. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK in the
 * *Amazon Chime Developer Guide*.
 */
export const deleteMeeting = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Gets the Amazon Chime SDK attendee details for a specified meeting ID and attendee ID. For more information about the Amazon Chime SDK, see
 * Using the Amazon Chime SDK
 * in the *Amazon Chime Developer Guide*.
 */
export const getAttendee = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMeeting = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startMeetingTranscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const stopMeetingTranscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * The resource that supports tags.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createMeeting = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createMeetingWithAttendees = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
