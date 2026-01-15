/**
 * Cloudflare STREAM API
 *
 * Generated from Cloudflare TypeScript SDK.
 * DO NOT EDIT - regenerate with: bun scripts/generate-from-sdk.ts --service stream
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import type { HttpClient } from "@effect/platform";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import type { ApiToken } from "../auth.ts";
import { UnknownCloudflareError, CloudflareNetworkError, CloudflareHttpError } from "../errors.ts";

// =============================================================================
// AudioTrack
// =============================================================================

export interface PatchAudioTrackRequest {
  identifier: string;
  audioIdentifier: string;
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Body param: Denotes whether the audio track will be played by default in a player. */
  default?: boolean;
  /** Body param: A string to uniquely identify the track amongst other audio track labels for the specified video. */
  label?: string;
}

export const PatchAudioTrackRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  audioIdentifier: Schema.String.pipe(T.HttpPath("audioIdentifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  default: Schema.optional(Schema.Boolean),
  label: Schema.optional(Schema.String),
}).pipe(
  T.Http({
    method: "PATCH",
    path: "/accounts/{account_id}/stream/{identifier}/audio/{audioIdentifier}",
  }),
) as unknown as Schema.Schema<PatchAudioTrackRequest>;

export interface PatchAudioTrackResponse {
  /** Denotes whether the audio track will be played by default in a player. */
  default?: boolean;
  /** A string to uniquely identify the track amongst other audio track labels for the specified video. */
  label?: string;
  /** Specifies the processing status of the video. */
  status?: "queued" | "ready" | "error";
  /** A Cloudflare-generated unique identifier for a media item. */
  uid?: string;
}

export const PatchAudioTrackResponse = Schema.Struct({
  default: Schema.optional(Schema.Boolean),
  label: Schema.optional(Schema.String),
  status: Schema.optional(Schema.Literal("queued", "ready", "error")),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<PatchAudioTrackResponse>;

export const patchAudioTrack = API.make(() => ({
  input: PatchAudioTrackRequest,
  output: PatchAudioTrackResponse,
  errors: [],
}));

export interface DeleteAudioTrackRequest {
  identifier: string;
  audioIdentifier: string;
  /** The account identifier tag. */
  accountId: string;
}

export const DeleteAudioTrackRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  audioIdentifier: Schema.String.pipe(T.HttpPath("audioIdentifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/stream/{identifier}/audio/{audioIdentifier}",
  }),
) as unknown as Schema.Schema<DeleteAudioTrackRequest>;

export type DeleteAudioTrackResponse = string;

export const DeleteAudioTrackResponse =
  Schema.String as unknown as Schema.Schema<DeleteAudioTrackResponse>;

export const deleteAudioTrack = API.make(() => ({
  input: DeleteAudioTrackRequest,
  output: DeleteAudioTrackResponse,
  errors: [],
}));

export interface CopyAudioTrackRequest {
  identifier: string;
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Body param: A string to uniquely identify the track amongst other audio track labels for the specified video. */
  label: string;
  /** Body param: An audio track URL. The server must be publicly routable and support `HTTP HEAD` requests and `HTTP GET` range requests. The server should respond to `HTTP HEAD` requests with a `content-r */
  url?: string;
}

export const CopyAudioTrackRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  label: Schema.String,
  url: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/stream/{identifier}/audio/copy" }),
) as unknown as Schema.Schema<CopyAudioTrackRequest>;

export interface CopyAudioTrackResponse {
  /** Denotes whether the audio track will be played by default in a player. */
  default?: boolean;
  /** A string to uniquely identify the track amongst other audio track labels for the specified video. */
  label?: string;
  /** Specifies the processing status of the video. */
  status?: "queued" | "ready" | "error";
  /** A Cloudflare-generated unique identifier for a media item. */
  uid?: string;
}

export const CopyAudioTrackResponse = Schema.Struct({
  default: Schema.optional(Schema.Boolean),
  label: Schema.optional(Schema.String),
  status: Schema.optional(Schema.Literal("queued", "ready", "error")),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CopyAudioTrackResponse>;

export const copyAudioTrack = API.make(() => ({
  input: CopyAudioTrackRequest,
  output: CopyAudioTrackResponse,
  errors: [],
}));

// =============================================================================
// CaptionLanguage
// =============================================================================

export interface GetCaptionLanguageRequest {
  identifier: string;
  language: string;
  /** Identifier. */
  accountId: string;
}

export const GetCaptionLanguageRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  language: Schema.String.pipe(T.HttpPath("language")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/stream/{identifier}/captions/{language}" }),
) as unknown as Schema.Schema<GetCaptionLanguageRequest>;

export type GetCaptionLanguageResponse = unknown;

export const GetCaptionLanguageResponse =
  Schema.Unknown as unknown as Schema.Schema<GetCaptionLanguageResponse>;

export const getCaptionLanguage = API.make(() => ({
  input: GetCaptionLanguageRequest,
  output: GetCaptionLanguageResponse,
  errors: [],
}));

export interface CreateCaptionLanguageRequest {
  identifier: string;
  language: string;
  /** Identifier. */
  accountId: string;
}

export const CreateCaptionLanguageRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  language: Schema.String.pipe(T.HttpPath("language")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/stream/{identifier}/captions/{language}/generate",
  }),
) as unknown as Schema.Schema<CreateCaptionLanguageRequest>;

export type CreateCaptionLanguageResponse = unknown;

export const CreateCaptionLanguageResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateCaptionLanguageResponse>;

export const createCaptionLanguage = API.make(() => ({
  input: CreateCaptionLanguageRequest,
  output: CreateCaptionLanguageResponse,
  errors: [],
}));

export interface UpdateCaptionLanguageRequest {
  identifier: string;
  language: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The WebVTT file containing the caption or subtitle content. */
  file: string;
}

export const UpdateCaptionLanguageRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  language: Schema.String.pipe(T.HttpPath("language")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  file: Schema.String,
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/stream/{identifier}/captions/{language}" }),
) as unknown as Schema.Schema<UpdateCaptionLanguageRequest>;

export type UpdateCaptionLanguageResponse = unknown;

export const UpdateCaptionLanguageResponse =
  Schema.Unknown as unknown as Schema.Schema<UpdateCaptionLanguageResponse>;

export const updateCaptionLanguage = API.make(() => ({
  input: UpdateCaptionLanguageRequest,
  output: UpdateCaptionLanguageResponse,
  errors: [],
}));

export interface DeleteCaptionLanguageRequest {
  identifier: string;
  language: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteCaptionLanguageRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  language: Schema.String.pipe(T.HttpPath("language")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/stream/{identifier}/captions/{language}",
  }),
) as unknown as Schema.Schema<DeleteCaptionLanguageRequest>;

export type DeleteCaptionLanguageResponse = string;

export const DeleteCaptionLanguageResponse =
  Schema.String as unknown as Schema.Schema<DeleteCaptionLanguageResponse>;

export const deleteCaptionLanguage = API.make(() => ({
  input: DeleteCaptionLanguageRequest,
  output: DeleteCaptionLanguageResponse,
  errors: [],
}));

// =============================================================================
// CaptionLanguageVtt
// =============================================================================

export interface GetCaptionLanguageVttRequest {
  identifier: string;
  language: string;
  /** Identifier. */
  accountId: string;
}

export const GetCaptionLanguageVttRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  language: Schema.String.pipe(T.HttpPath("language")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/stream/{identifier}/captions/{language}/vtt",
  }),
) as unknown as Schema.Schema<GetCaptionLanguageVttRequest>;

export type GetCaptionLanguageVttResponse = unknown;

export const GetCaptionLanguageVttResponse =
  Schema.Unknown as unknown as Schema.Schema<GetCaptionLanguageVttResponse>;

export const getCaptionLanguageVtt = API.make(() => ({
  input: GetCaptionLanguageVttRequest,
  output: GetCaptionLanguageVttResponse,
  errors: [],
}));

// =============================================================================
// Clip
// =============================================================================

export interface CreateClipRequest {
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Body param: The unique video identifier (UID). */
  clippedFromVideoUID: string;
  /** Body param: Specifies the end time for the video clip in seconds. */
  endTimeSeconds: number;
  /** Body param: Specifies the start time for the video clip in seconds. */
  startTimeSeconds: number;
  /** Body param: Lists the origins allowed to display the video. Enter allowed origin domains in an array and use ` ` for wildcard subdomains. Empty arrays allow the video to be viewed on any origin. */
  allowedOrigins?: string[];
  /** Body param: A user-defined identifier for the media creator. */
  creator?: string;
  /** Body param: The maximum duration in seconds for a video upload. Can be set for a video that is not yet uploaded to limit its duration. Uploads that exceed the specified duration will fail during proce */
  maxDurationSeconds?: number;
  /** Body param: Indicates whether the video can be a accessed using the UID. When set to `true`, a signed token must be generated with a signing key to view the video. */
  requireSignedURLs?: boolean;
  /** Body param: The timestamp for a thumbnail image calculated as a percentage value of the video's duration. To convert from a second-wise timestamp to a percentage, divide the desired timestamp by the t */
  thumbnailTimestampPct?: number;
  /** Body param: */
  watermark?: { uid?: string };
}

export const CreateClipRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  clippedFromVideoUID: Schema.String,
  endTimeSeconds: Schema.Number,
  startTimeSeconds: Schema.Number,
  allowedOrigins: Schema.optional(Schema.Array(Schema.String)),
  creator: Schema.optional(Schema.String),
  maxDurationSeconds: Schema.optional(Schema.Number),
  requireSignedURLs: Schema.optional(Schema.Boolean),
  thumbnailTimestampPct: Schema.optional(Schema.Number),
  watermark: Schema.optional(
    Schema.Struct({
      uid: Schema.optional(Schema.String),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/stream/clip" }),
) as unknown as Schema.Schema<CreateClipRequest>;

export interface CreateClipResponse {
  /** Lists the origins allowed to display the video. Enter allowed origin domains in an array and use ` ` for wildcard subdomains. Empty arrays allow the video to be viewed on any origin. */
  allowedOrigins?: string[];
  /** The unique video identifier (UID). */
  clippedFromVideoUID?: string;
  /** The date and time the clip was created. */
  created?: string;
  /** A user-defined identifier for the media creator. */
  creator?: string;
  /** Specifies the end time for the video clip in seconds. */
  endTimeSeconds?: number;
  /** The maximum duration in seconds for a video upload. Can be set for a video that is not yet uploaded to limit its duration. Uploads that exceed the specified duration will fail during processing. A val */
  maxDurationSeconds?: number;
  /** A user modifiable key-value store used to reference other systems of record for managing videos. */
  meta?: unknown;
  /** The date and time the live input was last modified. */
  modified?: string;
  playback?: { dash?: string; hls?: string };
  /** The video's preview page URI. This field is omitted until encoding is complete. */
  preview?: string;
  /** Indicates whether the video can be a accessed using the UID. When set to `true`, a signed token must be generated with a signing key to view the video. */
  requireSignedURLs?: boolean;
  /** Specifies the start time for the video clip in seconds. */
  startTimeSeconds?: number;
  /** Specifies the processing status for all quality levels for a video. */
  status?:
    | "pendingupload"
    | "downloading"
    | "queued"
    | "inprogress"
    | "ready"
    | "error"
    | "live-inprogress";
  /** The timestamp for a thumbnail image calculated as a percentage value of the video's duration. To convert from a second-wise timestamp to a percentage, divide the desired timestamp by the total duratio */
  thumbnailTimestampPct?: number;
  watermark?: { uid?: string };
}

export const CreateClipResponse = Schema.Struct({
  allowedOrigins: Schema.optional(Schema.Array(Schema.String)),
  clippedFromVideoUID: Schema.optional(Schema.String),
  created: Schema.optional(Schema.String),
  creator: Schema.optional(Schema.String),
  endTimeSeconds: Schema.optional(Schema.Number),
  maxDurationSeconds: Schema.optional(Schema.Number),
  meta: Schema.optional(Schema.Unknown),
  modified: Schema.optional(Schema.String),
  playback: Schema.optional(
    Schema.Struct({
      dash: Schema.optional(Schema.String),
      hls: Schema.optional(Schema.String),
    }),
  ),
  preview: Schema.optional(Schema.String),
  requireSignedURLs: Schema.optional(Schema.Boolean),
  startTimeSeconds: Schema.optional(Schema.Number),
  status: Schema.optional(
    Schema.Literal(
      "pendingupload",
      "downloading",
      "queued",
      "inprogress",
      "ready",
      "error",
      "live-inprogress",
    ),
  ),
  thumbnailTimestampPct: Schema.optional(Schema.Number),
  watermark: Schema.optional(
    Schema.Struct({
      uid: Schema.optional(Schema.String),
    }),
  ),
}) as unknown as Schema.Schema<CreateClipResponse>;

export const createClip = API.make(() => ({
  input: CreateClipRequest,
  output: CreateClipResponse,
  errors: [],
}));

// =============================================================================
// Copy
// =============================================================================

export interface CreateCopyRequest {
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Header param: A user-defined identifier for the media creator. */
  "Upload-Creator"?: string;
  /** Body param: A video's URL. The server must be publicly routable and support `HTTP HEAD` requests and `HTTP GET` range requests. The server should respond to `HTTP HEAD` requests with a `content-range` */
  url: string;
  /** Body param: Lists the origins allowed to display the video. Enter allowed origin domains in an array and use ` ` for wildcard subdomains. Empty arrays allow the video to be viewed on any origin. */
  allowedOrigins?: string[];
  /** Body param: A user-defined identifier for the media creator. */
  creator?: string;
  /** Body param: A user modifiable key-value store used to reference other systems of record for managing videos. */
  meta?: unknown;
  /** Body param: Indicates whether the video can be a accessed using the UID. When set to `true`, a signed token must be generated with a signing key to view the video. */
  requireSignedURLs?: boolean;
  /** Body param: Indicates the date and time at which the video will be deleted. Omit the field to indicate no change, or include with a `null` value to remove an existing scheduled deletion. If specified, */
  scheduledDeletion?: string;
  /** Body param: The timestamp for a thumbnail image calculated as a percentage value of the video's duration. To convert from a second-wise timestamp to a percentage, divide the desired timestamp by the t */
  thumbnailTimestampPct?: number;
  /** Body param: */
  watermark?: { uid?: string };
}

export const CreateCopyRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  "Upload-Creator": Schema.optional(Schema.String).pipe(T.HttpHeader("'Upload-Creator'")),
  url: Schema.String,
  allowedOrigins: Schema.optional(Schema.Array(Schema.String)),
  creator: Schema.optional(Schema.String),
  meta: Schema.optional(Schema.Unknown),
  requireSignedURLs: Schema.optional(Schema.Boolean),
  scheduledDeletion: Schema.optional(Schema.String),
  thumbnailTimestampPct: Schema.optional(Schema.Number),
  watermark: Schema.optional(
    Schema.Struct({
      uid: Schema.optional(Schema.String),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/stream/copy" }),
) as unknown as Schema.Schema<CreateCopyRequest>;

export type CreateCopyResponse = unknown;

export const CreateCopyResponse = Schema.Unknown as unknown as Schema.Schema<CreateCopyResponse>;

export const createCopy = API.make(() => ({
  input: CreateCopyRequest,
  output: CreateCopyResponse,
  errors: [],
}));

// =============================================================================
// DirectUpload
// =============================================================================

export interface CreateDirectUploadRequest {
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Header param: A user-defined identifier for the media creator. */
  "Upload-Creator"?: string;
  /** Body param: The maximum duration in seconds for a video upload. Can be set for a video that is not yet uploaded to limit its duration. Uploads that exceed the specified duration will fail during proce */
  maxDurationSeconds: number;
  /** Body param: Lists the origins allowed to display the video. Enter allowed origin domains in an array and use ` ` for wildcard subdomains. Empty arrays allow the video to be viewed on any origin. */
  allowedOrigins?: string[];
  /** Body param: A user-defined identifier for the media creator. */
  creator?: string;
  /** Body param: The date and time after upload when videos will not be accepted. */
  expiry?: string;
  /** Body param: A user modifiable key-value store used to reference other systems of record for managing videos. */
  meta?: unknown;
  /** Body param: Indicates whether the video can be a accessed using the UID. When set to `true`, a signed token must be generated with a signing key to view the video. */
  requireSignedURLs?: boolean;
  /** Body param: Indicates the date and time at which the video will be deleted. Omit the field to indicate no change, or include with a `null` value to remove an existing scheduled deletion. If specified, */
  scheduledDeletion?: string;
  /** Body param: The timestamp for a thumbnail image calculated as a percentage value of the video's duration. To convert from a second-wise timestamp to a percentage, divide the desired timestamp by the t */
  thumbnailTimestampPct?: number;
  /** Body param: */
  watermark?: { uid?: string };
}

export const CreateDirectUploadRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  "Upload-Creator": Schema.optional(Schema.String).pipe(T.HttpHeader("'Upload-Creator'")),
  maxDurationSeconds: Schema.Number,
  allowedOrigins: Schema.optional(Schema.Array(Schema.String)),
  creator: Schema.optional(Schema.String),
  expiry: Schema.optional(Schema.String),
  meta: Schema.optional(Schema.Unknown),
  requireSignedURLs: Schema.optional(Schema.Boolean),
  scheduledDeletion: Schema.optional(Schema.String),
  thumbnailTimestampPct: Schema.optional(Schema.Number),
  watermark: Schema.optional(
    Schema.Struct({
      uid: Schema.optional(Schema.String),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/stream/direct_upload" }),
) as unknown as Schema.Schema<CreateDirectUploadRequest>;

export interface CreateDirectUploadResponse {
  /** Indicates the date and time at which the video will be deleted. Omit the field to indicate no change, or include with a `null` value to remove an existing scheduled deletion. If specified, must be at  */
  scheduledDeletion?: string;
  /** A Cloudflare-generated unique identifier for a media item. */
  uid?: string;
  /** The URL an unauthenticated upload can use for a single `HTTP POST multipart/form-data` request. */
  uploadURL?: string;
  watermark?: unknown;
}

export const CreateDirectUploadResponse = Schema.Struct({
  scheduledDeletion: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
  uploadURL: Schema.optional(Schema.String),
  watermark: Schema.optional(Schema.Unknown),
}) as unknown as Schema.Schema<CreateDirectUploadResponse>;

export const createDirectUpload = API.make(() => ({
  input: CreateDirectUploadRequest,
  output: CreateDirectUploadResponse,
  errors: [],
}));

// =============================================================================
// Download
// =============================================================================

export interface GetDownloadRequest {
  identifier: string;
  /** Identifier. */
  accountId: string;
}

export const GetDownloadRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/stream/{identifier}/downloads" }),
) as unknown as Schema.Schema<GetDownloadRequest>;

export type GetDownloadResponse = unknown;

export const GetDownloadResponse = Schema.Unknown as unknown as Schema.Schema<GetDownloadResponse>;

export const getDownload = API.make(() => ({
  input: GetDownloadRequest,
  output: GetDownloadResponse,
  errors: [],
}));

export interface CreateDownloadRequest {
  identifier: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const CreateDownloadRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/stream/{identifier}/downloads" }),
) as unknown as Schema.Schema<CreateDownloadRequest>;

export type CreateDownloadResponse = unknown;

export const CreateDownloadResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateDownloadResponse>;

export const createDownload = API.make(() => ({
  input: CreateDownloadRequest,
  output: CreateDownloadResponse,
  errors: [],
}));

export interface DeleteDownloadRequest {
  identifier: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteDownloadRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/stream/{identifier}/downloads" }),
) as unknown as Schema.Schema<DeleteDownloadRequest>;

export type DeleteDownloadResponse = string;

export const DeleteDownloadResponse =
  Schema.String as unknown as Schema.Schema<DeleteDownloadResponse>;

export const deleteDownload = API.make(() => ({
  input: DeleteDownloadRequest,
  output: DeleteDownloadResponse,
  errors: [],
}));

// =============================================================================
// Embed
// =============================================================================

export interface GetEmbedRequest {
  identifier: string;
  /** The account identifier tag. */
  accountId: string;
}

export const GetEmbedRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/stream/{identifier}/embed" }),
) as unknown as Schema.Schema<GetEmbedRequest>;

export type GetEmbedResponse = unknown;

export const GetEmbedResponse = Schema.Unknown as unknown as Schema.Schema<GetEmbedResponse>;

export const getEmbed = API.make(() => ({
  input: GetEmbedRequest,
  output: GetEmbedResponse,
  errors: [],
}));

// =============================================================================
// Key
// =============================================================================

export interface CreateKeyRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: */
  body: unknown;
}

export const CreateKeyRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  body: Schema.Unknown,
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/stream/keys" }),
) as unknown as Schema.Schema<CreateKeyRequest>;

export interface CreateKeyResponse {
  /** Identifier. */
  id?: string;
  /** The date and time a signing key was created. */
  created?: string;
  /** The signing key in JWK format. */
  jwk?: string;
  /** The signing key in PEM format. */
  pem?: string;
}

export const CreateKeyResponse = Schema.Struct({
  id: Schema.optional(Schema.String),
  created: Schema.optional(Schema.String),
  jwk: Schema.optional(Schema.String),
  pem: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateKeyResponse>;

export const createKey = API.make(() => ({
  input: CreateKeyRequest,
  output: CreateKeyResponse,
  errors: [],
}));

export interface DeleteKeyRequest {
  identifier: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteKeyRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/stream/keys/{identifier}" }),
) as unknown as Schema.Schema<DeleteKeyRequest>;

export type DeleteKeyResponse = string;

export const DeleteKeyResponse = Schema.String as unknown as Schema.Schema<DeleteKeyResponse>;

export const deleteKey = API.make(() => ({
  input: DeleteKeyRequest,
  output: DeleteKeyResponse,
  errors: [],
}));

// =============================================================================
// LiveInput
// =============================================================================

export interface GetLiveInputRequest {
  liveInputIdentifier: string;
  /** Identifier. */
  accountId: string;
}

export const GetLiveInputRequest = Schema.Struct({
  liveInputIdentifier: Schema.String.pipe(T.HttpPath("liveInputIdentifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "GET",
    path: "/accounts/{account_id}/stream/live_inputs/{liveInputIdentifier}",
  }),
) as unknown as Schema.Schema<GetLiveInputRequest>;

export interface GetLiveInputResponse {
  /** The date and time the live input was created. */
  created?: string;
  /** Indicates the number of days after which the live inputs recordings will be deleted. When a stream completes and the recording is ready, the value is used to calculate a scheduled deletion date for th */
  deleteRecordingAfterDays?: number;
  /** A user modifiable key-value store used to reference other systems of record for managing live inputs. */
  meta?: unknown;
  /** The date and time the live input was last modified. */
  modified?: string;
  /** A unique identifier for a live input. */
  uid?: string;
}

export const GetLiveInputResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  deleteRecordingAfterDays: Schema.optional(Schema.Number),
  meta: Schema.optional(Schema.Unknown),
  modified: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<GetLiveInputResponse>;

export const getLiveInput = API.make(() => ({
  input: GetLiveInputRequest,
  output: GetLiveInputResponse,
  errors: [],
}));

export interface ListLiveInputsRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Query param: Includes the total number of videos associated with the submitted query parameters. */
  includeCounts?: boolean;
}

export const ListLiveInputsRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  includeCounts: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("include_counts")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/stream/live_inputs" }),
) as unknown as Schema.Schema<ListLiveInputsRequest>;

export interface ListLiveInputsResponse {
  liveInputs?: {
    created?: string;
    deleteRecordingAfterDays?: number;
    meta?: unknown;
    modified?: string;
    uid?: string;
  }[];
  /** The total number of remaining live inputs based on cursor position. */
  range?: number;
  /** The total number of live inputs that match the provided filters. */
  total?: number;
}

export const ListLiveInputsResponse = Schema.Struct({
  liveInputs: Schema.optional(
    Schema.Array(
      Schema.Struct({
        created: Schema.optional(Schema.String),
        deleteRecordingAfterDays: Schema.optional(Schema.Number),
        meta: Schema.optional(Schema.Unknown),
        modified: Schema.optional(Schema.String),
        uid: Schema.optional(Schema.String),
      }),
    ),
  ),
  range: Schema.optional(Schema.Number),
  total: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<ListLiveInputsResponse>;

export const listLiveInputs = API.make(() => ({
  input: ListLiveInputsRequest,
  output: ListLiveInputsResponse,
  errors: [],
}));

export interface CreateLiveInputRequest {
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Sets the creator ID asssociated with this live input. */
  defaultCreator?: string;
  /** Body param: Indicates the number of days after which the live inputs recordings will be deleted. When a stream completes and the recording is ready, the value is used to calculate a scheduled deletion */
  deleteRecordingAfterDays?: number;
  /** Body param: A user modifiable key-value store used to reference other systems of record for managing live inputs. */
  meta?: unknown;
  /** Body param: Records the input to a Cloudflare Stream video. Behavior depends on the mode. In most cases, the video will initially be viewable as a live video and transition to on-demand after a condit */
  recording?: {
    allowedOrigins?: string[];
    hideLiveViewerCount?: boolean;
    mode?: "off" | "automatic";
    requireSignedURLs?: boolean;
    timeoutSeconds?: number;
  };
}

export const CreateLiveInputRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  defaultCreator: Schema.optional(Schema.String),
  deleteRecordingAfterDays: Schema.optional(Schema.Number),
  meta: Schema.optional(Schema.Unknown),
  recording: Schema.optional(
    Schema.Struct({
      allowedOrigins: Schema.optional(Schema.Array(Schema.String)),
      hideLiveViewerCount: Schema.optional(Schema.Boolean),
      mode: Schema.optional(Schema.Literal("off", "automatic")),
      requireSignedURLs: Schema.optional(Schema.Boolean),
      timeoutSeconds: Schema.optional(Schema.Number),
    }),
  ),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/stream/live_inputs" }),
) as unknown as Schema.Schema<CreateLiveInputRequest>;

export interface CreateLiveInputResponse {
  /** The date and time the live input was created. */
  created?: string;
  /** Indicates the number of days after which the live inputs recordings will be deleted. When a stream completes and the recording is ready, the value is used to calculate a scheduled deletion date for th */
  deleteRecordingAfterDays?: number;
  /** A user modifiable key-value store used to reference other systems of record for managing live inputs. */
  meta?: unknown;
  /** The date and time the live input was last modified. */
  modified?: string;
  /** A unique identifier for a live input. */
  uid?: string;
}

export const CreateLiveInputResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  deleteRecordingAfterDays: Schema.optional(Schema.Number),
  meta: Schema.optional(Schema.Unknown),
  modified: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateLiveInputResponse>;

export const createLiveInput = API.make(() => ({
  input: CreateLiveInputRequest,
  output: CreateLiveInputResponse,
  errors: [],
}));

export interface UpdateLiveInputRequest {
  liveInputIdentifier: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: Sets the creator ID asssociated with this live input. */
  defaultCreator?: string;
  /** Body param: Indicates the number of days after which the live inputs recordings will be deleted. When a stream completes and the recording is ready, the value is used to calculate a scheduled deletion */
  deleteRecordingAfterDays?: number;
  /** Body param: A user modifiable key-value store used to reference other systems of record for managing live inputs. */
  meta?: unknown;
  /** Body param: Records the input to a Cloudflare Stream video. Behavior depends on the mode. In most cases, the video will initially be viewable as a live video and transition to on-demand after a condit */
  recording?: {
    allowedOrigins?: string[];
    hideLiveViewerCount?: boolean;
    mode?: "off" | "automatic";
    requireSignedURLs?: boolean;
    timeoutSeconds?: number;
  };
}

export const UpdateLiveInputRequest = Schema.Struct({
  liveInputIdentifier: Schema.String.pipe(T.HttpPath("liveInputIdentifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  defaultCreator: Schema.optional(Schema.String),
  deleteRecordingAfterDays: Schema.optional(Schema.Number),
  meta: Schema.optional(Schema.Unknown),
  recording: Schema.optional(
    Schema.Struct({
      allowedOrigins: Schema.optional(Schema.Array(Schema.String)),
      hideLiveViewerCount: Schema.optional(Schema.Boolean),
      mode: Schema.optional(Schema.Literal("off", "automatic")),
      requireSignedURLs: Schema.optional(Schema.Boolean),
      timeoutSeconds: Schema.optional(Schema.Number),
    }),
  ),
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/stream/live_inputs/{liveInputIdentifier}",
  }),
) as unknown as Schema.Schema<UpdateLiveInputRequest>;

export interface UpdateLiveInputResponse {
  /** The date and time the live input was created. */
  created?: string;
  /** Indicates the number of days after which the live inputs recordings will be deleted. When a stream completes and the recording is ready, the value is used to calculate a scheduled deletion date for th */
  deleteRecordingAfterDays?: number;
  /** A user modifiable key-value store used to reference other systems of record for managing live inputs. */
  meta?: unknown;
  /** The date and time the live input was last modified. */
  modified?: string;
  /** A unique identifier for a live input. */
  uid?: string;
}

export const UpdateLiveInputResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  deleteRecordingAfterDays: Schema.optional(Schema.Number),
  meta: Schema.optional(Schema.Unknown),
  modified: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateLiveInputResponse>;

export const updateLiveInput = API.make(() => ({
  input: UpdateLiveInputRequest,
  output: UpdateLiveInputResponse,
  errors: [],
}));

export interface DeleteLiveInputRequest {
  liveInputIdentifier: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteLiveInputRequest = Schema.Struct({
  liveInputIdentifier: Schema.String.pipe(T.HttpPath("liveInputIdentifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/stream/live_inputs/{liveInputIdentifier}",
  }),
) as unknown as Schema.Schema<DeleteLiveInputRequest>;

export type DeleteLiveInputResponse = unknown;

export const DeleteLiveInputResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteLiveInputResponse>;

export const deleteLiveInput = API.make(() => ({
  input: DeleteLiveInputRequest,
  output: DeleteLiveInputResponse,
  errors: [],
}));

// =============================================================================
// LiveInputOutput
// =============================================================================

export interface CreateLiveInputOutputRequest {
  liveInputIdentifier: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: The streamKey used to authenticate against an output's target. */
  streamKey: string;
  /** Body param: The URL an output uses to restream. */
  url: string;
  /** Body param: When enabled, live video streamed to the associated live input will be sent to the output URL. When disabled, live video will not be sent to the output URL, even when streaming to the asso */
  enabled?: boolean;
}

export const CreateLiveInputOutputRequest = Schema.Struct({
  liveInputIdentifier: Schema.String.pipe(T.HttpPath("liveInputIdentifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  streamKey: Schema.String,
  url: Schema.String,
  enabled: Schema.optional(Schema.Boolean),
}).pipe(
  T.Http({
    method: "POST",
    path: "/accounts/{account_id}/stream/live_inputs/{liveInputIdentifier}/outputs",
  }),
) as unknown as Schema.Schema<CreateLiveInputOutputRequest>;

export interface CreateLiveInputOutputResponse {
  /** When enabled, live video streamed to the associated live input will be sent to the output URL. When disabled, live video will not be sent to the output URL, even when streaming to the associated live  */
  enabled?: boolean;
  /** The streamKey used to authenticate against an output's target. */
  streamKey?: string;
  /** A unique identifier for the output. */
  uid?: string;
  /** The URL an output uses to restream. */
  url?: string;
}

export const CreateLiveInputOutputResponse = Schema.Struct({
  enabled: Schema.optional(Schema.Boolean),
  streamKey: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
  url: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateLiveInputOutputResponse>;

export const createLiveInputOutput = API.make(() => ({
  input: CreateLiveInputOutputRequest,
  output: CreateLiveInputOutputResponse,
  errors: [],
}));

export interface UpdateLiveInputOutputRequest {
  liveInputIdentifier: string;
  outputIdentifier: string;
  /** Path param: Identifier. */
  accountId: string;
  /** Body param: When enabled, live video streamed to the associated live input will be sent to the output URL. When disabled, live video will not be sent to the output URL, even when streaming to the asso */
  enabled: boolean;
}

export const UpdateLiveInputOutputRequest = Schema.Struct({
  liveInputIdentifier: Schema.String.pipe(T.HttpPath("liveInputIdentifier")),
  outputIdentifier: Schema.String.pipe(T.HttpPath("outputIdentifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  enabled: Schema.Boolean,
}).pipe(
  T.Http({
    method: "PUT",
    path: "/accounts/{account_id}/stream/live_inputs/{liveInputIdentifier}/outputs/{outputIdentifier}",
  }),
) as unknown as Schema.Schema<UpdateLiveInputOutputRequest>;

export interface UpdateLiveInputOutputResponse {
  /** When enabled, live video streamed to the associated live input will be sent to the output URL. When disabled, live video will not be sent to the output URL, even when streaming to the associated live  */
  enabled?: boolean;
  /** The streamKey used to authenticate against an output's target. */
  streamKey?: string;
  /** A unique identifier for the output. */
  uid?: string;
  /** The URL an output uses to restream. */
  url?: string;
}

export const UpdateLiveInputOutputResponse = Schema.Struct({
  enabled: Schema.optional(Schema.Boolean),
  streamKey: Schema.optional(Schema.String),
  uid: Schema.optional(Schema.String),
  url: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<UpdateLiveInputOutputResponse>;

export const updateLiveInputOutput = API.make(() => ({
  input: UpdateLiveInputOutputRequest,
  output: UpdateLiveInputOutputResponse,
  errors: [],
}));

export interface DeleteLiveInputOutputRequest {
  liveInputIdentifier: string;
  outputIdentifier: string;
  /** Identifier. */
  accountId: string;
}

export const DeleteLiveInputOutputRequest = Schema.Struct({
  liveInputIdentifier: Schema.String.pipe(T.HttpPath("liveInputIdentifier")),
  outputIdentifier: Schema.String.pipe(T.HttpPath("outputIdentifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({
    method: "DELETE",
    path: "/accounts/{account_id}/stream/live_inputs/{liveInputIdentifier}/outputs/{outputIdentifier}",
  }),
) as unknown as Schema.Schema<DeleteLiveInputOutputRequest>;

export type DeleteLiveInputOutputResponse = unknown;

export const DeleteLiveInputOutputResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteLiveInputOutputResponse>;

export const deleteLiveInputOutput = API.make(() => ({
  input: DeleteLiveInputOutputRequest,
  output: DeleteLiveInputOutputResponse,
  errors: [],
}));

// =============================================================================
// Stream
// =============================================================================

export interface GetStreamRequest {
  identifier: string;
  /** The account identifier tag. */
  accountId: string;
}

export const GetStreamRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/stream/{identifier}" }),
) as unknown as Schema.Schema<GetStreamRequest>;

export interface GetStreamResponse {
  /** Lists the origins allowed to display the video. Enter allowed origin domains in an array and use ` ` for wildcard subdomains. Empty arrays allow the video to be viewed on any origin. */
  allowedOrigins?: string[];
  /** The date and time the media item was created. */
  created?: string;
  /** A user-defined identifier for the media creator. */
  creator?: string;
  /** The duration of the video in seconds. A value of `-1` means the duration is unknown. The duration becomes available after the upload and before the video is ready. */
  duration?: number;
  input?: { height?: number; width?: number };
  /** The live input ID used to upload a video with Stream Live. */
  liveInput?: string;
  /** The maximum duration in seconds for a video upload. Can be set for a video that is not yet uploaded to limit its duration. Uploads that exceed the specified duration will fail during processing. A val */
  maxDurationSeconds?: number;
  /** A user modifiable key-value store used to reference other systems of record for managing videos. */
  meta?: unknown;
  /** The date and time the media item was last modified. */
  modified?: string;
  playback?: { dash?: string; hls?: string };
  /** The video's preview page URI. This field is omitted until encoding is complete. */
  preview?: string;
  /** Indicates whether the video is playable. The field is empty if the video is not ready for viewing or the live stream is still in progress. */
  readyToStream?: boolean;
  /** Indicates the time at which the video became playable. The field is empty if the video is not ready for viewing or the live stream is still in progress. */
  readyToStreamAt?: string;
  /** Indicates whether the video can be a accessed using the UID. When set to `true`, a signed token must be generated with a signing key to view the video. */
  requireSignedURLs?: boolean;
  /** Indicates the date and time at which the video will be deleted. Omit the field to indicate no change, or include with a `null` value to remove an existing scheduled deletion. If specified, must be at  */
  scheduledDeletion?: string;
  /** The size of the media item in bytes. */
  size?: number;
  /** Specifies a detailed status for a video. If the `state` is `inprogress` or `error`, the `step` field returns `encoding` or `manifest`. If the `state` is `inprogress`, `pctComplete` returns a number be */
  status?: {
    errorReasonCode?: string;
    errorReasonText?: string;
    pctComplete?: string;
    state?:
      | "pendingupload"
      | "downloading"
      | "queued"
      | "inprogress"
      | "ready"
      | "error"
      | "live-inprogress";
  };
  /** The media item's thumbnail URI. This field is omitted until encoding is complete. */
  thumbnail?: string;
  /** The timestamp for a thumbnail image calculated as a percentage value of the video's duration. To convert from a second-wise timestamp to a percentage, divide the desired timestamp by the total duratio */
  thumbnailTimestampPct?: number;
  /** A Cloudflare-generated unique identifier for a media item. */
  uid?: string;
  /** The date and time the media item was uploaded. */
  uploaded?: string;
  /** The date and time when the video upload URL is no longer valid for direct user uploads. */
  uploadExpiry?: string;
  watermark?: unknown;
}

export const GetStreamResponse = Schema.Struct({
  allowedOrigins: Schema.optional(Schema.Array(Schema.String)),
  created: Schema.optional(Schema.String),
  creator: Schema.optional(Schema.String),
  duration: Schema.optional(Schema.Number),
  input: Schema.optional(
    Schema.Struct({
      height: Schema.optional(Schema.Number),
      width: Schema.optional(Schema.Number),
    }),
  ),
  liveInput: Schema.optional(Schema.String),
  maxDurationSeconds: Schema.optional(Schema.Number),
  meta: Schema.optional(Schema.Unknown),
  modified: Schema.optional(Schema.String),
  playback: Schema.optional(
    Schema.Struct({
      dash: Schema.optional(Schema.String),
      hls: Schema.optional(Schema.String),
    }),
  ),
  preview: Schema.optional(Schema.String),
  readyToStream: Schema.optional(Schema.Boolean),
  readyToStreamAt: Schema.optional(Schema.String),
  requireSignedURLs: Schema.optional(Schema.Boolean),
  scheduledDeletion: Schema.optional(Schema.String),
  size: Schema.optional(Schema.Number),
  status: Schema.optional(
    Schema.Struct({
      errorReasonCode: Schema.optional(Schema.String),
      errorReasonText: Schema.optional(Schema.String),
      pctComplete: Schema.optional(Schema.String),
      state: Schema.optional(
        Schema.Literal(
          "pendingupload",
          "downloading",
          "queued",
          "inprogress",
          "ready",
          "error",
          "live-inprogress",
        ),
      ),
    }),
  ),
  thumbnail: Schema.optional(Schema.String),
  thumbnailTimestampPct: Schema.optional(Schema.Number),
  uid: Schema.optional(Schema.String),
  uploaded: Schema.optional(Schema.String),
  uploadExpiry: Schema.optional(Schema.String),
  watermark: Schema.optional(Schema.Unknown),
}) as unknown as Schema.Schema<GetStreamResponse>;

export const getStream = API.make(() => ({
  input: GetStreamRequest,
  output: GetStreamResponse,
  errors: [],
}));

export interface CreateStreamRequest {
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Query param: Provisions a URL to let your end users upload videos directly to Cloudflare Stream without exposing your API token to clients. */
  directUser?: boolean;
  /** Header param: Specifies the TUS protocol version. This value must be included in every upload request. Notes: The only supported version of TUS protocol is 1.0.0. */
  "Tus-Resumable": "1.0.0";
  /** Header param: Indicates the size of the entire upload in bytes. The value must be a non-negative integer. */
  "Upload-Length": number;
  /** Header param: A user-defined identifier for the media creator. */
  "Upload-Creator"?: string;
  /** Header param: Comma-separated key-value pairs following the TUS protocol specification. Values are Base-64 encoded. Supported keys: `name`, `requiresignedurls`, `allowedorigins`, `thumbnailtimestamppc */
  "Upload-Metadata"?: string;
  /** Body param: */
  body: unknown;
}

export const CreateStreamRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  directUser: Schema.optional(Schema.Boolean).pipe(T.HttpQuery("direct_user")),
  "Tus-Resumable": Schema.Literal("1.0.0").pipe(T.HttpHeader("'Tus-Resumable'")),
  "Upload-Length": Schema.Number.pipe(T.HttpHeader("'Upload-Length'")),
  "Upload-Creator": Schema.optional(Schema.String).pipe(T.HttpHeader("'Upload-Creator'")),
  "Upload-Metadata": Schema.optional(Schema.String).pipe(T.HttpHeader("'Upload-Metadata'")),
  body: Schema.Unknown,
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/stream" }),
) as unknown as Schema.Schema<CreateStreamRequest>;

export type CreateStreamResponse = unknown;

export const CreateStreamResponse =
  Schema.Unknown as unknown as Schema.Schema<CreateStreamResponse>;

export const createStream = API.make(() => ({
  input: CreateStreamRequest,
  output: CreateStreamResponse,
  errors: [],
}));

export interface DeleteStreamRequest {
  identifier: string;
  /** The account identifier tag. */
  accountId: string;
}

export const DeleteStreamRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/stream/{identifier}" }),
) as unknown as Schema.Schema<DeleteStreamRequest>;

export type DeleteStreamResponse = unknown;

export const DeleteStreamResponse =
  Schema.Unknown as unknown as Schema.Schema<DeleteStreamResponse>;

export const deleteStream = API.make(() => ({
  input: DeleteStreamRequest,
  output: DeleteStreamResponse,
  errors: [],
}));

export interface EditStreamRequest {
  identifier: string;
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Body param: Lists the origins allowed to display the video. Enter allowed origin domains in an array and use ` ` for wildcard subdomains. Empty arrays allow the video to be viewed on any origin. */
  allowedOrigins?: string[];
  /** Body param: A user-defined identifier for the media creator. */
  creator?: string;
  /** Body param: The maximum duration in seconds for a video upload. Can be set for a video that is not yet uploaded to limit its duration. Uploads that exceed the specified duration will fail during proce */
  maxDurationSeconds?: number;
  /** Body param: A user modifiable key-value store used to reference other systems of record for managing videos. */
  meta?: unknown;
  /** Body param: Indicates whether the video can be a accessed using the UID. When set to `true`, a signed token must be generated with a signing key to view the video. */
  requireSignedURLs?: boolean;
  /** Body param: Indicates the date and time at which the video will be deleted. Omit the field to indicate no change, or include with a `null` value to remove an existing scheduled deletion. If specified, */
  scheduledDeletion?: string;
  /** Body param: The timestamp for a thumbnail image calculated as a percentage value of the video's duration. To convert from a second-wise timestamp to a percentage, divide the desired timestamp by the t */
  thumbnailTimestampPct?: number;
  /** Body param: The date and time when the video upload URL is no longer valid for direct user uploads. */
  uploadExpiry?: string;
}

export const EditStreamRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  allowedOrigins: Schema.optional(Schema.Array(Schema.String)),
  creator: Schema.optional(Schema.String),
  maxDurationSeconds: Schema.optional(Schema.Number),
  meta: Schema.optional(Schema.Unknown),
  requireSignedURLs: Schema.optional(Schema.Boolean),
  scheduledDeletion: Schema.optional(Schema.String),
  thumbnailTimestampPct: Schema.optional(Schema.Number),
  uploadExpiry: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/stream/{identifier}" }),
) as unknown as Schema.Schema<EditStreamRequest>;

export interface EditStreamResponse {
  /** Lists the origins allowed to display the video. Enter allowed origin domains in an array and use ` ` for wildcard subdomains. Empty arrays allow the video to be viewed on any origin. */
  allowedOrigins?: string[];
  /** The date and time the media item was created. */
  created?: string;
  /** A user-defined identifier for the media creator. */
  creator?: string;
  /** The duration of the video in seconds. A value of `-1` means the duration is unknown. The duration becomes available after the upload and before the video is ready. */
  duration?: number;
  input?: { height?: number; width?: number };
  /** The live input ID used to upload a video with Stream Live. */
  liveInput?: string;
  /** The maximum duration in seconds for a video upload. Can be set for a video that is not yet uploaded to limit its duration. Uploads that exceed the specified duration will fail during processing. A val */
  maxDurationSeconds?: number;
  /** A user modifiable key-value store used to reference other systems of record for managing videos. */
  meta?: unknown;
  /** The date and time the media item was last modified. */
  modified?: string;
  playback?: { dash?: string; hls?: string };
  /** The video's preview page URI. This field is omitted until encoding is complete. */
  preview?: string;
  /** Indicates whether the video is playable. The field is empty if the video is not ready for viewing or the live stream is still in progress. */
  readyToStream?: boolean;
  /** Indicates the time at which the video became playable. The field is empty if the video is not ready for viewing or the live stream is still in progress. */
  readyToStreamAt?: string;
  /** Indicates whether the video can be a accessed using the UID. When set to `true`, a signed token must be generated with a signing key to view the video. */
  requireSignedURLs?: boolean;
  /** Indicates the date and time at which the video will be deleted. Omit the field to indicate no change, or include with a `null` value to remove an existing scheduled deletion. If specified, must be at  */
  scheduledDeletion?: string;
  /** The size of the media item in bytes. */
  size?: number;
  /** Specifies a detailed status for a video. If the `state` is `inprogress` or `error`, the `step` field returns `encoding` or `manifest`. If the `state` is `inprogress`, `pctComplete` returns a number be */
  status?: {
    errorReasonCode?: string;
    errorReasonText?: string;
    pctComplete?: string;
    state?:
      | "pendingupload"
      | "downloading"
      | "queued"
      | "inprogress"
      | "ready"
      | "error"
      | "live-inprogress";
  };
  /** The media item's thumbnail URI. This field is omitted until encoding is complete. */
  thumbnail?: string;
  /** The timestamp for a thumbnail image calculated as a percentage value of the video's duration. To convert from a second-wise timestamp to a percentage, divide the desired timestamp by the total duratio */
  thumbnailTimestampPct?: number;
  /** A Cloudflare-generated unique identifier for a media item. */
  uid?: string;
  /** The date and time the media item was uploaded. */
  uploaded?: string;
  /** The date and time when the video upload URL is no longer valid for direct user uploads. */
  uploadExpiry?: string;
  watermark?: unknown;
}

export const EditStreamResponse = Schema.Struct({
  allowedOrigins: Schema.optional(Schema.Array(Schema.String)),
  created: Schema.optional(Schema.String),
  creator: Schema.optional(Schema.String),
  duration: Schema.optional(Schema.Number),
  input: Schema.optional(
    Schema.Struct({
      height: Schema.optional(Schema.Number),
      width: Schema.optional(Schema.Number),
    }),
  ),
  liveInput: Schema.optional(Schema.String),
  maxDurationSeconds: Schema.optional(Schema.Number),
  meta: Schema.optional(Schema.Unknown),
  modified: Schema.optional(Schema.String),
  playback: Schema.optional(
    Schema.Struct({
      dash: Schema.optional(Schema.String),
      hls: Schema.optional(Schema.String),
    }),
  ),
  preview: Schema.optional(Schema.String),
  readyToStream: Schema.optional(Schema.Boolean),
  readyToStreamAt: Schema.optional(Schema.String),
  requireSignedURLs: Schema.optional(Schema.Boolean),
  scheduledDeletion: Schema.optional(Schema.String),
  size: Schema.optional(Schema.Number),
  status: Schema.optional(
    Schema.Struct({
      errorReasonCode: Schema.optional(Schema.String),
      errorReasonText: Schema.optional(Schema.String),
      pctComplete: Schema.optional(Schema.String),
      state: Schema.optional(
        Schema.Literal(
          "pendingupload",
          "downloading",
          "queued",
          "inprogress",
          "ready",
          "error",
          "live-inprogress",
        ),
      ),
    }),
  ),
  thumbnail: Schema.optional(Schema.String),
  thumbnailTimestampPct: Schema.optional(Schema.Number),
  uid: Schema.optional(Schema.String),
  uploaded: Schema.optional(Schema.String),
  uploadExpiry: Schema.optional(Schema.String),
  watermark: Schema.optional(Schema.Unknown),
}) as unknown as Schema.Schema<EditStreamResponse>;

export const editStream = API.make(() => ({
  input: EditStreamRequest,
  output: EditStreamResponse,
  errors: [],
}));

// =============================================================================
// Token
// =============================================================================

export interface CreateTokenRequest {
  identifier: string;
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Body param: The optional ID of a Stream signing key. If present, the `pem` field is also required. */
  id?: string;
  /** Body param: The optional list of access rule constraints on the token. Access can be blocked or allowed based on an IP, IP range, or by country. Access rules are evaluated from first to last. If a rul */
  accessRules?: {
    action?: "allow" | "block";
    country?: string[];
    ip?: string[];
    type?: "any" | "ip.src" | "ip.geoip.country";
  }[];
  /** Body param: The optional boolean value that enables using signed tokens to access MP4 download links for a video. */
  downloadable?: boolean;
  /** Body param: The optional unix epoch timestamp that specficies the time after a token is not accepted. The maximum time specification is 24 hours from issuing time. If this field is not set, the defaul */
  exp?: number;
  /** Body param: The optional unix epoch timestamp that specifies the time before a the token is not accepted. If this field is not set, the default is one hour before issuing. */
  nbf?: number;
  /** Body param: The optional base64 encoded private key in PEM format associated with a Stream signing key. If present, the `id` field is also required. */
  pem?: string;
}

export const CreateTokenRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  id: Schema.optional(Schema.String),
  accessRules: Schema.optional(
    Schema.Array(
      Schema.Struct({
        action: Schema.optional(Schema.Literal("allow", "block")),
        country: Schema.optional(Schema.Array(Schema.String)),
        ip: Schema.optional(Schema.Array(Schema.String)),
        type: Schema.optional(Schema.Literal("any", "ip.src", "ip.geoip.country")),
      }),
    ),
  ),
  downloadable: Schema.optional(Schema.Boolean),
  exp: Schema.optional(Schema.Number),
  nbf: Schema.optional(Schema.Number),
  pem: Schema.optional(Schema.String),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/stream/{identifier}/token" }),
) as unknown as Schema.Schema<CreateTokenRequest>;

export interface CreateTokenResponse {
  /** The signed token used with the signed URLs feature. */
  token?: string;
}

export const CreateTokenResponse = Schema.Struct({
  token: Schema.optional(Schema.String),
}) as unknown as Schema.Schema<CreateTokenResponse>;

export const createToken = API.make(() => ({
  input: CreateTokenRequest,
  output: CreateTokenResponse,
  errors: [],
}));

// =============================================================================
// UsageVideo
// =============================================================================

export interface StorageUsageVideoRequest {
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Query param: A user-defined identifier for the media creator. */
  creator?: string;
}

export const StorageUsageVideoRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  creator: Schema.optional(Schema.String).pipe(T.HttpQuery("creator")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/stream/storage-usage" }),
) as unknown as Schema.Schema<StorageUsageVideoRequest>;

export interface StorageUsageVideoResponse {
  /** A user-defined identifier for the media creator. */
  creator?: string;
  /** The total minutes of video content stored in the account. */
  totalStorageMinutes?: number;
  /** The storage capacity alloted for the account. */
  totalStorageMinutesLimit?: number;
  /** The total count of videos associated with the account. */
  videoCount?: number;
}

export const StorageUsageVideoResponse = Schema.Struct({
  creator: Schema.optional(Schema.String),
  totalStorageMinutes: Schema.optional(Schema.Number),
  totalStorageMinutesLimit: Schema.optional(Schema.Number),
  videoCount: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<StorageUsageVideoResponse>;

export const storageUsageVideo = API.make(() => ({
  input: StorageUsageVideoRequest,
  output: StorageUsageVideoResponse,
  errors: [],
}));

// =============================================================================
// Watermark
// =============================================================================

export interface GetWatermarkRequest {
  identifier: string;
  /** The account identifier tag. */
  accountId: string;
}

export const GetWatermarkRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/stream/watermarks/{identifier}" }),
) as unknown as Schema.Schema<GetWatermarkRequest>;

export interface GetWatermarkResponse {
  /** The date and a time a watermark profile was created. */
  created?: string;
  /** The source URL for a downloaded image. If the watermark profile was created via direct upload, this field is null. */
  downloadedFrom?: string;
  /** The height of the image in pixels. */
  height?: number;
  /** A short description of the watermark profile. */
  name?: string;
  /** The translucency of the image. A value of `0.0` makes the image completely transparent, and `1.0` makes the image completely opaque. Note that if the image is already semi-transparent, setting this to */
  opacity?: number;
  /** The whitespace between the adjacent edges (determined by position) of the video and the image. `0.0` indicates no padding, and `1.0` indicates a fully padded video width or length, as determined by th */
  padding?: number;
  /** The location of the image. Valid positions are: `upperRight`, `upperLeft`, `lowerLeft`, `lowerRight`, and `center`. Note that `center` ignores the `padding` parameter. */
  position?: string;
  /** The size of the image relative to the overall size of the video. This parameter will adapt to horizontal and vertical videos automatically. `0.0` indicates no scaling (use the size of the image as-is) */
  scale?: number;
  /** The size of the image in bytes. */
  size?: number;
  /** The unique identifier for a watermark profile. */
  uid?: string;
  /** The width of the image in pixels. */
  width?: number;
}

export const GetWatermarkResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  downloadedFrom: Schema.optional(Schema.String),
  height: Schema.optional(Schema.Number),
  name: Schema.optional(Schema.String),
  opacity: Schema.optional(Schema.Number),
  padding: Schema.optional(Schema.Number),
  position: Schema.optional(Schema.String),
  scale: Schema.optional(Schema.Number),
  size: Schema.optional(Schema.Number),
  uid: Schema.optional(Schema.String),
  width: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<GetWatermarkResponse>;

export const getWatermark = API.make(() => ({
  input: GetWatermarkRequest,
  output: GetWatermarkResponse,
  errors: [],
}));

export interface CreateWatermarkRequest {
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Body param: The image file to upload. */
  file: string;
  /** Body param: A short description of the watermark profile. */
  name?: string;
  /** Body param: The translucency of the image. A value of `0.0` makes the image completely transparent, and `1.0` makes the image completely opaque. Note that if the image is already semi-transparent, set */
  opacity?: number;
  /** Body param: The whitespace between the adjacent edges (determined by position) of the video and the image. `0.0` indicates no padding, and `1.0` indicates a fully padded video width or length, as dete */
  padding?: number;
  /** Body param: The location of the image. Valid positions are: `upperRight`, `upperLeft`, `lowerLeft`, `lowerRight`, and `center`. Note that `center` ignores the `padding` parameter. */
  position?: string;
  /** Body param: The size of the image relative to the overall size of the video. This parameter will adapt to horizontal and vertical videos automatically. `0.0` indicates no scaling (use the size of the  */
  scale?: number;
}

export const CreateWatermarkRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  file: Schema.String,
  name: Schema.optional(Schema.String),
  opacity: Schema.optional(Schema.Number),
  padding: Schema.optional(Schema.Number),
  position: Schema.optional(Schema.String),
  scale: Schema.optional(Schema.Number),
}).pipe(
  T.Http({ method: "POST", path: "/accounts/{account_id}/stream/watermarks" }),
) as unknown as Schema.Schema<CreateWatermarkRequest>;

export interface CreateWatermarkResponse {
  /** The date and a time a watermark profile was created. */
  created?: string;
  /** The source URL for a downloaded image. If the watermark profile was created via direct upload, this field is null. */
  downloadedFrom?: string;
  /** The height of the image in pixels. */
  height?: number;
  /** A short description of the watermark profile. */
  name?: string;
  /** The translucency of the image. A value of `0.0` makes the image completely transparent, and `1.0` makes the image completely opaque. Note that if the image is already semi-transparent, setting this to */
  opacity?: number;
  /** The whitespace between the adjacent edges (determined by position) of the video and the image. `0.0` indicates no padding, and `1.0` indicates a fully padded video width or length, as determined by th */
  padding?: number;
  /** The location of the image. Valid positions are: `upperRight`, `upperLeft`, `lowerLeft`, `lowerRight`, and `center`. Note that `center` ignores the `padding` parameter. */
  position?: string;
  /** The size of the image relative to the overall size of the video. This parameter will adapt to horizontal and vertical videos automatically. `0.0` indicates no scaling (use the size of the image as-is) */
  scale?: number;
  /** The size of the image in bytes. */
  size?: number;
  /** The unique identifier for a watermark profile. */
  uid?: string;
  /** The width of the image in pixels. */
  width?: number;
}

export const CreateWatermarkResponse = Schema.Struct({
  created: Schema.optional(Schema.String),
  downloadedFrom: Schema.optional(Schema.String),
  height: Schema.optional(Schema.Number),
  name: Schema.optional(Schema.String),
  opacity: Schema.optional(Schema.Number),
  padding: Schema.optional(Schema.Number),
  position: Schema.optional(Schema.String),
  scale: Schema.optional(Schema.Number),
  size: Schema.optional(Schema.Number),
  uid: Schema.optional(Schema.String),
  width: Schema.optional(Schema.Number),
}) as unknown as Schema.Schema<CreateWatermarkResponse>;

export const createWatermark = API.make(() => ({
  input: CreateWatermarkRequest,
  output: CreateWatermarkResponse,
  errors: [],
}));

export interface DeleteWatermarkRequest {
  identifier: string;
  /** The account identifier tag. */
  accountId: string;
}

export const DeleteWatermarkRequest = Schema.Struct({
  identifier: Schema.String.pipe(T.HttpPath("identifier")),
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/stream/watermarks/{identifier}" }),
) as unknown as Schema.Schema<DeleteWatermarkRequest>;

export type DeleteWatermarkResponse = string;

export const DeleteWatermarkResponse =
  Schema.String as unknown as Schema.Schema<DeleteWatermarkResponse>;

export const deleteWatermark = API.make(() => ({
  input: DeleteWatermarkRequest,
  output: DeleteWatermarkResponse,
  errors: [],
}));

// =============================================================================
// Webhook
// =============================================================================

export interface GetWebhookRequest {
  /** The account identifier tag. */
  accountId: string;
}

export const GetWebhookRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "GET", path: "/accounts/{account_id}/stream/webhook" }),
) as unknown as Schema.Schema<GetWebhookRequest>;

export type GetWebhookResponse = unknown;

export const GetWebhookResponse = Schema.Unknown as unknown as Schema.Schema<GetWebhookResponse>;

export const getWebhook = API.make(() => ({
  input: GetWebhookRequest,
  output: GetWebhookResponse,
  errors: [],
}));

export interface PutWebhookRequest {
  /** Path param: The account identifier tag. */
  accountId: string;
  /** Body param: The URL where webhooks will be sent. */
  notificationUrl: string;
}

export const PutWebhookRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
  notificationUrl: Schema.String,
}).pipe(
  T.Http({ method: "PUT", path: "/accounts/{account_id}/stream/webhook" }),
) as unknown as Schema.Schema<PutWebhookRequest>;

export type PutWebhookResponse = unknown;

export const PutWebhookResponse = Schema.Unknown as unknown as Schema.Schema<PutWebhookResponse>;

export const putWebhook = API.make(() => ({
  input: PutWebhookRequest,
  output: PutWebhookResponse,
  errors: [],
}));

export interface DeleteWebhookRequest {
  /** The account identifier tag. */
  accountId: string;
}

export const DeleteWebhookRequest = Schema.Struct({
  accountId: Schema.String.pipe(T.HttpPath("account_id")),
}).pipe(
  T.Http({ method: "DELETE", path: "/accounts/{account_id}/stream/webhook" }),
) as unknown as Schema.Schema<DeleteWebhookRequest>;

export type DeleteWebhookResponse = string;

export const DeleteWebhookResponse =
  Schema.String as unknown as Schema.Schema<DeleteWebhookResponse>;

export const deleteWebhook = API.make(() => ({
  input: DeleteWebhookRequest,
  output: DeleteWebhookResponse,
  errors: [],
}));
