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
  sdkId: "IVS RealTime",
  serviceShapeName: "AmazonInteractiveVideoServiceRealTime",
});
const auth = T.AwsAuthSigv4({ name: "ivs" });
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
              `https://ivsrealtime-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://ivsrealtime-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ivsrealtime.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ivsrealtime.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type EncoderConfigurationName = string;
export type IngestConfigurationName = string;
export type IngestConfigurationStageArn = string;
export type UserId = string;
export type InsecureIngest = boolean;
export type StageArn = string;
export type ParticipantTokenDurationMinutes = number;
export type ParticipantTokenUserId = string;
export type ParticipantTokenCapability = string;
export type StageName = string;
export type StorageConfigurationName = string;
export type EncoderConfigurationArn = string;
export type IngestConfigurationArn = string;
export type PublicKeyArn = string;
export type StorageConfigurationArn = string;
export type ParticipantTokenId = string;
export type DisconnectParticipantReason = string;
export type CompositionArn = string;
export type StageSessionId = string;
export type ParticipantId = string;
export type PublicKeyMaterial = string;
export type PublicKeyName = string;
export type PaginationToken = string;
export type MaxCompositionResults = number;
export type MaxEncoderConfigurationResults = number;
export type IngestConfigurationState = string;
export type MaxIngestConfigurationResults = number;
export type MaxParticipantEventResults = number;
export type MaxParticipantReplicaResults = number;
export type Published = boolean;
export type ParticipantState = string;
export type MaxParticipantResults = number;
export type ParticipantRecordingFilterByRecordingState = string;
export type MaxPublicKeyResults = number;
export type MaxStageResults = number;
export type MaxStageSessionResults = number;
export type MaxStorageConfigurationResults = number;
export type ResourceArn = string;
export type CompositionClientToken = string;
export type ReconnectWindowSeconds = number;
export type TagKey = string;
export type Width = number;
export type Height = number;
export type Framerate = number;
export type Bitrate = number;
export type TagValue = string;
export type AutoParticipantRecordingStorageConfigurationArn = string;
export type ParticipantRecordingReconnectWindowSeconds = number;
export type RecordParticipantReplicas = boolean;
export type S3BucketName = string;
export type DestinationConfigurationName = string;
export type ErrorMessage = string;
export type ThumbnailIntervalSeconds = number;
export type ParticipantRecordingTargetSegmentDurationSeconds = number;
export type AttributeKey = string;
export type OmitStoppedVideo = boolean;
export type GridGap = number;
export type PipOffset = number;
export type PipWidth = number;
export type PipHeight = number;
export type ChannelArn = string;
export type CompositionState = string;
export type StreamKey = string | redacted.Redacted<string>;
export type ParticipantClientAttribute = string;
export type ParticipantRecordingS3BucketName = string;
export type ParticipantRecordingS3Prefix = string;
export type ParticipantRecordingState = string;
export type ReplicationType = string;
export type ReplicationState = string;
export type PublicKeyFingerprint = string;
export type EventName = string;
export type Replica = boolean;
export type RecordingConfigurationFormat = string;
export type DestinationState = string;
export type StageEndpoint = string;
export type ParticipantTokenExpirationTime = Date;
export type CompositionRecordingTargetSegmentDurationSeconds = number;
export type ParticipantTokenString = string | redacted.Redacted<string>;

//# Schemas
export type IngestProtocol = "RTMP" | "RTMPS";
export const IngestProtocol = S.Literal("RTMP", "RTMPS");
export type ParticipantTokenCapabilities = string[];
export const ParticipantTokenCapabilities = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteEncoderConfigurationRequest {
  arn: string;
}
export const DeleteEncoderConfigurationRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteEncoderConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEncoderConfigurationRequest",
}) as any as S.Schema<DeleteEncoderConfigurationRequest>;
export interface DeleteEncoderConfigurationResponse {}
export const DeleteEncoderConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEncoderConfigurationResponse",
}) as any as S.Schema<DeleteEncoderConfigurationResponse>;
export interface DeleteIngestConfigurationRequest {
  arn: string;
  force?: boolean;
}
export const DeleteIngestConfigurationRequest = S.suspend(() =>
  S.Struct({ arn: S.String, force: S.optional(S.Boolean) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteIngestConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIngestConfigurationRequest",
}) as any as S.Schema<DeleteIngestConfigurationRequest>;
export interface DeleteIngestConfigurationResponse {}
export const DeleteIngestConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIngestConfigurationResponse",
}) as any as S.Schema<DeleteIngestConfigurationResponse>;
export interface DeletePublicKeyRequest {
  arn: string;
}
export const DeletePublicKeyRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeletePublicKey" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePublicKeyRequest",
}) as any as S.Schema<DeletePublicKeyRequest>;
export interface DeletePublicKeyResponse {}
export const DeletePublicKeyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePublicKeyResponse",
}) as any as S.Schema<DeletePublicKeyResponse>;
export interface DeleteStageRequest {
  arn: string;
}
export const DeleteStageRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteStage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteStageRequest",
}) as any as S.Schema<DeleteStageRequest>;
export interface DeleteStageResponse {}
export const DeleteStageResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteStageResponse",
}) as any as S.Schema<DeleteStageResponse>;
export interface DeleteStorageConfigurationRequest {
  arn: string;
}
export const DeleteStorageConfigurationRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteStorageConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteStorageConfigurationRequest",
}) as any as S.Schema<DeleteStorageConfigurationRequest>;
export interface DeleteStorageConfigurationResponse {}
export const DeleteStorageConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteStorageConfigurationResponse",
}) as any as S.Schema<DeleteStorageConfigurationResponse>;
export interface DisconnectParticipantRequest {
  stageArn: string;
  participantId: string;
  reason?: string;
}
export const DisconnectParticipantRequest = S.suspend(() =>
  S.Struct({
    stageArn: S.String,
    participantId: S.String,
    reason: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DisconnectParticipant" }),
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
export interface GetCompositionRequest {
  arn: string;
}
export const GetCompositionRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetComposition" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCompositionRequest",
}) as any as S.Schema<GetCompositionRequest>;
export interface GetEncoderConfigurationRequest {
  arn: string;
}
export const GetEncoderConfigurationRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetEncoderConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEncoderConfigurationRequest",
}) as any as S.Schema<GetEncoderConfigurationRequest>;
export interface GetIngestConfigurationRequest {
  arn: string;
}
export const GetIngestConfigurationRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetIngestConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIngestConfigurationRequest",
}) as any as S.Schema<GetIngestConfigurationRequest>;
export interface GetParticipantRequest {
  stageArn: string;
  sessionId: string;
  participantId: string;
}
export const GetParticipantRequest = S.suspend(() =>
  S.Struct({
    stageArn: S.String,
    sessionId: S.String,
    participantId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetParticipant" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetParticipantRequest",
}) as any as S.Schema<GetParticipantRequest>;
export interface GetPublicKeyRequest {
  arn: string;
}
export const GetPublicKeyRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetPublicKey" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPublicKeyRequest",
}) as any as S.Schema<GetPublicKeyRequest>;
export interface GetStageRequest {
  arn: string;
}
export const GetStageRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetStage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStageRequest",
}) as any as S.Schema<GetStageRequest>;
export interface GetStageSessionRequest {
  stageArn: string;
  sessionId: string;
}
export const GetStageSessionRequest = S.suspend(() =>
  S.Struct({ stageArn: S.String, sessionId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetStageSession" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStageSessionRequest",
}) as any as S.Schema<GetStageSessionRequest>;
export interface GetStorageConfigurationRequest {
  arn: string;
}
export const GetStorageConfigurationRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetStorageConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStorageConfigurationRequest",
}) as any as S.Schema<GetStorageConfigurationRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface ImportPublicKeyRequest {
  publicKeyMaterial: string;
  name?: string;
  tags?: { [key: string]: string };
}
export const ImportPublicKeyRequest = S.suspend(() =>
  S.Struct({
    publicKeyMaterial: S.String,
    name: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ImportPublicKey" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportPublicKeyRequest",
}) as any as S.Schema<ImportPublicKeyRequest>;
export interface ListCompositionsRequest {
  filterByStageArn?: string;
  filterByEncoderConfigurationArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListCompositionsRequest = S.suspend(() =>
  S.Struct({
    filterByStageArn: S.optional(S.String),
    filterByEncoderConfigurationArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListCompositions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCompositionsRequest",
}) as any as S.Schema<ListCompositionsRequest>;
export interface ListEncoderConfigurationsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListEncoderConfigurationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEncoderConfigurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEncoderConfigurationsRequest",
}) as any as S.Schema<ListEncoderConfigurationsRequest>;
export interface ListIngestConfigurationsRequest {
  filterByStageArn?: string;
  filterByState?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListIngestConfigurationsRequest = S.suspend(() =>
  S.Struct({
    filterByStageArn: S.optional(S.String),
    filterByState: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListIngestConfigurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIngestConfigurationsRequest",
}) as any as S.Schema<ListIngestConfigurationsRequest>;
export interface ListParticipantEventsRequest {
  stageArn: string;
  sessionId: string;
  participantId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListParticipantEventsRequest = S.suspend(() =>
  S.Struct({
    stageArn: S.String,
    sessionId: S.String,
    participantId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListParticipantEvents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListParticipantEventsRequest",
}) as any as S.Schema<ListParticipantEventsRequest>;
export interface ListParticipantReplicasRequest {
  sourceStageArn: string;
  participantId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListParticipantReplicasRequest = S.suspend(() =>
  S.Struct({
    sourceStageArn: S.String,
    participantId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListParticipantReplicas" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListParticipantReplicasRequest",
}) as any as S.Schema<ListParticipantReplicasRequest>;
export interface ListParticipantsRequest {
  stageArn: string;
  sessionId: string;
  filterByUserId?: string;
  filterByPublished?: boolean;
  filterByState?: string;
  nextToken?: string;
  maxResults?: number;
  filterByRecordingState?: string;
}
export const ListParticipantsRequest = S.suspend(() =>
  S.Struct({
    stageArn: S.String,
    sessionId: S.String,
    filterByUserId: S.optional(S.String),
    filterByPublished: S.optional(S.Boolean),
    filterByState: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filterByRecordingState: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListParticipants" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListParticipantsRequest",
}) as any as S.Schema<ListParticipantsRequest>;
export interface ListPublicKeysRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListPublicKeysRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListPublicKeys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPublicKeysRequest",
}) as any as S.Schema<ListPublicKeysRequest>;
export interface ListStagesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListStagesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListStages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStagesRequest",
}) as any as S.Schema<ListStagesRequest>;
export interface ListStageSessionsRequest {
  stageArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListStageSessionsRequest = S.suspend(() =>
  S.Struct({
    stageArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListStageSessions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStageSessionsRequest",
}) as any as S.Schema<ListStageSessionsRequest>;
export interface ListStorageConfigurationsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListStorageConfigurationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListStorageConfigurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStorageConfigurationsRequest",
}) as any as S.Schema<ListStorageConfigurationsRequest>;
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
export type ParticipantAttributes = { [key: string]: string };
export const ParticipantAttributes = S.Record({
  key: S.String,
  value: S.String,
});
export interface StartParticipantReplicationRequest {
  sourceStageArn: string;
  destinationStageArn: string;
  participantId: string;
  reconnectWindowSeconds?: number;
  attributes?: { [key: string]: string };
}
export const StartParticipantReplicationRequest = S.suspend(() =>
  S.Struct({
    sourceStageArn: S.String,
    destinationStageArn: S.String,
    participantId: S.String,
    reconnectWindowSeconds: S.optional(S.Number),
    attributes: S.optional(ParticipantAttributes),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartParticipantReplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartParticipantReplicationRequest",
}) as any as S.Schema<StartParticipantReplicationRequest>;
export interface StopCompositionRequest {
  arn: string;
}
export const StopCompositionRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StopComposition" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopCompositionRequest",
}) as any as S.Schema<StopCompositionRequest>;
export interface StopCompositionResponse {}
export const StopCompositionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopCompositionResponse",
}) as any as S.Schema<StopCompositionResponse>;
export interface StopParticipantReplicationRequest {
  sourceStageArn: string;
  destinationStageArn: string;
  participantId: string;
}
export const StopParticipantReplicationRequest = S.suspend(() =>
  S.Struct({
    sourceStageArn: S.String,
    destinationStageArn: S.String,
    participantId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StopParticipantReplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopParticipantReplicationRequest",
}) as any as S.Schema<StopParticipantReplicationRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
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
  tagKeys: string[];
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
export interface UpdateIngestConfigurationRequest {
  arn: string;
  stageArn?: string;
}
export const UpdateIngestConfigurationRequest = S.suspend(() =>
  S.Struct({ arn: S.String, stageArn: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateIngestConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIngestConfigurationRequest",
}) as any as S.Schema<UpdateIngestConfigurationRequest>;
export type ParticipantRecordingMediaType =
  | "AUDIO_VIDEO"
  | "AUDIO_ONLY"
  | "NONE";
export const ParticipantRecordingMediaType = S.Literal(
  "AUDIO_VIDEO",
  "AUDIO_ONLY",
  "NONE",
);
export type ParticipantRecordingMediaTypeList = ParticipantRecordingMediaType[];
export const ParticipantRecordingMediaTypeList = S.Array(
  ParticipantRecordingMediaType,
);
export type ThumbnailStorageType = "SEQUENTIAL" | "LATEST";
export const ThumbnailStorageType = S.Literal("SEQUENTIAL", "LATEST");
export type ThumbnailStorageTypeList = ThumbnailStorageType[];
export const ThumbnailStorageTypeList = S.Array(ThumbnailStorageType);
export type ThumbnailRecordingMode = "INTERVAL" | "DISABLED";
export const ThumbnailRecordingMode = S.Literal("INTERVAL", "DISABLED");
export interface ParticipantThumbnailConfiguration {
  targetIntervalSeconds?: number;
  storage?: ThumbnailStorageType[];
  recordingMode?: ThumbnailRecordingMode;
}
export const ParticipantThumbnailConfiguration = S.suspend(() =>
  S.Struct({
    targetIntervalSeconds: S.optional(S.Number),
    storage: S.optional(ThumbnailStorageTypeList),
    recordingMode: S.optional(ThumbnailRecordingMode),
  }),
).annotations({
  identifier: "ParticipantThumbnailConfiguration",
}) as any as S.Schema<ParticipantThumbnailConfiguration>;
export interface ParticipantRecordingHlsConfiguration {
  targetSegmentDurationSeconds?: number;
}
export const ParticipantRecordingHlsConfiguration = S.suspend(() =>
  S.Struct({ targetSegmentDurationSeconds: S.optional(S.Number) }),
).annotations({
  identifier: "ParticipantRecordingHlsConfiguration",
}) as any as S.Schema<ParticipantRecordingHlsConfiguration>;
export interface AutoParticipantRecordingConfiguration {
  storageConfigurationArn: string;
  mediaTypes?: ParticipantRecordingMediaType[];
  thumbnailConfiguration?: ParticipantThumbnailConfiguration;
  recordingReconnectWindowSeconds?: number;
  hlsConfiguration?: ParticipantRecordingHlsConfiguration;
  recordParticipantReplicas?: boolean;
}
export const AutoParticipantRecordingConfiguration = S.suspend(() =>
  S.Struct({
    storageConfigurationArn: S.String,
    mediaTypes: S.optional(ParticipantRecordingMediaTypeList),
    thumbnailConfiguration: S.optional(ParticipantThumbnailConfiguration),
    recordingReconnectWindowSeconds: S.optional(S.Number),
    hlsConfiguration: S.optional(ParticipantRecordingHlsConfiguration),
    recordParticipantReplicas: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AutoParticipantRecordingConfiguration",
}) as any as S.Schema<AutoParticipantRecordingConfiguration>;
export interface UpdateStageRequest {
  arn: string;
  name?: string;
  autoParticipantRecordingConfiguration?: AutoParticipantRecordingConfiguration;
}
export const UpdateStageRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    autoParticipantRecordingConfiguration: S.optional(
      AutoParticipantRecordingConfiguration,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateStage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateStageRequest",
}) as any as S.Schema<UpdateStageRequest>;
export interface Video {
  width?: number;
  height?: number;
  framerate?: number;
  bitrate?: number;
}
export const Video = S.suspend(() =>
  S.Struct({
    width: S.optional(S.Number),
    height: S.optional(S.Number),
    framerate: S.optional(S.Number),
    bitrate: S.optional(S.Number),
  }),
).annotations({ identifier: "Video" }) as any as S.Schema<Video>;
export type ParticipantTokenAttributes = { [key: string]: string };
export const ParticipantTokenAttributes = S.Record({
  key: S.String,
  value: S.String,
});
export interface ParticipantTokenConfiguration {
  duration?: number;
  userId?: string;
  attributes?: { [key: string]: string };
  capabilities?: string[];
}
export const ParticipantTokenConfiguration = S.suspend(() =>
  S.Struct({
    duration: S.optional(S.Number),
    userId: S.optional(S.String),
    attributes: S.optional(ParticipantTokenAttributes),
    capabilities: S.optional(ParticipantTokenCapabilities),
  }),
).annotations({
  identifier: "ParticipantTokenConfiguration",
}) as any as S.Schema<ParticipantTokenConfiguration>;
export type ParticipantTokenConfigurations = ParticipantTokenConfiguration[];
export const ParticipantTokenConfigurations = S.Array(
  ParticipantTokenConfiguration,
);
export interface S3StorageConfiguration {
  bucketName: string;
}
export const S3StorageConfiguration = S.suspend(() =>
  S.Struct({ bucketName: S.String }),
).annotations({
  identifier: "S3StorageConfiguration",
}) as any as S.Schema<S3StorageConfiguration>;
export type VideoAspectRatio = "AUTO" | "VIDEO" | "SQUARE" | "PORTRAIT";
export const VideoAspectRatio = S.Literal(
  "AUTO",
  "VIDEO",
  "SQUARE",
  "PORTRAIT",
);
export type VideoFillMode = "FILL" | "COVER" | "CONTAIN";
export const VideoFillMode = S.Literal("FILL", "COVER", "CONTAIN");
export type PipBehavior = "STATIC" | "DYNAMIC";
export const PipBehavior = S.Literal("STATIC", "DYNAMIC");
export type PipPosition =
  | "TOP_LEFT"
  | "TOP_RIGHT"
  | "BOTTOM_LEFT"
  | "BOTTOM_RIGHT";
export const PipPosition = S.Literal(
  "TOP_LEFT",
  "TOP_RIGHT",
  "BOTTOM_LEFT",
  "BOTTOM_RIGHT",
);
export type EncoderConfigurationArnList = string[];
export const EncoderConfigurationArnList = S.Array(S.String);
export interface CreateEncoderConfigurationRequest {
  name?: string;
  video?: Video;
  tags?: { [key: string]: string };
}
export const CreateEncoderConfigurationRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    video: S.optional(Video),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateEncoderConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEncoderConfigurationRequest",
}) as any as S.Schema<CreateEncoderConfigurationRequest>;
export interface CreateIngestConfigurationRequest {
  name?: string;
  stageArn?: string;
  userId?: string;
  attributes?: { [key: string]: string };
  ingestProtocol: IngestProtocol;
  insecureIngest?: boolean;
  tags?: { [key: string]: string };
}
export const CreateIngestConfigurationRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    stageArn: S.optional(S.String),
    userId: S.optional(S.String),
    attributes: S.optional(ParticipantAttributes),
    ingestProtocol: IngestProtocol,
    insecureIngest: S.optional(S.Boolean),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateIngestConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIngestConfigurationRequest",
}) as any as S.Schema<CreateIngestConfigurationRequest>;
export interface CreateParticipantTokenRequest {
  stageArn: string;
  duration?: number;
  userId?: string;
  attributes?: { [key: string]: string };
  capabilities?: string[];
}
export const CreateParticipantTokenRequest = S.suspend(() =>
  S.Struct({
    stageArn: S.String,
    duration: S.optional(S.Number),
    userId: S.optional(S.String),
    attributes: S.optional(ParticipantTokenAttributes),
    capabilities: S.optional(ParticipantTokenCapabilities),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateParticipantToken" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateParticipantTokenRequest",
}) as any as S.Schema<CreateParticipantTokenRequest>;
export interface CreateStorageConfigurationRequest {
  name?: string;
  s3: S3StorageConfiguration;
  tags?: { [key: string]: string };
}
export const CreateStorageConfigurationRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    s3: S3StorageConfiguration,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateStorageConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateStorageConfigurationRequest",
}) as any as S.Schema<CreateStorageConfigurationRequest>;
export interface PublicKey {
  arn?: string;
  name?: string;
  publicKeyMaterial?: string;
  fingerprint?: string;
  tags?: { [key: string]: string };
}
export const PublicKey = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    publicKeyMaterial: S.optional(S.String),
    fingerprint: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({ identifier: "PublicKey" }) as any as S.Schema<PublicKey>;
export interface ImportPublicKeyResponse {
  publicKey?: PublicKey;
}
export const ImportPublicKeyResponse = S.suspend(() =>
  S.Struct({ publicKey: S.optional(PublicKey) }),
).annotations({
  identifier: "ImportPublicKeyResponse",
}) as any as S.Schema<ImportPublicKeyResponse>;
export interface ListTagsForResourceResponse {
  tags: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: Tags }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartParticipantReplicationResponse {
  accessControlAllowOrigin?: string;
  accessControlExposeHeaders?: string;
  cacheControl?: string;
  contentSecurityPolicy?: string;
  strictTransportSecurity?: string;
  xContentTypeOptions?: string;
  xFrameOptions?: string;
}
export const StartParticipantReplicationResponse = S.suspend(() =>
  S.Struct({
    accessControlAllowOrigin: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Allow-Origin"),
    ),
    accessControlExposeHeaders: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Expose-Headers"),
    ),
    cacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    contentSecurityPolicy: S.optional(S.String).pipe(
      T.HttpHeader("Content-Security-Policy"),
    ),
    strictTransportSecurity: S.optional(S.String).pipe(
      T.HttpHeader("Strict-Transport-Security"),
    ),
    xContentTypeOptions: S.optional(S.String).pipe(
      T.HttpHeader("X-Content-Type-Options"),
    ),
    xFrameOptions: S.optional(S.String).pipe(T.HttpHeader("X-Frame-Options")),
  }),
).annotations({
  identifier: "StartParticipantReplicationResponse",
}) as any as S.Schema<StartParticipantReplicationResponse>;
export interface StopParticipantReplicationResponse {
  accessControlAllowOrigin?: string;
  accessControlExposeHeaders?: string;
  cacheControl?: string;
  contentSecurityPolicy?: string;
  strictTransportSecurity?: string;
  xContentTypeOptions?: string;
  xFrameOptions?: string;
}
export const StopParticipantReplicationResponse = S.suspend(() =>
  S.Struct({
    accessControlAllowOrigin: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Allow-Origin"),
    ),
    accessControlExposeHeaders: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Expose-Headers"),
    ),
    cacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    contentSecurityPolicy: S.optional(S.String).pipe(
      T.HttpHeader("Content-Security-Policy"),
    ),
    strictTransportSecurity: S.optional(S.String).pipe(
      T.HttpHeader("Strict-Transport-Security"),
    ),
    xContentTypeOptions: S.optional(S.String).pipe(
      T.HttpHeader("X-Content-Type-Options"),
    ),
    xFrameOptions: S.optional(S.String).pipe(T.HttpHeader("X-Frame-Options")),
  }),
).annotations({
  identifier: "StopParticipantReplicationResponse",
}) as any as S.Schema<StopParticipantReplicationResponse>;
export interface IngestConfiguration {
  name?: string;
  arn: string;
  ingestProtocol: IngestProtocol;
  streamKey: string | redacted.Redacted<string>;
  stageArn: string;
  participantId: string;
  state: string;
  userId?: string;
  attributes?: { [key: string]: string };
  tags?: { [key: string]: string };
}
export const IngestConfiguration = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.String,
    ingestProtocol: IngestProtocol,
    streamKey: SensitiveString,
    stageArn: S.String,
    participantId: S.String,
    state: S.String,
    userId: S.optional(S.String),
    attributes: S.optional(ParticipantAttributes),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "IngestConfiguration",
}) as any as S.Schema<IngestConfiguration>;
export interface UpdateIngestConfigurationResponse {
  ingestConfiguration?: IngestConfiguration;
}
export const UpdateIngestConfigurationResponse = S.suspend(() =>
  S.Struct({ ingestConfiguration: S.optional(IngestConfiguration) }),
).annotations({
  identifier: "UpdateIngestConfigurationResponse",
}) as any as S.Schema<UpdateIngestConfigurationResponse>;
export interface StageEndpoints {
  events?: string;
  whip?: string;
  rtmp?: string;
  rtmps?: string;
}
export const StageEndpoints = S.suspend(() =>
  S.Struct({
    events: S.optional(S.String),
    whip: S.optional(S.String),
    rtmp: S.optional(S.String),
    rtmps: S.optional(S.String),
  }),
).annotations({
  identifier: "StageEndpoints",
}) as any as S.Schema<StageEndpoints>;
export interface Stage {
  arn: string;
  name?: string;
  activeSessionId?: string;
  tags?: { [key: string]: string };
  autoParticipantRecordingConfiguration?: AutoParticipantRecordingConfiguration;
  endpoints?: StageEndpoints;
}
export const Stage = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    activeSessionId: S.optional(S.String),
    tags: S.optional(Tags),
    autoParticipantRecordingConfiguration: S.optional(
      AutoParticipantRecordingConfiguration,
    ),
    endpoints: S.optional(StageEndpoints),
  }),
).annotations({ identifier: "Stage" }) as any as S.Schema<Stage>;
export interface UpdateStageResponse {
  stage?: Stage;
}
export const UpdateStageResponse = S.suspend(() =>
  S.Struct({ stage: S.optional(Stage) }),
).annotations({
  identifier: "UpdateStageResponse",
}) as any as S.Schema<UpdateStageResponse>;
export type ParticipantProtocol = "UNKNOWN" | "WHIP" | "RTMP" | "RTMPS";
export const ParticipantProtocol = S.Literal(
  "UNKNOWN",
  "WHIP",
  "RTMP",
  "RTMPS",
);
export type EventErrorCode =
  | "INSUFFICIENT_CAPABILITIES"
  | "QUOTA_EXCEEDED"
  | "PUBLISHER_NOT_FOUND"
  | "BITRATE_EXCEEDED"
  | "RESOLUTION_EXCEEDED"
  | "STREAM_DURATION_EXCEEDED"
  | "INVALID_AUDIO_CODEC"
  | "INVALID_VIDEO_CODEC"
  | "INVALID_PROTOCOL"
  | "INVALID_STREAM_KEY"
  | "REUSE_OF_STREAM_KEY"
  | "B_FRAME_PRESENT"
  | "INVALID_INPUT"
  | "INTERNAL_SERVER_EXCEPTION";
export const EventErrorCode = S.Literal(
  "INSUFFICIENT_CAPABILITIES",
  "QUOTA_EXCEEDED",
  "PUBLISHER_NOT_FOUND",
  "BITRATE_EXCEEDED",
  "RESOLUTION_EXCEEDED",
  "STREAM_DURATION_EXCEEDED",
  "INVALID_AUDIO_CODEC",
  "INVALID_VIDEO_CODEC",
  "INVALID_PROTOCOL",
  "INVALID_STREAM_KEY",
  "REUSE_OF_STREAM_KEY",
  "B_FRAME_PRESENT",
  "INVALID_INPUT",
  "INTERNAL_SERVER_EXCEPTION",
);
export interface GridConfiguration {
  featuredParticipantAttribute?: string;
  omitStoppedVideo?: boolean;
  videoAspectRatio?: VideoAspectRatio;
  videoFillMode?: VideoFillMode;
  gridGap?: number;
  participantOrderAttribute?: string;
}
export const GridConfiguration = S.suspend(() =>
  S.Struct({
    featuredParticipantAttribute: S.optional(S.String),
    omitStoppedVideo: S.optional(S.Boolean),
    videoAspectRatio: S.optional(VideoAspectRatio),
    videoFillMode: S.optional(VideoFillMode),
    gridGap: S.optional(S.Number),
    participantOrderAttribute: S.optional(S.String),
  }),
).annotations({
  identifier: "GridConfiguration",
}) as any as S.Schema<GridConfiguration>;
export interface PipConfiguration {
  featuredParticipantAttribute?: string;
  omitStoppedVideo?: boolean;
  videoFillMode?: VideoFillMode;
  gridGap?: number;
  pipParticipantAttribute?: string;
  pipBehavior?: PipBehavior;
  pipOffset?: number;
  pipPosition?: PipPosition;
  pipWidth?: number;
  pipHeight?: number;
  participantOrderAttribute?: string;
}
export const PipConfiguration = S.suspend(() =>
  S.Struct({
    featuredParticipantAttribute: S.optional(S.String),
    omitStoppedVideo: S.optional(S.Boolean),
    videoFillMode: S.optional(VideoFillMode),
    gridGap: S.optional(S.Number),
    pipParticipantAttribute: S.optional(S.String),
    pipBehavior: S.optional(PipBehavior),
    pipOffset: S.optional(S.Number),
    pipPosition: S.optional(PipPosition),
    pipWidth: S.optional(S.Number),
    pipHeight: S.optional(S.Number),
    participantOrderAttribute: S.optional(S.String),
  }),
).annotations({
  identifier: "PipConfiguration",
}) as any as S.Schema<PipConfiguration>;
export interface ChannelDestinationConfiguration {
  channelArn: string;
  encoderConfigurationArn?: string;
}
export const ChannelDestinationConfiguration = S.suspend(() =>
  S.Struct({
    channelArn: S.String,
    encoderConfigurationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ChannelDestinationConfiguration",
}) as any as S.Schema<ChannelDestinationConfiguration>;
export interface EncoderConfiguration {
  arn: string;
  name?: string;
  video?: Video;
  tags?: { [key: string]: string };
}
export const EncoderConfiguration = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    video: S.optional(Video),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "EncoderConfiguration",
}) as any as S.Schema<EncoderConfiguration>;
export interface Participant {
  participantId?: string;
  userId?: string;
  state?: string;
  firstJoinTime?: Date;
  attributes?: { [key: string]: string };
  published?: boolean;
  ispName?: string;
  osName?: string;
  osVersion?: string;
  browserName?: string;
  browserVersion?: string;
  sdkVersion?: string;
  recordingS3BucketName?: string;
  recordingS3Prefix?: string;
  recordingState?: string;
  protocol?: ParticipantProtocol;
  replicationType?: string;
  replicationState?: string;
  sourceStageArn?: string;
  sourceSessionId?: string;
}
export const Participant = S.suspend(() =>
  S.Struct({
    participantId: S.optional(S.String),
    userId: S.optional(S.String),
    state: S.optional(S.String),
    firstJoinTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    attributes: S.optional(ParticipantAttributes),
    published: S.optional(S.Boolean),
    ispName: S.optional(S.String),
    osName: S.optional(S.String),
    osVersion: S.optional(S.String),
    browserName: S.optional(S.String),
    browserVersion: S.optional(S.String),
    sdkVersion: S.optional(S.String),
    recordingS3BucketName: S.optional(S.String),
    recordingS3Prefix: S.optional(S.String),
    recordingState: S.optional(S.String),
    protocol: S.optional(ParticipantProtocol),
    replicationType: S.optional(S.String),
    replicationState: S.optional(S.String),
    sourceStageArn: S.optional(S.String),
    sourceSessionId: S.optional(S.String),
  }),
).annotations({ identifier: "Participant" }) as any as S.Schema<Participant>;
export interface StageSession {
  sessionId?: string;
  startTime?: Date;
  endTime?: Date;
}
export const StageSession = S.suspend(() =>
  S.Struct({
    sessionId: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "StageSession" }) as any as S.Schema<StageSession>;
export interface StorageConfiguration {
  arn: string;
  name?: string;
  s3?: S3StorageConfiguration;
  tags?: { [key: string]: string };
}
export const StorageConfiguration = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    s3: S.optional(S3StorageConfiguration),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "StorageConfiguration",
}) as any as S.Schema<StorageConfiguration>;
export interface EncoderConfigurationSummary {
  arn: string;
  name?: string;
  tags?: { [key: string]: string };
}
export const EncoderConfigurationSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "EncoderConfigurationSummary",
}) as any as S.Schema<EncoderConfigurationSummary>;
export type EncoderConfigurationSummaryList = EncoderConfigurationSummary[];
export const EncoderConfigurationSummaryList = S.Array(
  EncoderConfigurationSummary,
);
export interface IngestConfigurationSummary {
  name?: string;
  arn: string;
  ingestProtocol: IngestProtocol;
  stageArn: string;
  participantId: string;
  state: string;
  userId?: string;
}
export const IngestConfigurationSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.String,
    ingestProtocol: IngestProtocol,
    stageArn: S.String,
    participantId: S.String,
    state: S.String,
    userId: S.optional(S.String),
  }),
).annotations({
  identifier: "IngestConfigurationSummary",
}) as any as S.Schema<IngestConfigurationSummary>;
export type IngestConfigurationList = IngestConfigurationSummary[];
export const IngestConfigurationList = S.Array(IngestConfigurationSummary);
export interface ParticipantReplica {
  sourceStageArn: string;
  participantId: string;
  sourceSessionId: string;
  destinationStageArn: string;
  destinationSessionId: string;
  replicationState: string;
}
export const ParticipantReplica = S.suspend(() =>
  S.Struct({
    sourceStageArn: S.String,
    participantId: S.String,
    sourceSessionId: S.String,
    destinationStageArn: S.String,
    destinationSessionId: S.String,
    replicationState: S.String,
  }),
).annotations({
  identifier: "ParticipantReplica",
}) as any as S.Schema<ParticipantReplica>;
export type ParticipantReplicaList = ParticipantReplica[];
export const ParticipantReplicaList = S.Array(ParticipantReplica);
export interface ParticipantSummary {
  participantId?: string;
  userId?: string;
  state?: string;
  firstJoinTime?: Date;
  published?: boolean;
  recordingState?: string;
  replicationType?: string;
  replicationState?: string;
  sourceStageArn?: string;
  sourceSessionId?: string;
}
export const ParticipantSummary = S.suspend(() =>
  S.Struct({
    participantId: S.optional(S.String),
    userId: S.optional(S.String),
    state: S.optional(S.String),
    firstJoinTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    published: S.optional(S.Boolean),
    recordingState: S.optional(S.String),
    replicationType: S.optional(S.String),
    replicationState: S.optional(S.String),
    sourceStageArn: S.optional(S.String),
    sourceSessionId: S.optional(S.String),
  }),
).annotations({
  identifier: "ParticipantSummary",
}) as any as S.Schema<ParticipantSummary>;
export type ParticipantList = ParticipantSummary[];
export const ParticipantList = S.Array(ParticipantSummary);
export interface PublicKeySummary {
  arn?: string;
  name?: string;
  tags?: { [key: string]: string };
}
export const PublicKeySummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "PublicKeySummary",
}) as any as S.Schema<PublicKeySummary>;
export type PublicKeyList = PublicKeySummary[];
export const PublicKeyList = S.Array(PublicKeySummary);
export interface StageSummary {
  arn: string;
  name?: string;
  activeSessionId?: string;
  tags?: { [key: string]: string };
}
export const StageSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    activeSessionId: S.optional(S.String),
    tags: S.optional(Tags),
  }),
).annotations({ identifier: "StageSummary" }) as any as S.Schema<StageSummary>;
export type StageSummaryList = StageSummary[];
export const StageSummaryList = S.Array(StageSummary);
export interface StageSessionSummary {
  sessionId?: string;
  startTime?: Date;
  endTime?: Date;
}
export const StageSessionSummary = S.suspend(() =>
  S.Struct({
    sessionId: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StageSessionSummary",
}) as any as S.Schema<StageSessionSummary>;
export type StageSessionList = StageSessionSummary[];
export const StageSessionList = S.Array(StageSessionSummary);
export interface StorageConfigurationSummary {
  arn: string;
  name?: string;
  s3?: S3StorageConfiguration;
  tags?: { [key: string]: string };
}
export const StorageConfigurationSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(S.String),
    s3: S.optional(S3StorageConfiguration),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "StorageConfigurationSummary",
}) as any as S.Schema<StorageConfigurationSummary>;
export type StorageConfigurationSummaryList = StorageConfigurationSummary[];
export const StorageConfigurationSummaryList = S.Array(
  StorageConfigurationSummary,
);
export interface LayoutConfiguration {
  grid?: GridConfiguration;
  pip?: PipConfiguration;
}
export const LayoutConfiguration = S.suspend(() =>
  S.Struct({
    grid: S.optional(GridConfiguration),
    pip: S.optional(PipConfiguration),
  }),
).annotations({
  identifier: "LayoutConfiguration",
}) as any as S.Schema<LayoutConfiguration>;
export interface CompositionThumbnailConfiguration {
  targetIntervalSeconds?: number;
  storage?: ThumbnailStorageType[];
}
export const CompositionThumbnailConfiguration = S.suspend(() =>
  S.Struct({
    targetIntervalSeconds: S.optional(S.Number),
    storage: S.optional(ThumbnailStorageTypeList),
  }),
).annotations({
  identifier: "CompositionThumbnailConfiguration",
}) as any as S.Schema<CompositionThumbnailConfiguration>;
export type CompositionThumbnailConfigurationList =
  CompositionThumbnailConfiguration[];
export const CompositionThumbnailConfigurationList = S.Array(
  CompositionThumbnailConfiguration,
);
export interface CreateEncoderConfigurationResponse {
  encoderConfiguration?: EncoderConfiguration;
}
export const CreateEncoderConfigurationResponse = S.suspend(() =>
  S.Struct({ encoderConfiguration: S.optional(EncoderConfiguration) }),
).annotations({
  identifier: "CreateEncoderConfigurationResponse",
}) as any as S.Schema<CreateEncoderConfigurationResponse>;
export interface CreateIngestConfigurationResponse {
  ingestConfiguration?: IngestConfiguration;
}
export const CreateIngestConfigurationResponse = S.suspend(() =>
  S.Struct({ ingestConfiguration: S.optional(IngestConfiguration) }),
).annotations({
  identifier: "CreateIngestConfigurationResponse",
}) as any as S.Schema<CreateIngestConfigurationResponse>;
export interface CreateStageRequest {
  name?: string;
  participantTokenConfigurations?: ParticipantTokenConfiguration[];
  tags?: { [key: string]: string };
  autoParticipantRecordingConfiguration?: AutoParticipantRecordingConfiguration;
}
export const CreateStageRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    participantTokenConfigurations: S.optional(ParticipantTokenConfigurations),
    tags: S.optional(Tags),
    autoParticipantRecordingConfiguration: S.optional(
      AutoParticipantRecordingConfiguration,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateStage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateStageRequest",
}) as any as S.Schema<CreateStageRequest>;
export interface CreateStorageConfigurationResponse {
  storageConfiguration?: StorageConfiguration;
}
export const CreateStorageConfigurationResponse = S.suspend(() =>
  S.Struct({ storageConfiguration: S.optional(StorageConfiguration) }),
).annotations({
  identifier: "CreateStorageConfigurationResponse",
}) as any as S.Schema<CreateStorageConfigurationResponse>;
export interface GetEncoderConfigurationResponse {
  encoderConfiguration?: EncoderConfiguration;
}
export const GetEncoderConfigurationResponse = S.suspend(() =>
  S.Struct({ encoderConfiguration: S.optional(EncoderConfiguration) }),
).annotations({
  identifier: "GetEncoderConfigurationResponse",
}) as any as S.Schema<GetEncoderConfigurationResponse>;
export interface GetIngestConfigurationResponse {
  ingestConfiguration?: IngestConfiguration;
}
export const GetIngestConfigurationResponse = S.suspend(() =>
  S.Struct({ ingestConfiguration: S.optional(IngestConfiguration) }),
).annotations({
  identifier: "GetIngestConfigurationResponse",
}) as any as S.Schema<GetIngestConfigurationResponse>;
export interface GetParticipantResponse {
  participant?: Participant;
}
export const GetParticipantResponse = S.suspend(() =>
  S.Struct({ participant: S.optional(Participant) }),
).annotations({
  identifier: "GetParticipantResponse",
}) as any as S.Schema<GetParticipantResponse>;
export interface GetPublicKeyResponse {
  publicKey?: PublicKey;
}
export const GetPublicKeyResponse = S.suspend(() =>
  S.Struct({ publicKey: S.optional(PublicKey) }),
).annotations({
  identifier: "GetPublicKeyResponse",
}) as any as S.Schema<GetPublicKeyResponse>;
export interface GetStageSessionResponse {
  stageSession?: StageSession;
}
export const GetStageSessionResponse = S.suspend(() =>
  S.Struct({ stageSession: S.optional(StageSession) }),
).annotations({
  identifier: "GetStageSessionResponse",
}) as any as S.Schema<GetStageSessionResponse>;
export interface GetStorageConfigurationResponse {
  storageConfiguration?: StorageConfiguration;
}
export const GetStorageConfigurationResponse = S.suspend(() =>
  S.Struct({ storageConfiguration: S.optional(StorageConfiguration) }),
).annotations({
  identifier: "GetStorageConfigurationResponse",
}) as any as S.Schema<GetStorageConfigurationResponse>;
export interface ListEncoderConfigurationsResponse {
  encoderConfigurations: EncoderConfigurationSummary[];
  nextToken?: string;
}
export const ListEncoderConfigurationsResponse = S.suspend(() =>
  S.Struct({
    encoderConfigurations: EncoderConfigurationSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEncoderConfigurationsResponse",
}) as any as S.Schema<ListEncoderConfigurationsResponse>;
export interface ListIngestConfigurationsResponse {
  ingestConfigurations: IngestConfigurationSummary[];
  nextToken?: string;
}
export const ListIngestConfigurationsResponse = S.suspend(() =>
  S.Struct({
    ingestConfigurations: IngestConfigurationList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIngestConfigurationsResponse",
}) as any as S.Schema<ListIngestConfigurationsResponse>;
export interface ListParticipantReplicasResponse {
  replicas: ParticipantReplica[];
  nextToken?: string;
}
export const ListParticipantReplicasResponse = S.suspend(() =>
  S.Struct({
    replicas: ParticipantReplicaList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListParticipantReplicasResponse",
}) as any as S.Schema<ListParticipantReplicasResponse>;
export interface ListParticipantsResponse {
  participants: ParticipantSummary[];
  nextToken?: string;
}
export const ListParticipantsResponse = S.suspend(() =>
  S.Struct({ participants: ParticipantList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListParticipantsResponse",
}) as any as S.Schema<ListParticipantsResponse>;
export interface ListPublicKeysResponse {
  publicKeys: PublicKeySummary[];
  nextToken?: string;
}
export const ListPublicKeysResponse = S.suspend(() =>
  S.Struct({ publicKeys: PublicKeyList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListPublicKeysResponse",
}) as any as S.Schema<ListPublicKeysResponse>;
export interface ListStagesResponse {
  stages: StageSummary[];
  nextToken?: string;
}
export const ListStagesResponse = S.suspend(() =>
  S.Struct({ stages: StageSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListStagesResponse",
}) as any as S.Schema<ListStagesResponse>;
export interface ListStageSessionsResponse {
  stageSessions: StageSessionSummary[];
  nextToken?: string;
}
export const ListStageSessionsResponse = S.suspend(() =>
  S.Struct({
    stageSessions: StageSessionList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStageSessionsResponse",
}) as any as S.Schema<ListStageSessionsResponse>;
export interface ListStorageConfigurationsResponse {
  storageConfigurations: StorageConfigurationSummary[];
  nextToken?: string;
}
export const ListStorageConfigurationsResponse = S.suspend(() =>
  S.Struct({
    storageConfigurations: StorageConfigurationSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStorageConfigurationsResponse",
}) as any as S.Schema<ListStorageConfigurationsResponse>;
export interface DestinationSummary {
  id: string;
  state: string;
  startTime?: Date;
  endTime?: Date;
}
export const DestinationSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    state: S.String,
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "DestinationSummary",
}) as any as S.Schema<DestinationSummary>;
export type DestinationSummaryList = DestinationSummary[];
export const DestinationSummaryList = S.Array(DestinationSummary);
export interface ExchangedParticipantToken {
  capabilities?: string[];
  attributes?: { [key: string]: string };
  userId?: string;
  expirationTime?: Date;
}
export const ExchangedParticipantToken = S.suspend(() =>
  S.Struct({
    capabilities: S.optional(ParticipantTokenCapabilities),
    attributes: S.optional(ParticipantTokenAttributes),
    userId: S.optional(S.String),
    expirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ExchangedParticipantToken",
}) as any as S.Schema<ExchangedParticipantToken>;
export interface CompositionRecordingHlsConfiguration {
  targetSegmentDurationSeconds?: number;
}
export const CompositionRecordingHlsConfiguration = S.suspend(() =>
  S.Struct({ targetSegmentDurationSeconds: S.optional(S.Number) }),
).annotations({
  identifier: "CompositionRecordingHlsConfiguration",
}) as any as S.Schema<CompositionRecordingHlsConfiguration>;
export interface ParticipantToken {
  participantId?: string;
  token?: string | redacted.Redacted<string>;
  userId?: string;
  attributes?: { [key: string]: string };
  duration?: number;
  capabilities?: string[];
  expirationTime?: Date;
}
export const ParticipantToken = S.suspend(() =>
  S.Struct({
    participantId: S.optional(S.String),
    token: S.optional(SensitiveString),
    userId: S.optional(S.String),
    attributes: S.optional(ParticipantTokenAttributes),
    duration: S.optional(S.Number),
    capabilities: S.optional(ParticipantTokenCapabilities),
    expirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ParticipantToken",
}) as any as S.Schema<ParticipantToken>;
export type ParticipantTokenList = ParticipantToken[];
export const ParticipantTokenList = S.Array(ParticipantToken);
export interface CompositionSummary {
  arn: string;
  stageArn: string;
  destinations: DestinationSummary[];
  state: string;
  tags?: { [key: string]: string };
  startTime?: Date;
  endTime?: Date;
}
export const CompositionSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    stageArn: S.String,
    destinations: DestinationSummaryList,
    state: S.String,
    tags: S.optional(Tags),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CompositionSummary",
}) as any as S.Schema<CompositionSummary>;
export type CompositionSummaryList = CompositionSummary[];
export const CompositionSummaryList = S.Array(CompositionSummary);
export interface Event {
  name?: string;
  participantId?: string;
  eventTime?: Date;
  remoteParticipantId?: string;
  errorCode?: EventErrorCode;
  destinationStageArn?: string;
  destinationSessionId?: string;
  replica?: boolean;
  previousToken?: ExchangedParticipantToken;
  newToken?: ExchangedParticipantToken;
}
export const Event = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    participantId: S.optional(S.String),
    eventTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    remoteParticipantId: S.optional(S.String),
    errorCode: S.optional(EventErrorCode),
    destinationStageArn: S.optional(S.String),
    destinationSessionId: S.optional(S.String),
    replica: S.optional(S.Boolean),
    previousToken: S.optional(ExchangedParticipantToken),
    newToken: S.optional(ExchangedParticipantToken),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type EventList = Event[];
export const EventList = S.Array(Event);
export interface RecordingConfiguration {
  hlsConfiguration?: CompositionRecordingHlsConfiguration;
  format?: string;
}
export const RecordingConfiguration = S.suspend(() =>
  S.Struct({
    hlsConfiguration: S.optional(CompositionRecordingHlsConfiguration),
    format: S.optional(S.String),
  }),
).annotations({
  identifier: "RecordingConfiguration",
}) as any as S.Schema<RecordingConfiguration>;
export interface CreateParticipantTokenResponse {
  participantToken?: ParticipantToken;
}
export const CreateParticipantTokenResponse = S.suspend(() =>
  S.Struct({ participantToken: S.optional(ParticipantToken) }),
).annotations({
  identifier: "CreateParticipantTokenResponse",
}) as any as S.Schema<CreateParticipantTokenResponse>;
export interface CreateStageResponse {
  stage?: Stage;
  participantTokens?: ParticipantToken[];
}
export const CreateStageResponse = S.suspend(() =>
  S.Struct({
    stage: S.optional(Stage),
    participantTokens: S.optional(ParticipantTokenList),
  }),
).annotations({
  identifier: "CreateStageResponse",
}) as any as S.Schema<CreateStageResponse>;
export interface GetStageResponse {
  stage?: Stage;
}
export const GetStageResponse = S.suspend(() =>
  S.Struct({ stage: S.optional(Stage) }),
).annotations({
  identifier: "GetStageResponse",
}) as any as S.Schema<GetStageResponse>;
export interface ListCompositionsResponse {
  compositions: CompositionSummary[];
  nextToken?: string;
}
export const ListCompositionsResponse = S.suspend(() =>
  S.Struct({
    compositions: CompositionSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCompositionsResponse",
}) as any as S.Schema<ListCompositionsResponse>;
export interface ListParticipantEventsResponse {
  events: Event[];
  nextToken?: string;
}
export const ListParticipantEventsResponse = S.suspend(() =>
  S.Struct({ events: EventList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListParticipantEventsResponse",
}) as any as S.Schema<ListParticipantEventsResponse>;
export interface S3DestinationConfiguration {
  storageConfigurationArn: string;
  encoderConfigurationArns: string[];
  recordingConfiguration?: RecordingConfiguration;
  thumbnailConfigurations?: CompositionThumbnailConfiguration[];
}
export const S3DestinationConfiguration = S.suspend(() =>
  S.Struct({
    storageConfigurationArn: S.String,
    encoderConfigurationArns: EncoderConfigurationArnList,
    recordingConfiguration: S.optional(RecordingConfiguration),
    thumbnailConfigurations: S.optional(CompositionThumbnailConfigurationList),
  }),
).annotations({
  identifier: "S3DestinationConfiguration",
}) as any as S.Schema<S3DestinationConfiguration>;
export interface S3Detail {
  recordingPrefix: string;
}
export const S3Detail = S.suspend(() =>
  S.Struct({ recordingPrefix: S.String }),
).annotations({ identifier: "S3Detail" }) as any as S.Schema<S3Detail>;
export interface DestinationConfiguration {
  name?: string;
  channel?: ChannelDestinationConfiguration;
  s3?: S3DestinationConfiguration;
}
export const DestinationConfiguration = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    channel: S.optional(ChannelDestinationConfiguration),
    s3: S.optional(S3DestinationConfiguration),
  }),
).annotations({
  identifier: "DestinationConfiguration",
}) as any as S.Schema<DestinationConfiguration>;
export type DestinationConfigurationList = DestinationConfiguration[];
export const DestinationConfigurationList = S.Array(DestinationConfiguration);
export interface DestinationDetail {
  s3?: S3Detail;
}
export const DestinationDetail = S.suspend(() =>
  S.Struct({ s3: S.optional(S3Detail) }),
).annotations({
  identifier: "DestinationDetail",
}) as any as S.Schema<DestinationDetail>;
export interface StartCompositionRequest {
  stageArn: string;
  idempotencyToken?: string;
  layout?: LayoutConfiguration;
  destinations: DestinationConfiguration[];
  tags?: { [key: string]: string };
}
export const StartCompositionRequest = S.suspend(() =>
  S.Struct({
    stageArn: S.String,
    idempotencyToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    layout: S.optional(LayoutConfiguration),
    destinations: DestinationConfigurationList,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartComposition" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartCompositionRequest",
}) as any as S.Schema<StartCompositionRequest>;
export interface Destination {
  id: string;
  state: string;
  startTime?: Date;
  endTime?: Date;
  configuration: DestinationConfiguration;
  detail?: DestinationDetail;
}
export const Destination = S.suspend(() =>
  S.Struct({
    id: S.String,
    state: S.String,
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    configuration: DestinationConfiguration,
    detail: S.optional(DestinationDetail),
  }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export type DestinationList = Destination[];
export const DestinationList = S.Array(Destination);
export interface Composition {
  arn: string;
  stageArn: string;
  state: string;
  layout: LayoutConfiguration;
  destinations: Destination[];
  tags?: { [key: string]: string };
  startTime?: Date;
  endTime?: Date;
}
export const Composition = S.suspend(() =>
  S.Struct({
    arn: S.String,
    stageArn: S.String,
    state: S.String,
    layout: LayoutConfiguration,
    destinations: DestinationList,
    tags: S.optional(Tags),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "Composition" }) as any as S.Schema<Composition>;
export interface GetCompositionResponse {
  composition?: Composition;
}
export const GetCompositionResponse = S.suspend(() =>
  S.Struct({ composition: S.optional(Composition) }),
).annotations({
  identifier: "GetCompositionResponse",
}) as any as S.Schema<GetCompositionResponse>;
export interface StartCompositionResponse {
  composition?: Composition;
}
export const StartCompositionResponse = S.suspend(() =>
  S.Struct({ composition: S.optional(Composition) }),
).annotations({
  identifier: "StartCompositionResponse",
}) as any as S.Schema<StartCompositionResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    accessControlAllowOrigin: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Allow-Origin"),
    ),
    accessControlExposeHeaders: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Expose-Headers"),
    ),
    cacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    contentSecurityPolicy: S.optional(S.String).pipe(
      T.HttpHeader("Content-Security-Policy"),
    ),
    strictTransportSecurity: S.optional(S.String).pipe(
      T.HttpHeader("Strict-Transport-Security"),
    ),
    xContentTypeOptions: S.optional(S.String).pipe(
      T.HttpHeader("X-Content-Type-Options"),
    ),
    xFrameOptions: S.optional(S.String).pipe(T.HttpHeader("X-Frame-Options")),
    xAmznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
    exceptionMessage: S.optional(S.String),
  },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    accessControlAllowOrigin: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Allow-Origin"),
    ),
    accessControlExposeHeaders: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Expose-Headers"),
    ),
    cacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    contentSecurityPolicy: S.optional(S.String).pipe(
      T.HttpHeader("Content-Security-Policy"),
    ),
    strictTransportSecurity: S.optional(S.String).pipe(
      T.HttpHeader("Strict-Transport-Security"),
    ),
    xContentTypeOptions: S.optional(S.String).pipe(
      T.HttpHeader("X-Content-Type-Options"),
    ),
    xFrameOptions: S.optional(S.String).pipe(T.HttpHeader("X-Frame-Options")),
    xAmznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
    exceptionMessage: S.optional(S.String),
  },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    accessControlAllowOrigin: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Allow-Origin"),
    ),
    accessControlExposeHeaders: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Expose-Headers"),
    ),
    cacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    contentSecurityPolicy: S.optional(S.String).pipe(
      T.HttpHeader("Content-Security-Policy"),
    ),
    strictTransportSecurity: S.optional(S.String).pipe(
      T.HttpHeader("Strict-Transport-Security"),
    ),
    xContentTypeOptions: S.optional(S.String).pipe(
      T.HttpHeader("X-Content-Type-Options"),
    ),
    xFrameOptions: S.optional(S.String).pipe(T.HttpHeader("X-Frame-Options")),
    xAmznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
    exceptionMessage: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    accessControlAllowOrigin: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Allow-Origin"),
    ),
    accessControlExposeHeaders: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Expose-Headers"),
    ),
    cacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    contentSecurityPolicy: S.optional(S.String).pipe(
      T.HttpHeader("Content-Security-Policy"),
    ),
    strictTransportSecurity: S.optional(S.String).pipe(
      T.HttpHeader("Strict-Transport-Security"),
    ),
    xContentTypeOptions: S.optional(S.String).pipe(
      T.HttpHeader("X-Content-Type-Options"),
    ),
    xFrameOptions: S.optional(S.String).pipe(T.HttpHeader("X-Frame-Options")),
    xAmznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
    exceptionMessage: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class PendingVerification extends S.TaggedError<PendingVerification>()(
  "PendingVerification",
  {
    accessControlAllowOrigin: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Allow-Origin"),
    ),
    accessControlExposeHeaders: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Expose-Headers"),
    ),
    cacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    contentSecurityPolicy: S.optional(S.String).pipe(
      T.HttpHeader("Content-Security-Policy"),
    ),
    strictTransportSecurity: S.optional(S.String).pipe(
      T.HttpHeader("Strict-Transport-Security"),
    ),
    xContentTypeOptions: S.optional(S.String).pipe(
      T.HttpHeader("X-Content-Type-Options"),
    ),
    xFrameOptions: S.optional(S.String).pipe(T.HttpHeader("X-Frame-Options")),
    xAmznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
    exceptionMessage: S.optional(S.String),
  },
).pipe(C.withAuthError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    accessControlAllowOrigin: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Allow-Origin"),
    ),
    accessControlExposeHeaders: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Expose-Headers"),
    ),
    cacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    contentSecurityPolicy: S.optional(S.String).pipe(
      T.HttpHeader("Content-Security-Policy"),
    ),
    strictTransportSecurity: S.optional(S.String).pipe(
      T.HttpHeader("Strict-Transport-Security"),
    ),
    xContentTypeOptions: S.optional(S.String).pipe(
      T.HttpHeader("X-Content-Type-Options"),
    ),
    xFrameOptions: S.optional(S.String).pipe(T.HttpHeader("X-Frame-Options")),
    xAmznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
    exceptionMessage: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    accessControlAllowOrigin: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Allow-Origin"),
    ),
    accessControlExposeHeaders: S.optional(S.String).pipe(
      T.HttpHeader("Access-Control-Expose-Headers"),
    ),
    cacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    contentSecurityPolicy: S.optional(S.String).pipe(
      T.HttpHeader("Content-Security-Policy"),
    ),
    strictTransportSecurity: S.optional(S.String).pipe(
      T.HttpHeader("Strict-Transport-Security"),
    ),
    xContentTypeOptions: S.optional(S.String).pipe(
      T.HttpHeader("X-Content-Type-Options"),
    ),
    xFrameOptions: S.optional(S.String).pipe(T.HttpHeader("X-Frame-Options")),
    xAmznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
    exceptionMessage: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists all IngestConfigurations in your account, in the AWS region where the API request is processed.
 */
export const listIngestConfigurations: {
  (
    input: ListIngestConfigurationsRequest,
  ): effect.Effect<
    ListIngestConfigurationsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIngestConfigurationsRequest,
  ) => stream.Stream<
    ListIngestConfigurationsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIngestConfigurationsRequest,
  ) => stream.Stream<
    IngestConfigurationSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIngestConfigurationsRequest,
  output: ListIngestConfigurationsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "ingestConfigurations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists events for a specified participant that occurred during a specified stage
 * session.
 */
export const listParticipantEvents: {
  (
    input: ListParticipantEventsRequest,
  ): effect.Effect<
    ListParticipantEventsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListParticipantEventsRequest,
  ) => stream.Stream<
    ListParticipantEventsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListParticipantEventsRequest,
  ) => stream.Stream<
    unknown,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListParticipantEventsRequest,
  output: ListParticipantEventsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets summary information about all storage configurations in your account,
 * in the AWS region where the API request is processed.
 */
export const listStorageConfigurations: {
  (
    input: ListStorageConfigurationsRequest,
  ): effect.Effect<
    ListStorageConfigurationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStorageConfigurationsRequest,
  ) => stream.Stream<
    ListStorageConfigurationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStorageConfigurationsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStorageConfigurationsRequest,
  output: ListStorageConfigurationsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Import a public key to be used for signing stage participant tokens.
 */
export const importPublicKey: (
  input: ImportPublicKeyRequest,
) => effect.Effect<
  ImportPublicKeyResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportPublicKeyRequest,
  output: ImportPublicKeyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Starts replicating a publishing participant from a source stage to a destination stage.
 */
export const startParticipantReplication: (
  input: StartParticipantReplicationRequest,
) => effect.Effect<
  StartParticipantReplicationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | PendingVerification
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartParticipantReplicationRequest,
  output: StartParticipantReplicationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    PendingVerification,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Updates a stage’s configuration.
 */
export const updateStage: (
  input: UpdateStageRequest,
) => effect.Effect<
  UpdateStageResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStageRequest,
  output: UpdateStageResponse,
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
 * Deletes the storage configuration for the specified ARN.
 *
 * If you try to delete a storage configuration that is used by a Composition, you will get an error (409 ConflictException).
 * To avoid this, for all Compositions that reference the storage configuration, first use StopComposition and wait for it to complete,
 * then use DeleteStorageConfiguration.
 */
export const deleteStorageConfiguration: (
  input: DeleteStorageConfigurationRequest,
) => effect.Effect<
  DeleteStorageConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStorageConfigurationRequest,
  output: DeleteStorageConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Stops and deletes a Composition resource. Any broadcast from the Composition resource
 * is stopped.
 */
export const stopComposition: (
  input: StopCompositionRequest,
) => effect.Effect<
  StopCompositionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopCompositionRequest,
  output: StopCompositionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an EncoderConfiguration object.
 */
export const createEncoderConfiguration: (
  input: CreateEncoderConfigurationRequest,
) => effect.Effect<
  CreateEncoderConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | PendingVerification
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEncoderConfigurationRequest,
  output: CreateEncoderConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    PendingVerification,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new storage configuration, used to enable recording to Amazon S3.
 * When a StorageConfiguration is created, IVS will modify the S3 bucketPolicy of the provided bucket.
 * This will ensure that IVS has sufficient permissions to write content to the provided bucket.
 */
export const createStorageConfiguration: (
  input: CreateStorageConfigurationRequest,
) => effect.Effect<
  CreateStorageConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | PendingVerification
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStorageConfigurationRequest,
  output: CreateStorageConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    PendingVerification,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Deletes an EncoderConfiguration resource. Ensures that no Compositions are using this
 * template; otherwise, returns an error.
 */
export const deleteEncoderConfiguration: (
  input: DeleteEncoderConfigurationRequest,
) => effect.Effect<
  DeleteEncoderConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEncoderConfigurationRequest,
  output: DeleteEncoderConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified EncoderConfiguration resource.
 */
export const getEncoderConfiguration: (
  input: GetEncoderConfigurationRequest,
) => effect.Effect<
  GetEncoderConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEncoderConfigurationRequest,
  output: GetEncoderConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Gets the storage configuration for the specified ARN.
 */
export const getStorageConfiguration: (
  input: GetStorageConfigurationRequest,
) => effect.Effect<
  GetStorageConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStorageConfigurationRequest,
  output: GetStorageConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new IngestConfiguration resource, used to specify the ingest protocol for a stage.
 */
export const createIngestConfiguration: (
  input: CreateIngestConfigurationRequest,
) => effect.Effect<
  CreateIngestConfigurationResponse,
  | AccessDeniedException
  | PendingVerification
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIngestConfigurationRequest,
  output: CreateIngestConfigurationResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an additional token for a specified stage. This can be done after stage creation
 * or when tokens expire. Tokens always are scoped to the stage for which they are
 * created.
 *
 * Encryption keys are owned by Amazon IVS and never used directly by your
 * application.
 */
export const createParticipantToken: (
  input: CreateParticipantTokenRequest,
) => effect.Effect<
  CreateParticipantTokenResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateParticipantTokenRequest,
  output: CreateParticipantTokenResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new stage (and optionally participant tokens).
 */
export const createStage: (
  input: CreateStageRequest,
) => effect.Effect<
  CreateStageResponse,
  | AccessDeniedException
  | PendingVerification
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStageRequest,
  output: CreateStageResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Gets summary information about all Compositions in your account, in the AWS region
 * where the API request is processed.
 */
export const listCompositions: {
  (
    input: ListCompositionsRequest,
  ): effect.Effect<
    ListCompositionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCompositionsRequest,
  ) => stream.Stream<
    ListCompositionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCompositionsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCompositionsRequest,
  output: ListCompositionsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all the replicas for a participant from a source stage.
 */
export const listParticipantReplicas: {
  (
    input: ListParticipantReplicasRequest,
  ): effect.Effect<
    ListParticipantReplicasResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListParticipantReplicasRequest,
  ) => stream.Stream<
    ListParticipantReplicasResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListParticipantReplicasRequest,
  ) => stream.Stream<
    ParticipantReplica,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListParticipantReplicasRequest,
  output: ListParticipantReplicasResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "replicas",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all participants in a specified stage session.
 */
export const listParticipants: {
  (
    input: ListParticipantsRequest,
  ): effect.Effect<
    ListParticipantsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListParticipantsRequest,
  ) => stream.Stream<
    ListParticipantsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListParticipantsRequest,
  ) => stream.Stream<
    unknown,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListParticipantsRequest,
  output: ListParticipantsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets summary information about all public keys in your account, in the AWS region where the API request is processed.
 */
export const listPublicKeys: {
  (
    input: ListPublicKeysRequest,
  ): effect.Effect<
    ListPublicKeysResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPublicKeysRequest,
  ) => stream.Stream<
    ListPublicKeysResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPublicKeysRequest,
  ) => stream.Stream<
    PublicKeySummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPublicKeysRequest,
  output: ListPublicKeysResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "publicKeys",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets summary information about all stages in your account, in the AWS region where the
 * API request is processed.
 */
export const listStages: {
  (
    input: ListStagesRequest,
  ): effect.Effect<
    ListStagesResponse,
    | AccessDeniedException
    | ConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStagesRequest,
  ) => stream.Stream<
    ListStagesResponse,
    | AccessDeniedException
    | ConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStagesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStagesRequest,
  output: ListStagesResponse,
  errors: [AccessDeniedException, ConflictException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets all sessions for a specified stage.
 */
export const listStageSessions: {
  (
    input: ListStageSessionsRequest,
  ): effect.Effect<
    ListStageSessionsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStageSessionsRequest,
  ) => stream.Stream<
    ListStageSessionsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStageSessionsRequest,
  ) => stream.Stream<
    unknown,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStageSessionsRequest,
  output: ListStageSessionsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds or updates tags for the AWS resource with the specified ARN.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
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
 * Disconnects a specified participant from a specified stage. If the participant is publishing using
 * an IngestConfiguration, DisconnectParticipant also updates the `stageArn`
 * in the IngestConfiguration to be an empty string.
 */
export const disconnectParticipant: (
  input: DisconnectParticipantRequest,
) => effect.Effect<
  DisconnectParticipantResponse,
  | AccessDeniedException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisconnectParticipantRequest,
  output: DisconnectParticipantResponse,
  errors: [
    AccessDeniedException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a specified IngestConfiguration. Only the stage ARN attached to the IngestConfiguration can be updated. An IngestConfiguration that is active cannot be updated.
 */
export const updateIngestConfiguration: (
  input: UpdateIngestConfigurationRequest,
) => effect.Effect<
  UpdateIngestConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIngestConfigurationRequest,
  output: UpdateIngestConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a specified IngestConfiguration, so it can no longer be used to broadcast. An IngestConfiguration cannot be deleted if the publisher is actively streaming to a stage, unless `force` is set to `true`.
 */
export const deleteIngestConfiguration: (
  input: DeleteIngestConfigurationRequest,
) => effect.Effect<
  DeleteIngestConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIngestConfigurationRequest,
  output: DeleteIngestConfigurationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified public key used to sign stage participant tokens.
 * This invalidates future participant tokens generated using the key pair’s private key.
 */
export const deletePublicKey: (
  input: DeletePublicKeyRequest,
) => effect.Effect<
  DeletePublicKeyResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePublicKeyRequest,
  output: DeletePublicKeyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Shuts down and deletes the specified stage (disconnecting all participants). This operation also
 * removes the `stageArn` from the associated IngestConfiguration, if there are participants
 * using the IngestConfiguration to publish to the stage.
 */
export const deleteStage: (
  input: DeleteStageRequest,
) => effect.Effect<
  DeleteStageResponse,
  | AccessDeniedException
  | ConflictException
  | PendingVerification
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStageRequest,
  output: DeleteStageResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    PendingVerification,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes tags from the resource with the specified ARN.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
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
) => effect.Effect<
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
 * Stops a replicated participant session.
 */
export const stopParticipantReplication: (
  input: StopParticipantReplicationRequest,
) => effect.Effect<
  StopParticipantReplicationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopParticipantReplicationRequest,
  output: StopParticipantReplicationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified IngestConfiguration.
 */
export const getIngestConfiguration: (
  input: GetIngestConfigurationRequest,
) => effect.Effect<
  GetIngestConfigurationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIngestConfigurationRequest,
  output: GetIngestConfigurationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified participant token.
 */
export const getParticipant: (
  input: GetParticipantRequest,
) => effect.Effect<
  GetParticipantResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetParticipantRequest,
  output: GetParticipantResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information for the specified public key.
 */
export const getPublicKey: (
  input: GetPublicKeyRequest,
) => effect.Effect<
  GetPublicKeyResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPublicKeyRequest,
  output: GetPublicKeyResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information for the specified stage session.
 */
export const getStageSession: (
  input: GetStageSessionRequest,
) => effect.Effect<
  GetStageSessionResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStageSessionRequest,
  output: GetStageSessionResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information for the specified stage.
 */
export const getStage: (
  input: GetStageRequest,
) => effect.Effect<
  GetStageResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStageRequest,
  output: GetStageResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets summary information about all EncoderConfigurations in your account, in the AWS
 * region where the API request is processed.
 */
export const listEncoderConfigurations: {
  (
    input: ListEncoderConfigurationsRequest,
  ): effect.Effect<
    ListEncoderConfigurationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEncoderConfigurationsRequest,
  ) => stream.Stream<
    ListEncoderConfigurationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEncoderConfigurationsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ServiceQuotaExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEncoderConfigurationsRequest,
  output: ListEncoderConfigurationsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get information about the specified Composition resource.
 */
export const getComposition: (
  input: GetCompositionRequest,
) => effect.Effect<
  GetCompositionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCompositionRequest,
  output: GetCompositionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Starts a Composition from a stage based on the configuration provided in the
 * request.
 *
 * A Composition is an ephemeral resource that exists after this operation returns
 * successfully. Composition stops and the resource is deleted:
 *
 * - When StopComposition is called.
 *
 * - After a 1-minute timeout, when all participants are disconnected from the
 * stage.
 *
 * - After a 1-minute timeout, if there are no participants in the stage when
 * StartComposition is called.
 *
 * - When broadcasting to the IVS channel fails and all retries are exhausted.
 *
 * - When broadcasting is disconnected and all attempts to reconnect are
 * exhausted.
 */
export const startComposition: (
  input: StartCompositionRequest,
) => effect.Effect<
  StartCompositionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | PendingVerification
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCompositionRequest,
  output: StartCompositionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    PendingVerification,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
